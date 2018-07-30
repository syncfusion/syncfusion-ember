var InternalSelection = (function () {
    function InternalSelection(element) {
        this.kanbanObj = null;
        this.kanbanObj = element;
    }
    ;
    InternalSelection.prototype._cardSelection = function (rowCellIndexes, target, e) {
        var kObj = this.kanbanObj, $cell, args, previousCard = null, data = null, queryManager;
        $cell = target.parent("td.e-rowcell");
        if (kObj._currentRowCellIndex.length > 0)
            kObj._previousRowCellIndex = [[kObj._currentRowCellIndex[0][0], [kObj._currentRowCellIndex[0][1][0]], [kObj._currentRowCellIndex[0][2][0]]]];
        if (!ej.isNullOrUndefined(target.attr("id"))) {
            queryManager = new ej.DataManager(kObj._currentJsonData);
            data = queryManager.executeLocal(new ej.Query().where(kObj.model.fields.primaryKey, ej.FilterOperators.equal, target.attr('id')));
        }
        if (!ej.isNullOrUndefined(kObj._previousRowCellIndex) && kObj._previousRowCellIndex.length != 0)
            previousCard = kObj.KanbanCommon._getCardbyIndexes(kObj._previousRowCellIndex);
        args = { currentCell: $cell, target: target, cellIndex: rowCellIndexes[0][1][0], cardIndex: rowCellIndexes[0][2][0], data: data, previousRowCellIndex: kObj._previousRowCellIndex, previousCard: previousCard, selectedCardsData: kObj._selectedCardData };
        if (kObj._trigger("beforeCardSelect", args))
            return;
        if (!$(target).hasClass("e-cardselection")) {
            if (kObj.model.selectionType == "multiple" && !kObj._kTouchBar.find(".e-cardtouch").hasClass("e-spanclicked"))
                kObj._kTouchBar.hide();
            if (e["pointerType"] == "touch" && !kObj._kTouchBar.find(".e-cardtouch").hasClass("e-spanclicked") && kObj.model.selectionType == "multiple") {
                var trgtOffset = $(target).offset();
                kObj._kTouchBar.show();
                kObj._kTouchBar.offset({ top: trgtOffset.top, left: trgtOffset.left });
            }
        }
        if (e["pointerType"] == "touch" && $(target).hasClass("e-cardselection") && kObj._kTouchBar.is(':hidden')) {
            var trgtOffset = $(target).offset();
            kObj._kTouchBar.show();
            kObj._kTouchBar.offset({ top: trgtOffset.top, left: trgtOffset.left });
        }
        if (kObj.model.selectionType == "multiple" && e.shiftKey) {
            var parentRow, cards, i = 0, l = 0, endCard = target, selectedCards = [];
            if (!ej.isNullOrUndefined(previousCard)) {
                parentRow = previousCard.parents('.e-columnrow');
                parentRow.find('.e-cardselection').not(previousCard).removeClass('e-cardselection');
                cards = parentRow.find('.e-kanbancard');
                i = cards.index(previousCard);
            }
            else
                cards = target.parents('.e-columnrow').find('.e-kanbancard');
            kObj._selectedCards = [];
            kObj._selectedCardData = [];
            kObj.selectedRowCellIndexes = [];
            while (l <= 0) {
                var row, column, curRowCellIndexes = [];
                row = $(cards[i]).parents('.e-columnrow');
                column = $(cards[i]).parents('.e-rowcell');
                $(cards[i]).addClass('e-cardselection');
                selectedCards.push(cards[i]);
                kObj._selectedCardData.push(kObj.KanbanCommon._getKanbanCardData(kObj._currentJsonData, cards[i].id)[0]);
                curRowCellIndexes = [[kObj.element.find('.e-columnrow').index(row), [column.index()], [column.find($(cards[i])).index()]]];
                if (cards[i].id == endCard.attr("id"))
                    l = 1;
                this._pushIntoSelectedArray(curRowCellIndexes);
                if (!ej.isNullOrUndefined(previousCard)) {
                    if (rowCellIndexes[0][1][0] < kObj._previousRowCellIndex[0][1][0])
                        --i;
                    else if (rowCellIndexes[0][1][0] == kObj._previousRowCellIndex[0][1][0]) {
                        if (rowCellIndexes[0][2][0] < kObj._previousRowCellIndex[0][2][0])
                            --i;
                        else
                            ++i;
                    }
                    else
                        ++i;
                }
                else {
                    ++i;
                }
            }
            if (ej.isNullOrUndefined(previousCard)) {
                kObj._previousRowCellIndex = kObj._currentRowCellIndex = [[0, [0], [0]]];
                previousCard = kObj.KanbanCommon._getCardbyIndexes(kObj._previousRowCellIndex);
            }
            kObj._selectedCards = [];
            kObj._selectedCards[kObj._selectedCards.length] = selectedCards;
            if (ej.isNullOrUndefined(previousCard) && (!e.ctrlKey && !e.shiftKey && !kObj._enableMultiTouch)) {
                {
                    $(target).addClass('e-cardselection');
                    kObj._selectedCards.push(target[0]);
                    kObj._selectedCardData.push(kObj.KanbanCommon._getKanbanCardData(kObj._currentJsonData, target.id)[0]);
                    this._pushIntoSelectedArray(rowCellIndexes);
                }
            }
        }
        if (kObj.model.selectionType == "multiple" && (e.ctrlKey || kObj._enableMultiTouch)) {
            if ($(target).hasClass("e-cardselection")) {
                $(target).removeClass("e-cardselection");
                this._popFromSelectedArray(rowCellIndexes[0][0], rowCellIndexes[0][1], rowCellIndexes[0][2], e);
                for (var k = 0; k < kObj._selectedCardData.length; k++) {
                    if (data[0][kObj.model.fields.primaryKey] == kObj._selectedCardData[0][kObj.model.fields.primaryKey])
                        break;
                }
                kObj._selectedCardData.splice(k, 1);
                kObj._selectedCards.splice(k, 1);
                kObj._currentRowCellIndex = rowCellIndexes;
            }
            else {
                $(target).addClass("e-cardselection");
                kObj._selectedCards.push(target[0]);
                this._pushIntoSelectedArray(rowCellIndexes);
                kObj._selectedCardData.push(data[0]);
            }
        }
        else {
            if (!(kObj.model.selectionType == "multiple" && e.shiftKey)) {
                var cardIndex = rowCellIndexes[0][2];
                kObj.element.find(".e-cardselection").removeClass("e-cardselection");
                kObj._selectedCards = [];
                kObj.selectedRowCellIndexes = [];
                $(target).addClass("e-cardselection");
                kObj._selectedCardData = [];
                kObj._selectedCardData.push(data[0]);
                kObj._selectedCards.push(target[0]);
                if (kObj.model.selectionType == "multiple")
                    cardIndex = [rowCellIndexes[0][2]];
                kObj.selectedRowCellIndexes.push({ rowIndex: rowCellIndexes[0][0], cellIndex: rowCellIndexes[0][1], cardIndex: cardIndex });
            }
        }
        args = { currentCell: $cell, target: target, cellIndex: rowCellIndexes[0][1][0], cardIndex: rowCellIndexes[0][2][0], data: data, selectedRowCellIndex: kObj.selectedRowCellIndexes, previousRowCellIndex: kObj._previousRowCellIndex, previousCard: previousCard, selectedCardsData: kObj._selectedCardData };
        if (kObj.model.selectionType == "multiple" && e.shiftKey && $(target).hasClass("e-cardselection")) {
            if (kObj._previousRowCellIndex.length == 0)
                kObj._currentRowCellIndex = [[target.parents('.e-columnrow').index(), [0], [0]]];
            if (kObj._currentRowCellIndex.length == 0)
                kObj._currentRowCellIndex = rowCellIndexes;
        }
        else if ($(target).hasClass("e-cardselection"))
            kObj._currentRowCellIndex = rowCellIndexes;
        if (kObj._trigger("cardSelect", args))
            return;
        kObj.element.focus();
    };
    InternalSelection.prototype.clear = function () {
        var kObj = this.kanbanObj;
        if (kObj.model.allowSelection) {
            var $kanbanRows = $(kObj._kanbanRows).not(".e-swimlanerow");
            $($kanbanRows).find(".e-rowcell .e-kanbancard").removeClass("e-cardselection");
            kObj.selectedRowCellIndexes = [];
            kObj._selectedCardData = [];
            kObj._selectedCards = [];
            kObj._previousRowCellIndex = [];
            kObj._currentRowCellIndex = [];
        }
    };
    InternalSelection.prototype._pushIntoSelectedArray = function (rowCellIndexes) {
        var kObj = this.kanbanObj, i, l = 0, newRow = true, newCell = true;
        for (i = 0; i < kObj.selectedRowCellIndexes.length; i++) {
            var row = kObj.selectedRowCellIndexes[i];
            if (row.rowIndex == rowCellIndexes[0][0]) {
                newRow = false;
                for (l = 0; l < row.cellIndex.length; l++) {
                    var cell = row.cellIndex[l];
                    if (cell == rowCellIndexes[0][1][0]) {
                        newCell = false;
                        break;
                    }
                }
                break;
            }
        }
        if (newRow)
            kObj.selectedRowCellIndexes.push({ rowIndex: rowCellIndexes[0][0], cellIndex: rowCellIndexes[0][1], cardIndex: [rowCellIndexes[0][2]] });
        if (!newCell)
            kObj.selectedRowCellIndexes[i].cardIndex[l].push(rowCellIndexes[0][2][0]);
        else if (!newRow) {
            kObj.selectedRowCellIndexes[i].cellIndex.push(rowCellIndexes[0][1][0]);
            kObj.selectedRowCellIndexes[i].cardIndex.push([rowCellIndexes[0][2][0]]);
        }
    };
    InternalSelection.prototype._popFromSelectedArray = function (val1, val2, val3, e) {
        var kObj = this.kanbanObj;
        if (kObj.model.selectionType == "multiple" && (e.ctrlKey || e.shiftKey || kObj._enableMultiTouch)) {
            var i, l, j;
            for (i = 0; i < kObj.selectedRowCellIndexes.length; i++) {
                var row = kObj.selectedRowCellIndexes[i];
                if (row.rowIndex == val1) {
                    for (l = 0; l < row.cellIndex.length; l++) {
                        var cell = row.cellIndex[l];
                        if (cell == val2[0]) {
                            if (e.shiftKey) {
                                row.cardIndex = [];
                                break;
                            }
                            else {
                                for (j = 0; j < row.cardIndex[l].length; j++) {
                                    var card = row.cardIndex[l][j];
                                    if (card == val3[0]) {
                                        row.cardIndex[l].splice(j, 1);
                                        if (row.cardIndex[l].length == 0) {
                                            row.cardIndex.splice(l, 1);
                                            row.cellIndex.splice(l, 1);
                                        }
                                        if (row.cellIndex.length == 0)
                                            kObj.selectedRowCellIndexes.splice(i, 1);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    InternalSelection.prototype._selectionOnRerender = function () {
        var rowIndex, row, column, cardsSelected = true, kObj = this.kanbanObj;
        if (!kObj.model.allowSelection)
            return;
        if (kObj.model.selectionType == "single") {
            if (kObj._selectedCards.length > 0) {
                var el = $(kObj._selectedCards[0]), curEl, index;
                curEl = kObj.element.find("#" + el[0].id);
                if (curEl.hasClass('e-kanbancard')) {
                    row = $(curEl).parents('.e-columnrow');
                    column = $(curEl).parents('.e-rowcell');
                    kObj._selectedCards = [];
                    kObj._selectedCards = curEl.addClass('e-cardselection');
                    kObj._currentRowCellIndex = kObj._previousRowCellIndex = [];
                    kObj._currentRowCellIndex.push([row.index(), [column.index()], [column.find('.e-kanbancard').index(column.find("#" + el[0].id))]]);
                    kObj._currentRowCellIndex = kObj._previousRowCellIndex;
                    kObj.selectedRowCellIndexes = [];
                    kObj.selectedRowCellIndexes.push({ rowIndex: kObj._currentRowCellIndex[0][0], cellIndex: kObj._currentRowCellIndex[0][1][0], cardIndex: kObj._currentRowCellIndex[0][2][0] });
                }
                else {
                    kObj._selectedCards = [];
                    kObj._selectedCardData = [];
                    kObj.selectedRowCellIndexes = [];
                    kObj._currentRowCellIndex = kObj._previousRowCellIndex = [];
                }
            }
        }
        else {
            for (var i = 0; i < kObj._selectedCards.length; i++) {
                var el, curEl;
                if ($(kObj._selectedCards[i]).length > 1) {
                    for (var l = 0; l < kObj._selectedCards[i].length; l++) {
                        var rowCellIndex;
                        el = $(kObj._selectedCards[i][l]);
                        curEl = kObj.element.find("#" + el[0].id);
                        row = $(curEl).parents('.e-columnrow');
                        column = $(curEl).parents('.e-rowcell');
                        if (curEl.hasClass('e-kanbancard')) {
                            cardsSelected = true;
                            kObj._selectedCards[i].splice(l, 0, curEl[0]);
                            curEl.addClass('e-cardselection');
                            kObj._selectedCards[i].splice(l + 1, 1);
                            if (i == 0 && l == 0) {
                                kObj._currentRowCellIndex = kObj._previousRowCellIndex = [];
                                kObj._currentRowCellIndex.push([row.index(), [column.index()], [column.find('.e-kanbancard').index(column.find("#" + el[0].id))]]);
                                kObj._currentRowCellIndex = kObj._previousRowCellIndex;
                                kObj.selectedRowCellIndexes = [];
                            }
                            rowCellIndex = [row.index(), [column.index()], [column.find('.e-kanbancard').index(column.find("#" + el[0].id))]];
                            this._pushIntoSelectedArray([rowCellIndex]);
                        }
                        else {
                            cardsSelected = false;
                            kObj._selectedCards[i].splice(l, 1);
                            var index = kObj._selectedCardData.indexOf(kObj.KanbanCommon._getKanbanCardData(kObj._selectedCardData, el[0].id)[0]);
                            kObj._selectedCardData.splice(index, 1);
                            --l;
                        }
                    }
                }
                else {
                    var rowCellIndex;
                    el = $(kObj._selectedCards[i]);
                    curEl = kObj.element.find("#" + el[0].id);
                    row = $(curEl).parents('.e-columnrow');
                    column = $(curEl).parents('.e-rowcell');
                    if (curEl.hasClass('e-kanbancard')) {
                        cardsSelected = true;
                        curEl.addClass('e-cardselection');
                        kObj._selectedCards[i] = curEl[0];
                        if (i == 0) {
                            kObj._currentRowCellIndex = kObj._previousRowCellIndex = [];
                            kObj._currentRowCellIndex.push([row.index(), [column.index()], [column.find('.e-kanbancard').index(column.find("#" + el[0].id))]]);
                            kObj._currentRowCellIndex = kObj._previousRowCellIndex;
                            kObj.selectedRowCellIndexes = [];
                        }
                        rowCellIndex = [row.index(), [column.index()], [column.find('.e-kanbancard').index(column.find("#" + el[0].id))]];
                        this._pushIntoSelectedArray([rowCellIndex]);
                    }
                    else {
                        cardsSelected = false;
                        kObj._selectedCards.splice(i, 1);
                        var index = kObj._selectedCardData.indexOf(kObj.KanbanCommon._getKanbanCardData(kObj._selectedCardData, el[0].id)[0]);
                        kObj._selectedCardData.splice(index, 1);
                        --i;
                    }
                }
            }
            if (!cardsSelected && kObj._selectedCards.length <= 0)
                kObj._currentRowCellIndex = kObj._previousRowCellIndex = kObj.selectedRowCellIndexes = [];
        }
        rowIndex = kObj.element.find('.e-columnrow').index(kObj.element.find('.e-cardselection').eq(0).parents('.e-columnrow'));
        if (rowIndex >= 0) {
            kObj.selectedRowCellIndexes[0].rowIndex = kObj._currentRowCellIndex[0][0] = rowIndex;
            if (kObj._previousRowCellIndex.length > 0)
                kObj._previousRowCellIndex[0][0] = rowIndex;
        }
    };
    InternalSelection.prototype._renderKanbanTouchBar = function () {
        var kObj = this.kanbanObj;
        kObj._kTouchBar = ej.buildTag("div.e-kanbantouchbar", "", { display: "none" }, {});
        var content = ej.buildTag("div.e-content", "", {}, {}), downTail = ej.buildTag("div.e-downtail e-tail", "", {}, {});
        var touchElement = ej.buildTag("span.e-cardtouch e-icon", "", {}, {});
        content.append(touchElement);
        kObj._kTouchBar.append(content);
        kObj._kTouchBar.append(downTail);
        kObj.element.append(kObj._kTouchBar);
    };
    InternalSelection.prototype._updateSelectedCardIndexes = function (target) {
        var targetRow, targetCellIndex, kObj = this.kanbanObj;
        if (kObj.selectedRowCellIndexes.length > 0) {
            if ($(target).hasClass('e-rowcell'))
                targetCellIndex = $(target).index();
            else {
                target = kObj.element.find("#" + $(target).attr('id'));
                targetCellIndex = $(target).parents('.e-rowcell').index();
            }
            targetRow = $(target).parents('.e-columnrow');
            if ($.inArray(targetCellIndex, kObj.selectedRowCellIndexes[0].cellIndex) == -1)
                kObj.selectedRowCellIndexes[0].cellIndex.push(targetCellIndex);
            for (var k = 0; k < kObj.selectedRowCellIndexes[0].cellIndex.length; k++) {
                var selectedCards;
                selectedCards = targetRow.find('.e-rowcell').eq(kObj.selectedRowCellIndexes[0].cellIndex[k]).find('.e-cardselection');
                if (selectedCards.length > 0) {
                    kObj.selectedRowCellIndexes[0].cardIndex.splice(k, 1);
                    kObj.element.find('.e-targetclone').remove();
                    for (var m = 0; m < selectedCards.length; m++) {
                        if (m > 0)
                            kObj.selectedRowCellIndexes[0].cardIndex[k].push($(selectedCards[m]).index());
                        else
                            kObj.selectedRowCellIndexes[0].cardIndex.splice(k, 0, [$(selectedCards[0]).index()]);
                    }
                }
                else {
                    kObj.selectedRowCellIndexes[0].cellIndex.splice(k, 1);
                    kObj.selectedRowCellIndexes[0].cardIndex.splice(k, 1);
                    --k;
                }
            }
        }
    };
    return InternalSelection;
}());
window.ej.createObject("ej.KanbanFeatures.Selection", InternalSelection, window);
