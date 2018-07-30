(function ($, ej, undefined) {
    ej.scheduleFeatures = ej.scheduleFeatures || {};

    var resourceHeadTemplate = function () {
        return ("{{for resourceName}}{{for ~cols=colspan}}<td class='e-resourcecells' colspan='{{:~cols}}'> {{for ~resource=resourceNam}}<div class='e-resourceheadertext' align='center' title='{{if userResTemplId == true}}{{:resourceNam}}{{else}}{{:~resource}}{{/if}}'>{{if userResTemplId == true}}{{:userResHeader}}{{else}}{{:~resource}}{{/if}}</div>{{/for}}  </td>{{/for}}{{/for}}");
    };

    ej.scheduleFeatures.resources = {
        _getMultipleResourceCellsCount: function (count) {
            if (this._grouping.length === 1) {
                var index = this._findResourceIndex(this._tempResource, "name", this._grouping[0], null, null);
                var resCount = this._resourceInfo[index].dataSource.length;
                if (this._resWorkWeek) {
                    var count = 0; var res = this._resourceInfo[index].dataSource;
                    for (var a = 0; a < res.length; a++) {
                        if (!ej.isNullOrUndefined(res[a][this._tempResource[this._tempResource.length - 1].resourceSettings["workWeek"]])) {
                            count = count + res[a][this._tempResource[this._tempResource.length - 1].resourceSettings["workWeek"]].length;
                        }
                        else {
                            count = count + this.model.workWeek.length;
                        }
                    }
                }
                else if (this._resCustomView) {
                    var count = 0; var res = this._resourceInfo[index].dataSource;
                    for (var a = 0; a < res.length; a++) {
                        var resRenderDate = res[a][this._tempResource[this._tempResource.length - 1].resourceSettings["renderDates"]];
                        if (!ej.isNullOrUndefined(resRenderDate)) {
                            if ($.type(resRenderDate[0]) == "object") {
                                count += this._getMultipleCustomDatesCount(resRenderDate);
                            }
                            else
                                count +=resRenderDate.length;
                        }
                    }
                }
            }
            else {
                var newResCollection = this._getResourceCollection();
                var groupData, prevGroupDataId, query, resApp;
                for (var j = 0; j < newResCollection.length; j++) {
                    var resources = [];
                    if (j == 0) {
                        for (var i = 0; i < newResCollection[j].dataSource.length; i++) {
                            resources.push({ resourceNam: newResCollection[j].dataSource[i][newResCollection[j].text] });
                        }
                    }
                    else {
                        if (j > 1) {
                            newResCollection[j - 1].dataSource = [];
                            newResCollection[j - 1].dataSource = this.res;
                        }
                        this.res = [];
                        groupData = ej.group(newResCollection[j].dataSource, newResCollection[j].groupId);
                        prevGroupDataId = ej.group(newResCollection[j - 1].dataSource, newResCollection[j - 1].id);
                        this._resourceManager1 = groupData instanceof ej.DataManager ? groupData : ej.DataManager(groupData);
                        for (var l = 0; l < prevGroupDataId.length; l++) {
                            for (var k = 0; k < prevGroupDataId[l].items.length; k++) {
                                query = new ej.Query().where("key", ej.FilterOperators.equal, prevGroupDataId[l].items[k][newResCollection[j - 1].id]);
                                resApp = this._resourceManager1.executeLocal(query);
                                if (resApp.length > 0) {
                                    for (var a = 0; a < resApp[0].items.length; a++) {
                                        resources.push({ resourceNam: resApp[0].items[a][newResCollection[j].text] });
                                        this.res.push(resApp[0].items[a]);
                                    }
                                }
                            }
                        }
                    }
                }
                resCount = resources.length;
                this.res1 = resources.length;
            }
            count = (this._resWorkWeek || this._resCustomView) ? count : count * resCount;
            return { resCount: resCount, count: count };
        },

        _initResourceData: function (fields, i) {
            var query = this._columnToSelect(fields);
            var proxy = this;
            var queryPromise = fields.dataSource.executeQuery(query);
            queryPromise.done(function (e) {
                fields.dataSource = e.result;
                proxy._resourceInfo.push(fields);
                if (i == proxy.model.resources.length - 1) {
                    proxy._renderInitSchedule();
                    proxy._bindAppointmentsData("Load");
                }
            });
        },

        _showMultipleResourceDetails: function (temp) {
            var prevdata, query, resApp1;
            if (this._tempResource.length > 0) {
                var newResCollection = this._resCollection;
                for (var i = 0; i < newResCollection.length; i++) {
                    this._appointmentAddWindow.find('.owner_' + i).ejAutocomplete("clearText");
                }
                for (var j = 0; j < this.render_Resources.length - 1; j++) {
                    prevdata = this.render_Resources[j + 1] instanceof ej.DataManager ? this.render_Resources[j + 1] : ej.DataManager(this.render_Resources[j + 1]);
                    if (this._currentAction == ej.Schedule.Actions.EditSeries) {
                        var resSpl = temp[this._appointmentSettings.resourceFields.toString().split(',')[j].trim()];
                        resSpl = (resSpl + ",").split(",");
                        query = new ej.Query().where(newResCollection[j + 1].groupId.toString(), ej.FilterOperators.equal, resSpl[j]);

                    } else {
                        query = new ej.Query().where(newResCollection[j + 1].groupId, ej.FilterOperators.equal, temp[this._appointmentSettings.resourceFields.toString().split(',')[j].trim()]);
                    }
                    resApp1 = prevdata.executeLocal(query);
                    this._appointmentAddWindow.find('.owner_' + (j + 1)).ejAutocomplete("clearText");
                    this._appointmentAddWindow.find('.owner_' + (j + 1)).ejAutocomplete("option", "dataSource", resApp1);
                }

                if (!this._groupEditing ) {
                    for (var i = 0; i < newResCollection.length; i++) {
                        this._appointmentAddWindow.find('.owner_' + i).data("ejAutocomplete").selectValueByKey(temp[this._appointmentSettings.resourceFields.toString().split(',')[i].trim()]);
                    }
                } else {
                    for (var i = 0; i < newResCollection.length; i++) {
                        var tempApp =  new ej.DataManager(this._currentAppointmentData).executeLocal(new ej.Query().where(this._appointmentSettings["id"], ej.FilterOperators.equal, temp[this._appointmentSettings["id"]]));
                        this._appointmentAddWindow.find('.owner_' + i).data("ejAutocomplete").selectValueByKey(tempApp[0][this._appointmentSettings.resourceFields.toString().split(',')[i].trim()]);
                    }
                }
            }
        },

        _renderAppWindowResources: function (control) {
            var newResCollection = this.render_Resources;
            var Text = (this.model.enableRTL) ? 'margin-right:30px;margin-top:-18px' : '';
            var Color = (this.model.enableRTL) ? 'float:none' : 'float:left';
            for (var i = 0; i < newResCollection.length; i++) {
                control.find('.owner_' + i).ejAutocomplete({
                    enableRTL: this.model.enableRTL,
                    showPopupButton: true,
                    width: "100%",
                    delaySuggestionTimeout: 10,
                    cssClass: this.model.cssClass,
                    multiSelectMode: (!this._tempResource[i].allowMultiple) ? "none" : "visualmode",
                    emptyResultText: this._getLocalizedLabels("EmptyResultText"),
                    dataSource: newResCollection[i],
                    fields: {
                        text: this._resCollection[i]["text"],
                        key: this._resCollection[i]["id"]
                    },
                    change: this._onResourceChange,
                    template: "<div class='e-resourcediv' style='height:15px; margin-right:5px; margin-top:3px; float:left;width:15px;" + Color + "; background-color: ${" + this._resCollection[i].color + "}'></div><div style= " + Text + ">${" + this._resCollection[i]["text"] + "}</div>"
                });
            }
        },

        _resourceSelection: function(resourceCollection, resApp1, fieldCollection, j, selectedItems, proxy){
            var dataObj= proxy._appointmentAddWindow.find('.owner_' + j).data("ejAutocomplete");
            var resText = dataObj.value().split(",");
            proxy._appointmentAddWindow.find('.owner_' + j).ejAutocomplete("clearText");
            proxy._appointmentAddWindow.find('.owner_' + j).ejAutocomplete("option", "dataSource", fieldCollection);
            for( var i = 0; i < resText.length - 1; i++){
                for(var k = 0; k < resApp1.length; k++){
                    if(resApp1[k].text == resText[i] ){
                        proxy._appointmentAddWindow.find('.owner_' + j).data("ejAutocomplete").selectValueByKey(resApp1[k][resourceCollection[j].id]);
                        break;
                    }
                }
            }
            if(dataObj.value() == "" || ej.isNullOrUndefined(dataObj.value())) proxy._appointmentAddWindow.find('.owner_' + j).data("ejAutocomplete").selectValueByKey(resApp1[0][resourceCollection[j].id]);
            selectedItems = resApp1[0][resourceCollection[j].id];
        },

        _onResourceChange: function (e) {
            if (!ej.isNullOrUndefined(e.value) && e.value != "") {
                var scheduleDiv = $("#" + this._id.toString().split("_")[0]), proxy = scheduleDiv.ejSchedule("instance");
                var controlId = parseInt(this._id.toString().split("_")[2]);
                var controlMode = proxy._appointmentAddWindow.find('.owner_' + controlId).ejAutocomplete("option", "multiSelectMode");
                var selectedItems = this.getSelectedItems();
                var resourceCollection = proxy._resCollection;
                if (controlId < proxy.render_Resources.length - 1 && selectedItems.length > 0) {
                    var j = controlId + 1;
                    var data = proxy.render_Resources[j - 1] instanceof ej.DataManager ? proxy.render_Resources[j - 1] : ej.DataManager(proxy.render_Resources[j - 1]);
                    var prevdata = proxy.render_Resources[j] instanceof ej.DataManager ? proxy.render_Resources[j] : ej.DataManager(proxy.render_Resources[j]);
                    var query, resApp1, fieldCollection = [];
                    if (controlMode == "none") {
                        if (!ej.isNullOrUndefined(e.value)) {
                            var textCheck = new ej.Query().where(resourceCollection[j - 1].text, ej.FilterOperators.equal, e.value);
                            var result = data.executeLocal(textCheck);
                        }
                        var currentVal = ((!e.value) || ej.isNullOrUndefined(e.value) || result.length <= 0) ? selectedItems[0][resourceCollection[j - 1].id] : result[0][resourceCollection[j - 1].id];
                        if (!ej.isNullOrUndefined(currentVal)) {
                            for (var a = j; a < resourceCollection.length; a++) {
                                resApp1 = new ej.DataManager(resourceCollection[j].dataSource).executeLocal(new ej.Query().where(resourceCollection[j].groupId, ej.FilterOperators.equal, currentVal));
                                if (resApp1.length != 0)
                                    currentVal = resApp1[0][resourceCollection[j - 1].id];
                                fieldCollection = [];
                                for (var k = 0; k < resApp1.length; k++) {
                                    fieldCollection.push(resApp1[k]);
                                }
                                if (resApp1.length != 0) {
                                    proxy._resourceSelection(resourceCollection, resApp1, fieldCollection, j, selectedItems, proxy);
                                }
                                else {
                                    proxy._appointmentAddWindow.find('.owner_' + j).ejAutocomplete("clearText");
                                    proxy._appointmentAddWindow.find('.owner_' + j).ejAutocomplete("option", "dataSource", fieldCollection);
                                }
                                j++;
                            }
                        }
                    }
                    else {
                        var predicate;
                        predicate = ej.Predicate(resourceCollection[j - 1].id, ej.FilterOperators.equal, selectedItems[0][resourceCollection[j - 1].id]);
                        selectedItems = e.value.split(",");
                        for (var i = 1; i < selectedItems.length; i++) {
                            predicate = predicate["or"](resourceCollection[j - 1].text, ej.FilterOperators.equal, selectedItems[i]);
                        }
                        query = new ej.Query().where(predicate);
                        resApp = data.executeLocal(query);
                        if (resApp.length > 0) {
                            var prevPredicate;
                            prevPredicate = ej.Predicate(resourceCollection[j].groupId, ej.FilterOperators.equal, resApp[0][resourceCollection[j - 1].id]);
                            for (var i = 1; i < resApp.length; i++) {
                                prevPredicate = prevPredicate["or"](resourceCollection[j].groupId, ej.FilterOperators.equal, resApp[i][resourceCollection[j - 1].id]);
                            }
                            query = new ej.Query().where(prevPredicate);
                            resApp1 = prevdata.executeLocal(query);
                            fieldCollection = [];
                            for (var k = 0; k < resApp1.length; k++) {
                                fieldCollection.push(resApp1[k]);
                            }
                            proxy._resourceSelection(resourceCollection, resApp1, fieldCollection, j, selectedItems, proxy);
                        }
                    }
                }
            }
        },

        addResource: function (resourceObject, name, index) {
            if (this._tempResource.length == 0 && ej.scheduleFeatures.resources && !ej.isNullOrUndefined(this.model.resources)) {
                if (!ej.isNullOrUndefined(this.model.group) && !ej.isNullOrUndefined(this.model.resources)) {
                    for (var i = 0; i < this.model.group.resources.length; i++) {
                        var index = this._findResourceIndex(this.model.resources, "name", this.model.group.resources[i], null, null);
                        this._tempResource.push($.extend(true, [], this.model.resources[index]));
                    }
                }
                else if (ej.isNullOrUndefined(this.model.group) && !ej.isNullOrUndefined(this.model.resources)) {
                    $.merge(this._tempResource, this.model.resources);
                }
            }
            if (this._tempResource.length > 0) {
                var nameIndex = this._findResourceIndex(this._tempResource, "name", name, null, null);
                if (!ej.isNullOrUndefined(nameIndex)) {
                    this._tempResource[nameIndex].resourceSettings.dataSource = this.model.resources[nameIndex].resourceSettings.dataSource;
                    var resCollection = this._tempResource[nameIndex].resourceSettings.dataSource;
                    var resourceIndex = this._findResourceIndex(resCollection, this.model.resources[0].resourceSettings.id, resourceObject[this.model.resources[nameIndex].resourceSettings.id], null, null);
                    var resApp, idx = 0, newResource = [];
                    var nIndex = nameIndex;
                    var date = this.dateRender;
                    if (ej.isNullOrUndefined(resourceIndex)) {
                        if (!ej.isNullOrUndefined(index)) {
                            if (this._tempResource.length > 1) {
                                if (index != 0) {
                                    var i;
                                    for (i = 0; i < resCollection.length; i++) {
                                        if (nameIndex != 0 && resCollection[i][this.model.resources[nameIndex].resourceSettings.groupId] == resourceObject[this.model.resources[nameIndex].resourceSettings.groupId]) idx += 1;
                                        if (idx == index) {
                                            idx = i + 1;
                                            break;
                                        }
                                    }
                                    if (nameIndex > 0 && idx != index && i == resCollection.length) {
                                        idx = i;
                                    }
                                    if (nameIndex == 0 && idx != index) {
                                        idx = index;
                                    }
                                }
                            } else {
                                idx = index;
                            }
                            resCollection.splice(idx, 0, resourceObject);
                        }
                        else {
                            resCollection.push(resourceObject);
                        }
                        if(this.model.resources[this._tempResource.length - 1].resourceSettings.dataSource.length == 1){
                            this.refresh();
                        }
                        else{
                            if ((nameIndex != this._tempResource.length - 1)) {
                                var query = new ej.Query().where(this._tempResource[this._tempResource.length - 1].resourceSettings.groupId, ej.FilterOperators.equal, resourceObject[this.model.resources[nameIndex].resourceSettings.id]);
                                resApp = new ej.DataManager(this.model.resources[this._tempResource.length - 1].resourceSettings.dataSource).executeLocal(query);
                                newResource.push(resourceObject);
                                if (!ej.isNullOrUndefined(resApp)) {
                                    resourceObject.count = resApp.length;
                                    for (var i = 0; i < resApp.length; i++) {
                                        if (ej.isNullOrUndefined(this._findResourceIndex(this._tempResource[nameIndex + 1].resourceSettings.dataSource, this.model.resources[nameIndex].resourceSettings.id, resApp[i][this.model.resources[nameIndex].resourceSettings.id], null, null))) {
                                            this._tempResource[nameIndex + 1].resourceSettings.dataSource.push(resApp[i]);
                                            (ej.isNullOrUndefined(newResource[0][this._tempResource[this._tempResource.length - 1].resourceSettings["workWeek"]])) && this.res1.splice(this._findResourceIndex(this._tempResource[nameIndex + 1].resourceSettings.dataSource, this.model.resources[nameIndex].resourceSettings.id, resApp[i][this.model.resources[nameIndex].resourceSettings.id], null, null), 0, resApp[i]);
                                        }
                                        newResource.push(resApp[i]);
                                    }
                                }
                            }
                            else {
                                var grAvl = (!ej.isNullOrUndefined(this.model.resources[nameIndex].resourceSettings.groupId)) ? this._findResourceIndex(this._tempResource[0].resourceSettings.dataSource, this.model.resources[nameIndex].resourceSettings.id, resourceObject[this.model.resources[nameIndex].resourceSettings.groupId], null, null) : null;
                                if ((!ej.isNullOrUndefined(grAvl)) && (this._tempResource.length > 1) && (ej.isNullOrUndefined(this._tempResource[0].resourceSettings.dataSource[grAvl].count))) {
                                    newResource.push(this._tempResource[0].resourceSettings.dataSource[grAvl]);
                                    nameIndex = 0, index = 0;
                                    resApp = [];
                                    resApp.push(resourceObject);
                                    (ej.isNullOrUndefined(newResource[0][this._tempResource[this._tempResource.length - 1].resourceSettings["workWeek"]])) && this.res1.splice(this._findResourceIndex(this._tempResource[this._tempResource.length - 1].resourceSettings.dataSource, this.model.resources[nameIndex].resourceSettings.id, resourceObject[this.model.resources[nameIndex].resourceSettings.id], null, null), 0, resourceObject);
                                    newResource.push(resourceObject);
                                }
                                else {
                                    (ej.isNullOrUndefined(resourceObject[this._tempResource[this._tempResource.length - 1].resourceSettings["workWeek"]])) && this.res1.splice(this._findResourceIndex(this._tempResource[nameIndex].resourceSettings.dataSource, this.model.resources[nameIndex].resourceSettings.id, resourceObject[this.model.resources[nameIndex].resourceSettings.id], null, null), 0, resourceObject);
                                    newResource.push(resourceObject);
                                }
                            }
                            var resAvl = (this._tempResource.length > 1) ? (nameIndex != this._tempResource.length - 1) ? (resApp.length > 0) : (!ej.isNullOrUndefined(this._findResourceIndex(this._tempResource[0].resourceSettings.dataSource, this.model.resources[nameIndex].resourceSettings.id, resourceObject[this.model.resources[nameIndex].resourceSettings.groupId], null, null))) : true;
                            if (resAvl) {
                                var res1 = this.res1;
                                var tempResource1 = this._resourceSort();
                                this._resCollect = tempResource1;
                                var userTemplate = (!ej.isNullOrUndefined(this.model.workCellsTemplateId)) ? true : false;
                                if (userTemplate) { var workHtml = this._getUserWorkCellsTemplate(); }
                                var allDayTemplate = (!ej.isNullOrUndefined(this.model.allDayCellsTemplateId)) ? true : false;
                                if (allDayTemplate) { var allDayHtml = this._getUserAllDayCellsTemplate(); }
                                var userResTemplId = (this.model.resourceHeaderTemplateId) ? true : false;
                                var html, workcellHtml;
                                if (this.currentView() == "agenda")
                                    this._renderAgendaContent();
                                else {
                                    if (this.model.orientation === "horizontal" && this._customOrientation === "horizontal") {
                                        if (this._grouping.length > 0) {
                                            if (this._tempResource.length > 1) {
                                                if (nameIndex != this._tempResource.length - 1) {
                                                    $($(this.element.find('.e-resourceheadertable tr').eq(this._findResourceIndex(this._resCollect, this.model.resources[nameIndex].resourceSettings.id, newResource[0][this.model.resources[nameIndex].resourceSettings.id], null, null)))).remove();
                                                    $($(this.element.find('.e-workcellstab tr').eq(this._findResourceIndex(this._resCollect, this.model.resources[nameIndex].resourceSettings.id, newResource[0][this.model.resources[nameIndex].resourceSettings.id], null, null)))).remove();
                                                }
                                            }
                                            for (var i = 0; i < newResource.length; i++) {
                                                var horiResources = [];
                                                index = this._findResourceIndex(tempResource1, this.model.resources[nameIndex].resourceSettings.id, newResource[i][this.model.resources[nameIndex].resourceSettings.id], this.model.resources[nameIndex].resourceSettings.groupId, newResource[i][this.model.resources[nameIndex].resourceSettings.groupId]);
                                                if ((!ej.isNullOrUndefined(resApp)) && i == 0) {
                                                    horiResources.push({ name: newResource[i][this.model.resources[nameIndex].resourceSettings.text], classname: "e-parentnode", idnum: resourceObject.id + "_" + resourceObject.groupId, marginleft: 0 + "px", width: "20px", backgroundcolor: "", border: "1px dotted #bbbcbb", bordertop: "", userResHeader: this._getResourceHeadTemplate($.extend(tempResource1[index], { classname: "e-parentnode" })), userResTemplId: userResTemplId });
                                                }
                                                else {
                                                    horiResources.push({ name: newResource[i][this.model.resources[nameIndex].resourceSettings.text], classname: "e-childnode", marginleft: ((this._tempResource.length > 1 ? 2 : 1) * 10) + "px", width: "20px", backgroundcolor: "", border: "1px dotted #bbbcbb", bordertop: "", userResHeader: this._getResourceHeadTemplate($.extend(tempResource1[index], { classname: "e-childnode" })), userResTemplId: userResTemplId });
                                                }
                                                html = this.addResourceTemplate.render({ trs: horiResources });
                                                (!ej.isNullOrUndefined(this._horiResources)) && this._horiResources.push(horiResources);
                                                workcellHtml = this.addResourceCellsTemplate.render({ cellrows: horiResources, hourdiff: Math.ceil(((this.model.endHour - this.model.startHour)) * (60 / this.model.timeScale.majorSlot)), view: this.model.timeScale.enable ? (this._isCustomMonthView()) ? "month" : this.currentView() : "month", cols: (this.model.timeScale.enable ? this.currentView() == 'month' || (this._isCustomMonthView()) ? this.datesColumn : this._strTime : this.datesColumn), column: this._columnValue, userTemplate: userTemplate, userHtml: workHtml });
                                                if (index == 0) {
                                                    $($(this.element.find('.e-resourceheadertable tr').eq(index))).before(html);
                                                    $($(this.element.find('.e-workcellstab tr').eq(index))).before(workcellHtml);
                                                }
                                                else {
                                                    $($(this.element.find('.e-resourceheadertable tr').eq(index - 1))).after(html);
                                                    $($(this.element.find('.e-workcellstab tr').eq(index - 1))).after(workcellHtml);
                                                }
                                                (!ej.isNullOrUndefined(this.model.queryCellInfo)) && this._renderQueryCellInfo("renderContentAreaTemplate");
                                            }
                                        }
                                    }
                                    else {
                                        var resDateRender, colSpan = 0, colspanCount = 0;
                                        var trCount = this.element.find(".e-headrealldaytable tr").length;
                                        var workCells = this._getWorkCellsCount();
                                        var leftCellwidth = this.currentView == "month" ? 50 : 56;
                                        if (!ej.isNullOrUndefined(newResource[0][this._tempResource[this._tempResource.length - 1].resourceSettings["workWeek"]])) {
                                            for (var i = 0; i < newResource.length; i++) {
                                                var newIndex = this._findResourceIndex(this.res, this.model.resources[nameIndex].resourceSettings.groupId, newResource[i][this.model.resources[nameIndex].resourceSettings.groupId], null, null);
                                                if (!ej.isNullOrUndefined(newIndex))
                                                    this.res1.splice(newIndex + index, 0, newResource[i])
                                                else
                                                    this.res1.push(newResource[i])
                                            }
                                        }
                                        if (((nameIndex != this._tempResource.length - 1) || (this._tempResource.length == 1) || (this._findResourceIndex(this._tempResource[0].resourceSettings.dataSource, this.model.resources[nameIndex].resourceSettings.id, resourceObject[this.model.resources[nameIndex].resourceSettings.groupId], null, null) == 0)) && (index == 0)) {
                                            for (var i = 1; i <= trCount; i++) {
                                                this.element.find(".e-headrealldaytable tr:nth-child(" + (i) + ")").find("td").eq(0).removeAttr("style");
                                            }
                                        }
                                        trCount = (this.currentView() != "month" && !(this._isCustomMonthView()) && !(this.model.timeScale.enable)) ? trCount : trCount - 1;
                                        for (var i = (nameIndex != this._tempResource.length - 1) ? 1 : 0; i < newResource.length; i++) {
                                            var resources = [];
                                            var dateIndex = 0;
                                            var resDateRender = this._getResourceColumnCount(newResource[i]);
                                            if (this._grouping.length > 0) {
                                                if (!ej.isNullOrUndefined(this.model.dateHeaderTemplateId) && (this.currentView() != "month" && !this._isCustomMonthView())) {
                                                    this._value = [];
                                                    var cols = this._getUserDateheaderTemplate();
                                                }
                                                else
                                                    var cols = this._getResourceColumns(newResource[i], nameIndex, resDateRender);
                                                var html = this.headTemplate.render({ cols: cols, view: this.currentView(), colspan: 1 });
                                                resources.push({ resourceNam: newResource[i][this._tempResource[nameIndex].resourceSettings.text], colspan: cols.length, userResHeader: this._getResourceHeadTemplate($.extend(newResource[i], { classname: (this._tempResource.length - 1 == nameIndex) ? "e-childnode" : "e-parentnode" })), userResTemplId: false });
                                                var resourceHeaderHtml = this.resourceHeadTemplate.render({ cols: cols, resourceName: resources, leftWidth: leftCellwidth });
                                                if (this._tempResource.length > 1) {
                                                    var grIndex, resIndex;
                                                    if (nameIndex != this._tempResource.length - 1) {
                                                        grIndex = this._findResourceIndex(this._tempResource[0].resourceSettings.dataSource, this._tempResource[0].resourceSettings.id, newResource[0][this.model.resources[nameIndex].resourceSettings.id], this._tempResource[0].resourceSettings.groupId, newResource[0][this.model.resources[nameIndex].resourceSettings.groupId]);
                                                        if (resApp.length == 1 && nameIndex != nIndex) {
                                                            resIndex = 0;
                                                            for (var a = 0; a < grIndex; a++) {
                                                                resIndex = resIndex + ((!ej.isNullOrUndefined(this._tempResource[0].resourceSettings.dataSource[a].count)) ? (this._tempResource[0].resourceSettings.dataSource[a].count) : 0);
                                                            }
                                                        }
                                                        else {
                                                            resIndex = this._findResourceIndex(this.res1, "id", newResource[i].id, "groupId", newResource[i].groupId);
                                                        }
                                                    } else {
                                                        var grIndex1 = 0;
                                                        resIndex = 0;
                                                        grIndex = this._findResourceIndex(this._tempResource[0].resourceSettings.dataSource, this.model.resources[nameIndex].resourceSettings.id, newResource[0][this.model.resources[nameIndex].resourceSettings.groupId], null, null);
                                                        for (var k = 0; (index == 0) ? k < grIndex : k <= grIndex; k++) {
                                                            var resCount = ((!ej.isNullOrUndefined(this._tempResource[0].resourceSettings.dataSource[k].count)) ? (this._tempResource[0].resourceSettings.dataSource[k].count) : 0);
                                                            if ((index != 0 && k != grIndex) || (ej.isNullOrUndefined(index))) {
                                                                resIndex = resIndex + resCount;
                                                            } else {
                                                                resIndex = resIndex + ((index > resCount) ? resCount : (index == 0) ? index + resCount : index);
                                                            }
                                                            grIndex1 = grIndex1 + ((!ej.isNullOrUndefined(this._tempResource[0].resourceSettings.dataSource[k].count) && (k != grIndex)) ? 1 : 0);
                                                        }
                                                        var colspan = this.element.find(".e-headrealldaytable tr:nth-child(" + (1) + ")").find("td").eq(grIndex1).prop("colSpan");
                                                        this.element.find(".e-headrealldaytable tr:nth-child(" + (1) + ")").find("td").eq(grIndex1).attr("colspan", colspan + cols.length)
                                                    }
                                                    for (var j = 0; j < resIndex; j++) {
                                                        dateIndex += this.element.find(".e-headrealldaytable tr:nth-child(" + (trCount - 1) + ")").find("td").eq(j).prop("colSpan");
                                                    }
                                                    index = resIndex;
                                                }
                                                else {
                                                    index = this._findResourceIndex(tempResource1, this.model.resources[nameIndex].resourceSettings.id, newResource[i][this.model.resources[nameIndex].resourceSettings.id], this.model.resources[nameIndex].resourceSettings.groupId, newResource[i][this.model.resources[nameIndex].resourceSettings.groupId]);
                                                    for (var k = 0; k < index; k++) {
                                                        dateIndex += this.element.find(".e-headrealldaytable tr:nth-child(1)").find("td").eq(k).prop("colSpan");
                                                    }
                                                }
                                                if (index == 0 && dateIndex == 0) {
                                                    this.element.find(".e-headrealldaytable tr:nth-child(" + trCount + ")").find("td").eq(dateIndex).before(html)
                                                    this.element.find(".e-headrealldaytable tr:nth-child(" + (trCount - 1) + ")").find("td").eq(index).before(resourceHeaderHtml);
                                                } else {
                                                    this.element.find(".e-headrealldaytable tr:nth-child(" + trCount + ")").find("td").eq(dateIndex - 1).after(html)
                                                    this.element.find(".e-headrealldaytable tr:nth-child(" + (trCount - 1) + ")").find("td").eq(index - 1).after(resourceHeaderHtml);
                                                }
                                                if (this.currentView() !== "month" && !this._isCustomMonthView() && this.model.timeScale.enable && this.model.showAllDayRow) {
                                                    var allHtml = this.alldayTemp.render({ cols: cols, colspan: 1, userTemp: allDayTemplate, userHtml: allDayHtml });
                                                    if (dateIndex == 0) {
                                                        this.element.find(".e-headrealldaytable tr:nth-child(" + (trCount + 1) + ")").find("td").eq(dateIndex).before(allHtml);
                                                    } else {
                                                        this.element.find(".e-headrealldaytable tr:nth-child(" + (trCount + 1) + ")").find("td").eq(dateIndex - 1).after(allHtml);
                                                    }
                                                    (!ej.isNullOrUndefined(this.model.queryCellInfo)) && this._renderQueryCellInfo("renderHeaderAllDayTemplate");
                                                }
                                                for (var j = 1; j <= workCells.length; j++) {
                                                    if (this.currentView() != "month" && !(this._isCustomMonthView()) && this.model.timeScale.enable) {
                                                        if (userTemplate) {
                                                            var res = new Array(newResource[i]);
                                                            var workHtml = this._getWorkCellsTemplate(res, resDateRender);
                                                        }
                                                        var workcellHtml = this.addResWorkcellTemp.render({ cols1: this._value, orientation: this.model.orientation, timeScale: this.model.timeScale.minorSlotCount, userTemplate: userTemplate, userHtml: workHtml, value: j, wIndex: 0 });
                                                    } else {
                                                        var workcellHtml = this.addResMonthcellTemp.render({ cols1: this._value, orientation: this.model.orientation, timeScale: this.model.timeScale.minorSlotCount, userTemplate: userTemplate, userHtml: workHtml, tenable: this.model.timeScale.enable, cview: (this.currentView() !== "month" && !this._isCustomMonthView()) });
                                                    }
                                                    if ((index == 0)) {
                                                        this.element.find(".e-workcellstab tr:nth-child(" + (j) + ")").find("td").eq(0).removeAttr("style");
                                                    }
                                                    if (dateIndex == 0) {
                                                        this.element.find(".e-workcellstab tr:nth-child(" + j + ")").find("td").eq(dateIndex).before(workcellHtml);
                                                    } else {
                                                        this.element.find(".e-workcellstab tr:nth-child(" + j + ")").find("td").eq(dateIndex - 1).after(workcellHtml);
                                                    }
                                                    (!ej.isNullOrUndefined(this.model.queryCellInfo)) && this._renderQueryCellInfo("renderContentAreaTemplate");
                                                }
                                                colSpan += cols.length;
                                                if (!ej.isNullOrUndefined(this._findResourceIndex(this.res1, this._tempResource[nameIndex].resourceSettings.id, newResource[i][this._tempResource[nameIndex].resourceSettings.id], this._tempResource[nameIndex].resourceSettings.groupId, newResource[i][this._tempResource[nameIndex].resourceSettings.groupId]))) {
                                                    $.merge(this.dateRender, resDateRender);
                                                }
                                            }
                                        }
                                        if (this._tempResource.length > 1 && this._grouping.length > 0) {
                                            if (nameIndex != this._tempResource.length - 1) {
                                                index = this._findResourceIndex(this._tempResource[0].resourceSettings.dataSource, this.model.resources[nameIndex].resourceSettings.id, newResource[0][this.model.resources[nameIndex].resourceSettings.id], this.model.resources[nameIndex].resourceSettings.groupId, newResource[0][this.model.resources[nameIndex].resourceSettings.groupId]);
                                                var resHeaderHtml = this.resourceHeadTemplate.render({ cols: cols, resourceName: { resourceNam: newResource[0][this.model.resources[nameIndex].resourceSettings.text], colspan: colSpan, userResHeader: this._getResourceHeadTemplate($.extend(newResource[0], { classname: (this._tempResource.length - 1 == nameIndex) ? "e-childnode" : "e-parentnode" })), userResTemplId: userResTemplId }, leftWidth: leftCellwidth });
                                                index = (this.element.find(".e-headrealldaytable tr:nth-child(1)").find("td").length > index) ? index : this.element.find(".e-headrealldaytable tr:nth-child(1)").find("td").length;
                                                if (index == 0) {
                                                    this.element.find(".e-headrealldaytable tr:nth-child(1)").find("td").eq(index).before(resHeaderHtml);
                                                } else {
                                                    this.element.find(".e-headrealldaytable tr:nth-child(1)").find("td").eq(index - 1).after(resHeaderHtml);
                                                }
                                            }
                                        }
                                        this._getRenderDates();
                                    }
                                    if (this._tempResource.length > 1) {
                                        var groupDatasource = [], firstValue = [], collection = [], value = [];
                                        var newResCollection = this._getResourceCollection();
                                        groupDatasource = $.merge(groupDatasource, newResCollection);
                                        var k = 0;
                                        for (var j = 0; j < newResCollection[newResCollection.length - 2].dataSource.length; j++) {
                                            var query = new ej.Query().where(newResCollection[newResCollection.length - 1].groupId, ej.FilterOperators.equal, newResCollection[newResCollection.length - 2].dataSource[j][newResCollection[newResCollection.length - 2].id]);
                                            var resApp = new ej.DataManager(newResCollection[newResCollection.length - 1].dataSource).executeLocal(query);
                                            if (resApp.length > 0) newResCollection[0].dataSource[j].count = resApp.length;
                                            var m = 0;
                                            while (m < resApp.length) {
                                                firstValue.push({ resourceNam: resApp[m][newResCollection[newResCollection.length - 1].text], userResHeader: this._getResourceHeadTemplate($.extend(resApp[m], { classname: "e-childnode" })), userResTemplId: userResTemplId });
                                                collection[k] = resApp[m];
                                                value.push(resApp[m]);
                                                k++;
                                                m++;
                                            }
                                        }
                                        this._valueCollection = collection;
                                        this._tempResource[this._tempResource.length - 1].dataSource = collection;
                                        newResCollection[newResCollection.length - 1].dataSource = collection;
                                        for (var i = 0; i < newResCollection.length; i++) {
                                            this.render_Resources[i] = newResCollection[i].dataSource;
                                            this._resCollection[i].dataSource = newResCollection[i].dataSource;
                                        }
                                    }
                                    (this.model.timeScale.enable) && this._borderAddRemove();
                                    this.res1 = (this._tempResource.length > 1) ? value : res1;
                                    this.render_resource = this.res1;
                                    this._highlightBusinessHours();
                                    if (this.model.orientation === "vertical" && this._customOrientation === "vertical") {
                                        this.refreshScroller();
                                    } else {
                                        this._horizontalRender();
                                    }
                                    this._renderAppointmentAll();
                                }
                            }
                        }
                    }
                }
            }
        },

        _getWorkCellsTemplate: function (res, resDateRender) {
            var date, dateRender = [], dateRender1 = [], userTemp, userHtml, minutes = 0, tdCount = this.model.timeScale.minorSlotCount;
            userTemp = $.templates($(this.model.workCellsTemplateId).html());
            dateRender = [];
            for (var c = 0; c < resDateRender.length; c++) {
                date = new Date(new Date(resDateRender[c]).setHours(this.model.startHour, minutes, 0));
                userHtml = userTemp.render({ date: date, view: this.currentView(), resource: res[0], timescale: this.model.timeScale.enable });
                dateRender.push(userHtml.trim());
            }
            dateRender1.push(dateRender);
            return dateRender1;
        },

        _getResourceColumnCount: function (newResource) {
            var resDateRender = [], proxy = this;
            var cols = [];
            var resColl = newResource[this._tempResource[this._tempResource.length - 1].resourceSettings["workWeek"]];
            if (this.currentView() === "workweek") {
                if (!ej.isNullOrUndefined(resColl)) {
                    resColl = this._resourceDaysReorder(resColl);
                    for (var b = 0; b < resColl.length; b++) {
                        var index = this._getDayNameIndex(resColl[b].capitalizeFirstString());
                        if (index == -1) {
                            index = this._getDayNameIndex(resColl[b]);
                        }
                        resDateRender.push(this._renderDates[index]);
                    }
                } else {
                    var resCustomDates = $.extend(true, [], this._renderDates), weekDays = this._getWeekDays();
                    resCustomDates = resCustomDates.filter(function (date) { return weekDays.indexOf(new Date(date).getDay()) != -1; });
                    $.merge(resDateRender, resCustomDates);
                }
            }
            else {
                if (this.currentView() === "day") {
                    resDateRender.push(new Date(this.currentDate().getFullYear(), this.currentDate().getMonth(), this.currentDate().getDate()).getTime());
                } else {
                    if ((!this.model.showWeekend)) {
                        var resCustomDates = $.extend(true, [], this._renderDates), weekDays = this._getWeekDays();
                        resCustomDates = resCustomDates.filter(function (date) { return weekDays.indexOf(new Date(date).getDay()) != -1; });
                        $.merge(resDateRender, resCustomDates);
                    } else {
                        resDateRender = this._renderDates;
                    }
                }
                resDateRender = (this.currentView() == "month") ? this._dateRender : resDateRender;
            }
            return resDateRender;
        },

        _getResourceColumns: function (newResource, nameIndex, resDateRender) {
            var columns = [];
            this._value = [];
            var count = (this.currentView() == "month") ? this._getColumnCount().length : resDateRender.length;
            for (var i = 0; i < count; i++) {
                var curday = (this.currentView() === "month" || (this._isCustomMonthView())) ? (this._tempResource.length == 0 && ej.isNullOrUndefined(this.model.group)) ? this._dayFullNames[new Date(resDateRender[i]).getDay()] : this._dayShortNames[new Date(resDateRender[i]).getDay()] : this._dayShortNames[new Date(resDateRender[i]).getDay()];
                var headerCellClass = (new Date(new Date(this._dateRender[i]).setHours(0, 0, 0, 0)).getTime() === new Date(new Date().setHours(0, 0, 0, 0)).getTime()) ? "e-headerToday" : "";
                var temp = (this.currentView() === "month" || (this._isCustomMonthView())) ? { currentDay: curday, currentDateClass: "", cellToday: "" } : this.currentView() === "day" ? (this._tempResource.length == 0 && ej.isNullOrUndefined(this.model.group)) ? { currentDay: ej.format(new Date(resDateRender[i]), this._pattern.D, this.model.locale), currentDateClass: "", cellToday: headerCellClass } : { currentDay: curday + " " + new Date(resDateRender[i]).getDate(), currentDateClass: "", cellToday: headerCellClass } : { currentDay: curday + " " + new Date(resDateRender[i]).getDate(), currentDateClass: new Date(resDateRender[i]).getDate() === new Date(this.currentDate()).getDate() ? "e-activeview" : "", cellToday: headerCellClass };
                columns.push(temp);
                this._value.push(i);
            }
            return columns;
        },

        removeResource: function (resourceId, name) {
            if (this._tempResource.length > 0) {
                var index, resIndex = 0, grIndex, dateIndex = 0, resApp = [], delResources = [], res = (this._tempResource.length == 1 && (this.model.orientation === "horizontal" && this._customOrientation === "horizontal")) ? $.extend(true, [], this._resCollect) : $.extend(true, [], this.res1);
                var nameIndex = this._findResourceIndex(this._tempResource, "name", name, null, null);
                if (!ej.isNullOrUndefined(nameIndex)) {
                    if (!ej.isNullOrUndefined(this._findResourceIndex(this._tempResource[nameIndex].resourceSettings.dataSource, this.model.resources[nameIndex].resourceSettings.id, resourceId, null, null))) {
                        var tempResource1 = this._resourceSort();
                        if (this.model.orientation === "vertical" && this._customOrientation === "vertical" || this.currentView() == "agenda") {
                            this._resCollect = this._tempResource[this._tempResource.length - 1].resourceSettings.dataSource;
                            if (this._tempResource.length == 1) this._tempResource[nameIndex].resourceSettings.dataSource = this.model.resources[nameIndex].resourceSettings.dataSource;
                        }
                        if ((nameIndex != this._tempResource.length - 1)) {
                            var query = new ej.Query().where(this._tempResource[this._tempResource.length - 1].resourceSettings.groupId, ej.FilterOperators.equal, resourceId);
                            resApp = new ej.DataManager(this.model.resources[this._tempResource.length - 1].resourceSettings.dataSource).executeLocal(query);
                            delResources.push(this._tempResource[nameIndex].resourceSettings.dataSource[this._findResourceIndex(this._tempResource[nameIndex].resourceSettings.dataSource, this.model.resources[nameIndex].resourceSettings.id, resourceId, null, null)]);
                            if (!ej.isNullOrUndefined(resApp)) {
                                for (var i = 0; i < resApp.length; i++) {
                                    (ej.isNullOrUndefined(delResources[0][this._tempResource[this._tempResource.length - 1].resourceSettings["workWeek"]])) && this.res1.splice(this._findResourceIndex(this._tempResource[nameIndex + 1].resourceSettings.dataSource, this.model.resources[nameIndex].resourceSettings.id, resApp[i][this.model.resources[nameIndex].resourceSettings.id], null, null), 1);
                                    this._tempResource[nameIndex + 1].resourceSettings.dataSource.splice(this._findResourceIndex(this._tempResource[nameIndex + 1].resourceSettings.dataSource, this.model.resources[nameIndex].resourceSettings.id, resApp[i][this.model.resources[nameIndex].resourceSettings.id], null, null), 1);
                                    delResources.push(resApp[i]);
                                }
                            }
                        }
                        else {
                            delResources.push(this._tempResource[nameIndex].resourceSettings.dataSource[this._findResourceIndex(this._tempResource[nameIndex].resourceSettings.dataSource, this.model.resources[nameIndex].resourceSettings.id, resourceId, null, null)]);
                            (ej.isNullOrUndefined(delResources[0][this._tempResource[this._tempResource.length - 1].resourceSettings["workWeek"]])) && this.res1.splice(this._findResourceIndex(this._tempResource[nameIndex].resourceSettings.dataSource, this.model.resources[nameIndex].resourceSettings.id, delResources[0][this.model.resources[nameIndex].resourceSettings.id], null, null), 1)
                            if(this.model.orientation === "vertical" && this._customOrientation === "vertical" || (this.currentView() == "agenda")){
                                this._tempResource[nameIndex].resourceSettings.dataSource.splice(this._findResourceIndex(this._tempResource[nameIndex].resourceSettings.dataSource, this.model.resources[nameIndex].resourceSettings.id, delResources[0][this.model.resources[nameIndex].resourceSettings.id], null, null), 1);
                            } 
                        }
                        var resAvl = (this._tempResource.length > 1) ? (nameIndex != this._tempResource.length - 1) ? (resApp.length > 0) : true : true;
                        if (resAvl) {
                            if (this.currentView() == "agenda") {
                                this._renderAgendaContent();
                            } else {
                                if (this.model.orientation === "vertical" && this._customOrientation === "vertical") {
                                    var colSpan;
                                    var trCount = this.element.find(".e-headrealldaytable > tbody > tr").length;
                                    trCount = (this.currentView() != "month" && !(this._isCustomMonthView()) && !(this.model.timeScale.enable)) ? trCount : trCount - 1;
                                    var workCells = this._getWorkCellsCount();
                                    for (var i = 0; i < delResources.length; i++) {
                                        if (!((!ej.isNullOrUndefined(resApp)) && i == 0 && resApp.length > 0)) {
                                            if ((this._tempResource.length > 1) && (nameIndex == this._tempResource.length - 1)) {
                                                var idx = this._findResourceIndex(this.model.resources[this._tempResource.length - 1].resourceSettings.dataSource, this.model.resources[nameIndex].resourceSettings.id, delResources[i][this.model.resources[nameIndex].resourceSettings.id], null, null);
                                                (!ej.isNullOrUndefined(idx)) && this.model.resources[this._tempResource.length - 1].resourceSettings.dataSource.splice(idx, 1);
                                            }
                                        }
                                        if (this._grouping.length > 0) {
                                            if (this._tempResource.length > 1) {
                                                var grIndex, resIndex;
                                                grIndex = this._findResourceIndex(this._tempResource[0].resourceSettings.dataSource, this.model.resources[nameIndex].resourceSettings.id, delResources[0][this.model.resources[nameIndex].resourceSettings.groupId], null, null);
                                                if (nameIndex != this._tempResource.length - 1) {
                                                    if (i != 0) {
                                                        resIndex = 0;
                                                        for (var a = 0; a < grIndex; a++) {
                                                            resIndex = resIndex + ((!ej.isNullOrUndefined(this._tempResource[0].resourceSettings.dataSource[a].count)) ? (this._tempResource[0].resourceSettings.dataSource[a].count) : 0);
                                                        }
                                                        colSpan = this.element.find(".e-headrealldaytable tr:nth-child(" + (trCount - 1) + ")").find("td").eq(resIndex).prop("colSpan");
                                                    }
                                                } else {
                                                    this._tempResource[0].resourceSettings.dataSource[grIndex].count = this._tempResource[0].resourceSettings.dataSource[grIndex].count - 1;
                                                    resIndex = this._findResourceIndex(res, this.model.resources[nameIndex].resourceSettings.id, delResources[0][this.model.resources[nameIndex].resourceSettings.id], null, null);
                                                    colSpan = this.element.find(".e-headrealldaytable tr:nth-child(" + (trCount - 1) + ")").find("td").eq(resIndex).prop("colSpan");
                                                    var gIndex = 0;
                                                    for (var k = 0; k < grIndex; k++) {
                                                        if (!ej.isNullOrUndefined(this._tempResource[0].resourceSettings.dataSource[k].count)) {
                                                            gIndex += 1;
                                                        }
                                                    }
                                                    this.element.find(".e-headrealldaytable tr:nth-child(" + (1) + ")").find("td").eq(gIndex).prop("colSpan", this.element.find(".e-headrealldaytable tr:nth-child(" + (1) + ")").find("td").eq(gIndex).prop("colSpan") - colSpan);
                                                }
                                            } else {
                                                resIndex = this._findResourceIndex(res, this.model.resources[nameIndex].resourceSettings.id, delResources[0][this.model.resources[nameIndex].resourceSettings.id], null, null);
                                                colSpan = this.element.find(".e-headrealldaytable tr:nth-child(" + (trCount - 1) + ")").find("td").eq(resIndex).prop("colSpan");
                                            }
                                            if (resIndex != 0) {
                                                dateIndex = 0;
                                                for (var a = 0; a < resIndex; a++) {
                                                    dateIndex += this.element.find(".e-headrealldaytable tr:nth-child(" + (trCount - 1) + ")").find("td").eq(a).prop("colSpan");
                                                }
                                            }
                                            if (!ej.isNullOrUndefined(colSpan)) {
                                                for (var j = 0; j < colSpan; j++) {
                                                    this.dateRender.splice(dateIndex, 1);
                                                    this.element.find(".e-headrealldaytable tr:nth-child(" + (trCount) + ")").find("td").eq(dateIndex).remove();
                                                    this.element.find(".e-headrealldaytable tr:nth-child(" + (trCount + 1) + ")").find("td").eq(dateIndex).remove();
                                                    for (var k = 1; k <= workCells.length; k++) {
                                                        this.element.find(".e-workcellstab tr:nth-child(" + k + ")").find("td").eq(dateIndex).remove();
                                                    }
                                                }
                                                this.element.find(".e-headrealldaytable tr:nth-child(" + (trCount - 1) + ")").find("td").eq(resIndex).remove();
                                            }
                                        }
                                    }
                                    if (this._tempResource.length > 1) {
                                        if (nameIndex != this._tempResource.length - 1) {
                                            index = this._findResourceIndex(this._tempResource[0].resourceSettings.dataSource, this.model.resources[nameIndex].resourceSettings.id, delResources[0][this.model.resources[nameIndex].resourceSettings.id], this.model.resources[nameIndex].resourceSettings.groupId, delResources[0][this.model.resources[nameIndex].resourceSettings.groupId]);
                                            this.model.resources[nameIndex].resourceSettings.dataSource.splice(this._findResourceIndex(this.model.resources[nameIndex].resourceSettings.dataSource, this.model.resources[nameIndex].resourceSettings.id, delResources[0][this.model.resources[nameIndex].resourceSettings.id], null, null), 1);
                                        } else {
                                            if (this._tempResource[0].resourceSettings.dataSource[grIndex].count == 0) {
                                                index = this._findResourceIndex(this._tempResource[0].resourceSettings.dataSource, this.model.resources[nameIndex].resourceSettings.id, delResources[0][this.model.resources[nameIndex].resourceSettings.groupId], null, null);
                                                delete this._tempResource[0].resourceSettings.dataSource[index]["count"];
                                            }
                                        }
                                        if (!ej.isNullOrUndefined(index) && this._grouping.length > 0) {
                                            index = (this.element.find(".e-headrealldaytable tr:nth-child(1)").find("td").length > index) ? index : this.element.find(".e-headrealldaytable tr:nth-child(1)").find("td").length - 1;
                                            this.element.find(".e-headrealldaytable tr:nth-child(1)").find("td").eq(index).remove();
                                        }
                                    }
                                } else {
                                    for (var i = 0; i < delResources.length; i++) {
                                        if ((!ej.isNullOrUndefined(resApp)) && i == 0 && resApp.length > 0) {
                                            index = this._findResourceIndex(tempResource1, this.model.resources[nameIndex].resourceSettings.id, delResources[i][this.model.resources[nameIndex].resourceSettings.id], this.model.resources[nameIndex].resourceSettings.groupId, delResources[i][this.model.resources[nameIndex].resourceSettings.groupId]);
                                            this.model.resources[nameIndex].resourceSettings.dataSource.splice(this._findResourceIndex(this._tempResource[nameIndex].resourceSettings.dataSource, this.model.resources[nameIndex].resourceSettings.id, delResources[0][this.model.resources[nameIndex].resourceSettings.id], null, null), 1);
                                        } else {
                                            var data = (this._tempResource.length > 1) ? this._resCollect : res;
                                            index = this._findResourceIndex(data, this.model.resources[nameIndex].resourceSettings.id, delResources[i][this.model.resources[nameIndex].resourceSettings.id], "classname", "e-childnode");
                                            resIndex = this._findResourceIndex(this.model.resources[this._tempResource.length - 1].resourceSettings.dataSource, this.model.resources[nameIndex].resourceSettings.id, delResources[i][this.model.resources[nameIndex].resourceSettings.id], null, null);
                                            ((!ej.isNullOrUndefined(resIndex)) && (nameIndex == this._tempResource.length - 1)) && this.model.resources[this._tempResource.length - 1].resourceSettings.dataSource.splice(resIndex, 1);
                                        }
                                       if(!ej.isNullOrUndefined(this._findResourceIndex(this._resCollect, this.model.resources[nameIndex].resourceSettings.id, delResources[i][this.model.resources[nameIndex].resourceSettings.id], this.model.resources[nameIndex].resourceSettings.groupId, delResources[i][this.model.resources[nameIndex].resourceSettings.groupId])))
                                         this._resCollect.splice(index, 1);
                                        if (this._grouping.length > 0) {
                                            this._horiResources.splice(index, 1);
                                            if (this._tempResource.length > 1 && nameIndex == this._tempResource.length - 1) {
                                                grIndex = this._findResourceIndex(this._tempResource[0].resourceSettings.dataSource, this.model.resources[nameIndex].resourceSettings.id, tempResource1[index][this.model.resources[1].resourceSettings.groupId]);
                                                this._tempResource[0].resourceSettings.dataSource[grIndex].count = this._tempResource[0].resourceSettings.dataSource[grIndex].count - 1;
                                                if (this._tempResource[0].resourceSettings.dataSource[grIndex].count == 0) {
                                                    $($(this.element.find('.e-resourceheadertable tr').eq(index - 1))).find(".e-parentnodecategory, .e-resourceicon, .e-resourcecollapse").removeClass("e-resourceicon, e-resourcecollapse");
                                                    delete this._tempResource[0].resourceSettings.dataSource[grIndex]["count"];
                                                }
                                            }
                                            $($(this.element.find('.e-resourceheadertable tr').eq(index))).remove();
                                            $($(this.element.find('.e-workcellstab tr').eq(index))).find('.e-appointwrapper').remove();
                                            $($(this.element.find('.e-workcellstab tr').eq(index))).remove();
                                        }
                                    }
                                    this._resourceInfo = [];
                                    for (var m = 0; m <= this.model.resources.length - 1; m++) {
                                        this._resourceInfo.push(this.model.resources[m].resourceSettings)
                                    }
                                }
                            }
                            this._getRenderDates();
                            (this.model.timeScale.enable) && this._borderAddRemove();
                            if (this.model.orientation === "vertical" && this._customOrientation === "vertical") {
                                (this._grouping.length) && this.refreshScroller();
                            } else {
                                this._horizontalRender();
                            }
                            this._resourceSort();
                        }
                    }
                }
                if (this._resCollect.length == 0 || this.res1 == 0) {
                    this.refresh();
                }
            }
        },

        _getResourceCollection: function () {
            var resIndexCollection = [], index;
            if ((this._tempResource.length != 0)) {
                if (!ej.isNullOrUndefined(this.model.group) && (this._tempResource.length != 0) && this._tempResource[0].resourceSettings.dataSource.length != 0) {
                    for (var i = 0; i < this._grouping.length; i++) {
                        index = this._findResourceIndex(this._tempResource, "name", this._grouping[i], null, null);
                        resIndexCollection.push({ index: index, name: this._tempResource[i].name });
                    }
                    resIndexCollection = resIndexCollection.sort(function (a, b) {
                        var x = a.index; var y = b.index;
                        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                    });
                }
                else {
                    for (var i = 0; i < this._tempResource.length; i++) {
                        resIndexCollection.push({ index: i });
                    }
                }
                var newResCollection = [];
                for (var k = 0; k < resIndexCollection.length; k++) {
                    newResCollection.push(this._resourceInfo[resIndexCollection[k].index]);
                }
                this._resCollection = newResCollection;
                return newResCollection;
            }
        },

        _resourceSort: function () {
            var nextRes, count, resAvail, index, rIndex, cRes, tempResource = [], rCollection = [], tempRes1 = [];
            if (this._tempResource.length > 1) {
                for (var i = 0; i < this._tempResource.length; i++) {
                    for (var j = 0; j < this._tempResource[i].resourceSettings.dataSource.length; j++) {
                        tempResource.push(this._tempResource[i].resourceSettings.dataSource[j]);
                    }
                }
                count = 1;
                for (var a = 0; a < this._tempResource.length; a++) {
                    for (var b = 0, cRes = this._tempResource[a].resourceSettings.dataSource; b < cRes.length; b++) {
                        resAvail = rCollection.indexOf(cRes[b]);
                        (resAvail == -1) ? rCollection.push(cRes[b]) : "";
                        nextRes = new ej.DataManager(tempResource).executeLocal(new ej.Query().where(this._tempResource[count].resourceSettings.groupId, ej.FilterOperators.equal, cRes[b][this._tempResource[a].resourceSettings.id]));
                        nextRes = nextRes.filter(function (a) { return cRes.indexOf(a) === -1; });
                        index = rCollection.indexOf(cRes[b]);
                        if (nextRes.length != 0) {
                            for (var c = 0; c < nextRes.length; c++) {
                                rIndex = index + c + 1;
                                resAvail = rCollection.indexOf(nextRes[c]);
                                (resAvail == -1) ? rCollection.splice(rIndex, 0, nextRes[c]) : "";
                            }
                        }
                    }
                    count++;
                    count = (count == this._tempResource.length) ? count - 1 : count;
                }
                for (var x = 0; x < rCollection.length; x++) {
                    index = this.res1.indexOf(rCollection[x]);
                    if (index != -1) tempRes1.push(rCollection[x]);
                }
                this.res1 = tempRes1;
            }
            else
                rCollection = this.res1;
            return rCollection;
        },

        _renderMultipleResourceHeaderTemplate: function (tbody, cols) {
            this.res1 = []; this.render_Resources = []; this.level_Resources = [];
            var view = this.currentView(), newResCollection = this._getResourceCollection(), noOfDays = (this.model.showWeekend) ? 7 : this.model.workWeek.length;
            var viewColCount = view == "day" ? 1 : (view == "week" || view == "month") ? noOfDays : this.model.workWeek.length;
            viewColCount = (view == "customview" && this._dateRender.length >= 7) ? noOfDays : (view == "customview" && this._dateRender.length < 7) ? this._dateRender.length : viewColCount;
            if (!ej.isNullOrUndefined(this.model.group) && (this._tempResource.length != 0) && this._tempResource[0].resourceSettings.dataSource.length != 0) {
                var userResTemplId = (this.model.resourceHeaderTemplateId) ? true : false;
                var resources = [];
                if (this._grouping.length === 1) {
                    var index;
                    for (var i = 0; i < this._grouping.length; i++) {
                        index = this._findResourceIndex(this._tempResource, "name", this._grouping[i], null, null);
                    }
                    for (var i = 0; i < this._resourceInfo[index].dataSource.length; i++) {
                        var colCount;
                        if (this._resWorkWeek)
                            var colCount = !ej.isNullOrUndefined(this._resourceInfo[index].dataSource[i][this._tempResource[this._tempResource.length - 1].resourceSettings["workWeek"]]) ? this._resourceInfo[index].dataSource[i][this._tempResource[this._tempResource.length - 1].resourceSettings["workWeek"]].length : viewColCount;
                        if (this._resCustomView) {
                            var resCustomSetting = this._resourceInfo[index].dataSource[i][this._tempResource[this._tempResource.length - 1].resourceSettings["renderDates"]];
                            if (!ej.isNullOrUndefined(resCustomSetting)) {
                                if (!ej.isNullOrUndefined(resCustomSetting) && $.type(resCustomSetting[0]) == "object") {
                                    colCount = this._getMultipleCustomDatesCount(resCustomSetting);
                                } else
                                    colCount = resCustomSetting.length;
                            }
                            else
                                colCount = viewColCount;
                        }
                        (this.currentView() != "agenda") && resources.push({ resourceNam: this._resourceInfo[index].dataSource[i][this._resourceInfo[index].text], colspan: (this._resWorkWeek || this._resCustomView) ? colCount : viewColCount, userResHeader: this._getResourceHeadTemplate($.extend(this._resourceInfo[index].dataSource[i], { classname: "e-childnode" })), userResTemplId: userResTemplId });
                        this.res1.push(this._resourceInfo[index].dataSource[i]);
                        this.level_Resources.push(this.res1[i]);
                    }
                    this._valueCollection = this.res1;
                    this.render_Resources.push(this.res1);
                    if ((this.model.orientation === "vertical" && this._customOrientation === "vertical") && this.currentView() != "agenda" && tbody !== null && cols != null) {
                        var leftCellwidth = view == "month" ? 50 : 56;
                        var resourceHeaderHtml = this.resourceHeadTemplate.render({ cols: cols, resourceName: resources, leftWidth: leftCellwidth });
                        tbody.append(ej.buildTag('tr.e-headerbar').append(resourceHeaderHtml));
                    }
                }
                else {
                    var groupDatasource = [], firstValue = [], collection = [], resAppValueCount = 0, valueCount = [];
                    var res = []; var level = []; var variable = []; this.resourceValue = 0; var resourceLength = 0;
                    groupDatasource = $.merge(groupDatasource, newResCollection);
                    if (this._tempResource.length) {
                        var k = 0;
                        for (var j = 0; j < newResCollection[newResCollection.length - 2].dataSource.length; j++) {
                            var query = new ej.Query().where(newResCollection[newResCollection.length - 1].groupId, ej.FilterOperators.equal, newResCollection[newResCollection.length - 2].dataSource[j][newResCollection[newResCollection.length - 2].id]);
                            var resApp = new ej.DataManager(newResCollection[newResCollection.length - 1].dataSource).executeLocal(query);
                            var m = 0;
                            while (m < resApp.length) {
                                firstValue.push({ resourceNam: resApp[m][newResCollection[newResCollection.length - 1].text], colspan: 1 * viewColCount, userResHeader: this._getResourceHeadTemplate($.extend(resApp[m], { classname: "e-childnode" })), userResTemplId: userResTemplId });
                                collection[k] = resApp[m];
                                this.res1.push(resApp[m]);
                                k++;
                                m++;
                            }
                        }
                        this._valueCollection = collection;
                        newResCollection[newResCollection.length - 1].dataSource = collection;
                        var resClone = $.extend(true, [], newResCollection);
                    }
                    for (var i = this._tempResource.length - 1; i >= 0; i--) {
                        level.push(i);
                        for (var j = 0; j < newResCollection[i].dataSource.length; j++) {
                            var valuefirst = i != 0 ? this._findResourceIndex(newResCollection[i - 1].dataSource, newResCollection[i - 1].id, newResCollection[i].dataSource[j][newResCollection[i].groupId], null, null) : 0;
                            var valuelast = i != this._tempResource.length - 1 ? this._findResourceIndex(newResCollection[i + 1].dataSource, newResCollection[i + 1].groupId, newResCollection[i].dataSource[j][newResCollection[i].id], null, null) : this._tempResource.length - 1;
                            (ej.isNullOrUndefined(valuefirst) && ej.isNullOrUndefined(valuelast)) ? newResCollection[i].dataSource[j] = 0 : "";
                            if (!ej.isNullOrUndefined(valuefirst) && !ej.isNullOrUndefined(valuelast) && newResCollection[i].dataSource[j] !== 0) {
                                res.push(newResCollection[i].dataSource[j]);
                                this.resourceValue = res.length;
                                if (i <= this._tempResource.length - 2) {
                                    var query = new ej.Query().where(newResCollection[i + 1].groupId, ej.FilterOperators.equal, newResCollection[i].dataSource[j][newResCollection[i].id]);
                                    var resApp = new ej.DataManager(newResCollection[i + 1].dataSource).executeLocal(query);
                                    if (i <= this._tempResource.length - 3) {
                                        for (var k = 0; k < resApp.length; k++)
                                            resAppValueCount = resAppValueCount + (!ej.isNullOrUndefined(resApp[k].count) ? resApp[k].count : 0);

                                        resourceLength = (this.model.orientation === "vertical" && this._customOrientation === "vertical") ? resAppValueCount : resAppValueCount + resApp.length;
                                        newResCollection[i].dataSource[j].count = resourceLength;
                                        resAppValueCount = 0;
                                    }
                                    if (i == this._tempResource.length - 2) {
                                        newResCollection[i].dataSource[j].count = resApp.length;
                                        resourceLength = resApp.length;
                                    }
                                    this.resourceValue = resourceLength;
                                    resApp.length = 0;
                                }
                                if (this._resWorkWeek) {
                                    var weekCount = 0;
                                    if (i != this._tempResource.length - 1) {
                                        var query = new ej.Query().where(resClone[i + 1].groupId, ej.FilterOperators.equal, resClone[i].dataSource[j][resClone[i].id]);
                                        var colCount = new ej.DataManager(resClone[i + 1].dataSource).executeLocal(query);
                                        for (var a = 0; a < colCount.length; a++) {
                                            weekCount += !ej.isNullOrUndefined(colCount[a][this._tempResource[this._tempResource.length - 1].resourceSettings["workWeek"]]) ? colCount[a][this._tempResource[this._tempResource.length - 1].resourceSettings["workWeek"]].length : !ej.isNullOrUndefined(colCount[a].colspan) ? colCount[a].colspan : viewColCount;
                                        }
                                    }
                                    else {
                                        weekCount += !ej.isNullOrUndefined(resClone[i].dataSource[j][this._tempResource[this._tempResource.length - 1].resourceSettings["workWeek"]]) ? resClone[i].dataSource[j][this._tempResource[this._tempResource.length - 1].resourceSettings["workWeek"]].length : viewColCount;
                                    }
                                    resClone[i].dataSource[j]["colspan"] = weekCount;
                                    this.resourceValue = weekCount;
                                }
                                if (this._resCustomView) {
                                    var weekCount = 0;
                                    if (i != this._tempResource.length - 1) {
                                        var query = new ej.Query().where(resClone[i + 1].groupId, ej.FilterOperators.equal, resClone[i].dataSource[j][resClone[i].id]);
                                        var colCount = new ej.DataManager(resClone[i + 1].dataSource).executeLocal(query);
                                        for (var a = 0; a < colCount.length; a++) {
                                            var resCustomSetting = colCount[a][this._tempResource[this._tempResource.length - 1].resourceSettings["renderDates"]];
                                            if (!ej.isNullOrUndefined(resCustomSetting)) {
                                                if ($.type(resCustomSetting[0]) == "object") {
                                                    weekCount += this._getMultipleCustomDatesCount(resCustomSetting);
                                                } else
                                                    weekCount += resCustomSetting.length;
                                            } else {
                                                if (!ej.isNullOrUndefined(colCount[a].colspan))
                                                    weekCount += colCount[a].colspan;
                                                else
                                                    weekCount += viewColCount
                                            }
                                        }
                                    }
                                    else {
                                        var resCustomSetting = this._tempResource[this._tempResource.length - 1].resourceSettings["renderDates"];
                                        if (!ej.isNullOrUndefined(resClone[i].dataSource[j][resCustomSetting])) {
                                            weekCount += this._getCustomDatesCount(j, resCustomSetting);
                                        } else
                                            weekCount += viewColCount;
                                    }
                                    resClone[i].dataSource[j]["colspan"] = weekCount;
                                    this.resourceValue = weekCount;
                                }
                                (this.currentView() != "agenda") && resources.push({ resourceNam: newResCollection[i].dataSource[j][newResCollection[i].text], colspan: (this._resWorkWeek || this._resCustomView) ? this.resourceValue : this.resourceValue * viewColCount, userResHeader: this._getResourceHeadTemplate($.extend(newResCollection[i].dataSource[j], { classname: (this._tempResource.length - 1 == i) ? "e-childnode" : "e-parentnode" })), userResTemplId: userResTemplId });
                                this.level_Resources.push(newResCollection[i].dataSource[j]);
                                res.length = 0;

                            }
                            if ((this.model.orientation === "vertical" && this._customOrientation === "vertical") && this.currentView() != "agenda" && tbody !== null && cols != null) {
                                leftCellwidth = view == "month" ? 50 : 56;
                                resourceHeaderHtml = this.resourceHeadTemplate.render({ cols: cols, resourceName: resources, leftWidth: leftCellwidth });
                                variable[i] = ej.buildTag('tr.e-headerbar').append(resourceHeaderHtml)[0];
                            }
                        }
                        valueCount[i] = newResCollection[i].dataSource;
                        resources.length = 0;
                    }
                    this.render_Resources = valueCount;
                    (this.model.orientation === "vertical" && this._customOrientation === "vertical") && this.currentView() != "agenda" ? tbody.append(variable) : "";
                }
            }
            else {
                for (var k = 0; k < this._tempResource.length; k++) {
                    this.render_Resources.push(this._tempResource[k].resourceSettings.dataSource);
                }
                this.res1 = [0];
            }
            return tbody;
        },

        _getMultipleResourceAlldayApp: function (renderDate, day, res, apps) {
            this.allDayCount = [];
            if ((new Date(new Date(renderDate[day]).setHours(0, 0, 0, 0)).getTime() == new Date(new Date(apps[this._appointmentSettings["startTime"]]).setHours(0, 0, 0, 0)).getTime()) && (apps[this._appointmentSettings.resourceFields.toString().split(',')[this._tempResource.length - 1].trim()] == this.res1[res][this._tempResource[this._tempResource.length - 1].resourceSettings.id]) &&
                (apps[this._appointmentSettings["allDay"]] === true || (((new Date(apps[this._appointmentSettings["endTime"]]) - new Date(apps[this._appointmentSettings["startTime"]])) / 3600000) >= 24) || this._findAllDayApp(apps)) &&
                ((!ej.isNullOrUndefined(this.model.group) && this._grouping.length > 1) ? (apps[this._appointmentSettings.resourceFields.toString().split(',')[this._tempResource.length - 2].trim()] == this.res1[res][this._tempResource[this._tempResource.length - 1].resourceSettings.groupId]) : true)) {
                this._setAllDayPos(apps, day, res);
                this.allDayCount.push(apps);
            }
            else if ((this._resWorkWeek && new Date(renderDate[day - 1]).getDay() == 0) && (new Date(new Date(renderDate[day]).setHours(0, 0, 0, 0)).getTime() > new Date(new Date(apps[this._appointmentSettings["startTime"]]).setHours(0, 0, 0, 0)).getTime()) &&
                (new Date(new Date(new Date(apps[this._appointmentSettings["startTime"]]).setHours(0, 0, 0, 0)).getTime()).getDay() != 0) &&
                (new Date(new Date(renderDate[day]).setHours(0, 0, 0, 0)).getTime() <= new Date(new Date(apps[this._appointmentSettings["endTime"]]).setHours(0, 0, 0, 0)).getTime()) &&
                (apps[this._appointmentSettings.resourceFields.toString().split(',')[this._tempResource.length - 1].trim()] == this.res1[res][this._tempResource[this._tempResource.length - 1].resourceSettings.id]) && (apps[this._appointmentSettings["allDay"]] === true)) {
                this._setAllDayPos(apps, day, res);
                this.allDayCount.push(apps);
            }
        },

        _getResourceColor: function (record) {
            var newResCollection = this._resCollection;
            var resourceDataIndex, appointData = "", appointCustomcss = "", applyFilter = false;
            if (!ej.isNullOrUndefined(this.model.group)) {
                for (var a = 0; a < this.render_Resources.length; a++) {
                    resourceDataIndex = this._findResourceIndex(this.render_Resources[a], newResCollection[a].id, record[this._appointmentSettings.resourceFields.split(',')[a].trim()], null, null);
                    if (!ej.isNullOrUndefined(resourceDataIndex)) {
                        appointData = (appointData == "" || ej.isNullOrUndefined(appointData)) ? this.render_Resources[a][resourceDataIndex][newResCollection[a].color] : appointData;
                        appointCustomcss = (appointCustomcss == "" || ej.isNullOrUndefined(appointCustomcss)) ? this.render_Resources[a][resourceDataIndex][newResCollection[a].appointmentClass] : appointCustomcss;
                        if (!ej.isNullOrUndefined(appointData) && !ej.isNullOrUndefined(appointCustomcss)) break;
                    }
                }
                appointData = !ej.isNullOrUndefined(appointData) && appointData != "" ? appointData : "";
                appointCustomcss = !ej.isNullOrUndefined(appointCustomcss) && appointCustomcss != "" ? appointCustomcss : "";
            }
            else {
                resourceDataIndex = this._findResourceIndex(this.render_Resources[this.render_Resources.length - 1], newResCollection[newResCollection.length - 1].id, record[this._appointmentSettings.resourceFields.split(',')[this._appointmentSettings.resourceFields.split(',').length - 1].trim()], null, null);
                if (!ej.isNullOrUndefined(resourceDataIndex)) {
                    appointData = !ej.isNullOrUndefined(this.render_Resources[this.render_Resources.length - 1][resourceDataIndex][newResCollection[newResCollection.length - 1].color]) ? this.render_Resources[this.render_Resources.length - 1][resourceDataIndex][newResCollection[newResCollection.length - 1].color] : appointData;
                    appointCustomcss = !ej.isNullOrUndefined(this.render_Resources[this.render_Resources.length - 1][resourceDataIndex][newResCollection[newResCollection.length - 1].appointmentClass]) ? this.render_Resources[this.render_Resources.length - 1][resourceDataIndex][newResCollection[newResCollection.length - 1].appointmentClass] : appointCustomcss;
                }
            }
            return { appointData: appointData, appointCustomcss: appointCustomcss, applyFilter: applyFilter };
        },

        _getResourceValue: function (target, index) {
            var resDetails;
            if (ej.scheduleFeatures.resources && (this._tempResource.length != 0)) {
                var resource = this._getResourceDetails(target);
				var predicate = ej.Predicate(this._tempResource[resource.length - 1].resourceSettings["id"], ej.FilterOperators.equal, resource[0].id);
				predicate = (this._grouping.length > 1) ? predicate.and(this._tempResource[resource.length - 1].resourceSettings["groupId"], ej.FilterOperators.equal,  resource[1].id) : predicate;
		        resDetails = ej.DataManager(this._resCollection[resource.length - 1].dataSource).executeLocal(new ej.Query().where(predicate))[0];
			}
            return resDetails;
        },

        _getResourceDetails: function (target, index) {
            if ((this._tempResource.length != 0)) {
                if (this._tempResource.length > 0) {
                    var noOfDays = this.currentView() == "day" ? 1 : (this.model.showWeekend && (this.currentView() == "week" || this.currentView() == "month")) ? 7 : this.model.workWeek.length;
                    noOfDays = (this.model.showWeekend && this.currentView() == "customview" && this._dateRender.length >= 7) ? 7 : (this.currentView() == "customview" && this._dateRender.length < 7) ? this._dateRender.length : noOfDays;
                    index = this.currentView() === "month" || this.currentView() == "customview" ? target.index() : (!ej.isNullOrUndefined(this._cellIndex) && ej.isNullOrUndefined(this._multiple)) ? this._cellIndex : target.index();
                    !target.hasClass("e-detailedapp") ? this.index = index : "";
                    index = target.hasClass("e-detailedapp") ? this.index : index;
                    if (this._resWorkWeek) {
                        var resIndex = 0;
                        for (var a = 0; a < this._valueCollection.length; a++) {
                            if (!ej.isNullOrUndefined(this._valueCollection[a][this._tempResource[this._tempResource.length - 1].resourceSettings["workWeek"]]))
                                resIndex += this._valueCollection[a][this._tempResource[this._tempResource.length - 1].resourceSettings["workWeek"]].length;
                            else
                                resIndex += this.model.workWeek.length;
                            if (resIndex > target.index()) {
                                index = a;
                                break;
                            }
                        }
                    }
                    else if (this._resCustomView) {
                        var resIndex = 0;
                        for (var a = 0; a < this._valueCollection.length; a++) {
                            var resRenderDate = this._tempResource[this._tempResource.length - 1].resourceSettings["renderDates"];
                            if (!ej.isNullOrUndefined(this._valueCollection[a][resRenderDate])) {
                                resIndex += this._getCustomDatesCount(a, resRenderDate);
                            }
                            if (resIndex > target.index()) {
                                index = a;
                                break;
                            }
                        }
                    }
                    else
                        index = (this.model.orientation === "vertical" && this._customOrientation === "vertical") ? parseInt(index / noOfDays) : !ej.isNullOrUndefined(this._workCellIndex) ? this._workCellIndex : target.parent().index();
                    var res1 = (this.model.orientation === "vertical" && this._customOrientation === "vertical") ? this._valueCollection : this._resCollect;
                    index = ((!ej.isNullOrUndefined(res1)) && index > res1.length) ? target.closest(".e-workcells").hasClass("e-workcells") ? target.parent().index() : target.closest(".e-workcells").parent().index() : index;
                    index = (index > 0) ? index : 0;
                    var group, resourceData, query, result; this._resourceCollection = [];
                    var newResCollection = this._resCollection;
                    for (var i = newResCollection.length - 1; i >= 0; i--) {
                        if (i == newResCollection.length - 1) {
                            if (!ej.isNullOrUndefined(this.model.group)) {
                                this._resourceCollection.push({ id: res1[index][newResCollection[i].id] });
                                group = res1[index][newResCollection[i].groupId];
                            }
                            else {
                                this._resourceCollection.push({ id: newResCollection[newResCollection.length - 1].dataSource[index][newResCollection[newResCollection.length - 1].id] });
                                group = newResCollection[newResCollection.length - 1].dataSource[index][newResCollection[newResCollection.length - 1].groupId];
                            }
                        }
                        else {
                            resourceData = newResCollection[i].dataSource instanceof ej.DataManager ? newResCollection[i].dataSource : ej.DataManager(newResCollection[i].dataSource);
                            query = new ej.Query().where(newResCollection[i].id, ej.FilterOperators.equal, group);
                            result = resourceData.executeLocal(query);
                            this._resourceCollection.push({ id: result[0][newResCollection[i].id] });
                            group = result[0][newResCollection[i].groupId];
                        }
                    }
                    return this._resourceCollection;
                }
            }
        },

        _getResourceFields: function (obj) {
            if (!ej.isNullOrUndefined(this.model.group) || this._tempResource.length > 1) {
                for (var j = 0, i = this._resourceCollection.length - 1; j < this._resourceCollection.length; j++ , i--)
                    obj[this._appointmentSettings.resourceFields.split(',')[j].trim()] = this._resourceCollection[i].id;
            }
            else
                obj[this._appointmentSettings.resourceFields.split(',')[0].trim()] = this._resourceCollection[0].id;
            return obj;
        },
        _getDragDropResourceData: function (proxy, cellIndex, newAddList) {
            var prevNewAddList = newAddList[proxy._appointmentSettings.resourceFields.split(',')[proxy._appointmentSettings.resourceFields.split(',').length - 1].trim()];
               if (proxy._appointmentSettings.resourceFields.split(',').length > 1)
             var prevNewList = newAddList[proxy._appointmentSettings.resourceFields.split(',')[proxy._appointmentSettings.resourceFields.split(',').length - 2].trim()];
            if (!ej.isNullOrUndefined(cellIndex)) {
                var noOfCols = proxy.currentView() == "day" ? 1 : (proxy.model.showWeekend && (proxy.currentView() == "week" || proxy.currentView() == "month")) ? 7 : proxy.model.workWeek.length;
                noOfCols = (proxy.model.showWeekend && proxy.currentView() == "customview" && proxy._dateRender.length >= 7) ? 7 : (proxy.currentView() == "customview" && proxy._dateRender.length < 7) ? proxy._dateRender.length : noOfCols;
                var index = proxy.model.enableRTL ? proxy.res1.length - Math.floor(cellIndex / noOfCols) - 1 : Math.floor(cellIndex / noOfCols);
                if (proxy._resWorkWeek) {
                    var resIndex = 0;
                    for (var a = 0; a < proxy.res1.length; a++) {
                        if (!ej.isNullOrUndefined(proxy.res1[a][proxy.model.resources[proxy.model.resources.length - 1].resourceSettings["workWeek"]]))
                            resIndex += proxy.res1[a][proxy.model.resources[proxy.model.resources.length - 1].resourceSettings["workWeek"]].length;
                        else
                            resIndex += proxy.model.workWeek.length;

                        if (resIndex > cellIndex) {
                            index = a;
                            break;
                        }
                    }
                }
                if (proxy._resCustomView) {
                    var resIndex = 0;
                    for (var a = 0; a < proxy.res1.length; a++) {
                        var resCustomSettings = proxy.model.resources[proxy.model.resources.length - 1].resourceSettings["renderDates"];
                        if (!ej.isNullOrUndefined(proxy.res1[a][resCustomSettings]))
                            resIndex += proxy._getCustomDatesCount(a, resCustomSettings);
                        if (resIndex > cellIndex) {
                            index = a;
                            break;
                        }
                    }
                }
                var newRes = (proxy.model.orientation == "vertical" && proxy._customOrientation == "vertical") ? proxy.res1[index] : proxy._resCollect[cellIndex];
                if (!this._groupEditing  && !this._groupEdit) {
                    newAddList[proxy._appointmentSettings.resourceFields.split(',')[proxy._appointmentSettings.resourceFields.split(',').length - 1].trim()] = newRes[proxy.model.resources[proxy.model.resources.length - 1].resourceSettings.id]+",";
                    if (proxy._appointmentSettings.resourceFields.split(',').length > 1)
                        newAddList[proxy._appointmentSettings.resourceFields.split(',')[proxy._appointmentSettings.resourceFields.split(',').length - 2].trim()] = newRes[proxy.model.resources[proxy.model.resources.length - 1].resourceSettings.groupId]+",";
                }
                else {
                    var resc = (newAddList[proxy._appointmentSettings.resourceFields.split(',')[proxy._appointmentSettings.resourceFields.split(',').length - 1].trim()]+",").split(',');
                    if (proxy._appointmentSettings.resourceFields.split(',').length > 1)
                        var gresc = (newAddList[proxy._appointmentSettings.resourceFields.split(',')[proxy._appointmentSettings.resourceFields.split(',').length - 2].trim()] + ",").split(',');
                    var obje = new ej.DataManager(this._processed).executeLocal(new ej.Query().where("Guid", ej.FilterOperators.equal, this._appUid));
                    obje[0] = this.tempResApp;
                    var reindex = obje[0][this._appointmentSettings.resourceFields.split(',')[this._appointmentSettings.resourceFields.split(',').length -1]].toString();
                    var diffindex = this._findResourceIndex(proxy.res1, "id", reindex, null, null);
                    if (resc.length - 1 < 2) {
                        newAddList[proxy._appointmentSettings.resourceFields.split(',')[proxy._appointmentSettings.resourceFields.split(',').length - 1].trim()] = newRes[proxy.model.resources[proxy.model.resources.length - 1].resourceSettings.id].toString() + ",";
                        if (proxy._appointmentSettings.resourceFields.split(',').length > 1)
                            newAddList[proxy._appointmentSettings.resourceFields.split(',')[proxy._appointmentSettings.resourceFields.split(',').length - 2].trim()] = newRes[proxy.model.resources[proxy.model.resources.length - 1].resourceSettings.groupId].toString() + ",";
                    }
                    if (resc.length - 1 >= 2 && (reindex != newRes[proxy.model.resources[proxy.model.resources.length - 1].resourceSettings.id].toString())) {
                        newAddList[proxy._appointmentSettings.resourceFields.split(',')[proxy._appointmentSettings.resourceFields.split(',').length - 1].trim()] = "";
                        if (proxy._appointmentSettings.resourceFields.split(',').length > 1)
                          newAddList[proxy._appointmentSettings.resourceFields.split(',')[proxy._appointmentSettings.resourceFields.split(',').length - 2].trim()] = "";
                        for (var i = 0; i < resc.length - 1; i++) {
                            if (resc[i] == reindex) {
                                for (var j = 0; j < resc.length - 1; j++) {
                                    if (resc[j] == newRes[proxy.model.resources[proxy.model.resources.length - 1].resourceSettings.id].toString()) {
                                        newAddList[proxy._appointmentSettings.resourceFields.split(',')[proxy._appointmentSettings.resourceFields.split(',').length - 1].trim()] = prevNewAddList;
                                        if (proxy._appointmentSettings.resourceFields.split(',').length > 1)
                                    newAddList[proxy._appointmentSettings.resourceFields.split(',')[proxy._appointmentSettings.resourceFields.split(',').length - 2].trim()] = prevNewList;
                                        newAddList[proxy._appointmentSettings["startTime"]] = this.tempResApp[proxy._appointmentSettings["startTime"]];
                                        newAddList[proxy._appointmentSettings["endTime"]] = this.tempResApp[proxy._appointmentSettings["endTime"]];
                                        this._reverse = true;
                                        return newAddList;
                                    }
                                }
                                newAddList[proxy._appointmentSettings.resourceFields.split(',')[proxy._appointmentSettings.resourceFields.split(',').length - 1].trim()] += newRes[proxy.model.resources[proxy.model.resources.length - 1].resourceSettings.id].toString() + ",";
                                if (proxy._appointmentSettings.resourceFields.split(',').length > 1)
                                    newAddList[proxy._appointmentSettings.resourceFields.split(',')[proxy._appointmentSettings.resourceFields.split(',').length - 2].trim()] += newRes[proxy.model.resources[proxy.model.resources.length - 2].resourceSettings.groupId].toString() + ",";
                            }
                            else {
                                newAddList[proxy._appointmentSettings.resourceFields.split(',')[proxy._appointmentSettings.resourceFields.split(',').length - 1].trim()] += resc[i] + ",";
                                if (proxy._appointmentSettings.resourceFields.split(',').length > 1)
                                    newAddList[proxy._appointmentSettings.resourceFields.split(',')[proxy._appointmentSettings.resourceFields.split(',').length - 2].trim()] += gresc[i] + ",";
                            }
                        }
                    } 
                }
                if (newAddList[proxy._appointmentSettings.resourceFields.split(',')[proxy._appointmentSettings.resourceFields.split(',').length - 1].trim()].lastIndexOf(",") == newAddList[proxy._appointmentSettings.resourceFields.split(',')[proxy._appointmentSettings.resourceFields.split(',').length - 1].trim()].length - 1) {
                    newAddList[proxy._appointmentSettings.resourceFields.split(',')[proxy._appointmentSettings.resourceFields.split(',').length - 1].trim()] = newAddList[proxy._appointmentSettings.resourceFields.split(',')[proxy._appointmentSettings.resourceFields.split(',').length - 1].trim()].slice(',', -1);
                    if (proxy._appointmentSettings.resourceFields.split(',').length > 1)
                        newAddList[proxy._appointmentSettings.resourceFields.split(',')[proxy._appointmentSettings.resourceFields.split(',').length - 2].trim()] = newAddList[proxy._appointmentSettings.resourceFields.split(',')[proxy._appointmentSettings.resourceFields.split(',').length - 2].trim()].slice(',', -1);
                }
            }
            return newAddList;
        },


        _renderResourceData: function (targetElement, index) {
            if ((targetElement.hasClass("e-workcells") || targetElement.hasClass("e-alldaycells") || targetElement.hasClass("e-monthcells")) && !targetElement.hasClass("e-resourceheadercells")) this._getResourceDetails(targetElement)
            var fieldCollection = [], collection = [];
            if (this._tempResource.length) {
                for (var k = this._resourceCollection.length - 1; k >= 0; k--) {
                    if (k == this._resourceCollection.length - 1)
					     var resourceDataIndex = (this._grouping.length > 1) ? this._findResourceIndex(this._resCollection[k].dataSource, this._resCollection[k].id, this._resourceCollection[(this._resourceCollection.length - 1) - k].id, this._resCollection[k].groupId, this._resourceCollection[this._resourceCollection.length  - k].id) : this._findResourceIndex(this._resCollection[k].dataSource, this._resCollection[k].id, this._resourceCollection[(this._resourceCollection.length - 1) - k].id, null, null);
                    else
					    var resourceDataIndex = this._findResourceIndex(this._resCollection[k].dataSource, this._resCollection[k].id, this._resourceCollection[(this._resourceCollection.length - 1) - k].id, null, null);
                    fieldCollection.push(this._resCollection[k].dataSource[resourceDataIndex]);
                    if (k != 0) {
                        var query = new ej.Query().where(ej.Predicate(this._resCollection[k].groupId, ej.FilterOperators.equal, this._resCollection[k].dataSource[resourceDataIndex][this._resCollection[k].groupId]));
                        var resApp = new ej.DataManager(this._resCollection[k].dataSource).executeLocal(query);
                        index = this._findResourceIndex(resApp, this._resCollection[k].id, this._resourceCollection[(this._resourceCollection.length - 1) - k].id, null, null);
                        collection = resApp;
                        this._appointmentAddWindow.find('.owner_' + (k)).ejAutocomplete("clearText");
                        this._appointmentAddWindow.find('.owner_' + (k)).ejAutocomplete("option", "dataSource", collection);
                        this._appointmentAddWindow.find('.owner_' + (k)).data("ejAutocomplete").selectValueByKey(collection[index][this._resCollection[k].id]);
                    }
                    else {
                        this._appointmentAddWindow.find('.owner_' + (k)).ejAutocomplete("clearText");
						this._appointmentAddWindow.find('.owner_' + (k)).ejAutocomplete("option", "dataSource", this._resCollection[k].dataSource);
                        this._appointmentAddWindow.find('.owner_' + (k)).data("ejAutocomplete").selectValueByKey(fieldCollection[(this._resourceCollection.length - 1) - k][this._resCollection[k].id]);
                    }
                }
            }
        },

        _bindResourcesData: function () {
            if ((this._tempResource.length != 0)) {
                this._resourceInfo = []; var resFlag = false;
                for (var i = 0; i < this._tempResource.length; i++) {
                    if (!ej.isNullOrUndefined(this._tempResource[i].resourceSettings)) {
                        if (ej.isNullOrUndefined(this._tempResource[i].resourceSettings.query) || !(this._tempResource[i].resourceSettings.query instanceof ej.Query))
                            this._tempResource[i].resourceSettings.query = ej.Query();
                        if (this._tempResource[i].resourceSettings.dataSource instanceof ej.DataManager)
                            this._initResourceData(this._tempResource[i].resourceSettings, i);
                        else {
                            this._resourceInfo.push(this._tempResource[i].resourceSettings);
                            resFlag = true;
                        }
                    }
                }
                if (resFlag)
                    this._renderInitSchedule();
            }
        },

        _renderResourceElements: function ($appWindow) {
            for (var i = 0; i < this._tempResource.length; i++) {
                $appWindow += "<tr><td class='e-leftfields e-textlabel'>" + this._tempResource[i].title + ":</td><td colspan='3' class='e-rightfields'><input id='" + this._id + "_ownerfield_" + i + "'  class='owner_" + i + "' type='text' value=''/><div id='ownerlist'></div></td></tr>";
            }
            return $appWindow;
        },

        _renderResourcesTemplate: function () {
            this.resourceHeadTemplate = $.templates(resourceHeadTemplate());
        }
    };
})(jQuery, Syncfusion);