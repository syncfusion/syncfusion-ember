var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function ($) {
    var ejComboBox = (function (_super) {
        __extends(ejComboBox, _super);
        function ejComboBox(element, options) {
            _super.call(this);
            this._rootCSS = "e-combobox";
            this._setFirst = false;
            this.PluginName = "ejComboBox";
            this.validTags = ["input"];
            this.type = "editor";
            this._requiresID = true;
            this.angular = {
                require: ['?ngModel', '^?form', '^?ngModelOptions']
            };
            this.boolean = true;
            this.isPreventBlur = false;
            this.isDocumentClick = false;
            this.isPopupOpen = false;
            this.popupObj = null;
            this.beforePopupOpen = false;
            this.preventFocus = false;
            this.isDropDownClick = false;
            this.isInteracted = false;
            this.isValidKey = false;
            this.isSelectCustom = false;
            this.preventAutoFill = false;
            this.isTyped = false;
            this.isSelected = false;
            this.prevSelectPoints = {};
            this.initial = true;
            this.typedString = '';
            this.actionCompleteData = { isUpdated: false };
            this.isEscapeKey = false;
            this.isFilterFocus = false;
            this.isRequested = false;
            this.isNotSearchList = false;
            this.initRemoteRender = false;
            this.searchKeyEvent = null;
            this.preventAltUp = false;
            this.isTabKey = false;
            this.model = null;
            this.defaults = {
                autofill: false,
                allowCustom: true,
                htmlAttributes: {},
                allowFiltering: false,
                query: null,
                showClearButton: true,
                valueTemplate: null,
                readonly: false,
                text: null,
                value: null,
                index: null,
                headerTemplate: null,
                footerTemplate: null,
                fields: { text: null, value: null, iconCss: null, groupBy: null },
                groupTemplate: null,
                itemTemplate: null,
                noRecordsTemplate: 'No Records Found',
                actionFailureTemplate: 'The Request Failed',
                sortOrder: ('None'),
                dataSource: [],
                popupHeight: '300px',
                placeholder: null,
                cssClass: null,
                enabled: true,
                enableRtl: false,
                width: '100%',
                popupWidth: '100%',
                locale: 'en-US',
                customValueSpecifier: null,
                filtering: null,
                actionBegin: null,
                actionComplete: null,
                actionFailure: null,
                select: null,
                focus: null,
                change: null,
                blur: null,
                close: null
            };
            this.dataTypes = {
                autofill: 'boolean',
                allowCustom: 'boolean',
                htmlAttributes: 'object',
                allowFiltering: 'boolean',
                showClearButton: 'boolean',
                valueTemplate: 'string',
                readonly: 'boolean',
                text: 'string',
                index: 'number',
                headerTemplate: 'string',
                footerTemplate: 'string',
                dataSource: "data",
                query: "data",
                fields: "data",
                groupTemplate: "string",
                itemTemplate: "string",
                noRecordsTemplate: "string",
                actionFailureTemplate: "string",
                sortOrder: "enum",
                placeholder: "string",
                cssClass: "string",
                enabled: "boolean",
                enableRtl: "boolean",
                locale: "string"
            };
            this.observables = ["value"];
            this.value = ej.util.valueFunction("value");
            if (element) {
                if (!element["jquery"]) {
                    element = $("#" + element);
                }
                if (element.length)
                    return $(element).ejComboBox(options).data(this.PluginName);
            }
        }
        ;
        ejComboBox.prototype._setModel = function (options) {
            var option;
            for (option in options) {
                switch (option) {
                    case 'allowFiltering':
                        this.model.allowFiltering = options[option];
                        this.setSearchBox();
                        break;
                    case 'allowCustom':
                        this.model.allowCustom = options[option];
                        break;
                    case 'htmlAttributes':
                        this.model.htmlAttributes = options[option];
                        this.setHTMLAttributes();
                        break;
                    case 'width':
                        this.model.width = options[option];
                        $(this.inputWrapper.container).css({ 'width': this.formatUnit(options[option]) });
                        break;
                    case 'placeholder':
                        this.model.placeholder = options[option];
                        this.setPlaceholder(options[option], this.inputElement);
                        break;
                    case 'readonly':
                        this.model.readonly = options[option];
                        this.setReadonly(options[option], this.inputElement);
                        break;
                    case 'cssClass':
                        this.model.cssClass = options[option];
                        this.setCssClass(options[option]);
                        if (this.popupObj) {
                            $(this.popupObj).addClass(options[option]);
                        }
                        break;
                    case 'enableRtl':
                        this.model.enableRtl = options[option];
                        this.setEnableRtl();
                        break;
                    case 'enabled':
                        this.model.enabled = options[option];
                        this.setEnable();
                        break;
                    case 'text':
                    case 'value':
                    case 'index':
                        if (options[option] === null) {
                            this.clear();
                            return;
                        }
                        if (!this.list) {
                            if (this.model.dataSource instanceof ej.DataManager) {
                                this.initRemoteRender = true;
                            }
                            this.renderList();
                        }
                        if (!this.initRemoteRender) {
                            var li = (option == 'text') ? this.getElementByText(options[option]) : (option == 'value') ? this.getElementByValue(options[option]) : this.liCollections[options[option]];
                            if (this.isValidLI(li)) {
                                this.setSelection(li, null);
                            }
                            else {
                                (option == 'text') ? this.setOldText(options[option]) : (option == 'value') ? this.setOldValue(this.value(options[option])) : null;
                            }
                        }
                        break;
                    case 'query':
                    case 'dataSource':
                    case 'fields':
                    case 'sortOrder':
                        if (option == 'sortOrder')
                            this.model.sortOrder = options[option];
                        if (option == 'fields')
                            this.model.fields = options[option];
                        if (option == 'query')
                            this.model.query = options[option];
                        if (option == 'dataSource')
                            this.model.dataSource = options[option];
                        this.clear();
                        this.resetList(this.model.dataSource);
                        break;
                    case 'footerTemplate':
                        this.model.footerTemplate = options[option];
                        if (this.popupObj) {
                            this.setFooterTemplate(this.popupObj);
                        }
                        break;
                }
            }
        };
        ejComboBox.prototype.wireEvent = function () {
            this._on($(this.inputWrapper.buttons[0]), 'mousedown', this.preventBlur);
            this._on($(this.inputWrapper.container), 'blur', this.onBlur);
            this._on($(this.inputElement), 'focus', this.targetFocus);
            this._on($(this.inputElement), 'blur', this.onBlur);
            if (!this.model.readonly) {
                this._on($(this.inputElement), 'input', this.onInput);
                this._on($(this.inputElement), 'keyup', this.onFilterUp);
                this._on($(this.inputElement), 'keydown', this.onFilterDown);
            }
            if (!ej.isNullOrUndefined(this.inputWrapper.buttons[0])) {
                this._on($(this.inputWrapper.buttons[0]), 'mousedown', this.dropDownClick);
            }
            if (!ej.isDevice()) {
                this._on($(this.inputElement), 'keydown', this.keyActionHandler);
            }
            if (this.model.showClearButton) {
                this._on($(this.inputWrapper.clearButton), 'mousedown', this.resetHandler);
            }
        };
        ejComboBox.prototype.unWireEvent = function () {
            this._off($(this.inputWrapper.buttons[0]), 'mousedown', this.preventBlur);
            this._off($(this.inputWrapper.container), 'blur', this.onBlur);
            this._off($(this.inputElement), 'focus', this.targetFocus);
            this._off($(this.inputElement), 'blur', this.onBlur);
            if (!ej.isNullOrUndefined(this.inputWrapper.buttons[0])) {
                this._off($(this.inputWrapper.buttons[0]), 'mousedown', this.dropDownClick);
            }
            if (!this.model.readonly) {
                this._off($(this.inputElement), 'input', this.onInput);
                this._off($(this.inputElement), 'keyup', this.onFilterUp);
                this._off($(this.inputElement), 'keydown', this.onFilterDown);
            }
            if (!ej.isDevice()) {
                this._off($(this.inputElement), 'keydown', this.keyActionHandler);
            }
            if (this.model.showClearButton) {
                this._off($(this.inputWrapper.clearButton), 'mousedown', this.resetHandler);
            }
        };
        ejComboBox.prototype.preventBlur = function (e) {
            if ((!this.model.allowFiltering && document.activeElement !== this.inputElement &&
                (ej.isNullOrUndefined(document.activeElement) || (document.activeElement.className && document.activeElement.className.indexOf(comboBoxClasses.input) == -1)) && ej.isDevice() || !ej.isDevice())) {
                e.preventDefault();
            }
        };
        ejComboBox.prototype.setOldText = function (text) {
            this.setInputValue(this.model.text, this.inputElement, this.model.showClearButton);
            this.customValue();
            this.removeSelection();
        };
        ejComboBox.prototype.setOldValue = function (value) {
            this.valueMuteChange((this.model.allowCustom) ? this.value() : null);
            this.removeSelection();
            this.setHiddenValue();
        };
        ejComboBox.prototype.valueMuteChange = function (value) {
            var inputValue = ej.isNullOrUndefined(value) ? null : value.toString();
            this.setInputValue(inputValue, this.inputElement, this.model.showClearButton);
            this.value(value);
            this.model.text = value ? value.toString() : null;
            this.model.index = null;
            this.activeIndex = this.model.index;
            var fields = this.getFields();
            var dataItem = {};
            dataItem[fields.text] = ej.isNullOrUndefined(value) ? null : value.toString();
            dataItem[fields.value] = ej.isNullOrUndefined(value) ? null : value.toString();
            this.itemData = dataItem;
            this.item = null;
            if (this.previousValue !== this.value()) {
                this.detachChangeEvent(null);
            }
        };
        ejComboBox.prototype.updateValues = function () {
            if (!ej.isNullOrUndefined(this.value())) {
                var li = this.getElementByValue(this.value());
                if (li) {
                    this.setSelection(li, null);
                }
                else if (this.model.allowCustom) {
                    this.valueMuteChange(this.value());
                }
                else {
                    this.valueMuteChange(null);
                }
            }
            else if (this.model.text && ej.isNullOrUndefined(this.value())) {
                var li = this.getElementByText(this.model.text);
                if (li) {
                    this.setSelection(li, null);
                }
                else {
                    this.setInputValue(this.model.text, this.inputElement, this.model.showClearButton);
                    this.customValue();
                }
            }
            else {
                this.setSelection(this.liCollections[this.activeIndex], null);
            }
            this.setHiddenValue();
            this.setInputValue(this.model.text, this.inputElement, this.model.showClearButton);
        };
        ejComboBox.prototype.getAriaAttributes = function () {
            var ariaAttributes = {
                'aria-owns': this.element[0].id + '_options',
                'role': 'combobox',
                'aria-autocomplete': 'both',
                'aria-hasPopup': 'true',
                'aria-expanded': 'false',
                'aria-readonly': this.model.readonly.toString(),
                'autocomplete': 'off',
                'autocorrect': 'off',
                'autocapitalize': 'off',
                'spellcheck': 'false'
            };
            return ariaAttributes;
        };
        ejComboBox.prototype.searchLists = function (e) {
            this.isTyped = true;
            if (this.model.allowFiltering) {
                this.listsearchLists(e);
                if ($.trim(this.filterInput.value) === '') {
                    this.setHoverList(this.ulElement.querySelector('.' + comboBoxClasses.li));
                }
            }
            else {
                if (this.ulElement && this.inputElement.value === '' && this.preventAutoFill) {
                    this.setHoverList(this.ulElement.querySelector('.' + comboBoxClasses.li));
                }
                this.incrementalSearch(e);
            }
        };
        ejComboBox.prototype.setSearchBox = function () {
            this.filterInput = this.inputElement;
            return (this.model.allowFiltering ? this.inputWrapper : inputObject);
        };
        ejComboBox.prototype.onActionComplete = function (ulElement, list, e, isUpdated) {
            this.listonActionComplete(ulElement, list, e);
            if (this.isSelectCustom) {
                this.removeSelection();
            }
            if (!this.preventAutoFill && this.isTyped) {
                this.inlineSearch();
            }
        };
        ejComboBox.prototype.getFocusElement = function () {
            var dataItem = this.isSelectCustom ? { text: '' } : this.getItemData();
            var selected = this.list.querySelector('.' + comboBoxClasses.selected);
            var isSelected = dataItem["text"] === this.inputElement.value && !ej.isNullOrUndefined(selected);
            if (isSelected) {
                return selected;
            }
            if ((ej.isDevice() && !this.isDropDownClick || !ej.isDevice()) &&
                !ej.isNullOrUndefined(this.liCollections) && this.liCollections.length > 0) {
                var inputValue = this.inputElement.value;
                var activeItem = this.search(inputValue, this.liCollections, 'StartsWith', true);
                var activeElement = activeItem["item"];
                if (!ej.isNullOrUndefined(activeElement)) {
                    var count = this.getIndexByValue(activeElement.getAttribute('data-value')) - 1;
                    var height = parseInt(typeof getComputedStyle !== 'undefined' ? getComputedStyle(this.liCollections[0], null).getPropertyValue('height') : this.liCollections[0]["currentStyle"]['height'], 10);
                    if (!isNaN(height)) {
                        var fixedHead = this.model.fields.groupBy ? this.liCollections[0].offsetHeight : 0;
                        this.list.scrollTop = count * height + fixedHead;
                        $(activeElement).addClass(comboBoxClasses.focus);
                    }
                }
                else {
                    if (this.isSelectCustom && $.trim(this.inputElement.value) !== '') {
                        this.removeFocus();
                        this.list.scrollTop = 0;
                    }
                }
                return activeElement;
            }
            else {
                return null;
            }
        };
        ejComboBox.prototype.setValue = function (e) {
            if (e && e.type === 'keydown' && e.KeyCode === 13) {
                this.removeFillSelection();
            }
            if (this.model.autofill && e && e.type === 'keydown' && e.keyCode !== 13) {
                this.preventAutoFill = false;
                this.inlineSearch(e);
                return false;
            }
            else {
                return this.listsetValue(e);
            }
        };
        ejComboBox.prototype.setAutoFill = function (activeElement, isHover) {
            if (!isHover) {
                this.setHoverList(activeElement);
            }
            if (this.model.autofill && !this.preventAutoFill) {
                var currentValue = this.getTextByValue(activeElement.getAttribute('data-value')).toString();
                var currentFillValue = this.getFormattedValue(activeElement.getAttribute('data-value'));
                if (!this.isSelected && this.previousValue !== currentFillValue) {
                    this.updateSelectedItem(activeElement, null);
                    this.isSelected = true;
                    this.previousValue = this.getFormattedValue(activeElement.getAttribute('data-value'));
                }
                else {
                    this.updateSelectedItem(activeElement, null, true);
                }
                if (!this.isAndroidAutoFill(currentValue)) {
                    this.setAutoFillSelection(currentValue);
                }
            }
        };
        ejComboBox.prototype.isAndroidAutoFill = function (value) {
            if (ej.isMobile()) {
                var currentPoints = this.getSelectionPoints();
                var prevEnd = this.prevSelectPoints["end"];
                var curEnd = currentPoints["end"];
                var prevStart = this.prevSelectPoints["start"];
                var curStart = currentPoints["start"];
                if (prevEnd !== 0 && ((prevEnd === value.length && prevStart === value.length) ||
                    (prevStart > curStart && prevEnd > curEnd) || (prevEnd === curEnd && prevStart === curStart))) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        };
        ejComboBox.prototype.inlineSearch = function (e) {
            var isKeyNavigate = (e && (e.keyCode === 40 || e.keyCode === 38 ||
                e.keyCode === 36 || e.keyCode === 35 || e.keyCode === 33 || e.keyCode === 34));
            var activeElement = isKeyNavigate ? this.liCollections[this.activeIndex] : this.getFocusElement();
            if (!ej.isNullOrUndefined(activeElement)) {
                if (!isKeyNavigate) {
                    var value = this.getFormattedValue(activeElement.getAttribute('data-value'));
                    this.activeIndex = this.getIndexByValue(value);
                    this.activeIndex = !ej.isNullOrUndefined(this.activeIndex) ? this.activeIndex : null;
                }
                this.preventAutoFill = this.inputElement.value === '' ? false : this.preventAutoFill;
                this.setAutoFill(activeElement, isKeyNavigate);
            }
            else if (this.inputElement.value === '') {
                this.activeIndex = null;
                this.list.scrollTop = 0;
                var focusItem = this.list.querySelector('.' + comboBoxClasses.li);
                this.setHoverList(focusItem);
            }
            else {
                this.activeIndex = null;
                this.removeSelection();
                this.removeFocus();
            }
        };
        ejComboBox.prototype.incrementalSearch = function (e) {
            if (!(this.isWatermark)) {
                this.hiddenSpan.css("display", "none");
            }
            this.showPopup();
            if (!ej.isNullOrUndefined(this.listData)) {
                this.inlineSearch(e);
                e.preventDefault();
            }
        };
        ;
        ejComboBox.prototype.setAutoFillSelection = function (currentValue) {
            var selection = this.getSelectionPoints();
            var value = this.inputElement.value.substr(0, selection["start"]);
            if (value && (value.toLowerCase() === currentValue.substr(0, selection["start"]).toLowerCase())) {
                var inputValue = value + currentValue.substr(value.length, currentValue.length);
                this.setInputValue(inputValue, this.inputElement, this.model.showClearButton);
                this.inputElement.setSelectionRange(selection["start"], this.inputElement.value.length);
            }
            else {
                this.setInputValue(currentValue, this.inputElement, this.model.showClearButton);
                this.inputElement.setSelectionRange(0, this.inputElement.value.length);
            }
        };
        ;
        ejComboBox.prototype.setSelection = function (li, e) {
            this.listsetSelection(li, e);
            if (!ej.isNullOrUndefined(li) && !this.model.autofill && !this.isDropDownClick) {
                this.removeFocus();
            }
        };
        ejComboBox.prototype.selectCurrentItem = function (e) {
            var li;
            if (this.isPopupOpen) {
                li = this.list.querySelector('.' + comboBoxClasses.focus);
                if (li) {
                    this.setSelection(li, e);
                    this.isTyped = false;
                }
                if (this.isSelected) {
                    this.isSelectCustom = false;
                    this.onChangeEvent(e);
                }
            }
            if (this.isTyped && !this.isSelected && ej.isNullOrUndefined(li)) {
                this.customValue();
            }
            this.hidePopup();
        };
        ejComboBox.prototype.setHoverList = function (li) {
            this.removeSelection();
            if (this.isValidLI(li) && li.className.indexOf(comboBoxClasses.selected) == -1) {
                this.removeFocus();
                $(li).addClass(comboBoxClasses.focus);
            }
        };
        ;
        ejComboBox.prototype.targetFocus = function (e) {
            $(this.inputWrapper.container).addClass(comboBoxClasses.inputFocus);
            if (ej.isDevice() && !this.model.allowFiltering) {
                this.preventFocus = false;
            }
            if (!(this.isWatermark)) {
                this.hiddenSpan.css("display", "none");
            }
            this.onFocus();
        };
        ejComboBox.prototype.dropDownClick = function (e) {
            if (ej.isDevice() && !this.model.allowFiltering) {
                this.preventFocus = true;
            }
            this.listdropDownClick(e);
        };
        ejComboBox.prototype.customValue = function () {
            var value = this.getValueByText(this.inputElement.value, true);
            if (!this.model.allowCustom && this.inputElement.value !== '') {
                this._setModel({ "value": value });
                this.value(value);
                if (ej.isNullOrUndefined(this.value())) {
                    this.setInputValue('', this.inputElement, this.model.showClearButton);
                }
            }
            else if ($.trim(this.inputElement.value) !== '') {
                var previousValue = this.value();
                if (ej.isNullOrUndefined(value)) {
                    var value_1 = this.inputElement.value === '' ? null : this.inputElement.value;
                    var fields = this.getFields();
                    var eventArgs = void 0;
                    eventArgs = { text: value_1, item: {} };
                    if (!this.initial) {
                        this._trigger('customValueSpecifier', eventArgs);
                    }
                    var item = eventArgs["item"];
                    var dataItem = {};
                    if (item && item[fields.text] && item[fields.value]) {
                        dataItem = item;
                    }
                    else {
                        dataItem[fields.text] = value_1;
                        dataItem[fields.value] = value_1;
                    }
                    this.itemData = dataItem;
                    this.model.text = this.itemData[fields.text];
                    this.value(this.itemData[fields.value]);
                    this.model.index = null;
                    this.setSelection(null, null);
                    this.isSelectCustom = true;
                }
                else {
                    this.isSelectCustom = false;
                    this.value(value);
                }
                if (previousValue !== this.value()) {
                    this.onChangeEvent(null);
                }
            }
        };
        ejComboBox.prototype._init = function () {
            this.listrender();
            this.setSearchBox();
            if (this.model.allowFiltering && ej.isNullOrUndefined(this.list)) {
                this.renderList();
            }
        };
        ;
        ejComboBox.prototype.hidePopup = function () {
            if (!ej.isNullOrUndefined(this.listData)) {
                var isEscape = this.isEscapeKey;
                if (this.isEscapeKey) {
                    this.setInputValue(this.typedString, this.inputElement, this.model.showClearButton);
                    this.isEscapeKey = false;
                }
                if (this.model.autofill) {
                    this.removeFillSelection();
                }
                var dataItem = this.isSelectCustom ? { text: '' } : this.getItemData();
                var selected = this.list.querySelector('.' + comboBoxClasses.selected);
                if (dataItem["text"] === this.inputElement.value && !ej.isNullOrUndefined(selected)) {
                    if (this.isSelected) {
                        this.onChangeEvent(null);
                        this.isSelectCustom = false;
                    }
                    this.listhidePopup();
                    return;
                }
                if ($.trim(this.inputElement.value) !== '') {
                    var searchItem = this.search(this.inputElement.value, this.liCollections, 'Equal', true);
                    this.selectedLI = searchItem["item"];
                    if (ej.isNullOrUndefined(searchItem["index"])) {
                        searchItem["index"] = this.search(this.inputElement.value, this.liCollections, 'StartsWith', true)["index"];
                    }
                    this.activeIndex = searchItem["index"];
                    if (!ej.isNullOrUndefined(this.selectedLI)) {
                        this.updateSelectedItem(this.selectedLI, null, true);
                    }
                    else if (isEscape) {
                        this.isSelectCustom = true;
                        this.removeSelection();
                    }
                }
                if (!this.isEscapeKey && this.isTyped && !this.isInteracted) {
                    this.customValue();
                }
            }
            this.listhidePopup();
        };
        ejComboBox.prototype.focusIn = function () {
            if (ej.isDevice() && !this.model.allowFiltering) {
                this.preventFocus = true;
            }
            this.listfocusIn();
        };
        ejComboBox.prototype.listhidePopup = function () {
            this.closePopup();
            var dataItem = this.getItemData();
            if ($.trim(this.inputElement.value) === '' && !this.isInteracted && (this.isSelectCustom ||
                !ej.isNullOrUndefined(this.selectedLI) && this.inputElement.value !== dataItem["text"])) {
                this.isSelectCustom = false;
                this.clear();
            }
        };
        ejComboBox.prototype.closePopup = function (delay) {
            this.isTyped = false;
            if (!(this.popupObj && document.body.contains(this.popupObj))) {
                return;
            }
            this._off($(document), 'mousedown', this.onDocumentClick);
            this.isActive = false;
            this.isDropDownClick = false;
            this.isDocumentClick = false;
            this.preventAutoFill = false;
            this._off(ej.getScrollableParents($(this.inputWrapper.container)), 'scroll', this.scrollHandler);
            $(this.inputElement).attr({ 'aria-expanded': 'false', 'aria-activedescendant': null });
            $(this.inputWrapper.container).removeClass(comboBoxClasses.iconAnimation);
            if (this.model.allowFiltering) {
                this.actionCompleteData.isUpdated = false;
            }
            this.beforePopupOpen = false;
            if (this.isPopupOpen) {
                var proxy_1 = this;
                this.isPopupOpen = false;
                $(this.popupObj).fadeOut(100, function () {
                    $(proxy_1.popupObj).removeClass("e-popup-open").addClass("e-popup-close");
                    proxy_1._trigger('close', { popup: proxy_1.popupObj });
                    proxy_1.destroyPopup();
                });
            }
            else {
                this.destroyPopup();
            }
        };
        ejComboBox.prototype.scrollHandler = function () {
            if (ej.isDevice() && (!this.model.allowFiltering && this.isDropDownClick)) {
                this.hidePopup();
            }
        };
        ejComboBox.prototype.destroyPopup = function () {
            this.isFilterFocus = false;
            this.popupObj && $("#" + this.popupObj.id + ".e-ddl.e-popup.e-control").remove();
            this.popupObj = null;
        };
        ejComboBox.prototype.onDocumentClick = function (e) {
            var target = e.target;
            if (!(!ej.isNullOrUndefined(this.popupObj) && $(target).closest('#' + this.popupObj.id).length > 0) &&
                !this.inputWrapper.container.contains(e.target)) {
                if (this.inputWrapper.container.className.indexOf(comboBoxClasses.inputFocus) > -1 || this.isPopupOpen) {
                    this.isDocumentClick = true;
                    var isActive = this.isRequested;
                    this.isInteracted = false;
                    this.hidePopup();
                    if (!isActive) {
                        this.onFocusOut();
                        $(this.inputWrapper.container).removeClass(comboBoxClasses.inputFocus);
                    }
                }
            }
            else if (target !== this.inputElement && !(this.model.allowFiltering && target === this.filterInput)
                && !(!this.model.allowFiltering && ej.isDevice() && target === this.inputWrapper.buttons[0])) {
                this.isPreventBlur = (ej.browserInfo().name == 'msie' || ej.browserInfo().name === 'edge') && (document.activeElement === this.inputElement ||
                    document.activeElement === this.filterInput);
                e.preventDefault();
            }
        };
        ejComboBox.prototype.onFocusOut = function () {
            if (this.isSelected) {
                this.isSelectCustom = false;
                this.onChangeEvent(null);
            }
            this.dispatchEvent(this.hiddenElement, 'change');
            if (this.inputWrapper.clearButton) {
                $(this.inputWrapper.clearButton).addClass(comboBoxClasses.clearIconHide);
            }
            this._trigger('blur');
        };
        ejComboBox.prototype.dispatchEvent = function (element, type) {
            if (document.createEvent) {
                var evt = document.createEvent('HTMLEvents');
                evt.initEvent(type, false, true);
                element.dispatchEvent(evt);
            }
        };
        ejComboBox.prototype.onBlur = function (e) {
            var target = e.relatedTarget;
            var currentTarget = e.target;
            var isPreventBlur = this.isPreventBlur;
            this.isPreventBlur = false;
            if (isPreventBlur && !this.isDocumentClick && this.isPopupOpen && (!ej.isNullOrUndefined(currentTarget) ||
                ej.isNullOrUndefined(target))) {
                this.inputElement.focus();
                return;
            }
            if (this.isDocumentClick || (!ej.isNullOrUndefined(this.popupObj)
                && document.body.contains(this.popupObj) &&
                this.popupObj.className.indexOf(comboBoxClasses.mobileFilter) > -1)) {
                if (!this.beforePopupOpen) {
                    this.isDocumentClick = false;
                }
                return;
            }
            if (((document.activeElement !== target || (document.activeElement === target &&
                currentTarget.className.indexOf(comboBoxClasses.inputFocus) > -1))) ||
                !this.inputWrapper.container.contains(target) || this.isTabKey) {
                this.isDocumentClick = this.isPopupOpen ? true : false;
                this.focusOutAction();
                this.isTabKey = false;
            }
        };
        ejComboBox.prototype.focusOutAction = function () {
            this.isInteracted = false;
            this.focusOut();
            this.onFocusOut();
        };
        ejComboBox.prototype.focusOut = function () {
            this.isTyped = true;
            this.hidePopup();
            this.inputElement.blur();
            $(this.inputWrapper.container).removeClass(comboBoxClasses.inputFocus);
        };
        ejComboBox.prototype.listdropDownClick = function (e) {
            if (this.inputElement.className.indexOf(comboBoxClasses.disable) > -1 || this.inputWrapper.clearButton === e.target) {
                return;
            }
            var target = e.target;
            if (!this.model.readonly) {
                if (this.isPopupOpen) {
                    this.hidePopup();
                }
                else {
                    this.focusIn();
                    this.queryString = $.trim(this.inputElement.value) === '' ? null : this.inputElement.value;
                    this.isDropDownClick = true;
                    this.showPopup();
                }
            }
        };
        ejComboBox.prototype.showPopup = function () {
            if (this.beforePopupOpen) {
                this.refreshPopup();
                return;
            }
            this.beforePopupOpen = true;
            if (this.model.allowFiltering && !this.isActive && this.actionCompleteData.list && this.actionCompleteData.list[0]) {
                this.isActive = true;
                this.onActionComplete(this.actionCompleteData.ulElement, this.actionCompleteData.list, null, true);
            }
            else if (ej.isNullOrUndefined(this.list) || (this.list != undefined) && this.list.className.indexOf(comboBoxClasses.noData) > -1) {
                this.renderList();
            }
            if (!ej.isNullOrUndefined(this.list.children[0]) || this.list.className.indexOf(comboBoxClasses.noData) > -1) {
                this.renderPopup();
            }
            $(this.inputElement).attr({ 'aria-activedescendant': this.selectedLI ? this.selectedLI.id : null });
        };
        ejComboBox.prototype.listfocusIn = function () {
            if (this.inputElement.className.indexOf(comboBoxClasses.disable) > -1) {
                return;
            }
            var isFocused = false;
            if (this.preventFocus && ej.isDevice()) {
                this.inputWrapper.container.tabIndex = 1;
                this.inputWrapper.container.focus();
                this.preventFocus = false;
                isFocused = true;
            }
            if (!isFocused) {
                this.inputElement.focus();
            }
            $(this.inputWrapper.container).addClass(comboBoxClasses.inputFocus);
            this.onFocus();
        };
        ejComboBox.prototype.onFocus = function () {
            if (!this.isInteracted) {
                this.isInteracted = true;
                this._trigger('focus');
            }
            this.updateIconState();
        };
        ejComboBox.prototype.updateIconState = function () {
            if (this.model.showClearButton) {
                if (this.inputElement.value !== '') {
                    $(this.inputWrapper.clearButton).removeClass(comboBoxClasses.clearIconHide);
                }
                else {
                    $(this.inputWrapper.clearButton).addClass(comboBoxClasses.clearIconHide);
                }
            }
        };
        ejComboBox.prototype.refreshPopup = function () {
            if (!ej.isNullOrUndefined(this.popupObj) && document.body.contains(this.popupObj)) {
                this.setPopupPosition();
            }
        };
        ejComboBox.prototype.renderPopup = function () {
            if (this.popupObj && document.body.contains(this.popupObj)) {
                this.refreshPopup();
                return;
            }
            var popupEle = ej.buildTag('div#' + this.element[0].id + '_popup' + '.e-ddl e-popup e-widget')[0];
            var searchBox = this.setSearchBox();
            this.listHeight = this.formatUnit(this.model.popupHeight);
            if (this.model.headerTemplate) {
                var compiledString = void 0;
                this.header = document.createElement('div');
                $(this.header).addClass(comboBoxClasses.header);
                this.header.innerHTML = this.model.headerTemplate;
                $(popupEle).append(this.header);
            }
            $(popupEle).append(this.list);
            if (this.model.footerTemplate) {
                this.setFooterTemplate(popupEle);
            }
            popupEle.style.visibility = 'hidden';
            popupEle.style.display = 'none';
            document.body.appendChild(popupEle);
            if (this.model.popupHeight !== 'auto') {
                this.searchBoxHeight = 0;
                if (!ej.isNullOrUndefined(searchBox.container)) {
                    this.searchBoxHeight = (searchBox.container.parentElement).getBoundingClientRect().height;
                    this.listHeight = (parseInt(this.listHeight, 10) - (this.searchBoxHeight)).toString() + 'px';
                }
                if (this.model.headerTemplate) {
                    var height = Math.round(this.header.getBoundingClientRect().height);
                    this.listHeight = (parseInt(this.listHeight, 10) - (height + this.searchBoxHeight)).toString() + 'px';
                }
                if (this.model.footerTemplate) {
                    var height = Math.round(this.footer.getBoundingClientRect().height);
                    this.listHeight = (parseInt(this.listHeight, 10) - (height + this.searchBoxHeight)).toString() + 'px';
                }
                this.list.style.maxHeight = (parseInt(this.listHeight, 10) - 2).toString() + 'px';
                popupEle.style.maxHeight = this.formatUnit(this.model.popupHeight);
            }
            else {
                popupEle.style.height = 'auto';
            }
            var offsetValue = 2;
            var left;
            if (!ej.isNullOrUndefined(this.selectedLI) && (!ej.isNullOrUndefined(this.activeIndex) && this.activeIndex >= 0)) {
                this.setScrollPosition();
            }
            else {
                this.list.scrollTop = 0;
            }
            if (ej.isDevice() && (!this.model.allowFiltering &&
                (this.isDropDownClick))) {
                offsetValue = this.setPopupPosition();
                var firstItem = this.isEmptyList() ? this.list : this.liCollections[0];
                left = -(parseInt(typeof getComputedStyle !== 'undefined' ? getComputedStyle(firstItem).textIndent : firstItem["currentStyle"]['textIndent'], 10) -
                    parseInt(typeof getComputedStyle !== 'undefined' ? getComputedStyle(this.inputElement).textIndent : this.inputElement["currentStyle"]['textIndent'], 10) -
                    parseInt(typeof getComputedStyle !== 'undefined' ? getComputedStyle(this.inputElement.parentElement).borderLeftWidth : this.inputElement.parentElement["currentStyle"]['textIndent']), 10);
            }
            this.getFocusElement();
            this.popupObj = $(popupEle).css("width", this.setWidth()).addClass("e-control e-popup e-ddl")[0];
            this.model.enableRtl ? $(popupEle).addClass(comboBoxClasses.rtl) : $(popupEle).removeClass(comboBoxClasses.rtl);
            if (ej.isDevice()) {
                $(this.popupObj).addClass(comboBoxClasses.device);
            }
            this.setListPosition();
            popupEle.style.visibility = 'visible';
            this._on(ej.getScrollableParents($(this.inputWrapper.container)), 'scroll', this.scrollHandler);
            this._on(ej.getScrollableParents($(this.inputWrapper.container)), 'scroll', this.setListPosition);
            this._on($(window), 'resize', this.setListPosition);
            $(this.inputElement).attr({ 'aria-expanded': 'true' });
            var inputParent = this.model.allowFiltering ? this.filterInput.parentElement : this.inputWrapper.container;
            $(inputParent).addClass(comboBoxClasses.inputFocus);
            $(this.inputWrapper.container).addClass(comboBoxClasses.iconAnimation);
            this.beforePopupOpen = true;
            var proxy = this;
            $(this.popupObj).fadeIn(100, function () {
                proxy.isPopupOpen = true;
                proxy.activeStateChange();
                $(proxy.popupObj).addClass("e-popup-open");
                proxy._trigger('open', { popup: proxy.popupObj });
                if (proxy.model.allowFiltering)
                    proxy.filterInput.focus();
            });
            this._on($(document), 'mousedown', this.onDocumentClick);
            this.wireListEvents();
            if (this.model.fields.groupBy)
                this._on($(this.list), 'scroll', this.setFloatingHeader);
        };
        ejComboBox.prototype.setListPosition = function () {
            var elementObj = this.inputWrapper.container, pos = ej.getOffset($(elementObj)), winWidth, winBottomHeight = $(document).scrollTop() + $(window).height() - (pos["top"] + $(elementObj).outerHeight()), winTopHeight = pos["top"] - $(document).scrollTop(), popupHeight = $(this.popupObj).outerHeight(), popupWidth = $(this.popupObj).outerWidth(), left = pos["left"], totalHeight = $(elementObj).outerHeight(), border = (totalHeight - $(elementObj).height()) / 2, maxZ = ej.getZindexPartial(this.element, this.popupObj), popupmargin = 3, topPos = ((popupHeight < winBottomHeight || popupHeight > winTopHeight) ? pos["top"] + totalHeight + popupmargin : pos["top"] - popupHeight - popupmargin) - border;
            winWidth = $(document).scrollLeft() + $(window).width() - left;
            if (this.model.enableRtl || popupWidth > winWidth && (popupWidth < left + $(elementObj).outerWidth()))
                left -= $(this.popupObj).outerWidth() - $(elementObj).outerWidth();
            $(this.popupObj).css({
                "left": left + "px",
                "top": topPos + "px",
                "z-index": maxZ
            });
        };
        ejComboBox.prototype.setFooterTemplate = function (popupEle) {
            if (this.footer) {
                this.footer.innerHTML = '';
            }
            else {
                this.footer = document.createElement('div');
                $(this.footer).addClass(comboBoxClasses.footer);
            }
            this.footer.innerHTML = this.model.footerTemplate;
            $(popupEle).append(this.footer);
        };
        ejComboBox.prototype.setPopupPosition = function () {
            var offsetValue;
            var popupOffset = 2;
            var selectedLI = this.list.querySelector('.' + comboBoxClasses.focus) || this.selectedLI;
            var firstItem = this.isEmptyList() ? this.list : this.liCollections[0];
            var lastItem = this.isEmptyList() ? this.list : this.liCollections[this.getItems().length - 1];
            var liHeight = firstItem.getBoundingClientRect().height;
            var listHeight = parseInt(this.listHeight, 10) / 2;
            var height = ej.isNullOrUndefined(selectedLI) ? firstItem.offsetTop : selectedLI.offsetTop;
            var lastItemOffsetValue = lastItem.offsetTop;
            if (lastItemOffsetValue - listHeight < height && !ej.isNullOrUndefined(this.liCollections) &&
                this.liCollections.length > 0 && !ej.isNullOrUndefined(selectedLI)) {
                var count = parseInt(this.model.popupHeight, 10) / liHeight;
                var paddingBottom = parseInt(typeof getComputedStyle !== 'undefined' ? getComputedStyle(this.list).paddingBottom : this.list["currentStyle"]['paddingBottom'], 10);
                offsetValue = (count - (this.liCollections.length - this.activeIndex)) * liHeight - popupOffset + paddingBottom;
                this.list.scrollTop = selectedLI.offsetTop;
            }
            else if (height > listHeight) {
                offsetValue = listHeight - liHeight / 2;
                this.list.scrollTop = height - listHeight + liHeight / 2;
            }
            else {
                offsetValue = height;
            }
            offsetValue = offsetValue + liHeight - popupOffset + ((liHeight - this.inputWrapper.container.offsetHeight) / 2);
            return -offsetValue;
        };
        ejComboBox.prototype.activeStateChange = function () {
            if (this.isDocumentClick) {
                this.hidePopup();
                this.onFocusOut();
                $(this.inputWrapper.container).removeClass(comboBoxClasses.inputFocus);
            }
        };
        ejComboBox.prototype.isEmptyList = function () {
            return !ej.isNullOrUndefined(this.liCollections) && this.liCollections.length === 0;
        };
        ejComboBox.prototype.formatUnit = function (value) {
            var result = value + '';
            return (result === 'auto' || result.indexOf('%') !== -1 || result.indexOf('px') !== -1) ? result : result + 'px';
        };
        ejComboBox.prototype.createInput = function (args) {
            var inputObject = { container: null, buttons: [], clearButton: null };
            inputObject.container = ej.buildTag("span." + comboBoxClasses.input + " " + "e-widget")[0];
            args.element.parentNode.insertBefore(inputObject.container, args.element);
            inputObject.container.appendChild($(args.element).addClass('e-input')[0]);
            if (args.properties.showClearButton)
                inputObject.clearButton = this.createClearButton(args.element, inputObject.container);
            var button = ej.buildTag('span' + "." + args.buttons[0])[0];
            if (ej.browserInfo()["name"] === "msie" && parseInt(ej.browserInfo()["version"]) <= 10) {
                if (parseInt(ej.browserInfo()["version"]) == 9)
                    $(button).addClass("e-comboie9");
                else if (parseInt(ej.browserInfo()["version"]) == 8)
                    $(button).addClass("e-comboie8");
                $(button).addClass("e-comboie");
            }
            inputObject.container.appendChild(button);
            inputObject.buttons.push(button);
            if (inputObject.container.className.indexOf(comboBoxClasses.input) == -1)
                $(inputObject.container).addClass('e-input-group');
            (args.properties.readonly) ? $(this.inputElement).attr({ readonly: '' }) : this.inputElement.removeAttribute('readonly');
            return inputObject;
        };
        ejComboBox.prototype.createClearButton = function (element, container) {
            var button = ej.buildTag('span.' + comboBoxClasses.clearIcon + ((ej.browserInfo().name === "msie" && parseInt(ej.browserInfo().version) <= 10) ? " e-comboie" : ""))[0];
            container.appendChild(button);
            (element.value) ? $(button).removeClass(comboBoxClasses.clearIconHide) : $(button).addClass(comboBoxClasses.clearIconHide);
            this._on($(button), 'click', function (event) {
                if (!(element.className.indexOf(comboBoxClasses.disable) > -1 || element.readOnly)) {
                    event.preventDefault();
                    if (element !== document.activeElement)
                        element.focus();
                    element.value = '';
                    $(button).addClass(comboBoxClasses.clearIconHide);
                }
            });
            return button;
        };
        ejComboBox.prototype.setWidth = function () {
            var width = this.formatUnit(this.model.popupWidth);
            if (width.indexOf('%') > -1) {
                var inputWidth = this.inputWrapper.container.offsetWidth * parseFloat(width) / 100;
                width = inputWidth.toString() + 'px';
            }
            if (ej.isDevice() && (!this.model.allowFiltering &&
                this.isDropDownClick)) {
                var firstItem = this.isEmptyList() ? this.list : this.liCollections[0];
                width = (parseInt(width, 10) + (parseInt(typeof getComputedStyle !== 'undefined' ? getComputedStyle(firstItem).textIndent : firstItem["currentStyle"]['textIndent'], 10) -
                    parseInt(typeof getComputedStyle !== 'undefined' ? getComputedStyle(this.inputElement).textIndent : this.inputElement["currentStyle"]['textIndent'], 10) +
                    parseInt(typeof getComputedStyle !== 'undefined' ? getComputedStyle(this.inputElement.parentElement).borderLeftWidth : this.inputElement.parentElement["currentStyle"]['borderLeftWidth'], 10)) * 2) + 'px';
            }
            return width;
        };
        ejComboBox.prototype.clearText = function () {
            this.filterInput.value = '';
            this.searchLists(null);
        };
        ejComboBox.prototype.onInput = function () {
            this.isValidKey = true;
            this.updateIconState();
        };
        ejComboBox.prototype.onFilterUp = function (e) {
            this.isValidKey = e.keyCode === 40 || e.keyCode === 38 || this.isValidKey;
            if (this.isValidKey) {
                this.isValidKey = false;
                switch (e.keyCode) {
                    case 38:
                    case 40:
                        this.preventAutoFill = false;
                        this.preventAltUp = false;
                        e.preventDefault();
                        break;
                    case 46:
                    case 8:
                        this.typedString = this.filterInput.value;
                        if (!this.isPopupOpen && this.typedString !== '' || this.isPopupOpen && this.queryString.length > 0) {
                            this.preventAutoFill = true;
                            this.searchLists(e);
                        }
                        else if (this.typedString === '') {
                            this.resetFocusElement();
                            this.activeIndex = null;
                        }
                        e.preventDefault();
                        break;
                    default:
                        this.typedString = this.filterInput.value;
                        this.preventAutoFill = false;
                        this.searchLists(e);
                        break;
                }
            }
        };
        ejComboBox.prototype.onFilterDown = function (e) {
            switch (e.keyCode) {
                case 13:
                    break;
                case 40:
                case 38:
                    this.queryString = this.filterInput.value;
                    e.preventDefault();
                    break;
                case 9:
                    if (this.isPopupOpen) {
                        e.preventDefault();
                    }
                    break;
                default:
                    this.prevSelectPoints = this.getSelectionPoints();
                    this.queryString = this.filterInput.value;
                    break;
            }
        };
        ejComboBox.prototype.resetHandler = function (e) {
            e.preventDefault();
            this.clear();
        };
        ejComboBox.prototype.clear = function () {
            if (this.list) {
                if (this.model.allowFiltering) {
                    this.onActionComplete(this.actionCompleteData.ulElement.cloneNode(true), this.actionCompleteData.list);
                }
                this.resetFocusElement();
            }
            this.hiddenElement.innerHTML = '';
            this.inputElement.value = '';
            this.value(null);
            this.model.text = null;
            this.model.index = null;
            this.activeIndex = null;
            this.item = null;
            this.itemData = null;
            this.queryString = '';
            this.setSelection(null, null);
            this.isSelectCustom = false;
            this.onChangeEvent(null);
            this.updateIconState();
        };
        ejComboBox.prototype.resetFocusElement = function () {
            this.removeHover();
            this.removeSelection();
            this.removeFocus();
            this.list.scrollTop = 0;
            var li = this.ulElement.querySelector('.' + comboBoxClasses.li);
            if (li) {
                $(li).addClass(comboBoxClasses.focus);
            }
        };
        ejComboBox.prototype.keyActionHandler = function (e) {
            var preventAction = e.keyCode === 33 || e.keyCode === 34;
            var preventHomeEnd = (e.keyCode === 36 || e.keyCode === 35);
            this.isEscapeKey = e.keyCode === 27;
            this.isTabKey = !this.isPopupOpen && e.keyCode === 9;
            var isNavigation = (e.keyCode === 40 || e.keyCode === 38 || e.keyCode === 33 || e.keyCode === 34
                || e.keyCode === 36 || e.keyCode === 35);
            if ((preventAction || preventHomeEnd) && !this.isPopupOpen) {
                return;
            }
            if (!this.model.readonly) {
                var isTabAction = e.keyCode === 9 || (e.keyCode === 9 && e.shiftKey);
                if (this.list === undefined && !this.isRequested && !isTabAction && e.keyCode !== 27) {
                    this.searchKeyEvent = e;
                    this.renderList();
                }
                if (ej.isNullOrUndefined(this.list) || (!ej.isNullOrUndefined(this.liCollections) &&
                    isNavigation && this.liCollections.length === 0) || this.isRequested) {
                    return;
                }
                if (isTabAction && this.isPopupOpen || e.keyCode === 27) {
                    e.preventDefault();
                }
                this.isSelected = e.keyCode === 27 ? false : this.isSelected;
                this.isTyped = (isNavigation || e.keyCode === 27) ? false : this.isTyped;
                switch (e.keyCode) {
                    case 40:
                    case 38:
                        if (e.altKey && e.keyCode === 40) {
                            this.showPopup();
                            break;
                        }
                        if (e.altKey && e.keyCode === 38) {
                            this.preventAltUp = this.isPopupOpen;
                            this.hidePopup();
                            break;
                        }
                        var focusEle = this.list.querySelector('.' + comboBoxClasses.focus);
                        if (!ej.isNullOrUndefined(focusEle)) {
                            this.setSelection(focusEle, e);
                        }
                        else {
                            var nextItem = void 0;
                            var index = e.keyCode === 40 ? this.activeIndex + 1 : this.activeIndex - 1;
                            var startIndex = 0;
                            nextItem = ej.isNullOrUndefined(this.activeIndex) ? this.liCollections[startIndex] : this.liCollections[index];
                            this.setSelection(nextItem, e);
                        }
                        e.preventDefault();
                        break;
                    case 33:
                        this.pageUpSelection(this.activeIndex - this.getPageCount(), e);
                        e.preventDefault();
                        break;
                    case 34:
                        this.pageDownSelection(this.activeIndex + this.getPageCount(), e);
                        e.preventDefault();
                        break;
                    case 36:
                        e.preventDefault();
                        if (this.activeIndex === 0) {
                            return;
                        }
                        this.setSelection(this.liCollections[0], e);
                        break;
                    case 35:
                        e.preventDefault();
                        var lastLi = this.getItems().length - 1;
                        if (this.activeIndex === lastLi) {
                            return;
                        }
                        this.setSelection(this.liCollections[lastLi], e);
                        break;
                    case 13:
                        this.selectCurrentItem(e);
                        break;
                    case 27:
                    case 9:
                        if (this.isPopupOpen) {
                            this.hidePopup();
                        }
                        break;
                }
            }
        };
        ejComboBox.prototype.getPageCount = function () {
            var liHeight = (this.list.className.indexOf(comboBoxClasses.noData) > -1) ? null :
                typeof getComputedStyle !== 'undefined' ? getComputedStyle(this.getItems()[0], null).getPropertyValue('height') : this.getItems()[0]["currentStyle"]['height'];
            return Math.round(this.list.getBoundingClientRect().height / parseInt(liHeight, 10));
        };
        ejComboBox.prototype.pageUpSelection = function (steps, event) {
            var previousItem = steps >= 0 ? this.liCollections[steps + 1] : this.liCollections[0];
            this.setSelection(previousItem, event);
        };
        ;
        ejComboBox.prototype.pageDownSelection = function (steps, event) {
            var list = this.getItems();
            var previousItem = steps <= list.length ? this.liCollections[steps - 1] : this.liCollections[list.length - 1];
            this.setSelection(previousItem, event);
        };
        ;
        ejComboBox.prototype.getValueByText = function (text, ignoreCase) {
            var value = null;
            var dataSource = this.listData;
            var textField = this.model.fields.text ? this.model.fields.text : 'text';
            var valueField = this.model.fields.value ? this.model.fields.value : textField;
            if (ignoreCase) {
                if (typeof dataSource[0] === 'string' || typeof dataSource[0] === 'number') {
                    for (var _i = 0, dataSource_1 = dataSource; _i < dataSource_1.length; _i++) {
                        var item = dataSource_1[_i];
                        if (String(item).toLowerCase() === text.toString().toLowerCase()) {
                            value = typeof dataSource[0] === 'string' ? String(item) : this.getFormattedValue(String(item));
                            break;
                        }
                    }
                }
                else {
                    dataSource.filter(function (item) {
                        var itemText = item[textField].toString();
                        if (itemText.toLowerCase() === text.toLowerCase()) {
                            value = item[valueField];
                            return true;
                        }
                    });
                }
            }
            else {
                if (typeof dataSource[0] === 'string' || typeof dataSource[0] === 'number') {
                    for (var _a = 0, dataSource_2 = dataSource; _a < dataSource_2.length; _a++) {
                        var item = dataSource_2[_a];
                        if (String(item) === text.toString()) {
                            value = typeof dataSource[0] === 'string' ? text : this.getFormattedValue(text);
                            break;
                        }
                    }
                }
                else {
                    dataSource.filter(function (item) {
                        if (item[textField] === text) {
                            value = item[valueField];
                            return true;
                        }
                    });
                }
            }
            return value;
        };
        ;
        ejComboBox.prototype.removeSelection = function () {
            var selectedItems = this.list.querySelectorAll('.' + comboBoxClasses.selected);
            if (selectedItems.length) {
                $(selectedItems).removeClass(comboBoxClasses.selected);
                selectedItems[0].removeAttribute('aria-selected');
            }
        };
        ;
        ejComboBox.prototype.listonActionComplete = function (ulElement, list, e, isUpdated) {
            if (this.isNotSearchList) {
                this.isNotSearchList = false;
                return;
            }
            if (this.isActive) {
                var selectedItem = this.selectedLI ? this.selectedLI.cloneNode(true) : null;
                this.baseonActionComplete(ulElement, list, e);
                if (this.isRequested && !ej.isNullOrUndefined(this.searchKeyEvent) && this.searchKeyEvent.type === 'keydown') {
                    this.isRequested = false;
                    this.keyActionHandler(this.searchKeyEvent);
                    this.searchKeyEvent = null;
                }
                if (this.isRequested && !ej.isNullOrUndefined(this.searchKeyEvent)) {
                    this.incrementalSearch(this.searchKeyEvent);
                    this.searchKeyEvent = null;
                }
                this.list.scrollTop = 0;
                if (!ej.isNullOrUndefined(ulElement)) {
                    $(ulElement).attr({ 'id': this.element[0].id + '_options', 'role': 'listbox', 'aria-hidden': 'false' });
                }
                if (this.initRemoteRender) {
                    this.initial = true;
                    this.activeIndex = this.model.index;
                    this.updateValues();
                    this.initRemoteRender = false;
                    this.initial = false;
                }
                if (this.model.allowFiltering && !this.isTyped) {
                    if (!this.actionCompleteData.isUpdated) {
                        this.actionCompleteData = { ulElement: ulElement.cloneNode(true), list: list, isUpdated: true };
                    }
                    this.addNewItem(list, selectedItem);
                    if (!ej.isNullOrUndefined(this.itemData)) {
                        this.focusIndexItem();
                    }
                }
                if (this.beforePopupOpen) {
                    this.renderPopup();
                }
            }
        };
        ejComboBox.prototype.addNewItem = function (listData, newElement) {
            var _this = this;
            if (!ej.isNullOrUndefined(this.itemData) && !ej.isNullOrUndefined(newElement)) {
                var value_2 = this.getItemData()["value"];
                var isExist = listData.some(function (data) {
                    return data[_this.model.fields.value] === value_2;
                });
                if (!isExist) {
                    this.addItem(this.itemData);
                    this.actionCompleteData.list.push(this.itemData);
                    this.actionCompleteData.ulElement.appendChild(newElement);
                }
                var selectedItems = void 0;
                var ulElement = this.actionCompleteData.ulElement;
                selectedItems = ulElement.querySelectorAll('.' + comboBoxClasses.selected);
                if (selectedItems.length) {
                    $(selectedItems).removeClass(comboBoxClasses.selected);
                    selectedItems[0].removeAttribute('aria-selected');
                }
            }
        };
        ejComboBox.prototype.removeFocus = function () {
            var highlightedItem = this.list.querySelectorAll('.' + comboBoxClasses.focus);
            if (highlightedItem && highlightedItem.length) {
                $(highlightedItem).removeClass(comboBoxClasses.focus);
            }
        };
        ;
        ejComboBox.prototype.getItemData = function () {
            var textField = this.model.fields.text ? this.model.fields.text : 'text';
            var valueField = this.model.fields.value ? this.model.fields.value : textField;
            var dataItem = {};
            dataItem = this.itemData;
            var value = (!ej.isNullOrUndefined(dataItem) &&
                (!ej.isNullOrUndefined(dataItem[valueField])) ? dataItem[valueField] : dataItem);
            var text = (!ej.isNullOrUndefined(dataItem) &&
                (!ej.isNullOrUndefined(dataItem[textField])) ? dataItem[textField] : dataItem);
            return { value: value, text: text };
        };
        ejComboBox.prototype.isValidLI = function (li) {
            return (li && li.hasAttribute('role') && li.getAttribute('role') === 'option');
        };
        ;
        ejComboBox.prototype.getSelectionPoints = function () {
            var input = this.inputElement;
            return { start: Math.abs(input.selectionStart), end: Math.abs(input.selectionEnd) };
        };
        ejComboBox.prototype.updateSelectedItem = function (li, e, preventSelect) {
            this.removeSelection();
            $(li).addClass(comboBoxClasses.selected);
            this.removeHover();
            var value = this.getFormattedValue(li.getAttribute('data-value'));
            this.item = li;
            this.itemData = this.getDataByValue(value);
            if (!this.initial && !preventSelect) {
                this.isSelected = true;
                var eventArgs = {
                    e: e,
                    item: this.item,
                    itemData: this.itemData,
                    isInteracted: e ? true : false,
                    text: this.itemData[this.model.fields.text],
                    value: this.itemData[this.model.fields.value]
                };
                this._trigger('select', eventArgs);
            }
            var focusedItem = this.list.querySelector('.' + comboBoxClasses.focus);
            if (focusedItem) {
                $(focusedItem).removeClass(comboBoxClasses.focus);
            }
            li.setAttribute('aria-selected', 'true');
            this.activeIndex = this.getIndexByValue(value);
        };
        ejComboBox.prototype.setHiddenValue = function () {
            if (!ej.isNullOrUndefined(this.value())) {
                var optionEle = document.createElement('option');
                optionEle.innerText = this.model.text;
                optionEle.selected = true;
                optionEle.setAttribute('value', this.value());
                $(this.hiddenElement).append(optionEle);
            }
            else {
                this.hiddenElement.innerHTML = '';
            }
        };
        ejComboBox.prototype.detachChangeEvent = function (eve) {
            this.isSelected = false;
            this.previousValue = this.value();
            this.activeIndex = this.model.index;
            this.typedString = !ej.isNullOrUndefined(this.model.text) ? this.model.text : '';
            if (!this.initial) {
                this.setHiddenValue();
                var eventArgs = {
                    e: eve,
                    item: this.item,
                    itemData: this.itemData,
                    isInteracted: eve ? true : false,
                    value: this.value()
                };
                this._trigger("_change", { value: this.value() });
                this._trigger('change', eventArgs);
            }
        };
        ejComboBox.prototype.getElementByValue = function (value) {
            var item;
            var listItems = this.getItems();
            for (var _i = 0, listItems_1 = listItems; _i < listItems_1.length; _i++) {
                var liItem = listItems_1[_i];
                if (this.getFormattedValue(liItem.getAttribute('data-value')) === value) {
                    item = liItem;
                    break;
                }
            }
            return item;
        };
        ;
        ejComboBox.prototype.getElementByText = function (text) {
            return this.getElementByValue(this.getValueByText(text));
        };
        ejComboBox.prototype.listsearchLists = function (e) {
            var _this = this;
            this.isTyped = true;
            this.activeIndex = null;
            if (this.filterInput.parentElement.querySelector('.' + comboBoxClasses.clearIcon)) {
                var clearElement = this.filterInput.parentElement.querySelector('.' + comboBoxClasses.clearIcon);
                clearElement.style.visibility = this.filterInput.value === '' ? 'hidden' : 'visible';
            }
            if (this.model.allowFiltering) {
                this._trigger('filtering', {
                    text: this.filterInput.value,
                    updateData: function (dataSource, query, fields) {
                        if (!ej.isNullOrUndefined(_this.filterInput)) {
                            _this.beforePopupOpen = true;
                            if ($.trim(_this.filterInput.value) === '') {
                                _this.actionCompleteData.isUpdated = false;
                                _this.isTyped = false;
                                _this.onActionComplete(_this.actionCompleteData.ulElement, _this.actionCompleteData.list);
                                _this.isTyped = true;
                                _this.isNotSearchList = true;
                            }
                            else {
                                _this.isNotSearchList = false;
                                _this.resetList(dataSource, fields, query);
                            }
                        }
                    },
                    event: e
                });
            }
        };
        ejComboBox.prototype.focusIndexItem = function () {
            var value = this.getItemData()["value"];
            this.activeIndex = this.getIndexByValue(value);
            var element = this.list.querySelector('[data-value="' + value + '"]');
            this.selectedLI = element;
            this.activeItem(element);
            this.removeFocus();
        };
        ejComboBox.prototype.activeItem = function (li) {
            if (this.isValidLI(li) && li.className.indexOf(comboBoxClasses.selected) == -1) {
                this.removeSelection();
                $(li).addClass(comboBoxClasses.selected);
                this.removeHover();
                li.setAttribute('aria-selected', 'true');
            }
        };
        ejComboBox.prototype.removeFillSelection = function () {
            if (this.isInteracted) {
                var selection = this.getSelectionPoints();
                this.inputElement.setSelectionRange(selection["end"], selection["end"]);
            }
        };
        ejComboBox.prototype.listsetValue = function (e) {
            var dataItem = this.getItemData();
            if (ej.isNullOrUndefined(dataItem["value"])) {
                this.setInputValue(null, this.inputElement, this.model.showClearButton);
            }
            else {
                this.setInputValue(dataItem["text"], this.inputElement, this.model.showClearButton);
            }
            if (this.previousValue === dataItem["value"]) {
                this.isSelected = false;
                return true;
            }
            else {
                this.isSelected = !this.initial ? true : false;
                this.isSelectCustom = false;
                return false;
            }
        };
        ejComboBox.prototype.listsetSelection = function (li, e) {
            if (this.isValidLI(li) && li.className.indexOf(comboBoxClasses.selected) == -1) {
                this.updateSelectedItem(li, e, false);
            }
            if (this.list) {
                this.removeHover();
            }
            this.selectedLI = li;
            if (this.setValue(e)) {
                return;
            }
            if (this.model.valueTemplate && this.itemData !== null) {
                var compiledString = void 0;
                if (!this.valueTempElement) {
                    this.valueTempElement = ej.buildTag('span.' + comboBoxClasses.value)[0];
                    this.inputElement.parentElement.insertBefore(this.valueTempElement, this.inputElement);
                    this.inputElement.style.display = 'none';
                    this.inputWrapper.container.focus();
                    $(this.inputWrapper.container).addClass(comboBoxClasses.inputFocus);
                }
                this.valueTempElement.innerHTML = '';
                this.valueTempElement.innerHTML = this.model.valueTemplate;
            }
            else if (this.inputElement.previousSibling === this.valueTempElement) {
                $(this.valueTempElement).remove();
                this.inputElement.style.display = 'block';
            }
            if (this.isPopupOpen) {
                $(this.inputElement).attr({ 'aria-activedescendant': this.selectedLI ? this.selectedLI.id : null });
            }
            if ((!this.isPopupOpen && !ej.isNullOrUndefined(li)) || (this.isPopupOpen && !ej.isNullOrUndefined(e) &&
                (e.type !== 'keydown' || e.type === 'keydown' && e.keyCode === 13))) {
                this.isSelectCustom = false;
                this.onChangeEvent(e);
            }
            if (this.isPopupOpen && !ej.isNullOrUndefined(this.selectedLI) && this.itemData !== null && (!e || e.type !== 'click')) {
                this.setScrollPosition(e);
            }
        };
        ejComboBox.prototype.setScrollPosition = function (e) {
            if (!ej.isNullOrUndefined(e)) {
                switch (e.keyCode) {
                    case 34:
                    case 40:
                    case 35:
                        this.scrollBottom();
                        break;
                    default:
                        this.scrollTop();
                        break;
                }
            }
            else {
                this.scrollBottom(true);
            }
        };
        ejComboBox.prototype.scrollBottom = function (isInitial) {
            var currentOffset = this.list.offsetHeight;
            var nextBottom = this.selectedLI.offsetTop + this.selectedLI.offsetHeight - this.list.scrollTop;
            var nextOffset = this.list.scrollTop + nextBottom - currentOffset;
            nextOffset = isInitial ? nextOffset + parseInt(typeof getComputedStyle !== 'undefined' ? getComputedStyle(this.list).paddingTop : this.list["currentStyle"]['paddingTop'], 10) * 2 : nextOffset;
            var boxRange = this.selectedLI.offsetTop + this.selectedLI.offsetHeight - this.list.scrollTop;
            boxRange = this.model.fields.groupBy && !ej.isNullOrUndefined(this.fixedHeaderElement) ?
                boxRange - this.fixedHeaderElement.offsetHeight : boxRange;
            if (this.activeIndex === 0) {
                this.list.scrollTop = 0;
            }
            else if (nextBottom > currentOffset || !(boxRange > 0 && this.list.offsetHeight > boxRange)) {
                this.list.scrollTop = nextOffset;
            }
        };
        ejComboBox.prototype.scrollTop = function () {
            var nextOffset = this.selectedLI.offsetTop - this.list.scrollTop;
            var nextBottom = this.selectedLI.offsetTop + this.selectedLI.offsetHeight - this.list.scrollTop;
            nextOffset = this.model.fields.groupBy && !ej.isNullOrUndefined(this.fixedHeaderElement) ?
                nextOffset - this.fixedHeaderElement.offsetHeight : nextOffset;
            var boxRange = (this.selectedLI.offsetTop + this.selectedLI.offsetHeight - this.list.scrollTop);
            if (this.activeIndex === 0) {
                this.list.scrollTop = 0;
            }
            else if (nextOffset < 0) {
                this.list.scrollTop = this.list.scrollTop + nextOffset;
            }
            else if (!(boxRange > 0 && this.list.offsetHeight > boxRange)) {
                this.list.scrollTop = this.selectedLI.offsetTop - (this.model.fields.groupBy && !ej.isNullOrUndefined(this.fixedHeaderElement) ?
                    this.fixedHeaderElement.offsetHeight : 0);
            }
        };
        ejComboBox.prototype.onChangeEvent = function (eve) {
            var dataItem = this.getItemData();
            var index = this.isSelectCustom ? null : this.activeIndex;
            this.value(dataItem["value"]);
            this.model.index = index;
            this.model.text = dataItem["text"];
            if (!(this.isWatermark)) {
                if (ej.isNullOrUndefined(this.model.text)) {
                    this.hiddenSpan.css("display", "block");
                }
                else
                    this.hiddenSpan.css("display", "none");
            }
            this.detachChangeEvent(eve);
        };
        ;
        ejComboBox.prototype.setPlaceholder = function (placeholder, element) {
            var parentElement;
            parentElement = $(element).parent()[0];
            this.isWatermark = $(document.createElement('input')).attr("placeholder", '')[0].hasAttribute("placeholder");
            if (!ej.isNullOrUndefined(placeholder) && placeholder !== '') {
                $(element).attr({ 'placeholder': placeholder, 'aria-placeholder': placeholder });
                if (!(this.isWatermark)) {
                    this.hiddenSpan = ej.buildTag("span.e-input e-placeholder ").insertAfter(element);
                    this.hiddenSpan.text(placeholder);
                    this.hiddenSpan.css("display", "block");
                }
            }
            else {
                element.removeAttribute('placeholder');
                element.removeAttribute('aria-placeholder');
            }
        };
        ejComboBox.prototype.setReadonly = function (isReadonly, element) {
            if (isReadonly) {
                $(element).attr({ readonly: '' });
            }
            else {
                element.removeAttribute('readonly');
            }
        };
        ejComboBox.prototype.setEnableRtl = function () {
            if (this.model.enableRtl) {
                $(this.inputElement.parentElement).addClass(comboBoxClasses.rtl);
                if (this.popupObj)
                    $(this.popupObj).addClass(comboBoxClasses.rtl);
            }
            else {
                $(this.inputElement.parentElement).removeClass(comboBoxClasses.rtl);
                if (this.popupObj)
                    $(this.popupObj).removeClass(comboBoxClasses.rtl);
            }
        };
        ejComboBox.prototype.listrender = function () {
            if (this.element[0].tagName === 'INPUT') {
                this.inputElement = this.element[0];
            }
            else {
                this.inputElement = ej.buildTag('input')[0];
                if (this.element[0].tagName !== 'EJ-COMBOBOX') {
                    this.element[0].style.display = 'none';
                }
                this.element[0].parentElement.insertBefore(this.inputElement, this.element[0]);
            }
            this.inputWrapper = this.createInput({
                element: this.inputElement,
                buttons: [comboBoxClasses.icon],
                properties: {
                    readonly: this.model.readonly,
                    showClearButton: this.model.showClearButton
                },
            });
            this.setPlaceholder(this.model.placeholder, this.inputElement);
            this.setCssClass(this.model.cssClass);
            this.setEnable();
            this.setEnableRtl();
            if (this.element[0].tagName === 'EJ-COMBOBOX') {
                this.element[0].appendChild(this.inputWrapper.container);
            }
            else {
                this.inputElement.parentElement.insertBefore(this.element[0], this.inputElement);
            }
            var name = this.element[0].getAttribute('name') ? this.element[0].getAttribute('name') : this.element[0].getAttribute('id');
            this.hiddenElement = ej.buildTag('select', null, null, { 'name': name, 'aria-hidden': 'true', 'class': 'e-ddl-hidden', 'tabindex': '-1', })[0];
            $(this.inputWrapper.container).prepend(this.hiddenElement);
            this.element[0].removeAttribute('name');
            this.inputWrapper.container.style.width = this.formatUnit(this.model.width);
            $(this.inputWrapper.container).addClass('e-ddl');
            this.wireEvent();
            this.tabIndex = this.element[0].hasAttribute('tabindex') ? this.element[0].getAttribute('tabindex') : '0';
            this.element[0].removeAttribute('tabindex');
            var id = this.element[0].getAttribute('id') ? this.element[0].getAttribute('id') : 'dropdownlist' + ej.getGuid('dropdownlist');
            this.element[0].id = id;
            this.inputElement.setAttribute('tabindex', this.tabIndex);
            $(this.inputElement).attr(this.getAriaAttributes());
            this.setHTMLAttributes();
            if (!ej.isNullOrUndefined(this.value()) || !ej.isNullOrUndefined(this.activeIndex) || !ej.isNullOrUndefined(this.model.text)) {
                this.initValue();
            }
            else if (this.element[0].tagName === 'SELECT' && this.element[0].options[0]) {
                var selectElement = this.element[0];
                this.value(selectElement.options[selectElement.selectedIndex]["value"]);
                this.model.text = ej.isNullOrUndefined(this.value()) ? null : selectElement.options[selectElement.selectedIndex].textContent;
                this.initValue();
            }
            if (!this.model.enabled) {
                this.inputElement.tabIndex = -1;
            }
            this.initial = false;
            this.element[0].style.opacity = '';
        };
        ;
        ejComboBox.prototype.setHTMLAttributes = function () {
            if (!ej.isNullOrUndefined(Object.keys) && Object.keys(this.model.htmlAttributes).length) {
                for (var _i = 0, _a = Object.keys(this.model.htmlAttributes); _i < _a.length; _i++) {
                    var htmlAttr = _a[_i];
                    if (htmlAttr === 'class')
                        this.setCssClass(this.model.htmlAttributes[htmlAttr]);
                    else if (htmlAttr === 'disabled' && this.model.htmlAttributes[htmlAttr] === 'disabled') {
                        this.model.enabled = false;
                        this.setEnable();
                    }
                    else if (htmlAttr === 'readonly' && this.model.htmlAttributes[htmlAttr] === 'readonly')
                        this._setModel({ "readonly": true });
                    else if (htmlAttr === 'style')
                        this.inputWrapper.container.setAttribute('style', this.model.htmlAttributes[htmlAttr]);
                    else {
                        var defaultAttr = ['title', 'id', 'placeholder'];
                        var validateAttr = ['name', 'required'];
                        if (validateAttr.indexOf(htmlAttr) > -1) {
                            this.hiddenElement.setAttribute(htmlAttr, this.model.htmlAttributes[htmlAttr]);
                        }
                        else if (defaultAttr.indexOf(htmlAttr) > -1) {
                            htmlAttr === 'placeholder' ? this.setPlaceholder(this.model.htmlAttributes[htmlAttr], this.inputElement) :
                                this.element[0].setAttribute(htmlAttr, this.model.htmlAttributes[htmlAttr]);
                        }
                        else
                            this.inputWrapper.container.setAttribute(htmlAttr, this.model.htmlAttributes[htmlAttr]);
                    }
                }
            }
        };
        ejComboBox.prototype.setCssClass = function (cssClass) {
            $(this.inputWrapper.container).addClass(cssClass);
            if (this.popupObj)
                $(this.popupObj).addClass(cssClass);
        };
        ejComboBox.prototype.setEnable = function () {
            var disabledAttrs = { 'disabled': 'disabled', 'aria-disabled': 'true' };
            if (this.model.enabled) {
                $(this.inputElement).removeAttr("disabled aria-disabled").removeClass(comboBoxClasses.disable).attr('aria-disabled', 'false');
                $(this.inputWrapper.container).removeClass(comboBoxClasses.disable);
                this.inputElement.tabIndex = parseInt(this.tabIndex);
            }
            else {
                $(this.inputElement).attr(disabledAttrs).addClass(comboBoxClasses.disable).attr('aria-disabled', 'true');
                this.hidePopup();
                $(this.inputWrapper.container).addClass(comboBoxClasses.disable);
            }
        };
        ejComboBox.prototype.initValue = function () {
            this.renderList();
            if (this.model.dataSource instanceof ej.DataManager) {
                this.initRemoteRender = true;
            }
            else {
                this.updateValues();
            }
        };
        ejComboBox.prototype.renderList = function (isEmptyData) {
            this.baserender(isEmptyData);
            this.wireListEvents();
        };
        ejComboBox.prototype.wireListEvents = function () {
            this._on($(this.list), 'click', this.onMouseClick);
            this._on($(this.list), 'mouseover', this.onMouseOver);
            this._on($(this.list), 'mouseout', this.removeHover);
        };
        ;
        ejComboBox.prototype.onMouseClick = function (e) {
            var target = e.target;
            var li = $(target).closest('.' + comboBoxClasses.li)[0];
            if (!this.isValidLI(li)) {
                return;
            }
            this.setSelection(li, e);
            var delay = 100;
            this.closePopup(delay);
        };
        ejComboBox.prototype.onMouseOver = function (e) {
            var currentLi = $(e.target).closest('.' + comboBoxClasses.li)[0];
            this.setHover(currentLi);
        };
        ;
        ejComboBox.prototype.setHover = function (li) {
            if (this.model.enabled && this.isValidLI(li) && li.className.indexOf(comboBoxClasses.hover) == -1) {
                this.removeHover();
                $(li).addClass(comboBoxClasses.hover);
            }
        };
        ;
        ejComboBox.prototype.removeHover = function () {
            var hoveredItem = this.list.querySelectorAll('.' + comboBoxClasses.hover);
            if (hoveredItem && hoveredItem.length) {
                $(hoveredItem).removeClass(comboBoxClasses.hover);
            }
        };
        ;
        ejComboBox.prototype.baserender = function (isEmptyData) {
            this.list = ej.buildTag('div.' + comboBoxClasses.content, "", {}, { 'tabindex': '0' })[0];
            $(this.list).addClass('e-dropdownbase');
            var group = this.element[0].querySelector('select>optgroup');
            if (this.model.fields.groupBy || !ej.isNullOrUndefined(group)) {
                this._on($(this.list), 'scroll', this.setFloatingHeader);
            }
            this.setEnableRtl();
            this.setEnable();
            if (!isEmptyData) {
                this.initialize();
            }
        };
        ;
        ejComboBox.prototype.initialize = function () {
            this.bindEvent = true;
            if (this.element[0].tagName === 'SELECT') {
                var dataCount = void 0;
                if (this.model.dataSource instanceof Array)
                    dataCount = this.model.dataSource;
                var dataSource = this.model.dataSource instanceof Array ? (dataCount.length > 0 ? true : false)
                    : !ej.isNullOrUndefined(this.model.dataSource) ? true : false;
                if (!dataSource) {
                    this.renderItemsBySelect();
                }
            }
            else {
                this.setListData(this.model.dataSource, this.model.fields, this.model.query);
            }
        };
        ;
        ejComboBox.prototype.renderItemsBySelect = function () {
            var element = this.element[0];
            var fields = { value: 'value', text: 'text' };
            var jsonElement = [];
            var group = element.querySelectorAll('select>optgroup');
            var option = element.querySelectorAll('select>option');
            this.getJSONfromOption(jsonElement, option, fields);
            if (group.length) {
                for (var i = 0; i < group.length; i++) {
                    var item = group[i];
                    var optionGroup = {};
                    optionGroup[fields.text] = item.label;
                    optionGroup["isHeader"] = true;
                    var child = item.querySelectorAll('option');
                    jsonElement.push(optionGroup);
                    this.getJSONfromOption(jsonElement, child, fields);
                }
                var items = element.querySelectorAll('select>option');
            }
            this.model.fields.text = fields.text;
            this.model.fields.value = fields.value;
            this.resetList(jsonElement, fields);
        };
        ejComboBox.prototype.getJSONfromOption = function (items, options, fields) {
            for (var _i = 0, options_1 = options; _i < options_1.length; _i++) {
                var option = options_1[_i];
                var json = {};
                json[fields.text] = option.innerText;
                json[fields.value] = option.getAttribute(fields.value) ? option.getAttribute(fields.value) : option.innerText;
                items.push(json);
            }
        };
        ejComboBox.prototype.setFloatingHeader = function (e) {
            if (ej.isNullOrUndefined(this.fixedHeaderElement)) {
                this.fixedHeaderElement = ej.buildTag('div.' + comboBoxClasses.fixedHead)[0];
                if (this.list.querySelector('li').className.indexOf(comboBoxClasses.group) == -1) {
                    this.fixedHeaderElement.style.display = 'none';
                }
                $(this.list).prepend(this.fixedHeaderElement);
                this.setFixedHeader();
            }
            this.scrollStop(e);
        };
        ejComboBox.prototype.setFixedHeader = function () {
            this.list.parentElement.style.display = 'block';
            var liWidth = this.liCollections[0].offsetWidth;
            this.fixedHeaderElement.style.width = liWidth.toString() + 'px';
            $(this.fixedHeaderElement).css({ zIndex: 10 });
            var firstLi = this.ulElement.querySelector('.' + comboBoxClasses.group);
            this.fixedHeaderElement.innerHTML = firstLi.innerHTML;
        };
        ejComboBox.prototype.scrollStop = function (e) {
            var target = e.target;
            var liHeight = parseInt(typeof getComputedStyle !== 'undefined' ? getComputedStyle(this.liCollections[0], null).getPropertyValue('height') : this.liCollections[0]["currentStyle"]['height'], 10);
            var topIndex = Math.round(target.scrollTop / liHeight);
            var liCollections = this.ulElement.querySelectorAll('li');
            for (var i = topIndex; i > -1; i--) {
                if (!ej.isNullOrUndefined(liCollections[i]) && liCollections[i].className.indexOf(comboBoxClasses.group) > -1) {
                    var currentLi = liCollections[i];
                    this.fixedHeaderElement.innerHTML = currentLi.innerHTML;
                    this.fixedHeaderElement.style.display = 'block';
                    break;
                }
                else {
                    this.fixedHeaderElement.style.display = 'none';
                }
            }
        };
        ejComboBox.prototype.getFormattedValue = function (value) {
            if (this.listData && this.listData.length) {
                if (typeof this.listData[0][this.model.fields.value ? this.model.fields.value : 'value'] === 'number' ||
                    typeof this.listData[0] === 'number') {
                    return parseInt(value, 10);
                }
            }
            return value;
        };
        ejComboBox.prototype.baseonActionComplete = function (ulElement, list, e) {
            this.listData = list;
            this.list.innerHTML = '';
            this.list.appendChild(ulElement);
            this.liCollections = this.list.querySelectorAll('.' + comboBoxClasses.li);
            this.ulElement = this.list.querySelector('ul');
            this.postRender(this.list, list, this.bindEvent);
        };
        ejComboBox.prototype.getIndexByValue = function (value) {
            var index;
            var listItems = this.getItems();
            for (var i = 0; i < listItems.length; i++) {
                if (listItems[i].getAttribute('data-value') === value.toString()) {
                    index = i;
                    break;
                }
            }
            return index;
        };
        ;
        ejComboBox.prototype.getItems = function () {
            return this.ulElement.querySelectorAll('.' + comboBoxClasses.li);
        };
        ;
        ejComboBox.prototype.postRender = function (listElement, list, bindEvent) {
            var focusItem = listElement.querySelector('.' + comboBoxClasses.li);
            var selectedItem = listElement.querySelector('.' + comboBoxClasses.selected);
            if (focusItem && !selectedItem) {
                $(focusItem).addClass(comboBoxClasses.focus);
            }
            if (list.length <= 0) {
                this.l10nUpdate();
                $(listElement).addClass(comboBoxClasses.noData);
            }
            else {
                $(listElement).removeClass(comboBoxClasses.noData);
            }
            if (this.model.groupTemplate) {
                this.renderGroupTemplate(listElement);
            }
        };
        ejComboBox.prototype.renderGroupTemplate = function (listEle) {
            if (this.model.fields.groupBy !== null && this.model.dataSource || this.element[0].querySelector('.' + comboBoxClasses.group)) {
                var dataSource = this.model.dataSource;
                var grouping = {};
                var headerItems = listEle.querySelectorAll('.' + comboBoxClasses.group);
                dataSource = this.listGroupDataSource(dataSource, this.model.fields);
                for (var _i = 0, _a = listEle.querySelectorAll('.' + comboBoxClasses.group); _i < _a.length; _i++) {
                    var header = _a[_i];
                    grouping[this.model.fields.groupBy] = header.textContent;
                    header.innerHTML = '';
                    $(header).append(this.getTemplatedString(this.model.groupTemplate, grouping));
                }
            }
        };
        ejComboBox.prototype.getTemplatedString = function (template, list) {
            var str = template, start = str.indexOf("${"), end = str.indexOf("}");
            while (start != -1 && end != -1) {
                var content = str.substring(start, end + 1), field = content.replace("${", "").replace("}", "");
                str = str.replace(content, ej.getObject(field, list).toString());
                start = str.indexOf("${"), end = str.indexOf("}");
            }
            return str;
        };
        ejComboBox.prototype.listGroupDataSource = function (dataSource, fields) {
            var ds = new ej.DataManager(dataSource).executeLocal(new ej.Query().group(fields.groupBy));
            dataSource = [];
            for (var j = 0; j < ds["length"]; j++) {
                var itemObj = ds[j].items, grpItem = {};
                grpItem[fields.text] = ds[j].key;
                grpItem['isHeader'] = true;
                grpItem["items"] = itemObj;
                dataSource.push(grpItem);
                for (var k = 0; k < itemObj.length; k++)
                    dataSource.push(itemObj[k]);
            }
            return dataSource;
        };
        ejComboBox.prototype.updateLocalConstant = function () {
            this.localizedLabels = ej.getLocalizedConstants("ej.ComboBox", this.model.locale);
        };
        ejComboBox.prototype.getLocalizedLabels = function (property) {
            return this.localizedLabels[property] === undefined ? ej.ComboBox.Locale['en-US'][property] : this.localizedLabels[property];
        };
        ejComboBox.prototype.l10nUpdate = function (actionFailure) {
            this.updateLocalConstant();
            if (this.model.noRecordsTemplate !== 'No Records Found' || this.model.actionFailureTemplate !== 'The Request Failed') {
                var template = actionFailure ? this.model.actionFailureTemplate : this.model.noRecordsTemplate;
                this.list.innerHTML = template;
            }
            else {
                this.list.innerHTML = actionFailure ? this.getLocalizedLabels('actionFailureTemplate') : this.getLocalizedLabels('noRecordsTemplate');
            }
        };
        ejComboBox.prototype.getTextByValue = function (value) {
            var text;
            var dataSource = this.listData;
            var fields = this.getFields();
            if (typeof dataSource[0] === 'string' || typeof dataSource[0] === 'number') {
                for (var _i = 0, dataSource_3 = dataSource; _i < dataSource_3.length; _i++) {
                    var item = dataSource_3[_i];
                    if (item.toString() === value.toString()) {
                        text = item.toString();
                        break;
                    }
                }
            }
            else {
                dataSource.filter(function (item) {
                    if (!ej.isNullOrUndefined(item[fields.value]) && item[fields.value].toString() === value.toString()) {
                        text = item[fields.text];
                        return true;
                    }
                });
            }
            return text;
        };
        ejComboBox.prototype.getFields = function () {
            var textField = this.model.fields.text ? this.model.fields.text : 'text';
            var valueField = this.model.fields.value ? this.model.fields.value : textField;
            return { value: valueField.toString(), text: textField };
        };
        ejComboBox.prototype.resetList = function (dataSource, fields, query) {
            if (this.list) {
                this.setListData(dataSource, fields, query);
            }
        };
        ejComboBox.prototype.setListData = function (dataSource, fields, query) {
            var _this = this;
            fields = fields ? fields : this.model.fields;
            var ulElement;
            this.isActive = true;
            if (dataSource instanceof ej.DataManager) {
                this.isRequested = true;
                this._trigger('actionBegin');
                dataSource.executeQuery(query ? query : this.model.query ? this.model.query : new ej.Query()).done(function (e) {
                    _this._trigger('actionComplete', e);
                    var listItems = e["result"];
                    ulElement = _this.renderItems(listItems, fields);
                    _this.onActionComplete(ulElement, listItems, e);
                    _this.isRequested = false;
                }).fail(function (e) {
                    _this.isRequested = false;
                    _this.onActionFailure(e);
                });
            }
            else {
                var dataManager = new ej.DataManager(dataSource);
                var listItems = dataManager.executeLocal(query ? query : this.model.query ? this.model.query : new ej.Query());
                ulElement = this.renderItems(listItems, fields);
                this.onActionComplete(ulElement, listItems);
            }
        };
        ejComboBox.prototype.onActionFailure = function (e) {
            this.liCollections = [];
            this._trigger('actionFailure', e);
            this.l10nUpdate(true);
            $(this.list).addClass(comboBoxClasses.noData);
            this.renderPopup();
        };
        ejComboBox.prototype.renderItems = function (listData, fields) {
            var ulElement;
            var dataSource = listData;
            fields["value"] = !(ej.isNullOrUndefined(fields["value"])) ? fields["value"] : fields["text"];
            this.model.fields = fields;
            if (this.model.itemTemplate && listData) {
                if (dataSource && fields.groupBy) {
                    dataSource = this.listgroupDataSource(dataSource, fields);
                    $(this.list).addClass('e-combobox-group');
                }
                else {
                    dataSource = (new ej.DataManager(dataSource).executeLocal((this.model.sortOrder.toLowerCase() == 'descending') ? new ej.Query().sortByDesc(this.model.fields.text) : new ej.Query().sortBy(this.model.fields.text)));
                }
                if (this.model.fields.value && !fields.text) {
                    fields.text = fields.value;
                }
                else if (!fields.value && fields.text) {
                    fields.value = fields.text;
                }
                ulElement = this.listrenderContentTemplate(this.model.itemTemplate, dataSource, fields);
            }
            else {
                if (dataSource && this.model.sortOrder !== 'None')
                    listData = (new ej.DataManager(dataSource).executeLocal((this.model.sortOrder.toLowerCase() == 'descending') ? new ej.Query().sortByDesc(this.model.fields.text) : new ej.Query().sortBy(this.model.fields.text)));
                if (dataSource && fields.groupBy) {
                    listData = this.listGroupDataSource(dataSource, fields);
                    $(this.list).addClass('e-combobox-group');
                }
                ulElement = this.createListItems(listData, (fields.text !== null || fields.value !== null) ? {
                    fields: fields, showIcon: ej.isNullOrUndefined(fields.iconCss) ? false : true
                } : { fields: { value: 'text' } });
            }
            return ulElement;
        };
        ;
        ejComboBox.prototype.listgroupDataSource = function (dataSource, fields) {
            var ds = new ej.DataManager(dataSource).executeLocal(new ej.Query().group(fields.groupBy));
            dataSource = [];
            for (var j = 0; j < ds["length"]; j++) {
                var itemObj = ds[j].items, grpItem = {};
                grpItem[fields.text] = ds[j].key;
                grpItem['isHeader'] = true;
                grpItem["items"] = itemObj;
                dataSource.push(grpItem);
                for (var k = 0; k < itemObj.length; k++)
                    dataSource.push(itemObj[k]);
            }
            return dataSource;
        };
        ejComboBox.prototype.listrenderContentTemplate = function (template, dataSource, fields) {
            var ulElement = ej.buildTag('ul.' + comboBoxClasses.ul, "", {}, { role: 'presentation' })[0];
            var liCollection = [];
            for (var _i = 0, dataSource_4 = dataSource; _i < dataSource_4.length; _i++) {
                var item = dataSource_4[_i];
                var isHeader = item.isHeader;
                var li = ej.buildTag('li.' + ((isHeader) ? comboBoxClasses.group : comboBoxClasses.li), "", {}, { role: 'presentation' })[0];
                if (isHeader)
                    li.innerText = item[fields.text];
                else {
                    $(li).append(this.getTemplatedString(template, item));
                    var value = item[fields.value];
                    li.setAttribute('data-value', value);
                    li.setAttribute('role', 'option');
                }
                liCollection.push(li);
            }
            $(ulElement).append(liCollection);
            return ulElement;
        };
        ejComboBox.prototype.createListItems = function (dataSource, options) {
            if (typeof dataSource[0] === 'string') {
                var subChild = [];
                for (var i = 0; i < dataSource.length; i++)
                    subChild.push(this.generateSingleLevelListItem(dataSource[i], dataSource[i]));
                return ej.buildTag('ul.' + comboBoxClasses.ul, "", {}, { role: 'presentation' }).append(subChild)[0];
            }
            else {
                var curOpt = $.extend({}, defaultListBaseOptions, options), fields = $.extend({}, defaultMappedFields, curOpt.fields), child = [];
                for (var i = 0; i < dataSource.length; i++) {
                    var curItem = dataSource[i], innerEle = [];
                    if (curOpt.showIcon)
                        innerEle.push(ej.buildTag('span.' + 'e-list-icon' + ' ' + curItem[fields.iconCss])[0]);
                    child.push(this.generateSingleLevelListItem(curItem[fields.text], curItem[fields.value], curOpt.itemClass, innerEle, (curItem.hasOwnProperty('isHeader') && curItem.isHeader) ? true : false));
                }
                return ej.buildTag('ul.' + comboBoxClasses.ul + ' ' + curOpt.listClass, "", {}, { role: 'presentation' }).append(child)[0];
            }
        };
        ejComboBox.prototype.generateSingleLevelListItem = function (text, value, className, innerElements, grpLI) {
            var li = ej.buildTag('li.' + (grpLI === true ? comboBoxClasses.group : comboBoxClasses.li) + ' ' + className, "", { role: (grpLI === true ? 'group' : 'presentation') })[0];
            if (grpLI)
                li.innerText = text;
            else {
                li.setAttribute('data-value', value);
                li.setAttribute('role', 'option');
                if (innerElements)
                    $(li).append(innerElements);
                li.appendChild(document.createTextNode(text));
            }
            return li;
        };
        ejComboBox.prototype.getDataByValue = function (value) {
            if (typeof this.listData[0] === 'string' || typeof this.listData[0] === 'number') {
                for (var _i = 0, _a = this.listData; _i < _a.length; _i++) {
                    var item = _a[_i];
                    if (item === value) {
                        return item;
                    }
                }
            }
            else {
                for (var _b = 0, _c = this.listData; _b < _c.length; _b++) {
                    var item = _c[_b];
                    if (item[this.model.fields.value ? this.model.fields.value : 'value'] === value) {
                        return item;
                    }
                }
            }
            return null;
        };
        ejComboBox.prototype.search = function (inputVal, items, searchType, ignoreCase) {
            var listItems = items;
            ignoreCase = ignoreCase !== undefined && ignoreCase !== null ? ignoreCase : true;
            var itemData = { item: null, index: null };
            if (inputVal.length) {
                var strLength = inputVal.length;
                var queryStr = ignoreCase ? inputVal.toLowerCase() : inputVal;
                for (var i = 0, itemsData = listItems; i < itemsData.length; i++) {
                    var item = itemsData[i];
                    var text = (ignoreCase ? $(item).text().toLowerCase() : $(item).text()).replace(/^\s+|\s+$/g, '');
                    if (searchType === 'Equal' && text === queryStr || searchType === 'StartsWith' && text.substr(0, strLength) === queryStr) {
                        itemData["item"] = item;
                        itemData["index"] = i;
                        return { item: item, index: i };
                    }
                }
                return itemData;
            }
            return itemData;
        };
        ejComboBox.prototype.setInputValue = function (value, element, clearButton) {
            if (!(ej.isNullOrUndefined(value)))
                element.value = value;
            if (!ej.isNullOrUndefined(clearButton) && clearButton) {
                var parentElement = $(element).parent()[0];
                var button = $(parentElement).find("." + comboBoxClasses.clearIcon)[0];
                if (element.value && parentElement.className.indexOf('e-input-focus') > -1) {
                    $(button).removeClass(comboBoxClasses.clearIconHide);
                }
                else {
                    $(button).addClass(comboBoxClasses.clearIconHide);
                }
            }
        };
        ejComboBox.prototype.addItem = function (items, itemIndex) {
            if (!this.list || this.list.textContent === this.model.noRecordsTemplate) {
                this.renderList();
            }
            var itemsCount = this.getItems().length;
            var selectedItemValue = this.list.querySelector('.' + comboBoxClasses.selected);
            items = (items instanceof Array ? items : [items]);
            var items1 = (items instanceof Array ? items : [items]);
            var itemsLength = items1.length;
            var index;
            index = (ej.isNullOrUndefined(itemIndex) || itemIndex < 0 || itemIndex > itemsCount - 1) ? itemsCount : itemIndex;
            var fields = this.getFields();
            var liCollections = [];
            for (var i = 0; i < itemsLength; i++) {
                var item = items[i];
                var li = ej.buildTag('li#option-add-' + i + "." + comboBoxClasses.li)[0];
                li.setAttribute('data-value', item[fields.value]);
                li.setAttribute('role', 'option');
                li.appendChild(document.createTextNode(item[fields.text]));
                liCollections.push(li);
                this.listData.push(item);
            }
            if (itemsCount === 0 && ej.isNullOrUndefined(this.list.querySelector('ul'))) {
                this.list.innerHTML = '';
                this.list.appendChild(this.ulElement);
                $(this.ulElement).append(liCollections);
            }
            else {
                for (var i = 0; i < itemsLength; i++) {
                    if (this.liCollections[index]) {
                        this.liCollections[index].parentNode.insertBefore(liCollections[i], this.liCollections[index]);
                    }
                    else {
                        this.ulElement.appendChild(liCollections[i]);
                    }
                    var tempLi = [].slice.call(this.liCollections);
                    tempLi.splice(index, 0, liCollections[i]);
                    this.liCollections = tempLi;
                    index += 1;
                }
            }
        };
        return ejComboBox;
    }(ej.WidgetBase));
    window.ej.widget("ejComboBox", "ej.ComboBox", new ejComboBox());
    window["ejComboBox"] = null;
})(jQuery);
ej.ComboBox.Locale = ej.ComboBox.Locale || {};
ej.ComboBox.Locale["default"] = ej.ComboBox.Locale["en-US"] = {
    noRecordsTemplate: 'No Records Found',
    actionFailureTemplate: 'The Request Failed'
};
var defaultMappedFields = {
    id: 'id',
    text: 'text',
    value: 'value',
    isChecked: 'isChecked',
    enabled: 'enabled',
    iconCss: 'icon',
    tooltip: null,
    htmlAttributes: null,
    imageAttributes: null,
    imageUrl: 'imageUrl',
    groupBy: null
};
var defaultListBaseOptions = {
    showIcon: false,
    fields: defaultMappedFields,
    listClass: '',
    itemClass: '',
    sortOrder: 'None',
    template: null,
    groupTemplate: null
};
;
var comboBoxClasses = {
    input: 'e-input-group',
    mobileFilter: 'e-ddl-device-filter',
    disable: 'e-disabled',
    hover: 'e-hover',
    selected: 'e-active',
    rtl: 'e-rtl',
    li: 'e-list-item',
    focus: 'e-item-focus',
    inputFocus: 'e-input-focus',
    icon: 'e-input-group-icon e-ddl-icon',
    iconAnimation: 'e-icon-anim',
    value: 'e-input-value',
    device: 'e-ddl-device',
    filterInput: 'e-input-filter',
    group: 'e-list-group-item',
    ul: 'e-list-parent e-ul',
    noData: 'e-nodata',
    fixedHead: 'e-fixed-head',
    clearIcon: 'e-clear-icon',
    clearIconHide: 'e-clear-icon-hide',
    popupFullScreen: 'e-popup-full-page',
    footer: 'e-ddl-footer',
    header: 'e-ddl-header',
    backIcon: 'e-input-group-icon e-back-icon e-icons',
    filterBarClearIcon: 'e-input-group-icon e-clear-icon e-icons',
    filterParent: 'e-filter-parent',
    content: 'e-content',
};
var inputObject = {
    container: null,
    buttons: []
};
