(function ($, ej, undefined) {
    ej.mobile.AjaxLoader = {
        _renderItems: function (item, appendTo, index) {
            var item = $(item);
            this._control = this._rootCSS.split("e-m-")[1],
            item.attr("id", this.elementId + "-" + this._control + "-item" + index).addClass("e-m-" + this._control + "-item");
            var isAjax = !(ej.isNullOrUndefined(this._items[index].enableAjax)) && this._items[index].enableAjax ? this._items[index].enableAjax : this.model.enableAjax;
            if (!this._storedContent[index] && !isAjax) {
                if (this._items[index].href) {
                    var templateContent = ej.getCurrentPage().find(this._items[index].href);
                    this._storedContent[index] = templateContent[0] && templateContent[0].nodeName && templateContent[0].nodeName.toLowerCase() == "script" ? ej.getClearString(templateContent[0].innerHTML) : templateContent;
                }
                else {
                    this._storedContent[index] = this._items[index].template ? this._items[index].template : item.html();
                }
            }
            if (!isAjax) {
                var itemContent = ej.buildTag("div.e-m-" + this._control + "-content e-m-" + this._control + "-static-content#" + this.elementId + "-" + this._control + "-item" + index + "-content", this._storedContent[index]).appendTo(appendTo);                
            }
            if (isAjax && this.model.showAjaxPopup)
                ej.mobile.WaitingPopup.show();
            if (isAjax && this.model.prefetchAjaxContent)
                this._loadAjaxContent(item, appendTo, index);
        },

        _loadAjaxContent: function (item, appendTo, index) {
            var currentItem = $(item), proxy = this, local = this;
            var urlVal = this._items[index].href;
            if (!$.support.pushstate || ej.isWindowsWebView())
                urlVal = this._makeUrlAbsolute(urlVal);
            var BeforeLoad = { item: item, index: index, text: currentItem.text(), url: this.model.ajaxSettings.url ? this.model.ajaxSettings.url : urlVal };
            if (this.model.ajaxBeforeLoad)
                this._trigger("ajaxBeforeLoad", BeforeLoad);
            var ajaxSettings = {
                cache: this.model.ajaxSettings.cache,
                async: this.model.ajaxSettings.async,
                type: this.model.ajaxSettings.type,
                contentType: this.model.ajaxSettings.contentType,
                url: ej.isWindowsWebView() ? urlVal : this.model.ajaxSettings.url ? this.model.ajaxSettings.url : urlVal,
                dataType: this.model.ajaxSettings.dataType,
                data: this.model.ajaxSettings.data,
                "successHandler": function (data) {
                    //Ajax post success event handler 
                    var successData = { item: item, index: index, text: currentItem.text(), url: proxy.model.ajaxSettings.url ? proxy.model.ajaxSettings.url : urlVal };
                    var currContent = ej.getCurrentPage().find("#" + proxy.elementId + "-" + local._control + "-item" + index + "-content");
                    if (!proxy.model.enableCache || currContent.length == 0) {
                        var content = ej.buildTag("div.e-m-" + local._control + "-content e-m-" + local._control + "-ajax-content#" + proxy.elementId + "-" + local._control + "-item" + index + "-content", (/<\/?body[^>]*>/gmi).test(data) ? data.split(/<\/?body[^>]*>/gmi)[1] : data || "").appendTo(appendTo);
                        proxy._content = this._control == "acc" ? content.children() : content;
                        if ((!ej.isAppNullOrUndefined() && App.angularAppName) || ej.angular.defaultAppName)
                            ej.angular.compile($(content));
                    }
                    ej.widget.init(proxy._content);
                    if (proxy.model.ajaxSuccess)
                        proxy._trigger("ajaxSuccess", successData);
                    if (proxy._ajaxSuccessHandler)
                        proxy._ajaxSuccessHandler(successData);
                },
                "errorHandler": function (xhr, textStatus, errorThrown) {
                    var errorData = { "xhr": xhr, "textStatus": textStatus, "errorThrown": errorThrown, item: item, index: currentItem.index(), text: currentItem.text(), url: proxy.model.ajaxSettings.url ? proxy.model.ajaxSettings.url : urlVal };
                    if (proxy.model.ajaxError)
                        proxy._trigger("ajaxError", errorData);
                },
                "completeHandler": function (data) {
                    if (proxy.model.showAjaxPopup)
                        ej.mobile.WaitingPopup.hide();
                    var CompleteData = { content: proxy._content, item: item, index: currentItem.index(), text: currentItem.text(), url: proxy.model.ajaxSettings.url ? proxy.model.ajaxSettings.url : urlVal };
                    if (proxy.model.ajaxComplete)
                        proxy._trigger("ajaxComplete", CompleteData);
                }
            };
            ej.sendAjaxRequest(ajaxSettings);
        },
        _showHideItems: function (targetItem, appendTo, index) {
            var wrapper = ej.getCurrentPage();
            var isAjax = !(ej.isNullOrUndefined(this._items[index].enableAjax)) ? this._items[index].enableAjax : this.model.enableAjax;
            var contentExists = wrapper.find("#" + targetItem.id + "-content").length;
            if (isAjax && contentExists == 0 && !this.model.prefetchAjaxContent)
                this._loadAjaxContent(targetItem, appendTo, index);
            $(this["_" + this._control + "Items"]).removeClass("e-m-state-active");
            $(targetItem).addClass("e-m-state-active");
            wrapper.find(".e-m-" + this._control + "-content").addClass("e-m-" + this._control + "-state-hide");
            wrapper.find("#" + targetItem.id + "-content").removeClass("e-m-" + this._control + "-state-hide");
            if (!this.model.prefetchAjaxContent && !this.model.enableCache)
                wrapper.find(".e-m-" + this._control + "-ajax-content.e-m-" + this._control + "-state-hide").remove();
            if (this.model.select)
                this._trigger("select", { index: index, item: $(targetItem), text: $(targetItem).text(), isInteraction: this._isInteraction ? true : false });
        },
        ajaxReload: function () {
            var activeItem = this.element.find(".e-m-" + this._control + "-item.e-m-state-active"), activeContent = this.element.find(".e-m-" + this._control + "-content:not(.e-m-" + this._control + "-state-hide)"), activeContentWrapper = activeContent.parent(), index = activeItem[0].id.split("item")[1];
            activeContent.remove();
            this._loadAjaxContent(activeItem, activeContentWrapper, index);
        },
        _makeUrlAbsolute: function (relUrl) {
            var link = $("<a href ='" + relUrl + "'></a>")[0];
            $("body").append(link);
            var pathname;
            if (link.pathname.indexOf('/') != 0)
                pathname = '/' + link.pathname;
            else
                pathname = link.pathname;
            var browser = ej.browserInfo();
            var isIE9 = (browser.name == "msie" && browser.version == "9.0");
            var newLink = (link.protocol + "//" + ((isIE9 && link.port == "80") ? (link.host).replace(":80", "") : link.host) + pathname + link.search + link.hash);
            $(link).remove();
            return newLink;
        }
    }
})(jQuery, Syncfusion);