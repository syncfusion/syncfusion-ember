/**
* @fileOverview Plugin to style the Html input elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) { 

    ej.widget("ejDropDownList", "ej.DropDownList", {
        element: null,

        model: null,
        validTags: ["select", "input"],
        _addToPersist: ["value", "text", "selectedIndex", "selectedItemIndex", "selectedItems", "selectedIndices", "popupWidth", "popupHeight", "itemValue"],
        _setFirst: false,

        _rootCSS: "e-dropdownlist",
        angular: {
            require: ['?ngModel', '^?form', '^?ngModelOptions']
        },
        _requiresID: true,
      


        defaults: {
            cssClass: "",

            value: null,

            htmlAttributes: {},

            text: null,

            itemValue: "",

            itemsCount: 0,

            dataSource: null,

            delimiterChar: ',',

            query: null,

            fields: {
                id: null,

                text: null,

                value: null,

                category: null,
                
                groupBy:null,

                imageUrl: null,

                imageAttributes: null,

                spriteCssClass: null,

                htmlAttributes: null,

                selected: null,

                tableName: null
            },
			
			locale: "en-US",

            watermarkText: null,

            height: "",

            loadOnDemand: false,

            width: "",

            popupHeight: "152px",

            popupWidth: "auto",

            maxPopupHeight: null,

            minPopupHeight: '20',

            maxPopupWidth: null,

            minPopupWidth: '0',

            targetID: null,

            template: null,

            headerTemplate: null,

            selectedItemIndex: -1,

            selectedIndex: -1,

            disableItemsByIndex: null,

            enableItemsByIndex: null,

            selectedItems: [],

            selectedIndices: [],

            cascadeTo: null,

            enablePopupResize: false,

            allowVirtualScrolling: false,

            virtualScrollMode: "normal",

            showRoundedCorner: false,

            showPopupOnLoad: false,

            enableRTL: false,

            enabled: true,

            filterType: "contains",

            sortOrder: "ascending",

            caseSensitiveSearch: false,

            showCheckbox: false,

            checkAll: false,

            uncheckAll: false,

            enablePersistence: false,

            enableFilterSearch: false,

            enableServerFiltering: false,

            enableIncrementalSearch: true,

            readOnly: false,

            enableAnimation: false,

            multiSelectMode: "none",

            allowGrouping: false,

            enableSorting: false,

            validationRules: null,

            validationMessage: null,

            actionBegin: null,

            actionComplete: null,

            actionFailure: null,

            actionSuccess: null,

            create: null,

            popupHide: null,

            popupShown: null,

            beforePopupShown: null,

            beforePopupHide: null,

            popupResizeStart: null,

            popupResize: null,

            popupResizeStop: null,

            change: null,

            select: null,

            dataBound: null,

            search: null,

            checkChange: null,

            cascade: null,

            destroy: null

        },

        dataTypes: {
            cssClass: "string",
            itemsCount: "number",
            watermarkText: "string",
            template: "string",
            disableItemsByIndex: "string",
            enableItemsByIndex: "string",
            enableIncrementalSearch: "boolean",
            cascadeTo: "string",
            delimiterChar: "string",
            showRoundedCorner: "boolean",
            showPopupOnLoad: "boolean",
            enableRTL: "boolean",
            enablePersistence: "boolean",
            allowVirtualScrolling: "boolean",
            virtualScrollMode: "enum",
            enabled: "boolean",
            readOnly: "boolean",
            multiSelectMode: "enum",
            dataSource: "data",
            query: "data",
            fields: "data",
            selectedItems: "array",
			selectedIndices: "array",
            enableAnimation: "boolean",
            allowGrouping: "boolean",
            enableSorting: "boolean",
            validationRules: "data",
            validationMessage: "data",
            htmlAttributes: "data",
			locale:"string"
        },

        observables: ["value", "selectedItemIndex", "selectedIndex","dataSource"],
        value: ej.util.valueFunction("value"),
        selectedItemIndex: ej.util.valueFunction("selectedItemIndex"),
        selectedIndex: ej.util.valueFunction("selectedIndex"),
        _dataSource: ej.util.valueFunction("dataSource"),
        

        enable: function () {
            if (this._visibleInput.hasClass("e-disable")) {
                this.target.disabled = false;
                this.model.enabled = true;
				this.container.removeClass('e-disable');
                this._visibleInput.removeClass('e-disable');
                this.dropdownbutton.removeClass('e-disable');
                if(!ej.isNullOrUndefined(this.popupListWrapper)) this.popupListWrapper.removeClass('e-disable');
                if (this._isIE8) this.drpbtnspan.removeClass("e-disable");
                //Element not Maintain in Multiselection
                this.container.on("mousedown", $.proxy(this._OnDropdownClick, this));
                if (this.model.multiSelectMode == "visualmode") this._ulBox.removeClass("e-disable");
                this.wrapper.attr('tabindex', '0');
            }
            this._wireEvents();
        },

        disable: function () {
            if (!this._visibleInput.hasClass("e-disable")) {
                this.target.disabled = true;
                this.model.enabled = false;
				this.container.addClass('e-disable');
                this._visibleInput.addClass('e-disable');
                if(!ej.isNullOrUndefined(this.popupListWrapper)) this.popupListWrapper.addClass('e-disable');
                this.dropdownbutton.addClass('e-disable');
                if (this._isIE8) this.drpbtnspan.addClass("e-disable");
                if (this.model.multiSelectMode == "visualmode") this._ulBox.addClass("e-disable");
                //Element not Maintain in Multiselection
                this.container.off("mousedown", $.proxy(this._OnDropdownClick, this));
                this._unwireEvents();
                this.wrapper.removeAttr('tabindex');
                if (this._isPopupShown()) this._hideResult();
            }
        },

        /* will deprecate with text property */
        getValue: function () {
			return this._visibleInput.val();
        },
        _setValue: function (value) {
            if (!ej.isNullOrUndefined(value)) {
                if(this.model.loadOnDemand && (ej.isNullOrUndefined(this.ultag) || this.ultag.children().length==0))this._showFullList();
                this._raiseEvents = false;
                if (!ej.isNullOrUndefined(this.model.text)) this.unselectItemByText(this.model.text);
                this._raiseEvents = true;
                if (this.model.allowVirtualScrolling) this._addValue(value);
                this.selectItemByValue(value);
            }
        },
        _addValue: function (args) {
            if (this.model.itemsCount > 0 && args != "") {
                this._checkValue = true;
                var listitems = (typeof(args) == "number") ? args: args.split(this.model.delimiterChar);
                if(!ej.isNullOrUndefined(this._mapFields())) this._mapFields();
                var field = this.mapFld._value; 
                if(!ej.isNullOrUndefined(this._rawList)) this._addListItems(listitems, this._rawList, "local");
                if (this._checkValue) {
                    var source = this._dataSource();
                    if (ej.DataManager && source instanceof ej.DataManager) {
                        if (source.dataSource.offline && (source.dataSource.json && source.dataSource.json.length > 0))
                            this._addListItems(listitems, source.dataSource.json,"remote");
                        else {
                            var proxy = this;
                            var value= args;
                                source.executeQuery(ej.Query()).done(function (e) {
                                proxy._addListItems(listitems, e.result, "remote");
                                proxy.selectItemByValue(value);
                            });
                        }
                    }
                    else
                        this._addListItems(listitems, source, "remote");
                }

            }
        },
        _addListItems: function (listitems, source, checkValue) {
            for (k = 0; k < listitems.length; k++) {
                for (var i = 0; i < source.length; i++) {
                    if (checkValue == "local" && source[i][this.mapFld._value] == listitems[k])
                        this._checkValue = false;
                    if (checkValue == "remote" && source[i][this.mapFld._value] == listitems[k])
                        this.addItem(source[i]);
                }
            }
        },
        _setText: function (text) {
            if (!ej.isNullOrUndefined(text)) {
                if(this.model.loadOnDemand && (ej.isNullOrUndefined(this.ultag) || this.ultag.children().length==0))this._showFullList();
                this._raiseEvents = false;
                this.unselectItemByText(this.model.text);
                this._raiseEvents = true;
                this.selectItemByText(text);
            }
        },
        _setItemValue: function (itemValue) {
            this.model.itemValue = itemValue;
        },
        _changeWatermark: function (text) {
            if (!this.model.enabled) return false;
            if (this._isWatermark) this._visibleInput.attr("placeholder", text);
            else this._hiddenSpan.text(text);
        },

        hidePopup: function () {
            if (!this.model.enabled) return false;
            if (this.ultag.find('li').length > 0)
                this._hideResult();
        },

        showPopup: function () {
            if (!this.model.enabled) return false;
            var ultag = !ej.isNullOrUndefined(this.ultag) ? this.ultag.find('li').length > 0 : (this.model.loadOnDemand) ? true: false;
            if (ultag)
                this._showResult();
        },

        clearText: function () {
            this._clearTextboxValue(); 
            if (!this._isWatermark)
                this._setWatermark();
        },

        addItem: function (itemTag) {
            if(this.model.loadOnDemand && (ej.isNullOrUndefined(this.ultag) || this.ultag.children().length==0)) this._showFullList();
            if (!this.model.enabled || !itemTag) return false;
            this._mapFields();
            var list = $.isArray(itemTag) ? itemTag : [itemTag];
            if (list.length < 1) return false;
            var mapper = this.mapFld,
                mapFld = { _id: null, _imageUrl: null, _imageAttributes: null, _spriteCSS: null, _text: null, _value: null, _htmlAttributes: null, _selected: null, _category: null };
            mapFld._id = list[0][mapper._id] ? mapper._id : "id";
            mapFld._imageUrl = list[0][mapper._imageUrl] ? mapper._imageUrl : "imageUrl";
            mapFld._imageAttributes = list[0][mapper._imageAttributes] ? mapper._imageAttributes : "imageAttributes";
            mapFld._spriteCSS = list[0][mapper._spriteCSS] ? mapper._spriteCSS : "spriteCssClass";
            mapFld._text = list[0][mapper._text] ? mapper._text : "text";
            mapFld._value = list[0][mapper._value] ? mapper._value : "value";
            mapFld._htmlAttributes = list[0][mapper._htmlAttributes] ? mapper._htmlAttributes : "htmlAttributes";
            mapFld._selected = list[0][mapper._selected] ? mapper._selected : "selected";
            mapFld._category = list[0][mapper._category] ? mapper._category : "groupBy";
            this._generateLi(list, mapFld);
            
            var i, listItems = this.dummyUl;
            for (var i = 0; i < list.length; i++)
                this._listItem(list[i], "add");
            if (this.model.showCheckbox) {
                this._appendCheckbox(listItems, true);               
            }
            else if (!this._isSingleSelect()) this._multiItemSelection(listItems, true);
			this._virtualUl.append($(this.dummyUl).clone(true));
            this.ultag.append(this.dummyUl);

            if (this._isPopupShown()) {
                var scrollerPosition = this.scrollerObj ? this.scrollerObj.scrollTop() : 0;
                this._refreshScroller();
                if (this.scrollerObj) this.scrollerObj.option("scrollTop", scrollerPosition);
            }
        },

        _toArray: function (index, mode) {
            var items;
            if (typeof index == "function") index = ej.util.getVal(index);
            if ($.isArray(index)) items = index;
            else if (typeof index == "string") {
                if ((mode && (this.model.multiSelectMode == "visualmode" || this.model.multiSelectMode == "delimiter" || this.model.showCheckbox))) {
                    items = index.split(this.model.delimiterChar);
                    if (items.length == 0) items = [index];
                }
                else if (!mode) {
                    items = index.split(this.model.delimiterChar);
                    if (items.length == 0) items = [index];
                }
                else items = [index];
            } else items = [index];
            return items;
        },
        _trim: function (val) {
            return typeof val == "string" ? $.trim(val) : val;
        },
        /*will deprecate with selectItemsByIndices */
        selectItemByIndex: function (index) {
            this._selectItemByIndex(index);
        },

        selectItemsByIndices: function (index) {
            this._selectItemByIndex(index);
        },

        _selectItemByIndex: function (val) {
            if(this.model.loadOnDemand && (ej.isNullOrUndefined(this.ultag) || this.ultag.children().length==0)) this._showFullList();
            this.listitems = this._getLi();
            this._selectedIndices = $.map(this._selectedIndices, function (a) { return parseInt(a); });
            this.model.selectedItems = this.model.selectedIndices = this._selectedIndices;
			if( parseInt(val) == -1 && this.model.selectedItems.length > 0) {
				this._clearTextboxValue();
				this._trigger("change",{ text: this._visibleInput[0].value, selectedText: "", selectedValue: "", value: "" });
			}
			else {
            var items = this._toArray(val, true), index;
            for (var k = 0; k < items.length; k++) {
                index = parseInt(items[k]);
                if (index != null && index >= 0) {
                    if ($.inArray(index, this._selectedIndices) == -1)
                        for (var i = 0; i < this.listitems.length; i++) {
                            if (!$(this.listitems[i]).hasClass('e-disable')) {
                                if (i == index) {
                                    this.selectedIndexValue = i;
                                    this._activeItem = index;
                                    this._enterTextBoxValue();
                                }
                            }
                        }
                } else if (!this.model.showCheckbox && this.model.multiSelectMode == "none" && this.model.selectedItems.length > 0) {
					this._clearTextboxValue();
				   this._trigger("change",{ text: this._visibleInput[0].value, selectedText: "", selectedValue: "", value: "" });
				} 
            }
			}
        },

        unselectItemsByIndices: function (val) { this._unselectItemByIndex(val); },

        /*will deprecate with unselectItemsByIndices method */
        unselectItemByIndex: function (val) { this._unselectItemByIndex(val); },

        _unselectItemByIndex: function (val) {
            if(this.model.loadOnDemand && (ej.isNullOrUndefined(this.ultag) || this.ultag.children().length==0)) this._showFullList();
            this._selectedIndices = $.map(this._selectedIndices, function (a) { return parseInt(a); });
            this.model.selectedItems = this.model.selectedIndices = this._selectedIndices;
            var i, items = this._toArray(val, true), index;
            this.listitems = this._getLi();
            for (var k = 0; k < items.length; k++) {
                index = parseInt(items[k]);
                for (i = 0; i < this.listitems.length; i++) {
                    if (i == index) {
                        this.selectedIndexValue = i;
                        this._activeItem = index;
                        if (this._activeItem == this._aselectedItem) this._aselectedItem = null;
                        this._removeTextBoxValue();
                    }
                }
            }
        },

        /*Deprecated with selectedItemByValue */
        setSelectedValue: function (idvalue) { this.selectItemByValue(idvalue); },

        selectItemByValue: function (val) {
            if(this.model.loadOnDemand && (ej.isNullOrUndefined(this.ultag) || this.ultag.children().length==0)) this._showFullList();
            var i, hidelement; 
            this.listitems = this._getLi();
            if(this.inputSearch && this.inputSearch.val() != "" && this.model.enableServerFiltering && !ej.isNullOrUndefined(this._searchresult)){
                var field = (this.model.fields && this.model.fields.value) ? this.model.fields["value"] : "value";
                for(i=0; i< this._searchresult.length; i++){
                for (var j = 0; j < this.listitems.length; j++) {
					if ($(this.listitems[j]).attr("data-value") == this._searchresult[i][field]) {
						this._searchresult=null;
					}
                }
            }
                this.addItem(this._searchresult);
            }
            if (ej.isNullOrUndefined(val)) this._clearTextboxValue();
            else { 
                this._selectUnSelectValue(val, "selectValue");
            }
        },

        _selectUnSelectValue: function(val, selectValue, ignoreCasing){
             var items = this._toArray(val, true);
                for (var k = 0; k < items.length; k++) {
                    for (i = 0; i < this.listitems.length; i++) {
                        if (!$(this.listitems[i]).hasClass('e-disable') && (selectValue=="selectValue" || selectValue=="selectText")) {
                            if(selectValue=="selectValue"){
                                var fieldValue = (!ej.isNullOrUndefined(this._getAttributeValue(this.listitems[i])))? this._getAttributeValue(this.listitems[i])  : $(this.listitems[i]).text();
                                this._selectedValue = fieldValue == items[k]; 
                            }
                            if(selectValue=="selectText"){
                                this.selectedTextValue = this._isPlainType(this.popupListItems) ? this.popupListItems[i] : this._getField(this.popupListItems[i], this.mapFld._text);
                                this._selectedValue = (this.selectedTextValue == items[k]) || (ignoreCasing && this.selectedTextValue.toString().toLowerCase() == items[k].toString().toLowerCase())
                            }  
                                if (this._selectedValue) {
                                    this._activeItem = i;
                                    this._aselectedItem = this._activeItem;
                                    this._enterTextBoxValue();
                                    break;
                                } 
                        }
                        else{ 
                             if (this._getAttributeValue(this.listitems[i])) {
                                 if(selectValue=="unselectValue"){
                                this._selectedValue = this._getAttributeValue(this.listitems[i]);
                                this._selectedValue = this._selectedValue == items[k]; 
                            }
                            if(selectValue=="unselectText"){
                                this.unselectedTextValue = this._isPlainType(this.popupListItems) ? this.popupListItems[i] : this._getField(this.popupListItems[i], this.mapFld._text);
                                this._selectedValue = (this.unselectedTextValue == items[k]) || (ignoreCasing && this.unselectedTextValue.toString().toLowerCase() == items[k].toString().toLowerCase())
                            }   
                                if (this._selectedValue) {
                                    this._activeItem = i;
                                    if (this._activeItem == this._aselectedItem) this._aselectedItem = null;
                                        this._removeTextBoxValue();
                                     break;
                                }
                            }
                        }
                    }
                }
        },

        unselectItemByValue: function (val) {
            if(this.model.loadOnDemand && (ej.isNullOrUndefined(this.ultag) || this.ultag.children().length==0))this._showFullList();
            var i, hidelement;
            this.listitems = this._getLi(); 
            this._selectUnSelectValue(val, "unselectValue");
        },

        /* Deprecated with selectItemByText*/
        setSelectedText: function (value) { this.selectItemByText(value); },

        selectItemByText: function (val, ignoreCasing) {
            if(this.model.loadOnDemand && (ej.isNullOrUndefined(this.ultag) || this.ultag.children().length==0))this._showFullList();
            var i, hidelement;
            this.listitems = this._getLi();
            this._mapFields();
            if (ej.isNullOrUndefined(val)) this._clearTextboxValue();
            else { 
                this._selectUnSelectValue(val, "selectText", ignoreCasing);
            }
        },

        unselectItemByText: function (val, ignoreCasing) {
            var i, hidelement;
            this.listitems = this._getLi();
            this._mapFields();
            this._selectUnSelectValue(val, "unselectText", ignoreCasing);
        },

        getSelectedValue: function () {
			return this.element.val();
        },

        getSelectedItem: function () {
            var k, selected = [];
            this.listitems = this._getLi();
            for (k = 0; k < this._selectedIndices.length; k++) {
                selected.push(this.listitems[this._selectedIndices[k]]);
            }
            return selected;
        },
        getItemDataByValue: function (value) {
            var listitems = this._toArray(value, false);
			var rawList  = (!ej.isNullOrUndefined(this.resultList)) ? this._rawList.concat(this.resultList): this._rawList;
            var k, m, selected = [], field = (this.model.fields && this.model.fields.value) ? this.model.fields["value"] : "value";
            for (k = 0; k < listitems.length; k++) {
                for (m = 0; m < rawList.length; m++) {
                    if (rawList[m][field] == listitems[k])
                        selected.push(rawList[m]);
                }
            }
            return selected;
        },

        getListData: function () { return this._rawList; },

        /* will be deprecate in upcoming releases*/
        getSelectedItemsID: function () {
            return this._selectedItemsID;
        },

        disableItemsByIndices: function (value) { this._disableItemByIndex(value) },

        /*Deprecated with disableItemsByIndices method */
        disableItemByIndex: function (value) { this._disableItemByIndex(value) },

        _disableItemByIndex: function (value) {
            if (!this.model.enabled) return false;
            if(this.model.loadOnDemand && (ej.isNullOrUndefined(this.ultag) || this.ultag.children().length==0)) this._showFullList();
            var listitems = this._toArray(value, false),index;
            for (var i = 0; i < listitems.length; i++) {
                if (listitems[i] != null && !isNaN(parseInt(listitems[i]))) {
                    if (listitems.length > 0 && !($.inArray(parseInt(listitems[i]), this._disabledItems) > -1)) {
                        index = $.inArray(listitems[i], this._disabledItems);
                        this._setClass(this._getLi()[parseInt(listitems[i])], "e-disable");
                        this._disabledItems.push(parseInt(listitems[i]));
                        this.model.disableItemsByIndex = String(this._disabledItems.join(","));
                    }
                }
            }
        },

        enableItemsByIndices: function (value) { this._enableItemByIndex(value) },

        /*Deprecated with enableItemsByIndices method */
        enableItemByIndex: function (value) { this._enableItemByIndex(value) },

        _enableItemByIndex: function (value) {
            if(this.model.loadOnDemand && (ej.isNullOrUndefined(this.ultag) || this.ultag.children().length==0)) this._showFullList();
            var listitems = this._toArray(value, false), index;
            this.model.enableItemsByIndex = value;
            for (var i = 0; i < listitems.length; i++) {
                if (listitems.length > 0 && ($.inArray(parseInt(listitems[i]), this._disabledItems) > -1) &&  !isNaN(parseInt(listitems[i]))) {
                    index = $.inArray(parseInt(listitems[i]), this._disabledItems);
                    this._removeClass(this._getLi()[parseInt(listitems[i])], "e-disable");
                    this._disabledItems.splice(index, 1);
                }
            }
            this.model.enableItemsByIndex = null;
            this.model.disableItemsByIndex = this._disabledItems.join(this.model.delimiterChar);
        },
        _validateDelimiter: function (deli) {
            if (this._trim(deli).length == 1) {
                var RegEx = /^[a-zA-Z0-9]+$/;
                if (!RegEx.test(deli)) return deli;
            }
            return ",";
        },

        _removeText: function (currentValue) {
            var eleVal = this.element[0].value.split(this.model.delimiterChar), hidVal = this._visibleInput[0].value.split(this.model.delimiterChar),
            index = $.inArray(currentValue, eleVal);
            if (index >= 0) {
                eleVal.splice(index, 1);
                hidVal.splice(index, 1);
				this._valueContainer.splice(index, 1);
				this._textContainer.splice(index, 1);
            }
            this.element[0].value = eleVal.join(this.model.delimiterChar);
            this._visibleInput[0].value = hidVal.join(this.model.delimiterChar);
        },
        _addText: function (currentValue) {
            if (this._checkContains(this._hiddenValue)) return false;
            var ele = ["element", "_visibleInput"], val;
            for (var i = 0; i < ele.length; i++) {
                val = ele[i] == "element" ? this._hiddenValue : currentValue;
				var srcContainer = ele[i] == "element" ? this._valueContainer : this._textContainer;
                if (this[ele[i]][0].value && this[ele[i]][0].value != "") {
                    var splitedText = this[ele[i]][0].value.split(this.model.delimiterChar);
                    splitedText.push(val);
                    this[ele[i]][0].value = splitedText.join(this.model.delimiterChar);
                } else {
					if(val =="")
						this[ele[i]][0].value = val;
					else if(val !="" && this[ele[i]][0].value == ""){
						if($.inArray("",srcContainer) != -1){
							var splitedText = this[ele[i]][0].value.split(this.model.delimiterChar);
							splitedText.push(val);
							this[ele[i]][0].value = splitedText.join(this.model.delimiterChar);
						}
						else
							this[ele[i]][0].value = val;
					}
				}
				srcContainer.push(val);
            }
        },
        _checkContains: function (chkValue) {
            this.contains = false;
            for (i = 0; i < this._valueContainer.length; i++) {
                if (this._parseValue(this._valueContainer[i]) === this._parseValue(chkValue)) {
                    this.contains = true;
                    break;
                }
            }
            return this.contains;
        },
		_parseValue: function (value){
			return isNaN(parseInt(value)) || (typeof(this._rawList[0][this.mapFld._value]) == 'string') ? value : parseInt(value);
		},
        _updateLocalConstant: function () {
            this._localizedLabels = ej.getLocalizedConstants("ej.DropDownList", this.model.locale);
        },
        _init: function () {
            var browserInfo = ej.browserInfo();
            this._updateLocalConstant();
            this._isIE8 = (browserInfo.name == 'msie' && browserInfo.version == '8.0');
            this._textContent = this._isIE8 ? "innerText" : "textContent";
            if ((this.element.is("input") && (this.element.is("input[type=text]") || !this.element.attr('type'))) || this.element.is("select")) {
                this._isWatermark = 'placeholder' in $(document.createElement('input')).attr("placeholder", '')[0];
                this._id = this.element[0].id;
                this._initialize();
                this._render();
                this._addAttr(this.model.htmlAttributes);
                this._enabled(this.model.enabled);
                this._initValue = false;
                this._checkboxValue = false;
                if (this.model.validationRules != null) {
                    this._initValidator();
                    this._setValidation();
                }
            }
        },

        _initValidator: function () {
            (!this.element.closest("form").data("validator")) && this.element.closest("form").validate();
        },
        _setValidation: function () {
            if (this.element.closest("form").length != 0) {
                this.element.rules("add", this.model.validationRules);
                var validator = this.element.closest("form").data("validator");
                if (!validator) validator = this.element.closest("form").validate();
                var name = this.element.attr("name");
                validator.settings.messages[name] = {};
                for (var ruleName in this.model.validationRules) {
                    var message = null;
                    if (!ej.isNullOrUndefined(this.model.validationRules[ruleName])) {
                        if (!ej.isNullOrUndefined(this.model.validationRules["messages"] && this.model.validationRules["messages"][ruleName]))
                            message = this.model.validationRules["messages"][ruleName];
                        else {
                            validator.settings.messages[name][ruleName] = $.validator.messages[ruleName];
                            for (var msgName in this.model.validationMessage)
                                ruleName == msgName ? (message = this.model.validationMessage[ruleName]) : "";
                        }
                        validator.settings.messages[name][ruleName] = message != null ? message : $.validator.messages[ruleName];
                    }
                }
            }
        },

        _setInitialPopup: function (value) {
            if (this.model.enabled && !this.model.readOnly)
                value == false ? this._hideResult() : this._showResult();
        },
        _changeSkin: function (skin) {
            this.wrapper.removeClass(this.model.cssClass).addClass(skin);
            if(!ej.isNullOrUndefined(this.popupListWrapper))this.popupListWrapper.removeClass(this.model.cssClass).addClass(skin);
        },

        _setRTL: function (val) {
            if (this.model.enableRTL != val) {
                this.model.enableRTL = val;
                this._RightToLeft();
                if(!ej.isNullOrUndefined(this.popupListWrapper)) this._dropbtnRTL();
            }
        },

        _changeHeight: function (height) {
            this.wrapper.height(height);
            this._setListHeight();
        },
        _changeWidth: function (width) {
            this.wrapper.width(width);
            this._setListWidth();
        },

        _setModel: function (options) {
            var option;
            for (option in options) {
                switch (option) {
                    case "dataSource": if (!this._isEqualDataSource(ej.util.getVal(options[option]))) this._checkModelDataBinding(ej.util.getVal(options[option]), this.model.query); break;
                    case "query": this._checkModelDataBinding(this._dataSource(), options[option]); break;
                    case "fields": this.model.fields = $.extend(this.model.fields, options[option]); this._checkModelDataBinding(this._dataSource(), this.model.query); break;
                    case "itemsCount": this.model.itemsCount = options[option]; this._checkModelDataBinding(this._dataSource(), this.model.query);; break;
                    case "template": this.model.template = options[option]; this._checkModelDataBinding(this._dataSource(), this.model.query); break;
                    case "value": 
					var optionValue = ej.util.getVal(options[option]);
					if (ej.isNullOrUndefined(optionValue) || optionValue === "") this._clearTextboxValue();
					if (ej.isNullOrUndefined(optionValue) || optionValue === "") this._clearTextboxValue();
                    else { this._setValue(ej.util.getVal(options[option])); options[option] = this.model.value; } break;
                    case "delimiterChar": 
						var delchar = this.model.delimiterChar; 
						options[option] = this._validateDelimiter(options[option]);
                        this.model.delimiterChar = options[option];
                        if (!this._isSingleSelect()) {
						if (this.model.text) {
							this.model.text = this.model.text.split(delchar).join(this.model.delimiterChar);
							this._visibleInput.val(this.model.text);							
						}
						if(!ej.isNullOrUndefined(this.value())) {
							this.value(this.value().split(delchar).join(this.model.delimiterChar));
							this.element.val(this.value());	
						}
                    }
                        break;
                    case "text": if (ej.isNullOrUndefined(options[option]) || options[option] === "") this._clearTextboxValue();
                    else { this._setText(options[option]); options[option] = this.model.text; } break;
                    case "itemValue": this._setItemValue(options[option]); break;
                    case "enableRTL": this._setRTL(options[option]); break;
                    case "enabled": this._enabled(options[option]); break;
                    case "height": this._changeHeight(options[option]); break;
                    case "width": this._changeWidth(options[option]); break;
                    case "popupHeight": this.model.popupHeight = options[option]; this._setListHeight(options[option]); break;
                    case "popupWidth": this.model.popupWidth = options[option]; this._setListWidth(); break;
                    case "minPopupHeight": this.model.minPopupHeight = options[option]; this._setListHeight(options[option]); break;
                    case "minPopupWidth": this.model.minPopupWidth = options[option]; this._setListWidth(); break;
                    case "maxPopupHeight": this.model.maxPopupHeight = options[option]; this._setListHeight(options[option]); break;
                    case "maxPopupWidth": this.model.maxPopupWidth = options[option]; this._setListWidth(); break;
                    case "cssClass": this._changeSkin(options[option]); break;
                    case "showCheckbox": this.model.showCheckbox = options[option];
                        var _text = this.model.text;
                        var _textes = this.model.text ? this.model.text.split(this.model.delimiterChar) : this.model.text;
                        this._raiseEvents = false;
                        this._clearTextboxValue();
                        this._raiseEvents = true;
                        this._checkboxHideShow(options[option]);
                        if (this.model.showCheckbox || (this.model.multiSelectMode != "none")) {
                            if (this.model.multiSelectMode == "visualmode")
                                this._renderBoxModel();
                            this._setText(_text);
                        }
                        else if (_textes && _textes.length)
                            this._setText(_textes[0]);
                        if (this._isPopupShown())
                            this._setListPosition();
                        break;
                        /* will depreciate with checkAll  Method*/
                    case "checkAll": this._setCheckAll(options[option]); return false; break;
                        /* will depreciate with uncheckAll  Method*/
                    case "uncheckAll": this._setUncheckAll(options[option]); return false; break;
                    case "watermarkText": this._changeWatermark(options[option]); break;
                    case "validationRules":
                        if (this.element.closest("form").length != 0) {
                            if (this.model.validationRules != null) {
                                this.element.rules('remove');
                                this.model.validationMessage = null;
                            }
                            this.model.validationRules = options[option];
                            if (this.model.validationRules != null) {
                                this._initValidator();
                                this._setValidation();
                            }
                        }
                        break;
                    case "locale":
                        this.model.locale = options[option];
                        this._updateLocalConstant();
                        break;
                    case "validationMessage":
                        if (this.element.closest("form").length != 0) {
                            this.model.validationMessage = options[option];
                            if (this.model.validationRules != null && this.model.validationMessage != null) {
                                this._initValidator();
                                this._setValidation();
                            }
                        }
                        break;
                    case "showRoundedCorner": this._roundedCorner(options[option]); this.model.showRoundedCorner = options[option]; break;
                    case "showPopupOnLoad": this._setInitialPopup(options[option]); break;
                    case "targetID": this.model.targetID = options[option]; this._showFullList(); break;
                        /* will depreciate with selectedIndex  Method*/
                    case "selectedItemIndex":
                    case "selectedIndex":
                        this._selectItemByIndex(options[option]);
                        this.model.selectedItemIndex = this.model.selectedIndex = options[option];
                        break;
                        /* will depreciate with unselectItemByIndex API Method*/
                    case "unselectItemByIndex": this._unselectItemByIndex(options[option]); break;
                        /* will depreciate with disableItemsByIndex API Method*/
                    case "disableItemsByIndex": this._disableItemByIndex(options[option]); break;
                        /* will depreciate with enableItemsByIndex API Method*/
                    case "enableItemsByIndex": this._enableItemByIndex(options[option]); break;
                        /* will depreciate with selectedIndices  Method*/
                    case "selectedItems":
                    case "selectedIndices":
                        this._selectCheckedItem(options[option]);
                        options[option] = this.model.selectedItems = this.model.selectedIndices = this._selectedIndices;
                        break;
                    case "multiSelectMode":
                        if (this.model.multiSelectMode == "visualmode") {
                            this._swapUlandInput(false);
                            this._ulBox.remove();                         
                            this._ulBox = null;                     
                        }
                        this.model.multiSelectMode = options[option];
                        var _text = this.model.text;
                        var _textes = this.model.text ? this.model.text.split(this.model.delimiterChar) : this.model.text;
                        this._raiseEvents = false;
                        this._clearTextboxValue();
                        this._raiseEvents = true;
                        if (this.model.showCheckbox || (this.model.multiSelectMode != "none")) {
                            if (this.model.multiSelectMode == "visualmode")
                                this._renderBoxModel();
                            this._setText(_text);
                        }
                        else {
                            this._setText(_textes[0]);
                            this.wrapper.find("input[name=" + this._name + "]").remove();
                        }
                        if (this._isPopupShown())
                            this._setListPosition();
                        break;
                        /* will deprecate with fields.groupBy and e-category element in target element binding */
                    case "allowGrouping":
                        this._setGroupingAndSorting("allowGrouping", options[option]);
                        break;
                    case "enableSorting":
                        this._setGroupingAndSorting("enableSorting", options[option]);
                        break;
                    case "htmlAttributes": this._addAttr(options[option]); break;
                    case "enablePopupResize": this.model.enablePopupResize = options[option];
                        (options[option]) ? this._enablePopupResize() : this.popupListWrapper.removeClass("e-resizable").find(".e-resizebar").remove() && this._hideResult();
                        break;
                    case "enableFilterSearch":
                        if (!options[option]) this._removeSearch();
                        else {
                            this.model.enableFilterSearch = true;
                            this._enableSearch();
                            break;
                        } 
                        case "enableServerFiltering": 
                            this._enableSearch();
                            break; 
                }
            }
        },

        _clearTextboxValue: function () {
            this.element.val("");
            this._visibleInput.val("");
            this._updateValue("");
			this._valueContainer = [];
			this._textContainer = [];
            this.selectedTextValue = this._selectedValue = this._hiddenValue = this.model.itemValue = "";
            this._updateText();
            this.selectedIndexValue = this._hiddenDelimiterIndex = this._activeItem = -1;
            this._selectedItemsID = []; this._selectedIndices = [];
            this.model.selectedItems = [];
            this.model.selectedIndices = [];
            this.selectedIndex(null);
            if(!ej.isNullOrUndefined(this.ultag)){
            this.ultag.children("li").removeClass('e-hover').removeClass('e-active');
            if (this.model.showCheckbox) this._resetCheck();
            }
            if (this.wrapper.find('ul.e-ul.e-boxes').length != 0) {
                this._ulBox.children("li").remove();
                if (this._name === "")
                    this.wrapper.find("input:hidden[id^='#']").remove();
                else
                    this.wrapper.find("input:hidden[id^='#'][name=" + this._name + "]").remove();
                $(this.element).attr("name", this._name);
            }
        },

        _destroy: function () {
            if( this.selectOptions) {
                if (!this._dataSource() && this.docbdy ) 
                    this.docbdy.append(this.selectOptions.removeClass("e-dropdownlist e-js").show()).show();
                else this.selectOptions.insertAfter(this.wrapper).removeClass("e-dropdownlist e-js").show();
                this.element.remove();
            }
            else {
                this.element.insertAfter(this.wrapper);
                this.element.width(this.element.width() + this.dropdownbutton.outerWidth());
                this._visibleInput.removeClass("e-input ");
                this._setAttr( this.element[0], { 'accesskey': this.wrapper.attr('accesskey'), type:"text" });
                if (this._isWatermark) this._visibleInput.removeAttr("placeholder");
                this.element[0].value = "";
                this.element.removeAttr("aria-expanded aria-autocomplete aria-haspopup aria-owns accesskey role").css({"width": "", "display": "block"});
                (!this._dataSource()) && this.docbdy && this.ultag.find("li").removeClass("e-active") && this.docbdy.append(this.ultag.html()).show();
            }
            this.wrapper.remove();
            this.container.off("mousedown", $.proxy(this._OnDropdownClick, this));
            this._hideResult();
            this.popupPanelWrapper.remove();
			this._unwireEvents();
        },


        _finalize: function () {
            if (this.value() == "" && this._visibleInput[0].value !== "")
                this._updateValue(this.element[0].value);
            if ((!ej.isNullOrUndefined(this.value())&& this.value() == "") || this.value() !== this.element.val() ) 
                this._setValue(this.value());
            if ((!ej.isNullOrUndefined(this.model.text) && this.model.text == "") || this.model.text != this._visibleInput.val())
                this._setText(this.model.text);
            this.selectedIndex((this.selectedIndex() != -1) ? this.selectedIndex() : this.selectedItemIndex());
            if (this.selectedIndex() != -1) {
                this._selectItemByIndex(this.selectedIndex());
            } else if (this._selectedIndices.length > 0) {
                this._selectCheckedItem(this._selectedIndices);
            } if (this.model.disableItemsByIndex != null)
                this._disableItemByIndex(this.model.disableItemsByIndex);
            if (this.model.enableItemsByIndex != null)
                this._enableItemByIndex(this.model.enableItemsByIndex);
        },


        _initialize: function () {
            this._selectedIndices = this.model.selectedIndices.length > 0 ? this.model.selectedIndices : this.model.selectedItems;
            this.model.selectedItems = this.model.selectedIndices = this._selectedIndices;
            this.model.selectedIndex = this.model.selectedIndex != -1 ? this.model.selectedIndex : this.model.selectedItemIndex;
            if (this.element.is("select")) {
                this.selectelement = true;
                this._renderSelectToDropdown();
            }
            this._selectedItemsID = [];
			this._hiddenInputElement = [];
			this._valueContainer = [];
			this._textContainer =[];
            this.target = this.element[0];
            this._disabledItems = new Array();
            this._queryString = null;
            this.suggLen = 0;
            this._itemId = null;
            this.checkedStatus = false;
            this._incqueryString = "";
            this._activeItem = null;
            this.ddWidth = 0;
            this._initValue = true;
            this._virtualCount = 0;
            this._raiseEvents = true;
            this.popUpShow= false; 
        },
        _renderSelectToDropdown: function () {
            var i, optionLength, optionText, item;
            this.inputElement = ej.buildTag("input.e-dropdownlist#" + this._id + "_input", "", {}, { "type": "text", "data-role": "none" });
            this.inputElement.insertAfter(this.element);
			if (this.element.attr("name")) {
                this.inputElement.attr("name", this.element.attr("name"));
                this.element.removeAttr("name");
            }
			this.selectOptions = this.element;
            this.selectOptions.attr('id', this._id);
			if( this._dataSource() == null ) {
            this.optionDiv = ej.buildTag("div#" + this._id + "_list");
            this.optionDiv.insertAfter(this.inputElement);
            this.optionUl = ej.buildTag("ul");
            this.optionDiv.append(this.optionUl);

            this.selectOptionItems = this.element.children("option");
            optionLength = this.selectOptionItems.length;
            this.optionDummyUl = $();

            for (i = 0; i < optionLength; i++) {
                item = this.selectOptionItems[i], optionText = $(item).attr('label') ? $(item).attr('label') : item.innerHTML;
                if (optionText != null) {
                    this.optionLi = ej.buildTag("li", optionText, {}, { 'data-value': item.value, "unselectable": "on" });
                    this.optionDummyUl.push(this.optionLi[0]);
                    if ($(item).attr("selected")) {
                        if (this.model.showCheckbox)
                            if ($.inArray(i, this._selectedIndices) == -1) {
                                this._selectedIndices.push(i);
                                this.model.selectedItems = this.model.selectedIndices = this._selectedIndices;
                            }
                            else if (ej.isNullOrUndefined(this.selectedIndex())) this.selectedIndex(i);
                    }
                }
            }
            this.optionUl.append(this.optionDummyUl);

			}
            this.element.css('display', 'none');
            this.element = this.inputElement;
        },


        _render: function () {
            this._renderDropdown();
            this._setWatermark();
            if (this.model.loadOnDemand && (!this._dataSource() || this._dataSource().length < 1)) {
            var predecessor = this.element.parents().last();
            this.docbdy = this.model.targetID ? predecessor.find("#" + this.model.targetID) : this.optionDiv ? this.optionDiv : null;
            this.itemsContainer = this.docbdy[0].nodeName == "UL" ? this.docbdy : this.docbdy.children("ol,ul");
            this.itemsContainer.css("display", "none");
            }
            if(!this.model.loadOnDemand){
            this._renderPopupPanelWrapper();
            this._showFullList();
            }
            this._roundedCorner(this.model.showRoundedCorner);
            //To call finalize() only local data source
            var source = this._dataSource();
            if (ej.DataManager && source instanceof ej.DataManager) {
                if (source.dataSource.offline && (source.dataSource.json && source.dataSource.json.length > 0)) {
                    var proxy = this;
                    proxy._finalize();
                }               
            }
            else this._finalize();
            if (!(ej.DataManager && this._dataSource() instanceof ej.DataManager)){
                
                 this._finalize();
            }        
            if(this.model.loadOnDemand && (ej.DataManager && this._dataSource() instanceof ej.DataManager && !this._dataSource().dataSource.offline)) this._finalize();       
            this._setCheckAll(this.model.checkAll);
            if(this.element.attr("disabled") || $(this.selectOptions).attr("disabled"))this.disable();
            if(this.model.loadOnDemand)this.model.showPopupOnLoad && this._showResult();
        },

        _isEqualDataSource: function (source) {
            if (!this._dataSource() || !source || !(this._dataSource().length === source.length) || (ej.DataManager && source instanceof ej.DataManager)) return false;
            if(ej.isNullOrUndefined(this._rawList)) return false;
			var equal = true;
            for (var i = 0, len = this._dataSource().length; i < len; i++) {
                if (this._dataSource()[i] !== source[i]) {
                    equal = false;
                    break;
                }
            }
            return equal;
        },

        _checkModelDataBinding: function (source, query) {
            this.element.val("");
            this._visibleInput.val("");
            this._updateValue("");
            this.selectedTextValue = this._selectedValue = this._hiddenValue = "";
            this._updateText();
            this.selectedIndexValue = this._hiddenDelimiterIndex = this._activeItem = -1;
            this._selectedItemsID = [];
            this._textContainer = [];
            this._valueContainer = [];
            this.model.selectedItems = this.model.selectedIndices = this._selectedIndices = [];
            this.model.selectedIndex = this.model.selectedItemIndex = -1;
            if (this.model.multiSelectMode == "visualmode") this._destroyBoxModel();
            this._dataSource(source);
            this.model.query = query;
            !ej.isNullOrUndefined(this.ultag) && this.ultag.empty();
            this._showFullList();
        },
        _initDataSource: function (source) {
            var proxy = this;
            if (ej.DataManager && source instanceof ej.DataManager) {
                proxy._addLoadingClass();
                if (!proxy._trigger("actionBegin", { requestFrom: "default" })) {
                    var queryPromise = source.executeQuery(this._getQuery());
                    queryPromise.done(function (e) {
                        proxy._trigger("actionSuccess", { e: e, requestFrom: "default" });
                        proxy._totalCount = e.count;
                        proxy._listItem(e.result);
                        proxy._removeLoadingClass();
                        proxy._renderPopupList();
                        proxy._finalize();

                    }).fail(function (e) {
                        proxy._dataSource(null);
                        proxy._addLoadingClass();
                        proxy._trigger("actionFailure", { e: e, requestFrom: "default" });
                    }).always(function (e) {
                        proxy._trigger("actionComplete", { e: e, requestFrom: "default" });
                    });
                }
            }
        },
        _listItem: function (list, type) {
            if (type == "add") {
                this.popupListItems.push(list);
                this._rawList.push(list);
            } else if ($.isArray(list)) {
                this.popupListItems = list.slice(0);
                this._rawList = list.slice(0);
            }
        },
        _getQuery: function (isLocal) {
            var remoteUrl, mapper = this.model.fields, queryManager = ej.Query();
            if (ej.isNullOrUndefined(this.model.query) && !this.model.template && !isLocal) {
                var column = [];
                for (var col in mapper) {
                    if (col !== "tableName" && mapper[col])
                        column.push(mapper[col]);
                }
                if (column.length > 0)
                    queryManager.select(column);
            }
            else if (this.model.query) queryManager = this.model.query.clone();

            if (this.model.allowVirtualScrolling) queryManager.requiresCount();
            if (this.model.itemsCount > 0) queryManager.take(this.model.itemsCount);

            remoteUrl = this._dataSource().dataSource;
            if (mapper)
                if ((remoteUrl && remoteUrl.url && !remoteUrl.url.match(mapper.tableName + "$")) || (remoteUrl && !remoteUrl.url) || (!remoteUrl))
                    !ej.isNullOrUndefined(mapper.tableName) && queryManager.from(mapper.tableName);

            return queryManager;
        },

        _addLoadingClass: function () {
            if (this._isPopupShown()) {
                this.popupListWrapper.addClass("e-load");
            } else {
                this.dropdownbutton.addClass("e-load");
                this.drpbtnspan.removeClass("e-icon e-arrow-sans-down");
            }
            this._readOnly = true;
        },
        _removeLoadingClass: function () {
            this.dropdownbutton.removeClass("e-load");
            this.drpbtnspan.addClass("e-icon e-arrow-sans-down");
            this._readOnly = false;
            if(!ej.isNullOrUndefined(this.popupListWrapper)) this.popupListWrapper.removeClass("e-load");
        },

        _renderDropdown: function () {
            this.wrapper = ej.buildTag("span.e-ddl e-widget " + this.model.cssClass + "#" + this._id + "_wrapper", "", {}, { "tabindex": "0", "accesskey": this.element.attr("accesskey") });
            this.container = ej.buildTag("span.e-in-wrap e-box " + "#" + this._id + "_container");
            this.element.removeAttr('accesskey');            
			if(this.model.value == null && this.element.attr("value") != null)
				this.model.value = this.element.attr("value");				
			this.element.attr("value","").val("");
            if(!this._isIE8)
            this._setAttr(this.element[0], { "type":"hidden","role": "combobox", "aria-expanded": false, "aria-autocomplete": "list", "aria-haspopup": true, "aria-owns": this._id + "_popup" }).element.hide();
			else
			this._setAttr(this.element[0], {"role": "combobox", "aria-expanded": false, "aria-autocomplete": "list", "aria-haspopup": true, "aria-owns": this._id + "_popup" }).element.hide();			
            this.drpbtnspan = ej.buildTag("span.e-icon e-arrow-sans-down", "", {}, { "aria-label": "select", "unselectable": "on" });
            this.dropdownbutton = ej.buildTag("span.e-select#" + this._id + "_dropdown", "", {}, { "role": "button", "unselectable": "on" }).append(this.drpbtnspan);
            this.container.insertAfter(this.element);
            this.container.append(this.element);
            this.container.append(this.dropdownbutton);
            this.wrapper.insertBefore(this.container);
            this.wrapper.append(this.container);
            if (this.selectelement) {
                this.selectOptions.insertBefore(this.element);
            }
            this._visibleInput = ej.buildTag("input#" + this._id + "_hidden", "", {}).insertAfter(this.element);
            this._visibleInput.addClass("e-input ");
			this._setAttr(this._visibleInput[0],{ "readonly": "readonly", "tabindex": -1,"data-role": "none" });        
            if (!this._isWatermark) {
				var watermark=(this.model.watermarkText != null)? this.model.watermarkText:this._localizedLabels.watermarkText;
                this._hiddenSpan = ej.buildTag("span.e-input e-placeholder ").insertAfter(this.element);
                this._hiddenSpan.text(watermark);
                this._hiddenSpan.css("display", "none");
                this._hiddenSpan.on("mousedown", $.proxy(this._OnDropdownClick, this));
            }
            this._checkNameAttr();
            this._setDimentions();
            this._RightToLeft();
            this.ddWidth = (this.dropdownbutton.outerWidth() > 0) ? this.dropdownbutton.outerWidth() : 24;
            //Element not Maintain in Multiselection
            this.container.on("mousedown", $.proxy(this._OnDropdownClick, this));
        },

        _checkNameAttr: function () {
            this._name = ej.isNullOrUndefined(this.element.attr("name")) ? this._id : this.element.attr("name");
            this.element.attr("name", this._name);
        },
        _addAttr: function (htmlAttr) {
            var proxy = this;
            $.map(htmlAttr, function (value, key) {
				var keyName = key.toLowerCase();
                if (keyName == "class") proxy.wrapper.addClass(value); 
                else if (keyName == "disabled" && value == "disabled") proxy.disable();
                else if (keyName == "readOnly" && value == "readOnly") proxy.model.readOnly = true; 
                else if (keyName == "style") proxy.wrapper.attr(key, value);
				else if (ej.isValidAttr(proxy._visibleInput[0], key)) $(proxy._visibleInput).attr(key, value);
                else proxy.wrapper.attr(key, value)
            });
        },
        _renderBoxModel: function () {
            if (!ej.isNullOrUndefined(this._ulBox) || this.model.multiSelectMode != "visualmode") return false;
            this._ulBox = ej.buildTag("ul.e-ul e-boxes");
            this.container.prepend(this._ulBox);
            this._ulBox.css('min-height', '30px');
            this._ulBox.css('display', 'none');
            this._on(this.container, "click", function (e) {
                if (!this.model.enabled) return false;
                var $target = $(e.target);
                if ($target.hasClass("e-options")) {
                    if (!e.ctrlKey && $target.siblings().hasClass("e-active")) this._removeActive();
                    if ($target.hasClass("e-active")) $target.removeClass("e-active");
                    else $target.addClass("e-active");
                }
                if (!e.ctrlKey && ($target.hasClass("e-boxes"))) this._removeActive();
            });
        },

        _renderPopupPanelWrapper: function () {
            var oldWrapper = $("#" + this.element[0].id + "_popup_wrapper").get(0);
            if (oldWrapper)
                $(oldWrapper).remove();
            this.popupPanelWrapper = ej.buildTag("div#" + this._id + "_popup_wrapper");
            $('body').append(this.popupPanelWrapper);
            this.popupListWrapper = ej.buildTag("div.e-ddl-popup e-box e-widget  e-popup#" + this._id + "_popup_list_wrapper", "", { display: "none", overflow: "hidden" });
            this.popupList = ej.buildTag("div#" + this._id + "_popup", { "tabIndex": 0 });
            this.popupListWrapper.addClass(this.model.cssClass);
            this.popup = this.popupList;
            this.popupScroller = ej.buildTag("div"); if((ej.isNullOrUndefined(this.ultag))) this.ultag = ej.buildTag("ul.e-ul", "", {}, { "role": "listbox" });
            this.popupScroller.append(this.ultag);
            this.popupList.append(this.popupScroller);
            if (this.model.headerTemplate) {
                this.headerTemplate = $("<div>").append(this.model.headerTemplate);
                this.popupListWrapper.append(this.headerTemplate);
            }
            this.popupListWrapper.append(this.popupList);
            this.popupPanelWrapper.append(this.popupListWrapper);
            this.ultag.on({ mouseenter: $.proxy(this._OnMouseEnter, this), mouseleave: $.proxy(this._OnMouseLeave, this), click: $.proxy(this._OnMouseClick, this)}, "li:not('.e-category')");
            if (ej.isTouchDevice())
             {
             this.ultag.on({tap:$.proxy(this._OnMouseEnter, this) }, "li:not('.e-category')");
               }
            $(window).on("resize", $.proxy(this._OnWindowResize, this));

        },

        _updateText: function () {
            var val = this._visibleInput.val();
            this.model.text = (val == "") ? (this._textContainer.length == 0) ? null : "" : val;
        },
        _updateValue: function (val) {
            this.value(val == "" ? (this._valueContainer.length == 0)? null : "" : val);
        },
        _setGroupingAndSorting: function (prop, value) {
            this.model[prop] = value;
            var oldValue = this.model.text;
            this._updateValue("");
            this._selectedIndices = [];
            this.ultag.empty();
            this._showFullList();
            if (this.model.showCheckbox && oldValue) {
                var values = oldValue.split(this.model.delimiterChar);
                for (var i = 0; i < values.length; i++)
                    this.selectItemByText(values[i]);
            }
            else
                this.selectItemByText(oldValue);
        },
        _setSortingList: function () {
            var sortedlist = document.createElement("ul"), i, sortitems;
            $(sortedlist).append(this.itemsContainer.children());
            if (this.model.allowGrouping || $(sortedlist).find(">.e-category").length > 0) {
                this.popupListWrapper.addClass("e-atc-popup");
                for (i = 0; i < $(sortedlist).find(">.e-category").length; i++) {
                    sortitems = $(sortedlist).find(">.e-category").eq(0).first().nextUntil(".e-category").get();
                    this._setSortList(sortedlist, sortitems);
                }
            }
            else {
                $(sortedlist).children('>.e-category').remove();
                sortitems = $(sortedlist).children('li').get();
                this._setSortList(sortedlist, sortitems);
            }
            this.itemsContainer = $(sortedlist);
        },
        _setSortList: function (sortedlist, sortitems) {
            sortitems.sort(function (objA, objB) {
                var sortA = $(objA).text().toUpperCase();
                var sortB = $(objB).text().toUpperCase();
                return (sortA < sortB) ? -1 : (sortA > sortB) ? 1 : 0;
            });
            if (this.model.sortOrder == "descending") sortitems.reverse();
            if (this.model.allowGrouping || $(sortedlist).find(">.e-category").length > 0) {
                $(sortedlist).append($("<li>").text($(sortedlist).find(">.e-category").eq(0).text()).addClass("e-category"));
                $(sortedlist).find(">.e-category").eq(0).remove();
            }
            $.each(sortitems, function (index, item) {
                $(sortedlist).append(item);
            });
        },

        _renderPopupList: function () {
            this._doDataBind();
            if(this.model.loadOnDemand && (ej.DataManager && this._dataSource() instanceof ej.DataManager && !this._dataSource().dataSource.offline)){
            this.model.showCheckbox && this._checkboxHideShow(this.model.showCheckbox);
            }
            if(ej.isNullOrUndefined(this.scrollerObj) || this._ulBox==null)this._renderRemaining(); 
            if (this.model.loadOnDemand && (this.popUpShow && ej.DataManager && this._dataSource() instanceof ej.DataManager && !this._dataSource().dataSource.offline)){
                this._refreshPopup();
                this._refreshScroller();
            }
        },
        _renderRemaining: function () {
            var proxy = this;
           if(!ej.isNullOrUndefined(this.popupListWrapper)) this._dropbtnRTL();
            if (this.model.enableFilterSearch) this._enableSearch();
            if (this.model.enablePopupResize) this._enablePopupResize();
            if (this.model.allowVirtualScrolling && this.model.virtualScrollMode == "normal") {
                if (this._totalCount && this._totalCount > 0) {
                    this._totalHeight = this._totalCount * 29;
                    this._totalPages = this._totalCount / (this.model.itemsCount * 29);
                    this._loadedItemHeight =  this._getLi().length * 29;
                    this._getLi().attr("page", 0);
                    this._virtualPages = [0];
                    this.ultag.append($("<span>").addClass("e-virtual").css({ "height": this._totalHeight - this._loadedItemHeight, "display": "block" }));
                }
            }
            this._virtualUl = this.ultag.clone(true);
           if(!ej.isNullOrUndefined(this.popupListWrapper)){ 
				this._setListWidth();
            	this._setListHeight();
			}
			if (!this._isSingleSelect()) {
                if (this.model.showCheckbox) this._checkboxHideShow(this.model.showCheckbox);
                else this._multiItemSelection(this._getLi());
            }
            this._setUncheckAll(this.model.uncheckAll);
            if(!ej.isNullOrUndefined(this.popupListWrapper)){
            this.popupScroller.css({ "height": "", "width": "" });
            this.popupList.ejScroller({
                height: this._getPopupHeight(), width: 0, scrollerSize: 20, scroll: function (e) {
                    if (proxy.model.allowVirtualScrolling) proxy._onScroll(e);
                }
            });
            this.scrollerObj = this.popupList.ejScroller("instance");
            this.popupList.find("div.e-scrollbar div").attr("unselectable", "on");
			this._setListPosition();
            !this.popUpShow && this.popupListWrapper.css({ 'display': 'none', 'visibility': 'visible' });
            this._changeSkin(this.model.cssClass);
            }
            if(!this.model.loadOnDemand)this.model.showPopupOnLoad && this._showResult();
        },

        _enableSearch: function () {
            if (this.model.enableFilterSearch)
                if (!ej.isNullOrUndefined(this.popupListWrapper) && !this.inputSearch) {
                    this.inputSearch = ej.buildTag("input#" + this._id + "_inputSearch.e-input", "", {}, { "type": "text", "data-role": "none" });
                    this.popupListWrapper.prepend($("<span>").addClass("e-atc e-search").append($("<span>").addClass("e-in-wrap ").append(this.inputSearch).append($("<span>").addClass(" e-icon e-search"))));
                    var debounceListener = (this.model.enableServerFiltering) ? this._debounce(this._OnSearchEnter, 200): this._OnSearchEnter;
                    this._on(this.inputSearch, "keyup", debounceListener)._on(this.inputSearch, "keydown", function(args){
						var keyCode = args.keyCode || args.which; 
						  if (keyCode == 9) { 
						    args.preventDefault(); 
						    this.wrapper.focus();
							this._hideResult();
						  } 
					});
                }
        },
        _removeSearch: function () {
            this.model.enableFilterSearch = false;
            this.popupListWrapper.find(".e-atc.e-search").remove();
            if (this._isPopupShown()) this.hidePopup();
            this.inputSearch = null;
        },

        _OnSearchEnter: function (e) {
            var proxy = this;
            if ($.inArray(e.keyCode, [38, 40, 13]) != -1 && this.ultag.find("li.e-nosuggestion").length <= 0) {
                if (e.keyCode == 13) this._OnKeyUp(e);
                else this._OnKeyDown(e);
            }
            else {
                this._activeItem = -1;
                this._queryString = this.inputSearch.val();
                if (this._queryString == "" && this._virtualUl) {
                    var args = { searchString: this._queryString, searchQuery: null, items: this._rawList };
                    this._trigger("search", args);
                    this._resetList();
                    this._updateSelectedIndexByValue(this.value());
                    this._refreshScroller();
                    this._setListPosition();
                } else {
                    this._mapFields(); 
                    var searchQuery = this._addSearchQuery(ej.Query(), !this._isPlainType(this._rawList));
                    var args = { searchString: this._queryString, items: this._rawList, searchQuery: searchQuery };
                    this.popupListWrapper.find(".e-atc.e-search .e-search").addClass("e-cross-circle").removeClass("e-search");
                    this._on(this.popupListWrapper.find(".e-atc.e-search .e-cross-circle"), "mousedown", this._refreshSearch);
                    if (!this._trigger("search", args)){ 
                        proxy._onActionComplete(args); 
                }
                  
                }
            } 
        },
        _debounce: function(eventFunction, delay) { 
            var out;
            var proxy = this;
            return function (){
                var args= arguments;
                var later = function(){
                    out = null;
                return eventFunction.apply(proxy, args);
                };
                clearTimeout(out);
                out = setTimeout(later, delay);
            };
        },
        _onActionComplete: function(args){
            var proxy = this; 
            this._queryString = this.inputSearch.val();
                        var searchQuery = this._addSearchQuery(ej.Query(), !this._isPlainType(this._rawList));
                    var args = { searchString: this._queryString, items: this._rawList, searchQuery: searchQuery }; 
                if(ej.DataManager && this._dataSource() instanceof ej.DataManager && this.model.enableServerFiltering && (window.getSelection().type == "Caret" || ej.browserInfo().name == "msie" )){
                        var searchQuery = args.searchQuery.clone();
                        var queryPromise = proxy._dataSource().executeQuery(searchQuery);
                        queryPromise.done(function (e) { 
                        proxy._filterSearch(args.searchQuery, e); 
                    });
                        }
                        else{
                            proxy._filterSearch(searchQuery, args);
                        }
        },
        _refreshSearch: function () {
            this._resetSearch();
            this._refreshPopup();
        },
        _filterSearch: function (searchQuery, args) {
            var flag = false; 
            this.resultList = args.result ? args.result : ej.DataManager(this._rawList).executeLocal(searchQuery);
            if (this.resultList.length == 0) {
                flag = true;
                this.resultList.push(this._getLocalizedLabels("emptyResultText"));
            }
            this.popupListItems = this.resultList;
            this.ultag.empty();
            this._isPlainType(this.popupListItems) ? this._plainArrayTypeBinding(this.resultList) :
            this._objectArrayTypeBinding(this.resultList, "search");
            if (flag && this.ultag.find("li").length == 1) {
                this.ultag.find("li").eq(0).addClass("e-nosuggestion");
            }
            if (this.model.showCheckbox && !flag) {
                this._appendCheckbox( this._getLi());
            }
            this._onSearch = true;
            var value = this.value(), visibleText = this._visibleInput[0].value;
            this._setValue(this.value());
			var checkVal = typeof this.model.value === "function" ? this.model.value() : this.model.value;
			if(checkVal != value){
				this.element[0].value = value;
				this._visibleInput[0].value = visibleText;
				this.model.text = visibleText == "" ? null : visibleText;
				if (this.value() != value && !(this.value() == null && value =="" )) {
					this._updateValue(value);
				}
			}
            this._onSearch = false;
            this._updateSelectedIndexByValue(this.value());
            this._refreshScroller();
            this._setListPosition();
        },
        _updateSelectedIndexByValue: function (value) {
            if (!value || !this.model.enableFilterSearch) return;
            this._selectedIndices = this.model.selectedItems = this.model.selectedIndices = [];
            this._virtualList = this._virtualUl.children("li:not('.e-category')");
            var item = this._toArray(value);
            for (var k = 0; k < item.length; k++) {
                for (var m = 0; m < this._virtualList.length; m++) {
                    if (item[k] == this._getIndexedValue(this._virtualList[m])) {
                        this._selectedIndices.push(m);
                        break;
                    }
                }
            }
            this.model.selectedItems = this.model.selectedIndices = this._selectedIndices;
        },
        _getIndexedValue: function (item) {
            return this._getAttributeValue(item) ? this._getAttributeValue(item) : item.innerText;
        },

        _resetSearch: function () {
            if (!this.inputSearch || !(this.model && this.model.enableFilterSearch)) return;
            if (this.inputSearch.val() != "" && this._virtualUl) {
                this.inputSearch.val("");
                this._resetList();
            }
        },
        _resetList: function () {
            if (this.popupListWrapper.find(".e-atc.e-search .e-cross-circle").length == 1) {
                this.popupListWrapper.find(".e-atc.e-search .e-cross-circle").addClass("e-search").removeClass("e-cross-circle");
                this._off(this.popupListWrapper.find(".e-atc.e-search .e-cross-circle"), "mousedown", this._refreshSearch);
            }
            if(this.model.enableServerFiltering){
			var field = (this.model.fields && this.model.fields.value) ? this.model.fields["value"] : "value";
			for (var i=0; i< this._rawList.length; i++){
				if(this._rawList[i][field] == this._selectedValue)
					this._searchresult= null;
			} 
			if(!ej.isNullOrUndefined(this._searchresult) && !(this.model.allowVirtualScrolling && this.model.virtualScrollMode == "normal"))
                this.addItem(this._searchresult);
            }
            this._listItem(this._rawList);
            this.ultag.empty().append(this._virtualUl.children().clone(true));           
            // this._onSearch variable will restrict the change and select event on searching
            this._onSearch = true;
            this._setValue(this.value());
            this._onSearch = false;
			this._searchresult = [];
        },

       
        _addSearchQuery: function (query, checkMapper) {
            var bindTo = "";
            if (checkMapper) {
                var mapper = this.model.fields;
                bindTo = (mapper && mapper.text) ? mapper["text"] : "text";
            }
            if (this._queryString) query.where(bindTo, this.model.filterType, this._queryString, !this.model.caseSensitiveSearch);
            if (this.model.itemsCount > 0) query.take(this.model.itemsCount);
            return query;
        },

        _targetElementBinding: function () {
            var predecessor = this.element.parents().last();
            this.docbdy = this.model.targetID ? predecessor.find("#" + this.model.targetID) : this.optionDiv ? this.optionDiv : null;
            if (!this.docbdy) return false;
            this.itemsContainer = this.docbdy[0].nodeName == "UL" ? this.docbdy : this.docbdy.children("ol,ul");
            if ((this.model.allowGrouping || this.itemsContainer.find(">.e-category").length > 0) && !this.model.enableSorting) {
                this.popupListWrapper.addClass("e-atc-popup");
                for (var k = 0; k < this.itemsContainer.find(">.e-category").length; k++) {
                    var ele = this.itemsContainer.find(">.e-category").eq(k);
                    ele.replaceWith($("<li>").text(ele.text()).addClass("e-category"));
                }
            }
            else if (this.model.enableSorting) this._setSortingList();
            this.itemsContainer.children("ol,ul").remove();
            if(this.model.loadOnDemand)
            this.items = (this.itemsContainer.children().length>0)?this.itemsContainer.children('li'): this.items;
            else
            this.items = this.itemsContainer.children('li');
            this.items.children("img,div").addClass("e-align");
            this._listItem([]);
            for (var i = 0; i < this.items.length; i++) {
                var fieldText = $(this.items[i]).text(), fieldValue = this._getAttributeValue(this.items[i]);
                if(!$(this.items[i]).attr("data-value")) $(this.items[i]).attr("data-value", fieldValue ? fieldValue : fieldText);
                this._listItem({ text: fieldText, value: fieldValue ? fieldValue : fieldText }, "add");
            }
            //This will append the list with the popup wrapper
            if(this.model.loadOnDemand)
            this.ultag.empty().append(this.items);
            else 
            this.ultag.empty().append(this.itemsContainer.children());
			this.ultag.children('li').attr("role", "option").attr("unselectable", "on");		
            this.docbdy.css({ 'display': 'none' }).children("ol,ul").remove();
        },
        _plainArrayTypeBinding: function (list) {
            this.dummyUl = $();
            if (this.model.enableSorting) {
                list.sort();
                if (this.model.sortOrder == "descending") list.reverse();
            }
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    if (!ej.isNullOrUndefined(list[i])) {
                        var litag = ej.buildTag("li", list[i], {}, { 'data-value': list[i], "unselectable": "on" });
                        this.dummyUl.push(litag[0]);
                    }
                }
                this.ultag.append(this.dummyUl);
                this._trigger('dataBound', { data: list });
            }

        },
        _mapFields: function () {
            this.model.fields.groupBy = this.model.fields.groupBy ? this.model.fields.groupBy : this.model.fields.category;
            var mapper = this.model.fields;
            this.mapFld = { _id: null, _imageUrl: null, _imageAttributes: null, _spriteCSS: null, _text: null, _value: null, _htmlAttributes: null, _selected: null };
            this.mapFld._id = (mapper && mapper.id) ? mapper["id"] : "id";
            this.mapFld._imageUrl = (mapper && mapper.imageUrl) ? mapper["imageUrl"] : "imageUrl";
            this.mapFld._imageAttributes = (mapper && mapper.imageAttributes) ? mapper["imageAttributes"] : "imageAttributes";
            this.mapFld._spriteCSS = (mapper && mapper.spriteCssClass) ? mapper["spriteCssClass"] : "spriteCssClass";
            this.mapFld._text = (mapper && mapper.text) ? mapper["text"] : "text";
            this.mapFld._value = (mapper && mapper.value) ? mapper["value"] : "value";
            this.mapFld._htmlAttributes = (mapper && mapper.htmlAttributes) ? mapper["htmlAttributes"] : "htmlAttributes";
            this.mapFld._selected = (mapper && mapper.selected) ? mapper["selected"] : "selected";
            this.mapFld._category = (mapper && mapper.groupBy) ? mapper["groupBy"] : "groupBy";
        },
        _doDataBind: function () {
            var source = this._dataSource(), list = this.popupListItems;
            !source || !list || !list.length || list.length < 1 ? this._targetElementBinding()
            : this._isPlainType(list) ? this._plainArrayTypeBinding(list)
            : this._objectArrayTypeBinding(list);
        },
        _isPlainType: function (list) {
            return typeof list[0] != "object";
        },
        _objectArrayTypeBinding: function (list, from) {
            this.dummyUl = $();
            this._mapFields();
            if (this.model.enableSorting) {
                var sortQuery = ej.Query().sortBy(this.mapFld._text, this.model.sortOrder, true);
                list = ej.DataManager(list).executeLocal(sortQuery);
				this.popupListItems = list;
            }
            if (this.model.allowGrouping || this.model.fields.groupBy) {
              if(!ej.isNullOrUndefined(this.popupListWrapper)) this.popupListWrapper.addClass("e-atc-popup");
                var mapCateg = this.mapFld._category, groupedList, groupQuery;
                groupQuery = ej.Query().group(mapCateg);
                if (!this.model.enableSorting) groupQuery.queries.splice(0, 1);
                groupedList = ej.DataManager(list).executeLocal(groupQuery);
                this._swapUnCategorized(groupedList);
                (from == "search") ? this.popupListItems = [] : this._listItem([]);
                for (var i = 0; i < groupedList.length; i++) {
                    if (groupedList[i].key)
                        this.ultag.append(ej.buildTag("li.e-category", groupedList[i].key).attr("role", "option")[0]);
                    this._generateLi(groupedList[i].items, this.mapFld);
                    this.ultag.append(this.dummyUl);
                    for (var j = 0; j < groupedList[i].items.length; j++) {
                        (from == "search") ? this.popupListItems.push(groupedList[i].items[j]) : this._listItem(groupedList[i].items[j], "add");
                    }
                }
            }
            else {
                this._generateLi(list, this.mapFld);
                this.ultag.append(this.dummyUl);//ko binding
            }
            this._trigger('dataBound', { data: list });
        },
        _onScroll: function (e) {
            if (!e.scrollTop) return;
            var scrollerPositon = e.scrollTop, proxy = this;
            var source = this._dataSource();
            if (proxy.model.allowVirtualScrolling && proxy.model.virtualScrollMode == "continuous") {
                var list, queryPromise, skipQuery = ej.Query().skip(proxy._rawList.length).take(proxy.model.itemsCount).clone();
                if (scrollerPositon >= Math.round($(proxy.popupList).find("ul,ol").height() - $(proxy.popupList).height()) && proxy._rawList.length < proxy._totalCount) {
                    proxy._addLoadingClass();
                    if (ej.DataManager && proxy._dataSource() instanceof ej.DataManager && !ej.isNullOrUndefined(proxy._dataSource().dataSource.url)) {
                        if (proxy.inputSearch && proxy.inputSearch.val() != "" && this.model.enableServerFiltering) 
                         skipQuery = proxy._addSearchQuery(ej.Query(), !proxy._isPlainType(proxy._rawList)).skip(proxy._getLi().length).clone();
                        else
                        skipQuery = proxy._getQuery().skip(proxy._rawList.length).take(proxy.model.itemsCount).clone();
                        if (!proxy._trigger("actionBegin", { requestFrom: "scroll" })) {
                            queryPromise = proxy._dataSource().executeQuery(skipQuery);
                            queryPromise.done(function (e) {
                                if (!ej.isNullOrUndefined(proxy.model.value) && proxy.model.enableServerFiltering)
                                    e.result = proxy._removeSelectedValue(e.result);
                                proxy.addItem(e.result);
                                proxy._removeLoadingClass();
                                proxy._trigger("actionSuccess", { e: e, requestFrom: "scroll" });
                            }).fail(function () {
                                proxy._dataSource(null);
                                proxy._removeLoadingClass();
                                proxy._trigger("actionFailure", { e: e, requestFrom: "scroll" });
                            }).always(function (e) {
                                proxy._trigger("actionComplete", { e: e, requestFrom: "scroll" });
                            });
                        }
                    }
                    else if (ej.DataManager && source instanceof ej.DataManager && source.dataSource.offline && (source.dataSource.json && source.dataSource.json.length > 0)) {
                                proxy.addItem(this._localDataVirtualScroll());
                                window.setTimeout(function () {
                                proxy._removeLoadingClass();
                            }, 100);
                    }
                    else {
                        list = ej.DataManager(proxy._dataSource()).executeLocal(skipQuery);
                        proxy.addItem(proxy._removeSelectedValue(list));
                        proxy._removeLoadingClass();
                    }
                }
            } else if (proxy.model.allowVirtualScrolling && proxy.model.virtualScrollMode == "normal") {

                window.setTimeout(function () {
                    if (proxy._virtualCount == 0) {
                        proxy._loadList();
                    }
                }, 300);

            }

        },
        _localDataVirtualScroll: function () {
            var proxy = this;
            var selectValue = (!ej.isNullOrUndefined(proxy.value())) ? (typeof(proxy.value()) == "number") ? 1 : proxy.value().split(proxy.model.delimiterChar).length : 0;
            var _rawlist = (proxy._checkValue) ? proxy._rawList.length - selectValue : proxy._rawList.length;
            var queryPromise = ej.DataManager(proxy._dataSource().dataSource.json).executeLocal(ej.Query().skip(_rawlist).take(proxy.model.itemsCount).clone());
            return proxy._removeSelectedValue(queryPromise); 
        },
        _removeSelectedValue: function (data) { 
            if (!ej.isNullOrUndefined(this.value())) {
                var listitems = (typeof(this.value()) == "number") ? this.value() : this.value().split(this.model.delimiterChar);
                for (var k = 0; k < listitems.length; k++) {
                    for (var m = 0; m < data.length; m++) {
                        if (data[m][this.mapFld._value] == listitems[k]) 
                            data.splice(data.indexOf(data[m]), 1);
                    }
                }
                return data;
            }
            else
                return data;
        },
        _loadList: function () {
            this._virtualCount++;
            var source = this._dataSource();
            var top = this.scrollerObj.scrollTop(), proxy = this, prevIndex = 0, prevPageLoad, nextIndex = null;
            this._currentPage = Math.round(top / (29 * this.model.itemsCount));
            if (($.inArray(this._currentPage, this._virtualPages.sort(function (a, b) { return a - b; }))) != -1) {
                if (this._currentPage == 0) {
                    if (($.inArray(this._currentPage + 1, this._virtualPages)) != -1) {
                        this._virtualCount--;
                        return false;
                    } else {
                        this._currentPage = this._currentPage + 1;
                    }
                }
                else if (($.inArray(this._currentPage - 1, this._virtualPages)) != -1) {
                    if (($.inArray(this._currentPage + 1, this._virtualPages)) != -1) {
                        this._virtualCount--;
                        return false;
                    } else {
                        this._currentPage = this._currentPage + 1;
                    }
                }
                else {
                    this._currentPage = this._currentPage - 1;
                }
            }
            prevPageLoad = !($.inArray(this._currentPage - 1, this._virtualPages) != -1);
            this._addLoadingClass();
            for (var i = this._virtualPages.length - 1; i >= 0; i--) {
                if (this._virtualPages[i] < this._currentPage) {
                    prevIndex = this._virtualPages[i];
                    if (!(i + 1 == this._virtualPages.length))
                        nextIndex = this._virtualPages[i + 1];
                    break;
                }
            }

            var firstArg = prevPageLoad ? (this._currentPage - 1) * this.model.itemsCount : this._currentPage * this.model.itemsCount;
            var skipQuery = ej.Query().range(firstArg, this._currentPage * this.model.itemsCount + this.model.itemsCount), queryPromise, list;
            if (ej.DataManager && proxy._dataSource() instanceof ej.DataManager && !ej.isNullOrUndefined(proxy._dataSource().dataSource.url)) {
                var skipParam = prevPageLoad ? (this._currentPage - 1) * this.model.itemsCount : this._currentPage * this.model.itemsCount;
                skipQuery = this._getQuery().skip(skipParam);
                if (prevPageLoad) {
                    for (i = 0; i < skipQuery.queries.length; i++) {
                        if (skipQuery.queries[i].fn == "onTake") {
                            skipQuery.queries.splice(i, 1);
                            break;
                        }
                    }
                    skipQuery.take(2 * this.model.itemsCount);
                }
                if (!proxy._trigger("actionBegin", { requestFrom: "scroll" })) {
                   if (proxy.inputSearch && proxy.inputSearch.val() != "" && this.model.enableServerFiltering) var skipQuery = proxy._addSearchQuery(ej.Query(), !proxy._isPlainType(proxy._rawList)).skip(proxy._getLi().length).clone();
                    queryPromise = proxy._dataSource().executeQuery(skipQuery);
                    queryPromise.done(function (e) {
                        e.result = proxy._removeSelectedValue(e.result);
                        proxy._appendVirtualList(e.result, prevIndex, proxy._currentPage, nextIndex, prevPageLoad);
                        proxy._removeLoadingClass();
                        proxy._trigger("actionSuccess", { e: e, requestFrom: "scroll" });
                    }).fail(function (e) {
                        proxy._virtualCount--;
                        proxy._removeLoadingClass();
                        proxy._trigger("actionFailure", { e: e, requestFrom: "scroll" });
                    }).always(function (e) {
                        proxy._trigger("actionComplete", { e: e, requestFrom: "scroll" });
                    });
                }
            }
            else if (ej.DataManager && source instanceof ej.DataManager && source.dataSource.offline && (source.dataSource.json && source.dataSource.json.length > 0)) {
                proxy._appendVirtualList(this._localDataVirtualScroll(), prevIndex, proxy._currentPage, nextIndex, prevPageLoad);
                window.setTimeout(function () {
                    proxy._removeLoadingClass();
                }, 100);
            }
            else {
                list = ej.DataManager(proxy._dataSource()).executeLocal(skipQuery);
                proxy._appendVirtualList(proxy._removeSelectedValue(list), prevIndex, proxy._currentPage, nextIndex, prevPageLoad);
                proxy._removeLoadingClass();
            }
        },
        _appendVirtualList: function (list, prevIndex, currentIndex, nextIndex, prevPageLoad) {
            this._virtualCount--;
            this.ultag.find("span.e-virtual").remove();
            if (!ej.isNullOrUndefined(this.activeItem)) this.activeItem.attr("page", "0");
            if (($.inArray(currentIndex, this._virtualPages.sort(function (a, b) { return a - b; }))) != -1) return false;
            if (prevPageLoad && ($.inArray(currentIndex - 1, this._virtualPages.sort()) != -1)) {
                list.splice(0, this.model.itemsCount);
                prevPageLoad = false;
            }
            var items = this.model.itemsCount, tempUl = $("<ul>"), firstVirtualHeight, secondVirtualHeight;
            firstVirtualHeight = prevPageLoad ? ((currentIndex - 1) * items * 29) - (prevIndex * items + items) * 29 : (currentIndex * items * 29) - (prevIndex * items + items) * 29;
            if (firstVirtualHeight != 0) tempUl.append($("<span>").addClass("e-virtual").css({ display: "block", height: firstVirtualHeight }));
            this._mapFields();
            this._generateLi(list, this.mapFld);
            $(this.dummyUl).attr("page", currentIndex);
            if (prevPageLoad) {
                $(this.dummyUl).slice(0, items).attr("page", currentIndex - 1);
            }
            if (this.model.showCheckbox) {
                this._appendCheckbox(this.dummyUl);
            }
            tempUl.append(this.dummyUl);
            secondVirtualHeight = (currentIndex * items + items) * 29;
            if (nextIndex != null) secondVirtualHeight = (nextIndex * items * 29) - secondVirtualHeight;
            else secondVirtualHeight = this.ultag.height() - secondVirtualHeight;
            if (secondVirtualHeight != 0) tempUl.append($("<span>").addClass("e-virtual").css({ display: "block", height: secondVirtualHeight }));
            if (this.model.itemsCount > 0 && this.value() != "" && (this._dataSource() instanceof ej.DataManager && this._dataSource().dataSource.offline))
                var selector = this.ultag.find("li").last();
            else
                var selector = this.ultag.find("li[page=" + prevIndex + "]").last();
            selector.next().remove();
            tempUl.children().insertAfter(selector);
            this._virtualPages.push(currentIndex);
            if (prevPageLoad) this._virtualPages.push(currentIndex - 1);
            for (var i = 0; i < list.length; i++) {
                this._listItem(list[i], "add");
            }
            this._virtualUl = this.ultag.clone(true);
            this._renderBoxModel();
        },

        _generateLi: function (list, mapFld) {
            this.mapFld = mapFld;
            this.dummyUl = [];
            if (!list || !list.length || list.length < 1) return false;
            for (var i = 0; i < list.length; i++) {
                var _did = this._getField(list[i], this.mapFld._id),
                    _dimageUrl = this._getField(list[i], this.mapFld._imageUrl),
                    _dimageAttributes = this._getField(list[i], this.mapFld._imageAttributes),
                    _dspriteCss = this._getField(list[i], this.mapFld._spriteCSS),
                    _dtext = this._getField(list[i], this.mapFld._text),
                    _dvalue = this._getField(list[i], this.mapFld._value),
                    _dhtmlAttributes = this._getField(list[i], this.mapFld._htmlAttributes),
                    _dselected = this._getField(list[i], this.mapFld._selected),
                    litag = document.createElement("li");

                if (!ej.isNullOrUndefined(_dvalue)) {
                    litag.setAttribute('data-value', typeof _dvalue == "object" ? JSON.stringify(_dvalue) : _dvalue);
                }
                else {
                     litag.setAttribute('data-value', _dtext);
                }
                if (!ej.isNullOrUndefined(_did) && (_did !== ""))
                    litag.setAttribute('id', _did);
                if (!ej.isNullOrUndefined(_dhtmlAttributes) && (_dhtmlAttributes != "")) {
                    this._setAttr(litag, _dhtmlAttributes);
                }

                if (this.model.template) {
                    $(litag).append(this._getTemplatedString(list[i]));
                } else {
                    if (!ej.isNullOrUndefined(_dimageUrl) && (_dimageUrl != "")) {
                        var imgtag = document.createElement("img");
                        this._setClass(imgtag, "e-align")._setAttr(imgtag, { 'src': _dimageUrl, 'alt': _dtext });
                        if ((_dimageAttributes) && (_dimageAttributes != "")) {
                            this._setAttr(imgtag, _dimageAttributes);
                        }
                        litag.appendChild(imgtag);
                    }
                    if (!ej.isNullOrUndefined(_dspriteCss) && (_dspriteCss != "")) {
                        var divtag = document.createElement("div");
                        this._setClass(divtag, 'div.e-align ' + _dspriteCss + ' sprite-image');
                        litag.appendChild(divtag);
                    }
                    if (_dselected) {
                        this._setClass(litag, "chkselect");
                    }
                    {
                        if (ej.isNullOrUndefined(_dtext)) _dtext = String(_dtext);
                        var textEle = document.createElement("span");
                        textEle.innerHTML = _dtext;                      
                        this._setClass(textEle, "e-ddltxt");
                        litag.innerHTML += textEle.outerHTML;
                    }
                }
                this._setAttr(litag, { "role": "option", "unselectable": "on" });
                this.dummyUl.push(litag);
             
            }
        },

        _setAttr: function (element, attrs) {
            if (typeof attrs == "string") {
                var sAttr = attrs.replace(/['"]/g, "").split("=");
                if (sAttr.length == 2) element.setAttribute(sAttr[0], sAttr[1]);
            }
            else {
                for (var idx in attrs) {
                    if ((idx == 'styles' || idx == 'style') && typeof attrs[idx] == 'object') {
                        for (var prop in attrs[idx]) {
                            element.style[prop] = attrs[idx][prop];
                        }
                    }
                    else
                        element.setAttribute(idx, attrs[idx]);
                }
            }
            return this;
        },
        _setClass: function (element, classNme) {
            element.className += " " + classNme;
            return this;
        },
        _removeClass: function (element, classNme) {
            var index = element.className.indexOf(classNme);
            if (index >= 0) {
                if (index != 0 && element.className[index - 1] === " ")
                    element.className = element.className.replace(" " + classNme, "");
                else element.className = element.className.replace(classNme, "");
            }
            return this;
        },
        _hasClass: function (element, classNme) {
            return element.className.indexOf(classNme) >= 0;
        },
        _swapUnCategorized: function (list) {
            $(list).each(function (i, obj) {
                if (!obj.key) {
                    for (var j = i; j > 0; j--) {
                        list[j] = list[j - 1];
                    }
                    list[j] = obj;
                    return false;
                }
            });
        },

        _getField: function (obj, fieldName) {
            return ej.pvt.getObject(fieldName, obj);
        },

        _getTemplatedString: function (list) {

            var str = this.model.template, start = str.indexOf("${"), end = str.indexOf("}");
            while (start != -1 && end != -1) {
                var content = str.substring(start, end + 1);
                var field = content.replace("${", "").replace("}", "");
                str = str.replace(content, this._getField(list, field));
                start = str.indexOf("${"), end = str.indexOf("}");
            }
            return str;
        },

        _setWatermark: function () {
            if ((this.element.val() == "") && this._trim(this._visibleInput.val()) == "") {
				var watermark=(this.model.watermarkText != null)? this.model.watermarkText:this._localizedLabels.watermarkText;
                if (this._isWatermark)
                    this._visibleInput.attr("placeholder", watermark);
                else
                    this._hiddenSpan.css("display", "block").text(watermark);
                //In visual mode, to show watermark text when no items selected.
                if (this.model.multiSelectMode == "visualmode" && this._ulBox && this._ulBox.find('li').length == 0) this._swapUlandInput(false);
            }
        },

        _checkboxHideShow: function (value) {
            if(!ej.isNullOrUndefined(this.ultag)){
            if (value) {
                this.listitems = this._getLi();
                var chklist = this.listitems.find('input[type=checkbox]');
                if (chklist.length == 0) {
                    this._appendCheckbox(this.listitems);
                }
            }

            else
                this._removeCheck(this.popupList);
            this.model.showCheckbox = value;
            this._virtualUl = this.ultag.clone(true);
            }
        },
        
        _setCheckAll: function (value) {
            if (!this._isSingleSelect() && (value))
                this.checkAll();
            else this.model.checkAll = false;
        },
        _setUncheckAll: function (value) {
            if (!this._isSingleSelect() && (value))
                this.uncheckAll();
            else this.model.uncheckAll = false;
        },

        checkAll: function () {
            if(this.model.loadOnDemand && (ej.isNullOrUndefined(this.ultag) || this.ultag.children().length==0))this._showFullList();
            var _nodes = this._selectedIndices, isAlreadySelected = false;
            this._mapFields();
            this.listitems = this._getLi();
            if (!this._isWatermark)
                this._hiddenSpan.css("display", "none");
            if (!this._isSingleSelect()) {
                for (var i = 0; i < this.listitems.length; i++) {
                    this._currentText = this._isPlainType(this.popupListItems) ? this.popupListItems[i] : this._getField(this.popupListItems[i], this.mapFld._text);
                    this._hiddenValue = this._getAttributeValue(this.listitems[i]) || this._currentText;
                    if(!this._checkContains(this._hiddenValue))
                    if (this.model.showCheckbox) {
                        var checkboxWrap = $(this.listitems[i]).children(".e-checkwrap")[0];
                        if (checkboxWrap && !this._isChecked(checkboxWrap)) {
                            this._setClass(checkboxWrap, "e-check-act");
							this._setAttr(checkboxWrap,{"aria-checked":true});
                            checkboxWrap.firstChild.checked = true;
                            isAlreadySelected = false;
                        }
                        else isAlreadySelected = true;
                    }
                    else {
                        isAlreadySelected = false;
                        $(this.listitems[i]).addClass("e-active");
                    }
                    else isAlreadySelected = true;
                    
                    if (!isAlreadySelected) {
						this.checkedStatus = true;
                        this._itemID = $(this.listitems[i]).attr("id");
                        if (!ej.isNullOrUndefined(this._itemID) && this._itemID != "")
                            this._selectedItemsID.push(this._itemID);
                        this._createListHidden(this._hiddenValue);
                        if (this.model.multiSelectMode == "visualmode") {
                            this._ulBox.append(this._createBox(this._currentText,this._hiddenValue));
                            if (this._isPopupShown()) this._setListPosition();
                        }
                        this._addText(this._currentText);
                        if ($.inArray(i, _nodes) == -1) {
                            this._selectedIndices.push(i);
                            this.model.selectedItems = this.model.selectedIndices = this._selectedIndices;
                        }
                        this._selectedValue = this._getAttributeValue(this.listitems[i]) || "";
                        if (!this._initValue)
                            this._trigger('checkChange', { isChecked: this.checkedStatus, data: this.model });
                        var args = { text: this._visibleInput[0].value, selectedText: this._currentText, itemId: i, selectedValue: this._selectedValue, value: this._selectedValue, isChecked: this.checkedStatus };
                        this._updateValue(this.element.val());
                        this._updateText();
                        if (!this._initValue)
                            this._trigger("change", args);
                        this._activeItem = i;
                        this.activeItem = this._getActiveItem();
                        this._cascadeAction();
                    }
                }
                this.model.itemValue = this._selectedValue;
                this.model.uncheckAll = false;
                this.model.checkAll = true;
                this._activeItem = -1;
                this._setWatermark();
            }
        },
        _createListHidden: function (value) {
            var arrayHidden = document.createElement("input");
			var quote = /'/;
			if(quote.test(value))
			   value =value.replace(quote,"&apos;")
            this._setAttr(arrayHidden, { type: "hidden", name: this._name, value: value, id: "#" + value });
			if($.inArray(arrayHidden.value,this._hiddenInputElement) == -1){
				this._hiddenInputElement.push(arrayHidden.value);
				this.container.append(arrayHidden);
				$(this.element).attr("name", "hiddenEle");
			}
        },
        _removeListHidden: function (value) {
			var quote = /'/;
			if(quote.test(value))
			     value =value.replace(quote,"&apos;")
            var arrayEle = this.container.find("[id='#" + value + "']");
			this._hiddenInputElement.splice($.inArray(arrayEle.value,this._hiddenInputElement),1);
            $(arrayEle).remove();
			if (!this._isSingleSelect())this.element.attr("name", this._name);
        },
        _getAttributeValue: function (val) {
			var eleValue = ej.isNullOrUndefined(val.getAttribute("data-value"))? val.getAttribute("value") : val.getAttribute("data-value");
            return val ? eleValue : null;
        },
       
        _selectCheckedItem: function (chkitems) {
            if(this.model.loadOnDemand && (ej.isNullOrUndefined(this.ultag) || this.ultag.children().length==0))this._showFullList();
            for (var i = 0; i < chkitems.length; i++) {
                this._activeItem = chkitems[i];
                this._enterTextBoxValue();
            }
        },

        /* will deprecate with uncheckAll method */
        unCheckAll: function () { this.uncheckAll(); },

        uncheckAll: function () {
            var isAlreadySelected = false;
            this.listitems = this._getLi();
            this._mapFields();
            if (!this._isSingleSelect()) {
                for (var i = 0; i < this.listitems.length; i++) {
                    this._currentText = this._isPlainType(this.popupListItems) ? this.popupListItems[i] : this._getField(this.popupListItems[i], this.mapFld._text);
                    this._hiddenValue = this._getAttributeValue(this.listitems[i]) || this._currentText;
                    if(this._checkContains(this._hiddenValue))
                    if (this.model.showCheckbox) {
                        var checkboxWrap = $(this.listitems[i]).children(".e-checkwrap")[0];
                        if (checkboxWrap && this._isChecked(checkboxWrap)) {
                            this._removeClass(checkboxWrap, "e-check-act");
							this._setAttr(checkboxWrap,{"aria-checked":false});
                            checkboxWrap.firstChild.checked = false;
                            isAlreadySelected = true;
                        }
                        else isAlreadySelected = false;
                    }
                    else {
                        $(this.listitems[i]).removeClass("e-active");
                        isAlreadySelected = true;
                    }
                    else isAlreadySelected = false;
                    
                    if (isAlreadySelected) {
                        this.checkedStatus = false;
                        this._activeItem = i;
                        this.activeItem = this._getActiveItem();
                        this._removeText(this._hiddenValue);
                        this._removeListHidden(this._hiddenValue);
                        var _nodes = this._selectedIndices;
                        if ($.inArray(i, _nodes) > -1) {
                            this._selectedIndices.splice($.inArray(i, _nodes), 1);
                            this.model.selectedItems = this.model.selectedIndices = this._selectedIndices;
                        }
                        this._selectedValue = this._getAttributeValue(this.listitems[i]) || "";
                        this._itemID = $(this.listitems[i]).attr("id");
                        if (!ej.isNullOrUndefined(this._itemID) && this._itemID != "")
                            this._removeSelectedItemsID();
                        if (!this._initValue)
                            this._trigger('checkChange', { isChecked: this.checkedStatus, data: this.model });
                        var args = { text: this._visibleInput[0].value, selectedText: this._currentText, itemId: i, selectedValue: this._selectedValue, value: this._selectedValue, isChecked: this.checkedStatus };
                        this._updateValue(this.element.val());
                        this._updateText();
                        if (!this._initValue)
                            this._trigger("change", args);
                        this._cascadeAction();
                        if (this.model.multiSelectMode == "visualmode") {
                            this._deleteBoxCheck(this._hiddenValue);
                            if (this._isPopupShown())
                                this._setListPosition();
                        }
                    }
                    
                }
                this.model.itemValue = this._selectedValue;
                this.model.checkAll = false;
                this.model.uncheckAll = true;
                this._setWatermark();
                this._activeItem = -1;
            }

        },
        _removeSelectedItemsID: function () {
            var itemToRemove;
            itemToRemove = this._selectedItemsID.indexOf(this._itemID);
            this._selectedItemsID.splice(itemToRemove, 1);
            this._itemID = "";
        },


        _refreshScroller: function () {
            if (!this.model.enablePopupResize) { // to set popup height as per the no.of list items
                this.popupList.css("height", "auto");
                this.popupListWrapper.css("height", "auto");
            }
            this.popupList.find(".e-content, .e-vhandle").removeAttr("style");
            this.popupList.find(".e-vhandle div").removeAttr("style");
            this.popupList.children(".e-content").removeClass("e-content");
            var flag = this._isPopupShown();
            this.popupListWrapper.css("display", "block");
            this.popupList.css({ "display": "block" });  // For get the height of the popup
            this.scrollerObj.model.height = Math.ceil(this._getPopupHeight());
            this.scrollerObj.refresh();
            if (!this.model.enablePopupResize) { // to set popup height as per the no.of list items
                this.popupList.css("height", "auto");
                this.popupListWrapper.css("height", "auto");
            }
            this.scrollerObj.option("scrollTop", 0);
            if (!flag) this.popupListWrapper.css("display", "none");
        },
        _enablePopupResize: function () {
            if (this.model.enablePopupResize && !ej.isNullOrUndefined(this.popupListWrapper)) {
                this.popupListWrapper.addClass("e-resizable").append(ej.buildTag("div.e-resizebar").append(ej.buildTag("div.e-icon e-resize-handle")))
                .find(".e-resize-handle").addClass((this.model.enableRTL) ? "e-rtl-resize" : "");
                this._resizePopup();
            }
        },


        _resizePopup: function () {
            var proxy = this, started = false;
            this.popupListWrapper.find("div.e-resize-handle").ejResizable(
                {
                    minHeight: proxy._validatePixelData(proxy.model.minPopupHeight),
                    minWidth:  proxy._validatePixelData(proxy.model.minPopupWidth),
                    maxHeight: proxy._validatePixelData(proxy.model.maxPopupHeight),
                    maxWidth:  proxy._validatePixelData(proxy.model.maxPopupWidth),
                    handle: "e-ddl-popup",
                    resizeStart: function (event) {
                        if (!proxy.model.enabled)
                            return false;
                        !started && proxy._trigger("popupResizeStart", { event: event });
                        started = true;
                    },
                    resize: function (event) {
                        var reElement = $(event.element).parents("div.e-ddl-popup");
                        proxy._refreshPopupOnResize($(reElement).outerHeight(), $(reElement).outerWidth());
                        proxy._trigger("popupResize", { event: event });
                    },
                    resizeStop: function (event) {
                        if (started) {
                            proxy._refreshPopupOnResize(proxy.model.popupHeight, proxy.model.popupWidth);
                            started && proxy._trigger("popupResizeStop", { event: event });
                            started = false;
                        }
                    },
                    helper: function (event) {
                        var reElement = $(event.element).parents("div.e-ddl-popup");
                        proxy._refreshPopupOnResize($(reElement).outerHeight(), $(reElement).outerWidth());
                        return $(proxy.popupListWrapper);
                    }
                });
        },

        _refreshPopupOnResize: function (currHeight, currWidth) {
            if (currHeight) this.model.popupHeight = currHeight;
            if (currWidth) this.model.popupWidth = currWidth;
            this.popupListWrapper.css({ "height": this._validatePixelData(this.model.popupHeight), "min-height": this._validatePixelData(this.model.minPopupHeight), "max-height": this._validatePixelData(this.model.maxPopupHeight) });
            this._setListWidth();
            this._refreshScroller();
        },

        _setListWidth: function () {
            if(!ej.isNullOrUndefined(this.popupListWrapper)){
            var width = this.model.popupWidth;
            if (width != "auto") this.popupListWrapper.css({ "width": width });
            else this.popupListWrapper.css({ "min-width": this._validatePixelData(this.model.minPopupWidth) });
            this.popupListWrapper.css({ "max-width": this._validatePixelData(this.model.maxPopupWidth) });
            }
        },

        _setListHeight: function () {
            if(!ej.isNullOrUndefined(this.popupListWrapper)){
            if (this.model.enablePopupResize && this.model.enableFilterSearch && this.model.minPopupHeight && this.model.minPopupHeight.toString().indexOf("%") <0 && this._validatePixelData(this.model.minPopupHeight) == 20)
                this.model.minPopupHeight = '65'; /* adding default height of search box*/
            this.model.enablePopupResize ? this.popupListWrapper.css({ "min-height": this._validatePixelData(this.model.minPopupHeight), "max-height": this._validatePixelData(this.model.maxPopupHeight), "height": this._validatePixelData(this.model.popupHeight) }) :
            this.popupListWrapper.css({ "max-height": this._validatePixelData(this.model.popupHeight), "min-height": this._validatePixelData(this.model.minPopupHeight) });
            }
        },
		_validatePixelData: function (data) {			
			return (data && !isNaN(data))? Number(data):data;
		},
        _getPopupHeight: function () {
            var wrap = this.popupListWrapper.height();
            if (this.model.enablePopupResize) wrap -= this.popupListWrapper.find(">div.e-resizebar").height();
            if (this.model.headerTemplate && this.headerTemplate) wrap -= this.headerTemplate.height();
            if (this.model.enableFilterSearch && this.inputSearch) {
                var ele = this.inputSearch.parent(".e-in-wrap");
                wrap -= (parseInt(ele.css("height")) + parseInt(ele.css('margin-top')) + parseInt(ele.css('margin-bottom')));
            }
            return wrap;
        },

        _refreshPopup: function () {
            if (this.model.popupWidth == "auto" && !this._validatePixelData(this.model.minPopupWidth)) this.popupListWrapper.css({ "min-width": this.wrapper.width() });
			else if(this._validatePixelData(this.model.minPopupWidth))this.popupListWrapper.css({ "min-width": this._validatePixelData(this.model.minPopupWidth) });
            if(this.scrollerObj != undefined) this._refreshScroller();
            this._setListPosition();
        },

        _setListPosition: function () {
            var elementObj = this.wrapper, pos = this._getOffset(elementObj), winWidth,
            winBottomHeight = $(document).scrollTop() + $(window).height() - (pos.top + $(elementObj).outerHeight()),
            winTopHeight = pos.top - $(document).scrollTop(),
            popupHeight = this.popupListWrapper.outerHeight(),
            popupWidth = this.popupListWrapper.outerWidth(),
            left = pos.left,
            totalHeight = elementObj.outerHeight(),
            border = (totalHeight - elementObj.height()) / 2,
            maxZ = this._getZindexPartial(), popupmargin = 3,
            topPos = ((popupHeight < winBottomHeight || popupHeight > winTopHeight) ? pos.top + totalHeight + popupmargin : pos.top - popupHeight - popupmargin) - border;
            winWidth = $(document).scrollLeft() + $(window).width() - left;
            if (this.model.enableRTL || popupWidth > winWidth && (popupWidth < left + elementObj.outerWidth())) left -= this.popupListWrapper.outerWidth() - elementObj.outerWidth();
            this.popupListWrapper.css({
                "left": left + "px",
                "top": topPos + "px",
                "z-index": maxZ
            });

        },

        _getOffset: function (ele) {
            return ej.util.getOffset(ele);
        },

        _getZindexPartial: function () {
            return ej.util.getZindexPartial(this.element, this.popupListWrapper);
        },


        _showResult: function () {
            var proxy = this;
            this.popUpShow = true
            if(this.model.loadOnDemand){ 
            if(ej.isNullOrUndefined(this.popupListWrapper))this._renderPopupPanelWrapper();
            if(ej.isNullOrUndefined(this.ultag) || this.ultag.children().length==0){
            this._showFullList();
            }
            this._renderRemaining();
            }
            var args = { text: this._visibleInput[0].value, value: this._selectedValue, refreshPopup: true };
            if (this._trigger("beforePopupShown", args)) return;
            if (args.refreshPopup) this._refreshPopup();
            $(this.popupListWrapper).slideDown(this.model.enableAnimation ? 200 : 1, function () {
                $(document).on("mousedown", $.proxy(proxy._OnDocumentClick, proxy));
                if(!(ej.isDevice()))
                proxy._on(ej.getScrollableParents(proxy.wrapper), "scroll", proxy._hideResult);
            });
            this.element[0].setAttribute("aria-expanded", true);
            this._listSize =  this._getLi().length;
            this.wrapper.addClass("e-popactive");
            this._trigger("popupShown", { text: this._visibleInput[0].value, value: this._selectedValue });
            this.scrollerObj.setModel({ scrollTop: this._calcScrollTop('active') });
        },

        _OnWindowResize: function (e) {
            if (!ej.isNullOrUndefined(this.model) && this._isPopupShown()) {
                this._refreshPopup();
            }
        },
        _hideResult: function (e) {
            if (this.model && this._isPopupShown()) {
				if (!ej.isNullOrUndefined(e) && !ej.isNullOrUndefined(this.inputSearch) && $(this.inputSearch).is(":focus")){
					if(e.type == "scroll" && ej.isTouchDevice())
						return false;
				}
                var proxy = this;
                if (this._trigger("beforePopupHide", { text: this._visibleInput[0].value, value: this._selectedValue })) return;
                $(this.popupListWrapper).slideUp(this.model.enableAnimation ? 100 : 0, function () {
                    $(document).off("mousedown", $.proxy(proxy._OnDocumentClick, proxy));
                });
                if (this.element != null)
                    this.element.attr( "aria-expanded", false );
				if(!(ej.isDevice()))
                this._off(ej.getScrollableParents(this.wrapper), "scroll", this._hideResult);
                if (this._visibleInput != null)
                this.wrapper.removeClass("e-popactive");
               this.popUpShow= false;
                    this._trigger("popupHide", { text: this._visibleInput[0].value, value: this._selectedValue });

                setTimeout(function () {
                    proxy._resetSearch();                 
                }, 100);
				this._getLi().find(".e-ddl-anim").removeClass("e-ddl-anim");
            }
        },

        _isPopupShown: function () { 
            if(!ej.isNullOrUndefined(this.popupListWrapper)) return (this.popupListWrapper.css("display") == "block");
        },

        _enterTextBoxValue: function () {
            var args, valueModified = true;
            this.removeID = false;
			this.checkedStatus = false;
            if (!this._isWatermark)
                this._hiddenSpan.css("display", "none");
            this._chooseSelectionType();
			if (this._activeItem >=0 || this._activeItem != null) {
				if (this.model.showCheckbox) {
					var checkboxEle = this.activeItem.find('.e-checkwrap')[0];
					$(checkboxEle).removeClass('e-check-inact');
					this.checkedStatus = this._isChecked(checkboxEle);                   
				}
				else{
					this.checkedStatus = this.activeItem.hasClass('e-active')
				}            
			}
            args = { text: this._currentText, selectedText: this._currentText, itemId: this.selectedIndexValue, value: this._selectedValue, isChecked: this.checkedStatus, isInteraction: !!this._uiInteract };
            if (!this._initValue && !this._onSearch && this._raiseEvents){ 
                if(this._trigger("select", args)) {
                    this._setWatermark();
                    return;
                }
            }
            if (this._activeItem >=0 || this._activeItem != null) {
                if (!this._isSingleSelect() && !this._checkContains(this._selectedValue)) {                   
                    if (this.model.showCheckbox) {
                        var checkboxEle = this.activeItem.find('.e-checkwrap')[0];
                        if (!this._isChecked(checkboxEle)) {
							this._removeClass(checkboxEle, "e-ddl-anim");	
                            this._setClass(checkboxEle, "e-check-act e-ddl-anim");
                            this._setAttr(checkboxEle,{"aria-checked":true});
                            $(checkboxEle).find(".e-check-input")[0].checked = true;
                        }
                    }
                    else {
                        this.activeItem.addClass('e-active');
                    }
                    if (this.model.multiSelectMode == "visualmode") {
                        this._ulBox.append(this._createBox(this._currentText, this._selectedValue));
                        if (this._isPopupShown())
                            this._setListPosition();
                    }

                    this._maintainHiddenValue();
                    this._addText(this._currentText);
                    this._createListHidden(this._hiddenValue);
                    if ($.inArray(this.selectedIndexValue, this._selectedIndices) == -1) {
                        this._selectedIndices.push(this.selectedIndexValue);
                        this.model.selectedItems = this.model.selectedIndices = this._selectedIndices;
                    }                
                } else if( this._isSingleSelect()){
                    this.ultag.children("li").removeClass('e-hover').removeClass('e-active');
                    this.activeItem.addClass('e-active');                    
                    this._maintainHiddenValue();
                    this._visibleInput.val(this._currentText);
                    this.element.val(this._hiddenValue);
                    this.selectedItemIndex(this.selectedIndexValue);
                    this.selectedIndex(this.selectedIndexValue);
                    this._selectedIndices[0] = this.selectedIndexValue;
                }
                else valueModified = false;
                if(valueModified) {
					this.checkedStatus = true;
                    this._onValueChange();
                    this._cascadeAction();
                    if (this.selectelement) {
                    if ($("#" + this._id).children().length > this.selectedIndexValue)
                        $("#" + this._id).children()[this.selectedIndexValue].selected = true;
                    }
                }
            }
            this.model.uncheckAll = false;
            this._setWatermark();
			this._uiInteract = false;
        },
        _onValueChange: function () {
            this.model.itemValue = this._selectedValue;
            this._updateText();
            if ((this.value() != this.element.val()) || (this.value() == null && ($.inArray("", this._valueContainer) != -1))) {
                this._updateSelectedIndexByValue(this.element.val());
                this._updateValue(this.element.val());
				if (!this.model.showCheckbox && this.model.multiSelectMode == "none" && (this.model.value == null || this.model.value == "")){
					this.model.itemValue = "";
				}
               var args = { text: this._visibleInput[0].value, selectedText: this._currentText, itemId: this.selectedIndexValue, selectedValue: this._selectedValue, value: this._selectedValue, isChecked: this.checkedStatus, isInteraction: !!this._uiInteract };

                if (!this._initValue && !this._onSearch && this._raiseEvents) {
					if(typeof this.model._change == "function") this._trigger("_change", { isChecked: this.checkedStatus, text: this._visibleInput.val(), itemId: this.selectedIndexValue, selectedText: this._currentText, selectedValue: this._selectedValue, value: this.value(), data: this.model, isInteraction: !!this._uiInteract  });
                    this._trigger("change", args);
                    if (this.model.showCheckbox)
                        this._trigger('checkChange', { isChecked: this.checkedStatus, text: this._visibleInput.val(), itemId: this.selectedIndexValue, selectedText: this._currentText, selectedValue: this._selectedValue, value: this._selectedValue, data: this.model });
                }
                this._uiInteract = false;
                if(this.model.enableFilterSearch && this.model.enableServerFiltering){
				this._searchresult = [];
                this._searchresult = this.getItemDataByValue(this.value());
                }
                
            }
        },
        _decode: function (val) {
            return $("<span>").html(val).text();
        },
        _chooseSelectionType: function () {
            this.activeItem = this._getActiveItem();
            this.selectedIndexValue = this._activeItem;
            this._mapFields();
            if (this._dataSource() != null && (!this._isPlainType(this._dataSource()) || !this._isPlainType(this.popupListItems))) {
                this._currentText = this._decode(this._getField(this.popupListItems[this._activeItem], this.mapFld._text));
                this._currentText = (this._currentText === "" || this._currentText == null) ? this.activeItem.text() : this._currentText;
                this._selectedValue = this._getField(this.popupListItems[this._activeItem], this.mapFld._value);
                this._selectedValue = (this._selectedValue != null) ? this._selectedValue : this._currentText;
                this._itemID = this._getField(this.popupListItems[this._activeItem], this.mapFld._id);
            } else {
                this._currentText = this.activeItem.text();
                if (this._getAttributeValue(this.activeItem[0]))
                    this._selectedValue = this._getAttributeValue(this.activeItem[0]);
                else {
                    if (this._currentText != null) {
                        if(!ej.isNullOrUndefined(this.activeItem[0]))this.activeItem[0].setAttribute("value", this._currentText);
                        this._selectedValue = this._currentText;
                    }
                    else
                        this._selectedValue = "";
                }
                this._itemID = $(this.activeItem).attr("id");
            }
            if (!ej.isNullOrUndefined(this._itemID) && this._itemID != "") {
                if (!this.model.showCheckbox) {
                    this._selectedItemsID = [];
                    !this.removeID && this._selectedItemsID.push(this._itemID);
                }
                else
                    !this.removeID ? this._selectedItemsID.push(this._itemID) : this._removeSelectedItemsID();
            }
            this.selectedTextValue = this._currentText;
        },
        _maintainHiddenValue: function () {
			var val = this._getAttributeValue(this.activeItem[0]);
            this._hiddenValue = !ej.isNullOrUndefined(val)? val : this._currentText;
        },
        _removeTextBoxValue: function (delvalue) {
            this._uiInteract = true;
            this.removeID = true;
			this.checkedStatus = true;
			if(this._isFilterInput()){
				for (var j = 0; j < this._getLi().length; j++) {
					if ($(this._getLi()[j]).attr("data-value") == delvalue) {
						this._activeItem = j;
					}
				}
			}
            this._chooseSelectionType();
			if (this._activeItem >=0 || this._activeItem != null) {
				if (this.model.showCheckbox) {
					var checkboxEle = this.activeItem.find('.e-checkwrap')[0];
					$(checkboxEle).removeClass('e-ddl-anim').addClass('e-check-inact e-ddl-anim');
					this.checkedStatus = this._isChecked(checkboxEle);                   
				}
				else{
					this.checkedStatus = this.activeItem.hasClass('e-active')
				}            
			}			
            var args = { text: this._currentText, selectedText: this._currentText, itemId: this.selectedIndexValue, value: this._selectedValue, isChecked: this.checkedStatus };
            if (!this._initValue && !this._onSearch && this._raiseEvents){
                if(this._trigger("select", args)){
                    this._setWatermark();
                    return;
                }
            }                
            this._maintainHiddenValue();
			this._hiddenValue = this._isFilterInput() && !ej.isNullOrUndefined(delvalue) ? delvalue : this._hiddenValue;
            this._removeText(this._hiddenValue);
            this._removeListHidden(this._hiddenValue);
			if(this._isFilterInput() && !this.activeItem.attr("data-value") == delvalue)
				this.activeItem.removeClass('e-active');
            if (!this._isSingleSelect()) {
                if (this.model.showCheckbox) {
                    var checkboxEle = this.activeItem.find('.e-checkwrap')[0];
                    if (this._isChecked(checkboxEle)) {
                        this._removeClass(checkboxEle, "e-check-act");
						this._setAttr(checkboxEle,{"aria-checked":false});
                        $(checkboxEle).find(".e-check-input")[0].checked = true;
                    }
                }
                else this.activeItem.removeClass('e-active');

                if ($.inArray(this.selectedIndexValue, this._selectedIndices) > -1) {
                    this._selectedIndices.splice($.inArray(this.selectedIndexValue, this._selectedIndices), 1);
                    this.model.selectedItems = this.model.selectedIndices = this._selectedIndices;
                }
                if (this.model.multiSelectMode == "visualmode") {
                    this._deleteBoxCheck(this._hiddenValue);
                    if (this._isPopupShown())
                        this._setListPosition();
                }
            }
			this.checkedStatus = false;            
            this._onValueChange();
            if ((this.model.cascadeTo != null) && !this._isSingleSelect() && !this._initValue ) this._cascadeAction();
            this.model.checkAll = false;
            this._setWatermark();
        },


        _createBox: function (text, value) {
            if (!this._checkContains(value)) {

                if (this._ulBox.css('display') == "none" && this._visibleInput.css('display') != "none") this._swapUlandInput(true);
                var span = ej.buildTag("span.e-icon e-close", "", {}, { "unselectable": "on" });
                var li = ej.buildTag("li.e-options").text(text).attr("data-value",value).append(span);
                this._on(span, "click", function (e) {
                    if (!this.model.enabled) return false;
                    this._deleteBox($(e.target).parent());                   
                });
                return li;
            }
        },
        _deleteBoxCheck: function (val) {
            var items = this._ulBox.children('li');
            for (var i = 0; i < items.length; i++) {
                if ($(items[i]).attr("data-value") == val) {
                    $(items[i]).remove();
                }
            }
        },
        _deleteLastBox: function () {
            var items = this._ulBox.children("li:not(.e-search-box)");
            var item = items.last();
            if (item.hasClass("e-active")) this._deleteBox(item);
            else {
                this._removeActive();
                item.addClass("e-active");
            }
        },
        _deleteBox: function (items) {
            for (var i = 0; i < items.length; i++) {              
                var deltext = $(items[i]).attr("data-value");
                if(this._isFilterInput()){ 
                    var datalist = this.getListData();
                    for (var j = 0; j < datalist.length; j++) {
                        var val = this._getField(datalist[j], this.mapFld._value) ? this._getField(datalist[j], this.mapFld._value): this._getField(datalist[j], this.mapFld._text);
                        if (val == deltext) {
                            this._removeTextBoxValue(deltext);
                            break;
                        }
                    }
				}else{
					var listItems = this._getLi();
					for (var j = 0; j < listItems.length; j++) {
						if ($(listItems[j]).attr("data-value") == deltext) {
							this._activeItem = j;
							this._removeTextBoxValue();
							break;
						}
					}
				}
            }
            if (!this._isFocused && !this._isPopupShown())
                this._setWatermark();
        },
        _isFilterInput: function(){
            if(this.model.enableFilterSearch){
                if(!this.inputSearch.val() == ""){
                       return true; 
                }
            }else{
                return false;
            }
        },
        _swapUlandInput: function (inputHide) {
            if (inputHide) {
                this._visibleInput.css('display', 'none');
                this._ulBox.css('display', 'block');
                this.wrapper.css({ 'height': 'auto' });
            }
            else {
                this._visibleInput.css('display', 'block');
                this._ulBox.css('display', 'none');
                this.wrapper.css({ 'height': this.model.height });
            }
        },
        _removeActive: function () {
            this._ulBox.children("li").removeClass("e-active");
        },
        _adjustWidth: function () {
            var tempSpan = ej.buildTag("span", this._visibleInput.val());
            this.container.append(tempSpan);
            this._visibleInput.width(tempSpan.width() + 30);
            tempSpan.remove();
        },
        _destroyBoxModel: function () {
            this._visibleInput.css('display', 'block');
            this.wrapper.height(this.model.height);
            this._ulBox.remove();
			this._ulBox = null;
            this._off(this.container, "click");
        },

        _removeListHover: function () {
            this.ultag.children("li").removeClass("e-hover");
        },

        _addListHover: function () {
            var activeItem = this._getActiveItem();
            activeItem.addClass("e-hover");
            this.scrollerObj.setModel({ "scrollTop": this._calcScrollTop('hover') });
            activeItem.focus();
        },
        _getLi: function () {
            return this.ultag.children("li:not('.e-category'):not('.e-nosuggestion')");
        },
        _calcScrollTop: function (val) {
            var ulH = this.ultag.outerHeight(), li = this.ultag.find("li"), liH = 0, index, top, i;
            if (this._selectedIndices && this._selectedIndices.length > 0 && val == "active") {
                var getLi = this._getLi();
                index = this._selectedIndices.length == getLi.length ? 0
                : this._selectedIndices[this._selectedIndices.length - 1];
                if (this.model.fields.groupBy != null || this.ultag.find("li.e-category").length > 0) {
                    index = $.inArray(getLi.eq(index)[0], li);
                }
            }
            else index = this.ultag.find("li.e-" + val).index();

            for (i = 0; i < index; i++) { liH += li.eq(i).outerHeight(true); }
            top = liH - ((this.popupList.outerHeight() - li.eq(index).outerHeight(true)) / 2);
            return top < 0 ? 0 : top;
        },
        _getActiveItem: function () {
            return this._getLi().eq(this._activeItem);
        },
        _setDimentions: function () {
            if (this.model.height)
                this.wrapper.height(this.model.height);
            if (this.model.width)
                this.wrapper.width(this.model.width);
        },


        _roundedCorner: function (val) {
            if (val) {
                this.container.addClass("e-corner");
                if(!ej.isNullOrUndefined(this.popupListWrapper)) this.popupListWrapper.addClass("e-corner");
                if (this.inputSearch) this.inputSearch.parent('.e-in-wrap').addClass("e-corner");
            }
            else {
                this.container.removeClass("e-corner");
                if(!ej.isNullOrUndefined(this.popupListWrapper)) this.popupListWrapper.removeClass("e-corner");
                if (this.inputSearch) this.inputSearch.parent('.e-in-wrap').removeClass("e-corner");
            }

        },

        _enabled: function (boolean) {
            if (boolean) this.enable();
            else this.disable();
        },

        _RightToLeft: function () {
            if (this.model.enableRTL) {
                this.wrapper.addClass("e-rtl");
            }
            else {
                this.wrapper.removeClass("e-rtl");
            }

        },
        _dropbtnRTL: function () {
            if (this.model.enableRTL) {
                this.popupListWrapper.addClass("e-rtl").find(".e-resize-handle").addClass("e-rtl-resize");
                this.popupList.addClass("e-rtl");
            }
            else {
                this.popupListWrapper.removeClass("e-rtl").find(".e-resize-handle").removeClass("e-rtl-resize");
                this.popupList.removeClass("e-rtl");
            }
        },
        _OnDropdownClick: function (e) {
            this._preventDefaultAction(e);
            if (($(e.target).is("li") && $(e.target).parent().hasClass("e-boxes")) || ($(e.target).parents("ul").hasClass("e-boxes") && $(e.target).hasClass("e-icon e-close")))
                return false;
            if (this.model.readOnly || this._readOnly) return false;
            var popuphideshow = !ej.isNullOrUndefined(this.ultag) ? this.ultag.find('li').length > 0 : (this.model.loadOnDemand) ? true: false;
            if (popuphideshow && ((e.which && e.which == 1 ) ||(e.button && e.button == 0) )) {
                this._OnPopupHideShow();
            }
        },
        _OnPopupHideShow: function () {
            if (this._isPopupShown()) {
                this._hideResult();
            }
            else {
				this._showResult();
				if (this.model.enableFilterSearch){
					if(this.getSelectedItem().length == 0)
						this.ultag.find("li:first").addClass("e-hover");
					else{
						var length = this.getSelectedItem().length;
						$(this.getSelectedItem()[length -1]).addClass("e-hover");
					}
                    $(this.inputSearch).focus();
				}
				else
					this.wrapper.focus();
            }
        },

        _showFullList: function () {
            var source = this._dataSource();
            if(ej.isNullOrUndefined(this.ultag)) this.ultag = ej.buildTag("ul.e-ul", "", {}, { "role": "listbox" });
            if (ej.DataManager && source instanceof ej.DataManager) {
                if (!source.dataSource.offline && !(source.dataSource.json && source.dataSource.json.length > 0)) {
                    var proxy = this;
                    proxy._initDataSource(source);
                }
                else this._getFilteredList(source.dataSource.json);
            }
            else this._getFilteredList(source);
        },
        _getFilteredList: function (list) {
            if (!list || !list.length || list.length < 1) {
                this._targetElementBinding();
                this._renderRemaining();
            }
            else {
                var listItem = ej.DataManager(list).executeLocal(this._isPlainType(list) ? ej.Query() : this._getQuery(true));
                this._totalCount = listItem.count;
                this._listItem(listItem.result ? listItem.result : listItem);
                this._renderPopupList();
                this._rawList =  this.popupListItems.slice();
            }
        },

        _cascadeAction: function () {
            if (this.model.cascadeTo) {
                var citem = this.model.cascadeTo.split(","), i;
                for (i = 0; i < citem.length; i++) {
                    if ($('#' + citem[i]).hasClass("e-dropdownlist")) {
                        this._doCascadeAction(citem[i], this, this.checkedStatus);
                    }
                    else {
                        $('#' + citem[i]).on("ejDropDownListcreate", { Obj: this, status: this.checkedStatus }, function (e) {
                            if (!ej.isNullOrUndefined(e.data.Obj.getValue()) && e.data.Obj.getValue() != "") {
                                e.data.Obj._doCascadeAction(this.id, e.data.Obj, e.data.status);
                            }
                        });
                    }
                }
            }
        },
        _doCascadeAction: function (id, parentObj, status) {
            parentObj._currentValue = parentObj._getField(parentObj.popupListItems[parentObj._activeItem], parentObj.mapFld._value);
            parentObj.selectDropObj = $('#' + id).ejDropDownList('instance');
            var args = { cascadeModel: parentObj.selectDropObj.model, cascadeValue: parentObj._currentValue, setCascadeModel:{}, requiresDefaultFilter: true };
            this._trigger("cascade", args);
            parentObj.selectDropObj._setCascadeModel = args.setCascadeModel;
            if (ej.isNullOrUndefined(parentObj[id])) {
                parentObj[id] = parentObj.selectDropObj._dataSource();
            }
            (ej.DataManager && parentObj[id] instanceof ej.DataManager) ?
                parentObj._cascadeOdataInit(parentObj[id], args.requiresDefaultFilter, status, args.cascadeQuery) :
            parentObj._cascadeJsonInit(parentObj.selectDropObj, parentObj[id], parentObj.mapFld._value, args.requiresDefaultFilter, status, args.cascadeQuery);
        },
        _cascadeOdataInit: function (_dSource, requiresFilter, status, cascadeQuery) {
            var proxy = this, queryPromise, tempQuery;
            proxy._dQuery = this.selectDropObj._getQuery().clone();
            tempQuery = proxy._dQuery.clone();
            requiresFilter ? tempQuery.where(proxy.mapFld._value, "equal", proxy._currentValue) : tempQuery = cascadeQuery;
            proxy.selectDropObj._addLoadingClass();
            if (!proxy._trigger("actionBegin", { requestFrom: "cascade" })) {
                queryPromise = _dSource.executeQuery(tempQuery);
                queryPromise.fail(function (e) {
                    proxy._changedSource = null;
                    proxy.selectDropObj.setModel({ dataSource: proxy._changedSource, enabled: false });
                    proxy._trigger("actionFailure", { e: e, requestFrom: "cascade" });
                }).done(function (e) {
                    proxy._trigger("actionSuccess", { e: e, requestFrom: "cascade" });
                    proxy._cascadeDataBind(proxy.selectDropObj, e.result, status);
                    proxy.selectDropObj._removeLoadingClass();
                }).always(function (e) {
                    proxy._trigger("actionComplete", { e: e, requestFrom: "cascade" });
                });
            }
        },

        _cascadeJsonInit: function (cascadeDropDownObj, _dSource, mapFld, requiresFilter, status, cascadeQuery) {           
            var tempQuery = requiresFilter ? ej.Query().where(mapFld, "==", this._currentValue) : cascadeQuery
            var changedSource = ej.DataManager(_dSource).executeLocal(tempQuery);
            this._cascadeDataBind(cascadeDropDownObj, changedSource, status);
        },

        _cascadeDataBind: function (cascadeDropDownObj, changedSource, status) {
			var cascadeVal  = cascadeDropDownObj.value();
            if ((this.model.showCheckbox && status) || (this.model.multiSelectMode != "none" && this.activeItem.hasClass("e-active"))) {
                this._changedSource = (!ej.isNullOrUndefined(this._changedSource)) ? this._changedSource.concat(changedSource) : changedSource;
            }
            else if (!this.model.showCheckbox && this.model.multiSelectMode == "none") this._changedSource = changedSource;
            else {
                for (var i = 0; i < changedSource.length; i++) {
                    if (this._isPlainType(changedSource) && this._isPlainType(this._changedSource)) this._changedSource.splice(this._changedSource.indexOf(changedSource[i]), 1);
                    else {
                        for (var j = 0; j < this._changedSource.length; j++) {
                            if (JSON.stringify(this._changedSource[j]) == JSON.stringify(changedSource[i]))
                                this._changedSource.splice(j, 1);
                        }

                    }
                }
                cascadeDropDownObj.setModel({ dataSource: null });
            }
			var cascadeValFn = cascadeDropDownObj.model.value;
            var cascadeModel = JSON.parse(JSON.stringify(cascadeDropDownObj.model)),enable;
            cascadeDropDownObj.setModel({ dataSource: this._changedSource, enabled: this._changedSource.length > 0 });
			if( !this._isSingleSelect() ) cascadeDropDownObj.selectItemByValue(cascadeVal);
            if (cascadeDropDownObj.model.showCheckbox || cascadeDropDownObj.model.multiSelectMode != "none") {
                $("input:hidden[id^='#'][name=" + cascadeDropDownObj._id + "]").remove();
            }
            
            if (!cascadeDropDownObj._setSelectedItem) {
                var selectProp = ["value", "text", "selectedIndex", "selectedIndices"];
                for (var m = 0; m < selectProp.length ; m++)
                    cascadeDropDownObj.model[selectProp[m]] = cascadeModel[selectProp[m]];
				cascadeDropDownObj.model["value"] = cascadeValFn;
                cascadeDropDownObj._finalize();                
            }            
            else {                                               
               cascadeDropDownObj.setModel(cascadeDropDownObj._setCascadeModel);
            }
            cascadeDropDownObj._setSelectedItem = true;
        },        

        _OnMouseEnter: function (e) {
            if (!this.model.enabled || this.model.readOnly || this._readOnly) return false;
            var targetEle;
            this.ultag.children("li").removeClass("e-hover");
            if ($(e.target).is("li:not('.e-category')")) { $(e.target).addClass("e-hover"); }
            if ($(e.target).hasClass("e-disable"))
                $(e.target).removeClass('e-hover');
            else if (e.target.tagName != "li") {
                targetEle = $(e.target).parents("li:not('.e-category')");
                $(targetEle).addClass("e-hover");
            }
            var activeItem;
            this.ultag.children("li:not('.e-category')").each(function (index) {
                if ($(this).hasClass("e-hover")) {
                    activeItem = index;
                    return false;
                }
            });
            this._activeItem = activeItem;
        },
        _OnMouseLeave: function (e) {
            if (!this.model.enabled || this.model.readOnly || this._readOnly) return false;
            this.ultag.children("li").removeClass("e-hover");
        },
        _OnMouseClick: function (e) {
            this._uiInteract = true;
            if (!this.model.enabled || this.model.readOnly || this._readOnly) return false;
            if (this.model.enableFilterSearch && $(e.target).is("li") && $(e.target).hasClass('e-nosuggestion')) return false;
            else if (($(e.target).is("li") && !$(e.target).hasClass('e-disable')) || (!$(e.target).is("li") && !$(e.target).closest("li").hasClass('e-disable'))) {
                if (this._isSingleSelect()) {
                    this._enterTextBoxValue();
                    this._hideResult();
                } else {
                    if (this.model.showCheckbox) {
                        var liEle = e.target.nodeName === "LI" ? e.target : $(e.target).parents("li.e-hover"),
                        checkboxEle = $(liEle).find('.e-checkwrap')[0];
                        this._onCheckChange({ target: checkboxEle });
                    }
                    else {
                        var ele = $(e.target).is("li") ? e.target : $(e.target).closest("li")[0];
                        this._activeItem = $.inArray(ele, this._getLi());
                        if ($(ele).hasClass("e-active")) this._removeTextBoxValue();
                        else this._enterTextBoxValue();
                    }
                   
                }
            }
        },        

        _OnDocumentClick: function (e) {
            if (this.model && (!this.model.enabled || this.model.readOnly || this._readOnly)) return false;
            if (!$(e.target).is(this.popupList) && !$(e.target).parents(".e-ddl-popup").is(this.popupListWrapper) &&
                !$(e.target).is(this._visibleInput) && !$(e.target).parents(".e-ddl").is(this.wrapper)) {
                this._hideResult();
            }
            else if ($(e.target).is(this.inputSearch)) {
                this.inputSearch.focus();
            }
            else if ($(e.target).is(this.popupList) || $(e.target).parents(".e-ddl-popup").is(this.popupListWrapper))
                this._preventDefaultAction(e);
        },

        _OnKeyPress: function (e) {
            if (this.model.enableIncrementalSearch && e.keyCode != 13) {
                this._OnTextEnter((ej.browserInfo().name == "mozilla") ? e.charCode : e.keyCode);
            }
            if (e.keyCode == 32) this._preventDefaultAction(e);
        },
        _OnTextEnter: function (from) {
            var proxy = this;
            this._incqueryString += String.fromCharCode(from);
            if (this._incqueryString.length > 0) {
                setTimeout(function () { proxy._incqueryString = ""; }, 1000);
            }
            var list = this._getLi(), i,
            caseSence = this.model.caseSensitiveSearch,            
            str, queryStr = this._incqueryString,
            querylength = this._incqueryString.length, searchflag = false;

            if (!caseSence) queryStr = queryStr.toLowerCase();

            for (i = 0; i < list.length; i++) {
                str = $(list[i]).text();
                str = caseSence ? str : str.toLowerCase();
                if (str.substr(0, querylength) == queryStr) {
                    this._activeItem = i;
                    if (this._isSingleSelect()){
						this._enterTextBoxValue();
						this.scrollerObj.setModel({ scrollTop: this._calcScrollTop('active') });
					}
                    else if (this._isPopupShown()) {
                        this._removeListHover();                      
                        this._addListHover();
                    } 
                    searchflag = true;
                }                 
                if (searchflag) break;
            }

        },

        _selectItem: function (current) {
            if (!this._isSingle) this._clearTextboxValue();
            this._activeItem = current;
            this._addListHover();
            this._enterTextBoxValue();
        },
        _focusItem: function (current) {
            this._removeListHover();
            this._activeItem = current;
            this._addListHover();
        },
        _selectFocusedItem: function (current) {
            this._focusItem(current);
            this._enterTextBoxValue();
        },
        
        _selectShiftDown: function (start, stop, isCtrl) {
            if (!isCtrl) this._clearTextboxValue();
            for (var n = start; n <= stop; n++) {
                if ($.inArray(n, this._disabledItems) < 0 && $.inArray(n, this.model.selectedIndices) < 0) {
                    this._selectFocusedItem(n);
                }
            }
        },
        _selectShiftUp: function (start, stop, isCtrl) {
            if (!isCtrl) this._clearTextboxValue();
            for (var n = stop; n >= start ; n--) {
                if ($.inArray(n, this._disabledItems) < 0 && $.inArray(n, this.model.selectedIndices) < 0) {
                    this._selectFocusedItem(n);
                }
            }
        },
        _selectShiftHome: function (current, stop, isCtrl) {
            if (!isCtrl) this._clearTextboxValue();
            if (current >= 0 && current <= this._listSize - 1) {
                if (current == 0) this._clearTextboxValue();
                else {
                    for (var n = current; n >= stop ; n--) {
                        if ($.inArray(n, this._disabledItems) < 0 && $.inArray(n, this.model.selectedIndices) < 0) {
                            this._activeItem = n;
                            this._enterTextBoxValue();
                        }
                    }
                }
                this._activeItem = current;
                if (current == 0) this._enterTextBoxValue();
                this.scrollerObj.setModel({ "scrollTop": 0 });
            }
        },
        _selectShiftEnd: function (current, stop, isCtrl) {
            if (!isCtrl) this._clearTextboxValue();
            if (current <= this._listSize - 1) {
                if (current == stop) this._clearTextboxValue();
                else 
                for (var n = current; n <= stop; n++) {
                    if ($.inArray(n, this._disabledItems) < 0 && $.inArray(n, this.model.selectedIndices) < 0) {
                        this._activeItem = n;
                        this._enterTextBoxValue();
                    }
                }
                this._activeItem = current;
                if (current == stop) this._enterTextBoxValue();
                this.scrollerObj.setModel({ "scrollTop": this.ultag.outerHeight() });
            }
        },


        _getLastFocusedLi: function () {
            return this._selectedIndices && this._selectedIndices.length > 0 ? this._selectedIndices[this._selectedIndices.length - 1] : null;
        },

        _getLastShiftFocusedLi: function (index, isDown) {
            var step = isDown ? index - 1 : index + 1;
            if ($.inArray(step, this._selectedIndices) < 0) {
                return index;
            }
            else {
                return this._getLastShiftFocusedLi(step, isDown);
            }
        },

        _shiftUp: function (current, step, isCtrl) {
            if (current == null || current < 0) {
                this._checkDisableStep(0, step, false, false, true);
            }
            else if (current > 0 && current <= this._listSize - 1) {

                var select = this._disableItemSelectUp(current - step)
                if (select != null) {
                    if (this._getLastFocusedLi() != null) {
                        if (this._selectedIndices.length > 1 && current - 1 == this._selectedIndices[this._selectedIndices.length - 2])
                            for (var s = 1; s <= step; s++) {
                                if (current - s == this._selectedIndices[this._selectedIndices.length - 2]) {
                                    this._activeItem = current + 1 -s;
                                    this._removeTextBoxValue();
                                    this._focusItem(current - s);
                                }
                                else break;
                            }
                        else {
                            var next = this._getLastShiftFocusedLi(this._getLastFocusedLi(), false);
                            this._selectShiftUp(select, next, isCtrl);
                        }
                    }
                    else {
                        this._moveUp(current, step, false);
                    }

                }

            }
        },

        _shiftDown: function (current, step, isCtrl) {
            if (current == null || current < 0) {
                this._checkDisableStep(-1, step, true, false, true);
            }
            else if (current < this._listSize - 1) {
                var select = this._disableItemSelectDown(current + step)
                if (select != null) {
                    if (this._getLastFocusedLi() != null) {
                        if (this._selectedIndices.length > 1 && current + 1 == this._selectedIndices[this._selectedIndices.length - 2]) {
                           for (var s = 1; s <= step; s++) {
                                if (current + s == this._selectedIndices[this._selectedIndices.length - 2]) {
                                    this._activeItem = current - 1 +s;
                                    this._removeTextBoxValue();
                                    this._focusItem(current + s);
                                }
                                else break;
                            }
                        }
                        else {
                            var start = this._getLastShiftFocusedLi(this._getLastFocusedLi(), true);
                            this._selectShiftDown(start, select, isCtrl);
                        }
                    }
                    else {
                        this._moveDown(current, step, false);
                    }
                }

            }
        },
        _moveUp: function (current, step, isMulti) {
            if (current == null || current <= 0) {
                this._checkDisableStep(0, step, false, isMulti);
            }
            else if (current > this._listSize - 1) {
                this._checkDisableStep(this._listSize - 1, step, false, isMulti);
            }
            else if (current > 0 && current <= this._listSize - 1) {
                this._checkDisableStep(current, step, false, isMulti);
            }
        },
        _moveDown: function (current, step, isMulti) {
            if (current == null || current < 0) {
                this._checkDisableStep(-1, step, true, isMulti);
            }
            else if (current == 0) {
                this._checkDisableStep(0, step, true, isMulti);
            }
            else if (current >= this._listSize - 1) {
                this._checkDisableStep(this._listSize - 1, step, true, isMulti);
            }
            else if (current < this._listSize - 1) {
                this._checkDisableStep(current, step, true, isMulti);
            }
        },
        _checkDisableStep: function (current, step, isdown, isMulti, shift) {
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
            if (select != null) {
                isMulti ? this._focusItem(select) : this._selectItem(select);
                if (shift && isMulti) this._enterTextBoxValue();
            }

        },
        _disableItemSelectDown: function (current) {
            if (current == null || current < 0) current = 0;
            if (current < this._listSize) {
                if ($.inArray(current, this._disabledItems) < 0) {
                    return current;
                }
                else {
                    return this._disableItemSelectDown(current + 1);
                }
            }
            else return this._listSize - 1;
        },

        _disableItemSelectUp: function (current) {
            if (current == null || current < 0) current = 0;
            if (current < this._listSize) {
                if ($.inArray(current, this._disabledItems) < 0) {
                    return current;
                }
                else {
                    if (current > 0) {
                        return this._disableItemSelectUp(current - 1);
                    }
                }
            }
        },

        _preventDefaultAction: function (e, stopBubble) {
            e.preventDefault ? e.preventDefault() : (e.returnValue = false);
            if (stopBubble) {
                e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true);
            }
        },

        _OnKeyDown: function (e) {
            this._uiInteract = true;
            if (this.model.enabled) {
                this._itemId = null;
                var _popupListItems = this._getLi(), liH, popupH, activeitem, flag;
                this._listSize = _popupListItems.length;                
                popupH = this.popupList.height();
                liH = this.ultag.children("li").outerHeight();
                activeitem = Math.round(popupH / liH) != 0 ? Math.round(popupH / liH) : 5;
                this._isSingle = this._isSingleSelect();
                if (this._isSingle) {
                    switch (e.keyCode) {
                        case 38: /* up arrow*/
                            if (e.altKey) {
                                if (this.ultag.find('li').length > 0)
                                    this._hideResult();
                                break;
                            }
                        case 33: /* page up */
                            var step = e.keyCode == 33 ? activeitem : 1;
                            this._moveUp(this._activeItem, step);
                            this._preventDefaultAction(e,true);
                            break;
					    case 8:
                            this._preventDefaultAction(e);
                            break;
                        case 40: /* down arrow*/
                            if (e.altKey) {
                                if (this.ultag.find('li').length > 0)
                                    this._showResult();
                                break;
                            }
                        case 34: /* page down */
                            var step = e.keyCode == 34 ? activeitem : 1;
                            this._moveDown(this._activeItem, step);
                            this._preventDefaultAction(e,true);
                            break;
                        case 37 /* left arrow*/:
                            if (this.model.enableRTL) this._moveDown(this._activeItem, 1);
                            else this._moveUp(this._activeItem, 1);
                            this._preventDefaultAction(e);
                            break;
                        case 39 /* right arrow */:
                            if (this.model.enableRTL) this._moveUp(this._activeItem, 1);
                            else this._moveDown(this._activeItem, 1);
                            this._preventDefaultAction(e);
                            break;
                        case 9 /* Tab */:
                        case 27 /*ESC*/:
                            if (this._isPopupShown()) this._hideResult();
                            break;
                        case 35 /*End*/:
                            this._moveDown(this._listSize - 1, 0);
                            this._preventDefaultAction(e);
                            break;
                        case 36 /*Home*/:
                            var step = this._activeItem != null ? this._activeItem : this._listSize - 1;
                            this._moveUp(step, step);
                            this._preventDefaultAction(e);
                            break;
                    }
                }
                else {
                    switch (e.keyCode) {
                        
                        case 38: /* up arrow*/
                            if (e.altKey) {
                                if (this.ultag.find('li').length > 0)
                                    this._hideResult();
                            }
                            else if (e.shiftKey) {
                                this._shiftUp(this._activeItem, 1, e.ctrlKey);
                            }
                            else this._moveUp(this._activeItem, 1, e.ctrlKey);

                            this._preventDefaultAction(e);
                            break;
                        case 33: /* page up */
                            if (e.shiftKey) {
                                this._shiftUp(this._activeItem, activeitem, e.ctrlKey);
                            }
                            else this._moveUp(this._activeItem, activeitem, e.ctrlKey);

                            this._preventDefaultAction(e);
                            break;
						case 8:
                            this._preventDefaultAction(e);
                            break;
                        case 40: /* down arrow*/
                            if (e.altKey) {
                                if (this.ultag.find('li').length > 0)
                                    this._showResult();
                            }
                            else if (e.shiftKey) {
                                this._shiftDown(this._activeItem, 1, e.ctrlKey);
                            }
                            else this._moveDown(this._activeItem, 1, e.ctrlKey);

                            this._preventDefaultAction(e);
                            break;

                        case 34: /* page down */

                            if (e.shiftKey) {
                                this._shiftDown(this._activeItem, activeitem, e.ctrlKey);
                            }
                            else this._moveDown(this._activeItem, activeitem, e.ctrlKey);
                            this._preventDefaultAction(e);
                            break;
                        case 37 /* left arrow*/:
                            if (this.model.enableRTL) this._moveDown(this._activeItem, 1, false);
                            else this._moveUp(this._activeItem, 1, false);
                            this._preventDefaultAction(e);
                            break;
                        case 39 /* right arrow */:
                            if (this.model.enableRTL) this._moveUp(this._activeItem, 1, false);
                            else this._moveDown(this._activeItem, 1, false);
                            this._preventDefaultAction(e);
                            break;
                        case 9 /* Tab */:
                        case 27 /*ESC*/:
                            if (this._isPopupShown()) this._hideResult();
                            break;
                        case 35 /*End*/:
                            if (e.shiftKey) {
                                this._selectShiftEnd(this._activeItem, this._listSize - 1, e.ctrlKey);
                            }
                            else this._moveDown(this._activeItem, this._listSize, e.ctrlKey);

                            this._preventDefaultAction(e);
                            break;
                        case 36 /*Home*/:
                            var step = this._activeItem != null ? this._activeItem : this._listSize - 1;
                            if (e.shiftKey) {
                                this._selectShiftHome(this._activeItem, 0, e.ctrlKey);
                            }
                            else this._moveUp(this._activeItem, step, e.ctrlKey);

                            this._preventDefaultAction(e);
                            break;
                    }
                }
            }
        },

        _OnKeyUp: function (e) {
            if (this.model.enabled) {
                this._preventDefaultAction(e);
                var target = e.target;
                if (this._activeItem == null) {
                    this._activeItem = this._getLi().index(this.popupList.find("ol,ul").children("li.e-hover"));
                }
                if (this._trim(this._visibleInput.val()) == "" && e.keyCode == 38 && e.keyCode == 40) {
                    this._hideResult();
                    return false;
                }

                switch (e.keyCode) {
                    case 38: break;
                    case 40: break;
                    case 37: break;
                    case 39: break;

                    case 20: break;
                    case 16: break;
                    case 17: break;
                    case 18: break;
                    case 35: break;
                    case 36: break;
                    case 144: break;
                    case 27: break;
                    case 9: break;

                    case 13 /*Enter*/:
                        if (!this._isSingle && this._isPopupShown() && (e.ctrlKey || e.shiftKey) && this._activeItem >= 0) 
                            this._selectAndUnselect();
                        else if (this._isPopupShown() && !e.ctrlKey && !e.shiftKey){
							if(!ej.isNullOrUndefined(this.inputSearch)){
								if(this.getSelectedItem().length == 0 || !this.listitems[0].classList.contains("e-active") ) {
									this.selectItemByIndex(0);
									$(this.listitems[0]).removeClass("e-hover");
								}
								else {		
									var focusedItems = this._getLastFocusedLi();
                                    if(this.model.multiSelectMode  != "none" || this.model.showCheckbox) {
										this.unselectItemByIndex(focusedItems);
										$(this.listitems[focusedItems]).removeClass("e-hover");
									}
								}
							}
							this._hideResult();
						}
						else if (this._isPopupShown()) this._hideResult();
                        this._preventDefaultAction(e);
                        break;

                    case 32 /*spacebar*/:
                        if (this._isPopupShown() && this._isSingle) this._hideResult();
                        if (!this._isSingle && this._isPopupShown() && this._activeItem >= 0) {
                            this._selectAndUnselect();
                        }
                        this._preventDefaultAction(e);
                        break;
                    case 8 /*backspace*/:
                        if(this.model.multiSelectMode =="visualmode") this._deleteLastBox();                        
                        this._preventDefaultAction(e);
                        break;
                    case 46 /*Del*/:
                        if (this.model.multiSelectMode == "visualmode" || this.model.showCheckbox) {
                            this._deleteBox(this._ulBox.children("li.e-active"));
                            break;
                        }
                }
            }
        },

        _isSingleSelect: function () {
            return !this.model.showCheckbox && this.model.multiSelectMode == "none";
        },

        _selectAndUnselect: function () {
            if (this.model.showCheckbox) {
                this._isChecked(this._getActiveItem().find(".e-checkwrap")[0]) ?
                        this._removeTextBoxValue() : this._enterTextBoxValue();
            }
            else if (this.model.MultiSelectMode != "none") {
                this._getActiveItem().hasClass("e-active") ? this._removeTextBoxValue() : this._enterTextBoxValue();
            }
        },

        _targetFocus: function () {
            if (this.model.enabled && !this._isFocused) {
                if (!this._isWatermark)
                    this._hiddenSpan.css("display", "none");
                this.wrapper.addClass("e-focus e-popactive");
                this._isFocused = true;
                this._trigger("focusIn");
            }
        },

        _targetBlur: function () {
            if (this.model.enabled) {
                this._isFocused = false;
                this.wrapper.removeClass("e-focus e-popactive");
                this._setWatermark();
                this._trigger("focusOut");
            }
        },

		_getLocalizedLabels: function (property) {
            return this._localizedLabels[property] === undefined ? ej.DropDownList.Locale["en-US"][property] : this._localizedLabels[property]
        },
        _wireEvents: function () {
            this._on(this.wrapper, "focus", this._targetFocus);
            this._on(this.wrapper, "blur", this._targetBlur);
            this._on(this.wrapper, "keydown", this._OnKeyDown);
            !ej.isNullOrUndefined(this.popupList) && this._on(this.popupList, "keydown", this._OnKeyDown);
            !ej.isNullOrUndefined(this.popupList) && this._on(this.popupList, "keyup", this._OnKeyUp);
            this._on(this.wrapper, "keyup", this._OnKeyUp);
            !ej.isNullOrUndefined(this.popupList) && this._on(this.popupList, "keypress", this._OnKeyPress);
            this._on(this.wrapper, "keypress", this._OnKeyPress);
        },

        _unwireEvents: function () {
            this._off(this.wrapper, "focus", this._targetFocus);
            this._off(this.wrapper, "blur", this._targetBlur);
            this._off(this.wrapper, "keydown", this._OnKeyDown);
            !ej.isNullOrUndefined(this.popupList) && this._off(this.popupList, "keydown", this._OnKeyDown);
            !ej.isNullOrUndefined(this.popupList) && this._off(this.popupList, "keyup", this._OnKeyUp);
            this._off(this.wrapper, "keyup", this._OnKeyUp);
            !ej.isNullOrUndefined(this.popupList) && this._off(this.popupList, "keypress", this._OnKeyPress);
            this._off(this.wrapper, "keypress", this._OnKeyPress);
			$(window).off("resize", $.proxy(this._OnWindowResize, this));
        },

        _multiItemSelection: function (listItems, isAddItem) {
            if (!this._ulBox && this.model.multiSelectMode == "visualmode") this._renderBoxModel();
            for (var i = 0; i < listItems.length; i++) {
                var index = isAddItem ? this._rawList.length - (listItems.length - i) : i;
                if (this._hasClass(listItems[i], "chkselect")) {
                    this._activeItem = index;
                    this._enterTextBoxValue();
                    this._removeClass(listItems[i], "chkselect");
                }
            }
            this._setWatermark();
        },
        _appendCheckbox: function (listItems, isAddItem) {
            if (!this._ulBox && this.model.multiSelectMode == "visualmode") this._renderBoxModel();
            for (var i = 0; i < listItems.length; i++) {
                var index = isAddItem ? this._rawList.length - (listItems.length - i) : i,
                $checkbox = document.createElement("input"),
                $spanCheck = document.createElement("span");
                this._setAttr($checkbox, { type: "checkbox", name: "list" + index, "data-role": "none", id: this._id + "_" + "check" + index })
                    ._setClass($checkbox, "e-check-input")
                    ._setAttr($spanCheck, { name: "list" + index + "_wrap", "data-role": "none", id: this._id + "_" + "check" + index + "wrap", unselectable: "on", "aria-checked": false})
                    ._setClass($spanCheck, "e-checkwrap e-icon ");
                $spanCheck.appendChild($checkbox);
                listItems[i].insertBefore($spanCheck, listItems[i].childNodes[0]);
                if (this._hasClass(listItems[i], "chkselect")) {
                    this._activeItem = index;
                    this._enterTextBoxValue();
                    this._removeClass(listItems[i], "chkselect");
                }
            }
            this._setWatermark();
        },

        _onCheckChange: function (e) {
            var curEle = e.target.nodeName === "INPUT" ? e.target.parentElement : e.target;
            this._activeItem = $.inArray($(curEle).parents("li")[0], this._getLi());
            if (!this._hasClass(curEle, "e-check-act")) {
                this._enterTextBoxValue();
            }
            else {
                this._removeTextBoxValue();
            }
        },
        _isChecked: function (checkEle) {
            return (this._hasClass(checkEle, "e-check-act") && $(checkEle).children(".e-check-input")[0].checked == true);
        },
        _removeCheck: function () {
            this._getLi().find(".e-checkwrap").remove();
        },
        _resetCheck: function () {
            var getLi = this._getLi(), checkEle;
            getLi.find(".e-check-act").removeClass("e-check-act").attr("aria-checked",false);
            checkEle = getLi.find(".e-check-input:checked");
            for (var e = 0; e < checkEle.length; e++) {
                checkEle[e].checked = false;
            }
        }

    });
	ej.DropDownList.Locale = ej.DropDownList.Locale || {};
    ej.DropDownList.Locale["default"] = ej.DropDownList.Locale["en-US"] = {        
        emptyResultText: "No suggestions",  
		watermarkText:""
    };
    ej.MultiSelectMode = {
        /** Supports to selection mode with none only */
        None: "none",
        /** Supports to selection mode with delimitter only */
        Delimiter: "delimiter",
        /** Supports to selection mode with visualmode only */
        VisualMode: "visualmode"
    };
    ej.VirtualScrollMode = {      
        /** Make virtual scrollbar in normal mode */
        Normal: "normal",
        /** Make virtual scrollbar in continuous mode*/
        Continuous: "continuous"
    };
    
})(jQuery, Syncfusion);