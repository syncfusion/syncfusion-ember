(function () {
    ejPageAnimation = {
        slideLeft: ["slideLeftOut", "slideRightIn", "slideRightOut", "slideLeftIn"],
        slideRight: ["slideRightOut", "slideLeftIn", "slideLeftOut", "slideRightIn"],
        slideUp: ["slideTopOut", "slideBottomIn", "slideBottomOut", "slideTopIn"],
        slideDown: ["slideBottomOut", "slideTopIn", "slideTopOut", "slideBottomIn"],
        flipIn: ["flipYLeftOut", "flipYRightIn", "flipYRightOut", "flipYLeftIn"],
        flipOut: ["flipYRightOut", "flipYLeftIn", "flipYLeftOut", "flipYRightIn"],
        pop: ["fadeZoomOut", "fadeZoomIn", "fadeZoomOut", "fadeZoomIn"]
    }
    App = {
        window: $(window),
        document: $(document),
        html: $("html"),
        head: $("head"),
        container: $("body"),
        model: {},
        _isBack: false,
        _initialHeap: true,
        currentStateId: null,
        checkStateId: null,
        activeSubPage: null,
        activePage: null,
        renderEJMControlsByDef: true,
        applyMobileStyles:true,
        defaults: {
            enableBrowserHistory: true,
            forceHash: false,
            enableAjax: "auto",
            ajaxOptions: {
                async: true,
                crossDomain: true,
                data: null,
                dataType: "html",
                contentType: "text/plain",
                method: "GET",
            },
            hashValue: null,
            enableCache: false,
            enableAnimation: true,
            animateOptions: {
                transitionType: "slideLeft",
                transitionDuration: "400",
                easing: "ease"

            },
            toPageClass:"",
            isReverseAnimation: false,
            customOption: null,
            viewTransfered: null,
            viewBeforeTransfer: null,
            ajaxSuccess: null,
            ajaxFailure: null,
            refreshed: null,
            onBack: null,
            onHistoryBack: null
        },

        _isUrl: function (url) {
            var regex = /[\.|\/|\#]/g;
            var result = regex.test(url);
            return result;
        },
        _getModel: function (target) {
            return target.data("historyModel");
        },
        _getEventArguments: function (target) {
            var data = {
                heap: target.data("heap") ? target.data("heap") : {},
                historyState: history.state ? {
                    target: history.state.target,
                    templateUrl: history.state.targetUrl,
                    templateContent: history.state.targetContent,
                    userModel: history.state.userModel,
                    uid: history.state.uid
                } : {},
                renderingPage: App._renderingPage
            };
            return data;
        },
        transferPage: function (fromPage, toPage, options) {
            ej.mobile.WaitingPopup.show()
            var fromPage = $("#" + fromPage);
            fromPage.addClass("page-container").data({
                historyModel: $.extend(false, App.defaults, options ? options : {})
            });
            var curModel = App._getModel(fromPage);
            var enableAjax = App._isUrl(toPage);            
            if (fromPage.children().first().attr("data-url")) {
                currentPageUrl = fromPage.children().first().attr("id");
                newpageurl = toPage;
                var pageIds = [];
                for (var i = 0; i < fromPage.data("heap").length; i++)
                    pageIds.push(fromPage.data("heap")[i].href);
                var heapIndex = pageIds.indexOf(newpageurl);
                if (heapIndex > -1) {
                    var duplicateHeap = fromPage.data("heap")[heapIndex];
                    fromPage.data("heap").splice(heapIndex, 1);
                    fromPage.data("heap").push(duplicateHeap);
                    App._loadExistingView(fromPage, toPage, curModel);
                    if (curModel.enableBrowserHistory) {
                        this._trimmedContent = $.trim(fromPage.children().html());
                        if (App._initialHeap) {
                            App._initialTargetId = $("#" + fromPage[0].id);
                            App._initialHeap = false;
                        }
                        if (duplicateHeap.href == toPage && heapIndex == fromPage.data("heap").length - 1) {
                            history.replaceState({
                                target: fromPage[0].id,
                                targetUrl: toPage,
                                targetContent: curModel.enableCache ? this._trimmedContent : "",
                                userModel: options,
                                uid: App.currentStateId
                            }, toPage, curModel.forceHash ? "#" + (curModel.hashValue ? curModel.hashValue : toPage) : App._isUrl(toPage) ? toPage : "#" + toPage);
                        } else {
                            history.pushState({
                                target: fromPage[0].id,
                                targetUrl: toPage,
                                targetContent: curModel.enableCache ? this._trimmedContent : "",
                                userModel: options,
                                uid: App.currentStateId
                            }, toPage, curModel.forceHash ? "#" + (curModel.hashValue ? curModel.hashValue : toPage) : App._isUrl(toPage) ? toPage : "#" + toPage);
                        }
                    }
                } else {
                    App._getContent(fromPage, toPage, curModel, true);
                }

            } else {
                var pageContainer = $("<div class='e-m-hidden' style='z-index:1'></div>");
                pageContainer.attr({
                    "id": "page_" + Math.floor((Math.random() * 1000) + 1) + "_container"
                });
                fromPage.wrapInner(pageContainer);
                App._pushHistory(fromPage, toPage, fromPage.html(), options);
                App._getContent(fromPage, toPage, curModel, true);
            }
            App.currentStateId = history.state ? history.state.uid + 1 : 1;
        },
        _updateContent: function (fromPage, toPage, options, templateContent) {
            var curModel = App._getModel(fromPage);
            var templateId = App._isUrl(toPage) ? "template_" + Math.floor((Math.random() * 1000) + 1) : toPage;
            App._trimmedContent = $.trim(templateContent);
            fromPage.css({
                "overflow": "hidden"
            });
            var templateContainer = $("<div id=" + templateId + "_container class='e-m-hidden' data-url=" + toPage + "></div>");
            templateContainer.html(App._trimmedContent);
            var page = $("<div></div>");
            page.append(templateContainer.clone());
            App._pushHistory(fromPage, toPage, page.html(), options);
            page.remove();
            App._renderingPage = templateContainer;
            fromPage.append(templateContainer);
            App._animatePages(fromPage, curModel.isReverseAnimation);
            if (curModel.enableBrowserHistory) {
                if (App._initialHeap) {
                    App._initialTargetId = $("#" + fromPage[0].id);
                    App._initialHeap = false;
                }
                history.pushState({
                    target: fromPage[0].id,
                    targetUrl: toPage,
                    targetContent: curModel.enableCache ? App._trimmedContent : "",
                    userModel: options,
                    uid: App.currentStateId
                }, toPage, curModel.forceHash ? "#" + (curModel.hashValue ? curModel.hashValue : toPage) : App._isUrl(toPage) ? toPage : "#" + toPage);
            }
            App._currentTarget = fromPage;
        },
        _animatePages: function (target, isReverse) {
            var curModel = App._getModel(target);
            if (typeof curModel.animateOptions.transitionType === "string")
                curModel.animateOptions.transitionType = ejPageAnimation[curModel.animateOptions.transitionType];
            if (typeof curModel.animateOptions.easing === "string")
                curModel.animateOptions.easing = ejAnimation.Easing[curModel.animateOptions.easing];            
            App._page1 = target.children().first().addClass("page");
            App._page2 = target.children().last().addClass("page " + curModel.toPageClass);            
            if (curModel.viewBeforeTransfer)
                App._trigger("viewBeforeTransfer", App._getEventArguments(target), target);
            var proxy = App;
            ej.widget.init(App._page2);
            if (!curModel.enableAnimation) {
                target.children().not(":last").remove();
                App._page2.removeClass("e-m-hidden page").css("z-index", "");
                ej.mobile.WaitingPopup.hide();
                if (curModel.viewTransfered)
                    App._trigger("viewTransfered", App._getEventArguments(target), target);
            } else {
                target.addClass("e-m-intransition");
                App._page1.ejAnimation("stop");
                App._page2.ejAnimation("stop");
                if (isReverse) {
                    proxy._page1.removeClass("e-m-hidden").ejAnimation(curModel.animateOptions.transitionType[2], curModel.animateOptions.transitionDuration, curModel.animateOptions.easing);
                    proxy._page2.removeClass("e-m-hidden").ejAnimation(curModel.animateOptions.transitionType[3], curModel.animateOptions.transitionDuration, curModel.animateOptions.easing).done($.proxy(function (e) {
                        e.siblings().remove();
                        ej.mobile.WaitingPopup.hide();
                        target.removeClass("e-m-intransition");
                        this._page2.css("z-index", "").removeClass("page");
                        if (curModel.viewTransfered)
                            App._trigger("viewTransfered", App._getEventArguments(target), target);
                    }, proxy));
                } else {
                    proxy._page1.removeClass("e-m-hidden").ejAnimation(curModel.animateOptions.transitionType[0], curModel.animateOptions.transitionDuration, curModel.animateOptions.easing);
                    proxy._page2.removeClass("e-m-hidden").ejAnimation(curModel.animateOptions.transitionType[1], curModel.animateOptions.transitionDuration, curModel.animateOptions.easing).done($.proxy(function (e) {
                        e.siblings().remove();
                        ej.mobile.WaitingPopup.hide();
                        target.removeClass("e-m-intransition");
                        this._page2.css("z-index", "").removeClass("page");
                        if (curModel.viewTransfered)
                            App._trigger("viewTransfered", App._getEventArguments(target), target);
                    }, proxy));
                }
            }

            App._isBack = false;
        },
        _pushHistory: function (target, template, templateContent, options) {
            var curModel = App._getModel(target);
            var heap = target.data("heap");
            var heapLength = heap ? heap.length : 0;
            currentPageUrl = curModel.enableAjax ? template : target.children().first().attr("id");
            if (heapLength == 0) {
                target.data("heap", [{
                    target: target,
                    href: target.children().first().attr("id"),
                    content: templateContent,
                    model: options
                }]);
            } else {
                target.data("heap").push({
                    target: target,
                    href: template,
                    content: curModel.enableCache ? templateContent : "",
                    model: options
                });
            }
        },
        _loadExistingView: function (target, template, options) {
            var curModel = App._getModel(target);
            var heap = target.data("heap");
            var heapLength = heap.length;
            heapLastContent = heap[heapLength - 1].content;
            heapLastUrl = heap[heapLength - 1].href;
            heapModel = heap[heapLength - 1].model;
            if (heapLastContent != "") {
                App._renderingPage = $(heapLastContent);
                target.append(App._renderingPage);
                App._animatePages(target, curModel.isReverseAnimation);
            } else
                App._getContent(target, heapLastUrl, heapModel, false);
            if (options.refreshed ? options.refreshed : curModel.refreshed) {
                App._trigger("refreshed", App._getEventArguments(target), target);
            }
        },
        _getContent: function (target, href, userModel, isInitialLoad) {
            var curModel = App._getModel(target);
            if (App._isUrl(href)) {
                proxy = App;
                $.ajax({
                    url: href,
                    dataType: userModel.dataType ? userModel.dataType : curModel.ajaxOptions.dataType,
                    crossDomain: userModel.crossDomain ? userModel.crossDomain : curModel.ajaxOptions.crossDomain,
                    contentType: userModel.contentType ? userModel.contentType : curModel.ajaxOptions.contentType,
                    async: false,
                    data: userModel.data ? userModel.data : curModel.ajaxOptions.data,
                    method: userModel.method ? userModel.method : curModel.ajaxOptions.method,
                    success: function (result) {
                        if (curModel.ajaxSuccess)
                            App._trigger("ajaxSuccess", App._getEventArguments(target), target);
                        var regex = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
                        templateContent = regex.exec(result) ? regex.exec(result)[1] : result;
                        if (!isInitialLoad) {
                            var templateId = proxy._isUrl(href) ? "template_" + Math.floor((Math.random() * 1000) + 1) : href;
                            var templateContainer = $("<div id=" + templateId + "_container class='e-m-hidden' data-url=" + href + "></div>");
                            templateContainer.append($.trim(templateContent));
                            App._renderingPage = templateContainer;
                            target.append(templateContainer);
                            proxy._animatePages(target, App._isBack);
                        } else {
                            proxy._updateContent(target, href, userModel, templateContent);
                        }
                    },
                    error: function (result) {
                        ej.mobile.WaitingPopup.hide();
                        if (curModel.ajaxFailure)
                            App._trigger("ajaxFailure", App._getEventArguments(target), target);
                    }
                });
            } else {
                var templateElement = $("#" + href);
                templateContent = templateElement.html();
                if (!isInitialLoad) {
                    var templateId = App._isUrl(href) ? "template_" + Math.floor((Math.random() * 1000) + 1) : href;
                    var templateContainer = $("<div id=" + templateId + "_container class='e-m-hidden' data-url=" + href + "></div>");
                    templateContainer.append($.trim(templateContent));
                    App._renderingPage = templateContainer;
                    target.append(templateContainer);
                    App._animatePages(target, curModel.isReverseAnimation);
                } else
                    App._updateContent(target, href, userModel, templateContent);
            }
        },

        renderEJMControls: function (element) {
            var target = element ? element : App.activePage;
            if (App.renderEJMControlsByDef) {
                target.find("input[type='button']:not([data-role]):attrNotStartsWith('ejm-'),input[type='submit']:not([data-role]):attrNotStartsWith('ejm-'),input[type='reset']:not([data-role]):attrNotStartsWith('ejm-')").attr("data-role", "ejmbutton");
                target.find("a:not([data-role]):attrNotStartsWith('ejm-')").attr("data-role", "ejmactionlink");
                target.find("input:not([data-role]):not([type]):attrNotStartsWith('ejm-'),input[type='text']:not([data-role]):attrNotStartsWith('ejm-'),input[type='tel']:not([data-role]):attrNotStartsWith('ejm-'),input[type='email']:not([data-role]):attrNotStartsWith('ejm-'),input[type='password']:not([data-role]):attrNotStartsWith('ejm-')").attr("data-role", "ejmtextbox");
                target.find("input[type='checkbox']:not([data-role]):attrNotStartsWith('ejm-')").filter(function () { if (!$(this).closest("[data-role='ejmgroupbutton']").length) return this; }).attr("data-role", "ejmcheckbox");
                target.find("input[type='radio']:not([data-role]):attrNotStartsWith('ejm-')").filter(function () { if (!$(this).closest("[data-role='ejmgroupbutton']").length) return this; }).attr("data-role", "ejmradiobutton");
                target.find("input[type='date']:not([data-role]):attrNotStartsWith('ejm-')").attr("data-role", "ejmdatepicker");
                target.find("input[type='time']:not([data-role]):attrNotStartsWith('ejm-')").attr("data-role", "ejmtimepicker");
            }
        },

        back: function (target) {
            if (typeof target == "undefined" ) {
                var newPageContainer = $("<div class='e-m-hidden'></div>");
                if (history.state) {
                    if (ej.isNullOrUndefined(history.state.target)) return;
                    App._currentTarget = target = $("#" + history.state.target);
                    var curModel = App._getModel(target);
                    App._currentTarget.data({
                        historyModel: $.extend(false, App.defaults, history.state.userModel ? history.state.userModel : {})
                    });                    
                    if (history.state.targetContent == "")
                        App._getContent(target, history.state.targetUrl, curModel, false);
                    else {
                        var templateId = App._isUrl(history.state.targetUrl) ? "template_" + Math.floor((Math.random() * 1000) + 1) + "_container" : history.state.targetUrl;
                        newPageContainer.attr({
                            "id": templateId,
                            "page-url": history.state.targetUrl
                        });
                        newPageContainer.html(history.state.targetContent);
                        App._renderingPage = newPageContainer;
                        target.append(newPageContainer);
                        App._animatePages(App._currentTarget, curModel.isReverseAnimation);
                    }
                    if (App.model.onHistoryBack)
                        App._trigger("onHistoryBack", App._getEventArguments(target), target);
                    App.checkStateId = history.state && history.state.uid;
                } else {
                    var curModel = App._getModel(App._initialTargetId);                    
                    newPageContainer.attr("id", App._initialTargetId.data("heap")[0].href + "_container");
                    newPageContainer.html(App._initialTargetId.data("heap")[0].content);
                    App._renderingPage = newPageContainer;
                    App._initialTargetId.append(newPageContainer);
                    App._animatePages(App._initialTargetId, curModel.isReverseAnimation);
                    if (App.model.onHistoryBack)
                        App._trigger("onHistoryBack", App._getEventArguments(App._initialTargetId), target);
                }
            } else {
                App._isBack = true;
                var heap = $("#" + target).data("heap");
                if (heap && heap.length) {
                    var targetElement = $("#" + target);
                    var lastHeap = heap.pop();
                    if (heap.length) {
                        var elementToBeLoad = heap[heap.length - 1].content;
                        var urlToBeLoad = heap[heap.length - 1].href;
                        var modelToBeLoad = heap[heap.length - 1].model;
                        if (elementToBeLoad != "" || heap.length <= 1) {
                            App._renderingPage = elementToBeLoad;
                            targetElement.append(elementToBeLoad);
                            App._animatePages($("#" + target), App._isBack);
                        } else
                            App._getContent(targetElement, urlToBeLoad, modelToBeLoad, false);
                    }
                    if (App.model.onBack)
                        App._trigger("onBack", App._getEventArguments($("#" + target)), $("#" + target));
                } else
                    return false;
            }
        },
        _trigger: function (eventName, eventProp, target) {
            var curModel = App._getModel(target);
            if (!curModel) return;
            var fn = null,
                returnValue, args, clientProp = {};
            eventProp = $.extend({
                target: target
            }, eventProp);
            $.extend(clientProp, eventProp)

            if (eventName in curModel)
                fn = curModel[eventName];

            if (fn) {
                if (typeof fn === "string") {
                    fn = ej.util.getObject(fn, window);
                }

                if ($.isFunction(fn)) {
                    args = ej.event(eventName, curModel, eventProp);

                    returnValue = fn.call(App, args);

                    // sending changes back - deep copy option should not be enabled for App $.extend 
                    if (eventProp) $.extend(eventProp, args);

                    if (args.cancel || !ej.isNullOrUndefined(returnValue))
                        return returnValue === false || args.cancel;
                }
            }
            var isPropDefined = Boolean(eventProp);
            eventProp = eventProp || {};
            eventProp.originalEventType = eventName;
            eventProp.type = eventName;

            args = $.Event(eventProp.type, ej.event(eventProp.type, curModel, eventProp));
            // sending changes back - deep copy option should not be enabled for App $.extend 
            if (isPropDefined) $.extend(eventProp, args);

            return args.cancel;
        }
    }
})();

$(function () {
    if (App.applyMobileStyles && $("body").find("[data-role*='ejm']").length > 0)
        $("body").addClass("e-m-user-select e-m-viewport e-m-" + ej.getRenderMode());
    App._currentPage = App.activeSubPage = App.activePage = $("body");
    App.window.on("popstate", function (args) {
        App._isBack = true;
        if (App.checkStateId && args.originalEvent.state) {
            if (args.originalEvent.state.uid >= App.checkStateId)
                App._isBack = false;
        }
        App.back();
    });
});