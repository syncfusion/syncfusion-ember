var InternalFilter = (function () {
    function InternalFilter(element) {
        this.kanbanObj = null;
        this.kanbanObj = element;
    }
    ;
    InternalFilter.prototype._filterHandler = function (filterValue, currentTarget) {
        var kObj = this.kanbanObj, args = { requestType: "filtering", currentFilterObject: [], filterCollection: kObj._filterCollection };
        args.currentFilterObject.push(filterValue);
        if (kObj.model.isResponsive) {
            var filter = [];
            kObj._kbnFilterObject = kObj._kbnFilterObject.concat(args.currentFilterObject);
            for (var i = 0; i < kObj._kbnFilterObject.length; i++) {
                var index = $.inArray(kObj._kbnFilterObject[i], filter);
                if (index < 0)
                    filter.push(kObj._kbnFilterObject[i]);
            }
            kObj._kbnFilterObject = filter;
        }
        var kbnCurrentData;
        if (!(kObj._dataSource() instanceof ej.DataManager))
            kbnCurrentData = kObj._dataSource();
        else
            kbnCurrentData = kObj._dataSource().dataSource.json;
        if (kbnCurrentData.length == 0 && kObj._currentJsonData.length > 0)
            kbnCurrentData = kObj._currentJsonData;
        kObj._initialData = kbnCurrentData;
        for (var i = 0; i < kObj.model.filterSettings.length; i++) {
            if (kObj.model.filterSettings[i].text == args.currentFilterObject[0].text) {
                var query = kObj.model.filterSettings[i].query["queries"][0].e;
                if (ej.isNullOrUndefined(args.filterCollection[0])) {
                    args.filterCollection.push(query);
                    $(currentTarget).addClass("e-select");
                }
                else if ($(currentTarget).hasClass("e-select")) {
                    $(currentTarget).removeClass("e-select");
                    var index = $.inArray(query, args.filterCollection);
                    args.filterCollection.splice(index, 1);
                }
                else {
                    $(currentTarget).addClass("e-select");
                    args.filterCollection.push(query);
                }
                break;
            }
        }
        kObj.KanbanCommon._processBindings(args);
    };
    InternalFilter.prototype.filterCards = function (query) {
        var args = { requestType: "filtering", filterCollection: this.kanbanObj._filterCollection };
        var query = query.queries[0].e;
        args.filterCollection.push(query);
        this.kanbanObj.KanbanCommon._processBindings(args);
    };
    InternalFilter.prototype.clearFilter = function () {
        var kObj = this.kanbanObj;
        if (kObj._filterCollection.length != 0) {
            var args = { requestType: "filtering" };
            kObj._filterCollection = [];
            kObj.element.find(".e-kanbantoolbar .e-tooltxt").removeClass("e-select");
            kObj.KanbanCommon._processBindings(args);
        }
    };
    InternalFilter.prototype._filterLimitCard = function (args) {
        var kObj = this.kanbanObj, cardCount, curHeader, count;
        for (var i = 0; i < kObj.model.columns.length; i++) {
            var column = kObj.model.columns[i];
            var card = kObj.getHeaderContent().find("span.e-totalcount");
            if (kObj.model.enableTotalCount) {
                card = $(card[i]);
                var index = $(card).text().indexOf(kObj.localizedLabels.FilterOfText);
                if (!ej.isNullOrUndefined(args) && (args.requestType == "drop" || args.requestType == "beginedit" || args.requestType == "save" || args.requestType == "cancel" || args.requestType == "refresh" || args.requestType == "add" || (args.requestType == "filtering" ? (args.filterCollection.length > 0 ? true : kObj.model.searchSettings.key == "" ? false : true) : args.requestType == "search" ? (kObj.model.searchSettings.key != "" ? true : (kObj.model.filterSettings.length > 0 ? kObj.element.find(".e-kanbantoolbar .e-tooltxt").hasClass("e-select") : false)) : false))) {
                    if (index != -1 && kObj._dataManager instanceof ej.DataManager && !kObj._dataManager.dataSource.offline) {
                        count = kObj.localizedLabels.FilterOfText.length + index + 1;
                        cardCount = $(card).text().slice(count);
                        if (args.requestType == "drop" || args.requestType == "save") {
                            curHeader = kObj.headerContent.find(".e-headercell").eq(i);
                            if (curHeader.hasClass("e-card-dragged")) {
                                cardCount = --cardCount;
                                curHeader.removeClass("e-card-dragged");
                            }
                            if (curHeader.hasClass("e-card-dropped")) {
                                cardCount = ++cardCount;
                                curHeader.removeClass("e-card-dropped");
                            }
                        }
                        $(card).text(cardCount);
                    }
                    else if ((kObj._dataManager instanceof ej.DataManager && kObj._dataManager.dataSource.offline) && (index != -1 || kObj.model.filterSettings.length != 0 || kObj.model.searchSettings.key.length != 0)) {
                        cardCount = new ej.DataManager(kObj.model.dataSource).executeLocal(new ej.Query().where(kObj.model.keyField, ej.FilterOperators.equal, column.key)).length;
                        $(card).text(cardCount);
                    }
                    var columnKey = kObj.KanbanCommon._multikeySeparation(column.key);
                    $(card).text($($(kObj.element.find(".e-columnrow")).find('td[data-ej-mappingkey="' + columnKey + '"] > div.e-kanbancard')).length + " " + kObj.localizedLabels.FilterOfText + " " + $(card).text());
                }
                else if (!ej.isNullOrUndefined(column.constraints))
                    kObj.KanbanCommon._renderLimit();
                else
                    $(card).text($(card).text().slice(index + 3));
            }
        }
    };
    InternalFilter.prototype.searchCards = function (searchString) {
        var args, kObj = this.kanbanObj, searchBar = $("#" + kObj._id + "_toolbarItems_search");
        if (searchBar.find("input").val() != searchString)
            searchBar.find("input").val(searchString);
        if (!kObj.element.hasClass('e-responsive')) {
            searchBar.parent().addClass('e-highliht-kbnsearchbar');
            if (searchBar.find("input").val() == "")
                searchBar.parent().removeClass('e-highliht-kbnsearchbar');
        }
        args = { requestType: "search", keyValue: searchString };
        if (searchString != "" || kObj.model.searchSettings.key != "") {
            kObj.model.searchSettings.key = searchString;
            if (kObj.model.searchSettings.key.length > 0) {
                var kbnCurrentData;
                if (!(kObj._dataSource() instanceof ej.DataManager))
                    kbnCurrentData = kObj._dataSource();
                else
                    kbnCurrentData = kObj._dataSource().dataSource.json;
                if (kbnCurrentData.length == 0 && kObj._currentJsonData.length > 0)
                    kbnCurrentData = kObj._currentJsonData;
                kObj._initialData = kbnCurrentData;
            }
            kObj.KanbanCommon._processBindings(args);
        }
    };
    InternalFilter.prototype.clearSearch = function () {
        var kObj = this.kanbanObj;
        kObj.element.find(".e-kanbantoolbar #" + kObj._id + "_toolbarItems_search").val("");
        this.searchCards("");
        $.extend(kObj.model.searchSettings, kObj.defaults.searchSettings);
    };
    InternalFilter.prototype._onToolbarKeypress = function (sender) {
        var kObj = this["KanbanFilter"]["kanbanObj"];
        var $kanbanEle = kObj.element, kanbanObj = $kanbanEle.data("ejKanban");
        if (kObj.model.isResponsive && $kanbanEle.hasClass('e-responsive')) {
            $(kObj.itemsContainer).parent().children().not('.e-searchbar').hide();
            kObj.KanbanAdaptive._kbnTimeoutSearch($kanbanEle, sender);
        }
    };
    return InternalFilter;
}());
window.ej.createObject("ej.KanbanFeatures.Filter", InternalFilter, window);
