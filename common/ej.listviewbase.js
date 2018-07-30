/**
* @fileOverview Plugin to style the Html ListView elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    ej.widget("ejListViewBase", "ej.ListViewBase", {
        _addToPersist: ["selectedItemIndex", "checkedIndices"],
        defaults: {
            
            height: null,

            width: null,

            selectedItemIndex: -1,

            enableGroupList: false,
            
            enableAjax: false,
            
            enableCache: false,
            
            enablePersistence: false,
			
			ready: null,
            
            load: null,

            itemRequestCount: 5,

            totalItemsCount: 5,
			
            loadComplete: null,
            
            ajaxBeforeLoad: null,

            ajaxSuccess: null,

            ajaxError: null,

            ajaxComplete: null,

            ajaxSettings: {
                type: 'GET',
                cache: false,
                async: true,
                dataType: "html",
                contentType: "html",
                url: "",
                data: {}
            },
                                    
            renderTemplate: false,

            templateId: null,

            persistSelection: false,

            preventSelection: false,

            dataSource: [],

            query: null,

            allowVirtualScrolling: false,

            virtualScrollMode: "normal",

            showHeader: false,
			
			showHeaderBackButton: false,

            cssClass: "",

            headerTitle: "Title",

            headerBackButtonText: null,

            enableFiltering: false,

            enableCheckMark: false,

            checkedIndices :[],
			
			locale:"en-US"

        },

        observables: ["selectedItemIndex", "dataSource"],
        selectedItemIndex: ej.util.valueFunction("selectedItemIndex"),
        dataSource: ej.util.valueFunction("dataSource"),
        checkedIndices: ej.util.valueFunction("checkedIndices"),

        _updateModelItems: function () {
            this.model.items = eval(this.model.items);
            var ang_attr = this.model.items;
            if (ang_attr.length) {
                var ul = ej.buildTag("ul.e-m-clearall");
                for (i = 0; i < ang_attr.length; i++) {
                    ang_attr[i].items = [];
                    var ang_li = ej.buildTag("li");
                    if (this.model.items[i].template)
                        ang_li.html(this.model.items[i].template);
                    if (!this.model.items[i].childId && this.model.items[i].href)
                        this.model.items[i].childId = ("page_" + parseInt(Math.random().toFixed(3) * 1000));
                    if (this.model.items[i].renderTemplate) {
                        if (!this._storedTemplate[i]) {
                            if (this.model.items[i].templateId) {
                                var ele = this._tempContent.find('#' + this.model.items[i].templateId).remove();
                                this._storedTemplate[i] = ele[0].nodeName && ele[0].nodeName.toLowerCase() == "script" ? ej.getClearString(ele[0].innerHTML) : ele[0].outerHTML;
                            }
                            else
                                this._storedTemplate[i] = this.model.items[i].template;
                            this.model.items[i].templateId = this._storedTemplate[i];
                        }
                    }
                    if (this.model.fieldSettings)
                        this.model.fieldSettings = $.extend(this.defaults.fieldSettings, this.model.fieldSettings);
                    ul.append(ang_li);
                }
                this.element.append(ul)
            }
            else {
                var ul = this.element.find(">ul");
                var groupid = 1;
                for (var ulindex = 0; ulindex < ul.length; ulindex++) {
                    this._listitems = $(ul[ulindex]).find(">li");
                    for (var index = 0; index < this._listitems.length; index++) {
                        var element = this._listitems[index];
                        if ((ej.getAttrVal(element, "data-ej-primarykey") == null) && ($(element).find("ul").length)) {
                            var primaryKey = Math.round(Math.random() * 100);
                            $(element).attr("data-ej-primarykey", primaryKey);
                        }
                        else
                            primaryKey = "";
                        var groupTitle = ej.getAttrVal($(ul[ulindex]), "data-ej-grouplistitle") ? ej.getAttrVal($(ul[ulindex]), "data-ej-grouplistitle") : "GroupList" + groupid;
                        this.model.items.push(this._itemsObjectCollection($(this._listitems[index]), primaryKey, null, groupTitle));
                        this._nestedListitems = $(this._listitems[index]).find("ul >li");
                        for (var index1 = 0; index1 < this._nestedListitems.length; index1++) {
                            var element1 = this._nestedListitems[index1];
                            if ((ej.getAttrVal(element1, "data-ej-primarykey") == null) && ($(element1).find("ul").length)) {
                                var primaryKey = Math.round(Math.random() * 100);
                                $(element1).attr("data-ej-primarykey", primaryKey);
                            }
                            else
                                primaryKey = "";
                            var parentPrimaryKey = ej.getAttrVal($($(element1).parent()).closest("li"), "data-ej-primarykey");
                            this.model.items.push(this._itemsObjectCollection($(this._nestedListitems[index1]), primaryKey, parentPrimaryKey, groupTitle));
                        }
                    }
                    groupid++;
                }
            }
        },

        _load: function () {
            this._orgEle = this.element.clone();
            this._index = 0;
            this._items = [];
            this._dummyUl = [];
            this._virtualCount = 0;
            this._liItemHeight = 0;
            this._requestType = null;
            this._checkedValues = [];
            this._checkedValues = this.model.checkedIndices;
            this.model.id = this.element[0].id;
            if (this.model.allowVirtualScrolling && this.model.query != null) {
                this._savedQueries = this.model.query.clone();
            }
            if (this.model.load)
                this._trigger("load");
            this.model.fieldSettings = eval(this.model.fieldSettings);
            if (this.model.fieldSettings) {
                if (ej.DataManager && this._dataUrl instanceof ej.DataManager) {
                    if (!this._dataUrl.dataSource.offline && !(this._dataUrl.dataSource.json && this._dataUrl.dataSource.json.length > 0)) {
                        this._queryPromise(0, this, this.model.totalItemsCount, null);
                    }
                    else {
                        if (this.model.allowVirtualScrolling && this.model.virtualScrollMode == "continuous") {
                            if (ej.isNullOrUndefined(this._totalitemscount)) this.model.totalItemsCount = this._dataUrl.dataSource.json.length;                                                            
                        }
                        this._queryPromise(0, this, this.model.totalItemsCount, null);
                    }
                }
                else if (!ej.isNullOrUndefined(this._dataUrl) && !(this._dataUrl instanceof ej.DataManager) && !ej.isNullOrUndefined(this._totalitemscount)) {
                    this._dataUrl = ej.DataManager(this._dataUrl);
                    this._rawList = ej.DataManager(this._dataUrl.dataSource.json).executeLocal(ej.Query().take(this.model.totalItemsCount).clone());
                    this.model.dataSource = this._dataUrl;
                    this._queryPromise(0, this, this.model.totalItemsCount, null);
                }
            }
            this._renderControl();
        },
       
        _loadVirtualData: function (args) {
            this._dummyUl=[];
            var list = this._renderLists();
            $.views.helpers({ _checkAjaxUrls: this._checkAjaxUrl, _checkImgUrls: this._checkImgUrl, _checkIsChecked: this._checkIsCheck, Object: this, ej: ej });           
            this.jsRender = ej.buildTag("script#" + this.model.id + "_Template", "", {}, { "type": "text/x-jsrender" }); //Template for parent item
            if (ej.browserInfo().name == "msie" && ej.browserInfo().version < 10)
                this.jsRender[0].text = list[0].outerHTML.replace(/&gt;/g, '>');
            else
                this.jsRender[0].text = list[0].outerHTML.replace(/&gt;/g, '>');          
            this.jsChildRender = ej.buildTag("script#" + this.model.id + "_ChildTemplate", "", {}, { "type": "text/x-jsrender" });  //Template for child item
            if(this.model.allowVirtualScrolling == true && this.model.virtualScrollMode == "normal") var ulContainer = ej.buildTag("div");
            var ul = ej.buildTag("ul." + this._prefixClass + "childcontainer " + this._prefixClass + "list-hdr " + this._prefixClass + "clearall");
            list.addClass(this._prefixClass + "childli");
            ul[0].innerHTML = "{{for items}}" + list[0].outerHTML + "{{/for}}";             
            var result = args;
            if (result) {
                ul.empty().html($(this.jsRender).render(result));
                var _ulItems = ul.clone().find('li'), temp = "";
                if (this._initEJCheckBox) this._initEJCheckBox(ul);                     				               
                var proxy = this;
                for (var j =0; j < result.length; j++) {              
                    if (result[j] && result[j].attributes) {
                        $.each(result[j].attributes, function (i, attr) {
                            if (attr && attr.name.toLowerCase() == "class") temp = $(_ulItems[j]).attr('class');
                        });
                    }
                    if (this.model.allowVirtualScrolling && this.model.virtualScrollMode == "normal") {
                        var k = this.realUllength;	
                        if(this.model.enableCheckMark){
                            if($(this.element.find('li').eq(k).find('.e-chkbox-wrap')).length!=0){
                                var x=$(this.element.find('li').eq(k).find('.e-chkbox-wrap'))[0];
                                var checked = x.getAttribute("aria-checked")=="true" ? true : false;
                                $($(_ulItems[j]).find(".e-lv-check")).ejCheckBox({ checked: checked });		
                            }
                            else{
                                var checked = false;
                                if(this._removeIndex!=j)
                                    $($(_ulItems[j]).find(".e-lv-check")).ejCheckBox({ checked: checked });	
                                else 
                                    $(_ulItems[j]).find('.e-lv-check').remove();									
                            }																							 													 									
                        }
                        if($(_ulItems[j]).find('.e-lv-check').length !=0) $(_ulItems[j]).find('.e-lv-check').parent().addClass("e-lv-checkdiv");
                        this._dummyUl.push(_ulItems[j]);
                        this._removeEmptyElements();
                        this.scrollerObj.refresh();
                    }
                    else if (this.model.allowVirtualScrolling && this.model.virtualScrollMode == "continuous") {
                        if(this.model.enableCheckMark){																										 				
                            $($(_ulItems[j]).find(".e-lv-check")).ejCheckBox();												
                        }
                        $(_ulItems[j]).find('.e-lv-check').parent().addClass("e-lv-checkdiv");
                        this._lContainer.find('ul').append(_ulItems[j]);
                        this._removeEmptyElements();
                        this._lContainer.find('ul li.e-lastitem').removeClass(this._prefixClass + "lastitem");
                        this._lContainer.find('ul li:last').addClass(this._prefixClass + "lastitem");
                        this.scrollerObj.refresh();
                    }
                    this.realUllength+=1;
                }
            }
        },
        _removeEmptyElements:function()
        {
            this.eLi = this.element.find('li.' + this._prefixClass + 'list');
            this.eLi.removeEleEmptyAttrs();
            this.eLi.find('.' + this._prefixClass + 'chevron-right_01').removeEleEmptyAttrs();
        },

        _renderControl: function () {
            var proxy = this;
            this.element.addClass(this._prefixClass + "parentlv " + this.model.cssClass);
            this._lbEle = ej.buildTag("div." + this._rootCSS);
            this._lbEle.addClass("subpage");
            if(this.model.allowVirtualScrolling == true && this.model.virtualScrollMode == "normal") var ulContainer = ej.buildTag("div." + this._prefixClass + "sub-list-container");
            this._lContainer = ej.buildTag("div." + this._prefixClass + "list-container#" + this.model.id + "_container");
            if (this._hasDataSource())
                var ul = this.element.find(">ul");
            else
                var ul = this.element.find("ul:first");
            if (this.model.showHeader) {
                var hdr = this._renderHeader(this.model.id, false , this.model.headerTitle, this.model.headerBackButtonText);
                this._lbEle.prepend(hdr);
            }
            if (this._hasDataSource() && !this.model.renderTemplate)
                this.element.empty();
            if (this.model.renderTemplate) {
                if (this.model.templateId) {
                    if (this._tempContent.find('#' + this.model.templateId).length) {
                        this._template = this._tempContent.find('#' + this.model.templateId);
                        ej.destroyWidgets(this._template);
                        if (this._template[0].nodeName.toLowerCase() != "script")
                            this._template.remove();
                        this._template = this._template[0].nodeName && this._template[0].nodeName.toLowerCase() == "script" ? ej.getClearString(this._template[0].innerHTML) : this._template[0].outerHTML;
                    }
                }
                else {
                    ej.destroyWidgets(this.element);
                    this._template = this.element.html();
                    this.element.empty();
                }
				this._lContainer.addClass(this._prefixClass+"template-list");
            }
            if (this.model.renderTemplate && !this._hasDataSource() && !this.model.enableGroupList) {
                this.element.append(this._lbEle.append(this._lContainer));
				$(this.element.find('.' + this._prefixClass + 'lv-check').parent()).addClass(this._prefixClass+'template-checkmark');
                if (this._template) {
                    this._lContainer.append(this._template);
                    if (ej.widget.init)
                        ej.widget.init(this._lContainer);
                }
            }
            else if (!this.model.renderTemplate || this.model.renderTemplate && this._hasDataSource() || this.model.renderTemplate && this.model.enableGroupList) {
                this._model_index = 0;
                if (this.model.enableGroupList) {
                    this._lContainer.addClass(this._prefixClass + "grouped");
                    var innerDiv = ej.buildTag("div." + this._prefixClass + "grouplist");
                    ul = this.element.children();
                    if (ul.length || this.dataSource().length) {
                        if (this.dataSource().length)
                            var group = ej.DataManager(this.dataSource()).executeLocal(ej.Query().from(this.dataSource()).group(this.model.fieldSettings['groupID']));
                        else
                            var group = ej.DataManager(this.model.items).executeLocal(ej.Query().from(this.model.items).group(this.model.fieldSettings['groupID']));
                        var length = group.length;
                        var title;
                        for (var i = 0; i < length; i++) {
                            this._items = group[i].items;
                            if (this._hasDataSource()) {
                                ulItem = ej.buildTag('ul', "", {}, { "data-ej-grouplisttitle": group[i].key });
                                this._lbEle.append(ulItem);
                            }
                            else
                                ulItem = ul[i];
                            title = this._hasDataSource() ? group[i].key : ej.getAttrVal($(ulItem), 'data-ej-grouplisttitle', "GroupList" + (i + 1));
                            $(ulItem).attr("data-ej-grouplisttitle", title);
                            var groupdiv = ej.buildTag("div." + this._prefixClass + "groupdiv", ej.buildTag("div." + this._prefixClass + "grouptitle", title));
                            innerDiv.append(groupdiv.append(this._renderListItems($(ulItem).addClass(this._prefixClass + "grouped"))));
                        }
                    }
                    else if (this._template) {
                        ej.destroyWidgets(this._template);
                        innerDiv[0].innerHTML = this._template;
                    }
					this._lContainer.append(innerDiv);
                    if (ej.widget.init)
                        ej.widget.init(innerDiv);
                }
                else {
                    if (this._hasDataSource()) {
                        var ul = ej.buildTag('ul');
                        this._items = this.dataSource();
                        this._items = eval(this._items);
                        for (j = 0; j < this._items.length; j++) {
                            if (this._items[j].href && !this._items[j].childId) {
                                this._items[j].childId = ("page_" + parseInt(Math.random().toFixed(3) * 1000));
                            }
                        }
                    }
                    if (ul.length) {
                        ej.destroyWidgets(ul);
                        if(this.model.allowVirtualScrolling == true && this.model.virtualScrollMode == "normal") {
                            ulContainer.append(this._renderListItems(ul));
                            $(ul).find('li').attr("data-ej-page",0);
                            this._lContainer.append(ulContainer);
                        }
                        else 
                            this._lContainer.append(this._renderListItems(ul));
                    }
                    else if (this._template) {
                        ej.destroyWidgets(this._template);
                        this._lContainer[0].innerHTML = this._template;
                    }
                }
                this.element.prepend(this._lbEle);
                if (this.model.enableFiltering)
                    this._createFilterWrapper(this._lbEle);
                this._setHeightWidth();
                this._lContainer.ejScroller({
                    height: this._lContainer.outerHeight(),
                    width: 0,
                    scrollerSize: 20,
                    scroll: function (e) {
                        proxy._onScroll(e);
                    },
                });
                this.scrollerObj = this._lContainer.ejScroller("instance");
                this._lbEle.append(this._lContainer);
                if (ej.widget.init)
                    ej.widget.init(this._lContainer);
                var eLi = this.element.find('li.' + this._prefixClass + 'list');
                eLi.removeEleEmptyAttrs();
                eLi.find('.' + this._prefixClass + 'chevron-right_01').removeEleEmptyAttrs();
                if(this.model.allowVirtualScrolling == true && this.model.virtualScrollMode == "normal") {
                    this._liItemHeight = $(this.element.find('li')[0]).outerHeight();
                    totalHeight = this._totalCount * this._liItemHeight;
                    $('.e-sub-list-container ul').height(totalHeight);
                }
                if (ej.widget.init)
                    ej.widget.init(this._lbEle);
                var ulItems = this.element.find('ul');
                ulItems.find('li:first').addClass(this._prefixClass + "firstitem");
                ulItems.find('li:last').addClass(this._prefixClass + "lastitem");
                this._liEl = this.element.find("li");
                if (this.selectedItemIndex() >= 0 && !this.model.preventSelection && this.model.persistSelection) {
                    if (!ej.getBooleanVal(ulItems[this.selectedItemIndex()], 'data-preventselection', this.model.preventSelection) && ej.getBooleanVal(ulItems[this.selectedItemIndex()], 'data-persistselection', this.model.persistSelection)) {
                        this._currentItem = $(this._liEl[this.selectedItemIndex()]);
                        this._prevItem = this._currentItem;
                        this._currentItem.removeClass(this._prefixClass + "state-default").addClass(this._prefixClass + "state-active");
                    }
                }
                $(this.element.find('.' + this._prefixClass + 'lv-check').parent()).addClass(this._prefixClass + 'lv-checkdiv');
				if(this.model.renderTemplate) $(this.element.find('.' + this._prefixClass + 'lv-check').parent()).addClass(this._prefixClass+'template-checkmark');
                $(this.element.find('.' + this._prefixClass + 'lv-check').closest('li.' + this._prefixClass + 'list')).addClass(this._prefixClass + 'list-check');
                $(this.element.find('.' + this._prefixClass + 'lv-input').closest('.' + this._prefixClass + 'lv-filter')).addClass(this._prefixClass + 'lv-inputdiv');
                this._wireEvents();
            }
            this._setHeightWidth();
			if (this.model.height !== null) 
				if (this._lContainer.height() > this.model.height)
					this._refreshScroller(this._lContainer,false);
			if (this.scrollerObj) {
				this.scrollerObj.refresh();
				$(this.scrollerObj.element).find(".e-vhandlespace").css("height",($(this.scrollerObj.element).find(".e-vhandlespace").height() -1));
            }
            if (this.model.loadComplete)
                this._trigger("loadComplete");
        },

        _createFilterWrapper: function (element) {
            var fDiv = this._createFilterDiv();
            var fAnchor = ej.buildTag("a." + this._prefixClass + "lv-anchor", ej.buildTag('span.' + this._prefixClass + 'input-btn'), {}, { "Title": "Clear text", "data-role": "none" });
            $(fDiv).append(fAnchor);
            element.append(fDiv);
        },
        
		_refreshScroller: function (container,isChild) {
            //added start
               if (this.model.virtualScrollMode == "continuous") {
                this._lContainer.find(".e-content, .e-vhandle,.e-vhandle div").removeAttr("style");
                this._lContainer.css({ "display": "block" });
                if (this.scrollerObj) {
                    this.scrollerObj.model.height = this._lContainer.height();
                    this.scrollerObj.refresh();
                    this.scrollerObj.option("scrollTop", 0);
                }
            }
            //added end
            container.find(".e-vhandle div").removeAttr("style");
            if(isChild)
                hgt = this.model.showHeader && this.model.enableFiltering ? this.model.height - ((ej.getDimension(this._lbEle.find('.' + this._prefixClass + 'header'), 'outerHeight')) + (ej.getDimension($(id).find('.' + this._prefixClass + 'lv-filter'), 'outerHeight'))) - 2 : this.model.showHeader ? this.model.height - ej.getDimension(this._lbEle.find('.' + this._prefixClass + 'header'), 'outerHeight') - 2 : this.model.enableFiltering ? this.model.height - (ej.getDimension($(id).find('.' + this._prefixClass + 'lv-filter'), 'outerHeight')) - 2 : this.model.height - 2;
            else
                hgt = this.model.showHeader && this.model.enableFiltering ? this.model.height - ((ej.getDimension(this._lbEle.find('.' + this._prefixClass + 'header'), 'outerHeight')) + ($('.' + this._prefixClass + 'lv-filter').height())) - 2 : this.model.showHeader ? this.model.height - ej.getDimension(this._lbEle.find('.' + this._prefixClass + 'header'), 'outerHeight') - 2 : this.model.enableFiltering ? this.model.height - $('.' + this._prefixClass + 'lv-filter').height() - 2 : this.model.height - 2;
            if (this.scrollerObj) {
                this.scrollerObj.model.height = hgt;
            }
        },
        
        _renderListItems: function (ul) {
            ul.addClass(this._prefixClass + "list-hdr " + this._prefixClass + "clearall");
            this._liItems = ul.find("li");
            if (this._liItems.length && !this._hasDataSource() || this._hasDataSource()) {
                this._renderParentChildTemplate();
                if (!this._hasDataSource() && !this.model.enableGroupList) {
                    this._items = this.model.items;
                }
                var items = this._items;
                var proxy = this;
                if (this.model.allowVirtualScrolling) {
                    var childItem = [];
                    var result =  { parent: items, child: childItem };
                }
                else {
                    var result = this._filterParentChild(items);
                }
                if (result.child.length)
                    this._childRendering(result.child);
                if (result.parent) {
                    ul.empty().html($(this.jsRender).render(result.parent));
                    var ulItems = ul.find('>li'), temp = "";
                    for (var j = 0; j < ulItems.length; j++) {
                        if (result.parent[j] && result.parent[j].attributes) {
                            $.each(result.parent[j].attributes, function (i, attr) {
                                if (attr && attr.name.toLowerCase() == "class") temp = $(ulItems[j]).attr('class');
                            });
							$(ulItems[j]).addEleAttrs(result.parent[j].attributes);
							$(ulItems[j]).addClass(temp);
                        }
                    }
                }
            }
            if (this._initEJCheckBox)
                this._initEJCheckBox(ul);
            return ul;
        },

        _onScroll: function (e) {
            if (!e.scrollTop) return;
            var scrollerPosition = e.scrollTop, proxy = this;
            var source = this.dataSource();
            if (this.model.actionBegin)
                this._trigger("actionBegin", {});
            this.realUllength = this.element.find('li.e-list').length;
            if (this.model.allowVirtualScrolling && this.model.virtualScrollMode == "continuous") {
                liHeight = $(this.element.find('li')[0]).outerHeight();
                if(scrollerPosition + this.model.height >= this.element.find("li").length * liHeight) { 
                    this._updateLoadingClass(true);
                    if (ej.DataManager && this._dataUrl instanceof ej.DataManager && !ej.isNullOrUndefined(this._dataUrl.dataSource.url)) {
                        this._queryPromise(this.realUllength, proxy, this.realUllength + this.model.itemRequestCount, e);
                    }
                    else if ((ej.DataManager && this._dataUrl instanceof ej.DataManager && this._dataUrl.dataSource.offline && (this._dataUrl.dataSource.json && this._dataUrl.dataSource.json.length > 0)) || (!ej.isNullOrUndefined(this._dataUrl) && !(this._dataUrl instanceof ej.DataManager))) {
                        window.setTimeout(function () {
                            proxy._updateLoadingClass(false);
                        }, 300);
                    }
                }
            }            
            else if (this.model.allowVirtualScrolling && this.model.virtualScrollMode == "normal") {
                var source = this.dataSource();
                if (ej.DataManager && this._dataUrl instanceof ej.DataManager) {
                    if (e.scrollTop != e.scrollData.scrollOneStepBy + e.scrollData.scrollable) {
                        window.setTimeout(function () {
                            if (proxy._virtualCount == 0) {
                                proxy._loadList();
                            }
                        }, 300);
                    }
                }
            }           
        },

        _localDataVirtualScroll: function () {
            var _rawlist = this._rawList.length;
            var queryPromise = ej.DataManager(this._dataUrl.dataSource.json).executeLocal(ej.Query().skip(_rawlist).take(this.model.totalItemsCount).clone());
            return queryPromise;
        },

        _loadList: function () {
            this._virtualCount++;
            var top = this.scrollerObj.scrollTop(), proxy = this, prevIndex = 0, prevPageLoad, nextIndex = null;
            this._currentPageindex = Math.round(top / (this._liItemHeight * this._items.length));
            if (($.inArray(this._currentPageindex, this._virtualPages.sort(function (a, b) { return a - b; }))) != -1) {
                if (this._currentPageindex == 0) {
                    if (($.inArray(this._currentPageindex + 1, this._virtualPages)) != -1) {
                        this._virtualCount--;
                        return false;
                    } else {
                        this._currentPageindex = this._currentPageindex + 1;
                    }
                }
                else if (($.inArray(this._currentPageindex - 1, this._virtualPages)) != -1) {
                    if (($.inArray(this._currentPageindex + 1, this._virtualPages)) != -1) {
                        this._virtualCount--;
                        return false;
                    } else {
                        this._currentPageindex = this._currentPageindex + 1;
                    }
                }
                else {
                    this._currentPageindex = this._currentPageindex - 1;
                }
            }
            prevPageLoad = !($.inArray(this._currentPageindex - 1, this._virtualPages) != -1);
            this._updateLoadingClass(true);
            for (var i = this._virtualPages.length - 1; i >= 0; i--) {
                if (this._virtualPages[i] < this._currentPageindex) {
                    prevIndex = this._virtualPages[i];
                    if (!(i + 1 == this._virtualPages.length))
                        nextIndex = this._virtualPages[i + 1];
                    break;
                }
            }
            var firstArg = prevPageLoad ? (this._currentPageindex - 1) * this._items.length : this._currentPageindex * this._items.length;
            var skipQuery = ej.Query().range(firstArg, this._currentPageindex * this._items.length + this._items.length), queryPromise, list;
            if (ej.DataManager && this._dataUrl instanceof ej.DataManager && !ej.isNullOrUndefined(this._dataUrl.dataSource.url)) {
                var skipParam = prevPageLoad ? (this._currentPageindex - 1) * this._items.length : this._currentPageindex * this._items.length;
                if(this._dataUrl.dataSource.offline == true)
                    skipQuery = ej.Query().skip(skipParam).take(this.model.itemRequestCount);
                else 
                    skipQuery = this._getQuery().skip(skipParam);
                if (prevPageLoad) {
                    for (i = 0; i < skipQuery.queries.length; i++) {
                        if (skipQuery.queries[i].fn == "onTake") {
                            skipQuery.queries.splice(i, 1);
                            break;
                        }
                    }
                    skipQuery.take(2 * this._items.length);
                }
                if (!proxy._trigger("actionBegin")) {
                    queryPromise = proxy._dataUrl.executeQuery(skipQuery);
                    queryPromise.done(function (e) {
                        proxy._appendVirtualList(e.result, prevIndex, proxy._currentPageindex, nextIndex, prevPageLoad);
                        proxy._trigger("actionSuccess", { e: e });
                    }).fail(function (e) {
                        proxy._virtualCount--;
                        proxy._trigger("actionFailure", { e: e });
                    }).always(function (e) {
                        proxy._updateLoadingClass(false);
                        proxy._trigger("actionComplete", { e: e });
                    });
                }
            }
            else if (ej.DataManager && this._dataUrl instanceof ej.DataManager && this._dataUrl.dataSource.offline && (this._dataUrl.dataSource.json && this._dataUrl.dataSource.json.length > 0)) {
                this._appendVirtualList(this._localDataVirtualScroll(), prevIndex, this._currentPageindex, nextIndex, prevPageLoad);
                this._updateLoadingClass(false);
            }
            else {
                list = ej.DataManager(proxy.model.dataSource).executeLocal(skipQuery);
                this._appendVirtualList(list, prevIndex, this._currentPageindex, nextIndex, prevPageLoad);
                this._updateLoadingClass(false);                
            }
        },


        _appendVirtualList: function (list, prevIndex, currentIndex, nextIndex, prevPageLoad) {
            this._virtualCount--;
            if (($.inArray(currentIndex, this._virtualPages.sort(function (a, b) { return a - b; }))) != -1) return false;
            if (prevPageLoad && ($.inArray(currentIndex - 1, this._virtualPages.sort()) != -1)) {
                list.splice(0, this._items.length);
                prevPageLoad = false;
            }
            var items = this._items.length, tempUl = $("<ul>"), firstVirtualHeight, secondVirtualHeight;
            firstVirtualHeight = prevPageLoad ? ((currentIndex - 1) * items * this._liItemHeight) - (prevIndex * items + items) * this._liItemHeight : (currentIndex * items * this._liItemHeight) - (prevIndex * items + items) * this._liItemHeight;
            if (firstVirtualHeight != 0) tempUl.append($("<span>").addClass("e-virtual").css({ display: "block", height: firstVirtualHeight }));
            this._loadVirtualData(list);
            $(this._dummyUl).attr("data-ej-page", currentIndex);
            if (prevPageLoad) {
                $(this._dummyUl).slice(0, items).attr("data-ej-page", currentIndex - 1);
            }
            tempUl.append(this._dummyUl);
            var ulItems = this.element.find('ul');
            secondVirtualHeight = (currentIndex * items + items) * this._liItemHeight;
            if (nextIndex != null) secondVirtualHeight = (nextIndex * items * this._liItemHeight) - secondVirtualHeight;
            else secondVirtualHeight = ulItems.height() - secondVirtualHeight;
            if (secondVirtualHeight != 0) tempUl.append($("<span>").addClass("e-virtual").css({ display: "block", height: secondVirtualHeight }));
            var selector = ulItems.find("li[data-ej-page=" + prevIndex + "]").last();
            selector.next().remove();
            tempUl.children().insertAfter(selector);
            this._removeEmptyElements();
            this._virtualPages.push(currentIndex);
            if (prevPageLoad) this._virtualPages.push(currentIndex - 1);
            if (ej.DataManager && this._dataUrl instanceof ej.DataManager && this._dataUrl.dataSource.offline && (this._dataUrl.dataSource.json && this._dataUrl.dataSource.json.length > 0)) {
                for (var i = 0; i < list.length; i++) {
                    this._rawList.push(list[i]);
                }               
            }
            this._virtualUl = ulItems.clone(true);
            ulItems.find('li.e-lastitem').removeClass(this._prefixClass + "lastitem");
            ulItems.find('li:last').addClass(this._prefixClass + "lastitem");
        },

        _updateLoadingClass: function (value) {
            var _id = this.element.attr("id")
            if(value){
                $("#" + _id+" .e-list-container.e-scroller .e-sub-list-container").addClass("e-load");
                $(".e-lv .e-list.e-state-default").css("opacity","0.5");
            }
            else {
                $("#" + _id+" .e-list-container.e-scroller .e-sub-list-container").removeClass("e-load");
                $(".e-lv .e-list.e-state-default").css("opacity","");
            }
            return this;
        },

        _queryPromise: function (start, proxy, end, event) {
            if (ej.DataManager && this._dataUrl instanceof ej.DataManager) {
                if (event==null) {
                    proxy._requestType = "init";
                    var queryPromise = this._dataUrl.executeQuery(this._getQuery());
                }
                else if(event != null) {
                    proxy._requestType = "request";
                    this._trigger('itemRequest', { event: event, isInteraction: true });
                    if(this._dataUrl.dataSource.offline == true) var mQuery = ej.Query();
                    else var mQuery = this._savedQueries.clone();
                    var queryPromise = this._dataUrl.executeQuery(mQuery.range(start, end));
                    this._updateLoadingClass(true);
                }
                queryPromise.done(function (e) {
                    if(proxy._requestType == "init"){
                        proxy._totalCount = e.count;
                        proxy.model.dataSource = e.result;
                        proxy._renderControl();
                        proxy._virtualPages = [0];
                    }
                    if(proxy._requestType == "request"){
                        proxy._trigger("actionBeforeSuccess", e);
                        proxy.realUllength =start;
                        proxy._loadVirtualData(e.result);
                    }
                    proxy._trigger("actionSuccess", { e: e });
                }).fail(function (e) {
                    proxy._trigger("actionFailure", { e: e });
                }).always(function (e) {
                    proxy._updateLoadingClass(false);
                    proxy._requestType = null;
                    proxy._trigger("actionComplete", { e: e });
                });
            }
        },

        _getQuery: function() {
            var remoteUrl, mapper = this.model.fieldSettings, queryManager = ej.Query();
            if (ej.isNullOrUndefined(this.model.query)) {
                var column = [];
                for (var col in mapper) {
                    if (col !== "tableName" && mapper[col])
                        column.push(mapper[col]);
                }
                if (column.length > 0)
                    queryManager.select(column);
            }
            else if (this.model.query) 
                queryManager = this.model.query.clone();
            if (this.model.allowVirtualScrolling) { 
                queryManager.requiresCount();
                queryManager.take(this.model.totalItemsCount);
            }
            remoteUrl = this.model.dataSource.dataSource;
            if (mapper)
                if ((remoteUrl && remoteUrl.url && !remoteUrl.url.match(mapper.tableName + "$")) || (remoteUrl && !remoteUrl.url) || (!remoteUrl))
                    !ej.isNullOrUndefined(mapper.tableName) && queryManager.from(mapper.tableName);
            return queryManager;
        },
        
        _filterParentChild: function (items) {
            var dataMgr = ej.DataManager(items);
            var childItem = dataMgr.executeLocal(ej.Query().from(items).where(ej.Predicate(this.model.fieldSettings['parentPrimaryKey'], ej.FilterOperators.notEqual, null)).group(this.model.fieldSettings['parentPrimaryKey']));
            var parentItem = dataMgr.executeLocal(ej.Query().from(items).where(ej.Predicate(this.model.fieldSettings['parentPrimaryKey'], ej.FilterOperators.equal, null)));
            return { parent: parentItem, child: childItem };
        },

        _childRendering: function (grouped) {
            var proxy = this;
            if (grouped.length) {
                proxy.element.append($(proxy.jsChildRender).render(grouped));
                $.each(grouped, function (index, element) {
                    if (ej.widget.init)
                        ej.widget.init(proxy.element.find('#child' + element.key));
                    var ul = proxy.element.find('#child' + element.key).find('ul');
                    var li = ul.find('li');
                   var k = 0;
                    for (var j = 0; j < li.length; j++) {
                        if (grouped[k].items[j] && grouped[k].items[j].attributes)
                            $(li[j]).addEleAttrs(grouped[k].items[j].attributes);
                    }
                    k++;
                });
            }
        },
        _renderParentChildTemplate: function () {
            var list = this._renderLists();
            $.views.helpers({ _checkAjaxUrls: this._checkAjaxUrl, _checkImgUrls: this._checkImgUrl, _checkIsChecked: this._checkIsCheck, Object: this, ej: ej });
            //Template for parent item
            this.jsRender = ej.buildTag("script#" + this.model.id + "_Template", "", {}, { "type": "text/x-jsrender" });
            if (ej.browserInfo().name == "msie" && ej.browserInfo().version < 10)
                this.jsRender[0].text = list[0].outerHTML.replace(/&gt;/g, '>');
            else
                this.jsRender[0].text = list[0].outerHTML.replace(/&gt;/g, '>');
            //Template for child item
            this.jsChildRender = ej.buildTag("script#" + this.model.id + "_ChildTemplate", "", {}, { "type": "text/x-jsrender" });
            if(this.model.allowVirtualScrolling == true && this.model.virtualScrollMode == "normal") var ulContainer = ej.buildTag("div");
            var ul = ej.buildTag("ul." + this._prefixClass + "childcontainer " + this._prefixClass + "list-hdr " + this._prefixClass + "clearall");
            list.addClass(this._prefixClass + "childli");
            ul[0].innerHTML = "{{for items}}" + list[0].outerHTML + "{{/for}}";
            var div = ej.buildTag("div." + this._rootCSS + " subpage " + this._prefixClass + "childitem", "", {}, { "id": "{{if key}}child{{>key}}{{else " + this.model.fieldSettings['childId'] + "}}{{>" + this.model.fieldSettings['childId'] + "}}{{else}}{{/if}}", "style": "display:none" });
            var innerdiv = ej.buildTag("div." + this._prefixClass + "list-container", "", {}, { "id": "{{if key}}child{{>key}}{{else " + this.model.fieldSettings['childId'] + "}}{{>" + this.model.fieldSettings['childId'] + "}}{{else}}{{/if}}_container" });
            if (this.model.showHeader)
                div.append(this._renderHeader("{{if key}}child{{>key}}{{else " + this.model.fieldSettings['childId'] + "}}{{>" + this.model.fieldSettings['childId'] + "}}{{else}}{{/if}}", true, "Title"));
            if (this.model.enableFiltering)
                this._createFilterWrapper(div);
            if(this.model.allowVirtualScrolling == true && this.model.virtualScrollMode == "normal") div.append(innerdiv.append(ulContainer.append(ul)));
            else  div.append(innerdiv.append(ul));
            if (ej.browserInfo().name == "msie" && ej.browserInfo().version < 10)
                this.jsChildRender[0].text = div[0].outerHTML.replace(/&gt;/g, '>');
            else
                this.jsChildRender[0].innerHTML = div[0].outerHTML.replace(/&gt;/g, '>');
        },
    
        _renderChild: function (childId, ignoreWidth) {
            this._currentItem.attr('data-childid', childId);
            if (!this._currentItem.attr('data-childtitle'))
                this._currentItem.attr('data-childtitle', this._currentItem.text());
            this._createListDiv(childId);
            this._div.hide();
            this._container = ej.buildTag("div." + this._prefixClass + "list-container#" + childId + "_container");
            this.element.append(this._div);
        },

        _getText: function (element) {
            return $(element).clone()
           .children()
           .remove()
           .end()
           .text();
        },

        
        _checkImgUrl: function (item) {
            var obj = this.getRsc("helpers", "Object");
            var img = this.data[obj.model.fieldSettings.imageUrl];
            if (!$.support.pushstate)
                img = typeof App == "object" ? App.route.makeUrlAbsolute(img, true) : img;
            return "<img src = " + img + " class='" + obj._prefixClass + "list-img " + obj._prefixClass + "rel " + obj._prefixClass + "user-select'/>";
        },

        
        
        _checkAjaxUrl: function () {
            var href = this.data.href;
            var childid = this.data.childId;
            var rendertemp = this.data.renderTemplate;
            var tempid = this.data.templateId;
            var listObj = this.getRsc("helpers", "Object");
            var ej = this.getRsc("helpers", "ej");
            var content = listObj._currentPage(listObj);
            if (href && href.indexOf("#") != -1 && href != "#") {
                if (!listObj._storedContent[childid]) {
                    content.find(href).show();
                    var ele = content.find(href).clone();
                    content.find(href).hide();
                    listObj._storedContent[childid] = ele[0].nodeName && ele[0].nodeName.toLowerCase() == "script" ? ej.getClearString(ele[0].innerHTML) : ele[0].outerHTML;
                }
            }
            else {
                if (listObj._storedContent[this.index])
                    listObj._storedContent = ej._pushValue(listObj._storedContent, "", this.index);
            }

        },

        _currentPage: function (obj) {
            return obj._prefixClass == "e-m-" ? ej.getCurrentPage() : $("body");
        },
        
        _checkIsCheck: function (item) {
            return this.data[this.getRsc("helpers", "Object").model.fieldSettings.checked] ? true : false;
        },

        _onTouchStartHandler: function (evt) {
             this._mouseDown = { x: (!ej.isNullOrUndefined(evt.clientX)) ? evt.clientX : evt.touches[0].clientX, y: (!ej.isNullOrUndefined(evt.clientY)) ? evt.clientY : evt.touches[0].clientY };
			if(($(evt.target.parentElement).hasClass(this._prefixClass + 'disable')) || ($(evt.currentTarget).hasClass(this._prefixClass + 'disable'))) 
				return false;
            if (!ej.isDevice() && !ej._preventDefaultException(evt.target, this._preventDefaultException))
                evt.preventDefault && evt.preventDefault();
            if (ej.isWindows && ej.isWindows())
                ej._touchStartPoints(evt, this);
            this._currentItem = $(evt.currentTarget);
            this._scroll = false;
            if (!ej.getBooleanVal(this._currentItem, 'data-preventSelection', this.model.preventSelection))
                this._addSelection();
			 if (this.model.renderMode == "windows" &&!this.model.windows.preventSkew)
                 this._currentItem.addClass(this._prefixClass + "m-skew-center");
            this._triggerStartEvent(this._returnData());
			ej.listenEvents([this._liEl, this._liEl],
                           [ej.endEvent(), ej.moveEvent(), ej.cancelEvent()],
                           [this._touchEndDelegate, this._touchMoveDelegate, this._touchMoveDelegate], false, this);
            $(window).on(ej.endEvent() + " MSPointerUp pointerup", this._docClickDelegate);
        },
        
        
        _onTouchMoveHandler: function (evt) {
		if ((ej.browserInfo().name == "msie" && ej.browserInfo().version > 8)|| ej.browserInfo().name != "msie"){
           if (((!ej.isNullOrUndefined(evt.clientX)) ? evt.clientX : evt.changedTouches[0].clientX !== this._mouseDown.x) || ((!ej.isNullOrUndefined(evt.clientY)) ? evt.clientY : evt.changedTouches[0].clientY !== this._mouseDown.y)) {
            this._isMoved = true;
             if (ej.isDevice() && (!ej.isWindows || (ej.isWindows && !ej.isWindows()) || (ej.isWindows && ej.isWindows() && ej._isTouchMoved(evt, this)))) {
                this._scroll = true;
                if (!ej.getBooleanVal(this._currentItem, 'data-persistSelection', this.model.persistSelection))
                    this._removeSelection();
                else if (this._prevItem && this._prevItem[0] != this._currentItem[0])
                    this._removeSelection();
                 if (this.model.renderMode == "windows" && !this.model.windows.preventSkew)					
                     ej._removeSkewClass(this._currentItem);
                else if (!ej.getBooleanVal(this._currentItem, 'data-preventselection', this.model.preventSelection) && this._prevItem && ej.getBooleanVal(this._currentItem, 'data-persistSelection', this.model.persistSelection))
                    this._prevItem.removeClass(this._prefixClass + "state-default").addClass(this._prefixClass + "state-active");
                    }
                }
            }
        },
        
        

        _onTouchEndHandler: function (evt) {
            if (ej.browserInfo().name == "msie" && ej.browserInfo().version == 8)
                evt.stopImmediatePropagation();
            this._isFromAjax = false;
            if (!ej.getBooleanVal(this._currentItem, 'data-persistSelection', this.model.persistSelection))
                this._removeSelection();
            if (this.model.renderMode == "windows" && !this.model.windows.preventSkew)			
                ej._removeSkewClass(this._currentItem);
            if (this._scroll) {
                this._setCurrent();
                this._unbindEvents(evt);
                return false;
            }
            else if (!this._scroll) {
                if (this._currentItem.find('.' + this._prefixClass + 'lv-check').length) {
                    var lbCheck = this._currentItem.find('.' + this._prefixClass + 'lv-check');
					  if ((this._prefixClass == "e-" && !ej.isNullOrUndefined(evt) && !$(evt.target).closest('.e-lv-checkdiv').length))
                        this._toggleCheckboxValue(lbCheck);
                }
                var backButton = this._currentItem.attr('data-childheaderbackbuttontext') == undefined ? this._currentItem.closest('.' + this._rootCSS + '').find('.' + this._prefixClass + 'header').length && ! this.model.showHeaderBackButton ? this._currentItem.closest('.' + this._rootCSS + '').find('.' + this._prefixClass + 'header .' + this._prefixClass + 'htitle').text() : "Back" : ej.getAttrVal(this._currentItem, 'data-childheaderbackbuttontext');
                var urlVal = this._currentItem.attr('data-href');
                if (!this._currentItem.attr('data-navigateUrl')) {
                    var page = this._isInsideNavigation ? this._tempContent.find("[data-ajaxurl='" + this._convertToRelativeUrl(urlVal) + "']") : this.element.find("[data-ajaxurl='" + this._convertToRelativeUrl(urlVal) + "']");
                    if (ej.getBooleanVal(this._currentItem, 'data-loadajax', (this.model.enableAjax && typeof (urlVal) != "undefined" || !typeof (urlVal))) && (!this.model.enableCache || page.length == 0)) {
                        if (page.length)
                            page.remove();
                        if ((this._prefixClass == "e-" && this._currentItem.hasClass("e-arrow")) || this._prefixClass != "e-")
                            this.loadAjaxContent(urlVal, backButton);
                        this._unbindEvents(evt);
                        if (this._isInsideNavigation && this._nearestND.model.contentId)
                            this._closeNavigation();
                        return;
                    }
                    else if (urlVal && urlVal.indexOf("#") != -1) {
                        if (this._currentPage(this).find('#' + urlVal.replace('#', '')).length) {
                            this._renderChild(ej.getAttrVal(this._currentItem, 'data-childid', "page_" + parseInt(Math.random().toFixed(3) * 1000)));
                            var content = ej.buildTag("div." + this._prefixClass + "content", this._storedContent[this._currentItem.attr('data-childid')]);
                            this._div.append(this._container.append(content));
                            if (ej.widget.init)
                                ej.widget.init(this._div);
                        }
                    }
                    this._updateContent(this._currentItem, backButton);
					if (this.model.ready) this._trigger("ready");
                    if (this._isInsideNavigation)
                        var close = this._nearestND.model.contentId ? (!this._currentItem.attr("data-childid") || this._currentItem.attr("data-href")) : !(this._currentItem.attr("data-childid") || this._currentItem.attr("data-href"));
                    if (this._isInsideNavigation && close)
                        this._closeNavigation();
                    this._touchEndEventHandler(evt);
                }
                else
                    this._touchEndEventHandler();
                this._prevItem = this._currentItem;
            }
            this._unbindEvents(evt);
        },

        _hasValue: function (data, index) {
            for (var i = 0; i < data.length; i++) {
                if (data[i] == index) return true;
            }
        },

        _generateData: function (items, elementId) {
            var collection = ej.DataManager(items).executeLocal(ej.Query().from(this.model.dataSource).where(ej.Predicate(typeof ej.getAttrVal(this._currentItem, "data-id") == "undefined" ? this.model.fieldSettings['text'] : this.model.fieldSettings['id'], ej.FilterOperators.equal, elementId)).group(elementId))[0];
            return collection ? collection.items[0] : [];
        },


        
        _closeNavigation: function () {
                this.element.closest('.' + this._prefixClass + 'nb').ejNavigationDrawer('close');
        },

        
        _setCurrent: function (e) {
            if (this._prevItem && ej.getBooleanVal(this._currentItem, 'data-persistSelection', this.model.persistSelection)) {
                this._currentItem = this._prevItem;
                this._currentItem.removeClass(this._prefixClass + "state-default").addClass(this._prefixClass + "state-active");
            }
        },
        
        _unbindEvents: function (e) {
            if (e && e.target.nodeName && e.target.nodeName.toLowerCase() != "a") {
                
                this._scroll = false;
            }
            ej.listenEvents([this._liEl, this._liEl],
                           [ej.endEvent(), ej.moveEvent(), ej.cancelEvent()],
                           [this._touchEndDelegate, this._touchMoveDelegate, this._touchMoveDelegate], true, this);
        },
        
        
        _addSelection: function () {
            if (!this._scroll) {
                this._currentItem.closest('.' + this._prefixClass + 'list-container').find('.' + this._prefixClass + 'state-active').removeClass(this._prefixClass + "state-active").addClass(this._prefixClass + "state-default");
                this._currentItem.removeClass(this._prefixClass + "state-default").addClass(this._prefixClass + "state-active");
            }
        },
        
        
        _removeSelection: function () {
            var proxy = this;
            proxy._currentItem.removeClass(this._prefixClass + "state-active").addClass(this._prefixClass + "state-default");
        },

        
        _setHeightWidth: function () {
            if (this.model.autoAdjustHeight)
                this.element.height(window.innerHeight);
            else if (this.model.height)
                this.element.height(this.model.height);
            else {
                var hgt = this.element[0].scrollHeight ? this.element[0].scrollHeight : ej.getDimension(this._lbEle.find('.' + this._prefixClass + 'list-container'), 'outerHeight');
                this.element.height(hgt);
            }
            if (this.model.width)
                this.element.width(this.model.width);
        },
        
        
        _touchEndEventHandler: function (evt) {
            this._triggerEndEvent(this._returnData(),evt);
        },
                
        _docClick: function (evt) {
            if (this._scroll) {
                this._setCurrent();
                $(document).off(ej.endEvent() + " MSPointerUp pointerup", this._docClickDelegate);
                ej.listenEvents([this._liEl, this._liEl],
                               [ej.endEvent(), ej.moveEvent()],
                               [this._touchEndDelegate, this._touchMoveDelegate], true, this);
                $(window).off(ej.endEvent() + " MSPointerUp pointerup", this._docClickDelegate);
            }
        },
        
        
        _popStateNavigation: function (evt, data) {
            if (data.pageUrl && this.model.enableFiltering)
                this._initializeFiltering($("div[data-url='" + data.pageUrl.replace('#', '') + "']"));
        },
        
        
        _anchorClickHandler: function (e) {
            if (this._scroll) {
                ej.blockDefaultActions(e);
                return false;
            }
        },
        
        _onResize: function () {
            var proxy = this;
            setTimeout(function () {
                proxy._setHeightWidth();
            }, ej.isAndroid() ? 200 : 0);
        },
        _onScrollStop: function (e) {
            ej.blockDefaultActions(e);
        },
        
        
        _createDelegates: function () {
            this._anchorClickDelegate = $.proxy(this._anchorClickHandler, this);
            this._keyup = $.proxy(this._onKeyUp, this);
            this._touchStartDelegate = $.proxy(this._onTouchStartHandler, this);
            this._touchEndDelegate = $.proxy(this._onTouchEndHandler, this);
            this._touchMoveDelegate = $.proxy(this._onTouchMoveHandler, this);
            this._resizeDelegate = $.proxy(this._onResize, this);
            this._popStateDelegate = $.proxy(this._popStateNavigation, this);
            this._docClickDelegate = $.proxy(this._docClick, this);
        },
        
        
        _wireEvents: function (remove, items) {
            var listItems = this._liEl || items;
            if (listItems) {
                this._createDelegates();
                var eventType = remove ? "unbind" : "bind";
                if (this.model.autoAdjustHeight) {
                    var evt = !ej.isDevice() && "onorientationchange" in window ? "orientationchange" : "resize";
                    ej.listenEvents([window], [evt], [this._resizeDelegate], remove, this);
                }
                ej.listenEvents([listItems.find('a'), this.element.find('.' + this._prefixClass + 'lv-input'), listItems, listItems],
                ["click", "keyup", ej.startEvent(), ej.cancelEvent()],
                [this._anchorClickDelegate, this._keyup, this._touchStartDelegate, this._touchMoveDelegate], remove, this);
                this._lContainer.on("scrollstop", $.proxy(this._onScrollStop, this));
                $('body')[eventType]('viewpopstate', this._popStateDelegate);
                if (this.model.enableFiltering)
                    this._initializeFiltering(this._lbEle);
            }
        },
        
        
        _initializeFiltering: function (element) {
            this._searchItems = $(element).find("." + this._prefixClass + "list");
            this._emptyFilterTextValue(element);
            element.find('.' + this._prefixClass + 'list[style*="display: none"]').show();
            this._elementText = [];
            for (var i = 0; i < this._searchItems.length; i++) {
                if ($(this._searchItems[i]))
                    this._elementText.push($.trim($(this._searchItems[i]).html().replace(new RegExp('<[^<]+\>', 'g'), "").toLowerCase()));
                else
                    this._elementText.push("");
            }
        },
        
        
        _onKeyUp: function (evt) {
            for (var i = 0; i < this._searchItems.length; i++) {
                if (this._elementText[i].indexOf(evt.target.value.toLowerCase()) == -1)
                    $(this._searchItems[i]).css("display", "none");
                else
                    $(this._searchItems[i]).css("display", "");
            }
        },
        
        
        _setModel: function (options) {
            var refresh = false;
            for (var prop in options) {
                var setModel = "_set" + prop.charAt(0).toUpperCase() + prop.slice(1);
				 if (this[setModel] || prop == "locale") {
                    switch (prop) {                       
						case "locale":
							if (ej.ListView.Locale[options[prop]]) {
								this.model.locale = options[prop];
								this._setCulture();	
                                this._setHeaderVal(this.model.id,this.model.headerTitle, this.model.headerBackButtonText);						
							}
                            break;
                        default:
                            this[setModel](options[prop]);
                    }
                }               
                else
                    refresh = true;
            }
            if (refresh)
                this._refresh();
        },
        
        
        _setTheme: function (value) {
            if (value) {
                this.model.theme = value;
                this._lbEle.removeClass("e-m-dark e-m-light e-default").addClass("e-m-" + this.model.theme);
                if (this.model.enableFiltering)
                    this.element.find('.' + this._prefixClass + 'text-input').ejmTextBox('model.theme', this.model.theme);
                if (this.model.showHeader)
                    this._lbEle.find('#' + this.model.id + "_header").ejmHeader('model.theme', this.model.theme);
                if (this.element.find('.' + this._prefixClass + 'childitem').length) {
                    $(this.element.find('.' + this._prefixClass + 'childitem')).removeClass("e-m-dark e-m-light e-default").addClass("e-m-" + this.model.theme);
                    var header = this.element.find('.' + this._prefixClass + 'childitem .' + this._prefixClass + 'header');
                    var proxy = this;
                    header.each(function (index, element) {
                        $(element).ejmHeader('model.theme', proxy.model.theme);
                    });
                }
            }
        },
        
        
        _setDataSource: function (dataSource, fieldSettings) {
            if (this._hasDataSource() && dataSource) {
                if (fieldSettings)
                    this.model.fieldSettings = fieldSettings;
                this._refresh();
            }
        },
        
        
        _hasDataSource: function () {
            return this.dataSource() && this.dataSource().length;
        },
        
        
        _getElement: function (childId) {
            return childId ? this.element.find('#' + childId) : this._lbEle;
        },
        
        
        _isEnable: function (item) {
            return item.hasClass(this._prefixClass + 'state-disabled') ? false : true;
        },
        //To refresh the control
        _refresh: function () {
            this._destroy();
            this.element.addClass(this._rootCSS);
            this._load();
        },
        //To clear the element
        _clearElement: function () {
            this.element.removeAttr("class style");
            this.element.empty().html(this._orgEle.html());
        },
        // all events bound using this._on will be unbind automatically
        _destroy: function () {
			if (this._prefixClass == "e-")
			   ej.listenEvents([window], ["resize"], [this._resizeDelegate], true, this);
            this._wireEvents(true);
            this._clearElement();
        },

        loadAjaxContent: function (urlVal, backButton) {
            var proxy = this;
            this._isFromAjax = true;
            this._renderChild(ej.getAttrVal(this._currentItem, 'data-childid', "page_" + parseInt(Math.random().toFixed(3) * 1000)));
            if (!$.support.pushstate || ej.isWindowsWebView())
            var loadData = { content: proxy._div, item: proxy._currentItem, index: $(proxy._currentItem).index(), text: $(proxy._currentItem).text(), url: proxy.model.ajaxSettings.url ? proxy.model.ajaxSettings.url : urlVal };
            if (this.model.ajaxBeforeLoad)
                this._trigger("ajaxBeforeLoad", loadData);
            var ajaxSettings = {
                cache: proxy.model.ajaxSettings.cache,
                async: proxy.model.ajaxSettings.async,
                type: proxy.model.ajaxSettings.type,
                contentType: proxy.model.ajaxSettings.contentType,
                url: ej.isWindowsWebView() ? urlVal : proxy.model.ajaxSettings.url ? proxy.model.ajaxSettings.url : urlVal,
                dataType: proxy.model.ajaxSettings.dataType,
                data: proxy.model.ajaxSettings.data,
                "successHandler": function (data) { //Ajax post success event handler
                    var content = ej.buildTag("div." + this._prefixClass + "content", (/<\/?body[^>]*>/gmi).test(data) ? data.split(/<\/?body[^>]*>/gmi)[1] : data || "");
                    proxy._div.append(proxy._container.append(content));
                    proxy._updateContent(proxy._currentItem, backButton);                    
					mobileApp =  proxy._prefixClass == "e-m-" ? App.angularAppName : false;
                    if ((mobileApp || ej.angular.defaultAppName))
                        ej.angular.compile(content);
                    var successData = { content: proxy._div, item: proxy._currentItem, index: $(proxy._currentItem).index(), text: $(proxy._currentItem).text(), url: proxy.model.ajaxSettings.url ? proxy.model.ajaxSettings.url : urlVal };
                    if (proxy.model.ajaxSuccess)
                        proxy._trigger("ajaxSuccess", successData);
                },
                "errorHandler": function (xhr, textStatus, errorThrown) {
                    var errorData = { "xhr": xhr, "textStatus": textStatus, "errorThrown": errorThrown, item: proxy._currentItem, index: $(proxy._currentItem).index(), text: $(proxy._currentItem).text(), url: proxy.model.ajaxSettings.url ? proxy.model.ajaxSettings.url : urlVal };
                    if (proxy.model.ajaxError)
                        proxy._trigger("ajaxError", errorData);
                },
                "completeHandler": function (data) {
                    var completeData = { content: proxy._div, item: proxy._currentItem, index: $(proxy._currentItem).index(), text: $(proxy._currentItem).text(), url: proxy.model.ajaxSettings.url ? proxy.model.ajaxSettings.url : urlVal };
                    if (proxy.model.ajaxComplete)
                        proxy._trigger("ajaxComplete", completeData);
                }
            };
            ej.sendAjaxRequest(ajaxSettings);
        },

        selectItem: function (index, childId) {
            if (index >= 0 && this._isEnable($(this._getElement(childId).find('li.' + this._prefixClass + 'list')[index]))) {
                this.setActive(index, childId);
                this._currentItem = $(this._getElement(childId).find('li.' + this._prefixClass + 'list')[index]);
                this._prevItem = this._currentItem;
                this._onTouchEndHandler();
            }
        },

        setActive: function (index, childId) {
            if (index >= 0) {
               var element = this._getElement(childId);
                if (this._isEnable($(element.find('li.' + this._prefixClass + 'list')[index])) && ej.getBooleanVal($(element.find('li.' + this._prefixClass + 'list')[index]), 'data-persistSelection', this.model.persistSelection)) {
                    element.find('li.' + this._prefixClass + 'list.' + this._prefixClass + 'state-active').removeClass(this._prefixClass + 'state-active').addClass(this._prefixClass + 'state-default');
                    this._currentItem = $(element.find('li.' + this._prefixClass + 'list')[index]);
                    this._prevItem = this._currentItem;
                    this._currentItem.removeClass(this._prefixClass + 'state-default').addClass(this._prefixClass + 'state-active');
                }
            }
        },

        deActive: function (index, childId) {
            if (index >= 0 && this._isEnable($(this._getElement(childId).find('li.' + this._prefixClass + 'list')[index])))
                $(this._getElement(childId).find('li.' + this._prefixClass + 'list')[index]).removeClass(this._prefixClass + 'state-active').addClass(this._prefixClass + 'state-default');
        },

        enableItem: function (index, childId) {
            if (index >= 0)
                $(this._getElement(childId).find('li.' + this._prefixClass + 'list')[index]).removeClass(this._prefixClass + 'disable').addClass(this._prefixClass + 'state-default').find('a').removeClass(this._prefixClass + 'disable').find('.' + this._prefixClass + 'lv-check').ejCheckBox("enable");
        },

        disableItem: function (index, childId) {
            if (index >= 0)
                $(this._getElement(childId).find('li.' + this._prefixClass + 'list')[index]).addClass(this._prefixClass + 'disable').removeClass(this._prefixClass + 'state-default').find('a').addClass(this._prefixClass + 'disable').find('.' + this._prefixClass + 'lv-check').ejCheckBox("disable");
        },

        removeCheckMark: function (index, childId) {
            this._removeIndex=index;
           var element = this._getElement(childId);
            if (index >= 0 && this._isEnable($(element.find('li.' + this._prefixClass + 'list')[index])))
                $(element.find('li.' + this._prefixClass + 'list')[index]).find('.' + this._prefixClass + 'lv-checkdiv').remove();
            else
                element.find('.' + this._prefixClass + 'lv-checkdiv').remove();
        },

        checkItem: function (index, childId) {
            if (index >= 0 && this._isEnable($(this._getElement(childId).find('li.' + this._prefixClass + 'list')[index])))
                this._setCheckboxValue($(this._getElement(childId).find('.' + this._prefixClass + 'lv-check')[index]), true);
			this._checkedValues.push(index);
			this.checkedIndices(this._checkedValues);
        },

        unCheckItem: function (index, childId) {
            if (index >= 0 && this._isEnable($(this._getElement(childId).find('li.' + this._prefixClass + 'list')[index])))
                this._setCheckboxValue($(this._getElement(childId).find('.' + this._prefixClass + 'lv-check')[index]), false);
			 this._checkedValues.splice(this._checkedValues.indexOf(index), 1);
        },

        checkAllItem: function (childId) {
            var proxy = this;
            this._getElement(childId).find('.' + this._prefixClass + 'lv-check').each(function (index, check) {
                if (proxy._isEnable($(proxy._getElement(childId).find('li.' + proxy._prefixClass + 'list')[index])))
                    proxy._setCheckboxValue($(check), true);
            });
			this._checkStatevalue();
        },

        unCheckAllItem: function (childId) {
            this.model.checkedIndices=[];
            var proxy = this;
            this._getElement(childId).find('.' + this._prefixClass + 'lv-check').each(function (index, check) {
                if (proxy._isEnable($(proxy._getElement(childId).find('li.' + proxy._prefixClass + 'list')[index])))
                    proxy._setCheckboxValue($(check), false);
            });
        },
		
        _checkStatevalue:function (){			
			this._currentItem = $(this._liEl);
			for(i=0; i<this._currentItem.length; i++){
			  index = this.element.find("li").index(this._currentItem[i]);
			  if (!this._hasValue(this._checkedValues, index))
                        this._checkedValues.push(index);
                    else
                        this._checkedValues.splice(this._checkedValues.indexOf(index), 1);}

				this.checkedIndices(this._checkedValues);
			    this.model.checkedIndices = this.checkedIndices();		
			
		},
		
        getActiveItem: function (childId) {
            return this._getElement(childId).find('li.' + this._prefixClass + 'list.' + this._prefixClass + 'state-active');
        },

        getActiveItemText: function (childId) {
            return this._getElement(childId).find('li.' + this._prefixClass + 'list.' + this._prefixClass + 'state-active').text();
        },

        getItemText: function (index, childId) {
            if (index >= 0)
                return $(this._getElement(childId).find('li.' + this._prefixClass + 'list')[index]).text();
        },

        getCheckedItems: function (childId) {
            if (childId != undefined)
                return this._getElement(childId).find('input.' + this._prefixClass + 'lv-check:checked').closest('li.' + this._prefixClass + 'list');
            else
                var checkedlist=[];
		        for(i=0; i<this.checkedIndices().length; i++){
			    var clist = this.element.find("li")[this.checkedIndices()[i]];
			    checkedlist.push(clist);
		   }
			   return checkedlist;
        },

        getCheckedItemsText: function (childId) {
            return $(this.getCheckedItems(childId)).map(function () { return $(this).text(); }).get();
        },

        hasChild: function (index, childId) {
            if (index >= 0)
                return this.element.find('#' + $(this._getElement(childId).find('li.' + this._prefixClass + 'list')[index]).attr('data-childid')).length ? true : false;
        },
        
        isChecked: function (index, childId) {
            if (index >= 0)
                return $(this._getElement(childId).find('li.' + this._prefixClass + 'list')[index]).find('input.' + this._prefixClass + 'lv-check').prop('checked');
        },

        showItem: function (index, childId) {
            if (index >= 0)
                $(this._getElement(childId).find('li.' + this._prefixClass + 'list')[index]).css('visibility', '');
        },

        hideItem: function (index, childId) {
            if (index >= 0)
                $(this._getElement(childId).find('li.' + this._prefixClass + 'list')[index]).css('visibility', 'hidden');
        },

        show: function (childId) {
            this._getElement(childId).css('visibility', '');
        },

        hide: function (childId) {
            this._getElement(childId).css('visibility', 'hidden');
        },

		_objectSplice:function(list,index){
		    for (var i = 0; i < list.length; i++) {
		        this.model.items.splice(index, 0, list[i]);
		    }
		},
		
        addItem: function (list, index, groupid) {
			if (typeof (list) == 'object') list = $(list);
            if (index >= 0) {
                if (!this._hasDataSource()) {
					if($('.e-list-container').find('ul').length == 0){
                    var ul = ej.buildTag('ul'), li = ej.buildTag('li');
                    $('.e-list-container').find('div:first').append(ul);
                    $('.e-list-container > div > ul').append(li);
                }
                    if (typeof (list) == 'object')
                        this._objectSplice(list, index);
                    else
                        this.model.items.splice(index, 0, this._getLiAttributes(list, null, null, groupid));
                    var items = this.model.items;
                }
                else {
                    if (typeof (list) == 'object') {
                        for (var i = 0; i < list.length; i++) 
                            this.dataSource().splice(index, 0, list[i]);
                    }
                    else 
                    this.dataSource().splice(index, 0, this._itemsObjectCollection($(list), null, null, groupid));
                    var items = this.dataSource();
                }
            }
            else
                this._orgEle.children().append(list);
            if (!this.model.enableGroupList)
                var $ul = $(this.element.find("ul:visible"));
            else
                var $ul = $(this.element.find('ul[data-ej-grouplisttitle= ' + groupid + ']'));
            if (!ej.isNullOrUndefined(this.jsRender)) {
				 var ele;
				if (typeof (list) == 'object') {
                    for (var i = 0; i < list.length; i++) 
	                    ele = $($(this.jsRender).render(items[index+i])).insertBefore($ul.children()[index]);
                }
                else 
                      ele = $($(this.jsRender).render(items[index])).insertBefore($ul.children()[index]);    
                ej.widget.init && ej.widget.init(ele);
				if($(list).attrNotStartsWith(/^data-ej-/).length>0) $(ele).addEleAttrs($($(list).attrNotStartsWith(/^data-ej-/)));
            }
            else {
                this._renderControl();
                if ($(this.element).find('.subpage').length > 1) {
                    $(this.element).find('.subpage:nth-child(2)').remove();
                }
            }
            this._processing($ul);
            this._liEl = this.element.find('li.' + this._prefixClass + 'list');
            if (this._initEJCheckBox){
			this._initEJCheckBox($ul);
		    if(this.model.renderTemplate) $(this.element.find('.' + this._prefixClass + 'lv-check').parent()).addClass(this._prefixClass+'template-checkmark');
			}
            this._setHeightWidth();
            this._wireEvents();
        },

            _processing: function ($ul) {
            $ul.find("li." + this._prefixClass + "firstitem").removeClass(this._prefixClass + "firstitem");
            $ul.find('li:first').addClass(this._prefixClass + "firstitem");
            $ul.find("li." + this._prefixClass + "lastitem").removeClass(this._prefixClass + "lastitem");
            $ul.find('li:last').addClass(this._prefixClass + "lastitem");
            eLi = $ul.find('li.' + this._prefixClass + 'list');
            eLi.removeEleEmptyAttrs();
            eLi.find('.' + this._prefixClass + 'chevron-right_01').removeEleEmptyAttrs();
            $ul.find('.' + this._prefixClass + 'lv-check').parent().addClass(this._prefixClass + 'lv-checkdiv');
            $ul.find('.' + this._prefixClass + 'lv-check').closest('li.' + this._prefixClass + 'list').addClass(this._prefixClass + 'list-check');
            $ul.find('.' + this._prefixClass + 'lv-input').closest('.' + this._prefixClass + 'lv-filter').addClass(this._prefixClass + 'lv-inputdiv');
        },

        removeItem: function (index, childId) {
            var removedItems = [];
            if (index >= 0) {
                element = this._getElement(childId);
                var child = $(element.find('li.' + this._prefixClass + 'list')[index]).attr('data-childid');
                if (this.element.find($('#' + child).length))
                    this.element.find($('#' + child)).remove();
                $(element.find('li.' + this._prefixClass + 'list')[index]).remove();
                var index = [parseInt(index)];
                this.dataSource(this.dataSource().filter(function (e, i) {
                    if (index.indexOf(i) != -1)
                        removedItems.push(e);
                    else
                        return true;
                }));
            }
        },

        clear: function () {
            this.element.empty().html();
            this._liEl = this.element.find('li.' + this._prefixClass + 'list');
        },

        getItemsCount: function (childId) {
            return this._getElement(childId).find('li.' + this._prefixClass + 'list').length;
        },
		
        getActiveItemData: function () {
            if (this.getActiveItem().attr("data-id"))
                return (this._generateData(this.dataSource().length ? typeof this.dataSource() == "string" ? eval(this.dataSource()) : this.dataSource() : this.model.items, this.getActiveItem().attr("data-id")));
        }
    });
	ej.VirtualScrollMode = {
        /** Supports to Virtual Scrolling mode with normal only */
        Normal: "normal",
        /** Supports to Virtual Scrolling mode with continuous only */
        Continuous: "continuous"
    };
})(jQuery, Syncfusion);;