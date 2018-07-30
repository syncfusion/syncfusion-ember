(function ($, ej, undefined) {

    ej.widget("ejPager", "ej.Pager", {
        _rootCSS: "e-pager",
        validTags: ["div"],
        // default model
        defaults: {
            pageSize: 12,
            pageSizeList: null,
            pageCount: 10,
            currentPage: 1,
            enableExternalMessage: false,
            externalMessage: "",
            pageSizeMessage: "",
            enableQueryString: false,
            locale: "en-US",
            masterObject: null,
            pageSizeSelected: null,
            enableRTL: false,
            totalRecordsCount: null,
            totalPages: null,
            customText: "",
            showPageInfo: true,
            cssClass: "",
            enabled: true,
            showGoToPage: false,
            isResponsive: false,
            change: null,
            click: null,
			template: "",
        },

        // constructor function
        _init: function () {
            this._initPrivateProperties();
            this.model.enableQueryString && this._queryStringValue();
            this.renderPager();
            if (this.model.isResponsive) this._reSizeHandler();
            this._wireResizing();
            this._wireEvents();
            this.refreshPager();
        },
        _initPrivateProperties: function () {
            if (typeof (this.model.pageSizeList) == "string")
                this.model.pageSizeList = JSON.parse(this.model.pageSizeList);
            this._pageSize = this.model.pageSize;
            this._links = [];
            this._$prev = null;
            this._$first = null;
            this._$PP = null;
            this._$NP = null;
            this._lastNP = false;
            this._lastpageCount = null;
            this._$last = null;
            this._$next = null;
            this._prevPageNo = 1;
            this.localizedLabels = this._getLocalizedLabels();
            this._intervalWid = 0;
            this._msgWidth = 0;
            this._gotoWid = 0;
        },
        _wireEvents: function () {
            var proxy = this;
            this._on(this.element, "click", this._pagerClickHandler);
            $(document).on("click", $.proxy(proxy._hidedrop, proxy));
			if(this._pagerContainer){
			this._touchPrev = false;
			this._pagerContainer.on("touchstart",this._touchHandler);
			this._pagerContainer.on("mouseover",this._mouseOverHandler);
			this._pagerContainer.on("mouseout",this._mouseOutHandler);
			}
			
        },
		_touchHandler: function(e){
			this._touchPrev = true;
		},
		 _mouseOverHandler: function (e) {
				if(this._touchPrev == false){
					var $target = $(e.target);
					if (($target.hasClass("e-icon") || $target.hasClass("e-link")) && !$target.hasClass("e-hover")) {
						$target.addClass("e-hover")
					}
				}
				this._touchPrev = false;
		},
		_mouseOutHandler: function (e) {
            var $target = $(e.target);
			if (($target.hasClass("e-icon") || $target.hasClass("e-link")) && $target.hasClass("e-hover")) {
				$target.removeClass("e-hover")
			}
		},
        _hidedrop: function () {
            if (this.$dropItem && this.$dropItem.css("display") != "none") this.$dropItem.hide();
        },
        _wireResizing: function () {
            this._refreshDropandTextItems();
            $(window).bind('resize', (this.model.isResponsive) ? $.proxy(this._reSizeHandler, this) : $.proxy(this._unWireResizing, this));
        },
        _unWireResizing: function () {
            this._refreshDropandTextItems();
            if (this.$dropItem) if (this.$dropItem.css("display") != "none") this.$dropItem.hide();
            $(window).unbind('resize', $.proxy(this._reSizeHandler, this));
        },
        _reSizeHandler: function () {
            if (this.$dropItem) if (this.$dropItem.css("display") != "none") this.$dropItem.hide();
            controlwidth = this._intervalWid + this._gotoWid + this.element.find('.e-pagercontainer').outerWidth() + this._msgWidth;
            if (controlwidth > (this.element.outerWidth() - 20)) { if (this._msgWidth > 0) this.element.find(".e-parentmsgbar").addClass("e-msg-res"); }
            else if (this._msgWidth > 0) this.element.find(".e-parentmsgbar").removeClass("e-msg-res");
            if (this.element.outerWidth() - $(this.element.find(".e-pagercontainer")).outerWidth() < 40) {
                this._flag = true;
                this._fillScreen();
            }
            if (this.element.outerWidth() - $(this.element.find(".e-pagercontainer")).outerWidth() > 40) {
				if(!$(this._templateElement).find(".e-textbox-paging").length > 0)
				if(!this._maxPageCount) this._maxPageCount = this.model.pageCount;
                this.option("pageCount", this._maxPageCount);
                if (this.element.outerWidth() - $(this.element.find(".e-pagercontainer")).outerWidth() < 40) {
                    this._flag = true;
                    this._fillScreen();
                }
            }
            this._refreshDropandTextItems();
        },
        _refreshDropandTextItems: function () {
            if (this.numTextbox && !this.model.template) {
                if (this.element.find('.e-pagercontainer').position().top != this.element.find(".e-parentmsgbar").position().top) {
                    this.numTextbox.addClass("e-pager-goto-res");
                }
                else this.numTextbox.removeClass("e-pager-goto-res");
            }
            if (this.pageInterval_wrap && !this.model.template) {
                if (this.element.find('.e-pagercontainer').position().top != this.element.find(".e-pager-itemsinterval").position().top) {
                    this.element.find(".e-pager-itemsinterval").addClass("e-pager-goto-res");
                }
                else this.element.find(".e-pager-itemsinterval").removeClass("e-pager-goto-res");
            }


        },
        renderPager: function () {
			var  tempElement;
			if(!this.model.template){
            var $pagerContainer = ej.buildTag('div.e-pagercontainer', "", {});
			this._pagerContainer = $pagerContainer;
            this._renderPagerContainer($pagerContainer);
            this.element[0].appendChild($pagerContainer[0]);
			}
			else{
			this._templateElement = ej.buildTag('div.e-template',"",{});
			if (this.model.template.startsWith(".") || this.model.template.startsWith("#"))
			tempElement = $($(this.model.template).html());
			else tempElement = $(this.model.template);
			tempElement.appendTo(this._templateElement);
			if($(this._templateElement).find(".e-default-paging").length > 0){
				var $pagerContainer = ej.buildTag('div.e-pagercontainer', "", {});
				this._renderPagerContainer($pagerContainer);
				$pagerContainer.appendTo($(this._templateElement).find(".e-default-paging"));
			}
			if($(this._templateElement).find(".e-textbox-paging").length > 0){
		 	    proxy = this;
				var accessTemplatePagerContainer = $(this._templateElement).find(".e-textbox-paging");
				accessTemplatePagerContainer.addClass("e-pagercontainer");
				var accesFirstPage = ej.buildTag('div.e-firstpage e-icon e-mediaback  e-firstpagedisabled e-disable', "", {}, { title: proxy.localizedLabels.firstPageTooltip });
				var accesPrevPage = ej.buildTag('div.e-prevpage e-icon e-arrowheadleft-2x  e-prevpagedisabled e-disable', "", {}, {  title: proxy.localizedLabels.previousPageTooltip });
				var numInput = ej.buildTag("input.e-gototextbox", {}, { "type": "textbox" });
				var accesNextPage = ej.buildTag('div.e-nextpage e-icon e-arrowheadright-2x  e-default', "", {}, { title: proxy.localizedLabels.nextPageTooltip });
				var accesLastPage = ej.buildTag('div.e-lastpage e-icon e-mediaforward  e-default', "", {}, { title: proxy.localizedLabels.lastPageTooltip });
				var accesNewRecord = ej.buildTag('div.e-newrecord e-icon e-plus e-default', "", {}, { title: "Add New Record" });
				accessTemplatePagerContainer.append(accesFirstPage);
				accessTemplatePagerContainer.append(accesPrevPage);
				accessTemplatePagerContainer.append(numInput);
				accessTemplatePagerContainer.append(accesNextPage);
				accessTemplatePagerContainer.append(accesLastPage);
				accessTemplatePagerContainer.append(accesNewRecord);
				numInput.focus(function(){
					numInput.val(proxy.model.currentPage);
				});
			}
			var element = this.element;
			$(this._templateElement).addClass("e-template");
			this._pagerContainer = $pagerContainer = $(this._templateElement).find(".e-pagercontainer") ? $(this._templateElement).find(".e-pagercontainer") : $(this._templateElement);
				element.append($(this._templateElement));
				if($(this._templateElement).find(".e-prevpage").length > 0) this._$prev = $(this._templateElement).find(".e-prevpage");
				if($(this._templateElement).find(".e-nextpage").length > 0) this._$next = $(this._templateElement).find(".e-nextpage");
				if($(this._templateElement).find(".e-firstpage").length > 0) this._$first = $(this._templateElement).find(".e-firstpage");
				if($(this._templateElement).find(".e-lastpage").length > 0) this._$last = $(this._templateElement).find(".e-lastpage");
				if($(this._templateElement).find(".e-gototextbox").length > 0) {
				this.numTextbox = $(this._templateElement).find(".e-gototextbox").addClass("e-pager-goto-res e-textbox").attr("type","textbox");
				if(!$(this._templateElement).find(".e-textbox-paging").length > 0)this.numTextbox.width(35);
				this._on($(this.numTextbox), 'keydown', this._mouseScroll);
				this._on(this.numTextbox, 'focusout', this._onTextboxBlur);
				}
				if(this._$prev &&(this._$prev).hasClass("e-prevpagedisabled")) this._$prev.removeClass("e-prevpage");
				if(this._$last &&(this._$last).hasClass("e-lastpagedisabled")) this._$prev.removeClass("e-lastpage");
				if(this._$first && (this._$first).hasClass("e-firstpagedisabled")) this._$prev.removeClass("e-firstpage");
				if(this._$next &&(this._$next).hasClass("e-nextpagedisabled")) this._$prev.removeClass("e-nextpage");
				if($(this._templateElement).find(".e-drpdwndiv").length > 0 && this.model.pageSizeList) this._renderDropdownlist();
				this._templatePageCount = $(this._templateElement).find(".e-pagenumbers").length;
				if( this._templatePageCount > 1){
					proxy =this;
					if($(this._templateElement).find(".e-previouspager").length > 0){
						this._$PP = $(this._templateElement).find(".e-previouspager").addClass("e-nextprevitemdisabled e-disable e-spacing e-PP");
					} 
					if($(this._templateElement).find(".e-nextpager").length > 0){
						this._$NP = $(this._templateElement).find(".e-nextpager").addClass("e-NP e-spacing e-nextprevitemdisabled e-disable");
					} 
					$(this._templateElement).find(".e-pagenumbers").each(function(index){
						$(this).attr("role","link").addClass("e-numericitem e-spacing e-default").data("index",index);
					});
					proxy._links = $(this._templateElement).find(".e-numericitem[role=link]");
			    }
			}
			if (!this.model.enabled) this._disable();
			if (this.model.pageSizeList && this.model.pageSizeList.length > 0) this._renderDropdownlist();
			this._pageInfo();
			this.model.enableExternalMessage && this._renderPagerMessage();
			if (this.model.showGoToPage) this._renderTextboxItem();
			if (this.model.enableRTL) this.element.addClass("e-rtl");
            this._cssClass = this.model.cssClass; this.element.addClass(this.model.cssClass);
        },
		_onTextboxBlur: function (e) {
				proxy = this;
                e.currentTarget.value = parseInt(e.currentTarget.value);
                var regEx = /^[0-9]*$/;
                var flag = regEx.test(parseInt(e.currentTarget.value));
                if (!flag) {
                    proxy.numTextbox.val(proxy.model.currentPage)
                    return false;
                }
                if (proxy.model.currentPage != parseInt(e.currentTarget.value)) {
                    if (parseInt(e.currentTarget.value) >= 1 && parseInt(e.currentTarget.value) <= proxy.model.totalPages) {
                        proxy.model.currentPage = parseInt(e.currentTarget.value);
                        proxy.refreshPager();
                        if (proxy._prevPageNo != proxy.model.currentPage)
                            proxy._trigger("change", { "currentPage": proxy.model.currentPage, "isInteraction": true, "event": e });
                    }
                    else proxy.numTextbox.val(this.model.currentPage);
                }
				if($(this._templateElement).find(".e-textbox-paging").length > 0){
				this.numTextbox.val(this.model.currentPage+ " of " +this.model.totalPages);
				}
            },
        _removeDropdownlist: function () {
            this.pageInterval_wrap.remove();
            this.pageInterval_wrap = null;
            this.$textspan = null;
            this.$dropItem = null;
        },
        _renderDropdownlist: function () {
            var proxy = this;
            this.pageInterval_wrap = ej.buildTag('div.e-pager-itemsinterval', "", {});
			if(this.model.template && $(this._templateElement).find(".e-drpdwndiv").length > 0){
				var pageDrop_wrap = $(this._templateElement).find(".e-drpdwndiv").addClass("e-icon e-arrow-sans-down");
			}
			else var pageDrop_wrap = ej.buildTag('div.e-drpdwndiv e-icon e-arrow-sans-down', "", {});
            if (proxy.model.totalRecordsCount == null || proxy.model.totalRecordsCount == 0) {
                pageDrop_wrap.addClass("e-disable");
            }
            this.$textspan = ej.buildTag('span.e-text');
            this.sizeIntervals = this.model.pageSizeList;
			if(proxy.model.template) var prevElement = ($(proxy._templateElement).find(".e-drpdwndiv").prev().length > 0) ? $(proxy._templateElement).find(".e-drpdwndiv").prev(): $(proxy._templateElement);
            pageDrop_wrap.appendTo(this.pageInterval_wrap);
			if(proxy.model.template) prevElement.after(this.pageInterval_wrap);
            else this.pageInterval_wrap.appendTo(this.element);
            this.pageInterval_wrap.insertBefore(this._parentMsgBar);
            this.$textspan.appendTo(pageDrop_wrap);
            proxy.$textspan.text(this.model.pageSize || this.model.pageSizeList[0]);
            this.$dropItem = ej.buildTag('ul.e-drpdwn e-ul');
            this._renderItems();
            this.$dropItem.appendTo(pageDrop_wrap);
            this._renderPageSizeMessage();
            pageDrop_wrap.on("click", function () {
                if (proxy.$dropItem.css("display") != "none") proxy.$dropItem.hide();
                else if (proxy.model.enabled && !pageDrop_wrap.hasClass("e-disable")) {
					proxy.$dropItem.show();
					proxy._setListPosition();
				}
            });
            this.$dropItem.hide();
            this._intervalWid = this.element.find('.e-pager-itemsinterval').outerWidth();
        },
		_getOffset: function (ele) {
			return ej.util.getOffset(ele);
		},

        _getZindexPartial: function () {
            return ej.util.getZindexPartial(this.pageInterval_wrap, this.$dropItem);
        },

		_setListPosition: function () {
            var elementObj = this.pageInterval_wrap, pos = this._getOffset(elementObj),
            winBottomHeight = $(document).scrollTop() + $(window).height() - (pos.top + $(elementObj).outerHeight()),
            winTopHeight = pos.top - $(document).scrollTop(),
            popupHeight = this.$dropItem.outerHeight(),
            popupWidth = this.$dropItem.outerWidth(),
            totalHeight = elementObj.outerHeight(),
            border = (totalHeight - elementObj.height()),
            maxZ = this._getZindexPartial(), popupmargin = 3,
            topPos = ((popupHeight < winBottomHeight || popupHeight > winTopHeight) ? this.$dropItem.position().top : -(popupHeight+border+popupmargin));
            this.$dropItem.css({
                "top": (topPos) + "px",
                "z-index": maxZ
            });
        },
        _renderPageSizeMessage: function () {
            if (!this.pageInterval_wrap.children().hasClass("e-interval-msg")) {
                this._msgwrapper = ej.buildTag('div.e-interval-msg');
            }

            this._msgwrapper.appendTo(this.pageInterval_wrap);
            if (this.model.pageSizeMessage.toString().length) {
                this._msgwrapper.html(this.model.pageSizeMessage);
                if (this._msgwrapper.css('display') == 'none') this._msgwrapper.show();
            }
            else {
                this._msgwrapper.remove();
            }
        },
        _renderItems: function () {
            var proxy = this;
            $(this.model.pageSizeList).each(function () {
                li = ej.buildTag('li');
                li.text(this);
                proxy.$dropItem.append(li);
                if (proxy.model.pageSize == this) {
                    li.addClass("e-active");
                }
            });
            this.$dropItem.find("li").on("click", function (e) {
                proxy.$dropItem.find("li.e-active").removeClass("e-active");
                $(this).addClass("e-active")
                proxy._pageSize = parseInt($(this).text());
                proxy.$textspan.text($(this).text());
                proxy.refreshPager();
                proxy._trigger("pageSizeSelected", { pageSize: proxy._pageSize });
                if (proxy._prevPageNo != proxy.model.currentPage)
                    proxy._trigger("change", { "currentPage": proxy.model.currentPage, "isInteraction": true, "event": e });
            });
        },
        _queryStringValue: function () {
            var results = new RegExp('[\\?&]page=([^&#]*)').exec(window.location.href);
            !results ? this.model.currentPage = 1 : this.model.currentPage = parseInt(results[1] || 1);
        },
        _renderPagerMessage: function () {
            if (this.element.find('e-pagermessage').length<=1) {
                this._messageDiv = ej.buildTag('div.e-pagermessage');
            }
            if (this.model.externalMessage.toString().length) {
                this._messageDiv.html(this.model.externalMessage);
                if (this._messageDiv.css('display') == 'none') this._messageDiv.show();
            }
            else
                this._messageDiv.hide();
            this.element.append(this._messageDiv);
        },
        _removePagerMessage: function () {
            this.element.find("div.e-pagermessage").remove();
        },
        _mouseScroll: function (event) {
		if(this.model.enabled){
            var delta;
            if (event.keyCode == "38")
                this._updateField("increment");
            else if (event.keyCode == "40")
                this._updateField("decrement");
			else if(event.keyCode == "13"){
				this._onTextboxBlur(event);
			}
				}
			
        },
        _updateField: function (operation) {
            var preval = this.model.currentPage;
            var step = 1;
            if (this.numTextbox.val() == "") this.numTextbox.val(1);
            else if (this.numTextbox.val().indexOf(" ") >= 1)
                this.numTextbox.val(this.numTextbox.val().replace(" ", ""));
            this.model.currentPage = ej.parseInt(this.numTextbox.val(), this.model.locale);
            if (isNaN(this.model.currentPage) && !this.model.currentPage) this.model.currentPage = 1;
            if (this.model.currentPage >= 1 && this.model.currentPage > this.model.totalPages) {
                this.model.currentPage = this.model.totalPages;
                this.numTextbox.val(this.model.currentPage);
            }
            else if (this.model.currentPage < 1 && this.model.currentPage <= this.model.totalPages) {
                this.model.currentPage = 1;
                this.numTextbox.val(this.model.currentPage);
            }
            else if (this.model.currentPage >= 1 && this.model.currentPage <= this.model.totalPages) {
                value = operation == "increment" ? this.model.currentPage + step : this.model.currentPage - step;
                if (value >= 1 && value <= this.model.totalPages) {
                    this.numTextbox.val(value);
                    this.model.currentPage = value;
                }
            }
            this.refreshPager();
            if (preval != this.model.currentPage) {
                this._trigger("change", { "currentPage": this.model.currentPage, "isInteraction": true, "event": event });
            }
        },
        _renderTextboxItem: function () {
            proxy = this;
            var numInput = ej.buildTag("input#" + this.element[0].id + "_numtext", "", {}, { "type": "textbox" });
            $(numInput).appendTo(this._parentMsgBar).insertBefore($(this._parentMsgBar).find("span"));
            this.numTextbox = numInput;
            this.numTextbox.height(this.element.find('.e-pagercontainer .e-numericcontainer a').outerHeight());
            this.numTextbox.width(35);
            this.numTextbox.addClass('e-gototextbox e-textbox');
            if (!this.model.showGoToPage) this.numTextbox.hide();
            this._gotoWid = $(this.numTextbox).outerWidth();
            this._on($(this.numTextbox), 'keydown', this._mouseScroll);
            this._on(this.numTextbox, 'focusout', this._onTextboxBlur);
        },
        _renderPagerContainer: function ($pagerContainer) {
            //Update pager styles here for next versions
            this._renderBackwardButton($pagerContainer);
            this._renderpreviousPager($pagerContainer);
            this._renderNumericItem($pagerContainer);
            this._renderForwardPager($pagerContainer);
            this._renderForwardButton($pagerContainer);
        },
        _renderMsgBar: function () {
            var $msgBar = ej.buildTag('span.e-pagermsg', String.format(this.localizedLabels.pagerInfo, this.model.currentPage, this.model.totalPages || 0, this.model.totalRecordsCount || 0));
            this._parentMsgBar.appendChild($msgBar[0]);
            this._parentMsgBar.style.textAlign = ej.TextAlign.Right;
        },
        _renderpreviousPager: function ($pagerContainer) {
            this._$PP = ej.buildTag('a.e-link e-nextprevitemdisabled e-disable e-spacing e-PP', "...", {}, { title: this.localizedLabels.previousPagerTooltip});
            $pagerContainer.append(this._$PP);
        },
        _renderForwardPager: function ($pagerContainer) {
            this._$NP = ej.buildTag('a.e-link e-NP e-numericitem e-spacing e-default', "...", {}, { title: this.localizedLabels.nextPagerTooltip });
            $pagerContainer.append(this._$NP);
        },
        _renderBackwardButton: function ($pagerContainer) {
            this._$first = ej.buildTag('div.e-firstpage e-icon e-mediaback  e-firstpagedisabled e-disable', "", {}, { title: this.localizedLabels.firstPageTooltip });
            this._$prev = ej.buildTag('div.e-prevpage e-icon e-arrowheadleft-2x  e-prevpagedisabled e-disable', "", {}, {  title: this.localizedLabels.previousPageTooltip });
            $pagerContainer.append(this._$first);
            $pagerContainer.append(this._$prev);
        },
        _renderNumericItem: function ($pagerContainer) {
            var $numericContainer = ej.buildTag('div.e-numericcontainer e-default', "", {});
            this._renderNumericLinks($numericContainer, this.model.pageCount);
            $pagerContainer.append($numericContainer);
            this._maxPageCount = this.model.pageCount;
        },
        _renderNumericLinks: function ($numericContainer) {
            $numericContainer.empty();
            this.model.pageCount = Math.round(this.model.pageCount);
            this.model.customText != "" ? $numericContainer.addClass("e-customtext") : $numericContainer.removeClass("e-customtext");
            for (var page = 1; page <= this.model.pageCount; page++) {
                var $link = ej.buildTag('a.e-link', this.model.customText + page, {}, { role: "link" }).addClass("e-numericitem e-spacing e-default").data("index", page);
                if (page == this.model.currentPage)
                    $link.removeClass("e-default").addClass("e-currentitem e-active");
                $numericContainer.append($link);
            }
            this._links = $numericContainer.children();
        },
        _renderForwardButton: function ($pagerContainer) {
            this._$next = ej.buildTag('div.e-nextpage e-icon e-arrowheadright-2x  e-default', "", {}, { title: this.localizedLabels.nextPageTooltip });
            this._$last = ej.buildTag('div.e-lastpage e-icon e-mediaforward  e-default', "", {}, { title: this.localizedLabels.lastPageTooltip });
            $pagerContainer.append(this._$next);
            $pagerContainer.append(this._$last);

        },
        _setLocale: function () {
            this.localizedLabels = this._getLocalizedLabels();
            this._$first.attr("title", this.localizedLabels.firstPageTooltip);
            this._$prev.attr("title", this.localizedLabels.previousPageTooltip);
            this._$next.attr("title", this.localizedLabels.nextPageTooltip);
            this._$last.attr("title", this.localizedLabels.lastPageTooltip);
            this._$NP.attr("title", this.localizedLabels.nextPagerTooltip);
            this._$NP.attr("title", this.localizedLabels.previousPagerTooltip);
        },
        _applyCss: function () {
            if (this.model.totalRecordsCount == null) {
                if(this._$prev)this._$prev.addClass("e-prevpagedisabled e-disable").removeClass("e-prevpage").removeClass("e-default");
                if(this._$first)this._$first.addClass("e-firstpagedisabled e-disable").removeClass("e-firstpage").removeClass("e-default");
                if(this._$last)this._$last.addClass("e-lastpagedisabled e-disable").removeClass("e-lastpage").removeClass("e-default");
                if(this._$next)this._$next.addClass("e-nextpagedisabled e-disable").removeClass("e-nextpage").removeClass("e-default");
                if(this._$NP)this._$NP.addClass("e-nextprevitemdisabled e-disable").removeClass("e-numericitem").removeClass("e-default");
                if (this.model.pageSizeList) {
                    $(".e-drpdwndiv").addClass("e-disable");
                }
                return;
            }
            else {
                if (this.model.totalRecordsCount == 0 && this.model.pageSizeList) {
                    $(".e-drpdwndiv").addClass("e-disable");
                }
                else if (this.model.totalRecordsCount != 0 && this.model.pageSizeList && $(".e-drpdwndiv").hasClass("e-disable")) {
                    $(".e-drpdwndiv").removeClass("e-disable");
                }
                if (this.model.currentPage > 1 && this._$prev && this._$first) {
                    this._$prev.removeClass("e-prevpagedisabled").removeClass("e-disable").addClass("e-prevpage e-default");
                    this._$first.removeClass("e-firstpagedisabled").removeClass("e-disable").addClass("e-firstpage e-default");
                } else {
                    if(this._$prev)this._$prev.addClass("e-prevpagedisabled e-disable").removeClass("e-prevpage").removeClass("e-default");
                    if(this._$first)this._$first.addClass("e-firstpagedisabled e-disable").removeClass("e-firstpage").removeClass("e-default");
                }
				if(this._$PP){
                (this.model.currentPage > this.model.pageCount) ?(this._$PP.removeClass("e-nextprevitemdisabled").removeClass("e-disable").addClass("e-numericitem e-default")) : (this._$PP.addClass("e-nextprevitemdisabled e-disable").removeClass("e-numericitem").removeClass("e-default"));}

                if (this._links.length && parseInt(this._links[0].innerHTML.replace(this.model.customText, ""), 10) + this.model.pageCount > this.model.totalPages)
                    this._lastNP = true;
                else
                    this._lastNP = false;

                if (this._lastNP == false)
                    if(this._$NP)this._$NP.removeClass("e-nextprevitemdisabled").removeClass("e-disable").addClass("e-numericitem e-default");
                else
                    if(this._$NP)this._$NP.addClass("e-nextprevitemdisabled e-disable").removeClass("e-numericitem").removeClass("e-default");

                this._lastpageCount = this.model.totalPages % this.model.pageCount;
                if (this._lastpageCount == 0)
                    this._lastpageCount = this.model.pageCount;
                if (this.model.currentPage > (this.model.totalPages - this._LastpageCount)) {
                    if(this._$PP)this._$PP.removeClass("e-nextprevitemdisabled").removeClass("e-disable").addClass("e-numericitem e-default");
                    if(this._$NP)this._$NP.addClass("e-nextprevitemdisabled e-disable").removeClass("e-numericitem").removeClass("e-default");
                }
                if (this.model.currentPage == this.model.totalPages || this.model.totalRecordsCount == 0) {
                    if(this._$last)this._$last.addClass("e-lastpagedisabled e-disable").removeClass("e-lastpage").removeClass("e-default");
                    if(this._$next)this._$next.addClass("e-nextpagedisabled e-disable").removeClass("e-nextpage").removeClass("e-default");
                    if(this._$NP)this._$NP.addClass("e-nextprevitemdisabled e-disable").removeClass("e-numericitem").removeClass("e-default");
                } else {
                    if(this._$last)this._$last.addClass("e-lastpage e-default").removeClass("e-lastpagedisabled").removeClass("e-disable");
                    if(this._$next)this._$next.addClass("e-nextpage e-default").removeClass("e-nextpagedisabled").removeClass("e-disable");
                }
                if (this._links.length) {
                    this._links.removeClass("e-currentitem").removeClass("e-active").addClass("e-default");
                    $(this._links[(this.model.currentPage - 1) % this.model.pageCount]).removeClass("e-default").addClass("e-currentitem e-active");
                    $(this._links[(this._prevPageNo - 1) % this.model.pageCount]).removeClass("e-default").addClass("e-numericitem");
                }
                if (this._pageSize >= (this.model.totalRecordsCount / this.model.pageCount) && this._$PP != null && this._$PP.length != 0) {
                    this._$PP.addClass("e-nextprevitemdisabled e-disable").removeClass("e-numericitem").removeClass("e-default");
                    this._$NP.addClass("e-nextprevitemdisabled e-disable").removeClass("e-numericitem").removeClass("e-default");
                }
            }
        },
        _SetTotalPages: function () {
            this.model.totalPages = (this.model.totalRecordsCount % this._pageSize == 0) ? (this.model.totalRecordsCount / this._pageSize) : (parseInt(this.model.totalRecordsCount / this._pageSize, 10) + 1);
        },
        _refreshNumericItem: function () {
            if (this._links.length != 0 && this._links != null) {
                this.model.currentPage = this.model.totalPages == 1 ? 1 : this.model.currentPage;
                if (this.model.currentPage > this.model.totalPages && this.model.totalPages != 0)
                    this.model.currentPage = this.model.totalPages;
                var _pagerTarget = parseInt(this.model.currentPage / this.model.pageCount, 10);
                if (this.model.currentPage % this.model.pageCount == 0)
                    if (_pagerTarget > 0)
                        _pagerTarget = _pagerTarget - 1;
                this._links.css("display", "none");
                for (var i = 0; i < this.model.pageCount; i++) {
                    var start = (_pagerTarget * this.model.pageCount) + 1 + i;
                    if (start <= this.model.totalPages) {
                        this._links[i].style.display = '';
                        $(this._links[i]).data('index', start);
                        $(this._links[i]).html(this.model.customText + start);
                    }
                }
            }
        },
        _refreshPagerInfo: function () {
            if (this.model.totalRecordsCount == 0)
                this.model.currentPage = 0;
            this.element.find(".e-pagermsg").text(String.format(this.localizedLabels.pagerInfo, this.model.currentPage, this.model.totalPages || 0, this.model.totalRecordsCount || 0));
        },
        _refreshExternalMessage: function () {
            if (this.model.externalMessage.toString().length)
                this.element.find(".e-pagermessage").empty().html(this.model.externalMessage).show();
            else
                this.element.find(".e-pagermessage").hide();
        },
        refreshPager: function () {
			if(this._templateElement) this._links = $(this._templateElement).find(".e-numericitem[role=link]");
            this._SetTotalPages();
            this._refreshNumericItem();
            this._refreshPagerInfo();
            this._applyCss();
            this.model.enableExternalMessage && this._refreshExternalMessage();
            if (this.model.enableRTL)
                this.element.addClass("e-rtl");
            else
                this.element.removeClass("e-rtl");
            if (this.numTextbox) {
			if($(this._templateElement).find(".e-textbox-paging").length > 0){
				if(this.model.currentPage > this.model.totalPages && this.model.totalPages != 0){
					this.model.currentPage = this.model.totalPages;
				}
				 if (!this.numTextbox.is(':focus')) this.numTextbox.val(String.format("{0} of {1}", this.model.currentPage, this.model.totalPages));
			}
			else this.numTextbox.val(this.model.currentPage);
			}
        },

        _kDownHandler: function (e) {
            var code;
            if (e.keyCode) code = e.keyCode; // ie and mozilla/gecko
            else if (e.which) code = e.which; // ns4 and opera
            else code = e.charCode;
            e.target = null;
            if (this.model.masterObject.checkKey("firstPage", code, e))
                e.target = this._$first;
            else if (this.model.masterObject.checkKey("previousPager", code, e))
                e.target = this._$PP;
            else if (this.model.masterObject.checkKey("previousPage", code, e))
                e.target = this._$prev;
            else if (this.model.masterObject.checkKey("lastPage", code, e))
                e.target = this._$last;
            else if (this.model.masterObject.checkKey("nextPager", code, e))
                e.target = this._$NP;
            else if (this.model.masterObject.checkKey("nextPage", code, e))
                e.target = this._$next;
            else
                return false;
            this._pagerClickHandler(e);
        },
        _pageInfo: function ($pagerContainer) {
            if ((this.model.showPageInfo || this.model.showGoToPage) && !this._parentMsgBar) {
                this._parentMsgBar = document.createElement("div");
                this._parentMsgBar.className += "e-parentmsgbar";
                if (this.model.showPageInfo)
                    this._renderMsgBar();
                this.element[0].appendChild(this._parentMsgBar);
                this.element[0].className += this.model.enableRTL ? " e-pager e-rtl" : " e-pager";
            } else if (!this.model.showPageInfo && !this.model.showGoToPage) {
                this._parentMsgBar && this._parentMsgBar.remove();
                this._parentMsgBar = null;
            }
            else $(this._parentMsgBar).find(".e-pagermsg").remove();
            this._msgWidth = $(this._parentMsgBar).outerWidth()
        },
        _doClickAnimation: function (event) {
            var element = $(event.target);
            if (element == undefined || event.type == undefined) return;
            element.addClass("e-animate");
        },
        _pagerClickHandler: function (e) {
            if (!this.model.enabled) return false;
            this._prevPageNo = this.model.currentPage;
            var $target = $(e.target);
            this.element.find(".e-animate").removeClass("e-animate");
            this._doClickAnimation(e);
            if ($.inArray(e.target, this._links) != -1) {
                this.model.currentPage = parseInt($(e.target).data("index"), 10);
            }
            else if ($target.hasClass("e-nextpage") && $target.hasClass("e-nextpagedisabled") != true) {
                if (this.model.currentPage % this.model.pageCount == 0) {
                    this.model.currentPage++;
                    if (this._links != undefined && this._links.length != 0)
                        this.model.currentPage = parseInt($(this._links[0]).data("index"), 10) + this.model.pageCount;
                    if (this.model.currentPage + this.model.pageCount >= this.model.totalPages)
                        this._lastNP = true;
                }
                else
                    this.model.currentPage++;
            }
            else if ($target.hasClass("e-prevpage") && $target.hasClass("e-prevpagedisabled") != true) {
                if (this.model.currentPage % this.model.pageCount == 1)
                    this._lastNP = false;
                this.model.currentPage--;
                if (this.model.currentPage < 0) { this.model.currentPage = 0; }
            }
            else if ($target.hasClass("e-lastpage") && $target.hasClass("e-lastpagedisabled") != true) {
                this._LastpageCount = this.model.totalPages % this.model.pageCount;
                (this._LastpageCount == 0) ? (this._LastpageCount = this.model.pageCount) : null;
                this.model.currentPage = this.model.totalPages;
                this._lastNP = true;
            }
            else if ($target.hasClass("e-firstpage") && $target.hasClass("e-firstpagedisabled") != true) {
                this.model.currentPage = 1;
                this._lastNP = false;
            }
            else if ($target.hasClass("e-NP") && $target.hasClass("e-nextprevitemdisabled") != true) {
                if (this._links != undefined)
                    this.model.currentPage = parseInt($(this._links[0]).data("index"), 10) + this.model.pageCount;
                if (parseInt(this._links[this.model.pageCount - 1].innerHTML.replace(this.model.customText, ""), 10) + this.model.pageCount >= this.model.totalPages) {
                    this._lastNP = true;
                    if ((this.model.totalRecordsCount - this._pageSize) < this._pageSize)
                        this._LastpageCount = this.model.totalRecordsCount - this._pageSize;
                    else
                        this._LastpageCount = ((this.model.totalRecordsCount / this._pageSize) % this.model.pageCount);
                    (this._LastpageCount == 0) ? (this._LastpageCount = this.model.pageCount) : null;
                    if (this._links != undefined)
                        this.model.currentPage = parseInt($(this._links[this.model.pageCount - 1]).data("index"), 10) + 1;
                }
            }
            else if ($target.hasClass("e-PP") && $target.hasClass("e-nextprevitemdisabled") != true) {
                if (this._links != undefined)
                    this.model.currentPage = parseInt($(this._links[0]).data("index"), 10) - this.model.pageCount;
                this._lastNP = false;
            }
            this._trigger("click", { "currentPage": this.model.currentPage, "event": e });
			if($target.hasClass("e-newrecord")){
				 this._trigger("addRecord", { "currentPage": this.model.currentPage, "event": e });
			}
            this.goToPage(this.model.currentPage, e);
            return false;
        },
        goToPage: function (pageIndex, event) {
            if (pageIndex != this.model.currentPage)
                this._prevPageNo = this.model.currentPage;
            if (this._prevPageNo !== pageIndex && (pageIndex >= 1 && pageIndex <= this.model.totalPages)) {
                this.model.currentPage = pageIndex;
                this.model.enableQueryString && this._updateQueryString(this.model.currentPage);
            }
            if (this._prevPageNo != this.model.currentPage) {
                this.refreshPager();
                this._trigger("change", { "currentPage": this.model.currentPage, "isInteraction": true, "event": event });
            }
        },
		goToNextPage: function () {
			if(this.model.totalRecordsCount != 0 && this.model.currentPage >= 1 && this.model.currentPage < this.model.totalPages){
				this.model.currentPage = this.model.currentPage + 1;
				this.refreshPager();
                this._trigger("change", { "currentPage": this.model.currentPage, "isInteraction": true, "event": event });
			}
		},
		goToLastPage: function () {
			if(this.model.totalRecordsCount != 0 && this.model.currentPage >= 1 && this.model.currentPage < this.model.totalPages){
				this.model.currentPage = this.model.totalPages;
				this.refreshPager();
                this._trigger("change", { "currentPage": this.model.currentPage, "isInteraction": true, "event": event });
			}
		},
		goToFirstPage: function () {
			if(this.model.totalRecordsCount != 0 && this.model.currentPage > 1){
				this.model.currentPage = 1;
				this.refreshPager();
                this._trigger("change", { "currentPage": this.model.currentPage, "isInteraction": true, "event": event });
			}
		},
		goToPrevPage: function () {
			if(this.model.totalRecordsCount != 0 && this.model.currentPage > 1 ){
				this.model.currentPage = this.model.currentPage - 1;
				this.refreshPager();
                this._trigger("change", { "currentPage": this.model.currentPage, "isInteraction": true, "event": event });
			}
		},
		
        _updateQueryString: function (value) {
            var _newUrl = this._getUpdatedURL(window.location.href, "page", value);
            if (history.pushState) {
                window.history.pushState({ path: _newUrl }, '', _newUrl);
            }
            else
                window.location.href = _newUrl;
        },

        _getUpdatedURL: function (uri, key, value) {
            var re = new RegExp("([?|&])" + key + "=.*?(&|#|$)", "i");
            if (uri.match(re)) {
                return uri.replace(re, '$1' + key + "=" + value + '$2');
            } else {
                var hash = '';
                var separator = uri.indexOf('?') !== -1 ? "&" : "?";
                if (uri.indexOf('#') !== -1) {
                    hash = uri.replace(/.*#/, '#');
                    uri = uri.replace(/#.*/, '');
                }
                return uri + separator + key + "=" + value + hash;
            }
        },
        _getLocalizedLabels: function (property) {
            return ej.getLocalizedConstants(this.sfType, this.model.locale);
        },
        _fillScreen: function () {
			if(!$(this._templateElement).find(".e-textbox-paging").length > 0){
				var numLen = this.element.find('.e-pagercontainer').outerWidth() - (this._$first.outerWidth(true) + this._$last.outerWidth(true) + this._$next.outerWidth(true) + this._$prev.outerWidth(true))
				numLen -= !this._$NP||this._$NP.hasClass('e-disable') ? 0 : this._$NP.outerWidth(true);
				numLen -= !this._$PP||this._$PP.hasClass('e-disable') ? 0 : this._$PP.outerWidth(true);
				if(this.model.template){
					if (this.element.outerWidth() - $(this.element.find(".e-pagercontainer")).outerWidth() < 40) {
					if (Math.floor(numLen / this.element.find('.e-numericitem.e-spacing.e-default').outerWidth(true)) - 1 < 1) this._flag ? this.option("pageCount", 1) : this.model.pageCount = 1;
					else this._flag ? this.option("pageCount", Math.floor(numLen / this.element.find('.e-numericitem.e-spacing.e-default').outerWidth(true)) - 1) : this.model.pageCount = Math.floor(numLen / this.element.find('.e-numericitem.e-spacing.e-default').outerWidth(true)) - 1;
				}
				}
				else{
					if (this.element.outerWidth() - $(this.element.contents()[0]).outerWidth() < 40) {
						if (Math.floor(numLen / this.element.find('.e-numericcontainer .e-numericitem.e-spacing.e-default').outerWidth(true)) - 1 < 1) this._flag ? this.option("pageCount", 1) : this.model.pageCount = 1;
						else this._flag ? this.option("pageCount", Math.floor(numLen / this.element.find('.e-numericcontainer .e-numericitem.e-spacing.e-default').outerWidth(true)) - 1) : this.model.pageCount = Math.floor(numLen / this.element.find('.e-numericcontainer .e-numericitem.e-spacing.e-default').outerWidth(true)) - 1;
					}
				}
			}
        },
        _enable: function () {
            this.element.removeClass('e-disable').attr({ "aria-disabled": false });
            this.element.prop("disabled", false);
            if (this.numTextbox) this.numTextbox.removeAttr("disabled");
        },
        _disable: function () {
            this.element.addClass('e-disable').attr({ "aria-disabled": true });
            this.element.prop("disabled", "disabled");
            if (this.numTextbox) this.numTextbox.attr("disabled","disabled");
            if (this.$dropItem) if (this.$dropItem.css("display") != "none") this.$dropItem.hide();
			if(this.model.template){
				$(this._templateElement).addClass(".e-disable");
			}
        },
        _setFirst: true,
        _setModel: function (options) {
            for (var prop in options) {
                this._preval = this.model.currentPage;
                switch (prop) {
                    case "pageCount":
                        this._renderNumericLinks(this.element.find(".e-numericcontainer"));
                        if (this.model.isResponsive && !this._flag) {
                            this._maxPageCount = this.model.pageCount;
                            this._fillScreen();
                        }
                        this._flag = false;
                        break;
					case "template":
                        this.element.children().remove();
                        this.renderPager();
                        break;
                    case "enableExternalMessage":
                        if (options[prop])
                            this._renderPagerMessage();
                        else
                            this._removePagerMessage();
                        break;
                    case "showPageInfo":
                        this._pageInfo();
                        break;
                    case "pageSizeMessage":
                        if (options[prop] != null) {
                            this._renderPageSizeMessage();
                        }
                        break;
					case "pageSize":
					    this._pageSize = this.model.pageSize;
					    if (this.model.pageSizeList && this.model.pageSizeList.length > 0) {
							proxy=this;
					        this.$textspan.text(this.model.pageSize);
					        this.$dropItem.find(".e-active").removeClass("e-active");
							 $(".e-drpdwn.e-ul").find("li").each(function()  {
								var $li=$(this);  
								if($li.text() == proxy.model.pageSize)
								{
									$(this).addClass("e-active")
								}
							});
					    }
						break;
					case "pageSizeList":
						this.model.pageSizeList = options[prop];
                        if (options[prop].length > 0) {
                            this._pageSize = this.model.pageSize;
                            if (this.$dropItem) {
                                this.$dropItem.empty();
                                this._renderItems();
                            }
                            else this._renderDropdownlist();
                        }
                        else if (this.$dropItem) this._removeDropdownlist();
                        break;
                    case "enabled":
                        if (!options[prop]) this._disable(); else this._enable(); break;
                    case "cssClass":
                        this.element.removeClass(this._cssClass).addClass(options[prop]); this._cssClass = this.model.cssClass;
                    case "isResponsive":
                        this._wireResizing();
                        if (!options[prop]) this.option("pageCount", this._maxPageCount);
                        else if (this.model.isResponsive && !this._flag) {
                            this._maxPageCount = this.model.pageCount; this._fillScreen();
                        }
                        this._flag = false;
                        break;
                    case "showGoToPage": if (options[prop]) this._renderTextboxItem(); else if (this.numTextbox) { this.numTextbox.remove(); this.numTextbox = null; } break;
                    case "locale": this._setLocale(); break;
                    case "currentPage": {
                        this.refreshPager();
                        this._trigger("change", { "currentPage": this.model.currentPage, "isInteraction": false });
                    }


                }
            }
            if (prop != "currentPage") {
                this.refreshPager();
                if (this._preval != this.model.currentPage)
                    this._trigger("change", { "currentPage": this.model.currentPage, "isInteraction": false });
            }
        },

        // all events bound using this._on will be unbind automatically
        _destroy: function () {
            this.element.empty().removeClass("e-pager");
            this._unWireResizing();
        }
    });
    ej.Pager.Locale = ej.Pager.Locale || {};

    ej.Pager.Locale["default"] = ej.Pager.Locale["en-US"] = {
        pagerInfo: "{0} of {1} pages ({2} items)",
        firstPageTooltip: "Go to first page",
        lastPageTooltip: "Go to last page",
        nextPageTooltip: "Go to next page",
        previousPageTooltip: "Go to previous page",
        nextPagerTooltip: "Go to next pager",
        previousPagerTooltip: "Go to previous pager"
    };

})(jQuery, Syncfusion);