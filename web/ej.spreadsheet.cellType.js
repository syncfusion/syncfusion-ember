(function ($, ej, undefined) {
	
    ej.spreadsheetFeatures = ej.spreadsheetFeatures || {};

    ej.spreadsheetFeatures.cellType = function (obj) {
        this.XLObj = obj;
		this._isIntrnlUpdate = false;
    };

    ej.spreadsheetFeatures.cellType.prototype = {
        _renderControls: function (rowIndex, colIndex, sheetIndex, cellType, isCntnrUpdated) {
            if (!cellType)
                return;
            var id, cell, data, cont, index, dataRange, xlObj = this.XLObj, browser = xlObj._browserDetails.name, actSheetIndex, sheetIdx = xlObj._getSheetIndex(sheetIndex), $cell = xlObj.getCell(rowIndex, colIndex, sheetIdx), sheet = xlObj.getSheet(sheetIdx), value = xlObj.XLEdit.getPropertyValue(rowIndex, colIndex, 'value2', sheetIdx), cntrl = cellType['type'], headerTxt = xlObj._generateHeaderText(colIndex + 1),
                container = xlObj._dataContainer.sheetCellType, width = xlObj._getColWidth(colIndex, sheetIndex), height = xlObj._getRowHeight(rowIndex, sheetIndex), propVal = xlObj.XLEdit.getPropertyValue(rowIndex, colIndex, 'cellType'), index = (propVal > -1) ? propVal : xlObj.getObjectLength(container);
			xlObj._textClip(rowIndex, colIndex, 'delete', '', true);
			xlObj._textClip(rowIndex, colIndex, 'add', '');
			if ($cell)
			    cell = $cell[0];
            xlObj.addClass(cell, 'e-cellreadonly');
			if(!xlObj._dupDetails)
				if(propVal)
					cellType['isChecked'] = container[index]['isChecked'];
				else
				    sheet.cellTypes.push({ 'range': xlObj._getAlphaRange(sheetIndex, rowIndex, colIndex, rowIndex, colIndex), 'settings': $.extend(true, {}, cellType) });
            switch (cntrl) {
                case 'Button':
                    id = xlObj._id + '_btn_' + sheetIdx + headerTxt + (rowIndex + 1);
					xlObj.XLFormat._writeCssRules('e-btncls' + rowIndex + colIndex , 'border: 0px; vertical-align: middle;padding: 0px;color:' + cellType['color'] + ';background:' + cellType['background-color'] + ';', true, true);
                    if (cell)
                        cell.innerHTML = '<button id =' + id + ' class = "e-btncls'+ rowIndex + colIndex + '"></button>';
					if (cell && (browser === 'mozilla' || browser === 'msie')) {
						xlObj.addClass(cell, 'e-btnhgt');
						xlObj.addClass($cell.parents('.e-table')[0],'e-btnhgt');
					}
                    if (!isCntnrUpdated) {
                        data = { 'type': cntrl, 'id': id, 'text': cellType['text'] || value || cellType['type'] + headerTxt + (rowIndex + 1), 'color': cellType['color'] || '', 'background-color': cellType['background-color'] || '' };
                        container[index] = data;
                        xlObj.XLEdit._updateDataContainer({ rowIndex: rowIndex, colIndex: colIndex }, { 'dataObj': { 'cellType': index }, 'sheetIdx': sheetIdx });
                    }
                    $('#' + id).ejButton({ type: "button", width: '100%', height: '100%', text: cellType['text'] || value || cellType['type'] + headerTxt + (rowIndex + 1), create: $.proxy(this._onButtonCreate), click: $.proxy(this.onButtonClick), cssClass: cellType['class'] || '' });
                    break;
                case 'CheckBox':
                    id = xlObj._id + '_chk_' + sheetIdx + headerTxt + (rowIndex + 1);
                    cell && (cell.innerHTML = '<input id =' + id + ' style = "" />');
                    if (!isCntnrUpdated) {
                        data = { 'type': cntrl, 'id': id, 'isChecked': (value && value.toLowerCase()) || cellType['isChecked'] || false };
 						container[index] = data;
						cont = xlObj.XLEdit._parseValue(data['isChecked'], { rowIndex: rowIndex, colIndex: colIndex });
						cont['cellType'] = index;
						xlObj.XLEdit._updateDataContainer({ rowIndex: rowIndex, colIndex: colIndex }, { 'dataObj': cont, 'sheetIdx': sheetIdx });
						cell && (cell.lastChild.textContent = '');
                    }
                    $('#' + id).ejCheckBox({ size: 'small', change: $.proxy(this.onActiveStateChange), checked: data ? (data['isChecked'].toString() == "true") : cellType['isChecked'], cssClass: cellType['class'] || '' });
                    break;
                case 'DropDownList':
					actSheetIndex = cellType['dataSourceSheetIndex'] || sheetIdx;
					id = xlObj._id + '_drpdwn_' + sheetIdx + headerTxt + (rowIndex + 1), dataRange = cellType['dataSourceRange'] && xlObj.getRangeIndices(cellType['dataSourceRange']);
					if (xlObj.element.find("#" + id).length > 0)
					    return;
					cell && (cell.innerHTML = '<input id =' + id + ' />');

                    if (actSheetIndex !== sheetIdx && !xlObj.getSheet(actSheetIndex)._isLoaded)
                        xlObj._initSheet(actSheetIndex);
                    if (xlObj.isUndefined(cellType["selectedIndex"]) && value) {
                        var dSrc, field, i;
                        dSrc = (cellType['dataSource'] || xlObj.getRangeData({ range: dataRange, sheetIdx: actSheetIndex }));
                        field = cellType['field'] = (cellType['field'] || 'value2');
                        i = dSrc.length;
                        while (--i >= 0) {
                            if (dSrc[i][field] == value) {
                                cellType["selectedIndex"] = i;
                                break;
                            }
                        }
                    }
                    if (!isCntnrUpdated) {
                        data = { 'type': cntrl, 'id': id, 'text': value, 'style': '', 'dataSource': cellType['dataSource'] || '', 'dataSourceRange': cellType['dataSourceRange'] || '', 'selectedIndex': cellType['selectedIndex'] > -1 ? cellType['selectedIndex'] : -1, 'dataSourceSheetIndex': actSheetIndex };
                        container[index] = data;
                        xlObj.XLEdit._updateDataContainer({ rowIndex: rowIndex, colIndex: colIndex }, { 'dataObj': { 'cellType': index }, 'sheetIdx': sheetIdx });
                    }
                    if(cellType['dataSourceRange']){
						var datacells = xlObj._getSelectedRange({ rowIndex: dataRange[0], colIndex: dataRange[1] }, { rowIndex: dataRange[2], colIndex: dataRange[3] }),  ddlCells = xlObj.XLEdit._getPropWithCellIdx([ datacells[0].rowIndex, datacells[0].colIndex, datacells[datacells.length - 1].rowIndex, datacells[datacells.length - 1].colIndex ], "ddlRange", actSheetIndex);
						if (ddlCells.length === 0)
							xlObj.updateUniqueData( { 'ddlRange': [{ rowIndex: rowIndex, colIndex: colIndex, sheetIndex: sheetIdx }] }, [ datacells[0].rowIndex, datacells[0].colIndex, datacells[datacells.length - 1].rowIndex, datacells[datacells.length - 1].colIndex ],'', actSheetIndex );
						else
							for(var j = 0; j < datacells.length; j++){
								ddlCells = xlObj.XLEdit.getPropertyValue(datacells[j].rowIndex, datacells[j].colIndex, 'ddlRange', actSheetIndex)
								if(ddlCells){
									ddlCells.push({ rowIndex: rowIndex, colIndex: colIndex });
									xlObj.XLEdit._updateDataContainer({ rowIndex: datacells[j].rowIndex, colIndex: datacells[j].colIndex }, { 'dataObj': {'ddlRange': ddlCells }, 'sheetIdx': actSheetIndex });
								}
								else
									xlObj.XLEdit._updateDataContainer({ rowIndex: datacells[j].rowIndex, colIndex: datacells[j].colIndex }, { 'dataObj': {'ddlRange': [{ rowIndex: rowIndex, colIndex: colIndex }]}, 'sheetIdx': actSheetIndex });
							}
					}
					$('#' + id).ejDropDownList({ loadOnDemand: true, width: '100%', height: xlObj.model.rowHeight - 1, change: $.proxy(this.onActiveValueChange), dataSource: cellType['dataSource'] || xlObj.getRangeData({ range : dataRange, sheetIdx : actSheetIndex }), fields: { text: cellType['field'] || 'value2' }, watermarkText: cellType['watermarkText'] || 'Select an option', cssClass: cellType['class'] || '' , selectedIndex: cellType['selectedIndex'] > -1 ? cellType['selectedIndex'] : -1, beforePopupShown: $.proxy(this._onBeforePopupOpen) });
                    break;
                case 'DatePicker':
                    id = xlObj._id + '_dp_' + sheetIdx + headerTxt + (rowIndex + 1);
                    cell && (cell.innerHTML = '<input id =' + id + ' style = "height:' + (height - 1) +'px" />');
                    if (!isCntnrUpdated) {
                        data = { 'type': cntrl, 'id': id, 'text': value, 'style': '' };
                        container[index] = data;
                        xlObj.XLEdit._updateDataContainer({ rowIndex: rowIndex, colIndex: colIndex }, { 'dataObj': { 'cellType': index }, 'sheetIdx': sheetIdx });
                    }
                    $('#' + id).ejDatePicker({ width: '100%', height: xlObj.model.rowHeight - 1, value: (value && ej.parseDate(value)) || cellType['value'] || new Date(), create: $.proxy(this._onDateCreate), change: $.proxy(this.onDateChange), cssClass: cellType['class'] || '', locale: xlObj.model.locale });
                    break;
            }
        },
		
		addCellTypes: function (range, settings, sheetIndex){
			var xlObj = this.XLObj;
			if(!xlObj.model.allowCellType)
			    return;
			if(xlObj.model.isReadOnly)
			    return;
			xlObj._isPublic = true;
			if(Array.isArray(range))
				range = xlObj._getAlphaRange(sheetIndex, range[0], range[1], range[2], range[3]);
			this._rangeCellTypes([{ 'range': range, 'settings': settings }], sheetIndex, true);
			xlObj._isPublic = false;
		},

        _rangeCellTypes: function (cellType, sheetIndex, isNew) {
            if (!cellType)
                return;
            var text, xlObj = this.XLObj, cont, headerTxt, actSheetIndex, refrshArr = [], browser = xlObj._browserDetails.name, sheetIdx = xlObj._getSheetIndex(sheetIndex), data, container = xlObj._dataContainer, cells, type, cell, id, dataRange, datacells, range, index, sheet = xlObj.getSheet(sheetIdx), celTypData,
			cellTypesLen = 0, rowIndex, colIndex;
			if(isNew || !sheet._isLoaded) {
				cellTypesLen = sheet.cellTypes.length;
				ej.merge(sheet.cellTypes, cellType);
				cellType = sheet.cellTypes;
			}
            for (var i = cellTypesLen, length = sheet.cellTypes.length; i < length; i++) {
                range = xlObj.getRangeIndices(cellType[i]['range']), type = cellType[i]['settings'],
                cells = xlObj._getSelectedRange({ rowIndex: range[0], colIndex: range[1] }, { rowIndex: range[2], colIndex: range[3] });
                if (cells.length === 1){
					xlObj._dupDetails= true;
                    this._renderControls(cells[0].rowIndex, cells[0].colIndex, sheetIdx, type);
					xlObj._dupDetails = false;
				}
                else {
                    for (var j = 0, len = cells.length; j < len; j++) {
						actSheetIndex = type['dataSourceSheetIndex'] || sheetIdx;
						rowIndex = cells[j].rowIndex; colIndex = cells[j].colIndex;
						xlObj._textClip(rowIndex, colIndex, 'delete', '', true);
						xlObj._textClip(rowIndex, colIndex, 'add');
                        index = xlObj.getObjectLength(container.sheetCellType);
                        cell = xlObj._isRowViewable(sheetIdx, rowIndex) ? xlObj.getCell(rowIndex, colIndex, sheetIdx)[0] : null;
						text = xlObj.XLEdit.getPropertyValue(rowIndex, colIndex, 'value2', sheetIdx);
                        cell && (cell.innerHTML = '');
                        if (!xlObj._hasClass(cell, 'e-cellreadonly'))
                            xlObj.addClass(cell, 'e-cellreadonly');
                        headerTxt = xlObj._generateHeaderText(colIndex + 1);
                        switch (type['type']) {
                            case 'Button':
                                id = xlObj._id + '_btn' + i + '_' + sheetIdx + headerTxt + (rowIndex + 1);
								xlObj.XLFormat._writeCssRules('e-btncls' + rowIndex + colIndex , 'border: 0px; vertical-align: middle; padding: 0px;color:' + (type['color'] || '') + ';background:' + (type['background-color'] || '') + ';', true, true);
								if (cell)
                                    cell.innerHTML = '<button id =' + id + ' type="button" class = "e-btncls'+ rowIndex + colIndex + '"></button>';
                                if(cell && browser === 'mozilla' || browser === 'msie') {
									xlObj.addClass(cell, 'e-btnhgt');
									xlObj.addClass($cell.parents('.e-table')[0],'e-btnhgt');                                    
								}
								if(isNew || !sheet._isLoaded){
									data = { 'type': type['type'], 'id': id, 'text': type['text'] || text || type['type'] + xlObj._generateHeaderText(cells[j].colIndex + 1) + (cells[j].rowIndex + 1), 'color': (type['color'] || ''), 'background-color': (type['background-color'] || '') };
									cont = { 'cellType': index };
								}
                                break;
                            case 'CheckBox':
                                id = xlObj._id + '_chk' + i + '_' + sheetIdx + headerTxt + (rowIndex + 1);
                                cell && (cell.innerHTML = '<input id =' + id + ' />');
								if(isNew || !sheet._isLoaded){
									if(text && ["false", "true", "yes", "no"].indexOf(text.toLowerCase()) === -1)
										text = '';
									data = { 'type': type['type'], 'id': id, 'isChecked': type['isChecked'] || text || false };
									cont = xlObj.XLEdit._parseValue(data['isChecked'], { rowIndex: rowIndex, colIndex: colIndex });
									cont['cellType'] = index;
									(data['isChecked'].toString().toLowerCase() === 'true') && (refrshArr.push({ 'type': data['type'], 'id': data['id'] }));
								}
								cell && (cell.lastChild.textContent = '');
                                break;
                            case 'DropDownList':
                                id = xlObj._id + '_drpdwn' + i + '_' + sheetIdx + headerTxt + (rowIndex + 1);
                                if (xlObj.element.find("#" + id).length > 0)
                                    return;
                                cell && (cell.innerHTML = '<input id =' + id + ' value = ' + text + ' />');
                                data = { 'type': type['type'], 'id': id, 'style': '', 'dataSource': type['dataSource'] || '', 'dataSourceRange': type['dataSourceRange'] || '', 'selectedIndex': type['selectedIndex'] > -1 ? type['selectedIndex'] : '', 'dataSourceSheetIndex': actSheetIndex };
                                if (type['dataSource'] && type['field'])
                                    data['field'] = type['field'];
                                if(isNew || !sheet._isLoaded){
									if(type['dataSourceRange']){
                                        dataRange = xlObj.getRangeIndices(type['dataSourceRange']), datacells = xlObj._getSelectedRange({ rowIndex: dataRange[0], colIndex: dataRange[1] }, { rowIndex: dataRange[2], colIndex: dataRange[3] });
										var ddlCells = xlObj.XLEdit._getPropWithCellIdx([ datacells[0].rowIndex, datacells[0].colIndex, datacells[datacells.length - 1].rowIndex, datacells[datacells.length - 1].colIndex ], "ddlRange", actSheetIndex)
										if (ddlCells.length === 0)
											xlObj.updateUniqueData( { 'ddlRange': [{ rowIndex: rowIndex, colIndex: colIndex, sheetIndex: sheetIdx }] }, [ datacells[0].rowIndex, datacells[0].colIndex, datacells[datacells.length - 1].rowIndex, datacells[datacells.length - 1].colIndex ], '', actSheetIndex );
										else
											for(var k = 0; k < datacells.length; k++){
												ddlCells = xlObj.XLEdit.getPropertyValue(datacells[k].rowIndex, datacells[k].colIndex, 'ddlRange', actSheetIndex)
												if(ddlCells){
													ddlCells.push({ rowIndex: rowIndex, colIndex: colIndex, sheetIndex: sheetIdx });
													xlObj.XLEdit._updateDataContainer({ rowIndex: datacells[k].rowIndex, colIndex: datacells[k].colIndex }, { 'dataObj': {'ddlRange': ddlCells }, 'sheetIdx': actSheetIndex });
												}
												else
													xlObj.XLEdit._updateDataContainer({ rowIndex: datacells[k].rowIndex, colIndex: datacells[k].colIndex }, { 'dataObj': {'ddlRange': [{ rowIndex: rowIndex, colIndex: colIndex, sheetIndex: sheetIdx }]}, 'sheetIdx': actSheetIndex });
											}
									}
									if (actSheetIndex !== sheetIdx && !xlObj.getSheet(actSheetIndex)._isLoaded)
									    xlObj._initSheet(actSheetIndex);
									if (xlObj.isUndefined(type["selectedIndex"]) && text) {
									    var dSrc, field, k;
									    dSrc = type['dataSource'] || xlObj.getRangeData({ range: dataRange, sheetIdx: actSheetIndex });
									    field = type['field'] || 'value2';
									    if (!type['field'])
									        type['field'] = field;
									    k = dSrc.length;
									    while (--k >= 0) {
									        if (dSrc[k][field] == text) {
									            data["selectedIndex"] = k;
									            break;
									        }
									        if (k == 0)
									            delete data["selectedIndex"];
									    }
									}
									data['selectedIndex'] && data['selectedIndex'] > -1 && (refrshArr.push({ 'type': data['type'], 'id': data['id'], 'selectedIndex': data['selectedIndex'] }));
									cont = { 'cellType': index };
								}
                                break;
                            case "DatePicker":
                                id = xlObj._id + '_dp' + i + '_' + sheetIdx + headerTxt + (rowIndex + 1);
                                cell && (cell.innerHTML = '<input id =' + id + ' value = ' + text + ' style = "height:' + (xlObj._getRowHeight(rowIndex, sheetIdx) - 1) + 'px" />');
                                if(isNew || !sheet._isLoaded){
									data = { 'type': type['type'], 'id': id, 'value': type['value'] || (text && ej.parseDate(text)) || new Date() };
									cont = { 'cellType': index };
									data['value'] && (refrshArr.push({ 'type': data['type'], 'id': data['id'], 'value': data['value'] }));
								}
                                break;
                        }
						if(isNew || !sheet._isLoaded){
							container.sheetCellType[index] = data;
							xlObj.XLEdit._updateDataContainer({ rowIndex: rowIndex, colIndex: colIndex }, { 'dataObj': cont, 'sheetIdx': sheetIdx });
						}
                    }
                    switch (type['type']) {
                        case 'Button':
                            $("[id^='" + xlObj._id + '_btn' + i + '_' + sheetIdx + "']").ejButton({ type: "button", width: '100%', height: '100%', text: text, create: $.proxy(this._onButtonCreate), click: $.proxy(this.onButtonClick), cssClass: cellType['class'] || ''  });
                            break;
                        case 'CheckBox':
                            $("[id^='" + xlObj._id + '_chk' + i + '_' + sheetIdx + "']").ejCheckBox({ change: $.proxy(this.onActiveStateChange), checked: false, cssClass: cellType['class'] || ''  });
                            break;
                        case 'DropDownList':
                            $("[id^='" + xlObj._id + '_drpdwn' + i + '_' + sheetIdx + "']").ejDropDownList({ loadOnDemand: true, width: '100%', height: xlObj.model.rowHeight - 1, change: $.proxy(this.onActiveValueChange), 'dataSource': type['dataSource'] || xlObj.getRangeData({ range : dataRange, sheetIdx : actSheetIndex}),fields: { text: type['field'] || 'value2' }, watermarkText: type['watermarkText'] || 'Select an option', cssClass: type['class'] || '' , selectedIndex: type['selectedIndex'] > -1 ? type['selectedIndex'] : '' , beforePopupShown: $.proxy(this._onBeforePopupOpen)});
                            break;
                        case "DatePicker":
                            $("[id^='" + xlObj._id + '_dp' + i + '_' + sheetIdx + "']").ejDatePicker({ width: '100%', height: xlObj.model.rowHeight - 1, create: $.proxy(this._onDateCreate), change: $.proxy(this.onDateChange), cssClass: cellType['class'] || '', locale: xlObj.model.locale });
                            break;
                    }
					for(var k = 0, kLen = refrshArr.length; k < kLen; k++){
						this._isIntrnlUpdate = true;
						if(refrshArr[k].type === 'CheckBox')
							$('#'+ refrshArr[k].id).length && $('#'+refrshArr[k].id).ejCheckBox('instance').option('checked', true);
						else if(refrshArr[k].type === 'DropDownList')
							$('#'+ refrshArr[k].id).length && $('#'+refrshArr[k].id).ejDropDownList('instance').option('selectedIndex', refrshArr[k]['selectedIndex']);
						else if(refrshArr[k].type === 'DatePicker')
							$('#'+ refrshArr[k].id).length && $('#'+refrshArr[k].id).ejDatePicker('instance').option('value', refrshArr[k]['value']);
						this._isIntrnlUpdate = false;
					}
                }
            }
        },
		
        removeCellTypes: function (aRange, sheetIdx) {
            var xlObj = this.XLObj;
		    if (xlObj.model.isReadOnly)
		        return;
		    var i, len, sheetIdx = xlObj._getSheetIndex(sheetIdx), range = xlObj._getRangeArgs(aRange, "object"), cells = xlObj.XLEdit._getPropWithCellIdx(range, 'cellType', sheetIdx);
			for(i = 0, len = cells.length; i < len; i++)
				this._removeControls(cells[i].rowIdx, cells[i].colIdx, sheetIdx);
		},

        _removeControls: function (rowIndex, colIndex, sheetIdx, cntnrUpdate) {
            var cell, xlObj = this.XLObj, sheetIdx =  xlObj._getSheetIndex(sheetIdx), container = xlObj._dataContainer, sheet = xlObj.getSheet(sheetIdx), index;
            if (!cntnrUpdate) {
                delete container.sheetCellType[container.sheets[sheetIdx][rowIndex][colIndex]['cellType']];
                delete container.sheets[sheetIdx][rowIndex][colIndex]['cellType'];
				index = this._rangeInColl(xlObj._getAlphaRange(sheetIdx, rowIndex, colIndex, rowIndex, colIndex), sheetIdx);
				(index > -1) && sheet.cellTypes.splice(index, 1);
            }
            if (xlObj._isRowViewable(sheetIdx, rowIndex)) {
                cell = xlObj.getCell(rowIndex, colIndex, sheetIdx)[0];
                cell.innerHTML = xlObj.XLEdit.getPropertyValue(rowIndex, colIndex, 'value2', sheetIdx) || '';
                xlObj._removeClass(cell, 'e-cellreadonly');
            }
        },

        onActiveValueChange: function (args) {
            var xlObj = this.element.closest(".e-spreadsheet").data("ejSpreadsheet")
			if(xlObj.model.isReadOnly)
				return;
            var container = xlObj._dataContainer, cell = this.element.closest('td'), sheetIdx = xlObj.getActiveSheetIndex(), cellIndex = xlObj._getCellIdx(cell[0]), rowIndex = cellIndex.rowIndex, colIndex = cellIndex.colIndex, cType = container.sheetCellType[container.sheets[sheetIdx][rowIndex][colIndex]['cellType']], dRange = cType['dataSourceRange'] && xlObj.getRangeIndices(cType['dataSourceRange']);
            cType['selectedIndex'] = args.itemId;
            xlObj.XLEdit._updateDataContainer({ rowIndex: rowIndex, colIndex: colIndex }, { 'dataObj': xlObj.XLEdit._parseValue(args.text, { rowIndex: rowIndex, colIndex: colIndex }) });
			if (dRange && (xlObj.XLEdit.getPropertyValue(dRange[0] + args.itemId, dRange[1], 'type') === "number"))
				xlObj.XLFormat.format({ 'type': "number"}, [rowIndex, colIndex, rowIndex, colIndex]);
            args.cellIndex = cellIndex;
            args.cellType = "dropdownlist";
            xlObj._trigger('cellSave', args);
            (xlObj.model.allowFormulaBar) && xlObj.updateFormulaBar();
        },

        onActiveStateChange: function (args) {
            var xlObj = this.element.closest(".e-spreadsheet").data("ejSpreadsheet");
			if(xlObj.model.isReadOnly || xlObj.XLCellType._isIntrnlUpdate)
				return;
            var container = xlObj._dataContainer, text, cell = this.element.closest('td'), sheetIdx = xlObj.getActiveSheetIndex(), cellIndex = xlObj._getCellIdx(cell[0]), rowIndex = xlObj._getRowIdx(cellIndex.rowIndex, sheetIdx), colIndex = cellIndex.colIndex;
            container.sheetCellType[container.sheets[sheetIdx][cellIndex.rowIndex][colIndex]['cellType']]['isChecked'] = args.isChecked;
			if(['yes','no'].indexOf(xlObj.XLEdit.getPropertyValue(cellIndex.rowIndex, colIndex, 'value2').toString().toLowerCase()) > -1){
				if(args.isChecked)
					text = 'YES';
				else
					text = 'NO';
			}
			else
				text = args.isChecked.toString().toUpperCase();
			xlObj.XLEdit._updateDataContainer({ rowIndex: cellIndex.rowIndex, colIndex: colIndex }, { 'dataObj': xlObj.XLEdit._parseValue(text, { rowIndex: cellIndex.rowIndex, colIndex: colIndex }) });
			args.cellIndex = cellIndex;
			args.cellType = "checkbox";
            xlObj._trigger('cellSave', args);
			(xlObj.model.allowFormulaBar) && xlObj.updateFormulaBar();
        },
		
		_onDateCreate: function (args){
			var xlObj = this.element.closest(".e-spreadsheet").data("ejSpreadsheet"), container = xlObj._dataContainer, cell = this.element.closest('td'), sheetIdx = xlObj.getActiveSheetIndex(), cellIndex = xlObj._getCellIdx(cell[0]), rowIndex = xlObj._getRowIdx(cellIndex.rowIndex, sheetIdx), colIndex = cellIndex.colIndex;
             xlObj.XLEdit._updateDataContainer({ rowIndex: rowIndex, colIndex: colIndex }, { 'dataObj': xlObj.XLEdit._parseValue(args.model.value ? (args.model.value.toLocaleString().split(', ')[0]) : "", { rowIndex: rowIndex, colIndex: colIndex }) });
		},

        onDateChange: function (args) {
            var xlObj = this.element.closest(".e-spreadsheet").data("ejSpreadsheet");
			if(xlObj.model.isReadOnly)
				return;
            var container = xlObj._dataContainer, cell = this.element.closest('td'), sheetIdx = xlObj.getActiveSheetIndex(), cellIndex = xlObj._getCellIdx(cell[0]), rowIndex = xlObj._getRowIdx(cellIndex.rowIndex, sheetIdx), colIndex = cellIndex.colIndex;
            xlObj.XLEdit._updateDataContainer({ rowIndex: rowIndex, colIndex: colIndex }, { 'dataObj': xlObj.XLEdit._parseValue(args.model.value ? (args.model.value.toLocaleString().split(ej.isNullOrUndefined(args.model.value.toLocaleString().match(/[,]/)) ? ' ' : ', ')[0]) : "", { rowIndex: rowIndex, colIndex: colIndex }) });
            args.cellIndex = cellIndex;
            args.cellType = "datepicker";
            !xlObj._isPublic && xlObj._trigger('cellSave', args);
            (xlObj.model.allowFormulaBar) && xlObj.updateFormulaBar();
        },
		
		_onButtonCreate: function (args){
			var xlObj = this.element.closest(".e-spreadsheet").data("ejSpreadsheet"), container = xlObj._dataContainer, cell = this.element.closest('td'), sheetIdx = xlObj.getActiveSheetIndex(), cellIndex = xlObj._getCellIdx(cell[0]), rowIndex = xlObj._getRowIdx(cellIndex.rowIndex, sheetIdx), colIndex = cellIndex.colIndex;
			 xlObj.XLEdit._updateDataContainer({ rowIndex: rowIndex, colIndex: colIndex }, { 'dataObj': xlObj.XLEdit._parseValue(args.model.text, { rowIndex: rowIndex, colIndex: colIndex }) });
		},

        onButtonClick: function (args) {
            var xlObj = this.element.closest(".e-spreadsheet").data("ejSpreadsheet");
			if(xlObj.model.isReadOnly)
			    return;
			args.cellIndex = xlObj._getCellIdx($(args.target).closest('td')[0]);
			args.cellType = "button";
			xlObj._trigger('cellClick', args);
        },
		
		_onBeforePopupOpen: function(args){
            var xlObj = this.element.closest(".e-spreadsheet").data("ejSpreadsheet"), sheetIdx = xlObj.getActiveSheetIndex(), container = xlObj._dataContainer, cell = this.element.closest('td'), cellIndex = xlObj._getCellIdx(cell[0]), rowIndex = cellIndex.rowIndex,
			colIndex = cellIndex.colIndex, ddlCont = container.sheetCellType[container.sheets[sheetIdx][rowIndex][colIndex]['cellType']], 
			actSheetIndex = ddlCont['dataSourceSheetIndex'] || sheetIdx, dataSource;
			!xlObj.getSheet(actSheetIndex)._isLoaded && xlObj._initSheet(actSheetIndex);
			dataSource = ddlCont['dataSource'] || xlObj.getRangeData({ range: xlObj.getRangeIndices(ddlCont['dataSourceRange']), sheetIdx: actSheetIndex });
			$('#' + ddlCont['id']).ejDropDownList('instance').option( "dataSource" , dataSource);
			$('#' + ddlCont['id']).ejDropDownList('instance').option( "selectedItemIndex" , ddlCont['selectedIndex']);
		},
		
		_rangeInColl: function(range, sheetIndex) {
            var xlObj = this.XLObj, sheet = xlObj.getSheet(xlObj._getSheetIndex(sheetIndex)), type = sheet.cellTypes;
            for (var i = 0, len = type.length; i < len; i++)
                if (type[i].range === range)
                    return i;
        },

		_rfrshCtrlText: function (cellInfo, val, sheetIdx) {
		    var xlObj = this.XLObj, isUpdtDtcnr = true, cType, cTypeObj, selectedIndex;
		    if (!xlObj.isUndefined(cellInfo.rowIndex) && !xlObj.isUndefined(cellInfo.colIndex)) {
		        cellInfo = xlObj.getRangeData({ range: [cellInfo.rowIndex, cellInfo.colIndex, cellInfo.rowIndex, cellInfo.colIndex], property: ["cellType", "value"] })[0];
		        val = cellInfo.value;
		    }
		    cType = xlObj._dataContainer.sheetCellType[cellInfo.cellType];
		    if (cType) {
		        switch (cType.type) {
		            case ej.Spreadsheet.CustomCellType.DropDownList:
		                cTypeObj = $("#" + cType.id).data("ej" + cType.type);
		                if (cTypeObj) {
		                    selectedIndex = cTypeObj.selectedIndexValue;
		                    cTypeObj._raiseEvents = false;
		                    cTypeObj.selectItemByText(val, true);
		                    cTypeObj._raiseEvents = true;
		                    if (selectedIndex !== cTypeObj.selectedIndexValue) {
		                        cType.selectedIndex = cTypeObj.selectedIndexValue;
		                        xlObj._isSelIdxChange = true;
		                    }
		                    else
		                        isUpdtDtcnr = false;
		                }
		                break;
		            case ej.Spreadsheet.CustomCellType.DatePicker:
		                cTypeObj = $("#" + cType.id).data("ej" + cType.type);
		                if (cTypeObj)
		                    cTypeObj.option("value", val);
		                break;
		        }
		    }
		    return isUpdtDtcnr;
		}

    };
})(jQuery, Syncfusion);