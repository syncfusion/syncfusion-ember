/**
* @fileOverview Plugin to style the Html Captcha elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    ej.widget("ejCaptcha", "ej.Captcha", {

        element: null,

        model: null,
        validTags: ["div"],
        _setFirst: false,

        _rootCSS: "e-captcha",

        defaults: {

            enablePattern: true,

            targetInput: "",

            targetButton: "",

            height: 50,

            width: 150,

            characterSet: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",

            maximumLength: 8,

            minimumLength: 4,

            enableCaseSensitivity: true,

            enableAutoValidation: false,

            encryptedCode: "",

            customErrorMessage: "Invalid Captcha",

            showAudioButton: false,

            showRefreshButton: false,
			
			locale: "en-US",

            enableRTL: false,

            requestMapper: "",

            refreshBegin: "",

            refreshSuccess: "",

            refreshFailure: "",

            refreshComplete: "",

            mapper: "",

            hatchStyle: "BackwardDiagonal"
        },


        dataTypes: {
            targetInput: "string",
            targetButton: "string",
            height: "number",
            width: "number",
            characterSet: "string",
            maximumLength: "number",
            minimumLength: "number",
            enableCaseSensitivity: "boolean",
            enableAutoValidation: "boolean",
            encryptedCode: "string",
            customErrorMessage: "string",
            requestMapper: "string",
            showAudioButton: "boolean",
			locale: "string",
            showRefreshButton: "boolean",
            enableRTL: "boolean",
            mapper: "string",
            hatchStyle: "enum",
            enablePattern: "boolean"
        },
		_updateLocalConstant: function () {
            this._localizedLabels = ej.getLocalizedConstants("ej.Captcha", this.model.locale);
        },

		_getLocalizedLabels: function (property) {
            return this._localizedLabels[property] === undefined ? ej.Captcha.Locale["en-US"][property] : this._localizedLabels[property];
        },
        _init: function () {
            this._initialize();
            this._wireEvents();
        },

        _initialize: function () {
			this._updateLocalConstant();
            $("#" + this._id + "_RefreshButton").ejButton({ size: "normal", showRoundedCorner: true, contentType: "imageonly", prefixIcon: "e-icon e-captcha e-reload", type: "button" });
            $("#" + this._id + "_PlayAudio").ejButton({ size: "normal", showRoundedCorner: true, contentType: "imageonly", prefixIcon: "e-icon e-captcha e-volume-up", type: "button" });
			$("#" + this._id +  "_ValidText").attr("placeholder", this._getLocalizedLabels("placeHolderText"));
            this._control = $("#" + this._id).get(0);
            if (!this.model.targetInput)
                this.model.targetInput = this._id + "_ValidText";
            this._target = $("#" + this.model.targetInput).get(0);
            this._captchaImage = $("#" + this._id + "_CaptchaImage").get(0);
            this._message = $("#" + this._id + "_CaptchaMessage").get(0);
            this._refreshButton = $("#" + this._id + "_RefreshButton").get(0);
            this._form = $(this._target).parents('form')[0];
            this._audioObject = $("#" + this._id + "_AudioObject").get(0);
            this._audioButton = $("#" + this._id + "_PlayAudio").get(0);
            this._audioPluginObject = null;
            this._audioType = "audio/wav";
			if(!ej.isNullOrUndefined(this.model.targetButton) &&  !(this.model.targetButton === "")){
				this._submitButton = $("#" + this.model.targetButton).get(0);
				if (!this._submitButton)
					this._submitButton = $("[id$='" + this.model.targetButton + "']").get(0);
			}
            this._hiddenField = $("#" + this._id + "_Hidden").get(0);

            if (this._audioObject) {
                if (!this._isSupportAudio(this._audioType)) {
                    this._appendAudioPlugin();
                }
            }
        },


        _wireEvents: function (val) {
            this._FormSubmitDelegate = $.proxy(this.formSubmit, this);
            this._CaptchaRefreshDelegate = $.proxy(this.refresh, this);
            this._PlayAudioDelegate = $.proxy(this.playAudio, this);
            if (this._audioButton)
                $(this._audioButton).on('click', this._PlayAudioDelegate);
            if (this._submitButton)
                $(this._submitButton).on('click', this._FormSubmitDelegate);
            if (this._refreshButton)
                $(this._refreshButton).on('click', this._CaptchaRefreshDelegate);
        },


        _unwireEvents: function () {
            if (this._audioButton)
                $(this._audioButton).off('click', this._PlayAudioDelegate);
            if (this._submitButton)
                $(this._submitButton).off('click', this._FormSubmitDelegate);
            if (this._refreshButton)
                $(this._refreshButton).off('click', this._CaptchaRefreshDelegate);
        },


        playAudio: function () {
            try {
                if (this._audioPluginObject) {
                    this._audioPluginObject.Play();
                } else {
                    if (this._audioObject && this._audioObject.play) {
                        this._audioObject.play();
                    }
                }
            } catch (e) { }
        },


        _isSupportAudio: function (type) {
            if (!document.createElement("audio").canPlayType) {
                return false;
            } else {
                return document.createElement("audio").canPlayType(type).match(/maybe|probably/i) ? true : false;
            }
        },

        _appendAudioPlugin: function () {
            $(this._audioPluginObject).remove();
            var obj = this._createAudioPluginObject();
            this._audioObject.parentNode.appendChild(obj);
            this._audioPluginObject = $("#" + this._id + "_AudioPlugin").get(0);
        },

        _createAudioPluginObject: function () {
            var a = document.createElement("embed");
            a.setAttribute("id", this._id + "_AudioPlugin");
            a.setAttribute("src", this.model.audioUrl);
            a.setAttribute("name", "AudioPlugin");
            a.setAttribute("enablejavascript", "true");
            a.setAttribute("type", "audio/wav");
            a.setAttribute("autostart", "false");
            a.setAttribute("pluginspage", "http://www.apple.com/quicktime/download/");
            a.style.top = 0;
            a.style.left = 0;
            a.style.width = "0px";
            a.style.height = "0px";
            a.style.position = "absolute";
            return a;
        },


        _onSuccess: function (captchaResult) {
            var jsonCaptcha = captchaResult.d ? JSON.parse(captchaResult.d) : captchaResult;
            try {
                if (this._audioPluginObject) {
                    this._audioPluginObject.Pause();
                } else if (this._audioObject && this._audioObject.pause) {
                    this._audioObject.pause();
                }
            } catch (e) { }

            this._captchaImage.src = jsonCaptcha.NewChallenge;
            if (this._audioObject)
                this._audioObject.src = jsonCaptcha.AudioLink;

            this.model.audioURL = jsonCaptcha.AudioLink;

            if (this._audioPluginObject) {
                this._appendAudioPlugin();
            }

            if (jsonCaptcha.Validation.toLocaleLowerCase() == "false")
                this.model.isValid = false;
            else
                this.model.isValid = true;
            if (this.model.enableAutoValidation)
                this._displayMessages();
            if ($("#" + this._id + "_ValidText"))
                $("#" + this._id + "_ValidText").val("");
            this.model.encryptedCode = jsonCaptcha.Script;
            $(this._hiddenField).val(this.model.encryptedCode);
        },


        _displayMessages: function () {
            if (this.model.isValid) {
                $("#" + this._id + "_CaptchaMessage").html("");
            }
            else {
                $("#" + this._id + "_CaptchaMessage").html(this.model.locale == "en-US" ? this.model.customErrorMessage : ej.Captcha.Locale[this.model.locale].customErrorMessage);
                $("#" + this._id + "_ValidText").addClass("error");
            }

        },
            //On captcha refresh ajax Success
        _onRefreshSuccess: function (captchaRefresh) {
            var jsonCaptcha = captchaRefresh.d ? JSON.parse(captchaRefresh.d) : captchaRefresh;
            try {
                if (this._audioPluginObject) {
                    this._audioPluginObject.Pause();
                } else if (this._audioObject && this._audioObject.pause) {
                    this._audioObject.pause();
                }
            } catch (e) { }

            this._captchaImage.src = jsonCaptcha.NewChallenge;
            if (this._audioObject) {
                this._audioObject.src = jsonCaptcha.AudioLink;
            }
            this.model.audioUrl = jsonCaptcha.AudioLink;

            if (this._audioPluginObject) {
                this._appendAudioPlugin();
            }
            this.model.encryptedCode = jsonCaptcha.EncryptedText;
            $(this._hiddenField).val(jsonCaptcha.EncryptedText);
        },


            //Hanldes the form submit event
        formSubmit: function (event) {
            var proxy = this;
            var data = {
                Height: this.model.height,
                Width: this.model.width,
                CharacterSet: this.model.characterSet,
                MaximumLength: this.model.maximumLength,
                MinimumLength: this.model.minimumLength,
                CaseSensitive: this.model.enableCaseSensitivity,
                ShowRefreshButton: this.model.showRefreshButton,
                ShowAudioButton: this.model.showAudioButton,
                EncryptedText: this.model.encryptedCode,
                ResponseText: $(this._target).val(),
                Id: this._id,
                HatchStyle: this.model.hatchStyle,
                EnablePattern: this.model.enablePattern,
                RequestType: "CaptchaRequest",
                ActionType: "Validation"
            };
            $.ajax({
                type: 'POST',
                url: this.model.requestMapper ? this.model.requestMapper : this.model.pathName + "/" + this.model.mapper,
                data: JSON.stringify({ captchaModel: data }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                async: false,
                success: function (CaptchaResult) {
                    if (CaptchaResult)
                        proxy._onSuccess(CaptchaResult);
                    return;
                },
                error: function (e) {
                    proxy._trigger("refreshFailure");
                    return;
                }
            });
                //Check if invalid and stop form submit
            if (!this.model.isValid && this.model.enableAutoValidation) {
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
        },
            //Hanlder for captcha refresh event
        refresh: function (event) {
            var proxy = this;
            var data = {
                Height: this.model.height,
                Width: this.model.width,
                CharacterSet: this.model.characterSet,
                MaximumLength: this.model.maximumLength,
                MinimumLength: this.model.minimumLength,
                CaseSensitive: this.model.enableCaseSensitivity,
                EncryptedText: this.model.encryptedCode,
                ShowRefreshButton: this.model.showRefreshButton,
                ShowAudioButton: this.model.showAudioButton,
                Id: this._id,
                HatchStyle: this.model.hatchStyle,
                EnablePattern: this.model.enablePattern,
                RequestType: "CaptchaRequest",
                ActionType: "Refresh"
            };
            if (proxy._trigger("refreshBegin"))
                return false;
            $.ajax({
                type: 'POST',
                url: this.model.requestMapper ? this.model.requestMapper : this.model.pathName + "/" + this.model.mapper,
                data: JSON.stringify({ captchaModel: data }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                async: false,
                success: function (CaptchaRefresh) {
                    if (CaptchaRefresh) {
                        proxy._onRefreshSuccess(CaptchaRefresh);
                        proxy._trigger("refreshSuccess");
                    }
                    return;
                },
                error: function (errData) {
                    proxy._trigger("refreshFailure")
                    return;
                },
                complete: function (jqXHR, textStatus) {
                    proxy._trigger("refreshComplete")
                    return;
                }
            });
        }
    });
    ej.HatchStyle = {
         None:"none",        
         BackwardDiagonal:"backwardDiagonal",        
         Cross:"cross",
         DarkDownwardDiagonal:"darkDownwardDiagonal",
         DarkHorizontal:"darkHorizontal",
         DarkUpwardDiagonal:"darkUpwardDiagonal",
         DarkVertical:"darkVertical",
         DashedDownwardDiagonal:"dashedDownwardDiagonal",
         DashedHorizontal:"dashedHorizontal",
         DashedUpwardDiagonal:"dashedUpwardDiagonal",
         DashedVertical:"dashedVertical",
         DiagonalBrick:"diagonalBrick",
         DiagonalCross:"diagonalCross",
         Divot:"divot",
         DottedDiamond:"dottedDiamond",       
         DottedGrid:"dottedGrid",
         ForwardDiagonal:"forwardDiagonal",
         Horizontal:"horizontal",
         HorizontalBrick:"horizontalBrick",
         LargeCheckerBoard:"largeCheckerBoard",
         LargeConfetti:"largeConfetti",
         LargeGrid:"largeGrid",
         LightDownwardDiagonal:"lightDownwardDiagonal",
         LightHorizontal:"lightHorizontal",
         LightUpwardDiagonal:"lightUpwardDiagonal",
         LightVertical:"lightVertical",
         Max:"max",
         Min:"min",
         NarrowHorizontal:"narrowHorizontal",
         NarrowVertical:"narrowVertical",
         OutlinedDiamond:"outlinedDiamond",
         Percent90:"percent90",
         Wave:"wave",
         Weave:"weave",
         WideDownwardDiagonal:"wideDownwardDiagonal",
         WideUpwardDiagonal:"wideUpwardDiagonal",
         ZigZag:"zigZag"    
    };
	ej.Captcha.Locale = ej.Captcha.Locale || {};
    ej.Captcha.Locale["default"] = ej.Captcha.Locale["en-US"] = {        
        placeHolderText: "Type the code shown",
		CustomErrorMessage: "Invalid Captcha"
    };
})(jQuery, Syncfusion);