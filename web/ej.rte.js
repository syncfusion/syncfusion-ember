/**
* @fileOverview Plugin to style the Html TextArea
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) { 
    var xhr = null;
    ej.widget("ejRTE", "ej.RTE", {

        element: null,

        model: null,
        _rootCSS: "e-rte",
        validTags: ["textarea"],
        _addOnPersist: ["value", "height", "width"],
        _setFirst: false,
        _requiresID: true,
        _operationHandler: null,
        angular: {
            require: ['?ngModel', '^?form', '^?ngModelOptions']
        },

        defaults: {

            allowEditing: true,

            isResponsive: false,

            allowKeyboardNavigation: true,

            enableTabKeyNavigation: true,

            cssClass: "",

            height: "370",

            width: "786",

            enabled: true,

            htmlAttributes: null,

            externalCSS: null,

            enableXHTML: false,

            importSettings: { url: "" },

            exportToPdfSettings: { url: "", fileName: "PdfExport" },

            exportToWordSettings: { url: "", fileName: "WordExport" },

            validationRules: null,

            validationMessage: null,
            maxLength: 7000,

            minWidth: "400",

            maxWidth: null,

            minHeight: "280",

            maxHeight: null,

            showToolbar: true,

            showFooter: false,

            showHtmlSource: false,

            showWordCount: true,
            showCharCount: true,

            showHtmlTagInfo: true,

            showClearAll: false,

            iframeAttributes: null,

            showClearFormat: true,
            showContextMenu: true,

            showFontOption: true,
            autoFocus: false,
            enableHtmlEncode: false,
            showDimensions: false,

            showRoundedCorner: false,

            locale: "en-US",

            name: "",
            pasteCleanupSettings: {
				listConversion: false, 
				cleanCSS: false,
				removeStyles: false,
				cleanElements: false
			},
			toolbarOverflowMode:"popup",

            tools: {

                formatStyle: ["format"],

                edit: [],

                style: ["bold", "italic", "underline", "strikethrough"],

                alignment: ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull"],

                lists: ["unorderedList", "orderedList"],

                indenting: ["outdent", "indent"],

                doAction: ["undo", "redo"],

                links: ["createLink", "removeLink"],

                images: ["image"],
                media: ["video"],

                tables: ["createTable", "addRowAbove", "addRowBelow", "addColumnLeft", "addColumnRight", "deleteRow", "deleteColumn", "deleteTable"],
                view: ["fullScreen"],
                customTools: [],
                print: [],
                customOrderList: [],
                customUnOrderList: [],
                font: [],
                clipboard: [],
                clear: [],
                effects: [],
                casing: [],
                importExport: [],
            },

            tooltipSettings: {
                associate: "mouseenter",
                showShadow: true,
                position: {
                    stem: { horizontal: "left", vertical: "top" }
                },
                tip: {
                    size: { width: 5, height: 5 }
                },
                isBalloon: false
            },
            toolsList: ["formatStyle", "font", "style", "effects", "alignment", "lists", "indenting", "clipboard", "doAction", "clear", "links", "images", "media", "tables", "casing", "customTools", "view", "print", "edit", "importExport"],

            colorCode: [
			            "000000", "FFFFFF", "C4C4C4", "ADADAD", "595959", "262626", "4f81bd", "dbe5f1", "b8cce4", "95b3d7", "366092", "244061", "c0504d", "f2dcdb", "e5b9b7", "d99694", "953734",
			            "632423", "9bbb59", "ebf1dd", "d7e3bc", "c3d69b", "76923c", "4f6128", "8064a2", "e5e0ec", "ccc1d9", "b2a2c7", "5f497a", "3f3151", "f79646", "fdeada", "fbd5b5", "fac08f",
			            "e36c09", "974806"
            ],

            format: [
                { text: "Paragraph", value: "<p>", spriteCssClass: "e-paragraph" },
                { text: "Quotation", value: "<blockquote>", spriteCssClass: "e-quotation" },
                { text: "Heading 1", value: "<h1>", spriteCssClass: "e-h1" },
                { text: "Heading 2", value: "<h2>", spriteCssClass: "e-h2" },
                { text: "Heading 3", value: "<h3>", spriteCssClass: "e-h3" },
                { text: "Heading 4", value: "<h4>", spriteCssClass: "e-h4" },
                { text: "Heading 5", value: "<h5>", spriteCssClass: "e-h5" },
                { text: "Heading 6", value: "<h6>", spriteCssClass: "e-h6" }
            ],

            fontName: [
                       {
                           text: "Segoe UI",
                           value: "Segoe UI"
                       },
                       {
                           text: "Arial",
                           value: "Arial,Helvetica,sans-serif"
                       },
                       {
                           text: "Courier New",
                           value: "Courier New,Courier,monospace"
                       },
                       {
                           text: "Georgia",
                           value: "Georgia,serif"
                       },
                       {
                           text: "Impact",
                           value: "Impact,Charcoal,sans-serif"
                       },
                       {
                           text: "Lucida Console",
                           value: "Lucida Console,Monaco,monospace"
                       },
                       {
                           text: "Tahoma",
                           value: "Tahoma,Geneva,sans-serif"
                       },
                       {
                           text: "Times New Roman",
                           value: "Times New Roman,Times,serif"
                       },
                       {
                           text: "Trebuchet MS",
                           value: "Trebuchet MS,Helvetica,sans-serif"
                       },
                       {
                           text: "Verdana",
                           value: "Verdana,Geneva,sans-serif"
                       }
            ],

            fontSize: [
                {
                    text: "1 (8pt)",
                    value: "8pt"
                },
                {
                    text: "2 (10pt)",
                    value: "10pt"
                },
                {
                    text: "3 (12pt)",
                    value: "12pt"
                },
                {
                    text: "4 (14pt)",
                    value: "14pt"
                },
                {
                    text: "5 (18pt)",
                    value: "18pt"
                },
                {
                    text: "6 (24pt)",
                    value: "24pt"
                },
                {
                    text: "7 (36pt)",
                    value: "36pt"
                }
            ],

            tableRows: 8,

            tableColumns: 10,

            colorPaletteRows: 6,

            colorPaletteColumns: 6,

            showCustomTable: true,

            value: null,

            undoStackLimit: 50,

            enableResize: true,

            enablePersistence: false,

            enableRTL: false,

            autoHeight: false,

            zoomStep: '0.05',

            imageBrowser: {

                filePath: "",

                extensionAllow: "*.png,*.gif,*.jpg,*.jpeg",

                ajaxAction: "",

                ajaxSettings: ""
            },

            fileBrowser: {

                filePath: "",

                extensionAllow: "*.doc,*.docx,*.pdf,*.txt",

                ajaxAction: ""
            },


            change: null,

            execute: null,

            keydown: null,

            keyup: null,

            create: null,

            destroy: null,
            contextMenuClick: null,
            preRender: null,
            select: null
        },

        dataTypes: {
            enabled: "boolean",
            autoFocus: "boolean",
            enableHtmlEncode: "boolean",
            autoHeight: "boolean",
            enableXHTML: "boolean",
            isResponsive: "boolean",
            enablePersistence: "boolean",
            showRoundedCorner: "boolean",
            showCustomTable: "boolean",
            enableResize: "boolean",
            importSettings: { url: "string" },
            exportToPdfSettings: { url: "string", fileName: "string" },
            exportToWordSettings: { url: "string", fileName: "string" },
            pasteCleanupSettings: {
				listConversion: "boolean", 
				cleanCSS: "boolean",
				removeStyles: "boolean",
				cleanElements: "boolean"
			},
            showDimensions: "boolean",
            showFontOption: "boolean",
            showClearFormat: "boolean",
            showClearAll: "boolean",
            showHtmlTagInfo: "boolean",
            showWordCount: "boolean",
            showCharCount: "boolean",
            showHtmlSource: "boolean",
            allowKeyboardNavigation: "boolean",
            enableTabKeyNavigation: "boolean",
            allowEditing: "boolean",
            showToolbar: "boolean",
            showFooter: "boolean",
            showContextMenu: "boolean",
            enableRTL: "boolean",
            toolsList: "array",
            colorCode: "array",
			toolbarOverflowMode:"enum",
            format: "data",
            fontName: "data",
            fontSize: "data",
            htmlAttributes: "data",
            iframeAttributes: "data",
            tools: {
                formatStyle: "array",
                font: "array",
                edit: "array",
                style: "array",
                effects: "array",
                alignment: "array",
                lists: "array",
                indenting: "array",
                clipboard: "array",
                doAction: "array",
                clear: "array",
                links: "array",
                media: "array",
                images: "array",
                tables: "array",
                casing: "array",
                customTools: "array",
                view: "array",
                print: "array",
                importExport: "array",
                customOrderList: "array",
                customUnOrderList: "array"
            }
        },

        _rteIconsList: {
            "format": "format",
            "bold": "e-bold_01",
            "italic": "e-italic_01",
            "underline": "e-underline_01",
            "strikethrough": "e-strikethrough_01",
            "justifyLeft": "e-align-left_01",
            "justifyCenter": "e-align-center_01",
            "justifyRight": "e-align-right_01",
            "justifyFull": "e-align-justify_01",
            "unorderedList": "e-bullets_01",
            "orderedList": "orderedList",
            "outdent": "outdent",
            "indent": "indent",
            "undo": "undo",
            "redo": "redo",
            "createLink": "e-link_01",
            "removeLink": "e-unlink_01",
            "image": "e-image",
            "video": "e-video",
            "createTable": "e-table_02",
            "addRowAbove": "e-insert-row-above_02",
            "addRowBelow": "e-insert-row-below_02",
            "addColumnLeft": "e-insert-column-left_02",
            "addColumnRight": "e-insert-column-right_02",
            "deleteRow": "e-delete-row_01",
            "deleteColumn": "e-delete-column_01",
            "deleteTable": "deleteTable",
            "fullScreen": "fullScreen",
            "superscript": "e-superscript_01",
            "subscript": "e-subscript_01",
            "upperCase": "e-uppercase_01",
            "lowerCase": "e-lowercase_01",
            "zoomIn": "e-zoom-in",
            "zoomOut": "e-zoom-out",
            "print": "print",
            "import": "e-icon e-upload",
            "wordExport": "e-icon e-word-export",
            "pdfExport": "e-icon e-pdf-export",
            "findAndReplace": "findAndReplace",
            "cut": "e-cut_01",
            "copy": "e-copy_02",
            "paste": "e-paste_01",
            "clearFormat": "clearFormat",
            "clearAll": "e-delete_05",
            "fontName": "fontName",
            "fontSize": "fontSize",
            "fontColor": "e-font",
            "backgroundColor": "e-background-color",
            "rteResize": "e-resize-handle",
            "rteSource": "e-file-code",
            "customTableImage": "e-table",
            "resize": "e-full-screen-collapse_01",
            "maximize": "e-full-screen-expand_01",
            //Added empty strings for context menu
            "openLink": "",
            "deleteTables": "",
            "insertTable": "",
            "tableProperties": "",
            "imageProperties": ""
        },

        observables: ["value"],
        value: ej.util.valueFunction("value"),

        _setModel: function (options) {
            this._isInteraction = false;
            var option;
            for (option in options) {
                switch (option) {
                    case "allowEditing": this._enableEdit(options[option]); break;
                    case "autoFocus ": { this.model.autoFocus = options[option]; if (options[option]) this._focus(); break; }
                    case "showToolbar": {
                        options[option] ? (ej.isNullOrUndefined(this._rteToolbar) ? this._renderToolBar() : (this._rteToolbar.show() , (this.model.isResponsive && this._toolBarObj._reSizeHandler()))): this._rteToolbar.hide();
                        break;
                    }
                    case "showFooter": {
                        this.model.showFooter = options[option];
                        options[option] ? ej.isNullOrUndefined(this._rteFooter) ? this._renderFooter() : this._rteFooter.show() : this._rteFooter.hide();
                        break;
                    }
                    case "pasteCleanupSettings":
                        this.model.pasteCleanupSettings = options[option];
                        if (ej.clipboardCleaner) {
                            if (!this._pasteCleaner)
                                this._enableContentCleaner();
                            this._pasteCleaner && (this._pasteCleaner.filterOptions = options[option]);
                        }						
                    case "isResponsive": {
                        this.model.isResponsive = options[option];
                        this._renderToolBarList();
                        var iframeHeight = $(this._rteIframe).outerHeight();
                        var toolListHeight = $(this._rteToolbar).outerHeight();
                        $(this._rteWapper).height(iframeHeight + toolListHeight);
                        if (!ej.isNullOrUndefined($(this._rteFooter))) {
                            var footerHeight = $(this._rteFooter).outerHeight();
                            $(this._rteWapper).height(iframeHeight + footerHeight + toolListHeight);
                        }
                        break;
                    }
                    case "enabled": this._disabled(options[option]); break;
                    case "height": { this.model.height = options[option]; this._rteWapper.height(options[option]); } break;
                    case "width": { this.model.height = options[option]; this._rteWapper.css("width", options[option]); } break;
                    case "cssClass": this._changeSkin(options[option]); break;
                    case "showHtmlSource": this._footerElement("div.e-rte-source", options[option]); break;
                    case "showHtmlTagInfo": this._footerElement("div.e-rte-htmltaginfo", options[option]); break;
                    case "showWordCount": {
                        this.model.showWordCount = options[option];
                        this._createCountElement(options[option], this._wordCount);
                        break;
                    }
                    case "showCharCount": {
                        this.model.showCharCount = options[option];
                        this._createCountElement(options[option], this._charCount);
                        break;
                    }
                    case "tooltipSettings": {
                        this.model.tooltipSettings = $.extend(true, this.model.tooltipSettings, options[option]);
                        if (this.model.showToolbar)
                            this._toolBarItems.ejToolbar("option", "tooltipSettings", options[option]);
                        this._renderTooltip(this.model.tooltipSettings);
                        break;
                    }
                    case "showClearAll": this._footerElement("div.clearAll", options[option]); break;
                    case "showClearFormat": this._footerElement("div.clearFormat", options[option]); break;
                    case "enableResize": this._footerElement("div.e-rte-resize", options[option]); break;
                    case "fontName": this._fontStyleDDL.ejDropDownList({ dataSource: options[option] }); break;
                    case "fontSize": this._fontSizeDDL.ejDropDownList({ dataSource: options[option] }); break;
                    case "format": this._formatDDL.ejDropDownList({ dataSource: options[option] }); break;
                    case "value":
                        if (ej.isPlainObject(options[option])) options[option] = null;
                        var optionValue = ej.util.getVal(options[option]);
                        if (optionValue != this._removeNoSpaceChar($.trim(this._getDocument().body.innerHTML))){
                            this._getDocument().body.innerHTML=optionValue;
                            var args = { text: this._getText(), htmlText: this.getHtml() };
                            this._onChange();
                        } 
                        break;
                    case "showDimensions":
                        this._renderImageDialog();
                        if (options[option]) {
                            this._imgDialog.find("div.e-rte-imgdimensions").show();
                            this._imgDialog.find("div.e-rte-videoDimensions").show();
                        }
                        else {
                            this._imgDialog.find("div.e-rte-imgdimensions").hide();
                            this._imgDialog.find("div.e-rte-videoDimensions").hide();
                        }
                        break;
                    case "showFontOption":
                        if (options[option])
                            this._rteWapper.find("ul.e-rte-fontgroup").show();
                        else
                            this._rteWapper.find("ul.e-rte-fontgroup").hide();
                        break;
                    case "locale":
                        this.model.locale = options[option];
                        this._updateLocalConstant();
                        this._setLocale();
                        break;
                    case "importSettings": {
                        this.model.importSettings = $.extend(true, this.model.importSettings, options[option]);
                        break;
                    }
                    case "exportToPdfSettings": {
                        this.model.exportToPdfSettings = $.extend(true, this.model.exportToPdfSettings, options[option]);
                        break;
                    }
                    case "exportToWordSettings": {
                        this.model.exportToWordSettings = $.extend(true, this.model.exportToWordSettings, options[option]);
                        break;
                    }
                    case "tableRows": {
                        this.model.tableRows = options[option];
                        var tblDiv = this._createTable.find("div.e-rte-table").html("");
                        this._drawTable(tblDiv);
                        break;
                    }
                    case "iframeAttributes": {
                        this._updateIframeSkin(options[option]);
                        break;
                    }
                    case "tableColumns": {
                        this.model.tableColumns = options[option];
                        var tblDiv = this._createTable.find("div.e-rte-table").html("");
                        this._drawTable(tblDiv);
                        break;
                    }
                    case "showCustomTable": {
                        this._createCustomTable();
                        var custLink = this._createTable.find("div.customtable-group");
                        options[option] ? ej.isNullOrUndefined(this._customTableDialog) ? this._createCustomTable() : custLink.show() : custLink.hide();
                        break;
                    }
                    case "colorPaletteRows": {
                        this.model.colorPaletteRows = options[option];
                        this._updateColorPalette();
                        break;
                    }
                    case "colorPaletteColumns": {
                        this.model.colorPaletteColumns = options[option];
                        this._updateColorPalette();
                        break;
                    }
                    case "colorCode": {
                        this.model.colorCode = options[option];
                        this._updateColorPalette();
                        break;
                    }
                    case "name": {
                        this.model.name = options[option];
                        this._checkNameAttr();
                        break;
                    }
                    case "showContextMenu":
                        this.model.showContextMenu = options[option];
                        this._showHideContextMenu();
                        break;
                    case "enableRTL": this._enableRTL(options[option]); break;
                    case "htmlAttributes": this._addAttr(options[option]); break;
                    case "showRoundedCorner":
                        this._roundedCorner(options[option]);
                        break;
                    case "validationRules":
                        if (this.element.closest("form").length != 0) {
                            if (this.model.validationRules != null) {
                                this.element.rules('remove');
                                this.model.validationMessage = null;
                            }
                            this.model.validationRules = options[option];
                            if (this.model.validationRules != null) {
                                this._initValidator();
                                this._setValidation();
                            }
                        }
                        break;
                    case "validationMessage":
                        if (this.element.closest("form").length != 0) {
                            this.model.validationMessage = options[option];
                            if (this.model.validationRules != null && this.model.validationMessage != null) {
                                this._initValidator();
                                this._setValidation();
                            }
                        }
                        break;
                    case "autoHeight": this.model.autoHeight = options[option];
                        this._setAutoHeight();
                }
                if (option != "locale")
                    this._setIframeHeight();
            }
            this._updateCount();
        },
		_updateLocalConstant:function(){
			this._localizedLabels = ej.getLocalizedConstants("ej.RTE", this.model.locale);
		},
		_enableContentCleaner:function(){
			if(ej.clipboardCleaner && !this._isIE8()){
				!this._pasteCleaner && (this._pasteCleaner=new ej.clipboardCleaner(this._getDocument(),this._iframePaste,this));
				this._pasteCleaner.filterOptions = this.model.pasteCleanupSettings;
			}
		},
        _init: function () {
            if (!ej.isNullOrUndefined(this.element) && this.element[0].type == "textarea") {
				this._updateLocalConstant();
                this.element.hide();
                this._initialize()
                    ._render();
                this.model.allowEditing && this._wireEvents();
                this.model.pasteCleanupSettings && (this.model.pasteCleanupSettings.cleanElements || this.model.pasteCleanupSettings.removeStyles || this.model.pasteCleanupSettings.cleanCSS || this.model.pasteCleanupSettings.listConversion) && this._enableContentCleaner();
                if(this.model.iframeAttributes != null) this._updateIframeSkin(this.model.iframeAttributes);
                if (this.model.enabled == false) this._disabled(this.model.enabled);
                if(this.model.htmlAttributes != null) this._addAttr(this.model.htmlAttributes);
                if (this.model.autoFocus) {
                    this._focus();
                    this._updateToolbarStatus();
                    this._updateFontOptionStatus();
                    this._updateFormat();
                }
                if (this.model.enableHtmlEncode)
                    this.value(this._encode(this._decode(this.value())));
                if (this.model.showToolbar) {
                    this.disableToolbarItem("removeLink");
                    if (!ej.isNullOrUndefined(this._getWindow()))
                        this._updateIndentStatus();
                }
                if (this.model.enableRTL)
                    this._enableRTL(true);
                this.model.externalCSS && this._addCssToIframe(this.model.externalCSS);
                this.wrapper = this._rteWapper;
                if (this.model.validationRules != null) {
                    this._initValidator();
                    this._setValidation();
                }
                if (this.model.showContextMenu) {
                    this._showHideContextMenu();
                }
                this._isInteraction = true;
            }
        },
        _hideContextMenuByItem: function (data) {
            for (var index1 = 0; index1 < $(this._textMenuObj.element).children("li").length; index1++)
                ($.inArray($(this._textMenuObj.element.children("li")[index1]).attr("id"), data) != -1) ? $(this._textMenuObj.element.children("li")[index1]).show() : $(this._textMenuObj.element.children("li")[index1]).hide();
        },
        _filterMenuItems: function (e) {
            var selectNode = (this._isIE()) ? this._currentSelNode : this._getSelectedNode(), node = this._saveSelection().commonAncestorContainer;
            if (!ej.isNullOrUndefined(selectNode) && !ej.isNullOrUndefined(selectNode.tagName) && (selectNode.tagName.toLowerCase() === "img" || e.target.tagName.toLowerCase() == "img")) {
                this._hideContextMenuByItem(this._contextType.image);
                this._updateContextMenuItemState(true);
            }
            else if (!ej.isNullOrUndefined(selectNode) && $(selectNode).closest("table").length) {
                this._hideContextMenuByItem($(selectNode).closest("a").length ? this._contextType.table_hyper : this._contextType.table);
                this._contextValidation(node, e);
            }
            else if (!ej.isNullOrUndefined(selectNode) && $(selectNode).closest("a").length) {
                this._hideContextMenuByItem(this._contextType.hyperlink);
                this._contextValidation(node, e);
            }
            else if (this._isIE8()) {
                this._hideContextMenuByItem(this._contextType.text);
                this._updateContextMenuItemState(this._getRange().text !== "");
            }
            else {
                this._hideContextMenuByItem(this._contextType.text);
                this._contextValidation(node, e);
            }
            this._rteIframe.contents().find("body").addClass("e-cursor");
        },
        _contextmenuPosition: function (e) {
            var posX = (( e.clientX == undefined ) ? 0 : e.clientX ) + this._rteWapper.offset().left , posY = (( e.clientY == undefined ) ? 0 : e.clientY ) + this._rteWapper.offset().top + (this._rteToolbar ? this._rteToolbar.outerHeight() : 0) , menuHeight = this._textMenuObj.element.attr("style", "visibility: visible;display:block;").height() ,  menuWidth = this._textMenuObj.element.width();
            posY = ((posY + menuHeight) < ($(document).scrollTop() + $(window).height())) ? posY : ((posY - menuHeight) < 0 ? posY : (posY - menuHeight));
            posX = ((posX + menuWidth) < ($(document).scrollLeft() + $(window).width())) ? posX : (posX - menuWidth);
            this._textMenuObj.element.attr("style", ("width:auto;left:" + posX + "px;top:" + posY + "px;z-index:" + (this._onGetMaxZindex() + 1))).focus();
        },
        _contextValidation: function (node, e) {
            var data;
            this._updateContextMenuItemState(node && (data = node.nodeValue ? node.nodeValue : node.textContent) && ((this._saveSelection().endContainer == this._saveSelection().startContainer) ? (data.substring(this._saveSelection().startOffset, this._saveSelection().endOffset) !== "") : true));
        },
        _updateContextMenuItemState: function (stauts) {
            stauts ? (this._textMenuObj.enableItemByID("cut"), this._textMenuObj.enableItemByID('copy')) : (this._textMenuObj.disableItemByID("cut"), this._textMenuObj.disableItemByID('copy'));
        },
        _contextMenuClick: function (e) {
            var spellObj = this._rteIframe.data("ejSpellCheck");
            var action = e.ID ? e.ID.toLowerCase() : $(e.element).attr("id").toLowerCase(), _node;
            this._isIE() && this._ieSelectionRange && this.selectRange(this._ieSelectionRange);
            switch (action) {
                case "cut":
                    (!this._isIE() && this._getValidbrowser(ej.browserInfo().name)) ? this._openAlert(this._getLocalizedLabels("cutAlert")) : this._getDocument().execCommand(action, false, undefined);
                    if (this._imgOrg && this._imgDupDiv && this._imgBoxMouseMove) {
                        $(this._imgOrg).css("outline", "");
                        $(this._imgDupDiv).remove();
                        this._off($(this._getDocument()), "mousemove", this._imgBoxMouseMove);
                    }
                    this._updateCursor();
                    break;
                case "copy":
                    (!this._isIE() && this._getValidbrowser(ej.browserInfo().name)) ? this._openAlert(this._getLocalizedLabels("copyAlert")) : this._getDocument().execCommand(action, false, undefined);
                    this.selectRange(this._getRange());
                    break;
                case "paste":
                    (!this._isIE()) ? this._openAlert(this._getLocalizedLabels("pasteAlert")) : this._getDocument().execCommand(action, false, undefined);
                    break;
                case "openlink":
                    this._onOpen();
                    break;
                case "createlink":
                    this._renderLinkDialog();
                    (!this._linkDialog) && this._renderLinkDialog();
                    this._hyperLinkManager(false);
                    break;
                case "imageproperties":
                    this._renderImageDialog();
                    (!this._imgDialog) && this._renderImageDialog();
                    this._imageManager();
                    break;
                case "addcolumnleft":
                    _node = this.insertColumn(true, this._currentSelNode);
                    this._updateCursor(_node);
                    break;
                case "addcolumnright":
                    _node = this.insertColumn(false, this._currentSelNode);
                    this._updateCursor(_node);
                    break;
                case "addrowabove":
                    _node = this.insertRow(true, this._currentSelNode);
                    this._updateCursor(_node);
                    break;
                case "addrowbelow":
                    _node = this.insertRow(false, this._currentSelNode);
                    this._updateCursor(_node);
                    break;
                case "deleterow":
                    this.removeRow(this._currentSelNode);
                    break;
                case "deletecolumn":
                    this.removeColumn(this._currentSelNode);
                    break;
                case "deletetable":
                    this.removeTable($(this._currentSelNode).closest('table'));
                    break;
                case "tableproperties":
                    this._renderEditTableDialog();
                    (!this._eTblDialog) && this._renderEditTableDialog()
                    this._eTblManager();
                    this._eTblDialog.ejDialog("open");
                    break;
                case "removelink":
                    this._onUnlink();
                    break;
                case "add to dictionary":
                    var addWord = (this._currentSelNode.innerText).trim();
                    spellObj._currentElement = $("#"+ spellObj._id);
                    spellObj.addToDictionary(addWord);
                    this._ieCursorMaintainance();
                    break;
                case "ignoreall":
                    var errorWord = (this._currentSelNode.innerText).trim();
                    var result = spellObj.ignoreAll(errorWord, this.getHtml()); 
                    this.setHtml(result.resultHTML);
                    this._ieCursorMaintainance();
                    break;
                default:
                    if(!ej.isNullOrUndefined(spellObj)){
                    var replaceItem = document.createTextNode(e.text);
                    this._currentSelNode.parentNode.insertBefore(replaceItem, this._currentSelNode);
                    $(this._currentSelNode).remove();
                    }
            }
            this._trigger("contextMenuClick", { event: e });
            this._onChange();
        },
        _updateCursor: function (node, rangeData) {
            if (!this._isIE8()) {
                var _range = this._getDocument().createRange(), _currentRange = this._getRange();
                if (node)
                    this._setRange(node, _currentRange, true);
                else if (rangeData) {
                    _range.setStart(rangeData.startContainer, rangeData.startOffset);
                    _range.setEnd(rangeData.endContainer, rangeData.endOffset);
                    this.selectRange(_range);
                }
                else {
                    _range.setStart(_currentRange.startContainer, _currentRange.startOffset);
                    _range.setEnd(_currentRange.startContainer, _currentRange.startOffset);
                    this.selectRange(_range);
                }
            }
        },
        _loadRules: function () {
            var rteObj= this.element.data('ejRTE');
            jQuery.validator.addMethod("contentRequired", function (value, element) {
                return $.trim(rteObj._getText());
            }, "Please specify the value.");
            jQuery.validator.addMethod("maxWordCount", function (value, element, params) {
                return $.trim(rteObj._getText()).split(/\W+/).length <= params;
            }, "Please enter the content with in max word count.");
            jQuery.validator.addMethod("minWordCount", function (value, element, params) {
                return $.trim(rteObj._getText()).split(/\W+/).length >= params;
            }, "Please enter the content with min word count.");
            jQuery.validator.addMethod("minCharCount", function (value, element, params) {
                return rteObj._getText().length >= params;
            }, "Please enter the content with min length.");
            jQuery.validator.addMethod("maxCharCount", function (value, element, params) {
                return rteObj._getText().length <= params;
            }, "Please enter the content with in  max length.");
            this._customRules = { "required": "contentRequired", "maxWordCount": "maxWordCount", "minWordCount": "minWordCount", "maxlength": "maxCharCount", "minlength": "minCharCount", "equalTo": "equalTo" };
        },
        _initValidator: function () {
            this._loadRules();
            (!this.element.closest("form").data("validator")) && this.element.closest("form").validate();
        },
        _getRuleData: function (rule, data) {
            var ruleData = null;
            switch (rule) {
                case "contentRequired":
                    ruleData = { 'contentRequired': data };
                    break;
                case "minCharCount":
                    ruleData = { 'minCharCount': data };
                    break;
                case "maxCharCount":
                    ruleData = { 'maxCharCount': data };
                    break;
                case "maxWordCount":
                    ruleData = { 'maxWordCount': data };
                    break;
                case "minWordCount":
                    ruleData = { 'minWordCount': data };
                    break;
                case "equalTo":
                    ruleData = { 'equalTo': data };
                    break;
            }
            return ruleData;
        },
        _setValidation: function () {
            if (this.element.closest("form").length != 0) {
                var validator = this.element.closest("form").validate(), rule, ruleVal, name = this.element.attr("name");
                validator.settings.messages[name] = {};
                for (var ruleName in this.model.validationRules) {
                    var message = null;
                    if (!ej.isNullOrUndefined(this.model.validationRules[ruleName]) && this._customRules[ruleName]) {
                        rule = this._customRules[ruleName], ruleVal = this.model.validationRules[ruleName];
                        this.element.rules("add", this._getRuleData(rule, ruleVal));
                        if (!ej.isNullOrUndefined(this.model.validationRules["messages"] && this.model.validationRules["messages"][rule]))
                            message = this.model.validationRules["messages"][rule];
                        else {
                            validator.settings.messages[name][rule] = $.validator.messages[rule];
                            for (var msgName in this.model.validationMessage)
                                ruleName == msgName ? (message = this.model.validationMessage[ruleName]) : "";
                        }
                        validator.settings.messages[name][rule] = message != null ? message : $.validator.messages[rule];
                    }
                }
            }
        },
        _addAttr: function (htmlAttr) {
            if (htmlAttr != null) {
                var proxy = this;
                $.map(htmlAttr, function (value, key) {
                    if (key == "class") proxy._rteWapper.addClass(value);
                    else if (key == "name") proxy.element.attr(key, value);
                    else if (key == "required") proxy.element.attr(key, value);
                    else if (key == "disabled" && value == "disabled") proxy.disable();
                    else if (key == "readOnly" && value == "readOnly") proxy._enableEdit(false);
                    else proxy._rteWapper.attr(key, value);
                });
            }
        },
        _addCssToIframe: function (value) {
            var substr = $.isArray(value) ? value : value.split(',');
            for (var i = 0; i < substr.length; i++) {
                var linkTag = document.createElement("link");
                linkTag.href = substr[i];
                linkTag.rel = "stylesheet";
                linkTag.type = "text/css";
                this._rteIframe.contents().find("head").append(linkTag);
            }
        },
        _disabled: function (value) {
            value != true ? this.disable() : this.enable();
        },

        _destroy: function () {
            this.element.insertBefore(this._rteWapper);
            !ej.isNullOrUndefined(this._tooltip) && $(this._rteFooter).ejTooltip("destroy");
            !ej.isNullOrUndefined(this._formatDDL) && this._formatDDL.ejDropDownList("destroy");
            !ej.isNullOrUndefined(this._fontStyleDDL) && this._fontStyleDDL.ejDropDownList("destroy");
            !ej.isNullOrUndefined(this._fontSizeDDL) && this._fontSizeDDL.ejDropDownList("destroy");
            !ej.isNullOrUndefined(this._fontColorSplit) && this._fontColorSplit.ejSplitButton("destroy");
            !ej.isNullOrUndefined(this._bgColorSplit) && this._bgColorSplit.ejSplitButton("destroy");
            !ej.isNullOrUndefined(this._unOrderSplit) && this._unOrderSplit.ejSplitButton("destroy");
            !ej.isNullOrUndefined(this._orderSplit) && this._orderSplit.ejSplitButton("destroy");
            if (!ej.isNullOrUndefined(this._customTableDialog)) {
                !ej.isNullOrUndefined(this._customTableDialog.find(".e-rte-ddlAlignment")) && this._customTableDialog.find(".e-rte-ddlAlignment").ejDropDownList("destroy");
                !ej.isNullOrUndefined(this._customTableDialog.find(".e-rte-txtBorder")) && this._customTableDialog.find(".e-rte-txtBorder").ejDropDownList("destroy");
            }
            !ej.isNullOrUndefined(this._linkDialog) && $(this._linkDialog).closest("div.e-rte.e-dialog-wrap").remove();
            if (!ej.isNullOrUndefined(this._imgDialog)) {
                this._imgDialog.find(".e-rte-imgBorderStyle").ejDropDownList("destroy");
                $(this._imgDialog).closest("div.e-rte.e-dialog-wrap").remove();
            }
            !ej.isNullOrUndefined(this._videoDialog) && $(this._videoDialog).closest("div.e-rte.e-dialog-wrap").remove();
            !ej.isNullOrUndefined(this._createTable) && $(this._createTable).closest("div.e-rte.e-dialog-wrap").remove();
            !ej.isNullOrUndefined(this._sourceDialog) && $(this._sourceDialog).closest("div.e-dialog-wrap").remove();
		    !ej.isNullOrUndefined(this._customColor )&& $(this._customColor ).closest("div.e-dialog-wrap").remove();
            !ej.isNullOrUndefined(this._customTableDialog) && $(this._customTableDialog).closest("div.e-rte.e-dialog-wrap").remove();
			!ej.isNullOrUndefined(this._customTableDialog) && $(this._customTableDialog).closest("div.e-rte.e-dialog-wrap").remove();
            !ej.isNullOrUndefined(this._alertWindow) && $(this._alertWindow).closest("div.e-rte.e-dialog-wrap").remove();
            if (!ej.isNullOrUndefined(this._eTblDialog)) {
                this._eTblDialog.find(".e-rte-dropdown").ejDropDownList("destroy");
                $(this._eTblDialog).closest("div.e-rte.e-dialog-wrap").remove();
            }
            !ej.isNullOrUndefined(this._explorerObj) && this._explorerObj.destroy();
            !ej.isNullOrUndefined(this._imgPicker) && this._imgPicker.destroy();
			!ej.isNullOrUndefined(this._tblborderPicker) && this._tblborderPicker.destroy();
            !ej.isNullOrUndefined(this._fileDialog) && $(this._fileDialog).closest("div.e-rte.e-dialog-wrap").remove();
			this._textMenuObj && this._textMenuObj.destroy();
            this._toolBarObj && this._toolBarObj.destroy();
            this._rteWapper.remove();
			if($("#"+this._rteId+"customcolor_popup").length>0)
			$("#"+this._rteId+"customcolor_popup").remove();
			if($("#"+this._rteId+"customcolor_Presets").length>0)
			$("#"+this._rteId+"customcolor_Presets").remove();
            this.element.show();
            this.element.focus();
            this._createTable = null;
            this._unwireEvents();
        },

        _initialize: function () {
            this._toolsList = this.model.toolsList;
            this._rteId = this.element[0].id;
            this._rteId = this._rteId ? this._rteId : "";
            this._backupArray = new Array();
            this._undoRedoPosition = 0;
            this._fontColor = "#000000";
            this._bgColor = "#ffffff";
            this._imgWidth = 0;
            this._imgHeight = 0;
            this._videoWidth = 0;
            this._videoHeight = 0;
            this._keypressFlag = true;
            this._styleItems = ej.isNullOrUndefined(this.model.tools["style"]) ? [] : this.model.tools["style"];
            this._alignItems = ej.isNullOrUndefined(this.model.tools["alignment"]) ? [] : this.model.tools["alignment"];
            this._listItems = ej.isNullOrUndefined(this.model.tools["lists"]) ? [] : this.model.tools["lists"];
            this._scriptsItems = ej.isNullOrUndefined(this.model.tools["effects"]) ? [] : this.model.tools["effects"];
            this._contextMenu = ["cut", "copy", "paste", "|", "insertTable", ["addColumnLeft", "addColumnRight", "addRowAbove", "addRowBelow"], "|", "deleteTables", ["deleteRow", "deleteColumn", "deleteTable"], "|", "tableProperties", "|", "createLink", "openLink", "removeLink", "imageProperties"];
            this._contextType = { text: ["cut", "copy", "paste", "createLink"], image: ["cut", "copy", "paste", "imageProperties"], hyperlink: ["cut", "copy", "paste", "createLink", "openLink", "removeLink"], table: ["cut", "copy", "paste", "insertTable", "deleteTables", "tableProperties", "createLink"], table_hyper: ["cut", "copy", "paste", "insertTable", "deleteTables", "tableProperties", "createLink", "openLink", "removeLink"] };
            return this;
        },

        _render: function () {
            this._renderWrapper()
            ._checkNameAttr();
            if (this.model.showToolbar) {
                this._renderToolBar();
            }
            this._trigger("preRender", this.element);
            this._renderEditArea();
            this.model.showFooter && this._renderFooter();
            this._setIframeHeight();
            this._rteWidth = this.model.width;
            this._rteHeight = this.model.height;
            this._renderAlertDialog();
            this._roundedCorner(this.model.showRoundedCorner);
        },

        _initContextMenu: function () {
            var menuOptions = [], subMenuOptions = [];
            for (var i = 0; i < this._contextMenu.length; i++) {
                if (this._contextMenu[i] != "|") {
                    if (typeof this._contextMenu[i] === "object") {
                        var temp = i + 1;
                        for (var j = 0; j < this._contextMenu[i].length; j++) {
                            if (this._contextMenu[i][j] != "|") {
                                menuOptions.push({ id: this._contextMenu[i][j], parentId: this._contextMenu[i - 1], text: this._getLocalizedLabels(this._contextMenu[i][j]), sprite: "e-rte-toolbar-icon " + this._contextMenu[i][j] + " " + this._rteIconsList[this._contextMenu[i][j]], htmlAttr: (this._contextMenu[i + 1][j + 1] == "|" ? { "class": "e-rte-separator", "id": this._contextMenu[i][j] } : { "id": this._contextMenu[i][j] }) });
                            }
                        }
                    } else {
                        menuOptions.push({ id: this._contextMenu[i], parentId: null, text: this._getLocalizedLabels(this._contextMenu[i]), sprite: "e-rte-toolbar-icon " + this._contextMenu[i] + " " + this._rteIconsList[this._contextMenu[i]], htmlAttr: (this._contextMenu[i + 1] == "|" ? { "class": "e-rte-separator", "id": this._contextMenu[i] } : { "id": this._contextMenu[i] }) });
                    }
                }
            }
            return menuOptions;
        },
        _createContextMenu: function () {
            var ContextMenutag = ej.buildTag('ul.e-rte-context-menu #' + this._id + "_contextmenu");
            var proxy = this;
            ContextMenutag.ejMenu({
                menuType: ej.MenuType.ContextMenu,
                enableSeparator: true,
                width: "auto",
                enableRTL: this.model.enableRTL,
                cssClass: this.model.cssClass,
                contextMenuTarget: this._getDocument(),
                click: $.proxy(this._contextMenuClick, this),
                fields: { dataSource: this._initContextMenu(), id: "id", parentId: "parentId", text: "text", htmlAttribute: "htmlAttr", spriteCssClass: "sprite" },
                beforeOpen: function (args) { 
                this._spellObj = proxy._rteIframe.data("ejSpellCheck");
                      if($(args.target).hasClass("errorspan") && !ej.isNullOrUndefined(this._spellObj)){  
                    this._spellObj._selectedTarget=args.target;
                    this._spellObj._selectedValue=args.target.innerText;
                    var filterValue = this._spellObj._filterSuggestions(this._spellObj, this._spellObj._selectedValue);
                    if (filterValue.length > 0) { 
                        this._spellObj._suggestedWords = filterValue[0].SuggestedWords;
                        } else {
                        this._spellObj.getSuggestionWords(args.target.innerText); 
                        }   
                        proxy._spellcheckContextMenu(args, this._spellObj);          
                    }
                    else{
                        var customMenus = $("#" + proxy._textMenuObj._id).find("span.e-spellsuggestions"); 
                        if (customMenus.length > 0 )
                            $("#" + proxy._textMenuObj._id).find("span.e-spellsuggestions").parent().parent().remove();
                      }
                    (proxy._isIE() && proxy._ieSelectionRange) && proxy.selectRange(proxy._ieSelectionRange);
                    proxy.model.enabled ? this.enable() : this.disable();
                    proxy._filterMenuItems(proxy._contextMenuEventArgs = args.events);
                    $(this.element).parent().hide();
                    $("#" + proxy._textMenuObj._id).find("span.e-spellsuggestions").parents("li").css('display', 'block');
                },
                open: function () {
                    this.element.attr("style", ("visibility:visible;width:auto;display:block;left:0px;top:0px;"));
                    this.element.parent().show();
                    proxy._contextmenuPosition(proxy._contextMenuEventArgs);
                    this._showAnimation(this.element, this._showAnim);
                    $(this.element).focus();
                },
                close: function () {
                    $(proxy._getDocument()).find("body").removeClass("e-cursor");
                }
            });
            var menuObj = ContextMenutag.data("ejMenu");
			 if (menuObj._isContextMenuOpen) {
                if (document.addEventListener)
				 document.addEventListener("scroll",function (event) { menuObj.hideContextMenu(event); }, true);
			 else  
              document.attachEvent("scroll",function (event) { menuObj.hideContextMenu(event); }, true); 
             }
            return ContextMenutag;
        },
         _spellcheckContextMenu: function(args, spellcheck){
            var proxy= this;   
            var target = args.events.target;  
            var customMenus = $("#" + proxy._textMenuObj._id).find("span.e-spellsuggestions"); 
            if (customMenus.length > 0 )
                $("#" + proxy._textMenuObj._id).find("span.e-spellsuggestions").parent().parent().remove();
            var suggestionList= [this._getLocalizedLabels("addtodictionary"), this._getLocalizedLabels("ignoreall")].concat(spellcheck._suggestedWords);   
                for (var k = 0; k < suggestionList.length; k++) {
                    proxy.insertMenuOption({
                    newItem: suggestionList[k],
                    targetItem: this._getLocalizedLabels("paste"),
                    insertType: ("insertAfter"),
                    menuType: { text: true, image: false, hyperlink: true, table: false },
                    spriteCssClass: "e-spellsuggestions"  
                });   
            } 
        },
        _showHideContextMenu: function () {
            if (this.model.allowEditing && this.model.enabled && this.model.showContextMenu && this._getDocument()) {
                this._textMenuObj = this._createContextMenu().data("ejMenu");
                //below codes unbinds the contextMenu taphold event.
                this._textMenuObj["_off"]($(this._textMenuObj.model.contextMenuTarget), "mouseup taphold", this._textMenuObj._ContextMenuHandler);
                this._textMenuObj["_on"]($(this._textMenuObj.model.contextMenuTarget), "mouseup", this._textMenuObj._ContextMenuHandler);
            }
            else
                (this._textMenuObj) && this._textMenuObj.destroy();
        },
        _checkNameAttr: function () {
            if (this.model.name)
                this.element.attr({ "name": this.model.name });
            else if (ej.isNullOrUndefined(this.element.attr("name")))
                this.element.attr({ "name": this.element[0].id });
        },
        _enableEdit: function (args) {
            this.model.allowEditing = args;
            if (args) {
                this._wireEvents();
                this.model.showToolbar && this._toolBarItems.ejToolbar("option", "click", this._toolBarClick);
                this._rteIframe.contents().find("body").attr("contenteditable", true);
            }
            else {
                this._unwireEvents();
                this.model.showToolbar && this._toolBarItems.ejToolbar("option", "click", null);
                this._rteIframe.contents().find("body").attr("contenteditable", false);
            }
            this._showHideContextMenu();
            this._disableResizeObj(args);
        },
        _disableResizeObj: function (value) {
            if (value) {
                if (!this.model.enableRTL) this._on($(this._getDocument()).find("table.e-rte-table"), "mouseover", this._tableMouseOver);
            }
            else {
                if (ej.browserInfo().name === "mozilla") this._getDocument().designMode = "off";
                this._off($(this._getDocument()).find("table.e-rte-table"), "mouseover", this._tableMouseOver);
                this._removeResizeObject();
            }
        },
        _changeSkin: function (value) {
            this._rteWapper.removeClass(this.model.cssClass).addClass(value);
            this._subControlsSetModel("cssClass", value);
        },

        _updateIframeSkin: function (htmlAttr) {
            try {
                var target = this._rteIframe.contents().find("body");
                if (htmlAttr) {
                    proxy = this;
                    $.map(htmlAttr, function (value, key) {
                        if (key == "class") target.addClass(value);
                        else if (key == "required") target.attr(key, value);
                        else if (key == "disabled" && value == "disabled") proxy.disable();
                        else if (key == "readOnly" && value == "readOnly") proxy._enableEdit(false);
                        else target.attr(key, value);
                    });
                }
            }
            catch (err) {
                return false;
            }
        },


        _renderWrapper: function () {
            if (this.model.minHeight.toString().indexOf("%") > 0)
                this.model.minHeight = (parseInt(this.model.height) * parseInt(this.model.minHeight)) / 100;
            if (!ej.isNullOrUndefined(this.model.maxHeight) && (this.model.maxHeight.toString().indexOf("%") > 0))
                this.model.maxHeight = parseInt(this.model.height) + (parseInt(this.model.height) * parseInt(this.model.maxHeight)) / 100;
            if (this.model.minWidth.toString().indexOf("%") > 0)
                this.model.minWidth = (parseInt(this.model.width) * parseInt(this.model.minWidth)) / 100;
            if (!ej.isNullOrUndefined(this.model.maxWidth) && (this.model.maxWidth.toString().indexOf("%") > 0))
                this.model.maxWidth = parseInt(this.model.width) + (parseInt(this.model.width) * parseInt(this.model.maxWidth)) / 100;
            this._rteWapper = ej.buildTag("div.e-rte e-rte-wrapper e-widget e-box " + this.model.cssClass + "#" + this._rteId + "_wrapper", "", {}, { role: "presentation" }).insertBefore(this.element);
            this._rteWapper.css("height", this.model.height).css("width", this.model.width).css("min-height", this.model.minHeight).css("min-width", this.model.minWidth).css("max-height", this.model.maxHeight).css("max-width", this.model.maxWidth);
            this._rteWapper.append(this.element.hide());
            return this;
        },

        _renderToolBar: function () {
            this._rteToolbar = ej.buildTag("div.e-rte-toolbar #" + this._rteId + "_tools").insertAfter(this.element);
            this._crateToolbarTemplate()
            ._initToolBarItems()
            ._renderToolBarList();
            this._renderToolBarItems();
            if (ej.browserInfo().name === "msie" && ej.browserInfo().version === "8.0") this._toolBarObj.disableItemByID(this._rteId + "_" + "video");
        },
        _renderToolBarList: function () {
            var model = {};
            model.click = this.model.allowEditing ? this._toolBarClick : null;
            model.cssClass = this.model.cssClass;
            model.enableRTL = this.model.enableRTL;
            model.enableSeparator = true;
			if(this.model.toolbarOverflowMode=="inline")
			model.responsiveType="inline";
            model.isResponsive = this.model.isResponsive;
            model.height = model.isResponsive ? "" : "auto";
            model.showRoundedCorner = this.model.showRoundedCorner;
            model.tooltipSettings = this.model.tooltipSettings;
            model.create = function () {
                var ddl = $(this.element).find(".e-ddl.e-widget .e-dropdownlist"), spbtn = $(this.element).find(".e-split.e-widget .e-splitbutton");
                ddl.length && ddl.ejDropDownList({ height: "30px" });
                spbtn.length && spbtn.ejSplitButton({ height: '30px' });
            }
            this._toolBarItems.ejToolbar(model);
            this._disableTabkeyNavigation(this._toolBarItems)._disableTabkeyNavigation(this._toolBarItems.find("[tabindex],.e-split-btn"));
            this._toolBarObj = this._toolBarItems.ejToolbar("instance");
             if(this.model.toolbarOverflowMode=="inline"){
            this._rteinline = this._toolBarObj._spantag;
            this._on(this._rteinline, "click", this._rteinlineClick);
             }
            this._on($(document), "mouseup touchend", this._zoomUp);
            this._on($(this._toolBarObj.itemsContainer).find(".e-rteItem-zoomIn , .e-rteItem-zoomOut"), "mousedown touchstart", this._zoomDown);
        },
        _disableTabkeyNavigation: function (elements) {
            $(elements).attr("tabindex", '-1');
            return this;
        },
        _crateToolbarTemplate: function () {
            this._toolBarItems = ej.buildTag("div#" + this._rteId + "_toolbar").appendTo(this._rteToolbar).height(30);
            for (var i = 0; i < this._toolsList.length; i++) {
                var items = this._toolsList[i];
                if (!ej.isNullOrUndefined(this.model.tools[items])) {
                    if (items == "customTools")
                        !ej.isNullOrUndefined(this.model.tools[items]) && this._customTools(this.model.tools[items]);
                    else
                        this.model.tools[items].length > 0 && this._createToolsItems(this.model.tools[items], items);
                }
            }
            if (this.model.fileBrowser.filePath != "") {
                var ulTag = ej.buildTag("ul#" + this._rteId + "-file-exporer"), liTag;
                liTag = $("<li id='" + this._rteId + "_fileBrowser" + "' class='e-rte-explorer e-rteItem-fileBrowser' title='" + this._getLocalizedLabels("fileBrowser") + "' ><div class='e-rte-toolbar-icon fileBrowser e-fileBrowser' unselectable = 'on'></div></li>");
                liTag.appendTo(ulTag);
                ulTag.appendTo(this._toolBarItems);
            }
            return this;
        },

        _createToolsItems: function (items, itemName) {
            var ulTag = ej.buildTag("ul#" + (this._rteId + "_" + itemName)), liTag;
            (itemName == "font") && ulTag.addClass("e-rte-fontgroup");
            (itemName == "formatStyle") && ulTag.addClass("e-rte-format");
            (itemName == "lists") && ulTag.addClass("e-rte-lists");
            for (var i = 0; i < items.length; i++) {
                liTag = $("<li id='" + (this._rteId + "_" + items[i].replace(/ /g, '')) + "' class='e-rteItem-" + items[i] + "' ><div class='e-rte-toolbar-icon " + items[i] + " " + this._rteIconsList[items[i]] + "' unselectable = 'on'></div></li>");
                if (items[i] === "video" && ej.browserInfo().name === "msie" && ej.browserInfo().version === "8.0") liTag.attr('title', this._getLocalizedLabels("html5Support"));
                else liTag.attr('title', this._getLocalizedLabels(items[i].replace(/ /g, '')));
                if (items[i] === "fullScreen") liTag.attr('data-content', this._getLocalizedLabels("maximize")).children(".e-rte-toolbar-icon").addClass(this._rteIconsList["maximize"]);
                else if (items[i] === "findAndReplace")
                    liTag.attr('title', this._getLocalizedLabels("FindAndReplace"));
                liTag.appendTo(ulTag);
            }
            ulTag.appendTo(this._toolBarItems);
            if (itemName == "font" && !this.model.showFontOption)
                ulTag.hide();
        },

        _customTools: function (toolbarItems) {
            for (var item = 0; item < toolbarItems.length; item++) {
                var ulTag = ej.buildTag("ul"), liTag;
                liTag = $("<li id='" + toolbarItems[item].name + "' title='" + toolbarItems[item].tooltip + "' ><div class='" + (ej.isNullOrUndefined(toolbarItems[item].css) ? "" : toolbarItems[item].css) + "'>" + (ej.isNullOrUndefined(toolbarItems[item].text) ? "" : toolbarItems[item].text) + "</div></li>");
                var fn = toolbarItems[item].action;
                if (typeof fn === "string") {
                    fn = ej.util.getObject(fn, window);
                }
                !ej.isNullOrUndefined(toolbarItems[item].action) && this._on(liTag, "click", fn);
                $(toolbarItems[item].template).appendTo(liTag.find("div"));
                liTag.appendTo(ulTag);
                ulTag.appendTo(this._toolBarItems);
            }
        },

        _initToolBarItems: function () {
            this._rteToolbar.find("li.e-rteItem-format").length > 0 && this._renderFormat(); 
            this._rteToolbar.find("li.e-rteItem-createTable").length > 0 && this._renderTableDialog();
            this._rteToolbar.find("li.e-rteItem-fontName").length > 0 && this._renderFontStyle();
            this._rteToolbar.find("li.e-rteItem-fontSize").length > 0 && this._renderFontSize();
            this._rteToolbar.find("li.e-rteItem-fontColor").length > 0 && this._renderFontColor();
            this._rteToolbar.find("li.e-rteItem-backgroundColor").length > 0 && this._renderBGColor();   
            this._rteToolbar.find("li.e-rteItem-unorderedList").length > 0 && this._renderUnOrderList();
            this._rteToolbar.find("li.e-rteItem-orderedList").length > 0 && this._renderOrderList();
            this._rteToolbar.find("li.e-rteItem-import").length > 0 && this._renderimport();
            !this.model.showClearAll && this._rteToolbar.find("li.e-rteItem-clearAll").hide();
            return this;
        },
        _renderToolBarItems: function () {
            this._toolBarObj.disableItemByID(this._rteId + "_" + "undo");
            this._toolBarObj.disableItemByID(this._rteId + "_" + "redo");
            // Default action when render the RTE
            if (!this.model.enableRTL)
                this._toolBarObj.selectItemByID(this._rteId + "_" + "justifyLeft");
            else
                this._toolBarObj.selectItemByID(this._rteId + "_" + "justifyRight");
            //Hide the editable table icons
            var items = this._rteToolbar.find("li.e-rteItem-addColumnLeft,li.e-rteItem-addColumnRight,li.e-rteItem-addRowAbove,li.e-rteItem-addRowBelow,li.e-rteItem-deleteRow,li.e-rteItem-deleteColumn,li.e-rteItem-deleteTable");
            if (this.model.isResponsive && items.length == 0) this._toolBarObj._liTemplte.find("li.e-rteItem-addColumnLeft,li.e-rteItem-addColumnRight,li.e-rteItem-addRowAbove,li.e-rteItem-addRowBelow,li.e-rteItem-deleteRow,li.e-rteItem-deleteColumn,li.e-rteItem-deleteTable").hide();
            else this._rteToolbar.find("li.e-rteItem-addColumnLeft,li.e-rteItem-addColumnRight,li.e-rteItem-addRowAbove,li.e-rteItem-addRowBelow,li.e-rteItem-deleteRow,li.e-rteItem-deleteColumn,li.e-rteItem-deleteTable").hide();
            return this;
        },

        _renderEditArea: function () {
            this._rteEditor = ej.buildTag("div.editarea #" + this._rteId + "_editor").appendTo(this._rteWapper);
            this._rteIframe = ej.buildTag("iframe.content-iframe #" + this._rteId + "_Iframe", "", {}).appendTo(this._rteEditor);
            this._rteIframe.css({ "border": "0" });
			this._setIFrames();
            if (navigator.userAgent.match(/(iPhone|iPod|iPad)/i) != null){
                this._rteEditor.addClass('e-ipadscroll');
				this._rteEditor.css("height", (this._rteWapper.outerHeight()- (this.model.showToolbar?this._rteToolbar.height():0)));
            }
        },

        _xhtmlTagValidation: function () {
            if (this.value() != null) {
                var htmlText = this.value();
                htmlText = htmlText.replace(/\r/gi, " ").replace(/\n/gi, "<br/> ").replace(/\r\n/gi, " ").replace(/( )+/gi, " ").replace(/&nbsp;/gi, " ").replace(/&bull;/gi, "*").replace(/&ltquo;/gi, "<").replace(/&rtquo;/gi, ">").replace(/&trze;/gi, "(tm)").replace(/&copy;/gi, "(c)").replace(/&reg;/gi, "(r)");
                if (htmlText.indexOf("<body>") != -1) {
                    var indexBody = htmlText.indexOf("<body>");
                    var delBody = htmlText.slice(0, indexBody + 6);
                    htmlText = htmlText.replace(delBody, "").replace("</body></html>", "");
                }
                htmlText = htmlText.replace(/<br>/g, "<br/>").replace(/<hr>/g, "<hr/>");
                htmlText = this._imageXhtml(htmlText);
                htmlText = this._styleXhtml(htmlText);
                htmlText = this._startXhtml(htmlText);
                if (htmlText.indexOf("alt=") != -1) {
                    var imageTag = /alt=\"(.*?)\"/ig;
                    var altTemp = new Array();
                    var tempAlt;
                    var j = 0;
                    while ((tempAlt = imageTag.exec(htmlText)) != null) {
                        altTemp[j] = tempAlt[0];
                        j++;
                    }
                    for (var i = 0; i < altTemp.length; i++) {
                        htmlText = htmlText.replace(altTemp[i], "alt=\"\"");
                    }
                }
                if (!ej.isNullOrUndefined(this._fontXhtml(htmlText))) {
                    htmlText = this._fontXhtml(htmlText);
                    if (htmlText.indexOf("ol") != -1) {
                        var olStyle = /<ol(.*)<\/ol>/ig;
                        var tempOl;
                        var k = 0;
                        var olTemp = new Array();
                        while ((tempOl = olStyle.exec(htmlText)) !== null) {
                            olTemp[k] = tempOl[0].toString();
                            k++;
                        }
                        var olEx = new Array();
                        for (var f = 0; f < olTemp.length; f++) {
                            olEx[f] = olTemp[f];
                        }
                        for (var i = 0; i < olTemp.length; i++) {
                            olTemp[i] = olTemp[i].replace(/<br\/>/gi, "");
                        }
                        for (var i = 0; i < olTemp.length; i++) {
                            htmlText = htmlText.replace(olEx[i], olTemp[i]);
                        }
                    }
                    htmlText = htmlText.replace(/<o:p>/gi, "").replace(/<\/o:p>/gi, "");
                }
                this.value(htmlText);
            }
        },

        _setIFrames: function () {
            var rteContent = null;
            if ((this.value() != null && this.value() != "")) rteContent = this.value().replace(/'/g, "\"");
            if (rteContent == null) this.value($.trim(this.element[0].value));
            var isIE8 = ej.browserInfo().name == 'msie' && parseInt(ej.browserInfo().version) == 8;
            var _htmlText = ("<!DOCTYPE html> <html> <head> <meta charset='utf-8' /> <style>html, body{height: 100%;margin: 0;}body.e-cursor{cursor:default} span.e-selected-node	{background-color: #939393;color: white;}span.e-selected-node.e-highlight{background-color: #1d9dd8;}body{font-family:Times New Roman,Times,serif;color:#5C5C5C;word-wrap:break-word;padding: 8px;box-sizing: border-box;}.e-rte-table caption{border: 1px solid;border-bottom:none}td{word-wrap:break-word;word-break:break-all;}.e-rteColumnResizer{position: absolute;bottom:0;overflow: visible;cursor: col-resize;background-repeat:repeat;background-color:transparent}.e-rteRowResizer{position: absolute;bottom:0;overflow: visible;margin-left: -4px;cursor: row-resize;background-repeat:repeat;background-color:transparent} span.e-rte-imageboxmark{width:5px;height:5px;position:absolute;display:block;background:#fff;border:1px solid #000;}</style></head><body spellcheck='false' autocorrect='off' contenteditable=" + (this.model.allowEditing ? 'true' : 'false') + ">" + ((this.value() != "" && this.value() != "<br>" ) ? $.trim(this.value()) : "<p><span>&#65279;</span></p>" ) + "</body></html>");
            this._rteIframe.css({ "width": "100%" });
            if (this.element[0].value == "<div></div>" || this.element[0].value == "")
                this.element[0].innerHTML = this.value();

            this._setContent(_htmlText);
            if (this._isIE8()) this.value(this._getDocument().body.innerHTML);
			var _tableEle = $(this._getDocument()).find("table");       
            if (!this.model.enableRTL && _tableEle.length > 0 ) this._on(_tableEle, "mouseover", this._tableMouseOver);
            if (this.model.enableXHTML) this._updateValue();
            this._setAutoHeight();
            if (!ej.isNullOrUndefined(this.model.undoStackLimit) || this.model.undoStackLimit !== "" || this.model.undoStackLimit > 0)
                this._backupArray[0] = this.getHtml();
        },


        _setIframeHeight: function () {
            var _height = (!ej.isNullOrUndefined(this._rteToolbar) && this._rteToolbar.is(':visible') ? this._rteToolbar.outerHeight() : 6) + (!ej.isNullOrUndefined(this._rteFooter) && this._rteFooter.is(':visible') ? this._rteFooter.outerHeight() : 0);
            this._rteIframe.css("height", (_height == 0 ? this.model.height : ((this._rteWapper.outerHeight() - _height) - (parseInt(this._rteEditor.css("padding-top")) + parseInt($(".e-rte-wrapper").css("border-bottom-width")) + parseInt(this.model.showFooter ? $(".e-rte-footer").css("margin-top") : 0)))));
        },

        // Footer Div render 
        _renderFooter: function () {
            var options = this.model;
            this._rteFooter = ej.buildTag("div.e-rte-footer #" + this._rteId + "_footer").appendTo(this._rteWapper);
            var _leftPan = ej.buildTag("div.e-rte-footer-left");
            this._htmlSource = ej.buildTag("div.e-rte-icons e-rte-footeritems e-rte-footericon e-rte-source " + this._rteIconsList["rteSource"], "", {}, { title: this._getLocalizedLabels("viewHtml") }).appendTo(_leftPan);
            this._htmlInfo = ej.buildTag("div.e-rte-htmltaginfo e-rte-footeritems").appendTo(_leftPan);
            _leftPan.appendTo(this._rteFooter);
            var _rightPan = ej.buildTag("div.e-rte-footer-right");
            this._wordCount = ej.buildTag("div.e-rte-wordcount e-rte-footeritems").appendTo(_rightPan);
            this._charCount = ej.buildTag("div.e-rte-charcount e-rte-footeritems").appendTo(_rightPan);
            this._clearFormat = ej.buildTag("div.e-rte-icons " + this._rteIconsList["clearFormat"] + " e-rte-footericon e-rte-footeritems", "", {}, { title: this._getLocalizedLabels("clearFormat"), "unselectable": "on" }).appendTo(_rightPan);
            this._clearAll = ej.buildTag("div.e-rte-icons clearAll " + this._rteIconsList["clearAll"] + " e-rte-footericon e-rte-footeritems", "", {}, { title: this._getLocalizedLabels("clearAll") }).appendTo(_rightPan);
            this._resize = ej.buildTag("div.e-icon e-rte-resize " + this._rteIconsList["rteResize"] + " e-rte-footeritems").appendTo(_rightPan);
            _rightPan.appendTo(this._rteFooter);
            this._footerEvents("_on");
            !this.model.showHtmlSource && this._htmlSource.hide().removeClass("e-rte-footeritems");
            !this.model.showHtmlTagInfo && this._htmlInfo.hide().removeClass("e-rte-footeritems");
            !this.model.showWordCount && this._wordCount.hide().removeClass("e-rte-footeritems");
            !this.model.showCharCount && this._charCount.hide().removeClass("e-rte-footeritems");
            !this.model.showClearAll && this._clearAll.hide().removeClass("e-rte-footeritems");
            !this.model.showClearFormat && this._clearFormat.hide().removeClass("e-rte-footeritems");
            //if (options.showFooter && this.model.enableRTL) this._rteFooter.addClass("e-rtl");
            if (options.enableResize)
                this._enableResize();
            else
                this._resize.hide().removeClass("e-rte-footeritems");
            this._updateCount();
            if (this.model.showWordCount) this._on(this._wordCount, "click", this._wordCharClick);
            if (this.model.showCharCount) this._on(this._charCount, "click", this._wordCharClick);
            this._renderTooltip(this.model.tooltipSettings);

        },
        _renderTooltip: function (options) {
            var model = $.extend(true, {}, options);
            if (!ej.isNullOrUndefined(model.cssClass))//which holds the css for the tooltip
                model.cssClass = model.cssClass + " e-rteTooltip " + this.model.cssClass;
            else
                model.cssClass = "e-rteTooltip " + this.model.cssClass;
            model.enableRTL = this.model.enableRTL;
            model.showRoundedCorner = this.model.showRoundedCorner;
            model.target = ".e-rte-icons";
            if (this.model.showFooter)
                this._tooltip = $(this._rteFooter).ejTooltip(model).data("ejTooltip");
        },
        _hideTooltip: function () {
            if (!ej.isNullOrUndefined(this._tooltip))
                this._tooltip.hide();
        },
        _footerElement: function (selector, visible) {
            if (this.model.showFooter) {
                var ele = this._rteFooter.find(selector);
                visible ? ele.show().addClass("e-rte-footeritems") : ele.hide().addClass("e-rte-footeritems");
            }
        },
        _wordCharClick: function (e) {
            this._alertWindow.ejDialog("option", { "showHeader": true, "title": "<span style='padding-left:0.4em;'>" + this._getLocalizedLabels("wordCount") + "</span>" });
            this.model.enableRTL && this._alertWindow.find(".e-alert-ok").removeClass("e-rte-alertBtnRTL");
            this._alertWindow.find(".e-rte-button").removeClass("e-fieldseparate").css({ "text-align": "center", "padding-bottom": "1em", "padding-top": "0.5em" });
            this._alertWindow.ejDialog("instance").refresh();
            this._openAlert("<div style='padding-left:0.3em;padding-right:0.3em;'><div style='" + ((this.model.enableRTL) ? 'float:right' : 'float:left') + "'>" + this._getLocalizedLabels("words") + "<p style='margin:0.875em 0em;'>" + this._getLocalizedLabels("charSpace") + "</p><p style='margin:0.875em 0em;'>" + this._getLocalizedLabels("charNoSpace") + "</p></div><div style='" + ((this.model.enableRTL) ? 'float:left;padding-right:2em;' : 'float:right;padding-left:2em;') + "'>"
			+ ($.trim(this._getText()) != "" ? $.trim(this._getText()).split(/\W+/).length : 0) + "<p style='margin:0.875em 0em;'>" + this._getText().length + "</p><p style='margin:0.875em 0em;'>" + this._getText().replace(/\s/g, "").length + "</p></div></div><br/>");
        },
        _updateColorPalette: function () {
            var _fontColor = $("ul#" + this._rteId + "_colorTable");
            var _bgColor = $("ul#" + this._rteId + "_colorBGTable");
            _fontColor.find("div.e-rte-table").remove();
            _fontColor.find("li").append(this._colorTable());
            //Bg Color table Update
            _bgColor.find("div.e-rte-table").remove();
            _bgColor.find("li").append(this._colorTable());
        },
        _enableRTL: function (value) {
            try {
                if (value)
                    this._rteIframe.contents().find("body").css("direction", "rtl");
                else
                    this._rteIframe.contents().find("body").css("direction", "ltr");
            }
            catch (error) { }
            this._subControlsSetModel("enableRTL", value);
            //if (this.model.showFooter && this._rteFooter) this._rteFooter.addClass("e-rtl");
        },
        _roundedCorner: function (value) {
            if (value) this._rteWapper.toggleClass('e-corner-all');
            this._subControlsSetModel("showRoundedCorner", value);
        },
        _subControlsSetModel: function (prop, value) {
            if (!ej.isNullOrUndefined(this._tooltip)) {
                if (prop == "cssClass")
                    $(this._rteFooter).ejTooltip("option", prop, "e-rteTooltip " + value);
                else
                    $(this._rteFooter).ejTooltip("option", prop, value);
            }
            !ej.isNullOrUndefined(this._formatDDL) && this._formatDDL.ejDropDownList("option", prop, value);
            !ej.isNullOrUndefined(this._fontStyleDDL) && this._fontStyleDDL.ejDropDownList("option", prop, value);
            !ej.isNullOrUndefined(this._fontSizeDDL) && this._fontSizeDDL.ejDropDownList("option", prop, value);
            !ej.isNullOrUndefined(this._fontColorSplit) && this._fontColorSplit.ejSplitButton("option", prop, value);
            !ej.isNullOrUndefined(this._bgColorSplit) && this._bgColorSplit.ejSplitButton("option", prop, value);
            if (!ej.isNullOrUndefined(this._toolBarItems)) {
                if ((prop == "showRoundedCorner") && this._toolBarItems.hasClass("e-corner-top"))
                    this._toolBarItems.removeClass("e-corner-top").addClass("e-corner-all");
                this._toolBarItems.ejToolbar("option", prop, value);
                if ((prop == "showRoundedCorner") && this._toolBarItems.hasClass("e-corner-all"))
                    this._toolBarItems.removeClass("e-corner-all").addClass("e-corner-top");
            }
            if (!ej.isNullOrUndefined(this._linkDialog)) {
                this._linkDialog.ejDialog("option", prop, value);
                this._linkDialog.find(".e-rte-btn").ejButton("option", prop, value);
                this._chkTarget.ejCheckBox("option", prop, value);
                if (prop == "showRoundedCorner") (value == true) ? this._linkDialog.find(".e-inputtext").addClass('e-corner-all') : this._linkDialog.find(".e-inputtext").removeClass('e-corner-all');
            }
            if (!ej.isNullOrUndefined(this._imgDialog)) {
                this._imgDialog.ejDialog("option", prop, value);
                this._imgDialog.find("div.e-rte-imageTab").ejTab("option", prop, value);
                this._imgDialog.find(".e-rte-imgBorderPx").ejNumericTextbox("option", prop, value);
                this._imgDialog.find(".e-rte-imgBorderStyle").ejDropDownList("option", prop, value);
                this._chkImgDimensions.ejCheckBox("option", prop, value);
                this._dialogchkTarget.ejCheckBox("option", prop, value);
                this._imgDialog.find(".e-rte-btn").ejButton("option", prop, value);
                if (prop == "showRoundedCorner") (value == true) ? this._imgDialog.find(".e-inputtext").addClass('e-corner-all') : this._imgDialog.find(".e-inputtext").removeClass('e-corner-all');
            }
            if (!ej.isNullOrUndefined(this._videoDialog)) {
                this._videoDialog.ejDialog("option", prop, value);
                this._videoDialog.find(".e-rte-btn").ejButton("option", prop, value);
                this._chkvideoDimensions.ejCheckBox("option", prop, value);
                if (prop == "showRoundedCorner") (value == true) ? this._videoDialog.find(".e-inputtext").addClass('e-corner-all') : this._videoDialog.find(".e-inputtext").removeClass('e-corner-all');
            }
            !ej.isNullOrUndefined(this._createTable) && this._createTable.ejDialog("option", prop, value);
            if (!ej.isNullOrUndefined(this._sourceDialog)) {
                this._sourceDialog.ejDialog("option", prop, value);
                this._sourceDialog.find(".e-rte-btn").ejButton("option", prop, value);
                if (prop == "showRoundedCorner") (value == true) ? this._sourceDialog.find(".e-inputtext").addClass('e-corner-all') : this._sourceDialog.find(".e-inputtext").removeClass('e-corner-all');
            }
            if (!ej.isNullOrUndefined(this._alertWindow)) {
                this._alertWindow.ejDialog("option", prop, value);
                this._alertWindow.find(".e-rte-btn").ejButton("option", prop, value);
            }
            if (!ej.isNullOrUndefined(this._customTableDialog)) {
                this._customTableDialog.ejDialog("option", prop, value);
                this._customTableDialog.find(".e-rte-btn").ejButton("option", prop, value);
                this._customTableDialog.find(".numerictextbox").ejNumericTextbox("option", prop, value);
                this._customTableDialog.find(".e-rte-txtColumns").ejNumericTextbox("option", prop, value);
                this._customTableDialog.find(".e-rte-ddlAlignment").ejDropDownList("option", prop, value);
                this._customTableDialog.find(".e-rte-txtBorder").ejDropDownList("option", prop, value);
                this._chkTblCaption.ejCheckBox("option", prop, value);
                if (prop == "showRoundedCorner") (value == true) ? this._customTableDialog.find(".e-inputtext").addClass('e-corner-all') : this._customTableDialog.find(".e-inputtext").removeClass('e-corner-all');
            }
            if (!ej.isNullOrUndefined(this._eTblDialog)) {
                this._eTblDialog.ejDialog("option", prop, value);
                this._eTblDialog.find(".e-numerictextbox").ejNumericTextbox("option", prop, value);
                this._eTblDialog.find(".e-rte-dropdown").ejDropDownList("option", prop, value);
                this._getTableObj("_Tab").ejTab("option", prop, value);
                this._eTblDialog.find(".e-rte-btn").ejButton("option", prop, value);
                this._eTblCaption.ejCheckBox("option", prop, value);
                if (prop == "showRoundedCorner") (value == true) ? this._eTblDialog.find(".e-inputtext").addClass('e-corner-all') : this._eTblDialog.find(".e-inputtext").removeClass('e-corner-all');
            }
            if (!ej.isNullOrUndefined(this._fileDialog)) {
                this._fileDialog.ejDialog("option", prop, value);
                this._fileDialog.find(".e-rte-btn").ejButton("option", prop, value);
                this._chkFileTarget.ejCheckBox("option", prop, value);
                if (prop == "showRoundedCorner") (value == true) ? this._fileDialog.find(".e-inputtext").addClass('e-corner-all') : this._fileDialog.find(".e-inputtext").removeClass('e-corner-all');
            }
            if (!ej.isNullOrUndefined(this._explorerObj))
                this._explorerObj.option(prop, value);
            if (!ej.isNullOrUndefined(this._fileBrowserObj))
                this._fileBrowserObj.option(prop, value);
        },
        _createCountElement: function (option, element) {
            option ? element.show() : element.hide();
            element.toggleClass("e-rte-footeritems");
        },

        _enableResize: function () {
            if (this.model.enableResize && this.model.enabled) {
                this._rteWapper.addClass("e-resizable");
                this._resizeRTE();
            }
        },

        _resizeRTE: function () {
            var proxy = this;
            this._overlayElement = ej.buildTag('div.e-rte-overlay');
            this._rteEditor.css("position", "relative");
            this._rteWapper.find("div.e-rte-resize").ejResizable(
                {
                    minHeight: parseInt(proxy.model.minHeight),
                    minWidth: parseInt(proxy.model.minWidth),
                    maxHeight: parseInt(proxy.model.maxHeight),
                    maxWidth: parseInt(proxy.model.maxWidth),
                    resizeStart: function (event) {
                        proxy._rteEditor.append(proxy._overlayElement);
                        proxy._trigger("resizeStart", { event: event });
                    },
                    resize: function (event) {
					    proxy._updateCount();
                        proxy._resizeHeight(event.element);
                        proxy._trigger("resize", { event: event });
                        if (proxy.model.isResponsive && proxy.model.showToolbar) proxy._toolBarObj._reSizeHandler();
                    },
                    resizeStop: function (event) {
                        proxy._overlayElement.remove();
                        proxy._trigger("resizeStop", { event: event });
                    },
                    helper: function (event) {
                        proxy._resizeHeight(event.element);
                        return $(proxy._rteWapper);
                    }
                });
        },
        _getDocumentHandler: function () {
            (!this._operationHandler) && (this._operationHandler = new ej.editorManager(this.getDocument(), this._getWindow()));
            return this._operationHandler;
        },
        _resizeHeight: function (element) {
            var reElement = element.parents("div.e-rte-wrapper");
            this._rteWidth = reElement.width();
            this._rteHeight = reElement.height();
            this._rteWapper.height(this._rteHeight);
            this._rteWapper.width(this._rteWidth);
            this._setIframeHeight();
        },

        _getDialogModel: function () {
            var dialogModel;
            var rtecontent = this._rteWapper;
            return dialogModel = {
                enableResize: false,
                showOnInit: false,
                enableModal: true,
                cssClass: this.model.cssClass,
                target: rtecontent,
				isResponsive:true,
                enableRTL: this.model.enableRTL
            };
        },
        _labelFor: function (val) {
            return this._rteId ? " for=" + this._rteId + val + " " : "";
        },
        _TagId: function (val) {
            return this._rteId ? " id=" + this._rteId + val + " " : "";
        },
        _renderLinkDialog: function () {
            var proxy = this;
            var btnDiv = (this.model.enableRTL) ? "e-rtlrte" : "";
            var createLink = this._linkDialog = ej.buildTag("div#" + this._rteId + "_link");
            var content = $("<div class='e-rte-label " + btnDiv + "'><label " + this._labelFor("_link_url") + ">" + this._getLocalizedLabels("linkWebUrl") + "</label></div><div class='e-rte-field " + btnDiv + "'><input type='text'  data-role ='none' class='e-inputtext e-rte-linkUrl' " + this._TagId("_link_url") + "/></div><div class='e-rte-label " + btnDiv + "'>" +
                           "<label " + this._labelFor("_link_text") + ">" + this._getLocalizedLabels("linkText") + "</label></div><div class='e-rte-field " + btnDiv + "'><input type='text' data-role ='none' class='e-inputtext e-rte-linkText' " + this._TagId("_link_text") + "></div><div class='e-rte-label " + btnDiv + "'>" +
                           "<label " + this._labelFor("_link_title") + ">" + this._getLocalizedLabels("linkTooltipLabel") + " </label></div><div class='e-rte-field " + btnDiv + "'><input type='text' data-role ='none' class='e-inputtext e-rte-linkTitle' " + this._TagId("_link_title") + "></div><div class='e-rte-label " + btnDiv + "'></div>" +
                           "<div class='e-rte-field " + btnDiv + "'><input type='checkbox' class='e-rte-linkTarget'  data-role ='none' " + this._TagId("_link_target") + "><label " + this._labelFor("_link_target") + " style='padding: 5px;'>" + this._getLocalizedLabels("linkOpenInNewWindow") + "</label></div>" +
                           "<div class='e-rte-button e-fieldseparate'><button class='e-rte-btn " + btnDiv + "' type='button' data-role ='none' id='link_insert'>" + this._getLocalizedLabels("dialogInsert") + "</button><button class='e-rte-btn " + btnDiv + "'type='button' data-role ='none' id='link_cancel'>" + this._getLocalizedLabels("dialogCancel") + "</button></div>");
            content.appendTo(createLink);
            createLink.appendTo(this._rteWapper);
            var model = this._getDialogModel();
			model.minWidth="340px";
			model.width="auto";
            model.title = this._getLocalizedLabels("createLink");
            model.target = null;
            model.closeIconTooltip = this._getLocalizedLabels("closeIcon");
            model.showRoundedCorner = this.model.showRoundedCorner;
            model.close = function () {
                proxy._ieCursorMaintainance();
            };
            createLink.ejDialog(model);
            createLink.closest(".e-dialog-wrap").addClass("e-rte");
            this.model.showRoundedCorner && createLink.find(".e-inputtext").addClass('e-corner-all');
            this._chkTarget = createLink.find(".e-rte-linkTarget");
            this._chkTarget.ejCheckBox({ enableRTL: this.model.enableRTL, cssClass: this.model.cssClass, showRoundedCorner: this.model.showRoundedCorner });
            createLink.find(".e-rte-btn").ejButton({ enableRTL: this.model.enableRTL, type: "button", cssClass: this.model.cssClass, showRoundedCorner: this.model.showRoundedCorner });
            this._on(createLink.find(".e-rte-btn"), "click", this._linkBtnClick)
            ._on(this._linkDialog.find(".e-rte-linkUrl"), "keypress", this._urlValidation);
            this.model.showRoundedCorner && this._subControlsSetModel();
        },


        _renderImageDialog: function () {
            var proxy = this, pathData = "";
            this._imgDialog = ej.buildTag("div#" + this._rteId + "_Image");
            var btnDiv = (this.model.enableRTL) ? "e-rtlrte" : "";
            var content = "<div " + this._TagId("_img_Tab") + " class='e-rte-imageTab'><ul><li class='e-first'><a href='#" + this._rteId + "_general'>" + this._getLocalizedLabels("general") + " </a></li><li class='e-nofirst'><a href='#" + this._rteId + "_advanced'>" + this._getLocalizedLabels("advanced") + " </a></li></ul>" +
                "<div id='" + this._rteId + "_general'>" +
                        "<div class='e-img-field-group'><div class='e-rte-label " + btnDiv + "'><label " + this._labelFor("_img_url") + ">" + this._getLocalizedLabels("imageWebUrl") + " </label></div><div class='e-rte-field " + btnDiv + "'><input type='text'  data-role ='none' class='e-inputtext e-rte-imgUrl' " + this._TagId("_img_url") + "></div></div><div class='e-img-field-group'><div class='e-rte-label " + btnDiv + "'>" +
                         "<label " + this._labelFor("_img_text") + ">" + this._getLocalizedLabels("imageAltText") + " </label></div><div class='e-rte-field " + btnDiv + "'><input type='text'  data-role ='none'  class='e-inputtext e-rte-imgText' " + this._TagId("_img_text") + "></div></div>" +
                        "<div class='e-rte-imgdimensions' " + this._TagId("_imgdimensions") + "><div class='e-rte-label " + btnDiv + "'><label>" + this._getLocalizedLabels("dimensions") + " </label></div><div class='e-rte-field " + btnDiv + "'><input type='text' data-role ='none'  title='" + this._getLocalizedLabels("dimensions") + "'  data-role ='none' class='e-inputtext e-dimensions e-rte-imgX' maxlength='3' " + this._TagId("_imgX") + "><label style='padding: 5px;'>X</label><input type='text'  data-role ='none'  title='" + this._getLocalizedLabels("dimensions") + "' style='margin-right: 5px;' class='e-inputtext e-dimensions e-rte-imgY' maxlength='3' " + this._TagId("_imgY") + "></div>" +
                 "<input type='checkbox' class='e-rte-imgConsrn' data-role ='none'" + this._TagId("_img_consrn") + "<label " + this._labelFor("_img_consrn") + "  style='padding: 5px;'>" + this._getLocalizedLabels("constrainProportions") + "</label></div>" +
                "</div>" +
                "<div id='" + this._rteId + "_advanced'>" +
                        "<div class='e-img-field-group'><div class='e-rte-label " + btnDiv + "'><label " + this._labelFor("_img_link") + ">" + this._getLocalizedLabels("imageLink") + " </label></div><div class='e-rte-field " + btnDiv + "'><input type='text'  data-role ='none' class='e-inputtext e-rte-imgLink' " + this._TagId("_img_link") + "></div></div>" +
                        "<div class='e-img-field-group'><div class='e-rte-label " + btnDiv + "'><label " + this._labelFor("_img_border_px") + ">" + this._getLocalizedLabels("imageBorder") + "</label></div><div class='e-rte-field " + btnDiv + "'><div class='e-img-border-field'><input type='text' data-role ='none' title='" + this._getLocalizedLabels("imageBorder") + "' class='e-rte-imgBorderPx' maxlength='3' " + this._TagId("_img_border_px") + "></div><div class='e-img-border-field'><select class='e-rte-imgBorderStyle'  data-role ='none' " + this._TagId("_img_border_style") + "><option value='solid'>" + this._getLocalizedLabels("solid") + "</option><option value='dotted'>" + this._getLocalizedLabels("dotted") + "</option><option value='dashed'>" + this._getLocalizedLabels("dashed") + "</option><option value='double'>" + this._getLocalizedLabels("doubled") + "</option></select></div><div class='e-img-border-field'><input  data-role ='none' type='text' title='" + this._getLocalizedLabels("imageBorder") + "' class='e-inputtext e-rte-imgBorderColor' " + this._TagId("_img_border_color") + "></div></div></div>" +
                        "<div class='e-img-field-group'><div class='e-rte-label " + btnDiv + "'><label " + this._labelFor("_img_style") + ">" + this._getLocalizedLabels("imageStyle") + " </label></div><div class='e-rte-field " + btnDiv + "'><input type='text' data-role ='none'  class='e-inputtext e-rte-imgStyle' " + this._TagId("_img_style") + "></div></div>" +
                        "<div class='e-img-field-group'><div class='e-rte-label " + btnDiv + "'></div><div class='e-rte-field " + btnDiv + "'><input type='checkbox' class='e-rte-imgLinkTarget' data-role ='none' " + this._TagId("_img_link_target") + "><label " + this._labelFor("_img_link_target") + " style='padding: 5px;'>" + this._getLocalizedLabels("linkOpenInNewWindow") + "</label></div></div>" +
                "</div>" +

                "</div>" +
                "<div class='e-rte-button e-fieldseparate'><button class='e-rte-btn " + btnDiv + "' data-role ='none'  type='button' id='" + this._rteId + "_img_insert'>" + this._getLocalizedLabels("dialogInsert") + "</button><button class='e-rte-btn " + btnDiv + "' type='button' data-role ='none' id='" + this._rteId + "_img_cancel'>" + this._getLocalizedLabels("dialogCancel") + "</button></div>";
            if (this.model.imageBrowser.filePath != "")
                pathData = "<div " + this._TagId("_img_explorer") + " class='e-rte-explorer e-rte-imgBrowser'></div>";
            content = $(pathData + content);
            content.appendTo(this._imgDialog);
            this._imgDialog.appendTo(this._rteWapper);
            !this.model.showDimensions && this._rteWapper.find("div.e-rte-imgdimensions").hide();
            var model = this._getDialogModel();
			this.model.imageBrowser.filePath=="" ? model.maxWidth="470px" : model.maxWidth="720px";
            model.width ="auto";
		    model.title = this._getLocalizedLabels("image");
            model.target = null;
            model.closeIconTooltip = this._getLocalizedLabels("closeIcon");
            model.showRoundedCorner = this.model.showRoundedCorner;
            model.open = function () {
                proxy._explorerObj && proxy._explorerObj.adjustSize();
                if (!ej.isNullOrUndefined(proxy._imgSplitObj))
                    proxy._imgSplitObj.option("enableAutoResize", true);
            };
            model.close = function () {
                proxy._ieCursorMaintainance();
                if (!ej.isNullOrUndefined(proxy._imgSplitObj))
                    proxy._imgSplitObj.option("enableAutoResize", false);
            };
            this._imgDialog.ejDialog(model);
            this._imgDialog.closest(".e-dialog-wrap").css({ "visibility": "hidden", "display": "block" }).addClass("e-rte");
            if (this.model.imageBrowser.filePath != "") {
                var ajaxSettings = { upload: { url: this.model.imageBrowser.uploadAction } };
                if (this.model.imageBrowser.ajaxSettings)
                    $.extend(true, ajaxSettings, this.model.imageBrowser.ajaxSettings);

                this._explorerObj = this._imgDialog.find("div.e-rte-imgBrowser").ejFileExplorer({
                    allowMultiSelection: false, showFooter: false, showTreeview: false, enableRTL: this.model.enableRTL, showRoundedCorner: this.model.showRoundedCorner, cssClass: this.model.cssClass, maxWidth: "690px", isResponsive:true,minWidth:"330px",height: "300px", path: this.model.imageBrowser.filePath, fileTypes: this.model.imageBrowser.extensionAllow, layout: ej.FileExplorer.layoutType.LargeIcons, select: function (e) { proxy._UpdateImgDetails(e); },
                    tools: {
                        creation: ["NewFolder", "Open"],
                        navigation: ["Back", "Forward"],
                        addressBar: ["Addressbar"],
                        editing: ["Refresh", "Upload", "Delete"],
                        searchBar: ["Searchbar"]
                    }, toolsList: ["creation", "navigation", "addressBar", "editing", "searchBar"], enableResize: false, showContextMenu: false,
                    ajaxAction: this.model.imageBrowser.ajaxAction, locale: this.model.locale,
                    ajaxSettings: ajaxSettings
                }).data('ejFileExplorer');
                this._imgSplitObj = this._imgDialog.find(".e-splitter").data("ejSplitter");
                this._imgSplitObj.option("enableAutoResize", false);
            }
            this.model.showRoundedCorner && this._imgDialog.find(".e-inputtext").addClass('e-corner-all');
            this._imgDialog.find("div.e-rte-imageTab").ejTab({ enableRTL: this.model.enableRTL, cssClass: this.model.cssClass, width: "100%", enabled: true, showRoundedCorner: this.model.showRoundedCorner });
            this._imgDialog.find(".e-rte-imgBorderPx").ejNumericTextbox({ enableRTL: this.model.enableRTL, cssClass: this.model.cssClass, width: "100%", minValue: 0, value: 0, showRoundedCorner: this.model.showRoundedCorner, locale:this.model.locale  });
            this._imgDialog.find(".e-rte-imgBorderStyle").ejDropDownList({ enableRTL: this.model.enableRTL, cssClass: this.model.cssClass, width: "100%", enabled: true, showRoundedCorner: this.model.showRoundedCorner });
            this._chkImgDimensions = this._imgDialog.find(".e-rte-imgConsrn");
            this._chkImgDimensions.ejCheckBox({ check: true, enableRTL: this.model.enableRTL, cssClass: this.model.cssClass, showRoundedCorner: this.model.showRoundedCorner });
            this._imgDialog.find(".e-rte-btn").ejButton({ enableRTL: this.model.enableRTL, type: "button", cssClass: this.model.cssClass, showRoundedCorner: this.model.showRoundedCorner });
            this._imgPicker = this._imgDialog.find(".e-rte-imgBorderColor").ejColorPicker({ locale:this.model.locale,cssClass: this.model.cssClass, modelType: "palette", buttonText: { apply: this._getLocalizedLabels("buttonApply"), cancel: this._getLocalizedLabels("buttonCancel"), swatches: this._getLocalizedLabels("swatches") } }).data('ejColorPicker');
            this._imgDialog.parents("#" + this._rteId + "_Image_wrapper").css({ "visibility": "visible", "display": "none" });
            this._dialogchkTarget = this._imgDialog.find(".e-rte-imgLinkTarget");
            this._dialogchkTarget.ejCheckBox({ enableRTL: this.model.enableRTL, cssClass: this.model.cssClass, showRoundedCorner: this.model.showRoundedCorner });
            this._on(this._imgDialog.find(".e-rte-btn"), "click", this._imageBtnClick)
            this._on(this._imgDialog.find(".e-rte-imgUrl , .e-rte-imgLink"), "keypress", this._urlValidation);
            this._on(this._imgDialog.find("input.e-dimensions"), "change", this._recalcImgSize);
            this.model.showRoundedCorner && this._subControlsSetModel();    
        },
        _renderFileBrowserDialog: function () {
            var proxy = this, pathData = "";
            var btnDiv = (this.model.enableRTL) ? "e-rtlrte" : "";
            this._fileDialog = ej.buildTag("div#" + this._rteId + "_fileDialog");
            var content = "<div class='e-rte-elements'><div class='e-rte-label " + btnDiv + "'><label " + this._labelFor("_file_url") + ">" + this._getLocalizedLabels("linkWebUrl") + "</label></div><div class='e-rte-field " + btnDiv + "'><input type='text'  data-role ='none' class='e-inputtext e-rte-fileUrl' " + this._TagId("_file_url") + "/></div><div class='e-rte-label " + btnDiv + "'>" +
                           "<label " + this._labelFor("_file_text") + ">" + this._getLocalizedLabels("linkText") + "</label></div><div class='e-rte-field " + btnDiv + "'><input type='text' data-role ='none' class='e-inputtext e-rte-fileText' " + this._TagId("_file_text") + "></div> </div>" +
                           "<div class='e-rte-field'><input type='checkbox' class='e-rte-fileTarget'  data-role ='none' " + this._TagId("_file_target") + "><label " + this._labelFor("_link_target") + " style='padding: 5px;'>" + this._getLocalizedLabels("linkOpenInNewWindow") + "</label></div>" +
                           "<div class='e-rte-button e-fieldseparate'><button class='e-rte-btn " + btnDiv + "' type='button' data-role ='none' id='" + this._rteId + "_file_insert'>" + this._getLocalizedLabels("dialogInsert") + "</button><button class='e-rte-btn " + btnDiv + "'type='button' data-role ='none' id='" + this._rteId + "_file_cancel'>" + this._getLocalizedLabels("dialogCancel") + "</button></div>";
            pathData = "<div " + this._TagId("_file_explorer") + " class='e-rte-explorer e-rte-fileBrowser'></div>";
            content = $(pathData + content);
            content.appendTo(this._fileDialog);
            this._fileDialog.appendTo(this._rteWapper);
            var model = this._getDialogModel();
			model.width="auto";
            model.title = this._getLocalizedLabels("fileBrowser");
            model.target = null;
            model.showRoundedCorner = this.model.showRoundedCorner;
            model.open = function () {
                proxy._fileBrowserObj.adjustSize();
                if (!ej.isNullOrUndefined(proxy._fileSplitObj))
                    proxy._fileSplitObj.option("enableAutoResize", true);
            };
            model.close = function () {
                proxy._ieCursorMaintainance();
                if (!ej.isNullOrUndefined(proxy._fileSplitObj))
                    proxy._fileSplitObj.option("enableAutoResize", false);
            };
            this._fileDialog.ejDialog(model);
            this._fileDialog.closest(".e-dialog-wrap").css({ "visibility": "hidden", "display": "block" }).addClass("e-rte");
            var ajaxSettings = { upload: { url: this.model.fileBrowser.uploadAction } };
            if (this.model.fileBrowser.ajaxSettings)
                $.extend(true, ajaxSettings, this.model.fileBrowser.ajaxSettings);

            this._fileBrowserObj = this._fileDialog.find("div.e-rte-fileBrowser").ejFileExplorer({
                allowMultiSelection: false, showFooter: false, showTreeview: false, enableRTL: this.model.enableRTL, showRoundedCorner: this.model.showRoundedCorner, cssClass: this.model.cssClass, maxWidth:"690px", height: "300px",isResponsive:true,minWidth:"330px", path: this.model.fileBrowser.filePath, fileTypes: this.model.fileBrowser.extensionAllow, layout: "list", select: function (e) { proxy._UpdateFileDetails(e); },
                tools: {
                    creation: ["NewFolder", "Open"],
                    navigation: ["Back", "Forward"],
                    addressBar: ["Addressbar"],
                    editing: ["Refresh", "Upload", "Delete"],
                    searchBar: ["Searchbar"]
                }, toolsList: ["creation", "navigation", "addressBar", "editing", "searchBar"], enableResize: false, showContextMenu: false,
                ajaxAction: this.model.fileBrowser.ajaxAction, locale: this.model.locale,
                ajaxSettings: ajaxSettings
            }).data('ejFileExplorer');
            this._fileSplitObj = this._fileDialog.find(".e-splitter").data("ejSplitter");
            this._fileSplitObj.option("enableAutoResize", false);
            this.model.showRoundedCorner && this._fileDialog.find(".e-inputtext").addClass('e-corner-all');
            this._fileDialog.find(".e-rte-btn").ejButton({ enableRTL: this.model.enableRTL, type: "button", cssClass: this.model.cssClass, showRoundedCorner: this.model.showRoundedCorner });
            this._fileDialog.parents("#" + this._rteId + "_fileDialog_wrapper").css({ "visibility": "visible", "display": "none" });
            this._chkFileTarget = content.find(".e-rte-fileTarget");
            this._chkFileTarget.ejCheckBox({ enableRTL: this.model.enableRTL, cssClass: this.model.cssClass, showRoundedCorner: this.model.showRoundedCorner });
            this._on(this._fileDialog.find(".e-rte-btn"), "click", this._fileBtnClick);
            this.model.showRoundedCorner && this._subControlsSetModel(); 
        },
        _UpdateImgDetails: function (e) {
            if ($(this._imgURL).hasClass('e-error')) this._imgURL.removeClass("e-error");
            if (e.path === "") this._imgURL.val("http://");
            else this._imgDialog.find("div.e-rte-imageTab").find('.e-rte-imgUrl').val(e.path + (e.name[0] ? e.name[0] : ""));
        },
        _UpdateFileDetails: function (e) {
            if ($(this._fileURL).hasClass('e-error')) this._fileURL.removeClass("e-error");
            if (e.path === "") this._fileURL.val("http://");
            else this._fileDialog.find('.e-rte-fileUrl').val(e.path + (e.name[0] ? e.name[0] : ""));
        },
        _fileBtnClick: function (sender) {
            this._renderLinkDialog();
            if (sender.target.id === this._rteId + "_file_cancel") {
                this._clearFileFields();
                this._fileDialog.ejDialog("close");
                this._ieCursorMaintainance();
            }
            else if (sender.target.id === this._rteId + "_file_insert") {
                if (this._isIE() && !this._isIE8()) this._ieLinkRange();
                this._restoreSelection(this._selectionRange);
                if (this._fileDialog.find('e-rte-fileUrl').val() != "")
                    this._onInsertFileLink();
                else this._linkDialog.ejDialog("close");
                this._trigger("execute", { commandName: "hyperlink" });
                this._onChange();
                this._setBackupData();
            }
        },
        _clearFileFields: function () {
            this._fileURL = this._fileDialog.find(".e-rte-fileUrl");
            this._fileURL.val("http://");
            this._fileLinkText = this._fileDialog.find(".e-rte-fileText");
            this._fileLinkText.val("");
            this._chkFileTarget.ejCheckBox({ check: false });
        },
        _onGetInsertFileContent: function (Url) {
            if (this._fileLinkText.val() === "") this._selectedHTML = Url;
            else this._selectedHTML = this._fileLinkText.val();
        },
        _onInsertFileLink: function () {
            var oEl, sHtml;
            var fileVal = this._fileURL.val().match(/(ftp:|http:|https:)\/\//g);
            var fsrcUrl = (this._fileURL.val().startsWith("~")) ? this._fileURL.val().replace(this._fileURL.val().substr('0', '1'), "..") : this._fileURL.val();
            if ((ej.isNullOrUndefined(fileVal) && fsrcUrl !== "") || (!ej.isNullOrUndefined(fileVal) && fileVal[0].length < fsrcUrl.length)) {
                var selectedNode = ((this._isIE()) && $(this._currentSelNode).parents("body").length > 0) ? this._currentSelNode : this._getSelectedNode();
                if (!ej.isNullOrUndefined(selectedNode) && selectedNode.tagName.toUpperCase() == 'A') {
                    selectedNode.href = fsrcUrl;
                    selectedNode.innerHTML = this._fileLinkText.val();
                    (this._chkFileTarget.ejCheckBox("isChecked")) ? selectedNode.target = "_blank" : selectedNode.target = "_self";
                }
                else if (!ej.isNullOrUndefined(selectedNode) && selectedNode.tagName.toUpperCase() == 'IMG') {
                    var parentNode = $(selectedNode).parent('a')[0];
                    if (ej.isNullOrUndefined(parentNode)) {
                        oEl = ej.buildTag("a", "", {}, { href: fsrcUrl });
                        $(selectedNode.outerHTML).appendTo($(oEl));
                        $(selectedNode).replaceWith($(oEl));
                        (this._chkFileTarget.ejCheckBox("isChecked")) ? oEl[0].target = "_blank" : oEl[0].target = "_self";
                    } else {
                        parentNode.href = fsrcUrl;
                        (this._chkFileTarget.ejCheckBox("isChecked")) ? parentNode.target = "_blank" : parentNode.target = "_self";
                    }
                }
                else {
                    oEl = ej.buildTag("a", "", {}, { href: fsrcUrl });
                    (this._chkFileTarget.ejCheckBox("isChecked")) ? oEl[0].target = "_blank" : oEl[0].target = "_self";
                    var oSelection;
                    var oSelRange;
                    this._focus();
                    if (this._isIE()) {
                        if (!ej.isNullOrUndefined(this._selectedHTML)) {
                            if (this._selectedHTML.length == 0)
                                this._onGetInsertFileContent(fsrcUrl);
                        }
                        else
                            this._onGetInsertFileContent(fsrcUrl);
                        oEl[0].innerHTML = this._selectedHTML;
                        sHtml = oEl[0].outerHTML;
                    }
                    else {
                        if (this._fileLinkText.val() === "")
                            oEl.html(fsrcUrl);
                        else oEl.html(this._fileLinkText.val());
                        sHtml = $('<div>').append($(oEl).clone()).html();
                    }
                    if (sHtml && (this.model.maxLength != null && (this.model.maxLength > $.trim(this._getText()).length))) {
                        this._isIE() ? this._pasteHtml(sHtml) : this._getDocument().execCommand('inserthtml', false, sHtml);
                        this._focus();
                    }
                }
                this._fileDialog.ejDialog("close");
            } else {
                this._fileURL.addClass("e-error");
                return false;
            }
            this.enableToolbarItem("removeLink");
            this._updateCount();
        },
        //Render the Table selection rows and columans popup
        _renderVideoDialog: function () {
            var proxy = this;
            this._videoDialog = ej.buildTag("div#" + this._rteId + "_video");
            var btnDiv = (this.model.enableRTL) ? "e-rtlrte" : "";
            var content = $("<div><label>" + this._getLocalizedLabels("embedVideo") + "</label></div><textarea class='e-rte-video e-inputtext'  aria-label=" + this._getLocalizedLabels("embedVideo") + "></textarea>" +
               "<div class='e-rte-videoDimensions'" + this._TagId("_videodimensions") + " style='margin-top:7px'><div class='e-rte-label'><label>" + this._getLocalizedLabels("dimensions") + " </label></div><div><input type='text'  data-role ='none' title='" + this._getLocalizedLabels("dimensions") + "' class='e-inputtext e-dimensions e-rte-videoX' maxlength='3' " + this._TagId("_videoX") + "><label style='padding: 5px;'>X</label><input type='text'  data-role ='none'  title='" + this._getLocalizedLabels("dimensions") + "' style='margin-right: 5px;' class='e-inputtext e-dimensions e-rte-videoY' maxlength='3'" + this._TagId("_videoY") + ">" +
               "<input type='checkbox' class='e-rte-videoConsrn' data-role ='none'" + this._TagId("_video_consrn") + "<label " + this._labelFor("_video_consrn") + "style='padding: 5px;'>" + this._getLocalizedLabels("constrainProportions") + "</label></div></div>" +
                "<div class='e-rte-button e-fieldseparate'><button id='video_insert'type='button' data-role ='none' class='e-rte-btn " + btnDiv + "'>" + this._getLocalizedLabels("dialogInsert") + "</button><button id='video_cancel' type='button' data-role ='none' class='e-rte-btn " + btnDiv + "'>" + this._getLocalizedLabels("dialogCancel") + "</button></div>");
            content.appendTo(this._videoDialog);
            this._videoDialog.appendTo(this._rteWapper);
            !this.model.showDimensions && this._rteWapper.find(".e-rte-videoDimensions").hide();
            var model = this._getDialogModel();
            model.width="auto";
            model.closeIconTooltip = this._getLocalizedLabels("closeIcon");
            model.title = this._getLocalizedLabels("video");
            model.target = null;
            model.showRoundedCorner = this.model.showRoundedCorner;
            model.close = function () {
                proxy._ieCursorMaintainance();
            };
            this._videoDialog.ejDialog(model);
            this._videoDialog.closest(".e-dialog-wrap").addClass("e-rte");
            this.model.showRoundedCorner && this._videoDialog.find(".e-inputtext").addClass('e-corner-all');
            this._chkvideoDimensions = this._videoDialog.find(".e-rte-videoConsrn");
            this._chkvideoDimensions.ejCheckBox({ checked: true, enableRTL: this.model.enableRTL, cssClass: this.model.cssClass, showRoundedCorner: this.model.showRoundedCorner });
            this._videoDialog.find(".e-rte-btn").ejButton({ enableRTL: this.model.enableRTL, type: "button", cssClass: this.model.cssClass, showRoundedCorner: this.model.showRoundedCorner });
            this._on(this._videoDialog.find(".e-rte-btn"), "click", this._insertVideo);
            this._on(this._videoDialog.find("input.e-dimensions"), "change", this._recalcVideoSize);
            this.model.showRoundedCorner && this._subControlsSetModel();
        },


        _renderTableDialog: function () {
            var proxy = this;
            this._createTable = ej.buildTag("div.e-rte-table-picker#" + this._rteId + "_table");
            this._customTable = $("<div class='customtable-group e-rte-createCustomTableLink' " + this._TagId("_createCustomTableLink") + "><span class='e-rte-toolbar-icon " + this._rteIconsList["customTableImage"] + "'></span><a class='customtable-link' role='button' title='" + this._getLocalizedLabels("customTable") + "'>" + this._getLocalizedLabels("customTable") + "</a></div>" +
               "<div class='customtable-group e-rte-eTblProperties e-disable' " + this._TagId("_eTblProperties") + "><span class='e-rte-toolbar-icon " + this._rteIconsList["customTableImage"] + "'></span><a class='customtable-link' role='button' title='" + this._getLocalizedLabels("editTable") + "'>" + this._getLocalizedLabels("editTable") + "</a></div>");  
            var tableCell, rowDiv, colDiv, tableDiv;
            this._tblheaderDiv = ej.buildTag("div.e-rte-tableheader");
            this._tblheaderDiv.html(this._getLocalizedLabels("createTable"));
            this._tblheaderDiv.appendTo(this._createTable);
            var tableDiv = ej.buildTag("div.e-rte-table");
            this._drawTable(tableDiv);
            tableDiv.appendTo(this._createTable); 
            this._createTable.appendTo(this._rteWapper);
            var model = this._getDialogModel();
            model.enableModal = false;
            model.showHeader = false;
            model.width = "auto";
            model.minWidth = "270px";
            model.maxWidth = "270px";
            model.showRoundedCorner = this.model.showRoundedCorner;
            model.close = function (args) {
				args.event&& args.event.clickAction && proxy._ieCursorMaintainance();
            };
            this._createTable.ejDialog(model); 
            this._on(this._customTable, "click", this._openCustomTable);
            this._customTable.appendTo(this._createTable); 
        },

        _createCustomTable: function () { 
            if (!this.model.showCustomTable)
                this._createTable.find("#" + this._rteId + "_createCustomTableLink").hide();
            var btnDiv = (this.model.enableRTL) ? "e-rtlrte" : "";
            this._customTableDialog = ej.buildTag("div.e-rte-customtable#" + this._rteId + "_customTable");
            var content = $("<div class='e-fieldgroup'><div class='e-rte-tablefields'><label " + this._labelFor("_txtColumns") + ">" + this._getLocalizedLabels("tableColumns") + "</label></div><div class='e-rte-tablefields'><input type='text' data-role ='none'  class='numerictextbox e-rte-txtColumns' " + this._TagId("_txtColumns") + "></div><div class='e-rte-tablefields'>" +
                 "<label " + this._labelFor("_txtRows") + ">" + this._getLocalizedLabels("tableRows") + "</label></div><div class='e-rte-tablefields'><input type='text' data-role ='none'  class='numerictextbox e-rte-txtRows' " + this._TagId("_txtRows") + "></div><div class='e-rte-tablefields'>" +
                 "<label " + this._labelFor("_txtWidth") + ">" + this._getLocalizedLabels("tableWidth") + "</label></div><div class='e-rte-tablefields'><input type='text' data-role ='none'  class='e-inputtext e-rte-txtWidth'" + this._TagId("_txtWidth") + "></div>" +
                 "<div class='e-rte-tablefields'><label " + this._labelFor("_txtHeight") + ">" + this._getLocalizedLabels("tableHeight") + "</label></div><div class='e-rte-tablefields'><input type='text' data-role ='none'  class='e-inputtext e-rte-txtHeight'" + this._TagId("_txtHeight") + "></div></div>" +
                 "<div class='e-fieldseparate'><div class='e-rte-tablefields'><label " + this._labelFor("_txtSpacing") + ">" + this._getLocalizedLabels("tableCellSpacing") + "</label></div><div class='e-rte-tablefields'><input type='text' data-role ='none'  class='e-inputtext e-rte-txtSpacing' " + this._TagId("_txtSpacing") + "></div>" +
                 "<div class='e-rte-tablefields'><label " + this._labelFor("_txtPadding") + ">" + this._getLocalizedLabels("tableCellPadding") + "</label></div><div class='e-rte-tablefields'><input type='text' data-role ='none'  class='e-inputtext e-rte-txtPadding'" + this._TagId("_txtPadding") + "></div>" +
                 "<div class='e-rte-tablefields'><label " + this._labelFor("_txtBorder") + ">" + this._getLocalizedLabels("tableBorder") + "</label></div><div class='e-rte-tablefields'><select class='e-rte-txtBorder' data-role ='none' " + this._TagId("_txtBorder") + "><option value='solid'>" + this._getLocalizedLabels("solid") + "</option><option value='dotted'>" + this._getLocalizedLabels("dotted") + "</option><option value='dashed'>" + this._getLocalizedLabels("dashed") + "</option><option value='double'>" + this._getLocalizedLabels("doubled") + "</option></select></div>" +
                 "<div class='e-rte-tablefields'><label " + this._labelFor("_chkCaption") + ">" + this._getLocalizedLabels("tableCaption") + "</label></div><div class='e-rte-tablefields'><input type='checkbox' class='e-rte-chkCaption'  data-role ='none'" + this._TagId("_chkCaption") + "></div>" +
                 "<div class='e-rte-tablefields'><label " + this._labelFor("_ddlAlignment") + ">" + this._getLocalizedLabels("tableAlignment") + "</label></div><div class='e-rte-tablefields'><select class='e-rte-ddlAlignment' data-role ='none' " + this._TagId("_ddlAlignment") + "><option value='left'>" + this._getLocalizedLabels("left") + "</option><option value='right'>" + this._getLocalizedLabels("right") + "</option><option value='center'>" + this._getLocalizedLabels("center") + "</option></select></div></div>" +
                 "<div class='e-rte-button e-fieldseparate'><button class='e-rte-btn " + btnDiv + "' data-role ='none' id='insert'>" + this._getLocalizedLabels("dialogInsert") + "</button><button class='e-rte-btn " + btnDiv + "' data-role ='none' id='cancel'>" + this._getLocalizedLabels("dialogCancel") + "</button></div>");
            content.appendTo(this._customTableDialog);
			var model = this._getDialogModel();
            model.width = "auto";
			model.maxWidth="480px";
            model.title = this._getLocalizedLabels("customTable");
            model.target = null;
            model.showRoundedCorner = this.model.showRoundedCorner;
            model.closeIconTooltip = this._getLocalizedLabels("closeIcon");
            this._customTableDialog.ejDialog(model);
            this._customTableDialog.closest(".e-dialog-wrap").addClass("e-rte");
            this.model.showRoundedCorner && this._customTableDialog.find(".e-inputtext").addClass('e-corner-all');
            this._createTable.find("div.e-rte-eTblProperties");
            this._customTableDialog.find(".e-rte-btn").ejButton({ enableRTL: this.model.enableRTL, type: "button", cssClass: this.model.cssClass, showRoundedCorner: this.model.showRoundedCorner });
            this._customTableDialog.find(".numerictextbox").ejNumericTextbox({ enableRTL: this.model.enableRTL, cssClass: this.model.cssClass, width: "100%", minValue: 1, value: 3, showRoundedCorner: this.model.showRoundedCorner, locale:this.model.locale });
            this._customTableDialog.find(".e-rte-txtColumns").ejNumericTextbox({ maxValue: 63, showRoundedCorner: this.model.showRoundedCorner, locale:this.model.locale  });
            this._customTableDialog.find(".e-rte-ddlAlignment").ejDropDownList({ enableRTL: this.model.enableRTL, cssClass: this.model.cssClass, width: "100%", enabled: false, showRoundedCorner: this.model.showRoundedCorner });
            this._customTableDialog.find(".e-rte-txtBorder").ejDropDownList({ enableRTL: this.model.enableRTL, cssClass: this.model.cssClass, width: "100%", enabled: true, showRoundedCorner: this.model.showRoundedCorner });
            this._chkTblCaption = this._customTableDialog.find(".e-rte-chkCaption");
            this._chkTblCaption.ejCheckBox({ enableRTL: this.model.enableRTL, cssClass: this.model.cssClass, showRoundedCorner: this.model.showRoundedCorner });
            this._on(this._customTableDialog.find(".e-rte-btn"), "click", this._insertCustomTable);
            this._on(this._customTableDialog.find(".e-rte-txtWidth"), "focusout", this._widthFocusOut);
        },
        _renderEditTableDialog: function () {
            var proxy = this;
            this._eTblDialog = ej.buildTag("div.e-rte-edittable#" + this._rteId + "_eTbl");
            var rteID = this._rteId;
            var btnDiv = (this.model.enableRTL) ? "e-rtlrte" : "";
            var content = $("<div id='" + this._rteId + "_eTbl_Tab'><ul><li class='e-first'><a href='#" + this._rteId + "_eTblTable'>" + this._getLocalizedLabels("table") + " </a></li><li class='e-nofirst'><a href='#" + this._rteId + "_eTblRow'>" + this._getLocalizedLabels("row") + " </a></li><li class='e-nofirst'><a href='#" + this._rteId + "_eTblCell'>" + this._getLocalizedLabels("cell") + " </a></li></ul>" +
            "<div id='" + this._rteId + "_eTblTable'>" +
                    "<div class='e-rte-tablefields'><label " + this._labelFor("_eTblWidth") + ">" + this._getLocalizedLabels("tableWidth") + "</label></div><div class='e-rte-tablefields'><input type='text' data-role ='none'  class='e-inputtext' " + this._TagId("_eTblWidth") + "></div>" +
                    "<div class='e-rte-tablefields'><label " + this._labelFor("_eTblHeight") + ">" + this._getLocalizedLabels("tableHeight") + "</label></div><div class='e-rte-tablefields'><input type='text' data-role ='none'  class='e-inputtext' " + this._TagId("_eTblHeight") + "></div>" +
                    "<div class='e-rte-tablefields'><label " + this._labelFor("_eTblCellSpace") + ">" + this._getLocalizedLabels("tableCellSpacing") + "</label></div><div class='e-rte-tablefields'><input type='text' data-role ='none'  class='e-inputtext e-numerictextbox' " + this._TagId("_eTblCellSpace") + "></div>" +
                    "<div class='e-rte-tablefields'><label " + this._labelFor("_eTblCellPad") + ">" + this._getLocalizedLabels("tableCellPadding") + "</label></div><div class='e-rte-tablefields'><input type='text' data-role ='none'  class='e-inputtext e-numerictextbox' " + this._TagId("_eTblCellPad") + "></div>" +
                   "<div class='e-rte-tablefields'><label  " + this._labelFor("_eTblAlign") + ">" + this._getLocalizedLabels("tableAlignment") + "</label></div><div class='e-rte-tablefields'><select id='" + rteID + "_eTblAlign' data-role ='none'  class='e-rte-dropdown'><option value='left'>" + this._getLocalizedLabels("left") + "</option><option value='right'>" + this._getLocalizedLabels("right") + "</option><option value='center'>" + this._getLocalizedLabels("center") + "</option></select></div>" +
                    "<div class='e-rte-tablefields'><label " + this._labelFor("_eTblCaption") + ">" + this._getLocalizedLabels("tableCaption") + "</label></div><div class='e-rte-tablefields'><input type='checkbox' data-role ='none' " + this._TagId("_eTblCaption") + "></div>" +
                    "<div class='e-img-field-group'><div class='e-rte-tablefields'><label " + this._labelFor("_eTblBrdrPx") + ">" + this._getLocalizedLabels("tableBorder") + "</label></div><div class='e-rte-stylefield'><div class='e-img-border-field'><input  data-role ='none' type='text' title='" + this._getLocalizedLabels("tableBorder") + "' class='e-inputtext e-numerictextbox' maxlength='3'  " + this._TagId("_eTblBrdrPx") + "></div><div class='e-img-border-field'><select " + this._TagId("_eTbl_border_style") + " class='e-rte-dropdown' data-role ='none' ><option value='solid'>" + this._getLocalizedLabels("solid") + "</option><option value='dotted'>" + this._getLocalizedLabels("dotted") + "</option><option value='dashed'>" + this._getLocalizedLabels("dashed") + "</option><option value='double'>" + this._getLocalizedLabels("doubled") + "</option></select></div><div class='e-img-border-field'><input type='text' data-role ='none'  title='" + this._getLocalizedLabels("tableBorder") + "' class='e-inputtext' " + this._TagId("_eTbl_border_color") + "></div></div></div>" +
                    "<div class='e-img-field-group'><div class='e-rte-tablefields'><label " + this._labelFor("_eTblStyle") + ">" + this._getLocalizedLabels("imageStyle") + " </label></div><div class='e-rte-stylefield'><input  data-role ='none' type='text' class='e-inputtext' " + this._TagId("_eTblStyle") + "></div></div>" +
            "</div>" +
            "<div id='" + rteID + "_eTblRow'>" +
                    "<div class='e-rte-tablefields'><label " + this._labelFor("_eTblRHeight") + ">" + this._getLocalizedLabels("tableHeight") + "</label></div><div class='e-rte-tablefields'><input  data-role ='none' type='text' class='e-inputtext' " + this._TagId("_eTblRHeight") + "></div>" +
                    "<div class='e-rte-tablefields'><label " + this._labelFor("_eTblRAlign") + ">" + this._getLocalizedLabels("textAlign") + "</label></div><div class='e-rte-tablefields'><select " + this._TagId("_eTblRAlign") + " data-role ='none'  class='e-rte-dropdown'><option value='left'>" + this._getLocalizedLabels("left") + "</option><option value='right'>" + this._getLocalizedLabels("right") + "</option><option value='center'>" + this._getLocalizedLabels("center") + "</option></select></div>" +
                    "<div class='e-img-field-group'><div class='e-rte-tablefields'><label " + this._labelFor("_eTblRBrdrPx") + ">" + this._getLocalizedLabels("tableBorder") + "</label></div><div class='e-rte-stylefield'><div class='e-img-border-field'><input type='text' data-role ='none'  title='" + this._getLocalizedLabels("tableBorder") + "' class='e-inputtext e-numerictextbox' maxlength='3'  " + this._TagId("_eTblRBrdrPx") + "></div><div class='e-img-border-field'><select " + this._TagId("_eTblRBrdrStyle") + " data-role ='none' class='e-rte-dropdown'><option value='solid'>" + this._getLocalizedLabels("solid") + "</option><option value='dotted'>" + this._getLocalizedLabels("dotted") + "</option><option value='dashed'>" + this._getLocalizedLabels("dashed") + "</option><option value='double'>" + this._getLocalizedLabels("doubled") + "</option></select></div><div class='e-img-border-field'><input type='text' data-role ='none'  title='" + this._getLocalizedLabels("tableBorder") + "' class='e-inputtext' " + this._TagId("_eTblRBrdrColor") + "></div></div></div>" +
                    "<div class='e-img-field-group'><div class='e-rte-tablefields'><label " + this._labelFor("_eTblRStyle") + ">" + this._getLocalizedLabels("imageStyle") + " </label></div><div class='e-rte-stylefield'><input type='text' data-role ='none'  class='e-inputtext' " + this._TagId("_eTblRStyle") + "></div></div>" +
            "</div>" +
            "<div id='" + rteID + "_eTblCell'>" +
                    "<div class='e-rte-tablefields'><label " + this._labelFor("_eTblClWidth") + ">" + this._getLocalizedLabels("tableWidth") + "</label></div><div class='e-rte-tablefields'><input type='text' data-role ='none'  class='e-inputtext' " + this._TagId("_eTblClWidth") + "></div>" +
                    "<div class='e-rte-tablefields'><label " + this._labelFor("_eTblClAlign") + ">" + this._getLocalizedLabels("textAlign") + "</label></div><div class='e-rte-tablefields'><select " + this._TagId("_eTblClAlign") + " data-role ='none'  class='e-rte-dropdown'><option value='left'>" + this._getLocalizedLabels("left") + "</option><option value='right'>" + this._getLocalizedLabels("right") + "</option><option value='center'>" + this._getLocalizedLabels("center") + "</option></select></div>" +
                    "<div class='e-img-field-group'><div class='e-rte-tablefields'><label " + this._labelFor("_eTblClBrdrPx") + ">" + this._getLocalizedLabels("tableBorder") + "</label></div><div class='e-rte-stylefield'><div class='e-img-border-field'><input type='text' data-role ='none'  title='" + this._getLocalizedLabels("tableBorder") + "' class='e-inputtext e-numerictextbox' maxlength='3' " + this._TagId("_eTblClBrdrPx") + " ></div><div class='e-img-border-field'><select " + this._TagId("_eTblClBrdrStyle") + " data-role ='none' class='e-rte-dropdown'><option value='solid'>" + this._getLocalizedLabels("solid") + "</option><option value='dotted'>" + this._getLocalizedLabels("dotted") + "</option><option value='dashed'>" + this._getLocalizedLabels("dashed") + "</option><option value='double'>" + this._getLocalizedLabels("doubled") + "</option></select></div><div class='e-img-border-field'><input type='text' data-role ='none'  title='" + this._getLocalizedLabels("tableBorder") + "' class='e-inputtext' " + this._TagId("_eTblClBrdrColor") + "></div></div></div>" +
                    "<div class='e-img-field-group'><div class='e-rte-tablefields'><label " + this._labelFor("_eTblClStyle") + ">" + this._getLocalizedLabels("imageStyle") + " </label></div><div class='e-rte-stylefield'><input type='text' data-role ='none'  class='e-inputtext' " + this._TagId("_eTblClStyle") + "></div></div>" +
            "</div>" +
            "</div>" +
            "<div class='e-rte-button e-fieldseparate'><button class='e-rte-btn " + btnDiv + "' data-role ='none' id='" + rteID + "_eTbl_apply'>" + this._getLocalizedLabels("dialogApply") + "</button><button class='e-rte-btn " + btnDiv + "' data-role ='none' id='" + rteID + "_eTbl_cancel'>" + this._getLocalizedLabels("dialogCancel") + "</button></div>"
            );
            content.appendTo(this._eTblDialog);
            this._tblborderPicker = this._eTblDialog.find("#"+this._rteId +"_eTbl_border_color").ejColorPicker({ locale:this.model.locale,cssClass: this.model.cssClass, modelType: "palette", buttonText: { apply: this._getLocalizedLabels("buttonApply"), cancel: this._getLocalizedLabels("buttonCancel"), swatches: this._getLocalizedLabels("swatches") } }).data('ejColorPicker');
            this._eTblDialog.appendTo(this._rteWapper);
            var model = this._getDialogModel();
            model.width = "auto";
            model.title = this._getLocalizedLabels("editTable");
            model.target = null;
            model.showRoundedCorner = this.model.showRoundedCorner;
            model.closeIconTooltip = this._getLocalizedLabels("closeIcon");
            model.close = function () {
                proxy._ieCursorMaintainance();
            };
            this._eTblDialog.ejDialog(model);
            this._eTblDialog.closest(".e-dialog-wrap").addClass("e-rte e-edittable");
            this.model.showRoundedCorner && this._eTblDialog.find(".e-inputtext").addClass('e-corner-all');
            this._eTblDialog.find(".e-numerictextbox").ejNumericTextbox({ enableRTL: this.model.enableRTL, cssClass: this.model.cssClass, width: "100%", minValue: 0, value: 0, showRoundedCorner: this.model.showRoundedCorner, locale:this.model.locale  });
            this._eTblDialog.find(".e-rte-dropdown").ejDropDownList({ enableRTL: this.model.enableRTL, cssClass: this.model.cssClass, width: "100%", showRoundedCorner: this.model.showRoundedCorner, locale:this.model.locale  });
            this._eTblAlign = this._getTableObj("Align").data('ejDropDownList');
            this._eTblAlign.option('enabled', false);
            this._getTableObj("_Tab").ejTab({ enableRTL: this.model.enableRTL, cssClass: this.model.cssClass, width: "100%", enabled: true, showRoundedCorner: this.model.showRoundedCorner });
            this._eTblCaption = this._getTableObj("Caption");
            this._eTblCaption.ejCheckBox({ enableRTL: this.model.enableRTL, cssClass: this.model.cssClass, showRoundedCorner: this.model.showRoundedCorner });
            this._eTblDialog.find(".e-rte-btn").ejButton({ enableRTL: this.model.enableRTL, type: "button", cssClass: this.model.cssClass, showRoundedCorner: this.model.showRoundedCorner });
            this._on(this._eTblDialog.find(".e-rte-btn"), "click", this._eTblBtnClick);
            this.model.showRoundedCorner && this._subControlsSetModel();
        },

        _drawTable: function (tableDiv) {
            var rowDiv, tableCell;
            for (var row = 0; row < this.model.tableRows ; row++) {
                rowDiv = ej.buildTag("div.e-rtetablerow");
                for (var col = 0; col < this.model.tableColumns; col++) {
                    tableCell = ej.buildTag("div.e-rte-tablecell e-default");
                    tableCell.appendTo(rowDiv);
                }
                rowDiv.appendTo(tableDiv);
            }
        },


        _renderSourceDialog: function () {
            var proxy = this;
            this._sourceDialog = ej.buildTag("div.e-rte-source#" + this._rteId + "_Source");
            var btnDiv = (this.model.enableRTL) ? "e-rtlrte" : "";
            var content = $("<textarea class='e-rte-srctextarea e-inputtext'></textarea><div class='e-rte-button e-fieldseparate'><button id='src_update' data-role ='none' class='e-rte-btn " + btnDiv + "'>" + this._getLocalizedLabels("dialogUpdate") + "</button><button id='src_cancel' class='e-rte-btn " + btnDiv + "'>" + this._getLocalizedLabels("dialogCancel") + "</button></div>");
            content.appendTo(this._sourceDialog);
            var model = this._getDialogModel();
            model.title = this._getLocalizedLabels("viewHtml");
            model.width = "auto";
			model.minWidth="330px";
            model.target = null;
            model.showRoundedCorner = this.model.showRoundedCorner;
            model.close = function () {
                proxy._ieCursorMaintainance();
            };
            model.closeIconTooltip = this._getLocalizedLabels("closeIcon");
            this._sourceDialog.ejDialog(model);
			this._sourceDialog.closest(".e-dialog-wrap").addClass("e-rte e-sourcedialog")
            this.model.showRoundedCorner && this._sourceDialog.find(".e-inputtext").addClass('e-corner-all');
            this._sourceDialog.find(".e-rte-btn").ejButton({ enableRTL: this.model.enableRTL, type: "button", cssClass: this.model.cssClass, showRoundedCorner: this.model.showRoundedCorner });
            this._on(this._sourceDialog.find(".e-rte-btn"), "click", this._srcBtnClick)
        },


        _renderAlertDialog: function () {
            var proxy = this;
            this._alertWindow = ej.buildTag("div#" + this._rteId + "_Alert");
            var content = $("<p class='e-alerttext' style='margin:0.875em 0em;'></p><div class='e-rte-button e-fieldseparate'><button data-role ='none' class='e-rte-btn e-alert-ok' type='button'>" + this._getLocalizedLabels("dialogOk") + "</button><button class='e-rte-btn e-alert-cancel' data-role='none'>" + this._getLocalizedLabels("dialogCancel") + "</button></div>");
            content.appendTo(this._alertWindow);
            var model = this._getDialogModel();
            model.showHeader = false;
            model.width = "auto";
            model.target = null;
            model.showRoundedCorner = this.model.showRoundedCorner;
            model.close = function () {
                proxy._ieCursorMaintainance();
            };
            model.minHeight = "50px";
            this._alertWindow.ejDialog(model);
            this._alertWindow.closest(".e-dialog-wrap").addClass("e-rte");
            this._alertWindow.find(".e-rte-btn").ejButton({ enableRTL: this.model.enableRTL, type: "button", cssClass: this.model.cssClass, showRoundedCorner: this.model.showRoundedCorner });
            this._on(this._alertWindow.find(".e-rte-btn"), "click", this._alertBtnClick)
            this._alertWindow.find(".e-alert-cancel").hide();
        },

        _alertBtnClick: function (e) {
            if ($.trim(this._alertWindow.find(".e-alerttext").html()) == this._getLocalizedLabels("deleteAlert") && $(e.target).hasClass("e-alert-ok")) {
                this._getDocument().body.innerHTML = " ";
				this._emptyContent();
                if (this.model.showToolbar)
                    this._toolBarObj.selectItemByID(this._rteId + "_" + "justifyLeft");
                this._setBackupData();
                this._updateCount();
                var selectNode = (this._isIE()) ? this._currentSelNode : this._getSelectedNode();
                this._updateTagInfo(selectNode);
                this._onChange();
            }
            this._alertWindow.ejDialog("close");
            this._alertWindow.find(".e-alert-cancel").hide();
        },

		_emptyContent: function (){
			var setNode,tempSpanNode = document.createElement("span");
			tempSpanNode.innerHTML = "&#65279;"
			 var range = this._getDocument().createRange(), Selection = this._getDocument().getSelection();
			 this._getDocument().body.firstChild && this._getDocument().body.firstChild.remove();
                this._getDocument().body.appendChild(setNode=this._getDocument().createElement("p"));
                setNode.appendChild(this._getDocument().createElement("br"));
				setNode.appendChild(tempSpanNode);
				Selection.removeAllRanges();
                range.setStart(tempSpanNode.firstChild, 0);
                range.setEnd(tempSpanNode.firstChild, 0);
                Selection.addRange(range);
                $(this._getDocument().body).find('p span').remove();
		},
        _openAlert: function (alertText) {
            this._alertWindow.find(".e-alerttext").html(alertText);
            this._alertWindow.ejDialog("instance")._centerPosition();
            $("#" + this._rteId + "_Alert_wrapper").css({ "z-index": this._onGetMaxZindex() });
            this._alertWindow.ejDialog("open");
        },


        _renderFormat: function () {
            this._formatDDL = ej.buildTag("input#" + this._rteId + "_formatDDL", "", "", { type: "text", title: this._getLocalizedLabels("format"), "data-role": "none" });
            var defaultText = [
                { text: "paragraph", value: "<p>" },
                { text: "quotation", value: "<blockquote>" },
                { text: "heading1", value: "<h1>" },
                { text: "heading2", value: "<h2>" },
                { text: "heading3", value: "<h3>" },
                { text: "heading4", value: "<h4>" },
                { text: "heading5", value: "<h5>" },
                { text: "heading6", value: "<h6>" }];
            var model = {};
            model.dataSource = this._formatText(this.model.format, defaultText);
            model.width = "105px";
            model.enableRTL = this.model.enableRTL;
            model.popupWidth = "175px";
            model.popupHeight = "auto";
            model.selectedItemIndex = 0;
            model.select = this._formatChange;
            model.cssClass = "e-rte-format-ddl";
            model.showRoundedCorner = this.model.showRoundedCorner;
            model.fields = { text: "text", value: "value", spriteCssClass: "spriteCssClass" };
            this._formatDDL.appendTo(this._rteToolbar.find("li.e-rteItem-format").html(""));
            this._formatDDL.ejDropDownList(model);
            this._formatPopupStyle();
        },

        _formatText: function (formatSource, formatText) {
            for (var i = 0; i < formatSource.length; i++)
                for (var j = 0; j < formatText.length; j++)
                    if (formatSource[i].value == formatText[j].value) {
                        formatSource[i].text = this._getLocalizedLabels(formatText[j].text) ? this._getLocalizedLabels(formatText[j].text) : formatSource[i].text;
                        break;
                    }
            return formatSource;
        },

        _formatPopupStyle: function () {
            var _liList = this._formatDDL.data("ejDropDownList").popupPanelWrapper.find("li");
            for (var i = 0; i < _liList.length; i++) {
                $(_liList[i]).addClass(this.model.format[i].spriteCssClass);
            }
        },


        _renderFontStyle: function () {
            this._fontStyleDDL = ej.buildTag("input#" + this._rteId + "_fontNameDDL", "", "", { type: "text", title: this._getLocalizedLabels("fontName"), "data-role": "none" });
            var defaultText = [
				{ text: "timesnewroman", value: "Times New Roman,Times,serif" },
			    { text: "segoeui", value: "Segoe UI" },
				{ text: "arial", value: "Arial,Helvetica,sans-serif" },
				{ text: "couriernew", value: "Courier New,Courier,monospace" },
				{ text: "georgia", value: "Georgia,serif" },
				{ text: "impact", value: "Impact,Charcoal,sans-serif" },
                { text: "lucidaconsole", value: "Lucida Console,Monaco,monospace" },
                { text: "tahoma", value: "Tahoma,Geneva,sans-serif" },
                { text: "trebuchetms", value: "Trebuchet MS,Helvetica,sans-serif" },
                { text: "verdana", value: "Verdana,Geneva,sans-serif" }
            ];
            var model = {};
            model.dataSource = this._formatText(this.model.fontName, defaultText);
            model.enableRTL = this.model.enableRTL;
            model.selectedItemIndex = 0;
			model.htmlAttributes={datafontid:""+this._rteId};
            model.select = this._fontStyleChange;
            model.showRoundedCorner = this.model.showRoundedCorner;
            model.fields = { text: "text", value: "value" };
            this._fontStyleDDL.appendTo(this._rteToolbar.find("li.e-rteItem-fontName").html(""));
            this._fontStyleDDL.ejDropDownList(model);
        },


        _renderFontSize: function () {
            this._fontSizeDDL = ej.buildTag("input#" + this._rteId + "_fontSizeDDL", "", "", { type: "text", title: this._getLocalizedLabels("fontSize"), "data-role": "none" });
            var model = {};
            model.dataSource = this.model.fontSize;
            model.width = "100px";
            model.enableRTL = this.model.enableRTL
            model.selectedItemIndex = 2;
			model.htmlAttributes={datafontid:""+this._rteId};
            model.select = this._fontSizeChange;
            model.showRoundedCorner = this.model.showRoundedCorner;
            model.fields = { text: "text", value: "value" };
            this._fontSizeDDL.appendTo(this._rteToolbar.find("li.e-rteItem-fontSize").html(""));
            this._fontSizeDDL.ejDropDownList(model);
        },


        _renderFontColor: function () {
            var proxy = this;
            this._fontColorSplit = ej.buildTag("button#" + this._rteId + "_fontColorbtn", "", {}, { type: "button", "data-role": "none" });
            var _liTemplte = $("<ul id='" + this._rteId + "_colorTable' class='e-rte-colorpalette'><li></li></ul>");
            _liTemplte.find("li").append(this._colorTable());
            var model = {};
            model.width = "42px";
            model.contentType = "textandimage";
            model.targetID = this._rteId + "_colorTable";
            model.enableRTL = this.model.enableRTL;
            model.prefixIcon = this._rteIconsList["fontColor"];
            model.showRoundedCorner = this.model.showRoundedCorner;
            this._fontColorSplit.appendTo(this._rteToolbar.find("li.e-rteItem-fontColor").html(""));
            var oldWrapper = $("#" + this._rteId + "_colorTable").get(0);
            if (oldWrapper) {
                if ($(oldWrapper).parent().hasClass("e-menu-wrap"))
                    $(oldWrapper).parent().remove();
                else
                    $(oldWrapper).remove();
            }
			 var FontColors = $("<div class='customcolor e-rte-customcolor' " + this._TagId("_customcolor") + "><a class='customcolor-link' role='button' title='" + this._getLocalizedLabels("customFontColor") + "'>" + this._getLocalizedLabels("customFontColor") + "</a></div>");
             _liTemplte.append(FontColors);
            _liTemplte.appendTo(this._rteToolbar.find("li.e-rteItem-fontColor"));
			 this._on(FontColors, "click", this._openColorpalette);
            this._fontColorSplit.ejSplitButton(model);
            this._splitObj = this._fontColorSplit.ejSplitButton("instance");
            this._splitObj.option("beforeOpen", function () { proxy._bindClickOperation("FontColor"); });
            this._on(this._fontColorSplit, "click", this._fontColorClick);
            this._fontColorSplit.find("span." + this._rteIconsList["fontColor"]).removeClass("e-icon");
            this._fontColorSplit.find("span.e-btntxt").css("background-color", this._fontColor);
        },
        _renderUnOrderList: function () {
            var proxy = this;
            this._unOrderSplit = ej.buildTag("button#" + this._rteId + "_unorder", "", {}, { type: "button", "data-role": "none" });
            this._unorderLiTemplate = ej.buildTag("ul#" + this._rteId + "_unorderlist", "", { "height": "auto", "width": "84px" }, { "class": "e-rte-unorderlistname" });
            $("<li id='none' title='" + this._getLocalizedLabels("none") + "' style='float:left;width:50%;'><span class='e-rte-toolbar-icon e-rte-unlistitems e-nonelist-icon'></span></li><li id='disc' title='" + this._getLocalizedLabels("disc") + "' style='float:left;width:50%;'><span class='e-rte-toolbar-icon e-rte-unlistitems e-disclist-icon'></span></li><li id='square' title='" + this._getLocalizedLabels("square") + "' class='square' style='float:left;width:50%;'><span class='e-rte-toolbar-icon e-rte-unlistitems e-squarelist-icon'></span></li><li id='circle' title='" + this._getLocalizedLabels("circle") + "' style='float:left;width:50%;'><span class='e-rte-toolbar-icon e-rte-unlistitems e-circlelist-icon'></span></li>").appendTo(this._unorderLiTemplate);
            if (!ej.isNullOrUndefined(proxy.model.tools["customUnorderedList"]))
                $.each(proxy.model.tools["customUnorderedList"], function (i, val) {
                    if (i == 0) $(proxy._unorderLiTemplate).find("#circle,#square").attr("class", "e-liseparator");
                    $("<li id='" + (val["name"] ? val["name"] : ("ulcustom" + i)) + "' class='" + (val["css"] ? val["css"] : "") + "' title='" + (val["tooltip"] ? val["tooltip"] : "") + "' style='float:left;width:100%;'>" + (val["text"] ? val["text"] : "") + "</li>").appendTo(proxy._unorderLiTemplate);
                });
            var model = {};
            model.width = "42px";
            model.contentType = "imageonly";
            model.targetID = this._rteId + "_unorderlist";
            model.enableRTL = this.model.enableRTL;
            model.prefixIcon = "e-icon e-rte-toolbar-icon " + this._rteIconsList["unorderedList"];
            model.showRoundedCorner = this.model.showRoundedCorner;
            model.itemSelected = $.proxy(this._onUnorderList, this);
            this._unOrderSplit.appendTo(this._rteToolbar.find("li.e-rteItem-unorderedList").html(""));
            var oldWrapper = $("#" + this._rteId + "_unorderlist").get(0);
            if (oldWrapper) {
                if ($(oldWrapper).parent().hasClass("e-menu-wrap"))
                    $(oldWrapper).parent().remove();
                else
                    $(oldWrapper).remove();
            }
            this._unorderLiTemplate.appendTo((this._rteToolbar.parents("body").length > 0 ? this._rteToolbar.find("li.e-rteItem-unorderedList") : $('body')));
            this._unOrderSplit.ejSplitButton(model);
            this._unOrderSplitObj = this._unOrderSplit.ejSplitButton("instance");
            this._unOrderSplit.find("span.e-unorderedList-icon").removeClass("e-icon");
            this._on(this._unOrderSplit, "click", this._onUnorderList);
        },
        _renderOrderList: function () {
            var proxy = this;
            this._orderSplit = ej.buildTag("button#" + this._rteId + "_order", "", {}, { type: "button", "data-role": "none" });
            this._orderLiTemplate = ej.buildTag("ul#" + this._rteId + "_orderlist", "", { "height": "auto", "width": "124.05px" }, { "class": "e-rte-orderlistname" });
            $("<li id='none' title='" + this._getLocalizedLabels("none") + "' style='float:left;width:33.33%;'><span class='e-rte-toolbar-icon e-rte-listitems e-nonelist-icon'></span></li><li id='decimal' title='" + this._getLocalizedLabels("number") + "' style='float:left;width:33.33%;'><span class='e-rte-toolbar-icon e-rte-listitems e-numbering-icon'></span></li><li id='lower-alpha' title='" + this._getLocalizedLabels("loweralpha") + "'  style='float:left;width:33.33%;'><span class='e-rte-toolbar-icon e-rte-listitems e-loweralpha-icon'></span></li><li id='lower-roman' title='" + this._getLocalizedLabels("lowerroman") + "' style='float:left;width:33.33%;'><span class='e-rte-toolbar-icon e-rte-listitems e-lowerroman-icon'></span></li><li id='upper-alpha' title='" + this._getLocalizedLabels("upperalpha") + "' style='float:left;width:33.33%;'><span class='e-rte-toolbar-icon e-rte-listitems e-upperalpha-icon'></span></li><li id='upper-roman' title='" + this._getLocalizedLabels("upperroman") + "' style='float:left;width:33.33%;'><span class='e-rte-toolbar-icon e-rte-listitems e-upperroman-icon'></span></li>").appendTo(this._orderLiTemplate);
            if (!ej.isNullOrUndefined(proxy.model.tools["customOrderedList"]))
                $.each(proxy.model.tools["customOrderedList"], function (i, val) {
                    if (i == 0) $(proxy._orderLiTemplate).find("#upper-roman,#upper-alpha,#lower-roman").attr("class", "e-liseparator");
                    $("<li id='" + (val["name"] ? val["name"] : ("olcustom" + i)) + "' class='" + (val["css"] ? val["css"] : "") + "' title='" + (val["tooltip"] ? val["tooltip"] : "") + "' style='float:left;width:100%;'>" + (val["text"] ? val["text"] : "") + "</li>").appendTo(proxy._orderLiTemplate);
                });
            var model = {};
            model.width = "42px";
            model.contentType = "imageonly";
            model.enableRTL = this.model.enableRTL;
            model.showRoundedCorner = this.model.showRoundedCorner;
            model.targetID = this._rteId + "_orderlist";
            model.prefixIcon = "e-icon e-rte-toolbar-icon " + this._rteIconsList["orderedList"];
            model.itemSelected = $.proxy(this._onOrderList, this);
            this._orderSplit.appendTo(this._rteToolbar.find("li.e-rteItem-orderedList").html(""));
            var oldWrapper = $("#" + this._rteId + "_orderlist").get(0);
            if (oldWrapper) {
                if ($(oldWrapper).parent().hasClass("e-menu-wrap"))
                    $(oldWrapper).parent().remove();
                else
                    $(oldWrapper).remove();
            }
            this._orderLiTemplate.appendTo((this._rteToolbar.parents("body").length > 0 ? this._rteToolbar.find("li.e-rteItem-orderedList") : $('body')));
            this._orderSplit.ejSplitButton(model);
            this._orderSplitObj = this._orderSplit.ejSplitButton("instance");
            this._on(this._orderSplit, "click", this._onOrderList);
        },
        _renderBGColor: function () {
            var proxy = this;
            this._bgColorSplit = ej.buildTag("button#" + this._rteId + "_backgroundColorbtn", "", {}, { type: "button", "data-role": "none" });
            var _liTemplte = $("<ul id='" + this._rteId + "_colorBGTable' class='e-rte-colorpalette'><li></li></ul>");
            _liTemplte.find("li").append(this._colorTable());
			this._bgTransparent=$("<button id='"+this._rteId+"_backgroundtransparentbtn'class='e-rte-transbtn' role='button' title='"+this._getLocalizedLabels("TransBGColor")+"'>"+this._getLocalizedLabels("TransBGColor") + "</button>");
			var model = {};
            model.width = "42px";
            model.contentType = "textandimage";
            model.targetID = this._rteId + "_colorBGTable";
            model.enableRTL = this.model.enableRTL;
            model.prefixIcon = this._rteIconsList["backgroundColor"];
            model.showRoundedCorner = this.model.showRoundedCorner;
			var BGColors = $("<div class='customBGcolor e-rte-customcolor' " + this._TagId("_customBGcolor") + "><a class='customcolor-link ' role='button' title='" + this._getLocalizedLabels("customBGColor") + "'>" + this._getLocalizedLabels("customBGColor") + "</a></div>");
             _liTemplte.append(BGColors);
			 this._on(BGColors, "click", this._openColorpalette);
			this._bgTransparent.prependTo(_liTemplte);
			this._bgColorSplit.appendTo(this._rteToolbar.find("li.e-rteItem-backgroundColor").html(""));
            var oldWrapper = $("#" + this._rteId + "_colorBGTable").get(0);
            if (oldWrapper) {
                if ($(oldWrapper).parent().hasClass("e-menu-wrap"))
                    $(oldWrapper).parent().remove();
                else
                    $(oldWrapper).remove();
            }
            _liTemplte.appendTo(this._rteToolbar.find("li.e-rteItem-backgroundColor"));
            this._bgColorSplit.ejSplitButton(model);
			this._bgTransparent.ejButton({width:"100%",contentType:"text",targetID:this._rteId+"_colorBGTable",showRoundercorner:this.model.showRounderCorner});
			this._bgObj=this._bgTransparent.ejButton("instance");
			 this._on(this._bgTransparent, "click", this._bgTransClick);
            this._bgSplitObj = this._bgColorSplit.ejSplitButton("instance");
            this._bgSplitObj.option("beforeOpen", function () { proxy._bindClickOperation("BGColor"); });
            this._on(this._bgColorSplit, "click", this._bgColorClick);
            this._bgColorSplit.find("span." + this._rteIconsList["backgroundColor"]).removeClass("e-icon");
            this._bgColorSplit.find("span.e-btntxt").css("background-color", this._bgColor);
        },
        _bindClickOperation: function (toolName) {
            var proxy = this, SplitMenu;
            var splitObj = toolName == "BGColor" ? proxy._bgSplitObj : proxy._splitObj;
            var element = toolName == "BGColor" ? "_backgroundColorbtn" : "_fontColorbtn";
			var tblelement=toolName == "BGColor" ? "_colorBGTable" : "_colorTable";
            SplitMenu = $("#" + proxy._rteId + element).ejSplitButton("instance");
            toolName == "BGColor" ? proxy._bgSplitMenu = SplitMenu : proxy._splitMenu = SplitMenu;
            SplitMenu.model.close = function () {
                splitObj.contstatus = false;
                proxy._off($("#" + proxy._rteId + tblelement).find("div.e-rte-palettetable"), "click", toolName == "BGColor" ? proxy._bgColorPaletteClick : proxy._colorPaletteClick);
            }
            proxy._on($("#" + proxy._rteId + tblelement).find("div.e-rte-palettetable"), "click", toolName == "BGColor" ? proxy._bgColorPaletteClick : proxy._colorPaletteClick);
        },
        _colorTable: function () {
            var tableDiv = ej.buildTag("div.e-rte-table");
            var color = 0, hexCode, rowDiv, tableCell;
            for (var row = 0; row < this.model.colorPaletteRows ; row++) {
                rowDiv = ej.buildTag("div.e-rtetablerow");
                for (var col = 0; col < this.model.colorPaletteColumns ; col++) {
                    if (color < this.model.colorCode.length) {
                        hexCode = "#" + this.model.colorCode[color];
                        tableCell = ej.buildTag("div.e-rte-palettetable", "", { "background-color": hexCode }, { title: hexCode, "color-code": hexCode });
                        tableCell.appendTo(rowDiv);
                        color++;
                    }
                }
                rowDiv.appendTo(tableDiv);
            }
            return tableDiv;
        },

        _recalcVideoSize: function (e) {
            var txtWidth, txtheight, newWidth, newHeight;
            txtWidth = this._videoDialog.find(".e-rte-videoX");
            txtheight = this._videoDialog.find(".e-rte-videoY");

            newWidth = txtWidth.val();
            newHeight = txtheight.val();
            if (this._chkvideoDimensions.ejCheckBox("isChecked") && !!this._videoWidth && !!this._videoHeight && !!newWidth && !!newHeight) {
                if (e.target.id == txtWidth[0].id) {
                    newHeight = Math.round((newWidth / this._videoWidth) * newHeight);
                    txtheight.val(newHeight);
                } else {
                    newWidth = Math.round((newHeight / this._videoHeight) * newWidth);
                    txtWidth.val(newWidth);
                }
            }
            this._videoWidth = newWidth;
            this._videoHeight = newHeight;
        },


        _recalcImgSize: function (e) {
            var txtWidth, txtheight, newWidth, newHeight;
            txtWidth = this._imgDialog.find(".e-rte-imgX");
            txtheight = this._imgDialog.find(".e-rte-imgY");

            newWidth = txtWidth.val();
            newHeight = txtheight.val();

            if (this._chkImgDimensions.ejCheckBox("isChecked") && !!this._imgWidth && !!this._imgHeight && !!newWidth && !!newHeight) {
                if (e.target.id == txtWidth[0].id) {
                    newHeight = Math.round((newWidth / this._imgWidth) * newHeight);
                    txtheight.val(newHeight);
                } else {
                    newWidth = Math.round((newHeight / this._imgHeight) * newWidth);
                    txtWidth.val(newWidth);
                }
            }
            this._imgWidth = newWidth;
            this._imgHeight = newHeight;
        },

        _urlValidation: function (e) {
            var _target = $(e.target);
            _target.hasClass("e-error") && _target.removeClass("e-error");
        },
        _ieLinkRange: function () {
            var rang = this._getRange();
            if (!this._isIE() && !this._isIE8()) {
                !ej.isNullOrUndefined(this._currentSelNode) && this._currentSelNode.nodeName.toLowerCase() != "html"
                this._selectionRange = rang;
            }
            else {
                !ej.isNullOrUndefined(this._currentSelNode) && this._currentSelNode.nodeName.toLowerCase() != "html" && rang.setStart(this._currentSelNode, this._currentSelNode.childNodes.length)
                this._selectionRange = rang;
            }
        },
        _ieCursorMaintainance: function () {
            if (!this._isIE8()) {
                this._ieLinkRange();
                this._focus();
            }
            else
                this._setRange(this._currentSelNode, this._getDocument().body.createTextRange(), true);
        },
        _linkBtnClick: function (sender) {
            if (sender.target.id === "link_cancel") {
                this._clearLinkFields();
                this._linkDialog.ejDialog("close");
                this._ieCursorMaintainance();
            }
            else if (sender.target.id === "link_insert") {
                if (this._isIE() && !this._isIE8()) this._ieLinkRange();
                this._restoreSelection(this._selectionRange);
                if (this._txtURL.val() != "")
                    this._onInsertLink();
                else {
                    this._onUnlink();
                    this._linkDialog.ejDialog("close");
                }
                this._trigger("execute", { commandName: "hyperlink" });
                this._onChange();
                this._setBackupData();
            }
        },

        _imageBtnClick: function (sender) {
            if (sender.target.id === this._rteId + "_img_cancel") {
                this._imgDialog.ejDialog("close");
                this._ieCursorMaintainance();
            }
            else if (sender.target.id === this._rteId + "_img_insert") {
                var imageVal = this._imgURL.val().match(/(ftp:|http:|https:)\/\//g);
                if ((ej.isNullOrUndefined(imageVal) && this._imgURL.val() !== "") || (!ej.isNullOrUndefined(imageVal) && imageVal[0].length < this._imgURL.val().length)) {
                    (this.model.maxLength != null && this.model.maxLength > $.trim(this._getText()).length) ? this._onInsertImage() : this._imgDialog.ejDialog("close");
                    this._onChange();
                    this._setBackupData();
                } else {
                    this._imgURL.addClass("e-error");
                    if (!this._isUrl($.trim(this._imageLink.val()))) this._imageLink.addClass("e-error");
                    return false;
                }
            }
        },


        _srcBtnClick: function (sender) {
            if (sender.target.id === "src_update") {
                var _editHTML = $.trim(this._sourceDialog.find("textarea.e-rte-srctextarea")[0].value);
                if (this.model.enableHtmlEncode)
                    _editHTML = this._decode(_editHTML);
                try {
                    this._getDocument().documentElement.innerHTML = _editHTML.replace("<html>", "").replace("</html>", "");
                    if (this.model.enableXHTML)
                        this._getDocument().documentElement.innerHTML = this._updateXhtml();
                }
                catch (e) {
                    var regEX = /<body[^>]*>((.|[\n\r])*)<\/body>/i;
                    if (!ej.isNullOrUndefined(regEX.exec(_editHTML))) {
                        _editHTML = regEX.exec(_editHTML)[1];
                        this._getDocument().body.innerHTML = _editHTML;
                    }
                }
                this._onChange();
                this._updateCount();
            }
            this._sourceDialog.find("textarea.e-rte-srctextarea")[0].value = "";
            var _tableEle = $(this._getDocument()).find("table.e-rte-table");
            if (!this.model.enableRTL) this._on(_tableEle, "mouseover", this._tableMouseOver);
            this._sourceDialog.ejDialog("close");
            this._showHideContextMenu();
        },

        _eTblBtnClick: function (sender) {
            if (sender.target.id === this._rteId + "_eTbl_cancel") {
                this._eTblDialog.ejDialog("close");
                this._ieCursorMaintainance();
            }
            else if (sender.target.id === this._rteId + "_eTbl_apply") {
                if (this._isIE() && !this._isIE8()) this._ieLinkRange();
                this._oneditTable();
                this._onChange();
                this._setBackupData();
            }
        },

        _insertCustomTable: function (sender) {
            this._customTableValidation = false;
            if (sender.target.id === "insert") {
                var cols = this._customTableDialog.find(".e-rte-txtColumns").ejNumericTextbox("getValue");
                var row = this._customTableDialog.find(".e-rte-txtRows").ejNumericTextbox("getValue");
                var height = this._customInputValidation(this._customTableDialog.find(".e-rte-txtHeight"));
                var width = this._customInputValidation(this._customTableDialog.find(".e-rte-txtWidth"));
                var align = this._customTableDialog.find(".e-rte-ddlAlignment").ejDropDownList("getSelectedValue");
                var spacing = this._customInputValidation(this._customTableDialog.find(".e-rte-txtSpacing"));
                var padding = this._customInputValidation(this._customTableDialog.find(".e-rte-txtPadding"));
                var border = this._customTableDialog.find(".e-rte-txtBorder").ejDropDownList("getSelectedValue");
                var caption = this._chkTblCaption.ejCheckBox("isChecked");
                if (!this._customTableValidation) {
                    if (!ej.isNullOrUndefined(this._tableInsertAt) && !ej.isNullOrUndefined(this._tableInsertAt.startContainer))
                        this._restoreSelection(this._tableInsertAt);
                    var tableEle = this._tableGenerator(row, cols, false, width, height, spacing, padding, align, border, caption);
                    this.executeCommand('inserthtml', tableEle);
                    var _tableEle = $(this._getDocument()).find("table.e-rte-table");
                    var drpDwnObj = this._customTableDialog.find(".e-rte-ddlAlignment").data("ejDropDownList");
                    if (drpDwnObj.option('value') == "Center")
                        _tableEle.attr('style', "margin: 0 auto");
                    if (!this.model.enableRTL) this._on(_tableEle, "mouseover", this._tableMouseOver);
                    this._onChange();
                    drpDwnObj.option({ value: "", enabled: false });
                }
                this._on(this._customTableDialog.find(".e-rte-txtHeight"), "keypress", this._urlValidation)
				._on(this._customTableDialog.find(".e-rte-txtWidth"), "keypress", this._urlValidation)
				._on(this._customTableDialog.find(".e-rte-txtSpacing"), "keypress", this._urlValidation)
				._on(this._customTableDialog.find(".e-rte-txtPadding"), "keypress", this._urlValidation);

            }
            if (!this._customTableValidation) {
                this._customTableDialog.ejDialog("close");
                this._clearTableFields();
                this._ieCursorMaintainance();
            }
        },

        _customInputValidation: function (validation) {
            var value = validation.val().toLowerCase();
            var lastPos = value.substr(value.length - 2, 2);
            var specChar = value.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]/gi);
            var alphaChar = value.match(/[a-z]/gi);
            if (((!isNaN(value) && (specChar == null || specChar.length == 0)) || (value.length > 1 && value.substr(value.length - 1, 1) == "%" && specChar.length == 1) && (alphaChar == null || alphaChar.length == 0)) || (value.length > 2 && (specChar == null || specChar.length == 0) && (alphaChar != null && alphaChar.length == 2) && (lastPos == "px" || lastPos == "in" || lastPos == "cm" || lastPos == "mm" || lastPos == "em" || lastPos == "ex" || lastPos == "pt" || lastPos == "pc")))
                return value;
            else {
                validation.addClass("e-error");
                this._customTableValidation = true;
                return 0;
            }
        },

        _clearTableFields: function () {
            this._customTableDialog.find(".e-rte-txtColumns").ejNumericTextbox("option", "value", 3);
            this._customTableDialog.find(".e-rte-txtRows").ejNumericTextbox("option", "value", 3);
            this._customTableDialog.find(".e-rte-txtHeight").val("");
            this._customTableDialog.find(".e-rte-txtWidth").val("");
            this._customTableDialog.find(".e-rte-ddlAlignment").ejDropDownList("clearText");
            this._customTableDialog.find(".e-rte-txtSpacing").val("");
            this._customTableDialog.find(".e-rte-txtPadding").val("");
            var border = this._customTableDialog.find(".e-rte-txtBorder").ejDropDownList("clearText");
            var caption = this._chkTblCaption.ejCheckBox({ check: false });
        },

        _clearEditTableFields: function () {
            this._eTblHeight = this._eTblDialog.find("input").val("");
            this._eTblDialog.find(".e-numerictextbox").data("ejNumericTextbox").option("value", "");
            this._eTblDialog.find(".e-rte-dropdown").data("ejDropDownList").option("value", "");
            this._eTblAlign.disable();
            this._eTblCaption.ejCheckBox({ check: false });
        },

        _clearLinkFields: function () {
            this._txtURL = this._linkDialog.find(".e-rte-linkUrl");
            this._txtURL.removeClass("e-error");
            this._txtURL.val("http://");
            this._txtLinkText = this._linkDialog.find(".e-rte-linkText");
            this._txtLinkText.val("");
            this._txtLinkTitle = this._linkDialog.find(".e-rte-linkTitle");
            this._txtLinkTitle.val("");
            this._chkTarget.ejCheckBox({ checked: false });
            this._txtURL.focus();
        },
        _textFieldFocus: function (ele, start, end) {
            if (!this._isIE8()) ele.setSelectionRange(start, end);
            else {
                var range = ele.createTextRange();
                range.collapse(true);
                range.moveEnd('character', start);
                range.moveStart('character', end);
                range.select();
            }
        },
        _clearImgFields: function () {
            this._imgURL = this._imgDialog.find(".e-rte-imgUrl").val("http://").removeClass("e-error");
            this._imgDialog.find(".e-rte-imgText").val("");
            this._chkImgDimensions.ejCheckBox({ checked: true });
            this._imageLink = this._imgDialog.find(".e-rte-imgLink");
            this._imageLink.removeClass("e-error");
            this._imageLink.val("");
            this._imageBorderPx = this._imgDialog.find(".e-rte-imgBorderPx").data('ejNumericTextbox');
            this._imageBorderPx.option('value', 0);
            this._imageBorderStyle = this._imgDialog.find(".e-rte-imgBorderStyle").data('ejDropDownList');
            this._imageBorderStyle.option('value', "");
            this._imgPicker.option('value', null);
            this._imgDialog.find('.e-selected-color').removeAttr('style');
            this._imageStyle = this._imgDialog.find(".e-rte-imgStyle");
            this._imageStyle.val("");
            this._dialogchkTarget.ejCheckBox({ check: false });
        },

        _videoManager: function () {
            this._renderVideoDialog();
            var selectNode = this._getSelectedNode();
            this._editVideo = null;
            this._getPasteRangeVal();
            if (selectNode && !ej.isNullOrUndefined(selectNode.tagName)) {
                this._editVideo = selectNode;
                this._videoWidth = parseInt($(selectNode).width());
                this._videoHeight = parseInt($(selectNode).width());
                if (this.model.showDimensions) {
                    this._videoDialog.find(".e-rte-videoX").val(this._videoWidth);
                    this._videoDialog.find(".e-rte-videoY").val(this._videoHeight);
                }
            }
            $("#" + this._rteId + "_video_wrapper").css({ "z-index": this._onGetMaxZindex() });
            this._videoDialog.ejDialog("open");
            this._videoDialog.find("textarea.e-rte-video").focus();
        },

        _sourceCodeManager: function () {
            ej.isNullOrUndefined(this._sourceDialog) && this._renderSourceDialog();
            this._updateTagInfo("body");
            this._hideTooltip();
            if (!ej.isNullOrUndefined(this._getDocument().documentElement)) {
                this._sourceDialog.find("textarea.e-rte-srctextarea")[0].value = (this.model.enableHtmlEncode) ? this._encode(this._getDocument().documentElement.outerHTML) : this._getDocument().documentElement.outerHTML;
                $("#" + this._rteId + "_Source_wrapper").css({ "z-index": this._onGetMaxZindex() });
                this._sourceDialog.ejDialog("open");
                this._sourceDialog.find("textarea.e-rte-srctextarea").focus();
            }
            else
                this._htmlSource.addClass("e-disable");
        },
        _getPasteRangeVal: function () {
            if (this._isIE()) {
                this._pasteRangeVal = this._getRange();
                this._pasteFlag = true;
            }
        },
        _hyperLinkManager: function (filebrowser) {
            this._renderLinkDialog();
            filebrowser && this._renderFileBrowserDialog();
            this._getPasteRangeVal();
            var selectNode = (this._isIE()) ? this._currentSelNode : this._getSelectedNode();

            this._selectedHTML = (ej.browserInfo().name === "msie" && ej.browserInfo().version === "11.0") ? this._pasteRangeVal.toString() : this._getSelText();
            if (filebrowser) {
                this._clearFileFields();
                (!ej.isNullOrUndefined(selectNode) && selectNode.tagName.toUpperCase() == 'A') ? this._fileLinkText.val($(selectNode).html()) : this._fileLinkText.val(this._selectedHTML);
                $("#" + this._rteId + "_fileDialog_wrapper").css({ "z-index": this._onGetMaxZindex() });
                this._fileDialog.ejDialog("open");
            }
            else {
                this._clearLinkFields();
                (!ej.isNullOrUndefined(selectNode) && selectNode.tagName.toUpperCase() == 'A') ? this._txtLinkText.val($(selectNode).html()) : this._txtLinkText.val(this._selectedHTML);
                $("#" + this._rteId + "_link_wrapper").css({ "z-index": this._onGetMaxZindex() });
                this._linkDialog.ejDialog("open");
                if((!ej.isNullOrUndefined(selectNode) && selectNode.tagName.toUpperCase() == 'A') && selectNode.getAttribute('target') === '_blank' )
                    this._chkTarget.ejCheckBox({ checked: true });
                this._textFieldFocus(this._txtURL[0], this._txtURL.val().length, this._txtURL.val().length);
            }

            if (selectNode && !(/^(A)$/).test(selectNode.nodeName)) {
                if (selectNode.tagName.toUpperCase() == "IMG")
                    selectNode = $(selectNode).parent('a')[0];
            }
            if (filebrowser) {
                if (selectNode && (/^(A)$/).test(selectNode.nodeName)) this._fileURL.val(selectNode.href);
            }
            else if (selectNode && (/^(A)$/).test(selectNode.nodeName)) {
                this._txtURL.val(selectNode.href);
                this._txtLinkTitle.val(selectNode.title);
            }
        },
        _tableManager: function () {
            var tableLi = this._rteToolbar.find("li.e-rteItem-createTable"), Xpos, Ypos;
            this._getPasteRangeVal();
            if (this._getSelectedNode().nodeName.toLowerCase() == "td")
                this._createTable.find("div.e-rte-eTblProperties").removeClass('e-disable');
            if (this.model.isResponsive && tableLi.length == 0) {
                var border = $(this._toolBarObj._liTemplte).outerHeight() - $(this._toolBarObj._liTemplte).height();
                tableLi = this._toolBarObj._liTemplte.find("li.e-rteItem-createTable");
                $("#" + this._rteId + "_table_wrapper").css({ "visibility": "hidden", "display": "block" });
                Ypos = ($(this._toolBarObj._liTemplte).offset().top + $(this._toolBarObj._liTemplte).outerHeight() + border - $("#" + this._rteId + "_table_wrapper").offsetParent().offset().top);
                if($(tableLi).offset().left>230)
                   Xpos = ($(tableLi).offset().left - $("#" + this._rteId + "_table_wrapper").offsetParent().offset().left);
				else
				   Xpos =$("#" + this._rteId + "_table_wrapper").offsetParent().offset().left;
                $("#" + this._rteId + "_table_wrapper").css({ "visibility": "visible" });
            }
            else
                Xpos = $(tableLi).position().left, Ypos = $(tableLi).position().top + tableLi.height() + 7;
            if (((parseInt(Xpos) + parseInt($("#" + this._id + "_table_wrapper").css("width"))) > document.body.clientWidth) || ((parseInt(Xpos) + parseInt($("#" + this._id + "_table_wrapper").css("width"))) > parseInt($("#" + this._id + "_wrapper").css("width")) + $("#" + this._id + "_wrapper").position().left)) Xpos = (parseInt(Xpos) - (parseInt($("#" + this._id + "_table_wrapper").css("width")) - $(tableLi).width())) + "px";
            var top = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
            if (top < Ypos && $(window).height() < (Ypos - top + parseInt($("#" + this._id + "_table_wrapper").css("height"))))
                Ypos = (parseInt($("#" + this._id + "_table_wrapper").css("height")) > $(window).height()) ? top : ($(window).height() - parseInt($("#" + this._id + "_table_wrapper").css("height"))) > 0 ? (($(window).height() - parseInt($("#" + this._id + "_table_wrapper").css("height")) + top)-7) : top;
            var parentOffset=this._rteWapper.offset();
		    Xpos=parseInt(Xpos)-parseInt(parentOffset["left"]);
			Ypos=parseInt(Ypos)-parseInt(parentOffset["top"]);
			this._createTable.ejDialog("option", "position", { X: Xpos, Y: Ypos });
            this._createTable.ejDialog("open");
            this._on(ej.getScrollableParents(this._createTable), "scroll", function () {
                this._createTable.ejDialog("close");
            });
        },
        _eTblManager: function () {
            this._renderEditTableDialog();
            this._clearEditTableFields();
            var rteID = this._rteId;
            var isTable = $(this._getSelectedNode()).closest("td");
            var selectNode = (isTable.length > 0) ? isTable[0] : this._currentSelNode;
            if (!ej.isNullOrUndefined(selectNode) && selectNode.tagName.toLowerCase() === "td") {
                var parentTable = $(selectNode).closest('tbody').closest('table');
                this._getTableObj("Height").val($(parentTable).height());
                this._getTableObj("Width").val($(parentTable).width());
                if (!ej.isNullOrUndefined(parentTable[0])) {
                    this._getTableObj("CellSpace").data('ejNumericTextbox').option('value', parentTable[0].cellSpacing);
                    this._getTableObj("CellPad").data('ejNumericTextbox').option('value', parentTable[0].cellPadding);
                    var align = parentTable[0].align;
                }
                if (!ej.isNullOrUndefined(align) && align != "") {
                    this._eTblAlign.enable();
                    this._eTblAlign.option('value', align);
                }
                var captionEle = $($(selectNode).closest('tbody')).prev('caption');
                if (captionEle.length > 0)
                    this._eTblCaption.ejCheckBox({ checked: true });
                if (!ej.isNullOrUndefined(parentTable[0]) && parentTable[0].style != "") {
                    this._getTableObj("BrdrPx").data('ejNumericTextbox').option('value', parentTable[0].style.borderWidth.split('px')[0]);
                    var obj = this._getTableObj("_border_style").data('ejDropDownList');
                    (parentTable[0].style.borderStyle != "") ? obj.selectItemByValue(parentTable[0].style.borderStyle) : obj.option({ selectedItemIndex: 0 });
                    this._getTableObj("_border_color").val(parentTable[0].style.borderColor);
                }
                this._getTableObj("Style").val(parentTable.attr('style'));


                var parentRow = $(selectNode).closest('tr');
                this._getTableObj("RHeight").val($(parentRow).height());
                this._getTableObj("RAlign").data('ejDropDownList').option('value', parentRow[0].style.textAlign);
                if (parentRow[0].style != "") {
                    this._getTableObj("RBrdrPx").data('ejNumericTextbox').option('value', parentRow[0].style.borderWidth.split('px')[0]);
                    var obj = this._getTableObj("RBrdrStyle").data('ejDropDownList');
                    (parentRow[0].style.borderStyle != "") ? obj.selectItemByValue(parentRow[0].style.borderStyle) : obj.option({ selectedItemIndex: 0 });
                    this._getTableObj("RBrdrColor").val(parentRow[0].style.borderColor);
                }
                this._getTableObj("RStyle").val(parentRow.attr('style'));
                this._getTableObj("ClWidth").val($(selectNode).width());
                this._getTableObj("ClAlign").data('ejDropDownList').option('value', selectNode.style.textAlign);
                if (selectNode.style != "") {
                    this._getTableObj("ClBrdrPx").data('ejNumericTextbox').option('value', selectNode.style.borderLeftWidth.split('px')[0]);
                    var obj = this._getTableObj("ClBrdrStyle").data('ejDropDownList');
                    (selectNode.style.borderStyle != "") ? obj.selectItemByValue(selectNode.style.borderStyle) : obj.option({ selectedItemIndex: 0 });
                    this._getTableObj("ClBrdrColor").val(selectNode.style.borderColor);
                }
                this._getTableObj("ClStyle").val($(selectNode).attr('style'));
            }
        },

        _getTableObj: function (value) {
            return this._eTblDialog.find('#' + this._rteId + "_eTbl" + value);
        },

        _imageManager: function () {
            this._renderImageDialog();
            this._clearImgFields();
            var selectNode = (this._isIE()) ? this._currentSelNode : this._getSelectedNode();
            this._getPasteRangeVal();
            if (selectNode && !ej.isNullOrUndefined(selectNode)) {
                this._imgWidth = parseInt($(selectNode).width());
                this._imgHeight = parseInt($(selectNode).height());
                if (this.model.showDimensions) {
                    this._imgDialog.find(".e-rte-imgX").val(this._imgWidth);
                    this._imgDialog.find(".e-rte-imgY").val(this._imgHeight);
                }
                var linkNode = $(selectNode).parent('a');
                if (linkNode.length > 0)
                    this._imageLink.val(linkNode.attr('href'));
                if (selectNode.tagName.toLowerCase() === "img") {
                    this._imgDialog.find(".e-rte-imgUrl").val(selectNode.src);
                    this._imgDialog.find(".e-rte-imgText").val(selectNode.alt);
                    if (selectNode.style != "") {
                        this._imageBorderPx.option('value', selectNode.style.borderWidth.split('px')[0]);
                        this._imageBorderStyle.option('value', selectNode.style.borderStyle);
                        if (selectNode.style.borderColor.length > 0) {
                            if (ej.browserInfo().name === "msie" && ej.browserInfo().version === "8.0") this._imgPicker.option('value', selectNode.style.borderColor);
                            else {
                                var colorCode = selectNode.style.borderColor.split("(")[1].split(")")[0];
                                colorCode = colorCode.split(",");
                                colorCode = { r: $.trim(colorCode[0]), g: $.trim(colorCode[1]), b: $.trim(colorCode[2]) };
                                this._imgPicker.option('value', this._imgPicker.RGBToHEX(colorCode));
                            }
                        }
                    }
                    this._imageStyle.val($(selectNode).attr('style'));
                }
            }
            $("#" + this._rteId + "_Image_wrapper").css({ "z-index": this._onGetMaxZindex() });
            this._imgDialog.ejDialog("open");
            this._textFieldFocus(this._imgURL[0], this._imgURL.val().length, this._imgURL.val().length);
            if (ej.isNullOrUndefined(this._explorerObj)) this._imgDialog.find(".e-rte-imgUrl").focus();
        },
        _getValidbrowser: function (name) {
            switch (name) {
                case "chrome":
                    return ej.browserInfo().version < 42
                    break;
                case "mozilla":
                    return ej.browserInfo().version < 41
                    break;
                case "opera":
                    return ej.browserInfo().version < 29
                    break;
                default:
                    return true;
                    break;
            }
        },
        _alertHeader: function (rteInstcne) {
            rteInstcne._alertWindow.ejDialog("option", "showHeader", false);
            this.model.enableRTL && !this._alertWindow.find(".e-alert-ok").hasClass("e-rte-alertBtnRTL") && this._alertWindow.find(".e-alert-ok").addClass("e-rte-alertBtnRTL");
            rteInstcne._alertWindow.find(".e-rte-button").css({ "text-align": "", "padding-bottom": "", "padding-top": "" }).addClass("e-fieldseparate");
            rteInstcne._alertWindow.ejDialog("instance").refresh();
        },
        _toolBarClick: function (sender) {
            if (sender.event && ((sender.event.which && sender.event.which == 3) || (sender.event.button && sender.event.button == 2)))
                return;
            var $rteEle = $(this.itemsContainer).closest("div.e-rte").find("textarea.e-rte"), rteInstcne = $rteEle.ejRTE("instance"), rteId = $rteEle.attr('id');
            var _itemId = ej.isNullOrUndefined(rteId) ? sender.currentTarget.id.replace("_", "") : sender.currentTarget.id.replace(rteId + "_", "");
            rteInstcne._alertHeader(rteInstcne);
            if (ej.browserInfo().name === "mozilla") rteInstcne._getDocument().designMode = "off";
            if ($(sender.currentTarget).hasClass("e-rteItem-copy") && !rteInstcne._isIE() && rteInstcne._getValidbrowser(ej.browserInfo().name))
                rteInstcne._openAlert(rteInstcne._getLocalizedLabels("copyAlert"));
            else if ($(sender.currentTarget).hasClass("e-rteItem-cut") && !rteInstcne._isIE() && rteInstcne._getValidbrowser(ej.browserInfo().name))
                rteInstcne._openAlert(rteInstcne._getLocalizedLabels("cutAlert"));
            else if ($(sender.currentTarget).hasClass("e-rteItem-paste") && !rteInstcne._isIE())
                rteInstcne._openAlert(rteInstcne._getLocalizedLabels("pasteAlert"));
            else {
                if (ej.browserInfo().name != "chrome") {
                    var index = rteInstcne._scriptsItems.indexOf(_itemId);
                    if (rteInstcne._scriptsItems.indexOf(_itemId) >= 0 && $("#" + rteId + "_" + rteInstcne._scriptsItems[index == 0 ? 1 : 0]).hasClass("e-active"))
                        rteInstcne._selectCommand(rteId + "_" + rteInstcne._scriptsItems[index == 0 ? 1 : 0]);
                }
                    var commandName = $.grep(sender.currentTarget.children[0].className.split(/\s+/), function (a) {
                        return !/^e-(rteItem|rte-toolbar-icon)$/i.test(a)
                    });
                if (commandName.indexOf("e-split") >= 0 || commandName.indexOf("e-ddl") >= 0)
                    commandName[0] = _itemId;
                rteInstcne._selectCommand(commandName[0]);
            }

            if (rteInstcne._styleItems.indexOf(_itemId) >= 0 || rteInstcne._scriptsItems.indexOf(_itemId) >= 0) {
                if (!$(sender.currentTarget).hasClass("e-isactive"))
                    this.selectItemByID(sender.currentTarget.id);
                else
                    this.deselectItemByID(sender.currentTarget.id);
                $(sender.currentTarget).hasClass("e-isactive") ? $(sender.currentTarget).removeClass("e-isactive") : $(sender.currentTarget).addClass("e-isactive");
                if (rteInstcne._scriptsItems.indexOf(_itemId) >= 0) {
                    var index = rteInstcne._scriptsItems.indexOf(_itemId);
                    $("#" + rteId + "_" + rteInstcne._scriptsItems[index == 0 ? 1 : 0]).removeClass("e-isactive");
                    this.deselectItemByID(rteId + "_" + rteInstcne._scriptsItems[index == 0 ? 1 : 0]);
                }
            }


            else if (rteInstcne._alignItems.indexOf(_itemId) >= 0) {
                this.selectItemByID(sender.currentTarget.id);
                var index = rteInstcne._alignItems.indexOf(_itemId)
                for (var i = 0; i < rteInstcne._alignItems.length; i++) {
                    if (i != index)
                        this.deselectItemByID(rteId + "_" + rteInstcne._alignItems[i]);
                }
            }

            else if (rteInstcne._listItems.indexOf(_itemId) >= 0) {
                if (!$(sender.currentTarget).hasClass("e-isactive"))
                    this.selectItemByID(sender.currentTarget.id);
                else
                    this.deselectItemByID(sender.currentTarget.id);
                $(sender.currentTarget).hasClass("e-isactive") ? $(sender.currentTarget).removeClass("e-isactive") : $(sender.currentTarget).addClass("e-isactive");
                var index = rteInstcne._listItems.indexOf(_itemId);
                $("#" + rteId + "_" + rteInstcne._listItems[index == 0 ? 1 : 0]).removeClass("e-isactive");
                if (index == 0)
                    this.deselectItemByID(rteId + "_" + rteInstcne._listItems[1]);
                else
                    this.deselectItemByID(rteId + "_" + rteInstcne._listItems[0]);
            }
        },

        _toggleEditTable: function () {
            if (this._isIE8())
                this._getRange().parentElement&& (this._currentSelNode = this._getRange().parentElement());
            var isTable = $(this._getSelectedNode()).closest("table");
            var selTag = (isTable.length > 0) ? isTable[0] : this._getSelectedNode(), _eTblItems;
            if (ej.isNullOrUndefined(selTag)) return false;
            if (!ej.isNullOrUndefined(this._toolBarItems)) {
                var items = this._rteToolbar.find("li.e-rteItem-addColumnLeft,li.e-rteItem-addColumnRight,li.e-rteItem-addRowAbove,li.e-rteItem-addRowBelow,li.e-rteItem-deleteRow,li.e-rteItem-deleteColumn,li.e-rteItem-deleteTable");
                if (this.model.isResponsive && items.length == 0)
                    _eTblItems = this._toolBarObj._liTemplte.find("li.e-rteItem-addColumnLeft,li.e-rteItem-addColumnRight,li.e-rteItem-addRowAbove,li.e-rteItem-addRowBelow,li.e-rteItem-deleteRow,li.e-rteItem-deleteColumn,li.e-rteItem-deleteTable");
                else _eTblItems = this._toolBarItems.find("li.e-rteItem-addColumnLeft,li.e-rteItem-addColumnRight,li.e-rteItem-addRowAbove,li.e-rteItem-addRowBelow,li.e-rteItem-deleteRow,li.e-rteItem-deleteColumn,li.e-rteItem-deleteTable");
                if (!ej.isNullOrUndefined(selTag.tagName)) {
                    if (selTag && selTag.tagName && selTag.tagName.toLowerCase() == "td" || selTag.tagName.toLowerCase() == "table" || selTag.tagName.toLowerCase() == "tr") {
                        _eTblItems.show();
                        this._createTable && this._createTable.find("div.e-rte-eTblProperties").removeClass('e-disable');
                    }
                    else if (!ej.isNullOrUndefined(this._createTable)) {
                        _eTblItems.hide();
                        this._createTable.find("div.e-rte-eTblProperties").addClass('e-disable');
                    }
                }
            }
            if (this.model.isResponsive && this.model.showToolbar) this._toolBarObj._reSizeHandler();
            if (!this.model.autoHeight ||(this._toolBarObj && $(this._toolBarObj.itemsContainer.find("." + this._rteIconsList["resize"])).length))
                this._setIframeHeight();
        },


        _formatChange: function (args) {
            if (args.isInteraction) {
                var $rteEle = $(this.element).closest("div.e-rte").find("textarea.e-rte"), rteInstcne = $rteEle.ejRTE("instance"), rteId = $rteEle.attr('id');
                args.value !== "" && rteInstcne._onFormatBlock(args.value);
                rteInstcne._isIE() && rteInstcne._focus();
                rteInstcne._onChange();
				rteInstcne._setBackupData();
            }

        },


        _fontStyleChange: function (args) {
            if (args.isInteraction) {
			     var $rteEle;
               (this.element.closest("div").hasClass("e-normal"))? $rteEle = $("textarea#"+args.model.htmlAttributes.datafontid):$rteEle = this.element.closest("div.e-rte").find("textarea.e-rte");
				var rteInstcne = $rteEle.ejRTE("instance"), rteId = $rteEle.attr('id');
                rteInstcne._focus();
                args.value !== "" && rteInstcne._onFontName(args.value);
                rteInstcne._onChange();
				rteInstcne._setBackupData();
            }
        },


        _fontSizeChange: function (args) {
            if (args.isInteraction) {
                var $rteEle;
               (this.element.closest("div").hasClass("e-normal"))? $rteEle = $("textarea#"+args.model.htmlAttributes.datafontid):$rteEle = this.element.closest("div.e-rte").find("textarea.e-rte");
				var rteInstcne = $rteEle.ejRTE("instance"), rteId = $rteEle.attr('id');
                rteInstcne._focus();
                args.value !== "" && rteInstcne._onFontSize(args.value);
                rteInstcne._onChange();
				rteInstcne._setBackupData();
            }
        },


        _colorPaletteClick: function (e) {
            var value;
            if ((value = e.target.getAttribute('color-code'))) {
                this._focus();
                this._onFontColor(value);
                this._splitMenu.hide(e);
                this._fontColor = value;
                this._fontColorSplit.find("span.e-btntxt").css("background-color", value);
				this._onChange();
				this._setBackupData();
            }
        },


        _bgColorPaletteClick: function (e) {
            var value;
            if ((value = e.target.getAttribute('color-code'))) {
                this._focus();
                this._onBGColor(value);
                this._bgSplitMenu.hide(e);
                this._bgColor = value;
                this._bgColorSplit.find("span.e-btntxt").css("background-color", value);
				this._onChange();
				this._setBackupData();
            }
        },

        _fontColorClick: function (e) {
            this._onFontColor(this._fontColor);
            if (ej.isNullOrUndefined(this._splitMenu)) return false;
            this._splitMenu.hide(e);
        },

		_bgTransClick:function(e)
		{
		    this._getDocumentHandler() && this._operationHandler.execCommand(ej.execCommand.backcolor, "transparent");
            this._trigger("execute", { commandName: "backColor" });
			this._bgColorSplit.find("span.e-btntxt").css("background-color", "transparent");
		    if (!ej.isNullOrUndefined(this._bgSplitMenu));
            this._bgSplitMenu.hide(e);
			this._bgColor="transparent";
		},
        _bgColorClick: function (e) {
            this._onBGColor(this._bgColor);
            if (ej.isNullOrUndefined(this._bgSplitMenu)) return false;
            this._bgSplitMenu.hide(e);
        },

        _selectCommand: function (selectedId) {
			$(this._imgDupDiv).remove();
            $(this._imgOrg).css("outline","");
                if (ej.browserInfo().name != "edge" && !(selectedId == "format" || selectedId == "fontName" || selectedId == "fontSize" || selectedId == "fontColor" || selectedId == "backgroundColor" || selectedId == "createTable" )) {
                this._focus();
            }
            switch (selectedId) {
                case "fullScreen":
                    this._onFullScreen();
                    break;
                case "print":
                    this._onPrint();
                    break;
                case "import":
                    this._onImport();
                    break;
                case "wordExport":
                    this._onExportToWord();
                    break;
                case "pdfExport":
                    this._onExportToPdf();
                    break;
                case "findAndReplace":
                    if (ej.RTE.FindAndReplace)
                        this._showFindAndReplace();
                    break;
                case "bold":
                    this._onBold();
                    break;
                case "italic":
                    this._onItalics();
                    break;
                case "underline":
                    this._onUnderLine();
                    break;
                case "strikethrough":
                    this._onStrikeThrough();
                    break;
                case "justifyLeft":
                    this._onJustifyLeft();
                    break;
                case "justifyRight":
                    this._onJustifyRight();
                    break;
                case "justifyCenter":
                    this._onJustifyCenter();
                    break;
                case "justifyFull":
                    this._onJustifyFull();
                    break;
                case "cut":
                    this._onCut();
                    break;
                case "copy":
                    this._onCopy();
                    break;
                case "paste":
                    this._onPaste();
                    break;
                case "clearFormat":
                    this._onClearFormat();
                    break;
                case "clearAll":
                    this._clearAllManager();
                    break;
                case "orderedList":
                case "unorderedList":
                    this._getPasteRangeVal();
                    break;
                case "undo":
                    this._undo();
                    break;
                case "redo":
                    this._redo();
                    break;
                case "indent":
                    this._onIndent();
                    this._indentdepth++;
                    break;
                case "outdent":
                    this._onOutdent();
                    if (this._indentdepth > 0)
                        this._indentdepth--;
                    break;
                case "createLink":
                    this._hyperLinkManager(false);
                    break;
                case "removeLink":
                    this._onUnlink();
                    break;
                case "image":
                    this._imageManager();
                    break;
                case "createTable":
                    (!this._createTable.ejDialog("isOpen")) ? this._tableManager() : this._createTable.ejDialog("close");
                    break;
                case "addRowAbove":
                    this.insertRow(true);
                    break;
                case "addRowBelow":
                    this.insertRow(false);
                    break;
                case "addColumnLeft":
                    this.insertColumn(true);
                    break;
                case "addColumnRight":
                    this.insertColumn(false);
                    break;
                case "deleteRow":
                    this.removeRow();
                    break;
                case "deleteColumn":
                    this.removeColumn();
                    break;
                case "deleteTable":
                    this.removeTable();
                    break;
                case "superscript":
                    this._onSuperScript();
                    break;
                case "subscript":
                    this._onSubScript();
                    break;
                case "upperCase":
                    this._onUpperCase();
                    break;
                case "lowerCase":
                    this._onLowerCase();
                    break;
                case "video":
                    this._videoManager();
                    break;
                case "fileBrowser":
                    this._hyperLinkManager(true);
                    break;
                default:
                    this._onChange();
                    break;
            }
            if (selectedId != "createLink" && selectedId != "image" && selectedId != "video" && selectedId != "createTable") {
                this._onChange();
            }
            if ((selectedId != "undo") && (selectedId != "redo"))
                this._setBackupData();
            var selectEle = (this._isIE()) ? this._currentSelNode : this._getSelectedNode();
            this._updateTagInfo(selectEle);
        },
        _focus: function () {
          var  browserInfo = ej.browserInfo();
            if (browserInfo.name == "webkit")
                this._getWindow().focus();
            else
                this._getWindow().document.body.focus();
            this._restoreSelection(this._selectionRange);
        },
        _getWindow: function () {
            var iframe = $($(this._rteWapper.find(".content-iframe"))[0].contentWindow)[0];
            return iframe;
        },
        _getDocument: function () {
            var iframe = this._rteWapper.find(".content-iframe");
            try {
                return iframe.contents()[0];
            }
            catch (err) {
                return "";
            }
        },
        _onFullScreen: function () {
            if (!$(this._toolBarObj.itemsContainer.find("." + this._rteIconsList["resize"])).length) {
                this._rteOffset = $(this._rteWapper).position();
                this._rtePosition = $(this._rteWapper).css("position");
                $(this._rteWapper).css({ "top": "0px", "left": "0px", "width": "100%", "height": "100%", "position": "fixed", "z-index": this._onGetMaxZindex() });
                $("body").css("overflow", "hidden");
                $(this._toolBarObj.itemsContainer.find("." + this._rteIconsList["maximize"])).removeClass(this._rteIconsList["maximize"]).addClass(this._rteIconsList["resize"]).parent("li").attr("data-content", this._getLocalizedLabels("resize"));
            }
            else {
                $(this._rteWapper).css({ "top": this._rteOffset.top, "left": this._rteOffset.left, "width": this._rteWidth, "height": this._rteHeight, "position": this._rtePosition, "z-index": "" });
                $("body").css("overflow", "");
                $(this._toolBarObj.itemsContainer.find("." + this._rteIconsList["resize"])).addClass(this._rteIconsList["maximize"]).removeClass(this._rteIconsList["resize"]).parent("li").attr("data-content", this._getLocalizedLabels("maximize"));
            }
            if ($(this._getDocument()).find("table.e-rte-table").length > 0) this._removeResizeObject();
            this._setAutoHeight();
            if (this.model.showToolbar && this.model.isResponsive) this._toolBarObj._reSizeHandler();
            this._setIframeHeight();
            if (!ej.isNullOrUndefined(this._createTable))
                this._createTableClose();
        },
        _onGetMaxZindex: function () {
            return Math.max.apply(null,
                  $.map($('body *'), function (e, n) {
                      return parseInt($(e).css('z-index')) + 1 || 1;
                  }));
        },
        _onZooming: function (_proxy) {
            _proxy._zoomValue = 0;
            var size = Number(_proxy.getDocument().body.style.zoom == "" || ej.isNullOrUndefined(_proxy.getDocument().body.style.zoom) ? 1 : _proxy.getDocument().body.style.zoom);
            var zoomStep = (isNaN(_proxy.model.zoomStep) && _proxy.model.zoomStep.indexOf("%") != -1) ? parseInt(_proxy.model.zoomStep) / 100 : Number(_proxy.model.zoomStep);
            _proxy._zoomValue = (_proxy._zoomArgs == "IN") ? size + zoomStep : ((size - zoomStep) > 0.1) ? size - zoomStep : 0.1;
            $(_proxy.getDocument().body).css({ "zoom": _proxy._zoomValue, "transform": "scale(" + _proxy._zoomValue + ")", "transform-origin": "0 0", "-o-transform": "scale(" + _proxy._zoomValue + ")", "-o-transform-origin": "0 0", "-webkit-transform": "scale(" + _proxy._zoomValue + ")", "-webkit-transform-origin": "0 0" });
            $(_proxy._toolBarObj.itemsContainer.find(".e-rteItem-zoomIn")).attr("title", _proxy._getLocalizedLabels("zoomIn") + " " + Math.round(_proxy._zoomValue * 100) + "%");
            $(_proxy._toolBarObj.itemsContainer.find(".e-rteItem-zoomOut")).attr("title", _proxy._getLocalizedLabels("zoomOut") + " " + Math.round(_proxy._zoomValue * 100) + "%");
            if (_proxy._isIE()) return _proxy;
        },
        _onKeyZoom: function (args) {
            var _proxy = this;
            this._mouseStillDown = true;
            this._zoomArgs = args;
            this._setInterval = setInterval(_proxy._onZooming(_proxy), 100);
        },
        _onPrint: function () {
            var _proxy = this;
            if (this._isIE() || ej.browserInfo().name === "mozilla") this._getWindow().onafterprint = function () { $(_proxy.getDocument().body).css({ "zoom": ((_proxy._zoomValue) ? _proxy._zoomValue : 1), "transform": "scale(" + ((_proxy._zoomValue) ? _proxy._zoomValue : 1) + ")", "transform-origin": "0 0", "-o-transform": "scale(" + ((_proxy._zoomValue) ? _proxy._zoomValue : 1) + ")", "-o-transform-origin": "0 0", "-webkit-transform": "scale(" + ((_proxy._zoomValue) ? _proxy._zoomValue : 1) + ")", "-webkit-transform-origin": "0 0" }); };
            else _proxy._getWindow().matchMedia('print').addListener(function (args) {
                if (!args.matches) $(_proxy.getDocument().body).css({ "zoom": ((_proxy._zoomValue) ? _proxy._zoomValue : 1), "transform": "scale(" + ((_proxy._zoomValue) ? _proxy._zoomValue : 1) + ")", "transform-origin": "0 0", "-o-transform": "scale(" + ((_proxy._zoomValue) ? _proxy._zoomValue : 1) + ")", "-o-transform-origin": "0 0", "-webkit-transform": "scale(" + ((_proxy._zoomValue) ? _proxy._zoomValue : 1) + ")", "-webkit-transform-origin": "0 0" });
            });
            $(_proxy.getDocument().body).css({ "zoom": "", "transform": "", "-o-transform": "", "-webkit-transform": "" });
            this._getWindow().print();
        },
        _renderimport: function () {
            var divEle = ej.buildTag("div#" + this._id + "_importUpload", "", "", ""), url = this.model.importSettings.url + "?rteid=" + this._id;
            this._rteToolbar.find("li.e-rteItem-import").append(divEle);
            divEle.ejUploadbox({
                multipleFilesSelection: false, width: "0px", height: "0px", autoUpload: true, extensionsAllow: ".docx,.doc", showBrowseButton: false, buttonText: { browse: this._id }, showFileDetails: false, saveUrl: url,
                success: function (args) {
                    var rteID = args.model.buttonText.browse, rteObj = $("#" + rteID).data("ejRTE"), htmlText = args.responseText, iframe = $(rteObj._getDocument().body);
                    htmlText = htmlText.replace('<string xmlns="http://schemas.microsoft.com/2003/10/Serialization/">', '').replace('</string>', '').replace(/"/gi, '');
                    iframe.children().remove();
                    iframe.append($.parseHTML(htmlText));
                }
            });
            divEle.addClass("e-browse-hide");
        },
        _onImport: function () {
            this._toolBarItems.find("div#" + this._id + "_importUpload").find('input[type=file]').trigger("click");
			if(this.model.isResponsive)$("div#" + this._id + "_toolbar_hiddenlist").find("div#" + this._id + "_importUpload").find('input[type=file]').trigger("click"); 
        },
        _onExportToWord: function () {
            var str = this._getDocument().body, url = this.model.exportToWordSettings.url, htmlText = str.innerHTML, formAttr = { action: url + "?rteid=" + this._id, method: "post" }, formEle = ej.buildTag("form", "", null, formAttr), textAttr = { name: this._id + "_inputVal", type: "hidden", value: htmlText }, textEle = ej.buildTag("input", "", null, textAttr), textAttr2 = { name: this._id + "_inputFile", type: "hidden", value: this.model.exportToWordSettings.fileName }, textEle2 = ej.buildTag("input", "", null, textAttr2);
            $("body").append(formEle.append(textEle).append(textEle2));
            formEle.submit();
            formEle.remove();
        },
        _onExportToPdf: function () {
            var str = this._getDocument().body, url = this.model.exportToPdfSettings.url, htmlText = str.innerHTML, formAttr = { action: url + "?rteid=" + this._id, method: "post" }, formEle = ej.buildTag("form", "", null, formAttr), textAttr = { name: this._id + "_inputVal", type: "hidden", value: htmlText }, textEle = ej.buildTag("input", "", null, textAttr), textAttr2 = { name: this._id + "_inputFile", type: "hidden", value: this.model.exportToPdfSettings.fileName }, textEle2 = ej.buildTag("input", "", null, textAttr2);
            $("body").append(formEle.append(textEle).append(textEle2));
            formEle.submit();
            formEle.remove();
        },
        _zoomUp: function (e) {
            if (e && ((e.which && e.which == 3) || (e.button && e.button == 2)))
                return;
            if (this._setInterval) {
                this._mouseStillDown = false;
                clearInterval(this._setInterval);
                this._setInterval = null;
            }
        },
        _zoomDown: function (e) {
            if (e && ((e.which && e.which == 3) || (e.button && e.button == 2)))
                return;
            var _proxy = this;
            _proxy._mouseStillDown = true;
            _proxy._zoomArgs = $(e.target).hasClass("e-rte-toolbar-icon zoomIn " + this._rteIconsList["zoomIn"]) || $(e.target).hasClass("e-rteItem-zoomIn") ? "IN" : "OUT";
            if (e.type == "mousedown") _proxy._setInterval = setInterval(function () { _proxy._onZooming(_proxy); }, 100);
            else _proxy._setInterval = setInterval(_proxy._onZooming(_proxy), 100);
        },
        _onBold: function () {
            var args;
            if (this._isIE8())
                this.executeCommand('bold', args);
            else
            {
                this._getDocumentHandler() && this._operationHandler.execCommand(ej.execCommand.bold, null);
                this._trigger("execute", { commandName: "bold" });
            }
        },

        _onItalics: function () {
            var args;
            if (this._isIE8())
                this.executeCommand('italic', args);
            else
            {
                this._getDocumentHandler() && this._operationHandler.execCommand(ej.execCommand.italic, null);
                this._trigger("execute", { commandName: "italic" });
            }

        },
        _onStrikeThrough: function () {
            var args;
            if (this._isIE8())
                this.executeCommand('strikethrough', args);
            else
            {
                this._getDocumentHandler() && this._operationHandler.execCommand(ej.execCommand.strikethrough, null);
                this._trigger("execute", { commandName: "strikethrough" });
            }
        },

        _onUnderLine: function () {
            var args;
            if (this._isIE8())
                this.executeCommand('underline', args);
            else
            {
                this._getDocumentHandler() && this._operationHandler.execCommand(ej.execCommand.underline, null);
                this._trigger("execute", { commandName: "underline" });
            }
        },

        _onJustifyLeft: function () {
            var args;
            if (this._isIE8())
                this.executeCommand('JustifyLeft', args);
            else
            {
                this._getDocumentHandler() && this._operationHandler.execCommand(ej.execCommand.justifyleft, null);
                this._trigger("execute", { commandName: "JustifyLeft" });
            }
        },

        _onJustifyRight: function () {
            var args;
            if (this._isIE8())
                this.executeCommand('JustifyRight', args);
            else
            {
                this._getDocumentHandler() && this._operationHandler.execCommand(ej.execCommand.justifyright, null);
                this._trigger("execute", { commandName: "JustifyRight" });
            }
        },

        _onJustifyCenter: function () {
            var args;
            if (this._isIE8())
                this.executeCommand('JustifyCenter', args);
            else
            {
                this._getDocumentHandler() && this._operationHandler.execCommand(ej.execCommand.justifycenter, null);
                this._trigger("execute", { commandName: "JustifyCenter" });
            }
        },

        _onJustifyFull: function () {
            this._alignFlag = true;
            if (this._isIE8())
                this.executeCommand('justifyfull');
            else
            {
                this._getDocumentHandler() && this._operationHandler.execCommand(ej.execCommand.justifyfull, null);
                this._trigger("execute", { commandName: "justifyfull" });
            }
        },

        _onCut: function () {
            var args;
            this.executeCommand('cut', args);
        },
        _onCopy: function () {
            var args;
            this.executeCommand('copy', args);
        },
        _onOpen: function () {
            var selectNode = (this._isIE()) ? this._currentSelNode : this._getSelectedNode();
            window.open($(selectNode).attr('href'));
        },
        _onPaste: function () {
            var args;
            this.executeCommand('paste', args);

        },
        _onOrderList: function (e) {
            var _listSelect = (this._isIE()) ? ((this._isIE8()) ? this._pasteRangeVal.parentElement() : this._pasteRangeVal.startContainer.parentNode) : this._getSelectedNode();
            if ((($(_listSelect).prop("tagName") != "OL" && $(_listSelect).parents("ol").length == 0 && e.ID != "none") || e.type == "click" || (($(_listSelect).prop("tagName") == "OL" || $(_listSelect).parents("ol").length > 0) && e.ID == "none")) && !(ej.isNullOrUndefined(e.ID) && this._listOrderType == "none"))
                this.executeCommand('insertorderedlist', "listItem");
            _listSelect = (this._isIE()) ? ((this._isIE8()) ? this._pasteRangeVal.parentElement() : this._pasteRangeVal.startContainer.parentNode) : this._getSelectedNode();
            if (e.type == "click" && $(_listSelect).parents("ol").length >= 0) e.ID = this._listOrderType;
            if (!ej.isNullOrUndefined(e.ID)) var orderParent = ($(_listSelect).prop("tagName") == "OL") ? _listSelect : $(_listSelect).parents("ol");
            this._generateListItems(e, orderParent, !ej.isNullOrUndefined(this.model.tools["customOrderedList"]) ? this.model.tools["customOrderedList"] : []);
            this._listOrderType = e.ID;
            this._updateIndent(_listSelect);
        },
        _onUnorderList: function (e) {
            var _listSelect = (this._isIE()) ? ((this._isIE8()) ? this._pasteRangeVal.parentElement() : this._pasteRangeVal.startContainer.parentNode) : this._getSelectedNode();
            if ((($(_listSelect).prop("tagName") != "UL" && $(_listSelect).parents("ul").length == 0 && e.ID != "none") || e.type == "click" || (($(_listSelect).prop("tagName") == "UL" || $(_listSelect).parents("ul").length > 0) && e.ID == "none")) && !(ej.isNullOrUndefined(e.ID) && this._listType == "none"))
                this.executeCommand('insertunorderedlist', "listItem");
            _listSelect = (this._isIE()) ? ((this._isIE8()) ? this._pasteRangeVal.parentElement() : this._pasteRangeVal.startContainer.parentNode) : this._getSelectedNode();
            if (e.type == "click" && $(_listSelect).parents("ul").length >= 0) e.ID = this._listType;
            if (!ej.isNullOrUndefined(e.ID)) var unOrderParent = ($(_listSelect).prop("tagName") == "UL") ? _listSelect : $(_listSelect).parents("ul");
            this._generateListItems(e, unOrderParent, !ej.isNullOrUndefined(this.model.tools["customUnorderedList"]) ? this.model.tools["customUnorderedList"] : []);
            this._listType = e.ID;
            this._updateIndent(_listSelect);
        },
        _generateListItems: function (e, list, template) {
            $(list).css({ "list-style-type": e.ID, "list-style-image": "" });
            var proxy = this;
            if (["none", "disc", "circle", "square", "decimal", "upper-roman", "lower-roman", "upper-alpha", "lower-alpha"].indexOf(e.ID) == -1)
                $.each(template, function (i, val) {
                    if (val["name"] == e.ID) $(list).css({ "list-style-type": val["listStyle"], "list-style-image": val["listImage"] });
                });
            this._setBackupData();
            (this._isIE()) ? this.selectRange(this._pasteRangeVal) : this.selectRange(this._getRange());
            this._updateTagInfo((this._isIE()) ? this._currentSelNode : this._getSelectedNode());
        },
        _onUndo: function () {
            var args;
            if (this._isIE8())
                this.executeCommand('undo', null);
            else
                this._undo();
        },
        _onDelete: function () {
            var args;
            this.executeCommand('delete', null);
        },

        _onRedo: function () {
            var args;
            if (this._isIE8())
                this.executeCommand('redo', null);
            else
                this._redo();
        },

        _onClearFormat: function () {
            var args;
            this.executeCommand('removeformat', args);
            this._hideTooltip();
            this._setBackupData();
            this._onChange();
            this._updateIframeSkin(this.model.iframeAttributes);
            this._updateToolbarStatus();
        },

        _onFormatBlock: function (formatBlock) {
            this._focus();
            if (this._isIE8()) {
                var selection, range, node;
                node = document.getSelection ? this._getSelectedNode() : this._getWindow().document.selection.createRange().parentElement();
                this._onClearFormat();
                this.executeCommand('formatBlock', formatBlock);
            }
            else
            {
                this._getDocumentHandler() && this._operationHandler.execCommand(ej.execCommand.formatblock, formatBlock);
                this._trigger("execute", { commandName: "formatBlock" });
            }

            
            this._updateToolbarStatus();
            this._updateFontOptionStatus();

        },

        _onFontName: function (fontsname) {
            if ((this._isIE8()))
                this.executeCommand("fontName", fontsname);//backColor,fontName,fontSize,foreColor
            else
            {
                this._getDocumentHandler() && this._operationHandler.execCommand(ej.execCommand.fontname, fontsname);
                this._trigger("execute", { commandName: "fontName" });
            }
        },

        _onFontSize: function (Size) {
            if ((this._isIE8()))
                this.executeCommand('fontSize', Size);
            else
            {
                this._getDocumentHandler() && this._operationHandler.execCommand(ej.execCommand.fontsize, Size);
                this._trigger("execute", { commandName: "fontSize" });
            }
        },

       _onFontColor: function (color) {
	         this._fontColorSplit.find("span.e-btntxt").css("background-color", color);
		     if(this._customDialogobj&&this._customDialogobj.isOpen())
			    this._customColor.ejDialog("close");
             if (this._isIE8())
                this.executeCommand('foreColor', color);
            else
            {
                this._getDocumentHandler() && this._operationHandler.execCommand(ej.execCommand.forecolor, color);
                this._trigger("execute", { commandName: "foreColor" });
            }
            this._onChange();
            this._updateIframeSkin(this.model.iframeAttributes);
        },

       _onBGColor: function (color) {
	        this._bgColorSplit.find("span.e-btntxt").css("background-color", color);
		    if(this._customDialogobj&&this._customDialogobj.isOpen())
               this._customColor.ejDialog("close");	 
            if (this._isIE8())
                this.executeCommand('backColor', color);
            else
            {
                this._getDocumentHandler() && this._operationHandler.execCommand(ej.execCommand.backcolor, color);
                this._trigger("execute", { commandName: "backColor" });
            }
            this._onChange();
        },

        _onIndent: function () {
            if (this._isIE8()) {
                this._getWindow().document.body.style.wordWrap = "break-word";
                var node = document.getSelection ? this._getWindow().document.getSelection().focusNode : this._getWindow().document.selection.createRange().parentElement();
                if (node && (/^(OL|UL|LI)$/).test(node.nodeName))
                    this._listIndent(node);
                else if (node && (/^(#text)$/).test(node.nodeName) && (/^(OL|UL|LI)$/).test($(node).parent()[0].nodeName)) {
                    this._listIndent($(node).parents("li")[0], node);
                }
                else
                    this.executeCommand('indent', false);

                node && $(node).focus();
            }
            else
            {
                this._getDocumentHandler() && this._operationHandler.execCommand(ej.execCommand.indent, null);
                this._trigger("execute", { commandName: "indent" });
            }

            this._updateIframeSkin(this.model.iframeAttributes);
            this._updateIndentStatus();
        },

        _onOutdent: function () {
            if (this._isIE8()) {
                var node = document.getSelection ? this._getWindow().document.getSelection().focusNode : this._getWindow().document.selection.createRange().parentElement();
                if (node && (/^(OL|UL|LI)$/).test(node.nodeName))
                    this._listOutdent(node);
                else if (node && (/^(#text)$/).test(node.nodeName) && (/^(OL|UL|LI)$/).test($(node).parent()[0].nodeName)) {
                    this._listOutdent($(node).parents("li")[0], node);
                }
                else
                    this.executeCommand('outdent', false);
            }
            else
            {
                this._getDocumentHandler() && this._operationHandler.execCommand(ej.execCommand.outdent, null);
                this._trigger("execute", { commandName: "outdent" });
            }
            this._updateIndentStatus();
        },

        _onSelectAll: function () {
            this.executeCommand('selectall');
        },
        selectAll: function () {
            this._onSelectAll();
        },
        _onHyperLink: function (val) {
            this.executeCommand('createlink', val);
        },

        _onInsertLink: function () {
            var oEl, sHtml;
            if (!this._isUrl($.trim(this._txtURL.val()))) {
                this._txtURL.addClass("e-error");
                return false;
            }
            var selectedNode = ((ej.browserInfo().name == "msie" || ej.browserInfo().name == "chrome") && $(this._currentSelNode).parents("body").length > 0) ? this._currentSelNode : this._getSelectedNode();
            if (!ej.isNullOrUndefined(selectedNode) && selectedNode.tagName.toUpperCase() == 'A') {
                selectedNode.href = this._txtURL.val();
                selectedNode.title = this._txtLinkTitle.val();
                selectedNode.innerHTML = this._txtLinkText.val();
                (this._chkTarget.ejCheckBox("isChecked")) ? selectedNode.target = "_blank" : selectedNode.target = "";
            }
            else if (!ej.isNullOrUndefined(selectedNode) && selectedNode.tagName.toUpperCase() == 'IMG') {
                var parentNode = $(selectedNode).parent('a')[0];
                if (ej.isNullOrUndefined(parentNode)) {
                    oEl = ej.buildTag("a", "", {}, { href: this._txtURL.val(), title: this._txtLinkTitle.val() == "" ? (this._txtURL.val() + "\n" + this._getLocalizedLabels("linkTooltip")) : this._txtLinkTitle.val() });
                    (this._chkTarget.ejCheckBox("isChecked")) ? oEl[0].target = "_blank" : oEl[0].target = "";
                    $(selectedNode.outerHTML).appendTo($(oEl));
                    $(selectedNode).replaceWith($(oEl));
                } else {
                    parentNode.href = this._txtURL.val();
                    parentNode.title = this._txtLinkTitle.val();
                    (this._chkTarget.ejCheckBox("isChecked")) ? parentNode.target = "_blank" : parentNode.target = "";
                }
            }
            else {
                oEl = ej.buildTag("a", "", {}, { href: this._txtURL.val(), title: this._txtLinkTitle.val() == "" ? (this._txtURL.val() + "\n" + this._getLocalizedLabels("linkTooltip")) : this._txtLinkTitle.val() });
                (this._chkTarget.ejCheckBox("isChecked")) ? oEl[0].target = "_blank" : oEl[0].target = "";

                var oSelection;
                var oSelRange;
                this._focus();
                if (this._isIE()) {
                    if (this._selectedHTML.length == 0) {
                        if (this._txtLinkText.val() === "") this._selectedHTML = this._txtURL.val();
                        else this._selectedHTML = this._txtLinkText.val();
                    }
                    oEl[0].innerHTML = this._selectedHTML;
                    sHtml = oEl[0].outerHTML;
                }
                else {
                    if (this._txtLinkText.val() === "") oEl.html(this._txtURL.val());
                    else oEl.html(this._txtLinkText.val());
                    sHtml = $('<div>').append($(oEl).clone()).html();
                }
                if (sHtml && (this.model.maxLength != null && (this.model.maxLength > $.trim(this._getText()).length))) {
                    this._pasteHtml(sHtml);
                    this.selectRange(this._getRange());
                }
            }
            this._linkDialog.ejDialog("close");
            this.enableToolbarItem("removeLink");
            this._updateCount();
        },

        _setImageProperties: function (imgEle, imgX, imgY, imageStyle, borderPx, borderStyle, borderColor) {
            if (this.model.showDimensions) {
                (imgX != "") && (imgEle[0].width = imgX);
                (imgY != "") && (imgEle[0].height = imgY);
                var sty = imageStyle.split(";"),
                    splitHeight, splitWidth, newHeight = " height: "+imgY+"px", newWidth = " width: "+imgX+"px";
                for (var i = 0; i < sty.length; i++) {
                    if (sty[i].indexOf("height:") < 2 && sty[i].indexOf("height:") != -1) splitHeight = sty[i];
                    if (sty[i].indexOf("width:") < 2 && sty[i].indexOf("width:") != -1) splitWidth = sty[i];
                }
                imageStyle = imageStyle.replace(splitHeight,newHeight);
                imageStyle = imageStyle.replace(splitWidth,newWidth);
                this._imageStyle.val(imageStyle);
            }

            imgEle = $(imgEle).attr('style', imageStyle);

            var border = borderPx + "px ";
            (!ej.isNullOrUndefined(borderStyle) && borderStyle != "") ? border += borderStyle + " " : border += "solid ";
            (!ej.isNullOrUndefined(borderColor) && borderColor != "") ? border += borderColor : border += "#000000";
            imgEle = imgEle.css('border', border);
            if (!ej.isNullOrUndefined(this._imgDup)) {
                this._resizeImgPos();
                this._resizeImgDupPos();
            }
        },
        _onInsertImage: function () {
            var url = this._imgDialog.find(".e-rte-imgUrl");
            var altText = this._imgDialog.find(".e-rte-imgText");
            var imgX = this._imgDialog.find(".e-rte-imgX").val();
            var imgY = this._imgDialog.find(".e-rte-imgY").val();
            var proxy = this;
            this._restoreSelection(this._selectionRange);
            var element, border, nodeName = "", imageLink = proxy._imageLink.val(), borderPx = proxy._imageBorderPx.getValue(), borderStyle = proxy._imageBorderStyle.getSelectedValue(), borderColor = proxy._imgPicker.getValue(), imageStyle = proxy._imageStyle.val();
            var selectedNode = (proxy._isIE()) ? proxy._currentSelNode : proxy._getSelectedNode();
            (!ej.isNullOrUndefined(selectedNode)) && (nodeName = selectedNode.nodeName.toUpperCase());
            borderColor = !ej.isNullOrUndefined(borderColor) && borderColor.length > 0 ? borderColor : "";
            var srcUrl = (url.val().startsWith("~")) ? url.val().replace(url.val().substr('0', '1'), "..") : url.val();
            if (nodeName != 'IMG') {
                //Url Validation
                var _img = $("<img>", {
                    src: srcUrl,
                    error: function () { url.addClass("e-error"); },
                    success: function () {
                        var imgEle = ej.buildTag("img", "", {}, { alt: altText.val(), src: srcUrl });
                        proxy._setImageProperties(imgEle, imgX, imgY, imageStyle, borderPx, borderStyle, borderColor);
                        if (imageLink != "") {
                            if (proxy._isUrl($.trim(imageLink))) {
                                var link = ej.buildTag("a", "", {}, { href: imageLink });
                                (proxy._dialogchkTarget.ejCheckBox("isChecked")) ? link[0].target = "_blank" : link[0].target = "_self";
                                $(imgEle[0].outerHTML).appendTo(link);
                                imgEle = link;
                            }
                            else {
                                proxy._imageLink.addClass("e-error");
                                return false;
                            }
                        }
                        var element = imgEle[0].outerHTML;
                        proxy.executeCommand('inserthtml', element);
                    }
                });
            }
            else {
                selectedNode.src = srcUrl;
                selectedNode.alt = altText.val();
                proxy._setImageProperties($(selectedNode), imgX, imgY, imageStyle, borderPx, borderStyle, borderColor);
                var linkNode = $(selectedNode).parent('a');
                if (imageLink != "") {
                    if (proxy._isUrl($.trim(imageLink))) {
                        if (linkNode.length > 0)
                            linkNode.attr('href', imageLink);
                        else {
                            var linkNode = ej.buildTag("a", "", {}, { href: imageLink });
                            $(selectedNode.outerHTML).appendTo(linkNode);
                            $(selectedNode).replaceWith(linkNode);
                        }
                    }
                    else {
                        proxy._imageLink.addClass("e-error");
                        return false;
                    }
                }
                else 
                    (linkNode.length > 0) && (linkNode.attr('href', ""));
                if (!ej.isNullOrUndefined(linkNode) && linkNode.length > 0)
                    (this._dialogchkTarget.ejCheckBox("isChecked")) ? linkNode[0].target = "_blank" : linkNode[0].target = "_self";
            }
            proxy._setAutoHeight();
            if (!proxy._imageLink.hasClass("e-error")) proxy._imgDialog.ejDialog("close");
            proxy._on(proxy._imageLink, "keypress", proxy._urlValidation)._on(proxy._imageLink, "blur", proxy._urlValidation);
        },

        _insertVideo: function (sender) {
            var videoLink = $.trim(this._videoDialog.find("textarea.e-rte-video")[0].value);
            var videoX = this._videoDialog.find(".e-rte-videoX").val();
            var videoY = this._videoDialog.find(".e-rte-videoY").val();
            this._restoreSelection(this._selectionRange);
            this._alertHeader(this);
            if (sender.target.id === "video_insert" && videoLink !== "") {
                if (this._isIE() && !this._isIE8()) this._ieLinkRange();
                var ele = $(videoLink)[0];
                if (this.model.showDimensions && !ej.isNullOrUndefined(ele)) {
                    (videoX != "") && (ele.width = videoX);
                    (videoY != "") && (ele.height = videoY);
                }
                if (!ej.isNullOrUndefined(ele) && (this.model.maxLength != null && (this.model.maxLength > $.trim(this._getText()).length)))
                    this.executeCommand('inserthtml', ele.outerHTML + "<br/>");

                this._onChange();
                this._setBackupData();
                this._videoDialog.ejDialog("close");
            }
            else if (sender.target.id === "video_cancel") {
                this._videoDialog.ejDialog("close");
                this._ieCursorMaintainance();
            }
            else
                this._openAlert(this._getLocalizedLabels("videoError"));
            this._videoDialog.find("textarea.e-rte-video")[0].value = "";
            this._videoDialog.find(".e-rte-videoX").val("");
            this._videoDialog.find(".e-rte-videoY").val("");
            this._chkvideoDimensions.ejCheckBox({ check: true });
            this._setAutoHeight();
        },

        _oneditTable: function () {
            //var selectedNode = this._currentSelNode;
            var isTable = $(this._getSelectedNode()).closest("td");
            var selectedNode = (isTable.length > 0) ? isTable[0] : this._currentSelNode;
            var parentTable = $(selectedNode).closest('tbody').closest('table');
            var captionEle = $($(selectedNode).closest('tbody')).prev('caption');
            (this._eTblCaption.ejCheckBox("isChecked")) ? (captionEle.length == 0) && ej.buildTag('caption').append($('<br type="_moz">')).insertBefore($($(selectedNode).closest('tbody'))) : (captionEle.length > 0) && captionEle.remove();
            var tblAlign = this._eTblAlign.getSelectedValue();
            var style = this._getTableObj("Style").val();
            style = style.replace((tblAlign == 'center') ? /float(.*?);/ig : /margin(.*?);/ig ,"");
            if (tblAlign == 'center') style += ";margin: 0 auto;";
            (style) && parentTable.attr('style', style);
            this._customTableValidation = false;
            var tableWid = this._customInputValidation(this._getTableObj("Width"));
            var tableHgt = this._customInputValidation(this._getTableObj("Height"));
            var rowHgt = this._customInputValidation(this._getTableObj("RHeight"));
            var cellWid = this._customInputValidation(this._getTableObj("ClWidth"));
            var borderSpa = this._getTableObj("CellSpace").data('ejNumericTextbox').getValue();
            var cellPad = this._getTableObj("CellPad").data('ejNumericTextbox').getValue();
            if (!this._customTableValidation) {
                parentTable.css({
					'width':isNaN(Number(tableWid))?tableWid:tableWid+"px",
                    'height': isNaN(Number(tableHgt))?tableHgt:tableHgt+"px",
                    'border-spacing': isNaN(Number(borderSpa))?borderSpa:borderSpa+"px",
                    'float': tblAlign,
                    'border-width': this._getTableObj("BrdrPx").data('ejNumericTextbox').getValue() + "px",
                    'border-style': this._getTableObj("_border_style").data('ejDropDownList').getSelectedValue(),
                    'border-color': this._getTableObj("_border_color").val()
                });
                parentTable.find("td,th").css("padding",isNaN(Number(cellPad))?cellPad:cellPad+"px");
                var parentRow = $(selectedNode).closest('tr');
                parentRow.attr({
                    style: this._getTableObj("RStyle").val()
                }).css({
                    'height': isNaN(Number(rowHgt))?rowHgt:rowHgt+"px",
                    'text-align': this._getTableObj("RAlign").data('ejDropDownList').getSelectedValue(),
                    'border-width': this._getTableObj("RBrdrPx").data('ejNumericTextbox').getValue() + "px",
                    'border-style': this._getTableObj("RBrdrStyle").data('ejDropDownList').getSelectedValue(),
                    'border-color': this._getTableObj("RBrdrColor").val()
                });
                $(selectedNode).attr({
                    style: this._getTableObj("ClStyle").val()
                }).css({
                    'width': isNaN(Number(cellWid))?cellWid:cellWid+"px",
                    'text-align': this._getTableObj("ClAlign").data('ejDropDownList').getSelectedValue(),
                    'border-width': this._getTableObj("ClBrdrPx").data('ejNumericTextbox').getValue() + "px",
                    'border-style': this._getTableObj("ClBrdrStyle").data('ejDropDownList').getSelectedValue(),
                    'border-color': this._getTableObj("ClBrdrColor").val()
                });
                this._eTblDialog.ejDialog("close");
            }
            this._on(this._getTableObj("Width"), "keypress", this._urlValidation)
				._on(this._getTableObj("Height"), "keypress", this._urlValidation)
				._on(this._getTableObj("RHeight"), "keypress", this._urlValidation)
				._on(this._getTableObj("ClWidth"), "keypress", this._urlValidation);
        },


        _clearAllManager: function () {
            this._hideTooltip();
            this._alertWindow.find(".e-alert-cancel").show();
            this._alertHeader(this);
            this._openAlert(this._getLocalizedLabels("deleteAlert"));
        },

        _onUnlink: function () {
            var args;
            this.executeCommand('unlink', args);
            this.disableToolbarItem("removeLink");
        },
        _onSuperScript: function () {
            var args;
            if (this._isIE8())
                this.executeCommand('SuperScript', args);
            else
            {
                this._getDocumentHandler() && this._operationHandler.execCommand(ej.execCommand.superscript, null);
                this._trigger("execute", { commandName: "SuperScript" });
            }
        },
        _onSubScript: function () {
            var args;
            if (this._isIE8())
                this.executeCommand('SubScript', args);
            else
            {
                this._getDocumentHandler() && this._operationHandler.execCommand(ej.execCommand.subscript, null);
                this._trigger("execute", { commandName: "SubScript" });
            }
        },
        _onInsertTable: function (rows, cols, designTime) {
            if (this.model.maxLength != null && (this.model.maxLength > $.trim(this._getText()).length)) {
                $(this._getDocument().body).css("display", "inline-block");
                var tableEle = this._tableGenerator(rows, cols, designTime);
                this.executeCommand('inserthtml', tableEle);
                if ((ej.isNullOrUndefined($(this._getDocument().body).find("table:last")[0].nextSibling)) || ($(this._getDocument().body).find("table:last")[0].nextSibling.nodeName.toLowerCase() == "#text" && $.trim($(this._getDocument().body).find("table:last")[0].nextSibling.nodeValue) == "\n"))
                    $("<p><br/></p>").insertAfter($(this._getDocument().body).find("table"))
                $(this._getDocument().body).css("display", "");
                this._setAutoHeight();
            }
        },

        _onUpperCase: function () {
            if (this._isIE8()) {
                if (!document.getSelection) {
                    if (this._getWindow().document.selection.type.toLowerCase() == "control") {
                        return;
                    }
                    this._seleText = ej.isNullOrUndefined(this._seleText) ? "" : this._seleText;
                    this._getDocument().selection.createRange().pasteHTML(this._seleText.toUpperCase());
                }
                else {
                    var selection = this._getWindow().getSelection();
                    var range = this._saveSelection();
                    var node = range.commonAncestorContainer;
                    var children = range.commonAncestorContainer.children;
                    if (children != null) {
                        var contents = range.cloneContents()
                        var result = this._changeCase(contents, "Upper");
                        var resultCopy = $(result).clone();
                        var tempDiv = document.createElement('div');
                        $(tempDiv).append($(resultCopy));
                        if (tempDiv.innerHTML != null && tempDiv.innerHTML != "")
                            this._getWindow().document.execCommand('inserthtml', false, tempDiv.innerHTML);
                    }
                    else {
                        var replaceString = node.nodeValue.substring(range.startOffset, range.endOffset).toUpperCase();
                        var startString = node.nodeValue.substr(0, range.startOffset);
                        var endString = node.nodeValue.substring(range.endOffset);
                        node.nodeValue = startString + replaceString + endString;
                    }
                }
            }
            else
                this._getDocumentHandler() && this._operationHandler.execCommand(ej.execCommand.uppercase, null);


            this._trigger("execute", { commandName: "uppercase" });
        },

        _changeCase: function (parentNode, toChangeCase) {
            var s = parentNode.childNodes;
            if (s.length > 0) {
                for (var t = 0; t < s.length; t++) {
                    if (s[t].nodeType == 3) {
                        s[t].nodeValue = toChangeCase == "Upper" ? s[t].nodeValue.toUpperCase() : s[t].nodeValue.toLowerCase();
                    }
                    else {
                        if (s[t].nodeType == 1 && s[t].tagName.toUpperCase() != "FONT") {
                            this._changeCase(s[t], toChangeCase);
                        }
                    }
                }
            }
            return s;
        },


        _onLowerCase: function () {
            if (this._isIE8()) {
                if (!document.getSelection) {
                    if (this._getWindow().document.selection.type.toUpperCase() == "control") {
                        return;
                    }
                    this._seleText = ej.isNullOrUndefined(this._seleText) ? "" : this._seleText;
                    this._getDocument().selection.createRange().pasteHTML(this._seleText.toLowerCase());
                }
                else {
                    var selection = this._getWindow().getSelection();
                    var range = this._saveSelection();
                    var node = range.commonAncestorContainer;
                    var children = range.commonAncestorContainer.children;
                    if (children != null) {
                        var contents = range.cloneContents();
                        var result = this._changeCase(contents, "Lower");
                        var resultCopy = $(result).clone();
                        var tempDiv = document.createElement('div');
                        $(tempDiv).append($(resultCopy));
                        if (tempDiv.innerHTML != null && tempDiv.innerHTML != "")
                            this._getWindow().document.execCommand('inserthtml', false, tempDiv.innerHTML);
                    }
                    else {
                        var replaceString = node.nodeValue.substring(range.startOffset, range.endOffset).toLowerCase();
                        var startString = node.nodeValue.substr(0, range.startOffset);
                        var endString = node.nodeValue.substring(range.endOffset);
                        node.nodeValue = startString + replaceString + endString;
                    }
                }
            }
            else
                this._getDocumentHandler() && this._operationHandler.execCommand(ej.execCommand.lowercase, null);
            //execCommand=emphasize-contentformat-indent-contentalignment-formatblock-captionconvertion
            this._trigger("execute", { commandName: "lowercase" });
        },

        _listIndent: function (node, selection) {
            var sibling, newList;
            sibling = node.previousSibling;
            if (sibling && this._isListNode(sibling)) {
                sibling.appendChild(node);
                return true;
            }
            if (sibling && sibling.nodeName == 'LI' && this._isListNode(sibling.lastChild)) {
                sibling.lastChild.appendChild(node);
                this._combineLists(node.lastChild, sibling.lastChild, node);
                return true;
            }
            sibling = node.nextSibling;
            if (sibling && this._isListNode(sibling)) {
                sibling.insertBefore(node, sibling.firstChild);
                return true;
            }
            if (sibling && sibling.nodeName == 'LI' && this._isListNode(node.lastChild)) {
                return false;
            }
            sibling = node.previousSibling;
            if (sibling && sibling.nodeName == 'LI') {
                newList = ej.buildTag(node.parentNode.nodeName)[0];
                sibling.appendChild(newList);
                newList.appendChild(node);
                this._combineLists(node.lastChild, newList, node);
                return true;
            }
            return true;
        },

        _combineLists: function (from, to, li) {
            var node;
            if (this._isListNode(from)) {
                while ((node = li.lastChild.firstChild)) {
                    to.appendChild(node);
                }
                $(from).remove();
            }
        },
        _isListNode: function (node) {
            return node && (/^(OL|UL)$/).test(node.nodeName);
        },
        _isFirstChild: function (node) {
            return node.parentNode.firstChild == node;
        },

        _isLastChild: function (node) {
            return node.parentNode.lastChild == node;
        },
        _removeEmptyList: function (node) {
            if (node && $(node).children().length === 0)
                $(node).remove();
        },
        _listOutdent: function (node) {
            var ul = $(node.parentNode), ulParent = ul[0].parentNode, newBlock;
            node = $(node);
            if (this._isFirstChild(node[0]) && this._isLastChild(node[0])) {
                if (ulParent.nodeName == "LI") {
                    node.insertAfter(ulParent);
                    this._removeEmptyList(ulParent);
                    ul.remove();
                } else if (this._isListNode(ulParent)) {
                    ul.remove();
                } else {
                    this.executeCommand('outdent', false);
                }

                return true;
            } else if (this._isFirstChild(node[0])) {
                if (ulParent.nodeName == "LI") {
                    node.insertAfter(ulParent);
                    node[0].appendChild(ul[0]);
                    this._removeEmptyList(ulParent);
                } else if (this._isListNode(ulParent)) {
                    ulParent.insertBefore(node[0], ul[0]);
                } else {
                    this.executeCommand('outdent', false);
                }

                return true;
            } else if (this._isLastChild(node[0])) {
                if (ulParent.nodeName == "LI") {
                    node.insertAfter(ulParent);
                } else if (this._isListNode(ulParent)) {
                    node.insertAfter(ul[0]);
                } else {
                    this.executeCommand('outdent', false);
                }
                return true;
            } else {
                this.executeCommand('outdent', false);
            }
            return false;
        },
        _updateIndent: function (node) {
            if (!ej.isNullOrUndefined(this._toolBarObj)) {
                if ($("#" + this._rteId + "_" + "indent").hasClass('e-disable')) this._toolBarObj.enableItemByID(this._rteId + "_" + "indent");
                if (node && (/^(LI)$/).test(node.nodeName)) {
                    if ($(node).parents(node.parentNode.nodeName).last().find("li").index(node) === 0)
                        this._toolBarObj.disableItemByID(this._rteId + "_" + "indent");
                }
            }
        },
         _updateCount: function () {
            if (!ej.isNullOrUndefined(this.model)) {
                if (this.model.showFooter && this.model.showWordCount)
				{
                   this._wordCount.html(this._getLocalizedLabels("words") + " : " + ($.trim(this._getText()) != "" ? $.trim(this._getText()).split(/\W+/).length : 0));
				  if(this._rteFooter.width()<400)
				  this._wordCount.html(this._getLocalizedLabels("w") + " : " + ($.trim(this._getText()) != "" ? $.trim(this._getText()).split(/\W+/).length : 0));
					}
				
                if (this.model.showFooter && this.model.showCharCount)
				{
                    this._charCount.html(this._getLocalizedLabels("characters") + " : " + this._getText().length);
					if(this._rteFooter.width()<400)
					this._charCount.html(this._getLocalizedLabels("c")+ " : " + this._getText().length);
					}
            }
        },
        _updateTagInfo: function (element) {
            var text = "", pTag, count = 1;
            if (!ej.isNullOrUndefined(element))
                if (element.localName == "body" || element.localName == "html")
                    element = this._getSelectedNode();
            if (ej.isNullOrUndefined(element)) this._curNode = "";
            else this._curNode = element.tagName ? element.tagName.toLowerCase() : "html";
            if (this.model.showFooter && this.model.showHtmlTagInfo) {
                if (this._curNode != "html" && this._curNode !== "") {
                    var parentNodes = $(element).parents();
                    for (var i = parentNodes.length - 1; i >= 0; i--) {
                        pTag = parentNodes[i].tagName.toLowerCase();
                        if (pTag != "html")
                            text += " » " + pTag;
                        else count++;
                    }
                    text += " » " + this._curNode;
                    if ($(element).parents().length > 0) {
                        if (!ej.isNullOrUndefined(parentNodes[parentNodes.length - count]))
                            this._pTag = parentNodes[parentNodes.length - count].tagName.toLowerCase();
                    }
                }
                this._tags = text;
                this._responsiveTagList();
            }
        },
        _responsiveTagList: function () {
            $(this._htmlInfo).html(this._tags);
            if ($(this._rteWapper).outerWidth() < $(this._rteWapper).find('.e-rte-footer-left').outerWidth() + $(this._rteWapper).find('.e-rte-footer-right').outerWidth())
                $(this._htmlInfo).html(" » " + this._pTag + " » ... ...  » " + this._curNode);
            else $(this._htmlInfo).html(this._tags);
        },
		_removeNoSpaceChar:function(data){
			data &&(data=data.replace(/[\uFEFF]/g,""));
			return data
		},
        _updateValue: function () {
            var updatedval = this._removeNoSpaceChar(this._updateXhtml());
            if (this.model.enableHtmlEncode)
                updatedval = this._encode(this._decode(updatedval));
                this.value(updatedval);
            this.element.val(updatedval);
        },
        _imageXhtml: function (imgVal) {
            var imgRegexp = /<img(.*?)>/ig;
            var imgTemp;
            var j = 0;
            var imgDup = new Array();
            while ((imgTemp = imgRegexp.exec(imgVal)) !== null) {
                imgDup.push(imgTemp[0].toString());
            }
            var imgEx = new Array();
            imgEx = imgDup.slice(0);
            for (var i = 0; i < imgDup.length; i++) {
                if (imgDup[i].indexOf("/") == -1) {
                    imgDup[i] = imgDup[i].substr(0, imgDup[i].length - 1) + "/" + imgDup[i].substr(imgDup[i].length - 1, imgDup[i].length);
                }
                else if (imgDup[i].lastIndexOf("/") != imgDup[i].length - 2) {
                    imgDup[i] = imgDup[i].substr(0, imgDup[i].length - 1) + "/" + imgDup[i].substr(imgDup[i].length - 1, imgDup[i].length);
                }
            }
            var altReg = /(alt)=("[^"]*")/i;
            var srcReg = /(src)=("[^"]*")/g;
            var altRegS = /(alt)=('[^"]*')/i;
            var srcRegS = /(src)=('[^"]*')/g;
            for (var i = 0; i < imgDup.length; i++) {
                var temp = ej.isNullOrUndefined(altReg.exec(imgDup[i])) ? altRegS.exec(imgDup[i]) : altReg.exec(imgDup[i]);
                var dup = ej.isNullOrUndefined(srcReg.exec(imgDup[i])) ? srcRegS.exec(imgDup[i]) : srcReg.exec(imgDup[i]);
                var srcVar = ej.isNullOrUndefined(imgDup[i].match(srcReg)) ? imgDup[i].match(srcRegS) : imgDup[i].match(srcReg);
                var altVar = ej.isNullOrUndefined(imgDup[i].match(/(alt)=("[^"]*")/g)) ? imgDup[i].match(/(alt)=('[^"]*')/g) : imgDup[i].match(/(alt)=("[^"]*")/g);
                if (temp == null && altVar == null)
                    imgDup[i] = imgDup[i].substr(0, imgDup[i].length - 2) + " alt=\"\"" + imgDup[i].substr(imgDup[i].length - 2, imgDup[i].length);
                else {
                    for (var j = altVar.length - 1; j > 0; j--) {
                        imgDup[i] = imgDup[i].replace(altVar[j], "");
                    }
                }
                if (dup == null && srcVar == null)
                    imgDup[i] = imgDup[i].substr(0, imgDup[i].length - 2) + " src=\"\"" + imgDup[i].substr(imgDup[i].length - 2, imgDup[i].length);
                else {
                    for (var j = srcVar.length - 1; j > 0; j--) {
                        imgDup[i] = imgDup[i].replace(srcVar[j], "");
                    }
                }
            }
            for (var g = 0; g < imgDup.length; g++) {
                imgVal = imgVal.replace(imgEx[g], imgDup[g]);
            }
            return imgVal;
        },
        _tagCssReplace: function (styleTag, styleDup, styleRegval) {
            var tagStyle = /(style)=("[^"]*")/i;
            var tagCss = tagStyle.exec(styleDup);
            if (tagCss != null) {
                var cssTag = tagCss[0];
                if (styleTag != "")
                    cssTag = cssTag.substr(0, cssTag.length - 1) + styleTag + ";\"";
                if (!ej.isNullOrUndefined(styleTag))
                    styleDup = styleDup.replace(styleRegval[0], "").replace(tagCss[0], cssTag);
                return styleDup;
            }
        },
        _updateIndentStatus: function () {
            if (this._isIE8())
                ($(this._getSelectedNode()).closest("BLOCKQUOTE").length > 0) ? this.enableToolbarItem("outdent") : this.disableToolbarItem("outdent");
            else {
                if (this._getDocumentHandler() && this._operationHandler._validateIndent(this._getRange().startContainer))
                    this.enableToolbarItem("outdent");
                else
                    this.disableToolbarItem("outdent");
            }

        },
        _replaceHeightWidth: function (htmlTagreg, styleDup) {
            var styleRegval = htmlTagreg.exec(styleDup);
            if (!ej.isNullOrUndefined(styleRegval)) {
                var styleTag = styleRegval[0];
                styleTag = styleTag.replace(/\"/gi, "").replace("=", ":");
            }
            return (this._tagCssReplace(styleTag, styleDup, styleRegval));
        },
        _typeXhtmlValidation: function (styleDup) {
            var styleTag = styleRegval[0];
            if (styleTag == "type=\"a\"")
                styleTag = styleTag.replace(/\"/gi, "").replace("=", ":").replace("type", "list-style-type").replace("a", "lower-alpha");
            else if (styleTag == "type=\"A\"")
                styleTag = styleTag.replace(/\"/gi, "").replace("=", ":").replace("type", "list-style-type").replace("A", "upper-alpha");
            else if (styleTag == "type=\"1\"")
                styleTag = styleTag.replace(/\"/gi, "").replace("=", ":").replace("type", "list-style-type").replace("1", "decimal");
            else if (styleTag == "type=\"i\"")
                styleTag = styleTag.replace(/\"/gi, "").replace("=", ":").replace("type", "list-style-type").replace("i", "lower-roman");
            else if (styleTag == "type=\"I\"")
                styleTag = styleTag.replace(/\"/gi, "").replace("=", ":").replace("type", "list-style-type").replace("I", "upper-roman");
            else
                styleTag = styleTag.replace(/\"/gi, "").replace("=", ":").replace("type", "list-style-type");
        },
        _getCssXhtml: function (tagReg, styleDup) {
            var styleRegval = tagReg.exec(styleDup);
            if (!ej.isNullOrUndefined(styleRegval)) {
                var styleTag = styleRegval[0];
                styleTag = styleTag.replace(/\"/gi, "").replace("=", ":").replace("valign", "text-align").replace("align", "text-align");
                styleDup = styleDup.replace(styleRegval[0], "style=\"" + styleTag + ";\"");
            }
            return styleDup;
        },
        _styleXhtml: function (styleVal) {
            var styleRegex = /<((?:(?!\/)).)*?>/ig;
            var styleTemp;
            var k = 0;
            var styleDup = new Array();
            var arr = new Array();
            while ((styleTemp = styleRegex.exec(styleVal)) !== null) {
                styleDup.push(styleTemp[0].toString());
            }
            var styleEx = new Array();
            styleEx = styleDup.slice(0);
            for (var i = 0; i < styleDup.length; i++) {
                if (styleDup[i].indexOf("style=") != -1) {
                    if (styleDup[i].indexOf("height=") != -1) {
                        var htmlTagreg = /( height)=("[^"]*")/i;
                        styleDup[i] = this._replaceHeightWidth(htmlTagreg, styleDup[i]);
                    }
                    if (styleDup[i].indexOf("width=") != -1) {
                        var widthTag = /( width)=("[^"]*")/i;
                        styleDup[i] = this._replaceHeightWidth(widthTag, styleDup[i]);
                    }
                    if (styleDup[i].indexOf("type=") != -1) {
                        var typeTag = /( type)=("[^"]*")/i;
                        var styleRegval = typeTag.exec(styleDup[i]);
                        if (!ej.isNullOrUndefined(styleRegval))
                            var styleTag = this._typeXhtmlValidation(styleDup[i]);
                        styleDup[i] = this._tagCssReplace(styleTag, styleDup[i], styleRegval);
                    }
                    if (styleDup[i].indexOf("valign=") != -1) {
                        var valignTag = /( valign)=("[^"]*")/i;
                        var styleRegval = valignTag.exec(styleDup[i]);
                        var styleTag = styleRegval[0];
                        if (styleDup[i].indexOf("vertical-align:") != -1)
                            styleTag = "";
                        else
                            styleTag = styleTag.replace(/\"/gi, "").replace("=", ":").replace("valign", "vertical-align");
                        styleDup[i] = this._tagCssReplace(styleTag, styleDup[i], styleRegval);
                    }
                    if (styleDup[i].indexOf("align=") != -1) {
                        var alignTag = /( align)=("[^"]*")/i;
                        var styleRegval = alignTag.exec(styleDup[i]);
                        if (!ej.isNullOrUndefined(styleRegval)) {
                            var styleTag = styleRegval[0];
                            if (styleDup[i].indexOf("text-align:") != -1)
                                styleTag = "";
                            else
                                styleTag = styleTag.replace(/\"/gi, "").replace("=", ":").replace("align", "text-align");
                        }
                        styleDup[i] = this._tagCssReplace(styleTag, styleDup[i], styleRegval);
                    }
                }
                if (styleDup[i].indexOf("style=") == -1) {
                    if (styleDup[i].indexOf("height=") != -1) {
                        var htmlTagreg = /(height)=("[^"]*")/i;
                        styleDup[i] = this._getCssXhtml(htmlTagreg, styleDup[i]);
                    }
                    if (styleDup[i].indexOf("width=") != -1) {
                        var widthTag = /(width)=("[^"]*")/i;
                        styleDup[i] = this._getCssXhtml(widthTag, styleDup[i]);
                    }
                    if (styleDup[i].indexOf("type=") != -1) {
                        var typeTag = /( type)=("[^"]*")/i;
                        styleDup[i] = this._getCssXhtml(typeTag, styleDup[i]);
                    }
                    if (styleDup[i].indexOf("valign=") != -1) {
                        var valignTag = /(valign)=("[^"]*")/i;
                        styleDup[i] = this._getCssXhtml(valignTag, styleDup[i]);
                    }
                    if (styleDup[i].indexOf("align=") != -1) {
                        var alignTag = /(align)=("[^"]*")/i;
                        styleDup[i] = this._getCssXhtml(alignTag, styleDup[i]);
                    }
                }
            }
            for (var i = 0; i < styleDup.length; i++) {
                styleVal = styleVal.replace(styleEx[i], styleDup[i]);
            }
            return styleVal;
        },
        _getFormatXhtml: function (startRegex, startVal) {
            var startDup = new Array();
            var j = 0;
            var startTemp;
            while ((startTemp = startRegex.exec(startVal)) != null) {
                startDup.push(startTemp[0]);
            }
            for (var i = 0; i < startDup.length; i++) {
                startVal = startVal.replace(startDup[i], "");
            }
        },
        _startXhtml: function (startVal) {
            if (startVal.indexOf("start=") != -1) {
                var startRegex = /start=\"(.*?)\"/ig;
                startVal = this._getFormatXhtml(startRegex, startVal);
            }
            return startVal;
        },
        _fontXhtml: function (fontVal) {
            if (fontVal.indexOf("<font") != -1) {
                var fontRegex = /<font(.*?)>/ig;
                fontVal = this._getFormatXhtml(fontRegex, fontVal);
            }
            return fontVal;
        },
        _filerXhtmlNode: function (tableRegex, xhtmlVal) {
            var dupArray = new Array();
            var tableTemp;
            while ((tableTemp = tableRegex.exec(xhtmlVal)) != null) {
                dupArray.push(tableTemp[0]);
            }
            return dupArray;
        },
        _replaceXhtmlNode: function (tableDup, xhtmlVal, tableEx) {
            for (var i = 0; i < tableDup.length; i++) {
                xhtmlVal = xhtmlVal.replace(tableEx[i], tableDup[i]);
            }
            return xhtmlVal;
        },
        _tdXhtml: function (xhtmlVal) {
            var tableRegex = /<td((?:(?!<\/td>).))*?<td/ig;
            var tableDup = new Array();
            tableDup = this._filerXhtmlNode(tableRegex, xhtmlVal);
            var tableEx = new Array();
            tableEx = tableDup.slice(0);
            for (var i = 0; i < tableDup.length; i++) {
                var z = tableDup[i].lastIndexOf("<td");
                tableDup[i] = tableDup[i].substr(0, z) + "</td>" + tableDup[i].substr(z, tableDup[i].length);
            }
            xhtmlVal = this._replaceXhtmlNode(tableDup, xhtmlVal, tableEx);
            return xhtmlVal;
        },
        _ptagXhtml: function (htmlText) {
            var ptagRegex1 = /<\/p>((?:(?!<p).))*<\/p>/ig;
            var pTemp1;
            var pEx = new Array();
            if ((pTemp1 = ptagRegex1.exec(htmlText)) != null) {
                while ((pTemp1 = ptagRegex1.exec(htmlText)) != null) {
                    pEx.push(pTemp1[0]);
                }
            }
            var ptagEx = new Array();
            ptagEx = pEx.slice(0);
            for (var i = 0; i < pEx.length; i++) {
                if (pEx[i].indexOf("<p") == -1)
                    pEx[i] = pEx[i].substr(0, pEx[i].length - 4);
            }
            for (var i = 0; i < pEx.length; i++) {
                htmlText = htmlText.replace(ptagEx[i], pEx[i]);
            }
            return htmlText;
        },
        _getUpdaeNodeXhtml: function (tableRegex, xhtmlVal, tableDup) {
            var tableTemp;
            while ((tableTemp = tableRegex.exec(xhtmlVal)) != null) {
                tableDup.push(tableTemp[0]);
            }
            return tableDup;
        },
        _replaceUpdateXhtml: function (tableRegex, xhtmlVal, value) {
            var tableDup = new Array();
            tableDup = this._getUpdaeNodeXhtml(tableRegex, xhtmlVal, tableDup);
            for (var i = 0; i < tableDup.length; i++) {
                xhtmlVal = xhtmlVal.replace(tableDup[i], value);
            }
            return xhtmlVal;
        },
        _replaceXhtmlVal: function (tableDup, xhtmlVal, tableEx) {
            for (var i = 0; i < tableDup.length; i++) {
                xhtmlVal = xhtmlVal.replace(tableEx[i], tableDup[i]);
            }
            return xhtmlVal;
        },
        _replaceTagUpdateXhtml: function (tagRegex, xhtmlVal, value1, value2) {
            var tempArray = new Array();
            tempArray = this._getUpdaeNodeXhtml(tagRegex, xhtmlVal, tempArray);
            var tempEx = new Array();
            tempEx = tempArray.slice(0);
            tempArray[0] = value1 + tempArray[0] + value2;
            return xhtmlVal.replace(tempEx[0], tempArray[0]);
        },
        _replaceTagXHTML: function (styleRegex, xhtmlVal) {
            var styleDup = new Array();
            styleDup = this._getUpdaeNodeXhtml(styleRegex, xhtmlVal, styleDup);
            var styleEx = new Array();
            styleEx = styleDup.slice(0);
            for (var i = 0; i < styleDup.length; i++) {
                styleDup[i] = styleDup[i].replace(/<br\/>/gi, "");
            }
            return this._replaceXhtmlVal(styleDup, xhtmlVal, styleEx);
        },
        _replaceInputParams: function (inputRegex, xhtmlVal) {
            var tableDup = new Array();
            tableDup = this._getUpdaeNodeXhtml(inputRegex, xhtmlVal, tableDup);
            var tableEx = new Array();
            tableEx = tableDup.slice(0);
            for (var i = 0; i < tableDup.length; i++) {
                var divInndex = tableDup[i].indexOf(">");
                tableDup[i] = tableDup[i].substr(0, divInndex) + "/" + tableDup[i].substr(divInndex, tableDup[i].length - 1);
            }
            return this._replaceXhtmlVal(tableDup, xhtmlVal, tableEx);
        },
        _updateXhtml: function () {
            var updateVal = this._getDocument().body.innerHTML;
            if (this.model.enableXHTML) {
                updateVal = updateVal.replace(/hhh/g, "").replace(/<br>/g, "<br/>").replace(/contenteditable="false"/g, "").replace(/contenteditable="true"/g, "").replace(/&nbsp;/g, " ").replace(/<hr>/g, "<hr/>").replace(/cellspacing =[0-9]/g, "").replace(/cellpadding  =[0-9]/g, "");
                this.value(updateVal);
                this._xhtmlTagValidation();
                updateVal = this.value();
                var xhtmlVal = updateVal.replace(/\s+/g, ' ').replace(/> </gi, "><");
                if (xhtmlVal.indexOf("<?xml") != -1) {
                    var xmlRegexp = /<?xml:(.*?)>/ig;
                    var xmlDup = new Array();
                    var k = 0;
                    while ((xmlTemp = xmlRegexp.exec(xhtmlVal)) != null) {
                        var j = xhtmlVal.indexOf("<?xml");
                        xmlDup[k] = xmlTemp[0];
                        xmlDup[k] = xhtmlVal.substr(j, xmlDup[k].length + 2);
                        xhtmlVal = xhtmlVal.replace(xmlDup[k], "");
                        k++;
                    }
                }
                if (xhtmlVal.indexOf("<meta") != -1) {
                    var metaRegexp = /<meta(.*?)>/ig;
                    var metaDup = this._getUpdaeNodeXhtml(metaRegexp, xhtmlVal,  new Array());
                    for (var i = 0; i < metaDup.length; i++) {
                        xhtmlVal = xhtmlVal.replace(metaDup[i], "");
                    }
                }
                if (xhtmlVal.indexOf("<title>") != -1) {
                    var titRegexp = /<title>(.*?)<\/title>/ig;
                    var titDup = this._getUpdaeNodeXhtml(titRegexp, xhtmlVal,  new Array());
                    for (var i = 0; i < titDup.length; i++) {
                        xhtmlVal = xhtmlVal.replace(titDup[i], "");
                    }
                }
                if (xhtmlVal.indexOf("<table") != -1) {
                    //tabletag
                    var tableRegex = /<table(.*?)<\/table>/ig;
                    var tableDup = new Array();
                    tableDup = this._getUpdaeNodeXhtml(tableRegex, xhtmlVal, tableDup);
                    var tableEx = new Array();
                    tableEx = tableDup.slice(0);
                    for (var i = 0; i < tableDup.length; i++) {
                        tableDup[i] = tableDup[i].replace(/<p>/gi, "").replace(/<\/p>/gi, "");
                        if (tableDup[i].indexOf("<p") != -1) {
                            for (var k = 0; k < tableDup[i].length; k++) {
                                var divInndex = tableDup[i].indexOf("<p");
                                var t = 0;
                                if (divInndex != -1) {
                                    for (var j = divInndex + 4; j < tableDup[i].length - 7; j++) {
                                        if (tableDup[i].charAt(j) == '>') {
                                            if (t == 0) {
                                                tableDup[i] = tableDup[i].substr(0, divInndex) + tableDup[i].substr(j + 1, tableDup[i].length - 1);
                                                t++;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    xhtmlVal = this._replaceXhtmlVal(tableDup, xhtmlVal, tableEx);
                }
                //td tag
                if (xhtmlVal.indexOf("<td") != -1) {
                    for (var i = 0; i < 2; i++) {
                        xhtmlVal = this._tdXhtml(xhtmlVal);
                    }
                }
                //tr tag
                if (xhtmlVal.indexOf("<tr") != -1) {
                    var trtdRegex = /<tr(.*?)>(?!<\/td>)/ig;
                    var tabletrDup = new Array();
                    tabletrDup = this._getUpdaeNodeXhtml(trtdRegex, xhtmlVal, tabletrDup);
                    var tabletrEx = new Array();
                    tabletrEx = tabletrDup.slice(0);
                    for (var i = 0; i < tabletrDup.length; i++) {
                        if (tabletrDup[i].indexOf("</td>") != -1)
                            tabletrDup[i] = tabletrDup[i].replace("</td>", "");
                    }
                    xhtmlVal = this._replaceXhtmlVal(tabletrDup, xhtmlVal, tabletrEx);
                    var tableRegex = /<tr(.*?)<\/tr>/ig;
                    var tableDup = new Array();
                    tableDup = this._getUpdaeNodeXhtml(tableRegex, xhtmlVal, tableDup);
                    var tableEx = new Array();
                    tableEx = tableDup.slice(0);
                    for (var i = 0; i < tableDup.length; i++) {
                        var z = tableDup[i].lastIndexOf("</tr>");
                        var w = tableDup[i].charAt(z - 5) + tableDup[i].charAt(z - 4) + tableDup[i].charAt(z - 3) + tableDup[i].charAt(z - 2) + tableDup[i].charAt(z - 1);
                        if (w != "</td>") {
                            tableDup[i] = tableDup[i].substr(0, z) + "</td>" + tableDup[i].substr(z, tableDup[i].length);
                        }
                    }
                    xhtmlVal = this._replaceXhtmlVal(tableDup, xhtmlVal, tableEx);
                }
                //input tag
                if (xhtmlVal.indexOf("<input") != -1) {
                    var inputRegex = /<input((?:(?!\/).))*?>/ig;
                    xhtmlVal = this._replaceInputParams(inputRegex, xhtmlVal);
                    xhtmlVal = xhtmlVal.replace(/<\/input>/gi, "");
                }
                if (xhtmlVal.indexOf("<param") != -1) {
                    var inputRegex = /<param((?:(?!\/).))*?>/ig;
                    xhtmlVal = this._replaceInputParams(inputRegex, xhtmlVal);
                    xhtmlVal = xhtmlVal.replace(/<\/param>/gi, "");
                }
                if (xhtmlVal.indexOf("<p ") != -1 || xhtmlVal.indexOf("<p>") != -1) {
                    var ptagRegex = /<p(.*)<\/p>/ig;
                    var pDup = new Array();
                    pDup = this._getUpdaeNodeXhtml(ptagRegex, xhtmlVal, pDup);
                    var pEx = new Array();
                    pEx.slice(0);
                    var r = pDup[0].length - 1;
                    var htmlText = pDup[0];
                    if (htmlText.indexOf("<p") != -1) {
                        for (var m = htmlText.indexOf("<p") ; m <= r; m++) {
                            var z = "";
                            var i = 0;
                            if (m < r - 3) {
                                z = htmlText.charAt(m) + htmlText.charAt(m + 1);
                            }
                            if (z == "<p") {
                                for (var s = m + 1; s <= r; s++) {
                                    var w;
                                    if ((w = htmlText.charAt(s) + htmlText.charAt(s + 1) + htmlText.charAt(s + 2) + htmlText.charAt(s + 3)) == "</p>") {
                                        i++;
                                    }
                                    if ((w = htmlText.charAt(s) + htmlText.charAt(s + 1)) == "<p") {
                                        if (i == 0) {
                                            if (htmlText.indexOf("<div") != -1) {
                                                var divSplit = htmlText.substr(m, s - m);
                                                if (divSplit.indexOf("<div") != -1) {
                                                    var divIn = divSplit.indexOf("<div");
                                                    var q = 0;
                                                    var u;
                                                    for (var l = m + divIn + 1; l < htmlText.length - 1; l++) {
                                                        var z = htmlText.charAt(l) + htmlText.charAt(l + 1) + htmlText.charAt(l + 2) + htmlText.charAt(l + 3) + htmlText.charAt(l + 4) + htmlText.charAt(l + 5);
                                                        if (z == "</div>")
                                                            if (q == 0) {
                                                                u = l;
                                                            }
                                                    }
                                                    htmlText = htmlText.substr(0, m + divIn) + "</span></p>" + htmlText.substr(m + divIn, ((-(m + divIn) + u) + 6)) + "<p><span>" + htmlText.substr(u + 6, htmlText.length - 1);
                                                    i++;
                                                }
                                            }
                                        }
                                        if (i == 0) {
                                            if (htmlText.indexOf("<table") != -1) {
                                                var divSplit = htmlText.substr(m, s - m);
                                                if (divSplit.indexOf("<table") != -1) {
                                                    var divIn = divSplit.indexOf("<table");
                                                    var q = 0;
                                                    var u;
                                                    for (var l = m + divIn + 1; l < htmlText.length - 1; l++) {
                                                        var z = htmlText.charAt(l) + htmlText.charAt(l + 1) + htmlText.charAt(l + 2) + htmlText.charAt(l + 3) + htmlText.charAt(l + 4) + htmlText.charAt(l + 5) + htmlText.charAt(l + 6) + htmlText.charAt(l + 7);
                                                        if (z == "</table>")
                                                            if (q == 0) {
                                                                u = l;
                                                            }
                                                    }
                                                    htmlText = htmlText.substr(0, m + divIn) + "</span></p>" + htmlText.substr(m + divIn, ((-(m + divIn) + u) + 8)) + "<p><span>" + htmlText.substr(u + 8, htmlText.length - 1);
                                                    i++;
                                                }
                                            }
                                            if (i == 0) {
                                                htmlText = htmlText.substr(0, s - 1) + "</p>" + htmlText.substr(s, htmlText.length - 1);
                                                r++;
                                                i++;
                                            }
                                        }
                                    }

                                }
                            }
                        }
                    }
                    htmlText = htmlText.replace(/<\/p><\/p>/gi, "</p>");
                    var pDupex = new Array();
                    pDupex = pDup.slice(0);
                    for (var i = 0; i < 2; i++) {
                        htmlText = this._ptagXhtml(htmlText);
                    }
                    var htmlRegex = /<p(.*?)<\/p>/ig;
                    var htmlDup = new Array();
                    htmlDup = this._getUpdaeNodeXhtml(htmlRegex, htmlText, htmlDup);
                    var htmlEx = new Array();
                    htmlEx.slice(0);
                    for (var j = 0; j < htmlDup.length; j++) {
                        if (htmlDup[j].indexOf("<table") != -1) {
                            var tagRegex = /<table(.*)<\/table>/ig;
                            htmlDup[j] = this._replaceTagUpdateXhtml(tagRegex, htmlDup[j], "</span></p>", "<p><span>");
                        }
                        if (htmlDup[j].indexOf("<div") != -1) {
                            var tagRegex = /<div(.*)<\/div>/ig;
                            htmlDup[j] = this._replaceTagUpdateXhtml(tagRegex, htmlDup[j], "</span></p>", "<p><span>");
                        }
                    }
                    htmlText = this._replaceXhtmlVal(htmlDup, htmlText, htmlEx);
                    xhtmlVal = xhtmlVal.replace(pEx[0], htmlText);
                }
                if (xhtmlVal.indexOf("<span") != -1) {
                    var spanRegex = /<span(.*?)<\/span>/ig;
                    //var spanTemp;                    
                    var spanDup = new Array();
                    spanDup = this._getUpdaeNodeXhtml(spanRegex, xhtmlVal, spanDup);
                    var spanEx = new Array();
                    sapnEX = spanDup.slice(0);
                    for (var j = 0; j < spanDup.length; j++) {
                        if (spanDup[j].indexOf("<table") != -1) {
                            var tagRegex = /<table(.*)<\/table>/ig;
                            spanDup[j] = this._replaceTagUpdateXhtml(tagRegex, spanDup[j], "</span>", "<span>");
                        }
                        if (spanDup[j].indexOf("<div") != -1) {
                            var tagRegex = /<div(.*)<\/div>/ig;
                            spanDup[j] = this._replaceTagUpdateXhtml(tagRegex, spanDup[j], "</span>", "<span>");
                        }
                        if (spanDup[j].indexOf("<p") != -1) {
                            var tagRegex = /<p(.*)<\/p>/ig;
                            spanDup[j] = this._replaceTagUpdateXhtml(tagRegex, spanDup[j], "</span>", "<span>");
                        }
                    }
                    xhtmlVal = this._replaceXhtmlVal(spanDup, xhtmlVal, spanEx);
                }
                if (xhtmlVal.indexOf("<ol") != -1) {
                    var styleRegex = /<ol(.*?)<\/ol>/ig;
                    xhtmlVal = this._replaceTagXHTML(styleRegex, xhtmlVal);
                }
                if (xhtmlVal.indexOf("<table") != -1) {
                    var styleRegex = /<table(.*?)><\/table>/ig;
                    xhtmlVal = this._replaceTagXHTML(styleRegex, xhtmlVal);
                }
                if (xhtmlVal.indexOf("style") != -1) {
                    var styleRegex = /style="(.*?)"/ig;
                    xhtmlVal = this._replaceTagXHTML(styleRegex, xhtmlVal);
                }
                //style tag 
                if (!ej.isNullOrUndefined(this._fontXhtml(xhtmlVal)))
                    xhtmlVal = this._fontXhtml(xhtmlVal);
                if (xhtmlVal.indexOf("<br ") != -1 || xhtmlVal.indexOf("<br>") != -1) {
                    var htmlTagreg = /<br(.*?)>/ig;
                    xhtmlVal = this._replaceUpdateXhtml(htmlTagreg, xhtmlVal, "<br/>");
                }
                if (xhtmlVal.indexOf("<strong ") != -1 || xhtmlVal.indexOf("<strong>") != -1) {
                    var htmlTagreg = /<strong((?:(?!r).))*?>/ig;
                    xhtmlVal = this._replaceUpdateXhtml(htmlTagreg, xhtmlVal, "<b>").replace(/<\/strong>/gi, "</b>");
                }
                if (xhtmlVal.indexOf("<strong ") != -1) {
                    var htmlTagreg = /<strong (.*?)>/ig;
                    xhtmlVal = this._replaceUpdateXhtml(htmlTagreg, xhtmlVal, "<b>").replace(/<\/strong>/gi, "</b>");
                }
                if (xhtmlVal.indexOf("<u") != -1) {
                    var htmlTagreg = /<u((?:(?!l).))*?>/ig;
                    xhtmlVal = this._replaceUpdateXhtml(htmlTagreg, xhtmlVal, "<span style=\"text-decoration: underline;\">").replace(/<\/u>/gi, "</span>");
                }
                if (xhtmlVal.indexOf("<hr") != -1) {
                    var htmlTagreg = /<hr(.*?)>/ig;
                    var htmlTagtemp = new Array();
                    xhtmlVal = this._replaceUpdateXhtml(htmlTagreg, xhtmlVal, "<hr/>");
                }
                if (!ej.isNullOrUndefined(this._startXhtml(xhtmlVal)))
                    xhtmlVal = this._startXhtml(xhtmlVal);
                if (xhtmlVal.indexOf("v:shapes=") != -1) {
                    var htmlTagreg = /v:shapes=\"(.*?)\"/ig;
                    xhtmlVal = this._replaceUpdateXhtml(htmlTagreg, xhtmlVal, "");
                }
                if (xhtmlVal.indexOf("v:") != -1) {
                    var htmlTagreg = /<v:(.*?)>/ig;
                    xhtmlVal = this._replaceUpdateXhtml(htmlTagreg, xhtmlVal, "");
                }
                if (xhtmlVal.indexOf("/v:") != -1) {
                    var htmlTagreg = /<\/v:(.*?)>/ig;
                    xhtmlVal = this._replaceUpdateXhtml(htmlTagreg, xhtmlVal, "");
                }
                if (xhtmlVal.indexOf("o:") != -1) {
                    var htmlTagreg = /<o:(.*?)>/ig;
                    xhtmlVal = this._replaceUpdateXhtml(htmlTagreg, xhtmlVal, "");
                }
                if (xhtmlVal.indexOf("/o:") != -1) {
                    var htmlTagreg = /<\/o:(.*?)>/ig;
                    xhtmlVal = this._replaceUpdateXhtml(htmlTagreg, xhtmlVal, "");
                }
                if (xhtmlVal.indexOf("role=") != -1) {
                    var htmlTagreg = /role=\"(.*?)\"/ig;
                    xhtmlVal = this._replaceUpdateXhtml(htmlTagreg, xhtmlVal, "");
                }
                if (xhtmlVal.indexOf("target=") != -1) {
                    var htmlTagreg = /target=\"(.*?)\"/ig;
                    xhtmlVal = this._replaceUpdateXhtml(htmlTagreg, xhtmlVal, "");
                }
                if (xhtmlVal.indexOf("language=") != -1) {
                    var htmlTagreg = /language=\"(.*?)\"/ig;
                    xhtmlVal = this._replaceUpdateXhtml(htmlTagreg, xhtmlVal, "");
                }
                if (xhtmlVal.indexOf("lang=") != -1) {
                    var htmlTagreg = /lang=\"(.*?)\"/ig;
					var htmlTagtemp = new Array();
                    htmlTagtemp = this._getUpdaeNodeXhtml(htmlTagreg, xhtmlVal, htmlTagtemp);
                    var height3 = new Array();
                    height3 = htmlTagtemp.slice(0);
                    for (var i = 0; i < htmlTagtemp.length; i++) {
                        xhtmlVal = xhtmlVal.replace(height3[i], htmlTagtemp[i].toLowerCase());
                    }
                }
                xhtmlVal = xhtmlVal.replace(/<\/td><\/td>/gi, "</td>").replace(/<\/th><\/td>/gi, "</th>");
                xhtmlVal = (xhtmlVal == "" || /<div class="e-xhtml">/ig.test(xhtmlVal) ) ? xhtmlVal : "<div class='e-xhtml'>" + xhtmlVal + "</div>";
                updateVal = xhtmlVal.replace(/&quot;/g, "'").replace(/cellspacing=("[0-9]")/g, '').replace(/cellSpacing=("[0-9]")/g, '').replace(/cellpadding=("[0-9]")/g, '').replace(/cellPadding=("[0-9]")/g, '').replace(/border=("[^"]")/g, '').replace(/<!--(.*?)-->/gm, '').replace(/(vAlign)=("[^"]*")/g, "").replace(/(valign)=("[^"]*")/g, "").replace(/(colspan)=("[^"]*")/g, "").replace(/(colSpan)=("[^"]*")/g, "");
                this.value(updateVal);
            }
            return updateVal;
        },
        _setClearFormat: function () {
            var selItemslength = this._rteToolbar.find(".e-active").length;
        },
        //Updates the status of the toolbar items
        _updateToolbarStatus: function () {
            try {
                var _isAligned = false;
                if (this.model.showToolbar) {
                    //Style Tools
                    for (var i = 0; i < this._styleItems.length; i++) {
                        var rtestyleid= document.getElementById(this._rteId + "_" + this._styleItems[i]);
                        if (this._getCommandStatus($.trim(this._styleItems[i].toLowerCase()))) {
                            this._toolBarObj.selectItemByID(this._rteId + "_" + this._styleItems[i]);
                             rtestyleid.classList.add("e-isactive");
                        } else {
                            this._toolBarObj.deselectItemByID(this._rteId + "_" + this._styleItems[i]);
                            rtestyleid.classList.remove("e-isactive");
                        }  
                        } 
                    for (var i = 0; i < this._alignItems.length; i++) {
                        var checkAlign = (this._isIE())?this._alignStatus($.trim(this._alignItems[i].toLowerCase())) : this._getCommandStatus($.trim(this._alignItems[i].toLowerCase()));
                        if (checkAlign) {
                            this._toolBarObj.selectItemByID(this._rteId + "_" + this._alignItems[i]);
                            _isAligned = true;
                        } else
                            this._toolBarObj.deselectItemByID(this._rteId + "_" + this._alignItems[i]); 
                } 
                    if (!_isAligned) this._toolBarObj.selectItemByID(this._rteId + "_" + "justifyLeft"); 
                    for (var i = 0; i < this._scriptsItems.length; i++) {
                         var rtescriptid= document.getElementById(this._rteId + "_" + this._scriptsItems[i]);
                         if (this._getCommandStatus($.trim(this._scriptsItems[i].toLowerCase()))) {
                            this._toolBarObj.selectItemByID(this._rteId + "_" + this._scriptsItems[i]);
                             rtescriptid.classList.add("e-isactive");
                        } else {
                            this._toolBarObj.deselectItemByID(this._rteId + "_" + this._scriptsItems[i]);
                           rtescriptid.classList.remove("e-isactive");
                        }
                    } 
                     var rteorderid=document.getElementById(this._rteId + "_" + "orderedList"); 
                    var rteunorderid= document.getElementById(this._rteId + "_" + "unorderedList");
                    if (this._getCommandStatus('InsertOrderedList')) {
                        this._toolBarObj.selectItemByID(this._rteId + "_" + "orderedList");
                        rteorderid.classList.add("e-isactive");
                    } else {
                        this._toolBarObj.deselectItemByID(this._rteId + "_" + "orderedList");
                        rteorderid.classList.remove("e-isactive");
                    } if (this._getCommandStatus('InsertUnorderedList')) {
                        this._toolBarObj.selectItemByID(this._rteId + "_" + "unorderedList");
                        rteunorderid.classList.add("e-isactive");
                    } else {
                        this._toolBarObj.deselectItemByID(this._rteId + "_" + "unorderedList");
                        rteunorderid.classList.remove("e-isactive");
                    }
                
                   this._updateIndentStatus(); 
                }
            }
            catch (error) { }
        },

        _alignStatus: function(value) {
            var node = this._getRange().startContainer;
            var isAlignstatus= false;
            do {
                    isAlignstatus = this._isAligment(node, value);
                    node = node.parentNode;
                } while (node && (node !== this._getDocument().body));
            return isAlignstatus;
        },

        _isAligment: function(node, value){
            var align = node.style && node.style.textAlign;
            var isAlign = false
            if (align === 'left' && value === 'justifyleft') {
                return isAlign = true;
            }
            else if (align === 'center' && value === 'justifycenter') {
                return isAlign = true;
            }
            else if (align === 'right' && value === 'justifyright') {
                return isAlign = true;
            }
            else if (align === 'justify' && value === 'justifyfull') {
                return isAlign = true;
            }
        },
        _updateFormat: function () {
            try {
                if (this._formatDDL && this.model.showToolbar && !ej.isNullOrUndefined(this.model.tools["formatStyle"])) {
                    var formatName = $.trim(this._getCommandValue('formatblock').replace(/'/g, ""));
                    if (!this._isIE())
                        formatName = "<" + formatName + ">"; 
                    if (this._formatDDL.hasClass('e-dropdownlist')) {
                        if (ej.isNullOrUndefined(formatName) || formatName == "")
                            this._formatDDL.ejDropDownList({ "value": this._getLocalizedLabels("format") });
                        else if (!$(this._formatDDL).parents("ul.e-rte-format").length == 0)
                            this._formatDDL.ejDropDownList("setSelectedValue", formatName);
                    }
                }
            }
            catch (error) { }
        },

        _updateFontOptionStatus: function () {
            try {
                if (this.model.showFontOption && this.model.showToolbar && !ej.isNullOrUndefined(this.model.tools["font"])) {
                    var fontName = $.trim(this._getCommandValue('fontname').replace(/"/g, "").replace(/'/g, "").replace(/, /g, ","));
                    (ej.isNullOrUndefined(fontName) || fontName == "") && (fontName = "Segoe UI");
                    if (!ej.isNullOrUndefined(this._fontStyleDDL) && this._fontStyleDDL.hasClass('e-dropdownlist') && !$(this._fontStyleDDL).parents("ul.e-rte-fontgroup").length == 0)
                        this._fontStyleDDL.ejDropDownList("setSelectedValue", fontName);

                    var fontSize = (this._isIE8()) ? this._getCommandValue('fontsize') : (this._getDocumentHandler() && this._operationHandler._validateFontSize(this._getRange().startContainer));
                    (ej.isNullOrUndefined(fontSize) || fontSize == "") && (fontSize = 2);
                    if (!ej.isNullOrUndefined(this._fontSizeDDL) && this._fontSizeDDL.hasClass('e-dropdownlist') && !$(this._fontSizeDDL).parents("ul.e-rte-fontgroup").length == 0)
                        this._fontSizeDDL.ejDropDownList("setSelectedValue", fontSize);
                }
            }
            catch (error) { }
        },

        _getSelText: function () {
            var selectedtext = '';
            var selection;
            var textnode;
            if (!this._isIE()) {
                if (window.getSelection) {
                    selection = this._getWindow().getSelection();
                    var range = this._saveSelection();
                    textnode = document.createTextNode(range.toString());
                    selectedtext = textnode.nodeValue;
                }
                else if (document.getSelection) {
                    selectedtext = this._getWindow().document.getSelection();
                }
            }
            else
                selectedtext = this._seleText;
            return selectedtext;
        },

        _isIE: function () {
            var _ie = false, browserInfo = ej.browserInfo();
            if (browserInfo.name == 'msie') {
                _ie = true;
            }
            return _ie;
        },

        _isIE8: function () {
            var _ie8 = false, browserInfo = ej.browserInfo();
            if (browserInfo.name == 'msie' && browserInfo.version == "8.0") {
                _ie8 = true;
            }
            return _ie8;
        },
        //Vaidate the input URL string
        _isUrl: function (url) {
            var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
            return regexp.test(url);
        },
        _pasteHtml: function (html, textnodeType) {
            var sel, range;
            if (this._pasteAPIFlag) {
                if (this._isIE())
                    this._focus();
            }
            else
                this._focus();
            if (window.getSelection) {
                // IE9 and non-IE
                sel = this._getWindow().getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                    range = this._pasteFlag ? this._pasteRangeVal : sel.getRangeAt(0);
                    var cnode = range.commonAncestorContainer, parentElement, i, container;
                    parentElement = cnode.nodeType == 3 ? $(cnode).parentsUntil("body") : $(cnode).children();
                    for (i = parentElement.length - 1; i >= 0; i--) {
                        if (parentElement[i].textContent == range.toString() && parentElement[i].nodeName.toLowerCase() != "li") {
                            range.selectNode(parentElement[i]);
                            break;
                        }
                    }
                    range.deleteContents();
                    // some browsers (IE9, for one)
                    var el = document.createElement("div");
                    el.innerHTML = html;
                    var frag = this._getDocument().createDocumentFragment(), node, lastNode;
                    var parent = el.firstChild;
                    if (!(this._pasteFlag || this._pasteAPIFlag)) {
                        while ((node = el.firstChild)) {
                            lastNode = frag.appendChild(node);
                        }
                    }
                    else {
                        while ((node = el.firstChild)) {
                            if (parent != node)
                                lastNode = parent.appendChild(node);
                            else
                                el.removeChild(el.firstChild);
                        }
                        lastNode = frag.appendChild(parent);
                    }
                    range.insertNode(frag);
                    // Preserve the selection
                    if (lastNode && !textnodeType) {
                        range = range.cloneRange();
                        range.setStartAfter(lastNode);
                        range.collapse(true);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                    else {
                        range = this.createRange();
                        range.setStart(lastNode, lastNode.data.length);
                        range.setEnd(lastNode, lastNode.data.length);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                }
            } else if (this._getDocument().selection && this._getDocument().selection.type != "Control") {
                // IE < 9
                if (this._ieSelectionRange && !(this._ieSelectionRange.offsetLeft == 0 && this._ieSelectionRange.offsetTop == 0 && this._ieSelectionRange.boundingHeight == 0)) {
                    if (this._pasteFlag)
                        this.selectRange(this._pasteRangeVal);
                    var ieParentElement = this._ieParents(this._getRange()), i, isParent = false;
                    if (this._pasteAPIFlag)
                        this._getRange().pasteHTML(html);
                    else {
                        var text = this._getRange().text;
                        for (i = ieParentElement.length - 1; i >= 0; i--) {
                            if (ieParentElement[i].innerText == text && ieParentElement[i].nodeName.toLowerCase() != "li") {
                                ieParentElement[i].nodeName == "BODY" ? ieParentElement[i].innerHTML = html : ieParentElement[i].outerHTML = html;
                                isParent = true;
                                break;
                            }
                        }
                        if (!isParent)
                            this._getRange().pasteHTML(html);
                    }
                }
                else
                    this._getDocument().body.insertAdjacentHTML("afterBegin", html);
            }
            this._pasteAPIFlag = this._pasteFlag = false;
        },
        _ieParents: function (range) {
            var parentElement = [];
            rangeval = this._isIE8() ? range.duplicate() : range.cloneRange();
            range.parentElement = rangeval.parentElement();
            while (range.parentElement.nodeName != "HTML") {
                if (range.parentElement.nodeName == "TD" || range.parentElement.nodeName == "TH")
                    break;
                parentElement.push(range.parentElement);
                range = range.parentElement;
            }
            return parentElement;
        },

        _getLocalizedLabels: function (property) {
			return this._localizedLabels[property] === undefined ? ej.RTE.Locale["en-US"][property] : this._localizedLabels[property];
        },

        _setLocale: function () {
              for (var item = 0; item < this._toolsList.length; item++) {
                var items = this._toolsList[item];
                var tipItems = this.model.tools[items]
                for (var i = 0; i < tipItems.length; i++) {
                    var liTag = $("#" + this._rteId + "_" + tipItems[i].replace(/ /g, ''));
                        liTag.attr('data-content', this._getLocalizedLabels(tipItems[i]));
                    if (tipItems[i] === "fullScreen") liTag.attr('data-content', this._getLocalizedLabels("maximize"));
                    else if (tipItems[i] === "findAndReplace")
                        liTag.attr('data-content', this._getLocalizedLabels("FindAndReplace"));
                }
            }
            this._createTable.find(".e-rte-createCustomTableLink .customtable-link").text(this._getLocalizedLabels("customTable"));
            this._createTable.find(".e-rte-createCustomTableLink .customtable-link").attr("title", this._getLocalizedLabels("customTable"));
            this._createTable.find(".e-rte-eTblProperties .customtable-link").text(this._getLocalizedLabels("editTable"));
            this._createTable.find(".e-rte-eTblProperties .customtable-link").attr("title", this._getLocalizedLabels("editTable"));
            this._tblheaderDiv.html(this._getLocalizedLabels("createTable"));
            this._alertWindow.find(".e-rte-btn.e-alert-ok").text(this._getLocalizedLabels("dialogOk")); 
            this._alertWindow.find(".e-rte-btn.e-alert-cancel").text(this._getLocalizedLabels("dialogCancel")); 
            this._toolBarItems.find(".customBGcolor a.customcolor-link").text(this._getLocalizedLabels("customBGColor"));
			this._toolBarItems.find(".customcolor a.customcolor-link").text(this._getLocalizedLabels("customFontColor"));
            if(!ej.isNullOrUndefined(this._bgTransparent))this._bgTransparent.text(this._getLocalizedLabels("TransBGColor"));
            if(!ej.isNullOrUndefined(this._htmlSource))this._htmlSource.attr('data-content', this._getLocalizedLabels("viewHtml"));
            if(!ej.isNullOrUndefined(this._clearFormat))this._clearFormat.attr('data-content', this._getLocalizedLabels("clearFormat")); 
            if(!ej.isNullOrUndefined(this._clearAll))this._clearAll.attr('data-content', this._getLocalizedLabels("clearAll"));
            if(this.model.showContextMenu){
            this._initContextMenu();
            var ContextMenutag = $("#" + this._rteId + "_contextmenu").data("ejMenu");
            ContextMenutag = this._textMenuObj;
            ContextMenutag.setModel({ fields: { dataSource: this._initContextMenu()} });
            }
            this._renderFormat();
            var ddl = $(this.wrapper).find(".e-ddl.e-widget .e-dropdownlist"), spbtn = $(this.wrapper).find(".e-split.e-widget .e-splitbutton");
            ddl.length && ddl.ejDropDownList({ height: "30px" });
            spbtn.length && spbtn.ejSplitButton({ height: '30px' }); 
        },

        _getSelectedNode: function () {
            var temp = this._getRange();
            var element, rng = (this._ieSelectionRange && temp.offsetLeft == 0 && temp.offsetTop == 0 && temp.boundingHeight == 0) ? this._ieSelectionRange : temp;
            var startContainer = rng.startContainer, endContainer = rng.endContainer;
            var startOffset = rng.startOffset, endOffset = rng.endOffset;
            // if (!ej.isNullOrUndefined(rng.commonAncestorContainer))
            // if (rng.commonAncestorContainer.nodeName == "BODY")
            // this._tempEle = $(rng.commonAncestorContainer);
            // else if ($(rng.cloneContents()).text() == $($($(rng.startContainer).parents("li")).contents()[0]).text() && (startOffset == 0 && endOffset == $(rng.startContainer).parents("li").text().length) || startOffset == endOffset || startOffset == 0 && endOffset == 1)
            // this._tempEle = $($(rng.startContainer).parents("li"));
            // else if ((rng.commonAncestorContainer.nodeName == "OL") && startOffset != endOffset && endOffset != 0 && endOffset != 1)
            // this._tempEle = $(rng.commonAncestorContainer);
            // else
            // this._tempEle = $(rng.startContainer);
            if (!rng) {
                return this._getDocument().selection;
            }
            if (rng.setStart) {
                element = rng.commonAncestorContainer;
                //Image tage and link selection
                if (!rng.collapsed) {
                    if (startContainer == endContainer) {
                        if (endOffset - startOffset < 2) {
                            if (startContainer.hasChildNodes()) {
                                element = startContainer.childNodes[startOffset];
                            }
                        }
                    }
                    if (startContainer.nodeType === 3 && endContainer.nodeType === 3) {
                        if (startContainer.length === startOffset) {
                            startContainer = this._skipEmptyNode(startContainer.nextSibling, true);
                        } else {
                            startContainer = startContainer.parentNode;
                        }

                        if (endOffset === 0) {
                            endContainer = this._skipEmptyNode(endContainer.previousSibling, false);
                        } else {
                            endContainer = endContainer.parentNode;
                        }

                        if (startContainer && startContainer === endContainer) {
                            return startContainer;
                        }
                    }
                }

                if (element && element.nodeType == 3) {
                    return element.parentNode;
                }
                return element;
            }
            element = rng.item ? rng.item(0) : rng.parentElement();
            return element;
        },

        _skipEmptyNode: function (node, forwards) {
            var orig = node;
            while (node && node.nodeType === 3 && node.length === 0) {
                node = forwards ? node.nextSibling : node.previousSibling;
            }
            return node || orig;
        },

        _getSelection: function () {
            var selCurrent;
            if (this._isIE()) {
                selCurrent = this._getDocument().selection.createRange();
                selCurrent.type = this._getDocument().selection.type;
            }
            else {
                selCurrent = window.getSelection();
                if (selCurrent.rangeCount) {
                    sText = selCurrent.getRangeAt(0);
                }
                selCurrent.type = this._getWindow().getSelection().type;
            }
            return selCurrent;
        },

        _saveSelection: function () {
            var win = this._getWindow();
            var doc = win.document;
            var sel = win.getSelection ? win.getSelection() : doc.selection;
            var range;

            if (sel) {
                if (sel.createRange) {
                    range = sel.createRange();
                } else if (sel.rangeCount > 0 && sel.getRangeAt(0)) {
                    range = sel.getRangeAt(0);
                } else if (sel.anchorNode && sel.focusNode && doc.createRange) {
                    // Older WebKit browsers
                    range = doc.createRange();
                    range.setStart(sel.anchorNode, sel.anchorOffset);
                    range.setEnd(sel.focusNode, sel.focusOffset);
                    if (range.collapsed !== sel.isCollapsed) {
                        range.setStart(sel.focusNode, sel.focusOffset);
                        range.setEnd(sel.anchorNode, sel.anchorOffset);
                    }
                }
                else if (doc.createRange()) {
                    range = doc.createRange();
                    range.setStart(win.document.body, 0);
                    range.setEnd(win.document.body, 0);
                }
                else {
                    var iframe = document.getElementsByTagName("iframe")[0];
                    var win = iframe.contentWindow;
                    range = win.document.createRange();
                    range.setStart(win.document.body, 0);
                    range.setEnd(win.document.body, 0);
                }
            }
            return range;
        },

        _restoreSelection: function (range) {
            var win = this._getWindow();
            var doc = win.document;
            var sel = win.getSelection ? win.getSelection() : doc.selection;
            if (sel && range) {
                if (range.select) {
                    range.select();
                } else if (sel.removeAllRanges && sel.addRange) {
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        },

        _getRange: function () {
            if (this._isIE8()) {
                var temp = this._saveSelection();
                var rng = (this._ieSelectionRange && temp.offsetLeft == 0 && temp.offsetTop == 0 && temp.boundingHeight == 0) ? this._ieSelectionRange : temp;
                return rng;
            }
            else if (this._isIE())
                //Table Aciton Not working in IE condition (this._selectionRange.length>0)
                return this._ieSelection = (window.getSelection && (ej.isNullOrUndefined(this._selectionRange) ? false : (this._selectionRange.length > 0))) ? this._selectionRange : this._saveSelection();
            else if (this._getWindow().getSelection() && this._getWindow().getSelection().rangeCount > 0)
                return this._getWindow().getSelection().getRangeAt(0);
            else {
                var iframe = document.getElementsByTagName("iframe")[0];
                var win = iframe.contentWindow;
                var range
                try {
                    range = win.document.createRange();
                    range.setStart(win.document.body, 0);
                    range.setEnd(win.document.body, 0);
                }
                catch (error) {
                    range = this._getDocument().createRange();
                    range.setStart(this._getDocument().body, 0);
                    range.setEnd(this._getDocument().body, 0);
                }
                return range;
            }
        },
        _setBackupData: function () {
            var htmlTxt = this.getHtml();
            var bkuplen = this._backupArray.length;
            if (bkuplen == this.model.undoStackLimit + 1)
                this._backupArray.splice(0, 1);
            if (htmlTxt != this._backupArray[bkuplen - 1] && this.model.undoStackLimit > 0)
                this._backupArray.push(htmlTxt);
            this._undoRedoPosition = this._backupArray.length - 1;
            if (this.model.showToolbar && this._rteToolbar.find("li.e-rteItem-undo") && this._backupArray.length > 1 && !$("#" + this._rteId + "_" + "undo").hasClass("e-rteTooldisable"))
                this._toolBarObj.enableItemByID(this._rteId + "_" + "undo");
        },
        _getSelectedHtmlString: function () {
            if (typeof document.selection != "undefined" && this._isIE8()) {
                var ieParentElement = this._ieParents(this._getRange()), i, isParent = false, html;
                for (i = ieParentElement.length - 1; i >= 0; i--) {
                    if (ieParentElement[i].innerText == this._getRange().text) {
                        html = ieParentElement[i].nodeName == "BODY" ? ieParentElement[i].innerHTML : ieParentElement[i].outerHTML;
                        isParent = true;
                        break;
                    }
                }
                if (!isParent)
                    html = this._getRange().htmlText.substring(0, 1) == "<" ? this._getRange().text : this._getRange().htmlText;
                return html;
            }
            else {
                var range = this._getRange(), cnode = range.commonAncestorContainer, parentElement, i, container;
                parentElement = cnode.nodeType == 3 ? $(cnode).parentsUntil("body") : $(cnode).children();
                for (i = parentElement.length - 1; i >= 0; i--) {
                    if (parentElement[i].textContent != "" && parentElement[i].textContent == range.toString()) {
                        range.selectNode(parentElement[i]);
                        break;
                    }
                }
                container = document.createElement("div");
                container.appendChild(range.cloneContents());
                return container.innerHTML;
            }
        },

        _getText: function () {
            var _body = this._getDocument().body;
            if (_body != null) {
                if (!this._isIE())
                    return _body.textContent;
                else
                    return _body.innerText;
            }
        },
        _validateMaxLength: function (e) {
            if (this.model.maxLength != null) {
                var len = this.model.maxLength;
                var usertext = this._getText();
                if (len <= usertext.length) {
                    if (!(e.keyCode < 47 || e.ctrlKey && e.keyCode == 65 || e.ctrlKey && e.keyCode == 67 || e.ctrlKey && e.keyCode == 86 || e.ctrlKey && e.keyCode == 88)) {
                        this._keypressFlag = false;
                        this._cancelEvent(e);
                    }
                }
            }
        },
        _cancelEvent: function (e) {
            e.returnValue = false;
            e.stopPropagation();
            e.preventDefault();
            return false;
        },

        _alignToolUpdate: function (name) {
            for (var i = 0; i < this._alignItems.length; i++) {
                if (this._alignItems[i] === name)
                    this._toolBarObj.selectItemByID(this._rteId + "_" + name);
                else
                    this._toolBarObj.deselectItemByID(this._rteId + "_" + this._alignItems[i]);
            }
        },


        _getCommandStatus: function (commandName) {
            var state = this._getDocument().queryCommandState(commandName);
            return state;
        },


        _getCommandValue: function (commandName) {
            var value = this._getDocument().queryCommandValue(commandName);
            if (this._isIE()) {
                if (commandName == "fontname") {
                    for (var i = 0; i < this.model.fontName.length; i++) {
                        if (value == this.model.fontName[i].text) {
                            value = this.model.fontName[i].value;
                            break;
                        }
                    }
                    if (ej.isNullOrUndefined(value) || value == "")
                        value = this.model.fontName[0].value;
                }
                if (commandName == "formatblock") {
                    for (var i = 2; i < this.model.format.length; i++) {
                        if (value == this.model.format[i].text) {
                            value = this.model.format[i].value;
                            break;
                        }
                    }
                    if (value == "Normal")
                        value = this.model.format[0].value;
                }
            }
            return value;
        },


        _undo: function () {
            if (this._undoRedoPosition > 0) {
                if (this.model.enableHtmlEncode)
                    this.setHtml(this._decode(this._backupArray[this._undoRedoPosition - 1]));
                else
                    this.setHtml(this._backupArray[this._undoRedoPosition - 1]);
                this._undoRedoPosition--;
                this._focus();
                this._updateFontOptionStatus();
                this._updateFormat();
                this._updateCount();
                this._toggleEditTable();
                if (this.model.isResponsive) this._toolBarObj._liTemplte.removeClass("e-display-none");
                this._toolBarObj.enableItemByID(this._rteId + "_" + "redo");
            }
            if (this._undoRedoPosition == 0) {
                this._toolBarObj.disableItemByID(this._rteId + "_" + "undo");
                this._toolBarObj.enableItemByID(this._rteId + "_" + "redo");
            }
            this._updateToolbarStatus();
            this._trigger("execute", { commandName: "undo" });
        },
        _getRedoContent: function () {
            if (this.model.enableHtmlEncode)
                return (this._decode(this._backupArray[this._undoRedoPosition + 1]));
            else
                return (this._backupArray[this._undoRedoPosition + 1]);
        },

        _redo: function () {
            if (this._undoRedoPosition != this._backupArray.length) {
                if (this._backupArray[this._undoRedoPosition + 1] != null) {
                    var _redoContent = this._getRedoContent();
                    this.setHtml(_redoContent)
                    this._undoRedoPosition++;
                }
                else {
                    var redoString = this._getRedoContent();
                    if (!ej.isNullOrUndefined(redoString)) this.setHtml(redoString);
                    this._undoRedoPosition = this._backupArray.length - 2;
                }
                this._focus();
                this._updateToolbarStatus();
                this._updateFontOptionStatus();
                this._updateFormat();
                this._updateCount();
                if (!ej.isNullOrUndefined(this._toolBarObj)) {
                    if (this._backupArray.length - 1 > 0)
                        this._toolBarObj.enableItemByID(this._rteId + "_" + "undo");
                    if (this._undoRedoPosition == this._backupArray.length - 1)
                        this._toolBarObj.disableItemByID(this._rteId + "_" + "redo");
                }
            }
            this._trigger("execute", { commandName: "redo" });
        },


        _setContent: function (htmltxt) {
            var editdoc = this._getDocument();
            if (editdoc != "" && !ej.isNullOrUndefined(editdoc)) {
                editdoc.open();
                editdoc.write(htmltxt);
                editdoc.close();
                editdoc.EditMode = true;
            }
        },
        _removeResizeObject: function () {
            $(this._getDocument()).find(".e-rteColumnResizer , .e-rteRowResizer , .e-rteLastcolumn").remove();
        },
        _tableMouseOver: function (e) {
            if (e.target.nodeName == "TABLE" || (ej.browserInfo().name === "mozilla" && e.target.nodeName == "TD")) {
                this._curTable = (e.target.nodeName == "TD") ? $(e.target).closest("table")[0] : e.target;
                this._removeResizeObject();
                $(this._getDocument()).find(".e-rte-tablebox").remove();
                this._tableResizeObject($(this._curTable));
            }
        },
        _preventDefaultResize: function () {
            var proxy = this._getDocument();
            (ej.browserInfo().name === "msie" && ej.browserInfo().version === "11.0") ? proxy.body.addEventListener('mscontrolselect', this._ieDefaultTableHandler) : (this._isIE()) && proxy.body.attachEvent('oncontrolselect', this._ieTableHandler);
            if (ej.browserInfo().name === "mozilla") {
                proxy.designMode = "on";
                proxy.execCommand("enableObjectResizing", false, "false");
                proxy.execCommand("enableInlineTableEditing", false, "false");
            }
        },
        _tableResizeObject: function (_tableEle) {
            if (this.model.allowEditing) this._preventDefaultResize();
            var cellspace = parseInt($(_tableEle).attr("cellspacing") ? $(_tableEle).attr("cellspacing") : 0);
            this._newcol = _tableEle.find("tr:first td").not(":first"), this._newRow = _tableEle.find("tr td:nth-child(1)"), this._newlas = _tableEle.find("tr:first td:last");
            for (var i = 0; this._newcol.length > i ; i++)
                $(this._getDocument().body).after("<div class =\"e-rteColumnResizer\"  unselectable=\"on\" contenteditable=\"false\" data-col =" + (i + 1) + " style=\"top:" + $(this._newcol[i]).closest("table").offset().top + "px;left:" + $(this._newcol[i]).offset().left + "px;height:" + $(this._newcol[i]).closest("table").outerHeight() + "px;width:" + (5 + cellspace) + "px;margin-left: " + (-4 - cellspace) + "px;\"></div>");
            for (var i = 0; this._newRow.length > i ; i++)
                $(this._getDocument().body).after("<div class =\"e-rteRowResizer\" unselectable=\"on\"  contenteditable=\"false\" data-row =" + (i) + " style=\"top:" + ($(this._newRow[i]).offset().top + $(this._newRow[i]).height()) + "px;left:" + $(this._newRow[i]).offset().left + "px;width:" + $(this._newRow[i]).closest("table").width() + "px;height:" + (5 + cellspace) + "px;\"></div>");
            $(this._getDocument().body).after("<div class =\"e-rteColumnResizer e-rtelastcol\" data-col =" + (this._newcol.length) + "  contenteditable=\"false\" style=\"top:" + $(this._newlas).closest("table").offset().top + "px;left:" + ($(this._newlas).offset().left + $(this._newlas).width()) + "px;height:" + $(this._newlas).closest("table").outerHeight() + "px;width:" + (5 + cellspace) + "px;margin-left:3px;\"></div>");
            this._botRigTab = ej.buildTag("span.e-rte-tablebox e-rte-botrig", "", { "cursor": "nwse-resize", "width": "5px", "height": "5px", "position": "absolute", "display": "block", "background": "#fff", "border": "1px solid #000" }, {});
            var tableBox = _tableEle.find("tr:last td:last:not(:has(>span.e-rte-tablebox))");
            if (tableBox.length > 0) $(this._getDocument().body).after($(this._botRigTab).css({ "left": ((parseInt(tableBox.closest("table").width())) + tableBox.closest("table").offset().left) + "px", "top": ((parseInt(tableBox.closest("table").height())) + tableBox.closest("table").offset().top) + "px" }));
        },
        _ieDefaultTableHandler: function (e) {
            e.preventDefault();
        },
        _ieTableHandler: function (e) {
            return false;
        },


        _tableCellStart: function (e) {
            this._tableInsertAt = this._saveSelection();
        },


        _tableCellSelect: function (e) {
            var cellEle, target = $(e.target);
            var row = target.parent().index();
            var col = target.index();
            this._createTable.find("div.e-rte-tablecell").each(function (index) {
                cellEle = $(this);
                if (cellEle.index() <= col && cellEle.parent().index() <= row) {
                    cellEle.addClass("e-active");
                }
                else {
                    cellEle.removeClass("e-active");
                }
            });
            this._tblheaderDiv.html((col + 1) + "x" + (row + 1) + this._getLocalizedLabels("table"));
            $(this._getDocument()).find("table.e-rte-tableremove").remove();
            if (!ej.isNullOrUndefined(this._tableInsertAt))
                this._restoreSelection(this._tableInsertAt);
        },
        _tableCellLeave: function (e) {
            this._createTable.find("div.e-rte-tablecell").removeClass("e-active");
            $(this._getDocument()).find("table.e-rte-tableremove").remove();
            this._tblheaderDiv.html(this._getLocalizedLabels("createTable"));
        },
        _tableCellDown: function (e) {
            var target = $(e.target);
            var row = target.parent().index() + 1;
            var col = target.index() + 1;
            this._focus();
            $(this._getDocument()).find("table.e-rte-tableremove").remove();
            if (!ej.isNullOrUndefined(this._tableInsertAt)) {
                this._restoreSelection(this._tableInsertAt);
                this._onInsertTable(row, col, false);
            }
            var _tableEle = $(this._getDocument()).find("table.e-rte-table");
            //Content editable propert for table and td removed and key navigation support added in keydown           
            if (!this.model.enableRTL) this._on(_tableEle, "mouseover", this._tableMouseOver);
            this._createTable.ejDialog("close",{clickAction:true});
            this._setBackupData();
            this._onChange();
            if (this.model.isResponsive && !($(this._toolBarObj._liTemplte).hasClass("e-inline"))){
                this._toolBarObj._liTemplte.addClass("e-display-none");
                this._toolBarObj.contstatus = false;
            }
        },

        _tableGenerator: function (rows, cols, designTime, width, height, spacing, padding, align, border, caption) {
            var tblClass = "e-rte-table", borderstyle;
            if (designTime)
                tblClass += " e-rte-tableremove";
            width = ej.isNullOrUndefined(width) || width == "" ? "width:99%;" : "width:" + (isNaN(Number(width))?width:width+"px") + ";";
            height = ej.isNullOrUndefined(height) || height == "" ? "" : "height:" + (isNaN(Number(height))?height:height+"px") + ";";
            spacing = ej.isNullOrUndefined(spacing) || spacing == "" ? "" : "border-spacing:" + (isNaN(Number(spacing))?spacing:spacing+"px") + ";";
            padding = ej.isNullOrUndefined(padding) || padding == "" ? "" : " style='padding:" + (isNaN(Number(padding))?padding:padding+"px") + ";'";
            align = ej.isNullOrUndefined(align) || align=="" ? "" : (align=="center") ?" margin: 0 auto;" : " float:" + align + ";";
            var  colTemplate = "<td"+ padding+"><br _moz_dirty=''/></td>"
            switch (border) {

                case "dotted": borderstyle = "dotted";
                    break;
                case "double":
                    this._border = "border:3px double #5C5C5C;";
                    borderstyle = "double";
                    return "<table border='1' class='" + tblClass + "' style='" + width + " " + height + " " + this._border + " " + spacing + " " + padding + " " + align + "' >" + (caption ? "<caption></caption>" : "") + Array(rows + 1).join("<tr>" + Array(cols + 1).join("<td"+padding+"><br _moz_dirty=''/></td>") + "</tr>") + "</table>";
                    break;
                case "dashed": borderstyle = "dashed";
                    break;
                case "solid": borderstyle = "solid";
                    break;
                default: borderstyle = "solid";
                    break;
            }
            if (borderstyle != "double") {
                this._border = "border:1px " + borderstyle + "#5C5C5C;";
                return "<table border='1' class='" + tblClass + "' style='" + width + height + this._border + spacing  + align + "' >" + (caption ? "<caption><br type=\"_moz\"></caption>" : "") + Array(rows + 1).join("<tr>" + Array(cols + 1).join("<td"+padding+"><br _moz_dirty=''/></td>") + "</tr>") + "</table>";
            }

            return "<table border='1' class='" + tblClass + "' style='border:1px solid #5C5C5C; " + width + height + spacing + align + "' >" + (caption ? "<caption><br type=\"_moz\"></caption>" : "") + Array(rows + 1).join("<tr>" + Array(cols + 1).join(colTemplate) + "</tr>") + "</table>";
        },

        _openCustomTable: function (e) {
            this._createCustomTable();
            if (e.currentTarget.id == this._rteId + "_createCustomTableLink") {
                $("#" + this._rteId + "_customTable_wrapper").css({ "z-index": this._onGetMaxZindex() });
                this._customTableDialog.ejDialog("open");
                this._createTable.ejDialog("close");
                this._widthFocusOut();
            }
            else {
                if (!this._createTable.find("div.e-rte-eTblProperties").hasClass('e-disable')) {
                    this._eTblManager();
                    $("#" + this._rteId + "_eTbl_wrapper").css({ "z-index": this._onGetMaxZindex() });
                    this._eTblDialog.ejDialog("open");
                    this._createTable.ejDialog("close");
                    this._on(this._getTableObj("Width"), "focusout", this._widthFocusOut);
                    this._widthFocusOut();
                }
            }
        },
		_createcustomColorpalette:function(e)
		{
		    var proxy = $("#" + this._rteId).data("ejRTE");
			var palette=ej.buildTag("div.e-custom-palette");
		    this._customColor = ej.buildTag("div.e-rte-customColor#" + this._rteId + "_customColorDialog");
            var colorpalette= ej.buildTag("input.e-custom-palette#" + this._rteId + "customcolor");
            colorpalette.appendTo(this._customColor);
			this.colorobj=this._customColor.find(".e-custom-palette").ejColorPicker({locale:this.model.locale, enableRTL: this.model.enableRTL,enableOpacity:true,showRecentColors:true,modelType: "picker",cssClass: this.model.cssClass,showSwitcher: false,buttonText: {apply: this._getLocalizedLabels("buttonApply"), cancel: this._getLocalizedLabels("buttonCancel")},select:function(args){ 
			
			   proxy._checkColor(args.value); 
			   
			 },
			
		    }).data("ejColorPicker");
            var model = this._getDialogModel();
            model.width = "auto";
		    model.height="auto";
			model.minWidth="220px";
		    model.htmlAttributes={"class":"e-custom-Dialog"}
            model.title = this._getLocalizedLabels("customFontColor");
            model.target = null;
            model.showRoundedCorner = this.model.showRoundedCorner;
            model.closeIconTooltip = this._getLocalizedLabels("closeIcon");
            this._customColor.ejDialog(model);
	        this._customDialogobj=(this._customColor).ejDialog("instance");
            this._customColor.closest(".e-dialog-wrap").addClass("e-rte");
		    this.colorobj.popupContainer.appendTo(palette);
		    this.colorobj.popupContainer.css({"display":"block","border-style":"none"});
		    $("#"+this._rteId+"_customColorDialog").find("span.e-colorwidget.e-picker").remove();
		    $("#"+this._rteId+"_customColorDialog").prepend(palette);
		    this.colorobj._hidePopup=function () {
              if($("#"+this._rteId+"_customColorDialog").ejDialog("isOpen"))
			     $("#"+this._rteId+"_customColorDialog").ejDialog("close"); 
		    !this.colorobj.model.displayInline && this.colorobj.hide();
		     }
           this._on(this.colorobj._cancelTag, "click", this.colorobj._hidePopup);
            
        },
		
		_openColorpalette:function(e)
		{
		  if(!this._customColor)
				this._createcustomColorpalette();
		  if (e.currentTarget.id == this._rteId + "_customcolor") {
		       this._fontclick=true;
		   if (!ej.isNullOrUndefined(this._splitMenu))
               this._splitMenu.hide(e);
	    } 
		else if (e.currentTarget.id == this._rteId + "_customBGcolor") {
	     	     this._fontclick=false;
		    if (!ej.isNullOrUndefined(this._bgSplitMenu))
                this._bgSplitMenu.hide(e);
		
		}
		     this._customColor.ejDialog("open");

		},
		
		
		_checkColor:function(e)
		{
		  if(this._fontclick)
		  {
		  this._onFontColor(e);
		  this._fontColor=e;
		  }
		  else
		  {
		  this._onBGColor(e);
		  this._bgColor=e;		
		  }
		},
	
		
		
        _createTableClose: function (e) {
            if ((!ej.isNullOrUndefined(this._createTable)) && ((!ej.isNullOrUndefined(e) && $(e.target).parents("#" + this._rteId + "_" + "tables").length <= 0) || ej.isNullOrUndefined(e))) {
                if (!ej.isNullOrUndefined(this._createTable.data("ejDialog"))) {
                    if (ej.isNullOrUndefined(e) || (e.target != this._createTable[0] && $(e.target).parents(".e-rte-table-picker").length <= 0)) {
                        this._createTable.ejDialog("isOpened") && this._createTable.ejDialog("close");
                        this._createTable.find("div.e-rte-eTblProperties").addClass('e-disable');
                    }
                    if (this._createTable.ejDialog("isOpened") && this.model.isResponsive&&(!$(e.target).find("div#" + this._toolBarObj.element[0].id + "_hiddenlist").hasClass("e-inline"))) this._toolBarObj._liTemplte.removeClass("e-display-none");
                    else if (this.model.isResponsive && !ej.isNullOrUndefined(e) && !$(e.target).is($("#" + this._toolBarObj.element[0].id + "_target")) && !($(e.target).closest("div#" + this._toolBarObj.element[0].id + "_hiddenlist").length != 0 || $(e.target).parents().hasClass("e-ddl-popup"))) this._toolBarObj._liTemplte.addClass("e-display-none");
                }
            }
            else
                $(this._createTable.find("div.e-rte-eTblProperties").hasClass('e-disable')).addClass('e-disable');
        },
        _rteinlineClick: function(e){
            if($(e.target).hasClass("e-inlinearrow"))
		       this._setIframeHeight();
        },
        _documentClick: function (e) { 
          if(this.model.toolbarOverflowMode!="inline")
              this._createTableClose(e);
            if (this._isIE() && !window.getSelection) {
                var checkdropdown = e.target.id;
                if (checkdropdown == "")
                    checkdropdown = e.target.parentNode.id;
                if (checkdropdown == (this._rteId + "_fontSizeDDL") || checkdropdown == (this._rteId + "_fontNameDDL") || checkdropdown == (this._rteId + "_formatDDL") || checkdropdown == (this._rteId + "_fontSizeDDL_dropdown") || checkdropdown == (this._rteId + "_fontNameDDL_dropdown") || checkdropdown == (this._rteId + "_formatDDL_dropdown"))
                    this._restoreSelection(this._selectionRange);
            }
        },


        _iframeFocus: function (e) {
            !ej.isNullOrUndefined(this._createTable) && this._createTable.ejDialog("isOpened") && this._createTable.ejDialog("close");
            !$(this._fontSizeDDL).parents("ul.e-rte-fontgroup").length == 0 && !ej.isNullOrUndefined(this._fontSizeDDL) && this._fontSizeDDL.hasClass("e-dropdownlist") && this._fontSizeDDL.ejDropDownList("hidePopup");
            !$(this._fontStyleDDL).parents("ul.e-rte-fontgroup").length == 0 && !ej.isNullOrUndefined(this._fontStyleDDL) && this._fontStyleDDL.hasClass("e-dropdownlist") && this._fontStyleDDL.ejDropDownList("hidePopup");
            !$(this._formatDDL).parents("ul.e-rte-format").length == 0 && !ej.isNullOrUndefined(this._formatDDL) && this._formatDDL.hasClass("e-dropdownlist") && this._formatDDL.ejDropDownList("hidePopup");
            !ej.isNullOrUndefined(this._createTable) && this._createTable.ejDialog("close");
            !ej.isNullOrUndefined(this._splitMenu) && this._splitMenu.hide(e);
            !ej.isNullOrUndefined(this._bgSplitMenu) && this._bgSplitMenu.hide(e);
            !ej.isNullOrUndefined(this._orderSplitObj) && this._orderSplitObj.hide(e);
            !ej.isNullOrUndefined(this._unOrderSplitObj) && this._unOrderSplitObj.hide(e);
        },
        _updateKeyDownSelectStatus: function (_toolEle, commandName) {
            if (!_toolEle.hasClass("e-active"))
                this._toolBarObj.selectItemByID(this._rteId + "_" + commandName);
            else
                this._toolBarObj.deselectItemByID(this._rteId + "_" + commandName);
        },
        _iframeKeyDown: function (e) {
            var _toolEle, ele, _newElement;
            
            if (this.model.showToolbar && this.model.allowKeyboardNavigation && e) {
                if (e.ctrlKey) {
                    e.keyCode == 65 ? this._contolAKeyfalg = true : ej.isNullOrUndefined(this._contolAKeyfalg) ? this._contolAKeyfalg : this._contolAKeyfalg = false;
                    var _proxy = this;
                    switch (e.keyCode) {
                        case 48://Reset zoom
                            e.preventDefault();
                            $(this.getDocument().body).css({ "zoom": 1, "transform": "scale(1)", "transform-origin": "0 0", "-o-transform": "scale(1)", "-o-transform-origin": "0 0", "-webkit-transform": "scale(1)", "-webkit-transform-origin": "0 0" });
                            $(_proxy._toolBarObj.itemsContainer.find(".e-rteItem-zoomIn")).attr("title", _proxy._getLocalizedLabels("zoomIn") + " 100%");
                            $(_proxy._toolBarObj.itemsContainer.find(".e-rteItem-zoomOut")).attr("title", _proxy._getLocalizedLabels("zoomOut") + " 100%");
                            _proxy._zoomValue = 1;
                            return false;
                        case 57:// Zoom in
                            e.preventDefault();
                            this._onKeyZoom("IN");
                            return false;
                        case 173:
                        case 189:// Zoom out
                            e.preventDefault();
                            this._onKeyZoom("OUT");
                            return false;
                        case 80:// Print
                            e.preventDefault();
                            this._onPrint();
                            return false;
                        case 66://B
                            if (!e.shiftKey) {//bold
                                e.preventDefault();
                                _toolEle = this._toolBarItems.find("li.e-rteItem-bold");
                                if (!_toolEle.hasClass("e-disable")) {
                                    this._onBold();
                                    this._updateKeyDownSelectStatus(_toolEle, "bold");
                                    this._onChange();
                                    this._setBackupData()
                                };
                                return false;
                            }
                            break;
                        case 72:
                            if (e.shiftKey) {//sourcecode	view.
                                e.preventDefault();
                                this._getPasteRangeVal();
                                this._sourceCodeManager();
                                return false
                            }
                            break;
                        case 73://I
                            e.preventDefault();
                            if (e.shiftKey)
                                this._imageManager();
                            else {
                                _toolEle = this._toolBarItems.find("li.e-rteItem-italic");
                                if (!_toolEle.hasClass("e-disable")) {
                                    this._onItalics();
                                    this._setBackupData();
                                    this._updateKeyDownSelectStatus(_toolEle, "italic");
                                    this._onChange();
                                }
                            }
                            return false;
                        case 85://U
                            e.preventDefault();
                            if (e.shiftKey)//UpperCase
                                this._onUpperCase();
                            else//Underline
                            {
                                _toolEle = this._toolBarItems.find("li.e-rteItem-underline");
                                if (!_toolEle.hasClass("e-disable")) {
                                    this._onUnderLine();
                                    this._updateKeyDownSelectStatus(_toolEle, "underline");                                    
                                }
                            }
                            this._setBackupData();
                            this._onChange();
                            return false;
                        case 76://L
                            e.preventDefault();
                            if (e.shiftKey)//Lowercase
                                this._onLowerCase();
                            else {
                                if (!this._toolBarItems.find("li.e-rteItem-justifyLeft").hasClass("e-disable")) {
                                    this._onJustifyLeft();
                                    this._alignToolUpdate("justifyLeft");
                                }
                            }
                            this._setBackupData();
                            this._onChange();
                            return false;
                        case 82://R
                            e.preventDefault();
                            if (e.altKey)//Remove table row.
                                this.removeRow();
                            else if (e.shiftKey)//remove formate
                                this._onClearFormat();
                            else {//Jutfy Right.
                                _toolEle = this._toolBarItems.find("li.e-rteItem-justifyRight");
                                if (!_toolEle.hasClass("e-disable")) {
                                    this._onJustifyRight();
                                    this._alignToolUpdate("justifyRight");
                                }
                            }
                            this._setBackupData();
                            this._onChange();
                            return false;
                        case 69://E
                            if (e.shiftKey) {//editable                          
                                e.preventDefault();
                                this._openCustomTable(e);
                                this._setBackupData();
                                this._onChange();
                                return false;
                            }
                            else if (!this._toolBarItems.find("li.e-rteItem-justifyCenter").hasClass("e-disable")) {
                                e.preventDefault();
                                this._onJustifyCenter();
                                this._setBackupData();
                                this._alignToolUpdate("justifyCenter");
                                this._onChange();
                                return false;
                            }
                            break;
                        case 74://J							
                            if (!this._toolBarItems.find("li.e-rteItem-justifyFull").hasClass("e-disable")) {
                                e.preventDefault();
                                this._onJustifyFull();
                                this._alignToolUpdate("justifyFull");
                                this._setBackupData();
                                this._onChange();
                                return false;
                            }
                            break;
                        case 90://Z							
                            if (!this._toolBarItems.find("li.e-rteItem-undo").hasClass("e-disable")) {
                                e.preventDefault();
                                this._onUndo();
                                return false;

                            }
                            break;
                        case 89://Y

                            if (!this._toolBarItems.find("li.e-rteItem-redo").hasClass("e-disable")) {
                                e.preventDefault();
                                this._onRedo();
                                return false;
                            }
                            break;
                        case 67://C							
                            if (e.altKey)//Remove table column
                            {
                                e.preventDefault();
                                this.removeColumn();
                                return false;
                            }
                            else if (e.shiftKey) {//custom Table
                                e.preventDefault();
                                this._getPasteRangeVal();
                                if (this._customTableDialog)
                                    this._renderTableDialog();
                                this._customTableDialog.ejDialog("open");
                                return false;
                            }
                            else if (this._toolBarItems.find("li.e-rteItem-copy").hasClass("e-disable")) {
                                e.preventDefault();
                                this._keypressFlag = false;
                                return false;
                            }
                            break
                        case 88://X
                            if (this._toolBarItems.find("li.e-rteItem-cut").hasClass("e-disable")) {
                                e.preventDefault();
                                this._keypressFlag = false;
                                return false;
                            }
                            this._onChange();
                            break;
                        case 86://V
                            if (this._toolBarItems.find("li.e-rteItem-paste").hasClass("e-disable") || ((this.model.maxLength <= $.trim(this._getText()).length) && (ej.isNullOrUndefined(this._contolAKeyfalg) ? true : this._contolAKeyfalg))) {
                                e.preventDefault();
                                this._keypressFlag = false;
                                return false;
                            }
                            else if (e.shiftKey)//Video insertion.
                            {
                                e.preventDefault();
                                this._keypressFlag = false;
                                this._selectCommand("video");
                                return false;
                            }
                            break;
                        case 77://M
                            e.preventDefault();
                            if (e.shiftKey) {//Outdent.
                                if (!this._toolBarItems.find("li.e-rteItem-outdent").hasClass("e-disable")) {
                                    this._onOutdent();
                                    if (this._indentdepth > 0)
                                        this._indentdepth--;
                                }
                            }
                            else { //Indent.
                                if (!this._toolBarItems.find("li.e-rteItem-indent").hasClass("e-disable")) {
                                    this._onIndent();
                                    this._indentdepth++;
                                }
                            }
                            this._setBackupData();
                            this._onChange();
                            return false;
                        case 75:
                            e.preventDefault();
                            if (e.shiftKey)
                                this._onUnlink();
                            else
                                if (!this._toolBarItems.find("li.e-rteItem-createLink").hasClass("e-disable"))
                                    this._hyperLinkManager(false);
                            return false;

                        case 188://<							
                            if (e.shiftKey) {
                                e.preventDefault();
                                this._changeFontsize(false);
                                this._onChange();
                                return false;
                            }
                            this._setBackupData();
                            this._onChange();
                            break;
                        case 190://>							
                            if (e.shiftKey) {
                                e.preventDefault();
                                this._changeFontsize(true);
                                this._onChange();
                                return false;
                            }
                            this._setBackupData();
                            break;
                        case 61:
                        case 187://+
                            e.preventDefault();
                            (e.shiftKey) ? this._onSuperScript() : this._onSubScript();
                            this._onChange();
                            this._setBackupData();
                            return false;
                        case 79://O							
                            if (e.shiftKey) {
                                e.preventDefault();
                                this.executeCommand('insertorderedlist', "listItem");
                                this._onChange();
                                this._setBackupData();
                                return false;
                            }
                            else if (e.altKey) {
                                e.preventDefault();
                                this.executeCommand('insertunorderedlist', "listItem");
                                this._onChange();
                                this._setBackupData();
                                return false;
                            }
                            break;
                        case 83://S							
                            if (e.shiftKey)//strike the content.
                            {
                                e.preventDefault();
                                this._onStrikeThrough();
                                this._onChange();
                                this._setBackupData();
                                return false;
                            }
                            break;
                        case 70://F							
                            if (e.shiftKey) {
                                e.preventDefault();
                                this._selectCommand("fullScreen");
                                return false;
                            }
                            else if (!e.altKey) {
                                e.preventDefault();
                                if (ej.RTE.FindAndReplace)
                                    this._showFindAndReplace();
                                return false;
                            }
                            break;
                        case 37://left arrow.							
                            if (e.shiftKey && $(this._currentSelNode).closest("table").length) {
                                e.preventDefault();
                                this.insertColumn(true);
                                this._onChange();
                                return false;
                            }
                            break;
                        case 39://right arrow.							
                            if (e.shiftKey  && $(this._currentSelNode).closest("table").length) {
                                e.preventDefault();
                                this.insertColumn(false);
                                this._onChange();
                                return false;
                            }
                            break;
                        case 38://up arrow.
                            if (e.shiftKey && $(this._currentSelNode).closest("table").length) {
                                e.preventDefault();
                                this.insertRow(true);
                                this._onChange();
                                return false;
                            }
                            break;
                        case 40://downarrow							
                            if (e.shiftKey && $(this._currentSelNode).closest("table").length) {
                                e.preventDefault();
                                this.insertRow(false);
                                this._onChange();
                                return false;
                            }
                            break;
                        case 65://A
                            if (e.altKey) {
                                e.preventDefault();
                                this.removeTable();
                                return false;
                            };
                            break
                        case 121://F10
                            e.preventDefault();
                            this._clearAllManager();
                            return false;
                        case 84://T
                            if (e.altKey && this._toolBarItems) { // Alt+ Ctrl + T.
                                this._toolBarItems.focus();
                                break;
                            }
                    }
                }
                else if ((e.keyCode == 9 ) && !(this._isIE8() ? this._currentSelNode.nodeName.toLowerCase() == "td" : this._getSelectedNode().nodeName.toLowerCase() == "td")) {
                    this._keypressFlag = true;
                    this.executeCommand('inserthtml', "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;", true);
                    return false;
                }
                else if (e.keyCode == 8) {//Backspace for removing the indent.
                    ele = this._getSelectedNode();
                    if ($(ele).find("span#RTE_imgDupDiv").length > 0)
                        $(this._imgDupDiv).remove();
                    if ($(ele).parents("BLOCKQUOTE").length > 0) {
                        this._onOutdent();
                        e.preventDefault();
                    }
                }
            }
            else if (e.ctrlKey == true && (e.keyCode == 66 || e.keyCode == 73 || e.keyCode == 85 || e.keyCode == 76 || e.keyCode == 82 || e.keyCode == 69 || e.keyCode == 74 || e.keyCode == 90 || e.keyCode == 89 || e.keyCode == 67 || e.keyCode == 88 || e.keyCode == 86 || e.keyCode == 8 || e.keyCode == 46) && !this.model.allowKeyboardNavigation)
                e.preventDefault();
            if (this.model.maxLength != null && (ej.isNullOrUndefined(this._contolAKeyfalg) ? true : !this._contolAKeyfalg)) {
                try {
                    if (this._isIE8() && e.keyCode == 86 && !((this.model.maxLength) >= (window.clipboardData.getData("Text").length + $.trim(this._getText()).length)))
                        e.preventDefault();
                    else
                        this._validateMaxLength(e);
                }
                catch (error) { }
            }
            if (this._isIE8() ? (this._currentSelNode && this._currentSelNode.nodeName.toLowerCase() == "td") : this._getSelectedNode().nodeName.toLowerCase() == "td") {
                ele = this._isIE8() ? this._currentSelNode : this._getSelectedNode();
               var _newElementIndex = $(ele).parent().children().index($(ele));
                if (e.keyCode == 9 && !e.shiftKey) {
                    _newElement = (!ej.isNullOrUndefined(ele.nextSibling)) ? ele.nextSibling : (!ej.isNullOrUndefined($(ele).parents("tr")[0].nextSibling) ? $(ele).parents("tr")[0].nextSibling.childNodes[0] : (!ej.isNullOrUndefined($(ele).parents("table")[0].nextSibling)) ? ($(ele).parents("table")[0].nextSibling.nodeName.toLowerCase() == "td") ? $(ele).parents("table")[0].nextSibling : ele : ele);
                    this._setTableSelection(_newElement, e);
                }
                if (e.keyCode == 9 && e.shiftKey) {
                    _newElement = (!ej.isNullOrUndefined(ele.previousSibling)) ? ele.previousSibling : (!ej.isNullOrUndefined($(ele).parents("tr")[0].previousSibling) ? $(ele).parents("tr")[0].previousSibling.childNodes[$(ele).parents("tr")[0].previousSibling.childNodes.length - 1] : (!ej.isNullOrUndefined($(ele).parents("table")[0].previousSibling)) ? ($(ele).parents("table")[0].previousSibling.nodeName.toLowerCase() == "td") ? $(ele).parents("table")[0].previousSibling : ele : ele);
                    this._setTableSelection(_newElement, e);
                }
                else if (e.keyCode == 40)
                    _newElement = (!ej.isNullOrUndefined($(ele).parents("tr")[0].nextSibling)) ? $(ele).parents("tr")[0].nextSibling.children[_newElementIndex] : ((!ej.isNullOrUndefined($(ele).parents("table")[0].nextSibling) && !this._isIE8()) ? $(ele).parents("table")[0].nextSibling : ele);
                else if (e.keyCode == 38)
                    _newElement = (!ej.isNullOrUndefined($(ele).parents("tr")[0].previousSibling)) ? $(ele).parents("tr")[0].previousSibling.children[_newElementIndex] : ((!ej.isNullOrUndefined($(ele).parents("table")[0].previousSibling)) && !this._isIE8() ? $(ele).parents("table")[0].previousSibling : ele);
                if (e.keyCode == 9 && ele == _newElement && !ej.isNullOrUndefined($(ele).parents("tr")[0])) {
                    this.insertRow(false);
                    this._setRange(this._isIE8() ? $(this._getRange().parentElement()).parents("tr").next().children().first()[0] : $(this._getRange().startContainer).parents("tr").next().children().first()[0], this._getRange(), true);
                    e.preventDefault();
                }
                else if ((e.keyCode == 9 && this._isIE8()) || e.keyCode == 40 || e.keyCode == 38) {
                    this._setRange(_newElement, this._getRange(), true);
                    e.preventDefault();
                }
                if (this._isIE8())
                    this._getRange().parentElement && (this._currentSelNode = this._getRange().parentElement());
            }
            if ($(e.target).parents("table").length == 0) $(this._getDocument()).find(".e-rte-tablebox").remove();
            this._setAutoHeight();
            if((e.keyCode==46||e.keyCode==8) && (this._getDocument().body.innerHTML.trim() === '<p><br></p>')){
                e.preventDefault();
            }
            this._trigger("keydown", { keyCode: e.keyCode });
        },
        _changeFontsize: function (status) {
            var fontSize = parseInt(this._getCommandValue('fontsize')) ? parseInt(this._getCommandValue('fontsize')) : 2;
            if ((!status && fontSize > this.model.fontSize[0].value) || (status && fontSize < this.model.fontSize[this.model.fontSize.length - 1].value)) {
                this._onFontSize(status ? fontSize + 1 : fontSize - 1);
                this._updateFontOptionStatus();
            }
        },
        _iframeKeypress: function (e) {
            if (!this._keypressFlag) {
                e.preventDefault();
                this._keypressFlag = true;
                return false;
            }
        },
        _setTableSelection: function (_newElement, e) {
            if (!this._isIE8() && !((_newElement.childNodes.length == 1 && _newElement.childNodes[0].nodeName == "BR") || (_newElement.childNodes.length == 0))) {
                var range = this._getDocument().createRange();
                range.selectNodeContents(_newElement);
                this.selectRange(range);
            }
            else this._setRange(_newElement, this._getRange(), true);
            e.preventDefault();
        },
        _setAutoHeightValue: function (selectedtext) {
            if (selectedtext.nodeName == "#text") {
                if (selectedtext.parentNode.nodeName == "BODY") {
                    $(selectedtext).wrap("<div></div>");
                    this.selectRange(this._getRange());
                }
               var range = $(selectedtext.parentNode).position().top + parseInt($(selectedtext.parentNode).css("height"));
            }
            if (selectedtext.nodeName == "DIV")
                range = $(selectedtext).position().top + parseInt($(selectedtext).css("height"));
            return range;
        },
        _setAutoHeight: function () {
            if (this.model.autoHeight)
                this._autoHeight();
            else if (!ej.isNullOrUndefined(this._getDocument())) $(this._getDocument().body).css("overflow", "");
        },
        _autoHeight: function () {
			var toolbarHeight = this._toolBarItems?this._toolBarItems.outerHeight():0;
            if (!ej.isNullOrUndefined(this._getDocument().body)) {
                $(this._getDocument().body).css("overflow", "hidden");
                var iframeTop = (!ej.isNullOrUndefined(this._getDocument().body.lastChild)) ? this._getDocument().body.lastChild.clientHeight + this._getDocument().body.lastChild.offsetTop : 0;
                if ((parseInt($(this._rteWapper[0]).css("min-height")) - toolbarHeight) <= iframeTop)
                    $(this._rteIframe[0]).css("height", (iframeTop + 30) + "px");
                else
                    $(this._rteIframe[0]).css("height", (parseInt($(this._rteWapper[0]).css("min-height")) - toolbarHeight) + "px");
                var range = 0;
                range = (window.getSelection && !ej.isNullOrUndefined(this._getRange().startContainer)) ? this._setAutoHeightValue(this._getRange().startContainer) : (((this._getDocument().selection) && !ej.isNullOrUndefined(this._ieParents(this._getRange())[0])) ? this._setAutoHeightValue(this._ieParents(this._getRange())[0]) : 0);
                if (range >= (this._rteIframe.height() - 30)) {
                    if (this._rteIframe[0].contentDocument)
                        $(this._rteIframe[0]).css("height", (this._rteIframe[0].contentDocument.documentElement.scrollHeight + 20) + "px");
                    else
                        $(this._rteIframe[0]).css("height", (this._rteIframe[0].contentWindow.document.body.scrollHeight + 20) + "px");
                }
                this._rteWapper.outerHeight(this._rteEditor.outerHeight() + toolbarHeight + parseInt(this.model.showFooter ? 19 : 0));
            }
        },
        _ieSelRange: function () {
            if (this._isIE()) {
                this._selectionRange = "";
                this._ieSelectionRange = this._getRange();
                this._seleText = ej.isNullOrUndefined(this._getWindow().document.selection) ? this._selectionRange.toString() : this._getWindow().document.selection.createRange().text;
            }
            else
                this._ieSelectionRange = this._ieSelection;
        },
        _iframeSelectionChange: function (e) {
            this._trigger("select", { event: e, model: this.model });
        },
        _ignorekeyArray: [13, 32, 8, 46],
        _iframeKeyUp: function (e) {
            //if (!(e.which >= 37 && e.which <= 40))
            //    this._updateValue();
            $(this._imgDupDiv).remove();
            $(this._imgOrg).css("outline", "");
            if(this._getSelectedNode().parentNode.localName == "td" || this._getSelectedNode().parentNode.localName == "tr")this._toggleEditTable();
            if ($.inArray(e.which, this._ignorekeyArray) != -1)
                this._setBackupData();
            if (e.ctrlKey && (e.keyCode == 57 || e.keyCode == 189))
                this._zoomUp();
                if(e.keyCode == 37 ||e.keyCode == 39 || e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 36 || e.keyCode == 35 || e.keyCode==9){               // top, left, right, left, home and end key code
            this._updateToolbarStatus();
            this._updateFontOptionStatus();
            this._updateFormat();
                }
            if(this.model.showFooter && (this.model.showWordCount||this.model.showCharCount))this._updateCount();
            var selectEle = this._isIE8() ? this._currentSelNode : this._getSelectedNode();
            if (this.model.showToolbar)
                this._isIE8() ? selectEle.nodeName.toLowerCase() : selectEle.nodeName.toLowerCase() != "a" ? this.disableToolbarItem("removeLink") : this.enableToolbarItem("removeLink");
            this._updateTagInfo(selectEle);            
            this._ieSelRange();
            this._trigger("keyup", { keyCode: e.keyCode });
            this._iframeSelectionChange(e);
            if (e.ctrlKey)
                switch (e.keyCode) {
                    case 88://X
                    case 86://V
                        this._onChange();
                        break;
                }
			if((e.keyCode==46||e.keyCode==8) && (this._getDocument().body.innerHTML==''||this._getDocument().body.innerHTML=="<br>"))
			 this._emptyContent();
			
        },
        _iframeMouseUp: function (e) {
            this._tableResizeUp(e);
			this._zoomUp(e);
            this._resizeBtnInit();
            if (!ej.isNullOrUndefined(this._imgDup) && $(this._imgOrg).parents("body").length > 0) {
                $(this._imgOrg).css({ "width": this._imgDup[0].style.width, "height": this._imgDup[0].style.height });
                $(this._imgOrg).position({ left: $(this._imgDup).position().left, top: $(this._imgDup).position().top });
                $(this._imgDup).css("display", "none");
                this._resizeImgPos();
                this._setAutoHeight();
            }
            if (e.target.nodeName != "IMG" && !$(e.target).hasClass("e-rte-imageboxmark")) {
                $(this._imgOrg).css("outline", "");
                $(this._imgDupDiv).remove();
                this._off($(this._getDocument()), "mousemove", this._imgBoxMouseMove);
            }
            if (e.target.nodeName == "IMG" && $(e.target).parents("body").length > 0) {
                var range = (this._isIE8()) ? this._getDocument().body.createTextRange() : this._getDocument().createRange();
                (this._isIE8()) ? range.moveToElementText(e.target) : range.selectNode(e.target);
                this.selectRange(range);
            }
            this._currentSelNode = e.target; //For IE
            if (e.currentTarget && e.target.nodeName && e.target.nodeName.toLowerCase() == "html" && this._getDocument() && this._getDocument().body && (this._isIE8() ? true : this._getRange().startOffset == this._getRange().endOffset)) {
                this._isIE() && e.currentTarget.createRange && this._setRange(this._isIE8() ? this._getDocument().body : this._getRange().startContainer, e.currentTarget.createRange(), true);
                if( this._clientX < e.target.offsetWidth) 
					this._getDocument().body.focus();
            }
            this._toggleEditTable();
            this._updateToolbarStatus();
            var isRightClick;
            if (e.button) isRightClick = (e.button == 2);
            else if (e.which) isRightClick = (e.which == 3);
            if (!isRightClick) {
                this._updateFormat();
                this._updateFontOptionStatus();
            }
            this._ieSelRange();
            this._iframeSelectionChange(e);
            if (this._fontStyleDDL && !ej.isNullOrUndefined(this._fontStyleDDL.data("ejDropDownList")) && this._fontStyleDDL.ejDropDownList("instance")._isPopupShown()) $(this._fontStyleDDL.ejDropDownList("instance").popupList.ejScroller("instance").element).trigger("mouseup");
            if (this._fontSizeDDL && !ej.isNullOrUndefined(this._fontSizeDDL.data("ejDropDownList")) && this._fontSizeDDL.ejDropDownList("instance")._isPopupShown()) $(this._fontSizeDDL.ejDropDownList("instance").popupList.ejScroller("instance").element).trigger("mouseup");

        },
        _iframeMouseDown: function (e) {
            if (ej.browserInfo().name === "mozilla") this._getDocument().designMode = "off";
            if (ej.browserInfo().name == "msie" && ej.browserInfo().version == "8.0")
                this._focus();
            this._contolAKeyfalg = false;
            this._updateTagInfo(e.target);
            this._updateIndent(e.target);
            if (this.model.showToolbar)
                e.target.nodeName != "A" ? this.disableToolbarItem("removeLink") : this.enableToolbarItem("removeLink");
            if (e.target.nodeName == "VIDEO" && this.model.allowEditing) this._preventDefaultResize();
            if (e.target.nodeName == "IMG" && this.model.allowEditing) {
                this._preventDefaultResize();
                this._imageClick(e.target);
            }
            if ($(e.target).hasClass("e-rte-imageboxmark")) {
                this._resizeBtnInit();
                this._commonBoxDown = true;
                if ($(e.target).hasClass("e-rte-rigmed")) this._rigMidBox = true;
                if ($(e.target).hasClass("e-rte-toplef")) this._topLefBox = true;
                if ($(e.target).hasClass("e-rte-topmed")) this._topMidBox = true;
                if ($(e.target).hasClass("e-rte-toprig")) this._topRigBox = true;
                if ($(e.target).hasClass("e-rte-lefmed")) this._lefMidBox = true;
                if ($(e.target).hasClass("e-rte-botlef")) this._botLefBox = true;
                if ($(e.target).hasClass("e-rte-botmid")) this._botMidBox = true;
                if ($(e.target).hasClass("e-rte-botrig")) this._botRigBox = true;
                return false;
            }
            if ($(e.target).hasClass("e-rteColumnResizer")) {
                this._lastCol = $(e.target).hasClass("e-rtelastcol") ? true : false;
                this._columnEle = $(this._curTable).find("tr:first td").eq(parseInt($(e.target).attr("data-col")))[0];
                this._columnDown = true;
                this._columnIndex = this._columnEle.cellIndex;
                $(this._getDocument().body).after("<span class='colresizerline'style='cursor:col-resize;position:absolute;width:0px;border-left: 1px dashed #787878;height:" + $(this._columnEle).closest("table").height() + "px;left:" + e.pageX + "px;top:" + $(this._columnEle).offset().top + "px;'></span>");
            }
            if ($(e.target).hasClass("e-rteRowResizer")) {
                this._rowEle = $(this._curTable).find("tr").eq(parseInt($(e.target).attr("data-row")))[0];
                this._rowDown = true;
            }
            if ($(e.target).hasClass("e-rte-tablebox")) {
                this._boxDown = true;
                this._boxElement = this._curTable;
            }
            if ($(e.target).hasClass("e-rte-tablebox") || $(e.target).hasClass("e-rteRowResizer") || $(e.target).hasClass("e-rteColumnResizer"))
                this._on($(this._getDocument()), "mousemove", this._imgBoxMouseMove);
            if ((ej.browserInfo().name == "msie" || ej.browserInfo().name == "chrome") && (e.ctrlKey == true && e.which == 1)) {
                if (e.target.tagName.toUpperCase() == 'A' && !ej.isNullOrUndefined($(e.target).attr('href')))
                    window.open($(e.target).attr('href'), "_blank");
            }
            if (this.model.isResponsive && !ej.isNullOrUndefined(this._toolBarObj) && this._toolBarObj._liTemplte.children('ul').length > 0&&(!$(this._toolBarObj._liTemplte).hasClass("e-inline"))) {
                this._toolBarObj.contstatus = true;
                this._toolBarObj._liTemplte.addClass("e-display-none");
                this._toolBarObj.contstatus = false;
            }
			this._clientX = e.clientX;
            this._iframeFocus();
            this._onChange();
        },
        _iframeFocusOut: function (e) {
            if (e.data) {
                e.data._proxy._onChange();
                e.data._proxy._selectionRange = e.data._proxy._isIE8() ? e.data._proxy._getRange() : e.data._proxy._saveSelection();
                e.data._proxy._seleText = ej.isNullOrUndefined(e.data._proxy._getWindow().document.selection) ? e.data._proxy._selectionRange.toString() : !e.data._proxy._isIE8() ? e.data._proxy._getWindow().getSelection().toString() : e.data._proxy._getWindow().document.selection.createRange().text;
            }
        },
        _widthFocusOut: function (e) {
            var dialog, drpdwnId, widthId;
            if (this._customTableDialog.ejDialog("isOpen")) {
                dialog = this._customTableDialog;
                drpdwnId = "#" + this._rteId + "_ddlAlignment";
                widthId = "#" + this._rteId + "_txtWidth";
            }
            else {
                dialog = this._eTblDialog;
                drpdwnId = "#" + this._rteId + "_eTblAlign";
                widthId = "#" + this._rteId + "_eTblWidth";
            }
            var val = dialog.find(widthId).val();
            var obj = $(drpdwnId).data('ejDropDownList');
            var option = (val && val != '' && !isNaN(val) || (val.slice(-2) == 'px') || (val.slice(-2) == 'em') || (val.slice(-2) == 'pt') || (val.slice(-1) == '%')) ? true : false;
            obj.option('enabled', option);
        },
        _windowResize: function (e) {
            this._setAutoHeight();
            this._setIframeHeight();
			this._updateCount();
        },
        _tableResizeUp: function (e) {
            if ($(this._getDocument()).find("table.e-rte-table").length && (this._columnDown || this._rowDown || this._boxDown)) {
                if (this._currentTable && this._columnDown && this._columnDownClick) {
                    if (!this._lastCol) {
                        this._currentTable.eq(this._columnIndex - 1).width(this.nexColIndexWid);
                        this._currentTable.eq(this._columnIndex).width(this._columnIndexWid);
                    }
                    else {
                        this._currentTable.closest("table").find("tr:first td").each(function () {
                            if (this.style.width == "") $(this).width(parseInt($(this).closest("table").width() / ($(this).siblings().length + 1)));
                        });
                        this._currentTable.eq(this._columnIndex).width(this.lasColIndexWid);
                        this._currentTable.closest("table").css({ "width": "" });
                        $(this._getDocument()).find(".e-rte-tablebox").css({ "left": (this._currentTable.eq(this._columnIndex).offset().left + this._currentTable.eq(this._columnIndex).outerWidth()) + "px" });
                    }
                }
                this._removeResizeObject();
                $(this._getDocument()).find(".colresizerline").remove();
                $(this._getDocument()).find(".e-rte-tablebox").css("display", "none");
                this._restoreSelection(this._tableSelection);
                this._columnDown = false;
                this._rowDown = false;
                this._boxDown = false;
                this._columnDownClick = false;
            }
            else {
                $(this._getDocument()).find(".e-rte-tablebox").remove();
                this._tableSelection = this._getRange();
            }
        },
        _resizeBtnInit: function () {
            this._commonBoxDown = false;
            this._rigMidBox = false;
            this._topLefBox = false;
            this._topMidBox = false;
            this._topRigBox = false;
            this._lefMidBox = false;
            this._botLefBox = false;
            this._botMidBox = false;
            this._botRigBox = false;
        },
        _imgSpanBox: function (e) {
            this._resizeBtnInit();
            this._imgOrg = e;
            this._imgDupDiv = ej.buildTag("span#RTE_imgDupDiv");
            this._imgDup = ej.buildTag("img#RTE_imgdivspan", "", { "display": "none", "position": "absolute", "background-size": "100% 100%", "outline": "1px dashed #000", "opacity": ".64" }, {}).appendTo(this._imgDupDiv);
            this._topLef = ej.buildTag("span.e-rte-imageboxmark e-rte-toplef#RTE_toplef", "", { "cursor": "nwse-resize" }, {}).appendTo(this._imgDupDiv);
            this._topMid = ej.buildTag("span.e-rte-imageboxmark e-rte-topmed#RTE_topmed", "", { "cursor": "ns-resize" }, {}).appendTo(this._imgDupDiv);
            this._topRig = ej.buildTag("span.e-rte-imageboxmark e-rte-toprig#RTE_toprig", "", { "cursor": "nesw-resize" }, {}).appendTo(this._imgDupDiv);
            this._leftMid = ej.buildTag("span.e-rte-imageboxmark e-rte-lefmed#RTE_lefmed", "", { "cursor": "ew-resize" }, {}).appendTo(this._imgDupDiv);
            this._rigMid = ej.buildTag("span.e-rte-imageboxmark e-rte-rigmed#RTE_rigmed", "", { "cursor": "ew-resize" }, {}).appendTo(this._imgDupDiv);
            this._botLef = ej.buildTag("span.e-rte-imageboxmark e-rte-botlef#RTE_botlef", "", { "cursor": "nesw-resize" }, {}).appendTo(this._imgDupDiv);
            this._botMid = ej.buildTag("span.e-rte-imageboxmark e-rte-botmid#RTE_botmid", "", { "cursor": "ns-resize" }, {}).appendTo(this._imgDupDiv);
            this._botRig = ej.buildTag("span.e-rte-imageboxmark e-rte-botrig#RTE_botrig", "", { "cursor": "nwse-resize" }, {}).appendTo(this._imgDupDiv);
            this._resizeImgPos();
            this._resizeImgDupPos();
            $(this._getDocument().body).after(this._imgDupDiv);
            $(e).css({ "outline": "1px dashed #5C5C5C" });
            this._on($(this._getDocument()), "mousemove", this._imgBoxMouseMove);

        },
        _resizeImgPos: function () {
            this._ltPos = $(this._imgOrg).position();
            this._imgWid = $(this._imgOrg).css("width");
            this._imgHgt = $(this._imgOrg).css("height");
            this._imgDup.css({ "width": this._imgWid, "height": this._imgHgt, "left": this._ltPos.left + "px", "top": this._ltPos.top + "px", "border": $(this._imgOrg).css("border") });
            this._imgDup.attr({ "src": $(this._imgOrg).attr("src") });
            var _wid = (parseInt($(this._imgOrg).css("width")) - 2) + this._ltPos.left;
            var _midWid = ((parseInt($(this._imgOrg).css("width")) - 2) / 2) + this._ltPos.left;
            var _hgt = (parseInt($(this._imgOrg).css("height")) - 2) + this._ltPos.top;
            var _midHgt = ((parseInt($(this._imgOrg).css("height")) - 2) / 2) + this._ltPos.top;
            var _imgborder = parseInt($(this._imgOrg).css("border-width") == "" ? 0 : $(this._imgOrg).css("border-width"));
            $(this._rigMid).css({ "left": (_wid + (2 * _imgborder)) + "px", "top": (_midHgt) + "px" });
            $(this._botLef).css({ "left": (this._ltPos.left - 3) + "px", "top": (_hgt + (2 * _imgborder)) + "px" });
            $(this._botRig).css({ "left": (_wid + (2 * _imgborder)) + "px", "top": (_hgt + (2 * _imgborder)) + "px" });
            $(this._botMid).css({ "left": (_midWid) + "px", "top": (_hgt + (2 * _imgborder)) + "px" });
            $(this._topRig).css({ "left": (_wid + (2 * _imgborder)) + "px", "top": (this._ltPos.top - 3) + "px" });
            $(this._topLef).css({ "left": (this._ltPos.left - 3) + "px", "top": (this._ltPos.top - 3) + "px" });
            $(this._topMid).css({ "left": (_midWid) + "px", "top": (this._ltPos.top - 3) + "px" });
            $(this._leftMid).css({ "left": (this._ltPos.left - 3) + "px", "top": (_midHgt) + "px" });

        },
        _resizeImgDupPos: function () {
            this._ltDupPos = $(this._imgOrg).position();
            this._imgMidWid = $(this._imgOrg).css("width");
            this._imgDupHgt = $(this._imgOrg).css("height");
        },
        _imgBoxMouseMove: function (e) {
            if (this._commonBoxDown) {
                if (this._rigMidBox)
                    this._imgDupMouseMove(parseInt(e.pageX) - this._ltDupPos.left + "px", this._imgDupHgt, e);
                else if (this._lefMidBox) {
                    this._imgDupMouseMove(((parseInt(this._imgMidWid) + this._ltDupPos.left) - e.pageX) + "px", this._imgDupHgt, e);
                    $(this._imgDup).offset({ left: e.pageX });
                }
                else if (this._topMidBox) {
                    this._imgDupMouseMove(this._img_wid, ((parseInt(this._imgDupHgt) + this._ltDupPos.top) - e.pageY) + "px", e);
                    $(this._imgDup).offset({ top: e.pageY });
                }
                else if (this._botMidBox)
                    this._imgDupMouseMove(this._img_wid, (e.pageY - this._ltDupPos.top) + "px", e);
                else if (this._botRigBox)
                    this._imgDupMouseMove((e.pageX - this._ltDupPos.left) + "px", (e.pageY - this._ltDupPos.top) + "px", e);
                else if (this._botLefBox) {
                    this._imgDupMouseMove(((parseInt(this._imgMidWid) + this._ltDupPos.left) - e.pageX) + "px", (e.pageY - this._ltDupPos.top) + "px", e);
                    $(this._imgDup).offset({ left: e.pageX });
                }
                else if (this._topRigBox) {
                    this._imgDupMouseMove((e.pageX - this._ltDupPos.left) + "px", ((parseInt(this._imgDupHgt) + this._ltDupPos.top) - e.pageY) + "px", e);
                    $(this._imgDup).offset({ top: e.pageY });
                }
                else if (this._topLefBox) {
                    this._imgDupMouseMove(((parseInt(this._imgMidWid) + this._ltDupPos.left) - e.pageX) + "px", ((parseInt(this._imgDupHgt) + this._ltDupPos.top) - e.pageY) + "px", e);
                    $(this._imgDup).offset({ top: e.pageY, left: e.pageX });
                }
            }
            else if (this._columnDown) {
                this._columnDownClick = true;
                this._currentTable = $(this._columnEle).closest("table").find("tr:first td");
                var prevcolwid = (this._columnEle.style.width == "") ? $(this._columnEle).width() : parseInt(this._columnEle.style.width);
                var _columnEleLeft = $(this._columnEle).offset().left, actualwid = (_columnEleLeft > e.pageX) ? prevcolwid + (_columnEleLeft - e.pageX) : prevcolwid - (e.pageX - _columnEleLeft);
                var nexnodeWid = ($(this._currentTable).eq(this._columnIndex - 1)[0].style.width == "") ? $($(this._currentTable).eq(this._columnIndex - 1)).width() : parseInt($(this._currentTable).eq(this._columnIndex - 1)[0].style.width), totalwid = prevcolwid + nexnodeWid;
                if (!this._lastCol && actualwid > 15 && totalwid - actualwid > 15) {
                    this.nexColIndexWid = totalwid - actualwid;
                    this._columnIndexWid = actualwid;
                    $(this._getDocument()).find(".colresizerline").css({ "left": e.pageX + "px" });
                }
                else if (this._lastCol && _columnEleLeft < e.pageX && e.pageX - _columnEleLeft > 15) {
                    this.lasColIndexWid = e.pageX - _columnEleLeft;
                    $(this._getDocument()).find(".colresizerline").css({ "left": e.pageX + "px" });
                }
                this._removeMouseSelection(e);
                $(this._columnEle).closest("table").find("tr:last td:last span.e-rte-tablebox").css({ "display": "none" });
            }
            else if (this._rowDown) {
                if (ej.browserInfo().name === "chrome" || ej.browserInfo().name === "mozilla") this._getDocument().getSelection().removeAllRanges();
                var _rowOffset = this._rowEle.offsetTop, _rowParentTop = this._rowEle.parentElement.parentElement.offsetTop;
                if ((e.pageY - (_rowOffset + _rowParentTop)) > 20)
                    this._rowEle.style.height = (e.pageY - (_rowOffset + _rowParentTop)) + "px";
                this._removeMouseSelection(e);
                $(this._getDocument()).find(".e-rte-tablebox").css({ "left": ($(this._rowEle).closest("table").width() + $(this._rowEle).closest("table").offset().left) + "px", "top": ($(this._rowEle).closest("table").height() + $(this._rowEle).closest("table").offset().top) + "px" });
            }
            else if (this._boxDown) {
                var boxEle = $(this._boxElement),boxParent = boxEle.parent(),boxPosition = boxEle.offset(), _width = (((e.pageX - boxPosition.left) / boxParent.width()) * 100), _height = (((e.pageY - boxPosition.top) / boxParent.height()) * 100);		
                if (ej.browserInfo().name === "chrome" || ej.browserInfo().name === "mozilla") this._getDocument().getSelection().removeAllRanges();
                if(e.pageX > 0 && _width > 10 && _height > 0) {
                boxEle.attr({ "width": ( _width + "%"), "height": (_height + "%") });               
                $(this._getDocument()).find(".e-rte-tablebox").css({ "left": (boxEle.width() + boxPosition.left) + "px", "top": (boxEle.height() + boxPosition.top) + "px" });
                boxEle.find("tr:first td").each(function () {
                    var tdEle = $(this);
                    tdEle.width(parseInt(tdEle.closest("table").width() / (tdEle.siblings().length + 1))); });
                
                }
                this._removeMouseSelection(e);
            }

        },
        _removeMouseSelection: function (e) {
            if (ej.browserInfo().name === "mozilla") this._getDocument().getSelection().removeAllRanges();
            if (e.stopPropagation) e.stopPropagation();
            if (e.preventDefault) e.preventDefault();
            e.cancelBubble = true;
            e.returnValue = false;
            return false;
        },
        _imgDupMouseMove: function (width, height, e) {
            $(this._imgDup).css({ "display": "block", "width": width, "height": height });
            this._resizeImgDupPos();
            if (this._isIE8()) this._removeMouseSelection(e);
        },
        _imageClick: function (e) {
            $(this._getDocument().body).find("img").css("outline", "");
            if (this._imgDupDiv)
                this._imgDupDiv.remove();
            this._imgSpanBox(e);
        },
        _iframePaste: function (e) {
            var _proxy = this,temp=ej;
			if(e){
				try {
					var val = ej.isNullOrUndefined(window.clipboardData) ? e.originalEvent.clipboardData.getData("text/plain") : window.clipboardData.getData("Text");
					if (val.length != 0) {
						if (!((_proxy.model.maxLength) >= (val.length + $.trim(_proxy._getText()).length)))
							e.preventDefault();
					}
					else {
						var blob = e.originalEvent.clipboardData.items[0].getAsFile();
						var reader = new FileReader();
						if (ej.browserInfo().name != "mozilla") {
							reader.onload = function (event) {
								_proxy.executeCommand('inserthtml', "<img src=" + event.target.result + " alt />");
							};
						}
						reader.readAsDataURL(blob);
					}
				}
				catch (error) { }
			}
            setTimeout(function () {
				_proxy._setBackupData();
				_proxy._onChange();
                _proxy._setAutoHeight();
                _proxy._updateCount();
                _proxy._pasteTableResize();
				
			if (temp.browserInfo().name == "webkit")
                _proxy._getWindow().focus();
            else
                _proxy._getWindow().document.body.focus();
            }, 0);
        },
        _pasteTableResize: function () {
            var tableCollection = $(this._getDocument()).find("table").not(".e-rte-table"), tableElement;
            for (var tableItem = 0; tableItem < tableCollection.length; tableItem++) {
                tableElement = $(tableCollection[tableItem]);
                tableElement.addClass("e-rte-table").removeAttr("style cellspacing").attr({ "border": 1, "cellspacing": 1, "width": tableElement.width() }).css({ "border": "1px solid#5C5C5C", "border-collapse": "separate", "border-spacing": "2px" });
                tableElement.find("table tr,td").removeAttr("style width");
                this._on(tableElement, "mouseover", this._tableMouseOver);
            }
        },
        _wireEvents: function () {
            var _iframe = $(this._getDocument());
            if (this._getDocument() != "") {
                if (!ej.isNullOrUndefined(this._createTable)) {
                    this._on(this._createTable, "mouseenter", "div.e-rte-tablecell", this._tableCellStart)
                    ._on(this._createTable, "mousemove", "div.e-rte-tablecell", this._tableCellSelect)
                    ._on(this._createTable, "mouseleave", "div.e-rte-table", this._tableCellLeave)
                    ._on(this._createTable, "mousedown", "div.e-rte-tablecell", this._tableCellDown)
                    ._on($(document), "click", this._documentClick);
                }
                this._on(_iframe, "focus", this._iframeFocus)
                ._on(_iframe, "keydown", this._iframeKeyDown)
                ._on(_iframe, "keypress", this._iframeKeypress)
                ._on(_iframe, "keyup", this._iframeKeyUp)
                ._on(_iframe, "mouseup", this._iframeMouseUp)
                ._on(_iframe, "mousedown", this._iframeMouseDown)                
                ._on($(window), "resize", this._windowResize);				
                if (this._isIE8() || !(this.model.pasteCleanupSettings && (this.model.pasteCleanupSettings.cleanElements || this.model.pasteCleanupSettings.removeStyles || this.model.pasteCleanupSettings.cleanCSS || this.model.pasteCleanupSettings.listConversion)))
					this._on(_iframe, "paste", this._iframePaste);
					
                if (!ej.isNullOrUndefined((document.getElementById(this._id + "_Iframe"))))
                    $(document.getElementById(this._id + "_Iframe").contentWindow).on('blur', { _proxy: this }, this._iframeFocusOut);
            }
        },

        _unwireEvents: function () {
            var _iframe = $(this._getDocument());
            if (!ej.isNullOrUndefined(this._createTable)) {
                this._off(this._createTable, "mousemove", "div.e-rte-tablecell")
                ._off(this._createTable, "mouseleave", "div.e-rte-table")
                ._off(this._createTable, "mousedown", "div.e-rte-tablecell")
                ._off($(document), "click", this._documentClick);
            }
            this._off(_iframe, "focus")
            ._off(_iframe, "keydown")
            ._off(_iframe, "keyup")
            ._off(_iframe, "mouseup")
            ._off(_iframe, "mousedown")
            ._off($(window), "resize", this._windowResize);
            $(document.getElementById(this._id + "_Iframe").contentWindow).off('blur', this._iframeFocusOut);
            if (!ej.isNullOrUndefined(this._customTableDialog))
                this._off(this._customTableDialog.find(".e-rte-txtWidth"), "focusout");

        },

        _footerEvents: function (val) {
            this[val](this._htmlSource, "click", this._sourceCodeManager);
            this[val](this._clearFormat, "click", this._onClearFormat);
            this[val](this._clearAll, "click", this._clearAllManager);
        },


        _onChange: function () {
           var _prevhtml = $.trim(this.value());
            if (this.model.enableXHTML) {
                this._updateXhtml();
                if (this.model.enableHtmlEncode)
                    this.value(this._encode(this._removeNoSpaceChar(this.value())));
            }
            if (_prevhtml !== this._removeNoSpaceChar(this.getHtml())) {
                this._updateValue();
                var args = { value: this.value(),text: this._getText(), htmlText: this.getHtml(), isInteraction: this._isInteraction, };
                this._trigger("change", args);
                this._isInteraction = true;
            }
        },
        _disableIframeContent: function () {
            try {
                this._rteIframe.contents().find("body,[contenteditable='true']").attr("contenteditable", false);
            }
            catch (err) { }
        },

        disable: function () {
            this.model.enabled = false; this._showHideContextMenu();
            this.element.attr("disabled", "disabled");
            this._unwireEvents();
            this.model.showToolbar && this._toolBarObj.disable();
            $(this._rteFooter).ejTooltip("option", "enabled", false);
            this._disableIframeContent();
            this._rteEditor.addClass("e-disable");
            if (this.model.showFooter) {
                this._rteFooter.addClass("e-disable");
                this._resize.removeClass("e-resizable");
                this._footerEvents("_off");
            }
            this._disableResizeObj(false);
        },

        enable: function () {
            this.model.enabled = true; this._showHideContextMenu();
            this.element.removeAttr("disabled");
            this._wireEvents();
            this.model.showToolbar && this._toolBarObj.enable();
            $(this._rteFooter).ejTooltip("option", "enabled", true);
            this._rteIframe.contents().find("body,[contenteditable='false']").attr("contenteditable", true);
            this._rteEditor.removeClass("e-disable");
            if (this.model.showFooter) {
                this._rteFooter.removeClass("e-disable");
                this._resize.addClass("e-resizable");
                this._footerEvents("_on");
            }
            this._disableResizeObj(true);
        },

        disableToolbarItem: function (id) {
            !ej.isNullOrUndefined(id) && ($(this._toolBarObj.target).find("#" + this._rteId + "_" + id).length != 0 || $(this._toolBarObj._liTemplte).find("#" + this._rteId + "_" + id).length != 0) ? this._toolBarObj.disableItemByID(this._rteId + "_" + id) : this._toolBarObj.disableItemByID(id);
            if (id == "undo") $("#" + this._rteId + "_" + id).addClass("e-rteTooldisable");
        },


        enableToolbarItem: function (id) {
            !ej.isNullOrUndefined(id) && ($(this._toolBarObj.target).find("#" + this._rteId + "_" + id).length != 0 || $(this._toolBarObj._liTemplte).find("#" + this._rteId + "_" + id).length != 0) ? this._toolBarObj.enableItemByID(this._rteId + "_" + id) : this._toolBarObj.enableItemByID(id);
            if (id == "undo" && $("#" + this._rteId + "_" + id).hasClass("e-rteTooldisable"));
            $("#" + id).removeClass("e-rteTooldisable");
        },


        removeToolbarItem: function (id) {
            !ej.isNullOrUndefined(id) && this._toolBarObj.removeItemByID(this._rteId + "_" + id);
            this._setIframeHeight();
        },

        refresh: function () {
            this._unwireEvents();
            this._setIFrames();
            this._setIframeHeight();
            if (this.model.enabled) this._wireEvents();
            else this._disableIframeContent();
            if (this.model.enableRTL) this._rteIframe.contents().find("body").css("direction", "rtl");
            this._showHideContextMenu();
        },


        show: function () {
            this._rteWapper.show();
            this._setIFrames();
        },


        hide: function () {
            this._rteWapper.hide();
        },

        setColorPickerType: function (value) {
            if (value == "palette" || value === "picker")
                this._imgPicker.option('modelType', value);
            else
                this._imgPicker.option('modelType', "default");
        },
        pasteContent: function (html) {
            this._pasteAPIFlag = true;
            this._pasteHtml(html);
            this._onChange();
        },
        getDocument: function () {
            return this._getDocument();
        },
        getHtml: function (encode) {
            if (this.model.enableXHTML) {
                if (this.model.enableHtmlEncode) {
                    if (encode == false)
                        return this._removeNoSpaceChar($.trim(this._decode(this.value())));
                    else
                        return this._removeNoSpaceChar($.trim(this.value()));
                }
                else
                    return this._removeNoSpaceChar($.trim(this.value()));
            }
            else {
                try {
                    if (this.model.enableHtmlEncode) {
                        if (encode == false)
                            return this._removeNoSpaceChar($.trim(this._getDocument().body.innerHTML));
                        else
                            return this._removeNoSpaceChar(this._encode($.trim(this._getDocument().body.innerHTML)));
                    }
                    else
                        return this._removeNoSpaceChar($.trim(this._getDocument().body.innerHTML));
                }
                catch (err) {
                    return "";
                }
            }
        },
        setHtml: function (value) {
            this._getDocument().body.innerHTML = "";
            this._getDocument().body.innerHTML = $.trim(value);
            this._onChange();
			var _tableEle = $(this._getDocument()).find("table");       
            if (!this.model.enableRTL && _tableEle.length > 0 ) this._on(_tableEle, "mouseover", this._tableMouseOver);
        },


        getText: function () {
            return this._getText();
        },


        executeCommand: function (cmdName, args, textnodeType) {
            if (this._isIE8() && ej.isNullOrUndefined(this._ieSelectionRange)) this._ieSelectionRange = this._getRange();
            else if (this._isIE() && cmdName.toLowerCase() == "inserthtml" && !this._isIE8()) {
                if (this._getRange().startContainer.nodeName.toLowerCase() != "body") {
                    this._currentSelNode = this._getRange().startContainer;
                }
                else {
                    this._ieLinkRange();
                }
            }
            if (this._trigger("execute", { commandName: cmdName })) return false;
            var anchor = "";
            if (ej.browserInfo().name == "chrome" && this._getWindow().getSelection().rangeCount == 0)
                this._restoreSelection(this._saveSelection());
            if (cmdName == "underline") {
                if (window.getSelection) {
                    anchor = $(this._getWindow().getSelection().anchorNode).parents("a");
                    if (anchor.length > 0) {
                        $(anchor).css("text-decoration", ($(anchor).css("text-decoration") == "none") ? "underline" : "none");
                        return;
                    }
                }
            }
            else if (cmdName.toLowerCase() == "inserthtml") {
                if (this._isIE() || (ej.browserInfo().name=="mozilla" && /class=(.*?)e-rte-table(.*?)>/ig.test(args))) {
                    this._pasteHtml(args, textnodeType);
                }
                else
                    this._getDocument().execCommand(cmdName, false, args);
                return;
            }
            else if (cmdName.toLowerCase() == "formatblock") {
                if (this._isIE()) {
                    if (args.charAt(0) != "<" && args.charAt(args.length - 1) != ">")
                        args = "<" + args + ">";
                }
            }
            if (ej.browserInfo().name == "msie")
                this._focus();
            if (this._isIE() && cmdName == "fontName") args = args.substring(0, args.indexOf(","));
            // if (!ej.isNullOrUndefined(this._tempEle) && this._tempEle.length > 0)
            // if ((this._tempEle.get(0).nodeName == "#text") && ($(this._tempEle.parents("li")).length > 0))
            // if ($(this._tempEle.parents("li")).prop("style")["font-size"] != "")
            // var lisize = $(this._tempEle.parents("li")).css("font-size");
            this._getDocument().execCommand(cmdName, false, args);
            this._onChange();
            if (cmdName != "fontName" && cmdName != "fontSize" && cmdName != "indent" && cmdName != "cut" && cmdName != "copy" && cmdName != "paste" && cmdName != "undo" && cmdName != "redo" && cmdName != "outdent" && !ej.isNullOrUndefined(this._toolBarObj))
                if (!this._toolBarObj.itemsContainer.find("li#" + this._rteId + "_" + cmdName).hasClass("e-active"))
                    this._toolBarObj.selectItemByID(this._rteId + "_" + cmdName);
                else
                    this._toolBarObj.deselectItemByID(this._rteId + "_" + cmdName);
            //  if (!ej.isNullOrUndefined(this._tempEle)) this._bulletsResizing(lisize, cmdName);
            if (args != "listItem") this._setBackupData();
        },
        //The commented lines behavior need to achieve in custom exec-command task if possible
        // _bulletsResizing: function (lisize, cmd) {
        // if ((!ej.isNullOrUndefined(this._tempEle.get(0))) && cmd=="fontSize")
        // var li = this._tempEle.get(0).tagName == "BODY" ? this._tempEle.find("li") : this._tempEle.get(0).nodeName != "#text" ? $(this._tempEle.parents("body")).find("li") : "";
        // if (li != "")
        // $(li).each(function (index) {
        // //refreshig the li font size after font size of li content executed
        // fonttag = $(this).find("font")[0] || "";
        // if (fonttag != "") {
        // $(this).css("font-size", $($(fonttag)[0]).css("font-size"));
        // // $(li).find("font").removeAttr("style");
        // }
        // else
        // {
        // $(this).css("font-size", $(this).css("font-size"));
        // }
        // });


        // if (cmd == "fontSize" && (this._getCommandStatus('InsertOrderedList') || this._getCommandStatus('InsertOrderedList')))
        // if (this._tempEle.get(0).tagName == "LI" || this._tempEle.get(0).tagName == "OL") {

        // this._tempEle.css("font-Size", this._tempEle.find("font").css("font-Size"));
        // $(this._tempEle.find("font")).removeProp("style")["font-size"];
        // }
        // if (lisize != null) {

        // $(this._tempEle.parents("li")).css("font-size", lisize);
        // $(this._tempEle.parents("li")).find("font").removeAttr("style");
        // }

        // },


        focus: function () {
            this._focus();
        },


        getCommandStatus: function (value) {
            if (ej.isNullOrUndefined(value) || value != "")
                return this._getCommandStatus(value);
        },


        getSelectedHtml: function () {
            return this._getSelectedHtmlString();
        },

        insertMenuOption: function (option) {
            if (option.newItem && option.targetItem && option.insertType && option.menuType) {
                var menuObj = this._textMenuObj, element, elementId = option.newItem, data = option.spriteCssClass ? [{ text: option.newItem, id: elementId, spriteCssClass: option.spriteCssClass }] : [{ text: option.newItem, id: elementId }];
                for (var i = 0; i < menuObj.element.find('li a').length; i++) {
                    if ($(menuObj.element.find('li a')[i]).text() == option.targetItem) {
                        element = $(menuObj.element.find('li')[i]).attr('id');
                        break;
                    }
                }
                if (option.insertType == "insert") menuObj.insert(data, element ? "#" + element : element);
                else if (option.insertType == "insertAfter") menuObj.insertAfter(data, "#" + element);
                else if (option.insertType == "insertBefore") menuObj.insertBefore(data, "#" + element);
                (option.menuType.text && this._contextType.text.push(elementId));
                (option.menuType.image && this._contextType.image.push(elementId));
                (option.menuType.hyperlink && this._contextType.hyperlink.push(elementId));
                (option.menuType.table && (this._contextType.table.push(elementId), this._contextType.table_hyper.push(elementId)));
            }
        },
        removeMenuOption: function (targetElement) {
            var menuObj = this._textMenuObj; menuObj.remove(["#" + targetElement]);
            (index = $.inArray(targetElement, this._contextType.text)) != -1 && (this._contextType.text = this._removeContextData(index, this._contextType.text));
            (index = $.inArray(targetElement, this._contextType.image)) != -1 && (this._contextType.image = this._removeContextData(index, this._contextType.image));
            (index = $.inArray(targetElement, this._contextType.hyperlink)) != -1 && (this._contextType.hyperlink = this._removeContextData(index, this._contextType.hyperlink));
            (index = $.inArray(targetElement, this._contextType.table)) != -1 && (this._contextType.textablet = this._removeContextData(index, this._contextType.table));
            (index = $.inArray(targetElement, this._contextType.table_hyper)) != -1 && (this._contextType.textablet = this._removeContextData(index, this._contextType.table_hyper));
        },
        _removeContextData: function (index, data) {
            var temp = [];
            $(data).each(function (ind, elem) { (index != ind) && temp.push(elem); });
            return temp;
        },
        insertRow: function (before, cell) {
            if (this.model.maxLength != null && (this.model.maxLength > $.trim(this._getText()).length)) {
                var seletedCell = ej.isNullOrUndefined(cell) ? this._getSelectedNode() : cell;
				var newRow =  $(seletedCell).closest("tr").clone(), curRow = $(seletedCell).closest("tr");
                var cols = newRow.find("td").html("<br _moz_dirty=''/>");
                before ? newRow.insertBefore(curRow) : newRow.insertAfter(curRow);
                newRow.find("td:first").focus();
                this._setAutoHeight();
                return seletedCell;
            }
        },


        insertColumn: function (before, cell) {
            if (this.model.maxLength != null && (this.model.maxLength > $.trim(this._getText()).length)) {
                var isTable = $(this._getSelectedNode()).closest("td");
                var seletedCell = ej.isNullOrUndefined(cell) ? (isTable.length > 0) ? isTable[0] : this._getSelectedNode() : cell;
                var colTemplate = $(seletedCell).clone(), curRow = $(seletedCell).closest("tr"), curCell;
				colTemplate[0].innerHTML = "<br _moz_dirty=''/>";
                var allRows = curRow.closest("table").find("tr");
                var colIndex = curRow.find("td").index(seletedCell);
                for (var i = 0; i < allRows.length; i++) {
                    curCell = $(allRows[i]).find("td")[colIndex];
                    before ? $(colTemplate.clone()).insertBefore(curCell) : $(colTemplate.clone()).insertAfter(curCell);
                }
                return seletedCell;
            }
        },


        removeRow: function (cell) {
            var seletedCell = ej.isNullOrUndefined(cell) ? this._getSelectedNode() : cell;
            var range = this._getRange();
            var select; var node = null, curRow;
            var parentTable = $(seletedCell).closest("table");

            if (parentTable.find("tr").length == 1) {
                node = $(seletedCell).parent("tr").closest("table").next()[0] || $(seletedCell).parent("tr").closest("table").prev()[0];
                $(seletedCell).closest("table").remove();
            }
            else {
                node = ($(seletedCell).parent("tr").prev("tr").length != 0) ? $(seletedCell).parent("tr").prev("tr").find("td:last")[0] : $(seletedCell).parent("tr").next("tr").find("td:first")[0];
                curRow = $(seletedCell).closest("tr").remove();
            }
            if (!ej.isNullOrUndefined(node)) {
                this._setRange(node, range);
            }
            this._setAutoHeight();
        },
        selectRange: function (range, node) {
            this._focus();
            var select;
            if (!this._isIE8()) {
                select = this._getDocument().getSelection();
                select.removeAllRanges();
                select.addRange(range);
            }
            else {
                range.select();
            }
        },
        _encode: function (value) {
            return $('<div/>').text(value).html();
        },
        _decode: function (value) {
            return value.replace(/&amp;/g, "&").replace(/&amp;lt;/g, "<").replace(/&lt;/g, "<").replace(/&amp;gt;/g, ">").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&amp;nbsp;/g, " ").replace(/&quot;/g);
        },
        createRange: function () {
            if (!this._isIE8())
                return this._getRange();
            else
                return this.getDocument().body.createTextRange();
        },
        _setRange: function (node, range, collapse) {
            if (!this._isIE8()) {
                range.setStart(node, 0);
                range.collapse(true);
                if ((ej.browserInfo().name != "msie" || ej.browserInfo().version == "11.0") || !ej.isNullOrUndefined(collapse)) {
                    this.selectRange(range);
                }
                else if (ej.isNullOrUndefined(collapse)) {
                    selection = this._getDocument().body.createTextRange();
                    selection.moveToElementText(node);
                }
            }
            else if (!ej.isNullOrUndefined(node)) {
                range.collapse(true);
                range.moveToElementText(node);
                range.moveStart("character", 1);
                range.select();
            }
        },

        removeColumn: function (cell) {
            var isTable = $(this._getSelectedNode()).closest("td");
            var seletedCell = ej.isNullOrUndefined(cell) ? (isTable.length > 0) ? isTable[0] : this._getSelectedNode() : cell;
            var range = this._getRange();
            var curRow = $(seletedCell).closest("tr");
            var allRows = curRow.closest("table").find("tr");
            var colIndex = curRow.find("td").index(seletedCell);
            var node = !ej.isNullOrUndefined(seletedCell.nextElementSibling) ? $(seletedCell.nextElementSibling)[0] : $(seletedCell.previousSibling)[0];
            if (ej.isNullOrUndefined(node))
                $(seletedCell).parent("tr").parents("table").remove();
            else {
                for (var i = 0; i < allRows.length; i++) {
                    $($(allRows[i]).find("td")[colIndex]).remove();
                }
            }
            if (!ej.isNullOrUndefined(node)) {
                this._setRange(node, range);
            }
        },


        removeTable: function (table) {
            var seletedTable = ej.isNullOrUndefined(table) ? $(this._getSelectedNode()).closest("table") : table, tableAction = $(seletedTable).parent().closest('table').length < 1;
            this._currentSelNode = $(seletedTable).parent()[0];
            $(seletedTable).remove();
            if (tableAction)
                this._toggleEditTable();
            this._setAutoHeight();
            this._removeResizeObject();
            $(this._getDocument()).find(".e-rte-tablebox").remove();
        }
    });

    ej.RTE.Locale = ej.RTE.Locale || {};

    ej.RTE.Locale["default"] = ej.RTE.Locale["en-US"] = {
        bold: "Bold",
        italic: "Italic",
        underline: "Underline",
        strikethrough: "Strikethrough",
        superscript: "Superscript",
        subscript: "Subscript",
        justifyCenter: "Align text center",
        justifyLeft: "Align text left",
        justifyRight: "Align text right",
        justifyFull: "Justify",
        unorderedList: "Insert unordered list",
        orderedList: "Insert ordered list",
        indent: "Increase Indent",
        fileBrowser: "File Browser",
        outdent: "Decrease Indent",
        cut: "Cut",
        copy: "Copy",
        paste: "Paste",
        paragraph: "Paragraph",
        undo: "Undo",
        redo: "Redo",
        upperCase: "Upper Case",
        lowerCase: "Lower Case",
        clearAll: "Clear All",
        clearFormat: "Clear Format",
        createLink: "Insert/Edit Hyperlink",
        removeLink: "Remove Hyperlink",
        tableProperties: "Table Properties",
        insertTable: "Insert",
        deleteTables: "Delete",
        imageProperties: "Image Properties",
        openLink: "Open Hyperlink",
        image: "Insert image",
        video: "Insert video",
        editTable: "Edit Table Properties",
        embedVideo: "Paste your embed code below",
        viewHtml: "View HTML",
        fontName: "Select font family",
        fontSize: "Select font size",
        fontColor: "Select color",
		customFontColor:"More Colors...",
		customBGColor:"More Colors...",
        format: "Format",
        backgroundColor: "Background color",
		TransBGColor:"Transparent",
        style: "Styles",
        deleteAlert: "Are you sure you want to clear all the contents?",
        copyAlert: "Your browser doesn't support direct access to the clipboard. Please use the Ctrl+C keyboard shortcut instead of copy operation.",
        pasteAlert: "Your browser doesn't support direct access to the clipboard. Please use the Ctrl+V keyboard shortcut instead of paste operation.",
        cutAlert: "Your browser doesn't support direct access to the clipboard. Please use the Ctrl+X keyboard shortcut instead of cut operation.",
        videoError: "The text area can not be empty",
        imageWebUrl: "Web Address",
        imageAltText: "Alternate text",
        dimensions: "Dimensions",
        constrainProportions: "Constrain Proportions",
        linkWebUrl: "Web Address",
        imageLink: "Image as Link",
        imageBorder: "Image Border",
        imageStyle: "Style",
        linkText: "Text",
        linkTooltipLabel: "Tooltip",
        html5Support: "This tool icon only enabled in HTML5 supported browsers",
        linkOpenInNewWindow: "Open link in new window",
        tableColumns: "No.of Columns",
        tableRows: "No.of Rows",
        tableWidth: "Width",
        tableHeight: "Height",
        tableCellSpacing: "Cell spacing",
        tableCellPadding: "Cell padding",
        tableBorder: "Border",
        tableCaption: "Caption",
        tableAlignment: "Alignment",
        textAlign: "Text align",
        dialogUpdate: "Update",
        dialogInsert: "Insert",
        dialogCancel: "Cancel",
        dialogApply: "Apply",
        dialogOk: "Ok",
        createTable: "Insert Table",
        addColumnLeft: "Insert Columns to the Left",
        addColumnRight: "Insert Columns to the Right",
        addRowAbove: "Insert Rows Above",
        addRowBelow: "Insert Rows Below",
        deleteRow: "Delete entire row",
        deleteColumn: "Delete entire column",
        deleteTable: "Delete Table",
        customTable: "Create custom table...",
        characters: "Characters",
        words: "Words",
		w:"W",
		c:"C",
        general: "General",
        advanced: "Advanced",
        table: "Table",
        row: "Row",
        column: "Column",
        cell: "Cell",
        solid: "Solid",
        dotted: "Dotted",
        dashed: "Dashed",
        doubled: "Double",
        maximize: "Maximize",
        resize: "Minimize",
        swatches: "Swatches",
        quotation: "Quotation",
        heading1: "Heading 1",
        heading2: "Heading 2",
        heading3: "Heading 3",
        heading4: "Heading 4",
        heading5: "Heading 5",
        heading6: "Heading 6",
        segoeui: "Segoe UI",
        arial: "Arial",
        couriernew: "Courier New",
        georgia: "Georgia",
        impact: "Impact",
        lucidaconsole: "Lucida Console",
        tahoma: "Tahoma",
        timesnewroman: "Times New Roman",
        trebuchetms: "Trebuchet MS",
        verdana: "Verdana",
        disc: "Disc",
        circle: "Circle",
        square: "Square",
        number: "Number",
        loweralpha: "Lower Alpha",
        upperalpha: "Upper Alpha",
        lowerroman: "Lower Roman",
        upperroman: "Upper Roman",
        none: "None",
        linkTooltip: "ctrl + click to follow link",
        charSpace: "Characters (with spaces)",
        charNoSpace: "Characters (no spaces)",
        wordCount: "Word Count",
        left: "Left",
        right: "Right",
        center: "Center",
        zoomIn: "Zoom In",
        zoomOut: "Zoom Out",
        print: "Print",
        'import': "Import a Document",
        wordExport: "Export as Word Document",
        pdfExport: "Export as Pdf File",
        FindAndReplace: "Find and Replace",
        Find: "Find",
        MatchCase: "Match Case",
        WholeWord: "Whole Word",
        ReplaceWith: "Replace with",
        Replace: "Replace",
        ReplaceAll: "Replace All",
        FindErrorMsg: "Couldn't find specified word.",
		FindOf: " of ", 
		ReplaceCount: " occurrences were replaced.",
        addtodictionary: "Add to Dictionary",
        ignoreall: "IgnoreAll"
    };
ej.RTE.ToolbarOverflowMode = {
        /**  Renders overflow popup with hamburger icon as usual. */
        Popup:"popup",
        /**  Renders overflow popup  below the toolbar as inline on clicking the arrow. */
        Inline: "inline"
    };
})(jQuery, Syncfusion);