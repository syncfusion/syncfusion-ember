var InternalCommon = (function () {
    function InternalCommon(element) {
        this.kanbanObj = null;
        this._columnAutoWidth = function (i, width, bSize) {
            var kObj = this.kanbanObj, $cols1 = kObj.getContentTable().children("colgroup").find("col"), $cols2 = kObj.getHeaderTable().children("colgroup").find("col"), toolbar, originalHeight, actualHeight, newwidth, colWidth, extraValue, height, scrollHeight, expandLength;
            toolbar = kObj.element.find(".e-kanbantoolbar");
            scrollHeight = kObj.model.scrollSettings.height;
            if (typeof (scrollHeight) == "string" && scrollHeight.indexOf("%") != -1)
                height = (parseFloat(kObj._originalScrollHeight) / 100) * kObj.element.height();
            else
                height = scrollHeight;
            originalHeight = (scrollHeight == 0 ? kObj.element.height() : height) - (toolbar.length > 0 ? toolbar.outerHeight() : 0);
            actualHeight = kObj.getContentTable().height() + kObj.getHeaderTable().height();
            if (parseInt(originalHeight) < parseInt(actualHeight))
                bSize = bSize + 18;
            else if (parseInt(originalHeight) <= parseInt(actualHeight) && kObj.initialRender)
                bSize = bSize + 18;
            newwidth = width - bSize;
            expandLength = kObj._expandedColumns.length - kObj._hiddenColumns.length;
            colWidth = parseInt((newwidth / expandLength).toFixed(2).split('.')[0]);
            extraValue = Math.ceil(parseFloat("0." + (newwidth / expandLength).toFixed(2).split('.')[1]) * expandLength);
            if (!kObj.model.columns[i].isCollapsed) {
                if (kObj._extraWidth < extraValue) {
                    colWidth = colWidth + 1;
                    kObj._extraWidth++;
                }
                $cols1.eq(i).css("width", colWidth + "px");
                $cols2.eq(i).css("width", colWidth + "px");
                kObj.model.columns[i].width = colWidth;
                kObj._columnsWidthCollection[i] = colWidth;
            }
        };
        this.kanbanObj = element;
    }
    ;
    InternalCommon.prototype._updateGroup = function (cardId, data) {
        var kObj = this.kanbanObj;
        if (ej.isNullOrUndefined(kObj._saveArgs))
            new ej.DataManager(kObj._currentJsonData).update(kObj.model.fields.primaryKey, data, "");
        if ($.type(data) && !data.count)
            this._renderSingleCard(cardId, data);
    };
    InternalCommon.prototype._removeIdSymbols = function (id) {
        if (typeof id == "string")
            id = id.replace(/[-\s']/g, '_');
        return id;
    };
    InternalCommon.prototype._enableKanbanRTL = function () {
        if (this.kanbanObj.model.enableRTL)
            this.kanbanObj.element.addClass("e-rtl");
        else
            this.kanbanObj.element.removeClass("e-rtl");
    };
    InternalCommon.prototype._getEmptyTbody = function () {
        var $emptyTd = ej.buildTag('td.e-emptycard', this.kanbanObj.localizedLabels.EmptyCard, {}, { colSpan: this.kanbanObj.model.columns.length });
        return $(document.createElement("tr")).append($emptyTd);
    };
    InternalCommon.prototype._renderSingleCard = function (primaryKey, card) {
        var kObj = this.kanbanObj, curEle = kObj.element.find("div[id='" + primaryKey + "']"), proxy = kObj, curTr, curTd;
        if (!kObj._dropped) {
            var swimlaneKey = proxy.model.fields.swimlaneKey;
            if (!ej.isNullOrUndefined(swimlaneKey)) {
                var unassignedGroup = kObj.model.swimlaneSettings.unassignedGroup;
                if (unassignedGroup.enable && unassignedGroup.keys.length > 0)
                    card = kObj._checkKbnUnassigned(card);
                var slKey = this._removeIdSymbols(card[swimlaneKey]);
                var slTr = kObj.element.find("tr[id='" + slKey + "']");
                if (slTr.length > 0)
                    curTr = slTr.next();
            }
            else
                curTr = kObj.element.find(".e-columnrow:first");
            curTd = $(curTr).find("td.e-rowcell").eq(kObj._getColumnKeyIndex(card[kObj.model.keyField]));
            $(curEle).remove();
            if (curTd.length > 0)
                $(curTd).children().hasClass("e-customaddbutton") ? $($.render[kObj._id + "_cardTemplate"](card)).insertBefore($(curTd).find(".e-customaddbutton")) : $(curTd).append($.render[kObj._id + "_cardTemplate"](card));
        }
        else {
            var cTemp = $.render[kObj._id + "_cardTemplate"](card);
            if (ej.browserInfo().name == "msie" && ej.browserInfo().version == "8.0")
                $(curEle).after(cTemp);
            else {
                $(curEle).replaceWith(cTemp);
                var index = $.inArray(primaryKey, kObj._collapsedCards);
                if (index != -1)
                    kObj.toggleCard(primaryKey);
            }
        }
        if (kObj.KanbanDragAndDrop)
            kObj.KanbanDragAndDrop._addDragableClass();
        if (kObj.KanbanSelection)
            kObj.KanbanSelection._selectionOnRerender();
    };
    InternalCommon.prototype._getKanbanCardData = function (data, key) {
        return (new ej.DataManager(data).executeLocal(new ej.Query().where(this.kanbanObj.model.fields.primaryKey, ej.FilterOperators.equal, key)));
    };
    InternalCommon.prototype._kbnHeaderAndCellEvents = function ($target) {
        var kObj = this.kanbanObj, args = {}, cards = $target.find('.e-kanbancard'), hTrgt = $target, key, selCards = $target.find('.e-cardselection'), headerIndex, proxy = this, cellIndex = $target.index(), row = $target.parents('.e-columnrow'), cells;
        cells = kObj.element.find('.e-rowcell.e-droppable');
        key = $target.attr('data-ej-mappingkey');
        if (hTrgt.parents('.e-headercell').length > 0)
            hTrgt = $target.parents('.e-headercell');
        if (hTrgt.hasClass('e-headercell')) {
            var curCell;
            headerIndex = cellIndex = hTrgt.index();
            curCell = cells.eq(headerIndex);
            key = curCell.attr('data-ej-mappingkey');
            if (kObj.model.fields.swimlaneKey)
                curCell = $("td[data-ej-mappingkey~='" + key + "']");
            cards = curCell.find('.e-kanbancard');
            selCards = curCell.find('.e-cardselection');
            row = curCell.parents('.e-columnrow');
        }
        if ($target.hasClass('e-rowcell') || !hTrgt.hasClass('e-stackedHeaderCell')) {
            var skey = row.prev('.e-swimlanerow').find('.e-slkey').text(), selIndexes = [], predicates = [];
            if (!ej.isNullOrUndefined(key)) {
                var key = typeof (key) == "object" ? key : key.split(",");
                for (var j = 0; j < key.length; j++)
                    predicates.push(new ej.Predicate(kObj.model.keyField, ej.FilterOperators.equal, key[j], true));
            }
            else
                predicates.push(new ej.Predicate(kObj.model.keyField, ej.FilterOperators.equal, key, true));
            args["cardsInfo"] = function () {
                var cardsInfo = {}, index;
                cardsInfo["cards"] = cards;
                if (kObj.model.fields.swimlaneKey && $target.hasClass('e-rowcell'))
                    cardsInfo["cardsData"] = new ej.DataManager(kObj._currentJsonData).executeLocal(new ej.Query().where(ej.Predicate["or"](predicates)).where(kObj.model.fields.swimlaneKey, ej.FilterOperators.equal, skey));
                else
                    cardsInfo["cardsData"] = new ej.DataManager(kObj._currentJsonData).executeLocal(new ej.Query().where(ej.Predicate["or"](predicates)));
                cardsInfo["cardsCount"] = cards.length;
                if (kObj._selectedCardData.length > 0) {
                    index = $.inArray(cellIndex, kObj.selectedRowCellIndexes[0].cellIndex);
                    if (!ej.isNullOrUndefined(index) && index >= 0)
                        selIndexes.push(kObj.selectedRowCellIndexes[0].cardIndex[index]);
                }
                cardsInfo["selectedCardsIndexes"] = selIndexes;
                cardsInfo["selectedCardsData"] = new ej.DataManager(proxy._selectedCardData).executeLocal(new ej.Query().where(ej.Predicate["or"](predicates)));
                cardsInfo["selectedCards"] = selCards;
                return cardsInfo;
            };
        }
        if ($target.hasClass('e-rowcell')) {
            args["rowIndex"] = kObj.getIndexByRow(row);
            args["cellIndex"] = cellIndex;
            kObj._trigger('cellClick', args);
        }
        if (hTrgt.hasClass('e-stackedHeaderCell')) {
            args["text"] = $target.text();
            var sCards = [], selCards, colIndexes = [], selColIndexes = [], cardIndexes = [], stRows, data = [], selData = [];
            stRows = kObj.element.find('.e-stackedHeaderRow');
            args["data"] = function () {
                var columns, count = 0, index;
                var stackedColumns = kObj.model.stackedHeaderRows[stRows.index(hTrgt.parents('.e-stackedHeaderRow'))].stackedHeaderColumns;
                columns = stackedColumns[hTrgt.index()].column;
                columns = columns.split(',');
                for (var i = 0; i < columns.length; i++) {
                    var key = new ej.DataManager(kObj.model.columns).executeLocal(new ej.Query().where('headerText', ej.FilterOperators.equal, columns[i])), cell, cards, selectedCards;
                    cell = $("td[data-ej-mappingkey~='" + key[0].key + "']");
                    cards = cell.find('.e-kanbancard');
                    sCards.push(cards);
                    data.push(new ej.DataManager(kObj._currentJsonData).executeLocal(new ej.Query().where(kObj.model.keyField, ej.FilterOperators.equal, key[0].key)));
                    cellIndex = cells.index($("td[data-ej-mappingkey~='" + key[0].key + "']")[0]);
                    if (kObj._selectedCardData.length > 0) {
                        index = $.inArray(cellIndex, kObj.selectedRowCellIndexes[0].cellIndex);
                        if (!ej.isNullOrUndefined(index) && index >= 0) {
                            selectedCards = cell.find('.e-cardselection');
                            selCards.push(selectedCards);
                            selData.push(new ej.DataManager(kObj._selectedCardData).executeLocal(new ej.Query().where(kObj.model.keyField, ej.FilterOperators.equal, key[0].key)));
                            if (selectedCards.length > 0) {
                                selColIndexes.push(cellIndex);
                                cardIndexes.push(kObj.selectedRowCellIndexes[0].cardIndex[index]);
                            }
                        }
                    }
                    count = count + cards.length;
                    colIndexes.push(cellIndex);
                }
                var detials = {};
                detials["count"] = count;
                detials["cards"] = sCards;
                detials["cardsData"] = data;
                detials["cellIndexes"] = colIndexes;
                detials["selectedCellCardIndexes"] = { cellIndex: selColIndexes, cardIndex: cardIndexes };
                detials["selectedCards"] = selCards;
                detials["selectedCardsData"] = selData;
                return detials;
            };
            kObj._trigger('headerClick', args);
        }
        else if (hTrgt.hasClass('e-headercell')) {
            args["text "] = hTrgt.text();
            args["cellIndex"] = headerIndex;
            args["target"] = hTrgt;
            args["columnData"] = kObj.model.columns[headerIndex];
            kObj._trigger('headerClick', args);
            if (kObj.model.allowScrolling && kObj.model.allowToggleColumn)
                kObj.KanbanCommon._setWidthToColumns();
        }
    };
    InternalCommon.prototype._toggleCardByTarget = function ($target) {
        var kObj = this.kanbanObj;
        $target = $target.hasClass("e-expandcollapse") ? $target.find("div:first") : $target;
        if (!($target.hasClass("e-cardexpand") || $target.hasClass("e-cardcollapse")))
            return;
        var $header = $target.closest('div.e-cardheader'), $cardContent = $header.next(), primarykey = $header.find(".e-primarykey").text(), card = $($target).closest(".e-kanbancard"), cardId = card.attr('id');
        if ($target.hasClass("e-cardexpand")) {
            $target.removeClass("e-cardexpand").addClass("e-cardcollapse");
            card.addClass("e-collapsedcard");
            $header.append($cardContent.find(".e-text").clone());
            $cardContent.hide();
            if ($.inArray(cardId, kObj._collapsedCards) == -1)
                kObj._collapsedCards.push(cardId);
            var bottomTriangle = $cardContent.find('.e-bottom-triangle').clone();
            $header.append(bottomTriangle);
        }
        else {
            $target.removeClass("e-cardcollapse").addClass("e-cardexpand");
            card.removeClass("e-collapsedcard");
            $header.find(".e-text,.e-bottom-triangle").remove();
            $cardContent.show();
            var index = $.inArray(cardId, kObj._collapsedCards);
            if (index != -1)
                kObj._collapsedCards.splice(index, 1);
        }
        if (kObj.model.allowScrolling) {
            if (kObj.getScrollObject().isVScroll() || kObj.getScrollObject().isHScroll())
                kObj.getScrollObject().refresh();
            if (!kObj.getScrollObject().isVScroll())
                kObj.element.find(".e-kanbanheader").removeClass("e-scrollcss").children().removeClass("e-hscrollcss");
            else
                kObj.element.find(".e-kanbanheader").addClass("e-scrollcss").children().addClass("e-hscrollcss");
        }
        if (kObj.element.hasClass('e-responsive')) {
            var scroller = $target.parents('.e-cell-scrollcontent');
            if (scroller.length > 0)
                scroller.data('ejScroller').refresh();
        }
    };
    InternalCommon.prototype._priorityColData = function (colData, cData) {
        var cardIndex, pKey = this.kanbanObj.model.fields.primaryKey, prkey = this.kanbanObj.model.fields.priority;
        cardIndex = $.map(colData, function (obj, index) {
            if (obj[pKey] == cData[pKey])
                return index;
        });
        if (!ej.isNullOrUndefined(cardIndex[0]))
            colData.splice(cardIndex, 1);
        var index = cData[prkey] - 1;
        if (!ej.isNullOrUndefined(colData[index - 1])) {
            if (colData[index - 1][prkey] == cData[prkey])
                --index;
        }
        colData.splice(index, 0, cData);
        colData.sort(function (val1, val2) {
            return val1[prkey] - val2[prkey];
        });
        return colData;
    };
    InternalCommon.prototype._getPriorityData = function (priorityData, data) {
        var index, pKey = this.kanbanObj.model.fields.primaryKey;
        index = $.map(priorityData, function (obj, index) {
            if (obj[pKey] == data[pKey])
                return index;
        });
        if (!ej.isNullOrUndefined(index[0]))
            priorityData[index][this.kanbanObj.model.fields.priority] = data[this.kanbanObj.model.fields.priority];
        else
            priorityData.push(data);
        return priorityData;
    };
    InternalCommon.prototype._preventCardMove = function (currentcardkey, targetcardkey) {
        var kObj = this.kanbanObj, targetkey = typeof (targetcardkey) == "object" ? targetcardkey : targetcardkey.split(",");
        for (var k = 0; k < targetkey.length; k++) {
            if (currentcardkey == targetkey[k])
                return true;
            var AllowedTransitionsdrag = true, flow = kObj.model.workflows;
            if (!ej.isNullOrUndefined(flow) && flow.length > 0) {
                for (var i = 0; i < flow.length; i++) {
                    if (flow[i].key == currentcardkey && !ej.isNullOrUndefined(flow[i].allowedTransitions)) {
                        var array = typeof (flow[i].allowedTransitions) == "object" ? flow[i].allowedTransitions : flow[i].allowedTransitions.split(",");
                        if (array.length == 1 && array[0].length == 0)
                            return true;
                        for (var j = 0; j < array.length; j++) {
                            if (targetkey[k] == array[j]) {
                                return true;
                            }
                            else {
                                AllowedTransitionsdrag = false;
                            }
                        }
                    }
                }
            }
        }
        if (AllowedTransitionsdrag)
            return true;
        else
            return false;
    };
    InternalCommon.prototype._updateKbnPriority = function (priorityData, cData) {
        var kObj = this.kanbanObj, currData = kObj._currentJsonData, colData, oldData, primary = kObj.model.fields.primaryKey, prkey = kObj.model.fields.priority, slKey = kObj.model.fields.swimlaneKey;
        if ((!ej.isNullOrUndefined(kObj._filterToolBar) && kObj._filterToolBar.find('li.e-select').length > 0) || (kObj._searchBar != null && kObj._searchBar.find(".e-cancel").length > 0))
            currData = kObj._initialData;
        oldData = this._getKanbanCardData(currData, cData[primary])[0];
        cData[prkey] = parseInt(cData[prkey]);
        if (ej.isNullOrUndefined(slKey))
            colData = new ej.DataManager(currData).executeLocal(new ej.Query().where(kObj.model.keyField, ej.FilterOperators.equal, cData[kObj.model.keyField]));
        else
            colData = new ej.DataManager(currData).executeLocal(new ej.Query().where(kObj.model.keyField, ej.FilterOperators.equal, cData[kObj.model.keyField]).where(slKey, ej.FilterOperators.equal, cData[slKey]));
        colData = colData.slice();
        var proxy = kObj, pkey = cData[primary];
        colData.sort(function (val1, val2) {
            return val1[prkey] - val2[prkey];
        });
        if (kObj._bulkPriorityData.length > 0) {
            for (var i = 0; i < colData.length; i++) {
                var index = $.map(kObj._bulkPriorityData, function (obj, index) {
                    if (obj[primary] == colData[i][primary])
                        return index;
                });
                if (!ej.isNullOrUndefined(index[0]))
                    colData[i][kObj.model.fields.priority] = kObj._bulkPriorityData[index][kObj.model.fields.priority];
            }
            colData.sort(function (val1, val2) {
                return val1[prkey] - val2[prkey];
            });
        }
        if (!ej.isNullOrUndefined(slKey)) {
            colData = this._priorityColData(colData, cData);
        }
        else
            colData = this._priorityColData(colData, cData);
        var init = cData[prkey] - 1;
        if (init != $.inArray(cData, colData))
            init = $.inArray(cData, colData);
        if (cData[prkey] - 1 > colData.length)
            init = colData.length - 1;
        if (init < 0)
            init = 0;
        for (var i = init; i < colData.length; i++) {
            if (!ej.isNullOrUndefined(colData[i])) {
                if (i < colData.length - 1 && !ej.isNullOrUndefined(colData[i + 1]) && colData[i][prkey] >= colData[i + 1][prkey]) {
                    colData[i + 1][prkey] = colData[i][prkey] + 1;
                    priorityData = this._getPriorityData(priorityData, colData[i + 1]);
                }
                else if (i == colData.length - 1 && !ej.isNullOrUndefined(colData[i - 1])) {
                    if (colData[i][prkey] < colData[i - 1][prkey]) {
                        colData[i][prkey] = colData[i - 1][prkey] + 1;
                        priorityData = this._getPriorityData(priorityData, colData[i]);
                    }
                }
            }
        }
        for (var i = init; i >= 0; i--) {
            if (!ej.isNullOrUndefined(colData[i])) {
                if (!ej.isNullOrUndefined(colData[i - 1])) {
                    if (i > 0 && colData[i - 1][prkey] >= colData[i][prkey]) {
                        colData[i - 1][prkey] = colData[i][prkey] - 1;
                        priorityData = this._getPriorityData(priorityData, colData[i - 1]);
                    }
                }
                else if (i == 0 && !ej.isNullOrUndefined(colData[i + 1])) {
                    if (colData[i][prkey] > colData[i + 1][prkey]) {
                        colData[i][prkey] = colData[i + 1][prkey] - 1;
                        priorityData = this._getPriorityData(priorityData, colData[i]);
                    }
                }
            }
        }
        return priorityData;
    };
    InternalCommon.prototype._kbnBulkUpdate = function (addData, deleteData, editdata) {
        var kObj = this.kanbanObj, bulkUpdate;
        if (kObj._dataManager instanceof ej.DataManager && !kObj._dataManager.dataSource.offline || (kObj._dataSource().adaptor instanceof ej.remoteSaveAdaptor)) {
            var bulkChanges;
            bulkChanges = {
                added: addData,
                deleted: deleteData,
                changed: editdata
            };
            $("#" + kObj._id).data("ejWaitingPopup").show();
            (bulkUpdate = kObj._dataManager.saveChanges(bulkChanges, kObj.model.fields.primaryKey, kObj.model.query._fromTable));
            if ($.isFunction(bulkUpdate.promise)) {
                bulkUpdate.done(function (e) {
                    kObj.KanbanCommon._processBindings(kObj._saveArgs);
                    kObj._cModifiedData = null;
                    kObj._cAddedRecord = null;
                    kObj._isAddNewClick = false;
                    kObj._currentData = null;
                    kObj._newCard = null;
                    kObj._saveArgs = null;
                    kObj._cardEditClick = null;
                    kObj._dblArgs = null;
                    kObj._cDeleteData = null;
                });
                bulkUpdate.fail(function (e) {
                    var argsKanban;
                    if (ej.isNullOrUndefined(kObj._saveArgs))
                        argsKanban = e;
                    else {
                        kObj._saveArgs.error = (e && e.error) ? e.error : e;
                        argsKanban = kObj._saveArgs;
                    }
                    kObj._renderAllCard();
                    kObj._enableDragandScroll();
                    kObj._cModifiedData = null;
                    kObj._cAddedRecord = null;
                    kObj._isAddNewClick = false;
                    kObj._currentData = null;
                    kObj._newCard = null;
                    kObj._saveArgs = null;
                    kObj._cardEditClick = null;
                    kObj._dblArgs = null;
                    kObj._cDeleteData = null;
                    kObj._trigger("actionFailure", argsKanban);
                    $("#" + kObj._id).data("ejWaitingPopup").hide();
                });
            }
        }
        else
            kObj.KanbanCommon._processBindings(kObj._saveArgs);
        if (bulkUpdate == undefined || !$.isFunction(bulkUpdate.promise)) {
            kObj._cModifiedData = null;
            kObj._cAddedRecord = null;
            kObj._isAddNewClick = false;
            kObj._currentData = null;
            kObj._newCard = null;
            kObj._saveArgs = null;
            kObj._cardEditClick = null;
            kObj._dblArgs = null;
            kObj._cDeleteData = null;
        }
    };
    InternalCommon.prototype._checkSkipAction = function (args) {
        switch (args.requestType) {
            case "save":
            case "delete":
                return true;
        }
        return false;
    };
    InternalCommon.prototype._processBindings = function (args) {
        var kObj = this.kanbanObj;
        args.primaryKey = kObj.model.fields.primaryKey;
        if (!this._checkSkipAction(args) && kObj._trigger("actionBegin", args))
            return true;
        kObj._ensureDataSource(args);
        kObj._editForm = kObj.element.find(".kanbanform");
        if (!(args.requestType == "beginedit") && !(args.requestType == "drop") && kObj._editForm.length != 0) {
            if (kObj._editForm.length > 1 && args.requestType == "save" && args.action == "edit")
                kObj._editForm = $(kObj._editForm[0]);
            $(kObj._editForm).find("select.e-dropdownlist").ejDropDownList("destroy");
            $(kObj._editForm).find("textarea.e-rte").ejRTE("destroy");
            $(kObj._editForm).find(".e-datepicker").ejDatePicker("destroy");
            $(kObj._editForm).find(".e-datetimepicker").ejDateTimePicker("destroy");
            $(kObj._editForm).find(".e-numerictextbox").ejNumericTextbox("destroy");
            $(kObj._editForm).addClass('e-formdestroy');
        }
        if (args && args.requestType == "delete")
            args.div.remove();
        if (args.requestType == "drop" || (kObj.model.showColumnWhenEmpty && args.requestType == "add"))
            kObj._templateRefresh = true;
        if (kObj._dataSource() instanceof ej.DataManager && args.requestType != "beginedit" && args.requestType != "cancel" && args.requestType != "add") {
            kObj.element.ejWaitingPopup("show");
            var queryPromise = kObj._queryPromise = kObj._dataSource().executeQuery(kObj.model.query);
            var proxy = kObj;
            if (proxy._dataSource().ready) {
                proxy._dataSource().ready.done(function () {
                    proxy.KanbanCommon._processDataRequest(proxy, args, queryPromise);
                });
            }
            else {
                proxy.KanbanCommon._processDataRequest(proxy, args, queryPromise);
            }
        }
        else
            kObj.sendDataRenderingRequest(args);
    };
    InternalCommon.prototype._processDataRequest = function (proxy, args, queryPromise) {
        queryPromise.done(ej.proxy(function (e) {
            proxy.element.ejWaitingPopup("hide");
            proxy._currentJsonData = proxy.currentViewData = e.result == null ? [] : e.result;
            proxy.KanbanCommon._processData(e, args);
        }));
        queryPromise.fail(ej.proxy(function (e) {
            proxy.element.ejWaitingPopup("hide");
            args.error = e.error;
            e = [];
            proxy.currentViewData = [];
            proxy.KanbanCommon._processData(e, args);
            proxy._trigger("actionFailure", args);
        }));
    };
    InternalCommon.prototype._processData = function (e, args) {
        var kObj = this.kanbanObj;
        if (!ej.isNullOrUndefined(kObj.model.filterSettings))
            if ((args.requestType == "filtering" || (kObj.model.filterSettings.length > 0 && args.requestType == "refresh")))
                kObj._filteredRecordsCount = e.count;
        kObj.sendDataRenderingRequest(args);
    };
    InternalCommon.prototype._moveCurrentCard = function (index, key, e) {
        var cellindex, rowCellIndex, cards, cardIndex, cellcards, tdCard, column, cellcardsCount, tdCellIncr, tdCellDecr, colCellSel, kObj = this.kanbanObj;
        rowCellIndex = kObj.selectedRowCellIndexes[0];
        var rowcardIndex = rowCellIndex.cardIndex;
        cellindex = rowCellIndex.cellIndex[rowCellIndex.cellIndex.length - 1];
        if (key == "down" || key == "up") {
            colCellSel = $(kObj._columnRows[index]).find("td.e-rowcell").eq(cellindex);
            cellcards = colCellSel.find(".e-kanbancard");
            cardIndex = $(cellcards).index(colCellSel.find(".e-cardselection"));
            cellcardsCount = cellcards.length;
            if (key == "down") {
                if (ej.isNullOrUndefined(kObj.model.fields.swimlaneKey))
                    if (kObj.model.selectionType == "multiple")
                        cardIndex = rowcardIndex[rowCellIndex.cellIndex.length - 1][rowcardIndex[rowCellIndex.cellIndex.length - 1].length - 1];
                    else
                        cardIndex = rowcardIndex[rowCellIndex.cellIndex.length - 1];
                else if ((e.shiftKey || e.ctrlKey) && kObj.model.selectionType == "multiple")
                    cardIndex = rowcardIndex[rowCellIndex.cellIndex.length - 1][rowcardIndex[rowCellIndex.cellIndex.length - 1].length - 1];
                if (cardIndex == (cellcardsCount - 1) || cellcardsCount == 0)
                    if (index == kObj._columnRows.length - 1)
                        return;
                    else if ((!e.shiftKey && !e.ctrlKey) || (kObj.model.selectionType == "single"))
                        this._moveCurrentCard(index + 1, key, e);
                    else
                        return;
                else if (cellcards.eq(cardIndex + 1).hasClass("e-cardselection"))
                    kObj.KanbanSelection._cardSelection([[index, [cellindex], [cardIndex]]], $(cellcards[cardIndex]), e);
                else
                    kObj.KanbanSelection._cardSelection([[index, [cellindex], [cardIndex + 1]]], $(cellcards[cardIndex + 1]), e);
            }
            else if (key == "up") {
                if (ej.isNullOrUndefined(kObj.model.fields.swimlaneKey))
                    if (kObj.model.selectionType == "multiple")
                        cardIndex = rowCellIndex.cardIndex[rowCellIndex.cellIndex.length - 1][rowCellIndex.cardIndex[rowCellIndex.cellIndex.length - 1].length - 1];
                    else
                        cardIndex = rowCellIndex.cardIndex[rowCellIndex.cellIndex.length - 1];
                else if ((e.shiftKey || e.ctrlKey) && kObj.model.selectionType == "multiple")
                    cardIndex = rowCellIndex.cardIndex[rowCellIndex.cellIndex.length - 1][rowCellIndex.cardIndex[rowCellIndex.cellIndex.length - 1].length - 1];
                if (cellcardsCount == 0 || cardIndex == 0)
                    if (index == 0)
                        return;
                    else if ((!e.shiftKey && !e.ctrlKey) || (kObj.model.selectionType == "single"))
                        this._moveCurrentCard(index - 1, key, e);
                    else
                        return;
                else if (cellcards.eq(cardIndex - 1).hasClass("e-cardselection"))
                    kObj.KanbanSelection._cardSelection([[index, [cellindex], [cardIndex]]], $(cellcards[cardIndex]), e);
                else {
                    if (cardIndex != -1)
                        kObj.KanbanSelection._cardSelection([[index, [cellindex], [cardIndex - 1]]], $(cellcards[cardIndex - 1]), e);
                    else
                        kObj.KanbanSelection._cardSelection([[index, [cellindex], [cellcardsCount - 1]]], $(cellcards[cellcardsCount - 1]), e);
                }
            }
            if ((!e.shiftKey && !e.ctrlKey) || ("single"))
                if (kObj.element.find(".e-cardselection").closest("tr.e-columnrow:visible").length == 0)
                    kObj.KanbanSwimlane.toggle($(kObj._columnRows[kObj.selectedRowCellIndexes[0].rowIndex]).prev().prev(".e-swimlanerow").find(".e-slcollapse"));
        }
        else {
            var card, cardselec, switchcard;
            column = $(kObj._columnRows[rowCellIndex.rowIndex]);
            tdCard = column.find("td.e-rowcell");
            cellcards = tdCard.eq(index).find(".e-kanbancard");
            cards = tdCard.eq(index).find(".e-kanbancard");
            tdCellIncr = tdCard.eq(index + 1);
            tdCellDecr = tdCard.eq(index - 1);
            card = kObj.element.find(".e-kanbancard");
            cardselec = kObj.element.find(".e-cardselection");
            if ((!tdCellDecr.is(":visible") || !tdCellIncr.is(":visible")) && !ej.isNullOrUndefined(kObj.model.fields.swimlaneKey))
                if (kObj.element.find(".e-cardselection").closest("tr.e-columnrow:visible").length == 0)
                    kObj.KanbanSwimlane.toggle($(kObj._columnRows[kObj.selectedRowCellIndexes[0].rowIndex]).prev().prev(".e-swimlanerow").find(".e-slcollapse"));
            if ((e.shiftKey || e.ctrlKey) && kObj.model.selectionType == "multiple")
                cardIndex = rowCellIndex.cardIndex[rowCellIndex.cellIndex.length - 1][rowCellIndex.cardIndex[rowCellIndex.cellIndex.length - 1].length - 1];
            else if (kObj.model.selectionType == "single")
                cardIndex = rowCellIndex.cardIndex[0];
            else
                cardIndex = rowCellIndex.cardIndex[0][0];
            if (key == "right") {
                switchcard = card.eq(card.index(cardselec) + 1);
                if (index == tdCard.length - 1) {
                    if (switchcard.length > 0 && ((!e.shiftKey && !e.ctrlKey) || (kObj.model.selectionType == "single")) && !ej.isNullOrUndefined(kObj.model.fields.swimlaneKey)) {
                        kObj.KanbanSelection._cardSelection([[kObj._columnRows.index(switchcard.closest("tr.e-columnrow")), [switchcard.closest("tr.e-columnrow").find("td.e-rowcell").index(switchcard.closest("td.e-rowcell"))], [0]]], switchcard, e);
                        if (kObj.element.find(".e-cardselection").closest("tr:visible").length == 0)
                            kObj.KanbanSwimlane.toggle($(kObj._columnRows[kObj.selectedRowCellIndexes[0].rowIndex]).prev().prev(".e-swimlanerow").find(".e-slcollapse"));
                    }
                    return;
                }
                if (tdCellIncr.find(".e-kanbancard:visible").length > 0) {
                    cards = tdCellIncr.find(".e-kanbancard");
                    if (cards.eq(cardIndex).length > 0)
                        kObj.KanbanSelection._cardSelection([[rowCellIndex.rowIndex, [index + 1], [cardIndex]]], $(cards[cardIndex]), e);
                    else
                        kObj.KanbanSelection._cardSelection([[rowCellIndex.rowIndex, [index + 1], [cards.length - 1]]], $(cards[cards.length - 1]), e);
                    if (((!e.shiftKey && !e.ctrlKey) || (kObj.model.selectionType == "single")) && !ej.isNullOrUndefined(kObj.model.fields.swimlaneKey))
                        if (kObj.element.find(".e-cardselection").closest("tr.e-columnrow:visible").length == 0)
                            kObj.KanbanSwimlane.toggle($(kObj._columnRows[kObj.selectedRowCellIndexes[0].rowIndex]).prev().prev(".e-swimlanerow").find(".e-slcollapse"));
                }
                else
                    this._moveCurrentCard(index + 1, key, e);
            }
            else if (key == "left") {
                if (card.index(cardselec) != 0)
                    switchcard = card.eq(card.index(cardselec) - 1);
                if (index == 0) {
                    if ((!e.shiftKey && !e.ctrlKey) && !ej.isNullOrUndefined(kObj.model.fields.swimlaneKey)) {
                        kObj.KanbanSwimlane.toggle($(column).prev().find(".e-slexpand"));
                        if (ej.isNullOrUndefined(switchcard))
                            return;
                        if (switchcard.length > 0 && (!e.shiftKey && !e.ctrlKey) || (kObj.model.selectionType == "single")) {
                            kObj.KanbanSelection._cardSelection([[kObj._columnRows.index(switchcard.closest("tr.e-columnrow")), [switchcard.closest("tr.e-columnrow").find("td.e-rowcell").index(switchcard.closest("td.e-rowcell"))], [0]]], switchcard, e);
                            if (kObj.element.find(".e-cardselection").closest("tr.e-columnrow:visible").length == 0)
                                kObj.KanbanSwimlane.toggle($(kObj._columnRows[kObj.selectedRowCellIndexes[0].rowIndex]).prev().prev(".e-swimlanerow").find(".e-slcollapse"));
                        }
                    }
                    return;
                }
                if (tdCellDecr.find(".e-kanbancard:visible").length > 0) {
                    cards = tdCellDecr.find(".e-kanbancard");
                    if (cards.eq(cardIndex).length > 0)
                        kObj.KanbanSelection._cardSelection([[rowCellIndex.rowIndex, [index - 1], [cardIndex]]], $(cards[cardIndex]), e);
                    else
                        kObj.KanbanSelection._cardSelection([[rowCellIndex.rowIndex, [index - 1], [cards.length - 1]]], $(cards[cards.length - 1]), e);
                    if (((!e.shiftKey && !e.ctrlKey) || (kObj.model.selectionType == "single")) && !ej.isNullOrUndefined(kObj.model.fields.swimlaneKey))
                        if (kObj.element.find(".e-cardselection").closest("tr.e-columnrow:visible").length == 0)
                            kObj.KanbanSwimlane.toggle($(kObj._columnRows[kObj.selectedRowCellIndexes[0].rowIndex]).prev().prev(".e-swimlanerow").find(".e-slexpand"));
                }
                else
                    this._moveCurrentCard(index - 1, key, e);
            }
        }
    };
    InternalCommon.prototype._kanbanKeyPressed = function (action, target, e, event) {
        var selectedcard, kanbancard, rowCellIndex, cellIndex, $target = $(target), returnValue = true, kObj = this.kanbanObj;
        selectedcard = kObj.element.find(".e-cardselection");
        kanbancard = kObj.element.find(".e-kanbancard:visible");
        if (e.code == 13 && target.tagName == 'INPUT' && $target.closest("#" + kObj._id + "_toolbarItems_search").length)
            action = "searchRequest";
        rowCellIndex = kObj.selectedRowCellIndexes[0];
        var swimlane = !ej.isNullOrUndefined(kObj.model.fields.swimlaneKey);
        switch (action) {
            case "editCard":
                if (selectedcard.length > 0 && kObj.model.editSettings.allowEditing) {
                    cellIndex = rowCellIndex.cellIndex;
                    selectedcard = kObj._columnRows.eq(rowCellIndex.rowIndex).find("td.e-rowcell").eq(cellIndex[cellIndex.length - 1]).find(".e-kanbancard").eq(rowCellIndex.cardIndex[cellIndex.length - 1]);
                    kObj.KanbanEdit.startEdit(selectedcard);
                }
                break;
            case "insertCard":
                if (kObj.model.editSettings.allowAdding)
                    kObj.KanbanEdit.addCard();
                break;
            case "swimlaneExpandAll":
                if (kObj.KanbanSwimlane)
                    kObj.KanbanSwimlane.expandAll();
                break;
            case "swimlaneCollapseAll":
                if (kObj.KanbanSwimlane)
                    kObj.KanbanSwimlane.collapseAll();
                break;
            case "downArrow":
                if (selectedcard.length > 0 && (document.activeElement["id"] == kObj._id))
                    this._moveCurrentCard(rowCellIndex.rowIndex, "down", e);
                break;
            case "upArrow":
                if (selectedcard.length > 0 && (document.activeElement["id"] == kObj._id)) {
                    this._moveCurrentCard(rowCellIndex.rowIndex, "up", e);
                }
                break;
            case "leftArrow":
                if (selectedcard.length > 0 && (document.activeElement["id"] == kObj._id))
                    this._moveCurrentCard(rowCellIndex.cellIndex[rowCellIndex.cellIndex.length - 1], "left", e);
                if (kObj.model.isResponsive && kObj.element.hasClass('e-responsive'))
                    kObj.KanbanAdaptive._kbnRightSwipe();
                break;
            case "rightArrow":
                if (selectedcard.length > 0 && (document.activeElement["id"] == kObj._id))
                    this._moveCurrentCard(rowCellIndex.cellIndex[rowCellIndex.cellIndex.length - 1], "right", e);
                if (kObj.model.isResponsive && kObj.element.hasClass('e-responsive'))
                    kObj.KanbanAdaptive._kbnLeftSwipe();
                break;
            case "multiSelectionByDownArrow":
                e.ctrlKey = true;
                if (selectedcard.length > 0)
                    this._moveCurrentCard(rowCellIndex.rowIndex, "down", e);
                break;
            case "multiSelectionByUpArrow":
                e.ctrlKey = true;
                if (selectedcard.length > 0)
                    this._moveCurrentCard(rowCellIndex.rowIndex, "up", e);
                break;
            case "multiSelectionByRightArrow":
                e.shiftKey = true;
                if (selectedcard.length > 0)
                    this._moveCurrentCard(rowCellIndex.cellIndex[rowCellIndex.cellIndex.length - 1], "right", e);
                break;
            case "multiSelectionByLeftArrow":
                e.shiftKey = true;
                if (selectedcard.length > 0)
                    this._moveCurrentCard(rowCellIndex.cellIndex[rowCellIndex.cellIndex.length - 1], "left", e);
                break;
            case "firstCardSelection":
                if (kObj.model.allowSelection && (document.activeElement["id"] == kObj._id)) {
                    kObj.KanbanSelection.clear();
                    kanbancard.eq(0).addClass("e-cardselection");
                    selectedcard = kObj.element.find(".e-cardselection");
                    var cardIndex = $(kObj._columnRows).find(".e-cardselection").index();
                    var selectionIndex = $(kObj._columnRows).find(".e-cardselection").parent().children().eq(0).hasClass("e-limits") ? cardIndex - 1 : cardIndex;
                    if (kObj.model.selectionType == "multiple")
                        kObj.selectedRowCellIndexes.push({ cardIndex: [[selectionIndex]], cellIndex: [selectedcard.parent().index()], rowIndex: $(kObj._columnRows).index(selectedcard.parents(".e-columnrow")) });
                    else
                        kObj.selectedRowCellIndexes.push({ cardIndex: [selectionIndex], cellIndex: [selectedcard.parent().index()], rowIndex: $(kObj._columnRows).index(selectedcard.parents(".e-columnrow")) });
                }
                break;
            case "lastCardSelection":
                if (kObj.model.allowSelection && (document.activeElement["id"] == kObj._id)) {
                    kObj.KanbanSelection.clear();
                    kanbancard.eq(kanbancard.length - 1).addClass("e-cardselection");
                    selectedcard = kObj.element.find(".e-cardselection");
                    selectedcard = kObj.element.find(".e-cardselection");
                    var cardIndex = $(kObj._columnRows).find(".e-cardselection").index();
                    var selectionIndex = $(kObj._columnRows).find(".e-cardselection").parent().children().eq(0).hasClass("e-limits") ? cardIndex - 1 : cardIndex;
                    if (kObj.model.selectionType == "multiple")
                        kObj.selectedRowCellIndexes.push({ cardIndex: [[selectionIndex]], cellIndex: [selectedcard.parent().index()], rowIndex: $(kObj._columnRows).index(selectedcard.parents(".e-columnrow")) });
                    else
                        kObj.selectedRowCellIndexes.push({ cardIndex: [selectionIndex], cellIndex: [selectedcard.parent().index()], rowIndex: $(kObj._columnRows).index(selectedcard.parents(".e-columnrow")) });
                }
                break;
            case "cancelRequest":
                if ($("#" + kObj._id + "_dialogEdit:visible").length > 0)
                    kObj.KanbanEdit.cancelEdit();
                else if (selectedcard.length > 0)
                    kObj.KanbanSelection.clear();
                break;
            case "searchRequest":
                kObj.KanbanFilter.searchCards($target.val());
                returnValue = false;
                break;
            case "saveRequest":
                if ($("#" + kObj._id + "_dialogEdit:visible").length > 0)
                    kObj.KanbanEdit.endEdit();
                break;
            case "deleteCard":
                if (selectedcard.length > 0 && $("#" + kObj._id + "_dialogEdit:visible").length <= 0 && !ej.isNullOrUndefined(kObj.model.fields.primaryKey))
                    kObj.KanbanEdit.deleteCard(selectedcard.attr("id"));
                break;
            case "selectedSwimlaneExpand":
                if (selectedcard.length > 0 && swimlane)
                    if (!selectedcard.is(":visible"))
                        kObj.KanbanSwimlane.toggle($(kObj._columnRows[kObj.selectedRowCellIndexes[0].rowIndex]).prev().prev(".e-swimlanerow").find(".e-slexpandcollapse"));
                break;
            case "selectedSwimlaneCollapse":
                if (selectedcard.length > 0 && swimlane)
                    if (selectedcard.is(":visible"))
                        kObj.KanbanSwimlane.toggle($(kObj._columnRows[kObj.selectedRowCellIndexes[0].rowIndex]).prev().find(".e-slexpandcollapse"));
                break;
            case "selectedColumnCollapse":
                if (selectedcard.length > 0)
                    this._toggleField(kObj.model.columns[kObj.selectedRowCellIndexes[0].cellIndex[0]].headerText);
                break;
            case "selectedColumnExpand":
                if (kObj._collapsedColumns.length != 0)
                    this._toggleField(kObj._collapsedColumns[kObj._collapsedColumns.length - 1]);
                break;
            case "focus":
                kObj.element.find(".e-cardselection").focus();
                break;
            default:
                returnValue = true;
        }
        return returnValue;
    };
    InternalCommon.prototype._createStackedRow = function (stackedHeaderRow) {
        var $tr = ej.buildTag('tr.e-columnheader e-stackedHeaderRow', "", {}, {}), sHeader = [], kObj = this.kanbanObj;
        for (var s = 0; s < kObj.model.columns.length; s++) {
            var column = kObj.model.columns[s];
            if (column.visible != false) {
                var headerText = '';
                var sColumn = stackedHeaderRow.stackedHeaderColumns;
                for (var cl = 0; cl < sColumn.length; cl++) {
                    if (sColumn[cl].column.indexOf(column.headerText) != -1) {
                        headerText = sColumn[cl].headerText;
                    }
                }
                sHeader.push(headerText);
            }
        }
        var colsPanList = [], css = "";
        for (var h = 0; h < sHeader.length; h++) {
            var colSpan = 1;
            for (var j = h + 1; j < sHeader.length; j++) {
                if ((sHeader[h] != "") && (sHeader[j] != "") && sHeader[h] == sHeader[j]) {
                    colSpan++;
                }
                else
                    break;
            }
            colsPanList.push({
                sapnCount: colSpan,
                headerText: sHeader[h],
                css: (sHeader[h] != "") ? css : "e-sheader"
            });
            h += colSpan - 1;
            css = "";
        }
        for (var c = 0; c < colsPanList.length; c++) {
            var $div = ej.buildTag('div' + '', colsPanList[c].headerText, {}, {});
            var $th = ej.buildTag('th.e-headercell e-stackedHeaderCell ' + colsPanList[c].css + '', "", {}, { 'colspan': colsPanList[c].sapnCount }).append($div);
            $tr.append($th);
        }
        return $tr;
    };
    InternalCommon.prototype._refreshStackedHeader = function () {
        var kObj = this.kanbanObj, stackedRows = kObj.model.stackedHeaderRows, stackHeaderRow = kObj.element.find(".e-stackedHeaderRow");
        for (var i = 0; i < stackedRows.length; i++) {
            var stackedTr = this._createStackedRow(stackedRows[i]);
            if (stackHeaderRow.length > 0)
                stackHeaderRow.remove();
            $(kObj.getHeaderTable().find(".e-columnheader").before(stackedTr));
        }
        kObj.model.allowScrolling && kObj.KanbanScroll._refreshScroller({ requestType: "refresh" });
    };
    InternalCommon.prototype._stackedHeadervisible = function () {
        var stackHeadercell = this.kanbanObj.element.find(".e-columnheader .e-stackedHeaderCell ");
        for (var i = 0; i < stackHeadercell.length; i++)
            if (stackHeadercell[i].offsetWidth < stackHeadercell[i].scrollWidth)
                stackHeadercell.eq(i).find("div").addClass("e-hide");
    };
    InternalCommon.prototype._kanbanUpdateCard = function (primaryKey, data) {
        var kbnCurrentData, kObj = this.kanbanObj, args = kObj._saveArgs, header, curData, cardKey, pKey = kObj.model.fields.primaryKey;
        var oldData = new ej.DataManager(kObj._currentJsonData).executeLocal(new ej.Query().where(pKey, ej.FilterOperators.equal, data[pKey]));
        if (oldData.length > 0)
            data = $.extend(oldData[0], data);
        var swimlaneKey = kObj.model.fields.swimlaneKey, unassignedGroup = kObj.model.swimlaneSettings.unassignedGroup;
        if (!ej.isNullOrUndefined(swimlaneKey) && unassignedGroup.enable && unassignedGroup.keys.length > 0) {
            if (ej.isNullOrUndefined(data.length))
                data = kObj._checkKbnUnassigned(data);
            else {
                for (var i = 0; i < data.length; i++)
                    data[i] = kObj._checkKbnUnassigned(data[i]);
            }
        }
        if (ej.isNullOrUndefined(args)) {
            kObj._saveArgs = args = { data: data, requestType: "save", action: "edit", primaryKeyValue: primaryKey };
            kObj._cModifiedData = data;
        }
        if (!(kObj._dataSource() instanceof ej.DataManager))
            kbnCurrentData = kObj._dataSource();
        else
            kbnCurrentData = kObj._dataSource().dataSource.json;
        if (kbnCurrentData.length == 0 && kObj._currentJsonData.length > 0)
            kbnCurrentData = kObj._currentJsonData;
        if (kObj._dataManager instanceof ej.DataManager && !kObj._dataManager.dataSource.offline && (!ej.isNullOrUndefined(args) && args.requestType != "drop") && kObj.model.enableTotalCount && (kObj._filterCollection.length > 0 || kObj.model.searchSettings.key.length > 0)) {
            curData = new ej.DataManager(kbnCurrentData).executeLocal(new ej.Query().where(kObj.model.fields.primaryKey, ej.FilterOperators.equal, data[kObj.model.fields.primaryKey]));
            header = kObj.headerContent.find(".e-headercell");
            if (!ej.isNullOrUndefined(curData) && args.action == "edit") {
                cardKey = kObj._getColumnKeyIndex(currentData[0][kObj.model.keyField]);
                header.eq(cardKey).addClass("e-cardDraggedHeader");
            }
            if (!ej.isNullOrUndefined(data)) {
                cardKey = kObj._getColumnKeyIndex(data[kObj.model.keyField]);
                header.eq(cardKey).addClass("e-cardDroppedHeader");
            }
        }
        if (ej.isNullOrUndefined(args) || (!ej.isNullOrUndefined(args) && args.requestType != "drop")) {
            if (kObj.model.fields.priority) {
                var priorityData = [], currentData;
                if ($.isPlainObject(data)) {
                    priorityData.push(data);
                    if (ej.isNullOrUndefined(data[kObj.model.fields.priority])) {
                        currentData = new ej.DataManager(kbnCurrentData).executeLocal(new ej.Query().where(kObj.model.fields.primaryKey, ej.FilterOperators.equal, data[kObj.model.fields.primaryKey]));
                        if (currentData.length > 0)
                            data[kObj.model.fields.priority] = currentData[0][kObj.model.fields.priority];
                        else {
                            var colData = new ej.DataManager(kbnCurrentData).executeLocal(new ej.Query().where(kObj.model.keyField, ej.FilterOperators.equal, data[kObj.model.keyField]));
                            data[kObj.model.fields.priority] = colData[colData.length - 1][kObj.model.fields.priority] + 1;
                        }
                    }
                    data = kObj.KanbanCommon._updateKbnPriority(priorityData, data);
                }
                else {
                    var cData, fData, primary = kObj.model.fields.primaryKey;
                    for (var i = 0; i < data.length; i++) {
                        priorityData = $.extend(true, [], data);
                        if (ej.isNullOrUndefined(data[i][kObj.model.fields.priority])) {
                            currentData = new ej.DataManager(kbnCurrentData).executeLocal(new ej.Query().where(kObj.model.fields.primaryKey, ej.FilterOperators.equal, data[i][kObj.model.fields.primaryKey]));
                            if (currentData.length > 0)
                                data[i][kObj.model.fields.priority] = currentData[0][kObj.model.fields.priority];
                            else {
                                var colData = new ej.DataManager(kbnCurrentData).executeLocal(new ej.Query().where(kObj.model.keyField, ej.FilterOperators.equal, data[i][kObj.model.keyField]));
                                data[i][kObj.model.fields.priority] = colData[colData.length - 1][kObj.model.fields.priority] + 1;
                            }
                        }
                        cData = data[i];
                        fData = kObj.KanbanCommon._updateKbnPriority(priorityData, cData);
                        for (var j = 0; j < fData.length; j++) {
                            if (kObj._bulkPriorityData.length > 0) {
                                var cardIndex = $.map(kObj._bulkPriorityData, function (obj, index) {
                                    if (obj[primary] == fData[j][primary])
                                        return index;
                                });
                                if (!ej.isNullOrUndefined(cardIndex[0])) {
                                    kObj._bulkPriorityData.splice(cardIndex, 1);
                                    kObj._bulkPriorityData.splice(cardIndex, 0, fData[j]);
                                }
                                else
                                    kObj._bulkPriorityData.push(fData[j]);
                            }
                            else
                                kObj._bulkPriorityData.push(fData[j]);
                        }
                    }
                    data = kObj._bulkPriorityData;
                    kObj._bulkPriorityData = [];
                }
            }
        }
        var cData = [], addData = [], deleteData = [], editData = [];
        if (ej.isNullOrUndefined(data) && primaryKey)
            data = new ej.DataManager(kObj._currentJsonData).executeLocal(new ej.Query().where(kObj.model.fields.primaryKey, ej.FilterOperators.equal, primaryKey))[0];
        data = ej.isNullOrUndefined(data) ? null : data;
        if ($.isPlainObject(data))
            cData.push(data);
        else
            cData = data;
        if (kObj._isLocalData) {
            var queryManagar = kObj.model.query, cloned = queryManagar.clone();
            for (var i = 0; i < cData.length; i++) {
                var currentData, index;
                queryManagar = queryManagar.where(kObj.model.fields.primaryKey, ej.FilterOperators.equal, cData[i][kObj.model.fields.primaryKey]);
                currentData = kObj._dataManager.executeLocal(queryManagar);
                if (!(kObj._dataSource() instanceof ej.DataManager))
                    index = $.inArray(currentData.result[0], kObj._dataSource());
                else
                    index = $.inArray(currentData.result[0], kObj._dataSource().dataSource.json);
                if (index >= 0) {
                    if (!(kObj._dataSource() instanceof ej.DataManager))
                        $.extend(kObj._dataSource()[index], cData[i]);
                    else
                        $.extend(kObj._dataSource().dataSource.json[index], cData[i]);
                }
                else {
                    var tmpRcrd = cData[i];
                    kObj._cAddedRecord = null;
                    (kObj._dataSource() instanceof ej.DataManager) ? kObj._dataSource().dataSource.json.push(tmpRcrd) : kObj._dataSource(undefined, true).splice(kObj._dataSource().length, 0, tmpRcrd);
                }
                queryManagar["queries"] = queryManagar["queries"].slice(queryManagar["queries"].length);
            }
            queryManagar["queries"] = cloned["queries"];
        }
        if (args.requestType != "drop")
            args.data = cData;
        kObj._saveArgs = args;
        if (kObj._dataManager instanceof ej.DataManager && !kObj._dataManager.dataSource.offline || (kObj._dataSource().adaptor instanceof ej.remoteSaveAdaptor)) {
            if (args.requestType == "delete")
                deleteData.push(args.data[0]);
            else {
                for (var i = 0; i < cData.length; i++) {
                    var tempCard = this._getKanbanCardData(kObj._currentJsonData, cData[i][kObj.model.fields.primaryKey]);
                    if (tempCard.length > 0)
                        editData.push(cData[i]);
                    else
                        addData.push(cData[i]);
                }
            }
            kObj.KanbanCommon._kbnBulkUpdate(addData, deleteData, editData);
        }
        else {
            kObj.KanbanCommon._processBindings(kObj._saveArgs);
            kObj._cModifiedData = null;
            kObj._cAddedRecord = null;
            kObj._isAddNewClick = false;
            kObj._currentData = null;
            kObj._newCard = null;
            kObj._saveArgs = null;
            kObj._cardEditClick = null;
            kObj._dblArgs = null;
        }
    };
    InternalCommon.prototype._getMetaColGroup = function () {
        var $colgroup = ej.buildTag("colgroup", "", {}, {}), kObj = this.kanbanObj;
        for (var i = 0; i < kObj.model.columns.length; i++) {
            var $col = $(document.createElement("col"));
            if (kObj.model.allowToggleColumn)
                kObj.model.columns[i]["isCollapsed"] === true && $col.addClass("e-shrinkcol");
            kObj.model.columns[i]["visible"] === false && $col.addClass("e-hide");
            $colgroup.append($col);
        }
        return $colgroup;
    };
    InternalCommon.prototype._kanbanToolbarClick = function (sender, kObj) {
        var $searchIcon;
        var currentTarget = sender.currentTarget;
        var target = sender.target;
        if ($(currentTarget).hasClass("e-quickfilter"))
            return false;
        if (kObj.KanbanFilter && target.tagName == 'INPUT' && $(target).parent().next().hasClass("e-cancel") && $(target).val().length == 0)
            kObj.KanbanFilter.searchCards("");
        if (kObj.model.isResponsive && kObj.element.hasClass('e-responsive')) {
            $(kObj["itemsContainer"]).parent().children().not('.e-searchbar').hide();
            if (sender.keyCode == 8) {
                kObj.KanbanAdaptive._kbnTimeoutSearch(kObj.element, sender);
            }
        }
        if (sender.event == undefined)
            return false;
        var filterName = $(currentTarget).text();
        for (var count = 0; count < kObj.model.filterSettings.length; count++) {
            if (kObj.model.filterSettings[count]["text"] == filterName)
                break;
        }
        var filterValue = (count == kObj.model.filterSettings.length ? null : kObj.model.filterSettings[count]);
        var args = { itemName: $(currentTarget).attr("data-content"), itemId: currentTarget.id, target: target, currentTarget: currentTarget, itemIndex: $(currentTarget).index(), toolbarData: sender, itemText: filterName, model: kObj.model, cancel: false, type: "toolbarClick" };
        if (kObj._trigger("toolbarClick", args))
            return false;
        if (args.itemId == kObj._id + "_toolbarItems" + "_search") {
            if (args.target.nodeName == "A") {
                if (kObj.model.allowSearching && kObj._searchBar != null && $(args.currentTarget).find("input").val().length != 0) {
                    if ($(target).is(kObj._searchBar.find(".e-searchfind"))) {
                        kObj.KanbanFilter.searchCards($(args.currentTarget).find("input").val());
                    }
                    else if ($(target).is(kObj._searchBar.find(".e-cancel"))) {
                        kObj.KanbanFilter.searchCards("");
                    }
                }
            }
            if (!kObj._isWatermark) {
                kObj._searchInput.blur(function () {
                    !kObj._searchInput.val() && kObj._hiddenSpan.css("display", "block");
                });
                kObj._hiddenSpan.css("display", "none");
            }
        }
        else if ($(args.currentTarget).hasClass("e-printlist"))
            kObj.print();
        else if (kObj.KanbanFilter && !$(currentTarget).parent().hasClass("e-customtoolbar"))
            kObj.KanbanFilter._filterHandler(filterValue, currentTarget);
        return false;
    };
    InternalCommon.prototype._kanbanSetModel = function (options, kObj) {
        for (var prop in options) {
            var $content;
            switch (prop) {
                case "columns":
                    var columns = options.columns;
                    kObj.model.columns = [];
                    kObj._keyValue = [];
                    kObj.columns(columns, "add");
                    break;
                case "allowDragAndDrop":
                    kObj.model.allowDragAndDrop = options[prop];
                    if (kObj.model.allowDragAndDrop)
                        kObj.KanbanDragAndDrop = new ej.KanbanFeatures.DragAndDrop(kObj);
                    kObj._renderAllCard();
                    kObj._enableDragandScroll();
                    break;
                case "cssClass":
                    kObj.element.removeClass(kObj.model.cssClass).addClass(options[prop]);
                    break;
                case "allowFiltering":
                case "filterSettings":
                    if (prop == "allowFiltering") {
                        kObj.model.allowFiltering = options[prop];
                        if (kObj.model.allowFiltering)
                            kObj.KanbanFilter = new ej.KanbanFeatures.Filter(kObj);
                        if (!kObj.model.allowSearching && kObj.model.filterSettings.length == 0 && !kObj.model.allowPrinting && kObj.model.customToolbarItems.length == 0)
                            kObj.KanbanFilter = null;
                    }
                    else {
                        if (prop == "filterSettings")
                            kObj.model.filterSettings = options[prop];
                        if (kObj.model.filterSettings.length > 0) {
                            kObj.element.find(".e-kanbantoolbar").remove();
                            kObj._filterCollection = [];
                            kObj._renderToolBar().insertBefore(kObj.element.find(".e-kanbanheader").first());
                            if (kObj.model.filterSettings.length > 0)
                                kObj.KanbanFilter = new ej.KanbanFeatures.Filter(kObj);
                        }
                        else {
                            kObj.element.find(".e-kanbantoolbar").remove();
                            kObj.model.filterSettings = [];
                            kObj._filterCollection = [];
                            kObj._renderToolBar().insertBefore(kObj.element.find(".e-kanbanheader").first());
                            if (!kObj.model.allowSearching && kObj.model.filterSettings.length == 0 && !kObj.model.allowPrinting && kObj.model.customToolbarItems.length == 0)
                                kObj.element.find(".e-kanbantoolbar").remove();
                            $(kObj.element.find(".e-kanbanheader")).replaceWith(kObj._renderHeader());
                            kObj.refresh();
                        }
                    }
                    break;
                case "allowSearching":
                    kObj.model.allowSearching = options[prop];
                    var selected = [];
                    if ((kObj.model.filterSettings.length != 0 || kObj.model.allowFiltering)) {
                        var selectedToolbar = kObj.element.find(".e-kanbantoolbar .e-tooltxt.e-select");
                        for (var i = 0; i < selectedToolbar.length; i++) {
                            selected.push(selectedToolbar.eq(i).index());
                        }
                    }
                    if (kObj.model.allowSearching) {
                        kObj.element.find(".e-kanbantoolbar").remove();
                        kObj.model.searchSettings.key = "";
                        kObj._renderToolBar().insertBefore(kObj.element.find(".e-kanbanheader").first());
                        for (var j = 0; j < selected.length; j++) {
                            kObj.element.find(".e-kanbantoolbar .e-tooltxt").eq(selected[j]).addClass("e-select");
                        }
                        if (kObj.model.allowSearching)
                            kObj.KanbanFilter = new ej.KanbanFeatures.Filter(kObj);
                    }
                    else {
                        kObj.KanbanFilter.clearSearch();
                        kObj.element.find(".e-kanbantoolbar").remove();
                        kObj._renderToolBar().insertBefore(kObj.element.find(".e-kanbanheader").first());
                        if (kObj.model.filterSettings.length == 0 && !kObj.model.allowPrinting && kObj.model.customToolbarItems.length == 0)
                            kObj.element.find(".e-kanbantoolbar").remove();
                        if ((kObj.model.filterSettings.length != 0 || kObj.model.allowFiltering)) {
                            for (var j = 0; j < selected.length; j++) {
                                kObj.element.find(".e-kanbantoolbar .e-tooltxt").eq(selected[j]).addClass("e-select");
                            }
                        }
                    }
                    kObj._on($("#" + kObj._id + "_searchbar"), "keyup", "", kObj._onToolbarClick);
                    break;
                case "enableTotalCount":
                    kObj.model.enableTotalCount = options[prop];
                    $(kObj.element.find(".e-kanbanheader")).replaceWith(kObj._renderHeader());
                    if (kObj.model.enableTotalCount)
                        this._totalCount();
                    kObj.refresh();
                    break;
                case "fields":
                    if (prop == "fields") {
                        $(kObj.element.find(".e-kanbanheader")).replaceWith(kObj._renderHeader());
                        if (kObj.model.allowSearching)
                            kObj.KanbanFilter.searchCards("");
                        if (!ej.isNullOrUndefined(kObj.model.fields.swimlaneKey) && kObj.model.contextMenuSettings.enable)
                            kObj.KanbanContext._renderContext();
                        if (kObj.model.filterSettings.length > 0)
                            kObj.KanbanFilter.clearFilter();
                        if (kObj.model.filterSettings.length != 0)
                            $("#Kanban").find(".e-kanbantoolbar .e-tooltxt").removeClass("e-select");
                        kObj.getHeaderContent().replaceWith(kObj._renderHeader());
                        this._refreshDataSource(kObj._dataSource());
                        this._renderLimit();
                        if (kObj.model.enableTotalCount)
                            this._totalCount();
                        kObj.element.find(".e-kanbantoolbar").remove();
                        kObj._renderToolBar().insertBefore(kObj.element.find(".e-kanbanheader").first());
                        if (!kObj.model.allowSearching && kObj.model.filterSettings.length == 0 && !kObj.model.allowPrinting && kObj.model.customToolbarItems.length == 0)
                            kObj.element.find(".e-kanbantoolbar").remove();
                        if (kObj.model.fields && !ej.isNullOrUndefined(kObj.model.fields.swimlaneKey))
                            kObj.KanbanSwimlane = new ej.KanbanFeatures.Swimlane(kObj);
                        kObj._on($("#" + kObj._id + "_searchbar"), "keyup", "", kObj._onToolbarClick);
                    }
                    break;
                case "enableTouch":
                    kObj.model.enableTouch = options[prop];
                    if (!kObj.model.enableTouch) {
                        kObj._off(kObj.element, "doubletap", ".e-kanbancard");
                        if (kObj.model.editSettings.allowEditing)
                            kObj._on(kObj.element, ($.isFunction($.fn.doubletap) && kObj.model.enableTouch) ? "doubletap" : "dblclick", ".e-kanbancard", kObj._cardDblClickHandler);
                        if (kObj.KanbanAdaptive) {
                            kObj._off(kObj.element, "taphold", "", kObj.KanbanAdaptive._kbnHoldHandler);
                            kObj._off(kObj.element, "touchend", "", kObj.KanbanAdaptive._kbnTouchEndHandler);
                            kObj._off(kObj.element, "swipeleft swiperight", ".e-kanbancontent", $.proxy(kObj._swipeKanban, kObj));
                        }
                        kObj._on(kObj.element, ($.isFunction($.fn.tap) && kObj.model.enableTouch) ? "tap" : "click", "", kObj._clickHandler);
                        kObj._on($('.e-swimlane-window,.e-kanbanfilter-window,.e-kanbantoolbar'), ($.isFunction($.fn.tap) && kObj.model.enableTouch) ? "tap" : "click", "", kObj._kbnAdaptClickHandler);
                        kObj._on($('.e-kanban-editdiv'), ($.isFunction($.fn.tap) && kObj.model.enableTouch) ? "tap" : "click", "", kObj._kbnAdaptEditClickHandler);
                    }
                    else {
                        kObj._off(kObj.element, "dblclick", ".e-kanbancard");
                        if (kObj.model.editSettings.allowEditing)
                            kObj._on(kObj.element, ($.isFunction($.fn.doubletap) && kObj.model.enableTouch) ? "doubletap" : "dblclick", ".e-kanbancard", kObj._cardDblClickHandler);
                        kObj._on(kObj.element, ($.isFunction($.fn.tap) && kObj.model.enableTouch) ? "tap" : "click", "", kObj._clickHandler);
                        kObj._on($('.e-swimlane-window,.e-kanbanfilter-window,.e-kanbantoolbar'), ($.isFunction($.fn.tap) && kObj.model.enableTouch) ? "tap" : "click", "", kObj._kbnAdaptClickHandler);
                        kObj._on($('.e-kanban-editdiv'), ($.isFunction($.fn.tap) && kObj.model.enableTouch) ? "tap" : "click", "", kObj._kbnAdaptEditClickHandler);
                        if (kObj.KanbanAdaptive) {
                            kObj._on(kObj.element, "taphold", "", kObj.KanbanAdaptive._kbnHoldHandler);
                            kObj._on(kObj.element, "touchend", "", kObj.KanbanAdaptive._kbnTouchEndHandler);
                            kObj._on(kObj.element, "swipeleft swiperight", ".e-kanbancontent", $.proxy(kObj._swipeKanban, kObj));
                        }
                    }
                    break;
                case "allowHover":
                    kObj.model.allowHover = options[prop];
                    kObj._enableCardHover();
                    break;
                case "enableRTL":
                    kObj.model.enableRTL = options[prop];
                    this._enableKanbanRTL();
                    kObj.refresh(true);
                    this._renderLimit();
                    break;
                case "tooltipSettings":
                    $.extend(kObj.model.tooltipSettings, options[prop]);
                    if (!ej.isNullOrUndefined(kObj.model.tooltipSettings) && kObj.model.tooltipSettings.enable) {
                        kObj.element.find(".e-kanbantooltip").remove();
                        kObj.element.append($("<div class='e-kanbantooltip'></div>"));
                        kObj.element.find('.e-kanbantooltip').hide();
                        kObj._on(kObj.element, "mouseover", ".e-kanbancard", $.proxy(kObj._showToolTip, kObj));
                        kObj._on(kObj.element, "mouseout", ".e-kanbancard", $.proxy(kObj._hideToolTip, kObj));
                    }
                    else {
                        kObj._off(kObj.element, "mouseover", ".e-kanbancard");
                        kObj._off(kObj.element, "mouseout", ".e-kanbancard");
                    }
                    break;
                case "allowScrolling":
                case "scrollSettings":
                    $content = kObj.getContent();
                    kObj.model.allowScrolling = options[prop];
                    if (prop != "allowScrolling") {
                        if (!ej.isNullOrUndefined(options["scrollSettings"])) {
                            if ($.isEmptyObject(options["scrollSettings"]))
                                break;
                            $.extend(kObj.model.scrollSettings, options["scrollSettings"]);
                        }
                        if (!ej.isNullOrUndefined(options["allowScrolling"]))
                            kObj.model.allowScrolling = options["allowScrolling"];
                        !ej.isNullOrUndefined($content.data("ejScroller")) && $content.ejScroller("destroy");
                        if (kObj.model.allowScrolling) {
                            kObj.KanbanScroll = new ej.KanbanFeatures.Scroller(kObj);
                            kObj.getHeaderContent().find("div").first().addClass("e-headercontent");
                            kObj._originalScrollWidth = kObj.model.scrollSettings.width;
                            kObj.KanbanScroll._renderScroller();
                        }
                        else {
                            kObj.element.children(".e-kanbanheader").removeClass("e-scrollcss");
                            kObj.element.css("width", "auto");
                            kObj.element.removeClass("e-kanbanscroll");
                            kObj.element.find(".e-headercontent").removeClass("e-hscrollcss");
                        }
                        if (!ej.isNullOrUndefined(kObj.model.fields.swimlaneKey))
                            kObj._swimlaneRows = kObj.element.find('.e-swimlanerow');
                        if (!$.isEmptyObject(kObj._freezeSwimlaneRow) && kObj.KanbanSwimlane)
                            kObj.KanbanSwimlane._removeFreezeRow();
                    }
                    break;
                case "dataSource":
                    $content = kObj.element.find(".e-kanbancontent").first();
                    this._refreshDataSource(kObj._dataSource());
                    this._addLastRow();
                    break;
                case "swimlaneSettings":
                    if (!ej.isNullOrUndefined(kObj.model.fields.swimlaneKey)) {
                        $.extend(kObj.model.swimlaneSettings, options[prop]);
                        if (!ej.isNullOrUndefined(options[prop].showCount))
                            kObj.refresh(true);
                    }
                    break;
                case "editSettings":
                    $.extend(kObj.model.editSettings, options[prop]);
                    kObj.KanbanEdit._processEditing();
                    kObj._tdsOffsetWidth = [];
                    if (kObj.model.editSettings.allowEditing || kObj.model.editSettings.allowAdding) {
                        if (kObj.model.editSettings.editMode == "dialog" || kObj.model.editSettings.editMode == "dialogtemplate") {
                            $("#" + kObj._id + "_dialogEdit").data("ejDialog") && $("#" + kObj._id + "_dialogEdit").ejDialog("destroy");
                            $("#" + kObj._id + "_dialogEdit_wrapper,#" + kObj._id + "_dialogEdit").remove();
                            if (!ej.isNullOrUndefined($("#" + kObj._id + "_externalEdit")))
                                $("#" + kObj._id + "_externalEdit").remove();
                            kObj.element.append(kObj.KanbanEdit._renderDialog());
                        }
                        else if (kObj.model.editSettings.editMode == "externalform" || kObj.model.editSettings.editMode == "externalformtemplate") {
                            if (!ej.isNullOrUndefined(kObj.element.find(".e-kanbandialog")))
                                kObj.element.find(".e-kanbandialog").remove();
                            $("#" + kObj._id + "_externalEdit").remove();
                            kObj.element.append(kObj.KanbanEdit._renderExternalForm());
                        }
                        kObj._isEdit = false;
                    }
                    kObj._enableEditingEvents();
                    break;
                case "allowSelection":
                    if (options[prop]) {
                        kObj._off(kObj.element, "click");
                        kObj._on(kObj.element, "click", "", kObj._clickHandler);
                    }
                    break;
                case "query":
                    kObj.model.query = $.extend(true, {}, options[prop]);
                    break;
                case "stackedHeaderRows":
                    if (prop == "stackedHeaderRows")
                        kObj.model.stackedHeaderRows = options[prop];
                    if (kObj.model.stackedHeaderRows.length > 0) {
                        this._refreshStackedHeader();
                    }
                    else {
                        kObj.element.find(".e-stackedHeaderRow").remove();
                        kObj.model.stackedHeaderRows = [];
                    }
                    break;
                case "cardSettings":
                    if (!ej.isNullOrUndefined(options["cardSettings"])) {
                        $.extend(kObj.model.cardSettings, options["cardSettings"]);
                    }
                    kObj.element.find(".e-kanbancard").remove();
                    kObj.refreshTemplate();
                    kObj._renderAllCard();
                    kObj._enableDragandScroll();
                    break;
                case "allowToggleColumn":
                    kObj.model.allowToggleColumn = options[prop];
                    kObj.refreshTemplate();
                    kObj.getHeaderContent().replaceWith(kObj._renderHeader());
                    kObj.sendDataRenderingRequest({ requestType: "refresh" });
                    if (!kObj.model.allowToggleColumn)
                        kObj.element.find(".e-shrinkheader").not(".e-hide").addClass("e-hide");
                    if (kObj.model.enableTotalCount)
                        this._totalCount();
                    this._renderLimit();
                    break;
                case "locale":
                    kObj.model.locale = options[prop];
                    var model = kObj.model, element = kObj.element;
                    model.query["queries"] = model.query["queries"].slice(0, model.query["queries"].length - 1);
                    kObj.element.ejKanban("destroy").ejKanban(model);
                    kObj.element = element;
                    kObj.model = model;
                    if (kObj._collapsedCards.length != 0)
                        kObj.toggleCard(kObj._collapsedCards);
                    break;
            }
        }
    };
    InternalCommon.prototype._setWidthToColumns = function () {
        var kObj = this.kanbanObj, initWidth, initModel, initColumn, initialColumn, reducedWidth, normalWidth, correctWidth, $cols1 = kObj.getContentTable().children("colgroup").find("col"), $cols2 = kObj.getHeaderTable().children("colgroup").find("col");
        var width = kObj._originalWidth - (kObj._collapsedColumns.length * 50);
        if (kObj.initialRender && kObj.model.allowScrolling) {
            if (typeof (kObj._originalScrollWidth) == "string") {
                kObj.element.css("width", "auto");
                var width = kObj.element.width();
                if (kObj.model.scrollSettings.width == "auto" || kObj._originalScrollWidth == "auto")
                    kObj._originalScrollWidth = "100%";
                kObj.model.scrollSettings.width = width * (parseFloat(kObj._originalScrollWidth) / 100);
            }
            if ((kObj.model.scrollSettings.width || kObj.model.width))
                kObj.element.width(kObj.model.scrollSettings.width || kObj.model.width);
        }
        kObj._extraWidth = 0;
        initModel = kObj._initialKanbanModel;
        reducedWidth = (parseInt(kObj.element.width()) - ((kObj._visibleColumns.length + 1) * Math.round(kObj.getHeaderTable().css("border-spacing").split('px')[0]))) - 18;
        for (var i = 0; i < $cols2.length; i++) {
            initColumn = initModel.columns[i];
            if (ej.isNullOrUndefined(initColumn.visible) && kObj.model.allowScrolling && !ej.isNullOrUndefined(initColumn.width) && ($.isNumeric(initModel.scrollSettings.width) || $.isNumeric(initColumn.width) || ((initModel.scrollSettings.width.indexOf("%") > 0 || initModel.scrollSettings.width == "auto") && initColumn.width.indexOf("%") > 0))) {
                if (typeof (initColumn.width) == "string" && initColumn.width.indexOf("%") != -1)
                    correctWidth = parseInt(initColumn.width) / 100 * reducedWidth;
                else
                    correctWidth = initColumn.width;
                initWidth = ej.isNullOrUndefined(initWidth) ? correctWidth : (initWidth + correctWidth);
                if (kObj.model.columns[i].isCollapsed) {
                    initWidth = initWidth - correctWidth;
                    initWidth = initWidth + 50;
                }
            }
        }
        for (var i = 0; i < $cols2.length; i++) {
            initialColumn = initModel.columns[i];
            if (!ej.isNullOrUndefined(kObj._columnsWidthCollection[i]) && !kObj.model.allowToggleColumn) {
                if (!ej.isNullOrUndefined(initialColumn.width) && (typeof (initialColumn.width) == "string" && initialColumn.width.indexOf("%"))) {
                    normalWidth = parseFloat(initialColumn.width) / 100 * reducedWidth;
                    $cols1.eq(i).width(normalWidth);
                    $cols2.eq(i).width(normalWidth);
                }
                else {
                    $cols1.eq(i).width(kObj._columnsWidthCollection[i]);
                    $cols2.eq(i).width(kObj._columnsWidthCollection[i]);
                }
            }
            else if (kObj.model.allowScrolling) {
                width = parseInt(kObj.element.width()) - (kObj._collapsedColumns.length * 50);
                var bSize = ((Math.round(kObj.getHeaderTable().css("border-spacing").split('px')[0]) * (kObj.model.columns.length + 1)));
                if (!ej.isNullOrUndefined(initialColumn.width) && ($.isNumeric(initModel.scrollSettings.width) || $.isNumeric(initialColumn.width) || ((initModel.scrollSettings.width.indexOf("%") > 0 || initModel.scrollSettings.width == "auto") && initialColumn.width.indexOf("%") > 0))) {
                    var totalWidth = initWidth + bSize;
                    if (!kObj.model.columns[i].isCollapsed && totalWidth < parseInt(kObj.element.width()))
                        this._columnAutoWidth(i, width, bSize);
                    else if (totalWidth > kObj.element.width()) {
                        $cols1.eq(i).width(initialColumn.width);
                        $cols2.eq(i).width(initialColumn.width);
                    }
                }
                else if (ej.isNullOrUndefined(initialColumn.width))
                    this._columnAutoWidth(i, width, bSize);
                if (kObj.model.columns[i].isCollapsed) {
                    $cols1.eq(i).css("width", "50px");
                    $cols2.eq(i).css("width", "50px");
                    kObj._columnsWidthCollection[i] = 50;
                }
            }
        }
    };
    InternalCommon.prototype._getCardbyIndexes = function (indexes) {
        return $(this.kanbanObj.getRowByIndex(indexes[0][0]).find(".e-rowcell:eq(" + indexes[0][1][0] + ")").find("div.e-kanbancard:eq(" + indexes[0][2][0] + ")"));
    };
    InternalCommon.prototype._addLastRow = function () {
        var kObj = this.kanbanObj, lastRowtd = kObj.getContentTable().find("tr:last").find("td"), rowHeight = 0;
        if (kObj.model.allowScrolling && !ej.isNullOrUndefined(kObj.model.dataSource) && !ej.isNullOrUndefined(kObj._kanbanRows)) {
            for (var i = 0; i < kObj._kanbanRows.length; i++)
                rowHeight += $(kObj._kanbanRows[i]).height();
            if (rowHeight < kObj.getContent().height() - 1)
                lastRowtd.addClass("e-lastrowcell");
        }
    };
    InternalCommon.prototype._refreshDataSource = function (dataSource) {
        var kObj = this.kanbanObj;
        if (dataSource instanceof ej.DataManager)
            kObj._dataManager = dataSource;
        else
            kObj._dataManager = new ej.DataManager(dataSource);
        kObj._isLocalData = (!(kObj._dataSource() instanceof ej.DataManager) || (kObj._dataManager.dataSource.offline || kObj._isRemoteSaveAdaptor));
        kObj.refresh(true);
    };
    InternalCommon.prototype._cardClick = function (target, parentDiv) {
        var args, data = null, queryManager;
        if (!ej.isNullOrUndefined(parentDiv.attr("id"))) {
            queryManager = new ej.DataManager(this.kanbanObj._currentJsonData);
            data = queryManager.executeLocal(new ej.Query().where(this.kanbanObj.model.fields.primaryKey, ej.FilterOperators.equal, parentDiv.attr('id')));
        }
        args = { target: target, currentCard: parentDiv, data: data };
        if (this.kanbanObj._trigger("cardClick", args))
            return;
    };
    InternalCommon.prototype._validateLimit = function (curColumn, $curHeaderCell, count) {
        var kObj = this.kanbanObj, key = this._multikeySeparation(curColumn.key), $cell = $($(kObj.element.find(".e-columnrow")).find('td[data-ej-mappingkey="' + key + '"]')), totalcard;
        var isMin = !ej.isNullOrUndefined(curColumn.constraints.min), isMax = !ej.isNullOrUndefined(curColumn.constraints.max), isSwimlane = !ej.isNullOrUndefined(kObj.model.fields.swimlaneKey) && count == 0;
        if (curColumn.constraints.type == "column") {
            totalcard = $cell.find(".e-kanbancard").length;
        }
        else {
            totalcard = $($cell[count]).find(".e-kanbancard").length;
            $cell = $($cell[count]);
        }
        if (isMin)
            if (curColumn.constraints.min > totalcard) {
                $cell.addClass("e-deceed");
                if (isSwimlane)
                    $($curHeaderCell).addClass("e-deceed");
            }
            else {
                $cell.removeClass("e-deceed");
                if (isSwimlane)
                    $($curHeaderCell).removeClass("e-deceed");
            }
        if (isMax)
            if (curColumn.constraints.max < totalcard) {
                $cell.addClass("e-exceed");
                if (isSwimlane)
                    $($curHeaderCell).addClass("e-exceed");
            }
            else {
                $cell.removeClass("e-exceed");
                if (isSwimlane)
                    $($curHeaderCell).removeClass("e-exceed");
            }
        $cell.find(".e-limits").addClass("e-hide");
        if (!curColumn.isCollapsed)
            $($curHeaderCell).find(".e-limits").removeClass("e-hide");
    };
    InternalCommon.prototype._totalCount = function () {
        var kObj = this.kanbanObj;
        for (var i = 0; i < kObj.model.columns.length; i++) {
            var column = kObj.model.columns[i];
            if (kObj.model.enableTotalCount) {
                var total = kObj.getHeaderContent().find("span.e-totalcount")[i];
                var key = this._multikeySeparation(column.key);
                var $columnrow = $($(kObj.element.find(".e-columnrow")).find('td[data-ej-mappingkey="' + key + '"]'));
                var totalcard = $columnrow.find(".e-kanbancard").length;
                $(total).text(totalcard);
            }
        }
    };
    InternalCommon.prototype._multikeySeparation = function (key) {
        var columnKey = typeof (key) == "object" ? key : key.split(","), key = "", length = columnKey.length;
        if (length == 1)
            key = columnKey[0];
        else
            for (var j = 0; j < length; j++) {
                key = key + columnKey[j];
                if (j != length - 1)
                    key += ",";
            }
        return key;
    };
    InternalCommon.prototype._renderLimit = function () {
        var kObj = this.kanbanObj, $headerCell = {};
        for (var i = 0; i < kObj.model.columns.length; i++) {
            var column = kObj.model.columns[i];
            if (!ej.isNullOrUndefined(column.constraints)) {
                var isMin = !ej.isNullOrUndefined(column.constraints['min']), isMax = !ej.isNullOrUndefined(column.constraints['max']);
                if (isMin || isMax)
                    $headerCell = kObj.getHeaderContent().find(".e-columnheader").not(".e-stackedHeaderRow").find(".e-headercell")[i];
                var columnKey = typeof (column.key) == "object" ? column.key : column.key.split(","), key = kObj.KanbanCommon._multikeySeparation(columnKey);
                var $cell = $($(kObj.element.find(".e-columnrow")).find('td[data-ej-mappingkey="' + key + '"]')), k = 0;
                if (ej.isNullOrUndefined(column.constraints.type))
                    column.constraints.type = "column";
                switch (column.constraints.type) {
                    case "column":
                        this._validateLimit(column, $headerCell, k);
                        break;
                    case "swimlane":
                        for (k = 0; k < $cell.length; k++) {
                            this._validateLimit(column, $headerCell, k);
                            if (!kObj.getHeaderContent().find(".e-headercell").eq(i).hasClass("e-shrinkcol"))
                                $cell.eq(k).find(".e-limits").removeClass("e-hide");
                        }
                        if (!ej.isNullOrUndefined(kObj.model.fields.swimlaneKey))
                            $($headerCell).find(".e-limits").addClass("e-hide");
                        break;
                }
            }
        }
    };
    InternalCommon.prototype._showhide = function (shcolumns, val) {
        var kObj = this.kanbanObj, i, count = 0, hideshowCols, columns = kObj.model.columns;
        hideshowCols = (val === "show") ? "_visibleColumns" : "_hiddenColumns";
        var $head = kObj.getHeaderTable().find("thead");
        var $headerCell = $head.find("tr").not(".e-stackedHeaderRow").find(".e-headercell");
        var $col = kObj.getHeaderTable().find("colgroup").find("col"), column;
        var $content_col = kObj.getContentTable().find("colgroup").find("col");
        var columnrow = kObj._columnRows;
        for (i = 0; i < columns.length; i++) {
            if ($.inArray(columns[i]["headerText"], kObj[hideshowCols]) != -1) {
                if (val === "show")
                    columns[i].visible = true;
                else
                    columns[i].visible = false;
                count++;
            }
            column = kObj.getColumnByHeaderText(shcolumns[i]);
            var index = $.inArray(column, kObj.model.columns);
            if (index != -1) {
                if (val == "show") {
                    $headerCell.eq(index).removeClass("e-hide");
                    $col.eq(index).css("display", "");
                }
                else {
                    $headerCell.eq(index).addClass("e-hide");
                    $col.eq(index).css("display", "none");
                }
            }
        }
        for (i = 0; i < columns.length; i++) {
            for (var j = 0; j < columnrow.length; j++) {
                if (!ej.isNullOrUndefined(kObj.model.fields.swimlaneKey)) {
                    if ($(columnrow[j]).is(":visible"))
                        columnrow.eq(j).prev().find(".e-rowcell").attr("colspan", kObj.getVisibleColumnNames().length);
                    else {
                        columnrow.eq(j).prev().prev(".e-swimlanerow").find(".e-rowcell").attr("colspan", kObj.getVisibleColumnNames().length);
                        if (!columns[i].visible)
                            columnrow.eq(j).prev(".e-collapsedrow").find("td.e-rowcell").eq(i).addClass("e-hide");
                        else
                            columnrow.eq(j).prev(".e-collapsedrow").find("td.e-rowcell").eq(i).removeClass("e-hide");
                    }
                }
                var colval = columnrow.eq(j).find("td.e-rowcell[data-ej-mappingkey='" + kObj.model.columns[i].key + "']");
                if (!columns[i].visible) {
                    colval.addClass("e-hide");
                    $content_col.eq(i).addClass("e-hide");
                }
                else {
                    colval.removeClass("e-hide");
                    $content_col.eq(i).removeClass("e-hide");
                }
            }
        }
        var $header = kObj.element.find(".e-kanbanheader");
        kObj._columnsWidthCollection = [];
        for (var columnCount = 0; columnCount < kObj.model.columns.length; columnCount++)
            if (!ej.isNullOrUndefined(kObj.model.columns[columnCount]["width"])) {
                kObj._columnsWidthCollection.push(kObj.model.columns[columnCount]["width"]);
            }
        kObj.element[0].replaceChild(kObj._renderHeader()[0], $header[0]);
        kObj.getContentTable().find("colgroup").first().replaceWith(this._getMetaColGroup());
        this._setWidthToColumns();
        kObj.KanbanScroll && kObj.KanbanScroll._refreshScroller({ requestType: "refresh" });
    };
    InternalCommon.prototype._showExpandColumns = function (key, c, hidden, visible) {
        var kObj = this.kanbanObj;
        if (ej.isNullOrUndefined(key))
            return;
        if (key != null) {
            if ($.isArray(c)) {
                for (var i = 0; i < c.length; i++) {
                    var ckey = kObj.getColumnByHeaderText(c[i]);
                    c[i] = ckey != null ? ckey.headerText : c[i];
                }
            }
            else
                c = key.headerText;
        }
        if ($.isArray(c)) {
            for (i = 0; i < c.length; i++) {
                var index = $.inArray(c[i], kObj[hidden]);
                if (index != -1) {
                    kObj[hidden].splice(index, 1);
                    kObj[visible].push(c[i]);
                }
                else if (index == -1 && $.inArray(c[i], kObj[visible]) == -1 && !ej.isNullOrUndefined(kObj.getColumnByHeaderText(c[i]))) {
                    kObj[visible].push(kObj.getColumnByHeaderText(c[i]).key) && kObj[visible].push(c[i]);
                    kObj[hidden].splice($.inArray(kObj.getColumnByHeaderText(c[i]).key, kObj[hidden]), 1) && kObj[hidden].splice($.inArray(c[i], kObj[hidden]), 1);
                }
            }
        }
        else {
            index = $.inArray(c, kObj[hidden]);
            if (index != -1) {
                kObj[hidden].splice(index, 1);
                kObj[visible].push(c);
            }
            else if (index == -1 && $.inArray(c, kObj[visible]) == -1 && !ej.isNullOrUndefined(kObj.getColumnByHeaderText(c))) {
                kObj[visible].push(kObj.getColumnByHeaderText(c).key) && kObj[visible].push(c);
                kObj[hidden].splice($.inArray(kObj.getColumnByHeaderText(c).key, kObj[hidden]), 1) && kObj[hidden].splice($.inArray(c, kObj[hidden]), 1);
            }
        }
    };
    InternalCommon.prototype._expandColumns = function (c) {
        var key, hidden = "_collapsedColumns", visible = "_expandedColumns", kObj = this.kanbanObj;
        key = typeof (c) == "string" ? kObj.getColumnByHeaderText(c) : kObj.getColumnByHeaderText(c[0]);
        this._showExpandColumns(key, c, hidden, visible);
        this._expandCollapse(kObj[visible], "expand");
        if (kObj.model.allowScrolling)
            this._setWidthToColumns();
        if (kObj.model.stackedHeaderRows.length > 0) {
            this._refreshStackedHeader();
        }
    };
    InternalCommon.prototype._toggleField = function (c) {
        var index, i, kObj = this.kanbanObj;
        if (kObj.model.allowToggleColumn) {
            if ($.isArray(c)) {
                for (i = 0; i < c.length; i++) {
                    index = $.inArray(c[i], kObj._collapsedColumns);
                    if (index != -1)
                        this._expandColumns(c[i]);
                    else
                        this._collapseColumns(c[i]);
                }
            }
            else if ($.inArray(c, kObj._collapsedColumns) != -1)
                this._expandColumns(c);
            else
                this._collapseColumns(c);
            kObj.KanbanScroll && kObj.KanbanScroll._refreshScroller({ requestType: "refresh" });
        }
    };
    InternalCommon.prototype._hideCollapseColumns = function (key, c, hidden, visible) {
        var i, index, kObj = this.kanbanObj;
        if (ej.isNullOrUndefined(key))
            return;
        if ($.isArray(c)) {
            for (i = 0; i < c.length; i++) {
                index = $.inArray(c[i], kObj[visible]);
                if (index != -1) {
                    kObj[hidden].push(c[i]);
                    kObj[visible].splice(index, 1);
                }
                else if (index == -1 && $.inArray(c[i], kObj[hidden]) == -1 && !ej.isNullOrUndefined(kObj.getColumnByHeaderText(c[i]))) {
                    kObj[hidden].push(kObj.getColumnByHeaderText(c[i]).key) && kObj[hidden].push(kObj.getColumnByHeaderText(c[i]).key);
                    kObj[visible].splice($.inArray(kObj.getColumnByHeaderText(c[i]).key, kObj[visible]), 1) && kObj[visible].splice($.inArray(c[i], kObj[visible]), 1);
                }
            }
        }
        else {
            index = $.inArray(c, kObj[visible]);
            if (index != -1) {
                kObj[hidden].push(c);
                kObj[visible].splice(index, 1);
            }
            else if (index == -1 && visible == visible && $.inArray(c, kObj[hidden]) == -1 && !ej.isNullOrUndefined(kObj.getColumnByHeaderText(c))) {
                kObj[hidden].push(kObj.getColumnByHeaderText(c).key) && kObj[hidden].push(kObj.getColumnByHeaderText(c).key);
                kObj[visible].splice($.inArray(kObj.getColumnByHeaderText(c).key, kObj[visible]), 1) && kObj[visible].splice($.inArray(c, kObj[visible]), 1);
            }
        }
    };
    InternalCommon.prototype._expandCollapse = function (shcolumns, val) {
        var kObj = this.kanbanObj, i, count = 0, hideshowCols, columns = kObj.model.columns;
        hideshowCols = (val === "expand") ? "_expandedColumns" : "_collapsedColumns";
        var $head = kObj.getHeaderTable().find("thead");
        var $headerCell = $head.find("tr").not(".e-stackedHeaderRow").find(".e-headercell");
        var $col = kObj.getHeaderTable().find("colgroup").find("col"), column, colval;
        var $col1 = kObj.getContentTable().find("colgroup").find("col");
        for (i = 0; i < columns.length; i++) {
            if ($.inArray(columns[i]["headerText"], kObj[hideshowCols]) != -1) {
                if (val === "expand") {
                    columns[i].isCollapsed = false;
                }
                else {
                    columns[i].isCollapsed = true;
                }
                count++;
            }
            column = kObj.getColumnByHeaderText(shcolumns[i]);
            var index = $.inArray(column, kObj.model.columns);
            var isExp = val == "expand" ? true : false;
            if (index != -1) {
                if (isExp) {
                    if ($col.eq(index).hasClass("e-shrinkcol")) {
                        $headerCell.eq(index).find(".e-headercelldiv,.e-totalcard,.e-limits").removeClass("e-hide");
                        $headerCell.eq(index).removeClass("e-shrinkcol");
                        $col.eq(index).removeClass("e-shrinkcol");
                        $col1.eq(index).removeClass("e-shrinkcol");
                        $headerCell.eq(index).find(".e-clcollapse").addClass("e-clexpand").removeClass("e-clcollapse");
                    }
                }
                else {
                    if (!$col.eq(index).hasClass("e-shrinkcol")) {
                        $headerCell.eq(index).find(".e-headercelldiv,.e-totalcard,.e-limits").addClass("e-hide");
                        $headerCell.eq(index).addClass("e-shrinkcol");
                        $col.eq(index).addClass("e-shrinkcol");
                        $col1.eq(index).addClass("e-shrinkcol");
                        $headerCell.eq(index).find(".e-clexpand").addClass("e-clcollapse").removeClass("e-clexpand");
                    }
                }
            }
            var cshrink = kObj.model.columns[i].isCollapsed;
            var j;
            if (isExp) {
                if (!cshrink)
                    for (j = 0; j < kObj._columnRows.length; j++) {
                        colval = kObj._columnRows.eq(j).find("td.e-rowcell").eq(i);
                        if (colval.hasClass("e-shrink")) {
                            colval.removeClass("e-shrink").find(".e-shrinkheader").addClass("e-hide").parent().find(".e-kanbancard").removeClass("e-hide");
                            if (colval.hasClass("e-toggle"))
                                var togglecol = colval.find(".e-toggle-area");
                            $(togglecol).removeClass("e-hide").show();
                            if (kObj.element.hasClass('e-responsive') && colval.find('.e-cell-scrollcontent').length > 0)
                                colval.find('.e-cell-scrollcontent').removeClass("e-hide");
                            if (kObj.model.enableRTL)
                                colval.find(".e-shrinkheader").css({ 'position': '', 'top': '' });
                            colval.find(".e-customaddbutton").removeClass("e-hide");
                            colval.find(".e-limits").removeClass("e-hide");
                            colval.find(".e-shrinkcount").text(kObj._columnCardcount(kObj.currentViewData, kObj.model.columns[i].key, kObj.model.fields.swimlaneKey ? j : null, kObj));
                        }
                        else
                            break;
                    }
            }
            else {
                if (cshrink)
                    for (j = 0; j < kObj._columnRows.length; j++) {
                        colval = kObj._columnRows.eq(j).find("td.e-rowcell").eq(i);
                        if (!colval.hasClass("e-shrink")) {
                            colval.addClass("e-shrink").find(".e-shrinkheader").removeClass("e-hide").parent().find(".e-kanbancard").addClass("e-hide");
                            if (colval.hasClass("e-toggle"))
                                var togglecol = colval.find(".e-toggle-area");
                            $(togglecol).addClass("e-hide").hide();
                            if (kObj._checkMultikey(colval))
                                colval.addClass("e-shrink").find(".e-shrinkheader").show();
                            if (kObj.element.hasClass('e-responsive') && colval.find('.e-cell-scrollcontent').length > 0)
                                colval.find('.e-cell-scrollcontent').addClass("e-hide");
                            var contentTop = colval.offset().top, sCountTop = colval.find('.e-shrinkcount').offset().top;
                            colval.find(".e-customaddbutton").addClass("e-hide");
                            colval.find(".e-limits").addClass("e-hide");
                            colval.find(".e-shrinkcount").text(kObj._columnCardcount(kObj.currentViewData, kObj.model.columns[i].key, kObj.model.fields.swimlaneKey ? j : null, kObj));
                        }
                        else
                            break;
                    }
            }
        }
    };
    InternalCommon.prototype._collapseColumns = function (c) {
        var kObj = this.kanbanObj, i, index, key, hidden = "_collapsedColumns", visible = "_expandedColumns", count = 0;
        for (i = 0; i < c.length; i++) {
            index = $.inArray(c[i], kObj._expandedColumns);
            if (index != -1)
                count++;
        }
        if (!(kObj._expandedColumns.length == count) && !(kObj.getVisibleColumnNames().length - kObj._collapsedColumns.length == 1) && !(kObj.model.columns.length - kObj._collapsedColumns.length == 1)) {
            key = typeof (c) == "string" ? kObj.getColumnByHeaderText(c) : kObj.getColumnByHeaderText(c[0]);
            this._hideCollapseColumns(key, c, hidden, visible);
            this._expandCollapse(kObj[hidden], "collapse");
            if (kObj.model.allowScrolling)
                this._setWidthToColumns();
            if (kObj.model.stackedHeaderRows.length > 0)
                this._refreshStackedHeader();
        }
        else if (kObj._collapsedColumns.length > 0) {
            this._expandColumns(kObj._collapsedColumns[0]);
            this._collapseColumns(c);
        }
    };
    return InternalCommon;
}());
window.ej.createObject("ej.KanbanFeatures.Common", InternalCommon, window);
