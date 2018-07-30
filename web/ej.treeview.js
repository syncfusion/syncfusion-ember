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
    ej.widget("ejTreeView", "ej.TreeView", {
        _rootCSS: "e-treeview",

        element: null,

        model: null,

        validTags: ["ul", "div"],
        _addToPersist: ["expandedNodes", "checkedNodes", "selectedNodes"],
       
        _setFirst: false,

        _requiresID: true,

        defaults: {

            allowMultiSelection: false,

            showCheckbox: false,

            enableAnimation: true,

            allowDragAndDrop: false,

            htmlAttributes: {},

            allowDropChild: true,

            allowDropSibling: true,

            allowDragAndDropAcrossControl: true,

            allowEditing: false,

            allowKeyboardNavigation: true,

            items: null,

            fields: {

                dataSource: null,

                query: null,

                tableName: null,

                child: null,

                id: "id",

                parentId: "parentId",

                text: "text",

                spriteCssClass: "spriteCssClass",

                expanded: "expanded",

                hasChild: "hasChild",

                selected: "selected",

                linkAttribute: "linkAttribute",

                imageAttribute: "imageAttribute",

                htmlAttribute: "htmlAttribute",

                imageUrl: "imageUrl",

                isChecked: "isChecked"

            },

            autoCheckParentNode: false,

            loadOnDemand: false,

            cssClass: "",

            template: null,

            enableRTL: false,

            expandOn: "dblclick",

            enablePersistence: false,

            enabled: true,

            expandedNodes: [],

            checkedNodes: [],

            selectedNode: -1,

            selectedNodes: [],

            width: null,

            height: null,

            autoCheck: true,

            enableMultipleExpand: true,

            fullRowSelect: false,

            sortSettings: {

                allowSorting: false,

                sortOrder: "ascending",

            },

            nodeClick: null,

            beforeExpand: null,

            nodeExpand: null,

            beforeCollapse: null,

            nodeCollapse: null,

            beforeSelect: null,

            nodeSelect: null,

            nodeUnselect: null,

            nodeCheck: null,

            nodeUncheck: null,

            inlineEditValidation: null,

            beforeEdit: null,

            nodeEdit: null,

            keyPress: null,

            nodeDragStart: null,

            nodeDrag: null,

            nodeDragStop: null,

            nodeDropped: null,

            beforeAdd: null,

            nodeAdd: null,

            beforeDelete: null,

            nodeDelete: null,

            beforeCut: null,

            nodeCut: null,

            beforePaste: null,

            nodePaste: null,

            beforeLoad: null,

            loadSuccess: null,

            loadError: null,

            ready: null,

            create: null,

            destroy: null

        },

        dataTypes: {

            allowMultiSelection: "boolean",

            cssClass: "string",

            showCheckbox: "boolean",

            enableAnimation: "boolean",

            allowDragAndDrop: "boolean",

            allowDropChild: "boolean",

            allowDragAndDropAcrossControl: "boolean",

            allowEditing: "boolean",

            allowKeyboardNavigation: "boolean",

            autoCheckParentNode: "boolean",

            loadOnDemand: "boolean",

            enableRTL: "boolean",

            expandOn: "string",

            enablePersistence: "boolean",

            enableMultipleExpand: "boolean",

            fullRowSelect: "boolean",

            items: "data",

            fields: {

                dataSource: "data",

                query: "data",

                child: "data"

            },

            expandedNodes: "array",

            checkedNodes: "array",

            selectedNode: "number",

            selectedNodes: "array",

            htmlAttributes: "data",

            sortSettings: {

                allowSorting: "boolean",

                sortOrder: "enum",

            }
        },

        observables: ["fields.dataSource"],

        dataSource: ej.util.valueFunction("fields.dataSource"),

        _setModel: function (options) {
            for (var key in options) {
                switch (key) {
                    case "allowMultiSelection":
                        this.model.allowMultiSelection = options[key];
                        if (!this.model.allowMultiSelection) {
                            var sleNode = $(this._liList[this.model.selectedNodes[0]]);
                            this._unselectAll();
                            this._isRender = false;
                            this._nodeSelectionAction(sleNode);
                            this._isRender = true;
                        }
                        break;
                    case "cssClass": this._changeSkin(options[key]); break;
                    case "fields":
                        if (this._deepWatch && !ej.isNullOrUndefined(options[key]["dataSource"]) && (JSON.stringify(this._oldDataSource) == JSON.stringify(typeof options[key]["dataSource"] == "function" ? options[key]["dataSource"]() : options[key]["dataSource"])))
                            return;
                        this._unWireEvents();
                        var tempUl, f = this.element.hasClass("e-js") ? false : true, element = f ? this.element.children("ul") : this.element;
                        element.empty();
                        if (this.model.fields == null || options[key] == null)
                            this.model.fields = options[key];
                        else
                            this._extendFields(this.model.fields, options[key]);
                        this.model.expandedNodes = [];
                        this.model.checkedNodes = [];
                        this.model.selectedNodes = [];
                        this.model.selectedNode = -1;
                        this._persistValues(this.model.expandedNodes, "expandedNodes");
                        this._persistValues(this.model.checkedNodes, "checkedNodes");
                        this._persistValues(this.model.selectedNodes, "selectedNodes");
                        this._newDataSource = this.dataSource();
                        (!ej.isNullOrUndefined(this.model.fields) && this.dataSource() != null) ? this._checkDataBinding() : this._initialize();
                        if (f) {
                            tempUl = this.element.children(".e-treeview-ul");
                            element.append(tempUl.children());
                            tempUl.remove();
                        }
                        break;
                    case "allowDragAndDropAcrossControl":
                        this.model.allowDragAndDropAcrossControl = options[key];
                        this._enableDragDrop();
                        break;
                    case "enabled": this._enabledAction(options[key]); break;
                    case "showCheckbox":
                        if (options[key]) {
                            this.model.showCheckbox = options[key];
                            this._showCheckBox();
                            (!this.model.enabled) && this.element.find('.nodecheckbox').ejCheckBox("disable");
                        } else {
                            this.element.find('.e-item > div > .e-chkbox-wrap').remove();
                            this._updateCheckedNodes();
                        }
                        break;
                    case "autoCheck": this.model.autoCheck = options[key]; break;
                    case "autoCheckParentNode": this.model.autoCheckParentNode = options[key]; break;
                    case "expandedNodes":
                        var len = options[key].length, temp = JSON.parse(JSON.stringify(this.model.expandedNodes));
                        if (len > 0) {
                            this._expandNodes(options[key]);
                            for (var i = 0, len = temp.length; i < len; i++) {
                                if (options[key].indexOf(temp[i]) == -1) {
                                    this._collapseNode($(this._liList[temp[i]]));
                                }
                            }
                        } else
                             (len == 0) && this._collapseAll();
                        options[key] = this.model.expandedNodes;
                        break;
                    case "checkedNodes":
                        if (this.model.showCheckbox) {
                            var len = options[key].length, temp = JSON.parse(JSON.stringify(this.model.checkedNodes));
                            if (len > 0) {
                                this._checkedNodes(options[key]);
                                for (var i = 0, len = temp.length; i < len; i++)
                                    (options[key].indexOf(temp[i]) == -1) && this._nodeUncheck($(this._liList[temp[i]]).find("> div > .e-chkbox-wrap > .nodecheckbox:first")[0]);
                            } else
                                 (len == 0) && this._uncheckAll();
                        }
                        options[key] = this.model.checkedNodes;
                        break;
                    case "expandOn":
                        this._off(this.element, (this._isDevice && $.isFunction($.fn.tap)) ? this._touchExpandOn : this.model.expandOn, this._expandEventHandler);
                        this._assignTouchExpandOn(options[key]);
                        this._on(this.element, (this._isDevice && $.isFunction($.fn.tap)) ? this._touchExpandOn : options[key], this._expandEventHandler);
                        break;
                    case "allowEditing":
                        this._preventEditable();
                        (options[key]) && this._allowEditable();
                        break;
                    case "allowKeyboardNavigation":
                        var action = (options[key]) ? "_on" : "_off";
                        this[action](this.element, 'keydown', this._KeyPress);
                        break;
                    case "allowDragAndDrop":
                        this.model.allowDragAndDrop = options[key];
                        (options[key]) ? this._addDragableClass() : this._preventDraggable();
                        break;
                    case "allowDropChild":
                        this.model.allowDropChild = options[key];
                        (options[key]) ? this._addDragableClass() : this._preventDropChild();
                        break;
                    case "allowDropSibling":
                        this.model.allowDropSibling = options[key];
                        (options[key]) ? this._addDragableClass() : this._preventDropSibling();
                        break;
                    case "enableRTL":
                        this.model.enableRTL = options[key];
                        var action, ele = (this.element.is('UL')) ? this.element.parent('.e-treeview-wrap') : this.element;
                        action = (this.model.enableRTL) ? "addClass" : "removeClass";
                        ele[action]("e-rtl");
                        break;
                    case "height": this.element.is("ul") ? this.element.parent().height(options[key]) : this.element.height(options[key]); break;
                    case "width": this.element.is("ul") ? this.element.parent().width(options[key]) : this.element.width(options[key]); break;
                    case "selectedNode":
                    case "selectedNodes":
                        this.model.selectedNodes = (key == "selectedNode") ? [options[key]] : options[key];
                        this.element.find('a.e-text.e-active').removeClass('e-node-focus e-active').closest('li').attr("aria-selected", false);
                        this._doSelectNodes(this.model.selectedNodes, false);
                        if (key != "selectedNode") options[key] = this.model.selectedNodes;
                        break;
                    case "htmlAttributes": this._addAttr(options[key]); break;
                    case "enableMultipleExpand":
                        (!options[key]) && this.collapseAll();
                        this.model.enableMultipleExpand = options[key];
                        break;
                    case "sortSettings":
                        $.extend(this.model.sortSettings, options[key]);
                        if (!ej.isNullOrUndefined(this.model.fields) && this.dataSource() != null) {
                            this.model.expandedNodes = [];
                            this.model.checkedNodes = [];
                            this.model.selectedNodes = [];
                            this._checkDataBinding();
                        }
                        break;
                    case "fullRowSelect":
                        this._wholeRowEvents("_off");
                        this.model.fullRowSelect = options[key];
                        this.model.fullRowSelect ? this._addWholeRowWrap() : this._removeWholeRowWrap();
                        this._doWholeRowAction();
                        this._wholeRowEvents("_on");
                        break;
                }
            }
        },

        _destroy: function () {
            this.element.html("");
            this._cloneElement.removeClass('e-treeview e-js e-treeview-wrap');
            var ele = (this.element.is('UL')) ? this.element.parent('.e-treeview-wrap') : this.element;
            ele.replaceWith(this._cloneElement);
            $("#" + this._id + "_WaitingPopup").remove();
            if (window.localStorage) {
                window.localStorage.removeItem(this._id + "_childNodes");
                window.localStorage.removeItem(this._id + "_persistedValues");
            }
            else if (window.cookie) {
                document.cookie = this._id + "_childNodes=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                document.cookie = this._id + "_persistedValues=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
            }
        },

        _init: function () {
            this._cloneElement = this.element.clone(), this._dataSource = [], this._fragment = [], this._templateType = "", this._indexID = 0, this._newDataSource = this.dataSource(), this._id = this.element.prop("id"), this._treeList = [], this._isTextbox = false;
            this._isDevice = this._checkDevice();
            this._deepWatch = (this.element.attr("e-deepwatch") === "true" && !(this.dataSource() instanceof ej.DataManager)) ? true : false;
            var browserInfo = ej.browserInfo();
            this._isIE8 = (browserInfo.name == 'msie' && browserInfo.version == '8.0') ? true : false;
            if (this._deepWatch) {
                this._oldDataSource = JSON.parse(JSON.stringify(this.dataSource()));
            }
            this._assignTouchExpandOn(this.model.expandOn);
            if (this.model.enablePersistence) {
                var cookieData = this._getCookies("_persistedValues");
                if (!cookieData) {
                    var obj = { selectedNodes: [], expandedNodes: [], checkedNodes: [] };
                    obj = this._updatePersistAttr(obj);
                    this._setCookies("_persistedValues", JSON.stringify(obj));
                }
            }
            if (!ej.isNullOrUndefined(this.model.fields) && this.dataSource() != null) {
                this._checkDataBinding();
            } else {
                this._initialize();
                this._completeRendering();
            }
        },

        _initialize: function () {
            this._cutNode = null, this._beforeEditText = null, this._CurrenctSelectedNodes = [], this._isLoaded = false;
            this._renderMultiTouchDialog();
            if (this.element.is("ul")) {
                this._createWrapper();
            }
            else {
                this.element.addClass("e-treeview-wrap e-widget").attr("tabindex", 0)
                            .children('ul:first').addClass("e-ul e-box");
                (this.model.width != null) && this.element.width(this.model.width);
                (this.model.height != null) && this.element.height(this.model.height);
                (this.model.enableRTL) && this.element.addClass("e-rtl");
                (this.model.cssClass != null) && this.element.addClass(this.model.cssClass);
                this._addAttr(this.model.htmlAttributes);
            }
            this._elementSettings();
            this._beforeBaseClass();
            if (this.dataSource() == null) {
                this._addBaseClass();
                this._controlRender();
            }
            this._addWholeRowWrap();
            if (this._isIE8)
                (this.element.is('UL')) ? this.element.parent('.e-treeview-wrap').addClass("e-ie8") : this.element.addClass("e-ie8");
            this._finalize();
        },

        _completeRendering: function () {
            if (this._treeList.length == 0 && !this._isLoaded) {
                this._finalizeNode();
                this._enabledAction(this.model.enabled);
                this._triggerEvent('ready', { element: this.element[0] });
                this._isLoaded = true;
            }
        },

        _addWholeRowWrap: function () {
            if (this.model.fullRowSelect)
                (this.element.is('UL')) ? this.element.parent('.e-treeview-wrap').addClass("e-fullrow-wrap") : this.element.addClass("e-fullrow-wrap");
        },

        _removeWholeRowWrap: function () {
            (this.element.is('UL')) ? this.element.parent('.e-treeview-wrap').removeClass("e-fullrow-wrap") : this.element.removeClass("e-fullrow-wrap");
        },

        _doWholeRowAction: function () {
            if (this.model.fullRowSelect) {
                for (var i = 0, len = this._liList.length; i < len; i++) {
                    var element = $(this._liList[i]);
                    if (element[0] != null) {
                        var txtEle = element.find("> .e-text-wrap");
                        this._renderWholeRow(element, txtEle);
                    }
                }
            }
            else
                this.element.find(".e-fullrow").remove();
        },

        _renderWholeRow: function (element, nestedEle) {
            if (!element) return;
            if (this.model.fullRowSelect) {
                var absolutediv = document.createElement('div');
                absolutediv.setAttribute('class', 'e-fullrow');
                nestedEle ? $(absolutediv).insertAfter(nestedEle) : element[0].appendChild(absolutediv);
            }
        },

        _extendFields: function (mapper, value) {
            if (mapper == null || value == null)
                mapper = value;
            else if (mapper.child == null || value['child'] == null)
                $.extend(mapper, value);
            else {
                this._extendFields(mapper.child, value['child']);
                var tempField = mapper.child;
                $.extend(mapper, value);
                $.extend(mapper.child, tempField);
            }
        },

        _checkDevice: function () {
            return (ej.isDevice() && ej.isTouchDevice());
        },

        _assignTouchExpandOn: function (expandon) {
            if (expandon == "dblclick")
                this._touchExpandOn = "doubletap";
            else if (expandon == "click")
                this._touchExpandOn = "tap";
            else
                this._touchExpandOn = expandon;
        },

        _renderMultiTouchDialog: function () {
            this._customPop = ej.buildTag("div.e-fe-popup", "", { display: "none" });
            var $content = ej.buildTag("div.e-content"), $downTail = ej.buildTag("div.e-downtail e-tail");
            if (this.model.allowMultiSelection) {
                var $selElement = ej.buildTag("span.e-rowselect e-icon");
                $content.append($selElement);
            }
            this._customPop.append($content);
            this._customPop.append($downTail);
            if(!this.element.is("ul")){
			this.element.append(this._customPop);     
			} 
            this._on($content, (this._isDevice && $.isFunction($.fn.tap)) ? "touchstart" : "mousedown", this._popupClick);
        },

        _popupClick: function () {
            var $selElement = this._customPop.find(".e-rowselect");
            if ($selElement.hasClass("e-spanclicked")) {
                this._hidePopup();
            }
            else {
                this._isPopup = true;
                $selElement.addClass("e-spanclicked");
            }
        },

        _hidePopup: function () {
            if (this._customPop != null && this._customPop.is(":visible")) {
                this._customPop.find(".e-rowselect").removeClass("e-spanclicked");
                this._customPop.hide();
                this._isPopup = false;
            }
        },

        _elementSettings: function () {
            var ele = (this.element.is('UL')) ? this.element.parent('.e-treeview-wrap') : this.element;
            (this.element.is("ul")) ? ele.attr("role", "tree") : ele.attr("aria-activedescendant", this._id + "_active").attr("role", "tree");
        },

        _beforeBaseClass: function () {
            var ele = (this.element.is('UL')) ? this.element.parent('.e-treeview-wrap')[0] : this.element[0];
            this._ulList = $(ele.querySelectorAll('ul'));
            this._liList = $(ele.querySelectorAll('li'));
        },

        _createWrapper: function () {
            var mainWidget = ej.buildTag("div.e-treeview-wrap e-widget " + this.model.cssClass, "", "", { tabindex: 0, "aria-activedescendant": this._id + "_active" });
            (this.model.width != null) && mainWidget.width(this.model.width);
            (this.model.height != null) && mainWidget.height(this.model.height);
            (this.model.enableRTL) && mainWidget.addClass("e-rtl");
            mainWidget.insertAfter(this.element);
            mainWidget.append(this.element.addClass("e-ul e-box").attr("tabindex", 0));
			if(this.element.is("ul")){
				mainWidget.append(this._customPop);
			}
            this._addAttr(this.model.htmlAttributes);
        },

        _addAttr: function (htmlAttr) {
            var proxy = this;
            $.map(htmlAttr, function (value, key) {
                if (key == "class") proxy.element.addClass(value);
                else if (key == "disabled" && value == "disabled") proxy._enabledAction(false);
                else proxy.element.attr(key, value)
            });
        },

        _changeSkin: function (skin) {
            if (this.model.cssClass != skin) {
                var ele = (this.element.is('UL')) ? this.element.parent('.e-treeview-wrap') : this.element;
                ele.removeClass(this.model.cssClass).addClass(skin);
                ele.find('.e-item > div > .e-chkbox-wrap').removeClass(this.model.cssClass).addClass(skin);
                this._waitingPopup && this._waitingPopup.option("cssClass", skin);
            }
        },

        _enabledAction: function (flag) {
            this.model.enabled = flag;
            if (flag) {
                this.element.removeClass("e-disable");
                this._wireEvents();
            }
            else {
                this.element.addClass("e-disable");
                this._unWireEvents();
            }
        },

        _checkDataBinding: function () {
            if (this.dataSource() instanceof ej.DataManager) {
                this._initDataSource();
            } else {
                this._ensureDataSource(this.dataSource());
                this._initialize();
                this._completeRendering();
            }
        },

        _initDataSource: function () {
            this.element.ejWaitingPopup({ cssClass: this.model.cssClass });
            this._waitingPopup = this.element.ejWaitingPopup("instance");
            this._waitingPopup.maindiv.addClass("e-tree-popup");
            var proxy = this, queryPromise, queryManager;
            this.element.ejWaitingPopup("refresh");
            this.element.ejWaitingPopup("show");
            if (this.dataSource().ready != undefined) {
                this.dataSource().ready.done(function (e) {
                    proxy._initAfterDataSource(e);
                });
            } else {
                queryManager = this._columnToSelect(this.model.fields);
                queryPromise = this.dataSource().executeQuery(queryManager);
                queryPromise.done(function (e) {
                    proxy._initAfterDataSource(e);
                });
            }
        },

        _initAfterDataSource: function (e) {
            var proxy = this;
            proxy.element.ejWaitingPopup("hide");
            proxy.retriveData = (e.xhr && e.xhr.responseJSON && e.xhr.responseJSON.d) ? e.xhr.responseJSON.d : (e.result ? e.result : []);
            proxy._typeOfFieldId = proxy.retriveData[0] ? (typeof (ej.getObject(proxy.model.fields.id, proxy.retriveData[0]))).toLowerCase() : "";
            proxy._ensureDataSource(proxy.retriveData);
            proxy._newDataSource = JSON.parse(JSON.stringify(proxy.retriveData));
            proxy._initialize();
            if (!proxy.dataSource().dataSource.offline && (proxy.model.loadOnDemand || !ej.isNullOrUndefined(proxy.model.fields["child"]))) proxy._templateType = 2;
            if (proxy.model.loadOnDemand || ej.isNullOrUndefined(proxy.model.fields["child"])) {
                proxy._completeRendering();
            }
        },

        _columnToSelect: function (mapper) {
            var column = [], queryManager = ej.Query();
            if (!mapper.query && !ej.isNullOrUndefined(mapper.tableName)) {
                for (var col in mapper) {
                    if (col !== "tableName" && col !== "child" && col !== "dataSource" && mapper[col])
                        column.push(mapper[col]);
                }
                (column.length > 0) && queryManager.select(column);
                if (!this.dataSource().dataSource.url.match(mapper.tableName + "$"))
                    !ej.isNullOrUndefined(mapper.tableName) && queryManager.from(mapper.tableName);
            }
            else queryManager = (mapper.query) ? mapper.query.clone() : queryManager;
            return queryManager;
        },

        _ensureDataSource: function (dataSource) {
            dataSource = this._getSortAndFilterList(this.model.fields, dataSource);
            this.currentSelectedData = dataSource;
            this._renderTemplate(dataSource);
            (this.element.is("ul")) ? this.element.html(this._fragment.firstChild.children) : this.element.html(this._fragment);
        },

        _getTemplateType: function (ds, mapper) {
            for (var i = 0, len = ds.length; i < len; i++) {
                if (ej.getObject(mapper.parentId, ds[i]) !== undefined || ej.getObject(mapper.hasChild, ds[i]) !== undefined) return 1;
                if (ds[i].hasOwnProperty('child')) return 2;
            }
            return 1;
        },

        _groupingObjects: function (array, f) {
            var childs = {}, keys = [];
            for (var i = 0, len = array.length; i < len; i++) {
                var child = JSON.stringify(f(array[i]));
                childs[child] = childs[child] || [];
                childs[child].push(array[i]);
            }
            for (var i in childs)
                keys.push(childs[i]);
            return keys;
        },

        _renderTemplate: function (item) {
            this._onlineData = false, this._loadOnDemandNodes = false;
            var proxy = this;
            this._templateType = this._getTemplateType(item, this.model.fields);
            this._dataSource = (this._templateType == 1) ? this._groupingObjects(item, function (item) { return [!ej.isNullOrUndefined(item) && [ej.getObject(proxy.model.fields.parentId, item)].toString()]; }) : item;
            this._templateNodeCreation(item, this.model.fields);
        },

        _templateNodeCreation: function (data, mapper) {
            this._fragment = document.createDocumentFragment();
            var ulTag = document.createElement('ul'), fragment;
            this._fragment.appendChild(ulTag);
            fragment = this._fragment.firstChild;
            if (this._onlineData || this._loadOnDemandNodes) {
                fragment.className = "e-treeview-ul";
                fragment.setAttribute('role', "group");
                $(fragment).attr('style', 'display:none');
            }
            if (this.dataSource() != null) {
                for (var i = 0, objlen = data.length; i < objlen; i++) {
                    if (data[i]) {
                        var parentId = ej.getObject(this.model.fields.parentId, data[i]);
                        if (ej.isNullOrUndefined(parentId) || parentId == 0 || this._loadOnDemandNodes)
                            fragment.appendChild(this._genTemplate(data[i], mapper));
                    }
                }
                $(fragment).find('.e-item:first-child:not(:last-child)').addClass('first');
                $(fragment).find('.e-item:last-child').addClass('last');
            }
        },

        _onlineDataSource: function (childItems, id, mapper) {
            this._loadOnDemandNodes = true;
            this._templateNodeCreation(childItems, mapper);
            var element = this.element.find('.e-item#' + id);
            if (element[0] != null) {
                $(element[0]).append(this._fragment);
                element.children().find('> div:first').addClass("e-icon e-plus");
                this._finalizeLoadOnDemand(element);
            }
            this._onlineData = false;
        },

        _genTemplate: function (item, mapper) {
            var liFrag = document.createDocumentFragment(), liEle, liTag, imgTag, aTag, childItems;
            liTag = document.createElement('li');
            liFrag.appendChild(liTag);
            liEle = liFrag.firstChild;
            liEle.id = ej.getObject(mapper.id, item);
            if (!liEle.id)
                liEle.id = "";
            liEle.setAttribute('role', "treeitem");
            var htmlAttribute = ej.getObject(mapper.htmlAttribute, item);
            (htmlAttribute) && this._setAttributes(htmlAttribute, liEle);
            liEle.className += ' e-item';
            aTag = document.createElement('a');
            var imageURL = ej.getObject(mapper.imageUrl, item);
            var spriteCssClass = ej.getObject(mapper.spriteCssClass, item);
            if (imageURL) {
                imgTag = document.createElement('img');
                imgTag.className = "e-align";
                imgTag.src = imageURL;
                var imageAttribute = ej.getObject(mapper.imageAttribute, item);
                (imageAttribute) && this._setAttributes(imageAttribute, imgTag);
            }
            else if (spriteCssClass) {
                imgTag = document.createElement('span');
                imgTag.className = spriteCssClass;
            }
            if (this.model.template) {
                (imgTag) && aTag.appendChild(imgTag);
                if (typeof $.fn.render != "function") throw "Error : JsRender dependecy script missing";
                aTag.innerHTML += this._renderEjTemplate(this.model.template, item);
            }
            else {
                var mapperText = ej.getObject(mapper.text, item);
                (mapperText) ? $(aTag).text(mapperText) : $(aTag).text("undefined");
                (imgTag) && aTag.insertBefore(imgTag, aTag.lastChild);
            }
            var linkAttribute = ej.getObject(mapper.linkAttribute, item);
            (linkAttribute) && (typeof linkAttribute == "object" ? this._setAttributes(linkAttribute, aTag) : aTag.href = linkAttribute);
            liEle.appendChild(aTag);
            (ej.getObject(mapper.expanded, item)) && (liEle.className += ' expanded');
            (ej.getObject(mapper.selected, item)) && (liEle.className += ' selected');
            var isChecked = ej.getObject(mapper.isChecked, item);
            if (!ej.isNullOrUndefined(isChecked))
                liEle.className += (isChecked) ? ' checked' : ' unchecked';
            liEle.setAttribute('aria-selected', false);
            liEle.setAttribute('aria-expanded', false);
            if (this.dataSource() instanceof ej.DataManager) {
                this._updateElement(liEle, true);
                this.model.showCheckbox && this._checkboxOnTemplate(liEle.children[0]);
                if (!this.model.loadOnDemand) {
                    if (!ej.isNullOrUndefined(mapper["child"]) && mapper["child"]["dataSource"] instanceof ej.DataManager) {
                        var proxy = this, queryPromise, pid, id;
                        pid = (mapper["child"]["parentId"]) ? mapper["child"]["parentId"] : proxy.model.fields.parentId, id;
                        id = (mapper.id) ? mapper.id : this.model.fields.id;
                        this._treeList.push("false");
                        var itemID = ej.getObject(id, item);
                        queryPromise = this._executeDataQuery(mapper["child"], pid, (this._typeOfFieldId == "number" ? parseInt(itemID) : itemID));
                        queryPromise.done(function (e) {
                            proxy._treeList.pop();
                            childItems = (e.xhr && e.xhr.responseJSON && e.xhr.responseJSON.d) ? e.xhr.responseJSON.d : (e.result ? e.result : []);
                            childItems = proxy._getSortAndFilterList(mapper.child, childItems);
                            if (childItems && childItems.length > 0) {
                                proxy._onlineData = true;
                                var parentID = childItems[0][mapper["child"]["parentId"]];
                                proxy._updateRemoteData(proxy._newDataSource, parentID, childItems, proxy.model.fields);
                                proxy._onlineDataSource(childItems, parentID, mapper.child);
                            }
                            if (proxy._treeList.length == 0) {
                                proxy._completeRendering();
                            }
                        });
                    } else if (ej.isNullOrUndefined(this.model.fields["child"])) {
                        this._childNodeCreation(item, liEle, mapper);
                    }
                }
                else {
                    if (ej.getObject(mapper.hasChild, item) || item.hasOwnProperty('child'))
                        liEle.children[0].firstChild.className = "e-icon e-plus";
                }
            }
            else if (this.model.loadOnDemand) {
                this._updateElement(liEle, true);
                if (ej.getObject(mapper.hasChild, item) || item.hasOwnProperty('child'))
                    liEle.children[0].firstChild.className = "e-icon e-plus";
                this.model.showCheckbox && this._checkboxOnTemplate(liEle.children[0]);
                (ej.getObject(mapper.expanded, item)) && this._childNodeCreation(item, liEle, mapper);
                if (this.model.enablePersistence) {
                    var value, childObj;
                    value = this._getCookies("_childNodes");
                    if (value) {
                        childObj = JSON.parse(value);
                        for (var i = 0, objlen = childObj.length; i < objlen; i++) {
                            if (childObj[i].toString() == ej.getObject(mapper.id, item).toString()) {
                                this._childNodeCreation(item, liEle, mapper);
                                break;
                            }
                        }
                    }
                }
            }
            else if (!this._onlineData) {
                this._updateElement(liEle, true);
                this.model.showCheckbox && this._checkboxOnTemplate(liEle.children[0]);
                this._childNodeCreation(item, liEle, mapper);
            }
            return liEle;
        },

        _childNodeCreation: function (item, liEle, mapper) {
            var childItems, tempFrag, ul, tFrag;
            childItems = (this._templateType == 2) ? (!ej.isNullOrUndefined(item.child) && item.child.length > 0) && item.child : this._getChildNodes(this._dataSource, { id: ej.getObject(mapper.id, item) });
            if (!ej.isNullOrUndefined(childItems) && childItems.length > 0) {
                liEle.children[0].firstChild.className = "e-icon e-plus";
                tempFrag = document.createDocumentFragment();
                ul = document.createElement('ul');
                tempFrag.appendChild(ul);
                tFrag = tempFrag.firstChild;
                tFrag.className = "e-treeview-ul";
                tFrag.setAttribute('role', "group");
                $(tFrag).attr('style', 'display:none');
                for (var i = 0, objlen = childItems.length; i < objlen; i++)
                    (childItems[i]) && (ej.getObject(this.model.fields.parentId, [childItems[i]]) != 0) && tFrag.appendChild(this._genTemplate(childItems[i], mapper));
                liEle.appendChild(ul);
            }
        },

        _checkboxOnTemplate: function (element) {
            if (element.parentElement.id == "") {
                element.parentElement.id = this._id + "_" + this._indexID;
                this._indexID++;
            }
            var checkbox = document.createElement('input');
            checkbox.setAttribute('type', 'checkbox');
            checkbox.setAttribute('class', 'nodecheckbox');
            checkbox.setAttribute('name', this._id + "_Checkbox_" + element.parentElement.id);
            checkbox.setAttribute('value', element.parentElement.id);
            element.insertBefore(checkbox, element.children[1]);   // Checkbox to be inserted after the expand/collapse div            
        },

        _updateElement: function (liElement, subItem) {
            var outerdiv, exCollpasediv, linkElement, spanTag, node = liElement.firstChild, firstchild, nodeText, nText,textElement;
            if (node) {
                firstchild = node.nodeName;
                if (firstchild == 'SPAN' || firstchild == 'IMG') {
                    spanTag = node;
                    linkElement = liElement.lastChild;
                }
                else
                    linkElement = liElement.lastChild;
                if (linkElement) {
                    nText = (linkElement.lastChild != null) ? linkElement.lastChild.nodeValue : "";
                    nodeText = $.trim(linkElement.innerHTML);
                    textElement = $(linkElement).clone()[0];
                    $(linkElement).remove();
                    textElement.className += " e-text CanSelect";
                    textElement.innerHTML = nodeText;
                    liElement.innerHTML = '';
                }

                outerdiv = document.createElement('div');
                outerdiv.setAttribute('class', 'e-text-wrap');
                outerdiv.setAttribute('role', "presentation");
                if (subItem) {
                    exCollpasediv = document.createElement('div');
                    exCollpasediv.setAttribute('role', "presentation");
                    outerdiv.appendChild(exCollpasediv);
                }
                (spanTag) && outerdiv.appendChild(spanTag);
                outerdiv.appendChild(textElement);
                ($(liElement).prop('name') == undefined) && $(liElement).prop('name', $.trim(nText));
                liElement.appendChild(outerdiv);
                this._renderWholeRow($(liElement));
            }
        },

        _setAttributes: function (data, element) {
            for (var key in data) {
                $(element).attr(key, data[key]);
            }
        },

        _addDragableClass: function () {
            if (this.model.allowDragAndDrop) {
                this._anchors = this._liList.map(function () {
                    return $("a.e-text", this)[0];
                });
                this._anchors.addClass("e-draggable e-droppable");
                this._enableDragDrop();
                this._on(this.element, "mouseup touchstart pointerdown MSPointerDown", this._anchors, this._focusElement);
            }
        },

        _addBaseClass: function () {
            this._ulList.addClass("e-treeview-ul").attr("role", "group");
            this._liList.addClass("e-item").attr("role", "treeitem");
            if (!this.element.is("ul"))
                this.element.find("ul:first").removeClass("e-treeview-ul").addClass('e-ul');
        },

        _controlRender: function () {
            var element = this.element, licoll;
            if (element != null) {
                licoll = element.find('.e-item');
                for (var i = 0; i < licoll.length; i++) {
                    var listEl = $(licoll[i]), textElement, customElement, nodeText, subItems, linkElement, span, exCollpasediv, outerdiv;
                    subItems = listEl.children('ul.e-treeview-ul')[0];
                    if (subItems)
                        $(listEl.children('ul.e-treeview-ul')[0]).remove();
                    linkElement = listEl.children('a')[0];
                    if (linkElement) {
                        nodeText = $.trim($(linkElement).text());
                        textElement = $(linkElement).clone();
                        $(linkElement).remove();
                        customElement = listEl.clone();
                        $(textElement).prepend(customElement.children());
                        $(textElement).addClass('e-text CanSelect');
                        listEl.html('');
                    }
                    else {
                        nodeText = $.trim(this._getText(listEl));
                        customElement = listEl.clone();
                        listEl.html('');
                        textElement = ej.buildTag("a.e-text CanSelect", "", "", "");
                        textElement.append(customElement.children());
                        textElement[0].innerHTML += nodeText;
                    }
                    exCollpasediv = ej.buildTag('div', "", {}, { role: "presentation" });
                    outerdiv = ej.buildTag('div.e-text-wrap', "", {}, { role: "presentation" });
                    $(outerdiv).append(exCollpasediv).append(textElement);
                    listEl.prepend(outerdiv);
                    this._renderWholeRow(listEl);
                    if (subItems)
                        listEl.append(subItems);
                    (listEl.prop('name') == undefined) && listEl.prop('name', nodeText);
                    (this.model.showCheckbox) && this._checkboxOnTemplate(licoll[i].children[0]);
                }
                if (this.model.showCheckbox)
                    element.find(".nodecheckbox").ejCheckBox({ cssClass: this.model.cssClass, change: this._checkedChange });
            }
            var liCollection = element.find('.e-item'), acollection;
            liCollection.find('>ul').hide();
            acollection = liCollection.find('.e-text');
            acollection.focus(function () {
                $(this).blur();
            });
            liCollection.filter('.e-item:last-child').addClass('last');
            $(liCollection[0]).addClass('first');
            if ($(liCollection[0]).hasClass('first') && $(liCollection[0]).hasClass('last'))
                $(liCollection[0]).removeClass('first');
            $(liCollection.filter(':has(ul)')).each(function () {
                $(this).attr("aria-expanded", false).attr("aria-selected", false)
                var liHasul = $(this).children('ul:first');
                if ($(liHasul).is(':hidden')) {
                    $(this).find('> div > div:first').removeClass('e-icon e-minus').addClass('e-icon e-plus');
                }
                else {
                    $(this.childNodes[1]).removeClass('e-icon e-plus').addClass('e-icon e-minus');
                }
            });
        },

        _getText: function (element) {
            return $(element)
                      .clone()
                      .children()
                      .remove()
                      .end()
                      .text();
        },

        _expandNodes: function (indexColl, _isIdBase) {
            var len = indexColl.length, element = [], temp;
            for (var i = 0; i < len; i++) {
                element = _isIdBase ? this._getNodeByID(indexColl[i]) : $(this._liList[indexColl[i]]);
                if (ej.isNullOrUndefined(element)) continue;
                if (!this.model.enableMultipleExpand) {
                    var distinctEle = element.siblings().find(">div>.e-minus").closest(".e-item");
                    if (distinctEle.length > 0) continue;
                }
                if (this.isExpanded(element)) continue;
                if (this.model.loadOnDemand && !(this.dataSource() instanceof ej.DataManager))
                    this._createChildNodesWhenExpand(element);
                else
                    this._expandNode(element);
            }
        },

        _checkedNodes: function (indexColl) {
            var node;
            if (indexColl.length > 0) this._removeField(this._newDataSource, this.model.fields, "isChecked");
            for (var j = 0, len = indexColl.length; j < len; j++) {
                node = $(this._liList[indexColl[j]]);
                (node[0] != null) && this._nodeCheck(node.find("> div > .e-chkbox-wrap > .nodecheckbox:first")[0]);
            }
        },

        _finalize: function () {
            if (this.model.showCheckbox)
                this.element.find('.e-item > div .nodecheckbox').ejCheckBox({ cssClass: this.model.cssClass, change: this._checkedChange });
            this.model.allowEditing && this._allowEditable();
        },

        _finalizeNode: function () {
            this._isRender = false;
            this._allowOnDemand = true;
            var thisElement = this.element, cookieData = this._getCookies("_persistedValues"), idColl = [], id = 0, element = [], expandList, parsedData, temp;
            if (!(this.model.expandedNodes instanceof Array && this.model.expandedNodes.length > 0)) {
                expandList = thisElement.find("li.expanded"), len = expandList.length;
                for (var i = 0; i < len; i++) {
                    var expandEle = $(expandList[i]);
                    if (!this.model.enableMultipleExpand) {
                        var distinctEle = expandEle.siblings().find(">div>.e-minus").closest(".e-item");
                        if (distinctEle.length > 0) continue;
                    }
                    this._expandNode(expandEle);
                }
            }
            if (cookieData)
                parsedData = JSON.parse(cookieData), idColl = parsedData.expandedNodes, element = [];
            if (idColl && idColl.length > 0 && !ej.isNullOrUndefined(this.model.fields) && this.dataSource() != null) {
                for (var i = 0, len = idColl.length; i < len; i++) {
                    element = this.element.find('.e-item#' + idColl[i]);
                    if (element[0] != null) {
                        if (!this.model.enableMultipleExpand) {
                            var distinctEle = element.siblings().find(">div>.e-minus").closest(".e-item");
                            if (distinctEle.length > 0) continue;
                        }
                        if (this.model.loadOnDemand && !(this.dataSource() instanceof ej.DataManager))
                            this._createChildNodesWhenExpand(element);
                        else
                            this._expandNode(element);
                    }
                }
            } else {
                temp = JSON.parse(JSON.stringify(this.model.expandedNodes));
                this._expandNodes(temp);
            }
            if (this.model.showCheckbox) {
                if (cookieData)
                    parsedData = JSON.parse(cookieData), idColl = parsedData.checkedNodes, element = [];
                if (idColl && idColl.length > 0 && !ej.isNullOrUndefined(this.model.fields) && this.dataSource() != null) {
                    this._removeField(this._newDataSource, this.model.fields, "isChecked");
                    for (var i = 0, len = idColl.length; i < len; i++) {
                        element = this.element.find('.e-item#' + idColl[i]);
                        if (element[0] != null)
                            this._nodeCheck(element.find("> div > .e-chkbox-wrap > .nodecheckbox:first")[0]);
                    }
                } else {
                    temp = JSON.parse(JSON.stringify(this.model.checkedNodes));
                    this._checkedNodes(temp);
                }
            }
            if (!(this.model.checkedNodes instanceof Array && this.model.checkedNodes.length > 0))
                this.model.showCheckbox && this._isCheckedAction();
            var _isIdBase = false;
            if (cookieData) {
                parsedData = JSON.parse(cookieData), idColl = parsedData.selectedNodes;
                _isIdBase = true;
            }
            if (!cookieData || (idColl && idColl.length == 0)) {
                idColl = this.model.selectedNodes.length > 0 ? this.model.selectedNodes : (this.model.selectedNode == -1 ? [] : [this.model.selectedNode]);
                _isIdBase = false;
            }
            var data = { ctrlKey: true };
            if (idColl && idColl.length > 0)
                this._doSelectNodes(idColl, _isIdBase);
            else
                this._isSelectedAction(data);
            this._isRender = true;
            this._allowOnDemand = false;
            thisElement.find('.e-item.checked, .e-item.expanded, .e-item.selected').removeClass("checked expanded selected");
        },

        _doSelectNodes: function (idColl, _isIdBase) {
            var data = { ctrlKey: true };
            for (var i = 0, len = idColl.length; i < len; i++) {
                var element = _isIdBase ? this._getNodeByID(idColl[i]) : $(this._liList[idColl[i]]);
                if (element[0] != null)
                    this._nodeSelectionAction(element, data);
                if (!this.model.allowMultiSelection) break;
            }
        },

        _doUnselectNodes: function (idColl) {
            for (var i = 0, len = idColl.length; i < len; i++) {
                var element = this._getNodeByID(idColl[i]);
                if (element[0] != null)
                    this._nodeUnSelectionAction(element);
                if (!this.model.allowMultiSelection) break;
            }
        },

        _updateSelectedNode: function () {
            var node = $(this._liList).find('.e-text.e-active').closest('.e-item'), element = [];
            this.model.selectedNodes = [];
            if (!this.model.allowMultiSelection) this.model.selectedNode = null;
            if (node[0] == undefined || node.length <= 0) {
                this._persistValues(this.model.selectedNodes, "selectedNodes");
                return;
            }
            if (!this.model.allowMultiSelection) {
                this._isRender = false;
                this._nodeSelectionAction($(node[0]));
                this._isRender = true;
            }
            else {
                for (var i = 0, len = node.length; i < len; i++) {
                    var index = $(this._liList).index(node[i]);
                    this.model.selectedNodes.push(index);
                }
                this._persistValues(this.model.selectedNodes, "selectedNodes");
            }
        },

        _setCookies: function (name, value) {
            if (window.localStorage)
                window.localStorage.setItem(this._id + name, value);
            else if (document.cookie)
                ej.cookie.set(this._id + name, value);
        },

        _getCookies: function (name) {
            if (window.localStorage)
                return window.localStorage.getItem(this._id + name);
            else if (window.cookie)
                return ej.cookie.get(this._id + name);
        },

        _updateCheckedNodes: function () {
            var checkedList, chkdNodes = [];
            checkedList = this.element.find('.e-item > div > .e-chkbox-wrap > .nodecheckbox.checked').closest('.e-item');
            for (var chk = 0; chk < checkedList.length; chk++)
                chkdNodes.push($(this._liList).index(checkedList[chk]));
            (chkdNodes.length > 0 || checkedList.length == 0) && (this.model.checkedNodes = chkdNodes);
            (checkedList.length == 0) && this.model.checkedNodes.push(-1);
            this._persistValues(this.model.checkedNodes, "checkedNodes");
        },

        _updateExpandedNodes: function () {
            var expandedEle, expndedNodes = [];
            expandedEle = this.element.find('.e-item > div > .e-minus').closest('.e-item').addClass('e-collapse');
            for (var i = 0, objlen = expandedEle.length; i < objlen; i++)
                expndedNodes.push($(this._liList).index(expandedEle[i]));
            (expndedNodes.length > 0 || expandedEle.length == 0) && (this.model.expandedNodes = expndedNodes);
            (expandedEle.length == 0) && this.model.expandedNodes.push(-1);
            this._persistValues(this.model.expandedNodes, "expandedNodes");
        },

        _isCheckedAction: function () {
            var chk, checkedList = this.element.find('.e-item.checked');
            for (var chk = 0; chk < checkedList.length; chk++) {
                var _childItems = $(checkedList[chk]).find('.e-item');
                var _uncheckedItems = $(checkedList[chk]).find('.e-item.unchecked');
                if (_childItems.length == 0 || !(_childItems.length > 0 && _uncheckedItems.length == _childItems.length) || !this.model.autoCheck) {
                    this._nodeCheck($(checkedList[chk]).find("> div > .e-chkbox-wrap > input.nodecheckbox:first")[0]);
                    for (var i = 0; i < _uncheckedItems.length; i++)
                        this._nodeUncheck($(_uncheckedItems[i]).find("> div > .e-chkbox-wrap > .nodecheckbox:first")[0]);
                }
            }
            this.element.find('.e-item.checked, .e-item.unchecked').removeClass("checked unchecked");
        },

        _isExpandedAction: function (event) {
            var expandList = this.element.find("li.expanded"), len = expandList.length;
            for (var i = 0; i < len; i++) {
                var expandEle = $(expandList[i]);
                if (!this.model.enableMultipleExpand) {
                    var distinctEle = expandEle.siblings().find(" > div > .e-minus").closest(".e-item");
                    if (distinctEle.length > 0) continue;
                }
                this._expandNode(expandEle);
            }
            this.element.find('.e-item.expanded').removeClass("expanded");
        },

        _isSelectedAction: function (event) {
            var snode = this.element.find('.e-item.selected');
            for (var i = 0, len = snode.length; i < len; i++) {
                if (snode[i] != null)
                    this._nodeSelectionAction($(snode[i]), event);
                if (!this.model.allowMultiSelection) break;
            }
            this.element.find('.e-item.selected').removeClass("selected");
        },

        _checkedChange: function (args) {
            if (!args.isInteraction) return;
            var treeview = this.element.closest(".e-treeview.e-js").data("ejTreeView");
            var action = (args.isChecked) ? "_nodeCheck" : "_nodeUncheck";
            treeview[action]($(this.element)[0], args);
        },

        _doClickAnimation: function (event) {
            var element = $(event.target);
            if (element == undefined || event.type == undefined) return;
            element.addClass("e-animate");
            if (element.is('A') && element.hasClass('e-text')) element.closest(".e-text-wrap").addClass("e-animate");
        },

        _ClickEventHandler: function (event) {
            var proxy = this, parentLi, element = $(event.target), divTag = element.closest('.e-item').find("> div > div:first");
            this._isPopup = false;
            if (divTag && !divTag.hasClass("e-process")) {
                parentLi = element.closest('.e-item');
                if (!parentLi.hasClass('e-node-disable')) {
                    this.element.find(".e-animate").removeClass("e-animate");
                    this._doClickAnimation(event);
                    var _id = (parentLi[0] != null) ? parentLi[0].getAttribute('id') : "";
                    this._triggerEvent('nodeClick', { event: event, currentElement: element[0], id: _id, parentId: parentLi.closest('ul').closest('.e-item').attr('id') });
                    if (!ej.isNullOrUndefined(element) && element.is('DIV')) {
                        if (element.hasClass('e-plus') || element.hasClass('e-minus')) {
                            var expandUl = null, args, nodeDetails, isChildLoaded;
                            if (element.is('SPAN'))
                                element = element.parent('div').find('div:first');
                            expandUl = parentLi.children('ul:first');
                            isChildLoaded = this.isChildLoaded(parentLi);
                            if (!isChildLoaded && this.model.loadOnDemand) {
                                element.removeClass('e-plus').addClass("e-load");
                                this._checkboxChecked = element.parent().find('.nodecheckbox').hasClass('checked');
                                nodeDetails = this._getNodeDetails(parentLi);
                                args = { currentElement: parentLi, targetElement: element[0], id: nodeDetails.id, value: nodeDetails.text, parentId: nodeDetails.parentId, isChildLoaded: isChildLoaded, hasParent: true, async: true };
                                this._isEventTriggered = true;
                                if(this._triggerEvent('beforeExpand', args)) {
                                    return false;
                                }
                                this._loadOnDemand(args, element[0]);
                            }
                            else
                                (element.hasClass('e-plus')) ? this._expandNode(parentLi) : this._collapseNode(parentLi);
                        }
                        else if (this.model.fullRowSelect && (element.hasClass("e-fullrow") || element.hasClass("e-text-wrap"))) {
                            element = element.closest('.e-item').find("> .e-text-wrap .e-text");
                        }
                    }
                    (!element.is('A') && !element.hasClass('input-text')) && (element = element.closest('.e-text'));
                    if (!ej.isNullOrUndefined(element) && element.is('A') && element.hasClass('CanSelect')) {
                        if (event && event["pointerType"] == "touch" && this._customPop != null && this.model.allowMultiSelection) {
                            var $target = $(event.target);
                            if (!this._customPop.is(":visible"))
                                this._customPop.show();
                            if (this._customPop.is(":visible") && !this._customPop.find(".e-rowselect").hasClass("e-spanclicked")) {
                                var offset = $target.offset();
                                this._customPop.offset({ left: offset.left, top: offset.top - 40 });
                            }
                            else
                                event.ctrlKey = true;
                        }
                        else
                            this._hidePopup();
                        element.hasClass('e-active') ? (this.model.allowMultiSelection && this._nodeUnSelectionAction(element.closest('.e-item'), event)) : this._nodeSelectionAction(element.closest('.e-item'), event);
                    }
                }
            }
        },

        _getChildTables: function (mapper, parentLen, currentLen) {
            if (!ej.isNullOrUndefined(mapper.child))
                return (parentLen == currentLen) ? mapper.child : this._getChildTables(mapper.child, parentLen, currentLen + 1);
        },

        _loadOnDemand: function (args) {
            var childItems, parent, mapper, proxy = this, queryPromise;
            if (this.dataSource() instanceof ej.DataManager) {
                parent = args.currentElement.parents('ul.e-treeview-ul').length;
                mapper = this._getChildTables(proxy.model.fields, parent, 1);
                if (ej.isNullOrUndefined(mapper) && ej.isNullOrUndefined(this.model.fields["child"]))
                    mapper = this.model.fields;
                if (!mapper) {
                    $(args.targetElement).hasClass('e-load') && $(args.targetElement).removeClass(($(args.targetElement).hasClass('e-plus') || $(args.targetElement).hasClass('e-minus')) ? 'e-load' : 'e-icon e-load');
                    return;
                }
                queryPromise = this._executeDataQuery(mapper, mapper["parentId"], (this._typeOfFieldId == "number" ? parseInt(args.currentElement[0].id) : args.currentElement[0].id));
                queryPromise.done(function (e) {
                    childItems = (e.xhr && e.xhr.responseJSON && e.xhr.responseJSON.d) ? e.xhr.responseJSON.d : (e.result ? e.result : []);
                    childItems = proxy._getSortAndFilterList(mapper, childItems);
                    if (childItems.length > 0) {
                        proxy._onlineData = true;
                        var parentID = ej.getObject(mapper["parentId"], childItems[0]);
                        proxy._updateRemoteData(proxy._newDataSource, parentID, childItems, proxy.model.fields);
                        proxy._loadChildNodeWhenOnDemand(childItems, args, mapper);
                    } else
                        $(args.targetElement).hasClass('e-load') && $(args.targetElement).removeClass(($(args.targetElement).hasClass('e-plus') || $(args.targetElement).hasClass('e-minus')) ? 'e-load' : 'e-icon e-load');
                });
            }
            else {
                childItems = this._getChildNodes(this._dataSource, args);
                if (!ej.isNullOrUndefined(childItems) && childItems.length > 0) {
                    setTimeout(function () {
                        proxy._createSubNodesWhenLoadOnDemand(childItems, args.targetElement, proxy.model.fields);
                    }, 400);
                }
                else
                    $(args.targetElement).hasClass('e-load') && $(args.targetElement).removeClass(($(args.targetElement).hasClass('e-plus') || $(args.targetElement).hasClass('e-minus')) ? 'e-load' : 'e-icon e-load');
            }
        },

        _loadChildNodeWhenOnDemand: function (childItems, args, mapper) {
            var proxy = this;
            !ej.isNullOrUndefined(childItems) && childItems.length > 0 && setTimeout(function () {
                proxy._createSubNodesWhenLoadOnDemand(childItems, args.targetElement, mapper);
            }, 100);
        },

        _createSubNodesWhenLoadOnDemand: function (childItems, element, mapper) {
            this._loadOnDemandNodes = true;
            this._templateNodeCreation(childItems, mapper);
            $(this._fragment.firstChild).attr('style', 'display:none');
            this._fragment.firstChild.className = "e-treeview-ul";
            this._fragment.firstChild.setAttribute('role', "group");
            element.parentNode.parentNode.appendChild(this._fragment);
            var liElement = $(element).closest('.e-item');
            liElement.attr({ 'aria-expanded': false, 'aria-expanded': true });
            $(element).removeClass("e-load").addClass('e-plus');
            this._expandNode(liElement);
            this._finalizeLoadOnDemand(liElement);
        },

        _finalizeLoadOnDemand: function (element) {
            this._beforeBaseClass();
            this._isRender = false;
            if (this.model.showCheckbox) {
                element.children('ul').find('li > div > input.nodecheckbox').ejCheckBox({ cssClass: this.model.cssClass, change: this._checkedChange });
                var _childItems = element.children('ul').find('.e-item');
                var _uncheckedItems = element.children('ul').find('.e-item.unchecked');
                if (_uncheckedItems.length >= 0 && _uncheckedItems.length != _childItems.length && this._checkboxChecked && this.model.autoCheck)
                    _childItems.not(".unchecked").addClass('checked');
                else if (_uncheckedItems.length == _childItems.length && this.isNodeChecked(element))
                    this._nodeUncheck(element.find("> div > .e-chkbox-wrap > .nodecheckbox:first")[0]);
                if (this._isLoaded) {
                    this._isCheckedAction();
                    this._updateCheckedNodes();
                }
            }
            this._isRender = true;
            this._addDragableClass();
            this._preventEditable();
            this.model.allowEditing && this._allowEditable();
            if (this._isLoaded) {
                this._isSelectedAction();
                this._updateSelectedNode();
                this._allowOnDemand = true;
                this._isExpandedAction();
                this._updateExpandedNodes();
                this._allowOnDemand = false;
            }
            if (this.model.loadOnDemand && this.model.enablePersistence && !(this.dataSource() instanceof ej.DataManager)) {
                var obj, value = this._getCookies("_childNodes");
                if (value) obj = JSON.parse(value);
                (!ej.isNullOrUndefined(obj) && obj.indexOf(element[0].id) == -1) ? obj.push(element[0].id) : obj = [element[0].id];
                this._setCookies("_childNodes", JSON.stringify(obj));
            }
        },

        _getChildNodes: function (obj, rootNodes) {
            var childNodes = [];
            if (this._templateType == 1) {
                for (var i = 0, objlen = obj.length; i < objlen; i++) {
                    var parentId = ej.getObject(this.model.fields.parentId, obj[i][0]);
                    if (!ej.isNullOrUndefined(obj[i][0]) && !ej.isNullOrUndefined(parentId) && parentId != 0 && parentId == rootNodes.id)
                        return obj[i];
                }
            }
            else {
                for (var i = 0, objlen = obj.length; i < objlen; i++) {
                    if (ej.getObject(this.model.fields.id, obj[i]) == rootNodes.id && ej.getObject(this.model.fields.parentId, obj[i]) != 0)
                        return obj[i].child;
                    if (obj[i].hasOwnProperty('child')) {
                        childNodes = this._getChildNodes(obj[i].child, rootNodes);
                        if (!ej.isNullOrUndefined(childNodes) && childNodes.length > 0)
                            break;
                    }
                }
                return childNodes;
            }
        },

        _getPath: function (element) {
            var path = element.prop('name'), liEle;
            var liEle = element.parents('.e-item:first');
            while (liEle[0] != null && liEle[0].parentNode.id != this._id) {
                path = liEle.prop('name') + '/' + path;
                liEle = liEle.parents('.e-item:first');
            }
            path = this._id + "/" + path;
            return path;
        },

        _nodeSelectionAction: function (liElement, event) {
            if (liElement[0] == null && liElement.length == 0) return;
            var nodeDetails, data, angElement = $(liElement.find('> div > .e-text')[0]), _isSelected = false, _oldSelectedNodes = this.model.selectedNodes.slice();
            var index = this._liList.index(liElement[0]);
            this._currNode = liElement;
            if (this._triggerEvent('beforeSelect', { target: liElement, nodeDetails: this._getNodeDetails(liElement) })) return;
            if (!this.model.allowMultiSelection || !event || (event && !event.ctrlKey)) {
                this.element.find('a.e-text.e-active').removeClass('e-node-focus e-active');
                this.element.find('[aria-selected=true]').attr("aria-selected", false);
                this.element.find('.e-li-active').removeClass('e-li-active');
                if (this.model.fullRowSelect) {
                    this.element.find('.e-li-focus').removeClass('e-li-focus');
                    this.element.find('.e-node-focus').removeClass('e-node-focus');
                }
                this.element.find("#" + this._id + "_active").removeAttr("id");
                this.model.selectedNodes = [];
                this._deepWatch && this._removeField(this._newDataSource, this.model.fields, "selected");
            }
            if (this.model.allowMultiSelection && event && event.shiftKey) {
                if (!this._startNode)
                    this._startNode = this._currNode;
                var nodes = this.getVisibleNodes();
                var startIndex = nodes.index(this._startNode);
                var endIndex = nodes.index(liElement[0]);
                if (startIndex > endIndex) {
                    var temp = startIndex;
                    startIndex = endIndex;
                    endIndex = temp;
                }
                for (var i = startIndex ; i <= endIndex; i++) {
                    var _currLi = $(nodes.get(i));
                    var _currIndex = this._liList.index(_currLi[0]);
                    if ($.inArray(_currIndex, this.model.selectedNodes) == -1) {
                        this.model.selectedNodes.push(_currIndex);
                        var _currAng = _currLi.find('> div > a.e-text');
                        _currAng.removeClass('e-node-focus');
                        _currLi.attr("aria-selected", true);
                        _currLi.addClass('e-li-active');
                        _currAng.addClass('e-active');
                        _isSelected = true;
                        this._deepWatch && this._updateField(this._newDataSource, _currLi.attr('id'), this.model.fields, "selected", true);
                    }
                }
            }
            else
                this._startNode = liElement;
            if (!this.model.allowMultiSelection) this.model.selectedNode = index;
            if (!_isSelected) {
                this.element.find('a.e-text.e-node-focus').removeClass('e-node-focus');
                liElement.attr("aria-selected", true);
                liElement.addClass('e-li-active');
                angElement.addClass('e-active');
                if (!this.model.allowMultiSelection) angElement.attr("id", this._id + "_active");
                if ($.inArray(index, this.model.selectedNodes) == -1)
                    this.model.selectedNodes.push(index);
                this._deepWatch && this._updateField(this._newDataSource, liElement.attr('id'), this.model.fields, "selected", true);
            }
            if (this.model.enablePersistence)
                this._persistValues(this.model.selectedNodes, "selectedNodes");
            if (this._deepWatch) {
                this._oldDataSource = JSON.parse(JSON.stringify(this._newDataSource));
                this.dataSource(this._newDataSource);
            }
            this._triggerGivenEvent('nodeSelect', liElement);
        },

        _nodeUnSelectionAction: function (liElement, event) {
            if (this.model.allowMultiSelection && event && !event.ctrlKey) {
                this._nodeSelectionAction(liElement, event);
                return;
            }
            liElement.removeClass('e-li-active');
            liElement.attr("aria-selected", false).find('> div > .e-text').removeClass('e-active').attr("id", "");
            this._updateUnselectModel(liElement[0]);
            if (this._deepWatch) {
                this._updateField(this._newDataSource, liElement.attr('id'), this.model.fields, "selected", false);
                this._oldDataSource = JSON.parse(JSON.stringify(this._newDataSource));
                this.dataSource(this._newDataSource);
            }
            this._triggerGivenEvent('nodeUnselect', liElement);
        },

        _updateUnselectModel: function (liElement) {
            var index = this._liList.index(liElement), _nodes = this.model.selectedNodes;
            if (!this.model.allowMultiSelection) this.model.selectedNode = null;
            var arrIndex = $.inArray(index, _nodes);
            if (arrIndex > -1) {
                this.model.selectedNodes.splice(arrIndex, 1);
            }
            this._persistValues(this.model.selectedNodes, "selectedNodes");
        },

        _triggerGivenEvent: function (event, element) {
            if (this._isRender) {
                var data = { currentElement: element, value: element.find('> div > a.e-text').eq(0).text(), id: element[0].getAttribute('id'), parentId: element.closest('ul').closest('.e-item').attr('id'), selectedNodes: this.model.selectedNodes };
                this._triggerEvent(event, data);
            }
        },

        _getNodesIndex: function (cnodes) {
            var cindex = [];
            for (var i = 0, len = cnodes.length; i < len; i++)
                cindex.push(this._liList.index(cnodes[i]));
            return cindex;
        },

        _nodeEnableAction: function (liElement) {
            var parent = this.getParent(liElement);
            if (parent[0] != null && parent.hasClass('e-node-disable')) return;
            if (this.model.showCheckbox)
                liElement.find('div > .e-chkbox-wrap > .nodecheckbox').ejCheckBox('enable').prop('disabled', false);
            liElement.find('.e-text').removeClass('e-node-disable')
                     .closest('.e-item')
                     .removeClass('e-node-disable')
                     .removeProp("disabled");
        },

        _nodeDisableAction: function (liElement) {
            this._collapseNode(liElement);
            if (this.model.showCheckbox)
                liElement.find('div > .e-chkbox-wrap > .nodecheckbox').ejCheckBox('disable').prop('disabled', true);
            var snodes = liElement.find(".e-text.e-active").closest(".e-item");
            liElement.find('.e-text').addClass('e-node-disable')
                     .removeClass('e-active')
                     .attr("id", "")
                     .closest('.e-item')
                     .addClass('e-node-disable')
                     .prop('disabled', true);
            for (var i = 0, len = snodes.length; i < len; i++)
                this._updateUnselectModel(snodes[i]);
        },

        _getNodeDetails: function (liElement) {
            if (liElement[0] != null && liElement.is('LI') && liElement.hasClass('e-item')) {
                var id, text, pid, level, childs, expanded, checked, selected, index;
                id = liElement[0].getAttribute('id');
                text = liElement.children('div').find('.e-text:first').text();
                if(this.model.template != null){ text = this.getTreeData(id)["0"][this.model.fields.text]; }
                pid = liElement.closest('ul').closest('.e-item').attr('id');
				level = liElement.parents('ul').length;
                childs = liElement.find('.e-item').length;
                expanded = this._isNodeExpanded(liElement);
                checked = this._isChecked(liElement);
                selected = liElement.find('> div > .e-text').hasClass('e-active');
                index = this._liList.index(liElement);
                return { id: id, text: text, parentId: (pid) ? pid : "", level: level, count: childs, expanded: expanded, checked: checked, selected: selected, index: index };
            } else {
                return { id: "", text: "", parentId: "", level: "", count: "", expanded: "", checked: "", selected: "", index: "" };
            }
        },

        _denyMultipleExpand: function (liElement) {
            var distinctEle = liElement.siblings().find(">div>.e-minus").closest(".e-item");
            for (var i = 0, len = distinctEle.length; i < len; i++) {
                this._collapseNode($(distinctEle[i]));
            }
        },

        _expandCollapseAction: function (element) {
            if (element && !element.hasClass("e-process")) {
                var expandUl, proxy = this, parentLi, nodeDetails, data, isChildLoaded;
                parentLi = element.closest('.e-item');
                if (element.is('SPAN'))
                    element = $(element).parent('div').find('div:first');
                expandUl = parentLi.children('ul:first');
                if (expandUl.find('> .e-item').length > 0) {
                    this.model.enableAnimation && element.addClass("e-process");
                    nodeDetails = this._getNodeDetails(parentLi);
                    isChildLoaded = this.isChildLoaded(parentLi);
                    data = { currentElement: parentLi, value: nodeDetails.text, isChildLoaded: isChildLoaded, id: nodeDetails.id, parentId: nodeDetails.parentId, async: false };
                    if (!this._isNodeExpanded(parentLi) && isChildLoaded) {
                        if (!this._isEventTriggered)
                            if (this._triggerEvent('beforeExpand', data)) return false;
                        this._isEventTriggered = false;
                        parentLi.attr("aria-expanded", true);
                        this._addExpandedNodes(this._liList.index(parentLi));
                        $(element).removeClass('e-icon e-plus').addClass('e-icon e-minus');
                        parentLi.addClass('e-collapse');
                        this._deepWatch && this._updateField(this._newDataSource, nodeDetails.id, this.model.fields, "expanded", true);
                        this._doAnimation(expandUl, element, "nodeExpand", data, 350);
                    }
                    else {
                        this.element.find(".e-material-animate").removeClass("e-material-animate");
                        parentLi.attr("aria-expanded", false);
                        if (this._triggerEvent('beforeCollapse', data) === true)
                            return false;
                        this._removeExpandedNodes(this._liList.index(data.currentElement));
                        $(element).removeClass('e-icon e-minus').addClass('e-icon e-plus');
                        parentLi.removeClass('e-collapse');
                        this._deepWatch && this._updateField(this._newDataSource, nodeDetails.id, this.model.fields, "expanded", false);
                        this._doAnimation(expandUl, element, "nodeCollapse", data, 200);
                    }
                    if (this._deepWatch) {
                        this._oldDataSource = JSON.parse(JSON.stringify(this._newDataSource));
						this.dataSource(this._newDataSource);
                    }
                }
            }
        },

        _doAnimation: function (expandUl, element, event, data, animationSpeed) {
            var proxy = this;
            if (this.model.enableAnimation) {
                expandUl.animate({ height: 'toggle' }, animationSpeed, 'linear', function () {
                    if (ej.isNullOrUndefined(proxy.model)) return;
                    proxy._doAnimateAction(element, event, data);
                });
            }
            else {
                expandUl.css("display", animationSpeed == 200 ? "none" : "block");
                this._doAnimateAction(element, event, data);
            }
        },

        _doAnimateAction: function (element, event, data) {
            element.removeClass("e-process");
            this._triggerEvent(event, data);
        },

        _isChecked: function (liElement) {
            return (liElement.find("> div > .e-chkbox-wrap:first").attr("aria-checked") === 'true') ? true : false;
        },

        _doRecursiveCheck: function (parentLi, checkedArray) {
            var chkWrapper, chkEle, liElement, textvalue, parentLi, childUl;
            childUl = this._getChildUl(parentLi);
            chkWrapper = (childUl) ? childUl.querySelectorAll('.e-chkbox-wrap[aria-checked="true"]').length : 0;
            var allChkEle = (childUl) ? childUl.querySelectorAll('.e-item > div > .e-chkbox-wrap > .nodecheckbox') : [];
            chkEle = parentLi.firstChild.querySelector('.nodecheckbox');
            if (chkEle && chkEle.nodeName.toUpperCase() == 'INPUT') {
                var chkboxObj = $(chkEle).data('ejCheckBox');
                if (chkWrapper == allChkEle.length || this.model.autoCheckParentNode) {
                    chkboxObj.setModel({ enableTriState: false, checked: true });
                    chkEle.className += " checked";
                    textvalue = parentLi.firstChild.getElementsByTagName('a')[0].innerHTML;
                    checkedArray.push({ id: parentLi.id, text: textvalue });
                    if (this._deepWatch && !this.model.autoCheckParentNode) this._updateField(this._newDataSource, parentLi.id, this.model.fields, "isChecked", true);
                    this._addHiddenInputElement(chkEle, textvalue);
                    this._addCheckNodes(this._liList.index(parentLi));
                } else
                    chkboxObj.setModel({ enableTriState: true, checkState: "indeterminate" });
                parentLi = parentLi.parentNode.parentNode;
                if (parentLi.nodeName.toUpperCase() == 'LI')
                    this._doRecursiveCheck(parentLi, checkedArray);
            }
        },

        _nodeCheck: function (chkEle, args) {
            if ($(chkEle)[0] == null) return;
            this._CurrenctSelectedNodes = [];
            this._checkedArray = [];
            var chkObj, currentLi, textvalue, chkCollection, chklen, parentLi;
            chkEle.className += " checked";
            chkObj = $(chkEle).data('ejCheckBox');
            if (chkObj) {
                chkObj.setModel({ enableTriState: false, checked: true });
                currentLi = chkEle.parentNode.parentNode.parentNode;
                textvalue = currentLi.firstChild.getElementsByTagName('a')[0].lastChild.nodeValue;
                this._checkedArray.push({ id: currentLi.id, text: textvalue });
                this._deepWatch && this._updateField(this._newDataSource, currentLi.id, this.model.fields, "isChecked", true);
                this._addHiddenInputElement(chkEle, textvalue);
                this._addCheckNodes(this._liList.index(currentLi));
                if (this.model.autoCheck) {
                    var allChkEle, liElement, childUl;
                    childUl = this._getChildUl(currentLi);
                    allChkEle = (childUl) ? childUl.querySelectorAll('.e-item > div > .e-chkbox-wrap > .nodecheckbox') : [];
                    for (var i = 0, chklen = allChkEle.length; i < chklen; i++) {
                        $(allChkEle[i]).ejCheckBox({ checked: true, enableTriState: false })[0].className += " checked";
                        liElement = allChkEle[i].parentNode.parentNode.parentNode;
                        textvalue = liElement.firstChild.getElementsByTagName('a')[0].lastChild.nodeValue;
                        this._checkedArray.push({ id: liElement.id, text: textvalue });
                        this._deepWatch && this._updateField(this._newDataSource, liElement.id, this.model.fields, "isChecked", true);
                        this._addHiddenInputElement(allChkEle[i], textvalue);
                        this._addCheckNodes(this._liList.index(liElement));
                    }
                    parentLi = currentLi.parentNode.parentNode;
                    if (parentLi.nodeName.toUpperCase() == 'LI')
                        this._doRecursiveCheck(parentLi, this._checkedArray);
                }
                (args) && (args.checknode = this._checkedArray);
                this._onChecked($(chkEle), args);
            }
            if (this._deepWatch) {
                this._oldDataSource = JSON.parse(JSON.stringify(this._newDataSource));
				this.dataSource(this._newDataSource);
            }
            this._persistValues(this.model.checkedNodes, "checkedNodes");
        },

        _addHiddenInputElement: function (checkedElement, textVal) {
            if (checkedElement.firstChild == null) {
                var hiddenElement = document.createElement('input');
                hiddenElement.setAttribute("type", "hidden");
                hiddenElement.setAttribute("name", this._id + "_Checkbox_" + checkedElement.value + ".Text");
                hiddenElement.setAttribute("value", textVal);
                try {
                    checkedElement.appendChild(hiddenElement);
                }
                catch (err) { }
            }
        },

        _doRecursiveUncheck: function (parentLi, uncheckedArray) {
            var chkWrapper, chkEle, liElement, textvalue, parentLi, childUl;
            childUl = this._getChildUl(parentLi);
            chkWrapper = (childUl) ? childUl.querySelectorAll('.e-chkbox-wrap[aria-checked="true"]').length : 0;
            var allChkEle = (childUl) ? childUl.querySelectorAll('.e-item > div > .e-chkbox-wrap > .nodecheckbox') : [];
            chkEle = parentLi.firstChild.querySelector('.nodecheckbox');
            if (chkEle && chkEle.nodeName.toUpperCase() == 'INPUT') {
                var chkboxObj = $(chkEle).data('ejCheckBox');
                if (chkWrapper <= 0) {
                    chkboxObj.setModel({ enableTriState: false, checked: false });
                    $(chkEle).removeClass("checked").removeClass('checked').children().remove();
                    textvalue = parentLi.firstChild.getElementsByTagName('a')[0].innerHTML;
                    this._removeCheckNodes(this._liList.index(parentLi));
                    uncheckedArray.push({ id: parentLi.id, text: textvalue });
                    this._deepWatch && this._updateField(this._newDataSource, parentLi.id, this.model.fields, "isChecked", false);
                }
                if (chkWrapper > 0 && this.model.autoCheckParentNode) {
                    chkboxObj.setModel({ checked: true });
                    chkEle.className += " checked";
                    textvalue = parentLi.firstChild.getElementsByTagName('a')[0].innerHTML;
                    this._addHiddenInputElement(parentLi, textvalue);
                    this._deepWatch && this._updateField(this._newDataSource, parentLi.id, this.model.fields, "isChecked", false);
                }
                else if (chkWrapper > 0 && !this.model.autoCheckParentNode) {
                    if (allChkEle.length > 1)
                        chkboxObj.setModel({ enableTriState: true, checkState: "indeterminate" });
                    else
                        chkboxObj.setModel({ checked: false });
                    $(chkEle).removeClass("checked").removeClass('checked').children().remove();
                    this._removeCheckNodes(this._liList.index(parentLi));
                    this._deepWatch && this._updateField(this._newDataSource, parentLi.id, this.model.fields, "isChecked", false);
                }
                parentLi = parentLi.parentNode.parentNode;
                if (parentLi.nodeName.toUpperCase() == 'LI')
                    this._doRecursiveUncheck(parentLi, uncheckedArray);
            }
        },

        _nodeUncheck: function (chkEle, args) {
            if ($(chkEle)[0] == null) return;
            var proxy = this; this._uncheckedArray = [];
            var currentLi = chkEle.parentNode.parentNode.parentNode;
            $(currentLi).find('div > .e-chkbox-wrap > .nodecheckbox').removeClass('checked').children().remove();
            var chkObj = $(chkEle).data('ejCheckBox');
            this._removeCheckNodes(this._liList.index(currentLi));
            if (chkObj) {
                chkObj.setModel({ enableTriState: false, checked: false });
                var textvalue = currentLi.firstChild.getElementsByTagName('a')[0].lastChild.nodeValue;
                this._uncheckedArray.push({ id: currentLi.id, text: textvalue });
                this._deepWatch && this._updateField(this._newDataSource, currentLi.id, this.model.fields, "isChecked", false);
                if (this.model.autoCheck) {
                    var childUl = this._getChildUl(currentLi);
                    var allChkEle = (childUl) ? childUl.querySelectorAll('.e-item > div > .e-chkbox-wrap > .nodecheckbox') : [];
                    for (var i = 0, chklen = allChkEle.length; i < chklen; i++) {
                        $(allChkEle[i]).ejCheckBox({ enableTriState: false, checked: false });
                        var liElement = allChkEle[i].parentNode.parentNode.parentNode;
                        textvalue = liElement.firstChild.getElementsByTagName('a')[0].lastChild.nodeValue;
                        this._uncheckedArray.push({ id: liElement.id, text: textvalue });
                        this._deepWatch && this._updateField(this._newDataSource, liElement.id, this.model.fields, "isChecked", false);
                        this._removeCheckNodes(this._liList.index(liElement));
                    }
                    var parentLi = currentLi.parentNode.parentNode;
                    if (parentLi.nodeName.toUpperCase() == 'LI')
                        this._doRecursiveUncheck(parentLi, this._uncheckedArray);
                }
                (args) && (args.unchecknode = this._uncheckedArray);
                this._onUnChecked($(chkEle), args);
            }
            if (this._deepWatch) {
                this._oldDataSource = JSON.parse(JSON.stringify(this._newDataSource));
				this.dataSource(this._newDataSource);
            }
            this._persistValues(this.model.checkedNodes, "checkedNodes");
        },

        _executeDataQuery: function(mapper, key, val) {
            var queryManager, queryPromise;
            queryManager = ej.Query();
            queryManager = this._columnToSelect(mapper);
            if (!ej.isNullOrUndefined(key) && key != "") {
                var tempQuery=$.extend(true,[],queryManager._params);
                queryManager._params = [];
                queryManager.addParams(key, val);
                for (var i = 0; i < tempQuery.length; i++)
                    (tempQuery[i].key != key) && queryManager.addParams(tempQuery[i].key, tempQuery[i].value);
                queryManager.where(key, ej.FilterOperators.equal, val);
            }
            queryPromise = mapper["dataSource"].executeQuery(queryManager);
            return queryPromise;
        },

        _createChildNodesWhenExpand: function (parentLi, expandChild, level, excludeHiddenNodes, outerLi, thisObj) {
            var nodeid, nodeText, args, element;
            if (parentLi.length > 0 && parentLi.find('ul .e-item').length == 0) {
                nodeid = parentLi.attr('id');
                nodeText = parentLi.children('div').find('.e-text:first').text();
                element = parentLi.children('div').find('div.e-plus:first');
                args = { currentElement: parentLi, targetElement: element[0], id: nodeid, value: nodeText, isChildLoaded: false, hasParent: true, async: false };
                var childItems, parent, mapper, proxy = this, queryPromise;
                this._isEventTriggered = true;
                if (this._triggerEvent('beforeExpand', args)) {
                    return false;
                }
                if (this.dataSource() instanceof ej.DataManager) {
                    parent = args.currentElement.parents('ul.e-treeview-ul').length;
                    mapper = this._getChildTables(this.model.fields, parent, 1);
                    if (ej.isNullOrUndefined(mapper) && ej.isNullOrUndefined(this.model.fields["child"]))
                        mapper = this.model.fields;
                    if (!mapper) {
                        $(args.targetElement).hasClass('e-load') && $(args.targetElement).removeClass(($(args.targetElement).hasClass('e-plus') || $(args.targetElement).hasClass('e-minus')) ? 'e-load' : 'e-icon e-load');
                        return;
                    }
                    (mapper.query && mapper.query.queries.length > 0) && (mapper.query.queries = []);
                    this._treeList.push("false");
                    queryPromise = this._executeDataQuery(mapper, mapper["parentId"], (this._typeOfFieldId == "number" ? parseInt(args.currentElement[0].id) : args.currentElement[0].id));
                    queryPromise.done(function (e) {
                        proxy._treeList.pop();
                        childItems = (e.xhr && e.xhr.responseJSON && e.xhr.responseJSON.d) ? e.xhr.responseJSON.d : (e.result ? e.result : []);
                        childItems = proxy._getSortAndFilterList(mapper, childItems);
                        if (childItems.length > 0) {
                            var parentID = ej.getObject(mapper["parentId"], childItems[0]);
                            proxy._updateRemoteData(proxy._newDataSource, parentID, childItems, proxy.model.fields);
                        }
                        proxy._appendChild(childItems, parentLi, mapper, expandChild, level, excludeHiddenNodes);
                        level && proxy._expandByLevel(parentLi.find('> ul'), level - 1, excludeHiddenNodes);
                        if (proxy._treeList.length == 0) {
                            outerLi && proxy._doAfterExpand(parentLi, outerLi, thisObj);
                            proxy._completeRendering();
                        }
                        if (proxy._parentLevelDropChecking.find('ul .e-item').length == 0) {
                            $(proxy._parentLevelDropChecking).find('> div > .e-icon').remove();
                        }
                    });
                }
                else {
                    var childItems = this._getChildNodes(this._dataSource, { id: parentLi[0].id });
                    this._appendChild(childItems, parentLi, this.model.fields, expandChild, level, excludeHiddenNodes);
                }
            }
            else
                this._expandNode(parentLi);
        },

        _appendChild: function (childItems, parentLi, mapper, expandChild, level, excludeHiddenNodes) {
            if (!ej.isNullOrUndefined(childItems) && childItems.length > 0) {
                this._checkboxChecked = parentLi.find('> div > .e-chkbox-wrap > .nodecheckbox').hasClass('checked');
                this._loadOnDemandNodes = true;
                if (parentLi.find('ul .e-item').length == 0) {
                    this._templateNodeCreation(childItems, mapper);
                    parentLi.append(this._fragment);
                }
                this._finalizeLoadOnDemand(parentLi);
                this._expandNode(parentLi);
                if (expandChild && !level && !excludeHiddenNodes) {
                    var _items = parentLi.find(".e-item > div > .e-plus").closest(".e-item");
                    for (var i = 0, len = _items.length; i < len; i++)
                        this._createChildNodesWhenExpand($(_items[i]), true, null, excludeHiddenNodes);
                }
            }
            else if (expandChild)
                parentLi.find("> div > .e-plus").removeClass('e-plus e-icon');
        },

        _getSortAndFilterList: function (mapper, list) {
            var dataSource;
            if (!list || !list.length || list.length < 1) dataSource = [];
            else if (!this.model.sortSettings.allowSorting) {
                dataSource = list;
            }
            else {
                var tempQuery = ej.Query();
                this._addSortingQuery(tempQuery, mapper);
                dataSource = ej.DataManager(list).executeLocal(tempQuery);
            }
            return dataSource;
        },

        _addSortingQuery: function (query, mapper) {
            var key = (mapper && mapper.text) ? mapper["text"] : "text";
            var order = (this.model.sortSettings.sortOrder == ej.sortOrder.Descending) ? true : false;
            query.sortBy(key, order);
        },

        _expandNode: function (liElement) {
            if (liElement[0] != null && liElement.length > 0) {
                var expandIcon = liElement.find('> div > div:first');
                if (this.model.loadOnDemand && !this.model.enablePersistence) {
                    if (liElement.find('> ul > .e-item').length > 0 && expandIcon.hasClass('e-plus')) {
                        if (!this.model.enableMultipleExpand) this._denyMultipleExpand(liElement);
                        this._expandCollapseAction(liElement.find('> div > div.e-plus:first'));
                    } else if (expandIcon.hasClass('e-icon') && !expandIcon.hasClass('e-minus')) {
                        (this._allowOnDemand) && this._createChildNodesWhenExpand(liElement);
                    }
                }
                else {
                    if (expandIcon.hasClass('e-plus')) {
                        var isExpanded = liElement.find('> ul > .e-item').length > 0 ? true : false;
                        if (isExpanded) {
                            if (!this.model.enableMultipleExpand) this._denyMultipleExpand(liElement);
                            this._expandCollapseAction(expandIcon);
                        }
                    }
                }
            }
            return true;
        },

        _collapseNode: function (liElement) {
            if (liElement[0] != null && liElement.length > 0) {
                if (liElement.find('> ul > .e-item').length > 0) {
                    var collapseIcon = liElement.find('> div > div:first');
                    if (collapseIcon.hasClass('e-minus'))
                        this._expandCollapseAction(collapseIcon);
                }
            }
        },

        _getElement: function (level) {
            return (!this.element.is('UL')) ? this.element.find('> ul') : this.element;
        },

        _getImmediateChild: function (ele, excludeHiddenNodes) {
            return excludeHiddenNodes ? ele.find('> .e-item:not(:hidden)') : ele.find('> .e-item');
        },

        _expandByLevel: function (ele, level, excludeHiddenNodes) {
            (level > 0) && this._expandByNode(this._getImmediateChild(ele, excludeHiddenNodes), level, excludeHiddenNodes);
        },

        _expandByNode: function (cnodes, level, excludeHiddenNodes) {
            for (var i = 0, len = cnodes.length; i < len; i++) {
                if ($(cnodes[i]).find("> div > div").hasClass("e-plus"))
                    this.model.loadOnDemand ? this._createChildNodesWhenExpand($(cnodes[i]), true, level, excludeHiddenNodes) : this._expandNode($(cnodes[i]));
                this._expandByLevel($(cnodes[i]).find('> ul'), level - 1, excludeHiddenNodes);
            }
        },

        _expandAll: function (excludeHiddenNodes) {
            var element = this.element, i, cnodes;
            cnodes = element.find(excludeHiddenNodes ? '.e-item > div > .e-plus:not(:hidden)' : '.e-item > div > .e-plus').closest('.e-item');
            if (this.model.loadOnDemand) {
                for (i = 0, len = cnodes.length; i < len; i++)
                    this._createChildNodesWhenExpand($(cnodes[i]), true, null, excludeHiddenNodes);
            }
            else {
                for (i = 0, len = cnodes.length; i < len; i++)
                    this._expandNode($(cnodes[i]));
            }
        },

        _collapseByLevel: function (ele, level, excludeHiddenNodes) {
            (level > 0) && this._collapseByNode(this._getImmediateChild(ele, excludeHiddenNodes), level, excludeHiddenNodes);
        },

        _collapseByNode: function (cnodes, level, excludeHiddenNodes) {
            for (var i = 0, len = cnodes.length; i < len; i++) {
                if ($(cnodes[i]).find("> div > div").hasClass("e-minus"))
                    this._collapseNode($(cnodes[i]));
                this._collapseByLevel($(cnodes[i]).find('> ul'), level - 1, excludeHiddenNodes);
            }
        },

        _collapseAll: function (excludeHiddenNodes) {
            var element = this.element, i, enodes;
            enodes = element.find(excludeHiddenNodes ? '.e-item > div > .e-minus:not(:hidden)' : '.e-item > div > .e-minus').closest('.e-item');
            if (enodes.length > 0) {
                for (i = 0, len = enodes.length; i < len; i++) {
                    this._collapseNode($(enodes[i]));
                }
            }
        },

        _checkAll: function () {
            this._CurrenctSelectedNodes = [];
            var element = this.element, chkColl;
            chkColl = element.find('.e-item > div > .e-chkbox-wrap > .nodecheckbox');
            chkColl.addClass('checked');
            for (i = 0, len = chkColl.length; i < len; i++) {
                $(chkColl[i]).ejCheckBox("setModel", { checked: true });
                this._addHiddenInputElement(chkColl[i], $(chkColl[i]).parent().siblings('.e-text')[0].lastChild.nodeValue);
            }
            this.model.checkedNodes = this.getCheckedNodesIndex();
        },

        _uncheckAll: function () {
            var element = this.element, chkColl;
            chkColl = element.find('.e-item > div > .e-chkbox-wrap > .nodecheckbox');
            chkColl.removeClass("checked").children().remove();
            for (i = 0, len = chkColl.length; i < len; i++)
                $(chkColl[i]).ejCheckBox("setModel", { checked: false });
            this.model.checkedNodes = [];
            this.model.checkedNodes.push(-1);
        },

        _selectAll: function () {
            this._isRender = false;
            var data = { ctrlKey: true };
            for (var i = 0, len = this._liList.length; i < len; i++) {
                var element = $(this._liList[i]);
                if (element[0] != null)
                    this._nodeSelectionAction(element, data);
                if (!this.model.allowMultiSelection) break;
            }
            this._isRender = true;
        },

        _unselectAll: function () {
            this.element.find('a.e-text.e-active').removeClass('e-node-focus e-active');
            this.element.find('[aria-selected=true]').attr("aria-selected", false);
            this.element.find('.e-li-active').removeClass('e-li-active');
            this.element.find('.e-li-focus').removeClass('e-li-focus');
            this.element.find('.e-node-focus').removeClass('e-node-focus');
            this.model.selectedNodes = [];
            if (this.model.enablePersistence)
                this._persistValues(this.model.selectedNodes, "selectedNodes");
        },

        _isNodeExpanded: function (liElement) {
            if (liElement[0] != null)
                return liElement.children('ul:first').length > 0 && liElement.find('> div > div.e-minus').length > 0;
        },

        _showCheckBox: function () {
            var element = this.element, licoll, i, subItems;
            licoll = element.find('li');
            for (var i = 0; i < licoll.length; i++)
                this._checkboxOnTemplate(licoll[i].children[0]);
            element.find(".e-item > div > .nodecheckbox").ejCheckBox({ cssClass: this.model.cssClass, change: this._checkedChange });
            element.find(".e-item.e-node-disable > div > .e-chkbox-wrap > .nodecheckbox").ejCheckBox("disable");
        },
        _drag: function () {
            var proxy, pre = false, browserInfo = ej.browserInfo(), _clonedElement = null, _draggedElement = null, dragContainment = null, _isIE8;
            _isIE8 = (browserInfo.name == 'msie' && browserInfo.version == '8.0') ? true : false;
            if (this.element.is("ul")) {
                this._treeView = this.element.parent();
                if (!this.model.allowDragAndDropAcrossControl)
                    dragContainment = this.element.parent();
            }
            else {
                this._treeView = this.element;
                if (!this.model.allowDragAndDropAcrossControl)
                    dragContainment = this.element;
            }
            $(this._treeView).find("ul li div a").not(".e-js").ejDraggable({
                dragArea: dragContainment,
                clone: true,
                dragStart: function (args) {
                    if (proxy && !ej.isNullOrUndefined(args.target) && !$(args.target).hasClass('e-node-disable') && proxy.element.find('.e-item > div > .e-text.e-editable').length == 0) {
                        args.element.attr('aria-grabbed', true);
                        proxy.element.closest('.e-treeview-wrap').addClass('e-dragging');
                        if ($(args.target).is('A') && !$(args.target).hasClass('e-draggable')) return false;
                        if (_isIE8) document.ondragstart = function () { return false; }
                        var data = { target: $(args.target).closest(".e-item"), targetElementData: proxy._getNodeDetails($(args.target).closest(".e-item")), dragTarget: args.target, parentElement: $(args.target).closest("ul").closest('.e-item'), parentElementData: proxy._getNodeDetails($(args.target).closest("ul").closest('.e-item')), event: args.event };
                        if (proxy._triggerEvent('nodeDragStart', data)) {
                            args.cancel = true;
                            _clonedElement && _clonedElement.remove();
                            return false;
                        }
                    } else return false;
                },
                drag: function (args) {
                    pre = false;
                    if ($(args.target).hasClass('e-sibling')) args.target = args.target.parentElement;
                    $('.e-sibling').remove();
                    var target = args.target, trgtEle = proxy._findTarget($(target)), data;
                    $(target).closest('.e-treeview-wrap').addClass('e-dragging');
                    var desProxy = $(target).closest('.e-treeview.e-js').data('ejTreeView');
                    desProxy = !desProxy ? proxy : desProxy;
                    $(_clonedElement).css({ "margin-top": args.event.clientY - 20 < 0 ? "0px" : "10px" });
                    
                    data = { draggedElement: $(args.element).closest(".e-item"), draggedElementData: proxy._getNodeDetails($(args.element).closest(".e-item")), dragTarget: target, target: trgtEle, targetElementData: proxy._getNodeDetails(trgtEle), event: args.event };
                    if (($(args.element).parent().parent().has($(target)).length == 0 || (proxy.model.allowMultiSelection && proxy.model.selectedNodes.length > 1)) && ($(target).hasClass('e-droppable') || $(target).parent().hasClass('e-droppable')) && $(target).hasClass('e-dropchild') && !$(target).hasClass('e-node-disable') &&
                       (proxy.model.allowDragAndDropAcrossControl || (!proxy.model.allowDragAndDropAcrossControl && $(target).parents('.e-treeview').is(proxy.element)))) {
                        document.body.style.cursor = '';
                        $(_clonedElement).find('span.e-dropedStatus').removeClass().addClass("e-dropedStatus e-icon e-plus");
                        $(target).addClass("allowDrop");
                    } else if (desProxy.model.allowDropChild && desProxy.model.allowDropSibling && (($(target).hasClass('e-droppable') && !$(target).hasClass('e-item') && !$(target).hasClass('e-text')) || ($(target).is("UL") && $(target).hasClass('e-ul') && $(target).find('.e-item').length == 0 && $(target).parent('.e-treeview-wrap').length > 0))) {
                        document.body.style.cursor = '';
                        $(_clonedElement).find('span.e-dropedStatus').removeClass().addClass("e-dropedStatus e-icon e-plus");
                    }
                    else if ((!$(target).hasClass('e-sibling') && !$(target).find('a').hasClass('e-text')) || (!$(target).hasClass('e-sibling') && !$(target).parent().parent().hasClass('e-item') && !$(target).parent().hasClass('e-item') && !$(target).hasClass('e-item') && !$(target).hasClass('e-text')) || ((target.nodeName.toUpperCase() == "LI" || target.parentElement !== null && target.parentElement.nodeName.toUpperCase() == "LI") && !desProxy.model.allowDropSibling) || (!proxy.model.allowDragAndDropAcrossControl && !$(target).parents('.e-treeview').is(proxy.element))) {
                        document.body.style.cursor = 'not-allowed';
                        $(_clonedElement).find('span.e-dropedStatus').removeClass().addClass("e-dropedStatus e-icon e-minus");
                        $(target).removeClass('showline-hover');
                        $(target).removeClass('noline-hover');
                    }
                    if (target.nodeName != 'A' && ($(args.element).parent().parent().has($(target)).length == 0 || (proxy.model.allowMultiSelection && proxy.model.selectedNodes.length > 1)) && $(args.element).parent().parent()[0] != $(target)[0]) {
                        if (target.nodeName == 'UL' && $(target).children()[0] != null)
                        { target = $(target).children()[0]; pre = true; }
                        if (target.nodeName != 'LI')
                            target = $(target).closest('.e-droppable')[0] || $(target).parent();
                        if (target.nodeName == 'LI' && $(target).hasClass("e-droppable") && $(target).hasClass("e-dropsibling") && (proxy.model.allowDragAndDropAcrossControl || (!proxy.model.allowDragAndDropAcrossControl && $(target).parents('.e-treeview').is(proxy.element)))) {
                            var div = ej.buildTag('div.e-sibling'), targetY;
                            targetY = $(target).offset().top + $(target).find('a').height() || -1;
                            pre = (args.event.pageY > targetY) ? false : true;
                            pre ? div.insertBefore($(target).find('> div > a').parent()) : div.insertAfter($(target).find('> div > a').parent());
                            if ($(target).parents().hasClass("e-rtl")) {
                                document.body.style.cursor = '';
                                $(_clonedElement).find('span.e-dropedStatus').removeClass().addClass("e-dropedStatus e-icon e-insertInbetween-rtl");
                            }
                            else {
                                document.body.style.cursor = '';
                                $(_clonedElement).find('span.e-dropedStatus').removeClass().addClass("e-dropedStatus e-icon e-insertInbetween");
                            }
                        }
                        else if (target.nodeName == 'A' && $(target) && $(target).hasClass('e-droppable') && $(target).hasClass('e-dropchild')) {
                            document.body.style.cursor = '';
                            $(_clonedElement).find('span.e-dropedStatus').removeClass().addClass("e-dropedStatus e-icon e-plus");
                            $(target).addClass("allowDrop");
                        } else if ($(target).hasClass('e-droppable') && !$(target).hasClass('e-item') && !$(target).hasClass('e-text')) {
                            document.body.style.cursor = '';
                            $(_clonedElement).find('span.e-dropedStatus').removeClass().addClass("e-dropedStatus e-icon e-plus");
                        }
                    }
                    else {
                        if ($(args.element).parent().parent().has($(target)).length == 1 || $(args.element).parent().parent().is($(target))) {
                            if (!proxy.model.allowMultiSelection || (proxy.model.allowMultiSelection && proxy.model.selectedNodes.length <= 1)) {
                                document.body.style.cursor = 'not-allowed';
                                $(_clonedElement).find('span.e-dropedStatus').removeClass().addClass("e-dropedStatus e-icon e-minus");
                            }
                        }
                        $('.e-sibling').remove();
                    }
                    if (proxy._triggerEvent('nodeDrag', data))
                        return false;
                },
                dragStop: function (args) {
                    if (_isIE8) document.ondragstart = function () { return true; }
                    if (!args.element.dropped) {
                        _clonedElement && _clonedElement.remove();
                        document.body.style.cursor = '';
                    }
                    var target = args.target, position, data;
                    $(target).closest('.e-treeview-wrap').removeClass('e-dragging');
                    proxy.element.closest('.e-treeview-wrap').removeClass('e-dragging');
                    if (target.className == "e-sibling")
                        target = $(target).closest(".e-item")[0];
                    $('.e-sibling').remove();
                    if ($(target).hasClass('e-node-disable')) return false;
                    position = pre ? "Before" : "After", trgtEle = proxy._findTarget($(target));
                    position = target.nodeName == 'A' ? "Over" : position;
                    data = { draggedElementData: proxy._getNodeDetails($(args.element).closest('.e-item')), draggedElement: $(args.element).closest('.e-item'), dropTarget: $(target), target: trgtEle, targetElementData: proxy._getNodeDetails(trgtEle), position: position, event: args.event };
                    if (proxy._triggerEvent('nodeDragStop', data))
                        return false;
                    if (proxy.model.allowMultiSelection && $(args.element).hasClass("e-active")) {
                        var sleNodes = proxy.element.find('.e-item > div > .e-active');
                        for (var l = 0, slelen = sleNodes.length; l < slelen; l++) {
                            args.element = sleNodes[l];
                            position = proxy._dropNode(target, args, position, pre);
                            if (position == "After" && $(target).closest('.e-treeview.e-js').length)
                                target.nodeName.toUpperCase() == "LI" ? target = target.nextElementSibling : target = target.closest("li").nextElementSibling;
                        }
                    }
                    else
                        position = proxy._dropNode(target, args, position, pre);
                    $(".allowDrop").removeClass("allowDrop");
                    $(args.element).attr('aria-grabbed', false);
                    if (!$(target).hasClass('e-dropchild')) {
                        _clonedElement && _clonedElement.remove();
                    }
                    trgtEle = proxy._findTarget($(target));
                    data = { droppedElementData: proxy._getNodeDetails($(args.element).closest('.e-item')), droppedElement: $(args.element).closest('.e-item'), dropTarget: $(target), target: trgtEle, targetElementData: proxy._getNodeDetails(trgtEle), position: position, event: args.event };
                    if (proxy._triggerEvent('nodeDropped', data))
                        return false;
                    document.body.style.cursor = '';
                },
                helper: function (event, ui) {
                    if (!ej.isNullOrUndefined(event.element) && !$(event.element).hasClass('e-node-disable') && $(event.element).hasClass('e-draggable')) {
                        proxy = $(event.element).closest('.e-treeview.e-js').data('ejTreeView');
                        if (proxy) {
                            _clonedElement = ej.buildTag('div.e-dragedNode e-widget');
                            var maxZ = ej.util.getZindexPartial(proxy.element);
                            _clonedElement.css({ "z-index": maxZ });
                            _clonedElement.addClass(proxy.model.cssClass + (proxy.model.enableRTL ? ' e-rtl' : ''));
                            var sleNodes = proxy.element.find('.e-item > div > .e-active');
                            var sleNodesLen = sleNodes.length;
                            _draggedElement = $(event.element).clone().addClass("dragClone");
                            this.spanEle = ej.buildTag('span.e-icon e-plus e-dropedStatus');
                            _clonedElement.append(this.spanEle);
                            _clonedElement.append(_draggedElement);
                            var _spanEle = ej.buildTag('span.e-drop-count', sleNodesLen);
                            if (sleNodesLen > 1 && proxy.model.allowMultiSelection && $(event.element).hasClass("e-active"))
                                _clonedElement.append(_spanEle);
                            return _clonedElement.appendTo($("body"));
                        }
                    }
                }
            });
        },

        _dropNode: function (target, args, position, pre) {
            proxy = $(target).closest('.e-treeview.e-js').data('ejTreeView');
            if (target.nodeName == 'A' && $(target).hasClass('e-dropchild') && $(target).hasClass('e-droppable') || (target.nodeName == 'UL' && $(target).children().length == 0)) {
                position = "Over";
                if ($(target).is("UL") && $(target).hasClass('e-ul') && $(target).find('.e-item').length == 0 && $(target).parent('.e-treeview-wrap').length > 0 && proxy.model.allowDropChild)
                    this._dropAsChildNode($(target), $(args.element), args.event);
                else if (proxy.model.allowDropChild && ($(args.element).parent().parent().has($(target)).length == 0) && ($(target).parent().parent().has($(args.element)).length == 0 || this._isDescendant($(target).parents("li:last").find('>ul>li'), $(args.element).parents("li:first")[0])) && (this.model.allowDragAndDropAcrossControl || (!this.model.allowDragAndDropAcrossControl && $(target).parents('.e-treeview').is(this.element))))
                    this._dropAsChildNode($(target).closest('.e-item'), $(args.element), args.event);
            }
            else {
                if (target.nodeName == 'UL')
                    target = $(target).children()[0];
                if (target.nodeName != 'LI')
                    target = $(target).closest('.e-droppable')[0] || $(target).parent();
                if (target.nodeName == 'LI' && $(target).hasClass('e-dropsibling') && $(target).hasClass('e-droppable')) {
                    if (proxy.model.allowDropSibling && $(args.element).parent().parent().has($(target)).length < 1 && $(args.element).parent().parent()[0] != $(target)[0] && (this.model.allowDragAndDropAcrossControl || (!this.model.allowDragAndDropAcrossControl && $(target).parents('.e-treeview').is(this.element))))
                        this._dropAsSiblingNode($(target), $(args.element), pre, args.event);
                }
                else if (target.nodeName == 'A' && $(target).hasClass('e-dropchild') && $(target).hasClass('e-droppable')) {
                    position = "Over";
                    if (proxy.model.allowDropChild && ($(args.element).parent().parent().has($(target)).length == 0) && ($(target).parent().parent().has($(args.element)).length == 0 || this._isDescendant($(target).parents("li:last").find('>ul>li'), $(args.element).parents("li:first")[0])))
                        this._dropAsChildNode($(target).closest('.e-item'), $(args.element), args.event);
                }
            }
            return position;
        },

        _findTarget: function (trgt) {

            if (trgt.hasClass('e-text') || trgt.parents('a').hasClass('e-text')) return trgt.closest('.e-item')
               
            else if (trgt.closest("ul").closest('.e-item').length > 0) return trgt.closest("ul").closest('.e-item')

            else if (this.element.find(trgt).length > 0 && !this.model.template) return trgt.parents("ul").first()

            else if (this.element.find(trgt).length > 0 && this.model.template){ 

                return (trgt.closest('.e-text').length > 0) ? trgt.closest('.e-item') : trgt.parents("ul").first();
             
            }
            else return trgt;

        },

        _isDescendant: function (src, target) {
            var match = true;
            $(src).each(function (i, item) {
                if (item == target) {
                    match = false;
                    return false;
                }
                else
                    match = true;
            });
            return match;
        },

        _childDrop: function () {
            $(this._treeView).find("ul .e-item div .e-text").ejDroppable({
                accept: $(this._treeView).find("ul .e-item div .e-text").addClass('e-dropchild'),
                drop: function (event, ui) {
                    $(ui.helper).hide();
                }
            });
        },

        _siblingDrop: function () {
            $(this._treeView).find("ul .e-item").addClass('e-dropsibling').ejDroppable({
                drop: function (event, ui) {
                    $(ui.helper).hide();
                }
            });
        },

        _dropAsSiblingNode: function (target, element, pre, event) {
            var li = element.parent().parent(), li = $(li), parentNode;
            parentNode = $(element.parents('.e-item')[1]);
            if (!ej.isNullOrUndefined(this.model.fields) && this.dataSource() != null && !(this.dataSource() instanceof ej.DataManager))
                this._updateDataSource(element.parents('.e-item:first'), $(target), pre, this);
            pre ? li.insertBefore(target) : li.insertAfter(target);
            (!this.model.template) && this._autoGenerateNodes(element.parents('.e-item:first'));
            this._modifyCss(parentNode);
            this._isRender = false;
            this._updateCheckState(li);
            this._updateCheckState(parentNode);
            this._isRender = true;
            (li.find('> div > .e-minus').length > 0 && !this.model.enableMultipleExpand) && this._denyMultipleExpand(li);
            this._updateChanges($(target));
        },

        _dropAsChildNode: function (target, element, event) {
            var li = element.parent().parent(), li = $(li), parentNode;
            parentNode = this._parentLevelDropChecking = $(element.parents('.e-item')[1]);
            ($(target).is('UL')) ? $(target).append(li) : this._appendNode(target, li);
            if (!ej.isNullOrUndefined(this.model.fields) && this.dataSource() != null && !(this.dataSource() instanceof ej.DataManager))
                this._updateDataSource(element.parents('.e-item:first'), $(target).find("> div > .e-text").first(), "", this);
            (!this.model.template) && this._autoGenerateNodes(element.parents('.e-item:first'));
            this._modifyCss(parentNode);
            this._isRender = false;
            this._updateCheckState(li);
            this._updateCheckState(parentNode);
            this._isRender = true;
            if (target.find('> div > .e-icon.e-plus:first').length > 0) this._expandNode(target);
            this._updateChanges($(target));
        },

        _updateChanges: function (dropEle) {
            if ($(dropEle)[0] != null) {
                var desTree = this, tree = 0;
                do {
                    desTree._updateNodes();
                    if (tree == 1) desTree._updateTarget(this);
                    tree++;
                    desTree = dropEle.closest('.e-treeview.e-js').data('ejTreeView')
                } while (desTree && this._id != desTree._id && tree == 1);
            }
        },

        _updateTarget: function (obj) {
            if (this.model.allowDropChild != obj.model.allowDropChild)
                this.model.allowDropChild ? this._childDrop() : this._preventDropChild();
            if (this.model.allowDropSibling != obj.model.allowDropSibling)
                this.model.allowDropSibling ? this._siblingDrop() : this._preventDropSibling();
        },

        _updatePersistProb: function () {
            this._removeField(this._newDataSource, this.model.fields, "selected");
            this._removeField(this._newDataSource, this.model.fields, "expanded");
            this._removeField(this._newDataSource, this.model.fields, "isChecked");
            var sleNodes = this.getSelectedNodes();
            for (var l = 0, slelen = sleNodes.length; l < slelen; l++)
                this._updateField(this._newDataSource, $(sleNodes[l]).attr('id'), this.model.fields, "selected", true);
            var enodes = this.getExpandedNodes();
            for (var k = 0, nodelen = enodes.length; k < nodelen; k++)
                this._updateField(this._newDataSource, $(enodes[k]).attr('id'), this.model.fields, "expanded", true);
            if (this.model.showCheckbox) {
                var cnodes = this.getCheckedNodes();
                for (var m = 0, nodelen = cnodes.length; m < nodelen; m++)
                    this._updateField(this._newDataSource, $(cnodes[m]).attr('id'), this.model.fields, "isChecked", true);
            }
        },

        _orderDataSource: function () {
            this._beforeBaseClass();
            this._updatePersistProb();
            var orderedData = [], datasource = JSON.parse(JSON.stringify(this._newDataSource));
            if (this.dataSource() instanceof ej.DataManager && this._templateType == 2) {
                return this._newDataSource;
            }
            else {
                for (var i = 0, objlen = this._liList.length; i < objlen; i++) {
                    for (var j = 0, dlen = datasource.length; j < dlen; j++) {
                        if ($(document.getElementById(ej.getObject(this.model.fields.id, datasource[j]))).length > 0 && !ej.isNullOrUndefined(datasource[j]) && !ej.isNullOrUndefined(datasource[j][this.model.fields.id]) && datasource[j][this.model.fields.id].toString() == $(this._liList[i]).attr('id')) {
                            if ($(document.getElementById(ej.getObject(this.model.fields.id, datasource[j]))).find('> ul .e-item').length == 0) {
                                this._deepPropertyDelete(this.model.fields.hasChild, datasource[j]);
                                if (this._templateType == 2)
                                    delete datasource[j]["child"];
                            } else if (this._templateType == 1)
                                ej.createObject(this.model.fields.hasChild, true, datasource[j]);
                            else
                                this._updateChildData(datasource[j]["child"], this.model.fields);
                            orderedData.push(datasource[j]);
                        }
                    }
                }
            }
            return orderedData;
        },

        _updateDataSource: function (dragEle, dropEle, before ,obj) {
            if ($(dragEle)[0] != null && $(dropEle)[0] != null) {
                var sourceTree = obj, desTree, pid, indexPos;
                desTree = dropEle.closest('.e-treeview.e-js').data('ejTreeView');

                if (sourceTree && desTree && !ej.isNullOrUndefined(desTree.model.fields) && desTree.dataSource() != null && !(desTree.dataSource() instanceof ej.DataManager)) {
                    if (dropEle.is("A")) {
                        pid = dropEle.closest('.e-item').attr('id');
                        var child = dropEle.closest('.e-item').find('> ul > .e-item');
                        indexPos = (child.length > 0) ? child.length : dropEle.closest('.e-item').index();
                    }
                    else {
                        pid = dropEle.parents('.e-item:first').attr('id');
                        var nextLi = dropEle.next('.e-item'), prevLi = dropEle.prev('.e-item');
                        if (nextLi.length > 0)
                            indexPos = (prevLi.length > 0) ? indexPos = nextLi.index() - 1 : (before) ? indexPos = dropEle.index() : indexPos = nextLi.index();
                        else
                            indexPos = (before) ? dropEle.index() : dropEle.index() + 1;
                    }
                    (desTree) && sourceTree._findAndUpdate(dragEle.attr('id'), pid, sourceTree._newDataSource, indexPos, desTree, dropEle, before);
                }
            }
        },

        _removeObject: function (data, searchId, key) {
            for (var i = 0, len = data.length; i < len; i++) {
                if (!ej.isNullOrUndefined(data[i]) && !ej.isNullOrUndefined(data[i][key]) && data[i][key].toString() == searchId) {
                    data.splice(i, 1);
                    break;
                }
            }
        },

        _getObjectPosition: function (data, searchId, key) {
            for (var i = 0, len = data.length; i < len; i++) {
                if (!ej.isNullOrUndefined(data[i]) && !ej.isNullOrUndefined(data[i][key]) && data[i][key].toString() == searchId) {
                    return i;
                }
                if (data[i].hasOwnProperty('child')) {
                    var pos = this._getObjectPosition(data[i].child, searchId, key);
                    if (pos >= 0) return pos;
                }
            }
            return -1;
        },

        _convertDataSourceTypes: function (data, resultobj) {
            for (var j = 0; j < data.child.length; j++) {
                ej.createObject(this.model.fields.parentId, ej.getObject(this.model.fields.id, data), data.child[j]);
                resultobj.push(data.child[j]);
                if (data.child[j].hasOwnProperty('child') && data.child[j].child.length > 0) {
                    this._convertDataSourceTypes(data.child[j], resultobj);
                }
            }
            if (data['child']) {
                delete data['child'];
                ej.createObject(this.model.fields.hasChild, true, data);
            }
            return resultobj;
        },

        _childObjectCollection: function (childNodes, groupedObj, resultobj, tempType) {
            for (var j = 0, len = childNodes.length; j < len; j++) {
                var temp = this._getChildNodes(groupedObj, { id: ej.getObject(this.model.fields.id, childNodes[j]) });
                if (temp) {
                    if (tempType == 2) {
                        if (!resultobj[j].hasOwnProperty('child'))
                            resultobj[j].child = [];
                        resultobj[j].child = this._childObjectCollection(temp, groupedObj, temp, tempType);
                    }
                    else {
                        resultobj = resultobj.concat(temp);
                        resultobj = this._childObjectCollection(temp, groupedObj, resultobj, tempType);
                    }
                }
            }
            return resultobj;
        },

        _updateCopyData: function (i, obj , childNodes) {
            var newTree = obj.model.fields; temp = childNodes, arr = JSON.parse(JSON.stringify(childNodes[i])), proxy = this;
            $.each(this.model.fields, function (key, value) {
                if (key !== "dataSource" || key !== "query")
                    if (temp[i][proxy.model.fields[key]] !== undefined) {
                        delete arr[proxy.model.fields[key]];
                        arr[newTree[key]] = temp[i][proxy.model.fields[key]];
                    }
            })
            var tempArr = $.extend(tempArr, arr, false);
            return tempArr;
        },

        _updateDataFields: function (obj, childNodes, searchId, tree2, templateType) {
            var childData = [];
            for (var j = 0, len = childNodes.length; j < len; j++) {
                if (templateType == 1) {
                    this._removeObject(obj, searchId, this.model.fields.parentId);
                    this._deepPropertyDelete(this.model.fields.parentId, childNodes[j]);
                    this._deepPropertyDelete(this.model.fields.hasChild, childNodes[j]);
                }
                if (childNodes[j].hasOwnProperty('child'))
                    childNodes[j].child = this._updateDataFields(obj, childNodes[j].child, ej.getObject(this.model.fields.id, childNodes[j]), tree2, templateType);
                childData.push(this._updateCopyData(j, tree2, childNodes));
            }
            return childData;
        },
        _deepPropertyDelete: function (nameSpace, from) {
            if (!from || ej.isNullOrUndefined(nameSpace)) return undefined;
            var splits = nameSpace.split('.');
            if (splits.length > 1)
                deepDelete(splits.slice(1).join('.'), from[splits[0]]);
            else
                delete from[nameSpace];
        },

        _findAndUpdate: function (searchId, parentId, obj, index, tree2, dropEle, before) {
            if (ej.isNullOrUndefined(obj)) return;
            if (this._templateType == 1) {
                for (var i = 0, objlen = obj.length; i < objlen; i++) {
                    var fieldId = ej.getObject(this.model.fields.id, obj[i]);
                    if (!ej.isNullOrUndefined(obj[i]) && !ej.isNullOrUndefined(fieldId) && fieldId.toString() == searchId) {
                        if (this._id == tree2._id) {
                            (!ej.isNullOrUndefined(parentId)) ? (ej.createObject(this.model.fields.parentId, parentId, obj[i])) : (this._deepPropertyDelete(this.model.fields.parentId, obj[i]));
                            var list = this.dataSource(), proxy = this;
                            if (this._deepWatch) {
                                var remvObj = obj.splice(i, 1);
                                var pos = this._getObjectPosition(list, dropEle.attr("id"), this.model.fields.id);
                                (pos >= 0 && !dropEle.is("A")) ? obj.splice(before ? pos : pos + 1, 0, remvObj[0]) : obj.push(remvObj[0]);
                                this._oldDataSource = JSON.parse(JSON.stringify(obj));
								this.dataSource(obj);
                            }
                            this._templateType = this._getTemplateType(list, this.model.fields);
                            this._dataSource = (this._templateType == 1) ? this._groupingObjects(list, function (list) { return [!ej.isNullOrUndefined(list) && [ej.getObject(proxy.model.fields.parentId, list)].toString()]; }) : list;
                        } else {
                            var remObj = [], childNodes, proxy = this, groupedObj, result = [], nodeArr = [];
                            groupedObj = this._groupingObjects(obj, function (obj) { return [!ej.isNullOrUndefined(obj) && [ej.getObject(proxy.model.fields.parentId, obj)].toString()]; });
                            nodeArr = obj.splice(i, 1);
                            remObj.push(this._updateCopyData(0, tree2, nodeArr));
                            childNodes = this._getChildNodes(groupedObj, { id: searchId });
                            if (childNodes && childNodes.length > 0)
                                childNodes = this._childObjectCollection(childNodes, groupedObj, childNodes, tree2._templateType);
                            if (tree2._templateType == 2) {
                                if (childNodes && childNodes.length > 0) {
                                    var childData = this._updateDataFields(obj, childNodes, searchId, tree2, this._templateType);
                                    if (!remObj[0].hasOwnProperty('child'))
                                        remObj[0].child = [];
                                    remObj[0].child = childData;
                                }
                                this._deepPropertyDelete(tree2.model.fields.parentId, remObj[0]);
                                this._deepPropertyDelete(tree2.model.fields.hasChild, remObj[0]);
                                if (tree2._deepWatch) {
                                    var pos = this._getObjectPosition(tree2._newDataSource, dropEle.attr("id"), tree2.model.fields.id);
                                    pos = (pos >= 0 && !dropEle.is("A")) ? (before ? pos : pos + 1) : index;
                                    (parentId) ? tree2._changeObjectPos(parentId, remObj, tree2._newDataSource, pos) : tree2._newDataSource.splice(pos, 0, remObj[0]);
                                }
                                else {
                                    (parentId) ? tree2._changeObjectPos(parentId, remObj, tree2._newDataSource, index) : tree2._newDataSource.splice(index, 0, remObj[0]);
                                }
                            } else {
                                if (childNodes && childNodes.length > 0) {
                                    for (var j = 0, len = childNodes.length; j < len; j++) {
                                        this._removeObject(obj, ej.getObject(this.model.fields.id, childNodes[j]), this.model.fields.id);
                                    }
                                    this._dataSource = (this._templateType == 1) ? this._groupingObjects(obj, function (obj) { return [!ej.isNullOrUndefined(obj) && [ej.getObject(proxy.model.fields.parentId, obj)].toString()]; }) : obj;
                                }
                                (parentId) ? (ej.createObject(tree2.model.fields.parentId, parentId, remObj[0])) : this._deepPropertyDelete(tree2.model.fields.parentId, remObj[0]);
                                if (tree2._deepWatch) {
                                    var pos = this._getObjectPosition(tree2._newDataSource, dropEle.attr("id"), tree2.model.fields.id);
                                    (pos >= 0 && !dropEle.is("A")) ? tree2._newDataSource.splice(before ? pos : pos + 1, 0, remObj[0]) : tree2._newDataSource.push(remObj[0]);
                                }
                                else
                                    tree2._newDataSource.push(remObj[0]);
                                var childData = [];
                                if (childNodes && childNodes.length > 0) {
                                    if (!(this.dataSource() instanceof ej.DataManager)) {
                                        for (var i = 0; i < childNodes.length; i++) {
                                            childData.push(this._updateCopyData(i, tree2, childNodes));
                                        }
                                        childNodes = childData;
                                    }
                                    var collection = tree2._newDataSource = tree2._newDataSource.concat(childNodes);
                                    tree2._dataSource = (tree2._templateType == 1) ? tree2._groupingObjects(collection, function (collection) { return [!ej.isNullOrUndefined(collection) && [ej.getObject(tree2.model.fields.parentId, collection)].toString()]; }) : collection;
                                }
                            }
                            if (tree2._deepWatch) {
                                tree2.dataSource(tree2._newDataSource);
                                tree2._oldDataSource = JSON.parse(JSON.stringify(tree2._newDataSource));
                            }
                            if (this._deepWatch) {
                                this._oldDataSource = JSON.parse(JSON.stringify(this._newDataSource));
								this.dataSource(this._newDataSource);
                            }
                        }
                        break;
                    }
                }
            }
            else {
                for (var i = 0, objlen = obj.length; i < objlen; i++) {
                    if (ej.getObject(this.model.fields.id, obj[i]).toString() == searchId) {
                        var remObj = obj.splice(i, 1);
                        if (this._id == tree2._id) {
                            if (this._deepWatch) {
                                var pos = this._getObjectPosition(this._newDataSource, dropEle.attr("id"), this.model.fields.id);
                                pos = (pos >= 0 && !dropEle.is("A")) ? (before ? pos : pos + 1) : index;
                                (parentId) ? this._changeObjectPos(parentId, remObj, this._newDataSource, pos) : this._newDataSource.splice(pos, 0, remObj[0]);
                                this._oldDataSource = JSON.parse(JSON.stringify(this._newDataSource));
								this.dataSource(this._newDataSource);
                            }
                            else
                                (parentId) ? this._changeObjectPos(parentId, remObj, this._newDataSource, index) : this._newDataSource.splice(index, 0, remObj[0]);
                        } else {
                            remObj = this._updateDataFields(obj, remObj, searchId, tree2, this._templateType);
                            if (tree2._templateType == 1) {
                                // convert nested child datasource into id & parentId case datasource
                                var result = [];
                                if (remObj[0].hasOwnProperty('child')) {
                                    result = tree2._convertDataSourceTypes(remObj[0], result);
                                    remObj[0] = remObj.concat(result);
                                } else
                                    remObj[0] = remObj.concat();
                                (parentId) ? ej.createObject(tree2.model.fields.parentId, parentId, remObj[0][0]) : this._deepPropertyDelete(tree2.model.fields.parentId, remObj[0][0]);
                                if (tree2._deepWatch) {
                                    var pos = this._getObjectPosition(tree2._newDataSource, dropEle.attr("id"), tree2.model.fields.id);
                                    (pos >= 0 && !dropEle.is("A")) ? tree2._newDataSource.splice(before ? pos : pos + 1, 0, remObj[0][0]) : tree2._newDataSource.push(remObj[0][0]);
                                    tree2._newDataSource = tree2._newDataSource.concat(result);
                                }
                                else
                                    tree2._newDataSource = tree2._newDataSource.concat(remObj[0]);
                            } else {
                                if (tree2._deepWatch) {
                                    var pos = this._getObjectPosition(tree2._newDataSource, dropEle.attr("id"), tree2.model.fields.id);
                                    pos = (pos >= 0 && !dropEle.is("A")) ? (before ? pos : pos + 1) : index;
                                    (parentId) ? tree2._changeObjectPos(parentId, remObj, tree2._newDataSource, pos) : tree2._newDataSource.splice(pos, 0, remObj[0]);
                                }
                                else
                                    (parentId) ? tree2._changeObjectPos(parentId, remObj, tree2._newDataSource, index) : tree2._newDataSource.splice(index, 0, remObj[0]);
                            }
                            if (tree2._deepWatch) {
                                tree2.dataSource(tree2._newDataSource);
                                tree2._oldDataSource = JSON.parse(JSON.stringify(tree2._newDataSource));
                            }
                            if (this._deepWatch) {
                                this._oldDataSource = JSON.parse(JSON.stringify(this._newDataSource));
								this.dataSource(this._newDataSource);
                            }
                        }
                        return true;
                    }
                    else if (obj[i].hasOwnProperty('child')) {
                        if (this._findAndUpdate(searchId, parentId, obj[i].child, index, tree2, dropEle, before))
                            break;
                    }
                }
            }
        },

        _changeObjectPos: function (searchId, remObj, data, index) {
            for (var i = 0, objlen = data.length; i < objlen; i++) {
                if (ej.getObject(this.model.fields.id, data[i]).toString() == searchId) {
                    if (data[i].hasOwnProperty('child')) {
                        data[i].child.splice(index, 0, remObj[0]);
                    } else {
                        data[i].child = [];
                        data[i].child.push(remObj[0]);
                    }
                    return true;
                }
                else if (data[i].hasOwnProperty('child')) {
                    if (this._changeObjectPos(searchId, remObj, data[i].child, index))
                        break;
                }
            }
        },

        _finalizeEditing: function (element) {
            if ($(element)[0] != null) {
                var thisObj = element.closest('.e-treeview.e-js').data('ejTreeView');
                if (thisObj) {
                    thisObj._preventEditable();
                    thisObj.model.allowEditing && thisObj._allowEditable();
                }
            }
        },

        _updateCheckState: function (element) {
            if (this._isTreeElement(element)) {
                var thisObj = element.closest('.e-treeview.e-js').data('ejTreeView'), chdNodes;
                if (thisObj && thisObj.model.showCheckbox) {
                    chdNodes = element.children('ul').find('.e-item > div > .e-chkbox-wrap > .checked').closest('.e-item').addClass('checked');
                    if (chdNodes.length > 0)
                        thisObj._isCheckedAction();
                    else {
                        var action = (thisObj.isNodeChecked(element)) ? "_nodeCheck" : "_nodeUncheck";
                        thisObj[action](element.find("> div > .e-chkbox-wrap > .nodecheckbox:first")[0]);
                    }
                }
            }
        },

        _autoGenerateNodes: function (element) {
            if ($(element)[0] != null) {
                var thisObj = element.closest('.e-treeview.e-js').data('ejTreeView');
                if (thisObj && thisObj.model.showCheckbox) {
                    if (element.find(".e-chkbox-wrap").length == 0) {
                        this._checkboxOnTemplate(element[0].children[0]);
                        var subItems = element.find('.e-item');
                        for (var i = 0, len = subItems.length; i < len ; i++)
                            this._checkboxOnTemplate(subItems[i].children[0]);
                        element.find(".nodecheckbox").ejCheckBox({ cssClass: thisObj.model.cssClass, change: thisObj._checkedChange });
                    }
                } else
                    element.find('.e-chkbox-wrap').remove();
            }
        },

        _appendNode: function (element, outerLi) {
            if (this._isTreeElement(element)) {
                var thisObj, outerUl, divTag, nodeid, nodeText, data, parentId, expandList, isExpanded;
                if (element.find('ul.e-treeview-ul')[0] == null) {
                    thisObj = element.closest('.e-treeview.e-js').data('ejTreeView');
                    if (thisObj) {
                        isExpanded = this._isNodeExpanded(element);
                        if (!isExpanded && thisObj.model.loadOnDemand && element.find('> div > div').first().hasClass('e-plus'))
                            thisObj._createChildNodesWhenExpand(element, null, null, null, outerLi, thisObj);
                    }
                    if (!(this.dataSource() instanceof ej.DataManager && thisObj.model.loadOnDemand && element.find('> div > div').first().hasClass('e-plus')))
                        this._doAfterExpand(element, outerLi, thisObj);
                    if (this._deepWatch && (this._templateType == 1)) {
                        this._updateField(this._newDataSource, element.attr("id"), this.model.fields, "hasChild", true);
                        this._oldDataSource = JSON.parse(JSON.stringify(this._newDataSource));
						this.dataSource(this._newDataSource);
                    }
                }
                else
				$(element.find('ul.e-treeview-ul')[0]).append(outerLi);
                (!this.isDisabled(element)) && this._expandNode(element);
            }
            else {
                if (this.element.is('UL')) {
                    this.element.append(outerLi);
                } else if (this.element.children('ul:first').length > 0) {
                    this.element.children('ul:first').append(outerLi);
                } else {
                    outerUl = ej.buildTag("ul.e-treeview-ul", "", {}, { role: "group" });
                    outerUl.append(outerLi);
                    this.element.append(outerUl);
                }
            }
            expandList = this.element.find(".e-item.expanded");
            for (var i = 0; i < expandList.length; i++) {
                (this.model.loadOnDemand && !(this.dataSource() instanceof ej.DataManager)) ? this._createChildNodesWhenExpand($(expandList[i])) : this._expandNode($(expandList[i]));
            }
            expandList.removeClass("expanded");
            this.model.showCheckbox && this._isCheckedAction();
        },

        _doAfterExpand: function (element, outerLi, thisObj) {
            var outerUl = ej.buildTag("ul.e-treeview-ul", "", {}, { role: "group", style: "display:none" });
            $(outerUl).append($(outerLi));
            if ($(element.find('div')[1]).length == 0) {
                var divTag = document.createElement('div');
                divTag.setAttribute('role', 'presentation');
                divTag.className = 'e-icon e-minus';
                $(element.find('div')).append($(divTag));
            } else if (!$(element.find('div')[1]).hasClass('e-minus'))
                $(element.find('div')[1]).addClass('e-icon e-plus');
            if (thisObj && thisObj.model.loadOnDemand && element.find('ul.e-treeview-ul').length > 0)
                element.children('ul.e-treeview-ul').append($(outerLi));
            else
                element.append($(outerUl));
        },

        _modifyCss: function (liElement) {
            liElement = $(liElement);
            if (liElement[0] != null && liElement.find('.e-item').length == 0) {
                liElement.removeClass('e-collapse').attr("aria-expanded", false).find('> div > .e-icon').removeClass('e-icon e-minus').closest('.e-item').find('ul').remove();
                if (this._deepWatch) {
                    this._updateField(this._newDataSource, liElement.attr("id"), this.model.fields, "expanded", false);
                    (this._templateType == 1) && this._updateField(this._newDataSource, liElement.attr("id"), this.model.fields, "hasChild", false);
                    this._oldDataSource = JSON.parse(JSON.stringify(this._newDataSource));
					this.dataSource(this._newDataSource);
                }
            }
        },

        _applyFirstLastChildClass: function () {
            $(this._liList).removeClass('first last').filter(':first-child:not(:last-child)').addClass('first');
            $(this._liList).filter(':last-child').addClass('last');
        },

        _expandEventHandler: function (event) {
            var target = $(event.target), selectedNode, liElement;
            if (target.hasClass("e-icon") || target.closest('.e-item').hasClass("e-node-disable")) return;
            if (!(event.type === "dblclick" && this.model.allowEditing)) {
                event.preventDefault();
                selectedNode = (target.is('A')) ? $(target.siblings('div')) : $(target.parents(".e-text-wrap").find('div'));
                if (this.model.fullRowSelect && (target.is('div.e-text-wrap') || target.is('div.e-fullrow')))
                    selectedNode = target.closest('.e-item').find("> .e-text-wrap > div");
                liElement = target.closest('.e-item');
                if (selectedNode.hasClass('e-minus'))
                    this._collapseNode(liElement);
                else {
                    if (this.model.loadOnDemand && selectedNode.find(".e-item").length == 0) {
                        this._ClickEventHandler({ target: selectedNode[0] });
                    }
                    else this._expandNode(liElement);
                }
            }
        },

        _inlineEdit: function (event) {
            event.preventDefault();
            var target = $(event.target);
            if (!target.hasClass('input-text') && !target.hasClass("e-node-disable") ) {
                if (!target.is('A'))
                    target = target.closest('.e-text');
                if (target.is('A') && !target.hasClass("e-node-disable")) {
                    this._inlineEditAction(target);
                }
            }
            return false;
        },

        _inlineEditAction: function (element) {
            var editTextBox = this.element.find('.e-item > div > .e-text > #Edit_Input');
            (editTextBox[0] == null) && this._createEditTextBox(element);
        },

        _createEditTextBox: function (values) {
            var argsData = { currentElement: values };
            if (this._triggerEvent('beforeEdit', argsData))
                return false;
            var editTextBox = this.element.find('.e-item > div > .e-text > #Edit_Input');
            if (editTextBox[0] == null) {
                var size, textBox = ej.buildTag('Input.input-text#Edit_Input', "", "", { type: 'text', value: $.trim(values.text()).replace(/\n\s+/g, " "), name: 'inplace_value' });
                $(textBox).css("width", (values.outerWidth() + 5) + "px");
                $(textBox).css("height", values.outerHeight() + "px");
                textBox.addClass("e-tree-input e-textbox");
                this._beforeEditText = values.text();
                values[0].lastChild.nodeValue = "";
                if(this.model.template) {
                   var template_id = values.closest("li")["0"].id;
                   values["0"].innerHTML = " ";
                   if(this.getTreeData(template_id)["0"][this.model.fields.text] != undefined)textBox["0"].value = this.getTreeData(template_id)["0"][this.model.fields.text];else textBox["0"].value = "";
                   $(textBox).css("width", (values.outerWidth() +80) + "px");
                   $(textBox).css("height", (values.outerHeight() +10)+ "px");
                }
                values.addClass('e-editable').append(textBox);
                editTextBox = textBox;
                size = (editTextBox.val().length == '') ? 3 : values.outerWidth() + 20;
                this._mousePositionAtEnd(editTextBox);
                this._currentEditableNode = values;
                this._on(editTextBox, 'keypress', this._editTextBoxKeyPress)
                    ._on(editTextBox, 'keydown', this, this._pressEscKey)
                    ._on(editTextBox, 'mousedown pointerdown MSPointerDown', this, this._preventPropagation)
                    ._on(editTextBox, this.model.expandOn, this, this._preventPropagation)
                    ._on(editTextBox, 'blur', this._focusout);
            }
            return editTextBox;
        },

        _preventPropagation: function (e) {
            e.stopImmediatePropagation();
            this._isTextbox = true;
        },

        _editTextBoxKeyPress: function (event) {
            event.target.size = event.target.value.length + 1;
        },

        _mousePositionAtEnd: function (ctl) {
            (ctl.focus) && ctl.focus();
            (ctl.select) && ctl.select();
            return true;
        },

        _focusElement: function (e) {
            if (this._isTextbox) return;
            if(e && (e.type == "touchstart" || e.type == "pointerdown" || e.type == "MSPointerDown")) {
                var ele = $(e.currentTarget);
                (ele.hasClass("e-text")) && this.selectNode(ele.closest('.e-item'));
            }
            this.element.focus();
        },

        _focusout: function (e) {
            var editTextBox = $(e.currentTarget), data, element;
            this._isTextbox = false;
            data = { id: editTextBox.closest('.e-item').attr('id'), oldText: this._beforeEditText, newText: editTextBox.val() };
            (this._triggerEvent('inlineEditValidation', data)) ? this._cancelAction(editTextBox) : this._saveAction(editTextBox, e);
        },

        _pressEscKey: function (event) {
            event.cancelBubble = true;
            event.returnValue = false;
            var editTextBox = $(event.currentTarget);
            if (editTextBox[0] != null) {
                if (event.keyCode == 13) {
                    event.stopPropagation();
                    this._focusout(event);
                }
                if (event.keyCode == 27)
                    this._cancelAction(editTextBox);
                if (event.keyCode == 13 || event.keyCode == 27) {
                    var browserInfo = ej.browserInfo(), _isIE8;
                    _isIE8 = (browserInfo.name == 'msie' && browserInfo.version == '8.0') ? true : false;
                    (_isIE8) && this.element.focus();
                }
            }
        },

        _onFocusHandler: function (event) {
            event.preventDefault();
        },

        _onKeyDown: function (currentEle, focusEle) {
            currentEle.find('> div > .e-text:first').removeClass('e-node-focus');
            focusEle.find('> div > .e-text:first').addClass('e-node-focus');
            if (this.model.fullRowSelect) {
                currentEle.removeClass("e-li-focus");
                focusEle.addClass("e-li-focus");
            }
        },

        _KeyPress: function (e) {
            var code, node, element;
            var proxy = this;
            element = (this.element.is("ul")) ? this.element : this.element.find("> ul");
            if (e.keyCode) code = e.keyCode; // ie and mozilla/gecko
            else if (e.which) code = e.which; // ns4 and opera
            else code = e.charCode;
            if (proxy.model.allowKeyboardNavigation && (proxy.element.find('#Edit_Input').length < 1) && proxy.element.find(".e-chkbox-wrap.e-focus").length < 1) {
                this.element.find(".e-animate").removeClass("e-animate");
                var nextElement, selectedItem, liVisible, activeNode;
                selectedItem = $(element.find(".e-item > div > .e-text.e-active").closest('.e-item')[0]);
                liVisible = element.find('.e-item:visible');
                if (proxy._focusedNode) {
                    activeNode = proxy._focusedNode;
                    proxy._focusedNode = null;
                } else
                    activeNode = element.find('.e-text.e-node-focus').closest('.e-item');
                if (code == 113) {
                    e.preventDefault();
                    var element = (activeNode.length > 0) ? activeNode : selectedItem;
                    if (element.length > 0 && proxy.model.allowEditing && !this.model.template) {
                        e.target = element.find('> div > .e-text:first');
                        proxy._inlineEdit(e);
                    }
                }
                if (code == 40 && !e.altKey) {
                    e.preventDefault();
                    var ele = (activeNode.length > 0) ? activeNode : selectedItem;
                    var nextEle = this._getNextEle(liVisible, ele);
                    if (proxy._KeyPressEventHandler((nextEle.length > 0) ? nextEle : null, proxy, code, e)) return;
                    if (nextEle.length > 0)
                        proxy._onKeyDown(activeNode, nextEle);
                }
                else if (code == 38 && !e.altKey) {
                    e.preventDefault();
                    var ele = (activeNode.length > 0) ? activeNode : selectedItem;
                    var prevEle = this._getPrevEle(liVisible, ele);
                    if (proxy._KeyPressEventHandler((prevEle.length > 0) ? prevEle : null, proxy, code, e)) return;
                    if (prevEle.length > 0)
                        proxy._onKeyDown(activeNode, prevEle);
                }
                else if ((code == 39 && !this.model.enableRTL && !e.altKey) || (code == 37 && this.model.enableRTL)) {
                    e.preventDefault();
                    var nextEle, expandIcon;
                    expandIcon = (activeNode.length > 0) ? activeNode.find('> div > div').first() : selectedItem.find('> div > div').first();
                    nextEle = expandIcon.closest('.e-item');
                    if (expandIcon.hasClass('e-plus')) {
                        if (this.model.loadOnDemand && nextEle.find("> ul .e-item").length == 0) {
                            this._ClickEventHandler({ target: expandIcon[0] });
                        }
                        else this._expandNode($(liVisible[liVisible.index(nextEle)]));
                    } else {
                        var nextEle = this._getNextEle(liVisible, nextEle);
                        if (proxy._KeyPressEventHandler((nextEle.length > 0) ? nextEle : "", proxy, code, e)) return;
                        if (nextEle.length > 0 && nextEle[0] == expandIcon.closest('.e-item').find('ul > .e-item:first')[0] || nextEle.find('ul > .e-item').first().hasClass('e-node-disable'))
                            proxy._onKeyDown(activeNode, nextEle);
                    }
                }
                else if ((code == 37 && !this.model.enableRTL && !e.altKey) || (code == 39 && this.model.enableRTL)) {
                    e.preventDefault();
                    var prevEle, collapseIcon;
                    collapseIcon = (activeNode.length > 0) ? activeNode.find('> div > div').first() : selectedItem.find('> div > div').first();
                    prevEle = collapseIcon.closest('.e-item');
                    if (collapseIcon.hasClass('e-minus')) {
                        this._collapseNode($(liVisible[liVisible.index(collapseIcon.closest('.e-item'))]));
                    } else {
                        prevEle = $(liVisible[liVisible.index(prevEle)]).closest('ul').closest('.e-item');
                        if (proxy._KeyPressEventHandler((prevEle.length > 0) ? prevEle : "", proxy, code, e)) return;
                        if (prevEle.length > 0) {
                            proxy._onKeyDown(activeNode, prevEle);
                        }
                    }
                }
                else if (code == 36 && !e.altKey) {
                    e.preventDefault();
                    var firstEle, ele = (activeNode.length > 0) ? activeNode : selectedItem;
                    firstEle = $(liVisible).first();
                    if (firstEle.hasClass('e-node-disable') || firstEle.hasClass('hidden'))
                        firstEle = this._getNextEle(liVisible, firstEle);
                    if ((selectedItem.length > 0 && activeNode.length == 0 && selectedItem[0] != firstEle[0]) || (activeNode.length > 0 && activeNode[0] != firstEle[0])) {
                        if (proxy._KeyPressEventHandler(firstEle, proxy, code, e)) return;
                        proxy._onKeyDown(ele, firstEle);
                    }
                }
                else if (code == 35 && !e.altKey) {
                    e.preventDefault();
                    var lastEle, ele = (activeNode.length > 0) ? activeNode : selectedItem;
                    lastEle = $(liVisible).last();
                    if (lastEle.hasClass('e-node-disable') || lastEle.hasClass('hidden'))
                        lastEle = this._getPrevEle(liVisible, lastEle);
                    if ((selectedItem.length > 0 && activeNode.length == 0 && selectedItem[0] != lastEle[0]) || (activeNode.length > 0 && activeNode[0] != lastEle[0])) {
                        if (proxy._KeyPressEventHandler(lastEle, proxy, code, e)) return;
                        proxy._onKeyDown(ele, lastEle);
                    }
                }
                else if (code == 13) {
                    e.preventDefault();
                    var currentEle = (activeNode.length > 0) ? activeNode : selectedItem;
                    var angEle = currentEle.find('> div > .e-text');
                    angEle.removeClass('e-node-focus');
                    this.model.fullRowSelect && currentEle.removeClass("e-li-focus");
                    angEle.hasClass('e-active') ? (proxy.model.allowMultiSelection && proxy._nodeUnSelectionAction(currentEle, event)) : proxy._nodeSelectionAction(currentEle, e);
                    proxy._focusedNode = currentEle;
                }
                else if (code == 32) {
                    e.preventDefault();
                    var currentEle = (activeNode.length > 0) ? activeNode : selectedItem;
                    if (currentEle.length > 0 && this.model.showCheckbox) {
                        var chkBoxEle = currentEle.find("> div > .e-chkbox-wrap > .nodecheckbox:first")[0];
                        if (chkBoxEle.checked)
                            this._nodeUncheck(chkBoxEle);
                        else
                            this._nodeCheck(chkBoxEle);
                        proxy._focusedNode = currentEle;
                    }
                }
                else if (code == 46) {
                    e.preventDefault();
                    var currentEle = (activeNode.length > 0) ? activeNode : (this.model.allowMultiSelection ? element.find(".e-item > div > .e-text.e-active").closest('.e-item') : selectedItem);
                    (currentEle.length > 0) && this._removeNode(currentEle, e);
                }
                else if (e && e.ctrlKey == true) {
                    if (code == 88 && this.model.allowDragAndDrop && this.model.allowDropChild) {
                        e.preventDefault();
                        var currentEle = (activeNode.length > 0) ? activeNode : selectedItem;
                        if (currentEle.length > 0) {
                            var parent = currentEle.parents('.e-item:first');
							if (this._triggerEvent('beforeCut', { target: currentEle, nodeDetails: this._getNodeDetails(currentEle), keyCode: code, event: e })) return;
                            this._cutNode = $(liVisible[liVisible.index(currentEle)]).detach();
                            if ($(this._cutNode)[0] != null) {                                
                                this._isRender = false;
                                this.unselectNode(currentEle);
                                if (parent.find('> ul > .e-item').length == 0) {
                                    this.collapseNode(parent);
                                    this._modifyCss(parent);
                                }
                                this._isRender = true;
                                this._triggerEvent('nodeCut', { parentElement: parent, parentDetails: this._getNodeDetails(parent), keyCode: code, event: e });
                            }
                        }
                    }
                    else if (code == 86 && this._cutNode != null && this.model.allowDragAndDrop && this.model.allowDropChild) {
                        e.preventDefault();
                        var currentEle = (activeNode.length > 0) ? activeNode : selectedItem;
                        currentEle = $(liVisible[liVisible.index(currentEle)]);
                        currentEle.length === 0 && (currentEle = this.element);
                        var element = this._cutNode.find(" > div > .e-text").first();
                        if ($(liVisible).length > 0) {
                            if (this._triggerEvent('beforePaste', { target: currentEle, nodeDetails: this._getNodeDetails(currentEle), keyCode: code, event: e })) return;
                            this._isRender = false;
                            this._dropAsChildNode(currentEle, element, e);
                            this._isRender = true;
                            this._cutNode = null;
                            var currentNode = element.closest('.e-item');
                            this._triggerEvent('nodePaste', { target: currentNode, nodeDetails: this._getNodeDetails(currentNode), keyCode: code, event: e });
                        }
                    }
                    else if (proxy.model.allowMultiSelection)
                        proxy._focusedNode = activeNode;
                }
            }
        },

        _getNextEle: function (liVisible, ele) {
            var index = liVisible.index(ele), nextEle;
            do {
                index++;
                nextEle = $(liVisible[index]);
            }
            while (nextEle.hasClass('e-node-disable') || nextEle.hasClass('hidden'))
            return nextEle;
        },

        _getPrevEle: function (liVisible, ele) {
            var index = liVisible.index(ele), prevEle;
            do {
                index--;
                prevEle = $(liVisible[index]);
            }
            while (prevEle.hasClass('e-node-disable') || prevEle.hasClass('hidden'))
            return prevEle;
        },

        _removeChildNodes: function (obj, groupedObj, id) {
            var len = 0, currentid;
            for (var i = 0; i < groupedObj.length; i++) {
                var parentId = ej.getObject(this.model.fields.parentId, groupedObj[i][0]);
                if (!ej.isNullOrUndefined(parentId) && (parentId).toString() == id) {
                    len = groupedObj[i].length; break;
                }
            }
            for (var i = 0; i < len; i++) {
                for (var j = 0; j < obj.length; j++) {
                    var parentID = ej.getObject(this.model.fields.parentId, obj[j]);
                    if (!ej.isNullOrUndefined(parentID) && (parentID).toString() == id) {
                        if (!ej.isNullOrUndefined(obj[j])) currentid = ej.getObject(this.model.fields.id, obj[j]).toString();
                        obj.splice(j, 1);
                        this._removeChildNodes(obj, groupedObj, currentid);
                        break;
                    }
                }
            }
        },

        _removeNode: function (node, event) {
            if (node[0] == null) return;
            if (node[0] != null && node.length > 0) {
                var parentNode, currentNode, _dataObj, liVisible, childNodes, proxy = this;
                parentNode = $(node[0]).closest('ul').closest('.e-item');
                currentNode = $(node[0]);
                if (this._triggerEvent('beforeDelete', { target: currentNode, nodeDetails: this._getNodeDetails(currentNode), parentElement: (parentNode[0] != null) ? parentNode : null, parentDetails: this._getNodeDetails(parentNode), event: event, removedNodes: node })) return;
                this._isRender = false;
                if (this.dataSource() instanceof ej.DataManager) {
                    _dataObj = this._newDataSource;
                    this._removeData(node, _dataObj);
                }
                else if (!ej.isNullOrUndefined(this.dataSource()) && this.dataSource().length > 0) {
                    _dataObj = this.dataSource();
                    this._removeData(node, _dataObj);
                    if (this._deepWatch) {
                        this._oldDataSource = JSON.parse(JSON.stringify(_dataObj));
						this.dataSource(_dataObj);
                    }
                }
                node.remove();
                this._modifyCss(parentNode);
                this._updateNodes();
                this._updateCheckState(parentNode);
                this._isRender = true;
                if (this._triggerEvent('nodeDelete', { parentElement: (parentNode[0] != null) ? parentNode : null, parentDetails: this._getNodeDetails(parentNode), event: event, removedNodes: node })) return;
                var proxy = this, _dataObj = this.dataSource();
                setTimeout(function () {
                    if (proxy.dataSource() != null && !(proxy.dataSource() instanceof ej.DataManager))
                        proxy._dataSource = proxy._groupingObjects(_dataObj, function (_dataObj) { return [!ej.isNullOrUndefined(_dataObj) && [ej.getObject(proxy.model.fields.parentId, _dataObj)].toString()]; });
                }, 300);
            }
        },

        _removeData: function (node, _dataObj) {
            for (var j = 0, len = node.length; j < len; j++) {
                (this._templateType == 2) ? this._removeRemoteData(_dataObj, $(node[j]), this.model.fields) : this._removeLocalData(_dataObj, $(node[j]));;
            }
        },

        _removeLocalData: function (_dataObj, currentNode) {
            var proxy = this;
            for (var i = 0; i < _dataObj.length; i++) {
                var id = currentNode.attr("id");
                var fieldId = ej.getObject(this.model.fields.id, _dataObj[i]);
                if (fieldId && (fieldId).toString() == id) {
                    var groupedObj = this._groupingObjects(_dataObj, function (_dataObj) { return [!ej.isNullOrUndefined(_dataObj) && [ej.getObject(proxy.model.fields.parentId, _dataObj)].toString()]; });
                    _dataObj.splice(i, 1);
                    this._removeChildNodes(_dataObj, groupedObj, id);
                    break;
                }
            }
        },

        _removeRemoteData: function (obj, currentNode, mapper) {
            for (var i = 0; i < obj.length; i++) {
                var id = currentNode.attr("id");
                var fieldId = ej.getObject(mapper.id, obj[i]);
                if (fieldId && (fieldId).toString() == id) {
                    obj.splice(i, 1);
                    break;
                }
                if (obj[i].hasOwnProperty('child'))
                    this._removeRemoteData(obj[i].child, currentNode, mapper.child ? mapper.child : mapper);
            }
        },

        _updateNodes: function () {
            this._beforeBaseClass();
            this._applyFirstLastChildClass();
            this._updateExpandedNodes();
            this._updateCheckedNodes();
            this._updateSelectedNode();
        },

        _updateField: function (obj, searchId, mapper, fieldName, fieldValue) {
            if (ej.isNullOrUndefined(mapper) || this.dataSource() == null || ej.isNullOrUndefined(obj) || ej.isNullOrUndefined(searchId) || ej.isNullOrUndefined(fieldName)) return;
            if (this._templateType == 1) {
                for (var i = 0, objlen = obj.length; i < objlen; i++) {
                    var fieldId = ej.getObject(mapper.id, obj[i]);
                    if (!ej.isNullOrUndefined(obj[i]) && !ej.isNullOrUndefined(fieldId) && fieldId.toString() == searchId) {
                        var fname = mapper[fieldName] ? mapper[fieldName] : fieldName;
                        obj[i][fname] = fieldValue;
                        if (fieldValue == false) delete obj[i][fname];
                        var newobj = obj[i];
                        obj.splice(i, 1, newobj);
                        break;
                    }
                }
            }
            else {
                for (var i = 0, objlen = obj.length; i < objlen; i++) {
                    var fieldID = ej.getObject(mapper.id, obj[i]);
                    if (!ej.isNullOrUndefined(obj[i]) && !ej.isNullOrUndefined(fieldID) && fieldID.toString() == searchId) {
                        var fname = mapper[fieldName] ? mapper[fieldName] : fieldName;
                        obj[i][fname] = fieldValue;
                        if (fieldValue == false) delete obj[i][fname];
                        var newobj = obj[i];
                        obj.splice(i, 1, newobj);
                        break;
                    }
                    if (obj[i].hasOwnProperty('child'))
                        this._updateField(obj[i].child, searchId, mapper.child ? mapper.child : mapper, fieldName, fieldValue);
                }
            }
        },

        _removeField: function (obj, mapper, fieldName) {
            if (ej.isNullOrUndefined(mapper) || this.dataSource() == null || ej.isNullOrUndefined(obj)) return;
            for (var i = 0; i < obj.length; i++) {
                if (obj[i][mapper[fieldName]] != undefined) delete obj[i][mapper[fieldName]];
                if (obj[i].hasOwnProperty('child'))
                    this._removeField(obj[i].child, mapper.child ? mapper.child : mapper, fieldName);
            }
        },

        _KeyPressEventHandler: function (nextElement, proxy, code, event) {
            var nodeDetails, data, path, isExpanded;
            if ($(nextElement)[0] != null) {
                isExpanded = this._isNodeExpanded(nextElement);
                nodeDetails = this._getNodeDetails(nextElement);
                path = proxy._getPath(nextElement);
                data = { keyCode: code, currentElement: nextElement, value: nodeDetails.text, isExpanded: isExpanded, path: path, event: event, id: nodeDetails.id, parentId: nodeDetails.parentId };
            } else {
                data = { keyCode: code, currentElement: nextElement, value: "", isExpanded: "", path: "", event: event, id: "", parentId: "" };
            }
            return this._triggerEvent('keyPress', data);
        },

        _documentClick: function (event) {
            if (event.target.id != 'Edit_Input')
                var editTextBox = $('#Edit_Input')[0], aTag, newText;
            if (editTextBox != null) {
                var aTag = $(editTextBox).closest('.e-text')[0], newText = editTextBox.value, parent = $(editTextBox).closest('.e-item');
                $(editTextBox).remove();
                aTag.lastChild.nodeValue = newText;
                $(aTag).removeClass('e-editable').removeAttr('style');
                this._updateField(this._newDataSource, parent.attr('id'), this.model.fields, "text", newText);
                if (this._deepWatch) {
                    this._oldDataSource = JSON.parse(JSON.stringify(this._newDataSource));
					this.dataSource(this._newDataSource);
                }
                this._triggerEvent('nodeEdit', { id: parent.attr('id'), oldText: this._beforeEditText, newText: newText, target: parent, nodeDetails: this._getNodeDetails(parent), event: event });
            }
            if (this.element.find(event.target).length == 0) {
                var ele = this.element.find('.e-item > div > .e-text.e-node-focus');
                this._focusedNode = ele.closest('.e-item');
                ele.removeClass('e-node-focus');
            }
            else if ($(event.target).hasClass("e-active"))
                this._focusedNode = this.element.find(event.target).closest('.e-item');
        },

        _saveAction: function (values, event) {
            var newText = values.val(), parent = values.closest('.e-item'), aTag = values.closest('.e-text')[0], template_id = values.closest("li")["0"].id;
            values.remove();
            if (aTag != null) {
                aTag.lastChild.nodeValue = newText;
                $(aTag).removeClass('e-editable');
                this._updateField(this._newDataSource, parent.attr('id'), this.model.fields, "text", newText);
                if(this.model.template){
                   aTag.innerHTML = this._renderEjTemplate(this.model.template, this.getTreeData(template_id)["0"]);
                }
                if (this._deepWatch) {
                    this._oldDataSource = JSON.parse(JSON.stringify(this._newDataSource));
					this.dataSource(this._newDataSource);
                }
                this._triggerEvent('nodeEdit', { id: parent.attr('id'), oldText: this._beforeEditText, newText: newText, target: parent, nodeDetails: this._getNodeDetails(parent), event: event });
                this.element.focus();
                this._focusedNode = parent;
            }
        },

        _cancelAction: function (values) {
            var aTag = values.closest('.e-text')[0];
            values.remove();
            aTag.lastChild.nodeValue = this._beforeEditText;
            $(aTag).removeClass('e-node-hover e-editable');
            this.element.focus();
        },

        _mouseEnterEvent: function (event) {
            this.element.find('.e-node-hover').removeClass("e-node-hover");
            if ($(event.currentTarget).hasClass("e-text") && !$(event.currentTarget).hasClass("e-node-disable"))
                $(event.currentTarget).addClass("e-node-hover");
        },

        _mouseLeaveEvent: function (event) {
            $(event.currentTarget).removeClass("e-node-hover");
        },

        _liMouseEnterEvent: function (event) {
            this.element.find('.e-node-hover').removeClass("e-node-hover");
            this.element.find('.e-li-hover').removeClass("e-li-hover");
            var curLi = $(event.currentTarget).closest('.e-item');
            var curAng = curLi.find("> div .e-text");
            if (curAng.length > 0 && !curAng.hasClass("e-node-disable")) {
                curAng.addClass("e-node-hover");
                curLi.addClass("e-li-hover");
            }
        },

        _liMouseLeaveEvent: function (event) {
            var curLi = $(event.currentTarget).closest('.e-item');
            curLi.find("> div .e-text").removeClass("e-node-hover");
            curLi.removeClass("e-li-hover");
        },

        _onFocusOutHandler: function (event) {
            if (!this._isPopup) this._hidePopup();
            this._isPopup = false;
        },

        _createObjectByText: function (text, targetNode) {
            if (typeof text != "string") return;
            var obj = {};
            ej.createObject(this.model.fields.text, text, obj);
            if ($(targetNode)[0] != null)
                ej.createObject(this.model.fields.parentId, targetNode[0].getAttribute('id'), obj);
            return obj;
        },

        _addNodesWhenObject: function (obj, selectedNode) {
            var tempObj = JSON.stringify(this._dataSource), _dataObj = this.dataSource(), parentId, tempType;
            this._dataSource = [];
            if (this.dataSource() != null && this.dataSource() instanceof ej.DataManager)
                _dataObj = [];
            if (selectedNode[0] != null && selectedNode.length > 0)
                parentId = selectedNode[0].getAttribute('id');
            if (ej.isNullOrUndefined(obj.length)) {
                this._dataSource.push(obj);
                if (!ej.isNullOrUndefined(this.dataSource())) {
                    this._setNodeId(obj, this.model.fields);
                    (!ej.isNullOrUndefined(parentId)) && (ej.createObject(this.model.fields.parentId, parentId, obj));
                    _dataObj.push(obj);
                }
            }
            else {
                this._dataSource = obj;
                if (!ej.isNullOrUndefined(this.dataSource())) {
                    for (var j = 0; j < obj.length; j++) {
                        this._setNodeId(obj[j], this.model.fields);
                        if (parentId)
                            ej.createObject(this.model.fields.parentId, parentId, obj[j]);
                        else
                            this._deepPropertyDelete(this.model.fields.parentId, obj[j]);
                        _dataObj.push(obj[j]);
                    }
                }
            }
            tempType = this._templateType;
            this._templateType = 2;
            if (!this._liList)
                this._liList = $("li", this.element);
            var fragmentObj = document.createDocumentFragment();
            for (var i = 0, len = this._dataSource.length ; i < len; i++) {
                fragmentObj.appendChild(this._genTemplate(this._dataSource[i], this.model.fields));
                this._liList.push($(fragmentObj).children()[0]);
                if (this.dataSource() instanceof ej.DataManager) {
                    this._addRemoteData(this._newDataSource, parentId, this._dataSource[i], this.model.fields);
                }
            }
            this._templateType = tempType;
            if (this.dataSource() != null && !(this.dataSource() instanceof ej.DataManager)) {
                this._dataSource = JSON.parse(tempObj);
                if (this._deepWatch) {
                    this._oldDataSource = JSON.parse(JSON.stringify(_dataObj));
					this.dataSource(_dataObj);
                }
            }
            return fragmentObj;
        },

        _setNodeId: function (dataObj, mapper) {
            var mapId = (mapper && mapper.id) ? mapper.id : this.model.fields.id;
            if (ej.isNullOrUndefined(dataObj[mapId]) || dataObj[mapId] == "") {
                dataObj[mapId] = this._id + "_" + this._indexID;
                this._indexID++;
            }
            if (dataObj.hasOwnProperty('child')) {
                var childObj = dataObj.child;
                for (var i = 0, len = childObj.length; i < len; i++) {
                    this._setNodeId(childObj[i], mapper.child);
                }
            }
        },

        _addExpandedNodes: function (index) {
            var _nodes = this.model.expandedNodes;
            this._removeNullInArray(_nodes);
            if ($.inArray(index, _nodes) == -1)
                this.model.expandedNodes.push(index);
            this._persistValues(this.model.expandedNodes, "expandedNodes");
        },

        _removeExpandedNodes: function (index) {
            var _nodes = this.model.expandedNodes;
            if ($.inArray(index, _nodes) > -1) {
                this.model.expandedNodes.splice($.inArray(index, _nodes), 1);
                _nodes.length == 0 && (_nodes.push(-1));
            }
            this._persistValues(this.model.expandedNodes, "expandedNodes");
        },

        _persistValues: function (indexColl, valueType) {
            if (!ej.isNullOrUndefined(this.model.fields) && this.dataSource() != null) {
                var _nodes = indexColl, idColl = [], ele, id;
                for (var i = 0, len = _nodes.length; i < len; i++) {
                    if (!ej.isNullOrUndefined(_nodes[i]) && _nodes[i] >= 0) {
                        ele = this._liList[_nodes[i]], id = $(ele).attr('id');
                        (id) && idColl.push(id);
                    }
                }
                var cookieData = this._getCookies("_persistedValues");
                if (cookieData) {
                    var parsedData = JSON.parse(cookieData);
                    parsedData[valueType] = idColl;
                    parsedData = this._updatePersistAttr(parsedData);
                    this._setCookies("_persistedValues", JSON.stringify(parsedData));
                }
            }
        },

        _updatePersistAttr: function (parsedData) {
            if (ej.isNullOrUndefined(this._ignoreOnPersist)) {
                if ($.inArray('selectedNodes', this._addToPersist) == -1) delete parsedData.selectedNodes;
                if ($.inArray('expandedNodes', this._addToPersist) == -1) delete parsedData.expandedNodes;
                if ($.inArray('checkedNodes', this._addToPersist) == -1) delete parsedData.checkedNodes;
            }
            else {
                if ($.inArray('selectedNodes', this._ignoreOnPersist) > -1) delete parsedData.selectedNodes;
                if ($.inArray('expandedNodes', this._ignoreOnPersist) > -1) delete parsedData.expandedNodes;
                if ($.inArray('checkedNodes', this._ignoreOnPersist) > -1) delete parsedData.checkedNodes;
            }
            return parsedData;
        },

        _onChecked: function (element, args) {
            var liElement = element.closest('.e-item'), isChecked, evt, checknode, data;
            var nodeDetails = this._getNodeDetails(liElement);
            this._CurrenctSelectedNodes.push(nodeDetails.text);
            isChecked = this._isChecked(liElement);
            evt = !ej.isNullOrUndefined(args) ? !ej.isNullOrUndefined(args.event) ? args.event : "" : "";
            data = { currentElement: liElement, id: nodeDetails.id, parentId: nodeDetails.parentId, value: nodeDetails.text, currentNode: this._CurrenctSelectedNodes, currentCheckedNodes: this._checkedArray, isChecked: isChecked, event: evt };
            if (this._isRender) this._triggerEvent('nodeCheck', data);
        },

        _onUnChecked: function (element, args) {
            var liElement = element.closest('.e-item'), isUnChecked, evt, unchecknode, data;
            var nodeDetails = this._getNodeDetails(liElement);
            this._CurrenctSelectedNodes.push(nodeDetails.text);
            isUnChecked = this._isChecked(liElement);
            evt = !ej.isNullOrUndefined(args) ? !ej.isNullOrUndefined(args.event) ? args.event : "" : "";
            data = { currentElement: liElement, id: nodeDetails.id, parentId: nodeDetails.parentId, value: nodeDetails.text, currentNode: nodeDetails.text, currentUncheckedNodes: this._uncheckedArray, isChecked: isUnChecked, event: evt };
            this._triggerEvent('nodeUncheck', data);
        },

        _addCheckNodes: function (item) {
            var checkedArray = this.model.checkedNodes;
            this._removeNullInArray(checkedArray);
            !checkedArray instanceof Array && (checkedArray = []);
            if (checkedArray.indexOf(item) == -1) checkedArray.push(item);
        },

        _removeCheckNodes: function (item) {
            var checkedArray = this.model.checkedNodes;
            !checkedArray instanceof Array && (checkedArray = []);
            var i = checkedArray.indexOf(item);
            if (i != -1) {
                checkedArray.splice(i, 1);
                checkedArray.length == 0 && (checkedArray.push(-1));
            }
        },

        _removeNullInArray: function (array) {
            var i = array.indexOf(-1);
            if (i != -1) array.splice(i, 1);
        },

        _afterInsertingNode: function (outerLi) {
            this._addDragableClass();
            this._finalizeEditing(outerLi);
            var parentLi = outerLi.closest('ul').closest('.e-item');
            this._modifyCss(parentLi);
            this._updateCheckState(parentLi);
            this._isSelectedAction();
            if (parentLi.length > 0 && parentLi.hasClass('e-node-disable'))
                this._nodeDisableAction(parentLi);
            this._updateSelectedNode();
        },

        _insertBeforeOrAfter: function (txtobj, afterEle, before) {
            afterEle = this._getNodeByID(afterEle);
            if (afterEle[0] != null && afterEle.is('LI') && afterEle.hasClass('e-item')) {
                if (this._triggerEvent('beforeAdd', { data: txtobj, targetParent: (afterEle[0] != null) ? afterEle : null, parentDetails: this._getNodeDetails(afterEle) })) return;
                this._isRender = false;
                if (typeof txtobj != 'object')
                    txtobj = this._createObjectByText(txtobj);
                if (typeof txtobj != "object") return;
                (ej.getObject(this.model.parentId, txtobj)) && this._deepPropertyDelete(this.model.parentId, txtobj);
                outerLi = this._addNodesWhenObject(txtobj, afterEle);
                temp = document.createElement('ul');
                $(temp).append(outerLi); outerLi = $(temp.children);
                this.model.showCheckbox && outerLi.children().find(".nodecheckbox").ejCheckBox({ cssClass: this.model.cssClass, change: this._checkedChange });
                (afterEle.parents('.e-item:first').length > 0) ? afterEle.parents('.e-item:first').append(outerLi) : this.element.append(outerLi);
                this.model.showCheckbox && this._isCheckedAction();
                this._dropAsSiblingNode(afterEle, outerLi.find("> div > .e-text"), before, "");
                this._afterInsertingNode(outerLi);
                this._isRender = true;
                this._triggerEvent('nodeAdd', { data: txtobj, nodes: outerLi, parentElement: (afterEle[0] != null) ? afterEle : null, parentDetails: this._getNodeDetails(afterEle) });
                var proxy = this, _dataObj = this.dataSource();
                setTimeout(function () {
                    if (proxy.dataSource() != null && !(proxy.dataSource() instanceof ej.DataManager))
                        proxy._dataSource = proxy._groupingObjects(_dataObj, function (_dataObj) { return [!ej.isNullOrUndefined(_dataObj) && [ej.getObject(proxy.model.fields.parentId, _dataObj)].toString()]; });
                }, 300);
            }
        },

        _getNodeByID: function (node) {
            if (typeof node != "object" && node != "" && node != undefined) return this.element.find(this._checkValidId(node.toString()));
            node = $(node);
            (node.is("A") && node.hasClass('e-text')) && (node = node.closest('.e-item'));
            return node;
        },

        _checkValidId: function (myid) {
            return (myid[0] == "#") ? myid.replace(/(:|\.|\[|\]|,)/g, "\\$1") : "#" + myid.replace(/(:|\.|\[|\]|,)/g, "\\$1");;
        },

        _isTreeElement: function (node) {
            return $(node)[0] != null && node.is('LI') && node.hasClass('e-item');
        },

        _isUrl: function (url) {
            var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
            return regexp.test(url);
        },

        _getChildUl: function (ele) {
            return this.model.fullRowSelect ? ele.children[2] : ele.children[1];
        },

        _sendAjaxOptions: function (url, trgt) {
            var proxy = this, dataobj, ajaxOptions;
            dataobj = this._getNodeDetails(trgt);
            dataobj['mapper'] = this.model.fields;
            dataobj['model'] = this.model;
            ajaxOptions = {
                url: url, data: dataobj, type: 'POST', async: true, crossDomain: true,
                dataType: 'JSON', contentType: "application/json; charset=utf-8",
                "success": function (data) {
                    try {
                        proxy._ajaxSuccessHandler(data, trgt);
                    } catch (e) { }
                }, "error": function (data) {
                    try {
                        proxy._ajaxErrorHandler(data);
                    } catch (e) { }
                }
            };
            this._sendAjaxRequest(ajaxOptions);
        },

        _sendAjaxRequest: function (ajaxOptions) {
            var temp = JSON.parse(JSON.stringify(ajaxOptions));
            delete temp.success;     // To prevent user to edit ajax success and edit event handler
            delete temp.error;
            if (this._triggerEvent('beforeLoad', { ajaxOptions: temp })) return;
            delete temp.success;
            delete temp.error;
            $.extend(ajaxOptions, temp);  // The modified data will be restored in ajaxOptions
            $.ajax({
                type: ajaxOptions.type,
                url: ajaxOptions.url,
                dataType: ajaxOptions.dataType,
                data: ajaxOptions.data,
                async: ajaxOptions.async,
                contentType: ajaxOptions.contentType,
                crossDomain: ajaxOptions.crossDomain,
                success: ajaxOptions.success,
                error: ajaxOptions.error,
            });
        },

        _ajaxSuccessHandler: function (data, targetNode) {
            this._isRender = false;        // To prevent event triggering
            (typeof data == "object") && this.addNode(data, targetNode);
            this._isRender = true;
            this._triggerEvent('loadSuccess', { data: data, targetParent: targetNode, parentDetails: this._getNodeDetails(targetNode) });
        },

        _ajaxErrorHandler: function (args) {
            this._triggerEvent('loadError', { error: args });
        },

        _wireEvents: function () {
            if (this._isDevice && $.isFunction($.fn.tap)) this._on(this.element.find('li'), 'tap', this._ClickEventHandler);
            else this._on(this.element, "click", this._ClickEventHandler)
            this._on(this.element, (this._isDevice && $.isFunction($.fn.tap)) ? this._touchExpandOn : this.model.expandOn, this._expandEventHandler)
                ._on(this.element, "focus", this._onFocusHandler)
                ._on(this.element, "blur", this._onFocusOutHandler);
            this._wholeRowEvents("_on");
			this.model.allowEditing && this._allowEditable();
			this.model.allowDragAndDrop && this._addDragableClass();
			this.model.showCheckbox && this.element.find('.nodecheckbox').ejCheckBox("enable");
            this.model.allowKeyboardNavigation && this._on(this.element, "keydown", this._KeyPress);
        },

        _unWireEvents: function () {
            if (this._isDevice && $.isFunction($.fn.tap)) this._off(this.element.find('li'), "tap")
            else this._off(this.element, "click")
            this._off(this.element, (this._isDevice && $.isFunction($.fn.tap)) ? this._touchExpandOn : this.model.expandOn)
                ._off(this.element, "focus")
                ._off(this.element, "blur");
            this._wholeRowEvents("_off");
            this._preventEditable();
            this._preventDraggable();
            this.model.allowKeyboardNavigation && this._off(this.element, 'keydown');
            this.model.showCheckbox && this.element.find('.nodecheckbox').ejCheckBox("disable");
        },

        _wholeRowEvents: function (action) {
            if (this.model.fullRowSelect) {
                this[action](this.element, (this._isDevice && $.isFunction($.fn.touchstart)) ? "touchstart" : "mouseenter", ".e-text-wrap", this._liMouseEnterEvent);
                this[action](this.element, (this._isDevice && $.isFunction($.fn.touchend)) ? "touchend" : "mouseleave", ".e-text-wrap", this._liMouseLeaveEvent);
                this[action](this.element, (this._isDevice && $.isFunction($.fn.touchstart)) ? "touchstart" : "mouseenter", ".e-fullrow", this._liMouseEnterEvent);
                this[action](this.element, (this._isDevice && $.isFunction($.fn.touchend)) ? "touchend" : "mouseleave", ".e-fullrow", this._liMouseLeaveEvent);
            }
            else {
                this[action](this.element, (this._isDevice && $.isFunction($.fn.touchstart)) ? "touchstart" : "mouseenter", ".e-text", this._mouseEnterEvent);
                this[action](this.element, (this._isDevice && $.isFunction($.fn.touchend)) ? "touchend" : "mouseleave", ".e-text", this._mouseLeaveEvent);
            }
        },

        _enableDragDrop: function () {
            if (this.model.allowDragAndDrop) {
                this._drag();
                this.model.allowDropChild && this._childDrop();
                this.model.allowDropSibling && this._siblingDrop();
            }
        },

        _allowEditable: function () {
                this.element.find('.e-item').addClass('AllowEdit');
                this._on($(document), 'click', this._documentClick)
                    ._on(this.element, (this._isDevice && $.isFunction($.fn.tap)) ? 'doubletap' : 'dblclick', "a.e-text", this._inlineEdit);
        },

        _preventEditable: function () {
            this.element.find('.e-item').removeClass('AllowEdit');
            this._off($(document), 'click')
                ._off(this.element, (this._isDevice && $.isFunction($.fn.tap)) ? 'doubletap' : 'dblclick', "a.e-text");
        },

        _preventDraggable: function () {
            this.element.find('.e-draggable, .e-droppable').removeClass("e-draggable e-droppable");
            this._preventDropSibling();
            this._preventDropChild();
            this._off(this.element, "mouseup touchstart pointerdown MSPointerDown", this._anchors, this._focusElement);
        },

        _preventDropSibling: function () {
            this.element.find('.e-dropsibling').removeClass("e-dropsibling");
        },

        _preventDropChild: function () {
            this.element.find('.e-item > div > .e-dropchild').removeClass("e-dropchild");
        },

        _getNodeData: function (id) {
            if (!ej.isNullOrUndefined(this.model.fields) && this.dataSource() != null && id != undefined) {
                this._updatePersistProb();
                var newList = [], orderedData = [];
                if (this.dataSource() instanceof ej.DataManager && this._templateType == 2) {
                    newList = this._getRemoteNode(this._newDataSource, this.model.fields, id);
                    return newList;
                }
                if (this._templateType == 2) {
                    newList = JSON.parse(JSON.stringify(this._getRemoteNode(this._newDataSource, this.model.fields, id)));
                } else {
                    var predicats = [];
                    var list = this._newDataSource;
                    var query1 = ej.Query().where(this.model.fields.id, "equal", id, false);
                    var filteredList = ej.DataManager(list).executeLocal(query1);
                    var filters = this._getFilterItems(filteredList[0], list);
                    for (var i = 0, flen = filters.length; i < flen; i++) {
                        predicats.push(new ej.Predicate(this.model.fields.id, 'equal', filters[i], false));
                    }
                    var query = ej.Query().where(ej.Predicate.or(predicats));
                    newList = JSON.parse(JSON.stringify(ej.DataManager(list).executeLocal(query)));
                }
                for (var k = 0, dlen = newList.length; k < dlen; k++) {
                    var fieldId = ej.getObject(this.model.fields.id, newList[k]);
                    if ($(document.getElementById(fieldId)).length > 0) {
                        if ($(document.getElementById(fieldId)).find('> ul .e-item').length == 0) {
                            this._deepPropertyDelete(this.model.fields.hasChild, newList[k]);
                            if (this._templateType == 2)
                                delete newList[k]["child"];
                        } else if (this._templateType == 1)
                            ej.createObject(this.model.fields.hasChild, true, newList[k]);
                        else
                            this._updateChildData(newList[k]["child"], this.model.fields);
                        orderedData.push(newList[k]);
                    }
                }
                return orderedData;
            }
        },

        _updateChildData: function (newData, mapper) {
            if (newData == undefined) return;
            for (var i = 0, objlen = newData.length; i < objlen; i++) {
                var id = ej.getObject(mapper.id, newData[i]);
                if ($(document.getElementById(id)).length > 0) {
                    if ($(document.getElementById(id)).find('> ul .e-item').length == 0) {
                        this._deepPropertyDelete(mapper.hasChild, newData[i]);
                        delete newData[i]["child"];
                    } else
                        this._updateChildData(newData[i]["child"], mapper.child ? mapper.child : mapper);
                }
            }
        },

        _getFilterItems: function (fList, list) {
            var nodes = [];
            if (fList == undefined) return nodes;
            var id = ej.getObject(this.model.fields.id, fList);
            nodes.push(id);
            var query2 = ej.Query().where(this.model.fields.parentId, 'equal', id, false);
            var fList1 = ej.DataManager(list).executeLocal(query2);
            for (var l = 0, nlen = fList1.length; l < nlen ; l++) {
                var cNode = this._getFilterItems(fList1[l], list);
                for (var i = 0, clen = cNode.length; i < clen; i++) {
                    nodes.push(cNode[i]);
                }
            }
            return nodes;
        },

        _getRemoteNode: function (obj, mapper, id) {
            var newList = [];
            for (var i = 0, objlen = obj.length; i < objlen; i++) {
                var fieldId = ej.getObject(mapper.id, obj[i]);
                if (fieldId && (fieldId.toString() == id)) {
                    newList.push(obj[i]);
                    return newList;
                }
                if (obj[i].hasOwnProperty('child')) {
                    newList = this._getRemoteNode(obj[i].child, mapper.child ? mapper.child : mapper, id);
                    if (newList.length > 0) return newList;
                }
            }
            return newList;
        },

        _updateRemoteData: function (obj, searchId, childObj, mapper) {
            if (this.dataSource() != null && this.dataSource().dataSource.offline) return;
            for (var i = 0, objlen = obj.length; i < objlen; i++) {
                var fieldId = ej.getObject(mapper.id, obj[i]);
                if (fieldId && (fieldId.toString() == searchId)) {
                    obj[i]["child"] = childObj;
                    var newobj = obj[i];
                    obj.splice(i, 1, newobj);
                    break;
                }
                if (obj[i].hasOwnProperty('child'))
                    this._updateRemoteData(obj[i].child, searchId, childObj, mapper.child ? mapper.child : mapper);
            }
        },

        _addRemoteData: function (obj, searchId, childObj, mapper) {
            if (this.dataSource() != null && this.dataSource().dataSource.offline) return;
            if (ej.isNullOrUndefined(searchId)) {
                obj.push(childObj);
            } else {
                for (var i = 0, objlen = obj.length; i < objlen; i++) {
                    var fieldId = ej.getObject(mapper.id, obj[i]);
                    if (fieldId && (fieldId.toString() == searchId)) {
                        if (ej.isNullOrUndefined(obj[i]["child"])) {
                            obj[i]["child"] = [childObj];
                            var newobj = obj[i];
                            obj.splice(i, 1, newobj);
                        } else {
                            obj[i]["child"].push(childObj);
                        }
                        break;
                    }
                    if (obj[i].hasOwnProperty('child'))
                        this._addRemoteData(obj[i].child, searchId, childObj, mapper.child ? mapper.child : mapper);
                }
            }
        },

        refresh: function () {
            this._unWireEvents();
            this.element.html("");
            this._init();
        },

        expandAll: function (level, excludeHiddenNodes) {
            if (this.model.enableMultipleExpand)
                (level > 0) ? this._expandByLevel(this._getElement(), level, excludeHiddenNodes) : this._expandAll(excludeHiddenNodes);
        },

        collapseAll: function (level, excludeHiddenNodes) {
            if (this.model.enableMultipleExpand)
                (level > 0) ? this._collapseByLevel(this._getElement(), level, excludeHiddenNodes) : this._collapseAll(excludeHiddenNodes);
        },

        checkAll: function () {
            this.model.showCheckbox && this._checkAll();
        },

        unCheckAll: function () {
            this.model.showCheckbox && this._uncheckAll();
        },

        selectNode: function (node) {
            if (node && typeof node == "object" && node.length > 0) {
                this._unselectAll();
                this._doSelectNodes(node, true);
            }
            else {
                node = this._getNodeByID(node);
                this._isTreeElement(node) && this._nodeSelectionAction(node);
            }
        },

        unselectNode: function (node) {
            if (node && typeof node == "object" && node.length > 0)
                this._doUnselectNodes(node);
            else {
                node = this._getNodeByID(node);
                this._isTreeElement(node) && this._nodeUnSelectionAction(node);
            }
        },

        selectAll: function () {
            this.model.allowMultiSelection && this._selectAll();
        },

        unselectAll: function () {
            this.model.allowMultiSelection && this._unselectAll();
        },

        enableNode: function (node) {
            if (node && typeof node == "object" && node.length > 0) {
                for (var i = 0; i < node.length; i++)
                    this.enableNode(node[i]);
            }
            else {
                var item = this._getNodeByID(node);
                this._isTreeElement(item) && this._nodeEnableAction(item);
            }
        },

        disableNode: function (node) {
            if (node && typeof node == "object" && node.length > 0) {
                for (var i = 0; i < node.length; i++)
                    this.disableNode(node[i]);
            }
            else {
                var item = this._getNodeByID(node);
                this._isTreeElement(item) && this._nodeDisableAction(item);
            }
        },

        addNodes: function (collection, targetNode) {
            if (collection && typeof collection == "object" && targetNode == undefined && collection.length > 0) {
                for (var i = 0; i < collection.length; i++)
                    this.addNode(collection[i], targetNode);
            }
            else this.addNode(collection, targetNode);
        },

        addNode: function (newNodeText, targetNode) {
            if (ej.isNullOrUndefined(newNodeText)) return;
            var outerLi = null, innerUl = null, temp, activeNode, id, selectedNode, template;
            selectedNode = targetNode ? this._getNodeByID(targetNode) : (this.model.allowMultiSelection ? this.getSelectedNodes() : this.getSelectedNode());
            if (typeof newNodeText == 'object' && ej.isNullOrUndefined(targetNode)) {
                var parentId = ej.getObject(this.model.fields.parentId, newNodeText);
                if (ej.isNullOrUndefined(newNodeText.length) && !ej.isNullOrUndefined(parentId))
                    id = parentId;
                else if (!ej.isNullOrUndefined(newNodeText.length) && newNodeText.length == 1)
                    id = ej.getObject(this.model.fields.parentId, newNodeText[0]);
                if (id) selectedNode = this._getNodeByID(id);
            }
            selectedNode = (this._isTreeElement(selectedNode)) ? $(selectedNode[0]) : [];
            if (this._triggerEvent('beforeAdd', { data: newNodeText, targetParent: (selectedNode[0] != null) ? selectedNode : null, parentDetails: this._getNodeDetails(selectedNode) })) return;
            (selectedNode.length != 0 && !selectedNode.hasClass('e-node-disable')) && this._expandNode(selectedNode);
            if (typeof newNodeText != 'object')
                newNodeText = this._createObjectByText(newNodeText, selectedNode);
            if (typeof newNodeText != "object" || (ej.isNullOrUndefined(newNodeText.length) && newNodeText.length == 0)) return;
            outerLi = this._addNodesWhenObject(newNodeText, selectedNode);
            temp = document.createElement('ul');
            $(temp).append(outerLi); outerLi = $(temp.children);
            this.model.showCheckbox && outerLi.children().find(".nodecheckbox").ejCheckBox({ cssClass: this.model.cssClass, change: this._checkedChange });
            this._appendNode(selectedNode, outerLi);
            if (selectedNode[0] != null) {
                var imgTag = $(selectedNode[0].childNodes[0].childNodes[0]);
                (imgTag.hasClass('e-plus') || imgTag.hasClass('e-minus')) ? imgTag.removeClass('e-load') : imgTag.removeClass('e-icon e-load');
            }
            (selectedNode[0] != null && selectedNode.find('> div > .e-minus').length > 0 && !this.model.enableMultipleExpand) && this._denyMultipleExpand(selectedNode);
            this._updateNodes();
            this._afterInsertingNode(outerLi);
            if (this._isDevice && $.isFunction($.fn.tap)&&selectedNode[0] == null) {
                this._on(outerLi, 'tap', this._ClickEventHandler);
            }
            this._triggerEvent('nodeAdd', { data: newNodeText, nodes: outerLi, parentElement: (selectedNode[0] != null) ? selectedNode : null, parentDetails: this._getNodeDetails(selectedNode) });
            var proxy = this, _dataObj = this.dataSource();
            setTimeout(function () {
                if (proxy.dataSource() != null && !(proxy.dataSource() instanceof ej.DataManager))
                    proxy._dataSource = proxy._groupingObjects(_dataObj, function (_dataObj) { return [!ej.isNullOrUndefined(_dataObj) && [ej.getObject(proxy.model.fields.parentId, _dataObj)].toString()]; });
            }, 300);
        },

        removeNode: function (node) {
            if (node && typeof node == "object" && node.length > 0) {
                for (var i = 0; i < node.length; i++)
                    this.removeNode(node[i]);
            }
            else {
                var item = node ? this._getNodeByID(node) : (this.model.allowMultiSelection ? this.getSelectedNodes() : this.getSelectedNode());
                this._isTreeElement(item) && this._removeNode(item);
            }
        },

        removeAll: function () {
            this._liList.remove();
            this._updateNodes();
        },

        checkNode: function (node) {
            if (!this.model.showCheckbox) return;
            if (node && typeof node == "object" && node.length > 0) {
                for (var i = 0; i < node.length; i++)
                    this.checkNode(node[i]);
            }
            else {
                var item = this._getNodeByID(node);
                this._isTreeElement(item) && this._nodeCheck(item.find("> div > .e-chkbox-wrap > .nodecheckbox:first")[0]);
            }
        },

        uncheckNode: function (node) {
            if (!this.model.showCheckbox) return;
            if (node && typeof node == "object" && node.length > 0) {
                for (var i = 0; i < node.length; i++)
                    this.uncheckNode(node[i]);
            }
            else {
                var item = this._getNodeByID(node);
                this._isTreeElement(item) && this._nodeUncheck(item.find("> div > .e-chkbox-wrap > .nodecheckbox:first")[0]);
            }
        },

        expandNode: function (node) {
            if (node && typeof node == "object" && node.length > 0) {
                this._allowOnDemand = true;
                this._expandNodes(node, true);
                this._allowOnDemand = false;
            }
            else {
                node = this._getNodeByID(node);
                if (this._isTreeElement(node)) {
                    this._allowOnDemand = true;
                    this._expandNode(node);
                    this._allowOnDemand = false;
                }
            }
        },

        collapseNode: function (node) {
            if (node && typeof node == "object" && node.length > 0) {
                for (var i = 0; i < node.length; i++)
                    this.collapseNode(node[i]);
            }
            else {
                var item = this._getNodeByID(node);
                this._isTreeElement(item) && this._collapseNode(item);
            }
        },

        showNode: function (node) {
            if (node && typeof node == "object" && node.length > 0) {
                for (var i = 0; i < node.length; i++)
                    this.showNode(node[i]);
            }
            else {
                var item = this._getNodeByID(node);
                this._isTreeElement(item) && item.css("visibility", "").removeClass('hidden');
            }
        },

        hideNode: function (node) {
            if (node && typeof node == "object" && node.length > 0) {
                for (var i = 0; i < node.length; i++)
                    this.hideNode(node[i]);
            }
            else {
                var item = this._getNodeByID(node);
                this._isTreeElement(item) && item.css("visibility", "hidden").addClass('hidden');
            }
        },

        show: function () {
            this.element.css("visibility", "").find('.e-item').removeClass('hidden');
        },

        hide: function () {
            this.element.css("visibility", "hidden").find('.e-item').addClass('hidden');
        },

        hasChildNode: function (node) {
            node = this._getNodeByID(node);
            if (this._isTreeElement(node))
                return node.find('> ul > .e-item').length > 0 ? true : false;
        },

        isChildLoaded: function (node) {
            node = this._getNodeByID(node);
            return (this._isTreeElement(node) && node.find('ul > .e-item').length > 0) ? true : false;
        },

        isNodeChecked: function (node) {
            node = this._getNodeByID(node);
            if (this._isTreeElement(node))
                return this._isChecked(node);
        },

        isExpanded: function (node) {
            node = this._getNodeByID(node);
            if (this._isTreeElement(node))
                return this._isNodeExpanded(node);
        },

        isVisible: function (node) {
            node = this._getNodeByID(node);
            return (this._isTreeElement(node) && node.css("visibility") != "hidden") ? true : false;
        },

        isExist: function (node) {
            node = this._getNodeByID(node);
            return (this._isTreeElement(node) && this._liList.index(node) != -1) ? true : false;
        },

        isSelected: function (node) {
            node = this._getNodeByID(node);
            if (this._isTreeElement(node)) return node.find('> div > .e-text').hasClass('e-active');
        },

        isDisabled: function (node) {
            node = this._getNodeByID(node);
            return (this._isTreeElement(node) && node.hasClass('e-node-disable')) ? true : false;
        },

        getTreeData: function (id) {
            if (id != undefined)
                return this._getNodeData(id);
            else if (!ej.isNullOrUndefined(this.model.fields) && this.dataSource() != null)
                return this._orderDataSource();
        },

        getText: function (node) {
            node = this._getNodeByID(node);
            if (this._isTreeElement(node))
                return $.trim(this.element.find(node).find('> div > .e-text').text());
        },

        getSelectedNode: function () {
            return !this.model.allowMultiSelection ? this.element.find('.e-item > div > .e-active').closest('.e-item') : null;
        },

        getSelectedNodes: function () {
            return this.element.find('.e-item > div > .e-active').closest('.e-item');
        },

        getCheckedNodes: function () {
            if (this.model.showCheckbox)
                return this._liList.find('> div > .e-chkbox-wrap[aria-checked="true"]').closest('.e-item');
        },

        getExpandedNodes: function () {
            return this.element.find('.e-item > div > .e-minus').closest('.e-item');
        },

        getExpandedNodesIndex: function () {
            return this._getNodesIndex(this.getExpandedNodes());
        },

        getCheckedNodesIndex: function () {
            return this._getNodesIndex(this.getCheckedNodes());
        },

        getSelectedNodeIndex: function () {
            return !this.model.allowMultiSelection ? this._getNodesIndex(this.getSelectedNode()) : null;
        },

        getSelectedNodesIndex: function () {
            return this._getNodesIndex(this.getSelectedNodes());
        },

        getVisibleNodes: function () {
            return this.element.find('.e-item:visible:not(.hidden, .e-node-disable)');
        },

        getNodeCount: function () {
            return this.element.find('.e-item').length;
        },

        getNode: function (node) {
            node = this._getNodeByID(node);
            return (this._isTreeElement(node)) ? this._getNodeDetails(node) : null;
        },

        getNodeIndex: function (node) {
            node = this._getNodeByID(node);
            if (this._isTreeElement(node))
                return this._liList.index(node);
        },

        getNodeByIndex: function (index) {
            if (typeof index == "number")
                return $(this._liList[index]);
        },

        getParent: function (node) {
            node = this._getNodeByID(node);
            if (this._isTreeElement(node))
                return node.parents('.e-item:first');
        },

        getChildren: function (node, includeNestedChild) {
            node = this._getNodeByID(node);
            if (this._isTreeElement(node))
                return includeNestedChild ? node.find('.e-item') : node.find('> ul > .e-item');
        },

        updateText: function (node, newText) {
            node = this._getNodeByID(node);
            if (this._isTreeElement(node) && !ej.isNullOrUndefined(newText)) {
                var aTag = this.element.find(node).children('div').find('> .e-text')[0], oldText, argsData;
				var template_id = node.closest("li")["0"].id;
                if (aTag != null) {
                    argsData = { currentElement: $(aTag) };
                    if (this._triggerEvent('beforeEdit', argsData))
                        return false;
                    oldText = aTag.lastChild.nodeValue;
                }
                aTag.lastChild.nodeValue = newText;
                this._updateField(this._newDataSource, node.attr('id'), this.model.fields, "text", newText);
				if(this.model.template){
				   aTag.innerHTML = this._renderEjTemplate(this.model.template, this.getTreeData(template_id)["0"]);
                }
                if (this._deepWatch) {
                    this._oldDataSource = JSON.parse(JSON.stringify(this._newDataSource));
					 this.dataSource(this._newDataSource);
                }
                this._triggerEvent('nodeEdit', { id: node.attr('id'), oldText: oldText, newText: newText, target: node, nodeDetails: this._getNodeDetails(node), event: null });
            }
        },

        insertAfter: function (nodeObj, afterEle) {
            this._insertBeforeOrAfter(nodeObj, afterEle, false);
        },

        insertBefore: function (nodeObj, afterEle) {
            this._insertBeforeOrAfter(nodeObj, afterEle, true);
        },

        moveNode: function (srcNode, desNode, index) {
            srcNode = this._getNodeByID(srcNode);
            desNode = this._getNodeByID(desNode);
            if (this._isTreeElement(srcNode)) {
                if ((srcNode.parents('.e-item')[0] == desNode[0] && ej.isNullOrUndefined(index)) || desNode.find(srcNode).index() == index || (desNode[0] == null && this._liList.index(srcNode) == index)) return;
                var target = (desNode[0] != null && index >= 0) ? desNode.find("> ul > .e-item").eq(index) : this.getNodeByIndex(index);
                this._isRender = false;
                if (this._isTreeElement(target)) {
                    if (target.parents('.e-item:first')[0] == srcNode.parents('.e-item:first')[0] && target.next('.e-item')[0] == null)
                        this._dropAsSiblingNode(target, srcNode.find(" > div > .e-text"), false, "");
                    else
                        this._dropAsSiblingNode(target, srcNode.find(" > div > .e-text"), true, "");
                } else {
                    this._dropAsChildNode(desNode, srcNode.find(" > div > .e-text"), "");
                }
                if (desNode.length > 0 && desNode.hasClass('e-node-disable'))
                    this._nodeDisableAction(desNode);
                this._isRender = true;
            }
        },

        loadData: function (url, targetNode) {
            targetNode = this._getNodeByID(targetNode);
            if (this._isUrl(url) && (targetNode[0] == null || (this._isTreeElement(targetNode))))
                this._sendAjaxOptions(url, targetNode);
        },

        ensureVisible: function (node) {
            node = this._getNodeByID(node);
            if (this._isTreeElement(node) && !this.isDisabled(node) && this.isVisible(node)) {
                var parents = node.parents('.e-item'), offset;
                for (var j = 0, len = parents.length; j < len; j++)
                    this._expandNode($(parents[j]));
                offset = node.offset();
                node.animate({ scrollTop: offset.top }, this.model.enableAnimation ? 350 : 0, 'linear', function () {
                    node.find("> div > a.e-text")[0].scrollIntoView(false);
                });
                return true;
            } else
                return false;
        },

        _triggerEvent: function (e, data) {
            if (this._isRender) return this._trigger(e, data);
        },

    });
})(jQuery, Syncfusion);
