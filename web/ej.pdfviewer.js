/**
* @fileOverview Plugin to style the Html PDFViewer elements
* @copyright Copyright Syncfusion Inc. 2001 - 2013. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author &lt;a href="mailto:licensing@syncfusion.com"&gt;Syncfusion Inc&lt;/a&gt;
*/
(function ($, ej, undefined) {
    ej.widget("ejPdfViewer", "ej.PdfViewer", {

        _rootCSS: "e-pdfviewer",
        _requiresID: true,
        element: null,
        model: null,
        validTags: ["div"],

        //#region Defaults
        defaults: {
            serviceUrl: "",
            hyperlinkOpenState: 1,
            serverActionSettings: {
                load: "Load",
                fileUpload: "FileUpload",
                print: "Load",
                download: "Download",
                unload: "Unload"
            },
            documentPath: null,
            toolbarSettings: {
                toolbarItem: 1 | 2 | 4 | 8 | 16 | 32 | 64 | 128,
                showTooltip: true
            },
            enableHyperlink: true,
            enableTextSelection: true,
            pdfService: 1,
            locale: "en-US",
            interactionMode: 1,
            bufferingMode: 1,
            pageChange: "",
            documentLoad: "",
            hyperlinkClick: "",
            beforePrint: "",
            afterPrint: "",
            zoomchange: "",
            bufferStart: "",
            bufferEnd: "",
            annotationAdd: "",
            annotationRemove: "",
            annotationPropertiesChange: "",
            annotationResize: "",
            signatureDelete: "",
            signatureAdd: "",
            signatureResize: "",
            signaturePropertiesChange: "",
            isResponsive: true,
            pageClick: "",
            allowClientBuffering: false,
            documentUnload: "",
            ajaxRequestFailure: "",
            annotationType: null,
            enableTextMarkupAnnotations: true,
            enableHighlightAnnotation: true,
            enableStrikethroughAnnotation: true,
            enableUnderlineAnnotation: true,
            enableSignature: true,
            shouldFlattenDocument: false,
            downloadStart: "",
            downloadEnd: "",
            strikethroughSettings: {
                color: "#ff0000",
                author: "Guest",
                opacity: 1,
                subject: "Strikethrough",
                modifiedDate: null,
                isLocked: false
            },
            underlineSettings: {
                color: "#00ff00",
                author: "Guest",
                opacity: 1,
                subject: "Underline",
                modifiedDate: null,
                isLocked: false
            },
            highlightSettings: {
                color: "#ffff00",
                author: "Guest",
                opacity: 1,
                subject: "Highlight",
                modifiedDate: null,
                isLocked: false
            },
            signatureSettings: {
                color: "#000000",
                opacity: 1,
            },
            textSelectionContextMenu: {
                isEnable: true,
                isCopyEnable: true,
                isSearchEnable: true,
                isHighlightEnable: true,
                isStrikeoutEnable: true,
            },
            annotationContextMenu: {
                isEnable: true,
                isPopupEnable: true,
                isDeleteEnable: true,
                isPropertiesEnable: true,
            }
        },
        dataTypes: {
            toolbarSettings: "data",
        },
        //#endregion

        //#region Local Members
        _isToolbarClick: false,
        _curYPos: 0,
        _curXPos: 0,
        _curDown: false,
        _pageModel: null,
        _currentPage: 1,
        _zoomLevel: 2,
        _preZoomVal: 1,
        _fitType: null,
        _higherZoomIndex: 0,
        _lowerZoomIndex: 0,
        _actionUrl: null,
        _isDevice: false,
        _contextMenu: false,
        _zoomVal: 1,
        _currentPageBackup: 0,
        _zoomValBackup: 0,
        _zoomLevelBackup: 0,
        _fitTypeBackup: null,
        _scrollTop: 0,
        _bgRenderTimer: 0,
        _renderCount: 0,
        _prevDiff: -1,
        _pointerCount: 0,
        _searchText: null,
        _selectedIndex: 0,
        _searchPageIndex: 0,
        _isRenderedByPinch: false,
        _isPinchLimitReached: false,
        _isRerenderCanvasCreated: false,
        _isPrinting: false,
        _isContainImage: false,
        _isPercentHeight: -1,
        _isPercentWidth: -1,
        _isHeight: false,
        _isWidth: false,
        _isFindboxPresent: false,
        _isTextSearch: false,
        _isTextHighlighted: false,
        _isRequestFired: false,
        _isPageScrollHighlight: false,
        _isPageScrolledForSearch: false,
        _searchAjaxRequestState: null,
        _isPrevSearch: false,
        _isMatchCase: false,
        _isPrintHidden: false,
        _isNavigationHidden: false,
        _isMagnificationHidden: false,
        _isDownloadHidden: false,
        _isTextSearchHidden: false,
        _isZoomCntlHidden: false,
        _isDownloadCntlHidden: false,
        _isToolbarHidden: false,
        _isSignatureHidden: false,
        _viewerAction: {
            getPageModel: 'GetPageModel',
        },
        _scrollTimer: null,
        _isDestroyed: false,
        _pdfService: null,
        _toolbar: null,
        _printIframe: null,
        _currentPrintPage: 0,
        _abortPrinting: false,
        _isWindowResizing: false,
        _ejViewerInstance: null,
        _isAutoZoom: false,
        _isAutoSelected: false,
        _ejDropDownInstance: null,
        _clientx: null,
        _clienty: null,
        _curPosX: null,
        _curPosY: null,
        _previousBounds: null,
        _topValue: false,
        _clearText: false,
        _timers: null,
        _scrollMove: null,
        _rangePosition: null,
        _selectedRanges: null,
        _longTouch: false,
        _ranges: false,
        _touchcontextMenu: false,
        _selectionNodes: null,
        _selectionRange: null,
        _touched: false,
        _lockTimer: null,
        _timer: null,
        _displaySearch: false,
        _isCopyRestrict: false,
        _isPrintRestrict: false,
        _isPageExtraction: false,
        _isFormFieldsDisabled: false,
        _isTargetPage: false,
        _targetPage: 0,
        _isBuffering: false,
        _isBufferStart: false,
        _pagesGot: null,
        _isPrintingProcess: false,
        _isRequestSuccess: false,
        _fileId: null,
        _isFormFields: false,
        _imageObj: null,
        _isJsondataAvailable: false,
        _highestWidth: 0,
        _horizontalResolution: null,
        _isAsynchronousDownload: true,
        _searchedText: null,
        _annotationActive: false,
        _isHighlight: false,
        _isUnderline: false,
        _isStrikeout: false,
        _drawColor: null,
        _selectedAnnotation: null,
        _selectedAnnotationObject: null,
        _isPopupNoteFocused: false,
        _colorpickerObject: null,
        _toolbarColorpickerObject: null,
        _isBackwardSelection: false,
        _isPropertiesWindowOpen: false,
        _isAnnotationSelected: false,
        _currentAnnotationRectangle: [],
        _currentAnnotationRectangleBackup: [],
        _annotationBackupNoteSave: [],
        _isPopupNoteVisible: false,
        _isUnderlineEnabled: false,
        _isHighlightEnabled: false,
        _isStrikeOutEnabled: false,
        _isContextMenuPresent: false,
        _isDefaultColorSet: false,
        _isTextSelection: false,
        _colorPickerStatus: null,
        _annotationsDeletedNo: null,
        _selectedValue: null,
        _highestHeight: 0,
        _removeSearch: false,
        _ajaxInProgress: false,
        _isNonBreackingCharacter: false,
        _mouseDetection: false,
        _oldX: null,
        _mouseX: null,
        _oldY: null,
        _mouseY: null,
        _newObject: [],
        _newx: null,
        _newy: null,
        _outputString: "",
        _completeSign: [],
        _outputPath: {},
        _valueChanges: {},
        _totalSignature: [],
        _isCanvasClicked: false,
        _isCanasResized: false,
        _tempCanvas: null,
        _previousZoomValue: 1,
        _canvasTopPosition: 0,
        _canvasLeftPosition: 0,
        _newpoints: [],
        _maxpointsX: 0,
        _minpointsX: 0,
        _maxpointsY: 0,
        _minpointsY: 0,
        _controlSelectionRange: null,
        _selectionObject: null,
        _cancelDownloads: false,
        _downloadfileName: null,
        _signatureLayer: [],
        _renderedCanvasList: null,
        _textureobj: [],
        //#endregion

        //#region public members
        pageCount: 0,
        currentPageNumber: 1,
        zoomPercentage: 100,
        fileName: null,
        isDocumentEdited: false,
        //#endregion

        //#region Initialization
        _init: function () {
            this._actionUrl = this.model.serviceUrl + "/" + this.model.serverActionSettings.load;
            this._renderViewer();
            this._initViewer();
            this._createContextMenu();
            this._createHighlightContextMenu();
            this._createWaterDropDiv();
            this._createTouchContextMenu();
            this._createPopupMenu();
            this._createNote();
            this._createPropertiesMenu();
            this._createColorPalette();
            this._createSignatureControl();
            var colorPicker = document.getElementById(this._id + '_pdfviewer_colorpicker');
            if (colorPicker) {
                colorPicker.style.display = 'none';
            }
            this._isToolbarColorPicker = false;
            this._ejDropDownInstance = $('#' + this._id + '_toolbar_zoomSelection').data("ejDropDownList");
            this._getPdfService(this.model.pdfService);
            if (this.model.serviceUrl) {
                var jsonResult = new Object();
                jsonResult["viewerAction"] = "GetPageModel";
                jsonResult["controlId"] = this._id;
                jsonResult["pageindex"] = "1";
                jsonResult["isInitialLoading"] = "true";
                if (this.model.allowClientBuffering) {
                    jsonResult["enableOfflineMode"] = true;
                    if (this.model.bufferingMode == ej.PdfViewer.BufferingMode.Default)
                        jsonResult["bufferingMode"] = "default";
                    else if (this.model.bufferingMode == ej.PdfViewer.BufferingMode.Complete)
                        jsonResult["bufferingMode"] = "complete";
                    if (!this._isPrintingProcess) {
                        jsonResult["isPageScrolled"] = false;
                    }
                }

                if (this.model.documentPath) {
                    var documentPath = this.model.documentPath;
                    var base64String = documentPath.split("base64,")[1];
                    var isNotFileName = false; var isFilePath = false;
                    if (!base64String) {
                        //For handling File path
                        if (this.model.documentPath.indexOf('\\') != -1 || this.model.documentPath.indexOf('/') != -1) {
                            isNotFileName = true;
                            isFilePath = true;
                            if (!this.model.documentPath.toLowerCase().endsWith('.pdf')) {
                                documentPath = this.model.documentPath + '.pdf';
                            }
                        } else {
                            var password = documentPath.split(',');
                            if (password.length > 1) {
                                jsonResult["newFileName"] = password[1];
                                jsonResult["password"] = password[0];
                            } else {
                                jsonResult["newFileName"] = documentPath;
                            }
                            this._fileName = jsonResult["newFileName"];
                        }
                    }
                    jsonResult["file"] = documentPath;
                }
                jsonResult["id"] = this._createGUID();
                this._fileId = jsonResult["id"];
                if (!this.model.allowClientBuffering) {
                    if (this._pdfService == ej.PdfViewer.PdfService.Local)
                        this._doAjaxPost("POST", this._actionUrl, JSON.stringify(jsonResult), "_getPageModel");
                    else
                        this._doAjaxPost("POST", this.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }), "_getPageModel");
                } else {
                    if (this.model.bufferingMode == ej.PdfViewer.BufferingMode.Default) {
                        if (this._pdfService == ej.PdfViewer.PdfService.Local)
                            this._doAjaxPost("POST", this._actionUrl, JSON.stringify(jsonResult), "_getPageModel", true);
                        else
                            this._doAjaxPost("POST", this.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }), "_getPageModel", true);
                    } else if (this.model.bufferingMode == ej.PdfViewer.BufferingMode.Complete) {
                        if (this._pdfService == ej.PdfViewer.PdfService.Local)
                            this._doAjaxPost("POST", this._actionUrl, JSON.stringify(jsonResult), "_getPageModel");
                        else
                            this._doAjaxPost("POST", this.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }), "_getPageModel");
                    }
                }
            }
            this._printIframe = document.createElement("iframe");
        },

        _getPdfService: function (isLocal) {
            if (isLocal == 1)
                this._pdfService = ej.PdfViewer.PdfService.Local;
            else
                this._pdfService = ej.PdfViewer.PdfService.Remote;
        },

        _initViewer: function () {
            this._wireEvents();
            this._initToolbar();
            this._currentPage = 1;
            this._textMarkupAnnotationList = new Array();
            this._newAnnotationList = new Array();
            this._colorModifiedAnnotationList = new Array();
            this._existingAnnotationsModified = new Array();
            this._deletedAnnotationList = new Array();
            this._undoAnnotationCollection = new Array();
            this._redoAnnotationCollection = new Array();
            this._deletedAnnotationCollection = new Array();
            this._recentOperation = new Array();
            this._annotationsDeletedNo = new Array();
            this._redoActions = new Array();
            this._totalAnnotations = new Array();
            var tbSettings = this.model.toolbarSettings;
            if (!tbSettings.templateId) {
                this._showToolbar(true);
                this._showPrintButton(tbSettings.toolbarItem & ej.PdfViewer.ToolbarItems.PrintTools);
                this._showZoomControl(tbSettings.toolbarItem & ej.PdfViewer.ToolbarItems.MagnificationTools);
                this._showFittoPage(tbSettings.toolbarItem & ej.PdfViewer.ToolbarItems.MagnificationTools);
                this._showPageNavigationControls(tbSettings.toolbarItem & ej.PdfViewer.ToolbarItems.PageNavigationTools);
                this._showDownloadButton(tbSettings.toolbarItem & ej.PdfViewer.ToolbarItems.DownloadTool);
                this._showTextSearchButton(tbSettings.toolbarItem & ej.PdfViewer.ToolbarItems.TextSearchTool);
                this._showTextMarkupButtons(tbSettings.toolbarItem & ej.PdfViewer.ToolbarItems.TextMarkupAnnotationTools);
                this._showSignatureButtons(tbSettings.toolbarItem & ej.PdfViewer.ToolbarItems.SignatureTool);
                this._showSelectionButtons(tbSettings.toolbarItem & ej.PdfViewer.ToolbarItems.SelectionTool)
            }
            this._showViewerBlock(false);
            this._setContainerSize();
            this._showloadingIndicator(true);
            this._on($('#' + this._id + 'e-pdf-viewer'), "keydown", this._keyboardShortcutFind);
        },

        _unLoad: function () {
            if (this._ajaxRequestState != null) {
                this._ajaxRequestState.abort();
                this._ajaxRequestState = null;
            }
            var proxy = this;
            if (this.pageCount != 0) {
                $.ajax({
                    type: "POST",
                    url: this.model.serviceUrl + '/' + this.model.serverActionSettings.unload,
                    crossDomain: true,
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    traditional: true,
                    error: function (msg, textStatus, errorThrown) {
                        proxy._raiseClientEvent("ajaxRequestFailure", msg.responseText);
                    }
                });
            }
            $('#' + this._id + '_toolbarContainer span.e-pdfviewer-labelpageno').html(" / " + "0");
            $('#' + this._id + '_txtpageNo').val(0);
            this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_fitWidth');
            this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_fitPage');
            this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_zoomin');
            this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_zoomout');
            this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_zoom');
            this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_gotonext');
            this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_gotoprevious');
            this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_Print');
            this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_download');
            this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_search');
            this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_highlight');
            this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_strikeout');
            this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_underline');
            this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_signature');
            this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_select');
            this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_scroll');
            var zoomddl = $('#' + this._id + '_toolbar_zoomSelection').data('ejDropDownList');
            zoomddl._selectItemByIndex(0);
            zoomddl.disable();
            clearTimeout(this._scrollTimer);
            var count = this._canvascount;
            while (count >= 1) {
                $('#' + this._id + 'pageDiv_' + count).remove();
                $('#' + this._id + 'selectioncanvas_' + count).remove();
                count--;
            }
            if (this._renderedCanvasList)
                this._renderedCanvasList.length = 0;
            if (this._rerenderCanvasList)
                this._rerenderCanvasList.length = 0;
            if (this._pageContents)
                this._pageContents = null;
            this._currentPage = 1;
            this._totalPages = 0;
            this._showloadingIndicator(false);
            this._showPageLoadingIndicator(false);
            this._raiseClientEvent("documentUnload", null);
        },

        _destroy: function () {
            this._isDestroyed = true;
            $('#' + this._id + '_toolbarContainer span.e-pdfviewer-labelpageno').html(" / " + 0);
            $('#' + this._id + '_txtpageNo').val(0);
            clearTimeout(this._scrollTimer);
            this._unwireEvents();
            var count = this._canvascount;
            while (count >= 1) {
                $('#' + this._id + 'pageDiv_' + count).remove();
                $('#' + this._id + 'selectioncanvas_' + count).remove();
                count--;
            }
            $("#" + this._id + "_PropertiesDialogTab").data('ejTab')._destroy();
            $('#' + this._id + "_signatureContainerDialogTab").data('ejDialog')._destroy();
            $('#' + this._id + '_pdfviewer_colorpicker').data('ejColorPicker')._destroy();
            $('#' + this._id + '_colorpicker').data('ejColorPicker')._destroy();
            $('#' + this._id + '_containerDialogTab').data('ejDialog')._destroy();
            $('#' + this._id + '_pdfviewer_colorpicker_Presets').parent().remove();
            $('#' + this._id + '_signatureContainerDialogTab').remove();
            $('#' + this._id + '_containerDialogTab').remove();
            $('#' + this._id + '_pageviewContainer').remove();
            $('#' + this._id + '_toolbar_zoomSelection').data('ejDropDownList')._destroy();
            $('#' + this._id + '_pdfviewer_searchbox').data('ejToolbar')._destroy();
            this._toolbar._destroy();
            $('#' + this._id + '_toolbarContainer').remove();
            $('#' + this._id + '_viewerContainer').remove();
            $('#' + this._id + '_viewBlockContainer').remove();
            $('#' + this._id + '_rptTooltip').remove();
            $('#' + this._id + '_loadingIndicator_WaitingPopup').remove();
            $('#' + this._id + '_viewerContainer_WaitingPopup').remove();
            $('#' + this._id + '_WaitingPopup').remove();

            $(this.element).find('.e-pdfviewer-viewer').remove();
            this.element.html("");
            var cloneElement = $(this.element).clone();
            cloneElement.removeClass('e-pdfviewer e-js');
            this.element.replaceWith(cloneElement);
            this._renderedCanvasList.length = 0;
            this._raiseClientEvent("destroy", null);
        },
        //#endregion

        //-------------------- Render the pdfviewer Ctrl [start] -------------------------//

        _renderToolTip: function () {
            var $divTooltip = ej.buildTag("div.e-pdfviewer-tbdiv e-pdfviewer-tooltip", "", { 'display': 'none', 'min-width': '200px', 'width': '' }, { 'id': this._id + '_rptTooltip' });
            var $tooltipHeader = ej.buildTag("span.e-pdfviewer-headerspan", "", { 'display': 'block' }, { 'id': this._id + '_rptTooltip_Header' });
            var $tooltipContent = ej.buildTag("span.e-pdfviewer-contentspan", "", { 'display': 'block' }, { 'id': this._id + '_rptTooltip_Content' });
            $divTooltip.append($tooltipHeader);
            $divTooltip.append($tooltipContent);
            return $divTooltip;
        },

        _renderToolBar: function (targetTag) {
            if (!this.model.toolbarSettings.templateId) {
                var div = ej.buildTag("div.e-pdfviewer-toolbarcontainer .e-pdfviewer-viewer", "", { 'width': '100%' }, { 'id': this._id + '_toolbarContainer' });
                targetTag.append(div);

                if (this._isDevice) {
                    var $ultoolbaritems = ej.buildTag("ul.e-pdfviewer-toolbarul", "", {});
                    this._appendToolbarItems($ultoolbaritems, 'zoomin');
                    this._appendToolbarItems($ultoolbaritems, 'zoomout');
                    this._appendToolbarItems($ultoolbaritems, 'fitWidth');
                    this._appendToolbarItems($ultoolbaritems, 'fitPage');
                    div.append($ultoolbaritems);
                } else {
                    var $ulnavigate = ej.buildTag("ul.e-pdfviewer-toolbarul", "", { 'padding-right': '10px' }, {});
                    this._appendToolbarItems($ulnavigate, 'gotoprevious');
                    this._appendToolbarItems($ulnavigate, 'gotonext');
                    this._appendToolbarItems($ulnavigate, 'gotopage');
                    div.append($ulnavigate);

                    var $ulzoom = ej.buildTag("ul.e-pdfviewer-toolbarul", "", { 'padding-right': '10px' }, { 'id': this._id + '_pdfviewer_zoomul' });
                    this._appendToolbarItems($ulzoom, 'zoomin');
                    this._appendToolbarItems($ulzoom, 'zoomout');
                    this._appendToolbarItems($ulzoom, 'zoom');
                    //Appending the fitWidth and the fitPage buttons to the toolbar
                    this._appendToolbarItems($ulzoom, 'fitWidth');
                    this._appendToolbarItems($ulzoom, 'fitPage');
                    div.append($ulzoom);

                    var $ultextmarkup = ej.buildTag("ul.e-pdfviewer-toolbarul", "", { 'padding-right': '10px' }, { 'id': this._id + '_pdfviewer_textmarkupul' });
                    this._appendToolbarItems($ultextmarkup, 'underline');
                    this._appendToolbarItems($ultextmarkup, 'strikeout');
                    this._appendToolbarItems($ultextmarkup, 'highlight');
                    div.append($ultextmarkup);

                    var $ulsignature = ej.buildTag("ul.e-pdfviewer-toolbarul", "", { 'padding-right': '10px' }, { 'id': this._id + '_pdfviewer_signatureul' });
                    this._appendToolbarItems($ulsignature, 'signature');
                    div.append($ulsignature);

                    var $ulselect = ej.buildTag("ul.e-pdfviewer-toolbarul", "", { 'padding-right': '10px' }, { 'id': this._id + '_pdfviewer_selectul' });
                    this._appendToolbarItems($ulselect, 'selection');
                    this._appendToolbarItems($ulselect, 'scrolling');
                    div.append($ulselect);

                    var $uldownload = ej.buildTag("ul.e-pdfviewer-toolbarul", "", { 'float': 'right' }, { 'id': this._id + '_pdfviewer_downloadul' });
                    this._appendToolbarItems($uldownload, 'download');
                    div.append($uldownload);

                    var $ulprintExport = ej.buildTag("ul.e-pdfviewer-toolbarul", "", { 'float': 'right' }, { 'id': this._id + '_pdfviewer_printul' });
                    this._appendToolbarItems($ulprintExport, 'print');
                    div.append($ulprintExport);

                    var $ulsearch = ej.buildTag("ul.e-pdfviewer-toolbarul", "", { 'float': 'right' }, { 'id': this._id + '_pdfviewer_searchul' });
                    this._appendToolbarItems($ulsearch, 'search');
                    div.append($ulsearch);
                    $('#' + this._id + '_toolbar_zoomSelection').ejDropDownList({ height: "27px", width: "75px", cssClass: "e-pdfviewer-ddl", change: this._zoomValChange, selectedItem: 0 });
                }
                div.ejToolbar({ enableSeparator: !this._isDevice, click: $.proxy(this._toolbarClick, this), itemHover: $.proxy(this._toolbarHover, this), isResponsive: true, overflowClose: $.proxy(this._overflowToolbarClose, this) });
                this._toolbar = $('#' + this._id + '_toolbarContainer').data('ejToolbar');
                $('#' + this._id + '_toolbarContainer_hiddenlist').removeClass("e-responsive-toolbar").addClass("e-pdfviewer-responsivesecondarytoolbar");
                $('#' + this._id + '_pdfviewer_searchul').removeClass('e-separator');
                $('#' + this._id + '_pdfviewer_printul').removeClass('e-separator');
                $('#' + this._id + '_pdfviewer_signatureul').removeClass('e-separator');
                $('#' + this._id + '_pdfviewer_selectul').removeClass('e-separator');
                $('#' + this._id + '_pdfviewer_downloadul').removeClass('e-separator');
                $('#' + this._id + '_toolbarContainer_hiddenlist').removeClass("e-toolbarspan");
            } else {
                var templateDiv = document.getElementById(this.model.toolbarSettings.templateId);
                targetTag.append(templateDiv);
                templateDiv.ejToolbar({ enableSeparator: true, height: templateDiv.height(), click: this.model.toolbarSettings.click, isResponsive: true });
                templateDiv.css('display', 'block');
            }
        },

        _appendToolbarItems: function (litag, eletype) {
            var $divouter;
            var localeObj = ej.PdfViewer.Locale[this.model.locale] ? ej.PdfViewer.Locale[this.model.locale] : ej.PdfViewer.Locale["default"];
            switch (eletype) {
                case 'print':
                    $divouter = ej.buildTag("li.e-pdfviewer-toolbarli", "", {}, { 'id': this._id + '_pdfviewer_toolbar_Print' });
                    var $spanprint = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-print", "", {}, { 'id': this._id + '_toolbar_Print' });
                    $divouter.append($spanprint);
                    break;
                case 'download':
                    $divouter = ej.buildTag("li.e-pdfviewer-toolbarli", "", {}, { 'id': this._id + '_pdfviewer_toolbar_download' });
                    var $spandownload = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-download", "", {}, { 'id': this._id + '_toolbar_download' });
                    $divouter.append($spandownload);
                    break;
                case 'gotofirst':
                    $divouter = ej.buildTag("li.e-pdfviewer-toolbarli", "", {}, { 'id': this._id + '_pdfviewer_toolbar_gotofirst' });
                    var $spangotofirst = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-gotofirst", "", {});
                    $divouter.append($spangotofirst);
                    break;
                case 'gotolast':
                    $divouter = ej.buildTag("li.e-pdfviewer-toolbarli", "", {}, { 'id': this._id + '_pdfviewer_toolbar_gotolast' });
                    var $spangotolast = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-gotolast", "", {});
                    $divouter.append($spangotolast);
                    break;
                case 'gotonext':
                    $divouter = ej.buildTag("li.e-pdfviewer-toolbarli", "", {}, { 'id': this._id + '_pdfviewer_toolbar_gotonext' });
                    var $spangotonext = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-gotonext", "", {});
                    $divouter.append($spangotonext);
                    break;
                case 'gotoprevious':
                    $divouter = ej.buildTag("li.e-pdfviewer-toolbarli", "", {}, { 'id': this._id + '_pdfviewer_toolbar_gotoprevious' });
                    var $spangotoprevious = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-gotoprevious", "", {});
                    $divouter.append($spangotoprevious);
                    break;
                case 'gotopage':
                    $divouter = ej.buildTag("li.e-pdfviewer-toolbarli-label", "", {}, { 'id': this._id + '_pdfviewer_toolbar_pageli' });
                    var $divouterdiv = ej.buildTag("div.e-pdfviewer-tbpage", "", { 'display': 'block', 'overflow': 'visible' }, {});
                    var $inputpageno = ej.buildTag("input.e-pdfviewer-pagenumber e-pdfviewer-elementalignments ejinputtext", "", {}, { 'type': 'text', 'value': '0', 'id': this._id + '_txtpageNo', 'data-role': 'none' });
                    var $spanpageno = ej.buildTag("span.e-pdfviewer-labelpageno", "", {}, {});
                    $divouterdiv.append($inputpageno);
                    $divouterdiv.append($spanpageno);
                    $divouter.append($divouterdiv);
                    break;
                case 'zoomin':
                    $divouter = ej.buildTag("li.e-pdfviewer-toolbarli", "", {}, { 'id': this._id + '_pdfviewer_toolbar_zoomin' });
                    var $spanzoomin = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-zoomin", "", {}, { 'id': this._id + '_toolbar_zoomin' });
                    $divouter.append($spanzoomin);
                    break;
                case 'zoomout':
                    $divouter = ej.buildTag("li.e-pdfviewer-toolbarli", "", {}, { 'id': this._id + '_pdfviewer_toolbar_zoomout' });
                    var $spanzoomout = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-zoomout", "", {}, { 'id': this._id + '_toolbar_zoomout' });
                    $divouter.append($spanzoomout);
                    break;
                case 'zoom':
                    $divouter = ej.buildTag("li.e-pdfviewer-toolbarli-label", "", {}, { 'id': this._id + '_pdfviewer_toolbar_zoomli' });
                    var $divouterdiv = ej.buildTag("div.e-pdfviewer-ejdropdownlist", "", {}, { 'id': this._id + '_pdfviewer_toolbar_zoom' });
                    var $sltzoom = ej.buildTag("select.e-pdfviewer-tbdiv e-pdfviewer-zoomlist", "", {}, { 'id': this._id + '_toolbar_zoomSelection', 'data-role': 'none' });
                    var localeObj = ej.PdfViewer.Locale[this.model.locale] ? ej.PdfViewer.Locale[this.model.locale] : ej.PdfViewer.Locale["default"];
                    var text = localeObj['contextMenu']['auto']['contentText'];
                    $sltzoom.append("<option Selected>" + text + "</option>");
                    $sltzoom.append("<option>50%</option>");
                    $sltzoom.append("<option>75%</option>");
                    $sltzoom.append("<option>100%</option>");
                    $sltzoom.append("<option>125%</option>");
                    $sltzoom.append("<option>150%</option>");
                    $sltzoom.append("<option>200%</option>");
                    $sltzoom.append("<option>400%</option>");
                    $divouterdiv.append($sltzoom);
                    $divouter.append($divouterdiv);
                    break;
                //Creating the fitWidth and the fitPage spans in the HTML page and appending them to the toolbar of the PDF viewer
                case 'fitWidth':
                    $divouter = ej.buildTag("li.e-pdfviewer-toolbarli", "", {}, { 'id': this._id + '_pdfviewer_toolbar_fitWidth' });
                    var $spanexport = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-fitwidth", "", {}, { 'id': this._id + '_fitWidth' });
                    $divouter.append($spanexport);
                    break;
                case 'fitPage':
                    $divouter = ej.buildTag("li.e-pdfviewer-toolbarli", "", {}, { 'id': this._id + '_pdfviewer_toolbar_fitPage' });
                    var $spanFitPage = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-fitpage", "", {}, { 'id': this._id + '_fitPage' });
                    $divouter.append($spanFitPage);
                    break;
                case 'search':
                    $divouter = ej.buildTag("li.e-pdfviewer-toolbarli", "", {}, { 'id': this._id + '_pdfviewer_toolbar_search' });
                    var $spansearch = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-find", "", {}, { 'id': this._id + '_find' });
                    $divouter.append($spansearch);
                    break;
                case 'highlight':
                    $divouter = ej.buildTag("li.e-pdfviewer-toolbarli e-pdfviewer-toolbar-highlight", "", {}, { 'id': this._id + '_pdfviewer_toolbar_highlight' });
                    var $spanhighlight = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-highlight-markup", "", {}, { 'id': this._id + '_highlight_markup' });
                    var dropdownspan = ej.buildTag("span.e-pdfviewer-dropdown-wrapper", "", {}, { 'id': this._id + '_highlight_dropdown' });
                    var dropdownarrowspan = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-dropdown-arrow", "", {}, { 'id': this._id + '_highlight_dropdown_arrow' });
                    dropdownspan.append(dropdownarrowspan);
                    $divouter.append($spanhighlight);
                    $divouter.append(dropdownspan);
                    break;
                case 'underline':
                    $divouter = ej.buildTag("li.e-pdfviewer-toolbarli e-pdfviewer-toolbar-underline", "", {}, { 'id': this._id + '_pdfviewer_toolbar_underline' });
                    var $spanunderline = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-underline-markup", "", {}, { 'id': this._id + '_underline_markup' });
                    var dropdownspan = ej.buildTag("span.e-pdfviewer-dropdown-wrapper", "", {}, { 'id': this._id + '_underline_dropdown' });
                    var dropdownarrowspan = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-dropdown-arrow", "", {}, { 'id': this._id + '_underline_dropdown_arrow' });
                    dropdownspan.append(dropdownarrowspan);
                    $divouter.append($spanunderline);
                    $divouter.append(dropdownspan);
                    break;
                case 'strikeout':
                    $divouter = ej.buildTag("li.e-pdfviewer-toolbarli e-pdfviewer-toolbar-strikeout", "", {}, { 'id': this._id + '_pdfviewer_toolbar_strikeout' });
                    var $spanstrikeout = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-strikeout-markup", "", {}, { 'id': this._id + '_strikeout_markup' });
                    var dropdownspan = ej.buildTag("span.e-pdfviewer-dropdown-wrapper", "", {}, { 'id': this._id + '_strikeout_dropdown' });
                    var dropdownarrowspan = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-dropdown-arrow", "", {}, { 'id': this._id + '_strikeout_dropdown_arrow' });
                    dropdownspan.append(dropdownarrowspan);
                    $divouter.append($spanstrikeout);
                    $divouter.append(dropdownspan);
                    break;
                case 'signature':
                    $divouter = ej.buildTag("li.e-pdfviewer-toolbarli e-pdfviewer-toolbar-sign", "", {}, { 'id': this._id + '_pdfviewer_toolbar_signature' });
                    var $spansign = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-sign", "", {}, { 'id': this._id + '_sign' });
                    $divouter.append($spansign);
                    break;
                case 'selection':
                    $divouter = ej.buildTag("li.e-pdfviewer-toolbarli e-pdfviewer-toolbar-select", "", {}, { 'id': this._id + '_pdfviewer_toolbar_select' });
                    var $spansign = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-select", "", {}, { 'id': this._id + '_select' });
                    $divouter.append($spansign);
                    break;
                case 'scrolling':
                    $divouter = ej.buildTag("li.e-pdfviewer-toolbarli e-pdfviewer-toolbar-scroll", "", {}, { 'id': this._id + '_pdfviewer_toolbar_scroll' });
                    var $spansign = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-scroll", "", {}, { 'id': this._id + '_scroll' });
                    $divouter.append($spansign);
                    break;
            }
            litag.append($divouter);
        },

        _renderViewerBlockinWeb: function (targetTag) {
            var div = ej.buildTag("div.e-pdfviewer-viewer e-pdfviewer-viewerblock", "", {}, { 'id': this._id + '_viewBlockContainer' });
            targetTag.append(div);

            var $innerContent = ej.buildTag("table.e-pdfviewer-viewerblockcellcontent", "", { 'margin': '1px', 'padding': '5px 5px 10px' });
            var $tr = ej.buildTag("tr", "", { 'width': '100%' });
            var $tdleft = ej.buildTag("td.e-pdfviewer-viewerblockcontent", "", {});
            $tr.append($tdleft);
            $innerContent.append($tr);
            div.append($innerContent);
            return div;
        },

        _renderViewerContainer: function (targetTag) {
            var div = ej.buildTag("div", "", {}, { 'id': this._id + '_pdfviewerContainer' });
            targetTag.append(div);

            var $pdfviewContainer = ej.buildTag("div.e-pdfviewer-viewer e-pdfviewer-scrollcontainer e-pdfviewer-viewercontainer", "", { 'height': '100%', 'width': '100%', 'font-size': '8pt' }, { 'id': this._id + '_viewerContainer' });
            var $loadingindicator = ej.buildTag("div", "", { 'margin': '0px', 'height': '99.8%', 'width': '100%' }, { 'id': this._id + '_loadingIndicator' });
            var $loadingemptybackview = ej.buildTag("div", "", { 'margin': '0px', 'height': '99.8%', 'width': '100%', 'background-color': 'rgba(164, 183, 216, 0.18)', 'display': 'block' }, { 'id': this._id + '_loadingIndicatorBackView' });

            var $pageviewContainer = ej.buildTag("div", "", {}, { 'id': this._id + '_pageviewContainer' });

            $loadingindicator.append($loadingemptybackview);
            $pdfviewContainer.append($loadingindicator);

            $pdfviewContainer.append($pageviewContainer);

            if (this._isDevice) {
                this._renderViewerBlockinDevice($pdfviewContainer);
            }

            div.append($pdfviewContainer);

            return div;
        },

        _renderViewer: function () {
            var height = this.element.height();
            var width = this.element.width();
            //control root div tag.
            var viewer = ej.buildTag("div.e-pdfviewer-viewer", "", {}, { 'id': this._id + 'e-pdf-viewer' });

            if (!this.element[0].style.height && this.element[0].parentElement.clientHeight != 0) {
                this._isHeight = true;
            }

            if (!this.element[0].style.width && this.element[0].parentElement.clientWidth != 0) {
                this._isWidth = true;
            }

            if (height === 0 && this.element[0].parentElement.clientHeight != 0) {
                this.element.height(this.element[0].parentElement.clientHeight);
            }

            if (width === 0 && this.element[0].parentElement.clientWidth != 0) {
                this.element.width(this.element[0].parentElement.clientWidth);
            }

            this.element.append(viewer);
            this._renderToolBar(viewer);
            if (!this._isDevice) {
                this._renderViewerBlockinWeb(viewer);
                var tooltip = this._renderToolTip();
            }
            var div = this._renderViewerContainer(viewer);
            div.append(tooltip);
            this._renderSearchBox();
        },

        _renderSearchBox: function () {
            var div = ej.buildTag('div.e-pdfviewer-searchbox e-pdfviewer-arrow', "", {}, { 'id': this._id + '_pdfviewer_searchbox' });
            var ulItem = ej.buildTag('ul.e-pdfviewer-toolbarul-search', "", {});
            div.append(ulItem);
            var inputLi = ej.buildTag('li.e-pdfviewer-toolbarli-label', "", {}, {});
            var inputContainer = ej.buildTag('div.e-pdfviewer-searchboxitem e-pdfviewer-search-inputcontainer', "", {}, {});
            var findLabel = ej.buildTag('span.e-pdfviewer-label e-pdfviewer-searchboxitem', "Find : ", { 'float': 'left', 'padding-top': '1px', 'margin-right': '5px', 'width': '32px', 'overflow': 'hidden', 'text-overflow': 'ellipsis', 'white-space': 'nowrap' }, { id: this._id + '_pdfviewer_findlabel' });
            var input = ej.buildTag('input.e-pdfviewer-searchinput e-pdfviewer-elementalignments ejinputtext', '', { 'width': '150px' }, { 'id': this._id + '_pdfviewer_searchinput' });
            inputContainer.append(findLabel);
            inputContainer.append(input);
            inputLi.append(inputContainer);
            var prevbutton = ej.buildTag('li.e-pdfviewer-toolbarli-search e-pdfviewer-search-previous', '', { 'float': 'left' }, { 'id': this._id + '_pdfviewer_previous_search' });
            var nextbutton = ej.buildTag('li.e-pdfviewer-toolbarli-search e-pdfviewer-search-next', '', { 'float': 'left' }, { 'id': this._id + '_pdfviewer_next_search' });
            var closebutton = ej.buildTag('li.e-pdfviewer-toolbarli-search e-pdfviewer-search-close', '', { 'float': 'left', 'margin-left': '4px' }, { 'id': this._id + '_pdfviewer_close_search' });
            var prevBtnSpan = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-prevfind", "", {}, { 'id': this._id + '_prevfind' });
            prevbutton.append(prevBtnSpan);
            $(prevbutton).css({ "pointer-events": "none", "opacity": "0.6" });
            $(nextbutton).css({ "pointer-events": "none", "opacity": "0.6" });
            var nextBtnSpan = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-nextfind", "", {}, { 'id': this._id + '_nextfind' });
            nextbutton.append(nextBtnSpan);
            var checkboxLi = ej.buildTag('li.e-pdfviewer-toolbarli-label', "", {}, {});
            var checkboxContainer = ej.buildTag('div.e-pdfviewer-searchboxitem e-pdfviewer-search-checkboxcontainer', "", { 'float': 'left', 'overflow': 'visible' }, {});
            var checkbox = ej.buildTag("input", "", {}, { 'type': 'checkbox' });
            var spanElement = ej.buildTag("span.e-pdfviewer-label e-pdfviewer-searchboxitem", "Match case", { 'float': 'left', 'padding-top': '3px', 'margin-left': '5px', 'margin-top': '4px', 'width': '70.5px', 'overflow': 'hidden', 'text-overflow': 'ellipsis', 'white-space': 'nowrap' }, { id: this._id + '_pdfviewer_matchlabel' });
            checkboxContainer.append(checkbox);
            checkboxContainer.append(spanElement);
            checkboxLi.append(checkboxContainer);
            var closeBtnSpan = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-closefind", "", {}, { 'id': this._id + '_closefind' });
            closebutton.append(closeBtnSpan);
            ulItem.append(inputLi);
            ulItem.append(prevbutton);
            ulItem.append(nextbutton);
            ulItem.append(checkboxLi);
            ulItem.append(closebutton);
            div.ejToolbar({ enableSeparator: false, isResponsive: false, width: '400px', hide: true, itemHover: $.proxy(this._toolbarHover, this) });
            checkbox.ejCheckBox({ cssClass: 'e-pdfviewer-match-checkbox', id: this._id + '_search_matchcase', size: ej.CheckboxSize.Medium, change: $.proxy(this._matchcase, this) });
            checkbox.ejCheckBox("disable");
            $('#' + this._id + '_pdfviewerContainer').append(div);
        },

        _createColorPalette: function () {
            var palette = ej.buildTag('div.e-pdfviewer-colorpicker', "", {}, { 'id': this._id + '_pdfviewer_colorpicker' });
            $('#' + this._id + '_pdfviewerContainer').append(palette);
            palette.ejColorPicker({ displayInline: true, modelType: "palette", change: $.proxy(this._setDrawColor, this) });
            this._toolbarColorpickerObject = palette.data('ejColorPicker');
        },
        //-------------------- Render the pdfviewer Ctrl [End] -------------------------//

        //-------------------- Apply Page Style and Actions [Start] -------------------------//
        _setContainerSize: function () {
            var control = document.getElementById(this._id);
            if (control) {
                var ctrlheight = control.clientHeight;
                var viewerblockHeight = 0;
                if (!this._isDevice) {
                    var viewerContainer = $('#' + this._id + '_viewBlockContainer');
                    if (viewerContainer.css('display').toLowerCase() == 'block') {
                        viewerblockHeight = viewerContainer.height();
                    }
                }

                var toolbarHeight = this.model.toolbarSettings.templateId ? $('#' + this.model.toolbarSettings.templateId).height() : $('#' + this._id + '_toolbarContainer').height();

                var calcHeight = ctrlheight - viewerblockHeight - toolbarHeight - 4;
                $('#' + this._id + '_viewerContainer').css({ "height": calcHeight + "px" });
            }
        },

        _setPageSize: function (pageHeight, pageWidth, headerHeight, footerHeight) {
            headerHeight = 0;
            var scalePageSize = $('#' + this._id + '_pageviewContainer')[0].getBoundingClientRect();
            var ins = this;
            this._renderPreviousPage = false;
            $('#' + this._id + '_viewerContainer').unbind('scroll').on('scroll', function () {
                ins._computeCurrentPage(pageHeight);
            });
            $('#' + this._id + '_pageviewContainer').mouseup(function (e) {
                ins._raiseClientEvent("pageClick", e);
            });
            //timer
            this._scrollTimer = setInterval(function () { ins._pageviewscrollchanged(pageHeight) }, 500);
            ins._backgroundPage = 1;

            this._previousZoom = 1;
            ins._previousPage = ins._currentPage;
            if (!this.model.allowClientBuffering) {
                this._pageLocation = new Array();
                this._renderedCanvasList = new Array();
                this._pageContents = new Array();
                this._pageText = new Array();
                this._textDivs = new Array();
                this._textContents = new Array();
                this._searchMatches = new Array();
                this._searchCollection = new Array();
                this._pageLocation[1] = 0;
                this._searchedPages = new Array();
                this._canvascount = this._totalPages;
                this._pointers = new Array();
                this._imageObj = new Array();
                this._pagesGot = new Array();
                this._imageSrcCollection = new Array();
                this._selectionPages = new Array();
            }
            this._designPageCanvas();
        },

        _designPageCanvas: function () {
            var cummulativepageheight = 5;
            var pageviewcontainer = $('#' + this._id + '_pageviewContainer');
            var pageViewerContainer = $('#' + this._id + '_viewerContainer');
            var pageViewline = $('#' + this._id + '_pageviewOuterline');
            var w = pageViewerContainer.width();
            var h = pageViewerContainer.height();
            var pageW = this._pageWidth;
            var pageH = this._pageHeight;
            var scaleX = 1;
            var scaleY = 1;
            scaleX = (w - 25) / pageW;
            scaleX = Math.min(1, scaleX);
            this._zoomVal = scaleX;
            for (var index = 1; index <= this._totalPages; index++) {
                var leftpos;
                if (this._pageSize[index - 1].PageRotation == 90 || this._pageSize[index - 1].PageRotation == 270) {
                    leftpos = (this.element.width() - this._pageSize[index - 1].PageHeight) / 2;
                } else {
                    leftpos = (this.element.width() - this._pageSize[index - 1].PageWidth) / 2;
                }
                if (leftpos < 0)
                    leftpos = 5;
                var imageDiv = ej.buildTag("div", "", {}, { id: this._id + 'pageDiv_' + index });
                pageviewcontainer.append(imageDiv);
                imageDiv.css("position", "absolute");
                imageDiv.css("top", this._zoomVal * cummulativepageheight);
                imageDiv.css("left", leftpos + "px");
                this._pageLocation[index] = cummulativepageheight;
                var imgwidth = '100%';
                var imgheight = '100%';

                var secondarycanvas = document.createElement('canvas');
                secondarycanvas.id = this._id + '_secondarycanvas_' + index;
                secondarycanvas.className = 'e-pdfviewer-secondarycanvas';
                secondarycanvas.style.position = 'absolute';
                secondarycanvas.style.left = 0;
                secondarycanvas.style.top = 0;
                secondarycanvas.style.backgroundColor = 'transparent';
                imageDiv.append(secondarycanvas);
                var proxy = this;

                var canvas = document.createElement('canvas');
                canvas.id = this._id + "pagecanvas_" + index;
                canvas.className = "e-pdfviewer-pageCanvas";
                if (this._pageSize[index - 1].PageRotation == 90 || this._pageSize[index - 1].PageRotation == 270) {
                    canvas.width = this._zoomVal * this._pageSize[index - 1].PageHeight;
                    canvas.height = this._zoomVal * this._pageSize[index - 1].PageWidth;
                    canvas.style.height = this._zoomVal * this._pageSize[index - 1].PageWidth + 'px';
                    canvas.style.width = this._zoomVal * this._pageSize[index - 1].PageHeight + 'px';
                } else {
                    canvas.style.height = this._zoomVal * this._pageSize[index - 1].PageHeight + 'px';
                    canvas.style.width = this._zoomVal * this._pageSize[index - 1].PageWidth + 'px';
                    canvas.height = this._zoomVal * this._pageSize[index - 1].PageHeight;
                    canvas.width = this._zoomVal * this._pageSize[index - 1].PageWidth;
                }
                canvas.style.backgroundColor = "white";
                imageDiv.append(canvas);

                secondarycanvas.height = canvas.height;
                secondarycanvas.width = canvas.width;
                secondarycanvas.style.height = canvas.height + 'px';
                secondarycanvas.style.width = canvas.width + 'px';

                var selectionlayer = document.createElement('div');
                selectionlayer.id = this._id + 'selectioncanvas_' + index;
                selectionlayer.className = 'e-pdfviewer-selectiondiv';
                selectionlayer.style.height = canvas.height + 'px';
                selectionlayer.style.width = canvas.width + 'px';
                selectionlayer.style.position = 'absolute';
                selectionlayer.style.left = 0;
                selectionlayer.style.top = 0;
                selectionlayer.style.backgroundColor = 'transparent';
                selectionlayer.style.zIndex = '2';
                imageDiv.append(selectionlayer);
                //Add loading indicator in every page
                $('#' + this._id + 'pageDiv_' + index).ejWaitingPopup({ showOnInit: true, appendTo: '#' + this._id + 'pageDiv_' + index, target: '#' + this._id + 'pageDiv_' + index });
                $('#' + this._id + 'pageDiv_' + index + '_WaitingPopup').appendTo($('#' + this._id + 'pageDiv_' + index)).css({ 'left': '0px', 'top': '0px', 'background-color': '#dbdbdb' });

                if (this._pageSize[index - 1].PageRotation == 90 || this._pageSize[index - 1].PageRotation == 270) {
                    cummulativepageheight = parseFloat(cummulativepageheight) + parseFloat(this._pageSize[index - 1].PageWidth) + 8;
                } else {
                    cummulativepageheight = parseFloat(cummulativepageheight) + parseFloat(this._pageSize[index - 1].PageHeight) + 8;
                }
            }
            this._cummulativeHeight = cummulativepageheight;
        },

        _computeCurrentPage: function (pageHeight) {
            var sum = 0;
            var currentPageNum = 0;
            var vscrolBar = document.getElementById(this._id + '_viewerContainer');
            var vscrolvalue = vscrolBar.scrollTop;
            if (this._zoomVal != 1) {
                vscrolvalue = vscrolvalue + ((this._currentPage) * (8 - this._zoomVal * 8));
            }
            var pagevalue = 0;
            var pageupdatevalue = 0;
            var pagenumbervalue = { currentPageNumber: 0 };
            for (var i = 0; i < this._totalPages; i++) {
                if (this._isDestroyed)
                    return;
                if (sum > vscrolvalue && vscrolvalue >= 0) {
                    currentPageNum = i;
                    var pageviewcontainer = document.getElementById(this._id + '_viewerContainer');
                    var elementOffset = $('#' + this._id + 'pageDiv_' + currentPageNum)[0];
                    if (elementOffset != undefined && elementOffset != null) {
                        var offset = elementOffset.getBoundingClientRect();
                        var bottom = offset.bottom;
                        var pdfViewerElements = $('#' + this._id + 'e-pdf-viewer')[0];
                        var heights = parseInt(pdfViewerElements.getBoundingClientRect().height);
                        var toolbarHeight = this.model.toolbarSettings.templateId ? $('#' + this.model.toolbarSettings.templateId).height() : $('#' + this._id + '_toolbarContainer').height();
                        var pageheight = parseInt($(pageviewcontainer).css("height")) - toolbarHeight;
                        var currentDifference = heights - pageheight;
                        var currentpageheightinview = parseFloat(sum) - parseFloat(vscrolvalue);
                        var containerHeight = vscrolBar.clientHeight;
                        var nextpageheightinview = vscrolBar.clientHeight - currentpageheightinview;
                        if (vscrolBar.clientHeight < ((this._pageSize[i - 1].PageHeight * this._zoomVal) + (this._pageSize[i].PageHeight * this._zoomVal)) && (parseInt(this._pageLocation[i] * this._zoomVal) < pageviewcontainer.scrollTop)) {
                            if (nextpageheightinview > currentpageheightinview && (bottom <= (290 + currentDifference))) {
                                currentPageNum = parseFloat(currentPageNum) + 1;
                                $('#' + this._id + 'pageDiv_' + (currentPageNum)).css("visibility", "");
                                this._renderPreviousPage = true;
                            }
                        }
                        else if (this._pageSize[i - 1].PageOrientation == "Landscape" && pageviewcontainer.scrollTop > parseInt(this._pageLocation[i] * this._zoomVal) && containerHeight <= 600) {
                            currentPageNum = parseFloat(currentPageNum) + 1;
                            $('#' + this._id + 'pageDiv_' + (currentPageNum)).css("visibility", "");
                            this._renderPreviousPage = true;
                        }
                        this._renderPreviousPage = false;
                        break;
                    }
                }

                else {
                    if (this._pageSize[i].PageRotation == 90 || this._pageSize[i].PageRotation == 270) {
                        sum = parseFloat(sum) + parseFloat(this._pageSize[i].PageWidth * this._zoomVal) + 8;
                    } else {
                        sum = parseFloat(sum) + parseFloat(this._pageSize[i].PageHeight * this._zoomVal) + 8;
                    }
                }
                if (vscrolvalue >= 0) {
                    currentPageNum = i + 1;
                }
                else {
                    currentPageNum = 1;
                }
            }
            if (this._fitType == "fitToPage") {
                var currentPageHeight = parseFloat($('#' + this._id + 'pageDiv_' + (currentPageNum)).css("height"));
                var currentPageTop = this._pageLocation[currentPageNum] * this._zoomVal;
                var viewerContainerHeight = parseFloat($(pageviewcontainer).css("height"));
                var totalHeight = ((viewerContainerHeight - currentPageHeight) / 2);
                $('#' + this._id + 'pageDiv_' + (currentPageNum)).css("top", (currentPageTop + totalHeight) + "px");
                $('#' + this._id + 'pageDiv_' + (currentPageNum + 1)).css("visibility", "hidden");
                $('#' + this._id + 'pageDiv_' + (currentPageNum - 1)).css("visibility", "hidden");
            }
            $('#' + this._id + 'pageDiv_' + (currentPageNum)).css("visibility", "");
            $('#' + this._id + '_toolbarContainer span.e-pdfviewer-labelpageno').html(" / " + this._totalPages);
            pagevalue = document.getElementById(this._id + "_txtpageNo").value;
            $('#' + this._id + '_txtpageNo').val(currentPageNum);
            this._updatePageNavigation(currentPageNum, this._totalPages);
            pageupdatevalue = document.getElementById(this._id + "_txtpageNo").value;
            pagenumbervalue.currentPageNumber = pageupdatevalue;
            this._currentPage = currentPageNum;
            this.currentPageNumber = this._currentPage;
            if (pagevalue != pageupdatevalue) {
                this._raiseClientEvent("pageChange", pagenumbervalue);
            }
        },

        _pageviewscrollchanged: function (pageHeight) {
            var sum = 0;
            var currentPageNum = 0;
            var vscrolvalue = $('#' + this._id + '_viewerContainer').scrollTop();
            if (this._isTargetPage) {
                if (this.model.allowClientBuffering && this.model.bufferingMode == ej.PdfViewer.BufferingMode.Default) {
                    this._isTargetPage = false;
                    this._isBuffering = true;
                    if (this._targetPage <= this._totalPages) {
                        if (!this._isBufferStart) {
                            this._raiseClientEvent("bufferStart", this._isBuffering);
                            this._isBufferStart = true;
                        }
                        var jsonString = { "viewerAction": this._viewerAction.getPageModel, "pageindex": this._targetPage.toString(), "enableOfflineMode": true, "bufferingMode": "default", "isPageScrolled": false };
                        var proxy = this;
                        this._ajaxRequestState = $.ajax({
                            type: 'POST',
                            url: this.model.serviceUrl + '/' + this.model.serverActionSettings.load,
                            crossDomain: true,
                            contentType: 'application/json; charset=utf-8',
                            dataType: 'json',
                            data: JSON.stringify(jsonString),
                            traditional: true,
                            success: function (data) {
                                if (typeof data === 'object')
                                    jsondata = JSON.parse(JSON.stringify(data));
                                else
                                    jsondata = JSON.parse(data);
                                jsondata = jsondata["pdf"];
                                var count = 0;
                                var isLoopBreak = false;
                                if (jsondata) {
                                    for (var i = proxy._targetPage; i <= proxy._totalPages; i++) {
                                        var backupjson = jsondata[i];
                                        if (backupjson) {
                                            proxy._pageContents[parseInt(backupjson["currentpage"])] = JSON.stringify(backupjson);
                                            proxy._pageText[parseInt(backupjson["currentpage"])] = backupjson["pageContents"];
                                            proxy._pagesGot.push(parseInt(backupjson["currentpage"]));
                                            count++;
                                        } else {
                                            isLoopBreak = true;
                                            break;
                                        }
                                    }
                                    if (backupjson == undefined && !isLoopBreak) {
                                        for (var i = proxy._targetPage; i <= proxy._totalPages; i++) {
                                            if (proxy._pagesGot.indexOf(i)) {
                                                count++;
                                            }
                                        }
                                    }
                                    if (count) {
                                        proxy._targetPage = proxy._targetPage + count;
                                    } else {
                                        proxy._targetPage = proxy._targetPage
                                    }
                                    if (proxy._targetPage >= proxy._totalPages) {
                                        proxy._raiseClientEvent("bufferEnd", this._isBuffering);
                                        proxy._isBufferStart = false;
                                    }
                                    proxy._isTargetPage = true;
                                    proxy._isBuffering = false;
                                }
                            },
                            error: function () {

                            }
                        });
                    }
                }
            }
            if (vscrolvalue == this._previousPosition) {
                currentPageNum = this._currentPage;

                if (this._totalPages && this._previousPage != currentPageNum) {
                    var pagenumber = parseInt(currentPageNum);
                    this._previousPage = currentPageNum;
                    if (pagenumber >= 1 && pagenumber <= this._totalPages) {
                        if (!this._isJsondataAvailable) {
                            this._showloadingIndicator(true);
                            $('#' + this._id + '_toolbarContainer span.e-pdfviewer-labelpageno').html("");
                            $('#' + this._id + '_txtpageNo').val('0');
                        }
                        else {

                            $('#' + this._id + '_toolbarContainer span.e-pdfviewer-labelpageno').html(" / " + this._totalPages);
                            $('#' + this._id + '_txtpageNo').val(pagenumber);
                        }
                        this._currentPage = pagenumber;
                        this._updatePageNavigation(this._currentPage, this._totalPages);
                        if (this._renderedCanvasList.indexOf(parseInt(this._currentPage)) == -1 && (!this._scrollTriggered || this.model.allowClientBuffering) && !this._pageContents[parseInt(this._currentPage)]) {
                            if (!this._scrollTriggered) {
                                this._scrollTriggered = true;
                                var jsonResult = new Object();
                                jsonResult["viewerAction"] = this._viewerAction.getPageModel;
                                jsonResult["pageindex"] = this._currentPage.toString();
                                jsonResult["id"] = this._fileId;
                                if (this._pdfService == ej.PdfViewer.PdfService.Local)
                                    this._doAjaxPostscroll("POST", this._actionUrl, JSON.stringify(jsonResult));
                                else
                                    this._doAjaxPostscroll("POST", this.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }));
                            }
                        }
                    }
                }
            }
            if (this._renderedCanvasList.indexOf(parseInt(this._currentPage)) == -1 && (!this._scrollTriggered || this.model.allowClientBuffering) && this._currentPage <= this._totalPages) {
                if (!this._pageContents[parseInt(this._currentPage)]) {
                    if (!this._scrollTriggered) {
                        this._scrollTriggered = true;
                        var jsonResult = new Object();
                        jsonResult["viewerAction"] = this._viewerAction.getPageModel;
                        jsonResult["pageindex"] = this._currentPage.toString();
                        jsonResult["id"] = this._fileId;
                        if (this._pdfService == ej.PdfViewer.PdfService.Local)
                            this._doAjaxPostscroll("POST", this._actionUrl, JSON.stringify(jsonResult));
                        else
                            this._doAjaxPostscroll("POST", this.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }));
                    }
                }
                else {
                    var jsdata = this._pageContents[parseInt(this._currentPage)];
                    this._drawPdfPage(jsdata);
                }
            }
            var nextpage = parseInt(this._currentPage) + 1;
            if (this.model.allowClientBuffering) {
                if (!this._renderPreviousPage) {
                    if (this._renderedCanvasList.indexOf(parseInt(this._currentPage) - 1) == -1 && (!this._scrollTriggered || this.model.allowClientBuffering) && (parseInt(this._currentPage) - 1) > 0) {
                        if (!this._pageContents[parseInt(this._currentPage) - 1]) {
                            if (!this._scrollTriggered) {
                                this._scrollTriggered = true;
                                var jsonResult = new Object();
                                jsonResult["viewerAction"] = this._viewerAction.getPageModel;
                                jsonResult["pageindex"] = (parseInt(this._currentPage) - 1).toString();
                                jsonResult["id"] = this._fileId;
                                if (this.model.allowClientBuffering) {
                                    jsonResult["isPageScrolled"] = true;
                                }
                                if (this._pdfService == ej.PdfViewer.PdfService.Local)
                                    this._doAjaxPostscroll("POST", this._actionUrl, JSON.stringify(jsonResult));
                                else
                                    this._doAjaxPostscroll("POST", this.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }));
                            }
                        }
                        else {
                            var jsdata = this._pageContents[parseInt(this._currentPage) - 1];
                            this._drawPdfPage(jsdata);
                        }
                    } else if (this._renderedCanvasList.indexOf(parseInt(nextpage)) == -1 && (!this._scrollTriggered || this.model.allowClientBuffering) && nextpage <= this._totalPages) {
                        if (!this._pageContents[parseInt(nextpage)]) {
                            if (!this._scrollTriggered) {
                                this._scrollTriggered = true;
                                var jsonResult = new Object();
                                jsonResult["viewerAction"] = this._viewerAction.getPageModel;
                                jsonResult["pageindex"] = nextpage.toString();
                                jsonResult["id"] = this._fileId;
                                if (this.model.allowClientBuffering) {
                                    var isTargetFire = true;
                                    if (!this._isPrintingProcess) {
                                        jsonResult["isPageScrolled"] = false;
                                    }
                                }
                                if (this._pdfService == ej.PdfViewer.PdfService.Local)
                                    this._doAjaxPostscroll("POST", this._actionUrl, JSON.stringify(jsonResult), isTargetFire);
                                else
                                    this._doAjaxPostscroll("POST", this.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }));
                            }
                        }
                        else {
                            var jsdata = this._pageContents[parseInt(nextpage)];
                            this._drawPdfPage(jsdata);
                        }
                    }
                }
                else {
                    if (this._renderedCanvasList.indexOf(parseInt(this._currentPage) - 1) == -1 && (!this._scrollTriggered || this.model.allowClientBuffering) && (parseInt(this._currentPage) - 1) > 0) {
                        if (!this._pageContents[parseInt(this._currentPage) - 1]) {
                            if (!this._scrollTriggered) {
                                this._scrollTriggered = true;
                                var jsonResult = new Object();
                                jsonResult["viewerAction"] = this._viewerAction.getPageModel;
                                jsonResult["pageindex"] = (parseInt(this._currentPage) - 1).toString();
                                jsonResult["id"] = this._fileId;
                                if (this.model.allowClientBuffering) {
                                    jsonResult["isPageScrolled"] = true;
                                }
                                if (this._pdfService == ej.PdfViewer.PdfService.Local)
                                    this._doAjaxPostscroll("POST", this._actionUrl, JSON.stringify(jsonResult));
                                else
                                    this._doAjaxPostscroll("POST", this.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }));
                            }
                        }
                        else {
                            var jsdata = this._pageContents[parseInt(this._currentPage) - 1];
                            this._drawPdfPage(jsdata);
                        }
                    }
                    else if (this._renderedCanvasList.indexOf(parseInt(nextpage)) == -1 && (!this._scrollTriggered || this.model.allowClientBuffering) && nextpage <= this._totalPages) {
                        if (!this._pageContents[parseInt(nextpage)]) {
                            if (!this._scrollTriggered) {
                                this._scrollTriggered = true;
                                var jsonResult = new Object();
                                jsonResult["viewerAction"] = this._viewerAction.getPageModel;
                                jsonResult["pageindex"] = nextpage.toString();
                                jsonResult["id"] = this._fileId;
                                if (this.model.allowClientBuffering) {
                                    jsonResult["isPageScrolled"] = true;
                                }
                                if (this._pdfService == ej.PdfViewer.PdfService.Local)
                                    this._doAjaxPostscroll("POST", this._actionUrl, JSON.stringify(jsonResult));
                                else
                                    this._doAjaxPostscroll("POST", this.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }));
                            }
                        }
                        else {
                            var jsdata = this._pageContents[parseInt(nextpage)];
                            this._drawPdfPage(jsdata);
                        }
                    }
                }
            } else {
                if (!this._renderPreviousPage) {
                    if (this._renderedCanvasList.indexOf(parseInt(nextpage)) == -1 && (!this._scrollTriggered || this.model.allowClientBuffering) && nextpage <= this._totalPages) {
                        if (!this._pageContents[parseInt(nextpage)]) {
                            if (!this._scrollTriggered) {
                                this._scrollTriggered = true;
                                var jsonResult = new Object();
                                jsonResult["viewerAction"] = this._viewerAction.getPageModel;
                                jsonResult["pageindex"] = nextpage.toString();
                                jsonResult["id"] = this._fileId;
                                if (this._pdfService == ej.PdfViewer.PdfService.Local)
                                    this._doAjaxPostscroll("POST", this._actionUrl, JSON.stringify(jsonResult));
                                else
                                    this._doAjaxPostscroll("POST", this.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }));
                            }
                        }
                        else {
                            var jsdata = this._pageContents[parseInt(nextpage)];
                            this._drawPdfPage(jsdata);
                        }
                    }
                    else if (this._renderedCanvasList.indexOf(parseInt(this._currentPage) - 1) == -1 && (!this._scrollTriggered || this.model.allowClientBuffering) && (parseInt(this._currentPage) - 1) > 0) {
                        if (!this._pageContents[parseInt(this._currentPage) - 1]) {
                            if (!this._scrollTriggered) {
                                this._scrollTriggered = true;
                                var jsonResult = new Object();
                                jsonResult["viewerAction"] = this._viewerAction.getPageModel;
                                jsonResult["pageindex"] = (parseInt(this._currentPage) - 1).toString();
                                jsonResult["id"] = this._fileId;
                                if (this._pdfService == ej.PdfViewer.PdfService.Local)
                                    this._doAjaxPostscroll("POST", this._actionUrl, JSON.stringify(jsonResult));
                                else
                                    this._doAjaxPostscroll("POST", this.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }));
                            }
                        }
                        else {
                            var jsdata = this._pageContents[parseInt(this._currentPage) - 1];
                            this._drawPdfPage(jsdata);
                        }
                    }
                }
                else {
                    if (this._renderedCanvasList.indexOf(parseInt(this._currentPage) - 1) == -1 && (!this._scrollTriggered || this.model.allowClientBuffering) && (parseInt(this._currentPage) - 1) > 0) {
                        if (!this._pageContents[parseInt(this._currentPage) - 1]) {
                            if (!this._scrollTriggered) {
                                this._scrollTriggered = true;
                                var jsonResult = new Object();
                                jsonResult["viewerAction"] = this._viewerAction.getPageModel;
                                jsonResult["pageindex"] = (parseInt(this._currentPage) - 1).toString();
                                jsonResult["id"] = this._fileId;
                                if (this._pdfService == ej.PdfViewer.PdfService.Local)
                                    this._doAjaxPostscroll("POST", this._actionUrl, JSON.stringify(jsonResult));
                                else
                                    this._doAjaxPostscroll("POST", this.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }));
                            }
                        }
                        else {
                            var jsdata = this._pageContents[parseInt(this._currentPage) - 1];
                            this._drawPdfPage(jsdata);
                        }
                    }
                    else if (this._renderedCanvasList.indexOf(parseInt(nextpage)) == -1 && (!this._scrollTriggered || this.model.allowClientBuffering) && nextpage <= this._totalPages) {
                        if (!this._pageContents[parseInt(nextpage)]) {
                            if (!this._scrollTriggered) {
                                this._scrollTriggered = true;
                                var jsonResult = new Object();
                                jsonResult["viewerAction"] = this._viewerAction.getPageModel;
                                jsonResult["pageindex"] = nextpage.toString();
                                jsonResult["id"] = this._fileId;
                                if (this._pdfService == ej.PdfViewer.PdfService.Local)
                                    this._doAjaxPostscroll("POST", this._actionUrl, JSON.stringify(jsonResult));
                                else
                                    this._doAjaxPostscroll("POST", this.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }));
                            }
                        }
                        else {
                            var jsdata = this._pageContents[parseInt(nextpage)];
                            this._drawPdfPage(jsdata);
                        }
                    }
                }
            }
            this._previousPosition = vscrolvalue;
            var proxy = this;
            setTimeout(function () {
                $('.e-pdfviewer-formFields').show();
                if (proxy.model) {
                    var localeObj = ej.PdfViewer.Locale[proxy.model.locale] ? ej.PdfViewer.Locale[proxy.model.locale] : ej.PdfViewer.Locale["default"];
                    var text = localeObj['contextMenu']['auto']['contentText'];
                    var zoomddl = $('#' + proxy._id + '_toolbar_zoomSelection').data('ejDropDownList');
                    if (zoomddl) {
                        var values = $('#' + proxy._id + '_toolbar_zoomSelection_hidden').val();
                        $('#' + proxy._id + '_toolbar_zoomSelection_popup li')[0].innerHTML = text;
                        var index = zoomddl.selectedIndex();
                        if (index == 0 && isNaN(parseFloat(values))) {
                            $('#' + proxy._id + '_toolbar_zoomSelection_hidden').val(text);
                            proxy._ejDropDownInstance.model.value = text;
                        }
                        proxy._searchBoxLocalization();
                    }
                }
                if (proxy._selectionRange != null && !proxy._displaySearch) {
                    proxy._selectionNodes.addRange(proxy._selectionRange);
                    proxy._selectionRange = null;
                    proxy._selectionNodes = null;
                }
            }, 5000);
            setTimeout(function () {
                if (proxy._controlSelectionRange != null && proxy._selectionObject != null) {
                    proxy._selectionNodes.removeAllRanges();
                    proxy._clearHighlightDiv();
                    var range = document.createRange();
                    range.setStart(proxy._controlSelectionRange.startContainer.childNodes[0], proxy._selectionObject.anchorOffset);
                    range.setEnd(proxy._controlSelectionRange.endContainer.childNodes[0], proxy._selectionObject.focusOffset);
                    proxy._selectionNodes.addRange(range);
                    proxy._controlSelectionRange = null;
                    proxy._selectionNodes = null;
                    proxy._selectionObject = null;
                }
            }, 0.5);
        },

        _doAjaxPostscroll: function (type, url, jsonResult, isTargetFire) {
            var proxy = this;
            if (this._ajaxRequestState != null) {
                this._ajaxRequestState.abort();
                this._ajaxRequestState = null;
            }
            this._ajaxInProgress = true;
            ($.ajax({
                type: type,
                url: url,
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: jsonResult,
                traditional: true,
                success: function (data) {
                    proxy._ajaxInProgress = false;
                    if (typeof data === 'object')
                        proxy._drawPdfPage(JSON.stringify(data));
                    else
                        proxy._drawPdfPage(data);
                    proxy._scrollTriggered = false;
                    if (proxy._searchText && proxy._isRequestFired) {
                        if (typeof data === 'object')
                            var backupjson = (JSON.stringify(data));
                        else
                            var backupjson = data;
                        if (typeof data === 'object') {
                            if (proxy._pdfService == ej.PdfViewer.PdfService.Local)
                                jsondata = JSON.parse((JSON.stringify(data)));
                            else
                                jsondata = JSON.parse((JSON.stringify(data))["d"]);
                        }
                        else {
                            if (proxy._pdfService == ej.PdfViewer.PdfService.Local)
                                jsondata = JSON.parse(data);
                            else
                                jsondata = JSON.parse(data["d"]);
                        }
                        proxy._pageContents[parseInt(jsondata["currentpage"])] = backupjson;
                        proxy._pageText[parseInt(jsondata["currentpage"])] = jsondata["pageContents"];
                        if (proxy._searchText && proxy._isRequestFired) {
                            proxy._initSearch(proxy._searchPageIndex);
                        }
                    }
                    if (isTargetFire) {
                        if (proxy.model.allowClientBuffering) {
                            if (typeof data === 'object')
                                var jsonData = JSON.parse(JSON.stringify(data));
                            else
                                var jsonData = JSON.parse(data);
                            proxy._pagesGot.push(parseInt(jsonData["currentpage"]));
                            if (parseInt(jsonData["currentpage"]) <= proxy._totalPages) {
                                proxy._targetPage = jsonData["currentpage"] + 1;
                                proxy._isTargetPage = true;
                            }
                        }
                    }
                },
                error: function (msg, textStatus, errorThrown) {
                    if (msg.readyState == 0) {
                        return;
                    }
                    proxy._raiseClientEvent("ajaxRequestFailure", msg.responseText);
                }
            }));
        },

        _drawPdfPage: function (jsondata) {
            var backupjson = jsondata;
            if (this._pdfService == ej.PdfViewer.PdfService.Local)
                jsondata = JSON.parse(jsondata);
            else
                jsondata = JSON.parse(jsondata["d"]);
            this._renderedCanvasList.push(parseInt(jsondata["currentpage"]));
            var pageindex = parseInt(jsondata["currentpage"]);
            if (!this._isWindowResizing)
                this._showPageLoadingIndicator(pageindex, true);
            var pageimageList = jsondata["imagestream"];
            var canvas = document.getElementById(this._id + 'pagecanvas_' + parseInt(jsondata["currentpage"]));
            if (canvas && this.model) {
                var context = canvas.getContext('2d');
                var ratio = this._scalingTextContent(context);
                if (this._pageSize[pageindex - 1].PageRotation == 90 || this._pageSize[pageindex - 1].PageRotation == 270) {
                    canvas.width = this._zoomVal * this._pageSize[pageindex - 1].PageWidth;
                    canvas.height = this._zoomVal * this._pageSize[pageindex - 1].PageHeight;
                    canvas.style.height = this._zoomVal * this._pageSize[pageindex - 1].PageHeight + 'px';
                    canvas.style.width = this._zoomVal * this._pageSize[pageindex - 1].PageWidth + 'px';
                }
                else {
                    canvas.width = this._zoomVal * this._pageSize[pageindex - 1].PageWidth * ratio;
                    canvas.height = this._zoomVal * this._pageSize[pageindex - 1].PageHeight * ratio;
                    canvas.style.height = this._zoomVal * this._pageSize[pageindex - 1].PageHeight + 'px';
                    canvas.style.width = this._zoomVal * this._pageSize[pageindex - 1].PageWidth + 'px';
                }
                this._pageContents[parseInt(jsondata["currentpage"])] = backupjson;
                this._pageText[parseInt(jsondata["currentpage"])] = jsondata["pageContents"];
                this._imageObj = new Array();
                if (!$('#' + this._id + 'selectioncanvas_' + pageindex).hasClass('text_container')) {
                    this._textSelection(jsondata, pageindex, context);
                    this._textMarkupAnnotationList[parseInt(jsondata["currentpage"])] = jsondata["textMarkupAnnotation"];
                    if (this._textMarkupAnnotationList[parseInt(jsondata["currentpage"])]) {
                        this._totalAnnotations[pageindex] = jsondata["textMarkupAnnotation"].slice();
                    }
                } else {
                    this._resizeSelection(jsondata, pageindex, context);
                }
                if (!$('#' + this._id + 'selectioncanvas_' + pageindex).hasClass('input_container')) {
                    this._createFormFields(jsondata, pageindex);
                } else {
                    this._generateFormFields(jsondata, pageindex);
                }
                if (navigator.userAgent.indexOf("Firefox") != -1) {
                    var shapes = pageimageList["textelements"];
                    for (var n = 0; n < shapes.length; n++) {
                        var pathdata = shapes[n];
                        var textureBrush = pathdata["textureBrushs"];
                        if (textureBrush) {
                            var textureImageData = pathdata.texturFields[0].Image;
                            var imageData = "data:image/png;base64," + textureImageData;
                            var imageObjects = new Image();
                            imageObjects.src = imageData;
                            this._imageSrcCollection.push(imageObjects.src);
                        }
                    }
                }
                if (this._isTextSearch) {
                    var proxy = this;
                    setTimeout(function () {
                        proxy._isPageScrollHighlight = true;
                        proxy._isPageScrolledForSearch = true;
                        proxy._highlightOtherOccurrences();
                    }, 100)
                }
                // Hyperlink
                var children = $('#' + this._id + 'selectioncanvas_' + pageindex).children();
                for (i = 0; i < children.length; i++) {
                    if (children[i].hasAttribute('href'))
                        $(children[i]).remove();
                }
                var linkannot = jsondata["linkannotation"];
                var documentlinkpagenumber = jsondata["annotpagenum"];
                var ins = this;
                if (this.model.enableHyperlink) {
                    for (var l = 0; l < linkannot.length; l++) {
                        var aTag = document.createElement('a');
                        aTag.id = 'linkdiv_' + l;
                        var rect = linkannot[l].AnnotRectangle;
                        aTag.style.background = 'transparent';
                        aTag.style.position = 'absolute';
                        aTag.style.left = this._convertPointToPixel(rect.Left * this._zoomVal) + 'px';
                        aTag.style.top = this._convertPointToPixel(rect.Top * this._zoomVal) + 'px';
                        aTag.style.width = this._convertPointToPixel(rect.Width * this._zoomVal) + 'px';
                        aTag.style.height = this._convertPointToPixel(rect.Height * this._zoomVal) + 'px';
                        aTag.style.color = 'transparent';
                        if (linkannot[l].URI.indexOf("mailto:") != -1) {
                            var mail = linkannot[l].URI.substring(linkannot[l].URI.indexOf("mailto:"), linkannot[l].URI.length);
                            aTag.title = mail;
                            aTag.setAttribute('href', mail);
                        } else {
                            aTag.title = linkannot[l].URI;
                            aTag.setAttribute('href', linkannot[l].URI);
                        }
                        if (this.model.hyperlinkOpenState == ej.PdfViewer.LinkTarget.Default) {
                            aTag.target = "_self";
                            aTag.onclick = function () {
                                var hyperlink = { hyperlink: this.href }
                                ins._raiseClientEvent("hyperlinkClick", hyperlink);
                            }
                        } else if (this.model.hyperlinkOpenState == ej.PdfViewer.LinkTarget.NewTab) {
                            aTag.target = "_blank";
                            aTag.onclick = function () {
                                var hyperlink = { hyperlink: this.href }
                                ins._raiseClientEvent("hyperlinkClick", hyperlink);

                            }
                        } else if (this.model.hyperlinkOpenState == ej.PdfViewer.LinkTarget.NewWindow) {

                            aTag.onclick = function () {
                                var hyperlink = { hyperlink: this.href }
                                ins._raiseClientEvent("hyperlinkClick", hyperlink);
                                window.open(this.href, '_blank', 'scrollbars=yes,resizable=yes');
                                return false;
                            }
                        }
                        if (documentlinkpagenumber[l] != undefined) {
                            var destPageHeight = (this._pageSize[pageindex - 1].PageHeight);
                            var destAnnotLoc = this._convertPointToPixel(linkannot[l].AnnotLocation);
                            var dest = (destPageHeight - destAnnotLoc);
                            var scrollvalue = (parseFloat(this._pageLocation[documentlinkpagenumber[l]] * this._zoomVal)) + parseFloat(dest * this._zoomVal);
                            aTag.name = scrollvalue;
                            aTag.onclick = function () {
                                var pageviewcontainer = document.getElementById(ins._id + '_viewerContainer');
                                pageviewcontainer.scrollTop = this.name;
                                return false;
                            }
                        }
                        var selectioncanvas = document.getElementById(this._id + 'selectioncanvas_' + pageindex);
                        selectioncanvas.appendChild(aTag);
                    }
                }
                //Hyperlink

                if (this._textMarkupAnnotationList[pageindex]) {
                    this._renderTextMarkupAnnotation(this._textMarkupAnnotationList[pageindex], pageindex);
                }

                var index = parseInt(jsondata["currentpage"]);
                var imageObjCollection = new Array();
                var imageTransformCollection = new Array();
                var imageDataCollection = new Array();
                var currentIndexCollection = new Array();
                var pageDataCollection = new Array();
                var textureBrushImage = new Array();
                var textureDataCollection = new Array();
                var imageFilter = new Array();
                var textureImage = 0;
                var zoomFactor;
                var browserUserAgent = navigator.userAgent;
                var offsett;
                var imageIndex = 0;

                var charPath = new Array();
                var shapes = pageimageList["textelements"];
                for (var j = 0; j < shapes.length; j++) {
                    var pathdata = shapes[j];
                    var color = pathdata["color"];
                    var matrix = pathdata["matrix"];
                    if (matrix != null)
                        matrix = matrix["Elements"];
                    var brushMode = pathdata["brush"];
                    var pathValue = pathdata["pathValue"];
                    var isClipping = pathdata["iscliping"];
                    var restoreCanvas = pathdata["restorecanvas"];
                    var imageData = pathdata["imagedata"];
                    var fillMode = pathdata["fillrule"];
                    var fillStroke = pathdata["isFillandStroke"];
                    var fillColor = pathdata["fillcolor"];
                    var strokeColor = pathdata["strokecolor"];
                    var lineWidth = pathdata["linewidth"];
                    var lineCap = pathdata["linecap"];
                    var linearGradient = pathdata["linearGradientBrush"];
                    var textureBrush = pathdata["textureBrushs"];
                    var charID = pathdata["charID"];
                    var rectangle = pathdata["rectvalue"];
                    var alpha = pathdata["alpha"];
                    var filter = pathdata["filters"];
                    var dashedPattern = pathdata["dashPattern"];
                    if (dashedPattern != null && dashedPattern.length > 0) {
                        context.setLineDash(dashedPattern);
                    }
                    if (pathValue != null) {
                        pathValue = pathValue.split(";");
                        if (charID)
                            charPath[charID] = pathValue;
                    }
                    else if (pathValue == null && charID) {
                        pathValue = charPath[charID];
                    }
                    if (restoreCanvas == false) {
                        context.save();
                    }
                    if (pathValue != undefined) {
                        if (this._pageSize[pageindex - 1].PageRotation == 90) {
                            context.setTransform(matrix[0] * this._zoomVal, matrix[1] * this._zoomVal, matrix[2] * this._zoomVal, matrix[3] * this._zoomVal, matrix[4] * this._zoomVal, matrix[5] * this._zoomVal);
                        } else {
                            context.setTransform(matrix[0] * this._zoomVal * ratio, matrix[1] * this._zoomVal * ratio, matrix[2] * this._zoomVal * ratio, matrix[3] * this._zoomVal * ratio, matrix[4] * this._zoomVal * ratio, matrix[5] * this._zoomVal * ratio);
                        }
                    }
                    if (pathValue != null) {
                        context.beginPath();

                        for (var i = 0; i < pathValue.length; i++) {
                            var val = pathValue[i];
                            var pathType = val[0];
                            if (pathType == "M") {
                                val = val.substring(1, val.length);
                                val = val.split(" ");
                                context.moveTo((val[0]), val[1]);
                            }
                            else if (pathType == "L") {
                                val = val.substring(1, val.length);
                                val = val.split(" ");
                                context.lineTo((val[0]), val[1]);
                            }
                            else if (pathType == "C") {
                                val = val.substring(1, val.length);
                                val = val.split(" ");
                                context.bezierCurveTo(val[0], val[1], val[2], val[3], val[4], val[5]);
                            }
                            else if (pathType == "Z") {
                                context.closePath();
                            }
                        }
                        if (isClipping == true) {
                            if (fillMode == "evenodd") {
                                context.msFillRule = "evenodd";
                                context.mozFillRule = "evenodd";
                                context.clip(fillMode);
                            }
                            context.clip();

                        }
                        else {
                            if (fillStroke == undefined) {
                                if (brushMode == "Fill") {
                                    if (linearGradient != undefined) {
                                        context.fillStyle = this._getGradientBrush(linearGradient, context);
                                    }
                                    else if (textureBrush != undefined) {
                                        context.fillStyle = this._createTextureBrush(textureBrush, context, pathdata);
                                    }
                                    else {
                                        if (alpha != undefined)
                                            context.globalAlpha = alpha;
                                        context.fillStyle = color;
                                    }
                                    if (fillMode == "evenodd") {
                                        context.msFillRule = "evenodd";
                                        context.mozFillRule = "evenodd";
                                        context.fill(fillMode);
                                    }
                                    context.fill();
                                }
                                else if (brushMode == "FillandStroke") {
                                    context.fillStyle = color;
                                    context.lineWidth = lineWidth;
                                    context.fill();
                                    context.strokeStyle = strokeColor;
                                    context.stroke();
                                }
                                else if (brushMode == "Stroke") {
                                    context.strokeStyle = strokeColor;
                                    context.lineWidth = lineWidth;
                                    context.lineCap = lineCap;
                                    context.stroke();
                                }
                                else {
                                    context.strokeStyle = color;
                                    context.lineWidth = lineWidth;
                                    context.lineCap = lineCap;
                                    context.stroke();
                                }
                            }
                            else {
                                context.strokeStyle = strokeColor;
                                context.lineWidth = lineWidth;
                                context.lineCap = lineCap;
                                context.stroke();
                                if (linearGradient != undefined) {
                                    context.fillStyle = this._getGradientBrush(linearGradient, context);
                                }
                                else if (textureBrush != undefined) {
                                    context.fillStyle = this._createTextureBrush(textureBrush, context, pathdata);
                                }
                                else
                                    context.fillStyle = fillColor;
                                if (fillMode == "evenodd") {
                                    context.msFillRule = "evenodd";
                                    context.mozFillRule = "evenodd";
                                    context.fill(fillMode);
                                }
                                context.fill();
                            }
                        }
                    }

                    if (restoreCanvas)
                        context.restore();
                    if (imageData != undefined) {
                        if ((offsett = browserUserAgent.indexOf("Firefox")) != -1 || (offsett = browserUserAgent.indexOf("Chrome")) != -1 || (offsett = browserUserAgent.indexOf("Safari")) != -1 || (offsett = browserUserAgent.indexOf("AppleWebKit")) != -1) {
                            imageObjCollection.push(imageData);
                            imageTransformCollection.push(matrix);
                            pageDataCollection.push(shapes);
                            currentIndexCollection.push(j);
                            imageFilter.push(filter);
                            zoomFactor = this._zoomVal;
                            this._isContainImage = true;
                            break;
                        }
                        else {
                            var imageObj = new Image();
                            imageObj.src = imageData;
                            context.setTransform(matrix[0] * this._zoomVal * ratio, matrix[1] * this._zoomVal * ratio, matrix[2] * this._zoomVal * ratio, matrix[3] * this._zoomVal * ratio, matrix[4] * this._zoomVal * ratio, matrix[5] * this._zoomVal * ratio);
                            context.drawImage(imageObj, 0, 0, 1, 1);
                        }
                    }
                    if (textureBrush != undefined) {
                        var pathdata = shapes[j];
                        if (textureBrush) {
                            var textureImageData = pathdata.texturFields[0].Image;
                            var imageData = "data:image/png;base64," + textureImageData;
                            var imageObjects = new Image();
                            imageObjects.src = imageData;
                            textureBrushImage.push(imageObjects.src);
                        }
                        imageTransformCollection.push(matrix);
                        pageDataCollection.push(shapes);
                        currentIndexCollection.push(j);
                        zoomFactor = this._zoomVal;
                        break;
                    }
                }
                for (var p = 0; p < textureBrushImage.length; p++) {
                    this._textureBrushRendering(shapes, textureDataCollection, textureBrushImage, imageTransformCollection, context, p, pageDataCollection, currentIndexCollection, charPath, canvas, index, textureImage);
                    textureImage++;
                }
                if ((offsett = browserUserAgent.indexOf("Firefox")) != -1 || (offsett = browserUserAgent.indexOf("Chrome")) != -1 || (offsett = browserUserAgent.indexOf("Safari")) != -1 || (offsett = browserUserAgent.indexOf("AppleWebKit")) != -1) {
                    for (var k = 0; k < imageObjCollection.length; k++) {
                        this._imageRendering(shapes, imageDataCollection, imageObjCollection, imageTransformCollection, context, k, pageDataCollection, currentIndexCollection, charPath, canvas, index, imageIndex, imageFilter);
                        imageIndex++;
                    }
                }
                var tempcanvas = canvas;
                var proxy = this;
                if (this._pageSize[index - 1].PageRotation != 0) {
                    if (!(imageData != undefined && browserUserAgent.indexOf("Firefox") != -1)) {
                        tempcanvas = document.getElementById(this._id + 'pagecanvas_' + parseInt(jsondata["currentpage"]));
                        var canvasUrl = tempcanvas.toDataURL();
                        var context = tempcanvas.getContext('2d');
                        var image = new Image();
                        image.onload = function () {
                            context.clearRect(0, 0, tempcanvas.width, tempcanvas.height);
                            if (proxy._pageSize[index - 1].PageRotation == 90 || proxy._pageSize[index - 1].PageRotation == 270) {
                                tempcanvas.width = proxy._zoomVal * proxy._pageSize[index - 1].PageHeight;
                                tempcanvas.height = proxy._zoomVal * proxy._pageSize[index - 1].PageWidth;
                                tempcanvas.style.height = proxy._zoomVal * proxy._pageSize[index - 1].PageWidth + 'px';
                                tempcanvas.style.width = proxy._zoomVal * proxy._pageSize[index - 1].PageHeight + 'px';
                            } else {
                                tempcanvas.width = proxy._zoomVal * proxy._pageSize[index - 1].PageWidth;
                                tempcanvas.height = proxy._zoomVal * proxy._pageSize[index - 1].PageHeight;
                                tempcanvas.style.width = proxy._zoomVal * proxy._pageSize[index - 1].PageWidth + 'px';
                                tempcanvas.style.height = proxy._zoomVal * proxy._pageSize[index - 1].PageHeight + 'px';
                            }
                            context.save();
                            context.translate(tempcanvas.width / 2, tempcanvas.height / 2);
                            context.rotate((proxy._pageSize[index - 1].PageRotation / 2) * Math.PI / 2);
                            context.drawImage(image, -image.width / 2, -image.height / 2);
                            context.restore();
                        }
                        image.src = canvasUrl;
                    }
                }
                this._showPageLoadingIndicator(pageindex, false);
                this._changingImageCanvasPosition(pageindex);
                this._showSignature();
                return tempcanvas;
            }
        },
        _textureBrushRendering: function (shapes, imageDataCollection, imageObjCollection, imageTransformCollection, context, index, pageDataCollection, currentIndexCollection, charPath, canvas, currentindex, imageIndex) {
            var zoomValue = this._zoomVal;
            var imageObject = new Image();
            var proxy = this;
            var browserUserAgent = navigator.userAgent;
            imageObject.onload = function () {
                var isImageContentChanged = false;
                var ratio = proxy._scalingTextContent(context);
                for (var l = 0; l < imageTransformCollection.length; l++) {
                    if (isImageContentChanged == false) {
                        var matrixData = imageTransformCollection[l];
                        context.setTransform(matrixData[0] * zoomValue * ratio, matrixData[1] * zoomValue * ratio, matrixData[2] * zoomValue * ratio, matrixData[3] * zoomValue * ratio, matrixData[4] * zoomValue * ratio, matrixData[5] * zoomValue * ratio);
                        if (imageDataCollection[imageIndex] != undefined) {
                            var img = imageDataCollection[imageIndex];
                            var tempCanvas = document.createElement("canvas");
                            var tempContext = tempCanvas.getContext("2d");
                            tempCanvas.width = img.width;
                            tempCanvas.height = img.height;
                            tempContext.drawImage(img, 0, 0, img.width, img.height, 0, 0, tempCanvas.width, tempCanvas.height);
                            var pattern = context.createPattern(tempCanvas, 'repeat');
                            context.fillStyle = pattern;
                            context.fill();
                        }
                        var dataIndex = currentIndexCollection[l];
                        dataIndex = dataIndex + 1;
                        var data = pageDataCollection[l];
                        while (dataIndex < data.length) {
                            var pathdata = data[dataIndex];
                            var color = pathdata["color"];
                            var matrix = pathdata["matrix"];
                            if (matrix != null)
                                matrix = matrix["Elements"];
                            var brushMode = pathdata["brush"];
                            var pathValue = pathdata["pathValue"];
                            var isClipping = pathdata["iscliping"];
                            var restoreCanvas = pathdata["restorecanvas"];
                            var imageData = pathdata["imagedata"];
                            var fillMode = pathdata["fillrule"];
                            var fillStroke = pathdata["isFillandStroke"];
                            var fillColor = pathdata["fillcolor"];
                            var strokeColor = pathdata["strokecolor"];
                            var lineWidth = pathdata["linewidth"];
                            var lineCap = pathdata["linecap"];
                            var linearGradient = pathdata["linearGradientBrush"];
                            var textureBrush = pathdata["textureBrushs"];
                            var charID = pathdata["charID"];
                            var rectangle = pathdata["rectvalue"];
                            if (pathValue != null) {
                                pathValue = pathValue.split(";");
                                if (charID)
                                    charPath[charID] = pathValue;
                            }
                            else if (pathValue == null && charID) {
                                pathValue = charPath[charID];
                            }
                            if (restoreCanvas == false) {
                                context.save();
                            }
                            if (pathValue != undefined) {
                                context.setTransform(matrix[0] * zoomValue * ratio, matrix[1] * zoomValue * ratio, matrix[2] * zoomValue * ratio, matrix[3] * zoomValue * ratio, matrix[4] * zoomValue * ratio, matrix[5] * zoomValue * ratio);
                            }

                            if (pathValue != null) {
                                context.beginPath();

                                for (var i = 0; i < pathValue.length; i++) {
                                    var val = pathValue[i];
                                    var pathType = val[0];
                                    if (pathType == "M") {
                                        val = val.substring(1, val.length);
                                        val = val.split(" ");
                                        context.moveTo((val[0]), val[1]);
                                    }
                                    else if (pathType == "L") {
                                        val = val.substring(1, val.length);
                                        val = val.split(" ");
                                        context.lineTo((val[0]), val[1]);
                                    }
                                    else if (pathType == "C") {
                                        val = val.substring(1, val.length);
                                        val = val.split(" ");
                                        context.bezierCurveTo(val[0], val[1], val[2], val[3], val[4], val[5]);
                                    }
                                    else if (pathType == "Z") {
                                        context.closePath();
                                    }
                                }
                                if (isClipping == true) {
                                    if (fillMode == "evenodd") {
                                        context.msFillRule = "evenodd";
                                        context.mozFillRule = "evenodd";
                                        context.clip(fillMode);
                                    }
                                    context.clip();

                                }
                                else {
                                    if (fillStroke == undefined) {
                                        if (brushMode == "Fill") {
                                            if (linearGradient != undefined) {
                                                context.fillStyle = proxy._getGradientBrush(linearGradient, context);
                                            }
                                            else if (textureBrush != undefined) {
                                                context.fillStyle = proxy._createTextureBrush(textureBrush, context, pathdata);
                                            }
                                            else
                                                context.fillStyle = color;
                                            if (fillMode == "evenodd") {
                                                context.msFillRule = "evenodd";
                                                context.mozFillRule = "evenodd";
                                                context.fill(fillMode);
                                            }
                                            context.fill();
                                        }
                                        else if (brushMode == "FillandStroke") {
                                            context.fillStyle = color;
                                            context.fill();
                                            context.strokeStyle = strokeColor;
                                            context.stroke();
                                        }
                                        else if (brushMode == "Stroke") {
                                            context.strokeStyle = strokeColor;
                                            context.lineWidth = lineWidth;
                                            context.lineCap = lineCap;
                                            context.stroke();
                                        }
                                        else {
                                            context.strokeStyle = color;
                                            context.lineWidth = lineWidth;
                                            context.lineCap = lineCap;
                                            context.stroke();
                                        }
                                    }
                                    else {
                                        context.strokeStyle = strokeColor;
                                        context.lineWidth = lineWidth;
                                        context.lineCap = lineCap;
                                        context.stroke();
                                        if (linearGradient != undefined) {
                                            context.fillStyle = proxy._getGradientBrush(linearGradient, context);
                                        }
                                        else if (textureBrush != undefined) {
                                            context.fillStyle = proxy._createTextureBrush(textureBrush, context, pathdata);
                                        }
                                        else
                                            context.fillStyle = fillColor;
                                        if (fillMode == "evenodd") {
                                            context.msFillRule = "evenodd";
                                            context.mozFillRule = "evenodd";
                                            context.fill(fillMode);
                                        }
                                        context.fill();
                                    }
                                }
                            }
                            if (restoreCanvas)
                                context.restore();
                            if (textureBrush != undefined) {
                                isImageContentChanged = true;
                                imageObjCollection.pop();
                                imageTransformCollection.pop();
                                pageDataCollection.pop();
                                currentIndexCollection.pop();
                                imageObjCollection.push(imageData);
                                imageTransformCollection.push(matrix);
                                pageDataCollection.push(shapes);
                                currentIndexCollection.push(dataIndex);
                                l = -1;
                                imageIndex++;
                                break;
                            }
                            dataIndex++;
                        }
                    }
                    else {
                        proxy._textureBrushRendering(shapes, imageDataCollection, imageObjCollection, imageTransformCollection, context, l, pageDataCollection, currentIndexCollection, charPath, canvas, currentindex, imageIndex);
                        imageIndex++;
                    }
                }
                if (dataIndex == shapes.length) {
                    if (proxy._pageSize[currentindex - 1].PageRotation != 0) {
                        var tempcanvas = document.getElementById(proxy._id + 'pagecanvas_' + currentindex);
                        var canvasUrl = tempcanvas.toDataURL();
                        var ctx = tempcanvas.getContext('2d');
                        var image = new Image();
                        image.onload = function () {
                            ctx.clearRect(0, 0, tempcanvas.width, tempcanvas.height);
                            if (proxy._pageSize[currentindex - 1].PageRotation == 90 || proxy._pageSize[currentindex - 1].PageRotation == 270) {
                                tempcanvas.width = proxy._zoomVal * proxy._pageSize[currentindex - 1].PageHeight;
                                tempcanvas.height = proxy._zoomVal * proxy._pageSize[currentindex - 1].PageWidth;
                                tempcanvas.style.height = proxy._zoomVal * proxy._pageSize[currentindex - 1].PageWidth + 'px';
                                tempcanvas.style.width = proxy._zoomVal * proxy._pageSize[currentindex - 1].PageHeight + 'px';
                            } else {
                                tempcanvas.width = proxy._zoomVal * proxy._pageSize[currentindex - 1].PageWidth;
                                tempcanvas.height = proxy._zoomVal * proxy._pageSize[currentindex - 1].PageHeight;
                                tempcanvas.style.width = proxy._zoomVal * proxy._pageSize[currentindex - 1].PageWidth + 'px';
                                tempcanvas.style.height = proxy._zoomVal * proxy._pageSize[currentindex - 1].PageHeight + 'px';
                            }
                            ctx.save();
                            ctx.translate(tempcanvas.width / 2, tempcanvas.height / 2);
                            ctx.rotate((proxy._pageSize[currentindex - 1].PageRotation / 2) * Math.PI / 2);
                            ctx.drawImage(image, -image.width / 2, -image.height / 2);
                            ctx.restore();
                        }
                        image.src = canvasUrl;
                    }
                }
            };
            imageObject.src = imageObjCollection[index];
            imageDataCollection.push(imageObject);
            this._textureobj.push(imageObject);
        },
        _hidingSignature: function () {
            $('.e-pdfviewer-imagecanvasDraw').hide();
            var selector = document.getElementById(this._id + "e-pdfviewer-selector");
            var isButtons = document.getElementsByClassName('e-pdfviewer-buttons');
            $(selector).remove();
            $(isButtons).remove();
        },
        _showSignature: function () {
            $('.e-pdfviewer-imagecanvasDraw').show();
            var selector = document.getElementById(this._id + "e-pdfviewer-selector");
            var isButtons = document.getElementsByClassName('e-pdfviewer-buttons');
            $(selector).remove();
            $(isButtons).remove();
        },
        _changingImageCanvasPosition: function (pageindex) {
            var imageCanvas = $('.e-pdfviewer-imagecanvasDraw');
            this._calculatingPositions(imageCanvas);
            this._previousZoomValue = this._zoomVal;
        },
        _calculatingPositions: function (imageCanvas) {
            for (var i = 0; i < imageCanvas.length; i++) {
                var newCanvasLeft = (parseFloat($(imageCanvas[i]).css("left")) / this._previousZoomValue) * this._zoomVal;
                var newCanvasTop = (parseFloat($(imageCanvas[i]).css("top")) / this._previousZoomValue) * this._zoomVal;
                var newCanvasWidth = (parseFloat($(imageCanvas[i]).css("width")) / this._previousZoomValue) * this._zoomVal;
                var newCanvasHeight = (parseFloat($(imageCanvas[i]).css("height")) / this._previousZoomValue) * this._zoomVal;
                $(imageCanvas[i]).css("top", newCanvasTop + "px");
                $(imageCanvas[i]).css("left", newCanvasLeft + "px");
                if (imageCanvas[i].className != "e-pdfviewer-buttons") {
                    $(imageCanvas[i]).css("width", newCanvasWidth + "px");
                    $(imageCanvas[i]).css("height", newCanvasHeight + "px");
                }
                var path = this._outputPath[imageCanvas[i].id];
                this._reDrawSignature(path, imageCanvas[i], newCanvasWidth, newCanvasHeight);
            }
        },
        _reDrawSignature: function (path, newCanvas, newCanvasWidth, newCanvasHeight) {
            var imageTempcanvas = document.getElementById(this._id + "_imageTemp");
            var w = parseFloat($(imageTempcanvas).css("width"));
            var h = parseFloat($(imageTempcanvas).css("height"));
            var controlPoints = this._valueChanges[newCanvas.id];
            var differenceX = controlPoints.differenceX / newCanvasWidth;
            var differenceY = controlPoints.differenceY / newCanvasHeight;
            var widths = this.element[0].parentElement.clientWidth;
            if (widths >= 500) {
                var heightRatio = newCanvasHeight / 400;
                var widthRatio = newCanvasWidth / 470;
            }
            else {
                var heightRatio = newCanvasHeight / 100;
                var widthRatio = newCanvasWidth / widths;
            }
            if (heightRatio <= 0 || widthRatio <= 0) {
                heightRatio = 1;
                widthRatio = 1;
            }
            var context = newCanvas.getContext("2d");
            var color = context.strokeStyle;
            newCanvas.width = newCanvasWidth;
            newCanvas.height = newCanvasHeight;
            newCanvas.style.width = newCanvasWidth + "px";
            newCanvas.style.height = newCanvasHeight + "px";

            var length = path.split("<br>").length;
            context.beginPath();
            for (var k = 0; k < length; k++) {
                var splitedvalue = path.split("<br>")[k].split('.').slice(1).join('.');
                if (splitedvalue) {
                    var substring = splitedvalue.substring(0, 6);
                    var movevalues = splitedvalue.substring(6);
                    var points = movevalues.replace(/[{()}]/g, '');
                    var splitPoints = points.split(',');
                    var point1 = (((parseFloat(splitPoints[0]))) - controlPoints.minimumX) / differenceX;
                    var point2 = (((parseFloat(splitPoints[1]))) - controlPoints.minimumY) / differenceY;
                    if (substring == "moveTo") {
                        context.moveTo(point1, point2);
                    }
                    else if (substring == "lineTo") {
                        context.lineTo(point1, point2);
                    }
                }
            }
            context.lineWidth = 4;
            context.scale(widthRatio, heightRatio);
            context.strokeStyle = color;
            context.stroke();
        },
        _scalingTextContent: function (context) {
            var backingPixel = context.webkitBackingStorePixelRatio ||
                context.mozBackingStorePixelRatio ||
                context.msBackingStorePixelRatio ||
                context.oBackingStorePixelRatio ||
                context.backingStorePixelRatio || 1;
            var ratio = 2;
            return ratio;
        },
        _convertPointToPixel: function (value) {
            if (this._horizontalResolution)
                return (parseFloat(value) * (this._horizontalResolution / 72));
            else
                return (parseFloat(value) * (96 / 72));
        },

        _getRandomNum: function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        },

        _createGUID: function () {
            var guid;
            return guid = "Syncfusion_PDFviewer_" + (this._getRandomNum() + this._getRandomNum() + "-" + this._getRandomNum() + "-4" + this._getRandomNum().substr(0, 3) + "-" + this._getRandomNum() + this._getRandomNum() + this._getRandomNum()).toLowerCase();
        },
        _createSignatureID: function () {
            var guid;
            return guid = "Signature_" + (this._getRandomNum() + this._getRandomNum() + "-" + this._getRandomNum() + "-4" + this._getRandomNum().substr(0, 3) + "-" + this._getRandomNum() + this._getRandomNum() + this._getRandomNum()).toLowerCase();
        },
        _createFormFields: function (jsondata, pageindex) {
            var TextBoxField = jsondata["pdfRenderedFields"];
            var cropBoxValue = jsondata["cropBoxValue"];
            var browserUserAgent = navigator.userAgent;
            var backgroundcolor;
            var proxy = this;
            if (TextBoxField != null) {
                for (var l = 0; l < TextBoxField.length; l++) {
                    var inputdiv;
                    if ((TextBoxField[l].PageIndex + 1) == pageindex) {
                        var boundingRect = TextBoxField[l].LineBounds;
                        if (TextBoxField[l].Name == "Textbox") {
                            if (TextBoxField[l].Multiline) {
                                inputdiv = document.createElement("textarea");
                                $(inputdiv).css("resize", "none");
                            } else {
                                inputdiv = document.createElement("input");
                                inputdiv.type = "text";
                            }
                            var backColor = TextBoxField[l].BackColor;
                            var foreColor = TextBoxField[l].FontColor;
                            proxy._addAlignmentPropety(TextBoxField[l], inputdiv);
                            if (TextBoxField[l].IsReadonly || this._isFormFieldsDisabled) {
                                $(inputdiv).attr("disabled", true);
                                $(inputdiv).css("background-color", "none");
                                $(inputdiv).css("cursor", "default");
                            }
                            else
                                $(inputdiv).css("background-color", "rgba(" + backColor.R + "," + backColor.G + "," + backColor.B + "," + 0.2 + ")");
                            $(inputdiv).css("color", "rgb(" + foreColor.R + "," + foreColor.G + "," + foreColor.B + ")");
                            if (TextBoxField[l].IsRequired)
                                $(inputdiv).css("border", "1px solid red");
                            else
                                $(inputdiv).css("border", TextBoxField[l].BorderWidth);
                            $(inputdiv).attr("name", TextBoxField[l].FieldName);
                            var fontSize = this._convertPointToPixel(TextBoxField[l].Font.Height * this._zoomVal) + 'px';
                            if (TextBoxField[l].MaxLength > 0) {
                                $(inputdiv).attr("maxlength", TextBoxField[l].MaxLength);
                            }
                            if (TextBoxField[l].InsertSpaces)
                                $(inputdiv).css("letter-spacing", fontSize);
                            if (TextBoxField[l].Text != "")
                                $(inputdiv).val(TextBoxField[l].Text);
                            else
                                $(inputdiv).val('');
                        }
                        else if (TextBoxField[l].Name == "Password") {
                            inputdiv = document.createElement("input");
                            inputdiv.type = "password";
                            var backColor = TextBoxField[l].BackColor;
                            var foreColor = TextBoxField[l].FontColor;
                            if (TextBoxField[l].IsReadonly || this._isFormFieldsDisabled) {
                                $(inputdiv).attr("disabled", true);
                                $(inputdiv).css("background-color", "none");
                                $(inputdiv).css("cursor", "default");
                            }
                            else
                                $(inputdiv).css("background-color", "rgba(" + backColor.R + "," + backColor.G + "," + backColor.B + "," + 0.2 + ")");
                            $(inputdiv).css("color", "rgb(" + foreColor.R + "," + foreColor.G + "," + foreColor.B + ")");
                            if (TextBoxField[l].IsRequired)
                                $(inputdiv).css("border", "1px solid red");
                            else
                                $(inputdiv).css("border", TextBoxField[l].BorderWidth);
                            if (TextBoxField[l].IsReadonly || this._isFormFieldsDisabled)
                                $(inputdiv).attr("disabled", true);
                            proxy._addAlignmentPropety(TextBoxField[l], inputdiv);
                            $(inputdiv).attr("name", TextBoxField[l].FieldName);
                            var fontSize = this._convertPointToPixel(TextBoxField[l].Font.Height * this._zoomVal) + 'px';
                            if (TextBoxField[l].MaxLength > 0) {
                                $(inputdiv).attr("maxlength", TextBoxField[l].MaxLength);
                            }
                            if (TextBoxField[l].InsertSpaces)
                                $(inputdiv).css("letter-spacing", fontSize);
                            if (TextBoxField[l].Text != "")
                                $(inputdiv).val(TextBoxField[l].Text);
                            else
                                $(inputdiv).val('');
                        }
                        else if (TextBoxField[l].Name == "RadioButton") {
                            inputdiv = document.createElement("input");
                            inputdiv.type = "radio";
                            if (TextBoxField[l].IsRequired) {
                                $(inputdiv).css("border", "1px solid red");
                                $(inputdiv).css("outline", "1px solid red");
                            }
                            else
                                $(inputdiv).css("border", TextBoxField[l].BorderWidth);
                            if (TextBoxField[l].Selected == true)
                                $(inputdiv).prop("checked", true);
                            $(inputdiv).val(TextBoxField[l].Value);
                            $(inputdiv).attr("name", TextBoxField[l].GroupName);
                            $(inputdiv).css("cursor", "pointer");
                            if (TextBoxField[l].IsReadonly || this._isFormFieldsDisabled) {
                                $(inputdiv).attr("disabled", true);
                                $(inputdiv).css("background-color", "none");
                                $(inputdiv).css("cursor", "default");
                            }
                            if (browserUserAgent.indexOf('Chrome') != -1)
                                $(inputdiv).css("-webkit-apperance", "none");
                        }
                        else if (TextBoxField[l].Name == "CheckBox") {
                            inputdiv = document.createElement("input");
                            inputdiv.type = "checkbox";
                            if (TextBoxField[l].IsRequired) {
                                $(inputdiv).css("border", "1px solid red");
                                $(inputdiv).css("outline", "1px solid red");
                            }
                            else
                                $(inputdiv).css("border", TextBoxField[l].BorderWidth);
                            if (TextBoxField[l].Selected == true)
                                $(inputdiv).prop('checked', true);
                            else if (browserUserAgent.indexOf('Chrome') != -1)
                                $(inputdiv).css("-webkit-appearance", "none");
                            $(inputdiv).attr("name", TextBoxField[l].GroupName);
                            var backColor = TextBoxField[l].BackColor;
                            if (TextBoxField[l].IsReadonly || this._isFormFieldsDisabled) {
                                $(inputdiv).attr("disabled", true);
                                $(inputdiv).css("background-color", "none");
                                $(inputdiv).css("cursor", "default");
                            }
                            else {
                                $(inputdiv).css("background-color", "rgba(" + backColor.R + "," + backColor.G + "," + backColor.B + "," + 0.2 + ")");
                                $(inputdiv).css("cursor", "pointer");
                            }
                        }
                        else if (TextBoxField[l].Name == "DropDown") {
                            inputdiv = document.createElement("select");
                            if (TextBoxField[l].IsRequired)
                                $(inputdiv).css("border", "1px solid red");
                            else
                                $(inputdiv).css("border", TextBoxField[l].BorderWidth);
                            $(inputdiv).attr("name", TextBoxField[l].Text);
                            if (TextBoxField[l].SelectedValue == "") {
                                var option = document.createElement("option");
                                option.id = "dropdownhide";
                                $(option).css("display", "none");
                                option.selected = "selected";
                                option.innerHTML = "";
                                inputdiv.appendChild(option);
                            }
                            for (var j = 0; j < TextBoxField[l].TextList.length; j++) {
                                var option = document.createElement("option");
                                option.className = "e-dropdownSelect";
                                if (TextBoxField[l].SelectedValue == TextBoxField[l].TextList[j])
                                    $(option).prop("selected", true);
                                else
                                    $(option).prop("selected", false);
                                option.innerHTML = TextBoxField[l].TextList[j];
                                inputdiv.appendChild(option);
                            }
                            var backColor = TextBoxField[l].BackColor;
                            if (TextBoxField[l].IsReadonly || this._isFormFieldsDisabled) {
                                $(inputdiv).attr("disabled", true);
                                $(inputdiv).css("background-color", "none");
                                $(inputdiv).css("cursor", "default");
                            }
                            else
                                $(inputdiv).css("background-color", "rgba(" + backColor.R + "," + backColor.G + "," + backColor.B + "," + 0.2 + ")");
                            $(inputdiv).css("color", "black");
                        }
                        else if (TextBoxField[l].Name == "ListBox") {
                            inputdiv = document.createElement("select");
                            $(inputdiv).attr("multiple", "multiple");
                            if (TextBoxField[l].IsRequired)
                                $(inputdiv).css("border", "1px solid red");
                            else
                                $(inputdiv).css("border", TextBoxField[l].BorderWidth);
                            $(inputdiv).attr("name", TextBoxField[l].Text);
                            for (var j = 0; j < TextBoxField[l].TextList.length; j++) {
                                var option = document.createElement("option");
                                option.className = "e-pdfviewer-ListBox"
                                for (var k = 0; k < TextBoxField[l].SelectedList.length; k++) {
                                    if (TextBoxField[l].SelectedList[k] == j)
                                        $(option).prop("selected", true);
                                }
                                option.innerHTML = TextBoxField[l].TextList[j];
                                inputdiv.appendChild(option);
                                var backColor = TextBoxField[l].BackColor;
                                var backColor = TextBoxField[l].BackColor;
                                if (TextBoxField[l].IsReadonly || this._isFormFieldsDisabled) {
                                    $(inputdiv).attr("disabled", true);
                                    $(inputdiv).css("background-color", "none");
                                    $(inputdiv).css("cursor", "default");
                                }
                                else
                                    $(inputdiv).css("background-color", "rgba(" + backColor.R + "," + backColor.G + "," + backColor.B + "," + 0.2 + ")");
                            }
                            $(inputdiv).css("color", "black");
                            if (TextBoxField[l].IsReadonly || this._isFormFieldsDisabled)
                                $(inputdiv).attr("disabled", true);
                        }
                        if (TextBoxField[l].Font != null) {
                            if (TextBoxField[l].Font.Bold || TextBoxField[l].Font.Italic || TextBoxField[l].Font.Strikeout ||
                                TextBoxField[l].Font.Underline) {
                                if (TextBoxField[l].Font.Italic)
                                    inputdiv.style.fontStyle = "italic";
                                if (TextBoxField[l].Font.Bold)
                                    inputdiv.style.fontWeight = "Bold";
                            }
                            $(inputdiv).css("font-family", TextBoxField[l].Font.Name);
                            var heights = this._convertPointToPixel(TextBoxField[l].Font.Height * this._zoomVal) + 'px';
                            $(inputdiv).css("font-size", heights);
                        }
                        if ($(inputdiv).css("background-color") == "rgba(255, 255, 255, 0.2)") {
                            $(inputdiv).css("background-color", "rgba(0, 20, 200, 0.2)");
                        }
                        if (!cropBoxValue)
                            cropBoxValue = 0;
                        inputdiv.style.borderStyle = "solid";
                        inputdiv.id = this._id + 'input_' + pageindex + '_' + l;
                        inputdiv.className = 'e-pdfviewer-formFields';
                        inputdiv.style.margin = "0px";
                        inputdiv.style.zIndex = 1000;
                        inputdiv.style.left = this._convertPointToPixel((boundingRect.X + cropBoxValue) * this._zoomVal) + 'px';
                        inputdiv.style.top = this._convertPointToPixel((boundingRect.Y + cropBoxValue) * this._zoomVal) + 'px';
                        inputdiv.style.width = this._convertPointToPixel(boundingRect.Width * this._zoomVal) + 'px';
                        inputdiv.style.height = this._convertPointToPixel(boundingRect.Height * this._zoomVal) + 'px';
                        inputdiv.style.position = 'absolute';
                        var selectioncanvas = document.getElementById(this._id + 'selectioncanvas_' + pageindex);
                        $('#' + this._id + 'selectioncanvas_' + pageindex).addClass('input_container');
                        selectioncanvas.appendChild(inputdiv);
                        var borderwidth;
                        var proxy = this;
                        var is_chrome = navigator.userAgent.indexOf('Chrome') != -1;
                        $(inputdiv).on("focus", function (e) {
                            var type = $(e.target).attr('type');
                            var list = $(e.target)[0].type;
                            var backgroundColour = $(e.target).css("background-color");
                            var currentIndex = backgroundColour.lastIndexOf(',');
                            var color = backgroundColour.slice(0, currentIndex + 1) + 0 + ")";
                            if (type == "checkbox" && is_chrome)
                                $(e.target).css("-webkit-appearance", "");
                            $(e.target).css("background-color", color);
                            borderwidth = e.target.style.borderWidth;
                            $(e.target).css('border-width', '0');
                            proxy._isFormFields = true;
                        });
                        $(inputdiv).on("blur", function (e) {
                            var type = $(e.target).attr('type');
                            var list = $(e.target)[0].type;
                            if (is_chrome)
                                var backgroundColour = $(e.target).css("background-color");
                            else
                                var backgroundColour = e.target.style["background-color"];
                            var currentIndex = backgroundColour.lastIndexOf(',');
                            if (type == "checkbox" && $(e.target).prop("checked") == true) {
                                var colors = backgroundColour.slice(0, currentIndex + 1) + 0 + ")";
                                $(e.target).css("background-color", colors);
                            }
                            else {
                                var color = backgroundColour.slice(0, currentIndex + 1) + 0.2 + ")";
                                $(e.target).css("background-color", color);
                            }
                            if (parseFloat(borderwidth) == 0)
                                $(e.target).css('border-width', "1px");
                            else
                                $(e.target).css('border-width', borderwidth);
                            proxy._isFormFields = false;
                        });
                        $(inputdiv).on("change", function (e) {
                            proxy.isDocumentEdited = true;
                        });
                        $(inputdiv).unbind('click').on("click touchstart", function (e) {
                            var type = $(e.target).attr('type');
                            var list = $(e.target)[0].type;
                            if (type == "password" || type == "text") {
                                $(e.target).select();
                                var target = $(e.target)[0];
                                $(target).on('keypress', function (e) {
                                    var MaxLength = $(target).attr("maxlength");
                                    if ($(target).val().length > (MaxLength - 2)) {
                                        var value = $(target).val() + String.fromCharCode(e.keyCode);
                                        $(target).val(value);
                                        $(target).blur();

                                    }
                                });
                                $(target).on("keyup", function (e) {
                                    var value = $(target).val();
                                    var jsonData = proxy._pageContents[proxy._currentPage];
                                    var jsdata = JSON.parse(jsonData);
                                    var TextBoxField = jsdata["pdfRenderedFields"];
                                    var field = (target.id).split("_");
                                    var fieldPosition = field[field.length - 1];
                                    if (value != TextBoxField[fieldPosition].Text) {
                                        proxy.isDocumentEdited = true;
                                    } else {
                                        proxy.isDocumentEdited = false;
                                    }
                                });
                                $(target).unbind('change').on("change", function (e) {
                                    var value = $(target).val();
                                    $(target).val(value);
                                });
                            }
                            if (type == "radio") {
                                var name = $(e.target).attr("name");
                                var radioButton = $('.e-pdfviewer-formFields:radio');
                                for (var m = 0; m < radioButton.length; m++) {
                                    if ($(radioButton[m]).attr("name") == name) {
                                        $(radioButton[m]).prop("checked", false);
                                    }
                                }
                                $(e.target).prop("checked", true);
                            }
                            else if (type == "checkbox") {
                                if ($(e.target).prop("checked") == true) {
                                    $(e.target).prop("checked", true);
                                    if (is_chrome)
                                        $(e.target).css("-webkit-appearance", "");
                                    $(e.target).css('border-width', "1px");
                                }
                                else {
                                    $(e.target).prop("checked", false);
                                    if (is_chrome)
                                        $(e.target).css("-webkit-appearance", "none");
                                }
                            }
                            else if (list == "select-one") {
                                proxy.isDocumentEdited = true;
                                var target = $(e.target)[0];
                                $(target).unbind('change').on("change", function (e) {
                                    var target = $(e.target)[0];
                                    var value = target.options[target.selectedIndex].text;
                                    var childrens = target.children;
                                    for (var k = 0; k < childrens.length; k++) {
                                        if (childrens[k].text == value)
                                            $(childrens[k]).prop("selected", true);
                                        else
                                            $(childrens[k]).prop("selected", false);
                                    }
                                });
                            }
                        });
                    }
                }
            }
        },
        _addAlignmentPropety: function (TextAlign, inputdiv) {
            var alignment = TextAlign.Alignment;
            switch (alignment) {
                case 0:
                    $(inputdiv).css("text-align", "left");
                    break;
                case 1:
                    $(inputdiv).css("text-align", "center");
                    break;
                case 2:
                    $(inputdiv).css("text-align", "right");
                    break;
                case 3:
                    $(inputdiv).css("text-align", "justify");
                    break;
            }
        },
        _saveFormFieldsValue: function () {
            var result = {};
            var values = {};
            $('#' + this._id + '_toolbar_download').parent().parents(".e-pdfviewer-toolbarul").css("visibility", "");
            var input = $('.e-pdfviewer-formFields');
            if (input != null) {
                for (var i = 0; i < input.length; i++) {
                    if (input[i].type == "text" || input[i].type == "password")
                        result[input[i].name] = input[i].value;
                    else if (input[i].type == "radio" && $(input[i]).prop("checked") == true)
                        result[input[i].name] = input[i].value;
                    else if (input[i].type == "checkbox") {
                        if ($(input[i]).prop("checked") == true)
                            result[input[i].name] = $(input[i]).prop("checked");
                        else
                            result[input[i].name] = $(input[i]).prop("checked");
                    }
                    else if (input[i].type == "select-one") {
                        result[input[i].name] = input[i].options[input[i].selectedIndex].text;
                    }
                    else if (input[i].type == "select-multiple") {
                        var text = [];
                        var children = $(input[i]).children();
                        for (var j = 0; j < children.length; j++) {
                            if ($(children[j]).prop("selected") == true)
                                text.push(children[j].text);
                        }
                        text = JSON.stringify(text);
                        result[input[i].name] = text;
                    }
                }
            }
            var annotationList = new Array();
            for (var i = 1; i <= this._totalPages; i++) {
                var newArray = [];
                var existingAnnotationList = this._textMarkupAnnotationList[i];
                if (existingAnnotationList) {
                    for (var j = 0; j < existingAnnotationList.length; j++) {
                        var annotation = existingAnnotationList[j];
                        if (annotation) {
                            var opacity = annotation.Opacity;
                            if (annotation.TextMarkupAnnotationType == "Highlight")
                                opacity = opacity * 0.5;
                            if (annotation.Author == null) {
                                annotation.Author = this.model.strikethroughSettings.author;
                            }
                            var dateObject = new Date(annotation.ModifiedDate.toString());
                            var dateString = (dateObject.getMonth() + 1) + '/' + dateObject.getDate() + '/' + dateObject.getFullYear() + " " + dateObject.getHours() + ":" + dateObject.getMinutes() + ":" + dateObject.getSeconds();
                            for (var k = 0; k < annotation.Bounds.length; k++) {
                                var newObject = {
                                    index: annotation.index,
                                    colorA: annotation.Opacity * 255,
                                    colorR: annotation.Color.R,
                                    colorG: annotation.Color.G,
                                    colorB: annotation.Color.B,
                                    opacity: opacity,
                                    type: annotation.TextMarkupAnnotationType,
                                    author: annotation.Author,
                                    subject: annotation.Subject,
                                    text: annotation.Note,
                                    xPosition: annotation.Bounds[k].X,
                                    yPosition: annotation.Bounds[k].Y,
                                    height: annotation.Bounds[k].Height,
                                    width: annotation.Bounds[k].Width,
                                    modifiedDate: dateString
                                }
                                newArray.push(newObject);
                            }
                        }
                    }
                }
                annotationList[i - 1] = newArray;
            }
            var newAnnotationList = new Array();
            for (var i = 1; i <= this._totalPages; i++) {
                var newArray = [];
                newAnnotationList[i - 1] = newArray;
                for (var j = 0; j < this._newAnnotationList[i - 1].length; j++) {
                    var annotation = this._newAnnotationList[i - 1][j];
                    var opacity = annotation.opacity;
                    if (annotation.type == "Highlight")
                        opacity = opacity * 0.5;
                    var dateObject = new Date(annotation.modifiedDate.toString());
                    var dateString = (dateObject.getMonth() + 1) + '/' + dateObject.getDate() + '/' + dateObject.getFullYear() + " " + dateObject.getHours() + ":" + dateObject.getMinutes() + ":" + dateObject.getSeconds();
                    for (var k = 0; k < annotation.bounds.length; k++) {
                        var newObject = {
                            type: annotation.type,
                            xPosition: annotation.bounds[k].xPosition,
                            yPosition: annotation.bounds[k].yPosition,
                            height: annotation.bounds[k].height,
                            width: annotation.bounds[k].width,
                            colorA: annotation.colorA,
                            colorR: annotation.colorR,
                            colorG: annotation.colorG,
                            colorB: annotation.colorB,
                            opacity: opacity,
                            author: annotation.author,
                            subject: annotation.subject,
                            text: annotation.note,
                            modifiedDate: dateString
                        }
                        newArray.push(newObject);
                    }
                }
                newAnnotationList[i - 1] = newArray;
            }
            this._saveSignatureControl();
            values["savetextMarkupAnnotation"] = JSON.stringify(newAnnotationList);
            values["existingAnnotations"] = JSON.stringify(annotationList);
            values["savedFields"] = JSON.stringify(result);
            values["signatureFields"] = JSON.stringify(this._completeSign);
            values["id"] = this._fileId;
            var newFileID;
            if (this._completeSign.length > 0) {
                newFileID = this._createSignatureID();
                this._signatureLayer.push(newFileID);
            }
            values["signatureValues"] = JSON.stringify(this._signatureLayer);
            values["newFileID"] = newFileID;
            this._saveAs("POST", this.model.serviceUrl, JSON.stringify(values));
        },
        _saveSignatureControl: function () {
            this._completeSign = [];
            var signature = $('.e-pdfviewer-imagecanvasDraw');
            var leftDifference = 0;
            var topDifference = 0;
            for (var i = 0; i < signature.length; i++) {
                var leftDifference = 0;
                var topDifference = 0;
                var angle = 0;
                var signatureElement = signature[i];
                var signatureResult = new Array();
                var signatureContext = signatureElement.getContext("2d");
                var pageIndex = signatureElement.id.split('imagecanvasDraw_')[1].split('_')[0];
                var hex = signatureContext.strokeStyle;
                var r1 = parseInt(hex.slice(1, 3), 16),
                    g1 = parseInt(hex.slice(3, 5), 16),
                    b1 = parseInt(hex.slice(5, 7), 16);
                var newResult = {
                    id: signatureElement.id,
                    xPosition: ((parseFloat($(signatureElement).css("left")))) / this._zoomVal,
                    yPosition: ((parseFloat($(signatureElement).css("top")))) / this._zoomVal,
                    height: parseInt(parseFloat($(signatureElement).css("height")) / this._zoomVal),
                    width: parseInt(parseFloat($(signatureElement).css("width")) / this._zoomVal),
                    path: this._outputPath[signatureElement.id],
                    pageIndex: pageIndex,
                    rotation: angle,
                    valueChange: this._valueChanges[signatureElement.id],
                    zoomValue: this._zoomVal,
                    colorA: (parseFloat($(signatureElement).css("opacity")) * 255),
                    colorR: r1,
                    colorG: g1,
                    colorB: b1,
                }
                signatureResult.push(newResult);
                this._completeSign.push(signatureResult);
            }
        },
        _saveAs: function (type, actionUrl, data) {
            var proxy = this;
            if (this._ajaxDownloaded != null) {
                this._ajaxDownloaded.abort();
                this._ajaxDownloaded = null;
            }
            this._ajaxDownloaded = ($.ajax({
                type: type,
                url: actionUrl + '/' + this.model.serverActionSettings.download,
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: data,
                traditional: true,
                async: this._isAsynchronousDownload,
                success: function (data) {
                    if (this._cancelDownloads) {
                        proxy._downloadAborted();
                        return;
                    }
                    if (data) {
                        proxy._save(data);
                        var downloaded = new Object();
                        downloaded.fileName = proxy._downloadfileName;
                        downloaded.status = "is completed"
                        proxy._raiseClientEvent("downloadEnd", downloaded);
                    }
                },
                error: function (msg, textStatus, errorThrown) {
                    if (proxy._cancelDownloads && errorThrown == "abort") {
                        proxy._downloadAborted();
                    }
                    proxy._raiseClientEvent("ajaxRequestFailure", msg.responseText);
                }
            }))
        },
        _downloadAborted: function () {
            var proxy = this;
            var downloadaborted = new Object();
            downloadaborted.fileName = proxy._downloadfileName;
            downloadaborted.status = "is aborted"
            proxy._raiseClientEvent("downloadEnd", downloadaborted);
        },
        _generateFormFields: function (jsondata, pageindex) {
            var TextBoxField = jsondata["pdfRenderedFields"];
            var cropBoxValue = jsondata["cropBoxValue"];
            var backgroundcolor;
            if (TextBoxField != null) {
                for (var l = 0; l < TextBoxField.length; l++) {
                    var boundingRect = TextBoxField[l].LineBounds;
                    var inputdiv = document.getElementById(this._id + 'input_' + pageindex + '_' + l);
                    if ((TextBoxField[l].PageIndex + 1) == pageindex) {
                        if (TextBoxField[l].Name == "Password" || TextBoxField[l].Name == "Textbox") {
                            var backColor = TextBoxField[l].BackColor;
                            var foreColor = TextBoxField[l].FontColor;
                            this._addAlignmentPropety(TextBoxField[l], inputdiv);
                            if (TextBoxField[l].IsRequired)
                                $(inputdiv).css("border", "1px solid red");
                            else
                                $(inputdiv).css("border", TextBoxField[l].BorderWidth);
                            if (TextBoxField[l].IsReadonly || this._isFormFieldsDisabled) {
                                $(inputdiv).attr("disabled", true);
                                $(inputdiv).css("background-color", "none");
                                $(inputdiv).css("cursor", "default");
                            }
                            else
                                $(inputdiv).css("background-color", "rgba(" + backColor.R + "," + backColor.G + "," + backColor.B + "," + 0.2 + ")");
                            $(inputdiv).css("color", "rgb(" + foreColor.R + "," + foreColor.G + "," + foreColor.B + ")");
                            var fontSize = this._convertPointToPixel(TextBoxField[l].Font.Height * this._zoomVal) + 'px';
                            if (TextBoxField[l].MaxLength > 0) {
                                $(inputdiv).attr("maxlength", TextBoxField[l].MaxLength);
                            }
                            if (TextBoxField[l].InsertSpaces)
                                $(inputdiv).css("letter-spacing", fontSize);
                            var value = $(inputdiv).val();
                            $(inputdiv).val(value);
                        }
                        else if (TextBoxField[l].Name == "RadioButton") {
                            if (TextBoxField[l].IsRequired) {
                                $(inputdiv).css("border", "1px solid red");
                                $(inputdiv).css("outline", "1px solid red");
                            }
                            else
                                $(inputdiv).css("border", TextBoxField[l].BorderWidth);
                            if (TextBoxField[l].IsReadonly || this._isFormFieldsDisabled)
                                $(inputdiv).css("disabled", true);
                            if ($(inputdiv).prop("checked") == true)
                                $(inputdiv).prop("checked", true);
                            $(inputdiv).attr("name", TextBoxField[l].GroupName);
                            if (TextBoxField[l].IsReadonly || this._isFormFieldsDisabled) {
                                $(inputdiv).attr("disabled", true);
                                $(inputdiv).css("background-color", "none");
                                $(inputdiv).css("cursor", "default");
                            }
                            else
                                $(inputdiv).css("cursor", "pointer");
                        }
                        else if (TextBoxField[l].Name == "CheckBox") {
                            var backColor = TextBoxField[l].BackColor;

                            if (TextBoxField[l].IsRequired) {
                                $(inputdiv).css("border", "1px solid red");
                                $(inputdiv).css("outline", "1px solid red");
                            }
                            else
                                $(inputdiv).css("border", TextBoxField[l].BorderWidth);
                            if (TextBoxField[l].IsReadonly || this._isFormFieldsDisabled)
                                $(inputdiv).css("disabled", true);
                            if ($(inputdiv).prop("checked") == true)
                                $(inputdiv).prop('checked', true);
                            if (TextBoxField[l].IsReadonly || this._isFormFieldsDisabled) {
                                $(inputdiv).attr("disabled", true);
                                $(inputdiv).css("background-color", "none");
                                $(inputdiv).css("cursor", "default");
                            }
                            else {
                                $(inputdiv).css("background-color", "rgba(" + backColor.R + "," + backColor.G + "," + backColor.B + "," + 0.2 + ")");
                                $(inputdiv).css("cursor", "pointer");
                            }
                        }
                        else if (TextBoxField[l].Name == "DropDown") {
                            if (TextBoxField[l].IsRequired)
                                $(inputdiv).css("border", "1px solid red");
                            else
                                $(inputdiv).css("border", TextBoxField[l].BorderWidth);
                            if (TextBoxField[l].IsReadonly || this._isFormFieldsDisabled)
                                $(inputdiv).css("disabled", true);
                            if (TextBoxField[l].SelectedValue == "") {
                                var option = $(inputdiv).children()[0];
                                option.id = "dropdownhide";
                                $(option).css("display", "none");
                                if ($(option).prop("selected") == true)
                                    $(option).prop('selected', true);
                                option.innerHTML = "";
                            }
                            for (var j = 0; j < TextBoxField[l].TextList.length; j++) {
                                var option;
                                if ($(inputdiv).children()[0].id == "dropdownhide")
                                    option = $(inputdiv).children()[j + 1];
                                else
                                    option = $(inputdiv).children()[j];
                                if ($(option).prop("selected") == true)
                                    $(option).prop('selected', true);
                                option.innerHTML = TextBoxField[l].TextList[j];
                                var backColor = TextBoxField[l].BackColor;
                                if (TextBoxField[l].IsReadonly || this._isFormFieldsDisabled) {
                                    $(inputdiv).attr("disabled", true);
                                    $(inputdiv).css("background-color", "none");
                                    $(inputdiv).css("cursor", "default");
                                }
                                else
                                    $(inputdiv).css("background-color", "rgba(" + backColor.R + "," + backColor.G + "," + backColor.B + "," + 0.2 + ")");
                            }
                            $(inputdiv).css("color", "black");
                        }
                        else if (TextBoxField[l].Name == "ListBox") {
                            $(inputdiv).attr("multiple", "multiple");
                            if (TextBoxField[l].IsRequired)
                                $(inputdiv).css("border", "1px solid red");
                            else
                                $(inputdiv).css("border", TextBoxField[l].BorderWidth);
                            if (TextBoxField[l].IsReadonly || this._isFormFieldsDisabled)
                                $(inputdiv).css("disabled", true);
                            for (var j = 0; j < TextBoxField[l].TextList.length; j++) {
                                var option = $(inputdiv).children()[j];
                                if ($(option).prop("selected") == true)
                                    $(option).prop('selected', true);
                                else
                                    $(option).prop('selected', false);
                                option.innerHTML = TextBoxField[l].TextList[j];
                                var backColor = TextBoxField[l].BackColor;
                                if (TextBoxField[l].IsReadonly || this._isFormFieldsDisabled) {
                                    $(inputdiv).attr("disabled", true);
                                    $(inputdiv).css("background-color", "none");
                                    $(inputdiv).css("cursor", "default");
                                }
                                else
                                    $(inputdiv).css("background-color", "rgba(" + backColor.R + "," + backColor.G + "," + backColor.B + "," + 0.2 + ")");
                            }
                            $(inputdiv).css("color", "black");
                        }
                        if (TextBoxField[l].Font != null) {
                            if (TextBoxField[l].Font.Bold || TextBoxField[l].Font.Italic || TextBoxField[l].Font.Strikeout ||
                                TextBoxField[l].Font.Underline) {
                                if (TextBoxField[l].Font.Italic)
                                    inputdiv.style.fontStyle = "italic";
                                if (TextBoxField[l].Font.Bold)
                                    inputdiv.style.fontWeight = "Bold";
                            }
                            $(inputdiv).css("font-family", TextBoxField[l].Font.Name);
                            var heights = this._convertPointToPixel(TextBoxField[l].Font.Height * this._zoomVal) + 'px';
                            $(inputdiv).css("font-size", heights);
                        }
                        if ($(inputdiv).css("background-color") == "rgba(255, 255, 255, 0.2)") {
                            $(inputdiv).css("background-color", "rgba(0, 20, 200, 0.2)");
                        }
                        if (!cropBoxValue)
                            cropBoxValue = 0;
                        inputdiv.style.borderStyle = "solid";
                        inputdiv.style.margin = "0px";
                        inputdiv.style.zIndex = 1000;
                        inputdiv.style.left = this._convertPointToPixel((boundingRect.X + cropBoxValue) * this._zoomVal) + 'px';
                        inputdiv.style.top = this._convertPointToPixel((boundingRect.Y + cropBoxValue) * this._zoomVal) + 'px';
                        inputdiv.style.width = this._convertPointToPixel(boundingRect.Width * this._zoomVal) + 'px';
                        inputdiv.style.height = this._convertPointToPixel(boundingRect.Height * this._zoomVal) + 'px';
                        inputdiv.style.position = 'absolute';
                    }
                }
            }
        },

        _textSelection: function (jsondata, pageindex, context) {
            //Text selection line by line
            var is_edge = navigator.userAgent.indexOf("Edge") != -1;
            var isnbsp;
            var is_edgeNew = document.documentMode || /Edge/.test(navigator.userAgent);
            var is_ie = navigator.userAgent.indexOf("MSIE") != -1 || !!document.documentMode == true;
            var selectionlines = jsondata["selection"];
            var textDivs = [];
            var textContents = [];
            var re = new RegExp(String.fromCharCode(160), "g");
            for (var l = 0; l < selectionlines.length; l++) {
                var innerText = " ";
                var boundingRect = selectionlines[l].LineBounds;
                var textdiv = document.createElement("DIV");
                textdiv.id = this._id + 'text_' + pageindex + '_' + l;
                textdiv.className = 'e-pdfviewer-textLayer';
                var text = selectionlines[l].Line;
                text = text.replace(/</g, "&lt;");
                text = text.replace(/>/g, "&gt;");
                var x = new RegExp("[\x00-\x80]+"); // is ascii
                var isAscii = x.test(text);
                var isRtl = this._isRtl(text);
                if (!isAscii && isRtl) {
                    var re = new RegExp(String.fromCharCode(160), "g");
                    text = text.replace(re, " ");
                    text = text.split("").reverse().join("");
                    textContents.push(text);
                }
                else {
                    textContents.push(selectionlines[l].Line.toString());
                }
                if (is_edgeNew && !is_ie) {
                    textdiv.innerHTML = text;
                }
                else {
                    if (this._previousBounds == parseInt(boundingRect.Y) || this._previousBounds == parseInt((boundingRect.Y) + 1) || this._previousBounds == parseInt((boundingRect.Y) - 1)) {
                        innerText = document.getElementById(this._id + 'text_' + pageindex + '_' + (l - 1));
                        if (innerText.innerHTML != " ") {
                            innerText.innerHTML = innerText.innerHTML.replace(/&nbsp;/g, ' ');
                            innerText.innerHTML = innerText.innerHTML.replace(/(\r\n|\n|\r)/gm, "");
                        }
                    }
                    this._previousBounds = parseInt(boundingRect.Y);
                    textdiv.innerHTML = text + "\r\n";
                    $(textdiv).filter(function () {
                        isnbsp = $(textdiv).html().match(/&nbsp;/);
                    });
                    if (isnbsp !== null) {
                        this._isNonBreackingCharacter = true;
                    }
                    textdiv.innerHTML = textdiv.innerHTML.replace(/&nbsp;/g, ' ');
                }
                textdiv.innerHTML = textdiv.innerHTML.replace(/&nbsp;/g, ' ')
                var newLines = text.replace(/  +/g, ' ');
                if (newLines != " ") {
                    textdiv.style.whiteSpace = 'pre';
                }
                textdiv.style.background = 'transparent';
                textdiv.style.position = 'absolute';
                textdiv.style.left = this._convertPointToPixel(boundingRect.X * this._zoomVal) + 'px';
                textdiv.style.top = this._convertPointToPixel(boundingRect.Y * this._zoomVal) + 'px';
                textdiv.style.width = this._convertPointToPixel(boundingRect.Width * this._zoomVal) + 'px';
                textdiv.style.color = 'transparent';
                textdiv.style.fontSize = this._convertPointToPixel(boundingRect.Height * this._zoomVal) + 'px';
                textdiv.style.fontFamily = 'sans-serif';
                textdiv.style.opacity = '0.2';
                textdiv.style.transformOrigin = '0%';
                //settting the properties of div to context to calculate the width of the text in canvas
                context.fontFamily = 'sans-serif'
                context.fontSize = textdiv.style.fontSize;
                context.font = textdiv.style.fontSize + " " + textdiv.style.fontFamily;
                //scaling the div to match the width of the line in canvas
                var ctxwidth = context.measureText(selectionlines[l].Line).width;
                var scale = parseFloat(textdiv.style.width) / ctxwidth;
                textdiv.style.transform = 'scaleX(' + scale + ')';
                var selectioncanvas = document.getElementById(this._id + 'selectioncanvas_' + pageindex);
                $('#' + this._id + 'selectioncanvas_' + pageindex).addClass('text_container');
                selectioncanvas.appendChild(textdiv);
                var selectioncanvasWidth = selectioncanvas.getBoundingClientRect();
                var textDivWidth = textdiv.getBoundingClientRect();
                if ((textDivWidth.width + textDivWidth.left) >= (selectioncanvasWidth.width + selectioncanvasWidth.left) || (textDivWidth.width > selectioncanvasWidth.width)) {
                    $(textdiv).css("width", "auto");
                    var newWidth = textdiv.clientWidth;
                    $(textdiv).css("width", newWidth + "px");
                }
                textDivs.push(textdiv);
            }
            this._previousBounds = null;
            this._textDivs[pageindex] = textDivs;
            this._textContents[pageindex] = textContents;
            //Text selection line by line
        },

        _resizeSelection: function (jsondata, pageindex, context) {
            var selectionlines = jsondata["selection"];
            for (var l = 0; l < selectionlines.length; l++) {
                var boundingRect = selectionlines[l].LineBounds;
                var textdiv = document.getElementById(this._id + 'text_' + pageindex + '_' + l);
                if (textdiv) {
                    var text = selectionlines[l].Line;
                    textdiv.style.position = 'absolute';
                    textdiv.style.left = this._convertPointToPixel(boundingRect.X * this._zoomVal) + 'px';
                    textdiv.style.top = this._convertPointToPixel(boundingRect.Y * this._zoomVal) + 'px';
                    textdiv.style.width = this._convertPointToPixel(boundingRect.Width * this._zoomVal) + 'px';
                    var newLines = text.replace(/  +/g, ' ');
                    if (newLines != " ") {
                        textdiv.style.whiteSpace = 'pre';
                    }
                    textdiv.style.transformOrigin = '0%';
                    textdiv.style.opacity = '0.2';
                    textdiv.style.fontSize = this._convertPointToPixel(boundingRect.Height * this._zoomVal) + 'px';
                    context.font = textdiv.style.fontSize + " " + textdiv.style.fontFamily;
                    context.fontSize = textdiv.style.fontSize;
                    var ctxwidth = context.measureText(selectionlines[l].Line).width;
                    var scale = parseFloat(textdiv.style.width) / ctxwidth;
                    textdiv.style.transform = 'scaleX(' + scale + ')';
                    var selectioncanvas = document.getElementById(this._id + 'selectioncanvas_' + pageindex);
                    var selectioncanvasWidth = selectioncanvas.getBoundingClientRect();
                    var textDivWidth = textdiv.getBoundingClientRect();
                    if ((textDivWidth.width + textDivWidth.left) >= (selectioncanvasWidth.width + selectioncanvasWidth.left) || (textDivWidth.width > selectioncanvasWidth.width)) {
                        $(textdiv).css("width", "auto");
                        var newWidth = textdiv.clientWidth;
                        $(textdiv).css("width", newWidth + "px");
                    }
                }
            }
        },

        _maintainSelection: function () {
            var selection = this._selectionNodes;
            var range = document.createRange();
            if (selection.anchorNode != null) {
                var position = selection.anchorNode.compareDocumentPosition(selection.focusNode)
                var backward = false;
                if (!position && selection.anchorOffset > selection.focusOffset ||
                    position === Node.DOCUMENT_POSITION_PRECEDING)
                    backward = true;
                if (backward) {
                    range.setStart(selection.focusNode, selection.focusOffset);
                    range.setEnd(selection.anchorNode, selection.anchorOffset);
                }
                else {
                    range.setStart(selection.anchorNode, selection.anchorOffset);
                    range.setEnd(selection.focusNode, selection.focusOffset);
                }
                this._selectionRange = range;
            }
            selection.removeAllRanges();
        },

        /*function helps to enable and disable the loading indicator of the requested page*/
        _showPageLoadingIndicator: function (pageIndex, isShow) {
            if (isShow) {
                $('#' + this._id + 'pageDiv_' + pageIndex + '_WaitingPopup').css('display', 'block');
            }
            else {
                $('#' + this._id + 'pageDiv_' + pageIndex + '_WaitingPopup').css('display', 'none');
            }
        },

        _imageRendering: function (shapes, imageDataCollection, imageObjCollection, imageTransformCollection, context, index, pageDataCollection, currentIndexCollection, charPath, canvas, currentindex, imageIndex, imageFilter) {
            var zoomValue = this._zoomVal;
            var imageObject = new Image();
            var proxy = this;
            var browserUserAgent = navigator.userAgent;
            var is_chrome = navigator.userAgent.indexOf('Chrome') != -1;
            var is_firefox = navigator.userAgent.indexOf('Firefox') != -1;
            if ((is_chrome || is_firefox) && imageFilter == "CCITTFaxDecode") {
                var isImageContentChanged = false;
                var ratio = proxy._scalingTextContent(context);
                for (var l = 0; l < imageTransformCollection.length; l++) {
                    if (isImageContentChanged == false) {
                        var matrixData = imageTransformCollection[l];
                        context.setTransform(matrixData[0] * zoomValue * ratio, matrixData[1] * zoomValue * ratio, matrixData[2] * zoomValue * ratio, matrixData[3] * zoomValue * ratio, matrixData[4] * zoomValue * ratio, matrixData[5] * zoomValue * ratio);
                        if (imageDataCollection[imageIndex] != undefined) {
                            context.drawImage(imageDataCollection[imageIndex], 0, 0, 1, 1);
                        }
                        var dataIndex = currentIndexCollection[l];
                        dataIndex = dataIndex + 1;
                        var data = pageDataCollection[l];
                        while (dataIndex < data.length) {
                            var pathdata = data[dataIndex];
                            var color = pathdata["color"];
                            var matrix = pathdata["matrix"];
                            if (matrix != null)
                                matrix = matrix["Elements"];
                            var brushMode = pathdata["brush"];
                            var pathValue = pathdata["pathValue"];
                            var isClipping = pathdata["iscliping"];
                            var restoreCanvas = pathdata["restorecanvas"];
                            var imageData = pathdata["imagedata"];
                            var fillMode = pathdata["fillrule"];
                            var fillStroke = pathdata["isFillandStroke"];
                            var fillColor = pathdata["fillcolor"];
                            var strokeColor = pathdata["strokecolor"];
                            var lineWidth = pathdata["linewidth"];
                            var lineCap = pathdata["linecap"];
                            var linearGradient = pathdata["linearGradientBrush"];
                            var textureBrush = pathdata["textureBrushs"];
                            var charID = pathdata["charID"];
                            var rectangle = pathdata["rectvalue"];
                            var alpha = pathdata["alpha"];
                            var filter = pathdata["filters"];
                            var dashedPattern = pathdata["dashPattern"];
                            if (dashedPattern != null && dashedPattern.length > 0) {
                                context.setLineDash(dashedPattern);
                            }
                            if (pathValue != null) {
                                pathValue = pathValue.split(";");
                                if (charID)
                                    charPath[charID] = pathValue;
                            }
                            else if (pathValue == null && charID) {
                                pathValue = charPath[charID];
                            }
                            if (restoreCanvas == false) {
                                context.save();
                            }
                            if (pathValue != undefined) {
                                context.setTransform(matrix[0] * zoomValue * ratio, matrix[1] * zoomValue * ratio, matrix[2] * zoomValue * ratio, matrix[3] * zoomValue * ratio, matrix[4] * zoomValue * ratio, matrix[5] * zoomValue * ratio);
                            }

                            if (pathValue != null) {
                                context.beginPath();

                                for (var i = 0; i < pathValue.length; i++) {
                                    var val = pathValue[i];
                                    var pathType = val[0];
                                    if (pathType == "M") {
                                        val = val.substring(1, val.length);
                                        val = val.split(" ");
                                        context.moveTo((val[0]), val[1]);
                                    }
                                    else if (pathType == "L") {
                                        val = val.substring(1, val.length);
                                        val = val.split(" ");
                                        context.lineTo((val[0]), val[1]);
                                    }
                                    else if (pathType == "C") {
                                        val = val.substring(1, val.length);
                                        val = val.split(" ");
                                        context.bezierCurveTo(val[0], val[1], val[2], val[3], val[4], val[5]);
                                    }
                                    else if (pathType == "Z") {
                                        context.closePath();
                                    }
                                }
                                if (isClipping == true) {
                                    if (fillMode == "evenodd") {
                                        context.msFillRule = "evenodd";
                                        context.mozFillRule = "evenodd";
                                        context.clip(fillMode);
                                    }
                                    context.clip();

                                }
                                else {
                                    if (fillStroke == undefined) {
                                        if (brushMode == "Fill") {
                                            if (linearGradient != undefined) {
                                                context.fillStyle = proxy._getGradientBrush(linearGradient, context);
                                            }
                                            else if (textureBrush != undefined) {
                                                context.fillStyle = proxy._createTextureBrush(textureBrush, context, pathdata);
                                            }
                                            else {
                                                if (alpha != undefined)
                                                    context.globalAlpha = alpha;
                                                context.fillStyle = color;
                                            }
                                            if (fillMode == "evenodd") {
                                                context.msFillRule = "evenodd";
                                                context.mozFillRule = "evenodd";
                                                context.fill(fillMode);
                                            }
                                            context.fill();
                                        }
                                        else if (brushMode == "FillandStroke") {
                                            context.fillStyle = color;
                                            context.lineWidth = lineWidth;
                                            context.fill();
                                            context.strokeStyle = strokeColor;
                                            context.stroke();
                                        }
                                        else if (brushMode == "Stroke") {
                                            context.strokeStyle = strokeColor;
                                            context.lineWidth = lineWidth;
                                            context.lineCap = lineCap;
                                            context.stroke();
                                        }
                                        else {
                                            context.strokeStyle = color;
                                            context.lineWidth = lineWidth;
                                            context.lineCap = lineCap;
                                            context.stroke();
                                        }
                                    }
                                    else {
                                        context.strokeStyle = strokeColor;
                                        context.lineWidth = lineWidth;
                                        context.lineCap = lineCap;
                                        context.stroke();
                                        if (linearGradient != undefined) {
                                            context.fillStyle = proxy._getGradientBrush(linearGradient, context);
                                        }
                                        else if (textureBrush != undefined) {
                                            context.fillStyle = proxy._createTextureBrush(textureBrush, context, pathdata);
                                        }
                                        else
                                            context.fillStyle = fillColor;
                                        if (fillMode == "evenodd") {
                                            context.msFillRule = "evenodd";
                                            context.mozFillRule = "evenodd";
                                            context.fill(fillMode);
                                        }
                                        context.fill();
                                    }
                                }
                            }

                            if (restoreCanvas)
                                context.restore();
                            if (imageData != undefined) {
                                isImageContentChanged = true;
                                imageObjCollection.pop();
                                imageTransformCollection.pop();
                                pageDataCollection.pop();
                                currentIndexCollection.pop();
                                imageObjCollection.push(imageData);
                                imageTransformCollection.push(matrix);
                                pageDataCollection.push(shapes);
                                currentIndexCollection.push(dataIndex);
                                imageFilter.pop();
                                imageFilter.push(filter);
                                l = -1;
                                imageIndex++;
                                break;
                            }
                            dataIndex++;
                        }
                    }
                    else {
                        proxy._imageRendering(shapes, imageDataCollection, imageObjCollection, imageTransformCollection, context, l, pageDataCollection, currentIndexCollection, charPath, canvas, currentindex, imageIndex, imageFilter);
                        imageIndex++;
                    }
                }
            }
            else {
                imageObject.onload = function () {
                    var isImageContentChanged = false;
                    var ratio = proxy._scalingTextContent(context);
                    for (var l = 0; l < imageTransformCollection.length; l++) {
                        if (isImageContentChanged == false) {
                            var matrixData = imageTransformCollection[l];
                            context.setTransform(matrixData[0] * zoomValue * ratio, matrixData[1] * zoomValue * ratio, matrixData[2] * zoomValue * ratio, matrixData[3] * zoomValue * ratio, matrixData[4] * zoomValue * ratio, matrixData[5] * zoomValue * ratio);
                            if (imageDataCollection[imageIndex] != undefined) {
                                context.drawImage(imageDataCollection[imageIndex], 0, 0, 1, 1);
                            }
                            var dataIndex = currentIndexCollection[l];
                            dataIndex = dataIndex + 1;
                            var data = pageDataCollection[l];
                            while (dataIndex < data.length) {
                                var pathdata = data[dataIndex];
                                var color = pathdata["color"];
                                var matrix = pathdata["matrix"];
                                if (matrix != null)
                                    matrix = matrix["Elements"];
                                var brushMode = pathdata["brush"];
                                var pathValue = pathdata["pathValue"];
                                var isClipping = pathdata["iscliping"];
                                var restoreCanvas = pathdata["restorecanvas"];
                                var imageData = pathdata["imagedata"];
                                var fillMode = pathdata["fillrule"];
                                var fillStroke = pathdata["isFillandStroke"];
                                var fillColor = pathdata["fillcolor"];
                                var strokeColor = pathdata["strokecolor"];
                                var lineWidth = pathdata["linewidth"];
                                var lineCap = pathdata["linecap"];
                                var linearGradient = pathdata["linearGradientBrush"];
                                var textureBrush = pathdata["textureBrushs"];
                                var charID = pathdata["charID"];
                                var rectangle = pathdata["rectvalue"];
                                var alpha = pathdata["alpha"];
                                var dashedPattern = pathdata["dashPattern"];
                                if (dashedPattern != null && dashedPattern.length > 0) {
                                    context.setLineDash(dashedPattern);
                                }
                                if (pathValue != null) {
                                    pathValue = pathValue.split(";");
                                    if (charID)
                                        charPath[charID] = pathValue;
                                }
                                else if (pathValue == null && charID) {
                                    pathValue = charPath[charID];
                                }
                                if (restoreCanvas == false) {
                                    context.save();
                                }
                                if (pathValue != undefined) {
                                    context.setTransform(matrix[0] * zoomValue * ratio, matrix[1] * zoomValue * ratio, matrix[2] * zoomValue * ratio, matrix[3] * zoomValue * ratio, matrix[4] * zoomValue * ratio, matrix[5] * zoomValue * ratio);
                                }

                                if (pathValue != null) {
                                    context.beginPath();
                                    for (var i = 0; i < pathValue.length; i++) {
                                        var val = pathValue[i];
                                        var pathType = val[0];
                                        if (pathType == "M") {
                                            val = val.substring(1, val.length);
                                            val = val.split(" ");
                                            context.moveTo((val[0]), val[1]);
                                        }
                                        else if (pathType == "L") {
                                            val = val.substring(1, val.length);
                                            val = val.split(" ");
                                            context.lineTo((val[0]), val[1]);
                                        }
                                        else if (pathType == "C") {
                                            val = val.substring(1, val.length);
                                            val = val.split(" ");
                                            context.bezierCurveTo(val[0], val[1], val[2], val[3], val[4], val[5]);
                                        }
                                        else if (pathType == "Z") {
                                            context.closePath();
                                        }
                                    }
                                    if (isClipping == true) {
                                        if (fillMode == "evenodd") {
                                            context.msFillRule = "evenodd";
                                            context.mozFillRule = "evenodd";
                                            context.clip(fillMode);
                                        }
                                        context.clip();

                                    }
                                    else {
                                        if (fillStroke == undefined) {
                                            if (brushMode == "Fill") {
                                                if (linearGradient != undefined) {
                                                    context.fillStyle = proxy._getGradientBrush(linearGradient, context);
                                                }
                                                else if (textureBrush != undefined) {
                                                    context.fillStyle = proxy._createTextureBrush(textureBrush, context, pathdata);
                                                }
                                                else {
                                                    if (alpha != undefined)
                                                        context.globalAlpha = alpha;
                                                    context.fillStyle = color;
                                                }
                                                if (fillMode == "evenodd") {
                                                    context.msFillRule = "evenodd";
                                                    context.mozFillRule = "evenodd";
                                                    context.fill(fillMode);
                                                }
                                                context.fill();
                                            }
                                            else if (brushMode == "FillandStroke") {
                                                context.fillStyle = color;
                                                context.lineWidth = lineWidth;
                                                context.fill();
                                                context.strokeStyle = strokeColor;
                                                context.stroke();
                                            }
                                            else if (brushMode == "Stroke") {
                                                context.strokeStyle = strokeColor;
                                                context.lineWidth = lineWidth;
                                                context.lineCap = lineCap;
                                                context.stroke();
                                            }
                                            else {
                                                context.strokeStyle = color;
                                                context.lineWidth = lineWidth;
                                                context.lineCap = lineCap;
                                                context.stroke();
                                            }
                                        }
                                        else {
                                            context.strokeStyle = strokeColor;
                                            context.lineWidth = lineWidth;
                                            context.lineCap = lineCap;
                                            context.stroke();
                                            if (linearGradient != undefined) {
                                                context.fillStyle = proxy._getGradientBrush(linearGradient, context);
                                            }
                                            else if (textureBrush != undefined) {
                                                context.fillStyle = proxy._createTextureBrush(textureBrush, context, pathdata);
                                            }
                                            else
                                                context.fillStyle = fillColor;
                                            if (fillMode == "evenodd") {
                                                context.msFillRule = "evenodd";
                                                context.mozFillRule = "evenodd";
                                                context.fill(fillMode);
                                            }
                                            context.fill();
                                        }
                                    }
                                }

                                if (restoreCanvas)
                                    context.restore();
                                if (imageData != undefined) {
                                    isImageContentChanged = true;
                                    imageObjCollection.pop();
                                    imageTransformCollection.pop();
                                    pageDataCollection.pop();
                                    currentIndexCollection.pop();
                                    imageObjCollection.push(imageData);
                                    imageTransformCollection.push(matrix);
                                    pageDataCollection.push(shapes);
                                    currentIndexCollection.push(dataIndex);
                                    l = -1;
                                    imageIndex++;
                                    break;
                                }
                                dataIndex++;
                            }
                        }
                        else {
                            proxy._imageRendering(shapes, imageDataCollection, imageObjCollection, imageTransformCollection, context, l, pageDataCollection, currentIndexCollection, charPath, canvas, currentindex, imageIndex);
                            imageIndex++;
                        }
                    }
                    if (dataIndex == shapes.length) {
                        if (proxy._pageSize[currentindex - 1].PageRotation != 0) {
                            var tempcanvas = document.getElementById(proxy._id + 'pagecanvas_' + currentindex);
                            var canvasUrl = tempcanvas.toDataURL();
                            var ctx = tempcanvas.getContext('2d');
                            var image = new Image();
                            image.onload = function () {
                                ctx.clearRect(0, 0, tempcanvas.width, tempcanvas.height);
                                if (proxy._pageSize[currentindex - 1].PageRotation == 90 || proxy._pageSize[currentindex - 1].PageRotation == 270) {
                                    tempcanvas.width = proxy._zoomVal * proxy._pageSize[currentindex - 1].PageHeight;
                                    tempcanvas.height = proxy._zoomVal * proxy._pageSize[currentindex - 1].PageWidth;
                                    tempcanvas.style.height = proxy._zoomVal * proxy._pageSize[currentindex - 1].PageWidth + 'px';
                                    tempcanvas.style.width = proxy._zoomVal * proxy._pageSize[currentindex - 1].PageHeight + 'px';
                                } else {
                                    tempcanvas.width = proxy._zoomVal * proxy._pageSize[currentindex - 1].PageWidth;
                                    tempcanvas.height = proxy._zoomVal * proxy._pageSize[currentindex - 1].PageHeight;
                                    tempcanvas.style.width = proxy._zoomVal * proxy._pageSize[currentindex - 1].PageWidth + 'px';
                                    tempcanvas.style.height = proxy._zoomVal * proxy._pageSize[currentindex - 1].PageHeight + 'px';
                                }
                                ctx.save();
                                ctx.translate(tempcanvas.width / 2, tempcanvas.height / 2);
                                ctx.rotate((proxy._pageSize[currentindex - 1].PageRotation / 2) * Math.PI / 2);
                                ctx.drawImage(image, -image.width / 2, -image.height / 2);
                                ctx.restore();
                            }
                            image.src = canvasUrl;
                        }
                    }
                };
                imageObject.src = imageObjCollection[index];
                imageDataCollection.push(imageObject);
                this._imageObj.push(imageObject);
            }
        },

        _createTextureBrush: function (textureBrush, context, pathdata) {
            var imageSrc = pathdata.texturFields[0].Image;
            var width = pathdata.texturFields[0].Width;
            var height = pathdata.texturFields[0].Height;
            var imageData = "data:image/png;base64," + imageSrc;
            var imageObjects = new Image();
            if (navigator.userAgent.indexOf("Firefox") != -1) {
                imageObjects.src = this._imageSrcCollection[0];
                this._loadimages(imageObjects, width, height, context);
                this._imageSrcCollection.shift();
            }
            else {
                imageObjects.src = imageData;
                this._loadimages(imageObjects, width, height, context);
            }
        },
        _loadimages: function (img, width, height, context) {
            var tempCanvas = document.createElement("canvas");
            var tempContext = tempCanvas.getContext("2d");
            tempCanvas.width = width;
            tempCanvas.height = height;
            tempContext.drawImage(img, 0, 0, img.width, img.height, 0, 0, tempCanvas.width, tempCanvas.height);
            var pattern = context.createPattern(tempCanvas, 'repeat');
            context.fillStyle = pattern;
            context.fill();
            return pattern;
        },
        _getGradientBrush: function (linearGradient, context) {
            var rectangle = linearGradient["Rectangle"];
            var interpolationColors = linearGradient["InterpolationColors"];
            var gradientColor = interpolationColors["Colors"];
            var gradientPosition = interpolationColors["Positions"];
            var gradient;
            if (rectangle["X"] <= 0 && rectangle["Y"] == 0) {
                gradient = context.createLinearGradient(rectangle["X"], rectangle["Height"], rectangle["X"], rectangle["Y"]);
            }
            else {
                gradient = context.createLinearGradient(rectangle["X"], rectangle["Y"], rectangle["Width"], rectangle["Height"]);
            }
            for (var k = 0; k < gradientPosition.length; k++) {
                var colorCodeString = gradientColor[k];
                colorCodeString = colorCodeString.split(",");
                var colorCode = this._rgb2Color(colorCodeString[0], colorCodeString[1], colorCodeString[2]);
                gradient.addColorStop(gradientPosition[k], colorCode);
            }
            return gradient;
        },

        _rgb2Color: function (r, g, b) {
            return '#' + this._byte2Hex(r) + this._byte2Hex(g) + this._byte2Hex(b);
        },
        _byte2Hex: function (n) {
            var nybHexString = "0123456789ABCDEF";
            return String(nybHexString.substr((n >> 4) & 0x0F, 1)) + nybHexString.substr(n & 0x0F, 1);
        },
        //-------------------- Apply Page Style and Actions [End] -------------------------//

        //-------------------- Ajax Web API Call back methods[start] -------------------------//
        _doAjaxPost: function (type, url, jsonResult, onSuccess, isTargetFire) {
            var proxy = this;
            var inVokemethod = onSuccess;
            if (this._ajaxRequestState != null) {
                this._ajaxRequestState.abort();
                this._ajaxRequestState = null;
            }
            this._ajaxRequestState = ($.ajax({
                type: type,
                url: url,
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: jsonResult,
                traditional: true,
                success: function (data) {
                    if (proxy.model.allowClientBuffering) {
                        proxy._initPages();
                        if (typeof data === 'object')
                            jsondata = JSON.parse(JSON.stringify(data));
                        else
                            jsondata = JSON.parse(data);
                        jsondata = jsondata["pdf"];
                        var length = proxy._getObjectSize(jsondata);
                        if (jsondata) {
                            for (var i = 1; i <= length; i++) {
                                var backupjson = jsondata[i];
                                if (backupjson) {
                                    proxy._pageContents[parseInt(backupjson["currentpage"])] = JSON.stringify(backupjson);
                                    proxy._pageText[parseInt(backupjson["currentpage"])] = backupjson["pageContents"];
                                }
                            }
                            data = proxy._pageContents[parseInt(1)];
                        }
                    } else {
                        if (typeof data === 'object')
                            data = JSON.stringify(data);
                    }
                    var jsData = JSON.parse(data);
                    var splittedFileName = null;
                    var pdfFileName;
                    var pagecount = jsData["pagecount"];
                    var name = (jsData["filename"]);
                    if (name && pagecount && pagecount != 0) {
                        name = (jsData["filename"]).split('\\');
                        if (name.length > 0) {
                            name = name[name.length - 1];
                        }
                        pdfFileName = name;
                        if (proxy._fileName && proxy._fileName != "") {
                            splittedFileName = proxy._fileName.split('\\');
                            if (splittedFileName.length > 0) {
                                splittedFileName = splittedFileName[splittedFileName.length - 1];
                            }
                            if (splittedFileName && splittedFileName.indexOf(".pdf") >= 0) {
                                splittedFileName = splittedFileName;
                            }
                            else
                                splittedFileName = splittedFileName + ".pdf";
                        }
                    }
                    pdfFileName = name;
                    if (pagecount == 0) {
                        this.pageCount = 0;
                        proxy._unLoad();
                    }
                    else if (proxy._fileName && proxy._fileName != "" && pdfFileName && pdfFileName != "undefined.pdf" && splittedFileName && splittedFileName != "" && splittedFileName != pdfFileName) {
                        var jsonResult = new Object();
                        jsonResult["viewerAction"] = "GetPageModel";
                        jsonResult["controlId"] = proxy._id;
                        jsonResult["pageindex"] = "1";
                        jsonResult["isInitialLoading"] = "true";
                        jsonResult["newFileName"] = proxy._fileName;
                        proxy._fileId = proxy._createGUID();
                        jsonResult["id"] = proxy._fileId;
                        proxy._actionUrl = proxy.model.serviceUrl + "/" + proxy.model.serverActionSettings.load;
                        if (proxy._pdfService == ej.PdfViewer.PdfService.Local)
                            proxy._doAjaxPost("POST", proxy._actionUrl, JSON.stringify(jsonResult), "_getPageModel");
                        else
                            proxy._doAjaxPost("POST", proxy.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }), "_getPageModel");
                    }
                    else {
                        if (typeof data === 'object')
                            proxy[inVokemethod](JSON.stringify(data));
                        else
                            proxy[inVokemethod](data);
                        var name = (jsData["filename"]).split('\\');
                        var pdfFileName;
                        if (name.length > 0) {
                            pdfFileName = name[name.length - 1];
                        }
                        else if (proxy._fileName != "" && proxy._fileName != null) {
                            pdfFileName = proxy._fileName;
                        }
                        else {
                            pdfFileName = null;
                        }
                        var filename = { fileName: pdfFileName };
                        proxy._downloadfileName = pdfFileName;
                        if (proxy.model) {
                            proxy._raiseClientEvent("documentLoad", filename);
                            if (proxy.model.allowClientBuffering) {
                                if (typeof data === 'object')
                                    var jsonData = JSON.parse(JSON.stringify(data));
                                else
                                    var jsonData = JSON.parse(data);
                                proxy._pagesGot.push(parseInt(jsonData["currentpage"]));
                            }
                        }
                    }
                    if (proxy.model.allowClientBuffering) {
                        if (isTargetFire) {
                            proxy._pagesGot.push(parseInt(jsonData["currentpage"]) + 1);
                            if (2 <= proxy._totalPages) {
                                proxy._targetPage = jsonData["currentpage"] + 2;
                                proxy._isTargetPage = true;
                            }
                        }
                    }
                },
                error: function (msg, textStatus, errorThrown) {
                    if (inVokemethod != "_clearCurrentServerCache") {
                        if (msg.readyState == 0) {
                            return;
                        }
                    }
                    proxy._raiseClientEvent("ajaxRequestFailure", msg.responseText);
                }
            }));
        },

        _initPages: function () {
            this._pageLocation = new Array();
            this._renderedCanvasList = new Array();
            this._pageContents = new Array();
            this._pageText = new Array();
            this._textDivs = new Array();
            this._textContents = new Array();
            this._searchMatches = new Array();
            this._searchCollection = new Array();
            this._pageLocation[1] = 0;
            this._searchedPages = new Array();
            this._canvascount = this._totalPages;
            this._pointers = new Array();
            this._imageObj = new Array();
            this._pagesGot = new Array();
            this._imageSrcCollection = new Array();
            this._selectionPages = new Array();
        },

        _getObjectSize: function (obj) {
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key))
                    size++;
            }
            return size;
        },

        /*
         * This function [_raiseClientEvent] is triggered when client side events (documentload,beforePrint,afterPrint,zoomchange,pageChange) are occured.
         */
        _raiseClientEvent: function (eventName, argument) {
            var eventfunction = this.model[eventName];
            var val = new Array();
            if (argument === null) {
                val = "";
            }
            else {
                val = argument;
            }
            if (eventfunction) {

                if (typeof eventfunction === "string") {
                    eventfunction = ej.util.getObject(eventfunction, window);
                }
                if ($.isFunction(eventfunction)) {
                    var args;
                    if (eventName == "pageChange")
                        args = { currentPageNumber: parseInt(argument.currentPageNumber) };
                    else if (eventName == "zoomChange")
                        args = { previousZoomPercentage: argument.previousZoomPercentage, currentZoomPercentage: argument.currentZoomPercentage };
                    else if (eventName == "hyperlinkClick")
                        args = { hyperlink: argument.hyperlink };
                    else if (eventName == "pageClick")
                        args = { XCoordinate: argument.offsetX, YCoordinate: argument.offsetY };
                    else if (eventName == "bufferStart")
                        args = { isBuffering: true };
                    else if (eventName == "bufferEnd")
                        args = { isBuffering: false };
                    else if (eventName == "documentLoad")
                        args = { fileName: argument.fileName };
                    else if (eventName == "ajaxRequestFailure")
                        args = { message: argument };
                    else if (eventName == "annotationAdd")
                        args = { annotationSettings: argument.annotationSettings, annotationID: argument.annotationId, pageID: argument.pageId, annotationBound: argument.annotationBound, annotationType: argument.annotationType };
                    else if (eventName == "annotationRemove")
                        args = { annotationID: argument.annotationId, pageID: argument.pageId, annotationType: argument.annotationType };
                    else if (eventName == "annotationPropertiesChange")
                        args = { annotationID: argument.annotationId, pageID: argument.pageId, annotationType: argument.annotationType, isColorChanged: argument.isColorChanged, isOpacityChanged: argument.isOpacityChanged };
                    else if (eventName == "annotationResize")
                        args = { annotationSettings: argument.annotationSettings, annotationID: argument.annotationID, pageID: argument.pageID, annotationBound: argument.annotationBound, annotationType: argument.annotationType };
                    else if (eventName == "signatureDelete")
                        args = { pageNumber: argument.pageNumber };
                    else if (eventName == "signatureAdd")
                        args = { signatureSettings: argument.signatureSettings, pageNumber: argument.pageNumber, signatureBound: argument.signatureBound };
                    else if (eventName == "signatureResize")
                        args = { signatureSettings: argument.signatureSettings, pageNumber: argument.pageNumber, signatureCurrentBound: argument.signatureCurrentBound, signaturePreviousBound: argument.signaturePreviousBound };
                    else if (eventName == "signaturePropertiesChange")
                        args = { pageID: argument.pageId, isColorChange: argument.isColorChange, isOpacityChange: argument.isOpacityChange, perviousColor: argument.perviousColor, currentColor: argument.currentColor, previousOpacity: argument.previousOpacity, currentOpacity: argument.currentOpacity };
                    else if (eventName == "downloadStart")
                        args = { fileName: argument.fileName, status: argument.status };
                    else if (eventName == "downloadEnd")
                        args = { fileName: argument.fileName, status: argument.status };
                    this._trigger(eventName, args);
                }
            }
        },

        _getPageModel: function (jsondata) {
            this._on($(window), "resize", this._viewerResize);
            if (jsondata) {
                this._isJsondataAvailable = true;
            }
            if (jsondata == "" || jsondata == null) {
                this._showloadingIndicator(true);
                $('#' + this._id + '_toolbarContainer span.e-pdfviewer-labelpageno').html("");
                $('#' + this._id + '_txtpageNo').val('0');
            }
            var jsData;
            if (this._pdfService == ej.PdfViewer.PdfService.Local)
                jsData = JSON.parse(jsondata);
            else
                jsData = JSON.parse(jsondata["d"]);
            if (jsData && this.model) {
                this._pageWidth = jsData["pagewidth"];
                this._pageHeight = jsData["pageheight"];
                this._imageUrl = jsData["imageurl"];
                this._pageSize = jsData["pagesize"];
                this._totalPages = jsData["pagecount"];
                this.pageCount = this._totalPages;
                this._pdfFileName = jsData["filename"];
                if (this.fileName) {
                    this._pdfFileName = this.fileName;
                } else {
                    if (this._pdfFileName) {
                        this.fileName = this._pdfFileName;
                    }
                }
                this._currentPage = jsData["currentpage"];
                this._restrictionSummary = jsData["restrictionSummary"];
                this._horizontalResolution = jsData["horizontalResolution"];
                this._isRestrictionEnabled();
                if (this._isPrintRestrict)
                    this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_Print');
                else if (!this._isPrintRestrict)
                    this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_Print');
                this.currentPageNumber = this._currentPage;
                if (!this._isToolbarClick) {
                    this._enableToolbarItems();
                }
                if (!this._isSelectionHidden) {
                    if (this.model.enableTextSelection) {
                        this._isEnabled = true;
                    }
                    if (this.model.interactionMode == ej.PdfViewer.InteractionMode.TextSelection && this.model.enableTextSelection) {
                        this.model.enableTextSelection = true;
                    }
                    else if (this.model.interactionMode == ej.PdfViewer.InteractionMode.Pan) {
                        this.model.enableTextSelection = false;
                    }
                    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                    if (this._isCopyRestrict)
                        this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_select');
                    else if (!this._isCopyRestrict)
                        this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_select');
                    if (this.model.enableTextSelection && !isMobile) {
                        this._highlightSelectItems();
                    }
                    else if (!this.model.enableTextSelection || isMobile) {
                        if (!this._isEnabled) {
                            this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_select');
                        }
                        this._highlightScrollItems();
                    }
                }
                this._gotoPage(this._currentPage);
                this._toolbarResizeHandler();
                this._setSearchToolbarTop();
                this._resizeSearchToolbar();
                this._drawPdfPage(jsondata);
                for (var i = 0; i < this._totalPages; i++) {
                    var pageArray = [], newArray = [], deleteArray = [], undoArray = [], redoArray = [], modifiedArray = [], totalArray = [];
                    this._newAnnotationList[i] = pageArray;
                    this._colorModifiedAnnotationList[i] = newArray;
                    this._deletedAnnotationList[i] = deleteArray;
                    this._existingAnnotationsModified[i] = modifiedArray;
                    this._redoAnnotationCollection[i] = redoArray;
                    this._annotationsDeletedNo[i] = 0;
                    this._totalAnnotations[i + 1] = totalArray;
                }
                this._showNavigationIndicator(false);
                this._showloadingIndicator(false);
            }
        },
        _isRestrictionEnabled: function () {
            if (this._restrictionSummary) {
                for (var i = 0; i < this._restrictionSummary.length; i++) {
                    switch (this._restrictionSummary[i]) {
                        case 'Print':
                            this._isPrintRestrict = true;
                            break;
                        case 'CopyContent':
                            this._isCopyRestrict = true;
                            this.model.enableTextSelection = false;
                            break;
                        case 'PageExtraction':
                            this._isPageExtraction = true;
                            break;
                        case 'FillFields':
                            this._isFormFieldsDisabled = true;
                            break;
                        case 'EditAnnotations':
                            this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_highlight');
                            this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_strikeout');
                            this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_underline');
                            break;
                    }
                }
            }
        },
        //-------------------- Ajax Web API Call back methods[end] -------------------------//

        //-------------------- Print Actions[Start] -------------------------//
        _print: function () {
            this._abortPrinting = false;
            this._isPrintingProcess = true;
            this._raiseClientEvent("beforePrint", null);
            this._showPrintLoadingIndicator(true);
            this._setViewerForPrint();
            this._scrollPageByPage();

        },

        //Set the viewer for printing with zoom as 100% and moves the page to first page.
        _setViewerForPrint: function () {
            this._isPrinting = true;
            this._currentPageBackup = this._currentPage;
            this._scrollTop = $('#' + this._id + '_viewerContainer').scrollTop();
            this._zoomValBackup = this._zoomVal;
            this._zoomLevelBackup = this._zoomLevel;
            if (this._zoomVal != 1) {
                this._zoomVal = 1;
                this._zoomLevel = 2;
                this._fitTypeBackup = this._fitType;
                this._zoomContainer(this._zoomVal, false);
            }
        },

        //Changes the page one by one to render the pages in the viewer.
        _scrollPageByPage: function () {

            for (var i = 1; i <= this._totalPages; i++) {
                this._scrollTriggered = false;
                var isPrintingStarted = this._scrollToPageNo(i);
                if (isPrintingStarted)
                    break;
            }
            this._isPrinting = false;
            if (!isPrintingStarted) {
                var browserUserAgent = navigator.userAgent;
                if ((browserUserAgent.indexOf('Chrome') != -1) || (browserUserAgent.indexOf('Safari') != -1) || (browserUserAgent.indexOf("Firefox")) != -1) {
                    var proxy = this;
                    setTimeout(function () { proxy._printPages() }, 1000);
                } else {
                    this._printPages();
                }
                this._raiseClientEvent("afterPrint", null);
            }
        },

        //Gets the current page canvas and the scroll position.
        _scrollToPageNo: function (pageNo) {
            var currentPageNum = this._currentPage;
            if (this._totalPages) {
                var pagenumber = parseInt(pageNo);
                if (pagenumber >= 1 && pagenumber <= this._totalPages) {
                    this._currentPage = pagenumber;
                    var pageviewcontainer = document.getElementById(this._id + '_viewerContainer');
                    pageviewcontainer.scrollTop = (parseFloat(this._pageLocation[this._currentPage] * this._zoomVal));
                    var isPrintingStarted = this._scrollPage(this._pageHeight);
                    return isPrintingStarted;
                }
            }
        },

        //Renders the current page and the next page in the viewer canvas.
        _scrollPage: function (pageHeight) {
            var currentPageNum = 0;
            this._scrollTriggered = true;
            var jsonResult = new Object();
            jsonResult["viewerAction"] = this._viewerAction.getPageModel;
            jsonResult["pageindex"] = this._currentPage.toString();
            jsonResult["id"] = this._fileId;
            jsonResult["isPrinting"] = true;
            jsonResult["signatureValues"] = JSON.stringify(this._signatureLayer);
            var actionUrl = this.model.serviceUrl + "/" + this.model.serverActionSettings.print;
            if (this._pdfService == ej.PdfViewer.PdfService.Local)
                this._doAjaxPostPrint("POST", actionUrl, JSON.stringify(jsonResult));
            else
                this._doAjaxPostPrint("POST", this.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }));
            return true;
        },

        //Opens the print window, displays print dialog box and closes the print function.
        _printPages: function () {
            var browserUserAgent = navigator.userAgent;
            var proxy = this;
            var iframe = this._printIframe;
            iframe.name = "printFrame";
            iframe.style.position = "absolute";
            iframe.style.top = "-100000000px";
            document.body.appendChild(iframe);
            var frameDoc = iframe.contentWindow ? iframe.contentWindow : iframe.contentDocument.document ? iframe.contentDocument.document : iframe.contentDocument;
            frameDoc.document.open();
            if (browserUserAgent.indexOf('Edge') == -1) {
                if ((browserUserAgent.indexOf('Chrome') != -1) || (browserUserAgent.indexOf('Safari') != -1) || (browserUserAgent.indexOf("Firefox")) != -1) {
                    //chrome and firefox
                    frameDoc.document.write('<!DOCTYPE html>');
                    frameDoc.document.write('<html moznomarginboxes mozdisallowselectionprint><head><style>html, body { height: 100%; } img { height: 100%; width: 100%; display: block; }@media print { body { margin: 0cm; }img { box-sizing: border-box; }br, button { display: none; }} @page{margin:0cm; size: 816px 1056px;}</style></head><body><center>');
                    //chrome and firefox
                }
                else {
                    //ie
                    frameDoc.document.write('<!DOCTYPE html>');
                    frameDoc.document.write('<html><head><style>html, body { height: 99%; } img { height: 99%; width: 100%; }@media print { body { margin: 0cm; }img { box-sizing: border-box; }br, button { display: none; }} @page{margin:0cm; size: 816px 1056px;}</style></head><body><center>');

                }
            }
            else {
                //ie
                frameDoc.document.write('<!DOCTYPE html>');
                frameDoc.document.write('<html><head><style>html, body { height: 99%; } img { height: 99%; width: 100%; }@media print { body { margin: 0cm; }img { box-sizing: border-box; }br, button { display: none; }} @page{margin:0cm; size: 816px 1056px;}</style></head><body><center>');
            }

            for (var i = 1; i <= proxy._totalPages; i++) {
                var canvasUrl = "", values = "";
                var canvas = document.getElementById(this._id + 'pagecanvas_' + i);
                var selectionCanvas = document.getElementById(this._id + 'selectioncanvas_' + i);
                var secondaryCanvas = document.getElementById(this._id + '_secondarycanvas_' + i);
                var pagediv = document.getElementById(this._id + 'pageDiv_' + i);
                canvasUrl = canvas.toDataURL();
                var secCanvasUrl = secondaryCanvas.toDataURL();

                if (window.innerWidth < screen.width) {
                    values = proxy._zoomVal;
                    proxy._topValue = true;
                    var jsdata = proxy._pageContents[parseInt(i)];
                    var newData = proxy._printPdfPages(jsdata);
                    canvasUrl = newData.toDataURL();
                    secCanvasUrl = secondaryCanvas.toDataURL();
                }
                else
                    values = 1;
                frameDoc.document.write('<div style="margin:0px;width:816px;height:1056px;position:relative"><img src="' + canvasUrl + '" id="' + 'image_' + i + '" /><img src="' + secCanvasUrl + '" id = "secimage_' + i + '" style="margin:0px;top:0px;left:0px;position:absolute;width:816px;height:1056px;z-index:2" /><div id="' + 'fields_' + i + '"></div><div id="' + 'signaturefields_' + i + '"style="margin:0px;top:0px;left:0px;position:absolute;z-index:1000"></div></div><br/>');
                var length = $(selectionCanvas).find('.e-pdfviewer-formFields').length;
                var cummulativepageheight = 2;
                for (var l = 0; l < length; l++) {
                    var index = "";
                    var inputdiv = $(selectionCanvas).find('.e-pdfviewer-formFields')[l];
                    var currentInput = inputdiv.cloneNode(true);
                    if (inputdiv.type == "select-one") {
                        index = inputdiv.selectedIndex;
                        var childrens = currentInput.children;
                        $(childrens[index]).prop("selected", true);
                    }
                    var PagesWidth = proxy._pageSize[i - 1].PageWidth;
                    var PagesHeight = proxy._pageSize[i - 1].PageHeight;
                    if (PagesWidth > PagesHeight) {
                        var heightRatio = PagesHeight / 816;
                        var widthRatio = PagesWidth / 1056;
                    }
                    else {
                        var heightRatio = PagesHeight / 1056;
                        var widthRatio = PagesWidth / 816;
                    }
                    var is_ie = navigator.userAgent.indexOf("MSIE") != -1 || !!document.documentMode == true;
                    if (is_ie || browserUserAgent.indexOf('Edge') != -1) {
                        $(currentInput).css("left", ((parseFloat($(currentInput).css("left")))) + "px");
                        $(currentInput).css("top", ((parseFloat($(currentInput).css("top")) - 6)) + "px");
                    }
                    if (window.innerWidth < screen.width) {
                        $(currentInput).css("left", ((parseFloat($(currentInput).css("left")) / values)) + "px");
                        $(currentInput).css("top", ((parseFloat($(currentInput).css("top")) / values)) + "px");
                    }
                    $(currentInput).css("left", ((parseFloat($(currentInput).css("left")) / widthRatio)) + "px");
                    $(currentInput).css("top", ((parseFloat($(currentInput).css("top")) / heightRatio)) + "px");
                    $(currentInput).css("width", (parseFloat($(currentInput).css("width")) / widthRatio) + "px");
                    $(currentInput).css("height", (parseFloat($(currentInput).css("height")) / heightRatio) + "px");
                    if (PagesWidth > PagesHeight) {
                        $(currentInput).css({ "transform": "rotate(-90deg)" })
                        var previousLeft = (parseFloat($(currentInput).css("left")));
                        var currentWidthPosition = ((parseFloat($(currentInput).css("width"))) / 2);
                        var currentHeightPosition = ((parseFloat($(currentInput).css("height"))) / 2);
                        $(currentInput).css("left", currentHeightPosition - currentWidthPosition + (parseFloat($(currentInput).css("top"))) + "px");
                        $(currentInput).css("top", currentWidthPosition - currentHeightPosition + previousLeft + "px");
                    }
                    $(frameDoc.document.getElementById('fields_' + i)).append(currentInput);
                }
                var signature = $(pagediv).find('.e-pdfviewer-imagecanvasDraw');
                for (var k = 0; k < signature.length; k++) {
                    var signatureElement = $(signature)[k];
                    var img = document.createElement("img");
                    img.src = signatureElement.toDataURL();
                    $(img).css("position", "absolute");
                    $(img).css("left", ($(signatureElement).css("left")));
                    $(img).css("top", ($(signatureElement).css("top")));
                    $(img).css("width", ($(signatureElement).css("width")));
                    $(img).css("height", ($(signatureElement).css("height")));
                    $(frameDoc.document.getElementById('signaturefields_' + i)).append(img);
                }
            }
            this._topValue = false;
            frameDoc.document.write('</center></body></html>');
            if (navigator.userAgent.match("Firefox")) {
                window.frames["printFrame"].close();
            } else {
                frameDoc.document.close();
            }
            if (browserUserAgent.indexOf('Edge') == -1) {
                if ((browserUserAgent.indexOf('Chrome') != -1) || (browserUserAgent.indexOf('Safari') != -1) || (browserUserAgent.indexOf("Firefox")) != -1) {
                    var proxy = this;
                    setTimeout(function () {
                        window.frames["printFrame"].focus();
                        window.frames["printFrame"].print();
                        document.body.removeChild(iframe);
                    }, 500);
                }
                else {
                    var target = $('iframe')[0];
                    try {
                        target.contentWindow.document.execCommand('print', false, null);
                    } catch (e) {
                        target.contentWindow.print();
                    }
                }
            }
            else {
                var target = $('iframe')[0];
                try {
                    target.contentWindow.document.execCommand('print', false, null);
                } catch (e) {
                    target.contentWindow.print();
                }
            }
            this._restoreViewer();
        },

        //Cancels the printing and restores the PDF viewer.
        _printCancel: function () {
            this._abortPrinting = true;
            this._restoreViewer();
            this._raiseClientEvent("afterPrint", null);
        },

        //Restores the viewer with the current zoom value and scroll position.
        _restoreViewer: function () {
            this._isPrintingProcess = false;
            this._isViewerRestored = true;
            this._currentPage = this._currentPageBackup;
            this._zoomVal = this._zoomValBackup;
            this._zoomLevel = this._zoomLevelBackup;
            for (var i = 1; i <= this._totalPages; i++) {
                var canvas = document.getElementById(this._id + 'pagecanvas_' + i);
                if (this._pageSize[i - 1].PageWidth > this._pageSize[i - 1].PageHeight) {
                    canvas.style.height = this._pageSize[i - 1].PageHeight + 'px';
                    canvas.style.width = this._pageSize[i - 1].PageWidth + 'px';
                    canvas.width = this._pageSize[i - 1].PageWidth;
                    canvas.height = this._pageSize[i - 1].PageHeight;
                    this._renderedCanvasList.length = 0;
                }
            }
            if (this._fitTypeBackup == null) {
                this._zoomContainer(this._zoomVal, false);
            } else {
                var _scaleXY = this._fitToPage(this._fitTypeBackup);
                this._applyDropDownVal(_scaleXY, true, false);
                this._updatePageFitModel(this._fitType);
            }
            var pageviewcontainer = document.getElementById(this._id + '_viewerContainer');
            pageviewcontainer.scrollTop = this._scrollTop;
            this._showPrintLoadingIndicator(false);
        },

        _doAjaxPostPrint: function (type, url, jsonResult) {
            var parseJson = JSON.parse(jsonResult);
            if (this._pdfService == ej.PdfViewer.PdfService.Local) {
                this._currentPrintPage = parseJson["pageindex"];
            }
            else {
                var jsonData = parseJson["jsonResult"];
                this._currentPrintPage = jsonData["pageindex"];
            }
            if (this.model.allowClientBuffering && this._isBuffering) {
                if (this._ajaxRequestState != null) {
                    this._ajaxRequestState.abort();
                    this._ajaxRequestState = null;
                }
            }
            if (this._pageContents[this._currentPrintPage]) {
                var data = this._pageContents[this._currentPrintPage];
                if (typeof data === 'object')
                    this._printPdfPages(JSON.stringify(data));
                else
                    this._printPdfPages(data);
                this._scrollTriggered = false;
                if (this._abortPrinting) {
                    return;
                }
                if (parseFloat(this._currentPrintPage) < this.pageCount) {
                    var jsonResult = new Object();
                    jsonResult["viewerAction"] = this._viewerAction.getPageModel;
                    jsonResult["pageindex"] = (parseFloat(this._currentPrintPage) + 1).toString();//proxy._currentPage.toString();
                    jsonResult["id"] = this._fileId;
                    jsonResult["isPrinting"] = true;
                    jsonResult["signatureValues"] = JSON.stringify(this._signatureLayer);
                    var actionUrl = this.model.serviceUrl + "/" + this.model.serverActionSettings.print;
                    if (this._pdfService == ej.PdfViewer.PdfService.Local)
                        this._doAjaxPostPrint("POST", actionUrl, JSON.stringify(jsonResult));
                    else
                        this._doAjaxPostPrint("POST", this.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }));
                }
                else {
                    var browserUserAgent = navigator.userAgent;
                    if ((browserUserAgent.indexOf('Chrome') != -1) || (browserUserAgent.indexOf('Safari') != -1) || (browserUserAgent.indexOf("Firefox")) != -1) {
                        var proxy = this;
                        setTimeout(function () { proxy._printPages() }, 1000);
                    } else {
                        this._printPages();
                    }
                    this._raiseClientEvent("afterPrint", null);
                }
            } else {
                var proxy = this;
                ($.ajax({
                    type: type,
                    url: url,
                    crossDomain: true,
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    data: jsonResult,
                    traditional: true,
                    success: function (data) {
                        if (typeof data === 'object')
                            proxy._printPdfPages(JSON.stringify(data));
                        else
                            proxy._printPdfPages(data);
                        proxy._scrollTriggered = false;
                        if (proxy._abortPrinting) {
                            return;
                        }
                        if (parseFloat(proxy._currentPrintPage) < proxy.pageCount) {
                            var jsonResult = new Object();
                            jsonResult["viewerAction"] = proxy._viewerAction.getPageModel;
                            jsonResult["pageindex"] = (parseFloat(proxy._currentPrintPage) + 1).toString();//proxy._currentPage.toString();
                            jsonResult["id"] = proxy._fileId;
                            jsonResult["isPrinting"] = true;
                            jsonResult["signatureValues"] = JSON.stringify(proxy._signatureLayer);
                            var actionUrl = proxy.model.serviceUrl + "/" + proxy.model.serverActionSettings.print;
                            if (proxy._pdfService == ej.PdfViewer.PdfService.Local)
                                proxy._doAjaxPostPrint("POST", actionUrl, JSON.stringify(jsonResult));
                            else
                                proxy._doAjaxPostPrint("POST", proxy.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }));
                        }
                        else {
                            var browserUserAgent = navigator.userAgent;
                            if ((browserUserAgent.indexOf('Chrome') != -1) || (browserUserAgent.indexOf('Safari') != -1) || (browserUserAgent.indexOf("Firefox")) != -1) {
                                setTimeout(function () { proxy._printPages() }, 1000);
                            } else {
                                proxy._printPages();
                            }
                            proxy._raiseClientEvent("afterPrint", null);
                        }
                    },
                    error: function (msg, textStatus, errorThrown) {
                        if (msg.readyState == 0) {
                            return;
                        }
                        proxy._raiseClientEvent("ajaxRequestFailure", msg.responseText);
                    }
                }));
            }
        },

        //Rendering function for print.
        _printPdfPages: function (printData) {
            var imageIndex = 0;
            var backupjson = printData;
            var jsondata;
            if (this._pdfService == ej.PdfViewer.PdfService.Local)
                jsondata = JSON.parse(printData);
            else
                jsondata = JSON.parse(printData["d"]);
            var pageindex = parseInt(jsondata["currentpage"]);
            this._showPageLoadingIndicator(pageindex, true);
            var pageimageList = jsondata["imagestream"];
            var index = parseInt(jsondata["currentpage"]);
            if (this._renderedCanvasList.indexOf(index) == -1) {
                this._renderedCanvasList.push(parseInt(jsondata["currentpage"]));
            }
            if (!this._pageContents[pageindex]) {
                this._textMarkupAnnotationList[parseInt(jsondata["currentpage"])] = jsondata["textMarkupAnnotation"];
            }
            this._pageContents[parseInt(jsondata["currentpage"])] = backupjson;
            if (this._textMarkupAnnotationList[pageindex] || this._newAnnotationList[pageindex - 1]) {
                this._renderTextMarkupAnnotation(this._textMarkupAnnotationList[pageindex], pageindex);
            }
            var canvas;
            if (this._topValue == true) {
                var currentpage = parseInt(jsondata["currentpage"]);
                var canvas = document.createElement('canvas');
                var height = this._pageSize[currentpage - 1].PageHeight;
                var width = this._pageSize[currentpage - 1].PageWidth;
                canvas.style.visibility = 'hidden';
                canvas.style.width = width + "px";
                canvas.style.height = height + "px";
                canvas.style.backgroundColor = 'white';
                canvas.className = "e-pdfviewer-pageCanvas";
                canvas.height = height;
                canvas.width = width;
            }
            else
                canvas = document.getElementById(this._id + 'pagecanvas_' + parseInt(jsondata["currentpage"]));
            var context = canvas.getContext('2d');
            var ratio = this._scalingTextContent(context);
            if (this._pageSize[index - 1].PageRotation == 90 || this._pageSize[index - 1].PageRotation == 270) {
                canvas.height = this._zoomVal * this._pageSize[index - 1].PageHeight;
                canvas.width = this._zoomVal * this._pageSize[index - 1].PageWidth;
                canvas.style.width = this._zoomVal * this._pageSize[index - 1].PageWidth + 'px';
                canvas.style.height = this._zoomVal * this._pageSize[index - 1].PageHeight + 'px';
            }
            else {
                canvas.width = this._pageSize[pageindex - 1].PageWidth * ratio;
                canvas.height = this._pageSize[pageindex - 1].PageHeight * ratio;
                canvas.style.height = this._pageSize[pageindex - 1].PageHeight + 'px';
                canvas.style.width = this._pageSize[pageindex - 1].PageWidth + 'px';
            }
            var imageObjCollection = new Array();
            var imageTransformCollection = new Array();
            var imageDataCollection = new Array();
            var currentIndexCollection = new Array();
            var pageDataCollection = new Array();
            var zoomFactor;
            var browserUserAgent = navigator.userAgent;
            var offsett;

            var charPath = new Array();
            this._regenerateFormFields(jsondata, pageindex);
            var children = $('#' + this._id + 'selectioncanvas_' + pageindex).children();
            for (i = 0; i < children.length; i++) {
                if (children[i].hasAttribute('href') || $(children[i]).hasClass('e-pdfviewer-formFields'))
                    $(children[i]).remove();
            }
            this._createFormFields(jsondata, pageindex);
            var shapes = pageimageList["textelements"];
            for (var j = 0; j < shapes.length; j++) {
                var pathdata = shapes[j];
                var color = pathdata["color"];
                var matrix = pathdata["matrix"];
                if (matrix != null)
                    matrix = matrix["Elements"];
                var brushMode = pathdata["brush"];
                var pathValue = pathdata["pathValue"];
                var isClipping = pathdata["iscliping"];
                var restoreCanvas = pathdata["restorecanvas"];
                var imageData = pathdata["imagedata"];
                var fillMode = pathdata["fillrule"];
                var fillStroke = pathdata["isFillandStroke"];
                var fillColor = pathdata["fillcolor"];
                var strokeColor = pathdata["strokecolor"];
                var lineWidth = pathdata["linewidth"];
                var lineCap = pathdata["linecap"];
                var linearGradient = pathdata["linearGradientBrush"];
                var textureBrush = pathdata["textureBrushs"];
                var charID = pathdata["charID"];
                var alpha = pathdata["alpha"];
                if (pathValue != null) {
                    pathValue = pathValue.split(";");
                    if (charID)
                        charPath[charID] = pathValue;
                }
                else if (pathValue == null && charID) {
                    pathValue = charPath[charID];
                }
                if (restoreCanvas == false) {
                    context.save();
                }
                if (pathValue != undefined) {
                    context.setTransform(matrix[0] * ratio, matrix[1] * ratio, matrix[2] * ratio, matrix[3] * ratio, matrix[4] * ratio, matrix[5] * ratio);
                }

                if (pathValue != null) {
                    context.beginPath();

                    for (var i = 0; i < pathValue.length; i++) {
                        var val = pathValue[i];
                        var pathType = val[0];
                        if (pathType == "M") {
                            val = val.substring(1, val.length);
                            val = val.split(" ");
                            context.moveTo((val[0]), val[1]);
                        }
                        else if (pathType == "L") {
                            val = val.substring(1, val.length);
                            val = val.split(" ");
                            context.lineTo((val[0]), val[1]);
                        }
                        else if (pathType == "C") {
                            val = val.substring(1, val.length);
                            val = val.split(" ");
                            context.bezierCurveTo(val[0], val[1], val[2], val[3], val[4], val[5]);
                        }
                        else if (pathType == "Z") {
                            context.closePath();
                        }
                    }
                    if (isClipping == true) {
                        if (fillMode == "evenodd") {
                            context.msFillRule = "evenodd";
                            context.mozFillRule = "evenodd";
                            context.clip(fillMode);
                        }
                        context.clip();

                    }
                    else {
                        if (fillStroke == undefined) {
                            if (brushMode == "Fill") {
                                if (linearGradient != undefined) {
                                    context.fillStyle = this._getGradientBrush(linearGradient, context);
                                }
                                else if (textureBrush != undefined) {
                                    context.fillStyle = this._createTextureBrush(textureBrush, context, pathdata);
                                }
                                else {
                                    if (alpha != undefined)
                                        context.globalAlpha = alpha;
                                    context.fillStyle = color;
                                }
                                if (fillMode == "evenodd") {
                                    context.msFillRule = "evenodd";
                                    context.mozFillRule = "evenodd";
                                    context.fill(fillMode);
                                }
                                context.fill();
                            }
                            else if (brushMode == "FillandStroke") {
                                context.fillStyle = color;
                                context.lineWidth = lineWidth;
                                context.fill();
                                context.strokeStyle = strokeColor;
                                context.stroke();
                            }
                            else if (brushMode == "Stroke") {
                                context.strokeStyle = strokeColor;
                                context.lineWidth = lineWidth;
                                context.lineCap = lineCap;
                                context.stroke();
                            }
                            else {
                                context.strokeStyle = color;
                                context.lineWidth = lineWidth;
                                context.lineCap = lineCap;
                                context.stroke();
                            }
                        }
                        else {
                            context.strokeStyle = strokeColor;
                            context.lineWidth = lineWidth;
                            context.lineCap = lineCap;
                            context.stroke();
                            if (linearGradient != undefined) {
                                context.fillStyle = this._getGradientBrush(linearGradient, context);
                            }
                            else if (textureBrush != undefined) {
                                context.fillStyle = this._createTextureBrush(textureBrush, context, pathdata);
                            }
                            else
                                context.fillStyle = fillColor;
                            if (fillMode == "evenodd") {
                                context.msFillRule = "evenodd";
                                context.mozFillRule = "evenodd";
                                context.fill(fillMode);
                            }
                            context.fill();
                        }
                    }
                }

                if (restoreCanvas)
                    context.restore();
                if (imageData != undefined) {
                    if (((offsett = browserUserAgent.indexOf("Firefox")) != -1 || (offsett = browserUserAgent.indexOf("Chrome")) != -1 || (offsett = browserUserAgent.indexOf("Safari")) != -1 || (offsett = browserUserAgent.indexOf("AppleWebKit")) != -1) && !this._topValue) {
                        imageObjCollection.push(imageData);
                        imageTransformCollection.push(matrix);
                        pageDataCollection.push(shapes);
                        currentIndexCollection.push(j);
                        this._isContainImage = true;
                        break;
                    }
                    else {
                        var imageObj = new Image();
                        imageObj.src = imageData;
                        context.setTransform(matrix[0] * ratio, matrix[1] * ratio, matrix[2] * ratio, matrix[3] * ratio, matrix[4] * ratio, matrix[5] * ratio);
                        context.drawImage(imageObj, 0, 0, 1, 1);
                    }
                }
            }
            if ((offsett = browserUserAgent.indexOf("Firefox")) != -1 || (offsett = browserUserAgent.indexOf("Chrome")) != -1 || (offsett = browserUserAgent.indexOf("Safari")) != -1 || (offsett = browserUserAgent.indexOf("AppleWebKit")) != -1) {
                for (var k = 0; k < imageObjCollection.length; k++) {
                    this._printWinImageRendering(shapes, imageDataCollection, imageObjCollection, imageTransformCollection, context, k, pageDataCollection, currentIndexCollection, charPath, canvas, index, imageIndex);
                    imageIndex++;
                }
            }
            var tempcanvas = canvas;
            var proxy = this;
            if (!(this._pageSize[index - 1].PageRotation == 0 || this._pageSize[index - 1].PageRotation == 90)) {
                if (!(imageObjCollection.length != 0 && (browserUserAgent.indexOf("Firefox") != -1 || browserUserAgent.indexOf("Chrome") != -1))) {
                    tempcanvas = document.getElementById(this._id + 'pagecanvas_' + parseInt(jsondata["currentpage"]));
                    var canvasUrl = tempcanvas.toDataURL();
                    var context = tempcanvas.getContext('2d');
                    var image = new Image();
                    if ((browserUserAgent.indexOf("Firefox")) != -1) {
                        image.onload = function () {
                            context.clearRect(0, 0, tempcanvas.width, tempcanvas.height);
                            if (proxy._pageSize[index - 1].PageRotation == 270) {
                                tempcanvas.width = proxy._zoomVal * proxy._pageSize[index - 1].PageHeight;
                                tempcanvas.height = proxy._zoomVal * proxy._pageSize[index - 1].PageWidth;
                                tempcanvas.style.height = proxy._zoomVal * proxy._pageSize[index - 1].PageWidth + 'px';
                                tempcanvas.style.width = proxy._zoomVal * proxy._pageSize[index - 1].PageHeight + 'px';
                            } else {
                                tempcanvas.width = proxy._zoomVal * proxy._pageSize[index - 1].PageWidth;
                                tempcanvas.height = proxy._zoomVal * proxy._pageSize[index - 1].PageHeight;
                                tempcanvas.style.height = proxy._zoomVal * proxy._pageSize[index - 1].PageHeight + 'px';
                                tempcanvas.style.width = proxy._zoomVal * proxy._pageSize[index - 1].PageWidth + 'px';
                            }
                            context.save();
                            context.translate(tempcanvas.width / 2, tempcanvas.height / 2);
                            context.rotate((proxy._pageSize[index - 1].PageRotation / 2) * Math.PI / 2);
                            context.drawImage(image, -image.width / 2, -image.height / 2);
                            context.restore();
                        }
                        image.src = canvasUrl;
                    } else {
                        context.clearRect(0, 0, tempcanvas.width, tempcanvas.height);
                        if (proxy._pageSize[index - 1].PageRotation == 270) {
                            tempcanvas.width = proxy._zoomVal * proxy._pageSize[index - 1].PageHeight;
                            tempcanvas.height = proxy._zoomVal * proxy._pageSize[index - 1].PageWidth;
                            tempcanvas.style.height = proxy._zoomVal * proxy._pageSize[index - 1].PageWidth + 'px';
                            tempcanvas.style.width = proxy._zoomVal * proxy._pageSize[index - 1].PageHeight + 'px';
                        } else {
                            tempcanvas.width = proxy._zoomVal * proxy._pageSize[index - 1].PageWidth;
                            tempcanvas.height = proxy._zoomVal * proxy._pageSize[index - 1].PageHeight;
                            tempcanvas.style.height = proxy._zoomVal * proxy._pageSize[index - 1].PageHeight + 'px';
                            tempcanvas.style.width = proxy._zoomVal * proxy._pageSize[index - 1].PageWidth + 'px';
                        }
                        context.save();
                        context.translate(tempcanvas.width / 2, tempcanvas.height / 2);
                        context.rotate((proxy._pageSize[index - 1].PageRotation / 2) * Math.PI / 2);
                        image.src = canvasUrl;
                        context.drawImage(image, -image.width / 2, -image.height / 2);
                        context.restore();
                    }
                }
            }
            if (this._pageSize[index - 1].PageWidth > this._pageSize[index - 1].PageHeight) {
                var image = new Image();
                var secImage = new Image();
                var canvasUrl = canvas.toDataURL();
                var canvasHeight = this._pageSize[index - 1].PageHeight;
                var canvasWidth = this._pageSize[index - 1].PageWidth;
                var secondaryCanvas = document.getElementById(this._id + '_secondarycanvas_' + index);
                if ((offsett = browserUserAgent.indexOf("Firefox")) != -1 || (offsett = browserUserAgent.indexOf("Chrome")) != -1 || (offsett = browserUserAgent.indexOf("Safari")) != -1 || (offsett = browserUserAgent.indexOf("AppleWebKit")) != -1) {
                    var proxy = this;
                    image.onload = function () {
                        proxy._renderRotatedImages(canvas, image, canvasHeight, canvasWidth, ratio);
                    };
                    image.src = canvasUrl;
                    secImage.onload = function () {
                        proxy._renderRotatedImages(secondaryCanvas, secImage, canvasHeight, canvasWidth, ratio);
                    };
                    secImage.src = secondaryCanvas.toDataURL();
                } else {
                    image.src = canvasUrl;
                    this._renderRotatedImages(canvas, image, canvasHeight, canvasWidth, ratio);
                    secondaryCanvas.src = secondaryCanvas.toDataURL();
                    this._renderRotatedImages(secondaryCanvas, secImage, canvasHeight, canvasWidth, ratio);
                }
            }
            this._showPageLoadingIndicator(pageindex, false);
            this._changingImageCanvasPosition(pageindex);
            this._showSignature()
            return tempcanvas;
        },

        _renderRotatedImages: function (canvas, image, canvasHeight, canvasWidth, ratio) {
            var context = canvas.getContext('2d');
            canvas.width = canvasHeight * ratio;
            canvas.height = canvasWidth * ratio;
            canvas.style.height = canvasWidth + 'px';
            canvas.style.width = canvasHeight + 'px';
            context.save();
            context.translate(canvas.width / 2, canvas.height / 2);
            context.rotate(-Math.PI / 2);
            context.drawImage(image, -image.width / 2, -image.height / 2);
            context.restore();
        },

        //Renders images while the image is loaded.
        _printWinImageRendering: function (shapes, imageDataCollection, imageObjCollection, imageTransformCollection, context, index, pageDataCollection, currentIndexCollection, charPath, canvas, currentindex, imageIndex) {
            var proxy = this;
            var imageObject = new Image();
            imageObject.onload = function () {
                var isImageContentChanged = false;
                var matrixData = imageTransformCollection[index];
                for (var l = 0; l < imageTransformCollection.length; l++) {
                    var ratio = proxy._scalingTextContent(context);
                    if (isImageContentChanged == false) {
                        var matrixData = imageTransformCollection[l];
                        context.setTransform(matrixData[0] * ratio, matrixData[1] * ratio, matrixData[2] * ratio, matrixData[3] * ratio, matrixData[4] * ratio, matrixData[5] * ratio);
                        if (imageDataCollection[imageIndex] != undefined) {
                            context.drawImage(imageDataCollection[imageIndex], 0, 0, 1, 1);
                        }
                        var dataIndex = currentIndexCollection[l];
                        dataIndex = dataIndex + 1;
                        var data = pageDataCollection[l];
                        while (dataIndex < data.length) {
                            var pathdata = data[dataIndex];
                            var color = pathdata["color"];
                            var matrix = pathdata["matrix"];
                            if (matrix != null)
                                matrix = matrix["Elements"];
                            var brushMode = pathdata["brush"];
                            var pathValue = pathdata["pathValue"];
                            var isClipping = pathdata["iscliping"];
                            var restoreCanvas = pathdata["restorecanvas"];
                            var imageData = pathdata["imagedata"];
                            var fillMode = pathdata["fillrule"];
                            var fillStroke = pathdata["isFillandStroke"];
                            var fillColor = pathdata["fillcolor"];
                            var strokeColor = pathdata["strokecolor"];
                            var lineWidth = pathdata["linewidth"];
                            var lineCap = pathdata["linecap"];
                            var linearGradient = pathdata["linearGradientBrush"];
                            var textureBrush = pathdata["textureBrushs"];
                            var charID = pathdata["charID"];
                            var rectangle = pathdata["rectvalue"];
                            var alpha = pathdata["alpha"];
                            if (pathValue != null) {
                                pathValue = pathValue.split(";");
                                if (charID)
                                    charPath[charID] = pathValue;
                            }
                            else if (pathValue == null && charID) {
                                pathValue = charPath[charID];
                            }
                            if (restoreCanvas == false) {
                                context.save();
                            }
                            if (pathValue != undefined) {
                                context.setTransform(matrix[0] * ratio, matrix[1] * ratio, matrix[2] * ratio, matrix[3] * ratio, matrix[4] * ratio, matrix[5] * ratio);
                            }

                            if (pathValue != null) {
                                context.beginPath();

                                for (var i = 0; i < pathValue.length; i++) {
                                    var val = pathValue[i];
                                    var pathType = val[0];
                                    if (pathType == "M") {
                                        val = val.substring(1, val.length);
                                        val = val.split(" ");
                                        context.moveTo((val[0]), val[1]);
                                    }
                                    else if (pathType == "L") {
                                        val = val.substring(1, val.length);
                                        val = val.split(" ");
                                        context.lineTo((val[0]), val[1]);
                                    }
                                    else if (pathType == "C") {
                                        val = val.substring(1, val.length);
                                        val = val.split(" ");
                                        context.bezierCurveTo(val[0], val[1], val[2], val[3], val[4], val[5]);
                                    }
                                    else if (pathType == "Z") {
                                        context.closePath();
                                    }
                                }
                                if (isClipping == true) {
                                    if (fillMode == "evenodd") {
                                        context.msFillRule = "evenodd";
                                        context.mozFillRule = "evenodd";
                                        context.clip(fillMode);
                                    }
                                    context.clip();

                                }
                                else {
                                    if (fillStroke == undefined) {
                                        if (brushMode == "Fill") {
                                            if (linearGradient != undefined) {
                                                context.fillStyle = proxy._getGradientBrush(linearGradient, context);
                                            }
                                            else if (textureBrush != undefined) {
                                                context.fillStyle = proxy._createTextureBrush(textureBrush, context, pathdata);
                                            }
                                            else {
                                                if (alpha != undefined)
                                                    context.globalAlpha = alpha;
                                                context.fillStyle = color;
                                            }
                                            if (fillMode == "evenodd") {
                                                context.msFillRule = "evenodd";
                                                context.mozFillRule = "evenodd";
                                                context.fill(fillMode);
                                            }
                                            context.fill();
                                        }
                                        else if (brushMode == "FillandStroke") {
                                            context.fillStyle = color;
                                            context.lineWidth = lineWidth;
                                            context.fill();
                                            context.strokeStyle = strokeColor;
                                            context.stroke();
                                        }
                                        else if (brushMode == "Stroke") {
                                            context.strokeStyle = strokeColor;
                                            context.lineWidth = lineWidth;
                                            context.lineCap = lineCap;
                                            context.stroke();
                                        }
                                        else {
                                            context.strokeStyle = color;
                                            context.lineWidth = lineWidth;
                                            context.lineCap = lineCap;
                                            context.stroke();
                                        }
                                    }
                                    else {
                                        context.strokeStyle = strokeColor;
                                        context.lineWidth = lineWidth;
                                        context.lineCap = lineCap;
                                        context.stroke();
                                        if (linearGradient != undefined) {
                                            context.fillStyle = proxy._getGradientBrush(linearGradient, context);
                                        }
                                        else if (textureBrush != undefined) {
                                            context.fillStyle = proxy._createTextureBrush(textureBrush, context, pathdata);
                                        }
                                        else
                                            context.fillStyle = fillColor;
                                        if (fillMode == "evenodd") {
                                            context.msFillRule = "evenodd";
                                            context.mozFillRule = "evenodd";
                                            context.fill(fillMode);
                                        }
                                        context.fill();
                                    }
                                }
                            }

                            if (restoreCanvas)
                                context.restore();
                            if (imageData != undefined) {
                                isImageContentChanged = true;
                                imageObjCollection.pop();
                                imageTransformCollection.pop();
                                pageDataCollection.pop();
                                currentIndexCollection.pop();
                                imageObjCollection.push(imageData);
                                imageTransformCollection.push(matrix);
                                pageDataCollection.push(shapes);
                                currentIndexCollection.push(dataIndex);
                                l = -1;
                                imageIndex++;
                                break;
                            }
                            dataIndex++;
                        }
                    }
                    else {
                        proxy._printWinImageRendering(shapes, imageDataCollection, imageObjCollection, imageTransformCollection, context, l, pageDataCollection, currentIndexCollection, charPath, canvas, currentindex, imageIndex);
                        imageIndex++;
                    }
                }
                if (imageDataCollection.length - 1 == index) {
                    if (proxy._pageSize[currentindex - 1].PageRotation != 0) {
                        var tempcanvas = document.getElementById(proxy._id + 'pagecanvas_' + currentindex);
                        var canvasUrl = tempcanvas.toDataURL();
                        var ctx = tempcanvas.getContext('2d');
                        var image = new Image();
                        image.onload = function () {
                            ctx.clearRect(0, 0, tempcanvas.width, tempcanvas.height);
                            if (proxy._pageSize[currentindex - 1].PageRotation == 90 || proxy._pageSize[currentindex - 1].PageRotation == 270) {
                                tempcanvas.width = proxy._zoomVal * proxy._pageSize[currentindex - 1].PageHeight;
                                tempcanvas.height = proxy._zoomVal * proxy._pageSize[currentindex - 1].PageWidth;
                                tempcanvas.style.height = proxy._zoomVal * proxy._pageSize[currentindex - 1].PageWidth + 'px';
                                tempcanvas.style.width = proxy._zoomVal * proxy._pageSize[currentindex - 1].PageHeight + 'px';
                            } else {
                                tempcanvas.width = proxy._zoomVal * proxy._pageSize[currentindex - 1].PageWidth;
                                tempcanvas.height = proxy._zoomVal * proxy._pageSize[currentindex - 1].PageHeight;
                                tempcanvas.style.width = proxy._zoomVal * proxy._pageSize[currentindex - 1].PageWidth + 'px';
                                tempcanvas.style.height = proxy._zoomVal * proxy._pageSize[currentindex - 1].PageHeight + 'px';
                            }
                            ctx.save();
                            ctx.translate(tempcanvas.width / 2, tempcanvas.height / 2);
                            ctx.rotate((proxy._pageSize[currentindex - 1].PageRotation / 2) * Math.PI / 2);
                            ctx.drawImage(image, -image.width / 2, -image.height / 2);
                            ctx.restore();
                        }
                        image.src = canvasUrl;
                    }
                }
                if (proxy._pageSize[currentindex - 1].PageWidth > proxy._pageSize[currentindex - 1].PageHeight) {
                    var image = new Image();
                    var secImage = new Image();
                    var canvasUrl = canvas.toDataURL();
                    var canvasHeight = proxy._pageSize[currentindex - 1].PageHeight;
                    var canvasWidth = proxy._pageSize[currentindex - 1].PageWidth;
                    var secondaryCanvas = document.getElementById(proxy._id + '_secondarycanvas_' + currentindex);
                    var browserUserAgent = navigator.userAgent;
                    if ((offsett = browserUserAgent.indexOf("Firefox")) != -1 || (offsett = browserUserAgent.indexOf("Chrome")) != -1 || (offsett = browserUserAgent.indexOf("Safari")) != -1 || (offsett = browserUserAgent.indexOf("AppleWebKit")) != -1) {
                        image.onload = function () {
                            proxy._renderRotatedImages(canvas, image, canvasHeight, canvasWidth, ratio);
                        };
                        image.src = canvasUrl;
                        secImage.onload = function () {
                            proxy._renderRotatedImages(secondaryCanvas, secImage, canvasHeight, canvasWidth, ratio);
                        };
                        secImage.src = secondaryCanvas.toDataURL();
                    } else {
                        image.src = canvasUrl;
                        proxy._renderRotatedImages(canvas, image, canvasHeight, canvasWidth, ratio);
                        secImage.onload = function () {
                            proxy._renderRotatedImages(secondaryCanvas, secImage, canvasHeight, canvasWidth, ratio);
                        };
                        secImage.src = secondaryCanvas.toDataURL();
                    }
                }
            };
            imageObject.src = imageObjCollection[index];
            imageDataCollection.push(imageObject);
            this._imageObj.push(imageObject);
        },

        _showPrintButton: function (show) {
            if (show) {
                $('#' + this._id + '_toolbar_Print').parent().parents(".e-pdfviewer-toolbarul").css("display", "block");
                this._isPrintHidden = false;
            }
            else {
                $('#' + this._id + '_toolbar_Print').parent().parents(".e-pdfviewer-toolbarul").css("display", "none");
                this._isPrintHidden = true;
            }
        },
        _showDownloadButton: function (show) {
            if (show) {
                $('#' + this._id + '_toolbar_download').parent().parents(".e-pdfviewer-toolbarul").css("display", "block");
                this._isDownloadHidden = false;
            }
            else {
                $('#' + this._id + '_toolbar_download').parent().parents(".e-pdfviewer-toolbarul").css("display", "none");
                this._isDownloadHidden = true;
            }
        },
        //-------------------- Print Actions[end] -------------------------//

        //-------------------- Page Navigation Actions[Start] -------------------------//
        _updatePageNavigation: function (pageNo, totalPage) {
            if (pageNo > 1 && pageNo < totalPage) {
                this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_gotofirst');
                this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_gotoprevious');
                this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_gotonext');
                this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_gotolast');
            } else if (pageNo == 1 && pageNo < totalPage) {
                this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_gotofirst');
                this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_gotoprevious');
                this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_gotonext');
                this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_gotolast');
            } else if (pageNo == totalPage && totalPage != 1) {
                this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_gotofirst');
                this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_gotoprevious');
                this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_gotonext');
                this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_gotolast');
            } else {
                this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_gotofirst');
                this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_gotoprevious');
                this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_gotonext');
                this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_gotolast');
            }
            if (!this._isJsondataAvailable) {
                this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_gotofirst');
                this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_gotoprevious');
                this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_gotonext');
                this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_gotolast');
            }

            this.currentPageNumber = this._currentPage;
        },

        _gotoFirstPage: function () {
            if (this._totalPages) {
                if (this._totalPages > 0) {
                    this._currentPage = 1;
                    var pageviewcontainer = document.getElementById(this._id + '_viewerContainer');
                    pageviewcontainer.scrollTop = (parseFloat(this._pageLocation[this._currentPage] * this._zoomVal));
                    this._pageviewscrollchanged(this._pageHeight);
                    this._updatePageNavigation(this._currentPage, this._totalPages);
                }
            }
        },

        _gotoLastPage: function () {
            if (this._totalPages) {
                if (this._totalPages > 0) {
                    this._currentPage = this._totalPages;
                    var pageviewcontainer = document.getElementById(this._id + '_viewerContainer');
                    pageviewcontainer.scrollTop = (parseFloat(this._pageLocation[this._currentPage] * this._zoomVal));
                    this._pageviewscrollchanged(this._pageHeight);
                    this._updatePageNavigation(this._currentPage, this._totalPages);
                }
            }
        },

        _gotoNextPage: function () {
            if (this._totalPages) {
                if (this._currentPage < this._totalPages) {
                    this._currentPage = this._currentPage + 1;
                    var pageviewcontainer = document.getElementById(this._id + '_viewerContainer');
                    pageviewcontainer.scrollTop = (parseFloat(this._pageLocation[this._currentPage] * this._zoomVal));
                    this._pageviewscrollchanged(this._pageHeight);
                    this._updatePageNavigation(this._currentPage, this._totalPages);
                }
            }
        },

        _gotoPreviousPage: function () {
            if (this._totalPages) {
                if (this._currentPage > 1) {
                    this._currentPage = this._currentPage - 1;
                    var pageviewcontainer = document.getElementById(this._id + '_viewerContainer');
                    pageviewcontainer.scrollTop = (parseFloat(this._pageLocation[this._currentPage] * this._zoomVal));
                    this._pageviewscrollchanged(this._pageHeight);
                    this._updatePageNavigation(this._currentPage, this._totalPages);
                }
            }
        },

        _gotoPageNo: function (pageNo) {
            var pagenumbervalue = { currentPageNumber: 0 };
            var pagenoentered = pageNo;
            var currentPageNum = this._currentPage;
            if (this._totalPages) {
                var pagenumber = parseInt(pageNo);
                if (pagenumber >= 1 && pagenumber <= this._totalPages && this._currentPage != pagenumber) {
                    this._currentPage = pagenumber;
                    var pageviewcontainer = document.getElementById(this._id + '_viewerContainer');
                    pageviewcontainer.scrollTop = (parseFloat(this._pageLocation[this._currentPage] * this._zoomVal));
                    this._pageviewscrollchanged(this._pageHeight);
                    this._updatePageNavigation(this._currentPage, this._totalPages);
                }
            }
            if (currentPageNum != pagenoentered) {
                pagenumbervalue.currentPageNumber = pagenoentered;
                this._raiseClientEvent("pageChange", pagenumbervalue);
            }
        },

        _gotoPage: function (pageNo) {
            this._setPageSize(this._pageHeight, this._pageWidth, null, null);
            var pagenumber = parseInt(pageNo);
            this._updatePageNavigation(pagenumber, this._totalPages);
            if (this._totalPages > 0 && this._totalPages) {
                $('#' + this._id + '_toolbarContainer span.e-pdfviewer-labelpageno').html(" / " + this._totalPages);
                $('#' + this._id + '_txtpageNo').val(pagenumber);
            }
        },

        _allowOnlyNumbers: function (event) {
            if ((event.which < 48 || event.which > 57) && event.which != 8 && event.which != 13) {
                return false;
            }
            else {
                return true;
            }
        },

        _onkeyPress: function (event) {
            if (event.which == 13) {
                event.preventDefault();
                try {
                    var val = parseInt($(event.currentTarget).val());
                    if (val > 0 && val <= this.pageCount)
                        this._gotoPageNo(val);
                    else
                        $(event.currentTarget).val(this.currentPageNumber);
                } catch (err) {
                }
            }
        },

        _showPageNavigationControls: function (show) {
            if (show) {
                $('#' + this._id + '_txtpageNo').parents(".e-pdfviewer-toolbarul").css("display", "block");
                $('#' + this._id + '_toolbar_Print').parent().parents(".e-pdfviewer-toolbarul").css("border-right-width", "1px");
                this._isNavigationHidden = false;
            } else {
                $('#' + this._id + '_txtpageNo').parents(".e-pdfviewer-toolbarul").css("display", "none");
                this._isNavigationHidden = true;
                if (!this._isPrintHidden && this._isNavigationHidden && this._isMagnificationHidden) {
                    $('#' + this._id + '_toolbar_Print').parent().parents(".e-pdfviewer-toolbarul").css("border-right-width", "0px");
                }
            }
        },
        //-------------------- Page Navigation Actions[End] -------------------------//


        //-------------------- FitToPage[start] -------------------------//
        _showFittoPage: function (show) {
            if (show) {
                $('#' + this._id + '_fitWidth').parents("li.e-pdfviewer-toolbarli").css("display", "block");
                $('#' + this._id + '_fitPage').parents("li.e-pdfviewer-toolbarli").css("display", "block");
                $('#' + this._id + '_fitPage').parents("ul.e-pdfviewer-toolbarul").css("display", "block");
            } else {
                $('#' + this._id + '_fitWidth').parents("li.e-pdfviewer-toolbarli").css("display", "none");
                $('#' + this._id + '_fitPage').parents("li.e-pdfviewer-toolbarli").css("display", "none");
                $('#' + this._id + '_fitPage').parents("ul.e-pdfviewer-toolbarul").css("display", "none");
            }
        },

        _resetPage: function () {
            var pagecontainer = $('#' + this._id + '_pageviewContainer');
            var pageViewline = $('#' + this._id + '_pageviewOuterline');
            if (pagecontainer[0] != undefined) {
                pageViewline.css({ "width": pagecontainer.width(), "height": pagecontainer.height() });
                pageViewline.css({ "width": pagecontainer[0].getBoundingClientRect().width, "height": pagecontainer[0].getBoundingClientRect().height });
            }
        },

        /*  _applyFitToWidth() is a event handler for the fitWidth button. This function fits the page to width of the container and applies the
            dropDown value to the zoom dropdown list. Then updates the page fit button.
        */
        _applyFitToWidth: function () {
            this._isAutoZoom = false;
            this._isAutoSelected = false;
            var _scaleXY = this._fitToPage("fitToWidth");
            this._applyDropDownVal(_scaleXY, true, false);
            this._updatePageFitModel(this._fitType);
            this.model.isResponsive = false;
        },

        /*  _applyFitToPage() is a event handler for the fitPage button. This function fits the page to the container and applies the
            dropDown value to the zoom dropdown list. Then updates the page fit button.
        */
        _applyFitToPage: function () {
            this._isAutoZoom = false;
            this._isAutoSelected = false;
            var _scaleXY = this._fitToPage("fitToPage");
            this._applyDropDownVal(_scaleXY, false, true);
            this._updatePageFitModel(this._fitType);
            this.model.isResponsive = false;
        },


        /* _updatePageFitModel() function is used to enable or disable the PageFit button. This is done by adding and removing 
          a class "e-pdfviewer-disabled-fitButton".
        */
        _updatePageFitModel: function (fitType) {
            if (fitType == "fitToWidth") {
                this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_fitWidth');
                $('#' + this._id + '_pageviewContainer').find('.e-waitingpopup').css("visibility", "");
                this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_fitPage');
            } else if (fitType == "fitToPage") {
                this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_fitPage');
                this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_fitWidth');
            }
        },

        _applyFitToWidthAuto: function () {
            var _scaleXY = this._fitToAuto("fitToWidth");
            this._applyDropDownValAuto(_scaleXY, true, false);
        },

        _fitToAuto: function (fitType) {
            this._resetPage();
            var pageViewerContainer = $('#' + this._id + '_viewerContainer');
            var pagecontainer = $('#' + this._id + '_pageviewContainer');
            var pageViewline = $('#' + this._id + '_pageviewOuterline');
            if (pageViewerContainer[0] != undefined) {
                var w = pageViewerContainer.width();
                var h = pageViewerContainer.height();
                var pageW = this._pageWidth;
                var pageH = this._pageHeight;
                var scaleX = 1;
                var scaleY = 1;
                scaleX = (w - 25) / pageW;
                if (this._isAutoZoom) {
                    scaleX = Math.min(1, scaleX);
                    if (scaleX == 1)
                        this._zoomLevelBackup = this._zoomLevel = 3;

                }
                if (window.innerWidth >= screen.width) {
                    this._isWindowResizing = false;
                }
                scaleY = scaleX;
                this._zoomVal = scaleX;
                this._fitToAutoSize();
                this._calculateZoomLevel(this._zoomVal);
                this._initRerendering();
                this._updateZoomButtons();
                return { scalX: scaleX, scalY: scaleY }
            }
        },

        _fitToPage: function (fitType) {
            if (this._pageSize != undefined) {
                this._resetPage();
                var pageViewerContainer = $('#' + this._id + '_viewerContainer');
                var pagecontainer = $('#' + this._id + '_pageviewContainer');
                var pageViewline = $('#' + this._id + '_pageviewOuterline');
                var w = pageViewerContainer.width();
                var h = pageViewerContainer.height();
                if (fitType == "fitToWidth") {
                    for (var i = 0; i < this._pageSize.length; i++) {
                        var pageWidth = 0;
                        if (this._pageSize[i].PageRotation == 90 || this._pageSize[i].PageRotation == 270) {
                            pageWidth = this._pageSize[i].PageHeight;
                        } else {
                            pageWidth = this._pageSize[i].PageWidth;
                        }
                        if (pageWidth > this._highestWidth) {
                            this._highestWidth = pageWidth;
                        }
                    }
                } else {
                    this._highestWidth = this._pageWidth;
                }
                if (fitType == "fitToPage") {
                    for (var i = 0; i < this._pageSize.length; i++) {
                        var pageHeight = 0;
                        if (this._pageSize[i].PageRotation == 90 || this._pageSize[i].PageRotation == 270) {
                            pageHeight = this._pageSize[i].PageWidth;
                        } else {
                            pageHeight = this._pageSize[i].PageHeight;
                        }
                        if (pageHeight > this._highestHeight) {
                            this._highestHeight = pageHeight;
                        }
                    }
                } else {
                    this._highestHeight = this._PageHeight;
                }
                var pageW = this._highestWidth;
                var pageH = this._highestHeight;
                var scaleX = 1;
                var scaleY = 1;
                this._fitType = fitType;
                if (fitType == "fitToPage") {
                    scaleX = (w - 25) / pageW;
                    scaleY = (h) / pageH;
                    if (h > pageH) {
                        scaleY = this._preZoomVal;
                    }

                    if (w > pageW) {
                        scaleX = this._preZoomVal;
                    }
                    if (this._fitType == "fitToPage" && this._pageSize[this._currentPage - 1].PageOrientation == "Landscape" && scaleX < scaleY) {
                        scaleX = scaleX;
                    }
                    else
                        scaleX = scaleY;
                    this._zoomVal = scaleX;
                    this._zoomInContainer();
                    this._calculateZoomLevel(this._zoomVal);
                    $('#' + this._id + 'pageDiv_' + (this._currentPage + 1)).css("visibility", "hidden");
                    var proxy = this;
                    var pageviewcontainer = document.getElementById(this._id + '_viewerContainer');
                    $('#' + this._id + '_viewerContainer').on('mousewheel DOMMouseScroll', function (e) {
                        var pageviewcontainer = document.getElementById(proxy._id + '_viewerContainer');
                        var fittopage = $('#' + proxy._id + '_pdfviewer_toolbar_fitPage').attr('aria-disabled');
                        if (fittopage == "true") {
                            if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
                                if (proxy._currentPage > 1) {
                                    $('#' + proxy._id + 'pageDiv_' + (proxy._currentPage - 1)).css("visibility", "");
                                    pageviewcontainer.scrollTop = (parseFloat(proxy._pageLocation[proxy._currentPage - 1] * proxy._zoomVal));
                                    $('#' + proxy._id + 'pageDiv_' + (proxy._currentPage)).css("visibility", "hidden");
                                }
                            }
                            else {
                                if (proxy._currentPage != proxy._totalPages) {
                                    $('#' + proxy._id + 'pageDiv_' + (proxy._currentPage + 1)).css("visibility", "");
                                    pageviewcontainer.scrollTop = (parseFloat(proxy._pageLocation[proxy._currentPage + 1] * proxy._zoomVal));
                                    if ((proxy._currentPage + 1) == proxy._totalPages) {
                                        $('#' + proxy._id + 'pageDiv_' + (proxy._currentPage)).css("visibility", "hidden");
                                    }
                                    else {
                                        $('#' + proxy._id + 'pageDiv_' + (proxy._currentPage + 2)).css("visibility", "hidden");
                                    }
                                }
                            }
                            e.preventDefault();
                        }
                    });
                    $(window).on('keydown', function (e) {
                        var pageviewcontainer = document.getElementById(proxy._id + '_viewerContainer');
                        var fittopage = $('#' + proxy._id + '_pdfviewer_toolbar_fitPage').attr('aria-disabled');
                        if (fittopage == "true") {
                            if (proxy._currentPage > 1 && e.keyCode == '38') {
                                $('#' + proxy._id + 'pageDiv_' + (proxy._currentPage - 1)).css("visibility", "");
                                pageviewcontainer.scrollTop = (parseFloat(proxy._pageLocation[proxy._currentPage - 1] * proxy._zoomVal));
                                $('#' + proxy._id + 'pageDiv_' + (proxy._currentPage)).css("visibility", "hidden");
                            }
                            else {
                                if (proxy._currentPage != proxy._totalPages && e.keyCode == '40') {
                                    $('#' + proxy._id + 'pageDiv_' + (proxy._currentPage + 1)).css("visibility", "");
                                    pageviewcontainer.scrollTop = (parseFloat(proxy._pageLocation[proxy._currentPage + 1] * proxy._zoomVal));
                                    if ((proxy._currentPage + 1) == proxy._totalPages) {
                                        $('#' + proxy._id + 'pageDiv_' + (proxy._currentPage)).css("visibility", "hidden");
                                    }
                                    else {
                                        $('#' + proxy._id + 'pageDiv_' + (proxy._currentPage + 2)).css("visibility", "hidden");
                                    }
                                }
                            }
                        }
                    });
                    pageviewcontainer.scrollTop = (parseFloat(this._pageLocation[this._currentPage] * this._zoomVal));
                    $('#' + proxy._id + 'pageDiv_' + (proxy._currentPage - 1)).css("visibility", "hidden");
                    $('#' + proxy._id + 'pageDiv_' + (proxy._currentPage + 1)).css("visibility", "hidden");

                } else if (fitType == "fitToWidth") {
                    scaleX = (w - 25) / pageW;
                    scaleY = scaleX;
                    this._zoomVal = scaleX;
                    this._zoomInContainer();
                    this._calculateZoomLevel(this._zoomVal);
                }
                this._updateZoomButtons();
                return { scalX: scaleX, scalY: scaleY }
            }
        },

        _selectDropDownIndex: function (index) {
            var _selectedObj = $($('#' + this._id + '_toolbar_zoomSelection_popup li')[index]);
            _selectedObj.addClass('e-active');
            $('#' + this._id + '_toolbar_zoomSelection_input').val(_selectedObj.text());
        },

        _applyDropDownVal: function (scaleXY, orientationX, isFittoPage) {
            if (scaleXY != undefined) {
                if (isFittoPage) {
                    var _maxScale = scaleXY.scalX > scaleXY.scalY ? scaleXY.scalY : scaleXY.scalX;
                    $('#' + this._id + '_toolbar_zoomSelection_hidden').val(Math.round((_maxScale * 100)) + "%");
                    this._ejDropDownInstance.model.value = Math.round(_maxScale * 100) + "%";
                    this._ejDropDownInstance.model.selectedIndices[0] = "";
                    $('#' + this._id + '_toolbar_zoomSelection_popup li').removeClass('e-active');
                }
                else if (orientationX) {
                    $('#' + this._id + '_toolbar_zoomSelection_hidden').val(Math.round((scaleXY.scalX * 100)) + "%");
                    this._ejDropDownInstance.model.value = Math.round(scaleXY.scalX * 100) + "%";
                    this._ejDropDownInstance.model.selectedIndices[0] = "";
                    $('#' + this._id + '_toolbar_zoomSelection_popup li').removeClass('e-active');
                } else {
                    $('#' + this._id + '_toolbar_zoomSelection_hidden').val(Math.round((scaleXY.scalY * 100)) + "%");
                    this._ejDropDownInstance.model.value = Math.round(scaleXY.scalY * 100) + "%";
                    this._ejDropDownInstance.model.selectedIndices[0] = "";
                    $('#' + this._id + '_toolbar_zoomSelection_popup li').removeClass('e-active');
                }
            }
        },

        _applyDropDownValAuto: function (scaleXY, orientationX, isFittoPage) {
            if (!this._isAutoZoom) {
                $('#' + this._id + '_toolbar_zoomSelection_hidden').val(Math.round((scaleXY.scalY * 100)) + "%");
                this._ejDropDownInstance.model.value = Math.round(scaleXY.scalY * 100) + "%";
                this._ejDropDownInstance.model.selectedIndices[0] = "";
            }
            else {
                var localeObj = ej.PdfViewer.Locale[this.model.locale] ? ej.PdfViewer.Locale[this.model.locale] : ej.PdfViewer.Locale["default"];
                var text = localeObj['contextMenu']['auto']['contentText'];
                $('#' + this._id + '_toolbar_zoomSelection_hidden').val(text);
                this._ejDropDownInstance.model.value = text;
            }
            $('#' + this._id + '_toolbar_zoomSelection_popup li').removeClass('e-active');
        },

        _showFitToPagetip: function () {
            var fittoPage = $('#' + this._id + '_toolbar_fittoPagePopup');
            if (!(fittoPage.length > 0)) {
                fittoPage = this._renderPageFitPopup();
                $('body').append(fittoPage);
                this._on($('#' + this._id + '_toolbar_fittoPagePopup li.e-pdfviewer-popupli'), "click", this._pageFitMenuClick);
            }

            if (fittoPage.css('display') == 'block') {
                fittoPage.css('display', 'none');
            } else {
                fittoPage.css('display', 'block');
            }

            var exportTagPos = $('#' + this._id + '_toolbarContainer .e-pdfviewer-pagefit')[0].getBoundingClientRect();
            var expTagPos = $($('#' + this._id + '_toolbarContainer .e-pdfviewer-pagefit')[0]).offset();
            fittoPage.css({ 'top': (expTagPos.top + exportTagPos.height) - 3, 'left': (expTagPos.left - 5) });
        },
        //-------------------- FitToPage[end] -------------------------//

        //-------------------- Page Zoom[start] -------------------------//
        _zoomValChange: function (sender) {
            if (!this._ejViewerInstance) {
                var id = this._id.split('_toolbar')[0];
                var ejViewer = $("#" + id);
                var ejViewerInstance = ejViewer.ejPdfViewer("instance");
            }
            var zoomVal;
            var localeObj = ej.PdfViewer.Locale[this.model.locale] ? ej.PdfViewer.Locale[this.model.locale] : ej.PdfViewer.Locale["default"];
            var text = localeObj['contextMenu']['auto']['contentText'];
            if (sender.value != undefined) {
                if (sender.value == text || sender.model.selectedItemIndex == 0) {
                    ejViewerInstance.model.isResponsive = true;
                    zoomVal = 1;
                    ejViewerInstance._zoomLevel = 3;
                    ejViewerInstance._isAutoZoom = true;
                    ejViewerInstance._isAutoSelected = true;
                }
                else {
                    zoomVal = parseInt(sender.value) / 100;
                    ejViewerInstance.model.isResponsive = false;
                    ejViewerInstance._zoomLevel = sender.itemId;
                    ejViewerInstance._isAutoZoom = false;
                    ejViewerInstance._isAutoSelected = false;
                }

                ejViewerInstance._zoomContainer(zoomVal, false);
            } else if (sender.target.innerHTML != undefined) {
                var str = sender.target.innerHTML;
                if (sender.target.innerHTML == text) {
                    ejViewerInstance.model.isResponsive = true;
                    zoomVal = 1;
                    ejViewerInstance._isAutoZoom = true;
                }
                else {
                    var str = str.substring(0, str.length - 1);
                    zoomVal = parseInt(str) / 100;
                    ejViewerInstance.model.isResponsive = false;
                    ejViewerInstance._isAutoZoom = false;
                }
                ejViewerInstance._zoomContainer(zoomVal, false);
            }
        },

        _zoomIn: function () {
            if (this._zoomLevel >= 7) {
                this._zoomLevel = 7;
            } else {
                this._zoomLevel++;
            }
            if (this._isDevice) {
                this._mobileLayoutZoomChange();
            } else {
                var zoomddl = $('#' + this._id + '_toolbar_zoomSelection').data('ejDropDownList');
                zoomddl._selectItemByIndex(this._zoomLevel);
            }
            this.model.isResponsive = false;
        },

        _zoomOut: function () {
            if (this._zoomLevel <= 1) {
                this._zoomLevel = 1;
            } else {
                this._zoomLevel--;
            }
            if (this._isDevice) {
                this._mobileLayoutZoomChange();
            } else {
                var zoomddl = $('#' + this._id + '_toolbar_zoomSelection').data('ejDropDownList');
                zoomddl._selectItemByIndex(this._zoomLevel);
            }
            this.model.isResponsive = false;
        },

        _zoomInContainer: function (isFactor, scaleFactor) {
            this._hidingSignature();
            var zoomFactor = scaleFactor;
            var pageViewerContainer = $('#' + this._id + '_viewerContainer');
            var pagecontainer = $('#' + this._id + '_pageviewContainer');
            this._selectionNodes = window.getSelection();
            $('.e-pdfviewer-formFields').hide();
            if (!(this._selectionNodes.anchorOffset == 0 && this._selectionNodes.focusOffset == 0)) {
                this._maintainSelection();
            }
            if (isFactor) {
                this._zoomVal = this._zoomVal + zoomFactor;
            }
            var w = pagecontainer.width();
            var h = pagecontainer.height();
            var zoomineventvalue = { currentZoomPercentage: 0, previousZoomPercentage: 0 };
            var vscrolBar = document.getElementById(this._id + '_viewerContainer');
            var vscrolValue = vscrolBar.scrollTop;
            var scrollValue = (vscrolValue / this._previousZoom) * this._zoomVal;
            var transform = "scale(" + this._zoomVal + "," + this._zoomVal + ")";
            for (var i = 1; i <= this._totalPages; i++) {
                var leftpos;
                var pageWidth = 0;
                if (this._pageSize[i - 1].PageRotation == 90 || this._pageSize[i - 1].PageRotation == 270) {
                    leftpos = (this.element.width() - this._pageSize[i - 1].PageHeight * this._zoomVal) / 2;
                    pageWidth = this._pageSize[i - 1].PageHeight;
                } else {
                    leftpos = (this.element.width() - this._pageSize[i - 1].PageWidth * this._zoomVal) / 2;
                    pageWidth = this._pageSize[i - 1].PageWidth;
                }
                var currentWidth = leftpos + this._pageSize[i - 1].PageWidth * this._zoomVal;
                if (leftpos < 0 || (this._fitType == "fitToWidth" && pageWidth == this._highestWidth) || (this._fitType == "fitToPage" && this._pageSize[i - 1].PageOrientation == "Landscape" && currentWidth > w))
                    leftpos = 5;
                var canvas = document.getElementById(this._id + 'pagecanvas_' + i);
                if (canvas != undefined) {
                    var seccanvas = document.getElementById(this._id + '_secondarycanvas_' + i);
                    var context = canvas.getContext('2d');
                    if (this._pageSize[i - 1].PageRotation == 90 || this._pageSize[i - 1].PageRotation == 270) {
                        canvas.height = this._pageSize[i - 1].PageWidth * this._zoomVal;
                        canvas.width = this._pageSize[i - 1].PageHeight * this._zoomVal;
                        canvas.style.height = this._pageSize[i - 1].PageWidth * this._zoomVal + 'px';
                        canvas.style.width = this._pageSize[i - 1].PageHeight * this._zoomVal + 'px';
                        var height = this._pageSize[i - 1].PageWidth * this._zoomVal;
                        var width = this._pageSize[i - 1].PageHeight * this._zoomVal;
                        canvas.style.width = width + "px";
                        canvas.style.height = height + "px";
                        seccanvas.width = width;
                        seccanvas.height = height;
                        seccanvas.style.width = width + "px";
                        seccanvas.style.height = height + "px";
                    }
                    else {
                        canvas.height = this._pageSize[i - 1].PageHeight * this._zoomVal;
                        canvas.width = this._pageSize[i - 1].PageWidth * this._zoomVal;
                        canvas.style.height = this._pageSize[i - 1].PageHeight * this._zoomVal + 'px';
                        canvas.style.width = this._pageSize[i - 1].PageWidth * this._zoomVal + 'px';
                        var height = this._pageSize[i - 1].PageHeight * this._zoomVal;
                        var width = this._pageSize[i - 1].PageWidth * this._zoomVal;
                        canvas.style.width = width + "px";
                        canvas.style.height = height + "px";
                        seccanvas.width = width;
                        seccanvas.height = height;
                        seccanvas.style.width = width + "px";
                        seccanvas.style.height = height + "px";
                    }
                    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
                    var pagediv = $('#' + this._id + 'pageDiv_' + i);
                    pagediv[0].style.top = this._pageLocation[i] * this._zoomVal + "px";
                    pagediv[0].style.left = leftpos + "px";
                    pagediv[0].style.width = width + 'px';
                    pagediv[0].style.height = height + 'px';
                    //Hyperlink canvas

                    var hyperlinklayer = document.getElementById(this._id + 'selectioncanvas_' + i);
                    hyperlinklayer.style.height = canvas.height + 'px';
                    hyperlinklayer.style.width = canvas.width + 'px';
                    hyperlinklayer.style.position = 'absolute';
                    hyperlinklayer.style.left = 0;
                    hyperlinklayer.style.top = 0;
                    hyperlinklayer.style.backgroundColor = 'transparent';
                    hyperlinklayer.style.zIndex = '2';

                    if ($('#' + this._id + 'selectioncanvas_' + i).hasClass('text_container')) {
                        this._resizeSelection(JSON.parse(this._pageContents[parseInt(i)]), i, context);
                    }

                    if (!this._isAutoZoom) {
                        //resizing the loding indicator of the page
                        $('#' + this._id + 'pageDiv_' + i + '_WaitingPopup').css({ 'display': 'block', 'height': canvas.height + 'px', 'width': canvas.width + 'px', 'left': '0px', 'top': '0px' });
                        var loadingindicator = document.getElementById(this._id + 'pageDiv_' + i + '_WaitingPopup');
                        var spanDiv = loadingindicator.childNodes[0];
                        spanDiv.style.top = (canvas.height - spanDiv.clientHeight) / 2 + 'px';
                    }
                }
            }
            if (this._renderedCanvasList)
                this._renderedCanvasList.length = 0;

            if (this._zoomVal < 1)
                pageViewerContainer.css({ '-ms-scroll-limit-y-max': (this._cummulativeHeight * this._zoomVal) - this.element.height() + 50 + "px" });
            else {
                pageViewerContainer.css({ '-ms-scroll-limit-y-max': "" });
            }
            if (this._imageObj) {
                for (var i = 0; i < this._imageObj.length; i++) {
                    this._imageObj[i].onload = null;
                }
            }
            $("#" + this._id + "_popupmenu").hide();
            this._isPopupNoteVisible = false;
            vscrolBar.scrollTop = scrollValue;
            this._eventpreviouszoomvalue = this._preZoomVal;
            this._eventzoomvalue = this._zoomVal;
            this._preZoomVal = this._zoomVal;
            this._previousZoom = this._zoomVal;
            zoomineventvalue.previousZoomPercentage = Math.round(this._eventpreviouszoomvalue * 100);
            zoomineventvalue.currentZoomPercentage = Math.round(this._eventzoomvalue * 100);
            this._raiseClientEvent("zoomChange", zoomineventvalue);
            this.zoomPercentage = Math.round(this._zoomVal * 100);
            this._highestWidth = 0;
            this._highestHeight = 0;
            var annotationArray = [];
            if (this._selectedAnnotationObject) {
                annotationArray.push(this._selectedAnnotationObject.annotation);
                this._drawAnnotSelectRect(this._selectedAnnotationObject.pageIndex, annotationArray);
            }
        },

        _zoomOutContainer: function (isFactor, scaleFactor) {
            this._hidingSignature();
            var zoomFactor = scaleFactor;
            var pageViewerContainer = $('#' + this._id + '_viewerContainer');
            var pagecontainer = $('#' + this._id + '_pageviewContainer');
            this._selectionNodes = window.getSelection();
            $('.e-pdfviewer-formFields').hide();
            if (!(this._selectionNodes.anchorOffset == 0 && this._selectionNodes.focusOffset == 0)) {
                this._maintainSelection();
            }
            if (isFactor) {
                this._zoomVal = this._zoomVal + zoomFactor;
            }
            var w = pagecontainer.width();
            var h = pagecontainer.height();
            var zoomouteventvalue = { currentZoomPercentage: 0, previousZoomPercentage: 0 };
            var vscrolBar = document.getElementById(this._id + '_viewerContainer');
            var vscrolValue = vscrolBar.scrollTop;
            var scrollValue = (vscrolValue / this._previousZoom) * this._zoomVal;
            var transform = "scale(" + this._zoomVal + "," + this._zoomVal + ")";
            for (var i = 1; i <= this._totalPages; i++) {
                var leftpos;
                if (this._pageSize[i - 1].PageRotation == 90 || this._pageSize[i - 1].PageRotation == 270) {
                    var leftpos = (this.element.width() - this._pageSize[i - 1].PageHeight * this._zoomVal) / 2;
                } else {
                    var leftpos = (this.element.width() - this._pageSize[i - 1].PageWidth * this._zoomVal) / 2;
                }
                if (leftpos < 0)
                    leftpos = 5;
                var canvas = document.getElementById(this._id + 'pagecanvas_' + i);
                var context = canvas.getContext('2d');
                var seccanvas = document.getElementById(this._id + "_secondarycanvas_" + i);
                if (this._pageSize[i - 1].PageRotation == 90 || this._pageSize[i - 1].PageRotation == 270) {
                    canvas.height = this._pageSize[i - 1].PageWidth * this._zoomVal;
                    canvas.width = this._pageSize[i - 1].PageHeight * this._zoomVal;
                    canvas.style.height = this._pageSize[i - 1].PageWidth * this._zoomVal + 'px';
                    canvas.style.width = this._pageSize[i - 1].PageHeight * this._zoomVal + 'px';
                    var height = this._pageSize[i - 1].PageWidth * this._zoomVal;
                    var width = this._pageSize[i - 1].PageHeight * this._zoomVal;
                    canvas.style.width = width + "px";
                    canvas.style.height = height + "px";
                    seccanvas.width = width;
                    seccanvas.height = height;
                    seccanvas.style.width = width + "px";
                    seccanvas.style.height = height + "px";
                }
                else {
                    canvas.height = this._pageSize[i - 1].PageHeight * this._zoomVal;
                    canvas.width = this._pageSize[i - 1].PageWidth * this._zoomVal;
                    canvas.style.height = this._pageSize[i - 1].PageHeight * this._zoomVal + 'px';
                    canvas.style.width = this._pageSize[i - 1].PageWidth * this._zoomVal + 'px';
                    var height = this._pageSize[i - 1].PageHeight * this._zoomVal;
                    var width = this._pageSize[i - 1].PageWidth * this._zoomVal;
                    canvas.style.width = width + "px";
                    canvas.style.height = height + "px";
                    seccanvas.width = width;
                    seccanvas.height = height;
                    seccanvas.style.width = width + "px";
                    seccanvas.style.height = height + "px";
                }
                context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
                var pagediv = $('#' + this._id + 'pageDiv_' + i);
                pagediv[0].style.top = this._pageLocation[i] * this._zoomVal + "px";
                pagediv[0].style.left = leftpos + "px";
                pagediv[0].style.width = width + 'px';
                pagediv[0].style.height = height + 'px';

                //Hyperlink canvas

                var hyperlinklayer = document.getElementById(this._id + 'selectioncanvas_' + i);
                hyperlinklayer.style.height = canvas.height + 'px';
                hyperlinklayer.style.width = canvas.width + 'px';
                hyperlinklayer.style.position = 'absolute';
                hyperlinklayer.style.left = 0;
                hyperlinklayer.style.top = 0;
                hyperlinklayer.style.backgroundColor = 'transparent';
                hyperlinklayer.style.zIndex = '2';

                if ($('#' + this._id + 'selectioncanvas_' + i).hasClass('text_container')) {
                    this._resizeSelection(JSON.parse(this._pageContents[parseInt(i)]), i, context);
                }

                //resizing the loding indicator of the page
                $('#' + this._id + 'pageDiv_' + i + '_WaitingPopup').css({ 'display': 'block', 'height': canvas.height + 'px', 'width': canvas.width + 'px', 'left': '0px', 'top': '0px' });
                var loadingindicator = document.getElementById(this._id + 'pageDiv_' + i + '_WaitingPopup');
                var spanDiv = loadingindicator.childNodes[0];
                spanDiv.style.top = (canvas.height - spanDiv.clientHeight) / 2 + 'px';
            }
            if (this._renderedCanvasList)
                this._renderedCanvasList.length = 0;
            if (this._zoomVal < 1)
                pageViewerContainer.css({ '-ms-scroll-limit-y-max': (this._cummulativeHeight * this._zoomVal) - this.element.height() + 50 + "px" });
            else {
                pageViewerContainer.css({ '-ms-scroll-limit-y-max': "" });
            }
            if (this._imageObj) {
                for (var i = 0; i < this._imageObj.length; i++) {
                    this._imageObj[i].onload = null;
                }
            }
            $("#" + this._id + "_popupmenu").hide();
            this._isPopupNoteVisible = false;
            vscrolBar.scrollTop = scrollValue;
            this._eventpreviouszoomvalue = this._preZoomVal;
            this._eventzoomvalue = this._zoomVal;
            this._previousZoom = this._zoomVal;
            zoomouteventvalue.previousZoomPercentage = Math.round(this._eventpreviouszoomvalue * 100);
            zoomouteventvalue.currentZoomPercentage = Math.round(this._eventzoomvalue * 100);
            this._raiseClientEvent("zoomChange", zoomouteventvalue);
            this.zoomPercentage = Math.round(this._zoomVal * 100);
            var annotationArray = [];
            if (this._selectedAnnotationObject) {
                annotationArray.push(this._selectedAnnotationObject.annotation);
                this._drawAnnotSelectRect(this._selectedAnnotationObject.pageIndex, annotationArray);
            }
        },

        _zoomContainer: function (zoomfactor, isMode) {
            this._fitType = null;
            this._zoomVal = zoomfactor;
            /*When the zoom options are used after the page fit operations, the buttons that are disabled during page fit operation
               must be enabled. So the class that disables the button is removed.
            */
            $('#' + this._id + '_pageviewContainer').find('.e-waitingpopup').css("visibility", "");
            this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_fitPage');
            this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_fitWidth');

            if (this._isAutoZoom && this._renderedCanvasList && (this._isWindowResizing || this._isAutoSelected) && !this._isViewerRestored) {
                this._applyFitToWidthAuto();
                zoomfactor = this._zoomVal;
            }
            else {
                var scalefactor = Math.abs(this._preZoomVal - zoomfactor);
                if (scalefactor == 0) return false;
                if (this._preZoomVal > zoomfactor) {
                    this._zoomOutContainer(isMode, scalefactor);
                } else {
                    this._zoomInContainer(isMode, scalefactor);
                }
            }
            this._preZoomVal = zoomfactor;
            this._updateZoomButtons();
        },

        /*  *Since the pageFit option does not have a index for zoom level,assign the zoom level based on its nearest value. 
            * _calculateZoomLevel() function  does this function by getting the nearest lower index and higher index of 
            zoom percent in "container_toolbar_zoomSelection_popup" using binary search algorithm.
        */

        _calculateZoomLevel: function (zoomfactor) {
            this._calculateZoomArrayValues();
            //searching the nearest lower index and higher index for the fitType in the zoom level.
            var zoomVal = zoomfactor;
            var min = 0, max = this._zoomArray.length - 1;
            while ((min <= max) && !(min == 0 && max == 0)) {
                var mid = Math.round((min + max) / 2);
                if (this._zoomArray[mid] <= zoomVal) {
                    min = mid + 1;
                } else if (this._zoomArray[mid] >= zoomVal) {
                    max = mid - 1;
                }
            }
            this._lowerZoomIndex = max;
            this._higherZoomIndex = min;
            this._zoomLevel = this._lowerZoomIndex;
        },

        /*  If zoomIn() function is used after the page fit option, the lower zoom index must be set as the value for _zoomLevel.
            This is done by _applyLowerZoomIndex(). This function is executed only if the fitType is "fitToWidth" or "fitToPage".
        */

        _applyLowerZoomIndex: function () {
            var currentZoomArrayCount = 0;
            this._calculateZoomArrayValues();
            for (var i = 0; i < this._zoomArray.length; i++) {
                if (this._preZoomVal != this._zoomArray[i]) {
                    currentZoomArrayCount++;
                }
            }
            if (currentZoomArrayCount == this._zoomArray.length)
                this._zoomLevel = this._lowerZoomIndex;
            this._fitType = null;
        },

        /*  If zoomOut() function is used after the page fit option, the higher zoom index must be set as the value for _zoomLevel.
            This is done by _applyHigherZoomIndex(). This function is executed only if the fitType is "fitToWidth" or "fitToPage".
        */

        _applyHigherZoomIndex: function () {
            var currentZoomArrayCount = 0;
            this._calculateZoomArrayValues();
            for (var i = 0; i < this._zoomArray.length; i++) {
                if (this._preZoomVal != this._zoomArray[i]) {
                    currentZoomArrayCount++;
                }
            }
            if (currentZoomArrayCount == this._zoomArray.length)
                this._zoomLevel = this._higherZoomIndex;
            this._fitType = null;
        },
        _calculateZoomArrayValues: function () {
            if (this._zoomArray == undefined) {
                var popupLiItems = document.getElementById(this._id + "_toolbar_zoomSelection_popup").getElementsByTagName("li"); //getting the list of zoom percent in the div
                var zoomArray = [];
                this._zoomArray = zoomArray;
                //Converting the list into an array.
                for (var i = 0; i < popupLiItems.length; i++) {
                    zoomArray.push(parseInt(popupLiItems[i].textContent) / 100);
                }
            }
        },

        _updateZoomButtons: function () {
            if (this._zoomVal <= 0.5) {
                this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_zoomout');
                this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_zoomin');
            } else if (this._zoomVal == 4) {
                this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_zoomin');
                this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_zoomout');
            } else {
                this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_zoomout');
                this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_zoomin');
            }
        },

        _showZoomControl: function (show) {
            if (show) {
                $('#' + this._id + '_toolbar_zoomin').parents("li.e-pdfviewer-toolbarli").css("display", "block");
                $('#' + this._id + '_toolbar_zoomout').parents("li.e-pdfviewer-toolbarli").css("display", "block");
                $('#' + this._id + '_toolbar_zoomSelection').parents("div.e-pdfviewer-ejdropdownlist").css("display", "block");
                this._isMagnificationHidden = false;
            }
            else {
                $('#' + this._id + '_toolbar_zoomin').parents("li.e-pdfviewer-toolbarli").css("display", "none");
                $('#' + this._id + '_toolbar_zoomout').parents("li.e-pdfviewer-toolbarli").css("display", "none");
                $('#' + this._id + '_toolbar_zoomSelection').parents("div.e-pdfviewer-ejdropdownlist").css("display", "none");
                this._isMagnificationHidden = true;
            }
        },
        //-------------------- Page Zoom[end] -------------------------//

        _fitToAutoSize: function () {
            var zoomFactor = this._zoomVal;
            var pageViewerContainer = $('#' + this._id + '_viewerContainer');
            var pagecontainer = $('#' + this._id + '_pageviewContainer');
            var w = pagecontainer.width();
            var h = pagecontainer.height();
            var zoomouteventvalue = { currentZoomPercentage: 0, previousZoomPercentage: 0 };
            var vscrolBar = document.getElementById(this._id + '_viewerContainer');
            var vscrolValue = vscrolBar.scrollTop;
            var scrollValue = (vscrolValue / this._previousZoom) * this._zoomVal;
            var transform = "scale(" + this._zoomVal + "," + this._zoomVal + ")";
            for (var i = 1; i <= this._totalPages; i++) {
                var leftpos;
                if (this._pageSize[i - 1].PageRotation == 90 || this._pageSize[i - 1].PageRotation == 270) {
                    leftpos = (this.element.width() - this._pageSize[i - 1].PageHeight * this._zoomVal) / 2;
                } else {
                    leftpos = (this.element.width() - this._pageSize[i - 1].PageWidth * this._zoomVal) / 2;
                }
                if ((this._isAutoZoom && this._zoomVal < 1) || leftpos < 0)
                    leftpos = 5;
                var canvas = document.getElementById(this._id + 'pagecanvas_' + i);
                var seccanvas = document.getElementById(this._id + '_secondarycanvas_' + i);
                if (canvas != undefined) {
                    var context = canvas.getContext('2d');
                    var height, width;
                    if (this._pageSize[i - 1].PageRotation == 90 || this._pageSize[i - 1].PageRotation == 270) {
                        height = this._pageSize[i - 1].PageWidth * this._zoomVal;
                        width = this._pageSize[i - 1].PageHeight * this._zoomVal;
                    } else {
                        height = this._pageSize[i - 1].PageHeight * this._zoomVal;
                        width = this._pageSize[i - 1].PageWidth * this._zoomVal;
                    }
                    canvas.style.height = height + 'px';
                    canvas.style.width = width + 'px';
                    if (this._renderedCanvasList.indexOf(i) != -1) {
                        seccanvas.style.width = width + "px";
                        seccanvas.style.height = height + "px";
                        seccanvas.height = this._pageSize[i - 1].PageHeight * this._zoomVal;
                        seccanvas.width = this._pageSize[i - 1].PageWidth * this._zoomVal;
                        this._clearRectOnClick(i);
                    } else {
                        seccanvas.style.width = width + "px";
                        seccanvas.style.height = height + "px";
                        seccanvas.height = this._pageSize[i - 1].PageHeight * this._zoomVal;
                        seccanvas.width = this._pageSize[i - 1].PageWidth * this._zoomVal;
                    }
                    var pagediv = $('#' + this._id + 'pageDiv_' + i);
                    pagediv[0].style.top = this._pageLocation[i] * this._zoomVal + "px";
                    pagediv[0].style.left = leftpos + "px";
                    pagediv[0].style.width = width + 'px';
                    pagediv[0].style.height = height + 'px';

                    var selectionlayer = document.getElementById(this._id + 'selectioncanvas_' + i);
                    selectionlayer.style.height = height + 'px';
                    selectionlayer.style.width = width + 'px';
                    selectionlayer.style.position = 'absolute';
                    selectionlayer.style.left = 0;
                    selectionlayer.style.top = 0;
                    selectionlayer.style.backgroundColor = 'transparent';
                    selectionlayer.style.zIndex = '2';
                    //resizing the loding indicator of the page
                    var jsonData = this._pageContents[parseInt(i)];
                    var jsondata;
                    if (jsonData && this._renderedCanvasList.indexOf(i) != -1) {
                        if (this._pdfService == ej.PdfViewer.PdfService.Local)
                            jsondata = JSON.parse(jsonData);
                        else
                            jsondata = JSON.parse(jsonData["d"]);
                        var children = $('#' + this._id + 'selectioncanvas_' + i).children();
                        for (var k = 0; k < children.length; k++) {
                            if ($(children[k]).hasClass('e-pdfviewer-textLayer')) {
                                $(children[k]).remove();
                                $('#' + this._id + 'selectioncanvas_' + i).removeClass('text_container');
                            }
                        }
                        if (!$('#' + this._id + 'selectioncanvas_' + i).hasClass('text_container')) {
                            this._textSelection(jsondata, i, context);
                        } else {
                            this._resizeSelection(jsondata, i, context);
                        }
                    }
                }
                $('#' + this._id + 'pageDiv_' + i + '_WaitingPopup').css({ 'display': 'none', 'height': height + 'px', 'width': width + 'px', 'left': '0px', 'top': '0px' });
                var loadingindicator = document.getElementById(this._id + 'pageDiv_' + i + '_WaitingPopup');
                if (loadingindicator) {
                    var spanDiv = loadingindicator.childNodes[0];
                    spanDiv.style.top = (canvas.height - spanDiv.clientHeight) / 2 + 'px';
                }
            }
            if (this._zoomVal < 1)
                pageViewerContainer.css({ '-ms-scroll-limit-y-max': (this._cummulativeHeight * this._zoomVal) - this.element.height() + 50 + "px" });
            else {
                pageViewerContainer.css({ '-ms-scroll-limit-y-max': "" });
            }
            $("#" + this._id + "_popupmenu").hide();
            this._isPopupNoteVisible = false;
            vscrolBar.scrollTop = scrollValue;
            this._eventpreviouszoomvalue = this._preZoomVal;
            this._eventzoomvalue = this._zoomVal;
            this._previousZoom = this._zoomVal;
            this._preZoomVal = this._zoomVal;
            zoomouteventvalue.previousZoomPercentage = Math.round(this._eventpreviouszoomvalue * 100);
            zoomouteventvalue.currentZoomPercentage = Math.round(this._eventzoomvalue * 100);
            this._raiseClientEvent("zoomChange", zoomouteventvalue);
            this.zoomPercentage = Math.round(this._zoomVal * 100);
            var annotationArray = [];
            if (this._selectedAnnotationObject) {
                annotationArray.push(this._selectedAnnotationObject.annotation);
                this._drawAnnotSelectRect(this._selectedAnnotationObject.pageIndex, annotationArray);
            }
        },

        _initRerendering: function () {
            if (!this._isRerenderCanvasCreated) {
                this._designNewCanvas();
                var renderList = [];
                var currentPage = this._currentPage;
                renderList.push(parseInt(this._currentPage));
                var prevPage; var nextPage;
                if (this._renderedCanvasList) {
                    prevPage = parseInt(this._currentPage) - 1;
                    if (this._renderedCanvasList.indexOf(prevPage) != -1)
                        renderList.push(prevPage);
                    nextPage = parseInt(this._currentPage) + 1;
                    if (this._renderedCanvasList.indexOf(nextPage) != -1)
                        renderList.push(nextPage);
                }
                else {
                    prevPage = parseInt(this._currentPage) - 1;
                    renderList.push(prevPage);
                    nextPage = parseInt(this._currentPage) + 1;
                    renderList.push(nextPage);
                }
                this._rerenderCanvasList = renderList;
                if (true) {
                    var proxy = this;
                    clearInterval(proxy._scrollTimer);
                    proxy._bgRenderTimer = setInterval(function () { proxy._rerenderCanvas(currentPage) }, 10);
                }
                this._renderedCanvasList.length = 0;
            }
        },

        _designNewCanvas: function () {
            for (var i = 1; i <= this._totalPages; i++) {
                var pageDiv = document.getElementById(this._id + 'pageDiv_' + i);
                var canvas = document.getElementById(this._id + 'pagecanvas_' + i);
                var newCanvas = document.createElement('canvas');
                var height, width;
                if (this._pageSize[i - 1].PageRotation == 90 || this._pageSize[i - 1].PageRotation == 270) {
                    height = this._pageSize[i - 1].PageWidth * this._zoomVal;
                    width = this._pageSize[i - 1].pageHeight * this._zoomVal;
                } else {
                    height = this._pageSize[i - 1].PageHeight * this._zoomVal;
                    width = this._pageSize[i - 1].PageWidth * this._zoomVal;
                }
                newCanvas.style.visibility = 'hidden';
                newCanvas.style.width = width + "px";
                newCanvas.style.height = height + "px";
                newCanvas.style.backgroundColor = 'white';
                newCanvas.height = height;
                newCanvas.width = width;
                newCanvas.id = canvas.id;
                newCanvas.className = "e-pdfviewer-pageCanvas";
                canvas.id = this._id + 'oldcanvas_' + i;
                pageDiv.appendChild(newCanvas);
                $(newCanvas).css({ 'user-select': 'none' });
                var seccanvas = document.getElementById(this._id + '_secondarycanvas_' + i);
                seccanvas.style.width = width + "px";
                seccanvas.style.height = height + "px";
                seccanvas.width = width;
                seccanvas.height = height;
            }
            this._isRerenderCanvasCreated = true;
        },

        _replaceOldCanvas: function () {
            for (var i = 1; i <= this._totalPages; i++) {
                var pageDiv = document.getElementById(this._id + 'pageDiv_' + i);
                var canvas = document.getElementById(this._id + 'pagecanvas_' + i);
                var oldcanvas = document.getElementById(this._id + 'oldcanvas_' + i);
                if (canvas != undefined && canvas != null) {
                    canvas.style.visibility = 'visible';
                }
                if (oldcanvas != undefined && oldcanvas != null) {
                    pageDiv.removeChild(oldcanvas);
                }
            }
            this._isRerenderCanvasCreated = false;
            var proxy = this;
            clearInterval(proxy._bgRenderTimer);
            if (this._pageContents)
                proxy._scrollTimer = setInterval(function () { proxy._pageviewscrollchanged(proxy._pageHeight) }, 500);
        },

        _rerenderCanvas: function (currentPage) {
            if (this._renderedCanvasList.indexOf(parseInt(currentPage)) == -1 && currentPage <= this._totalPages && this._rerenderCanvasList.indexOf(parseInt(currentPage)) != -1) {
                var jsdata = this._pageContents[parseInt(currentPage)];
                if (jsdata != undefined && jsdata != null) {
                    this._rerenderPdfPage(jsdata);
                    this._renderCount = this._renderCount + 1;
                }
            } else if (this._renderedCanvasList.indexOf(parseInt(currentPage) - 1) == -1 && (currentPage - 1) <= this._totalPages && this._rerenderCanvasList.indexOf(parseInt(currentPage) - 1) != -1) {
                var jsdata = this._pageContents[parseInt(currentPage) - 1];
                if (jsdata != undefined && jsdata != null) {
                    this._rerenderPdfPage(jsdata);
                    this._renderCount = this._renderCount + 1;
                }
            } else if (this._renderedCanvasList.indexOf(parseInt(currentPage) + 1) == -1 && (currentPage + 1) <= this._totalPages && this._rerenderCanvasList.indexOf(parseInt(currentPage) + 1) != -1) {
                var jsdata = this._pageContents[parseInt(currentPage) + 1];
                if (jsdata != undefined && jsdata != null) {
                    this._rerenderPdfPage(jsdata);
                    this._renderCount = this._renderCount + 1;
                }
            }
            if (this._renderCount == this._rerenderCanvasList.length) {
                this._replaceOldCanvas();
                for (var i = 1; i <= this._totalPages; i++) {
                    if (this._renderedCanvasList.indexOf(i) == -1) {
                        $('#' + this._id + 'pageDiv_' + i + '_WaitingPopup').css({ 'display': 'block' });
                    }
                }
                this._renderCount = 0;
                this._rerenderCanvasList.length = 0;
            }
        },

        _rerenderPdfPage: function (jsondata) {
            var backupjson = jsondata;
            if (jsondata != undefined && jsondata != null) {
                if (this._pdfService == ej.PdfViewer.PdfService.Local)
                    jsondata = JSON.parse(jsondata);
                else
                    jsondata = JSON.parse(jsondata["d"]);
                this._renderedCanvasList.push(parseInt(jsondata["currentpage"]));
                var pageindex = parseInt(jsondata["currentpage"]);
                var pageimageList = jsondata["imagestream"];

                this._pageContents[parseInt(jsondata["currentpage"])] = backupjson;

                //  Hyperlink
                this._regenerateFormFields(jsondata, pageindex);
                var children = $('#' + this._id + 'selectioncanvas_' + pageindex).children();
                for (i = 0; i < children.length; i++) {
                    if (children[i].hasAttribute('href') || $(children[i]).hasClass('e-pdfviewer-formFields'))
                        $(children[i]).remove();
                }
                this._createFormFields(jsondata, pageindex);
                var linkannot = jsondata["linkannotation"];
                var documentlinkpagenumber = jsondata["annotpagenum"];
                var ins = this;
                if (this.model.enableHyperlink) {
                    for (var l = 0; l < linkannot.length; l++) {
                        var aTag = document.createElement('a');
                        aTag.id = 'linkdiv_' + l;
                        var rect = linkannot[l].AnnotRectangle;
                        aTag.style.background = 'transparent';
                        aTag.style.position = 'absolute';
                        aTag.style.left = this._convertPointToPixel(rect.Left * this._zoomVal) + 'px';
                        aTag.style.top = this._convertPointToPixel(rect.Top * this._zoomVal) + 'px';
                        aTag.style.width = this._convertPointToPixel(rect.Width * this._zoomVal) + 'px';
                        aTag.style.height = this._convertPointToPixel(rect.Height * this._zoomVal) + 'px';
                        aTag.style.color = 'transparent';
                        if (linkannot[l].URI.indexOf("mailto:") != -1) {
                            var mail = linkannot[l].URI.substring(linkannot[l].URI.indexOf("mailto:"), linkannot[l].URI.length);
                            aTag.title = mail;
                            aTag.setAttribute('href', mail);
                        } else {
                            aTag.title = linkannot[l].URI;
                            aTag.setAttribute('href', linkannot[l].URI);
                        }
                        if (this.model.hyperlinkOpenState == ej.PdfViewer.LinkTarget.Default) {
                            aTag.target = "_self";
                            aTag.onclick = function () {
                                var hyperlink = { hyperlink: this.href }
                                ins._raiseClientEvent("hyperlinkClick", hyperlink);
                            }
                        } else if (this.model.hyperlinkOpenState == ej.PdfViewer.LinkTarget.NewTab) {
                            aTag.target = "_blank";
                            aTag.onclick = function () {
                                var hyperlink = { hyperlink: this.href }
                                ins._raiseClientEvent("hyperlinkClick", hyperlink);

                            }
                        } else if (this.model.hyperlinkOpenState == ej.PdfViewer.LinkTarget.NewWindow) {

                            aTag.onclick = function () {
                                var hyperlink = { hyperlink: this.href }
                                ins._raiseClientEvent("hyperlinkClick", hyperlink);
                                window.open(this.href, '_blank', 'scrollbars=yes,resizable=yes');
                                return false;
                            }
                        }
                        if (documentlinkpagenumber[l] != undefined) {
                            var destPageHeight = (this._pageSize[pageindex - 1].PageHeight);
                            var destAnnotLoc = this._convertPointToPixel(linkannot[l].AnnotLocation);
                            var dest = (destPageHeight - destAnnotLoc);
                            var scrollvalue = (parseFloat(this._pageLocation[documentlinkpagenumber[l]] * this._zoomVal)) + parseFloat(dest * this._zoomVal);
                            aTag.name = scrollvalue;
                            aTag.onclick = function () {
                                var pageviewcontainer = document.getElementById('container_viewerContainer');
                                pageviewcontainer.scrollTop = this.name;
                                return false;
                            }
                        }
                        var selectioncanvas = document.getElementById(this._id + 'selectioncanvas_' + pageindex);
                        if (selectioncanvas)
                            selectioncanvas.appendChild(aTag);
                    }
                }
                //Hyperlink

                if (this._textMarkupAnnotationList[pageindex]) {
                    this._renderTextMarkupAnnotation(this._textMarkupAnnotationList[pageindex], pageindex);
                }
                var index = parseInt(jsondata["currentpage"]);
                var canvas = document.getElementById(this._id + 'pagecanvas_' + parseInt(jsondata["currentpage"]));
                if (canvas != undefined && canvas != null) {
                    var context = canvas.getContext('2d');
                    var ratio = this._scalingTextContent(context);
                    if (this._pageSize[index - 1].PageRotation == 90 || this._pageSize[index - 1].PageRotation == 270) {
                        canvas.height = this._zoomVal * this._pageSize[index - 1].PageHeight;
                        canvas.width = this._zoomVal * this._pageSize[index - 1].PageWidth;
                        canvas.style.width = this._zoomVal * this._pageSize[index - 1].PageWidth + 'px';
                        canvas.style.height = this._zoomVal * this._pageSize[index - 1].PageHeight + 'px';
                    }
                    else {
                        canvas.width = this._zoomVal * this._pageSize[pageindex - 1].PageWidth * ratio;
                        canvas.height = this._zoomVal * this._pageSize[pageindex - 1].PageHeight * ratio;
                        canvas.style.height = this._zoomVal * this._pageSize[pageindex - 1].PageHeight + 'px';
                        canvas.style.width = this._zoomVal * this._pageSize[pageindex - 1].PageWidth + 'px';
                    }
                    var context = canvas.getContext('2d');
                    var imageObjCollection = new Array();
                    var imageTransformCollection = new Array();
                    var imageDataCollection = new Array();
                    var currentIndexCollection = new Array();
                    var imageFilter = new Array();
                    var pageDataCollection = new Array();
                    var zoomFactor;
                    var browserUserAgent = navigator.userAgent;
                    var offsett;
                    var imageIndex = 0;

                    var charPath = new Array();
                    var shapes = pageimageList["textelements"];
                    for (var j = 0; j < shapes.length; j++) {
                        var pathdata = shapes[j];
                        var color = pathdata["color"];
                        var matrix = pathdata["matrix"];
                        if (matrix != null)
                            matrix = matrix["Elements"];
                        var brushMode = pathdata["brush"];
                        var pathValue = pathdata["pathValue"];
                        var isClipping = pathdata["iscliping"];
                        var restoreCanvas = pathdata["restorecanvas"];
                        var imageData = pathdata["imagedata"];
                        var fillMode = pathdata["fillrule"];
                        var fillStroke = pathdata["isFillandStroke"];
                        var fillColor = pathdata["fillcolor"];
                        var strokeColor = pathdata["strokecolor"];
                        var lineWidth = pathdata["linewidth"];
                        var lineCap = pathdata["linecap"];
                        var linearGradient = pathdata["linearGradientBrush"];
                        var textureBrush = pathdata["textureBrushs"];
                        var charID = pathdata["charID"];
                        var alpha = pathdata["alpha"];
                        var filter = pathdata["filters"];
                        var dashedPattern = pathdata["dashPattern"];
                        if (dashedPattern != null && dashedPattern.length > 0) {
                            context.setLineDash(dashedPattern);
                        }
                        if (pathValue != null) {
                            pathValue = pathValue.split(";");
                            if (charID)
                                charPath[charID] = pathValue;
                        }
                        else if (pathValue == null && charID) {
                            pathValue = charPath[charID];
                        }
                        if (restoreCanvas == false) {
                            context.save();
                        }
                        if (pathValue != undefined) {
                            if (this._pageSize[pageindex - 1].PageRotation == 90) {
                                context.setTransform(matrix[0] * this._zoomVal, matrix[1] * this._zoomVal, matrix[2] * this._zoomVal, matrix[3] * this._zoomVal, matrix[4] * this._zoomVal, matrix[5] * this._zoomVal);
                            } else {
                                context.setTransform(matrix[0] * this._zoomVal * ratio, matrix[1] * this._zoomVal * ratio, matrix[2] * this._zoomVal * ratio, matrix[3] * this._zoomVal * ratio, matrix[4] * this._zoomVal * ratio, matrix[5] * this._zoomVal * ratio);
                            }
                        }

                        if (pathValue != null) {
                            context.beginPath();

                            for (var i = 0; i < pathValue.length; i++) {
                                var val = pathValue[i];
                                var pathType = val[0];
                                if (pathType == "M") {
                                    val = val.substring(1, val.length);
                                    val = val.split(" ");
                                    context.moveTo((val[0]), val[1]);
                                }
                                else if (pathType == "L") {
                                    val = val.substring(1, val.length);
                                    val = val.split(" ");
                                    context.lineTo((val[0]), val[1]);
                                }
                                else if (pathType == "C") {
                                    val = val.substring(1, val.length);
                                    val = val.split(" ");
                                    context.bezierCurveTo(val[0], val[1], val[2], val[3], val[4], val[5]);
                                }
                                else if (pathType == "Z") {
                                    context.closePath();
                                }
                            }
                            if (isClipping == true) {
                                if (fillMode == "evenodd") {
                                    context.msFillRule = "evenodd";
                                    context.mozFillRule = "evenodd";
                                    context.clip(fillMode);
                                }
                                context.clip();

                            }
                            else {
                                if (fillStroke == undefined) {
                                    if (brushMode == "Fill") {
                                        if (linearGradient != undefined) {
                                            context.fillStyle = this._getGradientBrush(linearGradient, context);
                                        }
                                        else if (textureBrush != undefined) {
                                            context.fillStyle = this._createTextureBrush(textureBrush, context, pathdata);
                                        }
                                        else {
                                            if (alpha != undefined)
                                                context.globalAlpha = alpha;
                                            context.fillStyle = color;
                                        }
                                        if (fillMode == "evenodd") {
                                            context.msFillRule = "evenodd";
                                            context.mozFillRule = "evenodd";
                                            context.fill(fillMode);
                                        }
                                        context.fill();
                                    }
                                    else if (brushMode == "FillandStroke") {
                                        context.fillStyle = color;
                                        context.lineWidth = lineWidth;
                                        context.fill();
                                        context.strokeStyle = strokeColor;
                                        context.stroke();
                                    }
                                    else if (brushMode == "Stroke") {
                                        context.strokeStyle = strokeColor;
                                        context.lineWidth = lineWidth;
                                        context.lineCap = lineCap;
                                        context.stroke();
                                    }
                                    else {
                                        context.strokeStyle = color;
                                        context.lineWidth = lineWidth;
                                        context.lineCap = lineCap;
                                        context.stroke();
                                    }
                                }
                                else {
                                    context.strokeStyle = strokeColor;
                                    context.lineWidth = lineWidth;
                                    context.lineCap = lineCap;
                                    context.stroke();
                                    if (linearGradient != undefined) {
                                        context.fillStyle = this._getGradientBrush(linearGradient, context);
                                    }
                                    else if (textureBrush != undefined) {
                                        context.fillStyle = this._createTextureBrush(textureBrush, context, pathdata);
                                    }
                                    else
                                        context.fillStyle = fillColor;
                                    if (fillMode == "evenodd") {
                                        context.msFillRule = "evenodd";
                                        context.mozFillRule = "evenodd";
                                        context.fill(fillMode);
                                    }
                                    context.fill();
                                }
                            }
                        }

                        if (restoreCanvas)
                            context.restore();
                        if (imageData != undefined) {
                            if ((offsett = browserUserAgent.indexOf("Firefox")) != -1 || (offsett = browserUserAgent.indexOf("Chrome")) != -1 || (offsett = browserUserAgent.indexOf("Safari")) != -1 || (offsett = browserUserAgent.indexOf("AppleWebKit")) != -1) {
                                imageObjCollection.push(imageData);
                                imageTransformCollection.push(matrix);
                                pageDataCollection.push(shapes);
                                currentIndexCollection.push(j);
                                imageFilter.push(filter);
                                zoomFactor = this._zoomVal;
                                this._isContainImage = true;
                                break;
                            }
                            else {
                                var imageObj = new Image();
                                imageObj.src = imageData;
                                context.setTransform(matrix[0] * this._zoomVal * ratio, matrix[1] * this._zoomVal * ratio, matrix[2] * this._zoomVal * ratio, matrix[3] * this._zoomVal * ratio, matrix[4] * this._zoomVal * ratio, matrix[5] * this._zoomVal * ratio);
                                context.drawImage(imageObj, 0, 0, 1, 1);
                            }
                        }
                    }

                    if ((offsett = browserUserAgent.indexOf("Firefox")) != -1 || (offsett = browserUserAgent.indexOf("Chrome")) != -1 || (offsett = browserUserAgent.indexOf("Safari")) != -1 || (offsett = browserUserAgent.indexOf("AppleWebKit")) != -1) {
                        for (var k = 0; k < imageObjCollection.length; k++) {
                            this._imageRenderingPinch(shapes, imageDataCollection, imageObjCollection, imageTransformCollection, context, k, pageDataCollection, currentIndexCollection, charPath, canvas, index, imageIndex, imageFilter);
                            imageIndex++;
                        }
                    }
                    var tempcanvas = canvas;
                    var proxy = this;
                    if (this._pageSize[index - 1].PageRotation != 0) {
                        tempcanvas = document.getElementById(this._id + 'pagecanvas_' + parseInt(jsondata["currentpage"]));
                        var canvasUrl = tempcanvas.toDataURL();
                        var context = tempcanvas.getContext('2d');
                        var image = new Image();
                        image.onload = function () {
                            context.clearRect(0, 0, tempcanvas.width, tempcanvas.height);
                            if (proxy._pageSize[index - 1].PageRotation == 90 || proxy._pageSize[index - 1].PageRotation == 270) {
                                tempcanvas.width = proxy._zoomVal * proxy._pageSize[index - 1].PageHeight;
                                tempcanvas.height = proxy._zoomVal * proxy._pageSize[index - 1].PageWidth;
                                tempcanvas.style.height = proxy._zoomVal * proxy._pageSize[index - 1].PageWidth + 'px';
                                tempcanvas.style.width = proxy._zoomVal * proxy._pageSize[index - 1].PageHeight + 'px';
                            } else {
                                tempcanvas.width = proxy._zoomVal * proxy._pageSize[index - 1].PageWidth;
                                tempcanvas.height = proxy._zoomVal * proxy._pageSize[index - 1].PageHeight;
                                tempcanvas.style.height = proxy._zoomVal * proxy._pageSize[index - 1].PageHeight + 'px';
                                tempcanvas.style.width = proxy._zoomVal * proxy._pageSize[index - 1].PageWidth + 'px';

                            }
                            context.save();
                            context.translate(tempcanvas.width / 2, tempcanvas.height / 2);
                            context.rotate((proxy._pageSize[index - 1].PageRotation / 2) * Math.PI / 2);
                            context.drawImage(image, -image.width / 2, -image.height / 2);
                            context.restore();
                        }
                        image.src = canvasUrl;
                    }
                    this._changingImageCanvasPosition(pageindex);
                    this._showSignature();
                    this._showPageLoadingIndicator(pageindex, false);
                    return tempcanvas;
                }
            }
        },
        _regenerateFormFields: function (jsondata, pageindex) {
            var TextBoxField = jsondata["pdfRenderedFields"];
            var backgroundcolor;
            if (TextBoxField != null) {
                for (var l = 0; l < TextBoxField.length; l++) {
                    if ((TextBoxField[l].PageIndex + 1) == pageindex) {
                        var boundingRect = TextBoxField[l].LineBounds;
                        var inputdiv = document.getElementById(this._id + 'input_' + pageindex + '_' + l);
                        if (TextBoxField[l].Name == "Textbox") {
                            var name = $(inputdiv).attr("name");
                            if (TextBoxField[l].FieldName == name)
                                TextBoxField[l].Text = $(inputdiv).val();
                        }
                        else if (TextBoxField[l].Name == "Password") {
                            var name = $(inputdiv).attr("name");
                            if (TextBoxField[l].FieldName == name)
                                TextBoxField[l].Text = $(inputdiv).val();
                        }
                        else if (TextBoxField[l].Name == "RadioButton") {
                            var name = $(inputdiv).attr("name");
                            if (TextBoxField[l].GroupName == name) {
                                if ($(inputdiv).prop("checked") == true)
                                    TextBoxField[l].Selected = true;
                                else
                                    TextBoxField[l].Selected = false;
                            }
                        }
                        else if (TextBoxField[l].Name == "CheckBox") {
                            var name = $(inputdiv).attr("name");
                            if (TextBoxField[l].GroupName == name) {
                                if ($(inputdiv).prop("checked") == true)
                                    TextBoxField[l].Selected = true;
                                else
                                    TextBoxField[l].Selected = false;
                            }
                        }
                        else if (TextBoxField[l].Name == "DropDown") {
                            var name = $(inputdiv).attr("name");
                            if (TextBoxField[l].Text == name) {
                                if (TextBoxField[l].SelectedValue == "") {
                                    var option = $(inputdiv).children()[0];
                                    option.id = "dropdownhide";
                                    if ($(option).prop("selected") == true)
                                        TextBoxField[l].SelectedValue = "";
                                }
                                for (var j = 0; j < TextBoxField[l].TextList.length; j++) {
                                    var option;
                                    if ($(inputdiv).children()[0].id == "dropdownhide")
                                        option = $(inputdiv).children()[j + 1];
                                    else
                                        option = $(inputdiv).children()[j];
                                    if ($(option).prop("selected") == true)
                                        TextBoxField[l].SelectedValue = TextBoxField[l].TextList[j];
                                }
                            }
                        }
                        else if (TextBoxField[l].Name == "ListBox") {
                            var k = 0;
                            for (var j = 0; j < TextBoxField[l].TextList.length; j++) {
                                var option = $(inputdiv).children()[j];
                                if ($(option).prop("selected") == true) {
                                    TextBoxField[l].SelectedList[k] = j;
                                    k++;
                                }
                            }
                        }
                    }
                }
            }


        },
        _imageRenderingPinch: function (shapes, imageDataCollection, imageObjCollection, imageTransformCollection, context, index, pageDataCollection, currentIndexCollection, charPath, canvas, currentindex, imageIndex, imageFilter) {
            var proxy = this;
            var zoomValue = proxy._zoomVal;
            var is_chrome = navigator.userAgent.indexOf('Chrome') != -1;
            var is_firefox = navigator.userAgent.indexOf('Firefox') != -1;
            var imageObject = new Image();
            if ((is_chrome || is_firefox) && imageFilter == "CCITTFaxDecode") {
                var isImageContentChanged = false;
                var ratio = proxy._scalingTextContent(context);
                for (var l = 0; l < imageTransformCollection.length; l++) {
                    if (isImageContentChanged == false) {
                        var matrixData = imageTransformCollection[l];
                        context.setTransform(matrixData[0] * zoomValue * ratio, matrixData[1] * zoomValue * ratio, matrixData[2] * zoomValue * ratio, matrixData[3] * zoomValue * ratio, matrixData[4] * zoomValue * ratio, matrixData[5] * zoomValue * ratio);
                        if (imageDataCollection[imageIndex] != undefined) {
                            context.drawImage(imageDataCollection[imageIndex], 0, 0, 1, 1);
                        }
                        var dataIndex = currentIndexCollection[l];
                        dataIndex = dataIndex + 1;
                        var data = pageDataCollection[l];
                        while (dataIndex < data.length) {
                            var pathdata = data[dataIndex];
                            var color = pathdata["color"];
                            var matrix = pathdata["matrix"];
                            if (matrix != null)
                                matrix = matrix["Elements"];
                            var brushMode = pathdata["brush"];
                            var pathValue = pathdata["pathValue"];
                            var isClipping = pathdata["iscliping"];
                            var restoreCanvas = pathdata["restorecanvas"];
                            var imageData = pathdata["imagedata"];
                            var fillMode = pathdata["fillrule"];
                            var fillStroke = pathdata["isFillandStroke"];
                            var fillColor = pathdata["fillcolor"];
                            var strokeColor = pathdata["strokecolor"];
                            var lineWidth = pathdata["linewidth"];
                            var lineCap = pathdata["linecap"];
                            var linearGradient = pathdata["linearGradientBrush"];
                            var textureBrush = pathdata["textureBrushs"];
                            var charID = pathdata["charID"];
                            var alpha = pathdata["alpha"];
                            var filter = pathdata["filters"];
                            var dashedPattern = pathdata["dashPattern"];
                            if (dashedPattern != null && dashedPattern.length > 0) {
                                context.setLineDash(dashedPattern);
                            }
                            if (pathValue != null) {
                                pathValue = pathValue.split(";");
                                if (charID)
                                    charPath[charID] = pathValue;
                            }
                            else if (pathValue == null && charID) {
                                pathValue = charPath[charID];
                            }
                            if (restoreCanvas == false) {
                                context.save();
                            }
                            if (pathValue != undefined) {
                                context.setTransform(matrix[0] * zoomValue * ratio, matrix[1] * zoomValue * ratio, matrix[2] * zoomValue * ratio, matrix[3] * zoomValue * ratio, matrix[4] * zoomValue * ratio, matrix[5] * zoomValue * ratio);
                            }

                            if (pathValue != null) {
                                context.beginPath();

                                for (var i = 0; i < pathValue.length; i++) {
                                    var val = pathValue[i];
                                    var pathType = val[0];
                                    if (pathType == "M") {
                                        val = val.substring(1, val.length);
                                        val = val.split(" ");
                                        context.moveTo((val[0]), val[1]);
                                    }
                                    else if (pathType == "L") {
                                        val = val.substring(1, val.length);
                                        val = val.split(" ");
                                        context.lineTo((val[0]), val[1]);
                                    }
                                    else if (pathType == "C") {
                                        val = val.substring(1, val.length);
                                        val = val.split(" ");
                                        context.bezierCurveTo(val[0], val[1], val[2], val[3], val[4], val[5]);
                                    }
                                    else if (pathType == "Z") {
                                        context.closePath();
                                    }
                                }
                                if (isClipping == true) {
                                    if (fillMode == "evenodd") {
                                        context.msFillRule = "evenodd";
                                        context.mozFillRule = "evenodd";
                                        context.clip(fillMode);
                                    }
                                    context.clip();

                                }
                                else {
                                    if (fillStroke == undefined) {
                                        if (brushMode == "Fill") {
                                            if (linearGradient != undefined) {
                                                context.fillStyle = proxy._getGradientBrush(linearGradient, context);
                                            }
                                            else if (textureBrush != undefined) {
                                                context.fillStyle = proxy._createTextureBrush(textureBrush, context, pathdata);
                                            }
                                            else {
                                                if (alpha != undefined)
                                                    context.globalAlpha = alpha;
                                                context.fillStyle = color;
                                            }
                                            if (fillMode == "evenodd") {
                                                context.msFillRule = "evenodd";
                                                context.mozFillRule = "evenodd";
                                                context.fill(fillMode);
                                            }
                                            context.fill();
                                        }
                                        else if (brushMode == "FillandStroke") {
                                            context.fillStyle = color;
                                            context.lineWidth = lineWidth;
                                            context.fill();
                                            context.strokeStyle = strokeColor;
                                            context.stroke();
                                        }
                                        else if (brushMode == "Stroke") {
                                            context.strokeStyle = strokeColor;
                                            context.lineWidth = lineWidth;
                                            context.lineCap = lineCap;
                                            context.stroke();
                                        }
                                        else {
                                            context.strokeStyle = color;
                                            context.lineWidth = lineWidth;
                                            context.lineCap = lineCap;
                                            context.stroke();
                                        }
                                    }
                                    else {
                                        context.strokeStyle = strokeColor;
                                        context.lineWidth = lineWidth;
                                        context.lineCap = lineCap;
                                        context.stroke();
                                        if (linearGradient != undefined) {
                                            context.fillStyle = proxy._getGradientBrush(linearGradient, context);
                                        }
                                        else if (textureBrush != undefined) {
                                            context.fillStyle = proxy._createTextureBrush(textureBrush, context, pathdata);
                                        }
                                        else
                                            context.fillStyle = fillColor;
                                        if (fillMode == "evenodd") {
                                            context.msFillRule = "evenodd";
                                            context.mozFillRule = "evenodd";
                                            context.fill(fillMode);
                                        }
                                        context.fill();
                                    }
                                }
                            }

                            if (restoreCanvas)
                                context.restore();
                            if (imageData != undefined) {
                                isImageContentChanged = true;
                                imageObjCollection.pop();
                                imageTransformCollection.pop();
                                pageDataCollection.pop();
                                currentIndexCollection.pop();
                                imageObjCollection.push(imageData);
                                imageTransformCollection.push(matrix);
                                pageDataCollection.push(shapes);
                                currentIndexCollection.push(dataIndex);
                                imageFilter.pop();
                                imageFilter.push(filter);
                                l = -1;
                                imageIndex++;
                                break;
                            }
                            dataIndex++;
                        }
                    }
                    else {
                        proxy._imageRenderingPinch(shapes, imageDataCollection, imageObjCollection, imageTransformCollection, context, l, pageDataCollection, currentIndexCollection, charPath, canvas, currentindex, imageIndex, imageFilter);
                        imageIndex++;
                    }
                }
            }
            else {
                imageObject.onload = function () {
                    var isImageContentChanged = false;
                    var ratio = proxy._scalingTextContent(context);
                    for (var l = 0; l < imageTransformCollection.length; l++) {
                        if (isImageContentChanged == false) {
                            var matrixData = imageTransformCollection[l];
                            context.setTransform(matrixData[0] * zoomValue * ratio, matrixData[1] * zoomValue * ratio, matrixData[2] * zoomValue * ratio, matrixData[3] * zoomValue * ratio, matrixData[4] * zoomValue * ratio, matrixData[5] * zoomValue * ratio);
                            if (imageDataCollection[imageIndex] != undefined) {
                                context.drawImage(imageDataCollection[imageIndex], 0, 0, 1, 1);
                            }
                            var dataIndex = currentIndexCollection[l];
                            dataIndex = dataIndex + 1;
                            var data = pageDataCollection[l];
                            while (dataIndex < data.length) {
                                var pathdata = data[dataIndex];
                                var color = pathdata["color"];
                                var matrix = pathdata["matrix"];
                                if (matrix != null)
                                    matrix = matrix["Elements"];
                                var brushMode = pathdata["brush"];
                                var pathValue = pathdata["pathValue"];
                                var isClipping = pathdata["iscliping"];
                                var restoreCanvas = pathdata["restorecanvas"];
                                var imageData = pathdata["imagedata"];
                                var fillMode = pathdata["fillrule"];
                                var fillStroke = pathdata["isFillandStroke"];
                                var fillColor = pathdata["fillcolor"];
                                var strokeColor = pathdata["strokecolor"];
                                var lineWidth = pathdata["linewidth"];
                                var lineCap = pathdata["linecap"];
                                var linearGradient = pathdata["linearGradientBrush"];
                                var textureBrush = pathdata["textureBrushs"];
                                var charID = pathdata["charID"];
                                var alpha = pathdata["alpha"];
                                var dashedPattern = pathdata["dashPattern"];
                                if (dashedPattern != null && dashedPattern.length > 0) {
                                    context.setLineDash(dashedPattern);
                                }
                                if (pathValue != null) {
                                    pathValue = pathValue.split(";");
                                    if (charID)
                                        charPath[charID] = pathValue;
                                }
                                else if (pathValue == null && charID) {
                                    pathValue = charPath[charID];
                                }
                                if (restoreCanvas == false) {
                                    context.save();
                                }
                                if (pathValue != undefined) {
                                    context.setTransform(matrix[0] * zoomValue * ratio, matrix[1] * zoomValue * ratio, matrix[2] * zoomValue * ratio, matrix[3] * zoomValue * ratio, matrix[4] * zoomValue * ratio, matrix[5] * zoomValue * ratio);
                                }

                                if (pathValue != null) {
                                    context.beginPath();

                                    for (var i = 0; i < pathValue.length; i++) {
                                        var val = pathValue[i];
                                        var pathType = val[0];
                                        if (pathType == "M") {
                                            val = val.substring(1, val.length);
                                            val = val.split(" ");
                                            context.moveTo((val[0]), val[1]);
                                        }
                                        else if (pathType == "L") {
                                            val = val.substring(1, val.length);
                                            val = val.split(" ");
                                            context.lineTo((val[0]), val[1]);
                                        }
                                        else if (pathType == "C") {
                                            val = val.substring(1, val.length);
                                            val = val.split(" ");
                                            context.bezierCurveTo(val[0], val[1], val[2], val[3], val[4], val[5]);
                                        }
                                        else if (pathType == "Z") {
                                            context.closePath();
                                        }
                                    }
                                    if (isClipping == true) {
                                        if (fillMode == "evenodd") {
                                            context.msFillRule = "evenodd";
                                            context.mozFillRule = "evenodd";
                                            context.clip(fillMode);
                                        }
                                        context.clip();

                                    }
                                    else {
                                        if (fillStroke == undefined) {
                                            if (brushMode == "Fill") {
                                                if (linearGradient != undefined) {
                                                    context.fillStyle = proxy._getGradientBrush(linearGradient, context);
                                                }
                                                else if (textureBrush != undefined) {
                                                    context.fillStyle = proxy._createTextureBrush(textureBrush, context, pathdata);
                                                }
                                                else {
                                                    if (alpha != undefined)
                                                        context.globalAlpha = alpha;
                                                    context.fillStyle = color;
                                                }
                                                if (fillMode == "evenodd") {
                                                    context.msFillRule = "evenodd";
                                                    context.mozFillRule = "evenodd";
                                                    context.fill(fillMode);
                                                }
                                                context.fill();
                                            }
                                            else if (brushMode == "FillandStroke") {
                                                context.fillStyle = color;
                                                context.lineWidth = lineWidth;
                                                context.fill();
                                                context.strokeStyle = strokeColor;
                                                context.stroke();
                                            }
                                            else if (brushMode == "Stroke") {
                                                context.strokeStyle = strokeColor;
                                                context.lineWidth = lineWidth;
                                                context.lineCap = lineCap;
                                                context.stroke();
                                            }
                                            else {
                                                context.strokeStyle = color;
                                                context.lineWidth = lineWidth;
                                                context.lineCap = lineCap;
                                                context.stroke();
                                            }
                                        }
                                        else {
                                            context.strokeStyle = strokeColor;
                                            context.lineWidth = lineWidth;
                                            context.lineCap = lineCap;
                                            context.stroke();
                                            if (linearGradient != undefined) {
                                                context.fillStyle = proxy._getGradientBrush(linearGradient, context);
                                            }
                                            else if (textureBrush != undefined) {
                                                context.fillStyle = proxy._createTextureBrush(textureBrush, context, pathdata);
                                            }
                                            else
                                                context.fillStyle = fillColor;
                                            if (fillMode == "evenodd") {
                                                context.msFillRule = "evenodd";
                                                context.mozFillRule = "evenodd";
                                                context.fill(fillMode);
                                            }
                                            context.fill();
                                        }
                                    }
                                }

                                if (restoreCanvas)
                                    context.restore();
                                if (imageData != undefined) {
                                    isImageContentChanged = true;
                                    imageObjCollection.pop();
                                    imageTransformCollection.pop();
                                    pageDataCollection.pop();
                                    currentIndexCollection.pop();
                                    imageObjCollection.push(imageData);
                                    imageTransformCollection.push(matrix);
                                    pageDataCollection.push(shapes);
                                    currentIndexCollection.push(dataIndex);
                                    l = -1;
                                    imageIndex++;
                                    break;
                                }
                                dataIndex++;
                            }
                        }
                        else {
                            proxy._imageRenderingPinch(shapes, imageDataCollection, imageObjCollection, imageTransformCollection, context, l, pageDataCollection, currentIndexCollection, charPath, canvas, currentindex, imageIndex);
                            imageIndex++;
                        }
                    }
                }
                imageObject.src = imageObjCollection[index];
                imageDataCollection.push(imageObject);
            }
        },
        //-------------------- Pinch Zoom [Start] -----------------------------//

        _touchStart: function (event) {
            var eventTouch = event.touches;
            if (eventTouch.length > 1) {
                event.preventDefault();
            }
            var ejViewer = $(event.target).parents('.e-pdfviewer.e-js');
            var ejViewerInstance = ejViewer.ejPdfViewer("instance");
            ejViewerInstance._touched = false;
        },
        _touchMove: function (event) {
            var eventTouch = event.touches;
            if (eventTouch.length > 1) {
                var ejViewer = $(event.target).parents('.e-pdfviewer.e-js');
                var ejViewerInstance = ejViewer.ejPdfViewer("instance");
                ejViewerInstance._touched = true;
                if (!ejViewerInstance._isRerenderCanvasCreated) {
                    $('.e-pdfviewer-formFields').hide();
                    var currentDiff = Math.sqrt(Math.pow((eventTouch[0].clientX - eventTouch[1].clientX), 2) + Math.pow((eventTouch[0].clientY - eventTouch[1].clientY), 2));
                    if (ejViewerInstance._prevDiff > -1) {
                        if (currentDiff > ejViewerInstance._prevDiff) {
                            ejViewerInstance._pinchOut(event);
                        } else if (currentDiff < ejViewerInstance._prevDiff) {
                            ejViewerInstance._pinchIn(event);
                        }
                    } else if (ejViewerInstance._zoomVal < 2) {
                        if (ejViewerInstance._prevDiff != -1) {
                            if (currentDiff > ejViewerInstance._prevDiff) {
                                ejViewerInstance._pinchIn(event);
                            }
                        }
                    } else if (ejViewerInstance._prevDiff == -1) {
                        if (ejViewerInstance._zoomVal > 2) {
                            if (currentDiff > ejViewerInstance._prevDiff) {
                                ejViewerInstance._pinchIn(event);
                            }
                        }
                    }
                    ejViewerInstance._prevDiff = currentDiff;
                }
            }
        },

        _touchEnd: function (event) {
            var ejViewer = $(event.target).parents('.e-pdfviewer.e-js');
            var ejViewerInstance = ejViewer.ejPdfViewer("instance");
            ejViewerInstance._prevDiff = -1;
            if (ejViewerInstance._isRenderedByPinch) {
                if (ejViewerInstance._renderedCanvasList.length != 0) {
                    if (!ejViewerInstance._isRerenderCanvasCreated) {
                        ejViewerInstance._designNewCanvas();
                        var renderList = [];
                        var currentPage = ejViewerInstance._currentPage;
                        renderList.push(parseInt(ejViewerInstance._currentPage));
                        var prevPage = parseInt(ejViewerInstance._currentPage) - 1;
                        if (ejViewerInstance._renderedCanvasList.indexOf(prevPage) != -1)
                            renderList.push(prevPage);
                        var nextPage = parseInt(ejViewerInstance._currentPage) + 1;
                        if (ejViewerInstance._renderedCanvasList.indexOf(nextPage) != -1)
                            renderList.push(nextPage);
                        ejViewerInstance._rerenderCanvasList = renderList;
                        var proxy = ejViewerInstance;
                        window.clearInterval(proxy._scrollTimer);
                        proxy._bgRenderTimer = setInterval(function () { proxy._rerenderCanvas(currentPage) }, 10);
                        ejViewerInstance._renderedCanvasList.length = 0;
                    }
                }
                ejViewerInstance._isRenderedByPinch = false;
            }
        },

        _pointerdown: function (event) {
            if (event.originalEvent.pointerType == 'touch') {
                this._pointerCount = this._pointerCount + 1;
                if (this._pointerCount <= 2) {
                    event.preventDefault();
                    this._pointers.push(event.originalEvent);
                    if (this._pointerCount == 2)
                        this._pointerCount = 0;
                }
            }
        },

        _pointermove: function (event) {
            if (event.originalEvent.pointerType == 'touch') {
                if (this._pointers.length == 2) {
                    event.preventDefault();
                    for (var i = 0; i < this._pointers.length; i++) {
                        if (event.originalEvent.pointerId == this._pointers[i].pointerId) {
                            this._pointers[i] = event.originalEvent;
                            break;
                        }
                    }
                    if (!this._isRerenderCanvasCreated) {
                        var currentDiff = Math.sqrt(Math.pow((this._pointers[0].clientX - this._pointers[1].clientX), 2) + Math.pow((this._pointers[0].clientY - this._pointers[1].clientY), 2));
                        if (this._prevDiff > -1) {
                            if (currentDiff > this._prevDiff) {
                                this._pinchOut(event);
                            } else if (currentDiff < this._prevDiff) {
                                this._pinchIn(event);
                            }
                        }
                        var vscrolBar = document.getElementById(this._id + '_viewerContainer');
                        var scroltop = vscrolBar.scrollTop;
                        if (!(scroltop == 0)) {
                            if (currentDiff > this._prevDiff) {
                                this._pinchOut(event);
                            } else if (currentDiff < this._prevDiff) {
                                this._pinchIn(event);
                            }
                        }
                        this._prevDiff = currentDiff;
                    }
                }
            }
        },

        _pointerup: function (event) {
            if (event.originalEvent.pointerType == 'touch') {
                this._pointers = new Array();
                this._pointerCount = 0;
                this._prevDiff = -1;
                if (this._isRenderedByPinch) {
                    event.preventDefault();
                    if (this._renderedCanvasList.length != 0) {
                        if (!this._isRerenderCanvasCreated) {
                            this._designNewCanvas();
                            var renderList = [];
                            var currentPage = this._currentPage;
                            renderList.push(parseInt(this._currentPage));
                            var prevPage = parseInt(this._currentPage) - 1;
                            if (this._renderedCanvasList.indexOf(prevPage) != -1)
                                renderList.push(prevPage);
                            var nextPage = parseInt(this._currentPage) + 1;
                            if (this._renderedCanvasList.indexOf(nextPage) != -1)
                                renderList.push(nextPage);
                            this._rerenderCanvasList = renderList;
                            var proxy = this;
                            window.clearInterval(proxy._scrollTimer);
                            proxy._bgRenderTimer = setInterval(function () { proxy._rerenderCanvas(currentPage) }, 10);
                            this._renderedCanvasList.length = 0;
                        }
                    }
                    this._isRenderedByPinch = false;
                }
            }
        },

        _pinchOut: function (event) {
            this._isAutoSelected = false;
            this._isAutoZoom = false;
            this._zoomVal = this._zoomVal + 0.05;
            if (this._zoomVal > 2) {
                this._zoomVal = this._zoomVal + 0.05;
            }
            if (this._zoomVal > 4) {
                this._zoomVal = 4;
                this._isPinchLimitReached = true;
            }
            if (this._zoomVal <= 4) {
                if (!this._isPinchLimitReached) {
                    this._changingImageCanvasPosition(this._currentPage);
                    this._fitType = null;
                    this._fitToAutoSize();
                    this._calculateZoomLevel(this._zoomVal);
                    $('#' + this._id + '_toolbar_zoomSelection_hidden').val(Math.round((this._zoomVal * 100)) + "%");
                    this._ejDropDownInstance.model.value = (this._zoomVal * 100) + "%";
                    this._ejDropDownInstance.model.selectedIndices[0] = "";
                    $('#' + this._id + '_toolbar_zoomSelection_popup li').removeClass('e-active');
                    this._updateZoomButtons();
                    $('#' + this._id + '_pageviewContainer').find('.e-waitingpopup').css("visibility", "");
                    this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_fitPage');
                    this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_fitWidth');
                    this._isRenderedByPinch = true;
                }
                this._isPinchLimitReached = false;
            } else {
                this._zoomVal = 4;
            }
        },

        _pinchIn: function (event) {
            this._isAutoSelected = false;
            this._isAutoZoom = false;
            this._zoomVal = this._zoomVal - 0.04;
            if (this._zoomVal < 4 && this._zoomVal > 2) {
                this._zoomVal = this._zoomVal - 0.04;
            }
            if (this._zoomVal < 0.5) {
                this._zoomVal = 0.5;
                this._isPinchLimitReached = true;
            }
            if (this._zoomVal >= 0.5) {
                if (!this._isPinchLimitReached) {
                    this._changingImageCanvasPosition(this._currentPage);
                    this._fitType = null;
                    this._fitToAutoSize();
                    this._calculateZoomLevel(this._zoomVal);
                    $('#' + this._id + '_toolbar_zoomSelection_hidden').val(Math.round((this._zoomVal * 100)) + "%");
                    this._ejDropDownInstance.model.value = (this._zoomVal * 100) + "%";
                    this._ejDropDownInstance.model.selectedIndices[0] = "";
                    $('#' + this._id + '_toolbar_zoomSelection_popup li').removeClass('e-active');
                    this._updateZoomButtons();
                    $('#' + this._id + '_pageviewContainer').find('.e-waitingpopup').css("visibility", "");
                    this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_fitPage');
                    this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_fitWidth');
                    this._isRenderedByPinch = true;
                }
                this._isPinchLimitReached = false;
            } else {
                this._zoomVal = 0.5;
            }
        },

        //------------------------------- Pinch Zoom [End] ----------------------------------//
        //-------------------------------Text Select and Search [start] ---------------------------//

        _textSearch: function () {
            this._clearAllOccurrences();
            this._selectedIndex = 0;
            this._isTextSearch = true;
            this._searchedPages = new Array();
            this._searchCollection = new Array();
            if (!this._isToolbarHidden && $('#' + this._id + '_pdfviewer_searchbox').css('display') == 'block') {
                var searchText = $('#' + this._id + '_pdfviewer_searchinput').val();
            }
            else
                var searchText = this._searchText;
            this._searchText = searchText;
            if (this._searchText && this._searchText != "") {
                this._enableSearchIcons();
            }
            else {
                this._disableSearchIcons();
            }
            if (searchText == '' || searchText == ' ' || !searchText) {
                $('#' + this._id + '_pdfviewer_searchinput').removeClass('e-pdfviewer-progressloader');
                return true;
            }
            this._searchPageIndex = parseInt(this._currentPage);
            this._initSearch(this._searchPageIndex);
            this._highlightOtherOccurrences();
        },
        _disableSearchIcons: function () {
            $('#' + this._id + '_pdfviewer_previous_search').css({ "pointer-events": "none", "opacity": "0.6" });
            $('#' + this._id + '_pdfviewer_next_search').css({ "pointer-events": "none", "opacity": "0.6" });
            var checkBox = $('#' + this._id + '_search_matchcase').data('ejCheckBox');
            checkBox.disable();
        },
        _enableSearchIcons: function () {
            $('#' + this._id + '_pdfviewer_previous_search').css({ "pointer-events": "", "opacity": "" });
            $('#' + this._id + '_pdfviewer_next_search').css({ "pointer-events": "", "opacity": "" });
            var checkBox = $('#' + this._id + '_search_matchcase').data('ejCheckBox');
            checkBox.enable();
        },
        _prevSearch: function () {
            if (this._searchText) {
                this._clearAllOccurrences();
                this._isPrevSearch = true;
                this._isTextSearch = true;
                this._selectedIndex = this._selectedIndex - 1;
                if (this._selectedIndex < 0) {
                    this._searchPageIndex = this._searchPageIndex - 1;
                    if (this._searchPageIndex < 1) {
                        this._searchPageIndex = parseInt(this._totalPages);
                    }
                    this._initSearch(this._searchPageIndex);
                } else {
                    this._highlightText(this._searchPageIndex, this._selectedIndex);
                }
                this._highlightOtherOccurrences();
            }
        },

        _nextSearch: function () {
            if (this._searchText) {
                this._clearAllOccurrences();
                this._isPrevSearch = false;
                this._isTextSearch = true;
                this._selectedIndex = this._selectedIndex + 1;
                if (this._searchCollection[this._searchPageIndex]) {
                    if (this._selectedIndex >= this._searchCollection[this._searchPageIndex].length) {
                        this._selectedIndex = 0;
                        if (this._searchPageIndex < this._totalPages) {
                            this._searchPageIndex = this._searchPageIndex + 1;
                        } else {
                            this._searchPageIndex = 1;
                        }
                        this._initSearch(this._searchPageIndex);
                    } else {
                        this._highlightText(this._searchPageIndex, this._selectedIndex);
                    }
                } else {
                    this._searchPageIndex = this._currentPage;
                    this._selectedIndex = 0;
                    this._initSearch(this._searchPageIndex);
                }
                this._highlightOtherOccurrences();
            }
        },

        _matchcase: function () {
            var checkBox = $('#' + this._id + '_search_matchcase').data('ejCheckBox');
            if (checkBox.model.checkState == "check") {
                this._isMatchCase = true;
            } else {
                this._isMatchCase = false;
            }
            this._textSearch();
        },

        _searchKeypressHandler: function (event) {
            if (event.which == 13) {
                event.preventDefault();
                this._searchText = $('#' + this._id + '_pdfviewer_searchinput').val();
                if (this._searchMatches[this._searchPageIndex] && this._searchText != "") {
                    if (this._searchMatches[this._searchPageIndex].length == 0) {
                        this._initSearch(this._searchPageIndex);
                    } else {
                        this._nextSearch();
                    }
                } else if (this._searchText != "") {
                    this._searchPageIndex = this._currentPage;
                    this._selectedIndex = 0;
                    this._initSearch(this._searchPageIndex);
                }
            }
        },

        _initSearch: function (pageIndex) {
            var queryLength = this._searchText.length;
            var searchText = this._searchText;
            if (searchText != '' || searchText != ' ' || !searchText)
                this._getPossibleMatches(pageIndex, searchText, queryLength);
        },

        _getPossibleMatches: function (pageIndex, searchText, queryLength) {
            if (!this._pageText[parseInt(pageIndex)] && pageIndex == this._searchPageIndex) {
                this._isRequestFired = true;
                var jsonResult = new Object();
                jsonResult["viewerAction"] = this._viewerAction.getPageModel;
                jsonResult["pageindex"] = pageIndex.toString();
                jsonResult["id"] = this._fileId;
                $('#' + this._id + '_pdfviewer_searchinput').addClass('e-pdfviewer-progressloader');
                if (!this._ajaxInProgress)
                    this._doAjaxPostSearch(JSON.stringify(jsonResult), pageIndex);
            }
            this._searchPageText(pageIndex, searchText, queryLength);
        },
        _searchPageText: function (pageIndex, searchText, queryLength) {
            var pageText = this._pageText[pageIndex];
            if (pageText) {
                if (!this._isMatchCase) {
                    pageText = pageText.toLowerCase();
                    searchText = searchText.toLowerCase();
                }
                var matches = [];
                var matchIndex = -queryLength;
                var texts = /[^\u0000-\u00ff]/.test(pageText);
                var x = new RegExp("[\x00-\x80]+"); // is ascii
                var isAscii = x.test(pageText);
                var isRtl = this._isRtl(pageText);
                if (!isAscii && isRtl) {
                    var re = new RegExp(String.fromCharCode(160), "g");
                    pageText = pageText.replace(re, " ");
                    searchText = searchText.split("").reverse().join("");
                    searchText = searchText.replace(/\s/g, '\u00A0');
                }
                if (this._isNonBreackingCharacter && texts) {
                    var re = new RegExp(String.fromCharCode(160), "g");
                    pageText = pageText.replace(re, " ");
                }
                while (true) {
                    if (searchText == '' || searchText == ' ' || !searchText) {
                        break;
                    }
                    matchIndex = pageText.indexOf(searchText, matchIndex + queryLength);
                    if (matchIndex == -1)
                        break;
                    matches.push(matchIndex);
                }
                this._searchMatches[pageIndex] = matches;
                if (pageIndex == this._searchPageIndex) {
                    if (this._selectedIndex < 0 && this._isPrevSearch) {
                        this._selectedIndex = this._searchMatches[pageIndex].length - 1;
                    }
                    if (this._isRequestFired && this._searchMatches[pageIndex].length != 0 || this._renderedCanvasList.indexOf(pageIndex) == -1 && this._searchMatches[pageIndex].length != 0) {
                        this._gotoPageNo(pageIndex);
                        this._isPageScrolledForSearch = true;
                    }
                    if (this._searchMatches[pageIndex].length == 0) {
                        if (pageIndex != this._totalPages) {
                            if (this._searchedPages.indexOf(parseInt(pageIndex)) == -1) {
                                this._searchedPages.push(pageIndex);
                            }
                            if (this._isPrevSearch) {
                                this._searchPageIndex = this._searchPageIndex - 1;
                                if (this._searchPageIndex <= 0)
                                    this._searchPageIndex = this._totalPages;
                            } else {
                                this._searchPageIndex = this._searchPageIndex + 1;
                            }
                        }
                        else {
                            if (this._searchedPages.indexOf(parseInt(pageIndex)) == -1) {
                                this._searchedPages.push(pageIndex);
                            }
                            if (this._isPrevSearch) {
                                this._searchPageIndex = this._searchPageIndex - 1;
                            } else {
                                this._searchPageIndex = 1;
                            }
                        }
                        if (this._searchedPages.length != this._totalPages || this._searchMatches[pageIndex].length != 0) {
                            this._initSearch(this._searchPageIndex);
                        } else {
                            if (searchText != "") {
                                $('#' + this._id + '_pdfviewer_searchinput').addClass('e-pdfviewer-nooccurrence');
                            }
                            $('#' + this._id + '_pdfviewer_searchinput').removeClass('e-pdfviewer-progressloader');
                            this._isRequestFired = false;
                        }
                    } else {
                        if (this._isRequestFired) {
                            $('#' + this._id + '_pdfviewer_searchinput').removeClass('e-pdfviewer-progressloader');
                            var proxy = this;
                            setTimeout(function () {
                                proxy._convertMatches(pageIndex, queryLength);
                                proxy._isRequestFired = false;
                                proxy._isPageScrolledForSearch = false;
                            }, 100);
                        } else {
                            this._convertMatches(pageIndex, queryLength);
                        }
                    }
                } else {
                    if (this._searchMatches[pageIndex].length != 0) {
                        this._convertMatches(pageIndex, queryLength);
                    }
                }
                if (!this._isRequestFired && !this._isPageScrollHighlight) {
                    this._isPageScrolledForSearch = false;
                }
            }
        },
        _convertMatches: function (index, queryLength) {
            var m = 0;
            var matches = this._searchMatches[index];
            var textDiv = this._textDivs[index];
            var divIndex = 0;
            var end = textDiv.length - 1;
            var matchCollection = [];
            for (var i = 0, l = matches.length; i < l; i++) {
                var matchIndex = matches[i];
                if (!this._isPageScrolledForSearch) {
                    while (m != end && matchIndex >= (divIndex + textDiv[m].textContent.length)) {
                        divIndex += textDiv[m].textContent.length;
                        m++;
                    }
                } else {
                    while (m != end && matchIndex >= (divIndex + textDiv[m].textContent.split('\n')[0].length)) {
                        divIndex += textDiv[m].textContent.split('\n')[0].length;
                        m++;
                    }
                }
                var match = {
                    begin: {
                        divId: m,
                        offsetValue: matchIndex - divIndex,
                    }
                };
                matchIndex += queryLength;
                while (m != end && matchIndex > (divIndex + textDiv[m].textContent.length)) {
                    divIndex += textDiv[m].textContent.length;
                    m++;
                }
                match.end = {
                    divId: m,
                    offsetValue: matchIndex - divIndex,
                };
                matchCollection.push(match);
            }
            this._searchCollection[index] = matchCollection;
            this._highlightText(index, this._selectedIndex);
        },

        _highlightText: function (pageIndex, index) {
            var matches = this._searchCollection[pageIndex];
            var textDiv = this._textDivs[pageIndex];
            var prevEnd = null;
            var scrollPoint = { y: -70, x: -400 }
            var startId, className;
            var index0 = 0, index1 = matches.length;
            for (var i = index0; i < index1; i++) {
                var match = matches[i];
                var start = match.begin;
                var end = match.end;
                if (i == this._selectedIndex && pageIndex == this._searchPageIndex) {
                    className = 'e-pdfviewer-texthighlight';
                    startId = start.divId;
                } else {
                    className = 'e-pdfviewer-text-highlightother'
                }
                if (!prevEnd || start.divId !== prevEnd.divId) {
                    if (prevEnd !== null) {
                        this._addSpanForSearch(prevEnd.divId, prevEnd.offsetValue, undefined, pageIndex, textDiv, null);
                    }
                    this._beginText(start, textDiv, pageIndex, null);
                } else {
                    this._addSpanForSearch(prevEnd.divId, prevEnd.offsetValue, start.offsetValue, pageIndex, textDiv, null);
                }
                if (start.divId == end.divId) {
                    this._addSpanForSearch(start.divId, start.offsetValue, end.offsetValue, pageIndex, textDiv, className);
                } else {
                    this._addSpanForSearch(start.divId, start.offsetValue, undefined, pageIndex, textDiv, className);
                    for (var k = start.divId + 1, j = end.divId; k < j; k++) {
                        this._addSpanForSearch(k, 0, undefined, pageIndex, textDiv, className + ' middle');
                    }
                    this._beginText(end, textDiv, pageIndex, className);
                }
                prevEnd = end;
            }
            if (prevEnd) {
                this._addSpanForSearch(prevEnd.divId, prevEnd.offsetValue, undefined, pageIndex, textDiv, null);
            }
            if (pageIndex == this._searchPageIndex)
                this._scrollToSearchStr(textDiv[startId], scrollPoint);
            this._isTextHighlighted = true;
        },

        _beginText: function (span, textDiv, pageIndex, className) {
            var divIndex = span.divId;
            textDiv[divIndex].textContent = '';
            this._addSpanForSearch(divIndex, 0, span.offsetValue, pageIndex, textDiv, className);
        },

        _addSpanForSearch: function (divIndex, fromOffset, toOffset, pageIndex, textDiv, className) {
            var divTextContent;
            var re = new RegExp(String.fromCharCode(160), "g");
            var textContent = this._textContents[pageIndex];
            var totalLength = textContent[divIndex].length;
            var x = new RegExp("[\x00-\x80]+"); // is ascii
            var isRtl = this._isRtl(textContent[divIndex]);
            if (isRtl) {
                divTextContent = textContent[divIndex].substring(totalLength - fromOffset, totalLength - toOffset);
                var node = document.createTextNode(divTextContent);
                if (className) {
                    this._isTextHighlighted = true;
                    var spanElement = document.createElement('span');
                    spanElement.className = className + ' e-pdfviewer-textLayer';
                    if ($(spanElement).hasClass('middle')) {
                        textDiv[divIndex].textContent = '';
                    }
                    node.textContent = node.textContent.replace(re, " ");
                    $(spanElement).prepend(node);
                    $(textDiv[divIndex]).prepend(spanElement);
                    textDiv[divIndex].innerHTML.replace(/&nbsp;/g, ' ');
                    return;
                }
                node.textContent = node.textContent.replace(re, " ");
                $(textDiv[divIndex]).prepend(node);
                textDiv[divIndex].innerHTML = textDiv[divIndex].innerHTML.replace(re, " ");
            }
            else {
                divTextContent = textContent[divIndex].substring(fromOffset, toOffset);
                var node = document.createTextNode(divTextContent);
                if (className) {
                    this._isTextHighlighted = true;
                    var spanElement = document.createElement('span');
                    spanElement.className = className + ' e-pdfviewer-textLayer';
                    if ($(spanElement).hasClass('middle')) {
                        textDiv[divIndex].textContent = '';
                    }
                    node.textContent = node.textContent.replace(re, " ");
                    spanElement.appendChild(node);
                    spanElement.innerHTML = spanElement.innerHTML.replace(re, " ");
                    textDiv[divIndex].appendChild(spanElement);
                    textDiv[divIndex].innerHTML = textDiv[divIndex].innerHTML.replace(re, " ");
                    return;
                }
                node.textContent = node.textContent.replace(re, " ");
                textDiv[divIndex].appendChild(node);
                textDiv[divIndex].innerHTML = textDiv[divIndex].innerHTML.replace(re, " ");
            }
        },
        _isRtl: function (text) {
            var ltrChars = 'A-Za-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02B8\\u0300-\\u0590\\u0800-\\u1FFF' + '\\u2C00-\\uFB1C\\uFDFE-\\uFE6F\\uFEFD-\\uFFFF',
                rtlChars = '\\u0591-\\u07FF\\uFB1D-\\uFDFD\\uFE70-\\uFEFC',
                rtlDirCheck = new RegExp('^[^' + ltrChars + ']*[' + rtlChars + ']');
            return rtlDirCheck.test(text);
        },
        _scrollToSearchStr: function (textDiv, scrollPoint) {
            var parent = textDiv.offsetParent;
            var offsetY = textDiv.offsetTop + textDiv.clientTop;
            var offsetX = textDiv.offsetLeft + textDiv.clientLeft;
            while (parent.id != this._id + '_viewerContainer') {
                offsetY += parent.offsetTop;
                offsetX += parent.offsetLeft;
                parent = parent.offsetParent;
            }
            if (scrollPoint) {
                offsetY += scrollPoint.y;
                offsetX += scrollPoint.x;
                if (this._zoomVal > 1.5) {
                    parent.scrollLeft = offsetX;
                }
            }
            parent.scrollTop = offsetY;
        },

        _highlightOtherOccurrences: function () {
            for (var i = 1; i <= this._totalPages; i++) {
                if (this._renderedCanvasList.indexOf(i) != -1 && i != this._searchPageIndex)
                    this._initSearch(i);
            }
            this._isPageScrollHighlight = false;
        },

        _clearAllOccurrences: function () {
            this._searchedText = "";
            var customMenu = document.getElementById(this._id + "custom-menu");
            $(customMenu).hide();
            this._isTextHighlighted = false;
            this._isTextSearch = false;
            if (this._searchAjaxRequestState != null) {
                this._searchAjaxRequestState.abort();
                this._searchAjaxRequestState = null;
            }
            if (this._ajaxRequestState != null) {
                this._ajaxRequestState.abort();
                this._ajaxRequestState = null;
            }
            $('#' + this._id + '_pdfviewer_searchinput').removeClass('e-pdfviewer-nooccurrence');
            for (var i = 1; i <= this._totalPages; i++) {
                if (this._renderedCanvasList.indexOf(parseInt(i)) !== -1) {
                    var textDiv = this._textDivs[i];
                    var textContent = this._textContents[i];
                    if (!textDiv || textDiv == undefined) {
                        break;
                    }
                    for (var j = 0; j < textDiv.length; j++) {
                        textDiv[j].textContent = textContent[j];
                        if (!this._isFindboxPresent) {
                            textDiv[j].textContent = '';
                            textDiv[j].textContent = textContent[j] + '\r\n';
                        }
                    }
                }
            }
        },

        _doAjaxPostSearch: function (jsonResult, pageIndex) {
            var proxy = this;
            this._searchAjaxRequestState = $.ajax({
                type: 'POST',
                url: this.model.serviceUrl + '/' + this.model.serverActionSettings.load,
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: jsonResult,
                traditional: true,
                success: function (data) {
                    if (typeof data === 'object')
                        var backupjson = (JSON.stringify(data));
                    else
                        var backupjson = data;
                    if (typeof data === 'object') {
                        if (proxy._pdfService == ej.PdfViewer.PdfService.Local)
                            jsondata = JSON.parse((JSON.stringify(data)));
                        else
                            jsondata = JSON.parse((JSON.stringify(data))["d"]);
                    }
                    else {
                        if (proxy._pdfService == ej.PdfViewer.PdfService.Local)
                            jsondata = JSON.parse(data);
                        else
                            jsondata = JSON.parse(data["d"]);
                    }
                    proxy._pageContents[parseInt(jsondata["currentpage"])] = backupjson;
                    proxy._pageText[parseInt(jsondata["currentpage"])] = jsondata["pageContents"];
                    proxy._initSearch(pageIndex);
                },
                error: function (msg, textStatus, errorThrown) {
                    proxy._raiseClientEvent("ajaxRequestFailure", msg.responseText);
                }
            });
        },

        _keyboardShortcutFind: function (event) {
            if (event.ctrlKey && event.which == 70) {
                event.preventDefault();
                if (!this._isTextSearchHidden) {
                    this._displaySearchBox();
                }
            }
        },

        _setSearchToolbarTop: function () {
            var searchToolbar = document.getElementById(this._id + '_pdfviewer_searchbox');
            if (searchToolbar)
                searchToolbar.style.top = '0px';
        },
        _searchBoxLocalization: function () {
            var findText = $('#' + this._id + '_pdfviewer_searchbox').find('.e-pdfviewer-label')[0];
            var matchCase = $('#' + this._id + '_pdfviewer_searchbox').find('.e-pdfviewer-label')[1];
            var localeObj = ej.PdfViewer.Locale[this.model.locale] ? ej.PdfViewer.Locale[this.model.locale] : ej.PdfViewer.Locale["default"];
            var copyText = localeObj['contextMenu']['Find']['contentText'];
            var googleText = localeObj['contextMenu']['matchCase']['contentText'];
            $(findText).text(copyText);
            $(matchCase).text(googleText);
        },
        _displaySearchBox: function () {
            if (!this._isToolbarHidden) {
                if ($('#' + this._id + '_pdfviewer_searchbox').css('display') == 'none') {
                    this._searchBoxLocalization();
                    this._clearSelector();
                    this._displaySearch = true;
                    $('#' + this._id + '_pdfviewer_searchbox').css({ 'position': 'absolute', 'display': 'block' });
                    this._resizeSearchToolbar();
                    $('#' + this._id + '_pdfviewer_searchinput').focus().select();
                    this._isFindboxPresent = true;
                } else {
                    this._displaySearch = false;
                    this._isFindboxPresent = false;
                    this._clearAllOccurrences();
                    $('#' + this._id + '_pdfviewer_searchinput').removeClass('e-pdfviewer-progressloader');
                    $('#' + this._id + '_pdfviewer_searchbox').css({ 'display': 'none' });
                }
            }
        },

        _showTextSearchButton: function (show) {
            if (show) {
                $('#' + this._id + '_find').parent().parents(".e-pdfviewer-toolbarul").css("display", "block");
                this._isTextSearchHidden = false;
            }
            else {
                $('#' + this._id + '_find').parent().parents(".e-pdfviewer-toolbarul").css("display", "none");
                if (this._isFindboxPresent) {
                    this._displaySearchBox();
                }
                this._isTextSearchHidden = true;
            }
        },

        //-------------------------------Text Select and Search [end] -----------------------------//
        //-------------------------------Text Markup Annotation [Start] ---------------------------//

        _renderTextMarkupAnnotation: function (textMarkupAnnotation, pageIndex) {
            var canvas = document.getElementById(this._id + '_secondarycanvas_' + pageIndex);
            var context;
            if (canvas != undefined && canvas != null) {
                context = canvas.getContext("2d");
                context.setLineDash([]);
                canvas.height = this._pageSize[pageIndex - 1].PageHeight * this._zoomVal;
                canvas.width = this._pageSize[pageIndex - 1].PageWidth * this._zoomVal;
                if (textMarkupAnnotation) {
                    for (var i = 0; i < textMarkupAnnotation.length; i++) {
                        var annotation = textMarkupAnnotation[i];
                        if (annotation.TextMarkupAnnotationType == "StrikeOut") {
                            var color = annotation.Color;
                            annotation.isLocked = this.model.strikethroughSettings.isLocked;
                            for (var j = 0; j < annotation.Bounds.length; j++) {
                                var bound = annotation.Bounds[j];
                                context.globalAlpha = annotation.Opacity;
                                context.beginPath();
                                context.moveTo(this._convertPointToPixel(bound.X) * this._zoomVal, this._convertPointToPixel(bound.Y + (bound.Height) / 2) * this._zoomVal);
                                context.lineTo(this._convertPointToPixel(bound.Width + bound.X) * this._zoomVal, this._convertPointToPixel(bound.Y + (bound.Height) / 2) * this._zoomVal);
                                context.strokeStyle = "rgb(" + color.R + "," + color.G + "," + color.B + ")";
                                context.closePath();
                                context.msFillRule = "nonzero"
                                context.stroke();
                            }
                            context.lineWidth = annotation.BorderWidth;
                            context.save();
                        }
                        else if (annotation.TextMarkupAnnotationType == "Highlight") {
                            annotation.isLocked = this.model.highlightSettings.isLocked;
                            for (var j = 0; j < annotation.Bounds.length; j++) {
                                var bound = annotation.Bounds[j];
                                context.beginPath();
                                context.rect(this._convertPointToPixel(bound.X) * this._zoomVal, this._convertPointToPixel(bound.Y) * this._zoomVal, this._convertPointToPixel(bound.Width) * this._zoomVal, this._convertPointToPixel(bound.Height) * this._zoomVal);
                                context.lineWidth = annotation.BorderWidth;
                                var color = annotation.Color;
                                context.globalAlpha = annotation.Opacity * 0.5;
                                context.closePath();
                                context.fillStyle = "rgb(" + color.R + "," + color.G + "," + color.B + ")";
                                context.msFillRule = "nonzero";
                                context.fill();
                            }
                            context.save();
                        }
                        else if (annotation.TextMarkupAnnotationType == "Underline") {
                            annotation.isLocked = this.model.underlineSettings.isLocked;
                            var color = annotation.Color;
                            for (var j = 0; j < annotation.Bounds.length; j++) {
                                var bound = annotation.Bounds[j];
                                context.globalAlpha = annotation.Opacity;
                                context.beginPath();
                                context.moveTo(this._convertPointToPixel(bound.X) * this._zoomVal, this._convertPointToPixel(bound.Y + (bound.Height)) * this._zoomVal);
                                context.lineTo(this._convertPointToPixel(bound.Width + bound.X) * this._zoomVal, this._convertPointToPixel(bound.Y + (bound.Height)) * this._zoomVal);
                                context.lineWidth = annotation.BorderWidth;
                                context.closePath();
                                context.strokeStyle = "rgb(" + color.R + "," + color.G + "," + color.B + ")";
                                context.msFillRule = "nonzero"
                                context.stroke();;
                            }
                            context.save();
                        }
                    }
                }
                if (this._newAnnotationList[pageIndex - 1]) {
                    if (this._newAnnotationList[pageIndex - 1].length != 0) {
                        this._renderNewAnnotations(this._newAnnotationList[pageIndex - 1], context)
                    }
                }
            }
        },

        _renderNewAnnotations: function (annotations, context) {
            for (var i = 0; i < annotations.length; i++) {
                var markupAnnotation = annotations[i];
                if (markupAnnotation.type == "StrikeOut") {
                    context.globalAlpha = markupAnnotation.opacity;
                    for (var j = 0; j < markupAnnotation.bounds.length; j++) {
                        var bound = markupAnnotation.bounds[j];
                        context.beginPath();
                        context.moveTo(bound.xPosition * this._zoomVal, (bound.yPosition + (bound.height / 2)) * this._zoomVal);
                        context.lineTo((bound.xPosition + bound.width) * this._zoomVal, (bound.yPosition + (bound.height) / 2) * this._zoomVal);
                        context.strokeStyle = "rgb(" + markupAnnotation.colorR + "," + markupAnnotation.colorG + "," + markupAnnotation.colorB + ")";
                        context.closePath();
                        context.msFillRule = "nonzero"
                        context.stroke();
                    }
                    context.save();
                }
                else if (markupAnnotation.type == "Highlight") {
                    context.globalAlpha = markupAnnotation.opacity * 0.5;
                    for (var j = 0; j < markupAnnotation.bounds.length; j++) {
                        var bound = markupAnnotation.bounds[j];
                        context.beginPath();
                        context.rect(bound.xPosition * this._zoomVal, bound.yPosition * this._zoomVal, bound.width * this._zoomVal, bound.height * this._zoomVal);
                        context.closePath();
                        context.fillStyle = "rgb(" + markupAnnotation.colorR + "," + markupAnnotation.colorG + "," + markupAnnotation.colorB + ")";
                        context.msFillRule = "nonzero";
                        context.fill();
                    }
                    context.save();
                }
                else if (markupAnnotation.type == "Underline") {
                    context.globalAlpha = markupAnnotation.opacity;
                    for (var j = 0; j < markupAnnotation.bounds.length; j++) {
                        var bound = markupAnnotation.bounds[j];
                        context.beginPath();
                        context.moveTo(bound.xPosition * this._zoomVal, (bound.yPosition + bound.height) * this._zoomVal);
                        context.lineTo((bound.xPosition + bound.width) * this._zoomVal, (bound.yPosition + bound.height) * this._zoomVal);
                        context.strokeStyle = "rgb(" + markupAnnotation.colorR + "," + markupAnnotation.colorG + "," + markupAnnotation.colorB + ")";
                        context.closePath();
                        context.msFillRule = "nonzero"
                        context.stroke();
                    }
                    context.save();
                }
            }
        },

        _addAnnotation: function (annotationType) {
            var annotationLayer = document.getElementById(this._id + "_secondarycanvas_" + this._currentPage);
            var context = annotationLayer.getContext("2d");
            annotationLayer.style.zIndex = "2";
            var s = window.getSelection().toString();
            switch (annotationType) {
                case "StrikeOut":
                    if (window.getSelection().toString()) {
                        this._drawStrikeOutAnnotation();
                        this._isHighlight = false;
                        this._annotationActive = true;
                    } else {
                        this._annotationActive = true;
                        this._isHighlight = false;
                        this._isStrikeout = true;
                        this._isUnderline = false;
                    }
                    break;
                case "Underline":
                    if (window.getSelection().toString()) {
                        this._drawUnderlineAnnotation();
                        this._annotationActive = true;
                        this._isHighlight = false;
                    } else {
                        this._annotationActive = true;
                        this._isHighlight = false;
                        this._isUnderline = true;
                        this._isStrikeout = false;
                    }
                    break;
                case "Highlight":
                    if (window.getSelection().toString()) {
                        this._drawHighlightAnnotation();
                        this._annotationActive = true;
                        this._isHighlight = true;
                    } else {
                        this._annotationActive = true;
                        this._isHighlight = true;
                        this._isUnderline = false;
                        this._isStrikeout = false;
                    }
                    break;
                default:
                    break;
            }
        },

        _initHighlight: function () {
            if (!this._isHighlightEnabled) {
                this._toolbar.selectItemByID(this._id + '_pdfviewer_toolbar_highlight');
                this._toolbar.deselectItemByID(this._id + '_pdfviewer_toolbar_underline');
                this._toolbar.deselectItemByID(this._id + '_pdfviewer_toolbar_strikeout');
                this._addAnnotation("Highlight");
                this._isHighlightEnabled = true;
                this._isUnderlineEnabled = false;
                this._isStrikeOutEnabled = false;
                this._isHighlight = true;
            } else {
                if (!this._isToolbarColorPicker) {
                    this._toolbar.deselectItemByID(this._id + '_pdfviewer_toolbar_highlight');
                    this._isHighlightEnabled = false;
                    this._annotationActive = false;
                    this._isHighlight = false;
                    this._isUnderline = false;
                    this._isStrikeout = false;
                    this._isUnderlineEnabled = false;
                    this._isStrikeOutEnabled = false;
                    this._drawColor = null;
                    this._isDefaultColorSet = false;
                }
                document.getElementById(this._id + '_pdfviewer_colorpicker').style.display = 'none';
                this._isToolbarColorPicker = false;
            }
        },

        _initStrikeOut: function () {
            if (!this._isStrikeOutEnabled) {
                this._toolbar.selectItemByID(this._id + '_pdfviewer_toolbar_strikeout');
                this._toolbar.deselectItemByID(this._id + '_pdfviewer_toolbar_underline');
                this._toolbar.deselectItemByID(this._id + '_pdfviewer_toolbar_highlight');
                this._addAnnotation("StrikeOut");
                this._isStrikeOutEnabled = true;
                this._isUnderlineEnabled = false;
                this._isHighlightEnabled = false;
                this._isStrikeout = true;
            } else {
                if (!this._isToolbarColorPicker) {
                    this._toolbar.deselectItemByID(this._id + '_pdfviewer_toolbar_strikeout');
                    this._isHighlightEnabled = false;
                    this._annotationActive = false;
                    this._isHighlight = false;
                    this._isUnderline = false;
                    this._isStrikeout = false;
                    this._isUnderlineEnabled = false;
                    this._isStrikeOutEnabled = false;
                    this._drawColor = null;
                    this._isDefaultColorSet = false;
                }
                document.getElementById(this._id + '_pdfviewer_colorpicker').style.display = 'none';
                this._isToolbarColorPicker = false;
            }
        },

        _initUnderline: function () {
            if (!this._isUnderlineEnabled) {
                this._toolbar.selectItemByID(this._id + '_pdfviewer_toolbar_underline');
                this._toolbar.deselectItemByID(this._id + '_pdfviewer_toolbar_highlight');
                this._toolbar.deselectItemByID(this._id + '_pdfviewer_toolbar_strikeout');
                this._addAnnotation("Underline");
                this._isUnderlineEnabled = true;
                this._isHighlightEnabled = false;
                this._isStrikeOutEnabled = false;
                this._isUnderline = true;
            } else {
                if (!this._isToolbarColorPicker) {
                    this._toolbar.deselectItemByID(this._id + '_pdfviewer_toolbar_underline');
                    this._isHighlightEnabled = false;
                    this._annotationActive = false;
                    this._isHighlight = false;
                    this._isUnderline = false;
                    this._isStrikeout = false;
                    this._isUnderlineEnabled = false;
                    this._isStrikeOutEnabled = false;
                    this._drawColor = null;
                    this._isDefaultColorSet = false;
                }
                document.getElementById(this._id + '_pdfviewer_colorpicker').style.display = 'none';
                this._isToolbarColorPicker = false;
            }
        },
        _showSignatureDialog: function (e) {
            if (this.model.enableSignature) {
                var canvas = document.getElementById(this._id + "_imageTemp");
                var widths = this.element[0].parentElement.clientWidth;
                var heights = this.element[0].parentElement.clientHeight;
                if (widths >= 500) {
                    canvas.width = 470;
                    canvas.style.width = "470px";
                    if (window.innerHeight >= 500) {
                        canvas.height = 400;
                        canvas.style.height = "400px";
                    }
                    else {
                        canvas.height = 100;
                        canvas.style.height = "100px";
                    }

                }
                else {
                    canvas.width = widths;
                    canvas.height = 100;
                    canvas.style.width = widths + "px";
                    canvas.style.height = "100px";
                }
                var localeObj = ej.PdfViewer.Locale[this.model.locale] ? ej.PdfViewer.Locale[this.model.locale] : ej.PdfViewer.Locale["default"];
                var appearanceText = localeObj['signatureWindow']['Signature']['contentText'];
                var add = localeObj['signatureWindow']['Add']['contentText'];
                var clear = localeObj['signatureWindow']['clear']['contentText'];
                this._replaceTextLocale($("#" + this._id + "_addSignature")[0], add);
                this._replaceTextLocale($("#" + this._id + "_clearSignature")[0], clear);
                $('#' + this._id + "_signatureContainerDialogTab").ejDialog({ title: appearanceText });
                $("#" + this._id + "_popupmenu").hide();
                this._clearRectOnClick(this._currentPage);
                $('#' + this._id + "_signatureContainerDialogTab").ejDialog("open");
            }
        },
        _createSignatureControl: function (e) {
            this._minX = this._minY = 0;
            this._maxX = this._maxY = 0;
            var proxy = this;
            var pageviewcontainer = $('#' + this._id + '_pageviewContainer');
            var container = document.createElement("div");
            container.id = this._id + "_signatureContainerDialogTab";
            var applyProperties = document.createElement("div");
            var signatureControl = document.createElement("div");
            signatureControl.id = this._id + "_signatureContainer";
            var canvas = document.createElement('canvas');
            canvas.id = this._id + "_imageTemp";
            var parentElement = proxy.element[0].parentElement;
            if (parentElement) {
                var widths = parentElement.clientWidth;
                if (widths >= 500) {
                    canvas.width = 470;
                    canvas.height = 400;
                    canvas.style.width = "470px";
                    canvas.style.height = "400px";
                }
                else {
                    canvas.width = widths;
                    canvas.height = 100;
                    canvas.style.width = widths + "px";
                    canvas.style.height = "100px";
                }
            }
            signatureControl.appendChild(canvas);
            var context = canvas.getContext("2d");
            var ok = ej.buildTag("button", "Add", { "margin-bottom": "5px", "margin-top": "6px", "margin-right": "10px", "float": "right", "opacity": "0.2", "cursor": "default", "pointer-events": "none" }, { "id": this._id + "_addSignature", });
            var cancel = ej.buildTag("button", "Clear", { "margin-bottom": "5px", "margin-top": "6px", "margin-right": "10px", "float": "right" }, { "id": this._id + "_clearSignature", });
            applyProperties.appendChild(cancel[0]);
            applyProperties.appendChild(ok[0]);
            container.appendChild(signatureControl);
            container.appendChild(applyProperties);
            pageviewcontainer.append(container);
            ok.ejButton({ showRoundedCorner: false, size: "small" });
            cancel.ejButton({ showRoundedCorner: false, size: "small" });
            var proxy = this;
            $('#' + this._id + "_imageTemp").on("mousedown touchstart", function (e) {
                if (e.which != 3 && e.type != "contextmenu") {
                    e.preventDefault();
                    proxy._findMouse(e);
                    proxy._mouseDetection = true;
                    proxy._oldX = proxy._mouseX;
                    proxy._oldY = proxy._mouseY;
                    proxy._newObject = [];
                    proxy._newpoints = [];
                    proxy._mouseEvent(e);
                }
            });
            $('#' + this._id + "_imageTemp").on("mousemove touchmove", function (e) {
                if (proxy._mouseDetection) {
                    proxy._findMouse(e);
                    $('#' + proxy._id + "_addSignature").css({ "opacity": "", "cursor": "pointer", "pointer-events": "" });
                    proxy._mouseEvent(e);
                }
            });
            $(window).on("mouseup touchend", function (e) {
                if (proxy._mouseDetection == true) {
                    proxy._convertToString(proxy._newObject, context);
                }
                proxy._mouseDetection = false;
            });
            $('#' + this._id + "_addSignature").on("click touchend", function (e) {
                proxy._newCanvas = null;
                proxy._signatureAdded = true;
                proxy._isNewlyAdded = true;
                var pageDiv = document.getElementById(proxy._id + 'pageDiv_' + (proxy._currentPage));
                if (e.type == "touchend") {
                    e.preventDefault();
                    proxy._signatureAdded = false;
                    proxy._isNewlyAdded = false;
                    proxy._addSignature(e);
                }
                $(pageDiv).on("mousemove", function (e) {
                    if (proxy._isNewlyAdded) {
                        proxy._isNewlyAdded = false;
                        proxy._addSignature(e);
                    }
                });
                $('#' + proxy._id + "_signatureContainerDialogTab").ejDialog("close");
            });
            $('#' + this._id + "_clearSignature").on("click", function (e) {
                $('#' + proxy._id + "_addSignature").css({ "opacity": "0.2", "cursor": "default", "pointer-events": "none" });
                proxy._clearSignature(e);
            });
            $('#' + this._id + "_signatureContainerDialogTab").ejDialog({
                showOnInit: false,
                enableResize: false,
                allowDraggable: false,
                zIndex: 100000000,
                backgroundScroll: false, enableModal: true,
                open: function (e) {
                    $('#' + proxy._id + "_addSignature").css({ "opacity": "0.2", "cursor": "default", "pointer-events": "none" });
                    proxy._clearSignature(e);
                },
                close: function (e) {
                    $('#' + proxy._id + "_addSignature").css({ "opacity": "0.2", "cursor": "default", "pointer-events": "none" });
                    var canvas = document.getElementById(proxy._id + "_imageTemp");
                    var context = canvas.getContext("2d");
                    context.clearRect(0, 0, canvas.width, canvas.height);
                },
            });
            if (widths >= 500)
                $('#' + this._id + "_signatureContainerDialogTab").ejDialog({ width: "500px" });
            else
                $('#' + this._id + "_signatureContainerDialogTab").ejDialog({ width: "auto" });
            $('#' + this._id + '_signatureContainerDialogTab').addClass('e-pdfviewer-sign-dialog');
        },
        _convertToString: function (newObject, context) {
            this._addMoveTo(newObject[0], newObject[1], context);
            this._addLineTo(newObject[0], newObject[1], context);
            for (var i = 2; i < newObject.length; i = i + 2) {
                this._addLineTo(newObject[i], newObject[i + 1], context);
            }
        },
        _addLineTo: function (x, y, context) {
            this._newx = x;
            this._newy = y;
            this._outputString += "<br>" + ".lineTo(" + this._newx + "," + this._newy + ");";
        },

        _addMoveTo: function (x, y, context) {
            this._newx = x;
            this._newy = y;
            this._outputString += "<br>" + ".moveTo(" + this._newx + "," + this._newy + ");";
        },
        _findMouse: function (event) {
            if (event.type == "touchstart" || event.type == "touchmove") {
                var points = new Object();
                var rect = event.originalEvent.target.getBoundingClientRect()
                this._mouseX = event.originalEvent.touches[0].pageX - rect.left;
                this._mouseY = event.originalEvent.touches[0].pageY - rect.top;
                points = { x: this._mouseX, y: this._mouseY };
                this._newpoints.push(points);
            }
            else {
                if (event.offsetX) {
                    var points = new Object();
                    this._mouseX = event.offsetX;
                    this._mouseY = event.offsetY;
                    points = { x: this._mouseX, y: this._mouseY };
                    this._newpoints.push(points);
                }
                else if (event.layerX) {
                    this._mouseX = event.layerX;
                    this._mouseY = event.layerY;
                }
            }
        },
        _mouseEvent: function (event) {
            if (this._mouseDetection) {
                this._draw(2, event);
                this._oldX = this._mouseX;
                this._oldY = this._mouseY;
            }
        },
        _draw: function (line_width, event) {
            var canvas = document.getElementById(this._id + "_imageTemp");
            var context = canvas.getContext("2d");
            context.beginPath();
            context.moveTo(this._oldX, this._oldY);
            context.lineTo(this._mouseX, this._mouseY);
            context.stroke();
            context.lineWidth = line_width;
            context.arc(this._oldX, this._oldY, line_width / 2, 0, Math.PI * 2, true);
            context.closePath();
            this._newObject.push(this._mouseX, this._mouseY);
        },
        _appendChildElement: function (rightBottomBtn) {
            var rightBottomBtns = document.createElement("div");
            rightBottomBtns.style.position = "absolute";
            rightBottomBtns.style.border = "1px solid #4f80ff";
            rightBottomBtns.style.backgroundColor = "white";
            rightBottomBtns.style.width = "8px";
            rightBottomBtns.style.height = "8px";
            rightBottomBtns.className = rightBottomBtn.className;
            rightBottomBtns.id = rightBottomBtn.id;
            rightBottomBtns.style.zIndex = "100000000";
            rightBottomBtns.style.left = (parseFloat(rightBottomBtn.style.width) / 2) - (parseFloat(rightBottomBtns.style.width) / 2) + "px";
            rightBottomBtns.style.top = (parseFloat(rightBottomBtn.style.height) / 2) - (parseFloat(rightBottomBtns.style.height) / 2) + "px";
            rightBottomBtn.appendChild(rightBottomBtns);
        },
        _addSignature: function (event) {
            var pageIndex = this._currentPage;
            var pageDiv = document.getElementById(this._id + 'pageDiv_' + pageIndex);
            var canvas = document.getElementById(this._id + "pagecanvas_" + pageIndex);
            var imageTempcanvas = document.getElementById(this._id + "_imageTemp");
            var length = this._totalSignature.length;
            var w = parseFloat($(imageTempcanvas).css("width"));
            var h = parseFloat($(imageTempcanvas).css("height"));
            var newCanvas = document.createElement('canvas');
            newCanvas.id = this._id + "imagecanvasDraw_" + pageIndex + '_' + length;
            newCanvas.className = "e-pdfviewer-imagecanvasDraw";
            var splitedvalue = this._outputString.split("<br>")[1].split('.').slice(1).join('.');
            if (splitedvalue) {
                var substring = splitedvalue.substring(0, 6);
                var movevalues = splitedvalue.substring(6);
                var points = movevalues.replace(/[{()}]/g, '');
                var splitPoints = points.split(',');
                var point1 = parseFloat(splitPoints[0]);
                var point2 = parseFloat(splitPoints[1]);
                this._maxpointsX = this._minpointsX = point1;
                this._maxpointsY = this._minpointsY = point2;
            }
            var length = this._outputString.split("<br>").length;
            for (var n = 0; n < length; n++) {
                var splitedvalue = this._outputString.split("<br>")[n].split('.').slice(1).join('.');
                if (splitedvalue) {
                    var substring = splitedvalue.substring(0, 6);
                    var movevalues = splitedvalue.substring(6);
                    var points = movevalues.replace(/[{()}]/g, '');
                    var splitPoints = points.split(',');
                    var point1 = parseFloat(splitPoints[0]);
                    var point2 = parseFloat(splitPoints[1]);
                    if (this._minpointsX >= point1) {
                        this._minpointsX = point1;
                    }
                    if (this._minpointsY >= point2) {
                        this._minpointsY = point2;
                    }
                    if (this._maxpointsX <= point1) {
                        this._maxpointsX = point1;
                    }
                    if (this._maxpointsY <= point2) {
                        this._maxpointsY = point2;
                    }
                }
            }
            this._minpointsX = this._minpointsX - 5;
            this._minpointsY = this._minpointsY - 5;
            this._maxpointsX = this._maxpointsX + 5;
            this._maxpointsY = this._maxpointsY + 5;
            var differenceX = this._maxpointsX - this._minpointsX;
            var differenceY = this._maxpointsY - this._minpointsY;
            this._differenceX = differenceX;
            this._differenceY = differenceY;
            newCanvas.width = 200 * this._zoomVal;
            newCanvas.height = 140 * this._zoomVal;
            newCanvas.style.width = 200 * this._zoomVal + "px";
            newCanvas.style.height = 140 * this._zoomVal + "px";
            var widths = newCanvas.width;
            var heights = newCanvas.height;

            newCanvas.style.position = "absolute";
            if (event.type == "touchend") {
                event = event.originalEvent.changedTouches[0];
                var pageviewcontainer = $('#' + this._id + '_viewerContainer');
                newCanvas.style.left = (parseFloat($(pageviewcontainer).css("width")) / 2) - $(pageDiv).offset().left + "px";
                newCanvas.style.top = (parseFloat($(pageviewcontainer).css("height")) / 2) - $(pageDiv).offset().top + "px";
                if (((parseFloat(newCanvas.style.top) + heights)) > ($(pageDiv).height())) {
                    newCanvas.style.top = (parseFloat(newCanvas.style.top) - heights) + "px";
                }
                else if ((parseFloat(newCanvas.style.top) < 0)) {
                    newCanvas.style.top = (parseFloat(newCanvas.style.top) + heights) + "px";
                }
            }
            else {
                if (event.pageX - $(pageDiv).offset().left + (widths / 2) < canvas.clientWidth && event.pageX - $(pageDiv).offset().left - (widths / 2) > 0) {
                    newCanvas.style.left = event.pageX - $(pageDiv).offset().left - (widths / 2) + "px";
                }
                else if (event.pageX - $(pageDiv).offset().left - (widths) <= 0) {
                    newCanvas.style.left = "0px";
                }
                else if (event.pageX - $(pageDiv).offset().left + (widths) >= canvas.clientWidth) {
                    newCanvas.style.left = event.pageX - $(pageDiv).offset().left - (widths) + "px";
                }
                if (event.pageY - $(pageDiv).offset().top + (heights) < canvas.clientHeight && event.pageY - $(pageDiv).offset().top - (heights) > 0) {
                    newCanvas.style.top = event.pageY - $(pageDiv).offset().top - (heights) + "px";
                }
                else {
                    newCanvas.style.top = "0px";
                }
            }
            this._canvasTopPosition = event.pageX;
            this._canvasLeftPosition = event.pageY;
            this._newCanvas = newCanvas;
            newCanvas.style.zIndex = "10000000";
            pageDiv.appendChild(newCanvas);
            var proxy = this;
            var pageviewcontainer = $('#' + this._id + '_viewerContainer');
            $(window).on("mousemove", function (event) {
                if (proxy._signatureAdded && proxy._newCanvas) {
                    var tempCavas = proxy._newCanvas;
                    var tempctx = tempCavas.getContext("2d");
                    proxy._isCanasResized = false;
                    proxy._startWidth = tempCavas.clientWidth;
                    proxy._startHeight = tempCavas.clientHeight;
                    var bounds = tempCavas.getBoundingClientRect();
                    var x = event.pageX - proxy._canvasTopPosition;
                    var y = event.pageY - proxy._canvasLeftPosition;
                    proxy._canvasTopPosition = event.pageX;
                    proxy._canvasLeftPosition = event.pageY;
                    var top = (y + parseFloat(tempCavas.style.top));
                    var left = (x + parseFloat(tempCavas.style.left));
                    var isButtons = document.getElementById(proxy._id + "e-pdfviewer-buttons");
                    if (event.pageX - $(pageDiv).offset().left + (proxy._startWidth / 2) < canvas.clientWidth && event.pageX - $(pageDiv).offset().left - (proxy._startWidth / 2) > 0) {
                        tempCavas.style.left = event.pageX - $(pageDiv).offset().left - (proxy._startWidth / 2) + "px";
                    }
                    else {
                        tempCavas.style.left = tempCavas.style.left;
                    }
                    if (event.pageY - $(pageDiv).offset().top + (proxy._startHeight / 2) < canvas.clientHeight && event.pageY - $(pageDiv).offset().top - (proxy._startHeight / 2) > 0) {
                        tempCavas.style.top = event.pageY - $(pageDiv).offset().top - (proxy._startHeight / 2) + "px";
                    }
                    else {
                        tempCavas.style.top = tempCavas.style.top;
                    }
                }
            });
            $(window).on("mouseup touchend", function (event) {
                proxy._isCanasResized = false;
                proxy._isCanvasClicked = false;
                proxy._signatureAdded = false;
                var newCanvas = proxy._tempCanvas;
                if (proxy._isCanvasMoved) {
                    proxy._addingHistoryMove(newCanvas);
                }
                if (proxy._isCanvasResizeOver) {
                    proxy._addingHistoryResize(newCanvas);
                }
            });
            $(pageDiv).on("mousedown touchstart", function (event) {
                var isSelectors = document.getElementById(proxy._id + "e-pdfviewer-selector");
                var isButtons = document.getElementsByClassName('e-pdfviewer-buttons');
                if (event.target.className != "e-pdfviewer-imagecanvasDraw" && event.target.className != "e-pdfviewer-buttons") {
                    var highlight = document.getElementById(this._id + "highlight-menu");
                    $(highlight).hide();
                    proxy._tempCanvas = null;
                    proxy._isCanasResized = false;
                    proxy._isCanvasClicked = false;
                }
                if (isSelectors && !proxy._isCanvasClicked && !proxy._isCanasResized && isButtons) {
                    $(isSelectors).remove();
                    $(isButtons).remove();
                }
                proxy._signatureAdded = false;
                $(newCanvas).on("mousedown touchstart", function (event) {
                    proxy._signatureAdded = false;
                    proxy._clearRectOnClick(proxy._AnnotationPage);
                    if (event.type == "touchstart") {
                        event.preventDefault();
                        event = event.originalEvent.changedTouches[0];
                    }
                    var rect = event.target.id;
                    var tempCavas = document.getElementById(rect);
                    var pageDiv = document.getElementById(proxy._id + 'pageDiv_' + pageIndex);
                    proxy._tempCanvas = tempCavas;
                    proxy._canvasTopPosition = event.pageX;
                    proxy._canvasLeftPosition = event.pageY;
                    proxy._isCanvasClicked = true;
                    proxy._isCanasResized = false;
                    proxy._initialCoordinates = new Object();
                    proxy._initialCoordinates.left = parseFloat(tempCavas.style.left);
                    proxy._initialCoordinates.top = parseFloat(tempCavas.style.top);
                    proxy._removeSelector();
                    var selector = document.createElement("div");
                    selector.style.position = "absolute";
                    selector.style.borderRadius = "3px";
                    selector.style.border = "1px solid #4f80ff";
                    selector.id = proxy._id + "e-pdfviewer-selector";
                    var bounds = proxy._getBounds(event);
                    selector.style.width = bounds.width + "px";
                    selector.style.height = bounds.height + "px";
                    selector.style.left = bounds.x;
                    selector.style.top = bounds.y;
                    selector.style.zIndex = "100000";
                    pageDiv.appendChild(selector);
                    var rightBottomBtn = document.createElement("div");
                    rightBottomBtn.style.position = "absolute";
                    rightBottomBtn.id = proxy._id + "e-pdfviewer-rightbottombtn";
                    rightBottomBtn.className = "e-pdfviewer-buttons";
                    rightBottomBtn.style.width = "20px";
                    rightBottomBtn.style.height = "20px";
                    rightBottomBtn.style.left = parseFloat(bounds.width) - (parseFloat(rightBottomBtn.style.width) / 2) + "px";
                    rightBottomBtn.style.top = parseFloat(bounds.height) - (parseFloat(rightBottomBtn.style.height) / 2) + "px";
                    rightBottomBtn.style.zIndex = "100000000";
                    rightBottomBtn.style.cursor = "se-resize";
                    selector.appendChild(rightBottomBtn);
                    proxy._appendChildElement(rightBottomBtn);
                    $('.e-pdfviewer-buttons').on("mousedown touchstart", function (event) {
                        if (event.type == "touchstart") {
                            event.preventDefault();
                            event = event.originalEvent.changedTouches[0];
                        }
                        var selectorsId = document.getElementById(proxy._id + "e-pdfviewer-selector");
                        proxy._target = event.target;
                        var tempCavas = proxy._tempCanvas;
                        proxy._startX = event.clientX;
                        proxy._startY = event.clientY;
                        proxy._startWidth = tempCavas.clientWidth;
                        proxy._startHeight = tempCavas.clientHeight;
                        proxy._initialSize = { height: parseInt(proxy._startHeight), width: parseInt(proxy._startWidth) };
                        proxy._canvasTopPosition = parseFloat($(tempCavas).css("top"));
                        proxy._canvasLeftPosition = parseFloat($(tempCavas).css("left"));
                        proxy._isCanasResized = true;
                    });
                    $(window).on("mousemove touchmove", function (event) {
                        var canvas = document.getElementById(proxy._id + "pagecanvas_" + proxy._currentPage);
                        var isSelectors = document.getElementById(proxy._id + "e-pdfviewer-selector");
                        if (event.type == "touchmove") {
                            event = event.originalEvent.changedTouches[0];
                        }
                        if (proxy._isCanasResized == true) {
                            var pageDiv = document.getElementById(proxy._id + 'pageDiv_' + proxy._currentPage);
                            var target = event.target;
                            if (target.className != "e-pdfviewer-buttons") {
                                target.style.cursor = "auto";
                            }
                            var tempCavas = proxy._tempCanvas;
                            var tempctx = tempCavas.getContext("2d");
                            proxy._isCanvasClicked = false;
                            var width = proxy._startWidth + (event.clientX - proxy._startX);
                            var height = proxy._startHeight + (event.clientY - proxy._startY);
                            var left = proxy._canvasLeftPosition - (proxy._startX - event.clientX);
                            var top = proxy._canvasTopPosition - (proxy._startY - event.clientY);
                            width -= ($(tempCavas).outerWidth() - parseInt($(tempCavas).css("width")));
                            width += "px";
                            height -= ($(tempCavas).outerHeight() - parseInt($(tempCavas).css("height")));
                            height += "px";
                            left += "px";
                            top += "px";
                            proxy._applyNewBounds(event, tempCavas, width, height, left, top, proxy._startX, proxy._startY, event.pageX, event.clientY, proxy._target, canvas, pageDiv);
                            proxy._calculateIconPosition(event);
                        }
                        if ((proxy._isCanvasClicked == true && isSelectors)) {
                            var tempCavas = proxy._tempCanvas;
                            var tempctx = tempCavas.getContext("2d");
                            proxy._isCanasResized = false;
                            proxy._startWidth = tempCavas.clientWidth;
                            proxy._startHeight = tempCavas.clientHeight;
                            var isButtons = document.getElementById(proxy._id + "e-pdfviewer-buttons");
                            var x = event.pageX - proxy._canvasTopPosition;
                            var y = event.pageY - proxy._canvasLeftPosition;
                            proxy._canvasTopPosition = event.pageX;
                            proxy._canvasLeftPosition = event.pageY;
                            var top = (y + parseFloat(tempCavas.style.top));
                            var left = (x + parseFloat(tempCavas.style.left));
                            var total = parseFloat(tempCavas.clientWidth) + parseFloat(tempCavas.style.left);
                            if (left > 0 && (left + proxy._startWidth) < canvas.clientWidth) {
                                if (top > 0 && (top + proxy._startHeight) < canvas.clientHeight) {
                                    tempCavas.style.top = (y + parseFloat(tempCavas.style.top)) + "px";
                                }
                                tempCavas.style.left = (x + parseFloat(tempCavas.style.left)) + "px";
                                proxy._calculateIconPosition(event);
                            }
                            else {
                                tempCavas.style.top = tempCavas.style.top + "px";
                                tempCavas.style.left = tempCavas.style.left + "px";
                            }
                            proxy._isCanvasMoved = true;
                        }
                    });
                    $('.e-pdfviewer-buttons').on("mouseup touchend", function (e) {
                        proxy._isCanasResized = false;
                        proxy._isCanvasClicked = false;
                        proxy._target = null;
                        if (proxy._isCanvasResizeOver) {
                            proxy._addingHistoryResize(newCanvas);
                        }
                    });
                });
                $(newCanvas).on("mouseup touchend", function (event) {
                    proxy._isCanvasClicked = false;
                    proxy._isCanasResized = false;
                    if (proxy._isCanvasMoved) {
                        proxy._addingHistoryMove(newCanvas);
                    }
                });
            });
            var context = newCanvas.getContext("2d");
            var length = this._outputString.split("<br>").length;
            this._totalSignature.push(newCanvas);
            this._outputPath[newCanvas.id] = this._outputString;
            context.beginPath();
            var newdifferenceX = differenceX / newCanvas.clientWidth;
            var newdifferenceY = differenceY / newCanvas.clientHeight;
            for (var k = 0; k < length; k++) {
                var splitedvalue = this._outputString.split("<br>")[k].split('.').slice(1).join('.');
                if (splitedvalue) {
                    var substring = splitedvalue.substring(0, 6);
                    var movevalues = splitedvalue.substring(6);
                    var points = movevalues.replace(/[{()}]/g, '');
                    var splitPoints = points.split(',');
                    var point1 = ((parseFloat(splitPoints[0])) - this._minpointsX) / newdifferenceX;
                    var point2 = ((parseFloat(splitPoints[1])) - this._minpointsY) / newdifferenceY;
                    if (substring == "moveTo") {
                        context.moveTo(point1, point2);
                    }
                    else if (substring == "lineTo") {
                        context.lineTo(point1, point2);
                    }
                }
            }
            context.lineWidth = 4;
            context.scale(0.5, 0.5);
            context.strokeStyle = this.model.signatureSettings.color;
            context.stroke();
            var minimumX = this._minpointsX;
            var minimumY = this._minpointsY;
            var completestring = new Object();
            completestring.minimumX = minimumX;
            completestring.minimumY = minimumY;
            completestring.differenceX = differenceX;
            completestring.differenceY = differenceY;
            this._valueChanges[newCanvas.id] = completestring;
            $(newCanvas).css("opacity", this.model.signatureSettings.opacity);
            $('#' + this._id + "_containerDialogTab").ejDialog("close");
            var bounds = { "width": 0, "height": 0, "x": 0, "y": 0 };
            if (newCanvas) {
                bounds.width = newCanvas.clientWidth / this._zoomVal;
                bounds.height = newCanvas.clientHeight / this._zoomVal;
                bounds.x = parseFloat($(newCanvas).css("left")) / this._zoomVal;
                bounds.y = parseFloat($(newCanvas).css("top")) / this._zoomVal;
            }
            var args = new Object();
            args.annotationSettings = this.model.signatureSettings;
            args.annotationId = newCanvas.id;
            args.pageId = pageIndex;
            args.annotationBound = bounds;
            this._raiseClientEvent("signatureAdd", args);
        },
        _addingHistoryMove: function (newCanvas) {
            var proxy = this;
            var signatureObject = new Object();
            signatureObject.operation = "signatureMoved";
            var pageIndex = parseInt(newCanvas.id.split("imagecanvasDraw_")[1].split('_')[0]);
            signatureObject.pageNumber = pageIndex;
            signatureObject.signCanvas = newCanvas;
            var pageDivElement = document.getElementById(proxy._id + 'pageDiv_' + pageIndex);
            var pagePosition = pageDivElement.getBoundingClientRect();
            proxy._newinitialCoordinates = new Object();
            proxy._newinitialCoordinates.left = parseFloat(newCanvas.style.left);
            proxy._newinitialCoordinates.top = parseFloat(newCanvas.style.top);
            signatureObject.Coordinates = proxy._newinitialCoordinates;
            signatureObject.initialCoordinates = proxy._initialCoordinates;
            proxy._recentOperation.push(signatureObject);
            proxy._isCanvasMoved = false;

        },
        _addingHistoryResize: function (newCanvas) {
            var proxy = this;
            var path = proxy._outputPath[newCanvas.id];
            var newWidths = newCanvas.clientWidth;
            var newHeight = newCanvas.clientHeight;
            proxy._reDrawSignature(path, newCanvas, newWidths, newHeight);
            var signObject = new Object();
            signObject.operation = "signatureResized";
            var pageIndex = parseInt(newCanvas.id.split("imagecanvasDraw_")[1].split('_')[0]);
            signObject.pageNumber = pageIndex;
            signObject.signCanvas = newCanvas;
            signObject.initialSize = proxy._initialSize;
            signObject.size = proxy._size;
            proxy._recentOperation.push(signObject);
            proxy._isCanvasResizeOver = false;
            var bounds = { "width": 0, "height": 0, "x": 0, "y": 0 };
            if (newCanvas) {
                bounds.width = newCanvas.clientWidth / proxy._zoomVal;
                bounds.height = newCanvas.clientHeight / proxy._zoomVal;
                bounds.x = parseFloat($(newCanvas).css("left")) / proxy._zoomVal;
                bounds.y = parseFloat($(newCanvas).css("top")) / proxy._zoomVal;
            }
            var signatureContext = newCanvas.getContext("2d");
            var args = new Object();
            var newSignatureSettings = {
                color: signatureContext.strokeStyle,
                opacity: $(newCanvas).css("opacity"),
            };
            args.signatureSettings = newSignatureSettings;
            args.pageNumber = newCanvas.id;
            args.pageId = parseInt(newCanvas.id.split("imagecanvasDraw_")[1].split('_')[0]);
            args.signatureCurrentBound = bounds;
            args.signaturePreviousBound = proxy._size;
            proxy._raiseClientEvent("signatureResize", args);
        },
        _moveSignatureArrowKey: function (event) {
            var proxy = this;
            if (event.keyCode == 37 || event.keyCode == 38 || event.keyCode == 39 || event.keyCode == 40) {
                var tempCavas = proxy._tempCanvas;
                if (tempCavas) {
                    event.preventDefault();
                }
                var isSelectors = document.getElementById(proxy._id + "e-pdfviewer-selector");
                var canvas = document.getElementById(proxy._id + "pagecanvas_" + proxy._currentPage);
                if (tempCavas) {
                    var left = parseFloat(tempCavas.style.left);
                    var top = parseFloat(tempCavas.style.top);
                    proxy._keyInitialCoordinates = new Object();
                    proxy._keyInitialCoordinates.left = left;
                    proxy._keyInitialCoordinates.top = top;
                }
                var pageviewcontainer = $('#' + this._id + '_viewerContainer');
                if (tempCavas && isSelectors) {
                    var left = parseFloat(tempCavas.style.left);
                    var top = parseFloat(tempCavas.style.top);
                    var width = parseFloat(tempCavas.style.width);
                    var height = parseFloat(tempCavas.style.height);
                    var selectorLeft = parseFloat($(isSelectors).css("left"));
                    var selectorTop = parseFloat($(isSelectors).css("top"));
                    switch (event.keyCode) {
                        case 37:
                            if ((left + width) > 0 && (left - 20) > 0) {
                                tempCavas.style.left = parseFloat(tempCavas.style.left) - 20 + "px";
                                $(isSelectors).css("left", selectorLeft - 20 + "px");
                            }
                            break;
                        case 39:
                            if ((left + width + 20) < canvas.clientWidth) {

                                tempCavas.style.left = parseFloat(tempCavas.style.left) + 20 + "px";
                                $(isSelectors).css("left", selectorLeft + 20 + "px");
                            }
                            break;
                        case 38:
                            if ((top + height) > 0 && (top - 20) > 0) {
                                tempCavas.style.top = parseFloat(tempCavas.style.top) - 20 + "px";
                                $(isSelectors).css("top", selectorTop - 20 + "px");
                            }
                            break;

                        case 40:
                            if ((top + height + 20) < canvas.clientHeight) {
                                tempCavas.style.top = parseFloat(tempCavas.style.top) + 20 + "px";
                                $(isSelectors).css("top", selectorTop + 20 + "px");
                            }
                            break;
                    }
                    var signatureObject = new Object();
                    signatureObject.operation = "keyMoved";
                    var pageIndex = parseInt(tempCavas.id.split("imagecanvasDraw_")[1].split('_')[0]);
                    signatureObject.pageNumber = pageIndex;
                    signatureObject.signCanvas = tempCavas;
                    var pageDivElement = document.getElementById(proxy._id + 'pageDiv_' + pageIndex);
                    var pagePosition = pageDivElement.getBoundingClientRect();
                    proxy._newinitialPosition = new Object();
                    proxy._newinitialPosition.left = parseFloat(tempCavas.style.left);
                    proxy._newinitialPosition.top = parseFloat(tempCavas.style.top);
                    signatureObject.Coordinates = proxy._newinitialPosition;
                    signatureObject.keyinitialCoordinates = proxy._keyInitialCoordinates;
                    proxy._recentOperation.push(signatureObject);
                }
            }
            else if (event.keyCode == 46) {
                proxy._deleteSignatureCanvas();
            }
        },
        _applyNewBounds: function (event, element, width, height, left, top, startX, startY, clientX, clientY, resizeElement, canvas, pageDiv) {
            var proxy = this;
            proxy._size = new Object();
            var lefts = $(element).css("left");
            var tops = $(element).css("top");
            if (resizeElement.id == (proxy._id + "e-pdfviewer-rightbottombtn")) {
                if (parseFloat(lefts) > 0 && (parseFloat(width) + parseFloat(lefts)) < canvas.clientWidth)
                    $(element).css("width", width);
                proxy._size.width = width;
            }
            if (resizeElement.id == (proxy._id + "e-pdfviewer-rightbottombtn")) {
                if (parseFloat(tops) > 0 && (parseFloat(height) + parseFloat(tops)) < canvas.clientHeight) {
                    $(element).css("height", height);
                }
                proxy._size.height = height;
            }
            proxy._isCanvasResizeOver = true;
        },
        _calculateIconPosition: function (event) {
            var proxy = this;
            var selector = document.getElementById(proxy._id + "e-pdfviewer-selector");
            var rightBottomBtn = document.getElementById(proxy._id + "e-pdfviewer-rightbottombtn");
            var leftBottomBtn = document.getElementById(proxy._id + "e-pdfviewer-leftBottomBtn");
            var rightTopBtn = document.getElementById(proxy._id + "e-pdfviewer-rightTopBtn");
            var leftTopBtn = document.getElementById(proxy._id + "e-pdfviewer-leftTopBtn");
            var isRotateBtn = document.getElementsByClassName('e-pdfviewer-rotatebuttons')[0];
            var isRotate = document.getElementsByClassName('e-pdfviewer-rotate')[0];
            var bounds = proxy._getBounds(event);
            selector.style.width = bounds.width + "px";
            selector.style.height = bounds.height + "px";
            selector.style.left = bounds.x;
            selector.style.top = bounds.y;
            rightBottomBtn.style.left = parseFloat(bounds.width) - (parseFloat(rightBottomBtn.style.width) / 2) + "px";
            rightBottomBtn.style.top = parseFloat(bounds.height) - (parseFloat(rightBottomBtn.style.height) / 2) + "px";
        },
        _removeSelector: function (e) {
            var proxy = this;
            var isSelectors = document.getElementById(proxy._id + "e-pdfviewer-selector");
            var isButtons = $(".e-pdfviewer-buttons");
            if (isSelectors) {
                $(isSelectors).remove();
                $(isButtons).remove();
            }
        },
        _getBounds: function (event) {
            var bounds = { "width": 0, "height": 0, "x": 0, "y": 0 };
            var tempCavas = this._tempCanvas;
            if (tempCavas) {
                bounds.width = tempCavas.clientWidth;
                bounds.height = tempCavas.clientHeight;
                bounds.x = $(tempCavas).css("left");
                bounds.y = $(tempCavas).css("top");
            }
            return bounds;
        },
        _clearSignature: function (e) {
            var canvas = document.getElementById(this._id + "_imageTemp");
            var context = canvas.getContext("2d");
            context.clearRect(0, 0, canvas.width, canvas.height);
            this._outputString = "";
            this._newObject = [];
            this._minX = this._minY = 0;
            this._maxX = this._maxY = 0;
        },
        _getPagePosition: function (id) {
            var pageContainer = document.getElementById(this._id + "selectioncanvas_" + id);
            return pageContainer.getBoundingClientRect();
        },

        _getTextNodes: function (selection, pageIndex) {
            var selectionRects = [];
            var range = document.createRange();
            var selectionRange = selection.getRangeAt(0);
            var annotationRect = selectionRange.getBoundingClientRect();
            if (selection.anchorNode == selection.focusNode) {
                if (this._isBackwardSelection) {
                    range.setStart(selection.focusNode, selection.focusOffset);
                    range.setEnd(selection.anchorNode, selection.anchorOffset);
                } else {
                    if (selection.anchorOffset < selection.focusOffset) {
                        range.setStart(selection.anchorNode, selection.anchorOffset);
                        range.setEnd(selection.focusNode, selection.focusOffset);
                    } else {
                        range.setStart(selection.focusNode, selection.focusOffset);
                        range.setEnd(selection.anchorNode, selection.anchorOffset);
                    }
                }
                var boundingRect = range.getBoundingClientRect();
                selectionRects.push(boundingRect);
            } else {
                if (this._isBackwardSelection) {
                    this._getAnnotationOffsets(selectionRange, selection.focusNode, selection.anchorNode, selection.focusOffset, selection.anchorOffset, selectionRects);
                } else {
                    var is_ie = navigator.userAgent.indexOf("MSIE") != -1 || !!document.documentMode == true;
                    var is_edge = navigator.userAgent.indexOf("Edge") != -1;
                    var is_edgeNew = document.documentMode || /Edge/.test(navigator.userAgent);
                    if (is_ie || is_edge || is_edgeNew) {
                        var isBackwardSelection = false;
                        var anchorIndex, focusIndex;
                        for (var i = 0; i < this._textDivs[pageIndex].length; i++) {
                            var textContent = this._textDivs[pageIndex][i].textContent;
                            if (textContent == selection.anchorNode.data)
                                anchorIndex = i;
                            if (textContent == selection.focusNode.data)
                                focusIndex = i;
                            if (i == this._textDivs[pageIndex].length - 1 && !focusIndex) {
                                focusIndex = this._textDivs[pageIndex].length - 1;
                            }
                        }
                        if (anchorIndex < focusIndex || !anchorIndex) {
                            this._getAnnotationOffsets(selectionRange, selection.anchorNode, selection.focusNode, selection.anchorOffset, selection.focusOffset, selectionRects);
                        } else
                            this._getAnnotationOffsets(selectionRange, selection.focusNode, selection.anchorNode, selection.focusOffset, selection.anchorOffset, selectionRects);
                    } else
                        this._getAnnotationOffsets(selectionRange, selection.anchorNode, selection.focusNode, selection.anchorOffset, selection.focusOffset, selectionRects);
                }
            }
            return { rectangleBound: annotationRect, bounds: selectionRects };
        },

        _getAnnotationOffsets: function (selectionRange, startNode, endNode, selectionStartOffset, selectionEndOffset, selectionRects) {
            if (startNode.parentNode.className == "e-pdfviewer-selectiondiv text_container") {
                var anchorPageId = parseInt(startNode.id.split("text_")[1]);
                var anchorTextId = parseInt(startNode.id.split("text_" + anchorPageId + '_')[1]);
            }
            else {
                var anchorPageId = parseInt(startNode.parentNode.id.split("text_")[1]);
                var anchorTextId = parseInt(startNode.parentNode.id.split("text_" + anchorPageId + '_')[1]);
            }
            if (endNode.parentNode.className == "e-pdfviewer-selectiondiv text_container") {
                var focusPageId = parseInt(endNode.id.split("text_")[1]);
                var focusTextId = parseInt(endNode.id.split("text_" + focusPageId + '_')[1]);
            }
            else {
                var focusPageId = parseInt(endNode.parentNode.id.split("text_")[1]);
                var focusTextId = parseInt(endNode.parentNode.id.split("text_" + focusPageId + '_')[1]);
            }
            var startOffset, endOffset, currentId;
            if (this._isFindboxPresent) {
                this._clearAllOccurrences();
            }
            var pageId;
            if (anchorPageId != focusPageId && this._isBackwardSelection)
                pageId = focusPageId;
            else
                pageId = anchorPageId;
            for (var i = pageId; i <= focusPageId; i++) {
                var textDivs = this._textDivs[i];
                if (i == anchorPageId) {
                    currentId = anchorTextId;
                } else {
                    if (this._isBackwardSelection)
                        currentId = 0;
                    else
                        break;
                }
                for (var j = currentId; j < this._textDivs[i].length; j++) {
                    var textElement = textDivs[j];
                    var range = document.createRange();
                    if (j == anchorTextId) {
                        startOffset = selectionStartOffset;
                    } else {
                        startOffset = 0;
                    }
                    if (j == focusTextId) {
                        endOffset = selectionEndOffset;
                    } else {
                        endOffset = textElement.textContent.length;
                    }
                    for (var k = 0; k < textElement.childNodes.length; k++) {
                        var node = textElement.childNodes[k];
                        range.setStart(node, startOffset);
                        range.setEnd(node, endOffset);
                    }
                    var boundingRect = range.getBoundingClientRect();
                    range.detach();
                    selectionRects.push(boundingRect);
                    if (i == focusPageId && j == focusTextId) {
                        break;
                    }
                }
            }
        },

        _drawStrikeOutAnnotation: function () {
            if (this.model.enableTextMarkupAnnotations && this.model.enableStrikethroughAnnotation) {
                if (window.getSelection().toString()) {
                    var selection = window.getSelection();
                    var anchorId = this._getAnchorId(selection);
                    var focusId;
                    var is_ie = navigator.userAgent.indexOf("MSIE") != -1 || !!document.documentMode == true;
                    var is_edge = navigator.userAgent.indexOf("Edge") != -1;
                    var is_edgeNew = document.documentMode || /Edge/.test(navigator.userAgent);
                    if (is_ie || is_edge || is_edgeNew) {
                        var selectionNodes = this._getSelectionNodes(selection);
                        anchorId = selectionNodes.anchorIds;
                        focusId = selectionNodes.focusIds;
                        if (anchorId < focusId) {
                            this._isBackwardSelection = false;
                        } else if (anchorId > focusId) {
                            this._isBackwardSelection = true;
                        }
                    }
                    var prevYPosition = 0;
                    var indexes = [];
                    var selectionRects = this._getTextNodes(selection, anchorId);
                    var drawColor = this._drawColor ? this._drawColor : this.model.strikethroughSettings.color;
                    var tempColorObject;
                    if (typeof drawColor === 'object') {
                        tempColorObject = JSON.parse(JSON.stringify(drawColor));
                        drawColor = 'rgb(' + drawColor.r + ',' + drawColor.g + ',' + drawColor.b + ')';
                    } else if (typeof drawColor === 'string') {
                        tempColorObject = this._toolbarColorpickerObject.hexCodeToRGB(drawColor);
                    }
                    var date = new Date();
                    var modifiedDate = this.model.strikethroughSettings.modifiedDate ? this.model.strikethroughSettings.modifiedDate : date.toLocaleString();
                    var textMarkupAnnotation = {
                        type: "StrikeOut",
                        bounds: [],
                        author: this.model.strikethroughSettings.author,
                        subject: this.model.strikethroughSettings.subject,
                        modifiedDate: modifiedDate,
                        colorR: tempColorObject.r,
                        colorG: tempColorObject.g,
                        colorB: tempColorObject.b,
                        colorA: 1 * 255,
                        opacity: this.model.strikethroughSettings.opacity,
                        note: "",
                        pageNumber: anchorId,
                        isLocked: this.model.strikethroughSettings.isLocked
                    }
                    for (var i = 0; i < selectionRects.bounds.length; i++) {
                        var pagePosition = this._getPagePosition(anchorId);
                        var bounds = selectionRects.bounds[i];
                        var xPosition = bounds.left - pagePosition.left;
                        var yPosition = bounds.top - pagePosition.top;
                        if (yPosition > this._pageSize[anchorId - 1].PageHeight) {
                            anchorId++;
                            pagePosition = this._getPagePosition(anchorId);
                            var yPosition = bounds.top - pagePosition.top;
                        }
                        var secCanvas = document.getElementById(this._id + "_secondarycanvas_" + anchorId);
                        var secCanvasPosition = secCanvas.getBoundingClientRect();
                        var context = secCanvas.getContext("2d");
                        context.beginPath();
                        yPosition = yPosition - 1.2 * this._zoomVal;
                        context.moveTo(xPosition, (yPosition) + (bounds.height / 2));
                        context.lineTo(xPosition + bounds.width, (yPosition) + (bounds.height / 2));
                        context.closePath();
                        context.strokeStyle = drawColor;
                        context.stroke();
                        var annotationBound = {
                            xPosition: xPosition / this._zoomVal,
                            yPosition: yPosition / this._zoomVal,
                            width: bounds.width / this._zoomVal,
                            height: bounds.height / this._zoomVal
                        };
                        textMarkupAnnotation.bounds.push(annotationBound);
                    }
                    this._newAnnotationList[anchorId - 1].push(textMarkupAnnotation);
                    this._totalAnnotations[anchorId].push(JSON.parse(JSON.stringify(textMarkupAnnotation)));
                    var args = new Object();
                    args.annotationSettings = this.model.strikethroughSettings;
                    args.annotationId = this._totalAnnotations[anchorId].length - 1;
                    args.pageId = anchorId;
                    args.annotationBound = textMarkupAnnotation.bounds;
                    args.annotationType = "StrikeOut"
                    this._raiseClientEvent("annotationAdd", args);
                    var lastIndex = this._newAnnotationList[anchorId - 1].length - 1;
                    indexes.push(lastIndex);
                    var recentOp = {
                        operation: "AddedStrikeOut",
                        pageNumber: anchorId,
                        indexes: indexes
                    }
                    this._recentOperation.push(recentOp);
                    this._redoActions = new Array();
                    for (var i = 0; i < this._totalPages; i++) {
                        var newArray = [];
                        this._redoAnnotationCollection[i] = newArray;
                    }
                    window.getSelection().removeAllRanges();
                    this.isDocumentEdited = true;
                }
                if ($('#' + this._id + 'custom-menu'))
                    $('#' + this._id + 'custom-menu').hide();
                this._waterDropletDivHide();
                $('#' + this._id + 'touchcustom-menu').hide();
            }
        },

        _drawUnderlineAnnotation: function () {
            if (this.model.enableTextMarkupAnnotations && this.model.enableUnderlineAnnotation) {
                if (window.getSelection().toString()) {
                    var selection = window.getSelection();
                    var anchorId = this._getAnchorId(selection);
                    var focusId;
                    var is_ie = navigator.userAgent.indexOf("MSIE") != -1 || !!document.documentMode == true;
                    var is_edge = navigator.userAgent.indexOf("Edge") != -1;
                    var is_edgeNew = document.documentMode || /Edge/.test(navigator.userAgent);
                    if (is_ie || is_edge || is_edgeNew) {
                        var selectionNodes = this._getSelectionNodes(selection);
                        anchorId = selectionNodes.anchorIds;
                        focusId = selectionNodes.focusIds;
                        if (anchorId < focusId) {
                            this._isBackwardSelection = false;
                        } else if (anchorId > focusId) {
                            this._isBackwardSelection = true;
                        }
                    }
                    var prevYPosition = 0;
                    var indexes = [];
                    var drawColor = this._drawColor ? this._drawColor : this.model.underlineSettings.color;
                    var tempColorObject;
                    if (typeof drawColor === 'object') {
                        tempColorObject = JSON.parse(JSON.stringify(drawColor));
                        drawColor = 'rgb(' + drawColor.r + ',' + drawColor.g + ',' + drawColor.b + ')';
                    } else if (typeof drawColor === 'string') {
                        tempColorObject = this._toolbarColorpickerObject.hexCodeToRGB(drawColor);
                    }
                    var selectionRects = this._getTextNodes(selection, anchorId);
                    var date = new Date();
                    var modifiedDate = this.model.underlineSettings.modifiedDate ? this.model.underlineSettings.modifiedDate : date.toLocaleString();
                    var textMarkupAnnotation = {
                        type: "Underline",
                        bounds: [],
                        author: this.model.underlineSettings.author,
                        subject: this.model.underlineSettings.subject,
                        modifiedDate: modifiedDate,
                        colorR: tempColorObject.r,
                        colorG: tempColorObject.g,
                        colorB: tempColorObject.b,
                        colorA: 1 * 255,
                        opacity: this.model.underlineSettings.opacity,
                        note: "",
                        pageNumber: anchorId,
                        isLocked: this.model.underlineSettings.isLocked
                    };
                    for (var i = 0; i < selectionRects.bounds.length; i++) {
                        var pagePosition = this._getPagePosition(anchorId);
                        var bounds = selectionRects.bounds[i];
                        var xPosition = bounds.left - pagePosition.left;
                        var yPosition = bounds.top - pagePosition.top;
                        if (yPosition > this._pageSize[anchorId - 1].PageHeight) {
                            anchorId++;
                            pagePosition = this._getPagePosition(anchorId);
                            var yPosition = bounds.top - pagePosition.top;
                        }
                        var secCanvas = document.getElementById(this._id + "_secondarycanvas_" + anchorId);
                        var secCanvasPosition = secCanvas.getBoundingClientRect();
                        var context = secCanvas.getContext("2d");
                        context.beginPath();
                        yPosition = yPosition - 1.2 * this._zoomVal;
                        context.moveTo(xPosition, yPosition + bounds.height);
                        context.lineTo(xPosition + bounds.width, yPosition + bounds.height);
                        context.closePath();
                        context.strokeStyle = drawColor;
                        context.stroke();
                        var annotationBound = {
                            xPosition: xPosition / this._zoomVal,
                            yPosition: yPosition / this._zoomVal,
                            width: bounds.width / this._zoomVal,
                            height: bounds.height / this._zoomVal
                        };
                        textMarkupAnnotation.bounds.push(annotationBound);
                    }
                    this._newAnnotationList[anchorId - 1].push(textMarkupAnnotation);
                    this._totalAnnotations[anchorId].push(JSON.parse(JSON.stringify(textMarkupAnnotation)));
                    var args = new Object();
                    args.annotationSettings = this.model.underlineSettings;
                    args.annotationId = this._totalAnnotations[anchorId].length - 1;
                    args.pageId = anchorId;
                    args.annotationBound = textMarkupAnnotation.bounds;
                    args.annotationType = "Underline";
                    this._raiseClientEvent("annotationAdd", args);
                    var lastIndex = this._newAnnotationList[anchorId - 1].length - 1;
                    indexes.push(lastIndex);
                    var recentOp = {
                        operation: "AddedUnderline",
                        pageNumber: anchorId,
                        indexes: indexes
                    }
                    this._recentOperation.push(recentOp);
                    this._redoActions = new Array();
                    for (var i = 0; i < this._totalPages; i++) {
                        var newArray = [];
                        this._redoAnnotationCollection[i] = newArray;
                    }
                    this.isDocumentEdited = true;
                    window.getSelection().removeAllRanges();
                    this._waterDropletDivHide();
                    $('#' + this._id + 'touchcustom-menu').hide();
                }
            }
        },

        _getAnchorId: function (selection) {
            var anchorId;
            if (selection.anchorNode.parentNode.className == "e-pdfviewer-selectiondiv text_container") {
                anchorId = parseInt(selection.anchorNode.id.split("text_")[1]);
            }
            else {
                anchorId = parseInt(selection.anchorNode.parentNode.id.split("text_")[1]);
            }
            return anchorId;
        },
        _getSelectionNodes: function (selection) {
            var anchorId, focusId;
            if (selection.anchorNode.parentNode.className == "e-pdfviewer-selectiondiv text_container") {
                anchorId = parseInt(selection.anchorNode.id.split("text_")[1]);
            }
            else {
                anchorId = parseInt(selection.anchorNode.parentNode.id.split("text_")[1]);
            }
            if (selection.focusNode.parentNode.className == "e-pdfviewer-selectiondiv text_container") {
                focusId = parseInt(selection.focusNode.id.split("text_")[1]);
            }
            else {
                focusId = parseInt(selection.focusNode.parentNode.id.split("text_")[1]);
            }
            return { anchorIds: anchorId, focusIds: focusId };
        },

        _drawHighlightAnnotation: function () {
            if (this.model.enableTextMarkupAnnotations && this.model.enableHighlightAnnotation) {
                if (window.getSelection().toString()) {
                    var selection = window.getSelection();
                    var anchorId = this._getAnchorId(selection);
                    var focusId;
                    var is_ie = navigator.userAgent.indexOf("MSIE") != -1 || !!document.documentMode == true;
                    var is_edge = navigator.userAgent.indexOf("Edge") != -1;
                    var is_edgeNew = document.documentMode || /Edge/.test(navigator.userAgent);
                    if (is_ie || is_edge || is_edgeNew) {
                        var selectionNodes = this._getSelectionNodes(selection);
                        anchorId = selectionNodes.anchorIds;
                        focusId = selectionNodes.focusIds;
                        if (anchorId < focusId) {
                            this._isBackwardSelection = false;
                        } else if (anchorId > focusId) {
                            this._isBackwardSelection = true;
                        }
                    }
                    var prevYPosition = 0;
                    var indexes = [];
                    var selectionRects = this._getTextNodes(selection, anchorId);
                    var drawColor = this._drawColor ? this._drawColor : this.model.highlightSettings.color;
                    var tempColorObject;
                    if (typeof drawColor === 'object') {
                        tempColorObject = JSON.parse(JSON.stringify(drawColor));
                        drawColor = 'rgb(' + drawColor.r + ',' + drawColor.g + ',' + drawColor.b + ')';
                    } else if (typeof drawColor === 'string') {
                        tempColorObject = this._toolbarColorpickerObject.hexCodeToRGB(drawColor);
                    }
                    var date = new Date();
                    var modifiedDate = this.model.highlightSettings.modifiedDate ? this.model.highlightSettings.modifiedDate : date.toLocaleString();
                    var textMarkupAnnotation = {
                        type: "Highlight",
                        bounds: [],
                        author: this.model.highlightSettings.author,
                        subject: this.model.highlightSettings.subject,
                        modifiedDate: modifiedDate,
                        colorR: tempColorObject.r,
                        colorG: tempColorObject.g,
                        colorB: tempColorObject.b,
                        colorA: 1 * 255,
                        opacity: this.model.highlightSettings.opacity,
                        note: "",
                        pageNumber: anchorId,
                        isLocked: this.model.highlightSettings.isLocked
                    };
                    for (var i = 0; i < selectionRects.bounds.length; i++) {
                        var pagePosition = this._getPagePosition(anchorId);
                        var bounds = selectionRects.bounds[i];
                        var xPosition = bounds.left - pagePosition.left;
                        var yPosition = bounds.top - pagePosition.top;
                        if (yPosition > this._pageSize[anchorId - 1].PageHeight) {
                            anchorId++;
                            pagePosition = this._getPagePosition(anchorId);
                            var yPosition = bounds.top - pagePosition.top;
                        }
                        var secCanvas = document.getElementById(this._id + "_secondarycanvas_" + anchorId);
                        var secCanvasPosition = secCanvas.getBoundingClientRect();
                        var context = secCanvas.getContext("2d");
                        context.beginPath();
                        yPosition = yPosition - 1.2 * this._zoomVal;
                        context.rect(xPosition, yPosition, bounds.width, bounds.height);
                        context.closePath();
                        context.globalAlpha = 0.5;
                        context.fillStyle = drawColor;
                        context.fill();
                        var annotationBound = {
                            xPosition: xPosition / this._zoomVal,
                            yPosition: yPosition / this._zoomVal,
                            width: bounds.width / this._zoomVal,
                            height: bounds.height / this._zoomVal
                        };
                        textMarkupAnnotation.bounds.push(annotationBound);
                    }
                    this._newAnnotationList[anchorId - 1].push(textMarkupAnnotation);
                    this._totalAnnotations[anchorId].push(JSON.parse(JSON.stringify(textMarkupAnnotation)));
                    var args = new Object();
                    args.annotationSettings = this.model.highlightSettings;
                    args.annotationId = this._totalAnnotations[anchorId].length - 1;
                    args.pageId = anchorId;
                    args.annotationBound = textMarkupAnnotation.bounds;
                    args.annotationType = "Highlight"
                    this._raiseClientEvent("annotationAdd", args);
                    var lastIndex = this._newAnnotationList[anchorId - 1].length - 1;
                    indexes.push(lastIndex);
                    var recentOp = {
                        operation: "AddedHighlight",
                        pageNumber: anchorId,
                        indexes: indexes
                    }
                    this._recentOperation.push(recentOp);
                    this._redoActions = new Array();
                    for (var i = 0; i < this._totalPages; i++) {
                        var newArray = [];
                        this._redoAnnotationCollection[i] = newArray;
                    }
                    this.isDocumentEdited = true;
                    window.getSelection().removeAllRanges();
                }
                if ($('#' + this._id + 'custom-menu'))
                    $('#' + this._id + 'custom-menu').hide();
                this._waterDropletDivHide();
                $('#' + this._id + 'touchcustom-menu').hide();
            }
        },
        _drawAnnotationRect: function (pageIndex, xPosition, yPosition, width, height) {
            var canvas = document.getElementById(this._id + '_secondarycanvas_' + pageIndex);
            if (canvas) {
                var context = canvas.getContext("2d");
                context.beginPath();
                context.setLineDash([4]);
                context.globalAlpha = 1;
                context.rect(xPosition, yPosition, width, height);
                context.closePath();
                context.strokeStyle = "blue";
                context.stroke();
                context.save();
            }
        },

        _drawAnnotSelectRect: function (pageNumber, currentAnnotationRectangle) {
            this._tempCanvas = null;
            this._removeSelector();
            var currentAnnotation = currentAnnotationRectangle[currentAnnotationRectangle.length - 1];
            this._selectedAnnotation = currentAnnotation;
            this._selectedAnnotationObject = new Object();
            this._selectedAnnotationObject.annotation = currentAnnotation;
            this._selectedAnnotationObject.pageIndex = pageNumber;
            var annotDetails = this._getAnnotation(currentAnnotationRectangle, pageNumber);
            if (annotDetails.isExistingAnnotation) {
                var annot = this._textMarkupAnnotationList[pageNumber][annotDetails.currentAnnotationIndex];
                for (var i = 0; i < annot.Bounds.length; i++) {
                    var bound = annot.Bounds[i];
                    this._drawAnnotationRect(pageNumber, this._convertPointToPixel(bound.X) * this._zoomVal, this._convertPointToPixel(bound.Y) * this._zoomVal, this._convertPointToPixel(bound.Width) * this._zoomVal, this._convertPointToPixel(bound.Height) * this._zoomVal);
                }
            } else {
                var annotation = currentAnnotationRectangle[0];
                if (annotation.bounds) {
                    for (var i = 0; i < annotation.bounds.length; i++) {
                        var bound = annotation.bounds[i];
                        this._drawAnnotationRect(pageNumber, (bound.xPosition - 0.5) * this._zoomVal, (bound.yPosition - 0.5) * this._zoomVal,
                            (bound.width + 0.5) * this._zoomVal,
                            (bound.height + 0.5) * this._zoomVal);
                    }
                }
            }
            this._isAnnotationSelected = true;
        },

        _clearRectOnClick: function (pageIndex) {
            var canvas = document.getElementById(this._id + '_secondarycanvas_' + pageIndex);
            if (canvas) {
                var context = canvas.getContext("2d");
                context.setLineDash([]);
                this._renderTextMarkupAnnotation(this._textMarkupAnnotationList[pageIndex], pageIndex);
                this._isAnnotationSelected = false;
                this._selectedAnnotationObject = null;
            }
        },

        _onCanvasMousedown: function (secanvas, pageX, pageY) {
            var targetContext = secanvas.getContext("2d");
            var x = parseInt(pageX - $(secanvas.parentNode).offset().left);
            var y = parseInt(pageY - $(secanvas.parentNode).offset().top);
            var imagedata = targetContext.getImageData(x, y, 1, 1).data;
            this._annotationColor = this._rgb2Color(imagedata[0], imagedata[1], imagedata[2]);
        },

        _showPopupNote: function (e) {
            var noteContent = document.getElementById(this._id + '_note_content');
            var annotation = this._currentAnnotationRectangle[0];
            var note = annotation.Note ? annotation.Note : annotation.note;
            if (note) {
                noteContent.textContent = note;
                var r = annotation.Color ? annotation.Color.R : annotation.colorR;
                var g = annotation.Color ? annotation.Color.G : annotation.colorG;
                var b = annotation.Color ? annotation.Color.B : annotation.colorB;
                var authorContent = document.getElementById(this._id + '_author_content');
                authorContent.style.borderBottom = "1px solid black";
                authorContent.style.fontWeight = "bold";
                var author = annotation.Author ? annotation.Author : annotation.author;
                if (author);
                authorContent.textContent = author;
                noteContent.style.backgroundColor = 'rgb(' + r + ',' + g + ',' + b + ')';
                var noteElement = $('#' + this._id + '_popup_note');
                var position = this._setPopupMenuPosition(e, noteElement);
                noteElement.css({ 'display': 'block', 'background-color': 'rgb(' + r + ',' + g + ',' + b + ')', 'position': 'absolute' });
                noteElement.show();
                noteElement.offset({ top: position.y + 5, left: position.x + 5 }).show();
                noteElement.show();
                noteElement.offset({ top: position.y + 5, left: position.x + 5 }).show();
                noteElement.show();
            }
        },

        _showPopupMenu: function (e) {
            if (!this._isPropertiesWindowOpen) {
                this._isPopupNoteVisible = true;
                $('#' + this._id + '_popup_note').hide();
                document.getElementById(this._id + '_popupinnercontent').innerText = "";
                var highlight = document.getElementById(this._id + "highlight-menu");
                $(highlight).hide();
                this._isContextMenuPresent = false;
                var notesContent = document.getElementById(this._id + "_popupinnercontent");
                $(notesContent).focus();
                notesContent.contentEditable = true;
                var authorName, modifiedDate, note;
                var currentAnnotation = (this._currentAnnotationRectangle.length > 0) ? this._currentAnnotationRectangle : this._currentAnnotationRectangleBackup;
                this._annotationBackupNoteSave = currentAnnotation;
                var annotDetails = this._getAnnotation(currentAnnotation, this._AnnotationPage);
                if (annotDetails.isExistingAnnotation) {
                    var annot = this._textMarkupAnnotationList[this._AnnotationPage][annotDetails.currentAnnotationIndex];
                    authorName = annot.Author;
                    modifiedDate = annot.ModifiedDate;
                    if (annot.Note) {
                        note = annot.Note;
                    }
                } else {
                    for (var j = 0; j < this._currentAnnotations.length; j++) {
                        var annotation = this._currentAnnotations[j];
                        authorName = annotation.author;
                        modifiedDate = annotation.modifiedDate;
                        if (annotation.note) {
                            note = annotation.note;
                        }
                        break;
                    }
                }
                document.getElementById(this._id + '_username').innerText = authorName;
                document.getElementById(this._id + '_currentTime').innerText = modifiedDate;
                if (note) {
                    document.getElementById(this._id + '_popupinnercontent').innerText = note;
                }
                var popupmenu = document.getElementById(this._id + "_popupmenu");
                $(popupmenu).css("z-index", 1000000000);
                var contextMenu = $(popupmenu);
                var pos = this._setPopupMenuPosition(e, contextMenu);
                $(popupmenu).show();
                $(popupmenu).offset({ top: pos.y, left: pos.x }).show();
                $(popupmenu).show();
                $(popupmenu).offset({ top: pos.y, left: pos.x }).show();
                $(popupmenu).show();
            }
        },

        _saveNote: function () {
            var currentAnnotation;
            if (this._annotationBackupNoteSave) {
                currentAnnotation = this._annotationBackupNoteSave;
            } else {
                currentAnnotation = (this._currentAnnotationRectangle.length > 0) ? this._currentAnnotationRectangle : this._currentAnnotationRectangleBackup;
            }
            var date = new Date();
            var annotDetails = this._getAnnotation(currentAnnotation, this._AnnotationPage);
            var popupContent = document.getElementById(this._id + '_popupinnercontent');
            if (annotDetails.isExistingAnnotation) {
                var annot = this._textMarkupAnnotationList[this._AnnotationPage][annotDetails.currentAnnotationIndex];
                if (annot.Note != popupContent.textContent) {
                    var annotationType = annot.TextMarkupAnnotationType;
                    if (annotationType == "Highlight") {
                        annot.ModifiedDate = this.model.highlightSettings.modifiedDate ? this.model.highlightSettings.modifiedDate : date.toLocaleString();
                    } else if (annotationType == "Underline") {
                        annot.ModifiedDate = this.model.underlineSettings.modifiedDate ? this.model.underlineSettings.modifiedDate : date.toLocaleString();
                    } else if (annotationType == "StrikeOut") {
                        annot.ModifiedDate = this.model.strikethroughSettings.modifiedDate ? this.model.strikethroughSettings.modifiedDate : date.toLocaleString();
                    }
                    annot.Note = popupContent.textContent;
                }
            } else {
                for (var j = 0; j < this._currentAnnotations.length; j++) {
                    var annotation = this._currentAnnotations[j];
                    if (annotation.note != popupContent.textContent) {
                        var annotationType = annotation.type;
                        if (annotationType == "Highlight") {
                            annotation.modifiedDate = this.model.highlightSettings.modifiedDate ? this.model.highlightSettings.modifiedDate : date.toLocaleString();
                        } else if (annotationType == "Underline") {
                            annotation.modifiedDate = this.model.underlineSettings.modifiedDate ? this.model.underlineSettings.modifiedDate : date.toLocaleString();
                        } else if (annotationType == "StrikeOut") {
                            annotation.modifiedDate = this.model.strikethroughSettings.modifiedDate ? this.model.strikethroughSettings.modifiedDate : date.toLocaleString();
                        }
                        annotation.note = popupContent.textContent;
                    }
                    break;
                }
            }
            popupContent.innerText = "";
        },

        _setPropertiesWindowLocale: function (localeObj) {
            var appearanceText = localeObj['propertyWindow']['appearance']['contentText'];
            var generalText = localeObj['propertyWindow']['general']['contentText'];
            var colorText = localeObj['propertyWindow']['color']['contentText'];
            var opacityText = localeObj['propertyWindow']['opacity']['contentText'];
            var authorText = localeObj['propertyWindow']['author']['contentText'];
            var subjectText = localeObj['propertyWindow']['subject']['contentText'];
            var modifiedText = localeObj['propertyWindow']['modified']['contentText'];
            var okText = localeObj['propertyWindow']['ok']['contentText'];
            var cancelText = localeObj['propertyWindow']['cancel']['contentText'];
            var lockedText = localeObj['propertyWindow']['locked']['contentText'];
            this._replaceTextLocale($("#" + this._id + "_appearanceli").children("a")[0], appearanceText);
            this._replaceTextLocale($("#" + this._id + "_generalli").children("a")[0], generalText);
            this._replaceTextLocale($("#" + this._id + "_colorspan")[0], colorText);
            this._replaceTextLocale($("#" + this._id + "_opacityspan")[0], opacityText);
            this._replaceTextLocale($("#" + this._id + "_authorspan")[0], authorText);
            this._replaceTextLocale($("#" + this._id + "_subjectspan")[0], subjectText);
            this._replaceTextLocale($("#" + this._id + "_modifiedspan")[0], modifiedText);
            this._replaceTextLocale($("#" + this._id + "_ok")[0], okText);
            this._replaceTextLocale($("#" + this._id + "_cancel")[0], cancelText);
            this._replaceTextLocale($("#" + this._id + "_lockedprop")[0], lockedText);
        },

        _showPropertiesMenu: function (e) {
            this._isPropertiesWindowOpen = true;
            var localeObj = ej.PdfViewer.Locale[this.model.locale] ? ej.PdfViewer.Locale[this.model.locale] : ej.PdfViewer.Locale["default"];
            this._setPropertiesWindowLocale(localeObj);
            var highlight = document.getElementById(this._id + "highlight-menu");
            $(highlight).hide();
            $("#" + this._id + "_generalli").css("display", "");
            $('.e-pdfviewer-lockedcheckbox').css("visibility", "");
            $("#" + this._id + "_lockedprop").css("visibility", "");
            this._isContextMenuPresent = false;
            var tabObject = $("#" + this._id + "_PropertiesDialogTab").data("ejTab");
            tabObject.showItem(0);
            var annotColor, annotOpacity, authorName, subjectName, modifiedDate, isLocked;
            var annotDetails = this._getAnnotation(this._currentAnnotationRectangleBackup, this._AnnotationPage);
            var annotationType;
            if (this._tempCanvas) {
                var checkboxObject = $("#" + this._id + '_lockedcheckbox').data("ejCheckBox");
                checkboxObject.option("checked", false);
                var signatureCanvas = this._tempCanvas;
                var signatureContext = signatureCanvas.getContext("2d");
                var hex = signatureContext.strokeStyle;
                var r1 = parseInt(hex.slice(1, 3), 16),
                    g1 = parseInt(hex.slice(3, 5), 16),
                    b1 = parseInt(hex.slice(5, 7), 16);
                annotColor = { r: r1, g: g1, b: b1 };
                annotOpacity = parseFloat($(signatureCanvas).css("opacity")),
                    annotationType = "Signature";
                $("#" + this._id + "_generalli").css("display", "none");
                $('.e-pdfviewer-lockedcheckbox').css("visibility", "hidden");
                $("#" + this._id + "_lockedprop").css("visibility", "hidden");
                this._hided = true;
            }
            else if (annotDetails.isExistingAnnotation) {
                var annot = this._textMarkupAnnotationList[this._AnnotationPage][annotDetails.currentAnnotationIndex];
                annotColor = { r: annot.Color.R, g: annot.Color.G, b: annot.Color.B };
                annotOpacity = annot.Opacity;
                authorName = annot.Author;
                subjectName = annot.Subject;
                modifiedDate = annot.ModifiedDate;
                isLocked = annot.isLocked;
                annotationType = annot.TextMarkupAnnotationType;
            } else if (this._currentAnnotations.length > 0) {
                for (var j = 0; j < this._currentAnnotations.length; j++) {
                    var annotation = this._currentAnnotations[j];
                    annotColor = { r: annotation.colorR, g: annotation.colorG, b: annotation.colorB };
                    annotOpacity = annotation.opacity;
                    authorName = annotation.author;
                    subjectName = annotation.subject;
                    modifiedDate = annotation.modifiedDate;
                    isLocked = annotation.isLocked;
                    annotationType = annotation.type;
                    break;
                }
            }
            if (annotColor) {
                this._colorpickerObject.option("value", this._rgb2Color(annotColor.r, annotColor.g, annotColor.b));
            }
            var sliderObject = $("#" + this._id + "_slider").data("ejSlider");
            var displayOpacity = parseInt(annotOpacity * 100);
            sliderObject.option("value", displayOpacity);
            $("#" + this._id + "_opacity").val(displayOpacity + "%");
            $('#' + this._id + "_author_input").val(authorName);
            $('#' + this._id + "_subject_input").val(subjectName);
            var spanElement = document.getElementById(this._id + "_modifieddate").childNodes[0];
            spanElement.textContent = modifiedDate;
            $('#' + this._id + "_containerDialogTab").ejDialog({ title: annotationType + " Properties" });
            var headerElement = $("#" + this._id + "_containerDialogTab_title").children("span")[0];
            if (annotationType == "Highlight")
                headerElement.textContent = localeObj['propertyWindow']['highlightProperties']['contentText'];
            else if (annotationType == "StrikeOut")
                headerElement.textContent = localeObj['propertyWindow']['strikeOutProperties']['contentText'];
            else if (annotationType == "Underline")
                headerElement.textContent = localeObj['propertyWindow']['underlineProperties']['contentText'];
            else if (annotationType == "Signature")
                headerElement.textContent = localeObj['propertyWindow']['signatureProperties']['contentText'];
            $('#' + this._id + "_containerDialogTab").ejDialog("open");
            var height = Math.max(0, (($(window).height() - $('#' + this._id + "_containerDialogTab").outerHeight()) / 2) + $(window).scrollTop()) + "px";
            var width = Math.max(0, (($(window).width() - $('#' + this._id + "_containerDialogTab").outerWidth()) / 2) + $(window).scrollLeft()) + "px";
            $('#' + this._id + "_containerDialogTab").ejDialog({ position: { X: width, Y: height } });
            if (isLocked) {
                this._colorpickerObject.option('enabled', false);
                document.getElementById(this._id + "_opacity").disabled = true;
                $('#' + this._id + "_opacity").addClass("e-disable");
                var sliderObject = $("#" + this._id + "_slider").data("ejSlider");
                sliderObject.disable();
                document.getElementById(this._id + "_author_input").disabled = true;
                $('#' + this._id + "_author_input").addClass("e-disable");
                document.getElementById(this._id + "_subject_input").disabled = true;
                $('#' + this._id + "_subject_input").addClass("e-disable");
                var checkboxObject = $("#" + this._id + '_lockedcheckbox').data("ejCheckBox");
                checkboxObject.option("checked", true);
            } else {
                this._colorpickerObject.option('enabled', true);
                document.getElementById(this._id + "_opacity").disabled = false;
                $('#' + this._id + "_opacity").removeClass("e-disable");
                document.getElementById(this._id + "_author_input").disabled = false;
                $('#' + this._id + "_author_input").removeClass("e-disable");
                document.getElementById(this._id + "_subject_input").disabled = false;
                $('#' + this._id + "_subject_input").removeClass("e-disable");
                var sliderObject = $("#" + this._id + "_slider").data("ejSlider");
                sliderObject.enable();
                var checkboxObject = $("#" + this._id + '_lockedcheckbox').data("ejCheckBox");
                checkboxObject.option("checked", false);
            }
        },
        _lockProperties: function () {
            var checkboxObject = $("#" + this._id + '_lockedcheckbox').data("ejCheckBox");
            if (checkboxObject.model.checkState == "check") {
                this._colorpickerObject.option('enabled', false);
                document.getElementById(this._id + "_opacity").disabled = true;
                $('#' + this._id + "_opacity").addClass("e-disable");
                document.getElementById(this._id + "_author_input").disabled = true;
                $('#' + this._id + "_author_input").addClass("e-disable");
                document.getElementById(this._id + "_subject_input").disabled = true;
                $('#' + this._id + "_subject_input").addClass("e-disable");
                var sliderObject = $("#" + this._id + "_slider").data("ejSlider");
                sliderObject.disable();
            } else {
                this._colorpickerObject.option('enabled', true);
                document.getElementById(this._id + "_opacity").disabled = false;
                $('#' + this._id + "_opacity").removeClass("e-disable");
                document.getElementById(this._id + "_author_input").disabled = false;
                $('#' + this._id + "_author_input").removeClass("e-disable");
                document.getElementById(this._id + "_subject_input").disabled = false;
                $('#' + this._id + "_subject_input").removeClass("e-disable");
                var sliderObject = $("#" + this._id + "_slider").data("ejSlider");
                sliderObject.enable();
            }
        },

        _setDrawColor: function (event) {
            if (this._isDefaultColorSet) {
                this._drawColor = this._toolbarColorpickerObject.hexCodeToRGB(event.value);
                document.getElementById(this._id + '_pdfviewer_colorpicker').style.display = 'none';
                this._isToolbarColorPicker = false;
                this._isDefaultColorSet = false;
            }
        },

        _createNote: function () {
            var pageviewcontainer = $('#' + this._id + '_viewerContainer');
            var note = ej.buildTag("div.e-pdfviewer-annotation-note", "", { 'display': 'none' }, { "id": this._id + '_popup_note' });
            var authorcontent = ej.buildTag("div.e-pdfviewer-annotation-authorcontent", "", {}, { "id": this._id + '_author_content' });
            var notecontent = ej.buildTag("div.e-pdfviewer-annotation-notecontent", "", {}, { "id": this._id + '_note_content' });
            note.append(authorcontent);
            note.append(notecontent);
            pageviewcontainer.append(note);
        },

        _createPopupMenu: function () {
            var pageviewcontainer = $('#' + this._id + '_viewerContainer');
            var popupmenu = document.createElement("DIV");
            popupmenu.id = this._id + "_popupmenu";
            popupmenu.className = "e-pdfviewer-popupmenu";
            pageviewcontainer.append(popupmenu);
            var popupHeader = document.createElement("DIV");
            popupHeader.className = "e-pdfviewer-header"
            popupHeader.id = this._id + "_popupheader";
            popupmenu.appendChild(popupHeader);
            var userName = document.createElement("DIV");
            userName.className = "e-pdfviewer-username";
            userName.id = this._id + "_username";
            userName.innerHTML = "Guest";
            popupHeader.appendChild(userName);
            var closeIconContainer = ej.buildTag("div.e-pdfviewer-closepopup", "", {}, { "id": this._id + '_popup_close' });
            var closeIcon = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-closeicon");
            closeIconContainer[0].appendChild(closeIcon[0]);
            popupHeader.appendChild(closeIconContainer[0]);
            var proxy = this;
            $('.e-pdfviewer-closeicon').on("click touchend", function () {
                proxy._saveNote();
                $('.e-pdfviewer-popupmenu').hide();
                proxy._isPopupNoteVisible = false;
            });
            var timeDivContainer = document.createElement("DIV");
            var timeDiv = document.createElement("DIV");
            timeDivContainer.className = "e-pdfviewer-currenttime";
            timeDiv.id = this._id + "_currentTime";
            var d = new Date();
            timeDiv.innerHTML = d.toLocaleString();
            timeDivContainer.appendChild(timeDiv);
            popupmenu.appendChild(timeDivContainer);
            var popupContent = document.createElement("DIV");
            popupContent.className = "e-pdfviewer-content";
            popupContent.id = this._id + "_popupcontent";
            var popupInnerContent = document.createElement("DIV");
            popupInnerContent.className = "e-pdfviewer-innercontent";
            popupInnerContent.id = this._id + "_popupinnercontent";
            popupInnerContent.innerText = " ";
            popupInnerContent.style.width = "366.667px";
            popupInnerContent.style.height = "132.073px";
            popupInnerContent.style.overflow = "hidden";
            popupInnerContent.style.overflowY = "auto";
            popupContent.appendChild(popupInnerContent);
            popupmenu.appendChild(popupContent);
            var popupFooter = document.createElement("DIV");
            popupFooter.className = "e-pdfviewer-footer";
            popupFooter.id = this._id + "_popupfooter";
            popupmenu.appendChild(popupFooter);
            var popupNote = document.getElementById(this._id + "_popupmenu");
            popupInnerContent.addEventListener("paste", function (e) {
                e.preventDefault();
                var text = e.clipboardData.getData("text/plain");
                document.execCommand("insertHTML", false, text);
            });
            this._on($(popupNote), "mousedown touchstart", this._popupNoteMousedown);
            this._on($(popupNote), "mouseup touchend", this._popupNoteMouseup);
            this._on($(window), "touchmove mousemove", this._movePopupNote);
        },
        _popupNoteMousedown: function (e) {
            if (e.type == "touchstart")
                e = e.originalEvent.changedTouches[0];
            if (e.which != 3 || e.type == "touchstart") {
                this._isPopupNoteFocused = true;
                var popupNote = document.getElementById(this._id + "_popupmenu");
                this._xpos = e.clientX - popupNote.offsetLeft;
                this._ypos = e.clientY - popupNote.offsetTop;
            }
        },
        _popupNoteMouseup: function (e) {
            this._enableSelection();
            this._isPopupNoteFocused = false;
        },
        _movePopupNote: function (e) {
            if (e.type == "touchmove")
                e = e.originalEvent.changedTouches[0];
            if (this._isPopupNoteFocused || e.type == "touchmove") {
                var viewer = document.getElementById(this._id + '_viewerContainer');
                var popupNote = document.getElementById(this._id + "_popupmenu");
                this._isContextMenuPresent = true;
                var leftValue = (e.clientX - this._xpos);
                var topValue = (e.clientY - this._ypos);
                var isInPosition = this._calulateCurrentPosition(topValue, popupNote);
                var width = parseFloat($(popupNote).css("width"));
                var height = parseFloat($(popupNote).css("height"));
                if (leftValue > 0 && (leftValue + width) <= viewer.clientWidth)
                    popupNote.style.left = leftValue + 'px';
                if (isInPosition)
                    popupNote.style.top = (topValue) + 'px';
            }
        },
        _calulateCurrentPosition: function (topVal, popupNote) {
            var cummulativeValue;
            var cummulativePageHeight = 5;
            var height = parseFloat($(popupNote).css("height"));
            for (var i = 1; i <= this._totalPages; i++) {
                var pageBottom = this._pageSize[i - 1].PageHeight * this._zoomVal;
                if (i == this._AnnotationPage) {
                    if (topVal > cummulativePageHeight && (topVal + height) < pageBottom + cummulativePageHeight)
                        cummulativeValue = cummulativePageHeight;
                }
                cummulativePageHeight += pageBottom;
            }
            if (cummulativeValue)
                return true;
        },
        _createPropertiesMenu: function (e) {
            var pageviewcontainer = $('#' + this._id + '_pageviewContainer');
            var container = document.createElement("div");
            container.id = this._id + "_containerDialogTab";
            var ejtabContainer = document.createElement("div");
            var ejtab = ej.buildTag("div", "", { "height": "auto" }, { "id": this._id + "_PropertiesDialogTab" });
            var ul = document.createElement("ul");
            ul.innerHTML = "<li id= '" + this._id + "_appearanceli" + "'><a href=" + "#" + this._id + "_apperanceProperties" + ">Appearance</a></li><li id= '" + this._id + "_generalli" + "'><a href=" + "#" + this._id + "_generalProperties" + ">General</a></li>";
            var apperanceProperty = ej.buildTag("div", "", {}, { "id": this._id + "_apperanceProperties" });
            var generalProperty = ej.buildTag("div", "", {}, { "id": this._id + "_generalProperties" });
            ejtabContainer.appendChild(ejtab[0]);
            ejtab[0].appendChild(ul);
            ejtab[0].appendChild(apperanceProperty[0]);
            ejtab[0].appendChild(generalProperty[0]);
            var applyProperties = document.createElement("div");
            applyProperties.style.paddingBottom = "11px";
            var ok = ej.buildTag("button.e-pdfviewer-properties-okbtn", "OK", { "float": "right", "margin-right": "18px" }, { "id": this._id + "_ok", });
            var cancel = ej.buildTag("button.e-pdfviewer-properties-cancelbtn", "Cancel", { "float": "right" }, { "id": this._id + "_cancel", });
            var lockedCheckbox = ej.buildTag("input", "", {}, { 'type': 'checkbox' });
            var lockedContent = document.createElement("label");
            lockedContent.id = this._id + "_lockedprop";
            lockedContent.className = "e-pdfviewer-properties-label";
            lockedContent.style.marginRight = "18px";
            lockedContent.innerHTML = "Locked";
            applyProperties.appendChild(lockedCheckbox[0]);
            applyProperties.appendChild(lockedContent);
            applyProperties.appendChild(cancel[0]);
            applyProperties.appendChild(ok[0]);
            lockedCheckbox.ejCheckBox({ cssClass: 'e-pdfviewer-lockedcheckbox', id: this._id + '_lockedcheckbox', size: ej.CheckboxSize.Small, change: $.proxy(this._lockProperties, this) });
            apperanceProperty[0].style.height = "300px";
            generalProperty[0].style.height = "300px";
            ejtabContainer.appendChild(applyProperties);
            container.appendChild(ejtabContainer);
            pageviewcontainer.append(container);
            ok.ejButton({ showRoundedCorner: true, size: "small" });
            cancel.ejButton({ showRoundedCorner: true, size: "small" });
            $("#" + this._id + "_PropertiesDialogTab").ejTab({});
            var width = this.element.width();
            if (width >= 500)
                $('#' + this._id + "_containerDialogTab").ejDialog({ showOnInit: false, width: "500px", enableResize: false, close: $.proxy(this._closePropertiesWindow, this), backgroundScroll: false, enableModal: true });
            else
                $('#' + this._id + "_containerDialogTab").ejDialog({ showOnInit: false, width: "auto", enableResize: false, close: $.proxy(this._closePropertiesWindow, this), backgroundScroll: false, enableModal: true });
            var table = document.createElement('div');
            var tableRow1 = document.createElement("div");
            tableRow1.className = "e-pdfviewer-color-container";
            table.appendChild(tableRow1);
            var tableData1 = document.createElement("div");
            tableData1.className = "e-pdfviewer-color-span";
            var tableData2 = document.createElement("div");
            tableData2.className = "e-pdfviewer-color-picker";
            tableRow1.appendChild(tableData1);
            tableRow1.appendChild(tableData2);
            var colorSpan = document.createElement("SPAN");
            colorSpan.id = this._id + "_colorspan";
            colorSpan.innerHTML = "Color:";
            tableData1.appendChild(colorSpan);
            var input = document.createElement("input");
            input.type = "text";
            input.id = this._id + "_colorpicker";
            tableData2.appendChild(input);
            var tableRow2 = document.createElement("div");
            tableRow2.className = "e-pdfviewer-opacity-container";
            table.appendChild(tableRow2);
            var tableData3 = document.createElement("div");
            tableData3.className = "e-pdfviewer-opacity-span";
            var tableData4 = document.createElement("div");
            tableData4.className = "e-pdfviewer-opacity-field";
            tableRow2.appendChild(tableData3);
            tableRow2.appendChild(tableData4);
            var opacity = document.createElement("SPAN");
            opacity.id = this._id + "_opacityspan";
            opacity.innerHTML = "Opacity:";
            tableData3.appendChild(opacity);
            var opacityInput = document.createElement("input");
            opacityInput.type = "text";
            opacityInput.id = this._id + "_opacity";
            opacityInput.className = "e-inputchangeval"
            opacityInput.value = "100%"
            opacityInput.style.width = "50px";
            opacityInput.style.height = "20px";
            tableData4.appendChild(opacityInput);
            var sliderData = document.createElement("div");
            sliderData.className = "e-pdfviewer-slider-control";
            sliderData.style.width = "100px";
            tableRow2.appendChild(sliderData);
            var slider = document.createElement("DIV");
            slider.id = this._id + "_slider";
            sliderData.appendChild(slider);
            apperanceProperty.append(table);
            $("#" + this._id + "_colorpicker").ejColorPicker({ modelType: "palette" });
            $("#" + this._id + "_colorpicker").ejColorPicker("hide");
            this._colorpickerObject = $("#" + this._id + "_colorpicker").data("ejColorPicker");
            $("#" + this._id + "_slider").ejSlider({
                cssClass: 'e-pdfviewer-opacity-slider',
                value: 100,
                minValue: 0,
                maxValue: 100,
                incrementStep: 1,
                showRoundedCorner: true,
                change: this._slidervaluechange,
                slide: this._slidervaluechange,
            });
            var generalTable = document.createElement('div');
            generalTable.style.border = "0px";
            var generalTableRow = document.createElement("div");
            generalTableRow.className = "e-pdfviewer-author-container";
            generalTable.appendChild(generalTableRow);
            var authorData = document.createElement("div");
            authorData.className = "e-pdfviewer-author-span";
            generalTableRow.appendChild(authorData);
            var author = document.createElement("SPAN");
            author.id = this._id + "_authorspan";
            author.innerHTML = "Author:";
            authorData.appendChild(author);
            var authorinput = document.createElement("div");
            authorinput.className = "e-pdfviewer-author-inputdiv";
            generalTableRow.appendChild(authorinput);
            var authorinputValue = document.createElement("input");
            authorinputValue.id = this._id + "_author_input";
            authorinputValue.className = "e-pdfviewer-author-input";
            authorinput.appendChild(authorinputValue);
            var generalTableRow2 = document.createElement("div");
            generalTableRow2.className = "e-pdfviewer-subject-container";
            generalTable.appendChild(generalTableRow2);
            var subjectData = document.createElement("div");
            subjectData.className = "e-pdfviewer-subject-span";
            generalTableRow2.appendChild(subjectData);
            var subject = document.createElement("SPAN");
            subject.id = this._id + "_subjectspan";
            subject.innerHTML = "Subject:";
            subjectData.appendChild(subject);
            var subjectinput = document.createElement("div");
            subjectinput.className = "e-pdfviewer-subject-inputdiv";
            generalTableRow2.appendChild(subjectinput);
            var subjectValue = document.createElement("input");
            subjectValue.id = this._id + "_subject_input";
            subjectValue.className = "e-pdfviewer-subject-input";
            subjectinput.appendChild(subjectValue);
            var generalTableRow3 = document.createElement("div");
            generalTableRow3.className = "e-pdfviewer-modifieddate-container";
            generalTableRow3.style.height = "18.67px";
            generalTable.appendChild(generalTableRow3);
            var modifiedlabeldiv = document.createElement("div");
            modifiedlabeldiv.className = "e-pdfviewer-modified-labeldiv";
            var modifiedlabel = document.createElement("SPAN");
            modifiedlabel.id = this._id + "_modifiedspan";
            modifiedlabel.innerHTML = "Modified:";
            modifiedlabeldiv.appendChild(modifiedlabel);
            generalTableRow3.appendChild(modifiedlabeldiv);
            var datelabeldiv = document.createElement("div");
            datelabeldiv.className = "e-pdfviewer-modifieddate-labeldiv";
            datelabeldiv.id = this._id + "_modifieddate";
            var modifieddatelabel = document.createElement("SPAN");
            modifieddatelabel.innerHTML = "";
            datelabeldiv.appendChild(modifieddatelabel);
            generalTableRow3.appendChild(datelabeldiv);

            generalProperty.append(generalTable);
            $("#" + this._id + "_containerDialogTab_title").addClass("e-pdfviewer-propertiestitle");
            $("#" + this._id + "_containerDialogTab").addClass("e-pdfviewer-propertiestab");
            $("#" + this._id + "_PropertiesDialogTab").addClass("e-pdfviewer-innertab");
            $("#" + this._id + "_apperanceProperties").addClass("e-pdfviewer-appearanceprop");
            $("#" + this._id + "_generalProperties").addClass("e-pdfviewer-generalprop");
            $("#" + this._id + "_appearanceli").addClass("e-pdfviewer-tab-li");
            $("#" + this._id + "_generalli").addClass("e-pdfviewer-tab-li");
            $(opacityInput).addClass("e-pdfviewer-elementalignments");
            $(opacityInput).addClass("ejinputtext");
            $(authorinputValue).addClass("e-pdfviewer-elementalignments");
            $(authorinputValue).addClass("ejinputtext");
            $(subjectValue).addClass("e-pdfviewer-elementalignments");
            $(subjectValue).addClass("ejinputtext");
            this._tabObject = $("#" + this._id + "_PropertiesDialogTab").data("ejTab");
            this._on($('#' + this._id + '_ok'), "click", this._applyAnnotationProperties);
            this._on($('#' + this._id + '_cancel'), "click", this._cancelAnnotationProperties);
        },
        _applyAnnotationProperties: function () {
            var tab = this._tabObject;
            var color = this._colorpickerObject.rgb;
            var opacity = parseInt($("#" + this._id + '_opacity').val().split("%")[0]) / 100;
            var authorName = $("#" + this._id + '_author_input').val();
            var subject = $("#" + this._id + '_subject_input').val();
            var annotDetails = this._getAnnotation(this._currentAnnotationRectangleBackup, this._AnnotationPage);
            this._changeAnnotationProperties(color, opacity, authorName, subject, annotDetails.currentAnnotationIndex, this._AnnotationPage, annotDetails.isExistingAnnotation);
            $('#' + this._id + '_containerDialogTab').ejDialog("close");
        },
        _cancelAnnotationProperties: function () {
            $('#' + this._id + '_containerDialogTab').ejDialog("close");
        },
        _getAnnotation: function (currentAnnotationRect, pageIndex) {
            var annotList = this._textMarkupAnnotationList[pageIndex];
            var currentAnnotations = [];
            var currentAnnotationIndex = null;
            var isExistingAnnotation = false;
            for (var a = 0; a < currentAnnotationRect.length; a++) {
                if (annotList) {
                    for (var i = 0; i < annotList.length; i++) {
                        if (currentAnnotationRect[a] == annotList[i]) {
                            currentAnnotations.push(annotList[i]);
                            currentAnnotationIndex = i;
                            isExistingAnnotation = true;
                        }
                    }
                }
            }
            annotList = this._newAnnotationList[pageIndex - 1];
            var currentAnnot;
            for (var a = 0; a < currentAnnotationRect.length; a++) {
                if (annotList) {
                    for (var j = 0; j < annotList.length; j++) {
                        if (currentAnnotationRect[a] == annotList[j]) {
                            currentAnnotations.push(annotList[j]);
                            currentAnnotationIndex = j;
                            isExistingAnnotation = false;
                            currentAnnot = annotList[j];
                        }
                    }
                }
                if (currentAnnotationRect[a] == currentAnnot)
                    break;
            }
            this._currentAnnotations = currentAnnotations;
            return { currentAnnotationIndex: currentAnnotationIndex, isExistingAnnotation: isExistingAnnotation };
        },
        _changeAnnotationProperties: function (color, opacity, author, subject, currentAnnotationIndex, pageIndex, isExistingAnnotation) {
            var secCanvas = document.getElementById(this._id + "_secondarycanvas_" + pageIndex);
            if (secCanvas && !this._tempCanvas) {
                var context = secCanvas.getContext("2d");
                context.clearRect(0, 0, secCanvas.width, secCanvas.height);
                this._selectedAnnotationObject = null;
                var isColorChanged = false;
                var isOpacityChanged = false;
                var annotationType, annotationId;
                var args = new Object();
                var date = new Date();
                this._drawAnnotSelectRect(pageIndex, this._currentAnnotationRectangleBackup);
            }
            if (this._tempCanvas) {
                var opacityChanged = false, colorChanged = false;
                var signatureCanvas = this._tempCanvas;
                var signatureContext = signatureCanvas.getContext("2d");
                var previousstrokeStyle = signatureContext.strokeStyle;
                var previousOpacity = $(signatureCanvas).css("opacity");

                signatureContext.strokeStyle = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
                signatureContext.stroke();
                $(signatureCanvas).css("opacity", opacity);
                if (previousOpacity != opacity) {
                    opacityChanged = true;
                }
                if (previousstrokeStyle != signatureContext.strokeStyle) {
                    colorChanged = true;
                }
                if (opacityChanged || colorChanged) {
                    var args = new Object();
                    args.isColorChange = colorChanged;
                    args.isOpacityChange = opacityChanged;
                    args.signatureID = this._tempCanvas.id;
                    args.currentColor = signatureContext.strokeStyle;
                    args.perviousColor = previousstrokeStyle;
                    args.previousOpacity = previousOpacity;
                    args.currentOpacity = opacity;
                    args.pageId = parseInt(this._tempCanvas.id.split("imagecanvasDraw_")[1].split('_')[0]);
                    this._raiseClientEvent('signaturePropertiesChange', args);
                }
                var recentOp = {
                    operation: "SignatureModifed",
                    pageNumber: this._currentPage,
                    sign: signatureCanvas,
                    newstrokeStyle: signatureContext.strokeStyle,
                    newsopacity: $(signatureCanvas).css("opacity"),
                    previousstrokeStyle: previousstrokeStyle,
                    previousOpacity: previousOpacity,
                }
                var checkboxObject = $("#" + this._id + '_lockedcheckbox').data("ejCheckBox");
                this._recentOperation.push(recentOp);
            }
            else if (isExistingAnnotation) {
                var annot = this._textMarkupAnnotationList[pageIndex][currentAnnotationIndex];
                if (annot.Color.R != color.r || annot.Color.G != color.g || annot.Color.B != color.b || annot.Opacity != opacity || annot.Author != author || annot.Subject != subject) {
                    var annotObject = new Object();
                    annotObject = JSON.parse(JSON.stringify(annot));
                    this._colorModifiedAnnotationList[pageIndex - 1].push(annotObject);
                    if (annot.Color.R != color.r || annot.Color.G != color.g || annot.Color.B != color.b) {
                        isColorChanged = true;
                    } else if (annot.Opacity != opacity) {
                        isOpacityChanged = true;
                    }
                    annot.Color.R = color.r;
                    annot.Color.G = color.g;
                    annot.Color.B = color.b;
                    annot.Color.A = color.a;
                    annot.Opacity = opacity;
                    annot.Author = author;
                    annot.Subject = subject;
                    annotationType = annot.TextMarkupAnnotationType;
                    if (annotationType == "Highlight") {
                        annot.ModifiedDate = this.model.highlightSettings.modifiedDate ? this.model.highlightSettings.modifiedDate : date.toLocaleString();
                    } else if (annotationType == "Underline") {
                        annot.ModifiedDate = this.model.underlineSettings.modifiedDate ? this.model.underlineSettings.modifiedDate : date.toLocaleString();
                    } else if (annotationType == "StrikeOut") {
                        annot.ModifiedDate = this.model.strikethroughSettings.modifiedDate ? this.model.strikethroughSettings.modifiedDate : date.toLocaleString();
                    }
                    annotationId = currentAnnotationIndex;
                    this._totalAnnotations[pageIndex][currentAnnotationIndex] = JSON.parse(JSON.stringify(annot));
                    var colorAnnotObj = new Object();
                    colorAnnotObj.index = currentAnnotationIndex;
                    colorAnnotObj.annotation = annot;
                    colorAnnotObj.action = "propertyChanged";
                    this._existingAnnotationsModified[pageIndex - 1].push(colorAnnotObj);
                    var recentOp = {
                        operation: "propertiesModifiedForExistingAnnot",
                        pageNumber: this._AnnotationPage,
                        indexes: currentAnnotationIndex
                    }
                    this._recentOperation.push(recentOp);
                }
                var checkboxObject = $("#" + this._id + '_lockedcheckbox').data("ejCheckBox");
                if (checkboxObject.model.checkState == "check") {
                    annot.isLocked = true;
                } else {
                    annot.isLocked = false;
                }
            } else {
                var annot = this._newAnnotationList[pageIndex - 1][currentAnnotationIndex];
                if (annot.colorR != color.r || annot.colorG != color.g || annot.colorB != color.b || annot.opacity != opacity || annot.author != author || annot.subject != subject) {
                    var annotObject = new Object();
                    annotObject = JSON.parse(JSON.stringify(annot));
                    this._colorModifiedAnnotationList[pageIndex - 1].push(annotObject);
                    if (annot.colorR != color.r || annot.colorG != color.g || annot.colorB != color.b) {
                        isColorChanged = true;
                    } else if (annot.opacity != opacity) {
                        isOpacityChanged = true;
                    }
                    annot.colorR = color.r;
                    annot.colorG = color.g;
                    annot.colorB = color.b;
                    annot.opacity = opacity;
                    annot.colorA = annot.opacity * 255;
                    annot.author = author;
                    annot.subject = subject;
                    annotationType = annot.type;
                    if (annotationType == "Highlight") {
                        annot.modifiedDate = this.model.highlightSettings.modifiedDate ? this.model.highlightSettings.modifiedDate : date.toLocaleString();
                    } else if (annotationType == "Underline") {
                        annot.modifiedDate = this.model.underlineSettings.modifiedDate ? this.model.underlineSettings.modifiedDate : date.toLocaleString();
                    } else if (annotationType == "StrikeOut") {
                        annot.modifiedDate = this.model.strikethroughSettings.modifiedDate ? this.model.strikethroughSettings.modifiedDate : date.toLocaleString();
                    }
                    if (this._textMarkupAnnotationList[pageIndex])
                        annotationId = this._textMarkupAnnotationList[pageIndex].length + currentAnnotationIndex;
                    else
                        annotationId = currentAnnotationIndex;
                    this._totalAnnotations[pageIndex][annotationId] = JSON.parse(JSON.stringify(annot));
                    var checkboxObject = $("#" + this._id + '_lockedcheckbox').data("ejCheckBox");
                    if (checkboxObject.model.checkState == "check") {
                        annot.isLocked = true;
                    } else {
                        annot.isLocked = false;
                    }
                    var recentOp = {
                        operation: "propertiesModifiedForNewAnnot",
                        pageNumber: this._AnnotationPage,
                        indexes: currentAnnotationIndex
                    }
                    this._recentOperation.push(recentOp);
                }
            }
            if (isColorChanged || isOpacityChanged) {
                args.isColorChanged = isColorChanged;
                args.isOpacityChanged = isOpacityChanged;
                args.annotationType = annotationType;
                args.annotationId = annotationId;
                args.pageId = pageIndex;
                this._raiseClientEvent('annotationPropertiesChange', args);
            }
            this._redoActions = new Array();
            for (var i = 0; i < this._totalPages; i++) {
                var newArray = [];
                this._redoAnnotationCollection[i] = newArray;
            }
            this.isDocumentEdited = true;
            if (!this._tempCanvas) {
                this._renderTextMarkupAnnotation(this._textMarkupAnnotationList[pageIndex], pageIndex);
            }
        },
        _slidervaluechange: function (sender) {
            var values = sender.value;
            var id = this._id.split('_slider')[0];
            $("#" + id + "_opacity").val(values + "%");
        },
        _deleteAnnotation: function () {
            if (this._isAnnotationSelected) {
                var pageAnnotList; var newList = [];
                var args = new Object();
                var annotDetails = this._getAnnotation(this._currentAnnotationRectangleBackup, this._AnnotationPage);
                if (annotDetails.isExistingAnnotation) {
                    pageAnnotList = this._textMarkupAnnotationList[this._AnnotationPage];
                    var annot = pageAnnotList[annotDetails.currentAnnotationIndex];
                    args.annotationType = annot.TextMarkupAnnotationType;
                    this._deletedAnnotationList[this._AnnotationPage - 1].push(annot);
                    var deletedAnnotObj = new Object();
                    deletedAnnotObj.index = annot.Index;
                    args.annotationId = annot.Index;
                    args.pageId = this._AnnotationPage;
                    deletedAnnotObj.annotation = annot;
                    deletedAnnotObj.action = "deleted";
                    this._existingAnnotationsModified[this._AnnotationPage - 1].push(deletedAnnotObj);
                    this._annotationsDeletedNo[this._AnnotationPage - 1] = this._annotationsDeletedNo[this._AnnotationPage - 1] + 1;
                    for (var i = 0; i < pageAnnotList.length; i++) {
                        if (pageAnnotList[i] != annot) {
                            newList.push(pageAnnotList[i]);
                        }
                    }
                    var recentOp = {
                        operation: "existingAnnotationDeleted",
                        pageNumber: this._AnnotationPage,
                        indexes: annotDetails.currentAnnotationIndex
                    }
                    this._recentOperation.push(recentOp);
                    this._textMarkupAnnotationList[this._AnnotationPage] = newList;
                    this._totalAnnotations[this._AnnotationPage].splice(annotDetails.currentAnnotationIndex, 1);
                } else {
                    pageAnnotList = this._newAnnotationList[this._AnnotationPage - 1];
                    var annotation = pageAnnotList[annotDetails.currentAnnotationIndex];
                    args.annotationType = annotation.type;
                    this._deletedAnnotationList[this._AnnotationPage - 1].push(annotation);
                    this._newAnnotationList[this._AnnotationPage - 1].splice(annotDetails.currentAnnotationIndex, 1);
                    var index;
                    if (this._textMarkupAnnotationList[this._AnnotationPage])
                        index = this._textMarkupAnnotationList[this._AnnotationPage].length + annotDetails.currentAnnotationIndex;
                    else
                        index = annotDetails.currentAnnotationIndex;
                    args.annotationId = index;
                    args.pageId = this._AnnotationPage;
                    this._totalAnnotations[this._AnnotationPage].splice(index, 1);
                    var recentOp = {
                        operation: "newAnnotationDeleted",
                        pageNumber: this._AnnotationPage,
                        indexes: annotDetails.currentAnnotationIndex
                    }
                    this._recentOperation.push(recentOp);
                }
                this._redoActions = new Array();
                for (var i = 0; i < this._totalPages; i++) {
                    var newArray = [];
                    this._redoAnnotationCollection[i] = newArray;
                }
                this._raiseClientEvent("annotationRemove", args);
                this.isDocumentEdited = true;
                this._clearRectOnClick(this._AnnotationPage);
                this._isAnnotationSelected = false;
            }
            this._deleteSignatureCanvas();
        },

        _createHighlightContextMenu: function (e) {
            var containerDiv = document.createElement("div");//create a new div
            var pageviewcontainer = $('#' + this._id + '_pageviewContainer');
            containerDiv.id = this._id + "highlight-menu";
            containerDiv.className = "e-pdfviewer-highlight-menu";
            pageviewcontainer.append(containerDiv);
            var orderedList = document.createElement('ol');
            orderedList.className = 'highlightorderedList'
            containerDiv.appendChild(orderedList);
            var searchText = window.getSelection().toString();
            $(orderedList).append("<li class='popupnoteli'><a href='javascript:void(0);' class='popupnote' id = '" + this._id + "_openPopup'>Open Pop-Up Note</a></li>");
            $(orderedList).append("<li class='deleteAnnotationli'><a href='javascript:void(0);' id='" + this._id + "_deleteannot' class='deleteAnnotation'>Delete </a></li>");
            $(orderedList).append("<li class='Propertiesli'><a href='javascript:void(0);' class='Properties' id = '" + this._id + "_propAnnot'>Properties.... </a></li>");
        },

        _setPopupMenuPosition: function (event, element) {
            if ((event.type == "touchstart" && element[0].id == this._id + "_popupmenu") || (event.type == "touchmove" && element[0].id == this._id + "_popup_note")) {
                event = event.originalEvent.changedTouches[0];
            }
            var mousePosition = {};
            var menuPostion = {};
            var menuDimension = {};

            menuDimension.x = element.outerWidth();
            menuDimension.y = element.outerHeight();
            mousePosition.x = event.pageX;
            mousePosition.y = event.pageY;

            if (mousePosition.x + menuDimension.x > $(window).width() + $(window).scrollLeft()) {
                menuPostion.x = mousePosition.x - menuDimension.x;
            } else {
                menuPostion.x = mousePosition.x;
            }

            if (mousePosition.y + menuDimension.y > $(window).height() + $(window).scrollTop()) {
                menuPostion.y = mousePosition.y - menuDimension.y;
            } else {
                menuPostion.y = mousePosition.y;
            }
            if (element[0].id == this._id + "_popupmenu") {
                var viewer = document.getElementById(this._id + '_viewerContainer');
                if (menuPostion.x + menuDimension.x > viewer.clientWidth) {
                    menuPostion.x = menuPostion.x - menuDimension.x / 4;
                }
            }
            return menuPostion;
        },
        _setDeleteContextMenuPostion: function (event) {
            var contextMenu = $("#" + this._id + "custom-menu");
            if (event.type == "touchstart") {
                event = event.originalEvent.changedTouches[0];
            }
            var mousePosition = {};
            var menuPostion = {};
            var menuDimension = {};

            menuDimension.x = contextMenu.outerWidth();
            menuDimension.y = contextMenu.outerHeight();
            mousePosition.x = event.pageX;
            mousePosition.y = event.pageY;

            if (mousePosition.x + menuDimension.x > $(window).width() + $(window).scrollLeft()) {
                menuPostion.x = mousePosition.x - menuDimension.x;
            } else {
                menuPostion.x = mousePosition.x;
            }

            if (mousePosition.y + menuDimension.y > $(window).height() + $(window).scrollTop()) {
                menuPostion.y = mousePosition.y - menuDimension.y;
            } else {
                menuPostion.y = mousePosition.y;
            }
            return menuPostion;
        },
        _setHighLightContextMenuPostion: function (event) {
            var contextMenu = $("#" + this._id + "custom-menu");
            var mousePosition = {};
            var menuPostion = {};
            var menuDimension = {};

            menuDimension.x = contextMenu.outerWidth();
            menuDimension.y = contextMenu.outerHeight();
            mousePosition.x = event.pageX;
            mousePosition.y = event.pageY;

            if (mousePosition.x + menuDimension.x > $(window).width() + $(window).scrollLeft()) {
                menuPostion.x = mousePosition.x - menuDimension.x;
            } else {
                menuPostion.x = mousePosition.x;
            }

            if (mousePosition.y + menuDimension.y > $(window).height() + $(window).scrollTop()) {
                menuPostion.y = mousePosition.y - menuDimension.y;
            } else {
                menuPostion.y = mousePosition.y;
            }
            return menuPostion;
        },

        _onViewerKeypress: function (event) {
            this._moveSignatureArrowKey(event);
            if ((event.ctrlKey && event.which == 90) || event.ctrlKey && event.keyCode == 90) {
                if (!this._isPropertiesWindowOpen)
                    this._undo();
            } else if ((event.ctrlKey && event.which == 89) || event.ctrlKey && event.keyCode == 89) {
                if (!this._isPropertiesWindowOpen)
                    this._redo();
            }
        },

        _undo: function () {
            this._removeSelector();
            var poppedItem = this._recentOperation.pop();
            if (poppedItem) {
                if (poppedItem.operation == "AddedHighlight" || poppedItem.operation == "AddedUnderline" || poppedItem.operation == "AddedStrikeOut") {
                    for (var i = 0; i < poppedItem.indexes.length; i++) {
                        var poppedAnnotation = this._newAnnotationList[poppedItem.pageNumber - 1].pop();
                        this._redoAnnotationCollection[poppedItem.pageNumber - 1].push(poppedAnnotation);
                    }
                    this._redoActions.push(poppedItem);
                } else if (poppedItem.operation == "propertiesModifiedForExistingAnnot" || poppedItem.operation == "propertiesModifiedForNewAnnot") {
                    this._undoModifiedProperty(poppedItem);
                    this._redoActions.push(poppedItem);
                } else if (poppedItem.operation == "existingAnnotationDeleted" || poppedItem.operation == "newAnnotationDeleted") {
                    this._undoDeletedItem(poppedItem);
                    this._redoActions.push(poppedItem);
                }
                else if (poppedItem.operation == "signatureAdded") {
                    this._undoSignatureAdd(poppedItem);
                    this._redoActions.push(poppedItem);
                } else if (poppedItem.operation == "signatureResized") {
                    this._undoSignatureResize(poppedItem);
                    this._redoActions.push(poppedItem);
                } else if (poppedItem.operation == "signatureMoved") {
                    this._undoSignatureMove(poppedItem);
                    this._redoActions.push(poppedItem);
                } else if (poppedItem.operation == "signatureDeleted") {
                    this._undoSignatureDeletion(poppedItem);
                    this._redoActions.push(poppedItem);
                }
                else if (poppedItem.operation == "keyMoved") {
                    this._undoSignatureKeyMoved(poppedItem);
                    this._redoActions.push(poppedItem);
                }
                else if (poppedItem.operation == "SignatureModifed") {
                    this._undoSignatureProperties(poppedItem);
                    this._redoActions.push(poppedItem);
                }
                this._clearRectOnClick(poppedItem.pageNumber);
            }
        },
        _undoSignatureProperties: function (poppedItem) {
            var signatureCanvas = poppedItem.sign;
            var signatureContext = signatureCanvas.getContext("2d");
            signatureContext.strokeStyle = poppedItem.previousstrokeStyle;
            signatureContext.stroke();
            $(signatureCanvas).css("opacity", poppedItem.previousOpacity);
        },
        _undoModifiedProperty: function (poppedItem) {
            if (poppedItem.operation == "propertiesModifiedForExistingAnnot") {
                var annotation = this._textMarkupAnnotationList[poppedItem.pageNumber][poppedItem.indexes];
                var annot = JSON.parse(JSON.stringify(annotation));
                this._redoAnnotationCollection[poppedItem.pageNumber - 1].push(annot);
                var originalItem = this._colorModifiedAnnotationList[poppedItem.pageNumber - 1].pop();
                annotation.Color.R = originalItem.Color.R;
                annotation.Color.G = originalItem.Color.G;
                annotation.Color.B = originalItem.Color.B;
                annotation.Opacity = originalItem.Opacity;
                this._existingAnnotationsModified[poppedItem.pageNumber - 1].pop();
            } else {
                var annotation = this._newAnnotationList[poppedItem.pageNumber - 1][poppedItem.indexes];
                var annot = JSON.parse(JSON.stringify(annotation));
                this._redoAnnotationCollection[poppedItem.pageNumber - 1].push(annot);
                var originalItem = this._colorModifiedAnnotationList[poppedItem.pageNumber - 1].pop();
                annotation.colorR = originalItem.colorR;
                annotation.colorG = originalItem.colorG;
                annotation.colorB = originalItem.colorB;
                annotation.opacity = originalItem.opacity;
                annotation.colorA = originalItem.colorA;
            }
        },

        _undoDeletedItem: function (poppedItem) {
            if (poppedItem.operation == "existingAnnotationDeleted") {
                var annotation = this._deletedAnnotationList[poppedItem.pageNumber - 1].pop();
                this._textMarkupAnnotationList[poppedItem.pageNumber].splice(poppedItem.indexes, 0, annotation);
                this._totalAnnotations[poppedItem.pageNumber].splice(poppedItem.indexes, 0, annotation);
                this._existingAnnotationsModified[poppedItem.pageNumber - 1].pop();
            } else {
                var annotation = this._deletedAnnotationList[poppedItem.pageNumber - 1].pop();
                var newList = this._newAnnotationList[poppedItem.pageNumber - 1].splice(poppedItem.indexes, 0, annotation);
                var index;
                if (this._textMarkupAnnotationList[poppedItem.pageNumber])
                    index = this._textMarkupAnnotationList[poppedItem.pageNumber].length + poppedItem.indexes;
                else
                    index = poppedItem.indexes;
                this._totalAnnotations[poppedItem.pageNumber].splice(index, 0, annotation);
            }
        },
        _undoSignatureAdd: function (poppedItem) {
            var canvas = poppedItem.signCanvas;
            $(canvas).remove();
        },

        _undoSignatureDeletion: function (poppedItem) {
            var canvas = poppedItem.signCanvas;
            var pageDiv = document.getElementById(this._id + 'pageDiv_' + poppedItem.pageNumber);
            pageDiv.appendChild(canvas);
        },
        _undoSignatureMove: function (poppedItem) {
            var canvas = poppedItem.signCanvas;
            if (poppedItem.initialCoordinates) {
                canvas.style.left = poppedItem.initialCoordinates.left + 'px';
                canvas.style.top = poppedItem.initialCoordinates.top + 'px';
            }
        },
        _undoSignatureKeyMoved: function (poppedItem) {
            var canvas = poppedItem.signCanvas;
            if (poppedItem.keyinitialCoordinates) {
                canvas.style.left = poppedItem.keyinitialCoordinates.left + 'px';
                canvas.style.top = poppedItem.keyinitialCoordinates.top + 'px';
            }
        },
        _undoSignatureResize: function (poppedItem) {
            var canvas = poppedItem.signCanvas;
            if (poppedItem.initialSize) {
                canvas.style.height = poppedItem.initialSize.height + 'px';
                canvas.style.width = poppedItem.initialSize.width + 'px';
            }
        },
        _redo: function () {
            this._removeSelector();
            var poppedItem = this._redoActions.pop();
            if (poppedItem) {
                this._recentOperation.push(poppedItem);
                if (poppedItem.operation == "AddedHighlight" || poppedItem.operation == "AddedUnderline" || poppedItem.operation == "AddedStrikeOut") {
                    for (var i = 0; i < poppedItem.indexes.length; i++) {
                        var poppedAnnotation = this._redoAnnotationCollection[poppedItem.pageNumber - 1].pop();
                        this._newAnnotationList[poppedItem.pageNumber - 1].push(poppedAnnotation);
                    }
                } else if (poppedItem.operation == "propertiesModifiedForExistingAnnot" || poppedItem.operation == "propertiesModifiedForNewAnnot") {
                    this._redoModifiedProperty(poppedItem);
                } else if (poppedItem.operation == "existingAnnotationDeleted" || poppedItem.operation == "newAnnotationDeleted") {
                    this._redoDeletedItem(poppedItem);
                }
                else if (poppedItem.operation == "signatureAdded") {
                    this._redoSignatureAdd(poppedItem);
                } else if (poppedItem.operation == "signatureResized") {
                    this._redoSignatureResize(poppedItem);
                } else if (poppedItem.operation == "signatureMoved") {
                    this._redoSignatureMove(poppedItem);
                } else if (poppedItem.operation == "signatureDeleted") {
                    this._redoSignatureDelete(poppedItem);
                }
                else if (poppedItem.operation == "keyMoved") {
                    this._redoSignatureKeyMoved(poppedItem);
                }
                else if (poppedItem.operation == "SignatureModifed") {
                    this._redoSignatureProperties(poppedItem);
                }
                this._clearRectOnClick(poppedItem.pageNumber);
            }
        },
        _redoSignatureProperties: function (poppedItem) {
            var signatureCanvas = poppedItem.sign;
            var signatureContext = signatureCanvas.getContext("2d");
            signatureContext.strokeStyle = poppedItem.newstrokeStyle;
            signatureContext.stroke();
            $(signatureCanvas).css("opacity", poppedItem.newsopacity);
        },
        _redoModifiedProperty: function (poppedItem) {
            if (poppedItem.operation == "propertiesModifiedForExistingAnnot") {
                var annotation = this._textMarkupAnnotationList[poppedItem.pageNumber][poppedItem.indexes];
                var annot = JSON.parse(JSON.stringify(annotation));
                var originalItem = this._redoAnnotationCollection[poppedItem.pageNumber - 1].pop();
                this._colorModifiedAnnotationList[poppedItem.pageNumber - 1].push(annot);
                annotation.Color.R = originalItem.Color.R;
                annotation.Color.G = originalItem.Color.G;
                annotation.Color.B = originalItem.Color.B;
                annotation.Opacity = originalItem.Opacity;
                var colorAnnotObj = new Object();
                colorAnnotObj.index = poppedItem.indexes;
                colorAnnotObj.annotation = annotation;
                colorAnnotObj.action = "propertyChanged";
                this._existingAnnotationsModified[poppedItem.pageNumber - 1].push(colorAnnotObj);
            } else {
                var annotation = this._newAnnotationList[poppedItem.pageNumber - 1][poppedItem.indexes];
                var annot = JSON.parse(JSON.stringify(annotation));
                var originalItem = this._redoAnnotationCollection[poppedItem.pageNumber - 1].pop();
                this._colorModifiedAnnotationList[poppedItem.pageNumber - 1].push(annot);
                annotation.colorR = originalItem.colorR;
                annotation.colorG = originalItem.colorG;
                annotation.colorB = originalItem.colorB;
                annotation.opacity = originalItem.opacity;
                annotation.colorA = originalItem.colorA;
            }
        },

        _redoDeletedItem: function (poppedItem) {
            if (poppedItem.operation == "existingAnnotationDeleted") {
                var pageAnnotList = this._textMarkupAnnotationList[poppedItem.pageNumber];
                var annotation = pageAnnotList[poppedItem.indexes];
                this._deletedAnnotationList[poppedItem.pageNumber - 1].push(annotation);
                this._textMarkupAnnotationList[poppedItem.pageNumber].splice(poppedItem.indexes, 1);
                this._totalAnnotations[poppedItem.pageNumber].splice(poppedItem.indexes, 1);
            } else {
                var pageAnnotList = this._newAnnotationList[poppedItem.pageNumber - 1];
                var annotation = pageAnnotList[poppedItem.indexes];
                this._deletedAnnotationList[poppedItem.pageNumber - 1].push(annotation);
                this._newAnnotationList[poppedItem.pageNumber - 1].splice(poppedItem.indexes, 1);
                var index;
                if (this._textMarkupAnnotationList[poppedItem.pageNumber])
                    index = this._textMarkupAnnotationList[poppedItem.pageNumber].length + poppedItem.indexes;
                else
                    index = poppedItem.indexes;
                this._totalAnnotations[poppedItem.pageNumber].splice(index, 1);
            }
        },
        _redoSignatureAdd: function (poppedItem) {
            var canvas = poppedItem.signCanvas;
            var pageDiv = document.getElementById(this._id + 'pageDiv_' + poppedItem.pageNumber);
            pageDiv.appendChild(canvas);
        },

        _redoSignatureDelete: function (poppedItem) {
            var canvas = poppedItem.signCanvas;
            $(canvas).remove();
        },

        _redoSignatureMove: function (poppedItem) {
            var canvas = poppedItem.signCanvas;
            if (poppedItem.Coordinates) {
                canvas.style.left = poppedItem.Coordinates.left + 'px';
                canvas.style.top = poppedItem.Coordinates.top + 'px';
            }
        },
        _redoSignatureKeyMoved: function (poppedItem) {
            var canvas = poppedItem.signCanvas;
            if (poppedItem.Coordinates) {
                canvas.style.left = poppedItem.Coordinates.left + 'px';
                canvas.style.top = poppedItem.Coordinates.top + 'px';
            }
        },
        _redoSignatureResize: function (poppedItem) {
            var canvas = poppedItem.signCanvas;
            if (poppedItem.size) {
                canvas.style.height = poppedItem.size.height;
                canvas.style.width = poppedItem.size.width;
            }
        },
        _displayColorPicker: function (type) {
            var colorPicker = document.getElementById(this._id + '_pdfviewer_colorpicker');
            if ($(colorPicker).css('display') == 'none' && !this._isToolbarColorPicker) {
                colorPicker.style.display = 'block';
                this._isToolbarColorPicker = true;
                if (this._colorPickerStatus != type) {
                    this._drawColor = null;
                    if (type == "Highlight")
                        this._toolbarColorpickerObject.option("value", this.model.highlightSettings.color);
                    else if (type == "Underline")
                        this._toolbarColorpickerObject.option("value", this.model.underlineSettings.color);
                    else if (type == "StrikeOut")
                        this._toolbarColorpickerObject.option("value", this.model.strikethroughSettings.color);
                }
                this._colorPickerStatus = type;
                this._isDefaultColorSet = true;
            } else {
                if (this._colorPickerStatus == type) {
                    colorPicker.style.display = 'none';
                    this._isToolbarColorPicker = false;
                } else {
                    if (type == "Highlight")
                        this._toolbarColorpickerObject.option("value", this.model.highlightSettings.color);
                    else if (type == "Underline")
                        this._toolbarColorpickerObject.option("value", this.model.underlineSettings.color);
                    else if (type == "StrikeOut")
                        this._toolbarColorpickerObject.option("value", this.model.strikethroughSettings.color);
                    this._colorPickerStatus = type;
                    this._isDefaultColorSet = true;
                }
            }
        },

        _setPickerPosition: function (liItem) {
            var toolbar = $('#' + this._id + '_toolbarContainer');
            this._toolbarColorpickerObject.refresh();
            var colorPicker = document.getElementById(this._id + '_pdfviewer_colorpicker');
            var pickerPosition = colorPicker.getBoundingClientRect();
            if ($('#' + this._id + '_pdfviewer_textmarkupul').parent()[0] == toolbar[0]) {
                colorPicker.style.top = "0px";
                colorPicker.style.left = (liItem.parentNode.offsetLeft + liItem.offsetLeft - toolbar[0].offsetLeft - pickerPosition.width + liItem.clientWidth) + 'px';
            } else {
                var secondaryToolbar = document.getElementById(this._id + '_toolbarContainer_hiddenlist');
                secondaryToolbarPosition = secondaryToolbar.getBoundingClientRect();
                var btnLiPosition = document.getElementById(this._id + '_pdfviewer_textmarkupul').getBoundingClientRect();
                colorPicker.style.top = secondaryToolbarPosition.bottom - btnLiPosition.bottom + "px";
                colorPicker.style.left = (liItem.parentNode.parentNode.offsetLeft - toolbar[0].offsetLeft + liItem.offsetLeft - pickerPosition.width + liItem.clientWidth) + 'px';
            }
        },
        _showSignatureButtons: function (show) {
            if (show) {
                $('#' + this._id + '_pdfviewer_signatureul').css("display", "block");
                $('#' + this._id + '_pdfviewer_textmarkupul').addClass('e-separator');
                this._isSignatureHidden = false;
            }
            else {
                $('#' + this._id + '_pdfviewer_signatureul').css("display", "none");
                $('#' + this._id + '_pdfviewer_textmarkupul').removeClass('e-separator');
                this._isSignatureHidden = true;
            }
        },
        _showTextMarkupButtons: function (show) {
            if (show) {
                $('#' + this._id + '_pdfviewer_textmarkupul').css("display", "block");
                $('#' + this._id + '_pdfviewer_zoomul').addClass('e-separator');
            }
            else {
                $('#' + this._id + '_pdfviewer_textmarkupul').css("display", "none");
                $('#' + this._id + '_pdfviewer_zoomul').removeClass('e-separator');
                $('#' + this._id + '_pdfviewer_colorpicker').css("display", "none");
                this._isToolbarColorPicker = false;
            }
        },

        //-------------------------------Text Markup Annotation [end] ---------------------------//
        //-------------------- Toolbar Actions[Start] -------------------------//
        _wireEvents: function () {
            var is_chrome = navigator.userAgent.indexOf('Chrome') != -1;
            var is_firefox = navigator.userAgent.indexOf('Firefox') != -1;
            var is_safari = navigator.userAgent.indexOf("Safari") != -1;
            var is_ie = navigator.userAgent.indexOf("MSIE") != -1 || !!document.documentMode == true;
            var is_edge = navigator.userAgent.indexOf("Edge") != -1;
            var is_edgeNew = document.documentMode || /Edge/.test(navigator.userAgent);
            var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            var proxy = this;

            if (!this.model.toolbarSettings.templateId) {
                this._on($('#' + this._id + '_txtpageNo'), "keypress", this._allowOnlyNumbers);
                this._on($('#' + this._id + '_txtpageNo'), "keypress", this._onkeyPress);
                this._on($('#' + this._id + '_txtpageNo'), "click ", this._onToolbarItemClick);
                this._on($('#' + this._id + '_zoomSelection'), "change", this._zoomValChange);
                this._on($('#' + this._id + '_toolbar_zoomSelection_container'), "click ", this._onToolbarItemClick);
                this._on($('#' + this._id + '_toolbarContainer'), "mousedown", this._onToolBarContainerMouseDown);
                this._on($('.e-pdfviewer-ejdropdownlist'), "mousedown", this._onToolBarContainerMouseDown);
                this._on($('#' + this._id + '_viewerContainer'), "mousewheel", this._onContainerScroll);
                if (document.documentMode || is_ie) {
                    this._on($('#' + this._id + '_viewerContainer'), "keydown", this._onTextKeyboardCopy);
                    this._on($('#' + this._id + '_viewerContainer'), "dblclick", this._selectingTextOnDblClick);
                    this._on($('#' + this._id + '_viewerContainer'), "click", this._selectingTextOnClick);
                }
                else if (!is_edgeNew) {
                    if (is_firefox) {
                        this._on($('#' + this._id + '_viewerContainer'), "keydown", this._onTextKeyboardCopy);
                        this._on($('#' + this._id + '_viewerContainer'), "touchstart", this._onTextContainerTouch);
                        this._on($('#' + this._id + '_viewerContainer'), "touchmove", this._onTextContainerTouchMove);
                        this._on($('#' + this._id + '_viewerContainer'), "touchend", this._onTextContainerTouchEnd);
                    }
                    else if (is_chrome || isMobile) {
                        this._on($('#' + this._id + '_viewerContainer'), "touchstart", this._onTextContainerTouch);
                        this._on($('#' + this._id + '_viewerContainer'), "touchmove", this._onTextContainerTouchMove);
                        this._on($('#' + this._id + '_viewerContainer'), "touchend", this._onTextContainerTouchEnd);
                    }
                    this._on($('#' + this._id + '_viewerContainer'), "mouseleave", this._onTextContainerMouseLeave);
                    this._on($('#' + this._id + '_viewerContainer'), "mouseenter", this._onTextContainerMouseEnter);
                    this._on($('#' + this._id + '_viewerContainer'), "mouseover", this._onTextContainerMouseIn);
                    this._on($('#' + this._id + '_viewerContainer'), "dragstart", this._onTextContainerDragStart);
                }
                if (is_chrome || is_firefox || is_ie || is_edge || is_edgeNew || isMobile) {
                    this._on($('#' + this._id + '_viewerContainer'), "mouseup", this._onTextContainerMouseUp);
                    this._on($('#' + this._id + '_viewerContainer'), "mousemove", this._onTextContainerMouseMove);
                    this._on($('#' + this._id + '_viewerContainer'), "mousedown", this._onTextContainerMouseDown);
                    this._on($('#' + this._id + '_pageviewContainer'), "click touchstart", "a.copy", this._copySelectedText);
                    this._on($('#' + this._id + '_pageviewContainer'), "click touchstart", "a.googleSearch", this._openInNewTab);
                    this._on($('#' + this._id + '_pageviewContainer'), "click touchstart", "a.e-highlight-text", this._drawHighlightAnnotation);
                    this._on($('#' + this._id + '_pageviewContainer'), "click touchstart", "a.e-strikeout-text", this._drawStrikeOutAnnotation);
                    this._on($('#' + this._id + '_pageviewContainer'), "click touchstart", "a.deleteAnnotation", this._deleteAnnotation);
                    this._on($('#' + this._id + '_pageviewContainer'), "click touchstart", "a.popupnote", this._showPopupMenu);
                    this._on($('#' + this._id + '_pageviewContainer'), "click touchstart", "a.Properties", this._showPropertiesMenu);
                    this._on($('#' + this._id + '_pageviewContainer'), "contextmenu", this._onTextContainerMouseUp);
                    this._on($('#' + this._id + '_viewerContainer'), "click", this._onTextContainerclick);
                }
                else if (is_safari) {
                    this._on($('#' + this._id + '_viewerContainer'), "mouseup", this._onTextContainerMouseUp);
                    this._on($('#' + this._id + '_viewerContainer'), "mousemove", this._onTextContainerMouseMove);
                    this._on($('#' + this._id + '_viewerContainer'), "mousedown", this._onTextContainerMouseDown);
                }
            }
            $(window).on("keydown", function (e) {
                proxy._onViewerKeypress(e);
                if (e.ctrlKey && (e.keyCode == 65 || e.keyCode == 97)) {
                    e.preventDefault();
                } else if (e.keyCode == 46) {
                    if (proxy._currentAnnotationRectangleBackup.length != 0 && !proxy._isPropertiesWindowOpen && !proxy._isPopupNoteVisible) {
                        proxy._deleteAnnotation();
                        $("#" + proxy._id + "_popupmenu").hide();
                        proxy._isPopupNoteVisible = false;
                    }
                }
            });
            var viewer = document.getElementById(this._id + '_viewerContainer');
            $('#' + this._id + '_viewerContainer').css({ 'touch-action': 'pan-x pan-y' });
            $('#' + this._id + '_pdfviewerContainer').css({ 'touch-action': 'pan-x pan-y', 'position': 'relative' });
            if (navigator.userAgent.match("Firefox") || navigator.userAgent.match("Chrome")) {
                if (viewer) {
                    viewer.addEventListener('touchstart', this._touchStart);
                    viewer.addEventListener('touchmove', this._touchMove);
                    viewer.addEventListener('touchleave', this._touchEnd);
                    viewer.addEventListener('touchend', this._touchEnd);
                    viewer.addEventListener('touchcancel', this._touchEnd);
                }
            }
            //Wire search events
            this._on($('#' + this._id + '_pdfviewer_searchinput'), 'input', this._textSearch);
            this._on($('#' + this._id + '_pdfviewer_searchinput'), 'keypress', this._searchKeypressHandler);
            this._on($('#' + this._id + '_pdfviewer_previous_search'), 'click', this._prevSearch);
            this._on($('#' + this._id + '_pdfviewer_next_search'), 'click', this._nextSearch);
            this._on($('#' + this._id + '_pdfviewer_close_search'), "click ", this._displaySearchBox);
            //Wire search events
            this._on($('#' + this._id + '_viewerContainer'), 'pointerdown', this._pointerdown);
            this._on($('#' + this._id + '_viewerContainer'), 'pointermove', this._pointermove);
            this._on($('#' + this._id + '_viewerContainer'), 'pointerup', this._pointerup);
            this._on($('#' + this._id + '_viewerContainer'), 'pointerleave', this._pointerup);
            this._on($('#' + this._id + '_toolbarContainer li,#' + this._id + '_toolbarContainer .e-pdfviewer-ejdropdownlist,#' + this._id + '_toolbarContainer .e-pdfviewer-tbpage'), "mouseover", this._showIconToolTip);
            this._on($('#' + this._id + '_toolbarContainer li,#' + this._id + '_toolbarContainer .e-pdfviewer-ejdropdownlist,#' + this._id + '_toolbarContainer .e-pdfviewer-tbpage'), "mouseout", this._hideIconToolTip);
            this._on($('#' + this._id + '_pdfviewer_findlabel, #' + this._id + '_pdfviewer_matchlabel'), 'mouseover', this._showLocalizationTooltip);
            this._on($('#' + this._id + '_pdfviewer_findlabel, #' + this._id + '_pdfviewer_matchlabel'), 'mouseout', this._hideLocalizationTooltip);
            this._on($('.e-pdfviewer-toolbarli-label'), 'mousedown', this._preventClick);
            this._on($(window), 'mousedown', this._windowMaintainSelection);
            this._on($(window), 'dblclick', this._windowMaintainSelectionOnDblclick);
            this._on($(window), 'mousemove', this._windowMaintainSelectionOnMousemove);
            this._on($(window), "touchstart", this._windowOnTextContainerTouch);
        },

        _unwireEvents: function () {
            var is_chrome = navigator.userAgent.indexOf('Chrome') != -1;
            var is_firefox = navigator.userAgent.indexOf('Firefox') != -1;
            var is_safari = navigator.userAgent.indexOf("Safari") != -1;
            var is_ie = navigator.userAgent.indexOf("MSIE") != -1 || !!document.documentMode == true;
            var is_edge = navigator.userAgent.indexOf("Edge") != -1;
            var is_edgeNew = document.documentMode || /Edge/.test(navigator.userAgent);
            if (!this.model.toolbarSettings.templateId) {
                this._on($('#' + this._id + '_txtpageNo'), "keypress", this._allowOnlyNumbers);
                this._off($('#' + this._id + '_txtpageNo'), "keypress", this._onkeyPress);
                this._off($('#' + this._id + '_txtpageNo'), "click ", this._onToolbarItemClick);
                this._off($('#' + this._id + '_zoomSelection'), "change", this._zoomValChange);
                this._off($('#' + this._id + '_toolbar_zoomSelection_container'), "click ", this._onToolbarItemClick);
                this._off($('#' + this._id + '_viewerContainer'), "mousewheel", this._onContainerScroll);
                this._off($(window), "keypress", this._onViewerKeypress);
            }

            var viewer = document.getElementById(this._id + '_viewerContainer');
            if (document.documentMode || is_edge || is_ie || is_edgeNew) {
                this._off($('#' + this._id + '_viewerContainer'), "keydown", this._onTextKeyboardCopy);
                this._off($('#' + this._id + '_viewerContainer'), "dblclick", this._selectingTextOnDblClick);
                this._off($('#' + this._id + '_viewerContainer'), "click", this._selectingTextOnClick);
            }
            else {
                if (is_firefox)
                    this._off($('#' + this._id + '_viewerContainer'), "keydown", this._onTextKeyboardCopy);
                this._off($('#' + this._id + '_viewerContainer'), "mousemove", this._onTextContainerMouseMove);
                this._off($('#' + this._id + '_viewerContainer'), "mousedown", this._onTextContainerMouseDown);
                this._off($('#' + this._id + '_viewerContainer'), "mouseleave", this._onTextContainerMouseLeave);
                this._off($('#' + this._id + '_viewerContainer'), "mouseover", this._onTextContainerMouseIn);
                this._off($('#' + this._id + '_viewerContainer'), "touchstart", this._onTextContainerTouch);
                this._off($('#' + this._id + '_viewerContainer'), "touchend", this._onTextContainerTouchEnd);
                this._off($('#' + this._id + '_viewerContainer'), "touchmove", this._onTextContainerTouchMove);
                this._off($('#' + this._id + '_viewerContainer'), "dragstart", this._onTextContainerDragStart);
                this._off($('#' + this._id + '_viewerContainer'), "click", this._onTextContainerclick);
            }
            if (is_chrome || is_firefox || is_ie || is_edgeNew || is_edge) {
                this._off($('#' + this._id + '_viewerContainer'), "mouseup", this._onTextContainerMouseUp);
                this._off($('#' + this._id + '_pageviewContainer'), "click", "a.copy", this._copySelectedText);
                this._off($('#' + this._id + '_pageviewContainer'), "click", "a.googleSearch", this._openInNewTab);
                this._off($('#' + this._id + '_pageviewContainer'), "contextmenu", this._onTextContainerMouseUp);
            }
            if (navigator.userAgent.match("Firefox") || navigator.userAgent.match("Chrome")) {
                viewer.removeEventListener('touchstart', this._touchStart);
                viewer.removeEventListener('touchmove', this._touchMove);
                viewer.removeEventListener('touchleave', this._touchEnd);
                viewer.removeEventListener('touchend', this._touchEnd);
                viewer.removeEventListener('touchcancel', this._touchEnd);
            }
            this._off($('#' + this._id + '_viewerContainer'), 'pointerdown', this._pointerdown);
            this._off($('#' + this._id + '_viewerContainer'), 'pointermove', this._pointermove);
            this._off($('#' + this._id + '_viewerContainer'), 'pointerup', this._pointerup);
            this._off($('#' + this._id + '_viewerContainer'), 'pointerleave', this._pointerup);
            //Unwire search events
            this._off($('#' + this._id + '_pdfviewer_searchinput'), 'input', this._textSearch);
            this._off($('#' + this._id + '_pdfviewer_searchinput'), 'keypress', this._searchKeypressHandler);
            this._off($('#' + this._id + '_pdfviewer_previous_search'), 'click', this._prevSearch);
            this._off($('#' + this._id + '_pdfviewer_next_search'), 'click', this._nextSearch);
            this._off($('#' + this._id + '_pdfviewer_close_search'), "click ", this._displaySearchBox);
            //Unwire search events
            this._off($('#' + this._id + '_toolbarContainer li,#' + this._id + '_toolbarContainer .e-pdfviewer-ejdropdownlist,#' + this._id + '_toolbarContainer .e-pdfviewer-tbpage'), "mouseover", this._showIconToolTip);
            this._off($('#' + this._id + '_toolbarContainer li,#' + this._id + '_toolbarContainer .e-pdfviewer-ejdropdownlist,#' + this._id + '_toolbarContainer .e-pdfviewer-tbpage'), "mouseout", this._hideIconToolTip);
            this._off($('#' + this._id + '_pdfviewer_findlabel, #' + this._id + '_pdfviewer_matchlabel'), 'mouseover', this._showLocalizationTooltip);
            this._off($('#' + this._id + '_pdfviewer_findlabel, #' + this._id + '_pdfviewer_matchlabel'), 'mouseout', this._hideLocalizationTooltip);
            this._off($('.e-pdfviewer-toolbarli-label'), 'mousedown', this._preventClick);
            this._off($(window), 'mousedown', this._windowMaintainSelection);
            this._off($(window), 'dblclick', this._windowMaintainSelectionOnDblclick);
            this._off($(window), 'mousemove', this._windowMaintainSelectionOnMousemove);
            this._off($(window), "touchstart", this._windowOnTextContainerTouch);
            this._off($(window), "resize", this._viewerResize);
        },
        _windowMaintainSelection: function (event) {
            if (!$(event.target).parents().hasClass("e-pdfviewer")) {
                var selection = window.getSelection();
                this._selectionNodes = selection;
                var range = document.createRange();
                var anchorpageId, focuspageId, anchorOffsetDiv, focusOffsetDiv, anchorOffset, focusOffset;
                if ($(selection.anchorNode).parent().hasClass('e-pdfviewer-textLayer') && $(selection.focusNode).parent().hasClass('e-pdfviewer-textLayer') || $(selection.anchorNode).hasClass('e-pdfviewer-textLayer') && $(selection.focusNode).hasClass('e-pdfviewer-textLayer')) {
                    var position = selection.anchorNode.compareDocumentPosition(selection.focusNode)
                    var backward = false;
                    this._selectionObject = new Object();
                    this._selectionObject.isBackward = false;
                    if (!position && selection.anchorOffset > selection.focusOffset ||
                        position === Node.DOCUMENT_POSITION_PRECEDING)
                        backward = true;
                    if (backward) {
                        this._selectionObject.isBackward = backward;
                        this._selectionObject.anchorOffset = selection.focusOffset;
                        this._selectionObject.focusOffset = selection.anchorOffset;
                        range.setStart(selection.focusNode, selection.focusOffset);
                        range.setEnd(selection.anchorNode, selection.anchorOffset);
                        anchorpageId = parseInt(selection.focusNode.parentNode.id.split("text_")[1]);
                        focuspageId = parseInt(selection.anchorNode.parentNode.id.split("text_")[1]);
                        anchorOffsetDiv = parseInt(selection.focusNode.parentNode.id.split("text_")[1].split('_')[1]);
                        focusOffsetDiv = parseInt(selection.anchorNode.parentNode.id.split("text_")[1].split('_')[1]);
                        anchorOffset = selection.focusOffset;
                        focusOffset = selection.anchorOffset;
                    }
                    else {
                        this._selectionObject.anchorOffset = selection.anchorOffset;
                        this._selectionObject.focusOffset = selection.focusOffset;
                        range.setStart(selection.anchorNode, selection.anchorOffset);
                        range.setEnd(selection.focusNode, selection.focusOffset);
                        anchorpageId = parseInt(selection.anchorNode.parentNode.id.split("text_")[1]);
                        focuspageId = parseInt(selection.focusNode.parentNode.id.split("text_")[1]);
                        anchorOffsetDiv = parseInt(selection.anchorNode.parentNode.id.split("text_")[1].split('_')[1]);
                        focusOffsetDiv = parseInt(selection.focusNode.parentNode.id.split("text_")[1].split('_')[1]);
                        anchorOffset = selection.anchorOffset;
                        focusOffset = selection.focusOffset;
                    }
                    this._controlSelectionRange = range;
                    if ($('#' + this._id + 'custom-menu'))
                        $('#' + this._id + 'custom-menu').hide();
                    this._waterDropletDivHide();
                    $('#' + this._id + 'touchcustom-menu').hide();
                    var pageNo;
                    selection.removeAllRanges();
                    for (var i = anchorpageId; i <= focuspageId; i++) {
                        var startId, endId;
                        var textDivs = this._textDivs[i];
                        if (i == anchorpageId) {
                            pageNo = anchorpageId;
                            startId = anchorOffsetDiv;
                            endId = textDivs.length - 1;
                        }
                        else if (i == focuspageId) {
                            pageNo = focuspageId;
                            startId = 0;
                            endId = focusOffsetDiv;
                        }
                        else {
                            pageNo++;
                            startId = 0;
                            endId = textDivs.length - 1;
                        }
                        if (anchorpageId == focuspageId) {
                            startId = anchorOffsetDiv;
                            endId = focusOffsetDiv;
                        }
                        for (var j = startId; j <= endId; j++) {
                            var textDiv = textDivs[j];
                            var initId, lastId, length;
                            length = textDiv.textContent.length;
                            textDiv.textContent = '';
                            if (j == startId) {
                                initId = anchorOffset;
                                lastId = length;
                                this._addSpanForSearch(j, 0, initId, i, textDivs, null);
                            } else if (j == endId) {
                                initId = 0;
                                lastId = focusOffset;
                            } else {
                                initId = 0;
                                lastId = length;
                            }
                            if (startId == endId) {
                                initId = anchorOffset;
                                lastId = focusOffset;
                            }
                            this._addSpanForSearch(j, initId, lastId, i, textDivs, 'e-pdfviewer-maintaincontent');
                        }
                    }
                }
            }
        },
        _windowMaintainSelectionOnDblclick: function (event) {
            if (!$(event.target).parents().hasClass("e-pdfviewer")) {
                if (this._controlSelectionRange != null) {
                    var selection = window.getSelection();
                    if (!($(selection.anchorNode).parent().hasClass('e-pdfviewer-textLayer') && $(selection.focusNode).parent().hasClass('e-pdfviewer-textLayer'))) {
                        this._controlSelectionRange = null;
                        this._selectionObject = null;
                        if ($('#' + this._id + 'custom-menu'))
                            $('#' + this._id + 'custom-menu').hide();
                        this._waterDropletDivHide();
                        $('#' + this._id + 'touchcustom-menu').hide();
                        this._clearHighlightDiv();
                    }
                } else {
                    this._clearHighlightDiv();
                }
            }
        },
        _windowMaintainSelectionOnMousemove: function (event) {
            if (!$(event.target).parents().hasClass("e-pdfviewer")) {
                if (this._controlSelectionRange != null) {
                    var selection = window.getSelection();
                    if (!($(selection.anchorNode).parent().hasClass('e-pdfviewer-textLayer') && $(selection.focusNode).parent().hasClass('e-pdfviewer-textLayer'))) {
                        this._controlSelectionRange = null;
                        this._selectionObject = null;
                        if ($('#' + this._id + 'custom-menu'))
                            $('#' + this._id + 'custom-menu').hide();
                        this._waterDropletDivHide();
                        $('#' + this._id + 'touchcustom-menu').hide();
                        this._clearHighlightDiv();
                    }
                }
            }
        },
        _windowOnTextContainerTouch: function (event) {
            var proxy = this;
            var timer = setTimeout(function () {
                proxy._controlSelectionRange = null;
                this._selectionObject = null;
                clearTimeout(timer);
                if (!$(event.target).parents().hasClass("e-pdfviewer")) {
                    if ($('#' + proxy._id + 'custom-menu'))
                        $('#' + proxy._id + 'custom-menu').hide();
                    proxy._waterDropletDivHide();
                    $('#' + proxy._id + 'touchcustom-menu').hide();
                    this._clearHighlightDiv();
                }
            }, 1000);
        },
        _clearHighlightDiv: function () {
            for (var i = 1; i <= this._totalPages; i++) {
                if (this._renderedCanvasList.indexOf(parseInt(i)) !== -1) {
                    var textDiv = this._textDivs[i];
                    var textContent = this._textContents[i];
                    if (!textDiv || textDiv == undefined) {
                        break;
                    }
                    for (var j = 0; j < textDiv.length; j++) {
                        textDiv[j].textContent = textContent[j];
                        if (!this._isFindboxPresent) {
                            textDiv[j].textContent = '';
                            textDiv[j].textContent = textContent[j] + '\r\n';
                        }
                    }
                }
            }
        },
        _deleteSignatureCanvas: function (event) {
            var target = this._tempCanvas;
            if (target) {
                var args = new Object();
                var isSelectors = document.getElementById(this._id + "e-pdfviewer-selector");
                var isButtons = document.getElementsByClassName('e-pdfviewer-buttons');
                args.annotationID = target.id;
                args.pageID = parseInt(target.id.split("imagecanvasDraw_")[1].split('_')[0]);
                var signatureObject = new Object();
                signatureObject.operation = "signatureDeleted";
                signatureObject.signCanvas = target;
                signatureObject.pageNumber = parseInt(target.id.split("imagecanvasDraw_")[1].split('_')[0]);
                this._recentOperation.push(signatureObject);
                $(target).remove();
                $(isSelectors).remove();
                $(isButtons).remove();
                this._raiseClientEvent("signatureDelete", args);
            }
        },
        _onContainerScroll: function (event) {
            document.getElementById(this._id + '_pdfviewer_colorpicker').style.display = 'none';
            this._isToolbarColorPicker = false;
            if (this._isPropertiesWindowOpen) {
                event.preventDefault();
            }
        },

        _closePropertiesWindow: function (event) {
            this._isPropertiesWindowOpen = false;
        },

        _onToolBarContainerMouseDown: function (event) {
            if (!($(event.target).hasClass('e-pdfviewer-ddl') || $(event.target).parents().hasClass('e-pdfviewer-ddl'))) {
                if (document.activeElement.id == this._id + '_toolbar_zoomSelection_wrapper') {
                    $('#' + this._id + '_toolbar_zoomSelection_wrapper').blur();
                }
            }
            event.preventDefault();
            return false;
        },
        _onToolbarItemClick: function (event) {
            if (event.target.id == this._id + "_txtpageNo") {
                $('#' + this._id + '_txtpageNo').select();
            }
            $('#' + this._id + '_rptTooltip').css('display', 'none');
        },
        _selectingTextOnClick: function (e) {
            if (this._timers && this._clientx == e.clientX && this._clienty == e.clientY) {
                clearTimeout(this._timers);
                this._timers = null;
                this._selectingEntireLine(e);
            }
        },
        _selectingEntireLine: function (e) {
            var textNode, range, offset;
            var textIds = [];
            var target = e.target;
            var targetTop = target.getBoundingClientRect();
            var len = $('.e-pdfviewer-textLayer').length;
            if ($(e.target).hasClass('e-pdfviewer-textLayer')) {
                for (var i = 0; i < len; i++) {
                    var rect = $('.e-pdfviewer-textLayer')[i].getBoundingClientRect();
                    var top = parseInt(rect.top);
                    var targetPosition = parseInt(targetTop.top);
                    if (top == targetPosition || (top + 1) == targetPosition || (top - 1) == targetPosition) {
                        var textId = $('.e-pdfviewer-textLayer')[i].id;
                        if (textId != "") {
                            textIds.push(textId);
                        }
                    }
                }
                var selection = window.getSelection();
                selection.removeAllRanges();
                var range = document.createRange();
                var lengths = (textIds.length - 1);
                var d1 = document.getElementById(textIds[0]);
                var d2 = document.getElementById(textIds[lengths]);
                var childNodes = d2.childNodes.length;
                if (childNodes > 0) {
                    var nodes = d2.childNodes[childNodes - 1]
                    range.setStart(d1, 0);
                    range.setEnd(nodes, nodes.length);
                }
                else {
                    range.setStart(d1, 0);
                    range.setEnd(d2, 1);
                }
                selection.addRange(range);
            }
        },
        _selectingTextOnDblClick: function (e) {
            this._clientx = e.clientX;
            this._clienty = e.clientY;
            if (this._isAnnotationSelected) {
                this._showPopupMenu(e);
                this._clearSelector(e);
            }
            this._timers = setTimeout(function () {
                this._timers = null;
            }, 200);
        },
        _onTextContainerMouseIn: function (e) {
            if (this.Clicked) {
                e.preventDefault();
                return false;
            }
        },
        _onTextContainerMouseUp: function (e) {
            if (this._dragstate) {
                this._dragstate = false;
            }
            $('#' + this._id + '_toolbarContainer_hiddenlist').addClass("e-display-none");
            document.getElementById(this._id + '_pdfviewer_colorpicker').style.display = 'none';
            this._isToolbarColorPicker = false;
            this._isDefaultColorSet = false;
            var annotation, annotationType;
            var target = e.target;
            var popupnoteInnerContent = $("#" + this._id + '_popupinnercontent');
            if (target == popupnoteInnerContent[0]) {
                popupnoteInnerContent.focus();
            } else {
                popupnoteInnerContent.blur();
            }
            this._isPopupNoteFocused = false;
            if (!this._isPropertiesWindowOpen && !(e.target.id == this._id + "_popupinnercontent") && !(e.target.id == this._id + "_popupcontent")) {
                this._curDown = false;
                var storedSelection = [];
                var target = e.target;
                this._currentAnnotationRectangle = [];
                var customMenu = document.getElementById(this._id + "custom-menu");
                var highlight = document.getElementById(this._id + "highlight-menu");
                if (e.target.className != "popupnoteli" && e.target.className != "deleteAnnotationli" && e.target.className != "Propertiesli" && e.target.className != "e-pdfviewer-highlight-menu")
                    $(highlight).hide();
                this._isContextMenuPresent = false;
                var pageNumber = parseInt(e.target.id.split("text_")[1]) || parseInt(e.target.id.split("selectioncanvas_")[1]) || parseInt(e.target.id.split("_secondarycanvas_")[1]);
                if (pageNumber && this.model.enableTextMarkupAnnotations) {
                    for (var i = 1; i <= this._totalPages; i++) {
                        if (this._textMarkupAnnotationList[i] || this._newAnnotationList[i - 1]) {
                            this._clearRectOnClick(i);
                        }
                    }
                    var secanvas = document.getElementById(this._id + "_secondarycanvas_" + pageNumber);
                    this._onCanvasMousedown(secanvas, e.pageX, e.pageY);
                    this._contextClickPosition(e, pageNumber);
                }
                if (!window.getSelection().toString()) {
                    if (this._currentAnnotationRectangle.length != 0) {
                        annotation = this._currentAnnotationRectangle[0];
                        annotationType = annotation.TextMarkupAnnotationType ? annotation.TextMarkupAnnotationType : annotation.type;
                        if (annotationType == "StrikeOut" && this.model.enableStrikethroughAnnotation) {
                            this._AnnotationPage = pageNumber;
                            this._drawAnnotSelectRect(pageNumber, this._currentAnnotationRectangle);
                        } else if (annotationType == "Highlight" && this.model.enableHighlightAnnotation) {
                            this._AnnotationPage = pageNumber;
                            this._drawAnnotSelectRect(pageNumber, this._currentAnnotationRectangle);
                        } else if (annotationType == "Underline" && this.model.enableUnderlineAnnotation) {
                            this._AnnotationPage = pageNumber;
                            this._drawAnnotSelectRect(pageNumber, this._currentAnnotationRectangle);
                        }
                    }
                }
                var targetValue, focusNode, anchorNode, focusPage, anchorPage, targetPage;
                var is_ie = navigator.userAgent.indexOf("MSIE") != -1 || !!document.documentMode == true;
                var searchText = window.getSelection().toString();
                if (e.type == "contextmenu") {
                    var selection = window.getSelection();
                    if (selection.anchorNode) {
                        var ranges = selection.getRangeAt(0);
                        var cloneRange = ranges.cloneContents();
                        var childNodes = cloneRange.childNodes;
                        var className = ranges.startContainer.parentNode.className;
                        var textHighlight = $(cloneRange).find('span');
                        if (textHighlight.length > 0) {
                            if (textHighlight[0].className == "e-pdfviewer-texthighlight e-pdfviewer-textLayer" || textHighlight[0].className == "e-pdfviewer-text-highlightother e-pdfviewer-textLayer") {
                                if (ranges.startContainer.id)
                                    storedSelection.push(ranges.startContainer.id);
                            }
                        }
                        var is_edgeNew = document.documentMode || /Edge/.test(navigator.userAgent);
                        if ((is_ie || is_edgeNew) && $(cloneRange).children().length == 0) {
                            if (className == "e-pdfviewer-textLayer" && ranges.startContainer.parentNode)
                                storedSelection.push(ranges.startContainer.parentNode.id);
                            else
                                storedSelection.push(ranges.startContainer.id);
                        }
                        if (cloneRange.childElementCount == 0) {
                            if (className == "e-pdfviewer-textLayer")
                                storedSelection.push(ranges.startContainer.parentElement.id);
                            else
                                storedSelection.push(ranges.startContainer.id);
                        }
                        else {
                            if (childNodes.length > 0) {
                                if (childNodes[0].className == "e-waitingpopup e-js") {
                                    for (var k = 0; k < childNodes.length; k++) {
                                        var children = $(childNodes[k]).find('.text_container').children();
                                        for (var l = 0; l < children.length; l++)
                                            storedSelection.push(children[l].id);
                                    }
                                }
                                else if (childNodes[0].className == "e-pdfviewer-selectiondiv text_container") {
                                    var children = $('.text_container').children();
                                    for (var m = 0; m < children.length; m++)
                                        storedSelection.push(children[m].id);
                                }
                                else {
                                    for (var i = 0; i < childNodes.length; i++) {
                                        var element = childNodes[i].id;
                                        storedSelection.push(element);
                                    }
                                }
                            }
                        }
                        for (var j = 0; j < storedSelection.length; j++) {
                            if ($(target).hasClass('e-pdfviewer-text-highlightother') || $(target).hasClass('e-pdfviewer-texthighlight')) {
                                target = target.parentElement;
                            }
                            if (target.id == storedSelection[j]) {
                                this._contextMenu = true;
                                break;
                            }
                            else
                                this._contextMenu = false;
                        }
                    }
                    if (e.target.className == "e-pdfviewer-imagecanvasDraw")
                        this._contextMenu = true;
                }
                if (e.which == 3 && e.target.className == "e-pdfviewer-imagecanvasDraw") {
                    this._contextMenu = true;
                }
                if (e.which == 3 && this._contextMenu && e.type == "contextmenu" && !this._isCopyRestrict && e.target.className == "e-pdfviewer-imagecanvasDraw") {
                    e.preventDefault();
                    this._showSignatureContext(e, highlight);
                    this._contextMenu = false;
                }
                else if (searchText != "" && e.which == 3 && this._contextMenu && e.type == "contextmenu" && !this._isCopyRestrict && ((e.target.className).indexOf('input_container') == -1) && this.model.textSelectionContextMenu.isEnable) {
                    e.preventDefault();
                    this._searchedText = "";
                    var localeObj = ej.PdfViewer.Locale[this.model.locale] ? ej.PdfViewer.Locale[this.model.locale] : ej.PdfViewer.Locale["default"];
                    var copyText = localeObj['contextMenu']['copy']['contentText'];
                    var googleText = localeObj['contextMenu']['googleSearch']['contentText'];
                    var highlightText = localeObj['toolbar']['highlight']['headerText'];
                    var strikeText = localeObj['toolbar']['strikeout']['headerText'];
                    $(customMenu).css("z-index", 1000000000);
                    $(customMenu).find('li a.copy').text(copyText);
                    $(customMenu).find('li a.googleSearch').text(googleText);
                    $(customMenu).find('li a.e-highlight-text').text(highlightText);
                    $(customMenu).find('li a.e-strikeout-text').text(strikeText);
                    if (searchText.length > 20) {
                        var trimmed = searchText.substring(0, 18);
                        var str = trimmed + "...";
                        $(customMenu).find('li a.googleSearch').text(googleText + "'" + str + "'");
                    }
                    else
                        $(customMenu).find('li a.googleSearch').text(googleText + "'" + searchText + "'");
                    var pos = this._setContextMenuPostion(e);
                    if (this.model.enableTextMarkupAnnotations) {
                        if (this.model.enableHighlightAnnotation)
                            $('#' + this._id + "_highlight_contextmenu").removeClass('e-disable');
                        else
                            $('#' + this._id + "_highlight_contextmenu").addClass('e-disable');
                        if (this.model.enableStrikethroughAnnotation)
                            $('#' + this._id + "_strikeout_contextmenu").removeClass('e-disable');
                        else
                            $('#' + this._id + "_strikeout_contextmenu").addClass('e-disable');
                    } else {
                        $('#' + this._id + "_highlight_contextmenu").addClass('e-disable');
                        $('#' + this._id + "_strikeout_contextmenu").addClass('e-disable');
                    }
                    if (!this.model.textSelectionContextMenu.isCopyEnable && !this.model.textSelectionContextMenu.isSearchEnable && !this.model.textSelectionContextMenu.isHighlightEnable && !this.model.textSelectionContextMenu.isStrikeoutEnable)
                        $(customMenu).hide();
                    else {
                        $(customMenu).show();
                        $(customMenu).offset({ top: pos.y, left: pos.x }).show();
                        $(customMenu).show();
                        $(customMenu).offset({ top: pos.y, left: pos.x }).show();
                    }
                    this._contextMenu = false;
                } else if (e.which == 3 && e.type == "contextmenu" && !this._isCopyRestrict
                    && ($(e.target).hasClass('e-pdfviewer-text-highlightother e-pdfviewer-textLayer') || $(e.target).hasClass('e-pdfviewer-texthighlight e-pdfviewer-textLayer') || $(e.target).hasClass('e-pdfviewer-texthighlight middle e-pdfviewer-textLayer')) && this.model.textSelectionContextMenu.isEnable) {
                    e.preventDefault();
                    this._searchedText = "";
                    var childElements = $('.e-pdfviewer-textLayer').find('.e-pdfviewer-texthighlight');
                    if (childElements.length > 1) {
                        childElements = $('.e-pdfviewer-textLayer').find('.e-pdfviewer-texthighlight');
                        for (var m = 0; m < childElements.length; m++) {
                            var texts = childElements[m].innerHTML
                            this._searchedText += texts;
                        }
                    }
                    else
                        this._searchedText = e.target.innerHTML;
                    if (this._searchedText.length > 20) {
                        var trimmed = this._searchedText.substring(0, 18);
                        var str = trimmed + "...";
                        $(customMenu).find('li a.googleSearch').text("Search Google For " + "'" + str + "'");
                    }
                    else
                        $(customMenu).find('li a.googleSearch').text("Search Google For " + "'" + this._searchedText + "'");
                    var pos = this._setContextMenuPostion(e);
                    if (this.model.enableTextMarkupAnnotations) {
                        if (this.model.enableHighlightAnnotation)
                            $('#' + this._id + "_highlight_contextmenu").removeClass('e-disable');
                        else
                            $('#' + this._id + "_highlight_contextmenu").addClass('e-disable');
                        if (this.model.enableStrikethroughAnnotation)
                            $('#' + this._id + "_strikeout_contextmenu").removeClass('e-disable');
                        else
                            $('#' + this._id + "_strikeout_contextmenu").addClass('e-disable');
                    } else {
                        $('#' + this._id + "_highlight_contextmenu").addClass('e-disable');
                        $('#' + this._id + "_strikeout_contextmenu").addClass('e-disable');
                    }
                    if (!this.model.textSelectionContextMenu.isCopyEnable && !this.model.textSelectionContextMenu.isSearchEnable && !this.model.textSelectionContextMenu.isHighlightEnable && !this.model.textSelectionContextMenu.isStrikeoutEnable)
                        $(customMenu).hide();
                    else {
                        $(customMenu).show();
                        $(customMenu).offset({ top: pos.y, left: pos.x }).show();
                        $(customMenu).show();
                        $(customMenu).offset({ top: pos.y, left: pos.x }).show();
                    }
                    this._contextMenu = false;
                }
                else if ($(customMenu).has(e.target).length == 0) {
                    $(customMenu).hide();
                    if (e.type == "contextmenu" && !this._contextMenu && e.target.className != "e-pdfviewer-formFields")
                        this._clearSelector();
                    else if (this._contextMenu)
                        e.preventDefault();
                    if (e.type == "contextmenu") {
                        if (e.which == 3 &&
                            (!this._contextMenu || !this.model.textSelectionContextMenu.isEnable || searchText == "") &&
                            e.type == "contextmenu" &&
                            (this._currentAnnotationRectangle.length != 0 || "#000000" != this._annotationColor) && this.model.annotationContextMenu.isEnable) {
                            if (this.model.enableTextMarkupAnnotations) {
                                if (annotationType == "StrikeOut" && this.model.enableStrikethroughAnnotation) {
                                    this._showAnnotationContextMenu(e, highlight);
                                } else if (annotationType == "Highlight" && this.model.enableHighlightAnnotation) {
                                    this._showAnnotationContextMenu(e, highlight);
                                } else if (annotationType == "Underline" && this.model.enableUnderlineAnnotation) {
                                    this._showAnnotationContextMenu(e, highlight);
                                }
                            }
                            e.preventDefault();
                        } else {
                            if (this._currentAnnotationRectangle.length != 0 || "#000000" != this._annotationColor && !this.model.annotationContextMenu.isEnable)
                                e.preventDefault();
                            $(highlight).hide();
                        }
                    }
                }

                if (this._annotationActive) {
                    if (this._isStrikeout) {
                        this._drawStrikeOutAnnotation();
                    } else if (this._isUnderline) {
                        this._drawUnderlineAnnotation();
                    } else if (this._isHighlight) {
                        this._drawHighlightAnnotation();
                    }
                }
            } else {
                e.preventDefault();
            }
        },
        _replaceTextLocale: function (element, text) {
            element.textContent = text;
        },
        _showSignatureContext: function (e, highlight) {
            var popupNote = $(highlight).find('.popupnoteli');
            $(popupNote).css("display", "none");
            this._showHideAnnotationMenu(highlight, "Signature");
            var localeObj = ej.PdfViewer.Locale[this.model.locale] ? ej.PdfViewer.Locale[this.model.locale] : ej.PdfViewer.Locale["default"];
            var popupText = localeObj['contextMenu']['openPopup']['contentText'];
            var propertiesText = localeObj['contextMenu']['properties']['contentText'];
            this._replaceTextLocale($("#" + this._id + "_openPopup")[0], popupText);
            this._replaceTextLocale($("#" + this._id + "_propAnnot")[0], propertiesText);
            var pos = this._setDeleteContextMenuPostion(e);
            if (!this.model.annotationContextMenu.isPropertiesEnable && !this.model.annotationContextMenu.isDeleteEnable)
                $(highlight).hide();
            else if (this.model.annotationContextMenu.isEnable) {
                $(highlight).show();
                $(highlight).offset({ top: pos.y, left: pos.x }).show();
                $(highlight).show();
                $(highlight).offset({ top: pos.y, left: pos.x }).show();
                $(highlight).css("z-index", 1000000000);
            }
        },
        _showAnnotationContextMenu: function (e, highlight) {
            $('#' + this._id + '_popup_note').hide();
            $("#" + this._id + "_popupmenu").hide();
            var popupNote = $(highlight).find('.popupnoteli');
            $(popupNote).css("display", "");
            this._showHideAnnotationMenu(highlight, "annotation");
            this._isPopupNoteVisible = false;
            var localeObj = ej.PdfViewer.Locale[this.model.locale] ? ej.PdfViewer.Locale[this.model.locale] : ej.PdfViewer.Locale["default"];
            var popupText = localeObj['contextMenu']['openPopup']['contentText'];
            var deleteText = localeObj['contextMenu']['Delete']['contentText'];
            var propertiesText = localeObj['contextMenu']['properties']['contentText'];
            this._replaceTextLocale($("#" + this._id + "_openPopup")[0], popupText);
            this._replaceTextLocale($("#" + this._id + "_deleteannot")[0], deleteText);
            this._replaceTextLocale($("#" + this._id + "_propAnnot")[0], propertiesText);
            var pos = this._setHighLightContextMenuPostion(e);
            this._isContextMenuPresent = true;
            if (!this.model.annotationContextMenu.isPopupEnable && !this.model.annotationContextMenu.isPropertiesEnable && !this.model.annotationContextMenu.isDeleteEnable)
                $(highlight).hide();
            else if (this.model.annotationContextMenu.isEnable) {
                $(highlight).show();
                $(highlight).offset({ top: pos.y, left: pos.x }).show();
                $(highlight).show();
                $(highlight).offset({ top: pos.y, left: pos.x }).show();
            }
        },
        _showHideSelectionContextMenu: function (contextMenu) {
            if (!this.model.textSelectionContextMenu.isEnable)
                $(contextMenu).css("display", "none");
            else {
                $(contextMenu).css("display", "");
                if (!this.model.textSelectionContextMenu.isCopyEnable)
                    $(contextMenu).find('.copyli').css("display", "none");
                else
                    $(contextMenu).find('.copyli').css("display", "");
                if (!this.model.textSelectionContextMenu.isSearchEnable)
                    $(contextMenu).find('.googlesearchli').css("display", "none");
                else
                    $(contextMenu).find('.googlesearchli').css("display", "");
                if (!this.model.textSelectionContextMenu.isHighlightEnable)
                    $(contextMenu).find('.e-highlight-textli').css("display", "none");
                else
                    $(contextMenu).find('.e-highlight-textli').css("display", "");
                if (!this.model.textSelectionContextMenu.isStrikeoutEnable)
                    $(contextMenu).find('.e-strikeout-textli').css("display", "none");
                else
                    $(contextMenu).find('.e-strikeout-textli').css("display", "");
            }
        },
        _showHideAnnotationMenu: function (contextMenu, type) {
            if (!this.model.annotationContextMenu.isEnable) {
                $(contextMenu).css("display", "none");
            }
            else {
                if (!this.model.annotationContextMenu.isPopupEnable)
                    $(contextMenu).find('.popupnoteli').css("display", "none");
                else if (type == "annotation")
                    $(contextMenu).find('.popupnoteli').css("display", "");
                if (!this.model.annotationContextMenu.isPropertiesEnable)
                    $(contextMenu).find('.Propertiesli').css("display", "none");
                else
                    $(contextMenu).find('.Propertiesli').css("display", "");
                if (!this.model.annotationContextMenu.isDeleteEnable)
                    $(contextMenu).find('.deleteAnnotationli').css("display", "none");
                else
                    $(contextMenu).find('.deleteAnnotationli').css("display", "");
            }
        },
        _contextClickPosition: function (event, pageNumber) {
            var pagePosition;
            this._currentAnnotationRectangleBackup = [];
            var currentAnnotations = [];
            var isAnnotationGot = false;
            if (pageNumber) {
                var parent = document.getElementById(this._id + "_secondarycanvas_" + pageNumber);
                pagePosition = parent.getBoundingClientRect();
            }
            var leftClickPosition = event.clientX - pagePosition.left;
            var topClickPosition = event.clientY - pagePosition.top;
            var annotationList = this._newAnnotationList[pageNumber - 1];
            for (var i = 0; i < annotationList.length; i++) {
                var annotation = annotationList[i];
                for (var k = 0; k < annotation.bounds.length; k++) {
                    var bound = annotation.bounds[k];
                    if (leftClickPosition >= bound.xPosition * this._zoomVal && leftClickPosition <= (bound.xPosition + bound.width) * this._zoomVal && topClickPosition >= bound.yPosition * this._zoomVal && topClickPosition <= (bound.yPosition + bound.height) * this._zoomVal) {
                        this._currentAnnotationRectangle.push(annotationList[i]);
                        this._currentAnnotationRectangleBackup.push(annotationList[i]);
                        isAnnotationGot = true;
                        currentAnnotations.push(annotation);
                    } else {
                        if (isAnnotationGot) {
                            isAnnotationGot = false;
                            break;
                        }
                        if (!this._isPopupNoteVisible) {
                            this._currentAnnotationRectangleBackup = [];
                        }
                        this._currentAnnotationRectangle = [];
                    }
                }
            }
            annotationList = this._textMarkupAnnotationList[pageNumber];
            if (annotationList) {
                for (var j = 0; j < annotationList.length; j++) {
                    var annotation = annotationList[j];
                    for (var k = 0; k < annotation.Bounds.length; k++) {
                        var bound = annotation.Bounds[k];
                        var xPosition = this._convertPointToPixel(bound.X);
                        var yPosition = this._convertPointToPixel(bound.Y);
                        var width = this._convertPointToPixel(bound.Width);
                        var height = this._convertPointToPixel(bound.Height);
                        if (leftClickPosition >= xPosition * this._zoomVal &&
                            leftClickPosition <= (xPosition + width) * this._zoomVal &&
                            topClickPosition >= yPosition * this._zoomVal &&
                            topClickPosition <= (yPosition + height) * this._zoomVal) {
                            this._currentAnnotationRectangle.push(annotation);
                            this._currentAnnotationRectangleBackup.push(annotation);
                            isAnnotationGot = true;
                            currentAnnotations.push(annotation);
                        } else {
                            if (isAnnotationGot) {
                                isAnnotationGot = false;
                                break;
                            }
                            if (!this._isPopupNoteVisible) {
                                this._currentAnnotationRectangleBackup = [];
                            }
                            this._currentAnnotationRectangle = [];
                        }
                    }
                }
            }
            if (currentAnnotations.length > 1) {
                currentAnnotations = this._compareAnnotations(currentAnnotations);
            }
            this._currentAnnotationRectangle = currentAnnotations;
            this._currentAnnotationRectangleBackup = currentAnnotations;
        },
        _compareAnnotations: function (currentAnnotations) {
            var prevXposition, currentAnnot;
            for (var i = 0; i < currentAnnotations.length; i++) {
                if (i == currentAnnotations.length - 1) {
                    break;
                }
                var firstAnnotBounds = currentAnnotations[i].bounds ? currentAnnotations[i].bounds : currentAnnotations[i].Bounds;
                var firstXposition = firstAnnotBounds[0].X ? firstAnnotBounds[0].X : firstAnnotBounds[0].xPosition
                var firstYposition = firstAnnotBounds[0].Y ? firstAnnotBounds[0].Y : firstAnnotBounds[0].yPosition;
                var secondAnnotBounds = currentAnnotations[i + 1].bounds ? currentAnnotations[i + 1].bounds : currentAnnotations[i + 1].Bounds;
                var secondXposition = secondAnnotBounds[0].X ? secondAnnotBounds[0].X : secondAnnotBounds[0].xPosition;
                var secondYposition = secondAnnotBounds[0].Y ? secondAnnotBounds[0].Y : secondAnnotBounds[0].yPosition;
                if (firstXposition < secondXposition || firstYposition < secondYposition) {
                    prevXposition = secondXposition;
                    currentAnnot = currentAnnotations[i + 1];
                } else {
                    prevXposition = firstXposition;
                    currentAnnot = currentAnnotations[i];
                }
                if (prevXposition && i == currentAnnotations.length - 2) {
                    if (prevXposition == firstXposition && prevXposition == secondXposition) {
                        prevXposition = secondXposition;
                        currentAnnot = currentAnnotations[i + 1];
                    }
                }
            }
            currentAnnotations = [];
            currentAnnotations.push(currentAnnot);
            return currentAnnotations;
        },
        _setContextMenuPostion: function (event) {
            var contextMenu = $("#" + this._id + "custom-menu");
            this._showHideSelectionContextMenu(contextMenu);
            var mousePosition = {};
            var menuPostion = {};
            var menuDimension = {};

            menuDimension.x = contextMenu.outerWidth();
            menuDimension.y = contextMenu.outerHeight();
            mousePosition.x = event.pageX;
            mousePosition.y = event.pageY;

            if (mousePosition.x + menuDimension.x > $(window).width() + $(window).scrollLeft()) {
                menuPostion.x = mousePosition.x - menuDimension.x;
            } else {
                menuPostion.x = mousePosition.x;
            }

            if (mousePosition.y + menuDimension.y > $(window).height() + $(window).scrollTop()) {
                menuPostion.y = mousePosition.y - menuDimension.y;
            } else {
                menuPostion.y = mousePosition.y;
            }
            return menuPostion;
        },
        _createWaterDropDiv: function (e) {
            var pageviewcontainer = $('#' + this._id + '_pageviewContainer');
            var dropdownX = document.createElement("DIV");
            dropdownX.id = this._id + "droplet1";
            dropdownX.className = "e-pdfviewer-droplet1";
            var dropdownY = document.createElement("DIV");
            dropdownY.id = this._id + "droplet2";
            dropdownY.className = "e-pdfviewer-droplet2";
            pageviewcontainer.append(dropdownX);
            pageviewcontainer.append(dropdownY);
            var vscrolvalue = $('#' + this._id + '_viewerContainer');
            var instance = this;
            $('#' + this._id + 'droplet2').on("touchmove", function (e) {
                if (instance.model.enableTextSelection) {
                    instance._enableSelection();
                    var selectionRange = window.getSelection();
                    var anchorPageId = parseInt(selectionRange.anchorNode.parentNode.id.split("text_")[1]);
                    var focusPageId = parseInt(selectionRange.focusNode.parentNode.id.split("text_")[1]);
                    if (anchorPageId == parseInt(instance._selectionStartPage) && focusPageId == parseInt(instance._selectionStartPage) || !instance._annotationActive) {
                        instance._longTouch = true;
                        var scrollTop = $(vscrolvalue).scrollTop();
                        $('#' + instance._id + 'touchcustom-menu').hide();
                        var touchX, touchY, curX, curY;
                        e.preventDefault();
                        var backwardPos = $('#' + instance._id + 'droplet1').offset();
                        if (e.type == "touchmove") {
                            touchX = e.originalEvent.changedTouches[0].clientX;
                            touchY = e.originalEvent.changedTouches[0].clientY;
                            $(e.target).css("z-index", 0);
                            curX = e.originalEvent.changedTouches[0].clientX;
                            curY = e.originalEvent.changedTouches[0].clientY;
                            $(e.target).css("z-index", 1000);
                        }
                        if (curY >= backwardPos.top) {
                            if (document.caretPositionFromPoint) {
                                range = document.caretPositionFromPoint(curX, curY);
                                textNode = range.offsetNode;
                            } else if (document.caretRangeFromPoint) {
                                range = document.caretRangeFromPoint(curX, curY);
                                if (range != null) {
                                    textNode = range.startContainer;
                                    if (!$(textNode).hasClass('e-pdfviewer-toolbarcontainer')) {
                                        offset = range.startOffset;
                                    }
                                    else
                                        $(vscrolvalue).scrollTop(scrollTop + 30);
                                }
                                else
                                    $(vscrolvalue).scrollTop(scrollTop + 30);
                            }
                            parent = textNode.parentElement;
                            var point = instance._selectingTextByTouch(parent, curX, curY, true);
                        }
                        else {
                            if (document.caretPositionFromPoint) {
                                range = document.caretPositionFromPoint(curX, curY);
                                textNode = range.offsetNode;
                            } else if (document.caretRangeFromPoint) {
                                range = document.caretRangeFromPoint(curX, curY);
                                if (range != null) {
                                    textNode = range.startContainer;
                                    if (!$(textNode).hasClass('e-pdfviewer-toolbarcontainer')) {
                                        offset = range.startOffset;
                                    }
                                    else
                                        $(vscrolvalue).scrollTop(scrollTop - 30);
                                }
                                else
                                    $(vscrolvalue).scrollTop(scrollTop - 30);
                            }
                            parent = textNode.parentElement;
                            var point = instance._selectingTextByTouch(parent, curX, curY, false);
                        }
                        if ($(parent).hasClass('e-pdfviewer-textLayer')) {
                            var width = $('#' + instance._id + 'droplet2').width();
                            $('#' + instance._id + 'droplet2').offset({ 'top': curY + window.scrollY, 'left': (curX - width) });
                        }
                    }
                }
                else if (!instance.model.enableTextSelection)
                    instance._disableSelection();
            });
            $('#' + this._id + 'droplet1').on("touchmove", function (e) {
                if (instance.model.enableTextSelection) {
                    instance._enableSelection();
                    var selectionRange = window.getSelection();
                    var anchorPageId = parseInt(selectionRange.anchorNode.parentNode.id.split("text_")[1]);
                    var focusPageId = parseInt(selectionRange.focusNode.parentNode.id.split("text_")[1]);
                    if (anchorPageId == parseInt(instance._selectionStartPage) && focusPageId == parseInt(instance._selectionStartPage) || !instance._annotationActive) {
                        var scrollTop = $(vscrolvalue).scrollTop();
                        $('#' + instance._id + 'touchcustom-menu').hide();
                        var touchX, touchY, curX, curY;
                        e.preventDefault();
                        var forwardPos = $('#' + instance._id + 'droplet2').offset();
                        if (e.type == "touchmove") {
                            instance._longTouch = true;
                            touchX = e.originalEvent.changedTouches[0].clientX;
                            touchY = e.originalEvent.changedTouches[0].clientY;
                            $(e.target).css("z-index", 0);
                            curX = e.originalEvent.changedTouches[0].clientX;
                            curY = e.originalEvent.changedTouches[0].clientY;
                            $(e.target).css("z-index", 1000);
                        }
                        if (curY <= forwardPos.top) {
                            if (document.caretPositionFromPoint) {
                                range = document.caretPositionFromPoint(curX, curY);
                                textNode = range.offsetNode;
                            } else if (document.caretRangeFromPoint) {
                                range = document.caretRangeFromPoint(curX, curY);
                                if (range != null) {
                                    textNode = range.startContainer;
                                    if (!$(textNode).hasClass('e-pdfviewer-toolbarcontainer')) {
                                        offset = range.startOffset;
                                    }
                                    else
                                        $(vscrolvalue).scrollTop(scrollTop - 30);
                                }
                                else
                                    $(vscrolvalue).scrollTop(scrollTop - 30);
                            }
                            parent = textNode.parentElement;
                            var point = instance._selectingTextByTouch(parent, curX, curY, false);
                        }
                        else {
                            if (document.caretPositionFromPoint) {
                                range = document.caretPositionFromPoint(curX, curY);
                                textNode = range.offsetNode;
                            } else if (document.caretRangeFromPoint) {
                                range = document.caretRangeFromPoint(curX, curY);
                                if (range != null) {
                                    textNode = range.startContainer;
                                    if (!$(textNode).hasClass('e-pdfviewer-toolbarcontainer')) {
                                        offset = range.startOffset;
                                    }
                                    else
                                        $(vscrolvalue).scrollTop(scrollTop + 30);
                                }
                                else
                                    $(vscrolvalue).scrollTop(scrollTop + 30);
                            }
                            parent = textNode.parentElement;
                            var point = instance._selectingTextByTouch(parent, curX, curY, true);
                        }
                        $(e.target).css("z-index", 1000);
                        if ($(parent).hasClass('e-pdfviewer-textLayer')) {
                            var width = $('#' + instance._id + 'droplet1').width();
                            $('#' + instance._id + 'droplet1').offset({ 'top': curY + window.scrollY, 'left': (curX - width) });
                        }
                    }
                }
                else if (!instance.model.enableTextSelection)
                    instance._disableSelection();
            });
        },
        _disableSelection: function () {
            if (!this.model.enableTextSelection) {
                $('#' + this._id + '_viewerContainer').attr('unselectable', 'on')
                    .css({
                        '-moz-user-select': 'none',
                        '-o-user-select': 'none',
                        '-khtml-user-select': 'none',
                        '-webkit-user-select': 'none',
                        '-ms-user-select': 'none',
                        'user-select': 'none'
                    }).bind('selectstart', function () { return false; });
            }
        },
        _enableSelection: function () {
            if (this.model.enableTextSelection) {
                $('#' + this._id + '_viewerContainer').removeAttr("unselectable")
                    .css({
                        '-moz-user-select': 'text',
                        '-o-user-select': 'text',
                        '-khtml-user-select': 'text',
                        '-webkit-user-select': 'text',
                        '-ms-user-select': 'text',
                        'user-select': 'text'
                    }).unbind('selectstart').bind('selectstart', function () { return true; });
            }
        },
        _selectingTextByTouch: function (elem, x, y, type) {
            if (elem.nodeType == elem.TEXT_NODE) {
                var range = elem.ownerDocument.createRange();
                var selection = window.getSelection();
                range.selectNodeContents(elem);
                var currentPos = 0;
                var endPos = range.endOffset;
                while (currentPos < endPos) {
                    range.setStart(elem, currentPos);
                    range.setEnd(elem, currentPos + 1);
                    if (range.getBoundingClientRect().left <= x && range.getBoundingClientRect().right >= x &&
                        range.getBoundingClientRect().top <= y && range.getBoundingClientRect().bottom >= y) {
                        var singleWord = range.toString();
                        var rangesPosition = range.getBoundingClientRect();
                        if (selection.anchorNode != null && selection.anchorNode.parentNode.className == "e-pdfviewer-textLayer" && type) {
                            range.setStart(selection.anchorNode, selection.anchorOffset);
                            selection.removeAllRanges();
                            selection.addRange(range);
                            selection.extend(elem, currentPos);
                        }
                        else if (selection.anchorNode != null && !type) {
                            range.setEnd(selection.focusNode, selection.focusOffset);
                            selection.removeAllRanges();
                            selection.addRange(range);
                        }
                        range.detach();
                        return (singleWord);
                    }
                    currentPos += 1;
                }
            } else {
                for (var i = 0; i < elem.childNodes.length; i++) {
                    var range = elem.childNodes[i].ownerDocument.createRange();
                    range.selectNodeContents(elem.childNodes[i]);
                    if (range.getBoundingClientRect().left <= x && range.getBoundingClientRect().right >= x &&
                        range.getBoundingClientRect().top <= y && range.getBoundingClientRect().bottom >= y) {
                        range.detach();
                        return (this._selectingTextByTouch(elem.childNodes[i], x, y, type));
                    } else {
                        range.detach();
                    }
                }
            }
            return (null);
        },
        _onTextContainerTouchMove: function (e) {
            $('#' + this._id + '_toolbarContainer_hiddenlist').addClass("e-display-none");
            if ($(e.target).hasClass('e-pdfviewer-textLayer') && this._lockTimer) {
                var curX = e.originalEvent.changedTouches[0].clientX;
                var curY = e.originalEvent.changedTouches[0].clientY;
                var touchmenu = document.getElementById(this._id + 'touchcustom-menu');
                if (parseInt(curX) != parseInt(this._curPosX) && parseInt(curY) != parseInt(this._curPosY)) {
                    $('.e-pdfviewer-formFields').css("visibility", "visible");
                    $(touchmenu).hide();
   
                }
            }
            var is_ie = navigator.userAgent.indexOf("MSIE") != -1 || !!document.documentMode == true;
            var pageNumber = parseInt(e.target.id.split("text_")[1]) || parseInt(e.target.id.split("selectioncanvas_")[1]) || parseInt(e.target.id.split("secondarycanvas_")[1]);

            if (this.model.enableTextMarkupAnnotations) {
                if (!this._isPopupNoteVisible && !this._isContextMenuPresent) {
                    if (!is_ie)
                        this._contextClickPosition(e.originalEvent.changedTouches[0], pageNumber);
                    if (this._currentAnnotationRectangle.length != 0 && !is_ie) {
                        var annotation = this._currentAnnotationRectangle[0];
                        var annotationType = annotation.TextMarkupAnnotationType ? annotation.TextMarkupAnnotationType : annotation.type;
                        if (annotationType == "StrikeOut" && this.model.enableStrikethroughAnnotation) {
                            this._showPopupNote(e);
                            e.target.style.cursor = "pointer";
                        } else if (annotationType == "Underline" && this.model.enableUnderlineAnnotation) {
                            this._showPopupNote(e);
                            e.target.style.cursor = "point_setPopupMenuPosition:er";
                        } else if (annotationType == "Highlight" && this.model.enableHighlightAnnotation) {
                            this._showPopupNote(e);
                            e.target.style.cursor = "pointer";
                        }
                    } else {
                        $('#' + this._id + '_popup_note').css({ 'display': 'none' });
                        if (this.model.enableTextSelection) {
                            e.target.style.cursor = "auto";
                            e.preventDefault();
                            this._enableSelection();
                        }
                        else if (!this.model.enableTextSelection && !this._isCanasResized && !this._isCanvasClicked) {
                            var pageDiv = $('#' + this._id + 'pageDiv_' + (this._currentPage))
                            if (this._dragstate) {
                                this._deltax = this._dragx - e.pageX;
                                this._deltay = this._dragy - e.pageY;
                                var vscrolvalue = $('#' + this._id + '_viewerContainer').scrollTop();
                                var vscrolleft = $('#' + this._id + '_viewerContainer').scrollLeft();
                                if (this._deltay > 3)
                                    $('#' + this._id + '_viewerContainer').scrollTop(vscrolvalue + 20);
                                else if (this._deltay < -2)
                                    $('#' + this._id + '_viewerContainer').scrollTop(vscrolvalue - 20);
                                if (this._deltax > 3)
                                    $('#' + this._id + '_viewerContainer').scrollLeft(vscrolleft + 20);
                                else if (this._deltax < -2)
                                    $('#' + this._id + '_viewerContainer').scrollLeft(vscrolleft - 20);
                                e.target.style.cursor = "move";
                                e.target.style.cursor = "-webkit-grabbing";
                                e.target.style.cursor = "-moz-grabbing";
                                e.target.style.cursor = "grabbing";
                                this._dragx = e.pageX;
                                this._dragy = e.pageY;

                            }
                            else {
                                e.target.style.cursor = "move";
                                e.target.style.cursor = "-webkit-grab";
                                e.target.style.cursor = "-moz-grab";
                                e.target.style.cursor = "grab";
                            }
                        }
                    }
                }
            }
        },
        _setTouchContextMenu: function (e) {
            var contextMenu = $('#' + this._id + 'touchcustom-menu');
            var mousePosition = {};
            var menuPostion = {};
            var menuDimension = {};

            menuDimension.x = contextMenu.outerWidth();
            menuDimension.y = contextMenu.outerHeight();
            mousePosition.x = e.originalEvent.changedTouches[0].pageX;
            mousePosition.y = e.originalEvent.changedTouches[0].pageY;

            if (mousePosition.x + menuDimension.x > $(window).width() + $(window).scrollLeft()) {
                menuPostion.x = mousePosition.x;
            } else {
                menuPostion.x = mousePosition.x - (menuDimension.x / 2);
            }
            if (mousePosition.y) {
                menuPostion.y = mousePosition.y - menuDimension.y;
            }
            return menuPostion;
        },
        _onTextContainerTouch: function (e) {
            var noteElement = $('#' + this._id + '_popup_note');
            if (noteElement) {
                 noteElement.hide();
            }
            var eventTouch = e.originalEvent.touches.length;
            this._curPosX = e.originalEvent.changedTouches[0].clientX;
            this._curPosY = e.originalEvent.changedTouches[0].clientY;
            if (this.model.enableTextSelection && !this._isSelectionHidden) {
                e.preventDefault();
            }
            if (this._lockTimer)
                return;
            var proxy = this;

            this._timer = setTimeout(function () {
                proxy._onlongtouch(e);
            }, 1000);
            this._lockTimer = true;
        },
        _onlongtouch: function (e) {
            if (e.type == "touchstart" && e.target.id != this._id + "droplet2" || e.target.id != this._id + "droplet2" && this.model.enableTextSelection) {
                this._enableSelection();
                this._longTouch = true;
                $('.text_container').css("visibility", "");
                this._curXPos = e.originalEvent.changedTouches[0].clientX;
                this._curYPos = e.originalEvent.changedTouches[0].clientY;
                var pageNumber = parseInt(e.target.id.split("text_")[1]) || parseInt(e.target.id.split("selectioncanvas_")[1]) || parseInt(e.target.id.split("_secondarycanvas_")[1]);
                this._selectionStartPage = pageNumber;
                if (!this._isPropertiesWindowOpen) {
                    if (pageNumber && this.model.enableTextMarkupAnnotations) {
                        this._contextClickPosition(e.originalEvent.changedTouches[0], pageNumber);
                    }
                }
                if (!this._isAnnotationSelected || this._selectedAnnotation != this._currentAnnotationRectangle[0]) {
                    var point = this._getElementTouch(e.target, this._curXPos, this._curYPos, true);
                    if (pageNumber)
                        this._clearRectOnClick(pageNumber);
                }
                if (e.target.className == "e-pdfviewer-imagecanvasDraw" && !this._isCanasResized && !this._isCanvasMoved) {
                    var highlight = document.getElementById(this._id + "highlight-menu");
                    this._showSignatureContext(e, highlight);
                }
                e.preventDefault();
            }
            else if (!this.model.enableTextSelection) {
                this._disableSelection();
                var touchmenu = document.getElementById(this._id + 'touchcustom-menu');
                $(touchmenu).hide();
                this._waterDropletDivHide();
            }
        },
        _onTextContainerTouchEnd: function (e) {
            $('#' + this._id + '_toolbarContainer_hiddenlist').addClass("e-display-none");
            var touchSelection = [];
            var target = e.target;
            var ranges;
            var eventTouch = e.originalEvent.touches.length;
            if (this._timer) {
                this._enableSelection();
                var popupnote = $("a.popupnote");
                var popupnoteInnerContent = $("#" + this._id + '_popupinnercontent');
                document.getElementById(this._id + '_pdfviewer_colorpicker').style.display = 'none';
                this._isToolbarColorPicker = false;
                if (target == popupnoteInnerContent[0]) {
                    popupnoteInnerContent.focus();
                } else {
                    popupnoteInnerContent.blur();
                }
                if (target.id != this._id + "highlight-menu" && target != popupnote[0] && target != popupnoteInnerContent[0] && target.className != "e-pdfviewer-imagecanvasDraw") {
                    if (!this._isPropertiesWindowOpen) {
                        var highlight = document.getElementById(this._id + "highlight-menu");
                        $(highlight).hide();
                        this._isContextMenuPresent = false;
                        var annotation, annotationType;
                        var pageNumber = parseInt(e.target.id.split("text_")[1]) || parseInt(e.target.id.split("selectioncanvas_")[1]) || parseInt(e.target.id.split("_secondarycanvas_")[1]);
                        if (pageNumber && this.model.enableTextMarkupAnnotations) {
                            this._contextClickPosition(e.originalEvent.changedTouches[0], pageNumber);
                        }
                        if (this._currentAnnotationRectangleBackup.length != 0 && this._isAnnotationSelected && this._selectedAnnotation == this._currentAnnotationRectangleBackup[0]) {
                            window.getSelection().removeAllRanges();
                            var touchmenu = document.getElementById(this._id + 'touchcustom-menu');
                            $(touchmenu).hide();
                            this._waterDropletDivHide();
                        }
                        if (this._longTouch && this._isAnnotationSelected && this._currentAnnotationRectangleBackup.length != 0 && this._selectedAnnotation == this._currentAnnotationRectangleBackup[0]) {
                            if (this.model.enableTextMarkupAnnotations) {
                                annotation = this._currentAnnotationRectangleBackup[0];
                                annotationType = annotation.TextMarkupAnnotationType ? annotation.TextMarkupAnnotationType : annotation.type;
                                if (annotationType == "StrikeOut" && this.model.enableStrikethroughAnnotation) {
                                    this._showAnnotationContextMenu(e.originalEvent.changedTouches[0], highlight);
                                } else if (annotationType == "Highlight" && this.model.enableHighlightAnnotation) {
                                    this._showAnnotationContextMenu(e.originalEvent.changedTouches[0], highlight);
                                } else if (annotationType == "Underline" && this.model.enableUnderlineAnnotation) {
                                    this._showAnnotationContextMenu(e.originalEvent.changedTouches[0], highlight);
                                }
                            }
                            this._longTouch = false;
                        }
                        if (!this._isContextMenuPresent) {
                            var pageNumber = parseInt(e.target.id.split("text_")[1]) || parseInt(e.target.id.split("selectioncanvas_")[1]) || parseInt(e.target.id.split("_secondarycanvas_")[1]);
                            if (pageNumber && this.model.enableTextMarkupAnnotations) {
                                this._clearRectOnClick(pageNumber);
                                var secanvas = document.getElementById(this._id + "_secondarycanvas_" + pageNumber);
                                this._onCanvasMousedown(secanvas, e.originalEvent.changedTouches[0].pageX, e.originalEvent.changedTouches[0].pageY);
                                this._contextClickPosition(e.originalEvent.changedTouches[0], pageNumber);
                            }
                            if (!window.getSelection().toString()) {
                                if (this._currentAnnotationRectangle.length != 0) {
                                    annotation = this._currentAnnotationRectangle[0];
                                    annotationType = annotation.TextMarkupAnnotationType ? annotation.TextMarkupAnnotationType : annotation.type;
                                    if (annotationType == "StrikeOut" && this.model.enableStrikethroughAnnotation) {
                                        this._AnnotationPage = pageNumber;
                                        this._drawAnnotSelectRect(pageNumber, this._currentAnnotationRectangle);
                                    } else if (annotationType == "Highlight" && this.model.enableHighlightAnnotation) {
                                        this._AnnotationPage = pageNumber;
                                        this._drawAnnotSelectRect(pageNumber, this._currentAnnotationRectangle);
                                    } else if (annotationType == "Underline" && this.model.enableUnderlineAnnotation) {
                                        this._AnnotationPage = pageNumber;
                                        this._drawAnnotSelectRect(pageNumber, this._currentAnnotationRectangle);
                                    }
                                }
                            }
                        }
                    }
                }
                clearTimeout(this._timer);
                this._lockTimer = false;
                var touchmenu = document.getElementById(this._id + 'touchcustom-menu');
                var curX = e.originalEvent.changedTouches[0].clientX;
                var curY = e.originalEvent.changedTouches[0].clientY;
                var selection = window.getSelection();
                if (selection.anchorNode) {
                    ranges = selection.getRangeAt(0);
                    var cloneRange = ranges.cloneContents();
                    var childNodes = cloneRange.childNodes;
                    var className = ranges.startContainer.parentElement.className;
                    if (cloneRange.childElementCount == 0 && !this._longTouch) {
                        if (className == "e-pdfviewer-textLayer")
                            touchSelection.push(ranges.startContainer.parentElement.id);
                        else
                            touchSelection.push(ranges.startContainer.id);
                    }
                    else {
                        if (childNodes.length > 0) {
                            if (childNodes[0].className == "e-waitingpopup e-js") {
                                for (var k = 0; k < childNodes.length; k++) {
                                    var children = $(childNodes[k]).find('.text_container').children();
                                    for (var l = 0; l < children.length; l++)
                                        touchSelection.push(children[l].id);
                                }
                            }
                            else {
                                for (var i = 0; i < childNodes.length; i++) {
                                    var element = childNodes[i].id;
                                    touchSelection.push(element);
                                }
                            }
                        }
                    }
                    for (var j = 0; j < touchSelection.length; j++) {
                        if (target.id == touchSelection[j]) {
                            this._touchcontextMenu = true;
                            break;
                        }
                        else
                            this._touchcontextMenu = false;
                    }
                }
                else
                    this._touchcontextMenu = false;
                if (this._rangePosition && this._longTouch) {
                    $('.text_container').css("visibility", "");
                    var outerHeight = $(touchmenu).outerHeight();
                    var outerWidth = $(touchmenu).outerWidth();
                    var width = this._rangePosition.width / 2;
                    var searchText = window.getSelection().toString();
                    if (this._ranges || this._touchcontextMenu || e.target.id == this._id + "droplet1" || e.target.id == this._id + "droplet2") {
                        if (e.target.id == this._id + "droplet1" || e.target.id == this._id + "droplet2" && this.model.textSelectionContextMenu.isEnable) {
                            $(touchmenu).show();
                            var context = this._setTouchContextMenu(e);
                            $(touchmenu).show();
                            $(touchmenu).offset({ 'top': context.y, 'left': context.x }).show();

                            if (this._annotationActive) {
                                if (this._isStrikeout) {
                                    this._drawStrikeOutAnnotation();
                                } else if (this._isUnderline) {
                                    this._drawUnderlineAnnotation();
                                } else if (this._isHighlight) {
                                    this._drawHighlightAnnotation();
                                }
                            }
                        }
                        else {
                            if (!this._annotationActive && this.model.textSelectionContextMenu.isEnable) {
                                $(touchmenu).show();
                                $(touchmenu).offset({ 'top': this._rangePosition.top - outerHeight + window.scrollY, 'left': this._rangePosition.left + width - (outerWidth / 2) });
                            }
                        }
                        this._ranges = false;
                        $('.text_container').css("visibility", "");
                    }
                    else {
                        if ($(e.target).hasClass('copy') || $(e.target).hasClass('googleSearch')) {
                            $(touchmenu).hide();
                        }
                        else {
                            $(touchmenu).hide();
                            this._waterDropletDivHide();
                        }
                    }
                    this._longTouch = false;
                }
                else {
                    $(touchmenu).hide();
                    if (this._annotationActive) {
                        if (this._isStrikeout) {
                            this._drawStrikeOutAnnotation();
                        } else if (this._isUnderline) {
                            this._drawUnderlineAnnotation();
                        } else if (this._isHighlight) {
                            this._drawHighlightAnnotation();
                        }
                    }
                }
                if (!this._annotationActive) {
                    if ($(touchmenu).css('display') == 'none' && e.target.id != this._id + "droplet2"
                        && e.target.id != this._id + "droplet1" && e.target.className != "copy" && e.target.className != "googleSearch"
                        && $('#' + this._id + 'custom-menu').css('display') == 'none' && !this._touched && !this._touchcontextMenu) {
                        if (this.model.textSelectionContextMenu.isEnable) {
                            this._clearSelector();
                            this._clearText = true;
                        }
                    }
                }
                else if (this._touchcontextMenu) {
                    var selection = window.getSelection();
                    var range = document.createRange();
                    var position = selection.anchorNode.compareDocumentPosition(selection.focusNode)
                    var backward = false;
                    if (!position && selection.anchorOffset > selection.focusOffset ||
                        position === Node.DOCUMENT_POSITION_PRECEDING)
                        backward = true;
                    if (backward) {
                        range.setStart(selection.focusNode, selection.focusOffset);
                        range.setEnd(selection.anchorNode, selection.anchorOffset);
                    }
                    else {
                        range.setStart(selection.anchorNode, selection.anchorOffset);
                        range.setEnd(selection.focusNode, selection.focusOffset);
                    }
                    var outerHeight = $(touchmenu).outerHeight();
                    var outerWidth = $(touchmenu).outerWidth();
                    var rangesPosition = range.getBoundingClientRect();
                    var boundingClient = range.getClientRects();
                    var length = boundingClient.length - 1;
                    var customMenuWidth = rangesPosition.width / 2;
                    var droplet1 = document.getElementById(this._id + 'droplet1');
                    var droplet2 = document.getElementById(this._id + 'droplet2');
                    var width = $(droplet1).outerWidth();
                    var height = $(droplet1).outerHeight();
                    var searchText = window.getSelection().toString();
                    if (searchText != "" && this.model.textSelectionContextMenu.isEnable) {
                        var context = this._setTouchContextMenu(e);
                        $(droplet1).show();
                        $(droplet1).offset({ "top": boundingClient[0].top + window.scrollY, "left": boundingClient[0].left - width }).show();
                        $(droplet2).show();
                        $(droplet2).offset({ "top": boundingClient[length].top + window.scrollY, "left": boundingClient[length].left + boundingClient[length].width - width }).show();
                        $(touchmenu).show();
                        $(touchmenu).offset({ 'top': context.y, 'left': context.x }).show();
                    }
                    e.preventDefault();
                }
                if (this._clearText) {
                    $(touchmenu).hide();
                    this._waterDropletDivHide();
                    this._clearText = false;
                }
            }
            else if (!this.model.enableTextSelection) {
                var droplet1 = document.getElementById(this._id + 'droplet1');
                var droplet2 = document.getElementById(this._id + 'droplet2');
                $(droplet1).hide();
                $(droplet2).hide();
                this._disableSelection();
            }
        },
        _onTextContainerMouseDown: function (e) {
            if (document.activeElement.id == this._id + '_toolbar_zoomSelection_wrapper') {
                $('#' + this._id + '_toolbar_zoomSelection_wrapper').blur();
            }
            if (!this.model.enableTextSelection) {
                this._dragx = e.pageX;
                this._dragy = e.pageY;
                this._dragstate = true;
            }
            var is_ie = navigator.userAgent.indexOf("MSIE") != -1 || !!document.documentMode == true;
            if (!(e.target.id == this._id + "_popupinnercontent") && !(e.target.id == this._id + "_popupcontent") && this.model.enableTextSelection && !is_ie) {
                this._enableSelection();
                $('.text_container').css("visibility", "");
                var target = e.target;
                this._waterDropletDivHide();
                $('#' + this._id + 'touchcustom-menu').hide();
                this._curYPos = e.clientY;
                this._curXPos = e.clientX;
                if ((!$(e.target).hasClass('text_container')) && (!$(e.target).hasClass('e-pdfviewer-viewercontainer')) && e.which != 3) {
                    this._curDown = true;
                    this._removeSearch = true;
                    var splittedText = e.target.id.split('text_')[1];
                    if (splittedText)
                        this._selectedValue = splittedText.split('_')[0];
                    this._selectionStartPage = parseInt(e.target.id.split("text_")[1]) || parseInt(e.target.id.split("selectioncanvas_")[1]) || parseInt(e.target.id.split("secondarycanvas_")[1]);
                }
                if ($('#' + this._id + 'custom-menu').css('display') == 'none' && e.which != 3 && !$(target).hasClass('e-pdfviewer-secondarycanvas')) {
                    this._clearSelector();
                }
                if (!$(target).hasClass('e-pdfviewer-formFields') && !$(target).hasClass('e-pdfviewer-ListBox') && !this._isFormFields && !$(target).hasClass('e-dropdownSelect'))
                    e.preventDefault();
            }
            else if (!this.model.enableTextSelection) {
                var secanvas = $('#' + this._id + 'selectioncanvas_' + (this._currentPage))[0].id;
                if (!this._isCanasResized && !this._isCanvasClicked && e.target.id == secanvas) {
                    e.target.style.cursor = "move";
                    e.target.style.cursor = "-webkit-grabbing";
                    e.target.style.cursor = "-moz-grabbing";
                    e.target.style.cursor = "grabbing";
                }
                this._disableSelection();
            }
        },
        _onTextContainerclick: function (e) {
            this._waterDropletDivHide();
            var target = e.target;
            if (e.originalEvent.detail == 2 && $(target).hasClass('e-pdfviewer-textLayer') && this.model.enableTextSelection) {
                e.preventDefault();
                this._clearAllOccurrences();
                this._enableSelection();
                this._getElementTouch(target, e.clientX, e.clientY, false);
                if (this._annotationActive && !this._isAnnotationSelected) {
                    if (this._isStrikeout) {
                        this._drawStrikeOutAnnotation();
                    } else if (this._isUnderline) {
                        this._drawUnderlineAnnotation();
                    } else if (this._isHighlight) {
                        this._drawHighlightAnnotation();
                    }
                }
                if (this._isAnnotationSelected) {
                    this._showPopupMenu(e);
                    this._clearSelector(e);
                }
                e.preventDefault();
            }
            if (e.originalEvent.detail == 3 && $(target).hasClass('e-pdfviewer-textLayer') && this.model.enableTextSelection) {
                this._enableSelection();
                if (!this._annotationActive)
                    this._selectingEntireLine(e);
            }
            else if (!this.model.enableTextSelection)
                this._disableSelection();
        },
        _onTextContainerMouseMove: function (e) {
            if (!this.model.enableTextSelection && (e.target.className != "e-pdfviewer-imagecanvasDraw") && e.target.tagName.toLowerCase() != 'a')
                $('#' + this._id + 'pageDiv_' + (this._currentPage)).css("cursor", "-webkit-grab");
            else if ((e.target.className != "e-pdfviewer-buttons") && e.target.tagName.toLowerCase() != 'a')
                e.target.style.cursor = "auto";
            var is_ie = navigator.userAgent.indexOf("MSIE") != -1 || !!document.documentMode == true;
            if (!(e.target.id == this._id + "_popupinnercontent") && !(e.target.id == this._id + "_popupcontent") && !(e.target.className == "e-pdfviewer-formFields")) {
                e.preventDefault();
                this._enableSelection();
                this._currentAnnotationRectangle = [];
                var pageNumber = parseInt(e.target.id.split("text_")[1]) || parseInt(e.target.id.split("selectioncanvas_")[1]) || parseInt(e.target.id.split("secondarycanvas_")[1]);
                if (pageNumber && !this._isPropertiesWindowOpen) {
                    if (!is_ie) {
                        var secanvas = document.getElementById(this._id + "_secondarycanvas_" + pageNumber);
                        this._onCanvasMousedown(secanvas, e.pageX, e.pageY);
                    }
                    if (this.model.enableTextMarkupAnnotations) {
                        if (!this._isPopupNoteVisible && !this._isContextMenuPresent) {
                            if (!is_ie)
                                this._contextClickPosition(e, pageNumber);
                            if (this._currentAnnotationRectangle.length != 0 && !is_ie) {
                                var annotation = this._currentAnnotationRectangle[0];
                                var annotationType = annotation.TextMarkupAnnotationType ? annotation.TextMarkupAnnotationType : annotation.type;
                                if (annotationType == "StrikeOut" && this.model.enableStrikethroughAnnotation) {
                                    this._showPopupNote(e);
                                    e.target.style.cursor = "pointer";
                                } else if (annotationType == "Underline" && this.model.enableUnderlineAnnotation) {
                                    this._showPopupNote(e);
                                    e.target.style.cursor = "pointer";
                                } else if (annotationType == "Highlight" && this.model.enableHighlightAnnotation) {
                                    this._showPopupNote(e);
                                    e.target.style.cursor = "pointer";
                                }
                            } else {
                                $('#' + this._id + '_popup_note').css({ 'display': 'none' });
                                if (this.model.enableTextSelection) {
                                    e.target.style.cursor = "auto";
                                    e.preventDefault();
                                    this._enableSelection();
                                }
                                else if (!this.model.enableTextSelection && !this._isCanasResized && !this._isCanvasClicked) {
                                    var pageDiv = $('#' + this._id + 'pageDiv_' + (this._currentPage))
                                    if (this._dragstate) {
                                        this._deltax = this._dragx - e.pageX;
                                        this._deltay = this._dragy - e.pageY;
                                        var vscrolvalue = $('#' + this._id + '_viewerContainer').scrollTop();
                                        var vscrolleft = $('#' + this._id + '_viewerContainer').scrollLeft();
                                        if (this._deltay > 3)
                                            $('#' + this._id + '_viewerContainer').scrollTop(vscrolvalue + 20);
                                        else if (this._deltay < -2)
                                            $('#' + this._id + '_viewerContainer').scrollTop(vscrolvalue - 20);
                                        if (this._deltax > 3)
                                            $('#' + this._id + '_viewerContainer').scrollLeft(vscrolleft + 20);
                                        else if (this._deltax < -2)
                                            $('#' + this._id + '_viewerContainer').scrollLeft(vscrolleft - 20);
                                        e.target.style.cursor = "move";
                                        e.target.style.cursor = "-webkit-grabbing";
                                        e.target.style.cursor = "-moz-grabbing";
                                        e.target.style.cursor = "grabbing";
                                        this._dragx = e.pageX;
                                        this._dragy = e.pageY;

                                    }
                                    else {
                                        e.target.style.cursor = "move";
                                        e.target.style.cursor = "-webkit-grab";
                                        e.target.style.cursor = "-moz-grab";
                                        e.target.style.cursor = "grab";
                                    }
                                }
                            }
                        }
                    }
                }
                $('.text_container').css("visibility", "");
                var curY, curX;
                var target = e.target;
                var splittedText = e.target.id.split('text_')[1];
                if (splittedText) {
                    var currentIndex = splittedText.split('_')[0];
                    if (currentIndex == this._selectedValue) {
                        this._isTextSelection = true;
                    }
                    else {
                        this._isTextSelection = false;
                    }
                }
                if (window.getSelection().toString()) {
                    if (this._selectionPages.indexOf(pageNumber) == -1 && pageNumber && pageNumber != 0) {
                        this._selectionPages.push(pageNumber);
                    }
                } else {
                    this._selectionPages = new Array();
                }
                this.pageY = e.pageY;
                if (this._curDown == true && ($('#' + this._id + 'custom-menu').css('display') == 'none')) {
                    if (this._removeSearch) {
                        this._clearAllOccurrences();
                        this._removeSearch = false;
                    }
                    curY = e.clientY;
                    curX = e.clientX;
                    if (this._currentAnnotationRectangle.length == 0 || (this._annotationActive && this._isTextSelection)) {
                        var point = this._getWordAtPoint(target, curX, curY);
                    }
                    e.preventDefault();
                }
            }
        },
        _onTextContainerMouseLeave: function (e) {
            if (!(e.target.id == this._id + "_popupinnercontent") && !(e.target.id == this._id + "_popupcontent") && this.model.enableTextSelection) {
                this._enableSelection();
                if (this._curDown == true) {
                    var instance = this;
                    var value;
                    e.preventDefault();
                    var vscrolvalue = $('#' + this._id + '_viewerContainer');
                    var documentHeight = $(vscrolvalue).offset().top;
                    if (e.clientY > documentHeight) {
                        this._scrollMove = setInterval(function () {
                            $(vscrolvalue).animate({ scrollTop: $(vscrolvalue).scrollTop() + (200) }, 'fast');
                        }, 500);
                    }
                    else {
                        this._scrollMove = setInterval(function () {
                            $(vscrolvalue).animate({ scrollTop: $(vscrolvalue).scrollTop() - (200) }, 'fast');
                        }, 500);
                    }
                    $(window).on('mouseup', function (e) {
                        this._curDown = false;
                        instance._onMouseClickedOutside(e);
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    });
                }
            }
            else if (!this.model.enableTextSelection) {
                var instances = this;
                $(window).on('mouseup', function (e) {
                    instances._dragstate = false;
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                });
                this._disableSelection();
            }
        },
        _onTextContainerMouseEnter: function (e) {
            if (!(e.target.id == this._id + "_popupinnercontent") && !(e.target.id == this._id + "_popupcontent") && this.model.enableTextSelection) {
                this._enableSelection();
                if (this._scrollMove)
                    clearInterval(this._scrollMove);
            }
            else if (!this.model.enableTextSelection)
                this._disableSelection();
        },
        _onMouseClickedOutside: function (e) {
            this._curDown = false;
            if (this._scrollMove)
                clearInterval(this._scrollMove);
            e.preventDefault();
            e.stopPropagation();
        },
        _onTextContainerDragStart: function (e) {
            e.preventDefault();// cancel the native drag event chain
        },
        _clearSelector: function (e) {
            if (window.getSelection) {
                if (window.getSelection().removeAllRanges) {  // Firefox
                    window.getSelection().removeAllRanges();
                }
                else if (document.selection) {  // IE?
                    document.selection.empty();
                }
            }
        },
        _createContextMenu: function (e) {
            var containerDiv = document.createElement("div");//create a new div
            var pageviewcontainer = $('#' + this._id + '_pageviewContainer');
            containerDiv.id = this._id + "custom-menu";
            containerDiv.className = "e-pdfviewer-custom-menu";
            pageviewcontainer.append(containerDiv);
            var orderedList = document.createElement('ol');
            orderedList.className = 'orderedList'
            containerDiv.appendChild(orderedList);
            var searchText = window.getSelection().toString();
            $(orderedList).append("<li class='copyli'><a href='javascript:void(0);' class='copy'>Copy</a></li>");
            $(orderedList).append("<li class='googlesearchli'><a href='javascript:void(0);' class='googleSearch'>Search Google For </a></li>");
            $(orderedList).append("<li class='e-highlight-textli'><a href='javascript:void(0);' id = '" + this._id + "_highlight_contextmenu' class='e-highlight-text'>Highlight Text </a></li>");
            $(orderedList).append("<li class='e-strikeout-textli'><a href='javascript:void(0);' id = '" + this._id + "_strikeout_contextmenu' class='e-strikeout-text'>Strikethrough Text </a></li>");
        },
        _createTouchContextMenu: function (e) {
            var containerDiv = document.createElement("div");//create a new div
            var pageviewcontainer = $('#' + this._id + '_pageviewContainer');
            containerDiv.id = this._id + "touchcustom-menu";
            containerDiv.className = "e-pdfviewer-touchcustom-menu";
            pageviewcontainer.append(containerDiv);
            var searchText = window.getSelection().toString();
            $(containerDiv).append("<div class='e-pdfviewer-touchCopy'><a href='javascript:void(0);' class='copy'>Copy</a></div>");
            $(containerDiv).append("<div class='e-pdfviewer-touchDot'><a href='javascript:void(0);' class='googleSearch'>Search</a></div>");
        },
        _onTextKeyboardCopy: function (e) {
            if (e.ctrlKey && e.keyCode == 67) {
                e.preventDefault();
                if (!this._isCopyRestrict)
                    this._copySelectedText(e);
            }
        },
        _copySelectedText: function (e) {
            if (!this._isCopyRestrict && this._searchedText && this._searchedText.length > 0 && this._searchedText != "" && this.model.enableTextSelection) {
                this._enableSelection();
                if (window.clipboardData && window.clipboardData.setData) {
                    var data = clipboardData.setData("Text", this._searchedText);
                    if ($('#' + this._id + 'custom-menu'))
                        $('#' + this._id + 'custom-menu').hide();
                    return data;
                } else {
                    var textarea = document.createElement("textarea");
                    $(textarea).css("contenteditable", "true");
                    textarea.textContent = this._searchedText
                    textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
                    document.body.appendChild(textarea);
                    textarea.select();
                }
                try {
                    return document.execCommand("copy");
                } catch (ex) {
                    console.warn("Copy to clipboard failed.", ex);
                } finally {
                    if (textarea)
                        document.body.removeChild(textarea);
                    $('#' + this._id + 'custom-menu').hide();
                }

                e.preventDefault();
            }
            else {
                if (!this._isCopyRestrict && this.model.enableTextSelection) {
                    this._enableSelection();
                    var searchText = window.getSelection().getRangeAt(0).toString();
                    var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
                    if (window.clipboardData && window.clipboardData.setData) {
                        var data = clipboardData.setData("Text", searchText);
                        if ($('#' + this._id + 'custom-menu'))
                            $('#' + this._id + 'custom-menu').hide();
                        return data;

                    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
                        var selection = window.getSelection();
                        var range = document.createRange();
                        var position = selection.anchorNode.compareDocumentPosition(selection.focusNode)
                        var backward = false;
                        if (!position && selection.anchorOffset > selection.focusOffset ||
                            position === Node.DOCUMENT_POSITION_PRECEDING)
                            backward = true;
                        if (backward) {
                            range.setStart(selection.focusNode, selection.focusOffset);
                            range.setEnd(selection.anchorNode, selection.anchorOffset);
                        }
                        else {
                            range.setStart(selection.anchorNode, selection.anchorOffset);
                            range.setEnd(selection.focusNode, selection.focusOffset);
                        }
                        var textarea = document.createElement("textarea");
                        $(textarea).css("contenteditable", "true");
                        textarea.textContent = searchText;
                        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
                        document.body.appendChild(textarea);
                        textarea.select();
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                    try {
                        return document.execCommand("copy");
                    } catch (ex) {
                        console.warn("Copy to clipboard failed.", ex);
                    } finally {
                        document.body.removeChild(textarea);
                        $('#' + this._id + 'custom-menu').hide();
                    }

                    e.preventDefault();
                }
            }
        },
        _openInNewTab: function () {
            var searchText;
            if (this._searchedText && this._searchedText.length > 0 && this._searchedText != "")
                searchText = this._searchedText;
            else
                var searchText = window.getSelection().toString();
            var url = "http://www.google.com/search?q=" + searchText;
            var win = window.open(url, '_blank');
            win.focus();
            $('#' + this._id + 'custom-menu').hide();
        },
        _waterDropletDivHide: function (e) {
            $(document.getElementById(this._id + 'droplet1')).hide();
            $(document.getElementById(this._id + 'droplet2')).hide();
        },
        _getWordAtPoint: function (elem, x, y) {
            if (!this._isPopupNoteFocused && !this._isCanvasClicked && !this._isCanasResized) {
                if (elem.nodeType == elem.TEXT_NODE) {
                    var backward = false;
                    this._isBackwardSelection = false;
                    var range = elem.ownerDocument.createRange();
                    var selection = window.getSelection();
                    if (selection.anchorNode != null) {
                        var position = selection.anchorNode.compareDocumentPosition(selection.focusNode)
                        if (!position && selection.anchorOffset > selection.focusOffset ||
                            position === Node.DOCUMENT_POSITION_PRECEDING) {
                            backward = true;
                            this._isBackwardSelection = true;
                        }
                    }
                    range.selectNodeContents(elem);
                    var currentPos = 0;
                    var endPos = range.endOffset;
                    while (currentPos < endPos) {
                        range.setStart(elem, currentPos);
                        range.setEnd(elem, currentPos + 1);
                        if (range.getBoundingClientRect().left <= x && range.getBoundingClientRect().right >= x &&
                            range.getBoundingClientRect().top <= y && range.getBoundingClientRect().bottom >= y) {
                            var singleWord = range.toString();
                            if (selection.anchorNode != null && selection.anchorNode.parentNode.className == "e-pdfviewer-textLayer")
                                range.setStart(selection.anchorNode, selection.anchorOffset);
                            selection.removeAllRanges();
                            selection.addRange(range);
                            if (backward)
                                selection.extend(elem, currentPos);
                            else
                                selection.extend(elem, currentPos + 1);
                            range.detach();
                            this._isTextSelection = true;
                            return (singleWord);
                        }
                        currentPos += 1;
                    }
                } else {
                    for (var i = 0; i < elem.childNodes.length; i++) {
                        var range = elem.childNodes[i].ownerDocument.createRange();
                        range.selectNodeContents(elem.childNodes[i]);
                        if (range.getBoundingClientRect().left <= x && range.getBoundingClientRect().right >= x &&
                            range.getBoundingClientRect().top <= y && range.getBoundingClientRect().bottom >= y) {
                            range.detach();
                            this._isTextSelection = true;
                            return (this._getWordAtPoint(elem.childNodes[i], x, y));
                        } else {
                            range.detach();
                        }
                    }
                }
                this._isTextSelection = false;
                return (null);
            }
        },
        _getElementTouch: function (elem, x, y, type) {
            if (elem.nodeType == elem.TEXT_NODE) {
                var selection = window.getSelection();
                var range = elem.ownerDocument.createRange();
                range.selectNodeContents(elem);
                var currentPos = 0;
                var endPos = range.endOffset;
                while (currentPos < endPos) {
                    range.setStart(elem, currentPos);
                    range.setEnd(elem, currentPos + 1);
                    if (range.getBoundingClientRect().left <= x && range.getBoundingClientRect().right >= x &&
                        range.getBoundingClientRect().top <= y && range.getBoundingClientRect().bottom >= y) {
                        var singleWord = range.toString();
                        var textContent = elem.textContent;
                        var indices = [];
                        var startPos, endPos;
                        for (var i = 0; i < textContent.length; i++) {
                            if (textContent[i] == " ") indices.push(i);
                        }
                        for (var j = 0; j < indices.length; j++) {
                            if (currentPos == indices[j]) {
                                startPos = indices[j];
                                endPos = indices[j];
                            }
                            if (indices[0] > currentPos) {
                                startPos = 0;
                                endPos = indices[j];
                                break;
                            }
                            if (currentPos > indices[j] && currentPos < indices[j + 1]) {
                                startPos = indices[j];
                                endPos = indices[j + 1];
                            }
                            else if (currentPos > indices[j]) {
                                if (!indices[j + 1])
                                    startPos = indices[j];
                            }
                        }
                        this.startelem = startPos;
                        this.endelem = endPos;
                        if (startPos == 0)
                            range.setStart(elem, startPos);
                        else
                            range.setStart(elem, startPos + 1);
                        range.setEnd(elem, endPos);
                        selection.removeAllRanges();
                        selection.addRange(range);
                        if (type && this.model.enableTextSelection) {
                            var rangesPosition = range.getBoundingClientRect();
                            this._rangePosition = rangesPosition;
                            this._ranges = true;
                            this._selectedRanges = range;
                            var droplet1 = document.getElementById(this._id + 'droplet1');
                            var droplet2 = document.getElementById(this._id + 'droplet2');
                            var width = $(droplet1).width();
                            var height = $(droplet1).height();
                            $(droplet1).show();
                            $(droplet1).offset({ "top": rangesPosition.top + window.scrollY + (height / 2), "left": rangesPosition.left - width }).show();
                            $(droplet2).show();
                            $(droplet2).offset({ "top": rangesPosition.top + window.scrollY + (height / 2), "left": rangesPosition.left + rangesPosition.width - width }).show();
                        }
                        else if (!this.model.enableTextSelection) {
                            this._disableSelection();
                            var touchmenu = document.getElementById(this._id + 'touchcustom-menu');
                            $(touchmenu).hide();
                            this._waterDropletDivHide();
                        }
                        range.detach();
                        return (singleWord);
                    }
                    currentPos += 1;
                }
            } else {
                for (var i = 0; i < elem.childNodes.length; i++) {
                    var range = elem.childNodes[i].ownerDocument.createRange();
                    range.selectNodeContents(elem.childNodes[i]);
                    if (range.getBoundingClientRect().left <= x && range.getBoundingClientRect().right >= x &&
                        range.getBoundingClientRect().top <= y && range.getBoundingClientRect().bottom >= y) {
                        range.detach();
                        return (this._getElementTouch(elem.childNodes[i], x, y, type));
                    } else {
                        range.detach();
                    }
                }
            }
            return (null);
        },

        _preventClick: function (event) {
            var element;
            if ($(event.target).hasClass('e-pdfviewer-toolbarli-label')) {
                element = event.target;
                $(element).removeClass('e-active');
                $(element).removeClass('e-hover');
            } else {
                element = $(event.target).parents(".e-pdfviewer-toolbarli-label");
                element.removeClass('e-active');
                element.removeClass('e-hover');
            }
        },

        _toolbarHover: function (event) {
            if ($(event.target).hasClass('e-pdfviewer-toolbarli-label') || $(event.target).parents().hasClass('e-pdfviewer-toolbarli-label')) {
                var element;
                if ($(event.target).hasClass('e-pdfviewer-toolbarli-label')) {
                    element = event.target;
                    $(element).removeClass('e-hover');
                } else {
                    element = $(event.target).parents(".e-pdfviewer-toolbarli-label");
                    element.removeClass('e-hover');
                }
            }
        },

        _toolbarClick: function (event) {
            var noteElement = $('#' + this._id + '_popup_note');
            if (noteElement) {
                 noteElement.hide();
            }
            var targetItem = event.target
            var clickedItem = event.target;
            if (this._isToolbarClick) {
                $('#' + this._id + '_rptTooltip').css('display', 'none');
                if (!($(clickedItem).hasClass("e-pdfviewer-highlight-markup") ||
                    $(clickedItem).hasClass("e-pdfviewer-strikeout-markup") ||
                    $(clickedItem).hasClass("e-pdfviewer-underline-markup") || $(clickedItem).hasClass("e-pdfviewer-toolbar-highlight") || $(clickedItem).hasClass("e-pdfviewer-toolbar-underline") || $(clickedItem).hasClass("e-pdfviewer-toolbar-strikeout") || $(clickedItem).hasClass("e-pdfviewer-dropdown-wrapper") || $(clickedItem).hasClass("e-pdfviewer-dropdown-arrow"))) {
                    this._selectionNodes = window.getSelection();
                    this._maintainSelection();
                    document.getElementById(this._id + '_pdfviewer_colorpicker').style.display = 'none';
                    this._isToolbarColorPicker = false;
                }
                if ($(clickedItem).hasClass("e-pdfviewer-highlight-markup") ||
                    $(clickedItem).hasClass("e-pdfviewer-strikeout-markup") ||
                    $(clickedItem).hasClass("e-pdfviewer-underline-markup") || $(clickedItem).hasClass("e-pdfviewer-toolbar-highlight") || $(clickedItem).hasClass("e-pdfviewer-toolbar-underline") || $(clickedItem).hasClass("e-pdfviewer-toolbar-strikeout")) {
                    document.getElementById(this._id + '_pdfviewer_colorpicker').style.display = 'none';
                    this._isToolbarColorPicker = false;
                }
                this._displaySearch = false;
                this._isDefaultColorSet = false;
                if ($(clickedItem).hasClass('e-pdfviewer-toolbarli')) {
                    clickedItem = $(clickedItem).find('span');
                }
                if ($(clickedItem).hasClass("e-pdfviewer-print")) {
                    if (!this._isPrintRestrict)
                        this._print();
                }
                else if ($(clickedItem).hasClass("e-pdfviewer-download")) {
                    this._isAsynchronousDownload = true;
                    this._cancelDownloads = false;
                    var downloaded = new Object();
                    downloaded.fileName = this._downloadfileName;
                    downloaded.status = "is started"
                    this._raiseClientEvent("downloadStart", downloaded);
                    if (this._cancelDownloads)
                        return;
                    this._saveFormFieldsValue();
                }
                else if ($(clickedItem).hasClass("e-pdfviewer-gotofirst") && !($(clickedItem).hasClass("e-pdfviewer-disabled"))) {
                    this._gotoFirstPage();
                }
                else if ($(clickedItem).hasClass("e-pdfviewer-gotolast") && !($(clickedItem).hasClass("e-pdfviewer-disabled"))) {
                    this._gotoLastPage();
                }
                else if ($(clickedItem).hasClass("e-pdfviewer-gotonext") && !($(clickedItem).hasClass("e-pdfviewer-disabled"))) {
                    this._gotoNextPage();
                }
                else if ($(clickedItem).hasClass("e-pdfviewer-gotoprevious") && !($(clickedItem).hasClass("e-pdfviewer-disabled"))) {
                    this._gotoPreviousPage();
                }
                else if ($(clickedItem).hasClass("e-pdfviewer-zoomin")) {
                    this._applyLowerZoomIndex();
                    this._zoomIn();
                }
                else if ($(clickedItem).hasClass("e-pdfviewer-select") || $(clickedItem).hasClass("e-pdfviewer-toolbar-select")) {
                    this._highlightSelectItems();
                }
                else if ($(clickedItem).hasClass("e-pdfviewer-scroll") || $(clickedItem).hasClass("e-pdfviewer-toolbar-scroll")) {
                    this._highlightScrollItems();
                }
                else if ($(clickedItem).hasClass("e-pdfviewer-sign") || $(clickedItem).hasClass("e-pdfviewer-toolbar-sign")) {
                    this._showSignatureDialog();
                }
                else if ($(clickedItem).hasClass("e-pdfviewer-zoomout")) {
                    this._applyHigherZoomIndex();
                    this._zoomOut();
                }
                /*  * The event handler for the click event of the fiWidth and fitPage operations are given below. 
                    * The handler is chosen based on the id name of the target element. 
                */
                else if ($(clickedItem).hasClass("e-pdfviewer-fitpage") || $(clickedItem).hasClass("e-pdfviewer-fitwidth")) {
                    var clickedSpan = clickedItem;
                    var spanId = $(clickedSpan).attr('id');
                    switch (spanId) {
                        case this._id + "_fitWidth":
                            this._applyFitToWidth();
                            break;
                        case this._id + "_fitPage":
                            this._applyFitToPage();
                            break;
                    }
                }
                else if ($(clickedItem).hasClass('e-pdfviewer-find')) {
                    this._displaySearchBox();
                } else if ($(clickedItem).hasClass("e-pdfviewer-highlight-markup") || $(clickedItem).hasClass("e-pdfviewer-toolbar-highlight")) {
                    if (this.model.enableTextMarkupAnnotations && this.model.enableHighlightAnnotation) {
                        this._drawColor = null;
                        this._toolbarColorpickerObject.option("value", this.model.highlightSettings.color);
                        this._isDefaultColorSet = true;
                        this._initHighlight();
                        this._highlightSelectItems();
                    }
                } else if ($(clickedItem).hasClass("e-pdfviewer-underline-markup") || $(clickedItem).hasClass("e-pdfviewer-toolbar-underline")) {
                    if (this.model.enableTextMarkupAnnotations && this.model.enableUnderlineAnnotation) {
                        this._drawColor = null;
                        this._toolbarColorpickerObject.option("value", this.model.underlineSettings.color);
                        this._isDefaultColorSet = true;
                        this._initUnderline();
                        this._highlightSelectItems();
                    }
                } else if ($(clickedItem).hasClass("e-pdfviewer-strikeout-markup") || $(clickedItem).hasClass("e-pdfviewer-toolbar-strikeout")) {
                    if (this.model.enableTextMarkupAnnotations && this.model.enableStrikethroughAnnotation) {
                        this._drawColor = null;
                        this._toolbarColorpickerObject.option("value", this.model.strikethroughSettings.color);
                        this._isDefaultColorSet = true;
                        this._initStrikeOut();
                        this._highlightSelectItems();
                    }
                } else if ($(clickedItem).hasClass("e-pdfviewer-dropdown-wrapper") || $(clickedItem).hasClass("e-pdfviewer-dropdown-arrow")) {
                    var liItem = $(clickedItem).parents('.e-pdfviewer-toolbarli');
                    if (liItem.hasClass('e-pdfviewer-toolbar-underline')) {
                        if (this.model.enableTextMarkupAnnotations && this.model.enableUnderlineAnnotation) {
                            this._displayColorPicker('Underline');
                            this._setPickerPosition(liItem[0]);
                            this._isUnderlineEnabled = false;
                            this._initUnderline();
                            this._highlightSelectItems();
                        }
                    } else if (liItem.hasClass('e-pdfviewer-toolbar-highlight')) {
                        if (this.model.enableTextMarkupAnnotations && this.model.enableHighlightAnnotation) {
                            this._displayColorPicker('Highlight');
                            this._setPickerPosition(liItem[0]);
                            this._isHighlightEnabled = false;
                            this._initHighlight();
                            this._highlightSelectItems();
                        }
                    } else if (liItem.hasClass('e-pdfviewer-toolbar-strikeout')) {
                        if (this.model.enableTextMarkupAnnotations && this.model.enableStrikethroughAnnotation) {
                            this._displayColorPicker('StrikeOut');
                            this._setPickerPosition(liItem[0]);
                            this._isStrikeOutEnabled = false;
                            this._initStrikeOut();
                            this._highlightSelectItems();
                        }
                    }
                }
            }
        },
        _enableSelectionOnly: function () {
            if ($('#' + this._id + '_pdfviewer_toolbar_select').hasClass('e-disable')) {
                this.model.enableTextSelection = false;
                this._toolbar.deselectItemByID(this._id + '_pdfviewer_toolbar_select');
                this._toolbar.selectItemByID(this._id + '_pdfviewer_toolbar_scroll');
            }
            else if (!this._isCopyRestrict) {
                this.model.enableTextSelection = true;
                this._enableSelection();
            }
        },
        _enableScrollingOnly: function () {
            this.model.enableTextSelection = false;
            this._disableSelection();
        },
        _highlightSelectItems: function () {
            this._toolbar.selectItemByID(this._id + '_pdfviewer_toolbar_select');
            this._toolbar.deselectItemByID(this._id + '_pdfviewer_toolbar_scroll');
            this._enableSelectionOnly();
        },
        _highlightScrollItems: function () {
            this._toolbar.deselectItemByID(this._id + '_pdfviewer_toolbar_select');
            this._toolbar.selectItemByID(this._id + '_pdfviewer_toolbar_scroll');
            this._waterDropletDivHide();
            this._enableScrollingOnly();
        },
        _cancelDownload: function () {
            this._cancelDownloads = true;
            if (this._ajaxDownloaded != null) {
                this._ajaxDownloaded.abort();
                this._ajaxDownloaded = null;
            }
        },
        _save: function (data) {
            var filename;
            if (this.fileName.indexOf('\\') == -1) {
                filename = this.fileName;
            } else
                filename = this.fileName.replace(/^.*[\\\/]/, '')
            var browserUserAgent = navigator.userAgent;
            var url = '';
            var blob = this._base64toBlob(data["documentStream"], 'application/pdf', 512);
            if (browserUserAgent.indexOf('Edge') == -1) {
                if ((browserUserAgent.indexOf("Firefox")) != -1 || (browserUserAgent.indexOf("Chrome")) != -1 || (browserUserAgent.indexOf("Safari")) != -1 || (browserUserAgent.indexOf("AppleWebKit")) != -1) {
                    this._download(blob, url, filename);
                }
                else
                    window.navigator.msSaveOrOpenBlob(blob, filename);
            }
            else
                window.navigator.msSaveOrOpenBlob(blob, filename);
        },
        _base64toBlob: function (b64Data, contentType, sliceSize) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;
            var byteCharacters = atob(b64Data);
            var byteArrays = [];
            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);
                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
                var byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }
            var blob = new Blob(byteArrays, { type: contentType });
            return blob;
        },
        _createBlob: function (data, contentType) {
            if (typeof Blob !== 'undefined') {
                return new Blob([data], { type: contentType });
            }
            warn('The "Blob" constructor is not supported.');
        },

        _download: function (blob, url, filename) {
            var blobUrl = URL.createObjectURL(blob);
            var a = document.createElement('a');
            if (a.click) {
                a.href = blobUrl;
                a.target = '_parent';
                if ('download' in a) {
                    a.download = filename;
                }
                (document.body || document.documentElement).appendChild(a);
                a.click();
                a.parentNode.removeChild(a);
            } else {
                if (window.top === window &&
                    blobUrl.split('#')[0] === window.location.href.split('#')[0]) {
                    var padCharacter = blobUrl.indexOf('?') === -1 ? '?' : '&';
                    blobUrl = blobUrl.replace(/#|$/, padCharacter + '$&');
                }
                window.open(blobUrl, '_parent');
            }
        },

        _showToolbar: function (showToolbar) {
            if (showToolbar) {
                $('#' + this._id + '_toolbarContainer').css("display", "block");
                this._setSearchToolbarTop();
                this._isToolbarHidden = false;
            }
            else {
                $('#' + this._id + '_toolbarContainer').css("display", "none");
                if (this._isFindboxPresent) {
                    this._displaySearchBox();
                }
                this._isToolbarHidden = true;
            }
            this._setViewerContainerHeight();
        },
        _setViewerContainerHeight: function () {
            var ctrlheight = document.getElementById(this._id).clientHeight;
            var viewerblockHeight = 0;
            if (!this._isDevice) {
                var viewerContainer = $('#' + this._id + '_viewBlockContainer');
                if (viewerContainer.css('display').toLowerCase() == 'block') {
                    viewerblockHeight = viewerContainer.height();
                }
            }
            var toolbarHeight = this.model.toolbarSettings.templateId ? $('#' + this.model.toolbarSettings.templateId).height() : $('#' + this._id + '_toolbarContainer').height();
            var toolbarContainer = $('#' + this._id + '_toolbarContainer').css("display");
            if (toolbarContainer.toLowerCase() == 'block') {
                var calcHeight = ctrlheight - viewerblockHeight - toolbarHeight - 4;
            }
            else if (toolbarContainer.toLowerCase() == 'none') {
                var calcHeight = ctrlheight - viewerblockHeight - 4;
            }
            $('#' + this._id + '_viewerContainer').css({ "height": calcHeight + "px" });
        },
        _initToolbar: function () {
            this._isToolbarClick = false;

            if (!this.model.toolbarSettings.templateId) {
                if (!this._isDevice) {
                    var zoomddl = $('#' + this._id + '_toolbar_zoomSelection').data('ejDropDownList');
                    if (zoomddl) {
                        zoomddl._selectItemByIndex(0);
                        zoomddl.disable();
                    }

                    $('#' + this._id + '_txtpageNo').attr('disabled', 'disabled');
                    if (this._toolbar) {
                        this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_gotofirst');
                        this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_gotoprevious');
                        this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_gotonext');
                        this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_gotolast');
                    }
                }
            }
        },

        _enableToolbarItems: function () {
            this._isToolbarClick = true;
            if (this.model && !this.model.toolbarSettings.templateId) {
                if (!this._isDevice) {
                    $('#' + this._id + '_txtpageNo').removeAttr('disabled');
                    $('#' + this._id + '_toolbar_zoomSelection').data('ejDropDownList').enable();
                }
            }
        },
        //-------------------- Toolbar Actions[End] -------------------------//

        //-------------------- Tooltip Localization Actions[Start]------------------------//
        _showLocalizationTooltip: function (event) {
            if ($('#' + this._id + '_rptTooltip').css('display') == 'none') {
                this._showLocaleTooltip(event);
            }
        },

        _hideLocalizationTooltip: function (event) {
            $('#' + this._id + '_rptTooltip').css('display', 'none');
        },

        _showLocaleTooltip: function (event) {
            var currentItem = event.target;
            var TagPos;
            var headerTxt, contentTxt;
            if (currentItem.id == this._id + '_pdfviewer_findlabel') {
                var label = $('#' + this._id + '_pdfviewer_findlabel')[0];
                if (label.scrollWidth > $(label).innerWidth()) {
                    if (label)
                        TagPos = label.getBoundingClientRect();
                    var localeObj = ej.PdfViewer.Locale[this.model.locale] ? ej.PdfViewer.Locale[this.model.locale] : ej.PdfViewer.Locale["default"];
                    headerTxt = '';
                    contentTxt = localeObj['contextMenu']['Find']['contentText'];
                }
            }
            if (currentItem.id == this._id + '_pdfviewer_matchlabel') {
                var label = $('#' + this._id + '_pdfviewer_matchlabel')[0];
                if (label.scrollWidth > $(label).innerWidth()) {
                    if (label)
                        TagPos = label.getBoundingClientRect();
                    var localeObj = ej.PdfViewer.Locale[this.model.locale] ? ej.PdfViewer.Locale[this.model.locale] : ej.PdfViewer.Locale["default"];
                    headerTxt = '';
                    contentTxt = localeObj['contextMenu']['matchCase']['contentText'];
                }
            }
            if (contentTxt) {
                var maxZindex = this._viewerMaxZindex();
                $('#' + this._id + '_rptTooltip_Header').html(headerTxt);
                $('#' + this._id + '_rptTooltip_Content').html(contentTxt);
                var toolbarPosition = document.getElementById(this._id + "_pdfviewer_searchbox").getBoundingClientRect();
                var mainToolbarPosition = $('#' + this._id + '_toolbarContainer')[0].getBoundingClientRect();
                var windowWidth = this.element[0].clientWidth;
                var minimunWidth = parseFloat($('#' + this._id + '_rptTooltip').css('min-width'));
                if (windowWidth <= (TagPos.left) + (minimunWidth)) {
                    $('#' + this._id + '_rptTooltip').css({ 'zIndex': maxZindex + 1, 'top': ((TagPos.top - toolbarPosition.top + toolbarPosition.height)) - 18, 'left': ((TagPos.left - mainToolbarPosition.left) + (TagPos.width / 2) - minimunWidth), 'display': 'block', 'position': 'absolute' });
                    var currentLeft = parseFloat($('#' + this._id + '_rptTooltip').css("left"));
                    if (currentLeft < 0) {
                        $('#' + this._id + '_rptTooltip').css("left", "0px");
                    }
                }
                else if (windowWidth <= (TagPos.left) + 2 * (TagPos.width)) {
                    $('#' + this._id + '_rptTooltip').css({ 'zIndex': maxZindex + 1, 'top': ((TagPos.top - toolbarPosition.top + toolbarPosition.height)) - 18, 'left': ((TagPos.left - mainToolbarPosition.left) - (3 * TagPos.width)), 'display': 'block', 'position': 'absolute' });
                }
                else {
                    $('#' + this._id + '_rptTooltip').css({ 'zIndex': maxZindex + 1, 'top': ((TagPos.top - toolbarPosition.top + toolbarPosition.height)) - 18, 'left': ((TagPos.left - mainToolbarPosition.left) + (TagPos.width / 2)), 'display': 'block', 'position': 'absolute' });
                }
            }
        },

        _showIconToolTip: function (event) {
            if ($('#' + this._id + '_rptTooltip').css('display') == 'none') {
                this._showTooltipContent(event);
            }
        },

        _hideIconToolTip: function () {
            $('#' + this._id + '_rptTooltip').css('display', 'none');
        },

        _viewpopupBlockNone: function (jqueryEement) {
            if (jqueryEement.css('display') == 'block') {
                return false;
            } else {
                return true;
            }
        },

        _showTooltipContent: function (event) {
            var currentToolbarItem = event.target;
            if (this.model && this.model.toolbarSettings.showTooltip && !this._isDevice) {
                var TagPos;
                var toolTipText;
                var isShowTooltip = true;
                if ($(currentToolbarItem).hasClass('e-pdfviewer-toolbarli')) {
                    currentToolbarItem = $(currentToolbarItem).find('span');
                }
                var disabledItem = $(currentToolbarItem).prev();
                if ($(currentToolbarItem).hasClass("e-pdfviewer-print")) {
                    var printId = $('#' + this._id + '_toolbarContainer .e-pdfviewer-print')[0];
                    if (printId)
                        TagPos = printId.getBoundingClientRect();
                    else
                        TagPos = $('#' + this._id + '_toolbarContainer_hiddenlist .e-pdfviewer-print')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('print');
                }
                if ($(currentToolbarItem).hasClass("e-pdfviewer-download")) {
                    var printId = $('#' + this._id + '_toolbarContainer .e-pdfviewer-download')[0];
                    if (printId)
                        TagPos = printId.getBoundingClientRect();
                    else
                        TagPos = $('#' + this._id + '_toolbarContainer_hiddenlist .e-pdfviewer-download')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('download');
                }
                else if (($(currentToolbarItem).hasClass("e-pdfviewer-gotofirst")) || ($(disabledItem).hasClass('e-pdfviewer-gotofirst'))) {
                    var gotoFirstId = $('#' + this._id + '_toolbarContainer .e-pdfviewer-gotofirst')[0];
                    if (gotoFirstId)
                        TagPos = gotoFirstId.getBoundingClientRect();
                    else
                        TagPos = $('#' + this._id + '_toolbarContainer_hiddenlist .e-pdfviewer-gotofirst')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('first');
                }
                else if (($(currentToolbarItem).hasClass("e-pdfviewer-gotolast")) || ($(disabledItem).hasClass('e-pdfviewer-gotolast'))) {
                    var gotoLastId = $('#' + this._id + '_toolbarContainer .e-pdfviewer-gotolast')[0];
                    if (gotoLastId)
                        TagPos = gotoLastId.getBoundingClientRect();
                    else
                        TagPos = $('#' + this._id + '_toolbarContainer_hiddenlist .e-pdfviewer-gotolast')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('last');
                }
                else if (($(currentToolbarItem).hasClass("e-pdfviewer-gotonext")) || ($(disabledItem).hasClass('e-pdfviewer-gotonext'))) {
                    var gotoNextId = $('#' + this._id + '_toolbarContainer .e-pdfviewer-gotonext')[0];
                    if (gotoNextId)
                        TagPos = gotoNextId.getBoundingClientRect();
                    else
                        TagPos = $('#' + this._id + '_toolbarContainer_hiddenlist .e-pdfviewer-gotonext')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('next');
                }
                else if (($(currentToolbarItem).hasClass("e-pdfviewer-gotoprevious")) || ($(disabledItem).hasClass('e-pdfviewer-gotoprevious'))) {
                    var gotoPreviousId = $('#' + this._id + '_toolbarContainer .e-pdfviewer-gotoprevious')[0];
                    if (gotoPreviousId)
                        TagPos = gotoPreviousId.getBoundingClientRect();
                    else
                        TagPos = $('#' + this._id + '_toolbarContainer_hiddenlist .e-pdfviewer-gotoprevious')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('previous');
                }
                else if (($(currentToolbarItem).hasClass("e-pdfviewer-zoomin")) || ($(disabledItem).hasClass('e-pdfviewer-zoomin'))) {
                    var zoomInId = $('#' + this._id + '_toolbarContainer .e-pdfviewer-zoomin')[0];
                    if (zoomInId)
                        TagPos = zoomInId.getBoundingClientRect();
                    else
                        TagPos = $('#' + this._id + '_toolbarContainer_hiddenlist .e-pdfviewer-zoomin')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('zoomin');
                }
                else if (($(currentToolbarItem).hasClass("e-pdfviewer-zoomout")) || ($(disabledItem).hasClass('e-pdfviewer-zoomout'))) {
                    var zoomOutId = $('#' + this._id + '_toolbarContainer .e-pdfviewer-zoomout')[0];
                    if (zoomOutId)
                        TagPos = zoomOutId.getBoundingClientRect();
                    else
                        TagPos = $('#' + this._id + '_toolbarContainer_hiddenlist .e-pdfviewer-zoomout')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('zoomout');
                }
                else if ($(currentToolbarItem).hasClass("e-pdfviewer-tbpage") || $(currentToolbarItem).hasClass("e-pdfviewer-pagenumber") || $(currentToolbarItem).hasClass("e-pdfviewer-labelpageno")) {
                    var pageNumberId = $('#' + this._id + '_toolbarContainer .e-pdfviewer-tbpage')[0];
                    if (pageNumberId)
                        TagPos = pageNumberId.getBoundingClientRect();
                    else
                        TagPos = $('#' + this._id + '_toolbarContainer_hiddenlist .e-pdfviewer-tbpage')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('pageIndex');
                }
                else if ($(currentToolbarItem).hasClass("e-pdfviewer-ejdropdownlist") || $(currentToolbarItem).hasClass("e-dropdownlist") || $(currentToolbarItem).hasClass("e-select") || $(currentToolbarItem).hasClass("e-down-arrow")) {
                    var zoomDropdownId = $('#' + this._id + '_toolbarContainer .e-pdfviewer-ejdropdownlist')[0];
                    if (zoomDropdownId)
                        TagPos = zoomDropdownId.getBoundingClientRect();
                    else
                        TagPos = $('#' + this._id + '_toolbarContainer_hiddenlist .e-pdfviewer-ejdropdownlist')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('zoom');
                    isShowTooltip = this._viewpopupBlockNone($('#' + this._id + '_toolbar_zoomSelection_popup_list_wrapper'));
                }
                //The below code is used to render the tooltip for fitWidth and fitPage buttons based on the id name of the target element
                else if ($(currentToolbarItem).hasClass("e-pdfviewer-fitwidth") || $(currentToolbarItem).hasClass("e-pdfviewer-fitpage") || ($(disabledItem).hasClass('e-pdfviewer-fitwidth')) || ($(disabledItem).hasClass('e-pdfviewer-fitpage'))) {
                    var hoverSpan = currentToolbarItem;
                    var spanId = $(hoverSpan).attr('id');
                    switch (spanId) {
                        case this._id + "_fitWidth":
                            var fitWidthId = $('#' + this._id + '_toolbarContainer .e-pdfviewer-fitwidth')[0];
                            if (fitWidthId)
                                TagPos = fitWidthId.getBoundingClientRect();
                            else
                                TagPos = $('#' + this._id + '_toolbarContainer_hiddenlist .e-pdfviewer-fitwidth')[0].getBoundingClientRect();
                            toolTipText = this._getTootipText('fittoWidth');
                            break;
                        case this._id + "_fitPage":
                            var fitPageId = $('#' + this._id + '_toolbarContainer .e-pdfviewer-fitpage')[0];
                            if (fitPageId)
                                TagPos = fitPageId.getBoundingClientRect();
                            else
                                TagPos = $('#' + this._id + '_toolbarContainer_hiddenlist .e-pdfviewer-fitpage')[0].getBoundingClientRect();
                            toolTipText = this._getTootipText('fittopage');
                            break;
                        default:
                            var prevElement = $(hoverSpan).prev();
                            if ($(prevElement).hasClass('e-pdfviewer-fitwidth')) {
                                fitWidthId = $('#' + this._id + '_toolbarContainer .e-pdfviewer-fitwidth')[0];
                                if (fitWidthId)
                                    TagPos = fitWidthId.getBoundingClientRect();
                                else
                                    TagPos = $('#' + this._id + '_toolbarContainer_hiddenlist .e-pdfviewer-fitwidth')[0].getBoundingClientRect();
                                toolTipText = this._getTootipText('fittoWidth');
                            } else if ($(prevElement).hasClass('e-pdfviewer-fitpage')) {
                                fitPageId = $('#' + this._id + '_toolbarContainer .e-pdfviewer-fitpage')[0];
                                if (fitPageId)
                                    TagPos = fitPageId.getBoundingClientRect();
                                else
                                    TagPos = $('#' + this._id + '_toolbarContainer_hiddenlist .e-pdfviewer-fitpage')[0].getBoundingClientRect();
                                toolTipText = this._getTootipText('fittopage');
                            }
                    }
                } else if ($(currentToolbarItem).hasClass("e-pdfviewer-find")) {
                    if (!this._isFindboxPresent) {
                        var searchSpanId = $('#' + this._id + '_toolbarContainer .e-pdfviewer-find')[0];
                        if (searchSpanId)
                            TagPos = searchSpanId.getBoundingClientRect();
                        else
                            TagPos = $('#' + this._id + '_toolbarContainer_hiddenlist .e-pdfviewer-find')[0].getBoundingClientRect();
                        toolTipText = this._getTootipText('search');
                    }
                } else if ($(currentToolbarItem).hasClass("e-pdfviewer-highlight-markup") || $(currentToolbarItem).hasClass("e-pdfviewer-toolbar-highlight")) {
                    var highlightSpanId = $('#' + this._id + '_toolbarContainer .e-pdfviewer-highlight-markup')[0];
                    if (highlightSpanId)
                        TagPos = highlightSpanId.getBoundingClientRect();
                    else
                        TagPos = $('#' + this._id + '_toolbarContainer_hiddenlist .e-pdfviewer-highlight-markup')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('highlight');
                } else if ($(currentToolbarItem).hasClass("e-pdfviewer-strikeout-markup") || $(currentToolbarItem).hasClass("e-pdfviewer-toolbar-strikeout")) {
                    var strikeoutSpanId = $('#' + this._id + '_toolbarContainer .e-pdfviewer-strikeout-markup')[0];
                    if (strikeoutSpanId)
                        TagPos = strikeoutSpanId.getBoundingClientRect();
                    else
                        TagPos = $('#' + this._id + '_toolbarContainer_hiddenlist .e-pdfviewer-strikeout-markup')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('strikeout');
                } else if ($(currentToolbarItem).hasClass("e-pdfviewer-underline-markup") || $(currentToolbarItem).hasClass("e-pdfviewer-toolbar-underline")) {
                    var underlineSpanId = $('#' + this._id + '_toolbarContainer .e-pdfviewer-underline-markup')[0];
                    if (underlineSpanId)
                        TagPos = underlineSpanId.getBoundingClientRect();
                    else
                        TagPos = $('#' + this._id + '_toolbarContainer_hiddenlist .e-pdfviewer-underline-markup')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('underline');
                }
                else if ($(currentToolbarItem).hasClass("e-pdfviewer-sign") || $(currentToolbarItem).hasClass("e-pdfviewer-toolbar-sign")) {
                    var signatureSpanId = $('#' + this._id + '_toolbarContainer .e-pdfviewer-sign')[0];
                    if (signatureSpanId)
                        TagPos = signatureSpanId.getBoundingClientRect();
                    else
                        TagPos = $('#' + this._id + '_toolbarContainer_hiddenlist  .e-pdfviewer-sign')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('signature');
                }
                else if ($(currentToolbarItem).hasClass("e-pdfviewer-select") || $(currentToolbarItem).hasClass("e-pdfviewer-toolbar-select")) {
                    var selectSpanId = $('#' + this._id + '_toolbarContainer .e-pdfviewer-select')[0];
                    if (selectSpanId)
                        TagPos = selectSpanId.getBoundingClientRect();
                    else
                        TagPos = $('#' + this._id + '_toolbarContainer_hiddenlist  .e-pdfviewer-select')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('select');
                }
                else if ($(currentToolbarItem).hasClass("e-pdfviewer-scroll") || $(currentToolbarItem).hasClass("e-pdfviewer-toolbar-scroll")) {
                    var scrollSpanId = $('#' + this._id + '_toolbarContainer .e-pdfviewer-scroll')[0];
                    if (scrollSpanId)
                        TagPos = scrollSpanId.getBoundingClientRect();
                    else
                        TagPos = $('#' + this._id + '_toolbarContainer_hiddenlist  .e-pdfviewer-scroll')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('scroll');
                }
                if (toolTipText && isShowTooltip) {
                    var maxZindex = this._viewerMaxZindex();
                    $('#' + this._id + '_rptTooltip_Header').html(toolTipText.header);
                    $('#' + this._id + '_rptTooltip_Content').html(toolTipText.content);
                    var toolbarPosition = document.getElementById(this._id + "_toolbarContainer").getBoundingClientRect();
                    var windowWidth = this.element[0].clientWidth;
                    var minimunWidth = parseFloat($('#' + this._id + '_rptTooltip').css('min-width'));
                    if (windowWidth <= (TagPos.left) + (minimunWidth)) {
                        $('#' + this._id + '_rptTooltip').css({ 'zIndex': maxZindex + 1, 'top': ((TagPos.top - toolbarPosition.top)) - 21, 'left': ((TagPos.left - toolbarPosition.left) + (TagPos.width / 2) - minimunWidth), 'display': 'block', 'position': 'absolute' });
                        var currentLeft = parseFloat($('#' + this._id + '_rptTooltip').css("left"));
                        if (currentLeft < 0) {
                            $('#' + this._id + '_rptTooltip').css("left", "0px");
                        }
                    }
                    else if (windowWidth <= (TagPos.left) + 2 * (TagPos.width)) {
                        if (toolTipText.header == "Zoom") {
                            $('#' + this._id + '_rptTooltip').css({ 'zIndex': maxZindex + 1, 'top': ((TagPos.top - toolbarPosition.top)) - 21, 'left': ((TagPos.left - toolbarPosition.left) - (2 * TagPos.width)), 'display': 'block', 'position': 'absolute' });
                        }
                        else
                            $('#' + this._id + '_rptTooltip').css({ 'zIndex': maxZindex + 1, 'top': ((TagPos.top - toolbarPosition.top)) - 21, 'left': ((TagPos.left - toolbarPosition.left) - (3 * TagPos.width)), 'display': 'block', 'position': 'absolute' });
                    }
                    else {
                        $('#' + this._id + '_rptTooltip').css({ 'zIndex': maxZindex + 1, 'top': ((TagPos.top - toolbarPosition.top)) - 21, 'left': ((TagPos.left - toolbarPosition.left) + (TagPos.width / 2)), 'display': 'block', 'position': 'absolute' });
                    }
                }
            }
        },

        _viewerMaxZindex: function () {
            var parents = this.element.parents(), bodyEle, contEle;
            var bodyEle = $('body').children(), index = bodyEle.index(this.popup);
            bodyEle.splice(index, 1);
            $(bodyEle).each(function (i, ele) { parents.push(ele); });
            var contEle = $(this.model.target).children(), cindex = contEle.index(this.popup);
            contEle.splice(cindex, 1);
            $(contEle).each(function (i, ele) { parents.push(ele); });
            var maxZ = Math.max.apply(maxZ, $.map(parents, function (e, n) {
                if ($(e).css('position') != 'static') return parseInt($(e).css('z-index')) || 1;
            }));
            if (!maxZ || maxZ < 10000) maxZ = 10000;
            else maxZ += 1;
            return maxZ;
        },

        _getTootipText: function (tipType) {
            var localeObj = ej.PdfViewer.Locale[this.model.locale] ? ej.PdfViewer.Locale[this.model.locale] : ej.PdfViewer.Locale["default"];
            var headerTxt = '';
            var contentTxt = '';
            switch (tipType) {
                case 'print':
                    headerTxt = localeObj['toolbar']['print']['headerText'];
                    contentTxt = localeObj['toolbar']['print']['contentText'];
                    break;
                case 'download':
                    headerTxt = localeObj['toolbar']['download']['headerText'];
                    contentTxt = localeObj['toolbar']['download']['contentText'];
                    break;
                case 'first':
                    headerTxt = localeObj['toolbar']['first']['headerText'];
                    contentTxt = localeObj['toolbar']['first']['contentText'];
                    break;
                case 'previous':
                    headerTxt = localeObj['toolbar']['previous']['headerText'];
                    contentTxt = localeObj['toolbar']['previous']['contentText'];
                    break;
                case 'next':
                    headerTxt = localeObj['toolbar']['next']['headerText'];
                    contentTxt = localeObj['toolbar']['next']['contentText'];
                    break;
                case 'last':
                    headerTxt = localeObj['toolbar']['last']['headerText'];
                    contentTxt = localeObj['toolbar']['last']['contentText'];
                    break;
                case 'zoomin':
                    headerTxt = localeObj['toolbar']['zoomIn']['headerText'];
                    contentTxt = localeObj['toolbar']['zoomIn']['contentText'];
                    break;
                case 'zoomout':
                    headerTxt = localeObj['toolbar']['zoomOut']['headerText'];
                    contentTxt = localeObj['toolbar']['zoomOut']['contentText'];
                    break;
                case 'pageIndex':
                    headerTxt = localeObj['toolbar']['pageIndex']['headerText'];
                    contentTxt = localeObj['toolbar']['pageIndex']['contentText'];
                    break;
                case 'zoom':
                    headerTxt = localeObj['toolbar']['zoom']['headerText'];
                    contentTxt = localeObj['toolbar']['zoom']['contentText'];
                    break;
                case 'fittoWidth':
                    headerTxt = localeObj['toolbar']['fitToWidth']['headerText'];
                    contentTxt = localeObj['toolbar']['fitToWidth']['contentText'];
                    break;
                case 'fittopage':
                    headerTxt = localeObj['toolbar']['fitToPage']['headerText'];
                    contentTxt = localeObj['toolbar']['fitToPage']['contentText'];
                    break;
                case 'search':
                    headerTxt = localeObj['toolbar']['search']['headerText'];
                    contentTxt = localeObj['toolbar']['search']['contentText'];
                    break;
                case 'highlight':
                    headerTxt = localeObj['toolbar']['highlight']['headerText'];
                    contentTxt = localeObj['toolbar']['highlight']['contentText'];
                    break;
                case 'strikeout':
                    headerTxt = localeObj['toolbar']['strikeout']['headerText'];
                    contentTxt = localeObj['toolbar']['strikeout']['contentText'];
                    break;
                case 'underline':
                    headerTxt = localeObj['toolbar']['underline']['headerText'];
                    contentTxt = localeObj['toolbar']['underline']['contentText'];
                    break;
                case 'signature':
                    headerTxt = localeObj['toolbar']['signature']['headerText'];
                    contentTxt = localeObj['toolbar']['signature']['contentText'];
                    break;
                case 'select':
                    headerTxt = localeObj['toolbar']['select']['headerText'];
                    contentTxt = localeObj['toolbar']['select']['contentText'];
                    break;
                case 'scroll':
                    headerTxt = localeObj['toolbar']['scroll']['headerText'];
                    contentTxt = localeObj['toolbar']['scroll']['contentText'];
                    break;
            }
            return { header: headerTxt, content: contentTxt };
        },
        //-------------------- Tooltip Localization Actions[End]------------------------//

        //-------------------- DrillThrough Actions[Start]----------------------//

        _setInitialization: function () {
            this._canvascount = 0;
            this._fileName = '';
            this._isToolbarClick = false;
            this._pageModel = null;
            this._currentPage = 1;
            this._zoomLevel = 2;
            this._pageImageStream = null;
            this._pageWidth;
            this._pageHeight;
            this._pageLocation = new Array();
            this._scrollTriggered = false;
            this._previousPage = 1;
            this._totalPages;
            this._previousPosition;
            this._cummulativeHeight;
            this._backgroundPage = 1;
            this._renderedCanvasList = new Array();
            this._pageContents = new Array();
            this._pageText = new Array();
            this._searchMatches = new Array();
            this._pagePrinted = false;
            this._printingPage = 1;
            this._printingTimer;
            this._previousZoom = 1;
            this._renderPreviousPage = false;
            this._pageSize;
            this._eventpreviouszoomvalue;
            this._eventzoomvalue;
            this._pdfFileName;
            this._zoomArray = new Array();
            this._rerenderCanvasList = new Array();
            this._ajaxRequestState = null;
            this._ajaxDownloaded = null;
        },

        //-------------------- DrillThrough Actions[End]----------------------//

        //-------------------- Common pdfviewer events & utils[start]----------------------//
        _showViewerBlock: function (showblock) {
            if (showblock) {
                $('#' + this._id + '_viewBlockContainer').css("display", "block");
                var parameterBlock = $('#' + this._id + '_viewBlockContainer .e-pdfviewer-viewerblockcellcontent').find('table');
                this._selectparamToolItem(parameterBlock.is('[isviewclick]'));
            } else {
                $('#' + this._id + '_viewBlockContainer').css("display", "none");
            }
            if (this._isDevice) {
                $('#' + this._id + '_viewBlockContainer.e-pdfviewer-blockstyle').css('z-index', showblock ? '10' : '0');
            }
        },

        _showNavigationIndicator: function (isShow) {
            $('#' + this._id + '_viewerContainer').ejWaitingPopup({ showOnInit: isShow, appendTo: '#' + this._id + '_viewerContainer' });
            $('#' + this._id + '_viewerContainer_WaitingPopup').addClass('e-pdfviewer-waitingpopup');
        },
        _showSelectionButtons: function (show) {
            if (show) {
                $('#' + this._id + '_pdfviewer_selectul').css("display", "block");
                $('#' + this._id + '_pdfviewer_signatureul').addClass('e-separator');
                this._isSelectionHidden = false;
            }
            else {
                $('#' + this._id + '_pdfviewer_selectul').css("display", "none");
                $('#' + this._id + '_pdfviewer_signatureul').removeClass('e-separator');
                this._isSelectionHidden = true;
            }
        },
        _showloadingIndicator: function (isShow) {
            if (isShow) {
                $('#' + this._id + '_loadingIndicator').css('display', 'block');
                $('#' + this._id + '_pageviewOuterContainer').css('display', 'none');
            }
            else {
                $('#' + this._id + '_loadingIndicator').css('display', 'none');
                $('#' + this._id + '_pageviewOuterContainer').css('display', 'block');
            }
            $('#' + this._id + '_loadingIndicator').ejWaitingPopup({ showOnInit: isShow, appendTo: '#' + this._id + '_loadingIndicator' });
            $('#' + this._id + '_loadingIndicator_WaitingPopup').addClass('e-pdfviewer-waitingpopup');
        },

        _showPrintLoadingIndicator: function (isShow) {
            $('#' + this._id + 'e-pdf-viewer').css({ 'position': 'relative' });
            var localeObj = ej.PdfViewer.Locale[this.model.locale] ? ej.PdfViewer.Locale[this.model.locale] : ej.PdfViewer.Locale["default"];
            var text = localeObj['waitingPopup']['print']['contentText'];
            $('#' + this._id + 'e-pdf-viewer').ejWaitingPopup({ showOnInit: isShow, text: text, cssClass: 'e-pdfviewer-waitingpopup-print', appendTo: '#' + this._id + 'e-pdf-viewer' });
        },

        _viewerResize: function (event) {
            if (this.element == null) {
                this.element = $("#" + this._id);
            }
            if (this.model == null) {
                this.model = $("#" + this._id).ejPdfViewer("instance").model;
            }
            var proxy = this;
            var elementWidth = proxy._isWidth ? proxy.element[0].parentElement.style.width : proxy.element[0].style.width;
            var elementHeight = proxy._isHeight ? proxy.element[0].parentElement.style.height : proxy.element[0].style.height;
            var _height = $(proxy.element).height();
            var _width = $(proxy.element).width();
            if (elementHeight.indexOf("%") != -1) {
                proxy._isPercentHeight = parseInt(elementHeight);
                var containerHeight = proxy._isHeight ? $(proxy.element).parent().height() : _height;
                _height = !proxy._isHeight ? ((containerHeight / 100) * proxy._isPercentHeight) : containerHeight;
            } else if (proxy.element[0].parentElement.clientHeight != 0 && proxy._isPercentHeight != -1) {
                _height = !proxy._isHeight ? ((proxy.element[0].parentElement.clientHeight / 100) * proxy._isPercentHeight) : proxy.element[0].parentElement.clientHeight;
            } else if (proxy._isHeight && proxy.element[0].parentElement.clientHeight != 0) {
                _height = proxy.element[0].parentElement.clientHeight;
            }
            proxy.element.height(_height);
            if (elementWidth.indexOf("%") != -1) {
                proxy._isPercentWidth = parseInt(elementWidth);
                var containerWidth = proxy._isWidth ? $(proxy.element).parent().width() : _width;
                _width = !proxy._isWidth ? (containerWidth / 100) * proxy._isPercentWidth : containerWidth;
            } else if (proxy.element[0].parentElement.clientWidth != 0 && proxy._isPercentWidth != -1) {
                _width = !proxy._isWidth ? (proxy.element[0].parentElement.clientWidth / 100) * proxy._isPercentWidth : proxy.element[0].parentElement.clientWidth;
            } else if (proxy._isWidth && proxy.element[0].parentElement.clientWidth != 0) {
                _width = proxy.element[0].parentElement.clientWidth;
            }
            proxy.element.width(_width);
            proxy._toolbar._activeItem = undefined;
            proxy._toolbar._reSizeHandler();
            if (_width <= 500) {
                $('#' + this._id + "_containerDialogTab").ejDialog({ position: { X: ((_width / 2) - (307 / 2)) + "px", Y: (_height / 2) + "px" }, width: "auto", height: "auto" });
            }
            else {
                $('#' + this._id + "_containerDialogTab").ejDialog({ position: { X: ((_width / 2) - (500 / 2)) + "px", Y: (_height / 2) + "px" }, width: "500px", height: "322px" });
            }
            var height = Math.max(0, (($(window).height() - $('#' + this._id + "_containerDialogTab").outerHeight()) / 2) + $(window).scrollTop()) + "px";
            var width = Math.max(0, (($(window).width() - $('#' + this._id + "_containerDialogTab").outerWidth()) / 2) + $(window).scrollLeft()) + "px";
            $('#' + this._id + "_containerDialogTab").ejDialog({ position: { X: width, Y: height } });
            if (_width <= 500 || window.innerHeight <= 500) {
                $('#' + this._id + "_signatureContainerDialogTab").ejDialog({ width: "auto", height: "auto" });
                var newCanvas = $('#' + this._id + "_imageTemp")[0];
                newCanvas.height = 100;
                newCanvas.width = _width;
                newCanvas.style.height = "100px";
                newCanvas.style.width = _width + "px";
                var elemnts = proxy.element[0].parentElement.parentElement.parentElement;
                var width = elemnts.offsetWidth;
                var heights = elemnts.offsetHeight;
                var newWidths = (width / 2) - (newCanvas.width / 2);
                var newHeight = (window.innerHeight / 2) - (newCanvas.height / 2);
                $('#' + this._id + "_signatureContainerDialogTab").ejDialog({ position: { X: newWidths + "px", Y: newHeight + "px" } });
            }
            else {
                var newCanvas = $('#' + this._id + "_imageTemp")[0];
                newCanvas.height = 400;
                newCanvas.width = 470;
                newCanvas.style.height = "400px";
                newCanvas.style.width = "470px";
                var elemnts = proxy.element[0].parentElement.parentElement.parentElement;
                var width = elemnts.offsetWidth;
                var heights = elemnts.offsetHeight;
                var newWidths = (width / 2) - (newCanvas.width / 2);
                var newHeight = (window.innerHeight / 2) - (newCanvas.height / 2);
                $('#' + this._id + "_signatureContainerDialogTab").ejDialog({ height: "503px" });
                $('#' + this._id + "_signatureContainerDialogTab").ejDialog({ position: { X: newWidths + "px", Y: newHeight + "px" } });
            }
            $('#' + proxy._id + '_pdfviewer_searchul').removeClass('e-separator');
            $('#' + proxy._id + '_pdfviewer_downloadul').removeClass('e-separator');
            document.getElementById(proxy._id + '_pdfviewer_colorpicker').style.display = 'none';
            proxy._isToolbarColorPicker = false;
            proxy._toolbarResizeHandler();
            proxy._resizeSearchToolbar();
            var toolbarHeight = this.model.toolbarSettings.templateId ? $('#' + this.model.toolbarSettings.templateId).height() : $('#' + this._id + '_toolbarContainer').height();
            if (window.innerHeight >= 300) {
                $('#' + proxy._id + '_viewerContainer').css({ height: (window.innerHeight - toolbarHeight) + "px" });
            }
            if (proxy.model && proxy.model.isResponsive && proxy._renderedCanvasList.length > 0 && proxy._isAutoZoom) {
                proxy._applyFitToWidthAuto();
            }
            if (proxy.model && proxy._fitType == "fitToWidth" && !proxy.model.isResponsive) {
                proxy._applyFitToWidth();
            }
            proxy._isViewerRestored = false;
            proxy._isAutoSelected = false;
            proxy._isWindowResizing = true;
            //Function for assigning left style property for page Canvas.
            proxy._applyLeftPosition();
        },

        /*  * _applyLeftPosition() assigns the left style property of the page canvas.
            * The left style property is calculated and added to each page canvas.
            * So the page canvas is centered.
        */
        _applyLeftPosition: function () {
            for (var i = 1; i <= this._totalPages; i++) {
                var leftPosition;
                if ((this._fitType == "fitToWidth") || (this._isAutoZoom && this._zoomVal < 1))
                    leftPosition = 5;
                else {
                    if (this._pageSize[i - 1].PageRotation == 90 || this._pageSize[i - 1].PageRotation == 270)
                        leftPosition = (this.element.width() - this._pageSize[i - 1].PageHeight * this._zoomVal) / 2;
                    else
                        leftPosition = (this.element.width() - this._pageSize[i - 1].PageWidth * this._zoomVal) / 2;
                }
                var currentWidth = leftPosition + this._pageSize[i - 1].PageWidth * this._zoomVal;
                var pagecontainer = $('#' + this._id + '_pageviewContainer');
                var w = pagecontainer.width();
                if (leftPosition < 0 || (this._fitType == "fitToPage" && this._pageSize[i - 1].PageOrientation == "Landscape" && currentWidth > w)) {
                    if (currentWidth > w) {
                        leftPosition = 0;
                    } else {
                        leftPosition = 5;
                    }
                }
                var pageDiv = document.getElementById(this._id + 'pageDiv_' + i);
                if (pageDiv) {
                    pageDiv.style.left = leftPosition + "px";
                }
            }
        },

        _toolbarResizeHandler: function () {
            var toolbar = $('#' + this._id + '_toolbarContainer');
            if ($('#' + this._id + '_pdfviewer_printul').parent()[0] != toolbar[0]) {
                if (!this._isDownloadCntlHidden) {
                    toolbar.append($('#' + this._id + '_pdfviewer_printul')[0]);
                    this._toolbar._liTemplte.append($('#' + this._id + '_pdfviewer_downloadul')[0]);
                    this._isDownloadCntlHidden = true;
                }
                toolbar.append($('#' + this._id + '_pdfviewer_searchul')[0]);
                $('#' + this._id + '_pdfviewer_searchul').css({ 'float': 'right' });
            } else if ($('#' + this._id + '_pdfviewer_printul').parent()[0] == toolbar[0]) {
                $('#' + this._id + '_pdfviewer_printul').removeClass('e-separator');
                $('#' + this._id + '_pdfviewer_printul').css({ 'float': 'right' });
                $('#' + this._id + '_pdfviewer_searchul').css({ 'float': 'right' });
                $('#' + this._id + '_pdfviewer_selectul').removeClass('e-separator');
            }
            if ($('#' + this._id + '_pdfviewer_downloadul').parent()[0] != toolbar[0]) {
                if (this._isDownloadCntlHidden) {
                    this._toolbar._liTemplte.append($('#' + this._id + '_pdfviewer_printul')[0]);
                    this._isDownloadCntlHidden = false;
                    $('#' + this._id + '_pdfviewer_searchul').css({ 'float': 'left' });
                }
            } else if ($('#' + this._id + '_pdfviewer_downloadul').parent()[0] == toolbar[0]) {
                $('#' + this._id + '_pdfviewer_downloadul').removeClass('e-separator');
                $('#' + this._id + '_pdfviewer_downloadul').css({ 'float': 'right' });
                toolbar.append($('#' + this._id + '_pdfviewer_downloadul')[0]);
                toolbar.append($('#' + this._id + '_pdfviewer_printul')[0]);
                toolbar.append($('#' + this._id + '_pdfviewer_searchul')[0]);
                $('#' + this._id + '_toolbarContainer_target').addClass('e-display-none');
                $('#' + this._id + '_toolbarContainer_target').removeClass('e-display-block');
            }
            if ($('#' + this._id + '_pdfviewer_searchul').parent()[0] != toolbar[0]) {
                if (!this._isSearchHidden) {
                    this._isSearchHidden = false;
                    toolbar.append($('#' + this._id + '_pdfviewer_selectul')[0]);
                    toolbar.append($('#' + this._id + '_pdfviewer_searchul')[0]);
                    $('#' + this._id + '_pdfviewer_searchul').css({ 'float': 'left' });
                    $('#' + this._id + '_pdfviewer_printul').css({ 'float': 'left', 'padding-right': '10px' });
                    $('#' + this._id + '_pdfviewer_downloadul').css({ 'float': 'left' });
                    this._toolbar._liTemplte.append($('#' + this._id + '_pdfviewer_printul')[0]);
                    this._toolbar._liTemplte.append($('#' + this._id + '_pdfviewer_downloadul')[0]);
                    $('#' + this._id + '_pdfviewer_searchul').addClass('e-separator');
                    $('#' + this._id + '_pdfviewer_printul').addClass('e-separator');
                }
            }
            if ($('#' + this._id + '_pdfviewer_selectul').parent()[0] != toolbar[0]) {
                this._isZoomCntlHidden = true;
                this._isSearchHidden = true;
                toolbar.append($('#' + this._id + '_pdfviewer_selectul')[0]);
                toolbar.append($('#' + this._id + '_pdfviewer_searchul')[0]);
                this._toolbar._liTemplte.append($('#' + this._id + '_pdfviewer_zoomul')[0]);
                this._toolbar._liTemplte.append($('#' + this._id + '_pdfviewer_textmarkupul')[0]);
                this._toolbar._liTemplte.append($('#' + this._id + '_pdfviewer_signatureul')[0]);
                this._toolbar._liTemplte.append($('#' + this._id + '_pdfviewer_printul')[0]);
                this._toolbar._liTemplte.append($('#' + this._id + '_pdfviewer_downloadul')[0]);
                $('#' + this._id + '_pdfviewer_printul').css({ 'float': 'left', 'padding-right': '10px' });
                $('#' + this._id + '_pdfviewer_downloadul').css({ 'float': 'left' });
                $('#' + this._id + '_pdfviewer_searchul').css({ 'float': 'left' });
                $('#' + this._id + '_pdfviewer_selectul').addClass('e-separator');
                $('#' + this._id + '_pdfviewer_printul').addClass('e-separator');
            }
            if (($('#' + this._id + '_pdfviewer_zoomul').parent()[0] == toolbar[0]) && this._isZoomCntlHidden) {
                toolbar.append($('#' + this._id + '_pdfviewer_zoomul')[0]);
                toolbar.append($('#' + this._id + '_pdfviewer_textmarkupul')[0]);
                toolbar.append($('#' + this._id + '_pdfviewer_signatureul')[0]);
                toolbar.append($('#' + this._id + '_pdfviewer_selectul')[0]);
                toolbar.append($('#' + this._id + '_pdfviewer_searchul')[0]);
                $('#' + this._id + '_pdfviewer_printul').css({ 'float': 'right', 'padding-right': '0px' });
                $('#' + this._id + '_pdfviewer_downloadul').css({ 'float': 'right' });
                $('#' + this._id + '_pdfviewer_searchul').css({ 'float': 'right', 'padding-right': '0px' });
                $('#' + this._id + '_pdfviewer_printul').removeClass('e-separator');
                $('#' + this._id + '_pdfviewer_selectul').removeClass('e-separator');
                this._isZoomCntlHidden = false;
            }
            if ($('#' + this._id + '_toolbarContainer_target').hasClass('e-display-block') && $('#' + this._id + '_toolbarContainer_hiddenlist')[0].childElementCount == 2) {
                $('#' + this._id + '_pdfviewer_searchul').css({ 'float': 'left' });
                $('#' + this._id + '_pdfviewer_selectul').addClass('e-separator');
            }
        },

        _overflowToolbarClose: function () {
            document.getElementById(this._id + '_pdfviewer_colorpicker').style.display = 'none';
            this._isToolbarColorPicker = false;
        },

        _resizeSearchToolbar: function () {
            var searchToolbar = document.getElementById(this._id + '_pdfviewer_searchbox');
            if (searchToolbar) {
                var searchicon = $('#' + this._id + '_toolbarContainer .e-pdfviewer-find')[0];
                if (!searchicon) {
                    searchicon = $('#' + this._id + '_toolbarContainer_hiddenlist .e-pdfviewer-find')[0];
                }
                var position = searchicon.getBoundingClientRect();
                var style = document.getElementById('e-pdfviewer-arrow-responsive');
                if (style) {
                    document.head.removeChild(style);
                }
                if (!$('#' + this._id + '_toolbarContainer_target').hasClass('e-display-block')) {
                    searchToolbar.style.left = (searchicon.parentNode.parentNode.offsetLeft - searchicon.parentNode.parentNode.parentNode.offsetLeft - 2) + 'px';
                    var searchInput = $('#' + this._id + '_pdfviewer_searchinput')[0];
                    searchInput.style.width = '150px';
                    searchToolbar.style.width = '400px';
                } else {
                    var viewerToolbar = document.getElementById(this._id + '_toolbarContainer');
                    searchToolbar.style.left = '0px';
                    var searchInput = $('#' + this._id + '_pdfviewer_searchinput')[0];
                    searchInput.style.width = '150px';
                    searchToolbar.style.width = '400px';
                }
                var viewer = document.getElementById(this._id + 'e-pdf-viewer');
                if ((viewer.clientWidth) < (searchToolbar.offsetLeft + searchToolbar.clientWidth)) {
                    var searchInput = $('#' + this._id + '_pdfviewer_searchinput')[0];
                    if (this._isZoomCntlHidden) {
                        searchInput.style.width = parseInt(searchInput.style.width) - ((searchToolbar.offsetLeft + searchToolbar.clientWidth) - (viewer.clientWidth)) + 'px';
                        searchToolbar.style.width = parseInt(searchToolbar.style.width) - ((searchToolbar.offsetLeft + searchToolbar.clientWidth) - (viewer.clientWidth)) + 'px';
                    } else {
                        searchToolbar.style.left = parseInt(searchToolbar.style.left) - ((searchToolbar.offsetLeft + searchToolbar.clientWidth) - (viewer.clientWidth)) + 'px';
                    }
                } else {
                    if ($('#' + this._id + '_toolbarContainer_target').hasClass('e-display-block')) {
                        searchToolbar.style.left = parseInt(searchToolbar.style.left) - ((searchToolbar.offsetLeft + searchToolbar.clientWidth) - (viewer.clientWidth)) + 'px';
                    }
                }
                this._responsiveArrow(position, searchToolbar);
            }
        },

        _responsiveArrow: function (position, searchToolbar) {
            var styleSheet = document.createElement("Style");
            styleSheet.id = 'e-pdfviewer-arrow-responsive';
            document.head.appendChild(styleSheet);
            var style = styleSheet.sheet;
            if (!navigator.userAgent.match("Firefox") && style) {
                var searchToolbarPosition = searchToolbar.getBoundingClientRect();
                var left = position.left - searchToolbarPosition.left;
                style.addRule('.e-pdfviewer-arrow::before', 'left:' + left + 'px');
                style.addRule('.e-pdfviewer-arrow::after', 'left:' + left + 'px');
            } else {
                $('#' + this._id + '_pdfviewer_searchbox').removeClass('e-pdfviewer-arrow');
            }
        },

        //-------------------- Common pdfviewer events & utils[End]----------------------//

        /*---------------------client side methods[start]----------------------------------------------------------*/

        goToPage: function (pageNo) {
            this._gotoPageNo(pageNo);
        },

        goToLastPage: function () {
            this._gotoLastPage();
        },

        goToFirstPage: function () {
            this._gotoFirstPage();
        },

        goToNextPage: function () {
            this._gotoNextPage();
        },

        goToPreviousPage: function () {
            this._gotoPreviousPage();
        },

        print: function () {
            this._print();
        },

        abortPrint: function () {
            this._printCancel();
        },
        abortDownload: function () {
            this._cancelDownload();
        },
        showPrintTools: function (show) {
            this._showPrintButton(show);
        },

        showDownloadTool: function (show) {
            this._showDownloadButton(show);
        },

        showTextSearchTool: function (show) {
            this._showTextSearchButton(show);
        },

        showPageNavigationTools: function (show) {
            this._showPageNavigationControls(show);
        },

        showMagnificationTools: function (show) {
            this._showZoomControl(show);
            this._showFittoPage(show);
        },

        showTextMarkupAnnotationTools: function (show) {
            this._showTextMarkupButtons(show);
        },

        showSignatureTool: function (show) {
            this._showSignatureButtons(show);
        },
        addSignature: function () {
            this._showSignatureDialog();
        },
        showSelectionTool: function (show) {
            this._showSelectionButtons(show);
        },
        showToolbar: function (showToolbar) {
            this._showToolbar(showToolbar);
        },

        unload: function () {
            this._unLoad();
        },

        load: function (file) {
            $('#' + this._id + '_viewerContainer').scrollTop(0);
            this._showloadingIndicator(true);
            this.isDocumentEdited = false;
            this._fitType = null;
            this.model.isResponsive = true;
            this.model.enableTextSelection = true;
            this._isAutoZoom = true;
            $('#' + this._id + '_pageviewContainer').find('.e-waitingpopup').css("visibility", "");
            this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_fitPage');
            this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_fitWidth');
            this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_zoomin');
            this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_zoomout');
            this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_download');
            this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_search');
            this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_highlight');
            this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_strikeout');
            this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_underline');
            this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_signature');
            this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_select');
            this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_scroll');
            document.getElementById(this._id + '_pdfviewer_colorpicker').style.display = 'none';
            this._isToolbarColorPicker = false;
            this._toolbar.deselectItemByID(this._id + '_pdfviewer_toolbar_highlight');
            this._toolbar.deselectItemByID(this._id + '_pdfviewer_toolbar_underline');
            this._toolbar.deselectItemByID(this._id + '_pdfviewer_toolbar_strikeout');
            this._isHighlightEnabled = false;
            this._isUnderlineEnabled = false;
            this._isStrikeOutEnabled = false;
            this._isHighlight = false;
            this._isUnderline = false;
            this._isStrikeout = false;
            this._annotationActive = false;
            this._isCopyRestrict = false;
            this._isPrintRestrict = false;
            this._isFormFieldsDisabled = false;
            this._zoomVal = 1;
            this._zoomLevel = 3;
            this.fileName = null;
            this._fileName = "";
            this._signatureLayer = [];
            var localeObj = ej.PdfViewer.Locale[this.model.locale] ? ej.PdfViewer.Locale[this.model.locale] : ej.PdfViewer.Locale["default"];
            var text = localeObj['contextMenu']['auto']['contentText'];
            $('#' + this._id + '_toolbar_zoomSelection_hidden').val(text);
            this._ejDropDownInstance.model.value = text;
            this._initToolbar();
            if (file) {
                var count = this._canvascount;
                while (count >= 1) {
                    $('#' + this._id + 'pageDiv_' + count).remove();
                    count--;
                }
            }

            window.clearInterval(this._scrollTimer);
            var jsonResult = new Object();
            jsonResult["viewerAction"] = "GetPageModel";
            jsonResult["controlId"] = this._id;
            jsonResult["pageindex"] = "1";
            jsonResult["isInitialLoading"] = "true";

            var fileUrl = file.split("base64,")[1];
            if (fileUrl == undefined) {
                this._fileName = file;
                jsonResult["newFileName"] = this._fileName;
                this._fileId = this._createGUID();
                jsonResult["id"] = this._fileId;
                this._actionUrl = this.model.serviceUrl + "/" + this.model.serverActionSettings.load;
                if (this._pdfService == ej.PdfViewer.PdfService.Local)
                    this._doAjaxPost("POST", this._actionUrl, JSON.stringify(jsonResult), "_getPageModel");
                else
                    this._doAjaxPost("POST", this.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }), "_getPageModel");
            } else {
                var actionUrl = this.model.serviceUrl;
                jsonResult["uploadedFile"] = fileUrl;
                this._fileId = this._createGUID();
                jsonResult["id"] = this._fileId;
                if (this._pdfService == ej.PdfViewer.PdfService.Local) {
                    actionUrl = this.model.serviceUrl + "/" + this.model.serverActionSettings.fileUpload;
                    this._doAjaxPost("POST", actionUrl, JSON.stringify(jsonResult), "_getPageModel");
                }
                else {
                    actionUrl = actionUrl.replace(this.model.serverActionSettings.load, this.model.serverActionSettings.fileUpload);
                    this._doAjaxPost("POST", actionUrl, JSON.stringify({ 'jsonResult': jsonResult }), "_getPageModel");
                }
            }
        },
        searchText: function (searchText) {
            this._searchText = searchText;
            this._displaySearch = true;
            this._isFindboxPresent = true;
            this._textSearch();
        },
        searchNext: function () {
            this._nextSearch();
        },
        searchPrevious: function () {
            this._prevSearch();
        },
        matchCase: function (checked) {
            if (checked) {
                this._isMatchCase = true;
            } else {
                this._isMatchCase = false;
            }
            this._textSearch();
        },
        cancelSearchText: function () {
            this._searchText = "";
            this._displaySearch = false;
            this._isFindboxPresent = false;
            this._clearAllOccurrences();
        },

        fitToPage: function () {
            this._applyFitToPage();
        },

        fitToWidth: function () {
            this._applyFitToWidth();
        },

        download: function (isAsynchronous) {
            if (typeof isAsynchronous === "boolean")
                this._isAsynchronousDownload = isAsynchronous;
            else
                this._isAsynchronousDownload = true;
            this._saveFormFieldsValue();
        },

        zoomIn: function () {
            this._applyLowerZoomIndex();
            this._zoomIn();
        },

        zoomOut: function () {
            this._applyHigherZoomIndex();
            this._zoomOut();
        },

        zoomTo: function (zoomvalue) {
            if (zoomvalue < 50)
                zoomvalue = 50;
            else if (zoomvalue > 400)
                zoomvalue = 400;
            var zoomfactor = parseInt(zoomvalue) / 100;
            var localeObj = ej.PdfViewer.Locale[this.model.locale] ? ej.PdfViewer.Locale[this.model.locale] : ej.PdfViewer.Locale["default"];
            var text = localeObj['contextMenu']['auto']['contentText'];
            if (zoomvalue == text) {
                zoomfactor = 1;
                this.model.isResponsive = true;
            }
            else {
                zoomvalue = zoomvalue + "%";
                this.model.isResponsive = false;
            }
            this._calculateZoomLevel(zoomfactor);
            this._zoomContainer(zoomfactor, false);
            $('#' + this._id + '_toolbar_zoomSelection_hidden').val(zoomvalue);
            this._ejDropDownInstance.model.selectedIndices[0] = "";
            $('#' + this._id + '_toolbar_zoomSelection_popup li').removeClass('e-active');
            this._ejDropDownInstance.model.value = zoomvalue;
        },

        undo: function () {
            if (!this._isPropertiesWindowOpen)
                this._undo();
        },

        redo: function () {
            if (!this._isPropertiesWindowOpen)
                this._redo();
        },

        addAnnotation: function (annotationType) {
            if (annotationType == ej.PdfViewer.AnnotationType.Highlight)
                this._addAnnotation("Highlight");
            else if (annotationType == ej.PdfViewer.AnnotationType.Underline)
                this._addAnnotation("Underline");
            else if (annotationType == ej.PdfViewer.AnnotationType.Strikethrough)
                this._addAnnotation("StrikeOut");
        }
        /*---------------------client side methods[end]----------------------------------------------------------*/
    });

    /**
	* Enum for enable and disable toolbar items.	 
	* @enum {number}
	* @global 
	*/
    ej.PdfViewer.ToolbarItems = {
        /**  Enables zoom toolbar item. */
        MagnificationTools: 1 << 0,
        /**  Enables page navigation toolbar item. */
        PageNavigationTools: 1 << 1,
        /**  Enables print toolbar item. */
        PrintTools: 1 << 2,
        /**  Enables download toolbar item. */
        DownloadTool: 1 << 3,
        /**  Enables Search toolbar item. */
        TextSearchTool: 1 << 4,
        /**  Enables Search toolbar item. */
        TextMarkupAnnotationTools: 1 << 5,
        /**   Enables all the toolbar items. */
        SignatureTool: 1 << 6,
        /**   Enables signature items. */
        SelectionTool: 1 << 7,
        /**   Enables selection items. */
        All: 1 << 0 | 1 << 1 | 1 << 2 | 1 << 3 | 1 << 4 | 1 << 5 | 1 << 6 | 1 << 7
    };

    ej.PdfViewer.PdfService = {
        Local: 1 << 0,
        Remote: 1 << 1,
    };
    ej.PdfViewer.LinkTarget = {
        Default: 1 << 0,
        NewTab: 1 << 1,
        NewWindow: 1 << 2,
    };

    ej.PdfViewer.AnnotationType = {
        Underline: 1 << 0,
        Strikethrough: 1 << 1,
        Highlight: 1 << 2
    };
    ej.PdfViewer.InteractionMode = {
        TextSelection: 1 << 0,
        Pan: 1 << 1,
    };
    ej.PdfViewer.BufferingMode = {
        Default: 1 << 0,
        Complete: 1 << 1,
    };
    ej.PdfViewer.Locale = ej.PdfViewer.Locale || {};

    ej.PdfViewer.Locale["default"] = ej.PdfViewer.Locale["en-US"] = {
        toolbar: {
            print: {
                headerText: 'Print',
                contentText: 'Print the PDF document.'
            },
            download: {
                headerText: 'Download',
                contentText: 'Download the PDF document.'
            },
            first: {
                headerText: 'First',
                contentText: 'Go to the first page of the PDF document.'
            },
            previous: {
                headerText: 'Previous',
                contentText: 'Go to the previous page of the PDF document.'
            },
            next: {
                headerText: 'Next',
                contentText: 'Go to the next page of the PDF document.'
            },
            last: {
                headerText: 'Last',
                contentText: 'Go to the last page of the PDF document.'
            },
            zoomIn: {
                headerText: 'Zoom-In',
                contentText: 'Zoom in to the PDF document.'
            },
            zoomOut: {
                headerText: 'Zoom-Out',
                contentText: 'Zoom out of the PDF document.'
            },
            pageIndex: {
                headerText: 'Page Number',
                contentText: 'Current page number to view.'
            },
            zoom: {
                headerText: 'Zoom',
                contentText: 'Zoom in or out on the PDF document.'
            },
            fitToWidth: {
                headerText: 'Fit to Width',
                contentText: 'Fit the PDF page to the width of the container.',
            },
            fitToPage: {
                headerText: 'Fit to Page',
                contentText: 'Fit the PDF page to the container.',
            },
            search: {
                headerText: 'Search Text',
                contentText: 'Search text in the PDF pages.',
            },
            highlight: {
                headerText: 'Highlight Text',
                contentText: 'Highlight text in the PDF pages.',
            },
            strikeout: {
                headerText: 'Strikethrough Text',
                contentText: 'Strikethrough text in the PDF pages.',
            },
            underline: {
                headerText: 'Underline Text',
                contentText: 'Underline text in the PDF pages.',
            },
            signature: {
                headerText: 'Signature',
                contentText: 'Add or create hand-written signature.',
            },
            select: {
                headerText: 'Selection',
                contentText: 'Selection tool for text.',
            },
            scroll: {
                headerText: 'Panning',
                contentText: 'Click to pan around the document',
            },
        },
        contextMenu: {
            copy: {
                contentText: 'Copy',
            },
            googleSearch: {
                contentText: 'Search google',
            },
            openPopup: {
                contentText: 'Open Pop-Up Note',
            },
            Delete: {
                contentText: 'Delete',
            },
            properties: {
                contentText: 'Properties....',
            },
            Find: {
                contentText: 'Find:',
            },
            matchCase: {
                contentText: 'Match Case',
            },
            auto: {
                contentText: 'Auto',
            },
        },
        propertyWindow: {
            underlineProperties: {
                contentText: "Underline Properties"
            },
            strikeOutProperties: {
                contentText: "StrikeOut Properties"
            },
            highlightProperties: {
                contentText: "Highlight Properties"
            },
            signatureProperties: {
                contentText: "Signature Properties"
            },
            appearance: {
                contentText: "Appearance"
            },
            general: {
                contentText: "General"
            },
            color: {
                contentText: "Color:"
            },
            opacity: {
                contentText: "Opacity:"
            },
            author: {
                contentText: "Author:"
            },
            subject: {
                contentText: "Subject:"
            },
            modified: {
                contentText: "Modified:"
            },
            ok: {
                contentText: "OK"
            },
            cancel: {
                contentText: "Cancel"
            },
            locked: {
                contentText: "Locked"
            }
        },
        signatureWindow: {
            Signature: {
                contentText: "Add Signature"
            },
            Add: {
                contentText: "Add"
            },
            clear: {
                contentText: "Clear"
            },
        },
        waitingPopup: {
            print: {
                contentText: "Preparing document for printing..."
            }
        }
    };
})(jQuery, Syncfusion);
;