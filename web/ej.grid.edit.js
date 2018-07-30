(function ($, ej, undefined) {
    ej.gridFeatures = ej.gridFeatures || {};
    ej.gridFeatures.edit = {
        _processEditing: function () {
            var colInfo = this._columnToSelect(), query = colInfo.query, dropObj = [], dropField = colInfo.fields, promises = [], qPromise,
                            e = this._relationalColumns, len = e.length, req;
            this.model.query._fromTable != "" && query.from(this.model.query._fromTable);
            req = dropField.length;
            if (req) 
                promises.push(this._dataManager.executeQuery(query));
            if (len != 0) {
                var obj, qry;
                for (var i = 0; i < len; i++) {
                    obj = e[i], qry = new ej.Query().select([obj.key, obj.value]);
                    qPromise = obj["dataSource"].ready === undefined ? obj["dataSource"].executeQuery(qry) : obj["dataSource"].ready;
                    promises.push(qPromise);
                }
            }
            if (colInfo.fieldsDrop.length) {
                var colLen = colInfo.fieldsDrop.length, fields = colInfo.fieldsDrop;
                for (var col = 0; col < colLen; col++) {
                    var tempobj = [];
                    var colObj = this.getColumnByField(fields[col]);
                    if (!ej.isNullOrUndefined(ej.getObject("editParams.fields.text", colObj))) {
                        var params = colObj.editParams;
                        dropObj.push(params.fields);
                    }
                    else
                        dropObj.push(fields[col]);
                    if (dropObj[col] instanceof Object) {
                        tempobj.push(dropObj[col].text);
                        tempobj.push(dropObj[col].value);
                    }
                    else tempobj.push(dropObj[col]);
                    var query = new ej.Query().select(tempobj);
                    promises.push(colObj.dataSource.executeQuery(query));
                }
            }
            if (promises.length != 0) {
                $.when.apply(this, promises).then(ej.proxy(function () {
                    var arg = [].slice.call(arguments, 0, arguments.length);
                    for (var i = 0, j = 0, k = 0, s = req, flag, plen = promises.length; i < plen; i++) {
                        while (s > 0) {
                            ej.createObject(dropField[--s], arg[i].result, this._dropDownManager);
                            flag = true;
                        }
                        if (flag && i == 0) continue; /* i == 0 - since one req will be made for all Ddl columns*/
                        if (e.length != j) {
                            var obj = e[j], key = obj.field + "." + obj.key + "." + obj.value;
                            ej.createObject(key, arg[i].result, this._dropDownManager);
                            j++;
                            continue;
                        }
                        if (e.length == j && dropObj.length) {
                            if (dropObj[k] instanceof Object) {
                                ej.createObject(dropObj[k].text, arg[i].result, this._dropDownManager);
                                ej.createObject(dropObj[k].value, arg[i].result, this._dropDownManager);
                            }
                            else
                                ej.createObject(dropObj[k], arg[i].result, this._dropDownManager);
                            k++;
                        };
                    }
                    this._initiateTemplateRendering();
                }, this));
            }
            else
                this._initiateTemplateRendering();
        },
        _initiateTemplateRendering: function() {
            if (this.model.editSettings.editMode == "normal") this.addEditingTemplate();
            else if (this.model.editSettings.editMode == "batch") this.addBatchEditTemplate();
            else if (this.model.editSettings.editMode == "dialog" ||
                this.model.editSettings.editMode == "externalform" ||
               this.model.editSettings.editMode == "inlineform")
                this.addDialogEditingTemplate();
            else this.addExternalDialogEditingTemplate();
            if ((this.model.editSettings.showAddNewRow && this.model.editSettings.editMode == "normal"))
                this._startAdd();
        },
        addEditingTemplate: function () {
            if (this.model.columns.length == 0)
                return;
            var $tbody = ej.buildTag('tbody');
            var $tr = ej.buildTag('tr');
            var $td = ej.buildTag('td', "", {}, { colSpan: this.model.scrollSettings.frozenColumns > 0 ? this.model.scrollSettings.frozenColumns : this.model.columns.length });
            var $form = ej.buildTag('form', "", {}, { id: this._id + "EditForm", "class": "gridform" });
            var $table = ej.buildTag('table.e-table');
            var $innerTbody = ej.buildTag('tbody');
            var $innerTr = ej.buildTag('tr');
            $tbody.append($tr);
            $tr.append($td);
            $td.append($form);
            var $colGroup = $(document.createElement('colgroup'));
            $form.append($table);
            $table.append($colGroup);
            $innerTbody.append($innerTr).appendTo($table);
            if (this.model.scrollSettings.frozenColumns > 0) {
                var $tbodyClone = $tbody.clone();
                $tbodyClone.find("td").first().prop("colSpan", this.model.columns.length - this.model.scrollSettings.frozenColumns);
            }
            for (var columnCount = 0; columnCount < this.model.columns.length; columnCount++) {
                var $innerTd = ej.buildTag('td.e-rowcell');
                $innerTr.append($innerTd.get(0));
                if (this.model.columns[columnCount]["type"] == "checkbox" && !this._isMapSelection)
                    continue;
                if (ej.isNullOrUndefined(this.model.columns[columnCount]["commands"]) &&
                 (!this.model.columns[columnCount]["template"] || (this.model.columns[columnCount]["template"] && this.model.columns[columnCount]["allowEditing"] != false && this.model.columns[columnCount]["field"]))) {
                    this._initCellEditType(columnCount, $innerTd);
                } else if (this.model.columns[columnCount]["template"]) {
                    var helpers = {}, htxt = this.model.columns[columnCount].headerText;
                    helpers["_" + this._id + "ColumnTemplating"] = ej.proxy(this._gridTemplate, null, this);
                    $.views.helpers(helpers);
                    if (!ej.isNullOrUndefined(htxt) && !ej.isNullOrUndefined(htxt.match(/[^0-9\s\w]/g)))
                        htxt = htxt.replace(/[^0-9\s\w]/g, "_");
                    $("#" + this._id + htxt + columnCount + "_Template").remove();
                    var scriptElement = this._createTemplateElement(this.model.columns[columnCount]);
                    $innerTd.addClass("e-templatecell").html("{{:~_" + this._id + "ColumnTemplating('" + scriptElement.id + "','" + columnCount + "')}}");
                } else if (this.model.columns[columnCount]["commands"]) {
                    var helpers = {};
                    helpers["_" + this._id + "UnboundTemplate"] = this._unboundTemplateRendering;
                    $.views.helpers(helpers);
                    $("#" + this._id + this.model.columns[columnCount].headerText.replace(/[^a-z0-9|s_]/gi, '')+ columnCount + "_UnboundTemplate").remove();
                    var divElement = this._createUnboundElement(this.model.columns[columnCount], columnCount);
                    $innerTd.addClass("e-unboundcell").addClass("e-" + this.model.columns[columnCount]["headerText"].replace(/[^a-z0-9|s_]/gi, '') + columnCount).html("{{:~_" + this._id + "UnboundTemplate('" + divElement.id + "')}}");
                    this.model.scrollSettings.frozenColumns > 0 && $innerTd.addClass("e-frozenunbound");
                    this._isUnboundColumn = true;
                }
                if (this.model.columns[columnCount]["textAlign"] != undefined)
                    $innerTd.css("text-align", this.model.columns[columnCount]["textAlign"]);
                this.model.columns[columnCount]["allowEditing"] == false && $innerTd.find(".e-field").attr("disabled", true).addClass("e-disable");
                if (this.model.columns[columnCount]["isPrimaryKey"] === true)
                    $innerTd.find(".e-field").attr("disabled", true).addClass("e-disable");
                if (this.model.columns[columnCount]["isIdentity"] === true) {
                    $innerTd.find(".e-field").addClass("e-identity");
                    this._identityKeys.push($.trim(this.model.columns[columnCount].field));
                    this._identityKeys = ej.isNullOrUndefined($.uniqueSort) ? $.unique(this._identityKeys.sort()) : $.uniqueSort(this._identityKeys.sort());
                }
                var $col = $(document.createElement('col'));
                if (this.model.columns[columnCount]["priority"]) {
                    $innerTd.addClass("e-table-priority-" + this.model.columns[columnCount]["priority"]);
                    $col.addClass("e-table-priority-" + this.model.columns[columnCount]["priority"]);
                }
                if (this.model.columns[columnCount]["visible"] === false) {
                    $col.css("display", "none");
                    $innerTd.addClass("e-hide");
                }
                if (!ej.isNullOrUndefined(this.model.columns[columnCount]["cssClass"])) {
                    $innerTd.addClass(this.model.columns[columnCount]["cssClass"]);
                }
                !this.model.groupSettings.showGroupedColumn && $innerTd.addClass("{{for ~groupedColumns}}" +
                    " {{if #data == '" + this.model.columns[columnCount]["field"] + "'}}e-hide{{/if}}" +
                    "{{/for}}") && $col.css("display", "none");
                $colGroup.append($col);
                if (columnCount == this.model.scrollSettings.frozenColumns - 1) {
                    $innerTr = $tbodyClone.find("tr").last();
                    $colGroup = $tbodyClone.find("colgroup");
                    $.templates(this._id + "_JSONFrozenEditingTemplate", $tbody.html());
                    $tbody = $tbodyClone;
                }
            }
            $.templates(this._id + "_JSONEditingTemplate", $tbody.html());
        },

        addDialogEditingTemplate: function () {
            if (this.model.columns.length == 0)
                return;
            var $tbody = ej.buildTag('div');
            var $form = ej.buildTag('form.gridform', "", {}, { id: this._id + "EditForm" });
            var $table = ej.buildTag('table');
            var $innerTr, $labelTd, $valueTd, trElement, tdElement;
            for (var columnCount = 0; columnCount < this.model.columns.length; columnCount++) {
                if (this.model.columns[columnCount]["type"] == "checkbox" && !this._isMapSelection)
                    continue;
                if (this.model.editSettings.editMode == "dialog") {
                    trElement = 'tr';
                    tdElement = 'td';
                }
                else trElement = tdElement = 'div';
                $innerTr = ej.buildTag(trElement);
                $labelTd = ej.buildTag(tdElement, "", { "text-align": "right" }).addClass("e-label");
                $valueTd = ej.buildTag(tdElement, "", { "text-align": "left" }).addClass("e-rowcell");
				if($innerTr.is('div'))
                    $innerTr.addClass("e-gridFromDiv")
                 if (this.model.columns[columnCount]["priority"] && this.model.editSettings.editMode == "inlineform") 
                    $innerTr.addClass("e-table-priority-" + this.model.columns[columnCount]["priority"]);
                $innerTr.append($labelTd.get(0)).append($valueTd.get(0));
                if (this.model.columns[columnCount].headerText == undefined)
                    this.model.columns[columnCount].headerText = this.model.columns[columnCount].field;
                $labelTd.append("<label for='" + this.model.columns[columnCount].field + "'>" + this.model.columns[columnCount].headerText + "</label>");
                if (ej.isNullOrUndefined(this.model.columns[columnCount]["commands"]) &&
				(!this.model.columns[columnCount]["template"] || (this.model.columns[columnCount]["template"] && this.model.columns[columnCount]["allowEditing"] !=false && this.model.columns[columnCount]["field"])))
                    this._initCellEditType(columnCount, $valueTd);
                else if (this.model.columns[columnCount]["template"]) {
                    var helpers = {}, htxt = this.model.columns[columnCount].headerText;
                    helpers["_" + this._id + "ColumnTemplating"] = ej.proxy(this._gridTemplate, null, this);
                    $.views.helpers(helpers);
                    if (!ej.isNullOrUndefined(htxt) && !ej.isNullOrUndefined(htxt.match(/[^0-9\s\w]/g)))
                        htxt = htxt.replace(/[^0-9\s\w]/g, "_");
                    $("#" + this._id + htxt + columnCount + "_Template").remove();
                    var scriptElement = this._createTemplateElement(this.model.columns[columnCount]);
                    $valueTd.addClass("e-templatecell").html("{{:~_" + this._id + "ColumnTemplating('" + scriptElement.id + "','" + columnCount + "')}}");
                } else if (this.model.columns[columnCount]["commands"]) {
                    var helpers = {};
                    helpers["_" + this._id + "UnboundTemplate"] = this._unboundTemplateRendering;
                    $.views.helpers(helpers);
                    $("#" + this._id + this.model.columns[columnCount].headerText.replace(/[^a-z0-9|s_]/gi, '')+columnCount+ "_UnboundTemplate").remove();
                    var divElement = this._createUnboundElement(this.model.columns[columnCount], columnCount);
                    $valueTd.addClass("e-unboundcell").addClass("e-" + this.model.columns[columnCount]["headerText"].replace(/[^a-z0-9|s_]/gi, '')+columnCount).html("{{:~_" + this._id + "UnboundTemplate('" + divElement.id + "')}}");
                    this.model.scrollSettings.frozenColumns > 0 && $valueTd.addClass("e-frozenunbound");
                    this._isUnboundColumn = true;
                    $innerTr.addClass("e-hide");
                }
                this.model.columns[columnCount]["allowEditing"] == false && $valueTd.find(".e-field").attr("disabled", true).addClass("e-disable");
                if (this.model.columns[columnCount]["isIdentity"] === true) {
                    $valueTd.find(".e-field").addClass("e-identity");
                    this._identityKeys.push($.trim(this.model.columns[columnCount].field));
                    this._identityKeys = ej.isNullOrUndefined($.uniqueSort) ? $.unique(this._identityKeys.sort()) : $.uniqueSort(this._identityKeys.sort());
                }
                if (this.model.columns[columnCount]["visible"] === false)
                    $innerTr.addClass("e-hide");
                 if (!ej.isNullOrUndefined(this.model.columns[columnCount]["cssClass"])) {
                     $valueTd.addClass(this.model.columns[columnCount]["cssClass"]);
                }
                if (this.model.editSettings.editMode == "dialog") {
                    $form.append($table);
                    $table.append($innerTr);
                } else
                    $form.append($innerTr);
                $form.appendTo($tbody);
                if (this.model.columns[columnCount]["isPrimaryKey"] === true) {
                    $valueTd.find(".e-field").attr("disabled", true).addClass("e-disable");
                    this._primaryKeys.push($.trim(this.model.columns[columnCount].field));
                    this._primaryKeys = ej.isNullOrUndefined($.uniqueSort) ? $.unique(this._primaryKeys.sort()) : $.uniqueSort(this._primaryKeys.sort());
                }
            }
            if (this.model.editSettings.editMode == "dialog") $form.append($table);
            $tbody = this.renderDiaglogButton($form, $tbody);
            $.templates(this._id + "_JSONDialogEditingTemplate", $tbody.html());
        },
        _editEventTrigger: function (args) {
            if (args.requestType == "save" || args.requestType == "delete") {
                var params = {
                    data: args.data,
                    rowData: args.data,
                    previousData: args.previousData,
                    action: args.action !== undefined ? args.action : args.requestType,
                };
                if (!ej.isNullOrUndefined(args.foreignKeyData))
                    params.foreignKeyData = args.foreignKeyData;
				this._trigger("end" + params.action.charAt(0).toUpperCase() + params.action.slice(1), params);
            }
        },
        _compiledDropDownTemplate: function (valueField, textField, colType, format) {
            var helpers = { _gridFormatting: this.formatting };
            $.views.helpers(helpers);
            var $select = ej.buildTag('select');
            var $option = ej.buildTag("option", format != null ? "{{:~_gridFormatting('" + format + "'," + textField + ",'" + this.model.locale + "')}}" : "{{:" + textField + "}}", {}, { value: "{{:" + valueField + "}}" });
            $select.append($option);
            return $.templates($select.html());
        },
        _initCellEditType: function (columnCount, element) {
            var fName = this.model.columns[columnCount].field;
            if (this.model.columns[columnCount]["foreignKeyValue"])
                this.model.columns[columnCount]["editType"] = "dropdownedit";
            if (this._dataSource() instanceof ej.DataManager  && this._dataSource().adaptor instanceof ej.ForeignKeyAdaptor) {
                var index = $.inArray(this.model.columns[columnCount].field,this._dataSource().adaptor.value),fk_Value,fk_fieldName;
				 if(index != -1){
						fk_Value = this._dataSource().adaptor.value[index];
						fk_fieldName = this._dataSource().adaptor.key[index];	 
				 }
            }
            if (this.model.columns[columnCount]["editTemplate"])
                this.model.columns[columnCount]["editType"] = "edittemplate";
            if (ej.isNullOrUndefined(this.model.columns[columnCount]["editType"]))
                if (this.model.columns[columnCount]["type"] == "date" || this.model.columns[columnCount]["type"] == "datetime")
                    this.model.columns[columnCount]["editType"] = this.model.columns[columnCount]["type"] + "picker";
                else
                    this.model.columns[columnCount]["editType"] = "stringedit";
            if (this.model.isResponsive)
                element.attr("data-cell",this._decode(this.model.columns[columnCount]["headerText"]));
            var splits = (fName || "").split("."), sLen = splits.length - 1, braces = "";
            if (!ej.isNullOrUndefined(fName))
                fName = fName.replace(/[^a-z0-9\s_]/gi, '');
            while (sLen) {
                braces += "(";
                sLen--;
            }
            switch (this.model.columns[columnCount]["editType"]) {
                case "edittemplate":
                    var temp = this.model.columns[columnCount].editTemplate.create;
                    if (typeof temp == "string") {
                        var temp1 = ej.util.getObject(temp, window);
                        if (!$.isFunction(temp1)) {
                            if ($(temp).length == 1 && $(temp).get(0).tagName == "SCRIPT")
                                var $edittemplate = $($(temp).html()).attr({ id: this._id + fName, name: this.model.columns[columnCount].field, "class":"e-field" });
                            else
                                var $edittemplate = $(temp).attr({ id: this._id + fName, name: this.model.columns[columnCount].field , "class":"e-field"});
                        }
                        else
                            var $edittemplate = $(temp1()).attr({ id: this._id + fName, name: this.model.columns[columnCount].field, "class":"e-field" });
                    }
                    else
                        var $edittemplate = $(temp()).attr({ id: this._id + fName, name: this.model.columns[columnCount].field, "class":"e-field" });
                    element.append($edittemplate);
                    break;
                case "stringedit":
                    element.html(ej.buildTag('input.e-field e-ejinputtext', "", {}, { value: "{{html:" + braces + "#data['" + splits.join("'] || {})['") + "']}}", id: this._id + fName, name: this.model.columns[columnCount].field, type:"text" }));
                    break;
                case "booleanedit":
                    element.html('{{if #data["' + splits.join('"]["') + '"]}} <input class="e-field e-checkbox" type ="checkbox" id=' + this._id + fName + ' name=' + this.model.columns[columnCount].field + ' checked="checkbox"></input>{{else}} <input class="e-field e-checkbox" type ="checkbox" id=' + this._id + fName + ' name=' + this.model.columns[columnCount].field + ' > {{/if}}');
                    if (this.model.editSettings.editMode == "normal")
                        element.addClass("e-boolcell");
                    break;
                case "numericedit":
                    var $numericText = ej.buildTag('input.e-numerictextbox e-field', "", {}, { type: "text", value: "{{:" + braces + "#data['" + splits.join("'] || {})['") + "']}}", id: this._id + fName, name: this.model.columns[columnCount].field });
                    element.append($numericText);
                    break;
                case "datepicker":
                case "datetimepicker":
                    var $datePicker = ej.buildTag('input.e-' + this.model.columns[columnCount]["editType"] + ' e-field', "", {}, { type: "text", value: "{{:" + braces + "#data['" + splits.join("'] || {})['") + "']}}", id: this._id + fName, name: this.model.columns[columnCount].field });
                    element.append($datePicker);
                    break;
                case "dropdownedit":
                    var currColumn = this.model.columns[columnCount], selectedItems = [], $foreignkeyfield, $foreignkeyvalue;
                    if (ej.isNullOrUndefined(currColumn.dataSource)) {
                        var arrayOfDatas;
                        if (ej.isNullOrUndefined(currColumn.dataSource) && (this._dataSource() instanceof ej.DataManager && this._dataSource().adaptor instanceof ej.ForeignKeyAdaptor && currColumn.field == fk_Value)) {
                            var data = this.model.dataSource.adaptor.foreignData[index];
                            $foreignkeyfield = this.model.dataSource.adaptor.key[index];
                            $foreignkeyvalue = this.model.dataSource.adaptor.value[index];
                            selectedItems = data;
                        }
                        var arrayOfDatas, field = currColumn.field;
                        if (ej.isNullOrUndefined(ej.getObject(field, this._dropDownManager)))
                            return;
                        arrayOfDatas = ej.getObject(field, this._dropDownManager);
                        var isObj = 0 in arrayOfDatas && typeof arrayOfDatas[0] == "object";
                        var uniqueData = uniqueData = ej.dataUtil.mergeSort(ej.distinct(arrayOfDatas, isObj ? field : undefined, isObj ? false : undefined));
                        if (selectedItems.length == 0) {
                            if (ej.isNullOrUndefined(currColumn.dataSource) && (this._dataSource() instanceof ej.DataManager && this._dataSource().adaptor instanceof ej.ForeignKeyAdaptor && currColumn.field == fk_Value)) {
                                for (var index = 0; index < uniqueData.length; index++)
                                    selectedItems.push({ text: uniqueData[index][0], value: uniqueData[index][1] });
                            }
                            else {
                                for (var index = 0; index < uniqueData.length; index++)
                                    selectedItems.push({ text: uniqueData[index], value: uniqueData[index] });
                            }
                        }
                    }
                    else {
                        if (ej.isNullOrUndefined(currColumn.foreignKeyField) && currColumn.dataSource instanceof ej.DataManager) {
                            var field = currColumn.field, arrData = ej.getObject(field, this._dropDownManager);
                            var isObj = 0 in arrData && typeof arrData[0] == "object";
                            var uniqueData = uniqueData = ej.dataUtil.mergeSort(ej.distinct(arrData, isObj ? field : undefined, isObj ? false : undefined));
                            if (!ej.isNullOrUndefined(ej.getObject("editParams.fields.text", currColumn)))
                                selectedItems = arrData;
                            if (selectedItems.length == 0) {
                                for (var index = 0; index < uniqueData.length; index++) {
                                    selectedItems.push({ text: uniqueData[index], value: uniqueData[index] });
                                }
                            }
                        }
                        else if(ej.isNullOrUndefined(currColumn.foreignKeyField) || (!(currColumn.field in this._dropDownManager) && !(currColumn.dataSource instanceof ej.DataManager)))
                            selectedItems = currColumn.dataSource
                        else
                            selectedItems = ej.getObject(currColumn.field + "." + currColumn.foreignKeyField + "." + currColumn.foreignKeyValue, this._dropDownManager);
                    }
                    var dropDownTemplate;
                    var fieldName = ej.isNullOrUndefined(currColumn.foreignKeyField) ? currColumn.field : currColumn.foreignKeyField;
                    if (currColumn.foreignKeyValue)
                        dropDownTemplate = this._compiledDropDownTemplate(fieldName, currColumn.foreignKeyValue, currColumn.type, currColumn.format);
                    else if ((this._dataSource() instanceof ej.DataManager && this._dataSource().adaptor instanceof ej.ForeignKeyAdaptor) && (currColumn.field == fk_Value)) {
                        dropDownTemplate = this._compiledDropDownTemplate($foreignkeyfield ? $foreignkeyfield : "value", $foreignkeyvalue ? $foreignkeyvalue : "text", currColumn.type, currColumn.format);
                    }
                    else {
                        var value = ej.getObject("editParams.fields.value", currColumn) || "value";
                        var text = ej.getObject("editParams.fields.text", currColumn) || "text";
                        dropDownTemplate = this._compiledDropDownTemplate(value, text, currColumn.type, currColumn.format);
                    }
                    if (!ej.isNullOrUndefined(currColumn.editParams) && ((this._dataSource() instanceof ej.DataManager && (this._dataSource() instanceof ej.DataManager && this._dataSource().adaptor instanceof ej.ForeignKeyAdaptor)) && (currColumn.field == fk_Value)))
                        element.get(0).innerHTML = "<input data-value='{{:" + fk_fieldName + "}}'/>";
                    else
                        element.get(0).innerHTML = ["<select>", dropDownTemplate.render(selectedItems), "</select>"].join("");
                    element.find("select,input").prop({ id: this._id + fName, name: currColumn.field }).addClass("e-field e-dropdownlist");
                    break;
            }
        },
        addBatchEditTemplate: function () {
            if (this.model.columns.length == 0)
                return;
            var $outerDiv = ej.buildTag('div', "", { display: "none" }, { id: this._id + "_BulkEditTemplate" }), i, columnCount, $innerDiv;
            for (i = 0, columnCount = this.model.columns.length; i < columnCount; i++) {
                if (ej.isNullOrUndefined(this.model.columns[i]["commands"]) && (ej.isNullOrUndefined(this.model.columns[i]["template"])) ||
                    (this.model.columns[i]["template"] && this.model.columns[i]["allowEditing"] != false && this.model.columns[i]["field"])) {				 
                    $innerDiv = ej.buildTag('div', "", {}, { id: this.model.columns[i].field.replace(/[^a-z0-9\s_]/gi, ej.pvt.consts.complexPropertyMerge) + "_BulkEdit" });
                    this._initCellEditType(i, $innerDiv);
                    $outerDiv.append($innerDiv);
                }
                if (this.model.columns[i]["isPrimaryKey"] === true) {
                    this._primaryKeys.push($.trim(this.model.columns[i].field));
                    this._primaryKeys = ej.isNullOrUndefined($.uniqueSort) ? $.unique(this._primaryKeys.sort()) : $.uniqueSort(this._primaryKeys.sort());
                }
                if (this.model.columns[i]["isIdentity"] === true) {
                    $innerDiv.find(".e-field").addClass("e-identity");
                    this._identityKeys.push($.trim(this.model.columns[i].field));
                    this._identityKeys = ej.isNullOrUndefined($.uniqueSort) ? $.unique(this._identityKeys.sort()) : $.uniqueSort(this._identityKeys.sort());
                }
            }
            if ($outerDiv.children().length)
                this._bulkEditTemplate = $outerDiv;

        },
        addExternalDialogEditingTemplate: function () {
            if (this.model.columns.length == 0)
                return;
			  var  $valueTd;
			   $valueTd = ej.buildTag('td', "", { "text-align": "left" }).addClass("e-rowcell");
            for (var columnCount = 0; columnCount < this.model.columns.length; columnCount++) {
                if (this.model.columns[columnCount]["type"] == "checkbox" && !this._isMapSelection)
                    continue;
                if (ej.isNullOrUndefined(this.model.columns[columnCount]["commands"]) && (!ej.isNullOrUndefined(this.model.columns[columnCount]["template"]) && this.model.columns[columnCount]["allowEditing"] != false && this.model.columns[columnCount]["field"]) && !ej.isNullOrUndefined(this.model.columns[columnCount].editTemplate))
                    this._initCellEditType(columnCount, $valueTd);
                if (this.model.columns[columnCount]["isPrimaryKey"] === true) {
                    this._primaryKeys.push($.trim(this.model.columns[columnCount].field));
                    this._primaryKeys = ej.isNullOrUndefined($.uniqueSort) ? $.unique(this._primaryKeys.sort()) : $.uniqueSort(this._primaryKeys.sort());
                }
                if (this.model.columns[columnCount]["isIdentity"] === true) {
                    this._identityKeys.push($.trim(this.model.columns[columnCount].field));
                    this._identityKeys = ej.isNullOrUndefined($.uniqueSort) ? $.unique(this._identityKeys.sort()) : $.uniqueSort(this._identityKeys.sort());
                }
            }
            var $tbody = ej.buildTag('div', "", { 'display': 'none' });
            var $form = ej.buildTag('form.gridform', "", {}, { id: this._id + "EditForm" });
            var cloneElement;
            if (this.model.editSettings.editMode == "dialogtemplate" && this.model.editSettings.dialogEditorTemplateID != null)
                cloneElement = this.model.editSettings.dialogEditorTemplateID;
            else if (this.model.editSettings.editMode == "externalformtemplate" && this.model.editSettings.externalFormTemplateID != null) {
                cloneElement = this.model.editSettings.externalFormTemplateID;
                $form.addClass("e-display");
            }
            else {
                cloneElement = this.model.editSettings.inlineFormTemplateID;
                $form.addClass("e-display");
            }

            $form.html($(cloneElement).html());
            $tbody = this.renderDiaglogButton($form, $tbody);
            $.templates(this._id + "_JSONdialogTemplateMode", $tbody.html());
        },
        _editdblClickHandler: function (e) {
            var $target = $(e.target);
			if ($target.closest(".e-grid").attr("id") !== this._id) return;
            if ($target.hasClass("e-rowcell") || $target.closest("td").hasClass("e-rowcell")) {
                if (!this.model.isEdit || (this.model.editSettings.showAddNewRow && this.model.editSettings.editMode == "normal")) {
                    this._$currentTr = (this.model.scrollSettings.frozenColumns > 0 || this.model.scrollSettings.frozenRows > 0)
                        ? this.getRowByIndex($target.closest('tr').index())
                        : $target.closest('tr');
                     if(!ej.isNullOrUndefined(this._previousTr)){
                        if(this._$currentTr.length > 1 && this._$currentTr[0] != this._previousTr[0] && this._$currentTr[1] != this._previousTr[1])
                            return;
                        else if(this._$currentTr[0] != this._previousTr[0])
                            return;
                    }
                    this.startEdit(this._$currentTr);
                }
            }
        },
        _columnToSelect: function () {
            var column = [], columnDrop = [], cols = this.model.columns;
            for (var i = 0; i < this.model.columns.length; i++) {
                if (this._dataSource() instanceof ej.DataManager && this._dataSource().adaptor instanceof ej.ForeignKeyAdaptor) {
                    if ($.inArray(this.model.columns[i].field, this._dataSource().adaptor.value) != -1)
                        if (ej.isNullOrUndefined(this.model.columns[i]["editType"]))
                        this.model.columns[i]["editType"] = "dropdownedit";
                }
                if (this.model.columns[i]["editType"] === ej.Grid.EditingType.Dropdown && ej.isNullOrUndefined(this.model.columns[i]["dataSource"]))
                    column.push(this.model.columns[i].field);
                if (cols[i]["editType"] === ej.Grid.EditingType.Dropdown && ej.isNullOrUndefined(cols[i].foreignKeyField) && cols[i]["dataSource"] instanceof ej.DataManager)
                    columnDrop.push(this.model.columns[i].field);
            }
            if (column.length)
                return { query: ej.Query().select(column), fields: column, fieldsDrop: columnDrop };
            return { query: ej.Query(), fields: [], fieldsDrop: columnDrop };
        },
        _renderExternalForm: function () {
            var $externalform = ej.buildTag("div", "", { display: "none" }, { id: this._id + "_externalEdit", 'class': "e-form-container" });
            var $eformHeader = ej.buildTag("div", "", "", { id: this._id + "_eFormHeader", 'class': "e-form-titlebar" });
            var $eformTitle = ej.buildTag("span", "", "", { 'class': "e-form-title" });
            var $eformToggleBtn = ej.buildTag("div", "", "", { id: this._id + "_eFormToggleBtn", 'class': "e-form-togglebtn" });
            var $eformToggleIcon = ej.buildTag("span", "", "", { 'class': "e-form-toggle-icon e-icon" });
            $eformToggleBtn.append($eformToggleIcon);
            $eformHeader.append($eformTitle).append($eformToggleBtn);

            var $eformContent = ej.buildTag("div", "", "", { id: this._id + "_eFormContent", 'class': "e-form-content" });
            var $eform = ej.buildTag("div", "", "", { id: this._id + "_externalForm", 'class': "e-externalform" });
            var $contentOuterDiv = ej.buildTag("div", "", "", { 'class': "e-externalformedit" });
            $eform.append($contentOuterDiv);
            $eformContent.append($eform);
            return $externalform.append($eformHeader).append($eformContent);;
        },
        _buttonClick: function (e) {
            if (e.type == "close") {
                if (!this.model.isEdit)
                    return;
                this.model.isEdit = false;
                this.element.ejGrid("cancelEdit");
                this.refreshToolbar();
                return;
            }
            if ((e.keyCode !== undefined && e.keyCode != 13 && e.keyCode != 0) || this.model == null)
                return true;
            if (this.model.editSettings.editMode == "dialog" || this.model.editSettings.editMode == "dialogtemplate") {
                if (e.target.id == "EditDialog_" + this._id + "_Save") 
                    this.element.ejGrid("endEdit");
                 else if (e.target.id == "EditDialog_" + this._id + "_Cancel") {
                    this.element.ejGrid("cancelEdit");
                    $("#" + this._id + "_dialogEdit").ejDialog("close");
                }
            }
            else if (this.model.editSettings.editMode == "externalform" || this.model.editSettings.editMode == "externalformtemplate") {
                if ($(e.target).hasClass("e-form-toggle-icon")) {
                    this.element.ejGrid("cancelEdit");
                    $("#" + this._id + "_externalEdit").css("display", "none");
                }
                else {
                    if (e.target.id == "EditExternalForm_" + this._id + "_Save") {
                        if (this.element.ejGrid("endEdit").length !== undefined)
                            $("#" + this._id + "_externalEdit").css("display", "none");
                    } else if (e.target.id == "EditExternalForm_" + this._id + "_Cancel") {
                        this.element.ejGrid("cancelEdit");
                        $("#" + this._id + "_externalEdit").css("display", "none");
                    }
                }
            }
            else if (this.model.editSettings.editMode == "inlineform" || this.model.editSettings.editMode == "inlineformtemplate") {
                if (e.target.id == "InlineEditForm_" + this._id + "_Save")
                    this.element.ejGrid("endEdit");
                else if (e.target.id == "InlineEditForm_" + this._id + "_Cancel")
                    this.element.ejGrid("cancelEdit");
            }
            else
                this.element.ejGrid("cancelEdit");
        },
        _enableEditingEvents: function () {
            if (this.model.editSettings.allowEditing || this.model.editSettings.allowAdding) {
                if (this.model.editSettings.allowEditing && this.model.editSettings.editMode != "batch" && this.model.editSettings.allowEditOnDblClick) 
                    this._on(this.element, ($.isFunction($.fn.doubletap) && this.model.enableTouch) ? "doubletap" : "dblclick", ".e-gridcontent", this._editdblClickHandler);
                else {
                    this._off(this.element, "dblclick", ".e-gridcontent");
                    this._off(this.element, "doubletap", ".e-gridcontent");
                }
                this._off($("#" + this._id + "_dialogEdit"), "click ", "#EditDialog_" + this._id + "_Save ,#EditDialog_" + this._id + "_Cancel");
                this._off($("#" + this._id + "_externalEdit"), "click ", "#EditExternalForm_" + this._id + "_Save ,#EditExternalForm_" + this._id + "_Cancel");
                $(this.element).off("click", ".e-form-toggle-icon");
                $(this.element).off("click ", "#InlineEditForm_" + this._id + "_Save ,#InlineEditForm_" + this._id + "_Cancel");
                if (this.model.editSettings.editMode == "dialog" || this.model.editSettings.editMode == "dialogtemplate") {
                    this._on($("#" + this._id + "_dialogEdit"), "click ", "#EditDialog_" + this._id + "_Save ,#EditDialog_" + this._id + "_Cancel", this._buttonClick);
                }
                else if (this.model.editSettings.editMode == "externalform" || this.model.editSettings.editMode == "externalformtemplate") {
                    this._on($("#" + this._id + "_externalEdit"), "click ", "#EditExternalForm_" + this._id + "_Save ,#EditExternalForm_" + this._id + "_Cancel", this._buttonClick);
                    $(this.element).on("click", ".e-form-toggle-icon", $.proxy(this._buttonClick, this));
                }
                else if (this.model.editSettings.editMode == "batch") {
                    this._on($(document), "touchstart mousedown", this._saveCellHandler);
					this._batchEnabled = true;
				}

                else if (this.model.editSettings.editMode == "inlineform" || this.model.editSettings.editMode == "inlineformtemplate")
                    $(this.element).on("click ", "#InlineEditForm_" + this._id + "_Save ,#InlineEditForm_" + this._id + "_Cancel", $.proxy(this._buttonClick, this));
				
				if (this.model.editSettings.editMode != "batch" && this._batchEnabled) {
				    this._off($(document), "touchstart mousedown", this._saveCellHandler);
					this._batchEnabled = false;
				}

            } else {
                this._off($("#" + this._id + "_dialogEdit"), "click", "#EditDialog_" + this._id + "_Save ,#EditDialog_" + this._id + "_Cancel");
                $(this.element).off("click", ".e-icon");
                this._off($("#" + this._id + "_externalEdit"), "click", "#EditExternalForm_" + this._id + "_Save ,#EditExternalForm_" + this._id + "_Cancel");
                $(this.element).off("click", ".e-form-toggle-icon");
                $(this.element).off("click", "#InlineEditForm_" + this._id + "_Save ,#InlineEditForm_" + this._id + "_Cancel");
            }
        },
        _multiRowDelete: function () {
            var changes = {};
            changes.added = []; changes.deleted = [], changes.changed = [];
            changes.deleted = this.getSelectedRecords();
            var args = {};
			args.data = this.getSelectedRecords();
            args.tr = this.getSelectedRows();
            var foreignKeyData = this._getForeignKeyData(args.data);
            if (!ej.isNullOrUndefined(foreignKeyData))
                args.foreignKeyData = foreignKeyData;
                args.requestType = "delete";
            if (this._trigger("actionBegin", args))
                return true;
            var gridObject = this;
            this._sendBulkReuqest(changes, args);
        },
        deleteRow: function ($tr) {
            if (!this.model.editSettings.allowDeleting || (this.model.isEdit && this.model.editSettings.editMode != "batch" && !this.model.editSettings.showAddNewRow))
                return;
            if (this.model.editSettings.showDeleteConfirmDialog && !(this._confirmDialog).is(":visible")) {
                this._cDeleteData = $tr;
                this._confirmDialog.find(".e-content").html(this.localizedLabels.ConfirmDelete).end().ejDialog("open");
                return;
            }
            if ($.isArray($tr)) {
                this.selectRows($tr);
                this._multiRowDelete();
            }
            else {
                if (this.model.editSettings.editMode == "batch")
                    this._bulkDelete(this.getIndexByRow($tr));
                else {
                    if (this._primaryKeys.length == 0 && !this.model.editSettings.allowEditing && !this.model.editSettings.allowAdding) {
                        for (var i = 0; i < this.model.columns.length; i++) {
                            if (this.model.columns[i]["isPrimaryKey"] === true) {
                                this._primaryKeys.push($.trim(this.model.columns[i].field));
                                this._primaryKeys = ej.isNullOrUndefined($.uniqueSort) ? $.unique(this._primaryKeys.sort()) : $.uniqueSort(this._primaryKeys.sort());
                            }
                        }
                    }
                    if (this._selectedRow() == -1 && ej.isNullOrUndefined($tr)) {
                        alert(this.localizedLabels.DeleteOperationAlert);
                        return;
                    }
                    if (ej.isNullOrUndefined($tr))
                        $tr = this.model.scrollSettings.enableVirtualization ? this.getContentTable().find("tr[aria-selected='true']") : this.getRowByIndex(this._selectedRow());
                    this._primaryKeyValues = [];
                    this._getPrimaryKeyValues($tr);
                    var deleteManager = ej.DataManager(this._currentJsonData);
                    var query = new ej.Query();
                    for (var i = 0; i < this._primaryKeys.length; i++)
                        query = query.where(this._primaryKeys[i], ej.FilterOperators.equal, this._primaryKeyValues[i]);
                    var currentData = deleteManager.executeLocal(query);
                    var args = {};
                    args.tr = $tr;
                    args.data = args.rowData = currentData[0];
                    var foreignKeyData = this._getForeignKeyData(args.data);
                    if (!ej.isNullOrUndefined(foreignKeyData))
                        args.foreignKeyData = foreignKeyData;
                    args.requestType = ej.Grid.Actions.Delete;
                    if (this._trigger("actionBegin", args))
                        return true;
                    this._cDeleteData = currentData;
                    var promise;
                    if (!(ej.isOnWebForms && this.model.serverEvents && this.model.serverEvents.indexOf("endDelete") != -1) && this._dataSource() instanceof ej.DataManager && (!this._dataManager.dataSource.offline && this._dataManager.dataSource.json !== undefined) || (this._dataSource().adaptor instanceof ej.remoteSaveAdaptor)) {
                        promise = this._dataManager.remove(this._primaryKeys[0], this._primaryKeys.length ? ej.getObject(this._primaryKeys[0], currentData[0]) : null, this.model.query);
                        var proxy = this;
                        if ($.isFunction(promise.promise)) {
                            promise.done(function (e) {
                                proxy._processBindings(args);
                                proxy._primaryKeyValues = [];
                                proxy._cDeleteData = null;
                            });
                            promise.fail(function (e) {
                                args.error = e;
                                proxy._cDeleteData = null;
                                proxy._trigger("actionFailure", args)
                            });
                        } else
                            this._processBindings(args);
                    } else
                        this._processBindings(args);
                    if (promise == undefined || !$.isFunction(promise.promise)) {
                        this._primaryKeyValues = [];
                        this._cDeleteData = null;
                    }
                }
            }
        },
        
        _htmlEncode: function (html) {
            var str = html;
            if (!ej.isNullOrUndefined(str))
                str = isNaN(str) ? str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, '\'') : str;
            return str;
        },
        startEdit: function ($tr) {
		    if (!this.model.editSettings.allowEditing || (this.model.editSettings.showAddNewRow && this.model.editSettings.editMode == "normal" && this._excludeDetailRows().hasClass("e-editedrow")))
		        return;
		    if (this.element.ejWaitingPopup("model.showOnInit"))
		        return;
            if (this._selectedRow() == -1 && ej.isNullOrUndefined($tr)) {
                alert(this.localizedLabels.EditOperationAlert);
                return;
            }
            if (this.model.scrollSettings.enableVirtualization && ej.isNullOrUndefined($tr))
                $tr = this.getContentTable().find("tr[aria-selected='true']");
            if (ej.isNullOrUndefined($tr)) {
                this._currentTrIndex = this._selectedRow();
                this._$currentTr = this.getRowByIndex(this._currentTrIndex);
            } else {
                this._currentTrIndex = this.getIndexByRow($tr);
                this._$currentTr = $tr;
            }
            if (this.model.scrollSettings.allowVirtualScrolling && !this.model.scrollSettings.enableVirtualization)
                this._currentTrIndex = this._currentTrIndex % this.model.pageSettings.pageSize;
            if (!$(this._$currentTr).is(":visible"))
                return false;
            this._primaryKeyValues = [];
            this._getPrimaryKeyValues(this._$currentTr);
            var editedData = this._editedData = this._currentJsonData[this._currentTrIndex];
            var args = { row: this._$currentTr, rowIndex: this._currentTrIndex, primaryKey: this._primaryKeys, primaryKeyValue: this._primaryKeyValues, rowData: editedData };
            var cancel = this._trigger("beginEdit", args);
            if (cancel) {
                this._primaryKeyValues = [];
                return;
            }
            args.requestType = ej.Grid.Actions.BeginEdit;
            this._processBindings(args);

        },
        _getPrimaryKeyValues: function ($tr) {
            var trIndex, pkVal, nameAttr = $tr.attr("name"), column, virtualIndex, lastPageVal, isLastPage = false;
            this._lastVirtualPage = null;
            for (var index = 0; index < this._primaryKeys.length; index++) {
                column = this.getColumnByField(this._primaryKeys[index]);
                trIndex = this.getIndexByRow($tr);
                pkVal = this._currentJsonData;
                if (this.model.allowScrolling && this.model.scrollSettings.allowVirtualScrolling) {
                    if (!this.model.scrollSettings.enableVirtualization) {
                        trIndex = trIndex % this.model.pageSettings.pageSize;
                        virtualIndex = parseFloat(nameAttr) / this.model.pageSettings.pageSize + 1;
                        this._currentJsonData = this._virtualLoadedRecords[virtualIndex];
                        if (virtualIndex == this.model.pageSettings.totalPages && !this._prevPageRendered && this._virtualLoadedRecords[virtualIndex].length != this.model.pageSettings.pageSize) {
                            pkVal = $.extend(true, [], this._previousPageRecords);
                            lastPageVal = $.extend(true, [], this._virtualLoadedRecords[virtualIndex]);
                            ej.merge(pkVal, lastPageVal);
                            this._lastVirtualPage = this._currentJsonData = $.extend(true, [], pkVal);
                            isLastPage = true;
                        }

                    }
                    else {
                        trIndex = trIndex % this._virtualRowCount;
                        virtualIndex = parseInt(nameAttr, 32);
                    }
                    pkVal = isLastPage ? pkVal : this._virtualLoadedRecords[virtualIndex];
                    this._vCurrentTrIndex = trIndex;
                    this._currentVIndex = virtualIndex;
                }
                this._primaryKeyValues.push(this._htmlEncode(ej.getObject(column.field, pkVal[trIndex])));
            }
        },
         _startAdd: function() {
            if (!this.model.editSettings.allowAdding)
                return;
			this._isAddNew = true;
            if (this.model.editSettings.editMode == "batch")
                this._bulkAddRow();
            else {
                var cloneData = {}, cols = this.model.columns;
                for (var i = 0; i < cols.length; i++) {
                    if (!ej.isNullOrUndefined(this.model.parentDetails) && cols[i].field == this.model.parentDetails.parentKeyField)
                        cols[i].defaultValue = this.model.parentDetails.parentKeyFieldValue;
                    if (!ej.isNullOrUndefined(cols[i].field) && cols[i].field.indexOf(".") > 0)
                        ej.createObject(cols[i].field, cols[i].defaultValue || "", cloneData);
                    else
                        cloneData[cols[i].field] = !ej.isNullOrUndefined(cols[i].defaultValue) ? cols[i].defaultValue : (cols[i].type == "date" || cols[i].type == "datetime") ? null : "";
                }
                var args = {}, complexObject = {};
                args.data = args.rowData = cloneData;
                if (this.model.editSettings.editMode.indexOf('template') != -1) {
                    for (var i = 0; i < this.model.columns.length; i++) {
                        if (!ej.isNullOrUndefined(this.model.columns[i].field) && this.model.columns[i].field.indexOf(".") != -1) {
                            var splits = this.model.columns[i].field.split('.');
                            ej.createObject(this.model.columns[i].field, args.data[this.model.columns[i].field], complexObject);
                            args.data[splits[0]] = complexObject;
                            delete args.data[this.model.columns[i].field];
                        }
                    }
                }
                var foreignKeyData = this._getForeignKeyData(args.data);
                if (!ej.isNullOrUndefined(foreignKeyData))
                    args.foreignKeyData = foreignKeyData;
                args.requestType = "add";
                if (!this._enableCheckSelect || !this._isMapSelection)
                    this.clearSelection();
				if(this.model.selectionSettings.selectionMode.indexOf('cell') != -1)
					this.clearCellSelection();
                if (this.model.scrollSettings.allowVirtualScrolling) {
                    this._currentVIndex = null;
                    this._lastVirtualPage = null;
                    if (this.model.scrollSettings.enableVirtualization)
                        this._refreshVirtualView(1);
                    else
                        !this._virtualLoadedRecords[1] ? this.gotoPage(1) : this._currentPage(1);
                    this.getScrollObject().scrollY(0);
                }
                var returnValue = this._processBindings(args);
                if (!returnValue)
                    this.model.editSettings.showAddNewRow ? this._selectedRow(-1) : this._selectedRow(0);
                var groupedColumns = this.model.groupSettings.groupedColumns.length;
                if (groupedColumns > 1) {
                    var $editCol = this.getContentTable().find(".e-addedrow").find("table").find("colgroup").children();
                    $($editCol.slice(0, groupedColumns - 1)).css('width', this.getHeaderTable().find('colgroup').children()[0].style.width);
                }
            }
        },
        
        endEdit: function () {
            if (this.model.isEdit) {
                var formElement, $formElement, editedTr, count = 0;
                if (!this.editFormValidate())
                    return true;
                var obj = {};
                var editedRowWrap, type;
                if (this.model.editSettings.editMode == "batch")
                    this.saveCell();
                else {
					if(this._isAddNew|| this.model.editSettings.editMode == "externalformtemplate" || this.model.editSettings.editMode == "inlineformtemplate" ||this.model.editSettings.editMode == "dialogtemplate" )
						this._isEditChangesApplied = true
					if(this.model.editSettings.showAddNewRow)
						editedTr = this.getContentTable().find(".e-editedrow");
                    formElement = this.model.scrollSettings.frozenColumns > 0 ? this.element.find(".gridform") : !ej.isNullOrUndefined(editedTr) && editedTr.length == 1 ? editedTr[0].lastChild.lastChild: document.getElementById(this._id + "EditForm");
                    $formElement = $(formElement);
                    if (this.model.editSettings.editMode == "normal" || this.model.editSettings.editMode == "inlineform" || this.model.editSettings.editMode == "inlineformtemplate")
                        editedRowWrap = $formElement.closest('tr');
                    else
                        editedRowWrap = $formElement.closest('div');
                    editedRowWrap.find('td.e-rowcell').removeClass('e-validError');
                    formElement = this.model.scrollSettings.frozenColumns > 0 ? formElement[0] : formElement;
                    for (var index = 0; index < formElement.length; index++) {
                        if (editedRowWrap.hasClass("e-addedrow") && $(formElement[index]).hasClass("e-identity"))
                            continue;
                        var columnName = formElement[index].name, $element = $(formElement[index]), column = this.getColumnByField(columnName);
                        if ($element.hasClass("e-dropdownlist e-input") && $element.attr("id").indexOf("_input") != -1 && ej.isNullOrUndefined($formElement[1]))
                            continue;
                        if (columnName != undefined) {
                            if (columnName != "" && obj[columnName] == null) {
                                column = this.getColumnByField(columnName);
                                var  value = formElement[index].value, checkType = formElement[index].type, checkState = $(formElement[index]).is(':checked'),
                                    type = column ? column.originalType : null,colFormat;
                                if ($(formElement[index]).attr("type") == "hidden" && ej.isNullOrUndefined($element.attr("value")))
                                    continue;
                                if (!ej.isNullOrUndefined(column) && (column.editType == "edittemplate")) {
									this._isEditChangesApplied = true;
                                    var isHidden = $(formElement[index]).attr("type") == "hidden";
                                    if ($(formElement[index]).is("#" + this._id + columnName) || isHidden || $(formElement[index]).attr("name") == columnName) {
                                        var temp1 = column.editTemplate.read; $element = $(formElement[index]);
                                        $element = isHidden ? $(formElement[index]).siblings("#" + this._id + columnName).length ? $(formElement[index]).siblings("#" + this._id + columnName) : $element : $element;
                                        if (typeof temp1 == "string")
                                            temp1 = ej.util.getObject(temp1, window);
                                        value = temp1($element);
                                       }
                                    else
                                        continue;
                                }
                                else if ($(formElement[index]).hasClass("e-datepicker")) {
                                    value = $element.ejDatePicker("model.value");
                                    if (!this._isEditChangesApplied) {
                                        colFormat = !ej.isNullOrUndefined(column) && !ej.isNullOrUndefined(column.format) ? column.format : "{0:MM/dd/yyyy}";
                                        if (this.formatting(colFormat, value, this.model.locale) != this.formatting(colFormat, this._editedData[columnName], this.model.locale))
                                            this._isEditChangesApplied = true;
                                    }
                                }
                                else if ($(formElement[index]).hasClass("e-datetimepicker")) {
                                    value = $element.ejDateTimePicker("model.value");
                                    if (!this._isEditChangesApplied) {
                                        colFormat = !ej.isNullOrUndefined(column) && !ej.isNullOrUndefined(column.format) ? column.format : "{0:MM/dd/yyyy hh:mm:ss}";
                                        if (this.formatting(colFormat, value, this.model.locale) != this.formatting(colFormat, this._editedData[columnName], this.model.locale))
                                            this._isEditChangesApplied = true;
                                    }
                                }
                                else if ($element.is(".e-numerictextbox")) {
                                    value = $element.ejNumericTextbox("getValue");
                                    if (!ej.isNullOrUndefined(column) && column.type == "string" && !ej.isNullOrUndefined(value))
                                        value = value.toString();
                                    if (!this._isEditChangesApplied && this._editedData[columnName] != value)
                                        this._isEditChangesApplied = true;
								}
                                else if ($element.data("ejDropDownList") || $element.is(".e-dropdownlist")) {
                                    if ($element.is(":hidden") && $element.is("input") && ej.isNullOrUndefined($element.data("ejDropDownList")))
                                        $element = $element.siblings(".e-dropdownlist");
                                    value = $element.ejDropDownList("getSelectedValue");
                                    if (!ej.isNullOrUndefined(column) && !ej.isNullOrUndefined(column.format) && (column.type == "date" || column.type == "datetime"))
                                        value = value.length > 0 ? new Date(value) : value;
                                    if (!this._isEditChangesApplied && this._editedData[columnName] != value)
                                        this._isEditChangesApplied = true;
                                
								}
                                if (type)
                                    value = type == "number" ? +value : type == "boolean" ? (value === this.localizedLabels.True ? true : false) : type === "date" ? new Date(value) : value;
                                if (column == null)
                                    value = !isNaN(parseFloat(value)) && isFinite(value) ? parseFloat(value) : value;
                                else if (column.type == "number" && !ej.isNullOrUndefined(value) && value.length) {
                                    value = ej.parseFloat(value, this.model.locale);
                                    if (!this._isEditChangesApplied && this._editedData[columnName] != value)
                                        this._isEditChangesApplied = true;
                                }
                                if (typeof value == "string" && !value.length)
                                    value = null;
                                if (!this._isEditChangesApplied && (!ej.isNullOrUndefined(column)&& column.type=="string")  && this._editedData[columnName] != value)
                                    this._isEditChangesApplied = true;
                                 if(!this._isEditChangesApplied && (!ej.isNullOrUndefined(column)&& column.type=="date" && column.editType == 'stringedit')){	
                                     if (column.format != null && this.formatting(column.format, this._editedData[columnName], this.model.locale) != value)
											this._isEditChangesApplied = true;
								}
								if ((checkType != "checkbox" && !ej.isNullOrUndefined(value) && value !== "") || checkState)
                                    count++;
                                var originalvalue;
                                if (checkType != "checkbox" || (!ej.isNullOrUndefined(column) && column.type != "boolean" && column.type != "checkbox"))
                                    originalvalue = value;
                                else
                                    originalvalue = checkState;
                                if (!this._isEditChangesApplied && (!ej.isNullOrUndefined(column) && (column.type == "boolean" || column.type == "checkbox"))) {
									  var colValue =  checkType == "checkbox" ?checkState :  JSON.parse(value);
									  if( this._editedData[columnName] != colValue)
										this._isEditChangesApplied = true;
                                }
                                if (!this._isEditChangesApplied && typeof originalvalue == "string" && typeof this._editedData[columnName] == "string" && this._editedData[columnName] != originalvalue)
                                    this._isEditChangesApplied = true;
                                if (!this._isEditChangesApplied && (!ej.isNullOrUndefined(column) && column.type == "object")) {
                                    var editVal = typeof (value) == "object" ? JSON.stringify(value) : value;
                                    var OrgDbVal = typeof (this._editedData[columnName]) == "object" ? JSON.stringify(this._editedData[columnName]) : this._editedData[columnName];
                                    if(editVal != OrgDbVal )
                                        this._isEditChangesApplied = true;
                                }
                                if (columnName.indexOf(".") != -1)
                                ej.createObject(columnName, originalvalue, obj);
                            else
                                obj[columnName] = originalvalue;
                            }
                        }
                        if (index == formElement.length - 1 && $formElement.length > 1 && $formElement.index(formElement) == 0) {
                            formElement = $formElement[1];
                            index = -1;
                        }

                    }
                    var args = { data: obj, rowData: obj };
                    var foreignKeyData = this._getForeignKeyData(args.data);
                    if (!ej.isNullOrUndefined(foreignKeyData))
                        args.foreignKeyData = foreignKeyData;
                    args.requestType = ej.Grid.Actions.Save;
                    args.selectedRow = this._selectedRow();
                    args.previousData = jQuery.extend({}, this.model.currentViewData[args.selectedRow]);
                    var currentData;
                    if (this._trigger("actionBegin", args))
                        return true;
                    if (editedRowWrap.hasClass("e-editedrow")) {
                        this._cModifiedData = obj;
                        args.action = "edit";
                    } else if (editedRowWrap.hasClass("e-addedrow")) {
                        if (count)
                            this._cAddedRecord = obj;
                        args.action = "add";
                    }
                    if (args.action == "add" && this.editFormValidate()) {
                        if (!ej.isNullOrUndefined(this.model.queryString)) {
                            var keyField = this.model.foreignKeyField || this.model.queryString;
                            args.data[keyField] = this.model.parentDetails.parentRowData[this.model.queryString]
                        }
                        if (!count) {
                            var elements = this.model.scrollSettings.frozenColumns > 0 ? this.element.find(".gridform") : $("#" + this._id + "EditForm");
                            var error = ej.buildTag("div");
                            elements.addClass("field-validation-empty");
                            var element = elements.find("input:visible").not(".e-identity").first();
                            this._renderValidator(error, element);
                            error.width("auto");
                            var $errorMessage = ej.buildTag("div.e-field-validation-error", this.localizedLabels.EmptyRowValidationMessage),
                            $tail = $(error).find(".e-errortail");
                            $errorMessage.insertAfter($tail);
                            $errorMessage.css("display", "block");
                            return false;
                        }
                    }
                    if (this.model.editSettings.editMode == "externalform" || this.model.editSettings.editMode == "externalformtemplate")
                        $("#" + this._id + "_externalEdit").css("display", "none");
                    if (!this._isAddNew && !this._isEditChangesApplied)
                        this.cancelEdit();
                    else {
                        this._isEditChangesApplied = false;
                        this._updateAction(args);
                    }
                }
            }
        },
        _updateAction: function (args) {
            var promise;
            if (this._dataSource() instanceof ej.DataManager && (!this._dataManager.dataSource.offline && this._dataManager.dataSource.json !== undefined) || (this._dataSource().adaptor instanceof ej.remoteSaveAdaptor) || this._dataSource().adaptor instanceof ej.ForeignKeyAdaptor) {
                if (this.model.editSettings.editMode == 'batch') {
                    this.batchChanges.added.push(args.data);
                    this.batchSave();
                }
                else {
                    if (!ej.isNullOrUndefined(this._cModifiedData) && !(ej.isOnWebForms && this.model.serverEvents && this.model.serverEvents.indexOf("endEdit") != -1))
                        promise = this._dataManager.update(this._primaryKeys[0], args.data, this.model.query);
                    else if (!(ej.isOnWebForms && this.model.serverEvents && this.model.serverEvents.indexOf("endAdd") != -1))
                        promise = this._dataManager.insert(args.data, this.model.query);
                    var proxy = this;
                    this.element.ejWaitingPopup("show");
                    if (promise && $.isFunction(promise.promise)) {
                        promise.done(function (e) {
                            proxy.model.isEdit = false;
                            if (!ej.isNullOrUndefined(e) && $.isPlainObject(e.record)) {
                                $.extend(args.data, e.record);
                                if (args.action == "add")
                                    proxy._cAddedRecord = args.data;
                                if (args.action == "edit")
                                    proxy._cModifiedData = args.data;
                            }
                            proxy._processBindings(args);
                            if (proxy._isRemoteSaveAdaptor) {
                                proxy.element.ejWaitingPopup("hide");
                                if (!ej.isNullOrUndefined(proxy._unboundRow) && args.selectedRow != proxy._unboundRow && args.requestType == "save") {
                                    proxy._unboundRow.find(".e-editbutton").trigger("click");
                                    proxy._unboundRow = null;
                                }
                            }
                            proxy._cModifiedData = null;
                            proxy._cAddedRecord = null;
                            proxy._primaryKeyValues = [];
                        });
                        promise.fail(function (e) {
                            args.error = (e && e.error) ? e.error : e;
                            proxy._cModifiedData = null;
                            proxy._cAddedRecord = null;
                            proxy.element.ejWaitingPopup("hide");
							if (proxy.model.editSettings.editMode == "externalform" || proxy.model.editSettings.editMode == "externalformtemplate")
								$("#" + proxy._id + "_externalEdit").css("display", "block");
                            proxy._trigger("actionFailure", args)
                        });
                    } else {
                        proxy.model.isEdit = false;
                        proxy._processBindings(args);
                    }
                }
            } else
                this._processBindings(args);
            if (promise == undefined || !$.isFunction(promise.promise)) {
                this._cModifiedData = null;
                this._cAddedRecord = null;
                this._primaryKeyValues = [];
            }
        },
        
        cancelEdit: function () {
            var args = {};
            args.requestType = ej.Grid.Actions.Cancel;
            this._cModifiedData = null;
            this._processBindings(args);
            this._primaryKeyValues = [];
            this._currentData = null;
            if (this.model.editSettings.editMode == "externalform" || this.model.editSettings.editMode == "externalformtemplate")
                $("#" + this._id + "_externalEdit").css("display", "none");
        },
        
        refreshToolbar: function () {
            var $toolbar = $("#" + this._id + "_toolbarItems");
            var lis = $toolbar.find("li");
            $toolbar.ejToolbar("enableItem", lis);
			var editedTr = this.getContentTable().find(".e-editedrow");
			if(this.model.editSettings.showAddNewRow && this.model.editSettings.editMode == "normal" && editedTr.length==0)
				this._disabledToolItems.push(lis.filter('[id='+this._id+'_add]'));
			else
			{
			    for (var i = 0; i < lis.length; i++) {
			        switch (lis[i].id) {
			            case this._id + "_add":
			            case this._id + "_edit":
			            case this._id + "_delete":
			            case this._id + "_responsiveFilter":
			            case this._id + "_responsiveSorting":
			            case this._id + "_search":
			                if (this.model.isEdit) {
			                    if (!(this.model.editSettings.showAddNewRow && this.model.editSettings.editMode == "normal") || editedTr.length != 0) {
			                        $(lis[i]).hasClass("e-hover") && $(lis[i]).removeClass("e-hover");
			                        this._disabledToolItems.push(lis[i]);
			                    }
			                }
			                else if (!this.model.enableToolbarItems && !this.model.editSettings.allowAdding && lis[i].id == this._id + "_add")
			                        this._disabledToolItems.push(lis[i]);
                            else if (!this.model.enableToolbarItems && !this.model.editSettings.allowEditing && lis[i].id == this._id + "_edit")
                                    this._disabledToolItems.push(lis[i]);
                            else if (!this.model.enableToolbarItems && !this.model.editSettings.allowDeleting && lis[i].id == this._id + "_delete")
                                    this._disabledToolItems.push(lis[i]);
			                break;
			            case this._id + "_update":
			            case this._id + "_cancel":
			                if (!this.model.isEdit && (this.getContentTable().find(".e-updatedtd.e-icon.e-gupdatenotify").length == 0 && !this._isBatchDeleteApplied)) {
			                    $(lis[i]).hasClass("e-hover") && $(lis[i]).removeClass("e-hover");
			                    this._disabledToolItems.push(lis[i]);
			                }
			                break;
			        }
			    }
			}
            $toolbar.ejToolbar("disableItem", this._disabledToolItems);
            $toolbar.ejToolbar("model.enableRTL", this.model.enableRTL);
            this._disabledToolItems = $();

        },
        _getHiddenCount: function (elements) {
            var count = 0;
            for (var i = 0; i < elements.length; i++) {
                if (elements.eq(i).hasClass("e-hide"))
                    count++;
            }
            return count;
        },
        _refreshTemplateCell: function (temp, data) {
            var tempcell = temp.find('.e-templatecell');
			for(var i =0; i< tempcell.length;i++){						
				var args = { cell: tempcell[i], data: data, column: this.model.columns[$(tempcell[i]).index()], rowIndex: temp.index()};
				this._trigger("templateRefresh", args);	
			}			
        },
        _edit: function (args) {
            var editingManager = this.model.scrollSettings.enableVirtualization ? ej.DataManager(this._virtualLoadedRecords[this._currentVIndex]) : ej.DataManager(this._currentJsonData), $tempFirstTR;
            var queryManager = new ej.Query(), templateID, ngType;
            if (this.model.allowFiltering)
                this._previousFilterCount = this._filteredRecordsCount;
            for (var index = 0; index < this._primaryKeys.length; index++)
                queryManager = queryManager.where(this._primaryKeys[index], ej.FilterOperators.equal, this._primaryKeyValues[index]);
            this._currentData = editingManager.executeLocal(queryManager);
            var temp = document.createElement('div');
            var formTitle = !ej.isNullOrUndefined(this.model.editSettings.titleColumn) ? this.model.editSettings.titleColumn : this._primaryKeys[0];
            var $temp = $(temp), $tempSecondTR, $tempFirstTR;
            if (this.model.editSettings.editMode == "normal") {
                temp.innerHTML = ['<table>', $.render[this._id + "_JSONEditingTemplate"](this._currentData, { groupedColumns: this.model.groupSettings.groupedColumns }), '</table>'].join("");
                var $tr = $temp.find("tr").first(), detailCount = 0, firstHidden = this.model.columns.length
                , $currentTrFr = args.row.first(), $currentTrLa, $tempLastTR;
                if (this.model.scrollSettings.frozenColumns > 0) {
                    $temp.prepend(['<table>', $.render[this._id + "_JSONFrozenEditingTemplate"](this._currentData, { groupedColumns: this.model.groupSettings.groupedColumns }), '</table>'].join(""));
                    $tr.splice(0, 0, $temp.find("table").first().find("tr").first().get(0));
                    $currentTrLa = args.row.last();
                    $tempLastTR = $tr.last();
                }
                $tempFirstTR = $temp.find("tr").first();
                $temp.find('td').not(".e-rowcell").addClass("e-editcell e-normaledit");
                this._setEditDropdownValue($temp);
                if (this.model.groupSettings.groupedColumns.length >= 2) {
                    var $indentCell = args.row.find("td.e-indentcell");
                    $temp.find("tr").first().prepend($indentCell);
                }
                if (this.model.detailsTemplate != null || this.model.childGrid != null) {
                    detailCount++;                    
                    $temp.find(".e-editcell").find("tr").prepend(args.row.find("[class*=e-detailrow]").eq(0).removeClass("e-selectionbackground e-active"));
                    if (this.model.gridLines != "both")
                        $temp.find(".e-editcell .e-rowcell:first").addClass("e-detailrowvisible");
                }
                if (this.model.scrollSettings.frozenColumns > 0) {
                    $temp.find(".e-editcell").get(1).colSpan = this.model.columns.length - this.model.scrollSettings.frozenColumns - args.row.last().find(".e-hide").length + detailCount;
                    firstHidden = this.model.scrollSettings.frozenColumns;
                    $currentTrLa.hasClass("e-alt_row") && $tempLastTR.addClass("e-alt_row")
                }
                $temp.find(".e-editcell").get(0).colSpan = firstHidden - $currentTrFr.find("td").not(":visible").length + detailCount;
                $currentTrFr.hasClass("e-alt_row") && $tempFirstTR.addClass("e-alt_row");                
                $currentTrFr.empty().replaceWith($tempFirstTR.addClass("e-editedrow"));
                args.row = $tempFirstTR;
                if (!$tempFirstTR.is(":last-child"))
                    $tempFirstTR.find('td.e-rowcell').addClass('e-validError');
                if (this.model.scrollSettings.frozenColumns > 0) {
                    $currentTrLa.empty().replaceWith($tempLastTR.addClass("e-editedrow"));
                    args.row = $tempLastTR;
                }
                this._refreshUnboundTemplate($tr.find(".gridform"));
                if(this.model.scrollSettings.frozenColumns == 0)
					this._gridRows = this.getContentTable().first().find(".e-rowcell").closest("tr.e-row, tr.e-alt_row, tr.e-editedrow").toArray();
				else
					this._gridRows = $(this.getContentTable().get(0).rows).toArray();                 
                if (this.model.scrollSettings.frozenColumns > 0) {
					this.getScrollObject().scrollY(this.getScrollObject().model.scrollTop, true);
                    this._gridRows = [this._gridRows, $(this.getContentTable().get(1).rows).toArray()];
				}
            }
            else if (this.model.editSettings.editMode == "inlineform" || this.model.editSettings.editMode == "inlineformtemplate") {
                var detailCount = 0;
                if (this.model.editSettings.editMode == "inlineformtemplate") {
                    templateID = this.model.editSettings.inlineFormTemplateID;
                    ngType = !ej.isNullOrUndefined(this.model.ngTemplateId) && (templateID.startsWith("#") || templateID.startsWith(".") || typeof templateID === "object") ? this.model.ngTemplateId + "gridedittemplate" : null;
                } 
                temp.innerHTML = this.model.editSettings.editMode == "inlineform" ? $.render[this._id + "_JSONDialogEditingTemplate"](this._currentData) : this._renderEjTemplate(this.model.editSettings.inlineFormTemplateID, this._currentData[0], args.rowIndex, null, ngType);
                if (this.model.editSettings.editMode == "inlineformtemplate") {
                    temp.innerHTML = this._appendForm(temp.innerHTML);
                }
				this._setEditDropdownValue($temp);
                var tr = ej.buildTag('tr');
                var td = ej.buildTag('td');
                tr.addClass("e-editedrow");
                td.addClass("e-inlineformedit");
                temp = $(temp).clone(true).children();
                td.html(temp);
                tr.append(td);
                if (!tr.is(":last-child"))
                    tr.find('.e-rowcell').addClass('e-validError');
                if (this.model.scrollSettings.frozenColumns > 0) {
                    var $trClone = tr.clone();
                    $trClone.find("td").empty().prop("colspan", this.model.scrollSettings.frozenColumns);
                    args.row.eq(1).after(tr).end().eq(0).after($trClone);
                    this._gridRows = [this._gridRows, this.getContentTable().last().find("tr").toArray()];
                }
                else
                    args.row.after(tr);
                this._gridRows = this.getContentTable().first().find(".e-rowcell,.e-inlineformedit").closest("tr").toArray();
				if (this.model.detailsTemplate != null || this.model.childGrid != null)
                        detailCount++;
                if (this.model.scrollSettings.frozenColumns > 0)
                    td.prop("colspan", this.model.columns.length - this.model.scrollSettings.frozenColumns - tr.find("form").children().not(":visible").length + detailCount);
                else
                    td.prop("colspan", this.model.columns.length - this._hiddenColumns.length + detailCount);
                if (this.model.scrollSettings.frozenColumns > 0)
                    this._gridRows = [this._gridRows, this.getContentTable().last().find("tr").toArray()];
                $("#" + this._id + "_inlineFormTitle").text(this.localizedLabels.EditFormTitle + this._currentData[0][formTitle]);
                args.row.find("input").attr('disabled', 'disabled').addClass("e-disable");
            }
            else {
                $temp.addClass("e-editedrow");
                if (this.model.editSettings.editMode == "dialogtemplate" || this.model.editSettings.editMode == "externalformtemplate") {
                    templateID = this.model.editSettings.editMode == "dialogtemplate" ? this.model.editSettings.dialogEditorTemplateID : this.model.editSettings.externalFormTemplateID;
                    ngType = !ej.isNullOrUndefined(this.model.ngTemplateId) && (templateID.startsWith("#") || templateID.startsWith(".") || typeof templateID === "object") ? this.model.ngTemplateId + "gridedittemplate" : null;
                }
                temp.innerHTML = this.model.editSettings.editMode == "dialog" || this.model.editSettings.editMode == "externalform" ? $.render[this._id + "_JSONDialogEditingTemplate"](this._currentData) : this._renderEjTemplate(templateID, this._currentData[0], args.rowIndex, null, ngType);
                if (this.model.editSettings.editMode == "dialogtemplate" || this.model.editSettings.editMode == "externalformtemplate") {
                    temp.innerHTML = this._appendForm(temp.innerHTML);
                }
                this._setEditDropdownValue($temp);
                if (this.model.editSettings.editMode == "dialog" || this.model.editSettings.editMode == "dialogtemplate") {
                    $("#" + this._id + "_dialogEdit").html($(temp));
                    var model = {};
                    model.cssClass = this.model.cssClass;
                    model.enableRTL = this.model.enableRTL;
                    model.width = "auto";
                    model.enableResize = this.phoneMode;
                    model.close = $.proxy(this._buttonClick, this);
                    model.content = "#" + this._id;
                    model.enableModal = true;
                    model.allowKeyboardNavigation = false;
                    model.title = this.localizedLabels.EditFormTitle + this._currentData[0][formTitle];
                    $("#" + this._id + "_dialogEdit").ejDialog(model);
                    $("#" + this._id + "_dialogEdit").ejDialog("open");
                }
                else {
                    $("#" + this._id + "_externalEdit").css("display", "block").css('z-index', this._maxZindex() + 1);
                    $("#" + this._id + "_externalForm").find(".e-externalformedit").html($(temp));
                    $("#" + this._id + "_eFormHeader").find(".e-form-title").text(this.localizedLabels.EditFormTitle + this._currentData[0][formTitle]);
                    this._externalFormPosition();
                    args.row.find("input").attr('disabled', 'disabled').addClass("e-disable");
                }
            }
            if (this.model.editSettings.editMode != "normal")
                $tempFirstTR = $(temp);
			if(!ej.isNullOrUndefined(this.model.templateRefresh) && $tempFirstTR.find(".e-templatecell").length != 0) 
				this._refreshTemplateCell($tempFirstTR, this.model.currentViewData[$tempFirstTR.index()]);
        },
        _appendForm: function (temp) {
            var $form = ej.buildTag('form.gridform', "", {}, { id: this._id + "EditForm" });
            $form.addClass("e-display");
            var $tbody = ej.buildTag('div', "", { 'display': 'none' });
            $form.html(temp);
            $tbody = this.renderDiaglogButton($form, $tbody);
            return $tbody.html();
        },
        _setEditDropdownValue: function ($temp) {
            var $select = $temp.find("select.e-field"), x, inputDrop = $temp.find("input.e-field.e-dropdownlist");
            for (var i = 0; i < $select.length; i++) {
                var ddlTemplate = {}, opPara = "";
                if ($select[i].name.indexOf('.') != -1) {
                    for (var j = 1; j < $select[i].name.split(".").length; j++)
                        opPara = opPara.concat("(");
                    ddlTemplate[this._id + "ddlTemp"] = "{{:" + opPara + "#data['" + $select[i].name.split('.').join("'] || {})['") + "']}}";
                }
                else
                    ddlTemplate[this._id + "ddlTemp"] = "{{:" + $select[i].name.replace(/[^a-z0-9\s_]/gi, '') + "}}"
                $.templates(ddlTemplate);
                x = $.render[this._id + "ddlTemp"](this._currentData);
                var $selOptions = $temp.find('select:eq(' + i + ') option[value="' + x + '"]');
                $select.eq(i).data("ej-value", x);
                var curColumn = this.getColumnByField($select[i].name);
                if (this._dataSource().adaptor instanceof ej.ForeignKeyAdaptor && this._dataSource().adaptor.value.indexOf(curColumn.field) != -1){
				    $selOptions = $temp.find('select:eq(' + i + ') option:contains("' + x + '")');
				    $select.eq(i).val($selOptions[0].value);
				    $select.eq(i).data("ej-value", $selOptions[0].value);
				}
                $selOptions.attr("selected", "selected");
            }
            for (var j = 0; j < inputDrop.length; j++) {
                inputDrop.eq(j).data("ej-value", ej.getObject(inputDrop.eq(j).attr("name"), this._currentData[0]));
            }
        },
        _add: function (args) {
            var temp = document.createElement('div'), $editTr, templateID, ngType;
            if (this._isLocalData && this.model.groupSettings.groupedColumns.length == 0 && this.model.scrollSettings.frozenColumns == 0 && this.model.scrollSettings.frozenRows == 0)
                !(this._dataSource() instanceof ej.DataManager) ? this._dataSource().splice(0, 1) : this._dataSource().dataSource.json.splice(0, 1);
            this._previousFilterCount = this._filteredRecordsCount;
            if (this.model.editSettings.editMode == "normal") {
                var $tempFirstTR, $temp = $(temp), frozenColSpan = this.model.columns.length, $tempLastTR;
                temp.innerHTML = ['<table>', $.render[this._id + "_JSONEditingTemplate"](args.data, { groupedColumns: this.model.groupSettings.groupedColumns }), '</table>'].join("");
                var $select = $(temp).find('select.e-field');
                for (var i = 0; i < $select.length; i++) {
                    $select.eq(i).val(args.data[$select[i].name]);
                    $select.eq(i).data('ej-value', args.data[$select[i].name]);
                }
                if (this.model.scrollSettings.frozenColumns > 0) {
                    $tempLastTR = $temp.find("table").first().find("tr").first();
                    $temp.prepend(['<table>', $.render[this._id + "_JSONFrozenEditingTemplate"](args.data, { groupedColumns: this.model.groupSettings.groupedColumns }), '</table>'].join(""));
					$($tempLastTR).find("td").first().addClass("e-editcell");
                }
                $tempFirstTR = $temp.find("tr").first();
                var td = $(temp).find(".e-editcell").get(0);
                $(temp).find('td').first().addClass("e-editcell");
                if (this.model.allowPaging && this.model.pageSettings.pageSize <= this._currentJsonData.length && this.model.groupSettings.groupedColumns.length == 0 && !this.model.editSettings.showAddNewRow)
                    this.getContentTable().get(0).lastChild.removeChild(this.getContentTable().get(0).lastChild.lastChild);
                if ((this.model.detailsTemplate != null || this.model.childGrid != null) && $(this.getContentTable().get(0).lastChild.lastChild).children('.e-detailrowexpand').length)
                    this.getContentTable().get(0).lastChild.removeChild(this.getContentTable().get(0).lastChild.lastChild);
                if ((this.model.currentViewData.length == 0 || this.getContentTable().find('td.e-rowcell').length == 0) && this.model.scrollSettings.frozenColumns == 0) {
                    this.getContentTable().find('tr').first().replaceWith($(temp).find("tr").first().addClass("e-addedrow e-normaledit"));
					if(this.getContentTable().find('tr').length == 0) 
						this.getContentTable().append($(temp).find("tr").first().addClass("e-addedrow e-normaledit"));
				}
                else {
                    if (this.model.scrollSettings.frozenColumns > 0)
                        this._renderByFrozenDesign();
					var  $contentTbody = this.getContentTable().first().find('tbody').first();
                    if (this.model.editSettings.rowPosition == "top")
                        $contentTbody.prepend($tempFirstTR.addClass("e-addedrow e-normaledit"));
                    else if (this.model.editSettings.rowPosition == "bottom")
                        $contentTbody.append($tempFirstTR.addClass("e-addedrow e-normaledit"));
                    if (this.model.scrollSettings.frozenColumns > 0)
                        this.getContentTable().last().find('tbody').first().prepend($tempLastTR.addClass("e-addedrow e-normaledit"));
                }
                $editTr = this.getContentTable().find("tr.e-addedrow");
                if (this.model.allowScrolling && this.model.scrollSettings.allowVirtualScrolling)
                    $editTr.attr("name", 0);
                if (this.model.detailsTemplate != null || this.model.childGrid != null)
                    $editTr.find('tr').first().prepend(ej.buildTag('td.e-detailrowcollapse'));
                if (this.model.groupSettings.groupedColumns.length) {
                    for (var i = 0; i < this.model.groupSettings.groupedColumns.length; i++) {
                        if (i == 0)
                            $editTr.prepend(ej.buildTag("td.e-indentcell"));
                        else {
                            $editTr.find("tr").prepend(ej.buildTag("td.e-indentcell"));
                        }
                    }
                    if (this.model.groupSettings.groupedColumns.length > 0 && (this.model.detailsTemplate != null || this.model.childGrid != null))
                        $editTr.find("td.e-editcell").prop("colspan", (this.model.columns.length + (this.model.groupSettings.groupedColumns.length) - this._hiddenColumns.length));
                    else if (this.model.groupSettings.groupedColumns.length >= 2)
                        $editTr.find("td.e-editcell").prop("colspan", (this.model.columns.length + (this.model.groupSettings.groupedColumns.length - 1) - this._hiddenColumns.length));
                    else
                        $editTr.find("td.e-editcell").prop("colspan", (this.model.columns.length - this._hiddenColumns.length));
                } else if (this.model.detailsTemplate != null || this.model.childGrid != null)
                    $editTr.find(".e-editcell").prop("colspan", (this.model.columns.length - this._hiddenColumns.length + 1));
                else {
                    if (this.model.scrollSettings.frozenColumns > 0) {
                        $editTr.find(".e-editcell").last().prop("colspan", (this.model.columns.length - this.model.scrollSettings.frozenColumns - this._hiddenColumns.length));
                        frozenColSpan = this.model.scrollSettings.frozenColumns;
                    }
                    $editTr.find(".e-editcell").first().prop("colspan", (frozenColSpan - this._hiddenColumns.length));

                }
                if (!$editTr.is(":last-child"))
                    $editTr.find('td.e-rowcell').addClass('e-validError');
                if (!ej.isIOSWebView() && this.getBrowserDetails().browser == "msie" && this.model.editSettings.rowPosition == "bottom")
					this._colgroupRefresh();
                this._refreshUnboundTemplate($editTr.find(".gridform"));
                this._gridRows = this.getContentTable().first().find(".e-rowcell").closest("tr.e-row, tr.e-alt_row").toArray();
                if (this.model.scrollSettings.frozenColumns > 0)
                    this._gridRows = [this._gridRows, this.getContentTable().last().find(".e-rowcell").closest("tr.e-row, tr.e-alt_row").toArray()];
            }
            else if (this.model.editSettings.editMode == "inlineform" || this.model.editSettings.editMode == "inlineformtemplate") {
                if (this.model.editSettings.editMode == "inlineformtemplate") {
                    templateID = this.model.editSettings.inlineFormTemplateID;
                    ngType = !ej.isNullOrUndefined(this.model.ngTemplateId) && (templateID.startsWith("#") || templateID.startsWith(".") || typeof templateID === "object") ? this.model.ngTemplateId + "gridedittemplate" : null;
                }
                temp.innerHTML = this.model.editSettings.editMode == "inlineform" ? $.render[this._id + "_JSONDialogEditingTemplate"](args.data) : this._renderEjTemplate(this.model.editSettings.inlineFormTemplateID, args.data, 0, null, ngType);
                if (this.model.editSettings.editMode == "inlineformtemplate") {
                    temp.innerHTML = this._appendForm(temp.innerHTML);
                }
                var detailCount = 0;
                var tr = ej.buildTag('tr');
                var td = ej.buildTag('td');
                tr.addClass("e-addedrow");
                td.addClass("e-inlineformedit e-editcell");
                temp = $(temp).clone(true).children();
				var $select = $(temp).find('select.e-field');
                for (var i = 0; i < $select.length; i++){
                    $select.eq(i).val(args.data[$select[i].name]);
                    $select.eq(i).data('ej-value', args.data[$select[i].name]);
                    }
                td.html(temp);
                tr.append(td);
                if (!tr.is(":last-child"))
                    tr.find('.e-rowcell').addClass('e-validError');
                if (this.model.groupSettings.groupedColumns.length) {
                    for (var i = 0; i < this.model.groupSettings.groupedColumns.length; i++) {
                        tr.prepend(ej.buildTag("td.e-indentcell"));
                    }
                } else
                    tr.find("td.e-editcell").prop("colspan", (this.model.columns.length - this._hiddenColumns.length));
                if (this.model.scrollSettings.frozenColumns > 0) {
                    var $trClone = tr.clone(), $divs = td.find(".gridform").children();
                    $trClone.find("td").empty().prop("colSpan", this.model.scrollSettings.frozenColumns - this._getHiddenCount($divs.slice(0, this.model.scrollSettings.frozenColumns)));
                    td.prop("colSpan", this.model.columns.length - this.model.scrollSettings.frozenColumns - this._getHiddenCount($divs.slice(this.model.scrollSettings.frozenColumns)));
                    if (this.model.currentViewData.length == 0 || this.getContentTable().find('td.e-rowcell').length == 0)
                        this._renderByFrozenDesign();
                    this.getContentTable().first().find('tbody').first().prepend($trClone);
                    this.getContentTable().last().find('tbody').first().prepend(tr);
                }
                else {
					if (this.model.detailsTemplate != null || this.model.childGrid != null)
                        detailCount++;
                    td.prop("colspan", this.model.columns.length - this._hiddenColumns.length + detailCount);
                    if (this.model.currentViewData.length == 0 || this.getContentTable().find('td.e-rowcell').length == 0)
                        this.getContentTable().find('tr').first().replaceWith($(tr));
                    else
                        if (this.model.allowPaging && this.model.pageSettings.pageSize <= this.model.currentViewData.length && this.model.groupSettings.groupedColumns.length == 0)
                            this.getContentTable().get(0).lastChild.removeChild(this.getContentTable().get(0).lastChild.lastChild);
                    if (this.model.editSettings.rowPosition == "top")
                        this.getContentTable().first().find('tbody').first().prepend(tr);
                    else if (this.model.editSettings.rowPosition == "bottom")
                        this.getContentTable().first().find('tbody').first().append(tr);
                }
                
                if ((this.model.detailsTemplate != null || this.model.childGrid != null) && $(this.getContentTable().get(0).lastChild.lastChild).children('.e-detailrowexpand').length)
                    this.getContentTable().get(0).lastChild.removeChild(this.getContentTable().get(0).lastChild.lastChild);
                $("#" + this._id + "_inlineFormTitle").text(this.localizedLabels.AddFormTitle);
                this._refreshUnboundTemplate($("#" + this._id + "EditForm"));
                this._gridRows = this.getContentTable().first().find(".e-rowcell,.e-inlineformedit").closest("tr.e-row, tr.e-alt_row").toArray();
                if (this.model.scrollSettings.frozenColumns > 0)
                    this._gridRows = [this._gridRows, this.getContentTable().last().find(".e-rowcell").closest("tr.e-row, tr.e-alt_row").toArray()];
            }
            else {
                $(temp).addClass("e-addedrow");
                if (this.model.editSettings.editMode == "dialogtemplate" || this.model.editSettings.editMode == "externalformtemplate") {
                    templateID = this.model.editSettings.editMode == "dialogtemplate" ? this.model.editSettings.dialogEditorTemplateID : this.model.editSettings.externalFormTemplateID;
                    ngType = !ej.isNullOrUndefined(this.model.ngTemplateId) && (templateID.startsWith("#") || templateID.startsWith(".") || typeof templateID === "object") ? this.model.ngTemplateId + "gridedittemplate" : null;
                }   
                temp.innerHTML = this.model.editSettings.editMode == "dialog" || this.model.editSettings.editMode == "externalform" ? $.render[this._id + "_JSONDialogEditingTemplate"](args.data) : this._renderEjTemplate(templateID, args.data, 0, null, ngType);
                if (this.model.editSettings.editMode == "dialogtemplate" || this.model.editSettings.editMode == "externalformtemplate") {
                    temp.innerHTML = this._appendForm(temp.innerHTML);
                }
                var $select = $(temp).find('select.e-field');
                for (var i = 0; i < $select.length; i++){
                    $select.eq(i).val(args.data[$select[i].name]);
                    $select.eq(i).data('ej-value', args.data[$select[i].name]);
                    }
                if (this.model.editSettings.editMode == "dialog" || this.model.editSettings.editMode == "dialogtemplate") {
                    $("#" + this._id + "_dialogEdit").html($(temp));
                    var model = {};
                    model.cssClass = this.model.cssClass;
                    model.width = "auto";
                    model.enableResize = this.phoneMode;
                    model.content = "#" + this._id;
                    model.enableModal = true;
                    model.close = $.proxy(this._buttonClick, this);
                    model.enableRTL = this.model.enableRTL;
                    model.allowKeyboardNavigation = false;
                    model.title = this.localizedLabels.AddFormTitle;
                    $("#" + this._id + "_dialogEdit").ejDialog(model);
                    $("#" + this._id + "_dialogEdit").ejDialog("open");
                }
                else {
                    $("#" + this._id + "_externalEdit").css("display", "block").css('z-index', this._maxZindex() + 1);
                    $("#" + this._id + "_externalForm").find(".e-externalformedit").html($(temp));
                    $("#" + this._id + "_eFormHeader").find(".e-form-title").text(this.localizedLabels.AddFormTitle);
                    this._externalFormPosition();
                }
            }
            if (this.model.editSettings.editMode != "normal")
                $editTr = $(temp);
			if(!ej.isNullOrUndefined(this.model.templateRefresh) && $editTr.find(".e-templatecell").length != 0) 
				this._refreshTemplateCell($editTr, args.data);
            if (this.model.allowPaging) {
                if (this.model.filterSettings.filteredColumns.length)
                    this.getPager().ejPager({ totalRecordsCount: this._searchCount == null ? this._filteredRecordsCount : this._searchCount, currentPage: this._currentPage() });
                else
                    this.getPager().ejPager({ totalRecordsCount: this._searchCount == null ? this._gridRecordsCount : this._searchCount, currentPage: this._currentPage() });
                this._refreshGridPager();
            }
        },
        editFormValidate: function () {
            if ($.isFunction($.validator)) {
                if (this.model.scrollSettings.frozenColumns > 0) {
                    var forms = this.element.find(".gridform");
                    if (forms.length > 1) {
                        var form1, form2;
                        form1 = forms.eq(0).validate().form();
                        form2 = forms.eq(1).validate().form();
                        if (!(form1 && form2))
                            return false;
                        else
                            return true;
                    }
                    else
                        return forms.validate().form();
                }
                else if (this.model.editSettings.showAddNewRow) {
                   return $(this.getRows()).hasClass("e-editedrow") ? this.element.find(".e-editedrow .gridform").validate().form() : this.element.find(".e-addedrow .gridform").validate().form();
                }
                return $("#" + this._id + "EditForm").validate().form();
            }
            return true;
        },
        _refreshAltRow: function () {
            var $gridRows = this._excludeDetailRows();
            for (var r = 0; r < $gridRows.length; r++) {
                var $row = $($gridRows[r]);
                $row.hasClass("e-alt_row") && $row.removeClass("e-alt_row");
                (r % 2 != 0) ? $row.addClass("e-alt_row") : $row.addClass("e-row")
            }
        },
        _editCompleteAction: function (args) {
            var $form = this.element.find(".gridform");
            this.model.isEdit = true;
            var $cols1 = this.getContentTable().children("colgroup").find("col");
            var width = this.element.width()
            this.setWidthToColumns();
            if (ej.Grid.Actions.Add == args.requestType) {
                var disabledElements = $form.find(".e-field:disabled");
                for (var j = 0; j < disabledElements.length; j++) {
                    var fieldName = $(disabledElements[j]).attr("name");
                    if (!$(disabledElements[j]).hasClass("e-identity"))
                        if ($.inArray(fieldName, this._disabledEditableColumns) == -1 || $.inArray(fieldName, this._primaryKeys) !== -1)
                            $(disabledElements[j]).prop("disabled",false).removeClass("e-disable");
                }
                for (var i = 0; i < this.model.groupSettings.groupedColumns.length - 1; i++)
                    $form.find("colgroup").prepend(this._getIndentCol());
            }
            if (this._tdsOffsetWidth.length == 0 || this.model.groupSettings.groupedColumns.length || $.inArray(0, this._tdsOffsetWidth) != -1 || this._hiddenColumns.length > 0)
                this._setoffsetWidth();
            this._refreshEditForm(args);
            if (this.model.scrollSettings.frozenColumns > 0 && (this.model.editSettings.editMode == "inlineform" || this.model.editSettings.editMode == "inlineformtemplate")) {
                if (args.requestType == "beginedit")
                    args.row.eq(0).next().find("td").height(args.row.eq(1).next().find("td").height());
                else
                    this.getContentTable().first().find("tr").first().find("td").height(this.getContentTable().last().find("tr").first().find("td").height());
            }
            if (this.model.scrollSettings.frozenRows > 0 && args.requestType == "beginedit"){
				this._initFrozenRows();
				if (ej.getObject("_vScrollbar._scrollData", this.getScrollObject()))
					this.getScrollObject()._vScrollbar._scrollData.skipChange = true;
			}
            if (this.model.scrollSettings.frozenColumns > 0) {
                this.rowHeightRefresh();
                this._refreshScroller(args);
            }
            if (this.model.allowScrolling && this.model.scrollSettings.frozenColumns <= 0 && this.getScrollObject()
                && this.getScrollObject().isHScroll())
                this.getScrollObject().refresh();
            if ($.isFunction($.validator))
                this.initValidator();
        },
        _refreshEditForm: function (args) {
			var editedTr; 
			if(this.model.editSettings.showAddNewRow)
				editedTr = this.getContentTable().find(".e-editedrow");
            var form = this.model.scrollSettings.frozenColumns > 0 ? this.element.find(".gridform") : !ej.isNullOrUndefined(editedTr) && editedTr.length == 1 ? editedTr[0].lastChild.lastChild : document.getElementById(this._id + "EditForm");
            var elementFocused = false, columnIndex, matchMedia;
            if (this.model.enableResponsiveRow && $.isFunction(window.matchMedia))
                matchMedia = window.matchMedia("(max-width: 320px)");
            var $formElement = $(form).find("input,select,div.e-field,textarea"), percent = 86;
            if ((this._isUnboundColumn || this.getContentTable().find(".e-templatecell") != null) && this.model.editSettings.editMode != "batch")
                $formElement = $formElement.filter(function () { return (!$(this).closest(".e-rowcell").hasClass("e-unboundcell") && !$(this).closest(".e-rowcell").hasClass("e-templatecell")) })
            var focusEle = null;
            for (var i = 0; i < $formElement.length; i++) {
                var $element = $formElement.eq(i);
                var inputWidth, column = this.getColumnByField(!ej.isNullOrUndefined($element.prop("name")) ? $element.prop("name") : $element.attr("name"));
                if (column != null)
                    columnIndex = $.inArray(column, this.model.columns);
                if (this.model.editSettings.editMode == "batch") {
                    percent = 95;
                }
                else if (this.model.editSettings.editMode == "normal")
                    percent = 96;
                if (this.model.editSettings.editMode == "externalform" || this.model.editSettings.editMode == "externalformtemplate" || this.model.editSettings.editMode == "inlineform" || this.model.editSettings.editMode == "inlineformtemplate") {
                    $element.parent().css("width", ej.dataUtil.max(this._tdsOffsetWidth) + "px");
                    inputWidth = ej.max(this._tdsOffsetWidth) * (percent / 100);
                }
                else
                    inputWidth = this._tdsOffsetWidth[i] * (percent / 100);
                if ((this.model.editSettings.editMode == "normal" || this.model.editSettings.editMode == "batch" || this.model.allowResizing || this.model.allowResizeToFit) && !$element.hasClass("e-checkbox"))
                    inputWidth = "100%";
                if (column !=null && columnIndex !== undefined && (columnIndex < this.model.columns.length && this.model.columns[columnIndex].editTemplate)) {
                    var temp = { rowdata: args.rowData, column: this.model.columns, element: $element, requestType: args.requestType, type: args.type };
                    var temp1 = this.model.columns[columnIndex].editTemplate.write;                    
                    if (typeof temp1 == "string")
                        temp1 = ej.util.getObject(temp1, window);
                    temp1(temp);
					if(this.model.columns[columnIndex].isPrimaryKey && args.requestType == "beginedit")
						$element.addClass("e-disable").attr("disabled", "disabled");
                }
                else if ($element.hasClass("e-numerictextbox") || $element.hasClass("e-datepicker") || $element.hasClass("e-datetimepicker") || $element.hasClass("e-dropdownlist")) {
                    var customParams = this.getColumnByField($element.prop("name")), value = $element.val();
                    if ((!ej.isNullOrUndefined(matchMedia) && matchMedia.matches) || customParams["width"] && typeof customParams["width"] == "string" && customParams["width"].indexOf("%") != -1 && (this.model.editSettings.editMode == "normal" || this.model.editSettings.editMode == "batch"))
                        inputWidth = "100%";
                    $element.css("width", inputWidth);
                    if ($element.hasClass("e-numerictextbox")) {

                        if (value.length)
                            $element.attr("value", parseFloat(value));
                        $element.prop("name", $element.prop("name").replace(this._id, ""));
                    }
                    if ($element.hasClass("e-disable"))
                        $element.attr("disabled", "disabled");
                }
				 else if ($element.hasClass("e-save e-button") || $element.hasClass("e-cancel e-button") )
					 $element.ejButton({ cssClass: this.model.cssClass, enableRTL: this.model.enableRTL, width: "100","text-align":"centre",height:"35px"});
                    //else if ($element.hasClass("checkbox"))
                    //{
                    //    var value = $element.prop("checked");
                    //    $element.ejCheckBox({
                    //        id: $element[0].id,
                    //        checked: value
                    //    });
                    //}
                else {
                    switch ($element.prop('tagName')) {
                        case "INPUT":
                            if (!ej.isNullOrUndefined(column) && column.format && $element.val() != "") {
                                switch (column.type) {
                                    case ("date" || "datetime"):
                                        var value = $element.val();
                                        var date = new Date(value);
                                        var format = column.format.replace("{0:", "").replace("}", "");
                                        var newformat = ej.format(date, format, this.model.locale);
                                        $element.val(newformat);
                                        break;
                                    case "number":
                                        var value = $element.val();
                                        var format = new RegExp("\\{0(:([^\\}]+))?\\}", "gm").exec(column.format);
										if(format!=null){
											format[2].toLowerCase().split("")[0] == "c" ? format[2] = format[2].toLowerCase().replace("c", "n") : format[2];
											$element.val(ej.format(parseFloat(value), format[2], this.model.locale));
										}
                                        break;
                                }
                            }
                            if ($element.attr("type") != "checkbox") {
                                $element.css("text-align", $element.attr("name") != null && this.getColumnByField($element.attr("name")) != null ?
                                this.getColumnByField($element.attr("name")).textAlign : "center");
                                if (this.model.editSettings.editMode == "batch"){
                                    $element.css('width', '100%').css("height", "28px");
									if (ej.browserInfo().name == "msie" && parseInt(ej.browserInfo().version, 10) == 8)
									   $element.css("line-height", "22px");
							    }
                                else if (this.model.editSettings.editMode == "normal"){
                                    $element.css('width', '100%').css("height", "30px");
									if (ej.browserInfo().name == "msie" && parseInt(ej.browserInfo().version, 10) == 8)
									   $element.css("line-height", "24px");
								}	
                                else{
                                    $element.outerWidth(inputWidth).height(28);
									if (ej.browserInfo().name == "msie" && parseInt(ej.browserInfo().version, 10) == 8)
									   $element.css("line-height", "26px");
								}

                            }
                            else
                                $element.width(inputWidth > 0 ? ($element.width() > inputWidth ? inputWidth : $element.width()) : this.model.editSettings.editMode.indexOf("template") != -1 ? $element.width() : 1);
								if(this.model.editSettings.editMode == "batch" && !this._tabKey)
									$element.is(':checked') ? $element.prop("checked",false) : $element.prop("checked",true);
                            break;
                        case "SELECT":
                            $element.width(inputWidth).height(28);
                            break;
                    }
                }
                if (column != null && !column.visible && column.validationRules && !(this.model.editSettings.editMode == "dialogtemplate" || this.model.editSettings.editMode == "externalformtemplate" || this.model.editSettings.editMode == "inlineformtemplate")){				
					$element.addClass("e-hide");
				}
                if (!$element.is(":disabled") && !elementFocused && (!$element.is(":hidden") || typeof ($element.data("ejDropDownList") || $element.data("ejNumericTextbox")) == "object")) {
                    focusEle = $element;
                    elementFocused = true;
                }
            }
            var params2 = {};
            params2.enableRTL = this.model.enableRTL;
            params2.cssClass = this.model.cssClass;
            params2.watermarkText = this.localizedLabels.NumericTextBoxWaterMark;
            params2.locale = this.model.locale;
            $formElement.filter(".e-numerictextbox").ejNumericTextbox($.extend({ showSpinButton: true }, params2));
            params2.watermarkText = this.localizedLabels.DatePickerWaterMark;
            $formElement.filter(".e-datepicker").ejDatePicker($.extend({ displayDefaultDate: true, showPopupButton: false }, params2));
            delete params2["watermarkText"];

            $formElement.filter(".e-datetimepicker").ejDateTimePicker($.extend({ showPopupButton: false }, params2));
            $formElement.filter(".e-dropdownlist").ejDropDownList($.extend({ enableIncrementalSearch: true, htmlAttributes: {style: "width: 100%"} }, params2));
            for (var i = 0; i < this.model.columns.length; i++) {
                var col = this.model.columns[i];
                if (!ej.isNullOrUndefined(col.editParams)) {
                    var field = col.field;
                    field = /^[a-zA-Z0-9- ]*$/.test(field) ? field : field.replace(/[^a-z0-9\s_]/gi, '');

                    switch (col.editType) {
                        case ej.Grid.EditingType.DateTimePicker:
                            $formElement.filter("#" + this._id + field + ".e-datetimepicker").ejDateTimePicker(col.editParams);
                            break;
                        case ej.Grid.EditingType.DatePicker:
                            $formElement.filter("#" + this._id + field + ".e-datepicker").ejDatePicker(col.editParams);
                            break;
                        case ej.Grid.EditingType.Numeric:
                            $formElement.filter("#" + this._id + field + ".e-numerictextbox").ejNumericTextbox(col.editParams);
                            break;
                        case ej.Grid.EditingType.Dropdown:
                            $formElement.filter("#" + this._id + field + ".e-dropdownlist").ejDropDownList(col.editParams);
                            break;
                    }
                }

                if (col.editType == ej.Grid.EditingType.Dropdown) {
                    var f_index = -1;
                    if (this._dataSource().adaptor instanceof ej.ForeignKeyAdaptor)
                        f_index = this._dataSource().adaptor.value.indexOf(col.field)
                    var ele = $formElement.filter("#" + this._id + col.field.replace(/[^a-z0-9\s_]/gi, "") + ".e-dropdownlist");
                    var dataSource = null;
                    if (!ej.isNullOrUndefined(col.dataSource) && !ej.isNullOrUndefined(col.editParams) && ej.isNullOrUndefined(col.foreignKeyField) && this._dataSource().adaptor instanceof ej.ForeignKeyAdaptor && f_index != -1)
                        dataSource = col.dataSource;
                    else if (ej.isNullOrUndefined(col.dataSource) && f_index != -1 && !ej.isNullOrUndefined(col.editParams))
                        dataSource = this._dataSource().adaptor.foreignData[f_index];
                    else if (!ej.isNullOrUndefined(col.editParams) && 'fields' in col.editParams && ej.isNullOrUndefined(col.foreignKeyField))
                        dataSource = col.dataSource; //when field is present in 'editParams' then dataSource is needed.
                    if (dataSource != null)
                        ele.ejDropDownList({ dataSource: dataSource });
                    var val = ele.data("ej-value");
                    if ((this._dataSource() instanceof ej.DataManager && this._dataSource().adaptor instanceof ej.ForeignKeyAdaptor) && f_index != -1 && !ej.isNullOrUndefined(col.editParams))
                        ele.ejDropDownList("setSelectedText", args.requestType == "add" && ej.isNullOrUndefined(col.defaultValue) && ej.isNullOrUndefined(val) ? ele.val("") : val);
                    else
                        ele.ejDropDownList("setSelectedValue", args.requestType == "add" && ej.isNullOrUndefined(col.defaultValue) && ej.isNullOrUndefined(val) ? ele.val("") : val);
                    if (col != null && !col.visible && col.validationRules && !(this.model.editSettings.editMode == "dialogtemplate" || this.model.editSettings.editMode == "externalformtemplate" || this.model.editSettings.editMode == "inlineformtemplate")) {
                        if (col.editType == ej.Grid.EditingType.Dropdown)
                            ele.closest(".e-rowcell").find("input").addClass("e-hide");
                    }
                }
                var format = null;
                if (col["format"] !== undefined && (col.format.length > 0)) {
                    var toformat = new RegExp("\\{0(:([^\\}]+))?\\}", "gm");
                    var formatVal = toformat.exec(col.format);
					if(formatVal!=null)
						format = formatVal[2];
                }

                if ([ej.Grid.EditingType.DatePicker, ej.Grid.EditingType.DateTimePicker].indexOf(col.editType) != -1) {
                    var picker = col.editType == ej.Grid.EditingType.DatePicker ? "datePicker" : "dateTimePicker";
                    var pickerControl = "ej" + picker.replace(/\b\w/g, function (m) { return m.toUpperCase(); });
                    var eleID = this._id + col.field;
                    var dateElement = $formElement.filter(function (e, k) { return k.id == eleID && ($(k).hasClass("e-datepicker") || $(k).hasClass("e-datetimepicker")); });
                    var dateParams = {};
                    if (format != null && !(!ej.isNullOrUndefined(col["editParams"]) && (col["editParams"].dateFormat || col["editParams"].dateTimeFormat)))
                        dateParams[picker.replace("Picker", "") + "Format"] = format;
                    if (dateElement.hasClass("e-disable")) dateParams["enabled"] = false;
                    dateElement[pickerControl](dateParams);
                    if (this.model.editSettings.editMode == "batch")
                        dateElement[pickerControl]("show");
                }
            }
            if (focusEle != null) {
                this._focusElements(focusEle);
            }

        },
        _focusElements: function ($currentCell) {
            if ($currentCell.length) {
                var $childElem = $currentCell;
                if (($childElem[0].tagName.toLowerCase() == "select" && !$childElem.hasClass("e-field e-dropdownlist")) || ($childElem[0].tagName.toLowerCase() == "input") && !$childElem.hasClass("e-numerictextbox")) {
                    $childElem.focus().select();
                    $childElem[0].focus();
                }
                else if ($childElem.hasClass("e-field e-dropdownlist"))
                     $childElem.closest(".e-ddl").focus();
				else if ($childElem.hasClass('e-numerictextbox'))
					 $childElem.siblings('input:visible').first().select().focus();
                else
                    $childElem.find('input:visible,select').first().select().focus();
            }
        },
        _renderToolBar: function () {
            var $div = ej.buildTag('div.e-gridtoolbar', "", {}, { id: this._id + "_toolbarItems" });
            var $ul = ej.buildTag("ul");
            ((!ej.isNullOrUndefined(this.model.toolbarSettings.toolbarItems) && this.model.toolbarSettings.toolbarItems.length) || ((this.model.allowSorting || this.model.allowFiltering) && this.model.enableResponsiveRow)) && this._renderLi($ul);
            $div.append($ul);
            var $customUl = ej.buildTag("ul");
            $div.append($customUl);
            (!ej.isNullOrUndefined(this.model.toolbarSettings.customToolbarItems) && this.model.toolbarSettings.customToolbarItems.length) && this._renderCustomLi($customUl);
            var model = {};
            model.click = this._toolBarClick;
            model.cssClass = this.model.cssClass;
            model.enableRTL = this.model.enableRTL;
            model.enableSeprator = false;
            $div.ejToolbar(model);
            $div.ejToolbar("disableItem", this._disabledToolItems);
            this._disabledToolItems = $();
            return $div;
        },
        _renderCustomLi: function ($ul) {
            var $li; var customToolbar;
            for (var i = 0; i < this.model.toolbarSettings.customToolbarItems.length; i++) {
                customToolbar = this.model.toolbarSettings.customToolbarItems[i]["templateID"] ? this.model.toolbarSettings.customToolbarItems[i]["templateID"].replace("#", "") : this.model.toolbarSettings.customToolbarItems[i];
                $li = ej.buildTag("li", "", {}, { id: this._id + "_" + customToolbar, title: customToolbar });
                switch (typeof this.model.toolbarSettings.customToolbarItems[i]) {
                    case "string":
                        var $item = ej.buildTag("a.e-toolbaricons e-icon", "", {}).addClass(this.model.toolbarSettings.customToolbarItems[i]);
                        break;
                    case "object":
                        var templi = this.model.toolbarSettings.customToolbarItems[i];
                        $li.attr("title", !ej.isNullOrUndefined(templi["tooltip"]) ? templi["tooltip"] : templi["templateID"].replace("#", ""));
                        var $item = $(templi["templateID"]).hide().html();
                        break;
                }
                $li.html($item);
                $ul.append($li);
            }
        },
        _renderLi: function ($ul) {
            if ($.isFunction(window.matchMedia)) {
                if (this.model.enableResponsiveRow && this.phoneMode) {
                    var searchIndex = this.model.toolbarSettings.toolbarItems.indexOf('search');
                    searchIndex != -1 && this.model.toolbarSettings.toolbarItems.splice(searchIndex, 1);
                    if (this.model.allowFiltering)
                        this.model.toolbarSettings.toolbarItems.push('responsiveFilter');
                    if (this.model.allowSorting) {
                        this.model.toolbarSettings.toolbarItems.push('responsiveSorting');
                    }
                    searchIndex != -1 && this.model.toolbarSettings.toolbarItems.push('search');
                }
            }
            for (var i = 0; i < this.model.toolbarSettings.toolbarItems.length; i++) {
                var $li = ej.buildTag("li", "", {}, { id: this._id + "_" + this.model.toolbarSettings.toolbarItems[i], title: this.localizedLabels[this.model.toolbarSettings.toolbarItems[i].slice(0, 1).toUpperCase() + this.model.toolbarSettings.toolbarItems[i].slice(1)] });
                this._renderLiContent($li, this.model.toolbarSettings.toolbarItems[i]);
                var item = this.model.toolbarSettings.toolbarItems[i];
                if (this.model.enableResponsiveRow && (item === "responsiveFilter" || item === "responsiveSorting")) {
                    $li.addClass("e-gridresponsiveicons");
                    $li.css("display", "none");
                }
                $ul.append($li);
            }
        },
        _renderLiContent: function ($li, item) {
            var $a, $input, $div, $span;
            switch (item) {
                case "add":
                    $a = ej.buildTag("a.e-addnewitem e-toolbaricons e-icon e-addnew", "", {});
                    break;
                case "edit":
                    $a = ej.buildTag("a.e-edititem e-toolbaricons e-icon e-edit", "", {});
                    break;
                case "delete":
                    $a = ej.buildTag("a.e-deleteitem e-toolbaricons e-icon e-delete", "", {});
                    break;
                case "update":
                    $a = ej.buildTag("a.e-saveitem e-toolbaricons e-disabletool e-icon e-save", "", {});
                    this._disabledToolItems.push($li.get(0));
                    break;
                case "cancel":
                    $a = ej.buildTag("a.e-cancel e-toolbaricons e-disabletool e-icon e-gcancel", "", {});
                    this._disabledToolItems.push($li.get(0));
                    break;
				
                case "search":
                    $a = ej.buildTag("a.e-searchitem e-toolbaricons e-disabletool e-icon e-searchfind", "", {});
                    if (!this.model.enableResponsiveRow || !this.phoneMode) {
                        $input = ej.buildTag("input.e-ejinputtext e-gridsearchbar", "", {}, { type: "text", id: this._id + "_searchbar" });
                        $span = ej.buildTag('span.e-cancel e-icon e-hide', "", { 'right': '1%' });
                        $div = ej.buildTag('div.e-filterdiv e-searchinputdiv', "", { 'display': 'inline-table', 'width': '83%' });
                        $div.append($input).append($span);
                        $li.append($div);
                        if (!ej.isNullOrUndefined(this.model.searchSettings.key))
                            $input.val(this.model.searchSettings.key);
                    }
                    this.model.allowSearching = true;
                    break;
				case "printGrid":
					 $a = ej.buildTag("a.e-print e-toolbaricons e-icon", "", {});
					 break;
                case "excelExport":
                    $a = ej.buildTag("a.e-toolbaricons e-excelIcon e-icon", "", {});
                    break;
                case "wordExport":
                    $a = ej.buildTag("a.e-toolbaricons e-wordIcon e-icon", "", {});
                    break;
                case "pdfExport":
                    $a = ej.buildTag("a.e-toolbaricons e-pdfIcon e-icon", "", {});
                    break;
                case "responsiveFilter":
                    $a = ej.buildTag("a.e-toolbaricons e-filterset e-icon", "", {});
                    break;
                case "responsiveSorting":
                    $a = ej.buildTag("a.e-toolbaricons e-respponsiveSorting e-icon", "", {});
                    break;
            }
            $li.append($a);
            if (item == "search"){
                this._searchBar = $li;
				$li.css('display','flex');
			}
        },
        _toolBarClick: function (Sender) {
            var $gridEle = $(this.itemsContainer).closest(".e-grid"), gridInstance = $gridEle.ejGrid("instance"), gridId = $gridEle.attr('id');
            if (Sender.event == undefined && Sender.target.tagName == "INPUT" && Sender.currentTarget.id == gridId + "_search")
                return;
            $.isFunction($.fn.ejDatePicker) && $("#" + gridId + "EditForm").find(".e-datepicker").ejDatePicker("hide");
            var currentTarget = Sender.currentTarget; var target = Sender.target;
            var gridModelClone = $.extend({}, gridInstance.model);
            if (gridInstance.ignoreOnToolbarServerClick.length) {
                for (var i = 0; i < gridInstance.ignoreOnToolbarServerClick.length; i++)
                    delete gridModelClone[gridInstance.ignoreOnToolbarServerClick[i]];
            }
            var args = { itemName: $(currentTarget).attr("data-content"), itemId: currentTarget.id, currentTarget: currentTarget, target: target, itemIndex: $(currentTarget).index(), itemCurrentTarget: currentTarget.outerHTML, gridModel: gridModelClone, itemTarget: target.outerHTML, toolbarData: Sender };
            if ($gridEle.ejGrid("instance")._trigger("toolbarClick", args))
                return;
            switch (args.itemId) {
                case gridId + "_add":
                    gridInstance._toolbarOperation(gridId + "_add");
                    break;
                case gridId + "_edit":
                    gridInstance._toolbarOperation(gridId + "_edit");
                    break;
                case gridId + "_delete":
                    gridInstance._toolbarOperation(gridId + "_delete");
                    break;
                case gridId + "_update":
                    gridInstance._toolbarOperation(gridId + "_update");
                    break;
                case gridId + "_cancel":
                    if (gridInstance.model.editSettings.editMode == "batch"){
                        if(gridInstance.model.editSettings.showConfirmDialog)
                             gridInstance._confirmDialog.find(".e-content").html(gridInstance.localizedLabels.CancelEdit).end().ejDialog("open");
                        else    
                             gridInstance.cancelEdit();
                    }
                    else
                        gridInstance._toolbarOperation(gridId + "_cancel");
                    break;
                case gridId + "_search":
                    if (gridInstance.model.enableResponsiveRow && gridInstance.phoneMode) {
                        if (ej.isNullOrUndefined(gridInstance.element.find('.e-responsesearch')[0])) {
                            var $div = ej.buildTag('div.e-gridtoolbar', "", {}, { id: this._id + "_toolbarItems" });
                            var $ul = ej.buildTag('div.e-responsesearch', '', { 'width': '95%', 'height': '38px', 'margin-top': '7px', 'margin-left': '6px' });
                            var $span = ej.buildTag('span.e-ttoltxt', '', { width: '98%', 'margin-left': '2%' }, { id: gridInstance._id + "_search" });
							var $a = ej.buildTag("span.e-searchitem e-toolbaricons e-disabletool e-icon e-searchfind", "", { 'position': 'absolute', 'right': '2%', 'margin-top': '1%' });
                            if (ej.browserInfo().name === "webkit")
                                $a.css("margin-top", "-2px");
                            var $input = ej.buildTag("input.e-ejinputtext", "", { width: '97%', 'height': '30px' }, { type: "search", id: gridInstance._id + "_searchInput" });
                            if (!ej.isNullOrUndefined(gridInstance.model.searchSettings.key))
                                $input.val(gridInstance.model.searchSettings.key);
                            $span.append($input);
                            $span.append($a);
                            $ul.append($span);
                            $div.append($ul);
                            $div.ejToolbar({
                                click: function (sender) {
                                    gridInstance._toolbarOperation(gridId + "_search", $(sender.currentTarget).find("input").val(),Sender);
                                }
                            });
                            $input.on('keyup', function (e) {
                                if ($input.val() != '') {
                                    $a.removeClass('e-searchfind');
                                    $a.addClass('e-cancel')
                                }
                                else {
                                    $a.removeClass('e-cancel');
                                    $a.addClass('e-searchfind');
                                }
                            });
                            $a.click(function () {
                                if ($a.hasClass('e-cancel')) {
                                    $input.val('');
                                    $a.removeClass('e-cancel');
                                    $a.addClass('e-searchfind');
                                    gridInstance._toolbarOperation(gridId + "_search", $("#" + gridId + "_searchInput").val(),Sender);
                                }
                            })
                            $div.insertBefore(gridInstance.getHeaderContent());
                        }
                        else {
                            if (gridInstance.element.find('.e-responsesearch').css('display') == 'block')
                                gridInstance.element.find('.e-responsesearch').css('display', 'none');
                            else
                                gridInstance.element.find('.e-responsesearch').css('display', 'block');
                        }
                    }
                    else
                        gridInstance._toolbarOperation(gridId + "_search", $(Sender.target).hasClass("e-cancel") ? "" : $(Sender.currentTarget).find("input").val(),Sender);
                    break;
				case gridId + "_printGrid":
                    gridInstance._toolbarOperation(gridId + "_printGrid");
                    break;
                case gridId + "_excelExport":
                    gridInstance._toolbarOperation(gridId + "_excelExport");
                    break;
                case gridId + "_wordExport":
                    gridInstance._toolbarOperation(gridId + "_wordExport");
                    break;
                case gridId + "_pdfExport":
                    gridInstance._toolbarOperation(gridId + "_pdfExport");
                    break;
                case gridId + "_responsiveFilter":
                    gridInstance._toolbarOperation(gridId + "_responsiveFilter");
                    break;
                case gridId + "_responsiveSorting":
                    gridInstance._toolbarOperation(gridId + "_responsiveSorting");
                    break;
            }
            return false;
        },

        _toolbarOperation: function (operation, searchEle,args) {
            var $gridEle = this.element, gridObject = $gridEle.ejGrid("instance"), batchEnable = gridObject.model.editSettings.editMode == "batch", gridId = $gridEle.attr('id'), fieldName;
            gridObject._exportTo = gridObject["export"];
            switch (operation) {
                case gridId + "_add":
                    if (batchEnable)
                        gridObject._bulkAddRow();
                    else
                        gridObject._startAdd();
                    break;
                case gridId + "_edit":
                    if (batchEnable && gridObject.model.editSettings.allowEditing) {
					    if (gridObject._bulkEditCellDetails.columnIndex == -1) {
					        alert(this.localizedLabels.EditOperationAlert);
                            return;
                        }
                        fieldName = gridObject.model.columns[gridObject._bulkEditCellDetails.columnIndex].field;
                        fieldName && gridObject.editCell(gridObject._bulkEditCellDetails.rowIndex, fieldName);
                    }
                    else
                        gridObject.startEdit();
                    break;
                case gridId + "_delete":
                    if (this._selectedRow() == -1) {
                        alert(this.localizedLabels.DeleteOperationAlert);
                        return;
                    }
                    if (this.model.editSettings.showDeleteConfirmDialog)					     
						this._confirmDialog.find(".e-content").html(this.localizedLabels.ConfirmDelete).end().ejDialog("open");
                    else {
                        if (batchEnable)
                            this._bulkDelete()
                        else {
                            if (this.multiDeleteMode)
                                this._multiRowDelete();
                            else
                                this.deleteRow();
                        }
                    }
                    break;
                case gridId + "_update":
                    if (batchEnable && $("#" + this._id + "EditForm").children().find(".e-field-validation-error").length == 0)
                        this.model.editSettings.showConfirmDialog ? this._confirmDialog.find(".e-content").html(this.localizedLabels.BatchSaveConfirm).end().ejDialog("open") : this.batchSave();
                    else
                        gridObject.endEdit();
                    break;
                case gridId + "_cancel":
                    if (batchEnable) {
                        if ($("#" + gridId + "ConfirmDialog").ejDialog("isOpened") === true)
                            this._triggerConfirm();
                        else
                            gridObject.cancelEditCell();
                    }
                    else
                        gridObject.cancelEdit();
                    break;
                case gridId + "_search":
                    if (args.type == 'click' && (args.target.nodeName == "A" || args.target.nodeName == "SPAN"))
                        $gridEle.ejGrid("search", searchEle);
                    break;
				case gridId + "_printGrid":
                    this.print();
                    break;
                case gridId + "_excelExport":
                    gridObject._exportTo(gridObject.model.exportToExcelAction, 'excelExporting', gridObject.model.allowMultipleExporting);
                    break;
                case gridId + "_wordExport":
                    gridObject._exportTo(gridObject.model.exportToWordAction, 'wordExporting', gridObject.model.allowMultipleExporting);
                    break;
                case gridId + "_pdfExport":
                    gridObject._exportTo(gridObject.model.exportToPdfAction, 'pdfExporting', gridObject.model.allowMultipleExporting);
                    break;
                case gridId + "_responsiveFilter":
				    $("#"+gridObject._id+"responsiveFilter").css('display', 'block'),
                    setTimeout(function () { gridObject.element.css('display', 'none'),  0 });
                    break;
                case gridId + "_responsiveSorting":
                    this._sortColumns = []; this._removeSortCol = []
                    for (var i = 0; i < this.model.sortSettings.sortedColumns.length; i++) {
                        this._sortColumns.push({ field: this.model.sortSettings.sortedColumns[i].field, direction: this.model.sortSettings.sortedColumns[i].direction });
                    }
                    if (ej.isNullOrUndefined($("#"+this._id+"responsiveSort")[0])) {
                        var $dlg = $("#"+this._id+"responsiveFilter").clone().css('display', 'block');
                        $dlg.insertAfter(this.element);
                        $dlg.attr('id', this._id+'responsiveSort');
                        gridObject._setSortingButton();
                        var $btnDiv = ej.buildTag('div.btnContainer', '', { 'width': '100%', 'bottom': '0px','position' : 'absolute' });
                        var $inputOk = ej.buildTag('input.e-resposnsiveFilterBtnLeft e-flat e-btnsub', 'OK', { 'width': '45.6%' });
                        var $inputCancel = ej.buildTag('input.e-resposnsiveFilterBtnRight e-flat e-btncan', 'Cancel', { 'width': '46%' });
                        var $closeIcon = ej.buildTag('div.e-resFIlterRigthIcon');
                        var $cspanIcon = ej.buildTag('span.e-icon e-responsiveClose e-resIcon');
                        $dlg.find('.e-resFilterleftIcon').remove();
                        $dlg.find('.e-labelRes').text('Sorting');
                        $dlg.find('.e-resFilterDialogHeaderDiv').append($closeIcon.append($cspanIcon))
                        $dlg.find('.e-resFilterDialogHeaderDiv').find('.e-resFIlterRigthIcon').click(function (e) {
                            $("#"+gridObject._id+"responsiveSort").css('display', 'none');
                            gridObject.element.css('display', 'block');
                        })
                        var $divIcon = ej.buildTag('div.e-resFilterleftIcon', '', { 'margin-top': '3%' });
                        var $spanIcon = ej.buildTag('span.e-icon e-resIcon e-responsiveSortClear');
                        $divIcon.click(function () {
                            $dlg.find('.e-responsivefilterColDiv').find('.e-button').remove();
                            gridObject._setSortingButton(true);
                            for (var i = 0; i < gridObject._sortColumns.length; i++) {
                                if (gridObject._removeSortCol.indexOf(gridObject._sortColumns[i].field) == -1)
                                    gridObject._removeSortCol.push(gridObject._sortColumns[i].field);
                            }
                            gridObject._sortColumns = [];
							gridObject._removeSortCol = [];
                        });
                        $dlg.find('.e-resFilterDialogHeaderDiv').prepend($divIcon.append($spanIcon));
                        $dlg.css('height', $(window).height());
                        $dlg.append($btnDiv);
                        $btnDiv.append($inputOk).append($inputCancel);
                        $inputOk.ejButton({
                            text: 'OK', type: 'button',
                            click: $.proxy(this._resSortOperation, this)
                        })
                        $inputCancel.ejButton({
                            text: 'Cancel', type: 'button',
                            click: function () {
                                $("#"+gridObject._id+"responsiveSort").css('display', 'none');
                                gridObject.element.css('display', 'block');
                                gridObject._sortColumns = [];
                                $dlg.find('.e-responsivefilterColDiv').find('.e-button').remove();
                                gridObject._setSortingButton();
                            }
                        })
                    }
                    else {
                        $("#"+this._id+"responsiveSort").find('.e-responsivefilterColDiv').find('.e-button').remove();
                        this._setSortingButton();
                    }
                     $("#"+this._id+"responsiveSort").css('display', 'block');
                    $("#"+this._id+"responsiveSort").find('.e-responsivefilterColDiv').find('.e-filternone').remove();
					$("#"+this._id+"responsiveSort").css({'position':'relative'});
                    setTimeout(function () { gridObject.element.css('display', 'none'), 0 });
                    break;
            }
            return false;
        },
        _resSortOperation: function (sender) {
            var rCol=[];
			for(var i=0; i< this.model.sortSettings.sortedColumns.length;i++)
				rCol.push(this.model.sortSettings.sortedColumns[i].field);
            for (var i = 0; i < rCol.length; i++)
                this.removeSortedColumns(rCol[i]);
            for (var i = 0 ; i < this._sortColumns.length; i++) {
                if (this.model.allowMultiSorting)
                    this.multiSortRequest = true;
                this.sortColumn(this._sortColumns[i].field, this._sortColumns[i].direction);
            }
            $("#"+this._id+"responsiveSort").css('display', 'none');
            this.element.css('display', 'block');
        },
        _setSortingButton: function (clear) {
            var $sortDiv = $("#"+this._id+"responsiveSort");
            var gridObj = this;
            this._sortCols = [];
            if (ej.isNullOrUndefined($sortDiv.find('.e-responsivefilterColDiv').find('.e-button')[0])) {
                $sortDiv.find('.e-responsivefilterColDiv').each(function (index, object) {
                    var $btnDiv = ej.buildTag('div', '', { 'float': 'right', 'margin-right': '2%', 'margin-top': '-1%' })
                    var fieldName = $(object).attr('data-ej-mappingname');
                    var $but = ej.buildTag('button#' + gridObj._id+fieldName + ".e-sortingBtn e-flat", '');
                    $(object).append($btnDiv.append($but));
                    var btnText = 'None', icon = '';
                    if (!clear) {
                        for (var sortC = 0; sortC < gridObj.model.sortSettings.sortedColumns.length; sortC++) {
                            if (gridObj.model.sortSettings.sortedColumns[sortC].field == fieldName) {
                                btnText = gridObj.model.sortSettings.sortedColumns[sortC].direction == 'ascending' ? 'Ascending' : 'Descending';
                                icon = btnText == 'Ascending' ? 'e-resIcon e-respponsiveSortingAsc' : 'e-resIcon e-respponsiveSortingDesc';
                            }
                        }
                        if (icon != '') {
                            $but.ejButton({
                                text: btnText, type: 'button',
                                height: 28,
                                width: 120,
                                cssClass: 'e-resSortIconBtn',
                                id: fieldName,
                                prefixIcon: icon,
                                imagePosition: "imageright",
                                contentType: "textandimage",
                                showRoundedCorner: true,
                                click: $.proxy(gridObj._resSortButClick, gridObj)
                            })
                        }
                        else {
                            $but.ejButton({
                                text: btnText, type: 'button',
                                height: 28,
                                cssClass: 'e-resSortIconBtn',
                                width: 120,
                                id: fieldName,
                                showRoundedCorner: true,
                                click: $.proxy(gridObj._resSortButClick, gridObj)
                            })
                        }
                    }
                    else {
                        $but.ejButton({
                            text: btnText, type: 'button',
                            height: 28,
                            width: 120,
                            id: fieldName,
                            showRoundedCorner: true,
                            click: $.proxy(gridObj._resSortButClick, gridObj)
                        })
                    }
                });
            }
        },
        _sortOperation: function (field, direction) {
            if (this._removeSortCol.indexOf(field) != -1) {
                this._sortColumns.splice(this._removeSortCol.indexOf(field), 0);
				this._removeSortCol.splice(this._removeSortCol.indexOf(field), 0);
            }
            for (var column = 0; column < this._sortColumns.length; column++) {
                if (this._sortColumns[column]["field"] == field)
                    break;
            }
            if (this.model.allowMultiSorting) {
                this.multiSortRequest = true;
                if (column != -1) {
                    this._sortColumns.splice(column, 1);
					if (this._removeSortCol.indexOf(field) == -1)
						this._removeSortCol.push(field);
                }
            }
            else {
                $("#"+this._id+"responsiveFilter").find('.e-responsivefilterColDiv').find('.e-button').removeClass('e-disable');
                var $divColg = $("#"+this._id+"responsiveFilter").find('.e-responsivefilterColDiv').not(".e-responsivefilterColDiv[data-ej-mappingname='" + field + "']");
                var $btn = $divColg.find('.e-button').addClass('e-disable');
                $btn.text('None');
                if (this._sortColumns.length > 0) {
                    this._removeSortCol.push(this._sortColumns[0].field);
                    this._sortColumns = [];
                }
            }
            this._sortColumns.push({ field: field, direction: direction });
        },
        _resSortButClick: function (sender) {
            var text = '', prefixIcon = '', fieldName = sender.model.id;
            var obj = $("#" +this._id+ sender.model.id).ejButton('instance');
            if (sender.model.text == 'None') {
                text = 'Ascending';
                prefixIcon = 'e-resIcon e-respponsiveSortingAsc';
                this._sortOperation(fieldName, 'ascending');
            }
            else if (sender.model.text == 'Ascending') {
                text = 'Descending';
                prefixIcon = 'e-resIcon e-respponsiveSortingDesc';
                this._sortOperation(fieldName, 'descending');
            }
            else {
                obj.model.text = 'None';
                obj.model.prefixIcon = '';
                obj.type = 'button';
                obj.model.contentType = "text";
                obj._render();
                for (var column = 0; column < this._sortColumns.length; column++) {
                    if (this._sortColumns[column]["field"] == fieldName)
                        break;
                }
                this._removeSortCol.push(fieldName);
                this._sortColumns.splice(column, 1);
                $("#"+this._id+"responsiveFilter").find('.e-responsivefilterColDiv').find('.e-button').removeClass('e-disable');
                return;
            }
            obj.model.text = text; obj.model.prefixIcon = 'e-resIcon ' + prefixIcon; obj.model.imagePosition = "imageright";
            obj.model.contentType = "textandimage"; obj._render();
        },
        renderDiaglogButton: function (form, tbody) {
            var btnId;
            if (this.model.editSettings.editMode == "externalform" || this.model.editSettings.editMode == "externalformtemplate")
                btnId = "EditExternalForm_";
            else if (this.model.editSettings.editMode == "inlineform" || this.model.editSettings.editMode == "inlineformtemplate") {
                btnId = "InlineEditForm_";
                var inlineTitleBar = ej.buildTag("div", "", "", { id: this._id + "_inlineFormTitle", 'class': "e-inlineform-titlebar" });
                inlineTitleBar.appendTo(tbody);
                    }
					
            else
                btnId = "EditDialog_";
            var savebtn = ej.buildTag('input.e-save e-button e-btnsub e-flat', "", { 'margin-left': '30px' }, { type: "button", id: btnId + this._id + "_Save" });
            savebtn.ejButton({ cssClass: this.model.cssClass, enableRTL: this.model.enableRTL, text: this.localizedLabels.SaveButton, width: "100" });
            var cancelbtn = ej.buildTag('input.e-cancel e-button e-btncan e-flat', "", { 'margin-left': '19px', 'margin-right': '13px' }, { type: "button", id: btnId + this._id + "_Cancel" });
            cancelbtn.ejButton({ cssClass: this.model.cssClass, enableRTL: this.model.enableRTL, text: this.localizedLabels.CancelButton, width: "100" });
            var btnDiv = (this.model.editSettings.editMode != "dialog" && this.model.editSettings.editMode != "dialogtemplate") ? ej.buildTag('div', "", "", { 'class': "e-editform-btn" }) : ej.buildTag('div');
            btnDiv.append(savebtn);
            btnDiv.append(cancelbtn);
            form.appendTo(tbody);
            if (this.model.editSettings.editMode != "dialog" && this.model.editSettings.editMode != "dialogtemplate")
                btnDiv.appendTo(tbody);
            else
                form.append(btnDiv);
            return tbody;
        },
        _externalFormPosition: function () {
            var pos = $(this.element).offset();
            var width = $(this.element).width();
            var height = $(this.element).height();
            var DivElement = $("#" + this._id + "_externalEdit");
            switch (this.model.editSettings.formPosition) {
                case "topright":
                    $(DivElement).find('.e-form-toggle-icon').removeClass('e-bottomleft').addClass('e-topright');
                    $(DivElement).css({ "left": (pos.left + width + 1) + "px", "top": pos.top + "px", "position": "absolute", "width": "290px" });
                    $("#" + this._id + "_eFormContent").height("auto");
                    break;
                case "bottomleft":
                    $(DivElement).find('.e-form-toggle-icon').removeClass('e-topright').addClass('e-bottomleft');
                    $(DivElement).css({ "left": (pos.left) + "px", "top": (pos.top + height + 1) + "px" });
                    $("#" + this._id + "_eFormContent").width("100%");
                    break;
            }
        },
        _setoffsetWidth: function () {
            var tds, $form = this.model.scrollSettings.frozenColumns > 0 ? this.element.find(".gridform") : $("#" + this._id + "EditForm");
            if (this._gridRecordsCount == 0 && this.model.groupSettings.groupedColumns.length == 0 && this.model.scrollSettings.frozenColumns == 0 && this.model.scrollSettings.frozenRows == 0 && this.model.editSettings.editMode != "batch" && (!($form.find(".e-checkbox").length > 0 && this._dataSource() instanceof ej.DataManager)))
                return;
            if (this.model.editSettings.editMode == "batch")
                tds = $form.closest("td");
            else if (this.model.editSettings.editMode == "inlineform" || this.model.editSettings.editMode == "inlineformtemplate" || this.model.editSettings.editMode == "externalform" || this.model.editSettings.editMode == "externalformtemplate")
                tds = $form.find(".e-rowcell").not(".e-unboundcell,.e-templatecell");
            else
                tds = $form.find("tr").find(".e-rowcell").not(".e-unboundcell,.e-templatecell");
            for (var i = 0; i < tds.length; i++)
                this._tdsOffsetWidth[i] = tds.get(i).offsetWidth;
        },
        _bulkChangesAcquired: function () {
            if (this.batchChanges.added.length > 0 || this.batchChanges.changed.length || this.batchChanges.deleted.length)
                return true;
            return false;
        },
        _renderDialog: function () {
            var $dialog = ej.buildTag("div.e-dialog e-dialog-content e-shadow e-widget-content", "", { display: "none" }, { id: this._id + "_dialogEdit" });
            return $dialog;
        },
        
        getCurrentEditCellData: function () {
            if (this.model.isEdit && $("#" + this._id + "EditForm").length) {
                var $element = $("#" + this._id + this._bulkEditCellDetails.fieldName.replace(/[^a-z0-9\s_]/gi, '')), cellValue,
                    column = this.model.columns[this._bulkEditCellDetails.columnIndex], temp1;
                switch (this._bulkEditCellDetails.cellEditType) {
                    case ej.Grid.EditingType.String:
					case ej.Grid.EditingType.Numeric:
                        cellValue = $element.val();
                        break;                                          
                    case ej.Grid.EditingType.Dropdown:
                        cellValue = this._bulkEditCellDetails.isForeignKey ? { "value": $element.ejDropDownList("getSelectedValue"), "text": $element.ejDropDownList("getValue") } : $element.ejDropDownList("getSelectedValue");
                        if ( this._bulkEditCellDetails.isForeignKey && column.originalType == "number" && cellValue.value !="" )
							cellValue.value = JSON.parse(cellValue.value);
						break;
                    case ej.Grid.EditingType.Boolean:
                        cellValue = $element.is(':checked');
                        break;
                    case ej.Grid.EditingType.DatePicker:                       
                        var val = $.trim($element.val());
                        var dropObj = $element.ejDatePicker("instance");
                        dropObj._setDateValue(val);//to update dropdownlist model when manually entering value
                        cellValue = val == "" ? val : dropObj.model.value;
                        break;
                    case ej.Grid.EditingType.DateTimePicker:
                        cellValue = $.trim($element.val()) == "" ? $.trim($element.val()) :$element.ejDateTimePicker("model.value");
                        break;
                    case "edittemplate":
                        temp1 = column.editTemplate.read;
                        if (typeof temp1 == "string")
                            temp1 = ej.util.getObject(temp1, window);
                        cellValue = temp1($element);
                        break;
                }
                if (typeof cellValue == "string" && cellValue.length && column.type == "number")
                   cellValue = ej.globalize.parseFloat(cellValue,this.model.locale);
                return cellValue;
            }
            return null;
        },
        cancelEditCell: function () {
            if (this.model.isEdit) {
                var tr = this.getRows()[this._bulkEditCellDetails.rowIndex], cellData = {}, cell;
                ej.createObject(this._bulkEditCellDetails.fieldName, this._bulkEditCellDetails.cellValue, cellData);
                if ($(tr).hasClass("e-insertedrow"))
                    cell = $(tr).find('.e-rowcell').get(this._bulkEditCellDetails.columnIndex + this.model.groupSettings.groupedColumns.length);
                else
                    cell = $(tr).find('.e-rowcell').get(this._bulkEditCellDetails.columnIndex);
                $(cell).removeClass("e-validError");
                if ($(cell).hasClass("e-updatedtd"))
                    $(cell).addClass("e-gupdatenotify");
                $(cell).removeClass("e-editedbatchcell").empty().html($($.templates[this._id + "_JSONTemplate"].render(cellData)).find('.e-rowcell').get(this._bulkEditCellDetails.columnIndex).innerHTML);
                this.model.isEdit = false;
                this.element.focus();
            }
        },
        saveCell: function (preventSaveEvent) {
            if (this.model.isEdit) {
                if (!this.editFormValidate())
                    return true;
                var $form = $("#" + this._id + "EditForm"), $targetTR = $form.closest("tr"), $targetTD = $form.closest("td"), $toolBar, tempVal, formattedValue
                , args = {}, column = this.model.columns[this._bulkEditCellDetails.columnIndex], $element = $("#" + this._id + this._bulkEditCellDetails.fieldName.replace(/[^a-z0-9\s_]/gi,'')), getVal, setVal;
                args = {
                    columnName: column.field,
                    value: this.getCurrentEditCellData(),
                    rowData: this._bulkEditCellDetails.rowData,
                    previousValue: this._bulkEditCellDetails.cellValue,
                    columnObject: column,
                    cell: $targetTD,
                    isForeignKey: this._bulkEditCellDetails.isForeignKey
                };
                if (!preventSaveEvent && this._trigger("cellSave", args)) {
                    this._focusElements(args.cell);
                    this._bulkEditCellDetails.cancelSave = true;
                    return;
                }
                if (this.model.allowTextWrap)
                    args.cell.addClass("e-nowrap");
                if (this._bulkEditCellDetails.cellEditType == "datetimepicker" || this._bulkEditCellDetails.cellEditType == "dropdownedit" || this._bulkEditCellDetails.cellEditType == "datepicker")
                    $element[$element.data("ejWidgets")[0]]("destroy");
                if (!ej.isNullOrUndefined(column.format)) {
                    if ((column.type == "date" || column.type == "datetime") && !ej.isNullOrUndefined(args.value))
                        (!args.isForeignKey) ? args.value = args.value.length > 0 ? new Date(args.value) : args.value : args.value.text = args.value.text.length > 0 ? new Date(args.value.text) : args.value.text;
                
                    formattedValue = this.formatting(column.format, args.isForeignKey ?
                                              (!isNaN(parseFloat(args.value.text)) && isFinite(args.value.text)
                                              ? parseFloat(args.value.text)
                                              : args.value.text) : args.value,this.model.locale);
                    args.cell.empty().html(formattedValue);
                }
                ej.createObject(this._bulkEditCellDetails["fieldName"], args.isForeignKey ? args.value.value : args.value, args.rowData);
                if (ej.isNullOrUndefined(column.format))
                    formattedValue = args.isForeignKey ? args.value.text : args.value;
                if (!ej.isNullOrUndefined(column.template)) {
                    var rowData = ej.copyObject({}, args.rowData);
                    ej.createObject(this._bulkEditCellDetails["fieldName"], args.isForeignKey ? args.value.value : args.value, rowData);
                    formattedValue = $.templates(column.template).render(rowData);
                }
                if (this._bulkEditCellDetails.cellEditType == "edittemplate") {                
                    if (args.value instanceof Array)
                        formattedValue = args.value.join();
                    args.cell.empty().html(formattedValue);
                }
                else {
                    if (args.columnObject.type == "boolean" || args.columnObject.editType == "booleanedit") {
                        var cellData = {};
                        ej.createObject(args.columnObject.field, args.value, cellData);
                        args.cell.empty().html($($.templates[this._id + "_JSONTemplate"].render(cellData))[0].cells[this._bulkEditCellDetails.columnIndex].innerHTML);						
					}
                    else if ((args.columnObject.editType == "datepicker" || args.columnObject.editType == "datetimepicker") && !ej.isNullOrUndefined(column.format))
						args.cell.empty().html(formattedValue);
                    else {
                        if (args.columnObject.disableHtmlEncode)
                            args.cell.text(formattedValue).html();
                        else
                            args.cell.empty().html(formattedValue);
                    }
                }
                args.cell.removeClass('e-validError');
                if (args.cell.hasClass('e-updatedtd'))
                    args.cell.addClass("e-gupdatenotify");
                args.previousValue = !ej.isNullOrUndefined(args.previousValue) ? (column.type == "date" || column.type == "datetime") ? new Date(args.previousValue) : args.previousValue : "";
                tempVal = args.isForeignKey ? args.value.value : args.value;
                var isValueModified = false,gridColData;
                if (this.model.editSettings.rowPosition == "bottom") {
                    var rowDataIndex = this.getBatchChanges().added.length ? this.selectedRowsIndexes[0] : ((this.model.groupSettings.groupedColumns  && this.selectedRowsIndexes && this.selectedRowsIndexes.length)? this.selectedRowsIndexes[0] : args.cell.parent().index());
                    gridColData = (this.getBatchChanges().added.length && args.cell.parent().hasClass("e-insertedrow") && (this._currentJsonData.length == this._bulkEditCellDetails.rowIndex)) ? this._currentJsonData[0] : this._currentJsonData[rowDataIndex];
                }
                else {
                    var rowDataIndex = this.getBatchChanges().added.length ? args.cell.parent().hasClass("e-insertedrow") ? this.selectedRowsIndexes[0] : this.selectedRowsIndexes[0] - this.getBatchChanges().added.length : ((this.model.groupSettings.groupedColumns && this.selectedRowsIndexes && this.selectedRowsIndexes.length) ? this.selectedRowsIndexes[0] : args.cell.parent().index());
                    gridColData = (!this.getBatchChanges().added.length && (this._currentJsonData.length == this._bulkEditCellDetails.rowIndex)) ? this._currentJsonData[this._bulkEditCellDetails.rowIndex - 1] : this._currentJsonData[rowDataIndex];
                }
                if(this._currentJsonData.length>0){
				    if ((this._bulkEditCellDetails.type == "date" || this._bulkEditCellDetails.type == "datetime") && !ej.isNullOrUndefined(this._bulkEditCellDetails.format))
				        isValueModified = args.value instanceof Date ? this.formatting(this._bulkEditCellDetails.format, tempVal) != this.formatting(this._bulkEditCellDetails.format, ej.getObject(args.columnName, gridColData)) : (ej.isNullOrUndefined(gridColData[this._bulkEditCellDetails.fieldName]) && this._bulkEditCellDetails._data[rowDataIndex][this._bulkEditCellDetails.fieldName] == args.value) ? false : true;
                    else if (!ej.isNullOrUndefined(ej.getObject(args.columnName, gridColData)))
                       isValueModified = ((this._bulkEditCellDetails.cellEditType == "datepicker" || this._bulkEditCellDetails.cellEditType == "datetimepicker" || this._bulkEditCellDetails.cellEditType == "dropdownedit")
						  && tempVal instanceof Date && args.previousValue instanceof Date) ? (tempVal.getTime() !== ej.getObject(args.columnName, gridColData).getTime()) : (typeof (tempVal) == "number" ? tempVal !== parseFloat(ej.getObject(args.columnName, gridColData)) : typeof (tempVal) == "boolean" ? tempVal != ej.getObject(args.columnName, gridColData) : tempVal !== ej.getObject(args.columnName, gridColData).toString());
				    else
                        isValueModified = args.cell.parent().hasClass("e-insertedrow") ? true : (ej.isNullOrUndefined(gridColData[this._bulkEditCellDetails.fieldName]) && (tempVal == "") ? !(args.previousValue == tempVal) : args.previousValue != gridColData[this._bulkEditCellDetails.fieldName]);
                }
				else
					isValueModified = true;
				this.model.isEdit = false;
                if (isValueModified) {
                    args.cell.addClass("e-updatedtd e-icon e-gupdatenotify");
                    this._enableSaveCancel();
                    getVal = ej.getObject(this._bulkEditCellDetails["fieldName"], args.rowData);
                    if (typeof getVal == "string" && getVal.length)
                        setVal = args.isForeignKey ? args.value.value.toString() : args.value.toString();
                    else
                        setVal = args.isForeignKey ? (!isNaN(parseInt(args.value.value)) ? parseInt(args.value.value) : args.value.value) : args.value;
                    if (typeof args.value == "string" && !setVal.length)
                        setVal = null;
                    ej.createObject(this._bulkEditCellDetails["fieldName"], setVal, args.rowData);
                    if ($.inArray(args.rowData, this.batchChanges.changed) == -1 && $.inArray(args.rowData, this.batchChanges.added) == -1)
                        this.batchChanges.changed.push(args.rowData);
					if(this.isejObservableArray){
                        var batchAction;
                        if (args.cell.closest("tr").hasClass("e-insertedrow"))
                            batchAction = "insert";
                        else
                            batchAction = "update";                                                                             
                        this._refreshViewModel(args, batchAction);
                    }
                }
                else{
                    args.cell.removeClass("e-updatedtd e-icon e-gupdatenotify");
                    this._enableSaveCancel();
                    if(this.batchChanges.changed.length >0 &&  !args.cell.hasClass("e-editedbatchcell e-updatedtd e-icon e-gupdatenotify") && !args.cell.parent().children().hasClass("e-updatedtd e-icon e-gupdatenotify")){
						for(var index = 0 ; index < this.batchChanges.changed.length; index++){
							if(args.rowData[this._primaryKeys[0]] == this.batchChanges.changed[index][this._primaryKeys[0]])
								this.batchChanges.changed.splice(index,1)
						}
					}
                }
                $targetTR.removeClass("e-editedrow").removeClass("e-batchrow");
                args.cell.removeClass("e-editedbatchcell");
            }
        },
		_refreshViewModel:function(args, batchAction){
            var dm;
            if (!(this._dataSource() instanceof ej.DataManager))
                dm = ej.DataManager(this._dataSource());
            else 
                dm = this._dataSource();
            var query = new ej.Query();
            for (var i = 0; i < this._primaryKeys.length; i++)
                query = query.where(this._primaryKeys[i], ej.FilterOperators.equal, this._primaryKeys.length ? ej.getObject(this._primaryKeys[i], args.rowData) : null);
            var currentData = dm.executeLocal(query);
            var $dataSource = this._dataSource(undefined, true);
            var index = $.inArray(currentData[0], this._dataSource());
            this.model.editSettings.showConfirmDialog = false;
            switch (batchAction) {
                case "update":                
                $dataSource(args.rowData, index, batchAction);
                break;
                case "remove":
                $dataSource(args.rowData, index, batchAction);               
                break;
                case "insert":
                $dataSource(args.rowData, 0, batchAction);                  
                break;
            }            
        },
        _enableSaveCancel: function () {
            if (this.model.toolbarSettings.showToolbar) {
                var toolbarState = this.getContentTable().find(".e-updatedtd.e-icon.e-gupdatenotify").length > 0 ||  this._isBatchDeleteApplied  ? "enableItemByID" : "disableItemByID";
                var $toolBar = this.element.find("#" + this._id + "_toolbarItems");
                $toolBar.ejToolbar(toolbarState, this._id + "_update");
                $toolBar.ejToolbar(toolbarState, this._id + "_cancel");
            }
        },
        setCellText: function (rowIndex, cellIndex, value) { /*Supports only local datasource*/
            var byField = typeof cellIndex == "string", rows = this._excludeDetailRows(), cell,
                isGrouped = this.model.groupSettings.groupedColumns.length != 0, isVirtualized = this.model.scrollSettings.allowVirtualScrolling,
                column = this[byField ? "getColumnByField" : "getColumnByIndex"](cellIndex), current = ej.getObject(["currentViewData", (isGrouped ? ".records" : "")].join(""), this.model),
                edited = {}, dm = isVirtualized ? this._dataManager : new ej.DataManager(current),
                key = this._primaryKeys[0], keyValue = byField || ej.getObject(rowIndex + "." + key, isVirtualized ? this._dataManager.dataSource.json : current),
                editedValue = value, valid = false;

            ej.createObject(column.field, value, edited);

            if (byField) {
                keyValue = rowIndex;
                rowIndex = dm.executeLocal(new ej.Query().select(key)).indexOf(rowIndex);
                cellIndex = this.getColumnIndexByField(column.field);
            }
            if (isVirtualized) {
                var pageSize = this.model.pageSettings.pageSize, page, name, mod = rowIndex % pageSize, isCached;
                page = (rowIndex + pageSize - mod)/ pageSize;        
                name = (page - 1) * pageSize; isCached = $.inArray(name, this.virtualLoadedPages) != -1
                if (isCached) {
                    cell = this.getContentTable().find("tr[name=" + name + "]")[mod].cells[cellIndex];
                }
            }

            var tr = this._excludeDetailRows()[rowIndex], proxy = this;
            if (!ej.isNullOrUndefined(column) && !column.isPrimaryKey && column.allowEditing != false) {

                if (!ej.isNullOrUndefined(column.validationRules)) {

                    var $form = ej.buildTag("form", "", {}, { id: this._id + "EditForm" }), $valElem = ej.buildTag("input", "", {}, { id: this._id + column.field, value: value, name: column.field });
                    $form.addClass("gridform");
                    $form.append($valElem);
                    this.element.append($form);
                    $form.validate({
                        errorPlacement: function (error, element) {
                            if (!proxy._alertDialog) proxy._renderAlertDialog();
                            $("#" + proxy._id + "AlertDialog_wrapper").css("min-height", "");
                            proxy._alertDialog.find(".e-content").text(error.text());
                            proxy._alertDialog.ejDialog("open");
                            proxy.element.find($form).remove();
                            valid = true;
                            return true;
                        },
                    });
                    this.setValidationToField(column.field, column.validationRules);
                }
                if (!ej.isNullOrUndefined(column.format)) {
                    var formattedValue = this.formatting(column.format, column.foreignKeyValue ?
                                                (!isNaN(parseFloat(value)) && isFinite(value)
                                                ? parseFloat(value)
                                                : value) : value, this.model.locale);
                    editedValue = formattedValue;
                }
                if (!ej.isNullOrUndefined(column.validationRules)) {
                    $($form).validate().form();
                    this.element.find($form).remove();
                }
                if (!valid) {
                    var canSkip = rowIndex == -1 || cellIndex == -1 || (isVirtualized && !isCached)
                       || rowIndex > (isVirtualized ? this._dataSource() : current).length || cellIndex > this.model.columns.length;
                    if (!canSkip) { /*Skip when not in current page*/
                        if (this.model.scrollSettings.frozenColumns)
                            cell = this._frozenCell(rowIndex, cellIndex)[0];
                        else
                            cell = cell || this._excludeDetailCells(rows[rowIndex])[cellIndex];
                        value = column.format === undefined ? value : this.formatting(column.format, value, this.model.locale);
                        if (!ej.isNullOrUndefined(column.foreignKeyField) && !ej.isNullOrUndefined(column.foreignKeyValue))
                            value = this._getForeignKeyData(edited)[column.foreignKeyField][column.foreignKeyValue];
                        if (column.disableHtmlEncode)
                            $(cell).text(value);
                        else
                            cell.innerHTML = value;
                        this._trigger("queryCellInfo", { cell: cell, text: cell.innerHTML, column: column, data: edited });
                    }
                    if (key) {
                        ej.createObject(key, keyValue, edited);
                        this._dataManager.update(key, edited);
                    }
                }
            }
        },
        _excludeDetailCells: function ($tr) {
            var $gridCells;
            if (!ej.isNullOrUndefined(this.model.detailsTemplate || this.model.childGrid || this.model.showSummary))
                $gridCells = $($tr.cells).not(".e-detailrowexpand, .e-detailrowcollapse");
            else
                $gridCells = $($tr.cells);
            return $gridCells;
        },
        setCellValue: function (index, fieldName, cellValue) {
            if ($("#" + this._id + "EditForm").length > 0)
                $("#" + this._id + "EditForm").attr("id", "EditForm1");
            if (this.model.editSettings.editMode == "batch" && !this.model.scrollSettings.allowVirtualScrolling && !this.model.scrollSettings.frozenColumns) {
                var data = this.getDataByIndex(index), tr = this._excludeDetailRows()[index], dataIndex, columnIndex = this.getColumnIndexByField(fieldName), proxy = this, editedValue = cellValue, valid = false;
                var column = this.getColumnByField(fieldName), editedTd;
                if ($(tr).hasClass("e-insertedrow"))
                    editedTd = $(tr.cells).not(".e-detailrowcollapse, .e-detailrowexpand")[columnIndex + this.model.groupSettings.groupedColumns.length];
                else
                    editedTd = $(tr.cells).not(".e-detailrowcollapse, .e-detailrowexpand")[columnIndex];
                if (!ej.isNullOrUndefined(column) && !column.isPrimaryKey && column.allowEditing != false) {
                    if (!ej.isNullOrUndefined(column.validationRules)) {/*Check for validation*/
                        var $form = ej.buildTag("form", "", {}, { id: this._id + "EditForm" }), $valElem = ej.buildTag("input", "", {}, { id: this._id + column.field, value: cellValue, name: column.field });
                        $form.append($valElem);
                        this.element.append($form);
                        $form.validate({/*Validate the form*/
                            errorPlacement: function (error, element) {
                                if (!proxy._alertDialog) proxy._renderAlertDialog();
                                $("#" + proxy._id + "AlertDialog_wrapper").css("min-height", "");
                                proxy._alertDialog.find(".e-content").text(error.text());
                                proxy._alertDialog.ejDialog("open");
                                proxy.element.find($form).remove();
                                valid = true;
                                return true;
                            },
                        });
                        this.setValidationToField(column.field, column.validationRules);
                    }

                    if (column.foreignKeyValue) {
                        editedValue = this._foreignKeyBinding(columnIndex, cellValue, this._id);/*Get the corresponding foreign key value*/

                        if (editedValue == undefined) {
                            if (!this._alertDialog) this._renderAlertDialog();
                            $("#" + this._id + "AlertDialog_wrapper").css("min-height", "");
                            this._alertDialog.find(".e-content").text(this.localizedLabels.ForeignKeyAlert);
                            this._alertDialog.ejDialog("open");
                            if (!ej.isNullOrUndefined(column.validationRules)) this.element.find($form).remove();
                            return;
                        }
                    }

                    if (!ej.isNullOrUndefined(column.format)) {/*Get the formatted value*/
                        var formattedValue = this.formatting(column.format, column.foreignKeyValue ?
                                                    (!isNaN(parseFloat(cellValue)) && isFinite(cellValue)
                                                    ? parseFloat(cellValue)
                                                    : cellValue) : cellValue, this.model.locale);
                        editedValue = formattedValue;
                    }
                    


                    if (!ej.isNullOrUndefined(column.validationRules)) {
                        $($form).validate().form();
                        this.element.find($form).remove();
                    }
                    $("#EditForm1").attr("id", this._id + "EditForm");
                    if (!valid && editedTd.innerHTML != editedValue) {
                        if ($(editedTd).has("form").length > 0) this.model.isEdit = false;
                        if ($(editedTd).hasClass("e-boolrowcell"))
                            $(editedTd).find("input").attr("checked", editedValue);
                        else
                            editedTd.innerHTML = editedValue;
                        $(editedTd).addClass("e-updatedtd e-icon e-gupdatenotify");
                        $(editedTd).removeClass("e-validError e-editedbatchcell");
                        ej.createObject(fieldName, cellValue, data);
                        $.inArray(data, this.batchChanges.changed) == -1 && this.batchChanges.changed.push(data);
                        this._enableSaveCancel();
                    }
                }
            }
        },
        setDefaultData: function (defaultData) {
            if (ej.isNullOrUndefined(defaultData)) {
                var fieldNames = [];
                var columns = this.model.columns;
                for (var column = 0; column < this.model.columns.length; column++)
                    fieldNames.push(this.model.columns[column]["field"]);
                if (ej.isNullOrUndefined(this._bulkEditCellDetails._data))
                    this._bulkEditCellDetails._data = [];
                defaultData = {};
                var setter = function (field, value) { ej.createObject(field, value, defaultData) };
                for (var i = 0; i < fieldNames.length; i++) {
                    var index = i, field = fieldNames[i], columnType = columns[i].type, val = ej.getObject(field, this._bulkEditCellDetails._data[0]);
                    var isChild = !ej.isNullOrUndefined(this.model.parentDetails) ? this.model.parentDetails.parentKeyField : null;
                    if (field === isChild)
                        this.model.columns[index].defaultValue = this.model.parentDetails.parentKeyFieldValue;
                    if (!ej.isNullOrUndefined(this.model.columns[index]["defaultValue"])) {
                        setter(field, this.model.columns[index]["defaultValue"]);
                    }
                    else {
                        switch (columnType) {
                            case "number":
                                setter(field, 0);
                                break;
                            case "string":
                                setter(field, null);
                                break;
                            case "boolean":
                                setter(field, false);
                                break;
                            case "object":
                                if ($.isArray(val))
                                    setter(field, new Array());
                                else
                                    setter(field, null);
                            case "datetime":
                            case "date":
                                setter(field, null);
                        }
                    }
                }
                if (!ej.isNullOrUndefined(this.model.queryString)) {
                    var keyField = this.model.foreignKeyField || this.model.queryString;
                    defaultData[keyField] = this.model.parentDetails.parentRowData[this.model.queryString]
                }
            }
            this._bulkEditCellDetails.defaultData = defaultData;
        },
        _bulkDelete: function (index) {
            if (this.model.editSettings.allowDeleting) {
                if (ej.isNullOrUndefined(index))
                    index = this._selectedRow();
                if (index == -1) {
                    alert(this.localizedLabels.DeleteOperationAlert);
                    return;
                }
                var tr, $tr, data, args = {};
                if (this.multiDeleteMode && this.selectedRowsIndexes.length > 1) {
                    data = [];
                    $tr = this.getSelectedRows();
                    Array.prototype.push.apply(data, this.getSelectedRecords());
                    Array.prototype.push.apply(this.batchChanges.deleted, this.getSelectedRecords());
                }
                else
                    tr = this.getRows()[index], $tr = $(tr), data = this.getDataByIndex(index);
                args = {
                    primaryKey: this._primaryKeys,
                    rowIndex: index,
                    rowData: data,
                    row: $tr
                };
                if (this._trigger("beforeBatchDelete", args))
                    return;
				if(this.isejObservableArray)                   
                    this._refreshViewModel(args, "remove");
                if (this.model.isEdit)
                     this.cancelEditCell();
                if ($tr.hasClass("e-insertedrow")) {
                    $tr.remove();
                    index = $.inArray(tr, this._bulkEditCellDetails.insertedTrCollection);
                    if (index != -1) {
                        this._bulkEditCellDetails.insertedTrCollection.splice(index, 1);
                        this.batchChanges.added.splice(index, 1);
                    }
                }
                else {
                    $tr.hide();
					if(args.rowIndex == 0 || $tr.hasClass("e-firstrow")){
						$tr.hasClass("e-firstrow") && this.getContentTable().find("tr").removeClass("e-firstrow");
						this.getContentTable().find("tr:visible").first().addClass("e-firstrow");
					}
                    if (!$.isArray(data))
                        this.batchChanges.deleted.push(data);
                }
                this._gridRows = this.getContentTable().find("td.e-rowcell").closest("tr").toArray();
				if (this.model.allowScrolling)
                  this._refreshScroller(args);
			  this._isBatchDeleteApplied = true;
                this._enableSaveCancel();
                this._selectedRow(-1);
                args = {
                    primaryKey: this._primaryKeys,
                    rowIndex: index,
                    rowData: data
                };
                this._trigger("batchDelete", args);
            }
        },
        _bulkAddRow: function (defaultData) {
            var  $form = $("#" + this._id + "EditForm");
            if ($form.length && !this.editFormValidate())
                return true;
            if (this.model.editSettings.allowAdding) {
                this._isAddNew = true;
                var args = {}, $tr, editCellIndex, rows = this.getRows();
                if (!ej.isNullOrUndefined(defaultData))
                    this._bulkEditCellDetails.defaultData = defaultData;
                ej.isNullOrUndefined(this._bulkEditCellDetails.defaultData) && this.setDefaultData();
                args = {
                    defaultData: $.extend(true, {}, this._bulkEditCellDetails.defaultData),
                    primaryKey: this._primaryKeys,
                };
                if (this._trigger("beforeBatchAdd", args))
                    return;
                $tr = $($.render[this._id + "_JSONTemplate"](args.defaultData)).addClass("e-insertedrow");
                rows != null && $(rows[0]).hasClass("e-alt_row") && $tr.removeClass("e-alt_row");
                if (this.model.editSettings.rowPosition == "top")
                    this.getContentTable().first().find('tbody').first().prepend($tr);
                else if (this.model.editSettings.rowPosition == "bottom")
                    this.getContentTable().first().find('tbody').first().append($tr);
                if (this._gridRecordsCount === 0)
                    this.getContentTable().find("tbody .emptyrecord").first().remove();
                this._gridRows = this.getContentTable().find("td.e-rowcell").closest("tr").toArray();
                for (var i = 0; i < this.model.groupSettings.groupedColumns.length; i++)
                    $tr.prepend(ej.buildTag("td.e-indentcell"));
                this._bulkEditCellDetails.insertedTrCollection.push($tr.get(0));
                this.batchChanges.added.push(args.defaultData);
                var rowindex = this._gridRows.length - 1;
                if (this.model.editSettings.rowPosition == "bottom") {
                    editCellIndex = this._findNextEditableCell(0);
                    this.selectRows(rowindex);
                    this.editCell(rowindex, this.model.columns[editCellIndex].field);
                }
                else {
                    editCellIndex = this._findNextEditableCell(0);
                    this.selectRows(0);
                    this.editCell(0, this.model.columns[editCellIndex].field);
                }
				if (this.model.allowScrolling)
                    this._refreshScroller(args);
                $tr.find(".e-rowcell").addClass("e-updatedtd e-icon e-gupdatenotify");
                this._enableSaveCancel();
                args = { defaultData: args.defaultData };
                $.extend(args, {
                    columnObject: this.model.columns[editCellIndex],
                    columnIndex: editCellIndex,
                    row: $tr,
                    primaryKey: this._primaryKeys,
                    cell: $($tr[0].cells[editCellIndex])
                });
                this._trigger("batchAdd", args);
                this._trigger("refresh", args);
            }
        },
        getDataByIndex: function (rowIndex) {
            var $tr = $(this._excludeDetailRows()[rowIndex]), insertedRowIndex, currentRowData, index;
            if ($tr.hasClass("e-insertedrow")) {
                insertedRowIndex = $.inArray($tr[0], this._bulkEditCellDetails.insertedTrCollection);
                return this.batchChanges.added[insertedRowIndex];
            }
            else
                return this._bulkEditCellDetails._data[this.model.editSettings.rowPosition == "top" ? rowIndex - this._bulkEditCellDetails.insertedTrCollection.length : rowIndex];

        },
        
        refreshBatchEditChanges: function () {
            this._bulkEditCellDetails = {
                cellValue: null,
                rowIndex: -1,
                _data: null,
                columnIndex: -1,
                fieldName: null,
                cellEditType: "",
                cancelSave: false,
                defaultData: null,
                insertedTrCollection: [],
                rowData: null,
                isForeignKey: false
            };
            this.batchChanges = {
                added: [],
                deleted: [],
                changed: []
            };
        },
        refreshBatchEditMode: function () {
            if (this.model.editSettings.editMode == "batch" || this._enableCheckSelect) {
                this.refreshBatchEditChanges();
                this._bulkEditCellDetails._data = $.extend(true, [], this.getCurrentViewData());
            }
        },
        
        batchCancel: function () {
            this.cancelEdit();
        },
        
        batchSave: function () {
            var args = {}, deferedObject, gridObject = this;
			var index=(this.model.editSettings.rowPosition == "top" || this._gridRows == null)?0:this._gridRows.length - 1;
			this._batchCellValidation(index);
            if(!this.saveCell()){
            args["batchChanges"] = this.getBatchChanges();
            if (this._trigger("beforeBatchSave", args))
                return;
            args = {};
            args.requestType = "batchsave";
            this._isAddNew = false;
            this._sendBulkReuqest(this.getBatchChanges(), args);
		  }
        },
        _sendBulkReuqest: function (batchChanges, args) {
            var deferedObject = this._dataManager.saveChanges(batchChanges, this._primaryKeys[0], this.model.query._fromTable, this.model.query), gridObject = this;
            this._isBatchDeleteApplied=false;
			if (this._dataManager instanceof ej.DataManager && !this._dataManager.dataSource.offline) {
                deferedObject.done(function (e) {
                    gridObject._processBindings(args);
                });
                deferedObject.fail(function (e) {
                    var args = { error: e.error };
                    gridObject._trigger("actionFailure", args);
                });
            }
            else
                this._processBindings(args);

        },
        
        getBatchChanges: function () {
            return this.batchChanges;
        },
        
        editCell: function (index, fieldName) {
            if (this.element.ejWaitingPopup("model.showOnInit"))
                return;
            if (this.model.editSettings.allowEditing && $.inArray(fieldName, this._disabledEditableColumns) == -1) {
                var $form = $("#" + this._id + "EditForm");
                this.model.isEdit && this.saveCell();
                if ($.isFunction($.validator) && $form.length && $form.validate().errorList.length)
                    return;
                var $targetTR = $(this._excludeDetailRows()[index]), columnIndex = this.getColumnIndexByField(fieldName), $targetTd = $targetTR.find(".e-rowcell").eq(columnIndex), column = this.model.columns[columnIndex], rowData = this.getDataByIndex(index);
                var args = {
                    validationRules: ej.isNullOrUndefined(column.validationRules) ? {} : $.extend(true, {}, column.validationRules),
                    columnName: column.field,
                    value: ej.getObject(ej.isNullOrUndefined(fieldName) ? "" : fieldName, rowData),
                    rowData: rowData,
                    row: $targetTR,
                    primaryKey: this._primaryKeys,
                    columnObject: column,
                    cell: $targetTd,
                    isForeignKey: !ej.isNullOrUndefined(column.foreignKeyValue) && this.model.editSettings.editMode == "batch" ? true : false,
                }, isEditable = true;
                if (this.model.allowTextWrap)
                    this.element.find(".e-rowcell").removeClass("e-nowrap");
                if (this.model.allowScrolling)
                    this._refreshScroller(args);
                this._batchEditRowData = rowData;
                if (this._trigger("cellEdit", args))
                    return;
                if ($targetTR.hasClass("e-insertedrow")) args.requestType = "add";
                if ($.inArray(fieldName, this._primaryKeys) != -1 || args.columnObject.allowEditing === false || ((args.columnObject.template || args.columnObject.type=="checkbox") && (args.columnObject["allowEditing"] == false || !args.columnObject["field"])) || args.columnObject.commands) {
                    $.extend(this._bulkEditCellDetails, {
                        cellValue: args.value,
                        rowIndex: index,
                        fieldName: fieldName,
                        rowData: args.rowData,
                        columnIndex: columnIndex,
                        isForeignKey: ej.isNullOrUndefined(args.columnObject.foreignKeyValue) ? false : true
                    });
                    isEditable = false;
                }
                if ($targetTR.hasClass("e-insertedrow") && (args.columnObject.isPrimaryKey))
                    isEditable = true;
                if (isEditable) {
                    $.extend(this._bulkEditCellDetails, {
                        rowIndex: index,
                        cellValue: args.value,
                        columnIndex: columnIndex,
                        format: column.format == undefined ? null : column.format,
                        type: column.type,
                        fieldName: fieldName,
                        cellEditType: args.columnObject.editType,
                        rowData: rowData,
                        isForeignKey: ej.isNullOrUndefined(args.columnObject.foreignKeyValue) ? false : true
                    });
                    this._renderBulkEditObject(args, $targetTd);
                    $targetTR.addClass("e-editedrow").addClass("e-batchrow");
                    args.cell.addClass("e-editedbatchcell");
                    if (args.columnObject.editType == "booleanedit")
                        args.cell.addClass("e-boolrowcell");
                }
            }
        },
        _findNextEditableCell: function (columnIndex) {
            var endIndex = this.model.columns.length;
            for (var i = columnIndex; i < endIndex; i++) {
                if (!this.model.columns[i].template && !this.model.columns[i].commands && this.model.columns[i].visible)
                    return i;
            }
            return -1;
        },
        _findNextCell: function (columnIndex, direction, event) {
            var splittedColumn, visibleColumns = [], predicate, rows = this.getRows();
			if (this.model.columns[columnIndex].template) 
                this.model.columns[columnIndex].__isTemplate = true;  
			if(this.model.columns[columnIndex].commands)
				this.model.columns[columnIndex].__isCommand = true; 
			if (!ej.isNullOrUndefined(event) && (event.keyCode == 39 || event.keyCode == 37))
			   predicate = ej.Predicate("visible", "equal", true);
		    else
               predicate = ej.Predicate("visible", "equal", true).and("__isTemplate", "notequal", true).and("__isCommand", "notequal", true).and("allowEditing", "notequal", false).and("isPrimaryKey", "notequal", true);
            splittedColumn = direction == "right" ? this.model.columns.slice(columnIndex) : this.model.columns.slice(0, columnIndex + 1).reverse();
            visibleColumns = ej.DataManager(splittedColumn).executeLocal(ej.Query().where(predicate));
            if (visibleColumns.length == 0 && (!(direction == "left" && this._bulkEditCellDetails.rowIndex == 0) && !(direction == "right" && this._bulkEditCellDetails.rowIndex + 1 == this.getRows().length))) {
                splittedColumn = direction == "right" ? this.model.columns.slice(0, columnIndex) : this.model.columns.slice(columnIndex).reverse();
                visibleColumns = ej.DataManager(splittedColumn).executeLocal(ej.Query().where(predicate));
                this._bulkEditCellDetails.rowIndex = visibleColumns.length && direction == "right" ? this._bulkEditCellDetails.rowIndex + 1 : this._bulkEditCellDetails.rowIndex - 1;
            }
            return visibleColumns.length ? $.inArray(visibleColumns[0], this.model.columns) : -1;
        },
        _moveCurrentCell: function (direction, event) {
            var editCellIndex, rowIndex = this._bulkEditCellDetails.rowIndex, currentRow, $form = $("#" + this._id + "EditForm");
            if (this._bulkEditCellDetails.rowIndex == -1 && this._bulkEditCellDetails.columnIndex == -1)
                return true;
            switch (direction) {
                case "right":
                    if ((this._bulkEditCellDetails.rowIndex == this.getRows().length - 1 && this._bulkEditCellDetails.columnIndex == this.model.columns.length - 1) || (!this.element.is(document.activeElement) && !this.getContent().is(document.activeElement) && $form.length == 0))
                        return true;
                    if (this._bulkEditCellDetails.columnIndex == this.model.columns.length - 1) {
                        editCellIndex = 0;
                        this._bulkEditCellDetails.rowIndex = this._bulkEditCellDetails.rowIndex + 1;
                    }
                    else
                        editCellIndex = this._bulkEditCellDetails.columnIndex + 1;
                    if ((!ej.isNullOrUndefined(this.model.columns[editCellIndex].template) && ej.isNullOrUndefined(this.model.columns[editCellIndex].field)) || !ej.isNullOrUndefined(this.model.columns[editCellIndex].commands) || this.model.columns[editCellIndex].visible === false || this.model.columns[editCellIndex].allowEditing === false)
                        editCellIndex = this._findNextCell(editCellIndex, direction, event);
                    this._bulkEditCellDetails.rowIndex != rowIndex && this.selectRows(this._bulkEditCellDetails.rowIndex);
                    editCellIndex != -1 && this.editCell(this._bulkEditCellDetails.rowIndex, this.model.columns[editCellIndex].field);
                    break;
                case "left":
                    if ((this._bulkEditCellDetails.rowIndex == 0 && this._bulkEditCellDetails.columnIndex == 0) || (!this.element.is(document.activeElement) && $form.length == 0))
                        return true;
                    if (this._bulkEditCellDetails.columnIndex == 0) {
                        editCellIndex = this.model.columns.length - 1;
                        this._bulkEditCellDetails.rowIndex = this._bulkEditCellDetails.rowIndex - 1;
                        this.selectRows(this._bulkEditCellDetails.rowIndex);
                    }
                    else
                        editCellIndex = this._bulkEditCellDetails.columnIndex - 1;
                    if ((!ej.isNullOrUndefined(this.model.columns[editCellIndex].template) && ej.isNullOrUndefined(this.model.columns[editCellIndex].field)) || !ej.isNullOrUndefined(this.model.columns[editCellIndex].commands) || this.model.columns[editCellIndex].visible === false || this.model.columns[editCellIndex].allowEditing === false)
                        editCellIndex = this._findNextCell(editCellIndex, direction, event);
                    this._bulkEditCellDetails.rowIndex != rowIndex && this.selectRows(this._bulkEditCellDetails.rowIndex);
                    editCellIndex != -1 && this.editCell(this._bulkEditCellDetails.rowIndex, this.model.columns[editCellIndex].field);
                    break;
                case "up":
                    if (this._bulkEditCellDetails.rowIndex == 0)
                        return;
                    editCellIndex = this._bulkEditCellDetails.columnIndex;
                    !this._enableCheckSelect && this.selectRows(this._bulkEditCellDetails.rowIndex - 1);
                    this.editCell(this._bulkEditCellDetails.rowIndex - 1, this.model.columns[this._bulkEditCellDetails.columnIndex].field);
                    break;
                case "down":
                    if (this._bulkEditCellDetails.rowIndex == this.getRows().length - 1) {
                        this.endEdit();
                        return;
                    }
                    editCellIndex = this._bulkEditCellDetails.columnIndex;
                    !this._enableCheckSelect && this.selectRows(this._bulkEditCellDetails.rowIndex + 1);
                    if (this._bulkEditCellDetails.columnIndex != -1) {
                        this.editCell(this._bulkEditCellDetails.rowIndex + 1, this.model.columns[this._bulkEditCellDetails.columnIndex].field);
                        this.selectCells([[this._bulkEditCellDetails.rowIndex, this._bulkEditCellDetails.columnIndex]]);
                    }
                    break;

            }
            var addedRow = !$(this.getRows()[this._bulkEditCellDetails.rowIndex]).hasClass("e-insertedrow");
            if (editCellIndex != -1 && (this.model.columns[editCellIndex].commands || (this.model.columns[editCellIndex].isPrimaryKey && addedRow && !ej.isNullOrUndefined(event) && event.key == "Tab") || (this.model.columns[editCellIndex].template && this.model.columns[editCellIndex].field == "")))
                this.element.focus();
            return false;
        },
        _renderBulkEditObject: function (cellEditArgs, $td) {
            var $form = ej.buildTag("form", "", {}, { id: this._id + "EditForm" }), $bulkEditTemplate = this._bulkEditTemplate, mappingName = this._id + cellEditArgs.columnObject.field, $element, htmlString, cellData = {};
            ej.createObject(cellEditArgs.columnObject.field, cellEditArgs.value, cellData);
            var args = { requestType: cellEditArgs.requestType, cell:cellEditArgs.cell, columnName:cellEditArgs.columnName,rowData:cellEditArgs.rowData,row:cellEditArgs.row };
            $td.empty();
            if (!$td.parent().is(":last-child")){
                $td.addClass('e-validError');
                $td.removeClass('e-gupdatenotify');
             }
            htmlString = $bulkEditTemplate.find("#" + cellEditArgs.columnObject.field.replace(/[^a-z0-9\s_]/gi, ej.pvt.consts.complexPropertyMerge) + "_BulkEdit").html();
            $element = $($.templates(htmlString).render(cellData));
            if ($element.get(0).tagName == "SELECT") {
                var cellValue = ej.getObject(cellEditArgs.columnObject.field, cellData);
                $element.val(ej.isNullOrUndefined(cellValue) ? "" : cellValue.toString());
                $element.val() == null && $element.val($element.find("option").first().val());
                $element.data('ej-value', cellValue);
            }
            $form.append($element);
            $td.append($form);
            this._setoffsetWidth();
            this._refreshEditForm(args);
            if ($.isFunction($.validator) && !$.isEmptyObject(cellEditArgs.validationRules)) {
                this.initValidator();
                this.setValidationToField(cellEditArgs.columnObject.field, cellEditArgs.validationRules);
            }
            this.model.isEdit = true;
        },
        _triggerConfirm: function (args) {
            if (args !== undefined && args.model.text == this._getDeprecatedLocalizedLabel("OKButton")) {
                if (this._confirmDialog.find(".e-content").text() == this.localizedLabels.BatchSaveConfirm)
                    this.batchSave();
                else if (this._confirmDialog.find(".e-content").text() == this.localizedLabels.ConfirmDelete) {
                    if (this.model.editSettings.editMode == "batch")
                        this._bulkDelete()
                    else {
                        if (this.multiDeleteMode)
                            this._multiRowDelete();
                      else
                        if (!ej.isNullOrUndefined(this._cDeleteData)) {
                            this.deleteRow(this._cDeleteData);
                            this._cDeleteData = null;
                          }
                        else
                            this.deleteRow();
                    }
                }
                else if (this._confirmDialog.find(".e-content").text() == this.localizedLabels.CancelEdit)
                    this.cancelEdit();
                else {
                    this._confirmedValue = true;
                    this._processBindings(this._requestArgs);
                }
				this._isBatchDeleteApplied=false;
				this.clearSelection();
            }
            else {
                if (this._confirmDialog.find(".e-content").text() != this.localizedLabels.BatchSaveConfirm && this._confirmDialog.find(".e-content").text() != this.localizedLabels.ConfirmDelete) {
                    if (this._confirmDialog.find(".e-content").text() != this.localizedLabels.CancelEdit) {
                        switch (this._requestArgs.requestType) {
                            case "grouping":
                                this.model.groupSettings.groupedColumns.pop();
                                break;
                            case "ungrouping":
                                this.model.groupSettings.groupedColumns.push(this._requestArgs.columnName);
                                break;
                            case "sorting":
                                this._cSortedDirection = this._cSortedColumn = null;
                                break
                            case "filtering":
                                this.model.filterSettings.filteredColumns.reverse().splice(0, this._requestArgs.currentFilterObject);
                                this.model.filterSettings.filteredColumns.reverse();
                                break;
                            case "paging":
                                this._currentPage(this._requestArgs.previousPage);
                                this.getPager().ejPager("model.currentPage", this._requestArgs.previousPage);
                                break

                        }
                    }
                }
                this._confirmedValue = false;
            }
            this._requestArgs = null;
            this._confirmDialog.ejDialog("close");
        },
        _batchCellValidation: function (index, targetColIndex) {
            var $row = this.getRowByIndex(index),i;
            if (this.model.editSettings.editMode=="batch" && this.model.isEdit && $row.hasClass('e-insertedrow') ){              
                for (i = 0; i < this._validatedColumns.length; i++) {
                    var colindex = this.getColumnIndexByField(this._validatedColumns[i])
                        if (!this.editFormValidate())
                            return true;                         
                 this.editCell(index, this.model.columns[colindex].field);                          
                }
             }
         },
        _saveCellHandler: function (e) {
            var $target = $(e.target);
            var targetColIndex = $($target).index();
            e.stopPropagation();
            var index=(this.model.editSettings.rowPosition == "top" || this._gridRows == null)?0:this._gridRows.length - 1;
            if ($target.closest(".e-popup").length == 0 && $target.closest(".e-rowcell").find("#" + this._id + "EditForm").length == 0) {
                if ($(this.getRows()).hasClass("e-insertedrow"))
                    this._batchCellValidation(index, targetColIndex);
                this.saveCell();
            }
        },
        initValidator: function () {
            var gridObject = this, elements = this.model.scrollSettings.frozenColumns > 0 || this.model.editSettings.showAddNewRow ? this.element.find(".gridform") : $("#" + this._id + "EditForm");
            for (var i = 0; i < elements.length ; i++) {
                elements.eq(i).validate({
                    ignore: ".e-hide",
                    errorClass: 'e-field-validation-error',
                    errorElement: 'div',
                    wrapper: "div",
                    errorPlacement: function (error, element) {
                        gridObject._renderValidator(error, element);
                    },

                });
            }
        },
        _renderValidator: function (error, element) {          
            if (element.is(":hidden"))
                element = element.siblings("input:visible");
            if (!element.length)
                return;
            var $td = element.closest(".e-rowcell"), $container = $(error).addClass("e-error"),
             $tail = ej.buildTag("div.e-errortail e-toparrow");
            var isScrolling = this.model.isResponsive || this.model.allowScrolling;
            var scrollObj = !ej.isNullOrUndefined(this.getContent().data("ejScroller")) ? this.getScrollObject() : null; var scrollTop = 0;
            $td = !$td.length ? $td = element.closest("td") : $td;
            $td.find(".e-error").remove();

            if (element.parent().hasClass("e-in-wrap"))
                $container.insertAfter(element.closest(".e-widget"));
            else
                $container.insertAfter(element);
            var doInvert = (this.model.scrollSettings.frozenRows > 0 && (this._currentTrIndex >= this.model.scrollSettings.frozenRows)) ? true : false
            var operation = doInvert ? "append" : "prepend";
            $container[operation]($tail);
            if (isScrolling && (!ej.isNullOrUndefined(scrollObj) && (scrollObj._hScrollbar || scrollObj._vScrollbar))) {
                $td.addClass("e-validError");
                scrollTop = scrollObj._hScrollbar ? scrollObj._hScrollbar.element[0].offsetTop : 0;
            }
            var heightExpected = $td[0].offsetTop + $td[0].offsetHeight + error[0].offsetHeight;
            var eleExceed = false, hScrollerSize = scrollObj && scrollObj._hScrollbar ? scrollObj._hScrollbar.model.height : 0;
            if ((scrollObj && scrollObj.isHScroll() && heightExpected > scrollTop) || (heightExpected > (this.getContent()[0].offsetTop + this.getContent().find(".e-content").height())))
                eleExceed = true;
            if (!isScrolling || !(!ej.isNullOrUndefined(scrollObj) && (scrollObj._hScrollbar || scrollObj._vScrollbar))) {
                var rect = error[0].getBoundingClientRect();
                var errorWidth = rect ? rect.width : error.width();
                if (errorWidth < $td.width())
                    error.width(errorWidth);
                else
                    error.width($td.width());
                element.closest(".e-validError").removeClass("e-validError");
            }
            if (this.model.enableRTL)
                this.model.editSettings.editMode != "dialog" && $container.offset({ top: element.offset().top + element.height() });
            else
                this.model.editSettings.editMode != "dialog" && $container.offset({ left: element.offset().left, top: element.offset().top + element.height() });
            if (this.model.scrollSettings.frozenRows <= 0 && $.inArray(this.model.editSettings.editMode, ["externalform", "externalformtemplate", "dialog", "dialogtemplate"]) == -1) {
                var content = this.getContent();
                var scrollContent = content.find(".e-content");
                var cntHeight = scrollContent.height();
                var contentTop = content[0].offsetTop;
                if (eleExceed && scrollObj != null && scrollObj._vScrollbar && (this.model.scrollSettings.frozenColumns)) {
                    var val = scrollObj._vScrollbar.model.value - (heightExpected - (contentTop + scrollContent[0].scrollHeight));
                    var contentScrollHeight = contentTop + scrollContent[0].scrollHeight;
                    var contentHeight = contentTop + cntHeight;
                    if ((!this.model.scrollSettings.frozenColumns && heightExpected > contentScrollHeight) || (this.model.scrollSettings.frozenColumns && heightExpected > contentHeight)) {
                        scrollObj._vScrollbar.model.maximum += (heightExpected - (contentTop + cntHeight));;
                        scrollObj._vScrollbar.refresh(true);
                    }
                    if (this.model.scrollSettings.frozenColumns) {
                        var movableContent = this.getContent().find(".e-movablecontent");
                        movableContent.height(movableContent[0].scrollHeight);
                    }
                    scrollObj.scrollY(element.offset().top - contentTop + scrollContent[0].scrollTop);
                }
                else if (eleExceed && isScrolling && scrollObj != null) {
                    if (!scrollObj.isVScroll()) {
                        var eleHeight = heightExpected - (contentTop + cntHeight);
                        scrollContent.height(cntHeight + eleHeight);
                    }
                    else if (scrollObj.isVScroll()) {
                        scrollObj.refresh();
                        this._showHideScroller();
                        if (scrollObj._vScroll) {
                            var value = scrollObj._vScrollbar.model.value + (heightExpected - (contentTop + cntHeight + hScrollerSize - hScrollerSize));
                            scrollObj.scrollY(value);
                        }
                    }
                }
            }
            else if (doInvert) {
				if(eleExceed){
					var top = $container.css('top');
					$tail.addClass("e-bottomarrow");
					$container.css({
						'bottom': top,
						'top': 'auto'
					});
				}
				else{
					$tail.prependTo($tail.parent());
				}
            }
            $container.show("slow");
        },

        setValidation: function () {
            for (var i = 0; i < this.model.columns.length; i++) {
                if (!ej.isNullOrUndefined(this.model.columns[i]["validationRules"])) {
                    this.setValidationToField(this.model.columns[i].field, this.model.columns[i].validationRules);
                }
            }
        },
        
        setValidationToField: function (name, rules) {
            var fName = name, ele;
            if (!ej.isNullOrUndefined(name))
                fName = fName.replace(/[^a-z0-9\s_]/gi, '');
            if (this.model.editSettings.editMode == "batch")
                var form = this.element.find("#" + this._id + "EditForm");
            else if(this.model.editSettings.showAddNewRow)
                var form = $(this.getRows()).hasClass("e-editedrow") ? this.element.find(".e-editedrow .gridform") : this.element.find(".e-addedrow .gridform");
            else
                var form = this.element.find(".gridform");
            ele = /^[a-zA-Z0-9- ]*$/.test(name) ?  form.find("[name=" + fName + "]") : form.find("#" + this._id + fName);
            if (!ej.isNullOrUndefined(ele.attr("id")) && ele.attr("id").indexOf("hidden") != -1)
                ele = form.find("#" + this._id + fName);
            if(ele.length == 0) 
               ele = form.find("#" + fName);
            if (rules["regex"]) {
                rules[name + "regex"] = rules["regex"]; delete rules["regex"];
                $.validator.addMethod(fName + "regex", function (value, element, options) {
                    var ptn = options instanceof RegExp ? options : new RegExp(options);
                    return ptn.test(value);
                }, ej.getObject("messages.regex", rules) || this.getColumnByField(name).headerText + " should match the given pattern");
            }
            !ele.attr("name") && ele.attr("name", name);
            ele.rules("add", rules);
            var validator = $("#" + this._id + "EditForm").validate();
            validator.settings.messages[name] = validator.settings.messages[name] || {};
            if (!ej.isNullOrUndefined(rules["required"])) {
                if (!ej.isNullOrUndefined(rules["messages"] && rules["messages"]["required"]))
                    var message = rules["messages"]["required"];
                else
                    var message = $.validator.messages.required;
                if (message.indexOf("This field") == 0)
                    message = message.replace("This field", this.getColumnByField(name).headerText);               
                validator.settings.messages[name]["required"] = message;
                if (ele.hasClass("e-datepicker"))
                    ele.ejDatePicker({watermarkText: ""});
            }
        },
        _renderConfirmDialog: function () {
            var $contentDiv = ej.buildTag('div.e-content', this.localizedLabels.BatchSaveConfirm)
            , $buttons = ej.buildTag('span.e-buttons', '<input type="button" class="e-flat e-btnsub" id=' + this._id + "ConfirmDialogOK" + ' value="' + this._getDeprecatedLocalizedLabel("OKButton") + '" /> '
                + "<input type='button' class='e-flat e-btncan' id=" + this._id + 'ConfirmDialogCancel' + " value='" + this.localizedLabels.CancelButton + "' />");

            this._confirmDialog = ej.buildTag('div#' + this._id + 'ConfirmDialog', { float: "left" },{overflow:"hidden" });
            this._confirmDialog.append($contentDiv).append($buttons);
            this.element.append(this._confirmDialog);
            $buttons.find("input").ejButton({
                cssClass: this.model.cssClass,
                showRoundedCorner: true,
                size: "mini",
                click: $.proxy(this._triggerConfirm, this)
            });
            this._renderFDialog(this._id + 'ConfirmDialog');
            this._confirmDialog.ejDialog({ showOnInit: false, width: "auto", minWidth: 0, minHeight: 0, enableModal: true });
        },
        _unboundClickHandler: function (e) {
            var $target = $(e.target).closest("button");
            if (($target.hasClass("e-button") && ($target.hasClass("e-disable") || $target.prop("disabled"))) || $target.closest(".e-grid").attr("id") !== this._id) return;
            var $editTrLen = 0, params = {};
            if ($(e.target).hasClass("e-unboundcelldiv"))
                return;
            var index = $target.hasClass("e-savebutton") ? this.getIndexByRow($(".e-editedrow")) : this.getIndexByRow($target.closest("tr"));
            if (this.model.isEdit && (!this._isLocalData || this._isRemoteSaveAdaptor) && $target.hasClass("e-editbutton")) {
                this._unboundRow = $target.closest("tr");
                return;
            }
            var rowData = this._currentJsonData[index];
            var btnObj = $($target).ejButton("instance");
			 if (this.model.editSettings.editMode == "inlineform" || this.model.editSettings.editMode == "inlinetemplate")
                $editTrLen = $("#" + this._id).find(".e-editedrow").length;
            this.model.allowSelection && !this.model.isEdit && this.selectRows(this.getIndexByRow($target.closest("tr")) - $editTrLen);
            if ($target.hasClass("e-cancelbutton"))
                this.model.isEdit = false;
            $.isFunction($.fn.ejDatePicker) && $("#" + this._id + "EditForm").find(".e-datepicker").ejDatePicker("hide");
            if ($target.hasClass("e-editbutton") && this.model.editSettings.editMode != "batch") {
                if (this.model.isEdit)
                    this.cancelEdit();
                var $tr = this.getRowByIndex(index);
                this.startEdit($tr);
            } else if ($target.hasClass("e-deletebutton")) {
                var $tr = this.getRowByIndex(index);
                if (this.model.editSettings.showDeleteConfirmDialog && !this._isUnboundColumn) {
                    this._toolbarOperation(this._id + "_delete");
                    return;
                }
                this.deleteRow($tr);
            }
            else if ($target.hasClass("e-savebutton")) {
                this.endEdit();
                rowData = this._currentJsonData[index];
            }
            else if ($target.hasClass("e-cancelbutton"))
                this.cancelEdit();
            params = { rowIndex: index, data: rowData, buttonModel: btnObj.model, commandType: $target.val() };
            if (ej.raiseWebFormsServerEvents) {
                var serverArgs = { model: this.model, originalEventType: "commandButtonClick" };
                var clientArgs = params;
				if(!ej.isNullOrUndefined(this.model.serverEvents) && $.inArray("commandButtonClick",this.model.serverEvents) != -1)
                  ej.raiseWebFormsServerEvents("commandButtonClick", serverArgs, clientArgs);
            }
        },
          
        addRecord: function (data, serverChange) {
            if (this.model.editSettings.allowAdding && (this.element.find(".e-gridcontent .gridform").length == 0)) {
            if (data) {
                if (this.model.editSettings.editMode == "normal" || this.model.editSettings.editMode == "inlineform" || this.model.editSettings.editMode == "inlineformtemplate") {
                    var $addRow = ej.buildTag('tr.e-addedrow');
                    this.getContentTable().find('tbody').first().prepend($addRow);
                }
                var args = { data: data };
                args.action = "add";
                args.selectedRow = this._selectedRow();
                this._cAddedRecord = data;
                args.requestType = ej.Grid.Actions.Save;
                this._updateAction(args);
                args.selectedRow  != -1 && this.selectRows( args.selectedRow + 1)
                if (this._isUnboundColumn)
                    this._refreshUnboundTemplate(this.getContentTable());
                if (!serverChange) {
                    if ((this.model.editSettings.editMode == "normal" || this.model.editSettings.editMode == "inlineform" || this.model.editSettings.editMode == "inlineformtemplate") && this.model.allowPaging && this.model.pageSettings.pageSize < this.model.currentViewData.length && this.model.groupSettings.groupedColumns.length == 0 && !this.model.editSettings.showAddNewRow)
                        this.getContentTable().get(0).lastChild.removeChild(this.getContentTable().get(0).lastChild.lastChild);
                }
            } else
                    this._startAdd();
            }
        },
        
        updateRecord: function (keyField, data, action) {
            this._updateDeleteRecord(keyField, data, "update");
        },
        _updateDeleteRecord: function (keyField, data, action) {
            var dataMgr = ej.DataManager(this._currentJsonData), dataFilter = [], index, $row, $newrow;
            if (!ej.isNullOrUndefined(keyField))
                dataFilter = dataMgr.executeLocal(ej.Query().where(keyField, ej.FilterOperators.equal, ej.getObject(keyField,data)));
            if (dataFilter.length) {
                index = $.inArray(dataFilter[0], this._currentJsonData);
                var args = { data: data, rowData: data, requestType: ej.Grid.Actions.Save, previousData: dataFilter[0], rowIndex: index };
                var foreignKeyData = this._getForeignKeyData(args.data);
                if (!ej.isNullOrUndefined(foreignKeyData))
                    args.foreignKeyData = foreignKeyData;
                if ($(document.activeElement).closest('td.e-checkcell'))
                    args.checkboxTarget = document.activeElement;
                this._trigger("actionBegin", args);
                if (index != -1) {
                    $row = this.getRowByIndex(index);
                    if (action == "update") {
                        ej.copyObject(dataFilter[0], data);
                        if(this.model.scrollSettings.frozenColumns){
							var $frow = $($.render[this._id + "_JSONFrozenTemplate"](dataFilter))[0], $mrow = $($.render[this._id + "_JSONTemplate"](dataFilter))[0];
                            $row.hasClass("e-alt_row") ? ($row.find('td').hasClass('e-lastrowcell') ? $($frow).find('td').addClass("e-lastrowcell") && $($frow).addClass("e-alt_row") : $($frow).addClass("e-alt_row")) :$($frow).removeClass("e-alt_row");
                            $row.hasClass("e-alt_row") ? ($row.find('td').hasClass('e-lastrowcell') ? $($mrow).find('td').addClass("e-lastrowcell") && $($mrow).addClass("e-alt_row") : $($mrow).addClass("e-alt_row")) :$($mrow).removeClass("e-alt_row");                            $row[0].replaceWith($frow); $row[1].replaceWith($mrow);
                            $row[0].replaceWith($frow); $row[1].replaceWith($mrow);
                            var frozenRows = this.getContentTable().get(0).rows, movableRows = this.getContentTable().get(1).rows, height = 0;                            
                            if (this.model.scrollSettings.frozenRows)							
                            $(frozenRows[this.model.scrollSettings.frozenRows - 1].cells).add(movableRows[this.model.scrollSettings.frozenRows - 1].cells).addClass("e-frozeny").parent().addClass("e-frozenrow");                                                        
                            var frozenHeight = frozenRows[index].getClientRects()[0].height, movableHeight = movableRows[index].getClientRects()[0].height, height= ej.max([frozenHeight, movableHeight])
                            $(frozenRows[index]).height(height); $(movableRows[index]).height(height);
                        }
                        else{
                            $newrow = $($.render[this._id + "_JSONTemplate"](dataFilter));
                            $row.hasClass("e-alt_row") ? ($row.find('td').hasClass('e-lastrowcell') ? $newrow.find('td').addClass("e-lastrowcell") && $newrow.addClass("e-alt_row") : $newrow.addClass("e-alt_row")) : $newrow.removeClass("e-alt_row");
                            $row.replaceWith($newrow);
							if(this.model.scrollSettings.frozenRows){
								var gridRows = this.getRows();
							    $(gridRows[this.model.scrollSettings.frozenRows - 1].cells).addClass("e-frozeny").parent().addClass("e-frozenrow");
                            }
                        }
                        if (this._isUnboundColumn)
                            this._refreshUnboundTemplate(this.getContentTable());
                        if (this.model.editSettings.editMode == 'batch')
                            this.batchChanges.changed.push(dataFilter[0]);
                        else {
                            var promise = this._dataManager[action](keyField, data);
                            var proxy = this;
                            if (promise && $.isFunction(promise.promise)) {
                                promise.done(function (e) {
                                    if (proxy.model.editSettings.editMode != 'batch' && (proxy.model.sortSettings.sortedColumns.length || proxy.model.summaryRows.length > 0 || proxy.model.groupSettings.groupedColumns.length || !ej.isNullOrUndefined(proxy._searchCount) || proxy.filterColumnCollection.length))
                                        proxy._processBindings(args);
                                    else
                                        proxy._trigger("actionComplete", args);
                                });
                                promise.fail(function (e) {
                                    proxy._trigger("actionFailure", args);
                                });
                            }
                            else {
                                if (proxy.model.editSettings.editMode != 'batch' && (proxy.model.sortSettings.sortedColumns.length || proxy.model.summaryRows.length > 0 || proxy.model.groupSettings.groupedColumns.length || !ej.isNullOrUndefined(proxy._searchCount) || proxy.filterColumnCollection.length))
                                    proxy._processBindings(args);
                                else
                                    proxy._trigger("actionComplete", args);
                            }
                        }
                        if (this._isMapSelection) {
                            this._selectionByGrid = true;
                            this.multiSelectCtrlRequest = true;
                            data[this._selectionMapColumn] ? this.selectRows(index) : this.clearSelection(index);
                            this._selectionByGrid = false;
                        }
                    }
                    else {
                        if ($.inArray(index, this.selectedRowsIndexes)==-1) 
                            this.selectedRowsIndexes.push(index);
                        this.deleteRow($row);
                    }
                    if (this.model.editSettings.editMode == 'batch') {
                        this.batchSave();
                        this._confirmedValue=true;
                    }
                }
            }
            else {
                if (this.model.editSettings.editMode == 'batch') {
                    this.batchChanges[action == "update" ? "changed":"deleted"].push(data);
                    this.batchSave();
                    this._confirmedValue=true;
                }
                else
                    this._dataManager[action](keyField, data);
            }
           
        },
        
        deleteRecord: function (keyField, data) {
            this._updateDeleteRecord(keyField, data, "remove");
        },
    };
})(jQuery, Syncfusion);