"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function ($) {
    var SpellCheck = (function (_super) {
        __extends(SpellCheck, _super);
        function SpellCheck() {
            _super.apply(this, arguments);
            this.rootCSS = "e-spellcheck";
            this.validTags = ["div", "span", "textarea"];
            this.PluginName = "ejSpellCheck";
            this._id = "null";
            this.defaults = {
                locale: "en-US",
                misspellWordCss: "e-errorword",
                ignoreSettings: {
                    ignoreAlphaNumericWords: true,
                    ignoreHtmlTags: true,
                    ignoreEmailAddress: true,
                    ignoreMixedCaseWords: true,
                    ignoreUpperCase: true,
                    ignoreUrl: true,
                    ignoreFileNames: true
                },
                dictionarySettings: { dictionaryUrl: "", customDictionaryUrl: "" },
                maxSuggestionCount: 6,
                ajaxDataType: "jsonp",
                ignoreWords: [],
                contextMenuSettings: {
                    enable: true,
                    menuItems: [{ id: "IgnoreAll", text: "Ignore All" },
                        { id: "AddToDictionary", text: "Add to Dictionary" }]
                },
                isResponsive: true,
                enableValidateOnType: false,
                controlsToValidate: null,
                enableAsync: true,
                actionSuccess: null,
                actionBegin: null,
                actionFailure: null,
                start: null,
                complete: null,
                contextOpen: null,
                contextClick: null,
                dialogBeforeOpen: null,
                dialogOpen: null,
                dialogClose: null,
                validating: null,
                targetUpdating: null
            };
            this.dataTypes = {
                locale: "string",
                misspellWordCss: "string",
                ignoreSettings: {
                    ignoreAlphaNumericWords: "boolean",
                    ignoreHtmlTags: "boolean",
                    ignoreEmailAddress: "boolean",
                    ignoreMixedCaseWords: "boolean",
                    ignoreUpperCase: "boolean",
                    ignoreUrl: "boolean",
                    ignoreFileNames: "boolean"
                },
                dictionarySettings: {
                    dictionaryUrl: "string",
                    customDictionaryUrl: "string",
                    customDictionaryPath: "string"
                },
                maxSuggestionCount: "number",
                ajaxDataType: "string",
                ignoreWords: "array",
                contextMenuSettings: {
                    enable: "boolean",
                    menuItems: "array"
                }
            };
            this._tags = [
                { tag: "ignoreSettings", attr: [] },
                { tag: "dictionarySettings", attr: [] },
                { tag: "contextMenuSettings.menuItems", attr: ["id", "text"] },
            ];
            this._localizedLabels = null;
            this._statusFlag = true;
            this._words = [];
            this._inputWords = [];
            this._controlIds = [];
            this._control = [];
            this._targetStatus = true;
            this._statusMultiTarget = false;
            this._changeAllWords = [];
            this._subElements = [];
            this._iframeStatus = false;
            this._elementStatus = true;
            this._suggestedWordCollection = [];
            this._ignoreStatus = true;
            this._suggestedWords = [];
            this.model = this.defaults;
        }
        SpellCheck.prototype._init = function () {
            if (!ej.isNullOrUndefined(this.element)) {
                this._renderSpellCheck();
            }
        };
        SpellCheck.prototype._renderSpellCheck = function () {
            this._initLocalize();
            this._renderControls();
        };
        SpellCheck.prototype._initLocalize = function () {
            this._localizedLabels = this._getLocalizedLabels();
        };
        SpellCheck.prototype._renderControls = function () {
            if (ej.isNullOrUndefined(this.model.controlsToValidate)) {
                this._addAttributes(this, this.element);
            }
            else {
                $(this.element).attr("style", "display:none");
                this._controlIds = this.model.controlsToValidate.split(",");
                var elementPresent = false;
                for (var i = 0; i < this._controlIds.length; i++) {
                    var element = $(this._controlIds[i]);
                    if (element.length > 0) {
                        elementPresent = true;
                        if (element.length > 1) {
                            for (var j = 0; j < element.length; j++) {
                                var subElement = $(element[j]);
                                this._addAttributes(this, subElement);
                            }
                        }
                        else {
                            this._addAttributes(this, element);
                        }
                    }
                }
                this._elementStatus = this._statusFlag = elementPresent;
            }
            if (this.model.isResponsive) {
                this._on($(window), "resize", $.proxy(this._resizeSpellCheck, this));
            }
        };
        SpellCheck.prototype._addAttributes = function (proxy, element) {
            $(element).addClass("e-spellcheck");
            element[0].spellcheck = false;
            proxy._addEventListeners(proxy, element);
        };
        SpellCheck.prototype._addEventListeners = function (proxy, element) {
            if (proxy._isIframe(element)) {
                $(element)[0].contentWindow.document.addEventListener("input", function () {
                    proxy._changeStatus(proxy);
                }, false);
                if (proxy.model.contextMenuSettings.enable) {
                    $(element)[0].contentWindow.document.addEventListener("mousedown", function () {
                        proxy._elementRightClick(proxy);
                    }, false);
                    ($(document)[0]).addEventListener("mousedown", function () {
                        proxy._elementRightClick(proxy);
                    }, false);
                    $(element)[0].contentWindow.document.addEventListener("keydown", function (e) {
                        proxy._spellValidateOnType(e);
                    }, false);
                }
            }
            else {
                element[0].addEventListener("input", function () {
                    proxy._changeStatus(proxy);
                }, false);
                if (proxy.model.contextMenuSettings.enable) {
                    proxy._on($(document), "mousedown", $.proxy(proxy._elementRightClick, proxy));
                    proxy._on($(element[0]), "keydown", "", this._spellValidateOnType);
                }
            }
        };
        SpellCheck.prototype._changeStatus = function (proxy) {
            proxy._statusFlag = true;
            if (!ej.isNullOrUndefined(proxy.model.controlsToValidate)) {
                proxy._controlIds = proxy.model.controlsToValidate.split(",");
                proxy._targetStatus = true;
            }
        };
        SpellCheck.prototype._isIframe = function (element) {
            return $(element)[0].tagName === "IFRAME";
        };
        SpellCheck.prototype._resizeSpellCheck = function () {
            var spellWindowParent = !ej.isNullOrUndefined(this._spellCheckWindow) && this._spellCheckWindow.parents().find(".e-spellcheck.e-dialog-wrap");
            var dialogObj = (!ej.isNullOrUndefined(this._spellCheckWindow) &&
                spellWindowParent.length > 0) && this._spellCheckWindow.data("ejDialog");
            if (this.model.isResponsive) {
                if (!ej.isNullOrUndefined(this._spellCheckWindow) && spellWindowParent.length > 0 && this._spellCheckWindow.ejDialog("isOpen")) {
                    dialogObj._dialogPosition();
                    var listObj = this._spellCheckWindow.find(".e-suggesteditems").data("ejListBox");
                    listObj.refresh(true);
                    var scrollObj = this._spellCheckWindow.find(".e-sentence .e-sentencescroller").data("ejScroller");
                    setTimeout(function () {
                        spellWindowParent.find(".e-dialog-scroller").width(spellWindowParent.width() - 2);
                        spellWindowParent.find(".e-suggestionlist .e-content").width(spellWindowParent.find(".e-suggestionlist .e-content").width() - 2);
                        scrollObj.refresh();
                    }, 4);
                }
            }
            else {
                dialogObj._dialogPosition();
            }
            if (!ej.isNullOrUndefined(this._alertWindow) && this._alertWindow.data("ejDialog")) {
                var alertDialogObj = !ej.isNullOrUndefined(this._alertWindow) && this._alertWindow.data("ejDialog");
                alertDialogObj._dialogPosition();
            }
        };
        SpellCheck.prototype.showInDialog = function () {
            if (this._statusFlag) {
                this._renderDialogWindow();
            }
            else {
                this._alertWindowRender("show");
            }
        };
        SpellCheck.prototype.validate = function () {
            if (this._statusFlag) {
                var diffWords = [], event;
                if (this.model.contextMenuSettings.enable &&
                    !ej.isNullOrUndefined(this.model.dictionarySettings.dictionaryUrl)) {
                    var inputText = "";
                    if ((this._controlIds.length > 0 && !this._currentActiveElement && this.model.enableValidateOnType) ||
                        (this._controlIds.length > 0 && (!this.model.enableValidateOnType || !this._statusMultiTarget))) {
                        for (var i = 0; i < this._controlIds.length; i++) {
                            var element = $(this._controlIds[i]);
                            if (element.length > 0) {
                                for (var j = 0; j < element.length; j++) {
                                    var subElement = $(element[j]);
                                    var elementText = "";
                                    elementText = this._elementTextProcess(this, subElement);
                                    inputText = inputText === "" ? inputText.concat(elementText) : inputText.concat(" " + elementText);
                                }
                            }
                        }
                    }
                    else if (this.model.enableValidateOnType && this._currentActiveElement) {
                        inputText = this._elementTextProcess(this, $(this._currentActiveElement));
                    }
                    else {
                        if (this._isIframe(this.element)) {
                            $(this.element).contents().find("body").addClass("e-spellcheck");
                        }
                        inputText = this._elementTextProcess(this, this.element);
                    }
                    diffWords = this._filteringDiffWords(this, inputText);
                    this._splitWords(inputText, this);
                    event = { targetSentence: inputText, requestType: "validate", additionalParams: null };
                    if (this._trigger("actionBegin", event)) {
                        return false;
                    }
                    if (diffWords.length > 0) {
                        this._ajaxRequest(this, diffWords.join(" "), "validateOnType", event);
                    }
                    else if (diffWords.length === 0 && !this._ignoreStatus) {
                        this._splitInputWords(inputText, this);
                        diffWords = ej.dataUtil.distinct(this._inputWords);
                        this._ajaxRequest(this, diffWords.join(" "), "validateOnType", event);
                    }
                    else {
                        if (!ej.isNullOrUndefined(this._errorWordDetails)) {
                            var errorWordData = this._filterErrorData(this, this._errorWordDetails);
                            this._validateOnTypeOperations(this, errorWordData, inputText, "validateOnType");
                        }
                        else {
                            if (!this.model.enableValidateOnType) {
                                this._alertWindowRender("show");
                            }
                        }
                    }
                }
            }
            else {
                this._alertWindowRender("show");
            }
        };
        SpellCheck.prototype._filteringDiffWords = function (proxy, inputText) {
            var splitWords = proxy._inputWords, diffWords = [];
            proxy._splitInputWords(inputText, proxy);
            var updatedWords = proxy._inputWords;
            var index;
            for (var i = 0; i < updatedWords.length; i++) {
                index = splitWords.indexOf(updatedWords[i]);
                if (index === -1) {
                    diffWords.push(updatedWords[i]);
                }
            }
            if (updatedWords.length !== splitWords.length && diffWords.length !== 0) {
                if (updatedWords.length === diffWords.length)
                    diffWords = updatedWords;
            }
            return diffWords;
        };
        SpellCheck.prototype._elementTextProcess = function (proxy, element) {
            if (this.model.contextMenuSettings.enable && this.model.enableValidateOnType) {
                if (this._controlIds.length > 0) {
                    if (element[0].nodeType == 9 && element[0].nodeName == "#document") {
                        element = $(this._controlIds[0]);
                    }
                }
                else {
                    element = $(this.element[0]);
                }
            }
            var inputText = "";
            if (proxy._isIframe(element)) {
                inputText = $(element).contents().find("body").text();
            }
            else {
                inputText = ej.isNullOrUndefined($(element)[0].value)
                    ? ($(element)[0].innerText || $(element)[0].textContent).trim()
                    : $(element)[0].value.trim();
            }
            return inputText;
        };
        SpellCheck.prototype._splitWords = function (inputText, proxy) {
            var splitWords = inputText.split(/[^0-9a-zA-Z\'_]/);
            splitWords = splitWords.filter(function (str) { return /\S/.test(str); });
            proxy._words = splitWords;
        };
        SpellCheck.prototype._splitInputWords = function (inputText, proxy) {
            var splitWords = inputText.split(" ");
            proxy._inputWords = splitWords;
        };
        SpellCheck.prototype.spellCheck = function (targetSentence, misspelledWordCss) {
            var event = { targetSentence: targetSentence, misspelledWordCss: misspelledWordCss, requestType: "spellCheck" };
            if (this._trigger("actionBegin", event)) {
                return false;
            }
            this._misspelledWordCss = misspelledWordCss;
            this._ajaxRequest(this, targetSentence, "spellCheck", event);
        };
        SpellCheck.prototype.ignoreAll = function (word, targetContent) {
            if (!ej.isNullOrUndefined(word) && word !== "" && (!ej.isNullOrUndefined(targetContent) && targetContent !== "")) {
                var event = { ignoreWord: word, targetContent: targetContent, requestType: "ignoreAll" };
                if (this._trigger("validating", event)) {
                    return false;
                }
                this.model.ignoreWords.push(word);
                var ignoreResult = this._updateErrorContent(word, targetContent, null, "ignoreAll", null);
                return ignoreResult;
            }
            else {
                return false;
            }
        };
        SpellCheck.prototype.ignore = function (word, targetContent, index) {
            if (!ej.isNullOrUndefined(word) && word !== "" && (!ej.isNullOrUndefined(targetContent) && targetContent !== "")) {
                var event = { ignoreWord: word, targetContent: targetContent, requestType: "ignore" };
                if (this._trigger("validating", event)) {
                    return false;
                }
                var ignoreResult = this._updateErrorContent(word, targetContent, null, "ignore", index);
                return ignoreResult;
            }
            else {
                return false;
            }
        };
        SpellCheck.prototype.change = function (word, targetContent, changeWord, index) {
            if (!ej.isNullOrUndefined(word) && word !== "" && (!ej.isNullOrUndefined(targetContent) && targetContent !== "") && (!ej.isNullOrUndefined(changeWord) && changeWord !== "")) {
                var event = { changableWord: word, targetContent: targetContent, changeWord: changeWord, requestType: "changeWord" };
                if (this._trigger("validating", event)) {
                    return false;
                }
                var changeResult = this._updateErrorContent(word, targetContent, changeWord, "changeWord", index);
                return changeResult;
            }
            else {
                return false;
            }
        };
        SpellCheck.prototype.changeAll = function (word, targetContent, changeWord) {
            if (!ej.isNullOrUndefined(word) && word !== "" && (!ej.isNullOrUndefined(targetContent) && targetContent !== "") && (!ej.isNullOrUndefined(changeWord) && changeWord !== "")) {
                var event = { changableWord: word, targetContent: targetContent, changeWord: changeWord, requestType: "changeAll" };
                if (this._trigger("validating", event)) {
                    return false;
                }
                var obj = {};
                obj["ErrorWord"] = word;
                obj["ReplaceWord"] = changeWord;
                this._changeAllWords.push(obj);
                var changeResult = this._updateErrorContent(word, targetContent, changeWord, "changeAll", null);
                return changeResult;
            }
            else {
                return false;
            }
        };
        SpellCheck.prototype.addToDictionary = function (customWord) {
            if (!ej.isNullOrUndefined(customWord) && customWord !== "") {
                var event = { customWord: customWord, requestType: "addToDictionary", additionalParams: null };
                if (this._trigger("validating", event)) {
                    return false;
                }
                this._customWord = customWord;
                this._ajaxRequest(this, null, "addToDictionary", event);
            }
            else {
                return false;
            }
        };
        SpellCheck.prototype._updateErrorContent = function (word, targetContent, changeWord, requestType, index) {
            var updatedResult;
            if (targetContent.indexOf(word) !== -1) {
                var replaceString = "<span class=\"errorspan " + this.model.misspellWordCss + "\">" + word + "</span>";
                var replaceWord = requestType === "ignoreAll" || requestType === "addToDictionary" || requestType === "ignore" ? word : changeWord;
                if (requestType === "ignoreAll" || requestType === "addToDictionary" || requestType === "changeAll") {
                    targetContent = targetContent.replace(new RegExp(replaceString, "g"), replaceWord);
                }
                else if (requestType === "ignore" || requestType === "changeWord") {
                    if (ej.isNullOrUndefined(index)) {
                        targetContent = targetContent.replace(replaceString, replaceWord);
                    }
                    else {
                        var indexArray = new Array();
                        var startIndex = targetContent.indexOf(replaceString);
                        while (startIndex !== -1) {
                            indexArray.push(startIndex);
                            startIndex = targetContent.indexOf(replaceString, ++startIndex);
                        }
                        var replaceWordIndex = indexArray[index];
                        targetContent = targetContent.substr(0, replaceWordIndex) + replaceWord + targetContent.substr(replaceWordIndex + replaceString.length);
                    }
                }
                updatedResult = { resultHTML: targetContent };
            }
            else {
                updatedResult = false;
            }
            return updatedResult;
        };
        SpellCheck.prototype._renderDialogWindow = function () {
            this._dialogWindowRendering();
            this._showDialog();
        };
        SpellCheck.prototype._dialogWindowRendering = function () {
            var proxy = this;
            this._spellCheckWindow = ej.buildTag("div.e-spellcheckdialog#" + this._id + "ErrorCorrectionWindow");
            var _contentArea = ej.buildTag("div.e-dialogdiv");
            var _contentLabel = ej.buildTag("div.e-row e-labelrow")
                .append(ej.buildTag("div.e-labelcell")
                .append(ej.buildTag("label.e-dictionarylabel", this._localizedLabels.NotInDictionary)));
            var _misspelledContentAreaRow = ej.buildTag("div.e-row e-sentencerow");
            var _misspelledContentCell = ej.buildTag("div.e-cell e-sentencecell")
                .append(ej.buildTag("div.e-sentence", "", {}, {
                id: this._id + "_Sentences",
                name: "sentences",
                contenteditable: "false"
            }));
            _misspelledContentAreaRow.append(_misspelledContentCell);
            var _spellCheckButtons = ej.buildTag("div.e-buttoncell");
            var _ignoreOnceButton = ej.buildTag("button.e-btnignoreonce", this._localizedLabels.IgnoreOnceButtonText, {}, { id: this._id + "_IgnoreOnce" }).attr("type", "button");
            var _ignoreAllButton = ej.buildTag("button.e-btnignoreall", this._localizedLabels.IgnoreAllButtonText, {}, { id: this._id + "_IgnoreAll" }).attr("type", "button");
            var _addToDictionaryButton = ej.buildTag("button.e-btnaddtodictionary", this._localizedLabels.AddToDictionary, {}, { id: this._id + "_AddToDictionary" }).attr("type", "button");
            _misspelledContentAreaRow.append(_spellCheckButtons.append(_ignoreOnceButton).append(_ignoreAllButton).append(_addToDictionaryButton));
            var _suggestionsLabel = ej.buildTag("div.e-row e-labelrow").append(ej.buildTag("div.e-labelcell")
                .append(ej.buildTag("label.e-lablesuggestions", this._localizedLabels.SuggestionLabel)));
            var _suggestionsAreaRow = ej.buildTag("div.e-row e-suggestionsrow");
            var _suggestionContentCell = ej.buildTag("div.e-cell e-suggestioncell").append(ej.buildTag("ul.e-suggesteditems", "", {}, { id: this._id + "_Suggestions" }));
            _suggestionsAreaRow.append(_suggestionContentCell);
            var _spellCheckKeys = ej.buildTag("div.e-buttoncell");
            var _changeButton = ej.buildTag("button.e-btnchange", this._localizedLabels.ChangeButtonText, {}, { id: this._id + "_Change" }).attr("type", "button");
            var _changeAllButton = ej.buildTag("button.e-btnchangeall", this._localizedLabels.ChangeAllButtonText, {}, { id: this._id + "_ChangeAll" }).attr("type", "button");
            var _closeButton = ej.buildTag("button.e-btnclose", this._localizedLabels.CloseButtonText, {}, { id: this._id + "_Close" }).attr("type", "button");
            _suggestionsAreaRow.append(_spellCheckKeys.append(_changeButton).append(_changeAllButton).append(_closeButton));
            _contentArea.append(_contentLabel).append(_misspelledContentAreaRow).append(_suggestionsLabel).append(_suggestionsAreaRow);
            this._spellCheckWindow.append(_contentArea);
            this._spellCheckWindow.ejDialog({
                width: 462,
                minHeight: 305,
                enableModal: true,
                enableResize: false,
                showOnInit: false,
                allowKeyboardNavigation: false,
                target: $("body"),
                title: this._localizedLabels.SpellCheckButtonText,
                close: function () {
                    proxy._close();
                },
                cssClass: "e-spellcheck",
                isResponsive: this.model.isResponsive
            });
            var buttonClasses = [".e-btnignoreonce", ".e-btnignoreall", ".e-btnaddtodictionary", ".e-btnchange", ".e-btnchangeall", ".e-btnclose"];
            for (var i = 0; i < buttonClasses.length; i++) {
                this._spellCheckWindow.find(buttonClasses[i])
                    .ejButton({
                    width: this.model.isResponsive ? "100%" : 140,
                    click: function (e) {
                        e.model.text === proxy._localizedLabels.CloseButtonText ? proxy._close() : proxy._changeErrorWord(e);
                    },
                    cssClass: "e-spellbuttons"
                });
            }
            this._spellCheckWindow.find(".e-sentence").append(ej.buildTag("div.e-sentencescroller").append(ej.buildTag("div").append(ej.buildTag("div.e-sentencecontent", "", {}, { id: this._id + "_SentenceContent" }))));
            this._spellCheckWindow.find(".e-sentence .e-sentencescroller")
                .ejScroller({
                height: "100%",
                scrollerSize: 20
            });
            this._spellCheckWindow.find(".e-suggesteditems").ejListBox({
                width: "100%",
                height: "100%",
                dataSource: null,
                selectedIndex: 0,
                cssClass: "e-suggestionlist"
            });
        };
        SpellCheck.prototype._alertWindowRender = function (requestType) {
            this._renderAlertWindow(requestType);
            if (!this._elementStatus) {
                this._alertWindow.find(".e-alerttext").html(this._localizedLabels.NotValidElement);
            }
            var event = { spellCheckDialog: this._renderAlertWindow, requestType: "alertBeforeOpen" };
            if (this._trigger("dialogBeforeOpen", event)) {
                if (!ej.isNullOrUndefined(this._spellCheckWindow) && this._spellCheckWindow.parents().find(".e-spellcheck.e-dialog-wrap").length > 0)
                    this._close();
                return false;
            }
            else
                this._alertWindow.ejDialog("open");
        };
        SpellCheck.prototype._renderAlertWindow = function (requestType) {
            var proxy = this;
            this._alertWindow = ej.buildTag("div.e-alertdialog#" + this._id + "alertWindow");
            !this._elementStatus && this._alertWindow.addClass("e-missingalert");
            var _alertOkButton = ej.buildTag("div.e-alertbtn", "", { "text-align": "center" })
                .append(ej.buildTag("button.e-alertbutton e-alertspellok", this._localizedLabels.Ok, {}, { id: this._id + "alertok" }).attr("type", "button"));
            var _alertTextDiv = ej.buildTag("div.e-alerttextdiv");
            var _alertNotification = ej.buildTag("div.e-alertnotifydiv").append(ej.buildTag("div.e-alertnotification e-icon e-notification"));
            var _alertText = ej.buildTag("div.e-alerttext", this._localizedLabels.CompletionPopupMessage, { "text-align": "left", "padding": "5px" });
            _alertTextDiv.append(_alertNotification).append(_alertText);
            this._alertWindow.append(_alertTextDiv).append(_alertOkButton);
            this.element.append(this._alertWindow);
            this._alertWindow.find(".e-alertbutton")
                .ejButton({
                showRoundedCorner: true,
                width: this._elementStatus ? "70px" : "100px",
                click: function () {
                    proxy._alertClose();
                },
                cssClass: "e-flat"
            });
            this._alertWindow.ejDialog({
                width: this._elementStatus ? 240 : 420,
                minHeight: 140,
                showOnInit: false,
                enableModal: true,
                title: this._localizedLabels.CompletionPopupTitle,
                enableResize: false,
                allowKeyboardNavigation: false,
                target: requestType === "validating" ? ".e-spellcheckdialog" : $("body"),
                cssClass: !this._elementStatus ? "e-spellalert e-elementmissing" : "e-spellalert",
                close: function () {
                    proxy._alertClose();
                },
                isResponsive: this.model.isResponsive
            });
        };
        SpellCheck.prototype._renderContextMenu = function () {
            var proxy = this;
            var _menuTarget;
            this._contextMenu = ej.buildTag("ul#" + proxy._id + "contextMenu");
            if (!ej.isNullOrUndefined(proxy.model.controlsToValidate)) {
                var isIframe = false;
                for (var i = 0; i < proxy._controlIds.length; i++) {
                    var flag = proxy._isIframe($(proxy._controlIds[i]));
                    flag && (isIframe = true);
                }
                _menuTarget = isIframe ? $(proxy._controlIds[0]).contents()[0] : "." + proxy.model.misspellWordCss;
            }
            else {
                _menuTarget = proxy._isIframe(this.element)
                    ? proxy.element.contents()[0]
                    : "." + proxy.model.misspellWordCss;
            }
            this._contextMenu.ejMenu({
                fields: { id: "id", text: "text", parentId: "parentId" },
                menuType: ej.MenuType.ContextMenu,
                openOnClick: false,
                width: "auto",
                cssClass: "e-spellmenu",
                click: function (e) {
                    proxy._onMenuSelect(e);
                }
            });
        };
        SpellCheck.prototype._contextMenuPosition = function (e, proxy) {
            var posX, posY;
            if (!ej.isNullOrUndefined(proxy._activeElement) && proxy._isIframe($(proxy.element))) {
                var targetElement = !ej.isNullOrUndefined(proxy.model.controlsToValidate)
                    ? $(proxy._control[0]["controlId"])
                    : $(proxy.element);
                posX = ((e.clientX == undefined) ? 0 : e.clientX) + (targetElement).offset().left,
                    posY = ((e.clientY == undefined) ? 0 : e.clientY) + (targetElement).offset().top;
                var menuHeight = $(proxy._contextMenu).attr("style", "visibility: visible;display:block;").height(), menuWidth = $(proxy._contextMenu).width();
                posY = ((posY + menuHeight) < ($(document).scrollTop() + $(window).height()))
                    ? posY
                    : ((posY - menuHeight) < 0 ? posY : (posY - menuHeight));
                posX = ((posX + menuWidth) < ($(document).scrollLeft() + $(window).width())) ? posX : (posX - menuWidth);
            }
            else {
                posX = (e.clientX + proxy._contextMenu.width() < $(window).width()) ? e.pageX : e.pageX - proxy._contextMenu.width();
                posY = (e.clientY + proxy._contextMenu.height() < $(window).height()) ? e.pageY : (e.clientY > proxy._contextMenu.height()) ? e.pageY - proxy._contextMenu.height() : $(window).height() - proxy._contextMenu.outerHeight();
                var bodyPos = $("body").css("position") !== "static" ? $("body").offset() : { left: 0, top: 0 };
                posX -= bodyPos.left, posY -= bodyPos.top;
            }
            return {
                X: posX,
                Y: posY
            };
        };
        SpellCheck.prototype._showDialog = function () {
            var event = { spellCheckDialog: this._spellCheckWindow, requestType: "dialogBeforeOpen" };
            if (this._trigger("dialogBeforeOpen", event)) {
                return false;
            }
            this._spellCheckWindow.ejDialog("open");
            var inputText = "";
            this._subElements = [];
            var element;
            if (this._controlIds.length > 0) {
                for (var i = 0; i < this._controlIds.length; i++) {
                    var element_1 = $(this._controlIds[i]);
                    if (element_1.length > 0) {
                        for (var j = 0; j < element_1.length; j++) {
                            var subElement = $(element_1[j]);
                            this._activeElement = this._isIframe(subElement) ? $(subElement).contents().find("body")[0] : $(subElement)[0];
                            this._removeSpan(this);
                            this._subElements.push(subElement[0]);
                        }
                    }
                }
                inputText = this._inputTextProcess(this, $(this._subElements[0]), inputText);
                this._proElements = this._subElements.length > 0 && $(this._subElements[0]);
                this._currentTargetElement = element = $(this._subElements[0]);
                this._subElements = this._subElements.slice(1);
            }
            else {
                element = this.element;
                this._activeElement = this._isIframe(element) ? this._getIframeElement(element) : $(element)[0];
                this._removeSpan(this);
                inputText = this._inputTextProcess(this, element, inputText);
            }
            var targetHtml = "";
            !ej.isNullOrUndefined(this.model.controlsToValidate) ? this.element = element : this.element = this.element;
            if (this.element.length > 0) {
                if (this._isIframe(this.element)) {
                    targetHtml = $(this.element).contents().find("body").html();
                }
                else {
                    targetHtml = $(element)[0].tagName === "TEXTAREA" ||
                        $(element)[0].tagName === "INPUT"
                        ? $(element)[0].value
                        : $(element)[0].innerHTML;
                }
            }
            var diffWords = this._filteringDiffWords(this, inputText);
            this._splitWords(inputText, this);
            if (!ej.isNullOrUndefined(this.model.controlsToValidate)) {
                var updateTargetEvent = { previousElement: null, currentElement: element, targetHtml: targetHtml };
                if (this._trigger("targetUpdating", updateTargetEvent)) {
                    this._close();
                    return false;
                }
            }
            this._spellCheckWindow.find(".e-sentence .e-sentencecontent")[0].innerHTML = targetHtml;
            var dialogEvent = { targetText: inputText, requestType: "dialogOpen" };
            if (this._trigger("dialogOpen", dialogEvent)) {
                return false;
            }
            var beginEvent = { targetSentence: inputText, requestType: "spellCheck", additionalParams: null };
            if (this._trigger("actionBegin", beginEvent)) {
                return false;
            }
            if (diffWords.length > 0) {
                this._ajaxRequest(this, diffWords.join(" "), "spellCheckDialog", beginEvent);
            }
            else if (diffWords.length === 0 && !this._ignoreStatus) {
                this._splitInputWords(inputText, this);
                diffWords = ej.dataUtil.distinct(this._inputWords);
                this._ajaxRequest(this, diffWords.join(" "), "spellCheckDialog", beginEvent);
            }
            else {
                if (!ej.isNullOrUndefined(this._errorWordDetails)) {
                    var errorWordData = this._filterErrorData(this, this._errorWordDetails);
                    this._dialogModeOperations(this, errorWordData, inputText, "spellCheckDialog");
                }
                else {
                    this._alertWindowRender("show");
                }
            }
        };
        SpellCheck.prototype._getIframeElement = function (element) {
            return $(element).contents().find("body")[0];
        };
        SpellCheck.prototype._inputTextProcess = function (proxy, element, inputText) {
            if (proxy._isIframe(element)) {
                var iframeText = $(element).contents().find("body").text();
                inputText = inputText === "" ? iframeText : (inputText + iframeText);
            }
            else {
                var elementText = ej.isNullOrUndefined($(element)[0].value)
                    ? ($(element)[0].innerText || $(element)[0].textContent).trim()
                    : $(element)[0].value.trim();
                inputText = inputText === "" ? elementText : (inputText + " " + elementText);
            }
            return inputText;
        };
        SpellCheck.prototype._ajaxRequest = function (proxy, text, requestType, events) {
            var value = requestType === "addToDictionary" ? JSON.stringify({ customWord: proxy._customWord, additionalParams: events.additionalParams }) : this._getModelValues(this, text, events);
            $.ajax({
                async: this.model.enableAsync,
                url: requestType === "addToDictionary" ? this.model.dictionarySettings.customDictionaryUrl : this.model.dictionarySettings.dictionaryUrl,
                data: { data: value },
                contentType: "application/json; charset=utf-8",
                dataType: this.model.ajaxDataType,
                crossDomain: true,
                success: function (args) {
                    var data, result;
                    result = (typeof args == "string") && (requestType !== "addToDictionary") ? JSON.parse(args) : args;
                    if (requestType === "addToDictionary") {
                        if (!ej.isNullOrUndefined(proxy._errorWordDetails) && !ej.isNullOrUndefined(proxy._currentElement)) {
                            data = proxy._errorWordDetails;
                            if (!ej.isNullOrUndefined(result)) {
                                proxy._filterData(result.toString(), proxy);
                                proxy._errorWordDetails = proxy._errorWordsData;
                            }
                        }
                        else
                            data = [];
                    }
                    else {
                        data = proxy._updateErrorDetails(proxy, result);
                    }
                    var word, elementText = text, event;
                    if (data.length > 0) {
                        var errorWordData;
                        if (requestType === "spellCheckDialog" ||
                            requestType === "validateOnType" ||
                            requestType === "validateOnRender") {
                            errorWordData = proxy._filterErrorData(proxy, data);
                            if (errorWordData.length > 0) {
                                if (requestType === "spellCheckDialog") {
                                    proxy._dialogModeOperations(proxy, errorWordData, elementText, requestType);
                                }
                                else if (requestType === "validateOnType" || requestType === "validateOnRender") {
                                    proxy._validateOnTypeOperations(proxy, errorWordData, elementText, requestType);
                                }
                            }
                            else {
                                if (requestType === "spellCheckDialog") {
                                    proxy._spellCheckWindow.ejDialog("isOpen") && proxy._spellCheckWindow.ejDialog("close");
                                }
                                proxy._alertWindowRender("validating");
                            }
                        }
                        else if (requestType === "spellCheck") {
                            if (data.length > 0) {
                                var filterData = proxy._getFilterData(data, proxy);
                                errorWordData = ej.dataUtil.distinct(filterData);
                                for (var i = 0; i < errorWordData.length; i++) {
                                    var query = new ej.Query()
                                        .where("ErrorWord", ej.FilterOperators.equal, errorWordData[i]);
                                    var filterValue = new ej.DataManager(data).executeLocal(query);
                                    if (errorWordData.length > 0) {
                                        word = "<span class=\"errorspan " +
                                            ((!ej.isNullOrUndefined(proxy._misspelledWordCss) &&
                                                proxy._misspelledWordCss !== "")
                                                ? proxy._misspelledWordCss
                                                : proxy.model.misspellWordCss) +
                                            "\">" +
                                            errorWordData[i] +
                                            "</span>";
                                        var replaceExpression = new RegExp(errorWordData[i], "gi");
                                        elementText = elementText.replace(replaceExpression, word);
                                    }
                                }
                                event = { resultHTML: elementText, errorWordDetails: data, requestType: "spellCheck" };
                                proxy._misspelledWordCss = null;
                            }
                            else {
                                event = { resultHTML: elementText, errorWordDetails: data, requestType: "spellCheck" };
                            }
                            proxy._trigger("actionSuccess", event);
                        }
                        else if (requestType === "addToDictionary") {
                            var errorHtml;
                            if (!ej.isNullOrUndefined(proxy._currentElement)) {
                                if ($(proxy._currentElement)[0].tagName === "IFRAME") {
                                    errorHtml = $(proxy._currentElement).contents().find("body").html();
                                }
                                else {
                                    errorHtml = $(proxy._currentElement).html().trim();
                                }
                            }
                            var updatedResult = proxy
                                ._updateErrorContent(proxy._customWord, errorHtml, null, "addToDictionary", null);
                            if (!ej.isNullOrUndefined(errorHtml)) {
                                if (!ej.isNullOrUndefined(proxy._spellCheckWindow) &&
                                    proxy._spellCheckWindow.find(".e-btnaddtodictionary").hasClass("e-select")) {
                                    var listBoxElement = proxy._spellCheckWindow.find(".e-suggesteditems");
                                    var contentElement = proxy._spellCheckWindow.find(".e-sentence .e-sentencecontent");
                                    if (proxy._errorWordsData.length > 0) {
                                        contentElement[0].innerHTML = updatedResult["resultHTML"];
                                        proxy._replaceErrorText(contentElement, proxy._customWord.toString());
                                        proxy._listBoxDataUpdate(proxy);
                                    }
                                    else {
                                        listBoxElement.ejListBox({ dataSource: null });
                                        proxy._statusFlag = false;
                                        proxy._alertWindowRender("validating");
                                    }
                                }
                                else if (!ej.isNullOrUndefined(proxy._contextMenu)) {
                                    proxy._isIframe(proxy.element) ? $(proxy.element).contents().find("body").html(updatedResult["resultHTML"]) : $(proxy._currentElement)[0].innerHTML = updatedResult["resultHTML"];
                                    if (proxy._controlIds.length > 0) {
                                        for (var i_1 = 0; i_1 < proxy._controlIds.length; i_1++) {
                                            var element = $(proxy._controlIds[i_1]);
                                            for (var j = 0; j < element.length; j++) {
                                                if ($(proxy._currentElement)[0] !== $(element[j])[0]) {
                                                    var activeElement = $(element[j]);
                                                    proxy._replaceErrorText(activeElement, proxy._customWord.toString());
                                                }
                                            }
                                        }
                                    }
                                    proxy._renderMenu(proxy);
                                }
                                event = {
                                    resultHTML: updatedResult["resultHTML"],
                                    errorWordDetails: result,
                                    requestType: "addToDictionary"
                                };
                                proxy._trigger("actionSuccess", event);
                            }
                        }
                    }
                    else {
                        if (proxy._subElements.length > 0) {
                            proxy._updateTargetText(proxy);
                        }
                        else {
                            if (requestType === "spellCheckDialog") {
                                proxy._spellCheckWindow.ejDialog("isOpen") && proxy._spellCheckWindow.ejDialog("close");
                            }
                            if (requestType === "spellCheck") {
                                event = { resultHTML: text, errorWordDetails: data, requestType: "spellCheck" };
                                proxy._trigger("actionSuccess", event);
                            }
                            if (requestType === "validateOnType") {
                                proxy._removeSpan(proxy);
                            }
                            if (requestType !== "spellCheck" && requestType !== "addToDictionary")
                                proxy._alertWindowRender("load");
                        }
                    }
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    var errorEvent = { errorMessage: errorThrown, requestType: requestType };
                    proxy._trigger("actionFailure", errorEvent);
                }
            });
        };
        SpellCheck.prototype.getSuggestionWords = function (errorWord) {
            this._selectedValue = errorWord;
            this._suggestionsRequest(this, null, errorWord, "getSuggestions");
        };
        SpellCheck.prototype._suggestionsRequest = function (proxy, element, errorWord, requestType) {
            var value;
            if (requestType === "validateByMenu" || requestType === "suggestionsUpdate" || requestType === "getSuggestions")
                value = JSON.stringify({ requestType: "getSuggestions", errorWord: errorWord });
            else
                value = proxy._getModelValues(proxy, errorWord, null);
            $.ajax({
                async: proxy.model.enableAsync,
                url: proxy.model.dictionarySettings.dictionaryUrl,
                data: { data: value },
                contentType: "application/json; charset=utf-8",
                dataType: proxy.model.ajaxDataType,
                crossDomain: true,
                success: function (args) {
                    var obj = {}, result;
                    result = (typeof args == "string") ? JSON.parse(args) : args;
                    obj["ErrorWord"] = errorWord;
                    obj["SuggestedWords"] = result[errorWord];
                    proxy._suggestedWordCollection.push(obj);
                    if (requestType === "getSuggestions") {
                        proxy._suggestedWords = result[proxy._selectedValue];
                    }
                    else {
                        if (requestType === "validateByMenu") {
                            var errorWordsData = result[errorWord];
                            proxy._contextMenuDisplay(proxy, errorWordsData);
                        }
                        else if (requestType === "validateByDialog") {
                            var data = proxy._updateErrorDetails(proxy, result);
                            if (data.length > 0) {
                                var errorWordData = proxy._filterErrorData(proxy, data);
                                proxy._splitWords(element[0].innerText, proxy);
                                proxy._processNode(proxy, element[0], errorWordData, "spellCheckDialog");
                                proxy._activeElement = element[0];
                                proxy._changeAllErrors(proxy);
                                proxy._listBoxDataUpdate(proxy);
                            }
                            else {
                                if (proxy._subElements.length > 0) {
                                    proxy._updateTargetText(proxy);
                                }
                                else {
                                    proxy._completionCheck(proxy);
                                }
                            }
                        }
                        else if (requestType === "suggestionsUpdate") {
                            var filterData = result[element[0].innerText];
                            proxy._dialogSuggestionsUpdate(proxy, filterData);
                        }
                    }
                }
            });
        };
        SpellCheck.prototype._filterErrorData = function (proxy, data) {
            var filteredData = proxy._getFilterData(data, proxy);
            return ej.dataUtil.distinct(filteredData);
        };
        SpellCheck.prototype._updateErrorDetails = function (proxy, result) {
            var data = [];
            if (ej.isNullOrUndefined(proxy._errorWordDetails)) {
                data = proxy._errorWordDetails = result;
            }
            else {
                if (result.length > 0) {
                    if (proxy._ignoreStatus) {
                        for (var k = 0; k < result.length; k++) {
                            proxy._errorWordDetails.push(result[k]);
                            data = proxy._errorWordDetails;
                        }
                    }
                    else {
                        data = proxy._errorWordDetails = result;
                        proxy._ignoreStatus = true;
                    }
                }
                else {
                    data = proxy._errorWordDetails;
                }
            }
            return data;
        };
        SpellCheck.prototype._contextMenuDisplay = function (proxy, errorWordsData) {
            ej.isNullOrUndefined(proxy._contextMenu) && proxy._renderContextMenu();
            var menuObj = proxy._contextMenu.data("ejMenu");
            var options = proxy.model.contextMenuSettings.menuItems;
            if (errorWordsData.length > 0 && this.model.maxSuggestionCount > 0) {
                var suggestedWords = [];
                var count = proxy.model.maxSuggestionCount < errorWordsData.length
                    ? proxy.model.maxSuggestionCount
                    : errorWordsData.length;
                suggestedWords = proxy._convertData(errorWordsData.slice(0, count), "menuData");
                var sugCount = suggestedWords.length;
                var separatorElement = suggestedWords[count - 1]["id"];
                for (var i = 0; i < options.length; i++) {
                    suggestedWords.push(options[i]);
                }
                menuObj.option("fields.dataSource", suggestedWords);
                var menuItems = menuObj.element.find(".e-list");
                for (var j = 0; j < sugCount; j++) {
                    $(menuItems[j]).addClass("e-errorsuggestions");
                }
                for (var k = 0; k < menuItems.length; k++) {
                    if (menuItems[k].attributes["id"].value === separatorElement) {
                        $(menuItems[k]).addClass("e-separator");
                    }
                }
            }
            else {
                menuObj.option("fields.dataSource", options);
            }
            var position = proxy._contextMenuPosition(proxy._menuEvents, proxy);
            $(menuObj.element).css({ "left": position.X, "top": position.Y });
            $(menuObj.element).css("display", "block");
        };
        SpellCheck.prototype._dialogSuggestionsUpdate = function (proxy, filterData) {
            var listBoxElement = proxy._spellCheckWindow.find(".e-suggesteditems");
            var listObj = $("#" + proxy._id + "_Suggestions").data("ejListBox");
            var suggestions;
            if (filterData.length > 0) {
                if (proxy._spellCheckWindow.find(".e-btnchange").hasClass("e-disable") &&
                    proxy._spellCheckWindow.find(".e-btnchangeall").hasClass("e-disable")) {
                    proxy._spellCheckWindow.find(".e-btnchange").removeClass("e-disable");
                    proxy._spellCheckWindow.find(".e-btnchangeall").removeClass("e-disable");
                }
                var count = proxy.model.maxSuggestionCount < filterData.length
                    ? proxy.model.maxSuggestionCount
                    : filterData.length;
                suggestions = filterData.slice(0, count);
            }
            else {
                proxy._spellCheckWindow.find(".e-btnchange").addClass("e-disable");
                proxy._spellCheckWindow.find(".e-btnchangeall").addClass("e-disable");
                suggestions = [proxy._localizedLabels.NoSuggestionMessage];
            }
            listBoxElement.ejListBox({ selectedIndex: null });
            listBoxElement.ejListBox({
                dataSource: proxy._convertData(suggestions, "dictionaryData"),
                selectedIndex: 0
            });
            if (!ej.isNullOrUndefined(listObj))
                listObj.refresh();
            var scrollObj = proxy._spellCheckWindow.find(".e-sentence .e-sentencescroller").data("ejScroller");
            if (!ej.isNullOrUndefined(scrollObj) && scrollObj.isVScroll())
                $(proxy._spellCheckWindow.find("." + proxy.model.misspellWordCss)).get(0).scrollIntoView(false);
        };
        SpellCheck.prototype._replaceErrorText = function (currentElement, result) {
            var spanElement = $(currentElement).find(".errorspan");
            for (var i = 0; i < spanElement.length; i++) {
                var spanText = spanElement[i].innerText || spanElement[i].textContent;
                if (spanText === result) {
                    $(spanElement[i]).replaceWith(spanText);
                }
            }
        };
        SpellCheck.prototype._dialogModeOperations = function (proxy, errorWordData, elementText, requestType) {
            var event = { errorWords: proxy._errorWordDetails, targetText: elementText, requestType: requestType };
            var contentElement = proxy._spellCheckWindow.find(".e-sentence .e-sentencecontent");
            if (errorWordData.length > 0) {
                proxy._removeSpan(proxy);
                proxy._processNode(proxy, contentElement[0], errorWordData, requestType);
                if (this._trigger("start", event)) {
                    return false;
                }
                var scrollObj = proxy._spellCheckWindow.find(".e-sentence .e-sentencescroller").data("ejScroller");
                scrollObj.refresh();
                proxy._listBoxDataUpdate(proxy);
            }
            else {
                var listBoxElement = proxy._spellCheckWindow.find(".e-suggesteditems");
                requestType === "spellCheckDialog" && (contentElement[0].innerHTML = elementText);
                listBoxElement.ejListBox({ dataSource: null });
                proxy._statusFlag = false;
                this._alertWindowRender("load");
            }
        };
        SpellCheck.prototype._validateOnTypeOperations = function (proxy, errorWordData, elementText, requestType) {
            if (errorWordData.length > 0) {
                if ((this._controlIds.length > 0 && !this._currentActiveElement && this.model.enableValidateOnType) ||
                    (this._controlIds.length > 0 && (!this.model.enableValidateOnType || !this._statusMultiTarget))) {
                    for (var i = 0; i < proxy._controlIds.length; i++) {
                        var element = $(this._controlIds[i]);
                        for (var j = 0; j < element.length; j++) {
                            var subElement = (proxy._isIframe($(element[j]))
                                ? proxy._getIframeElement($(element[j]))
                                : $(element[j])[0]);
                            proxy._activeElement = subElement;
                            proxy._removeSpan(proxy);
                            proxy._processNode(proxy, subElement, errorWordData, requestType);
                            var obj = {};
                            obj["controlId"] = proxy._controlIds[i];
                            obj["errorHtml"] = subElement.innerHTML;
                            proxy._control.push(obj);
                        }
                    }
                }
                else if (this.model.enableValidateOnType && this._currentActiveElement) {
                    proxy._removeSpan(proxy);
                    proxy._processNode(proxy, this._currentActiveElement, errorWordData, requestType);
                    this._statusMultiTarget = false;
                }
                else {
                    if (proxy._isIframe(proxy.element)) {
                        var elem = proxy._getIframeElement(proxy.element);
                        proxy._activeElement = elem;
                        proxy._removeSpan(proxy);
                        proxy._processNode(proxy, elem, errorWordData, requestType);
                    }
                    else {
                        proxy._removeSpan(proxy);
                        proxy._processNode(proxy, $(proxy.element)[0], errorWordData, requestType);
                    }
                }
                proxy._statusFlag = true;
                var event_1;
                if (this._controlIds.length > 0)
                    event_1 = { errorWords: proxy._errorWordDetails, targetControls: this._control, requestType: requestType };
                else
                    event_1 = { errorWords: proxy._errorWordDetails, targetText: $(proxy.element)[0].innerText, requestType: requestType };
                if (this._trigger("start", event_1)) {
                    return false;
                }
                if (proxy._isIframe(this.element)) {
                    proxy._bindBeforeOpen(proxy, $(this.element).contents().find("body"));
                }
                else {
                    if (proxy._controlIds.length > 0) {
                        for (var i = 0; i < proxy._controlIds.length; i++) {
                            proxy._bindBeforeOpen(proxy, $(proxy._controlIds[i]));
                        }
                    }
                    else
                        proxy._bindBeforeOpen(proxy, $(this.element));
                }
            }
            else {
                proxy._removeSpan(proxy);
                proxy._statusFlag = false;
                proxy._alertWindowRender("show");
            }
            if (this.model.enableValidateOnType) {
                proxy.setCursorPosition(proxy._currentCursorTarget);
            }
        };
        SpellCheck.prototype._bindBeforeOpen = function (proxy, element) {
            proxy._on($(element).find("." + this.model.misspellWordCss), "contextmenu", $.proxy(proxy._contextOpen, proxy));
        };
        SpellCheck.prototype._contextOpen = function (e) {
            var _targ = $(e.target);
            if (_targ.hasClass("errorspan")) {
                e.preventDefault();
                var proxy = this;
                var selectedWord = proxy._selectedValue = _targ[0].innerText;
                proxy._selectedTarget = _targ[0];
                proxy._menuEvents = e;
                var event = { selectedErrorWord: selectedWord, requestType: "contextOpen" };
                if (proxy._trigger("contextOpen", event)) {
                    return false;
                }
                var filterValue = proxy._filterSuggestions(proxy, selectedWord);
                if (filterValue.length > 0) {
                    proxy._contextMenuDisplay(proxy, filterValue[0]["SuggestedWords"]);
                }
                else {
                    proxy._suggestionsRequest(proxy, null, selectedWord, "validateByMenu");
                }
            }
            else {
                this._elementRightClick(e);
            }
        };
        SpellCheck.prototype._processNode = function (proxy, element, errorWordData, requestType) {
            var elementTextNodes = proxy._filterTextNodes(proxy, element);
            for (var i = 0; i < elementTextNodes.length; i++) {
                var presentNode = elementTextNodes[i];
                var elementNodes = [elementTextNodes[i]];
                var nodeData = elementTextNodes[i].data;
                var isUrl = false, isEmail = false, flag = false;
                if (proxy.model.ignoreSettings.ignoreUrl) {
                    var urlRegEx = /^((http|ftp|https)?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
                    isUrl = urlRegEx.test(presentNode.wholeText);
                    isUrl && (flag = isUrl);
                }
                if (proxy.model.ignoreSettings.ignoreEmailAddress) {
                    var mailAddressValidation = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
                    isEmail = mailAddressValidation.test(presentNode.wholeText);
                    isEmail && (flag = isEmail);
                }
                if (!flag) {
                    for (var j = 0; j < proxy._words.length; j++) {
                        for (var k = 0; k < errorWordData.length; k++) {
                            if (proxy._words[j] === errorWordData[k] &&
                                !ej.isNullOrUndefined(nodeData.match(new RegExp("\\b" + errorWordData[k] + "\\b", "gi"))) &&
                                nodeData.indexOf(errorWordData[k]) !== -1) {
                                var wordIndex = nodeData.indexOf(errorWordData[k]);
                                var wordLength = errorWordData[k].length;
                                var newNode = presentNode.splitText(wordIndex);
                                var span = document.createElement("span");
                                if (requestType === "validateOnType")
                                    span.className = "errorspan " + this.model.misspellWordCss;
                                else
                                    span.className = "errorspan";
                                var errorTextNode = document.createTextNode(errorWordData[k]);
                                span.appendChild(errorTextNode);
                                presentNode.parentNode.insertBefore(span, newNode);
                                newNode.data = newNode.data.substr(wordLength);
                                presentNode = newNode;
                                elementNodes.push(errorTextNode);
                                elementNodes.push(newNode);
                                nodeData = newNode.data;
                            }
                        }
                    }
                }
            }
        };
        SpellCheck.prototype._findRepeatWords = function (wordIndex, nodeData, errorWordData, k) {
            var matchedErrorWord, countWordIndex, countCharactor, countCharCode, isregExp;
            var charRegEx = /([{^}:[\\.,;><?|@!~`#$%&*()_=+'"])/g;
            for (countWordIndex = wordIndex; countWordIndex <= nodeData.length; countWordIndex++) {
                isregExp = false;
                countCharactor = nodeData.charAt(countWordIndex);
                countCharCode = countCharactor.charCodeAt(countCharactor);
                isregExp = charRegEx.test(countCharactor);
                if (countCharactor == ' ' || countCharCode == 160 || countCharactor == "" || isregExp) {
                    matchedErrorWord = nodeData.slice(wordIndex, countWordIndex);
                    if (matchedErrorWord === errorWordData[k]) {
                        break;
                    }
                    else {
                        wordIndex = countWordIndex + 1;
                    }
                }
            }
            return wordIndex;
        };
        SpellCheck.prototype._spellValidateOnType = function (e) {
            if (this.model.enableValidateOnType && this.model.contextMenuSettings.enable) {
                var event_2 = { events: e, requestType: "validate" };
                this._trigger("validating", event_2);
                this._statusMultiTarget = false;
                this._currentActiveElement = event_2.events.currentTarget;
                if (event_2.events.cancelable === true) {
                    var keyCode = e.keyCode;
                    if (keyCode >= 16 && keyCode <= 31) {
                        return;
                    }
                    if (keyCode >= 37 && keyCode <= 40) {
                        return;
                    }
                    if (keyCode === 32 || keyCode === 13) {
                        this._statusMultiTarget = true;
                        this._triggerSpelling();
                    }
                }
            }
        };
        SpellCheck.prototype._triggerSpelling = function () {
            var proxy = this;
            setTimeout(function () {
                proxy.getCursorPosition();
                proxy.validate();
            }, 2);
        };
        SpellCheck.prototype.getCursorPosition = function () {
            if (this.model.enableValidateOnType && this.model.contextMenuSettings.enable) {
                var proxy = this;
                var temp_node = String.fromCharCode(7);
                var getSelection;
                var range;
                if (this._controlIds.length > 0) {
                    for (var i = 0; i < this._controlIds.length; i++) {
                        var element = $(this._controlIds[i]);
                        if (this._isIframe(element)) {
                            getSelection = element[0].contentWindow.getSelection();
                            range = element[0].contentDocument.createRange();
                        }
                        else {
                            getSelection = document.getSelection();
                            range = document.createRange();
                        }
                    }
                }
                else {
                    if (this._isIframe(this.element)) {
                        getSelection = this.element[0].contentWindow.getSelection();
                        range = this.element[0].contentDocument.createRange();
                    }
                    else {
                        getSelection = document.getSelection();
                        range = document.createRange();
                    }
                }
                var getRange = getSelection.getRangeAt(0);
                getRange.deleteContents();
                if (this._isIframe(this.element) && ej.browserInfo().name === "msie") {
                    var el = this.element[0].contentDocument.createElement("div");
                    el.innerHTML = temp_node;
                    var frag = $(this.element[0]).contents()[0].createDocumentFragment(), node, lastNode;
                    while (node = el.firstChild) {
                        lastNode = frag.appendChild(node);
                    }
                    getRange.insertNode(frag);
                }
                else {
                    getRange.insertNode(document.createTextNode(temp_node));
                }
                if ($(getRange.startContainer.parentElement).hasClass("errorspan")) {
                    if (this.model.controlsToValidate) {
                        proxy._normalizeTextNodes(this._currentActiveElement);
                    }
                    else {
                        proxy._normalizeTextNodes($(proxy.element)[0]);
                    }
                }
                proxy._currentCursorTarget = proxy._getActiveTarget(proxy, temp_node);
                range.collapse(true);
                range.setStart(proxy._currentCursorTarget.node, proxy._currentCursorTarget.offset);
                range.setEnd(proxy._currentCursorTarget.node, proxy._currentCursorTarget.offset);
                getSelection.removeAllRanges();
                getSelection.addRange(range);
                return proxy._currentCursorTarget;
            }
        };
        SpellCheck.prototype._getActiveTarget = function (proxy, temp_node) {
            var elementTextNodes;
            if (this.model.enableValidateOnType) {
                elementTextNodes = proxy._filterTextNodes(proxy, this._currentActiveElement);
            }
            else {
                elementTextNodes = proxy._filterTextNodes(proxy, $(proxy.element)[0]);
            }
            var currentCursorPosition = null;
            var currentCursorNode = null;
            for (var i = 0; i < elementTextNodes.length; i++) {
                if (elementTextNodes[i].data.indexOf(temp_node) > -1) {
                    currentCursorNode = elementTextNodes[i];
                    currentCursorPosition = elementTextNodes[i].data.indexOf(temp_node);
                    elementTextNodes[i].data = elementTextNodes[i].data.replace(temp_node, "");
                    return {
                        node: currentCursorNode,
                        offset: currentCursorPosition
                    };
                }
            }
        };
        SpellCheck.prototype.setCursorPosition = function (cursorTarget) {
            var selection;
            var range;
            if (this._controlIds.length > 0) {
                for (var i = 0; i < this._controlIds.length; i++) {
                    var element = $(this._controlIds[i]);
                    if (this._isIframe(element)) {
                        selection = element[0].contentDocument.getSelection();
                        range = element[0].contentDocument.createRange();
                    }
                    else {
                        selection = document.getSelection();
                        range = document.createRange();
                    }
                }
            }
            else {
                if (this._isIframe(this.element)) {
                    selection = this.element[0].contentDocument.getSelection();
                    range = this.element[0].contentDocument.createRange();
                }
                else {
                    selection = document.getSelection();
                    range = document.createRange();
                }
            }
            var elementTextNodes;
            if (selection.getRangeAt && selection.rangeCount) {
                var temp_node = String.fromCharCode(7);
                if (cursorTarget) {
                    if (this.model.controlsToValidate) {
                        elementTextNodes = this._filterTextNodes(this, this._currentActiveElement);
                    }
                    else {
                        elementTextNodes = this._filterTextNodes(this, $(this.element)[0]);
                    }
                    var currentCursorNode = cursorTarget.node;
                    var currentCursorPosition = cursorTarget.offset;
                    for (var i = 0; i < elementTextNodes.length; i++) {
                        if (elementTextNodes[i] === currentCursorNode) {
                            var nodeIndex = i;
                        }
                    }
                    var currentWord = '';
                    if (nodeIndex === undefined) {
                        var wordEmptySpace = '';
                        var wordRightSpace = '';
                        var charCodeEmptySpace = '';
                        var currentWord = '';
                        var wordWithoutSpace = '';
                        var isWordRightSpace = false;
                        var isWord = false;
                        for (var cx = 0; cx < currentCursorNode.length; cx++) {
                            var cc = currentCursorNode.data.charAt(cx);
                            if (cc.charCodeAt(0) != 160) {
                                if (cc.charCodeAt(0) != 32) {
                                    if (wordEmptySpace === '') {
                                        currentWord = currentWord + cc;
                                    }
                                    else {
                                        if (cc != temp_node) {
                                            wordRightSpace = wordRightSpace + cc;
                                        }
                                    }
                                }
                                else {
                                    wordEmptySpace = currentWord + cc;
                                    wordRightSpace = cc;
                                }
                            }
                            else {
                                wordEmptySpace = currentWord + cc;
                                charCodeEmptySpace = ' ' + charCodeEmptySpace + cc;
                            }
                        }
                        currentWord = currentWord + wordRightSpace;
                        wordWithoutSpace = wordEmptySpace.trim();
                        for (var i = 0; i < elementTextNodes.length; i++) {
                            if (elementTextNodes[i].data === currentWord) {
                                nodeIndex = i;
                            }
                            if (elementTextNodes[i].data === wordEmptySpace) {
                                nodeIndex = i;
                            }
                            if (elementTextNodes[i].data === wordRightSpace && wordRightSpace != '') {
                                nodeIndex = i;
                                isWordRightSpace = true;
                            }
                            if (elementTextNodes[i].data === currentWord && currentWord != '') {
                                nodeIndex = i;
                                isWord = true;
                                break;
                            }
                            if (elementTextNodes[i].data === wordWithoutSpace) {
                                nodeIndex = i;
                            }
                            if (elementTextNodes[i].data === currentWord && elementTextNodes[i + 1] !== undefined && elementTextNodes[i + 1].data.charCodeAt(0) === 160) {
                                nodeIndex = i;
                                break;
                            }
                            if (elementTextNodes[i].data === currentWord && elementTextNodes[i + 1] !== undefined && elementTextNodes[i + 1].data.charCodeAt(1) === 160 && charCodeEmptySpace.length >= 1) {
                                nodeIndex = i;
                                break;
                            }
                            if ((elementTextNodes[i].data === wordEmptySpace || elementTextNodes[i].data === currentWord) && elementTextNodes[i + 1] == undefined) {
                                var errorTextNode = document.createTextNode("");
                                elementTextNodes.push(errorTextNode);
                                this._currentActiveElement.appendChild(errorTextNode);
                                nodeIndex = i + 1;
                                currentCursorPosition = elementTextNodes[nodeIndex].data.length;
                                currentCursorNode = elementTextNodes[nodeIndex];
                                break;
                            }
                        }
                    }
                    for (var i = nodeIndex; i < elementTextNodes.length - 1; i++) {
                        if (currentCursorPosition <= elementTextNodes[i].data.length) {
                            currentCursorNode = elementTextNodes[i];
                            break;
                        }
                        if (isWordRightSpace === false || wordRightSpace === undefined || wordRightSpace === '') {
                            currentCursorPosition -= elementTextNodes[i].data.length;
                            currentCursorNode = elementTextNodes[i + 1];
                        }
                        else {
                            currentCursorPosition = 1;
                            currentCursorNode = elementTextNodes[i];
                            break;
                        }
                    }
                    var textNode = currentCursorNode;
                    range.collapse(true);
                    range.setStart(textNode, currentCursorPosition);
                    range.setEnd(textNode, currentCursorPosition);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
        };
        SpellCheck.prototype._normalizeTextNodes = function (element) {
            element.normalize();
            return;
        };
        SpellCheck.prototype._filterTextNodes = function (proxy, elem) {
            var filteredTextNodes = [];
            getTextNodes(elem);
            function getTextNodes(element) {
                for (var i = 0; i < element.childNodes.length; i++) {
                    var child = element.childNodes[i];
                    if (child.nodeType === 3) {
                        filteredTextNodes.push(child);
                    }
                    else if (child.childNodes) {
                        getTextNodes(child);
                    }
                }
            }
            return filteredTextNodes;
        };
        SpellCheck.prototype._removeSpan = function (proxy) {
            if (!proxy.model.enableValidateOnType || !proxy._statusMultiTarget) {
                var element = !ej.isNullOrUndefined(proxy.model.controlsToValidate) || proxy._isIframe(proxy.element) ? proxy._activeElement : proxy.element[0];
            }
            else {
                if (proxy._currentActiveElement) {
                    var element = proxy._currentActiveElement;
                }
            }
            var spanElement = $(element).find("span.errorspan");
            for (var i = 0; i < spanElement.length; i++) {
                var spanText = spanElement[i].innerText || spanElement[i].textContent;
                $(spanElement[i]).replaceWith(spanText);
            }
        };
        SpellCheck.prototype._getFilterData = function (result, proxy) {
            var errorWordData = [];
            proxy._errorWordsData = proxy._errorWordDetails = result;
            for (var k = 0; k < proxy.model.ignoreWords.length; k++) {
                proxy._filterData(proxy.model.ignoreWords[k], proxy);
            }
            for (var j = 0; j < proxy._errorWordsData.length; j++) {
                errorWordData.push(proxy._errorWordsData[j].ErrorWord);
            }
            return errorWordData;
        };
        SpellCheck.prototype._filterData = function (filterWord, proxy) {
            var query = new ej.Query().where("ErrorWord", ej.FilterOperators.notEqual, filterWord);
            proxy._errorWordsData = new ej.DataManager(proxy._errorWordsData).executeLocal(query);
        };
        SpellCheck.prototype._formHtml = function (errorWordData, elementText) {
            var word, replaceExpression;
            for (var j = 0; j < errorWordData.length; j++) {
                word = "<span class=\"errorspan\">" + errorWordData[j] + "</span>";
                replaceExpression = new RegExp("\\b" + errorWordData[j] + "\\b", "gi");
                elementText = elementText.replace(replaceExpression, word);
            }
            return elementText;
        };
        SpellCheck.prototype._listBoxDataUpdate = function (proxy) {
            var errorWordElement = proxy._spellCheckWindow.find(".e-sentence .e-sentencecontent").find(".errorspan");
            $(errorWordElement[0]).addClass(this.model.misspellWordCss);
            if (errorWordElement.length > 0) {
                var filterValue = proxy._filterSuggestions(proxy, errorWordElement[0].innerText);
                if (filterValue.length > 0) {
                    proxy._dialogSuggestionsUpdate(proxy, filterValue[0]["SuggestedWords"]);
                }
                else {
                    proxy._suggestionsRequest(proxy, errorWordElement, errorWordElement[0].innerText, "suggestionsUpdate");
                }
            }
            else {
                if (!ej.isNullOrUndefined(this.model.controlsToValidate) && proxy._targetStatus) {
                    proxy._updateTargetText(proxy);
                }
                else {
                    var targetSentence = proxy._spellCheckWindow.find(".e-sentence .e-sentencecontent")[0].innerHTML;
                    proxy._validationComplete(proxy, targetSentence);
                }
            }
        };
        SpellCheck.prototype._filterSuggestions = function (proxy, errorWord) {
            var filterValue = [];
            if (proxy._suggestedWordCollection.length > 0) {
                var query = new ej.Query().where("ErrorWord", ej.FilterOperators.equal, errorWord);
                var data = new ej.DataManager(proxy._suggestedWordCollection).executeLocal(query);
                filterValue = data;
            }
            return filterValue;
        };
        SpellCheck.prototype._validationComplete = function (proxy, targetSentence) {
            proxy._updateTargetString(proxy);
            var element = !ej.isNullOrUndefined(proxy._activeElement) ? proxy._activeElement : proxy.element;
            var updateEvent = { targetElement: element, targetText: targetSentence, requestType: "changeErrorWord" };
            if (this._trigger("complete", updateEvent)) {
                return false;
            }
            proxy._statusFlag = false;
            proxy._alertWindowRender("validating");
        };
        SpellCheck.prototype._onMenuSelect = function (args) {
            var id = args.events.ID.split("_");
            var isIframe = false;
            if (!ej.isNullOrUndefined(this.model.controlsToValidate)) {
                for (var i = 0; i < this._controlIds.length; i++) {
                    var flag_1 = this._isIframe($(this._controlIds[i]));
                    flag_1 && (isIframe = true);
                    isIframe && (this.element = $(this._controlIds[0]));
                }
            }
            else {
                isIframe = this._isIframe(this.element);
            }
            var currentElement = isIframe ? this.element : this._selectedTarget.parentElement;
            this._activeElement = (currentElement);
            var htmlContent = "";
            htmlContent = this._isIframe($(currentElement)) ? $(currentElement).contents().find("body").html() : $(currentElement).html().trim();
            var event = { selectedOption: id[0], requestType: "menuSelect", targetContent: htmlContent, selectedValue: this._selectedValue };
            if (this._trigger("contextClick", event)) {
                return false;
            }
            switch (id[0]) {
                case "AddToDictionary":
                    var addWord = (this._selectedTarget.innerText || this._selectedTarget.textContent).trim();
                    this._currentElement = $(currentElement);
                    this.addToDictionary(addWord);
                    break;
                case "IgnoreAll":
                    var errorWord = (this._selectedTarget.innerText || this._selectedTarget.textContent).trim();
                    var result = this.ignoreAll(errorWord, htmlContent);
                    htmlContent = result["resultHTML"];
                    $(currentElement).html(result["resultHTML"]);
                    if (this._controlIds.length > 0) {
                        for (var i = 0; i < this._controlIds.length; i++) {
                            var element = $(this._controlIds[i]);
                            for (var j = 0; j < element.length; j++) {
                                if ($(currentElement)[0] !== $(element[j])[0]) {
                                    var activeElement = $(element[j]);
                                    this._replaceErrorText(activeElement, errorWord);
                                }
                            }
                        }
                    }
                    this._renderMenu(this);
                    break;
                default:
                    var selectedValue = id[0];
                    var flag = $(args.element).hasClass("e-errorsuggestions");
                    if (flag) {
                        this._selectedTarget.innerHTML = selectedValue;
                        var replaceItem = document.createTextNode(this._selectedTarget.innerText || this._selectedTarget.textContent);
                        this._selectedTarget.parentNode.insertBefore(replaceItem, this._selectedTarget);
                        $(this._selectedTarget).remove();
                        htmlContent = $(currentElement).html();
                    }
                    this._renderMenu(this);
                    break;
            }
        };
        SpellCheck.prototype._renderMenu = function (proxy) {
            var length;
            var element = !ej.isNullOrUndefined(proxy._activeElement) ? proxy._activeElement : proxy.element;
            if (proxy._controlIds.length > 0) {
                for (var i = 0; i < proxy._controlIds.length; i++) {
                    length = proxy._getErrorLength(proxy, $(proxy._controlIds[i]));
                    if (length > 0)
                        break;
                }
            }
            else {
                length = proxy._getErrorLength(proxy, $(proxy.element));
            }
            if (length === 0) {
                var updateEvent = { targetElement: element, requestType: "validate" };
                if (proxy._trigger("complete", updateEvent)) {
                    return false;
                }
            }
            length > 0 ? proxy._statusFlag = true : proxy._statusFlag = false;
            var menuObj = proxy._contextMenu.data("ejMenu");
            $(menuObj.element).is(":visible") && menuObj.hide();
            if (proxy._isIframe($(element))) {
                proxy._bindBeforeOpen(proxy, $(element).contents().find("body"));
            }
            else {
                proxy._bindBeforeOpen(proxy, $(element));
            }
        };
        SpellCheck.prototype._getErrorLength = function (proxy, element) {
            var targetElement = (proxy._isIframe(element)
                ? $(element).contents().find("body")[0]
                : $(element));
            var length = $(targetElement).find(".errorspan").length;
            return length;
        };
        SpellCheck.prototype._getElement = function () {
            var spanTags = document.getElementsByTagName("span");
            var searchText = this._selectedValue;
            var found = [];
            for (var i = 0; i < spanTags.length; i++) {
                if (spanTags[i].textContent === searchText) {
                    found.push(spanTags[i]);
                }
            }
            return found;
        };
        SpellCheck.prototype._alertClose = function () {
            if (!ej.isNullOrUndefined(this._alertWindow) && this._alertWindow.parents().find(".e-alertdialog").length > 0) {
                this._alertWindow.ejDialog("close");
                this._alertWindow.parents().find(".e-alertdialog").remove();
                this._close();
            }
        };
        SpellCheck.prototype._close = function () {
            if (!ej.isNullOrUndefined(this._spellCheckWindow) && this._spellCheckWindow.parents().find(".e-spellcheck.e-dialog-wrap").length > 0) {
                var contentAreaElement = this._spellCheckWindow.find(".e-sentence .e-sentencecontent");
                var spanElement = $(contentAreaElement[0]).find("span.errorspan");
                for (var i = 0; i < spanElement.length; i++) {
                    var spanText = spanElement[i].innerText || spanElement[i].textContent;
                    $(spanElement[i]).replaceWith(spanText);
                }
                this._updateTargetString(this);
                var updatedString = contentAreaElement.html();
                var event;
                if (!ej.isNullOrUndefined(this.model.controlsToValidate))
                    event = { updatedText: updatedString, targetElement: this._currentTargetElement, requestType: "dialogClose" };
                else
                    event = { updatedText: updatedString, requestType: "dialogClose" };
                if (this._trigger("dialogClose", event)) {
                    return false;
                }
                if (this._spellCheckWindow.ejDialog("isOpen"))
                    this._spellCheckWindow.ejDialog("close");
                this._spellCheckWindow.parents().find(".e-spellcheck.e-dialog-wrap").remove();
                this._changeAllWords = [];
                if (!ej.isNullOrUndefined(this.model.controlsToValidate)) {
                    this._controlIds = this.model.controlsToValidate.split(",");
                    this._subElements = [];
                }
            }
        };
        SpellCheck.prototype._changeErrorWord = function (args) {
            var selectedValue = $("#" + this._id + "_Suggestions").ejListBox("option", "value");
            var divElement = this._spellCheckWindow.find(".e-sentence .e-sentencecontent");
            var targetText = this._spellCheckWindow.find(".e-sentence .e-sentencecontent")[0].innerHTML;
            var errorWord = $(this._spellCheckWindow.find(".e-sentence .e-sentencecontent").find("." + this.model.misspellWordCss)[0]).text().trim();
            var result;
            selectedValue = selectedValue === this._localizedLabels.NoSuggestionMessage ? errorWord : selectedValue;
            if (args.model.text === this._localizedLabels.AddToDictionary) {
                this._currentElement = $(divElement);
                this.addToDictionary(errorWord);
            }
            else {
                if (args.model.text === this._localizedLabels.IgnoreOnceButtonText) {
                    result = this.ignore(errorWord, targetText, null);
                    if (result !== false)
                        this._updateErrorWord(this, result, args, errorWord, null, "ignore");
                }
                else if (args.model.text === this._localizedLabels.IgnoreAllButtonText) {
                    result = this.ignoreAll(errorWord, targetText);
                    if (result !== false)
                        this._updateErrorWord(this, result, args, errorWord, null, "ignoreAll");
                }
                else if (args.model.text === this._localizedLabels.ChangeButtonText) {
                    result = this.change(errorWord, targetText, selectedValue, null);
                    if (result !== false)
                        this._updateErrorWord(this, result, args, errorWord, selectedValue, "change");
                }
                else if (args.model.text === this._localizedLabels.ChangeAllButtonText) {
                    result = this.changeAll(errorWord, targetText, selectedValue);
                    if (result !== false)
                        this._updateErrorWord(this, result, args, errorWord, selectedValue, "changeAll");
                }
            }
        };
        SpellCheck.prototype._convertData = function (result, type) {
            var data = [];
            for (var i = 0; i < result.length; i++) {
                if (type === "dictionaryData") {
                    data.push({ field: result[i] });
                }
                else if (type === "menuData") {
                    data.push({ id: result[i], text: result[i] });
                }
            }
            return data;
        };
        SpellCheck.prototype._updateErrorWord = function (proxy, result, event, errorWord, selectedValue, requestType) {
            var listBoxElement = this._spellCheckWindow.find(".e-suggesteditems");
            proxy._spellCheckWindow.find(".e-sentence .e-sentencecontent")[0].innerHTML = result["resultHTML"];
            var errorWordElement = this._spellCheckWindow.find(".e-sentence .e-sentencecontent").find(".errorspan");
            var listObj;
            if (errorWordElement.length > 0) {
                proxy._targetUpdate(proxy, errorWordElement, errorWord, requestType, selectedValue);
            }
            else {
                if (!ej.isNullOrUndefined(this.model.controlsToValidate) && proxy._targetStatus) {
                    proxy._updateTargetText(proxy);
                }
                else {
                    if (!ej.isNullOrUndefined(this.model.controlsToValidate)) {
                        $(this._proElements)
                            .html(proxy._spellCheckWindow.find(".e-sentence .e-sentencecontent")[0].innerHTML);
                    }
                    var noSuggestion = [this._localizedLabels.NoSuggestionMessage];
                    listBoxElement.ejListBox({ selectedItemIndex: null });
                    listBoxElement.ejListBox({
                        dataSource: this._convertData(noSuggestion, "dictionaryData"),
                        selectedItemIndex: 0
                    });
                    listObj = $("#" + this._id + "_Suggestions").data("ejListBox");
                    listObj.refresh();
                    proxy._validationComplete(proxy, result["resultHTML"]);
                }
            }
        };
        SpellCheck.prototype._targetUpdate = function (proxy, errorWordElement, errorWord, requestType, selectedValue) {
            if (requestType === "changeAll") {
                for (var i = 0; i < errorWordElement.length; i++) {
                    var spanText = errorWordElement[i].innerText || errorWordElement[i].textContent;
                    if (spanText === errorWord) {
                        $(errorWordElement[i]).replaceWith(selectedValue);
                    }
                }
            }
            for (var j = 0; j < this.model.ignoreWords.length; j++) {
                for (var k = 0; k < errorWordElement.length; k++) {
                    var elementText = errorWordElement[k].innerText || errorWordElement[k].textContent;
                    if (elementText === proxy.model.ignoreWords[j]) {
                        $(errorWordElement[k]).replaceWith(elementText);
                    }
                }
            }
            proxy._listBoxDataUpdate(proxy);
        };
        SpellCheck.prototype._updateTargetText = function (proxy) {
            proxy._updateTargetString(proxy);
            var updateElement = !ej.isNullOrUndefined(proxy.model.controlsToValidate) ? $(proxy._proElements) : $("#" + proxy._id);
            proxy._proElements = $(proxy._subElements[0]);
            if (proxy._proElements.length > 0 || proxy._subElements.length > 0) {
                var element = $(proxy._subElements[0]);
                proxy._currentTargetElement = element;
                var targetHtml = $(element)[0].tagName === "TEXTAREA" || $(element)[0].tagName === "INPUT" ? $(element)[0].value : $(element)[0].innerHTML;
                var event = { previousElement: updateElement, currentElement: element, targetHtml: targetHtml, requestType: "updateText" };
                if (proxy._trigger("targetUpdating", event)) {
                    proxy._close();
                    return false;
                }
                proxy._spellCheckWindow.find(".e-sentence .e-sentencecontent")[0].innerHTML = targetHtml;
                proxy._subElements = proxy._subElements.slice(1);
                var contentElement = proxy._spellCheckWindow.find(".e-sentence .e-sentencecontent");
                var diffWords = proxy._filteringDiffWords(proxy, contentElement[0].innerText);
                proxy._suggestionsRequest(proxy, contentElement, diffWords.toString(), "validateByDialog");
            }
            else {
                var errorWordElement = proxy._spellCheckWindow.find(".e-sentence .e-sentencecontent").find(".errorspan");
                if (errorWordElement.length === 0 && proxy._subElements.length > 0) {
                    proxy._updateTargetText(proxy);
                }
                else if (errorWordElement.length > 0) {
                    var scrollObj = proxy._spellCheckWindow.find(".e-sentence .e-sentencescroller").data("ejScroller");
                    scrollObj.refresh();
                    proxy._listBoxDataUpdate(proxy);
                }
                else {
                    proxy._completionCheck(proxy);
                }
            }
        };
        SpellCheck.prototype._updateTargetString = function (proxy) {
            var updateElement = !ej.isNullOrUndefined(proxy.model.controlsToValidate) ? $(proxy._proElements) : $("#" + proxy._id);
            if (updateElement.length > 0) {
                var updatedString = proxy._spellCheckWindow.find(".e-sentence .e-sentencecontent")[0].innerHTML;
                if (proxy._isIframe(updateElement)) {
                    updateElement.contents().find("body").html(updatedString);
                }
                else {
                    !ej.isNullOrUndefined((updateElement)[0].value)
                        ? updateElement.val(updatedString)
                        : updateElement.html(updatedString);
                }
            }
        };
        SpellCheck.prototype._completionCheck = function (proxy) {
            proxy._subElements = proxy._subElements.slice(1);
            proxy._subElements.length === 0 && (proxy._targetStatus = false);
            proxy._validationComplete(proxy, "");
        };
        SpellCheck.prototype._changeAllErrors = function (proxy) {
            var spanElement = $(proxy._activeElement).find(".errorspan");
            for (var i = 0; i < spanElement.length; i++) {
                var spanText = spanElement[i].innerText || spanElement[i].textContent;
                for (var i_2 = 0; i_2 < proxy._changeAllWords.length; i_2++) {
                    if (spanText === proxy._changeAllWords[i_2]["ErrorWord"]) {
                        $(spanElement[i_2]).replaceWith(proxy._changeAllWords[i_2]["ReplaceWord"]);
                    }
                }
            }
        };
        SpellCheck.prototype._setModel = function (options) {
            var _this = this;
            for (var prop in options) {
                if (options.hasOwnProperty(prop)) {
                    switch (prop) {
                        case "locale":
                            this.model.locale = options[prop];
                            this._localizedLabels = ej.getLocalizedConstants("ej.SpellCheck", this.model.locale);
                            break;
                        case "misspellWordCss":
                            this.model.misspellWordCss = options[prop];
                            if (this.model.contextMenuSettings.enable) {
                                if (!ej.isNullOrUndefined(this.model.controlsToValidate)) {
                                    for (var i = 0; i < this._controlIds.length; i++) {
                                        this._changeMisspellWordCss(this._controlIds[i]);
                                    }
                                }
                                else {
                                    this._changeMisspellWordCss(this.element[0]);
                                }
                            }
                            break;
                        case "contextMenuSettings":
                            $.extend(this.model.contextMenuSettings, options[prop]);
                            if (this.model.contextMenuSettings.enable) {
                                this.validate();
                                this._renderControls();
                            }
                            else {
                                !ej.isNullOrUndefined(this._contextMenu) && this._contextMenu.parent().remove();
                                this._removeSpan(this);
                            }
                            break;
                        case "ignoreSettings":
                            $.extend(this.model.ignoreSettings, options[prop]);
                            this._ignoreStatus = false;
                            this._statusFlag = true;
                            if (this.model.contextMenuSettings.enable) {
                                this.validate();
                                this._renderControls();
                            }
                            break;
                        case "dictionarySettings":
                            $.extend(this.model.dictionarySettings, options[prop]);
                            break;
                        case "maxSuggestionCount":
                            this.model.maxSuggestionCount = options[prop];
                            break;
                        case "ignoreWords":
                            this.model.ignoreWords = options[prop];
                            if (this.model.contextMenuSettings.enable) {
                                this.validate();
                            }
                            break;
                        case "controlsToValidate":
                            this.model.controlsToValidate = options[prop];
                            if (ej.isNullOrUndefined(this.model.controlsToValidate)) {
                                $(this.element).attr("style", "display:block");
                                for (var i_3 = 0; i_3 < this._controlIds.length; i_3++) {
                                    var element = $(this._controlIds[i_3]);
                                    element.removeClass("e-spellcheck");
                                    element[0].spellcheck = true;
                                    element[0].addEventListener("input", function () { _this._statusFlag = false; }, false);
                                }
                            }
                            this._renderControls();
                            break;
                        case "isResponsive":
                            this.model.isResponsive = options[prop];
                            this._renderControls();
                            break;
                        case "enableValidateOnType":
                            this.model.enableValidateOnType = options[prop];
                            this._renderControls();
                            break;
                    }
                }
            }
        };
        SpellCheck.prototype._changeMisspellWordCss = function (element) {
            var oldMisspellWordCssClass = $(element).find("span.errorspan").attr("class").toString().split(" ")[1];
            $(element).find("span.errorspan").removeClass(oldMisspellWordCssClass).addClass(this.model.misspellWordCss);
        };
        SpellCheck.prototype._getModelValues = function (proxy, targetText, events) {
            var spellModel = {
                ignoreAlphaNumericWords: proxy.model.ignoreSettings.ignoreAlphaNumericWords,
                ignoreEmailAddress: proxy.model.ignoreSettings.ignoreEmailAddress,
                ignoreHtmlTags: proxy.model.ignoreSettings.ignoreHtmlTags,
                ignoreMixedCaseWords: proxy.model.ignoreSettings.ignoreMixedCaseWords,
                ignoreUpperCase: proxy.model.ignoreSettings.ignoreUpperCase,
                ignoreUrl: proxy.model.ignoreSettings.ignoreUrl,
                ignoreFileNames: proxy.model.ignoreSettings.ignoreFileNames
            };
            var value = JSON.stringify({ requestType: "checkWords", model: spellModel, text: targetText, additionalParams: !ej.isNullOrUndefined(events) ? events.additionalParams : null });
            return value;
        };
        SpellCheck.prototype._getLocalizedLabels = function () {
            return ej.getLocalizedConstants(this["sfType"], this.model.locale);
        };
        SpellCheck.prototype._elementRightClick = function (e) {
            if (!ej.isNullOrUndefined(this._contextMenu)) {
                if (!$(e.target).hasClass("e-menulink")) {
                    var menuObj = this._contextMenu.data("ejMenu");
                    if (!ej.isNullOrUndefined(menuObj))
                        $(menuObj.element).is(":visible") && menuObj.hide();
                }
            }
        };
        return SpellCheck;
    }(ej.WidgetBase));
    ej.widget("ejSpellCheck", "ej.SpellCheck", new SpellCheck());
})(jQuery);
ej.SpellCheck.Locale = ej.SpellCheck.Locale || {};
ej.SpellCheck.Locale["default"] = ej.SpellCheck.Locale["en-US"] = {
    SpellCheckButtonText: "Spelling:",
    NotInDictionary: "Not in Dictionary:",
    SuggestionLabel: "Suggestions:",
    IgnoreOnceButtonText: "Ignore Once",
    IgnoreAllButtonText: "Ignore All",
    AddToDictionary: "Add to Dictionary",
    ChangeButtonText: "Change",
    ChangeAllButtonText: "Change All",
    CloseButtonText: "Close",
    CompletionPopupMessage: "Spell check is complete",
    CompletionPopupTitle: "Spell check",
    Ok: "OK",
    NoSuggestionMessage: "No suggestions available",
    NotValidElement: "Specify the valid control id or class name to spell check"
};
