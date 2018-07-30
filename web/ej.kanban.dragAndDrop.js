var InternalDragAndDrop = (function () {
    function InternalDragAndDrop(element) {
        this.kanbanObj = null;
        this._dragEle = null;
        this._dropEle = null;
        this._dropTarget = null;
        this.kanbanObj = element;
    }
    ;
    InternalDragAndDrop.prototype._addDragableClass = function () {
        var kObj = this.kanbanObj;
        kObj._dropped = false;
        this._dragEle = kObj.getContent().find(".e-columnrow td.e-drag .e-kanbancard");
        this._dropEle = kObj.getContent().find(".e-columnrow .e-rowcell.e-drop");
        this._dropEle.addClass("e-droppable");
        this._dragEle.addClass("e-draggable e-droppable");
        this._enableDragDrop();
        kObj._on(kObj.element, "mouseup touchstart pointerdown MSPointerDown", "", $.proxy(kObj.element.focus(), this));
    };
    InternalDragAndDrop.prototype._enableDragDrop = function () {
        var kObj = this.kanbanObj;
        this._drag();
        if (!kObj.model.allowExternalDragAndDrop) {
            $(kObj.getContent()).ejDroppable({
                accept: $(kObj.getContent()).find("div.e-kanbancard"),
                drop: function (event, ui) {
                    $(ui.helper).hide();
                }
            });
        }
    };
    InternalDragAndDrop.prototype._selectedPrevCurrentCards = function () {
        var prevCard, curCard, kObj = this.kanbanObj;
        if (kObj._previousRowCellIndex.length > 0) {
            prevCard = kObj.KanbanCommon._getCardbyIndexes(kObj._previousRowCellIndex);
            kObj._pCardId = prevCard.attr('id');
        }
        kObj._previousRowCellIndex = kObj._currentRowCellIndex;
        kObj._pCardId = kObj._cCardId;
        if (kObj._currentRowCellIndex.length > 0) {
            curCard = kObj.KanbanCommon._getCardbyIndexes(kObj._currentRowCellIndex);
            kObj._cCardId = curCard.attr('id');
        }
    };
    InternalDragAndDrop.prototype._getPriorityIndex = function (element) {
        var dropData = null, index, kObj = this.kanbanObj;
        ;
        for (var i = 0; i < kObj._priorityCollection.length; i++) {
            if (kObj._priorityCollection[i].primaryKey == element.attr('id')) {
                dropData = kObj._priorityCollection[i];
                break;
            }
        }
        if (!ej.isNullOrUndefined(dropData))
            index = parseInt(dropData["dropKey"]);
        else
            index = this._getPriorityKey(element.attr('id'));
        return index;
    };
    InternalDragAndDrop.prototype._removeFromPriorirtyCollec = function (cardId) {
        var dRemoveIndex = null, kObj = this.kanbanObj;
        for (var i = 0; i < kObj._priorityCollection.length; i++) {
            if (kObj._priorityCollection[i].primaryKey == cardId) {
                dRemoveIndex = i;
                break;
            }
        }
        if (!ej.isNullOrUndefined(dRemoveIndex))
            kObj._priorityCollection.splice(dRemoveIndex, 1);
    };
    InternalDragAndDrop.prototype._columnDataOndrop = function (target, prKey) {
        var kObj = this.kanbanObj, editingManager = new ej.DataManager(kObj._initialData), data, key, swimlane, cText, sText, queryManager = new ej.Query();
        key = kObj.model.keyField, swimlane = kObj.model.fields.swimlaneKey;
        if ($(target).hasClass('e-rowcell'))
            cText = $(target).attr('data-ej-mappingkey');
        else
            cText = $(target).parents('.e-rowcell').attr('data-ej-mappingkey');
        sText = $(target).parents('.e-columnrow').prev('.e-swimlanerow').find('.e-slkey').text();
        if (!ej.isNullOrUndefined(swimlane))
            queryManager = queryManager.where(key, ej.FilterOperators.equal, cText).where(swimlane, ej.FilterOperators.equal, sText);
        else
            queryManager = queryManager.where(key, ej.FilterOperators.equal, cText);
        data = editingManager.executeLocal(queryManager);
        data.sort(function (val1, val2) {
            return val1[prKey] - val2[prKey];
        });
        return data;
    };
    InternalDragAndDrop.prototype._dropToColumn = function (target, element) {
        var kObj = this.kanbanObj, lastDrpIndex, eleDrpIndex, trgtColData = [], pCheck = false, prKey = kObj.model.fields.priority, filter, selEle;
        var sibling = target.parent().has(element).length;
        if (!ej.isNullOrUndefined(kObj._filterToolBar))
            filter = kObj._filterToolBar.find('.e-select');
        if (target.hasClass('e-targetclone'))
            target = target.parent();
        if (target.hasClass('e-columnkey'))
            target = target.parent().parent();
        this._selectedPrevCurrentCards();
        if (prKey && ((!ej.isNullOrUndefined(kObj._filterToolBar) && filter.length > 0) || (kObj._searchBar != null && kObj._searchBar.find(".e-cancel").length > 0))) {
            trgtColData = this._columnDataOndrop(target, prKey);
            pCheck = trgtColData.length > 0;
        }
        else
            pCheck = $(target).children('.e-kanbancard').length > 1;
        selEle = this._getSelectedCards(element);
        if (kObj.model.selectionType == "multiple" && selEle.length > 0 && $(element).hasClass('e-cardselection'))
            element = selEle;
        for (var i = 0; i < element.length; i++) {
            var ele = element[i];
            for (var l = 0; l < $(ele).length; l++) {
                var card = $(ele)[l];
                if ($(card).is(':visible')) {
                    if (prKey && pCheck) {
                        if ((!ej.isNullOrUndefined(kObj._filterToolBar) && filter.length > 0) || (kObj._searchBar != null && kObj._searchBar.find(".e-cancel").length > 0))
                            lastDrpIndex = trgtColData[trgtColData.length - 1][prKey];
                        else
                            lastDrpIndex = this._getPriorityIndex(target.find('.e-kanbancard').last());
                        eleDrpIndex = this._getPriorityIndex($(card));
                        if (lastDrpIndex >= eleDrpIndex)
                            eleDrpIndex = ++lastDrpIndex;
                        this._removeFromPriorirtyCollec($(card).attr('id'));
                        kObj._priorityCollection.push({ primaryKey: $(card).attr('id'), dropKey: eleDrpIndex });
                        var data = kObj.KanbanCommon._getKanbanCardData(kObj._currentJsonData, $(card)[0].id)[0];
                        if (!ej.isNullOrUndefined(eleDrpIndex)) {
                            data[prKey] = eleDrpIndex;
                            trgtColData.push(data);
                        }
                    }
                    if ($(target).find(".e-customaddbutton").length > 0) {
                        $(card).insertBefore($(target).find(".e-customaddbutton"));
                    }
                    else {
                        if (kObj.element.hasClass('e-responsive')) {
                            var scroller = target.find('.e-cell-scrollcontent');
                            if (scroller.length > 0)
                                scroller.children().append(card);
                            else
                                $(target).append(card);
                        }
                        else
                            $(target).append(card);
                    }
                }
            }
        }
        this._updateDropAction(target, element);
        if (sibling == 0 && !ej.isNullOrUndefined(kObj.model.fields.swimlaneKey) && kObj.model.swimlaneSettings.allowDragAndDrop)
            kObj.refresh(true);
    };
    InternalDragAndDrop.prototype._updateDropAction = function (trgt, ele) {
        var trgtTd, kObj = this._externalDrop ? this._externalObj : this.kanbanObj, rowCell;
        trgtTd = $(trgt).hasClass('e-rowcell') ? trgt : $(trgt).closest("td.e-rowcell");
        kObj._selectedCardData = [];
        for (var c = 0; c < ele.length; c++) {
            var cardId, card;
            if (ej.isNullOrUndefined(ele[c].length)) {
                if ($(ele[c]).is(':visible') || !ej.isNullOrUndefined(kObj.model.fields.collapsibleCards) || ($(trgt).hasClass("e-hide") && kObj.model.contextMenuSettings.enable)) {
                    cardId = $(ele[c]).attr('id');
                    this._updateDropData(trgt, ele[c], cardId);
                    card = kObj.element.find("#" + cardId);
                    rowCell = card.parents('.e-rowcell');
                    if (card.parents('.e-rowcell').hasClass('e-shrink'))
                        card.addClass('e-hide');
                    var count = parseInt(rowCell.find(".e-shrinkcount").html());
                    rowCell.find(".e-shrinkcount").html(++count);
                }
            }
            else {
                for (var k = 0; k < ele[c].length; k++) {
                    if ($(ele[c][k]).is(':visible') || ($(trgt).hasClass("e-hide") && kObj.model.contextMenuSettings.enable)) {
                        cardId = ele[c][k].id;
                        this._updateDropData(trgt, ele[c][k], cardId);
                        card = kObj.element.find("#" + cardId);
                        rowCell = card.parents('.e-rowcell');
                        if (card.parents('.e-rowcell').hasClass('e-shrink'))
                            card.addClass('e-hide');
                        var count = parseInt(rowCell.find(".e-shrinkcount").html());
                        rowCell.find(".e-shrinkcount").html(++count);
                    }
                }
            }
        }
        if (kObj.model.fields.priority && kObj._priorityCollection.length > 0) {
            while (kObj._priorityCollection.length > 0) {
                var key = kObj._priorityCollection[0].primaryKey, card = kObj.element.find("#" + key);
                this._updateDropData(trgt, card, key);
            }
        }
        var args, prKeyValue = kObj._bulkUpdateData[0][kObj.model.fields.primaryKey];
        if (kObj._bulkUpdateData.length > 1)
            prKeyValue = "bulk";
        args = { data: kObj._bulkUpdateData, requestType: "drop", primaryKeyValue: prKeyValue };
        kObj._saveArgs = args;
        kObj.updateCard(prKeyValue, kObj._bulkUpdateData);
        if (!this._externalDrop && (kObj.model.allowSelection && !ej.isNullOrUndefined(ele[0].length) && ele[0].length > 1 || ele.length > 1 || (ele.length == 1 && $(ele).hasClass('e-cardselection')))) {
            kObj._previousRowCellIndex = (!ej.isNullOrUndefined(kObj._pCardId)) ? this._updateRowCellIndexes(kObj._pCardId, kObj._previousRowCellIndex) : [];
            kObj._currentRowCellIndex = (!ej.isNullOrUndefined(kObj._cCardId)) ? this._updateRowCellIndexes(kObj._cCardId, kObj._currentRowCellIndex) : [];
            kObj.KanbanSelection._selectionOnRerender();
            if (ej.isNullOrUndefined(kObj._pCardId))
                kObj._previousRowCellIndex = kObj._currentRowCellIndex;
            if (kObj.model.selectionType == "single")
                kObj.selectedRowCellIndexes = kObj._currentRowCellIndex;
            else
                kObj.KanbanSelection._updateSelectedCardIndexes(trgt);
        }
        kObj._priorityCollection = [];
    };
    InternalDragAndDrop.prototype._getPriorityKey = function (key) {
        var kObj = this._externalDrop ? this._externalObj : this.kanbanObj, kCard;
        kCard = kObj.KanbanCommon._getKanbanCardData(kObj._currentJsonData, key);
        if (kCard.length == 0)
            kCard = kObj.KanbanCommon._getKanbanCardData(this._externalData, key);
        return kCard[0][kObj.model.fields.priority];
    };
    InternalDragAndDrop.prototype._dropAsSibling = function (target, element, pre) {
        var kObj = this._externalDrop ? this._externalObj : this.kanbanObj, targetKey = 0, prevKey = 0, nextKey = 0, nextAll, prevAll, dropIndex, cards, initTarget, prevCard, nextCard, trgtColData = [], prCardId, prKey = kObj.model.fields.priority, filter, primeKey, selEle;
        var sibling = target.parent().has(element).length;
        if (!ej.isNullOrUndefined(kObj._filterToolBar))
            filter = kObj._filterToolBar.find('.e-select');
        primeKey = kObj.model.fields.primaryKey;
        this._selectedPrevCurrentCards();
        if (prKey && ((!ej.isNullOrUndefined(kObj._filterToolBar) && filter.length > 0) || (kObj._searchBar != null && kObj._searchBar.find(".e-cancel").length > 0)))
            trgtColData = this._columnDataOndrop(target, prKey);
        if ($(target).hasClass("e-targetclone")) {
            if (target.next().length == 0)
                $(target).addClass("e-targetappend");
            prevCard = $(target).prevAll('.e-kanbancard')[0];
            nextCard = $(target).nextAll('.e-kanbancard')[0];
            if (!ej.isNullOrUndefined(kObj.model.fields.collapsibleCards) && ej.isNullOrUndefined(prevCard)) {
                var tlcard = $(target).prevAll(".e-toggle-area").find(".e-kanbancard");
                var tlength = $(tlcard).length;
                prevCard = $(tlcard)[tlength - 1];
            }
            if ($(target).hasClass("e-targetappend")) {
                pre = true;
                target = prevCard;
                if (ej.isNullOrUndefined(target))
                    target = nextCard;
            }
            else {
                pre = false;
                target = nextCard;
                if (ej.isNullOrUndefined(target))
                    target = prevCard;
            }
        }
        initTarget = target;
        selEle = this._getSelectedCards(element);
        if (kObj.model.selectionType == "multiple" && selEle.length > 0 && $(element).hasClass('e-cardselection'))
            element = selEle;
        for (var i = 0; i < element.length; i++) {
            var ele = element[i];
            for (var l = 0; l < $(ele).length; l++) {
                var card = $(ele)[l];
                if ($(card).is(':visible')) {
                    if (pre) {
                        if (l > 0 && element[i][l - 1] != initTarget)
                            target = element[i][l - 1];
                        else if (l == 0 && i > 0 && element[i - 1] != initTarget)
                            target = element[i - 1];
                    }
                    if (card != initTarget) {
                        pre ? $(card).insertAfter(target) : $(card).insertBefore(target);
                        if (prKey && ((!ej.isNullOrUndefined(kObj._filterToolBar) && filter.length > 0) || (kObj._searchBar != null && kObj._searchBar.find(".e-cancel").length > 0))) {
                            var data, index, curIndex, addData;
                            data = kObj.KanbanCommon._getKanbanCardData(trgtColData, $(target).attr('id'));
                            index = trgtColData.indexOf(data[0]);
                            addData = kObj.KanbanCommon._getKanbanCardData(kObj._currentJsonData, $(card)[0].id);
                            if (data[0][kObj.model.keyField] == addData[0][kObj.model.keyField])
                                trgtColData.splice(trgtColData.indexOf(addData[0]), 1);
                            if (pre)
                                trgtColData.splice(index + 1, 0, addData[0]);
                            else
                                trgtColData.splice(index, 0, addData[0]);
                            prCardId = $(card)[0].id;
                        }
                    }
                    if (prKey) {
                        if (((!ej.isNullOrUndefined(kObj._filterToolBar) && filter.length > 0) || (kObj._searchBar != null && kObj._searchBar.find(".e-cancel").length > 0))) {
                            var tData = kObj.KanbanCommon._getKanbanCardData(trgtColData, $(target).attr('id'));
                            targetKey = tData[0][prKey];
                            tData = kObj.KanbanCommon._getKanbanCardData(trgtColData, prCardId);
                            cards = [];
                            for (var k = trgtColData.indexOf(tData[0]); k < trgtColData.length; k++) {
                                cards.push(trgtColData[k]);
                            }
                        }
                        else {
                            targetKey = this._getPriorityIndex($(target));
                            var nextCards = $(card).nextAll('.e-kanbancard');
                            cards = ej.isNullOrUndefined(nextCards["addBack"]) ? nextCards["andSelf"]() : nextCards["addBack"]();
                        }
                        for (var k = 0; k < cards.length; k++) {
                            var thisEle = cards[k];
                            if (((!ej.isNullOrUndefined(kObj._filterToolBar) && filter.length > 0) || (kObj._searchBar != null && kObj._searchBar.find(".e-cancel").length > 0))) {
                                var tData = null, index;
                                dropIndex = thisEle[prKey];
                                if (!pre && ($(card)[0].id == thisEle[primeKey]) && targetKey < dropIndex)
                                    dropIndex = targetKey;
                                tData = kObj.KanbanCommon._getKanbanCardData(trgtColData, thisEle[primeKey]);
                                index = curIndex = trgtColData.indexOf(tData[0]);
                                if (index - 1 >= 0)
                                    prevKey = trgtColData[index - 1][prKey];
                                tData = kObj.KanbanCommon._getKanbanCardData(trgtColData, thisEle[primeKey]);
                                index = curIndex = trgtColData.indexOf(tData[0]);
                                if (index + 1 < trgtColData.length) {
                                    nextKey = trgtColData[index + 1][prKey];
                                    nextAll = trgtColData[index + 1];
                                }
                                else
                                    nextAll = [];
                            }
                            else {
                                dropIndex = this._getPriorityKey($(thisEle).attr('id'));
                                if (!pre && ($(card)[0] == thisEle) && targetKey < dropIndex)
                                    dropIndex = targetKey;
                                prevAll = $(thisEle).prevAll('.e-kanbancard');
                                if (prevAll.length > 0)
                                    prevKey = this._getPriorityIndex(prevAll.eq(0));
                                nextAll = $(thisEle).nextAll('.e-kanbancard');
                                if (nextAll.length > 0)
                                    nextKey = this._getPriorityIndex(nextAll.eq(0));
                            }
                            if (!isNaN(prevKey) && prevKey < dropIndex && (dropIndex < nextKey || nextAll.length == 0))
                                break;
                            var c_Id;
                            if (((!ej.isNullOrUndefined(kObj._filterToolBar) && filter.length > 0) || (kObj._searchBar != null && kObj._searchBar.find(".e-cancel").length > 0))) {
                                if (!(!pre && $(card)[0].id == thisEle[primeKey]))
                                    dropIndex = ++targetKey;
                                else if (!(!pre && $(card)[0].id == thisEle[primeKey] && targetKey < dropIndex))
                                    dropIndex = targetKey;
                                trgtColData[curIndex][prKey] = dropIndex;
                                c_Id = thisEle[primeKey];
                            }
                            else {
                                if (!(!pre && $(card)[0] == thisEle))
                                    dropIndex = ++targetKey;
                                else if (!(!pre && $(card)[0] == thisEle && targetKey < dropIndex))
                                    dropIndex = targetKey;
                                c_Id = $(thisEle).attr('id');
                            }
                            this._removeFromPriorirtyCollec(c_Id);
                            kObj._priorityCollection.push({ primaryKey: c_Id, dropKey: dropIndex });
                            targetKey = dropIndex;
                        }
                    }
                }
            }
        }
        this._updateDropAction(target, element);
        this._dropTarget = null;
        if (sibling == 0 && !ej.isNullOrUndefined(kObj.model.fields.swimlaneKey) && kObj.model.swimlaneSettings.allowDragAndDrop)
            kObj.refresh(true);
    };
    InternalDragAndDrop.prototype._updateDropData = function (target, element, cardId) {
        var kObj = this._externalDrop ? this._externalObj : this.kanbanObj;
        if (!ej.isNullOrUndefined(kObj.model.fields.primaryKey)) {
            var targetTd, prKey, primeKey, tempCard = [], columnKey;
            prKey = kObj.model.fields.priority;
            primeKey = kObj.model.fields.primaryKey;
            if (ej.isNullOrUndefined(cardId))
                cardId = $(target).attr('id');
            if ($(target).hasClass('e-rowcell'))
                targetTd = $(target);
            else
                targetTd = $(target).parents(".e-rowcell");
            if (targetTd.index() < 0)
                targetTd = kObj.element.find("#" + $(target).attr('id')).parents(".e-rowcell");
            tempCard = $.extend(true, [], this.kanbanObj.KanbanCommon._getKanbanCardData(this.kanbanObj._currentJsonData, cardId));
            if (tempCard.length == 0 && this._externalDrop)
                tempCard = $.extend(true, [], kObj.KanbanCommon._getKanbanCardData(kObj._currentJsonData, cardId));
            var cKey = kObj.model.columns[targetTd.index()].key;
            columnKey = typeof (cKey) == "object" ? cKey : cKey.split(",");
            if (tempCard.length > 0) {
                var tempCardKey = tempCard[0][kObj.model.keyField];
                if ($(targetTd).find(".e-targetclonemulti").length > 0) {
                    var targetText = $(targetTd).find(".e-columnkey.e-active .e-text").eq(0).text();
                    if ((typeof (tempCardKey) != typeof (targetText)) && typeof (tempCardKey) == "number")
                        targetText = parseInt(targetText);
                    tempCard[0][kObj.model.keyField] = targetText;
                }
                else if (columnKey.length == 1) {
                    var columnKey = columnKey[0];
                    if ((typeof (tempCardKey) != typeof (columnKey)) && typeof (tempCardKey) == "number")
                        columnKey = parseInt(columnKey);
                    tempCard[0][kObj.model.keyField] = columnKey;
                }
                if (kObj.model.fields.swimlaneKey) {
                    var sKey = $(target).parents("tr.e-columnrow").prev().find("div.e-slkey").html();
                    if (!ej.isNullOrUndefined(sKey))
                        tempCard[0][kObj.model.fields.swimlaneKey] = sKey;
                    else
                        tempCard[0][kObj.model.fields.swimlaneKey] = kObj.element.find("#" + target.id).parents("tr.e-columnrow").prev().find("div.e-slkey").html();
                }
            }
            kObj._dropped = true;
            if (prKey && kObj._priorityCollection.length > 0) {
                var dropData, curData;
                for (var i = 0; i < kObj._priorityCollection.length; i++) {
                    if (kObj._priorityCollection[i].primaryKey == cardId) {
                        dropData = kObj._priorityCollection[i];
                        kObj._priorityCollection.splice(i, 1);
                        break;
                    }
                }
                if (!ej.isNullOrUndefined(dropData) && tempCard.length > 0)
                    tempCard[0][prKey] = dropData["dropKey"];
                if (!ej.isNullOrUndefined(kObj._filterToolBar) && kObj._filterToolBar.find('.e-select').length > 0 && !ej.isNullOrUndefined(dropData) || (kObj._searchBar != null && kObj._searchBar.find(".e-cancel").length > 0)) {
                    for (var k = 0; k < kObj._initialData.length; k++) {
                        if (dropData["primaryKey"] == kObj._initialData[k][primeKey]) {
                            if (tempCard.length > 0)
                                kObj._initialData[k] = tempCard[0];
                            else
                                kObj._initialData[k][prKey] = dropData["dropKey"];
                            curData = kObj._initialData[k];
                            break;
                        }
                    }
                }
            }
            if (tempCard.length > 0) {
                if ($(element).hasClass('e-cardselection')) {
                    for (var k = 0; k < kObj._selectedCardData.length; k++) {
                        if (tempCard[0][primeKey] == kObj._selectedCardData[k][primeKey])
                            break;
                    }
                    kObj._selectedCardData.splice(k, 1);
                    kObj._selectedCardData.push(tempCard[0]);
                }
                kObj._bulkUpdateData.push(tempCard[0]);
            }
            else if (prKey) {
                if (kObj.KanbanCommon._getKanbanCardData(kObj._bulkUpdateData, curData[primeKey])["length"] <= 0)
                    kObj._bulkUpdateData.push(curData);
            }
        }
    };
    InternalDragAndDrop.prototype._updateRowCellIndexes = function (id, indexes) {
        var row, column, ele = [];
        if (!ej.isNullOrUndefined(id)) {
            var card = this.kanbanObj.element.find('#' + id);
            row = $(card).parents('.e-columnrow');
            column = $(card).parents('.e-rowcell');
            ele.push([row.index(), [column.index()], [column.find('.e-kanbancard').index(column.find("#" + id))]]);
        }
        else
            ele = indexes;
        return ele;
    };
    InternalDragAndDrop.prototype._dragStop = function (args, clone, pre) {
        var proxy = this, eventArgs, dragColumn, dropColumn, trgtCloneMulti, selectedCards, parentRow, columns, clonedElement, kObj = this.kanbanObj, dragParent, dragParentIndex, istoggleKey = !ej.isNullOrUndefined(kObj.model.fields.collapsibleCards);
        if (!args.element.dropped)
            clone && clone.remove();
        args.target = this._getCursorElement(args);
        var target = $(args.target).closest(".e-kanbancard").length > 0 ? $(args.target).closest(".e-kanbancard")[0] : args.target;
        if (kObj.element.hasClass('e-responsive') && !$(target).hasClass('e-targetclone')) {
            var parent = $(target).parents(".e-rowcell");
            if (!$(target).hasClass("e-kanbancard") && $(target).parents(".e-kanbancard").length == 0 && parent.length > 0 && ($(target).parents(".e-kanbancard").is(":visible"))) {
                args.target = target = parent[0];
            }
        }
        parentRow = $(args.element).parents('.e-columnrow');
        var cheight = parentRow.find(target).parents('.e-rowcell').height() - kObj._tdHeightDiff;
        if (kObj._dataManager instanceof ej.DataManager && !kObj._dataManager.dataSource.offline) {
            dragColumn = kObj.element.find('.e-kanban-draggedcard').parents(".e-rowcell").index();
            dropColumn = kObj.element.find('.e-targetclone').parents(".e-rowcell").index();
            header = kObj.headerContent.find(".e-headercell");
            if (kObj.model.enableTotalCount && (kObj._filterCollection.length > 0 || kObj.model.searchSettings.key.length > 0)) {
                header.eq(dragColumn).addClass("e-card-dragged");
                header.eq(dropColumn).addClass("e-card-dropped");
            }
        }
        kObj.element.find('.e-kanban-draggedcard').removeClass('e-kanban-draggedcard');
        kObj.element.find('.e-targetdragclone').remove();
        proxy._dropEle.removeClass("e-dropping e-dragged e-dragpossible");
        kObj.element.find(".e-droppableremove").removeClass("e-droppableremove e-droppable");
        kObj.element.find(".e-dragpossible").removeClass("e-dragpossible e-drop");
        if (kObj.model.allowExternalDragAndDrop) {
            var exTarget = kObj.model.cardSettings.externalDropTarget, exParent = $(args.target).parents(exTarget);
            this._externalObj = $(exParent).data("ejKanban");
            $(exTarget).find(".e-rowcell.e-drag").removeClass('e-dropping e-dragged e-dragpossible');
            if (!ej.isNullOrUndefined(exTarget) && exParent.hasClass("e-kanban")) {
                this._externalDrop = true;
                this._externalData = [];
                var expKey, atualData, queryId, lastIdDm, id, count = 0;
                expKey = this._externalObj.model.fields.primaryKey;
                atualData = this._externalObj.getCurrentJsonData();
                this._externalObj.element.find(".e-rowcell.e-drag").removeClass('e-dropping e-dragpossible');
                if (kObj._dataSource() instanceof ej.DataManager) {
                    var deleteData = [], addData, editData;
                    for (var k = 0; k < args.dragData.length; k++) {
                        deleteData.push(args.dragData[k][0]);
                    }
                    kObj._saveArgs = args;
                    kObj.KanbanCommon._kbnBulkUpdate(addData, deleteData, editData);
                }
                for (var i = 0; i < args.dragData.length; i++) {
                    this._externalData.push(args.dragData[i][0]);
                    if (new ej.DataManager(atualData).executeLocal(new ej.Query().where(expKey, ej.FilterOperators.equal, args.dragData[i][0][expKey])).length > 0) {
                        if (count == 0) {
                            queryId = new ej.Query().sortByDesc(expKey).take(1);
                            lastIdDm = ej.DataManager(atualData).executeLocal(queryId);
                            id = args.dragData[i][0][expKey] = parseInt(lastIdDm[0][expKey]) + 1;
                        }
                        else
                            id = args.dragData[i][0][expKey] = parseInt(args.dragData[i - 1][0][expKey]) + 1;
                        if (kObj._selectedCards.length > 0)
                            $(kObj._selectedCards[i]).attr({ "id": id });
                        else
                            $(args.element).attr({ "id": id });
                        count++;
                    }
                }
            }
        }
        eventArgs = { data: args.dragData, draggedElement: args.dragEle, dropTarget: $(target), event: args.event };
        if (kObj._trigger('cardDragStop', eventArgs))
            return false;
        parentRow = $(args.element).parents('.e-columnrow');
        selectedCards = parentRow.find('.e-cardselection');
        columns = parentRow.find('.e-rowcell');
        if ($(args.target).parents(".e-targetclonemulti").length > 0)
            clonedElement = this._externalDrop ? $(exTarget).find('.e-targetclonemulti') : kObj.element.find('.e-targetclonemulti');
        else
            clonedElement = this._externalDrop ? $(exTarget).find('.e-targetclone') : kObj.element.find('.e-targetclone');
        dragParent = $(args.element).parents('.e-rowcell');
        dragParentIndex = kObj.element.find('.e-rowcell.e-drag').index(dragParent);
        var isAdd = $(target).parent().children().hasClass("e-customaddbutton"), isLimit = $(target).parent().children().hasClass("e-limits"), isToggle = $(target).parent().children().hasClass("e-shrinkheader"), child = $(target).parent().children();
        var toggle = isToggle ? (isAdd ? (isLimit ? child.length == 4 : child.length == 3) : isLimit ? child.length == 3 : child.length == 2) : isAdd ? (isLimit ? child.length == 3 : child.length == 2) : (isLimit ? child.length == 2 : child.length == 1);
        if (clonedElement.is(':visible') && document.body.style.cursor == '' && target.style.cursor == '') {
            if ($(target).parents(".e-targetclonemulti").length > 0)
                proxy._dropToColumn($(target).parents(".e-rowcell"), $(args.element));
            else if ((target.nodeName == "TD" && $(target).parent().hasClass("e-columnrow") && clonedElement.is(':visible')) || clonedElement.siblings().length <= 0 || toggle) {
                var lastEle, cEleSiblings, scroll = $(target).find('.e-cell-scrollcontent');
                if (scroll.length > 0)
                    lastEle = scroll.children().eq(0).children().last();
                else
                    lastEle = $(target).children().last();
                if (lastEle.hasClass('e-targetclone'))
                    lastEle = lastEle.prev();
                cEleSiblings = clonedElement.siblings().not('.e-shrinkheader').not('.e-customaddbutton').not('.e-limits');
                if ($(target).children().length == 0 || cEleSiblings.length <= 0 || (lastEle.hasClass('e-customaddbutton') && lastEle.prev().hasClass('e-targetclone')) || (!lastEle.hasClass('e-customaddbutton') && ($(lastEle).offset().top + $(lastEle).height() < $(clonedElement).offset().top))) {
                    if (lastEle.next().hasClass('e-targetclone') || cEleSiblings.length <= 0)
                        proxy._dropToColumn($(target), $(args.element));
                    else {
                        pre = false;
                        proxy._dropAsSibling($(clonedElement.next()), $(args.element), pre);
                    }
                }
            }
            else if (target.nodeName == "DIV" && ($(target).hasClass("e-kanbancard") || $(target).hasClass("e-targetclone"))) {
                if ($(target).hasClass("e-targetclone")) {
                    var parent = $(target).parents('.e-rowcell');
                    if ($(target).next().length == 0 && $(parent).find('.e-kanbancard').length == 0)
                        proxy._dropToColumn($(parent), $(args.element));
                    else
                        proxy._dropAsSibling($(target), $(args.element), pre);
                }
                else if (clonedElement.is(':visible') || selectedCards.length > 1)
                    proxy._dropAsSibling($(target), $(args.element), pre);
            }
            kObj._kbnBrowserContext = "contextmenu";
            if (this._externalDrop) {
                this._externalDrop = false;
                this._externalObj._bulkUpdateData = [];
                if (!(kObj._dataSource() instanceof ej.DataManager)) {
                    for (var k = 0; k < this._externalData.length; k++) {
                        var index = $.inArray(this._externalData[k], kObj._dataSource());
                        kObj._dataSource().splice(index, 1);
                    }
                }
                kObj.refresh(true);
            }
        }
        proxy._removeKanbanCursor();
        if (kObj.model.allowExternalDragAndDrop && !ej.isNullOrUndefined(this._externalObj) && this._externalObj.currentViewData.length == 0)
            this._externalObj.getContentTable().find('tbody').empty().first().append(this._externalObj.KanbanCommon._getEmptyTbody());
        if (kObj.element.hasClass('e-responsive'))
            kObj.element.parents('body').removeClass('e-kbnwindow-modal');
        kObj._autoKbnSwipeLeft = false;
        kObj._autoKbnSwipeRight = false;
        if (!this._externalDrop)
            kObj.element.find(".e-targetclone").remove();
        var tarketMultiClne = kObj.element.find(".e-targetclonemulti");
        if (tarketMultiClne.length > 0) {
            tarketMultiClne.parent().find(".e-kanbancard").show();
            if (!ej.isNullOrUndefined(tarketMultiClne.parent().find(".e-toggle-area")))
                tarketMultiClne.parent().find(".e-toggle-area").show();
            $(args.target).parents(".e-rowcell").css("border-style", "");
            if (kObj.element.find(".e-responsive"))
                tarketMultiClne.parent().find(".e-limits").show();
            tarketMultiClne.remove();
        }
        if ($(args.element)[0] != target)
            columns.height(cheight);
        kObj._on(kObj.element, "mouseenter mouseleave", ".e-columnrow .e-kanbancard", kObj._cardHover);
        $(clone).length > 0 && $(clone).remove();
        kObj._eventBindings();
        if (kObj.model.isResponsive)
            kObj.kanbanWindowResize();
        var draggedEle = kObj.element.find("#" + args.element.attr('id'));
        if ($(draggedEle).hasClass('e-cardselection'))
            draggedEle = $(draggedEle).parents('.e-columnrow').find('.e-cardselection:visible');
        if (kObj.KanbanAdaptive && kObj.element.hasClass('e-responsive') && !ej.isNullOrUndefined(kObj.model.fields.swimlaneKey))
            kObj.KanbanAdaptive._addSwimlaneName();
        dragParent = kObj.element.find('.e-rowcell.e-drag').eq(dragParentIndex);
        eventArgs.draggedElement = draggedEle;
        eventArgs.draggedParent = dragParent;
        eventArgs.data = kObj._bulkUpdateData;
        if (kObj.model.allowScrolling && !kObj.element.hasClass("e-responsive"))
            kObj.kanbanContent.data('ejScroller').refresh();
        if (kObj._trigger('cardDrop', eventArgs))
            return false;
        kObj._bulkUpdateData = [];
        var cells = dragParent.parent().find('.e-rowcell'), curDragParent = draggedEle.parents('.e-rowcell');
        if (kObj.model.isResponsive && kObj.element.hasClass('e-responsive') && curDragParent[0] != dragParent[0] && cells.index(curDragParent) != kObj._kbnSwipeCount) {
            if (cells.index(curDragParent) > cells.index(dragParent))
                kObj.KanbanAdaptive._kbnLeftSwipe();
            else
                kObj.KanbanAdaptive._kbnRightSwipe();
        }
        if (kObj.KanbanEdit && kObj.element.find(".e-form-container .e-disable").attr("value") == args.dragEle[0].id && kObj.element.find(".e-form-container").css("display") == "block" && (kObj.model.editSettings.editMode == "externalform" || kObj.model.editSettings.editMode == "externalformtemplate"))
            kObj.KanbanEdit.startEdit(args.dragEle);
        kObj.element.find('.e-togglevisible').removeClass('e-togglevisible');
        if (kObj.element.hasClass('e-responsive') && !ej.isNullOrUndefined(kObj.model.fields.swimlaneKey) && kObj._kbnAdaptDdlIndex > 0) {
            var scroller = kObj.kanbanContent.data('ejScroller'), rows, sTop = kObj._freezeScrollTop;
            rows = kObj.element[0].getElementsByClassName('e-columnrow');
            scroller.scrollY(0, true);
            kObj._freezeScrollTop = sTop;
            scroller.scrollY(kObj._freezeScrollTop, true);
        }
        if (istoggleKey == true) {
            if (this.KanbanScroll)
                this.kanbanObj.KanbanScroll._refreshScroller({ requestType: "refresh" });
        }
        return true;
    };
    InternalDragAndDrop.prototype._getCursorElement = function (e) {
        var tgtCl = $(e.target).closest(".dragClone"), evt = e.event;
        if (tgtCl.length > 0) {
            tgtCl.hide();
            if (evt.type == "touchmove" || evt.type == "touchstart" || evt.type == "touchend")
                e.target = document.elementFromPoint(evt.originalEvent.changedTouches[0].pageX, evt.originalEvent.changedTouches[0].pageY);
            else
                e.target = document.elementFromPoint(evt.clientX, evt.clientY);
            tgtCl.show();
        }
        return e.target;
    };
    InternalDragAndDrop.prototype._getSelectedCards = function (ele) {
        var kObj = this.kanbanObj;
        for (var i = 0; i < kObj._selectedCards.length; i++) {
            if ($(kObj._selectedCards[i]).length > 1) {
                for (var l = 0; l < kObj._selectedCards[i].length; l++) {
                    if ($(kObj._selectedCards[i][l])[0] == ele[0]) {
                        kObj._selectedCards[i].splice(l, 1);
                        kObj._selectedCards[i].splice(0, 0, ele[0]);
                        kObj._selectedCards.splice(0, 0, kObj._selectedCards[i]);
                        kObj._selectedCards.splice(i + 1, 1);
                    }
                }
            }
            else {
                if ($(kObj._selectedCards[i])[0] == ele[0]) {
                    kObj._selectedCards.splice(0, 0, kObj._selectedCards[i]);
                    kObj._selectedCards.splice(i + 1, 1);
                }
            }
        }
        ele = kObj._selectedCards;
        return ele;
    };
    InternalDragAndDrop.prototype._kanbanAutoScroll = function (args) {
        var proxy = this, trgtCloneMulti, kObj = this.kanbanObj;
        var scroller, scrollObj, _tDragLeft = null, _tDragRight = null, _tDragUp = null, _tDragDown = null, dCard = kObj.element.find('.e-draggedcard'), rowCell = kObj.element.find('.e-columnrow .e-rowcell');
        var kWidth, kLeft, kTop, cursorX, cursorY, hHandle, hDown, hUp, vHandle, vDown, vUp;
        if (!ej.isNullOrUndefined(args["event"].clientX))
            cursorX = args["event"].clientX;
        else
            cursorX = args["event"].originalEvent.changedTouches[0].clientX;
        if (!ej.isNullOrUndefined(args["event"].clientY))
            cursorY = args["event"].clientY;
        else
            cursorY = args["event"].originalEvent.changedTouches[0].clientY;
        kWidth = kObj.element.width();
        if (kObj.element.hasClass('e-responsive') && !kObj.element.hasClass('e-swimlane-responsive'))
            scroller = $(rowCell).eq(kObj._kbnSwipeCount).find('.e-cell-scrollcontent');
        else
            scroller = kObj.getContent();
        scrollObj = scroller.data("ejScroller");
        kLeft = kObj.element.offset().left, kTop = kObj.element.offset().top;
        hUp = scroller.find('.e-hup'), hDown = scroller.find('.e-hdown');
        vUp = scroller.find('.e-vup'), vDown = scroller.find('.e-vdown');
        hHandle = scroller.find('.e-hhandle.e-box'), vHandle = scroller.find('.e-vhandle.e-box');
        if (!kObj.element.hasClass('e-responsive') && kObj.model.allowScrolling) {
            if (cursorX > kLeft + kWidth - 10) {
                kObj.element.removeClass('e-view-horizontal');
                _tDragRight = window.setInterval(function () {
                    if (dCard.length <= 0 || (dCard.length > 0 && dCard.is(':hidden')))
                        _tDragRight && (_tDragRight = window.clearInterval(_tDragRight));
                    if ((hHandle.length > 0 && ((hHandle.width() + hHandle.offset().left) <= hDown.offset().left)) && !kObj.element.hasClass('e-view-horizontal'))
                        scrollObj.scrollX(scrollObj.scrollLeft() + 5, true);
                    else
                        _tDragRight && (_tDragRight = window.clearInterval(_tDragRight));
                }, 100);
            }
            else if (cursorX - 10 < kLeft) {
                kObj.element.removeClass('e-view-horizontal');
                if (scrollObj.scrollLeft() > 0) {
                    _tDragLeft = window.setInterval(function () {
                        if (dCard.length <= 0 || (dCard.length > 0 && dCard.is(':hidden')))
                            _tDragLeft && (_tDragLeft = window.clearInterval(_tDragLeft));
                        if (hHandle.offset().left >= (hUp.offset().left + hUp.width()) && !kObj.element.hasClass('e-view-horizontal')) {
                            scrollObj.scrollX(scrollObj.scrollLeft() - 5, true);
                        }
                        else
                            _tDragLeft && (_tDragLeft = window.clearInterval(_tDragLeft));
                    }, 100);
                }
            }
            else {
                kObj.element.addClass('e-view-horizontal');
                _tDragRight && (_tDragRight = window.clearInterval(_tDragRight));
                _tDragLeft && (_tDragLeft = window.clearInterval(_tDragLeft));
            }
        }
        if (!ej.isNullOrUndefined(scroller) && scroller.length > 0 && scroller.hasClass('e-scroller')) {
            if (cursorY > ((kTop + kObj.getHeaderContent().height()) + (scroller.height() - 60)) && vHandle.length > 0 && vDown.length > 0) {
                kObj.element.removeClass('e-view-vertical');
                _tDragDown = window.setInterval(function () {
                    if (dCard.length <= 0 || (dCard.length > 0 && dCard.is(':hidden')))
                        _tDragDown && (_tDragDown = window.clearInterval(_tDragDown));
                    if (vHandle.height() + vHandle.offset().top <= vDown.offset().top && !kObj.element.hasClass('e-view-vertical') && (scrollObj.scrollTop() < (kObj.kanbanContent.find('.e-table').height() - kObj.kanbanContent.height())))
                        scrollObj.scrollY(scrollObj.scrollTop() + 5, true);
                    else
                        _tDragDown && (_tDragDown = window.clearInterval(_tDragDown));
                }, 100);
            }
            else if (cursorY - 30 < kObj.element.find('.e-kanbancontent').offset().top && vHandle.length > 0 && vUp.length > 0) {
                if (scrollObj.scrollTop() > 0) {
                    kObj.element.removeClass('e-view-vertical');
                    _tDragUp = window.setInterval(function () {
                        _tDragDown && (_tDragDown = window.clearInterval(_tDragDown));
                        if (dCard.length <= 0 || (dCard.length > 0 && dCard.is(':hidden')))
                            _tDragUp && (_tDragDown = window.clearInterval(_tDragUp));
                        if (vHandle.offset().top >= vUp.offset().top + vUp.height() && !kObj.element.hasClass('e-view-vertical')) {
                            scrollObj.scrollY(scrollObj.scrollTop() - 5, true);
                        }
                        else
                            _tDragUp && (_tDragUp = window.clearInterval(_tDragUp));
                    }, 100);
                }
            }
            else {
                kObj.element.addClass('e-view-vertical');
                _tDragDown && (_tDragDown = window.clearInterval(_tDragDown));
                _tDragUp && (_tDragUp = window.clearInterval(_tDragUp));
            }
        }
    };
    InternalDragAndDrop.prototype._changeKanbanCursor = function (target, clonedElement, args) {
        var tParent = $(target).parents('.e-kanbancard'), isCard = $(target).hasClass('e-kanbancard'), clonedCard;
        if (tParent.length > 0 || isCard) {
            var trgt = isCard ? $(target) : tParent;
            trgt[0].style.cursor = 'not-allowed';
        }
        else if ($(target).hasClass('e-shrinkheader') || $(target).parents('.e-shrinkheader').length > 0 || $(target).hasClass('e-slexpandcollapse') || $(target).parents('.e-slexpandcollapse').length > 0) {
            var trgt = $(target);
            if ($(target).parents('.e-shrinkheader').length > 0)
                trgt = $(target).parents('.e-shrinkheader');
            else if ($(target).parents('.e-slexpandcollapse').length > 0)
                trgt = $(target).parents('.e-slexpandcollapse');
            trgt[0].style.cursor = 'not-allowed';
        }
        else if ($(target).hasClass('e-shrink'))
            $(target)[0].style.cursor = 'not-allowed';
        else if ($(target).parents('.e-columnrow').has(args.element).length == 0 || $(target).parents('.e-swimlanerow').length > 0 || $(target).hasClass('e-columnkey e-disable') || $(target).parents(".e-columnkey.e-disable").length > 0)
            document.body.style.cursor = 'not-allowed';
        else if ($(target).hasClass('e-rowcell'))
            $(target)[0].style.cursor = 'not-allowed';
        clonedCard = $(clonedElement).find('.e-kanbancard');
        if (clonedCard.length > 0)
            clonedCard[0].style.cursor = 'not-allowed';
    };
    InternalDragAndDrop.prototype._removeKanbanCursor = function () {
        document.body.style.cursor = '';
        this.kanbanObj.element.find('.e-kanbancard,.e-shrink,.e-shrinkheader,.e-slexpandcollapse,.e-rowcell').css('cursor', '');
    };
    InternalDragAndDrop.prototype._multicloneremove = function (dropTd, trgtCloneMulti) {
        if (dropTd.hasClass("e-rowcell")) {
            var kObj = this.kanbanObj;
            $(trgtCloneMulti).parents(".e-rowcell").css("border-style", "");
            $(trgtCloneMulti).siblings(".e-kanbancard").show();
            $(trgtCloneMulti).siblings(".e-targetdragclone").show();
            if (this._externalDrop ? this._externalObj.element.find(".e-responsive") : kObj.element.find(".e-responsive"))
                $(trgtCloneMulti).siblings(".e-limits").show();
            $(trgtCloneMulti).remove();
            trgtCloneMulti.children().remove();
        }
    };
    InternalDragAndDrop.prototype._multiKeyCardDrop = function (dropTd, keylength, trgtCloneMulti, targetKey, draggedEle) {
        if (this._externalDrop)
            var obj = this._externalObj;
        var kObj = this.kanbanObj;
        $(trgtCloneMulti).height(dropTd.height());
        dropTd.css("border-style", "none");
        dropTd.children().hide();
        if (this._externalDrop ? this._externalObj.element.find(".e-responsive") : kObj.element.find(".e-responsive"))
            dropTd.find(".e-limits").hide();
        dropTd.append(trgtCloneMulti);
        targetKey = typeof (targetKey) == "object" ? targetKey : targetKey.split(",");
        var draggedData = kObj.KanbanCommon._getKanbanCardData(kObj._currentJsonData, draggedEle.attr("id"));
        for (var i = 0; i < keylength; i++) {
            var targetcolumn = dropTd.find(".e-targetclonemulti");
            targetcolumn.append(ej.buildTag("div.e-columnkey"));
            var key = this._externalDrop ? obj.model.keyField : kObj.model.keyField;
            var trgetClmn = targetcolumn.find(".e-columnkey").eq(i).addClass(kObj.KanbanCommon._preventCardMove(draggedData[0][key], targetKey[i]) ? "" : "e-disable");
            trgetClmn.append(ej.buildTag("div.e-text").text(targetKey[i]));
            trgetClmn.css({ "height": (dropTd.height() / keylength) - (1 + (1 / keylength)) });
            trgetClmn.find(".e-text").css("top", trgetClmn.height() / 2 - trgetClmn.find(".e-text").height() / 2);
        }
    };
    InternalDragAndDrop.prototype._createCardClone = function (clonedElement, ele) {
        var kObj = this.kanbanObj, draggedEle;
        clonedElement = kObj.element.find('.e-draggedcard');
        if (clonedElement.length > 0)
            clonedElement.remove();
        if (!ej.isNullOrUndefined(ele) && $(ele).hasClass('e-draggable')) {
            clonedElement = ej.buildTag('div.e-draggedcard');
            clonedElement.addClass(kObj.model.cssClass);
            draggedEle = $(ele).clone().addClass("dragClone");
            $(clonedElement).css({ "width": ele.width() });
            clonedElement.append(draggedEle);
            $(clonedElement).find("div:first").removeClass("e-hover");
            clonedElement.appendTo(kObj.element);
        }
        return clonedElement;
    };
    InternalDragAndDrop.prototype._drag = function () {
        var proxy = this, trgtCloneMulti, clonedElement = null, draggedEle = null, dragContainment = null, prevTd = null, timeot = null, queryManager, pre, eventArgs, data = [], trgtClone, draggedCard, allowDrop, kObj = this.kanbanObj, istoggleKey = !ej.isNullOrUndefined(kObj.model.fields.collapsibleCards);
        if (kObj.element != null && !kObj.model.allowExternalDragAndDrop)
            dragContainment = kObj.getContent().find("div:first");
        $(kObj.getContent()).find(".e-rowcell.e-drag div.e-kanbancard").not(".e-js").ejDraggable({
            dragArea: dragContainment,
            clone: true,
            cursorAt: { left: -20, top: -20 },
            dragStart: function (args) {
                if (kObj.model.enableTouch && !ej.isNullOrUndefined(kObj._cardSelect) && kObj._cardSelect == 'touch')
                    return false;
                if (kObj.element.hasClass('e-responsive'))
                    kObj.element.parents('body').addClass('e-kbnwindow-modal');
                kObj._off(kObj.element, "mouseenter mouseleave", ".e-columnrow .e-kanbancard");
                draggedCard = kObj.element.find('.e-draggedcard');
                if ($(args.element).hasClass('e-cardselection'))
                    draggedEle = $(args.element).parents('.e-columnrow').find('.e-cardselection:visible');
                else
                    draggedEle = $(args.element);
                if (draggedEle.length > 1) {
                    var multiCloneDiv = ej.buildTag('div.e-dragmultiple');
                    multiCloneDiv.append(draggedEle.length + kObj.localizedLabels.Cards);
                    draggedCard.children().remove();
                    draggedCard.append(multiCloneDiv).css("width", "90px");
                }
                for (var i = 0; i < draggedEle.length; i++) {
                    var trgtDragClone = ej.buildTag('div.e-targetdragclone');
                    $(draggedEle).eq(i).after(trgtDragClone);
                    $(trgtDragClone).css({ "width": $(draggedEle).eq(i).width(), "height": $(draggedEle).eq(i).height() });
                    $(draggedEle).eq(i).addClass('e-kanban-draggedcard');
                }
                if (data.length != 0)
                    data = [];
                for (var i = 0; i < draggedEle.length; i++) {
                    if (draggedEle[i].id != "") {
                        queryManager = new ej.DataManager(kObj._currentJsonData);
                        data.push(queryManager.executeLocal(new ej.Query().where(kObj.model.fields.primaryKey, ej.FilterOperators.equal, draggedEle[i].id)));
                    }
                }
                if (proxy && !ej.isNullOrUndefined(args.target)) {
                    eventArgs = { draggedElement: draggedEle, dragTarget: args.target, data: data, event: args["event"] };
                    if (kObj._trigger("cardDragStart", eventArgs)) {
                        args.cancel = true;
                        clonedElement && clonedElement.remove();
                        return false;
                    }
                }
                else
                    return false;
                kObj._dropinside = typeof (eventArgs.allowInternalDrop) == "boolean" ? eventArgs.allowInternalDrop : false;
                return true;
            },
            drag: function (args) {
                var _tDragRight = null, _tDragLeft = null, dCard = kObj.element.find('.e-draggedcard');
                pre = false;
                kObj._cardSelect = null;
                kObj.element.find('.e-kanbantooltip').hide();
                dCard.addClass('e-left-rotatecard');
                if (!ej.isNullOrUndefined(args["event"].clientX))
                    kObj._kbnMouseX = args["event"].clientX;
                else
                    kObj._kbnMouseX = args["event"].originalEvent.changedTouches[0].clientX;
                $(".e-kanban-context").length > 0 && $(".e-kanban-context").css("visibility", "hidden");
                !ej.isNullOrUndefined(kObj._kTouchBar) && kObj._kTouchBar.hide();
                if (!kObj._autoKbnSwipeRight && kObj.element.hasClass('e-responsive')) {
                    if ((kObj.element.offset().left + kObj.element.width()) - 50 < kObj._kbnMouseX) {
                        _tDragRight = window.setInterval(function () {
                            if (dCard.is(':hidden'))
                                _tDragRight && (_tDragRight = window.clearInterval(_tDragRight));
                            else {
                                if (kObj.element.offset().left + kObj.element.width() < kObj._kbnMouseX)
                                    _tDragRight = window.clearInterval(_tDragRight);
                                else if (kObj.element.offset().left + kObj.element.width() - 50 < kObj._kbnMouseX)
                                    kObj.KanbanAdaptive._kbnLeftSwipe();
                                else
                                    _tDragRight && (_tDragRight = window.clearInterval(_tDragRight));
                            }
                        }, 1500);
                        kObj._autoKbnSwipeRight = true;
                        kObj._autoKbnSwipeLeft = false;
                    }
                }
                if (!kObj._autoKbnSwipeLeft && kObj.element.hasClass('e-responsive')) {
                    if (kObj.element.offset().left + 20 > kObj._kbnMouseX) {
                        _tDragLeft = window.setInterval(function () {
                            if (dCard.is(':hidden'))
                                _tDragLeft && (_tDragLeft = window.clearInterval(_tDragLeft));
                            else {
                                if (kObj.element.offset().left + 20 > kObj._kbnMouseX)
                                    kObj.KanbanAdaptive._kbnRightSwipe();
                                else
                                    _tDragLeft && (_tDragLeft = window.clearInterval(_tDragLeft));
                            }
                        }, 1500);
                        kObj._autoKbnSwipeLeft = true;
                        kObj._autoKbnSwipeRight = false;
                    }
                }
                if (kObj.model.allowScrolling || kObj.model.isResponsive)
                    proxy._kanbanAutoScroll(args);
                if ($(args.target).closest(".dragClone").length > 0) {
                    args.target = prevTd;
                    clearTimeout(timeot);
                    timeot = setTimeout(function () {
                        args.target = proxy._getCursorElement(args);
                    }, 10);
                }
                if ($(args.target).hasClass("e-emptycard") && kObj.model.allowExternalDragAndDrop && (kObj.model.cardSettings.externalDropTarget == ("#" + $(args.target).parents(".e-kanban").attr("id")))) {
                    this._externalObj = $(args.target).parents(kObj.model.cardSettings.externalDropTarget).data("ejKanban");
                    var exSwimkey = this._externalObj.model.fields.swimlaneKey, swimId, $swimTr, $rowTd, div, slexpand, slkey;
                    var cardData = kObj.KanbanCommon._getKanbanCardData(kObj._currentJsonData, $(args.element).attr('id'))[0];
                    if (!ej.isNullOrUndefined(exSwimkey)) {
                        swimId = this._externalObj.KanbanCommon._removeIdSymbols(cardData[exSwimkey]);
                        $swimTr = ej.buildTag('tr.e-swimlanerow', "", {}, { "id": swimId, "data-role": "kanbanrow" });
                        $rowTd = ej.buildTag('td.e-rowcell', "", {}, { "data-role": "kanbancell" });
                        div = ej.buildTag('div.e-slexpandcollapse');
                        slexpand = ej.buildTag('div.e-icon e-slexpand');
                        div.append(slexpand);
                        slkey = ej.buildTag('div.e-slkey');
                        slkey.html(cardData[exSwimkey]);
                        $rowTd.append(div).append(slkey);
                        $swimTr.append($rowTd);
                    }
                    var $emptyTr = ej.buildTag('tr.e-columnrow', "", {}, { "data-role": "kanbanrow" }), content = this._externalObj.getContentTable();
                    for (var i = 0; i < content.find("colgroup col").length; i++) {
                        $emptyTr.append(ej.buildTag('td.e-rowcell e-drag e-drop e-droppable', "", {}, { "data-role": "kanbancell", "data-ej-mappingkey": this._externalObj.model.columns[i].key }));
                    }
                    if (!ej.isNullOrUndefined(exSwimkey)) {
                        content.find('tbody').empty().append($swimTr);
                        content.find('tbody').append($emptyTr);
                    }
                    else
                        content.find('tbody').empty().append($emptyTr);
                }
                if (!$(args.target).hasClass("e-targetclone") && !$(args.target).hasClass("e-rowcell") && !$(args.target).hasClass("e-customaddbutton")) {
                    $(trgtClone).remove();
                }
                var target = $(args.target).closest(".e-kanbancard").length > 0 ? $(args.target).closest(".e-kanbancard")[0] : args.target, dropTd, dragTd, selectedCards;
                var isSwimDragAndDrop = !ej.isNullOrUndefined(kObj.model.fields.swimlaneKey) && kObj.model.swimlaneSettings.allowDragAndDrop;
                dragTd = $(args.element).closest("td.e-rowcell").addClass("e-dragged");
                var dragTdSiblen = dragTd.siblings().length;
                if (dragTd.parent().find(".e-dragpossible").length == 0) {
                    var cardData = kObj.KanbanCommon._getKanbanCardData(kObj._currentJsonData, $(args.element).attr('id'))[0];
                    if (dragTdSiblen > 0) {
                        for (var i = 0; i < dragTdSiblen; i++) {
                            if (kObj.KanbanCommon._preventCardMove(cardData[kObj.model.keyField], kObj.model.columns[dragTd.parent().children().index(dragTd.siblings()[i])].key))
                                dragTd.siblings().eq(i).addClass("e-dragpossible");
                        }
                    }
                    if (isSwimDragAndDrop) {
                        var kbnColumn = kObj.element.find(".e-columnrow");
                        for (var j = 0; j < kbnColumn.length; j++) {
                            var index = kbnColumn.eq(j).index(dragTd.parent());
                            if (index == -1) {
                                var kbnrowcell = kbnColumn.eq(j).find(".e-rowcell");
                                kbnrowcell.addClass("e-dragpossible");
                            }
                        }
                    }
                }
                dragTd.siblings(".e-drop.e-dragpossible").addClass("e-dropping");
                if (!kObj._dropinside)
                    dragTd.addClass("e-dragpossible e-drop");
                else
                    dragTd.addClass("e-dragpossible e-drop e-droppable e-droppableremove");
                eventArgs = { draggedElement: draggedEle, data: data, dragTarget: target, event: args["event"] };
                var exDrop = kObj.model.allowExternalDragAndDrop, exTarget = kObj.model.cardSettings.externalDropTarget;
                if (exDrop && exTarget == "#" + $(args.target).parents('.e-kanban').attr('id') && $(args.target).hasClass('e-rowcell'))
                    $(exTarget).find('.e-rowcell.e-drag').addClass('e-dragpossible e-dropping');
                var exDrop = kObj.model.allowExternalDragAndDrop, exTarget = kObj.model.cardSettings.externalDropTarget;
                if (exDrop && exTarget == "#" + $(args.target).parents('.e-kanban').attr('id') && ($(args.target).hasClass('e-rowcell') || $(args.target).parents('.e-rowcell').length > 0)) {
                    $(exTarget).find('td.e-rowcell.e-drag').addClass('e-dragpossible e-dragged e-dropping');
                    proxy._externalObj = $(args.target).parents(exTarget).data("ejKanban");
                    proxy._externalDrop = true;
                }
                prevTd = dropTd = $(target).closest("td.e-rowcell");
                selectedCards = dropTd.parents('.e-columnrow').find('.e-cardselection');
                if (dropTd && dropTd.hasClass("e-droppable") && (isSwimDragAndDrop ? true : ($(dropTd).parent().has(args.element[0]).length > 0 ? true : ("#" + $(dropTd).parents(".e-kanban").attr("id") == kObj.model.cardSettings.externalDropTarget) ? args.element.length > 0 : false)) && (target != args.element[0] || selectedCards.length > 1)) {
                    document.body.style.cursor = '';
                    if ($(trgtClone).parents('.e-rowcell').index() != dropTd.index())
                        $(trgtClone).remove();
                    dropTd.find(".e-kanbancard").removeClass("e-hover");
                    var lastEle, prevHgt;
                    if (kObj.element.hasClass('e-responsive')) {
                        var parent = $(target).parents(".e-rowcell");
                        if (!$(target).hasClass("e-kanbancard") && $(target).parents(".e-kanbancard").length == 0 && parent.length > 0) {
                            target = parent;
                            dropTd = $(target).find('.e-cell-scrollcontent').children().eq(0);
                        }
                    }
                    lastEle = dropTd.children().last();
                    if (lastEle.hasClass('e-shrinkheader'))
                        lastEle = lastEle.prev();
                    if ($(target).hasClass("e-columnkey") || $(target).parents(".e-columnkey").length > 0 || $(target).find(".e-columnkey").length > 0) {
                        var parentRow = $(target).hasClass("e-rowcell") ? $(target) : $(target).parents(".e-rowcell");
                        var curtrgt = args.target;
                        if (($(curtrgt).hasClass("e-columnkey") && !$(curtrgt).hasClass("e-disable")) || ($(curtrgt).parents(".e-columnkey").length > 0 && !$(curtrgt).parents(".e-disable").length > 0)) {
                            proxy._removeKanbanCursor();
                            parentRow.find(".e-columnkey.e-active").removeClass("e-active");
                            parentRow.find(".e-columnkey.e-multiclonestyle").removeClass("e-multiclonestyle");
                            $(curtrgt).closest(".e-columnkey").not(".e-disable").addClass("e-active");
                            $(dropTd).find(".e-active").prev().addClass("e-multiclonestyle");
                        }
                        else
                            proxy._changeKanbanCursor(target, clonedElement, args);
                    }
                    if (($(target).hasClass("e-rowcell") || $(target).hasClass("e-kanbancard") || $(target).hasClass("e-targetdragclone") || ($(target).hasClass("e-swimlane-name") || ($(target).hasClass("e-limits"))) || $(target).parents(".e-rowcell").not(".e-drop").length > 0) && $(trgtCloneMulti).is(":visible") && (($(target).index() != trgtCloneMulti.parents(".e-rowcell").index() || (proxy._externalDrop && $(target).index() == trgtCloneMulti.parents(".e-rowcell").index()) || (!ej.isNullOrUndefined(exTarget) && $(exTarget).find(".e-targetclonemulti").length > 0)) || (istoggleKey && $(target).parents(".e-rowcell").index() == dragTd.index()))) {
                        $(trgtCloneMulti).siblings(".e-kanbancard").not(".e-kanban-draggedcard").show();
                        if (!ej.isNullOrUndefined($(trgtCloneMulti).siblings(".e-toggle-area")))
                            $(trgtCloneMulti).siblings(".e-toggle-area").show();
                        $(trgtCloneMulti).parents(".e-rowcell").css("border-style", "");
                        $(trgtCloneMulti).siblings(".e-targetdragclone,.e-customaddbutton,.e-limits").show();
                        $(trgtCloneMulti).remove();
                        trgtCloneMulti.children().remove();
                    }
                    else if ($(target).hasClass("e-rowcell") && (args.element[0] != lastEle[0] || selectedCards.length > 1) && !$(target).hasClass("e-shrink") && !$(lastEle[0]).hasClass("e-targetclonemulti")) {
                        var dragPossible = $(target).hasClass("e-dragpossible");
                        var targetIndex = $(target).parent().children().index(target);
                        if (proxy._externalDrop)
                            var targetKey = proxy._externalObj.model.columns[targetIndex].key;
                        else
                            var targetKey = kObj.model.columns[targetIndex].key;
                        var keylength = (typeof (targetKey) == "object" ? targetKey : targetKey.split(",")).length;
                        if (lastEle.length == 0 || dropTd.children().length == 0 || ((lastEle.offset().top + lastEle.height() < $(clonedElement).offset().top) || keylength > 1)) {
                            if (dragPossible && (keylength == 1 || ((targetIndex == $(dragTd).parent().children().index(dragTd) && (draggedEle.length == 1 || (draggedEle.length > 1 && kObj.selectedRowCellIndexes[0].cellIndex.length == 1))) || (draggedEle.length > 1 && (!kObj.selectedRowCellIndexes[0].cellIndex.length > 1 && ($.inArray(dropTd.index(), kObj.selectedRowCellIndexes[0].cellIndex) != -1)))))) {
                                if (keylength > 1 && dragTd.parents('.e-kanban').attr('id') != $(args.target).parents('.e-kanban').attr('id')) {
                                    if (!dropTd.find(".e-columnkey").length > 0)
                                        proxy._multicloneremove(dropTd, trgtCloneMulti);
                                    proxy._multiKeyCardDrop(dropTd, keylength, trgtCloneMulti, targetKey, draggedEle);
                                }
                                else {
                                    prevHgt = $(target).height();
                                    if ($(trgtClone).css("display") == "none")
                                        $(trgtClone).css("display", "block");
                                    var clHght = $(args.element[0]).height(), clWidth = $(target).width();
                                    var lastEle = dropTd.children().last(), appendTrgt = dropTd, scroller = dropTd.find('.e-cell-scrollcontent');
                                    if (kObj.element.hasClass('e-responsive') && scroller.length > 0) {
                                        lastEle = scroller.children().last();
                                        appendTrgt = scroller.children();
                                    }
                                    if (lastEle.hasClass('e-customaddbutton'))
                                        lastEle.before($(trgtClone).height(clHght).width(clWidth - 28));
                                    else if (istoggleKey)
                                        appendTrgt.append($(trgtClone).height(dCard.find('.e-kanbancard').outerHeight()).width(clWidth - 28));
                                    else
                                        appendTrgt.append($(trgtClone).height(clHght).width(clWidth - 28));
                                    if (prevHgt < $(target).height()) {
                                        dropTd.height(dropTd.height());
                                        kObj._tdHeightDiff = $(target).height() - prevHgt;
                                    }
                                }
                            }
                            else if (dragPossible && keylength > 1) {
                                if (!dropTd.find(".e-columnkey").length > 0)
                                    proxy._multicloneremove(dropTd, trgtCloneMulti);
                                proxy._multiKeyCardDrop(dropTd, keylength, trgtCloneMulti, targetKey, draggedEle);
                            }
                            else
                                proxy._changeKanbanCursor(target, clonedElement, args);
                        }
                    }
                    else if (($(target).hasClass("e-rowcell") && $(target).hasClass("e-shrink") && $(target).hasClass("e-dragpossible")) || (($(target).hasClass("e-shrinkheader IE") || $(target).hasClass("e-shrinkcount") || $(target).hasClass("e-shrinklabel")) && ($(target).parents('.e-rowcell').hasClass("e-dragpossible")))) {
                        var targetCol = $(target).hasClass('e-rowcell') ? $(target) : $(target).parents('.e-rowcell');
                        var column = new ej.DataManager(kObj.model.columns).executeLocal(new ej.Query().where('key', ej.FilterOperators.equal, targetCol.attr('data-ej-mappingkey')));
                        kObj.toggleColumn(column[0].headerText);
                        kObj.element.find('.e-draggedcard').width(kObj.element.find('.e-targetdragclone').width());
                        trgtClone.width(kObj.element.find('.e-targetdragclone').width());
                        targetCol.addClass('e-togglevisible');
                    }
                    else if ($(target).hasClass("e-shrink") && !$(target).hasClass("e-dragpossible")) {
                        proxy._changeKanbanCursor(target, clonedElement, args);
                    }
                    else if ($(target).hasClass("e-kanbancard") || $(target).hasClass("e-targetclone")) {
                        var parentTd = $(target).parents('.e-rowcell'), pageY;
                        if (proxy._externalDrop)
                            var targetKey = proxy._externalObj.model.columns[parentTd.parent().children().index(parentTd)].key;
                        else
                            var targetKey = kObj.model.columns[parentTd.parent().children().index(parentTd)].key;
                        var keylength = (typeof (targetKey) == "object" ? targetKey : targetKey.split(",")).length;
                        prevHgt = parentTd.height();
                        var dragPossible = $(target).parents(".e-rowcell").hasClass("e-dragpossible");
                        if (!ej.isNullOrUndefined(args["event"].pageY))
                            pageY = args["event"].pageY;
                        else
                            pageY = args["event"].originalEvent.changedTouches[0].pageY;
                        if ((($(target).offset().top + ($(target).height()) / 2) >= pageY) && dragPossible && ((draggedEle.length > 1 && (!kObj.selectedRowCellIndexes[0].cellIndex.length > 1 && ($.inArray(dropTd.index(), kObj.selectedRowCellIndexes[0].cellIndex)) != -1)) || keylength == 1 || (($(dropTd).parent().children().index(dropTd) == $(dragTd).parent().children().index(dragTd)) && dragTd.parents("tr").index() == dropTd.parents("tr").index()))) {
                            if ($(target).prev()[0] != args.element[0] || selectedCards.length > 1) {
                                if (!$(target).hasClass("e-targetclone") && ($(target).prev().length == 0 || ($(target).prev().length > 0 && !$(target).prev().hasClass("e-targetdragclone")))) {
                                    proxy._removeKanbanCursor();
                                    $(trgtClone).insertBefore($(target)).height(dCard.find('.e-kanbancard').outerHeight()).width($(target).width()).removeClass('e-targetappend');
                                }
                            }
                            else
                                proxy._changeKanbanCursor(target, clonedElement, args);
                        }
                        else {
                            if (($(target).next()[0] != args.element[0] || selectedCards.length > 1) && dragPossible && ((draggedEle.length > 1 && (!kObj.selectedRowCellIndexes[0].cellIndex.length > 1 && ($.inArray(dropTd.index(), kObj.selectedRowCellIndexes[0].cellIndex)) != -1)) || keylength == 1 || (($(dropTd).parent().children().index(dropTd) == $(dragTd).parent().children().index(dragTd)) && (dragTd.parents("tr").index() == dropTd.parents("tr").index() || isSwimDragAndDrop)))) {
                                prevHgt = $(target).parents('.e-rowcell').height();
                                if (!$(target).hasClass("e-targetclone") && ($(target).next().length == 0 || ($(target).next().length > 0 && !$(target).next().hasClass("e-targetdragclone")))) {
                                    pre = true;
                                    proxy._removeKanbanCursor();
                                    $(trgtClone).insertAfter($(target)).height(dCard.find('.e-kanbancard').outerHeight()).width($(target).width()).addClass('e-targetappend');
                                }
                            }
                            else if (dragPossible && keylength > 1 && !parentTd.find(".e-columnkey").length > 0 && !($(dropTd).parent().children().index(dropTd) == $(dragTd).parent().children().index(dragTd))) {
                                proxy._multicloneremove(dropTd, trgtCloneMulti);
                                proxy._multiKeyCardDrop(parentTd, keylength, trgtCloneMulti, targetKey, draggedEle);
                            }
                            else
                                proxy._changeKanbanCursor(target, clonedElement, args);
                        }
                        if (prevHgt < parentTd.height()) {
                            parentTd.height(parentTd.height());
                            kObj._tdHeightDiff = parentTd.height() - prevHgt;
                        }
                    }
                    if ($(trgtClone).parent().hasClass("e-rowcell") && dragTd.parent().has($(trgtClone).parent()).length == 0 && isSwimDragAndDrop) {
                        kObj.element.find(".e-columnrow .e-rowcell.e-drop").addClass("e-dropping");
                        dragTd.removeClass("e-dropping").addClass("e-dragged");
                    }
                    else {
                        kObj.element.find(".e-columnrow .e-rowcell").removeClass("e-dropping");
                        dragTd.addClass("e-dragged");
                        dragTd.siblings(".e-drop.e-dragpossible ").addClass("e-dropping");
                    }
                }
                else {
                    if ($(target).parents(".e-rowcell").not(".e-droppable").length > 0 || $(target).hasClass("e-swimlane-name") || $(target).hasClass("e-limits") || ($(target).hasClass("e-swimlanerow") || $(target).parents(".e-swimlanerow").length > 0)) {
                        if ($(trgtCloneMulti).is(":visible")) {
                            $(trgtCloneMulti).siblings(".e-kanbancard").not(".e-kanban-draggedcard").show();
                            if (!ej.isNullOrUndefined($(trgtCloneMulti).siblings(".e-toggle-area")))
                                $(trgtCloneMulti).siblings(".e-toggle-area").show();
                            $(trgtCloneMulti).parents(".e-rowcell").css("border-style", "");
                            $(trgtCloneMulti).siblings(".e-targetdragclone,.e-customaddbutton,.e-limits").show();
                            $(trgtCloneMulti).remove();
                            trgtCloneMulti.children().remove();
                        }
                    }
                    if ($(target).hasClass("e-swimlanerow") || $(target).parents(".e-swimlanerow").length > 0) {
                        if ($(trgtClone).is(':visible'))
                            $(trgtClone).remove();
                    }
                    proxy._changeKanbanCursor(target, clonedElement, args);
                }
                var tColumn = kObj.element.find('.e-togglevisible');
                if (tColumn.length > 0 && !$(target).hasClass('e-togglevisible') && $(target).parents('.e-togglevisible').length == 0) {
                    var column = new ej.DataManager(kObj.model.columns).executeLocal(new ej.Query().where('key', ej.FilterOperators.equal, tColumn.attr('data-ej-mappingkey')));
                    kObj.toggleColumn(column[0].headerText);
                    kObj.element.find('.e-draggedcard').width(kObj.element.find('.e-targetdragclone').width());
                    trgtClone.width(kObj.element.find('.e-targetdragclone').width());
                    tColumn.removeClass('e-togglevisible');
                }
                if (exDrop && $(args.target).parents(exTarget).length != 0 && $(args.target).parents(".e-kanban").length == 0) {
                    document.body.style.cursor = '';
                    $(exTarget).css('cursor', '');
                }
                proxy._externalDrop = false;
                if (kObj._trigger("cardDrag", eventArgs))
                    return false;
                return true;
            },
            dragStop: function (args) {
                kObj._cardSelect = null;
                args["dragData"] = data, args["dragEle"] = draggedEle;
                proxy._dragStop(args, clonedElement, pre);
            },
            helper: function (event) {
                if (kObj.model.enableTouch && !ej.isNullOrUndefined(kObj._cardSelect) && kObj._cardSelect == 'touch')
                    return false;
                trgtClone = ej.buildTag('div.e-targetclone');
                trgtCloneMulti = ej.buildTag('div.e-targetclonemulti');
                $(trgtClone).css({ "width": event.element.width(), "height": event.element.height() });
                clonedElement = proxy._createCardClone(clonedElement, event.element);
                return clonedElement;
            }
        });
    };
    return InternalDragAndDrop;
}());
window.ej.createObject("ej.KanbanFeatures.DragAndDrop", InternalDragAndDrop, window);
