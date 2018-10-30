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

    ej.widget("ejListView", "ej.ListView", {
        _rootCSS: "e-lv e-js",
        validTags:['div'],
        _prefixClass: "e-",
        defaults: {

            fieldSettings: {
                "navigateUrl": "navigateUrl",
                "href": "href",
                "enableAjax": "enableAjax",
                "preventSelection": "preventSelection",
                "persistSelection": "persistSelection",
                "text": "text",
                "enableCheckMark": "enableCheckMark",
                "checked": "checked",
                "primaryKey": "primaryKey",
                "parentPrimaryKey": "parentPrimaryKey",
                "imageClass": "imageClass",
                "imageUrl": "imageUrl",
                "childHeaderTitle": "childHeaderTitle",
                "childId": "childId",
                "childHeaderBackButtonText": "childHeaderBackButtonText",
                "renderTemplate": "renderTemplate",
                "templateId": "templateId",
                "attributes": "attributes",
                "mouseUp": "mouseUp",
                "mouseDown": "mouseDown",
                "groupID": "groupID",
                "id": "id"
            },

            mouseDown: null,

            mouseUp: null,

            items: []

        },



        dataTypes: {
            dataSource: "data",
            query: "data",
            itemRequestCount: "number",
            totalItemsCount: "number",
            fieldSettings: "data",
            renderMode: "enum",
            theme: "enum",
            enablePersistence: "boolean"
        },
        observables: ["selectedItemIndex", "dataSource"],
        selectedItemIndex: ej.util.valueFunction("selectedItemIndex"),
        dataSource: ej.util.valueFunction("dataSource"),
		checkedIndices: ej.util.valueFunction("checkedIndices"),

        _tags: [{
            tag: "items",
            attr:
                ["navigateUrl",
                "href",
                "text",
                "checked",
                "primaryKey",
                "parentPrimaryKey",
                "imageClass",
                "imageUrl",
                "childHeaderTitle",
                "childId",
                "childHeaderBackButtonText",
                "mouseUP",
                "mouseDown",
                "attributes",
                "renderTemplate",
                "templateId",
                "enableAjax",
                "preventSelection",
                "persistSelection",
                "enableCheckMark",
                "attributes"
                ],
            content: "template"
        }
        ],


        _init: function (options) {
            this._options = options;
            this._totalitemscount = options["totalItemsCount"];
            this._preventDefaultException = { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ };
            this._storedContent = [];
            this._storedTemplate = [];
            this._tempContent = $("body");
            this._touchStart = this.model.mouseDown;
            this._touchEnd = this.model.mouseUp;
            this._oldEle = this.element.clone();
            if (this._oldEle.find("ul").length)
                this.model.items = [];
            this._indexVal = 0;
			this._setCulture();
			this._updateModelItems();
			this._dataUrl = this.model.dataSource;
			if (!ej.isNullOrUndefined(this._dataUrl.dataSource)) this._rawList =  ej.DataManager(this._dataUrl.dataSource.json).executeLocal(ej.Query().take(this.model.totalItemsCount).clone());
            this._load();
            var navObj = this.element.closest(".e-nb.e-js");
            this._isInsideNavigation = navObj.length;
            if (this._isInsideNavigation)
                this._nearestND = navObj.ejNavigationDrawer("instance");
            this._responsive();
        },

        _responsive: function () {
			$(window).on("resize", $.proxy(this._resizeHandler, this));
        },

        _resizeHandler: function () {
			if ($(this.element).parent().width() == null && this.model == null) {
				$(this.element).width(this.width);
			}
			else if($(this.element).parent().width()<=this.model.width) {
				this.width = $(this.element).parent().width();
				$(this.element).width(this.width);
			}
			else
				$(this.element).width(this.model.width);
        },

        _itemsObjectCollection: function (element, primaryKey, parentPrimaryKey, groupid) {
            if (ej.getAttrVal(element, "data-ej-rendertemplate")) {
                var tempid = this._tempContent.find('#' + ej.getAttrVal(element, "data-ej-templateid"));
                if (tempid.length) {
                    var ele = tempid.remove();
                    this._storedTemplate[this._indexVal] = ele[0].nodeName && ele[0].nodeName.toLowerCase() == "script" ? ej.getClearString(ele[0].innerHTML) : ele[0].outerHTML;
                }
                else if (!this._storedTemplate[this._indexVal])
                    if ($(element)[0].innerHTML)
                        this._storedTemplate[this._indexVal] = $(element)[0].innerHTML;
                    else if (this._storedTemplate[this._indexVal] && this._tempContent.find('#' + template).length) {
                        var ele = this._tempContent.find('#' + template).remove();
                        ele = ele[0].nodeName && ele[0].nodeName.toLowerCase() == "script" ? ej.getClearString(ele[0].innerHTML) : ele[0].outerHTML;
                        this._storedTemplate = ej._pushValue(this._storedTemplate, ele, this._indexVal);
                    }
                this._indexVal++;
            }
          return  this._getLiAttributes(element, primaryKey, parentPrimaryKey, groupid);
        },

        _getLiAttributes: function (element, primaryKey, parentPrimaryKey, groupid) {
            var item = {};
            item.groupID = groupid ? groupid : "",
            item.text = ej.getAttrVal(element, "data-ej-text") ? ej.getAttrVal(element, "data-ej-text") : this._getText(element);
            item.preventSelection = ej.getAttrVal(element, "data-ej-preventselection");
            item.persistSelection = ej.getAttrVal(element, "data-ej-persistselection");
            item.navigateUrl = ej.getAttrVal(element, "data-ej-navigateurl");
            item.href = ej.getAttrVal(element, "data-ej-href");
            item.checked = ej.getAttrVal(element, "data-ej-checked");
            item.primaryKey = ej.getAttrVal(element, "data-ej-primarykey", primaryKey);
            item.parentPrimaryKey = ej.getAttrVal(element, "data-ej-parentprimarykey", parentPrimaryKey);
            item.imageClass = ej.getAttrVal(element, "data-ej-imageclass");
            item.imageUrl = ej.getAttrVal(element, "data-ej-imageurl");
            item.childHeaderTitle = ej.getAttrVal(element, "data-ej-childheadertitle");
            item.childId = item.href ? ej.getAttrVal(element, "data-ej-childid") ? ej.getAttrVal(element, "data-ej-childid") : ("page_" + parseInt(Math.random().toFixed(3) * 1000)) : "";
            item.childHeaderBackButtonText = ej.getAttrVal(element, "data-ej-childheaderbackbuttontext");
            item.mouseUp = ej.getAttrVal(element, "data-ej-mouseUp");
            item.mouseDown = ej.getAttrVal(element, "data-ej-mouseDown");
            if (this.element.find('li').length > 0) item.attributes = (typeof(element)=="object")? element.attrNotStartsWith(/^data-ej-/):$(element).attrNotStartsWith(/^data-ej-/);
            item.renderTemplate = ej.getAttrVal(element, "data-ej-rendertemplate");
            item.templateId = this._storedTemplate[this._indexVal - 1],
            item.enableAjax = ej.getAttrVal(element, "data-ej-enableajax");
            item.enableCheckMark = ej.getAttrVal(element, "data-ej-enablecheckmark");
            return item;
        },



        _renderLists: function () {
            var list = ej.buildTag("li", "", {}, {
                "class": this._prefixClass + "user-select " + this._prefixClass + "list " + this._prefixClass + "state-default{{if " + this.model.fieldSettings['primaryKey'] + " || " + this.model.fieldSettings['enableAjax'] + " || " + this.model.enableAjax + "}} " + this._prefixClass + "arrow{{/if}}{{if " + this.model.fieldSettings['imageClass'] + "}} " + this._prefixClass + "margin{{else}}{{if " + this.model.fieldSettings['imageUrl'] + "}} " + this._prefixClass + "margin{{/if}}{{/if}}",
                "data-childid": "{{if " + this.model.fieldSettings['primaryKey'] + "}}child{{>" + this.model.fieldSettings['primaryKey'] + "}}{{else " + this.model.fieldSettings['childId'] + "}}{{>" + this.model.fieldSettings['childId'] + "}}{{else}}{{/if}}",
                "data-childheadertitle": "{{>" + this.model.fieldSettings['childHeaderTitle'] + "}}",
                "data-childheaderbackbuttontext": "{{>" + this.model.fieldSettings['childHeaderBackButtonText'] + "}}",
                "data-preventSelection": "{{>" + this.model.fieldSettings['preventSelection'] + "}}",
                "data-persistSelection": "{{>" + this.model.fieldSettings['persistSelection'] + "}}",
                "data-navigateUrl": "{{>" + this.model.fieldSettings['navigateUrl'] + "}}",
                "data-loadajax": "{{>" + this.model.fieldSettings['enableAjax'] + "}}",
                "data-href": '{{>' + this.model.fieldSettings['href'] + '}}{{:~_checkAjaxUrls()}}',
                "data-checked": '{{>' + this.model.fieldSettings['checked'] + '}}',
                "data-templateid": "{{>" + this.model.fieldSettings['renderTemplate'] + "}}",
                "data-mouseup": "{{>" + this.model.fieldSettings['mouseUp'] + "}}",
                "data-mousedown": "{{>" + this.model.fieldSettings['mouseDown'] + "}}",
                "data-id": "{{>" + this.model.fieldSettings['id'] + "}}"
            });
            if (this.model.renderTemplate) {
               if (this._hasDataSource() && this._template){
                    var check = this._createCheckBox();
                    list[0].innerHTML = this._template+"{{if " + this.model.fieldSettings['enableCheckMark'] + " !== undefined}}{{if " + this.model.fieldSettings['enableCheckMark'] + ".toString() == 'false' ? " + this.model.fieldSettings['enableCheckMark'] + " : " + this.model.enableCheckMark + "}}" + check[0].outerHTML + "{{/if}}{{else}}{{if " + this.model.enableCheckMark + "}}" + check[0].outerHTML + "{{/if}}{{/if}}";
            }
            }
            else {
                var linkTag = ej.buildTag("a", "", {}, { "class": this._prefixClass + "chevron-right_01 " + this._prefixClass + "remove-shadow{{if " + this.model.fieldSettings['imageClass'] + "}} " + this._prefixClass + "margin{{else}}{{if " + this.model.fieldSettings['imageUrl'] + "}} " + this._prefixClass + "margin{{/if}}{{/if}}{{if " + this.model.fieldSettings['primaryKey'] + " || " + this.model.fieldSettings['enableAjax'] + " || " + this.model.enableAjax + "}} " + this._prefixClass + "fontimage e-icon{{/if}}", "href": (ej.browserInfo().name == "msie" && ej.browserInfo().version < 9 ? "" : "{{if " + this.model.fieldSettings['navigateUrl'] + " == '' || " + this.model.fieldSettings['navigateUrl'] + " == undefined }}{{else}}{{:" + this.model.fieldSettings['navigateUrl'] + "}}{{/if}}") }); 
                (ej.browserInfo().name == "msie" && ej.browserInfo().version < 9) && linkTag.removeAttr('href');
				var span = ej.buildTag("span", "{{>" + this.model.fieldSettings['text'] + "}}", {}, { "class": this._prefixClass + "list-text " + this._prefixClass + "rel " + this._prefixClass + "user-select{{if " + this.model.fieldSettings['imageClass'] + "}} " + this._prefixClass + "text{{else}}{{if " + this.model.fieldSettings['imageUrl'] + "}} " + this._prefixClass + "text{{/if}}{{/if}}" });
                var imgClass = ej.buildTag("div", "", {}, { 'class': this._prefixClass + "list-img " + this._prefixClass + "rel " + this._prefixClass + "user-select {{>" + this.model.fieldSettings['imageClass'] + "}}" });
                var check = this._createCheckBox();
                if (this.model.renderMode == "windows" && ej.isMobile())
                    linkTag[0].innerHTML = "{{if !" + this.model.fieldSettings['primaryKey'] + "}}{{if " + this.model.fieldSettings['enableAjax'] + " == undefined || " + this.model.fieldSettings['enableAjax'] + ".toString() == 'false'}}{{if !" + this.model.fieldSettings['navigateUrl'] + "}}{{if " + this.model.fieldSettings['enableCheckMark'] + " !== undefined}}{{if " + this.model.fieldSettings['enableCheckMark'] + ".toString() == 'false' ? " + this.model.fieldSettings['enableCheckMark'] + " : " + this.model.enableCheckMark + "}}" + check[0].outerHTML + "{{/if}}{{else}}{{if " + this.model.enableCheckMark + "}}" + check[0].outerHTML + "{{/if}}{{/if}}{{/if}}{{/if}}{{/if}}" + "{{if " + this.model.fieldSettings['imageClass'] + "}}" + imgClass[0].outerHTML + "{{else}}{{if " + this.model.fieldSettings['imageUrl'] + "}}{{:~_checkImgUrls()}}{{/if}}{{/if}}" + span[0].outerHTML;
                else
                    linkTag[0].innerHTML = "{{if " + this.model.fieldSettings['imageClass'] + "}}" + imgClass[0].outerHTML + "{{else}}{{if " + this.model.fieldSettings['imageUrl'] + "}}{{:~_checkImgUrls()}}{{/if}}{{/if}}" + span[0].outerHTML + "{{if !" + this.model.fieldSettings['primaryKey'] + "}}{{if " + this.model.fieldSettings['enableAjax'] + " == undefined || " + this.model.fieldSettings['enableAjax'] + ".toString() == 'false'}}{{if !" + this.model.fieldSettings['navigateUrl'] + "}}{{if " + this.model.fieldSettings['enableCheckMark'] + " !== undefined}}{{if " + this.model.fieldSettings['enableCheckMark'] + ".toString() == 'false' ? " + this.model.fieldSettings['enableCheckMark'] + " : " + this.model.enableCheckMark + "}}" + check[0].outerHTML + "{{/if}}{{else}}{{if " + this.model.enableCheckMark + "}}" + check[0].outerHTML + "{{/if}}{{/if}}{{/if}}{{/if}}{{/if}}";

                list[0].innerHTML = "{{if " + this.model.fieldSettings['renderTemplate'] + " == undefined || " + this.model.fieldSettings['renderTemplate'] + ".toString() == 'false'}}" + linkTag[0].outerHTML + "{{else}}{{:templateId}}{{/if}}";
            }
            if (this.model.renderMode == "ios7") {
                var innerDiv = ej.buildTag("div." + this._prefixClass + "list-div");
                innerDiv[0].innerHTML = list[0].innerHTML;
                list.empty().append(innerDiv);
            }
            return list;
        },


        _updateContent: function (currentItem, backButton) {
            var proxy = this;
            var $curIte = $(currentItem), childid = $curIte.attr('data-childid');
            var id = this._isInsideNavigation && currentItem.attr('data-href') ? $('body').find($("#" + childid)) : this.element.find($("#" + childid));
            if (id.length) {
                var hdr = this.element.find('#' + childid + '_header');
                if (this.model.enableFiltering)
                    this._initializeFiltering($(id));
                var title = $curIte.attr('data-childheadertitle') == undefined ? currentItem.text() : $curIte.attr('data-childheadertitle');
                if (hdr.hasClass('e-header')) {
                    this._setHeaderVal(childid, title, backButton);
                }
                id.attr("data-hdr-title", title).attr("data-hdr-bckbtn", backButton);
                this._initEJCheckBox(id);
                if (this._isInsideNavigation && currentItem.attr('data-href') && this._nearestND.model.contentId) {
                    if ($('body').find('.e-lv.subpage.e-childitem')) {
                        $("#" + this._nearestND.model.contentId).empty().append(id.show());
                    }
                }
                else {
                    $curIte.closest('.subpage').hide();
                    id.show();
					this._childContainer = id.find('.' + this._prefixClass + 'list-container');
					this._childContainer.ejScroller({
                        height: this._childContainer.height(),
                        width: 0,
                        scrollerSize: 20
                    });
			        this.scrollerObj = this._childContainer.ejScroller("instance");
					this._containerHeight = this.element.height() - ej.getDimension(this._lbEle.find('.' + this._prefixClass + 'lv-inputdiv'), 'outerHeight')-ej.getDimension(this._lbEle.find('.' + this._prefixClass + 'header'), 'outerHeight');
					if (this.model.height !== null) {
				        if (this._childContainer.height() > this._containerHeight) {
			                this._refreshScroller(this._childContainer,true);
					    }
				    }
				    if (this.scrollerObj) {
						this.scrollerObj.refresh();
						$(this.scrollerObj.element).find(".e-vhandlespace").css("height",($(this.scrollerObj.element).find(".e-vhandlespace").height() - 1));
					}
                    $(this.element.children()[0]).removeClass("e-slideright");
                    id.addClass("e-slideleft");
                }
            }
        },



        _renderHeader: function (id, showbutton, title, backtext) {
            var header = ej.buildTag("div", "", {}, { "id": id + "_header", "class": "e-header e-box" });
            if (showbutton) {
                header.append("<span class='e-hicon e-icon e-chevron-left_01'></span>");
                header.append("<div class='e-btn-text'>" + (backtext ? backtext : "Back") + "</div>");
            }
            else
                header.append("<div class='e-htitle'>" + title + "</div>");
            return header;
        },
        _setHeaderVal: function (id, title, backtext) {
            this._onBackButtonDelegate = $.proxy(this._onBackButtonClick, this);
            ej.listenTouchEvent($("#" + id + "_header"), ej.endEvent(), this._onBackButtonDelegate, false, this);
            var backButtonText = this.model.showHeaderBackButton ? this.model.headerBackButtonText ? this.model.headerBackButtonText : backtext : backtext;
            $("#" + id + "_header").find(".e-btn-text").text(backtext ? backButtonText : "Back");
            $("#" + id + "_header").find(".e-htitle").text(title);
        },
        _onBackButtonClick: function (e) {
            this.element.find(".e-slideleft").removeClass("e-slideleft");
            this.element.children(":visible").hide();
            $(this.element.children()[0]).show();
            $(this.element.children()[0]).addClass("e-slideright");
            if (this.model.enableFiltering)
            this._initializeFiltering($(this.element.children()[0]));
     },


        _returnData: function () {
            var checkedItem = this._currentItem.closest('ul.e-list-hdr').find('.e-chkbox-wrap[aria-checked="true"]').closest("li");
            var elementId = ej.getAttrVal(this._currentItem, "data-id", this._currentItem.text());
            var items = this.dataSource().length ? typeof this.dataSource() == "string" ? eval(this.dataSource()) : this.dataSource() : this.model.items;
            return {
                hasChild: this._currentItem.attr("data-childid") && this._currentItem.attr('data-childid').length > 0 ? (this.element.find('#' + this._currentItem.attr('data-childid')).length ? true : false) : false,
                item: this._currentItem,
                text: this._currentItem.text(),
                index: this._currentItem.index(),
                isChecked: (!ej.isNullOrUndefined(this._eventtrigger)) ? ((this._eventtrigger.hasClass("e-chk-image e-icon") || this.model.mouseDown) ? (this._currentItem.find('input.' + this._prefixClass + 'lv-check').prop('checked') == true ? false : true) : (this._currentItem.find('input.' + this._prefixClass + 'lv-check').prop('checked') == true ? true : false)) : false,
                checkedItems: checkedItem.length ? checkedItem : null,
                checkedItemsText: $(checkedItem).map(function () { return $(this).text(); }).get(),
                itemData: this._generateData(items, elementId),
                checkedValues: this.checkedIndices()  
            };
        },
        _initEJCheckBox: function (ul) {
            var liItems = ul.find("li");
            var count = liItems.length;
            for (i = 0; i < count; i++) {
                if (this.model.enablePersistence || this.model.checkedIndices.length > 0 ) {   
                    var localItems = this.model.checkedIndices;
                    var checked = this._hasValue(localItems, i);
                }
                else {
                    var checked = ej.getAttrVal($(liItems[i]), "data-checked");
                    var checked = checked == "true" ? true : false;
                }
                $($(liItems[i]).find(".e-lv-check")).ejCheckBox({ checked: checked });
            }
            ul.find('.e-lv-checkdiv').removeClass("e-lv-checkdiv")
            ul.find('.e-lv-check').parent().addClass("e-lv-checkdiv")
        },
        _triggerStartEvent: function (data) {
			if (ej.browserInfo().name == "msie" && ej.browserInfo().version == 8)
				this.model.mouseDown = this._touchStart;
			else this.model.mouseDown = ej.getAttrVal(this._currentItem, 'data-mousedown', this._touchStart);
			var lbCheck = this._currentItem.find('.' + this._prefixClass + 'lv-check');
			$(lbCheck).closest('.e-chkbox-wrap').attr('aria-checked', data.isChecked);
			lbCheck.ejCheckBox({ checked: data.isChecked });
            this._trigger("mouseDown", data);
        },

        _triggerEndEvent: function (data, evt) {
			if (ej.browserInfo().name == "msie" && ej.browserInfo().version == 8)
				this.model.mouseUp = this._touchEnd;
            else this.model.mouseUp = ej.getAttrVal(this._currentItem, 'data-mouseup', this._touchEnd);
            this.selectedItemIndex(this._currentItem.index());
            if (this.model.enablePersistence || this.model.enableCheckMark) {
                var state = this._currentItem.find('.e-chkbox-wrap'), index = this._currentItem.index();
                if (state.attr('aria-checked') == 'true' || (index||$(evt.target).parent().hasClass('e-chk-inact'))) {
                    if (!this._hasValue(this._checkedValues, index))
                        this._checkedValues.push(index);
                    else
                        this._checkedValues.splice(this._checkedValues.indexOf(index), 1);
                }
                else
                    this._checkedValues.splice(this._checkedValues.indexOf(index), 1);
            }
            this.checkedIndices(this._checkedValues);
            if (this.model.mouseUp)
                this._trigger("mouseUp", data);
        },
        _createFilterDiv: function () {
            return ej.buildTag('div.e-lv-filter', ej.buildTag('input.e-lv-input', "", {}, { 'type': 'text', 'placeholder': 'search' }));
        },
        _emptyFilterTextValue: function (element) {
            element.find('.e-lv-input').val("");
        },
        _createListDiv: function (childId) {
            this._div = ej.buildTag("div#" + childId + "." + this._rootCSS + " subpage e-childitem e-ajaxchild", (this.model.showHeader && this._isInsideNavigation && !this._nearestND.model.contentId) ? this._renderHeader(childId, true, this._currentItem.text()) : "");
        },
        _createCheckBox: function () {
            return ej.buildTag("input.e-lv-check", "", {}, { "type": "checkbox", });
        },
        _toggleCheckboxValue: function (lbCheck) {
            lbCheck.ejCheckBox({ checked: ($(lbCheck).closest('.e-chkbox-wrap')).attr('aria-checked') == "true" ? false : true });
        },
        _setCheckboxValue: function (element, val) {
            element.ejCheckBox({ checked: val });
        },
        _convertToRelativeUrl: function (url) {
            return url;
        },
		_setCulture: function () {
            this._localizedLabels = this._getLocalizedLabels();
            if (!ej.isNullOrUndefined(this._options)) {
                if (!ej.isNullOrUndefined(this._options.headerTitle)) this._localizedLabels.headerTitle = this._options.headerTitle;
                if (!ej.isNullOrUndefined(this._options.headerBackButtonText)) this._localizedLabels.headerBackButtonText = this._options.headerBackButtonText;
            }
            this.model.headerTitle = this._localizedLabels.headerTitle;
            this.model.headerBackButtonText = this._localizedLabels.headerBackButtonText;
        },
        _getLocalizedLabels: function () {
            return ej.getLocalizedConstants(this.sfType, this.model.locale);
        },
		
    });
	 ej.ListView.Locale = ej.ListView.Locale || {};
        ej.ListView.Locale["default"] = ej.ListView.Locale["en-US"] = {
            headerTitle: "Title",
            headerBackButtonText: "",
        };
    $.extend(true, ej.ListView.prototype, ej.ListViewBase.prototype);
})(jQuery, Syncfusion);