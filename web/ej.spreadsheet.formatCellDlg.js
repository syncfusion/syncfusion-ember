(function ($, ej, undefined) {
    ej.spreadsheetFeatures = ej.spreadsheetFeatures || {};

    ej.spreadsheetFeatures.formatCellDialog = function (obj) {
        this.XLObj = obj;
        this._categories = [
               { value: "General", text: obj._getLocStr("LGeneral") }, { value: "Number", text: obj._getLocStr("NumberTab") }, { value: "Currency", text: obj._getLocStr("LCurrency") }, { value: "Accounting", text: obj._getLocStr("LAccounting") },
               { value: "Date", text: obj._getLocStr("LDate") }, { value: "Time", text: obj._getLocStr("LTime") }, { value: "Percentage", text: obj._getLocStr("LPercentage") }, { value: "Fraction", text: obj._getLocStr("LFraction") }, { value: "Scientific", text: obj._getLocStr("LScientific") }, { value: "Text", text: obj._getLocStr("LText") }, { value: "Custom", text: obj._getLocStr("LCustom") }
        ];
        this._effects = [{ value: "1", text: "underline" }, { value: "1", text: "line-through" }, { value: "1", text: "line-through underline" }];
        this._selValue = "General";
    };

    ej.spreadsheetFeatures.formatCellDialog.prototype = {
        //Render Format Cell dialog
        _renderCellFrmtDlg: function () {
            var xlObj = this.XLObj, xlId = xlObj._id, dlgId = xlId + "_formatdlg", $dlg, $tab, $ctnr, $ul, $NumberTag,$FontTag,$FillTag, $li,$li1,$li2, $btndiv, $btnctnr, $okBtn, $canBtn;
			$dlg = ej.buildTag("div#" + dlgId);
            $tab = ej.buildTag("div#" + dlgId + "_formattab");
            $ctnr = ej.buildTag("div.e-dlg-fields e-dlgctndiv");
            //create tab Content
            $ul = ej.buildTag("ul .e-ul");
            $NumberTag = ej.buildTag("a", xlObj._getLocStr("NumberTab"), {}, { href: "#" + dlgId + "_number" });
            $li = ej.buildTag("li", $NumberTag);
            $FontTag = ej.buildTag("a", xlObj._getLocStr("FontTab"), {}, { href: "#" + dlgId + "_font" });
            $li1 = ej.buildTag("li", $FontTag);
            //extend other tabs here
            $ul.append($li);
            $ul.append($li1);
            $tab.append($ul);
            $ctnr.append($tab);
            //create button content
            $btndiv = ej.buildTag("div.e-dlg-btnfields");
            $btnctnr = ej.buildTag("div.e-dlg-btnctnr");
            $okBtn = ej.buildTag("input#" + dlgId + "_okbtn");
            $canBtn = ej.buildTag("input#" + dlgId + "_cantn");
            $okBtn.ejButton({ text: xlObj._getLocStr("Ok"), showRoundedCorner: true, width: 60, click: ej.proxy(this._dlgCFOk, this) , cssClass: "e-ss-okbtn"});
            $canBtn.ejButton({ text: xlObj._getLocStr("Cancel"), showRoundedCorner: true, width: 60, click: ej.proxy(this._dlgCFCancel, this) });
            $btndiv.append($btnctnr.append($okBtn, $canBtn));
            //element for maintain data's(font-family, size, color, bgcolor,..etc)
            $ctnr.append(ej.buildTag("div#" + dlgId + "_format_dataMnger", "", { display: "none" }));
            xlObj.element.append($dlg.append($ctnr, $btndiv));
            //control rendering
            $tab.ejTab({ width: "100%", height: "auto", cssClass: "e-ss-dlgtab", allowKeyboardNavigation: false, itemActive: ej.proxy(this._numberTabChange, this) });
            $("#" + xlObj._id + "_formatdlg_format_dataMnger").data("style", { "font-family": "Calibri", "font-weight": "normal", "font-style": "normal", "font-size": "11pt", "text-decoration": "none", "color": "#333333" });
            this._renderNumberTab();
            this._renderFontTab();
            $dlg.ejDialog({ enableModal: true, showOnInit: false, enableResize: false, allowKeyboardNavigation: false, title: xlObj._getLocStr("Formatcells"), width: "auto", height: "auto", cssClass: "e-ss-dialog e-ss-mattab e-ss-fcdlg e-" + xlObj._id + "-dlg", open: function () { $("#" + xlObj._id + "_formatdlg_okbtn").focus(); } });
            
        },

        _renderNumberTab: function () {
            var $div, xlObj = this.XLObj, numbertabId = xlObj._id + "_fdlg_nTab", categories = this._categories, dateTypes, customList, timeTypes, $chkelem, $table, $tr, $tdlbl,
                $listUl, $td, $inputelem, $subTable, $subtr, $subtd, $opttd, $listDate, $listTime, $inputelem1, $customList, $custDelBtn, $custBtndiv, infodiv, $formatDrawer;
            dateTypes = [
              { text: "Wednesday, March 14, 2012", value: "{0:dddd, MMMM dd, yyyy}" }, { text: "3/14/2012", value: "{0:M/d/yyyy}" },
              { text: "March 03", value: "{0:MMMM dd}" }, { text: "2012 March", value: "{0:yyyy MMMM}" },
              { text: "3/14/12 1:30 PM", value: "{0:dd/MM/yyyy h:mm tt}" }
            ];
            customList = [
                { text: "0", type: "default" }, { text: "0.00", type: "default" }, { text: "#,##0", type: "default" }, { text: "#,##00.00", type: "default" },
                { text: "0%", type: "default" }, { text: "0.00%", type: "default" }, { text: "MM/dd/yyyy", type: "default" }, { text: "d-MMM", type: "default" },
                { text: "h:mm", type: "default" }, { text: "mm:ss", type: "default" }
            ];
            timeTypes = [
             { text: "1:30:55 PM", value: "{0:h:mm:ss tt}" }, { text: "1:30 PM", value: "{0:h:mm tt}" },
             { text: "13:30:55", value: "{0:h:mm:ss}" }, { text: "1:30", value: "{0:hh:mm}" }
            ];
            var $maindiv = ej.buildTag("div.e-ss-maindiv"), $top = ej.buildTag("div.e-ss-topdiv", "", { display: "table", width: "100%" }), $center = ej.buildTag("div.e-ss-centerdiv", "", { display: "table", width: "100%" }), $left = ej.buildTag("div.e-ss-lefttopdiv", ""), $right = ej.buildTag("div.e-ss-righttopdiv", "", "");
            $tdlbl = ej.buildTag("label.e-dlg-fields", xlObj._getLocStr("FormatSample"));
            $right.append($tdlbl);
            $top.append($left, $right);
            $left = ej.buildTag("div.e-ss-leftdiv", ""), $right = ej.buildTag("div.e-ss-rightdiv", "", { "float": "left" })
            $inputelem = ej.buildTag("input#" + numbertabId + "_sinput.ejinputtext", "", {}, { disabled: "disabled" });
            $right.append($inputelem);
            $div = ej.buildTag("div#div" + numbertabId, "");
            
            //Decimal places prop
            $subTable = ej.buildTag("table", "", { "white-space": "normal" });
            $subtr = ej.buildTag("tr#" + numbertabId + "_decimal.e-fdlg-num-options");
            $subtd = ej.buildTag("td", ej.buildTag("label.e-dlg-fields", xlObj._getLocStr("DecimalPlacesTxt")), "", { width: "103px" });
            $subTable.append($subtr.append($subtd));
            $subtr = ej.buildTag("tr#" + numbertabId + "_decimaldrop.e-fdlg-num-options");
            $subtd = ej.buildTag("td");
            $inputelem = ej.buildTag("input#" + numbertabId + "_decimalplace", "");
            $right.append($div.append($subTable.append($subtr.append($subtd.append($inputelem)))));
            //Thousand separator prop
            $subtr = ej.buildTag("tr#" + numbertabId + "_tseparator.e-fdlg-num-options");
            $subtd = ej.buildTag("td", "", "", { colspan: "2" });
            $chkelem = ej.buildTag("input#" + numbertabId + "_kseptr");
            $subTable.append($subtr.append($subtd.append($chkelem)));
            //Date types prop
            $subtr = ej.buildTag("tr#" + numbertabId + "_dtypes.e-fdlg-num-options");
            $subtd = ej.buildTag("td", ej.buildTag("label.e-dlg-fields", xlObj._getLocStr("Type")));
            $listDate = ej.buildTag("ul#" + numbertabId + "_datetypes");
            $subTable.append($subtr.append($subtd.append($listDate)));
            //Time types prop
            $subtr = ej.buildTag("tr#" + numbertabId + "_ttypes.e-fdlg-num-options");
            $subtd = ej.buildTag("td", ej.buildTag("label.e-dlg-fields", xlObj._getLocStr("Type")));
            $listTime = ej.buildTag("ul#" + numbertabId + "_timetypes");
            $subTable.append($subtr.append($subtd.append($listTime)));
            //Custom type prop
            $subtr = ej.buildTag("tr#" + numbertabId + "_custom.e-fdlg-num-options");
            $subtd = ej.buildTag("td", ej.buildTag("label.e-dlg-fields", xlObj._getLocStr("Type")));
            $inputelem1 = ej.buildTag("input#" + numbertabId + "_custominput.ejinputtext");
            $customList = ej.buildTag("ul#" + numbertabId + "_customtypes");
            $custDelBtn = ej.buildTag("button#" + numbertabId + "_delBtn", xlObj._getLocStr("Delete"), {}, { type: "button" });
            $custBtndiv = ej.buildTag("div", $custDelBtn);
            $subTable.append($subtr.append($subtd.append($inputelem1, $customList, $custBtndiv)));
            xlObj._on($inputelem1, "keydown", this._validateCustomFormat);
            //Format type description elem
            infodiv = ej.buildTag("div#" + numbertabId + "_typeinfo.e-ss-fcgdiv", "", {});
            $right.append($div);
            $center.append($left, $right);
            $("#" + xlObj._id + "_formatdlg_number").append($maindiv.append($top, $center, infodiv));
            $subTable.find('.e-fdlg-num-options').hide();
            this._createNumList(categories, $left);
            //control creations
            $inputelem.ejNumericTextbox({
                name: "numeric",
                value: 2,
                height: 27,
                width: "100%",
                minValue: 0,
                maxValue: 30,
                change: $.proxy(this._refreshFrmtPropChanges, this)
            });
            $chkelem.ejCheckBox({ change: $.proxy(this._refreshFrmtPropChanges, this) });
            $chkelem.parent().append(ej.buildTag("label.e-dlg-fields", xlObj._getLocStr("ThousandSeparatorTxt"), { "margin-left": 6 }));
            $listDate.ejListBox({
                selectedItemIndex: "0",
                dataSource: dateTypes,
                fields: { text: "text", value: "value" },
                width: "100%",
                height: "120",
                selected: $.proxy(this._refreshFrmtPropChanges, this)
            });
            $listTime.ejListBox({
                selectedItemIndex: "0",
                dataSource: timeTypes,
                fields: { text: "text", value: "value" },
                width: "100%",
                height: "120",
                selected: $.proxy(this._refreshFrmtPropChanges, this)
            });
            $customList.ejListBox({
                selectedItemIndex: "0",
                dataSource: customList,
                fields: { text: "text", value: "value" },
                width: "100%",
                height: "100",
                selected: $.proxy(this._refreshFrmtPropChanges, this)
            });
            $("#" + numbertabId + "_datetypes_container").addClass("e-ss-datetypes");
            $("#" + numbertabId + "_timetypes_container").addClass("e-ss-timetypes");
            $("#" + numbertabId + "_customtypes_container").addClass("e-ss-customtypes");
            /// add calendar pattern
            for (var i = 0; i < 4; i++) {
                var frmtStr = customList[i + 6].text, type = (i > 2) ? ej.Spreadsheet.CellType.Date : ej.Spreadsheet.CellType.Time;
                xlObj.XLFormat.addCustomFormatSpecifier(null, frmtStr, type);
            }
            $custDelBtn.ejButton({ showRoundedCorner: true, width: 60, click: $.proxy(this._customFormatDelete, this) });
        },

        _initFormatCellDlg: function () {
            var xlObj = this.XLObj, tabObj;
            if (!xlObj.model.allowCellFormatting)
                return false;
            $("#" + xlObj._id + "_formatdlg").ejDialog("open");
            $("#" + xlObj._id + "_formatdlg_format_dataMnger").data("style", { "font-family": "Calibri", "font-weight": "normal", "font-style": "normal", "font-size": "11pt", "text-decoration": "none",  "color": "#333333" });
            $("#" + xlObj._id + "_formatdlg_format_dataMnger").removeData("NumFormat");
            this._updateFormtdata();
			tabObj = $("#" + xlObj._id + "_formatdlg_formattab").data("ejTab");
		    tabObj && tabObj._refresh();
            // $("#" + xlObj._id + "_formatdlg_format_dataMnger").removeData();
            
        },

        _createFontStyleList: function () {
            var xlObj = this.XLObj, fontTabId = xlObj._id + "_fdlg_fonttab", $drpdiv = ej.buildTag("div.e-ss-drpfontdiv"),
                $familyDiv = ej.buildTag("div .e-ss-stylediv"), $styleDiv = ej.buildTag("div .e-ss-stylediv"), $sizeDiv = ej.buildTag("div .e-ss-stylediv"), $effectsDiv = ej.buildTag("div .e-ss-stylediv"),
            $listFamily = ej.buildTag("input#" + fontTabId + "_family"), $previewLabel = ej.buildTag("label", xlObj._getLocStr("Preview"), "", { id: fontTabId + "_previewlabel" }),
            $inputelem = ej.buildTag("input#" + fontTabId + "_sinput2.ejinputtext", "", { height: "75px","text-align":"center" }, { disabled: "disabled", value: "AaBbCcYyZz" }),
            $listStyle = ej.buildTag("input#" + fontTabId + "_style"), $NormalFont = ej.buildTag("div#" + fontTabId + "_normalfont2", "", { "padding-left": "10px" }), $bottomRight = ej.buildTag("div .e-ss-colordiv", "", { "padding-right": "0px"}),
            $listSize = ej.buildTag("input#" + fontTabId + "_size"), $bottom = ej.buildTag("div .e-ss-stylediv"), $bottom2 = ej.buildTag("div .e-ss-fontcntdiv"), $bottomleft = ej.buildTag("div .e-ss-colordiv"), $bottomMid = ej.buildTag("div .e-ss-colordiv"), $colorLabel = ej.buildTag("label", xlObj._getLocStr("Color"), "", { id: fontTabId + "_colorlabel" }),
            $fillLabel = ej.buildTag("label", xlObj._getLocStr("BackgroundColor"), "", { id: fontTabId + "_filllabel" }), $colorBox = ej.buildTag("input#" + fontTabId + "_color"),
            $fillColorBox = ej.buildTag("input#" + fontTabId + "_fillcolor"),
            $listEffects = ej.buildTag("input#" + fontTabId + "_effects");
            $familyDiv.append($listFamily);
            $styleDiv.append($listStyle);
            $sizeDiv.append($listSize);
            $effectsDiv.append($listEffects);
            $bottomleft.append($fillLabel, $fillColorBox);
            $bottomMid.append($colorLabel, $colorBox);
            $bottomRight.append(ej.buildTag("label", xlObj._getLocStr("NormalFont")), $NormalFont);
            $bottom.append($bottomleft, $bottomMid, $bottomRight);
            $bottom2.append($previewLabel, $inputelem);
            $drpdiv.append($familyDiv, $styleDiv, $sizeDiv, $effectsDiv, $bottom, $bottom2);
            $listFamily.ejDropDownList({
                dataSource: xlObj.XLRibbon._fontFamily, width: "100%", 
                select: $.proxy(this._onFontFamilySelect, this), selectedItemIndex: 6
            });
            $listStyle.ejDropDownList({
                dataSource: xlObj.XLRibbon._fontStyle, width: "100%",
                select: $.proxy(this._onFontStyleSelect, this), selectedItemIndex: 0
            });
            $listSize.ejDropDownList({
                dataSource: xlObj.XLRibbon._fontSize, width: "100%",
                select: $.proxy(this._onFontSizeSelect, this), selectedItemIndex: 3
            });
            $listEffects.ejDropDownList({
                dataSource: this._effects,
                 width: "100%",
                watermarkText: "None",
                select: $.proxy(this._onFontEffectSelect, this),
            });
            $colorBox.ejColorPicker({ value: "#333333", modelType: "palette", showSwitcher: false, cssClass: "e-ss-colorpicker", open: $.proxy(this._ChangeCPHandler, this, "fdlg_fonttab_color"), change: $.proxy(this._ChangeCPHandler, this, "fdlg_fonttab_color"), select: $.proxy(this._selectCPHandler, this, "fdlg_fonttab_color") });
            $fillColorBox.ejColorPicker({ value: "#FFFFFF", modelType: "palette", showSwitcher: false, cssClass: "e-ss-colorpicker", open: $.proxy(this._ChangeCPHandler, this, "fdlg_fonttab_fillcolor"), change: $.proxy(this._ChangeCPHandler, this, "fdlg_fonttab_fillcolor"), select: $.proxy(this._selectCPHandler, this, "fdlg_fonttab_fillcolor") });
            $NormalFont.ejCheckBox({ size: "small", change: $.proxy(this._changeNormalFont, this) });
            $("#" + xlObj._id + "_formatdlg_font").prepend($drpdiv);
        },


        _renderFontTab: function () {
            var xlObj = this.XLObj, fontTabId = xlObj._id + "_fdlg_fonttab", $maindiv = ej.buildTag("div.e-ss-fontmaindiv"),
            $top = ej.buildTag("div .e-ss-fontcntdiv"), $leftTop = ej.buildTag("div .e-ss-fontstylediv"), $rightTop = ej.buildTag("div .e-ss-fontstylediv"),
            $middleTop = ej.buildTag("div .e-ss-fontstylediv"),
            $familyLabel = ej.buildTag("label", xlObj._getLocStr("FontFamily"), "", { id: fontTabId + "_familylabel" }),
            $styleLabel = ej.buildTag("label", xlObj._getLocStr("FontStyle"), "", { id: fontTabId + "_stylelabel" }),
            $sizeLabel = ej.buildTag("label", xlObj._getLocStr("FontSize"), "", { id: fontTabId + "_sizelabel" });
            $leftTop.append($familyLabel);
            $middleTop.append($styleLabel);
            $rightTop.append($sizeLabel);
            $top.append($leftTop, $middleTop, $rightTop);
            // middle contents
            var $center = ej.buildTag("div .e-ss-fontcntdiv", "", { width: "103%" }), $centerLeft = ej.buildTag("div .e-ss-fontstylediv"), $centerRight = ej.buildTag("div .e-ss-fontstylediv", "", { "margin-right": "0px" }),
            $centerMid = ej.buildTag("div .e-ss-fontstylediv"),
            $listFamilyUl = ej.buildTag("ul#" + fontTabId + "_familylist"),
            $listStyleUl = ej.buildTag("ul#" + fontTabId + "_stylelist"),
            $listSizeUl = ej.buildTag("ul#" + fontTabId + "_sizelist"),
            $listFamilyBox = ej.buildTag("input#" + fontTabId + "_familytext .ejinputtext", "", { width: "150px" }, { value: "Calibri" }),
            $listStyleBox = ej.buildTag("input#" + fontTabId + "_styletext .ejinputtext", "", { width: "150px" }, { value: "Normal" }),
            $listSizeBox = ej.buildTag("input#" + fontTabId + "_sizetext .ejinputtext", "", { width: "150px" }, { value: 11 });
            $centerLeft.append($listFamilyBox,$listFamilyUl);
            $centerMid.append($listStyleBox,$listStyleUl);
            $centerRight.append($listSizeBox,$listSizeUl);
            $listFamilyUl.ejListBox({
                selectedItemIndex: "6", width: "150px", height: "150px", dataSource: xlObj.XLRibbon._fontFamily,
                fields: { text: "text", value: "value" }, select: $.proxy(this._onFontFamilySelect, this),
                allowMultiSelection: false
            });
            $listStyleUl.ejListBox({
                selectedItemIndex: "0", width: "150px", height: "150px", dataSource: xlObj.XLRibbon._fontStyle,
                fields: { text: "text", value: "value" }, select: $.proxy(this._onFontStyleSelect, this),
                allowMultiSelection: false
            });
            $listSizeUl.ejListBox({
                selectedItemIndex: "3", width: "150px", height: "150px", dataSource: xlObj.XLRibbon._fontSize,
                fields: { text: "text", value: "value" }, select: $.proxy(this._onFontSizeSelect, this),
                allowMultiSelection: false
            });
            $center.append($centerLeft, $centerMid, $centerRight);
            /// color effects
            var $bottom1 = ej.buildTag("div .e-ss-fontcntdiv"), $bottomLeft = ej.buildTag("div .e-ss-fontstylediv"), $bottomRight = ej.buildTag("div .e-ss-fontnrmldiv"),
            $bottomMid = ej.buildTag("div .e-ss-fontcdiv"),
            $bottomMid1 = ej.buildTag("div .e-ss-fontcdiv"),
            $effectsLabel = ej.buildTag("label", xlObj._getLocStr("Effects"), "", { id: fontTabId + "_effectslabel" }),
            $colorLabel = ej.buildTag("label", xlObj._getLocStr("Color"), "", { id: fontTabId + "_colorlabel" }),
            $fillLabel = ej.buildTag("label", xlObj._getLocStr("BackgroundColor"), "", { id: fontTabId + "_filllabel" }),
            $listEffectsBox = ej.buildTag("input#" + fontTabId + "_effectstext .ejinputtext"),
            $colorBox = ej.buildTag("input#" + fontTabId + "_colortext .ejinputtext", ""),
            $fillColorBox = ej.buildTag("input#" + fontTabId + "_fillcolortext .ejinputtext", ""),
            $NormalFont = ej.buildTag("label#" + fontTabId + "_normalfont", "", { "padding-left": "10px" });
            $bottomLeft.append($effectsLabel, $listEffectsBox);
            $bottomMid.append($colorLabel, $colorBox);
            $bottomMid1.append($fillLabel, $fillColorBox);
            $bottomRight.append(ej.buildTag("label", xlObj._getLocStr("NormalFont"), "", { id: fontTabId + "_fillcolorlabel" }), $NormalFont);
            $bottom1.append($bottomLeft, $bottomMid,$bottomMid1, $bottomRight);
            $listEffectsBox.ejDropDownList({
                dataSource: this._effects,
                watermarkText: "None",
                select: $.proxy(this._onFontEffectSelect, this),
                width:"150px",
            });
            $NormalFont.ejCheckBox({ size: "small" , change: $.proxy(this._changeNormalFont, this)});
            $colorBox.ejColorPicker({ value: "#333333", modelType: "palette", showSwitcher: false, cssClass: "e-ss-colorpicker", open: $.proxy(this._ChangeCPHandler, this, "fdlg_fonttab_colortext"), change: $.proxy(this._ChangeCPHandler, this, "fdlg_fonttab_colortext")});
            $fillColorBox.ejColorPicker({ value: "#FFFFFF", modelType: "palette", showSwitcher: false, cssClass: "e-ss-colorpicker", open: $.proxy(this._ChangeCPHandler, this, "fdlg_fonttab_fillcolortext"), change: $.proxy(this._ChangeCPHandler, this, "fdlg_fonttab_fillcolortext")});
            var $bottom2 = ej.buildTag("div .e-ss-fontcntdiv", "", {width:"20px"}), $previewLabel = ej.buildTag("label", xlObj._getLocStr("Preview"), "", { id: fontTabId + "_previewlabel" }),
            $inputelem = ej.buildTag("input#" + fontTabId + "_sinput.ejinputtext", "", { height: "80px",width:"480px", "padding-top": "10px","text-align":"center" }, { disabled: "disabled", value: "AaBbCcYyZz" });
                $bottom2.append($previewLabel,$inputelem);
                $("#" + xlObj._id + "_formatdlg_font").append($maindiv.append($top, $center, $bottom1, $bottom2));
                this._createFontStyleList();
        },

        _updateFormtdata: function () {
            var xlObj = this.XLObj, actCell = xlObj.getActiveCell(), numlObj = $("#" + xlObj._id + "_fdlg_nTab_list").data("ejListBox"), decimalTxtbox = $("#" + xlObj._id + "_fdlg_nTab_decimalplace").data("ejNumericTextbox"),
                datetype = $("#" + xlObj._id + "_fdlg_nTab_datetypes").data("ejListBox"), timetype = $("#" + xlObj._id + "_fdlg_nTab_timetypes").data("ejListBox"), numddlObj = $("#" + xlObj._id + "_fdlg_nTab_input").data("ejDropDownList"),
                customList = $("#" + xlObj._id + "_fdlg_nTab_customtypes").data("ejListBox"), cellData, decimalPlaces, separator, type, dTypeIdx, tTypeIdx, dataSrc, frmtStr, cTypeIdx, familyObj = $("#" + xlObj._id + "_fdlg_fonttab_familylist").data("ejListBox"),
                styelObj = $("#" + xlObj._id + "_fdlg_fonttab_stylelist").data("ejListBox"), sizelObj = $("#" + xlObj._id + "_fdlg_fonttab_sizelist").data("ejListBox"),
            effectObj = $("#" + xlObj._id + "_fdlg_fonttab_effectstext").data("ejDropDownList"), fontClObj = $("#" + xlObj._id + "_fdlg_fonttab_colortext").data("ejColorPicker"),
            fillClObj = $("#" + xlObj._id + "_fdlg_fonttab_fillcolortext").data("ejColorPicker");
            numlObj && numlObj._refreshScroller();
            cellData = xlObj.getRangeData({ range: [actCell.rowIndex, actCell.colIndex, actCell.rowIndex, actCell.colIndex] })[0];
            decimalPlaces = "decimalPlaces" in cellData ? cellData.decimalPlaces : 2;
            separator = "thousandSeparator" in cellData ? cellData.thousandSeparator : false;
            type = "type" in cellData ? cellData.type.indexOf("date") > -1 ? "date" : cellData.type : "general";
            if ("formatStr" in cellData) {
                dTypeIdx = datetype.getIndexByValue(cellData.formatStr);
                tTypeIdx = timetype.getIndexByValue(cellData.formatStr);
                if (xlObj.isUndefined(dTypeIdx) && xlObj.isUndefined(tTypeIdx) && ["date"].indexOf(type) > -1) {
                    dataSrc = customList.model.dataSource;
                    frmtStr = cellData.formatStr.replace(/^\{0\:|\}$/g, "");
                    if (!xlObj._isValueAlreadyExist(dataSrc, "text", frmtStr)) {
                        dataSrc.push({ text: frmtStr, type: "custom" });
                        customList._setModel({ dataSource: dataSrc });
                    }
                    cTypeIdx = customList.getIndexByText(frmtStr);
                    type = "custom";
                }
            }
            else
                dTypeIdx = tTypeIdx = 0;
            numlObj && numlObj.selectItemByValue($.camelCase("-" + type));
            datetype.selectItemByIndex(dTypeIdx > -1 ? dTypeIdx : 0);
            timetype.selectItemByIndex(tTypeIdx > -1 ? tTypeIdx : 0);
            customList.selectItemByIndex(cTypeIdx > -1 ? cTypeIdx : 0);
            if (type === "string") {
                numlObj.selectItemByIndex(10);
                customList.selectItemByText(cellData.formatStr);
            }
            if ("formats" in cellData) {
                if (!ej.isNullOrUndefined(cellData.formats["font-size"]))
                    sizelObj.selectItemByText(cellData.formats["font-size"].split("pt")[0]);
                else
                    sizelObj.selectItemByText("11");
                if (ej.isNullOrUndefined(cellData.formats["font-style"]) && ej.isNullOrUndefined(cellData.formats["font-weight"]))
                    styelObj.selectItemByText("Normal");
                if (!ej.isNullOrUndefined(cellData.formats["font-style"] && ej.isNullOrUndefined(cellData.formats["font-weight"])))
                    styelObj.selectItemByText(cellData.formats["font-style"].capitalizeFirstString());
                if (!ej.isNullOrUndefined(cellData.formats["font-weight"] && ej.isNullOrUndefined(cellData.formats["font-style"])))
                    styelObj.selectItemByText(cellData.formats["font-weight"].capitalizeFirstString());
                if (!ej.isNullOrUndefined(cellData.formats["font-style"]) && !ej.isNullOrUndefined(cellData.formats["font-weight"]))
                    styelObj.selectItemByText("Bold Italic");
                if (!ej.isNullOrUndefined(cellData.formats["font-family"]))
                    familyObj.selectItemByText(cellData.formats["font-family"].replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }));
                else
                    familyObj.selectItemByText("Calibri");
                if (!ej.isNullOrUndefined(cellData.formats["text-decoration"]))
                    effectObj.selectItemByText(cellData.formats["text-decoration"])
                else
                    effectObj.clearText();
                if (!ej.isNullOrUndefined(cellData.formats["color"]))
                    fontClObj.setValue(cellData.formats["color"]);
                else
                    fontClObj.setValue("#333333");
                if (!ej.isNullOrUndefined(cellData.formats["background-color"]))
                    fillClObj.setValue(cellData.formats["background-color"]);
                else
                    fillClObj.setValue("#FFFFFF");
            }
            else
                this._changeNormalFont({ isChecked: true });
            decimalTxtbox.option("value", decimalPlaces);
            $("#" + xlObj._id + "_fdlg_nTab_kseptr").ejCheckBox({ checked: separator });
            this._onNumFormatSelect({ value: numlObj ? numlObj.model.value : numddlObj.model.value });
        },

        _onNumFormatSelect: function (args) {
            var xlObj = this.XLObj, optId = "#" + xlObj._id + "_fdlg_nTab_", infoLbl = $("#" + xlObj._id + "_fdlg_nTab_typeinfo"), formattedText, value = args.value;
            $("#" + xlObj._id + "_formatdlg_number").find(".e-fdlg-num-options").hide();
            switch (value) {
                case "Number":
                    if (xlObj.model.formatSettings.allowDecimalPlaces)
                        $(optId + "decimal, " + optId + "tseparator, " + optId + "decimaldrop").show();
                    break;
                case "Currency":
                case "Accounting":
                case "Percentage":
                case "Scientific":
                    $(optId + "decimal").show();
                    $(optId + "decimaldrop").show();
                    break;
                case "Date":
                    $(optId + "dtypes").show();
                    $("#" + xlObj._id + "_fdlg_nTab_datetypes").data("ejListBox")._refreshScroller();
                    break;
                case "Time":
                    $(optId + "ttypes").show();
                    $("#" + xlObj._id + "_fdlg_nTab_timetypes").data("ejListBox")._refreshScroller();
                    break;
                case "Custom":
                    $(optId + "custom").show();
                    $("#" + xlObj._id + "_fdlg_nTab_customtypes").data("ejListBox")._refreshScroller();
                    break;
            }
            formattedText = this._getFormattedText(value);
            $("#" + xlObj._id + "_fdlg_nTab_decimalplace").data("ejNumericTextbox").option("maxValue", value === "Scientific" ? 20 : 30);
            $("#" + xlObj._id + "_fdlg_nTab_sinput").val(formattedText);
            infoLbl.text(xlObj._getLocStr(value));
            this._selValue = value
        },

        _getFormattedText: function (type) {
            var formatStr, isSeparator, value, cValue, formatObj, decimal = 0, xlObj = this.XLObj, actCell = xlObj.getActiveCell(), decimalTxtbox = $("#" + xlObj._id + "_fdlg_nTab_decimalplace").data("ejNumericTextbox"), datetype = $("#" + xlObj._id + "_fdlg_nTab_datetypes").data("ejListBox"),
                formattype = { Number: "0:N", Currency: "0:C", Accounting: "0:C", Percentage: "0:P", Scientific: "0:N" }, timetype = $("#" + xlObj._id + "_fdlg_nTab_timetypes").data("ejListBox"), cellType = ej.Spreadsheet.CellType, cellFormat = ej.Spreadsheet.CellFormat,
                customList = $("#" + xlObj._id + "_fdlg_nTab_customtypes").data("ejListBox");
            if (xlObj.model.formatSettings.allowDecimalPlaces)
                decimal = decimalTxtbox.getValue();
            value = xlObj.XLEdit.getPropertyValue(actCell.rowIndex, actCell.colIndex) || "";
            isSeparator = $("#" + xlObj._id + "_fdlg_nTab_kseptr").ejCheckBox("checked");
            switch (type) {
                case "Number":
                case "Currency":
                case "Accounting":
                case "Percentage":
                    formatStr = "{" + formattype[type] + decimal + "}";
                    if (xlObj._isDateTime(value))
                        value = xlObj._dateToInt(value);
                    value = xlObj.XLFormat._format(value, xlObj.XLFormat._getFormatObj({ formatStr: formatStr, thousandSeparator: isSeparator, type: cellType[type], decimalPlaces: decimal }));
                    break;
                case "Date":
                    formatStr = datetype.getSelectedItems()[0].value;
                    type = formatStr === cellFormat["longdate"] ? "longdate" : formatStr === cellFormat["shortdate"] ? "shortdate" : "date";
                    value = xlObj.XLFormat._format(value, xlObj.XLFormat._getFormatObj({ formatStr: formatStr, type: type }));
                    break;
                case "Time":
                    formatStr = timetype.getSelectedItems()[0].value;
                    value = xlObj.XLFormat._format(value, xlObj.XLFormat._getFormatObj({ formatStr: formatStr, type: cellType[type] }));
                    decimal = 0;
                    break;
                case "Scientific":
                    formatStr = "{" + formattype[type] + decimal + "}";
                    if (xlObj._isDateTime(value))
                        value = xlObj._dateToInt(value);
                    value = xlObj.XLFormat._format(value, xlObj.XLFormat._getFormatObj({ formatStr: formatStr, thousandSeparator: isSeparator, type: cellType[type], decimalPlaces: decimal }));
                    break;
                case "Fraction":
                    if (xlObj._isDateTime(value))
                        value = xlObj._dateToInt(value);
                    value = xlObj.toFraction(value);
                    if (value)
                        value = ej.isNullOrUndefined(value.numerator) ? value.integer : value.integer + " " + value.numerator + "/" + value.denominator;
                    break;
                case "General":
                case "Text":
                    if (xlObj._isDateTime(value))
                        value = xlObj._dateToInt(value);
                    break;
                case "Custom":
                    cValue = customList.getSelectedItems()[0].text;
                    formatObj = xlObj.XLFormat.customFormatParser(cValue);
                    $("#" + xlObj._id + "_fdlg_nTab_custominput").val(cValue);
                    value = xlObj.XLFormat._format(value, formatObj);
                    if (customList.getSelectedItems()[0].index > -1)
                        $("#" + xlObj._id + "_fdlg_nTab_delBtn").data("ejButton")._setModel({ enabled: customList.model.dataSource[customList.getSelectedItems()[0].index].type === "custom" });
                    break;
            }
            $("#" + xlObj._id + "_formatdlg_format_dataMnger").data("NumFormat", type === "Custom" ? formatObj : { type: type.toLowerCase(), decimalPlaces: decimal, thousandSeparator: isSeparator, formatStr: formatStr });
            return value;
        },

        _numberTabChange:function(args){
            var xlObj = this.XLObj, numlObj = $("#" + xlObj._id + "_fdlg_nTab_list").data("ejListBox"), familyObj = $("#" + xlObj._id + "_fdlg_fonttab_familylist").data("ejListBox"),
                styelObj = $("#" + xlObj._id + "_fdlg_fonttab_stylelist").data("ejListBox"), sizelObj = $("#" + xlObj._id + "_fdlg_fonttab_sizelist").data("ejListBox");
            numlObj && numlObj._refreshScroller();
            styelObj && styelObj._refreshScroller();
            sizelObj && sizelObj._refreshScroller();
            familyObj && familyObj._refreshScroller();
        },

        _refreshFrmtPropChanges: function (args) {
            var xlObj = this.XLObj, formattedText;
            formattedText = this._getFormattedText(this._selValue);
            $("#" + xlObj._id + "_fdlg_nTab_sinput").val(formattedText);
        },

        _dlgCFCancel: function (args) {
            var xlObj = this.XLObj;
            $("#" + xlObj._id + "_formatdlg").ejDialog("close");
            xlObj.model.showRibbon && xlObj.XLRibbon._updateRibbonIcons();
            xlObj._setSheetFocus();
        },

        _dlgCFOk: function (args) {
            var xlObj = this.XLObj
            if (xlObj.XLFormat._styleDlgClick) {
                $("#" + xlObj._id + "_formatdlg").ejDialog("close");
                xlObj._setSheetFocus();
                return;
            }
            var dataMngr = $("#" + xlObj._id + "_formatdlg_format_dataMnger").data();
            if (args && this._selValue === "Custom" && this._validateCustomFormat())
                return;
            if (xlObj.getObjectLength(dataMngr)) {
                if (xlObj.getObjectLength(dataMngr.NumFormat)) {
                    dataMngr.NumFormat.style = dataMngr.style;
                    xlObj.XLFormat.format(dataMngr.NumFormat);
                }
                else
                    xlObj.XLFormat.format(dataMngr);
            }
            xlObj.model.showRibbon && xlObj.XLRibbon._updateRibbonIcons();
            $("#" + xlObj._id + "_formatdlg").ejDialog("close");
            xlObj._setSheetFocus();
        },

        _customFormatDelete: function (args) {
            var lbInst = $("#" + this.XLObj._id + "_fdlg_nTab_customtypes").data("ejListBox"), dataSrc = lbInst.model.dataSource;
            dataSrc.splice(lbInst.model.selectedItemIndex, 1);
            lbInst._setModel({ dataSource: dataSrc });
            lbInst.selectItemByIndex(0);
            this._refreshFrmtPropChanges();
        },

        _validateCustomFormat: function (e) {
            var xlObj = e ? this : this.XLObj, lbInst, dataSrc, alertDlg, text = $("#" + xlObj._id + "_fdlg_nTab_custominput").val(), format = xlObj.XLFormat.customFormatParser(text);
            if (e && e.keyCode !== 13)
                return;
            if (xlObj.getObjectLength(format)) {
                lbInst = $("#" + xlObj._id + "_fdlg_nTab_customtypes").data("ejListBox");
                dataSrc = lbInst.model.dataSource;
                if (!xlObj._isValueAlreadyExist(dataSrc, "text", text)) {
                    dataSrc.push({ text: text, type: "custom" });
                    lbInst._setModel({ dataSource: dataSrc });
                }
                $("#" + xlObj._id + "_formatdlg_format_dataMnger").data("NumFormat", format);
                e && xlObj.XLCellFrmtDlg._dlgCFOk();
            }
            else {
                alertDlg = $("#" + xlObj._id + "_alertdlg");
                xlObj._renderAlertDlgContent(alertDlg, "Alert", xlObj._getLocStr("CustomFormatAlert"));
                alertDlg.ejDialog("open");
                return true;
            }
        },

        _onFontFamilySelect: function(args){
            var xlObj = this.XLObj, text = args.text;
            $("#" + xlObj._id + "_fdlg_fonttab_familytext")[0].value = text;
            $("#" + xlObj._id + "_fdlg_fonttab_sinput")[0].style.fontFamily = text;
            $("#" + xlObj._id + "_fdlg_fonttab_sinput2")[0].style.fontFamily = text;
            $("#" + xlObj._id + "_formatdlg_format_dataMnger").data().style["font-family"] = text;
            if(text !="Calibri")
            {
                $("#"+ xlObj._id +"_fdlg_fonttab_normalfont").ejCheckBox({ checked: false });
                $("#"+ xlObj._id +"_fdlg_fonttab_normalfont2").ejCheckBox({ checked: false });
            }
        },

        _changeNormalFont: function (args) {
            if (args && args.isChecked) {
                var xlObj = this.XLObj, familyObj = $("#" + xlObj._id + "_fdlg_fonttab_familylist").data("ejListBox"), styelObj = $("#" + xlObj._id + "_fdlg_fonttab_stylelist").data("ejListBox"), sizelObj = $("#" + xlObj._id + "_fdlg_fonttab_sizelist").data("ejListBox"),
                effectObj = $("#" + xlObj._id + "_fdlg_fonttab_effectstext").data("ejDropDownList"), fontClObj = $("#" + xlObj._id + "_fdlg_fonttab_colortext").data("ejColorPicker"), fillClObj = $("#" + xlObj._id + "_fdlg_fonttab_fillcolortext").data("ejColorPicker"),
                familyObj2 = $("#" + xlObj._id + "_fdlg_fonttab_family").data("ejDropDownList"), styelObj2 = $("#" + xlObj._id + "_fdlg_fonttab_style").data("ejDropDownList"), sizelObj2 = $("#" + xlObj._id + "_fdlg_fonttab_size").data("ejDropDownList"),
                effectObj2 = $("#" + xlObj._id + "_fdlg_fonttab_effects").data("ejDropDownList"), fontClObj2 = $("#" + xlObj._id + "_fdlg_fonttab_color").data("ejColorPicker"), fillClObj2 = $("#" + xlObj._id + "_fdlg_fonttab_fillcolor").data("ejColorPicker");
                sizelObj.selectItemByText("11"); styelObj.selectItemByText("Normal"); familyObj.selectItemByText("Calibri"); effectObj.clearText(); sizelObj2.selectItemByText("11"); styelObj2.selectItemByText("Normal");
                familyObj2.selectItemByText("Calibri"); effectObj2.clearText(); fillClObj2.setValue("#FFFFFF"); fontClObj2.setValue("#333333");
                $("#" + xlObj._id + "_fdlg_fonttab_sinput")[0].style.textDecoration = "none";
                $("#" + xlObj._id + "_fdlg_fonttab_sinput2")[0].style.textDecoration = "none";
                fillClObj.setValue("#FFFFFF"); fontClObj.setValue("#333333");
            }
        },

        _onFontStyleSelect: function (args) {
            var xlObj = this.XLObj, text = args.text, inputElem = $("#" + xlObj._id + "_fdlg_fonttab_sinput")[0], inputElem2 = $("#" + xlObj._id + "_fdlg_fonttab_sinput2")[0],
                chkObj = $("#" + xlObj._id + "_fdlg_fonttab_normalfont").data("ejCheckBox"), chkObj1 = $("#" + xlObj._id + "_fdlg_fonttab_normalfont2").data("ejCheckBox");
            $("#" + xlObj._id + "_fdlg_fonttab_styletext")[0].value = text;
            switch (text) {
                case "Bold":
                    $("#" + xlObj._id + "_formatdlg_format_dataMnger").data().style["font-weight"] = text;
                    inputElem.style.fontWeight = text;
                    inputElem.style.removeProperty("font-style");
                    inputElem2.style.fontWeight = text;
                    inputElem2.style.removeProperty("font-style");
                    chkObj.option({ checked: false });
                    chkObj1.option({ checked: false });
                    break;
                case "Italic":
                    $("#" + xlObj._id + "_formatdlg_format_dataMnger").data().style["font-style"] = text;
                    inputElem.style.fontStyle = text;
                    inputElem.style.removeProperty("font-weight");
                    inputElem2.style.fontStyle = text;
                    inputElem2.style.removeProperty("font-weight");
                    chkObj.option({ checked: false });
                    chkObj1.option({ checked: false });
                    break;
                case "Bold Italic":
                    $("#" + xlObj._id + "_formatdlg_format_dataMnger").data().style["font-weight"] = "Bold";
                    $("#" + xlObj._id + "_formatdlg_format_dataMnger").data().style["font-style"] = "Italic";
                    inputElem.style.fontStyle = "Italic";
                    inputElem.style.fontWeight = "Bold";
                    inputElem2.style.fontStyle = "Italic";
                    inputElem2.style.fontWeight = "Bold";
                    chkObj.option({ checked: false });
                    chkObj1.option({ checked: false });
                    break;
                case "Normal":
                    $("#" + xlObj._id + "_formatdlg_format_dataMnger").data().style["font-weight"] = "normal";
                    $("#" + xlObj._id + "_formatdlg_format_dataMnger").data().style["font-style"] = "normal";
                    inputElem.style.removeProperty("font-weight");
                    inputElem.style.removeProperty("font-style");
                    inputElem2.style.removeProperty("font-weight");
                    inputElem2.style.removeProperty("font-style");
            }
        },

        _onFontSizeSelect:function(args){
            var xlObj = this.XLObj, text = args.text;
            $("#" + xlObj._id + "_fdlg_fonttab_sizetext")[0].value = text;
            $("#" + xlObj._id + "_fdlg_fonttab_sinput")[0].style.fontSize = text + "pt";
            $("#" + xlObj._id + "_fdlg_fonttab_sinput2")[0].style.fontSize = text + "pt";
            $("#" + xlObj._id + "_formatdlg_format_dataMnger").data().style["font-size"] = text + "pt";
            if (text != "11") {
                $("#" + xlObj._id + "_fdlg_fonttab_normalfont").ejCheckBox({ checked: false });
                $("#" + xlObj._id + "_fdlg_fonttab_normalfont2").ejCheckBox({ checked: false });
            }
        },

        _onFontEffectSelect: function(args){
            var xlObj = this.XLObj, text = args.text;
            $("#" + xlObj._id + "_formatdlg_format_dataMnger").data().style["text-decoration"] = text;
            $("#" + xlObj._id + "_fdlg_fonttab_sinput")[0].style.textDecoration = text;
            $("#" + xlObj._id + "_fdlg_fonttab_sinput2")[0].style.textDecoration = text;
            if (text != "None") {
                $("#" + xlObj._id + "_fdlg_fonttab_normalfont").ejCheckBox({ checked: false });
                $("#" + xlObj._id + "_fdlg_fonttab_normalfont2").ejCheckBox({ checked: false });
            }
        },

        _ChangeCPHandler: function (name, args) {
            var xlFormat, xlObj = this.XLObj;
            if (args.type === "open") {
                $("#" + xlObj._id + "_" + name + "_popup").find(".e-buttons, .e-button").hide();
                $("#" + xlObj._id + "_" + name + "_popup").focus();
            }
            else if (args.type === "change") {
                var cpObj = $("#" + xlObj._id + "_" + name).data("ejColorPicker");
                if (name === "fdlg_fonttab_fillcolortext" || name === "fdlg_fonttab_fillcolor") {
                    $("#" + xlObj._id + "_formatdlg_format_dataMnger").data().style["background-color"] = args.value;
                    $("#" + xlObj._id + "_fdlg_fonttab_sinput").css("background-color", args.value);
                    $("#" + xlObj._id + "_fdlg_fonttab_sinput2").css("background-color", args.value);
                    if (args.value != "#FFFFFF") {
                        $("#" + xlObj._id + "_fdlg_fonttab_normalfont").ejCheckBox({ checked: false });
                        $("#" + xlObj._id + "_fdlg_fonttab_normalfont2").ejCheckBox({ checked: false });
                    }
                }
                else if (name === "fdlg_fonttab_colortext" || name === "fdlg_fonttab_color") {
                    $("#" + xlObj._id + "_formatdlg_format_dataMnger").data().style["color"] = args.value;
                    $("#" + xlObj._id + "_fdlg_fonttab_sinput").css("color", args.value);
                    $("#" + xlObj._id + "_fdlg_fonttab_sinput2").css("color", args.value);
                    if (args.value != "#333333") {
                        $("#" + xlObj._id + "_fdlg_fonttab_normalfont").ejCheckBox({ checked: false });
                        $("#" + xlObj._id + "_fdlg_fonttab_normalfont2").ejCheckBox({ checked: false });
                    }
                }
                if (cpObj) {
                    cpObj.hide();
                    xlObj._dupDetails = true;
                    cpObj.setValue(args.value);
                    xlObj._dupDetails = false;
                }
            }
        },

        _createNumList: function (categories, $left) {
            var xlObj = this.XLObj, numbertabId = xlObj._id + "_fdlg_nTab", $tdlbl, $td, $ddlInput, $listUl, $drpdiv = ej.buildTag("div.e-ss-drpdiv");
            $ddlInput = ej.buildTag("input#" + numbertabId + "_input");
            $drpdiv.append($ddlInput)
            $("#" + xlObj._id + "_formatdlg_number").prepend($drpdiv);
            $ddlInput.ejDropDownList({ dataSource: categories, cssClass: "e-ss-num-format", width: "100%", fields: { id: "value", text: "text", value: "text" }, select: $.proxy(this._onNumFormatSelect, this), selectedItemIndex: 0 });

            $tdlbl = ej.buildTag("label#" + numbertabId + "_clabel.e-dlg-fields", xlObj._getLocStr("Category"));
            xlObj.element.find(".e-ss-lefttopdiv").append($tdlbl);
            $listUl = ej.buildTag("ul#" + numbertabId + "_list");
            $left.append($listUl);
            $listUl.ejListBox({
                selectedItemIndex: "0", width: "120", height: "250", dataSource: categories,
                fields: { text: "text", value: "value" }, select: $.proxy(this._onNumFormatSelect, this),
                allowMultiSelection: false
            });
        }
    };
})(jQuery, Syncfusion);