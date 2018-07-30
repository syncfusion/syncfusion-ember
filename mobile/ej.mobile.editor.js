/**
* @fileOverview Plugin to style the Html Editor elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    ej.widget({ "ejmTextBox": "ej.mobile.TextBox", "ejmTextArea": "ej.mobile.TextArea", "ejmPassword": "ej.mobile.Password", "ejmNumeric": "ej.mobile.Numeric", "ejmMaskEdit": "ej.mobile.MaskEdit" }, {
        _setFirst: true,
        _rootCSS: "e-m-editor",
        _requiresID: true,
        validTags: ["input", "textarea"],

        defaults: {
            renderMode: "auto",
            cssClass: '',
            enablePersistence: false,
            borderStyle: "box",
            watermarkText: "",
            value: '',
            readOnly: false,
            type: 'text',
            enabled: true,
            maxLength: '',
            autoFocus: false,
            height: '',
            width: '',
            step: 1,
            minValue: -(Number.MAX_VALUE),
            maxValue: Number.MAX_VALUE,
            format: '',
            locale: 'en-US',
            touchStart: null,
            touchEnd: null,
            keyUp: null,
            keyDown: null
        },

        dataTypes: {
            renderMode: "enum",
            enablePersistence: 'boolean',
            borderStyle: 'enum',
            readOnly: 'boolean',
            enabled: 'boolean',
            autoFocus: 'boolean',
            step: 'number',
            minValue: 'number',
            maxValue: 'number',
            locale: "string"
        },

        observables: ["value"],
        value: ej.util.valueFunction("value"),

        _init: function () {
            this._cloneElement = this.element.clone();
            this.culture = ej.preferredCulture(this.model.locale);
            this._getLocalizedLabels();
            this.model.watermarkText = !ej.isNullOrUndefined(this.model.watermarkText) && this.model.watermarkText != "" ? this.model.watermarkText : this._localizedLabels["watermarkText"];
            this._renderControl();
            this._wireEvents();
        },
        _getControlName: function () {
            return this.pluginName.replace("ejm", "");
        },
        _getLocalizedLabels: function () {
            this._localizedLabels = ej.getLocalizedConstants(this.sfType, this.model.locale);
        },
        _renderControl: function () {
            ej.setRenderMode(this);
            var obj = this.model;
            this.model.type = this.element.attr('type') ? this.element.attr('type') : obj.type;
            if ((this.element.attr("name") == "" || ej.isNullOrUndefined(this.element.attr("name"))))
                this.element.attr("name", this._id);
            this._noClearBtn = ['MaskEdit', 'Numeric', 'Password', 'TextArea'];
            this["_set" + this._getControlName() + "Properties"]();
        },

        _setTextBoxProperties: function () {
            this._setCommonWrapper(this.model.type);
            this._setCommonProperties();
        },

        _setPasswordProperties: function () {
            this._setCommonWrapper('password');
            this._setCommonProperties();
        },

        _setTextAreaProperties: function () {
            var obj = this.model;
            this.element.addClass("e-m-" + obj.renderMode + " e-m-editor " + obj.cssClass + " e-m-input-wrapper e-m-textbox");
            this._setCommonProperties();
            if (obj.height) this._setHeight(obj.height);
        },

        _setNumericProperties: function () {
            this._setCommonWrapper('number');
            this._numbersRegex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '.', 'Delete', 'Backspace', 'ArrowRight', 'Tab', 'ArrowLeft', 'Home', 'End', 'e'];
            this._keyPressCalled = false;
            this._setCommonProperties();
            this.element.css('padding-right', 64);
        },

        _setMaskEditProperties: function () {
            var obj = this.model;
            this.element.addClass("e-m-" + obj.renderMode + " e-m-input-wrapper e-m-mask " + obj.cssClass);
            this._alphaNumeric = /^[a-zA-Z0-9]*$/;
            this._alphabetic = /^[a-zA-Z]/;
            this._numeric = /^[0-9]/;
            this._allowedKeys = ['ArrowRight', 'Tab', 'ArrowLeft', 'Shift', 'Enter', 'Home', 'End', 'Ctrl'];
            this._restrictedKeys = ['Backspace', 'ArrowUp', 'ArrowDown', 'Delete', 'VolumeMute', 'VolumeUp', 'VolumeDown', 'PageDown', 'PageUp', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'];
            this._islastindex = false;
            this._keyDownCalled = false;
            this._setCommonProperties();
        },

        _setCommonWrapper: function (type) {
            this.model.type = type;
            this.element.attr('type', type);
            var obj = this.model;
            this._inputWrapper = ej.buildTag("div.e-m-" + obj.renderMode + " e-m-editor " + obj.cssClass + " e-m-input-wrapper");
            this.element.after(this._inputWrapper).addClass('e-m-textbox');
            this._inputWrapper.append(this.element);
            if (obj.type != 'number') {
                this._rightIcon = ej.buildTag("span");
                this._inputWrapper.append(this._rightIcon);
            }
            else {
                this._upBtn = ej.buildTag("span.e-m-icon-up up-btn");
                this._downBtn = ej.buildTag("span.e-m-icon-down down-btn");
                this._inputWrapper.append(this._upBtn).append(this._downBtn);
            }
        },

        _setCssClass: function () {
            this._inputWrapper.addClass(this.model.cssClass);
        },

        _setCommonProperties: function () {
            var obj = this.model;
            this._setBorderStyle();
            if (obj.width != '') this._setWidth(obj.width);
            if (obj.type == 'number') this._setValue(this.value() == '' ? this._validateNumericInput(0) : this._validateNumericInput(this.value()));
            else {
                var attr = $(this.element).attr('value');
                if (typeof attr !== typeof undefined) this.value(ej.parseFloat(attr));
                if (this.value()) this._setValue(this.value());
            }
            if (obj.watermarkText != '') this._setWatermarkText(obj.watermarkText);
            if (obj.maxLength != '') this._setMaxLength(obj.maxLength);
            if (obj.autoFocus) this._setAutoFocus(true);
            if (obj.readOnly) this._setReadOnly(true);
            if (!obj.enabled) this._setEnabled(false);
        },

        _setMinValue: function (value) {
            if (!this.element.prop('disabled') && this.model.type == 'number') {
                this.element.attr('min', value);
                if (value > this.element.val())
                    this.element.val(value);
            }
        },

        _setMaxValue: function (value) {
            if (!this.element.prop('disabled') && this.model.type == 'number') {
                this.element.attr('max', value);
                if (value < this.element.val())
                    this.element.val(value);
            }
        },

        _setStep: function (step) {
            if (this.model.type == 'number' && !this.element.prop('disabled') && step && !isNaN(step)) this.element.attr('step', step);
        },

        _setHeight: function (height) {
            if (this._getControlName() == 'TextArea' && !this.element.prop('disabled') && height) this.element.height(height);
        },

        _setReadOnly: function (status) {
            if (!this.element.prop('disabled')) this.element.attr('readonly', status);
            if (this.model.type == 'number') {
                this._upBtn[(!status ? "removeClass" : "addClass")]("e-m-disabled");
                this._downBtn[(!status ? "removeClass" : "addClass")]("e-m-disabled");
            }
            else if (this._getControlName() != 'MaskEdit' && this._getControlName() != 'TextArea') this._rightIcon[(status ? "removeClass" : "addClass")]("e-m-disabled");
        },

        _setAutoFocus: function (focusstate) {
            if (!this.element.prop('disabled') && focusstate) {
                this.element.focus();
                this.element.prop('autofocus', 'autofocus');
                if (this._getControlName() != 'MaskEdit' && this._getControlName() != 'TextArea') this.element.parent().addClass('focus');
            }
        },

        _setMaxLength: function (maxlength) {
            if (!this.element.prop('disabled') && maxlength) this.element.attr('maxlength', maxlength);
        },

        _setEnabled: function (status) {
            this.element.attr('disabled', !status);
            if (this._getControlName() == 'TextArea' || this._getControlName() == 'MaskEdit') this.element[(status ? "removeClass" : "addClass")]("e-m-state-disabled");
            else this.element.parent()[(status ? "removeClass" : "addClass")]("e-m-state-disabled");
        },

        _setWidth: function (width) {
            if (!this.element.prop('disabled')) {
                this.element.width(width);
                if (this._getControlName() != 'MaskEdit' || this._getControlName() != 'TextArea') this.element.parent().width(width);
            }
        },

        _setWatermarkText: function (watermarktext) {
            if (!this.element.prop('disabled')) this.element.attr("placeholder", this.model.watermarkText);
        },

        _setValue: function (value) {
            if (!this.element.prop('disabled')) {
                this.element.val(value);
                this.value(value);
            }
        },

        _setBorderStyle: function () {
            if (!this.element.prop('disabled')) {
                if (this._getControlName() != 'MaskEdit' && this._getControlName() != 'TextArea')
                    this.element.parent().removeClass("e-m-line e-m-box e-m-none").addClass("e-m-" + this.model.borderStyle);
                else
                    this.element.removeClass("e-m-line e-m-box e-m-none").addClass("e-m-" + this.model.borderStyle);
            }
        },

        _setRenderMode: function (mode) {
            if (!this.element.prop('disabled')) this.element.removeClass("e-m-ios7 e-m-android e-m-windows e-m-flat").addClass("e-m-" + mode);
        },

        _setLocale: function () {
            this._getLocalizedLabels();
            this.model.watermarkText = this._localizedLabels["watermarkText"];
            this._setWatermarkText();
        },

        _createDelegate: function () {
            this._keyDownProxy = $.proxy(this._keyDown, this);
            this._keyUpProxy = $.proxy(this._keyUp, this);
            this._touchStartProxy = $.proxy(this._touchStart, this);
            this._touchEndProxy = $.proxy(this._touchEnd, this);
            this._focus = $.proxy(this._focus, this);
            this._blur = $.proxy(this._blur, this);
            this._keyPressProxy = $.proxy(this._keyPress, this);
            this._cutProxy = $.proxy(this._cut, this);
            this._pasteProxy = $.proxy(this._paste, this);
            this._docClickProxy = $.proxy(this._docClick, this);
            this._showPasswordProxy = $.proxy(this._showPassword, this);
            this._hidePasswordProxy = $.proxy(this._hidePassword, this);
            this._clearInputProxy = $.proxy(this._clearInput, this);
            this._stepProxy = $.proxy(this._step, this);
            this._stepCloseProxy = $.proxy(this._stepClose, this);
        },

        _wireEvents: function (remove) {
            var obj = this.model;
            var element = this.element;
            var controlname = this._getControlName();
            this._createDelegate();
            if (controlname == 'MaskEdit' || controlname == 'Numeric')
                ej.listenTouchEvent(element, "keypress", this._keyPressProxy, remove);
            if (obj.type == 'number')
                ej.listenEvents([this._upBtn, this._downBtn, this._upBtn, this._downBtn, this._upBtn, this._downBtn, this._upBtn, this._downBtn], [ej.startEvent(), ej.startEvent(), ej.endEvent(), ej.endEvent(), ej.cancelEvent(), ej.cancelEvent(), 'mouseout', 'mouseout'], [this._stepProxy, this._stepProxy, this._stepCloseProxy, this._stepCloseProxy, this._stepCloseProxy, this._stepCloseProxy, this._stepCloseProxy, this._stepCloseProxy], remove);
            if (obj.type == 'password') {
                ej.listenEvents([this._rightIcon, this._rightIcon], [ej.startEvent(), ej.endEvent()], [this._showPasswordProxy, this._hidePasswordProxy], remove);
            }
            if (this._noClearBtn.indexOf(this._getControlName()) == -1) {
                ej.listenTouchEvent(this._rightIcon, "tap", this._clearInputProxy, remove);
            }
            ej.listenEvents([element, element, element, element, element, element, element, element, $(document)], [ej.startEvent(), ej.endEvent(), "keydown", "keyup", "focus", "blur", "cut", "paste", 'click'], [this._touchStartProxy, this._touchEndProxy, this._keyDownProxy, this._keyUpProxy, this._focus, this._blur, this._cutProxy, this._pasteProxy, this._docClickProxy], remove);
        },

        _docClick: function (e) {
            if (!$(e.target).hasClass('e-m-editor') && !$(e.target).hasClass('right-eye-btn e-m-icon-eye') && !$(e.target).hasClass('e-m-icon-clear')) {
                this._removecleariconclass();
            }
        },

        _cut: function (e) {
            if (this._getControlName() == 'MaskEdit' || this.model.type == 'number') e.preventDefault();
        },

        _paste: function (e) {
            if (this._getControlName() == 'MaskEdit' || this.model.type == 'number') e.preventDefault();
        },

        _blur: function (e) {
            if (this.model.type == 'password' || this.model.type == 'number' || this.model.type == 'text' || this.model.type == 'tel' || this.model.type == 'email')
                this.element.parent().removeClass('focus');
            if (this.model.type == 'number') this._setValue(this._validateNumericInput(this.element.val()));
            this._removecleariconclass();
        },

        _removecleariconclass: function(){
            if (this.value()) {
                var righticon = this._getControlName() == 'Password' ? 'eye' : (this._noClearBtn.indexOf(this._getControlName()) == -1 ? 'clear' : '');
                if (righticon) this._rightIcon.removeClass('right-' + righticon + '-btn e-m-icon-' + righticon);
            }
        },

        _step: function (e) {
            if (this.model.enabled && this.model.type == 'number') {
                var self = this;
                var stepmode = $(e.target).hasClass('e-m-icon-down') ? 'down' : 'up';
                this._updateValue(stepmode);
                this._timeout = setInterval(function () { self._updateValue(stepmode); }, 200);
            }
        },

        _updateValue: function (updown) {
            var val = this.element.val() == '' ? this._validateNumericInput(0) : (updown == 'down' ? parseFloat(this.element.val()) - this.model.step : parseFloat(this.element.val()) + this.model.step);
            if (this.model.step.toString().indexOf('.') != -1) val = val.toFixed(this._trimfloat(this.model.step.toString()));
            this._setValue(this._validateNumericInput(val));
        },

        _stepClose: function (e) {
            clearTimeout(this._timeout);
        },

        _focus: function (e) {
            if (this._getControlName() != 'MaskEdit' && this._getControlName() != 'TextArea') this.element.parent().addClass('focus');
            if (this.value()) {
                var righticon = this._getControlName() == 'Password' ? 'eye' : (this._noClearBtn.indexOf(this._getControlName()) == -1 ? 'clear' : '');
                if (righticon) this._rightIcon.addClass('right-' + righticon + '-btn e-m-icon-' + righticon);
            }
        },

        _showPassword: function (e) {
            this.element.attr('type', 'text');
        },

        _hidePassword: function (e) {
            this.element.attr('type', 'password');
        },

        _clearInput: function (e) {
            if (this._rightIcon.hasClass('e-m-icon-clear')) {
                this._rightIcon.removeClass('right-clear-btn e-m-icon-clear');
                this._setValue('');
            }
        },

        _touchStart: function (e) {
            if (this.model.touchStart && !this.model.readOnly) this._trigger("touchStart", { value: this.element.val() });
        },

        _touchEnd: function (e) {
            var data = { value: this.element.val() };
            if (this.model.touchEnd && !this.model.readOnly) this._trigger("touchEnd", data);
        },

        _setCharAt: function (str, index, chr) {
            if (index > str.length - 1) return str;
            return str.substr(0, index) + chr + str.substr(index + 1);
        },

        _validateMaskInput: function (key) {
            if ((this._charType == 'alphabetic' || this._charType == 'numeric' || key == 'Backspace' || key == 'Delete') && this._charType != '') {
                if (this['_' + this._charType].test(key) || key == 'Delete' || key == 'Backspace') {
                    if (this._replace) {
                        var value = (key == 'Backspace' || key == 'Delete') ? '_' : (this._restrictedKeys.indexOf(key) == -1) ? key : '';
                        if (value == '')
                            return false;
                        this.value(this._setCharAt(this.value(), (key == 'Backspace') ? this._charIndex - 1 : this._charIndex, value));
                        this.element.val(this.value());
                        this._setCursor(this.element[0], (key == 'Backspace') ? this._charIndex - 1 : this._charIndex + 1);
                    }
                    else {
                        if (this._restrictedKeys.indexOf(key) == -1) {
                            this.value(this.value() + key);
                            this.element.val(this.value());
                        }
                    }
                }
                else if (!this['_' + this._charType].test(key)) {
                    this.element.val(this.value());
                    this._setCursor(this.element[0], this._charIndex);
                }
                else this._setCursor(this.element[0], this._charIndex);
            }
        },

        _getFormatCharType: function (index) {
            this._formatChar = this.model.format.toString().charAt(index);
            var formatCharType = !(this._alphaNumeric.test(this._formatChar)) ? 'symbol' : this._numeric.test(this._formatChar) ? 'numeric' : this._alphabetic.test(this._formatChar) ? 'alphabetic' : '';
            return formatCharType;
        },

        _setMaskSpecialChar: function (char, index) {
            this.value(this.value() + this._formatChar);
            this.element.val(this.value());
        },

        _setCursor: function (node, pos) {
            node = (typeof node == "string" || node instanceof String) ? document.getElementById(node) : node;
            if (!node) {
                return false;
            } else if (node.createTextRange) {
                var textRange = node.createTextRange();
                textRange.collapse(true);
                textRange.moveEnd('character', pos);
                textRange.moveStart('character', pos);
                textRange.select();
                return true;
            } else if (node.setSelectionRange) {
                node.setSelectionRange(pos, pos);
                return true;
            }
            return false;
        },

        _handleMaskValue: function (e, key) {
            if (this._allowedKeys.indexOf(key) == -1) {
                this._charIndex = this.element[0].selectionStart;
                if (this.element[0].selectionEnd - this._charIndex == 1 && this._charIndex == 0 && e.keyCode == 8)
                    this._charIndex = 1;
                if (this._charIndex == this.model.format.length)
                    this._islastindex = true;
                else
                    this._islastindex = false;

                if (this.value().charAt(this._charIndex) || key == 'Backspace')
                    this._replace = true;
                else
                    this._replace = false;
                this._charType = this._getFormatCharType((key == 'Backspace') ? this._charIndex - 1 : this._charIndex);
                if (!this._islastindex || key == 'Backspace') {
                    if (this._charType == 'symbol') {
                        var i = this._charIndex;
                        do {
                            if (!this._replace) {
                                this._setMaskSpecialChar(this.value() + this._formatChar, i);
                            }
                            else {
                                this._setCursor(this.element[0], (key == 'Backspace') ? i : i + 1);
                                this._charIndex = this.element[0].selectionStart;
                            }
                            (key == 'Backspace') ? i-- : i++;
                            this._charType = this._getFormatCharType(i);
                        } while (this._charType == 'symbol');
                    }
                    this._validateMaskInput(key);
                }
                e.preventDefault();
            }
        },

        _trimfloat: function (numstr) {
            return (numstr.split('.')[1] || []).length;
        },

        _validateNumericInput: function (value) {
            value = parseFloat(value);
            var minval = this.model.minValue;
            var maxval = this.model.maxValue;
            if (isNaN(value)) value = 0;
            return (value > minval && value < maxval) ? value : (value == minval || value < minval) ? minval : maxval;
        },

        _keyDown: function (e) {
            this._keyDownCalled = false;
            if (this._getControlName() == 'MaskEdit' && (e.keyCode == 8 || e.keyCode == 46)) {
                var key = e.keyCode == 8 ? 'Backspace' : 'Delete';
                this._handleMaskValue(e, key);
                this._keyDownCalled = true;
            }
            if (this.model.keyDown && !this.model.readOnly)
                this._trigger("keyDown", { value: this.element.val(), keyCode: e.keyCode });
        },

        _keyPress: function (e) {
            var key = e.key ? e.key : String.fromCharCode(e.keyCode || e.charCode);
            if (this._getControlName() == 'MaskEdit') {
                if (key == 'BackSpace' || key == 'Delete') {
                    if (!this._keyDownCalled) this._handleMaskValue(e, key);
                }
                else
                    this._handleMaskValue(e, key);
            }
            else if (this.model.type == 'number' && this._numbersRegex.indexOf(key) == -1) e.preventDefault();
        },

        _keyUp: function (e) {
            var obj = this.model;
            if (!obj.readOnly) {
                if (this._getControlName() == 'MaskEdit' && (e.keyCode == 229 || e.keyCode == 0)) {
                    var key = String.fromCharCode(e.which);
                    if (e.keyCode == 229 || e.keyCode == 0) {
                        key = String.fromCharCode(this.element.val().charCodeAt(this.element[0].selectionStart - 1));
                        this.element[0].selectionStart = this.element[0].selectionStart - 1;
                    }
                    this._handleMaskValue(e, key);
                    this.element.val(this.value());
                    e.preventDefault();
                }
                else if (this._getControlName() != 'MaskEdit' && obj.type != 'number' && this._getControlName() != 'TextArea') {
                    this.value(this.element.val());
                    var righticon = this._getControlName() == 'Password' ? 'eye' : (this._noClearBtn.indexOf(this._getControlName()) == -1 ? 'clear' : '');
                    if (righticon) this._rightIcon[this.value() ? "addClass" : "removeClass"]('right-' + righticon + '-btn e-m-icon-' + righticon);
                    if (this.value()) this.element.css('padding-right', 32);
                }
                else {
                    this.value(this.element.val());
                    e.preventDefault();
                }
            }
            else {
                e.preventDefault();
            }
            if (this.model.keyUp && !this.model.readOnly)
                this._trigger("keyUp", { value: this.element.val(), keyCode: e.keyCode });
        },

        _setModel: function (options) {
            var refresh = false;
            for (var prop in options) {
                var setModel = "_set" + prop.charAt(0).toUpperCase() + prop.slice(1);
                if (this[setModel])
                    this[setModel](options[prop]);
                else
                    refresh = true;
            }
            if (refresh)
                this._refresh();
        },
        _clearElement: function () {
            if (!ej.isNullOrUndefined(this._inputWrapper)) {
                this._inputWrapper.before(this._cloneElement);
                this._inputWrapper.remove();
                this._inputWrapper = null;
            }
            else
                this.element.replaceWith(this._cloneElement);
            this.element = this._cloneElement;
            this.element.removeAttr("class");
        },

        _destroy: function () {
            this._wireEvents(true);
            this._clearElement();
        },

        _refresh: function () {
            this._destroy();
            this.element.addClass("e-m-editor");
            this._init();
        }
    });

    ej.mobile.TextBox.BorderStyle = {
        Box: "box",
        Line: "line",
        None: "none"
    };

    ej.mobile.TextBox.Type = {
        Number: "number",
        Text: "text",
        Password: "password",
        Tel: "tel",
        Email: "email"
    };
    var LocaleObj = {
        watermarkText: ""
    };
    ej.mobile.TextBox.Locale = ej.mobile.TextBox.Locale || {};
    ej.mobile.TextArea.Locale = ej.mobile.TextArea.Locale || {};
    ej.mobile.Password.Locale = ej.mobile.Password.Locale || {};
    ej.mobile.Numeric.Locale = ej.mobile.Numeric.Locale || {};
    ej.mobile.MaskEdit.Locale = ej.mobile.MaskEdit.Locale || {};

    ej.mobile.TextBox.Locale["default"] = ej.mobile.TextBox.Locale["en-US"] =
    ej.mobile.TextArea.Locale["default"] = ej.mobile.TextArea.Locale["en-US"] =
    ej.mobile.Password.Locale["default"] = ej.mobile.Password.Locale["en-US"] =
    ej.mobile.Numeric.Locale["default"] = ej.mobile.Numeric.Locale["en-US"] =
    ej.mobile.MaskEdit.Locale["default"] = ej.mobile.MaskEdit.Locale["en-US"] = LocaleObj;
})(jQuery, Syncfusion);