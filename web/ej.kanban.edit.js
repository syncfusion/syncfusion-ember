var InternalEdit = (function () {
    function InternalEdit(element) {
        this.kanbanObj = null;
        this._dropDownManager = null;
        this._editForm = null;
        this._onKbnDialogBeforeClose = function () {
            var kObj = this.kanbanObj, $dialogWrapper = kObj.element.find("#" + kObj._id + "_dialogEdit_wrapper");
            $dialogWrapper.addClass('e-kbndialog-transitionclose');
        };
        this._onKbnDialogBeforeOpen = function () {
            var kObj = this.kanbanObj, $dialogWrapper = kObj.element.find("#" + kObj._id + "_dialogEdit_wrapper");
            $dialogWrapper.removeClass('e-kbndialog-transitionclose');
        };
        this.kanbanObj = element;
    }
    ;
    InternalEdit.prototype._processEditing = function () {
        var kObj = this.kanbanObj, query = this._columnToSelect(), proxy = this;
        kObj.model.query._fromTable != "" && query.from(kObj.model.query._fromTable);
        if (kObj._dataSource() instanceof ej.DataManager && query["queries"].length && !kObj._dataManager.dataSource.offline) {
            var queryPromise = kObj._dataSource().executeQuery(query);
            queryPromise.done(ej.proxy(function (e) {
                proxy._dropDownManager = new ej.DataManager(e.result);
                proxy._addDialogEditingTemplate();
            }));
        }
        else {
            proxy._addDialogEditingTemplate();
        }
    };
    InternalEdit.prototype._renderDialog = function () {
        var $dialog = ej.buildTag("div.e-dialog e-kanbandialog e-dialog-content e-shadow e-widget-content", "", { display: "none" }, { id: this.kanbanObj._id + "_dialogEdit" });
        return $dialog;
    };
    InternalEdit.prototype._columnToSelect = function () {
        var item = [], kObj = this.kanbanObj;
        for (var i = 0; i < kObj.model.editSettings.editItems.length; i++) {
            if (kObj.model.editSettings.editItems[i].editType == "dropdownedit" && ej.isNullOrUndefined(kObj.model.editSettings.editItems[i].dataSource))
                item.push(kObj.model.editSettings.editItems[i].field);
        }
        if (item.length)
            return new ej.Query().select(item);
        return new ej.Query();
    };
    InternalEdit.prototype.cancelEdit = function () {
        var kObj = this.kanbanObj;
        if (kObj.model.editSettings.allowEditing || kObj.model.editSettings.allowAdding) {
            if (kObj.model.editSettings.editMode == "dialog" || kObj.model.editSettings.editMode == "dialogtemplate")
                $("#" + kObj._id + "_dialogEdit").ejDialog("close");
            else if (kObj.model.editSettings.editMode == "externalform" || kObj.model.editSettings.editMode == "externalformtemplate") {
                if (kObj.model.editSettings.formPosition == "right")
                    $(kObj.element).children().css("width", "100%");
                $("#" + kObj._id + "_externalEdit").css("display", "none");
            }
            kObj.refreshTemplate();
            var args = { requestType: "cancel" };
            kObj.KanbanCommon._processBindings(args);
        }
        kObj.element.parents('body').removeClass('e-kbnwindow-modal');
        if (kObj.element.hasClass('e-responsive'))
            kObj.kanbanWindowResize();
    };
    InternalEdit.prototype._renderExternalForm = function () {
        var kObj = this.kanbanObj;
        var $externalform = ej.buildTag("div", "", { display: "none" }, { id: kObj._id + "_externalEdit", 'class': "e-form-container" });
        var $eformHeader = ej.buildTag("div", "", "", { id: kObj._id + "_eFormHeader", 'class': "e-form-titlebar" });
        var $eformTitle = ej.buildTag("span", "", "", { 'class': "e-form-title" });
        var $eformCloseBtn = ej.buildTag("div", "", "", { id: kObj._id + "_closebutton", 'class': "e-externalform-icon" });
        var $eformCloseIcon = ej.buildTag("span", "", "", { 'class': "e-icon e-externaledit e-cancel" });
        $eformCloseBtn.append($eformCloseIcon);
        $eformHeader.append($eformTitle).append($eformCloseBtn);
        var $eformContent = ej.buildTag("div", "", "", { id: kObj._id + "_eFormContent", 'class': "e-form-content" });
        var $eform = ej.buildTag("div", "", "", { id: kObj._id + "_externalForm", 'class': "e-externalform" });
        var $contentOuterDiv = ej.buildTag("div", "", "", { 'class': "e-externalformedit" });
        $eform.append($contentOuterDiv);
        $eformContent.append($eform);
        return $externalform.append($eformHeader).append($eformContent);
        ;
    };
    InternalEdit.prototype._maxZindex = function () {
        var maxZ = 1;
        maxZ = Math.max.apply(null, $.map($('body *'), function (e, n) {
            if ($(e).css('position') == 'absolute')
                return parseInt($(e).css('z-index')) || 1;
        }));
        if (maxZ == undefined || maxZ == null)
            maxZ = 1;
        return maxZ;
    };
    InternalEdit.prototype.addCard = function (primaryKey, data) {
        var kObj = this.kanbanObj;
        if (kObj._currentJsonData.length == 0) {
            if (kObj.model.showColumnWhenEmpty && kObj.model.editSettings.allowAdding) {
                var editItems = kObj.model.editSettings.editItems;
                args = { requestType: "add" }, kObj._currentData = {};
                if (kObj._isAddNewClick && kObj.model.keyField)
                    kObj._currentData[kObj.model.keyField] = kObj.model.columns[$(kObj._newCard).index()].key;
                for (var i = 0; i < editItems.length; i++)
                    kObj._currentData[editItems[i].field] = !ej.isNullOrUndefined(editItems[i].defaultValue) ? editItems[i].defaultValue : !ej.isNullOrUndefined(kObj._currentData[editItems[i].field]) ? kObj._currentData[editItems[i].field] : "";
                args.data = kObj._currentData;
                kObj.element.find('.e-kanbandialog').removeAttr('data-id');
                kObj.KanbanCommon._processBindings(args);
                return;
            }
            else {
                var addData = [];
                addData.push(data);
                kObj.element.ejKanban({ "dataSource": addData });
                return;
            }
        }
        if (kObj.model.editSettings.allowAdding) {
            var args, pKey = kObj.model.fields.primaryKey;
            if (primaryKey != "bulk" && $.type(kObj._currentJsonData[0][pKey]) == "number")
                primaryKey = parseInt(primaryKey);
            args = { data: data, requestType: "save", action: "add", primaryKeyValue: primaryKey };
            kObj._cAddedRecord = data;
            kObj._saveArgs = args;
            if (primaryKey && data) {
                kObj.updateCard(primaryKey, data);
                if (kObj.model.showColumnWhenEmpty && kObj.model.initiallyEmptyDataSource) {
                    kObj._kbnSwimLaneData.push(data.Assignee);
                    kObj.KanbanContext._kanbanSubMenu();
                }
            }
            else {
                var editItems = kObj.model.editSettings.editItems;
                args = { requestType: "add" }, kObj._currentData = {};
                if (kObj._isAddNewClick) {
                    if (kObj.model.fields.swimlaneKey)
                        kObj._currentData[kObj.model.fields.swimlaneKey] = $(kObj._newCard).parent().prev('.e-swimlanerow').find('.e-slkey').text();
                    if (kObj.model.keyField)
                        kObj._currentData[kObj.model.keyField] = kObj.model.columns[$(kObj._newCard).index()].key;
                }
                for (var i = 0; i < editItems.length; i++)
                    kObj._currentData[editItems[i].field] = !ej.isNullOrUndefined(editItems[i].defaultValue) ? editItems[i].defaultValue : !ej.isNullOrUndefined(kObj._currentData[editItems[i].field]) ? kObj._currentData[editItems[i].field] : "";
                kObj._currentData[pKey] = kObj._currentJsonData[kObj._currentJsonData.length - 1][pKey];
                if ($.type(kObj._currentJsonData[0][pKey]) == "string")
                    kObj._currentData[pKey] = parseInt(kObj._currentData[pKey]);
                kObj._currentData[pKey] = kObj._currentData[pKey] + 1;
                if ($.type(kObj._currentJsonData[0][pKey]) == "string")
                    kObj._currentData[pKey] = kObj._currentData[pKey].toString();
                args.data = kObj._currentData;
                kObj.element.find('.e-kanbandialog').removeAttr('data-id');
                kObj.KanbanCommon._processBindings(args);
            }
        }
    };
    InternalEdit.prototype.deleteCard = function (primaryKey) {
        var args, kObj = this.kanbanObj, cardDiv, currentData, deleteManager, query, promise, pKey = kObj.model.fields.primaryKey, kObj = this.kanbanObj;
        cardDiv = kObj.element.find("#" + primaryKey);
        deleteManager = new ej.DataManager(kObj._currentJsonData);
        query = new ej.Query();
        query = query.where(kObj.model.fields.primaryKey, ej.FilterOperators.equal, primaryKey);
        currentData = deleteManager.executeLocal(query);
        if ($.type(kObj._currentJsonData[0][pKey]) == "number")
            primaryKey = parseInt(primaryKey);
        args = { div: cardDiv, data: currentData[0], requestType: "delete", primaryKeyValue: primaryKey };
        kObj._saveArgs = args;
        if (kObj._trigger("actionBegin", args))
            return true;
        kObj._cDeleteData = currentData;
        kObj.updateCard(primaryKey, currentData[0]);
    };
    InternalEdit.prototype.startEdit = function ($div) {
        var kObj = this.kanbanObj;
        if ($.type($div) != "object")
            $div = kObj.element.find("#" + $div);
        if (kObj.model.editSettings.allowEditing && $div.hasClass('e-kanbancard')) {
            var parentDiv, args, pKey = kObj.model.fields.primaryKey, primaryKey = $div.attr('id');
            var columnIndex = $div.hasClass("e-rowcell") ? $div.index() : $div.closest(".e-rowcell").index();
            var rowIndex = kObj.getIndexByRow($div.closest("tr")), editingManager, queryManager = new ej.Query();
            parentDiv = $div.closest('.e-kanbancard');
            if (kObj._cardEditClick == true)
                kObj._currentData.data = kObj._dblArgs.data;
            else {
                editingManager = new ej.DataManager(kObj._currentJsonData);
                queryManager = queryManager.where(pKey, ej.FilterOperators.equal, $div.attr('id'));
                kObj._currentData = editingManager.executeLocal(queryManager);
            }
            if ($.type(kObj._currentJsonData[0][pKey]) == "number")
                primaryKey = parseInt(primaryKey);
            args = { target: $div, rowIndex: rowIndex, data: kObj._currentData[0], columnIndex: columnIndex, cardIndex: parentDiv.index(), primaryKeyValue: primaryKey };
            kObj._trigger("beginEdit", args);
            args.requestType = "beginedit";
            if (args.cancel)
                return;
            kObj.KanbanCommon._processBindings(args);
        }
    };
    InternalEdit.prototype._refreshEditForm = function (args) {
        var kObj = this.kanbanObj;
        var tds, inputWidth;
        if (kObj.model.editSettings.editMode == "dialog" || kObj.model.editSettings.editMode == "dialogtemplate") {
            var $dialogWrapper = kObj.element.find("#" + kObj._id + "_dialogEdit_wrapper"), percent = 95;
            $dialogWrapper.show();
            var dialogEditForm = $("#" + kObj._id + "_dialogEdit");
            tds = dialogEditForm.find("tr").find(".e-rowcell");
        }
        else if (kObj.model.editSettings.editMode == "externalform" || kObj.model.editSettings.editMode == "externalformtemplate") {
            var $external = kObj.element.find("#" + kObj._id + "_externalEdit"), percent = 133;
            $external.show();
            var dialogEditForm = $("#" + kObj._id + "_externalForm");
            tds = dialogEditForm.find("div").find(".e-rowcell");
        }
        for (var i = 0; i < tds.length; i++)
            kObj._tdsOffsetWidth[i] = tds.get(i).offsetWidth;
        if (kObj.model.editSettings.editMode == "dialog" || kObj.model.editSettings.editMode == "dialogtemplate")
            inputWidth = ej.max(kObj._tdsOffsetWidth) * (percent / 100);
        for (var count = 0; count < kObj.model.editSettings.editItems.length; count++) {
            var curItem = kObj.model.editSettings.editItems[count], curControl = dialogEditForm.find('#' + kObj._id + "_" + curItem['field']);
            if (kObj.model.editSettings.editMode == "externalform" || kObj.model.editSettings.editMode == "externalformtemplate") {
                inputWidth = ej.max(kObj._tdsOffsetWidth) * (percent / 100);
                $(curControl).parent().css("width", inputWidth + "px");
            }
            var params;
            var customParams;
            if (curItem['editType'] == "stringedit")
                curControl.width(inputWidth - 4);
            var isText = (curItem['editType'] == "textarea"), isExternal = (kObj.model.editSettings.editMode == "externalform" || kObj.model.editSettings.editMode == "externalformtemplate");
            customParams = curItem['editParams'];
            if (!ej.isNullOrUndefined(customParams) && isText) {
                if (!ej.isNullOrUndefined(customParams.width)) {
                    curControl.width(customParams.width);
                    if (isText && isExternal)
                        curControl.parent().width(customParams.width + 8);
                }
                if (!ej.isNullOrUndefined(customParams.height)) {
                    curControl.height(customParams.height);
                    if (isText && isExternal)
                        curControl.parent().height(customParams.height + 8);
                }
            }
            else if (isText && (kObj.model.editSettings.editMode == "dialog" || kObj.model.editSettings.editMode == "dialogtemplate"))
                curControl.width(250).height(95);
            else if (isText && (isExternal && kObj.model.editSettings.formPosition == "bottom")) {
                curControl.height(95);
                $(curControl).css({ "width": "400px" });
                $(curControl).parent().css({ "width": "500px" });
            }
            else if (isText && (isExternal && kObj.model.editSettings.formPosition == "right")) {
                curControl.css({ "width": inputWidth - 8 });
                curControl.height(150);
                $(curControl).parent().css("width", inputWidth + 8);
            }
            if (curItem['editType'] == "rteedit") {
                params = { width: "450px", height: "260px", minHeight: "240px", locale: kObj.model.locale, enableRTL: kObj.model.enableRTL };
                customParams = curItem['editParams'];
                params.toolsList = ["style", "links"];
                params.tools = {
                    style: ["bold", "italic", "underline"],
                    casing: ["upperCase", "lowerCase"],
                    links: ["createLink"]
                };
                if (!ej.isNullOrUndefined(customParams))
                    $.extend(params, customParams);
                dialogEditForm.find('#' + kObj._id + "_" + curItem['field']).ejRTE(params);
            }
            else {
                var value;
                if (curItem['editType'] == "dropdownedit") {
                    params = { width: inputWidth, enableIncrementalSearch: true, enableRTL: kObj.model.enableRTL };
                    value = curControl.val();
                    customParams = curItem['editParams'];
                    var disable = [];
                    if (((curItem.field == kObj.model.keyField)) && args.requestType === "beginedit") {
                        for (var i = 0; i < curControl.children().length; i++) {
                            var dropdownvalue = curControl.children().eq(i).val();
                            if (!ej.isNullOrUndefined(kObj.model.workflows))
                                kObj.KanbanCommon._preventCardMove(value, curControl.children().eq(i).val()) ? true : disable.push(i);
                            if (value != dropdownvalue) {
                                var dropdown = kObj._getColumnKeyIndex(dropdownvalue);
                                if (!ej.isNullOrUndefined(dropdown)) {
                                    if (!kObj.model.columns[dropdown].allowDrop) {
                                        if ($.inArray(i, disable) === -1)
                                            disable.push(i);
                                    }
                                }
                                if (!kObj.model.columns[kObj._getColumnKeyIndex(value)].allowDrag) {
                                    if ($.inArray(i, disable) === -1)
                                        disable.push(i);
                                }
                            }
                        }
                    }
                    if (disable.length > 0)
                        for (var j = disable.length - 1; j >= 0; j--)
                            $(curControl.children()).eq(disable[j]).remove();
                    if (curControl.hasClass("e-disable"))
                        params.enabled = false;
                    if (!ej.isNullOrUndefined(customParams))
                        $.extend(params, customParams);
                    kObj._kbnDdlWindowResize = true;
                    curControl.ejDropDownList(params);
                    curControl.ejDropDownList("setSelectedValue", curControl.val());
                    kObj._kbnDdlWindowResize = false;
                }
                else if (curItem['editType'] == "numericedit") {
                    params = { width: inputWidth };
                    value = curControl.val();
                    customParams = curItem['editParams'];
                    params.cssClass = kObj.model.cssClass;
                    params.showSpinButton = true;
                    params.enableRTL = kObj.model.enableRTL;
                    params.locale = kObj.model.locale;
                    if (value.length)
                        params.value = parseFloat(value);
                    if (curControl.hasClass("e-disable"))
                        params.enabled = false;
                    if (!ej.isNullOrUndefined(customParams))
                        $.extend(params, customParams);
                    curControl.ejNumericTextbox(params);
                }
                else if (curItem['editType'] == "datepicker") {
                    params = { width: inputWidth };
                    value = curControl.val();
                    customParams = curItem['editParams'];
                    params.cssClass = kObj.model.cssClass;
                    params.displayDefaultDate = true;
                    params.enableRTL = kObj.model.enableRTL;
                    params.locale = kObj.model.locale;
                    if (value.length)
                        params.value = new Date(value);
                    if (curControl.hasClass("e-disable"))
                        params.enabled = false;
                    if (!ej.isNullOrUndefined(customParams))
                        $.extend(params, customParams);
                    curControl.ejDatePicker(params);
                }
                else if (curItem['editType'] == "datetimepicker") {
                    params = { width: inputWidth, cssClass: kObj.model.cssClass, locale: kObj.model.locale, showPopupButton: false, enableRTL: kObj.model.enableRTL };
                    value = curControl.val();
                    customParams = curItem['editParams'];
                    if (value.length)
                        params.value = new Date(value);
                    if (curControl.hasClass("e-disable"))
                        params.enabled = false;
                    if (!ej.isNullOrUndefined(customParams))
                        $.extend(params, customParams);
                    curControl.ejDateTimePicker(params);
                }
            }
            if (curItem['editType'] != "textarea")
                $(curControl.outerWidth(inputWidth)).height(28);
            if (ej.browserInfo().name == "msie" && parseInt(ej.browserInfo().version, 10) == 8)
                curControl.css("line-height", "26px");
        }
        if (isExternal)
            kObj._editForm = kObj.element.find(".e-externalform");
        if (kObj.model.editSettings.editMode == "dialog" || kObj.model.editSettings.editMode == "dialogtemplate") {
            kObj._editForm = kObj.element.find(".kanbanform");
            $dialogWrapper.hide();
        }
        this._formFocus();
    };
    InternalEdit.prototype._setKanbanDdlValue = function ($editRow) {
        var $selectDdl = $editRow.find("select.e-field"), x, inputDdl = $editRow.find("input.e-field.e-dropdownlist");
        for (var i = 0; i < $selectDdl.length; i++) {
            var ddlTempl = {};
            ddlTempl[this.kanbanObj._id + "drpDownTempl"] = "{{:" + $selectDdl[i].name.replace(/[^a-z0-9\s]/gi, '') + "}}";
            $.templates(ddlTempl);
            x = $.render[this.kanbanObj._id + "drpDownTempl"](this.kanbanObj._currentData);
            $editRow.find("select").eq(i).val(x).attr("selected", "selected");
            $selectDdl.eq(i).val(x);
        }
        for (var j = 0; j < inputDdl.length; j++)
            inputDdl.eq(j).val(ej.getObject(inputDdl.eq(j).attr("name"), this.kanbanObj._currentData[0]));
    };
    InternalEdit.prototype._editAdd = function (args) {
        var dialogEditForm, kObj = this.kanbanObj, $dialog = kObj.element.find(".e-kanbandialog"), target = $(args.target), editingManager, queryManager = new ej.Query(), pKey = kObj.model.fields.primaryKey;
        var editRow = document.createElement('div'), $editRow = $(editRow), cardId;
        if (args.requestType == "add")
            $editRow.addClass("e-addedrow");
        else {
            kObj._currentData = {};
            if (target.hasClass('e-kanbancard'))
                cardId = target.attr('id');
            else if (target.parents('.e-kanbancard').length > 0)
                cardId = target.parents('.e-kanbancard').attr('id');
            if ($.type(kObj._currentJsonData[0][pKey]) == "number")
                cardId = parseInt(cardId);
            editingManager = new ej.DataManager(kObj._currentJsonData);
            queryManager = queryManager.where(pKey, ej.FilterOperators.equal, cardId);
            kObj._currentData = editingManager.executeLocal(queryManager);
            $editRow.addClass("e-editedrow");
        }
        editRow.innerHTML = $.render[kObj._id + "_dialogEditingTemplate"](kObj._currentData);
        this._setKanbanDdlValue($editRow);
        var titleLbl, title;
        if (args.requestType == "add") {
            if (!ej.isNullOrUndefined(kObj.model.fields.title) && !$.isEmptyObject(kObj._newData)) {
                titleLbl = kObj.model.fields.title;
                title = kObj.localizedLabels.EditFormTitle + kObj._newData[titleLbl];
            }
            else
                title = kObj.localizedLabels.AddFormTitle;
        }
        else {
            titleLbl = pKey;
            if (!ej.isNullOrUndefined(kObj.model.fields.title))
                titleLbl = kObj.model.fields.title;
            title = kObj.localizedLabels.EditFormTitle + kObj._currentData[0][titleLbl];
        }
        if (kObj.model.editSettings.editMode == "dialog" || kObj.model.editSettings.editMode == "dialogtemplate") {
            dialogEditForm = $("#" + kObj._id + "_dialogEdit");
            dialogEditForm.html($(editRow));
            var model = { cssClass: kObj.model.cssClass, enableRTL: kObj.model.enableRTL, width: "auto", content: "#" + kObj._id, close: $.proxy(this.cancelEdit, this), beforeClose: $.proxy(this._onKbnDialogBeforeClose, this), beforeOpen: $.proxy(this._onKbnDialogBeforeOpen, this), open: $.proxy(this._onKbnDialogOpen, this), enableModal: true, enableResize: false, title: title };
            dialogEditForm.ejDialog(model);
            dialogEditForm.ejDialog("open");
            $dialog.attr('data-id', cardId);
            var $dialogWrapper = kObj.element.find("#" + kObj._id + "_dialogEdit_wrapper");
            $dialogWrapper.css("left", "0");
            var wTop;
            if (self != parent) {
                if (ej.browserInfo().name == "chrome")
                    wTop = $(window).scrollTop();
                else
                    wTop = -$(window.frameElement).offset().top;
            }
            else
                wTop = $(window).scrollTop();
            $dialogWrapper.css("top", wTop);
            $dialogWrapper.hide();
        }
        else if (kObj.model.editSettings.editMode == "externalform" || kObj.model.editSettings.editMode == "externalformtemplate") {
            $("#" + kObj._id + "_externalEdit").css("display", "block").css('z-index', this._maxZindex() + 1);
            $("#" + kObj._id + "_externalForm").find(".e-externalformedit").html($(editRow));
            $("#" + kObj._id + "_eFormHeader").find(".e-form-title").text(title);
            $("#" + kObj._id + "_externalForm").attr('data-id', cardId);
            this._externalFormPosition();
        }
        if ($.isFunction($["validator"])) {
            this.initValidator();
            this.setValidation();
        }
    };
    InternalEdit.prototype._onKbnDialogOpen = function () {
        var kObj = this.kanbanObj, $dialogWrapper = kObj.element.find("#" + kObj._id + "_dialogEdit_wrapper");
        $dialogWrapper.css("position", "absolute");
        var top, left;
        var element = $(kObj.element)[0], elementTop, elementLeft, elementWidth, elementHeight;
        elementTop = element.offsetTop;
        elementLeft = element.offsetLeft;
        elementWidth = $(element).find('.e-kanbancontent')[0].offsetWidth;
        elementHeight = $(element).find('.e-kanbancontent')[0].offsetHeight + $(kObj.element).find('.e-kanbanheader')[0].offsetHeight;
        if (window.pageYOffset > elementTop) {
            if ((elementTop + elementHeight) > (window.pageYOffset + window.innerHeight))
                top = Math.max(0, ((window.innerHeight - $dialogWrapper.outerHeight()) / 2));
            else
                top = Math.max(0, (((elementTop + elementHeight - window.pageYOffset) - $dialogWrapper.outerHeight()) / 2));
            top = window.pageYOffset + top;
        }
        else {
            if ((elementTop + elementHeight) > (window.pageYOffset + window.innerHeight))
                top = Math.max(0, (((window.innerHeight - (elementTop - window.pageYOffset)) - $dialogWrapper.outerHeight()) / 2));
            else
                top = Math.max(0, ((elementHeight - $dialogWrapper.outerHeight()) / 2));
            top = elementTop + top;
        }
        if (window.pageXOffset > elementLeft) {
            if ((elementLeft + elementWidth) > (window.pageXOffset + window.innerWidth))
                left = Math.max(0, ((window.innerWidth - $dialogWrapper.outerWidth()) / 2));
            else
                left = Math.max(0, ((((elementLeft + elementWidth) - window.pageXOffset) - $dialogWrapper.outerWidth()) / 2));
            left = window.pageXOffset + left;
        }
        else {
            if ((elementLeft + elementWidth) > (window.pageXOffset + window.innerWidth))
                left = Math.max(0, (((window.innerWidth - (elementLeft - window.pageXOffset)) - $dialogWrapper.outerWidth()) / 2));
            else
                left = Math.max(0, ((elementWidth - $dialogWrapper.outerWidth()) / 2));
            left = elementLeft + left;
        }
        $dialogWrapper.css("top", top + "px");
        $dialogWrapper.css("left", left + "px");
        var rteContent = $dialogWrapper.find(".e-rte").not(".e-rte-wrapper");
        for (var i = 0; i < rteContent.length; i++) {
            var rteId = rteContent.eq(0).attr("id");
            $("#" + rteId).ejRTE("refresh");
        }
        $dialogWrapper.show();
        this._formFocus();
        if (kObj._editForm.find('.e-rte').length > 0)
            kObj.element.find("#" + kObj._id + "_dialogEdit").data("ejDialog")._resetScroller();
        if (kObj.model.isResponsive && kObj.element.hasClass('e-responsive')) {
            kObj._on($('.e-kanban-editdiv'), ($.isFunction($.fn.tap) && kObj.model.enableTouch) ? "tap" : "click", "", kObj._kbnAdaptEditClickHandler);
            kObj.KanbanAdaptive._setAdaptEditWindowHeight();
            if ($dialogWrapper.parents('.e-kanban').length > 0) {
                $dialogWrapper.appendTo("body");
            }
        }
        else {
            var kbnDialog, scroller, title;
            if ($(window).scrollTop() + $(window).height() < ($dialogWrapper.height() + top)) {
                kbnDialog = $('#' + kObj._id + "_dialogEdit"), scroller = kbnDialog.parents('.e-dialog-scroller'), title;
                title = scroller.prev('.e-titlebar');
                scroller.ejScroller({ height: ($(window).height() - (title.height() + kObj.element.find('.e-kanbandialog').offset().top)) < 0 ? scroller.css('height', 'auto') : ($(window).height() - (title.height() + kObj.element.find('.e-kanbandialog').offset().top)) });
                scroller.data('ejScroller').refresh();
                kbnDialog.css('height', scroller.height());
            }
        }
    };
    InternalEdit.prototype._externalFormPosition = function () {
        var kObj = this.kanbanObj;
        var pos = $(kObj.element).offset();
        var width = $(kObj.element).width();
        var height = $(kObj.element).height();
        var DivElement = $("#" + kObj._id + "_externalEdit");
        switch (kObj.model.editSettings.formPosition) {
            case "right":
                $(DivElement).find('.e-close').removeClass('e-bottomleft').addClass('e-topright');
                $("#" + kObj._id + "_eFormContent").height('auto');
                if (!kObj.model.allowScrolling && !kObj.model.isResponsive) {
                    $(kObj.element).css({ "width": "100%" });
                    $(kObj.element).children().not(".e-form-container").css("width", "73%");
                    $(DivElement).css({ "left": (pos.left + $(kObj.element).children().width() + 2) + "px", "top": pos.top + "px", "position": "absolute", "width": "25%" });
                }
                else {
                    $(DivElement).css({ "left": (pos.left + (width) + 2) + "px", "top": pos.top + "px", "position": "absolute", "width": "25%" });
                    $(".e-externalrow").css("padding-right", "0px");
                }
                break;
            case "bottom":
                $(DivElement).find('.e-close').removeClass('e-topright').addClass('e-bottomleft');
                $(DivElement).css({ "left": (pos.left) + "px", "top": (pos.top + height + 1) + "px" });
                $("#" + kObj._id + "_eFormContent").width("100%");
                if (kObj.element.find(".e-scrollbar").hasClass("e-hscrollbar") || kObj.model.isResponsive)
                    $("#" + kObj._id + "_externalEdit").css({ "border": "none", "border-top": "1px solid" });
                break;
        }
    };
    InternalEdit.prototype._formFocus = function () {
        var formElement = $(this.kanbanObj._editForm).find("input,select,div.e-field,textarea.e-field"), elementFocused = false;
        for (var i = 0; i < formElement.length; i++) {
            var ele = formElement.eq(i);
            if (!ele.is(":disabled") && !elementFocused && (!ele.is(":hidden") || typeof (ele.data("ejDropDownList") || ele.data("ejNumericTextbox")) == "object") || ele.hasClass('e-rte')) {
                this._focusKbnDialogEle(ele);
                elementFocused = true;
            }
        }
    };
    InternalEdit.prototype._focusKbnDialogEle = function (ele) {
        if (ele.length) {
            if ((ele[0].tagName.toLowerCase() == "select" && !ele.hasClass("e-field e-dropdownlist")) || (ele[0].tagName.toLowerCase() == "input") || (ele[0].tagName.toLowerCase() == "textarea") && !ele.hasClass("e-numerictextbox")) {
                if (ele.hasClass('e-rte')) {
                    var rte = ele.data('ejRTE');
                    $(rte).focus();
                    rte.selectAll();
                }
                else {
                    ele.focus().select();
                    ele[0].focus();
                }
            }
            else if (ele.hasClass("e-field e-dropdownlist"))
                ele.closest(".e-ddl").focus();
            else if (ele.hasClass('e-numerictextbox'))
                ele.siblings('input:visible').first().select().focus();
            else
                ele.find('input:visible,select').first().select().focus();
        }
    };
    InternalEdit.prototype.endEdit = function () {
        var kObj = this.kanbanObj;
        if (kObj.model.editSettings.allowEditing || kObj.model.editSettings.allowAdding) {
            var pKey = kObj.model.fields.primaryKey;
            if (kObj.model.editSettings.editMode == "dialog" || kObj.model.editSettings.editMode == "dialogtemplate")
                var $edit = $('#' + kObj._id + "_dialogEdit");
            else
                $edit = kObj.element.find('.e-externalform');
            var formElement, $formElement, editedRowWrap, cardId, obj = {};
            if (!this.editFormValidate())
                return true;
            formElement = document.getElementById(kObj._id + "EditForm");
            $formElement = $(formElement);
            editedRowWrap = $formElement.closest('div');
            if (!ej.isNullOrUndefined($edit.attr('data-id'))) {
                cardId = $edit.attr('data-id');
                if ($.type(kObj._currentJsonData[0][pKey]) == "number")
                    cardId = parseInt(cardId);
            }
            else {
                if (kObj.model.showColumnWhenEmpty && kObj._currentJsonData.length == 0 && $.type(kObj._currentData[pKey]) == "string") {
                    var kanbanform = kObj.element.find(".kanbanform");
                    var formData = JSON.stringify(kanbanform.serializeArray());
                    var object = JSON.parse(formData);
                    for (var i = 0; i < object.length; i++) {
                        if (object[i].name == pKey) {
                            cardId = object[i].value;
                            obj[pKey] = cardId;
                            break;
                        }
                    }
                }
                else {
                    cardId = kObj._currentJsonData[kObj._currentJsonData.length - 1][pKey];
                    if ($.type(kObj._currentJsonData[0][pKey]) == "string")
                        cardId = parseInt(cardId);
                    cardId = cardId + 1;
                    if ($.type(kObj._currentJsonData[0][pKey]) == "string")
                        cardId = cardId.toString();
                    obj[pKey] = cardId;
                }
            }
            for (var index = 0; index < formElement.length; index++) {
                if (editedRowWrap.hasClass("e-addedrow") && $(formElement[index]).hasClass("e-identity"))
                    continue;
                var columnName = formElement[index].name, $element = $(formElement[index]);
                if ((($element.hasClass("e-dropdownlist") || $element.hasClass("e-input")) && (ej.isNullOrUndefined($element.attr("id")) || $element.attr("id").indexOf("_input") != -1 || $element.attr("id").indexOf("_hidden") != -1))) {
                    if (!ej.isNullOrUndefined($formElement[1]) && ej.isNullOrUndefined(formElement[index + 1])) {
                        formElement = $formElement[1];
                        index = -1;
                    }
                    continue;
                }
                if (columnName != undefined) {
                    if (columnName == "") {
                        if (formElement[index].id.indexOf("Save") != -1 || formElement[index].id.indexOf("Cancel") != -1)
                            columnName = "";
                        else {
                            columnName = formElement[index].id.replace(kObj._id + "_", "");
                            columnName = columnName.replace("_hidden", "");
                        }
                    }
                    if (columnName != "" && obj[columnName] == null) {
                        var value = formElement[index].value;
                        if ($(formElement[index]).hasClass("e-datepicker")) {
                            value = $element.ejDatePicker("model.value");
                        }
                        else if ($(formElement[index]).hasClass("e-datetimepicker")) {
                            value = $element.ejDateTimePicker("model.value");
                        }
                        else if ($element.is(".e-numerictextbox")) {
                            value = $element.ejNumericTextbox("getValue");
                        }
                        else if ($element.data("ejDropDownList")) {
                            value = $element.ejDropDownList("getSelectedValue");
                        }
                        var originalvalue;
                        if (formElement[index].type != "checkbox")
                            originalvalue = value;
                        else
                            originalvalue = $(formElement[index]).is(':checked');
                        obj[columnName] = originalvalue;
                    }
                    else if (columnName == pKey) {
                        obj[pKey] = formElement[index].value;
                    }
                }
            }
            kObj._editForm = $('#' + kObj._id + "EditForm");
            if (isNaN(obj[pKey]))
                obj[pKey] = cardId;
            else if (kObj.model.showColumnWhenEmpty && kObj._currentJsonData.length == 0)
                obj[pKey] = cardId = parseInt(obj[pKey]);
            else {
                if ($.type(kObj._currentJsonData[0][pKey]) == "number")
                    obj[pKey] = cardId = parseInt(obj[pKey]);
                else
                    obj[pKey] = cardId = obj[pKey];
            }
            var args = { data: obj, requestType: "save" };
            if (kObj._trigger("actionBegin", args))
                return true;
            if ($(kObj._editForm).hasClass('e-formdestroy'))
                kObj.refresh(true);
            else {
                if (!ej.isNullOrUndefined($edit.attr('data-id'))) {
                    args["action"] = "edit";
                    args["primaryKeyValue"] = cardId;
                    kObj._cModifiedData = obj;
                }
                else {
                    args["action"] = "add";
                    args["primaryKeyValue"] = cardId;
                    kObj._cAddedRecord = obj;
                }
            }
            args["primaryKey"] = pKey;
            kObj._saveArgs = args;
            kObj.updateCard(cardId, obj);
            if (kObj.model.showColumnWhenEmpty && kObj.model.initiallyEmptyDataSource) {
                kObj._kbnSwimLaneData.push(obj.Assignee);
                kObj.KanbanContext._kanbanSubMenu();
            }
            if (kObj.model.editSettings.editMode == "dialog" || kObj.model.editSettings.editMode == "dialogtemplate") {
                $edit.removeAttr('data-id');
                $("#" + kObj._id + "_dialogEdit").ejDialog("close");
            }
            else if (kObj.model.editSettings.editMode == "externalform" || kObj.model.editSettings.editMode == "externalformtemplate") {
                if (kObj.model.editSettings.formPosition == "right")
                    $(kObj.element).children().css("width", "100%");
                $edit.removeAttr('data-id');
                $("#" + kObj._id + "_externalEdit").css("display", "none");
            }
        }
        if (kObj.element.hasClass('e-responsive')) {
            kObj.kanbanWindowResize();
            if (kObj.element.find('.e-kbnadapt-editdlg').length == 0)
                $("#" + kObj._id + "_dialogEdit_wrapper").appendTo(kObj.element);
        }
    };
    InternalEdit.prototype.initValidator = function () {
        var kanbanObject = this.kanbanObj, elements = kanbanObject.element.find(".kanbanform");
        for (var i = 0; i < elements.length; i++) {
            elements.eq(i).validate({
                ignore: ".e-hide,:hidden",
                errorClass: 'e-field-validation-error',
                errorElement: 'div',
                wrapper: "div",
                errorPlacement: function (error, element) {
                    if (element.is(":hidden"))
                        element = element.siblings("input:visible");
                    var $td = element.closest("td"), $container = $(error).addClass("e-error"), $tail = ej.buildTag("div.e-errortail e-toparrow");
                    if (kanbanObject.model.editSettings.editMode != "dialog")
                        $td.find(".e-error").remove();
                    if (element.parent().hasClass("e-in-wrap"))
                        $container.insertAfter(element.closest(".e-widget"));
                    else
                        $container.insertAfter(element);
                    $container.prepend($tail);
                    if (kanbanObject.model.enableRTL)
                        kanbanObject.model.editSettings.editMode != "dialog" && $container.offset({ left: element.offset().left, top: element.offset().top + element.height() });
                    else
                        kanbanObject.model.editSettings.editMode != "dialog" && $container.offset({ left: element.offset().left, top: element.offset().top + element.height() });
                    $container.fadeIn("slow");
                },
            });
        }
    };
    InternalEdit.prototype.setValidation = function () {
        var kObj = this.kanbanObj;
        for (var i = 0; i < kObj.model.editSettings.editItems.length; i++) {
            if (!ej.isNullOrUndefined(kObj.model.editSettings.editItems[i].validationRules)) {
                this.setValidationToField(kObj.model.editSettings.editItems[i].field, kObj.model.editSettings.editItems[i].validationRules);
            }
        }
    };
    InternalEdit.prototype.setValidationToField = function (name, rules) {
        var fName = name, ele, message, kObj = this.kanbanObj;
        if (!ej.isNullOrUndefined(name))
            fName = fName.replace(/[^a-z0-9\s_]/gi, '');
        var form = $('#' + kObj._id + "EditForm");
        ele = form.find("#" + kObj._id + "_" + fName).length > 0 ? form.find("#" + kObj._id + "_" + fName) : form.find("#" + fName);
        !ele.attr("name") && ele.attr("name", name);
        ele.rules("add", rules);
        var validator = $('#' + kObj._id + "EditForm").validate();
        validator.settings.messages[name] = validator.settings.messages[name] || {};
        if (!ej.isNullOrUndefined(rules.required)) {
            if (!ej.isNullOrUndefined(rules.messages && rules.messages.required)) {
                message = rules.messages.required;
            }
            else {
                message = $["validator"].messages.required;
            }
            if (message.indexOf("This field") == 0)
                message = message.replace("This field", name);
            validator.settings.messages[name].required = message;
        }
    };
    InternalEdit.prototype.editFormValidate = function () {
        if ($.isFunction($["validator"])) {
            return $('#' + this.kanbanObj._id + "EditForm").validate().form();
        }
        return true;
    };
    InternalEdit.prototype._addDialogEditingTemplate = function () {
        var kObj = this.kanbanObj, $editDiv = ej.buildTag('div'), $form, $table, $tr, $labelTd, $valueTd, savebtn, cancelbtn, btnDiv, trElement, tdElement;
        if (kObj.model.columns.length == 0)
            return;
        $form = ej.buildTag('form.kanbanform', "", {}, { id: kObj._id + "EditForm" });
        $table = ej.buildTag('table', "", {});
        if (kObj.model.editSettings.editMode == "dialog" || kObj.model.editSettings.editMode == "externalform") {
            for (var dataCount = 0; dataCount < kObj.model.editSettings.editItems.length; dataCount++) {
                var curItem = kObj.model.editSettings.editItems[dataCount], name = curItem.field;
                if (kObj.model.editSettings.editMode == "dialog") {
                    trElement = 'tr';
                    tdElement = 'td';
                }
                else {
                    trElement = 'div.e-externalrow';
                    tdElement = 'div';
                }
                $tr = ej.buildTag(trElement);
                $labelTd = ej.buildTag(tdElement, "", {}).addClass("e-label");
                $valueTd = ej.buildTag(tdElement, "", { "text-align": "left" }).addClass("e-rowcell");
                if (dataCount == kObj.model.editSettings.editItems.length - 1)
                    $valueTd.addClass("e-last-rowcell");
                $tr.append($labelTd.get(0)).append($valueTd.get(0));
                $labelTd.append("<label style='text-transform:capitalize' for='" + name + "'>" + name + "</label>");
                if (kObj.model.editSettings.editMode == "externalform" && kObj.model.editSettings.formPosition == "right")
                    $tr.css({ "width": "300px", "padding-right": "0px" });
                if (ej.isNullOrUndefined(curItem.editType))
                    curItem["editType"] = "stringedit";
                if (!ej.isNullOrUndefined(name))
                    name = name.replace(/[^a-z0-9\s_]/gi, '');
                switch (curItem.editType) {
                    case "stringedit":
                        if (kObj.model.fields.primaryKey == name && (!kObj.model.showColumnWhenEmpty || kObj._currentJsonData.length != 0))
                            $valueTd.html(ej.buildTag('input.e-field e-ejinputtext e-disable', "", {}, { value: "{{html:#data['" + name + "']}}", id: kObj._id + "_" + name, name: name, disabled: "disabled" }));
                        else
                            $valueTd.html(ej.buildTag('input.e-field e-ejinputtext', "", {}, { value: "{{html:#data['" + name + "']}}", id: kObj._id + "_" + name, name: name }));
                        break;
                    case "numericedit":
                        $valueTd.html(ej.buildTag('input.e-numerictextbox e-field', "", {}, { type: "text", value: "{{:#data['" + name + "']}}", id: kObj._id + "_" + name, name: name }));
                        break;
                    case "dropdownedit":
                        var ddlItems = [], ddlTempl, $select, $option, data, uniqueData;
                        if (ej.isNullOrUndefined(curItem.dataSource)) {
                            var query;
                            if (!kObj._keyFiltering)
                                query = new ej.Query().select(curItem.field);
                            else
                                query = new ej.Query().where(ej.Predicate["or"](kObj.keyPredicates)).select(curItem.field);
                            if (ej.isNullOrUndefined(this._dropDownManager) || (!kObj._dataManager.dataSource.offline && kObj._dataManager.dataSource.json.length))
                                data = kObj._dataManager.executeLocal(query);
                            else {
                                if (kObj._dataManager.adaptor instanceof ej.JsonAdaptor && curItem.field.indexOf('.') != -1) {
                                    var field = curItem.field.replace(/\./g, ej["pvt"].consts.complexPropertyMerge);
                                    query = new ej.Query().select(field);
                                }
                                data = this._dropDownManager.executeLocal(query);
                            }
                            uniqueData = ej.dataUtil.mergeSort(ej.dataUtil.distinct(data));
                            for (var index = 0; index < uniqueData.length; index++)
                                ddlItems.push({ text: uniqueData[index], value: uniqueData[index] });
                        }
                        else
                            ddlItems = curItem.dataSource;
                        $select = ej.buildTag('select');
                        $option = ej.buildTag("option", "{{:text}}", {}, { value: "{{html:#data['value']}}" });
                        $select.append($option);
                        ddlTempl = $.templates($select.html());
                        if (!ej.isNullOrUndefined(curItem.editParams) && !ej.isNullOrUndefined(curItem.dataSource))
                            $valueTd.get(0).innerHTML = "<input>";
                        else
                            $valueTd.get(0).innerHTML = ["<select>", ddlTempl.render(ddlItems), "</select>"].join("");
                        $valueTd.find("select,input").prop({ id: kObj._id + "_" + name, name: name }).addClass("e-field e-dropdownlist");
                        break;
                    case "rteedit":
                        $valueTd.html(ej.buildTag('textarea.e-field e-rte', "{{html:#data['" + name + "']}}", {}, { id: kObj._id + "_" + name, name: name }));
                        break;
                    case "textarea":
                        $valueTd.html(ej.buildTag('textarea.e-field e-kanbantextarea e-ejinputtext', "{{html:#data['" + name + "']}}", {}, { id: kObj._id + "_" + name, name: name }));
                        break;
                    case "datepicker":
                    case "datetimepicker":
                        $valueTd.html(ej.buildTag('input.e-' + curItem.editType + ' e-field', "", {}, { type: "text", value: "{{:#data['" + name + "']}}", id: kObj._id + "_" + name, name: name }));
                        break;
                }
                if (kObj.model.editSettings.editMode == "dialog") {
                    $form.append($table);
                    $table.append($tr);
                }
                else
                    $form.append($tr);
                $form.appendTo($editDiv);
            }
        }
        else {
            var cloneElement;
            if (kObj.model.editSettings.editMode == "dialogtemplate" && kObj.model.editSettings.dialogTemplate != null)
                cloneElement = kObj.model.editSettings.dialogTemplate;
            if (kObj.model.editSettings.editMode == "externalformtemplate" && kObj.model.editSettings.externalFormTemplate != null)
                cloneElement = kObj.model.editSettings.externalFormTemplate;
            $form.html($(cloneElement).html());
            $form.appendTo($editDiv);
        }
        savebtn = ej.buildTag('input.e-save', "", {}, { type: "button", id: kObj._id + "_Save" });
        savebtn.ejButton({ text: kObj.localizedLabels.SaveButton });
        if (kObj.model.editSettings.formPosition != "right")
            cancelbtn = ej.buildTag('input.e-cancel', "", {}, { type: "button", id: kObj._id + "_Cancel" });
        else
            cancelbtn = ej.buildTag('input.e-cancel', "", {}, { type: "button", id: kObj._id + "_Cancel" });
        cancelbtn.ejButton({ text: kObj.localizedLabels.CancelButton });
        btnDiv = (kObj.model.editSettings.editMode != "dialog" && kObj.model.editSettings.editMode != "dialogtemplate") ? ej.buildTag('div', "", "", { 'class': "e-editform-btn" }) : ej.buildTag('div#' + kObj._id + "_EditBtnDiv", "", {}, { "class": "e-kanban-editdiv" });
        btnDiv.append(savebtn);
        btnDiv.append(cancelbtn);
        if (kObj.model.editSettings.editMode != "dialog" && kObj.model.editSettings.editMode != "dialogtemplate")
            btnDiv.appendTo($editDiv);
        else
            $form.append(btnDiv);
        $.templates(kObj._id + "_dialogEditingTemplate", $editDiv.html());
    };
    return InternalEdit;
}());
;
window.ej.createObject("ej.KanbanFeatures.Edit", InternalEdit, window);
