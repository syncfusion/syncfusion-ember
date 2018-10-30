var InternalAdaptive = (function () {
    function InternalAdaptive(element) {
        this.kanbanObj = null;
        this.kanbanObj = element;
    }
    ;
    InternalAdaptive.prototype._kbnTimeoutSearch = function ($kanbanEle, sender) {
        var kanbanObj = $kanbanEle.data("ejKanban"), target;
        target = sender.currentTarget;
        if (kanbanObj._searchTout)
            kanbanObj._searchTout = window.clearInterval(kanbanObj._searchTout);
        kanbanObj._searchTout = window.setInterval(function () {
            $('.e-kanbanwaitingpopup').removeClass('e-kanbanwaitingpopup').addClass('e-kbnsearchwaitingpopup');
            $kanbanEle.data("ejWaitingPopup").show();
            $('.e-kbnsearchwaitingpopup').css({ 'top': '1px', 'left': '1px' });
            var timeot = setTimeout(function () {
                var val = $(target).find("input").val();
                if (ej.isNullOrUndefined(val))
                    val = $(target).val();
                var args = {
                    itemName: target.title, itemId: target.id, target: target, currentTarget: target,
                    itemIndex: $(target).index(), toolbarData: sender, itemText: val
                };
                kanbanObj._trigger("toolbarClick", args);
                kanbanObj.KanbanFilter.searchCards(val);
                kanbanObj.element.find('.e-searchbar .e-search.e-tooltxt').addClass('e-highliht-kbnsearchbar');
                $('.e-kbnsearchwaitingpopup').addClass('e-kanbanwaitingpopup').removeClass('e-kbnsearchwaitingpopup').css({ 'top': '0px', 'left': '0px' });
                if (!ej.isNullOrUndefined(kanbanObj.model.fields.swimlaneKey)) {
                    var query = new ej.Query().where(ej.Predicate["or"](kanbanObj.keyPredicates)).select(kanbanObj.model.fields.swimlaneKey);
                    kanbanObj._kbnAdaptDdlData = new ej.DataManager(kanbanObj._currentJsonData).executeLocal(query);
                    kanbanObj._kbnAdaptDdlData = ej.dataUtil.mergeSort(ej.dataUtil.distinct(kanbanObj._kbnAdaptDdlData));
                    kanbanObj.KanbanAdaptive._adaptiveSwimlaneRefresh();
                }
                $kanbanEle.data("ejWaitingPopup").hide();
                clearTimeout(timeot);
            }, 300);
            kanbanObj._searchTout = window.clearInterval(kanbanObj._searchTout);
        }, 1000);
    };
    InternalAdaptive.prototype._kbnRightSwipe = function () {
        var kObj = this.kanbanObj, eleWidth = kObj.element.width(), rowCell = kObj.element.find('.e-rowcell:visible'), eqWidth, sHeader = kObj.element.find('.e-stackedHeaderCell'), tCount = 0, prevCount, count, curEle, proxy = kObj;
        if (kObj._kbnSwipeCount > 0) {
            if (kObj._kbnSwipeCount == 1)
                kObj._kbnSwipeWidth = 0;
            else {
                curEle = rowCell.eq(kObj._kbnSwipeCount - 1);
                if (curEle.length == 0)
                    curEle = kObj.element.find(".e-headercell:visible").not(".e-stackedHeaderCell").eq(kObj._kbnSwipeCount - 1);
                kObj._kbnSwipeWidth = kObj._kbnSwipeWidth - curEle.offset().left;
                if (window.matchMedia("(max-width: 600px)").matches || window.matchMedia("(max-device-width: 800px)").matches)
                    eqWidth = (eleWidth - curEle.width()) / 2;
                else if (window.matchMedia("(max-width: 801px)").matches || window.matchMedia("(max-device-width: 1200px)").matches)
                    eqWidth = (eleWidth - curEle.width()) / 8;
                kObj._kbnSwipeWidth = kObj._kbnSwipeWidth + eqWidth;
            }
            for (var i = 0; i < sHeader.length; i++) {
                var leftVal = kObj.headerContent.find('col:eq(0)').width();
                prevCount = tCount, count = kObj._kbnSwipeCount - 1;
                tCount = tCount + (parseInt($(sHeader).eq(i).attr('colspan')));
                if (count >= prevCount && count < tCount) {
                    if (prevCount == kObj._kbnSwipeCount - 1) {
                        kObj.element.find('.e-adapt-stheader').removeClass('e-adapt-stheader');
                        $(sHeader).eq(i).find('div').css({ 'position': '', 'left': '' });
                        var prevHeader = $(sHeader).eq(i).prev('.e-stackedHeaderCell');
                        if (prevHeader.length > 0)
                            prevHeader.addClass('e-adapt-stheader');
                        break;
                    }
                    else if (prevCount < kObj._kbnSwipeCount - 1) {
                        $(sHeader).eq(i).find('div').css({ 'position': 'relative', 'left': (leftVal * ((kObj._kbnSwipeCount - 1) - prevCount)) + (8 * (count - 1)) });
                        break;
                    }
                }
            }
            if (kObj._kbnSwipeCount > 1)
                kObj._kbnSwipeWidth = kObj._kbnSwipeWidth + kObj.element.offset().left;
            kObj.headerContent.find('table').css({ 'transform': 'translate3d(' + kObj._kbnSwipeWidth + 'px, 0px, 0px)', 'transition-duration': '' });
            kObj.kanbanContent.find('table').eq(0).css({ 'transform': 'translate3d(' + kObj._kbnSwipeWidth + 'px, 0px, 0px)', 'transition-duration': '' });
            --kObj._kbnSwipeCount;
        }
    };
    InternalAdaptive.prototype._kbnLeftSwipe = function () {
        var kObj = this.kanbanObj, eleWidth = kObj.element.width(), rowCell = kObj.element.find('.e-rowcell:visible'), eqWidth, sHeader = kObj.element.find('.e-stackedHeaderCell'), tCount = 0, prevCount, count, curEle, proxy = kObj;
        if (((window.matchMedia("(max-width: 600px)").matches || window.matchMedia("((max-device-width: 800px)").matches) && kObj._kbnSwipeCount < kObj.model.columns.length - 1) || ((window.matchMedia("(max-width: 801px)").matches || window.matchMedia("(max-device-width: 1200px)").matches) && kObj._kbnSwipeCount < kObj.model.columns.length - 2)) {
            curEle = rowCell.eq(kObj._kbnSwipeCount + 1);
            if (curEle.length == 0)
                curEle = kObj.element.find(".e-headercell:visible").not(".e-stackedHeaderCell").eq(kObj._kbnSwipeCount + 1);
            kObj._kbnSwipeWidth = kObj._kbnSwipeWidth - (curEle.offset().left);
            if (window.matchMedia("(max-width: 600px)").matches || window.matchMedia("(max-device-width: 800px)").matches) {
                if (kObj._kbnSwipeCount == kObj.model.columns.length - 2)
                    eqWidth = eleWidth - curEle.width();
                else
                    eqWidth = (eleWidth - curEle.width()) / 2;
            }
            else if (window.matchMedia("(max-width: 801px)").matches || window.matchMedia("(max-device-width: 1200px)").matches) {
                if (kObj._kbnSwipeCount == kObj.model.columns.length - 3) {
                    var columnSpace = parseInt(kObj.contentTable.css('border-spacing').split('px')[0]);
                    eqWidth = eleWidth - ((curEle.width() + columnSpace) * 2);
                }
                else
                    eqWidth = (eleWidth - curEle.width()) / 8;
            }
            kObj._kbnSwipeWidth = kObj._kbnSwipeWidth + eqWidth;
            for (var i = 0; i < sHeader.length; i++) {
                var leftVal = kObj.headerContent.find('col:eq(0)').width();
                prevCount = tCount, count = kObj._kbnSwipeCount + 1;
                tCount = tCount + (parseInt($(sHeader).eq(i).attr('colspan')));
                if (count > prevCount && count < tCount) {
                    if (i == 0) {
                        $(sHeader).eq(i).addClass('e-adapt-stheader');
                        $(sHeader).eq(i).find('div').css({ 'position': 'relative', 'left': (leftVal * count) + (8 * (count - 1)) });
                        break;
                    }
                    else if (prevCount == kObj._kbnSwipeCount + 1) {
                        kObj.element.find('.e-adapt-stheader').removeClass('e-adapt-stheader');
                        $(sHeader).eq(i - 1).find('div').css({ 'position': '', 'left': '' });
                        $(sHeader).eq(i).addClass('e-adapt-stheader');
                        break;
                    }
                    else if (prevCount < kObj._kbnSwipeCount + 1) {
                        $(sHeader).eq(i).find('div').css({ 'position': 'relative', 'left': (leftVal * ((kObj._kbnSwipeCount + 1) - prevCount)) + (8 * (count - 1)) });
                        break;
                    }
                }
            }
            kObj._kbnSwipeWidth = kObj._kbnSwipeWidth + kObj.element.offset().left;
            kObj.headerContent.find('table').css({ 'transform': 'translate3d(' + kObj._kbnSwipeWidth + 'px, 0px, 0px)', 'transition-duration': '' });
            kObj.kanbanContent.find('table').eq(0).css({ 'transform': 'translate3d(' + kObj._kbnSwipeWidth + 'px, 0px, 0px)', 'transition-duration': '' });
            ++kObj._kbnSwipeCount;
        }
    };
    InternalAdaptive.prototype._clearAdaptSearch = function (e) {
        var kObj = this.kanbanObj, $target, $kanbanEle = kObj.element, $kanbanObj = $kanbanEle.data('ejKanban');
        if (!ej.isNullOrUndefined(e))
            $target = $(e.target);
        if (!ej.isNullOrUndefined($target))
            $target.hide();
        $kanbanEle.data("ejWaitingPopup").show();
        setTimeout(function () {
            var args, input;
            if (!ej.isNullOrUndefined($target))
                input = $target.prev('.e-input');
            if (ej.isNullOrUndefined(input) || input.length == 0) {
                if (!ej.isNullOrUndefined($target))
                    input = $target.next('.e-search').find('input');
                else
                    input = $kanbanEle.find('.e-kanbantoolbar .e-searchdiv > .e-input');
            }
            if (ej.isNullOrUndefined($target))
                args = { itemText: input.val() };
            else
                args = {
                    target: $target, currentTarget: $target,
                    itemIndex: $target.index(), toolbarData: e, itemText: input.val()
                };
            $kanbanObj._trigger("toolbarClick", args);
            kObj.KanbanFilter.searchCards("");
            kObj.element.find('.e-searchbar .e-search.e-tooltxt').removeClass('e-highliht-kbnsearchbar');
            if (!ej.isNullOrUndefined($kanbanObj.model.fields.swimlaneKey)) {
                var query = new ej.Query().where(ej.Predicate["or"]($kanbanObj.keyPredicates)).select($kanbanObj.model.fields.swimlaneKey);
                $kanbanObj._kbnAdaptDdlData = new ej.DataManager($kanbanObj._currentJsonData).executeLocal(query);
                $kanbanObj._kbnAdaptDdlData = ej.dataUtil.mergeSort(ej.dataUtil.distinct($kanbanObj._kbnAdaptDdlData));
                $kanbanObj.KanbanAdaptive._adaptiveSwimlaneRefresh();
            }
            $kanbanEle.data("ejWaitingPopup").hide();
        }, 300);
    };
    InternalAdaptive.prototype._adaptiveKbnClick = function (e) {
        var kObj = this.kanbanObj, $target = $(e.target), filterWin, filterIcon, slWindow = kObj.element.find('.e-swimlane-window');
        if (kObj.element.hasClass('e-responsive')) {
            filterWin = $('.e-kanbanfilter-window');
            filterIcon = kObj.element.find('.e-kanbanfilter-icon');
            if ($target.hasClass('e-searchitem')) {
                var searchBar = $target.parents('.e-searchbar');
                $target.prev().show();
                $target.prev().children(":first").removeAttr('style');
                searchBar.siblings().hide();
                if (searchBar.find('.e-adapt-search').length == 0) {
                    var searchDiv = ej.buildTag('div.e-icon e-adapt-search e-searchfind', "", {}), cancelDiv;
                    cancelDiv = ej.buildTag('div.e-icon e-adapt-cancel e-cancel', "", {});
                    $target.siblings('.e-searchdiv').append(cancelDiv).prepend(searchDiv);
                }
                $target.parents('.e-search').css({ 'border': '' });
                $target.parents('body').addClass('e-kbnwindow-modal');
                $target.parents('.e-kanbantoolbar').addClass('e-adaptive-search');
                searchBar.find('.e-adapt-cancel').show();
                $target.hide();
                if (e.type === 'tap')
                    e.preventDefault();
            }
            if (ej.browserInfo().name == "webkit")
                kObj.element.find('.e-adapt-cancel').addClass('e-webkitadapt');
            if (ej.browserInfo().name == "msie" && ej.browserInfo().version == "10.0")
                kObj.element.find('.e-adapt-cancel').addClass('e-msieadapt');
            if ($target.hasClass('e-adapt-cancel')) {
                this._clearAdaptSearch(e);
                $target.parents('.e-searchbar').siblings(".e-print,.e-kanbanfilter-icon,.e-customtoolbar").show();
                var search = $target.parents(".e-search");
                search.find('.e-searchdiv').hide();
                search.find('.e-searchitem').show();
                search.css({ 'border': 'none' });
                $target.parents('body').removeClass('e-kbnwindow-modal');
                $target.parents('.e-kanbantoolbar').removeClass('e-adaptive-search');
            }
            if ($target.hasClass('e-filter-done') || $target.hasClass('e-clearfilter')) {
                var text = $target.text(), args;
                filterWin.parents('body').removeClass('e-kbnwindow-modal');
                if ($target.hasClass('e-clearfilter'))
                    text = $target.val();
                args = {
                    target: $target, currentTarget: $target,
                    itemIndex: $target.index(), toolbarData: e, itemText: text
                };
                kObj._trigger("toolbarClick", args);
                if ($target.hasClass('e-clearfilter')) {
                    kObj._kbnFilterCollection = [];
                    kObj._kbnFilterObject = [];
                    kObj._filterCollection = [];
                    kObj._kbnAdaptFilterObject = [];
                    $target.hide();
                    filterIcon.removeClass('e-kbnclearfl-icon');
                    filterWin.find('.e-kbnfilter-check').parents('[aria-checked~="true"]').click();
                }
                else {
                    if (!filterIcon.hasClass('e-kbnclearfl-icon'))
                        filterIcon.addClass('e-kbnclearfl-icon');
                    if (kObj._kbnFilterObject.length == 0 && filterIcon.hasClass('e-kbnclearfl-icon'))
                        filterIcon.removeClass('e-kbnclearfl-icon');
                }
                args = {};
                args.requestType = ej.Kanban.Actions.Filtering;
                args.currentFilterObject = [];
                args.filterCollection = kObj._kbnFilterCollection;
                args.currentFilterObject = kObj._kbnFilterObject;
                var kbnCurrentData;
                if (!(kObj._dataSource() instanceof ej.DataManager))
                    kbnCurrentData = kObj._dataSource();
                else
                    kbnCurrentData = kObj._dataSource().dataSource.json;
                if (kbnCurrentData.length == 0 && kObj._currentJsonData.length > 0)
                    kbnCurrentData = kObj._currentJsonData;
                kObj._initialData = kbnCurrentData;
                kObj.KanbanCommon._processBindings(args);
                if (!ej.isNullOrUndefined(kObj.model.fields.swimlaneKey)) {
                    if (kObj._currentJsonData.length == 0) {
                        kObj.element.find('.e-swimlane-ddl,.e-swimlane-window').remove();
                        kObj.kanbanContent.data('ejScroller').destroy();
                    }
                    else {
                        var query = new ej.Query().where(ej.Predicate["or"](kObj.keyPredicates)).select(kObj.model.fields.swimlaneKey);
                        kObj._kbnAdaptDdlData = new ej.DataManager(kObj._currentJsonData).executeLocal(query);
                        kObj._kbnAdaptDdlData = ej.dataUtil.mergeSort(ej.dataUtil.distinct(kObj._kbnAdaptDdlData));
                        kObj.KanbanAdaptive._adaptiveSwimlaneRefresh();
                    }
                }
                filterWin.hide();
                kObj.kanbanWindowResize();
                if (e.type === 'tap')
                    e.preventDefault();
            }
            if ($target.hasClass('e-filterback-icon')) {
                var filters = [], chk;
                for (var i = 0; i < kObj.model.filterSettings.length; i++)
                    filters.push(kObj.model.filterSettings[i].text);
                for (var i = 0; i < kObj._kbnAdaptFilterObject.length; i++) {
                    var text = kObj._kbnAdaptFilterObject[i].text, index;
                    index = $.inArray(text, filters);
                    filters.splice(index, 1);
                    chk = filterWin.find("label.e-filterlabel:contains(" + text + ")").prev();
                    if (chk.attr('aria-checked') == "false")
                        chk.click();
                }
                for (var i = 0; i < filters.length; i++) {
                    chk = filterWin.find("label.e-filterlabel:contains(" + filters[i] + ")").prev();
                    if (chk.attr('aria-checked') == "true")
                        chk.click();
                }
                filterWin.hide();
                if (e.type === 'tap')
                    e.preventDefault();
            }
            if ($target.hasClass('e-kanbanfilter-icon')) {
                var clear = filterWin.find('.e-clearfilter'), headHeight, cFilter, cFilterHght = 0, scrollContent;
                scrollContent = filterWin.find('.e-filter-scrollcontent');
                if (slWindow.is(':visible'))
                    slWindow.hide();
                filterWin.show();
                if ($target.hasClass('e-kbnclearfl-icon'))
                    clear.show();
                else
                    clear.hide();
                headHeight = filterWin.find('.e-kbnfilterwindow-head').height();
                cFilter = filterWin.find('.e-clearfilter');
                if (cFilter.is(":visible")) {
                    scrollContent.ejScroller({ height: 0, buttonSize: 0, scrollerSize: 9, enableTouchScroll: true, autoHide: true });
                    cFilterHght = cFilter.outerHeight() + parseInt(cFilter.css('bottom'));
                }
                if ($(window).height() - cFilterHght < (filterWin.find('.e-filter-content').height() + headHeight)) {
                    scrollContent.ejScroller({ height: $(window).height() - (headHeight + cFilterHght + 10), buttonSize: 0, scrollerSize: 9, enableTouchScroll: true, autoHide: true });
                }
                filterWin.parents('body').addClass('e-kbnwindow-modal');
                if (e.type === 'tap')
                    e.preventDefault();
            }
            if ($target.attr('id') == this._id + "_Cancel" || $target.parent().attr("id") == this._id + "_closebutton")
                kObj.KanbanEdit.cancelEdit();
            if ($target.attr('id') == kObj._id + "_Save")
                kObj.KanbanEdit.endEdit();
        }
        var slScroller = kObj.element.find('.e-slwindow-scrollcontent');
        if ($target.hasClass('e-swimlane-item') || $target.parents('.e-swimlane-item').length > 0) {
            var trgt = $target, rows, toolBar;
            if ($target.parents('.e-swimlane-item').length > 0)
                trgt = $target.parents('.e-swimlane-item');
            trgt.parents('.e-swimlane-ul').find('.e-selected-item').removeClass('e-selected-item');
            trgt.addClass('e-selected-item');
            slWindow = $('#' + kObj._id + '_slWindow');
            kObj._kbnAdaptDdlIndex = kObj._freezeSlOrder = slWindow.find('.e-swimlane-item').index(trgt);
            toolBar = $('#' + kObj._id + "_toolbarItems");
            toolBar.find('.e-kbnhide').removeClass('e-kbnhide');
            toolBar.removeClass('e-kbntoolbar-body').prependTo(kObj.element);
            slWindow.removeClass('e-kbnslwindow-body').appendTo(kObj.element).hide();
            kObj.element.find('.e-swimlane-text').text(kObj._kbnAdaptDdlData[kObj._kbnAdaptDdlIndex]);
            rows = kObj.element[0].getElementsByClassName('e-columnrow');
            kObj.kanbanWindowResize();
            var scroller = kObj.kanbanContent.data('ejScroller');
            scroller.scrollY(0, true);
            scroller.scrollY(($(rows[kObj._kbnAdaptDdlIndex]).offset().top - kObj.kanbanContent.offset().top), true);
            kObj._freezeScrollTop = scroller.scrollTop();
            if (slScroller.hasClass('e-scroller'))
                slScroller.data('ejScroller').refresh();
        }
        if ($target.hasClass('e-swimlane-ddl') || $target.parents('.e-swimlane-ddl').length > 0) {
            var top = 36, toolBar;
            if (slWindow.is(':hidden')) {
                kObj.element.parents('body').addClass('e-kbnwindow-modal');
                toolBar = kObj.element.find('.e-kanbantoolbar');
                toolBar.children().not('.e-swimlane-ddl').addClass('e-kbnhide');
                toolBar.addClass('e-kbntoolbar-body').appendTo('body');
                kObj.element.find('.e-swimlane-window').addClass('e-kbnslwindow-body').appendTo('body');
                slWindow.show();
                if ($(window).height() < top + slScroller.height())
                    slScroller.ejScroller({ height: $(window).height() - top, buttonSize: 0, scrollerSize: 9, enableTouchScroll: true, autoHide: true });
            }
            else {
                slWindow.hide();
                toolBar = $('#' + kObj._id + "_toolbarItems");
                toolBar.find('.e-kbnhide').removeClass('e-kbnhide');
                toolBar.removeClass('e-kbntoolbar-body').prependTo(kObj.element);
                $('#' + kObj._id + '_slWindow').removeClass('e-kbnslwindow-body').appendTo(kObj.element).hide();
                kObj.element.parents('body').removeClass('e-kbnwindow-modal');
            }
        }
    };
    InternalAdaptive.prototype._kbnFilterChange = function (args) {
        var kObj = this, $kanbanEle = $(args.event.target).closest(".e-kanban"), kanbanObj = $kanbanEle.data("ejKanban");
        var filterName = $(args.event.target).parents('.e-chkbox-wrap').next().text(), kbnFilter, done, filterValue;
        if (!kObj["_kbnAutoFilterCheck"]) {
            if (filterName == "")
                filterName = $(args.event.target).next().text();
            kbnFilter = $kanbanEle.find('.e-kanbanfilter-icon');
            done = $('.e-kanbanfilter-window .e-filter-done');
            if (done.is(':hidden'))
                done.show();
            for (var count = 0; count < kObj["model"].filterSettings.length; count++) {
                if (kObj["model"].filterSettings[count]["text"] == filterName)
                    break;
            }
            filterValue = (count == kObj["model"].filterSettings.length ? null : kObj["model"].filterSettings[count]);
            if (!args.isChecked) {
                var index = $.inArray(filterValue, kObj["_kbnFilterObject"]);
                if (index >= 0) {
                    kObj["_kbnFilterObject"].splice(index, 1);
                    kObj["_kbnFilterCollection"].splice(index, 1);
                }
            }
            else {
                kObj["_kbnFilterObject"].push(filterValue);
                for (var i = 0; i < kObj["model"].filterSettings.length; i++) {
                    if (kObj["model"].filterSettings[i].text == filterValue.text) {
                        var query = kObj["model"].filterSettings[i].query["queries"][0].e;
                        kObj["_kbnFilterCollection"].push(query);
                    }
                }
            }
        }
    };
    InternalAdaptive.prototype._kbnAdaptSwimlaneData = function () {
        var kObj = this.kanbanObj, proxy = kObj;
        if (kObj.model.isResponsive && (ej.isNullOrUndefined(kObj.model.minWidth) || kObj.model.minWidth == 0) && !ej.isNullOrUndefined(kObj.model.fields.swimlaneKey)) {
            var query = new ej.Query();
            if (!ej.isNullOrUndefined(kObj.model.keyField))
                kObj._addColumnFilters();
            kObj.model.query["_fromTable"] != "" && query.from(kObj.model.query["_fromTable"]);
            if (kObj._dataSource() instanceof ej.DataManager && query["queries"].length && !kObj._dataManager.dataSource.offline) {
                var queryPromise = kObj._dataSource().executeQuery(query);
                queryPromise.done(ej.proxy(function (e) {
                    this._kbnAdaptDdlData = new ej.DataManager(e.result);
                    query = new ej.Query().where(ej.Predicate["or"](kObj.keyPredicates)).select(kObj.model.fields.swimlaneKey);
                    kObj._kbnAdaptDdlData = kObj._kbnAdaptDdlData.executeLocal(query);
                    kObj._kbnAdaptDdlData = ej.dataUtil.mergeSort(ej.dataUtil.distinct(kObj._kbnAdaptDdlData));
                }));
            }
            else {
                query = new ej.Query().where(ej.Predicate["or"](kObj.keyPredicates)).select(kObj.model.fields.swimlaneKey);
                if (kObj._dataManager.dataSource.offline && kObj._dataManager.dataSource.json.length)
                    kObj._kbnAdaptDdlData = kObj._dataManager.executeLocal(query);
                kObj._kbnAdaptDdlData = ej.dataUtil.mergeSort(ej.dataUtil.distinct(kObj._kbnAdaptDdlData));
            }
        }
    };
    InternalAdaptive.prototype._setResponsiveHeightWidth = function () {
        var kObj = this.kanbanObj;
        if (typeof (kObj.model.scrollSettings.width) == "string")
            kObj._originalScrollWidth = kObj.element.width();
        else if (kObj.model.scrollSettings.width > 0)
            kObj._originalScrollWidth = kObj.model.scrollSettings.width;
        if (typeof (kObj.model.scrollSettings.height) == "string")
            kObj._originalScrollHeight = kObj.getContent().height();
        else if (kObj.model.scrollSettings.height > 0)
            kObj._originalScrollHeight = kObj.model.scrollSettings.height;
        if (kObj.model.isResponsive) {
            $(window).on("resize", $.proxy(kObj.kanbanWindowResize, kObj));
            kObj.kanbanWindowResize();
        }
    };
    InternalAdaptive.prototype._renderResponsiveKanban = function (isScroller, elemHeight, width, winHeight, winWidth) {
        var kObj = this.kanbanObj;
        if (isScroller) {
            kObj.model.scrollSettings.width = ej.isNullOrUndefined(kObj._originalScrollWidth) ? Math.min(width, winWidth) : Math.min(kObj._originalScrollWidth, Math.min(width, winWidth));
            var height = Math.min(winHeight, elemHeight);
            height = ej.isNullOrUndefined(kObj._originalScrollHeight) ? height : Math.min(kObj._originalScrollHeight, winHeight);
            kObj.model.scrollSettings.height = height;
            if (kObj._originalScrollWidth < winWidth)
                kObj.model.scrollSettings.width = Math.min(width, winWidth);
            if (kObj.KanbanScroll)
                kObj.KanbanScroll._renderScroller();
        }
        else {
            kObj.model.scrollSettings.width = '100%';
            if (!ej.isNullOrUndefined(kObj._originalScrollWidth))
                kObj.model.scrollSettings.width = Math.min(kObj._originalScrollWidth, width);
            var height = kObj.element.outerHeight();
            if (!ej.isNullOrUndefined(kObj._originalScrollHeight))
                height = Math.min(kObj._originalScrollHeight, winHeight);
            kObj.model.scrollSettings.height = height;
            if (kObj.KanbanScroll)
                kObj.KanbanScroll._renderScroller();
        }
    };
    InternalAdaptive.prototype._columnTimeoutAdapt = function () {
        var kObj = this.kanbanObj;
        if (Math.floor(kObj.element.width()) > $(window).width()) {
            kObj.element.width(($(window).width() - kObj.element.offset().left) - 5);
            kObj.headerContent.removeClass('e-scrollcss');
            kObj.headerContent.find('.e-hscrollcss').removeClass('e-hscrollcss');
        }
        var eqwidth, hCell, rCell, sHeader, proxy = kObj, timeot, curEle;
        if (window.matchMedia("(max-width: 480px)").matches)
            eqwidth = (kObj.element.width() * (80 / 100));
        else if (window.matchMedia("(max-width: 600px)").matches || window.matchMedia("(max-device-width: 800px)").matches)
            eqwidth = (kObj.element.width() * (60 / 100));
        else if (window.matchMedia("(max-width: 801px)").matches || window.matchMedia("(max-device-width: 1200px)").matches)
            eqwidth = (kObj.element.width() * (43 / 100));
        hCell = kObj.element.find('.e-headercell');
        rCell = kObj.element.find('.e-columnrow .e-rowcell');
        kObj.kanbanContent.find('table:eq(0) > colgroup col').width(eqwidth);
        rCell.width(eqwidth);
        kObj.headerContent.find('table > colgroup col').width(eqwidth);
        hCell.not('.e-stackedHeaderCell').width(eqwidth);
        sHeader = kObj.element.find('.e-stackedHeaderCell');
        for (var i = 0; i < sHeader.length; i++)
            $(sHeader).eq(i).width(parseInt($(sHeader).eq(i).attr('colspan')) * eqwidth);
        timeot = setTimeout(function () {
            if (proxy._kbnSwipeCount > 0) {
                curEle = rCell.eq(proxy._kbnSwipeCount);
                if (curEle.length == 0)
                    curEle = hCell.not('.e-stackedHeaderCell').eq(kObj._kbnSwipeCount);
                proxy._kbnSwipeWidth = proxy._kbnSwipeWidth - curEle.offset().left;
                var eleWidth = proxy.element.width(), colWidth = curEle.width();
                if (window.matchMedia("(max-width: 600px)").matches || window.matchMedia("(max-device-width: 800px)").matches) {
                    if (proxy._kbnSwipeCount == proxy.model.columns.length - 1) {
                        if (proxy.element.hasClass('e-swimlane-responsive'))
                            eqwidth = eleWidth - (colWidth + 18);
                        else
                            eqwidth = eleWidth - colWidth;
                    }
                    else
                        eqwidth = (eleWidth - colWidth) / 2;
                }
                else if (window.matchMedia("(max-width: 801px)").matches || window.matchMedia("(max-device-width: 1200px)").matches) {
                    if (proxy._kbnSwipeCount == proxy.model.columns.length - 3) {
                        var columnSpace = parseInt(proxy.contentTable.css('border-spacing').split('px')[0]);
                        eqWidth = eleWidth - ((colWidth + columnSpace) * 2);
                    }
                    else
                        eqwidth = (eleWidth - colWidth) / 8;
                }
                proxy._kbnSwipeWidth = proxy._kbnSwipeWidth + eqwidth + kObj.element.offset().left;
                proxy.headerContent.find('table').css({ 'transform': 'translate3d(' + proxy._kbnSwipeWidth + 'px, 0px, 0px)', 'transition-duration': '0ms' });
                proxy.kanbanContent.find('table').eq(0).css({ 'transform': 'translate3d(' + proxy._kbnSwipeWidth + 'px, 0px, 0px)', 'transition-duration': '0ms' });
                clearTimeout(timeot);
            }
        }, 2500);
    };
    InternalAdaptive.prototype._addSwimlaneName = function () {
        var rows = this.kanbanObj.element.find('.e-columnrow');
        for (var i = 0; i < rows.length; i++) {
            var cells = rows.eq(i).find('.e-rowcell');
            for (var j = 0; j < cells.length; j++) {
                var $limit = cells.eq(j).find('.e-limits');
                if ($limit.length == 0)
                    $limit = ej.buildTag('div.e-limits', "", {}, {});
                if ($limit.find('.e-swimlane-name').length == 0) {
                    $limit.append(ej.buildTag('div.e-swimlane-name', this.kanbanObj._kbnAdaptDdlData[i], {}, {}));
                    cells.eq(j).prepend($limit);
                }
                else {
                    var name = $limit.find('.e-swimlane-name');
                    name.text(this.kanbanObj._kbnAdaptDdlData[i]);
                    name.show();
                    name.parents('.e-limits').show();
                }
            }
        }
    };
    InternalAdaptive.prototype._kbnAdaptSwimlaneDdl = function () {
        var kObj = this.kanbanObj, $ddl = ej.buildTag('div.e-swimlane-ddl', "", {}), curItem = kObj.model.fields.swimlaneKey, textDiv, slWindow, slItem, slScrollContent;
        var ddlItems = [], ddlTempl, $select, $option, data, uniqueData, toolbar = kObj.element.find('.e-kanbantoolbar');
        kObj.element.addClass('e-swimlane-responsive');
        if (curItem && kObj.model.swimlaneSettings.headers.length > 0)
            kObj._kbnAdaptDdlData = kObj._slText;
        ej.buildTag('div.e-swimlane-text', kObj._kbnAdaptDdlData[0]).appendTo($ddl);
        ej.buildTag('div.e-swimlane-arrow').appendTo($ddl);
        slWindow = ej.buildTag('div#' + kObj._id + '_slWindow.e-swimlane-window', "", {});
        slItem = ej.buildTag('ul.e-swimlane-ul ', "", {});
        for (var index = 0; index < kObj._kbnAdaptDdlData.length; index++)
            ej.buildTag('li.e-swimlane-item ', '<div>' + kObj._kbnAdaptDdlData[index] + '</div>', {}).appendTo(slItem);
        slItem.find('.e-swimlane-item:eq(0)').addClass('e-selected-item');
        this._addSwimlaneName();
        slScrollContent = ej.buildTag("div#" + kObj._id + "_slScrollContent", "<div></div>").addClass("e-slwindow-scrollcontent");
        slScrollContent.children().append(slItem);
        slScrollContent.appendTo(slWindow);
        slWindow.appendTo(kObj.element).hide();
        if (toolbar.length == 0) {
            kObj._renderToolBar().insertBefore(kObj.element.find(".e-kanbanheader").first());
            toolbar = kObj.element.find('.e-kanbantoolbar').css("padding", "0px").addClass('e-sladapt-bar');
        }
        toolbar.prepend($ddl);
        kObj.element.find('.e-swimlanerow').hide();
    };
    InternalAdaptive.prototype._kbnAdaptFilterWindow = function () {
        var kObj = this.kanbanObj, toolbar = kObj.element.find('.e-kanbantoolbar'), headDiv, bodyDiv, clearbtn, $div, filterIcon, $filterWin, filterScrollContent;
        toolbar.find('.e-quickfilter').parent().hide();
        $filterWin = ej.buildTag('div.e-kanbanfilter-window e-widget', "", {});
        headDiv = ej.buildTag('div.e-kbnfilterwindow-head', "", {});
        ej.buildTag('div.e-filterback-icon', "", {}).appendTo(headDiv);
        ej.buildTag('div.e-text', "FILTER", {}).appendTo(headDiv);
        ej.buildTag('div.e-text e-filter-done', "DONE", {}).appendTo(headDiv).hide();
        headDiv.appendTo($filterWin);
        $('body').append($filterWin.hide());
        bodyDiv = ej.buildTag('div.e-kbnfilterwindow-body', "", {});
        $div = ej.buildTag("div.e-filter-content");
        for (var i = 0; i < kObj.model.filterSettings.length; i++) {
            var $item = ej.buildTag("div", "", {});
            $item.append("<input type='checkbox' class='e-kbnfilter-check' id='check" + i + "' /><label for='check" + i + "' class='e-filterlabel'>" + kObj.model.filterSettings[i].text + "</label></td>");
            $div.append($item);
            $item.find('input').ejCheckBox({ change: $.proxy(this._kbnFilterChange, kObj) });
        }
        bodyDiv.append($div);
        filterScrollContent = ej.buildTag("div#" + kObj._id + "_filterScrollContent", "<div></div>").addClass("e-filter-scrollcontent");
        filterScrollContent.children().append(bodyDiv);
        filterScrollContent.appendTo($filterWin);
        clearbtn = ej.buildTag('input.e-clearfilter', "", {}, { type: "button", id: kObj._id + "_ClearFilter" });
        clearbtn.ejButton({ text: "ClearFilter" });
        $filterWin.append(clearbtn);
        clearbtn.hide();
        filterIcon = ej.buildTag('div.e-kanbanfilter-icon', "", { 'float': 'right' });
        toolbar.append(filterIcon);
    };
    InternalAdaptive.prototype._setAdaptiveSwimlaneTop = function () {
        var kObj = this.kanbanObj;
        if (kObj.element.hasClass("e-responsive") && !ej.isNullOrUndefined(kObj.model.fields.swimlaneKey)) {
            var scroller = kObj.kanbanContent.data('ejScroller'), rows, sTop;
            rows = kObj.element[0].getElementsByClassName('e-columnrow');
            sTop = kObj._freezeScrollTop;
            scroller.scrollY(sTop, true);
            kObj._freezeScrollTop = sTop;
        }
    };
    InternalAdaptive.prototype._adaptiveSwimlaneRefresh = function () {
        var kObj = this.kanbanObj, slRows;
        kObj.element.find('.e-swimlane-window .e-swimlane-ul').empty();
        var header = kObj.model.swimlaneSettings.headers;
        if (header.length > 0) {
            for (var i = 0; i < header.length; i++) {
                var index = kObj._kbnAdaptDdlData.indexOf(header[i].key);
                if (index == -1)
                    !ej.isNullOrUndefined(header[i].text) ? kObj._kbnAdaptDdlData.push(header[i].text) : (typeof header[i].key == 'string' && header[i].key.length > 0) ? kObj._kbnAdaptDdlData.push(header[i].key) : false;
                else if (!ej.isNullOrUndefined(header[i].text)) {
                    kObj._kbnAdaptDdlData[index] = kObj._kbnAdaptDdlData.push(header[i].text);
                }
            }
            kObj._kbnAdaptDdlData = ej.dataUtil.mergeSort(kObj._kbnAdaptDdlData);
        }
        for (var index = 0; index < kObj._kbnAdaptDdlData.length; index++)
            ej.buildTag('li.e-swimlane-item ', '<div>' + kObj._kbnAdaptDdlData[index] + '</div>', {}).appendTo(kObj.element.find('.e-swimlane-window .e-swimlane-ul'));
        if (kObj.KanbanAdaptive && kObj.element.hasClass('e-responsive') && !ej.isNullOrUndefined(kObj.model.fields.swimlaneKey)) {
            kObj.KanbanAdaptive._addSwimlaneName();
            slRows = kObj.kanbanContent.find('.e-columnrow');
            for (var k = 0; k < slRows.length; k++) {
                if (slRows.eq(k).offset().top >= 0) {
                    kObj.element.find('.e-swimlane-text').text(kObj._kbnAdaptDdlData[k]);
                    break;
                }
            }
            if (kObj.kanbanContent.hasClass('e-scroller'))
                kObj.kanbanContent.data('ejScroller').refresh();
        }
    };
    InternalAdaptive.prototype._removeKbnAdaptItems = function () {
        var kObj = this.kanbanObj;
        if (kObj.element.hasClass('e-responsive')) {
            var toolbar = kObj.element.find('.e-kanbantoolbar'), sHeader = kObj.element.find('.e-stackedHeaderCell'), scrollEle, swimDdl = kObj.element.find('.e-swimlane-ddl'), $filterWin = $('.e-kanbanfilter-window'), scrollCell;
            if (swimDdl.length > 0) {
                swimDdl.remove();
                kObj.element.find('.e-swimlane-window').remove();
            }
            if (toolbar.hasClass('e-sladapt-bar'))
                toolbar.remove();
            if ($filterWin.length > 0) {
                var filters = $filterWin.find('.e-filter-content').children();
                for (var i = 0; i < filters.length; i++) {
                    if (filters.eq(i).find('span.e-chkbox-wrap').attr('aria-checked') == "true") {
                        var index = filters.index(filters.eq(i));
                        kObj.element.find('.e-quickfilter').nextAll('li.e-tooltxt').eq(index).addClass('e-select');
                    }
                }
                $filterWin.remove();
            }
            if (sHeader.length > 0)
                sHeader.width('');
            kObj.element.find('.e-rowcell,.e-headercell').width('');
            kObj.kanbanContent.find('table:eq(0) > colgroup col').width('');
            kObj.headerContent.find('table > colgroup col').width('');
            if (!kObj.element.hasClass('e-swimlane-responsive')) {
                scrollEle = kObj.element.find('.e-rowcell .e-cell-scrollcontent:visible');
                for (var i = 0; i < scrollEle.length; i++) {
                    var scrollObj = $(scrollEle[i]).data('ejScroller');
                    if (!ej.isNullOrUndefined(scrollObj))
                        scrollObj.destroy();
                }
            }
            if (toolbar.length > 0 && toolbar.is(':visible')) {
                toolbar.css('display', 'block');
                var qFilter = toolbar.find('.e-quickfilter'), sBar = toolbar.find('.e-searchbar'), sDiv;
                if (toolbar.find('.e-adapt-cancel').is(':visible'))
                    sBar.find('.e-searchitem').addClass('e-cancel').removeClass('e-searchfind');
                toolbar.find('.e-adapt-cancel,.e-adapt-search').hide();
                if (qFilter.length > 0) {
                    toolbar.find('.e-kanbanfilter-icon').remove();
                    qFilter.parent('.e-ul.e-horizontal').show();
                }
                sDiv = sBar.find('.e-searchdiv');
                if (sDiv.length > 0) {
                    sDiv.show();
                    sBar.find('.e-search').css('border', '');
                    sBar.find('.e-searchitem').show();
                    toolbar.parents('body').removeClass('e-kbnwindow-modal');
                    toolbar.removeClass('e-adaptive-search');
                }
            }
            kObj.headerContent.find('table').css({ 'transform': '', 'transition-duration': '' });
            kObj.kanbanContent.find('table').eq(0).css({ 'transform': '', 'transition-duration': '' });
            scrollCell = kObj.element.find('.e-cell-scrollcontent');
            for (var i = 0; i < scrollCell.length; i++) {
                var scrollDiv = scrollCell.eq(i).children();
                scrollDiv.children().appendTo(scrollCell.eq(i).parents('.e-rowcell'));
                scrollCell.eq(i).remove();
            }
            var kbnDialog = kObj.element.find('.e-kanbandialog');
            if (kbnDialog.is(':visible')) {
                var scroller = kbnDialog.parents('.e-dialog-scroller'), wrapper = kbnDialog.parents('.e-dialog');
                wrapper.css({ 'top': '', 'left': '' }).removeClass('e-kbnadapt-editdlg');
                scroller.css('height', 'auto');
                scroller.ejScroller({ height: 0, buttonSize: 0, scrollerSize: 9, enableTouchScroll: true, autoHide: true });
                kbnDialog.parents('body').removeClass('e-kbnwindow-modal');
                wrapper.hide();
                kObj.KanbanEdit._onKbnDialogOpen();
            }
            if (!ej.isNullOrUndefined(kObj.model.fields.swimlaneKey)) {
                if (kObj.kanbanContent.hasClass('e-scroller'))
                    kObj.kanbanContent.data('ejScroller').destroy();
                kObj.element.parents('body').removeClass('e-kbnwindow-modal');
                kObj.element.find('.e-swimlanerow').show();
                var rows = kObj.element.find('.e-columnrow');
                for (var i = 0; i < rows.length; i++) {
                    var cells = rows.eq(i).find('.e-rowcell');
                    for (var j = 0; j < cells.length; j++) {
                        var name = cells.eq(j).find('.e-swimlane-name');
                        if (name.length > 0) {
                            if (name.siblings().length == 0)
                                name.parents('.e-limits').hide();
                            else
                                name.hide();
                        }
                    }
                }
            }
            var stHeader = kObj.element.find('.e-adapt-stheader');
            if (stHeader.length > 0)
                stHeader.find('div').css({ 'position': '', 'left': '' });
            kObj.element.removeClass('e-responsive');
            kObj.element.removeClass('e-swimlane-responsive');
        }
    };
    InternalAdaptive.prototype._setAdaptEditWindowHeight = function () {
        var kObj = this.kanbanObj, kbnDialog, scroller, title;
        kbnDialog = $('#' + kObj._id + "_dialogEdit"), scroller = kbnDialog.parents('.e-dialog-scroller'), title;
        kbnDialog.parents('.e-dialog').css({ 'top': '0', 'left': '0' }).addClass('e-kbnadapt-editdlg');
        kbnDialog.parents('body').addClass('e-kbnwindow-modal');
        title = scroller.prev('.e-titlebar');
        scroller.ejScroller({ height: $(window).height() - title.outerHeight(), buttonSize: 0, scrollerSize: 9, enableTouchScroll: true, autoHide: true });
        scroller.data('ejScroller').refresh();
        kbnDialog.css('height', scroller.height());
    };
    return InternalAdaptive;
}());
window.ej.createObject("ej.KanbanFeatures.Adaptive", InternalAdaptive, window);
