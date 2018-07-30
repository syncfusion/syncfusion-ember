/**
* @fileOverview Plugin to style the Html UL elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    ej.widget("ejListBox", "ej.ListBox", {

        element: null,
        _ignoreOnPersist: ["dataSource", "query", "itemRequestCount", "fields", "create", "change", "select", "unselect", "itemDragStart", "itemDrag", "itemDragStop", "itemDrop", "checkChange", "destroy", "actionComplete", "actionFailure", "actionSuccess", "actionBegin", "itemDropped", "selected"],
        model: null,
        validTags: ["ul"],
        _setFirst: false,
        _rootCSS: "e-listbox",
        defaults: {
            itemsCount: null,
            totalItemsCount: null,
            dataSource: null,
            query: ej.Query(),
            itemRequestCount: 5,
            itemHeight:null,
            fields: {
                id: null,
                text: null,
                imageUrl: null,
                imageAttributes: null,
                spriteCssClass: null,
                htmlAttributes: null,
                tooltipText: null,
                selectBy: null,
                checkBy: null,
                groupBy: null,
                tableName: null,

                //deprecated field properties
                selected: null,
                category: null,
                toolTipText: null
            },
            height: "auto",
            width: "200",
            template: null,
            text: "",
            selectedIndex: null,
            checkedIndices: [],
            selectedIndices: [],
            cascadeTo: null,
            value: "",
            cssClass: "",
            targetID: null,
            htmlAttributes: {},
            showRoundedCorner: false,
            enableRTL: false,
            enabled: true,
            showCheckbox: false,
            allowVirtualScrolling: false,
            virtualScrollMode: "normal",
            enablePersistence: false,
            allowMultiSelection: false,
            allowDrag: false,
            allowDrop: false,
            enableIncrementalSearch: false,
            enableWordWrap:true,
            caseSensitiveSearch: false,
            loadDataOnInit: true,
            create: null,
            change: null,
            select: null,
            unselect: null,
            itemDragStart: null,
            itemDrag: null,
            itemDragStop: null,
            itemDrop: null,
            checkChange: null,
            destroy: null,
            actionComplete: null,
            actionSuccess: null,
            actionBeforeSuccess:null,
            focusIn:null,
            focusOut:null,
            actionFailure: null,
            actionBegin: null,
			cascade: null,
            sortOrder: "none",

            //Deprecated Members
            enableVirtualScrolling: false,
            checkAll: false,
            uncheckAll: false,
            enableLoadOnDemand: false,
            itemRequest: null,
            allowDragAndDrop: undefined,
            selectedItemIndex: null,
            enableItemsByIndex: null,
            checkItemsByIndex: null,
            disableItemsByIndex: null,
            uncheckItemsByIndex: null,
            itemDropped: null,
            selected: null,
            selectIndexChanged: null,
            selectedItems: [],
            checkedItems: [],
            checkedItemlist: [],
            selectedItemlist: [],
        },
        dataTypes: {
            cssClass: "string",
            itemsCount: "number",
            itemRequestCount: "number",
            allowDrag: "boolean",
            allowDrop: "boolean",
            enableWordWrap:"boolean",
            enableIncrementalSearch: "boolean",
            caseSensitiveSearch: "boolean",
            template: "string",
            targetID: "string",
            cascadeTo: "string",
            showRoundedCorner: "boolean",
            enableRTL: "boolean",
            enablePersistence: "boolean",
            enabled: "boolean",
            allowMultiSelection: "boolean",
            dataSource: "data",
            query: "data",
            checkedIndices: "data",
            selectedIndices: "data",
            htmlAttributes: "data",
            loadDataOnInit: "boolean",
            showCheckbox: "boolean",
            sortOrder: "enum"
        },
        observables: ["value", "dataSource"],
        value: ej.util.valueFunction("value"),
        dataSource: ej.util.valueFunction("dataSource"),
        enable: function () {
            if (this.listContainer.hasClass("e-disable")) {
                this.target.disabled = false;
                this.model.enabled = this.model.enabled = true;
                this.element.removeAttr("disabled");
                this.listContainer.removeClass('e-disable');
                if (this.model.allowMultiSelection) this.listContainer.removeClass("e-disable");
                var scroller = this.listContainer.find(".e-vscrollbar,.e-hscrollbar");
                if (this.model.showCheckbox) { 
                    var items = this.listContainer.find('li:not(.e-disable)');
                    items.find(".listcheckbox").ejCheckBox("enable");
                }
                if (scroller.length > 0)
                    this.scrollerObj.enable();
            }
        },
        disable: function () {
            if (!this.listContainer.hasClass("e-disable")) {
                this.target.disabled = true;
                this.model.enabled = this.model.enabled = false;
                this.element.attr("disabled", "disabled");
                this.listContainer.addClass('e-disable');
                if (this.model.allowMultiSelection) this.listContainer.addClass("e-disable");
                var scroller = this.listContainer.find(".e-vscrollbar,.e-hscrollbar");
                if (this.model.showCheckbox) this.element.find(".listcheckbox").ejCheckBox("disable");
                if (scroller.length > 0)
                    this.scrollerObj.disable();
            }
        },
        selectItemByIndex: function (index) {            
            var prevSelectedItem = this._lastEleSelect = this.model.selectedIndex, listitems= (this.listitems)?this.listitems:this.listitem;
			if(index!=0) index=parseInt(index);       
            if (index != null) {				
                if ((index > this.element.find("li:not('.e-ghead')").length) || (index < 0) || ((1 / index) == -Infinity))
					 index=this.model.selectedIndex;                    				
                var activeitem = $(this.element.find("li:not('.e-ghead')")[index]);
                if (!activeitem.hasClass("e-select")) {
                    this._activeItem = index;
                    this.element.children("li").removeClass("e-select");
                    this._selectedItems = [];
                    this.model.selectedIndices = [];
                    activeitem.addClass("e-select");
                    if (this.model.showCheckbox) {
                        if (!($(activeitem).find('.listcheckbox').ejCheckBox('isChecked'))) {
                            $(activeitem).find('.listcheckbox').ejCheckBox('option', 'checked', true);
                            activeitem.removeClass("e-select");
                            if (!($.inArray(this._activeItem, this._checkedItems) > -1)) this._checkedItems.push(this._activeItem);
                            if (!($.inArray(activeitem[0], this.model.checkedIndices) > -1)) this.model.checkedIndices.push(this._activeItem);
                        }
                    }
                    this._selectedItems.push(activeitem);
                    this.model.selectedIndices.push(index);
                    var selectData = this._getItemObject(activeitem, null);
                    selectData["isInteraction"] = false;
                    if (this.model.select)
                        this._trigger('select', selectData);
                }
            }
            if (this.model.cascadeTo) {
                this._activeItem = index;
                this._cascadeAction();
            }
            this._setSelectionValues()._onlistselection(prevSelectedItem, this._activeItem);;
        },
        checkItemByIndex: function (index) {
            if (typeof (index) == "number")
                this.checkItemsByIndices(index.toString());
        },
        uncheckItemByIndex: function (index) {
            if (typeof (index) == "number")
                this.uncheckItemsByIndices(index.toString());
        },
        checkItemsByIndices: function (index) {
            if ((ej.isNullOrUndefined(index))) return false;
            var checkitems = index.toString().split(',');
            if (checkitems.length > 0) {
                for (var i = 0; i < checkitems.length; i++) {
                    if (checkitems[i] != null) {
                        this._activeItem = parseInt(checkitems[i]);
                        if (this._activeItem < 0) this._activeItem = 0;
                        var activeitem = $(this.element.children("li:not('.e-ghead')")[this._activeItem]);
                        if (this.model.showCheckbox) {
                            if (!($(activeitem).find('.listcheckbox').ejCheckBox('isChecked'))) {
                                $(activeitem).find('.listcheckbox').ejCheckBox('option', 'checked', true);
                                this.checkedStatus = true;
                                if (!($.inArray(this._activeItem, this._checkedItems) > -1)) this._checkedItems.push(this._activeItem);
                                if (!($.inArray(activeitem[0], this.model.checkedIndices) > -1)) this.model.checkedIndices.push(this._activeItem);
                                var checkData = this._getItemObject(activeitem, null);
                                checkData["isInteraction"] = false;
                                if (this.model.checkChange)
                                    this._trigger('checkChange', checkData);
                            }
                        }
                    }
                }
            }
            this._setSelectionValues();
        },
        uncheckItemsByIndices: function (value) {
            if ((ej.isNullOrUndefined(value))) return false;
            var checkitems = value.toString().split(',');
            if (checkitems.length > 0) {
                for (var i = 0; i < checkitems.length; i++) {
                    if (checkitems[i] != null) {
                        var index = parseInt(checkitems[i]);
                        var unselectitem = $(this.element.children("li:not('.e-ghead')")[parseInt(index)]);
                        if (this.model.showCheckbox) {
                            if (($(unselectitem).find('.listcheckbox').ejCheckBox('isChecked'))) {
                                $(unselectitem).find('.listcheckbox').ejCheckBox('option', 'checked', false);
                                this.checkedStatus = false;
                                var itemIndex = $.inArray(index, this.model.checkedIndices);
                                if ($.inArray(index, this._checkedItems) > -1) this._checkedItems.splice(itemIndex, 1);
                                if (itemIndex > -1) this.model.checkedIndices.splice(itemIndex, 1);
                                var unselectData = this._getItemObject(unselectitem, null);
                                unselectData["isInteraction"] = false;
                                if (this.model.checkChange)
                                    this._trigger('checkChange', unselectData);
                            }
                        }
                    }
                }
            }
            this._setSelectionValues();
        },
        selectAll: function () {
            if (!this.model.showCheckbox && this.model.allowMultiSelection) {
                var activeItem = this.element.children("li:not('.e-ghead')");
                for (var i = 0; i < activeItem.length; i++) {
                    if (!$(activeItem[i]).hasClass("e-select") && !$(activeItem[i]).hasClass("e-disable")) {
                        $(activeItem[i]).addClass("e-select");
                        this._selectedItems.push($(activeItem[i]));
                        this.model.selectedIndices.push(i);
                        var selectData = this._getItemObject(activeItem, null);
                        selectData["isInteraction"] = false;
                        if (this.model.select)
                            this._trigger('select', selectData);
                    }
                }
            }
            this._setSelectionValues();
        },
        //Deprecated Method
        unSelectAll: function () { this.unselectAll(); },
        unselectAll: function () {
            if (!this.model.showCheckbox)
                this._removeListHover();
            this._setSelectionValues();
            return this;
        },
        //deprecated function
        selectItemsByIndex: function (value) {
            this.selectItemsByIndices(value);
        },
        selectItemsByIndices: function (value) {
            if (ej.isNullOrUndefined(value)) return false;
            var selectitems = value.toString().split(',');
            if (this.model.allowMultiSelection) {
                for (var i = 0; i < selectitems.length; i++) {
                    if (selectitems[i] != null && !isNaN(parseInt(selectitems[i])) && selectitems[i] < this.element.children('li').length) {
                        var index = parseInt(selectitems[i]);
                        this._activeItem = index;
                        var activeitem = $(this.element.children("li:not('.e-ghead')")[this._activeItem]);
                        if (!activeitem.hasClass("e-select")) {
                            activeitem.addClass("e-select");
                            this._selectedItems.push(activeitem);
                            this.model.selectedIndices.push(index);
                            if (this.model.showCheckbox) {
                                if (!($(activeitem).find('.listcheckbox').ejCheckBox('isChecked'))) {
                                    $(activeitem).find('.listcheckbox').ejCheckBox('option', 'checked', true);
                                    activeitem.removeClass("e-select");
                                    if (!($.inArray(this._activeItem, this._checkedItems) > -1)) this._checkedItems.push(this._activeItem);
                                    if (!($.inArray(activeitem[0], this.model.checkedIndices) > -1)) this.model.checkedIndices.push(this._activeItem);
                                }
                            }
                            var selectData = this._getItemObject(activeitem, null);
                            selectData["isInteraction"] = false;
                            if (this.model.select)
                                this._trigger('select', selectData);
                        }
                    }
                }
            }
            this._setSelectionValues();
        },
        //deprecated property
        unselectItemsByIndex: function (value) {
            this.unselectItemsByIndices(value);
        },
        unselectItemsByIndices: function (value) {
            var selectitems = value.toString().split(',');
            for (var i = 0; i < selectitems.length; i++) {
                if (selectitems[i] != null) {
                    var index = parseInt(selectitems[i]);
                    var activeitem = $(this.listItemsElement[index]);
                    this._activeItem = index;
                    activeitem.removeClass('e-active e-select');
                    if (this.model.showCheckbox) {
                        if (($(activeitem).find('.listcheckbox').ejCheckBox('isChecked'))) {
                            $(activeitem).find('.listcheckbox').ejCheckBox('option', 'checked', false);
                            var itemIndex = $.inArray(index, this.model.checkedIndices);
                            if ($.inArray(index, this._checkedItems) > -1) this._checkedItems.splice(itemIndex, 1);
                            if (itemIndex > -1) this.model.checkedIndices.splice(itemIndex, 1);
                        }
                    }
                    if (this.model.selectedIndex == index) this.model.selectedIndex = this._activeItem = null;
                    var itemIndex = this._selectedItems.indexOf(activeitem[0]);
                    this._selectedItems.splice(this.model.selectedIndices.indexOf(itemIndex), 1);
                    this.model.selectedIndices.splice(this.model.selectedIndices.indexOf(itemIndex), 1);

                    var unselectData = this._getItemObject(activeitem, null);
                    unselectData["isInteraction"] = false;
                    if (this.model.unselect)
                        this._trigger('unselect', unselectData);
                }
            }
            this._setSelectionValues();
        },
        unselectItemByIndex: function (index) {
            index = parseInt(index);
            var unselectitem = $(this.element.children("li:not('.e-ghead')")[index]);
            if (this.model.showCheckbox) {
                if (($(unselectitem).find('.listcheckbox').ejCheckBox('isChecked'))) {
                    $(unselectitem).find('.listcheckbox').ejCheckBox('option', 'checked', false);
                    var itemIndex = $.inArray(index, this.model.checkedIndices);
                    if ($.inArray(index, this._checkedItems) > -1) this._checkedItems.splice(itemIndex, 1);
                    if (itemIndex > -1) this.model.checkedIndices.splice(itemIndex, 1);
                }
            }
            if (unselectitem.hasClass('e-select')) {
                unselectitem.removeClass('e-active e-select');
                if (this.model.selectedIndex == index) this.model.selectedIndex = this._activeItem = null;
                var itemIndex = this._selectedItems.indexOf(unselectitem[0]);
                this._selectedItems.splice(this.model.selectedIndices.indexOf(itemIndex), 1);
                this.model.selectedIndices.splice(this.model.selectedIndices.indexOf(itemIndex), 1);
                var unselectData = this._getItemObject(unselectitem, null);
                unselectData["isInteraction"] = false;
                if (this.model.unselect)
                    this._trigger('unselect', unselectData);
            }
            this._setSelectionValues();
        },
        selectItemByText: function (text) {
            if (!ej.isNullOrUndefined(text))
            this[(this.model.allowMultiSelection ? "selectItemsByIndices" : "selectItemByIndex")](this.getIndexByText(text));
        },
        selectItemByValue: function (value) {
            this[(this.model.allowMultiSelection ? "selectItemsByIndices" : "selectItemByIndex")](this.getIndexByValue(value));
        },
        unselectItemByText: function (text) {
            this[(this.model.allowMultiSelection ? "unselectItemsByIndices" : "unselectItemByIndex")](this.getIndexByText(text));
        },
        unselectItemByValue: function (value) {
            this[(this.model.allowMultiSelection ? "unselectItemsByIndices" : "unselectItemByIndex")](this.getIndexByValue(value));
        },
        getSelectedItems: function () {
            var items = [], proxy = this;
            $(proxy.model.selectedIndices).each(function (index, elementIndex) {
                items.push(proxy.getItemByIndex(elementIndex));
            });
            return items;
        },
        getCheckedItems: function () {
            var items = [], proxy = this;
            $(proxy.model.checkedIndices).each(function (index, elementIndex) {
                items.push(proxy.getItemByIndex(elementIndex));
            });
            return items;
        },
        removeItem: function () {
            return this.removeSelectedItems();
        },
        removeItemByText: function (text) {
            if (ej.isNullOrUndefined(this.getItemByText(text))) return false;
            return this.removeItemByIndex(this.getItemByText(text).index);
        },
        hideSelectedItems: function () {
            var items = this.getSelectedItems();
            this._hideOrShowItemsByIndex(items, "hide");
        },
        hideCheckedItems: function () {
            var items = this.getCheckedItems();
            this._hideOrShowItemsByIndex(items, "hide");
        },
        _hideOrShowItemsByIndex: function (items, hideOrShow) {
            if ($.type(items) == "number") {
                if (hideOrShow == "hide") {
                    $(this.listItemsElement[items]).hide();
                    if ($(this.listItemsElement[items]).next().hasClass('e-ghead'))
                        $(this.listItemsElement[items]).prev().hide();
                }
                else {
                    $(this.listItemsElement[items]).show();
                    if ($(this.listItemsElement[items]).prev().hasClass('e-ghead'))
                        $(this.listItemsElement[items]).prev().show();
                }
            }
            else {
                for (var litem = 0; litem < items.length; litem++) {
                    if (hideOrShow == "hide")
                        items[litem].item ? items[litem].item.hide() : $(this.listItemsElement[items[litem]]).hide();
                    else
                        items[litem].item ? items[litem].item.show() : $(this.listItemsElement[items[litem]]).show();
                }
            }
            this._refreshScroller();
        },
        showItemsByIndices: function (items) {
            this._hideOrShowItemsByIndex(items, "show");
        },
        hideItemsByIndices: function (items) {
            this._hideOrShowItemsByIndex(items, "hide");
        },
        _hideOrShowItemsByValue: function (values, hideOrShow) {
            if ($.type(values) == "array") {
				for(var i=0;i < this.listItemsElement.length;i++){
					 for (var length = 0; length <= values.length; length++) {
                        if ($(this.listItemsElement[i]).attr("value") == values[length])
                            (hideOrShow == "hide") ? $(this.listItemsElement[i]).hide() : $(this.listItemsElement[i]).show();
                    }			
			 }                
            }
            else {
                for(var i=0;i < this.listItemsElement.length;i++){
                    if ($(this.listItemsElement[i]).attr("value") == values)
                        (hideOrShow == "hide") ? $(this.listItemsElement[i]).hide() :$(this.listItemsElement[i]).show();
                }
            }
            this._refreshScroller();
        },
        showItemsByValues: function (value) {
            this._hideOrShowItemsByValue(value, "show");
        },
        hideItemsByValues: function (value) {
            this._hideOrShowItemsByValue(value, "hide");
        },
        showItemByValue: function (value) {
            this._hideOrShowItemsByValue(value, "show");
        },
        hideItemByValue: function (value) {
            this._hideOrShowItemsByValue(value, "hide");
        },
        showItemByIndex: function (item) {
            this._hideOrShowItemsByIndex(item, "show");
        },
        hideItemByIndex: function (item) {
            this._hideOrShowItemsByIndex(item, "hide");
        },
        hide: function () {
            this.listContainer.hide();
        },
        show: function () {
            this.listContainer.show()
        },
        hideAllItems: function () {
            this.element.find("li:visible").hide()
            this._refreshScroller();
        },
        showAllItems: function () {
            this.element.find("li:hidden").show()
            this._refreshScroller();
        },
        _stateMaintained: function (index) {
            var lenth, len, value, j;
            this.model.disableItemsByIndex = [];
            this.model.selectedIndices = [];
            this.model.checkedIndices = [];
            if (this.model.selectedIndex >= index && this.model.selectedIndex != null) {
                if (this.model.selectedIndex == index || $(this.element.children()[index - 1]).hasClass('e-disable'))
                    this.model.selectedIndex = null;
                else if (this.model.selectedIndex != index)
                    this.model.selectedIndex -= 1;
            }
            len = $(index).length;
            if (len > 1) {
                for (i = len; i >= 0; i--)
                    $(this.element.children()[index[i]]).remove();
                lenth = this.element.children().length;
                for (j = 0; j < lenth; j++)
                    if ($(this.element.children()[j]).hasClass('e-disable'))
                        this.model.disableItemsByIndex.push(j);
            }
            else {
                value = index - 1;
                for (value; value >= 0; value--) {
                    if ($(this.element.children()[value]).hasClass('e-disable'))
                        this.model.disableItemsByIndex.push(value);
                    if ($(this.element.children()[value]).hasClass('e-select'))
                        this.model.selectedIndices.push(value);
                    if ($(this.element.children()[value]).find('.listcheckbox').ejCheckBox('isChecked'))
                        this.model.checkedIndices.push(value);
                }
                index = parseInt(index) + 1;
                for (index; index < this._listSize; index++) {
                    if ($(this.element.children()[index]).hasClass('e-disable'))
                        this.model.disableItemsByIndex.push(index - 1);
                    if ($(this.element.children()[index]).hasClass('e-select'))
                        this.model.selectedIndices.push(index - 1);
                    if ($(this.element.children()[index]).find('.listcheckbox').ejCheckBox('isChecked'))
                        this.model.checkedIndices.push(index - 1);
                }
            }
        },
        removeAll: function () {
            if (ej.isNullOrUndefined(this.dataSource())) {
                var text = [], lbItems = this.element.find("li");
                $(lbItems).each(function (i, e) {
                    text.push($(this).text());
                    e.remove();
                });
                this._refreshItems();
                return text;
            }
            else if (!(this.dataSource() instanceof ej.DataManager)) {
                var elements = [], count = $(this.listItemsElement).length;
                for (var i = 0; i < count; i++) {
                    elements.push(this._getRemovedItems([parseInt(0)]));
                }
                return elements;
            }
        },
        removeItemByIndex: function (index) {
            var text, selectItem = this.model.selectedIndex,removedElem=this.element.find("li:not('.e-ghead')");
            if (ej.isNullOrUndefined(this.dataSource())) {
                text = $(removedElem[index]).remove().text();
                this._stateMaintained(index);
                this._refreshItems();
            }
            else if (!(this.dataSource() instanceof ej.DataManager)) text = this._getRemovedItems([parseInt(index)]);
            this.model.selectedIndex = (index == selectItem) ? null : index < selectItem ? selectItem - 1 : selectItem;
            return text;
        },
        removeSelectedItems: function () {
            if (this.model.showCheckbox) return false;
            if (ej.isNullOrUndefined(this.dataSource())) {
                var text = this.value();
                $(this.getSelectedItems()).each(function (i, e) {
                    e.item.remove()
                });
                this._refreshItems();
                return text;
            }
            else if (!(this.dataSource() instanceof ej.DataManager)) {
                this.model.selectedIndex = null;
                return this._getRemovedItems(this.model.selectedIndices);
            }
        },
        _getRemovedItems: function (index) {
            var removedItems = [];
            this._stateMaintained(index);
            this.value(null);
            this._activeItem = null;
            this.dataSource(this.dataSource().filter(function (e, i) {
                if (index.indexOf(i) != -1)
                    removedItems.push(e);
                else
                    return true;
            }));
            this.refresh(true);
            return removedItems;
        },
        getIndexByValue: function (value) {
            var index;
			for(var i=0;i < this.listItemsElement.length;i++){
				if($(this.listItemsElement[i]).attr("value") == value){
					index=i;
                    break;					
				}             
			}                     
			return index;
        },
        getIndexByText: function (text) {
            var index;
            if (this.model.allowMultiSelection) {
                var text = text.split(",");
                index = [];
            }
			for(var i=0;i < this.listItemsElement.length;i++){
				if (typeof text == "object") {
                    for (var j = 0; j < text.length; j++) {
                        if ($(this.listItemsElement[i]).text() == text[j]) {                           
                            index.push(i);                          
                            break;							
                        }
                    }
                }
                else if ($(this.listItemsElement[i]).text() == text) {
                    index = i;  
                    break;					
                }				
				}			                    
            return index;
        },
        getTextByIndex: function (index) {
            return $(this.element.find("li:not('.e-ghead')")[index]).text();
        },
        getItemByText: function (text) {
            var proxy = this, obj;
            this.listItemsElement.each(function () {
                if ($(this).text() == text) {
                    obj = proxy._getItemObject($(this));
                    return false;
                }
            });
            return obj;
        },
        getItemByIndex: function (index) {
            return this._getItemObject($(this.element.children("li:not('.e-ghead')")[index]));
        },
        getListData: function () {
            if (ej.DataManager && this.dataSource() instanceof ej.DataManager) {
                if(this.model.allowVirtualScrolling) {
                    this.listitems = this.element.find('li');
                    return this.listitems;
                }
                else
                    return this.listitems;
            }
            else if (this.dataSource()){
				if(this.model.sortOrder != "none" && !(this.mapCateg && this.mapCateg != ""))
					 return this._newList;
			
			     return this.dataSource();
		}
            else
                return;
        },
        enableItem: function (text) {
            var proxy = this;
            this.listItemsElement.each(function () {
                if ($(this).text() == text) {
                    $(this).removeClass("e-disable");
                    if (proxy.model.showCheckbox) $(this).find(".listcheckbox").ejCheckBox("enable");
                    proxy._disabledItems.splice($(this).index().toString());
                    return false;
                }
            });
        },
        disableItem: function (text) {
            var proxy = this;
            this.listItemsElement.each(function () {
                if ($(this).text() == text) {
                    $(this).addClass("e-disable");
                    if (proxy.model.showCheckbox) $(this).find(".listcheckbox").ejCheckBox("disable");
                    proxy._disabledItems.push($(this).index().toString());
                    return false;
                }
            });
        },
        moveUp: function () {
            var process = (this.model.fields.groupBy != null) ? (this.model.allowMultiSelection || this.model.showCheckbox) ? false : true : true;
            if (process) {
                this.checkedorselected = this.model.checkedIndices.length == 0 ? this.model.selectedIndices.reverse() : this.model.checkedIndices.reverse();
				this._checkstate(true);
               
            }
        },
				
        moveDown: function () {
            var process = (this.model.fields.groupBy != null) ? (this.model.allowMultiSelection || this.model.showCheckbox) ? false : true : true;
            if (process) {
                this.checkedorselected = this.model.checkedIndices.length == 0 ? this.model.selectedIndices : this.model.checkedIndices;   this._checkstate();
                }
        },
		
		_checkstate:function(ismoveup){			
			 var curItem = $(this.element.children("li:not('.e-ghead')")[this.checkedorselected[0]]);
                if ((ismoveup && !curItem.prev().hasClass("e-ghead")) || !curItem.next().hasClass("e-ghead") ) {
                    if (!ej.isNullOrUndefined(this.checkedorselected)) {
                        var selectIndex = 0;
                        var listval = this._getItem(this.checkedorselected[selectIndex]);
                        this._moveupdown(listval, selectIndex, ismoveup ? "up":"down");
                    }
                }			
		},
		
        _moveItem: function (item, list, direction) {
            var selectedItem = item, index = item.index(), moveup = (direction == "up"), movedown = (direction == "down");
			this._addListHover();
			this._getItem(this._selectedItem).removeClass("e-hover");
            if (moveup) {
                list.insertAfter(selectedItem);
                if (list.hasClass('e-disable') && $.inArray(index.toString(), this._disabledItems) > -1) {
                    this._disabledItems.splice($.inArray(index.toString(), this._disabledItems), 1);
                    this._disabledItems.push((index + 1).toString());
                }
				  this._selectedItem -= 1;
                  this._refreshItems();
            } else if (movedown) {
                list.insertBefore(selectedItem);
                if (list.hasClass('e-disable') && $.inArray(index.toString(), this._disabledItems) > -1) {
                    this._disabledItems.splice($.inArray(index.toString(), this._disabledItems), 1);
                    this._disabledItems.push((index - 1).toString());
                }
				 this._selectedItem += 1;
                 this._refreshItems();
            }
        },
        _moveupdown: function (list, index, direction) {

            var j = this.checkedorselected[index], next, k;
            var i = 0, i = j;
            while (i < $(this.element.children("li:not('.e-ghead')")).length) {
                next = $(this.element.children("li:not('.e-ghead')")[i]);
                if (ej.isNullOrUndefined(next)) break;
                if (next.hasClass("e-select") || next.find("span").hasClass("e-checkmark")) {
                    k = i;
                    direction == "down" ? eval(i++) : eval(i--);
                    continue;
                }
                else break;
            }
            if (!ej.isNullOrUndefined(next) && i < $(this.element.children("li")).length) this._moveItem(list, next, direction);

            if (index < this.checkedorselected.length) {
                ele = $(this.element.children("li")[this.checkedorselected[index]]);
                if (ele.next().hasClass("e-select") || ele.next().find("span").hasClass("e-checkmark")) var oneafter = direction == "down" ? true : false;
                else if (ej.isNullOrUndefined(ele[0])) var oneafter = direction == "up" ? true : false;
                else if (ele.hasClass("e-select") || ele.find("span").hasClass("e-checkmark")) {
                    this._moveupdown(ele, index + 1, direction);
                }

            }

            length = this.element.children("li:not('.e-ghead')").length;
            if (this.model.checkedIndices.length == 0) {
                this.model.selectedIndices = [];
                for (var i = 0; i < length; i++) {
                    if ($(this.element.children("li:not('.e-ghead')")[i]).hasClass('e-select'))
                        this.model.selectedIndices.push(i);
                }
            } else {
                this.model.checkedIndices = [];
                for (var j = 0; j < length; j++)
                    if ($.parseJSON($(this.element.children("li:not('.e-ghead')")[j]).find("span").attr("aria-checked")))
                        this.model.checkedIndices.push(j);
            }

        },


        checkAll: function () {
            if (!this.model.showCheckbox) return false;
            var items = this.element.find("li:not('.e-ghead')");
            for (i = 0; i < items.length; i++) {
                if (!($(items[i].firstChild).find('.listcheckbox').ejCheckBox('isChecked'))) {
                    $(items[i].firstChild).find('.listcheckbox').ejCheckBox('option', 'checked', true);
                    this._checkedItems.push(items[i]);
                    this.model.checkedIndices.push(i);
                }
            }
			this._setSelectionValues();
            this.model.uncheckAll = false;
        },
        //Deprecated Method
        unCheckAll: function () { this.uncheckAll(); },
        uncheckAll: function () {
            if (!this.model.showCheckbox) return false;
            var items = this.element.find("li:not('.e-ghead')");
            for (i = 0; i < items.length; i++)
                if ($(items[i].firstChild).find('.listcheckbox').ejCheckBox('isChecked'))
                    $(items[i].firstChild).find('.listcheckbox').ejCheckBox('option', 'checked', false);
            this._checkedItems = [];
            this.model.checkedIndices = [];
			this._setSelectionValues();
            this.model.checkAll = false;
        },
        addItem: function (val, index) {
            var text, value, id;
            var index = (!ej.isNullOrUndefined(index) && index <= this.element.find("li:not('.e-ghead')").length) ? index : this.element.find("li:not('.e-ghead')").length;
            var proxy = this, num = index;
            if (ej.isNullOrUndefined(this.dataSource())) {
                if (!(val instanceof Array)) {
					 if(this.model.fields.groupBy && typeof val == "object" ){ 
                          _query = ej.Query().group(this.model.fields.groupBy);
                           groupedList = ej.DataManager([val]).executeLocal(_query);
                            this.dataSource([]);  
                            for (i = 0; i < groupedList.length; i++) {
							this._setMapFields();
                            this.dummyUl.push(ej.buildTag('li.e-ghead', groupedList[i].key)[0]);
                            this._loadlist(groupedList[i].items);
                            this.dataSource(this.dataSource().concat(groupedList[i].items));										
					               } 
					    }
					 else{						 
					     text = (typeof val == "object") ? val[this.model.fields.text] : val;
					     value = (!ej.isNullOrUndefined(this.model.fields.value)) ? val[this.model.fields.value] : "";
					     id = (!ej.isNullOrUndefined(this.model.fields.id)) ? val[this.model.fields.id] : "";
                    this.listitem = (this.element.find("li:not('.e-ghead')").length ?
                                        ((index - 1 < 0) ? $(this.element.find("li:not('.e-ghead')")[0]).before('<li role="option" value="' + value + '" id="' + id + '">' + text + '</li>') : $(this.element.find("li:not('.e-ghead')")[index - 1]).after('<li role="option" value="' + value + '" id="' + id + '">' + text + '</li>'))
                                         : $(this.element).html('<li role="option" value="' + value + '" id="' + id + '">' + text + '</li>'));
					 }
                    this.listitems = this.element.find("li:not('.e-ghead')");
                    this._addItemIndex = index;
                    if (this.model.showCheckbox) {
                        $checkbox = ej.buildTag("input.listcheckbox e-align#popuplist" + (this.listitems.length - 1) + "_" + this._id, "", {}, {
                            type: "checkbox",
                            name: "list" + (this.listitems.length - 1)
                        });
                        $(this.listitems[index]).prepend($checkbox);
                        $($(this.listitems[index]).find(".listcheckbox")).ejCheckBox({
                            change: $.proxy(this._onClickCheckList, this)
                        });
                    }
                    if (this.model.allowDrag || this.model.allowDrop) this._enableDragDrop();
                    this._addItemIndex = null;
                    this._refreshItems();
                }
                else {
                    $(val).each(function (i, e) {
                        proxy.addItem(e, index);
                        index = index + 1;
                    })
                }
            }
            else if (!(this.dataSource() instanceof ej.DataManager)) {
                if (proxy.dataSource() instanceof Object) {
					dup = new Object();
                    if (!(val instanceof Object)) {
                        dup[proxy.model.fields.text] = val;
                        val = dup;
                    }
                }
                else if (!(val instanceof Array)) val = [val];
                $(val).each(function (i, e) {
                    if(proxy.model.fields.groupBy==null||!ej.isNullOrUndefined(e[proxy.model.fields.groupBy])){
                    proxy.dataSource().splice(index, 0, e);
                    index = index + 1;
                 }
                })
                this.model.disableItemsByIndex = [];
                this.model.selectedIndices = [];
                this.model.checkedIndices = [];
                if (this.model.selectedIndex >= num)
                    this.model.selectedIndex += 1;
                var value = num - 1;
                for (value; value >= 0; value--) {
                    if ($(this.element.find("li:not('.e-ghead')")[value]).hasClass('e-disable'))
                        this.model.disableItemsByIndex.push(value);
                    if ($(this.element.find("li:not('.e-ghead')")[value]).hasClass('e-select'))
                        this.model.selectedIndices.push(value);
                    if ($(this.element.children()[value]).hasClass("e-checkmark"))
                        this.model.checkedIndices.push(value);
                }
                for (num; num < this._listSize; num++) {
                    if ($(this.element.find("li:not('.e-ghead')")[num]).hasClass('e-disable'))
                        this.model.disableItemsByIndex.push(num + 1);
                    if ($(this.element.find("li:not('.e-ghead')")[num]).hasClass('e-select'))
                        this.model.selectedIndices.push(num + 1);
                    if ($(this.element.find("li:not('.e-ghead')")[num]).find('.listcheckbox').ejCheckBox('isChecked'))
                        this.model.checkedIndices.push(num + 1);
                }
                this.refresh(true);
            }
        },
        enableItemByIndex: function (index) {
            if (typeof (index) == "number")
                this.enableItemsByIndices(index.toString());
        },
        disableItemByIndex: function (index) {
            if (typeof (index) == "number")
                this.disableItemsByIndices(index.toString());
        },
        disableItemsByIndices: function (value) {
            if (ej.isNullOrUndefined(value)) return false;
            var selectitems = value.toString().split(',');
            for (var i = 0; i < selectitems.length; i++) {
                if (selectitems.length > 0 && !($.inArray(selectitems[i], this._disabledItems) > -1)) {
                    var disable = $(this.element.children("li:not('.e-ghead')")[parseInt(selectitems[i])]).addClass('e-disable');
                    disable.find(".listcheckbox").ejCheckBox("disable");
                    this._disabledItems.push(selectitems[i]);
                }
            }
        },
        enableItemsByIndices: function (value) {
            var selectitems = value.toString().split(','), index;
            for (var i = 0; i < selectitems.length; i++) {
                if (selectitems.length > 0 && ($.inArray(selectitems[i], this._disabledItems) > -1)) {
                    index = $.inArray(selectitems[i], this._disabledItems);
                    var enable = $(this.element.children("li:not('.e-ghead')")[parseInt(selectitems[i])]).removeClass('e-disable');
                    enable.find(".listcheckbox").ejCheckBox("enable");
                    this._disabledItems.splice(index, 1);
                }
            }
        },
        _init: function () {
            this._id = this.element[0].id;
            this._isMozilla = ej.browserInfo().name == "mozilla" ? true : false;
            this._cloneElement = this.element.clone();
            this._deprecatedValue()._initialize()._render()._wireEvents();
            this._initValue = this.focused = this.datamerged = this.groupData = false;
            this._typeInterval = null;
            this._dummyVirtualUl = [];
            this._virtualCount = 0;
            this._liItemHeight = 0;
            this._typingThreshold = 2000;
            this._dataUrl = this.dataSource();
            //deprecatedFunction
            if (this.model.checkAll)
                this.checkAll();
            if (this.model.uncheckAll)
                this.uncheckAll();
            if (this.model.disableItemsByIndex)
                this.disableItemsByIndices(this.model.disableItemsByIndex.toString());
            if (this.model.enableItemsByIndex)
                this.enableItemsByIndices(this.model.enableItemsByIndex.toString());
            if (this.model.uncheckItemsByIndex)
                this.uncheckItemsByIndices(this.model.uncheckItemsByIndex.toString());
            this._deprecatedValue()._enabled(this.model.enabled);

        },
        _deprecatedValue: function () {
            this.model.itemDrop = (this.model.itemDrop || this.model.itemDropped);
            this.model.change = (this.model.change || this.model.selectIndexChanged);
            this.model.fields.checkBy = this.model.fields.selected || this.model.fields.checkBy;
            this.model.fields.tooltipText = this.model.fields.toolTipText || this.model.fields.tooltipText;
            this.model.fields.groupBy = this.model.fields.category || this.model.fields.groupBy;
            this.model.select = (this.model.select || this.model.selected);
            if (this.model.allowDragAndDrop != undefined)
                this.model.allowDrag = this.model.allowDrop = true;
            this.model.selectedIndex = this.model.selectedIndex != null ? this.model.selectedIndex : this.model.selectedItemIndex;
            this.model.checkedIndices = ((this.model.checkedIndices.length ? this.model.checkedIndices : null) || (this.model.checkItemsByIndex ? this.model.checkItemsByIndex : null) || (this.model.checkedItems.length ? this.model.checkedItems : null) || (this.model.checkedItemlist.length ? this.model.checkedItemlist : []));
            this.model.selectedIndices = ((this.model.selectedIndices.length ? this.model.selectedIndices : null) || (this.model.selectedItems.length ? this.model.selectedItems : null) || (this.model.selectedItemlist.length ? this.model.selectedItemlist : []));
            return this;
        },
        _setModel: function (options) {
            var option, refresh = false;
            for (option in options) {
                switch (option) {
                    case "value":
                        this._setText(ej.util.getVal(options[option]));
                        break;
                    case "dataSource":
                        if (!ej.isNullOrUndefined(this._isCasCadeTarget))
                            this.model.selectedIndex = null;
                        options[option] = ej.util.getVal(options[option])
                        this._checkModelDataBinding(options[option]);
                        break;
                    case "query":
                        this._queryCheck(options[option]);
                        break;
                    case "fields":
                        this.model.fields = $.extend(this.model.fields, options[option]);
                        this._checkModelDataBinding(this.dataSource());
                        break;
                    case "template":
                        this.model.template = options[option];
                        this.refresh(true);
                        break;
                    case "loadDataOnInit":
                        this._loadContent = options[option];
                        this._checkModelDataBinding(this.dataSource());
                        break;
                    case "enableRTL":
                        this.model.enableRTL = options[option];
                        (this.model.enableRTL) ? this.listContainer.addClass("e-rtl") : this.listContainer.removeClass("e-rtl");
                        break;
                    case "enabled":
                        this.model.enabled = options[option];
                        this._enabled(options[option]);
                        break;
				    case "enableWordWrap":
					      this.model.enableWordWrap=options[option];
					      this._wordWrapItems(options[option]);
						  break;
                    case "height":
                    case "width":
                        this.model[option] = options[option];
                        this._setDimensions();
                        break;
                    case "cssClass":
                        this.model.cssClass = options[option];
                        this.listContainer.addClass(this.model.cssClass);
                        break;
                    case "showCheckbox":
                        this._checkboxHideShow(options[option]); if (options[option]) this._removeListHover();
                        break;
                    case "showRoundedCorner":
                        this.model.showRoundedCorner=options[option];
                        this._roundedCorner();
                        break;
                    case "selectedItemIndex":
                    case "selectedIndex":
                         if (this.listitem[options[option]] || options[option] == null || this.listitems[options[option]]) {
                            this.selectItemByIndex(options[option]);
                            this.model.selectedIndex = this.model.selectedItemIndex = options[option];
                        } else options[option] = this.model.selectedIndex;
                        break;
                    case "sortOrder":
                        this.model.sortOrder = options[option];
                        if (this.dataSource() != null)
                            this._showFullList();
                        else
                            this._renderlistContainer();
                        break;
                    case "checkItemsByIndex":
                    case "checkedItemlist":
                    case "checkedItems":
                    case "checkedIndices":
                        this.uncheckAll();
                        this.checkItemsByIndices(options[option].toString());
                        options[option] = this.model[option] = this.model.checkedIndices;
                        break;
                    case "uncheckItemsByIndex":
                        this.uncheckItemsByIndices(options[option].toString());
                        this.model[option] = options[option];
                        break;
                    case "selectedItemlist":
                    case "selectedItems":
                    case "selectedIndices":
                        this.unselectAll();
                        this.selectItemsByIndices(options[option].toString());
                        options[option] = this.model.selectedIndices;
                        break;
                    case "enableItemsByIndex":
                        this.model[option] = options[option];
                        this.enableItemsByIndices(options[option].toString());
                        break;
                    case "disableItemsByIndex":
                        this.model[option] = options[option];
                        this.disableItemsByIndices(options[option].toString());
                        break;
                    case "enableVirtualScrolling":
                        this.model.allowVirtualScrolling = options[option]; refresh = true;
                        break;
                    case "allowDrag":
                    case "allowDrop":
                    case "allowDragAndDrop":
                    case "allowVirtualScrolling":
                    case "virtualScrollMode":
                        this.model[option] = options[option]; refresh = true;
                        break;
                    case "checkAll":
                        this.model[option] = options[option]; if (options[option]) this.checkAll(); else this.uncheckAll();
                        break;
                    case "uncheckAll":
                        this.model[option] = options[option]; if (options[option]) this.uncheckAll(); else this.checkAll();
                        break;
                    case "htmlAttributes":
                        this._addAttr(options[option]);
                        break;
                    case "itemsCount":
                        var items = this.model.itemsCount;
                        if (this.model.height) {
                            this.model.itemsCount = options[option];
                            this._setItemsCount()._setDimensions();
                        } else options[option] = items;
                        break;
                    case "itemHeight":
                        var $liElements = this.listItemsElement;
                        var optionHeight = ej.isNullOrUndefined(options[option]) ? options[option] : options[option].toString().replace("px", "");
                        var modelHeight= ej.isNullOrUndefined(this.model.itemHeight) ? this.model.itemHeight :this.model.itemHeight.toString().replace("px", "");
                        for (var z = 0; z < $liElements.length; z++) {
                            var style = ej.isNullOrUndefined(options[option]) ? { "min-height": ej.isNullOrUndefined(this.model.itemHeight)? "20px":modelHeight } : { "min-height": optionHeight + "px", "height": optionHeight + "px" };
                            $liElements.eq(z).css(style);
                        } this.refresh();
                        break;
                    case "allowMultiSelection":
                        this.model.allowMultiSelection = options[option];
                        if (!options[option]) {
                            var index = this.model.selectedIndex;
                            this._removeListHover();
                            ej.isNullOrUndefined(index) ? "" : this.selectItemByIndex(index);
                        };
                        break;
                    case "totalItemsCount":
                        if (!ej.isNullOrUndefined(this.dataSource())) {
                            this.model.totalItemsCount = options[option];
                            if (this.model.query)
                                this._queryCheck(this.model.query);
                        }
                        break;
                }
            }
            if (refresh) this._refresh();
        },
        _destroy: function () {
            if (!ej.isNullOrUndefined(this._lilist)) $(this._lilist).ejDraggable("destroy");
            this.element.insertAfter(this.listContainer);
            this.element.find(".e-chkbox-wrap").remove();
            this.listContainer.remove();
			this.element.removeClass("e-ul");
            if (!this._isList) this.element.empty();
            $(window).off("resize", $.proxy(this._OnWindowResize, this));
			this._ListEventUnbind(this.element.children("li"));
            return this;
        },
		_ListEventUnbind: function (_ListItemsContainer) {
			_ListItemsContainer.off("contextmenu", $.proxy(this._OnMouseContext, this));
            _ListItemsContainer.off("click", $.proxy(this._OnMouseClick, this));
            _ListItemsContainer.off("touchstart mouseenter", $.proxy(this._OnMouseEnter, this));
            _ListItemsContainer.off("touchend mouseleave", $.proxy(this._OnMouseLeave, this));
		},
        _refresh: function () {
            this._destroy()._init();
        },
        _finalize: function () {
            if (this.model.selectedIndex != null)
                this.selectItemByIndex(this.model.selectedIndex);
            else if ((this.model.showCheckbox == true) && (this._selectedItems.length > 0))
                this._selectCheckedItem(this._selectedItems);
            if (this.model.checkedIndices != null) this.checkItemsByIndices(this.model.checkedIndices.toString());
            return this;
        },
        _initialize: function () {
            this._isList = this.element.children().length ? true : false;
            this.target = this.element[0];
            this._queryString = null;
            this._disabledItems = [];
            this._itemId = null;
            this._up = this._down = this._ctrlClick = false;
            this.checkedStatus = this._isScrollComplete = false;
            this._incqueryString = "";
            this._totalCount = 0;
            this._activeItem = null;
            this._initValue = true;
            this.model.allowVirtualScrolling = (this.model.allowVirtualScrolling) ? this.model.allowVirtualScrolling : this.model.enableLoadOnDemand;
            this.model.virtualScrollMode = (this.model.enableVirtualScrolling) ? "continuous" : this.model.virtualScrollMode;
            this._selectedItems = [];
            this._checkedItems = [];
            this._loadContent = this.model.loadDataOnInit;
            this._loadInitialRemoteData = true;
            this._skipInitialRemoteData = false;
            if (this.model.enableVirtualScrolling) this.model.allowVirtualScrolling = true;
            this._setItemsCount();
            return this;
        },
        _render: function () {
            this._savedQueries = this.model.query.clone();
            if (this.model.totalItemsCount)
                this._savedQueries.take(this.model.totalItemsCount);
            this._renderContainer()._addAttr(this.model.htmlAttributes);
            if (ej.DataManager && this.dataSource() instanceof ej.DataManager) {
                if (this.model.actionBegin)
                    this._trigger("actionBegin", {});
                if (this._loadInitialRemoteData)
                    this._initDataSource(this.dataSource());
            }
            else
                this._showFullList();
            if (!this.dataSource()) this._finalize();
			this.listItemsElement=this.element.find("li:not('.e-ghead')");
            if (this.model.showRoundedCorner)
                this._roundedCorner();
            return this;
        },
        _queryCheck: function (value) {
            this._savedQueries = value.clone();
            this.element.empty();
            if (this.dataSource())
                this._checkModelDataBinding(this.dataSource());
        },
        _checkModelDataBinding: function (source) {
            this.mergeValue = null;
            this.dataSource(source);
            if (source != null && source.length != 0) {
                if (ej.DataManager && source instanceof ej.DataManager) this._initDataSource(source);
                else this._showFullList();
            } else { this.element.empty(); this._refreshScroller(); }
        },
        _initDataSource: function (source) {
            var proxy = this;
            proxy.listitems = proxy.dataSource();
            proxy._updateLoadingClass(true);
            var queryPromise = source.executeQuery(this._getQuery());
            queryPromise.done(function (e) {
                proxy._totalCount = e.count;
                proxy.listitems = e.result;
                proxy._updateLoadingClass()._showFullList()._trigger("actionSuccess", e);
                proxy._finalize();
                proxy._virtualPages = [0];
            }).fail(function (e) {
                proxy.dataSource(null);
                proxy._updateLoadingClass(true)._trigger("actionFailure", e);
            }).always(function (e) {
                if (proxy.model.checkAll)
                    proxy.checkAll();
                if (proxy.model.uncheckAll)
                    proxy.uncheckAll();
                proxy._trigger("actionComplete", e);
            });
        },
        _getQuery: function () {
            var queryManager;
            if (ej.isNullOrUndefined(this.model.query)) {
                var column = [],
                    mapper = this.model.fields;
                queryManager = ej.Query();
                for (var col in mapper)
                    if (col !== "tableName") column.push(mapper[col]);
                if (column.length > 0) queryManager.select(column);
                if (!this.dataSource().dataSource.url.match(mapper.tableName + "$")) !ej.isNullOrUndefined(mapper.tableName) && queryManager.from(mapper.tableName);
            } else queryManager = this.model.query.clone();
            if(this.model.allowVirtualScrolling) {
                queryManager.requiresCount();
                queryManager.take(this.model.itemRequestCount);
            }
            return queryManager;
        },
        _getLiHeight: function () {
            this._liItemHeight = $(this.element.find('li')[0]).outerHeight();
        },
        _addDragableClass: function () {
            if (this.model.allowDrag || this.model.allowDrop) {
                this.element.css("cursor", "pointer");
                if (this.model.allowDrop) {
                    this.listContainer.addClass("e-droppable");
                    this.listBoxScroller.addClass("e-droppable");
                }
                var proxy = this;
                this.element.children("li").each(function (index) {
                    if (proxy.model.allowDrag) ($(this).addClass("e-draggable"));
                    if (proxy.model.allowDrop) ($(this).addClass("e-droppable"));
                });
            }
            return this;
        },
        _enableDragDrop: function () {
            if (this.model.allowDrag || this.model.allowDrop) this._drag();
        },
        _updateLoadingClass: function (value) {
            this.listContainer[(value ? "addClass" : "removeClass")]("e-load"); return this;
        },
        _addAttr: function (htmlAttr) {
            var proxy = this;
            $.map(htmlAttr, function (value, key) {
                if (key == "class") proxy.listContainer.addClass(value);
                else if (key == "required") proxy.element.attr(key, value);
                else if (key == "disabled" && value == "disabled") proxy._enabled(false);
                else proxy.listContainer.attr(key, value);
            });
        },
        _renderContainer: function () {
            this.listContainer = ej.buildTag("div.e-ddl-popup e-box e-popup e-widget " + this.model.cssClass, "", {
                "visibility": "hidden"
            }, {
                "tabIndex": 0,
                "id": this._id + "_container"
            });
            this.listBoxScroller = ej.buildTag("div.e-listbox-container");
            this.ultag = ej.buildTag("ul.e-ul", "", {}, {
                "role": "listbox"
            });
            this.element = this.element.addClass("e-ul");
            this.listContainer.append(this.listBoxScroller).insertAfter(this.element);
            this.listBoxScroller.append(this.element);
            this.element.attr('data-ej-unselectable', 'on').css('user-select', 'none');
            this._hiddenInput = ej.buildTag("input#" + this._id + "_hidden", "", {}, {
                type: "hidden"
            }).insertBefore(this.element);
            this._hiddenInput.attr('name', this._id);
            return this;
        },
        _setMapFields: function () {
           var mapper = this.model.fields;
            this.mapFld = {
                _id: null,
                _imageUrl: null,
                _imageAttributes: null,
                _tooltipText: null,
                _spriteCSS: null,
                _text: null,
                _value: null,
                _htmlAttributes: null,
                _selectBy: null,
                _checkBy: null
            };
            this.mapFld._id = (mapper && mapper.id) ? mapper["id"] : "id";
            this.mapFld._imageUrl = (mapper && mapper.imageUrl) ? mapper["imageUrl"] : "imageUrl";
            this.mapFld._tooltipText = (mapper && mapper.tooltipText) ? mapper["tooltipText"] : "tooltipText";
            this.mapFld._imageAttributes = (mapper && mapper.imageAttributes) ? mapper["imageAttributes"] : "imageAttributes";
            this.mapFld._spriteCSS = (mapper && mapper.spriteCssClass) ? mapper["spriteCssClass"] : "spriteCssClass";
            this.mapFld._text = (mapper && mapper.text) ? mapper["text"] : this.listitems[0].text ? "text" : this._getObjectKey(this.listitems[0])[0];
            this.mapFld._value = (mapper && mapper.value) ? mapper["value"] : "value";
            this.mapFld._htmlAttributes = (mapper && mapper.htmlAttributes) ? mapper["htmlAttributes"] : "htmlAttributes";
            this.mapFld._checkBy = (mapper && mapper.checkBy) ? mapper["checkBy"] : "checkBy";
            this.mapFld._selectBy = (mapper && mapper.selectBy) ? mapper["selectBy"] : "selectBy";
            this.mapCateg = (mapper && mapper.groupBy) ? mapper["groupBy"] : ""
        },
        _getObjectKey: function (obj) {
            if (!Object.keys) {
                var keys = [];
                for (var i in obj) {
                    if (obj.hasOwnProperty(i)) {
                        keys.push(i);
                    }
                }
                return keys;
            }
            else return Object.keys(obj)
        },
        _itemStyle:function(){
            var height = ej.isNullOrUndefined(this.model.itemHeight) ? this.model.itemHeight : this.model.itemHeight.toString().replace("px", "");
            var itemHeight = ej.isNullOrUndefined(this.model.itemHeight) ? "" : "min-height:" + height + "px;height:" + height + "px";
            return { style: itemHeight }
        },
        sort: function () {
            var sortedlist = document.createElement("ul"), i, sortitems;
            $(sortedlist).append(this.itemsContainer.children());
            if (this.model.fields.groupBy != null || $(sortedlist).find(">.e-ghead").length > 0) {
                for (i = 0; i < $(sortedlist).find(">.e-ghead").length; i++) {
                    sortitems = $(sortedlist).find(">.e-ghead").eq(0).first().nextUntil(".e-ghead").get();
                    this._setSortList(sortedlist, sortitems);
                }
                var headerlist = document.createElement("ul"), headeritems, j;
                headeritems = $(sortedlist).clone().find('>.e-ghead').get();
                for (var k = 0; k < headeritems.length; k++)
                    headerlist.append(headeritems[k]);
                var headerdata = this._customSort(headerlist, headeritems);
                var groupSort = document.createElement("ul"), groupitems;
                var temp = $(sortedlist).find('li.e-ghead').get();
                if (this.model.sortOrder.toLowerCase() == "descending")
                    headerdata.reverse();
                for (j = 0; j < headerdata.length; j++) {
                    groupSort.append(headerdata[j]);
                    for (l = 0; l < temp.length; l++) {
                        if (headerdata[j].textContent == temp[l].textContent) {
                            groupitems = $(sortedlist).find(">.e-ghead").eq(l).first().nextUntil(".e-ghead").get();
                            for (m = 0; m < groupitems.length; m++) {
                                groupSort.append(groupitems[m]);
                            }
                        }
                    }
                }
                this.itemsContainer = $(groupSort);
            }
            else {
                sortitems = $(sortedlist).children('li').get();
                this._setSortList(sortedlist, sortitems);
                this.itemsContainer = $(sortedlist)
            }
        },
        _customSort: function (headerlist, headeritems) {
            headeritems.sort(function (objA, objB) {
                var sortA = $(objA).text().toUpperCase();
                var sortB = $(objB).text().toUpperCase();
                return (sortA < sortB) ? -1 : (sortA > sortB) ? 1 : 0;
            });
            return headeritems;
        },
        _setSortList: function (sortedlist, sortitems) {
            this._customSort(sortedlist, sortitems);
            if (this.model.sortOrder.toLowerCase() == "descending") sortitems.reverse();
            if (this.model.fields.groupBy != null || $(sortedlist).find(">.e-ghead").length > 0) {
                $(sortedlist).append($("<li>").text($(sortedlist).find(">.e-ghead").eq(0).text()).addClass("e-ghead"));
                $(sortedlist).find(">.e-ghead").eq(0).remove();
            }
            $.each(sortitems, function (index, item) {
                $(sortedlist).append(item);
            });
        },
        _renderlistContainer: function () {
            this.hold = this.touchhold = false;
            this.item = "";
            this.startime = 0;
            this.listitemheight = 24;
            var list = this.listitems,
                i, ulempty, ulno, litag, _id, _txt, mapper = this.model.fields,
                predecessor;
            this.lastScrollTop = -1;
            this.dummyUl = $();
            if (this.model.enableRTL) this.listContainer.addClass("e-rtl");
            this._wordWrapItems();
            if (this.dataSource() == null || this.dataSource().length < 1) {
                predecessor = this.element.parents().last();
                if (this.model.targetID) this.docbdy = predecessor.find("#" + this.model.targetID);
                else this.docbdy = predecessor.find("#" + this._id);
                this.itemsContainer = this.docbdy;
                if(this.model.sortOrder != "none") this.sort();
                this.itemsContainer.children("ol,ul").remove();
                this.items = this.itemsContainer.children('li');
                this.items.children("img").addClass("e-align");
                this.items.children("div").addClass("e-align");
                var iHeight = parseInt(this.model.itemHeight) + "px";
                if (this.model.itemHeight) $('li').css({ "min-height": iHeight, "height": iHeight });
                this.element.append(this.itemsContainer.children());
            }
            else if (this.dataSource() != null && typeof list[0] != "object") {
                if (this._loadInitialRemoteData && this.mergeValue && this.model.virtualScrollMode == "continuous" && this.model.totalItemsCount)
                    this._loadlist(this.mergeValue);
                else if (this._loadInitialRemoteData && this.mergeValue && this.model.virtualScrollMode == "normal" && this.model.totalItemsCount) {
                    this.realUllength = 0;
                    this.mergeUl = [];
                    for (i = 0; i < this.mergeValue.length; i++)
                         this.mergeUl.push(ej.buildTag('li', this.mergeValue[i][this.model.fields.text], null, this._itemStyle())[0]);
                    this.element.append(this.mergeUl);
                    for (i = 0; i < this.model.totalItemsCount - this.mergeValue.length; i++)
                        this.dummyUl.push(ej.buildTag('li', null, null, this._itemStyle())[0]);
                    this.element.append(this.dummyUl);
                    this._refreshScroller();
                }
                else if (this._loadInitialRemoteData && this.mergeValue && !this.model.totalItemsCount)
                    this._initDataSource(this.dataSource());
            }
            else {
                this._setMapFields();
                var groupedList, _query;
                _query = this._savedQueries;
                this.listContainer.height(this.model.height);
                this.listitemheight = 24;
                if (this.model.allowVirtualScrolling) {
                    if (this.model.virtualScrollMode == "normal") {
                        this.realUllength = 0;
                        if (this.dataSource().length < 0) {
                            query = this._savedQueries.take(parseInt(this.listContainer.height() / this.listitemheight));
                            var proxy = this;
                            if (ej.DataManager && this.dataSource() instanceof ej.DataManager) {
                                proxy.listitems = proxy.dataSource();
                                var queryPromise = this.dataSource().executeQuery(query);
                                queryPromise.done(function (e) {
								    proxy._trigger("actionBeforeSuccess", e);
                                    proxy.listitems = e.result;
                                    proxy._trigger("actionSuccess", e);
                                }).fail(function (e) { proxy._trigger("actionFailure", e); })
                                  .always(function (e) { proxy._trigger("actionComplete", e); });
                            }
                        }
                        if (this.mergeValue != groupedList && !ej.isNullOrUndefined(this.mergeValue)) {
                            this.mergeUl = [];
                            for (i = 0; i < this.mergeValue.length; i++) {
                                var $liEle = ej.buildTag('li', this.model.template ? "" : this.mergeValue[i][this.model.fields.text], null,  this._itemStyle())[0]
                                if (this.model.template) $liEle.append(this._getTemplatedString(list[i]));
                                this.mergeUl.push($liEle[0]);
                            }
                            this.element.append(this.mergeUl);
                        }
                        if (!this.model.totalItemsCount)
                            var originalliLength = this.listitems.length;
                        else
                            var originalliLength = (this.mergeValue) ? this.model.totalItemsCount - this.mergeValue.length : this.model.totalItemsCount;
                        for (var i = 0; i < originalliLength; i++) {
                            var $listEle = ej.buildTag('li', null, null,  this._itemStyle());
                            this.dummyUl.push($listEle[0]);
                        }
                        this.dummyUl.attr("data-ej-page", 0);
                        this.element.append(this.dummyUl);
                    }
                    this._loadInitialData(_query, list);
                } else {
                    if (this.mapCateg && this.mapCateg != "") {
                        _query = ej.Query().group(this.mapCateg);
                        if(this.model.sortOrder.toLowerCase() == "none")
                       _query.queries.splice(0, 1);
                        groupedList = ej.DataManager(list).executeLocal(_query);
                        if (this.model.sortOrder.toLowerCase() != "none") {
                            var sortQuery = ej.Query().sortBy(this.mapFld._text, this.model.sortOrder, true);
                            groupedList = ej.DataManager(groupedList).executeLocal(sortQuery);
                        }
                        this.dataSource([]);
                        if(this.datamerged && this.model.fields.groupBy){
                                this.mergeUl = [];
                                for (i = 0; i <this.mergeValue.length; i++) {
                                    this.mergeUl.push(this.mergeValue[i]);
                                   for(j=0;j<groupedList[0].items.length;j++){
                                       if(this.mergeValue[i].category==groupedList[0].items[j].key)
                                           groupedList[0].items[j].items.push(this.mergeUl[i]);
                                        }     
                                    }
                           for(i = 0; i < groupedList[0].items.length; i++) {
                            this.dummyUl.push(ej.buildTag('li.e-ghead', groupedList[0].items[i].key)[0]);
                            this._loadlist(groupedList[0].items[i].items);
                            this.dataSource(this.dataSource().concat(groupedList[0].items[i].items));
                        }
                    }
                    else{
                            for (i = 0; i < groupedList.length; i++) {
                            this.dummyUl.push(ej.buildTag('li.e-ghead', groupedList[i].key)[0]);
                            this._loadlist(groupedList[i].items);
                            this.dataSource(this.dataSource().concat(this._newList));
                        }
                    } }
                    else {
                        groupedList = ej.DataManager(list).executeLocal(_query);
                        if (groupedList.length > 0) {
                            if (this.mergeValue != groupedList && !ej.isNullOrUndefined(this.mergeValue)) {
                                this.mergeUl = [];
                                for (i = 0; i < this.mergeValue.length; i++) {
                                    this.mergeUl.push(ej.buildTag('li', this.mergeValue[i][this.model.fields.text], null,  this._itemStyle())[0]);
                                    groupedList.push(this.mergeValue[i]);
                                }
                            }
                            if (this.model.template != null && this._loadContent) {
                                if (this.model.sortOrder.toLowerCase() != "none") {
                                    var sortQuery = ej.Query().sortBy(this.mapFld._text, this.model.sortOrder, true);
                                    list = ej.DataManager(list).executeLocal(sortQuery);
                                }
                                for (i = 0; i < list.length; i++) {
                                    var _dhtmlAttributes = this._getField(list[i], this.mapFld._htmlAttributes);
                                    var _did = this._getField(list[i], this.mapFld._id);
                                    litag = ej.buildTag('li');
                                    if ((_dhtmlAttributes) && (_dhtmlAttributes != "")) litag.attr(_dhtmlAttributes);
                                    if (_did) litag.attr('id', _did);
                                    if (this.model.template) litag.append(this._getTemplatedString(list[i]));
                                    this.dummyUl.push(litag[0]);
                                }
                                if (!this.model.allowVirtualScrolling) this.element.children().remove();
								var k = (this.model.virtualScrollMode == "continuous" && this.mergeValue) ? this.realUllength + this.mergeValue.length : this.realUllength;
                                if (this.element.children()[k] == null && (!this.model.allowVirtualScrolling || this.model.virtualScrollMode == ej.VirtualScrollMode.Continuous) && this._loadContent)								
                                this.element.append(this.dummyUl);
                            }
                            else {
                                this.realUllength = 0;
                                this._loadlist(groupedList);
                            }
                        }
                    }
                }
            }
            var proxy = this;
            if (groupedList) this.listitems = groupedList;
            this._setDimensions();
            this.listContainer.css({ "position": "relative", "height": "" });
            this.listBoxScroller.css({ "height": "", "width": "" });
            if(this.model.allowVirtualScrolling == true && this.model.virtualScrollMode == "normal") {
                this._getLiHeight();
                totalHeight = this._totalCount * this._liItemHeight;
                this.element.height(totalHeight);
            }
            else if(this.model.allowVirtualScrolling == true && this.model.virtualScrollMode == "continuous") {
                this.element.css("height", "auto");
            }
            this.listContainer.ejScroller({
                height: this.listContainer.height(),
                width: 0,
                scrollerSize: 20,
                scroll: function (e) {
                    proxy._onScroll(e);
                },
            });
            this.scrollerObj = this.listContainer.ejScroller("instance");
            this._setDimensions();
            this.listContainer.css({ 'display': 'none', 'visibility': 'visible' });
            this._checkboxHideShow(this.model.showCheckbox)._checkitems()._showResult();
            //if (this.model.totalItemsCount)
            //    this._setTotalItemsCount();
        },
		  _wordWrapItems:function(){
			   this.model.enableWordWrap?this.listContainer.addClass("e-wrap").removeClass("e-nowrap"):this.listContainer.addClass("e-nowrap").removeClass("e-wrap");
			},
	
        _loadInitialData: function (query, list) {
            var _query = query.clone();
            this.realUllength = 0;
            if ((ej.DataManager && this.dataSource() instanceof ej.DataManager))
                _query = _query.range(0, parseInt(this.listContainer.height() / this.listitemheight));
            else
                _query = _query.range(0, this.listitems.length);
            groupedList = list;
            if (this.mergeValue != groupedList && this.mergeValue != undefined && this.model.virtualScrollMode == "continuous") {
                this.mergeUl = [];
                for (i = 0; i < this.mergeValue.length; i++)
                    this.mergeUl.push(ej.buildTag('li', this.mergeValue[i][this.model.fields.text], null,  this._itemStyle())[0]);
                this.element.append(this.mergeUl);
            }
            if (!this.mergeValue || (this.mergeValue && this._loadInitialRemoteData))
                this._loadlist(groupedList);
        },
        _loadlist: function (sublist) {
            this._dummyVirtualUl = []; this._newList = [];
            if (this.element != null) {
                var selectionArray = [];
                if (this.model.sortOrder.toLowerCase() != "none") {
                    var sortQuery = ej.Query().sortBy(this.mapFld._text, this.model.sortOrder, true);
                    sublist = ej.DataManager(sublist).executeLocal(sortQuery);
                }
                for (var j = 0; j < sublist.length; j++) {
                    var _did = this._getField(sublist[j], this.mapFld._id);
                    var _dimageUrl = this._getField(sublist[j], this.mapFld._imageUrl);
                    var _dimageAttributes = this._getField(sublist[j], this.mapFld._imageAttributes);
                    var _dspriteCss = this._getField(sublist[j], this.mapFld._spriteCSS);
                    var _dtext = this._getField(sublist[j], this.mapFld._text);
                    var _dvalue = this._getField(sublist[j], this.mapFld._value);
                    var _dhtmlAttributes = this._getField(sublist[j], this.mapFld._htmlAttributes);
                    var _dselectBy = this._getField(sublist[j], this.mapFld._selectBy);
                    var _dcheckBy = this._getField(sublist[j], this.mapFld._checkBy);
                    var _dtooltipText = this._getField(sublist[j], this.mapFld._tooltipText);
                    var k = (this.model.virtualScrollMode == "continuous" && this.mergeValue) ? this.realUllength + this.mergeValue.length : this.realUllength;
                    if ((_dvalue) && (_dvalue != "")) litag = ej.buildTag('li', "", "", $.extend( this._itemStyle(), {value: _dvalue}));
                    else var litag = ej.buildTag('li', null, null,  this._itemStyle()); if (_did) litag.attr('id', _did);

                    if ((_dimageUrl) && (_dimageUrl != "")) {
                        imgtag = ej.buildTag('img.e-align', '', {}, {
                            'src': _dimageUrl,
                            'alt': _dtext
                        });
                        if ((_dimageAttributes) && (_dimageAttributes != "")) imgtag.attr(_dimageAttributes);
                        litag.append(imgtag);
                    }
                    if ((_dspriteCss) && (_dspriteCss != "")) {
                        divtag = ej.buildTag('div.e-align ' + _dspriteCss + ' sprite-image');
                        litag.append(divtag);
                    }
                    if ((_dtext) && (_dtext != "")){
                    if(this.model.template) litag.append(this._getTemplatedString(sublist[j]))
                    else litag.append(_dtext);
                    }
                    if ((_dhtmlAttributes) && (_dhtmlAttributes != "")) litag.attr(_dhtmlAttributes);
                    if ((_dtooltipText) && (_dtooltipText != "")) litag.attr('data-content', _dtooltipText).addClass("e-tooltip");
                    if (_dcheckBy || this.model.checkAll) litag.addClass("checkItem");
                    if (_dselectBy || this.model.selectAll) litag.addClass("selectItem");
                    if (this.model.allowVirtualScrolling && this.model.virtualScrollMode == "normal") {
                        $(litag[0]).attr("data-ej-page", 0);
                        ($(this.dummyUl[k])).replaceWith(litag[0]);
                        this._dummyVirtualUl.push(litag[0]);
                    }
                    else
                        this.dummyUl.push(litag[0]);
                    this.realUllength += 1;
                }
                if (!this.model.allowVirtualScrolling) this.element.children().remove();
                if (this.element.children()[k] == null && (!this.model.allowVirtualScrolling || this.model.virtualScrollMode == ej.VirtualScrollMode.Continuous) && this._loadContent)
                    this.element.append(this.dummyUl);
                var listItems = this.element.find("li:not('.e-ghead')"); this.listItemsElement = this.element.find("li:not('.e-ghead')");
                if (this.model.showCheckbox && this.model.checkedIndices) {
                    for (var i = 0; i < listItems.length; i++)
                        if (this.model.checkedIndices.indexOf(i) != -1)
                            $(listItems[i]).addClass("checkItem");
                }
                else if (!this.model.showCheckbox) {
					if(this.value()!="" && !this.mapCateg && !this.mapCateg != "") this.selectItemByText(this.value());
                    for (var i = 0; i < listItems.length; i++)
                        if (this.model.selectedIndices.indexOf(i) != -1 || this.model.selectedIndex == i)
                            $(listItems[i]).addClass("selectItem");
                }
                this.element.find('.selectItem').each(function (i, e) {
                    selectionArray.push($(e).parent().find("li").index($(e)));
                });
                var proxy = this;
                if (!proxy.model.showCheckbox && !this.mapCateg && !this.mapCateg != "")
                    proxy._selectListItems();
                this.element.find('.checkItem').each(function (i, e) {
                    proxy.model.checkedIndices.push(proxy._elementIndex(e));
                });
				if(!this.mapCateg && !this.mapCateg != ""){
                if (selectionArray.length)
                    this.model.allowMultiSelection ? this.model.selectedIndices = selectionArray : this.model.selectedIndex = selectionArray[0];
                if (this.model.checkedIndices)
                    this.model.checkedIndices = $.grep(proxy.model.checkedIndices, function (el, index) { return index == $.inArray(el, proxy.model.checkedIndices); });
                else if (this.model.selectedIndices)
                    this.model.selectedIndices = $.grep(proxy.model.selectedIndices, function (el, index) { return index == $.inArray(el, proxy.model.selectedIndices); });
				}
                this._loadContent = true;
            }
			this._newList = sublist;
            return this;
            
        },
        _applySelection: function () {
            if (!(this.model.fields.checkBy || this.model.fields.selectBy)) return false;
            if (this.model.showCheckbox) {
                this.uncheckAll();
                this.checkItemsByIndices(this.model.checkedIndices);
            }
            else {
                if (this.model.allowMultiSelection)
                    this.selectItemsByIndices(this.model.selectedIndices);
                else {
                    this.unselectAll();
                    this.selectItemByIndex(this.model.selectedIndex);
                }
            }
        },
        _getField: function (obj, fieldName) {
            return ej.pvt.getObject(fieldName, obj);
        },
        _getTemplatedString: function (list) {
            var str = this.model.template,
                start = str.indexOf("${"),
                end = str.indexOf("}");
            while (start != -1 && end != -1) {
                var content = str.substring(start, end + 1);
                var field = content.replace("${", "").replace("}", "");
                str = str.replace(content, this._getField(list, field));
                start = str.indexOf("${"), end = str.indexOf("}");
            }
            return str;
        },
        _checkboxHideShow: function (value) {
            this.model.showCheckbox = value;
            (value) ? this._createCheckbox() : this._removeCheckbox();
            return this;
        },
        _createCheckbox: function () {
            var i, _extchk, chklist, me = this;
            this._listitems = this.listContainer.find("ol,ul").length > 0 ? this.listContainer.find("ol,ul").children("li:not('.e-ghead')") : this.element.children("li:not('.e-ghead')");
            chklist = this._listitems.find('input[type=checkbox]');
            for (i = 0; i < this._listitems.length; i++) {
                if ($(this._listitems[i]).text() != "") {
                    $checkbox = ej.buildTag("input.listcheckbox e-align#popuplist" + i + "_" + this._id, "", {}, {
                        type: "checkbox",
                        name: "list" + i
                    });
                    if (!$(this._listitems[i]).find('input[type=checkbox]').length)
                        $(this._listitems[i]).prepend($checkbox);
                }
            }
            this.listContainer.find(".listcheckbox").ejCheckBox({
                cssClass: this.model.cssClass,
                change: $.proxy(this._onClickCheckList, this)
            });
            for (i = 0; i < this._listitems.length; i++) {
                var checkbox = $(this._listitems[i]).find(".listcheckbox");
                if ($(this._listitems[i]).hasClass('e-disable')) checkbox.ejCheckBox('disable');
                else if ( $(this._listitems[i]).hasClass('checkItem') && !checkbox.ejCheckBox('isChecked')) {                    
                    checkbox.ejCheckBox({
                        "checked": true
                    });
                    this._activeItem = i;
                    this.checkedStatus = true;
                    var checkData = this._getItemObject($(this._listitems[i]), null);
                    checkData["isInteraction"] = true;
                    if (!this._initValue) this._trigger('checkChange', checkData);
                    $(this._listitems[i]).removeClass('checkItem');
                }
            }
            for (i = 0; i < this.model.selectedIndices.length; i++) {
                this.checkItemsByIndices(this.model.selectedIndices);
            }
        },
        _removeCheckbox: function () {
            var i, checkbox;
            this.listitem = this.listContainer.find("ol,ul").children("li");
            checkbox = this.listitem.find('.listcheckbox');
            if (checkbox.length > 0) {
                this.listitem.find('.listcheckbox').ejCheckBox('destroy');
                this.listitem.find('input[type=checkbox]').remove();
                if (this.model.allowMultiSelection) {
                    for (i = 0; i < this.model.checkedIndices.length; i++) {
                        this.selectItemsByIndices(this.model.checkedIndices);
                    }
                } else this.selectItemByIndex(this.model.checkedIndices[0]);
                this._checkedItems = this.model.checkedIndices = [];
            }
        },
        _selectCheckedItem: function (chkitems) {
            if (chkitems.length > 0)
                for (i = 0; i < chkitems.length; i++)
                    this._selectedItems.push(chkitems[i]);
        },
        _refreshScroller: function () {
            if (this.model.virtualScrollMode == "continuous") {
                this.listContainer.css({ "display": "block" });
                if (this.scrollerObj) {
                    this.scrollerObj.model.height = this.listContainer.height();
                    this.scrollerObj.refresh();
                }
            } else {
                this.listContainer.find(".e-vhandle div").removeAttr("style");
                var listboxcontent = this.listBoxScroller.height();
                this.listContainer.css({ "display": "block" });
                if (this.scrollerObj) {
                    this.scrollerObj.model.height = this.listContainer.css("height");
                    this.scrollerObj.refresh();
                }
                this.listBoxScroller.css("height", "100%");
            }
            if (!this.model.enabled) {
                if (this.scrollerObj) this.scrollerObj.disable();
            }
            this.listContainer.css("height", this.model.height);
        },
        _setDimensions: function () {
            this.listContainer.css({ "width": this.model.width, "height": this.model.height });
            this._refreshScroller();
            return this;
        },
        _setItemsCount: function () {
            if(this.model.height=="auto"){
            if (this.model.itemsCount && this.model.itemsCount != 0 && this.model.height == "auto")
                this.model.height = this.model.itemsCount * 30;
            else
                this.model.height = (this.model.height == "auto") ? "220" : this.model.height;
              }
               else if (this.model.height != "auto" && this.model.itemsCount) {
                if (this.model.itemHeight)
                this.model.height = (this.model.height == "auto") ? "220" : this.model.itemsCount * this.model.itemHeight.replace(/[^-\d\.]/g, '');
                else
                    this.model.height = (this.model.height == "auto") ? "220" : this.model.itemsCount * 30;
            }
            else if (this.model.height != "auto" && this.model.itemsCount !=0) {
                this.model.height;
            }
            return this;
        },
        _setTotalItemsCount: function () {
            if (this.model.virtualScrollMode != "continuous") {
                this.element.height(this.element.find("li").outerHeight() * this.model.totalItemsCount);
                this.scrollerObj.refresh();
            }
        },

        _refreshContainer: function () {
            this.listContainer.css({ "position": "relative" });
            this._setDimensions()._roundedCorner()._refreshScroller();
        },
        _drag: function () {
            var proxy = this,
                pre = false,
                _clonedElement = null,
                dragContainment = null;
            this._listitem = this.element.parent();
            this._lilist = this._addItemIndex ? $($(this._listitem).find("li")[this._addItemIndex]) : $(this._listitem).find("li");
            this._lilist.not(".e-js").ejDraggable({
                dragArea: dragContainment,
                clone: true,
                dragStart: function (args) {
                  if( proxy.model.allowDrag || proxy.model.allowDragAndDrop ) {
                    if (!$(args.element.closest('.e-ddl-popup.e-js')).hasClass('e-disable') && !args.element.hasClass('e-disable')) {
                        var draggedobj = $("#" + this.element.parent()[0].id).data("ejListBox");
                        draggedobj._refreshItems();
                        var dragEle = proxy.getSelectedItems();
                        if (dragEle.length > 1 ? proxy._onDragStarts(dragEle, args.target) : proxy._onDragStarts([proxy._getItemObject(args.element, args)], args.target)) {
                            args.cancel = true;
                            _clonedElement && _clonedElement.remove();
                            return false;
                        }
                    } else {
                        _clonedElement && _clonedElement.remove();
                        return false;
                    }
                  }
                  else return false;
                },
                drag: function (args) {
                    var target = args.target;
                    var dragEle = proxy.getSelectedItems();
                    if (dragEle.length > 1 ? proxy._onDrag(dragEle, target) : proxy._onDrag([proxy._getItemObject(args.element, args)], target)) return false;
                    if ($(target).hasClass('e-droppable') || $(target).parent().hasClass('e-droppable'))
                        $(target).addClass("allowDrop");
                },
                dragStop: function (args) {
                    if (!args.element.dropped)
                        _clonedElement && _clonedElement.remove();
					if(!$(args.target).closest(".e-js.e-widget").hasClass("e-disable")){					
                    var target = args.target, targetObj = proxy;
                    var position = pre ? "Before" : "After";
                    var dragEle = proxy.getSelectedItems();
                    if (dragEle.length > 1 ? proxy._onDragStop(dragEle, target) : proxy._onDragStop([proxy._getItemObject(args.element, args)], target)) return false;
                    $(args.element).removeClass("e-active");
                    if (target.nodeName == 'UL') target = $(target)[0];
                    if ($(target).closest('li').length) target = $(args.target).closest('li')[0];
                    else if (target.nodeName != 'LI') target = $(target).closest('.e-ddl-popup.e-droppable')[0];
                    if (target && target.nodeName == 'LI' && $(target).hasClass('e-droppable') && $(target).closest('.e-ddl-popup.e-droppable').length) proxy._dropItem(target, args.element, pre, args.event);
                    else if ($(target).hasClass('e-droppable') && $(target).closest('.e-ddl-popup.e-droppable').length) proxy._dropItemContainer(target, args.element, args.event);
                    $(".allowDrop").removeClass("allowDrop");
                    if (args.target != proxy.element[0] && (args.element.parent().length && $(args.element.parent()[0]).data().ejWidgets[0] == "ejListBox")) {
                        proxy = $("#" + args.element.parent()[0].id).data($(args.element.parent()[0]).data().ejWidgets[0]);
                        if (dragEle.length > 1 ? proxy._onDropped(dragEle, target) : proxy._onDropped([proxy._getItemObject(args.element), args], args.target)) return false;
					}}
                    if( !proxy.model.allowDrag && !proxy.model.allowDragAndDrop ) proxy.element.children().removeClass("e-draggable");
                },
                helper: function (event, ui) {
                    if (!ej.isNullOrUndefined(event.element) && !$(event.element.closest('.e-ddl-popup.e-js')).hasClass('e-disable') && $(event.element).hasClass('e-draggable')) {
                        proxy = $(event.element).closest('.e-listbox.e-js').data('ejListBox');
                        proxy._tempTarget = $(event.element).text();
                        if ((proxy.model.allowDrag || proxy.model.allowDragAndDrop) && proxy) {
                            _clonedElement = $(event.sender.target).clone().addClass("dragClone e-dragClonelist");
                            _clonedElement.addClass(proxy.model.cssClass + (proxy.model.enableRTL ? ' e-rtl' : ''));
							 var maxZ = ej.util.getZindexPartial(proxy.element);
                            _clonedElement.css({ "width": proxy.element.width(), "height":$(event.element).height(), "padding": "5px 5px 5px 0.857em", "list-style": "none", "text-align": (proxy.model.enableRTL ? "right" : "left"), "opacity": "1", "z-index": maxZ});
                            return _clonedElement.appendTo($("body"));
                        }
                    }
                }
            });
        },
        _dropItem: function (target, element, pre, event) {
            element.addClass("e-droppable");
            var targetid = $(target).closest('.e-ddl-popup.e-droppable')[0].id.replace('_container', '');
            var dataIndex = [], dataObj = [];
            var droppedobj = $("#" + targetid).data("ejListBox");
            var preventDrop = (droppedobj.model.showCheckbox ? !this.model.showCheckbox : this.model.showCheckbox);
            if (preventDrop) return;
            var data = this._getDropObject(target, element, event);
            dataIndex = data.dataIndex;
            dataObj = data.dataObj;
            pre ? $(this.li).insertBefore(target) : $(this.li).insertAfter(target);
            this._refreshItems();
            var ulElements =$(this.li.parent()[0]).find("li:not('.e-ghead')");
            if (dataObj && this.dataSource())
                this._dropDataSource(droppedobj, dataIndex, dataObj, ulElements.index(this.li));
            droppedobj._refreshItems();
        },
        _dropItemContainer: function (target, element, event) {
            element.addClass("e-droppable");
            var targetid = $(target)[0].id.replace('_container', '');
            var droppedobj = $("#" + targetid).data("ejListBox");
            var preventDrop = (droppedobj.model.showCheckbox ? !this.model.showCheckbox : this.model.showCheckbox);
            if (preventDrop) return;
            var dataIndex = [], dataObj = [];
            var data = this._getDropObject(target, element, event);
            dataIndex = data.dataIndex;
            dataObj = data.dataObj;
            this.li.insertAfter($($(target).find('li')).last());
			if($(target).find('ul').length > 0) $(target).find('ul').append(this.li);
			else $(target).find('ej-listbox').append(this.li);
            this._refreshItems();
            if (dataObj && this.dataSource())
                this._dropDataSource(droppedobj, dataIndex, dataObj, droppedobj.dataSource() ? droppedobj.dataSource().length : 0);
            if (!droppedobj.model.allowDrag)
                $(this.li).ejDraggable("instance")._destroy();
            droppedobj._refreshItems();
        },
        _dropDataSource: function (droppedobj, dataIndex, dataObj, droppedIndex) {
            var preventDropData = ej.DataManager && this.dataSource() instanceof ej.DataManager;
            if (preventDropData) return;
            if (dataIndex instanceof Array) {
                var proxy = this;
                $.each(dataObj, function (index) {
                   var indx = proxy.dataSource().indexOf(dataObj[index]);
                    proxy.dataSource().splice(indx, 1);
                });
            }
            else
                this.dataSource().splice(dataIndex, 1);
            if (droppedobj.dataSource() instanceof Array) {
                droppedobj.dataSource().splice.apply(droppedobj.dataSource(), [droppedIndex, 0].concat(dataObj));
            }
            else {
                droppedobj.dataSource(dataObj);
            }
        },
        _getDropObject: function (target, element, event) {
            var dataIndex = [], dataObj = [];
            if (this.model.allowMultiSelection) {
                this.li = $(element).parent().find(".e-select").removeClass("e-select e-hover");
                if(this.li.index(element[0]) == -1) this.li = element;
                if (!this.li.length)
                 this.li = element.removeClass("e-select e-hover");
            }
            else
                this.li = element.removeClass("e-select e-hover");

            if (this.li.length) {
               var proxy = this;
               var sortFlg=this.model.sortOrder.toLowerCase();
                $.each(this.li, function (ele) {
                    var ulElements=$(this.parentElement).find("li:not('.e-ghead')");
                    dataIndex.push(ulElements.index(this));
                            if( sortFlg!="none"){
                    var sortQuery = ej.Query().sortBy(proxy.mapFld._text,sortFlg, true);
                    dataAfterSort = ej.DataManager(proxy.dataSource()).executeLocal(sortQuery);
                dataObj.push((proxy.dataSource()) ? dataAfterSort[ulElements.index(this)] : null);
            }
            else
                    dataObj.push((proxy.dataSource()) ? proxy.dataSource()[ulElements.index(this)] : null);
                });
            }
            else {
                dataIndex = this.li.index();
                dataObj = (this.dataSource()) ? this.dataSource()[dataIndex] : null;
            }
            return { "dataIndex": dataIndex, "dataObj": dataObj };
        },
        _showResult: function () {
            var proxy = this;
            this._refreshContainer();
            this.element.attr({
                "aria-expanded": true
            });
            var _ListItemsContainer = this.element.children("li:not('.e-ghead')");
            this._listSize = _ListItemsContainer.length;
			this._ListEventUnbind(_ListItemsContainer);
            _ListItemsContainer.on("touchstart mouseenter", $.proxy(this._OnMouseEnter, this));
            _ListItemsContainer.on("touchend mouseleave", $.proxy(this._OnMouseLeave, this));
            _ListItemsContainer.on("click", $.proxy(this._OnMouseClick, this));
            _ListItemsContainer.on("contextmenu", $.proxy(this._OnMouseContext, this));            
            if (proxy.model.showCheckbox) proxy.element.find(".listcheckbox").ejCheckBox({ enabled: proxy.model.enabled });
            return this;
        },
        _OnWindowResize: function (e) {
            this._refreshContainer();
            this.listContainer.css("display", "block");
        },
        refresh: function (value) {
		    if (!ej.isNullOrUndefined(this.model.query)) this._savedQueries = this.model.query; 
            if (this.model.dataSource) {
                if (this.model.template)
                    this.element.empty();
                this._checkModelDataBinding(this.dataSource());
            }
            else {
                this.listContainer.css({ "height": this.model.height, "width": this.model.width });
                this._refreshScroller();
            }
        },
        _removeListHover: function () {
            this._selectedItems = [];
            this.model.selectedIndices = [];
            this.model.selectedIndex = null;
            this.element.children("li").removeClass("e-hover e-select selectItem");
            return this;
        },
        _addListHover: function () {
            this._activeItem = this._selectedItem;
            var activeItem = this._getItem(this._selectedItem);
            activeItem.addClass("e-select e-hover");
            this.scrollerObj.setModel({ "scrollTop": this._calcScrollTop() });
            activeItem.focus();
            this._OnListSelect(this.prevselectedItem, this._selectedItem);
        },
        _calcScrollTop: function (value) {
            var ulH = this.element.outerHeight(),
                li = this.element.find("li"),
                liH = 0,
                index, top, i;
            index = value ? value : this.element.find("li.e-select").index();
            for (i = 0; i < index; i++)
                liH += li.eq(i).outerHeight();
            top = liH - ((this.listContainer.outerHeight() - li.eq(index).outerHeight()) / 2);
            return top;
        },
        _refreshItems: function () {
            this.listBoxScroller.append(this.element);
            this.listContainer.append(this.listBoxScroller);
            this._refreshContainer();
            this._showResult();
            this._setSelectionValues();
            this._setDisableValues();
        },
        _selectedIndices: function () {
            var selectItem;
            this.element.children("li:not('.e-ghead')").each(function (index) {
                if ($(this).hasClass("e-select")) {
                    selectItem = index;
                    return false
                }
            });
            this._selectedItem = selectItem;
            return selectItem;
        },
        _addSelectedItem: function (e) {
            if ((!Array.isArray(this.model.disableItemsByIndex) && this.model.disableItemsByIndex != null) || (Array.isArray(this.model.disableItemsByIndex) && this.model.disableItemsByIndex.length > 0)) {
                if (e.keyCode == 40 || e.keyCode == 39) this._disableItemSelectDown();
                else this._disableItemSelectUp();
                this._selectedItem = this._activeItem
            }
            var activeItem = this._getItem(this._selectedItem);
            this._selectedItems.push(activeItem)
        },
        _getItem: function (val) {
            return $(this.element.children("li:not('.e-ghead')")[val])
        },
        _getItemObject: function (item, evt) {
            var index = this._elementIndex(item);
            return {
                item: item,
                index: index,
                text: item.text(),
                value: item.attr("value") ? item.attr("value") : item.text(),
                isEnabled: !item.hasClass("e-disable"),
                isSelected: item.hasClass("e-select"),
                isChecked: item.find('.e-chk-image').hasClass('e-checkmark'),
                data: this.dataSource() ? this.getListData()[index] : null,
                event: evt ? evt : null
            };
        },
        _roundedCorner: function () {
            this.listContainer[(this.model.showRoundedCorner ? "addClass" : "removeClass")]("e-corner-all");
            return this;
        },
        _enabled: function (boolean) {
            boolean ? this.enable() : this.disable();
            return this;
        },
        _showFullList: function () {
            if (this.dataSource() != null) {
                if (!(ej.DataManager && this.dataSource() instanceof ej.DataManager))
                    this.listitems = this.dataSource();
                if (this._savedQueries.queries.length && !(ej.DataManager && this.dataSource() instanceof ej.DataManager))
                    this.listitems = ej.DataManager(this.dataSource()).executeLocal(this._savedQueries);
            }
            this._renderlistContainer();
            if (!(this.dataSource() instanceof ej.DataManager)) this._trigger("actionComplete");
            this._addDragableClass()._enableDragDrop();
            this._disabledItems = [];
            this.disableItemsByIndices(this.model.disableItemsByIndex);
            if (this.model.selectedIndex == 0) this.selectItemByIndex(this.model.selectedIndex);
            else this.model.selectedIndex && this.selectItemByIndex(this.model.selectedIndex);
            this.selectItemsByIndices(this.model.selectedIndices);
            this.checkItemsByIndices(this.model.checkedIndices);
            this._tooltipList();
            return this;
        },
        _tooltipList: function(){
             if (this.listContainer.find('li').hasClass('e-tooltip')){
                $(this.listContainer).ejTooltip({
                    target: ".e-tooltip",
                    isBalloon: false,
                    position: {
                        target: { horizontal: "center", vertical: "bottom" },
                        stem: { horizontal: "left", vertical: "top" }
                    }
                });
            }
       },
        _cascadeAction: function () {
            if (this.model.cascadeTo) {
                this._currentValue = this._getField(this.listitems[this._activeItem], this.mapFld._value);
                this.selectDropObj = $('#' + this.model.cascadeTo).ejListBox('instance');
                 $.extend(true, this.selectDropObj, { _isCasCadeTarget: true });
                if (ej.isNullOrUndefined(this._dSource))
                    this._dSource = this.selectDropObj.dataSource();
                this._performJsonDataInit();
			     var args = { cascadeModel: this.selectDropObj.model, cascadeValue: this._currentValue, setCascadeModel:{}, requiresDefaultFilter: true };
                this._trigger("cascade", args);	
                this.selectDropObj._setCascadeModel = args.setCascadeModel;				
            }
        },
        _performJsonDataInit: function () {
            this._changedSource = ej.DataManager(this._dSource).executeLocal(ej.Query().where(this.mapFld._value, "==", this._currentValue));
            this.selectDropObj.setModel({
                dataSource: this._changedSource,
                enable: true,
                value: "",
                selectedIndex: -1                
            })
        },
        _OnMouseContext: function (e) {
            e.preventDefault();
            return false
        },
        _OnMouseEnter: function (e) {
            this.startime = 0;
            this.item = "";
            if (e.type == "touchstart") {
                this.item = $(e.target).text();
                this.startime = new Date().getTime()
            }
            if (this.model.enabled) {
                var targetEle;
                this.element.children("li").removeClass("e-hover");
                if ($(e.target).is("li")) $(e.target).addClass("e-hover");
                if ($(e.target).hasClass("e-disable")) $(e.target).removeClass('e-hover');
                else if (e.target.tagName != "li") {
                    targetEle = $(e.target).parents("li");
                    $(targetEle).addClass("e-hover")
                }
                var activeItem, selectItem = 0;
                this.element.children("li:not('.e-ghead')").each(function (index) {
                    if ($(this).hasClass("e-hover")) {
                        activeItem = index;
                        return false
                    }
                });
                this._hoverItem = activeItem
            }
        },
        _OnMouseLeave: function (e) {
            this.element.children("li").removeClass("e-hover");
            this.endtime = new Date().getTime();
            if ((((this.endtime - this.startime) / 200) > 2))
                if ((this.item == $(e.target).text())) this.hold = (((this.endtime - this.startime) / 200) > 2) ? !this.hold : false;
        },
        _OnMouseClick: function (e) {
            if($(e.currentTarget).hasClass("e-disable")) return false;
            if (e.which == 3)
                this.hold = true;
            this.endtime = new Date().getTime();
            if ((((this.endtime - this.startime) / 200) > 2))
                if ((!this.model.template && this.item == $(e.target).text()) && (!this.hold))
                    this.hold = (((this.endtime - this.startime) / 200) > 2);
            if (e.shiftKey && this._shiftkey) {
                this._shiftkey = false;
                this.prevselectedItem = this._activeItem;
            }
            if (!ej.isNullOrUndefined(this._hoverItem)) this._activeItem = this._hoverItem;
            if (this.model.enabled && this._activeItem != undefined) {
                if (!e.shiftKey || isNaN(this.prevselectedItem)) {
                    this._shiftkey = true;
                    this.prevselectedItem = this._lastEleSelect ? this._lastEleSelect : this._activeItem;                    
                }
                if (!this.model.showCheckbox) {
                    var activeitem = $(this.element.children("li:not('.e-ghead')")[this._hoverItem]);
                    if (!this.model.allowMultiSelection || (!(e.ctrlKey || this.touchhold || this.hold) && !e.shiftKey))
                        this._removeListHover();
                    this.element.children("li").removeClass('e-hover');
                    if (!activeitem.hasClass('e-select') ||(e.shiftKey && this.model.allowMultiSelection)) {
                        activeitem.addClass('e-select');
                        this._selectedItems.push(activeitem);
                        this.model.selectedIndices.push(this._activeItem);
                        if (e.shiftKey && (this.model.allowMultiSelection)) {
                            if (!e.ctrlKey) this._removeListHover();
                            var initial, last;
                            if (this.prevselectedItem < this._activeItem)
                                initial = this.prevselectedItem, last = this._activeItem;
                            else
                                initial = this._activeItem, last = this.prevselectedItem;
                            this._activeItemLoop(initial,last);
                        }
                    } else {
                        activeitem.removeClass('e-select');
                        this._selectedItems.splice(this.model.selectedIndices.indexOf(this._activeItem), 1);
                        this.model.selectedIndices.splice(this.model.selectedIndices.indexOf(this._activeItem), 1);
                    }
                    this._selectedItem = this._selectedIndices();
                    this.model.selectedIndex = this._activeItem;
                    this._cascadeAction();
                    var selecteditem = $(this.element.children("li:not('.e-ghead')")[this._selectedItem]);
                    if ($(selecteditem).text() != "") {
                        this.element.val($(selecteditem).text());
                        this.element.attr({
                            "value": this.element.val()
                        });
                    }
                    this.model.selectedText = activeitem.text();
                    this._selectedData = this._getItemObject($(selecteditem), e);
                    this._selectedData["isInteraction"] = true;
                    if (this._prevSelectedData && (this._selectedData.text != this._prevSelectedData.text))
                        this._trigger("unselect", this._prevSelectedData)
                    this._trigger("select", this._selectedData);
                    this._prevSelectedData = this._selectedData;
                    this._lastEleSelect = this._activeItem;
                    if (this._selectedItems && this._selectedItems.length != 1)
                        this._ctrlClick = true;
                } else {
                    if (($(e.currentTarget).is("li")) && ($(e.target).is("li"))) {
                        if ($(e.currentTarget.firstChild).find('.listcheckbox').ejCheckBox('isChecked')) {
                            $(e.currentTarget.firstChild).find('.listcheckbox').ejCheckBox('option', 'checked', false);
                            var index = this.model.checkedIndices.indexOf($(e.currentTarget).index());
                            this._checkedItems.splice(index, 1);
                            this.model.checkedIndices.splice(index, 1);
                            this.checkedStatus = false;
                        } else {
                            $(e.currentTarget.firstChild).find('.listcheckbox').ejCheckBox('option', 'checked', true);
                            this._checkedItems.push(this._activeItem);
                            this.model.checkedIndices.push(this._elementIndex(e.currentTarget));
                            this.checkedStatus = true;
                        }
                    }
                    else if (($(e.currentTarget).is("li")) && ($(e.target).is("span"))) {
                        if ($(e.currentTarget.firstChild).find('.listcheckbox').ejCheckBox('isChecked')) {
                            this._checkedItems.push(this._activeItem);
                            this.model.checkedIndices.push($(e.currentTarget).index());
                            this.checkedStatus = true;
                        }
                        else {
                            var index = this.model.checkedIndices.indexOf($(e.currentTarget).index());
                            this._checkedItems.splice(index, 1);
                            this.model.checkedIndices.splice(index, 1);
                            this.checkedStatus = false;
                        }
                    }
                    else
                        return false;
                    this.selectedTextValue = $(e.currentTarget).text();
                    if (!this.element.hasClass("e-disable") && $(e.target).is("li")) {
                        var args = {
                            status: this.model.enabled,
                            isChecked: this.checkedStatus,
                            selectedTextValue: this.selectedTextValue
                        };
                        var checkData = this._getItemObject($(e.target), e);
                        checkData["isInteraction"] = true;
                        this._trigger("checkChange", checkData);
                    }
                    this._lastEleSelect = $(e.currentTarget).index();
                }
                if (e.ctrlKey || e.shiftKey) e.shiftKey ? (this._shiftSelectItem = this._activeItem, this._ctrlSelectItem = null)  : (this._ctrlSelectItem = this._activeItem, this._shiftSelectItem = null);
                else {
                    this._shiftSelectItem = null;
                    this._ctrlSelectItem = null;
                }
                this._setSelectionValues()._OnListSelect(this.prevselectedItem, this._activeItem);
            }
            if (e.target.nodeName != "INPUT")
                this.listContainer.focus();
			this._pageUpStep = this._pageDownStep = null;
        },
		_activeItemLoop: function (initial , last) {
		    if (this.model.showCheckbox) {
		        var items = this.listContainer.find('li:not(.e-disable)');
		        items.find(".listcheckbox").ejCheckBox('option', 'checked', false);
				this._checkedItems = [];
                this.model.checkedIndices = [];
			}
			for (var i = initial; i <= last; i++) {
			    if (this.model.showCheckbox && !this.listContainer.find('li').eq(i).hasClass('e-disable')) {
					this.element.find('.listcheckbox').eq(i).ejCheckBox('option', 'checked', true);
                    this._checkedItems.push(i);
                    this.model.checkedIndices.push(i);
                    this.checkedStatus = true;
                }
				else {
			        activeitem = $(this.element.children("li:not('.e-ghead')")[i]);
                    if (!activeitem.hasClass('e-disable')) {
                        if (!activeitem.hasClass('e-select')) activeitem.addClass('e-select');
                        this._selectedItems.push(activeitem);
                        this.model.selectedIndices.push(i);
                    }
                }
            }
		},
        _setSelectionValues: function () {
            var selectionArray = [];
            var oldSelectedIndices = this.model.selectedIndices;
            var oldCheckedIndices = this.model.checkedIndices;
            this.model.selectedIndices = [];
            this.model.checkedIndices = [];
            var proxy = this;
            if (!this.model.showCheckbox) {
                if (!ej.isNullOrUndefined(this._activeItem) && this._activeItem >= 0) this.model.selectedIndex = this._activeItem;
                var liItem = this.element.children("li:not('.e-ghead')");
                this.element.children("li:not('.e-ghead').e-select").each(function (index, ele) {
                    selectionArray.push($(ele).attr("value") ? $(ele).attr("value") : !ej.isNullOrUndefined(proxy.model.fields.text) && proxy.dataSource() ? proxy.getListData()[proxy._elementIndex(ele)][proxy.model.fields.text] : $(ele).text());
                    proxy.model.selectedIndices.push(liItem.index(ele));
                });
            }
            else {
                this.element.find("li:not('.e-ghead') .listcheckbox:checked").closest('li').each(function (index, ele) {
                    selectionArray.push($(ele).attr("value") ? $(ele).attr("value") : !ej.isNullOrUndefined(proxy.model.fields.text) && proxy.dataSource() ? proxy.getListData()[proxy._elementIndex(ele)][proxy.model.fields.text] : $(ele).text());
                    proxy.model.checkedIndices.push(proxy._elementIndex(ele));
                });
            }
            if (ej.DataManager && ej.DataManager && this.dataSource() instanceof ej.DataManager && this.model.allowVirtualScrolling) {
                if (this.model.showCheckbox) {
                    for (var i = 0; i < oldCheckedIndices.length; i++) {
                        if (this.model.checkedIndices.indexOf(oldCheckedIndices[i]) == -1)
                            this.model.checkedIndices.push(oldCheckedIndices[i]);
                    }
                }
                else {
                    for (var i = 0; i < oldSelectedIndices.length; i++) {
                        if (this.model.selectedIndices.indexOf(oldSelectedIndices[i]) == -1)
                            this.model.selectedIndices.push(oldSelectedIndices[i]);
                    }
                }
            }
            this.model.selectedItemIndex = this.model.selectedIndex;
            this.model.selectedItems = this.model.selectedItemlist = this.model.selectedIndices;
            this.model.checkedItems = this.model.checkedItemlist = this.model.checkItemsByIndex = this.model.checkedIndices;
			this.model.text = "";
			if(this.model.showCheckbox){
               var checked = this.getCheckedItems();
				for(i = 0;i < checked.length;i++){			
				         this.model.text +=  checked[i].text + ","
			        }
			}else{
                var selected = this.getSelectedItems();
				for(i = 0;i < selected.length;i++){			
				         this.model.text +=  selected[i].text + ","
			        }	
			}
            this.value(selectionArray.toString());
            this._hiddenInput.val(this.value());
            return this;
        },
        _setDisableValues: function () {
            this._disabledItems = [];
            this.model.disableItemsByIndex = [];
            var lenth = this.element.children().length, indx;
            for (var indx = 0; indx < lenth; indx++)
                if ($(this.element.children()[indx]).hasClass('e-disable'))
                    this.model.disableItemsByIndex.push(indx);
            this.disableItemsByIndices(this.model.disableItemsByIndex);
        },
        _onClickCheckList: function (e) {
			if(!e.isChecked) $("#"+ e.model.id).closest('li').removeClass("checkItem");
            if (e.isInteraction) {
                this.checkedStatus = e.isChecked ? true : false;
                if (!this._initValue) {
                    this.checkedStatus ? this.model.checkedIndices.push($(e.event.target).closest('li:not(".e-ghead")').index()) : this.model.checkedIndices.splice($.inArray($(e.event.target).closest('li:not(".e-ghead")').index(), this.model.checkedIndices), 1);
                    var checkData = this._getItemObject($(e.event.target).closest('li'), e);
                    checkData["isInteraction"] = true;
                    this._trigger('checkChange', checkData);
                }
            }
        },
		_elementIndex: function (args) {
		    return $(args).parent().children("li:not('.e-ghead')").index(args);
		},
        _disableItemSelectCommon: function () {
            this.listitems = this.element.find('li');
            this._activeItem = this.listitems.index(this.element.find(".e-select"));
        },

        _disableItemSelectUp: function () {
            this._disableItemSelectCommon();
            var disableList = (typeof (this.model.disableItemsByIndex) != "object") ? this.model.disableItemsByIndex.split(",").sort().reverse() : this.model.disableItemsByIndex;
            if (this._activeItem == 0) this._activeItem = this.listitems.length - 1;
            else this._activeItem--;
            for (var lists = 0;
                ($.inArray(this._activeItem.toString(), disableList.toString())) > -1; lists++) {
                this._activeItem--;
                if (this._activeItem < 0) this._activeItem = this.listitems.length - 1
            }
            $(this.element.children("li")[this._activeItem]).addClass('e-select')
        },
        _disableItemSelectDown: function () {
            this._disableItemSelectCommon();
            var disableList = (typeof (this.model.disableItemsByIndex) != "object") ? this.model.disableItemsByIndex.split(",").sort() : this.model.disableItemsByIndex;
            ((this.listitems.length - 1) == this._activeItem) ? this._activeItem = 0 : this._activeItem++;
            for (var lists = 0;
                ($.inArray(this._activeItem.toString(), disableList.toString())) > -1; lists++) {
                this._activeItem++;
                if ((this.listitems.length) == this._activeItem) this._activeItem = 0
            }
            $(this.element.children("li")[this._activeItem]).addClass('e-select')
        },
        _checkitems: function () {
            if (this.model.showCheckbox) {
                var listitems = this.element.find("li:not('.e-ghead')");
                for (i = 0; i < this.model.checkedIndices.length; i++) {
                    var item = this.model.checkedIndices[i];
                    $(listitems[item]).find('.listcheckbox').ejCheckBox('option', 'checked', true);
                    this._checkedItems.push(listitems[item])
                }
            } else {
                if (this.model.allowMultiSelection) {
                    for (i = 0; i < this.model.selectedIndices.length; i++) {
                        var item = this.model.selectedIndices[i];
                        if (!($(this.listitem[item]).hasClass("e-select"))) {
                            $(this.listitem[item]).addClass("e-select");
                            this._selectedItems.push($(this.listitem[item]));
                        }
                    }
                } else {
                    if (!($(this.listitem[this.model.selectedIndex]).hasClass("e-select")))
                        $(this.listitem[this.model.selectedIndex]).addClass("e-select");
                    this._selectedItems.push($(this.listitem[this.model.selectedIndex]))
                }
            }
            this._setSelectionValues();
            return this;
        },

        _onlistselection: function (previtem, selecteditem, e) {
            if (previtem != selecteditem) {
                var selectData = this._getItemObject($(this.element.find("li:not('.e-ghead')")[selecteditem]), e);
                selectData["isInteraction"] = true;
                this._trigger('change', selectData);
            }
        },

        _OnListSelect: function (previtem, selecteditem, e) {
            if (!ej.isNullOrUndefined(previtem) && previtem != selecteditem && !this.model.showCheckbox) {
                var selectData = this._getItemObject($(this.element.find("li:not('.e-ghead')")[selecteditem]), e);
                selectData["isInteraction"] = true;
                this._trigger('change', selectData);
            }
        },
        _OnKeyDown: function (e) {
            if (this.model.enabled) {
                if (this._selectedItems && this._selectedItems.length == 1 && !this.model.showCheckbox)
                    this._lastEleSelect = $(this.element.children("li.e-select")).index();
                this._itemId = null;
                var _ListItemsContainer = this.element.children("li:not('.e-ghead')"), proxy = this, liH, popupH, activeitem;
                popupH = this.listContainer.height();
                liH = _ListItemsContainer.outerHeight();
                activeitem = Math.round(popupH / liH) != 0 ? Math.floor(popupH / liH) : 7;
                this._listSize = this.element.children("li").length;
                if (!e.shiftKey) this._up = this._down;
				if(e.keyCode != 33 && e.keyCode != 34) this._pageUpStep = this._pageDownStep = null;
                switch (e.keyCode) {
                    case 37:
                    case 38:
                        var liItems = this.listItemsElement;
                        var selectedIndex = this._shiftSelectItem ? this._shiftSelectItem : this._ctrlSelectItem ? this._ctrlSelectItem : (this.model.showCheckbox) ? (this._lastEleSelect || 0) : liItems.index(this.element.find("li.e-select"));
                        if (e.shiftKey && this.model.allowMultiSelection && !this.model.showCheckbox) {
                            if (this._lastEleSelect == 0) return false;
                            this._lastEleSelect = (this._ctrlClick) ? this._lastEleSelect - 1 : this._lastEleSelect;
                            selectedIndex = this._lastEleSelect;
                            this._selectedItem = (selectedIndex || selectedIndex == 0) ? (selectedIndex == 0 ? this._listSize - 1 : (this._down ? selectedIndex : selectedIndex - 1)) : 0;
                            for (var i = this._selectedItem; $(_ListItemsContainer[i]).hasClass("e-disable") ; i--)
                                this._selectedItem -= 1;
                            if($(_ListItemsContainer[this._selectedItem]).hasClass("e-select") && this.element.find("li.e-select").length == 1) this._selectedItem -= 1;
                            var activeItem = $(_ListItemsContainer[this._selectedItem]);
                            if (activeItem.hasClass("e-select")) {
                                if (this._selectedItem == 0) return;
                                activeItem.removeClass("e-select");
                                this._selectedItems.pop();
                            }
                            else {
                                activeItem.addClass("e-select");
                                this._selectedItems.push(activeItem);
                            }
                            this.scrollerObj.setModel({ "scrollTop": this._calcScrollTop(this._selectedItem) });
                            this._up = true;
                            this._down = false;
                            this._ctrlClick = false;
                        }
                        else {
                            this._selectedItem = (selectedIndex || selectedIndex == 0) ? (selectedIndex == 0 ? this._listSize - 1 : selectedIndex - 1) : 0;
                            for (var i = this._selectedItem; $(_ListItemsContainer[i]).hasClass("e-disable") ; i--)
                                this._selectedItem -= 1;
                            if (this._selectedItem == -1) this._selectedItem = this._listSize - 1;
                            this._addSelectedItem(e);
                            $(_ListItemsContainer).removeClass("e-hover e-select");
                            var addClass = (this.model.showCheckbox) ? "e-hover" : "e-select";
                            $(_ListItemsContainer[this._selectedItem]).addClass(addClass);
                            this.scrollerObj.setModel({ "scrollTop": this._calcScrollTop(this._selectedItem) });
                        }
						this._activeItem = this.prevselectedItem = this._selectedItem;
                        this._OnListSelect(this._selectedItem + 1, this._selectedItem, e);
                        this._lastEleSelect = this._selectedItem;
                        this._keyCascade(_ListItemsContainer[this._selectedItem]);
                        this._setSelectionValues();
                        this._shiftSelectItem = this._ctrlSelectItem = null;
                        e.preventDefault();
                        return false;
                        break;
                    case 39:
                    case 40:
                        var liItems = this.listItemsElement;
                        var selectedIndex = this._shiftSelectItem ? this._shiftSelectItem : this._ctrlSelectItem ? this._ctrlSelectItem : (this.model.showCheckbox) ? (this._lastEleSelect || 0) : liItems.index(this.element.find("li.e-select"));
                        if (e.shiftKey && this.model.allowMultiSelection && !this.model.showCheckbox) {
                            if (this._lastEleSelect == this._listSize - 1) return false;
                            this._lastEleSelect = (this._ctrlClick) ? this._lastEleSelect + 1 : this._lastEleSelect;
                            selectedIndex = this._lastEleSelect;
                            this._selectedItem = (selectedIndex || selectedIndex == 0) ? (selectedIndex == this._listSize - 1 ? 0 : ((this._up || this._ctrlClick) ? selectedIndex : selectedIndex + 1)) : 0;
                            for (var i = this._selectedItem; $(_ListItemsContainer[i]).hasClass("e-disable") ; i++)
                                this._selectedItem += 1;
							if($(_ListItemsContainer[this._selectedItem]).hasClass("e-select") && this.element.find("li.e-select").length == 1) this._selectedItem += 1;		
                            var activeItem = $(_ListItemsContainer[this._selectedItem]);
                            if (activeItem.hasClass("e-select")) {
                                activeItem.removeClass("e-select");
                                this._selectedItems.pop();
                            }
                            else {
                                activeItem.addClass("e-select");
                                this._selectedItems.push(activeItem);
                            }
                            this.scrollerObj.setModel({ "scrollTop": this._calcScrollTop(this._selectedItem) });
                            this._up = false;
                            this._down = true;
                            this._ctrlClick = false;
                        }
                        else {
                            this._selectedItem = (selectedIndex || selectedIndex == 0) ? (selectedIndex == this._listSize - 1 ? 0 : selectedIndex + 1) : 0;
                            for (var i = this._selectedItem; $(_ListItemsContainer[i]).hasClass("e-disable") ; i++)
                                this._selectedItem += 1;
                            if (this._selectedItem == this._listSize) this._selectedItem = 0;
                            this._addSelectedItem(e);
                            $(_ListItemsContainer).removeClass("e-hover e-select");
                            var addClass = (this.model.showCheckbox) ? "e-hover" : "e-select";
                            $(_ListItemsContainer[this._selectedItem]).addClass(addClass);
                            this.scrollerObj.setModel({ "scrollTop": this._calcScrollTop(this._selectedItem) });
							this.element.find("li").removeClass("selectItem");
							this.model.selectedIndices.length = 0;
							this.model.selectedIndices.push(this._selectedItem);
                        }
						this._activeItem = this.prevselectedItem = this._selectedItem;
                        this._OnListSelect(this._selectedItem - 1, this._selectedItem);
                        this._lastEleSelect = this._selectedItem;
                        this._keyCascade(_ListItemsContainer[this._selectedItem]);
                        this._setSelectionValues();
                        this._shiftSelectItem = this._ctrlSelectItem = null;
                        return false;
                        break;
                    case 8:
                    case 9:
                    case 13:
                        if (this.model.showCheckbox) {
                            if (this.model.checkedIndices.indexOf(this._selectedItem) < 0)
                                this.checkItemByIndex(this._selectedItem);
                            else
                                this.uncheckItemByIndex(this._selectedItem);
                        }
                        break;
                    case 18:
                    case 33: /* page up */
                        var step = e.keyCode == 33 ? activeitem : 1;
						if (e.shiftKey && this.model.allowMultiSelection) { 
							if(this._pageUpStep == null) this._pageUpStep = this.prevselectedItem;
							if(this._pageDownStep == null) this._pageDownStep = this.prevselectedItem;
							if(this._pageDownStep <= this.prevselectedItem) {
								start = this._pageUpStep - step > 0  ? this._pageUpStep - step : 0;
								end = this._pageDownStep;
							}
							else {
								start = this.prevselectedItem;
								end = this._pageDownStep - step > this.prevselectedItem  ? this._pageDownStep - step : this.prevselectedItem;
							}
							this._shiftHomeAndEndKeyProcess( start,end, end > this.prevselectedItem ? end:start);
							this._pageUpStep = start;
							this._pageDownStep =end;
						}
                        else this._moveUp(this._activeItem, step);
					    this.scrollerObj.setModel({ "scrollTop": this._calcScrollTop() });
                        this._preventDefaultAction(e);
                        break;
                    case 34: /* page down */
                        var step = e.keyCode == 34 ? activeitem : 1;
                        if (e.shiftKey && this.model.allowMultiSelection){
                            if(this._pageUpStep == null) this._pageUpStep = this.prevselectedItem;
                            if(this._pageDownStep == null) this._pageDownStep = this.prevselectedItem;
                            if( this._pageUpStep == 0 && this.prevselectedItem != 0) { 
								if( this._pageUpStep + step >= this.prevselectedItem) start = end = this.prevselectedItem;
								else {
									start = this._pageUpStep + step ;
									end = this._pageDownStep + step < this.element.children("li").length ?  this._pageDownStep + step : this.element.children("li").length-1;
                               }
                            }
                            else if(this._pageUpStep != this.prevselectedItem && this._pageUpStep + step >= this.prevselectedItem) start = end = this.prevselectedItem;
                            else {
                                start = this._pageUpStep;
                                end = this._pageDownStep + step < this.element.children("li").length ?  this._pageDownStep + step : this.element.children("li").length-1;
                            }
                            if(start < this.prevselectedItem && end > this.prevselectedItem ) end = this.prevselectedItem;
                            this._shiftHomeAndEndKeyProcess(start,end, start < this.prevselectedItem ? start:end);
                            this._pageUpStep = start;
                            this._pageDownStep =end;
                        } 
                        else this._moveDown(this._activeItem, step);
						this.scrollerObj.setModel({ "scrollTop": this._calcScrollTop() });
                        this._preventDefaultAction(e);
                        break;
                    case 35:
                        if (e.shiftKey && this.model.allowMultiSelection) this._shiftHomeAndEndKeyProcess(this._activeItem,(this._listSize - 1) , (this._listSize - 1));
                        else this._homeAndEndKeyProcess(e, _ListItemsContainer, (this._listSize - 1));
                        for (var i = this._listSize - 1; i > 0; i--) {
                            if (!$(this.element.find('li')[i]).hasClass('e-disable')) {
                                this.model.selectedIndex = i;
                                this._shiftSelectItem = i;
                               if (this.model.allowVirtualScrolling == true) proxy._onScroll(e);
                                return false;
                            }
                        }
                    break;
                case 36:
                    if (e.shiftKey && this.model.allowMultiSelection) this._shiftHomeAndEndKeyProcess(0, this._activeItem, 0);
                    else this._homeAndEndKeyProcess(e, _ListItemsContainer, 0);
                    for (var i = 0; i < this._listSize; i++) {
                        if (!$(this.element.find('li')[i]).hasClass('e-disable')) {
                            this.model.selectedIndex = i;
                            return false;
                        }
                    }
                    break;
                }
            }
        },
        _moveUp: function (current, step) {
            if (current == null || current <= 0)  this._checkDisableStep(0, step, false);
            else if (current > this._listSize - 1) this._checkDisableStep(this._listSize - 1, step, false);
            else if (current > 0 && current <= this._listSize - 1) this._checkDisableStep(current, step, false);
        },
        _moveDown: function (current, step) {
            if (current == null || current < 0) this._checkDisableStep(-1, step, true);
            else if (current == 0)  this._checkDisableStep(0, step, true);
            else if (current >= this._listSize - 1) this._checkDisableStep(this._listSize - 1, step, true);
            else if (current < this._listSize - 1)  this._checkDisableStep(current, step, true);
        },
        _checkDisableStep: function (current, step, isdown, shift) {
            var command = isdown ? "_disableItemSelectDown" : "_disableItemSelectUp";
            var index = isdown ? current + step : current - step;
            var select = this[command](index);
            if (select == null) {
                for (var i = step; i >= 0; i--) {
                    index = isdown ? current + i : current - i;
                    select = this[command](index);
                    if (select != null) break;
                }
            }
            if (select != null)
                this.selectItemByIndex(select);
        },
        _disableItemSelectDown: function (current) {
            if (current == null || current < 0) current = 0;
            if (current < this._listSize) {
                if ($.inArray(current, this._disabledItems) < 0) 
                    return current;
                else
                    return this._disableItemSelectDown(current + 1);
            }
            else return this._listSize - 1;
        },

        _disableItemSelectUp: function (current) {
            if (current == null || current < 0) current = 0;
            if (current < this._listSize) {
                if ($.inArray(current, this._disabledItems) < 0) 
                    return current;
                else {
                    if (current > 0) 
                        return this._disableItemSelectUp(current - 1);
                }
            }
        },

        _preventDefaultAction: function (e, stopBubble) {
            e.preventDefault ? e.preventDefault() : (e.returnValue = false);
            if (stopBubble) 
                e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true);
        },
        _homeAndEndKeyProcess: function (e, _ListItemsContainer, index) {
            if ($(':focus').length && $(':focus')[0].nodeName != "INPUT") {
                this._OnListSelect(this._selectedItem, index);
                this.selectItemByIndex(index);
                this._selectedItem = index;
                this.scrollerObj.setModel({ "scrollTop": this._calcScrollTop(index) });
                if (this.model.showCheckbox) {
                    this._removeListHover();
                    $(_ListItemsContainer[index]).addClass("e-hover");
                    this._lastEleSelect = this._selectedItem = index;
                }
                this._keyCascade(_ListItemsContainer[index],e);
                e.preventDefault();
                return false;
            }
        },
        _shiftHomeAndEndKeyProcess: function(initial , last , index) {
			this._removeListHover();
			this._activeItemLoop(initial ,last);
			this.scrollerObj.setModel({ "scrollTop": this._calcScrollTop(index) });
            return false;
		},
        _keyCascade: function (obj, evt) {
            var selectData = this._getItemObject($(obj), evt);
            this.model.selectedText = selectData.text;
            selectData["isInteraction"] = true;
            this._trigger("select", selectData);
            if (this.model.cascadeTo) {
                this._activeItem = this._selectedItem;
                this._cascadeAction();
            }
        },

        mergeData: function (data,skipInitial) {
            this.datamerged=true;
            this.mergeUl = $();
            this._setMapFields();
            var proxy = this;
            this._skipInitialRemoteData = skipInitial ? skipInitial : false;
            if (ej.DataManager && data instanceof ej.DataManager) {
                var queryPromise = data.executeQuery(this._getQuery());
                queryPromise.done(function (e) {
                    proxy.mergeValue = e.result;
                    proxy._renderlistContainer();
                });
            }
            else {
                this.mergeValue = data;
                if(!ej.isNullOrUndefined(this.model.fields.groupBy) && this.datamerged && this.groupData)
                 this.listitems= this.listitems[0].items ? this.listitems[0].items:this.dataSource();
                else{
                this.groupData = true;
                this.listitems = this.listitems ? this.listitems : this.dataSource();
                }
                this._renderlistContainer();
            }
            this._loadInitialRemoteData = false;
        },

        _onScroll: function (e) {
            if (!e.scrollTop) return;
            var scrollerPosition = e.scrollTop, proxy = this;
            if (this.model.actionBegin)
                this._trigger("actionBegin", {});
            this.realUllength = this.element.find('li').length;
            if (this.model.allowVirtualScrolling && this.model.virtualScrollMode == "normal") {
                if(e.scrollTop!= e.scrollData.scrollOneStepBy + e.scrollData.scrollable){
                window.setTimeout(function () {
                    if (proxy._virtualCount == 0) {
                        proxy._loadVirtualList();
                    }
                }, 300);
            }
            }
            else if (this.model.allowVirtualScrolling && this.model.virtualScrollMode == "continuous") {
                if (scrollerPosition >= Math.round($(this.listContainer).find("ul").height() - $(this.listContainer).height()) && this.listitems.length < this._totalCount) {
                    this._updateLoadingClass(true);
                    if (ej.DataManager && this.model.dataSource instanceof ej.DataManager) {
                        this._queryPromise(this.realUllength, proxy, this.realUllength + this.model.itemRequestCount, e);
                    }
                }
            }
        },
        _queryPromise: function (start, proxy, end, e) {
            this._trigger('itemRequest', { event: e, isInteraction: true });
            this._setMapFields();
            var mQuery = this._savedQueries.clone();
            var queryPromise = this.dataSource().executeQuery(mQuery.range(start, end));
            this._updateLoadingClass(true);
            queryPromise.done(function (d) {
			    proxy._trigger("actionBeforeSuccess", d);
                proxy.realUllength = (e.source != "wheel") ? proxy.mergeValue ? proxy.mergeValue.length + start : start : start;
                proxy._loadlist(d.result)._checkboxHideShow(proxy.model.showCheckbox)._showResult()._updateLoadingClass();
                proxy._applySelection();
                if (proxy.model.virtualScrollMode == "continuous") {
                    proxy.scrollerObj.refresh();
                }
                proxy._trigger("actionSuccess", d);
            }).fail(function (e) {
                proxy._trigger("actionFailure", e);
            }).always(function (e) {
                proxy._trigger("actionComplete", e);
            });
        },
        _loadVirtualList: function () {
            this._virtualCount++;
            this._getLiHeight();
            var top = this.scrollerObj.scrollTop(), proxy = this, prevIndex = 0, prevPageLoad, nextIndex = null;
            this._currentPageindex = Math.round(top / (this._liItemHeight * this.model.itemRequestCount));
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
            var firstArg = prevPageLoad ? (this._currentPageindex - 1) * this.model.itemRequestCount : this._currentPageindex * this.model.itemRequestCount;
            var skipQuery = ej.Query().range(firstArg, this._currentPageindex * this.model.itemRequestCount + this.model.itemRequestCount), queryPromise, list;
            if (ej.DataManager) {
                var skipParam = prevPageLoad ? (this._currentPageindex - 1) * this.model.itemRequestCount : this._currentPageindex * this.model.itemRequestCount;
                if(this.dataSource().dataSource.offline == true)
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
                    skipQuery.take(2 * this.model.itemRequestCount);
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
            else {
                list = ej.DataManager(proxy.model.dataSource).executeLocal(skipQuery);
                this._appendVirtualList(list, prevIndex, this._currentPageindex, nextIndex, prevPageLoad);
                this._updateLoadingClass(false);
            }
        },

        _appendVirtualList: function (list, prevIndex, currentIndex, nextIndex, prevPageLoad) {
            this._virtualCount--;
            this._getLiHeight();
            if (($.inArray(currentIndex, this._virtualPages.sort(function (a, b) { return a - b; }))) != -1) return false;
            if (prevPageLoad && ($.inArray(currentIndex - 1, this._virtualPages.sort()) != -1)) {
                list.splice(0, this.model.itemRequestCount);
                prevPageLoad = false;
            }
            var items = this.model.itemRequestCount, tempUl = $("<ul>"), firstVirtualHeight, secondVirtualHeight;
            firstVirtualHeight = prevPageLoad ? ((currentIndex - 1) * items * this._liItemHeight) - (prevIndex * items + items) * this._liItemHeight : (currentIndex * items * this._liItemHeight) - (prevIndex * items + items) * this._liItemHeight;
            if (firstVirtualHeight != 0) tempUl.append($("<span>").addClass("e-virtual").css({ display: "block", height: firstVirtualHeight }));
            this._loadlist(list);
            $(this._dummyVirtualUl).attr("data-ej-page", currentIndex);
            if (prevPageLoad) {
                $(this._dummyVirtualUl).slice(0, items).attr("data-ej-page", currentIndex - 1);
            }
            tempUl.append(this._dummyVirtualUl);
            var ulItems = this.element;
            secondVirtualHeight = (currentIndex * items + items) * this._liItemHeight;
            if (nextIndex != null) secondVirtualHeight = (nextIndex * items * this._liItemHeight) - secondVirtualHeight;
            else secondVirtualHeight = ulItems.height() - secondVirtualHeight;
            if (secondVirtualHeight != 0) tempUl.append($("<span>").addClass("e-virtual").css({ display: "block", height: secondVirtualHeight }));
            var selector = ulItems.find("li[data-ej-page=" + prevIndex + "]").last();
            selector.next().remove();
            tempUl.children().insertAfter(selector);
            if(this.model.showCheckbox) this._checkboxHideShow(true);
            this._virtualPages.push(currentIndex);
            if (prevPageLoad) this._virtualPages.push(currentIndex - 1);
            this._virtualUl = ulItems.clone(true);
            this._showResult();
            this._addDragableClass()._enableDragDrop();
        },

        _selectListItems: function () {
            var listItems = this.element.find("li:not('.e-ghead')");;
            for (var i = 0; i < listItems.length; i++) {
                if ($(listItems[i]).hasClass('selectItem') && !$(listItems[i]).hasClass('e-select'))
                    $(listItems[i]).addClass("e-select").removeClass('selectItem');
            }
        },
        _setText: function (text) {
            for (i = 0; i < this.listitems.length; i++)
                if ($(this.element.children("li")[i]).text() == text) this.unselectAll().selectItemByIndex(i);
        },
        _getLiCount: function () {
            return parseInt(this.listContainer.height() / this.listItemsElement.height());
        },
        _onDragStarts: function (data, target) {
            return this._trigger("itemDragStart", { items: data, target: target });
        },
        _onDrag: function (data, target) {
            return this._trigger("itemDrag", { items: data, target: target });
        },
        _onDragStop: function (data, target) {
            return this._trigger("itemDragStop", { items: data, target: target });
        },
        _onDropped: function (data, target) {
            data = { droppedItemText: data[0].text, droppedItemValue: data[0].value, droppedItemIsChecked: data[0].isChecked, droppedElementData: data[0], dropTarget:[data[1].target],event:data[1].event};
            return this._trigger("itemDrop",data);
        },
        _OnKeyPress: function (e) {
            if (this.model.enableIncrementalSearch && this.model.enabled) {
                this._incrementalSearch(this._isMozilla ? e.charCode : e.keyCode)
            }
        },
        _incrementalSearch: function (from) {
            _proxy = this;
            var typedCharacter = String.fromCharCode(from);
            if (this._incqueryString != typedCharacter) this._incqueryString += typedCharacter;
            else this._incqueryString = typedCharacter;
            if ((this._incqueryString.length > 0) && (this._typeInterval == null)) {
                this._typeInterval = setTimeout(function () {
                    _proxy._incqueryString = "";
                    _proxy._typeInterval = null
                }, _proxy._typingThreshold)
            }
            var list = this.listContainer.find("ol,ul").children("li:not('.e-ghead')"),
                i, strlen;
            var caseSence = this.model.caseSensitiveSearch,
                str, queryStr = this._incqueryString;
            var querylength = this._incqueryString.length,
                searchflag = false;
            if (!caseSence) queryStr = queryStr.toLowerCase();
            var initialSelection = this._activeItem;
            --initialSelection;
            var startIndex = this._activeItem != list.length - 1 ? (this._activeItem + 1) : 0;
            if (this._incqueryString.length > 1) startIndex = this._activeItem;
            for (var i = startIndex;
                (i < list.length && initialSelection != i) ; i++) {
                str = $.trim($(list[i]).text());
                str = caseSence ? str : str.toLowerCase();
                if (str.substr(0, querylength) === queryStr) {
                    this._removeListHover();
                    this.element.children("li").removeClass('e-active');
                    this._selectedItem = i;
                    this._addListHover();
                    searchflag = true;
                } else if ((i == list.length - 1) && (searchflag == false)) {
                    if (startIndex != 0) {
                        i = -1;
                        ++initialSelection;
                    } else searchflag = true;
                }
                if (searchflag) break;
            }
        },
        _wireEvents: function () {
            this._on(this.listContainer, "focus", this._OnFocusIn);
            this._on(this.listContainer, "blur", this._OnFocusOut);
            $(window).on("resize", $.proxy(this._OnWindowResize, this));
        },
        _OnFocusIn: function () {
            if (!this._focused) {
                this._trigger("focusIn");
                this._on(this.listContainer, "keydown", this._OnKeyDown);
                this._on(this.listContainer, "keypress", this._OnKeyPress);
                this._focused = true;
            }
        },
        _OnFocusOut: function () {
            if (this._focused) {
                this._trigger("focusOut");
                this._off(this.listContainer, "keydown", this._OnKeyDown);
                this._off(this.listContainer, "keypress", this._OnKeyPress);
                this._focused = false;
            }
        }
    });
    ej.VirtualScrollMode = {
        /** Supports to Virtual Scrolling mode with normal only */
        Normal: "normal",
        /** Supports to Virtual Scrolling mode with continuous only */
        Continuous: "continuous"
    };
    ej.SortOrder = {

        Ascending: "ascending",

        Descending: "descending",

	    None:"none"
    };
})(jQuery, Syncfusion);
