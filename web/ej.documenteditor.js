"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var isIELowerVersion = (ej.browserInfo().name == "msie" && parseInt(ej.browserInfo().version) < 9);
(function ($) {
    var DocumentEditor = (function (_super) {
        __extends(DocumentEditor, _super);
        function DocumentEditor() {
            _super.apply(this, arguments);
            this.rootCSS = "e-documenteditor";
            this.PluginName = "ejDocumentEditor";
            this._id = "null";
            this.defaults = {
                importExportSettings: {
                    importUrl: "",
                    importHtmlUrl: "",
                    exportUrl: "",
                },
                isReadOnly: false,
                layoutType: 0,
                selection: {
                    characterFormat: {
                        bold: undefined,
                        italic: undefined,
                        fontSize: undefined,
                        underline: undefined,
                        strikeThrough: undefined,
                        baselineAlignment: undefined,
                        highlightColor: undefined,
                        fontColor: undefined,
                        fontFamily: undefined
                    },
                    paragraphFormat: {
                        leftIndent: undefined,
                        rightIndent: undefined,
                        firstLineIndent: undefined,
                        afterSpacing: undefined,
                        beforeSpacing: undefined,
                        lineSpacing: undefined,
                        lineSpacingType: undefined,
                        textAlignment: undefined,
                    },
                    tableFormat: {
                        leftIndent: undefined,
                        background: undefined,
                        tableAlignment: undefined,
                        cellSpacing: undefined,
                        leftMargin: undefined,
                        rightMargin: undefined,
                        topMargin: undefined,
                        bottomMargin: undefined,
                        preferredWidth: undefined,
                        preferredWidthType: undefined,
                    },
                    cellFormat: {
                        verticalAlignment: undefined,
                        leftMargin: undefined,
                        rightMargin: undefined,
                        topMargin: undefined,
                        bottomMargin: undefined,
                        background: undefined,
                        preferredWidth: undefined,
                        preferredWidthType: undefined,
                    },
                    rowFormat: {
                        height: undefined,
                        heightType: undefined,
                        isHeader: undefined,
                        allowRowBreakAcrossPages: undefined,
                    },
                    sectionFormat: {
                        headerDistance: undefined,
                        footerDistance: undefined,
                        differentFirstPage: undefined,
                        differentOddAndEvenPages: undefined,
                        pageWidth: undefined,
                        pageHeight: undefined,
                        leftMargin: undefined,
                        topMargin: undefined,
                        rightMargin: undefined,
                        bottomMargin: undefined,
                    },
                },
                documentChange: null,
                zoomFactorChange: null,
                requestNavigate: null,
                selectionChange: null,
                contentChange: null,
            };
            this._documentEditorHelper = null;
            this.model = this.defaults;
        }
        DocumentEditor.prototype._init = function () {
            if (isIELowerVersion)
                return;
            if (!ej.isNullOrUndefined(this.element)) {
                this._documentEditorHelper = new DocumentEditorFeatures.DocumentEditorHelper(this, ej);
                this._documentEditorHelper.Document = this._createEmptyDocument();
                this._documentEditorHelper.IsReadOnly = this.model.isReadOnly;
            }
        };
        DocumentEditor.prototype._destroy = function () {
            if (isIELowerVersion)
                return;
            window.removeEventListener('resize', this._documentEditorHelper.Viewer.windowResizeHandler);
            window.removeEventListener('mousedown', this._documentEditorHelper.Viewer.windowMouseDownHandler);
            window.removeEventListener('keyup', this._documentEditorHelper.Viewer.windowKeyUpHandler);
        };
        DocumentEditor.prototype._setModel = function (options) {
            if (!isIELowerVersion && this._documentEditorHelper == undefined && this._documentEditorHelper == null)
                return;
            var option;
            var value;
            for (option in options) {
                value = options[option];
                switch (option) {
                    case "isReadOnly":
                        this._documentEditorHelper.IsReadOnly = value;
                        break;
                    case "layoutType":
                        this._documentEditorHelper.LayoutType = value;
                        break;
                    case "selection":
                        this._setSelection(value);
                        break;
                }
            }
        };
        DocumentEditor.prototype._setSelection = function (options) {
            if (this._documentEditorHelper.IsReadOnlyMode || !this._documentEditorHelper.IsDocumentLoaded)
                return;
            var option;
            var value;
            for (option in options) {
                value = options[option];
                switch (option) {
                    case "characterFormat":
                        this._setCharacterFormat(value);
                        break;
                    case "paragraphFormat":
                        this._setParagraphFormat(value);
                        break;
                    case "tableFormat":
                        this._setTableFormat(value);
                        break;
                    case "cellFormat":
                        this._setCellFormat(value);
                        break;
                    case "rowFormat":
                        this._setRowFormat(value);
                        break;
                    case "sectionFormat":
                        this._setSectionFormat(value);
                        break;
                }
            }
        };
        DocumentEditor.prototype._setCharacterFormat = function (options) {
            var option;
            var value;
            for (option in options) {
                value = options[option];
                switch (option) {
                    case "bold":
                        if (value != null && value != undefined && (value == true || value == false))
                            this._documentEditorHelper.Selection.CharacterFormat.Bold = value;
                        break;
                    case 'italic':
                        if (value != null && value != undefined && (value == true || value == false))
                            this._documentEditorHelper.Selection.CharacterFormat.Italic = value;
                        break;
                    case 'fontSize':
                        if (value != null && value != undefined)
                            this._documentEditorHelper.Selection.CharacterFormat.FontSize = value;
                        break;
                    case 'underline':
                        if (value != null && value != undefined)
                            this._documentEditorHelper.Selection.CharacterFormat.Underline = value;
                        break;
                    case 'strikeThrough':
                        if (value != null && value != undefined)
                            this._documentEditorHelper.Selection.CharacterFormat.StrikeThrough = value;
                        break;
                    case 'baselineAlignment':
                        if (value != null && value != undefined)
                            this._documentEditorHelper.Selection.CharacterFormat.BaselineAlignment = value;
                        break;
                    case 'highlightColor':
                        if (value != null && value != undefined)
                            this._documentEditorHelper.Selection.CharacterFormat.HighlightColor = value;
                        break;
                    case 'fontColor':
                        if (value != null && value != undefined)
                            this._documentEditorHelper.Selection.CharacterFormat.FontColor = value;
                        break;
                    case 'fontFamily':
                        if (value != null && value != undefined)
                            this._documentEditorHelper.Selection.CharacterFormat.FontFamily = value;
                        break;
                }
            }
        };
        DocumentEditor.prototype._setParagraphFormat = function (options) {
            var option;
            var value;
            for (option in options) {
                value = options[option];
                switch (option) {
                    case "firstLineIndent":
                        if (value != null && value != undefined)
                            this._documentEditorHelper.Selection.ParagraphFormat.FirstLineIndent = value;
                        break;
                    case "afterSpacing":
                        if (value != null && value != undefined)
                            this._documentEditorHelper.Selection.ParagraphFormat.AfterSpacing = value;
                        break;
                    case "beforeSpacing":
                        if (value != null && value != undefined)
                            this._documentEditorHelper.Selection.ParagraphFormat.BeforeSpacing = value;
                        break;
                    case "lineSpacing":
                        if (value != null && value != undefined)
                            this._documentEditorHelper.Selection.ParagraphFormat.LineSpacing = value;
                        break;
                    case "lineSpacingType":
                        if (value != null && value != undefined)
                            this._documentEditorHelper.Selection.ParagraphFormat.LineSpacingType = value;
                        break;
                    case "textAlignment":
                        if (value != null && value != undefined)
                            this._documentEditorHelper.Selection.ParagraphFormat.TextAlignment = value;
                        break;
                }
            }
        };
        DocumentEditor.prototype._setTableFormat = function (options) {
            if (this._documentEditorHelper.Selection.EditingContext.Type != ej.DocumentEditor.EditingContextType.Table)
                return;
            var option;
            var value;
            for (option in options) {
                value = options[option];
                switch (option) {
                    case 'background':
                        this._documentEditorHelper.Selection.TableFormat.Background = value;
                        break;
                    case 'bottomMargin':
                        this._documentEditorHelper.Selection.TableFormat.BottomMargin = value;
                        break;
                    case 'cellSpacing':
                        this._documentEditorHelper.Selection.TableFormat.CellSpacing = value;
                        break;
                    case 'leftIndent':
                        this._documentEditorHelper.Selection.TableFormat.LeftIndent = value;
                        break;
                    case 'leftMargin':
                        this._documentEditorHelper.Selection.TableFormat.LeftMargin = value;
                        break;
                    case 'preferredWidth':
                        this._documentEditorHelper.Selection.TableFormat.PreferredWidth = value;
                        break;
                    case 'preferredWidthType':
                        this._documentEditorHelper.Selection.TableFormat.PreferredWidthType = value;
                        break;
                    case 'rightMargin':
                        this._documentEditorHelper.Selection.TableFormat.RightMargin = value;
                        break;
                    case 'tableAlignment':
                        this._documentEditorHelper.Selection.TableFormat.TableAlignment = value;
                        break;
                    case 'topMargin':
                        this._documentEditorHelper.Selection.TableFormat.TopMargin = value;
                        break;
                }
            }
        };
        DocumentEditor.prototype._setCellFormat = function (options) {
            if (this._documentEditorHelper.Selection.EditingContext.Type != ej.DocumentEditor.EditingContextType.Table)
                return;
            var option;
            var value;
            for (option in options) {
                value = options[option];
                switch (option) {
                    case 'background':
                        this._documentEditorHelper.Selection.CellFormat.Background = value;
                        break;
                    case 'bottomMargin':
                        this._documentEditorHelper.Selection.CellFormat.BottomMargin = value;
                        break;
                    case 'leftMargin':
                        this._documentEditorHelper.Selection.CellFormat.LeftMargin = value;
                        break;
                    case 'preferredWidth':
                        this._documentEditorHelper.Selection.CellFormat.PreferredWidth = value;
                        break;
                    case 'preferredWidthType':
                        this._documentEditorHelper.Selection.CellFormat.PreferredWidthType = value;
                        break;
                    case 'rightMargin':
                        this._documentEditorHelper.Selection.CellFormat.RightMargin = value;
                        break;
                    case 'topMargin':
                        this._documentEditorHelper.Selection.CellFormat.TopMargin = value;
                        break;
                    case 'verticalAlignment':
                        this._documentEditorHelper.Selection.CellFormat.VerticalAlignment = value;
                        break;
                }
            }
        };
        DocumentEditor.prototype._setRowFormat = function (options) {
            if (this._documentEditorHelper.Selection.EditingContext.Type != ej.DocumentEditor.EditingContextType.Table)
                return;
            var option;
            var value;
            for (option in options) {
                value = options[option];
                switch (option) {
                    case 'allowRowBreakAcrossPages':
                        this._documentEditorHelper.Selection.RowFormat.AllowBreakAcrossPages = value;
                        break;
                    case 'height':
                        this._documentEditorHelper.Selection.RowFormat.Height = value;
                        break;
                    case 'heightType':
                        this._documentEditorHelper.Selection.RowFormat.HeightType = value;
                        break;
                    case 'isHeader':
                        this._documentEditorHelper.Selection.RowFormat.IsHeader = value;
                        break;
                }
            }
        };
        DocumentEditor.prototype._setSectionFormat = function (options) {
            var option;
            var value;
            for (option in options) {
                value = options[option];
                switch (option) {
                    case 'bottomMargin':
                        this._documentEditorHelper.Selection.SectionFormat.BottomMargin = value;
                        break;
                    case 'differentFirstPage':
                        this._documentEditorHelper.Selection.SectionFormat.DifferentFirstPage = value;
                        break;
                    case 'footerDistance':
                        this._documentEditorHelper.Selection.SectionFormat.FooterDistance = value;
                        break;
                    case 'headerDistance':
                        this._documentEditorHelper.Selection.SectionFormat.HeaderDistance = value;
                        break;
                    case 'leftMargin':
                        this._documentEditorHelper.Selection.SectionFormat.LeftMargin = value;
                        break;
                    case 'pageHeight':
                        this._documentEditorHelper.Selection.SectionFormat.PageHeight = value;
                        break;
                    case 'pageWidth':
                        this._documentEditorHelper.Selection.SectionFormat.PageWidth = value;
                        break;
                    case 'rightMargin':
                        this._documentEditorHelper.Selection.SectionFormat.RightMargin = value;
                        break;
                    case 'topMargin':
                        this._documentEditorHelper.Selection.SectionFormat.TopMargin = value;
                        break;
                    case 'differentOddAndEvenPages':
                        this._documentEditorHelper.Selection.SectionFormat.DifferentOddAndEvenPages = value;
                        break;
                }
            }
        };
        DocumentEditor.prototype._createEmptyDocument = function () {
            var documentAdv = new DocumentEditorFeatures.DocumentAdv(null);
            var sectionAdv = new DocumentEditorFeatures.SectionAdv(null);
            var paragraphAdv = new DocumentEditorFeatures.ParagraphAdv(null);
            sectionAdv.Blocks.push(paragraphAdv);
            documentAdv.Sections.push(sectionAdv);
            return documentAdv;
        };
        DocumentEditor.prototype._loadDocument = function (data) {
            this._documentEditorHelper._ParseDocument(data);
        };
        DocumentEditor.prototype._raiseClientEvent = function (eventName, argument) {
            var val = null;
            if (argument === null) {
            }
            else {
                val = argument;
            }
            var args;
            if (eventName == "documentChange")
                args = "";
            else if (eventName == "selectionChange") {
                args = "";
                this._copySelectionFormats();
            }
            else if (eventName == "zoomFactorChange")
                args = "";
            else if (eventName == "requestNavigate") {
                var linkType = "";
                switch (val.Hyperlink.LinkType) {
                    case DocumentEditorFeatures.HyperlinkType.Bookmark:
                        linkType = "bookmark";
                        break;
                    case DocumentEditorFeatures.HyperlinkType.Email:
                        linkType = "email";
                        break;
                    case DocumentEditorFeatures.HyperlinkType.File:
                        linkType = "file";
                        break;
                    default:
                        linkType = "webpage";
                        break;
                }
                var HyperLink = { "navigationLink": val.Hyperlink.navigationLink, "linkType": linkType };
                args = { "hyperlink": HyperLink };
            }
            else if (eventName == "contentChange")
                args = "";
            this._trigger(eventName, args);
        };
        DocumentEditor.prototype._copySelectionFormats = function () {
            this.model.selection.characterFormat.bold = this._documentEditorHelper.Selection.CharacterFormat.Bold;
            this.model.selection.characterFormat.italic = this._documentEditorHelper.Selection.CharacterFormat.Italic;
            this.model.selection.characterFormat.fontSize = this._documentEditorHelper.Selection.CharacterFormat.FontSize;
            this.model.selection.characterFormat.underline = this._documentEditorHelper.Selection.CharacterFormat.Underline;
            this.model.selection.characterFormat.baselineAlignment = this._documentEditorHelper.Selection.CharacterFormat.BaselineAlignment;
            this.model.selection.characterFormat.strikeThrough = this._documentEditorHelper.Selection.CharacterFormat.StrikeThrough;
            this.model.selection.characterFormat.highlightColor = this._documentEditorHelper.Selection.CharacterFormat.HighlightColor;
            this.model.selection.characterFormat.fontFamily = this._documentEditorHelper.Selection.CharacterFormat.FontFamily;
            this.model.selection.characterFormat.fontColor = this._documentEditorHelper.Selection.CharacterFormat.FontColor;
            this.model.selection.paragraphFormat.afterSpacing = this._documentEditorHelper.Selection.ParagraphFormat.AfterSpacing;
            this.model.selection.paragraphFormat.beforeSpacing = this._documentEditorHelper.Selection.ParagraphFormat.BeforeSpacing;
            this.model.selection.paragraphFormat.leftIndent = this._documentEditorHelper.Selection.ParagraphFormat.LeftIndent;
            this.model.selection.paragraphFormat.rightIndent = this._documentEditorHelper.Selection.ParagraphFormat.RightIndent;
            this.model.selection.paragraphFormat.firstLineIndent = this._documentEditorHelper.Selection.ParagraphFormat.FirstLineIndent;
            this.model.selection.paragraphFormat.lineSpacing = this._documentEditorHelper.Selection.ParagraphFormat.LineSpacing;
            this.model.selection.paragraphFormat.lineSpacingType = this._documentEditorHelper.Selection.ParagraphFormat.LineSpacingType;
            this.model.selection.paragraphFormat.textAlignment = this._documentEditorHelper.Selection.ParagraphFormat.TextAlignment;
            this.model.selection.tableFormat.background = this._documentEditorHelper.Selection.TableFormat.Background;
            this.model.selection.tableFormat.bottomMargin = this._documentEditorHelper.Selection.TableFormat.BottomMargin;
            this.model.selection.tableFormat.cellSpacing = this._documentEditorHelper.Selection.TableFormat.CellSpacing;
            this.model.selection.tableFormat.leftIndent = this._documentEditorHelper.Selection.TableFormat.LeftIndent;
            this.model.selection.tableFormat.leftMargin = this._documentEditorHelper.Selection.TableFormat.LeftMargin;
            this.model.selection.tableFormat.preferredWidth = this._documentEditorHelper.Selection.TableFormat.PreferredWidth;
            this.model.selection.tableFormat.preferredWidthType = this._documentEditorHelper.Selection.TableFormat.PreferredWidthType;
            this.model.selection.tableFormat.rightMargin = this._documentEditorHelper.Selection.TableFormat.RightMargin;
            this.model.selection.tableFormat.tableAlignment = this._documentEditorHelper.Selection.TableFormat.TableAlignment;
            this.model.selection.tableFormat.topMargin = this._documentEditorHelper.Selection.TableFormat.TopMargin;
            this.model.selection.cellFormat.background = this._documentEditorHelper.Selection.CellFormat.Background;
            this.model.selection.cellFormat.bottomMargin = this._documentEditorHelper.Selection.CellFormat.BottomMargin;
            this.model.selection.cellFormat.leftMargin = this._documentEditorHelper.Selection.CellFormat.LeftMargin;
            this.model.selection.cellFormat.preferredWidth = this._documentEditorHelper.Selection.CellFormat.PreferredWidth;
            this.model.selection.cellFormat.preferredWidthType = this._documentEditorHelper.Selection.CellFormat.PreferredWidthType;
            this.model.selection.cellFormat.rightMargin = this._documentEditorHelper.Selection.CellFormat.RightMargin;
            this.model.selection.cellFormat.topMargin = this._documentEditorHelper.Selection.CellFormat.TopMargin;
            this.model.selection.cellFormat.verticalAlignment = this._documentEditorHelper.Selection.CellFormat.VerticalAlignment;
            this.model.selection.rowFormat.allowRowBreakAcrossPages = this._documentEditorHelper.Selection.RowFormat.AllowBreakAcrossPages;
            this.model.selection.rowFormat.height = this._documentEditorHelper.Selection.RowFormat.Height;
            this.model.selection.rowFormat.heightType = this._documentEditorHelper.Selection.RowFormat.HeightType;
            this.model.selection.rowFormat.isHeader = this._documentEditorHelper.Selection.RowFormat.IsHeader;
            this.model.selection.sectionFormat.bottomMargin = this._documentEditorHelper.Selection.SectionFormat.BottomMargin;
            this.model.selection.sectionFormat.differentFirstPage = this._documentEditorHelper.Selection.SectionFormat.DifferentFirstPage;
            this.model.selection.sectionFormat.differentOddAndEvenPages = this._documentEditorHelper.Selection.SectionFormat.DifferentOddAndEvenPages;
            this.model.selection.sectionFormat.footerDistance = this._documentEditorHelper.Selection.SectionFormat.FooterDistance;
            this.model.selection.sectionFormat.headerDistance = this._documentEditorHelper.Selection.SectionFormat.HeaderDistance;
            this.model.selection.sectionFormat.leftMargin = this._documentEditorHelper.Selection.SectionFormat.LeftMargin;
            this.model.selection.sectionFormat.pageHeight = this._documentEditorHelper.Selection.SectionFormat.PageHeight;
            this.model.selection.sectionFormat.pageWidth = this._documentEditorHelper.Selection.SectionFormat.PageWidth;
            this.model.selection.sectionFormat.rightMargin = this._documentEditorHelper.Selection.SectionFormat.RightMargin;
            this.model.selection.sectionFormat.topMargin = this._documentEditorHelper.Selection.SectionFormat.TopMargin;
        };
        DocumentEditor.prototype._getExportProperties = function () {
            var Document = this._documentEditorHelper.Document;
            var logicalData = { "BackgroundColor": [], "CharacterFormat": [], "ParagraphFormat": [], "Sections": [], "AbstractLists": [], "Lists": [] };
            logicalData.BackgroundColor = Document._SerializeBackgroundColor();
            logicalData.CharacterFormat = Document.CharacterFormat._SerializeCharacterFormat();
            logicalData.ParagraphFormat = Document.ParagraphFormat._SerializeParagraphFormat();
            var Sections = Document._SerializeDocument();
            logicalData.Sections = Sections.Sections;
            var AbstractLists = Document._SerializeAbstractList();
            logicalData.AbstractLists = AbstractLists;
            var Lists = Document._SerializeList();
            logicalData.Lists = Lists;
            return { "data": JSON.stringify(logicalData) };
        };
        DocumentEditor.prototype._getExtension = function (formatType) {
            switch (formatType) {
                case ej.DocumentEditor.FormatType.Docx:
                    return "docx";
                case ej.DocumentEditor.FormatType.Doc:
                    return "doc";
                case ej.DocumentEditor.FormatType.Rtf:
                    return "rtf";
                case ej.DocumentEditor.FormatType.Txt:
                    return "txt";
                case ej.DocumentEditor.FormatType.Html:
                    return "html";
                case ej.DocumentEditor.FormatType.WordML:
                    return "xml";
            }
            return "docx";
        };
        DocumentEditor.prototype.newDocument = function () {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined)
                return;
            this._documentEditorHelper.Document = this._createEmptyDocument();
        };
        DocumentEditor.prototype.load = function (path) {
            if (isIELowerVersion)
                return;
            var _ejDocumentEditor = this;
            this._documentEditorHelper._InitDocumentLoad();
            var formData = null;
            if (ej.browserInfo().name == "msie" && parseInt(ej.browserInfo().version) == 9) {
                formData = "";
            }
            else {
                formData = new FormData();
                formData.append("files", path);
            }
            $.ajax({
                type: "POST",
                async: true,
                processData: false,
                contentType: false,
                crossDomain: true,
                data: formData,
                url: this.model.importExportSettings.importUrl,
                dataType: "JSON",
                success: function (data) {
                    _ejDocumentEditor._loadDocument(data);
                },
            });
        };
        DocumentEditor.prototype.save = function (fileName, formatType) {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined)
                return;
            var expSettings = this.model.importExportSettings, attr, form, inputAttr, input, url, documentObj;
            url = this.model.importExportSettings.exportUrl;
            attr = { action: url, method: "post" };
            form = ej.buildTag("form", "", null, attr);
            documentObj = this._getExportProperties();
            inputAttr = { name: "DocumentData", type: "hidden", value: documentObj.data };
            input = ej.buildTag("input", "", null, inputAttr);
            form.append(input);
            inputAttr = { name: "FileName", type: "hidden", value: fileName };
            input = ej.buildTag("input", "", null, inputAttr);
            form.append(input);
            inputAttr = { name: "Format", type: "hidden", value: this._getExtension(formatType) };
            input = ej.buildTag("input", "", null, inputAttr);
            form.append(input);
            $("body").append(form);
            form.submit();
        };
        DocumentEditor.prototype.print = function () {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined)
                return;
            this._documentEditorHelper._Print();
        };
        DocumentEditor.prototype.cut = function () {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined
                || this._documentEditorHelper.IsReadOnlyMode || !this._documentEditorHelper.IsDocumentLoaded
                || this._documentEditorHelper.Selection == null || this._documentEditorHelper.Selection.IsCleared || this._documentEditorHelper.Selection.IsEmpty)
                return;
            this._documentEditorHelper.Selection._Cut();
        };
        DocumentEditor.prototype.copy = function () {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined
                || this._documentEditorHelper.Selection == null || this._documentEditorHelper.Selection.IsCleared || this._documentEditorHelper.Selection.IsEmpty)
                return;
            this._documentEditorHelper.Selection._Copy();
        };
        DocumentEditor.prototype.paste = function () {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined
                || this._documentEditorHelper.Selection == null || this._documentEditorHelper.isReadOnly || !this._documentEditorHelper.Selection.CanPaste)
                return;
            this._documentEditorHelper.Selection._PasteInternal();
        };
        DocumentEditor.prototype.canPaste = function () {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined
                || this._documentEditorHelper.Selection == null || this._documentEditorHelper.isReadOnly)
                return false;
            return this._documentEditorHelper.Selection.CanPaste;
        };
        DocumentEditor.prototype.setTimeoutForClipboardPaste = function (seconds) {
            if (isIELowerVersion || !(typeof (seconds) == "number") || !(seconds > 0) || this._documentEditorHelper == null || this._documentEditorHelper == undefined)
                return;
            this._documentEditorHelper._pasteTimeOut = seconds * 1000;
        };
        DocumentEditor.prototype.canUndo = function () {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined
                || this._documentEditorHelper.History == null || this._documentEditorHelper.History == undefined)
                return false;
            return this._documentEditorHelper.History.CanUndo;
        };
        DocumentEditor.prototype.canRedo = function () {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined
                || this._documentEditorHelper.History == null || this._documentEditorHelper.History == undefined)
                return false;
            return this._documentEditorHelper.History.CanRedo;
        };
        DocumentEditor.prototype.undo = function () {
            if (!this.canUndo())
                return;
            this._documentEditorHelper.history._Undo();
        };
        DocumentEditor.prototype.redo = function () {
            if (!this.canRedo())
                return;
            this._documentEditorHelper.History._Redo();
        };
        DocumentEditor.prototype.toggleBold = function () {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined || this._documentEditorHelper.isReadOnly || !this._documentEditorHelper.IsDocumentLoaded)
                return;
            this._documentEditorHelper.Selection._OnBold();
        };
        DocumentEditor.prototype.toggleItalic = function () {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined || this._documentEditorHelper.isReadOnly || !this._documentEditorHelper.IsDocumentLoaded)
                return;
            this._documentEditorHelper.Selection._OnItalic();
        };
        DocumentEditor.prototype.toggleUnderline = function (underline) {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined || this._documentEditorHelper.isReadOnly || !this._documentEditorHelper.IsDocumentLoaded)
                return;
            this._documentEditorHelper.Selection._ToggleUnderline(underline);
        };
        DocumentEditor.prototype.increaseIndent = function () {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined || this._documentEditorHelper.isReadOnly || !this._documentEditorHelper.IsDocumentLoaded)
                return;
            this._documentEditorHelper.Selection._OnLeftIndentInternal(this._documentEditorHelper.Document.DefaultTabWidth, true);
        };
        DocumentEditor.prototype.decreaseIndent = function () {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined || this._documentEditorHelper.isReadOnly || !this._documentEditorHelper.IsDocumentLoaded)
                return;
            this._documentEditorHelper.Selection._OnLeftIndentInternal(-this._documentEditorHelper.Document.DefaultTabWidth, true);
        };
        DocumentEditor.prototype.applyBullet = function (bullet, fontFamily) {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined || this._documentEditorHelper.IsReadOnly || !this._documentEditorHelper.IsDocumentLoaded)
                return;
            this._documentEditorHelper.Selection._ApplyBullet(bullet, fontFamily);
        };
        DocumentEditor.prototype.applyNumbering = function (numberFormat, listLevelPattern) {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined || this._documentEditorHelper.IsReadOnly || !this._documentEditorHelper.IsDocumentLoaded)
                return;
            this._documentEditorHelper.Selection._ApplyNumbering(numberFormat, listLevelPattern);
        };
        DocumentEditor.prototype.getEditingContextType = function () {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined)
                return ej.DocumentEditor.EditingContextType.Text;
            return this._documentEditorHelper.Selection.EditingContext.Type;
        };
        DocumentEditor.prototype.getStart = function () {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined)
                return "0;0;0";
            return this._documentEditorHelper.Selection._GetStart();
        };
        DocumentEditor.prototype.getEnd = function () {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined)
                return "0;0;0";
            return this._documentEditorHelper.Selection._GetEnd();
        };
        DocumentEditor.prototype.getDocumentStart = function () {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined)
                return "0;0;0";
            return this._documentEditorHelper._GetDocumentStart();
        };
        DocumentEditor.prototype.getDocumentEnd = function () {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined)
                return "0;0;1";
            return this._documentEditorHelper._GetDocumentEnd();
        };
        DocumentEditor.prototype.select = function (start, end) {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined)
                return;
            this._documentEditorHelper.Selection._SelectPositionBy(start, end);
        };
        DocumentEditor.prototype.insertText = function (text) {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined || this._documentEditorHelper.isReadOnly || !this._documentEditorHelper.IsDocumentLoaded)
                return;
            this._documentEditorHelper._InsertText(text);
        };
        DocumentEditor.prototype.insertImage = function (imageString, width, height) {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined || this._documentEditorHelper.isReadOnly || !this._documentEditorHelper.IsDocumentLoaded)
                return;
            this._documentEditorHelper._InsertPicture(imageString, width, height);
        };
        DocumentEditor.prototype.insertTable = function (rowCount, columnCount) {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined || this._documentEditorHelper.isReadOnly || !this._documentEditorHelper.IsDocumentLoaded)
                return;
            if (this._documentEditorHelper.Selection != null && !this._documentEditorHelper.Selection.IsCleared)
                this._documentEditorHelper._InsertTableInBlocks(rowCount, columnCount);
        };
        DocumentEditor.prototype.insertRow = function (rowPlacement) {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined || this._documentEditorHelper.isReadOnly || !this._documentEditorHelper.IsDocumentLoaded)
                return;
            if (this._documentEditorHelper.Selection != null && !this._documentEditorHelper.Selection.IsCleared && this._documentEditorHelper.Selection.EditingContext.Type == ej.DocumentEditor.EditingContextType.Table)
                this._documentEditorHelper._InsertRowInTable(rowPlacement);
        };
        DocumentEditor.prototype.insertColumn = function (columnPlacement) {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined || this._documentEditorHelper.isReadOnly || !this._documentEditorHelper.IsDocumentLoaded)
                return;
            if (this._documentEditorHelper.Selection != null && !this._documentEditorHelper.Selection.IsCleared && this._documentEditorHelper.Selection.EditingContext.Type == ej.DocumentEditor.EditingContextType.Table)
                this._documentEditorHelper._InsertColumnInTable(columnPlacement);
        };
        DocumentEditor.prototype.deleteTable = function () {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined || this._documentEditorHelper.isReadOnly || !this._documentEditorHelper.IsDocumentLoaded)
                return;
            if (this._documentEditorHelper.Selection != null && !this._documentEditorHelper.Selection.IsCleared && this._documentEditorHelper.Selection.Start != null && this._documentEditorHelper.Selection.Start.Paragraph != null && this._documentEditorHelper.Selection.Start.Paragraph.IsInsideTable)
                this._documentEditorHelper._DeleteTableFromBlocks();
        };
        DocumentEditor.prototype.deleteRow = function () {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined || this._documentEditorHelper.isReadOnly || !this._documentEditorHelper.IsDocumentLoaded)
                return;
            if (this._documentEditorHelper.Selection != null && !this._documentEditorHelper.Selection.IsCleared && this._documentEditorHelper.Selection.Start != null && this._documentEditorHelper.Selection.Start.Paragraph != null && this._documentEditorHelper.Selection.Start.Paragraph.IsInsideTable)
                this._documentEditorHelper._DeleteRowFromTable();
        };
        DocumentEditor.prototype.deleteColumn = function () {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined || this._documentEditorHelper.isReadOnly || !this._documentEditorHelper.IsDocumentLoaded)
                return;
            if (this._documentEditorHelper.Selection != null && !this._documentEditorHelper.Selection.IsCleared)
                this._documentEditorHelper._DeleteColumnFromTable();
        };
        DocumentEditor.prototype.isSelectionInComment = function () {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined)
                return false;
            return this._documentEditorHelper.Selection._IsInComment();
        };
        DocumentEditor.prototype.getCommentsCount = function () {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined)
                return 0;
            return this._documentEditorHelper.Document.Comments.Count;
        };
        DocumentEditor.prototype.addComment = function () {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined || this._documentEditorHelper.IsReadOnly || !this._documentEditorHelper.IsDocumentLoaded)
                return;
            if (!this._documentEditorHelper.isReadOnly && this._documentEditorHelper.LayoutType == ej.DocumentEditor.LayoutType.Pages && this._documentEditorHelper.Selection != null && !this._documentEditorHelper.Selection.IsCleared && !this._documentEditorHelper.Selection._IsInComment())
                this._documentEditorHelper._InsertComment();
        };
        DocumentEditor.prototype.deleteComment = function () {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined || this._documentEditorHelper.IsReadOnly || !this._documentEditorHelper.IsDocumentLoaded)
                return;
            if (!this._documentEditorHelper.isReadOnly && this._documentEditorHelper.Selection != null && !this._documentEditorHelper.Selection.IsCleared && this._documentEditorHelper.Selection._IsInComment())
                this._documentEditorHelper._DeleteComment();
        };
        DocumentEditor.prototype.deleteAllComments = function () {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined || this._documentEditorHelper.IsReadOnly || !this._documentEditorHelper.IsDocumentLoaded)
                return;
            if (!this._documentEditorHelper.isReadOnly && this._documentEditorHelper.Selection != null && !this._documentEditorHelper.Selection.IsCleared && this._documentEditorHelper.Document != null && this._documentEditorHelper.Document.Comments.Count > 0)
                this._documentEditorHelper._DeleteAllComments();
        };
        DocumentEditor.prototype.navigateToNextComment = function () {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined || this._documentEditorHelper.IsReadOnly || !this._documentEditorHelper.IsDocumentLoaded)
                return;
            if (this._documentEditorHelper.Selection != null && !this._documentEditorHelper.Selection.IsCleared && this._documentEditorHelper.Selection._IsInComment())
                this._documentEditorHelper._NavigateNextComment();
        };
        DocumentEditor.prototype.navigateToPreviousComment = function () {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined || this._documentEditorHelper.IsReadOnly || !this._documentEditorHelper.IsDocumentLoaded)
                return;
            if (this._documentEditorHelper.Selection != null && !this._documentEditorHelper.Selection.IsCleared && this._documentEditorHelper.Selection._IsInComment())
                this._documentEditorHelper._NavigatePreviousComment();
        };
        DocumentEditor.prototype.getSelectedText = function () {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined)
                return;
            return this._documentEditorHelper.Selection.Text;
        };
        DocumentEditor.prototype.find = function (text, findOption) {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined || !this._documentEditorHelper.IsDocumentLoaded)
                return false;
            if (findOption == null || findOption == undefined)
                findOption = ej.DocumentEditor.FindOptions.None;
            if (text != undefined && text != null && text != "")
                return this._documentEditorHelper._Find(text.toString(), findOption);
            return false;
        };
        DocumentEditor.prototype.findAll = function (text, findOption) {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined || !this._documentEditorHelper.IsDocumentLoaded)
                return;
            if (findOption == null || findOption == undefined)
                findOption = ej.DocumentEditor.FindOptions.None;
            this._documentEditorHelper.Viewer._ClearSearchHighlight();
            if (text != undefined && text != null && text != "")
                this._documentEditorHelper._FindAll(text.toString(), findOption);
            else if (this._documentEditorHelper.textSearchResults != null && this._documentEditorHelper.textSearchResults.Count > 0)
                this._documentEditorHelper.textSearchResults._ClearResults();
            return this._documentEditorHelper.textSearchResults != null && this._documentEditorHelper.textSearchResults.Count > 0 ? this._documentEditorHelper.textSearchResults.Count : 0;
        };
        DocumentEditor.prototype.replace = function (textToFind, findOption, textToReplace) {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined || this._documentEditorHelper.IsReadOnly || !this._documentEditorHelper.IsDocumentLoaded)
                return false;
            if (findOption == null || findOption == undefined)
                findOption = ej.DocumentEditor.FindOptions.None;
            return this._documentEditorHelper._Replace(textToFind, findOption, textToReplace);
        };
        DocumentEditor.prototype.replaceAll = function (textToFind, findOption, textToReplace) {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined || this._documentEditorHelper.IsReadOnly || !this._documentEditorHelper.IsDocumentLoaded)
                return 0;
            if (findOption == null || findOption == undefined)
                findOption = ej.DocumentEditor.FindOptions.None;
            return this._documentEditorHelper._ReplaceAll(textToFind, findOption, textToReplace);
        };
        DocumentEditor.prototype._navigateNextTextSearchResult = function () {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined || !this._documentEditorHelper.IsDocumentLoaded)
                return;
            if (this._documentEditorHelper.textSearchResults != null && this._documentEditorHelper.textSearchResults.Count > 0) {
                if (this._documentEditorHelper.textSearchResults.CurrentIndex < this._documentEditorHelper.textSearchResults.Count - 1) {
                    this._documentEditorHelper.textSearchResults.CurrentIndex++;
                }
                else {
                    this._documentEditorHelper.textSearchResults.CurrentIndex = 0;
                }
                this._documentEditorHelper.textSearchResults.CurrentSearchResult._Navigate();
                return { "count": this._documentEditorHelper.textSearchResults.Count, "currentIndex": this._documentEditorHelper.textSearchResults.CurrentIndex + 1 };
            }
            return { "count": 0, "currentIndex": -1 };
        };
        DocumentEditor.prototype._navigatePreviousTextSearchResult = function () {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined || !this._documentEditorHelper.IsDocumentLoaded)
                return;
            if (this._documentEditorHelper.textSearchResults != null && this._documentEditorHelper.textSearchResults.Count > 0) {
                if (this._documentEditorHelper.textSearchResults.CurrentIndex > 0) {
                    this._documentEditorHelper.textSearchResults.CurrentIndex--;
                }
                else {
                    this._documentEditorHelper.textSearchResults.CurrentIndex = this._documentEditorHelper.textSearchResults.Count - 1;
                }
                this._documentEditorHelper.textSearchResults.CurrentSearchResult._Navigate();
                return { "count": this._documentEditorHelper.textSearchResults.Count, "currentIndex": this._documentEditorHelper.textSearchResults.CurrentIndex + 1 };
            }
            return { "count": 0, "currentIndex": -1 };
        };
        DocumentEditor.prototype.showOptionsPane = function () {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined || !this._documentEditorHelper.IsDocumentLoaded)
                return;
            if (this._documentEditorHelper.Viewer != null && this._documentEditorHelper.Viewer != undefined)
                this._documentEditorHelper.Viewer._ShowHideOptionsPane(true);
        };
        DocumentEditor.prototype.showHyperlinkDialog = function () {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined || this._documentEditorHelper.IsReadOnlyMode || !this._documentEditorHelper.IsDocumentLoaded)
                return;
            if (this._documentEditorHelper.Selection != null && !this._documentEditorHelper.Selection.IsCleared && this._documentEditorHelper.Selection.Start.Paragraph != null && this._documentEditorHelper.Selection.End.Paragraph != null
                && this._documentEditorHelper.Selection.Start.Paragraph.AssociatedCell == this._documentEditorHelper.Selection.End.Paragraph.AssociatedCell && this._documentEditorHelper.Selection.SelectionRanges.Count == 1)
                this._documentEditorHelper.Viewer._ShowHyperlinkDialog();
        };
        DocumentEditor.prototype.showFindAndReplaceDialog = function (isReplace) {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined || !this._documentEditorHelper.IsDocumentLoaded)
                return;
            if (!(isReplace && this._documentEditorHelper.IsReadOnlyMode))
                this._documentEditorHelper.Viewer._ShowFindAndReplaceDialog(isReplace);
        };
        DocumentEditor.prototype.showFontDialog = function () {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined || this._documentEditorHelper.IsReadOnlyMode || !this._documentEditorHelper.IsDocumentLoaded)
                return;
            this._documentEditorHelper.Viewer._ShowFontDialog();
        };
        DocumentEditor.prototype.showParagraphDialog = function () {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined || this._documentEditorHelper.IsReadOnlyMode || !this._documentEditorHelper.IsDocumentLoaded)
                return;
            this._documentEditorHelper.Viewer._ShowParagraphDialog();
        };
        DocumentEditor.prototype.showInsertTableDialog = function () {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined || this._documentEditorHelper.IsReadOnlyMode || !this._documentEditorHelper.IsDocumentLoaded)
                return;
            if (this._documentEditorHelper.Selection != null && !this._documentEditorHelper.Selection.IsCleared)
                this._documentEditorHelper.Viewer._ShowTableDialog();
        };
        DocumentEditor.prototype.showTablePropertiesDialog = function () {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined || this._documentEditorHelper.IsReadOnlyMode || !this._documentEditorHelper.IsDocumentLoaded)
                return;
            if (this._documentEditorHelper.Selection != null && !this._documentEditorHelper.Selection.IsCleared && this._documentEditorHelper.Selection.EditingContext.Type == ej.DocumentEditor.EditingContextType.Table)
                this._documentEditorHelper.Viewer._ShowTablePropertiesDialog();
        };
        DocumentEditor.prototype.showCellMarginsDialog = function () {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined || this._documentEditorHelper.IsReadOnlyMode || !this._documentEditorHelper.IsDocumentLoaded)
                return;
            if (this._documentEditorHelper.Selection != null && !this._documentEditorHelper.Selection.IsCleared && this._documentEditorHelper.Selection.EditingContext.Type == ej.DocumentEditor.EditingContextType.Table)
                this._documentEditorHelper.Viewer._ShowCellMarginsDialog();
        };
        DocumentEditor.prototype.getCurrentPageNumber = function () {
            if (isIELowerVersion || !this._documentEditorHelper.IsDocumentLoaded)
                return 1;
            return this._documentEditorHelper.CurrentPageNumber;
        };
        DocumentEditor.prototype.getPageCount = function () {
            if (isIELowerVersion || !this._documentEditorHelper.IsDocumentLoaded)
                return 1;
            return this._documentEditorHelper.PageCount;
        };
        DocumentEditor.prototype.getZoomFactor = function () {
            if (isIELowerVersion)
                return 1;
            return this._documentEditorHelper.ZoomFactor;
        };
        DocumentEditor.prototype.setZoomFactor = function (value) {
            if (isIELowerVersion)
                return;
            this._documentEditorHelper.ZoomFactor = value;
        };
        DocumentEditor.prototype.fitPage = function (pageFitType) {
            if (isIELowerVersion || this._documentEditorHelper == null || this._documentEditorHelper == undefined)
                return;
            this._documentEditorHelper._FitPage(pageFitType);
        };
        return DocumentEditor;
    }(ej.WidgetBase));
    ej.widget("ejDocumentEditor", "ej.DocumentEditor", new DocumentEditor());
})(jQuery);
ej.DocumentEditor.LayoutType = {
    Pages: 0,
    Continuous: 1
};
ej.DocumentEditor.FormatType = {
    Doc: 0,
    Docx: 1,
    Html: 2,
    Rtf: 3,
    Txt: 4,
    WordML: 5,
};
ej.DocumentEditor.EditingContextType = {
    Text: 0,
    Table: 1,
};
ej.DocumentEditor.PageFitType = {
    None: 0,
    FitFullPage: 1,
    FitMultiplePages: 2,
    FitPageWidth: 3
};
ej.DocumentEditor.StrikeThrough = {
    None: 0,
    SingleStrike: 1,
    DoubleStrike: 2
};
ej.DocumentEditor.BaselineAlignment = {
    Normal: 0,
    Superscript: 1,
    Subscript: 2
};
ej.DocumentEditor.Underline = {
    None: 0,
    Single: 1,
    Words: 2,
    Double: 3,
    Dotted: 4,
    Thick: 6,
    Dash: 7,
    DashLong: 39,
    DotDash: 9,
    DotDotDash: 10,
    Wavy: 11,
    DottedHeavy: 20,
    DashHeavy: 23,
    DashLongHeavy: 55,
    DotDashHeavy: 25,
    DotDotDashHeavy: 26,
    WavyHeavy: 27,
    WavyDouble: 43
};
ej.DocumentEditor.HighlightColor = {
    NoColor: 0,
    Yellow: 1,
    BrightGreen: 2,
    Turquoise: 3,
    Pink: 4,
    Blue: 5,
    Red: 6,
    DarkBlue: 7,
    Teal: 8,
    Green: 9,
    Violet: 10,
    DarkRed: 11,
    DarkYellow: 12,
    Gray50: 13,
    Gray25: 14,
    Black: 15
};
ej.DocumentEditor.LineSpacingType = {
    AtLeast: 0,
    Exactly: 1,
    Multiple: 2
};
ej.DocumentEditor.TextAlignment = {
    Center: 0,
    Left: 1,
    Right: 2,
    Justify: 3,
};
ej.DocumentEditor.FindOptions = {
    None: 0,
    WholeWord: 1,
    CaseSensitive: 2,
    CaseSensitiveWholeWord: 3
};
ej.DocumentEditor.RowPlacement = {
    Above: 0,
    Below: 1
};
ej.DocumentEditor.ColumnPlacement = {
    Left: 0,
    Right: 1
};
ej.DocumentEditor.TableAlignment = {
    Left: 0,
    Center: 1,
    Right: 2
};
ej.DocumentEditor.WidthType = {
    Auto: 0,
    Percent: 1,
    Pixel: 2,
};
ej.DocumentEditor.CellVerticalAlignment = {
    Top: 0,
    Center: 1,
    Bottom: 2
};
ej.DocumentEditor.HeightType = {
    Auto: 0,
    Atleast: 1,
    Exactly: 2,
};
ej.DocumentEditor.ListLevelPattern = {
    Arabic: 0,
    UpRoman: 1,
    LowRoman: 2,
    UpLetter: 3,
    LowLetter: 4,
    Ordinal: 5,
    Number: 6,
    OrdinalText: 7,
    LeadingZero: 0x16,
    Bullet: 0x17,
    FarEast: 20,
    Special: 0x3a,
    None: 0xff
};
