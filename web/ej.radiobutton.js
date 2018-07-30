/**
* @fileOverview Plugin to style the Html Radiobutton elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    ej.widget("ejRadioButton", "ej.RadioButton", {
        _rootCSS: "e-radiobtn",

        element: null,
        _requiresID: true,
        model: null,
        validTags: ["input"],
        _addToPersist: ["checked"],
        _setFirst: false,
        angular: {
            require: ['?ngModel', '^?form', '^?ngModelOptions']
        },

        defaults: {

            id: null,

            name: null,

            value: null,

            checked: false,

            cssClass: "",

            text: "",

            enableRTL: false,

            htmlAttributes: {},

            enablePersistence: false,

            idPrefix: "ej",

            size: "small",

            enabled: true,

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
            size: "enum",
            enabled: "boolean",
            idPrefix: "string",
            validationRules: "data",
            validationMessage: "data",
            validationMessages: "data",
            htmlAttributes: "data"
        },

        observables: ["checked"],
        checked: ej.util.valueFunction("checked"),

        _init: function (options) {
            var browserInfo = ej.browserInfo();
            this._cloneElement = this.element.clone();
            this._isIE8 = (browserInfo.name == 'msie' && browserInfo.version == '8.0') ? true : false;
            this._setValue();
            this._renderControl();
            if (this.isChecked)
                this._checkedHandler();
            if (!ej.isNullOrUndefined(this.radbtn.attr("disabled"))) this.model.enabled = false;
            this._setEnabled(this.model.enabled);
            this._addAttr(this.model.htmlAttributes);
            if (!ej.isNullOrUndefined(options) && !ej.isNullOrUndefined(options.validationMessage))
                this.model.validationMessages = this.model.validationMessage;
            if (this.model.validationRules != null) {
                this._initValidator();
                this._setValidation();
            }
            this._wireEvents();
            this.initialRender = false;
        },
        _addAttr: function (htmlAttr) {
            var proxy = this;
            $.map(htmlAttr, function (value, key) {
                if (key == "class") proxy.div.addClass(value);
                else if (key == "name") proxy.radbtn.attr(key, value);
                else if (key == "required") proxy.radbtn.attr(key, value);
                else if (key == "disabled" && value == "disabled") proxy.disable();
                else if (key == "checked" && value == "checked") proxy._checkedChange(true, true);
                else proxy.div.attr(key, value);
            });
        },

        _initValidator: function () {
            (!this.element.closest("form").data("validator")) && this.element.closest("form").validate();
        },
        _setValidation: function () {
            this.element.find("input").rules("add", this.model.validationRules);
            var validator = this.element.closest("form").data("validator");
            validator = validator ? validator : this.element.closest("form").validate();
            name = this.element.find('input').attr("name");
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


        _setModel: function (options) {
            for (var prop in options) {
                switch (prop) {
                    case "cssClass": this._changeSkin(options[prop]); break;
                    case "enableRTL":
                        if (this.model.text)
                            (options[prop]) ? this.div.addClass("e-rtl") : this.div.removeClass("e-rtl") && this.element.closest('.e-radiobtn-wrap').hasClass('e-rtl') ? this.element.closest('.e-radiobtn-wrap').removeClass('e-rtl') : "";
                        else 
                            (options[prop]) ? this.element.closest('.e-radiobtn-wrap').addClass('e-rtl') : this.element.closest('.e-radiobtn-wrap').removeClass('e-rtl');
                        break;
                    case "text": this._setText(options[prop]); break;
                    case "size": this._setSize(options[prop]); break;
                    case "validationRules":
                        if (this.model.validationRules != null) {
                            this.element.find('input').rules('remove');
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
                    case "checked":
                        $(this.div).removeClass("e-material-animate");
                        if (typeof this.checked() == "boolean") {
                            this.model.checked = options[prop];
                            this._checkedChange(this.model.checked);
                        }
                        else if (options[prop]() != null) {
                            if (options[prop]() == this.element.find(".e-input").attr("value"))
                                this._checkedChange(options[prop]());
                        }
                        break;
                    case "enabled": this._setEnabled(options[prop]); break;
                    case "id": this._setIdAttr(options[prop]); break;
                    case "name": this.radbtn.attr('name', options[prop]); break;
                    case "value":
                        this.radbtn.attr("value", options[prop]);
                        break;
                    case "htmlAttributes": this._addAttr(options[prop]); break;
                }
            }
        },

        _destroy: function () {
            this.radbtn.remove();
            this._cloneElement.removeClass("e-js e-input e-radiobtn");
            this._cloneElement.insertBefore(this.element)
            this.element.remove();
        },

        _changeSkin: function (skin) {
            if (this.model.cssClass != skin) {
                this.element.removeClass(this.model.cssClass).addClass(skin);
                this.div.removeClass(this.model.cssClass).addClass(skin);
            }
        },

        _setValue: function () {
            if (ej.isNullOrUndefined(this.element.attr("type")))
                this.element.attr("type", "radio");
            if (!ej.isNullOrUndefined(this.element.attr("id")))
                this.model.id = this.element.attr("id");
            if (!ej.isNullOrUndefined(this.element.attr("name")))
                this.model.name = this.element.attr("name");
            if (!ej.isNullOrUndefined(this.element.attr("value")))
                this.model.value = (this.element.attr("value"));
            this.element.attr({ "id": this.model.id, "name": this.model.name, "value": this.model.value });
            if (typeof this.checked() == "boolean")
                this.model.checked = this.isChecked = this.model.checked || this.element.attr('checked') == "checked"
            else
                this.isChecked = this.element.attr("value") == this.checked();
            if (this.isChecked) this.element.attr('checked', 'checked');
            this._hiddenValue = this.element.attr("value");
            this._isUI = false;
        },

        _setIdAttr: function (val) {
            $("#" + this.model.idPrefix + this.model.id + "_wrapper").attr('id', this.model.idPrefix + val + "_wrapper");
            $("#" + this.model.idPrefix + this.model.id).attr('id', this.model.idPrefix + val);
            this.radbtn.attr('id', val);
        },

        _setSize: function (val) {
            if (val == ej.RadioButtonSize.Medium) {
                this.span.removeClass('e-radsmaller').addClass('e-radmedium');
                this.div.removeClass('e-radsmall').addClass('e-radmed');
            }
            else {
                this.span.removeClass('e-radmedium').addClass('e-radsmaller');
                this.div.removeClass('e-radmed').addClass('e-radsmall');
            }
        },

        _setEnabled: function (val) {
            if (val) {
                this.enable();
            } else {
                this.disable();
            }
        },

        _renderControl: function () {
            this.initialRender = true;
            var browserInfo = ej.browserInfo();
            if (browserInfo.name == 'msie' && browserInfo.version == '8.0')
                this.div = $('<div class="e-radiobtn-wrap e-widget e-rad-outer" ></div>');
            else
                this.div = $('<div class="e-radiobtn-wrap e-widget" ></div>');
            this.div.attr({ 'id': this.model.idPrefix + this.model.id, "role": "radio", "tabindex": 0, "aria-checked": false });
            this.span = $('<span></span>');
            this.span.addClass("e-spanicon");
            this._setSize(this.model.size);
            this.spanImg = $('<span class="e-rad-icon e-icon e-rad-select"></span>', "", {}, { "role": "presentation" });
            this.element.addClass("e-input");
            this.div.addClass(this.model.cssClass);
            this.span.append(this.spanImg);
            this.div.insertBefore(this.element);
            this.div.append(this.element);
            this.div.append(this.span);
            this._setTextWrapper(this.model.text);
            this.radbtn = this.element;
            this.element = this.div;
        },

        _setTextWrapper: function (val) {
            if (val != "") {
                this.txtSpan = ej.buildTag("div.e-text", val);
                this.div.append(this.txtSpan);
                if (this.model.enableRTL)
                    this.div.addClass("e-rtl");
            } else if (this.model.enableRTL)
                this.element.closest('.e-radiobtn-wrap').addClass('e-rtl');
        },

        _setText: function (val) {
            if ((this.model.text == "") && (val != "")) {
                this._setTextWrapper(val);
            } else {
                this.txtSpan.html(val);
            }
        },

        _wireEvents: function () {
            this._on(this.element, "click", function (e) {
                this._isUI = true;
                this._checkedHandler(e);
            });
            this._on(this.element, "focus", this._focusIn);
            this._on(this.element, "focusout", this._focusOut);
        },
        _focusIn: function (evt) {
            $(this.element).addClass("e-focus");
            $(this.element).on("keydown", $.proxy(this._checkUnCheck, this));
        },
        _focusOut: function (evt) {
            $(this.element).removeClass("e-focus");
            $(this.element).off("keydown", $.proxy(this._checkUnCheck, this));
        },

        _checkUnCheck: function (evt) {
            //Space bar,and arrow keys to check and uncheck
            if (evt.keyCode == 32 || evt.keyCode == 37 || evt.keyCode == 38 || evt.keyCode == 39 || evt.keyCode == 40) {
                evt.preventDefault();
                this._checkedHandler();
            }
        },

        _checkedHandler: function (evt) {
            if (evt) this._interacted = true;
            if (!this.element.hasClass('e-disable')) {
                if (typeof this.checked() == "boolean")
                    this.isChecked = this.radbtn.attr('checked') == 'checked' ? true : false;
                else
                    this.isChecked = this.checked() == this.radbtn.attr('value');
                if (!$(this.element).find(".e-rad-icon").hasClass("e-circle_01")) this._changeEvent(true);
                if (evt) $(this.div).addClass("e-material-animate");
            }
        },

        _checkedChange: function (val, interaction) {
            this.isChecked = val;
            this._changeEvent(interaction);
        },

        _changeEvent: function (interaction) {
            var data = { isChecked: this.isChecked, isInteraction: !!interaction };
            if (!this.initialRender) {
                if (true == this._trigger("beforeChange", data))
                    return false;
            }

            if (!$(this.element).find(".e-rad-icon").hasClass("e-circle_01")) {
                var curname = this.element.find(".e-input").attr('name'),
                input = $('input.e-radiobtn[name="' + curname + '"]:radio'),
                proxy = this,
                currElement = this.element.find('.e-input'),
                currObj = $(currElement).data("ejRadioButton");
                if (data.isChecked) {
                    this.spanImg.addClass("e-circle_01").removeClass('e-rad-select');
                    this.span.addClass("e-rad-active");
                    this.div.attr({ "tabindex": 0, "aria-checked": true });
                    this.radbtn.attr("checked", "checked");
                }
                $.each(input, function (i, obj) {
                    if (proxy._interacted && $($(obj).closest(".e-widget")).find("span.e-spanicon").hasClass("e-rad-active")) $(obj).closest(".e-radiobtn-wrap").addClass("e-material-animate");
                    $(obj).closest(".e-radiobtn-wrap").find(".e-rad-icon").removeClass("e-circle_01").addClass("e-rad-select");
                    $(obj).closest(".e-radiobtn-wrap").find(".e-spanicon").removeClass("e-rad-active");
                    $(obj).closest(".e-radiobtn-wrap").attr({ "tabindex": 0, "aria-checked": false });
                    var prevObj = $(obj).data("ejRadioButton");
                    if (prevObj != null && prevObj.checked() != null && typeof prevObj.checked() == "boolean")
                        prevObj.model.checked = false;
                });
                if (currObj != null && currObj.checked() != null && typeof currObj.checked() == "boolean")
                    currObj.model.checked = true;
                else
                    currObj.checked(currObj.radbtn.attr("value"));
                this.element.find(".e-rad-icon").addClass("e-circle_01").removeClass("e-rad-select");
                this.span.addClass("e-rad-active");
                this.div.attr({ "tabindex": 0, "aria-checked": true });
                if (this._isUI) this.element.find(".e-input").click();
                this.isChecked = true;
                (this.isChecked == true) ? this.radbtn.attr("checked", "checked") : this.radbtn.removeAttr("checked");
            }
            else {
                this.spanImg.removeClass("e-circle_01").addClass('e-rad-select');
                this.span.removeClass("e-rad-active");
                this.div.attr({ "tabindex": 0, "aria-checked": false });
                this.radbtn.removeAttr("checked");
            }

            var data = { isChecked: this.isChecked, isInteraction: !!interaction };
            if (!this.initialRender)
                this._trigger("change", data);
            if (interaction) this._trigger("_change", { value: this._hiddenValue });
        },

        disable: function () {
            if (!this.element.hasClass("e-disable")) {
                this.element.addClass("e-disable");
                this.radbtn.attr("disabled", "disabled");
            }
            if (this._isIE8) this.span.addClass("e-disable");
            this.div.attr("aria-disabled", true);
            this.model.enabled = false;
        },

        enable: function () {
            if (this.element.hasClass("e-disable")) {
                this.element.removeClass("e-disable");
                this.radbtn.prop("disabled", false);
            }
            if (this._isIE8) this.span.removeClass("e-disable");
            this.div.attr("aria-disabled", false);
            this.model.enabled = true;
        }
    });

    ej.RadioButtonSize = {
        /**  Creates radio button with inbuilt small size height, width specified */
        Small: "small",
        /**  Creates radio button with inbuilt medium size height, width specified */
        Medium: "medium"
    };
})(jQuery, Syncfusion);
