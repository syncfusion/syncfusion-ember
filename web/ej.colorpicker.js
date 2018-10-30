/**
* @fileOverview Plugin provides support to display color picker within your web page and allows to pick the color.
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws.
* @version 12.1
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    ej.widget("ejColorPicker", "ej.ColorPicker", {
        _rootCSS: "e-colorpicker",

        element: null,

        model: null,
        validTags: ["input", "div"],
        _addToPersist: ["value", "opacityValue"],
        _setFirst: false,
        angular: {
            require: ['?ngModel', '^?form', '^?ngModelOptions']
        },


        defaults: {

            enableOpacity: true,

            opacityValue: 100,

            columns: 10,

            palette: "basicpalette",

            htmlAttributes: {},

            buttonMode: "split",

            custom: [],

            presetType: "basic",

            modelType: "picker",

            locale: "en-US",

            showPreview: true,

            showTooltip: false,

            showClearButton: false,

            showSwitcher: true,

            value: null,

            displayInline: false,

            buttonText: {
                apply: "Apply",
                cancel: "Cancel",
                swatches: "Swatches"
            },

            tooltipText: {
                switcher: "Switcher",
                addButton: "Add Color",
                basic: "Basic",
                monoChrome: "Mono Chrome",
                flatColors: "Flat Colors",
                seaWolf: "Sea Wolf",
                webColors: "Web Colors",
                sandy: "Sandy",
                pinkShades: "Pink Shades",
                misty: "Misty",
                citrus: "Citrus",
                vintage: "Vintage",
                moonLight: "Moon Light",
                candyCrush: "Candy Crush",
                currentColor: "Current Color",
                selectedColor: "Selected Color",
            },

            showApplyCancel: true,

            showRecentColors: false,

            toolIcon: null,

            cssClass: "",

            enabled: true,

            change: null,

            select: null,

            open: null,

            close: null,

            create: null,

            destroy: null,
        },
        dataTypes: {
            modelType: "enum",
            palette: "enum",
            presetType: "enum",
            cssClass: "string",
            displayInline: "boolean",
            locale: "string",
            showSwitcher: "boolean",
            showRecentColors: "boolean",
            enabled: "boolean",
            showPreview: "boolean",
            enableOpacity: "boolean",
            buttonText: "data",
            custom: "array",
            htmlAttributs: "data"
        },

        observables: ["value", "opacityValue"],
        value: ej.util.valueFunction("value"),
        opacityValue: ej.util.valueFunction("opacityValue"),

        _setModel: function (jsondata) {
            for (var key in jsondata) {
                switch (key) {
                    case "enableOpacity":
                        this.model.enableOpacity = jsondata[key];
                        this._previewSlider(this.model.enableOpacity);
                        this._valueOperation();
                        break;
                    case "opacityValue":
                        if (this.model.enableOpacity) {
                            this._tempOpacity = parseFloat(ej.util.getVal(jsondata[key]));
                            this._opacity.option('value', this._tempOpacity);
                            !this._switch && this._changeOpacity();
                            this._updateValue();
                            this.opacityValue(this._tempOpacity);
                            typeof jsondata[key] == "function" ? jsondata[key](this.opacityValue()) : jsondata[key] = this.opacityValue();
                            break;
                        } else return false;
                    case "custom":
                        this.model.custom = jsondata[key];
                        this._reInitialize();
                        break;
                    case "palette":
                        this.model.palette = jsondata[key];
                        this._reInitialize();
                        break;
                    case "columns":
                        this.model.columns = parseFloat(jsondata[key]);
                        this._reInitialize();
                        jsondata[key] = this.model.columns;
                        break;
                    case "presetType":
                        this.model.presetType = jsondata[key];
                        if (ej.isNullOrUndefined(Colors[this.model.presetType])) return false;
                        else
                            this._reInitialize();
                        break;
                    case "buttonMode":
                        this._unBindIconClick();
                        this._buttonElement = ej.ColorPicker.ButtonMode.Split == jsondata[key] ? this.dropdownbutton : this.wrapper;
                        ej.ColorPicker.ButtonMode.Split == jsondata[key] ? this.wrapper.addClass("e-split") : this.wrapper.removeClass("e-split");
                        this._bindIconClick();
                        break;
                    case "showTooltip":
                        this._colorSlider.option('showTooltip', jsondata[key]);
                        this._opacity.option('showTooltip', jsondata[key]);
                        break;
                    case "value":
                        this._setValue(ej.util.getVal(jsondata[key]), true);
                        if (typeof jsondata[key] == "function")
                            jsondata[key](this.value());
                        else
                            jsondata[key] = this.value();
                        break;
                    case "modelType":
                        this.model.modelType = jsondata[key];
                        this._reInitialize();
                        break;
                    case "showSwitcher":
                        this.model.showSwitcher = jsondata[key];
                        this._showSwitcher();
                        break;
                    case "tooltipText":
                        this._toolTipText(jsondata[key]);
                        break;
                    case "locale": 
                        this.model.locale = jsondata[key];
                        this._localize(jsondata[key]);
                        break;
                    case "showPreview":
                        this.model.showPreview = jsondata[key];
                        this._previewPane(this.model.showPreview);
                        break;
                    case "buttonText":
                        this._buttonText(jsondata[key]);
                        break;
                    case "displayInline":
                        this._setDisplayInline(jsondata[key]);
                        break;
                    case "cssClass":
                        this._setSkin(jsondata[key]);
                        this.model.cssClass = jsondata[key];
                        break;
                    case "enabled":
                        this._enabled(jsondata[key]);
                        break;
                    case "showRecentColors":
                        this.model.showRecentColors = jsondata[key];
                        this._previewColor(this.model.showRecentColors);
                        break;
                    case "htmlAttributes": this._addAttr(jsondata[key]); break;
                    case "showClearButton": this._showClearIcon(jsondata[key]); break;
                    case "showApplyCancel": this.model.showApplyCancel = jsondata[key]; this._buttonContainer(); break;
                }
            }
        },


        _setSkin: function (className) {
            if (this.wrapper)
                this.wrapper.removeClass(this.model.cssClass).addClass(className);
            else
                this.element.removeClass(this.model.cssClass).addClass(className);
        },
        _showSwitcher: function () {
            if (this.model.showSwitcher) {
                this._changeTag.removeClass('e-hide');
                this.model.modelType == "picker" ? this._switcher.addClass('e-paletteModel').removeClass('e-pickerModel') : this._switcher.addClass('e-pickerModel').removeClass('e-paletteModel');
            }
            else
                this._changeTag.addClass('e-hide');
        },
        _pickerType: function () {
            this._modelType = "picker";
            this.PaletteWrapper.removeAttr('style');
            this.PaletteWrapper.addClass('e-hide');
            this._gradient.removeClass('e-hide');
            this._gradient.fadeIn(200);
            this._presetTag.parents('.e-split.e-widget').addClass('e-hide');
            this._switcher.removeAttr('class');
            this._switcher.addClass('e-color-image e-paletteModel');
            this._switch = true;
            this._rgbValue();
            this._hueGradient();
            this._updateUI();
            this._alphaGradient(this.RGBToHEX(this.rgb));
            this._hsva.ejButton("enable");
            this._switchEvents();
            this._unSwitchEvents();
            this._hideUnBindEvents();
            this.isPopupOpen && this._showBindEvents();
            this.model.modelType == "default" ? this._changeTag.removeClass('e-hide') : this._changeTag.addClass('e-hide');
            this.popupList.prepend(this._gradient);
            this._showSwitcher();
        },
        _paletteType: function () {
            this._gradient.removeAttr('style');
            this._presetTag.parents('.e-split.e-widget').removeClass('e-hide');
            this.PaletteWrapper.removeClass('e-hide');
            this.PaletteWrapper.fadeIn(200);
            this._switch = false;
            this._disableHSVButton();
            this._cellSelect();
            this._switchEvents();
            this._unSwitchEvents();
            this._splitObj.option('prefixIcon', 'e-icon e-color-image e-' + this.model.presetType);
            this.popupList.prepend(this.PaletteWrapper);
            this._showSwitcher();
        },
        _reInitialize: function () {
            this._destroyPalette(false);
        },
        _destroyPalette: function (presets) {
            this.PaletteWrapper.remove();
            if (presets || this._columns != this.model.columns && this.model.palette !== "custompalette") this.PaletteWrapper = this._presetType(this._presetsId);
            if (this._temp !== this.model.presetType) this.PaletteWrapper = this._layoutType(this.model.palette);
            if (this.model.modelType == "palette") {
                this._modelType = "palette";
                this.PaletteWrapper = this._layoutType(this.model.palette);
                this._hideUnBindEvents();
                this.isPopupOpen && this._showBindEvents();
                this._gradient.addClass('e-hide');
                this._paletteType();
                presets || this.model.palette == "custompalette" ? "" : this._splitObj.option('prefixIcon', 'e-icon e-color-image e-' + this.model.presetType);
            }
            if (this.model.modelType == "picker") {
                this._pickerType();
                if (this.model.displayInline && !this.element.is('input'))
                    this._footer.addClass('e-hide');
            }
            this._temp = this.model.presetType; this._columns = this.model.columns;
            if (this._modelType == "picker")
                this._presetTag.parents('.e-split.e-widget').addClass('e-hide');
            else
                this._presetTag.parents('.e-split.e-widget').removeClass('e-hide');
            this.refresh();
        },
        _previewColor: function (color) {
            if (color) {
                this._swatchesArea.fadeIn(200);
                this._bindRecentEvent();
            }
            else {
                this._swatchesArea.fadeOut(200);
                this._unBindRecentEvent();
            }
        },
        _buttonText: function (data) {
            $.extend(this.model.buttonText, data);
            if (!ej.isNullOrUndefined(this._buttonTag)) this._buttonTag.html(this.model.buttonText.apply);
            if (!ej.isNullOrUndefined(this._cancelTag)) this._cancelTag.html(this.model.buttonText.cancel);
            this._spnTag.html(this.model.buttonText.swatches);
        },
        _toolTipText: function (data) {
            $.extend(this.model.tooltipText, data);
            this._addTitleText();
        },
        _previewPane: function (showPreview) {
            showPreview ? this._previewTag.removeClass("e-hide") : this._previewTag.addClass("e-hide");
        },
        _previewSlider: function (slider) {
            slider ? this._opacity.enable() : this._opacity.disable();
        },
        _getLocalizedLabels: function () {
            return ej.getLocalizedConstants(this.sfType, this.model.locale);
        },
        _localize: function () {
            this._localizedLabels = this._getLocalizedLabels();
            if (this._options.locale == "en-US" && !ej.isNullOrUndefined(this._options.buttonText) || !ej.isNullOrUndefined(this._options.tooltipText)) {
                if (!ej.isNullOrUndefined(this._options.buttonText))
                    this._buttonText(this._options.buttonText);
                if (!ej.isNullOrUndefined(this._options.tooltipText))
                    this._toolTipText(this._options.tooltipText);
            }
            else if (!ej.isNullOrUndefined(this._localizedLabels)) {
                if (!ej.isNullOrUndefined(this._localizedLabels.buttonText))
                    this._buttonText(this._localizedLabels.buttonText)
                if (!ej.isNullOrUndefined(this._localizedLabels.tooltipText))
                    this._toolTipText(this._localizedLabels.tooltipText)
            }
        },
        _destroy: function () {
            if (this.model.displayInline)
                $(window).off("resize", $.proxy(this._OnWindowResize, this));
            if (this.isPopupOpen) this.hide();
            this.popupContainer.remove();
            if (this.wrapper) {
                this.element.insertAfter(this.wrapper);
                this.wrapper.remove();
                this._presetContainer.parent('.e-menu-wrap').remove();
            }
            this.element.removeClass('e-colorpicker e-input e-widget').removeAttr("style name").val(this.element.attr("value"));
        },
        _init: function (options) {
            this._options = options;
            this._browser = ej.browserInfo();
            this._isFocused = false;
            this.isPopupOpen = false;
            this._dataBind = false;
            this._modelType = "picker";
            if (this._id)
                $("#" + this._id + "_popup").remove();
            if ("#" + this._id + "_Presets")
                $('#' + this._id + "_Presets").parent('.e-menu-wrap').remove();
            this.model.palette === "basicpalette" ? this._presetsId = "e-presets30" : "";
            if (ej.isNullOrUndefined(this.value()) && this.element[0].value !== "") this._tempValue = this.element[0].value;
            else this._tempValue = this.value();
            this._previousValue = this._previousColor = this._tempValue;
            this._renderControl();
            this._tempOpacity = this.opacityValue();
            this.model.palette === "custompalette" && this._presetTag.parents('.e-split.e-widget').addClass('e-hide');
            this.popupContainer.find('button.e-presets').ejSplitButton({ targetID: this._presetContainer.attr('id') });
            if (this._tempValue) {
                this._setValue(this._tempValue);
                if (this._switch) this._rgbValue();
            }
            this._hsvValue();
            this._hueGradient();
            this._addTitleText();
            this._showClearIcon(this.model.showClearButton);
            this._columns = this.model.columns;
            this._temp = this.model.presetType;
            if (!this._tempValue) {
                this._colorSlider.option('value', parseInt(this._hsv.h));
                this._opacity.option('value', this._tempOpacity);
                this._alphaGradient("#fff");
                this._previousValue = "";
            }
            !this.model.enabled && this._enabled(this.model.enabled);
        },
        _renderControl: function () {
            this._createWrapper();
            this._renderPopupPanelWrapper();
            this._selectedButton = this._groupTag.find('.e-click');
            this._buttonContainer();
            this._renderPopupElement();
            this._buttonElement = ej.ColorPicker.ButtonMode.Split == this.model.buttonMode ? this.dropdownbutton : this.wrapper;
            if (this.model.buttonMode == ej.ColorPicker.ButtonMode.Split && this.element.is('input')) this.wrapper.addClass("e-split");
            this._addAttr(this.model.htmlAttributes);
            this._setDisplayInline(this.model.displayInline);
            this._previewPane(this.model.showPreview);
            this._previewColor(this.model.showRecentColors);
            this._localize();
            if (this._switch) this._previewSlider(this.model.enableOpacity);
            this._wireEvents();
            this._switchEvents();
        },

        _createWrapper: function () {
            if (this.element.is("input")) {
                this.element.addClass('e-input e-widget');
                this.element.attr("aria-label","colorpicker");
                this.spanElement = ej.buildTag("span.e-selected-color");
                this.wrapper = ej.buildTag("span.e-colorwidget e-picker e-widget " + this.model.cssClass).attr({ 'tabindex': '0', "aria-expanded": false, "aria-haspopup": true, "aria-owns": "popup" });
                if (this._id) this.wrapper.attr('id', this._id + "Wrapper");
                this.container = ej.buildTag("span.e-in-wrap e-box e-splitarrowright");
                this.drpbtnspan = ej.buildTag("span.e-icon e-arrow-sans-down", "", {}, { "aria-label": "select" });
                this.dropdownbutton = ej.buildTag("span.e-select", "", {}, { "role": "button" }).append(this.drpbtnspan);
                this.iconWrapper = ej.buildTag("span.e-tool-icon " + this.model.toolIcon);
                this.colorContainer = ej.buildTag("span.e-color-container");
                this.colorContainer.append(this.spanElement);
                this.container.insertAfter(this.element);
                if (!ej.isNullOrUndefined(this.model.toolIcon)) {
                    this.colorContainer.prepend(this.iconWrapper);
                    this.container.addClass('e-tool');
                    this.container.append(this.colorContainer);
                }
                else
                    this.container.append(this.colorContainer);
                this.container.append(this.element, this.dropdownbutton);
                this.wrapper.insertBefore(this.container);
                this.wrapper.append(this.container);
                this.element.css("display", "none").val(this.value());
            }
            this._checkNameAttr();
        },
        _addTitleText: function () {
            this._switcher.attr('title', this.model.tooltipText.switcher);
            this._spanTag.attr('title', this.model.tooltipText.addButton);
            this._presetLi.find("#e-presets00").attr('title', this.model.tooltipText.webColors);
            this._presetLi.find("#e-presets01").attr('title', this.model.tooltipText.vintage);
            this._presetLi.find("#e-presets02").attr('title', this.model.tooltipText.seaWolf);
            this._presetLi.find("#e-presets10").attr('title', this.model.tooltipText.sandy);
            this._presetLi.find("#e-presets11").attr('title', this.model.tooltipText.pinkShades);
            this._presetLi.find("#e-presets12").attr('title', this.model.tooltipText.moonLight);
            this._presetLi.find("#e-presets20").attr('title', this.model.tooltipText.monoChrome);
            this._presetLi.find("#e-presets21").attr('title', this.model.tooltipText.misty);
            this._presetLi.find("#e-presets22").attr('title', this.model.tooltipText.flatColors);
            this._presetLi.find("#e-presets30").attr('title', this.model.tooltipText.basic);
            this._presetLi.find("#e-presets31").attr('title', this.model.tooltipText.candyCrush);
            this._presetLi.find("#e-presets32").attr('title', this.model.tooltipText.citrus);
            this._currentTag.attr('title', this.model.tooltipText.currentColor);
            this._previousTag.attr('title', this.model.tooltipText.selectedColor);
        },
        _renderPopupPanelWrapper: function () {
            this.popupContainer = ej.buildTag("div.e-colorpicker e-box e-popup e-widget " + this.model.cssClass, "", {}, { "role": "grid", "aria-readonly": "true", "tabindex": '0', "style": "visibility:hidden" });
            if (this._id) this.popupContainer.attr('id', this._id + "_popup");
            $('body').append(this.popupContainer);

            this.popupList = ej.buildTag("div.e-popupWrapper");

            this._gradient = ej.buildTag("div.e-container");

            this._colorArea = ej.buildTag("div.e-hsv-color");
            this._gradientArea = ej.buildTag("div.e-hsv-gradient")
            this._handleArea = ej.buildTag("div.e-draghandle e-color-image");
            this._browser == "msie" && this._handleArea.addClass('e-pinch');
            this._colorArea.append(this._gradientArea, this._handleArea);

            this._picker = ej.buildTag("div.e-gradient");
            this._hueSlider = ej.buildTag("div.e-widget e-hue e-state-default");
            this._alphaSlider = ej.buildTag("div.e-widget e-opacity e-state-default");
            this._picker.append(this._hueSlider, this._alphaSlider);

            this._gradient.append(this._colorArea, this._picker);

            this.popupList.append(this._gradient);


            this._footerBlock = ej.buildTag("div.e-footerContainer");

            this._templateWrapper = ej.buildTag("div.e-buttons");


            this._groupTag = ej.buildTag("div.e-grpbtn");

            this._formEle = ej.buildTag("div.e-form");
            this._rgb = ej.buildTag("button.e-rgbButton e-click", "", {}, { type: "button" });
            this._hexCode = ej.buildTag("button.e-hexButton", "", {}, { type: "button" });
            this._hsva = ej.buildTag("button.e-hsvButton", "", {}, { type: "button" });
            this._groupTag.append(this._rgb, this._hexCode, this._hsva);


            this._codeEditor = ej.buildTag("div.e-codeeditor");
            this._inputTag = ej.buildTag("input.e-color-code", "", {}, { "type": "text", 'tabindex': '0', "maxLength": "22" });
            this._codeEditor.append(this._inputTag);
            this._inputTag.attr("aria-label", "color-code");
            this._formEle.append(this._groupTag, this._codeEditor);

            this._previewTag = ej.buildTag("div.e-preview").attr({ 'tabindex': '0' });
            this._currentTag = ej.buildTag("div.e-current");
            this._previousTag = ej.buildTag("div.e-previous");
            this._previewTag.append(this._currentTag, this._previousTag);

            this._templateWrapper.append(this._formEle, this._previewTag);

            this._swatchesArea = ej.buildTag("div.e-color-labels");
            var blockCount = 11;
            this._divTag = ej.buildTag("div.e-recent-color");
            this._addTag = ej.buildTag('div.e-colorblock e-block');
            this._spanTag = ej.buildTag('div.e-color e-color-image e-add');
            this._addTag.append(this._spanTag)
            this._divTag.append(this._addTag);
            for (var count = 0; count < blockCount; count++) {
                this._liTag = ej.buildTag('div.e-colorblock e-block');
                var spanTag = ej.buildTag('div.e-color e-color-image e-empty');
                this._liTag.append(spanTag);
                this._divTag.prepend(this._liTag);
            }
            this._swatchesArea.append(this._divTag);

            this._footer = ej.buildTag('div.e-footer');
            this._swatches = ej.buildTag('div.e-element');
            this._changeTag = ej.buildTag('div.e-switcher').attr('tabindex', '0');
            this._switcher = ej.buildTag('div.e-color-image');
            this._presetTag = ej.buildTag('button.e-presets e-colorSplit');
            this._presets = ej.buildTag('div');
            this._changeTag.append(this._switcher);
            this._presetTag.append(this._presets);
            this._swatches.append(this._changeTag, this._presetTag);
            this._footer.append(this._swatches);
            this._footerBlock.append(this._templateWrapper, this._swatchesArea, this._footer);

            this.PaletteWrapper = this._layoutType(this.model.palette);
            this.popupList.append(this.PaletteWrapper, this._footerBlock);
            var oldWrapper = $("#" + this._id + "_Presets").get(0);
            if (oldWrapper) {
                if ($(oldWrapper).parent().hasClass("e-menu-wrap"))
                    $(oldWrapper).parent().remove();
                else
                    $(oldWrapper).remove();
            }
            this._presetContainer = $("<ul id='" + this._id + "_Presets' class='e-presetWrapper' style= top:87px ></ul>");
            this._presetLi = ej.buildTag('li.e-item');
            this._presetLi.append(this._renderPresets());
            this._presetContainer.append(this._presetLi);
            this.popupList.append(this._presetContainer);
            this.popupContainer.append(this.popupList);

            //IE Support
            if (this._browser.name = "msie" && (this._browser.version == "9.0" || this._browser.version == "8.0"))
                this._hueSlider.addClass('e-color-image e-filter');
            else
                this._hueSlider.addClass('e-common');
            this._width = this._gradientArea.width(); this._height = this._gradientArea.height();
        },
        _buttonContainer: function () {
            if (this.model.showApplyCancel) {
                this._buttonTag = ej.buildTag("button.e-applyButton", "", {}, { type: "button" });
                this._cancelTag = ej.buildTag("button.e-cancelButton", "", {}, { type: "button" });
                this._footer.append(this._buttonTag, this._cancelTag);
                this._applyObj = this.popupContainer.find('button.e-applyButton').ejButton({ text: this.model.buttonText.apply, type: "button", cssClass: "e-flat" }).data('ejButton');
                this._cancelObj = this.popupContainer.find('button.e-cancelButton').ejButton({ text: this.model.buttonText.cancel, type: "button", cssClass: "e-flat" }).data('ejButton');
                this._on(this._cancelTag, "click", this._hidePopup);
                this._on(this._buttonTag, "click", this._buttonClick);
            } else if (this._buttonTag !== undefined && this._cancelTag !== undefined) {
                this._buttonTag.remove();
                this._cancelTag.remove();
                this._off(this._cancelTag, "click", this._hidePopup);
                this._off(this._buttonTag, "click", this._buttonClick);
            }
        },
        _addAttr: function (htmlAttr) {
            var proxy = this;
            $.map(htmlAttr, function (value, key) {
                if (key == "class") proxy.wrapper.addClass(value);
                else if (key == "required") proxy.element.attr(key, value);
                else if (key == "disabled" && value == "disabled") proxy._enabled(false);
                else proxy.wrapper.attr(key, value)
            });
        },
        _showClearIcon: function (bool) {
            if (bool) {
                this._clearIcon = ej.buildTag("div", {}, {}, { "class": "e-icon e-close_01" }).hide();
                this._codeEditor.append(this._clearIcon);
                this._on(this._clearIcon, "mousedown", this._clearColor);
                this._on(this._clearIcon, "click", this._clearColor);
            } else {
                this._clearIcon && this._clearIcon.remove();
                this._off(this._clearIcon, "mousedown", this._clearColor);
                this._off(this._clearIcon, "click", this._clearColor);
            }
        },
        _colorPresetsClick: function (e) {
            this._presetsId = e.currentTarget.id;
            if (this._presetsId === "e-presets00") this.model.presetType = "webcolors";
            else if (this._presetsId === "e-presets01") this.model.presetType = "vintage";
            else if (this._presetsId === "e-presets02") this.model.presetType = "seawolf";
            else if (this._presetsId === "e-presets10") this.model.presetType = "sandy";
            else if (this._presetsId === "e-presets11") this.model.presetType = "pinkshades";
            else if (this._presetsId === "e-presets12") this.model.presetType = "moonlight";
            else if (this._presetsId === "e-presets20") this.model.presetType = "monochrome";
            else if (this._presetsId === "e-presets21") this.model.presetType = "misty";
            else if (this._presetsId === "e-presets22") this.model.presetType = "flatcolors";
            else if (this._presetsId === "e-presets30") this.model.presetType = "basic";
            else if (this._presetsId === "e-presets31") this.model.presetType = "candycrush";
            else if (this._presetsId === "e-presets32") this.model.presetType = "citrus";
            this._splitObj.option('prefixIcon', 'e-icon e-color-image e-' + this.model.presetType);
            $("#" + this._id + "_Presets").find("li.e-preset-row").removeClass("e-presetsactive");
            $("#" + this._presetsId).addClass("e-presetsactive");
            this.PaletteWrapper.remove();
            if (this._modelType == "palette") {
                this.PaletteWrapper = this._layoutType(this.model.palette);
                this._gradient.addClass('e-hide');
                this._paletteType();
                this._switcher.addClass('e-pickerModel').removeClass('e-paletteModel');
            }
        },

        _renderPresets: function () {
            var tableDiv = ej.buildTag("div.e-presets-table");
            this._spnTag = ej.buildTag("span.e-presetHeader");
            this._spnTag.html(this.model.buttonText.swatches);
            tableDiv.append(this._spnTag);
            var color = 0, hexCode, rowDiv;
            for (var row = 0; row < 4 ; row++) {
                rowDiv = ej.buildTag("ul.e-tablerow");
                for (var col = 0; col < 3 ; col++) {
                    var tableCell = ej.buildTag("li.e-color-image e-preset-row" + "#" + "e-presets" + [row] + [col]);
                    tableCell.appendTo(rowDiv);
                }
                rowDiv.appendTo(tableDiv);
            }
            return tableDiv;
        },
        _renderPopupElement: function () {
            var proxy = this;
            this._hsv =
            {
                h: 360, s: 0, v: 100
            };
            this._rgb.ejButton({ text: "RGBA", type: "button" });
            this._hexCode.ejButton({ text: "HEX", type: "button" });
            this._hsva.ejButton({ text: "HSVA", type: "button" });
            this._splitObj = this._presetTag.ejSplitButton({ size: "normal", showRoundedCorner: true, contentType: "imageonly" }).data('ejSplitButton');
            this._splitObj.element.attr("aria-label","Presets");
            this._splitObj.dropbutton.attr("aria-label","Select");
            this._splitObj.option("beforeOpen", function (e) { proxy._bindClickOperation(e); });
            this._presetTag.parents('.e-split.e-widget').css({ "height": "27px" });
            this.model.custom.length == 0 ? this._splitObj.option('prefixIcon', "e-icon e-color-image e-" + this.model.presetType) : "";
            $("#" + this._presetsId).addClass("e-presetsactive");
            this._splitObj._getXYpos = function (e) {
                $("#" + this.model.targetID).ejMenu({ animationType: "none" });
                var btnposx, btnposy, btnpos = this.dropbutton.offset();
                btnposx = btnpos.left - this.dropbutton.prev().outerWidth() - 1;
                btnposy = (btnpos.top - $("#" + this.model.targetID).outerHeight()) - 1;
                return { x: btnposx, y: btnposy }
            }
            this._colorSlider = this._hueSlider.ejSlider({ orientation: "Vertical", showTooltip: this.model.showTooltip, minValue: 0, maxValue: 360, change: function (e) { proxy._changeHue(e); }, slide: function (e) { proxy._changeHue(e); } }).data('ejSlider');
            this._opacity = this._alphaSlider.ejSlider({ value: this.opacityValue(), showTooltip: this.model.showTooltip, orientation: "Vertical", incrementStep: 5, value: 100, change: function (e) { proxy._changeAlpha(e); }, slide: function (e) { proxy._changeAlpha(e); } }).data('ejSlider');
            if (this._browser.name = "msie" && this._browser.version == "8.0") {
                this._handleTag = ej.buildTag("div.e-handle-wrapper");
                this._handleTag.appendTo(this._opacity.element.find("a.e-handle"));
            }
            this._colorSlider.firstHandle.css({ "height": "13px", "width": "13px" });
            this._opacity.firstHandle.css({ "height": "13px", "width": "13px" });
            this.popupContainer.css({ "visibility": "visible", "display": "none" });
            if (this.model.modelType == "picker") {
                this._modelType = "picker";
                this._gradient.removeClass('e-hide');
                this.PaletteWrapper.addClass('e-hide');
                this._presetTag.parents('.e-split.e-widget').addClass('e-hide');
                this._showSwitcher();
                this._switch = true;
            } else if (this.model.modelType == "palette") {
                this._modelType = "palette";
                this._presetTag.parents('.e-split.e-widget').removeClass('e-hide');
                this.PaletteWrapper.removeClass('e-hide');
                this._gradient.addClass('e-hide');
                this._hsva.ejButton("disable");
                this._showSwitcher();
                this._switch = false;
            }
        },
        _layoutType: function (type) {
            if (typeof type === "string" && type == "basicpalette")
                this._collection = this._paletteGenerate(Colors[this.model.presetType], this.model.columns);
            else if (typeof type === "string" && type == "custompalette" && this.model.modelType == "palette")
                this._collection = this._paletteGenerate(this.model.custom, this.model.columns);
            type == "custompalette" ? this._collection.addClass('e-custom') : "";
            return this._collection;
        },
        _presetType: function (type) {
            if (type === "e-presets00") this._collection = this._paletteGenerate(Colors.webcolors, this.model.columns);
            else if (type === "e-presets01") this._collection = this._paletteGenerate(Colors.vintage, this.model.columns);
            else if (type === "e-presets02") this._collection = this._paletteGenerate(Colors.seawolf, this.model.columns);
            else if (type === "e-presets10") this._collection = this._paletteGenerate(Colors.sandy, this.model.columns);
            else if (type === "e-presets11") this._collection = this._paletteGenerate(Colors.pinkshades, this.model.columns);
            else if (type === "e-presets12") this._collection = this._paletteGenerate(Colors.moonlight, this.model.columns);
            else if (type === "e-presets20") this._collection = this._paletteGenerate(Colors.monochrome, this.model.columns);
            else if (type === "e-presets21") this._collection = this._paletteGenerate(Colors.misty, this.model.columns);
            else if (type === "e-presets22") this._collection = this._paletteGenerate(Colors.flatcolors, this.model.columns);
            else if (type === "e-presets30") this._collection = this._paletteGenerate(Colors.basic, this.model.columns);
            else if (type === "e-presets31") this._collection = this._paletteGenerate(Colors.candycrush, this.model.columns);
            else if (type === "e-presets32") this._collection = this._paletteGenerate(Colors.citrus, this.model.columns);
            return this._collection;
        },
        _paletteGenerate: function (colors, columns) {
            var color;
            this._PresetTable = ej.buildTag("div.e-palette-color").attr({ "role": "presentation" });
            this._tag = ej.buildTag("div.e-row").attr({"role":"row"});
            for (color = 0; color < colors.length; color++) {
                if (color && color % columns == 0)
                    this._tag = ej.buildTag("div.e-row").attr({"role":"row"});
                this._td = ej.buildTag("div.e-item").attr({ 'role': 'gridcell', "aria-label": "#" + $.trim(colors[color]), "data-value": "#" + $.trim(colors[color]), "style": "background-color:" + "#" + $.trim(colors[color]) });
                this._tag.append(this._td);
                this._PresetTable.append(this._tag);
            }
            return this._PresetTable;
        },
        _checkNameAttr: function () {
            if (!this.element.attr("name")) this.element.attr({ "name": this.element[0].id });
        },
        _enabled: function (bool) {
            if (bool) this.enable();
            else {
                this.model.enabled = true;
                this.disable();
            }
        },
        _setDisplayInline: function (isDisplayInline) {
            this.model.displayInline = isDisplayInline;
            if (isDisplayInline && this.element.is("input")) {
                this.popupContainer.insertAfter(this.wrapper);
                this._footer.css({ "display": "none" });
                this._setPopupPosition();
            }
            else if (isDisplayInline) {
                this.element.append(this.popupContainer);
                this.popupContainer.find('button.e-applyButton').css({ "display": "none" });
                this.popupContainer.find('button.e-cancelButton').css({ "display": "none" });
                this._footer.css({ "display": "none" });
            }
            else {
                this.popupContainer.css('display', 'none');
                $('body').append(this.popupContainer);
                this._isOpen = false;
                if (this.element.is("input")) {
                    this._bindIconClick();
                    if (this.popupContainer.find('button.e-applyButton').length==0) {
                        this._buttonContainer();
                    }
                    this._footer.css({ "display": "block" });
                    this.wrapper.removeClass("e-focus");
                    this._off($(document), "mousedown", this._onDocumentClick);
                }
                this._isFocused = this.isPopupOpen = false;
            }
            if (isDisplayInline) {
                this.show();
                if (this.element.is("input")) this._off($(this._buttonElement), "mousedown", this._iconClick);
                this._off(ej.getScrollableParents(this.wrapper), "scroll", this.hide);
            }
        },
        _bindIconClick: function () {
            var count = $._data($(this._buttonElement)[0], "events");
            if (ej.isNullOrUndefined(count) || ej.isNullOrUndefined(count.mousedown)) this._on(this._buttonElement, "mousedown", this._iconClick);
            else if (count.mousedown.length == 0) this._on(this._buttonElement, "mousedown", this._iconClick);
        },
        _unBindIconClick: function () {
            this._off(this._buttonElement, "mousedown", this._iconClick);
        },
        _setPopupPosition: function () {
            var elementObj = this.element.is('input') ? this.wrapper : this.element;
            var pos = this._getOffset(elementObj), winWidth,
            winBottomHeight = $(document).scrollTop() + $(window).height() - (pos.top + $(elementObj).outerHeight()),
            winTopHeight = pos.top - $(document).scrollTop(),
            popupHeight = this.popupContainer.outerHeight(),
            popupWidth = this.popupContainer.outerWidth(),
            left = pos.left,
            totalHeight = elementObj.outerHeight(),
            border = (totalHeight - elementObj.height()) / 2,
            maxZ = this._getZindexPartial(), popupmargin = 3,
            topPos = ((popupHeight < winBottomHeight || popupHeight > winTopHeight) ? pos.top + totalHeight + popupmargin : pos.top - popupHeight - popupmargin) - border;
            winWidth = $(document).scrollLeft() + $(window).width() - left;
            if (popupWidth > winWidth && (popupWidth < left + elementObj.outerWidth())) left -= this.popupContainer.outerWidth() - elementObj.outerWidth();
            if (popupWidth + elementObj.offset().left > $(window).width()) left = Math.abs(popupWidth - ($(window).width()));
            this.popupContainer.css({
                "left": left + "px",
                'position': 'absolute',
                "top": topPos + "px",
                "z-index": maxZ
            });
        },

        _getOffset: function (ele) {
            return ej.util.getOffset(ele);
        },

        _getZindexPartial: function () {
            return ej.util.getZindexPartial(this.element, this.popupContainer);
        },

        _setValue: function (value, isCode) {
            var reg = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$";
            if (typeof value == "object" || (typeof value == "number") || ej.isNullOrUndefined(value.match(reg))) value = null;
            this.value(value);
            this._tempValue = value;
            ej.isNullOrUndefined(value) ? this._setEmptyValue() : this._renderModelValue(value);
            this._changeEvent(false, isCode);
            this._selectEvent();
            this.element.is("input") && this._updateValue();
        },
        _renderModelValue: function (value) {
            var color;
            if (value && typeof value === "string") {
                color = this._HexToHSV(value);
                this._oldValue = this.rgb;
                if (this._switch) {
                    this._valueOperation();
                    this._colorSlider.option('value', parseInt(this._hsv.h));
                }
                this._inputTagValue(this._selectedButton);
                if (!this._switch) {
                    this._updateUI();
                    this.element.val(this.value());
                }
                this._hueGradient();
            }
        },
        setValue: function (code) {
            this._setValue(code);
        },

        enable: function () {
            if (this.model.enabled) return false;
            if (this.wrapper && this.wrapper.hasClass("e-disable")) {
                this.wrapper.removeClass("e-disable");
                this.element.prop("disabled", false);
                if (this.container.hasClass("e-disable")) this.container.removeClass('e-disable');
                this.popupList.removeClass('e-disable');
                this.dropdownbutton.removeClass('e-disable');
            } else if (this.model.displayInline) this.element.removeClass('e-disable');
            var temp = this._switch;
            this._switch = true;
            this._cancelObj.enable();
            this._colorSlider.enable();
            this.model.enableOpacity ? this._opacity.enable() : this._opacity.disable();
            this._splitObj.enable();
            this._applyObj.enable();
            this._wireEvents();
            this._switchEvents();
            this._switch = temp;
            $(this._inputTag).prop('readonly', false);
            (this._buttonElement) && this._on(this._buttonElement, "mousedown", this._iconClick);
            this.model.enabled = true;
        },

        disable: function () {
            if (!this.model.enabled) return false;
            if (this.wrapper && !this.wrapper.hasClass("e-disable")) {
                this.wrapper.addClass("e-disable");
                this.element.attr("disabled", "disabled");
                if (!this.container.hasClass("e-disable")) this.container.addClass('e-disable');
                this.popupList.addClass('e-disable');
                this.dropdownbutton.addClass('e-disable');
            } else if (this.model.displayInline) this.element.addClass('e-disable');
            var temp = this._switch;
            this._switch = false;
            this._cancelObj.disable();
            this._colorSlider.disable();
            this._opacity.disable();
            this._splitObj.disable();
            this._applyObj.disable();
            this._unWireEvents();
            this._unSwitchEvents();
            this._switch = temp;
            this._unBindIconClick();
            $(this._inputTag).attr('readonly', 'readonly');
            if (this.isPopupOpen && !this.model.displayInline) this.hide();
            this.model.enabled = false;
        },

        getColor: function () {
            return this.rgb;
        },

        getValue: function () {
            return this.value();
        },
        _alphaGradient: function (value) {
            var browser = ej.browserInfo();
            var value = ej.isNullOrUndefined(value) ? "#000000" : value;
            if (browser.name == "mozilla")
                this._alphaSlider.attr({ "style": "background:-moz-linear-gradient(center top," + value + ",#fff) repeat scroll 0 0 rgba(0, 0, 0, 0);" });
            else if ((browser.name == "msie") || (browser.name == "edge"))
                this._alphaSlider.attr({ "style": "background:-ms-linear-gradient(top," + value + ",#fff) repeat scroll 0 0 rgba(0, 0, 0, 0);" });
            else if (browser.name == "opera" && browser.version <= "11.61")
                this._alphaSlider.attr({ "style": "background:-o-linear-gradient(top," + value + ",#fff) repeat scroll 0 0 rgba(0, 0, 0, 0);" });
            else if (browser.name == "chrome" || browser.name == "safari" || (browser.name == "opera"))
                this._alphaSlider.attr({ "style": "background:-webkit-linear-gradient(top," + value + ",#fff) repeat scroll 0 0 rgba(0, 0, 0, 0);" });
            if ((browser.name == "msie") && (browser.version == "8.0" || browser.version == "9.0"))
                this._alphaSlider.attr({ "style": "progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=" + value + ", endColorstr=#ffffff)"});            
            if (browser.name == "msie" && browser.version == "8.0")
                this._handleTag.css({ "background": this._formRGB(this.rgb), "filter": "alpha(opacity=" + this.rgb.a * 100 + ")" });
        },
        _hueGradient: function () {
            var temp = this._hsv;
            var value = { h: this._hsv.h, s: 100, v: 100 };
            this._hueSlider.children(".e-handle").css({ "background": this._formRGB(this.HSVToRGB(value)) });
            this._hsv = temp;
        },
        _updateColor: function () {
            if (this.model.displayInline || !this.model.showApplyCancel) {
                this.value(this._tempValue);
                if (this.element.is("input")) this._updateValue();
                this._trigger("select", { value: this.value() });
                this._previousColor = this._tempValue;
            }
        },
        _changeEvent: function (element, isCode) {
            if (this._change && this._previousValue !== this._tempValue) {
                this._alphaGradient(this._tempValue);
                this._previousValue = this._tempValue;
                this._trigger("change", { value: this._tempValue, changeFrom: element ? "slider" : "picker", isInteraction: !isCode });
                this._updateColor(element);
            }
        },
        _selectEvent: function () {
            if (this._previousColor !== this._tempValue || this._tempOpacity !== this.opacityValue()) {
                this.value(this._tempValue);
                if (this.element.is("input")) this._updateValue();
                this.element.val(this.value());
                this._trigger("select", { value: this.value() });
                this._previousColor = this._tempValue;
            }
        },
        _changeHue: function (e) {
            this._handleArea.css("visibility", "visible");
            if (parseInt(this._hsv.h) !== parseInt(e.value) && this._switch) {
                this._hsv.h = Math.round(e.value);
                this._hueGradient();
                this._hsvValue();
                this._tempValue = this.RGBToHEX(this.rgb);
                this._changeEvent(true);
            }
        },
        _changeAlpha: function (e) {
            this._handleArea.css("visibility", "visible");
            if (this._switch) {
                this.rgb.a = e.value / 100;
                this._tempOpacity = parseInt(this.rgb.a * 100);
                this._changeOpacity(e);
            }
        },
        _changeOpacity: function (e) {
            this.rgb.a = this._tempOpacity / 100;
            if (this._browser.name = "msie" && this._browser.version == "8.0") {
                this._currentTag.css({ "background-color": this._formRGB(this.rgb), "filter": "alpha(opacity=" + this.rgb.a * 100 + ")" });
                this._handleTag.css({ "background": this._formRGB(this.rgb), "filter": "alpha(opacity=" + this.rgb.a * 100 + ")" });
            }
            else {
                this._currentTag.css("background-color", this._formRGBA(this.rgb));
                this._alphaSlider.children(".e-handle").css({ "background": this._formRGBA(this.rgb) });
            }
            this._inputTagValue(this._selectedButton);
            if (this.model.displayInline) {
                this._trigger("change", { value: this._tempValue, changeFrom: "slider", isInteraction: !ej.isNullOrUndefined(e) ? e.isInteraction : false });
                (this._trigger("select", { value: this.value() }));
            }
        else this._trigger("change", { value: this._tempValue, changeFrom: "slider", isInteraction: !ej.isNullOrUndefined(e) ? e.isInteraction: false });
        },
        _updateValue: function () {
            if (this.value()) {
                if (this._browser.name = "msie" && this._browser.version == "8.0") this.spanElement.css({ "background-color": this._formRGB(this._HexToRGB(this.value())), "filter": "alpha(opacity=" + this.rgb.a * 100 + ")" });
                else this.spanElement.css({ "background-color": this._formRGBA(this._HexToRGB(this.value())) });
            }
            else this.spanElement.removeAttr('style');
        },
        _bindClickOperation: function (e) {
            var proxy = this, splitMenu;
            proxy._on($("#" + this._id + "_Presets").find("li.e-preset-row"), "mousedown", proxy._colorPresetsClick);
            var SplitMenu = $("#" + proxy._presetContainer.attr('id')).ejMenu("instance");
                SplitMenu.model.close = function () {
                proxy._splitObj.contstatus = false;
                proxy._off($("#" + this._id + "_Presets").find("li.e-preset-row"), "mousedown", proxy._colorPresetsClick);
            }
        },
        _wireEvents: function () {
            if (this.element.is('input')) {
                this._on(this.wrapper, "blur", this._targetBlur);
                this._on(this.wrapper, "focus", this._targetFocus);
                this._on(this.wrapper, "keydown", this._popupShown);
                this._on(this.colorContainer, "click", this._containerClick);
            }
            this._on(this._changeTag, "click", this._switchModel);
            this._on(this._groupTag, "click", this._groupButton);
            this._on(this._addTag, "click", this._addColor);
            this._on(this._codeEditor, "mouseenter", this._inputEvent);
            this._on(this._codeEditor, "mouseleave", this._inputEvent);
            this._on(this._inputTag, "blur", this._inputEvent);
            this._on(this._inputTag, "focus", this._inputEvent);
            this._on(this._inputTag, "keyup", this._inputEvent);
            this._on(this.popupContainer, "focus", this._targetFocus);
            this._on(this.popupContainer, "blur", this._targetBlur);
        },
        _unWireEvents: function () {
            if (!this.model.displayInline && this.element.is('input')) {
                this._off(this.wrapper, "blur", this._targetBlur);
                this._off(this.wrapper, "focus", this._targetFocus);
                this._off(this.wrapper, "keydown", this._popupShown);
                this._off(this.colorContainer, "click", this._containerClick);
            }
            this._off(this._changeTag, "click", this._switchModel);
            this._off(this._groupTag, "click", this._groupButton);
            this._off(this._addTag, "click", this._addColor);
            this._off(this._codeEditor, "mouseenter", this._inputEvent);
            this._off(this._codeEditor, "mouseleave", this._inputEvent);
            this._off(this._inputTag, "blur", this._inputEvent);
            this._off(this._inputTag, "focus", this._inputEvent);
            this._off(this._inputTag, "keyup", this._inputEvent);
            this._off(this.popupContainer, "focus", this._targetFocus);
            this._off(this.popupContainer, "blur", this._targetBlur);
        },
        _inputEvent: function (e) {
            if (e.type === "focus") {
                if (e.target.className.indexOf("e-color-code") > -1) {
                    this._codeEditor.addClass("e-focus");
                }
            }
            if (e.type === "blur") {
                if (e.target.className.indexOf("e-color-code") > -1) {
                    this._codeEditor.removeClass("e-focus");
                }
            }
            if (!this._clearIcon) return;
            if (e.type === "focus") this._off(this._codeEditor, "mouseleave", this._inputEvent);
            if (e.type === "blur") this._on(this._codeEditor, "mouseleave", this._inputEvent);
            if (e.type === "keyup") this._inputTag.val() !== "" ? (this._clearIcon.show(), this._handleArea.css("visibility", "visible")) : (this._clearIcon.hide(), this._handleArea.css("visibility", "hidden"));
            if (e.type === "mouseleave" || e.type === "blur" || this._inputTag.val() == "") this._clearIcon.hide();
            else this._clearIcon.show();
        },
        _clearColor: function (e) {
            this._tempValue = "";
            this._inputTag.val("");
            this._setEmptyValue();
            if (e.type == "click") {
                this._clearIcon.hide();
                this._inputTag.focus();
            }
        },
        _containerClick: function () {
            if (this.model.buttonMode == "split") this._trigger("select", { value: this.value() });
        },
        _popupShown: function (e) {
            if (e.keyCode == 13) {
                this._showHidePopup();
                if (!this.isPopupOpen)
                    this._buttonClick(e);
                return false;
            }
        },
        _recentColor: function (e) {
            this._divTag.find('.e-select').removeClass('e-select').addClass('e-block');
            var hexCode = e.target.attributes.getNamedItem("data-value"), value;
            var rgbCode = e.target.attributes.style;
            if (ej.isNullOrUndefined(hexCode) || ej.isNullOrUndefined(rgbCode)) { this._change = false; return false; }
            $(e.target.parentNode).addClass('e-select').removeClass('e-block');
            var alpha = rgbCode.value.replace(/^(background-color:rgb|background-color:rgba)\(/, '').replace(/\)$/, '').replace(/\s/g, '').split(',');
            if (!ej.isNullOrUndefined(alpha[3])) {
                this._opacity.option('value', parseInt((parseFloat(alpha[3]) * 100).toFixed(2)));
                this.rgb.a = parseFloat(parseFloat(alpha[3]).toFixed(2));
            }
            else if (this._browser.name = "msie" && this._browser.version == "8.0") {
                value = parseInt(rgbCode.nodeValue.replace(/^(FILTER: alpha)\(/, '').split('=')[1].split(')')[0]);
                this._opacity.option('value', value);
                this.rgb.a = value / 100;
            }
            else {
                this._opacity.option('value', 100);
                this.rgb.a = 1;
            }
            this._HexToHSV(hexCode.value);
            this._inputTagValue(this._selectedButton);
            this._tempValue = this.RGBToHEX(this.rgb);
            this._valueOperation();
            this._colorSlider.option('value', parseInt(this._hsv.h));
            this._hueGradient();
            this._changeEvent(false);
            if (!this.model.displayInline || this.element.is("input"))
                this.wrapper.focus();
        },

        _handleClick: function (e) {
            e.preventDefault();
            this._width = this._gradientArea.width(); this._height = this._gradientArea.height();
            if (this.model.displayInline)
                this._isFocused = true;
            this._handleArea.css("visibility", "visible");
            this.mouseDownPos = this._handlePos;
            $(document).on("mousemove touchmove", $.proxy(this._handleMovement, this));
            $(document).on("mouseup touchend", $.proxy(this._handleUp, this));
        },
        _handleMove: function (e) {
            this._handleArea.css("visibility", "visible");
            this._handleMovement(e);
            this._focusWrapper(e);
        },
        _handleMovement: function (e) {
            if (!this.model.enabled) return false;
            var clientX = e.pageX, clientY = e.pageY;
            this.element.is("input") && this.wrapper.focus();
            if (e.type == "touchstart" || e.type == "touchmove") {
                clientX = e.originalEvent.changedTouches[0].pageX;
                clientY = e.originalEvent.changedTouches[0].pageY;
            }
            this._hsv.v = parseInt(100 * (this._gradientArea.height() - Math.max(0, Math.min(this._gradientArea.height(), (clientY - this._gradientArea.offset().top)))) / this._gradientArea.height(), 10);
            this._hsv.s = parseInt(100 * (Math.max(0, Math.min(this._gradientArea.width(), (clientX - this._gradientArea.offset().left)))) / this._gradientArea.width(), 10);
            this._hsvValue();
            this._tempValue = this.RGBToHEX(this.rgb);
            this._change = true;
            this._changeEvent(false);
        },
        _handleUp: function (e) {
            $(document).off('mouseup touchend', this._handleUp);
            $(document).off('mousemove touchmove', this._handleMovement);
            this._focusWrapper(e);
            return false;
        },
        _handlePosition: function () {
            this._handlePos = this._handleArea ? {
                left: parseInt(parseInt(this._width) * this._hsv.s / 100, 10) + "px",
                top: parseInt(parseInt(this._height) * (100 - this._hsv.v) / 100, 10) + "px"
            } : "";
            this._handleArea.css({ "left": this._handlePos.left, "top": this._handlePos.top });
        },
        _addColor: function () {
            var value, collection = this._divTag.find('> div');
            value = this._selectedButton.html() != "HSVA" ? this._inputTag.val() : this._formRGBA(this.HSVToRGB(this._hsv));
            if (value !== "" && this._change) {
                if (this.model.showRecentColors && collection.length <= 12) {
                    $($(collection)[collection.length - 2]).remove();
                    this._generateLi();
                }
            }
            if (!this.model.displayInline || this.element.is("input")) this.wrapper.focus();
        },
        _buttonClick: function (e) {
            this._change = true;
            var value = this._inputTag.val(), collection = this._divTag.find('div');
            this._opacity.option('value', this._tempOpacity);
            this._tempValue = this.RGBToHEX(this.rgb);
            this._updatePreviewColor();
            if (this._inputTag.val() === "") {
                this._tempValue = "";
                if (this.model.showClearButton) this._setValue("");
                else {
                    this._inputTag.addClass('e-error');
                    return false;
                }
            }
            this._selectEvent();
            if (this.element.is("input")) {
                this._updateValue();
                this.wrapper.focus();
            }
            !this.model.displayInline && this.hide();
            this._tempOpacity !== this.opacityValue() && this.opacityValue(this._tempOpacity);
        },
        _generateLi: function () {
            this._liTag = ej.buildTag('div.e-colorblock e-block e-colorset').attr({ "data-value": this.RGBToHEX(this.rgb), "tabindex": "0" });
            var spanTag = ej.buildTag('div.e-color e-set').attr({ "data-value": this.RGBToHEX(this.rgb), "title": this.RGBToHEX(this.rgb) });
            if (this._browser.name = "msie" && this._browser.version == "8.0") spanTag.css({ "background-color": this._formRGB(this.rgb), "filter": "alpha(opacity=" + this.rgb.a * 100 + ")" });
            else spanTag.css({ "background-color": this._formRGBA(this.rgb) });
            this._liTag.append(spanTag);
            this._divTag.prepend(this._liTag);
        },
        _colorCodeValue: function (e) {
            var newValue = "", codeValue = this._inputTag.val(), value, code, count;
            value = $.trim(codeValue);
            value.length == 5 ? this._inputTag.removeClass('e-error') : "";
            if ((e.shiftKey && e.keyCode >= 35 && e.keyCode <= 40 || (e.keyCode >= 65 && e.keyCode < 71) ) || (e.keyCode == 51) || (e.ctrlKey && (e.keyCode == 88 || e.keyCode == 86)) || e.keyCode == 190)
                this._keyPressFlag = 1;
            else if ((!e.crtlKey && !e.shiftKey) && ((e.keyCode >= 65 && e.keyCode < 71) || (e.keyCode >= 35 && e.keyCode <= 40) || (e.keyCode >= 96 && e.keyCode <= 105) || (e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode == 13 || e.keyCode == 8 || e.keyCode == 46 || e.type === "blur"))
                this._keyPressFlag = 1;
			else if (e.key == "#" || e.key == "(" || e.key == ")" || e.key == ",")  this._keyPressFlag = 1;
            else this._keyPressFlag = 0;
            if (this.model.enableOpacity && (e.keyCode == 188 || e.keyCode == 71 || e.keyCode == 72 || e.keyCode == 82 || e.keyCode == 83 || e.keyCode == 86) || (e.shiftKey && (e.keyCode == 57 || e.keyCode == 48)))
                this._keyPressFlag = 1;
            if (this._keyPressFlag == 1) {
                this._inputTag.removeClass('e-error');
                if (e.keyCode === 13 || e.type === "blur") {
                    if (value === "") {
                        if (this.model.showClearButton) this._setEmptyValue();
                        else this._inputTag.addClass('e-error');
                    }
                    var regex = /^\#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
                    code = value.match(regex);
                    if (!ej.isNullOrUndefined(code)) {
                        if (code[1].length === 3) {
                            for (count = 0; count < code[1].length; count++) {
                                newValue += code[1][count] + code[1][count];
                            }
                        }
                        else if (code[1].length === 6)
                            newValue = code[1];
                        value = this.hexCodeToRGB("#" + newValue);
                        this._inputTag.val("#" + newValue);
                        this.rgb = this.HSVToRGB(this.RGBToHSV(value));
                        this._tempValue = this.RGBToHEX(this.rgb);
                        this._change = true;
                    }
                    else {
                        var rgbRegex = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/;
                        code = value.match(rgbRegex);
                        if (!ej.isNullOrUndefined(code)) this._rgbaColor(code);
                        else {
                            var hsvRegex = /^hsva?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/;
                            code = value.match(hsvRegex);
                            if (!ej.isNullOrUndefined(code)) {
                                this._hsvColor(code);
                            }
                            else {
                                value != "" && this._inputTag.addClass('e-error');
                                this._change = false;
                                return false;
                            }
                        }
                    }
                    if (this._change) {
                        this._valueOperation();
                        this._colorSlider.option('value', parseInt(this._hsv.h));
                        this._hueGradient();
                        this._changeEvent(false);
                        !this.element.is('input') && this._selectEvent();
                        if (this._inputTag.val() !== "") this._inputTag.removeClass("e-error");
                    }
                }
            }
            else {
                if (e.keyCode != 9) e.preventDefault();
                if (!e.shiftKey && !e.ctrlKey && e.keyCode !== 27 && e.keyCode !=20) this._inputTag.addClass('e-error');
            }
        },
        _setEmptyValue: function () {
            this._handleArea.css("visibility", "hidden");
            this._currentTag.css({ "background-color": "" });
            this._removeClass();
            this._tempValue = null;
            this._inputTag.val(null);
            if (this._previousValue !== this._tempValue) {
                this._trigger("change", { value: null });
                this._previousValue = this._tempValue
            }
        },
        _rgbaColor: function (code) {
            var rgb = {}, color;
            if (code[0].split('(')[0] == "rgba" && !ej.isNullOrUndefined(code[4])) {
                rgb.r = code[1]; rgb.g = code[2]; rgb.b = code[3]; rgb.a = code[4];
            }
            else if (code[0].split('(')[0] == "rgb" && ej.isNullOrUndefined(code[4])) {
                rgb.r = code[1]; rgb.g = code[2]; rgb.b = code[3]; rgb.a = this.rgb.a;
                this._inputTag.val("rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + rgb.a + ")");
            }
            else {
                this._inputTag.addClass('e-error');
                this._change = false;
                return false;
            }
            this.rgb.a = parseFloat(rgb.a);
            this._tempOpacity = this.rgb.a * 100;
            this._opacity.option('value', this._tempOpacity);
            this.opacityValue(this._tempOpacity);
            this._tempValue = this.RGBToHEX(rgb);
            this._HexToHSV(this._tempValue);
            this._inputTag.removeClass("e-error");
            this._change = true;
        },
        _hsvColor: function (code) {
            var hsv = {};
            if (!ej.isNullOrUndefined(code[4])) {
                hsv.h = code[1]; hsv.s = code[2]; hsv.v = code[3]; hsv.a = code[4];
            }
            else {
                this._inputTag.addClass('e-error');
                this._change = false;
                return false;
            }
            this.rgb.a = parseFloat(hsv.a);
            this._tempOpacity = this.rgb.a * 100;
            this._opacity.option('value', this._tempOpacity);
            this.opacityValue(this._tempOpacity);
            this.rgb = this.HSVToRGB(hsv);
            this._tempValue = this.RGBToHEX(this.rgb);
            this._inputTag.removeClass("e-error");
            this._change = true;
        },
        _iconClick: function (e) {
            e.preventDefault();
            this._showHidePopup();
            this.wrapper.focus();
        },
        _showHidePopup: function () {
            if (this.model.displayInline) return false;
            if (!this.isPopupOpen) this.show();
            else {
                this.hide();
                this.wrapper.focus();
            }
        },

        hide: function () {
            var proxy = this;
            if (!this.isPopupOpen||this.model.displayInline) return false;
            this.isPopupOpen = this._dataBind = false;
            if (this.element.is('input')) {
                this.wrapper.focus();
                this.wrapper.removeClass("e-active");
            }
            this._width = this._gradientArea.width(); this._height = this._gradientArea.height();
            this.popupContainer.slideUp(200, function () {
                if (proxy.model) {
                    proxy._tempOpacity = proxy.opacityValue();
                    proxy.rgb.a = proxy._tempOpacity / 100;
                    proxy._tempValue = proxy.value();
                    proxy._renderModelValue(proxy.value());
                    proxy._opacity.option('value', parseInt(proxy.opacityValue()));
                    if (!proxy.model.displayInline)
                        proxy._off($(document), "mousedown", proxy._onDocumentClick);
                    proxy._trigger("close");
                }
            });
            if (!this.model.displayInline)
                this._off($(document), "mousedown", this._onDocumentClick);
            this._off(this._inputTag, "keydown", this._colorCodeValue);
            this._off(this._inputTag, "blur", this._colorCodeValue);
            this._modelType == "palette" ? this._off($(document), "keydown", this._keyDown) : this._off($(document), "keydown", this._onKeyDown);
            this._off(ej.getScrollableParents(this.wrapper), "scroll", this.hide);
            $(window).off("resize", $.proxy(this._OnWindowResize, this));
        },
        _hidePopup: function () {
            !this.model.displayInline && this.hide();
        },

        show: function () {
            if (this.element.is("input")) {
                this.wrapper.focus();
                this.wrapper.addClass("e-active");
            }
            if (this.isPopupOpen || !this.model.enabled) return false;
            this.isPopupOpen = true;
            if (this.model.modelType == "palette") this._cellSelect();
            if (!this.model.displayInline && (this.value() === "" || ej.isNullOrUndefined(this.value())))
                this._setEmptyValue();
            else
                this._handleArea.css("visibility", "visible");
            this._previousColor = this._previousValue = this.value();
            this.popupContainer.children().find('.e-focus').removeClass('e-focus');
            if (!this.model.displayInline) this._setPopupPosition();
            var proxy = this;
            this.popupContainer.slideDown(200, function () {
                proxy.isFocused = true;
                proxy._on($(document), "mousedown", proxy._onDocumentClick);
                proxy._trigger("open");
            });
            if (!this._dataBind)
                this._modelType == "palette" ? this._on($(document), "keydown", this._keyDown) : this._on($(document), "keydown", this._onKeyDown);
            this._on(this._inputTag, "keydown", this._colorCodeValue);
            this._on(this._inputTag, "blur", this._colorCodeValue);
            this._dataBind = true;
            $(window).on("resize", $.proxy(this._OnWindowResize, this));
            if (!this.model.displayInline) this._on(ej.getScrollableParents(this.wrapper), "scroll", this.hide);
            if (this._prevSize !== $(window).width()) this.refresh();
        },
        _showBindEvents: function () {
            this._modelType == "palette" ? this._on($(document), "keydown", this._keyDown) : this._on($(document), "keydown", this._onKeyDown);
        },
        _hideUnBindEvents: function () {
            this._modelType == "palette" ? this._off($(document), "keydown", this._onKeyDown) : this._off($(document), "keydown", this._keyDown);
        },
        _switchEvents: function () {
            if (this._switch) {
                this._on(this._gradientArea, "mousedown touchstart", this._handleMove);
                this._on(this._handleArea, "mousedown touchstart", this._handleClick);
                this._on(this._gradientArea, "mousedown touchstart", this._handleClick);
            }
            else this._on(this._collection, "mousedown", this._onSelect);
        },
        _unSwitchEvents: function () {
            if (!this._switch) {
                this._off(this._gradientArea, "mousedown touchstart", this._handleMove);
                this._off(this._handleArea, "mousedown touchstart", this._handleClick);
                this._off(this._gradientArea, "mousedown touchstart", this._handleClick);
            }
            else this._off(this._collection, "mousedown", this._onSelect);
        },
        _groupButton: function (e) {
            if ($(e.target).hasClass('e-disable')) return false;
            if ($(e.target).hasClass("e-button")) {
                var element = this._groupTag.find('.e-btn.e-select');
                if (this._inputTag.val() !== "") this._inputTagValue($(e.target));
                else this._selectedButton = $(e.target);
                this._selectedButton.html() !== "HEX" ? this._inputTag.attr('maxLength', '22') : this._inputTag.attr('maxLength', '7');
                this._groupTag.find('.e-click').removeClass('e-click');
                $(e.target).addClass('e-click');
                this._inputTag.removeClass('e-error');
            }
        },
        _inputTagValue: function (type) {
            if (type.html() == "RGBA") this._inputTag.val(this._formRGBA(this.rgb));
            else if (type.html() == "HEX") this._inputTag.val(this.RGBToHEX(this.rgb));
            else if (type.html() == "HSVA") {
                if (this._modelType != "palette")
                    this._inputTag.val("hsva(" + Math.round(this._hsv.h) + "," + Math.round(this._hsv.s) + "," + Math.round(this._hsv.v) + "," + this.rgb.a + ")");
            }
            this._selectedButton = type;
        },
        _bindRecentEvent: function () {
            this._on(this._divTag, "click", this._recentColor);
        },
        _unBindRecentEvent: function () {
            this._off(this._divTag, "click", this._recentColor);
        },
        _handlePlacement: function (prop, value, bool) {
            this._handleArea.css("visibility", "visible");
            var hsv = this._hsv;
            hsv[prop] += value * (bool ? 1 : 3);
            if (hsv[prop] < 0) { hsv[prop] = 0; }
            prop === "s" ? this._hsv.s = hsv[prop] : this._hsv.v = hsv[prop];
            this._hsvValue();
            this._tempValue = this.RGBToHEX(this.rgb);
            this._changeEvent(false);
        },
        _onKeyDown: function (e) {
            var key = e.keyCode;
            if (!this.model.enabled) return;
            if (e.shiftKey && key == 9) if ($(this._hueSlider).find('.e-handle').hasClass('e-focus')) this._focusWrapper(e);
            if (!this._isFocused) if (key == 9 && key !== 27) return;
            this._change = true;
            if ((!e.altKey && !e.shiftKey)) {
                switch (key) {
                    case 39:
                        if (this.element.is('input') && $(e.target).is(this.wrapper)) {
                            e.preventDefault();
                            this._handlePlacement("s", 1, e.ctrlKey);
                        }
                        break;
                    case 38:
                        if (this.element.is('input') && $(e.target).is(this.wrapper)) {
                            e.preventDefault();
                            this._handlePlacement("v", 1, e.ctrlKey);
                        }
                        break;
                    case 37:
                        if (this.element.is('input') && $(e.target).is(this.wrapper)) {
                            e.preventDefault();
                            this._handlePlacement("s", -1, e.ctrlKey);
                        }
                        break;
                    case 40:
                        if (this.element.is('input') && $(e.target).is(this.wrapper)) {
                            e.preventDefault();
                            this._handlePlacement("v", -1, e.ctrlKey);
                        }
                        break;
                    case 13:
                        e.preventDefault();
                        if ($(e.target).hasClass('e-switcher')) {
                            this._switchModel();
                            $(e.target).focus();
                        }
                        else if ($(e.target).hasClass('e-applyButton')) this._buttonClick(e);
                        break;
                    case 27:
                        e.preventDefault();
                        !this.model.displayInline && this.hide();
                        this._tempValue = this.value();
                        break;
                    case 9:
                        active = document.activeElement;
                        if ($(active).is(this.wrapper)) this._focusPopup(e);
                        break;
                }
            }
        },
        _focusPopup: function (e) {
            $(this._hueSlider).find('.e-handle').focus();
            e.preventDefault();
        },
        _focusWrapper: function (e) {
            this.element.is('input') && $(this.wrapper).focus();
            e.preventDefault();
        },
        _onDocumentClick: function (e) {
            if (!$(e.target).is(this.popupContainer) && !$(e.target).parents(".e-colorpicker").is(this.popupContainer) &&
              !$(e.target).is(this.wrapper) && !$(e.target).parents(".e-colorpickerwidget").is(this.wrapper) && !$(e.target).parents('.e-presetWrapper').is("#" + this._id + "_Presets")) {
                if (!this.model.displayInline) {
                    this.hide();
                    if (this.element.is('input')) this.wrapper.removeClass('e-focus');
                }
                this._isFocused = false;
            }
        },

        _OnWindowResize: function (e) {
            if (this.element.is('input')) this._setPopupPosition();
            this.refresh();
        },
        refresh: function () {
            var element = $(this._PresetTable.find('.e-item')[1]);
            var count = 10, paddingSize = 36; //paddingSize is fixed for  palette model cells
            if (!this.isPopupOpen) {
                this.popupContainer.css({ "display": "block", "visibility": "hidden" });
                this._modelType == "palette" && this.PaletteWrapper.css({ "display": "block", "visibility": "hidden" });
            } else if (this._modelType == "picker") {
                this.PaletteWrapper.css({ "display": "block", "visibility": "hidden" });
            }
            if (parseFloat(this._tag.outerHeight()) > element.outerHeight(true) || (($(this._tag).outerWidth() - ($(element).outerWidth(true) * count)) > element.outerWidth()) || $(this._tag).outerWidth() == 0) {
                var rowSize = parseFloat($(this._tag).outerWidth()) - paddingSize;
                var cellWidth = (rowSize / count) - (element.outerWidth() - element.width());
                this._PresetTable.find('.e-item').css('width', cellWidth);
                if (element.outerWidth(true) * count > this._tag.outerWidth()) this._PresetTable.find('.e-item').css('width', cellWidth - 1);
            }
            if (!this.isPopupOpen) {
                this.popupContainer.css({ "display": "none", "visibility": "visible" });
                this._modelType == "palette" && this.PaletteWrapper.css({ "visibility": "visible" });
            } else if (this._modelType == "picker") {
                this.PaletteWrapper.css({ "display": "none", "visibility": "visible" });
            }
            this._prevSize = $(window).width();
            this._width = this._gradientArea.width(); this._height = this._gradientArea.height();
        },

        _range: function (range, value) {
            if (value === "") return value = 0;
            else if (value > range) return range;
            else return value;
        },
        _hsvValue: function () {
            var colorCode, hsv;
            this._change = true;
            this._hsv.v = this._hsv.v >= 100 ? 100 : this._hsv.v;
            this._hsv.s = this._hsv.s >= 100 ? 100 : this._hsv.s;
            this.hsv = this._hsv;
            this.rgb = this.HSVToRGB(this.hsv);
            this._valueOperation();
            this._inputTagValue(this._selectedButton);
        },
        _formRGB: function (value) {
            if (!ej.isNullOrUndefined(value)) return "rgb(" + value.r + "," + value.g + "," + value.b + ")";
        },
        _formRGBA: function (value) {
            if (!ej.isNullOrUndefined(value)) return "rgba(" + value.r + "," + value.g + "," + value.b + "," + value.a + ")";
        },
        _rgbValue: function (e) {
            var rgbColor, colorCode, value;
            value = this._HexToRGB(this._tempValue);
            if (!ej.isNullOrUndefined(value)) {
                this.rgb = value;
                this._change = true;
                this.HSVToRGB(this.RGBToHSV(this.rgb));
                this._colorSlider.option('value', parseInt(this._hsv.h));
                this._opacity.option('value', this.rgb.a * 100);
            }
            this._valueOperation();
            this._inputTagValue(this._selectedButton);
        },
        _valueOperation: function () {
            this._handlePosition();
            this._alphaGradient(this._tempValue);
            this._inputTag.removeClass("e-error");
            this._updateUI();
        },
        _HexToHSV: function (hex) {
            return this.HSVToRGB(this.RGBToHSV(this._HexToRGB(hex)));
        },
        _HexToRGB: function (hex) {
            if (!ej.isNullOrUndefined(hex)) {
                var reg = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$", hex, validate = hex.match(reg);
                if (ej.isNullOrUndefined(validate)) { this._change = false; return false; }
                if (validate[1].length == 3)
                    hex = "#" + validate[1][0] + validate[1][0] + validate[1][1] + validate[1][1] + validate[1][2] + validate[1][2];
                this._change = true;
                hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
                var value = ej.isNullOrUndefined(this.rgb) ? parseFloat(this._tempOpacity) / 100 : this.rgb.a;
                return this.rgb = { r: hex >> 16, g: (hex & 0x00FF00) >> 8, b: (hex & 0x0000FF), a: value };
            }
        },

        RGBToHSV: function (rgb) {
            var hsv = { h: 0, s: 0, v: 0 };
            var min = Math.min(rgb.r, rgb.g, rgb.b);
            var max = Math.max(rgb.r, rgb.g, rgb.b);
            var differ = max - min;
            hsv.v = max;
            hsv.v *= 100 / 255;
            if (differ === 0) {
                this._hsv = hsv;
                return hsv;
            }
            hsv.s = max != 0 ? 255 * differ / max : 0;
            if (hsv.s != 0) {
                if (rgb.r == max) hsv.h = (rgb.g - rgb.b) / differ;
                else if (rgb.g == max) hsv.h = 2 + (rgb.b - rgb.r) / differ;
                else hsv.h = 4 + (rgb.r - rgb.g) / differ;
            } else hsv.h = -1;
            hsv.h *= 60;
            if (hsv.h < 0) hsv.h += 360;
            hsv.s *= 100 / 255;
            this._hsv = hsv;
            return hsv;
        },

        HSVToRGB: function (hsv) {
            var rgb = {};
            var h = parseFloat(hsv.h);
            var s = parseFloat(hsv.s * 255 / 100);
            var v = parseFloat(hsv.v * 255 / 100);
            if (s == 0) {
                rgb.r = rgb.g = rgb.b = v;
            } else {
                var t1 = v;
                var t2 = (255 - s) * v / 255;
                var t3 = (t1 - t2) * (h % 60) / 60;
                if (h == 360) h = 0;
                if (h < 60) { rgb.r = t1; rgb.b = t2; rgb.g = t2 + t3 }
                else if (h < 120) { rgb.g = t1; rgb.b = t2; rgb.r = t1 - t3 }
                else if (h < 180) { rgb.g = t1; rgb.r = t2; rgb.b = t2 + t3 }
                else if (h < 240) { rgb.b = t1; rgb.r = t2; rgb.g = t1 - t3 }
                else if (h < 300) { rgb.b = t1; rgb.g = t2; rgb.r = t2 + t3 }
                else if (h < 360) { rgb.r = t1; rgb.g = t2; rgb.b = t1 - t3 }
                else { rgb.r = 0; rgb.g = 0; rgb.b = 0 }
            }
            this._hsv = hsv;
            var value = ej.isNullOrUndefined(this.rgb) ? parseFloat(this._tempOpacity) / 100 : this.rgb.a;
            return { r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b), a: value }
        },
        _HSVToHex: function (hsv) {
            return this.RGBToHEX(this.HSVToRGB(hsv));
        },
        _toHEX: function (rgb) {
            if (rgb.indexOf("#") !== -1) return rgb;
            rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            return "#" + this._hex(rgb[1]) + this._hex(rgb[2]) + this._hex(rgb[3]);
        },



        RGBToHEX: function (rgb) {
            if (!ej.isNullOrUndefined(rgb))
                return "#" + this._hex(rgb.r) + this._hex(rgb.g) + this._hex(rgb.b);
        },
        _hex: function (x) {
            return ("0" + parseInt(x).toString(16)).slice(-2);
        },
        _colorValue: function (value) {
            this._color = value.indexOf("#") != -1 ? this.hexCodeToRGB(value) : "";
            return "rgb(" + this._color.r + ", " + this._color.g + ", " + this._color.b + ")";
        },


        hexCodeToRGB: function (colorCode) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colorCode);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16),
                a: this.rgb.a
            } : null;
        },

        _updatePreviewColor: function () {
            if (this._browser.name = "msie" && this._browser.version == "8.0")
                this._previousTag.css({ "background-color": this._formRGB(this.rgb), "filter": "alpha(opacity=" + this.rgb.a * 100 + ")" });
            else
                this._previousTag.css({ "background-color": this._formRGBA(this.rgb) });
            this._oldValue = this.rgb;
        },
        _updateUI: function () {
            var value = this._hsv;
            if (this._switch) {
                var hsv = { h: this._hsv.h, s: 100, v: 100 };
                this._gradientArea.css({ "background-color": this._colorValue(this._HSVToHex(hsv)) });
            } else this._cellSelect();
            if (this._browser.name = "msie" && this._browser.version == "8.0") {
                this._currentTag.css({ "background-color": this._formRGB(this.rgb), "filter": "alpha(opacity=" + this.rgb.a * 100 + ")" });
                this._previousTag.css({ "background-color": this._formRGB(this._oldValue), "filter": "alpha(opacity=" + this.rgb.a * 100 + ")" });
            }
            else {
                this._currentTag.css({ "background-color": this._formRGBA(this.rgb) });
                this._previousTag.css({ "background-color": this._formRGBA(this._oldValue) });
                this._alphaSlider.children(".e-handle").css({ "background": this._formRGBA(this.rgb) });
            }
            this._hsv = value;
        },

        _targetFocus: function (e) {
            e.preventDefault();
            if (!this._isFocused) {
                this._isFocused = true;
                if (this.element.is("input")) this.wrapper.addClass("e-focus");
            }
        },
        _targetBlur: function (e) {
            this._isFocused = false;
            if (!this.isPopupOpen && this.element.is("input")) this.wrapper.removeClass("e-focus");
        },
        _switchModel: function () {
            this._tempValue = this.RGBToHEX(this.rgb);
            this.refresh();
            var proxy = this;
            this._off(this._changeTag, "click", this._switchModel);
            if (this._modelType == "palette") {
                this._modelType = "picker";
                this._switcher.removeClass("e-pickerModel").addClass("e-paletteModel");
                this.PaletteWrapper.fadeOut(300, function () {
                    proxy._presetTag.parents('.e-split.e-widget').addClass('e-hide');
                    proxy._gradient.fadeIn(300);
                    proxy._on(proxy._changeTag, "click", proxy._switchModel);
                });
                this._switch = true;
                this._rgbValue();
                this._hueGradient();
                this._hsva.ejButton("enable");
            } else {
                this.PaletteWrapper.remove();
                this._modelType = "palette";
                this.PaletteWrapper = this._layoutType(this.model.palette);
                this._gradient.addClass('e-hide');
                this._paletteType();
                this._switcher.removeClass("e-paletteModel").addClass("e-pickerModel");
                this._gradient.fadeOut(300, function () {
                    proxy._presetTag.parents('.e-split.e-widget').removeClass('e-hide');
                    if (ej.isNullOrUndefined(proxy.PaletteWrapper)) {
                        proxy.PaletteWrapper = proxy._layoutType(proxy.model.palette);
                        proxy._splitObj.option('prefixIcon', 'e-color-image e-' + proxy.model.presetType);
                        proxy.popupList.prepend(proxy.PaletteWrapper);
                    }
                    proxy.PaletteWrapper.fadeIn(300);
                    proxy._on(proxy._changeTag, "click", proxy._switchModel);
                });
                if (this.value() !== "")
                    this._cellSelect();
                this._disableHSVButton();
            }
            this.model.palette === "custompalette" && this._presetTag.parents('.e-split.e-widget').addClass('e-hide');
            if (!this.model.displayInline || this.element.is(":input")) this.wrapper.focus();
            this._switchEvents();
            this._unSwitchEvents();
            if (this.isPopupOpen) {
                this._hideUnBindEvents();
                this._showBindEvents();
            }
        },
        _disableHSVButton: function () {
            if ($(this._groupTag.find('.e-click')).hasClass('e-hsvButton')) {
                this._inputTagValue(this._rgb);
                this._rgb.addClass('e-click');
                this._hsva.removeClass('e-click');
            }
            this._hsva.ejButton("disable");
        },

        _cellSelect: function () {
            var code, element, proxy = this;
            this._removeClass();
            this._collection.find('.e-item').each(function () {
                code = $(this).css("background-color");
                if (proxy._browser.name = "msie" && proxy._browser.version == "8.0") {
                    if (code && code.replace(/ /g, '') === proxy.RGBToHEX(proxy.rgb)) {
                        element = this;
                        $(element).addClass("e-filter");
                    }
                } else {
                    if (code && code.replace(/ /g, '') === proxy._formRGB(proxy.rgb)) element = this;
                }
            });
            $(element).addClass("e-state-selected").attr("aria-selected", true);
        },
        _removeClass: function () {
            this._collection.find('.e-item').removeClass('e-state-selected').removeClass("e-filter").removeAttr("aria-selected");
        },
        _position: function (items, element, columns) {
            items = Array.prototype.slice.call(items);
            var n = items.length,
            index = items.indexOf(element);
            if (index < 0) return columns < 0 ? items[n - 1] : items[0];
            index += columns;
            return items[index < 0 ? index += n : index %= n];
        },
        _onSelect: function (e) {
            if (!this.model.enabled) return false;
            this._isFocused = true;
            this._handleArea.css("visibility", "visible");
            if (e.target.style.backgroundColor != "") {
                this._collection.find('.e-item').removeClass("e-state-selected").removeAttr('aria-selected');
                this._HexToRGB(this._toHEX(e.target.style.backgroundColor));
                this._updateUI();
                this._inputTagValue(this._selectedButton);
                if (!this.model.displayInline || this.element.is("input")) this.wrapper.focus();
                this._tempValue = this.RGBToHEX(this.rgb);
                this._changeEvent(false);
            }
            e.preventDefault();
        },
        _keyDown: function (e) {
            if (this._isFocused) {
                this._change = true;
                if (!this.model.enabled) return false;
                var selected = "",
                    key = e.keyCode,
                    items = this._collection.find('.e-item'),
                    element = items.filter(".e-state-selected").get(0),
                    columnSize = this.model.columns;
                if (!e.altKey && (key == 37 || key == 38 || key == 39 || key == 40) && (e.target.className !== "e-color-code"))
                    this._removeClass();
                switch (!e.altKey && key) {
                    case 40:
                        if (e.target.className !== "e-color-code") {
                            e.preventDefault();
                            selected = this._position(items, element, columnSize);
                        }
                        break;
                    case 37:
                        if (e.target.className !== "e-color-code") {
                            e.preventDefault();
                            selected = this._position(items, element, -1);
                        }
                        break;
                    case 38:
                        if (e.target.className !== "e-color-code") {
                            e.preventDefault();
                            selected = this._position(items, element, -columnSize);
                        }
                        break;
                    case 39:
                        if (e.target.className !== "e-color-code") {
                            e.preventDefault();
                            selected = this._position(items, element, 1);
                        }
                        break;
                    case 13:
                        this._collection.find('.e-item').removeClass('e-state-selected').removeAttr("aria-selected");
                        if ($(e.target).hasClass('e-switcher')){
                            this._switchModel();
                            $(e.target).focus();
                        } 
                        else if ($(e.target).hasClass('e-applyButton')) {
                            this._buttonClick(e);
                            this._updateUI();
                            !this.model.displayInline && this.hide();
                            if (this.element.is("input")) this.wrapper.focus();
                        }
                        break;
                    case 27:
                        !this.model.displayInline && this.hide();
                        $(this._presetContainer).hide();
                        if (this.element.is("input")) this.wrapper.focus();
                        break;
                    case 9:
                        active = document.activeElement;
                        if ($(active).is(this.wrapper)) this._focusPalettePopup(e, true);
                        break;
                }
                if (selected) {
                    $(selected).addClass('e-state-selected').attr("aria-selected", true);
                    this._currentTag.css({ "background-color": this._formRGB(this._HexToRGB($(selected).attr("data-value")))});
                    this._inputTagValue(this._selectedButton);
                    this._tempValue = this.RGBToHEX(this.rgb);
                    this._changeEvent(false);
                }
            } else {
                if (e.keyCode == 27) {
                    this.hide();
                    $(this._presetContainer).hide();
                }
            }
        },
        _focusPalettePopup: function (e, type) {
            $(this.popupContainer).focus();
            e.preventDefault();
        },
    })

    ej.ColorPicker.Locale = ej.ColorPicker.Locale || {};

    ej.ColorPicker.Locale["default"] = ej.ColorPicker.Locale["en-US"] = {
        buttonText: {
                apply: "Apply",
                cancel: "Cancel",
                swatches: "Swatches"
            },

            tooltipText: {
                switcher: "Switcher",
                addButton: "Add Color",
                basic: "Basic",
                monoChrome: "Mono Chrome",
                flatColors: "Flat Colors",
                seaWolf: "Sea Wolf",
                webColors: "Web Colors",
                sandy: "Sandy",
                pinkShades: "Pink Shades",
                misty: "Misty",
                citrus: "Citrus",
                vintage: "Vintage",
                moonLight: "Moon Light",
                candyCrush: "Candy Crush",
                currentColor: "Current Color",
                selectedColor: "Selected Color",
            }
    }
    ej.ColorPicker.Palette = {
        /**  Represents the basic Palette. This is default Type*/
        BasicPalette: "basicpalette",
        /**  Represents the custom Palette. User will customize the palette*/
        CustomPalette: "custompalette",
    }

    ej.ColorPicker.ModelType = {
        /**  Represents Palette Type*/
        Palette: "palette",
        /** Represents Picker Type */
        Picker: "picker"
    }

    ej.ColorPicker.ButtonMode = {
        /**  Represents the default bahavior*/
        Default: "dropdown",
        /**  Represents the Split bahavior, to perform the separete operation for each button*/
        Split: "split",
    }

    ej.ColorPicker.PresetType = {
        Basic: "basic",
        MonoChrome: "monochrome",
        FlatColors: "flatcolors",
        SeaWolf: "seawolf",
        WebColors: "webcolors",
        Sandy: "sandy",
        PinkShades: "pinkshades",
        Misty: "misty",
        Citrus: "citrus",
        Vintage: "vintage",
        MoonLight: "moonlight",
        CandyCrush: "candycrush",
    }
    var Colors = {
        basic: ["ffffff", "facbcb", "fccb98", "faf39a", "fbf8cd", "a6d38b", "aadee8", "d1ecf2", "cdcae5", "eecde1", "cccbcb", "f16667", "f69668", "f8ee6b", "f7ec37", "89c987", "75cddd", "8bd3e1", "7f7fcc", "9494c8", "b3b2b3", "ec2024", "f7971d", "ffcb67", "f5ea14", "74bf44", "69c8c9", "46c7f4", "6666ad", "b76cab", "676767", "971b1e", "ca6828", "ca9732", "979937", "0d9948", "339898", "4857a6", "62449a", "973794", "000000", "2f1110", "973620", "663433", "343416", "183319", "023334", "22205f", "3b2f8d", "310e31"],
        monochrome: ["ffffff", "e3e3e3", "c6c6c6", "aaaaaa", "8e8e8e", "717171", "555555", "393939", "1c1c1c", "000000", "f9e6e7", "f4d0d2", "efbabc", "e9a4a7", "e48e92", "df787c", "da6267", "d44c52", "cf363c", "ca2027", "fff4ca", "ffeb9e", "fff0b4", "ffefb1", "ffe788", "ffe272", "ffd947", "ffd531", "ffd01b", "ffcc05", "e4f4eb", "ccead9", "b4e0c7", "9cd6b5", "84cca3", "6dc190", "55b77e", "3dad6c", "25a35a", "0d9948", "e8f4f4", "d6e3eb", "c4d1e3", "b3c0da", "a1aed1", "8f9dc9", "7d8bc0", "6c7ab7", "5a68af", "4857a6"],
        flatcolors: ["7477b8", "488bca", "18b1d4", "1db369", "78c162", "acc063", "ffe84e", "f6b757", "f79853", "ed6346", "E87F3D", "E4C45D", "B7A575", "999999", "67809F", "002228", "00A578", "F9A41F", "F3770B", "D7401B", "FFCB36", "82CC2C", "36B595", "6370AD", "D4264E", "004D8E", "22A04B", "F3A414", "C77405", "F3420B", "1ABC9C", "3498DB", "9B59B6", "E67E22", "E74C3C", "3A738A", "EBD9A7", "89AD78", "FF766D", "C76160", "BF3542", "CDC5BA", "EBE3D6", "3C3C3C", "2E2E2E", "77A7FB", "E57368", "FBCB43", "34B67A", "FFFFFF"],
        seawolf: ["0EEAFF", "15A9FA", "1B76FF", "1C3FFD", "2C1DFF", "0B3C4C", "0E5066", "13647F", "127899", "1A8BB2", "74B8E8", "659EBB", "3C9FFF", "26466F", "2472FF", "0069A4", "009BF2", "004165", "49A0B4", "274C5F", "000000", "7A5848", "E0A088", "F9DEC6", "3A2A22", "DC3522", "D9CB9E", "374140", "2A2C2B", "1E1E20", "CB3937", "FE6B2C", "654E44", "6DD16F", "70FE2C", "275673", "4681A6", "FDDEC9", "F22816", "400101", "071C2F", "388494", "E6A934", "F3DB5F", "534329", "206956", "47683B", "E1BFA6", "BF7950", "903932"],
        webcolors: ["0066aa", "00bbdd", "338800", "77bb00", "ffcc99", "990c0c", "0303c9", "336699", "669933", "cccccc", "EEEEEE", "E7C36F", "F7B230", "E35B20", "000033", "7D7A74", "BD524A", "FCB200", "8CFCC2", "2ACD6B", "666666", "666553", "FFFEEC", "B2B2A4", "AAA4B2", "9CA5E3", "5A668C", "BBA469", "CFC295", "FFFFFF", "DBBF56", "2E94B3", "808080", "E96656", "14A168", "DE185B", "D8806F", "DBE186", "D8CC63", "DCC527", "4E6C89", "E2BDAD", "EC6053", "81BBAD", "DFCDA5", "453394", "66398A", "313E7D", "336694", "788E91"],
        sandy: ["c0a986", "ecd9c3", "dfc79b", "f6d58e", "ecdaad", "fff3e0", "7f6b4a", "ffd694", "7f7a70", "ccac76", "E6E2AF", "A79A71", "EFECCA", "806F4C", "2F2F2E", "997F1A", "CCB65F", "FFD291", "6B674A", "635F3A", "7F693A", "FFEBC1", "FFD275", "7F7561", "CCA85E", "D29854", "4A4034", "C9AD8D", "4A351D", "968169", "E6E39F", "9A9757", "FFFDC9", "94909A", "E2E0E6", "960010", "EB1517", "CD7C29", "9A571C", "1F7A94", "7F6826", "7F724C", "FFE499", "FFD04C", "CCA63D", "FFA669", "92FFB6", "FFF352", "E8C269", "D7E8CB"],
        pinkshades: ["F6B1C3", "F0788C", "DE264C", "BC0D35", "A20D1E", "E12256", "BB1C48", "7B132F", "3B0917", "FA2660", "FFB7B5", "9A423F", "FF6D68", "BB5855", "CC5753", "E88161", "D66C60", "C2646E", "996072", "705262", "FFA1BD", "FF8FB7", "FF82AE", "E9719B", "CC6882", "F250C7", "BF1774", "BF2696", "AC60AA", "BB90C5", "BF1553", "F20775", "F2F2F2", "e5566d", "f2afc1", "f43fa5", "fc8c99", "FF6887", "7F3443", "CC536C", "D06AA9", "E65F41", "650017", "BC1620", "FA427E", "3B1132", "84476E", "B83D65", "E6E0E8", "FF6EE8"],
        misty: ["5C7A84", "3D5372", "7C9196", "50748A", "ADBFBF", "010735", "052159", "194073", "376B8C", "FFFFFF", "985999", "C811CC", "892EFF", "FF6852", "DBA211", "0A0D0C", "85A67C", "46593E", "BBD9AD", "202616", "BF8E63", "734327", "A66C4B", "593A2F", "BFBFBF", "8DB0B6", "1B778A", "F46C1B", "881801", "192129", "81808C", "ABAABF", "0C0E09", "6A7366", "37402F", "5D6663", "84867B", "A4A66A", "BABBB1", "20211C", "6B9695", "646E8C", "6B8196", "61787F", "648C80", "8E9FBA", "89A8C8", "799ED1", "7FAEE7", "849EBD"],
        citrus: ["FAEA41", "E7F03E", "E3C647", "FAC541", "F0AB3E", "CCCA1F", "FFF300", "FFCB0D", "FF9500", "804A00", "6A692A", "FFFCA0", "FFFFFF", "CF664E", "EFAC66", "EFF299", "F2DC6D", "F29727", "F2600C", "592202", "214001", "4F7302", "1A2601", "BCD97E", "C0D904", "AAFEFF", "359D6D", "E5FF45", "65FCCF", "ABDC4B", "42B200", "C6FF00", "F2E304", "FFB200", "FF8600", "52EC04", "04E206", "94D507", "ECE404", "E2C904", "DA321C", "FF7913", "FBD028", "C0D725", "9FC131", "547312", "ADBF26", "DEB329", "F1DB47", "E08214"],
        vintage: ["684132", "fdbe30", "eaac21", "87783c", "3e4028", "ffc706", "cd5648", "5bafa9", "828282", "363636", "424862", "fb9a63", "bfc4d5", "f6fbf4", "febc98", "657050", "FCF082", "D8D98B", "A2AB80", "4D584A", "5ADED4", "4DAAAB", "26596A", "163342", "6C98A1", "010A26", "28403B", "557359", "AEBF8A", "C7D9AD", "AFFCCB", "CB4243", "D2997E", "36857E", "4AC6BB", "28394B", "191313", "AF0A18", "DC373D", "122438", "43734A", "A6A26D", "D9B448", "BF8C2C", "734002", "26010F", "866F53", "ACBD91", "7BAB87", "546859"],
        moonlight: ["241D37", "2A233D", "322B45", "362F49", "D4BA73", "261225", "592040", "8C3063", "A64985", "73345D", "A3C8FF", "85B6FF", "000040", "213190", "050859", "FFFFFF", "6AAED9", "4184BF", "224573", "2e4154", "bcad7e", "955351", "c36a57", "9a8556", "7e6029", "dbd78e", "beae3b", "c3a04c", "58504d", "967644", "CFC496", "B3B391", "889486", "61797B", "366577", "123340", "436E73", "7B8C61", "D7D996", "F0EBB4", "341F36", "D9B5E0", "9889AB", "4D4E66", "1B2129", "5CBBE3", "FCF1BC", "5C8182", "383A47", "B4F257"],
        candycrush: ["0779f4", "30da00", "fb8006", "f9d802", "a71df7", "f70200", "fd49ae", "682e07", "9b2424", "5e7693", "F9AB3B", "EF5627", "FF0000", "00A398", "803C2C", "DE5711", "FFF026", "FF0048", "14A0CC", "00B229", "FFFFBE", "F7CD99", "FF77A1", "9886E8", "97CACB", "EAEDE5", "FFD127", "FF870C", "EC4610", "9A1900", "993460", "CC1464", "C300FF", "FFFFBC", "CCB914", "FFFEE2", "B24C5F", "FF274F", "0A94CC", "679DB2", "C2FFE6", "16B271", "5FFFBC", "B2442F", "FFA190", "E89359", "FFFB75", "F36EFF", "5999E8", "73EB86"],
    }

})(jQuery, Syncfusion);