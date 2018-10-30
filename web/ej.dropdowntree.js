'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function ($) {
    var ejDropDownTree = (function (_super) {
        __extends(ejDropDownTree, _super);
        function ejDropDownTree(element, options) {
            _super.call(this);
            this._rootCSS = 'e-dropdowntree';
            this._setFirst = false;
            this._requiresID = true;
            this.PluginName = 'ejDropDownTree';
            this.validTags = ['input'];
            this.type = 'editor';
            this.angular = {
                require: ['?ngModel', '^?form', '^?ngModelOptions']
            };
            this.model = null;
            this.defaults = {
                cssClass: '',
                value: null,
                text: null,
                targetId: null,
                delimiter: ',',
                textMode: 'None',
                fullPathDelimiter: '/',
                locale: 'en-US',
                height: '',
                htmlAttributes: {},
                headerTemplate: null,
                footerTemplate: null,
                showRoundedCorner: false,
                enableRTL: false,
                filterType: 'contains',
                caseSensitiveSearch: false,
                enablePersistence: false,
                enableFilterSearch: false,
                enableServerFiltering: false,
                enableIncrementalSearch: true,
                readOnly: false,
                enableAnimation: false,
                validationRules: null,
                validationMessage: null,
                treeViewSettings: {},
                popupSettings: {
                    height: '152px',
                    width: 'auto',
                    showPopupOnLoad: false
                },
                watermarkText: null,
                enabled: true,
                width: '100%'
            };
            this.dataTypes = {
                cssClass: 'string',
                itemsCount: 'number',
                watermarkText: 'string',
                targetId: 'string',
                enableIncrementalSearch: 'boolean',
                cascadeTo: 'string',
                delimiter: 'string',
                showRoundedCorner: 'boolean',
                enableRTL: 'boolean',
                enablePersistence: 'boolean',
                enabled: 'boolean',
                readOnly: 'boolean',
                query: 'data',
                fields: 'data',
                enableAnimation: 'boolean',
                enableSorting: 'boolean',
                validationRules: 'data',
                validationMessage: 'data',
                htmlAttributes: 'object',
                locale: 'string'
            };
            this.value = ej.util.valueFunction('value');
            this.observables = ['value'];
            this.hiddenValue = null;
            this.activeItemIndex = -1;
            this.currentText = null;
            this.currentFullPath = null;
            this.listSize = 0;
            this.isIE8 = false;
            this.textContent = null;
            this.initValue = false;
            this.checkboxValue = false;
            this.isFocused = false;
            this.id = null;
            this.ddWidth = null;
            this.name = null;
            this.popUpShow = false;
            this.maxPopupHeight = null;
            this.minPopupHeight = '20';
            this.maxPopupWidth = null;
            this.minPopupWidth = '0';
            this.visibleNodes = [];
            this.hiddenNodes = [];
            this.filterData = null;
            this.normalData = null;
            this.addData = [];
            this.isupdateData = false;
            if (element) {
                if (!element['jquery']) {
                    element = $('#' + element)[0];
                }
                if (!ej.isNullOrUndefined(element)) {
                    return $(element).ejDropDownTree(options).data(this.PluginName);
                }
            }
        }
        ejDropDownTree.prototype.enable = function () {
            if ($(this.visibleInput).hasClass('e-disable')) {
                this.target.setAttribute('disabled', 'false');
                this.model.enabled = true;
                $(this.container).removeClass('e-disable');
                $(this.visibleInput).removeClass('e-disable');
                $(this.dropdownbutton).removeClass('e-disable');
                if (!ej.isNullOrUndefined(this.popupListWrapper)) {
                    $(this.popupListWrapper).removeClass('e-disable');
                }
                if (this.isIE8) {
                    $(this.drpbtnspan).removeClass('e-disable');
                }
                $(this.container).on('mousedown', $.proxy(this.OnDropdownClick, this));
                this.wrapper.setAttribute('tabindex', '0');
            }
            this.wireEvents();
        };
        ejDropDownTree.prototype.disable = function () {
            if (!$(this.visibleInput).hasClass('e-disable')) {
                this.target.setAttribute('disabled', 'true');
                this.model.enabled = false;
                $(this.container).addClass('e-disable');
                $(this.visibleInput).addClass('e-disable');
                if (!ej.isNullOrUndefined(this.popupListWrapper)) {
                    $(this.popupListWrapper).addClass('e-disable');
                }
                $(this.dropdownbutton).addClass('e-disable');
                if (this.isIE8) {
                    $(this.drpbtnspan).addClass('e-disable');
                }
                $(this.container).off('mousedown', $.proxy(this.OnDropdownClick, this));
                this.unwireEvents();
                this.wrapper.removeAttribute('tabindex');
                if (this.isPopupShown()) {
                    this.hideResult();
                }
            }
        };
        ejDropDownTree.prototype.enabled = function (val) {
            if (val) {
                this.enable();
            }
            else {
                this.disable();
            }
        };
        ejDropDownTree.prototype.getValue = function () {
            return this.visibleInput.value;
        };
        ejDropDownTree.prototype.hidePopup = function () {
            if (this.model.enabled) {
                if (!ej.isNullOrUndefined(this.popupTree)) {
                    this.hideResult();
                }
            }
        };
        ejDropDownTree.prototype.hideResult = function (e) {
            if (this.model && this.isPopupShown()) {
                if (!ej.isNullOrUndefined(e) && !ej.isNullOrUndefined(this.inputSearch) && jQuery(this.inputSearch).querySelector(':foucs')) {
                    if (e.type === 'scroll' && ej.isTouchDevice()) {
                        return false;
                    }
                }
                var proxy_1 = this;
                var args = { model: this.model, text: this.visibleInput.value, value: this.element.val(), cancel: false, type: 'close' };
                if (this._trigger('close', args)) {
                    return;
                }
                $(this.popupListWrapper).slideUp(this.model.enableAnimation ? 100 : 0, function () {
                    $(document).off('mousedown', $.proxy(proxy_1.OnDocumentClick, proxy_1));
                });
                if (this.element != null) {
                    this.element.attr('aria-expanded', 'false');
                }
                if (!(ej.isDevice())) {
                    var ele = ej.getScrollableParents(this.wrapper);
                    $(ele).off('scroll', $.proxy(proxy_1.hideResult, proxy_1));
                }
                if (this.visibleInput != null) {
                    $(this.wrapper).removeClass('e-popactive');
                }
                this.popUpShow = false;
                setTimeout(function () {
                    proxy_1.resetSearch();
                }, 100);
            }
        };
        ejDropDownTree.prototype.resetSearch = function () {
            if ($(this.popupListWrapper).find('.e-atc.e-search .e-cross-circle').length === 1) {
                $(this.popupListWrapper).find('.e-atc.e-search .e-cross-circle').addClass('e-search').removeClass('e-cross-circle');
                var ele = $(this.popupListWrapper).find('.e-atc.e-search .e-cross-circle');
                this._off($(this.popupListWrapper).find('.e-atc.e-search .e-cross-circle'), 'mousedown', this.refreshSearch);
            }
            if (!this.inputSearch || !(this.model && this.model.enableFilterSearch)) {
                return;
            }
            if (this.inputSearch.value !== '') {
                this.inputSearch.value = '';
                var ele = this.popup.querySelector('.e-nosuggestion');
                if (ele) {
                    ele.remove();
                    this.popupTree.style.display = this.treeStyle;
                }
                this.showNodes(Array.prototype.slice.call(this.treeView.element[0].querySelectorAll('li')));
                this.refreshPopup();
            }
        };
        ejDropDownTree.prototype.addItem = function (collection, target) {
            this.treeView.addNodes(collection, target);
            if (this.isPopupShown()) {
                var scrollerPosition = this.scrollerObj ? this.scrollerObj.scrollTop() : 0;
                this.refreshScroller();
                if (this.scrollerObj) {
                    this.scrollerObj.option('scrollTop', scrollerPosition);
                }
            }
        };
        ejDropDownTree.prototype._destroy = function () {
            this.element.insertAfter(this.wrapper);
            this.element.width(this.element.width() + $(this.dropdownbutton).outerWidth());
            $(this.visibleInput).removeClass('e-input');
            this.setAttr(this.element[0], { 'accesskey': $(this.wrapper).attr('accesskey'), type: 'text' });
            if (this.isWatermark) {
                $(this.visibleInput).removeAttr('placeholder');
            }
            this.element.value = '';
            this.element.removeAttr('aria-expanded aria-autocomplete aria-haspopup aria-owns accesskey role').css({ 'width': '', 'display': 'block' });
            this.treeView.destroy();
            this.wrapper.remove();
            $(this.container).off('mousedown', $.proxy(this.OnDropdownClick, this));
            this.hideResult();
            $(this.popupPanelWrapper).remove();
            this.unwireEvents();
        };
        ejDropDownTree.prototype.getSelectedValue = function () {
            return this.element.val();
        };
        ejDropDownTree.prototype.removeSearch = function () {
            this.model.enableFilterSearch = false;
            this.popupListWrapper.querySelector('.e-atc.e-search').remove();
            if (this.isPopupShown()) {
                this.hidePopup();
            }
            this.inputSearch = null;
        };
        ejDropDownTree.prototype.isPopupShown = function () {
            if (!ej.isNullOrUndefined(this.popupListWrapper)) {
                return ($(this.popupListWrapper).css('display') === 'block');
            }
            else {
                return false;
            }
        };
        ejDropDownTree.prototype.OnDropdownClick = function (e) {
            this.preventDefaultAction(e);
            if (($(e.target).is('li') && $(e.target).parent().hasClass('e-boxes')) || ($(e.target).parents('ul').hasClass('e-boxes') && $(e.target).hasClass('e-icon e-close'))) {
                return false;
            }
            if (this.model.readOnly || this.readOnly) {
                return false;
            }
            if (((e.which && e.which === 1) || (e.button && e.button === 0))) {
                this.OnPopupHideShow();
            }
        };
        ejDropDownTree.prototype.OnPopupHideShow = function () {
            if (this.isPopupShown()) {
                this.hideResult();
            }
            else {
                this.selectedElements = (this.model.treeViewSettings.showCheckbox) ? this.treeView.getCheckedNodes() : this.treeView.getSelectedNodes();
                this.showResult();
                if (this.model.enableFilterSearch) {
                    var ele = this.selectedElements;
                    if (ele.length === 0) {
                        this.addHoverClass(this.popupTree.querySelector('.e-ul.e-box .e-text'));
                    }
                    else {
                        var length_1 = ele.length;
                        this.addHoverClass(ele[length_1 - 1].querySelector('a'));
                    }
                    this.inputSearch.focus();
                }
                else {
                    this.wrapper.focus();
                }
            }
        };
        ejDropDownTree.prototype.addHoverClass = function (ele) {
            if ($(ele).hasClass('e-text') && !$(ele).hasClass('e-node-disable')) {
                $(ele).addClass('e-node-hover');
            }
        };
        ejDropDownTree.prototype.showPopup = function () {
            if (this.model.enabled) {
                if (!ej.isNullOrUndefined(this.popupTree)) {
                    this.showResult();
                }
            }
        };
        ejDropDownTree.prototype.showResult = function () {
            var _this = this;
            var proxy = this;
            this.popUpShow = true;
            var args = { model: this.model, text: this.visibleInput.value, value: this.element.val(), cancel: false, type: 'open', refreshPopup: true };
            if (this._trigger('open', args)) {
                return;
            }
            if (args.refreshPopup) {
                this.refreshPopup();
            }
            this.selectedElements = (this.model.treeViewSettings.showCheckbox) ? this.treeView.getCheckedNodes() : this.treeView.getSelectedNodes();
            $(this.popupListWrapper).slideDown(this.model.enableAnimation ? 200 : 1, function () {
                $(document).on('mousedown', $.proxy(proxy.OnDocumentClick, proxy));
                if (!(ej.isDevice())) {
                    var ele = ej.getScrollableParents(_this.wrapper);
                    $(ele).on('scroll', $.proxy(proxy.hideResult, proxy));
                }
            });
            this.element[0].setAttribute('aria-expanded', 'true');
            $(this.wrapper).addClass('e-popactive');
            var eles = this.getSelectedElements();
            if (eles.length !== 0) {
                this.setScrollPosition(eles[eles.length - 1]);
            }
            else {
                var focusedEle = $($(this.getLi()).find('.e-node-focus')).parents('li')[0];
                if (!ej.isNullOrUndefined(focusedEle)) {
                    this.setScrollPosition(focusedEle);
                }
            }
        };
        ejDropDownTree.prototype.getSelectedElements = function () {
            var eles = (!this.model.treeViewSettings.showCheckbox) ? this.treeView.getSelectedNodes() : this.treeView.getCheckedNodes();
            return eles;
        };
        ejDropDownTree.prototype.setScrollPosition = function (liEle) {
            var parentTop = $(this.popupTree).offset().top;
            var childTop = $(liEle).offset().top;
            var scrollerPosition = childTop - parentTop;
            if (this.scrollerObj) {
                this.scrollerObj.option('scrollTop', scrollerPosition);
            }
        };
        ejDropDownTree.prototype.preventDefaultAction = function (e, stopBubble) {
            e.preventDefault ? e.preventDefault() : (e.returnValue = false);
            if (stopBubble) {
                e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true);
            }
        };
        ejDropDownTree.prototype.clearText = function () {
            this.clearTextboxValue();
            this.clearTree();
            if (!this.isWatermark) {
                this.setWatermark();
            }
        };
        ejDropDownTree.prototype.clearTextboxValue = function () {
            this.element.val('');
            $(this.visibleInput).val('');
            this.updateValue(null);
            this.selectedElements = [];
            this.hiddenValue = '';
            this.updateText();
        };
        ejDropDownTree.prototype.clearTree = function () {
            this.treeView.setModel({
                selectedNode: -1,
                selectedNodes: [],
                checkedNodes: []
            });
        };
        ejDropDownTree.prototype.addNode = function (newNodeText, target) {
            var ele = this.popup.querySelector('.e-norecord');
            if (ele) {
                ele.remove();
                this.popupTree.style.display = this.treeStyle;
            }
        };
        ejDropDownTree.prototype.addNodes = function (collection, target) {
            var ele = this.popup.querySelector('.e-norecord');
            if (ele) {
                ele.remove();
                this.popupTree.style.display = this.treeStyle;
            }
        };
        ejDropDownTree.prototype.checkAll = function () {
            if (this.model.treeViewSettings.showCheckbox) {
                var eles = this.treeView.getCheckedNodes();
                for (var j = 0; j < eles.length; j++) {
                    this.selectText(eles[j]);
                }
            }
        };
        ejDropDownTree.prototype.moveNode = function (src, dest, index) {
            var textContent = this.getElementText(src);
            if (this.checkContains(textContent)) {
                this.removeText(textContent);
            }
            this.selectText(src);
        };
        ejDropDownTree.prototype.removeAll = function () {
            this.addEmptyRecord();
            this.clearTextboxValue();
        };
        ejDropDownTree.prototype.addEmptyRecord = function () {
            var ele = this.popup.querySelector('.e-norecord');
            if (!ele) {
                if (!this.popup.querySelector('.e-norecord')) {
                    var ele_1 = document.createElement('div');
                    $(ele_1).addClass('e-norecord');
                    ele_1.style.padding = '14px 16px';
                    ele_1.style.textAlign = 'center';
                    ele_1.innerHTML = this.getLocalizedLabels('noRecordsTemplate');
                    this.popupScroller.appendChild(ele_1);
                    this.treeStyle = this.popupTree.style.display;
                    this.popupTree.style.display = 'none';
                }
            }
        };
        ejDropDownTree.prototype.selectAll = function () {
            if (!this.model.treeViewSettings.showCheckbox) {
                var eles = this.treeView.getSelectedNodes();
                for (var j = 0; j < eles.length; j++) {
                    this.selectText(eles[j]);
                }
            }
        };
        ejDropDownTree.prototype.selectNode = function (element) {
            if (!this.model.treeViewSettings.showCheckbox) {
                for (var i = 0; i < element.length; i++) {
                    this.selectText(element[i]);
                }
            }
        };
        ejDropDownTree.prototype.unCheckAll = function () {
            if (this.model.treeViewSettings.showCheckbox) {
                this.clearTextboxValue();
            }
        };
        ejDropDownTree.prototype.uncheckNode = function (element) {
            if (this.model.treeViewSettings.showCheckbox) {
                for (var i = 0; i < element.length; i++) {
                    this.unselectText(element[i]);
                }
            }
        };
        ejDropDownTree.prototype.unselectAll = function () {
            if (!this.model.treeViewSettings.showCheckbox) {
                this.clearTextboxValue();
            }
        };
        ejDropDownTree.prototype.unselectNode = function (element) {
            if (!this.model.treeViewSettings.showCheckbox) {
                for (var i = 0; i < element.length; i++) {
                    this.unselectText(element[i]);
                }
            }
        };
        ejDropDownTree.prototype.unselectText = function (element) {
            var textContent = this.getElementText(element);
            if (this.checkContains(textContent)) {
                this.removeText(textContent);
            }
        };
        ejDropDownTree.prototype.selectText = function (element) {
            this.currentText = this.getElementText(element);
            if (!this.checkContains(this.currentText)) {
                this.maintainHiddenValue();
                this.addText(this.currentText);
            }
        };
        ejDropDownTree.prototype.validateDelimiter = function (deli) {
            if (this.trim(deli).length === 1) {
                var regEx = /^[a-zA-Z0-9]+$/;
                if (!regEx.test(deli)) {
                    return deli;
                }
            }
            return ',';
        };
        ejDropDownTree.prototype.changeWatermark = function (text) {
            if (!this.model.enabled) {
                return false;
            }
            if (this.isWatermark) {
                $(this.visibleInput).attr('placeholder', text);
            }
            else {
                $(this.hiddenSpan).text(text);
            }
        };
        ejDropDownTree.prototype.roundedCorner = function (val) {
            if (val) {
                $(this.container).addClass('e-corner');
                if (!ej.isNullOrUndefined(this.popupListWrapper)) {
                    $(this.popupListWrapper).addClass('e-corner');
                }
                if (this.inputSearch) {
                    $(this.inputSearch).parents().find('.e-in-wrap').addClass('e-corner');
                }
            }
            else {
                $(this.container).removeClass('e-corner');
                if (!ej.isNullOrUndefined(this.popupListWrapper)) {
                    $(this.popupListWrapper).removeClass('e-corner');
                }
                if (this.inputSearch) {
                    $(this.inputSearch).parents().find('.e-in-wrap').removeClass('e-corner');
                }
            }
        };
        ejDropDownTree.prototype.setAttr = function (element, attrs) {
            if (typeof attrs === 'string') {
                var sAttr = attrs.replace(/['"]/g, '').split('=');
                if (sAttr.length === 2) {
                    $(element).attr(sAttr[0], sAttr[1]);
                }
            }
            else {
                for (var idx in attrs) {
                    if ((idx === 'styles' || idx === 'style') && typeof attrs[idx] === 'object') {
                        for (var prop in attrs[idx]) {
                            element.style[prop] = attrs[idx][prop];
                        }
                    }
                    else {
                        $(element).attr(idx, attrs[idx]);
                    }
                }
            }
            return this;
        };
        ejDropDownTree.prototype.updateText = function () {
            this.model.text = $(this.visibleInput).value === '' ? null : $(this.visibleInput).val();
        };
        ejDropDownTree.prototype.updateValue = function (val) {
            this.value(val === '' ? null : val);
        };
        ejDropDownTree.prototype.setWatermark = function () {
            if ((this.element.val() === '') && this.trim($(this.visibleInput).val().toString()) === '') {
                var watermark = this.model.watermarkText;
                if (this.isWatermark) {
                    $(this.visibleInput).attr('placeholder', watermark);
                }
                else {
                    $(this.hiddenSpan).css('display', 'block').text(watermark);
                }
            }
        };
        ejDropDownTree.prototype.setDimentions = function () {
            if (this.model.height) {
                $(this.wrapper).height(this.model.height);
            }
            if (this.model.width) {
                $(this.wrapper).width(this.model.width);
            }
        };
        ejDropDownTree.prototype.trim = function (val) {
            return typeof val === 'string' ? $.trim(val) : val;
        };
        ejDropDownTree.prototype.wireEvents = function () {
            $(this.wrapper).on('keydown', $.proxy(this.OnKeyDown, this));
            if (!ej.isNullOrUndefined(this.popupList)) {
                $(this.popupList).on('keydown', $.proxy(this.OnKeyDown, this));
            }
            if (!ej.isNullOrUndefined(this.inputSearch)) {
                $(this.inputSearch).on('keydown', $.proxy(this.OnKeyDown, this));
            }
            this._on($(this.wrapper), 'focus', this.targetFocus);
            this._on($(this.wrapper), 'blur', this.targetBlur);
        };
        ejDropDownTree.prototype.unwireEvents = function () {
            this._off($(this.wrapper), 'focus', this.targetFocus);
            this._off($(this.wrapper), 'blur', this.targetBlur);
            $(window).off('resize', $.proxy(this.OnWindowResize, this));
        };
        ejDropDownTree.prototype.updateLocalConstant = function () {
            this.localizedLabels = ej.getLocalizedConstants('ej.DropDownTree', this.model.locale);
        };
        ejDropDownTree.prototype._setModel = function (options) {
            var option;
            for (option in options) {
                switch (option) {
                    case 'delimiter':
                        var delchar = this.model.delimiter;
                        options[option] = this.validateDelimiter(options[option]);
                        this.model.delimiter = options[option];
                        if (!this.isSingleSelect()) {
                            if (this.model.text) {
                                this.model.text = this.model.text.split(delchar).join(this.model.delimiter);
                                $(this.visibleInput).val(this.model.text);
                            }
                            if (!ej.isNullOrUndefined(this.value())) {
                                this.value(this.value().split(delchar).join(this.model.delimiter));
                                this.element.val(this.value());
                            }
                        }
                        break;
                    case 'fullPathDelimiter':
                        this.setFullPathDelimiter(options[option]);
                        break;
                    case 'treeViewSettings':
                        this.model.treeViewSettings = $.extend(true, this.model.treeViewSettings, options[option]);
                        if (!ej.isNullOrUndefined(this.popupTree)) {
                            $(this.popupTree).ejTreeView(this.model.treeViewSettings);
                        }
                        break;
                    case "value":
                        var optionValue = ej.util['getVal'](options[option]);
                        if (ej.isNullOrUndefined(optionValue)) {
                            this.clearTextboxValue();
                        }
                        else {
                            this.setValueText(ej.util['getVal'](options[option]), 'value');
                            options[option] = this.model.value;
                        }
                        break;
                    case "text":
                        if (ej.isNullOrUndefined(options[option])) {
                            this.clearTextboxValue();
                        }
                        else {
                            this.setValueText(options[option], 'text');
                            options[option] = this.model.text;
                        }
                        break;
                    case 'enableRTL':
                        this.setRTL(options[option]);
                        break;
                    case 'enabled':
                        this.enabled(options[option]);
                        break;
                    case 'height':
                        this.changeHeight(options[option]);
                        break;
                    case 'width':
                        this.changeWidth(options[option]);
                        break;
                    case 'popupSettings':
                        this.model.popupSettings = $.extend(true, this.model.popupSettings, options[option]);
                        this.setListWidth();
                        this.setListHeight();
                        this.setInitialPopup(this.model.popupSettings.showPopupOnLoad);
                        break;
                    case 'cssClass':
                        this.changeSkin(options[option]);
                        if (!ej.isNullOrUndefined(this.treeList)) {
                            var myCSS = this.waitingCss(options[option]);
                            this.treeView.setModel({ cssClass: myCSS });
                        }
                        break;
                    case 'watermarkText':
                        this.changeWatermark(options[option]);
                        break;
                    case 'validationRules':
                        if (this.element.closest('form').length != 0) {
                            if (this.model.validationRules != null) {
                                this.element.rules('remove');
                                this.model.validationMessage = null;
                            }
                            this.model.validationRules = options[option];
                            if (this.model.validationRules != null) {
                                this.initValidator();
                                this.setValidation();
                            }
                        }
                        break;
                    case 'locale':
                        this.model.locale = options[option];
                        this.updateLocalConstant();
                        break;
                    case 'validationMessage':
                        if (this.element.closest('form').length != 0) {
                            this.model.validationMessage = options[option];
                            if (this.model.validationRules != null && this.model.validationMessage != null) {
                                this.initValidator();
                                this.setValidation();
                            }
                        }
                        break;
                    case 'showRoundedCorner':
                        this.roundedCorner(options[option]);
                        this.model.showRoundedCorner = options[option];
                        break;
                    case 'targetId':
                        this.model.targetId = options[option];
                        this.treeList();
                        break;
                    case 'htmlAttributes':
                        this.addAttr(options[option]);
                        break;
                    case "enableFilterSearch":
                        if (!options[option])
                            this.removeSearch();
                        else {
                            this.model.enableFilterSearch = true;
                            this.enableSearch();
                        }
                        break;
                }
            }
        };
        ejDropDownTree.prototype._init = function () {
            var browserInfo = ej.browserInfo();
            this.updateLocalConstant();
            this.isIE8 = (browserInfo.name === 'msie' && browserInfo.version === '8.0');
            this.textContent = this.isIE8 ? 'innerText' : 'textContent';
            if ((this.element.is('input') && (this.element.is('input[type=text]') || !this.element.attr('type')))) {
                this.isWatermark = 'placeholder' in $(document.createElement('input')).attr('placeholder', '')[0];
                this.id = this.element[0].id;
                this.initialize();
                this.render();
                this.addAttr(this.model.htmlAttributes);
                this.enabled(this.model.enabled);
                this.initValue = false;
                this.checkboxValue = false;
                if (!(ej.DataManager && !ej.isNullOrUndefined(this.model.treeViewSettings.fields) && this.model.treeViewSettings.fields.dataSource instanceof ej.DataManager)) {
                    this.finalize();
                }
                if (this.model.validationRules != null) {
                    this.initValidator();
                    this.setValidation();
                }
                if (this.model.popupSettings.showPopupOnLoad) {
                    this.setInitialPopup(true);
                }
                this.roundedCorner(this.model.showRoundedCorner);
            }
        };
        ejDropDownTree.prototype.finalize = function () {
            if ((!ej.isNullOrUndefined(this.value()) && this.value() === '') || this.value() !== this.element.val()) {
                this.setValueText(this.value(), 'value');
            }
            if ((!ej.isNullOrUndefined(this.model.text) && this.model.text === '') || this.model.text !== $(this.visibleInput).val()) {
                this.setValueText(this.model.text, 'text');
            }
            this.initialSelection();
            this.updateText();
            if (ej.util.valueFunction(this.value) !== this.element.val() && !(ej.util.valueFunction(this.value) === null && this.element.val() === '')) {
                this.updateValue(this.element.val());
            }
        };
        ejDropDownTree.prototype.setValueText = function (val, fieldType) {
            if (!ej.isNullOrUndefined(this.model.targetId)) {
                var liEle = this.getLi();
                for (var i = 0; i < liEle.length; i++) {
                    var textEle = liEle[i].querySelector('a');
                    if (textEle.innerHTML.toString() === val) {
                        this.treeNodeSelection(i);
                    }
                }
            }
            else {
                var treeSrc = void 0;
                var nodeIndex = -1;
                var mappedField = this.treeMapping(fieldType);
                if (!(this.treeView.dataSource() instanceof ej.DataManager)) {
                    treeSrc = this.model.treeViewSettings.fields.dataSource;
                    for (var i = 0; i < treeSrc.length; i++) {
                        if (ej.getObject(mappedField[0], treeSrc[i]) === val) {
                            this.treeNodeSelection(i);
                        }
                    }
                }
                else {
                    treeSrc = this.treeView._newDataSource;
                    for (var i = 0; i < treeSrc.length; i++) {
                        nodeIndex = nodeIndex + 1;
                        if (ej.getObject(mappedField[0], treeSrc[i]) === val) {
                            this.treeNodeSelection(nodeIndex);
                        }
                        if (!ej.isNullOrUndefined(treeSrc[0].child)) {
                            for (var j = 0; j < treeSrc[i].child.length; j++) {
                                nodeIndex = nodeIndex + 1;
                                if (ej.getObject(mappedField[i], treeSrc[i].child[j]) === val) {
                                    this.treeNodeSelection(nodeIndex);
                                }
                            }
                        }
                    }
                }
            }
        };
        ejDropDownTree.prototype.treeMapping = function (fieldType) {
            var parentValue;
            var childValue;
            var mappedValue = [];
            var parentText = this.model.treeViewSettings.fields.text;
            var childText;
            if (fieldType === 'value') {
                parentValue = (!ej.isNullOrUndefined(this.treeView.model.fields.value)) ? this.treeView.model.fields.value : parentText;
                if (!ej.isNullOrUndefined(this.model.treeViewSettings.fields.child)) {
                    childText = (!ej.isNullOrUndefined(this.model.treeViewSettings.fields.child.text)) ? this.model.treeViewSettings.fields.child.text : parentText;
                    childValue = (!ej.isNullOrUndefined(this.model.treeViewSettings.fields.child.value)) ? this.model.treeViewSettings.fields.child.value : childText;
                }
                else {
                    childText = parentText;
                    childValue = parentValue;
                }
                mappedValue[0] = parentValue;
                mappedValue[1] = childValue;
            }
            else {
                mappedValue[0] = parentText;
                mappedValue[1] = childText;
            }
            return mappedValue;
        };
        ejDropDownTree.prototype.treeNodeSelection = function (index) {
            if (!ej.isNullOrUndefined(this.treeView)) {
                if (this.model.treeViewSettings.showCheckbox) {
                    this.treeView.setModel({ checkedNodes: [index] });
                }
                else {
                    this.treeView.setModel({ selectedNode: index });
                }
            }
        };
        ejDropDownTree.prototype.initialSelection = function () {
            var eles = (!this.model.treeViewSettings.showCheckbox) ? this.treeView.getSelectedNodes() : this.treeView.getCheckedNodes();
            if (!ej.isNullOrUndefined(eles)) {
                this.selectedElements = eles;
                for (var i = 0; i < eles.length; i++) {
                    this.currentText = this.getElementText(eles[i]);
                    this.maintainHiddenValue();
                    this.addText(this.currentText);
                }
            }
        };
        ejDropDownTree.prototype.setInitialPopup = function (value) {
            if (this.model.enabled && !this.model.readOnly) {
                value === false ? this.hideResult() : this.showResult();
            }
        };
        ejDropDownTree.prototype.changeSkin = function (skin) {
            $(this.wrapper).removeClass(this.model.cssClass).addClass(skin);
            if (!ej.isNullOrUndefined(this.popupListWrapper)) {
                $(this.popupListWrapper).removeClass(this.model.cssClass).addClass(skin);
            }
        };
        ejDropDownTree.prototype.setRTL = function (val) {
            if (this.model.enableRTL !== val) {
                this.model.enableRTL = val;
                this.RightToLeft();
                if (!ej.isNullOrUndefined(this.popupListWrapper)) {
                    this.dropbtnRTL();
                }
            }
        };
        ejDropDownTree.prototype.RightToLeft = function () {
            if (this.model.enableRTL) {
                $(this.wrapper).addClass('e-rtl');
            }
            else {
                $(this.wrapper).removeClass('e-rtl');
            }
        };
        ejDropDownTree.prototype.dropbtnRTL = function () {
            if (this.model.enableRTL) {
                $(this.popupListWrapper).addClass('e-rtl').find('.e-resize-handle').addClass('e-rtl-resize');
                $(this.popupList).addClass('e-rtl');
            }
            else {
                $(this.popupListWrapper).removeClass('e-rtl').find('.e-resize-handle').removeClass('e-rtl-resize');
                $(this.popupList).removeClass('e-rtl');
            }
        };
        ejDropDownTree.prototype.formatUnit = function (value) {
            var result = value + '';
            return (result === 'auto' || result.indexOf('%') !== -1 || result.indexOf('px') !== -1) ? result : result + 'px';
        };
        ejDropDownTree.prototype.changeHeight = function (height) {
            $(this.wrapper).height(this.formatUnit(height));
            this.setListHeight();
        };
        ejDropDownTree.prototype.changeWidth = function (width) {
            $(this.wrapper).width(this.formatUnit(width));
            this.setListWidth();
        };
        ejDropDownTree.prototype.setListWidth = function () {
            if (!ej.isNullOrUndefined(this.popupListWrapper)) {
                var width = this.model.popupSettings.width;
                if (width !== 'auto') {
                    $(this.popupListWrapper).css({ 'width': width });
                }
                else {
                    $(this.popupListWrapper).css({ 'min-width': this.validatePixelData(this.minPopupWidth) });
                }
                $(this.popupListWrapper).css({ 'max-width': this.validatePixelData(this.maxPopupWidth) });
            }
        };
        ejDropDownTree.prototype.setListHeight = function () {
            if (!ej.isNullOrUndefined(this.popupListWrapper)) {
                $(this.popupListWrapper).css({ 'max-height': this.validatePixelData(this.model.popupSettings.height), 'min-height': this.validatePixelData(this.minPopupHeight) });
            }
        };
        ejDropDownTree.prototype.validatePixelData = function (data) {
            var result = (data && !isNaN(data)) ? Number(data) : data;
            return result;
        };
        ejDropDownTree.prototype.addAttr = function (htmlAttr) {
            var proxy = this;
            $.map(htmlAttr, function (value, key) {
                var keyName = key.toLowerCase();
                if (keyName === 'class') {
                    $(proxy.wrapper).addClass(value);
                }
                else if (keyName === 'disabled' && value === 'disabled') {
                    proxy.disable();
                }
                else if (keyName === 'readOnly' && value === 'readOnly') {
                    proxy.model.readOnly = true;
                }
                else if (keyName === 'style') {
                    $(proxy.wrapper).attr(key, value);
                }
                else if (ej.isValidAttr(proxy.visibleInput[0], key)) {
                    $(proxy.visibleInput).attr(key, value);
                }
                else {
                    $(proxy.wrapper).attr(key, value);
                }
            });
        };
        ejDropDownTree.prototype.initValidator = function () {
            if (!this.element.closest('form').data('validator')) {
                this.element.closest('form').validate();
            }
        };
        ejDropDownTree.prototype.setValidation = function () {
            if (this.element.closest('form').length !== 0) {
                this.element.rules('add', this.model.validationRules);
                var validator = this.element.closest('form').data('validator');
                if (!validator) {
                    validator = this.element.closest('form').validate();
                }
                var name_1 = this.element.attr('name');
                validator.settings.messages[name_1] = {};
                for (var ruleName in this.model.validationRules) {
                    if (!ej.isNullOrUndefined(this.model.validationRules[ruleName])) {
                        var message = null;
                        if (!ej.isNullOrUndefined(this.model.validationRules['messages'] && this.model.validationRules['messages'][ruleName])) {
                            message = this.model.validationRules['messages'][ruleName];
                        }
                        else {
                            validator.settings.messages[name_1][ruleName] = $['validator'].messages[ruleName];
                            for (var msgName in this.model.validationMessage) {
                                ruleName == msgName ? (message = this.model.validationMessage[ruleName]) : '';
                            }
                        }
                        validator.settings.messages[name_1][ruleName] = message != null ? message : $['validator'].messages[ruleName];
                    }
                }
            }
        };
        ejDropDownTree.prototype.initialize = function () {
            this.target = this.element[0];
            this.popUpShow = false;
            this.valueContainer = [];
        };
        ejDropDownTree.prototype.render = function () {
            this.createInput();
            this.setWatermark();
            this.popupCreation();
            this.renderScroller();
        };
        ejDropDownTree.prototype.createInput = function () {
            this.wrapper = ej.buildTag('span.e-ddl e-ddtree e-widget ' + this.model.cssClass + '#' + this.id + '_wrapper', '', {}, { 'tabindex': '0', 'accesskey': this.element.attr('accesskey') })[0];
            this.container = ej.buildTag('span.e-in-wrap e-box ' + '#' + this.id + '_container')[0];
            this.element.removeAttr('accesskey');
            if (this.model.value === null && this.element.attr('value') != null) {
                this.model.value = this.element.attr('value');
            }
            this.element.attr('value', '').val('');
            if (!this.isIE8) {
                this.setAttr(this.element[0], { 'type': 'hidden', 'role': 'combobox', 'aria-expanded': false, 'aria-autocomplete': 'list', 'aria-haspopup': true, 'aria-owns': this.id + '_popup' }).element.hide();
            }
            else {
                this.setAttr(this.element[0], { 'role': 'combobox', 'aria-expanded': false, 'aria-autocomplete': 'list', 'aria-haspopup': true, 'aria-owns': this.id + '_popup' }).element.hide();
            }
            $(this.container).insertAfter(this.element);
            $(this.container).append(this.element);
            this.dropDownCreation();
            $(this.container).append(this.dropdownbutton);
            $(this.wrapper).insertBefore(this.container);
            $(this.wrapper).append(this.container);
            this.visibleInput = ej.buildTag('input#' + this.id + '_hidden', '', {}).insertAfter(this.element)[0];
            $(this.visibleInput).addClass('e-input');
            this.setAttr(this.visibleInput[0], { 'readonly': 'readonly', 'tabindex': -1, 'data-role': 'none' });
            if (!this.isWatermark) {
                var watermark = this.model.watermarkText;
                this.hiddenSpan = ej.buildTag('span.e-input e-placeholder')[0];
                $(this.hiddenSpan).insertAfter(this.element);
                $(this.hiddenSpan).text(watermark);
                $(this.hiddenSpan).css('display', 'none');
            }
            this.setDimentions();
            this.RightToLeft();
            this.ddWidth = ($(this.dropdownbutton).outerWidth() > 0) ? $(this.dropdownbutton).outerWidth() : 24;
            $(this.container).on('mousedown', $.proxy(this.OnDropdownClick, this));
        };
        ejDropDownTree.prototype.dropDownCreation = function () {
            this.drpbtnspan = ej.buildTag('span.e-icon e-arrow-sans-down', '', {}, { 'aria-label': 'select', 'unselectable': 'on' })[0];
            this.dropdownbutton = ej.buildTag('span.e-select#' + this.id + '_dropdown', '', {}, { 'role': 'button', 'unselectable': 'on' })[0];
            $(this.dropdownbutton).append(this.drpbtnspan);
        };
        ejDropDownTree.prototype.popupCreation = function () {
            var oldWrapper = $('#' + this.element[0].id + '_popup_wrapper')[0];
            if (oldWrapper) {
                $(oldWrapper).remove();
            }
            this.popupPanelWrapper = ej.buildTag('div#' + this.id + '_popup_wrapper')[0];
            $('body').append(this.popupPanelWrapper);
            $(this.popupPanelWrapper).addClass('e-ddl-popupwrapper');
            this.popupListWrapper = ej.buildTag('div.e-ddl-popup e-ddtree-popup e-box e-widget  e-popup#' + this.id + '_popup_list_wrapper', '', { display: 'none', overflow: 'hidden' })[0];
            this.popupList = ej.buildTag('div#' + this.id + '_popup', '', '', { 'tabIndex': '0' })[0];
            $(this.popupListWrapper).addClass(this.model.cssClass);
            this.popup = this.popupList;
            this.popupScroller = ej.buildTag('div')[0];
            $(this.popupList).append(this.popupScroller);
            if (this.model.headerTemplate) {
                this.headerTemplate = $('<div>').append(this.model.headerTemplate)[0];
                $(this.popupListWrapper).append(this.headerTemplate);
            }
            if (this.model.targetId != null) {
                this.targetElementBinding();
            }
            else {
                this.popupTree = ej.buildTag('div#' + this.id + '_popup_treeview', '', '', { 'tabIndex': '0' })[0];
            }
            $(this.popupScroller).append(this.popupTree);
            $(this.popupListWrapper).append(this.popupList);
            if (this.model.footerTemplate) {
                this.setFooterTemplate();
            }
            $(this.popupPanelWrapper).append(this.popupListWrapper);
            $(window).on('resize', $.proxy(this.OnWindowResize, this));
            this.enableSearch();
            this.renderTreeView();
        };
        ejDropDownTree.prototype.setFooterTemplate = function () {
            if (this.footerTemplate) {
                this.footerTemplate.innerHTML = '';
            }
            else {
                this.footerTemplate = document.createElement('div');
            }
            this.footerTemplate.innerHTML = this.model.footerTemplate;
            $(this.popupListWrapper).append(this.footerTemplate);
        };
        ejDropDownTree.prototype.treeList = function () {
            if (this.model.targetId != null) {
                this.targetElementBinding();
            }
        };
        ejDropDownTree.prototype.renderTreeView = function () {
            var property = {
                cssClass: this.waitingCss(this.model.cssClass),
                enabled: this.model.enabled,
                enableRTL: this.model.enableRTL,
                showRoundedCorner: this.model.showRoundedCorner,
                allowKeyboardNavigation: true,
                enablePersistence: this.model.enablePersistence
            };
            this.model.treeViewSettings = $.extend(true, property, this.model.treeViewSettings);
            if (!ej.isNullOrUndefined(this.model.treeViewSettings.fields) && this.model.treeViewSettings.fields.dataSource instanceof ej.DataManager) {
                this.addLoadingClass();
            }
            var proxy = this;
            $(this.popupTree).ejTreeView(this.model.treeViewSettings);
            this.treeView = $(this.popupTree).ejTreeView('instance');
            $(this.popupTree).ejTreeView({
                ready: $.proxy(this.onTreeReady, this),
                nodeDelete: $.proxy(this.nodeDelete, this),
                nodeCollapse: $.proxy(this.onNodeCollapseExpand, this),
                nodeExpand: $.proxy(this.onNodeCollapseExpand, this),
                nodeSelect: $.proxy(this.onNodeSelectUnselect, this),
                nodeUnselect: $.proxy(this.onNodeSelectUnselect, this),
                nodeCheck: $.proxy(this.onNodeCheckUncheck, this),
                nodeUncheck: $.proxy(this.onNodeCheckUncheck, this),
                keyPress: $.proxy(this.onTreeKeyPress, this)
            });
            this.treeMethods();
        };
        ejDropDownTree.prototype.treeMethods = function () {
            var addNode = ej.TreeView.prototype.addNode;
            var addNodes = ej.TreeView.prototype.addNodes;
            var checkAll = ej.TreeView.prototype.checkAll;
            var checkNode = ej.TreeView.prototype.checkNode;
            var moveNode = ej.TreeView.prototype.moveNode;
            var removeAll = ej.TreeView.prototype.removeAll;
            var removeNode = ej.TreeView.prototype.removeNode;
            var selectAll = ej.TreeView.prototype.selectAll;
            var selectNode = ej.TreeView.prototype.selectNode;
            var unCheckAll = ej.TreeView.prototype.unCheckAll;
            var uncheckNode = ej.TreeView.prototype.uncheckNode;
            var unselectAll = ej.TreeView.prototype.unselectAll;
            var unselectNode = ej.TreeView.prototype.unselectNode;
            var treeview = this.treeView;
            var proxy = this;
            ej.TreeView.prototype.addNode = function (newnodetext, target) {
                addNode.apply(this, [newnodetext, target]);
                proxy.addNode(newnodetext, target);
            };
            ej.TreeView.prototype.addNodes = function (newnodetext, target) {
                addNodes.apply(this, [newnodetext, target]);
                proxy.addNodes(newnodetext, target);
            };
            ej.TreeView.prototype.checkAll = function () {
                checkAll.call(this);
                this.checkAll();
            };
            ej.TreeView.prototype.checkNode = function (ele) {
                checkNode.apply(this, [ele]);
            };
            ej.TreeView.prototype.moveNode = function (src, dest, index) {
                moveNode.apply(this, [src, dest, index]);
                proxy.moveNode(src, dest, index);
            };
            ej.TreeView.prototype.removeAll = function () {
                removeAll.call(treeview);
                proxy.removeAll();
            };
            ej.TreeView.prototype.removeNode = function (ele) {
                removeNode.apply(treeview, [ele]);
            };
            ej.TreeView.prototype.selectAll = function () {
                selectAll.call(treeview);
                proxy.selectAll();
            };
            ej.TreeView.prototype.selectNode = function (ele) {
                selectNode.apply(this, [ele]);
                proxy.selectNode(ele);
            };
            ej.TreeView.prototype.unCheckAll = function () {
                unCheckAll.call(treeview);
                proxy.unCheckAll();
            };
            ej.TreeView.prototype.uncheckNode = function (ele) {
                uncheckNode.apply(treeview, [ele]);
                proxy.uncheckNode(ele);
            };
            ej.TreeView.prototype.unselectAll = function () {
                unselectAll.call(treeview);
                proxy.unselectAll();
            };
            ej.TreeView.prototype.unselectNode = function (ele) {
                unselectNode.apply(this, [ele]);
                proxy.unselectNode(ele);
            };
        };
        ejDropDownTree.prototype.nodeDelete = function (args) {
            if (this.model.treeViewSettings.nodeDelete) {
                this.treeView.option({ nodeDelete: this.model.treeViewSettings.nodeDelete });
                this.treeView._trigger('nodeDelete', args);
                this.treeView.option({ nodeDelete: $.proxy(this.nodeDelete, this) });
            }
            for (var i = 0; i < args.removedNodes.length; i++) {
                this.currentText = this.getElementText(args.removedNodes[i]);
                if (this.checkContains(this.currentText)) {
                    this.maintainHiddenValue();
                    this.removeText(this.currentText);
                }
                var ulEles = $(args.removedNodes[i]).find('ul.e-treeview-ul');
                for (var j = 0; j < ulEles.length; j++) {
                    var liEles = $(ulEles[j]).find('li.e-item');
                    for (var k = 0; k < liEles.length; k++) {
                        this.currentText = this.getElementText(liEles[k]);
                        if (this.checkContains(this.currentText)) {
                            this.maintainHiddenValue();
                            this.removeText(this.currentText);
                        }
                    }
                }
            }
            if (this.getLi().length === 0) {
                this.addEmptyRecord();
            }
        };
        ejDropDownTree.prototype.onTreeKeyPress = function (args) {
            this.onKeyPressTreeView(args);
            if (this.model.treeViewSettings.keyPress) {
                this.treeView.option({ keyPress: this.model.treeViewSettings.keyPress });
                this.treeView._trigger('keyPress', args);
                this.treeView.option({ keyPress: $.proxy(this.onTreeKeyPress, this) });
            }
        };
        ejDropDownTree.prototype.onTreeReady = function (args) {
            this.finalize();
            this.calcScrollTop();
            this.removeLoadingClass();
            if (this.model.treeViewSettings.ready) {
                this.treeView.option({ ready: this.model.treeViewSettings.ready });
                this.treeView._trigger('ready', args);
                this.treeView.option({ ready: $.proxy(this.onTreeReady, this) });
            }
        };
        ejDropDownTree.prototype.onNodeCheckUncheck = function (args) {
            this.OnMouseClick(args);
            if (this.model.treeViewSettings.nodeCheck) {
                this.treeView.option({ nodeCheck: this.model.treeViewSettings.nodeCheck });
                this.treeView._trigger('nodeCheck', args);
                this.treeView.option({ nodeCheck: $.proxy(this.onNodeCheckUncheck, this) });
            }
            else if (this.model.treeViewSettings.nodeUncheck) {
                this.treeView.option({ nodeUncheck: this.model.treeViewSettings.nodeUncheck });
                this.treeView._trigger('nodeUncheck', args);
                this.treeView.option({ nodeUncheck: $.proxy(this.onNodeCheckUncheck, this) });
            }
        };
        ejDropDownTree.prototype.onNodeCollapseExpand = function (args) {
            this.calcScrollTop();
            if (this.model.treeViewSettings.nodeExpand) {
                this.treeView.option({ nodeExpand: this.model.treeViewSettings.nodeExpand });
                this.treeView._trigger('nodeExpand', args);
                this.treeView.option({ nodeExpand: $.proxy(this.onNodeCollapseExpand, this) });
            }
            else if (this.model.treeViewSettings.nodeCollapse) {
                this.treeView.option({ nodeCollapse: this.model.treeViewSettings.nodeCollapse });
                this.treeView._trigger('nodeCollapse', args);
                this.treeView.option({ nodeCollapse: $.proxy(this.onNodeCollapseExpand, this) });
            }
        };
        ejDropDownTree.prototype.onNodeSelectUnselect = function (args) {
            this.OnMouseClick(args);
            if (this.model.treeViewSettings.nodeSelect) {
                this.treeView.option({ nodeSelect: this.model.treeViewSettings.nodeSelect });
                this.treeView._trigger('nodeSelect', args);
                this.treeView.option({ nodeSelect: $.proxy(this.onNodeSelectUnselect, this) });
            }
            else if (this.model.treeViewSettings.nodeUnselect) {
                this.treeView.option({ nodeUnselect: this.model.treeViewSettings.nodeUnselect });
                this.treeView._trigger('nodeUnselect', args);
                this.treeView.option({ nodeUnselect: $.proxy(this.onNodeSelectUnselect, this) });
            }
        };
        ejDropDownTree.prototype.waitingCss = function (cssClass) {
            var myCSS = 'e-dropdowntreeview ';
            this.model.treeViewSettings.cssClass = (!ej.isNullOrUndefined(this.model.treeViewSettings.cssClass)) ? this.model.treeViewSettings.cssClass : '';
            myCSS = myCSS.concat(this.model.treeViewSettings.cssClass);
            myCSS = myCSS + ' ' + cssClass;
            return myCSS;
        };
        ejDropDownTree.prototype.targetElementBinding = function () {
            var predecessor = this.element.parents().last()[0];
            if (this.model.targetId) {
                this.popupTree = predecessor.querySelector('#' + this.model.targetId);
            }
        };
        ejDropDownTree.prototype.calcScrollTop = function () {
            var scrollerPosition = this.scrollerObj ? this.scrollerObj.scrollTop() : 0;
            this.refreshScroller();
            if (this.scrollerObj) {
                this.scrollerObj.option('scrollTop', scrollerPosition);
            }
        };
        ejDropDownTree.prototype.renderScroller = function () {
            var proxy = this;
            if (!ej.isNullOrUndefined(this.popupListWrapper)) {
                this.dropbtnRTL();
            }
            if (!ej.isNullOrUndefined(this.popupListWrapper)) {
                this.setListWidth();
                this.setListHeight();
            }
            if (!ej.isNullOrUndefined(this.popupListWrapper)) {
                $(this.popupScroller).css({ 'height': '', 'width': '' });
                $(this.popupList).ejScroller({
                    height: this.getPopupHeight(),
                    width: 0, scrollerSize: 20
                });
                this.scrollerObj = $(this.popupList).ejScroller('instance');
                $(this.popupList).find('div.e-scrollbar div').attr('unselectable', 'on');
                this.setListPosition();
                !this.popUpShow && $(this.popupListWrapper).css({ 'display': 'none', 'visibility': 'visible' });
                this.changeSkin(this.model.cssClass);
            }
        };
        ejDropDownTree.prototype.getPopupHeight = function () {
            var wrap = $(this.popupListWrapper).height();
            if (this.model.headerTemplate && this.headerTemplate) {
                wrap -= $(this.headerTemplate).height();
            }
            if (this.model.footerTemplate && this.footerTemplate) {
                wrap -= $(this.footerTemplate).height();
            }
            if (this.model.enableFilterSearch && this.inputSearch) {
                var ele = $(this.inputSearch).parent('.e-in-wrap')[0];
                var eleHeight = $(ele).css('height');
                var eleTopMargin = $(ele).css('margin-top');
                var eleBottomMargin = $(ele).css('margin-bottom');
                wrap -= (parseInt(eleHeight) + parseInt(eleTopMargin) + parseInt(eleBottomMargin));
            }
            return wrap;
        };
        ejDropDownTree.prototype.isSingleSelect = function () {
            if (this.model.treeViewSettings.showCheckbox || this.model.treeViewSettings.allowMultiSelection) {
                return false;
            }
            else {
                return true;
            }
        };
        ejDropDownTree.prototype.isFilterInput = function () {
            if (this.model.enableFilterSearch) {
                if ($(this.inputSearch).val() !== '') {
                    return true;
                }
                else {
                    return true;
                }
            }
            else {
                return false;
            }
        };
        ejDropDownTree.prototype.getParentData = function (id) {
            var _this = this;
            $.map(this.filterData, function (ele, index) {
                if (ele[_this.treeView.model.fields.id].toString() === id.toString()) {
                    _this.addData.push(ele);
                    if (!ej.isNullOrUndefined(ele[_this.treeView.model.fields.parentId])) {
                        _this.getParentData(ele[_this.treeView.model.fields.parentId]);
                    }
                }
            });
        };
        ejDropDownTree.prototype.OnMouseClick = function (args) {
            var _this = this;
            if (this.model.treeViewSettings.showCheckbox && args.type === 'nodeSelect') {
                return false;
            }
            var currentElement = args.currentElement;
            if (!this.model.enabled || this.model.readOnly || this.readOnly) {
                return false;
            }
            if (this.model.enableFilterSearch && this.filterData !== null && this.filterData !== this.normalData) {
                var mapped_1 = false;
                this.addData = [];
                $.map(this.normalData, function (ele, index) {
                    if (ele[_this.treeView.model.fields.id] === args.id) {
                        mapped_1 = true;
                    }
                });
                if (!mapped_1) {
                    this.getParentData(args.id);
                }
            }
            if (!currentElement.hasClass('e-disable')) {
                this.uiInteract = true;
                this.activeItem = currentElement[0];
                this.currentText = this.treeView.getNode(args.currentElement[0]).text;
                if (this.isSingleSelect()) {
                    this.enterTextBoxValue(args);
                }
                else {
                    if (this.model.treeViewSettings.showCheckbox) {
                        this.activeItemIndex = args.selectedNodes;
                        if (args.type === 'nodeCheck') {
                            this.enterTextBoxValue(args);
                        }
                        else {
                            this.removeTextBoxValue(args);
                        }
                    }
                    else {
                        if (currentElement.hasClass('e-li-active')) {
                            this.enterTextBoxValue(args);
                        }
                        else {
                            this.removeTextBoxValue(args);
                        }
                    }
                }
            }
        };
        ejDropDownTree.prototype.checkElements = function (args) {
            var eles = (!this.model.treeViewSettings.showCheckbox) ? this.treeView.getSelectedNodes() : this.treeView.getCheckedNodes();
            this.selectedElements = eles;
            this.currentText = this.getElementText(args.currentElement[0]);
            if (!this.checkContains(this.currentText)) {
                this.maintainHiddenValue();
                this.addText(this.currentText);
            }
            if (this.model.treeViewSettings.showCheckbox) {
                if (args.currentCheckedNodes.length > 1) {
                    for (var i = 1; i < args.currentCheckedNodes.length; i++) {
                        this.currentText = args.currentCheckedNodes[i].text;
                        this.maintainHiddenValue();
                        this.addText(this.currentText);
                    }
                }
            }
            for (var i = 0; i < this.valueContainer.length; i++) {
                var flag = true;
                for (var j = 0; j < eles.length; j++) {
                    var eleText = this.getElementText(eles[j]);
                    if (this.getMappedField(this.valueContainer[i], "value", "text") === eleText) {
                        flag = true;
                        break;
                    }
                    else {
                        flag = false;
                    }
                }
                if (!flag) {
                    this.removeText(this.valueContainer[i]);
                    i = i - 1;
                }
            }
            if (!this.isVisibleInViewport(args.currentElement[0])) {
                args.currentElement[0].scrollIntoView();
            }
        };
        ejDropDownTree.prototype.getElementText = function (element) {
            var ele = this.treeView.getNode(element);
            var textContent = ele['text'];
            if (this.model.textMode === 'fullPath') {
                textContent = this.getPath(element);
            }
            return textContent;
        };
        ejDropDownTree.prototype.unCheckElements = function (args) {
            var unCheckEle = args.currentUncheckedNodes;
            var path;
            if (this.model.treeViewSettings.showCheckbox) {
                unCheckEle = args.currentUncheckedNodes;
                for (var i = 0; i < unCheckEle.length; i++) {
                    var textContent = unCheckEle[i]['text'];
                    path = this.getPath($(this.getLi()).find('#' + unCheckEle[i].id)[0]);
                    this.currentText = (this.model.textMode === 'None') ? textContent : path;
                    this.maintainHiddenValue();
                    this.removeText(this.currentText);
                }
            }
            else {
                this.currentText = this.getElementText(args.currentElement);
                this.maintainHiddenValue();
                this.removeText(this.currentText);
            }
            this.ensureRootCheck(args);
        };
        ejDropDownTree.prototype.ensureRootCheck = function (args) {
            var rootEle = $(args.currentElement).parents('ul.e-treeview-ul');
            for (var i = 0; i < rootEle.length; i++) {
                if ($(rootEle[i]).parent('li').length) {
                    var textContent = $(rootEle[i]).siblings('[role=presentation]').text();
                    if (this.checkContains(textContent)) {
                        var path = this.getPath($(rootEle[i]).siblings('[role=presentation]')[0]);
                        textContent = (this.model.textMode === 'None') ? textContent : path;
                        this.removeText(textContent);
                    }
                }
            }
        };
        ejDropDownTree.prototype.maintainHiddenValue = function () {
            var currentText;
            if (this.model.textMode === 'fullPath' && this.currentText.indexOf(this.model.fullPathDelimiter) != -1) {
                var items = this.currentText.split(this.model.fullPathDelimiter);
                currentText = items[items.length - 1];
            }
            else {
                currentText = this.currentText;
            }
            var val;
            if (this.model.treeViewSettings.fields && this.model.treeViewSettings.fields.text && this.model.treeViewSettings.fields.value) {
                val = this.getMappedField(currentText, "text", "value");
            }
            this.hiddenValue = !ej.isNullOrUndefined(val) ? val : this.currentText;
        };
        ejDropDownTree.prototype.getMappedField = function (text, textfield, valuefield) {
            var treeSrc;
            var val;
            var mappedtextField = this.treeMapping(textfield);
            var mappedvalueField = this.treeMapping(valuefield);
            if (!(this.treeView.dataSource() instanceof ej.DataManager)) {
                treeSrc = this.model.treeViewSettings.fields.dataSource;
                for (var i = 0; i < treeSrc.length; i++) {
                    if (ej.getObject(mappedtextField[0], treeSrc[i]) == text) {
                        val = ej.getObject(mappedvalueField[0], treeSrc[i]);
                    }
                }
            }
            return val;
        };
        ejDropDownTree.prototype.getActiveItem = function () {
            var nodelist = this.getLi();
            return nodelist[this.activeItemIndex];
        };
        ejDropDownTree.prototype.parseValue = function (value) {
            var parseValue = parseInt(value);
            var result = isNaN(parseValue) ? value : parseValue;
            return result;
        };
        ejDropDownTree.prototype.getLi = function () {
            return this.treeView['_liList'];
        };
        ejDropDownTree.prototype.getPath = function (ele) {
            if (ej.isNullOrUndefined(ele)) {
                return null;
            }
            var path = this.treeView._getPath($(ele));
            var route = path.split('/');
            route.shift();
            var pathChar = this.validateDelimiter(this.model.fullPathDelimiter);
            pathChar = (this.model.delimiter !== this.model.fullPathDelimiter) ? this.model.fullPathDelimiter : '/';
            return route.join(pathChar);
        };
        ejDropDownTree.prototype.addText = function (currentValue) {
            if (this.checkContains(this.hiddenValue)) {
                return false;
            }
            var ele = ['element', 'visibleInput'];
            var val;
            for (var i = 0; i < ele.length; i++) {
                val = ele[i] === 'element' ? this.hiddenValue : currentValue;
                var element = (ele[i] === 'element') ? this[ele[i]][0] : this[ele[i]];
                if (element.value && element.value !== '') {
                    var splitedText = element.value.split(this.model.delimiter);
                    splitedText.push(val);
                    if (ele[i] === 'element') {
                        this.updateValueContainer(val, 'push');
                    }
                    element.value = splitedText.join(this.model.delimiter);
                }
                else {
                    element.value = val;
                    if (ele[i] === 'element') {
                        this.updateValueContainer(val, 'push');
                    }
                }
            }
        };
        ejDropDownTree.prototype.updateValueContainer = function (text, flag, index) {
            if (flag === 'push') {
                this.valueContainer.push(text);
            }
            else if (flag === 'pop') {
                if (!ej.isNullOrUndefined(index)) {
                    this.valueContainer.splice(index, 1);
                }
                else {
                    this.valueContainer.pop();
                }
            }
        };
        ejDropDownTree.prototype.removeText = function (currentValue) {
            var eleVal = this.element[0]['value'].split(this.model.delimiter);
            var hidVal = this.visibleInput.value.split(this.model.delimiter);
            var mapVal = this.getMappedField(currentValue, "text", "value");
            var val = ej.isNullOrUndefined(mapVal) ? currentValue.toString() : mapVal.toString();
            var index = $.inArray(val, eleVal);
            if (index >= 0) {
                eleVal.splice(index, 1);
                this.updateValueContainer(currentValue, 'pop', index);
                hidVal.splice(index, 1);
            }
            this.element[0]['value'] = eleVal.join(this.model.delimiter);
            this.visibleInput.value = hidVal.join(this.model.delimiter);
        };
        ejDropDownTree.prototype.setFullPathDelimiter = function (val) {
            var validChar = this.validateDelimiter(val);
            var oldFullPathChar = this.model.fullPathDelimiter;
            this.model.fullPathDelimiter = (validChar !== this.model.delimiter) ? validChar : oldFullPathChar;
            if (this.model.text) {
                this.model.text = this.setPath(this.model.text, oldFullPathChar);
                $(this.visibleInput).val(this.model.text);
            }
            if (!ej.isNullOrUndefined(this.value())) {
                this.value(this.setPath(this.value, oldFullPathChar));
                this.element.val(this.value());
            }
        };
        ejDropDownTree.prototype.setPath = function (field, oldFullPathChar) {
            var srcSplitted = [];
            srcSplitted = field.split(this.model.delimiter);
            for (var i = 0; i < srcSplitted.length; i++) {
                srcSplitted[i] = srcSplitted[i].split(oldFullPathChar).join(this.model.fullPathDelimiter);
            }
            return srcSplitted.join(this.model.delimiter);
        };
        ejDropDownTree.prototype.checkContains = function (chkValue) {
            var value = $(this.element[0]).val().toString();
            var values = value.split(this.model.delimiter);
            this.contains = false;
            for (var i = 0; i < values.length; i++) {
                if (this.parseValue(values[i]) === this.parseValue(chkValue)) {
                    this.contains = true;
                    break;
                }
            }
            return this.contains;
        };
        ejDropDownTree.prototype.removeTextBoxValue = function (e) {
            this.uiInteract = true;
            this.removeID = true;
            this.checkedStatus = true;
            var args = { text: this.currentText, selectedText: this.currentText, isChecked: this.checkedStatus };
            if (this._trigger('select', args)) {
                this.setWatermark();
                return;
            }
            this.unCheckElements(e);
            this.checkedStatus = false;
            this.onValueChange();
            this.setWatermark();
        };
        ejDropDownTree.prototype.enterTextBoxValue = function (args) {
            var valueModified = true;
            if (!this.isWatermark) {
                this.hiddenSpan.style.display = 'none';
            }
            var currentTarget = args.currentElement;
            var path = this.getPath(currentTarget);
            this.currentFullPath = ej.isNullOrUndefined(path) ? this.currentFullPath : path;
            var selectArgs = { text: this.currentText, selectedText: this.currentText, value: this.currentText, isChecked: this.checkedStatus };
            if (this._trigger('select', selectArgs)) {
                this.setWatermark();
                return;
            }
            if (!this.isSingleSelect()) {
                this.checkElements(args);
            }
            else if (this.isSingleSelect()) {
                this.maintainHiddenValue();
                if (this.model.textMode === 'fullPath') {
                    $(this.visibleInput).val(this.currentFullPath);
                    this.element.val(this.currentFullPath);
                }
                else {
                    $(this.visibleInput).val(this.currentText);
                    this.element.val(this.hiddenValue);
                }
                if (!this.isVisibleInViewport(args.currentElement[0])) {
                    args.currentElement[0].scrollIntoView();
                }
            }
            else {
                valueModified = false;
            }
            if (valueModified) {
                this.checkedStatus = true;
                this.onValueChange();
            }
            this.setWatermark();
            this.uiInteract = false;
        };
        ejDropDownTree.prototype.onValueChange = function () {
            this.updateText();
            if (ej.util.valueFunction(this.value) !== this.element.val() && !(ej.util.valueFunction(this.value) === null && this.element.val() === '')) {
                this.updateValue(this.element.val());
                var eles = (this.model.treeViewSettings.showCheckbox) ? this.treeView.getCheckedNodes() : this.treeView.getSelectedNodes();
                var args = { text: this.visibleInput.value, value: this.element.val(), selectedText: this.currentText, isChecked: this.checkedStatus, isInteraction: !!this.uiInteract, selectedItems: eles };
                this._trigger('change', args);
                if (this.model.treeViewSettings.showCheckbox) {
                    var checkChangeArg = { isChecked: this.checkedStatus, text: this.visibleInput.value, value: this.element.val(), model: this.model };
                    this._trigger('checkChange', checkChangeArg);
                }
                this.uiInteract = false;
            }
        };
        ejDropDownTree.prototype.selectItem = function (current) {
            if (!this.isSingleSelect()) {
                this.clearTextboxValue();
            }
            this.activeItemIndex = current;
            this.enterTextBoxValue();
        };
        ejDropDownTree.prototype.addLoadingClass = function () {
            if (this.isPopupShown()) {
                $(this.popupListWrapper).addClass('e-load');
            }
            else {
                $(this.dropdownbutton).addClass('e-load');
                $(this.drpbtnspan).removeClass('e-icon e-arrow-sans-down');
            }
            this.readOnly = true;
        };
        ejDropDownTree.prototype.removeLoadingClass = function () {
            $(this.dropdownbutton).removeClass('e-load');
            $(this.drpbtnspan).addClass('e-icon e-arrow-sans-down');
            this.readOnly = false;
            if (!ej.isNullOrUndefined(this.popupListWrapper)) {
                $(this.popupListWrapper).removeClass('e-load');
            }
        };
        ejDropDownTree.prototype.refreshPopup = function () {
            if (this.model.popupSettings.width === 'auto' && !this.validatePixelData(this.minPopupWidth)) {
                $(this.popupListWrapper).css({ 'min-width': $(this.wrapper).width() });
            }
            else if (this.validatePixelData(this.minPopupWidth)) {
                $(this.popupListWrapper).css({ 'min-width': this.validatePixelData(this.minPopupWidth) });
            }
            if (this.scrollerObj !== undefined) {
                this.refreshScroller();
            }
            this.setListPosition();
        };
        ejDropDownTree.prototype.refreshScroller = function () {
            $(this.popupList).find('.e-content, .e-vhandle').removeAttr('style');
            $(this.popupList).find('.e-vhandle div').removeAttr('style');
            $(this.popupList).children('.e-content').removeClass('e-content');
            var flag = this.isPopupShown();
            this.popupList.style.display = 'block';
            this.popupListWrapper.style.display = 'block';
            this.scrollerObj.model.height = Math.ceil(this.getPopupHeight());
            this.scrollerObj.refresh();
            if (!this.model.enablePopupResize) {
                this.popupList.style.height = 'auto';
                this.popupListWrapper.style.height = 'auto';
            }
            this.scrollerObj.option('scrollTop', 0);
            if (!flag) {
                this.popupListWrapper.style.display = 'none';
            }
        };
        ejDropDownTree.prototype.setListPosition = function () {
            var elementObj = this.wrapper;
            var pos = this.getOffset(elementObj);
            var winWidth;
            var winBottomHeight = $(document).scrollTop() + $(window).height() - (pos.top + $(elementObj).outerHeight());
            var winTopHeight = pos.top - $(document).scrollTop();
            var popupHeight = $(this.popupListWrapper).outerHeight();
            var popupWidth = $(this.popupListWrapper).outerWidth();
            var left = pos.left;
            var totalHeight = $(elementObj).outerHeight();
            var border = (totalHeight - $(elementObj).height()) / 2;
            var maxZ = this.getZindexPartial();
            var popupmargin = 3;
            var topPos;
            if ((popupHeight < winBottomHeight || popupHeight > winTopHeight)) {
                topPos = pos.top + totalHeight + popupmargin;
            }
            else {
                topPos = pos.top - popupHeight - popupmargin - border;
            }
            winWidth = $(document).scrollLeft() + $(window).width() - left;
            if (this.model.enableRTL || popupWidth > winWidth && (popupWidth < left + $(elementObj).outerWidth())) {
                left -= $(this.popupListWrapper).outerWidth() - $(elementObj).outerWidth();
            }
            $(this.popupListWrapper).css({
                'left': left + 'px',
                'top': topPos + 'px',
                'z-index': maxZ
            });
        };
        ejDropDownTree.prototype.getOffset = function (ele) {
            return ej.getOffset($(ele));
        };
        ejDropDownTree.prototype.getZindexPartial = function () {
            return ej.getZindexPartial(this.element, this.popupListWrapper[0]);
        };
        ejDropDownTree.prototype.OnWindowResize = function (e) {
            if (!ej.isNullOrUndefined(this.model) && this.isPopupShown()) {
                this.refreshPopup();
            }
        };
        ejDropDownTree.prototype.OnKeyPress = function (e) {
            if (this.model.enableIncrementalSearch && e.keyCode !== 13) {
            }
            if (e.keyCode === 32) {
                this.preventDefaultAction(e);
            }
        };
        ejDropDownTree.prototype.isVisibleInViewport = function (txtWrap) {
            if (ej.isNullOrUndefined(txtWrap)) {
                return false;
            }
            var pos = txtWrap.getBoundingClientRect();
            var parentPos = this.popupListWrapper.getBoundingClientRect();
            if ((parentPos.top < pos.top) && (parentPos.bottom > pos.bottom)) {
                return true;
            }
            else {
                return false;
            }
        };
        ejDropDownTree.prototype.onKeyPressTreeView = function (e) {
            var code = e.keyCode;
            if (ej.isNullOrUndefined(e.currentElement)) {
                return;
            }
            var nextFocus = e.currentElement[0];
            var isVisible = this.isVisibleInViewport(nextFocus);
            switch (code) {
                case 40:
                    this.preventDefaultAction(e.event, true);
                    if (!isVisible) {
                        nextFocus.scrollIntoView(true);
                        break;
                    }
                    break;
                case 38:
                    this.preventDefaultAction(e.event, true);
                    if (!isVisible) {
                        nextFocus.scrollIntoView(false);
                        break;
                    }
                    break;
                case 36:
                    if (!isVisible) {
                        nextFocus.scrollIntoView(true);
                        break;
                    }
                    break;
                case 35:
                    if (!isVisible) {
                        nextFocus.scrollIntoView(false);
                        break;
                    }
                    break;
            }
            var scrollerPosition = this.scrollerObj ? this.scrollerObj.scrollTop() : 0;
            if (this.scrollerObj) {
                this.scrollerObj.option('scrollTop', scrollerPosition);
            }
        };
        ejDropDownTree.prototype.OnKeyDown = function (e) {
            this.uiInteract = true;
            var code;
            if (this.model.enabled) {
                code = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
                var popupListItems = this.getLi();
                this.listSize = popupListItems.length;
                var popupH = $(this.popupList).height();
                switch (code) {
                    case 38:
                        if (e.altKey) {
                            if (!ej.isNullOrUndefined(this.popupTree)) {
                                this.hideResult();
                            }
                        }
                        else {
                            $(this.popupTree).focus();
                        }
                        break;
                    case 40:
                        if (e.altKey) {
                            if (!ej.isNullOrUndefined(this.popupTree)) {
                                this.showResult();
                                if (this.model.enableFilterSearch) {
                                    this.inputSearch.focus();
                                }
                                else {
                                    $(this.popupTree).focus();
                                }
                                this.preventDefaultAction(e);
                            }
                        }
                        else {
                            $(this.popupTree).focus();
                        }
                        break;
                    case 9:
                    case 27:
                        if (this.isPopupShown()) {
                            this.hideResult();
                        }
                        break;
                }
            }
        };
        ejDropDownTree.prototype.targetFocus = function () {
            if (this.model.enabled && !this.isFocused) {
                if (!this.isWatermark) {
                    $(this.hiddenSpan).css('display', 'none');
                }
                $(this.wrapper).addClass('e-focus e-popactive');
                this.isFocused = true;
                var args = { model: this.model, cancel: false, type: 'focus' };
                this._trigger('focus', args);
            }
        };
        ejDropDownTree.prototype.targetBlur = function () {
            if (this.model.enabled) {
                this.isFocused = false;
                $(this.wrapper).removeClass('e-focus e-popactive');
                this.setWatermark();
                var args = { model: this.model, cancel: false, type: 'blur' };
                this._trigger('blur', args);
            }
        };
        ejDropDownTree.prototype.OnDocumentClick = function (e) {
            if (this.model.enabled && !this.model.readOnly) {
                if (!$(e.target).is(this.popupList) && !$(e.target).parents('.e-ddl-popup').is(this.popupListWrapper) &&
                    !$(e.target).is(this.visibleInput) && !$(e.target).parents('.e-ddl').is(this.wrapper)) {
                    this.hideResult();
                }
                else if ($(e.target).is(this.inputSearch)) {
                    this.inputSearch.focus();
                }
                else if ($(e.target).is(this.popupList) || $(e.target).parents('.e-ddl-popup').is(this.popupListWrapper)) {
                    this.preventDefaultAction(e);
                }
            }
        };
        ejDropDownTree.prototype.enableSearch = function () {
            var _this = this;
            if (this.model.enableFilterSearch) {
                if (!ej.isNullOrUndefined(this.popupListWrapper) && !this.inputSearch) {
                    this.inputSearch = ej.buildTag('input#' + this.id + '_inputSearch.e-input', '', {}, { 'type': 'text', 'data-role': 'none' })[0];
                    jQuery(this.popupListWrapper).prepend(jQuery('<span>').addClass('e-atc e-search').append(jQuery('<span>').addClass('e-in-wrap ').append(this.inputSearch).append(jQuery('<span>').addClass(' e-icon e-search'))));
                    this._on($(this.inputSearch), 'keyup', this.onFilterKeyUp);
                    this._on($(this.inputSearch), 'keydown', function (args) {
                        var keyCode = args.keyCode || args.which;
                        if (keyCode === 9) {
                            args.preventDefault();
                            _this.wrapper.focus();
                            _this.hideResult();
                        }
                    });
                }
            }
        };
        ejDropDownTree.prototype.onFilterKeyUp = function (args) {
            switch (args.keyCode) {
                case 16:
                case 17:
                case 18:
                case 36:
                case 35:
                case 13:
                case 9:
                    args.stopPropagation();
                    args.preventDefault();
                    break;
                case 37:
                case 39:
                case 38:
                case 40:
                case 33:
                case 34:
                case 27:
                    break;
                default:
                    this.debounce(args);
                    break;
            }
        };
        ejDropDownTree.prototype.debounce = function (args) {
            var _this = this;
            var proxy = this;
            var searchVal = this.inputSearch.value.toLocaleLowerCase();
            if (this.filterTimer) {
                clearTimeout(this.filterTimer);
            }
            this.filterTimer = setTimeout(function () {
                proxy._trigger('filtering', {
                    text: searchVal,
                    updateData: function (fields) {
                        _this.isupdateData = true;
                        if (_this.inputSearch.value.trim() === '') {
                            proxy.treeView.option({ 'fields': _this.normalData });
                        }
                        else {
                            _this.normalData = proxy.model.treeViewSettings.fields;
                            proxy.treeView.option({ 'fields': fields });
                            _this.filterData = proxy.treeView.model.fields.dataSource;
                        }
                        proxy.treeView.model.ready = function () {
                            if (proxy.addData.length > 0) {
                                proxy.treeView.addNodes(proxy.addData.reverse(), null);
                                proxy.addData = [];
                            }
                            proxy.refreshPopup();
                        };
                    }
                });
                if (!_this.isupdateData) {
                    if (searchVal.length > 0) {
                        proxy.filterNodes(searchVal);
                    }
                    else {
                        var ele = proxy.popup.querySelector('.e-nosuggestion');
                        if (ele) {
                            ele.remove();
                            proxy.popupTree.style.display = proxy.treeStyle;
                        }
                        proxy.showNodes(Array.prototype.slice.call(proxy.treeView.element[0].querySelectorAll('li')));
                        proxy.refreshPopup();
                    }
                }
                _this.isupdateData = false;
            }, 80);
        };
        ejDropDownTree.prototype.refreshSearch = function () {
            this.resetSearch();
            this.refreshPopup();
        };
        ejDropDownTree.prototype.filterNodes = function (val) {
            var nodes = Array.prototype.slice.call(this.treeView.element[0].querySelectorAll('li'));
            var nodeLen = nodes.length;
            var index;
            var exp;
            $(this.popupListWrapper).find('.e-atc.e-search .e-search').addClass('e-cross-circle').removeClass('e-search');
            this._on($(this.popupListWrapper).find('.e-cross-circle'), 'mousedown', this.refreshSearch);
            if (this.model.filterType === 'startwith') {
                exp = new RegExp('^\\s*' + val.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'im');
            }
            else if (this.model.filterType === 'endwith') {
                exp = new RegExp('\\s*' + val.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&$') + '$', 'im');
            }
            else {
                exp = new RegExp('\\s*' + val.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'im');
            }
            for (index = 0; index < nodeLen; index++) {
                var currentNode = nodes[index];
                if (this.matchNode(currentNode, exp)) {
                    this.handleVisibleParents(currentNode);
                    this.visibleNodes.push(currentNode);
                }
                else {
                    this.handleHiddenNode(currentNode);
                }
            }
            this.hideNodes(this.hiddenNodes);
            this.showNodes(this.visibleNodes);
            if (this.visibleNodes.length <= 0) {
                if (!this.popup.querySelector('.e-nosuggestion')) {
                    var ele = document.createElement('div');
                    $(ele).addClass('e-nosuggestion');
                    ele.style.padding = '14px 16px';
                    ele.style.textAlign = 'center';
                    ele.innerHTML = this.getLocalizedLabels('noRecordsTemplate');
                    this.popupScroller.appendChild(ele);
                    this.treeStyle = this.popupTree.style.display;
                    this.popupTree.style.display = 'none';
                }
            }
            else {
                var ele = this.popup.querySelector('.e-nosuggestion');
                if (ele) {
                    ele.remove();
                    this.popupTree.style.display = this.treeStyle;
                }
            }
            this.visibleNodes = [];
            this.hiddenNodes = [];
            this.refreshPopup();
        };
        ejDropDownTree.prototype.showNodes = function (args) {
            var currentNode;
            this.treeView.expandNode(args);
            for (var index = 0, len = args.length; index < len; index++) {
                currentNode = args[index];
                this.treeView.showNode($(currentNode));
                currentNode.style.display = '';
            }
        };
        ejDropDownTree.prototype.hideNodes = function (args) {
            var currentNode;
            for (var index = 0, len = args.length; index < len; index++) {
                currentNode = args[index];
                this.treeView.hideNode($(currentNode));
                currentNode.style.display = 'none';
            }
        };
        ejDropDownTree.prototype.matchNode = function (ele, exp) {
            var text = this.treeView.getText(ele);
            if (text.match(exp)) {
                return true;
            }
            else {
                return false;
            }
        };
        ejDropDownTree.prototype.handleVisibleParents = function (args) {
            var nodes = this.getNodeParents(args);
            var len = nodes.length;
            for (var index = 0; index < len; index++) {
                var currentNode = nodes[index];
                if ($.inArray(currentNode, this.visibleNodes) === -1) {
                    this.visibleNodes.push(currentNode);
                }
                var arrIndex = $.inArray(currentNode, this.hiddenNodes);
                if (arrIndex !== -1) {
                    this.hiddenNodes.splice(arrIndex, 1);
                }
            }
        };
        ejDropDownTree.prototype.handleHiddenNode = function (args) {
            if ($.inArray(args, this.visibleNodes) !== -1) {
                return;
            }
            else {
                if ($.inArray(args, this.hiddenNodes) === -1) {
                    this.hiddenNodes.push(args);
                }
            }
        };
        ejDropDownTree.prototype.getNodeParents = function (args) {
            var arrCol = [];
            var nodeParent = this.treeView.getParent(args);
            while (nodeParent.length > 0) {
                if ($.inArray(nodeParent[0], this.visibleNodes) !== -1) {
                    break;
                }
                else {
                    arrCol.push(nodeParent[0]);
                    nodeParent = this.treeView.getParent(nodeParent);
                }
            }
            return arrCol;
        };
        ejDropDownTree.prototype.getLocalizedLabels = function (property) {
            return this.localizedLabels[property] === undefined ? ej.DropDownTree.Locale['en-US'][property] : this.localizedLabels[property];
        };
        return ejDropDownTree;
    }(ej.WidgetBase));
    window.ej.widget('ejDropDownTree', 'ej.DropDownTree', new ejDropDownTree());
})(jQuery);
ej.DropDownTree.TextMode = {
    none: 'none',
    fullPath: 'fullPath'
};
ej.DropDownTree.Locale = ej.DropDownTree.Locale || {};
window['ejDropDownTree'] = null;
ej.DropDownTree.Locale['default'] = ej.DropDownTree.Locale['en-US'] = {
    noRecordsTemplate: 'No Records Found',
    actionFailureTemplate: 'The Request Failed'
};
