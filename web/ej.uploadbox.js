/**
* @fileOverview Plugin to style the Html div elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) { 
    ej.widget("ejUploadbox", "ej.Uploadbox", {

        element: null,
		_addToPersist: [""],
        model: null,
        validTags: ["div", "span"],
        _setFirst: false,

        _rootCSS: "e-uploadbox",

        defaults: {

            buttonText: {

                browse: "Browse",

                upload: "Upload",

                cancel: "Cancel",

                close: "Close",
            },

            width: "100px",

            height: "35px",

            htmlAttributes: {},

            dialogPosition: { X: "", Y: "" },

            dialogText: {

                title: "Upload Box",

                name: "Name",

                size: "Size",

                status: "Status"
            },

            customFileDetails: {

                title: true,

                name: true,

                size: true,

                status: true,

                action: true
            },

            dialogAction: {

                modal: false,

                closeOnComplete: false,

                drag: true,

                content: null

            },

            locale: "en-US",

            asyncUpload: true,

            pushFile: null,

            enabled: true,

            multipleFilesSelection: true,

            autoUpload: false,

            showFileDetails: true,

            fileSize: 31457280,

            extensionsAllow: "",

            extensionsDeny: "",

            saveUrl: "",

            removeUrl: "",

            uploadName: "",

            cssClass: "",

            dropAreaText: "Drop files or click to upload",

            allowDragAndDrop: false,

            showBrowseButton: true,

            showRoundedCorner: true,

            dropAreaHeight: "100%",

            dropAreaWidth: "100%",

            enableRTL: false,

            create: null,

            fileSelect: null,

            begin: null,
			
			beforeSend:null,

            cancel: null,

            inProgress: null,
            
            success: null,

            complete: null,

            remove: null,

            error: null,

            destroy: null
        },


        dataTypes: {
            buttonText: "data",
            dialogText: "data",
            disbled: "boolean",
            customFileDetails: "data",
            pushFile: "data",
            dialogAction: "data",
            multipleFilesSelection: "boolean",
            autoUpload: "boolean",
            showFileDetails: "boolean",
            allowDragAndDrop: "boolean",
            showBrowseButton: "boolean",
            showRoundedCorner: "boolean",
            fileSize: "number",
            extensionsAllow: "string",
            extensionsDeny: "string",
            saveUrl: "string",
            removeUrl: "string",
            cssClass: "string",
            enableRTL: "boolean",
            htmlAttributes: "data"
        },



        disable: function () {
            this._changeState(false);
        },

        enable: function () {
            this._changeState(true);
        },
		
        _changeState: function (state) {
            (state)? $(this.control).removeClass("e-disable") : $(this.control).addClass("e-disable");
            this.model.enabled = state;
            $(this._currentElement).find(".e-uploadinput")[0].disabled = !state;
            if (this.diaObj) {
                this.diaObj.option("beforeClose", this._onBeforeClose);
                this.diaObj.setModel({ enabled: state, allowDraggable: state });
            }
        },

        refresh: function () {
            if (this.diaObj) {
                if (this.diaObj.isOpened())
                    this.diaObj.close();
                else
                    this._uploadFileListDelete();
            }
        },
        _updateLocalConstant: function () {
            this._localizedLabels = ej.getLocalizedConstants("ej.Uploadbox", this.model.locale);
        },
        _init: function () {
            this.s = ej.browserInfo();
            this._updateLocalConstant();
            this._initialize();
            this._wireEvents();
            /*Sync Uploads*/
            if (!this.model.asyncUpload) {
                this._initObjectsSyncUpload();
            }
            this._controlStatus(this.model.enabled);
            this.model.locale == "en-US" ? this._buttonText(this.model.buttonText) : this._setLocale();
            this._roundedCorner(this.model.showRoundedCorner);
        },

        _setModel: function (options) {
            var option;
            for (option in options) {
                switch (option) {
                    case "buttonText":
                        this._buttonText(options[option]);
                        break;
                    case "htmlAttributes":
                        this._addAttr(options[option]);
                        break;
                    case "dialogText":
                        this._dialogText(options[option]);
                        break;
                    case "cssClass":
                        this._setSkin(options[option]);
                        break;
                    case "enableRTL":
                        this._setRTL(options[option]);
                        break;
                    case "enabled":
                        this._controlStatus(options[option]);
                        break;
                    case "locale":
                        this.model.locale = options[option];
                        this._updateLocalConstant();
                        this._setLocale();
                        break;
                    case "height":
                        this.model.height = options[option];
                        this._setHeight(this.model.height);
                        break;
                    case "width":
                        this.model.width = options[option];
                        this._setWidth(this.model.width);
                        break;
                    case "dialogPosition":
                        this.model.dialogPosition = options[option];
                        this._dialogPosition();
                        break;
                    case "allowDragAndDrop":
                        this.model.allowDragAndDrop = options[option];
                        this._dragAndDrop();
                        break;
                    case "dropAreaText":
                        this.model.dropAreaText = options[option];
						this._dropAreaText(this.model.dropAreaText);
                        break;
                    case "showBrowseButton":
                        this.model.showBrowseButton = options[option];
                        this._hideBrowseButton();
						this._refreshUploadDialogParent();
                        break;
                    case "showRoundedCorner":
                        this._roundedCorner(options[option]);
                        break;
                    case "dropAreaHeight":
                        this.model.dropAreaHeight = options[option];
                        this._setSize();
                        break;
                    case "dropAreaWidth":
                        this.model.dropAreaWidth = options[option];
                        this._setSize();
                        break;
                    case "pushFile":
                        this.model.pushFile = options[option];
                        if (this.model.pushFile != null && this.UploadType == "Xhr" && this.model.asyncUpload) this._files = this.model.pushFile; this._onXhrSelect();
                        break;
                    case "multipleFilesSelection":
                        this.model.multipleFilesSelection = options[option];
						 if (((navigator.userAgent.indexOf('Safari') != -1 )&& (navigator.userAgent.indexOf('Chrome') == -1 ))==false)
                        if (this.model.multipleFilesSelection)
                            this._currentElement.find(".e-uploadinput").attr('multiple', 'multiple');
                        else
                            this._currentElement.find(".e-uploadinput").removeAttr('multiple');
                        break;
                    case "uploadName":
                        this.model.uploadName = options[option];
                        this.inputupload.attr('name', this.model.uploadName);
                        this.refresh();
                        break;
                    case "autoUpload":
                        this.model.autoUpload = options[option];
                        break;
                    case "showFileDetails":
                        this.model.showFileDetails = options[option];
                        this.refresh();
                        break;
                    case "fileSize":
                        this.model.fileSize = options[option];
                        break;
                    case "extensionsAllow":
                        this.model.extensionsAllow = options[option];
						this._currentElement.find(".e-uploadinput").attr('accept', options[option]);
                        break;
                    case "extensionsDeny":
                        this.model.extensionsDeny = options[option];
                        break;
                    case "saveUrl":
                        this.model.saveUrl = options[option];
                        break;
                    case "removeUrl":
                        this.model.removeUrl = options[option];
                        break;
                }
                this._currentElement = this.model.allowDragAndDrop && !this.model.showBrowseButton ? this.dragWrapper : this.element;
            }
        },

        _controlStatus: function (value) {
            value != true ? this.disable() : this.enable();
        },

        _setRTL: function (val) {
            val ? this._currentElement.addClass("e-rtl") : this._currentElement.removeClass("e-rtl");
            if (this.updialog) this.updialog.ejDialog({ enableRTL: val });
        },
        _getLocalizedLabels: function (property) {
            var textType,targetText="";
            if (property == "browse" || property == "upload" || property == "cancel" || property == 'close')
                textType = "buttonText";
            else
                textType = "dialogText";
            if(this._localizedLabels[property])
                targetText =this._localizedLabels[property];
            else if(this._localizedLabels[textType][property])
                targetText =this._localizedLabels[textType][property];
            else if(ej.Uploadbox.Locale["en-US"][property])
                targetText =ej.Uploadbox.Locale["en-US"][property];
            else if(ej.Uploadbox.Locale["en-US"][textType][property]) 
                targetText =ej.Uploadbox.Locale["en-US"][textType][property];
            return targetText;
        },

        _setLocale: function () {
            this._buttonText(this._localizedLabels.buttonText);
            this._dialogText(this._localizedLabels.dialogText);
            this._dropAreaText(this._localizedLabels.dropAreaText);
        },

        _buttonText: function (data) {
            $.extend(this.model.buttonText, data);
            this.buttondiv.val(this.model.buttonText.browse);
            if (this.updialog) {
                this.updialog.find(".e-action-container .e-uploadbtn").html(this.model.buttonText.upload);
                this.updialog.find(".e-action-container .e-uploadclosebtn").html(this.model.buttonText.cancel);
            }
        },

        _dialogText: function (data) {
            $.extend(this.model.dialogText, data);
            if (!(this.diaObj == undefined))
                this.diaObj.option('title', this.model.dialogText.title);
            if (this.updialog) {
                this.updialog.find('.e-head-name').html(this.model.dialogText.name);
                this.updialog.find('.e-head-size').html(this.model.dialogText.size);
                this.updialog.find('.e-head-status').html(this.model.dialogText.status);
            }
        },


        _destroy: function () {
            if (this._currentElement.hasClass("e-uploadbox")) {
                this._currentElement.removeClass("e-uploadbox e-widget");
                this._currentElement.empty();
                $(this.dragWrapper).after(this._currentElement);
				this.element.css({"width": "", "height": ""});
                this._bindResizeHandler(false);
                this.dragWrapper.remove();
            }
        },

        _setSkin: function (skin) {
            this._currentElement.removeClass(this.model.cssClass);
            this._currentElement.addClass(skin);
			if (this.diaObj)
                this.diaObj.setModel({ cssClass:this.model.cssClass });
			if (this.model.allowDragAndDrop) this.dragWrapper.addClass(skin);
        },


        _initialize: function () {
            this.control = this.element[0];
            this.element.addClass("e-widget " + this.model.cssClass);
            this.innerdiv = ej.buildTag('div.e-selectpart e-select e-box');
            this.element.append(this.innerdiv);
            this.buttondiv = ej.buildTag('input.e-inputbtn e-btn#' + this.control.id + '_SelectButton', '', {}, { type: 'button', "data-role": "none", value: this._getLocalizedLabels("browse") });
            this.inputupload = ej.buildTag('input.e-uploadinput', "", {}, { type: 'file', "data-role": "none", name: this.model.uploadName != "" ? this.model.uploadName : this.control.id });
			if(this.model.extensionsAllow){
			   this.inputupload.attr("accept",this.model.extensionsAllow);
			}
            if (this.model.multipleFilesSelection) 
			if (((navigator.userAgent.indexOf('Safari') != -1 )&& (navigator.userAgent.indexOf('Chrome') == -1 ))==false){
                this.inputupload.attr('multiple', 'multiple');
            }
            this.innerdiv.append(this.buttondiv);
            this.innerdiv.append(this.inputupload);
            if (this.model.allowDragAndDrop) this._dragAndDrop(true);
            this._Selector = this.buttondiv[0];
            this._currentElement = this.model.allowDragAndDrop && !this.model.showBrowseButton ? this.dragWrapper : this.element;
            this._setRTL(this.model.enableRTL);
            this._addAttr(this.model.htmlAttributes);
            this.Uploadframes = []; //For IFrame
            this.UploadForms = [];
            this._successFiles = [];
			this._errorFiles = [];
            this.UploadType = this._isXhrSupported() ? "Xhr" : "IFrame";
            if (this.model.width != "") this._setWidth(this.model.width);
            if (this.model.height != "") this._setHeight(this.model.height);
            this._hideBrowseButton();
        },		
        _refreshUploadDialogParent: function () {
            if (this.diaObj)
                this.diaObj.setModel({ target: (this.model.dialogAction.content != null && this.model.dialogAction.content != "") ? this.model.dialogAction.content : (!this.model.showBrowseButton) && (this.model.allowDragAndDrop) ? "#" + this.control.id + '_dragWrapper' : "#" + this.control.id });
        },
        _hideBrowseButton: function () {
            if ((!this.model.showBrowseButton) && (this.model.allowDragAndDrop)) {
                this.element.addClass("e-browse-hide");
                this._dropAreaSize();
            }
            else {
                if (this.element.hasClass("e-browse-hide")) {
                    this.element.removeClass("e-browse-hide");
                    this.element.width(this.model.width);
                    this.element.height(this.model.height);
                }
            }
        },
        _setSize: function () {
            if (this.model.allowDragAndDrop) {
                if (this.model.dropAreaWidth != "") this.dragWrapper.outerWidth(this.model.dropAreaWidth);
                if (this.model.dropAreaHeight != "") this.dragWrapper.outerHeight(this.model.dropAreaHeight);
                if (!this.model.showBrowseButton) this._dropAreaSize();
            }
        },

        _dropAreaSize: function () {
            if (this.model.dropAreaWidth != "") this.element.width(this.model.dropAreaWidth);
            if (this.model.dropAreaHeight != "") this.element.height(this.model.dropAreaHeight);
        },

        _addAttr: function (htmlAttr) {
            var proxy = this;
            $.map(htmlAttr, function (value, key) {
                if (key == "class") proxy.element.addClass(value);
                else if (key == "disabled" && value == "disabled") proxy.disable();
                else proxy.element.attr(key, value)
            });
        },

        _dragAndDrop: function () {
            if (this.model.allowDragAndDrop) {
                this.dragWrapper = ej.buildTag("div.e-drag-wrapper e-widget-wrapper e-upload-box " + this.model.cssClass + "#" + this.control.id + '_dragWrapper')
                this.innerWrapper = ej.buildTag("div.e-drag-container");
                this._spanTag = ej.buildTag("span.e-drag-text").html(this.model.locale == "en-US" ? this.model.dropAreaText : ej.Uploadbox.Locale[this.model.locale].dropAreaText);
                this.innerWrapper.append(this._spanTag);
                this.innerWrapper.insertBefore(this.element);
                this.dragWrapper.insertBefore(this.element);
                this.innerWrapper.append(this.element);
                this.dragWrapper.append(this.innerWrapper);
                this._bindDragEvents();
                this._refreshUploadDialogParent();
                this._setSize();
            }
            else {
                this._refreshUploadDialogParent();
                this.element.insertBefore(this.dragWrapper);
                this.dragWrapper.remove();
                this._unBindDragEvents();
            }
            this._hideBrowseButton();
        },
        _resizeHandler: function () {
            if (this.diaObj) {
                if ($(window).width() > 750) {
                    $(this.updialog).closest('.e-dialog.e-uploadbox').removeClass("e-mobile-upload");
                    this.diaObj.setModel({ width: this._getDialogContentWidth(), height: "auto" });
                }
                else {
                    $(this.updialog).closest('.e-dialog.e-uploadbox').addClass("e-mobile-upload");
                    this.diaObj.setModel({ width: 250, height: "auto"});
                }
                if (this.diaObj.scroller) this.diaObj.scroller.setModel({ height: "auto" });
            }
        },
        _getDialogContentWidth: function () {
            var dialogWidth = 0;
            if (this.model.customFileDetails.name)   dialogWidth = dialogWidth + 200;
            if (this.model.customFileDetails.size)  dialogWidth = dialogWidth + 100;
            if (this.model.customFileDetails.status) dialogWidth = dialogWidth + 200; 
            else if (this.model.customFileDetails.action) dialogWidth = dialogWidth + 45;
            return dialogWidth+5;
        },
		_dropAreaText: function (areaText) {
            if (this.model.allowDragAndDrop)
                this._spanTag.html(areaText);
        },
        _bindDragEvents: function () {
            this._on(this.dragWrapper, "dragover", this._onDragOverHandler);
            this._on(this.dragWrapper, "drop", this._onDropHandler);
        },
        _unBindDragEvents: function () {
            this._off(this.dragWrapper, "dragover", this._onDragOverHandler);
            this._off(this.dragWrapper, "drop", this._onDropHandler);
        },
        _setWidth: function (value) {
            this.element.css("width", value);
        },
        _setHeight: function (value) {
            this.element.height(value);
        },
        _dialogPosition: function () {
            if (this.diaObj) {
                if ((this.diaObj.model.content == "#" + this.control.id || this.diaObj.model.content == "#" + this.control.id + "_dragWrapper") && this.model.dialogPosition.X == "" && this.model.dialogPosition.Y == "") {
                    var left = parseInt(this.diaObj.wrapper.css("left")) - ((this.diaObj.wrapper.outerWidth() - $(this.diaObj.model.content).outerWidth()) / 2);
                    this.model.dialogPosition.X = parseInt(left) > 0 ? left : parseInt(this.diaObj.wrapper.css("left"));
                    this.model.dialogPosition.Y = parseInt(this.diaObj.wrapper.css("top")) + $(this.diaObj.model.content).outerHeight();
                }
                if (this.model.dialogPosition.X != "" && this.model.dialogPosition.Y != "") {
                    if (this.model.allowDragAndDrop) {
                        var container = this.model.showBrowseButton ? $(this.diaObj.model.target).parent() : $(this.diaObj.model.target).children();
                        this.model.dialogPosition.X = parseInt(this.model.dialogPosition.X) - container.offset()["left"];
                        this.model.dialogPosition.Y = parseInt(this.model.dialogPosition.Y) - container.offset()["top"];
                    }
                    this.diaObj.setModel({ position: this.model.dialogPosition });
                }
            }
        },

        _roundedCorner: function (value) {
            if (value) {
                this.innerdiv.addClass('e-corner');
            }
            else if (this.innerdiv.hasClass('e-corner')) {
                this.innerdiv.removeClass('e-corner');
            }
        },


        _wireEvents: function () {

            this._on(this.element, "click", this._disableclickselect);
            this._on(this.element, "keydown", this._keydownselect);
            this._bindInputChangeEvent();
            this._bindResizeHandler(true);
        },
        _bindResizeHandler: function (responsive) {
            responsive ? $(window).on('resize', $.proxy(this._resizeHandler, this)) : $(window).off('resize', $.proxy(this._resizeHandler, this));
        },

        _keydownselect: function (e) {
             if (!this.element.hasClass("e-disable") && e.keyCode == 13 && (!this.diaObj || !this.diaObj.isOpened()))
               this.element.find('.e-uploadinput').click();
        },

          _onDropHandler: function (e) {
            if (ej.browserInfo().name === "msie" && ej.browserInfo().version === "8.0" || ej.browserInfo().version === "9.0") return false;
            if (this._currentElement.hasClass("e-disable")) return false;
            e.stopPropagation();
            e.preventDefault();
            this._files = this._getAllFileInfo(e.originalEvent.dataTransfer.files);
            if (!this.model.asyncUpload)
            {
                this._isDropped = true;
                $("input[type='file']").prop("files", e.originalEvent.dataTransfer.files);
               
            }
             
            this._fileSelect(e);
        },


        _onDragOverHandler: function (e) {
            if (this._currentElement.hasClass("e-disable")) return false;
            e.stopPropagation();
            e.preventDefault();
        },


        _disableclickselect: function (e) {
            if (this._currentElement.hasClass("e-disable")) {
                e.preventDefault();
            }
        },


        _bindInputChangeEvent: function () {
            this._on(this.inputupload, "change", this._inputValueChange);
        },


        _inputValueChange: function (e) {
            if ((!this.model.asyncUpload)&&(this._isDropped))
            {
                e.stopPropagation();
                e.preventDefault();
                this._isDropped = false;
            }
            else {
                this._files = this._getInputFileInfo($(e.target));
                return this._fileSelect(e);
            }
            
        },
		
		_fileSelect:function(e){
			if (this._trigger("fileSelect", {files:this._files})) { this._resetFileInput(this._currentElement.find(".e-uploadinput")); return false; }
            this._fileUpload(e);
		},
        _fileUpload: function (e) {
            var filteredFiles = this._isAllowed(this._files);
            this._files = filteredFiles.files;
            if (!this.model.asyncUpload) {
                if (filteredFiles.status)
                    this._onSelectSyncUpload(e); //Sync Upload
                } else {
                    if (filteredFiles.files != null && filteredFiles.files.length > 0) {
                        if (this.UploadType == "Xhr") 
                            this._onXhrSelect(e); //removed uploadcore // For XHR Upload
                        else 
                           this._onSelectIFrame(e); //For Iframe
                        this._resetFileInput(this._currentElement.find(".e-uploadinput"));
                    }
            }
            this._renderTooltip();
        },
		
		upload: function() {
             if (this.UploadType == "Xhr") {
                        this._xhrOnUploadButtonClick(); // Xhr Upload
                    } else {
                        this._onUploadButtonClickIFrame(); //Iframe Upload
                    }					
		},

        __uploadButtonClick: function (e) {
            if (!this._currentElement.hasClass("e-disable")) {
                var uploadbtn = this._currentElement.find(".e-uploadbtn");
                if (this._currentElement.find(".e-uploadbtn").hasClass("e-disable")) e.preventDefault();
                else {
                    this.upload();
                }
                $(e.target).attr('disabled', 'disabled').addClass('e-disable');
            }
        },

        _actionClick: function (e) {
            if (!this._currentElement.hasClass("e-disable")) {
                var targetAction, fileItem, file;
                targetAction = $(e.target);
                fileItem = targetAction.closest(".e-upload-file");
                this._file = $(fileItem).data("file");
                if (targetAction.hasClass("e-delete")) {

                    if (this.UploadType == "Xhr") {
                        this._xhrOnRemove(e, fileItem); //XHr Remove
                    } else {
                        this._onRemoveIFrame(e, fileItem); //IFrame File Upload
                    }
                } else if (targetAction.hasClass("e-file-cancel")) {
                    this._trigger("cancel", { fileStatus: this._file });
                    var fileclose = this.updialog.find(".e-file-cancel");
                    if (fileclose.hasClass("e-disable")) e.preventDefault();
                    else {
                        if (!this.model.asyncUpload) {
                            this._onCancelSyncUpload(e, fileItem); //sync
                        } else {
							this._removeFile($(fileItem).data("file"));
                            if (this.UploadType == "Xhr") {
                                this._xhrOnCancel(e, fileItem); //Xhr Cancel Item
                            } else {
                                this._onCancelIFrame(e, fileItem); //IFrame Cancel Item
                            }
                        }
                    }
                } else if (targetAction.hasClass("e-reload")) {//removed uploadcore
                    if (this.UploadType == "Xhr") {
                        this._xhrOnRetry(e, fileItem); //xhr remove
                    } else {
                        this._onRetryIFrame(e, fileItem); //IFrame Remove
                    }
                }
            }
        },

        _removeFileEntry: function (file) {
            file.remove();
        },
		_removeFile:function(file){
			var fileList=[];
			for(var index=0;index<this._files.length;index++)
				if(this._files[index]!=file)
					fileList.push(this._files[index]);
			this._files=fileList;
		},


        _isFileUpload: function (fileEntry) {
            if (this.model.customFileDetails.action) {
                var actiondiv = $(fileEntry).find("div.e-icon");
                return actiondiv.is(".e-file-cancel");
            }
            else return true;
        },


        _isXhrSupported: function () {
            return (((this.s.name == "msie" && parseInt(this.s.version) < 9) || ((this.s.name == "safari" && this.s.name == "chrome") && this.s.version == "536")) ? false : (typeof (FormData) != "undefined") && (typeof (File) != "undefined"));
        },


        _getFileName: function (input) {
            return $.map(this._getAllFileInfo(input), function (file) {
                return file.name;
            }).join(", ");
        },

        _getFileSize: function (input) {
            var tempProxy = this;
            return $.map(this._getAllFileInfo(input), function (file) {
                return tempProxy._formatSize(file.size);
            }).join(", ");
        },

        _pushFile: function (files, datapart) {
            var fileListDetails, addedFile, actionlist, i, action, diaObj, addedheading, addedfilesize, addname, addsize, addstatus, DialogContentContainer, fileListActions, dialogActions, filedialog;
            addedheading = $("<div class='e-head-content'></div>");
            addname = $("<div class='e-file-head e-head-name'>" + this._getLocalizedLabels("name") + "</div>");
            addsize = $("<div class='e-file-head e-head-size'>" + this._getLocalizedLabels("size") + "</div>");
            addstatus = $("<div class='e-file-head e-head-status'>" + this._getLocalizedLabels("status") + "</div>");
            if (this.model.customFileDetails.name) $(addname).appendTo(addedheading);
            if (this.model.customFileDetails.size) $(addsize).appendTo(addedheading);
            if (this.model.customFileDetails.status) $(addstatus).appendTo(addedheading);
            filedialog = this.updialog;
            if (filedialog && filedialog.length != 0) {
                if (this.model.showFileDetails) {
                    if (this.updialog) this.updialog.find(".e-uploadbtn").removeAttr('disabled').removeClass('e-disable');
                    this.diaObj.open();
                }
            }
            else {
                this.updialog = ej.buildTag('div.e-uploaddialog#' + this.element[0].id + '_dialog', "", {}, { 'title': this._getLocalizedLabels("title") });
                if (this.model.allowDragAndDrop && !this.model.showBrowseButton) {
                    this.dragWrapper.append(this.updialog);
                    DialogContentContainer = "#" + this.control.id + '_dragWrapper';
                }
                else {
                    this.element.append(this.updialog);
                    this.control.id!="" ?  DialogContentContainer = "#" + this.control.id : DialogContentContainer = this.element;
                }
            }
            fileListDetails = this.updialog.find(".e-ul");
            if ($(this.updialog.find(".e-head-content")))
                $(this.updialog.find(".e-head-content")).replaceWith(addedheading);
            if (fileListDetails.length == 0) {
                addedheading.appendTo(this.updialog);
                fileListDetails = ej.buildTag('ul.e-ul').appendTo(this.updialog);
			}
			if($(this.updialog).find('.e-file-upload').length>0)
				$(this.updialog).find('.e-file-upload').remove();
			fileListActions = ej.buildTag('div.e-file-upload').appendTo(this.updialog).append((this.model.autoUpload || !this.model.asyncUpload) ? $(ej.buildTag('div.e-action-container')).addClass("sync") : ej.buildTag('div.e-action-container'));
            dialogActions = ej.buildTag('button.e-uploadclosebtn e-btn e-select', this._getLocalizedLabels("cancel"), {}, { type: 'button', "data-role": "none" }).appendTo($(this.updialog).find(".e-action-container"));
            if (this.model.showRoundedCorner)
                dialogActions.addClass('e-corner');
            this._on(dialogActions, "click", this._dialogclose);
            this._on(dialogActions, 'keydown', this._keydownDialogClose);            
            var dialogContainer = (this.model.dialogAction.content != null && this.model.dialogAction.content != "") ? this.model.dialogAction.content : DialogContentContainer
            this.updialog.ejDialog({ showOnInit: false, closeIconTooltip: this._getLocalizedLabels("closeToolTip"), minWidth: 240, width: ($(window).width() < 750) ? 250 : this._getDialogContentWidth(), height: "auto", cssClass: "e-uploadbox " + this.model.cssClass, close: $.proxy(this._uploadFileListDelete, this), enableRTL: this.model.enableRTL, target: dialogContainer, enableResize: false, allowDraggable: this.model.dialogAction.drag, enableModal: this.model.asyncUpload ? this.model.dialogAction.modal : false, showHeader: this.model.customFileDetails.title , showRoundedCorner : this.model.showRoundedCorner});
            $(window).width() < 750 ? $(this.updialog).closest('.e-dialog.e-uploadbox').addClass("e-mobile-upload") : $(this.updialog).closest('.e-dialog.e-uploadbox').removeClass("e-mobile-upload");
			this.diaObj = this.updialog.data('ejDialog');
			if(this.model.cssClass!="")
				this.diaObj.setModel({ cssClass: "e-uploadbox " + this.model.cssClass });
            this._dialogPosition();
            if (!this.model.multipleFilesSelection) {
                this.updialog.find(".e-ul>.e-upload-file").remove();
            }
            for (i = 0; i < files.length; i++) {//localization can be given for not started
                addedFile = $("<li class='e-upload-file'></li>").appendTo(fileListDetails).data(datapart);
                addedlist = $("<div class='e-file-list'></div>");
                addedfilename = $("<div class='e-file-progress e-file-view'><div class='e-file-name e-file-view'><span class='e-file-name-txt'>" + files[i].name + "</span></div>");
                addedfilesize = "<div class='e-file-size e-file-view'><span class='e-file-name-txt'>" + this._formatSize(files[i].size) + "</span></div>";
                addedfilestatus = $("<div class='e-file-percentage e-file-view'><div class='e-file-progress-bar'><div class='e-file-progress-status'></div></div></div>");
                addedfileaction = $("<div class='e-action-perform'><div class='e-icon e-file-view'></div></div>")
                if (this.model.customFileDetails.name) $(addedfilename).appendTo(addedlist);
                if (this.model.customFileDetails.size) {
                    if (this._getFileSize(files[i]).toString().toLowerCase().match("0.0kb").length == 0 || files[i].size != null) {
                        $(addedfilesize).appendTo(addedlist);
                    }
                    else $(this.updialog).find(".e-head-size").remove();
                }
                if (this.model.customFileDetails.status) $(addedfilestatus).appendTo(addedlist);
                if (this.model.customFileDetails.action) {
                    $(addedfileaction).appendTo(addedlist);
                    action = "cancel";
                    addedlist.find(".e-icon").remove().addClass(action.toString());
                    if (action == "cancel") {
                        actionlist = ej.buildTag('div.e-icon e-file-cancel', '', {}, { "data-content": this._getLocalizedLabels("cancelToolTip") });
                    } else if (action == "remove") {
                        actionlist = ej.buildTag('div.e-icon e-delete', '', {}, { "data-content": this._getLocalizedLabels("removeToolTip") });
                    } else if (action == "retry") {
                        actionlist = ej.buildTag('div.e-icon e-reload', '', {}, { "data-content": this._getLocalizedLabels("retryToolTip") });
                    }

                    addedlist.find(".e-action-perform").append(actionlist);

                    this._on(actionlist, "click", this._actionClick);
                }
                $(addedlist).appendTo(addedFile);
            }
            if (this.model.showFileDetails) {
                this.diaObj.open();
            }
            this._buttonText(this.model.buttonText);
            this._dialogText(this.model.dialogText);
            return addedFile;
        },

        _keydownDialogClose: function (e) {
            if (!this._currentElement.hasClass("e-disable")) {
                if (e.keyCode == 13) this._dialogclose();
            }
        },

        _pushFileDetails: function (files) {
            var fileListDetails, addedFile, actionlist, i, action, me, diaObj, addedlist, addedheading, addname, addsize, addstatus, addaction, addedfilename, addedfilestatus, addedfilesize, addedfileaction, filedialog, DialogContentContainer, dialogActions, fileListActions;
            addedheading = $("<div class='e-head-content'></div>");
            addname = $("<div class='e-file-head e-head-name'>" + this._getLocalizedLabels("name") + "</div>");
            addsize = $("<div class='e-file-head e-head-size'>" + this._getLocalizedLabels("size") + "</div>");
            addstatus = $("</div><div class='e-file-head e-head-status'>" + this._getLocalizedLabels("status") + "</div>");
            if (this.model.customFileDetails.name) $(addname).appendTo(addedheading);
            if (this.model.customFileDetails.size) $(addsize).appendTo(addedheading);
            if (this.model.customFileDetails.status) $(addstatus).appendTo(addedheading);
            me = this;
            filedialog = this.updialog;
            if (filedialog && filedialog.length != 0) {
                if (this.model.showFileDetails) {
				    this.control.id!="" ?  DialogContentContainer  : DialogContentContainer = this.element;
                    if (this.updialog) this.updialog.find(".e-uploadbtn").removeAttr('disabled').removeClass('e-disable');
                    me.diaObj.open();
                }
            } else {
                this.updialog = ej.buildTag('div.e-uploaddialog#' + this.element[0].id + '_dialog', "", {}, { 'title': this._getLocalizedLabels("title") });
                if (this.model.allowDragAndDrop && !this.model.showBrowseButton) {
                    this.dragWrapper.append(this.updialog);
                    DialogContentContainer = "#" + this.control.id + '_dragWrapper';
                }
                else {
                    this.element.append(this.updialog);
                    this.control.id!="" ?  DialogContentContainer = "#" + this.control.id : DialogContentContainer = this.element;
                }
            }
            var fileListDetails, addedFile;
            fileListDetails = this.updialog.find(".e-ul");
            if ($(this.updialog.find(".e-head-content")))
                $(this.updialog.find(".e-head-content")).replaceWith(addedheading);
            if (fileListDetails.length == 0) {
                addedheading.appendTo(this.updialog);
                fileListDetails = ej.buildTag('ul.e-ul').appendTo(this.updialog);
			}
			if($(this.updialog).find('.e-file-upload').length>0)
				$(this.updialog).find('.e-file-upload').remove();
			fileListActions = ej.buildTag('div.e-file-upload').appendTo(this.updialog).append((this.model.autoUpload || !this.model.asyncUpload) ? $(ej.buildTag('div.e-action-container')).addClass("sync") : ej.buildTag('div.e-action-container'));
            dialogActions = ej.buildTag('button.e-uploadclosebtn e-btn e-select', this._getLocalizedLabels("cancel"), {}, { type: 'button', "data-role": "none" }).appendTo($(this.updialog).find(".e-action-container"));
            if (this.model.showRoundedCorner)
            dialogActions.addClass('e-corner');
            this._on(dialogActions, "click", this._dialogclose);            
            if (!this.model.multipleFilesSelection) {
                this.updialog.find(".e-ul>.e-upload-file").remove();
            }
            addedFile = $("<li class='e-upload-file'></li>").appendTo(fileListDetails).data("file", files);
            addedlist = $("<div class='e-file-list'></div>");
            addedfilename = $("<div class='e-file-progress e-file-view'><div class='e-file-name e-file-view'><span class='e-file-name-txt'>" + files.name + "</span></div>");
            addedfilesize = $("<div class='e-file-size e-file-view'><span class='e-file-name-txt'>" + this._formatSize(0) + "\\" + this._formatSize(files.size) + "</span></div>");
            addedfilestatus = $("<div class='e-file-percentage e-file-view'><div class='e-file-progress-bar'><div class='e-file-progress-status'></div></div></div>");
            addedfileaction = $("<div class='e-action-perform'><div class='e-icon e-file-view'></div></div></div>")
            if (this.model.customFileDetails.name) $(addedfilename).appendTo(addedlist);
            if (this.model.customFileDetails.size) $(addedfilesize).appendTo(addedlist);
            if (this.model.customFileDetails.status) $(addedfilestatus).appendTo(addedlist);
            if (this.model.customFileDetails.action) $(addedfileaction).appendTo(addedlist);
            $(addedlist).appendTo(addedFile);
            var dialogContainer = (this.model.dialogAction.content != null && this.model.dialogAction.content != "") ? this.model.dialogAction.content : DialogContentContainer;
            this.updialog.ejDialog({ showOnInit: false, closeIconTooltip: this._getLocalizedLabels("closeToolTip"), minWidth: 240, width: ($(window).width() < 750) ? 250 : this._getDialogContentWidth(), height: "auto", cssClass: "e-uploadbox " + this.model.cssClass, close: $.proxy(this._uploadFileListDelete, this), enableRTL: this.model.enableRTL, target: dialogContainer, enableResize: false, allowDraggable: this.model.dialogAction.drag, enableModal: this.model.asyncUpload ? this.model.dialogAction.modal : false, showHeader: this.model.customFileDetails.title , showRoundedCorner : this.model.showRoundedCorner })
			$(window).width() < 750 ? $(this.updialog).closest('.e-dialog.e-uploadbox').addClass("e-mobile-upload") : $(this.updialog).closest('.e-dialog.e-uploadbox').removeClass("e-mobile-upload");
			me.diaObj = this.updialog.data("ejDialog");
			if (me.model.cssClass!="")
                me.diaObj.setModel({ cssClass: "e-uploadbox " + this.model.cssClass });
            me._dialogPosition();
            if (this.model.showFileDetails) {
                me.diaObj.open();
            }
            this._buttonText(this.model.buttonText);
            this._dialogText(this.model.dialogText);
            return addedFile;
        },

        _setProgress: function (filelist, percentage, e) {
            var progressbar, progress, filesize, loaded, total;
            if (this.model.customFileDetails.status) {
                progressbar = $(filelist).find(".e-file-progress-status");
                progressbar.width(percentage + "%");
            }
            if (this.model.customFileDetails.size) {
                filesize = $(filelist).find(".e-file-size .e-file-name-txt");
                loaded = this._formatSize(e.loaded);
                total = this._formatSize(e.total);
                filesize.html(loaded + "\\" + total);
            }
        },

        _setAction: function (element, action) {
            if (this.model.customFileDetails.action) {
                var actionlist;
                element.find(".e-action-perform .e-icon,.e-file-percentage .e-icon").remove().addClass(action.toString());
                if (action == "cancel") {
                    actionlist = ej.buildTag('div.e-icon e-file-cancel', '', {}, { "data-content": this._getLocalizedLabels("cancelToolTip") });
                } else if (action == "remove") {
                    actionlist = ej.buildTag('div.e-icon e-delete', '', {}, { "data-content": this._getLocalizedLabels("removeToolTip") });
                } else if (action == "retry") {
                    actionlist = ej.buildTag('div.e-icon e-reload', '', {}, { "data-content": this._getLocalizedLabels("retryToolTip") });
                }
                element.find(".e-action-perform").append(actionlist);
                this._on(actionlist, "click", this._actionClick);
            }
        },

        _setStatus: function (element, status) {
            if (this.model.customFileDetails.status) {
                var progress, upstatus = ej.buildTag('div');
                if (status == "success") {
                    element.find(".file-status").addClass("e-file-status-success").html("Completed");
                    element.find(".e-file-percentage").html("");
                    upstatus.addClass("e-icon e-checkmark").attr("data-content", this._getLocalizedLabels("completedToolTip"));
                    element.find(".e-file-percentage").append(upstatus);
                }
                if (status == "failed") {
                    element.find(".file-status").addClass("e-file-status-failed").html("Failed");
                    element.find(".e-file-percentage").html("");
                    upstatus.addClass("e-icon e-file-percentage-failed").attr("data-content", this._getLocalizedLabels("failedToolTip"));
                    element.find(".e-file-percentage").append(upstatus);
                }
                if (status == "progress") {
                    element.find(".file-status").addClass("file-status-inprogress").html("in progress");
                }
                if (status == "uploading") {
                    element.find(".file-status").addClass("file-status-inprogress").html("uploading");
                    progress = element.find(".e-file-percentage");
                    progress.html("");
                }
            }
        },
        _renderTooltip: function () {
            var proxy = this;
            if (!ej.isNullOrUndefined(this.updialog)) {
                this.upTooltip = $(this.updialog).ejTooltip({
                    target: ".e-file-cancel, .e-delete, .e-reload, .e-checkmark, .e-close, .e-file-percentage-failed",
                    content: " ",
                    isBalloon: false,
					showRoundedCorner : this.model.showRoundedCorner,
                    enableRTL: this.model.enableRTL,
                    position: {
                        target: { horizontal: "center", vertical: "bottom" },
                        stem: { horizontal: "left", vertical: "top" }
                    }
                }).data("ejTooltip");
                $(this.upTooltip.tooltip).css({ "min-width": "auto" });
            }
        },

        _createInputandBind: function () {
            var tempInput = ej.buildTag('input', '', {}, { type: 'file', "data-role": "none" });
            tempInput.attr("name", this.model.uploadName != "" ? this.model.uploadName : this.control.id).attr("autocomplete", "off").attr("class", "e-uploadinput").attr("accept",this.model.extensionsAllow);
            if (this.model.multipleFilesSelection) 
			 if (((navigator.userAgent.indexOf('Safari') != -1 )&& (navigator.userAgent.indexOf('Chrome') == -1 ))==false){
                tempInput.attr("multiple", "multiple");
            }
            tempInput.appendTo(this.element.find(".e-selectpart"));
            this.inputupload = tempInput;
            this._bindInputChangeEvent();
        },

        _showUploadButton: function () {
            var uploadbutton = this.updialog.find(".e-uploadbtn");
            if (uploadbutton.length == 0) {
                uploadbutton = ej.buildTag('button.e-uploadbtn e-btn e-select', this._getLocalizedLabels("upload"), {}, { type: "button", "data-role": "none" });
                if (this.model.showRoundedCorner)
                    uploadbutton.addClass('e-corner');
                this.updialog.find(".e-action-container").append(uploadbutton);
                this._on(uploadbutton, "click", this.__uploadButtonClick);
                this._on(uploadbutton, 'keydown', this._keydownUpload);
                $(uploadbutton).focus();
            }
            this._buttonText(this.model.buttonText);
        },

        _keydownUpload: function (e) {
            if (e.keyCode == 13) this.__uploadButtonClick(e);
        },

        _resetFileInput: function ($element) {
            var clone = $element.clone(false, false);
            this._on(clone, "change", this._inputValueChange);
            $element.replaceWith(clone);
        },

         _isAllowed: function (files) {
            var inputfield, uploadControl, args, allowExtension,allowSize,denyExtension, proxy = this, allowedFiles = [], filteredFiles = [],status=true;
            inputfield = this.element.find(".e-uploadinput");
            uploadControl = this;
			
            if (this.model.extensionsAllow != "") {
                allowExtension = this.model.extensionsAllow.replace(/\s/g, "").toLowerCase().split(",");
				
             
                $(files).each(function () {
                    if ($.inArray((this.extension).toLowerCase(), allowExtension) == -1) {

                        args = { action: "Files Processing", error:proxy._getLocalizedLabels("allowError").replace("#Extension", allowExtension.join(", ")), files: this };
                        uploadControl._trigger('error', args);
						proxy._resetFileInput(inputfield);
                        status = false;
                    }
                    else {
                        if (this.extension != "")
                            allowedFiles.push(this);
                    }
                });
            }

            else if (this.model.extensionsDeny != "") {
                denyExtension = this.model.extensionsDeny.replace(/\s/g, "").toLowerCase().split(",");
				
				
                $(files).each(function () {
                    if ($.inArray((this.extension).toLowerCase(), denyExtension) != -1) {

                        args = { action: "Files Processing", error: proxy._getLocalizedLabels("denyError").replace("#Extension", denyExtension.join(", ")), files: this };
                        uploadControl._trigger('error', args);
						proxy._resetFileInput(inputfield);
                        status = false;
                    }
                    else {
                        if (this.extension != "")
                            allowedFiles.push(this);
                    }
                });
            }
            else {
                $(files).each(function () {
                    if (this.extension != "")
                        allowedFiles.push(this);
                });
            }
            if (this.model.fileSize != "") {
                allowSize = this.model.fileSize;
                $(allowedFiles).each(function () {
                    if ((this.size > allowSize)) {
                  
                        args = { action: "Files Processing", error: proxy._getLocalizedLabels("filedetail").replace("#fileSize", allowSize), files: this };
                        uploadControl._trigger('error', args);
						proxy._resetFileInput(inputfield);
                        status = false;
                    }
                    else {
                        filteredFiles.push(this);
                    }
                });
            }
            else
                filteredFiles = allowedFiles;
            return { files: filteredFiles, status: status };
        },

        _fileListRemove: function () {
            var fileList = this.updialog.find(".e-upload-file .e-delete");
            if (fileList.length == 0) {
                this.updialog.find(".e-uploadbtn").attr('disabled', 'disabled').addClass('e-disable');
                this.updialog.ejDialog('close');
            }
        },

        _uploadHide: function () {
            var fileList = this.updialog.find(".e-upload-file .e-file-cancel");
            if (fileList.length == 0) {
                this.updialog.find(".e-ul").empty();
                this.updialog.find(".e-uploadbtn").attr('disabled', 'disabled').addClass('e-disable');
                this.updialog.ejDialog('close');
                this.upTooltip.hide();
            }
        },

        _onBeforeClose: function (args) {
            if (!ej.isNullOrUndefined(args.event)) if ($(args.event.currentTarget).hasClass("e-disable")) args.cancel = true;
            else args.cancel = false;
        },

        _dialogclose: function (e) {
            if (!this._currentElement.hasClass("e-disable")) {
                var closebtn = this.updialog.find(".e-uploadclosebtn");
                var file, fileItem;
                fileItem = this.updialog.find(".e-ul").children().first();
                file = $(fileItem).data("file");
                if (closebtn.hasClass("e-disable")) e.preventDefault();
                else {
                    this._uploadFileListDelete();
                    this.updialog.ejDialog('close');
                }
                this._trigger("cancel", { fileStatus: file });
            }
        },

        _uploadFileListDelete: function () {
            this.updialog.find(".e-ul").empty();
			this._currentElement.find(".e-uploadinput").val("");
            this._resetFileInput(this._currentElement.find(".e-uploadinput"));
            if (!this.model.asyncUpload)
                this._formResetSyncUpload();
        },

        _onXhrSelect: function (e) {
            var files, xhrUpload, addedFile;
            this._xhrBeforeUpload(this._files);
            xhrUpload = this;
            $.each(xhrUpload._files, function (i, fileItem) {
                addedFile = $(fileItem).data("filelist");
                xhrUpload._setAction(addedFile, "cancel"); // XhrUpload._Uploader._setAction(addedFile, "cancel");
                if (xhrUpload.model.autoUpload) {
                    xhrUpload._xhrPerformUpload(fileItem);
                } else {
                    xhrUpload._showUploadButton();
                }
            });
        },

        _xhrBeforeUpload: function (files) {
            var fileEntry, xhrUpload, formdata, addedFile;
            fileEntry = files;
            xhrUpload = this;
            $.each(fileEntry, function (i, fileItem) {
                formdata = xhrUpload._createFormObjectXhr(fileItem);
                $(fileItem).data("formobject", formdata);
                addedFile = xhrUpload._pushFileDetails(fileItem);
                $(fileItem).data("filelist", addedFile);
            });

            return fileEntry;
        },

        _xhrPerformUpload: function (fileItem) {
            var isPrevented, url, xhrUpload, formdata, xhr, args;
            xhr = new XMLHttpRequest();
            xhrUpload = this;
            args = { files: fileItem };
            if (this._trigger('begin', args)) {
                $(fileItem).data("xhr", xhr);
                xhrUpload._onRequestError(xhrUpload, undefined, fileItem);
                return;
            }
            url = this.model.saveUrl;
            formdata = $(fileItem).data("formobject");

            formdata.append(((this.model.uploadName && this.model.uploadName!="")? this.model.uploadName:this.control.id)+"_data", JSON.stringify(args.data));
            $(fileItem).data("xhr", xhr);
            xhr.addEventListener("load", function (e) {
                xhrUpload._onRequestSuccess(xhrUpload, e, fileItem);
            }, false);
            xhr.addEventListener("error", function (e) {
                xhrUpload._onRequestError(xhrUpload, e, fileItem);
            }, false);
            xhr.upload.addEventListener("progress", function (e) {
                xhrUpload._onRequestProgress(xhrUpload, e, fileItem);
            }, false);
            xhr.open("POST", url);
			args = { files: fileItem, xhr: xhr };
			if (this._trigger('beforeSend', args)) {
               $(fileItem).data("xhr", xhr);
               xhrUpload._onRequestError(xhrUpload, undefined, fileItem);
               return;
            }
            xhr.send(formdata);
        },

        _xhrOnUploadButtonClick: function (e) {
            var xhrUpload, fileEntry, started, fileCount;
            xhrUpload = this.model.showBrowseButton ? this.diaObj.wrapper : this.dragWrapper;
            fileCount = xhrUpload.find(".e-ul li.e-upload-file");
            for (var i = 0; i < fileCount.length; i++) {
                fileEntry = $(this);
                started = this._isFileUpload(fileCount[i]);
                if (started) {
                    this._xhrPerformUpload($(fileCount[i]).data("file"));
                }
            }
        },

        _xhrOnRemove: function (e, fileItem) {
            var filename = $(fileItem).find(".e-file-name").text().toString().split(","), proxy = this;
            $.ajax({
                url: this.model.removeUrl,
                type: "POST",
                data: "fileNames=" + filename,
                success: function () {
                    $(fileItem).remove();
                    proxy._fileListRemove();
                    proxy._trigger("remove", { fileStatus: proxy._file });

                }
            });
			this.upTooltip.hide();
        },

        _xhrOnCancel: function (e, fileItem) {
            var file, xhr;
            file = $(fileItem).data("file");
            xhr = $(file).data("xhr");
            if (xhr) {
                $(file).data("xhr").abort();
            }
            $(file).data("xhr", null);
            $(fileItem).data("file", null);
            $(fileItem).remove();
            this._uploadHide();
        },

        _xhrOnRetry: function (e, fileItem) {
            if (!this._currentElement.hasClass("e-disable")) {
                var file = $(fileItem).data("file");
                this._xhrPerformUpload(file);
            }
        },

        _onRequestSuccess: function (xhrUpload, e, fileEntry) {
            var xhr = $(fileEntry).data("xhr");
            if (xhr.status >= 200 && xhr.status <= 299) {
                xhrUpload._onXhrUploadSuccess(xhrUpload, e, fileEntry);
            }
            else {
                xhrUpload._onRequestError(xhrUpload, e, fileEntry);
            }
			if (xhrUpload._files.length == (this._successFiles.length + this._errorFiles.length)) {
                xhrUpload._trigger('complete', { files: fileEntry, responseText: xhr.responseText,success: this._successFiles,error: this._errorFiles, xhr: xhr, e: e });
                this._onClearCompletedFiles();
            }
        },
		
		_onClearCompletedFiles: function(){
			this._successFiles.length = this._errorFiles.length = 0;
            if (this.model.dialogAction.closeOnComplete) this._dialogclose()
		},

        _onXhrUploadSuccess: function (xhrUpload, e, fileEntry) {
            var addedFile, xhr, progressbar, size, fSize, filesize, args;
            addedFile = $(fileEntry).data("filelist");
            xhr = $(fileEntry).data("xhr");
            if (xhrUpload.model.removeUrl) {
                xhrUpload._setAction(addedFile, "remove");
                xhrUpload._setStatus(addedFile, "success");
            } else {
                addedFile.find(".e-action-perform .e-icon,.e-file-percentage .e-icon").remove();
                xhrUpload._setStatus(addedFile, "success");
            }
            if ($(fileEntry).length > 0) {
                progressbar = $(addedFile).find(".e-file-progress-status");
                progressbar.width("100%");
                size = $(fileEntry)[0].size;
                fSize = this._formatSize(size);
                filesize = $(addedFile).find(".e-file-size .e-file-name-txt");
                filesize.html(fSize + "\\" + fSize);
            }
            args = { files: fileEntry,responseText: xhr.responseText, xhr: xhr, e: e };
            this.updialog.find(".e-file-upload .e-uploadclosebtn").html(this.model.buttonText.close).focus();
            xhrUpload._trigger('success', args);
            this._successFiles.push(fileEntry);
        },

        _onRequestError: function (xhrUpload, e, fileEntry) {
            var addedFile, xhr, args;
            addedFile = $(fileEntry).data("filelist");
            xhr = $(fileEntry).data("xhr");
            xhrUpload._setAction(addedFile, "retry");
            xhrUpload._setStatus(addedFile, "failed");
            args = { action: "File Processing", error: xhr.status? xhr.status+" " + xhr.statusText:"Unable to reach the server.", files: fileEntry, xhr: xhr, e: e };
            xhrUpload._trigger('error', args);
			this._errorFiles.push(fileEntry);
        },

        _onRequestProgress: function (xhrUpload, e, fileEntry) {
            var percentage, addedFile,args;
            percentage = Math.round(e.loaded * 100 / e.total);
            addedFile = $(fileEntry).data("filelist");
            xhrUpload._setProgress(addedFile, percentage, e);
            xhrUpload._setStatus(addedFile, "progress");
            args = { file: fileEntry, percentage: percentage, e: e };
            this._trigger('inProgress', args);
        },

        _createFormObjectXhr: function (file) {
            var formData = new FormData();
            formData.append(this.model.uploadName != "" ? this.model.uploadName : this.control.id, file.rawFile);
            return formData;
        },

        _getInputFileInfo: function ($input) {
            var input = $input[0];
            if (input.files) {
                return this._getAllFileInfo(input.files);
            } else {
                return [{
                    name: this._GetName(input.value),
                    extension: this._getFileExtensionType(input.value),
                    size: this._getFileSizeinIE(input.value)
                }];
            }
        },

        _getFileSizeinIE: function (fileName) {
            var actievXObj, fileSize;
            actievXObj = null;
            fileSize = null;
            try {
                actievXObj = new ActiveXObject("Scripting.FileSystemObject");
            } catch (e) {
                fileSize = null;
            }
            if (actievXObj) {
                fileSize = actievXObj.getFile(fileName).size;
            }
            return fileSize;
        },

        _getFileExtensionType: function (fileName) {
            return fileName.match ? (fileName.match(/\.([^\.]+)$/) ? fileName.match(/\.([^\.]+)$/)[0] : "" || "") : "";
        },

        _getAllFileInfo: function (rawFiles) {
            var tempProxy = this;
            return $.map(rawFiles, function (file) {
                return tempProxy._getFileInfo(file || rawFiles);
            });
        },

        _GetName: function (fullname) {
            var nameIndex = fullname.lastIndexOf("\\");
            return (nameIndex != -1) ? fullname.substr(nameIndex + 1) : fullname;
        },

        _getFileInfo: function (rawFile) {
            // Older Firefox versions (before 3.6) use fileName and fileSize
            var fileName = rawFile.name || rawFile.fileName || rawFile;
            return {
                name: fileName,
                extension: this._getFileExtensionType(fileName),
                size: rawFile.size || rawFile.fileSize,
                rawFile: rawFile
            };
        },

        _formatSize: function (bytes) {
            var i = -1;
            if (!bytes)
                return "0.0KB";
            do {
                bytes = bytes / 1024;
                i++;
            } while (bytes > 99);
            return Math.max(bytes, 0).toFixed(1) + ['KB', 'MB', 'GB', 'TB', 'PB', 'EB'][i];
        },

        _onSelectIFrame: function (e) {
            var input, files, addedFile, uploadframe;
            input = $(e.target);
            files = this._getInputFileInfo(input);
            addedFile = this._beforeUploadIFrame(files);
            uploadframe = addedFile.data("iframe");
            if (this.model.autoUpload) {
                this._performUploadIFrame(addedFile);
            } else {
                this._showUploadButton();
            }
            this._off(this.inputupload, "change");
            this._bindInputChangeEvent();
        },

        _onRemoveIFrame: function (e, fileItem) {
            var iframe, fileNames, proxy, fileDetails;
            iframe = fileItem.data("iframe");
            fileDetails = $(fileItem).data("file");
            fileNames = fileDetails[0].name;
            proxy = this;
            if (iframe) {
                this._removeFileEntry(fileItem);
                if (this.model.removeUrl) {
                    $.ajax({
                        url: this.model.removeUrl,
                        type: "POST",
                        data: "fileNames=" + fileNames,
                        success: function () {
                            proxy._fileListRemove();
                            proxy._trigger("remove", { fileStatus: proxy._file });
                        }
                    });
                }
            } else {
                this._removeFileEntry(fileItem);
                this._trigger("remove", { fileStatus: this._file });
            }
        },

        _onCancelIFrame: function (e, fileItem) {
            var iframe;
            this._trigger('cancel', { Status: fileItem });
            iframe = fileItem.data("iframe");
            if (iframe) {
                this._removeFileEntry(fileItem);
                if (typeof (iframe.stop) != "undefined") {
                    iframe.stop();
                } else if (iframe.document) {
                    iframe.document.execCommand("Stop");
                    iframe.contentWindow.location.href = iframe.contentWindow.location.href;
                }
                this._processServerResponse(iframe, "");
            }
            this._uploadHide();
        },

        _onRetryIFrame: function (e, fileItem) {
            this._performUploadIFrame(fileItem);
        },

        _beforeUploadIFrame: function (files) {
            var uploadframe, uploadform, addedfile;
            //creating iframe and adding it to the upload div block.
            uploadframe = this._createFrame(this.control.id + "_Iframe" + this.Uploadframes.length);
            this.Uploadframes.push(uploadframe);
            uploadform = this._createForm(this.model.saveUrl, uploadframe[0].id);
            this._currentElement.find("input.e-uploadinput").removeClass("e-uploadinput").css("display", "none").appendTo(uploadform);
            this._createInputandBind();
            addedfile = this._pushFile(files, { "iframe": uploadframe, "form": uploadform, "file": files });
            uploadframe.data({ "filelist": addedfile });
            this._setAction(addedfile, "cancel");
            return addedfile;
        },

        _performUploadIFrame: function (addedFile) {
            var isPrevented, files, uploadframe, uploadform, args;
            args = { files: addedFile };
            if (this._trigger('begin', args)) {
                this._failureIframeUpload(addedFile, "File upload has been denied");
                return;
            }
            files = addedFile.data("file");
            this._setStatus(addedFile, "uploading");
            uploadframe = addedFile.data("iframe");
            uploadform = addedFile.data("form");
            var hiddendata = $("<input>").attr("name", ((this.model.uploadName && this.model.uploadName!="")? this.model.uploadName:this.control.id)+"_data").attr('type', 'hidden').val(JSON.stringify(args.data));
            uploadform.append(hiddendata);
            uploadframe.appendTo(document.body);
            uploadform.appendTo(document.body);
            //error here calls the upload even if the url is wrong
            this._on(uploadframe, "load", this._removeFramesIFrame);
            uploadform.submit();
        },

        _onUploadButtonClickIFrame: function (e) {
            var iframeUpload, fileEntry, started;
            iframeUpload = this;
            $(".e-ul li.e-upload-file", iframeUpload.updialog).each(function () {
                fileEntry = $(this);
                started = iframeUpload._isFileUpload(fileEntry);
                if (started) {
                    iframeUpload._performUploadIFrame(fileEntry);
                }
            });
        },

        _removeFramesIFrame: function (e) {
            var uploadframe, response, filelist, fileEntry, args;
            uploadframe = $(e.target);
			fileEntry = this._files;
            filelist = uploadframe.data("filelist");
            try {
                response = $.trim(e.target.contentDocument.body.innerText.replace(/\n|\r/g, ' '));
            } catch (e) {
                response = "Server Error trying to get server response: " + e;
            }
            if (response.substring(0, 12) != "Server Error" && response.indexOf("HTTP Error") != 0) {
                this._processServerResponse(uploadframe, response);
                this._setIframeProgress(filelist, 100, e);
                this._setStatus(filelist, "progress");
                this._successIframeUpload(filelist, response);
            }
            else { this._failureIframeUpload(filelist, response); }
			if (filelist.length == (this._successFiles.length + this._errorFiles.length)) {
                this._trigger('complete', { files: fileEntry, responseText: response, success: this._successFiles, error: this._errorFiles });
                this._onClearCompletedFiles();
            }		
        },


        _setIframeProgress: function (filelist, percentage, e) {
            var progressbar, progress, filesize, loaded, total;
            progressbar = $(filelist).find(".e-file-progress-status");
            progressbar.width(percentage + "%");
        },

        _successIframeUpload: function (filelist, response) {
            fileEntry = filelist.data("file");
            if (this.model.removeUrl) {
                this._setAction(filelist, "remove");
                this._setStatus(filelist, "success");
            } else {
                filelist.find(".file-action").remove();
                this._setStatus(filelist, "success");
            }
            args = { files: fileEntry, responseText: response };
            this.updialog.find(".e-file-upload .e-uploadclosebtn").html(this.model.buttonText.close).focus();
            this._trigger('success', args);
            this._successFiles.push(fileEntry);
        },

        _failureIframeUpload: function (filelist, response) {
            fileEntry = filelist.data("file");
            if (this.model.saveUrl && response != "File upload has been denied") {
                this._setAction(filelist, "retry");
                this._setStatus(filelist, "failed");
            } else {
                filelist.find(".file-action").remove();
                this._setStatus(filelist, "failed");
            }
            if (response.indexOf("HTTP Error") == 0)
                args = { files: fileEntry, responseText: response, status: response.match(/\d+/).toString() };
            else
                args = { files: fileEntry, responseText: response };
            this._trigger('error', args);
			this._errorFiles.push(fileEntry);
        },

        _processServerResponse: function (uploadframe) {
            var uploadform;
            uploadform = $(document.body).find("form[target='" + $(uploadframe).attr("id") + "']");
            setTimeout(function () {
                uploadform.remove();
                uploadframe.remove();
            }, 0);
        },

        _createDivBlock: function (className) {
            return ej.buildTag('div.' + className);
        },

        _createForm: function (action, target) {
            return ej.buildTag('form', '', {}, { enctype: 'multipart/form-data', method: 'POST', action: action, target: target });
        },

        _createFrame: function (id) {
            return ej.buildTag('iframe#' + id, '', { display: 'none' }, { name: id });
        },

        _createInput: function (id) {
            return ej.buildTag('input', '', {}, { type: 'file', name: id, "data-role": "none" });
        },



        _initObjectsSyncUpload: function () {
            this._currentElement.closest("form")
                    .attr("enctype", "multipart/form-data")
                    .attr("encoding", "multipart/form-data");
            this._wireEventsSyncUpload();
        },

        _wireEventsSyncUpload: function () {
            var closestform = this._currentElement.closest("form")[0];
            this._on($(closestform), "submit", this._formSubmitSyncUpload);
            this._on($(closestform), "reset", this._formResetSyncUpload);
        },

        _onSelectSyncUpload: function (e) {
            var input, files, selection, addedfile;
            input = $(e.target);
            selection = $(".e-selectpart", this.control);
            this._currentElement.find("input.e-uploadinput").removeClass("e-uploadinput").css("display", "none").appendTo(selection);
            this._createInputandBind();
            addedfile = this._pushFile(this._files, { "file": this._files, "Input": input });
        },

        _onCancelSyncUpload: function (e, fileItem) {
            var inputfield = fileItem.data("Input");
            fileItem.data("file", null);
            fileItem.data("Input", null);
            fileItem.remove();
            inputfield.remove();
            this._uploadHide();
        },

        _formSubmitSyncUpload: function (e) {
            var input, uploader;
            input = $(".e-uploadinput", this.control);
            input.attr("name", "");
            uploader = this.model.uploadName != "" ? this.model.uploadName : this.control.id;
            setTimeout(function () {
                input.attr("name", uploader);
            }, 0);
        },

        _formResetSyncUpload: function (e) {
            $(".e-selectpart", this.control).children('input[type="file"]').each(function () {
                if (!$(this).hasClass('e-uploadinput')) {
                    $(this).remove();
                }
            });
        }
        /*Sync End*/
    });
	ej.Uploadbox.Locale = ej.Uploadbox.Locale || {} ;
    
    ej.Uploadbox.Locale['default'] = ej.Uploadbox.Locale["en-US"] = {
        buttonText: {
            upload: "Upload",
            browse: "Browse",
            cancel: "Cancel",
            close: "Close"
        },
        dialogText: {
            title: "Upload Box",
            name: "Name",
            size: "Size",
            status: "Status"
        },
		dropAreaText: "Drop files or click to upload",
        filedetail: "The selected file size is too large.  Please select a file within #fileSize",
        denyError: "Files with #Extension extensions are not allowed.",
        allowError: "Only files with #Extension extensions are allowed.",
        cancelToolTip: "Cancel",
        removeToolTip: "Remove",
        retryToolTip: "Retry",
        completedToolTip: "Completed",
        failedToolTip: "Failed",
        closeToolTip: "Close"
    };
})(jQuery, Syncfusion);
