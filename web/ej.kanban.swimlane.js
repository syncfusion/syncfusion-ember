var InternalSwimlane = (function () {
    function InternalSwimlane(element) {
        this.kanbanObj = null;
        this._removeFreezeRow = function (kObj) {
            var kObj = this.kanbanObj;
            if ((!kObj.model.scrollSettings.allowFreezeSwimlane && !$.isEmptyObject(kObj._freezeSwimlaneRow)) || (kObj.element.hasClass('e-responsive') && !ej.isNullOrUndefined(kObj.model.fields.swimlaneKey) && kObj.model.scrollSettings.allowFreezeSwimlane)) {
                this._removeFreezeslRow();
            }
        };
        this._removeFreezeslRow = function (kObj) {
            var kObj = this.kanbanObj;
            kObj._freezeSwimlaneRow.remove();
            kObj.headerContent.css({ 'position': '', 'top': '' });
            kObj.kanbanContent.css({ 'position': '', 'top': '' });
            var toolbar = kObj.element.find('.e-kanbantoolbar');
            if (toolbar.length > 0)
                toolbar.css({ 'position': '', 'top': '' });
        };
        this.kanbanObj = element;
    }
    ;
    InternalSwimlane.prototype.expandAll = function () {
        var slDivs = this.kanbanObj.element.find(".e-swimlanerow .e-slcollapse");
        if (slDivs.length != 0) {
            for (var i = 0; i < slDivs.length; i++)
                this.toggle($(slDivs[i]));
        }
    };
    InternalSwimlane.prototype.collapseAll = function () {
        var slDivs = this.kanbanObj.element.find(".e-swimlanerow .e-slexpand");
        if (slDivs.length != 0) {
            for (var i = 0; i < slDivs.length; i++)
                this.toggle($(slDivs[i]));
        }
    };
    InternalSwimlane.prototype.toggle = function ($target) {
        var name, $curRow, kObj = this.kanbanObj;
        if (typeof $target == "string" || typeof $target == "number") {
            name = kObj.KanbanCommon._removeIdSymbols($target);
            $curRow = kObj.element.find('tr[id="' + name + '"]');
            this._toggleSwimlaneRow($($curRow).find(".e-rowcell .e-slexpandcollapse"));
        }
        else if (typeof $target == "object" && $target[0].nodeName != "DIV") {
            for (var i = 0; i < $target.length; i++) {
                name = kObj.KanbanCommon._removeIdSymbols($target[i]);
                $curRow = kObj.element.find('tr[id="' + name + '"]');
                this._toggleSwimlaneRow($($curRow).find(".e-rowcell .e-slexpandcollapse"));
            }
        }
        else
            this._toggleSwimlaneRow($target);
        if (kObj.model.allowScrolling)
            kObj.KanbanScroll._refreshSwimlaneToggleScroller();
    };
    InternalSwimlane.prototype._toggleSwimlaneRow = function ($target) {
        var kObj = this.kanbanObj, args, idx = kObj._swimlaneRows.index($target.parents('.e-swimlanerow')), action;
        var curData = kObj.currentViewData[idx], id = $target.parent().next(".e-slkey").html();
        $target = $target.hasClass("e-slexpandcollapse") ? $target.find("div:first") : $target;
        if (!($target.hasClass("e-slexpand") || $target.hasClass("e-slcollapse")))
            return;
        var cRow = $target.closest('tr');
        cRow.next(".e-collapsedrow").remove();
        var $row = cRow.next();
        var swim = kObj.KanbanCommon._removeIdSymbols($target.parent().next(".e-slkey").html());
        action = $target.hasClass("e-slexpand") ? "collapse" : "expand";
        args = { target: $target, swimlaneRow: cRow, data: curData.items, cards: $row.find('.e-kanbancard'), id: id, key: curData.key, rowIndex: idx, action: action };
        kObj._trigger("swimlaneClick", args);
        if (args.cancel)
            return false;
        if ($target.hasClass("e-slexpand")) {
            $row.hide();
            var dRow = ej.buildTag('tr', "", {}, { "class": "e-collapsedrow" }), cols = kObj.model.columns, td;
            for (var i = 0; i < cols.length; i++) {
                td = ej.buildTag('td', "", {}, { "class": "e-rowcell", "data-role": "kanbancell" });
                if (!cols[i].visible)
                    td.addClass("e-hide");
                if (cols[i].isCollapsed)
                    td.addClass("e-shrink");
                dRow.append(td);
            }
            $row.before(dRow);
            $target.removeClass("e-slexpand").addClass("e-slcollapse");
            if ($.inArray(swim, kObj._collapsedSwimlane) == -1)
                kObj._collapsedSwimlane.push(swim);
        }
        else {
            $row.show();
            $target.removeClass("e-collapsedrow").removeClass("e-slcollapse").addClass("e-slexpand");
            var index = $.inArray(swim, kObj._collapsedSwimlane);
            if (index != -1)
                kObj._collapsedSwimlane.splice(index, 1);
        }
    };
    InternalSwimlane.prototype._freezeRow = function (e, kObj) {
        var slKey = kObj.model.fields.swimlaneKey, toolbar = kObj.element.find('.e-kanbantoolbar');
        kObj._freezeSwimlaneRow = kObj.element.find('.e-freezeswimlanerow');
        this._removeFreezeRow();
        if (kObj.element.hasClass('e-responsive') && ej.isNullOrUndefined(slKey) || (!kObj.element.hasClass('e-responsive') && (!kObj.model.scrollSettings.allowFreezeSwimlane || ej.isNullOrUndefined(slKey) || (!ej.isNullOrUndefined(e.scrollLeft) && kObj._freezeSwimlaneRow.length == 0))))
            return;
        var top, firstSl, table, tbody, tds;
        if (kObj._freezeSwimlaneRow.length <= 0 && kObj.model.scrollSettings.allowFreezeSwimlane && !kObj.element.hasClass('e-responsive')) {
            kObj._freezeSwimlaneRow = ej.buildTag('div.e-freezeswimlanerow e-swimlanerow', "<div></div>", {}, {});
            top = (kObj.headerContent.offset().top + kObj.headerContent.height()) - (kObj.element.offset().top + 1);
            var height = kObj.element.height();
            kObj._freezeSwimlaneRow.prependTo(kObj.element).css({ 'top': top });
            top = kObj._freezeSwimlaneRow.height();
            kObj.headerContent.css({ 'position': 'relative', 'top': -top });
            kObj.kanbanContent.css({ 'position': 'relative', 'top': -top });
            if (toolbar.length > 0)
                toolbar.css({ 'position': 'relative', 'top': -top });
            kObj.element.height(height);
            firstSl = kObj._swimlaneRows.eq(0);
            kObj._freezeSwimlaneRow.children().append(firstSl.find('.e-slkey,.e-slcount').clone());
            kObj._freezeSwimlaneRow.width(kObj.headerContent.width() - 1).height(firstSl.height());
            kObj._freezeSlOrder = 0;
            table = ej.buildTag('table.e-table e-freeze-table', "", {});
            table.append(kObj.getContentTable().find('colgroup').clone());
            tbody = ej.buildTag("tbody", "", {}, {});
            table.append(tbody);
            tbody.append(kObj.getContentTable().find('.e-columnrow').eq(0).clone().removeClass('e-columnrow').addClass('e-collapsedrow'));
            tds = tbody.find('td');
            tds.removeClass('e-droppable').removeAttr('data-ej-mappingkey').height(0);
            tds.children().remove();
            kObj._freezeSwimlaneRow.append(table);
        }
        else if (kObj._freezeSwimlaneRow.length > 0 || (!ej.isNullOrUndefined(slKey) && kObj.element.hasClass('e-responsive'))) {
            var freezeSlHeight, curHeight, nextSlHeight = 0, curSlHeight = 0, prevSlHeight = 0, rows, slText = kObj.element.find('.e-swimlane-text');
            var nextSl, curSl, prevSl, freezeSlDiv;
            if (!ej.isNullOrUndefined(slKey) && kObj.element.hasClass('e-responsive')) {
                rows = kObj.element.find('.e-columnrow');
                freezeSlHeight = kObj.getContent().offset().top;
                curSl = rows.eq(kObj._freezeSlOrder);
                nextSl = rows.eq(kObj._freezeSlOrder + 1);
                prevSl = rows.eq(kObj._freezeSlOrder - 1);
                if (nextSl.length > 0)
                    nextSlHeight = nextSl.offset().top;
                if (curSl.length > 0)
                    curSlHeight = curSl.offset().top;
                if (prevSl.length > 0)
                    prevSlHeight = prevSl.offset().top;
            }
            else if (kObj._freezeSwimlaneRow.length > 0) {
                freezeSlHeight = kObj.getContent().offset().top + kObj._freezeSwimlaneRow.height();
                curSl = kObj._swimlaneRows.eq(kObj._freezeSlOrder);
                nextSl = kObj._swimlaneRows.eq(kObj._freezeSlOrder + 1);
                prevSl = kObj._swimlaneRows.eq(kObj._freezeSlOrder - 1);
                if (nextSl.length > 0)
                    nextSlHeight = nextSl.offset().top + nextSl.height();
                curSlHeight = curSl.offset().top + curSl.height();
                prevSlHeight = prevSl.offset().top + prevSl.height();
            }
            freezeSlDiv = kObj.element.find('.e-freezeswimlanerow >div');
            if (kObj._freezeScrollTop > e.scrollTop) {
                curSlHeight = curSlHeight;
                if (freezeSlHeight >= nextSlHeight)
                    nextSlHeight = freezeSlHeight + 1;
            }
            if (kObj._freezeScrollTop < e.scrollTop)
                nextSlHeight = nextSlHeight;
            if (e.source == "wheel" || e.source == "button") {
                if (kObj._freezeScrollTop < e.scrollTop)
                    nextSlHeight = nextSlHeight - e.model.scrollOneStepBy;
                else if (kObj._freezeScrollTop > e.scrollTop)
                    freezeSlHeight = freezeSlHeight - e.model.scrollOneStepBy;
            }
            if (freezeSlHeight >= nextSlHeight && kObj._freezeSlOrder < kObj._swimlaneRows.length - 1) {
                if (freezeSlDiv.length > 0) {
                    freezeSlDiv.children().remove();
                    freezeSlDiv.append(nextSl.find('.e-slkey,.e-slcount').clone());
                }
                if (slText.length > 0) {
                    slText.text(kObj._kbnAdaptDdlData[kObj._kbnAdaptDdlIndex + 1]);
                    ++kObj._kbnAdaptDdlIndex;
                }
                ++kObj._freezeSlOrder;
            }
            else if (freezeSlHeight < curSlHeight && freezeSlHeight > prevSlHeight && kObj._freezeSlOrder > 0) {
                if (freezeSlDiv.length > 0) {
                    freezeSlDiv.children().remove();
                    freezeSlDiv.append(prevSl.find('.e-slkey,.e-slcount').clone());
                }
                if (slText.length > 0) {
                    slText.text(kObj._kbnAdaptDdlData[kObj._kbnAdaptDdlIndex - 1]);
                    --kObj._kbnAdaptDdlIndex;
                }
                --kObj._freezeSlOrder;
            }
            if (e.scrollTop == 0)
                this._removeFreezeslRow();
            if (!ej.isNullOrUndefined(e.scrollLeft)) {
                freezeSlDiv.css({ 'left': -e.scrollLeft });
                kObj._freezeSwimlaneRow.find('table').css({ 'left': -e.scrollLeft });
            }
        }
        kObj._freezeScrollTop = e.scrollTop;
    };
    InternalSwimlane.prototype._swimlaneLimit = function () {
        var kObj = this.kanbanObj;
        for (var i = 0; i < kObj.model.columns.length; i++) {
            var constraints = kObj.model.columns[i].constraints, key = kObj.KanbanCommon._multikeySeparation(kObj.model.columns[i].key), $min, $minLimit, $max, $maxLimit;
            if (!ej.isNullOrUndefined(constraints)) {
                var isMin = !ej.isNullOrUndefined(constraints.min), isMax = !ej.isNullOrUndefined(constraints.max), $cell = $($(kObj.getContent().find(".e-columnrow")).find('td[data-ej-mappingkey="' + key + '"]'));
                if (constraints.type == "swimlane" && !ej.isNullOrUndefined(kObj.model.fields.swimlaneKey)) {
                    for (var j = 0; j < $cell.length; j++) {
                        if ($($cell).eq(j).find(".e-limits").length == 0) {
                            var limit = ej.buildTag("div.e-limits");
                            $($cell).eq(j).prepend(limit);
                        }
                        var $limit = $($cell).eq(j).find(".e-limits");
                        if (isMin) {
                            $min = ej.buildTag("div.e-min", kObj.localizedLabels.Min, "", {});
                            $minLimit = ej.buildTag("span.e-minlimit", " " + constraints.min.toString(), "", {});
                            $min.append($minLimit);
                            if ($limit.find(".e-min").length > 0)
                                $limit.find(".e-min").remove();
                            $limit.append($min);
                        }
                        if (isMax) {
                            $max = ej.buildTag("div.e-max", kObj.localizedLabels.Max, "", {});
                            $maxLimit = ej.buildTag("span.e-maxlimit", " " + constraints.max.toString(), "", {});
                            $max.append($maxLimit);
                            if ($limit.find(".e-max").length > 0)
                                $limit.find(".e-max").remove();
                            if (isMin)
                                $limit.append("/");
                            $limit.append($max);
                        }
                        if (kObj.getHeaderContent().find(".e-headercell").eq(i).hasClass("e-shrinkcol"))
                            $($cell).eq(j).find(".e-limits").addClass("e-hide");
                    }
                }
            }
        }
    };
    return InternalSwimlane;
}());
window.ej.createObject("ej.KanbanFeatures.Swimlane", InternalSwimlane, window);
