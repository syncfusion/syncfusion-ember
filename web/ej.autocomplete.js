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

    ej.widget("ejAutocomplete", "ej.Autocomplete", {

        element: null,

        model: null,
        validTags: ["input"],
        _ignoreOnPersist: ["fields", "dataSource", "query", "focusIn", "focusOut", "change", "select",
                            "create", "destroy", "open", "close", "actionComplete", "actionSuccess", "actionFailure"],
        _setFirst: false,

        _rootCSS: "e-autocomplete",
        type: "editor",
        angular: {
            require: ['?ngModel', '^?form', '^?ngModelOptions']
        },

        _requiresID: true,

        defaults: {

            dataSource: null,

            query: null,

            fields: {

                text: null,

                key: null,
                //Deprecated
                category: null,

                groupBy: null,

                htmlAttributes: null
            },
            locale: "en-US",
			
			name:null,

            template: null,
            //Deprecated
            allowGrouping: false,

            enableDistinct: false,

            allowSorting: true,

            sortOrder: "ascending",

            htmlAttributes: {},

            multiSelectMode: "none",

            delimiterChar: ',',

            allowAddNew: false,

            addNewText: "Add New",

            showRoundedCorner: false,

            readOnly: false,

            cssClass: "",

            watermarkText: null,

            value: "",

            selectValueByKey: null,

            filterType: "startswith",

            caseSensitiveSearch: false,

            showLoadingIcon: true,
			
			showResetIcon : false,

            itemsCount: 0,

            minCharacter: 1,

            delaySuggestionTimeout: 200,

            showPopupButton: false,

            highlightSearch: false,

            enableAutoFill: false,

            enableRTL: false,

            enabled: true,

            visible: true,

            height: "",

            width: "",

            emptyResultText: "No suggestions",

            animateType: "slide",

            showEmptyResultText: true,

            enablePersistence: false,

            popupHeight: "152px",

            popupWidth: "auto",

            autoFocus: false,
			
            multiColumnSettings: {
    
                enable:false,
    
                showHeader:true, 
                
                stringFormat:"{0}",

                searchColumnIndices:[],
                         columns:[{
                           field:null,
           
                            headerText:null,
							
							textAlign:"left",
							
							headerTextAlign:"left",
							
							cssClass: "",
							
							type:"string",

							filterType: "startswith"
       
                        }]
            },

            validationRules: null,

            validationMessage: null,

            focusIn: null,

            focusOut: null,

            change: null,

            select: null,

            create: null,

            open: null,

            close: null,

            destroy: null,

            actionBegin: null,

            actionComplete: null,

            actionSuccess: null,

            actionFailure: null
        },

        dataTypes: {
            autoFocus: "boolean",
            watermarkText: "string",
            locale: "string",
            cssClass: "string",
            filterType: "enum",
            caseSensitiveSearch: "boolean",
            showLoadingIcon: "boolean",
            template: "string",
            //Deprecated
            allowGrouping: "boolean",
            enableDistinct: "boolean",
            allowSorting: "boolean",
            sortOrder: "enum",
            allowAddNew: "boolean",
            addNewText: "string",
            showRoundedCorner: "boolean",
			showResetIcon:"boolean",
            readOnly: "boolean",
            itemsCount: "number",
            animateType: "enum",
            minCharacter: "number",
            showPopupButton: "boolean",
            highlightSearch: "boolean",
            enableAutoFill: "boolean",
            enableRTL: "boolean",
            multiSelectMode: "enum",
            delimiterChar: "string",
            emptyResultText: "string",
            showEmptyResultText: "boolean",
            enabled: "boolean",
            visible: "boolean",
            enablePersistence: "boolean",
            dataSource: "data",
            query: "data",
            fields: "data",
            validationRules: "data",
            validationMessage: "data",
            htmlAttributes: "data",
            multiColumnSettings: "data",
            columns:"data",
            searchColumnIndices:"array"
        },
        observables: ["value", "selectValueByKey"],
        value: ej.util.valueFunction("value"),
        _selectValueByKey:ej.util.valueFunction("selectValueByKey"),
        enable: function () {
            if (!this.model.enabled) {
                this.model.enabled = true;
                this.target.disabled = false;
                this.element.removeClass("e-disable").attr({ "aria-disabled": false });
                this.element.removeAttr("disabled");
                if (this.model.showPopupButton) this.dropdownbutton.removeClass("e-disable").attr({ "aria-disabled": false });
                if (this.model.multiSelectMode == "visualmode") this._ulBox.removeClass("e-disable").attr({ "aria-disabled": false });
                this.wrapper.removeClass('e-disable-wrap');
            }
        },

        disable: function () {
            if (this.model.enabled) {
                this._hideResult();
                this.model.enabled = false;
                this.target.disabled = true;
                this.element.attr("disabled", "disabled");
                this.element.addClass("e-disable").attr({ "aria-disabled": true });
                if (this.model.showPopupButton) this.dropdownbutton.addClass("e-disable").attr({ "aria-disabled": true });
                if (this.model.multiSelectMode == "visualmode" && this._ulBox) this._ulBox.addClass("e-disable").attr({ "aria-disabled": true });
                this.wrapper.addClass('e-disable-wrap');
            }
        },

        clearText: function () {
            if (this.model.multiSelectMode == "visualmode")
                this._deleteBox(this._ulBox.children("li"));
            this.element.val("");
            this._valueChange();
            if (this._isFocused) this.element.blur();
            else this._focusOutAction();
            this._hideResult()
        },

        getValue: function () {
            var value = this.value();
            return (value == null) ? "" : value; 
        },

        getSelectedItems: function () {
            if (this._isFocused && this.model.multiSelectMode != "visualmode")
                this._updateSelectedItemArray(this.getValue());
            return this._selectedItems;
        },
        _setValue: function (value) {
            if (!this._isWatermark)
                this._hiddenSpan.css("display", "none");
            if (typeof value === "object" || (typeof value === "number" && isNaN(value)) || $.trim(value) == "") value = "";
            if (this.model.multiSelectMode == "visualmode")
                this._hiddenInput.val("");
            this.element.val("");
            if (!this._hiddenInput) this._hiddenInput = ej.buildTag("input#" + this.target.id + "_hidden", "", {}, { type: "hidden", "name": this.element.attr("name") }).insertBefore(this.element);
            if (value) {
                if (this.model.multiSelectMode == "visualmode") {
                    this._selectedItems = [];
                    this._modelValue = value;
                    this._deleteBox(this._ulBox.children("li"));
                    var values = value.split(this.model.delimiterChar);
					this.element.width(1).val("").removeAttr('placeholder');
					if (ej.DataManager && this.model.dataSource instanceof ej.DataManager) {
                        this._createBoxForObjectType(values);
                    }
                    else {
                        this.suggestionListItems = this.model.dataSource;
                        if (this.suggestionListItems && typeof this.suggestionListItems[0] != "object") {
							this._hiddenInput.val(value);
                            for (var i = 0, length = values.length; i < length; i++) {
                                if (values[i]) {
                                    this._ulBox.append(this._createBox(values[i]));
                                    this._selectedItems.push(values[i]);
                                }
                            }
                            }
                        else this._createBoxForObjectType(values);
                    }
                }
                else {
                    this.element.val(value);
                    this._updateSelectedItemArray(value);
                }
            }
            if (this.model.multiSelectMode != "visualmode") this.value(this.element.val());
            this._preVal = this.element.val();
            !this._isWatermark && this._setWatermarkTxt();
            return value;

        },
        _createBoxForObjectType: function (values) {
			var proxy=this, map=this._declareVariable();
            for (var data = 0, length = values.length; data < length; data++) {
                var _val = $.trim(values[data]);
				if(_val != ""){
                if (ej.DataManager && this.model.dataSource instanceof ej.DataManager) {
                    this._dataQuery = this._getQuery().where(map[0], "equal", _val, false);
                    this._promise = (this.model.dataSource).executeQuery(this._dataQuery);
                    this._promise.done(function (e) {
                        var res = e.result;
                        proxy._strData = res instanceof Array && res.length ? res[0] : _val;
                        if (!ej.isNullOrUndefined(proxy._strData[map[1]]))
                            proxy._selectKeyInit();
                        proxy._selectedItems.push(proxy._strData);
                    }).fail(function (e) {
                        proxy._selectedItems.push(_val);
                    });
                }
                else {
                    this._dataQuery = ej.Query().where(map[0], "equal", _val, false);
                    this._promise = ej.DataManager(this.suggestionListItems).executeLocal(this._dataQuery);
                    this._strData = this._promise instanceof Array && this._promise.length ? this._promise[0] : _val;
                    if (!ej.isNullOrUndefined(this._strData[map[1]])) 
					  this._selectKeyInit();
					this._selectedItems.push(this._strData);
                }
                if (this.model.multiSelectMode == "visualmode")
                    this._ulBox.append(this._createBox(_val));
            }
			}
			
        },

        _selectKeyInit: function () {
            var mapper = this._declareVariable();
            delimiterChar = this._delimiterChar();
            if (this.model.multiSelectMode == "visualmode")
                this._hiddenInput.val(this._hiddenInput.val() + (!ej.isNullOrUndefined(this._strData[mapper[1]] || this._strData[mapper[0]]) ? (this._strData[mapper[1]] || this._strData[mapper[0]]) + this.model.delimiterChar : ""));
            if (!ej.isNullOrUndefined(this._strData[mapper[1]])) {
                if (this.model.multiSelectMode != "none") {
                    var keyValue = this._selectValueByKey() != null ? (this._selectValueByKey() + this._strData[mapper[1]] + delimiterChar) : this._strData[mapper[1]] + delimiterChar
                    keyValue = keyValue.split(delimiterChar).reduce(function (a, b) { if (a.indexOf(b) < 0) a.push(b); return a; }, []);
                    this._selectValueByKey(keyValue.join(delimiterChar));
                }
                else this._selectValueByKey(this._strData[mapper[1]]);
            }
        },
		    _declareVariable: function () {
		        var mapper = this.model.fields, mapFld = { _key: null, _text: null, _attr: null }, keyText = [];
			 if(!ej.isNullOrUndefined(mapper)){
				mapFld._text = (mapper && mapper.text) ? mapper["text"] : "text" ;
				mapFld._key = (mapper && mapper.key) ? mapper["key"] : "key" ;
				keyText.push(mapFld._text,mapFld._key);
				return keyText;
			 }
		},

       selectValueByKey: function (key) {
            if (!ej.isNullOrUndefined(key)) {
                var proxy = this;
                key = key.toString();
                var result = this.model.multiSelectMode != "none" ? key.split(this.model.delimiterChar) : key.split(",");
                if (Object.prototype.toString.call(result) === '[object Array]') {
                    $.each(result, function (index, value) {
                        proxy._setOperation($.trim(value), "key");
                    });
                }
                this._eventTrigger();
            }
        },

        selectValueByText: function (text) {
            this._setOperation(text, "text");
            var list = this.model.dataSource;
            if (!(ej.DataManager && list instanceof ej.DataManager)) this._eventTrigger();
        },

        _eventTrigger: function () {
            var currValue = this.model.multiSelectMode == "visualmode" ? this._modelValue : this.element.val() == "" ? null : this.element.val();
            this._trigger("select", { isInteraction: true, value: this.value(), text: currValue, key: this._selectValueKey, item: this._selectedItems });
        },

        setValue: function (text) {
            this._setText(text);
        },

        _setOperation: function (source, value) {
            var bindTo = "", promise, dataQuery, proxy = this, list = this.model.dataSource;
            if (ej.isNullOrUndefined(list)) return false;
            if (typeof list[0] == "object" || list instanceof ej.DataManager) {
                var mapper = this.model.fields;
                bindTo = (mapper && mapper[value]) ? mapper[value] : value;
            } else if (value == "key")
                return false;
            if (ej.DataManager && list instanceof ej.DataManager) {
                dataQuery = this._getQuery().where(bindTo, "equal", source, !this.model.caseSensitiveSearch);
                promise = (list).executeQuery(dataQuery);
                promise.done(function (e) {
                    proxy._setText(e.result[0]);
                    proxy._eventTrigger();
                });
            }
            else {
                if ((!list || !list.length || list.length < 1)) return false;
                dataQuery = ej.Query().where(bindTo, "equal", source, !this.model.caseSensitiveSearch);
                promise = ej.DataManager(list).executeLocal(dataQuery);
                this._setText(promise[0]);
            }
        },

        _setText: function (data) {
            if (!data) return false;
            var currentValue, keyvalue, mapper = this.model.fields;
            if ((typeof this.model.dataSource[0] == "object") || (typeof data == "object")) {
                currentValue = typeof data == "string" ? data : (mapper && mapper["text"]) ? data[mapper["text"]] : data["text"];
                keyvalue = typeof data == "string" ? data : (mapper && mapper["key"]) ? data[mapper["key"]] : data["key"];
            }
            else currentValue = data;
            if (currentValue) {
                if (this.model.multiSelectMode == "visualmode" && this._removeDuplicates(data)) return false;
                this._valueToTextBox(currentValue, data, true);
                var currValue = this.model.multiSelectMode == "visualmode" ? this._modelValue : this.element.val();
                this.value(currValue);
				if (this.model.showResetIcon) this._showReset();
            }
           this._selectValueKey = keyvalue;
           this._selectkey.push(keyvalue);
           if (!ej.isNullOrUndefined(keyvalue)) this._selectValueByKey(this._selectkey + this.model.delimiterChar);                
        },

        _textFormateString: function (data, index) {
            var _textFormatString = this.model.multiColumnSettings.stringFormat
			this._columnsIndex();
            if (!ej.isNullOrUndefined(data) && typeof data == "object") {
                for (var i = 0, length = this._columnIndex.length; i < length; i++)
                    _textFormatString = _textFormatString.replace("{" + this._columnIndex[i] + "}", data[this.model.multiColumnSettings.columns[parseInt(this._columnIndex[i])].field]);
            }
            else if (!ej.isNullOrUndefined(data) && typeof data != "object") {
                _textFormatString = _textFormatString.replace("{" + this._columnIndex[0] + "}", data);
            }
            else
                _textFormatString = this._currList[this._activeItem - 1];
            return _textFormatString;
        },

		_columnsIndex: function(){
			var _proxy = this; this._columnIndex = [];
			$.each(this.model.multiColumnSettings.stringFormat.match(/\{.+?\}/g),function (x,n){ 
				  _proxy._columnIndex[x] = n.slice(1,-1)
            });
            this._searchColumnIndex = [];
            $.each(this.model.multiColumnSettings.searchColumnIndices,function (x,m){ 
                _proxy._searchColumnIndex.push(m);
          });
        },
        _valueToTextBox: function (currentValue, data, flag) {
            var delimiterIndex;
         if(!this._addNewTemplate && this.model.multiColumnSettings.enable && typeof data != "string") 
             currentValue = this._textFormateString(data);
         delimiterIndex = this.model.delimiterChar;
         var key = this._getUniqueKey();
         key = key ? key : (this.model.fields && this.model.fields["key"]) ? data[this.model.fields["key"]] : !ej.isNullOrUndefined(data["key"]) ? data["key"] : key;
         if (!this._hiddenInput) this._hiddenInput = ej.buildTag("input#" + this.target.id + "_hidden", "", {}, { type: "hidden", "name": this.element.attr("name") }).insertBefore(this.element);
         if (!(this._hiddenInput.val() == key || key == null) || temp > -1) {
                 if (this.model.multiSelectMode == "none") this._hiddenInput.val(key || currentValue);
                 else this._hiddenInput.val(this._hiddenInput.val() + (key || currentValue) + delimiterIndex);
         }
         if (this.model.multiSelectMode == "visualmode") {
             data = (typeof data == "string" && this._addNewTemplate && data.substr(data.length - this._addNewTemplate.length) == this._addNewTemplate) ? data.replace(this._addNewTemplate, "") : data;
             if (typeof currentValue == "number") currentValue = this._textFormateString(currentValue);
				var temp = currentValue.indexOf(this._addNewTemplate);
                if (this._addNewTemplate) currentValue = currentValue.substr(0, currentValue.length - this._addNewTemplate.length);
                if(!(this._selectValueByKey() == key || key == null) || temp > -1 )					
			        this._selectValueByKey(this._selectValueByKey() != null ? (this._selectValueByKey() + (temp > -1 ? currentValue : key) + delimiterIndex) : (temp > -1 ? currentValue : key) + delimiterIndex);
			    this._modelValue = ej.isNullOrUndefined(this.value()) ? currentValue + delimiterIndex : this.value() + currentValue + delimiterIndex;
                this.element.val("").removeAttr('placeholder').width(1);
                this._ulBox.append(this._createBox(currentValue));
				if(this.model.height!=""){
                $(this._ulBox).parent().css("overflow","auto");	
                if((this.model.showPopupButton)&&(this._ulBox.parent()[0].scrollHeight!=0)) this.dropdownbutton.css("height",this._ulBox.parent()[0].scrollHeight);				
				}
                this._addNewTemplate = null;
            }
            else if (this.model.multiSelectMode == "delimiter") {
                var delimiterIndex = (this.target.value).lastIndexOf(this.model.delimiterChar);
                if (this._typed || this.element.val() == "" || flag || !this.model.showPopupButton) {
                    if (flag)
                        this.element.val(this.element.val() == "" ? (currentValue + this.model.delimiterChar) : (this.element.val() + currentValue + this.model.delimiterChar));
                    else					 
                        delimiterIndex == -1 ? this.element.val(this._queryString.substr(0, delimiterIndex + 1) + currentValue + this.model.delimiterChar):this.element.val(this._queryString.substr(0, delimiterIndex + ((this.model.delimiterChar).length)) + currentValue + this.model.delimiterChar)
                 }
                else {
                    if(!this.model.enableAutoFill || this.showSuggestionBox) {
					if (this._checkDeli())
                        this.element.val(this._queryString.substr(0, delimiterIndex) + this.model.delimiterChar + currentValue + this.model.delimiterChar);
                    else
                        this.element.val(this.element.val() + this.model.delimiterChar);
                    }
					else if(!this._checkDeli()) this.element.val(this.element.val() + this.model.delimiterChar);
				}
                this._typed = false;
            }
            else {
                this.element.val(currentValue);
                this._selectedItems = [];
            }
            this._selectedItems.push(data);
			this._originalval.push(currentValue);
            this._moveCaretToEnd(this.element[0]);
        },

        _removeDuplicates: function (currentValue) {
            if (this._selectedItems.length == 0) return false;
            if (this._selectedItems.indexOf(currentValue) != -1) return true;
        },

        search: function () {
            if (this.model.enabled && this._checkDelimiter()) {
                this._hideResult();
                this._autoFill = false;
                this._queryString = $.trim(this._queryString);
                if (this._queryString.length > 0) this._OnTextEnter();
            }
        },
        setVisible: function (value) {
            if (value)
                this.wrapper.show();
            else
                this.wrapper.hide();
        },

        hide: function () {
            this._hideResult();
        },

        open: function () {
            this._showFullList();
        },

        _changeWatermark: function (text) {
            if (this._isWatermark) this.element.attr("placeholder", text);
            else this._hiddenSpan.text(text);
        },
        _changeSkin: function (skin) {
            this.wrapper.removeClass(this.model.cssClass).addClass(skin);
            this.suggestionList.removeClass(this.model.cssClass).addClass(skin);
        },
        _setDropdown: function (boolean) {
            this.model.showPopupButton = boolean;
            if (boolean) this._renderDropdown();
            else this._destroyDropdown();
        },
        _changeHeight: function (height) {
            this.wrapper.height(height);
        },
        _changeWidth: function (width) {
            this.wrapper.width(width);
            this._setListWidth();
        },
        _setCulture: function () {
            this._localizedLabels = this._getLocalizedLabels();
            if (!ej.isNullOrUndefined(this._options)) {
                if (!ej.isNullOrUndefined(this._options.addNewText)) this._localizedLabels.addNewText = this._options.addNewText;
                if (!ej.isNullOrUndefined(this._options.emptyResultText)) this._localizedLabels.emptyResultText = this._options.emptyResultText;
                if (!ej.isNullOrUndefined(this._options.watermarkText)) this._localizedLabels.watermarkText = this._options.watermarkText;
            }
            this.model.addNewText = this._localizedLabels.addNewText;
            this.model.emptyResultText = this._localizedLabels.emptyResultText;
            this.model.watermarkText = this._localizedLabels.watermarkText;
        },
        
        _init: function (options) {
            this._options = options;
            this._selectkey=[];
            this._setCulture();
            if (!this.element.is("input") || (this.element.attr('type') && this.element.attr('type') != "text")) return false;
            //deprecated Property Added
            this.model.fields.groupBy = !this.model.fields.groupBy ? this.model.fields.category : this.model.fields.groupBy;
            this._initialize();
            this._render();
            this._wireEvents();
            this.initialRender = false;
            if (this.model.validationRules != null) {
                this._initValidator();
                this._setValidation();
            }
        },

        _initValidator: function () {
            (!this.element.closest("form").data("validator")) && this.element.closest("form").validate();
        },
        _setValidation: function () {
            if (!this.model.validationRules) return;
            var element = this.model.multiSelectMode == "visualmode" ? this._hiddenInput : this.element;
            element.rules("add", this.model.validationRules);
            var validator = this.element.closest("form").data("validator");
            validator = validator ? validator : this.element.closest("form").validate();
            name = element.attr("name");
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
        },
		_removeDuplicateValue: function(values) {
			return values.split(this.model.delimiterChar).reduce(function (a, b) { if (a.indexOf(b) < 0) a.push(b); return a; }, []).join(this.model.delimiterChar);
		},
        _delimiterChar:function(){
            return (this.model.multiSelectMode != "none" ? this.model.delimiterChar : "");
        },
        _setModel: function (options) {
            var option;
            for (option in options) {
                switch (option) {
                    case "dataSource": this.model.dataSource = null; break;
                    case "watermarkText": this._changeWatermark(options[option]); break;
                    case "delaySuggestionTimeout": this.model.delaySuggestionTimeout = parseInt(options[option]); break;
                    case "value":
                        deli = this._delimiterChar();
                        if (this.model.multiSelectMode != "none") {
                            value = options[option].substr(options[option].length - deli.length) == deli ? options[option] : options[option] + deli;
                            options[option] = options[option] == "" ? this.value() : (this.value() ? this.value() : "") + value;
                            if (this.model.multiSelectMode == "visualmode") {
                                options[option] = options[option].split(deli).reduce(function (a, b) { if (a.indexOf(b) < 0) a.push(b); return a; }, []);
                                options[option] = options[option].join(deli);
                            }
                        }
                        this.value(this._setValue(options[option]));
                        var data = this.model.dataSource;
                        if (ej.DataManager && data instanceof ej.DataManager) this._loadInitData();
                        else this._setHiddenkeyByValue(data);
                        this._modelValue = this.value()
                        var currValue = this.model.multiSelectMode == "visualmode" ? this._hiddenInput.val() : this.element.val();
                        this._changeEvtTrigger(currValue);
                        if (this.model.showResetIcon) this._showReset();
                        break;
                    case "showPopupButton": this._setDropdown(options[option]); break;
                    case "enableRTL": this._RightToLeft(options[option]); break;
                    case "showRoundedCorner": this._setRoundedCorner(options[option]); break;
                    case "readOnly": this._checkReadOnly(options[option]); break;
                    case "delimiterChar": var delchar = this.model.delimiterChar;
                        options[option] = this._validateDelimiter(options[option]);
                        this.model.delimiterChar = options[option];
                        this.element.val(this.value().replace(new RegExp(delchar, 'g'), this.model.delimiterChar));
                        this.value(this.element.val());
                        break;
                    case "validationRules":
                        if (this.model.validationRules != null) {
                            this.element.rules('remove');
                            this.model.validationMessage = null;
                        }
                        this.model.validationRules = options[option];
                        if (this.model.validationRules != null) {
                            this._initValidator();
                            this._setValidation();
                        }
                        break;
                    case "validationMessage":
                        this.model.validationMessage = options[option];
                        if (this.model.validationRules != null && this.model.validationMessage != null) {
                            this._initValidator();
                            this._setValidation();
                        }
                        break;
                    case "locale":
                        if (ej.Autocomplete.Locale[options[option]]) {
                            this.model.locale = options[option];
                            this._setCulture();
                            this._setWatermark();
                        } else  this.model.locale = options[option];
                        break;
                    case "filterType":
                        var arr = [];
                        for (var key in ej.filterType)
                            if (ej.filterType.hasOwnProperty(key))
                                arr.push(ej.filterType[key]);
                        if (arr.indexOf(options[option]) > -1)
                            this.model.filterType = options[option];
                        else
                            options[option] = this.model.filterType;
                        break;
                    case "multiSelectMode":
                        this.model.multiSelectMode = options[option];
                         var delimiter =this._delimiterChar();
                         if (this.model.multiSelectMode != "none") {
                             var key = this._selectValueByKey(), value = this.value();
                             if (value) {
                                 value = value.substr(value.length - delimiter.length) == delimiter ? value : value + delimiter
                                 this.value(value);
								 if(this.model.multiSelectMode == "visualmode") this.value(this._removeDuplicateValue(this.value()))
                             }
                             if (key) {
                             this._selectValueByKey(key.substr(key.length - delimiter.length) == delimiter ? key : key + delimiter);
							 if(this.model.multiSelectMode == "visualmode") this._selectValueByKey(this._removeDuplicateValue(this._selectValueByKey()));
							 }
						 }
                         else {

                         }
                        if (options[option] == "visualmode") {
                            if (this.model.validationRules != null)
                                this.element.rules('remove');
							if (this.element.val() != "" && this._isWatermark ) this.element.removeAttr("placeholder");                            
                        }
                        else if (this.element.hasClass("e-visual-mode")) 
                            this._destroyBoxModel();
                        this._destroy();
                        this._init();
                        this._setValue(this.value());
                        this._setValidation();
                        if (ej.isNullOrUndefined(this.element.attr("placeholder")) && this._isWatermark)
                            this._setWatermark();
                        break;
                    case "enabled": this._disabled(!options[option]); break;
                    case "visible":
                        this.setVisible(options[option]);
                        break;
                    case "height": this._changeHeight(options[option]); break;
                    case "width": this._changeWidth(options[option]); break;
                    case "cssClass": this._changeSkin(options[option]); break;
                    case "itemsCount ": if (options[option] <= 0 || isNaN(options[option])) options[option] = 0; break;
                    case "popupHeight": this.suggestionList.css({ "max-height": isNaN(options[option]) ? options[option]: options[option] + "px" }); break;
                    case "popupWidth": this.model.popupWidth = options[option]; this._setListWidth(); break;
                    case "selectValueByKey":
                        deli = this._delimiterChar();
                        key = ej.util.getVal(options[option]);
                        this.selectValueByKey(key);
                        keyValue =   (this.model.multiSelectMode != "none") ? this._selectValueByKey() + options[option]:options[option];
                        keyValue = keyValue.split(deli).reduce(function (a, b) { if (a.indexOf(b) < 0) a.push(b); return a; }, []);
                        keyValue=keyValue.join(deli);
                        options[option] = keyValue.substr(keyValue.length - deli.length) == deli ? keyValue  : keyValue+ deli;
                        break
                    case "htmlAttributes": this._addAttr(options[option]); break;
                    case "emptyResultText":
                        if (ej.isNullOrUndefined(this._options)) this._options = {};
                        this._options["emptyResultText"] = this.model.emptyResultText = options[option];
                        this._setCulture(); break;
                    case "addNewText":
                        if (ej.isNullOrUndefined(this._options)) this._options = {};
                        this._options["addNewText"] = this.model.emptyResultText = options[option];
                        this._setCulture(); break;
					case "multiColumnSettings":
						if(!ej.isNullOrUndefined(options[option].enable)) this.model.multiColumnSettings.enable = options[option].enable;
						if(!ej.isNullOrUndefined(options[option].showHeader)) this.model.multiColumnSettings.showHeader = options[option].showHeader;
                        if(!ej.isNullOrUndefined(options[option].stringFormat)) this.model.multiColumnSettings.stringFormat = options[option].stringFormat;
                        if(!ej.isNullOrUndefined(options[option].searchColumnIndices)) this.model.multiColumnSettings.searchColumnIndices = options[option].searchColumnIndices;
						if(!ej.isNullOrUndefined(options[option].columns)) this.model.multiColumnSettings.columns = options[option].columns;
						this.suggestionList.remove();
						this._renderSuggestionList();
						break; 
                    case "showResetIcon": this.model.showResetIcon = options[option];
                        if (options[option] && !ej.isNullOrUndefined(this.value()) && this.value()!="") this._showReset();
						else this._removeReset();
						break;
                }
				this._hideResult();
            }
        },

        _destroy: function () {
            this.element.width("").removeAttr("role aria-label aria-expanded aria-haspopup aria-autocomplete autocomplete placeholder aria-owns aria-disabled disabled");
            this.element.insertAfter(this.wrapper);
            if (this.model.multiSelectMode == "visualmode")
                this.element.removeClass("e-visual-mode").attr("name", this._hiddenInput.attr("name"));
            if (!this.model.enabled) this.element.removeClass('e-disable');
            this.wrapper.remove();
            this.element.removeClass("e-input").val("");
            if (this._isWatermark) this.element.removeAttr("placeholder");
            this._hideResult();
            this.suggestionList.remove();
        },

        _initialize: function () {
            this.value(this.value() === "" ? this.element[0].value : this.value());
            this.element.attr("role", "combobox").attr("aria-label", "Autocomplete textbox").attr("aria-expanded", false).attr("aria-autocomplete", "list");
            if(ej.isNullOrUndefined(this.element.attr('tabindex')))
				this.element.attr("tabindex", 0);
			if (/Edge\/12./i.test(navigator.userAgent)) this.element.addClass('edge-browser');
            this.target = this.element[0];
            this.dropdownbutton = null;
            this._isIE8 = (ej.browserInfo().name == "msie") && (ej.browserInfo().version == "8.0") ? true : false;
            this.showSuggestionBox = false;
            this.noresult = true;
            this._queryString = null;
            this.suggLen = 0;
            this._selectedItems = [];
            this._modelValue = "";
            this._activeItem = 0;
			this._originalval = [];
            this.ctrlKeyPressed = false;
            this._isFocused = false;
            this._isOpened = false;
            this._typed = false;
            this._cancelEvent = false;
            this._isWatermark = this._checkWatermarkSupport();
			this._selectedObj = [];
        },

        _render: function () {
            this._renderWrapper();
            this._addAttr(this.model.htmlAttributes);
            this._setDimentions();
            this._renderDropdown();
            this._checkProperties();
            this._isWatermark ? this._setWatermark() : this._setWatermarkTxt();
            this._renderSuggestionList();
            this._RightToLeft(this.model.enableRTL);
            this._setRoundedCorner(this.model.showRoundedCorner);
            this.setVisible(this.model.visible);
            this._setListPosition();
        },
        _renderWrapper: function () {
            this.element.addClass("e-input").attr("autocomplete", "off");
			if(this.model.multiSelectMode == "visualmode"){
            this.wrapper = ej.buildTag("div.e-atc e-widget " + this.model.cssClass + "#" + this.target.id + "_wrapper").insertAfter(this.element);
            this.container = ej.buildTag("div.e-in-wrap e-box").append(this.element);
            }else{
            this.wrapper = ej.buildTag("span.e-atc e-widget " + this.model.cssClass + "#" + this.target.id + "_wrapper").insertAfter(this.element);
            this.container = ej.buildTag("span.e-in-wrap e-box").append(this.element);
            }
            if (document.activeElement == this.element[0]) var focus = true;
            this.wrapper.append(this.container);
            if (!this._isWatermark) {
                this._hiddenSpan = ej.buildTag("span.e-input e-placeholder ").insertAfter(this.element);
                this._hiddenSpan.text(this.model.watermarkText);
                this._hiddenSpan.css("display", "none");
                var proxy = this;
                this._hiddenSpan.click(function (event) {
                    if (!this._isFocused) proxy.element.focus();
                });
            }
            if (focus) this.element.focus();
        },

        _renderDropdown: function () {
            if (this.model.showPopupButton) {
                var span = ej.buildTag("span.e-icon e-search").attr((this._isIE8) ? { 'unselectable': 'on' } : {});
                this.dropdownbutton = ej.buildTag("span.e-select#" + this.target.id + "_dropdown").attr((this._isIE8) ? { 'unselectable': 'on' } : {}).append(span);
                this.container.append(this.dropdownbutton).addClass("e-padding");
                if (!this.model.enabled)this.dropdownbutton.addClass("e-disable").attr({ "aria-disabled": true });
                this.dropdownbutton.on("mousedown", $.proxy(this._OnDropdownClick, this));
            }
        },
        _addAttr: function (htmlAttr) {
            var proxy = this;
            $.map(htmlAttr, function (value, key) {
                if (key == "required") proxy.element.attr(key, value);
                if (key == "class") proxy.wrapper.addClass(value);
                else if (key == "name") proxy.element.attr(key, value);
                else if (key == "disabled" && value == "disabled") proxy._disabled(true);
                else if (key == "readOnly" && value === true) proxy._checkReadOnly(true);
                else proxy.wrapper.attr(key, value);
            });
        },
        _setDimentions: function () {
            if (this.model.height)
                this.wrapper.height(this.model.height);
            if (this.model.width)
                this.wrapper.width(this.model.width);
        },

        _renderBoxModel: function () {
            this._ulBox = ej.buildTag("ul.e-ul e-boxes");
            var disableClass = this.model.enabled ? "" : "e-disable";
            this._ulBox.addClass(disableClass);
            this._hiddenInput = ej.buildTag("input#" + this.target.id + "_hidden", "", {}, { type: "hidden" }).insertBefore(this.element);
            this._hiddenInput.attr("name", this.element.attr("name"));
            this.element.val("").removeAttr("name").addClass("e-visual-mode");
            if (!this._isWatermark) this.element.width(1);
            this.container.prepend(this._hiddenInput, this._ulBox);
            if(this.model.height!="")
			  this.wrapper.height(this.model.height);
			else 
				this.wrapper.height("auto");
            this._on(this.container, "mousedown", function (e) {
                if (!this.model.enabled) return false;
                var $target = $(e.target);
                if (!$target.is(this.element)) {
                    e.preventDefault();
                    if (!this._isFocused) this.element.focus();
                    if ($target.hasClass("e-options")) {
                        if (!e.ctrlKey && $target.siblings().hasClass("e-active")) this._removeActive();
                        if ($target.hasClass("e-active")) $target.removeClass("e-active");
                        else $target.addClass("e-active");
                    }
                    else this._moveCaretToEnd(this.element[0]);
                }
                if (!e.ctrlKey && ($target.hasClass("e-boxes") || $target.hasClass("e-input"))) this._removeActive();
            });
        },
        _destroyBoxModel: function () {
            this.container.prepend(this.element);
            this.element.attr({ name: this._hiddenInput.attr("name") }).removeAttr("style").removeClass("e-visual-mode");
            this.wrapper.height(this.model.height);
            this._hiddenInput.remove();
			this._hiddenInput = null;
            this._ulBox.remove();
            this._off(this.container, "mousedown");
        },
        _deleteLastBox: function () {
            var items = this._ulBox.children();
            var item = items.last(), flag = item.hasClass("e-active");
            this._removeActive();
            flag ? this._deleteBox(item) : item.addClass("e-active");
        },
        _deleteBox: function (items) {
            for (var i = 0, length = items.length; i < length; i++) {
                var boxes = this._ulBox.children();
                var index = boxes.index(items[i]);
                this._selectedItems.splice(index, 1);

                var deli = this.model.delimiterChar;
                var values = this._hiddenInput.val().split(deli);
                values.splice(index, 1);
                this._hiddenInput.val(values.join(deli));
                this._selectValueByKey(values.join(deli));

                var val = this._modelValue.split(deli);
                val.splice(index, 1);
                this._modelValue = val.join(deli);
                $(items[i]).remove();
            }
            if (this.showSuggestionBox) this._refreshPopup();
            this._valueChange();
            if (this.value() == "" && this.model.height != "") {
                $(this._ulBox).parent().css("overflow", "hidden");
                this.dropdownbutton.css("height", this.model.height);
            }
            if (this._hiddenInput.val() == "")
                this._setWatermark();
        },
        _removeActive: function () {
            this._ulBox.children("li.e-active").removeClass("e-active");
        },
        _adjustWidth: function () {
            var tempSpan = ej.buildTag("span", this.element.val()), wid, minWidth;
            this.container.append(tempSpan);
            minWidth = 30;  //  some additional width for textbox in visualmode
            wid = tempSpan.width() + minWidth;
            if (this.element.width() != wid)
                this.element.width(wid);
            if (this._hiddenInput.val() == "")
                this._setWatermark();
            tempSpan.remove();
        },

        _checkProperties: function () {
            this._checkReadOnly(this.model.readOnly);
            this.model.delimiterChar = this._validateDelimiter(this.model.delimiterChar);
            if (!this.model.enabled) {
                this.model.enabled = true;
                this._disabled(true);
            }
            else if (this.model.enabled && $(this.element).hasClass("e-disable")) {
                this.model.enabled = false;
                this._disabled(false);
            }
            this._checkNameAttr();
            if (this.model.multiSelectMode == "visualmode") this._renderBoxModel();
            if (!ej.isNullOrUndefined(this._selectValueByKey())) {
                var key = this._selectValueByKey().toString();
                if (this.model.multiSelectMode != "none") {
                    key = key.substr(key.length - this.model.delimiterChar.length) == this.model.delimiterChar ? key : key + this.model.delimiterChar;
                    ((this.model.multiSelectMode == "visualmode") ? this._selectValueByKey(null) : this._selectValueByKey(key));
                }
                this.selectValueByKey(key);
				if (this.model.showResetIcon) this._showReset();
            }
            else {
				var value = (!ej.isNullOrUndefined(this.value())) ? this.value().toString() : this.value();
                if (this.model.multiSelectMode != "none" && (!ej.isNullOrUndefined(value) && value !="")) {
                    value = value.substr(value.length - this.model.delimiterChar.length) == this.model.delimiterChar ? value : value + this.model.delimiterChar;
                }
                this.value(this._setValue(value));
				if(value){
                var data = this.model.dataSource;
                if (ej.DataManager && data instanceof ej.DataManager) this._loadInitData(value);
                else this._setHiddenkeyByValue(data); 
				}
                if (this.model.showResetIcon && this.value() != "") this._showReset();
            }
        },

        _loadInitData: function (source) {
		        var results = this.model.dataSource, proxy = this;
		        var mapper = this.model.fields;
		        bindTo = (mapper && mapper["text"]) ? mapper["text"] : "text";
		        if (this.model.multiSelectMode != "none")
		            source = source.split(this.model.delimiterChar);
		        if (ej.DataManager && results instanceof ej.DataManager) {
		            if (!proxy._trigger("actionBegin", { requestFrom: "default" })) {
		                var queryPromise, queryCollection = this._getQuery();
		                if (typeof (source) == "object") {
		                    for (var k = 0; k < source.length - 1; k++)
		                        queryCollection.queries.push(ej.Predicate(bindTo, "equal", source[k].trim(), !this.model.caseSensitiveSearch));
		                    queryPromise = results.executeQuery((queryCollection));
		                }
		                else
		                    queryPromise = results.executeQuery(this._getQuery().where(bindTo, "equal", source, !this.model.caseSensitiveSearch));
		                queryPromise.done(function (e) {
		                    proxy._trigger("actionSuccess", { e: e, requestFrom: "default" });
		                    if (!e.result || e.result.length > 0) proxy._setHiddenkeyByValue(e.result);
		                });
		            }
		        }
		    },

		    _setHiddenkeyByValue: function (data) {
				if(ej.isNullOrUndefined(this.value())) this.value("");
                var currValue = this.value(), results = data, totalValue = [], dval = [];
		        currValue = (this.model.multiSelectMode == "none") ? currValue.replace(",", "") : currValue.split(this.model.delimiterChar);
                if (!ej.isNullOrUndefined(results)) {
		            for (var i = 0; i < results.length; i++) {
		                var _text = this._getField(results[i], this.model.fields["text"]);
		                if (typeof (_text) == "number") _text = _text.toString();
		                if (!ej.isNullOrUndefined(this.model.fields["key"])) {
		                    var _key = this._getField(results[i], this.model.fields["key"]);
							if (typeof (currValue) == "string") {
							    if (_text == currValue)
							        this._hiddenInput.val(_key);
							} else {
							    for (j = 0; j < currValue.length - 1; j++) {
							        if (_text == currValue[j]) {
							            if (this._hiddenInput.val() == "")
							                this._hiddenInput.val(_key);
							            else
							                this._hiddenInput.val(this._hiddenInput.val() + this.model.delimiterChar + _key + this.model.delimiterChar);
							        }
							    }
							}
		                }
		                else if (ej.isNullOrUndefined(this.model.fields["key"])) {
		                    if (typeof (currValue) == "object") {
		                        for (var k = 0; k < currValue.length - 1; k++)
		                            if (_text == currValue[k].trim())
		                                dval.push(_text);
		                        dval = this._removeDuplicateVal(dval);
                                this._hiddenInput.val(dval);
		                    }
		                    else if (_text == currValue) {
		                        this._hiddenInput.val(_text);
		                    }
		                }
		                totalValue.push(_text);
		            }
		            if (typeof (currValue) != "object" && totalValue.indexOf(currValue) == -1) this._hiddenInput.val(currValue);
		        }
		    },
        
        _checkNameAttr: function () {			
           this.model.name = this.element.attr("name") != null ? this.element.attr("name") : (this.model.name != null ? this.model.name : this.element[0].id);
           this.element.attr("name", this.model.name);
        },

        _disabled: function (boolean) {
            if (boolean) this.disable();
            else this.enable();
        },

        _destroyDropdown: function () {
            this.dropdownbutton.off("mousedown", $.proxy(this._OnDropdownClick, this));
            this.dropdownbutton.remove();
            this.dropdownbutton = null;
            this.container.removeClass("e-padding");
        },

        _validateDelimiter: function (deli) {
           if ($.trim(deli).length == deli.length || deli.length != null) {
                var RegEx = /^[a-zA-Z0-9]+$/;
                if (!RegEx.test(deli)) return deli;
            }
            return ",";
        },

        _checkWatermarkSupport: function () {
            return 'placeholder' in document.createElement('input');
        },
        _setWatermark: function () {
            if ((this.model.watermarkText && (this.value() == ""|| ej.isNullOrUndefined(this.value()))) || (this.model.multiSelectMode != "visualmode"))
                this.element.attr("placeholder", this.model.watermarkText).width("");
        },
        _setWatermarkTxt: function () {
            if (this.model.watermarkText != null && $.trim(this.element.val()) == "" && (this.model.multiSelectMode != "visualmode" || $.trim(this._hiddenInput.val()) == "")) {
                var watermark = (this.model.watermarkText != null) ? this.model.watermarkText : this._localizedLabels.watermarkText;
                this._hiddenSpan.css("display", "block").text(watermark);
            }
        },

        _renderSuggestionList: function () {
            var oldWrapper = $("#" + this.element[0].id + "_suggestion").get(0);
            if (oldWrapper)
                $(oldWrapper).remove();
            this.suggestionList = ej.buildTag("div.e-atc-popup e-popup e-widget e-box " + this.model.cssClass + "#" + this.target.id + "_suggestion", "", { "display": "none" }).attr("role", "listbox");
            this.element.attr("aria-owns", this.target.id + "_suggestion");
            this.popup = this.suggestionList;
            var scrollerDiv = ej.buildTag("div");
			if(this.model.multiColumnSettings.enable) {
				this._tableColumn = ej.buildTag("table","", {"border": 0, "padding": 0, "border-spacing": 0}, { "role": "listbox", "class" : "e-atc-tableContent" });
				this._listEventBind(this._tableColumn,"tr");
                this._headerColGroup = document.createElement("colgroup");				
				if(this.model.multiColumnSettings.showHeader) {
				this._tableHeaderDiv = ej.buildTag("div",{},{},{"class":"e-atc-tableHeader "+((this.model.enableRTL)? "e-atc-tableHeaderRTL" : "e-atc-tableHeaderScroll")});
				var headerDiv = ej.buildTag("div",{},{},{"class":"e-atc-tableHeaderContent e-atc-tableHeaderBorder"}); 
				var tr = document.createElement("tr");
				this._tableHeader = ej.buildTag("table" , "" ,{"border-spacing": "0.25px"},{});
									
                for (var z = 0, length = this.model.multiColumnSettings.columns.length; z < length; z++) {
					$(tr).append( ej.buildTag("th" , (this.model.multiColumnSettings.columns[z].headerText ? this.model.multiColumnSettings.columns[z].headerText : "column"+z) , {"text-align":(this.model.multiColumnSettings.columns[z].headerTextAlign ? this.model.multiColumnSettings.columns[z].headerTextAlign:"left")}, {"class":((z == this.model.multiColumnSettings.columns.length - 1) ? "" :(this.model.enableRTL ? "e-atc-thleft" : "e-atc-thright"))}) );
				    $(this._headerColGroup).append(document.createElement("col"));
				}
				$(this._tableHeaderDiv).append($(headerDiv).append($(this._tableHeader).append(tr).append(this._headerColGroup)));
				this.suggestionList.append(this._tableHeaderDiv);
				}
				else {
                    for (var z = 0, length = this.model.multiColumnSettings.columns.length; z < length; z++)
                        $(this._headerColGroup).append(document.createElement("col"));
					this._tableColumn.append(this._headerColGroup);
				}
				var scrollerParent = ej.buildTag("div");
				scrollerParent.append(this._tableColumn);
				scrollerDiv.append(scrollerParent);
			}
			else {
                this.ul = ej.buildTag("ul.e-ul").attr("role", "listbox");
				this._listEventBind(this.ul,"li:not('.e-category')");
				scrollerDiv.append(this.ul);
			}
            this.suggestionList.append(scrollerDiv);
            $('body').append(this.suggestionList);
            this._setListWidth();
            this._setListHeight();
			if(this.model.multiColumnSettings.enable) {
				scrollerDiv.ejScroller({ height: 0, width: 0, scrollerSize: 20 });
            this.scrollerObj = scrollerDiv.ejScroller("instance");
			}
			else {
            this.suggestionList.ejScroller({ height: 0, width: 0, scrollerSize: 20 });
            this.scrollerObj = this.suggestionList.ejScroller("instance");
				}
        },

		_listEventBind: function (element,target) {
			element.on({
					mouseenter: $.proxy(this._OnMouseEnter, this),
					mouseleave: $.proxy(this._OnMouseLeave, this),
					click: $.proxy(this._OnMouseClick, this)
				}, target);
		},
		
        _checkEmptyList: function () {
            if (this.model.multiSelectMode == "visualmode") this._removeRepeated();
            if (this.suggestionListItems.length == 0) {
                this.suggestionListItems.push(this.model.emptyResultText);
                this.noresult = true;
            }
            else this.noresult = false;
        },
        _showSuggestionList: function (e) {
            this.suggestionListItems = this.model.enableDistinct ? ej.dataUtil.distinct(this.suggestionListItems, (typeof this.suggestionListItems[0] != "object" ? "" : (this.model.fields && this.model.fields.text) ? this.model.fields["text"] : "text"), true) : this.suggestionListItems;
            if(this.model.itemsCount > 0) this.suggestionListItems = ej.DataManager(this.suggestionListItems).executeLocal(ej.Query().take(this.model.itemsCount));
            this._checkEmptyList();
            this._addNewTemplate = null;
            if (this.noresult && this.model.multiSelectMode == "visualmode" && this.model.allowAddNew && this.element.val() != "" && !this._repeatRemove ) {
                this.noresult = false;
                this.suggestionListItems.pop();
                this._addNewTemplate = "   (" + this.model.addNewText + ")";
                this.suggestionListItems.push(this.element.val() + this._addNewTemplate);
                this._checkEmptyList();
            }

            if (!this.noresult || this.model.showEmptyResultText)
                this._generateSuggestionList(e);
        },

        _generateSuggestionList: function (e) {
            var list = this.suggestionListItems, i, suggList = [];
            (!this.model.multiColumnSettings.enable) ? this.ul.empty() : this._tableColumn.empty() && this.model.multiColumnSettings.showHeader && this._tableHeaderDiv.css("display", "");
            var _proxy = this;
            var fragmentParent = document.createDocumentFragment();
            if (typeof list[0] != "object") {
                if (_proxy.model.multiColumnSettings.enable) {
					var tbodyEle = ej.buildTag("tbody"); 
                    var trColumnEle = ej.buildTag("tr").attr("role", "option").attr((_proxy._isIE8) ? { 'unselectable': 'on' } : {});
                    var tdEle = ej.buildTag("td", {}, {}, { "role": "option" });
                    for (var i = 0, listLength = list.length; listLength > i; i++) {
                        var _txt = (_proxy.model.highlightSearch && !_proxy.noresult) ? _proxy._highlightSuggestion(list[i]) : list[i];
                        var trColumn = trColumnEle.clone();
                        var td = tdEle.clone()
                         $(td).attr((_proxy._isIE8) ? { 'unselectable': 'on' } : {}).attr((list[i] != (list.length - 1)) ? { "class": "e-atc-tdbottom" } : {}).html(_txt);
                        trColumn[0].appendChild(td[0]);
						tbodyEle[0].appendChild(trColumn[0]);
                        fragmentParent.appendChild(tbodyEle[0]);
                        _proxy.model.showEmptyResultText && _proxy.model.emptyResultText == _txt && _proxy.model.multiColumnSettings.showHeader && _proxy._tableHeaderDiv.css("display", "none") && $(td).removeClass("e-atc-tdbottom");
                        
                        if ((_proxy._addNewTemplate) && !ej.isNullOrUndefined(_proxy._tableHeaderDiv))
                            _proxy._tableHeaderDiv.css("display", "none");
                    }
                    _proxy._tableColumn[0].appendChild(fragmentParent);
                }
                else {
                    var liEle = ej.buildTag("li", {}, {}, { "role": "option" }).attr((_proxy._isIE8) ? { 'unselectable': 'on' } : {})
                    for (var i = 0, listLength = list.length; listLength > i; i++) {
                        var _txt = (_proxy.model.highlightSearch && !_proxy.noresult) ? _proxy._highlightSuggestion(list[i]) : list[i];
                        var li = liEle.clone();
                        li[0].innerHTML=_txt;
                        fragmentParent.appendChild(li[0])
                    }
                    _proxy.ul[0].appendChild(fragmentParent);
                }
                this._currList = list;
                this._mapper = { txt: null, key: null };
            }
            else {
                var mapper = this.model.fields, mapFld = { _key: null, _text: null, _attr: null };
                mapFld._key = (mapper && mapper.key) ? mapper["key"] : "key";
                mapFld._text = (mapper && mapper.text) ? mapper["text"] : "text";
                mapFld._attr = (mapper && mapper.htmlAttributes) ? mapper["htmlAttributes"] : "htmlAttributes";
                this._mapper = { txt: mapFld._text, key: mapFld._key }, this._currList = [];
                if (this.model.fields.groupBy) {
                    var mapCateg = (mapper && mapper.groupBy) ? mapper["groupBy"] : "groupBy", groupedList, _query;
                    _query = ej.Query().group(mapCateg);
                    this._addSortingQuery(_query, "key");
                    groupedList = ej.DataManager(list).executeLocal(_query);
                    this._swapUnCategorized(groupedList);
                    groupedList.forEach(function (each, i) {
                        if (each.key)
                            if (_proxy.model.multiColumnSettings.enable) {
                                var trColumn = ej.buildTag("tr.e-category").attr("role", "option").attr((_proxy._isIE8) ? { 'unselectable': 'on' } : {});
                                trColumn.append(ej.buildTag("td", each.key).attr("role", "option").attr((_proxy._isIE8) ? { 'unselectable': 'on' } : {}).attr((i != (list.length - 1)) ? { "class": "e-atc-tdbottom" } : {}));
                                _proxy._tableColumn.append(trColumn);
                            }
                            else _proxy.ul.append(ej.buildTag("li.e-category", each.key).attr("role", "option").attr((_proxy._isIE8) ? { 'unselectable': 'on' } : {}));
                        _proxy._generateLi(each.items, mapFld);
                    });
                }
                else this._generateLi(list, mapFld);
            }
            for (var i = 0, listLength = list.length; listLength > i; i++) {
                if (this.model.multiColumnSettings.enable) {
                    var data = this._textFormateString(this._currList[i]);
                    if (data == this.value()) {
                        var activeText = this._getLiTags()[i];
                        $(activeText).addClass('e-activeli');
                    }
                }
                else {
                    var value = this.value().split(this.model.delimiterChar);
                    for (var k = 0; k <= value.length; k++) {
                        if (this._currList[i] == value[k]) {
                            var activeText = this._getLiTags()[i];
                            $(activeText).addClass('e-activeli');
                        }
                    }
                }
            }
            if (this._getLiTags().length > 0) {
				this._showResult(e);
			}

        },

        _swapUnCategorized: function (list) {
            var length = list.length;
            for (var i = 0; i < length; i++) {
                if (!list[i].key) {
                    for (var j = i; j > 0; j--) {
                        list[j] = list[j - 1];
                    }
                    list[j] = list[i];
                    return false;
                }
            }
        },

        _generateLi: function (list, mapFld) {
            var _proxy = this;
            var fragmentParent = document.createDocumentFragment();
            var fragment = document.createDocumentFragment();
            if (_proxy.model.multiColumnSettings.enable) {
                var multiColumnLength = _proxy.model.multiColumnSettings.columns.length;
                this._tableColumn.append(ej.buildTag("tbody"));
                var trEle = ej.buildTag("tr");
                var tdEle = ej.buildTag("td");
                for (var j = 0, listLength = list.length; listLength > j; j++) {
                    var _text = this._getField(list[j],mapFld._text);
                    var _key = this._getField(list[j],mapFld._key);
                    if (!ej.isNullOrUndefined(_text) || _proxy.model.multiColumnSettings.enable) {
                        var fieldAttr = _proxy._getField(list[j]);
                        var tr = trEle.clone();
                        tr[0].className = (j % 2) ? "e-atc-trbgcolor" : "";
                        for (var z = 0; z < multiColumnLength; z++) {
                            var td = tdEle.clone();
                            if(this.model.multiColumnSettings.searchColumnIndices.length !=0)
                            td[0].innerHTML = (_proxy.model.highlightSearch && $.inArray(z, _proxy._searchColumnIndex) > -1) ? _proxy._highlightSuggestion(_proxy._getField(list[j], _proxy.model.multiColumnSettings.columns[z].field).toString()) : _proxy._getField(list[j], _proxy.model.multiColumnSettings.columns[z].field);
                            else
                                td[0].innerHTML = (_proxy.model.highlightSearch && $.inArray(z.toString(), _proxy._columnIndex) > -1) ? ((!ej.isNullOrUndefined(_proxy._getField(list[j], _proxy.model.multiColumnSettings.columns[z].field))) ? _proxy._highlightSuggestion(_proxy._getField(list[j], _proxy.model.multiColumnSettings.columns[z].field).toString()) : _proxy._highlightSuggestion("")) : _proxy._getField(list[j], _proxy.model.multiColumnSettings.columns[z].field);
                            td[0].className = (((j != (list.length - 1)) ? "e-atc-tdbottom " : "") + ((z != (_proxy.model.multiColumnSettings.columns.length - 1)) ? ((_proxy.model.enableRTL) ? "e-atc-tdleft " : "e-atc-tdright ") : ""))+(_proxy.model.multiColumnSettings.columns[z].cssClass ?_proxy.model.multiColumnSettings.columns[z].cssClass:"" );
                            td[0].style.textAlign = (_proxy.model.multiColumnSettings.columns[z].textAlign ? _proxy.model.multiColumnSettings.columns[z].textAlign:"left");
							fragment.appendChild(td[0])
                        }
                        tr[0].appendChild(fragment);
                        if (_key)
                            tr.attr("id", _key);
                        _proxy._setAttributes(_proxy._getField(list[j], mapFld._attr), tr[0]);
                        fragmentParent.appendChild(tr[0]);
                        _proxy._currList = _proxy._currList.concat([list[j]]);
                    }
                }
                $(_proxy._tableColumn).find("tbody")[0].appendChild(fragmentParent);
            }
            else {
				var liEle= $("<li></li>");
                for (var j = 0, listLength = list.length; listLength > j; j++) {
                    var _text = this._getField(list[j],mapFld._text);
                    var _key = this._getField(list[j],mapFld._key);
                    if (!ej.isNullOrUndefined(_text)) {
                        if (_proxy.model.highlightSearch) _text = _proxy._highlightSuggestion(_text);
                        if (_proxy.model.template) _text = _proxy._getTemplatedString(list[j], mapFld._text, _text);
                        var li = liEle.clone();
                        li[0].innerHTML += _text;
                        if (_key)
                             li[0].setAttribute("id", _key);
                        _proxy._setAttributes(_proxy._getField(list[j], mapFld._attr), li[0]);
                        fragmentParent.appendChild(li[0]);
                        _proxy._currList = _proxy._currList.concat([list[j]]);
                    }
                }
                _proxy.ul[0].appendChild(fragmentParent);
            }

        },

        _getLiTags: function () {
            return (!this.model.multiColumnSettings.enable) ? this.ul.children("li:not('.e-category')") :this._tableColumn.find("tbody tr:not('.e-category')") ;
        },

        _getTemplatedString: function (list, searchLabl, searchTxt) {
            var str = this.model.template, start = str.indexOf("${"), end = str.indexOf("}");
            while (start != -1 && end != -1) {
                var content = str.substring(start, end + 1);
                var field = content.replace("${", "").replace("}", "");
                var replace = this._getField(list, field);
                // if highlightSearch is enabled, it replaces the highlighted search text
                if (searchLabl == field) replace = searchTxt;
                if (!replace) replace = "";
                str = str.split(content).join(replace);
                start = str.indexOf("${"), end = str.indexOf("}");
            }
            return str;
        },

        _getField: function (obj, fieldName) {
            return ej.pvt.getObject(fieldName, obj);
        },

        _setAttributes: function (data, element) {
            if (data) {
                if (typeof data == "string")
                    data = $.parseJSON(data);
                for (var key in data)
                    element.setAttribute(key, data[key]);
            }
        },

        _setListWidth: function () {
            var width = this.model.popupWidth;
            if (width && width != "auto") this.suggestionList.css({ "width": width });
            else this.suggestionList.css({ "width": this.wrapper.width() });
        },

        _setListHeight: function () {
            this.suggestionList.css({ "max-height": this.model.popupHeight });
        },

        _refreshPopup: function () {
            if (this.model.popupWidth == "auto" && Math.floor(this.wrapper.outerWidth()) != Math.floor(this.suggestionList.outerWidth())) {
                this.suggestionList.css({ "width": this.wrapper.width() });
                this._refreshScroller();
            }
            this._setListPosition();
        },

        _showResult: function (e) {
            this._refreshScroller();
            this._refreshPopup();
            if (this._isOpened)
                $(document).on("mousedown", $.proxy(this._OnDocumentClick, this));
            else {
                this.suggestionList.css("display", "none");
                var tis = this;
                clearTimeout(this._typing);
                this._typing = setTimeout(function () {
                    tis.suggestionList[(tis.model.animateType == "slide" ? "slideDown" : "fadeIn")]((tis.model.animateType == "none" ? 0 : 300), function () {
                        $(document).on("mousedown", $.proxy(tis._OnDocumentClick, tis));
                    });
                }, this.model.delaySuggestionTimeout);
                var args = (e != undefined) ? { event: e, isInteraction: true } : { isInteraction: false };
                this._trigger("open", args);
                this.wrapper.addClass("e-active");
            }

            this._isOpened = true;
            this.showSuggestionBox = true;
            var _suggestionListItems = this._getLiTags();
            this._listSize = _suggestionListItems.length;


            $(window).on("resize", $.proxy(this._OnWindowResize, this));
            var scrObj = ej.getScrollableParents(this.wrapper);
            if (scrObj[0] != window)
                this._on(scrObj, "scroll", this._hideResult);
        },

        _hideResult: function (e) {
            if (this.showSuggestionBox) {
                this.showSuggestionBox = false;
                this._activeItem = 0;
                clearTimeout(this._hiding);
                this.element.attr("aria-expanded", false);
                var proxy = this;
                if (this._isOpened) {
                    this.suggestionList.css("display", "none");
                    var args = (e != undefined) ? { event: e, isInteraction: true } : { isInteraction: false };
                    this._trigger("close", args);
                }
                else {
                    this._hiding = setTimeout(function () {
                        if( proxy.model ) proxy.suggestionList[(proxy.model.animateType == "slide" ? "slideUp" : "fadeOut")]((proxy.model.animateType == "none" ? 0 : 100));
                         proxy._activeItem = 0;
                    }, this.model.delaySuggestionTimeout);
                }
                $(document).off("mousedown", $.proxy(this._OnDocumentClick, this));
                $(window).off("resize", $.proxy(this._OnWindowResize, this));
                this._off(ej.getScrollableParents(this.wrapper), "scroll", this._hideResult);
                this.wrapper.removeClass("e-active");
            }
        },

        _refreshScroller: function () {
            this.suggestionList.css("height", "auto");
            this.suggestionList.find(".e-content , .e-scroller").removeAttr("style");
            
			if(this.model.multiColumnSettings.enable && this.model.multiColumnSettings.showHeader) {
			$(this._tableColumn).css("width" ,"auto");
			$(this._tableHeader).css("width" ,"auto");
			}
            this.suggestionList.css("display", "block");
			if(this.model.multiColumnSettings.enable) {
				this.scrollerObj.option("height","auto");
				this._columnBorderAlign();
			}
            var _suggestHeight = this.suggestionList.height() > (parseInt($.isNumeric(this.model.popupHeight) ? this.model.popupHeight : this.model.popupHeight.replace("px", "")) - 4);
            if ( _suggestHeight || (this.model.multiColumnSettings.enable && (( this.suggestionList.height() <= this._tableColumn.height() )|| ( this.suggestionList.width() <= this._tableColumn.width() || (this.model.multiColumnSettings.showHeader && this.suggestionList.width() <= this._tableHeader.width()) )))){
                if( _suggestHeight ) this.scrollerObj.model.height = (this.model.multiColumnSettings.showHeader && this._tableHeader) ? parseInt(this.suggestionList.height()) - parseInt(this._tableHeader.height()) : this.suggestionList.height();
                if(!this.model.multiColumnSettings.enable && this.suggestionList.width() < this.suggestionList.find(".e-ul").width())  this.suggestionList.find(".e-ul").width(this.suggestionList.find(".e-ul").width());
				this.scrollerObj.model.width = this.suggestionList.width();
                this.scrollerObj.refresh();
                this.scrollerObj.option({"enableRTL" : this.model.enableRTL , "scrollTop": 0 , "scrollLeft" : 0 });
				if(this.model.multiColumnSettings.enable && this.model.multiColumnSettings.showHeader) this._addThBorder();
                this.suggestionList.addClass("e-scroller")
				if(!this.scrollerObj._vScroll && this.model.multiColumnSettings.enable && this.model.multiColumnSettings.showHeader) this._removeThBorder();
            }
            else {
				this.scrollerObj.setModel({height:"auto", width:this.suggestionList.width()});
				this.scrollerObj.refresh();
				if(this.model.multiColumnSettings.enable && this.model.multiColumnSettings.showHeader) this._removeThBorder();
			}
            this.suggestionList.css("height", "auto");
            if (this._isIE8)
                this.suggestionList.find('.e-vscroll div, .e-hscroll div').attr("unselectable", "on");
			if(this.model.multiColumnSettings.enable && this.model.multiColumnSettings.showHeader) {
		    this.suggestionList.find(".e-content").scroll(ej.proxy(function (e) {
                    this._tableHeader.parent(".e-atc-tableHeaderContent").scrollLeft($(e.currentTarget).scrollLeft());
            }, this));
			if(this.suggestionList.find(".e-content").length > 0) this._tableHeader.parent(".e-atc-tableHeaderContent").scrollLeft(this.model.enableRTL ?  this.suggestionList.find(".e-content")[0].scrollWidth - this.suggestionList.find(".e-content")[0].clientWidth : 0);
			}
        },
		
		_columnBorderAlign : function (){
			if (this.model.multiColumnSettings.enable && this.model.multiColumnSettings.showHeader && this._tableHeaderDiv.css("display") != "none") {
				this._tableWid = (this._tableHeader.outerWidth() > this._tableColumn.outerWidth() ) ? this._tableHeader.outerWidth() : this._tableColumn.outerWidth(); 
				this._tableColumn.find("colgroup").remove();
				$(this._headerColGroup.children).removeAttr("style");
                for (var z = 0, length = this._headerColGroup.children.length; z < length; z++) {
					$(this._headerColGroup.children[z]).css({"width": ( parseInt($(this._tableColumn).find("tr:first td").eq(z).outerWidth()) > parseInt(this._tableHeader.find("tr:first th").eq(z).outerWidth() ) ? $(this._tableColumn).find("tr:first td").eq(z).outerWidth() : this._tableHeader.find("tr:first th").eq(z).outerWidth()) });
				}
				this._tableColumn.append($(this._headerColGroup).clone());
				var wid = (this._tableWid > this.suggestionList.width()) ? this._tableWid : "100%" ;
				$(this._tableColumn).css("width" , wid );
				$( this._tableHeader ).css("width" , wid);
			}
			else if (this.model.multiColumnSettings.enable && !this.model.multiColumnSettings.showHeader ) {
				$(this._tableColumn).css("width" , "auto" );
				this._tableWid = this._tableColumn.outerWidth(); 
				$(this._headerColGroup.children).removeAttr("style");
				var wid = (this._tableWid > this.suggestionList.width()) ? this._tableWid : "100%" ;
				if(wid != "100%") {
                    for (var z = 0, length = this._headerColGroup.children.length; z < length; z++) {
						$(this._headerColGroup.children[z]).css({"width": $(this._tableColumn).find("tr:first td").eq(z).outerWidth() });
					}
					this._tableColumn.append(this._headerColGroup);
				}
				$(this._tableColumn).css("width" , wid );
			}	
			else $(this._tableColumn).css("width","100%");
		},

		_removeThBorder: function(){
			this._tableHeader.parents(".e-atc-tableHeader").removeClass((this.model.enableRTL)? "e-atc-tableHeaderRTL" : "e-atc-tableHeaderScroll");
			this._tableHeader.parent(".e-atc-tableHeaderContent").removeClass("e-atc-tableHeaderBorder");
		},
		
		_addThBorder: function(){
			this._tableHeader.parents(".e-atc-tableHeader").addClass((this.model.enableRTL)? "e-atc-tableHeaderRTL" : "e-atc-tableHeaderScroll").removeClass((this.model.enableRTL)? "e-atc-tableHeaderScroll" : "e-atc-tableHeaderRTL");
			this._tableHeader.parent(".e-atc-tableHeaderContent").addClass("e-atc-tableHeaderBorder");
		},
        _setListPosition: function () {
            var elementObj = this.wrapper, pos = this._getOffset(elementObj), winWidth,
            winBottomHeight = $(document).scrollTop() + $(window).height() - (pos.top + $(elementObj).outerHeight()),
            winTopHeight = pos.top - $(document).scrollTop(),
            popupHeight = this.suggestionList.outerHeight(),
            popupWidth = this.suggestionList.outerWidth(),
            left = pos.left,
            totalHeight = elementObj.outerHeight(),
            border = (totalHeight - elementObj.height()) / 2,
            maxZ = this._getZindexPartial(), popupmargin = 3,
            topPos = ((popupHeight < winBottomHeight || popupHeight > winTopHeight) ? pos.top + totalHeight + popupmargin : pos.top - popupHeight - popupmargin) - border;
            winWidth = $(document).scrollLeft() + $(window).width() - left;
            if (this.model.enableRTL || popupWidth > winWidth && (popupWidth < left + elementObj.outerWidth())) left -= this.suggestionList.outerWidth() - elementObj.outerWidth();
            this.suggestionList.css({
                "left": left + "px",
                "top": topPos + "px",
                "z-index": maxZ
            });
        },
        _getOffset: function (ele) {
            return ej.util.getOffset(ele);
        },

        _getZindexPartial: function () {
            return ej.util.getZindexPartial(this.element, this.suggestionList);
        },

        _targetFocus: function (e) {
            var minWidth = 30;  //  minimum width for textbox in visualmode
            if (this.model.multiSelectMode == "visualmode")
                this._setWatermarkWidth(minWidth);
            if (!this._isWatermark)
                this._hiddenSpan.css("display", "none");
            this.wrapper.addClass("e-focus");
			this._focusValue = this.model.value;
            this._isFocused = true;
            this._trigger("focusIn", { event: e, isInteraction: true, value: this.value() });
        },
        _focusOutAction: function (e) {
			var currValue = this.model.multiSelectMode == "visualmode" ? this._modelValue : this.element.val();	
            this._isFocused = false;
            this.wrapper.removeClass("e-focus");
            if (ej.isNullOrUndefined(this.model.fields["key"])) {
                if (this.model.multiSelectMode == "none") {
                    var data = this.model.dataSource;
                    if (ej.DataManager && data instanceof ej.DataManager) this._loadInitData();
                    else this._setHiddenkeyByValue(data);
                }
                else this._hiddenInput.val(currValue);
            }
			if (this._focusValue != this.model.value){  
			   if(this._hiddenInput.val() == "")
                   this._hiddenInput.val(currValue);			
			this._changeEvtTrigger(currValue, e); }
			else
			     return false;
            if (this.model.showPopupButton) this.dropdownbutton.removeClass('e-active');
            !this._isWatermark && this._setWatermarkTxt();
            this._removeSelection();
			if(this.model.multiSelectMode == "visualmode" && this.model.showResetIcon && this.element.val() != "")
				this._removeReset();
            if (this.model.multiSelectMode == "visualmode") {
                this._removeActive();
                this.element.val("");
                this._setWatermarkWidth(1);
                this._preVal = "";
                this._addNewTemplate = null;
            }
            else {
                if (this.model.multiSelectMode == "delimiter") 
                        this._valueChange(e);
                this._updateSelectedItemArray(this.getValue());
            }
		    if(!ej.isNullOrUndefined(this.value()) && this.value()!="")
			{
				var values = this.value().split(this.model.delimiterChar);
				if(this.model.multiSelectMode == "delimiter" || this.model.multiSelectMode == "none" )
				{
					var result = this._removeDuplicateVal(values); 
					this._keyProcess(result);
				}
			}
			if(this.element.val() == "" && (this.value() == "" || this.value() == null))
				this._selectValueByKey(null);
        },
        _targetBlur: function (e) {
            this._focusOutAction(e);
            this._trigger("focusOut", { event: e, isInteraction: true, value: this.value() });
        },
        _setWatermarkWidth: function (width) {
            this.model.watermarkText && this.element.attr('placeholder') ? this.element.width("") : this.element.val("").width(width);
        },
        _checkDeli: function () {
            var val = this.element.val(), deli = this.model.delimiterChar, last = val.substr(val.length - deli.length, val.length);
            if (last == deli) {
                this.element.val(val.substr(0, val.length - deli.length));
                return true;
            }
            else return false;
        },
        _removeSelection: function () {
            if (this.model.enableAutoFill) {
                this.element.attr("aria-autocomplete", "both");
                var selection = this._getCaretSelection();
                if (selection.end - selection.start != 0 && selection.end - selection.start != this.element.val().length)
                    this.target.value = this.target.value.substr(0, selection.start);
            }
        },

        _removeListHover: function () {
            this._getLiTags().removeClass("e-hover");
        },

        _addListHover: function () {
            var activeItem = $(this._getLiTags()[this._activeItem - 1]);
            activeItem.addClass("e-hover");
            this.scrollerObj.setModel({ "scrollTop": this._calcScrollTop() });
            activeItem.focus();
        },

        _calcScrollTop: function () {
            var ulH = (this.model.multiColumnSettings.enable) ? ((this.model.multiColumnSettings.showHeader) ? this._tableColumn.outerHeight() + this._tableHeader.outerHeight()  : this._tableColumn.outerHeight() ): this.ul.outerHeight() , li = (!this.model.multiColumnSettings.enable) ? this.ul.find("li") : this._tableColumn.find("tr"), liH = 0, index, top, i;
            index = (!this.model.multiColumnSettings.enable) ? this.ul.find("li.e-hover").index() : this._tableColumn.find("tr.e-hover").index();
            liH = li.eq(1).outerHeight() * index;
            top = liH - ((((this.model.multiColumnSettings.enable) ? this._tableColumn.parent().outerHeight() : this.suggestionList.outerHeight()) - li.eq(index).outerHeight()) / 2);
            return top;
        },

        getActiveText: function () {
			if (this._activeItem > 0) {
				if(this.model.multiColumnSettings.enable) return this._textFormateString(this._currList[this._activeItem -1 ])
				else if (!ej.isNullOrUndefined(this._mapper) && this._mapper.txt) return this._getField(this._currList[this._activeItem - 1], this._mapper.txt);			
				else  return  this._currList[this._activeItem  - 1];
			}
        },

        _getUniqueKey: function () {
            var key = null;
			if(!ej.isNullOrUndefined(this._mapper))
			{
			    if (this._mapper.key) key = this._getField(this._currList[this._activeItem - 1], this._mapper.key);
			    ej.isNullOrUndefined(key) && (key = null);
			}
            return key;
        },

        _setTextBoxValue: function () {
            if (this._activeItem && !this.noresult) {
                var currentValue, selection, val, text;
                currentValue = this.model.multiColumnSettings.enable ? this._textFormateString(this._currList[this._activeItem -1 ]) : this.getActiveText();
                selection = this._getCaretSelection();
                this.suggLen = selection.start;
                val = this.target.value.substr(0, this.suggLen);
                var _deliIndex = (this.target.value).lastIndexOf(this.model.delimiterChar);
				if(_deliIndex == -1) { var query = $.trim(val.substr(_deliIndex + 1, this.suggLen));}
               else				
				var query = $.trim(val.substr(_deliIndex + ((this.model.delimiterChar).length) ,this.suggLen));			
                if (val && (val.toLowerCase() == currentValue.substr(0, this.suggLen).toLowerCase() || query.toLowerCase() == currentValue.substr(0, this.suggLen -( _deliIndex + ((this.model.delimiterChar).length))).toLowerCase())) {
                    if (this.model.multiSelectMode == "delimiter") 
                        text = val + currentValue.substr(query.length, currentValue.length);            
                    else 
                        text = val + currentValue.substr(val.length, currentValue.length);
                    this.element.val(text);
                    this._autofilSelection();
                    if (this.model.multiSelectMode == "visualmode") {
						this._adjustWidth();
						if(this.model.enableAutoFill) this._refreshPopup();
					}
                    if (this.model.autoFocus && !this.noresult) this._addListHover();
                }
                else {
					if (this.model.multiSelectMode == "delimiter" && currentValue && query) this.element.val(this.element.val().replace(query,currentValue))
					else if (currentValue) this.element.val(currentValue)
					this._removeSelection();
				} 
            }
        },

        _enterTextBoxValue: function (e) {
            if (this._activeItem && !this.noresult && !this.model.readOnly) {
                var currentValue = this.getActiveText(), currItem = this._currList[this._activeItem - 1];
                this._preVal = currentValue + ((this.model.multiSelectMode == "delimiter") ? this.model.delimiterChar : "");
                this._valueToTextBox(currentValue, currItem, false);
                var currValue = this.model.multiSelectMode == "visualmode" ? this._modelValue : this.element.val() == "" ? null : this.element.val();
                this._trigger("select", { event: e, isInteraction: true, value: currValue, text: currentValue, key: this._getUniqueKey(), item: currItem });
                this._valueChange(e);
                if (this.model.showResetIcon) this._showReset();
            }
            this._isOpened && this._trigger("close", { event: e, isInteraction: true });
        },

        _createBox: function (value) {
            var span = ej.buildTag("span.e-icon e-close");
            var li = ej.buildTag("li.e-options", value).append(span);

            this._on(span, "click", function (e) {
                if (!this.model.enabled) return false;
                this._deleteBox($(e.target).parent());
            });
            return li;
        },

        _addLoadingClass: function () {
            if (this.model.showLoadingIcon)
                this.element.addClass("e-load");
        },

        _removeLoadingClass: function () {
            this.element.removeClass("e-load");
        },


        _highlightSuggestion: function (suggestion) {
            if ($.trim(this._queryString) != "") {
                var caseSensitive, tempQueryString, RegEx, mch, split, query, str;
                caseSensitive = this.model.caseSensitiveSearch ? "g" : "gi";
                query = $.trim(this._queryString);
                query = /^[a-zA-Z0-9- ]*$/.test(query) ? query : query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
                tempQueryString = this.model.filterType == "startswith" ? "^" + query : this.model.filterType == "endswith" ? query + "$" : query;
                RegEx = new RegExp(tempQueryString, caseSensitive);
                if (RegEx.test(suggestion)) {
                    mch = suggestion.match(RegEx);
                    //for IE-8 the regEx doesnt returns the empty string.So manually we replace string to return empty string.
                    str = suggestion.replace(RegEx, "~^");
                    split = str.split("~^");
                    suggestion = "";
                    for (var i = 0, splitlength = split.length; splitlength > i; i++)
                        suggestion += mch[i] ? split[i] + "<span class='e-hilight-txt'>" + mch[i] + "</span>" : split[i];
                }
            }
            return suggestion;
        },

        _RightToLeft: function (value) {
            if (value) {
                this.wrapper.addClass("e-rtl");
                this.suggestionList.addClass("e-rtl");
            }
            else {
                this.wrapper.removeClass("e-rtl");
                this.suggestionList.removeClass("e-rtl");
            }
			if(this.model.multiColumnSettings.enable && this.model.multiColumnSettings.showHeader) {
					this._tableHeaderDiv.removeClass( value ? "e-atc-tableHeaderRTL" : "e-atc-tableHeaderScroll" );
					this._tableHeader.find("tr :not(th:last)").addClass(value ? "e-atc-thleft" : "e-atc-thright").removeClass(value ? "e-atc-thright" : "e-atc-thleft" );
			}
        },

        _setRoundedCorner: function (value) {
            if (value) {
                this.container.addClass("e-corner");
                this.suggestionList.addClass("e-corner");
            }
            else {
                this.container.removeClass("e-corner");
                this.suggestionList.removeClass("e-corner");
            }
        },

        _checkReadOnly: function (value) {
            this.model.readOnly = value;
            if (this.model.readOnly) {
                this.element.attr({ "readonly": "readonly", "aria-readonly": true });
                this._off(this.element, "keydown", this._OnKeyDown);
                this._off(this.element, "keyup", this._OnKeyUp);
				this._off(this.element, "paste", this._OnPaste);
				this._off(this.element, "keypress", this._onkeyPress);
            }
            else {
                this.element.removeAttr("readonly aria-readonly");
                this._on(this.element, "keydown", this._OnKeyDown);
                this._on(this.element, "keyup", this._OnKeyUp);
			    this._on(this.element, "paste", this._OnPaste);
				this._on(this.element, "keypress", this._onkeyPress);
            }
        },
		_onkeyPress: function (e) {
			if(e.keyCode == 13) this._PreventDefaultAction(e);
		},
		_OnPaste: function (e) {
			var _proxy = this;
			setTimeout(function () {
				 _proxy._OnKeyUp(e);
				}, 0);
		},
        _OnKeyDown: function (e) {
            if (this.model.filterType != "startswith")
                this.model.enableAutoFill = false;

            switch (e.keyCode) {
                case 37:
                case 35:
                case 36:
                    this._removeSelection();
				case 13:
                case 39:
                    break;
                case 38:
                    if (this.showSuggestionBox && this.suggestionList) {
                        this._removeListHover();
                        if (this._activeItem > 1)
                            this._activeItem -= 1;
                        else
                            this._activeItem = this._listSize;
                        this._navigationHover();
                    }
                    this._PreventDefaultAction(e);
                    break;
                case 40:
                    if (this.showSuggestionBox && this.suggestionList) {
                        this._removeListHover();
                        if (this._activeItem < this._listSize)
                            this._activeItem += 1;
                        else
                            this._activeItem = 1;
                        this._navigationHover();
                    } else {
                        if (e.ctrlKey && this.element.val() == "") {
                            this._showFullList(e);
                        }
                        else if (e.ctrlKey) {
                            this._showSuggestionList(e);
                        }
                    }
                    this._PreventDefaultAction(e);
                    break;
				case 33: /* page up */
				case 34:
				    if (this.showSuggestionBox && this.suggestionList) {
						this._removeListHover();             
                        var suggestionH = (this.model.multiColumnSettings.enable) ? this._tableColumn.parent().height() : this.suggestionList.height();
                        var liH = (this.model.multiColumnSettings.enable) ? this._tableColumn.find("tr").outerHeight() : this.ul.children("li").outerHeight();
                        var activeItem = Math.round(suggestionH / liH) != 0 ? Math.round(suggestionH / liH) : this._listSize;
                        this._activeItem = (e.keyCode == 33) ? this._activeItem - activeItem :  this._activeItem + activeItem
						if( this._activeItem < 1) this._activeItem = 1;
						if(this._activeItem > this._listSize ) this._activeItem = this._listSize;
						this._navigationHover();
					}
                        this._PreventDefaultAction(e);
                        break;
                case 8:
                    if ($.trim(this.element.val()) == "") this._isOpened = false;
                    if (this.model.multiSelectMode == "visualmode" && this.element.val() == "") {
                        this._deleteLastBox();
                    }
                    break;
                case 17:
                    this.ctrlKeyPressed = true;
                    break;
                case 9:
                    if (this.showSuggestionBox) {
                        this._queryString = this.element.val();
                        this._enterTextBoxValue(e);
                        this._hideResult(e);
                        this._isOpened = false;
                        this._PreventDefaultAction(e);
                    }
                    break;
                case 27:
                    this._isOpened = false;
                    var _showSuggestionBox = this.showSuggestionBox;
                    this._hideResult(e);
                    this._PreventDefaultAction(e);
                    if (_showSuggestionBox) this._trigger("close", { event: e, isInteraction: true });
                    break;
            }
            if (this.model.multiSelectMode == "visualmode") {
                if (e.keyCode != 17 && e.keyCode != 8 && e.keyCode != 46) this._removeActive();
                this._adjustWidth();
            }
        },


        _PreventDefaultAction: function (e) {

            e.preventDefault();
            if (!this._cancelEvent) {
                e.stopPropagation();
                e.cancelBubble = true;
                e.returnValue = true;
            }

        },
        _bubbleEvent: function (cancelevent) {

            if (typeof cancelevent == "boolean")
                this._cancelEvent = cancelevent;
            return this._cancelEvent;
        },
        _navigationHover: function () {
			this._addListHover();
            if (this.model.enableAutoFill) {
                this.element.attr("aria-autocomplete", "both");
                this._queryString = this.target.value;
                this._setTextBoxValue();
            }
		},


        _OnKeyUp: function (e) {
            this._keyDownComplete(e);
            if (this.ctrlKeyPressed && e.type != "paste") {
                if (e.keyCode == 17)
                    this.ctrlKeyPressed = false;
                return false;
            }

            if ($.trim(this.element.val()) == "" && e.keyCode == 38 && e.keyCode == 40) {
                this._hideResult(e);
                return false;
            }
            if (!this._checkDelimiter()) return false;
            this._queryString = $.trim(this._queryString);

            switch (e.keyCode) {
				case 34:
				case 33:
                case 38:
                case 40:
                case 37:
                case 39:
                case 20:
                case 16:
                case 17:
                case 18:
                case 35:
                case 36:
                case 144:
                case 9:
                case 27: break;

                case 13:
                    e.preventDefault();
                    this._queryString = this.element.val();
                    this._enterTextBoxValue(e);
                    if (this.model.enableAutoFill) {
                        this.element.attr("aria-autocomplete", "both");
                        this.suggLen = this.element.val().length;
                        this._autofilSelection();
                    }
                    this._isOpened = false;
                    this._hideResult(e);
                    break;

                case 46:
                    if (this.model.multiSelectMode == "visualmode" && this.element.val() == "") {
                        this._deleteBox(this._ulBox.children("li.e-active"));
                        break;
                    }
                case 8:
                    if (this._queryString.length >= this.model.minCharacter) {
                        this._autoFill = false;
                        this._OnTextEnter(e);
                    }
                    else {
                        this.noresult = true;
                        this._hideResult(e);
                        if ($.trim(this.element.val()) == "") 
                            this._isOpened = false;
                    }
                    this._typed = true;
                    break;

                default:
                    if (this._queryString.length >= this.model.minCharacter) {
                        this._autoFill = true;
                        this._OnTextEnter(e);
                    }
                    else {
						this.noresult = true;
						this._isOpened = false;
					}
                    this._typed = true;
                    break;
            }
        },

        _getFilteredList: function (list, e) {
            clearTimeout(this.timeDelay);
            if (!ej.isNullOrUndefined(list) && typeof list[0] == "object") {
                var bindTo = (this.model.fields.text) ? this.model.fields["text"] : "text";
                if ( this.model.actionFailure && ej.isNullOrUndefined((ej.DataManager(list).executeLocal(ej.Query().select(bindTo))[0])) )
                    this._trigger("actionFailure", { error: this._localizedLabels["actionFailure"] });
            }
            if (!list || !list.length || list.length < 1) {
                this.suggestionListItems = [];
                if (this.model.actionFailure) this._trigger("actionFailure", { error: this._localizedLabels["actionFailure"] });
            }
            else {
                var tempQuery = ej.Query();
                this._addQuery(tempQuery, typeof list[0] == "object");
                this.suggestionListItems = ej.DataManager(list).executeLocal(tempQuery);
                if (this.model.actionSuccess) this._trigger("actionSuccess");
            }
            this._doneRemaining(e);
            if (this.model.actionComplete)
                this._trigger("actionComplete");
        },

        _performSearch: function (e) {
            if (this.model.actionBegin)
                this._trigger("actionBegin");
            var source = this.model.dataSource;
            if (ej.DataManager && source instanceof ej.DataManager) {
                if (!source.dataSource.offline && !(source.dataSource.json && source.dataSource.json.length > 0)) {
                    window.clearTimeout(this.timer);
                    var proxy = this;
                    this.timer = window.setTimeout(function () {
                        proxy._fetchRemoteDat(source);
                    }, 700);
                }
                else {
					this._getFilteredList(source.dataSource.json, e);
					this._selectedObj.push(source.dataSource.json);
				}
            }
            else this._getFilteredList(source, e);
        },

        _fetchRemoteDat: function (source) {
            var proxy = this, queryPromise, tempQuery = this._getQuery();
            this._addQuery(tempQuery, true);
            queryPromise = source.executeQuery(tempQuery);
            queryPromise.fail(function (e) {
                proxy.suggestionListItems = null;
                proxy._removeLoadingClass();
                proxy._trigger("actionFailure", e);
            }).done(function (e) {
                proxy.suggestionListItems = e.result;
				if(proxy.model.multiSelectMode == "none")
					proxy._selectedObj = e.result;
				else if(proxy.model.multiSelectMode == "delimiter")
					proxy._selectedObj = proxy._selectedObj.concat(e.result);
                proxy._doneRemaining(e);
                proxy._trigger("actionSuccess", e);
            }).always(function (e) {
                proxy._trigger("actionComplete", e);
            });
        },

        _addSortingQuery: function (query, key) {
            if (this.model.allowSorting) {
                var order = (this.model.sortOrder == "descending") ? true : false;
                query.sortBy(key, order);
            }
        },

        _addQuery: function (_query, checkMapper) {
            var bindTo = "";
            var predicate, index;
			this._predicates =[];
            if (checkMapper) {
                var mapper = this.model.fields;
                bindTo = (mapper && mapper.text) ? mapper["text"] : "text";
            }
			if (this._queryString) {
            if (this.model.multiColumnSettings.enable) {
				this._columnsIndex();
				if (checkMapper) {
                    var bindTo = [];
                    if(this.model.multiColumnSettings.searchColumnIndices.length !=0){
				    for (var i = 0, length = this._searchColumnIndex.length; i < length; i++) {
				        bindTo.push(this.model.multiColumnSettings.columns[this._searchColumnIndex[i]].field);
				        predicate = this._predicateConvertion(predicate, this.model.multiColumnSettings.columns[this._searchColumnIndex[i]].field, (this.model.multiColumnSettings.columns[this._searchColumnIndex[i]].filterType ? this.model.multiColumnSettings.columns[this._searchColumnIndex[i]].filterType : this.model.filterType), this._queryString, !this.model.caseSensitiveSearch, (this.model.multiColumnSettings.columns[this._searchColumnIndex[i]].type ? this.model.multiColumnSettings.columns[this._searchColumnIndex[i]].type : "string"));
                    }
                }
                else{
                    for (var i = 0, length = this._columnIndex.length; i < length; i++) {
				        bindTo.push(this.model.multiColumnSettings.columns[this._columnIndex[i]].field);
				        predicate = this._predicateConvertion(predicate, this.model.multiColumnSettings.columns[this._columnIndex[i]].field, (this.model.multiColumnSettings.columns[this._columnIndex[i]].filterType ? this.model.multiColumnSettings.columns[this._columnIndex[i]].filterType : this.model.filterType), this._queryString, !this.model.caseSensitiveSearch, (this.model.multiColumnSettings.columns[this._columnIndex[i]].type ? this.model.multiColumnSettings.columns[this._columnIndex[i]].type : "string"));
                    }
                }
				    for (var i = 0; i < _query.queries.length; i++) {
				        if (_query.queries[i].fn == "onWhere") {
				            index = _query.queries.slice(i)[0].e;
				        }
				    }
				    if(ej.isNullOrUndefined(index) && this.model.multiColumnSettings.searchColumnIndices.length !=0)
                        this._predicates.length > 0 && (_query.where(ej.Predicate["or"](this._predicates)));
				    else if (this.model.multiColumnSettings.searchColumnIndices.length !=0)
					    _query.where((index).and(this._predicates));
				    else if (ej.isNullOrUndefined(index))
				        _query.where(predicate);
				    else
				        _query.where((index).and(predicate));
				}
				else _query.where(bindTo, this.model.filterType, this._queryString, !this.model.caseSensitiveSearch);

            }
            
			else _query.where(bindTo, this.model.filterType, this._queryString, !this.model.caseSensitiveSearch);
			}
            this._addSortingQuery(_query, bindTo);
        },

		_predicateConvertion: function( predicate, field, filterType, value, casing ,type){
			var _query;
			if(type == "number")
				_query = Number(value);
			else if(type == "boolean") {
				if(value == "true" || value == "yes" || value =="1") _query = true;
				else if(value == "false" || value == "no" || value =="0") _query = false;
			}	
			else if(type =="date")
				_query = new Date(value);
			else _query = value;
			if( (type == "number" && isNaN(_query)) ||(type == "boolean" && _query == undefined ) )
				predicate = predicate;
			else if (this.model.multiColumnSettings.searchColumnIndices.length !=0)
			    this._predicates.push(new ej.Predicate(field, filterType, _query,casing));
			else 
				predicate = predicate != undefined ? predicate["or"]( field, filterType, _query,casing):ej.Predicate( field, filterType, _query,casing);
			return predicate;
		}, 
		
        _getQuery: function () {
            if (ej.isNullOrUndefined(this.model.query)) {
                var column = [], queryManager = ej.Query(), mapper = this.model.fields;
                for (var col in mapper) {
                    if (col !== "tableName" && mapper[col])
                        column.push(mapper[col]);
                }
                if (column.length > 0)
                    queryManager.select(column);
                if (!ej.isNullOrUndefined(this.model.dataSource.dataSource.url) && !this.model.dataSource.dataSource.url.match(mapper.tableName + "$"))
                    !ej.isNullOrUndefined(mapper.tableName) && queryManager.from(mapper.tableName);
            }
            else queryManager = this.model.query.clone();
            return queryManager;
        },

        _OnTextEnter: function (e) {
            var proxy = this;
			if( ej.isDevice() ) {
            clearTimeout(this.timeDelay);
            this.timeDelay = setTimeout(function () {
                proxy._onTextProcess(e);
            }, proxy.model.delaySuggestionTimeout);
			}
			else proxy._onTextProcess(e);
        },
		_onTextProcess: function (e) {
			this._addLoadingClass();
			this.element.attr("aria-expanded", false);
			this._performSearch(e);
			if (this.model.showResetIcon) this._showReset();
		},
        _showReset: function () {
            if (ej.isNullOrUndefined(this.resetSpan)) {
                this.resetSpan = ej.buildTag("span.e-icon e-iclose");
                if (!this.model.showPopupButton) {
                    this.container.append(this.resetSpan).addClass("e-reset");
                }
                else {
                    this.dropdownbutton.before(this.resetSpan);
                    this.container.addClass("e-popup e-reset");
                }
		        this._on(this.resetSpan, "mousedown", this._refreshSearch);
            }          
        },
		 
		_refreshSearch:function(){
			this.resetSpan = null;
			this.clearText();
			this._refreshPopup();			
		},
		
		_removeReset:function (){
	        this.resetSpan = this.resetSpan && this.resetSpan[0].remove();		
            this._refreshPopup();			  
		  },

        _doneRemaining: function (e) {
            this._showSuggestionList(e);
            this.element.attr({"aria-expanded": true , "aria-haspopup": true});
            if (this.model.enableAutoFill && this._autoFill && !this.noresult || this.model.autoFocus) {
                this.element.attr("aria-autocomplete", "both");
                this._activeItem = 1;
                this._queryString = this.target.value;
            }
            if (this.model.enableAutoFill && this._autoFill && !this.noresult) this._setTextBoxValue();
            if (this.model.autoFocus && !this.noresult) { this._addListHover(); if (this.wrapper.width() > 0) this.suggestionList.children('div.e-content').css({ "width": this.wrapper.width() }); }
            this._removeLoadingClass();
            if (this.noresult && !this.model.showEmptyResultText)
                this._hideResult(e);
        },

        _removeRepeated: function () {
            var results = this.suggestionListItems;
            if (!results || results.length == 0 || this._selectedItems.length == 0 || ( this.suggestionListItems.length == 1 && this.suggestionListItems[0] == (this.element.val() + this._addNewTemplate)))
                return false;
			this._repeatRemove = false;
			for (var i = 0, length = this._selectedItems.length; i < length; i++) {
			    var index;
			    if (ej.DataManager && this.model.dataSource instanceof ej.DataManager) {
			        var proxy = this, tempindex = 0;
			        results.forEach(function (data) {
			            if (!ej.isNullOrUndefined(data[proxy.model.fields["text"]]) ? (data[proxy.model.fields["text"]] == proxy._selectedItems[i][proxy.model.fields["text"]]) : true &&
                            !ej.isNullOrUndefined(data[proxy.model.fields["key"]]) ? (data[proxy.model.fields["key"]] == proxy._selectedItems[i][proxy.model.fields["key"]]) : true &&
                            !ej.isNullOrUndefined(data[proxy.model.fields["htmlAttributes"]]) ? (data[proxy.model.fields["htmlAttributes"]] == proxy._selectedItems[i][proxy.model.fields["htmlAttributes"]]) : true &&
                            !ej.isNullOrUndefined(data[proxy.model.fields["groupBy"]]) ? (data[proxy.model.fields["groupBy"]] == proxy._selectedItems[i][proxy.model.fields["groupBy"]]) : true)
			                index = tempindex;
			            tempindex++;
			        });
			    }
			    else{
                 index = results.indexOf(this._selectedItems[i]);
				 if (!isNaN(parseFloat(this._selectedItems[i]))) index = results.indexOf(parseFloat(this._selectedItems[i]));
				}
			    if (index != -1 && !ej.isNullOrUndefined(index)) this.suggestionListItems.splice(index, 1);
				if( this.element.val() == this._selectedItems[i] )this._repeatRemove = true;
            }
        },

        _checkDelimiter: function () {
            this._queryString = this.element.val();
            var _deliIndex = (this.model.multiSelectMode != "delimiter") ? -1 : this._queryString.lastIndexOf(this.model.delimiterChar);


            if (_deliIndex == -1) {
                return true;
            }
            else {
                this._queryString = this._queryString.substr(_deliIndex + ((this.model.delimiterChar).length), this._queryString.length);
                return true;
            }
        },

        _autofilSelection: function () {
            var element = this.element[0], totLen = this.element.val().length;

            if (element.setSelectionRange)
                element.setSelectionRange(this.suggLen, totLen);
            else if (element.createTextRange) {

                element = element.createTextRange();
                element.collapse(true);
                element.moveEnd('character', totLen);
                element.moveStart('character', this.suggLen);
                element.select();
            }
        },

        _OnDropdownClick: function (e) {
            if (this.model.enabled && !this.model.readOnly) {
                e.preventDefault();
                this.dropdownbutton.addClass("e-active");
                this._iconEventBind(this.dropdownbutton, "span");
				if ((e.which && e.which == 1) ||(e.button && e.button == 0)) {
                this._addLoadingClass();
                if (this.showSuggestionBox) {
                    this._hideResult(e);
                    this._isOpened = false;
                    this._removeLoadingClass();
                }
                else this._showFullList(e);
            }
		  }
        },

        _iconEventBind: function (element, target) {
            element.on({
                mouseleave: $.proxy(this._OnMouseIconClick, this)
            }, target);
        },

        _OnMouseIconClick: function (e) {
            this.dropdownbutton.removeClass("e-active");
        },

        _showFullList: function (e) {
            if (!this._isFocused)
                this.element.focus();
            this._queryString = null;
            this._autoFill = false;
            this._performSearch(e);
        },

        _OnMouseEnter: function (e) {
            this._getActiveItemIndex(e);
            if (this.model.showPopupButton) this.dropdownbutton.removeClass('e-active');
        },
        _getActiveItemIndex: function (e) {
            var targetEle = e.target;
            if (this.model.multiColumnSettings.enable && e.target.tagName.toLowerCase() != "tr") targetEle = $(e.target).parents("tr");
            else if (e.target.tagName.toLowerCase() != "li") targetEle = $(e.target).parents("li");
            this._getLiTags().removeClass("e-hover");
            $(targetEle).addClass("e-hover");
            this._queryString = this.element.val();
            this._activeItem = this._getLiTags().index($(targetEle)) + 1;
        },

        _OnMouseLeave: function (e) {
            this._getLiTags().removeClass("e-hover");
            if (this.model.showPopupButton) this.dropdownbutton.removeClass('e-active');
            if (this.model.highlightSearch)
                this._getLiTags().find(".e-hilight-txt").removeClass("e-hover");
        },

         _OnMouseClick: function (e) {
             this._getActiveItemIndex(e);
            if (!this.noresult) {
                this._enterTextBoxValue(e);
                this._isOpened = false;
                this._hideResult(e);
            }
        },
        
        _OnDocumentClick: function (e) {
            if (!$(e.target).is(this.suggestionList) && !$(e.target).parents(".e-atc-popup").is(this.suggestionList) &&
                !$(e.target).is(this.element) && !$(e.target).parents(".e-atc").is(this.wrapper)) {
                this._isOpened = true;
                this._hideResult(e);
            }
            else if ($(e.target).is(this.suggestionList) || $(e.target).parents(".e-atc-popup").is(this.suggestionList))
                e.preventDefault();
        },

        _OnWindowResize: function (e) {
            this._refreshPopup();
        },

		_keyProcess: function (values) {
		    var map = this._declareVariable(), proxy = this;
		    var delimiterIndex;
		    delimiterIndex = this._delimiterChar();
		    if (!ej.isNullOrUndefined(values)){
                for (var data = 0, length = values.length; data < length; data++) {
                    var _val =values[data];
                    if (ej.DataManager && this.model.dataSource instanceof ej.DataManager)
                        proxy._selectValueByKey(null);
                 else {
                        this._dataQuery =this.model.multiColumnSettings.enable ? ej.Query(): ej.Query().where(map[0], this.model.filterType, _val, false);
                        this._promise = ej.DataManager(this.model.dataSource).executeLocal(this._dataQuery);
                        if (!this.model.multiColumnSettings.enable) {
                            if (this._promise instanceof Array && (this._promise.length == 0))
                                this._selectValueByKey() != null ? this._selectValueByKey() : null;
                            else
                                this._getFieldKey(this._promise[0], map[1], delimiterIndex);
                        }
                        else this._formatStringKey(values, map, delimiterIndex)
                    }
                }
			}
		},

		_formatStringKey: function (values, map, delimiterIndex) {
		    this._selectValueByKey(null);
            for (var data = 0, valueLength = values.length; data < valueLength; data++) {
		        if (values[data] != "") {
		            var _val = values[data];
		            var _isExistIndex
                    for (var i = 0, length = this._promise.length; i < length; i++) {
		                if (_val == this._textFormateString(this._promise[i]))
		                    _isExistIndex = i;
		            }
		            if (_isExistIndex) this._getFieldKey(this._promise[_isExistIndex], map[1], delimiterIndex);
		            else
		                this._selectValueByKey() != null ? this._selectValueByKey() : null;
		        }
		    }
		},
		_getFieldKey: function (data, _key, deliIndex) {
		    if (!ej.isNullOrUndefined(this.model.template) && ej.isNullOrUndefined(this._getField(data, _key))) return;
		    if (ej.isNullOrUndefined(this._getField(data, _key))) return;
		    key = this._getField(data, _key).toString();
		    if (this.model.multiSelectMode != "none") {
		        var keyval, splitval, eleVal, key = this._selectValueByKey();
		        delimiterChar = this.model.delimiterChar;
		        keyval = this._getField(data, _key).toString();
		        if (key != null) {
		            splitval = key.toString().split(deliIndex).filter(function (v) { return v !== "" });
		            if ($.inArray(keyval, splitval) == -1) {
		                splitval.push(keyval);
		                key = splitval.join(delimiterChar) + delimiterChar;
		            }
		            else
		                key = keyval + delimiterChar;
		        }
		        else
		            key = keyval + delimiterChar;
		    }
		    this._selectValueByKey(key);
		},

		_removeDuplicateVal: function (values) {
		    var result = [];
		    $.each(values, function (i, e) {
		        if ($.inArray(e, result) == -1)
		            result.push(e);
		    });
		    if (values.length == 1 && !ej.isNullOrUndefined(this._originalval)) {
		        if ($.inArray(values[0], this._originalval) == -1)
		            this._selectValueByKey(null);
		    }
		    return result;
		},

        _valueChange: function (e) {
            var currValue = this.model.multiSelectMode == "visualmode" ? this._modelValue : this.element.val();
            if (this.value() != currValue || (currValue == "" && this.element.val() != "")) {
                this.value(currValue);
                if (ej.isNullOrUndefined(this.model.fields["key"]) || currValue == "" ) this._hiddenInput.val(currValue);
                this._changeEvtTrigger(currValue, e);
            }
			if(this.model.showResetIcon && !currValue){
			this.wrapper.find("span.e-iclose").remove();
			this.resetSpan = null;}
        },
        _changeEvtTrigger: function (currValue, e) {
            var args = (e != undefined) ? { event: e, isInteraction: true, value: currValue } : { isInteraction: false, value: currValue };
            if (!this.initialRender) {
				this._trigger("_change", { value: currValue });
                this._trigger("change", args);
            }
        },

        _updateSelectedItemArray: function (value) {
            var  values = [];
            this._selectedItems = [];
            this.suggestionListItems = this.model.dataSource;
            if (this.model.multiSelectMode == "delimiter" && value) {
                values = value.split(this.model.delimiterChar);
                if ((ej.DataManager && this.model.dataSource instanceof ej.DataManager) || ((!ej.isNullOrUndefined(this.suggestionListItems)) && (typeof this.suggestionListItems[0] != "object"))) {
                    for (var i = 0, length = values.length; i < length; i++) {
                        if (values[i]) {
                            var _proxy = this;
							var _objLen = this._selectedObj.length;
							var result = {};
							for (var j = 0; j< _objLen; j++ ){
								if(this._selectedObj[j][_proxy.model.fields.text] == values[i]) {
									result = this._selectedObj[j];
									j = _objLen;
								}
							}
							this._selectedItems.push(!$.isEmptyObject(result) ? result : values[i]);
						}
                    }
                }
                else
                    this._createBoxForObjectType(values);
            }
            else if (this.model.multiSelectMode == "none" && value) {
                values.push(value);
                if ((ej.DataManager && this.model.dataSource instanceof ej.DataManager) || ((!ej.isNullOrUndefined(this.suggestionListItems)) && (typeof this.suggestionListItems[0] != "object"))) {
                    var _proxy = this;
					var result = $.grep(this._selectedObj, function(e){ if(e[_proxy.model.fields.text] == value) return e; });
					this._selectedItems.push(result.length > 0 ? result : value);
				}
                else
                    this._createBoxForObjectType(values);
            }
        },

        _keyDownComplete: function (e) {
            var currValue = this.element.val();
            var prevValue = this.value();
            if (!ej.isNullOrUndefined(this.model.fields["key"])) {
                if ((e.keyCode == 46 || e.keyCode == 8 || e.keyCode == 65) && (this.model.multiSelectMode == "delimiter")) {
                    var data = this.value();
                    var array = data.split(",");
                    var deli = this.model.delimiterChar;
                    var index = array.indexOf(prevValue.replace(/,/g, ''));
                    var values = this._hiddenInput.val().split(deli);
                    this._hiddenInput.val(values.join(deli));
					values.splice(index, 1);
                }
            }
            if (this._preVal != currValue) {
                this._preVal = currValue;
                if (this.model.multiSelectMode == "visualmode") this._adjustWidth();
                this._valueChange(e);
            }
        },

        _moveCaretToEnd: function (el) {
            //Chrome Scroll content
            el.scrollLeft = el.scrollWidth;
            //IE Scroll the content
            if (el.createTextRange) {
                var rng = el.createTextRange();
                rng.moveEnd('textedit');
                rng.moveStart('textedit');
                rng.select();
            }
            if (typeof el.selectionStart == "number") {
                el.selectionStart = el.selectionEnd = el.value.length;
            } else if (typeof el.createTextRange != "undefined") {
                var range = el.createTextRange();
                range.collapse(false);
                range.select();
            }
        },

        _getCaretSelection: function () {
            var input = this.element[0], start = 0, end = 0;

            if (!isNaN(input.selectionStart)) {
                start = input.selectionStart;
                end = input.selectionEnd;
                return { start: Math.abs(start), end: Math.abs(end) };
            }

            var bookmark = document.selection.createRange().getBookmark();
            var selection = input.createTextRange();
            selection.moveToBookmark(bookmark);

            var before = input.createTextRange();
            before.collapse(true);
            before.setEndPoint("EndToStart", selection);
            var beforeLength = before.text.length, selLength = selection.text.length;
            return { start: beforeLength, end: beforeLength + selLength };
        },
        _getLocalizedLabels: function () {
            return ej.getLocalizedConstants(this.sfType, this.model.locale);
        },
        _wireEvents: function () {
            this._on(this.element, "focus", this._targetFocus);
            this._on(this.element, "blur", this._targetBlur);
        }
    });
    ej.Autocomplete.Locale = ej.Autocomplete.Locale || {};
    ej.Autocomplete.Locale["default"] = ej.Autocomplete.Locale["en-US"] = {
        addNewText: "Add New",
        emptyResultText: "No suggestions",
        actionFailure: "The specified field doesn't exist in given data source",
        watermarkText: ""
    };

    ej.filterType = {
        /**  Supports to search text with startswith  */
        StartsWith: "startswith",
        /**  Supports to search text with contains */
        Contains: "contains",
        /**  Supports to search text with endswith */
        EndsWith: "endswith",
        /**  Supports only for number lessthan only */
        LessThan: "lessthan",
        /**  Supports only for number greaterthan only */
        GreaterThan: "greaterthan",
        /**  Supports only for number lessthanorequal only */
        LessThanOrEqual: "lessthanorequal",
        /**  Supports only for number greaterthanorequal only */
        GreaterThanOrEqual: "greaterthanorequal",
        /**  Supports only for number equal only */
        Equal: "equal",
        /** Supports only for number notequal only */
        NotEqual: "notequal"
    };

    ej.SortOrder = {
        /** Supports to sorts with ascending only */
        Ascending: "ascending",
        /** Supports to sorts with descending only */
        Descending: "descending"
    };

    ej.MultiSelectMode = {
        /** Supports to selection mode with none only */
        None: "none",
        /** Supports to selection mode with delimitter only */
        Delimiter: "delimiter",
        /** Supports to selection mode with visualmode only */
        VisualMode: "visualmode"
    };
    ej.Animation = {
        /** Supports to animation type with none only */
        None: "none",
        /** Supports to animation type with slide only */
        Slide: "slide",
        /** Supports to animation type with fade only */
        Fade: "fade"
    };
	ej.Type = {
		Number: "number",
		String: "string",
		Boolean: "boolean",
		Date: "date"
	}
})(jQuery, Syncfusion);