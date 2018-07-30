(function ($, ej, undefined) {

    ej.widget({ "ejmRadioButton": "ej.mobile.RadioButton", "ejmCheckBox": "ej.mobile.CheckBox" }, {
        _setFirst: true,
        _rootCSS: "e-m-editor",
        validTags: ["input"],

        defaults: {
            renderMode: "auto",
            cssClass: '',
            enablePersistence: false,
            enabled: true,
            checked: false,
            touchStart: null,
            enableRippleEffect: ej.isAndroid() ? true : false,
            touchEnd: null,
            beforeChange: null,
            change: null
        },

        dataTypes: {
            renderMode: "enum",
            enablePersistence: 'boolean',
            enabled: 'boolean',
            enableRippleEffect: "boolean",
            checked: 'boolean'
        },

        _init: function () {
            this._cloneElement = this.element.clone();
            this._renderControl();
            this._wireEvents();
        },

        _getControlName: function () {
            return this.pluginName.replace("ejm", "");
        },

        _renderControl: function () {
            ej.setRenderMode(this);
            var obj = this.model;
            this._radioCheckCoreProperties(this._getControlName().toLowerCase());
        },


        _radioCheckCoreProperties: function (type) {
            this.model.type = (type == "checkbox" ? "checkbox" : "radio");
            if (!this.element.attr('type'))
                this.element.attr('type', this.model.type);
            this.element.css("display", "none");
            this._wrapper = this.element.parent();
            this._elementName = this.element.attr("name")
            this._inputWrapper = ej.buildTag("div.e-m-" + this.model.renderMode).addClass("e-m-input-" + type + " " + this.model.cssClass + " " + (this._elementName ? this._elementName : ""));
            this.element.addClass(this.model.cssClass);
            this._inputWrapper.insertBefore(this.element);
            this._setEnableRippleEffect();
            this.element.appendTo(this._inputWrapper);
            this._label = $("label[for='" + this._id + "']");
            this._setCommonProperties();
        },
        _setEnableRippleEffect: function () {
            this._inputWrapper[(this.model.enableRippleEffect ? "addClass" : "removeClass")]("e-ripple");
        },
        _setCommonProperties: function () {
            var obj = this.model;
            if (obj.checked) this._setChecked(true);
            if (!obj.enabled) this._setEnabled(false);
        },

        _setChecked: function (state) {
            if (!this.element.prop('disabled')) {
                this.element.prop('checked', state);
                this._inputWrapper[(state ? "addClass" : "removeClass")]("e-m-state-active");
            }
        },

        _setEnabled: function (status) {
            this.element.attr('disabled', !status);
            this._inputWrapper[(status ? "removeClass" : "addClass")]("e-m-state-disabled");
        },

        _setRenderMode: function (mode) {
            if (!this.element.prop('disabled'))
                this._inputWrapper.removeClass("e-m-ios7 e-m-android e-m-windows e-m-flat").addClass("e-m-" + this.model.renderMode);
        },

        _createDelegate: function () {
            this._touchStartProxy = $.proxy(this._touchStart, this);
            this._touchEndProxy = $.proxy(this._touchEnd, this);
        },

        _wireEvents: function (remove) {
            var obj = this.model;
            var element = this.element;
            var controlname = this._getControlName();
            this._createDelegate();
            ej.listenEvents([this._inputWrapper, this._inputWrapper, this._label, this._label], [ej.startEvent(), ej.endEvent(), ej.startEvent(), ej.endEvent()], [this._touchStartProxy, this._touchEndProxy, this._touchStartProxy, this._touchEndProxy], remove);
        },

        _touchStart: function (e) {
            if (this.model.enabled) {
                this._inputWrapper.addClass("e-m-state-glow")
                var data = { isChecked: this.model.checked, value: this.element.val(), controlType: this.model.type, element: this.element, events: e }
                if (this.model.touchStart)
                    this._trigger("touchStart", data);
                if (this.model.beforeChange)
                    this._trigger("beforeChange", data);
            }
        },

        _touchEnd: function (e) {
            if (this.model.enabled) {
                if (this.model.type == "checkbox") {
                    if (this.element.attr("checked") && this.element.attr("checked").length) {
                        this.element.attr("checked", false);
                        this.model.checked = false;
                        this._inputWrapper.removeClass("e-m-state-active");
                    }
                    else {
                        this.element.attr("checked", true);
                        this.model.checked = true;
                        this._inputWrapper.addClass("e-m-state-active");
                    }
                }
                if (this.model.type == "radio") {
                    var radioButton = $(".e-m-input-radiobutton." + this._elementName);
                    $.each(radioButton, function (i, ele) {
                        $(ele).removeClass("e-m-state-active");
                        $(ele).children().attr("checked", false);
                    })
                    this.element.attr("checked", true);
                    this.model.checked = true;
                    this.element.parent().addClass("e-m-state-active");
                }
                var data = { isChecked: this.model.checked, value: this.element.val(), controlType: this.model.type, element: this.element, events: e }
                this._inputWrapper.removeClass("e-m-state-glow");
                if (this.model.touchEnd)
                    this._trigger("touchEnd", data);
                if (this.model.change)
                    this._trigger("change", data);
            }
        },

        enable: function () {
            this.model.enabled = true;
            this._inputWrapper.removeClass("e-m-state-disabled");
        },

        disable: function () {
            this.model.enabled = false;
            this._inputWrapper.addClass("e-m-state-disabled");
        },

        isChecked: function () {
            return this.model.checked;
        },

        _setModel: function (options) {
            for (var prop in options) {
                this['_set' + prop.charAt(0).toUpperCase() + prop.slice(1)](options[prop]);
            }
        },
        _clearElement: function () {
            this._cloneElement.insertBefore(this.element.parent());
            this.element.parent().remove();
            this.element.remove();
            this._wireEvents(true);
            return this;
        },

        _destroy: function () {
            this._clearElement();
        },

        _refresh: function () {
            this._clearElement()._init();
            this._wireEvents();
        }
    });
})(jQuery, Syncfusion);