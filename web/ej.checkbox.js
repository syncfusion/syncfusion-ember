/**
* @fileOverview Plugin to style the Html CheckBox elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    ej.widget("ejCheckBox", "ej.CheckBox", {
        _rootCSS: "e-checkbox",

        element: null,

        model: null,
        validTags: ["input"],
        _addToPersist: ["checked", "checkState"],
        _setFirst: false,
        angular: {
            require: ['?ngModel', '^?form', '^?ngModelOptions']
        },


        defaults: {

            id: null,

            name: null,

            value: null,

            htmlAttributes: {},

            checked: false,

            enabled: true,

            enableTriState: false,

            showRoundedCorner: false,

            enablePersistence: false,

            cssClass: "",

            text: "",

            enableRTL: false,

            idPrefix: "ej",

            size: "small",

            checkState: "uncheck",

            validationRules: null,

            validationMessage: null,
            validationMessages: null,

            beforeChange: null,

            change: null,

            create: null,

            destroy: null

        },

        dataTypes: {
            id: "string",
            name: "string",
            enablePersistence: "boolean",
            enableTriState: "boolean",
            size: "enum",
            enabled: "boolean",
            idPrefix: "string",
            validationRules: "data",
            validationMessage: "data",
            validationMessages: "data",
            htmlAttributes: "data"
        },
        observables: ["checked", "checkState"],
        checked: ej.util.valueFunction("checked"),
        checkState: ej.util.valueFunction("checkState"),

        _init: function (options) {
            this._cloneElement = this.element.clone();
            var browserInfo = ej.browserInfo();
            this._isIE8 = (browserInfo.name == 'msie' && browserInfo.version == '8.0') ? true : false;
            this._isIE9 = (browserInfo.name == 'msie' && browserInfo.version == '9.0') ? true : false;
            this._isDevice = this._checkDevice();
            this._setValue();
            this._renderControl();
            this.model.enableRTL && this._setRTL();
            if (this.model.enabled)
                this._wireEvents();
            this._setEnabled(this.model.enabled);
			if (!ej.isNullOrUndefined(options) && !ej.isNullOrUndefined(options.validationMessage))
				this.model.validationMessages= this.model.validationMessage;
            if (this.model.validationRules != null) {
                this._initValidator();
                this._setValidation();
            }
            this._addAttr(this.model.htmlAttributes);
            if (this._isIE9 || this._isIE8) {
                // In IE8 and IE9, the text of the checkox will float to next line while the length of the text is high fixed this by adding the following class and procssed with CSS
                this.wrapper.addClass("e-tb-cell");
            }
        },
        _checkDevice: function () {
            return (ej.isDevice() && ej.isTouchDevice());
        },
        _setRTL: function () {
            $(this.maindiv).addClass("e-rtl");
        },
        _initValidator: function () {
            (!this.wrapper.closest("form").data("validator")) && this.wrapper.closest("form").validate();
        },
        _setValidation: function () {
            this.wrapper.find('input').rules("add", this.model.validationRules);
            var validator = this.wrapper.closest("form").data("validator");
            validator = validator ? validator : this.wrapper.closest("form").validate();
            name = this.wrapper.find('input').attr("name");
            validator.settings.messages[name] = {};
            for (var ruleName in this.model.validationRules) {
                var message = null;
                if (!ej.isNullOrUndefined(this.model.validationRules[ruleName])) {
                    if (!ej.isNullOrUndefined(this.model.validationRules["messages"] && this.model.validationRules["messages"][ruleName]))
                        message = this.model.validationRules["messages"][ruleName];
                    else {
                        validator.settings.messages[name][ruleName] = $.validator.messages[ruleName];
                        for (var msgName in this.model.validationMessages)
                            ruleName == msgName ? (message = this.model.validationMessages[ruleName]) : "";
                    }
                    validator.settings.messages[name][ruleName] = message != null ? message : $.validator.messages[ruleName];
                }
            }
        },
        _addAttr: function (htmlAttr) {
            var proxy = this;
            $.map(htmlAttr, function (value, key) {
                if (key == "class") proxy.wrapper.addClass(value);
                else if (key == "name") proxy.element.attr(key, value);
                else if (key == "required") proxy.element.attr(key, value);
                else if (key == "disabled" && value == "disabled") proxy._setEnabled(false);
                else if (key == "checked" && value == "checked") {
                    if (proxy.checked() instanceof Array)
                        proxy._updateCheckedItem();
                    else
                        proxy._checked(true);
                }
                else proxy.wrapper.attr(key, value);
            });
        },

        _triggerBeforeChange: function () {
            var data = { isChecked: this._isChecked, isInteraction: false };
            if (true == this._trigger("beforeChange", data)) return false;
        },

        _triggerChange: function () {
            var data = { isChecked: this._isChecked, checkState: this.checkState(), isInteraction: false };
            this._trigger("change", data);
        },

        _setModel: function (options) {
            for (var prop in options) {
                switch (prop) {
                    case "checked":
                        $(this.maindiv).removeClass("e-material-animate");
                        if (this.model.beforeChange) this._triggerBeforeChange();
                        if (this.checked() instanceof Array) {
                            var checkedItemArray = ej.util.getVal(options[prop]);
                            var lastVal = checkedItemArray[checkedItemArray.length - 1];
                            if (this.model.value == lastVal) this._isChecked = true;
                        }
                        else {
                            this._isChecked = ej.util.getVal(options[prop]);
                            this.checked(this._isChecked);
                        }
                        this._isChecked ? this._checked() : this._unChecked();
                        if (this.model.change) this._triggerChange();
                        break;
                    case "enableTriState":
                        if (options[prop]) {
                            this.model.enableTriState = options[prop];
                            this._indeterminateState = options[prop];
                        }
                        break;
                    case "checkState":
                        if (this.model.enableTriState) {
                            if (this.model.beforeChange) this._triggerBeforeChange();
                            this._isChecked = ej.util.getVal(options[prop]);
                            this.checkState(this._isChecked);
                            this._changeState(this._isChecked);
                            this._setCheckBoxState();
                            this.checked(this._isChecked);
                            if (this.model.checkState == "indeterminate")
                                this._setIndeterminate(this._indeterminateState);
                            if (this.checked() instanceof Array)
                                this._updateCheckedItem();
                            else if (options[prop] == "check") this._hiddenInput.removeAttribute("name");
                            else this._hiddenInput.setAttribute("name", this.model.name);
                            if (this.model.change) {
                                if (!(this.checked() instanceof Array)) this._isChecked = this.checkState() == "uncheck" ? false : true;
                                this._triggerChange();
                            }
                        }
                        break;
                    case "cssClass": this._changeSkin(options[prop]); break;
                    case "enableRTL":
                        (options[prop]) ? this._setRTL() : $(this.maindiv).removeClass("e-rtl");
                        break;
                    case "text": this._setText(options[prop]); break;
                    case "validationRules":
                        if (this.model.validationRules != null) {
                            this.wrapper.find('input').rules('remove');
                            this.model.validationMessages = null;
                        }
                        this.model.validationRules = options[prop];
                        if (this.model.validationRules != null) {
                            this._initValidator();
                            this._setValidation();
                        }
                        break;
                    case "validationMessage":
					this.model.validationMessages = options[prop];
                        if (this.model.validationRules != null && this.model.validationMessages != null) {
                            this._initValidator();
                            this._setValidation();
                        }
                         break;
					case "validationMessages":
					  this.model.validationMessages = options[prop];
                        if (this.model.validationRules != null && this.model.validationMessages != null) {
                            this._initValidator();
                            this._setValidation();
                        }
                        break;
                    case "id": this._setIdAttr(options[prop]); break;
                    case "name": this.element.attr('name', options[prop]);
                        if (!this._isChecked || this.spanImg.hasClass("e-chk-indeter")) this._hiddenInput.setAttribute('name', options[prop]);
                        this.model.name = options[prop];
                        break;
                    case "value": this.element.attr('value', options[prop]); break;
                    case "size": this._setSize(options[prop]); break;
                    case "showRoundedCorner": this._setRoundedCorner(options[prop]); break;
                    case "enabled": this._setEnabled(options[prop]); break;
                    case "htmlAttributes": this._addAttr(options[prop]); break;
                }
            }
        },

        _destroy: function () {
            this.element.removeClass("e-checkbox e-input");
            !this._cloneElement.attr("name") && this.element.attr("name") && this.element.removeAttr("name");
            !this._cloneElement.attr("value") && this.element.attr("value") && this.element.removeAttr("value");
            this.element.insertBefore(this.wrapper);
            this.wrapper.remove();
        },

        _changeSkin: function (skin) {
            if (this.model.cssClass != skin) {
                this.wrapper.removeClass(this.model.cssClass).addClass(skin);
                $("#" + this.model.idPrefix + this.model.id + "_wrapper").removeClass(this.model.cssClass).addClass(skin);
            }
        },

        _setValue: function () {
            this._indeterminateState = false;
            this._isChecked = false;
            var _id = this.element[0].getAttribute("id"), _name = this.element[0].getAttribute('name'), _value = this.element[0].getAttribute('value');
            !ej.isNullOrUndefined(_id) && (this.model.id = _id);
            !ej.isNullOrUndefined(_name) && (this.model.name = _name);
            if (!ej.isNullOrUndefined(_value) && _value != "") this.model.value = _value;
            if (!this.checked() && !ej.isNullOrUndefined(this.element.attr('checked'))) this._isChecked = true;
            ej.isNullOrUndefined(this.model.name) && (this.model.name = this.model.id);
            this.model.enabled = this.model.enabled && !this.element.attr("disabled");
        },

        _setSize: function (val) {
            if (val == ej.CheckboxSize.Medium) {
                $(this.innerdiv).removeClass('e-chkbox-small').addClass('e-chkbox-medium');
                $(this.maindiv).removeClass('e-check-small').addClass('e-check-medium');
				
			}
            else {
                $(this.innerdiv).removeClass('e-chkbox-medium').addClass('e-chkbox-small');
				$(this.maindiv).removeClass('e-check-medium').addClass('e-check-small');
			}
        },

        _setRoundedCorner: function (val) {
            if (val)
                this.span.addClass("e-corner");
            else
                this.span.removeClass("e-corner");
        },

        _setEnabled: function (val) {
            if (val) {
                this.enable();
            } else {
                this.disable();
            }
        },
        _setCheckBoxState: function () {
            if (this.model.enableTriState) {
                if (this.checkState() == "indeterminate")
                    this._indeterminateState = true;
                else if (this.checkState() == "check")
                    this._isChecked = true;
                else if (this.checkState() == "uncheck")
                    this._isChecked = false;
            }
            else if (this.checkState() == "indeterminate")
                this.checkState("uncheck");
        },
        _createElement: function (tagName, attrs) {
            var ele = document.createElement(tagName);
            this._setAttributes(ele, attrs);
            return ele;
        },
        _setAttributes: function (ele, attrs) {
            for (var key in attrs) {
                ele.setAttribute(key, attrs[key]);
            }
        },
        _renderControl: function () {
            this._setCheckBoxState();
            this.maindiv = this._createElement("span", { "class": "e-chkbox-wrap e-widget " + this.model.cssClass, "role": "checkbox", tabindex: 0 });
            if (this._isValid(this.model.id)) {
                this.maindiv.setAttribute("id", this.model.idPrefix + this.model.id);
                this.element[0].setAttribute("id", this.model.id);
            }
            this.innerdiv = document.createElement("div");
            this._setSize(this.model.size);
            this.span = document.createElement("span");
            this.span = $(this.span);
            this.spanImg = this._createElement("span", { "class": "e-chk-image e-icon", "role": "presentation" });
            this.spanImg = $(this.spanImg);
            this.element.addClass("e-input");
            this.model.name = ej.isNullOrUndefined(this.model.name) ? this.model.id : this.model.name;
		    this.model.value = ej.isNullOrUndefined(this.model.value) ? true : this.model.value;
            this._setAttributes(this.element[0], { "name": this.model.name, "value": this.model.value });
            var hiddenEl = $("#" + this._id + "_hidden")
            // hidden input element will be generated in MVC wrapper
            this._hiddenInput = hiddenEl.length ? hiddenEl[0] : this._createElement("input", { type: "checkbox", value: false, style: "display:none" });
			if (this.element.attr("data-type") == "hidden") this._hiddenInput.setAttribute("type", "hidden");
            this._isValid(this.model.name) && this._hiddenInput.setAttribute("id", this.model.name + "_hidden");

            this._setRoundedCorner(this.model.showRoundedCorner);
            if (this.checked())
                this._setCheckedItem(this.checked());
            if (this._isChecked) {
                this.spanImg.addClass("e-checkmark");
                this.span.addClass("e-chk-act");
                this.maindiv.setAttribute("aria-checked", true);
                this.element.attr("checked", "checked")
            }
            else {
                this.span.addClass("e-chk-inact");
                this.maindiv.setAttribute("aria-checked", false);
                this._hiddenInput.setAttribute("name", this.model.name);
            }
            if (!(this.checked() instanceof Array))
                this.checked(this._isChecked);
            this.span[0].appendChild(this.spanImg[0]);
            this.innerdiv.appendChild(this.span[0]);
            this.element[0].parentNode && this.element[0].parentNode.insertBefore(this.maindiv, this.element[0]);
            this.maindiv.appendChild(this.element[0]);
            this.maindiv.appendChild(this._hiddenInput);
            this.maindiv.appendChild(this.innerdiv);
            this.wrapper = $(this.maindiv);
            this._setTextWrapper(this.model.text);
            this.chkbx = this.element;
            if (this.model.enableTriState == true && this._indeterminateState == true)
                this._setIndeterminate(this._indeterminateState);
            if (this.checked() instanceof Array)
                this._updateCheckedItem();
        },
        _changeState: function (state) {
            if (state == "indeterminate") {
                this.spanImg.removeClass("e-checkmark").addClass("e-stop");
                this.span.removeClass("e-chk-act e-chk-inact").addClass("e-chk-indeter");
                this.wrapper[0].setAttribute("aria-checked", "mixed");
                this.wrapper.find('input').prop('enableTriState', true);
                if (!(this.checked() instanceof Array))
                    this.checked(null);
            }
            else if (state == "check") {
                this.spanImg.removeClass("e-stop").addClass("e-checkmark");
                this.span.removeClass("e-chk-act e-chk-inact e-chk-indeter").addClass("e-chk-act");
                this.wrapper[0].setAttribute("aria-checked", true);
            }
            else if (state == "uncheck") {
                this.spanImg.removeClass("e-checkmark e-stop");
                this.span.removeClass("e-chk-act e-chk-indeter").addClass("e-chk-inact");
                this.wrapper[0].setAttribute("aria-checked", false);
            }
        },

        _setIndeterminate: function (indeter) {
            if (indeter) {
                this.spanImg.removeClass("e-checkmark").addClass("e-stop");
                this.span.removeClass("e-chk-act e-chk-inact").addClass("e-chk-indeter");
                this.wrapper[0].setAttribute("aria-checked", "mixed");
                this.wrapper.find('input').prop('enableTriState', true);
                this.checkState("indeterminate");
                if (!(this.checked() instanceof Array))
                    this.checked(null);
                this._hiddenInput.setAttribute("name", this.model.name);
            }
            else {
                this.span.removeClass("e-chk-indeter");
                this.spanImg.removeClass("e-stop");
                this.wrapper.find('input').removeAttr('enableTriState');
                this.wrapper.find('input').prop('enableTriState', false);
                if (this.checked())
                    this._checked();
                else
                    this._unChecked();
            }
        },

        _setTextWrapper: function (val) {
            if (val != "") {
                this.txtSpan = ej.buildTag("div.e-text", val);
                this.wrapper.append(this.txtSpan);
                this.model.enableRTL && this._setRTL();
            }
        },

        _setText: function (val) {
            if ((this.model.text == "") && (val != "")) {
                this._setTextWrapper(val);
            } else {
                this.txtSpan.html(val);
            }
        },

        _setIdAttr: function (val) {
            $("#" + this.model.idPrefix + this.model.id + "_wrapper").attr('id', this.model.idPrefix + val + "_wrapper");
            this.element[0].setAttribute('id', val);
        },

        _isValid: function (value) {
            return (!ej.isNullOrUndefined(value) && value != "") ? true : false;
        },

        _wireEvents: function () {
            this._on(this.wrapper, "click", this._checkedHandler);
            if (this._isIE8) {
                this._isValid(this.model.id) && this._on($("label[for=" + this.model.id + "]"), "click", function () { this.wrapper.click(); });
            }
            this._on(this.wrapper, "focus", this._focusIn);
            this._on(this.wrapper, "focusout", this._focusOut);
        },


        _unWireEvents: function () {
            this._off(this.wrapper, (this._isDevice && $.isFunction($.fn.tap)) ? "tap" : "click");
            if (this._isIE8) {
                this._isValid(this.model.id) && this._off($("label[for=" + this.model.id + "]"), "click");
            }
            this._off(this.wrapper, "focus");
            this._off(this.wrapper, "focusout");
        },
        _focusIn: function (evt) {
            $(this.wrapper).addClass("e-focus");
            $(this.wrapper).on("keydown", $.proxy(this._checkUnCheck, this));
        },
        _focusOut: function (evt) {
            $(this.wrapper).removeClass("e-focus");
            $(this.wrapper).off("keydown", $.proxy(this._checkUnCheck, this));
        },
        _checkUnCheck: function (evt) {
            //Space bar to check and uncheck
            if (evt.keyCode == 32) {
                evt.preventDefault();
                this._checkedHandler();
            }
        },
        _checkedHandler: function (evt) {
            var data = { isChecked: this._isChecked, isInteraction: true, event: evt };
            if (true == this._trigger("beforeChange", data)) {
                return false;
            }
            if (this.span.hasClass("e-chk-inact")) {
                this._checked();
                if (!(this.checked() instanceof Array))
                    this.checked(true);
                if (this.model.enableTriState) {
                    this._indeterminateState = true;
                    this.checkState("check");
                }
            }
            else if (this.span.hasClass("e-chk-act")) {
                if ((this.model.enableTriState == true) && (this.model.checkState == "check") && (this.model.checked == true)){
                    this._setIndeterminate(true);
                    if (!(this.checked() instanceof Array)) {
                        this.checked(true);
                        this.checkState("indeterminate");
                    }
                } else {
                    this._unChecked();
                    if (!(this.checked() instanceof Array)) {
                        this.checked(false);
                        this.checkState("uncheck");
                    }
                }
            }
            else if (this.span.hasClass("e-chk-indeter")) {
                if (!(this.checked() instanceof Array))
                    this.checked(false);
                else
                    this._isChecked = false;
                this._setIndeterminate(false);
                this._indeterminateState = false;
            }
            if (this.checked() instanceof Array)
                this._updateCheckedItem();
            else
                this._isChecked = this.checked();
            $(this.maindiv).addClass("e-material-animate");
            var data = { isChecked: this._isChecked, checkState: this.checkState(), isInteraction: true, event: evt };
            this._trigger("change", data);
            return true;
        },


        _checked: function () {
            this.span.removeClass("e-chk-inact").addClass("e-chk-act");
            this.spanImg.removeClass("e-stop").addClass("e-checkmark");
            this.wrapper[0].setAttribute("aria-checked", true);
            this.wrapper.find('input[type=checkbox]').prop('checked', true);
            this.checkState("check");
            this._hiddenInput.removeAttribute("name");
        },


        _unChecked: function () {
            this.span.removeClass("e-chk-act e-chk-indeter").addClass("e-chk-inact");
            this.wrapper[0].setAttribute("aria-checked", false);
            this.spanImg.removeClass("e-checkmark e-stop");
            this.wrapper.find('input[type=checkbox]').prop('checked', false);
            this.checkState("uncheck");
            this._hiddenInput.setAttribute("name", this.model.name);
        },

        _setCheckedItem: function (value) {
            if (typeof(value) == "boolean" && !(value instanceof Array))
                this._isChecked = true;
            else if (value instanceof Array && !ej.isNullOrUndefined(this.model.value) && this.model.value != "") {
                for (var item = 0; item < value.length; item++) {
                    if (value[item] == this.model.value)
                        this._isChecked = true;
                }
            }
        },

        _updateCheckedItem: function () {
            var checkedValues = this.model.checked.splice === undefined ? this.model.checked() : this.model.checked;
            if (!ej.isNullOrUndefined(this.model.value) && this.model.value != "" && !this.wrapper.find("span:first").hasClass("e-chk-indeter")) {
                if (($.inArray(this.model.value, this.checked()) < 0) && this.wrapper.find("span:first").hasClass("e-chk-act")) {
                    checkedValues.push(this.model.value);
                    this._isChecked = true;
                    this._hiddenInput.removeAttribute("name");
                }
                else if (($.inArray(this.model.value, this.checked()) > -1) && this.wrapper.find("span:first").hasClass("e-chk-inact")) {
                    this._isChecked = false;
                    checkedValues.splice($.inArray(this.model.value, this.model.checked()), 1);
                    this._hiddenInput.setAttribute("name", this.model.name);
                }
            }
        }, 
 

        disable: function () {
            if (!this.wrapper.hasClass("e-disable")) {
                this.wrapper.addClass("e-disable");
                this.wrapper[0].setAttribute("aria-disabled", true);
                this.element[0].setAttribute("disabled", "disabled");
                if (this._isIE8) this.span.addClass("e-disable");
                this._unWireEvents();
                this.model.enabled = false;
            }
        },

        enable: function () {
            if (this.wrapper.hasClass("e-disable")) {
                this.wrapper.removeClass("e-disable");
                this.wrapper[0].setAttribute("aria-disabled", false);
                this.element.prop("disabled", false);
                if (this._isIE8) this.span.removeClass("e-disable");
                this._wireEvents();
                this.model.enabled = true;
            }
        },

        isChecked: function () {
            if ((this._isChecked != null) && (this._isChecked != undefined))
                return this._isChecked;
        }
    });

    ej.CheckboxSize = {
        /**  Creates checkbox with inbuilt small size height, width specified */
        Small: "small",
        /**  Creates checkbox with inbuilt medium size height, width specified */
        Medium: "medium"
    };

    ej.CheckState = {
        /**  Specifies the Check attribute of the Checkbox */
        Check: "check",
        /**  Specifies the Uncheck attribute of the Checkbox */
        Uncheck: "uncheck",
        /**  Specifies the Indeterminate state of the Checkbox */
        Indeterminate: "indeterminate"
    };
})(jQuery, Syncfusion);;