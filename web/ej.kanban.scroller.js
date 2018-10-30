var InternalScroller = (function () {
    function InternalScroller(element) {
        this.kanbanObj = null;
        this.kanbanObj = element;
    }
    ;
    InternalScroller.prototype._initScrolling = function () {
        var kObj = this.kanbanObj;
        if (kObj.model.width || kObj.model.height) {
            kObj.model.allowScrolling = true;
            if (kObj.model.width)
                kObj.model.scrollSettings.width = kObj.model.width;
            if (kObj.model.height)
                kObj.model.scrollSettings.height = kObj.model.height;
        }
        kObj._originalScrollWidth = kObj.model.scrollSettings.width;
    };
    InternalScroller.prototype._renderScroller = function () {
        var kObj = this.kanbanObj;
        if (!kObj.model.scrollSettings)
            kObj.model.scrollSettings = {};
        if (typeof (kObj._originalScrollWidth) == "string") {
            kObj.element.css("width", "auto");
            var width = kObj.element.width();
            if (kObj.model.scrollSettings.width == "auto" || kObj._originalScrollWidth == "auto")
                kObj._originalScrollWidth = "100%";
            kObj.model.scrollSettings.width = width * (parseFloat(kObj._originalScrollWidth) / 100);
        }
        if (typeof (kObj.model.scrollSettings.height) == "string") {
            var height = kObj.element.height();
            if (kObj.model.scrollSettings.height == "auto")
                kObj.model.scrollSettings.height = "100%";
            kObj.model.scrollSettings.height = height * (parseFloat(kObj.model.scrollSettings.height) / 100);
        }
        if ((kObj.model.scrollSettings.width || kObj.model.width))
            kObj.element.width(kObj.model.scrollSettings.width || kObj.model.width);
        var contentHeight = kObj.model.scrollSettings.height != 0 ? (kObj.model.scrollSettings.height - kObj.getHeaderTable().height() - (!ej.isNullOrUndefined(kObj._filterToolBar) && kObj._filterToolBar.height())) : kObj.model.scrollSettings.height;
        var $content = kObj.getContent().attr("tabindex", "0");
        kObj.element.addClass("e-kanbanscroll");
        $content.ejScroller({
            enableRTL: kObj.model.enableRTL,
            height: contentHeight,
            width: parseInt(kObj.model.scrollSettings.width),
            thumbStart: $.proxy(kObj._kbnThumbStart, kObj),
            scroll: $.proxy(kObj._freezeSwimlane, kObj)
        });
        if (kObj.getContent().ejScroller("isVScroll")) {
            kObj.element.find(".e-kanbanheader").addClass("e-scrollcss");
            kObj.getHeaderContent().find("div").first().addClass("e-headercontent");
        }
        else
            kObj.element.find(".e-kanbanheader").removeClass("e-scrollcss");
        if (kObj.model.scrollSettings.width || kObj.model.width)
            kObj.element.width(kObj.model.scrollSettings.width || kObj.model.width);
        var scroller = kObj.getContent().data("ejScroller"), css = scroller && (scroller.isVScroll()) ? "addClass" : "removeClass";
        kObj.getHeaderContent().find(".e-headercontent")[css]("e-hscrollcss");
    };
    InternalScroller.prototype._refreshScroller = function (args) {
        var kObj = this.kanbanObj;
        var kanbanContent = kObj.getContent().first();
        if (ej.isNullOrUndefined(kanbanContent.data("ejScroller")))
            return;
        if (args.requestType == "beginedit")
            kObj.getScrollObject().scrollY(0, true);
        kanbanContent.ejScroller("refresh");
        kanbanContent.ejScroller({ enableRTL: kObj.model.enableRTL });
        if (kanbanContent.ejScroller("isVScroll") && !kObj.getScrollObject().model.autoHide) {
            kObj.getHeaderContent().addClass("e-scrollcss");
            !kObj.getHeaderContent().find(".e-headercontent").hasClass("e-hscrollcss") && kObj.getHeaderContent().find(".e-headercontent").addClass("e-hscrollcss");
        }
        else
            kObj.element.find(".e-kanbanheader").removeClass("e-scrollcss");
    };
    InternalScroller.prototype._refreshSwimlaneToggleScroller = function () {
        var kObj = this.kanbanObj;
        var vScrollArea = kObj.headerContent.find('.e-hscrollcss');
        kObj.KanbanScroll._refreshScroller({ requestType: "refresh" });
        if (kObj.getContent().find('.e-vscrollbar').length > 0)
            vScrollArea.removeClass('e-vscroll-area');
        else
            vScrollArea.addClass('e-vscroll-area');
    };
    return InternalScroller;
}());
window.ej.createObject("ej.KanbanFeatures.Scroller", InternalScroller, window);
