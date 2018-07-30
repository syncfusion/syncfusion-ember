"use strict";
var documentManager;
(function (documentManager) {
    var editorManager = (function () {
        function editorManager(target, win) {
            this.formatInfo = new formateDataCollection();
            this._nodeCollection = [];
            this._iterationStatus = false;
            this.filterNode = ["div", "p", "h1", "h2", "h3", "h4", "h5", "h6", "address", "applet", "blockquote", "button", "center", "dd", "dir", "dl", "dt", "fieldset", "form", "frameset", "hr", "iframe", "isindex", "li", "map", "menu", "noframes", "noscript", "object", "ol", "pre", "script", "table", "tbody", "td", "tfoot", "th", "thead", "tr", "ul", "header", "article", "nav", "footer", "section", "aside", "main", "figure", "figcaption"];
            this.advanceFilterNode = ["img", "video", "table", "tbody", "tr", "td", "th"];
            this.indentFilter = ["img", "video"];
            this._junkSpanNodes = [];
            this.currentDocument = target;
            this.currentWindow = win;
            this._rangeExtract = new RangeExtractor(this.currentDocument);
            this._bindEvent();
        }
        editorManager.prototype._bindEvent = function () {
            $(this.currentDocument.body).on("keydown", $.proxy(this._editorKeyUpEvent, this));
        };
        editorManager.prototype._editorKeyUpEvent = function (e) {
            if (this._junkContentStatus) {
                var range = this._getRangy(this.currentWindow, this.currentDocument), rangeContainer = range.startContainer, rangeOffset = range.startOffset;
                if (!e.shiftKey && (e.which >= 37 && e.which <= 40) && (rangeContainer.nodeType == 3)) {
                    this._junkContentStatus = false;
                    this._iterateCompleteNode(rangeContainer, e, rangeOffset);
                }
            }
        };
        editorManager.prototype._iterateCompleteNode = function (element, e, range) {
            var oldlen = element.data.length;
            this._junkSpanNodes = [];
            this._removeJunkContent(this.currentDocument.body);
            this._collectJunkSpanNodes(this.currentDocument.body);
            this._removeJunkSpanNodes();
            (oldlen > element.data.length) && range--;
            !element.data && $(element).remove();
            if (element.data.trim()) {
                this._updateCursor(element, range);
            }
        };
        editorManager.prototype._collectJunkSpanNodes = function (stNode) {
            var startNode = stNode;
            if ($(startNode).is("span") && !$(startNode).attr("style"))
                this._junkSpanNodes.push(startNode);
            if (startNode = startNode.firstChild)
                do {
                    if ($(startNode).is("span") && !$(startNode).attr("style"))
                        this._junkSpanNodes.push(startNode);
                    this._collectJunkSpanNodes(startNode);
                } while (startNode = startNode.nextSibling);
        };
        editorManager.prototype._removeJunkSpanNodes = function () {
            var temp;
            while (temp = this._junkSpanNodes.shift()) {
                if (temp.childNodes.length)
                    $(temp).replaceWith(temp.childNodes);
                else
                    $(temp).remove();
            }
        };
        editorManager.prototype._removeJunkContent = function (startNode) {
            var temp = startNode;
            if (temp.nodeType == 3)
                this._removeCursorText(temp);
            if (temp = temp.firstChild)
                do {
                    if (temp.nodeType == 3)
                        this._removeCursorText(temp);
                    else
                        this._removeJunkContent(temp);
                } while (temp = temp.nextSibling);
        };
        editorManager.prototype._removeCursorText = function (element) {
            element.data = element.data.replace(String.fromCharCode(65279), "");
        };
        editorManager.prototype.focus = function () {
            var objExec = this;
            setTimeout(function () {
                var browserInfo = ej.browserInfo();
                if (browserInfo.name == "webkit")
                    objExec.currentWindow.focus();
                else
                    objExec.currentWindow.document.body.focus();
            }, 100);
        };
        editorManager.prototype._justifyContent = function (Value) {
            this._backUpRange(this.currentDocument, this.currentWindow);
            this._getModifedRange(this._getRangy(this.currentWindow, this.currentDocument));
            this._onApplyjustify(Value, this.currentDocument, this.currentWindow);
            this._resetRange(this.currentDocument, this.currentWindow);
        };
        editorManager.prototype._applyFormateBlock = function (Value) {
            var range = this._getRangy(this.currentWindow, this.currentDocument);
            this._backUpRange(this.currentDocument, this.currentWindow);
            this._applyChanges(Value, this.currentDocument, this.currentWindow);
            this._resetRange(this.currentDocument, this.currentWindow);
            this._selectionRange = this._getRangy(this.currentWindow, this.currentDocument);
        };
        editorManager.prototype._applyList = function (value, listType) {
            this._backUpRange(this.currentDocument, this.currentWindow);
            this._getModifedRange(this._getRangy(this.currentWindow, this.currentDocument));
            this._applyOrderedList(value.toLowerCase() == "orderlist" ? "ol" : "ul", this.currentDocument, this.currentWindow, listType);
            this._resetRange(this.currentDocument, this.currentWindow);
        };
        editorManager.prototype._applyIndent = function (value) {
            this._backUpRange(this.currentDocument, this.currentWindow);
            this._getModifedRange(this._getRangy(this.currentWindow, this.currentDocument));
            if (value)
                this._onApplyIndent(this.currentDocument, this.currentWindow);
            else
                this._onApplyDecreaseIndent(this.currentDocument, this.currentWindow);
            this._resetRange(this.currentDocument, this.currentWindow);
        };
        editorManager.prototype._getRangy = function (_window, _document) {
            if (_window.getSelection() && _window.getSelection().rangeCount > 0)
                return _window.getSelection().getRangeAt(0);
            else {
                var range;
                try {
                    range = _window.document.createRange();
                    range.setStart(_window.document.body, 0);
                    range.setEnd(_window.document.body, 0);
                }
                catch (error) {
                    range = _document.createRange();
                    range.setStart(_document.body, 0);
                    range.setEnd(_document.body, 0);
                }
                return range;
            }
        };
        editorManager.prototype._getexactSelectedNode = function (range, parentDoc) {
            var nodeDetails = [];
            var _parentNode = [];
            this._parentDoc = parentDoc;
            var startNode = $(this._parentDoc.body).find("span#startRange");
            var that = this;
            function visit(node) {
                if (node.nodeType == 3 && (($.trim(node.nodeValue) != "" || node.nodeValue == "\ufeff") || ($.trim(node.nodeValue) == "" && node.nextSibling == startNode[0]))) {
                    nodeDetails.push(node);
                }
                else if (node.nodeValue && node.nodeName != "#comment" && node.nodeValue.trim() == "" && that.range.endContainer.parentNode.nextSibling != that._next) {
                    if ($.inArray(node.previousElementSibling, _parentNode) < 0)
                        _parentNode.push(node.previousElementSibling);
                }
                else if ((node.nodeName.toLowerCase() == "br" || ($.inArray(node.nodeName.toLowerCase(), that.filterNode) < 0)) && ($.inArray(node.parentNode, nodeDetails) < 0) && node.nodeName.toLowerCase() != "body" && $.inArray(node.nodeName.toLowerCase(), that.advanceFilterNode) < 0 && ((!ej.isNullOrUndefined(nodeDetails[nodeDetails.length - 1])) && nodeDetails[nodeDetails.length - 1].parentNode != node.parentNode) && node.previousSibling && node.previousSibling.parentNode != node.parentNode)
                    nodeDetails.push(node.parentNode);
                else if (($.inArray(node.nodeName.toLowerCase(), that.advanceFilterNode) >= 0) && ej.isNullOrUndefined(node.firstChild))
                    nodeDetails.push(node);
                else {
                    node = node.firstChild;
                    while (node) {
                        visit(node);
                        node = node.nextSibling;
                    }
                }
            }
            this._generateRange(range);
            this._traverse(visit);
            return nodeDetails;
        };
        editorManager.prototype._getStartEndElement = function (tnode, root) {
            if (this._isAncestor(root, tnode)) {
                while (tnode && tnode.parentNode != root) {
                    tnode = tnode.parentNode;
                }
            }
            return tnode;
        };
        editorManager.prototype._generateRange = function (range) {
            var root = range.commonAncestorContainer;
            this._next = range.startContainer == root && !this._isTextNode(range.startContainer) ? range.startContainer.childNodes[range.startOffset] : this._getStartEndElement(range.startContainer, root);
            this._end = range.endContainer == root && !this._isTextNode(range.endContainer) ? range.endContainer.childNodes[range.endOffset] : (this._getStartEndElement(range.endContainer, root).nodeName.toLowerCase() != "body") && this._getStartEndElement(range.endContainer, root).nextSibling;
        };
        editorManager.prototype._traverse = function (callback) {
            var that = this, current;
            function next() {
                if (that._next != ((that._isTextNode(that.range.endContainer) ? that.range.endContainer.parentNode.nextSibling : that.range.endContainer.nextElementSibling)) && that.range.endContainer.parentNode.nextSibling != that._next) {
                    that._current = that._next;
                    that._next = that._current && that._current.nextSibling != $(that._parentDoc.body).find("span#endRange")[0] && that._current.nextSibling != (ej.isNullOrUndefined(that._end) ? that.range.endContainer.nextSibling : that._end) ? that._current.nextSibling : null;
                    return that._current;
                }
                else {
                    return null;
                }
            }
            while (current = next()) {
                if (that._hasSubNodes()) {
                    that._getSubtree(that._getRangy(that.currentWindow, that.currentDocument));
                    that._traverse(callback);
                }
                else {
                    var _nextNode = current;
                    if (that.range.startContainer.nodeName.toLowerCase() != "body") {
                        if (that._next == null && _nextNode != (that.range.endContainer)) {
                            while (ej.isNullOrUndefined(that._next) && !ej.isNullOrUndefined(_nextNode)) {
                                _nextNode = _nextNode.parentNode;
                                if ((!ej.isNullOrUndefined(_nextNode)) && that._current.nextSibling != $(that._parentDoc.body).find("span#endRange")[0])
                                    that._next = _nextNode.nextSibling;
                            }
                        }
                    }
                    callback(current);
                }
            }
            return current;
        };
        editorManager.prototype._hasSubNodes = function () {
            return !this._isTextNode(this._current) && (this._isAncestorItself(this._current, this.range.startContainer) ||
                this._isAncestorItself(this._current, this.range.endContainer));
        };
        editorManager.prototype._isTextNode = function (node) {
            return node && node.nodeValue !== null && node.data !== null;
        };
        editorManager.prototype._isAncestor = function (parent, node) {
            try {
                return !this._isTextNode(parent) && ($.contains(parent, (this._isTextNode(node) ? node.parentNode : node)) || node.parentNode == parent);
            }
            catch (e) {
                return false;
            }
        };
        editorManager.prototype._isAncestorItself = function (root, node) {
            return this._isAncestor(root, node) || root == node;
        };
        editorManager.prototype._getSubtree = function (range) {
            var that = this;
            var subRange = that.range.cloneRange();
            subRange.selectNodeContents(that._current);
            if (that._isAncestorItself(that._current, that.range.startContainer)) {
                subRange.setStart(that.range.startContainer, that.range.startOffset);
            }
            if (that._isAncestorItself(that._current, that.range.endContainer)) {
                subRange.setEnd(that.range.endContainer, that.range.endOffset);
            }
            return this._generateRange(subRange);
        };
        editorManager.prototype._getModifedRange = function (range) {
            if (range.endOffset == 0 && range.startContainer != range.endContainer) {
                var ele = range.endContainer;
                do {
                    ele = ej.isNullOrUndefined(range.endContainer.previousSibling) ? ele.parentNode : ele;
                } while (ej.isNullOrUndefined(ele.previousSibling));
                if (this._isTextNode(ele.previousSibling) && $.trim(ele.previousSibling.textContent).length != 0)
                    range.setEnd(ele.previousSibling, ele.previousSibling.childNodes.length);
                else {
                    range.setEnd(ele.previousSibling, ele.previousSibling.childNodes.length);
                }
            }
        };
        editorManager.prototype._getSelectedParent = function (selNode1) {
            var _parentNode = [], selNode = selNode1;
            for (var i = 0; i < selNode.length; i++) {
                if (this._isTextNode(selNode[i])) {
                    while (selNode[i] && selNode[i].parentNode && selNode[i].parentNode.nodeName.toLowerCase() != "body" && ($.inArray(selNode[i].parentNode.nodeName.toLowerCase(), this.filterNode)) < 0) {
                        selNode[i] = selNode[i].parentNode;
                    }
                    if (selNode[i].parentNode.nodeName.toLowerCase() == "body")
                        _parentNode.push(this._updateParent(selNode[i]));
                }
                if (selNode[i] && selNode[i].parentNode && selNode[i].parentNode.nodeName.toLowerCase() != "body" && $.inArray(selNode[i].parentNode, _parentNode) < 0) {
                    if (selNode[i].parentNode.nodeName.toLowerCase() != "body" && selNode[i].nodeName.toLowerCase() != "img" && selNode[i].nodeName.toLowerCase() != "video")
                        _parentNode.push(selNode[i].parentNode);
                    else
                        _parentNode.push(selNode[i]);
                }
            }
            return _parentNode;
        };
        editorManager.prototype._updateParent = function (node) {
            var nodeColl = [node], temp = node, leftBlockNode, rightBlockNode, tempDiv = document.createElement("div");
            ;
            while (temp = temp.previousSibling) {
                if ($.inArray(temp.nodeName.toLowerCase(), this.filterNode) != -1) {
                    leftBlockNode = temp;
                    break;
                }
                else
                    nodeColl.push(temp);
            }
            nodeColl = nodeColl.reverse();
            temp = node;
            while (temp = temp.nextSibling) {
                if ($.inArray(temp.nodeName.toLowerCase(), this.filterNode) != -1) {
                    rightBlockNode = temp;
                    break;
                }
                else
                    nodeColl.push(temp);
            }
            $(nodeColl).appendTo(tempDiv);
            if (leftBlockNode)
                $(tempDiv).insertAfter(leftBlockNode);
            else if (rightBlockNode)
                $(tempDiv).insertBefore(rightBlockNode);
            else
                $(tempDiv).appendTo(this.currentDocument.body);
            return tempDiv;
        };
        editorManager.prototype._applyChanges = function (formatBlock, parentDoc, _window) {
            this.range = this._getRangy(_window, parentDoc);
            var selNode1 = this._getexactSelectedNode(this.range, parentDoc);
            var selNode = selNode1.slice();
            var tag = (document.createElement(formatBlock.substring(formatBlock.indexOf("<") + 1, formatBlock.indexOf(">"))));
            if (selNode.length == 0 && this.range.startContainer.nodeName.toLowerCase() == "body" && this.range.endContainer.nodeName.toLowerCase() == "body" && this.range.commonAncestorContainer.nodeName.toLowerCase() == "body" && this._parentDoc.body.innerHTML == "") {
                this.focus();
                tag.innerHTML = "&nbsp;";
                this._parentDoc.body.innerHTML = tag.outerHTML;
            }
            else {
                var exatSelNode = this._getSelectedParent(selNode);
                var nodeArray = [];
                nodeArray.push(selNode[0]);
                var _prevParent = this._getSelectedParent(nodeArray)[0];
                var _childNode = [];
                var tval = 0;
                var condi = false;
                var _tdiv = document.createElement("div");
                var dummyNode = document.createElement("div");
                var _newparent = this._getSelectedParent(nodeArray)[0];
                var _prevParntNode, selVal, tnode, _isListNode, _tobj, _liNode, _liPrevious;
                for (selVal = 0; selVal < exatSelNode.length; selVal++) {
                    nodeArray = [];
                    nodeArray.push(exatSelNode[selVal]);
                    _prevParent = this._getSelectedParent(nodeArray)[0];
                    if ($(exatSelNode[selVal]).attr("style"))
                        $(tag).attr("style", $(exatSelNode[selVal]).attr("style"));
                    if ($.inArray(_prevParent, _childNode) >= 0) {
                        var node;
                    }
                    else {
                        _childNode.push(_prevParent);
                        if (tag.innerHTML.length != 0) {
                            if (_childNode[tval].nodeName.toLowerCase() != "td" && _childNode[tval].nodeName.toLowerCase() != "tr" && _childNode[tval].nodeName.toLowerCase() != "tbody" && _childNode[tval].nodeName.toLowerCase() != "li" && _childNode[tval].nodeName.toLowerCase() != "body") {
                                $(_childNode[tval]).replaceWith(tag.outerHTML);
                            }
                            else if (_childNode[tval].nodeName.toLowerCase() != "tr" && _childNode[tval].nodeName.toLowerCase() != "tbody") {
                                $(_childNode[tval]).prepend("<div></div>");
                                _tdiv.innerHTML = tag.outerHTML;
                                _childNode[tval].replaceChild(_tdiv.firstChild, _childNode[tval].firstChild);
                            }
                            tval++;
                        }
                        tag.innerHTML = "";
                        _tdiv.innerHTML = "";
                    }
                    tnode = exatSelNode[selVal];
                    _tobj = false;
                    if (!ej.isNullOrUndefined(tnode.parentNode)) {
                        _isListNode = tnode.nodeName.toLowerCase() == "li";
                    }
                    if (!ej.isNullOrUndefined(tnode)) {
                        _liNode = tnode;
                        while (_liNode.childNodes.length != 0) {
                            if ($.inArray(tnode.firstChild.nodeName.toLowerCase(), this.filterNode) < 0) {
                                while (tnode.firstChild && $.inArray(tnode.firstChild.nodeName.toLowerCase(), this.filterNode) < 0) {
                                    $(tag).append(_liNode.childNodes[0]);
                                }
                            }
                            else {
                                break;
                            }
                        }
                        _liPrevious = tnode.previousSibling;
                    }
                    _prevParntNode = tnode.parentNode;
                    if (tag.innerHTML.length != 0) {
                        if (tnode.nodeName.toLowerCase() != "td" && tnode.nodeName.toLowerCase() != "tr" && tnode.nodeName.toLowerCase() != "tbody" && tnode.nodeName.toLowerCase() != "li" && tnode.nodeName.toLowerCase() != "body") {
                            $(tnode).replaceWith(tag.outerHTML);
                        }
                        else if (tnode.nodeName.toLowerCase() != "tr" && tnode.nodeName.toLowerCase() != "tbody") {
                            $(tnode).prepend("<div></div>");
                            _tdiv.innerHTML = tag.outerHTML;
                            tnode.replaceChild(_tdiv.firstChild, tnode.firstChild);
                        }
                        tval++;
                    }
                    tag.innerHTML = "";
                    _tdiv.innerHTML = "";
                    $(tag).removeAttr("style");
                }
            }
        };
        editorManager.prototype._validateIndent = function (element) {
            var _indentStatus = false;
            do {
                if ($(element).attr("style") && (parseInt($(element).css("margin-left")) > 0)) {
                    _indentStatus = true;
                }
            } while ((element = element.parentNode) && !$(element).is("body"));
            return _indentStatus;
        };
        editorManager.prototype._validateFontSize = function (element) {
            var size = parseInt($(((element.nodeType == 3) ? element.parentNode : element)).css("font-size"));
            return (Math.round(size * (3 / 4))) + "pt";
        };
        editorManager.prototype._onApplyIndent = function (parentDoc, _window) {
            this.range = this._getRangy(_window, parentDoc);
            var selNode1 = this._getexactSelectedNode(this.range, parentDoc), temp;
            var selNode = selNode1.slice();
            var exatSelNode = this._getSelectedParent(selNode);
            if (selNode.length == 0 && this.range.startContainer.nodeName.toLowerCase() == "body" && this.range.endContainer.nodeName.toLowerCase() == "body" && this.range.commonAncestorContainer.nodeName.toLowerCase() == "body" && this._parentDoc.body.innerHTML == "") {
            }
            else {
                for (var node = 0; node <= exatSelNode.length - 1; node++) {
                    if (exatSelNode[node].nodeName.toLowerCase() == "td") {
                        $(exatSelNode[node]).append($(temp = (document.createElement("p"))).append(exatSelNode[node].childNodes));
                        exatSelNode[node] = temp;
                    }
                    if (exatSelNode[node].nodeName.toLowerCase() != "li")
                        $(exatSelNode[node]).css("margin-left", 40 + parseInt($(exatSelNode[node]).css("margin-left")) + "px");
                    else {
                        if ($(exatSelNode[node]).prev().length == 0)
                            $(exatSelNode[node].parentNode).css("margin-left", parseInt($(exatSelNode[node].parentNode).css("margin-left")) + 40 + "px");
                        else
                            $(exatSelNode[node]).css("margin-left", parseInt($(exatSelNode[node]).css("margin-left")) + 40 + "px");
                    }
                }
            }
        };
        editorManager.prototype._onApplyDecreaseIndent = function (parentDoc, _window) {
            this.range = this._getRangy(_window, parentDoc);
            var selNode1 = this._getexactSelectedNode(this.range, parentDoc);
            var selNode = selNode1.slice();
            var exatSelNode = this._getSelectedParent(selNode);
            for (var node = 0; node <= exatSelNode.length - 1; node++) {
                if (parseInt($(exatSelNode[node]).css("margin-left")) >= 40 && exatSelNode[node].nodeName.toLowerCase() != "li")
                    $(exatSelNode[node]).css("margin-left", parseInt($(exatSelNode[node]).css("margin-left")) - 40);
                else {
                    if ($(exatSelNode[node]).prev().length == 0 && parseInt($(exatSelNode[node].parentNode).css("margin-left")) >= 40)
                        $(exatSelNode[node].parentNode).css("margin-left", parseInt($(exatSelNode[node].parentNode).css("margin-left")) - 40);
                    else if (parseInt($(exatSelNode[node]).css("margin-left")) >= 40)
                        $(exatSelNode[node]).css("margin-left", parseInt($(exatSelNode[node]).css("margin-left")) - 40);
                }
            }
        };
        editorManager.prototype._getNodeName = function (node) {
            if (this._isTextNode(node))
                return "#text";
            else
                return node.nodeName.toLowerCase();
        };
        editorManager.prototype._onApplyjustify = function (justify, parentDoc, _window) {
            this.range = this._getRangy(_window, parentDoc);
            var selNode = this._getexactSelectedNode(this.range, parentDoc);
            var _exactparentEle = this._getSelectedParent(selNode);
            for (var a = 0; a < _exactparentEle.length; a++) {
                var node = document.createElement("div");
                if (_exactparentEle[a].nodeName.toLowerCase() == "li") {
                    var _tnode = $(_exactparentEle[a]).children(), _val = 0;
                    for (var b = 0; b < _tnode.length; b++) {
                        if ($.inArray(this._getNodeName(_tnode[b]), this.filterNode) > 0)
                            _val++;
                    }
                    if (_val > 0) {
                        while (_exactparentEle[a].childNodes.length > 0) {
                            if (this._isTextNode(_exactparentEle[a].childNodes[0]) || $.inArray(this._getNodeName(_exactparentEle[a].childNodes[0]), this.filterNode) < 0)
                                node.appendChild(_exactparentEle[a].childNodes[0]);
                            else
                                break;
                        }
                    }
                    else
                        $(_exactparentEle[a]).css("text-align", justify);
                    if (node.childNodes.length > 0) {
                        $(node).css("text-align", justify);
                        _exactparentEle[a].insertBefore(node, _exactparentEle[a].childNodes[0]);
                        _val = 0;
                    }
                }
                else {
                    $(_exactparentEle[a]).css("text-align", justify);
                }
            }
        };
        editorManager.prototype._getParentNodeCollection = function (selNode) {
            var _backUpSelNode = selNode;
            var _backUpSelNodeName = _backUpSelNode.parentNode.nodeName.toLowerCase();
            var _nodeDetails = [];
            _nodeDetails.push(_backUpSelNode);
            while (_backUpSelNodeName != "body" && (_backUpSelNodeName == "li" || _backUpSelNodeName == "ol" || _backUpSelNodeName == "ul")) {
                _backUpSelNode = _backUpSelNode.parentNode;
                _backUpSelNodeName = _backUpSelNode.parentNode.nodeName.toLowerCase();
                _nodeDetails.push(_backUpSelNode);
            }
            return _nodeDetails;
        };
        editorManager.prototype._generateListParentTag = function (list, selNode, listType) {
            var tag = document.createElement(list);
            $(tag).css("list-style-type", listType);
            if (selNode.nodeName.toLowerCase() != "li")
                $(tag).insertBefore(selNode);
            else
                $(tag).insertBefore(selNode.parentNode);
            return tag;
        };
        editorManager.prototype._applyOrderedList = function (list, parentDoc, _window, listType) {
            this.range = this._getRangy(_window, parentDoc);
            var nodeArray = this._getexactSelectedNode(this.range, parentDoc);
            var beforeNode = document.createElement(list);
            var afterNode = document.createElement(list);
            var _childNode = new Array();
            var selNode = this._getSelectedParent(nodeArray);
            var _parentNode = this._getParentNodeCollection(selNode[0]);
            var _startNode = document.createElement("p");
            var replaceEle = new Array();
            var removeParent, topMostParent, innerTag, tag, elemN, _node, node, _exactParentEle = _parentNode[_parentNode.length - 1];
            if (listType != "none") {
                tag = this._generateListParentTag(list, selNode[0], listType);
            }
            for (var i = 0; i <= selNode.length - 1; i++) {
                innerTag = document.createElement("li");
                if (selNode[i].parentNode.nodeName.toLowerCase() == "li")
                    selNode[i] = selNode[i].parentNode;
                if (listType == "none") {
                    if ($(selNode[i]).closest("ul,ol").length < 1)
                        continue;
                    if ($(selNode[i]).find("ol").length != 0 || $(selNode[i]).find("ul").length != 0) {
                        removeParent = $(selNode[i]).parents(list).first();
                        var _exactLi = removeParent.parents("li:last");
                        var _prevNode = removeParent.parents("li:last").prevAll();
                        var _nexNode = removeParent.parents("li:last").nextAll();
                        node = $(selNode[i]).parents("li:last")[0];
                    }
                    else {
                        removeParent = $(selNode[i]);
                        var _exactLi = removeParent;
                        var _prevNode = removeParent.prevAll();
                        var _nexNode = removeParent.nextAll();
                        node = $(selNode[i])[0];
                    }
                    topMostParent = $(selNode[i]).parents(list).last();
                    var _selectionComplete = 0;
                    if (_prevNode.length != 0) {
                        $(afterNode).append(_exactLi);
                        $(afterNode).append(_nexNode);
                        $(afterNode).insertAfter(topMostParent);
                    }
                    var ele = document.createElement("p"), elem = elemN = document.createElement("li");
                    beforeNode.appendChild(elem);
                    var backupFirstNode = topMostParent, _removeSibling = new Array(), _inc = false, newNode;
                    while (node) {
                        if ($.inArray(node, selNode) >= 0 || $.inArray(node.firstChild, selNode) >= 0 || $.inArray(node.firstChild, nodeArray) >= 0) {
                            if (_selectionComplete == 0 && elem.firstChild && elem.firstChild.innerHTML != "") {
                                topMostParent.append(elem);
                                elem = elemN = document.createElement("li");
                            }
                            newNode = document.createElement("p");
                            while (node.firstChild && $.inArray(node.firstChild.nodeName.toLowerCase(), this.filterNode) < 0) {
                                newNode.appendChild(node.firstChild);
                                _inc = true;
                            }
                            if (_inc) {
                                _selectionComplete++;
                                $(newNode).insertAfter(backupFirstNode);
                                backupFirstNode = $(newNode);
                                if ($(node).children().length == 0) {
                                    _removeSibling.push(node);
                                }
                            }
                            if (_selectionComplete == selNode.length) {
                                var _nextEle = document.createElement(list);
                                if ($(node).children().length != 0)
                                    $(_nextEle).append($(node).parents("li:last").nextAll());
                                else
                                    $(_nextEle).append($(node).nextAll());
                                if (node.nodeName.toLowerCase() == "ol" || node.nodeName.toLowerCase() == "ul")
                                    $(node).insertAfter(backupFirstNode);
                                else if (node.nodeName.toLowerCase() == "li") {
                                    var _tnewNode = document.createElement(list);
                                    $(_tnewNode).append(node);
                                    $(_tnewNode).insertAfter(backupFirstNode);
                                    node = _tnewNode;
                                }
                                $(_nextEle).insertAfter(node);
                                for (var _remove = 0; _remove < _removeSibling.length; _remove++) {
                                    var _removeNodeparent;
                                    _node = _removeSibling[_remove];
                                    while (_node.nodeName.toLowerCase() != "body") {
                                        _removeNodeparent = _node.parentNode;
                                        $(_node).remove();
                                        _node = _removeNodeparent;
                                    }
                                }
                                i = selNode.length;
                                break;
                            }
                        }
                        if (this._isTextNode(node.firstChild) || (node.firstChild && $.inArray(node.firstChild.nodeName.toLowerCase(), this.filterNode) < 0)) {
                            elemN.appendChild(node.firstChild);
                            if (ej.isNullOrUndefined(node.firstChild)) {
                                node = node.nextSibling;
                            }
                        }
                        else if (this._isTextNode(node)) {
                            var _tflag = 0;
                            var appendElement = node;
                            node = node.nextSibling;
                            if (ej.isNullOrUndefined(node)) {
                                node = appendElement;
                                while ($(node.parentNode).next().length == 0) {
                                    node = node.parentNode;
                                    _tflag++;
                                }
                                if (_tflag > 0) {
                                    node = $(node.parentNode).next()[0];
                                }
                            }
                            elemN.appendChild(appendElement);
                            if (_tflag == 0 && !this._isTextNode(node))
                                elemN = this._createElement(node.nodeName.toLowerCase(), elemN.parentNode, null);
                            else
                                elemN = this._createElement(node.nodeName.toLowerCase(), this._getParentnodeName(_tflag, elemN), "after");
                            _tflag = 0;
                        }
                        else {
                            if (node.firstChild) {
                                elemN = this._createElement(node.firstChild.nodeName.toLowerCase(), elemN, null);
                                node = node.firstChild;
                            }
                            else
                                node = node.nextSibling;
                        }
                    }
                }
                else if (selNode[i].nodeName.toLowerCase() != "li") {
                    if ($(selNode[i]).is("h1,h2,h3,h4,h5,h6,p,blockquote")) {
                        $(innerTag).append(selNode[i]);
                        tag.appendChild(innerTag);
                    }
                    else {
                        if ($(selNode[i]).attr("style"))
                            $(innerTag).attr("style", $(selNode[i]).attr("style"));
                        $(innerTag).append(selNode[i].childNodes);
                        tag.appendChild(innerTag);
                        $(selNode[i]).remove();
                    }
                }
                else if (selNode[i] = $(selNode[i]).closest("li")) {
                    tag = document.createElement(list);
                    $(tag).css("list-style-type", listType);
                    $(tag).append(selNode[i].parentNode.childNodes);
                    $(selNode[i].parentNode).replaceWith(tag);
                }
            }
            if (listType != "none" && _exactParentEle.childNodes.length == 0 && (_exactParentEle.nodeName.toLowerCase() == "ol" || _exactParentEle.nodeName.toLowerCase() == "ul"))
                $(_exactParentEle).remove();
        };
        editorManager.prototype._getParentnodeName = function (_tflag, elemN) {
            var node = elemN;
            for (var a = 0; a <= _tflag; a++) {
                node = node.parentNode;
            }
            return node;
        };
        editorManager.prototype._createElement = function (element, elem, place) {
            var newEle = document.createElement(element);
            if (place != "after")
                elem.appendChild(newEle);
            else
                $(newEle).insertAfter(elem);
            return newEle;
        };
        editorManager.prototype._backUpRange = function (_parentDoc, _window) {
            var nodeStart = _parentDoc.createElement("span");
            nodeStart.id = "startRange";
            var nodeEnd = _parentDoc.createElement("span");
            nodeEnd.id = "endRange";
            var rng = this._getRangy(_window, _parentDoc).cloneRange();
            rng.collapse(false);
            rng.insertNode(nodeEnd);
            rng = this._getRangy(_window, _parentDoc).cloneRange();
            rng.collapse(true);
            rng.insertNode(nodeStart);
        };
        editorManager.prototype._resetRange = function (_parentDoc, _window) {
            var a = $(_parentDoc.body).find("span#startRange");
            var b = $(_parentDoc.body).find("span#endRange");
            var len = ej.isNullOrUndefined(b[0].previousSibling) ? 0 : this._isTextNode(b[0].previousSibling) ? b[0].previousSibling.length : b[0].previousSibling.childNodes.length > 0 ? b[0].previousSibling.childNodes.length : 0;
            var rng = this._getRangy(_window, _parentDoc);
            if (a[0].nextSibling != b[0])
                rng.setStart(a[0].nextSibling, 0);
            else
                rng.setStart(a[0].nextSibling.nextSibling, 0);
            if (b[0].previousSibling != a[0])
                ej.isNullOrUndefined(b[0].previousSibling) ? rng.setEnd(b[0].parentNode, len) : rng.setEnd(b[0].previousSibling, len);
            else
                rng.setEnd(b[0].nextSibling, 0);
            a.remove();
            b.remove();
            this._selectRange(rng, _parentDoc);
        };
        editorManager.prototype._selectRange = function (range, _parentDoc) {
            var select = _parentDoc.getSelection();
            select.removeAllRanges();
            select.addRange(range);
        };
        editorManager.prototype._validateFormatData = function (target, data) {
            var nodeData = [], element = target.parentNode, childNode = target, nodeOrder = [], _tagResult, _cssResult;
            if (element)
                do {
                    nodeOrder.push(childNode);
                    if ((_tagResult = this._tagCheck(element, data)) || (_cssResult = this._styleCheck(element, data)))
                        nodeData.push(new ValidatedData(element, target, _tagResult, _cssResult));
                } while (!$(element).is("body") && (childNode = element) && (element = element.parentNode));
            return nodeData;
        };
        editorManager.prototype._tagCheck = function (element, data) {
            return this.formatInfo.getFormatData(data).Value.tag ? $(element).is(this.formatInfo.getFormatData(data).Value.tag) : false;
        };
        editorManager.prototype._styleCheck = function (element, data) {
            var tempArrayData;
            if (!$(element).is(this.formatInfo.filterNode) && this.formatInfo.getFormatData(data).Value.css && (element.getAttribute("style"))) {
                var valStatus = true;
                tempArrayData = this.formatInfo.getFormatData(data).Value.css.split(";");
                $(tempArrayData).each(function (index, styledata) {
                    styledata && (element.getAttribute("style").replace(/\s/g, "").indexOf(styledata) == -1) && (valStatus = false);
                    if (!valStatus && ((styledata === 'font-weight:bold' && element.style.fontWeight == "bold") || (styledata === 'font-style:italic' && element.style.fontStyle == "italic"))) {
                        valStatus = true;
                    }
                });
                return valStatus;
            }
            return false;
        };
        editorManager.prototype._validateFormat = function (element, format) {
            var data = [], collection = { Info: null, status: null }, status;
            format = format.toLowerCase();
            if ($.inArray(format, this.formatInfo.actionList) != -1) {
                if ((data = this._validateFormatData(element, format)) && data.length)
                    collection.Info = data;
                collection.status = (data.length > 0);
            }
            return collection;
        };
        editorManager.prototype._CurrentformateStatus = function (selectedNode, format) {
            var data = { Info: null, status: null }, status = true;
            for (var index = 0; index < selectedNode.length; index++) {
                data = this._validateFormat(selectedNode[index], format);
                (!data.status) && (status = false);
            }
            return status;
        };
        editorManager.prototype._getSelectNode = function () {
            return this._rangeExtract.ProcessRange();
        };
        editorManager.prototype._getFormatedTagOrder = function (data, index) {
            data[index].currentNode = this._getNodeOrder(data[index].textNode, data[index].node);
            return (!index) ? data : data.slice(index, index + 1);
        };
        editorManager.prototype._getNodeOrder = function (endNode, targetNode) {
            var currentNode = endNode, nodeOrder = [];
            do
                nodeOrder.push(currentNode);
            while ((currentNode = currentNode.parentNode) && currentNode != targetNode);
            return nodeOrder;
        };
        editorManager.prototype._splitNode = function (node) {
            var temp = node, siblingData = { rightSide: [], leftSide: [] };
            while (temp = temp.nextSibling) {
                if (this._validateCommentNode(temp))
                    siblingData.rightSide.push(temp);
            }
            temp = node;
            while (temp = temp.previousSibling) {
                if (this._validateCommentNode(temp))
                    siblingData.leftSide.push(temp);
            }
            return siblingData;
        };
        editorManager.prototype._validateCommentNode = function (node) {
            return (node.nodeType != 8);
        };
        editorManager.prototype._validateTextNode = function (node) {
            return (node.nodeType == 3);
        };
        editorManager.prototype._validateType = function (node) {
            return (this._validateTextNode(node) && (node.data.length));
        };
        editorManager.prototype._formatechildNodes = function (nodeCollection, format, node) {
            var adjacentNodes = { rightSide: [], leftSide: [] }, cloneNode;
            for (var index = nodeCollection.length - 1; index >= 0; index--) {
                adjacentNodes = this._splitNode(nodeCollection[index]);
                (adjacentNodes.rightSide.length) && ($($(node.cloneNode(false)).append(adjacentNodes.rightSide)).insertAfter(nodeCollection[index]));
                cloneNode = node;
                (adjacentNodes.leftSide.length) && ($($(node.cloneNode(false)).append(adjacentNodes.leftSide.reverse())).insertBefore(nodeCollection[index]));
            }
        };
        editorManager.prototype._removeFormat = function (nodeData, format, matches) {
            var temp = this._getFormatedTagOrder(nodeData.Info, matches), tempcloneNode, currentNode = temp[0].currentNode.slice(temp[0].currentNode.length - 1), tempSpanNode = document.createElement("span");
            temp[0].currentNode = temp[0].currentNode.slice(0, temp[0].currentNode.length - 1);
            var adjacentNodes = this._splitNode(currentNode[0]);
            (adjacentNodes.rightSide.length) &&
                ($($(temp[0].node.cloneNode(false)).append(adjacentNodes.rightSide)).insertAfter(temp[0].node));
            if (temp[0].tag) {
                if (this._rangeExtract.cursorBasedCollection && !temp[0].textNode.data.trim().length) {
                    $(tempSpanNode).append(currentNode).insertAfter($(temp[0].node));
                }
                else
                    $(currentNode).insertAfter(temp[0].node);
                tempcloneNode = temp[0].textNode;
                if (this._rangeExtract.cursorBasedCollection)
                    this._setCursorOnNode(tempcloneNode, temp[0].textNode);
            }
            else {
                tempcloneNode = $(temp[0].node.cloneNode(false));
                tempcloneNode.css(this.formatInfo.getFormatData(format).Value.removeCSS);
                (tempcloneNode[0].getAttribute("style")) ? $(tempcloneNode.append(currentNode)).insertAfter(temp[0].node) : $(currentNode).insertAfter(temp[0].node);
                tempcloneNode = currentNode;
            }
            (temp[0].currentNode.length) && (this._formatechildNodes(temp[0].currentNode, format, temp[0].node));
            (!adjacentNodes.leftSide.length) && ($(temp[0].node).remove());
            return tempcloneNode[0] ? tempcloneNode[0] : tempcloneNode;
        };
        editorManager.prototype._applyFormat = function (node, format, styleData) {
            var adjacentNodes = this._splitNode(node), tempcloneNode, currentNode = node, tempSpanNode = document.createElement("span");
            if (adjacentNodes.leftSide.length && (adjacentNodes.leftSide[0].nodeType != 3) && (this._tagCheck(adjacentNodes.leftSide[0], format) || this._compareCSS(adjacentNodes.leftSide[0], (styleData ? (this.formatInfo.getFormatData(format).Value.css + ":" + styleData + ";") : this.formatInfo.getFormatData(format).Value.css))))
                $(adjacentNodes.leftSide[0]).append(node);
            else if (adjacentNodes.rightSide.length && (adjacentNodes.rightSide[0].nodeType != 3) && (this._tagCheck(adjacentNodes.rightSide[0], format) || this._compareCSS(adjacentNodes.rightSide[0], (styleData ? (this.formatInfo.getFormatData(format).Value.css + ":" + styleData + ";") : this.formatInfo.getFormatData(format).Value.css))))
                $(adjacentNodes.rightSide[0]).prepend(node);
            else if (!adjacentNodes.leftSide.length && !adjacentNodes.rightSide.length && $(node.parentNode).is(this.formatInfo.getFormatData(format).Value.styleParent)) {
                if (styleData)
                    $(node.parentNode).css(this.formatInfo.getFormatData(format).Value.css, styleData);
                else
                    $(node.parentNode).css(this._collectStyleData(this.formatInfo.getFormatData(format).Value.css));
            }
            else {
                tempcloneNode = document.createElement(this.formatInfo.getFormatData(format).Value.result);
                if (this._rangeExtract.cursorBasedCollection) {
                    if (this._validateTextNode(node)) {
                        if (!$(tempcloneNode).is("span") && this._rangeExtract._noContent)
                            $(tempSpanNode).append(tempcloneNode);
                        else
                            (tempSpanNode = tempcloneNode);
                        tempcloneNode.appendChild(currentNode = document.createTextNode(node.data));
                        if (this._rangeExtract.cursorBasedCollection) {
                            this._setCursorOnNode(node, currentNode);
                        }
                        $(node).replaceWith(tempSpanNode);
                    }
                    else {
                        tempcloneNode.innerHTML = "&#65279;";
                        $(tempSpanNode).append(tempcloneNode);
                        if (node.firstChild && $(node.firstChild).is("br"))
                            $(tempSpanNode).insertBefore(node.firstChild);
                        else
                            $(node).append(tempSpanNode);
                        if (this._rangeExtract.cursorBasedCollection) {
                            this._setCursorOnNode(node, tempcloneNode.firstChild);
                        }
                        currentNode = tempcloneNode;
                    }
                }
                else {
                    tempcloneNode.appendChild(currentNode = document.createTextNode(node.data));
                    $(node).replaceWith(tempcloneNode);
                }
                styleData && $(tempcloneNode).css(this.formatInfo.getFormatData(format).Value.css, styleData);
            }
            return currentNode;
        };
        editorManager.prototype._setCursorOnNode = function (node, currentNode) {
            if (this._rangeExtract._cursorData.node == node)
                this._rangeExtract._cursorData.node = currentNode;
        };
        editorManager.prototype._compareCSS = function (element, css) {
            return element.getAttribute('style') && element.getAttribute('style').toLowerCase().trim().replace(/\s/g, "") == css.toLowerCase().trim().replace(/\s/g, "");
        };
        editorManager.prototype._collectStyleData = function (styledata) {
            var styleList = styledata.replace(/\s/g, "").split(';'), data = {}, temp;
            $(styleList).each(function (index) {
                var style = styleList[index];
                temp = style.split(':');
                (temp.length > 1) && (data[temp[0].toLowerCase().trim()] = temp[1].toLowerCase().trim());
            });
            return data;
        };
        editorManager.prototype._validateStyleData = function (node, style, styleData) {
            var nodeList = node.getAttribute('style').split(';'), status = false;
            $(nodeList).each(function (index) {
                var data = nodeList[index], temp = data.split(':');
                if (temp[0].toLowerCase().trim() == style.toLowerCase().trim() && temp[1].toLowerCase().trim() == styleData.toLowerCase().trim()) {
                    status = true;
                    return false;
                }
            });
            return status;
        };
        editorManager.prototype._caseConvert = function (casing) {
            var selectedNode = this._getSelectNode(), node, startNode, endNode, tempNode;
            if (!selectedNode.length || (selectedNode.length == 1 && !selectedNode[0].data.length))
                return;
            for (var index = 0; index < selectedNode.length; index++) {
                node = selectedNode[index];
                tempNode = document.createTextNode(node.data[this.formatInfo.captionConvert[casing]]());
                if (this._rangeExtract._cursorData.node == node)
                    this._rangeExtract._cursorData.node = tempNode;
                node.data && ($(node).replaceWith(tempNode));
                tempNode && (selectedNode.length == 1) ? ((startNode = tempNode) && (endNode = tempNode)) : (index == 0) ? (startNode = tempNode) : (index == selectedNode.length - 1) ? (endNode = tempNode) : null;
            }
            startNode && endNode && this._refreshRange(startNode, endNode);
        };
        editorManager.prototype._validateSelectedNode = function (selectedNode) {
            return (!selectedNode.length || (selectedNode.length == 1 && selectedNode[0].data && !selectedNode[0].data.length));
        };
        editorManager.prototype._tagFormatProcess = function (format, remove) {
            var selectedNode = this._getSelectNode();
            if (this._validateSelectedNode(selectedNode))
                return;
            var status = this._CurrentformateStatus(selectedNode, format), node, nodeData = { Info: null, status: null }, retNode, startNode, endNode;
            for (var index = 0; index < selectedNode.length; index++) {
                node = selectedNode[index], nodeData = this._validateFormat(node, format), retNode = null;
                if (((remove || status) && nodeData.status))
                    for (var matches = 0; matches < nodeData.Info.length; matches++)
                        retNode = this._removeFormat(nodeData, format, matches);
                else if (!nodeData.status && !remove)
                    retNode = this._applyFormat(node, format, null);
                else
                    retNode = node;
                if (retNode) {
                    (selectedNode.length == 1) ? ((startNode = retNode) && (endNode = retNode)) : (index == 0) ? (startNode = retNode) : (index == selectedNode.length - 1) ? (endNode = retNode) : null;
                }
            }
            startNode && endNode && this._refreshRange(startNode, endNode);
            this.focus();
            return { data: nodeData, nodeStatus: status };
        };
        editorManager.prototype._refreshRange = function (startNode, endNode) {
            var range = this.currentDocument.createRange(), Selection = this.currentDocument.getSelection(), cursorOnNode, cursorOffset;
            if (this._rangeExtract)
                (cursorOnNode = this._rangeExtract._cursorData.node) && (cursorOffset = this._rangeExtract._cursorData.offSet);
            if (this._rangeExtract.cursorBasedCollection && cursorOnNode && cursorOffset > -1) {
                cursorOffset = this._validateTextNode(cursorOnNode) ?
                    ((cursorOffset > cursorOnNode.data.length) ? cursorOnNode.data.length : cursorOffset) : 0;
                if (cursorOnNode.nodeType == 3 && !cursorOnNode.data.trim()) {
                    cursorOnNode.data = String.fromCharCode(65279) + cursorOnNode.data;
                    cursorOffset++;
                }
                this._updateCursor(cursorOnNode, cursorOffset);
            }
            else if (startNode && endNode) {
                if (startNode.data && !startNode.data.trim() && (startNode.data.indexOf(String.fromCharCode(65279)) == -1))
                    startNode.data = String.fromCharCode(65279) + startNode.data;
                if (endNode.data && !endNode.data.trim() && (endNode.data.indexOf(String.fromCharCode(65279)) == -1))
                    endNode.data = String.fromCharCode(65279);
                Selection.removeAllRanges();
                range.setStart(startNode, 0);
                range.setEnd(endNode, endNode.data ? endNode.data.length : 0);
                Selection.addRange(range);
            }
            $(this.currentWindow).focus();
        };
        editorManager.prototype._updateCursor = function (node, offset) {
            var range = this.currentDocument.createRange(), Selection = this.currentDocument.getSelection();
            range.setStart(node, offset);
            range.setEnd(node, offset);
            Selection.removeAllRanges();
            Selection.addRange(range);
        };
        editorManager.prototype._cssFormatProcess = function (format, styleData, remove) {
            var selectedNode = this._getSelectNode(), node, nodeData = { Info: null, status: null }, retNode, startNode, endNode;
            if (this._validateSelectedNode(selectedNode))
                return;
            for (var index = 0; index < selectedNode.length; index++) {
                node = selectedNode[index], nodeData = this._validateFormat(node, format);
                if (nodeData.status)
                    for (var matches = 0; matches < nodeData.Info.length; matches++) {
                        if (!remove && this._validateStyleData(nodeData.Info[matches].node, this.formatInfo.getFormatData(format).Value.css, styleData))
                            continue;
                        retNode = this._removeFormat(nodeData, format, matches);
                    }
                if (!remove)
                    retNode = this._applyFormat(node, format, styleData);
                if (retNode)
                    (selectedNode.length == 1) ? ((startNode = retNode) && (endNode = retNode)) : (index == 0) ? (startNode = retNode) : (index == selectedNode.length - 1) ? (endNode = retNode) : null;
            }
            this._refreshRange(startNode, endNode);
            this.focus();
        };
        editorManager.prototype.execCommand = function (command, value) {
            try {
                switch (command) {
                    case execCommand.bold:
                        this._tagFormatProcess("bold", false);
                        break;
                    case execCommand.italic:
                        this._tagFormatProcess("italic", false);
                        break;
                    case execCommand.underline:
                        this._tagFormatProcess("underline", false);
                        break;
                    case execCommand.strikethrough:
                        this._tagFormatProcess("strikethrough", false);
                        break;
                    case execCommand.superscript:
                        this._tagFormatProcess("subscript", true);
                        this._tagFormatProcess("superscript", false);
                        break;
                    case execCommand.subscript:
                        this._tagFormatProcess("superscript", true);
                        this._tagFormatProcess("subscript", false);
                        break;
                    case execCommand.fontsize:
                        this._cssFormatProcess("fontsize", value, false);
                        break;
                    case execCommand.fontname:
                        this._cssFormatProcess("fontname", value, false);
                        break;
                    case execCommand.forecolor:
                        this._cssFormatProcess("forecolor", value, false);
                        break;
                    case execCommand.backcolor:
                        this._cssFormatProcess("backcolor", value, false);
                        break;
                    case execCommand.uppercase:
                        this._caseConvert("uppercase");
                        break;
                    case execCommand.lowercase:
                        this._caseConvert("lowercase");
                        break;
                    case execCommand.indent:
                        this._applyIndent(true);
                        break;
                    case execCommand.outdent:
                        this._applyIndent(false);
                        break;
                    case execCommand.justifyleft:
                        this._justifyContent("left");
                        break;
                    case execCommand.justifycenter:
                        this._justifyContent("center");
                        break;
                    case execCommand.justifyright:
                        this._justifyContent("right");
                        break;
                    case execCommand.justifyfull:
                        this._justifyContent("justify");
                        break;
                    case execCommand.formatblock:
                        this._applyFormateBlock(value);
                        break;
                }
                this._junkContentStatus = true;
            }
            catch (e) {
            }
        };
        return editorManager;
    }());
    documentManager.editorManager = editorManager;
    (function (execCommand) {
        execCommand[execCommand["bold"] = 0] = "bold";
        execCommand[execCommand["italic"] = 1] = "italic";
        execCommand[execCommand["underline"] = 2] = "underline";
        execCommand[execCommand["strikethrough"] = 3] = "strikethrough";
        execCommand[execCommand["superscript"] = 4] = "superscript";
        execCommand[execCommand["subscript"] = 5] = "subscript";
        execCommand[execCommand["fontsize"] = 6] = "fontsize";
        execCommand[execCommand["fontname"] = 7] = "fontname";
        execCommand[execCommand["forecolor"] = 8] = "forecolor";
        execCommand[execCommand["backcolor"] = 9] = "backcolor";
        execCommand[execCommand["uppercase"] = 10] = "uppercase";
        execCommand[execCommand["lowercase"] = 11] = "lowercase";
        execCommand[execCommand["indent"] = 12] = "indent";
        execCommand[execCommand["outdent"] = 13] = "outdent";
        execCommand[execCommand["justifyleft"] = 14] = "justifyleft";
        execCommand[execCommand["justifycenter"] = 15] = "justifycenter";
        execCommand[execCommand["justifyright"] = 16] = "justifyright";
        execCommand[execCommand["justifyfull"] = 17] = "justifyfull";
        execCommand[execCommand["formatblock"] = 18] = "formatblock";
    })(documentManager.execCommand || (documentManager.execCommand = {}));
    var execCommand = documentManager.execCommand;
    var ValidatedData = (function () {
        function ValidatedData(node, textNode, tag, css) {
            this.textNode = textNode;
            this.node = node;
            this.css = css;
            this.tag = tag;
        }
        return ValidatedData;
    }());
    var actionType = (function () {
        function actionType(tag, css, result, removeCSS, styleParent) {
            this.tag = tag;
            this.css = css;
            this.result = result;
            this.removeCSS = removeCSS;
            this.styleParent = styleParent;
        }
        return actionType;
    }());
    var captionConvertion = (function () {
        function captionConvertion() {
            this.uppercase = "toUpperCase";
            this.lowercase = "toLowerCase";
        }
        return captionConvertion;
    }());
    var KeyDictionary = (function () {
        function KeyDictionary(target, value) {
            this.Key = target;
            this.Value = value;
        }
        return KeyDictionary;
    }());
    var formateDataCollection = (function () {
        function formateDataCollection() {
            this.filterNode = ["div", "p", "h1", "h2", "h3", "h4", "h5", "h6", "address", "applet", "blockquote", "button", "center", "dd", "dir", "dl", "dt", "fieldset", "form", "frameset", "hr", "iframe", "isindex", "li", "map", "menu", "noframes", "noscript", "object", "ol", "pre", "script", "table", "tbody", "td", "tfoot", "th", "thead", "tr", "ul", "header", "article", "nav", "footer", "section", "aside", "main", "figure", "figcaption"];
            this.actionList = ["bold", "italic", "underline", "strikethrough", "superscript", "subscript", "fontsize", "fontname", "forecolor", "backcolor"];
            this.captionConvert = new captionConvertion();
            this._updateData();
        }
        formateDataCollection.prototype._updateData = function () {
            var temp = Array();
            temp.push(new KeyDictionary("bold", new actionType("b,strong", "font-weight:bold;", "b", { "font-weight": '' }, "span")));
            temp.push(new KeyDictionary("italic", new actionType("i, cite, em, var, address, dfn", "font-style:italic", "i", { "font-style": '' }, "span")));
            temp.push(new KeyDictionary("underline", new actionType("u,ins", "text-decoration:underline;", "u", { "text-decoration": '' }, "span")));
            temp.push(new KeyDictionary("strikethrough", new actionType("s, strike, del", "text-decoration:line-through;", "s", { "text-decoration": '' }, "span")));
            temp.push(new KeyDictionary("superscript", new actionType("sup", "vertical-align:super;font-size:smaller;", "sup", { "vertical-align": '', "font-size": '' }, "span")));
            temp.push(new KeyDictionary("subscript", new actionType("sub", "vertical-align:sub;font-size:smaller;", "sub", { "vertical-align": '', "font-size": '' }, "span")));
            temp.push(new KeyDictionary("fontsize", new actionType(null, "font-size", "span", { "font-size": '' }, "span")));
            temp.push(new KeyDictionary("fontname", new actionType(null, "font-family", "span", { "font-family": '' }, "span")));
            temp.push(new KeyDictionary("forecolor", new actionType(null, "color", "span", { "color": '' }, "span")));
            temp.push(new KeyDictionary("backcolor", new actionType(null, "background-color", "span", { "background-color": '' }, "span")));
            this.tempCollection = temp;
        };
        formateDataCollection.prototype.getFormatData = function (format) {
            var temp;
            for (var index = 0; index < this.tempCollection.length; index++) {
                temp = this.tempCollection[index];
                if (temp.Key == format)
                    return this.tempCollection[index];
            }
        };
        return formateDataCollection;
    }());
    var RangeExtractor = (function () {
        function RangeExtractor(target) {
            this.exp = /\s/g;
            this._findStatus = { leftSide: null, rightSide: null };
            this._iterationStatus = false;
            this._cursorData = { node: null, offSet: null };
            this._nodeCollection = [];
            this._traverseData = {
                leftSide: { childNode: "lastChild", sibling: "previousSibling" },
                rightSide: { childNode: "firstChild", sibling: "nextSibling" }
            };
            this._blockNodes = ["div", "p", "h1", "h2", "h3", "h4", "h5", "h6", "address", "applet", "blockquote", "button", "center", "dd", "dir", "dl", "dt", "fieldset", "form", "frameset", "hr", "iframe", "isindex", "li", "map", "menu", "noframes", "noscript", "object", "ol", "pre", "script", "table", "tbody", "td", "tfoot", "th", "thead", "tr", "ul", "header", "article", "nav", "footer", "section", "aside", "main", "figure", "figcaption"];
            this._noContent = false;
            this.nodeCollection = { leftSide: [], rightSide: [] };
            this.currentDocument = target;
        }
        RangeExtractor.prototype.ProcessRange = function () {
            var tempRange = this._getRange();
            if (($(this.currentDocument.body).attr("contenteditable") == "true") && tempRange) {
                this._nodeCollection = [], this._noContent = false;
                this._iterationStatus = false;
                this._cursorData = { node: null, offSet: null };
                if ((tempRange.startContainer == tempRange.endContainer) && (tempRange.startOffset == tempRange.endOffset)) {
                    this._collectCursorBasedTextNode(tempRange.startContainer, tempRange.startOffset);
                    this.cursorBasedCollection = true;
                }
                else {
                    this._collectSelectionBasedTextNode(tempRange);
                    this.cursorBasedCollection = false;
                }
            }
            return this._nodeCollection;
        };
        RangeExtractor.prototype._insertCursor = function (startContainer, startOffset) {
            var firstNodeData = startContainer.data.substring(0, startOffset), middleNodeData = "", lastNodeData = startContainer.data.substr(startOffset), tempNode;
            firstNodeData.replace(String.fromCharCode(65279), "") && $(document.createTextNode(firstNodeData)).insertBefore(startContainer);
            lastNodeData.replace(String.fromCharCode(65279), "") && $(document.createTextNode(lastNodeData)).insertAfter(startContainer);
            $(startContainer).replaceWith(tempNode = document.createTextNode(middleNodeData));
            this._cursorData = { node: tempNode, offSet: 0 };
            this._nodeCollection.push(tempNode);
            this._noContent = true;
        };
        RangeExtractor.prototype._collectCursorBasedTextNode = function (startContainer, startOffset) {
            var tempLeftIndex, temp, validString, tempNode, tempRightIndex, regx = new RegExp(this.exp);
            while (temp = regx.exec(startContainer.data)) {
                if (startContainer.data.substring(temp.index, temp.index + 1).indexOf(" ") != -1) {
                    if (temp.index < startOffset) {
                        tempLeftIndex = temp;
                    }
                    if (!tempRightIndex && (startOffset <= temp.index)) {
                        tempRightIndex = temp;
                    }
                }
            }
            if (tempLeftIndex && tempRightIndex) {
                if ((startOffset - (tempLeftIndex.index + 1) == 0 || startOffset - (tempLeftIndex.index + 1) == startContainer.data.substring(tempLeftIndex.index + 1, tempRightIndex.index).replace("\n", '').length)) {
                    this._insertCursor(startContainer, startOffset);
                }
                else {
                    var firstNodeData = startContainer.data.substring(0, tempLeftIndex.index + 1), lastNodeData = startContainer.data.substring(tempRightIndex.index);
                    $(document.createTextNode(firstNodeData)).insertBefore(startContainer);
                    $(document.createTextNode(lastNodeData)).insertAfter(startContainer);
                    $(startContainer).replaceWith(tempNode = document.createTextNode(startContainer.data.substring(tempLeftIndex.index + 1, tempRightIndex.index)));
                    this._cursorData = { node: tempNode, offSet: startOffset - (tempLeftIndex.index + 1) };
                    this._nodeCollection.push(tempNode);
                }
            }
            else if (tempLeftIndex) {
                var rightSideNode;
                this._collectNodeData(startContainer, false);
                rightSideNode = this._nodeCollection;
                this._nodeCollection = [];
                if ((rightSideNode.length == 0) && (((startOffset - (tempLeftIndex.index + 1)) == 0) || ((startOffset - (tempLeftIndex.index + 1)) == startContainer.data.substring(tempLeftIndex.index + 1).replace("\n", '').length))) {
                    this._insertCursor(startContainer, startOffset);
                }
                else {
                    var firstNodeData = startContainer.data.substring(0, tempLeftIndex.index + 1);
                    $(document.createTextNode(firstNodeData)).insertBefore(startContainer);
                    $(startContainer).replaceWith(tempNode = document.createTextNode(startContainer.data.substring(tempLeftIndex.index + 1)));
                    this._cursorData = { node: tempNode, offSet: startOffset - (tempLeftIndex.index + 1) };
                    this._nodeCollection.push(tempNode);
                    this._nodeCollection.concat(rightSideNode);
                }
            }
            else if (tempRightIndex) {
                var leftSideNode;
                this._collectNodeData(startContainer, true);
                leftSideNode = this._nodeCollection;
                this._nodeCollection = [];
                if (leftSideNode.length == 0 && ((startOffset == startContainer.data.substring(0, tempRightIndex.index).replace("\n", '').length) || startOffset == 0)) {
                    this._insertCursor(startContainer, startOffset);
                }
                else {
                    var lastNodeData = startContainer.data.substring(tempRightIndex.index);
                    $(document.createTextNode(lastNodeData)).insertAfter(startContainer);
                    $(startContainer).replaceWith(tempNode = document.createTextNode(startContainer.data.substring(0, tempRightIndex.index)));
                    this._cursorData = { node: tempNode, offSet: startOffset };
                    this._nodeCollection = leftSideNode.reverse();
                    this._nodeCollection.push(tempNode);
                }
            }
            else {
                if (startContainer.nodeType != 3) {
                    tempNode = document.createTextNode("");
                    if (startContainer.firstChild)
                        $(tempNode).insertBefore(startContainer.firstChild);
                    else
                        $(tempNode).appendTo(startContainer);
                    this._nodeCollection.push(tempNode);
                    this._cursorData = { node: tempNode, offSet: startOffset };
                    this._noContent = true;
                }
                else {
                    var rightSideNode, leftSideNode;
                    this._collectNodeData(tempNode = startContainer, false);
                    rightSideNode = this._nodeCollection;
                    this._nodeCollection = [];
                    this._collectNodeData(tempNode, true);
                    leftSideNode = this._nodeCollection;
                    this._nodeCollection = [];
                    if (tempNode.data == String.fromCharCode(65279) || (leftSideNode.length == 0 && startOffset == 0) || (rightSideNode.length == 0 && tempNode.data.replace(String.fromCharCode(65279), "").replace("\n", '').length == startOffset)) {
                        this._insertCursor(startContainer, startOffset);
                    }
                    else {
                        this._nodeCollection = leftSideNode.reverse();
                        this._nodeCollection.push(tempNode);
                        this._nodeCollection = this._nodeCollection.concat(rightSideNode);
                        this._cursorData = { node: tempNode, offSet: startOffset };
                    }
                }
            }
            return this._nodeCollection;
        };
        RangeExtractor.prototype._validateContent = function (node, traverse) {
            var regx = new RegExp(this.exp), temp, _matches = [], tempTxtNode, textIndex;
            while (temp = regx.exec(node.data)) {
                _matches.push(temp);
            }
            if (_matches.length) {
                temp = _matches[(traverse == "leftSide") ? _matches.length - 1 : 0], textIndex = (traverse == "leftSide") ? temp.index + 1 : temp.index;
                $(tempTxtNode = document.createTextNode(node.data.substring(textIndex))).insertAfter(node);
                node.data = node.data.substring(0, textIndex);
                if ((traverse == "rightSide") && $.trim(node.data))
                    this._nodeCollection.push(node);
                else if ((traverse == "leftSide") && $.trim(tempTxtNode.data))
                    this._nodeCollection.push(tempTxtNode);
                this._findStatus[traverse] = true;
            }
            else
                this._nodeCollection.push(node);
        };
        RangeExtractor.prototype._iterateNodes = function (element, traverse) {
            if (!this._findStatus[traverse]) {
                if (element.nodeType == 3 && element.data)
                    this._validateContent(element, traverse);
                else if ((element = element[this._traverseData[traverse]["childNode"]]) && !this._findStatus[traverse])
                    do {
                        (element.nodeType == 3 && element.data) ? this._validateContent(element, traverse) : this._iterateNodes(element, traverse);
                    } while ((element = element[this._traverseData[traverse]["sibling"]]) && !this._findStatus[traverse]);
            }
        };
        RangeExtractor.prototype._collectNodeData = function (node, leftSide) {
            this._findStatus = { leftSide: undefined, rightSide: undefined };
            var _proxy = this;
            var traverse = leftSide ? "leftSide" : "rightSide";
            do {
                this.nodeCollection = this._splitSiblingNode(node);
                $(this.nodeCollection[traverse]).each(function (index, element) { _proxy._iterateNodes(element, traverse); });
            } while (!this._validateBlockType(node.parentNode) && (node = node.parentNode) && !this._findStatus[traverse]);
        };
        RangeExtractor.prototype._validateBlockType = function (node) {
            return ($.inArray(node.tagName.toLowerCase(), this._blockNodes.concat("body")) != -1);
        };
        RangeExtractor.prototype._validateTextNode = function (node) {
            return (node.nodeType == 3);
        };
        RangeExtractor.prototype._splitSiblingNode = function (node) {
            var temp = node, nodeSiblingData = { leftSide: [], rightSide: [] };
            while (temp = temp.nextSibling) {
                if (temp.tagName && this._validateBlockType(temp)) {
                    continue;
                }
                nodeSiblingData.rightSide.push(temp);
            }
            temp = node;
            while (temp = temp.previousSibling) {
                if (temp.tagName && this._validateBlockType(temp)) {
                    continue;
                }
                nodeSiblingData.leftSide.push(temp);
            }
            return nodeSiblingData;
        };
        RangeExtractor.prototype._getRange = function () {
            var selCurrent = this.currentDocument.getSelection(), range = null;
            (selCurrent.rangeCount) && (range = selCurrent.getRangeAt(0));
            return range;
        };
        RangeExtractor.prototype._collectSelectionBasedTextNode = function (tempRange) {
            var leftData, rightData, centerData, leftNode, rightNode, centerNode, startNode = tempRange.startContainer, endNode = tempRange.endContainer;
            this._nodeCollection = [];
            if (tempRange.startContainer == tempRange.endContainer) {
                if (this._validateTextNode(tempRange.endContainer)) {
                    if (tempRange.startOffset)
                        leftData = tempRange.startContainer.data.substr(0, tempRange.startOffset);
                    if (tempRange.startContainer.data.length != tempRange.endOffset)
                        rightData = tempRange.startContainer.data.substr(tempRange.endOffset);
                    centerData = tempRange.startContainer.data.substr(tempRange.startOffset, (tempRange.endOffset - tempRange.startOffset));
                    leftData && ($((leftNode = document.createTextNode(leftData))).insertBefore(tempRange.startContainer));
                    rightData && ($((rightNode = document.createTextNode(rightData))).insertAfter(tempRange.startContainer));
                    centerData && ($(tempRange.startContainer).replaceWith(centerNode = document.createTextNode(centerData))) && this._nodeCollection.push(centerNode);
                }
                else
                    this._updateNodeCollection((tempRange.startContainer.nodeName.toLowerCase() == 'html') ? $(tempRange.startContainer).find('body')[0] : tempRange.startContainer, startNode, null);
            }
            else {
                if (tempRange.startContainer.nodeType == 3 && tempRange.startOffset) {
                    leftData = tempRange.startContainer.data.substr(0, tempRange.startOffset);
                    rightData = tempRange.startContainer.data.substr(tempRange.startOffset);
                    ($(document.createTextNode(leftData)).insertBefore(tempRange.startContainer));
                    ($(startNode).replaceWith(startNode = document.createTextNode(rightData)));
                }
                if (tempRange.endContainer.nodeType == 3 && tempRange.endContainer.data.length != tempRange.endOffset) {
                    rightData = tempRange.endContainer.data.substr(tempRange.endOffset);
                    leftData = tempRange.endContainer.data.substr(0, tempRange.endOffset);
                    ($(document.createTextNode(rightData)).insertAfter(tempRange.endContainer));
                    ($(endNode).replaceWith(endNode = document.createTextNode(leftData)));
                }
                else if (tempRange.endOffset && tempRange.endContainer.lastChild)
                    endNode = tempRange.endContainer.lastChild;
                this._updateNodeCollection(tempRange.commonAncestorContainer, startNode, endNode);
            }
        };
        RangeExtractor.prototype._updateNodeCollection = function (targetNode, startNode, endNode) {
            this._updateIterationStatus(targetNode, startNode, endNode);
            if (targetNode = targetNode.firstChild)
                do
                    this._updateNodeCollection(targetNode, startNode, endNode);
                while (targetNode = targetNode.nextSibling);
        };
        RangeExtractor.prototype._updateIterationStatus = function (targetNode, startNode, endNode) {
            (targetNode == startNode && !this._iterationStatus) && (this._iterationStatus = true);
            if (targetNode.nodeType == 3 && this._iterationStatus)
                this._nodeCollection.push(targetNode);
            (targetNode == endNode && this._iterationStatus) && (this._iterationStatus = false);
        };
        return RangeExtractor;
    }());
})(documentManager || (documentManager = {}));
$.extend(ej, documentManager);
window["documentManager"] = null;
