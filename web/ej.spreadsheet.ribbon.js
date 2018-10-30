(function ($, ej, undefined) {

    ej.spreadsheetFeatures = ej.spreadsheetFeatures || {};

    ej.spreadsheetFeatures.ribbon = function (obj) {
        this.XLObj = obj;
        this._appTabCollection = {};
        this._tabCollection = [];
        this._contextualTabCollection = [];
        this._smallBtnHeight = 25;
        this._mediumBtnHeight = 35;
        this._bigBtnHeight = 75;
        this._splitBtnHeight = 75;
        this._dropDownHeight = 25;
        this._ribbonState = true;
        this._isSetModel = false;
        this._isDesignTab = true;
        this._isDirtySelect = false;
        this._isMergeSelect = false;
        this._isFirstColumn = false;
        this._isFilterSelect = {};
        this._hasTitle = "";
        this._isNmgrid = "";
        this._sparklineDesignType = "";
        this._isEditGroupLocationClick = false;
        this._isEditSingleSparklineClick = false;
        this._isPanelVisible = false;
        this._ctrlCreated = false;
        this._homeBtnIds = ["Home_Clipboard_Paste", "Home_Font_IncreaseFontSize", "Home_Font_DecreaseFontSize", "Home_Alignment_DecreaseIndent", "Home_Alignment_IncreaseIndent", "Home_Number_IncreaseDecimal", "Home_Number_DecreaseDecimal", "Home_Actions_Undo", "Home_Actions_Redo", "Home_Number_Accounting", "Home_Number_CommaStyle", "Home_Number_Percentage", "Home_Clipboard_Cut", "Home_Clipboard_Copy"];
        this._homeSptBtnIds = ["Home_Clipboard_PasteOptions", "Home_Font_Border", "Home_Styles_ConditionalFormatting", "Home_Styles_FormatAsTable", "Home_Styles_CellStyles", "Others_Editing_FindSelect", "Home_Editing_Clear", "Home_Alignment_Merge", "Home_Editing_SortFilter", "Home_Editing_AutoSum"];
        this._homeToggleBtnIds = ["Home_Font_Bold", "Home_Font_Italic", "Home_Font_Underline", "Home_Font_StrikeThrough", "Home_Alignment_AlignLeft", "Home_Alignment_AlignRight", "Home_Alignment_AlignCenter", "Home_Alignment_TopAlign", "Home_Alignment_MiddleAlign", "Home_Alignment_BottomAlign", "Home_Alignment_WrapText", "Home_Clipboard_FormatPainter"];
        this._homeDdIds = ["Home_Number_NumberFormat", "Home_Font_FontSize", "Home_Font_FontFamily"];
        this._homeCpIds = ["Home_Font_FillColor", "Home_Font_FontColor"];
        this._insertBtnIds = ["Insert_Tables_PivotTable", "Insert_Tables_Table", "Insert_Links_Hyperlink", "Insert_Illustrations_Pictures", "Insert_Sparkline_Line", "Insert_Sparkline_Column", "Insert_Sparkline_Winloss"];
        this._insertSptBtnIds = ["Insert_Charts_ColumnChart", "Insert_Charts_BarChart", "Insert_Charts_StockChart", "Insert_Charts_LineChart", "Insert_Charts_AreaChart", "Insert_Charts_PieChart", "Insert_Charts_ScatterChart"];
        this._dataBtnIds = ["Data_SortFilter_SortAtoZ", "Data_SortFilter_SortZtoA", "Data_SortFilter_Filter", "Data_SortFilter_ClearFilter", "Data_DataTools_DataValidation"];
        this._dataSptBtnIds = ["Data_DataTools_DataValidationOptions"];
        this._pageLayChckBxIds = ["PageLayout_Show_Headings", "PageLayout_Show_Gridlines"];
        this._pageLayBtnIds = ["PageLayout_PageLayout_PageSize", "PageLayout_Print_Print", "PageLayout_Print_PrintSelected"];
        this._pageLaySptBtnIds = ["PageLayout_PageLayout_PageSizeOptions"];
        this._reviewTglBtnIds = ["Review_Changes_ProtectSheet", "Review_Changes_ProtectWorkbook", "Review_Changes_LockCell"];
        this._cmntBtnIds = ["Review_Comments_NewComment", "Review_Comments_DeleteComment", "Review_Comments_PreviousComment", "Review_Comments_NextComment", "Review_Comments_ShowHideComment"];
        this._cmntTglBtnIds = ["Review_Comments_ShowAllComments"];
        this._othersBtnIds = ["Others_Cells_InsertCell", "Others_Cells_DeleteCell", "Others_Formulas_NameManager", "Others_Formulas_DefineName", "Others_CalCulation_CalculateNow", "Others_CalCulation_CalculateSheet"];
        this._othersSptBtnIds = ["Others_Cells_InsertCellOptions", "Others_Cells_DeleteCellOptions", "Others_Editing_FindSelect", "Others_Window_FreezePanes", "Others_CalCulation_CalculationOptions"];
        this._contextualBtnIds = ["Design_Tools_ResizeTable", "Design_Tools_ConvertToRange"];
        this._contextualInputIds = ["Ribbon_Design_Properties_TableName"];
        this._contextualCheckBoxIds = ["Design_TableStyleOptions_FirstColumn", "Design_TableStyleOptions_LastColumn", "Design_TableStyleOptions_TotalRow", "Design_TableStyleOptions_FilterColumn"];
        this._protectStateBtnIds = ["Home_Clipboard_Cut", "Home_Clipboard_Copy", "Others_Editing_FindSelect", "Home_Clipboard_Paste", "Home_Clipboard_PasteOptions", "Home_Actions_Undo", "Home_Actions_Redo", "Review_Changes_ProtectSheet", "Review_Changes_ProtectWorkbook", "PageLayout_Print_Print", "PageLayout_Print_PrintSelected", "Others_Cells_InsertCellOptions", "Others_Cells_DeleteCellOptions", "Others_Cells_InsertCell", "Others_Cells_DeleteCell"];
        this._chartDesignBtnIds = ["ChartDesign_Data_SwitchRowColumn", "ChartDesign_Data_SelectData", "ChartDesign_Type_ChangeChartType"];
        this._chartDesignSptBtnIds = ["ChartDesign_ChartLayouts_AddChartElement"];
        this._chartDesignDdIds = ["ChartDesign_ChartThemes_ChartThemes"];
        this._sparklineDesignSptBtnIds = ["SparklineDesign_Sparkline_EditData", "SparklineDesign_Style_SparklineColor", "SparklineDesign_Style_MarkerColor"];
        this._formatBtnIds = ["Format_Adjust_ChangePicture"];
        this._formatSptBtnIds = ["Format_Adjust_ResetPicture", "Format_Border_PictureBorder"];
        this._pasteMenuData = [
            { id: "PasteSpecial", text: obj._getLocStr("PasteSpecial"), parentId: null },
            { id: "PasteValues", text: obj._getLocStr("PasteValues"), parentId: null }
        ];
        this._fontFamily = [{ value: "1", text: "Angsana New" }, { value: "2", text: "Arial" }, { value: "3", text: "Arial Black" }, { value: "4", text: "Batang" }, { value: "5", text: "Book Antiqua" }, { value: "6", text: "Browallia New" }, { value: "7", text: "Calibri" }, { value: "8", text: "Cambria" }, { value: "9", text: "Candara" }, { value: "10", text: "Century" }, { value: "11", text: "Comic Sans MS" }, { value: "12", text: "Consolas" }, { value: "13", text: "Constantia" }, { value: "14", text: "Corbel" }, { value: "15", text: "Cordia New" }, { value: "16", text: "Courier" }, { value: "17", text: "Courier New" }, { value: "18", text: "DilleniaUPC" }, { value: "19", text: "Dotum" }, { value: "20", text: "FangSong" }, { value: "21", text: "Garamond" }, { value: "22", text: "Georgia" }, { value: "23", text: "Gulim" }, { value: "24", text: "GungSuh" }, { value: "25", text: "KaiTi" }, { value: "26", text: "JasmineUPC" }, { value: "27", text: "Malgun Gothic" }, { value: "28", text: "Mangal" }, { value: "29", text: "Meiryo" }, { value: "30", text: "Microsoft JhengHei" }, { value: "31", text: "Microsoft YaHei" }, { value: "32", text: "MingLiu" }, { value: "33", text: "MingLiU_HKSCS" }, { value: "34", text: "MS Gothic" }, { value: "35", text: "MS Mincho" }, { value: "36", text: "MS PGothic" }, { value: "37", text: "MS PMincho" }, { value: "38", text: "PMingliU" }, { value: "39", text: "PMingLiU-ExtB" }, { value: "40", text: "SimHei" }, { value: "41", text: "SimSun" }, { value: "42", text: "SimSun-ExtB" }, { value: "43", text: "Tahoma" }, { value: "44", text: "Times" }, { value: "45", text: "Times New Roman" }, { value: "46", text: "Trebuchet MS" }, { value: "47", text: "Verdana" }, { value: "48", text: "Yu Gothic" }, { value: "49", text: "Yu Mincho" }];
        this._fontSize = [{ value: "8pt", text: "8" }, { value: "9pt", text: "9" }, { value: "10pt", text: "10" }, { value: "11pt", text: "11" }, { value: "12pt", text: "12" }, { value: "14pt", text: "14" }, { value: "16pt", text: "16" }, { value: "18pt", text: "18" }, { value: "20pt", text: "20" }, { value: "22pt", text: "22" }, { value: "24pt", text: "24" }, { value: "26pt", text: "26" }, { value: "28pt", text: "28" }, { value: "36pt", text: "36" }, { value: "48pt", text: "48" }, { value: "72pt", text: "72" }];
        this._fontStyle = [{ value: "1", text: "Normal" }, { value: "2", text: "Bold" }, { value: "3", text: "Italic" }, { value: "4", text: "Bold Italic" }];
        this._mergeMenuData = [
            { id: "MergeAndCenter", text: obj._getLocStr("MergeAndCenter"), parentId: null, sprite: "e-icon e-ss-mergecenter" },
            { id: "MergeAcross", text: obj._getLocStr("MergeAcross"), parentId: null, sprite: "e-icon e-ss-mergeacross" },
            { id: "MergeCells", text: obj._getLocStr("MergeCells"), parentId: null, sprite: "e-icon e-ss-merge" },
            { id: "UnmergeCells", text: obj._getLocStr("UnmergeCells"), parentId: null, sprite: "e-icon e-ss-unmerge" }
        ];
        this._sortFltrMenuData = [
            { id: 'Ribbon_SortAtoZ', text: this.XLObj._getLocStr('SortAtoZ'), parentId: null, sprite: 'e-icon e-ssdrop-sortatoz' },
            { id: 'Ribbon_SortZtoA', text: this.XLObj._getLocStr('SortZtoA'), parentId: null, sprite: 'e-icon e-ssdrop-sortztoa' },
            { id: 'Ribbon_Filter', text: this.XLObj._getLocStr('Filter'), parentId: null, sprite: 'e-icon e-ssdrop-filter' },
            { id: 'Ribbon_ClearFilter', text: this.XLObj._getLocStr('ClearFilter'), parentId: null, sprite: 'e-icon e-ssdrop-clearfilter' }
        ];
        this._findMenuData = [
            { id: "Find", text: obj._getLocStr("Find") + "...", parentId: null, sprite: "e-icon e-ss-find" },
            { id: "Replace", text: obj._getLocStr("Replace") + "...", parentId: null, sprite: "e-icon e-ss-replace" },
            { id: "GoTo", text: obj._getLocStr("GoTo") + "...", parentId: null, sprite: "e-icon e-ss-goto" },
            { id: "GoToSpecial", text: obj._getLocStr("GoTo") + " " + obj._getLocStr("Special") + "...", parentId: null },
            { id: "Formulas", text: obj._getLocStr("Formulas"), parentId: null },
            { id: "Comments", text: obj._getLocStr("Comments"), parentId: null },
            { id: "CFormat", text: obj._getLocStr("ConditionalFormat"), parentId: null },
            { id: "Constants", text: obj._getLocStr("Constants"), parentId: null },
            { id: "DataValidation", text: obj._getLocStr("DataValidation"), parentId: null }
        ];
        this._calcOptData = [
            { id: this.XLObj._id + "_CalcAuto", text: obj._getLocStr("Automatic"), parentId: null, sprite: "e-icon e-ss-calcauto" },
            { id: this.XLObj._id + "_CalcManual", text: obj._getLocStr("Manual"), parentId: null, sprite: "e-icon" }
        ];
        this._valMenuData = [
            { id: "Validation", text: obj._getLocStr("DataValidation") + "...", parentId: null, sprite: "e-icon e-ss-validation" },
            { id: "HighlightVal", text: obj._getLocStr("HighlightVal"), parentId: null, sprite: "e-icon e-ss-hlval" },
            { id: "ClearHLVal", text: obj._getLocStr("ClearFormats"), parentId: null, sprite: "e-icon e-ss-clearval" },
            { id: "ClearVal", text: obj._getLocStr("ClearVal"), parentId: null, sprite: "e-icon e-ss-clearval" }
        ];
        this._pageSizes = [
            { id: "A4", text: "A4", parentId: null, sprite: "e-icon e-ss-A4size" },
            { id: "A3", text: "A3", parentId: null, sprite: "e-icon e-ss-A3size" },
            { id: "Letter", text: "Letter", parentId: null, sprite: "e-icon e-ss-lettersize" }
        ];
        this._viewMenuData = [
            { id: "freezePanes", text: obj._getLocStr("FreezePanes"), parentId: null, sprite: "e-icon e-ss-frzpane" },
            { id: "FreezeTopRow", text: obj._getLocStr("FreezeTopRow"), parentId: null, sprite: "e-icon e-ss-frzrow" },
            { id: "FreezeFirstColumn", text: obj._getLocStr("FreezeFirstColumn"), parentId: null, sprite: "e-icon e-ss-frzcln" }
        ];
        this._insertMenuData = [
            { id: 'InsertCells', text: obj._getLocStr('InsCells') + "...", parentId: null, sprite: 'e-icon e-ssr-inscell' },
            { id: 'InsertSheetRows', text: obj._getLocStr('InsRows'), parentId: null, sprite: 'e-icon e-ssr-insrow' },
            { id: 'InsertSheetColumns', text: obj._getLocStr('InsCols'), parentId: null, sprite: 'e-icon e-ssr-inscol' },
            { id: 'InsertSheet', text: obj._getLocStr('InsSheet'), parentId: null, sprite: 'e-icon e-ssr-inssheet' }
        ];
        this._resetPicture = [
            { id: "resetpicture", text: obj._getLocStr("ResetPicture"), parentId: null, sprite: "e-icon e-ss-resetpicture" },
            { id: "resetsize", text: obj._getLocStr("ResetSize"), parentId: null, sprite: "e-icon e-ss-resetpicture" }
        ];
        var borderstyle = obj._getLocStr("BorderStyles").split("/");
        this._borderMenuData = [
            { id: "bottom", text: obj._getLocStr("BottomBorder"), parentId: null, sprite: "e-icon e-ss-bottom" },
            { id: "top", text: obj._getLocStr("TopBorder"), parentId: null, sprite: "e-icon e-ss-top" },
            { id: "left", text: obj._getLocStr("LeftBorder"), parentId: null, sprite: "e-icon e-ss-left" },
            { id: "right", text: obj._getLocStr("RightBorder"), parentId: null, sprite: "e-icon e-ss-right" },
            { id: "noborder", text: obj._getLocStr("NoBorder"), parentId: null, sprite: "e-icon e-ss-noborder" },
            { id: "allborder", text: obj._getLocStr("AllBorder"), parentId: null, sprite: "e-icon e-ss-allborder" },
            { id: "outside", text: obj._getLocStr("OutsideBorder"), parentId: null, sprite: "e-icon e-ss-outside" },
            { id: "thickbox", text: obj._getLocStr("ThickBoxBorder"), parentId: null, sprite: "e-icon e-ss-thickbox" },
            { id: "doublebottom", text: obj._getLocStr("BottomDoubleBorder"), parentId: null, sprite: "e-icon e-ss-doublebottom" },
            { id: "thickbottom", text: obj._getLocStr("ThickBottomBorder"), parentId: null, sprite: "e-icon e-ss-thickbottom" },
            { id: "topandbottom", text: obj._getLocStr("TopandBottomBorder"), parentId: null, sprite: "e-icon e-ss-topandbottom" },
            { id: "topandthickbottom", text: obj._getLocStr("TopandThickBottomBorder"), parentId: null, sprite: "e-icon e-ss-topandthickbottom" },
            { id: "topanddoublebottom", text: obj._getLocStr("TopandBottomDoubleBorder"), parentId: null, sprite: "e-icon e-ss-topanddoublebottom" },
            { id: "drawborder", text: obj._getLocStr("DrawBorder"), parentId: null, sprite: "e-icon e-ss-drawborder" },
            { id: "drawbordergrid", text: obj._getLocStr("DrawBorderGrid"), parentId: null, sprite: "e-icon e-ss-drawbordergrid" },
            { id: obj._id + "_bordercolor", text: obj._getLocStr("BorderColor"), parentId: null },
            { id: obj._id + "_Ribbon_borderstyle", text: obj._getLocStr("BorderStyle"), parentId: null },
            { id: obj._id + "_Ribbon_bordercolor", text: "", parentId: obj._id + "_bordercolor" },
            { id: "solid", text: borderstyle[0], parentId: obj._id + "_Ribbon_borderstyle" },
            { id: "dashed", text: borderstyle[1], parentId: obj._id + "_Ribbon_borderstyle" },
            { id: "dotted", text: borderstyle[2], parentId: obj._id + "_Ribbon_borderstyle" },
            { id: "double", text: borderstyle[3], parentId: obj._id + "_Ribbon_borderstyle" }
        ];
        this._cFormatMenuData = [
            { id: obj._id + "_HLCellRules", text: obj._getLocStr("HighlightCellRules"), parentId: null, sprite: "e-icon e-ss-hlcellrules" },
            { id: "greaterthan", text: obj._getLocStr("GreaterThan") + "...", parentId: obj._id + "_HLCellRules", sprite: "e-icon e-ss-greaterthan" },
            { id: "lessthan", text: obj._getLocStr("LessThan") + "...", parentId: obj._id + "_HLCellRules", sprite: "e-icon e-ss-lessthan" },
            { id: "between", text: obj._getLocStr("Between") + "...", parentId: obj._id + "_HLCellRules", sprite: "e-icon e-ss-between" },
            { id: "equalto", text: obj._getLocStr("EqualTo") + "...", parentId: obj._id + "_HLCellRules", sprite: "e-icon e-ss-equalto" },
            { id: "textcontains", text: obj._getLocStr("TextthatContains") + "...", parentId: obj._id + "_HLCellRules", sprite: "e-icon e-ss-textcontains" },
            { id: "dateoccur", text: obj._getLocStr("DateOccurring") + "...", parentId: obj._id + "_HLCellRules", sprite: "e-icon e-ss-dateoccur" },
            { id: obj._id + "_CreateRule", text: obj._getLocStr('CreateRule'), parentId: null, sprite: "e-icon e-ss-createrule" },
            { id: obj._id + "_ClearRules", text: obj._getLocStr('ClearRules'), parentId: null, sprite: "e-icon e-ss-clearrules" },
            { id: "clearselected", text: obj._getLocStr('ClearRulesfromSelected'), parentId: obj._id + "_ClearRules" },
            { id: "clearall", text: obj._getLocStr('ClearRulesfromEntireSheets'), parentId: obj._id + "_ClearRules" }
        ];
        this._textAlign = [{ value: "1", text: "Left" }, { value: "2", text: "Center" }, { value: "3", text: "Right" }];
        this._verticalAlign = [{ value: "1", text: "Top" }, { value: "2", text: "Middle" }, { value: "3", text: "Bottom" }];
        var dataVal = obj._getLocStr("DataValidationAction").split("/");
        this._actions = [{ value: "Greater", text: dataVal[0] }, { value: "GreaterOrEqual", text: dataVal[1] }, { value: "Less", text: dataVal[2] }, { value: "LessOrEqual", text: dataVal[3] }, { value: "Equal", text: dataVal[4] }, { value: "NotEqual", text: dataVal[5] }, { value: "Between", text: dataVal[6] }, { value: "NotBetween", text: dataVal[7] }];
        dataVal = obj._getLocStr("DataValidationType").split("/");
        this._types = [{ value: "number", text: dataVal[0] }, { value: "decimal", text: dataVal[1] }, { value: "date", text: dataVal[2] }, { value: "time", text: dataVal[3] }, { value: "text", text: dataVal[4] }, { value: "list", text: dataVal[5] }];
        this._cFormatData = { greaterthan: ["GTTitle", "GTContent"], lessthan: ["LTTitle", "LTContent"], between: ["BWTitle", "BWContent"], equalto: ["EQTitle", "EQContent"], textcontains: ["ContainsTitle", "ContainsContent"], dateoccur: ["DateTitle", "DateContent"] };
        this._styles = [{ value: "redft", text: obj._getLocStr("LightRedFillDark") }, { value: "yellowft", text: obj._getLocStr("YellowFillDark") }, { value: "greenft", text: obj._getLocStr("GreenFillDark") }, { value: "redf", text: obj._getLocStr("RedFill") }, { value: "redt", text: obj._getLocStr("RedText") }];
        this._currentCFormat = "";
        this._addrList = [];
        this._within = [{ value: "sheet", text: obj._getLocStr("Sheet") }, { value: "workbook", text: obj._getLocStr("Workbook") }];
        this._sType = [{ value: "columns", text: obj._getLocStr("Columns") }, { value: "rows", text: obj._getLocStr("Rows") }];
        this._vType = [{ value: "value", text: obj._getLocStr("Value") }, { value: "formula", text: obj._getLocStr("Formula") }, { value: "comment", text: obj._getLocStr("Comments") }];
        this._direction = [{ value: "down", text: obj._getLocStr("Down") }, { value: "up", text: obj._getLocStr("Up") }];
        this._gotoRBtnSet1 = ["Comments", "Blanks", "LastCell", "Formulas", "Constants"];
        this._gotoRBtnSet2 = ["RowDiff", "ColDiff", "CFormat", "DataValidation"];
        this._gotoChkBox = ["GotoNumbers", "GotoText", "GotoLogicals", "GotoError"];
        this._numberFormat = [{ value: "General", text: obj._getLocStr("LGeneral") }, { value: "Number", text: obj._getLocStr("NumberTab") }, { value: "Currency", text: obj._getLocStr("LCurrency") }, { value: "Accounting", text: obj._getLocStr("LAccounting") }, { value: "Percentage", text: obj._getLocStr("LPercentage") }, { value: "Text", text: obj._getLocStr("LText") }, { value: "Shortdate", text: obj._getLocStr("LShortdate") }, { value: "Longdate", text: obj._getLocStr("LLongdate") }, { value: "Time", text: obj._getLocStr("LTime") }, { value: "Scientific", text: obj._getLocStr("LScientific") }, { value: "Fraction", text: obj._getLocStr("LFraction") }, { value: "Custom", text: obj._getLocStr("LCustom") }];
        this._deleteMenuData = [
            { id: "DeleteCells", text: obj._getLocStr("DelCells") + "...", parentId: null, sprite: "e-icon e-ssr-delcell" },
            { id: "DeleteSheetRows", text: obj._getLocStr("DelRows"), parentId: null, sprite: "e-icon e-ssr-delrow" },
            { id: "DeleteSheetColumns", text: obj._getLocStr("DelCols"), parentId: null, sprite: "e-icon e-ssr-delcol" },
            { id: "DeleteSheet", text: obj._getLocStr("DelSheet"), parentId: null, sprite: "e-icon e-ssr-delsheet" }
        ];
        this._clearMenuData = [
            { id: "Clear_All", text: obj._getLocStr("ClearAll"), parentId: null, sprite: "e-icon e-ss-clear" },
            { id: "Clear_Formats", text: obj._getLocStr("ClearFormats"), parentId: null, sprite: "e-icon e-ss-clearformat" },
            { id: "Clear_Contents", text: obj._getLocStr("ClearContents"), parentId: null },
            { id: "Clear_Comments", text: obj._getLocStr("ClearComments"), parentId: null },
            { id: "Clear_Hyperlinks", text: obj._getLocStr("ClearHyperLinks"), parentId: null }
        ];
        this._autosumMenuData = [
            { id: "Sum", text: obj._getLocStr("Sum"), parentId: null, sprite: "e-icon e-ss-autosum" },
            { id: "Average", text: obj._getLocStr("Average"), parentId: null },
            { id: "Count", text: obj._getLocStr("CountNumber"), parentId: null },
            { id: "Max", text: obj._getLocStr("Max"), parentId: null },
            { id: "Min", text: obj._getLocStr("Min"), parentId: null }
        ];
        this._chartThemes = [{ value: "flatlight", text: "Flat Light" }, { value: "flatdark", text: "Flat Dark" }, { value: "azure", text: "Azure" }, { value: "azuredark", text: "Azure Dark" }, { value: "lime", text: "Lime" }, { value: "limedark", text: "Lime Dark" }, { value: "saffron", text: "Saffron" }, { value: "saffrondark", text: "Saffron Dark" }];
        this._isCustomCellStyleReset = false;
        this.allButtonIds = ["Home_Clipboard_Paste", "Home_Font_IncreaseFontSize", "Home_Font_DecreaseFontSize", "Home_Alignment_DecreaseIndent", "Home_Alignment_IncreaseIndent", "Home_Number_IncreaseDecimal", "Home_Number_DecreaseDecimal", "Home_Actions_Undo", "Home_Actions_Redo", "Home_Number_Accounting", "Home_Number_CommaStyle", "Home_Number_Percentage", "Home_Clipboard_Cut", "Home_Clipboard_Copy", "Insert_Tables_PivotTable", "Insert_Tables_Table", "Insert_Links_Hyperlink", "Insert_Illustrations_Pictures", "Insert_Sparkline_Line", "Insert_Sparkline_Column", "Insert_Sparkline_Winloss", "Data_SortFilter_SortAtoZ", "Data_SortFilter_SortZtoA",
            "Data_SortFilter_Filter", "Data_SortFilter_ClearFilter", "Data_DataTools_DataValidation", "PageLayout_PageLayout_PageSize", "PageLayout_Print_Print", "PageLayout_Print_PrintSelected", "Review_Comments_NewComment", "Review_Comments_DeleteComment", "Review_Comments_PreviousComment", "Review_Comments_NextComment", "Review_Comments_ShowHideComment", "Others_Cells_InsertCell", "Others_Cells_DeleteCell", "Others_Formulas_NameManager", "Others_Formulas_DefineName", "Others_CalCulation_CalculateNow", "Others_CalCulation_CalculateSheet", "Design_Tools_ResizeTable", "Design_Tools_ConvertToRange", "ChartDesign_Data_SwitchRowColumn", "ChartDesign_Data_SelectData", "ChartDesign_Type_ChangeChartType", "Format_Adjust_ChangePicture"];
        this.allSplitButtonIds = ["Home_Clipboard_PasteOptions", "Home_Font_Border", "Home_Styles_ConditionalFormatting", "Home_Styles_FormatAsTable", "Home_Styles_CellStyles", "Others_Editing_FindSelect", "Home_Editing_Clear", "Home_Alignment_Merge", "Home_Editing_SortFilter", "Home_Editing_AutoSum", "Insert_Charts_ColumnChart", "Insert_Charts_BarChart", "Insert_Charts_StockChart", "Insert_Charts_LineChart", "Insert_Charts_AreaChart", "Insert_Charts_PieChart", "Insert_Charts_ScatterChart", "Data_DataTools_DataValidationOptions", "PageLayout_PageLayout_PageSizeOptions", "Others_Cells_InsertCellOptions", "Others_Cells_DeleteCellOptions", "Others_Editing_FindSelect", "Others_Window_FreezePanes", "Others_CalCulation_CalculationOptions", "ChartDesign_ChartLayouts_AddChartElement", "Format_Adjust_ResetPicture", "Format_Border_PictureBorder", "SparklineDesign_Style_MarkerColor", "SparklineDesign_Style_SparklineColor", "SparklineDesign_Sparkline_EditData"]
        this.allToggleButtonIds = ["Home_Font_Bold", "Home_Font_Italic", "Home_Font_Underline", "Home_Font_StrikeThrough", "Home_Alignment_AlignLeft", "Home_Alignment_AlignRight", "Home_Alignment_AlignCenter", "Home_Alignment_TopAlign", "Home_Alignment_MiddleAlign", "Home_Alignment_BottomAlign", "Home_Alignment_WrapText", "Home_Clipboard_FormatPainter", "Review_Comments_ShowAllComments", "Review_Changes_ProtectSheet", "Review_Changes_ProtectWorkbook", "Review_Changes_LockCell"]
        this.allDropDownIds = ["ChartDesign_ChartThemes_ChartThemes", "Home_Number_NumberFormat", "Home_Font_FontSize", "Home_Font_FontFamily"];
        this.colorPickerIds = ["Home_Font_FillColor", "Home_Font_FontColor"];
        this.checkBoxIds = ["PageLayout_Show_Headings", "PageLayout_Show_Gridlines", "Design_TableStyleOptions_FirstColumn", "Design_TableStyleOptions_LastColumn", "Design_TableStyleOptions_TotalRow", "Design_TableStyleOptions_FilterColumn"];
        this.InputIds = ["Ribbon_Design_Properties_TableName"];
        this._fileMenuData = [
            { id: "File", text: obj._getLocStr("File"), parentId: null },
            { id: "New", text: obj._getLocStr("New"), parentId: "File", sprite: "e-icon e-ss-newsheet" },
            { id: "Open", text: obj._getLocStr("Open") + "...", parentId: "File", sprite: "e-icon e-ss-open" },
            { id: "Save", text: obj._getLocStr("SaveAs"), parentId: "File", sprite: "e-icon e-ss-saveas" },
            { id: "Print", text: obj._getLocStr("Print"), parentId: "File", sprite: "e-icon e-ssm-print" },
            { id: "ExportXL", text: obj._getLocStr("ExportXL"), parentId: "Save", sprite: "e-icon e-ssm-exportxl" },
            { id: "ExportCsv", text: obj._getLocStr("ExportCsv"), parentId: "Save", sprite: "e-icon e-ssm-exportcsv" },
            { id: "ExportPdf", text: obj._getLocStr("ExportPdf"), parentId: "Save", sprite: "e-icon e-ssm-exportpdf" },
            { id: "PrintSheet", text: obj._getLocStr("PrintSheet"), parentId: "Print", sprite: "e-icon e-ssm-print" },
            { id: "PrintSelected", text: obj._getLocStr("PrintSelected"), parentId: "Print", sprite: "e-icon e-ssm-printselected" }
        ];
        this._isAppTabCreate = false,
            this._isHomeTabCreate = false,
            this._isInsertTabCreate = false,
            this._isDataTabCreate = false,
            this._isPageLayoutTabCreate = false,
            this._isReviewTabCreate = false,
            this._isOthersTabCreate = false,
            this._isDesignTabCreate = false,
            this._isFormatTabCreate = false,
            this._isChartTabCreate = false,
            this._analyzeTabCreate = false,
            this._isSparklineTabCreate = false,

            this._isHomeTabTrgt = false,
            this._isInsertTabTrgt = false,
            this._isDataTabTrgt = false,
            this._isPageLayoutTrgtTab = false,
            this._isReviewTabTrgt = false,
            this._isOthersTabTrgt = false,
            this._isDesignTabTrgt = false,
            this._isFormatTabTrgt = false,
            this._isChartTabTrgt = false,
            this._analyzeTabTrgt = false,
            this._isSparklineTrgt = false,
			this._scopeBookCln = {}
    };

    ej.spreadsheetFeatures.ribbon.prototype = {

        _renderChartTypeDialog: function () {
            var $dlg, $tab, $okBtn, $canBtn, $btndiv, $ul, borderHt, $li, $aTag, $divctnr, $btnctnr, xlObj = this.XLObj, dlgId = xlObj._id + "_charttypedlg";
            $dlg = ej.buildTag("div#" + dlgId + ".e-chartdialog", "", {}, { "overflow": "hidden" });
            $tab = ej.buildTag("div#" + dlgId + "_allcharttab.e-chtdlgtab");
            $divctnr = ej.buildTag("div.e-dlg-fields e-dlgctndiv");
            $ul = ej.buildTag("ul .e-ul", "", "");
            $aTag = ej.buildTag("a", xlObj._getLocStr("AllCharts"), {}, { href: "#" + xlObj._id + "_allchart" });
            $li = ej.buildTag("li", $aTag);
            $dlg.append($divctnr.append($tab.append($ul.append($li))));
            $btndiv = ej.buildTag("div#" + dlgId + "_btndiv.e-dlg-btnfields");
            $btnctnr = ej.buildTag("div.e-dlg-btnctnr");
            $okBtn = ej.buildTag("input#" + dlgId + "_okbtn", "", {}, { type: "button" });
            $canBtn = ej.buildTag("input#" + dlgId + "_cantn", "", {}, { type: "button" });
            $okBtn.ejButton({ text: xlObj._getLocStr("Ok"), showRoundedCorner: true, width: 60, click: ej.proxy(this._chartTypeOk, this), enabled: true, cssClass: "e-ss-okbtn" });
            $canBtn.ejButton({ text: xlObj._getLocStr("Cancel"), click: ej.proxy(this._chartTypeCancel, this), showRoundedCorner: true, width: 60 });
            $btndiv.append($btnctnr.append($okBtn, $canBtn));
            $dlg.append($btndiv);
            xlObj.element.append($dlg);
            $tab.ejTab({ cssClass: "e-ss-dlgtab", width: "100%", height: "auto" });
            this._renderAllChartTab();
            $dlg.ejDialog({ enableModal: true, showOnInit: false, enableResize: false, allowKeyboardNavigation: false, title: xlObj._getLocStr("ChartType"), width: "auto", height: "auto", cssClass: "e-ss-dialog e-charttype-dlg e-ss-mattab e-" + xlObj._id + "-dlg", close: ej.proxy(this._dialogClose, this) });
            return $dlg;
        },

        _renderAllChartTab: function () {
            var i, j, len, chartCnt, chartLen, splt, $contentdiv, chart, colChart, chartTitle, $leftdiv, $listUl, chartColl = [],
                content = "", $li = "", xlObj = this.XLObj, xlId = xlObj._id, charttabId = xlId + "_chartdlg_allcharttab",
                chartName = ["Column-6", "Bar-6", "Radar-2", "Line-2", "Area-3", "Pie-3", "Scatter-1"], $table, $tr, $td, $div;
            $leftdiv = ej.buildTag("div#" + charttabId + "_content.e-ss-leftdiv", "");
            $contentdiv = ej.buildTag("div#" + charttabId + "_content.e-chtdlgcontent e-ss-rightdiv", "", { overflow: "auto" });
            $listUl = ej.buildTag("ul #" + charttabId + "_list .e-ul");
            for (var chartCnt = 0, chartLen = chartName.length; chartCnt < chartLen; chartCnt++) {
                chart = chartName[chartCnt].split("-")[0];
                $li += "<li><span class='e-icon e-ss-dlg" + chart.toLowerCase() + "chart'></span>" + xlObj._getLocStr(chart) + "</li>";
                chartColl.push(chart);
            }
            $listUl.append($($li));
            $div = ej.buildTag("div#" + xlId + "_allchart_table.e-ss-maindiv", "", { cellspacing: "0", cellpadding: "0", display: "table", width: "100%" });
            $("#" + xlId + "_allchart").append($div);
            $div.append($leftdiv.append($listUl));
            this._createChartList(chartColl);
            $div.append($contentdiv);
            for (j = 0, chartLen = chartName.length; j < chartLen; j++) {
                splt = chartName[j].split("-");
                switch (splt[0]) {
                    case "Column":
                        chartTitle = [xlObj._getLocStr("ClusteredColumn"), xlObj._getLocStr("StackedColumn"), "100%&nbsp;" + xlObj._getLocStr("StackedColumn"), "3-D&nbsp;" + xlObj._getLocStr("ClusteredColumn"), "3-D&nbsp;" + xlObj._getLocStr("StackedColumn"), "3-D&nbsp;100%&nbsp;" + xlObj._getLocStr("StackedColumn")];
                        break;
                    case "Bar":
                        chartTitle = [xlObj._getLocStr("ClusteredBar"), xlObj._getLocStr("StackedBar"), "100%&nbsp;" + xlObj._getLocStr("StackedBar"), "3-D&nbsp;" + xlObj._getLocStr("ClusteredBar"), "3-D&nbsp;" + xlObj._getLocStr("StackedBar"), "3-D&nbsp;100%&nbsp;" + xlObj._getLocStr("StackedBar")];
                        break;
                    case "Radar":
                        chartTitle = [xlObj._getLocStr("Radar"), xlObj._getLocStr("RadarMarkers")];
                        break;
                    case "Line":
                        chartTitle = [xlObj._getLocStr("Line"), xlObj._getLocStr("LineMarkers")];
                        break;
                    case "Area":
                        chartTitle = [xlObj._getLocStr("Area"), xlObj._getLocStr("StackedArea"), "100%&nbsp;" + xlObj._getLocStr("StackedArea")];
                        break;
                    case "Pie":
                        chartTitle = [xlObj._getLocStr("Pie"), "3-D&nbsp;" + xlObj._getLocStr("Pie"), xlObj._getLocStr("Doughnut")];
                        break;
                    case "Scatter":
                        chartTitle = [xlObj._getLocStr("Scatter")];
                        break;
                }
                chart = splt[0].toLowerCase();
                colChart = ej.buildTag("div#" + xlId + "_" + chart + "chart");
                for (i = 1, len = parseInt(splt[1]); i <= len; i++)
                    content += "<div class='e-chartimg e-dlg" + chart + "chart" + i + "' title='" + chartTitle[i - 1] + "'></div>";
                $contentdiv.append(colChart.append(content));
                $("#" + xlId + "_" + chart + "chart").find(".e-dlg" + chart + "chart1").addClass("e-chartselect");
                colChart.hide();
                content = "";
            }
            xlObj._on($("#" + xlId + "_allchart").find(".e-chartimg"), "click", xlObj._allChartType);
            $("#" + xlId + "_columnchart").show();
        },

        _createChartList: function (chartName) {
            var xlObj = this.XLObj, chart, charttabId = xlObj._id + "_chartdlg_allcharttab", $td, tabHt = $("#" + xlObj._id + "_allchart").height(), $ddlInput, $listUl = $("#" + charttabId + "_list"), $drpdiv = ej.buildTag("div.e-ss-drpdiv");
            $ddlInput = ej.buildTag("input#" + charttabId + "_input");
            $("#" + xlObj._id + "_allchart").prepend($drpdiv.append($ddlInput));
            $ddlInput.ejDropDownList({ dataSource: chartName, width: "100%", fields: { id: "value", text: "text", value: "text" }, select: $.proxy(this._onChartChange, this), selectedItemIndex: 0 });
            $listUl.ejListBox({
                selectedItemIndex: 0, width: "120", height: "250",
                fields: { text: "text", value: "value" }, select: $.proxy(this._onChartChange, this),
                allowMultiSelection: false
            });
        },

        _onChartChange: function (args) {
            var i, xlObj = this.XLObj, chart = args.value ? args.value.toLowerCase() : args.text.toLowerCase(), allChart = ["column", "bar", "radar", "line", "area", "pie", "scatter"];
            for (i = 0; i < allChart.length; i++)
                $("#" + xlObj._id + "_" + allChart[i] + "chart").hide();
            $("#" + xlObj._id + "_" + chart + "chart").show();
            $("#" + xlObj._id + "_allchart").find(".e-chartimg").removeClass("e-chartselect");
            $("#" + xlObj._id + "_" + chart + "chart").find(".e-dlg" + chart + "chart1").addClass("e-chartselect");
        },

        _initValDialog: function () {
            var $dlg, $tab, $okBtn, $canBtn, $btndiv, $ul, $li, $aTag, xlObj = this.XLObj, $divctnr, $btnctnr;
            $dlg = ej.buildTag("div#" + xlObj._id + "_ValDialog");
            $tab = ej.buildTag("div#" + xlObj._id + "_ValDialog_valDlgTab");
            $divctnr = ej.buildTag("div.e-dlg-fields e-dlgctndiv");
            //create tab Content
            $ul = ej.buildTag("ul .e-ul");
            $aTag = ej.buildTag("a", xlObj._getLocStr("Settings"), {}, { href: "#" + xlObj._id + "_Validation" });
            $li = ej.buildTag("li", $aTag);
            $ul.append($li);
            $tab.append($ul);
            $dlg.append($divctnr.append($tab));
            $btndiv = ej.buildTag("div#" + xlObj._id + "btnDiv.e-dlg-btnfields");
            $btnctnr = ej.buildTag("div.e-dlg-btnctnr");
            $okBtn = ej.buildTag("input#" + xlObj._id + "Dialog_OkBtn", "", {}, { type: "button" });
            $canBtn = ej.buildTag("input#" + xlObj._id + "Dialog_CancelBtn", "", {}, { type: "button" });
            $okBtn.ejButton({ text: xlObj._getLocStr("Ok"), showRoundedCorner: true, width: 60, click: ej.proxy(this._valDlgBtnClick, this, "ok"), enabled: true, cssClass: "e-ss-okbtn" });
            $canBtn.ejButton({ text: xlObj._getLocStr("Cancel"), click: ej.proxy(this._valDlgBtnClick, this, "cancel"), showRoundedCorner: true, width: 60 });
            $btndiv.append($btnctnr.append($okBtn, $canBtn));
            xlObj.element.append($dlg.append($btndiv));
            $tab.ejTab({ width: "100%", height: "auto", cssClass: "e-ss-dlgtab" });
            this._renderValDialog();
            $dlg.ejDialog({ enableModal: true, showOnInit: false, enableResize: false, allowKeyboardNavigation: false, title: xlObj._getLocStr("DataValidation"), width: "auto", height: "auto", cssClass: "e-ss-dialog e-ss-valdlg e-ss-mattab e-" + xlObj._id + "-dlg", close: ej.proxy(this._dialogClose, this) });
            this._dialogValidate("_ValDialog");
        },

        _initCFDialog: function () {
            var xlObj = this.XLObj, $dlg, $div, $okBtn, $canBtn, $btndiv, $btnctnr;
            $dlg = ej.buildTag("div#" + xlObj._id + "_CFDialog");
            xlObj.element.append($dlg);
            $div = ej.buildTag("div#" + xlObj._id + "_CondFormat.e-dlgctndiv");
            $dlg.append($div);
            $btndiv = ej.buildTag("div#" + xlObj._id + "cfBtnDiv.e-dlg-btnfields");
            $btnctnr = ej.buildTag("div.e-dlg-btnctnr");
            $okBtn = ej.buildTag("input#" + xlObj._id + "cfDialog_OkBtn", "", {}, { type: "button" });
            $canBtn = ej.buildTag("input#" + xlObj._id + "cfDialog_CancelBtn", "", {}, { type: "button" });
            $okBtn.ejButton({ text: xlObj._getLocStr("Ok"), showRoundedCorner: true, width: "25%", click: ej.proxy(this._dlgCFOk, this), enabled: true, cssClass: "e-ss-okbtn" });
            $canBtn.ejButton({ text: xlObj._getLocStr("Cancel"), click: ej.proxy(this._dlgCFCancel, this), showRoundedCorner: true, width: "25%" });
            $btndiv.append($btnctnr.append($okBtn, $canBtn));
            $dlg.append($btndiv);
            $dlg.ejDialog({ enableModal: true, showOnInit: false, enableResize: false, allowKeyboardNavigation: false, title: xlObj._getLocStr("ConditionalFormat"), width: "auto", cssClass: "e-ss-dialog e-ss-cfdlg e-" + xlObj._id + "-dlg", close: ej.proxy(this._dialogClose, this) });
            return $dlg;
        },

        _initHLDialog: function () {
            var xlObj = this.XLObj, $dlg, $tab, $ul, $li, $aTag, $btndiv, $okBtn, $canBtn, $divctnr, $btnctnr;
            $dlg = ej.buildTag("div#" + xlObj._id + "_HLDialog");
            $tab = ej.buildTag("div#" + xlObj._id + "_HLDialogTab");
            $divctnr = ej.buildTag("div.e-dlg-fields e-dlgctndiv");
            //create tab Content
            $ul = ej.buildTag("ul .e-ul");
            $aTag = ej.buildTag("a", xlObj._getLocStr("WebPage"), {}, { href: "#" + xlObj._id + "_Web" });
            $li = ej.buildTag("li", $aTag);
            $ul.append($li);
            $aTag = ej.buildTag("a", xlObj._getLocStr("WorkSheet"), {}, { href: "#" + xlObj._id + "_Doc" });
            $li = ej.buildTag("li", $aTag);
            $ul.append($li);
            $tab.append($ul);
            $dlg.append($divctnr.append($tab));
            $btndiv = ej.buildTag("div#" + xlObj._id + "hlBtnDiv.e-dlg-btnfields");
            $btnctnr = ej.buildTag("div.e-dlg-btnctnr");
            $okBtn = ej.buildTag("input#" + xlObj._id + "hlDialog_OkBtn", "", {}, { type: "button" });
            $canBtn = ej.buildTag("input#" + xlObj._id + "hlDialog_CancelBtn", "", {}, { type: "button" });
            $okBtn.ejButton({ text: xlObj._getLocStr("Ok"), showRoundedCorner: true, width: 60, click: ej.proxy(this._dlgHLOk, this), enabled: true, cssClass: "e-ss-okbtn" });
            $canBtn.ejButton({ text: xlObj._getLocStr("Cancel"), click: ej.proxy(this._dlgHLCancel, this), showRoundedCorner: true, width: 60 });
            $btndiv.append($btnctnr.append($okBtn, $canBtn));
            $dlg.append($btndiv);
            $dlg.ejDialog({
                enableModal: true, showOnInit: false, enableResize: false, allowKeyboardNavigation: false, title: xlObj._getLocStr("InsertHyperLink"), width: "auto", cssClass: "e-ss-dialog e-ss-hyperlinkdlg e-ss-mattab e-" + xlObj._id + "-dlg", close: ej.proxy(this._dialogClose, this), open: ej.proxy(function (e) {
                    var webAddr = $("#" + xlObj._id + "_Ribbon_webAddress"), cellAddr = $("#" + xlObj._id + "_Ribbon_cellAddress");
                    webAddr.focus().setInputPos(webAddr.val().length);
                    cellAddr.focus().setInputPos(cellAddr.val().length);
                })
            });
            $tab.ejTab({ width: "100%", itemActive: ej.proxy(this._hlTabChange, this), cssClass: "e-ss-dlgtab" });
            this._renderHLDialog();
        },

        _initFRDialog: function () {
            var xlObj = this.XLObj, $dlg, $tab, $findNextBtn, $findPrevBtn, $close, $btndiv, $btnctnr, $ul, $li, $ctnr, $aTag, $replaceBtn, $replaceAllBtn;
            $dlg = ej.buildTag("div#" + xlObj._id + "_FRDialog");
            $tab = ej.buildTag("div#" + xlObj._id + "_FRDialog_FPDlgTab");
            $ctnr = ej.buildTag("div.e-dlg-fields e-dlgctndiv");
            //create tab Content
            $ul = ej.buildTag("ul .e-ul");
            $aTag = ej.buildTag("a", xlObj._getLocStr("Find"), {}, { href: "#" + xlObj._id + "_Find" });
            $li = ej.buildTag("li", $aTag);
            $ul.append($li);
            $aTag = ej.buildTag("a", xlObj._getLocStr("Replace"), {}, { href: "#" + xlObj._id + "_Replace" });
            $li = ej.buildTag("li", $aTag);
            $ul.append($li);
            $aTag = ej.buildTag("a", xlObj._getLocStr("Settings"), {}, { href: "#" + xlObj._id + "_Settings" });
            $li = ej.buildTag("li", $aTag);
            $ul.append($li);
            $tab.append($ul);
            $dlg.append($ctnr.append($tab));
            $btndiv = ej.buildTag("div#" + xlObj._id + "btnFRDiv.e-dlg-btnfields");
            $btnctnr = ej.buildTag("div.e-dlg-btnctnr");
            $replaceBtn = ej.buildTag("input#" + xlObj._id + "FR_ReplaceBtn", "", { "margin-left": 0 }, { type: "button" });
            $replaceAllBtn = ej.buildTag("input#" + xlObj._id + "FR_ReplaceAllBtn", "", {}, { type: "button" });
            $findNextBtn = ej.buildTag("input#" + xlObj._id + "FR_NextBtn", "", {}, { type: "button" });
            $findPrevBtn = ej.buildTag("input#" + xlObj._id + "FR_PrevBtn", "", {}, { type: "button" });
            $close = ej.buildTag("input#" + xlObj._id + "FR_CloseBtn", "", {}, { type: "button" });
            $replaceBtn.ejButton({ text: xlObj._getLocStr("Replace"), showRoundedCorner: true, width: 55, click: ej.proxy(this._btnFROnClick, this, "FR_ReplaceBtn"), enabled: true }).css("visibility", "hidden");
            $replaceAllBtn.ejButton({ text: xlObj._getLocStr("ReplaceAll"), showRoundedCorner: true, click: ej.proxy(this._btnFROnClick, this, "FR_ReplaceAllBtn"), enabled: true }).css("visibility", "hidden");
            $findNextBtn.ejButton({ text: xlObj._getLocStr("FindNext"), showRoundedCorner: true, width: 69, click: ej.proxy(this._btnFROnClick, this, "FR_NextBtn"), enabled: true });
            $findPrevBtn.ejButton({ text: xlObj._getLocStr("FindPrev"), showRoundedCorner: true, width: 69, click: ej.proxy(this._btnFROnClick, this, "FR_PrevBtn"), enabled: true });
            $close.ejButton({ text: xlObj._getLocStr("Close"), click: ej.proxy(this._btnFROnClick, this, "FR_CloseBtn"), showRoundedCorner: true, width: 47 });
            $btndiv.append($btnctnr.append($replaceBtn, $replaceAllBtn, $findNextBtn, $findPrevBtn, $close));
            $dlg.append($btndiv);
            $dlg.ejDialog({
                showOnInit: false, enableResize: false, allowKeyboardNavigation: false, title: xlObj._getLocStr("FindnReplace"), width: "auto", height: "auto", cssClass: "e-ss-dialog e-ss-mattab e-ss-frdlg e-" + xlObj._id + "-dlg", close: ej.proxy(this._dialogClose, this), open: ej.proxy(function (e) {
                    if (xlObj._phoneMode) {
                        $("#" + xlObj._id + "FR_ReplaceBtn").hide();
                        $("#" + xlObj._id + "FR_ReplaceAllBtn").hide();
                    }
                    else {
                        $("#" + xlObj._id + "FR_ReplaceBtn").show();
                        $("#" + xlObj._id + "FR_ReplaceAllBtn").show();
                    }
                    var findTxt = $("#" + xlObj._id + "_Ribbon_textFind");
                    findTxt.focus().setInputPos(findTxt.val().length);
                })
            });
            $tab.ejTab({ width: "100%", itemActive: ej.proxy(this._findTabChange, this), cssClass: "e-ss-dlgtab" });
        },

        _initGoToDialog: function () {
            var xlObj = this.XLObj, $dlg, $tab, $btndiv, $ul, $li, $aTag, $okBtn, $canBtn, $ctnr, $btnctnr;
            $dlg = ej.buildTag("div#" + xlObj._id + "_GoDialog");
            $tab = ej.buildTag("div#" + xlObj._id + "_GoToDlgTab");
            $ctnr = ej.buildTag("div.e-dlg-fields e-dlgctndiv");
            //create tab Content
            $ul = ej.buildTag("ul .e-ul");
            $aTag = ej.buildTag("a", xlObj._getLocStr("GoTo"), {}, { href: "#" + xlObj._id + "_GoTo" });
            $li = ej.buildTag("li", $aTag);
            $ul.append($li);
            $aTag = ej.buildTag("a", xlObj._getLocStr("GoTo") + " " + xlObj._getLocStr("Special"), {}, { href: "#" + xlObj._id + "_GoToSp" });
            $li = ej.buildTag("li", $aTag);
            $ul.append($li);
            $tab.append($ul);
            $dlg.append($ctnr.append($tab));
            $btndiv = ej.buildTag("div#" + xlObj._id + "btnDiv.e-dlg-btnfields");
            $btnctnr = ej.buildTag("div.e-dlg-btnctnr");
            $dlg.append($btndiv.append($btnctnr));
            $okBtn = ej.buildTag("input#" + xlObj._id + "Dialog_GoOkBtn", "", {}, { type: "button" });
            $canBtn = ej.buildTag("input#" + xlObj._id + "Dialog_GoCancelBtn", "", {}, { type: "button" });
            $okBtn.ejButton({ text: xlObj._getLocStr("Ok"), showRoundedCorner: true, width: "23%", click: ej.proxy(this._gotoBtnClick, this, "ok"), cssClass: "e-ss-okbtn" });
            $canBtn.ejButton({ text: xlObj._getLocStr("Cancel"), click: ej.proxy(this._gotoBtnClick, this, "cancel"), showRoundedCorner: true, width: 60 });
            $btnctnr.append($okBtn, $canBtn);
            xlObj.element.append($dlg);
        },

        _initPvtDialog: function () {
            var xlObj = this.XLObj, $dlg, $okBtn, $canBtn, $btndiv, $btnctnr;
            $dlg = ej.buildTag("div#" + xlObj._id + "_PvtDialog");
            xlObj.element.append($dlg);
            $dlg.append(ej.buildTag("div#" + xlObj._id + "_Pivot.e-dlgctndiv"));
            $btndiv = ej.buildTag("div#" + xlObj._id + "pvtBtnDiv.e-dlg-btnfields");
            $btnctnr = ej.buildTag("div.e-dlg-btnctnr");
            $okBtn = ej.buildTag("input#" + xlObj._id + "PvtDialog_OkBtn");
            $canBtn = ej.buildTag("input#" + xlObj._id + "PvtDialog_CancelBtn");
            $okBtn.ejButton({ text: xlObj._getLocStr("Ok"), showRoundedCorner: true, width: "25%", click: ej.proxy(this._dlgPvtOk, this), enabled: true, cssClass: "e-ss-okbtn" });
            $canBtn.ejButton({ text: xlObj._getLocStr("Cancel"), click: ej.proxy(this._dlgPvtCancel, this), showRoundedCorner: true, width: "25%" });
            $btndiv.append($btnctnr.append($okBtn, $canBtn));
            $dlg.append($btndiv);
            $dlg.ejDialog({ enableModal: true, showOnInit: false, enableResize: false, allowKeyboardNavigation: false, title: xlObj._getLocStr("CreatePivotTable"), width: "auto", cssClass: "e-ss-dialog e-" + xlObj._id + "-dlg e-ss-pvtdlg", close: ej.proxy(this._dialogClose, this) });
        },

        _dialogClose: function () {
            this.XLObj._setSheetFocus();
        },

        _beforeDlgClose: function (args) {
            var gridOlay = $("#" + this.XLObj._id + "_nmgrid_dialogEdit_overLay");
            gridOlay.length && (args.cancel = true);
        },

        _homeTabObj: function () {
            var createdObj, xlObj = this.XLObj, imgtop = "imagetop", homeTab = { id: "home", text: xlObj._getLocStr("HOME"), groups: [] }, xlId = xlObj._id, xlMod = xlObj.model;
            createdObj = {
                id: "Clipboard",
                text: xlObj._getLocStr("Clipboard"),
                alignType: ej.Ribbon.alignType.columns,
                content: [{
                    groups: [
                        this._generateBtn("Home_Clipboard_Paste", "paste", "textandimage", "e-icon e-ssr-paste", 45, this._mediumBtnHeight, "Paste", "PasteContent", false, imgtop, "", " (Ctrl+V)"),
                        this._generateSplitBtn("Home_Clipboard_PasteOptions", "Paste", "textandimage", xlId + "_Ribbon_Paste", { dataSource: this._pasteMenuData, id: "id", parentId: "parentId", text: "text", spriteCssClass: "sprite" }, "", false, 45, this._mediumBtnHeight, "bottom", "", "dropdown", "e-ssr-pastesbtn", "Paste", "PasteSplitContent", " (Ctrl+V)")
                    ],
                },
                {
                    groups: [
                        this._generateBtn("Home_Clipboard_Cut", "Cut", "textandimage", "e-icon e-ssr-cut", 58, this._smallBtnHeight, "Cut", "CutContent", "", "", "", " (Ctrl+X)"),
                        this._generateBtn("Home_Clipboard_Copy", "Copy", "textandimage", "e-icon e-ssr-copy", 67, this._smallBtnHeight, "Copy", "CopyContent", "", "", "", " (Ctrl+C)"),
                        this._generateToggleBtn("Home_Clipboard_FormatPainter", "FormatPainter", "textandimage", "e-icon e-ss-formatpainter", "FPTitle", 110, this._smallBtnHeight, "FPContent")
                    ],
                }]
            };
            homeTab.groups.push(createdObj);
            createdObj = {
                id: "Font",
                text: xlObj._getLocStr("Font"),
                alignType: ej.Ribbon.alignType.rows,
                content: [{
                    groups: [
                        this._generateDD("Home_Font_FontFamily", "FontFamily", this._fontFamily, "7", 150, this._smallBtnHeight, "FontFamily", "FFContent"),
                        this._generateDD("Home_Font_FontSize", "FontSize", this._fontSize, "11pt", 65, this._smallBtnHeight, "FontSize", "FSContent"),
                        this._generateBtn("Home_Font_IncreaseFontSize", "IncreaseFontSize", "imageonly", "e-icon e-ss-increasefontsize", "", this._smallBtnHeight, "IncreaseFontSize", "IFSContent"),
                        this._generateBtn("Home_Font_DecreaseFontSize", "DecreaseFontSize", "imageonly", "e-icon e-ss-decreasefontsize", "", this._smallBtnHeight, "DecreaseFontSize", "DFSContent")
                    ],
                },
                {
                    groups: [
                        this._generateToggleBtn("Home_Font_Bold", "Bold", "imageonly", "e-icon e-ss-bold", "Bold", "", this._smallBtnHeight, "BoldContent", "", "", "", "", "", "", " (Ctrl+B)"),
                        this._generateToggleBtn("Home_Font_Italic", "Italic", "imageonly", "e-icon e-ss-italic", "Italic", "", this._smallBtnHeight, "ItalicContent", "", "", "", "", "", "", " (Ctrl+I)"),
                        this._generateToggleBtn("Home_Font_Underline", "Underline", "imageonly", "e-icon e-ss-underline", "Underline", "", this._smallBtnHeight, "ULineContent", "", "", "", "", "", "", " (Ctrl+U)"),
                        this._generateToggleBtn("Home_Font_StrikeThrough", "Linethrough", "imageonly", "e-icon e-ss-linethrough", "Linethrough", 25, this._smallBtnHeight, "LineTrContent", true, "", "", "", "", "", " (Ctrl+5)"),
                        this._generateSplitBtn("Home_Font_Border", "Border", "imageonly", xlId + "_Ribbon_Border", { dataSource: this._borderMenuData, id: "id", parentId: "parentId", text: "text", spriteCssClass: "sprite" }, "e-icon e-ss-bottom", true, 37, this._smallBtnHeight, "", "", "", "e-borderbtn", "Border", "BorderContent"),
                        this._generateCustomControl(xlId + "_Ribbon_Home_Font_FillColor", "BackgroundColor", "BackgroundColor", "BGContent"),
                        this._generateCustomControl(xlId + "_Ribbon_Home_Font_FontColor", "FontColor", "Color", "ColorContent")
                    ],
                }]
            };
            homeTab.groups.push(createdObj);
            createdObj = {
                id: "Alignment",
                text: xlObj._getLocStr("AlignmentTab"),
                alignType: ej.Ribbon.alignType.rows,
                content: [{
                    groups: [
                        this._generateToggleBtn("Home_Alignment_TopAlign", "TopAlign", "imageonly", "e-icon e-ss-topalign", "TopAlign", "", "", "TopAlignContent"),
                        this._generateToggleBtn("Home_Alignment_MiddleAlign", "MiddleAlign", "imageonly", "e-icon e-ss-middlealign", "MiddleAlign", "", "", "MiddleAlignContent"),
                        this._generateToggleBtn("Home_Alignment_BottomAlign", "BottomAlign", "imageonly", "e-icon e-ss-bottomalign", "BottomAlign", "", "", "BottomAlignContent", true),
                        this._generateToggleBtn("Home_Alignment_WrapText", "WrapText", "textandimage", "e-icon e-ss-wraptext", "WrapText", 85, 25, "WrapTextContent")
                    ],
                },
                {
                    groups: [
                        this._generateToggleBtn("Home_Alignment_AlignLeft", "AlignLeft", "imageonly", "e-icon e-ss-alignleft", "AlignLeft", "", "", "AlignLeftContent"),
                        this._generateToggleBtn("Home_Alignment_AlignCenter", "AlignCenter", "imageonly", "e-icon e-ss-aligncenter", "AlignCenter", "", "", "AlignCenterContent"),
                        this._generateToggleBtn("Home_Alignment_AlignRight", "AlignRight", "imageonly", "e-icon e-ss-alignright", "AlignRight", "", "", "AlignRightContent", true),
                        this._generateSplitBtn("Home_Alignment_Merge", "MergeAndCenter", "textandimage", xlId + "_Ribbon_Merge", { dataSource: this._mergeMenuData, id: 'id', parentId: 'parentId', text: 'text', spriteCssClass: 'sprite' }, "e-icon e-ssr-merge", false, 136, 25, "right", "", "", "e-spreadsheet e-mergebtn", "MergeAndCenter", "MergeAndCenterContent")
                    ],
                },
                {
                    groups: [
                        this._generateBtn("Home_Alignment_DecreaseIndent", "DecreaseIndent", "imageonly", "e-icon e-ss-decreaseindent", "", this._smallBtnHeight, "DecreaseIndent", "DecreaseIndentContent"),
                        this._generateBtn("Home_Alignment_IncreaseIndent", "IncreaseIndent", "imageonly", "e-icon e-ss-increaseindent", "", this._smallBtnHeight, "IncreaseIndent", "IncreaseIndentContent")
                    ],
                }]
            };
            homeTab.groups.push(createdObj);
            createdObj = {
                id: "Actions",
                text: xlObj._getLocStr("Actions"),
                alignType: ej.Ribbon.alignType.rows,
                content: [{
                    groups: [
                        this._generateBtn("Home_Actions_Undo", "Undo", "textandimage", "e-icon e-ss-undo", 40, this._bigBtnHeight, "Undo", "UndoContent", false, imgtop, "", " (Ctrl+Z)"),
                        this._generateBtn("Home_Actions_Redo", "Redo", "textandimage", "e-icon e-ss-redo", 40, this._bigBtnHeight, "Redo", "RedoContent", false, imgtop, "", " (Ctrl+Y)")
                    ],
                }]
            };
            homeTab.groups.push(createdObj);
            createdObj = {
                id: "Number",
                text: xlObj._getLocStr("NumberTab"),
                alignType: ej.Ribbon.alignType.rows,
                enableGroupExpander: true,
                content: [{
                    groups: [
                        this._generateDD("Home_Number_NumberFormat", "NumberFormat", this._numberFormat, "General", 125, this._smallBtnHeight, "NumberFormat", "NumberFormatContent")
                    ],
                },
                {
                    groups: [
                        this._generateBtn("Home_Number_Accounting", "AccountingStyle", "imageonly", "e-icon e-ss-accounting", "", this._smallBtnHeight, "AccountingStyle", "AccountingStyleContent"),
                        this._generateBtn("Home_Number_Percentage", "PercentageStyle", "imageonly", "e-icon e-ss-percentage", "", this._smallBtnHeight, "PercentageStyle", "PercentageStyleContent"),
                        this._generateBtn("Home_Number_CommaStyle", "CommaStyle", "imageonly", "e-icon e-ss-comma", "", this._smallBtnHeight, "CommaStyle", "CommaStyleContent", true),
                        this._generateBtn("Home_Number_IncreaseDecimal", "IncreaseDecimal", "imageonly", "e-icon e-ss-increasedecimal", "", this._smallBtnHeight, "IncreaseDecimal", "IncreaseDecimalContent"),
                        this._generateBtn("Home_Number_DecreaseDecimal", "DecreaseDecimal", "imageonly", "e-icon e-ss-decreasedecimal", "", this._smallBtnHeight, "DecreaseDecimal", "DecreaseDecimalContent")
                    ],
                }]
            };
            homeTab.groups.push(createdObj);
            createdObj = {
                id: "Styles",
                text: xlObj._getLocStr("Styles"),
                alignType: ej.Ribbon.alignType.rows,
                content: [{
                    groups: [
                        this._generateSplitBtn("Home_Styles_ConditionalFormatting", "ConditionalFormat", "textandimage", xlId + "_CFormat", { dataSource: this._cFormatMenuData, id: "id", parentId: "parentId", text: "text", spriteCssClass: "sprite" }, "e-icon e-ssr-condformat", false, 75, this._splitBtnHeight, "bottom", imgtop, "dropdown", "e-spreadsheet e-cformatbtn", "ConditionalFormat", "CFContent"),
                        this._generateSplitBtn("Home_Styles_FormatAsTable", "FormatasTable", "textandimage", xlId + "_formatastable", "", "e-icon e-ssr-formatastable", false, 65, this._splitBtnHeight, "bottom", ej.ImagePosition.ImageTop, "dropdown", "e-spreadsheet e-formatastablebtn", "FormatAsTable", "FATContent"),
                        this._generateSplitBtn("Home_Styles_CellStyles", "CellStyles", "textandimage", xlId + "_cellstyles", "", "e-icon e-ssr-cellstyles", false, 55, this._splitBtnHeight, "bottom", ej.ImagePosition.ImageTop, "dropdown", "e-spreadsheet e-cellstylebtn", "CellStyles", "CellStylesContent")
                    ],
                }]
            };
            homeTab.groups.push(createdObj);
            createdObj = {
                id: "Editing",
                text: xlObj._getLocStr("Editing"),
                alignType: ej.Ribbon.alignType.columns,
                content: [{
                    groups: [
                        this._generateSplitBtn("Home_Editing_SortFilter", "SortFilter", "textandimage", xlId + "_Ribbon_SortFilter", { dataSource: this._sortFltrMenuData, id: "id", parentId: "parentId", text: "text", spriteCssClass: "sprite" }, "e-icon e-ss-sortfilter", false, 50, this._splitBtnHeight, "bottom", "imagetop", "dropdown", "e-spreadsheet e-sortfltrbtn", "SortFilter", "SortFilterContent")
                    ],
                },
                {
                    groups: [
                        this._generateSplitBtn("Home_Editing_AutoSum", "AutoSum", "textandimage", xlId + "_Ribbon_AutoSum", { dataSource: this._autosumMenuData, id: "id", parentId: "parentId", text: "text", spriteCssClass: "sprite" }, "e-icon e-ssr-autosum", false, 100, 25, "right", "", "", "e-spreadsheet e-autosumbtn", "AutoSumTitle", "AutoSumContent"),
                        this._generateSplitBtn("Home_Editing_Clear", "Clear", "textandimage", xlId + "_Ribbon_Clear", { dataSource: this._clearMenuData, id: "id", parentId: "parentId", text: "text", spriteCssClass: "sprite" }, "e-icon e-ssr-clear", false, 80, 25, "right", "", "dropdown", "e-spreadsheet e-clearbtn", "Clear", "ClearContent")
                    ],
                }]
            };
            homeTab.groups.push(createdObj);
            this._tabCollection.push(homeTab);
        },

        _insertTabObj: function () {
            var createdObj, xlObj = this.XLObj, imgtop = "imagetop", insertTab = { id: "insert", text: xlObj._getLocStr("INSERT"), groups: [] }, xlId = xlObj._id;
            createdObj = {
                id: "Tables",
                text: xlObj._getLocStr("Tables"),
                alignType: ej.Ribbon.alignType.rows,
                content: [{
                    groups: [
                        this._generateBtn("Insert_Tables_PivotTable", "PivotTable", "textandimage", "e-icon e-ssr-pivottable", 65, this._bigBtnHeight, "PivotTable", "PivotTableContent", false, imgtop),
                        this._generateBtn("Insert_Tables_Table", "Table", "textandimage", "e-icon e-ssr-table", 50, this._bigBtnHeight, "Table", "TableContent", false, imgtop)
                    ],
                }]
            };
            insertTab.groups.push(createdObj);
            createdObj = {
                id: "Illustrations",
                text: xlObj._getLocStr("Illustrations"),
                alignType: ej.Ribbon.alignType.rows,
                content: [{
                    groups: [
                        this._generateBtn("Insert_Illustrations_Pictures", "Pictures", "textandimage", "e-icon e-ssr-pictures", 50, this._bigBtnHeight, "PicturesTitle", "PicturesContent", false, imgtop, "")
                    ],
                }]
            };
            insertTab.groups.push(createdObj);
            createdObj = {
                id: "Links",
                text: xlObj._getLocStr("Links"),
                alignType: ej.Ribbon.alignType.rows,
                content: [{
                    groups: [
                        this._generateBtn("Insert_Links_Hyperlink", "HyperLink", "textandimage", "e-icon e-ssr-hyperlink", 60, this._bigBtnHeight, "HyperLinkTitle", ["HyperLinkContent", "HyperLinkPlaceContent"], false, imgtop, "", " (Ctrl+K)")
                    ],
                }]
            };
            insertTab.groups.push(createdObj);
            createdObj = {
                id: "Charts",
                text: xlObj._getLocStr("Charts"),
                alignType: ej.Ribbon.alignType.rows,
                content: [{
                    groups: [
                        this._generateSplitBtn("Insert_Charts_ColumnChart", "ColumnChart", "imageonly", xlId + "_Ribbon_ColumnChart", "", "e-icon e-ss-colchart", false, 41, this._smallBtnHeight, "bottom", "ej.ImagePosition.ImageTop", "dropdown", "e-spreadsheet e-chartbtn", "ColumnChartTitle", "ColumnChartContent"),
                        this._generateSplitBtn("Insert_Charts_BarChart", "BarChart", "imageonly", xlId + "_Ribbon_BarChart", "", "e-icon e-ss-barchart", false, 41, this._smallBtnHeight, "bottom", "ej.ImagePosition.ImageTop", "dropdown", "e-spreadsheet e-chartbtn", "BarChartTitle", "BarChartContent"),
                        this._generateSplitBtn("Insert_Charts_StockChart", "StockChart", "imageonly", xlId + "_Ribbon_StockChart", "", "e-icon e-ss-stockchart", false, 41, this._smallBtnHeight, "bottom", "ej.ImagePosition.ImageTop", "dropdown", "e-spreadsheet e-chartbtn", "StockChartTitle", "StockChartContent")
                    ],
                },
                {
                    groups: [
                        this._generateSplitBtn("Insert_Charts_LineChart", "LineChart", "imageonly", xlId + "_Ribbon_LineChart", "", "e-icon e-ss-linechart", false, 41, this._smallBtnHeight, "bottom", "ej.ImagePosition.ImageTop", "dropdown", "e-spreadsheet e-chartbtn", "LineChartTitle", "LineChartContent"),
                        this._generateSplitBtn("Insert_Charts_AreaChart", "AreaChart", "imageonly", xlId + "_Ribbon_AreaChart", "", "e-icon e-ss-areachart", false, 41, this._smallBtnHeight, "bottom", "ej.ImagePosition.ImageTop", "dropdown", "e-spreadsheet e-chartbtn", "AreaChartTitle", "AreaChartContent"),
                        this._generateSplitBtn("Insert_Charts_PieChart", "PieChart", "imageonly", xlId + "_Ribbon_PieChart", "", "e-icon e-ss-piechart", false, 41, this._smallBtnHeight, "bottom", "ej.ImagePosition.ImageTop", "dropdown", "e-spreadsheet e-chartbtn", "PieChartTitle", "PieChartContent")
                    ],
                },
                {
                    groups: [
                        this._generateSplitBtn("Insert_Charts_ScatterChart", "ScatterChart", "imageonly", xlId + "_Ribbon_ScatterChart", "", "e-icon e-ss-scterchart", false, 41, this._smallBtnHeight, "bottom", "ej.ImagePosition.ImageTop", "dropdown", "e-spreadsheet e-chartbtn", "ScatterChartTitle", "ScatterChartContent")
                    ],
                }]
            };
            insertTab.groups.push(createdObj);
            if (xlObj.model.allowSparkline)
                insertTab.groups.push(xlObj.XLSparkline._tabInsert());
            this._tabCollection.push(insertTab);
        },

        _dataTabObj: function () {
            var createdObj, xlObj = this.XLObj, imgtop = "imagetop", dataTab = { id: "data", text: xlObj._getLocStr("DATATAB"), groups: [] };
            createdObj = {
                id: "SortFilter",
                text: xlObj._getLocStr("SortFilter"),
                alignType: ej.Ribbon.alignType.columns,
                content: [{
                    groups: [
                        this._generateBtn("Data_SortFilter_SortAtoZ", "SortAtoZ", "textandimage", "e-icon e-ssr-sortatoz", 90, this._smallBtnHeight, "SortAtoZ", "SortAtoZContent", false, "", "e-datapadding"),
                        this._generateBtn("Data_SortFilter_SortZtoA", "SortZtoA", "textandimage", "e-icon e-ssr-sortztoa", 90, this._smallBtnHeight, "SortZtoA", "SortZtoAContent", false, "", "e-datapadding")
                    ]
                },
                {
                    groups: [
                        this._generateBtn("Data_SortFilter_Filter", "Filter", "textandimage", "e-icon e-ssr-filter", 60, this._smallBtnHeight, "Filter", "FilterContent", false, "", "e-datapadding"),
                        this._generateBtn("Data_SortFilter_ClearFilter", "ClearFilter", "textandimage", "e-icon e-ss-clearfilter", 90, this._smallBtnHeight, "ClearFilter", "ClearFilterContent", false, "", "e-datapadding")
                    ],
                }]
            };
            dataTab.groups.push(createdObj);
            createdObj = {
                id: "DataTools",
                text: xlObj._getLocStr("DataTools"),
                alignType: ej.Ribbon.alignType.columns,
                content: [{
                    groups: [
                        this._generateBtn("Data_DataTools_DataValidation", "Validation", "imageonly", "e-icon e-ssr-validation", 70, 39, "DataValidation", "DVContent", false, imgtop),
                        this._generateSplitBtn("Data_DataTools_DataValidationOptions", "DataValidation", "textandimage", xlObj._id + "_Ribbon_Validation", { dataSource: this._valMenuData, id: "id", parentId: "parentId", text: "text", spriteCssClass: "sprite" }, "", false, 70, this._mediumBtnHeight, "bottom", "", "dropdown", "e-ssr-validationsbtn", "DataValidation", "DVContent")
                    ],
                }]
            };
            dataTab.groups.push(createdObj);
            this._tabCollection.push(dataTab);
        },

        _pageTabObj: function () {
            var createdObj, xlObj = this.XLObj, imgtop = "imagetop", pageTab = { id: "pagelayout", text: xlObj._getLocStr("PAGELAYOUT"), groups: [] };
            createdObj = {
                id: "Show",
                text: xlObj._getLocStr("Show"),
                alignType: ej.Ribbon.alignType.rows,
                width: 105,
                content: [{
                    groups: [
                        { contentID: xlObj._id + "_Ribbon_pagesetupleft", type: ej.Ribbon.type.custom, height: 80 },
                    ],
                }]
            };
            pageTab.groups.push(createdObj);
            createdObj = {
                id: "PageLayout",
                text: xlObj._getLocStr("PageLayout"),
                alignType: ej.Ribbon.alignType.columns,
                content: [{
                    groups: [
                        this._generateBtn("PageLayout_PageLayout_PageSize", "size", "imageonly", "e-icon e-ssr-pagesize", 65, 44, "size", "PageSizeContent", false, imgtop, ""),
                        this._generateSplitBtn("PageLayout_PageLayout_PageSizeOptions", "PageSize", "textandimage", xlObj._id + "_Ribbon_PageSize", { dataSource: this._pageSizes, id: "id", parentId: "parentId", text: "text", spriteCssClass: "sprite" }, "", false, 65, this._mediumBtnHeight, "bottom", "", "dropdown", "e-ssr-pagesizesbtn", "PageSize", "PageSizeContent")
                    ],
                }]
            };
            pageTab.groups.push(createdObj);
            createdObj = {
                id: "Print",
                text: xlObj._getLocStr("Print"), alignType: ej.Ribbon.alignType.columns,
                content: [{
                    groups: [
                        this._generateBtn("PageLayout_Print_Print", "Print", "textandimage", "e-icon e-ssr-print", 50, this._bigBtnHeight, "Print", "PrintContent", false, imgtop, "")
                    ]
                },
                {
                    groups: [
                        this._generateBtn("PageLayout_Print_PrintSelected", "PrintSelected", "textandimage", "e-icon e-ssr-printselected", 55, this._bigBtnHeight, "PrintSelected", "PrintSelectedContent", true, imgtop, "")
                    ],
                }]
            };
            pageTab.groups.push(createdObj);
            this._tabCollection.push(pageTab);
        },

        _reviewTabObj: function () {
            var createdObj, xlObj = this.XLObj, imgtop = "imagetop", reviewTab = { id: "review", text: xlObj._getLocStr("REVIEW"), groups: [] };
            createdObj = {
                id: "Comments",
                text: xlObj._getLocStr("Comments"), alignType: ej.Ribbon.alignType.columns,
                content: [{
                    groups: [
                        this._generateBtn("Review_Comments_NewComment", "New", "textandimage", "e-icon e-ssr-newcmnt", 49, this._bigBtnHeight, "NewCommentTitle", "NewCommentContent", false, imgtop)
                    ],
                },
                {
                    groups: [
                        this._generateBtn("Review_Comments_DeleteComment", "Delete", "textandimage", "e-icon e-ssr-deletecmnt", 49, this._bigBtnHeight, "DeleteComment", "DeleteCommentContent", false, imgtop)
                    ],
                },
                {
                    groups: [
                        this._generateBtn("Review_Comments_PreviousComment", "Previous", "textandimage", "e-icon e-ssr-previouscmnt", 49, this._bigBtnHeight, "Previous", "PreviousContent", false, imgtop)
                    ],
                },
                {
                    groups: [
                        this._generateBtn("Review_Comments_NextComment", "Next", "textandimage", "e-icon e-ssr-nextcmnt", 49, this._bigBtnHeight, "Next", "NextContent", false, imgtop)
                    ],
                },
                {
                    groups: [
                        this._generateBtn("Review_Comments_ShowHideComment", "ShowHide", "textandimage", "e-icon e-ssr-showhidecmnt", 160, this._smallBtnHeight, "ShowHide", "ShowHideContent", false, "imageLeft", "e-ssr-cmntcolbtn"),
                        this._generateToggleBtn("Review_Comments_ShowAllComments", "ShowAll", "textandimage", "e-icon e-ssr-showallcmnt", "ShowAll", 155, this._smallBtnHeight, "ShowAllContent", false, "e-ssr-cmntcolbtn")
                    ],
                }]
            };
            reviewTab.groups.push(createdObj);
            createdObj = {
                id: "Changes",
                text: xlObj._getLocStr("Changes"),
                alignType: ej.Ribbon.alignType.row,
                content: [{
                    groups: [
                        this._generateToggleBtn("Review_Changes_ProtectSheet", "Protectsheet", "textandimage", "e-icon e-ssr-protectsheet", "Protectsheet", 60, this._bigBtnHeight, "ProtectSheetToolTip", false, "e-ssr-protectsheetbtn", "imagetop", "Unprotect"),
                        this._generateToggleBtn("Review_Changes_ProtectWorkbook", "ProtectWorkbook", "textandimage", "e-icon e-ssr-protect", "ProtectWorkbook", 60, this._bigBtnHeight, "ProtectWBContent", false, "e-ssr-cmntcolbtn", "imagetop"),
                        this._generateToggleBtn("Review_Changes_LockCell", "Lock", "textandimage", "e-icon e-ssr-protlockcell", "lock", 90, this._smallBtnHeight, "Lock", false, "e-ssr-lockbtn", "", "Unlock", "e-icon e-ssr-protunlockcell"),
                    ],
                },

                ]
            };
            reviewTab.groups.push(createdObj);
            this._tabCollection.push(reviewTab);
        },

        _otherTabObj: function () {
            var createdObj, xlObj = this.XLObj, imgtop = "imagetop", otherTab = { id: "others", text: xlObj._getLocStr("OTHERS"), groups: [] }, xlId = xlObj._id, conttype = ej.ContentType;
            createdObj = {
                id: "Window",
                text: xlObj._getLocStr("Window"), alignType: ej.Ribbon.alignType.columns,
                content: [{
                    groups: [
                        this._generateSplitBtn("Others_Window_FreezePanes", "FreezePanes", "textandimage", xlObj._id + "_Ribbon_FPane", { dataSource: this._viewMenuData, id: 'id', parentId: 'parentId', text: 'text', spriteCssClass: 'sprite' }, "e-icon e-ssr-frzpane", false, 55, this._splitBtnHeight, "bottom", imgtop, "dropdown", "e-spreadsheet e-fpanebtn", "FreezePanes", "FreezePanesContent")
                    ],
                }]
            };
            otherTab.groups.push(createdObj);
            createdObj = {
                id: "Formulas",
                text: xlObj._getLocStr("Formula"),
                alignType: ej.Ribbon.alignType.columns,
                content: [{
                    groups: [
                        this._generateBtn("Others_Formulas_NameManager", "NameManager", conttype.TextAndImage, "e-icon e-ssr-namemngr", 55, this._bigBtnHeight, "NameManager", ["NameManagerContent", "NameManagerFormulaContent"], false, imgtop, "")
                    ],
                },
                {
                    groups: [
                        this._generateBtn("Others_Formulas_DefineName", "DefineName", conttype.TextAndImage, "e-icon e-ssr-definename", 110, 25, "DefineName", "DefineNameContent"),
                        this._generateSplitBtn("Others_Formulas_UseInFormula", "UseInFormula", "textandimage", xlObj._id + "_nmuseinformula", "", "e-icon e-ssr-useformula", false, 125, 25, ej.ArrowPosition.Bottom, ej.ImagePosition.ImageLeft, "dropdown", "e-spreadsheet e-useinformulabtn", "UseInFormula", "UseInFormulaContent")
                    ],
                }]
            };
            otherTab.groups.push(createdObj);
            createdObj = {
                id: "Cells",
                text: xlObj._getLocStr("Cells"),
                alignType: ej.Ribbon.alignType.columns,
                content: [{
                    groups: [
                        this._generateBtn("Others_Cells_InsertCell", "Insert", "imageonly", "e-icon e-ssr-insert", 54, 40, "InsertTitle", ["InsertContent", "MultipleInsertContent"], false, imgtop),
                        this._generateSplitBtn("Others_Cells_InsertCellOptions", "Insert", "textandimage", xlId + "_Ribbon_Ins", { dataSource: this._insertMenuData, id: 'id', parentId: 'parentId', text: 'text', spriteCssClass: 'sprite' }, "", false, 54, this._mediumBtnHeight, "bottom", "", "dropdown", "e-insertsbtn", "InsertTitle", "InsertSBContent")
                    ],
                },
                {
                    groups: [
                        this._generateBtn("Others_Cells_DeleteCell", "Delete", "imageonly", "e-icon e-ssr-delete", 54, 40, "DeleteTitle", ["DeleteContent", "MultipleDeleteContent"], false, imgtop),
                        this._generateSplitBtn("Others_Cells_DeleteCellOptions", "Delete", "textandimage", xlId + "_Ribbon_Del", { dataSource: this._deleteMenuData, id: 'id', parentId: 'parentId', text: 'text', spriteCssClass: 'sprite' }, "", false, 54, this._mediumBtnHeight, "bottom", "", "dropdown", "e-deletesbtn", "DeleteTitle", ["DeleteContent", "MultipleDeleteContent"])
                    ],
                }]
            };
            otherTab.groups.push(createdObj);
            createdObj = {
                id: "Editing",
                text: xlObj._getLocStr("Editing"),
                alignType: ej.Ribbon.alignType.rows,
                content: [{
                    groups: [
                        this._generateSplitBtn("Others_Editing_FindSelect", "FindSelect", "textandimage", xlId + "_Ribbon_FindRep", { dataSource: this._findMenuData, id: "id", parentId: "parentId", text: "text", spriteCssClass: "sprite" }, "e-icon e-ss-findselect", false, 55, this._splitBtnHeight, "bottom", "imagetop", "dropdown", "e-spreadsheet e-findbtn", "FindSelectTitle", "FindSelectContent")
                    ],
                }]
            };
            otherTab.groups.push(createdObj);
            createdObj = {
                id: "Calculation",
                text: xlObj._getLocStr("Calculation"),
                alignType: ej.Ribbon.alignType.columns,
                content: [{
                    groups: [
                        this._generateSplitBtn("Others_CalCulation_CalculationOptions", "CalculationOptions", "textandimage", xlId + "_Ribbon_CalcOpt", { dataSource: this._calcOptData, id: "id", parentId: "parentId", text: "text", spriteCssClass: "sprite" }, "e-icon e-ss-calcopt", false, 67, this._splitBtnHeight, "bottom", "imagetop", "dropdown", "e-spreadsheet e-coptbtn", "CalcOptTitle", ["CalcOptContent", "CalcOptRecalcContent"])
                    ]
                },
                {
                    groups: [
                        this._generateBtn("Others_CalCulation_CalculateNow", "CalculateNow", conttype.TextAndImage, "e-icon e-ss-calcnow", 110, 30, "CalculateNow", ["CalculateNowContent", "CalculateNowTurnOffContent"]),
                        this._generateBtn("Others_CalCulation_CalculateSheet", "CalculateSheet", conttype.TextAndImage, "e-icon e-ss-calcsheet", 110, 30, "CalculateSheet", ["CalculateSheetContent", "CalculateSheetTurnOffContent"])
                    ]
                }],
            };
            otherTab.groups.push(createdObj);
            this._tabCollection.push(otherTab);
        },

        _renderRibbon: function (isSetModel) {
            var xlObj = this.XLObj, xlId = xlObj._id, xlEle = xlObj.element, click, xlMod = xlObj.model, ribbonElem = ej.buildTag("div", "", "", { id: xlId + "_Ribbon" }), i, tabName = [xlObj._getLocStr("HOME"), xlObj._getLocStr("INSERT"), xlObj._getLocStr("DATATAB"), xlObj._getLocStr("PAGELAYOUT"), xlObj._getLocStr("REVIEW"), xlObj._getLocStr("OTHERS")];
            isSetModel ? xlEle.prepend(ribbonElem) : xlEle.append(ribbonElem);
            xlEle.append(ej.buildTag("ul", "", { display: "none" }, { id: xlId + "_Menu" }));
            click = ej.SplitButton.prototype._documentClick;
            ej.SplitButton.prototype._documentClick = function (e) { // for ejmenu document click issue(JS-10113)
                if ((!$(e.target).is(".e-formatastable") && !$(e.target).is(".e-formatastable-adaptive")) && (!$(e.target).is(".e-cellstyles") && !$(e.target).is(".e-cellstyles-adaptive")))
                    click.call(this, e);
            };
            var tabColl = [xlObj._getLocStr("HOME"), xlObj._getLocStr("INSERT"), xlObj._getLocStr("PAGELAYOUT"), xlObj._getLocStr("DATATAB"), xlObj._getLocStr("OTHERS"), xlObj._getLocStr("FORMAT"), xlObj._getLocStr("DESIGN"), xlObj._getLocStr("CHARTDESIGN"), xlObj._getLocStr("ANALYZE"), xlObj._getLocStr("SPARKLINEDESIGN")];
            if (xlObj.model.ribbonSettings.enableOnDemand && !xlObj._isRibbonDestroyed)
                this._createTrgtElement(xlObj._getLocStr("HOME"));
            else {
                for (var i = 0; i < tabColl.length; i++)
                    this._createTrgtElement(tabColl[i], ribbonElem);
            }
            if (!xlObj._isRefresh) {
                this._menuCustomize();
                this._homeTabObj();
                this._insertTabObj();
                this._dataTabObj();
                this._pageTabObj();
                this._reviewTabObj();
                this._otherTabObj();
                this._contextualTabObj();
            }
            ribbonElem.attr('style', 'overflow:hidden');
            ribbonElem.height(0);
            ribbonElem.width(0);
            ribbonElem.ejRibbon({
                width: "100%",
                allowResizing: true,
                applicationTab: this._appTabCollection,
                tabs: this._tabCollection,
                contextualTabs: this._contextualTabCollection,
                tabClick: $.proxy(this._onTabClick, this),
                tabSelect: $.proxy(this._onTabSelect, this),
                create: $.proxy(this._onControlCreated, this),
                collapse: $.proxy(this._onCollapse, this),
                backstageItemClick: $.proxy(this._onBackStageItemClick, this),
                groupExpand: $.proxy(this._onGroupExpander, this),
                pinState: $.proxy(this._onRibbonPin, this),
                expand: $.proxy(this._onRibbonExpand, this),
                groupClick: $.proxy(this._onRibbonGroupClick, this),
                _destroyed: $.proxy(this._rbnDestroy, this),
                enableOnDemand: xlObj.model.ribbonSettings.enableOnDemand,
                beforeTabClick: $.proxy(this._onBeforeTabClick, this)
            });
            ribbonElem.css("height", "auto");
            ribbonElem.width("100%");
            if (xlMod.scrollSettings.isResponsive) {
                ribbonElem.ejRibbon("option", { allowResizing: true });
                if ((xlObj._phoneMode || xlObj._tabMode) && (xlObj._orientation === "landscape"))
                    ribbonElem.ejRibbon("collapse");
            }
            if (xlObj.model.ribbonSettings.enableOnDemand && !xlObj._isRibbonDestroyed) {
                this._homeTabControls();
                this._updateRibCustomCss(xlObj._getLocStr("HOME"));
                this._isHomeTabCreate = true;
                this._hideRibbonElem(xlObj._getLocStr("HOME"));
            }
            else {
                this._isHomeTabCreate = true,
                    this._isInsertTabCreate = true,
                    this._isDataTabCreate = true,
                    this._isPageLayoutTabCreate = true,
                    this._isReviewTabCreate = true,
                    this._isOthersTabCreate = true,
                    this._isDesignTabCreate = true,
                    this._isFormatTabCreate = true,
                    this._isChartTabCreate = true,
                    this._analyzeTabCreate = true,
                    this._isAppTabCreate = true;
                this._isSparklineTabCreate = true;
                $("#" + xlId + "_Ribbon_review_Comments_5").css("vertical-align", "middle");
                for (i = 0; i < 6; i++) {
                    if (i !== 1 && i !== 4)
                        this._updateRibCustomCss(tabName[i]);
                    this._hideRibbonElem(tabName[i]);
                }
            }
            this._hideOtherControls();
        },

        _createTabControls: function (tabName) {
            var xlObj = this.XLObj;
            switch (tabName) {
                case xlObj._getLocStr("HOME"):
                    if (!this._isHomeTabCreate) {
                        this._homeTabControls();
                        this._isHomeTabCreate = true;
                        xlObj._on($('#' + xlObj._id + '_cellstyles'), "click", xlObj._cellStyleClick);
                        xlObj._on($('#' + xlObj._id + '_formatastable'), "click", xlObj._formatAsTableClick);
                        this._updateRibCustomCss(tabName);
                        this._hideRibbonElem(tabName);
                    }
                    break;
                case xlObj._getLocStr("INSERT"):
                    if (!this._isInsertTabCreate) {
                        this._isInsertTabCreate = true;
                        xlObj._on($(".e-" + xlObj._id + ".e-chartcell"), "click", xlObj._chartClickHandler);
                        this._hideRibbonElem(tabName);
                    }
                    break;
                case xlObj._getLocStr("DATATAB"):
                    if (!this._isDataTabCreate) {
                        this._isDataTabCreate = true;
                        this._updateRibCustomCss(tabName);
                        this._hideRibbonElem(tabName);
                    }
                    break;
                case xlObj._getLocStr("PAGELAYOUT"):
                    if (!this._isPageLayoutTabCreate) {
                        this._pageTabControls();
                        this._isPageLayoutTabCreate = true;
                        this._updateRibCustomCss(tabName);
                        this._hideRibbonElem(tabName);
                    }
                    break;
                case xlObj._getLocStr("REVIEW"):
                    if (!this._isReviewTabCreate) {
                        $("#" + xlObj._id + "_Ribbon_review_Comments_5").css("vertical-align", "middle");
                        this._isReviewTabCreate = true;
                        this._hideRibbonElem(tabName);
                    }
                    break;
                case xlObj._getLocStr("OTHERS"):
                    if (!this._isOthersTabCreate) {
                        this._othersTabControls();
                        this._isOthersTabCreate = true;
                        this._updateRibCustomCss(tabName);
                        xlObj._on($('#' + xlObj._id + '_nmuseinformula'), "click", ".e-nmuseinformularow", xlObj._useInFormulaClick);
                        this._hideRibbonElem(tabName);
                    }
                    break;
                case xlObj._getLocStr("FORMAT"):
                    if (!this._isFormatTabCreate)
                        this._isFormatTabCreate = true;
                    break;
                case xlObj._getLocStr("DESIGN"):
                    if (!this._isDesignTabCreate)
                        this._isDesignTabCreate = true;
                    break;
                case xlObj._getLocStr("CHARTDESIGN"):
                    if (!this._isChartTabCreate)
                        this._isChartTabCreate = true;
                    break;
                case xlObj._getLocStr("ANALYZE"):
                    if (!this._analyzeTabCreate)
                        this._isFormatTabCreate = true;
                    break;
                case xlObj._getLocStr("SPARKLINEDESIGN"):
                    if (!this._isSparklineTabCreate)
                        this._isSparklineTabCreate = true;
                    break;
            }
        },

        _createTrgtElement: function (actTab, ribbonElem) {
            var xlObj = this.XLObj, ribbonElem = ribbonElem ? ribbonElem : $("#" + xlObj._id + "_Ribbon");
            switch (actTab) {
                case xlObj._getLocStr("HOME"):
                    !this._isHomeTabTrgt && this._homeTabTrgtElem();
                    this._isHomeTabTrgt = true;
                    break;
                case xlObj._getLocStr("INSERT"):
                    !this._isInsertTabTrgt && this._onTabCreate();
                    this._isInsertTabTrgt = true;
                    break;
                case xlObj._getLocStr("DATATAB"):
                    !this._isDataTabTrgt && this._dataTabTrgtElem();
                    this._isDataTabTrgt = true;
                    break;
                case xlObj._getLocStr("PAGELAYOUT"):
                    !this._isPageLayoutTabTrgt && this._pageTabTrgtElem(ribbonElem);
                    this._isPageLayoutTabTrgt = true;
                    break;
                case xlObj._getLocStr("OTHERS"):
                    !this._isOthersTabTrgt && this._othersTabTrgtElem();
                    this._isOthersTabTrgt = true;
                    break;
                case xlObj._getLocStr("CHARTDESIGN"):
                    !this._isChartTabTrgt && this._renderChartDesignTab();
                    this._isChartTabTrgt = true;
                    break;
                case xlObj._getLocStr("ANALYZE"):
                    !this._analyzeTabTrgt && this._renderAnalyzeTab();
                    this._analyzeTabTrgt = true;
                    break;
                case xlObj._getLocStr("FORMAT"):
                    !this._isFormatTabTrgt && this._renderFormatTab();
                    this._isFormatTabTrgt = true;
                    break;
                case xlObj._getLocStr("DESIGN"):
                    !this._isDesignTabTrgt && this._renderDesignTab();
                    this._isDesignTabTrgt = true;
                    break;
                case xlObj._getLocStr("SPARKLINEDESIGN"):
                    if (xlObj.model.allowSparkline)
                        !this._isSparklineTrgt && xlObj.XLSparkline._renderSparklineTab();
                    this._isSparklineTrgt = true;
                    break;
            }
        },

        _onTabCreate: function () {
            var xlObj = this.XLObj, xlId = xlObj._id, xlEle = xlObj.element, ribbonElem = $("#" + xlObj._id + "_Ribbon");
            xlEle.append(this._chartType("ColumnChart", 6, 2, 2, ["column", "stackingcolumn", "stackingcolumn100", "column", "stackingcolumn", "stackingcolumn100"], [xlObj._getLocStr("ClusteredColumn"), xlObj._getLocStr("StackedColumn"), "100%&nbsp;" + xlObj._getLocStr("StackedColumn"), "3-D&nbsp;" + xlObj._getLocStr("ClusteredColumn"), "3-D&nbsp;" + xlObj._getLocStr("StackedColumn"), "3-D&nbsp;100%&nbsp;" + xlObj._getLocStr("StackedColumn")]));
            xlEle.append(this._chartType("BarChart", 6, 2, 2, ["bar", "stackingbar", "stackingbar100", "bar", "stackingbar", "stackingbar100"], [xlObj._getLocStr("ClusteredBar"), xlObj._getLocStr("StackedBar"), "100%&nbsp;" + xlObj._getLocStr("StackedBar"), "3-D&nbsp;" + xlObj._getLocStr("ClusteredBar"), "3-D&nbsp;" + xlObj._getLocStr("StackedBar"), "3-D&nbsp;100%&nbsp;" + xlObj._getLocStr("StackedBar")]));
            xlEle.append(this._chartType("StockChart", 2, 2, 2, ["radar", "radar"], [xlObj._getLocStr("Radar"), xlObj._getLocStr("RadarMarkers")]));
            xlEle.append(this._chartType("LineChart", 2, 2, 3, ["line", "line"], [xlObj._getLocStr("Line"), xlObj._getLocStr("LineMarkers")]));
            xlEle.append(this._chartType("AreaChart", 3, 3, 3, ["Area", "stackingarea", "stackingarea100"], [xlObj._getLocStr("Area"), xlObj._getLocStr("StackedArea"), "100%&nbsp;" + xlObj._getLocStr("StackedArea")]));
            xlEle.append(this._chartType("PieChart", 3, 3, 4, ["pie", "pie", "doughnut"], [xlObj._getLocStr("Pie"), "3-D&nbsp;" + xlObj._getLocStr("Pie"), xlObj._getLocStr("Doughnut")]));
            xlEle.append(this._chartType("ScatterChart", 1, 2, 2, ["scatter"], [xlObj._getLocStr("Scatter")]));
            ribbonElem.append("<div id='" + xlObj._id + "_nmuseinformula' class='e-nmuseinformula' style='width:125px'></div>");
        },

        _rbnDestroy: function (args) {
            var xlObj = this.XLObj, xlId = xlObj._id, fillColor = "#" + xlId + "_Ribbon_Home_Font_FillColor", fontColor = "#" + xlId + "_Ribbon_Home_Font_FontColor",
                pictureColor = "#" + xlId + "_Ribbon_PictureColor", sparklineColor = "#" + xlId + "_Ribbon_SparklineColor", markerNegativePointColor = "#" + xlId + "_Ribbon_MarkerNegativePoint", markerHighPointColor = "#" + xlId + "_Ribbon_MarkerHighPoint", markerLowPoint = "#" + xlId + "_Ribbon_MarkerLowPoint", borderColor = "#" + xlId + "_Ribbon_Home_Font_BorderColor", borderCP = "#" + xlId + "_Ribbon_BorderCP",
                rObj = $("#" + xlId + "_Ribbon").ejRibbon("instance"), actTab = rObj.getTabText(rObj.model.selectedItemIndex), isRibDemand = xlObj.model.ribbonSettings.enableOnDemand;
            $(fillColor).data("ejColorPicker") && $(fillColor).ejColorPicker("destroy");
            $(fontColor).data("ejColorPicker") && $(fontColor).ejColorPicker("destroy");
            $(pictureColor).data("ejColorPicker") && $(pictureColor).ejColorPicker("destroy");
            $(borderColor).data("ejColorPicker") && $(borderColor).ejColorPicker("destroy");
            $(sparklineColor).data("ejColorPicker") && $(sparklineColor).ejColorPicker("destroy");
            $(markerNegativePointColor).data("ejColorPicker") && $(markerNegativePointColor).ejColorPicker("destroy");
            $(markerHighPointColor).data("ejColorPicker") && $(markerHighPointColor).ejColorPicker("destroy");
            $(markerLowPoint).data("ejColorPicker") && $(markerLowPoint).ejColorPicker("destroy");
            $("#" + xlId + "_Ribbon_Home_Font_BorderColor_Presets").parent().remove();
            $(borderCP).data("ejColorPicker") && $(borderCP).ejColorPicker("destroy");
            if (args && !args.destroy) {
                xlObj._off($('#' + xlId + '_cellstyles'), "click", xlObj._cellStyleClick);
                xlObj._off($('#' + xlId + '_formatastable'), "click", xlObj._formatAsTableClick);
                $(borderColor)[0].style.display = "none";
                xlObj._off($(".e-" + xlId + ".e-chartcell"), "click", xlObj._chartClickHandler);
                if (!isRibDemand || (this._isHomeTabTrgt && actTab === xlObj._getLocStr("HOME"))) {
                    var xlId = xlObj._id, xlEle = xlObj.element, rbnId = xlId + "_Ribbon_", fontElem = rbnId + "Home_Font_";
                    xlEle.append(ej.buildTag("input", "", { display: "none" }, { id: fontElem + "FillColor", type: "text" }));
                    xlEle.append(ej.buildTag("input", "", { display: "none" }, { id: fontElem + "FontColor", type: "text" }));
                    xlEle.append(ej.buildTag("input", "", { display: "none" }, { id: fontElem + "BorderColor", type: "text" }));
                    xlEle.append(ej.buildTag("div.e-spreadsheet e-formatastable", "", { display: "none" }, { id: xlObj._id + "_formatastable" }));
                    xlObj.element.append(this._renderCellStyles());
                }
                else
                    this._isHomeTabTrgt = false;
                if (!isRibDemand || (this._isInsertTabTrgt && actTab === xlObj._getLocStr("INSERT")))
                    this._onTabCreate();
                else
                    this._isInsertTabTrgt = false;
                this._isHomeTabCreate = this._isInsertTabCreate = this._isDataTabCreate = this._isPageLayoutTabCreate = this._isReviewTabCreate = false;
                this._isOthersTabCreate = this._isDesignTabCreate = this._isFormatTabCreate = this._isChartTabCreate = this._isSparklineTabCreate = this._analyzeTabCreate = this._isAppTabCreate = false;
                xlObj._isRibbonDestroyed = true;
            }
            else {
                $(document.body).append($("#" + xlId + " _formatastable").parent());
                $(document.body).append($("#" + xlId + " _cellstyles").parent());
            }
        },

        _updateRibCustomCss: function (tabName) {
            var xlObj = this.XLObj, xlId = xlObj._id, appenchild1, appenchild2, before, child, newnode, newnode1, parent, i = 0, len, opts = "Options", parentid, beforeid, appenchild2id, btncls;
            switch (tabName) {
                case xlObj._getLocStr("HOME"):
                    var colorcls = "e-ssr-colpickHprt", fnt = "_Ribbon_Home_Font", font = "_Ribbon_home_Font_Home_Font_", pst = "_Ribbon_home_Clipboard_Home_Clipboard_Paste", btn = ["e-mergebtn", "e-borderbtn", "e-autosumbtn"];
                    var id = [xlId + font + "FontFamily", xlId + font + "FontSize"], cls = ["e-ssr-fontfamily", "e-ssr-fontsize"];
                    appenchild2id = [xlId + pst + opts], beforeid = [xlId + pst], parentid = [xlId + "_Ribbon_home_Clipboard_1"], btncls = [" e-ssr-pastebtnHprt"];
                    //add class for fill color
                    xlObj.addClass(document.getElementById(xlId + fnt + "_FillColorWrapper").children[0], colorcls);
                    //add class for font color
                    xlObj.addClass(document.getElementById(xlId + fnt + "_FontColorWrapper").children[0], colorcls);
                    //add class for fillcolor fontcolor 4 span tags
                    child = xlObj.element[0].querySelectorAll(".e-ssr-colpickHprt .e-color-container,.e-ssr-colpickHprt .e-select");
                    while (i < 4) {
                        xlObj.addClass(child[i], "e-ssr-colorcontainer");
                        i++;
                    }
                    //add class for border,merge,autosum buttons
                    i = 0;
                    while (i < 3) {
                        xlObj.addClass(document.querySelectorAll("." + btn[i])[0].parentNode, "e-ssr-horizontalprt");
                        i++;
                    }
                    //add class for font family,font size
                    i = 0;
                    while (i < 2) {
                        xlObj.addClass(document.getElementById(id[i]), cls[i]);
                        i++;
                    }
                    break;
                case xlObj._getLocStr("DATATAB"):
                    var datavalid = "_Ribbon_data_DataTools_Data_DataTools_DataValidation";
                    appenchild2id = [xlId + datavalid + opts], beforeid = [xlId + datavalid], parentid = [xlId + "_Ribbon_data_DataTools_1"], btncls = [" e-ssr-dtvaldtnHprt"];
                    break;
                case xlObj._getLocStr("PAGELAYOUT"):
                    var pagelayout = "_Ribbon_pagelayout_PageLayout_PageLayout_PageLayout_PageSize", ribshow = "_Ribbon_PageLayout_Show_", id = ["ej" + xlId + ribshow + "Headings", "ej" + xlId + ribshow + "Gridlines"], cls = ["e-vheading", "e-vgridlines"];
                    appenchild2id = [xlId + pagelayout + opts], beforeid = [xlId + pagelayout], parentid = [xlId + "_Ribbon_pagelayout_PageLayout_1"], btncls = [" e-ssr-pagesizebtnHprt", " e-ssr-sizebtnHprt"];
                    //add class for heading, gridlines
                    i = 0;
                    while (i < 2) {
                        xlObj.addClass(document.getElementById(id[i]), cls[i]);
                        i++;
                    }
                    break;
                case xlObj._getLocStr("OTHERS"):
                    var insCell = "InsertCell", insDelCell = "_Ribbon_others_Cells_Others_Cells_", delCell = "DeleteCell";
                    appenchild2id = [xlId + insDelCell + insCell + opts, xlId + insDelCell + delCell + opts], beforeid = [xlId + insDelCell + insCell, xlId + insDelCell + delCell], parentid = [xlId + "_Ribbon_others_Cells_1", xlId + "_Ribbon_others_Cells_2"], btncls = [" e-ssr-insertbtnHprt", " e-ssr-deletebtnHprt"];
                    break;
            }
            // add class for insert,delete,data validation,paste,pagelayout
            i = 0, len = parentid.length;
            while (i < len) {
                parent = document.getElementById(parentid[i]);
                before = document.getElementById(beforeid[i]);
                appenchild1 = document.getElementById(beforeid[i]);
                appenchild2 = document.getElementById(appenchild2id[i]);
                newnode = document.createElement("span");
                newnode.className = "e-ssr-verticalHparent" + btncls[i];
                newnode.style.display = "inherit";
                parent.insertBefore(newnode, before);
                newnode.appendChild(appenchild1);
                newnode.appendChild(appenchild2);
                if (btncls[0] === " e-ssr-pagesizebtnHprt") {
                    newnode1 = document.createElement("span");
                    newnode1.className = "e-ssr-verticalHparent" + btncls[i + 1];
                    newnode1.style.display = "inherit";
                    newnode1.appendChild(newnode);
                    parent.appendChild(newnode1);
                }
                i++;
            }
        },

        _hideOtherControls: function () {
            var i = 0, arr = ["CElement", "SElement", "Paste", "Border", "Merge", "SortFilter", "Clear", "ColumnChart", "BarChart", "Validation", "PageSize",
                "FPane", "Ins", "Del", "FindRep", "PastePic", "PictureBorder", "AutoSum", "ResetPic", "PictureBorder", "StockChart",
                "LineChart", "AreaChart", "PieChart", "ScatterChart", "color_Presets", "PictureColor_Presets", "Home_Font_BorderColor_Presets"],
                len = arr.length;
            while (i--)
                $("#" + this._id + "_Ribbon_" + arr[i]).hide();
            i = 0, arr = ["CFormat", "formatastable", "cellstyles", "ctxtmenu"], len = arr.length;
            while (i--)
                $("#" + this._id + "_" + arr[i]).hide();
        },

        // ribbon backstage
        _renderAppTab: function () {
            var htmlStr, xlObj = this.XLObj, bspage = [];
            // backstage content elements
            htmlStr = "<div  id='" + xlObj._id + "_backstagetabnew' style='display:none' class='e-ssr-bstabnew'><div class='e-ssr-bscontent' title='" + xlObj._getLocStr("BlankWorkbook") + "'><div class='e-ssr-bsnewtmpl' ><button id='" + xlObj._id + "_bstab_new_blank' type='button' class = 'e-rbn-button' ></button></div></div></div>";
            htmlStr = htmlStr.concat("<div id='" + xlObj._id + "_backstagetabsaveas' style='display:none' class='e-ssr-bstabsaveas'><div class='e-ssr-bscontent'><div class='e-ssr-bssaveasopt'><button id='" + xlObj._id + "_bstab_saveas_excel' type='button' class = 'e-rbn-button'></button><span>" + xlObj._getLocStr("SaveAsExcel") + "</span></div><div class='e-ssr-bssaveasopt'><button id='" + xlObj._id + "_bstab_saveas_csv' type='button' class = 'e-rbn-button'></button><span>" + xlObj._getLocStr("SaveAsCsv") + "</span></div><div class='e-ssr-bssaveasopt'><button id='" + xlObj._id + "_bstab_saveas_pdf' type='button' class = 'e-rbn-button'></button><span>" + xlObj._getLocStr("SaveAsPdf") + "</span></div></div></div>");
            htmlStr = htmlStr.concat("<div id='" + xlObj._id + "_backstagetabprint' style='display:none' class='e-ssr-bstabprint'><div class='e-ssr-bscontent'><div class='e-ssr-bsprintopt'><button id='" + xlObj._id + "_bstab_print_sheet' type='button' class = 'e-rbn-button'></button><span>" + xlObj._getLocStr("PrintSheet") + "</span></div><div class='e-ssr-bsprintopt'><button id='" + xlObj._id + "_bstab_print_selected' type='button' class = 'e-rbn-button'></button><span>" + xlObj._getLocStr("PrintSelected") + "</span></div></div></div>");
            xlObj.element.append(htmlStr);
            // backstage object construction
            bspage.push({ id: "new", text: xlObj._getLocStr("New"), itemType: ej.Ribbon.itemType.tab, contentID: xlObj._id + "_backstagetabnew" });
            bspage.push({ id: "open", text: xlObj._getLocStr("Open") + "...", itemType: ej.Ribbon.itemType.tab });
            bspage.push({ id: "saveas", text: xlObj._getLocStr("SaveAs"), itemType: ej.Ribbon.itemType.tab, contentID: xlObj._id + "_backstagetabsaveas" });
            bspage.push({ id: "print", text: xlObj._getLocStr("Print"), itemType: ej.Ribbon.itemType.tab, contentID: xlObj._id + "_backstagetabprint" });
            this._appTabCollection = { type: ej.Ribbon.applicationTabType.backstage, backstageSettings: { text: xlObj._getLocStr("File"), headerWidth: 124, height: xlObj._responsiveHeight - 2, width: xlObj._responsiveWidth - 3, pages: bspage } };
        },

        _onBackStageItemClick: function (args) {
            if (!this._isAppTabCreate) {
                this._appTabControls();
                this._isAppTabCreate = true;
            }
            var xlObj = this.XLObj, evnt, arg, settings = xlObj.model.ribbonSettings.applicationTab;
            xlObj.XLEdit._isEdit && xlObj.XLEdit.saveCell();
            xlObj.XLComment && xlObj.XLComment._isCommentEdit && xlObj.XLComment._updateCurCmntVal();
            if (xlObj._isSheetRename && !xlObj._updateSheetNames(null, false)) {
                xlObj.element.find("#" + xlObj._id + "_Ribbon").ejRibbon("hideBackstage");
                return;
            }
            if (settings.type === "menu") {
                evnt = { element: args.element };
                if (xlObj._trigger("menuClick", evnt))
                    return false;
                if (args.ID === "Open") {
                    xlObj.XLEdit._isEdit && xlObj.XLEdit.saveCell();
                    this._bSBtnClickHandler(args.ID.toLowerCase(), args);
                }
                else
                    this._bSBtnClickHandler(args.ID.toLowerCase(), args);
            }
            if (settings.type === "backstage") {
                if (args.type === "backstageItemClick") {
                    arg = { id: args.id, text: args.text, type: args.type, target: args.target, prop: args.model };
                    if (xlObj._trigger("menuClick", arg))
                        return false;
                    if (args.id === "open_backStageTab") {
                        xlObj.XLEdit._isEdit && xlObj.XLEdit.saveCell();
                        this._bSBtnClickHandler("open", args);
                    }
                }
                else {
                    arg = { e: args.e, type: args.type, status: args.status, target: args.target, id: args.target.id };
                    if (xlObj._trigger("menuClick", arg))
                        return false;
                    $("#" + xlObj._id + "_Ribbon").ejRibbon("hideBackstage");
                    xlObj._phoneMode && $("#" + xlObj._id + "_Ribbon").ejRibbon("goToMainContent");
                    var icon = args.model.prefixIcon;
                    this._bSBtnClickHandler(icon.indexOf("blank") > -1 ? icon.split("-")[2] : icon.split("-")[3], args);
                }
            }
        },

        _bSBtnClickHandler: function (tab, args) {
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), exportType,
                arg = { id: args.id || args.ID || args.target.id, status: args.status, prop: args.model, model: xlObj.model };
            if (xlObj._trigger("ribbonClick", arg))
                return false;
            $("#" + xlObj._id + "_Ribbon").ejRibbon("hideBackstage");
            switch (tab) {
                case "open":
                    if (xlObj.isDirty)
                        xlObj._showAlertDlg("confirm", "ImportAlert", "Open", 470);
                    else if (xlObj.model.importSettings.importMapper.length < 1) {
                        xlObj._showAlertDlg("Alert", "ImportExportUrl");
                        return;
                    }
                    else {
                        $("#" + xlObj._id + "_file .e-uploadinput").click();
                        (xlObj._browserDetails.name != "msie" && xlObj._browserDetails.name != "edge") && $("#" + xlObj._id + "_Ribbon_BackStage").show();
                        $("#" + xlObj._id + "_Ribbon").find(".e-backstagetitlecontent").text('').append("Open");
                    }
                    break;
                case "new":
                case "blank":
                    xlObj._isSheetsDirty() && xlObj._showAlertDlg("confirm", "DestroyAlert", "New", 470);
                    break;
                case "exportxl":
                case "exportcsv":
                case "exportpdf":
                    xlObj._showDialog(tab);
                    $("#" + xlObj._id + "_ExportFileNameDialog").ejDialog("open");
                    exportType = tab.split("export")[1];
                    xlObj.XLExport._exportType = exportType.indexOf("xl") > -1 ? "Excel" : exportType.charAt(0).toUpperCase() + exportType.slice(1);
                    break;
                case "print":
                case "printsheet":
                    xlObj.XLPrint.printSheet(sheetIdx);
                    break;
                case "printselected":
                    xlObj.XLPrint.printSelection(sheetIdx);
                    break;
            }
        },

        _contextualTabObj: function () {
            var xlObj = this.XLObj, xlId = xlObj._id, imgtop = "imagetop", createdObj;
            createdObj = {
                backgroundColor: "#FCFBEB",
                borderColor: "#F2CC1C",
                tabs: [
                    {
                        id: "design",
                        text: xlObj._getLocStr("Design"),
                        groups: [
                            {
                                id: "Properties",
                                text: xlObj._getLocStr("Properties"),
                                alignType: ej.Ribbon.alignType.rows,
                                type: "custom",
                                contentID: xlId + "_Ribbon_Design_Properties_TableProperties"
                            },
                            {
                                id: "Tools",
                                text: xlObj._getLocStr("Tools"),
                                alignType: ej.Ribbon.alignType.columns,
                                content: [{
                                    groups: [
                                        this._generateBtn("Design_Tools_ResizeTable", "ResizeTable", "textandimage", "e-icon e-ssr-resizetable", 101, this._smallBtnHeight, "ResizeTable", "ResizeTableContent"),
                                        this._generateBtn("Design_Tools_ConvertToRange", "ConvertToRange", "textandimage", "e-icon e-ssr-range", 130, this._smallBtnHeight, "ConvertToRange", "ConvertToRangeContent")
                                    ],
                                }
                                ]
                            },
                            {
                                id: "TableStyleOptions",
                                text: xlObj._getLocStr("TableStyleOption"),
                                alignType: ej.Ribbon.alignType.rows,
                                type: "custom",
                                contentID: xlId + "_Ribbon_Design_TableStyleOptions"
                            }
                        ]
                    }]
            };
            this._contextualTabCollection.push(createdObj);
            createdObj = {
                backgroundColor: "#EAF6BD",
                borderColor: "#90AA3C",
                tabs: [
                    {
                        id: "chartdesign",
                        text: xlObj._getLocStr("CHARTDESIGN"),
                        groups: [
                            {
                                id: "ChartLayouts",
                                text: xlObj._getLocStr("ChartLayouts"),
                                alignType: ej.Ribbon.alignType.columns,
                                content: [{
                                    groups: [
                                        this._generateSplitBtn("ChartDesign_ChartLayouts_AddChartElement", "AddChartElement", "textandimage", xlId + "_Ribbon_CElement", "", "e-icon e-ssr-celements", true, 65, this._bigBtnHeight, "bottom", "imagetop", "dropdown", "e-spreadsheet e-chartlayoutbtn", "AddChartElement", "AddChartElementContent")
                                    ]
                                }]
                            },
                            {
                                id: "Data",
                                text: xlObj._getLocStr("ChartDesignData"),
                                alignType: ej.Ribbon.alignType.rows,
                                content: [{
                                    groups: [
                                        this._generateBtn("ChartDesign_Data_SwitchRowColumn", "SwitchRowColumn", "textandimage", "e-icon e-ssr-srcolumn", 72, this._bigBtnHeight, "SwitchRowColumn", "SwitchRowColumnContent", "", "imagetop"),
                                        this._generateBtn("ChartDesign_Data_SelectData", "SelectData", "textandimage", "e-icon e-ssr-selectdata", 50, this._bigBtnHeight, "SelectData", "SelectDataContent", false, imgtop)
                                    ]
                                }]
                            },
                            {
                                id: "Type",
                                text: xlObj._getLocStr("ChartDesignType"),
                                alignType: ej.Ribbon.alignType.rows,
                                content: [{
                                    groups: [
                                        this._generateBtn("ChartDesign_Type_ChangeChartType", "ChartType", "textandimage", "e-icon e-ssr-charttype", 65, this._bigBtnHeight, "ChartType", "ChartTypeContent", false, imgtop)
                                    ]
                                }]
                            },
                            {
                                id: "ChartThemes",
                                text: xlObj._getLocStr("ChartThemes"),
                                alignType: ej.Ribbon.alignType.columns,
                                content: [{
                                    groups: [
                                        this._generateDD("ChartDesign_ChartThemes_ChartThemes", "ChartThemes", this._chartThemes, "1", 130, this._smallBtnHeight, "ChartThemes", "ChartThemesContent")
                                    ],
                                }]
                            },
                            {
                                id: "Size",
                                text: xlObj._getLocStr("ChartDesignSize"),
                                alignType: ej.Ribbon.alignType.columns,
                                content: [{
                                    groups: [{
                                        contentID: xlId + "_Ribbon_ChartDesign_Size_ChartSize",
                                        enableSeparator: true,
                                        type: ej.Ribbon.type.custom,
                                        height: 80
                                    }]
                                }]
                            }
                        ]
                    }]
            };
            this._contextualTabCollection.push(createdObj);
            if (xlObj.model.allowSparkline)
                this._contextualTabCollection.push(xlObj.XLSparkline._contextualTabInsert());
            createdObj = {
                backgroundColor: "#FCFBEB",
                borderColor: "#F2CC1C",
                tabs: [
                    {
                        id: "format",
                        text: xlObj._getLocStr("FORMAT"),
                        groups: [
                            {
                                id: "Adjust",
                                text: xlObj._getLocStr("Adjust"),
                                alignType: ej.Ribbon.alignType.columns,
                                content: [{
                                    groups: [
                                        this._generateBtn("Format_Adjust_ChangePicture", "ChangePicture", "textandimage", "e-icon e-ssr-changepicture", 120, this._mediumBtnHeight, "ChangePicture", "ChangePictureContent"),
                                        this._generateSplitBtn("Format_Adjust_ResetPicture", "ResetPicture", "textandimage", xlId + "_Ribbon_ResetPic", { dataSource: this._resetPicture, id: "id", parentId: "parentId", text: "text", spriteCssClass: "sprite" }, "e-icon e-ssr-resetpicture", false, 120, this._mediumBtnHeight, "left", "", "dropdown", "e-ss-resetpictbtn", "ResetPicture", "ResetPictureContent")
                                    ],
                                }
                                ]
                            },
                            {
                                id: "Border",
                                text: xlObj._getLocStr("Border"),
                                alignType: ej.Ribbon.alignType.columns,
                                content: [{
                                    groups: [
                                        this._generateSplitBtn("Format_Border_PictureBorder", "PictureBorder", "textandimage", xlId + "_Ribbon_PictureBorder", "", "e-icon e-ssr-pictureborder", false, 120, this._mediumBtnHeight, "left", "", "dropdown", "e-ss-pictbrdrbtn", "PictureBorder", "PictureBorderContent")
                                    ],
                                }
                                ]
                            },
                            {
                                id: "Size",
                                text: xlObj._getLocStr("FormatSize"),
                                alignType: ej.Ribbon.alignType.columns,
                                type: "custom",
                                contentID: xlId + "_Ribbon_Format_Size_PictureSize"
                            }
                        ]
                    }]
            };
            this._contextualTabCollection.push(createdObj);
            createdObj = {
                backgroundColor: "#FCF0F7",
                borderColor: "#C9599C",
                tabs: [
                    {
                        id: "analyze",
                        text: xlObj._getLocStr("ANALYZE"),
                        groups: [
                            {
                                id: "PivotTable",
                                text: xlObj._getLocStr("AnalyzePivotTable"),
                                alignType: ej.Ribbon.alignType.rows,
                                type: "custom",
                                contentID: xlId + "_pvttableproperties"
                            },
                            {
                                id: "DataSource",
                                text: xlObj._getLocStr("DataSource"),
                                alignType: ej.Ribbon.alignType.rows,
                                content: [{
                                    groups: [
                                        this._generateBtn("Analyze_DataSource_Refresh", "Refresh", "textandimage", "e-icon e-ssr-datarefresh", 50, this._bigBtnHeight, "RefreshTitle", "RefreshContent", false, imgtop),
                                        this._generateBtn("Analyze_DataSource_ChangeDataSource", "ChangeDataSource", "textandimage", "e-icon e-ssr-changedatasource", 50, this._bigBtnHeight, "ChangeDataSource", "ChangeDataSourceContent", false, imgtop)
                                    ],
                                }
                                ]
                            },
                            {
                                id: "Actions",
                                text: xlObj._getLocStr("Actions"),
                                alignType: ej.Ribbon.alignType.columns,
                                content: [{
                                    groups: [
                                        this._generateBtn("Analyze_Actions_ClearAll", "ClearAll", "textandimage", "e-icon e-ssr-pivotclearall", 75, this._smallBtnHeight, "ClearAll", "ClearAllContent", false, "", "e-datapadding"),
                                        this._generateBtn("Analyze_Actions_MovePivotTable", "MovePivotTable", "textandimage", "e-icon e-ssr-movepivottable", 120, this._smallBtnHeight, "MovePivotTable", "MovePivotTableContent", false, "", "e-datapadding")
                                    ],
                                }
                                ]
                            },
                            {
                                id: "Show",
                                text: xlObj._getLocStr("Show"),
                                alignType: ej.Ribbon.alignType.columns,
                                content: [{
                                    groups: [
                                        this._generateToggleBtn("Analyze_Show_FieldList", "FieldList", "textandimage", "e-icon e-ssr-fieldlist", "FieldListTitle", 50, this._bigBtnHeight, ["FieldListContent", "FieldListRemoveContent"], false, "", imgtop, null, null, true)
                                    ],
                                }
                                ]
                            }
                        ]
                    }]
            };
            this._contextualTabCollection.push(createdObj);
        },

        _onRibbonPin: function (args) {
            var xlObj = this.XLObj, settings = $.extend(true, {}, xlObj.model.scrollSettings);
            this._ribbonState = true;
            xlObj.getSheet(xlObj.getActiveSheetIndex())._isRibCollapsed = false;
            args.action = "toggleBtn";
            xlObj.model._isActPanelVisible = this._isPanelVisible;
            if (xlObj._isAutoWHMode) {
                this._refreshBackstageHeight();
                var dimension = xlObj._getElementDimension();
                xlObj.element.css({ height: dimension.height, width: dimension.width });
            }
            else
                xlObj._heightWidthCalculation(xlObj.getActiveSheetIndex(), settings, args);
            xlObj.model._isActPanelVisible && xlObj._refreshActivationPanel();
        },

        _onRibbonExpand: function (args) {
            var xlObj = this.XLObj, settings = $.extend(true, {}, xlObj.model.scrollSettings);
            args.action = "toggleBtn";
            if ((args.type === "expand" && (args.clickType === "dblclick") || xlObj._isKeyCtrlShftF2) || xlObj._phoneMode) {
                this._ribbonState = true;
                xlObj.getSheet(xlObj.getActiveSheetIndex())._isRibCollapsed = false;
                if (xlObj._isAutoWHMode) {
                    this._refreshBackstageHeight();
                    var dimension = xlObj._getElementDimension();
                    xlObj.element.css({ height: dimension.height, width: dimension.width });
                }
                else
                    xlObj._heightWidthCalculation(xlObj.getActiveSheetIndex(), settings, args);
                this.XLObj.model._isActPanelVisible && xlObj._refreshActivationPanel();
                xlObj._isKeyCtrlShftF2 = false;
            }
            else if (this.XLObj.model._isActPanelVisible) {
                xlObj.getActivationPanel().hide();
                this._isPanelVisible = xlObj.model._isActPanelVisible;
                xlObj.model._isActPanelVisible = false;
                xlObj._heightWidthCalculation(xlObj.getActiveSheetIndex(), settings, args);
            }
        },

        _onRibbonGroupClick: function (args) {
            var xlObj = this.XLObj;
            if (!xlObj._phoneMode)
                return;
            if ($(args.target).parents(".e-resizegroupdiv").length > 0 || (args.target.className.indexOf("e-resizegroupdiv") > -1) || (args.target.className.indexOf("e-ribdownarrow") > -1) || (args.target.className.indexOf("e-ribuparrow") > -1) || (args.target.className.indexOf("e-ribleftarrow") > -1)) {
                var settings = $.extend(true, {}, xlObj.model.scrollSettings);
                this._ribbonState = true;
                args.action = "toggleBtn";
                xlObj.model._isActPanelVisible = this._isPanelVisible;
                if (xlObj._isAutoWHMode) {
                    this._refreshBackstageHeight();
                    var dimension = xlObj._getElementDimension();
                    xlObj.element.css({ height: dimension.height, width: dimension.width });
                }
                else
                    xlObj._heightWidthCalculation(xlObj.getActiveSheetIndex(), settings, args);
                xlObj.model._isActPanelVisible && xlObj._refreshActivationPanel();
            }
        },

        _hideTabs: function () {  // to hide ribbon tabs
            var i, robj = $("#" + this.XLObj._id + "_Ribbon").ejRibbon("instance"), tnames = ["", this.XLObj._getLocStr("Design"), this.XLObj._getLocStr("CHARTDESIGN"), this.XLObj._getLocStr("FORMAT"), this.XLObj._getLocStr("ANALYZE"), this.XLObj._getLocStr("SPARKLINEDESIGN")];
            i = tnames.length;
            while (i = i - 1)
                robj.hideTab(tnames[i]);
        },

        // ribbon design tab
        _renderDesignTab: function () {
            var proxy = this.XLObj, htmlstr = '', tsotext = proxy._getLocStr('TableStyleOptions').split('/'), groupId = proxy._id + "_Ribbon_Design_TableStyleOptions";
            proxy.element.append('<input id=' + proxy._id + '_tableid type="text" style = "display:none"/>');
            htmlstr = '<div id=' + proxy._id + '_Ribbon_Design_Properties_TableProperties><div class="e-tablepropertiesrow" ><div class="e-tablepropertiescell">Table Name:</div></div><div class="e-tablepropertiesrow" ><div class="e-tablepropertiescell"><input type="text" id=' + proxy._id + '_Ribbon_Design_Properties_TableName class="ejinputtext" style="width:86px;opacity:0.7;height: 18px;text-indent: 3px;padding-left: 0px;box-sizing: content-box;" /></div></div></div>';
            htmlstr = htmlstr + '<div id=' + groupId + '><div class="e-tablestyleoptionsrow" ><div class="e-tablestyleoptionscell"><input id=' + groupId + '_FirstColumn type="checkbox" /><label class="e-tablestyleoptionslabel" for="' + groupId + '_FirstColumn">' + tsotext[0] + '</label></div><div class="e-tablestyleoptionscell" ><input id=' + groupId + '_LastColumn type="checkbox" /><label class="e-tablestyleoptionslabel" for="' + groupId + '_LastColumn">' + tsotext[1] + '</label></div></div><div class="e-tablestyleoptionsrow" ><div class="e-tablestyleoptionscell"><input id=' + groupId + '_TotalRow type="checkbox" /><label class="e-tablestyleoptionslabel" for="' + groupId + '_TotalRow">' + tsotext[2] + '</label></div><div class="e-tablestyleoptionscell" ><input id=' + groupId + '_FilterColumn type="checkbox" /><label class="e-tablestyleoptionslabel" for="' + groupId + '_FilterColumn">' + tsotext[3] + '</label></div></div></div>';
            proxy.element.append(htmlstr);
            $("#" + groupId + "_FirstColumn").ejCheckBox({ change: this._ribbonClickHandler });
            $("#" + groupId + "_LastColumn").ejCheckBox({ change: this._ribbonClickHandler });
            $("#" + groupId + "_TotalRow").ejCheckBox({ change: this._ribbonClickHandler });
            $("#" + groupId + "_FilterColumn").ejCheckBox({ change: this._ribbonClickHandler });
        },

        _renderFormatTab: function () {
            var xlObj = this.XLObj, xlId = xlObj._id, xlEle = xlObj.element, rbnId = xlId + "_Ribbon", formatElem = rbnId + "_Format_Size_";
            xlEle.append(ej.buildTag("ul", "", { width: "auto", display: "none" }, { id: rbnId + "_ResetPic" }));
            xlEle.append(this._borderPicture());
            xlEle.append("<div id=" + formatElem + "PictureSize class= e-ss-numeric style='display:none'><table><tr><td style='padding-right:4px;'>" + xlObj._getLocStr("Height") + ": </label></td><td style='padding-bottom:3px;'><input id='" + formatElem + "PictureHeight' type='text' /></td></tr><tr><td><labe>" + xlObj._getLocStr("Width") + ": </label></td><td><input id='" + formatElem + "PictureWidth' type='text' /></td></tr></table></div>");
            $("#" + formatElem + "PictureHeight").ejNumericTextbox({ name: "numeric", value: 100, minValue: 25, incrementStep: 5, change: $.proxy(this._pictureSizeChange, this, "PictureWidth") });
            $("#" + formatElem + "PictureWidth").ejNumericTextbox({ name: "numeric", value: 100, minValue: 25, incrementStep: 5, change: $.proxy(this._pictureSizeChange, this, "PictureHeight") });
            $("#" + rbnId + "_PictureColor").ejColorPicker({ modelType: "palette", presetType: "basic", cssClass: "e-ss-colorpicker e-ss-menuclrpkr", change: this._ribbonClickHandler });
            $("#" + rbnId + "_PictureColorWrapper").hide();
            $("#" + rbnId + "_PictureColor_popup").css({ "display": "block" });
            $("#" + xlId + "picturecolor ul li").find("a").remove();
            $("#" + xlId + "picturecolor ul li").append($("#" + rbnId + "_PictureColor_popup"));
        },

        _renderAnalyzeTab: function () {
            var xlObj = this.XLObj;
            xlObj.element.find("#" + xlObj._id + "_Ribbon_analyze_PivotTable_content").width(132);
            if (!xlObj.element.find("#" + xlObj._id + "_pvttableproperties").length)
                xlObj.element.append('<div id=' + xlObj._id + '_pvttableproperties style="display:none" ><div class="e-tablepropertiesrow" ><div class="e-tablepropertiescell">'+ xlObj._getLocStr("PivotTableName") + ':</div></div><div class="e-tablepropertiesrow" ><div class="e-tablepropertiescell"><input type="text" id=' + xlObj._id + '_Ribbon_Analyze_PivotTable_PivotTableName class="ejinputtext" style="width:106px;opacity:0.7;height: 18px;text-indent: 3px;" /></div></div></div>');
        },

        _renderChartDesignTab: function () {
            var xlObj = this.XLObj, xlEle = xlObj.element, xlId = xlObj._id, chartElem = xlId + "_Ribbon_ChartDesign_Size_";
            xlEle.append(this._chartElementTag());
            xlEle.append("<div id=" + chartElem + "ChartSize class= e-ss-numeric style='width: 180;height: 80;'><table><tr><td><label class ='e-icon e-ssr-chartheight' style='width:25;height:25;display: visible' id = " + xlId + "_Ribbon_chartheightlbl /></td><td><input id='" + chartElem + "ChartHeight' type='text' /></td></tr><tr><td><label class ='e-icon e-ssr-chartwidth' style='width: 180;height: 80;' id = " + xlId + "_Ribbon_chartwidthlbl /></td><td><input id='" + chartElem + "ChartWidth' type='text' /></td></tr></table></div>");
            $("#" + chartElem + "ChartWidth").ejNumericTextbox({ name: "numeric", value: 200, minValue: 180, decimalPlaces: 1, incrementStep: 5, change: this._ribbonClickHandler });
            $("#" + chartElem + "ChartHeight").ejNumericTextbox({ name: "numeric", value: 200, minValue: 180, decimalPlaces: 1, incrementStep: 5, change: this._ribbonClickHandler });
        },

        // Name Manager(NM)
        _renderNameManagerDlg: function () {
            var xlObj = this.XLObj, htmlStr = "<div id = '" + xlObj._id + "_nmdlg' style=display:'none'; ><div class='e-dlgctndiv' style='width: 100%;' ><div class='e-dlg-fields e-nmdlg-content' style='width: 100%;'><div class='e-ss-nm-dlg-grid' style='height: 180px;'><div id='" + xlObj._id + "_nmgrid' style=display:'none';></div></div></div><div class='e-dlg-fields'><label class='e-dlg-fields'>" + xlObj._getLocStr("RefersTo") + ":</label><input type='text' class='e-nmrange ejinputtext' id='" + xlObj._id + "_nmrange' disabled='true' /></div><div class='e-dlg-btnfields' ><div class='e-dlg-btnctnr'><button id='" + xlObj._id + "_nmclose' >" + xlObj._getLocStr("Close") + "</button></div></div></div></div>";
            htmlStr = htmlStr + "<script id='" + xlObj._id + "_nmeditortemplate' class='e-hide' type='text/x-jsrender' ><div class='e-dlg-fields e-dlgctndiv'><table cellpadding='0' cellspacing='0'><tr><td>" + xlObj._getLocStr("Name") + ":</td><td><input id='" + xlObj._id + "_nmgridname' type='text' class='ejinputtext' name='name' value='{{: name}}'/></td></tr><tr class='e-dlgtd-fields'><td>" + xlObj._getLocStr("Scope") + ":</td><td><input class='ejinputtext' id='" + xlObj._id + "_nmgridscope' type='text' name='scope' value='" + xlObj._getLocStr("Workbook") + "'/></td></tr><tr class='e-dlgtd-fields'><td>" + xlObj._getLocStr("Comment") + ":</td><td><textarea id='" + xlObj._id + "_nmgridcomment' class='e-ss-textarea' style=' resize: none; height: 44px; width: 100%;' name='comment' value='{{: comment}}'>{{: comment}}</textarea></td></tr><tr class='e-dlgtd-fields'><td>" + xlObj._getLocStr("RefersTo") + ":</td><td><input type='text' class='ejinputtext' id='" + xlObj._id + "_nmgridrefersto' name = 'refersto' value='{{: refersto}}' /></td></tr></table></div></script>";
            xlObj.element.append(htmlStr);
            $("#" + xlObj._id + "_nmclose").ejButton({ showRoundedCorner: true, width: 68, click: $.proxy(this._nmdlgClose, xlObj) });
            this._renderNMGrid();
            $("#" + xlObj._id + "_nmdlg").ejDialog({ enableResize: false, showOnInit: false, title: xlObj._getLocStr('NameManager'), enableModal: true, width: "auto", height: "auto", cssClass: "e-ss-dialog e-ss-nmdlg e-" + xlObj._id + "-dlg", close: ej.proxy(this._dialogClose, this), beforeClose: ej.proxy(this._beforeDlgClose, this), open: ej.proxy(this._nmDlgOpen, this) });
        },
          _renderNMDDownList: function () {
			  var xlObj = this.XLObj;
               $("#" + xlObj._id + "_nmgridscope").ejDropDownList({
               dataSource: this._nameMSheetNames(),
                width: "100%",
                height: "44px"
            });
        },
		_nameMSheetNames: function() { 
		 var xlObj = this.XLObj, sheetname = [], shtnameclt =[], i, len, sheets = xlObj._getSheetNames();
            shtnameclt[0] = { value: "Workbook", text:"Workbook" };
            for (i = 1, len = sheets.length; i <= len; i++) {
                if (sheets[i - 1].isVisible) {
                    sheetname[i] = sheets[i - 1].text;
                    shtnameclt[i] = { value: sheetname[i], text: sheetname[i] };
                }
            }
            return shtnameclt;
		},
        _renderNMGrid: function () {
            var xlObj = this.XLObj;
            $("#" + xlObj._id + "_nmgrid").ejGrid({
                locale: xlObj.model.locale,
                dataSource: xlObj.model.nameManager.slice(0),
                allowScrolling: true,
                allowSorting: true,
                enableAltRow: false,
                isResponsive: true,
                minWidth: 400,
                allowPaging: false,
                scrollSettings: { height: "100%" },
                cssClass: "e-ss-dialog e-ss-grid e-" + xlObj._id + "-dlg",
                selectionType: ej.Grid.SelectionType.Single,
                editSettings: { allowAdding: true, allowDeleting: false, editMode: ej.Grid.EditMode.DialogTemplate, dialogEditorTemplateID: "#" + xlObj._id + "_nmeditortemplate" },
                toolbarSettings: { showToolbar: true, toolbarItems: [ej.Grid.ToolBarItems.Add] },
                actionBegin: $.proxy(this._nmActionBegin, xlObj),
                actionComplete: $.proxy(this._nmActionComplete, xlObj),
                rowSelected: $.proxy(this._nmRecordSelected, xlObj),
                columns: [
                    { field: "name", headerText: xlObj._getLocStr("Name"), isPrimaryKey: true, width: 100 },
                    { field: "refersto", headerText: xlObj._getLocStr("RefersTo"), width: 120 },
                    { field: "scope", headerText: xlObj._getLocStr("Scope"), width: 80 },
                    { field: "comment", headerText: xlObj._getLocStr("Comment"), width: 100 }
                ]
            });
        },

        _updateNMRange: function () {
            var xlObj = this.XLObj;
            $("#" + xlObj._id + "_nmgridEditForm").find("#" + xlObj._id + "_nmgridrefersto").val("=" + xlObj._getDollarAlphaRange(xlObj.getSheet(xlObj.getActiveSheetIndex()).selectedRange, true));
        },

        _nmdlgClose: function () {
            $("#" + this._id + "_nmdlg").ejDialog("close");
        },

        _nmRecordSelected: function (args) {
            $("#" + this._id + "_nmdlg").find(".e-nmrange").val(args.data.refersto);
        },
        _nmDlgOpen: function (args) {
            var xlObj = this.XLObj;
            if (this._isNmgrid === "DefineName") {
                $("#" + xlObj._id + "_nmgrid").ejGrid("instance").addRecord();
                ($("#" + xlObj._id + "_nmgridEditForm input")[0]).focus();
            }
            this._isNmgrid = "";
        },
        _nmActionBegin: function (args) {  // validating input
            var i = 0, canBreak = false, len, prop, data, sheet = this.getSheet(this.getActiveSheetIndex());
            if (args.requestType === "save" && args.data.refersto) {
                data = args.data;
                data.sheetIndex = this._getSheetIndexByName(args.data.refersto.split("!")[0].replace(/[=\']/g, ""));
                args.cancel = true;
                if (!data.sheetIndex) {
                    this._showAlertDlg("Alert", "InvalidSheetIndex", "NMRangeAlert", 275);
                    return;
                }
                if (sheet._nmEdit) {
                    for (prop in sheet._nmValue) {
                        len = this.model.nameManager.length;
                        while (i < len) {
                            if (this.model.nameManager[i].name === sheet._nmValue.name) {
                                this.model.nameManager.splice(i, 1);
                                this._calcEngine.removeNamedRange(sheet._nmValue.name);
                                break;
                            }
                            i++;
                        }
                        i = this._formulaCollection.length;
                        while (i--) {
                            if (this._formulaCollection[i].display === sheet._nmValue.name) {
                                canBreak = true;
                                this._formulaCollection.splice(i, 1);
                                break;
                            }
                        }
                        if (canBreak)
                            break;
                    }
                }
                if (this.XLRibbon._validateNamedRange(data.name, data.refersto, data.scope))
                    args.cancel = false;
                else
                    canBreak && this.model.nameManager.push(sheet._nmValue);
            }
            if (args.requestType === "beginedit") {
                sheet._nmEdit = true;
                sheet._nmValue = { name: args.model.dataSource[args.model.selectedRowIndex].name, refersto: args.model.dataSource[args.model.selectedRowIndex].refersto, comment: args.model.dataSource[args.model.selectedRowIndex].comment, sheetIndex: args.model.dataSource[args.model.selectedRowIndex].sheetIndex, scope: args.model.dataSource[args.model.selectedRowIndex].scope };
            }
        },

        _nmActionComplete: function (args) {
            var gridInst = $("#" + this._id + "_nmgrid").data("ejGrid"), reqType = args.requestType, editDlgInst, editDlgInpElem;
            switch (reqType) {
                case "add":
                    editDlgInst = $("#" + this._id + "_nmgrid_dialogEdit").data("ejDialog");
                    editDlgInst.model.open = $.proxy(this.XLRibbon._updateNMRange(), this);
                    editDlgInst.option("allowDraggable", false);
                    editDlgInst.option("title", this._getLocStr("NewName"));
                    editDlgInpElem = $("#" + this._id + "_nmgridEditForm").find("input[type='button']:first");
                    editDlgInpElem.data("ejButton").option({ "text": this._getLocStr("Ok"), cssClass: "e-ss-okbtn" });
                    editDlgInpElem.parent().addClass("e-dlg-btnfields").css("text-align", "right");
					this.XLRibbon._renderNMDDownList();
                    break;
                case "save":
                    this.XLRibbon._addNamedRange(args.data.name, args.data.refersto, args.data.comment, args.data.sheetIndex, args.data.scope);
                    break;
                case "delete":
                    this.XLRibbon._removeNamedRange(gridInst, args.data.name, args.data.scope);
                    break;
                case "cancel":
                    gridInst.element.focus();
                    break;
            }
        },

        _updateNamedRanges: function (name, refersto, skipAutoComp, scope) {
            var xlObj = this.XLObj;
            refersto = xlObj.XLEdit._parseSheetRef(refersto, true);
			if(scope.toUpperCase() === "WORKBOOK") {
				xlObj._calcEngine.addNamedRange(name, refersto.replace("=", ""));
				this._scopeBookCln[name] = {isName: true};
			}
			else
				xlObj._calcEngine.addNamedRange(scope + "!" + name, refersto.replace("=", ""));
            this._updateScopeRange();
            if (!skipAutoComp)
                xlObj.XLEdit._refreshAutoComplete();
        },

        _updateUseInFormulaTrgt: function () {
            var i = 0, xlObj = this.XLObj, htmlStr = "", trgt = $("#" + xlObj._id + "_nmuseinformula"), nameMgr = xlObj.model.nameManager, len = nameMgr.length, sheetIdx = xlObj.getActiveSheetIndex(), scopeIndex, ranges;
            while (i < len) {
				if(nameMgr[i].scope.toUpperCase() !== "WORKBOOK") {
					scopeIndex = xlObj._getSheetIndexByName(nameMgr[i].scope);
					ranges = xlObj.getSheet(sheetIdx)._scopeRanges;
				}
				if(nameMgr[i].scope.toUpperCase() === "WORKBOOK" || sheetIdx === scopeIndex && ranges && ranges[nameMgr[i]["name"]] && !ranges[nameMgr[i]["name"]]["isSameName"])
                      htmlStr = htmlStr + "<div class='e-nmuseinformularow' style = 'color:#333333'>" + nameMgr[i].name + "</div>";
                i++;
            }
            htmlStr.length ? $("#" + xlObj._id + "_Ribbon_Others_Formulas_UseInFormula").ejSplitButton("enable") : $("#" + xlObj._id + "_Ribbon_Others_Formulas_UseInFormula").ejSplitButton("disable");
            trgt.html("<div>" + htmlStr + "</div>");
        },

        addNamedRange: function (name, refersTo, comment, sheetIdx, scope) {
            var xlObj = this.XLObj, gridInst = $("#" + xlObj._id + "_nmgrid").data("ejGrid"), sheetIdx = sheetIdx || xlObj.getActiveSheetIndex(), nmgr = xlObj.model.nameManager, len = nmgr.length, i, sheet;
			scope = scope ? scope : "workbook" ;
            if (this._validateNamedRange(name, refersTo, scope)) {
                if (gridInst) {
                    gridInst.addRecord({ name: name, refersto: refersTo, comment: comment ? comment : "", scope: scope ? scope : "WorkBook", sheetIndex: sheetIdx });
                    gridInst.refreshContent();
                }
                else {
					//for(i=0;i<len;i++) {
						//if(nmgr[i].name.toUpperCase() === name.toUpperCase()) {
						//	sheet = xlObj.getSheet(sheetIdx);
						//	!sheet._scopeRanges[name] && (sheet._scopeRanges[name] = {});
						//	sheet._scopeRanges[name]["isSameName"] = true;
						//}
			        //}
                   // xlObj.model.nameManager.push({ name: name, refersto: refersTo, comment: comment, sheetIndex: sheetIdx, scope: scope ? scope : "workbook" });
                    this._addNamedRange(name, refersTo, comment, sheetIdx, scope);
                }
            }
        },

        _addNamedRange: function (name, refersTo, comment, sheetIdx, scope) {
            var xlObj = this.XLObj, nmgr = xlObj.model.nameManager, len = nmgr.length, i, scopeIndex, sheet;
			scope = scope ? scope : "workbook" ;
			scopeIndex = xlObj._getSheetIndexByName(scope)
			scopeIndex = scopeIndex ? scopeIndex : sheetIdx;
			if(scope.toUpperCase() !== "WORKBOOK") {
				sheet = xlObj.getSheet(scopeIndex);
				if(sheet._scopeRanges[name]) {
				   sheet._scopeRanges[name]["name"] = scope + "!" + name;
			       sheet._scopeRanges[name]["refersto"] = refersTo;
				}
				else 
					sheet._scopeRanges[name] = {name: scope + "!" + name, refersto:refersTo};
			}
			for(i=0;i<len;i++) {
				if(nmgr[i].name.toUpperCase() === name.toUpperCase() && ((nmgr[i].scope.toUpperCase() === "WORKBOOK" && scope.toUpperCase() !== "WORKBOOK") || nmgr[i].scope.toUpperCase() !== "WORKBOOK" && scope.toUpperCase() === "WORKBOOK")) {
					scopeIndex = (scope.toUpperCase() === "WORKBOOK") ? xlObj._getSheetIndexByName(nmgr[i].scope) : xlObj._getSheetIndexByName(scope);
					if(!xlObj.getObjectLength(xlObj.getSheet(scopeIndex)._scopeRanges[name]))
						xlObj.getSheet(scopeIndex)._scopeRanges[name] = {}
					xlObj.getSheet(scopeIndex)._scopeRanges[name]["isSameName"] = true;
				}
			}
			if(!(xlObj.isImport || xlObj.model.isImport))
			   xlObj.model.nameManager.push({ name: name, refersto: refersTo, comment: comment, sheetIndex: sheetIdx, scope: scope });
            this._updateNamedRanges(name, refersTo, false, scope);
			if(!(xlObj.isImport || xlObj.model.isImport))
				this._updateUseInFormulaTrgt();
            !xlObj._isSheetNavigate && xlObj._trigActionComplete({ sheetIndex: sheetIdx, reqType: "named-range", name: name, refersTo: refersTo, comment: comment });
        },

        removeNamedRange: function (name, scope) {
            if (!name)
				return;
            var xlObj = this.XLObj, gridInst = $("#" + xlObj._id + "_nmgrid").data("ejGrid"), nameMgr, nameMgrIdx;
			scope = scope ? scope : "workbook" ;
            if (gridInst) {
                gridInst.option("editSettings", { "allowDeleting": true });
                gridInst.deleteRecord("name", { name: name , scope: scope });
                gridInst.option("editSettings", { "allowDeleting": false });
            }
            else {
                nameMgr = xlObj.model.nameManager;
                nameMgrIdx = this._validateNameManager(name, scope);
				if(nameMgrIdx < 0)
					return;
                xlObj.model.nameManager.splice(nameMgrIdx, 1);
                this._removeNamedRange(gridInst, name, scope);
            }
        },

        _removeNamedRange: function (gridInst, name, scope) {
            var i, nameMgr, xlObj = this.XLObj;
            gridInst && (xlObj.model.nameManager = gridInst.model.dataSource.slice(0));
            nameMgr = xlObj.model.nameManager;
			if(scope.toUpperCase() === "WORKBOOK")
				delete this._scopeBookCln[name];
			else {
				var scopeRange = xlObj.getSheet(xlObj._getSheetIndexByName(scope))._scopeRanges, scopeName = name;
				name = scopeRange[name].name;
				delete scopeRange[scopeName];
			}
            xlObj._calcEngine.removeNamedRange(name);
            xlObj._updateFormulaCollection();
            i = nameMgr.length;
            if (i) {
                while (i--)
                    xlObj._formulaCollection.push({ text: "=" + nameMgr[i].name, display: nameMgr[i].name });
            }
            this._updateUseInFormulaTrgt();
				
        },
		
		_updateScopeRange: function() { 
		 var i, xlObj = this.XLObj, nameMgr = xlObj.model.nameManager, len = nameMgr.length, sheetIdx = xlObj.getActiveSheetIndex(), sheet =  xlObj.getSheet(sheetIdx);
		  xlObj._updateFormulaCollection();
		  for(i=0;i<len;i++)
		  {
			  if(nameMgr[i].scope.toUpperCase() === "WORKBOOK" || xlObj._getSheetIndexByName(nameMgr[i].scope) === sheetIdx) {
				  if(sheet._scopeRanges[nameMgr[i].name] && sheet._scopeRanges[nameMgr[i].name].isSameName && nameMgr[i].scope.toUpperCase() !== "WORKBOOK")
					xlObj._formulaCollection.push({ text: "=" + nameMgr[i].name + " (worksheet)", display: nameMgr[i].name + "(worksheet)" });
				else
					xlObj._formulaCollection.push({ text: "=" + nameMgr[i].name, display: nameMgr[i].name });
			  }
		  }
		},

        _validateNamedRange: function (name, refersTo, scope) {
            var range, libMgr, nameMgr, adlg, text, xlObj = this.XLObj, rangeAlert = "NMRangeAlert", invalidName = "NMNameAlert", uniqueName = "NMUniqueNameAlert", action;
            range = this._validateDollarRange(refersTo);
            if (name)
                (name.length > 0) && (libMgr = /^([a-zA-Z_0-9]){0,255}$/.test(name) && this._validateLibraryFunctions(name));
            nameMgr = this._validateNameManager(name, scope);
            if (xlObj._isUndoRedo || (range && libMgr && nameMgr < 0))
                return true;
            else {
                adlg = $("#" + xlObj._id + "_alertdlg");
                if (!range)
                    text = xlObj._getLocStr(rangeAlert), action = rangeAlert;
                else if (!libMgr)
                    text = xlObj._getLocStr(invalidName).split("/")[0], action = invalidName;  // not used completely
                else
                    text = xlObj._getLocStr(uniqueName), action = uniqueName;
                xlObj._showAlertDlg("Alert", "T-" + text, action, 370);
            }
        },

        _validateLibraryFunctions: function (name) {
            var i, arr = [], libraryFunc = this.XLObj.getCalcEngine().getLibraryFunctions();
            name = ej.isNullOrUndefined(name) ? "" : name.toString().toUpperCase();
            for (i in libraryFunc.items)  // for hashable issue (return false => always return true)
                arr.push(i);
            i = arr.length;
            while (i--)
                if (arr[i] === name) return false;
            return true;
        },

        _validateNameManager: function (name, scope) {
            var i = 0, nameMgr = this.XLObj.model.nameManager, length = nameMgr.length;
            name = ej.isNullOrUndefined(name) ? "" : name.toString().toUpperCase();
			scope = scope ? scope : "Workbook";
            while (i < length) {
                if (nameMgr[i].scope.toUpperCase() === scope.toUpperCase() && nameMgr[i].name.toUpperCase() === name)
                    return i;
                i++;
            }
            return -1;
        },

        _validateDollarRange: function (range) {
            try {
                if (range && range.indexOf("!") > -1) {
                    range = range.split("!")[1].replace(/\$/g, "");
                    this.XLObj.getRangeIndices(range);
                    return true;
                }
            }
            catch (err) {
                return false;
            }
        },

        // Format as table(FAT)
        _renderFormatAsTable: function () {
            var parent, child, len, xlObj = this.XLObj, i = 0, separator = [11, 19], j = 0, str = '', htmlstr = '',
                b = 'w:bold', c1 = 'c:#FFFFFF', c2 = 'c:#000000', c3 = 'c:#2F75B5', c4 = 'c:#ED7D31', c5 = 'c:#FFC000', b1 = '1px solid #000000', b2 = '1px solid #2f75b5', b3 = '1px solid #ED7D31', b4 = '1px solid #FFC000',
                d1 = 'b:#D9D9D9', d2 = 'b:#DDEBF7', d3 = 'b:#FCE4D6', d4 = 'b:#FFF2CC', d5 = 'b:#000000', d6 = 'b:#DBECF6', d7 = 'b:#FFE2C6', d8 = 'b:#FFF1BF', d9 = 'b:#000000', d10 = 'b:#D7D7D7', d11 = 'b:#FFC000', d12 = 'b:#5B9BD5', d13 = 'b:#Ed7D31',
                style = 'hl?' + b + ';' + c2 + ';bo:tb-' + b1 + '&cl?' + d1 + ';' + c2 + ',' + c2 + '&cb?b-' + b1 + '/hl?' + b + ';bo:tb-' + b2 + ';' + c3 + '&cl?' + d2 + ';' + c3 + ',' + c3 + '&cb?b-' + b2 + '/hl?' + b + ';bo:tb-' + b3 + ';' + c4 + '&cl?' + d3 + ';' + c4 + ',' + c4 + '&cb?b-' + b3 + '/hl?' + b + ';bo:tb-' + b4 + ';' + c5 + '&cl?' + d4 + ';' + c5 + ',' + c5 + '&cb?b-' + b4 + '/hl?' + b + ';' + d5 + ';' + c1 + ';bo:o-' + b1 + '&cl?bo:t-' + b1 + ';' + c2 + '&cb?o-' + b1 + '/hl?bo:o-' + b2 + ';' + b + ';' + d12 + ';' + c1 + '&cl?bo:t-' + b2 + ';' + c2 + '&cb?o-' + b2 + '/hl?' + b + ';b:#EB7E2F;' + c1 + ';bo:o-' + b3 + '&cl?bo:t-' + b3 + ';' + c2 + '&cb?o-' + b3 + '/hl?' + b + ';' + d11 + ';' + c1 + ';bo:o-' + b4 + '&cl?bo:t-' + b4 + ';' + c2 + '&cb?o-' + b4 + '/hl?' + b + ';bo:gb-' + b1 + ';' + c2 + '&cl?' + d1 + ';' + c2 + ',' + c2 + '&cb?gb-' + b1 + '/hl?' + b + ';bo:gb-' + b2 + ';' + c2 + '&cl?' + d2 + ';' + c2 + ',' + c2 + '&cb?gb-' + b2 + '/hl?' + b + ';bo:gb-' + b3 + ';' + c2 + '&cl?' + d3 + ';' + c2 + ',' + c2 + '&cb?gb-' + b3 + '/hl?' + b + ';bo:gb-' + b4 + ';' + c2 + '&cl?' + d4 + ';' + c2 + ',' + c2 + '&cb?gb-' + b4 + '/hl?' + b + ';' + d5 + ';' + c1 + '&cl?b:#A6A6A6;' + c2 + ',' + d1 + ';' + c2 + '/hl?' + b + ';' + d12 + ';' + c1 + '&cl?b:#BDD7EE;' + c2 + ',' + d2 + ';' + c2 + '/hl?' + b + ';' + d13 + ';' + c1 + '&cl?b:#F8CBAD;' + c2 + ',' + d3 + ';' + c2 + '/hl?' + b + ';' + d11 + ';' + c1 + '&cl?b:#FFE699;' + c2 + ',' + d4 + ';' + c2 + '/hl?' + b + ';' + d10 + ';' + c2 + ';bo:gb-' + b1 + '&cl?b:#A7A7A7;' + c2 + ',' + d10 + ';' + c2 + '&cb?gb-' + b1 + '/hl?' + b + ';' + d6 + ';' + c2 + ';bo:gb-' + b2 + '&cl?b:#BED8F1;' + c2 + ',' + d2 + ';' + c2 + '&cb?gb-' + b2 + '/hl?' + b + ';' + d7 + ';' + c2 + ';bo:gb-' + b3 + '&cl?b:#F6CAAD;' + c2 + ',' + d7 + ';' + c2 + '&cb?gb-' + b3 + '/hl?' + b + ';' + d8 + ';' + c2 + ';bo:gb-' + b4 + '&cl?b:#FDE18D;' + c2 + ',' + d8 + ';' + c2 + '&cb?gb-' + b4 + '/hl?' + b + ';' + d9 + ';' + c1 + '&cl?b:#404040;' + c1 + ',b:#737373;' + c1 + '/hl?' + b + ';' + d9 + ';' + c1 + '&cl?b:#2F75B5;' + c1 + ',' + d12 + ';' + c1 + '/hl?' + b + ';' + d9 + ';' + c1 + '&cl?b:#C65911;' + c1 + ',' + d13 + ';' + c1 + '/hl?' + b + ';' + d9 + ';' + c1 + '&cl?b:#BF8F00;' + c1 + ',' + d11 + ';' + c1,
                hdrtext = xlObj._getLocStr('FATHeaderText').split('/'),
                title = xlObj._getLocStr('FormatAsTableTitle').split('/'),
                name = ["Light1", "Light2", "Light3", "Light5", "Light8", "Light9", "Light10", "Light12", "Light15", "Light16", "Light17", "Light19", "Medium8", "Medium9", "Medium10", "Medium12", "Medium22", "Medium23", "Medium24", "Medium26", "Dark1", "Dark2", "Dark3", "Dark5"];
            style = style.split('/');
            while (i < 24) {
                str = str + xlObj._renderDIV('e-formatastablecell', '<div class="e-ss-cellstyles-' + (i + 1) + '" ></div>');
                if (i === separator[j]) {
                    str += '</br>';
                    j++;
                }
                i++;
            }
            i = 0, str = str.split('</br>');
            while (i < hdrtext.length * 2) {
                htmlstr += xlObj._renderDIV(i % 2 === 0 ? 'e-formatastableheader' : 'e-formatastablecontent', i % 2 === 0 ? hdrtext[i / 2] : str[0]);
                if (i % 2 != 0)
                    str.shift();
                i++;
            }
            parent = document.getElementById(xlObj._id + '_formatastable');
            parent.innerHTML = htmlstr;
            parent = $(parent);
            child = parent.find('.e-formatastablecell');
            i = 0, len = child.length;
            while (i < len) {
                $(child[i]).attr("id", "Table Style " + name[i]);
                $(child[i]).attr("title", xlObj._getLocStr("FATTitlePrefix") + title[i]);
                i++;
            }
            if (xlObj.XLFormat)
                xlObj.XLFormat._formatAsTableStyle = xlObj._FATStyles['TableStyleLight1'];
            parent.find(".e-formatastableheader:eq(0)").append("<span id ='" + xlObj._id + "_formatastable_back' class = 'e-formatastable-back e-icon e-ss-leftarrow'/>");
            parent.data("ejMenu").model.open = function (args) {
                parent.scrollTop(0);
            };
            return parent;
        },

        _renderFATNameDlg: function () {
            var htmlstr, xlObj = this.XLObj, proptext = xlObj._getLocStr('FATNameDlgText').split('/'), obj = { showRoundedCorner: true, width: "27%", click: $.proxy(this._fatNameDlgBtnClick, this) };
            htmlstr = '<div id=' + xlObj._id + '_fatnamedlg><div class="e-dlg-fields e-dlgctndiv e-ss-nmdlg"><table cellspacing="0" cellpadding="0"><tr><td>' + proptext[0] + '</td><td><input id="' + xlObj._id + '_fatname" class="ejinputtext" /></td></tr><tr class="e-dlgtd-fields"><td></td><td><input type="checkbox" id="' + xlObj._id + '_fatheader" style="background-color:#ffffff"/> <label for="' + xlObj._id + '_fatheader" class="e-ss-fathdr">' + proptext[1] + '</label></td></tr></table></div><div class="e-dlg-btnfields"><div class="e-dlg-btnctnr"><button id=' + xlObj._id + '_fatnamedlgok>' + xlObj._getLocStr('Ok') + '</button><button id=' + xlObj._id + '_fatnamedlgcancel>' + xlObj._getLocStr('Cancel') + '</button></div></div></div>'
            xlObj.element.append(htmlstr);
            $("#" + xlObj._id + "_fatheader").ejCheckBox();
            $('#' + xlObj._id + '_fatnamedlgok').ejButton(obj);
            $('#' + xlObj._id + '_fatnamedlgok').ejButton("option", "cssClass", "e-ss-okbtn");
            $('#' + xlObj._id + '_fatnamedlgcancel').ejButton(obj);
            $('#' + xlObj._id + '_fatnamedlg').ejDialog({ showOnInit: false, width: "auto", showRoundedCorner: true, title: xlObj._getLocStr('FormatAsTable'), enableModal: true, enableResize: false, cssClass: "e-ss-dialog e-" + xlObj._id + "-dlg", close: ej.proxy(this._dialogClose, this) });
        },

        _renderChartNameDlg: function () {
            var htmlstr, xlObj = this.XLObj, proptext = xlObj._getLocStr('ChartTitleDlgText'), obj = { showRoundedCorner: true, width: "23%", click: $.proxy(this._chartNameDlgBtnClick, this) };
            htmlstr = '<div id=' + xlObj._id + '_chartnamedlg ><div class="e-dlg-fields e-dlgctndiv"><table cellpadding="0" cellspacing="0"><tr><td>' + proptext + '</td><td><input id="' + xlObj._id + '_chartname" class="ejinputtext" /></td></tr></table></div><div class="e-dlg-btnfields"><div class="e-dlg-btnctnr"><button id=' + xlObj._id + '_chartnamedlgok >' + xlObj._getLocStr('Ok') + '</button><button id=' + xlObj._id + '_chartnamedlgcancel>' + xlObj._getLocStr('Cancel') + '</button></div></div>';
            xlObj.element.append(htmlstr);
            $('#' + xlObj._id + '_chartnamedlgok').ejButton(obj);
            $('#' + xlObj._id + '_chartnamedlgok').ejButton("option", "cssClass", "e-ss-okbtn");
            $('#' + xlObj._id + '_chartnamedlgcancel').ejButton(obj);
            $('#' + xlObj._id + '_chartnamedlg').ejDialog({ showOnInit: false, width: "334px", minHeight: "auto", showRoundedCorner: true, title: xlObj._getLocStr('ChartTitle'), enableModal: true, enableResize: false, cssClass: "e-ss-dialog e-" + xlObj._id + "-dlg", close: ej.proxy(this._dialogClose, this) });
        },

        _renderFATResizeTableDlg: function () {
            var xlObj = this.XLObj, obj = { showRoundedCorner: true, width: "15%", click: $.proxy(this._fatResizeTableBtnClick, this) },
                htmlstr = '<div id=' + xlObj._id + '_fatresizetabledlg ><div class="e-dlgctndiv"><table><tr><td>' + xlObj._getLocStr('FATResizeTableText') + '</td><td style="width: 50%;"><input id="' + xlObj._id + '_fatresizetablerange" class="ejinputtext" style="margin-left: 2px;"></td></tr></table><div class="e-dlg-fields">' + xlObj._getLocStr('FATReizeTableNote') + '</div></div><div class="e-dlg-btnfields"><div class="e-dlg-btnctnr"><button id=' + xlObj._id + '_fatresizetabledlgok >' + xlObj._getLocStr('Ok') + '</button><button id=' + xlObj._id + '_fatresizetabledlgcancel >' + xlObj._getLocStr('Cancel') + '</button></div></div></div>';
            xlObj.element.append(htmlstr);
            $('#' + xlObj._id + '_fatresizetabledlgok').ejButton(obj);
            $('#' + xlObj._id + '_fatresizetabledlgok').ejButton("option", "cssClass", "e-ss-okbtn");
            $('#' + xlObj._id + '_fatresizetabledlgcancel').ejButton(obj);
            $('#' + xlObj._id + '_fatresizetabledlg').ejDialog({ showOnInit: false, width: "494px", showRoundedCorner: true, title: xlObj._getLocStr('ResizeTable'), enableModal: true, enableResize: false, cssClass: "e-ss-dialog e-" + xlObj._id + "-dlg", close: ej.proxy(this._dialogClose, this) });
        },


        _fatResizeTableBtnClick: function (args) {
            var xlObj = this.XLObj, alertText, rrange = document.getElementById(xlObj._id + '_fatresizetablerange').value, dataSrcIdx, sheetIndex = xlObj.getActiveSheetIndex();
            var tid = document.getElementById(xlObj._id + '_tableid').value, tmgr = xlObj.getSheet(sheetIndex).tableManager, totRow, range,
                details = { sheetIndex: sheetIndex, reqType: "format-table", action: "Design_Tools_ResizeTable", tableId: tid }, canclose = true;
            if (args.model.text === xlObj._getLocStr('Ok')) {
                if (!xlObj._isvalidRange(rrange)) {
                    canclose = false;
                    xlObj._showAlertDlg("Alert", "InvalidReference", "", 375);
                }
                else {
                    details = this._resizeTable(rrange, tid, sheetIndex, details);
                    details.afterRange = xlObj.getRangeIndices(rrange);
                    details.format = tmgr[tid].format;
                    details.formatName = tmgr[tid].formatName;
                    details.header = $.extend(true, {}, xlObj.model.sheets[sheetIndex]._header);
                    details.isFilter = tmgr[tid].isFilter;
                    details.firstColumn = tmgr[tid].firstColumn;
                    details.lastColumn = tmgr[tid].lastColumn;
                    details.totalRow = tmgr[tid].totalRow;
                    xlObj.XLSelection.selectRange(tmgr[tid].range);
                    xlObj._completeAction(details);
                    xlObj._trigActionComplete(details);
                }
            }
            if (canclose)
                $('#' + xlObj._id + '_fatresizetabledlg').ejDialog('close');
        },

        _resizeTable: function (rrange, tid, sheetIndex, details) {
            var xlObj = this.XLObj, tmgr = xlObj.getSheet(sheetIndex).tableManager, details;
            details = details || { sheetIndex: sheetIndex, reqType: "format-table", action: "Design_Tools_ResizeTable", tableId: tid };
            rrange = rrange.indexOf(':') != -1 ? xlObj.getRangeIndices(rrange) : xlObj._getRangeArgs(rrange, "object");
            alertText = this._validateResizeRange(rrange, tmgr[tid].range);
            if (!alertText) {
                details.beforeRange = $.extend(true, [], tmgr[tid].range);
                if (tmgr[tid].totalRow) {
                    totRow = $("#" + xlObj._id + "_Ribbon_Design_TableStyleOptions_TotalRow").data("ejCheckBox");
                    xlObj._dupDetails = true;
                    totRow.option("checked", false);
                    tmgr[tid].range = [rrange[0], rrange[1], rrange[2] - 1, rrange[3]];
                }
                else
                    tmgr[tid].range = rrange;
                this._isFilterSelect.isFiltered && xlObj.XLFilter._clearFilterTable(sheetIndex, parseInt(tid), true);
                xlObj.XLFormat._isFAT = true;
                xlObj.XLFormat._createTable(tid, { format: tmgr[tid].format });
                xlObj.XLFormat._isFAT = false;
                xlObj.XLFilter._extendFilterRange(tid, tmgr[tid].range);
				xlObj.XLFormat._updateTableFormula("updateRange", tmgr[tid], sheetIndex);
                if (tmgr[tid].range[2] == rrange[2] - 1) {
                    xlObj._dupDetails = true;
                    totRow.option("checked", true);
                }
                if (tmgr[tid].firstColumn) {
                    xlObj._dupDetails = true;
                    range = xlObj._getProperAlphaRange(sheetIndex, tmgr[tid].range[0] + 1, tmgr[tid].range[1], tmgr[tid].range[2], tmgr[tid].range[1]);
                    xlObj.XLFormat.format({ style: { 'font-weight': 'bold' } }, range);
                    xlObj._dupDetails = false;
                }
                if (tmgr[tid].lastColumn) {
                    xlObj._dupDetails = true;
                    range = xlObj._getProperAlphaRange(sheetIndex, tmgr[tid].range[0] + 1, tmgr[tid].range[3], tmgr[tid].range[2], tmgr[tid].range[3]);
                    xlObj.XLFormat.format({ style: { 'font-weight': 'bold' } }, range);
                    xlObj._dupDetails = false;
                }
            }
            else
                xlObj._showAlertDlg("Alert", alertText, "", 500);
            xlObj.XLSelection.selectRange(tmgr[tid].range);
			return details;
        },
        _firstLastColumn: function (tid, sheetIdx) {
            var xlObj = this.XLObj, sheet = xlObj.getSheet(sheetIdx), column = "", tableObj, tmgr = sheet.tableManager, range;
            tableObj = xlObj._dataContainer.sheets[sheetIdx][tmgr[tid].range[0]][tmgr[tid].range[1]];
            if (tid in tmgr) {
                range = tmgr[tid].range;
                range = this._isFirstColumn ? xlObj._getProperAlphaRange(sheetIdx, range[0] + 1, range[1], range[2], range[1]) : xlObj._getProperAlphaRange(sheetIdx, range[0] + 1, range[3], range[2], range[3]);
                if (this._isFirstColumn) {
                    column = "firstColumn";
                    ej.isNullOrUndefined(tmgr[tid].firstColumn) ? tmgr[tid][column] = true : delete tmgr[tid]["firstColumn"];
                    ej.isNullOrUndefined(tableObj.firstColumn) ? tableObj["firstColumn"] = true : tableObj["firstColumn"] = false;
                }
                else {
                    column = "lastColumn";
                    ej.isNullOrUndefined(tmgr[tid].lastColumn) ? tmgr[tid][column] = true : delete tmgr[tid]["lastColumn"];
                    ej.isNullOrUndefined(tableObj.lastColumn) ? tableObj["lastColumn"] = true : tableObj["lastColumn"] = false;
                }
                xlObj._dupDetails = true;
                xlObj.XLFormat.format({ style: { 'font-weight': tmgr[tid][column] ? 'bold' : 'normal' } }, range);
                xlObj._dupDetails = false;
            }
        },
        _totalRow: function (tid, sheetIdx) {
            var xlObj = this.XLObj, sheet = xlObj.getSheet(sheetIdx), tmgr = sheet.tableManager;
            ej.isNullOrUndefined(tmgr[tid].totalRow) ? xlObj.XLFormat._calculateTotalRow(sheetIdx, tid, true, true) : xlObj.XLFormat._calculateTotalRow(sheetIdx, tid, false, false);
        },
        _fatNameDlgBtnClick: function (args) {
            var obj, xlObj = this.XLObj, sid = xlObj._id, rowIdx, colIdx, arrayFormula;
            $('#' + sid + '_fatnamedlg').ejDialog('close');
            if (args.model.text === xlObj._getLocStr('Ok')) {
                rowIdx = xlObj._getSelectedCells().selCells[0].rowIndex;
                colIdx = xlObj._getSelectedCells().selCells[0].colIndex;
                arrayFormula = xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "hasFormulaArray", xlObj.getActiveSheetIndex());
                if (arrayFormula)
                    xlObj._showAlertDlg("Alert", "ArrayaFormulaTableAlert", 430);
                else {
                    obj = { header: $("#" + sid + "_fatheader").ejCheckBox("checked"), name: document.getElementById(sid + '_fatname').value, format: xlObj.XLFormat._formatAsTableStyle.format };
                if (xlObj.XLFormat._formatAsTableStyle.formatName)
                    obj["formatName"] = xlObj.XLFormat._formatAsTableStyle.formatName;
                xlObj.XLFormat.createTable(obj);
                }
            }
        },

        _validateResizeRange: function (rrange, trange) {
            var xlObj = this.XLObj;
            if (rrange.length) {
                if (rrange[0] != trange[0] || rrange[1] != trange[1])
                    return "ResizeAlert";
                else if (rrange[3] != trange[3] || rrange[2] < trange[2])
                    return "ResizeRestrictAlert";
                else if (rrange[2] > xlObj.getSheet(xlObj.getActiveSheetIndex()).rowCount)
                    return "RangeNotCreated"
            }
            else
                return "InvalidReference";
        },

        _chartNameDlgBtnClick: function (args, title, action) {
            var cObj, details, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), dataVal = xlObj.getSheet(sheetIdx).shapeMngr.chart[xlObj.XLEdit.getPropertyValue(xlObj.XLShape._picCellIdx.rowIndex, xlObj.XLShape._picCellIdx.colIndex, 'chart')[0]], cname, sid = xlObj._id, cid = document.getElementById(sid + '_chart').value;
            cObj = $("#" + cid).data("ejChart");
            details = { sheetIndex: sheetIdx, reqType: "shape", shapeType: "chart", cid: cid, rowIndex: xlObj.XLShape._picCellIdx.rowIndex, colIndex: xlObj.XLShape._picCellIdx.colIndex, prev: {}, cur: {} };
            cname = title || document.getElementById(sid + '_chartname').value;
            if (args.model.text === xlObj._getLocStr('Ok')) {
                if (!cname.length) {
                    xlObj._showAlertDlg("Alert", "InvalidTitle", "InvalidChartTitleActn", 375);
                    return;
                }
                switch (xlObj._hasTitle) {
                    case "PX":
                        cObj.option("primaryXAxis", { title: { text: cname } });
                        dataVal.xAxis.title.text = cname;
                        details.action = "PX";
                        details.operation = action ? action : "PHAxisTitle";
                        break;
                    case "PY":
                        cObj.option("primaryYAxis", { title: { text: cname } });
                        dataVal.yAxis.title.text = cname;
                        details.action = "PY";
                        details.operation = action ? action : "PVAxisTitle";
                        break;
                    case "CT":
                        cObj.option("title", { text: cname });
                        dataVal.title.text = cname;
                        details.action = details.operation = "CT";
                        break;
                }
            }
            details.prev.text = xlObj._cOpt.prevText;
            if (xlObj._hasTitle == "CT") {
                details.prev.align = xlObj._cOpt.prevAlign;
                details.cur.align = xlObj._cOpt.curAlign;
            }
            details.cur.text = cname;
            xlObj._completeAction(details);
            xlObj._trigActionComplete(details);
            xlObj._cOpt = {};
            document.getElementById(sid + '_chartname').value = "";
            $('#' + sid + '_chartnamedlg').ejDialog('close');
        },

        _designTabUpdate: function (tid, cellIdx) {
            var xlObj = this.XLObj;
             if (xlObj.model.showRibbon)  {
                var xlId = xlObj._id, btnObj, robj = $('#' + xlObj._id + '_Ribbon').ejRibbon('instance'), tmgr = xlObj.getSheet(xlObj.getActiveSheetIndex()).tableManager;
                robj.showTab(xlObj._getLocStr('Design'));
                if (this._isDesignTab && !robj._isCollapsed)
                    robj.option({ selectedItemIndex: this._getTabIndex("design") });
                document.getElementById(xlObj._id + '_Ribbon_Design_Properties_TableName') && (document.getElementById(xlObj._id + '_Ribbon_Design_Properties_TableName').value = tmgr[tid].name);
                document.getElementById(xlObj._id + '_tableid') && (document.getElementById(xlObj._id + '_tableid').value = tid);
                this._isSetModel = true;
                $("#" + xlId + "_Ribbon_Design_TableStyleOptions_TotalRow").data("ejCheckBox").option({ checked: (tmgr[tid]["totalRow"] ? true : false) });
                $("#" + xlId + "_Ribbon_Design_TableStyleOptions_FirstColumn").data("ejCheckBox").option({ checked: (tmgr[tid]["firstColumn"] ? true : false) });
                $("#" + xlId + "_Ribbon_Design_TableStyleOptions_LastColumn").data("ejCheckBox").option({ checked: (tmgr[tid]["lastColumn"] ? true : false) });
                $("#" + xlId + "_Ribbon_Design_TableStyleOptions_FilterColumn").data("ejCheckBox").option({ enabled: xlObj.model.allowFiltering ? true : false });
                $("#" + xlId + "_Ribbon_Design_TableStyleOptions_FilterColumn").data("ejCheckBox").option({ checked: (tmgr[tid]["isFilter"] ? true : false) });
                this._isSetModel = false;
                btnObj = $("#" + xlObj._id + "_Ribbon_Data_SortFilter_ClearFilter").data("ejButton");
                if (btnObj)
                    this._changeClrFltrStatus(btnObj, "button", cellIdx);
            }
        },

        _formatTabUpdate: function () {
            var xlObj = this.XLObj;
               if (xlObj.model.showRibbon) {
                var robj = $("#" + xlObj._id + "_Ribbon").ejRibbon("instance"), heightElem = xlObj.element.find("#" + xlObj._id + "_Ribbon_Format_Size_PictureHeight"), widthElem = xlObj.element.find("#" + xlObj._id + "_Ribbon_Format_Size_PictureWidth");
                robj.showTab(xlObj._getLocStr("FORMAT"));
                xlObj._shapeChange = true;
                heightElem.length && heightElem.ejNumericTextbox("option", "value", xlObj.element.find(".e-ss-activeimg").height());
                widthElem && widthElem.ejNumericTextbox("option", "value", xlObj.element.find(".e-ss-activeimg").width());
                if (xlObj.model.showRibbon && !robj._isCollapsed)
                    robj.option({ selectedItemIndex: xlObj.XLRibbon._getTabIndex("format") });
                xlObj._shapeChange = false;
            }
        },

        _analyzeTabUpdate: function () {
            var xlObj = this.XLObj, elem, ribObj;
            if (!xlObj.model.enablePivotTable)
                return false;
            elem = xlObj.element.find("#" + xlObj._id + "_Ribbon_Analyze_PivotTable_PivotTableName");
            ribObj = $("#" + xlObj._id + "_Ribbon").data("ejRibbon");
            elem.length && elem.val(xlObj.XLPivot.names[xlObj._getContent(xlObj.getActiveSheetIndex()).find(".e-ss-activepivot")[0].id]);
            ribObj.showTab(xlObj._getLocStr("ANALYZE"));
            if (!ribObj._isCollapsed)
                ribObj.option({ selectedItemIndex: xlObj.XLRibbon._getTabIndex("analyze") });
        },

        _chartDesignTabUpdate: function (chartElem) {
            var xlObj = this.XLObj, dataVal, index, state;
            if (xlObj.model.showRibbon) {
                var robj = $('#' + xlObj._id + '_Ribbon').data('ejRibbon'), cid = chartElem.get(0).id, left = chartElem.get(0).offsetLeft, top = chartElem.get(0).offsetTop, cModel = chartElem.ejChart("model"), themesElem = robj.element.find("#" + xlObj._id + "_Ribbon_ChartDesign_ChartThemes_ChartThemes");
                index = xlObj._getIdxWithOffset(top, left, true);
                xlObj.XLShape._picCellIdx = { rowIndex: index.rowIdx, colIndex: index.colIdx };
                robj.showTab(xlObj._getLocStr("CHARTDESIGN"));
                dataVal = xlObj.XLChart._getShapeObj(cid, "chart");
                state = dataVal.isChartSeries ? "disable" : "enable";
                $("#" + xlObj._id + "_Ribbon_ChartDesign_Data_SelectData").ejButton(state);
                $("#" + xlObj._id + "_Ribbon_ChartDesign_Data_SwitchRowColumn").ejButton(state);
                if (!robj._isCollapsed)
                    robj.option({ selectedItemIndex: xlObj.XLRibbon._getTabIndex("chartdesign") });
                document.getElementById(xlObj._id + '_chart').value = cid;
                this._isSetModel = true;
                this._setShapeWidthHeight({ height: cModel.size.height, width: cModel.size.width, shapeType: "chart" });
                themesElem.length && themesElem.ejDropDownList("setSelectedValue", chartElem.ejChart("option", "theme"));
                this._isSetModel = false;
                if (xlObj.model.allowFormulaBar)
                    xlObj.updateFormulaBar();
            }
        },

        _setShapeWidthHeight: function (options) {
            var xlObj = this.XLObj, wNum, hNum;
            if (options.shapeType == "chart") {
                wNum = $("#" + xlObj._id + "_Ribbon_ChartDesign_Size_ChartWidth").data("ejNumericTextbox");
                hNum = $("#" + xlObj._id + "_Ribbon_ChartDesign_Size_ChartHeight").data("ejNumericTextbox");
            }
            else {
                wNum = $("#" + xlObj._id + "_Ribbon_Format_Size_PictureWidth").data("ejNumericTextbox");
                hNum = $("#" + xlObj._id + "_Ribbon_Format_Size_PictureHeight").data("ejNumericTextbox");
            }
            xlObj._shapeChange = true;
            if (xlObj.model.showRibbon) {
                hNum.option({ value: options.height });
                wNum.option({ value: options.width });
            }
            xlObj._shapeChange = false;
        },

        changeDimension: function (options) {
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), actImg, elem, opt, details, chartEle, picElem, details = { sheetIndex: sheetIdx, reqType: "shape", rowIndex: xlObj.XLShape._picCellIdx.rowIndex, colIndex: xlObj.XLShape._picCellIdx.colIndex, actionType: "shapechange" }, cObj;
            if (options.shapeType == "picture") {
                actImg = xlObj.getSheetElement(sheetIdx).find('.e-ss-activeimg');
                picElem = actImg.length ? actImg[0] : $('#' + options.id);
                details.prev = { width: picElem.width(), height: picElem.height() }
                elem = $("#" + options.id); opt = { width: options.width, height: options.height };
                elem.css(opt);
                details.action = "picturesize";
                details.shapeType = "picture";
                details.cur = { width: picElem.width(), height: picElem.height() };
            }
            else {
                cObj = $("#" + options.id).data('ejChart');
                details.prev = { width: cObj.model.size.width, height: cObj.model.size.height };
                opt = { width: options.width.toString(), height: options.height.toString() };
                chartEle = cObj.element;
                cObj.option("size", opt);
                chartEle[0].style.height = options.height + "px";
                chartEle[0].style.width = options.width + "px";
                details.action = "width";
                details.shapeType = "chart";
                details.cid = options.id;
                details.cur = { width: cObj.model.size.width, height: cObj.model.size.height };
            }
            xlObj._completeAction(details);
            xlObj._trigActionComplete(details);
            this._setShapeWidthHeight(options);
        },

        _toggleDesignTab: function (cellObj) {
            var xlObj = this.XLObj, btnObj, rObj, sheetIdx = xlObj.getActiveSheetIndex();
            if (xlObj.model.showRibbon) {
                rObj = $('#' + xlObj._id + '_Ribbon').data("ejRibbon");
                if (ej.isNullOrUndefined(xlObj.XLEdit.getPropertyValue(cellObj.rowIndex, cellObj.colIndex, "tableName")) || xlObj.getSheetElement(sheetIdx).find(".e-ss-activeimg").length) {
                    rObj.hideTab(xlObj._getLocStr('Design'));
                    if (!rObj._isCollapsed)
                        rObj.option({ selectedItemIndex: 1 });
                }
            }
            btnObj = $("#" + xlObj._id + "_Ribbon_Data_SortFilter_ClearFilter").data("ejButton");
            this._changeClrFltrStatus(btnObj, "button", cellObj);
        },

        _toggleChartDesignTab: function () {
            this._toggleContextualTab(this.XLObj._getLocStr("CHARTDESIGN"));
        },

        _toggleFormatTab: function () {
            this._toggleContextualTab(this.XLObj._getLocStr("FORMAT"));
        },

        _toggleAnalyzeTab: function () {
            this._toggleContextualTab(this.XLObj._getLocStr("ANALYZE"));
        },

        _toggleContextualTab: function (tabName) {
            var xlObj = this.XLObj;
            if (xlObj.model.showRibbon) {
                var rObj = $('#' + xlObj._id + '_Ribbon').data("ejRibbon");
                rObj.hideTab(tabName);
                if (!rObj._isCollapsed)
                    rObj.option({ selectedItemIndex: 1 });
            }
        },

        _getTabIndex: function (name) {
            if (!this.XLObj.model.showRibbon)
                return;
            var model = $('#' + this.XLObj._id + '_Ribbon').ejRibbon("model"), tabs = model.tabs, ctabs = model.contextualTabs, i = 0;
            while (i < ctabs.length) {
                tabs = tabs.concat(ctabs[i].tabs);
                i++;
            }
            i = tabs.length;
            while (i--)
                if (tabs[i].id === name) return ++i;
        },

        _getFormatAsTableInput: function (str) {
            var xlObj = this.XLObj, str1, str2, istr, cstr, i = 0, j = 0, arr = [], abbr = { hl: 'headerLayout', cl: 'contentLayout', hb: 'headerBorder', cb: 'contentBorder' }, obj = {};
            str = str.split('&'); // for layout input
            while (i < str.length) {
                istr = str[i].split('?'); // to separate headerlayout: '' like that
                str1 = istr[0], str2 = istr[1];
                if (str1 === 'hl')
                    obj[abbr[str1]] = xlObj._getStyleAsJSON(str2, true);
                else if (str1 === 'cl') {
                    cstr = str2.split(','); // for multiple content layout
                    while (j < cstr.length) {
                        arr.push(cstr[j].length ? xlObj._getStyleAsJSON(cstr[j], true) : {});
                        j++;
                    }
                    obj[abbr[str1]] = arr;
                }
                else if (str1 === 'cb') {
                    cstr = str2.split('-'); // for border
                    obj[abbr[str1]] = { border: this._getBorderObj(cstr[0], cstr[1]) };
                }
                i++;
            }
            return obj;
        },

        _getBorderObj: function (prop, value) {
            var i, border = { t: { top: '' }, r: { right: '' }, b: { bottom: '' }, l: { left: '' }, o: { top: '', right: '', bottom: '', left: '' }, tb: { top: '', bottom: '' }, gb: { top: '', right: '', bottom: '', left: '' } };
            for (i in border[prop])
                border[prop][i] = value;
            if (prop === 'gb')
                border[prop]["isGridBorder"] = true;
            return border[prop];
        },

        // Cell Style Feature
        _renderCellStyles: function () {
            var indx, txt, cnt = 1, count = 1, i = 0, index = 4, cdiv = [], cls = 'e-cellstylecell ', str = '', xlObj = this.XLObj, fcoll = xlObj._dataContainer.hashCode,
                cstylehdrtext = xlObj._getLocStr('CellStyleHeaderText').split('/'), gbntext = xlObj._getLocStr('CellStyleGBN').split('/'),
                gbnformat = [fcoll[0], fcoll[1], fcoll[2], fcoll[3]], thtext = xlObj._getLocStr('CellStyleTH').split('/'), thformat = fcoll.slice(4, 6), tcsformat = fcoll.slice(6, 18);
            while (i < index) {
                txt = gbntext[i];
                str = str + xlObj._renderDIV(cls + gbnformat[i], txt, txt);
                i++;
            }
            cdiv.push(str), str = '', i = 0, index = 2;
            while (i < index) {
                txt = thtext[i];
                if (i === 1)
                    str = str + '<div class="' + cls + thformat[i] + '"  style="font-size: 11pt;" title="' + txt + '">' + txt + '</div>';
                else
                    str = str + xlObj._renderDIV(cls + thformat[i], txt, txt);
                i++;
            }
            cdiv.push(str), str = '', i = 0, index = 12;
            while (i < index) {
                if (i >= 0 && i < 4)
                    txt = "20% - " + xlObj._getLocStr('Accent') + (i + 1);
                else if (i >= 4 && i < 8) {
                    txt = "60% - " + xlObj._getLocStr('Accent') + cnt;
                    cnt++;
                }
                else {
                    txt = xlObj._getLocStr('Accent') + count;
                    count++;
                }
                str = str + xlObj._renderDIV(cls + tcsformat[i], txt, txt);
                i++;
            }
            cdiv.push(str), str = '', i = 0;
            while (i < cstylehdrtext.length * 2) {
                indx = i % 2;
                str = str + xlObj._renderDIV(indx === 0 ? 'e-cellstyleheader' : 'e-cellstylecontent', indx === 0 ? cstylehdrtext[i / 2] : cdiv[0]);
                if (indx != 0)
                    cdiv.shift();
                i++;
            }
            var parent = $('<div id=' + xlObj._id + '_cellstyles class="e-spreadsheet e-cellstyles" style="display:none;">' + str + '</div>');
            parent.find(".e-cellstyleheader:eq(0)").append("<span id ='" + xlObj._id + "_cellstyles_back' class = 'e-cellstyles-back e-icon e-ss-leftarrow'/>");
            parent.append(ej.buildTag("div.e-cellstyleheader"), ej.buildTag("div.e-cellstylecell e-format6N6N2N111N1N1N1N1N", xlObj._getLocStr('NewCellStyle'), "", { title: xlObj._getLocStr('NewCellStyle') }));
            return parent;
        },

        _homeTabTrgtElem: function () {
            var xlObj = this.XLObj, xlId = xlObj._id, xlEle = xlObj.element, rbnId = xlId + "_Ribbon_", fontElem = rbnId + "Home_Font_";
            xlEle.append(ej.buildTag("input", "", { display: "none" }, { id: fontElem + "FillColor", type: "text" }));
            xlEle.append(ej.buildTag("input", "", { display: "none" }, { id: fontElem + "FontColor", type: "text" }));
            xlEle.append(ej.buildTag("input", "", { display: "none" }, { id: fontElem + "BorderColor", type: "text" }));
            xlEle.append(ej.buildTag("div.e-spreadsheet e-formatastable", "", { display: "none" }, { id: xlObj._id + "_formatastable" }));
            xlEle.append(this._renderCellStyles());
            xlEle.append(ej.buildTag("ul", "", { display: "none" }, { id: xlId + "_Ribbon_Merge" }));
            xlEle.append(ej.buildTag("ul", "", { width: "auto", display: "none" }, { id: rbnId + "Paste" }));
            xlEle.append(ej.buildTag("ul", "", { width: "auto", display: "none" }, { id: rbnId + "Border" }));
            xlEle.append(ej.buildTag("ul.e-spreadsheet", "", { display: "none" }, { id: xlId + "_CFormat" }));
            xlEle.append(ej.buildTag("ul", "", { display: "none" }, { id: rbnId + "Clear" }));
            xlEle.append(ej.buildTag("ul", "", { display: "none" }, { id: rbnId + "SortFilter" }));
            xlEle.append(ej.buildTag("ul", "", { display: "none" }, { id: rbnId + "AutoSum" }));
        },
        _pageTabTrgtElem: function (ribbonElem) {
            var xlObj = this.XLObj, xlId = xlObj._id, xlEle = xlObj.element, pagesetupdiv, pagesetupleftdiv, table, td1, td2, td11, td, tr, tr1, td12, gdlnviewlbl, hdrviewlbl, headerVchk, gridVchk, rbnId = xlId + "_Ribbon_", pageId = rbnId + "PageLayout_Show_";
            ribbonElem = xlObj.isUndefined(ribbonElem) ? $("#" + xlId + "_Ribbon").data("ejRibbon").element : ribbonElem;
            xlEle.append(ej.buildTag("ul", "", { display: "none" }, { id: rbnId + "PageSize" }));
            pagesetupdiv = ej.buildTag("div", "", { width: "140", height: "80", display: "none" }, { id: rbnId + "pagesetup" });
            pagesetupleftdiv = ej.buildTag("div", "", { width: "70", height: "80", "float": "left" }, { id: rbnId + "pagesetupleft" });
            table = ej.buildTag("table"); tr = ej.buildTag("tr"); tr1 = ej.buildTag("tr"); td1 = ej.buildTag("td", "", { padding: "6px 0px 6px 6px" }); td2 = ej.buildTag("td", "", { padding: "6px 0px 6px 6px" }); td11 = ej.buildTag("td", "", { padding: "6px 0px 6px 6px" }); td12 = ej.buildTag("td", "", { padding: "6px 0px 6px 6px" });
            gdlnviewlbl = ej.buildTag("label.e-viewlinlbl", "", { width: "40" }, { id: rbnId + "pagesetup_viewgrdlnlbl", "for": pageId + "Gridlines" });
            hdrviewlbl = ej.buildTag("label.e-viewhdrlbl", "", { width: "40", display: "visible" }, { id: rbnId + "pagesetup_viewhdrlbl", "for": pageId + "Headings" });
            headerVchk = ej.buildTag("input", "", "", { id: pageId + "Headings", type: "checkbox" });
            gridVchk = ej.buildTag("input", "", "", { id: pageId + "Gridlines", type: "checkbox" });
            td1.append(gridVchk);
            td2.append(gdlnviewlbl);
            tr.append(td1).append(td2);
            td11.append(headerVchk);
            td12.append(hdrviewlbl);
            tr1.append(td11).append(td12);
            table.append(tr1).append(tr);
            pagesetupleftdiv.append(table);
            pagesetupdiv.append(pagesetupleftdiv);
            ribbonElem.append(pagesetupdiv);
        },
        _othersTabTrgtElem: function () {
            var xlObj = this.XLObj, xlId = xlObj._id, xlEle = xlObj.element, rbnId = xlId + "_Ribbon_";
            xlEle.append(ej.buildTag("ul", "", { width: "auto", display: "none" }, { id: rbnId + "FPane" }));
            xlEle.append(ej.buildTag("ul", "", { width: "auto" }, { id: rbnId + "Ins" }));
            xlEle.append(ej.buildTag("ul", "", { width: "auto" }, { id: rbnId + "Del" }));
            xlEle.append(ej.buildTag("ul", "", { width: "auto", display: "none" }, { id: rbnId + "FindRep" }));
            xlEle.append(ej.buildTag("ul", "", { display: "none" }, { id: rbnId + "CalcOpt" }));
        },
        _dataTabTrgtElem: function () {
            var xlObj = this.XLObj;
            xlObj.element.append(ej.buildTag("ul", "", { width: "auto", display: "none" }, { id: xlObj._id + "_Ribbon_Validation" }));
        },
        _formatTabTrgtElem: function () {
            var xlObj = this.XLObj;
            xlObj.element.append(ej.buildTag("ul", "", { width: "auto", display: "none" }, { id: xlObj._id + "_Ribbon_ResetPic" }));
        },

        _onBeforeTabClick: function (args) {
            this.XLObj.model.ribbonSettings.enableOnDemand && this._createTrgtElement(args.activeHeader.innerText);
        },

        _onTabClick: function (args) {
            var xlObj = this.XLObj, settings = $.extend(true, {}, xlObj.model.scrollSettings), tabName = args.activeHeader.innerText;
            xlObj._trigger("beforeTabClick", args);
            args.prevActiveIndex !== -1 && xlObj.model.allowComments && xlObj.model.allowEditing && (xlObj.XLEdit._isEdit || xlObj.XLComment._isCommentEdit || xlObj._isSheetRename || !xlObj.getSheet(xlObj.getActiveSheetIndex()).isSheetProtected) && !this._isDirtySelect && this._enableRibbonIcons(args.activeIndex);
            xlObj.model.ribbonSettings.enableOnDemand && this._createTabControls(tabName);
            xlObj._trigger("tabClick", args);
        },

        _onCollapse: function (args, e) {
            var xlObj = this.XLObj, settings = $.extend(true, {}, xlObj.model.scrollSettings);
            xlObj.getSheet(xlObj.getActiveSheetIndex())._isRibCollapsed = true;
            if (this._ribbonState || args.isMobile) {
                !xlObj._phoneMode && (this._ribbonState = false);
                args.action = "toggleBtn";
                if (xlObj._isAutoWHMode) {
                    this._refreshBackstageHeight();
                    var dimension = xlObj._getElementDimension();
                    xlObj.element.css({ height: dimension.height, width: dimension.width });
                }
                else
                    xlObj._heightWidthCalculation(xlObj.getActiveSheetIndex(), settings, args);
                xlObj.model._isActPanelVisible && xlObj._refreshActivationPanel();
            }
        },

        _onTabSelect: function (args) {
            var xlObj = this.XLObj, sheet = xlObj.getSheet(xlObj.getActiveSheetIndex());
            if (xlObj.model.showRibbon) {
                if (xlObj.XLEdit._isEdit || (xlObj.model.allowComments && xlObj.XLComment._isCommentEdit) || xlObj._isSheetRename || sheet.isSheetProtected)
                    this._disableRibbonIcons();
                else
                    this._enableRibbonIcons();
                this._updateRibbonIcons();
                if (xlObj.model.isReadOnly)
                    xlObj._readOnly();
                if (xlObj._phoneMode) {
                    var settings = $.extend(true, {}, xlObj.model.scrollSettings);
                    this._ribbonState = true;
                    args.action = "toggleBtn";
                    xlObj.model._isActPanelVisible = this._isPanelVisible;
                    if (xlObj._isAutoWHMode) {
                        this._refreshBackstageHeight();
                        var dimension = xlObj._getElementDimension();
                        xlObj.element.css({ height: dimension.height, width: dimension.width });
                    }
                    else
                        xlObj._heightWidthCalculation(xlObj.getActiveSheetIndex(), settings, args);
                }
            }
            if (xlObj.XLEdit.getPropertyValue(sheet._activeCell.rowIndex, sheet._activeCell.colIndex, "tableName"))
                this._isDesignTab = (args.activeIndex == this._getTabIndex("design") || args.activeIndex == this._getTabIndex("format") || args.activeIndex == this._getTabIndex("chartdesign"));
            xlObj._trigger("tabSelect", args);
        },

        _valDTypeOnChange: function (args) {
            var xlObj = this.XLObj;
            if ($.validator)
                $("#" + xlObj._id + "_Form_ValDialog").validate().resetForm();
            if (args.value === "Between" || args.value === "NotBetween") {
                $("#" + xlObj._id + "_Ribbon_lbMax").show();
                $("#" + xlObj._id + "_Ribbon_btnMax").show();
                $("#" + xlObj._id + "_Ribbon_lbMin").text(xlObj._getLocStr("NumberStart"));
            }
            else {
                $("#" + xlObj._id + "_Ribbon_lbMax").hide();
                $("#" + xlObj._id + "_Ribbon_btnMax").hide();
                $("#" + xlObj._id + "_Ribbon_lbMin").text(xlObj._getLocStr("DataValue"));
            }
            this._dialogValidate("_ValDialog");
        },

        _valTypeOnChange: function (args) {
            var xlObj = this.XLObj, actionObj = $("#" + xlObj._id + "_Ribbon_ddAction").data("ejDropDownList");
            actionObj.enable();
            if (args.model.dataSource[args.model.selectedItemIndex].value === "list") {
                $("#" + xlObj._id + "_Ribbon_lbMax").hide();
                $("#" + xlObj._id + "_Ribbon_btnMax").hide();
                actionObj.disable();
            }
            else if (actionObj._selectedValue === "Between" || actionObj._selectedValue === "NotBetween") {
                $("#" + xlObj._id + "_Ribbon_lbMax").show();
                $("#" + xlObj._id + "_Ribbon_btnMax").show();
            }
            $("#" + xlObj._id + "_Ribbon_lbMin").text(xlObj._getLocStr(args.selectedText + "Start"));
            $("#" + xlObj._id + "_Ribbon_lbMax").text(xlObj._getLocStr(args.selectedText + "End"));
            this._dialogValidate("_ValDialog");
        },

        _valDlgBtnClick: function (id, args) {
            var xlObj = this.XLObj, alertdlg, sheetIdx;
            if (id === "ok" && $.validator && $("#" + xlObj._id + "_Form_ValDialog").valid()) {
                var cbObj = $("#" + xlObj._id + "_Ribbon_blank").data("ejCheckBox");
                var showErrorAlert = $("#" + xlObj._id + "_Ribbon_freetext").data("ejCheckBox").isChecked();
                var typeObj = $("#" + xlObj._id + "_Ribbon_ddType").data("ejDropDownList");
                var actionObj = $("#" + xlObj._id + "_Ribbon_ddAction").data("ejDropDownList"), calcNamedRanges = xlObj.getCalcEngine().getNamedRanges(), isNamedRange;
                if (typeObj._selectedValue === "List") {
                    var value = $("#" + xlObj._id + "_Ribbon_btnMin").val(), val = value, splitStr, range, alertdlg = $("#" + xlObj._id + "_alertdlg"), getSheet;
                    if (value.indexOf("=") > -1) {
                        value = value.split("=")[1];
                        isNamedRange = calcNamedRanges.getItem(value.toUpperCase());
                        if (isNamedRange)
                            value = isNamedRange;
                        if (value.indexOf("!") > -1) {
                            splitStr = value.split("!");
                            sheetIdx = isNamedRange ? xlObj._getSheetIdxFromSheetValue(splitStr[0]) : xlObj._getSheetIndexByName(splitStr[0]);
                            value = splitStr[1];
                        }
                        if (sheetIdx === false) {
                            xlObj._renderAlertDlgContent(alertdlg, "Alert", xlObj._getLocStr("ListAlert"), "ListValidation");
                            xlObj._alertDialog.element.ejDialog("open") && alertdlg.focus();
                            return;
                        }
                        value.indexOf("$") > -1 && (value = value.split("$").join(""));
                        value.indexOf(":") < 0 && (value = value + ":" + value);
                        sheetIdx = xlObj.isUndefined(sheetIdx) ? xlObj.getActiveSheetIndex() : sheetIdx;
                        getSheet = xlObj.getSheet(sheetIdx);
                        range = xlObj.getRangeIndices(value);
                        if (isNaN(range[0]) || isNaN(range[1]) || isNaN(range[2]) || isNaN(range[3]) || getSheet.colCount <= range[3] || getSheet.rowCount <= range[2]) {
                            xlObj._renderAlertDlgContent(alertdlg, "Alert", xlObj._getLocStr("ListAlert"), "ListValidation");
                            xlObj._alertDialog.element.ejDialog("open") && alertdlg.focus();
                            return;
                        }
                        if (range[2] === range[0] || range[3] === range[1]) {
                            xlObj.XLValidate.applyDVRules(null, ["list", val], this._types[typeObj.selectedIndexValue].value, cbObj.isChecked(), showErrorAlert);
                        }
                        else {
                            xlObj._renderAlertDlgContent(alertdlg, "Alert", xlObj._getLocStr("ListValAlert"), "ListValidation");
                            xlObj._alertDialog.element.ejDialog("open") && alertdlg.focus();
                            return;
                        }
                    }
                    else
                        xlObj.XLValidate.applyDVRules(null, ["list", val], this._types[typeObj.selectedIndexValue].value, cbObj.isChecked(), showErrorAlert);
                }
                else
                    xlObj.XLValidate.applyDVRules(null, [this._actions[actionObj.selectedIndexValue].value, $("#" + xlObj._id + "_Ribbon_btnMin").val(), $("#" + xlObj._id + "_Ribbon_btnMax").val()], this._types[typeObj.selectedIndexValue].value, cbObj.isChecked(), showErrorAlert);
                xlObj._setddlCell();
            }
            else if (!$.validator)
                id = "cancel";
            if (id === "cancel" || (id === "ok" && $.validator && $("#" + xlObj._id + "_Form_ValDialog").valid())) {
                $("#" + xlObj._id + "_Ribbon_ddType").data("ejDropDownList").option({ selectedItemIndex: 0 });
                $("#" + xlObj._id + "_Ribbon_ddAction").data("ejDropDownList").option({ selectedItemIndex: 6 });
                $("#" + xlObj._id + "_Ribbon_blank").data("ejCheckBox").option({ checked: true });
                $("#" + xlObj._id + "_Ribbon_freetext").data("ejCheckBox").option({ checked: true });
                $("#" + xlObj._id + "_Ribbon_btnMin").val("");
                $("#" + xlObj._id + "_Ribbon_btnMax").val("");
                $("#" + xlObj._id + "_ValDialog").ejDialog("close");
                xlObj._setSheetFocus();
            }
        },

        _renderValDialog: function () {
            var xlObj = this.XLObj;
            if ($("#" + xlObj._id + "_Ribbon_MainDiv").length < 1) {
                var $stgctnr = ej.buildTag("div.e-dlgctndiv", "", {}, { height: "100%" }), $mainDiv = ej.buildTag("div.e-dlg-fields", "", {}, { id: xlObj._id + "_Ribbon_MainDiv" }), $subDiv;
                $("#" + xlObj._id + "_Validation").append($stgctnr);
                $("#" + xlObj._id + "_Validation").append($mainDiv);
                var $label = ej.buildTag("label.e-dlg-fields", xlObj._getLocStr("Allow"));
                $mainDiv.append($label);
                var $ddType = ej.buildTag("input.e-" + xlObj._id + "-ddl", "", "", { id: xlObj._id + "_Ribbon_ddType", type: "text" });
                $mainDiv.append($ddType);
                $ddType.ejDropDownList({
                    dataSource: this._types,
                    fields: { id: "Types", text: "text", value: "text" }, selectedItemIndex: 1,
                    cssClass: "e-" + xlObj._id + "-ddl",
                    width: "100%",
                    change: $.proxy(this._valTypeOnChange, this)
                });
                var $chkinput = ej.buildTag("input#" + xlObj._id + "_Ribbon_blank");
                var $chklabel = ej.buildTag("label", xlObj._getLocStr("IgnoreBlank"), {}, { "for": xlObj._id + "_Ribbon_blank" });
                var table = ej.buildTag("table");
                var tr = ej.buildTag("tr");
                var td = ej.buildTag("td", "", {}, { width: 30 });
                td.append($chkinput);
                tr.append(td);
                td = ej.buildTag("td");
                td.append($chklabel);
                tr.append(td);
                table.append(tr);
                $chkinput.ejCheckBox();
                $chkinput = ej.buildTag("input#" + xlObj._id + "_Ribbon_freetext");
                $chklabel = ej.buildTag("label#" + xlObj._id + "_Ribbon_lblfreetext", xlObj._getLocStr("FreeText"), {}, { "for": xlObj._id + "_Ribbon_lblfreetext" });
                var tr = ej.buildTag("tr#" + xlObj._id + "_val_freetext");
                td = ej.buildTag("td", "", {}, { width: 30 });
                td.append($chkinput);
                tr.append(td);
                td = ej.buildTag("td");
                td.append($chklabel);
                tr.append(td);
                table.append(tr);
                $mainDiv.append(table);
                $chkinput.ejCheckBox({ checked: true });
                $label = ej.buildTag("label.e-dlg-fields").text(xlObj._getLocStr("Data"));
                $mainDiv.append($label);
                var $ddAction = ej.buildTag("input.e-" + xlObj._id + "-ddl", "", "", { id: xlObj._id + "_Ribbon_ddAction", type: "text" });
                $mainDiv.append($ddAction);
                $ddAction.ejDropDownList({
                    dataSource: this._actions,
                    fields: { id: "Types", text: "text", value: "value" }, selectedItemIndex: 6,
                    cssClass: "e-" + xlObj._id + "-ddl",
                    width: "100%",
                    change: $.proxy(this._valDTypeOnChange, this)
                });
                $subDiv = ej.buildTag("div.e-dlgctndiv e-dlg-fields", "", {}, { id: xlObj._id + "_Ribbon_SubDiv" });
                table = ej.buildTag("table");
                tr = ej.buildTag("tr"), td = ej.buildTag("td");
                $label = ej.buildTag("label.e-dlg-fields", "", "", { id: xlObj._id + "_Ribbon_lbMin" }).text(xlObj._getLocStr("NumberStart"));
                table.append(tr.append(td.append($label)));
                tr = ej.buildTag("tr"), td = ej.buildTag("td");
                var $min = ej.buildTag("input.ejinputtext", "", { width: "100%" }, { id: xlObj._id + "_Ribbon_btnMin", type: "text", name: xlObj._id + "_valMin" });
                table.append(tr.append(td.append($min)));
                tr = ej.buildTag("tr"), td = ej.buildTag("td");
                $label = ej.buildTag("label.e-dlg-fields", "", "", { id: xlObj._id + "_Ribbon_lbMax" }).text(xlObj._getLocStr("NumberEnd"));
                table.append(tr.append(td.append($label)));
                tr = ej.buildTag("tr"), td = ej.buildTag("td");
                var $max = ej.buildTag("input.ejinputtext", "", { width: "100%" }, { id: xlObj._id + "_Ribbon_btnMax", type: "text", name: xlObj._id + "_valMax" });
                table.append(tr.append(td.append($max)));
                $stgctnr.append($mainDiv, $subDiv.append(table));
                $("#" + xlObj._id + "_Ribbon_SubDiv").wrapInner('<form id="' + xlObj._id + '_Form_ValDialog" onsubmit="return false"></form>');
            }
        },

        _dialogValidate: function (dlgid, inputid) {
            var xlObj = this.XLObj, id = xlObj._id, obj, elem = $("#" + id + "_Form" + dlgid), val, i, len, cellAddr, webAddr, date, inputLength, input, number, time, splitStr, type, condType, decimal, formulaRule;
            if ($.validator) {
                elem.validate({
                    errorElement: "div",
                    wrapper: "div",
                    errorPlacement: function (error, elem) {
                        error.insertAfter(elem.closest("input"));
                        error.children().addClass("e-dlg-field-validation-error");
                        error.css({ "position": "relative" });
                        error.offset({ left: elem.offset().left, top: elem.offset().top + 19 });
                    },
                    onfocusout: function (element) {
                        this.element(element);
                    },
                });
                type = $("#" + id + "_Ribbon_ddAction").ejDropDownList("getValue");
                switch (dlgid) {
                    case "_ValDialog":
                        obj = $("#" + id + "_Ribbon_ddType").data("ejDropDownList");
                        val = obj.getSelectedValue();
                        break;
                    case "_CFDialog":
                        if (inputid === id + "_CreateRule")
                            val = "formulaRule";
                        else
                            val = inputid.charAt(0).toUpperCase() + inputid.slice(1).toLowerCase();
                        break;
                    case "_GoToDiv":
                    case "_Ribbon_PvtRange":
                    case "_Ribbon_PvtLocation":
                    case "_Ribbon_SparklineRange":
                    case "_Ribbon_SparklineLocation":
                    case "_datarange":
                    case "_Ribbon_cellAddress":
                        val = "cellAddr";
                        break;
                    case "_xlFileName":
                    case "_Ribbon_webAddress":
                        val = "webAddr";
                        break;
                }
                $("#" + id + "_Form" + dlgid).validate().resetForm();
                input = new Array(), inputLength = $("#" + id + "_Form" + dlgid).find("input").length, date = { required: true, date: true, messages: { date: xlObj._getLocStr("DateValidationMsg"), required: xlObj._getLocStr("RequiredField") } }, cellAddr = { required: true, celladdr: true }, number = { required: true, numberVal: true };
                decimal = { required: true, number: true, messages: { required: xlObj._getLocStr("RequiredField"), number: xlObj._getLocStr("NumberValidationMsg") } }, time = { required: true, time: true }, webAddr = { required: true }, condType = { required: true, betweentype: true };
                formulaRule = { required: true, formularule: true },
                    $.validator.addMethod("time", function (value, elem, param) {
                        return value === "" || value.match(/^(([0-1]?[0-9])|([2][0-3])):([0-5]?[0-9])(:([0-5]?[0-9]))?(\s(AM|am|PM|pm))?$/);
                    }, xlObj._getLocStr("TimeValidationMsg"));
                $.validator.addMethod("date", function (value, elem, param) {
                    var dateSplit = value.split("/");
                    return this.optional(elem) || !/Invalid|NaN/.test(new Date((/chrom(e|ium)/.test(navigator.userAgent.toLowerCase())) ? value : dateSplit[1] + "/" + dateSplit[0] + "/" + dateSplit[2]));
                }, xlObj._getLocStr("DateValidationMsg"));
                $.validator.addMethod("celladdr", function (value, elem, param) {
                    var range, id = $(elem).data("parentID"), xlObj = $("#" + id).data("ejSpreadsheet"), sheetIdx, getSheet, sheetName = true;
                    if ($("#" + xlObj._id + "_Ribbon_sheentName").length)
                        sheetIdx = $("#" + xlObj._id + "_Ribbon_sheentName").ejTreeView("option", "selectedNode");
                    if (xlObj.isUndefined(sheetIdx) || sheetIdx < 0)
                        sheetIdx = xlObj.getActiveSheetIndex();
                    (value.indexOf("=") > -1) && (value = value.split('=')[1]);
                    if (value.indexOf("!") > -1) {
                        splitStr = value.split("!");
                        sheetIdx = xlObj._getSheetIndexByName(splitStr[0]);
                        value = splitStr[1];
                    }
                    if (sheetIdx < 1)
                        sheetName = false;
                    getSheet = xlObj.getSheet(sheetIdx);
                    value.indexOf("$") > -1 && (value = value.split("$").join(""));
                    range = xlObj.getRangeIndices(value);
                    range = (getSheet.colCount <= range[3] || getSheet.rowCount <= range[2]) ? null : value;
                    return (value.match(/^(?:\bxfXF[a-zA-D]|xX[a-eA-E][a-zA-Z]|[a-wA-W][a-zA-Z]{2}|[a-zA-Z]{2}|[a-zA-Z])\$?(?:104857[0-6]|10485[0-6]\d|1048[0-4]\d{2}|104[0-7]\d{3}|10[0-3]\d{4}|[1-9]\d{1,5}|[1-9]):(?:\bxfXF[a-zA-D]|xX[a-eA-E][a-zA-Z]|[a-wA-W][a-zA-Z]{2}|[a-zA-Z]{2}|[a-zA-Z])\$?(?:104857[0-6]|10485[0-6]\d|1048[0-4]\d{2}|104[0-7]\d{3}|10[0-3]\d{4}|[1-9]\d{1,5}|[1-9])$/) || value.match(/^(?:\bxfXF[a-zA-D]|xX[a-eA-E][a-zA-Z]|[a-wA-W][a-zA-Z]{2}|[a-zA-Z]{2}|[a-zA-Z])\$?(?:104857[0-6]|10485[0-6]\d|1048[0-4]\d{2}|104[0-7]\d{3}|10[0-3]\d{4}|[1-9]\d{1,5}|[1-9])$/) && (sheetName)) && range;
                }, xlObj._getLocStr("CellAddrsValidationMsg"));
                $.validator.addMethod("betweentype", function (value, elem, param) {
                    var id = elem.id.split("_")[0], val = $("#" + elem.id.split("_")[0] + "_Ribbon_ddType").ejDropDownList("getSelectedValue"), minVal = $("#" + id + "_Ribbon_btnMin").val(), maxVal = $("#" + elem.id.split("_")[0] + "_Ribbon_btnMax").val();
                    if (minVal === "" || maxVal === "" || parseFloat(minVal) > parseFloat(maxVal))
                        value = null;
                    if (val === "Date" && Date.parse(minVal) > Date.parse(maxVal))
                        value = null;
                    if (val === "Time" && new Date("01/01/1990 " + minVal).getTime() > new Date("01/01/1990 " + maxVal).getTime())
                        value = null;
                    return value;
                }, xlObj._getLocStr("BetweenAlert"));
                $.validator.addMethod("numberVal", function (value, elem, param) {
                    if ($.isNumeric(value)) {
                        if (parseFloat(value) % 1 !== 0)
                            value = null;
                        $.validator.messages.numberVal = xlObj._getLocStr("NumberValMsg");
                        return value;
                    }
                    else
                        $.validator.messages.numberVal = xlObj._getLocStr("NumberAlertMsg");
                }, $.validator.messages.numberVal);
                $.validator.addMethod("formularule", function (value, elem, param) {
                    return value === "" || (value.startsWith("=") && value.indexOf("!") < 0);
                }, xlObj._getLocStr("FormulaRuleMsg"));

                for (i = 0, len = inputLength; i < len; i++) {
                    input[i] = $("#" + id + "_Form" + dlgid).find("input")[i].id;
                    switch (val) {
                        case "Date":
                            $("#" + input[i]).rules("remove");
                            $("#" + input[i]).rules("add", date);
                            break;
                        case "Time":
                            $("#" + input[i]).rules("remove");
                            $("#" + input[i]).rules("add", time);
                            break;
                        case "Number":
                        case "TextLength":
                            $("#" + input[i]).rules("remove");
                            $("#" + input[i]).rules("add", number);
                            break;
                        case "Decimal":
                            $("#" + input[i]).rules("remove");
                            $("#" + input[i]).rules("add", decimal);
                            break;
                        case "List":
                            $("#" + input[i]).rules("remove");
                            $("#" + input[i]).rules("add", webAddr);
                            break;
                        case "cellAddr":
                            $("#" + input[i]).rules("remove");
                            $("#" + input[i]).rules("add", cellAddr);
                            break;
                        case "webAddr":
                            $("#" + input[i]).rules("remove");
                            $("#" + input[i]).rules("add", webAddr);
                            break;
                        case "formulaRule":
                            $("#" + input[i]).rules("remove");
                            $("#" + input[i]).rules("add", formulaRule);
                            break;

                    }
                    if (val !== "List" && (type === "Between" || type === "NotBetween"))
                        $("#" + id + "_Ribbon_btnMax").rules("add", condType);
                }
            }
        },

        _renderCFDialog: function (args) {
            var $mainDiv, $subDiv, $label, $input, dlgObj, xlObj = this.XLObj;
            dlgObj = $("#" + xlObj._id + "_CFDialog").data("ejDialog");
            if (args.ID === xlObj._id + "_CreateRule")
                dlgObj.option({ title: xlObj._getLocStr("NewRule") });
            else
                dlgObj.option({ title: xlObj._getLocStr(this._cFormatData[args.ID][0]) });
            if ($("#" + xlObj._id + "_Ribbon_CFSubDiv").length < 1) {
                $subDiv = ej.buildTag("div.e-dlg-fields", "", {}, { id: xlObj._id + "_Ribbon_CFSubDiv" });
                $label = ej.buildTag("label.e-dlg-fields").text(xlObj._getLocStr("With"));
                $subDiv.append($label);
                var $ddStyle = ej.buildTag("input.e-" + xlObj._id + "-ddl", "", {}, { id: xlObj._id + "_Ribbon_ddStyle", type: "text" });
                $subDiv.append($ddStyle);
                $ddStyle.ejDropDownList({
                    dataSource: this._styles,
                    fields: { id: "Types", text: "text", value: "value" }, selectedItemIndex: 0,
                    cssClass: "e-" + xlObj._id + "-ddl",
                    width: "100%",
                    change: $.proxy(this._ddOnChange, this),
                });
                $("#" + xlObj._id + "_CondFormat").append($subDiv);
                $("#" + xlObj._id + "_CondFormat").addClass("e-cfdiv");
            }
            if ($("#" + xlObj._id + "_Ribbon_CFMainDiv").length > 0)
                $("#" + xlObj._id + "_Ribbon_CFMainDiv").remove();
            $mainDiv = ej.buildTag("div.e-dlg-fields", "", "", { id: xlObj._id + "_Ribbon_CFMainDiv" });
            $("#" + xlObj._id + "_CondFormat").prepend($mainDiv);
            if (args.ID == "between") {
                $input = ej.buildTag("input.ejinputtext", "", {}, { id: xlObj._id + "_Ribbon_input2", type: "text" });
                $mainDiv.prepend($input);
                $label = ej.buildTag("label.e-dlg-fields").text(xlObj._getLocStr("And")).css('display', "table");
                $mainDiv.prepend($label);
            }
            $input = ej.buildTag("input.ejinputtext", "", {}, { id: xlObj._id + "_Ribbon_input1", type: "text" });
            $mainDiv.prepend($input);
            if (args.ID === xlObj._id + "_CreateRule")
                $label = ej.buildTag("label.e-dlg-fields").text(xlObj._getLocStr("NewRuleLabelContent"));
            else
                $label = ej.buildTag("label.e-dlg-fields").text(xlObj._getLocStr(this._cFormatData[args.ID][1]));
            $mainDiv.prepend($label);
            (args.ID === "aboveavg" || args.ID === "belowavg") && $input.hide();
            $("#" + xlObj._id + "_Ribbon_CFMainDiv").wrapInner('<form id="' + xlObj._id + '_Form_CFDialog" onsubmit="return false"></form>');
            this._dialogValidate("_CFDialog", args.ID);
        },

        _dlgCFOk: function () {
            var xlObj = this.XLObj;
            if ($("#" + xlObj._id + "_Form_CFDialog").valid()) {
                var ddObj = $("#" + xlObj._id + "_Ribbon_ddStyle").data("ejDropDownList"), rule;
                rule = (xlObj.XLRibbon._currentCFormat === xlObj._id + "_CreateRule") ? "formularule" : xlObj.XLRibbon._currentCFormat;
                xlObj.XLCFormat._cFormat(rule, $("#" + xlObj._id + "_Ribbon_input1").val(), $("#" + xlObj._id + "_Ribbon_input2").val(), ddObj.getSelectedValue());
                $("#" + xlObj._id + "_CFDialog").ejDialog("close");
                xlObj._setSheetFocus();
            }
        },

        _dlgCFCancel: function () {
            var xlObj = this.XLObj;
            $("#" + xlObj._id + "_Form_CFDialog").validate().resetForm();
            $("#" + xlObj._id + "_CFDialog").ejDialog("close");
            xlObj._setSheetFocus();
        },

        _sheetData: function (e) {
            var xlObj = this.XLObj, sheetname = new Array(), shtnameclt = new Array(), i, len, sheets = xlObj._getSheetNames();
            shtnameclt[0] = { id: 1, name: xlObj._getLocStr("SheetReference"), hasChild: true, expanded: true };
            for (i = 1, len = sheets.length; i <= len; i++) {
                if (sheets[i - 1].isVisible) {
                    sheetname[i] = sheets[i - 1].text;
                    shtnameclt[i] = { id: i + 1, pid: 1, name: sheetname[i], hasChild: true, expanded: true };
                }
            }
            return shtnameclt;
        },

        _renderHLDialog: function () {
            var xlObj = this.XLObj;
            if ($("#" + xlObj._id + "_Ribbon_WebDiv").length < 1) {
                var $WebDiv, $label, $find, $SheetDiv, $lb, $div, $table, $tr, $tr, $divctnr, $td;
                $WebDiv = ej.buildTag("div.e-dlgctndiv", "", {}, { id: xlObj._id + "_Ribbon_WebDiv" });
                $table = ej.buildTag("table", "", {}, { "cellpadding": 0, "cellspacing": 0 }), $tr = ej.buildTag("tr"), $td = ej.buildTag("td", "", { width: "32%" });
                $table.append($tr.append($td));
                $label = ej.buildTag("label", xlObj._getLocStr("HyperlinkText"));
                $td.append($label);
                $td = ej.buildTag("td");
                $find = ej.buildTag("input.ejinputtext", "", {}, { id: xlObj._id + "_Ribbon_findText", type: "text" });
                $tr.append($td.append($find));

                $tr = ej.buildTag("tr.e-dlgtd-fields"), $td = ej.buildTag("td");
                $table.append($tr.append($td));
                $label = ej.buildTag("label", xlObj._getLocStr("WebAddress"), "", { id: xlObj._id + "_Ribbon_address" });
                $td.append($label);
                $td = ej.buildTag("td");
                $find = ej.buildTag("input.ejinputtext", "", {}, { id: xlObj._id + "_Ribbon_webAddress", type: "text" });
                $tr.append($td.append($find));
                $("#" + xlObj._id + "_Web").append($WebDiv.append($table));

                $SheetDiv = ej.buildTag("div.e-dlgctndiv", "", "", { id: xlObj._id + "_Ribbon_DocDiv" });
                $divctnr = ej.buildTag("div.e-dlg-fields");
                $table = ej.buildTag("table"), $tr = ej.buildTag("tr"), $td = ej.buildTag("td", "", { width: "32%" });
                $table.append($tr.append($td));
                $label = ej.buildTag("label", xlObj._getLocStr("HyperlinkText"));
                $td.append($label);
                $td = ej.buildTag("td");
                $find = ej.buildTag("input.ejinputtext", "", {}, { id: xlObj._id + "_Ribbon_cellText", type: "text" });
                $tr.append($td.append($find));

                $tr = ej.buildTag("tr.e-dlgtd-fields"), $td = ej.buildTag("td");
                $table.append($tr.append($td));
                $label = ej.buildTag("label", xlObj._getLocStr("CellAddress"));
                $td.append($label);
                $td = ej.buildTag("td");
                $find = ej.buildTag("input.ejinputtext", "", {}, { id: xlObj._id + "_Ribbon_cellAddress", type: "text" });
                $find.data("parentID", xlObj._id);
                $tr.append($td.append($find));
                $div = ej.buildTag("div.e-dlg-fields", "", "", { id: xlObj._id + "_Ribbon_Sheet" });
                $SheetDiv.append($divctnr.append($table), $div);
                $label = ej.buildTag("label", xlObj._getLocStr("SheetIndex"));
                $div.append($label);
                $lb = ej.buildTag("div", "", "", { id: xlObj._id + "_Ribbon_sheentName" });
                $div.append($lb);
                $lb.ejTreeView({ fields: { id: "id", parentId: "pid", text: "name", hasChild: "hasChild", dataSource: this._sheetData(), expanded: "expanded" }, nodeSelect: $.proxy(this._sheetSelect, xlObj), height: 90 });
                $("#" + xlObj._id + "_Doc").append($SheetDiv);
                $("#" + xlObj._id + "_Ribbon_cellAddress").wrap("<form id='" + xlObj._id + "_Form_Ribbon_cellAddress' onsubmit='return false'></form>");
                this._dialogValidate("_Ribbon_cellAddress");
                $("#" + xlObj._id + "_Ribbon_webAddress").wrap("<form id='" + xlObj._id + "_Form_Ribbon_webAddress' onsubmit='return false'></form>");
                this._dialogValidate("_Ribbon_webAddress");
            }
        },

        _sheetSelect: function (args) {
            var i, len, shtName = this._getSheetNames(), cellElem = $("#" + this._id + "_Ribbon_cellAddress"), btnElem = $("#" + this._id + "hlDialog_OkBtn").data("ejButton"), valElem = $("#" + this._id + "_Ribbon_cellText");
            if (args.model.selectedNode > 0) {
                cellElem.attr("disabled", false);
                btnElem.enable();
                cellElem.focus().setInputPos(1);
                for (i = 0, len = shtName.length; i < len; i++) {
                    if (shtName[i].text === valElem.val().split("!")[0])
                        valElem.val(args.value + "!" + cellElem.val());
                }

            }
            else {
                cellElem.attr("disabled", true);
                btnElem.disable();
            }
        },


        _dlgHLOk: function () {
            var xlObj = this.XLObj;
            if ($("#" + xlObj._id + "_Form_Ribbon_cellAddress").valid() && $("#" + xlObj._id + "_Form_Ribbon_webAddress").valid()) {
                this.XLObj._dlgHLClick = true;
                xlObj._setLink();
                this._dlgHLCancel();
            }
        },

        _dlgHLCancel: function () {
            $("#" + this.XLObj._id + "_HLDialog").ejDialog("close");
        },

        _renderFRDialog: function () {
            var $findDiv, $label, $find, $replace, $chkinput, $dd, $divleft, $divright, $maindiv, $settingsDiv, xlObj = this.XLObj, $table, $tr, $td;
            if ($("#" + xlObj._id + "_Ribbon_FindDiv").length < 1) {
                $findDiv = ej.buildTag("div.e-dlgctndiv e-ss-finddiv", "", { height: "auto" }, { id: xlObj._id + "_Ribbon_FindDiv" });
                $("#" + xlObj._id + "_Find").append($findDiv);
                $table = ej.buildTag("table");
                $tr = ej.buildTag("tr.e-dlgtd-fields"), $td = ej.buildTag("td", "", { width: "30%" });
                $table.append($tr.append($td));
                $label = ej.buildTag("label", xlObj._getLocStr("FindLabel"), "", { id: xlObj._id + "_Ribbon_lbFind" });
                $td.append($label);
                $td = ej.buildTag("td");
                $find = ej.buildTag("input.ejinputtext", "", "", { id: xlObj._id + "_Ribbon_textFind", type: "text" });
                $td.append($find);
                $tr.append($td);
                $tr = ej.buildTag("tr.e-dlgtd-fields"), $td = ej.buildTag("td");
                $table.append($tr.append($td));
                $label = ej.buildTag("label", xlObj._getLocStr("ReplaceLabel"), "", { id: xlObj._id + "_Ribbon_lbReplace" });
                $td.append($label);
                $td = ej.buildTag("td");
                $replace = ej.buildTag("input.ejinputtext", "", "", { id: xlObj._id + "_Ribbon_textReplace", type: "text" });
                $td.append($replace);
                $tr.append($td);
                $findDiv.append($table);
                $("#" + xlObj._id + "_Ribbon_lbReplace").hide();
                $("#" + xlObj._id + "_Ribbon_textReplace").hide();
                $settingsDiv = ej.buildTag("div.e-dlgctndiv e-ss-stgdiv", "", {}, { id: xlObj._id + "_Ribbon_SettingsDiv" });
                $table = ej.buildTag("table");
                $tr = ej.buildTag("tr"), $td = ej.buildTag("td", "", { width: "50%" });
                $table.append($tr.append($td));
                $chkinput = ej.buildTag("input#" + xlObj._id + "_Ribbon_Case");
                $label = ej.buildTag("label", xlObj._getLocStr("MatchCase"), {}, { "for": xlObj._id + "_Ribbon_Case" });
                $td.append($chkinput);
                $td.append($label);
                $chkinput.ejCheckBox();
                $td = ej.buildTag("td");
                $chkinput = ej.buildTag("input#" + xlObj._id + "_Ribbon_AllContent");
                $label = ej.buildTag("label", xlObj._getLocStr("MatchAll"), {}, { "for": xlObj._id + "_Ribbon_AllContent" });
                $td.append($chkinput);
                $chkinput.ejCheckBox();
                $td.append($label);
                $tr.append($td);
                $tr = ej.buildTag("tr.e-dlgtd-fields"), $td = ej.buildTag("td");
                $table.append($tr.append($td));
                $label = ej.buildTag("label").text(xlObj._getLocStr("Within"));
                $td.append($label);
                $td = ej.buildTag("td");
                $label = ej.buildTag("label").text(xlObj._getLocStr("Search"));
                $td.append($label);
                $tr.append($td);
                $tr = ej.buildTag("tr.e-dlgtd-fields"), $td = ej.buildTag("td");
                $table.append($tr.append($td));
                $dd = ej.buildTag("input", "", "", { id: xlObj._id + "_Ribbon_ddWithin", type: "text" });
                $td.append($dd);
                $dd.ejDropDownList(xlObj._generateEJDD(this._within, { id: "Types", text: "text", value: "value" }, 0, 110, 25));
                $td = ej.buildTag("td");
                $dd = ej.buildTag("input", "", "", { id: xlObj._id + "_Ribbon_ddSearch", type: "text" });
                $td.append($dd);
                $dd.ejDropDownList(xlObj._generateEJDD(this._sType, { id: "Types", text: "text", value: "value" }, 0, 120, 25));
                $tr.append($td);
                $tr = ej.buildTag("tr.e-dlgtd-fields"), $td = ej.buildTag("td");
                $table.append($tr.append($td));
                $label = ej.buildTag("label", xlObj._getLocStr("Lookin"));
                $td.append($label);
                $td = ej.buildTag("td");
                $label = ej.buildTag("label", xlObj._getLocStr("Replace") + " " + xlObj._getLocStr("Direction"));
                $tr.append($td.append($label));
                $tr = ej.buildTag("tr.e-dlgtd-fields"), $td = ej.buildTag("td");
                $table.append($tr.append($td));
                $dd = ej.buildTag("input", "", "", { id: xlObj._id + "_Ribbon_ddLookin", type: "text" });
                $td.append($dd);
                $dd.ejDropDownList(xlObj._generateEJDD(this._vType, { id: "Types", text: "text", value: "value" }, 0, 110, 25, "Type"));
                $td = ej.buildTag("td");
                $dd = ej.buildTag("input", "", "", { id: xlObj._id + "_Ribbon_ddDirection", type: "text" });
                $tr.append($td.append($dd));
                $dd.ejDropDownList(xlObj._generateEJDD(this._direction, { id: "Types", text: "text", value: "value" }, 0, 120, 25));
                $("#" + xlObj._id + "_Settings").append($settingsDiv.append($table));
            }
        },

        _frTypeChange: function (name, args) {
            if (name === "Type" && (args.value === "comment")) {
                $("#" + this._id + "_Ribbon_textReplace").attr("disabled", true);
                $("#" + this._id + "FR_ReplaceBtn").ejButton("disable");
                $("#" + this._id + "FR_ReplaceAllBtn").ejButton("disable");
            }
            else {
                $("#" + this._id + "_Ribbon_textReplace").prop("disabled", false);
                $("#" + this._id + "FR_ReplaceBtn").ejButton("enable");
                $("#" + this._id + "FR_ReplaceAllBtn").ejButton("enable");
            }
        },

        _hlTabChange: function (args) {
            var xlObj = this.XLObj, treeObj = $("#" + xlObj._id + "_Ribbon_sheentName").data("ejTreeView"), sheetIdx = xlObj.getActiveSheetIndex(), docTab = $("#" + xlObj._id + "_Doc"), webTab = $("#" + xlObj._id + "_Web"),
                webAddrElem = $("#" + xlObj._id + "_Ribbon_webAddress"), webElem = $("#" + xlObj._id + "_Ribbon_findText"), cellAddrElem = $("#" + xlObj._id + "_Ribbon_cellAddress"), cellElem = $("#" + xlObj._id + "_Ribbon_cellText"),
                activeCell = xlObj.getActiveCell(sheetIdx), cellIdx = xlObj.XLEdit.getPropertyValue(activeCell.rowIndex, activeCell.colIndex, "hyperlink", sheetIdx);
            switch (args.activeIndex) {
                case 0:
                    webAddrElem.focus().setInputPos(webAddrElem.val().length);
                    webElem.val(cellElem.val());
                    docTab.hide();
                    webTab.show();
                    $("#" + xlObj._id + "hlDialog_OkBtn").ejButton("enable");
                    break;
                case 1:
                    !cellAddrElem.val().length && cellAddrElem.val("A1");
                    docTab.show();
                    webTab.hide();
                    if (cellIdx && cellIdx.cellAddr)
                        sheetIdx = parseInt(cellIdx.cellAddr.split("_")[1]);
                    treeObj.selectNode(sheetIdx + 1);
                    webElem.val().length ? cellElem.val(webElem.val()) : cellElem.val(treeObj.getText(sheetIdx + 1) + "!A1");
                    cellAddrElem.focus().setInputPos(cellAddrElem.val().length);
                    break;
            }
        },

        _findTabChange: function (args) {
            var $findDiv, xlObj = this.XLObj;
            switch (args.activeIndex) {
                case 0:
                    $findDiv = $("#" + xlObj._id + "_Ribbon_FindDiv");
                    $("#" + xlObj._id + "_Ribbon_lbReplace").hide();
                    $("#" + xlObj._id + "_Ribbon_textReplace").hide();
                    $("#" + xlObj._id + "FR_ReplaceBtn").css("visibility", "hidden");
                    $("#" + xlObj._id + "FR_ReplaceAllBtn").css("visibility", "hidden");
                    $("#" + xlObj._id + "_Find").append($findDiv);
                    $("#" + xlObj._id + "FR_PrevBtn").show();
                    $("#" + xlObj._id + "FR_NextBtn").show();
                    $("#" + xlObj._id + "_Ribbon_textFind").focus().setInputPos($("#" + xlObj._id + "_Ribbon_textFind").val().length);
                    if (xlObj._phoneMode) {
                        $("#" + xlObj._id + "FR_ReplaceBtn").hide();
                        $("#" + xlObj._id + "FR_ReplaceAllBtn").hide();
                    }
                    else {
                        $("#" + xlObj._id + "FR_ReplaceBtn").show();
                        $("#" + xlObj._id + "FR_ReplaceAllBtn").show();
                    }
                    break;
                case 1:
                    $findDiv = $("#" + xlObj._id + "_Ribbon_FindDiv");
                    $("#" + xlObj._id + "_Ribbon_lbReplace").show();
                    $("#" + xlObj._id + "_Ribbon_textReplace").show();
                    $("#" + xlObj._id + "FR_ReplaceBtn").css("visibility", "visible").show();
                    $("#" + xlObj._id + "FR_ReplaceAllBtn").css("visibility", "visible").show();
                    if (xlObj._phoneMode) {
                        $("#" + xlObj._id + "FR_PrevBtn").hide();
                        $("#" + xlObj._id + "FR_NextBtn").hide();
                    }
                    else {
                        $("#" + xlObj._id + "FR_PrevBtn").show();
                        $("#" + xlObj._id + "FR_NextBtn").show();
                    }
                    $("#" + xlObj._id + "_Replace").append($findDiv);
                    $("#" + xlObj._id + "_Ribbon_textFind").focus().setInputPos($("#" + xlObj._id + "_Ribbon_textFind").val().length);
                    break;
                case 2:
                    $("#" + xlObj._id + "FR_PrevBtn").hide();
                    $("#" + xlObj._id + "FR_NextBtn").hide();
                    $("#" + xlObj._id + "FR_ReplaceBtn").css("visibility", "hidden");
                    $("#" + xlObj._id + "FR_ReplaceAllBtn").css("visibility", "hidden");
                    $("#" + xlObj._id + "_Ribbon_ddWithin").focus();
                    xlObj._phoneMode ? $("#" + xlObj._id + "_Ribbon_SettingsDiv").find('td:eq(1)').hide() : $("#" + xlObj._id + "_Ribbon_SettingsDiv").find('td:eq(1)').show();
                    break;
            }
        },

        _gotoTabChange: function (args) {
            var xlObj = this.XLObj;
            if (args.activeIndex == 0)
                $("#" + xlObj._id + "_textRef").focus().setInputPos($("#" + xlObj._id + "_textRef").val().length);
        },

        _btnFROnClick: function (id, e) {
            var xlObj = this.XLObj;
            xlObj.showWaitingPopUp();
            var sheetIdx = xlObj.getActiveSheetIndex(), rowIndex = xlObj.getSheet(sheetIdx)._startCell.rowIndex, colIndex = xlObj.getSheet(sheetIdx)._startCell.colIndex, mCase = $("#" + xlObj._id + "_Ribbon_Case").data("ejCheckBox").isChecked(), mAll = $("#" + xlObj._id + "_Ribbon_AllContent").data("ejCheckBox").isChecked();
            var within = this._within[$("#" + xlObj._id + "_Ribbon_ddWithin").data("ejDropDownList").selectedIndexValue].value, search = this._sType[$("#" + xlObj._id + "_Ribbon_ddSearch").data("ejDropDownList").selectedIndexValue].value, lookin = this._vType[$("#" + xlObj._id + "_Ribbon_ddLookin").data("ejDropDownList").selectedIndexValue].value, direction = this._direction[$("#" + xlObj._id + "_Ribbon_ddDirection").data("ejDropDownList").selectedIndexValue].value, isFinded;
            switch (id) {
                case "FR_NextBtn":
                case "FR_PrevBtn":
                    xlObj.XLSearch._findCount = 0;
                    isFinded = id === "FR_NextBtn" ? xlObj.XLSearch._findNext($("#" + xlObj._id + "_Ribbon_textFind").val(), sheetIdx, mCase, mAll, lookin, within, search) : xlObj.XLSearch._findPrev($("#" + xlObj._id + "_Ribbon_textFind").val(), sheetIdx, mCase, mAll, lookin, within, search);
                    if (!isFinded) {
                        xlObj.XLSearch._updateSelection(rowIndex, colIndex, sheetIdx);
                        xlObj.hideWaitingPopUp();
                        xlObj._showAlertDlg("Alert", "NotFound");
                    }
                    break;
                case "FR_ReplaceBtn":
                    xlObj.XLSearch._replaceData($("#" + xlObj._id + "_Ribbon_textFind").val(), $("#" + xlObj._id + "_Ribbon_textReplace").val(), sheetIdx, mCase, mAll, lookin, direction, within, search);
                    break;
                case "FR_ReplaceAllBtn":
                    xlObj.XLSearch._replaceAllData($("#" + xlObj._id + "_Ribbon_textFind").val(), $("#" + xlObj._id + "_Ribbon_textReplace").val(), mCase, mAll, lookin, within);
                    break;
                case "FR_CloseBtn":
                    $("#" + xlObj._id + "_FRDialog").ejDialog("close");
                    xlObj._setSheetFocus();
                    break;
            }
            xlObj.hideWaitingPopUp();
        },

        _renderGoToDialog: function () {
            var $gotoDiv, $gotoSpDiv, $label, $list, $input, xlObj = this.XLObj, $subdiv;
            $("#" + xlObj._id + "_GoToDlgTab").ejTab({ width: "100%", itemActive: ej.proxy(this._gotoTabChange, this), cssClass: "e-ss-dlgtab" });
            if ($("#" + xlObj._id + "_GoToDiv").length < 1) {
                $gotoDiv = ej.buildTag("div.e-dlgctndiv", "", {}, { id: xlObj._id + "_GoToDiv" });
                $("#" + xlObj._id + "_GoTo").append($gotoDiv);
                $subdiv = ej.buildTag("div.e-dlg-fields");
                $label = ej.buildTag("label.e-dlg-fields", xlObj._getLocStr("GoToName"));
                $list = ej.buildTag("ul#" + xlObj._id + "_GotoAddr");
                $gotoDiv.append($subdiv.append($label, $list));
                $("#" + xlObj._id + "_GotoAddr").ejListBox({
                    dataSource: this._addrList,
                    height: "120",
                    width: "100%",
                    selected: $.proxy(this._gotoValChange, this),
                    fields: { id: "Types", text: "text", value: "value" }
                });

                $subdiv = ej.buildTag("div.e-dlg-fields");
                $label = ej.buildTag("label.e-dlg-fields", xlObj._getLocStr("Reference"));
                $input = ej.buildTag("input.ejinputtext", "", "", { id: xlObj._id + "_textRef", type: "text" });
                $input.data("parentID", xlObj._id);
                $gotoDiv.append($subdiv.append($label, $input));

                $gotoSpDiv = ej.buildTag("div#" + xlObj._id + "_GoToSpDiv.e-dlgctndiv", "", "");
                $subdiv = ej.buildTag("div.e-dlg-fields e-dlgctndiv");
                $("#" + xlObj._id + "_GoToSp").append($gotoSpDiv.append($subdiv));
                $("#" + xlObj._id + "_GoToSp").css({ 'overflow': 'auto', 'height': 'auto' }); // buttons and headers
                $label = ej.buildTag("label.e-dlg-fields").text(xlObj._getLocStr("Select")).css('display', "table");
                $subdiv.append($label);
                this._renderGotoSp($subdiv, this._gotoRBtnSet1, this._gotoRBtnSet2, this._gotoChkBox);
                $("#" + xlObj._id + "_GoDialog").ejDialog({
                    showOnInit: false, enableModal: true, enableResize: false, width: "auto", allowKeyboardNavigation: false, title: xlObj._getLocStr("GoTo"), cssClass: "e-ss-dialog e-ss-gotodlg e-ss-mattab e-" + xlObj._id + "-dlg", close: ej.proxy(this._dialogClose, this), open: ej.proxy(function (e) {
                        var gotoipt = $("#" + xlObj._id + "_textRef");
                        gotoipt.focus().setInputPos(gotoipt.val().length);
                    })
                });
                $('#' + xlObj._id + '_GoToDiv').wrapInner('<form id="' + xlObj._id + '_Form_GoToDiv" onsubmit="return false"></form>');
                this._dialogValidate('_GoToDiv');
            }
        },

        _renderGotoSp: function ($content, rBtnIdSet1, rBtnIdSet2, chkBoxIDs) {
            var input, lbl, table, tr, td, i, xlObj = this.XLObj, tabId = xlObj._id + "_gotoSpDiv", $chkinput;
            table = ej.buildTag("table");
            for (i = 0; i < rBtnIdSet1.length; i++) {
                tr = ej.buildTag("tr", "", { height: 35 });
                td = ej.buildTag("td");
                input = ej.buildTag("input#" + tabId + "_" + rBtnIdSet1[i], "", {}, { type: "radio", name: "gotospecial" });
                td.append(input);
                tr.append(td);
                input.ejRadioButton({ size: "medium", change: $.proxy(this._rBtnOnClick, this, rBtnIdSet1[i]) });
                td = ej.buildTag("td", "", { width: 100 });
                lbl = ej.buildTag("label", xlObj._getLocStr(rBtnIdSet1[i]), {}, { "for": tabId + "_" + rBtnIdSet1[i] });
                td.append(lbl);
                tr.append(td);
                if (!xlObj.isUndefined(rBtnIdSet2[i])) {
                    td = ej.buildTag("td");
                    input = ej.buildTag("input#" + tabId + "_" + rBtnIdSet2[i], "", {}, { type: "radio", name: "gotospecial" });
                    td.append(input);
                    tr.append(td);
                    input.ejRadioButton({ size: "medium", change: $.proxy(this._rBtnOnClick, this, rBtnIdSet2[i]) });
                    td = ej.buildTag("td");
                    lbl = ej.buildTag("label", xlObj._getLocStr(rBtnIdSet2[i]), {}, { "for": tabId + "_" + rBtnIdSet2[i] });
                    td.append(lbl);
                    tr.append(td);
                }
                table.append(tr);
            }
            for (i = 0; i < chkBoxIDs.length; i = i + 2) {
                tr = ej.buildTag("tr");
                td = ej.buildTag("td");
                $chkinput = ej.buildTag("input#" + xlObj._id + "_" + chkBoxIDs[i]);
                td.append($chkinput);
                tr.append(td);
                td = ej.buildTag("td");
                lbl = ej.buildTag("label", xlObj._getLocStr(chkBoxIDs[i]), {}, { "for": xlObj._id + "_" + chkBoxIDs[i] });
                td.append(lbl);
                tr.append(td);
                $chkinput.ejCheckBox({ checked: true, enabled: false });
                td = ej.buildTag("td");
                $chkinput = ej.buildTag("input#" + xlObj._id + "_" + chkBoxIDs[i + 1]);
                td.append($chkinput);
                tr.append(td);
                td = ej.buildTag("td");
                lbl = ej.buildTag("label", xlObj._getLocStr(chkBoxIDs[i + 1]), {}, { "for": xlObj._id + "_" + chkBoxIDs[i + 1] });
                td.append(lbl);
                tr.append(td);
                $chkinput.ejCheckBox({ checked: true, enabled: false });
                table.append(tr);

            }
            $content.append(table);
            $("#" + tabId + "_" + "Blanks").ejRadioButton("option", { checked: true });
        },

        _renderPvtDialog: function () {
            var xlObj = this.XLObj;
            if ($("#" + xlObj._id + "_Ribbon_PvtDiv").length < 1) {
                var $pvtDiv, $label, $table, $tr, $td, input;
                $pvtDiv = ej.buildTag("div.e-dlgctndiv", "", {}, { id: xlObj._id + "_Ribbon_PvtDiv" });
                $table = ej.buildTag("table", "", {}, { "cellpadding": 0, "cellspacing": 0 });
                $tr = ej.buildTag("tr.e-ss-changerange");
                $td = ej.buildTag("td", "");
                $label = ej.buildTag("label", xlObj._getLocStr("Range"));
                $td.append($label);
                $tr.append($td);
                $td = ej.buildTag("td", "");
                input = ej.buildTag("input.ejinputtext", "", {}, { id: xlObj._id + "_Ribbon_PvtRange", type: "text" });
                input.data("parentID", xlObj._id);
                $tr.append($td.append(input));
                $table.append($tr);

                $tr = ej.buildTag("tr.e-ss-movepvttbl");
                $td = ej.buildTag("td");
                $label = ej.buildTag("label", xlObj._getLocStr("ChoosePivotTable"));
                $td.append($label);
                $td.attr("colspan", 2);
                $table.append($tr.append($td));

                $tr = ej.buildTag("tr.e-ss-movepvttbl");
                $td = ej.buildTag("td");
                $td.attr("colspan", 2);
                input = ej.buildTag("input#" + xlObj._id + "_dlg_newsheet", "", {}, { type: "radio", name: "sheet" });
                $td.append(input);
                $label = ej.buildTag("label", " " + xlObj._getLocStr("NewWorksheet"));
                $td.append($label);
                $table.append($tr.append($td));
                input.ejRadioButton({ size: "medium", checked: true, change: $.proxy(this._rBtnPvtOnClick, this, "new") });

                $tr = ej.buildTag("tr.e-ss-movepvttbl");
                $td = ej.buildTag("td");
                $td.attr("colspan", 2);
                input = ej.buildTag("input#" + xlObj._id + "_dlg_existsheet", "", {}, { type: "radio", name: "sheet" });
                $td.append(input);
                $label = ej.buildTag("label", " " + xlObj._getLocStr("ExistingWorksheet"));
                $td.append($label);
                $table.append($tr.append($td));
                input.ejRadioButton({ size: "medium", change: $.proxy(this._rBtnPvtOnClick, this, "existing") });

                $tr = ej.buildTag("tr.e-ss-movepvttbl");
                $td = ej.buildTag("td");
                $label = ej.buildTag("label", xlObj._getLocStr("Location"));
                $td.append($label);
                $tr.append($td);
                $td = ej.buildTag("td");
                input = ej.buildTag("input.ejinputtext", "", {}, { id: xlObj._id + "_Ribbon_PvtLocation", type: "text" });
                input.data("parentID", xlObj._id);
                $tr.append($td.append(input));
                $table.append($tr);

                $("#" + xlObj._id + "_Pivot").append($pvtDiv.append($table));
                $("#" + xlObj._id + "_Ribbon_PvtLocation").wrap("<form id='" + xlObj._id + "_Form_Ribbon_PvtLocation' onsubmit='return false'></form>").prop("disabled", true);
                this._dialogValidate("_Ribbon_PvtLocation");
                $("#" + xlObj._id + "_Ribbon_PvtRange").wrap("<form id='" + xlObj._id + "_Form_Ribbon_PvtRange' onsubmit='return false'></form>");
                this._dialogValidate("_Ribbon_PvtRange");
            }
        },

        _dlgPvtOk: function () {
            var xlObj = this.XLObj, dlg = $("#" + xlObj._id + "_PvtDialog");
            if ($("#" + xlObj._id + "_Form_Ribbon_PvtRange").valid() && $("#" + xlObj._id + "_Form_Ribbon_PvtLocation").valid()) {
                var error = xlObj.XLPivot._checkRange($("#" + xlObj._id + "_Ribbon_PvtRange").val(), $("#" + xlObj._id + "_Ribbon_PvtLocation").val());
                if (error.isRows)
                    xlObj._showAlertDlg("Alert", "PivotRowsAlert", "", 450);
                else if (error.isHeader)
                    xlObj._showAlertDlg("Alert", "PivotLabelsAlert", "", 550);
                else if (error.isOverlap)
                    xlObj._showAlertDlg("Alert", "PivotOverlapAlert", "", 450);
                else {
                    $("#" + xlObj._id + "_PvtDialog").ejDialog("close");
                    if (dlg.find(".e-ss-changerange:visible").length && dlg.find(".e-ss-movepvttbl:visible").length)
                        xlObj.XLPivot.createPivotTable($("#" + xlObj._id + "_Ribbon_PvtRange").val(), $("#" + xlObj._id + "_Ribbon_PvtLocation").val(), null);
                    else if (dlg.find(".e-ss-changerange:visible").length)
                        xlObj.XLPivot._changeDataSource();
                    else
                        xlObj.XLPivot._movePivotTable();
                }
            }
        },

        _dlgPvtCancel: function () {
            var xlObj = this.XLObj;
            $("#" + xlObj._id + "_PvtDialog").ejDialog("close");
            xlObj._setSheetFocus();
        },

        _rBtnPvtOnClick: function (id, e) {
            var xlObj = this.XLObj, newId = $("#" + xlObj._id + "_Ribbon_PvtRange"), existingId = $("#" + xlObj._id + "_Ribbon_PvtLocation");
            existingId.prop("disabled", id === "new");
            if (id === "new") {
                newId.focus().setInputPos(newId.val().length);
                $('#' + this.XLObj._id + '_Form_Ribbon_PvtLocation').validate().resetForm();
            }
            else
                existingId.setInputPos(existingId.val().length);
        },

        _rBtnOnClick: function (id, e) {
            var xlObj = this.XLObj, i;
            if (id === "Formulas" || id === "Constants") {
                for (i = 0; i < this._gotoChkBox.length; i++)
                    $("#" + xlObj._id + "_" + this._gotoChkBox[i]).data("ejCheckBox").option({ enabled: true });
            }
            else {
                for (i = 0; i < this._gotoChkBox.length; i++)
                    $("#" + xlObj._id + "_" + this._gotoChkBox[i]).data("ejCheckBox").option({ enabled: false });
            }
        },

        _gotoValChange: function (args) {
            $("#" + this.XLObj._id + "_textRef").val(args.model.value);
        },

        _getAddrFromDollarAddr: function (value) {
            var sIdx, splitStr
            if (value.indexOf("!") > -1) {
                splitStr = value.split("!");
                sIdx = this.XLObj._getSheetIndexByName(splitStr[0]);
                value = splitStr[1];
            }
            value.indexOf("$") > -1 && (value = value.split("$").join(""));
            value.indexOf(":") < 0 && (value = value + ":" + value);
            value = value.replace("=", "");
            return [sIdx, value];
        },

        _gotoBtnClick: function (id, e) {
            var xlObj = this.XLObj;
            switch (id) {
                case "ok":
                    if ($('#' + xlObj._id + '_Form_GoToDiv').valid()) {
                        var tabObj = $("#" + xlObj._id + "_GoToDlgTab").data("ejTab");
                        if (!tabObj.model.selectedItemIndex)
                            xlObj.XLSearch.goTo($.trim($("#" + xlObj._id + "_textRef").val().toString()));
                        else
                            xlObj.XLSearch._applyGoToRule($("#" + xlObj._id + "_GoToSpDiv").find(".e-circle_01").parents("div")[0].id.split("ej" + xlObj._id + "_gotoSpDiv_")[1].toLowerCase(), $("#" + xlObj._id + "_" + this._gotoChkBox[0]).data("ejCheckBox").isChecked(), $("#" + xlObj._id + "_" + this._gotoChkBox[1]).data("ejCheckBox").isChecked(), $("#" + xlObj._id + "_" + this._gotoChkBox[2]).data("ejCheckBox").isChecked(), $("#" + xlObj._id + "_" + this._gotoChkBox[3]).data("ejCheckBox").isChecked());
                        $("#" + xlObj._id + "_GoDialog").ejDialog("close");
                    }
                    break;
                case "cancel":
                    if ($.validator)
                        $('#' + xlObj._id + '_Form_GoToDiv').validate().resetForm();
                    $("#" + xlObj._id + "_GoDialog").ejDialog("close");
                    break;
            }
            xlObj._setSheetFocus();
        },

        _borderPicture: function () {
            var xlObj = this.XLObj;
            return "<ul id=" + xlObj._id + "_Ribbon_PictureBorder style='display:none' class='e-ss-pictureborder'><li id='" + xlObj._id + "picturecolor'><a>" + xlObj._getLocStr("ThemeColor") + "</a><ul><li><input id='" + xlObj._id + "_Ribbon_PictureColor'></input></li></ul></li><li id='nooutline' class='picturecolor'><a>" + xlObj._getLocStr("NoOutline") + "</a></li><li id='weight' class='picturecolor'><a>" + xlObj._getLocStr("Weight") + "</a><ul><li id='1px'><a>1px</a></li><li id='2px'><a>2px</a></li><li id='3px'><a>3px</a></li></ul></li><li id='dashes' class='picturecolor'><a>" + xlObj._getLocStr("Dashes") + "</a><ul><li id='solid'><a><div style='border:2px solid black'></div></a></li><li id='dotted'><a><div style='border:2px dotted black'></div></a></li><li id='dashed'><a><div style='border:2px dashed black'></div></a></li></ul></li></ul>";
        },
        _chartElementTag: function () {
            var xlObj = this.XLObj, element = '<ul id=' + xlObj._id + '_Ribbon_CElement class="e-spreadsheet" style="display:none">';
            element += '<li class="axes" id="Axes"><a><span class="e-ss-chartimg e-icon e-ss-axes"></span>' + xlObj._getLocStr("Axes") + '</a><ul><li class="phaxis e-ss-cmenuitem" id="PHAxis"><a class="e-ss-chartlayout"><span class="e-ss-chartimg e-icon e-ss-phaxis"></span>' + xlObj._getLocStr("PHAxis") + '</a></li><li class="pvaxis e-ss-cmenuitem" id="PVAxis"><a class="e-ss-chartlayout"><span class="e-ss-chartimg e-icon e-ss-pvaxis"></span>' + xlObj._getLocStr("PVAxis") + '</a></li></ul></li>';
            element += '<li class="axistitle" id="AxisTitle"><a><span class="e-ss-chartimg e-icon e-ss-axistitle"></span>' + xlObj._getLocStr("AxisTitle") + '</a><ul><li class="phaxistitle e-ss-cmenuitem" id="PHAxisTitle"><a class="e-ss-chartlayout"><span class="e-ss-chartimg e-icon e-ss-phaxistitle"></span>' + xlObj._getLocStr("PHAxis") + '</a></li><li class="pvaxistitle e-ss-cmenuitem" id="PVAxisTitle"><a class="e-ss-chartlayout"><span class="e-ss-chartimg e-icon e-ss-pvaxistitle"></span>' + xlObj._getLocStr("PVAxis") + '</a></li></ul></li>';
            element += '<li class="charttitle" id="ChartTitle"><a><span class="e-ss-chartimg e-icon e-ss-charttitle"></span>' + xlObj._getLocStr("ChartTitle") + '</a><ul><li class="ctnone e-ss-cmenuitem" id="CTNone"><a class="e-ss-chartlayout"><span class="e-ss-chartimg e-icon e-ss-ctnone"></span>' + xlObj._getLocStr("CTNone") + '</a></li><li class="ctcenter e-ss-cmenuitem" id="CTCenter"><a class="e-ss-chartlayout"><span class="e-ss-chartimg e-icon e-ss-ctcenter"></span>' + xlObj._getLocStr("CTCenter") + '</a></li><li class="ctfar e-ss-cmenuitem" id="CTFar"><a class="e-ss-chartlayout"><span class="e-ss-chartimg e-icon e-ss-ctfar"></span>' + xlObj._getLocStr("CTFar") + '</a></li><li class="ctnear e-ss-cmenuitem" id="CTNear"><a class="e-ss-chartlayout"><span class="e-ss-chartimg e-icon e-ss-ctnear"></span>' + xlObj._getLocStr("CTNear") + '</a></li></ul></li>';
            element += '<li class="datalabels" id="DataLabels"><a><span class="e-ss-chartimg e-icon e-ss-datalabels"></span>' + xlObj._getLocStr("DataLabels") + '</a><ul><li class="dlnone e-ss-cmenuitem" id="DLNone"><a class="e-ss-chartlayout"><span class="e-ss-chartimg e-icon e-ss-dlnone"></span>' + xlObj._getLocStr("DLNone") + '</a></li><li class="dlcenter e-ss-cmenuitem" id="DLCenter"><a class="e-ss-chartlayout"><span class="e-ss-chartimg e-icon e-ss-dlcenter"></span>' + xlObj._getLocStr("DLCenter") + '</a></li><li class="dliend e-ss-cmenuitem" id="DLIEnd"><a class="e-ss-chartlayout"><span class="e-ss-chartimg e-icon e-ss-dliend"></span>' + xlObj._getLocStr("DLIEnd") + '</a></li><li class="dlibase e-ss-cmenuitem" id="DLIBase"><a class="e-ss-chartlayout"><span class="e-ss-chartimg e-icon e-ss-dlibase"></span>' + xlObj._getLocStr("DLIBase") + '</a></li><li class="dloend e-ss-cmenuitem" id="DLOEnd"><a class="e-ss-chartlayout"><span class="e-ss-chartimg e-icon e-ss-dloend"></span>' + xlObj._getLocStr("DLOEnd") + '</a></li></ul></li>';
            element += '<li class="gridline" id="Gridline"><a><span class="e-ss-chartimg e-icon e-ss-gridline"></span>' + xlObj._getLocStr("Gridline") + '</a><ul><li class="pmajorh e-ss-cmenuitem" id="PMajorH"><a class="e-ss-chartlayout"><span class="e-ss-chartimg e-icon e-ss-pmajorh"></span>' + xlObj._getLocStr("PMajorH") + '</a></li><li class="pmajorv e-ss-cmenuitem" id="PMajorV"><a class="e-ss-chartlayout"><span class="e-ss-chartimg e-icon e-ss-pmajorv"></span>' + xlObj._getLocStr("PMajorV") + '</a></li><li class="pminorh e-ss-cmenuitem" id="PMinorH"><a class="e-ss-chartlayout"><span class="e-ss-chartimg e-icon  e-ss-pminorh"></span>' + xlObj._getLocStr("PMinorH") + '</a></li><li class="pminorv e-ss-cmenuitem" id="PMinorV"><a class="e-ss-chartlayout"><span class="e-ss-chartimg e-icon e-ss-pminorv"></span>' + xlObj._getLocStr("PMinorV") + '</a></li></ul></li>';
            element += '<li class="legend" id="Legend"><a><span class="e-ss-chartimg e-icon e-ss-legend"></span>' + xlObj._getLocStr("Legend") + '</a><ul><li class="lnone e-ss-cmenuitem" id="LNone"><a class="e-ss-chartlayout"><span class="e-ss-chartimg e-icon e-ss-lnone"></span>' + xlObj._getLocStr("LNone") + '</a></li><li class="lright e-ss-cmenuitem" id="LRight"><a class="e-ss-chartlayout"><span class="e-ss-chartimg e-icon e-ss-lright"></span>' + xlObj._getLocStr("LRight") + '</a></li><li class="lleft e-ss-cmenuitem" id="LLeft"><a class="e-ss-chartlayout"><span class="e-ss-chartimg e-icon e-ss-lleft"></span>' + xlObj._getLocStr("LLeft") + '</a></li><li class="lbottom e-ss-cmenuitem" id="LBottom"><a class="e-ss-chartlayout"><span class="e-ss-chartimg e-icon e-ss-lbottom"></span>' + xlObj._getLocStr("LBottom") + '</a></li><li class="ltop e-ss-cmenuitem" id="LTop"><a class="e-ss-chartlayout"><span class="e-ss-chartimg e-icon e-ss-ltop"></span>' + xlObj._getLocStr("LTop") + '</a></li></ul></li>';
            return element;
        },

        _cpClickHandler: function (name, args) {
            var xlObj = this.XLObj;
            if (name === "Ribbon_Home_Font_FillColor")
                xlObj.XLFormat.format({ "style": { "background-color": $("#" + xlObj._id + "_Ribbon_Home_Font_FillColor").ejColorPicker('option', 'value') } });
            else if (name === "Ribbon_Home_Font_FontColor")
                xlObj.XLFormat.format({ "style": { "color": $("#" + xlObj._id + "_Ribbon_Home_Font_FontColor").ejColorPicker('option', 'value') } });
            xlObj._setSheetFocus();
        },

        _ribbonClickHandler: function (args) {
            var i, cfObj, cid, hexcode, gotoTabObj, cellRange, curProp, startCell, endCell, info, details, elem, element, cname, selectedIndex, activeCell, fsObj, tid, tmgr, range, obj = {}, xlObj = $("#" + this._id.split("_Ribbon")[0]).data("ejSpreadsheet"), sheetIdx = xlObj.getActiveSheetIndex(), sheet = xlObj.getSheet(sheetIdx), temp = {}, style = {}, splitId = this._id.split("_"), sstyles = ej.Spreadsheet.SupportedStyles, size, arg, sheetCont, sheetPanel, dataVal, selCells = sheet._selectedCells;
            if (xlObj._shapeChange || xlObj.XLRibbon._isSetModel)
                return;
            xlObj._isRibbonClick = true;
            sheetCont = xlObj._getJSSheetContent(sheetIdx).find(".e-spreadsheetcontentcontainer > .e-content"), sheetPanel = xlObj.getMainPanel();
            cfObj = $("#" + xlObj._id + "_Ribbon_Home_Number_NumberFormat").data("ejDropDownList");
            fsObj = $("#" + xlObj._id + "_Ribbon_Home_Font_FontSize").data("ejDropDownList");
            activeCell = $(xlObj.getCell(sheet._activeCell.rowIndex, sheet._activeCell.colIndex));
            if (xlObj.model.allowSelection && ((xlObj.model.allowFormatAsTable && xlObj.model.allowCellFormatting))) {
                if ((xlObj.XLFormat._formatEnable || xlObj.XLSelection._isOutsideBordering || xlObj.XLSelection._isGridBordering)) {
                    if (xlObj._id + "_Ribbon_Home_Font_BorderColor" !== this._id && xlObj._id + "_Ribbon_bordercolor" !== args.ID && !(xlObj._borderStyles.indexOf(args.ID) > -1)) {
                        xlObj.XLSelection._isGridBordering = xlObj.XLSelection._isOutsideBordering = xlObj.XLFormat._formatEnable = false;
                        $("#" + xlObj._id + "_Ribbon_Home_Clipboard_FormatPainter").ejToggleButton("option", { toggleState: false });
                        if ((args.type === "itemSelected" || args.type === "click") && !xlObj.isUndefined(args.model.prefixIcon) && (args.model.prefixIcon.split("e-ss-")[1] === args.ID || (args.model.prefixIcon.indexOf("e-ss-drawborder") > -1 || args.model.prefixIcon.indexOf("e-ss-drawbordergrid") > -1)))
                            xlObj.XLSelection._isGridBordering = xlObj.XLSelection._isOutsideBordering = true;
                        sheetCont.addClass("e-ss-cursor");
                        sheetCont.removeClass("e-ss-drwbrdrcursor e-ss-drwbrdrgridcursor e-ss-fpcursor");
                        xlObj.XLSelection._cleanUp(true);
                    }
                }
            }
            arg = { Id: this._id, isChecked: args.isChecked, status: args.status, prop: args.model, model: xlObj.model };
            if (xlObj._trigger("ribbonClick", arg)) {
                if (xlObj.model.showRibbon)
                    xlObj.XLRibbon._updateRibbonIcons();
                return false;
            }
            if (!ej.isNullOrUndefined(xlObj._getAutoFillOptElem()) && xlObj.model.autoFillSettings.showFillOptions) {
                xlObj._getAutoFillOptElem().addClass("e-hide");
                $("#" + xlObj._id + "_ctxtmenu").hide();
            }
            switch (this._id) {
                case xlObj._id + "_Ribbon_Home_Clipboard_Cut":
                    xlObj.XLClipboard.cut();
                    break;
                case xlObj._id + "_Ribbon_Home_Clipboard_Copy":
                    xlObj.XLClipboard.copy();
                    break;
                case xlObj._id + "_Ribbon_Home_Clipboard_Paste":
                case xlObj._id + "_Ribbon_Home_Clipboard_PasteOptions":
                    xlObj.XLClipboard._isSpecial = !(args.ID === "PasteValues");
                    xlObj.XLClipboard.paste();
                    break;
                case xlObj._id + "_Ribbon_Home_Actions_Undo":
                    xlObj.XLClipboard._triggerKeyDown(90, true);
                    break;
                case xlObj._id + "_Ribbon_Home_Actions_Redo":
                    xlObj.XLClipboard._triggerKeyDown(89, true);
                    break;
                case xlObj._id + "_Ribbon_Home_Alignment_WrapText":
                    xlObj._textFormatting("wrapText");
                    break;
                case xlObj._id + "_Ribbon_PageLayout_Print_Print":
                    xlObj.XLPrint.printSheet(sheetIdx);
                    break;
                case xlObj._id + "_Ribbon_PageLayout_Print_PrintSelected":
                    xlObj.XLPrint.printSelection(sheetIdx);
                    break;
                case xlObj._id + "_Ribbon_new":
                    xlObj._cellFormatHandler(this._id.replace(xlObj._id + "_Ribbon_", ""), args.selectedText);
                    break;
                case xlObj._id + "_Ribbon_Home_Font_Bold":
                    style[sstyles.FontWeight] = args.model.toggleState ? "bold" : "normal";
                    temp["style"] = style;
                    xlObj.XLFormat.format(temp);
                    break;
                case xlObj._id + "_Ribbon_Home_Font_Italic":
                    style[sstyles.FontStyle] = args.model.toggleState ? "italic" : "normal";
                    temp["style"] = style;
                    xlObj.XLFormat.format(temp);
                    break;
                case xlObj._id + "_Ribbon_Home_Font_Underline":
                case xlObj._id + "_Ribbon_Home_Font_StrikeThrough":
                    var txtDStyle = xlObj.XLFormat.getFormatFromHashCode(xlObj.XLFormat.getFormatClass(activeCell[0].className))["text-decoration"] || "";
                    if (splitId.indexOf("StrikeThrough") > -1)
                        splitId[splitId.indexOf("StrikeThrough")] = "line-through";
                    else if (splitId.indexOf("Underline") > -1)
                        splitId[splitId.indexOf("Underline")] = "underline";
                    if (args.model.toggleState) {
                        txtDStyle = txtDStyle.replace("none", "");
                        if (txtDStyle) {
                            if (txtDStyle.indexOf("underline") < 0)
                                style[sstyles.TextDecoration] = txtDStyle + " " + splitId[splitId.length - 1];
                            else
                                style[sstyles.TextDecoration] = splitId[splitId.length - 1] + " " + txtDStyle;
                        }
                        else
                            style[sstyles.TextDecoration] = splitId[splitId.length - 1];
                    }
                    else {
                        txtDStyle = $.trim(txtDStyle.replace(splitId[splitId.length - 1], ""));
                        style[sstyles.TextDecoration] = txtDStyle.length ? txtDStyle : "none";
                    }
                    temp["style"] = style;
                    xlObj.XLFormat.format(temp);
                    break;
                case xlObj._id + "_Ribbon_Home_Font_FontSize":
                    style[sstyles.FontSize] = args.value;
                    temp["style"] = style;
                    xlObj.XLFormat.format(temp);
                    break;
                case xlObj._id + "_Ribbon_Home_Font_IncreaseFontSize":
                case xlObj._id + "_Ribbon_Home_Font_DecreaseFontSize":
                    if (this._id == xlObj._id + "_Ribbon_Home_Font_IncreaseFontSize") {
                        selectedIndex = !ej.isNullOrUndefined(fsObj.selectedIndexValue) ? fsObj.selectedIndexValue + 1 : 6; //6-default increase fonsize index
                        !ej.isNullOrUndefined(xlObj.XLRibbon._fontSize[selectedIndex]) && fsObj.option({ selectedItemIndex: selectedIndex });
                    }
                    else if (this._id == xlObj._id + "_Ribbon_Home_Font_DecreaseFontSize") {
                        selectedIndex = !ej.isNullOrUndefined(fsObj.selectedIndexValue) ? fsObj.selectedIndexValue - 1 : 4; //6-default decrease fonsize index
                        !ej.isNullOrUndefined(xlObj.XLRibbon._fontSize[selectedIndex]) && fsObj.option({ selectedItemIndex: selectedIndex });
                    }
                    break;
                case xlObj._id + "_Ribbon_Home_Alignment_AlignLeft":
                case xlObj._id + "_Ribbon_Home_Alignment_AlignRight":
                case xlObj._id + "_Ribbon_Home_Alignment_AlignCenter":
                    element = $(this.element.parents("div").eq(1)).find(".e-text-align");
                    if (!ej.isNullOrUndefined(element[0])) {
                        $("#" + element[0].id).ejToggleButton("option", "toggleState", false);
                        element.removeClass("e-text-align");
                        (element[0].id != this.element[0].id) && this.element.addClass("e-text-align");
                    }
                    else
                        this.element.addClass("e-text-align");
                    style[sstyles.TextAlign] = args.model.toggleState ? splitId[splitId.length - 1].split("Align")[1] : "left";
                    temp["style"] = style;
                    xlObj.XLFormat.format(temp);
                    break;
                case xlObj._id + "_Ribbon_Home_Alignment_DecreaseIndent":
                case xlObj._id + "_Ribbon_Home_Alignment_IncreaseIndent":
                    var cellStyle, i, len, rightCnt = 0, size, isRightAlign = false, cellIndex;
                    if (selCells.length < 2) {
                        cellIndex = xlObj.getActiveCell();
                        cellStyle = xlObj.XLFormat.getFormatFromHashCode(xlObj.XLFormat.getFormatClass(xlObj.getCell(cellIndex.rowIndex, cellIndex.colIndex)[0].className));
                        size = (sstyles.TextIndent in cellStyle ? (this._id === xlObj._id + "_Ribbon_Home_Alignment_IncreaseIndent" ? Number(cellStyle[sstyles.TextIndent].replace("pt", "")) + 6 : Number(cellStyle[sstyles.TextIndent].replace("pt", "")) - 6) : (this._id === xlObj._id + "_Ribbon_Home_Alignment_DecreaseIndent" ? -6 : 6));
                        xlObj.XLRibbon._applyTextIndent(cellIndex, cellStyle, size, this);
                    }
                    else {
                        for (i = 0, len = selCells.length; i < len; i++) {
                            cellStyle = xlObj.XLFormat.getFormatFromHashCode(xlObj.XLFormat.getFormatClass(xlObj.getCell(selCells[i].rowIndex, selCells[i].colIndex)[0].className));
                            if (cellStyle[sstyles.TextAlign] == "right")
                                rightCnt++;
                        }
                        if (rightCnt === selCells.length)
                            isRightAlign = true;
                        for (i = 0, len = selCells.length; i < len; i++) {
                            cellStyle = xlObj.XLFormat.getFormatFromHashCode(xlObj.XLFormat.getFormatClass(xlObj.getCell(selCells[i].rowIndex, selCells[i].colIndex)[0].className));
                            if (!isRightAlign)
                                cellStyle[sstyles.TextAlign] = "left";
                            size = (sstyles.TextIndent in cellStyle ? (this._id === xlObj._id + "_Ribbon_Home_Alignment_IncreaseIndent" ? Number(cellStyle[sstyles.TextIndent].replace("pt", "")) + 6 : Number(cellStyle[sstyles.TextIndent].replace("pt", "")) - 6) : (this._id === xlObj._id + "_Ribbon_Home_Alignment_DecreaseIndent" ? -6 : 6));
                            xlObj.XLRibbon._applyTextIndent(selCells[i], cellStyle, size, this);
                        }
                    }
                    xlObj.XLSelection.refreshSelection();
                    xlObj.XLDragFill && xlObj.XLDragFill.positionAutoFillElement();
                    break;
                case xlObj._id + "_Ribbon_Home_Alignment_TopAlign":
                case xlObj._id + "_Ribbon_Home_Alignment_MiddleAlign":
                case xlObj._id + "_Ribbon_Home_Alignment_BottomAlign":
                    element = $(this.element.parents("div").eq(1)).find(".e-vertical-align");
                    if (!ej.isNullOrUndefined(element[0])) {
                        $("#" + element[0].id).ejToggleButton("option", "toggleState", false);
                        element.removeClass("e-vertical-align");
                        (element[0].id != this.element[0].id) && this.element.addClass("e-vertical-align");
                    }
                    else
                        this.element.addClass("e-vertical-align");
                    style[sstyles.VerticalAlign] = args.model.toggleState ? splitId[splitId.length - 1].split("Align")[0] : "bottom";
                    temp["style"] = style;
                    xlObj.XLFormat.format(temp);
                    break;
                case xlObj._id + "_Ribbon_Home_Font_FontFamily":
                    style[sstyles.FontFamily] = args.text;
                    temp["style"] = style;
                    xlObj.XLFormat.format(temp);
                    break;
                case xlObj._id + "_Ribbon_PageLayout_Show_Headings":
                    xlObj.showHeadings(args.isChecked);
                    break;
                case xlObj._id + "_Ribbon_PageLayout_Show_Gridlines":
                    xlObj.showGridlines(args.isChecked);
                    break;
                case xlObj._id + "_Ribbon_PageLayout_PageLayout_PageSize":
                case xlObj._id + "_Ribbon_PageLayout_PageLayout_PageSizeOptions":
                    var value = !ej.isNullOrUndefined(args.ID) ? args.ID : args.model.prefixIcon.substring(12);
                    xlObj.XLPrint._printSetting(value);
                    break;
                case xlObj._id + "_Ribbon_Home_Number_NumberFormat":
                    temp["type"] = args.value.toLowerCase();
                    if (temp.type !== "custom")
                        xlObj.XLFormat.format(temp);
                    else
                        xlObj._showDialog(xlObj._id + "_FormatCells");
                    break;
                case xlObj._id + "_Ribbon_Home_Number_IncreaseDecimal":
                case xlObj._id + "_Ribbon_Home_Number_DecreaseDecimal":
                    if (activeCell.data("type") != "number" && $.isNumeric(xlObj.XLEdit.getPropertyValueByElem(activeCell))) {
                        xlObj.XLRibbon._isSetModel = true;
                        cfObj.option({ selectedItemIndex: 1 }); //number type
                        xlObj.XLRibbon._isSetModel = false;
                    }
                    xlObj.XLFormat.updateDecimalPlaces(splitId[splitId.length - 1]);
                    break;
                case xlObj._id + "_Ribbon_Home_Number_Accounting":
                case xlObj._id + "_Ribbon_Home_Number_Percentage":
                    this._id === xlObj._id + "_Ribbon_Home_Number_Accounting" ? cfObj.option({ selectedItemIndex: 3 }) : cfObj.option({ selectedItemIndex: 4 });
                    temp["type"] = cfObj.model.value.toLowerCase();
                    break;
                case xlObj._id + "_Ribbon_Home_Number_CommaStyle":
                    cfObj.option({ selectedItemIndex: 1 });
                    temp["type"] = cfObj.model.value.toLowerCase();
                    break;
                case xlObj._id + "_Ribbon_Data_SortFilter_SortAtoZ":
                    xlObj.XLSort._sortHandler("SortAtoZ");
                    break;
                case xlObj._id + "_Ribbon_Data_SortFilter_SortZtoA":
                    xlObj.XLSort._sortHandler("SortZtoA");
                    break;
                case xlObj._id + "_Ribbon_Data_SortFilter_Filter":
                    xlObj.XLFilter.filter();
                    break;
                case xlObj._id + "_Ribbon_Data_SortFilter_ClearFilter":
                    cname = xlObj.XLEdit.getPropertyValue(xlObj.getActiveCell().rowIndex, xlObj.getActiveCell().colIndex, "tableName");
                    if (ej.isNullOrUndefined(cname))
                        xlObj.XLFilter.clearFilter();
                    else {
                        tid = xlObj._getTableID(cname);
                        xlObj.XLFilter._clearFilterTable(xlObj.getActiveSheetIndex(), tid, true);
                    }
                    break;
                case xlObj._id + "_Ribbon_Home_Font_BorderColor":
                    obj = $('#' + xlObj._id + '_Ribbon_BorderColor').data('ejColorPicker');
                    !ej.isNullOrUndefined(obj) && (obj.hide());
                    !ej.isNullOrUndefined(args.value) && (xlObj._borderColor = args.value);
                    break;
                case xlObj._id + "_Ribbon_Home_Font_Border":
                    var alphRange;
                    if ((xlObj._borderStyles.indexOf(args.ID) < 0)) {
                        if (ej.isNullOrUndefined(args.ID))
                            args.ID = args.model.prefixIcon.substring(12);
                        else
                            args.ID.indexOf("bordercolor") < 0 && $(this.element).find(".e-icon ").removeClass().addClass("e-icon e-ss-" + args.ID) && this.option({ prefixIcon: "e-icon e-ss-" + args.ID });
                    }
                    else
                        xlObj.XLRibbon._updateBordeStyle(args);
                    hexcode = xlObj._borderColor || '#000000';
                    startCell = sheet._startCell;
                    endCell = sheet._endCell;
                    alphRange = xlObj._getAlphaRange(sheetIdx, startCell.rowIndex, startCell.colIndex, endCell.rowIndex, endCell.colIndex);
                    if (xlObj.model.allowSelection && (xlObj.XLSelection._isOutsideBordering || xlObj.XLSelection._isGridBordering))
                        !(xlObj._borderStyles.indexOf(args.ID) > -1) && (args.ID.indexOf("bordercolor") < 0) && (xlObj.XLSelection._isOutsideBordering = xlObj.XLSelection._isGridBordering = false);
                    else
                        xlObj.setBorder({ "type": args.ID, "color": hexcode, "style": xlObj._borderStyle }, alphRange);
                    break;
                case xlObj._id + "_Ribbon_Data_DataTools_DataValidation":
                case xlObj._id + "_Ribbon_Data_DataTools_DataValidationOptions":
                    xlObj._showDialog(this._id);
                    if (args.ID == "ClearVal")
                        xlObj.XLValidate.clearDV();
                    else if (args.ID == "HighlightVal")
                        xlObj.XLValidate.highlightInvalidData();
                    else if (args.ID == "ClearHLVal")
                        xlObj.XLValidate.clearHighlightedValData();
                    else {
                        var sheet = xlObj.getSheet(sheetIdx), selected = sheet._selectedCells, i, len = selected.length, value = [], item;
                        for (i = 0; i < len; i++) {
                            var rle = xlObj.XLEdit.getPropertyValue(selected[i].rowIndex, selected[i].colIndex, "rule");
                            if (rle) {
                                item = xlObj._dataContainer.sheets[sheetIdx][selected[i].rowIndex][selected[i].colIndex].rule.customVal;
                                if (value.indexOf(item) == -1) {
                                    value.push(item);
                                }
                            }
                        }
                        if (value.length > 0)
                            xlObj._showAlertDlg("", "MoreValidationAlert", "OpenValDlg", 400, 130);
                        else {
                            $("#" + xlObj._id + "_ValDialog").ejDialog("open");
                            if ($.validator)
                                $("#" + xlObj._id + "_Form_ValDialog").validate().resetForm();
                            $("#" + xlObj._id + "_Ribbon_ddType_wrapper").focus();
                            var rules = xlObj.XLEdit.getPropertyValueByElem(xlObj.getActiveCellElem(sheetIdx), "rule");
                            if (rules) {
                                var rule = rules.customVal, splitStr = rule.split("_");
                                if (rule.indexOf("list") > -1) {
                                    $("#" + xlObj._id + "_Ribbon_ddType").ejDropDownList('option', 'selectedItemIndex', 5);
                                    $("#" + xlObj._id + "_Ribbon_btnMin").val(splitStr[0]);
                                }
                                else {
                                    var index;
                                    xlObj.XLRibbon._types.some(function (element, i) { if (splitStr[4] === element.value) { index = i; return true; } });
                                    $("#" + xlObj._id + "_Ribbon_ddType").ejDropDownList('option', 'selectedItemIndex', index);
                                    xlObj.XLRibbon._actions.some(function (element, i) { if (splitStr[0] === element.value) { index = i; return true; } });
                                    $("#" + xlObj._id + "_Ribbon_ddAction").ejDropDownList('option', 'selectedItemIndex', index);
                                    $("#" + xlObj._id + "_Ribbon_btnMin").val(splitStr[1].replace("^", ""));
                                    $("#" + xlObj._id + "_Ribbon_btnMax").val(splitStr[2].replace("^", ""));
                                }
                                $("#" + xlObj._id + "_Ribbon_blank").ejCheckBox("option", "checked", !rules.required);
                                $("#" + xlObj._id + "_Ribbon_freetext").ejCheckBox("option", "checked", JSON.parse(splitStr[splitStr.length - 3]));
                            }
                            else {
                                $("#" + xlObj._id + "_Ribbon_ddType").ejDropDownList('option', 'selectedItemIndex', 1);
                                $("#" + xlObj._id + "_Ribbon_ddAction").ejDropDownList('option', 'selectedItemIndex', 6);
                                $("#" + xlObj._id + "_Ribbon_btnMin").val("");
                                $("#" + xlObj._id + "_Ribbon_btnMax").val("");
                                $("#" + xlObj._id + "_Ribbon_blank").ejCheckBox("option", "checked", true);
                                $("#" + xlObj._id + "_Ribbon_freetext").ejCheckBox("option", "checked", true);
                            }
                        }
                    }
                    break;
                case xlObj._id + "_Ribbon_Home_Styles_ConditionalFormatting":
                    if (!args.ID.length)
                        break;
                    xlObj.XLRibbon._currentCFormat = args.ID;
                    if (args.ID.startsWith("clear"))
                        (args.ID === "clearselected") ? xlObj.XLCFormat.clearCF(xlObj.getSheet(sheetIdx).selectedRange) : xlObj.XLCFormat.clearCF();
                    else {
                        if (!(args.ID.indexOf("_HLCellRules") > 0 || args.ID.indexOf("_ClearRules") > 0 || args.ID.indexOf("_CreateRule") < -1)) {
                            xlObj._showDialog(this._id);
                            xlObj.XLRibbon._renderCFDialog(args);
                        }
                    }
                    break;
                case xlObj._id + "_Ribbon_Others_Editing_FindSelect":
                    var fRTabObj;
                    xlObj._showDialog(this._id);
                    gotoTabObj = $("#" + xlObj._id + "_GoToDlgTab").data("ejTab"), fRTabObj = $("#" + xlObj._id + "_FRDialog_FPDlgTab").data("ejTab");
                    switch (args.ID) {
                        case "Find":
                            (xlObj._responsiveHeight < 365) && $("#" + xlObj._id + "_FRDialog_wrapper").css('top', '0px');
                            $("#" + xlObj._id + "_FRDialog").ejDialog("open");
                            xlObj.XLRibbon._refreshFRDlg();
                            fRTabObj.option({ selectedItemIndex: 0 });
                            $("#" + xlObj._id + "_Ribbon_textFind").focus().setInputPos($("#" + xlObj._id + "_Ribbon_textFind").val().length);
                            if (xlObj.model.isReadOnly)
                                $("#" + xlObj._id + "_FRDialog_FPDlgTab").ejTab("option", { disabledItemIndex: [1, 2] });
                            else
                                $("#" + xlObj._id + "_FRDialog_FPDlgTab").ejTab("option", { enabledItemIndex: [1, 2] });
                            break;
                        case "Replace":
                            (xlObj._responsiveHeight < 365) && $("#" + xlObj._id + "_FRDialog_wrapper").css('top', '0px');
                            $("#" + xlObj._id + "_FRDialog").ejDialog("open");
                            xlObj.XLRibbon._refreshFRDlg();
                            fRTabObj.option({ selectedItemIndex: 1 });
                            $("#" + xlObj._id + "_Ribbon_textFind").focus().setInputPos($("#" + xlObj._id + "_Ribbon_textFind").val().length);
                            break;
                        case "GoTo":
                            $("#" + xlObj._id + "_GoDialog").ejDialog("open");
                            gotoTabObj.option({ selectedItemIndex: 0 });
                            $("#" + xlObj._id + "_textRef").focus().setInputPos($("#" + xlObj._id + "_Ribbon_textFind").val().length);
                            if ($.validator)
                                $('#' + xlObj._id + '_Form_GoToDiv').validate().resetForm();
                            break;
                        case "GoToSpecial":
                            $("#" + xlObj._id + "_GoDialog").ejDialog("open");
                            gotoTabObj.option({ selectedItemIndex: 1 });
                            $("#" + xlObj._id + "_Blanks").focus();
                            break;
                        default:
                            xlObj.XLSearch._applyGoToRule(args.ID.toLowerCase(), true, true, true, true);
                            break;
                    }
                    break;
                case xlObj._id + "_Ribbon_Others_CalCulation_CalculationOptions":
                    switch (args.ID) {
                        case xlObj._id + "_CalcAuto":
                            xlObj.XLEdit.calcOption(true);
                            break;
                        case xlObj._id + "_CalcManual":
                            xlObj.XLEdit.calcOption(false);
                            break;
                    }
                    break;
                case xlObj._id + "_Ribbon_Others_CalCulation_CalculateNow":
                    xlObj.XLEdit.calcNow();
                    break;
                case xlObj._id + "_Ribbon_Others_CalCulation_CalculateSheet":
                    xlObj.XLEdit.calcNow(xlObj.getActiveSheetIndex());
                    break;
                case xlObj._id + "_Ribbon_Home_Clipboard_FormatPainter":
                    if (!args.model.toggleState) {
                        xlObj.performSelection(xlObj.getActiveCell(), xlObj.getActiveCell());
                        return false;
                    }
                    xlObj.XLFormat._formatEnable = true;
                    sheetCont.removeClass("e-ss-cursor");
                    sheetCont.addClass("e-ss-fpcursor");
                    xlObj.XLFormat._formatPainter();
                    break;
                case xlObj._id + '_Ribbon_Design_Tools_ConvertToRange':
                    xlObj.XLFormat.convertToRange({ alert: true });
                    break;
                case xlObj._id + '_Ribbon_Design_Tools_ResizeTable':
                    tid = parseInt(document.getElementById(xlObj._id + '_tableid').value);
                    range = sheet.tableManager[tid].range;
                    xlObj._showDialog(xlObj._id + '_Ribbon_Design_Tools_ResizeTable')
                    $('#' + xlObj._id + '_fatresizetablerange').val(xlObj._getAlphaRange(sheetIdx, range[0], range[1], range[2], range[3]));
                    $('#' + xlObj._id + '_fatresizetabledlg').ejDialog('open');
                    break;
                case xlObj._id + '_Ribbon_Design_TableStyleOptions_FirstColumn':
                case xlObj._id + '_Ribbon_Design_TableStyleOptions_LastColumn':
                    if (this._id === xlObj._id + '_Ribbon_Design_TableStyleOptions_FirstColumn') {
                        xlObj.XLRibbon._isFirstColumn = true;
                        var tid = document.getElementById(xlObj._id + '_tableid').value;
                        range = sheet.tableManager[tid].range;
                        range = xlObj._getProperAlphaRange(sheetIdx, range[0] + 1, range[1], range[2], range[1]);
                        xlObj.XLRibbon._firstLastColumn(tid, sheetIdx);
                        curProp = "firstColumn";
                    }
                    else {
                        xlObj.XLRibbon._isFirstColumn = false;
                        var tid = document.getElementById(xlObj._id + '_tableid').value;
                        range = sheet.tableManager[tid].range;
                        range = xlObj._getProperAlphaRange(sheetIdx, range[0] + 1, range[3], range[2], range[3]);
                        xlObj.XLRibbon._firstLastColumn(tid, sheetIdx);
                        curProp = "lastColumn";
                    }
                    details = { sheetIndex: sheetIdx, reqType: "format-table", action: "firstlastcolumn", range: range, check: args.isChecked, id: args.model.id, tableId: parseInt(tid), prop: curProp };
                    xlObj._completeAction(details);
                    xlObj._trigActionComplete(details);
                    break;
                case xlObj._id + '_Ribbon_Design_TableStyleOptions_TotalRow':
                    var tid = document.getElementById(xlObj._id + '_tableid').value;
                    xlObj.XLRibbon._totalRow(tid, sheetIdx);
                    break;
                case xlObj._id + '_Ribbon_Design_TableStyleOptions_FilterColumn':
                    if (!xlObj.model.allowFiltering)
                        return;
                    tmgr = sheet.tableManager, tid = document.getElementById(xlObj._id + '_tableid').value;
                    xlObj.XLFilter._clearFilterTableIcon(sheetIdx, parseInt(document.getElementById(xlObj._id + '_tableid').value));
                    tmgr[tid]["isFilter"] = args.isChecked;
                    details = { sheetIndex: sheetIdx, reqType: "format-table", action: "filtericon", id: args.model.id, check: args.isChecked, tableId: parseInt(tid) };
                    xlObj._completeAction(details);
                    xlObj._trigActionComplete(details);
                    break;
                case xlObj._id + '_Ribbon_Insert_Tables_Table':
                    xlObj._showDialog(this._id);
                    xlObj.XLRibbon._openFATDlg();
                    break;
                case xlObj._id + "_Ribbon_Review_Comments_NewComment":
                    $("#" + xlObj._id + "_Ribbon_Review_Comments_NewComment").text() === xlObj._getLocStr("NewComment") ? xlObj.XLComment.setComment() : xlObj.XLComment.editComment();
                    break;
                case xlObj._id + "_Ribbon_Review_Comments_DeleteComment":
                    xlObj.XLComment.deleteComment();
                    break;
                case xlObj._id + "_Ribbon_Review_Comments_ShowAllComments":
                    xlObj.XLComment.showAllComments();
                    break;
                case xlObj._id + "_Ribbon_Review_Comments_ShowHideComment":
                    xlObj.XLComment.showHideComment();
                    break;
                case xlObj._id + "_Ribbon_Review_Comments_NextComment":
                    xlObj.XLComment.findNextComment();
                    break;
                case xlObj._id + "_Ribbon_Review_Comments_PreviousComment":
                    xlObj.XLComment.findPrevComment();
                    break;
                case xlObj._id + "_Ribbon_Insert_Links_Hyperlink":
                    xlObj._showDialog(this._id);
                    break;
                case xlObj._id + "_Ribbon_Home_Editing_SortFilter":
                    switch (args.ID) {
                        case "Ribbon_SortAtoZ":
                        case "Ribbon_SortZtoA":
                            xlObj.model.allowSorting && xlObj.XLSort._sortHandler(args.ID);
                            break;
                        case "Ribbon_Filter":
                            xlObj.model.allowFiltering && xlObj.XLFilter.filter();
                            break;
                        default:
                            cname = xlObj.getCell(xlObj.getActiveCell().rowIndex, xlObj.getActiveCell().colIndex)[0].className;
                            if (cname.indexOf("e-table") < 0)
                                xlObj.XLFilter.clearFilter();
                            else {
                                tid = xlObj._getTableID(cname);
                                xlObj.XLFilter._clearFilterTable(xlObj.getActiveSheetIndex(), parseInt(tid), true);
                            }
                            break;
                    }
                    break;
                case xlObj._id + "_Ribbon_Others_Cells_InsertCell":
                case xlObj._id + "_Ribbon_Others_Cells_InsertCellOptions":
                    if (selCells.length < 1)
                        return;
                    startCell = selCells[0], endCell = selCells[selCells.length - 1];
                    switch (args.ID) {
                        case "InsertCells":
                            if (xlObj._getJSSheetRowHeaderContent(sheetIdx).find('.e-rowselected').length)
                                xlObj.insertEntireRow(startCell.rowIndex, endCell.rowIndex);
                            else if (xlObj._getJSSheetHeader(sheetIdx).find('.e-colselected').length) {
                                xlObj._insDelStatus = "insert";
                                xlObj.insertEntireColumn(startCell.colIndex, endCell.colIndex);
                            }
                            else
                                xlObj._showDialog(this._id);
                            break;
                        case "InsertSheetRows":
                            xlObj.insertEntireRow(startCell.rowIndex, endCell.rowIndex);
                            break;
                        case "InsertSheetColumns":
                            xlObj._insDelStatus = "insert";
                            xlObj.insertEntireColumn(startCell.colIndex, endCell.colIndex);
                            break;
                        case "InsertSheet":
                            xlObj.insertSheet();
                            break;
                        default:
                            if (xlObj.element.find('.e-rowselected').length > 0)
                                xlObj.insertEntireRow(startCell.rowIndex, endCell.rowIndex);
                            else if (xlObj.element.find('.e-colselected').length > 0) {
                                xlObj._insDelStatus = "insert";
                                xlObj.insertEntireColumn(startCell.colIndex, endCell.colIndex);
                            }
                            else
                                xlObj.insertShiftBottom(startCell, endCell);
                            break;
                    }
                    break;
                case xlObj._id + "_Ribbon_Others_Cells_DeleteCell":
                case xlObj._id + "_Ribbon_Others_Cells_DeleteCellOptions":
                    if (selCells.length < 1)
                        return;
                    startCell = selCells[0], endCell = selCells[selCells.length - 1];
                    switch (args.ID) {
                        case "DeleteCells":
                            if (xlObj._getJSSheetRowHeaderContent(sheetIdx).find('.e-rowselected').length)
                                xlObj.deleteEntireRow(startCell.rowIndex, endCell.rowIndex, []);
                            else if (xlObj._getJSSheetHeader(sheetIdx).find('.e-colselected').length) {
                                xlObj._insDelStatus = "delete";
                                xlObj.deleteEntireColumn(startCell.colIndex, endCell.colIndex, []);
                            }
                            else
                                xlObj._showDialog(this._id);
                            break;
                        case "DeleteSheetRows":
                            xlObj.deleteEntireRow(startCell.rowIndex, endCell.rowIndex, []);
                            break;
                        case "DeleteSheetColumns":
                            xlObj._insDelStatus = "delete";
                            xlObj.deleteEntireColumn(startCell.colIndex, endCell.colIndex, []);
                            break;
                        case "DeleteSheet":
                            xlObj.deleteSheet(sheetIdx, true);
                            break;
                        default:
                            if (xlObj.element.find('.e-rowselected').length > 0)
                                xlObj.deleteEntireRow(startCell.rowIndex, endCell.rowIndex);
                            else if (xlObj.element.find('.e-colselected').length > 0) {
                                xlObj._insDelStatus = "insert";
                                xlObj.deleteEntireColumn(startCell.colIndex, endCell.colIndex);
                            }
                            else
                                xlObj.deleteShiftUp(startCell, endCell);
                            break;
                    }
                    break;
                case xlObj._id + "_Ribbon_Home_Editing_Clear":
                    range = sheet.selectedRange;
                    switch (args.ID) {
                        case "Clear_All":
                            range = xlObj._getAlphaRange(sheetIdx, range[0], range[1], range[2], range[3]);
                            xlObj.clearAll(range);
                            break;
                        case "Clear_Formats":
                            range = xlObj._getAlphaRange(sheetIdx, range[0], range[1], range[2], range[3]);
                            xlObj.clearAllFormat(range);
                            break;
                        case "Clear_Contents":
                            range = xlObj._getAlphaRange(sheetIdx, range[0], range[1], range[2], range[3]);
                            xlObj.clearContents(range);
                            break;
                        case "Clear_Comments":
                            xlObj.clearComments(sheetIdx);
                            break;
                        default:
                            xlObj.clearHyperlinks();
                            break;
                    }
                    xlObj.model.allowSelection && xlObj.XLSelection._clearBorder(xlObj._arrayAsString(xlObj._cutFocus), sheetIdx);
                    break;
                case xlObj._id + "_Ribbon_Insert_Tables_PivotTable":
                    xlObj._showDialog(this._id);
                    var dlg = $("#" + xlObj._id + "_PvtDialog"), sheet = xlObj.getSheet(sheetIdx);
                    info = { sheetIndex: sheetIdx, model: xlObj.model.sheets };
                    if (xlObj._trigger("_createPivotTable", info))
                        return;
                    $("#" + xlObj._id + "_Ribbon_PvtRange").val("");
                    $("#" + xlObj._id + "_Ribbon_PvtLocation").val("");
                    if (sheet._selectedCells.length > 1) {
                        var range = sheet.selectedRange;
                        $("#" + xlObj._id + "_Ribbon_PvtRange").val(sheet.sheetInfo.text + "!$" + xlObj._generateHeaderText(range[1] + 1) + "$" + (range[0] + 1) + ":$" + xlObj._generateHeaderText(range[3] + 1) + "$" + (range[2] + 1));
                    }
                    else if (!xlObj.isUndefined(xlObj.XLEdit.getPropertyValueByElem(xlObj.getActiveCellElem()))) {
                        xlObj.selectAll(false);
                        $("#" + xlObj._id + "_Ribbon_PvtRange").val(sheet.sheetInfo.text + "!$" + xlObj._generateHeaderText(sheet._startCell.colIndex + 1) + "$" + (sheet._startCell.rowIndex + 1) + ":$" + xlObj._generateHeaderText(sheet._endCell.colIndex + 1) + "$" + (sheet._endCell.rowIndex + 1));
                    }
                    dlg.find(".e-ss-changerange").show();
                    dlg.find(".e-ss-movepvttbl").show();
                    dlg.data("ejDialog").option("title", xlObj._getLocStr("CreatePivotTable"));
                    $("#" + xlObj._id + "_dlg_newsheet").click();
                    dlg.ejDialog("open");
                    break;
                case xlObj._id + "_Ribbon_Insert_Sparkline_Column":
                case xlObj._id + "_Ribbon_Insert_Sparkline_Line":
                case xlObj._id + "_Ribbon_Insert_Sparkline_Pie":
                case xlObj._id + "_Ribbon_Insert_Sparkline_Area":
                case xlObj._id + "_Ribbon_Insert_Sparkline_Winloss":
                    xlObj.XLRibbon._sparklineDesignType = this._id.split("_")[4];
                    xlObj._showDialog(this._id);
                    xlObj.XLSparkline._sparklineDlgBox();
                    break;
                case xlObj._id + "_Ribbon_Analyze_Show_FieldList":
                    if (args.model.toggleState) {
                        xlObj.XLPivot._displayActPanel = true;
                        xlObj.getActivationPanel().find("#" + xlObj._id + "_PivotTableSchema_" + xlObj._getContent(sheetIdx).find(".e-ss-activepivot")[0].id).show();
                        xlObj.showActivationPanel();
                    }
                    else {
                        xlObj.hideActivationPanel();
                        xlObj.XLPivot._displayActPanel = false;
                    }
                    break;
                case xlObj._id + "_Ribbon_Analyze_Actions_ClearAll":
                    var pvtID = xlObj.element.find(".e-ss-activepivot")[0].id, pivotGrid = $("#" + pvtID).data("ejPivotGrid"), pivotSchema;
                    pivotSchema = $("#" + xlObj._id + "_PivotTableSchema_" + pvtID).data("ejPivotSchemaDesigner");
                    xlObj.XLPivot._clearFilters(pivotGrid, pivotSchema);
                    pivotSchema.model.pivotControl = pivotGrid;
                    break;
                case xlObj._id + "_Ribbon_Analyze_Actions_MovePivotTable":
                    var dlg = $("#" + xlObj._id + "_PvtDialog"), pvtObj, range, sheetIdx = xlObj.getActiveSheetIndex();
                    dlg.find(".e-ss-movepvttbl").show();
                    dlg.find(".e-ss-changerange").hide();
                    pvtObj = xlObj.getSheet(sheetIdx).pivotMngr.pivot[xlObj.element.find(".e-ss-activepivot")[0].id];
                    $("#" + xlObj._id + "_Ribbon_PvtLocation").val(xlObj.getSheet(sheetIdx).sheetInfo.text + "!$" + xlObj._generateHeaderText(pvtObj.colIndex + 1) + "$" + (pvtObj.rowIndex + 1));
                    dlg.data("ejDialog").option("title", xlObj._getLocStr("MovePivotTable"));
                    $("#" + xlObj._id + "_dlg_existsheet").click();
                    dlg.ejDialog("open");
                    break;
                case xlObj._id + "_Ribbon_Analyze_DataSource_Refresh":
                    xlObj.XLPivot.refreshDataSource();
                    break;
                case xlObj._id + "_Ribbon_Analyze_DataSource_ChangeDataSource":
                    var dlg = $("#" + xlObj._id + "_PvtDialog"), pvtObj, range, dataSheetIdx;
                    dlg.find(".e-ss-changerange").show();
                    dlg.find(".e-ss-movepvttbl").hide();
                    pvtObj = xlObj.getSheet(sheetIdx).pivotMngr.pivot[xlObj.element.find(".e-ss-activepivot")[0].id];
                    range = pvtObj.dataRange;
                    dataSheetIdx = xlObj.XLPivot._getSheetIdxFromName(pvtObj.dataSheetName);
                    $("#" + xlObj._id + "_Ribbon_PvtRange").val(pvtObj.dataSheetName + "!$" + xlObj._generateHeaderText(range[1] + 1) + "$" + (range[0] + 1) + ":$" + xlObj._generateHeaderText(range[3] + 1) + "$" + (range[2] + 1));
                    dlg.data("ejDialog").option("title", xlObj._getLocStr("ChangePivotTableDataSource"));
                    dlg.ejDialog("open");
                    break;
                case xlObj._id + "_Ribbon_ChartDesign_Type_ChangeChartType":
                    xlObj._showDialog(this._id);
                    xlObj.XLRibbon._refreshChartTypeDlg();
                    break;
                case xlObj._id + "_Ribbon_Insert_Illustrations_Pictures":
                    if (xlObj.model.importSettings.importMapper.length < 1) {
                        xlObj._showAlertDlg("Alert", "ImportExportUrl", "", 266);
                        return;
                    }
                    xlObj._uploadImage = true;
                    $("#" + xlObj._id + "_file .e-uploadinput").click();
                    xlObj.XLRibbon._toggleFormatTab();
                    break;
                case xlObj._id + "_Ribbon_Others_Formulas_NameManager":
                    xlObj.XLRibbon._openNameManagerDlg();
                    xlObj.XLRibbon._isNmgrid = "NameManager";
                    break;
                case xlObj._id + "_Ribbon_Others_Formulas_DefineName":
                    xlObj._showDialog(xlObj._id + "_Ribbon_Others_NameManager");
                    var grid = $("#" + xlObj._id + "_nmgrid").data("ejGrid");
                    grid.getContentTable().find('td').addClass("e-ss-emptyrecord")
                    if (grid.model.dataSource.length < 1)
                        grid.getContentTable().find('td').addClass("e-ss-emptyrecord");
                    else
                        grid.getContentTable().find('.e-ss-emptyrecord').removeClass("e-ss-emptyrecord");
                    xlObj.XLRibbon._refreshNMDlg();
                    xlObj.XLRibbon._isNmgrid = "DefineName";
                    break;
                case xlObj._id + "_Ribbon_Others_Window_FreezePanes":
                    switch (args.ID) {
                        case "freezePanes":
                            xlObj.XLFreeze.freezePanes();
                            break;
                        case "FreezeTopRow":
                            xlObj.XLFreeze.freezeTopRow();
                            break;
                        case "FreezeFirstColumn":
                            xlObj.XLFreeze.freezeLeftColumn();
                            break;
                        case "UnFreezePanes":
                            xlObj.XLFreeze.unfreezePanes();
                        default:
                            break;
                    }
                    break;
                case xlObj._id + "_Ribbon_Home_Alignment_Merge":
                    if (ej.isNullOrUndefined(args.ID)) {
                        xlObj.mergeCenter = true;
                        xlObj.mergeCells();
                    }
                    switch (args.ID) {
                        case "MergeCells":
                            xlObj.mergeCells();
                            break;
                        case "MergeAcross":
                            xlObj.mergeAcrossCells();
                            break;
                        case "MergeAndCenter":
                            xlObj.mergeCenter = true;
                            xlObj.mergeCells();
                            break;
                        case "UnmergeCells":
                            xlObj.unmergeCells(sheet.selectedRange);
                            break;
                    }
                    break;
                case xlObj._id + "_Ribbon_Home_Editing_AutoSum":
                    cellRange = sheet.selectedRange;
                    if (args.type === "click")
                        xlObj.XLRibbon.autoSum("SUM", xlObj._getAlphaRange(sheetIdx, cellRange[0], cellRange[1], cellRange[2], cellRange[3]));
                    else
                        xlObj.XLRibbon.autoSum(args.ID.toUpperCase(), xlObj._getAlphaRange(sheetIdx, cellRange[0], cellRange[1], cellRange[2], cellRange[3]));
                    break;
                case xlObj._id + "_Ribbon_ChartDesign_ChartLayouts_AddChartElement":
                    xlObj.XLChart.updateChartElement(null, args.ID);
                    break;
                case xlObj._id + "_Ribbon_ChartDesign_Size_ChartWidth":
                    xlObj.XLRibbon._changeChartSize("height", args.value);
                    break;
                case xlObj._id + "_Ribbon_ChartDesign_Size_ChartHeight":
                    xlObj.XLRibbon._changeChartSize("width", args.value);
                    break;
                case xlObj._id + "_Ribbon_ChartDesign_Data_SwitchRowColumn":
                    xlObj.XLChart.switchRowColumn();
                    break;
                case xlObj._id + "_Ribbon_SparklineDesign_Line":
                case xlObj._id + "_Ribbon_SparklineDesign_Column":
                case xlObj._id + "_Ribbon_SparklineDesign_Pie":
                case xlObj._id + "_Ribbon_SparklineDesign_Area":
                case xlObj._id + "_Ribbon_SparklineDesign_Winloss":
                    var sId = xlObj.XLEdit.getPropertyValue(xlObj._getSelectedCells().selCells[0].rowIndex, xlObj._getSelectedCells().selCells[0].colIndex, "sparkline"), details, sparklineDesignType;
                    this.sparklineDesignType = this._id.split("_")[3];
                    xlObj.XLSparkline.changeType(sId[0], this.sparklineDesignType);
                    break;
                case xlObj._id + "_Ribbon_SparklineDesign_Sparkline_EditData":
                    xlObj._showDialog(this._id);
                    switch (args.ID) {
                        case "EditGroupLocation":
                            xlObj.XLRibbon._isEditGroupLocationClick = true;
                            if (xlObj.XLRibbon._isEditGroupLocationClick)
                                xlObj.XLSparkline._sparklineDlgBox();
                            break;
                        case "EditSingleSparklineData":
                            xlObj._showDialog(this._id);
                            xlObj.XLSparkline._sparklinDesignDlg();
                            xlObj.XLRibbon._isEditSingleSparklineClick = true;
                            break;
                    }
                    break;
                case xlObj._id + "_Ribbon_SparklineDesign_Show_HighPoint":
                    var sId = xlObj.XLEdit.getPropertyValue(xlObj._getSelectedCells().selCells[0].rowIndex, xlObj._getSelectedCells().selCells[0].colIndex, "sparkline");
                    xlObj.XLSparkline.changePointColor(sId[0], {highPointColor: "red"}, sheetIdx, args.isChecked);
                    break;
                case xlObj._id + "_Ribbon_SparklineDesign_Show_NegativePoints":
                    var sId = xlObj.XLEdit.getPropertyValue(xlObj._getSelectedCells().selCells[0].rowIndex, xlObj._getSelectedCells().selCells[0].colIndex, "sparkline");
                    xlObj.XLSparkline.changePointColor(sId[0], {negativePointColor:"orange"}, sheetIdx, args.isChecked);
                    break;
                case xlObj._id + "_Ribbon_SparklineDesign_Show_LowPoint":
                    var sId = xlObj.XLEdit.getPropertyValue(xlObj._getSelectedCells().selCells[0].rowIndex, xlObj._getSelectedCells().selCells[0].colIndex, "sparkline");
                    xlObj.XLSparkline.changePointColor(sId[0], {lowPointColor:"orange"}, sheetIdx, args.isChecked);                   
                    break;
                case xlObj._id + "_Ribbon_SparklineDesign_Show_FirstPoint":
                    var sId = xlObj.XLEdit.getPropertyValue(xlObj._getSelectedCells().selCells[0].rowIndex, xlObj._getSelectedCells().selCells[0].colIndex, "sparkline");
                    xlObj.XLSparkline.changePointColor(sId[0], {startPointColor:"green"}, sheetIdx, args.isChecked);
                    break;
                case xlObj._id + "_Ribbon_SparklineDesign_Show_LastPoint":
                    var sId = xlObj.XLEdit.getPropertyValue(xlObj._getSelectedCells().selCells[0].rowIndex, xlObj._getSelectedCells().selCells[0].colIndex, "sparkline");
                    xlObj.XLSparkline.changePointColor(sId[0], {endPointColor: "violet"}, sheetIdx, args.isChecked);
                    break;
                case xlObj._id + "_Ribbon_SparklineDesign_Show_Markers":
                    var sId = xlObj.XLEdit.getPropertyValue(xlObj._getSelectedCells().selCells[0].rowIndex, xlObj._getSelectedCells().selCells[0].colIndex, "sparkline");
                    xlObj.XLSparkline.changePointColor(sId[0], { markerSettings: { visible: true } }, sheetIdx, args.isChecked);
                    break;
                case xlObj._id + "_Ribbon_SparklineColor":
                    var sId = xlObj.XLEdit.getPropertyValue(xlObj._getSelectedCells().selCells[0].rowIndex, xlObj._getSelectedCells().selCells[0].colIndex, "sparkline"), color;
                    color = args.value;
                    xlObj.XLSparkline.changePointColor(sId[0], {fill: color},sheetIdx,args.isInteraction);
                    break;
                case xlObj._id + "_Ribbon_MarkerNegativePoint":
                    var sId = xlObj.XLEdit.getPropertyValue(xlObj._getSelectedCells().selCells[0].rowIndex, xlObj._getSelectedCells().selCells[0].colIndex, "sparkline"), color;
                    color = args.value;
                    xlObj.XLSparkline.changePointColor(sId[0], {negativePointColor:color},sheetIdx,args.isInteraction);
                    break;
                case xlObj._id + "_Ribbon_MarkerHighPoint":
                    var sId = xlObj.XLEdit.getPropertyValue(xlObj._getSelectedCells().selCells[0].rowIndex, xlObj._getSelectedCells().selCells[0].colIndex, "sparkline"), color;
                    color = args.value;
                    xlObj.XLSparkline.changePointColor(sId[0], {highPointColor: color},sheetIdx,args.isInteraction);
                    break;
                case xlObj._id + "_Ribbon_MarkerLowPoint":
                    var sId = xlObj.XLEdit.getPropertyValue(xlObj._getSelectedCells().selCells[0].rowIndex, xlObj._getSelectedCells().selCells[0].colIndex, "sparkline"), color;
                    color = args.value;
                    xlObj.XLSparkline.changePointColor(sId[0], {lowPointColor: color},sheetIdx,args.isInteraction);
                    break;
                case xlObj._id + "_Ribbon_PictureColor":
                case xlObj._id + "_Ribbon_Format_Border_PictureBorder":
                    if (["weight", "dashes", xlObj._id + "picturecolor", ""].indexOf(args.ID) === -1) {
                        elem = xlObj.getSheetElement(sheetIdx).find(".e-ss-activeimg");
                        var regx = new RegExp("\\b" + "e-shapebdr" + ".*?\\b", "g"), style;
                        if (elem[0].className.match(regx))
                            style = xlObj.XLShape._getImgStyleFromHashCode(elem[0].className.match(regx)[0]);
                        else
                            style = { "border-color": "transparent", "border-width": "1px", "border-style": "solid" };
                        var color = style["border-color"], width = style["border-width"], style = style["border-style"];
                        if (elem[0]) {
                            switch (true) {
                                case this._id.indexOf("PictureColor") > -1:
                                    color = args.value;
                                    break;
                                case args.ID.indexOf("px") > -1:
                                    width = args.ID;
                                    break;
                                case args.ID === "nooutline":
                                    color = "transparent";
                                    break;
                                default:
                                    style = args.ID;
                                    break;
                            }
                            xlObj.XLShape.changePictureBorder(elem[0].id, width, style, color);
                        }
                    }
                    break;
                case xlObj._id + "_Ribbon_Format_Adjust_ResetPicture":
                    xlObj.XLShape.resetPicture(null, args.ID);
                    break;
                case xlObj._id + "_Ribbon_Format_Adjust_ChangePicture":
                    xlObj._uploadImage = true;
                    xlObj.XLShape._changePicture = true;
                    xlObj.element.find("#" + xlObj._id + "_file .e-uploadinput").click();
                    xlObj.XLRibbon._toggleFormatTab();
                    break;
                case xlObj._id + "_Ribbon_ChartDesign_Data_SelectData":
                    xlObj._showDialog(this._id);
                    cid = document.getElementById(xlObj._id + "_chart").value, dataVal = xlObj.XLChart._getShapeObj(cid, "chart");
                    if (!dataVal.isChartSeries) {
                        $("#" + xlObj._id + "_crxaxis").val(dataVal.xRange ? xlObj._getAlphaRange(sheetIdx, dataVal.xRange[0], dataVal.xRange[1], dataVal.xRange[2], dataVal.xRange[3]) : "");
                        $("#" + xlObj._id + "_cryaxis").val(dataVal.yRange ? xlObj._getAlphaRange(sheetIdx, dataVal.yRange[0], dataVal.yRange[1], dataVal.yRange[2], dataVal.yRange[3]) : "");
                        $("#" + xlObj._id + "_crlaxis").val(dataVal.lRange ? xlObj._getAlphaRange(sheetIdx, dataVal.lRange[0], dataVal.lRange[1], dataVal.lRange[2], dataVal.lRange[3]) : "");
                        xlObj._selectDataval = { xRange: $("#" + xlObj._id + "_crxaxis").val(), yRange: $("#" + xlObj._id + "_cryaxis").val(), lRange: $("#" + xlObj._id + "_crlaxis").val() }
                        $("#" + xlObj._id + "_chartrangedlg").ejDialog("open");
                        $("#" + xlObj._id + "_crxaxis").focus().setInputPos(0);
                    }
                    break;
                case xlObj._id + "_Ribbon_ChartDesign_ChartThemes_ChartThemes":
                    xlObj.XLChart.changeTheme(xlObj.element.find("#" + xlObj._id + "_chart").val(), this._selectedValue);
                    break;
                case xlObj._id + "_Ribbon_Review_Changes_LockCell":
                    xlObj.lockCells(null, args.model.toggleState);
                    break;
                case xlObj._id + "_Ribbon_Review_Changes_ProtectSheet":
                    xlObj.protectSheet(args.model.toggleState);
                    break;
                case xlObj._id + "_Ribbon_Review_Changes_ProtectWorkbook":
                    xlObj._showDialog(this._id);
                    var wrkDlgOption = $("#" + xlObj._id + "_PasswordDialog").data("ejDialog");
                    if (!xlObj.model.exportSettings.password) {
                        wrkDlgOption.option("title", xlObj._getLocStr("ProtectWorkbook"));
                        $("#" + xlObj._id + "_confirm").show();
                    }
                    wrkDlgOption.open();
                    break;
            }
            if ((this._id.indexOf("Comment") < 0 && this._id.indexOf("FindSelect") < 0) || xlObj.XLSearch._isApplied) {
                xlObj._setSheetFocus();
                xlObj.XLSearch._isApplied = false;
            }
            xlObj._isRibbonClick = false;
        },

        _applyTextIndent: function (cellIdx, cellStyle, size, btnObj) {
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), temp = {}, sstyles = ej.Spreadsheet.SupportedStyles,
                textWidth, indentWidth, indent, colWidth, value2, value, cHght, cell = xlObj.getCell(cellIdx.rowIndex, cellIdx.colIndex), sheet = xlObj.getSheet(sheetIdx);
            value2 = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, "value2");
            value = xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, "value");
            if (btnObj._id.indexOf("DecreaseIndent") < 0 && xlObj._hasClass(cell[0], "e-sswraptext") && Math.round((4 / 3) * size) + xlObj._detailsFromGlobalSpan(cellIdx.rowIndex, cellIdx.colIndex, "width", "W") > sheet.columnsWidthCollection[cellIdx.colIndex]) //pt to px onversion and text indent level twice for restrict overflow, while wrap.
                return;
            if (xlObj.isFormula(value))
                value = value2;
            if ((!cellStyle[sstyles.TextIndent] && btnObj._id === xlObj._id + "_Ribbon_Home_Alignment_DecreaseIndent") || (size < 0))
                return false;
            cellStyle[sstyles.TextIndent] = size + "pt";
            if (cellStyle[sstyles.TextAlign] === "center" || (xlObj.isNumber(value) && !cellStyle[sstyles.TextAlign]))
                cellStyle[sstyles.TextAlign] = "left";
            temp["style"] = cellStyle;
            xlObj.XLFormat.format(temp, [cellIdx.rowIndex, cellIdx.colIndex, cellIdx.rowIndex, cellIdx.colIndex]);
            if (cellStyle[sstyles.TextIndent] && !xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, "merge") && !xlObj.XLEdit.getPropertyValue(cellIdx.rowIndex, cellIdx.colIndex, "mergeIdx")) {
                cHght = cell.outerHeight();
                if (cHght >= xlObj.model.rowHeight) {
                    cell.parent().outerHeight(cHght);
                    sheet.rowsHeightCollection[cellIdx.rowIndex] = cHght;
                    xlObj._updateFormatColl(sheetIdx, cellIdx.rowIndex, cellIdx.colIndex, cHght);
                    xlObj._setRowHdrHeight(sheetIdx, cellIdx.rowIndex);
                }
                textWidth = xlObj._detailsFromGlobalSpan(cellIdx.rowIndex, cellIdx.colIndex, "width", value2, null, true);
                indent = (4 / 3) * size;     //pt to px convertion
                indentWidth = Math.round(indent + textWidth);
                colWidth = sheet.columnsWidthCollection[cellIdx.colIndex];
                if (xlObj.XLResize && xlObj.isNumber(value) && btnObj._id === xlObj._id + "_Ribbon_Home_Alignment_IncreaseIndent" && indentWidth >= colWidth)
                    xlObj.XLResize.setColWidth(cellIdx.colIndex, 8 + colWidth); // 8 - pt to pix conversion ((4 / 3) * 6)
            }
        },

        _changeChartSize: function (status, value) {
            if (this._ctrlCreated)
                return;
            var xlObj = this.XLObj, formulaBar, pSize, newVal, cid = document.getElementById(xlObj._id + "_chart").value, cObj = $("#" + cid).ejChart("instance"), chartEle = $("#" + cid), cProp = xlObj.XLChart._getShapeObj(cid, "chart"), details = { sheetIndex: xlObj.getActiveSheetIndex(), reqType: "shape", shapeType: "chart", action: status, cid: cid, rowIndex: xlObj.XLShape._picCellIdx.rowIndex, colIndex: xlObj.XLShape._picCellIdx.colIndex, prev: { width: cObj.model.size.width, height: cObj.model.size.height } };
            pSize = cObj.model.size;
            if (xlObj.model.allowFormulaBar)
                formulaBar = xlObj.element.find('.e-formulabar')[0];
            formulaBar && (formulaBar.style.display = "none");
            if (status === "height") {
                cObj.option("size", { width: value.toString() });
                cProp['width'] = value;
                chartEle[0].style.width = value + "px";
                details.cur = { width: value.toString(), height: cObj.model.size.height };
            }
            else {
                cObj.option("size", { height: value.toString() });
                cProp['height'] = value;
                chartEle[0].style.height = value + "px";
                details.cur = { width: cObj.model.size.width, height: value.toString() };
            }
            formulaBar && (formulaBar.style.display = "block");
            xlObj._completeAction(details);
            xlObj._trigActionComplete(details);
            xlObj.XLShape._shapeType = "chart";
            xlObj.XLShape._updateShapeObj(chartEle[0]);
            xlObj.XLShape._shapeType = "img";
        },

        _updateBordeStyle: function (args) {
            var xlObj = this.XLObj;
            xlObj._borderStyle = args.ID && args.ID.length > 0 && args.ID;
        },

        _colorPickerHandler: function (name, args) {
            var xlFormat, xlObj = this.XLObj;
            if (args.type === "open") {
                $("#" + xlObj._id + "_" + name + "_popup").find(".e-buttons, .e-button").hide();
                $("#" + xlObj._id + "_" + name + "_popup").focus();
            }
            else if (args.type === "change") { //color change  
                xlFormat = xlObj.XLFormat;
                var cpObj = $("#" + xlObj._id + "_" + name).data("ejColorPicker");
                if (name === "Ribbon_Home_Font_FontColor") {
                    xlFormat.format({ "style": { "color": args.value } });
                    $("#" + xlObj._id + "_Ribbon_home_Font_Color").find(".e-selected-color").css("background-color", args.value);
                }
                else {
                    xlFormat.format({ "style": { "background-color": args.value } });
                    $("#" + xlObj._id + "_Ribbon_home_Font_Background").find(".e-selected-color").css("background-color", args.value);
                }
                cpObj.hide();
                xlObj._dupDetails = true;
                cpObj.setValue(args.value);
                xlObj._dupDetails = false;
            }
        },

        updateRibbonIcons: function () {
            this._updateRibbonIcons();
        },

        _updateRibbonIcons: function () { //scrip error
            var format, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), actSheet = xlObj.getSheet(sheetIdx);
            if (!this.XLObj.model.showRibbon || (actSheet._isImported && !actSheet._isLoaded))
                return;
            var isLocked, lockbtObj, merge, isWrap, type, style, activeCell, cfObj = $("#" + xlObj._id + "_Ribbon_Home_Number_NumberFormat").data("ejDropDownList"), tgleBtnElem;
            var fsObj = $("#" + xlObj._id + "_Ribbon_Home_Font_FontSize").data("ejDropDownList"), isVertical = false;
            $("#" + xlObj._id + "_Ribbon_Home_Font_FontSize").css("width", "auto");
            var ffObj = $("#" + xlObj._id + "_Ribbon_Home_Font_FontFamily").data("ejDropDownList"), index = -1, rObj = $("#" + xlObj._id + "_Ribbon").data("ejRibbon"), tabName = rObj.getTabText(rObj.model.selectedItemIndex);
            switch (tabName) {
                case xlObj._getLocStr("HOME"):
                    activeCell = actSheet._activeCell, isWrap = xlObj.XLEdit.getPropertyValue(activeCell.rowIndex, activeCell.colIndex, "wrap"), merge = xlObj.XLEdit.getPropertyValue(activeCell.rowIndex, activeCell.colIndex, "merge");
                    format = xlObj.XLEdit.getPropertyValue(activeCell.rowIndex, activeCell.colIndex, "format"), type = xlObj.XLEdit.getPropertyValue(activeCell.rowIndex, activeCell.colIndex, "type");
                    if (!ej.isNullOrUndefined(xlObj.XLFormat))
                        style = xlObj.XLFormat.getFormatFromHashCode(format);
                    if (xlObj.isUndefined(isWrap))
                        (isWrap = false);
                    $("#" + xlObj._id + "_Ribbon_Home_Alignment_WrapText").ejToggleButton("option", { toggleState: isWrap });
                    if (!xlObj.isUndefined(merge)) {
                        $("#" + xlObj._id + "_Ribbon_Home_Alignment_Merge").addClass("e-ss-active");
                        $("#" + xlObj._id + "_Ribbon_Home_Alignment_Mergedrpbtn").addClass("e-ss-active");
                    }
                    else {
                        $("#" + xlObj._id + "_Ribbon_Home_Alignment_Merge").removeClass("e-ss-active");
                        $("#" + xlObj._id + "_Ribbon_Home_Alignment_Mergedrpbtn").removeClass("e-ss-active");
                    }
                    if (["date"].indexOf(type) > -1)
                        type = "custom";
                    if (type) {
                        index = -1;
                        for (var i = 0, len = this._numberFormat.length; i < len; i++) {
                            if (type === this._numberFormat[i].value.toLowerCase()) {
                                index = i;
                                break;
                            }
                        }
                    }
                    if (!ej.isNullOrUndefined(cfObj)) {
                        cfObj._initValue = true;
                        index > -1 ? cfObj.option({ selectedItemIndex: index }) : (!ej.isNullOrUndefined(cfObj.selectedIndexValue) && cfObj.selectedIndexValue != 0 && cfObj.option({ selectedItemIndex: 0 }));
                        cfObj._initValue = false;
                    }
                    if (style) {
                        index = -1;
                        if (!ej.isNullOrUndefined(style["font-size"])) {
                            for (var i = 0, len = this._fontSize.length; i < len; i++) {
                                if (style["font-size"] === this._fontSize[i].value) {
                                    index = i;
                                    break;
                                }
                            }
                        }
                        if (!ej.isNullOrUndefined(fsObj)) {
                            fsObj._initValue = true;
                            index > -1 ? (fsObj.option({ selectedItemIndex: index }) || (index = -1)) : (!ej.isNullOrUndefined(fsObj.selectedIndexValue) && fsObj.selectedIndexValue != 3 && fsObj.option({ selectedItemIndex: 3 }));
                            fsObj._initValue = false;
                            index = -1
                            if (!ej.isNullOrUndefined(style["font-family"])) {
                                for (var i = 0, len = this._fontFamily.length; i < len; i++) {
                                    if (style["font-family"] === this._fontFamily[i].text.toLowerCase()) {
                                        index = i;
                                        break;
                                    }
                                }
                            }

                        }
                        if (!ej.isNullOrUndefined(ffObj)) {
                            ffObj._initValue = true;
                            index > -1 ? ffObj.option({ selectedItemIndex: index }) : (!ej.isNullOrUndefined(ffObj.selectedIndexValue) && ffObj.selectedIndexValue != 6 && ffObj.option({ selectedItemIndex: 6 }));
                            ffObj._initValue = false;
                        }
                        if ($("#" + xlObj._id + "_Ribbon_Home_Font_Bold").length)
                            style["font-weight"] == "bold" ? $("#" + xlObj._id + "_Ribbon_Home_Font_Bold").data("ejToggleButton").option("toggleState", true) : $("#" + xlObj._id + "_Ribbon_Home_Font_Bold").data("ejToggleButton").option("toggleState", false);
                        if ($("#" + xlObj._id + "_Ribbon_Home_Font_Italic").length)
                            style["font-style"] == "italic" ? $("#" + xlObj._id + "_Ribbon_Home_Font_Italic").data("ejToggleButton").option("toggleState", true) : $("#" + xlObj._id + "_Ribbon_Home_Font_Italic").data("ejToggleButton").option("toggleState", false);
                        style["text-decoration"] = style["text-decoration"] || "";
                        if ($("#" + xlObj._id + "_Ribbon_Home_Font_Underline").length)
                            $("#" + xlObj._id + "_Ribbon_Home_Font_Underline").data("ejToggleButton").option("toggleState", style["text-decoration"].indexOf("underline") !== -1);
                        if ($("#" + xlObj._id + "_Ribbon_Home_Font_StrikeThrough").length)
                            $("#" + xlObj._id + "_Ribbon_Home_Font_StrikeThrough").data("ejToggleButton").option("toggleState", style["text-decoration"].indexOf("line-through") !== -1);
                        this._tglAlignBtn($(xlObj.element).find(".e-text-align"), style, "text-align");
                        isVertical = this._tglAlignBtn($(xlObj.element).find(".e-vertical-align"), style, "vertical-align").isVertical;
                        if (!isVertical) {
                            tgleBtnElem = xlObj.element.find("#" + xlObj._id + "_Ribbon_Home_Alignment_BottomAlign");
                            if (tgleBtnElem.length) {
                                tgleBtnElem.data("ejToggleButton").option("toggleState", true)
                                tgleBtnElem.addClass("e-vertical-align");
                            }
                        }
                        if (xlObj.getSheetElement(sheetIdx).find(".e-ss-activeimg").length > 0) {
                            tgleBtnElem = xlObj.element.find("#" + xlObj._id + "_Ribbon_Home_Alignment_Merge");
                            tgleBtnElem.length && tgleBtnElem.data('ejSplitButton').option("enabled", false);
                        }
                    }
                    break;
                case xlObj._getLocStr("REVIEW"):
                    var lockElem = $("#" + xlObj._id + "_Ribbon_Review_Changes_LockCell");
                    if (xlObj.model.allowLockCell && !(xlObj.XLComment && xlObj.XLComment._isCommentEdit) && !xlObj.XLEdit._isEdit && !xlObj._isSheetRename && lockElem.length) {
                        lockbtObj = lockElem.data("ejToggleButton");
                        isLocked = xlObj.XLEdit.getPropertyValue(actSheet._activeCell.rowIndex, actSheet._activeCell.colIndex, "isLocked");
                        xlObj.isUndefined(isLocked) && (isLocked = false)
                        lockbtObj.option("toggleState", isLocked);
                        $("#" + xlObj._id + "_Ribbon_Review_Changes_ProtectSheet").length && $("#" + xlObj._id + "_Ribbon_Review_Changes_ProtectSheet").data("ejToggleButton").option("toggleState", actSheet.isSheetProtected);
                        if (!actSheet.isSheetProtected)
                            lockbtObj.enable();
                        else
                            lockbtObj.disable();
                    }
                    if (!actSheet.isSheetProtected || !xlObj.model.allowLockCell) {
                        if ((xlObj.model.allowComments && !xlObj.XLComment._isCommentEdit) && !xlObj.XLEdit._isEdit && !xlObj._isSheetRename)
                            xlObj.XLComment._updateCmntRibIcons(xlObj.getActiveCell());
                    }
                    break;
            }
            if (xlObj.model.allowLockCell && !actSheet.isSheetProtected && xlObj.model.allowComments && !xlObj.XLComment._isCommentEdit && !xlObj._isSheetRename)
                this._refreshRibbonIcons(tabName);
            if (xlObj.model.isReadOnly)
                xlObj._readOnly();
        },

        _tglAlignBtn: function (element, style, elemId) {
            var isVertical = false, tgleBtnElem, xlObj = this.XLObj;
            if (!ej.isNullOrUndefined(element[0])) {
                tgleBtnElem = xlObj.element.find("#" + element[0].id);
                tgleBtnElem.length && tgleBtnElem.data("ejToggleButton").option("toggleState", false);
                element.removeClass("e-" + elemId);
            }
            if (!ej.isNullOrUndefined(style[elemId])) {
                if (elemId === "vertical-align")
                    tgleBtnElem = xlObj.element.find("#" + xlObj._id + "_Ribbon_Home_Alignment_" + style[elemId].charAt(0).toUpperCase() + style[elemId].slice(1) + "Align");
                else
                    tgleBtnElem = xlObj.element.find("#" + xlObj._id + "_Ribbon_Home_Alignment_Align" + style[elemId].charAt(0).toUpperCase() + style[elemId].slice(1));
                if (tgleBtnElem.length) {
                    tgleBtnElem.data("ejToggleButton").option("toggleState", true);
                    tgleBtnElem.addClass("e-" + elemId);
                }
                if (elemId === "vertical-align")
                    isVertical = true;
            }
            return { isVertical: isVertical };
        },

        _disableButtons: function (idCollection, type) {
            var i, index = -1, len, elem, xlObj = this.XLObj;
            for (i = 0, len = idCollection.length; i < len; i++) {
                if (xlObj.model.allowLockCell)
                    if (!xlObj.XLEdit._isEdit && !xlObj._isSheetRename && xlObj.getSheet(xlObj.getActiveSheetIndex()).isSheetProtected)
                        index = this._protectStateBtnIds.indexOf(idCollection[i]);
                if (index === -1) {
                    elem = xlObj.element.find("#" + xlObj._id + "_Ribbon_" + idCollection[i]);
                    elem.length && !ej.isNullOrUndefined(elem.data(type)) && elem.data(type).disable();
                }
            }
        },

        _enableButtons: function (idCollection, type) {
            var i, index = 0, len, elem, xlObj = this.XLObj;
            for (i = 0, len = idCollection.length; i < len; i++) {
                if (xlObj.model.allowLockCell && !xlObj._isSheetRename && xlObj.getSheet(xlObj.getActiveSheetIndex()).isSheetProtected)
                    index = this._protectStateBtnIds.indexOf(idCollection[i]);
                if (index > -1) {
                    elem = xlObj.element.find("#" + xlObj._id + "_Ribbon_" + idCollection[i]);
                    elem.length && !ej.isNullOrUndefined(elem.data(type)) && elem.data(type).enable();
                }
            }
        },

        _disableInputs: function (idColl, disable) {
            for (var i = 0, len = idColl.length; i < len; i++)
                $("#" + this.XLObj._id + "_" + idColl[i]).attr("disabled", disable);
        },

        _enableRibbonIcons: function (rbnActTabIndex) {
            if (!this.XLObj.model.showRibbon)
                return;
            var index, xlObj = this.XLObj, rObj = $("#" + xlObj._id + "_Ribbon").data("ejRibbon"), sheetIdx = xlObj.getActiveSheetIndex(), filterColl = xlObj.getSheet(sheetIdx)._filterColl, filterKeys, filterKeyCol, i, j, len, fKeylen;
            index = rbnActTabIndex ? rbnActTabIndex : rObj.model.selectedItemIndex;
            switch (rObj.getTabText(index)) {
                case xlObj._getLocStr("HOME"):
                    this._enableButtons(this._homeBtnIds, "ejButton");
                    this._enableButtons(this._homeSptBtnIds, "ejSplitButton");
                    this._enableButtons(this._homeToggleBtnIds, "ejToggleButton");
                    this._enableButtons(this._homeDdIds, "ejDropDownList");
                    this._enableButtons(this._homeCpIds, "ejColorPicker");
                    xlObj._removeClass(rObj.element.find("#" + rObj._id + "_Number_e-groupexpander")[0], "e-disable");
                    break;
                case xlObj._getLocStr("INSERT"):
                    this._enableButtons(this._insertBtnIds, "ejButton");
                    this._enableButtons(this._insertSptBtnIds, "ejSplitButton");
                    break;
                case xlObj._getLocStr("DATATAB"):
                    this._enableButtons(this._dataBtnIds, "ejButton");
                    this._enableButtons(this._dataSptBtnIds, "ejSplitButton");
                    break;
                case xlObj._getLocStr("PAGELAYOUT"):
                    this._enableButtons(this._pageLayBtnIds, "ejButton");
                    this._enableButtons(this._pageLaySptBtnIds, "ejSplitButton");
                    this._enableButtons(this._pageLayChckBxIds, "ejCheckBox");
                    $("#" + rObj._id + "_pagesetup_viewhdrlbl").eq(0).removeClass("e-disable");
                    $("#" + rObj._id + "_pagesetup_viewgrdlnlbl").eq(0).removeClass("e-disable");
                    break;
                case xlObj._getLocStr("REVIEW"):
                    xlObj.model.allowComments && !xlObj.XLComment._isCommentEdit && xlObj.XLComment._updateCmntRibIcons();
                    this._enableButtons(this._reviewTglBtnIds, "ejToggleButton");
                    break;
                case xlObj._getLocStr("OTHERS"):
                    this._enableButtons(this._othersBtnIds, "ejButton");
                    this._enableButtons(this._othersSptBtnIds, "ejSplitButton");
                    break;
                case xlObj._getLocStr("Design"):
                    this._enableButtons(this._contextualBtnIds, "ejButton");
                    this._enableButtons(this._contextualCheckBoxIds, "ejCheckBox");
                    this._disableInputs(this._contextualInputIds, false);
                    break;
            }
            if (!xlObj.XLClipboard._copyBackup.cells && !xlObj.XLClipboard._copyBackup.elem) {
                (xlObj.XLRibbon._disableButtons(["Home_Clipboard_Paste"], "ejButton") || xlObj.XLRibbon._disableButtons(["Home_Clipboard_PasteOptions"], "ejSplitButton"));
                if (xlObj.isPasteValuesOnly)
                    $("#" + xlObj._id + "_Ribbon_Paste").data("ejMenu").disableItemByID("PasteSpecial");
            }
            if ($.isEmptyObject(filterColl))
                this._disableButtons(["Data_SortFilter_ClearFilter"], "ejButton");
            fKeylen = xlObj.getObjectKeys(filterColl);
            for (i = 0, len = fKeylen.length; i < len; i++) {
                filterKeyCol = xlObj.getObjectKeys(filterColl[fKeylen[i]]);
                for (j = 0, len = filterKeyCol.length; j < len; j++) {
                    if (filterColl[fKeylen[i]][filterKeyCol[j]].status.indexOf("e-ssfiltered") < 0)
                        this._disableButtons(["Data_SortFilter_ClearFilter"], "ejButton");
                }
            }
            xlObj._updateUndoRedoIcons();
        },

        _disableRibbonIcons: function () {
            var xlObj = this.XLObj;
            if (!xlObj.model.showRibbon)
                return;
            var rObj = $("#" + xlObj._id + "_Ribbon").data("ejRibbon");
            switch (rObj.getTabText(rObj.model.selectedItemIndex)) {
                case xlObj._getLocStr("HOME"):
                    this._disableButtons(this._homeBtnIds, "ejButton");
                    this._disableButtons(this._homeSptBtnIds, "ejSplitButton");
                    this._disableButtons(this._homeToggleBtnIds, "ejToggleButton");
                    this._disableButtons(this._homeDdIds, "ejDropDownList");
                    this._disableButtons(this._homeCpIds, "ejColorPicker");
                    xlObj.addClass(rObj.element.find("#" + rObj._id + "_Number_e-groupexpander"), "e-disable");
                    break;
                case xlObj._getLocStr("INSERT"):
                    this._disableButtons(this._insertBtnIds, "ejButton");
                    this._disableButtons(this._insertSptBtnIds, "ejSplitButton");
                    break;
                case xlObj._getLocStr("DATATAB"):
                    this._disableButtons(this._dataBtnIds, "ejButton");
                    this._disableButtons(this._dataSptBtnIds, "ejSplitButton");
                    break;
                case xlObj._getLocStr("PAGELAYOUT"):
                    this._disableButtons(this._pageLayBtnIds, "ejButton");
                    this._disableButtons(this._pageLaySptBtnIds, "ejSplitButton");
                    this._disableButtons(this._pageLayChckBxIds, "ejCheckBox");
                    $("#" + rObj._id + "_pagesetup_viewhdrlbl:eq(0)").addClass("e-disable");
                    $("#" + rObj._id + "_pagesetup_viewgrdlnlbl:eq(0)").addClass("e-disable");
                    break;
                case xlObj._getLocStr("REVIEW"):
                    this._disableButtons(this._cmntBtnIds, "ejButton");
                    this._disableButtons(this._cmntTglBtnIds, "ejToggleButton");
                    this._disableButtons(this._reviewTglBtnIds, "ejToggleButton");
                    break;
                case xlObj._getLocStr("OTHERS"):
                    this._disableButtons(this._othersBtnIds, "ejButton");
                    this._disableButtons(this._othersSptBtnIds, "ejSplitButton");
                    break;
                case this.XLObj._getLocStr("Design"):
                    this._disableButtons(this._contextualBtnIds, "ejButton");
                    this._disableButtons(this._contextualCheckBoxIds, "ejCheckBox");
                    this._disableInputs(this._contextualInputIds, true);
                    break;
            }
        },

        _capitalize: function (s) {
            return s[0].toUpperCase() + s.slice(1);
        },

        _generateToggleBtn: function (id, text, contentType, prefixIcon, title, width, height, content, isSeparator, cssClass, imagePosition, actText, actImg, togggleState, shortCuts) {
            var conText = content instanceof Array ? this.XLObj._getLocStr(content[0]) + "<br /><br />" + this.XLObj._getLocStr(content[1]) : this.XLObj._getLocStr(content);
            return {
                id: id,
                toolTip: this.XLObj._getLocStr(text),
                type: ej.Ribbon.type.toggleButton,
                enableSeparator: isSeparator,
                toggleButtonSettings: {
                    width: width,
                    height: height,
                    contentType: contentType,
                    cssClass: cssClass,
                    toggleState: togggleState,
                    defaultPrefixIcon: prefixIcon,
                    activePrefixIcon: actImg ? actImg : prefixIcon,
                    defaultText: this.XLObj._getLocStr(text),
                    activeText: actText ? this.XLObj._getLocStr(actText) : this.XLObj._getLocStr(text),
                    imagePosition: imagePosition == "imagetop" ? ej.ImagePosition.ImageTop : ej.ImagePosition.ImageLeft,
                    click: this._ribbonClickHandler
                },
                customToolTip:
                {
                    title: shortCuts ? this.XLObj._getLocStr(title) + shortCuts : this.XLObj._getLocStr(title),
                    content: "<h6>" + conText + "</h6>"
                }
            };
        },

        _generateBtn: function (id, text, contentType, prefixIcon, width, height, title, content, isSeparator, imagePosition, cssClass, shortCuts) {
            var conText = content instanceof Array ? this.XLObj._getLocStr(content[0]) + "<br /><br />" + this.XLObj._getLocStr(content[1]) : this.XLObj._getLocStr(content);
            return {
                id: id,
                text: this.XLObj._getLocStr(text),
                toolTip: this.XLObj._getLocStr(text),
                cssClass: cssClass,
                enableSeparator: isSeparator,
                buttonSettings: {
                    type: ej.Ribbon.type.button,
                    contentType: contentType,
                    width: width,
                    height: height,
                    imagePosition: imagePosition == "imagetop" ? ej.ImagePosition.ImageTop : ej.ImagePosition.ImageLeft,
                    prefixIcon: prefixIcon,
                    click: this._ribbonClickHandler
                },
                customToolTip:
                {
                    title: shortCuts ? this.XLObj._getLocStr(title) + shortCuts : this.XLObj._getLocStr(title),
                    content: "<h6>" + conText + "</h6>",
                }
            };
        },

        _generateDD: function (id, text, data, value, width, height, title, content) {
            return {
                id: id,
                text: this.XLObj._getLocStr(text),
                toolTip: this.XLObj._getLocStr(text),
                type: ej.Ribbon.type.dropDownList,
                dropdownSettings: {
                    dataSource: data,
                    value: value,
                    change: this._ribbonClickHandler,
                    width: width,
                    height: height - 1,
                    cssClass: "e-" + this.XLObj._id + "-ddl"
                },
                customToolTip:
                {
                    title: this.XLObj._getLocStr(title),
                    content: "<h6>" + this.XLObj._getLocStr(content) + "</h6>"
                }
            };
        },

        _generateCustomControl: function (contentId, toolTip, title, content) {
            return {
                type: ej.Ribbon.type.custom,
                contentID: contentId,
                toolTip: this.XLObj._getLocStr(toolTip),
                click: this._ribbonClickHandler,
                change: this._ribbonClickHandler,
                customToolTip:
                {
                    title: this.XLObj._getLocStr(title),
                    content: "<h6>" + this.XLObj._getLocStr(content) + "</h6>"
                }
            };
        },

        _generateSplitBtn: function (id, text, contentType, targetId, fields, prefixIcon, isSeparator, width, height, arrowPos, imagePosition, btnMode, cssClass, title, content, shortCuts) {
            var conText = content instanceof Array ? this.XLObj._getLocStr(content[0]) + "<br /><br />" + this.XLObj._getLocStr(content[1]) : this.XLObj._getLocStr(content);
            return {
                id: id,
                toolTip: this.XLObj._getLocStr(text),
                text: this.XLObj._getLocStr(text),
                type: ej.Ribbon.type.splitButton,
                cssClass: cssClass + " e-" + this.XLObj._id + "-spltbtn",
                enableSeparator: isSeparator,
                splitButtonSettings: {
                    contentType: contentType,
                    targetID: targetId,
                    arrowPosition: arrowPos == "bottom" ? ej.ArrowPosition.Bottom : ej.ArrowPosition.Right,
                    imagePosition: imagePosition == "imagetop" ? ej.ImagePosition.ImageTop : ej.ImagePosition.ImageLeft,
                    buttonMode: btnMode == "dropdown" ? ej.ButtonMode.Dropdown : ej.ButtonMode.Split,
                    fields: fields,
                    prefixIcon: prefixIcon,
                    click: this._ribbonClickHandler,
                    itemSelected: this._ribbonClickHandler,
                    height: height,
                    width: width,
                    beforeOpen: $.proxy(this._splitBeforeOpen, this, id),
                    close: (id === "Home_Font_Border" || "Others_Cells_InsertCellOptions" || id === "Others_Cells_DeleteCellOptions" || id === "Data_DataTools_DataValidationOptions" || id === "Home_Clipboard_PasteOptions") ? $.proxy(this._splitbtnClose, this, id) : null,
                },
                customToolTip:
                {
                    title: shortCuts ? this.XLObj._getLocStr(title) + shortCuts : this.XLObj._getLocStr(title),
                    content: "<h6>" + conText + "</h6>"
                }
            };
        },

        _splitBeforeOpen: function (id, args) {
            var xlObj = this.XLObj;
            if (id === "Home_Editing_SortFilter")
                this._sfbeforeOpen(args);
            else if (id === "Others_Cells_InsertCellOptions" || id === "Others_Cells_DeleteCellOptions")
                this._insdelbeforOpen(args);
            else if (id === "Others_Window_FreezePanes")
                this._fpbeforeOpen(args);
            else if (id === "ChartDesign_ChartLayouts_AddChartElement")
                this._celementpbeforeOpen(args);
            else if (id === "Data_DataTools_DataValidationOptions" || id === "Home_Clipboard_PasteOptions")
                this._validpasteOpen(args);
            else if (id === "Home_Editing_Clear")
                this._clearbeforeOpen(args);
            else if (id === "Home_Styles_FormatAsTable") {
                var frmtTab = document.getElementById(xlObj._id + "_formatastable");
                if (!frmtTab || frmtTab && !frmtTab.children.length)
                    this._renderFormatAsTable();
                xlObj.XLFormat._resizeFormatTableMenu();
            }
            else if (id === "Home_Styles_CellStyles")
                xlObj.XLFormat._resizeStyleMenu();
            else if (id === "Home_Font_Border") {
                xlObj.XLFormat._resizeBorderMenu(args);
                this._renderBorderCP(args);
                var len, winHght = window.innerHeight, licollection, brdrElement = $("#" + this.XLObj._id + "_Ribbon_Home_Font_Border")[0].getBoundingClientRect(), brdrLiElement = $("#" + this.XLObj._id + "_Ribbon_Border"),
                    menuObj = brdrLiElement.data("ejMenu"), customUp = brdrLiElement.find("#" + this.XLObj._id + "_customup")[0], customDown = brdrLiElement.find("#" + this.XLObj._id + "_customdown")[0], grpPanel = $("#" + this.XLObj._id + "GroupPanel"),
                    licollection = brdrLiElement.children(), len = licollection.length, numItem = Math.round((winHght - (brdrElement.top + brdrElement.height)) / 26);// 26 li element height
                  if (len * 26 > winHght - (brdrElement.top + brdrElement.height)) {
                    if (ej.isNullOrUndefined(customUp) && ej.isNullOrUndefined(customDown)) {
                        menuObj.insert([{ id: this.XLObj._id + "_customdown", parentId: null, text: " ", spriteCssClass: 'e-icon e-chevron-down' }], "#" + this.XLObj._id + "_Ribbon_Border");
                        menuObj.insertBefore([{ id: this.XLObj._id + "_customup", parentId: null, text: " ", spriteCssClass: 'e-icon e-chevron-up' }], "#" + this.XLObj._id + "_Ribbon_Border");
                        customUp = brdrLiElement.find("#" + this.XLObj._id + "_customup")[0], customDown = brdrLiElement.find("#" + this.XLObj._id + "_customdown")[0];
                        if (xlObj._browserDetails.name === "msie" && xlObj._browserDetails.version === "8.0") {
                            customUp.attachEvent("onclick", this._menuclick, true);
                            customDown.attachEvent("onclick", this._menuclick, true);
                        }
                        else {
                            customUp.addEventListener("click", this._menuclick, true);
                            customDown.addEventListener("click", this._menuclick, true);
                        }
                        xlObj.addClass(customUp.querySelector("span"), "e-customup");
                        xlObj.addClass(customDown.querySelector("span"), "e-customup")
                    }
                    for (var i = 1 ; i < len-1; i++)
                        xlObj.addClass(licollection[i], "e-hide");
                    for (var i = 0; i < numItem - 2; i++)
                        xlObj._removeClass(licollection[i], "e-hide");
                    menuObj.disableItemByID(customUp.id);
                    menuObj.enableItemByID(customDown.id);
                }
                else if(!ej.isNullOrUndefined(customUp) && !ej.isNullOrUndefined(customDown))
                {
                    xlObj.addClass(customUp, "e-hide");
                    xlObj.addClass(customDown, "e-hide");
                }
            }
            else if (id === "Home_Styles_ConditionalFormatting") {
                $("#" + xlObj._id + "_CFormat").width(200);
                xlObj._phoneMode ? $("#" + xlObj._id + "_CFormat").find("ul").addClass("e-adaptive") : $("#" + xlObj._id + "_CFormat").find("ul").removeClass("e-adaptive");
            }
            else if (id == "Others_CalCulation_CalculationOptions") {
                if (xlObj._calcEngine.getCalculatingSuspended()) {
                    $("#" + xlObj._id + "_CalcManual").find("span").addClass("e-ss-calcauto");
                    $("#" + xlObj._id + "_CalcAuto").find("span").removeClass("e-ss-calcauto");
                }
                else {
                    $("#" + xlObj._id + "_CalcAuto").find("span").addClass("e-ss-calcauto");
                    $("#" + xlObj._id + "_CalcManual").find("span").removeClass("e-ss-calcauto");
                }
            }
        },

        _menuclick: function (event) {
            event.stopImmediatePropagation();
            if (event.target) {
                var element = event.currentTarget, parentElem = $("#" + element.parentElement.id), liCollection = parentElem.children(), menuObj = parentElem.data("ejMenu"), customUp = parentElem.children()[0], customDown = parentElem.children()[18],
                    visibleItems = $("#" + element.parentElement.id).find("li:visible"), lastChild = visibleItems[visibleItems.length - 2], lastChildIdx = $(lastChild).index(), firstChild = visibleItems[1], firstChildIdx = $(firstChild).index();
                if (event.currentTarget.id.indexOf("customup") > 0) {
                    if (firstChild.id != "bottom") {
                        for (var i = 1; i < 3; i++) {
                            visibleItems.eq(visibleItems.length - (i + 1)).addClass("e-hide");
                            liCollection.eq(firstChildIdx - i).removeClass("e-hide");
                        }
                        if ($(customDown).hasClass("e-disable-item"))
                            menuObj.enableItemByID(customDown.id);
                    }
                    else if (firstChild.id == "bottom")
                        menuObj.disableItemByID(customUp.id);
                }
                else {
                    if (lastChild.id.indexOf("borderstyle") == -1) {
                        for (var i = 1; i < 3; i++) {
                            visibleItems.eq(i).addClass("e-hide");
                            liCollection.eq(lastChildIdx + i).removeClass("e-hide");
                        }
                        if ($(customUp).hasClass("e-disable-item"))
                            menuObj.enableItemByID(customUp.id);
                    }
                    else if (lastChild.id.indexOf("borderstyle") > -1)
                        menuObj.disableItemByID(customDown.id);
                }
            }
        },

        _renderBorderCP: function (args) {
            var xlId = this.XLObj._id, fontStr = xlId + "_Ribbon_Home_Font_", borderCP = $("#" + fontStr + "BorderColor").data("ejColorPicker");
            if (!borderCP) {
                $("#" + fontStr + "BorderColor").ejColorPicker({ modelType: "palette", presetType: "basic", cssClass: "e-ss-colorpicker e-ss-menuclrpkr", change: this._ribbonClickHandler });
                $("#" + fontStr + "BorderColorWrapper").hide();
                $("#" + xlId + "_bordercolor ul li").find("a").remove();
                $("#" + xlId + "_bordercolor ul li").append($("#" + fontStr + "BorderColor_popup"));
                $("#" + fontStr + "BorderColor_popup").css({ "display": "block" });
            }
        },

        _splitbtnClose: function (id, args) {
            if (id == "Home_Font_Border") {
                var liElem = $("#" + this.XLObj._id + "_Ribbon_Border"), menuObj = liElem.data("ejMenu"), lielem = liElem.children(), len = liElem.children().length;
                lielem.removeClass("e-hide");
                if ($(lielem[0]).hasClass("e-disable-item"))
                    menuObj.enableItemByID(lielem[0].id);
                if ($(lielem[len-1]).hasClass("e-disable-item"))
                menuObj.enableItemByID(lielem[len-1].id);
            }
            else
                this.XLObj.element.find("#" + this.XLObj._id + "_Ribbon_" + id).parents("div.e-controlpadding").siblings().children("button").removeClass("e-active");
        },

        _fpbeforeOpen: function (args) {
            var xlObj = this.XLObj, fpaneMenu = $("#" + xlObj._id + "_Ribbon_FPane").data("ejMenu"), dataSource = fpaneMenu.model.fields.dataSource.slice(0);
            if (xlObj.getSheet()._isFreezed) {
                dataSource[0].id = "UnFreezePanes";
                dataSource[0].text = xlObj._getLocStr("UnFreezePanes");
            }
            else {
                dataSource[0].id = "freezePanes";
                dataSource[0].text = xlObj._getLocStr("FreezePanes");
            }
            fpaneMenu.option("fields", { id: "id", dataSource: dataSource, parentId: "parentId" });
        },

        _sfbeforeOpen: function (args) {
            var xlObj = this.XLObj, menuObj = $("#" + xlObj._id + "_Ribbon_SortFilter").data("ejMenu");
            (!xlObj.model.allowFiltering) && menuObj.disableItemByID("Ribbon_Filter");
            if (!xlObj.model.allowSorting) {
                menuObj.disableItemByID("Ribbon_SortAtoZ");
                menuObj.disableItemByID("Ribbon_SortZtoA");
            }
            this._refreshRibbonIcons();
            this._isFilterSelect.isFiltered ? menuObj.enableItemByID("Ribbon_ClearFilter") : menuObj.disableItemByID("Ribbon_ClearFilter");
        },

        _validpasteOpen: function (args) {
            var xlObj = this.XLObj;
            if (args.model.targetID === xlObj._id + "_Ribbon_Validation")
                xlObj.element.find("#" + xlObj._id + "_Ribbon_Data_DataTools_DataValidation").addClass("e-active");
            else
                xlObj.element.find("#" + xlObj._id + "_Ribbon_Home_Clipboard_Paste").addClass("e-active");
        },

        _insdelbeforOpen: function (args) {
            var xlObj = this.XLObj, insMenuObj = $("#" + xlObj._id + "_Ribbon_Ins").data("ejMenu"), delMenuObj = $("#" + xlObj._id + "_Ribbon_Del").data("ejMenu"), colSel, rowSel,
                delids = ["DeleteCells", "DeleteSheetRows", "DeleteSheetColumns"], insids = ["InsertCells", "InsertSheetRows", "InsertSheetColumns"], insDelRows, insDelCols, insDelSheet;
            if (args.model.targetID === xlObj._id + "_Ribbon_Ins")
                xlObj.element.find("#" + xlObj._id + "_Ribbon_Others_Cells_InsertCell").addClass("e-active");
            else
                xlObj.element.find("#" + xlObj._id + "_Ribbon_Others_Cells_DeleteCell").addClass("e-active");
            insDelRows = xlObj.element.find(".e-colselected").length ? "disableItemByID" : "enableItemByID";
            insMenuObj && insMenuObj[insDelRows]("InsertSheetRows");
            delMenuObj && delMenuObj[insDelRows]("DeleteSheetRows");
            insDelCols = xlObj.element.find(".e-rowselected").length ? "disableItemByID" : "enableItemByID";
            insMenuObj && insMenuObj[insDelCols]("InsertSheetColumns");
            delMenuObj && delMenuObj[insDelCols]("DeleteSheetColumns");
            insDelSheet = xlObj.model.exportSettings.password ? "disableItemByID" : "enableItemByID";
            insMenuObj && insMenuObj[insDelSheet]("InsertSheet");
            delMenuObj && delMenuObj[insDelSheet]("DeleteSheet");
            if (xlObj.getSheet(xlObj.getActiveSheetIndex()).isSheetProtected) {
                for (var i = 0; i < 3; i++) {
                    delMenuObj && delMenuObj.disableItemByID(delids[i]);
                    insMenuObj && insMenuObj.disableItemByID(insids[i]);
                }
            }
            else {
                delMenuObj && delMenuObj.enableItemByID("DeleteCells");
                insMenuObj && insMenuObj.enableItemByID("InsertCells");
            }
        },

        _celementpbeforeOpen: function (args) {
            var xlObj = this.XLObj, chartEle = $("#" + xlObj._id + "_chart").val(), chType = xlObj.XLChart._getShapeObj(chartEle, "chart").type,
                cEleMenuObj = $("#" + xlObj._id + "_Ribbon_CElement").data("ejMenu"), pieChart = ["Axes", "AxisTitle", "Gridline"],
                radarChart = ["AxisTitle", "PMinorH", "PMinorV"], menuEle = ["Axes", "AxisTitle", "Gridline", "PMinorH", "PMinorV"], i, len = 0;
            if (cEleMenuObj)
                return false;
            for (i = 0, len = menuEle.length; i < len; i++)
                cEleMenuObj.enableItemByID(menuEle[i]);
            if (chType === "pie" || chType === "doughnut") {
                for (i = 0, len = pieChart.length; i < len; i++)
                    cEleMenuObj.disableItemByID(pieChart[i]);
            }
            else if (chType === "radar") {
                for (i = 0, len = radarChart.length; i < len; i++)
                    cEleMenuObj.disableItemByID(radarChart[i]);
            }
        },

        _clearbeforeOpen: function (args) {
            var xlObj = this.XLObj, i = 0, clearMenuObj = $("#" + xlObj._id + "_Ribbon_Clear").data("ejMenu"), eleId = ["Clear_Hyperlinks", "Clear_Comments"];
            if (xlObj.model.allowLockCell) {
                if (xlObj.getSheet(xlObj.getActiveSheetIndex()).isSheetProtected) {
                    while (i < eleId.length) {
                        clearMenuObj.disableItemByID(eleId[i]);
                        i++;
                    }
                }
                else {
                    while (i < eleId.length) {
                        clearMenuObj.enableItemByID(eleId[i]);
                        i++;
                    }
                }
            }

        },

        _changeClrFltrStatus: function (obj, control, target) {
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), nfat = false, i, j;
            if (xlObj.isUndefined(obj))
                return;

            if (this._isFilterSelect.isFiltered) {
                if (control === "menu")
                    (obj._id.indexOf("Ribbon") > -1) ? obj.enableItemByID("Ribbon_ClearFilter") : obj.enableItemByID("ClearFilter"); else
                    obj.enable();
            }
            else {
                if (control === "menu")
                    (obj._id.indexOf("Ribbon") > -1) ? obj.disableItemByID("Ribbon_ClearFilter") : obj.disableItemByID("ClearFilter");
                else
                    obj.disable();
            }
        },

        _onControlCreated: function () {
            var xlRbn = $("#" + this.XLObj._id + "_Ribbon").ejRibbon("instance");
            this._ctrlCreated = true;
            if (!this.XLObj.model.ribbonSettings.enableOnDemand) {
                this._homeTabControls();
                this._othersTabControls();
                this._pageTabControls();
                this._appTabControls();
            }
            this._hideTabs();
            //Css update
            this._ctrlCreated = false;
        },

        _appTabControls: function () {
            var xlObj = this.XLObj, xlEle = xlObj.element, xlId = xlObj._id, bsBtnOpt = { height: 158, width: 163, text: xlObj._getLocStr("BlankWorkbook"), contentType: "textandimage", imagePosition: "imagetop", prefixIcon: "e-ss-blank", click: $.proxy(this._onBackStageItemClick, this) };
            $("#" + xlId + "_bstab_new_blank").ejButton(bsBtnOpt);
            delete bsBtnOpt.text;
            bsBtnOpt.height = bsBtnOpt.width = 72;
            bsBtnOpt.prefixIcon = "e-icon e-ss-exportxl";
            $("#" + xlId + "_bstab_saveas_excel").ejButton(bsBtnOpt);
            bsBtnOpt.prefixIcon = "e-icon e-ss-exportcsv";
            $("#" + xlId + "_bstab_saveas_csv").ejButton(bsBtnOpt);
            bsBtnOpt.prefixIcon = "e-icon e-ss-exportpdf";
            $("#" + xlId + "_bstab_saveas_pdf").ejButton(bsBtnOpt);
            bsBtnOpt.prefixIcon = "e-icon e-ss-print";
            $("#" + xlId + "_bstab_print_sheet").ejButton(bsBtnOpt);
            bsBtnOpt.prefixIcon = "e-icon e-ss-printselected";
            $("#" + xlId + "_bstab_print_selected").ejButton(bsBtnOpt);
        },
        _othersTabControls: function () {
            var xlObj = this.XLObj;
            if (!xlObj.model.allowInsert && xlObj.model.scrollSettings.allowScrolling) {
                this._disableButtons(["Others_Cells_InsertCellOptions"], "ejSplitButton");
                this._disableButtons(["Others_Cells_InsertCell"], "ejButton");
            }
            if (!xlObj.model.allowDelete && xlObj.model.scrollSettings.allowScrolling) {
                this._disableButtons(["Others_Cells_DeleteCellOptions"], "ejSplitButton");
                this._disableButtons(["Others_Cells_DeleteCell"], "ejButton");
            }
        },

        _pageTabControls: function () {
            var xlObj = this.XLObj, xlId = xlObj._id, rbnId = xlId + "_Ribbon_pagesetup", pageStr = xlId + "_Ribbon_PageLayout_Show_";
            $("#" + rbnId + "left").show();
            $("#" + pageStr + "Headings").ejCheckBox({ change: this._ribbonClickHandler, checked: true });
            $("#" + pageStr + "Gridlines").ejCheckBox({ change: this._ribbonClickHandler, checked: true });
            $("#" + rbnId + "_viewhdrlbl").text(xlObj._getLocStr("Heading"));
            $("#" + rbnId + "_viewgrdlnlbl").text(xlObj._getLocStr("Gridlines"));
        },

        _homeTabControls: function () {
            var xlObj = this.XLObj, xlId = xlObj._id, xlEle = xlObj.element, rbnId = xlId + "_Ribbon_", fontStr = rbnId + "Home_Font_";
            $("#" + fontStr + "FillColor").ejColorPicker({ value: "#FFFF00", locale: xlObj.model.locale, modelType: "palette", showSwitcher: false, cssClass: "e-ss-colorpicker", toolIcon: "e-ss-backgroundcolor e-icon", open: $.proxy(this._colorPickerHandler, this, "Ribbon_Home_Font_FillColor"), change: $.proxy(this._colorPickerHandler, this, "Ribbon_Home_Font_FillColor"), select: $.proxy(this._cpClickHandler, this, "Ribbon_Home_Font_FillColor") });
            $("#" + fontStr + "FontColor").ejColorPicker({ value: "#FF0000", locale: xlObj.model.locale, modelType: "palette", showSwitcher: false, cssClass: "e-ss-colorpicker", toolIcon: "e-ss-fontcolor e-icon", open: $.proxy(this._colorPickerHandler, this, "Ribbon_Home_Font_FontColor"), change: $.proxy(this._colorPickerHandler, this, "Ribbon_Home_Font_FontColor"), select: $.proxy(this._cpClickHandler, this, "Ribbon_Home_Font_FontColor") });
            $("#" + rbnId + "BorderCP").ejColorPicker({ value: "#278787", displayInline: true, modelType: "picker" });
            $("#" + rbnId + "BorderCP_Presets").hide();
            $("#" + rbnId + "Border").addClass("e-spreadsheet e-border");
            $("#" + fontStr + "FontColor_Presets").css({ top: "40px" });
            $("#" + fontStr + "FillColor_Presets").css({ top: "40px" });
            this._disableButtons(["Home_Clipboard_Paste"], "ejButton");
            this._disableButtons(["Home_Clipboard_PasteOptions", "Others_Formulas_UseInFormula"], "ejSplitButton");
            $("#" + fontStr + "FillColor_popup").find(".e-buttons, .e-button").hide();
            $("#" + fontStr + "FontColor_popup").find(".e-buttons, .e-button").hide();
        },

        _hideRibbonElem: function (tabName) {
            var xlObj = this.XLObj, xlId = xlObj._id, rObj = $("#" + xlObj._id + "_Ribbon").data("ejRibbon"), model = xlObj.model, rObjElem = rObj.element;
            var rbnId = xlId + "_Ribbon", ClpStr = rbnId + "_home_Clipboard_Home_Clipboard_", algnStr = rbnId + "_home_Alignment_Home_Alignment_", sptrStr = rbnId + "_separator_Home_Alignment_", homeStyStr = rbnId + "_home_Styles_Home_Styles_";
            var fontStr = rbnId + "_home_Font_Home_Font_", numberStr = rbnId + "_home_Number_Home_Number_", editStr = rbnId + "_home_Editing_Home_Editing_", insStr = rbnId + "_insert_", dataStr = rbnId + "_data_", layoutStr = rbnId + "_pagelayout_PageLayout";
            var reviewStr = rbnId + "_review_Changes_Review_Changes_", othrStr = rbnId + "_others_";
            if (!model.allowFormulaBar)
                xlObj.hideFormulaBar();
            if (xlObj.model.ribbonSettings.applicationTab.type === "menu")
                var menuObj = $('#' + xlId + '_Menu').data("ejMenu");
            switch (tabName) {
                case xlObj._getLocStr("HOME"):
                    if (!model.allowAutoSum && !model.allowFiltering && !model.allowUndoRedo && !model.allowSorting && !model.allowClipboard && !model.allowFormatPainter && !model.allowCellFormatting && !model.allowMerging && !model.allowWrap && !model.allowConditionalFormats && !model.allowFormatAsTable)
                        rObj.hideTab(xlObj._getLocStr("HOME"));
                    if (!model.allowFormatPainter)
                        rObjElem.find("#" + ClpStr + "FormatPainter").hide();
                    if (!model.allowClipboard) {
                        rObjElem.find("#" + rbnId + "_home_Clipboard_1").hide();
                        rObjElem.find("#" + ClpStr + "Cut").hide();
                        rObjElem.find("#" + ClpStr + "Copy").hide();
                    }
                    if (!model.allowClipboard && !model.allowFormatPainter)
                        rObjElem.find("#" + rbnId + "_home_Clipboard").hide();
                    if (!model.allowCellFormatting) {
                        rObjElem.find("#" + rbnId + "_home_Font").hide();
                        rObjElem.find("#" + rbnId + "_home_Number").hide();
                        rObjElem.find("#" + algnStr + "TopAlign").hide();
                        rObjElem.find("#" + algnStr + "MiddleAlign").hide();
                        rObjElem.find("#" + algnStr + "BottomAlign").hide();
                        rObjElem.find("#" + sptrStr + "BottomAlign").hide();
                        rObjElem.find("#" + algnStr + "AlignLeft").hide();
                        rObjElem.find("#" + algnStr + "AlignCenter").hide();
                        rObjElem.find("#" + algnStr + "AlignRight").hide();
                        rObjElem.find("#" + sptrStr + "AlignRight").hide();
                        rObjElem.find("#" + algnStr + "DecreaseIndent").hide();
                        rObjElem.find("#" + algnStr + "IncreaseIndent").hide();
                        rObjElem.find("#" + sptrStr + "IncreaseIndent").hide();
                        rObjElem.find("#" + homeStyStr + "CellStyles").hide();
                        if (!model.allowConditionalFormats && !model.allowFormatAsTable)
                            rObjElem.find("#" + rbnId + "_home_Styles").hide();
                    }
                    if (model.allowCellFormatting) {
                        if (!model.formatSettings.allowFontFamily)
                            rObjElem.find("#" + fontStr + "FontFamily").hide();
                        if (!model.formatSettings.allowDecimalPlaces) {
                            rObjElem.find("#" + numberStr + "IncreaseDecimal").hide();
                            rObjElem.find("#" + numberStr + "DecreaseDecimal").hide();
                            rObjElem.find("#" + rbnId + "_separator_Home_Number_CommaStyle").hide();
                        }
                        if (!model.formatSettings.allowCellBorder)
                            rObjElem.find("#" + fontStr + "Border").hide();
                    }
                    if (!model.allowMerging)
                        rObjElem.find("#" + algnStr + "Merge").hide();
                    if (!model.allowWrap)
                        rObjElem.find("#" + algnStr + "WrapText").hide();
                    if (!model.allowUndoRedo)
                        rObjElem.find("#" + rbnId + "_home_Actions").hide();
                    if (!model.allowFormatAsTable)
                        rObjElem.find("#" + homeStyStr + "FormatAsTable").hide();
                    if (!model.allowConditionalFormats && !model.allowFormatAsTable && !model.allowCellFormatting)
                        rObjElem.find("#" + rbnId + "_home_Styles").hide();
                    if (!model.allowConditionalFormats)
                        rObjElem.find("#" + homeStyStr + "ConditionalFormatting").hide();
                    if (model.allowEditing) {
                        if (!model.allowAutoSum)
                            rObjElem.find("#" + editStr + "AutoSum").hide();
                        if (!model.allowSorting && !model.allowFiltering)
                            rObjElem.find("#" + xlObj._id + "_Ribbon_home_Editing_1").hide();
                    }
                    if (!model.allowAutoSum)
                        rObjElem.find("#" + editStr + "AutoSum").hide();
                    if (!model.allowClear)
                        rObjElem.find("#" + editStr + "Clear").hide();
                    break;
                case xlObj._getLocStr("INSERT"):
                    if (!model.allowFormatAsTable && !model.allowPictures && !model.allowHyperlink && !model.allowCharts && !model.allowSparkline)
                        rObj.hideTab(xlObj._getLocStr("INSERT"));
                    if (!model.enablePivotTable && !model.allowFormatAsTable) {
                        rObjElem.find("#" + insStr + "Tables").hide();
                        rObjElem.find("#" + homeStyStr + "FormatAsTable").hide();
                        rObjElem.find("#" + insStr + "Tables_Insert_Tables_PivotTable").hide();
                    }
                    else if (!model.enablePivotTable)
                        rObjElem.find("#" + insStr + "Tables_Insert_Tables_PivotTable").hide();
                    else if (!model.allowFormatAsTable)
                        rObjElem.find("#" + insStr + "Tables_Insert_Tables_Table").hide();
                    if (!model.pictureSettings.allowPictures)
                        rObjElem.find("#" + insStr + "Illustrations").hide();
                    if (!model.allowHyperlink)
                        rObjElem.find("#" + insStr + "Links").hide();
                    if (!model.allowCharts)
                        rObjElem.find("#" + insStr + "Charts").hide();
                    if (!model.allowSparkline)
                        rObjElem.find("#" + insStr + "SparklineCharts").hide();
                    if (!model.allowFormatAsTable && !model.enablePivotTable)
                        rObjElem.find("#" + insStr + "Tables").hide();
                    break;
                case xlObj._getLocStr("DATATAB"):
                    if (!model.allowDataValidation && !model.allowFiltering && !model.allowSorting)
                        rObj.hideTab(xlObj._getLocStr("DATATAB"));
                    if (!model.allowFiltering)
                        rObjElem.find("#" + dataStr + "SortFilter_2").hide();
                    if (!model.allowSorting)
                        rObjElem.find("#" + dataStr + "SortFilter_1").hide();
                    if (!model.allowDataValidation)
                        rObjElem.find("#" + dataStr + "DataTools").hide();
                    if (!model.allowFiltering && !model.allowSorting)
                        rObjElem.find("#" + dataStr + "Sort").hide();
                    break;
                case xlObj._getLocStr("PAGELAYOUT"):
                    if (!model.printSettings.allowPrinting)
                        rObj.hideTab(xlObj._getLocStr("PAGELAYOUT"));
                    if (!model.printSettings.allowPrinting)
                        rObjElem.find("#" + layoutStr + "Print_Print").hide();
                    if (!model.printSettings.allowPageSize)
                        rObjElem.find("#" + layoutStr).hide();

                    if (!model.allowComments && !model.allowLockCell)
                        rObj.hideTab(xlObj._getLocStr("REVIEW"));
                    if (!model.allowLockCell) {
                        rObjElem.find("#" + reviewStr + "ProtectSheet").hide();
                        rObjElem.find("#" + reviewStr + "LockCell").hide();
                    }
                    if (!model.allowComments)
                        rObjElem.find("#" + rbnId + "_review_Comments").hide();
                    break;
                case xlObj._getLocStr("OTHERS"):
                    if (!model.allowFreezing && !model.allowInsert && !model.allowDelete && !model.allowSearching)
                        rObj.hideTab(xlObj._getLocStr("OTHERS"));
                    if (!model.allowInsert && !model.allowDelete)
                        rObjElem.find("#" + othrStr + "Cells").hide();
                    if (!model.allowInsert)
                        rObjElem.find("#" + othrStr + "Cells_1").hide();
                    if (!model.allowDelete)
                        rObjElem.find("#" + othrStr + "Cells_2").hide();
                    if (!model.allowFreezing)
                        xlObj._phoneMode ? rObjElem.find("#" + othrStr + "Window_1").hide() : rObjElem.find("#" + othrStr + "Window").hide();
                    if (!model.allowSearching)
                        rObjElem.find("#" + othrStr + "Editing").hide();
                    break;
            }
            if (!model.allowImport || !model.importSettings.importMapper) {
                rObjElem.find("#open_backStageTab").hide();
                if (menuObj)
                    menuObj.disableItemByID("Open");
            }
            if (model.serverEvents) {
                var serverEvents = model.serverEvents;
                if (serverEvents.indexOf("excelExporting") < 0 && !model.exportSettings.excelUrl) {
                    rObjElem.find('#' + xlId + '_backstagetabsaveas .e-ssr-bssaveasopt:eq(0)').hide();
                    if (menuObj)
                        menuObj.disableItemByID("ExportXL");
                }
                if (serverEvents.indexOf("csvExporting") < 0 && !model.exportSettings.csvUrl) {
                    rObjElem.find('#' + xlId + '_backstagetabsaveas .e-ssr-bssaveasopt:eq(1)').hide();
                    if (menuObj)
                        menuObj.disableItemByID("ExportCsv");
                }
                if (serverEvents.indexOf("pdfExporting") < 0 && !model.exportSettings.pdfUrl) {
                    rObjElem.find('#' + xlId + '_backstagetabsaveas .e-ssr-bssaveasopt:eq(2)').hide();
                    if (menuObj)
                        menuObj.disableItemByID("ExportPdf");
                }
                if (!serverEvents.length && !model.exportSettings.excelUrl && !model.exportSettings.csvUrl && !model.exportSettings.pdfUrl) {
                    rObjElem.find("#saveas_backStageTab").hide();
                    if (menuObj)
                        menuObj.disableItemByID("Save");
                }
            }
            else {
                if (!model.exportSettings.excelUrl) {
                    rObjElem.find('#' + xlId + '_backstagetabsaveas .e-ssr-bssaveasopt:eq(0)').hide();
                    if (menuObj)
                        menuObj.disableItemByID("ExportXL");
                }
                if (!model.exportSettings.csvUrl) {
                    rObjElem.find('#' + xlId + '_backstagetabsaveas .e-ssr-bssaveasopt:eq(1)').hide();
                    if (menuObj)
                        menuObj.disableItemByID("ExportCsv");
                }
                if (!model.exportSettings.pdfUrl) {
                    rObjElem.find('#' + xlId + '_backstagetabsaveas .e-ssr-bssaveasopt:eq(2)').hide();
                    if (menuObj)
                        menuObj.disableItemByID("ExportPdf");
                }
                if (!model.exportSettings.allowExporting || (!model.exportSettings.excelUrl) && !(model.exportSettings.csvUrl) && !(model.exportSettings.pdfUrl)) {
                    rObjElem.find("#saveas_backStageTab").hide();
                    if (menuObj)
                        menuObj.disableItemByID("Save");
                }
            }
            if (!model.printSettings.allowPrinting)
                rObjElem.find("#print_backStageTab").hide();
        },

        _pictureSizeChange: function (name, args) {
            var xlObj = this.XLObj, newVal, sheetIndex = xlObj.getActiveSheetIndex(), elem = xlObj.getSheetElement(sheetIndex).find(".e-ss-activeimg"), details = { sheetIndex: sheetIndex, reqType: "shape", shapeType: "picture", action: "picturesize", name: name, id: $(elem).attr("id"), prev: {}, cur: {} };
            if (xlObj._shapeChange || this._isSetModel)
                return;
            details.prev = { width: elem.width(), height: elem.height() };
            if (name === "PictureHeight") {
                newVal = parseInt((elem.height() * args.value) / elem.width());
                elem.css({ width: args.value, height: newVal });
                details.cur = { width: args.value, height: newVal };
            }
            else {
                newVal = parseInt((elem.width() * args.value) / elem.height());
                elem.css({ height: args.value, width: newVal });
                details.cur = { height: args.value, width: newVal };
            }
            this._isSetModel = true;
            $("#" + xlObj._id + "_Ribbon_Format_Size_" + name).ejNumericTextbox("option", { value: newVal });
            this._isSetModel = false;
            xlObj._completeAction(details);
            xlObj._trigActionComplete(details);
            xlObj.XLShape._updateShapeObj(elem[0]);
        },

        _chartTypeOk: function (args) {
            var xlObj = this.XLObj, id = xlObj.element.find("#" + xlObj._id + "_chart").val(), chartObj = $("#" + id).data('ejChart'), details, chartType, className, allChart, markerChart, option;
            className = $("#" + xlObj._id + "_allchart").find(".e-chartselect:eq(0)").attr("class").split(" ")[1], chartType = className.split("e-dlg")[1].split("chart");
            allChart = ["e-dlgcolumnchart4", "e-dlgcolumnchart5", "e-dlgcolumnchart6", "e-dlgbarchart4", "e-dlgbarchart5", "e-dlgbarchart6", "e-dlgpiechart2"];
            markerChart = ["e-dlgstockchart2", "e-dlglinechart2", "dlgradarchart2"], option = { type: chartType[0], enable3D: false, marker: { visible: false } };
            if (chartType[0] === "column" || chartType[0] === "bar" || chartType[0] === "area") {
                if (chartType[1] === "1" || chartType[1] === "4")
                    option["type"] = chartType[0];
                else if (chartType[1] === "2" || chartType[1] === "5")
                    option["type"] = "stacking" + chartType[0];
                else if (chartType[1] === "3" || chartType[1] === "6")
                    option["type"] = "stacking" + chartType[0] + "100";
            }
            allChart.indexOf(className) > -1 && (option["enable3D"] = true);
            markerChart.indexOf(className) > -1 && (option["marker"] = { visible: true });
            className === "e-dlgpiechart3" && (option["type"] = "doughnut");
            details = { sheetIndex: xlObj.getActiveSheetIndex(), reqType: "shape", shapeType: "chart", action: "chartType", chartId: id };
            details.prev = { chartType: chartObj.model.series[0].type, enable3D: chartObj.model.enable3D, marker: chartObj.model.series[0].marker.visible };
            option["series"] = chartObj.model.series;
            xlObj.XLChart.refreshChart(id, option);
            details.cur = { chartType: chartObj.model.series[0].type, enable3D: chartObj.model.enable3D, marker: chartObj.model.series[0].marker.visible };
            $("#" + xlObj._id + "_charttypedlg").ejDialog("close");
            xlObj._completeAction(details);
            xlObj._trigActionComplete(details);

        },
        _chartTypeCancel: function (args) {
            var xlObj = this.XLObj;
            $("#" + xlObj._id + "_charttypedlg").ejDialog("close");
            xlObj._setSheetFocus();
        },

        _chartType: function (chart, len, cnt, typecnt, type, title) {
            var cell, childs, child, elem, i, parent, typ, hdr = "<div class='e-chartheader'><span>", elem = "<div class='e-chartcontent'>",
                chartIcon = chart.toLowerCase(), obj = { visible: false }, xlObj = this.XLObj, text = xlObj._getLocStr(chart), dim = "2-D";
            for (i = 0; i < len; i++) {
                cell = "<div class='e-ss-" + xlObj._id + " e-chartcell e-" + chartIcon + (i + 1) + "' title=" + title[i] + "></div>";
                elem += cell;
                if (i === cnt)
                    elem += "</div>" + hdr + "3-D " + text + "</span></div><div class='e-chartcontent'>";
            }
            elem += "</div>";
            if (chart === "ScatterChart" || chart === "StockChart" || chart === "PieChart")
                dim = "";
            parent = $("<div id=" + xlObj._id + "_Ribbon_" + chart + " class='e-ss-dialog e-ss-chart e-ss-" + xlObj._id + "' style='height:auto;'>" + hdr + dim + text + "</span></div>" + elem + "</div>");
            childs = parent.find(".e-chartcell");
            for (i = 0; i < len; i++) {
                child = $(childs[i]);
                typ = type[i];
                child.data({ type: typ, enable3D: false, marker: obj });
                if (i > typecnt)
                    child.data({ type: typ, enable3D: true, marker: obj });
            }
            elem = $(parent).find(".e-" + chartIcon + "2");
            if (chart === "StockChart" || chart === "LineChart")
                elem.data({ marker: { visible: true } });
            if (chart === "PieChart")
                elem.data({ enable3D: true });
            xlObj.element[0].appendChild(parent[0]);
        },

        autoSum: function (type, range) {
            if (!this.XLObj.model.allowAutoSum)
                return;
            var xlObj = this.XLObj, xlEdit = xlObj.XLEdit, sheetIdx = xlObj.getActiveSheetIndex(), elem, cellIdx = xlObj.getActiveCell(sheetIdx), sCell = false, value;
            if (ej.isNullOrUndefined(cellIdx))
                return;
            var i, inputElem, colLen, actCell = xlObj.getActiveCell(sheetIdx);
            var alphRange, rangeIdx = xlObj._getRangeArgs(range, "object"), selectCell = xlObj._getSelectedCells(sheetIdx, rangeIdx).selCells, cellCnt = selectCell.length - 1;
            var rowCnt = selectCell[cellCnt].rowIndex - selectCell[0].rowIndex, colCnt = selectCell[cellCnt].colIndex - selectCell[0].colIndex, details = { sheetIndex: sheetIdx, range: range, reqType: "auto-sum", oprType: type, updCell: [] };
            var rowIdx, colIdx, cell, textLength = xlObj.getRangeData({ range: [selectCell[0].rowIndex, selectCell[0].colIndex, selectCell[cellCnt].rowIndex, selectCell[cellCnt].colIndex], valueOnly: true }).length, container = xlObj._dataContainer.sheets[sheetIdx];
            if (cellCnt === 0 || !textLength) {
                rowIdx = cellIdx.rowIndex; colIdx = cellIdx.colIndex;
                details.updCell.push({ rowIndex: rowIdx, colIndex: colIdx, pObj: {}, pValue: ej.isNullOrUndefined(xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "value2")) ? "" : xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "value2") });
                (ej.isNullOrUndefined(container[rowIdx])) && (container[rowIdx] = {});
                (ej.isNullOrUndefined(container[rowIdx][colIdx])) && (container[rowIdx][colIdx] = {});
                $.extend(true, details.updCell[0].pObj, container[rowIdx][colIdx]);
                if (!xlObj._isRowViewable(sheetIdx, actCell.rowIndex))
                    xlObj.XLScroll._scrollSelectedPosition(sheetIdx, actCell);
                xlEdit.editCell(actCell.rowIndex, actCell.colIndex, true);
                if (xlObj.model.allowFormulaBar)
                    xlObj._getInputBox().val("=" + type + "()");
                if (xlObj._isRowViewable(sheetIdx, rowIdx)) {
                    xlObj.XLEdit._editElem.text("=" + type + "()");
                    xlObj.XLEdit._editElem.focusEnd();
                }
                sCell = true;
            }
            else if (rowCnt === 0 && colCnt > 0) {
                alphRange = xlObj._getAlphaRange(sheetIdx, selectCell[0].rowIndex, selectCell[0].colIndex, selectCell[cellCnt].rowIndex, selectCell[cellCnt].colIndex);
                rowIdx = selectCell[cellCnt].rowIndex; colIdx = selectCell[cellCnt].colIndex + 1;
                value = this.XLObj.XLEdit.getPropertyValue(rowIdx, colIdx, "value2");
                while (!ej.isNullOrUndefined(value) && value != "") {
                    colIdx++
                    value = this.XLObj.XLEdit.getPropertyValue(rowIdx, colIdx, "value2");
                }
                if (colIdx === xlObj.getSheet(sheetIdx).colCount)
                    xlObj.XLScroll._createNewColumn(sheetIdx, { rowIndex: -1, colIndex: -1 }, { rowIndex: -1, colIndex: -1 }, "insert");
                !xlObj._isUndoRedo && details.updCell.push({ rowIndex: rowIdx, colIndex: colIdx, pObj: {}, pValue: ej.isNullOrUndefined(xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "value2")) ? "" : xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "value2") });
                (ej.isNullOrUndefined(container[rowIdx])) && (container[rowIdx] = {});
                (ej.isNullOrUndefined(container[rowIdx][colIdx])) && (container[rowIdx][colIdx] = {});
                !xlObj._isUndoRedo && $.extend(true, details.updCell[0].pObj, container[rowIdx][colIdx]);
                if (xlObj._isRowViewable(sheetIdx, rowIdx)) {
                    cell = xlObj.getCell(rowIdx, colIdx, sheetIdx);
                    cell.addClass("e-ralign");
                }
                xlEdit._updateCellValue({ rowIndex: rowIdx, colIndex: colIdx }, "=" + type + "(" + alphRange + ")");
                if ('COUNT'.indexOf(type) < 0)
                    xlObj._autosumFormatUpdate(xlObj.getRangeData({ range: [selectCell[0].rowIndex, selectCell[0].colIndex, selectCell[0].rowIndex, selectCell[0].colIndex] })[0], [rowIdx, colIdx, rowIdx, colIdx], false, false);
            }
            else {
                colLen = selectCell[cellCnt].colIndex - selectCell[0].colIndex;
                rowIdx = selectCell[cellCnt].rowIndex + 1;
                for (i = 0; i <= colLen; i++) {
                    colIdx = selectCell[i].colIndex;
                    value = this.XLObj.XLEdit.getPropertyValue(rowIdx, colIdx, "value2");
                    var maxRowIdx = rowIdx;
                    while (!ej.isNullOrUndefined(value) && value != "") {
                        rowIdx++;
                        maxRowIdx = rowIdx;
                        value = this.XLObj.XLEdit.getPropertyValue(rowIdx, colIdx, "value2");
                    }
                }
                for (i = 0; i <= colLen; i++) {
                    colIdx = selectCell[i].colIndex;
                    rowIdx = maxRowIdx;
                    if (xlObj.XLEdit.getPropertyValue(selectCell[cellCnt].rowIndex + 1, colIdx, "tableName"))
                        rowIdx = rowIdx - 1;
                    alphRange = xlObj._getAlphaRange(sheetIdx, selectCell[0].rowIndex, colIdx, selectCell[cellCnt].rowIndex, colIdx);
                    if (selectCell[cellCnt].rowIndex === xlObj.getSheet(sheetIdx).rowCount - 1)
                        xlObj.XLScroll._createNewRow(sheetIdx, -1, -1, "insert");
                    !xlObj._isUndoRedo && details.updCell.push({ rowIndex: rowIdx, colIndex: colIdx, pObj: {}, pValue: ej.isNullOrUndefined(xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "value2")) ? "" : xlObj.XLEdit.getPropertyValue(rowIdx, colIdx, "value2") });
                    (ej.isNullOrUndefined(container[rowIdx])) && (container[rowIdx] = {});
                    (ej.isNullOrUndefined(container[rowIdx][colIdx])) && (container[rowIdx][colIdx] = {});
                    !xlObj._isUndoRedo && $.extend(true, details.updCell[i].pObj, container[rowIdx][colIdx]);
                    if (xlObj._isRowViewable(sheetIdx, rowIdx)) {
                        cell = xlObj.getCell(rowIdx, colIdx, sheetIdx);
                        cell.addClass("e-ralign");
                    }
                    xlEdit._updateCellValue({ rowIndex: rowIdx, colIndex: colIdx }, "=" + type + "(" + alphRange + ")");
                    if ('COUNT'.indexOf(type) < 0)
                        xlObj._autosumFormatUpdate(xlObj.getRangeData({ range: [selectCell[0].rowIndex, selectCell[i].colIndex, selectCell[0].rowIndex, selectCell[i].colIndex] })[0], [rowIdx, colIdx, rowIdx, colIdx], false, false);
                }
            }
            xlObj.performSelection({ rowIndex: rangeIdx[0], colIndex: rangeIdx[1] }, { rowIndex: rowIdx, colIndex: colIdx });
            if (!xlObj._isUndoRedo && !sCell) {
                xlObj._completeAction(details);
                xlObj._trigActionComplete(details);
            }
        },

        _openNameManagerDlg: function () {
            var xlObj = this.XLObj, grid;
            xlObj._showDialog(xlObj._id + "_Ribbon_Others_NameManager");
            grid = $("#" + xlObj._id + "_nmgrid").data("ejGrid");
            grid.getContentTable().find('td').addClass("e-ss-emptyrecord")
            if (grid.model.dataSource.length < 1)
                grid.getContentTable().find('td').addClass("e-ss-emptyrecord");
            else
                grid.getContentTable().find('.e-ss-emptyrecord').removeClass("e-ss-emptyrecord");
            this._refreshNMDlg();
            if (xlObj._browserDetails.name == "msie")
                grid.refreshContent();
            $("#" + xlObj._id + "_nmgrid").focus();
        },

        _openFATDlg: function () {
            var xlObj = this.XLObj;
            $('#' + xlObj._id + '_fatnamedlg').ejDialog('open');
            $("#" + xlObj._id + "_fatheader").ejCheckBox("option", "checked", false);
            $("#" + xlObj._id + "_fatname").val('Table' + xlObj._tableCnt).focus().setInputPos($("#" + xlObj._id + "_fatname").val().length);
        },

        _dirtySelect: function () {
            var xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), selCells, tabRange = xlObj.getSheet(sheetIdx).filterSettings.tableRange, isTableCell = false, isDirtyCell = false, isFilterCell = false, isTop = false, isBottom = false, isLeft = false, isRight = false, isRowDirty = false, isColDirty = false, isColInside = false, isRowInside = false, tableIdx = -2,
                isTopToBottom = false, isLeftToRight = false;
            if (xlObj.model.allowLockCell && xlObj.getSheet(sheetIdx).isSheetProtected)
                return;
            selCells = xlObj.getSheet(sheetIdx)._selectedCells;
            if (selCells.length > 0) {
                for (var i = 0, len = tabRange.length; i < len; i++) {
                    isRowInside = isRowDirty = isTop = isBottom = isTopToBottom = false;
                    isColInside = isColDirty = isLeft = isRight = isLeftToRight = false;
                    // Selection is inside the Row Range
                    if ((tabRange[i].startRow - 1 <= selCells[0].rowIndex) && (tabRange[i].endRow >= selCells[selCells.length - 1].rowIndex))
                        isRowInside = true;
                    //Out To In
                    else if ((tabRange[i].startRow - 1 > selCells[0].rowIndex) && (selCells[selCells.length - 1].rowIndex >= tabRange[i].startRow - 1) && (tabRange[i].endRow >= selCells[selCells.length - 1].rowIndex))
                        isRowDirty = true;
                    //In To Out
                    else if ((tabRange[i].startRow - 1 <= selCells[0].rowIndex) && (selCells[0].rowIndex <= tabRange[i].endRow) && (tabRange[i].endRow < selCells[selCells.length - 1].rowIndex))
                        isRowDirty = true;
                    //In Top
                    else if (tabRange[i].startRow - 1 > selCells[selCells.length - 1].rowIndex)
                        isTop = true;
                    //In Bottom
                    else if (tabRange[i].endRow < selCells[0].rowIndex)
                        isBottom = true;
                    //Top to Bottom
                    else if ((tabRange[i].endRow < selCells[selCells.length - 1].rowIndex) && tabRange[i].startRow > selCells[0].rowIndex)
                        isTopToBottom = true;
                    //Out To Out
                    else
                        isRowInside = false;

                    // Selection is inside the Column Range
                    if ((tabRange[i].multifilterIdx[0] <= selCells[0].colIndex) && (tabRange[i].multifilterIdx[tabRange[i].multifilterIdx.length - 1] >= selCells[selCells.length - 1].colIndex))
                        isColInside = true;
                    //Out To In
                    else if ((tabRange[i].multifilterIdx[0] > selCells[0].colIndex) && (selCells[selCells.length - 1].colIndex >= tabRange[i].multifilterIdx[0]) && (tabRange[i].multifilterIdx[tabRange[i].multifilterIdx.length - 1] >= selCells[selCells.length - 1].colIndex))
                        isColDirty = true;
                    //In To Out
                    else if ((tabRange[i].multifilterIdx[0] <= selCells[0].colIndex) && (selCells[0].colIndex <= tabRange[i].multifilterIdx[tabRange[i].multifilterIdx.length - 1]) && (tabRange[i].multifilterIdx[tabRange[i].multifilterIdx.length - 1] < selCells[selCells.length - 1].colIndex))
                        isColDirty = true;
                    //In Left
                    else if (tabRange[i].multifilterIdx[0] > selCells[selCells.length - 1].colIndex)
                        isLeft = true;
                    //In Right
                    else if (tabRange[i].multifilterIdx[tabRange[i].multifilterIdx.length - 1] < selCells[0].colIndex)
                        isRight = true;
                    //Left To Right
                    else if ((tabRange[i].multifilterIdx[0] > selCells[0].colIndex) && (tabRange[i].multifilterIdx[tabRange[i].multifilterIdx.length - 1] < selCells[selCells.length - 1].colIndex))
                        isLeftToRight = true;
                    //Out To Out
                    else
                        isColInside = false;
                    if ((isRowDirty && isColDirty) || (isRowDirty && isColInside) || (isRowInside && isColDirty) || (isRowDirty && !isRight && !isLeft) || (isColDirty && !isTop && !isBottom) || (isTopToBottom && isLeftToRight) || (isRowInside && isLeftToRight) || (isColInside && isTopToBottom)) {
                        isDirtyCell = true;
                        if (xlObj.XLSelection._isRowSelected && isRowInside)
                            isDirtyCell = false;
                        if (xlObj.XLSelection._isColSelected && isColInside)
                            isDirtyCell = false;
                        if (isDirtyCell)
                            break;
                    }
                    if (!isDirtyCell) {
                        tableIdx = i;
                        if (isTop || isBottom || isLeft) {
                            isDirtyCell = false;
                            isTableCell = false;
                        }
                        if ((isRowInside && isColInside)) //Need to add Condition for outside the selection
                            isFilterCell = true;
                        if ((!isRowInside && !isColInside))
                            isTableCell = true;
                    }
                }
            }
            this._isDirtySelect = isDirtyCell;
            this._isMergeSelect = (isFilterCell || isDirtyCell);
            this._isFilterSelect = { status: isFilterCell, tableIdx: tableIdx, isFiltered: false };
        },

        _refreshRibbonIcons: function (tabName) {
            var filterVal, xlObj = this.XLObj, sheetIdx = xlObj.getActiveSheetIndex(), menuObj = $("#" + xlObj._id + "_contextMenuCell").data("ejMenu"), splitBtnIds = ["Home_Editing_SortFilter", "Home_Editing_Clear", "Home_Styles_FormatAsTable"],
                btnIds = ["Insert_Tables_Table", "Data_SortFilter_Filter", "Data_SortFilter_ClearFilter"], mergeBtn = $("#" + xlObj._id + "_Ribbon_Home_Alignment_Merge").data("ejSplitButton");
            (!xlObj.XLEdit._isEdit && xlObj.getSheetElement(sheetIdx).find(".e-ss-activeimg").length < 1) && mergeBtn && mergeBtn.option("enabled", !this._isMergeSelect);
            if (xlObj._checkTableRange(xlObj._getRangeArgs()).status != "full")
                btnIds.push("Design_Tools_ConvertToRange");
            if (this._isDirtySelect) {
                this._disableButtons(splitBtnIds, "ejSplitButton");
                this._disableButtons(btnIds, "ejButton");
                menuObj && menuObj.disableItemByID("Sort");
            }
            else if (!xlObj.XLEdit._isEdit) {
                this._enableButtons(splitBtnIds, "ejSplitButton");
                this._enableButtons(btnIds, "ejButton");
                if (!xlObj.model.isReadOnly && menuObj && xlObj.model.allowSorting)
                    menuObj.enableItemByID("Sort");
            }
            var tabRange = xlObj.getSheet(sheetIdx).filterSettings.tableRange[this._isFilterSelect.tableIdx];
            if (this._isFilterSelect.status && tabRange) {
                var clrFltr = false, filterIdx = tabRange.multifilterIdx;
                for (var i = 0, len = filterIdx.length; i < len; i++) {
                    filterVal = xlObj.XLEdit.getPropertyValue(tabRange.startRow - 1, filterIdx[i], "filterState");
                    if (filterVal && filterVal.indexOf("filtered") > -1) {
                        this._isFilterSelect.isFiltered = true;
                        break;
                    }
                }
            }
            if (this._isFilterSelect.isFiltered)
                this._isDataTabCreate && this._enableButtons(["Data_SortFilter_ClearFilter"], "ejButton");
            else
                this._isDataTabCreate && this._disableButtons(["Data_SortFilter_ClearFilter"], "ejButton");
        },

        _onGroupExpander: function (args) {
            var xlObj = this.XLObj;
            if (xlObj.model.isReadOnly || xlObj.XLEdit._isEdit || xlObj.XLComment._isCommentEdit)
                return;
            switch (args.target.id) {
                case xlObj._id + '_Ribbon_Number_e-groupexpander':
                    xlObj._showDialog(xlObj._id + "_FormatCells");
                    break;
            }
        },

        disableRibbonItems: function (idCollection) {
            var xlObj = this.XLObj;
            if (xlObj.model.isReadOnly)
                return;
            var type, tabName, i, j, len, Id;
            for (i = 0, len = idCollection.length; i < len; i++) {
                tabName = idCollection[i].split("_")[2].toUpperCase();
                Id = idCollection[i].split("_Ribbon_")[1];
                do {
                    switch (tabName) {
                        case "HOME":
                            if (this._homeBtnIds.indexOf(Id) > -1) {
                                type = "ejButton";
                                this._homeBtnIds.splice(this._homeBtnIds.indexOf(Id), 1);
                            }
                            else if (this._homeSptBtnIds.indexOf(Id) > -1) {
                                type = "ejSplitButton";
                                this._homeSptBtnIds.splice(this._homeSptBtnIds.indexOf(Id), 1);
                            }
                            else if (this._homeToggleBtnIds.indexOf(Id) > -1) {
                                type = "ejToggleButton";
                                this._homeToggleBtnIds.splice(this._homeToggleBtnIds.indexOf(Id), 1);
                            }
                            else if (this._homeDdIds.indexOf(Id) > -1) {
                                type = "ejDropDownList";
                                this._homeDdIds.splice(this._homeDdIds.indexOf(Id), 1);
                            }
                            else if (this._homeCpIds.indexOf(Id) > -1) {
                                type = "ejColorPicker";
                                this._homeCpIds.splice(this._homeCpIds.indexOf(Id), 1);
                            }
                            break;
                        case "INSERT":
                            if (this._insertBtnIds.indexOf(Id) > -1) {
                                type = "ejButton";
                                this._insertBtnIds.splice(this._insertBtnIds.indexOf(Id), 1);
                            }
                            else if (this._insertSptBtnIds.indexOf(Id) > -1) {
                                type = "ejSplitButton";
                                this._insertSptBtnIds.splice(this._insertSptBtnIds.indexOf(Id), 1);
                            }
                            break;
                        case "DATA":
                            if (this._dataBtnIds.indexOf(Id) > -1) {
                                type = "ejButton";
                                this._dataBtnIds.splice(this._dataBtnIds.indexOf(Id), 1);
                            }
                            else if (this._dataSptBtnIds.indexOf(Id) > -1) {
                                type = "ejSplitButton";
                                this._dataSptBtnIds.splice(this._dataSptBtnIds.indexOf(Id), 1);
                            }
                            break;
                        case "PAGELAYOUT":
                            if (this._pageLayBtnIds.indexOf(Id) > -1) {
                                type = "ejButton";
                                this._pageLayBtnIds.splice(this._pageLayBtnIds.indexOf(Id), 1);
                            }
                            else if (this._pageLaySptBtnIds.indexOf(Id) > -1) {
                                type = "ejSplitButton";
                                this._pageLaySptBtnIds.splice(this._pageLaySptBtnIds.indexOf(Id), 1);
                            }
                            else if (this._pageLayChckBxIds.indexOf(Id) > -1) {
                                type = "ejCheckBox";
                                this._pageLayChckBxIds.splice(this._pageLayChckBxIds.indexOf(Id), 1);
                            }
                            break;
                        case "REVIEW":
                            if (this._cmntBtnIds.indexOf(Id) > -1) {
                                type = "ejButton";
                                this._cmntBtnIds.splice(this._cmntBtnIds.indexOf(Id), 1);
                            }
                            else if (this._cmntTglBtnIds.indexOf(Id) > -1) {
                                type = "ejToggleButton";
                                this._cmntTglBtnIds.splice(this._cmntTglBtnIds.indexOf(Id), 1);
                            }
                            else if (this._reviewTglBtnIds.indexOf(Id) > -1) {
                                type = "ejToggleButton";
                                this._reviewTglBtnIds.splice(this._reviewTglBtnIds.indexOf(Id), 1);
                            }
                            break;
                        case "OTHERS":
                            if (this._othersBtnIds.indexOf(Id) > -1) {
                                type = "ejButton";
                                this._othersBtnIds.splice(this._othersBtnIds.indexOf(Id), 1);
                            }
                            else if (this._othersSptBtnIds.indexOf(Id) > -1) {
                                type = "ejSplitButton";
                                this._othersSptBtnIds.splice(this._othersSptBtnIds.indexOf(Id), 1);
                            }
                            break;
                        case "FORMAT":
                            if (this._formatBtnIds.indexOf(Id) > -1) {
                                type = "ejButton";
                                this._formatBtnIds.splice(this._formatBtnIds.indexOf(Id), 1);
                            }
                            else if (this._formatSptBtnIds.indexOf(Id) > -1) {
                                type = "ejSplitButton";
                                this._formatSptBtnIds.splice(this._formatSptBtnIds.indexOf(Id), 1);
                            }
                            break;
                        case "DESIGN":
                            if (this._contextualBtnIds.indexOf(Id) > -1) {
                                type = "ejButton";
                                this._contextualBtnIds.splice(this._contextualBtnIds.indexOf(Id), 1);
                            }
                            else if (this._contextualCheckBoxIds.indexOf(Id) > -1) {
                                type = "ejCheckBox";
                                this._contextualCheckBoxIds.splice(this._contextualCheckBoxIds.indexOf(Id), 1);
                            }
                            else if (this._contextualInputIds.indexOf(Id) > -1)
                                type = true;
                            break;
                        case "CHARTDESIGN":
                            if (this._chartDesignBtnIds.indexOf(Id) > -1) {
                                type = "ejButton";
                                this._chartDesignBtnIds.splice(this._chartDesignBtnIds.indexOf(Id), 1);
                            }
                            else if (this._chartDesignSptBtnIds.indexOf(Id) > -1) {
                                type = "ejSplitButton";
                                this._chartDesignSptBtnIds.splice(this._chartDesignSptBtnIds.indexOf(Id), 1);
                            }
                            else if (this._chartDesignDdIds.indexOf(Id) > -1) {
                                type = "ejDropDownList";
                                this._chartDesignDdIds.splice(this._chartDesignDdIds.indexOf(Id), 1);
                            }
                            break;
                        case "SPARKLINEDESIGN":
                            if (this._sparklineDesignSptBtnIds.indexOf(Id) > -1) {
                                type = "ejSplitButton";
                                this._sparklineDesignSptBtnIds.splice(this._sparklineDesignSptBtnIds.indexOf(Id), 1);
                            }
                    }
                    if (type)
                        this._disableButtons([Id], type);
                    else {
                        var ctrlList = ["ejSplitButton", "ejButton", "ejDropDownList", "ejCheckBox", "ejToggleButton", "ejColorPicker"], cntrlObj = $("#" + xlObj._id + "_Ribbon_" + Id);
                        for (var l = 0, Llen = ctrlList.length; l < Llen; l++) {
                            if (cntrlObj.data(ctrlList[l])) {
                                cntrlObj.data(ctrlList[l]).disable();
                                break;
                            }
                        }
                    }
                }
                while ((Id === "PageLayout_PageLayout_PageSize" || Id === "Home_Clipboard_Paste" || Id === "Others_Cells_InsertCell" || Id === "Others_Cells_DeleteCell" || Id === "Data_DataTools_DataValidation") && (Id = Id + "Options"));
            }
        },

        enableRibbonItems: function (idCollection) {
            var xlObj = this.XLObj;
            var type, tabName, i, j, len, Id;
            for (i = 0, len = idCollection.length; i < len; i++) {
                tabName = idCollection[i].split("_")[2].toUpperCase();
                Id = idCollection[i].split("_Ribbon_")[1];
                do {
                    switch (tabName) {
                        case "HOME":
                            if (this.allButtonIds.indexOf(Id) > -1) {
                                type = "ejButton";
                                this._homeBtnIds.push(Id);
                            }
                            else if (this.allSplitButtonIds.indexOf(Id) > -1) {
                                type = "ejSplitButton";
                                this._homeSptBtnIds.push(Id);
                            }
                            else if (this.allToggleButtonIds.indexOf(Id) > -1) {
                                type = "ejToggleButton";
                                this._homeToggleBtnIds.push(Id);
                            }
                            else if (this.allDropDownIds.indexOf(Id) > -1) {
                                type = "ejDropDownList";
                                this._homeDdIds.push(Id);
                            }
                            else if (this.colorPickerIds.indexOf(Id) > -1) {
                                type = "ejColorPicker";
                                this._homeCpIds.push(Id);
                            }
                            break;
                        case "INSERT":
                            if (this.allButtonIds.indexOf(Id) > -1) {
                                type = "ejButton";
                                this._insertBtnIds.push(Id);
                            }
                            else if (this.allSplitButtonIds.indexOf(Id) > -1) {
                                type = "ejSplitButton";
                                this._insertSptBtnIds.push(Id);
                            }
                            break;
                        case "DATA":
                            if (this.allButtonIds.indexOf(Id) > -1) {
                                type = "ejButton";
                                this._dataBtnIds.push(Id);
                            }
                            else if (this.allSplitButtonIds.indexOf(Id) > -1) {
                                type = "ejSplitButton";
                                this._dataSptBtnIds.push(Id);
                            }
                            break;
                        case "PAGELAYOUT":
                            if (this.allButtonIds.indexOf(Id) > -1) {
                                type = "ejButton";
                                this._pageLayBtnIds.push(Id);
                            }
                            else if (this.allSplitButtonIds.indexOf(Id) > -1) {
                                type = "ejSplitButton";
                                this._pageLaySptBtnIds.push(Id);
                            }
                            else if (this.checkBoxIds.indexOf(Id) > -1) {
                                type = "ejCheckBox";
                                this._pageLayChckBxIds.push(Id);
                            }
                            break;
                        case "REVIEW":
                            if (this.allButtonIds.indexOf(Id) > -1) {
                                type = "ejButton";
                                this._cmntBtnIds.push(Id);
                            }
                            else if (this.allToggleButtonIds.indexOf(Id) > -1 && idCollection[i].split("_")[4] === "ShowAllComment") {
                                type = "ejToggleButton";
                                this._cmntTglBtnIds.push(Id);
                            }
                            else if (this.allToggleButtonIds.indexOf(Id) > -1) {
                                type = "ejToggleButton";
                                this._reviewTglBtnIds.push(Id);
                            }
                            break;
                        case "OTHERS":
                            if (this.allButtonIds.indexOf(Id) > -1) {
                                type = "ejButton";
                                this._othersBtnIds.push(Id);
                            }
                            else if (this.allSplitButtonIds.indexOf(Id) > -1) {
                                type = "ejSplitButton";
                                this._othersSptBtnIds.push(Id);
                            }
                            break;
                        case "FORMAT":
                            if (this.allButtonIds.indexOf(Id) > -1) {
                                type = "ejButton";
                                this._formatBtnIds.push(Id);
                            }
                            else if (this.allSplitButtonIds.indexOf(Id) > -1) {
                                type = "ejSplitButton";
                                this._formatSptBtnIds.push(Id);
                            }
                            break;
                        case "DESIGN":
                            if (this.allButtonIds.indexOf(Id) > -1) {
                                type = "ejButton";
                                this._contextualBtnIds.push(Id);
                            }
                            else if (this.checkBoxIds.indexOf(Id) > -1) {
                                type = "ejCheckBox";
                                this._contextualCheckBoxIds.push(Id);
                            }
                            else if (this._contextualInputIds.indexOf(Id) > -1)
                                type = true;
                            break;
                        case "CHARTDESIGN":
                            if (this.allButtonIds.indexOf(Id) > -1) {
                                type = "ejButton";
                                this._chartDesignBtnIds.push(Id);
                            }
                            else if (this.allSplitButtonIds.indexOf(Id) > -1) {
                                type = "ejSplitButton";
                                this._chartDesignSptBtnIds.push(Id);
                            }
                            else if (this.allDropDownIds.indexOf(Id) > -1) {
                                type = "ejDropDownList";
                                this._chartDesignDdIds.push(Id);
                            }
                            break;
                    }
                    if (type)
                        this._enableButtons([Id], type);
                    else {
                        var ctrlList = ["ejSplitButton", "ejButton", "ejDropDownList", "ejCheckBox", "ejToggleButton", "ejColorPicker"], cntrlObj = $("#" + xlObj._id + "_Ribbon_" + Id);
                        for (var l = 0, Llen = ctrlList.length; l < Llen; l++) {
                            if (cntrlObj.data(ctrlList[l])) {
                                cntrlObj.data(ctrlList[l]).enable();
                                break;
                            }
                        }
                    }
                }
                while ((Id === "PageLayout_PageLayout_PageSize" || Id === "Home_Clipboard_Paste" || Id === "Others_Cells_InsertCell" || Id === "Others_Cells_DeleteCell" || Id === "Data_DataTools_DataValidation") && (Id = Id + "Options"));
            }
        },

        _refreshFRDlg: function () {
            var xlObj = this.XLObj;
            if (xlObj._dlgWidth < 365) {
                $("#" + xlObj._id + "_Ribbon_lbFind").text(xlObj._getLocStr("Find"));
                $("#" + xlObj._id + "_Ribbon_lbReplace").text(xlObj._getLocStr("Replace"));
            }
            else {
                $("#" + xlObj._id + "_Ribbon_lbFind").text(xlObj._getLocStr("FindLabel"));
                $("#" + xlObj._id + "_Ribbon_lbReplace").text(xlObj._getLocStr("ReplaceLabel"));
            }
        },

        _refreshChartTypeDlg: function () {
            var xlObj = this.XLObj;
            $("#" + xlObj._id + "_charttypedlg").ejDialog("open");
            $("#" + xlObj._id + "_chartdlg_allcharttab_list").ejListBox('refresh');
        },

        _refreshNMDlg: function () {
            var xlObj = this.XLObj, nmgrid;
            $("#" + xlObj._id + "_nmdlg").ejDialog("open"); // due to grid issue
            nmgrid = $("#" + xlObj._id + "_nmgrid").data("ejGrid");
            nmgrid._refreshScroller({ requestType: "refresh" })
        },

        _menuCustomize: function () {
            var xlObj = this.XLObj, xlId = xlObj._id, settings = xlObj.model.ribbonSettings.applicationTab, settingsOpt = settings.menuSettings;
            if (settings.type === "menu") {
                if (settingsOpt.isAppend)
                    this._fileMenuData = this._fileMenuData.concat(settingsOpt.dataSource);
                else if (settingsOpt.dataSource.length)
                    this._fileMenuData = [{ id: "File", text: xlObj._getLocStr("File"), parentId: null },].concat(settingsOpt.dataSource);
                this._appTabCollection = { type: ej.Ribbon.ApplicationTabType.Menu, menuItemID: xlId + "_Menu", menuSettings: { click: $.proxy(this._onBackStageItemClick, this), openOnClick: false, fields: { dataSource: this._fileMenuData, id: "id", parentId: "parentId", text: "text", spriteCssClass: "sprite" } } };
            }
            else {
                if (settingsOpt.isAppend) {
                    this._renderAppTab();
                    this._appTabCollection.backstageSettings.pages = this._appTabCollection.backstageSettings.pages.concat(settingsOpt.dataSource);
                }
                else {
                    if (settingsOpt.dataSource.length)
                        this._appTabCollection = { type: ej.Ribbon.applicationTabType.backstage, backstageSettings: { text: xlObj._getLocStr("File"), headerWidth: 124, height: xlObj._responsiveHeight, width: xlObj.model.scrollSettings.width, pages: settingsOpt.dataSource } };
                    else
                        this._renderAppTab();
                }
            }
        },

        _refreshBackstageHeight: function () {
            var xlObj = this.XLObj, ribObj = xlObj.element.find("#" + xlObj._id + "_Ribbon").data("ejRibbon"), respHt = xlObj._isAutoWHMode ? xlObj._responsiveHeight : xlObj._responsiveHeight - 2;
            if (ribObj.model.applicationTab.type === ej.Ribbon.ApplicationTabType.Backstage) {
                ribObj.setModel({ "applicationTab": { "backstageSettings": { "height": respHt, "width": xlObj._isAutoWHMode ? xlObj._responsiveWidth : xlObj._responsiveWidth - 2 } } });
                ribObj.element.find(".e-responsivebackstagecontent .e-resbackstagecontent").css({ "height": respHt - (10 + ribObj.element.find(".e-backstagerestop").outerHeight()) }); //10 for margin
            }
        },

        _refreshBSItems: function (type) {
            var xlObj = this.XLObj;
            if (type === ej.Ribbon.ApplicationTabType.Menu) {
                $("#" + xlObj._id + "_backstagetabnew").remove();
                $("#" + xlObj._id + "_backstagetabsaveas").remove();
                $("#" + xlObj._id + "_backstagetabprint").remove();
            }
        },

        hideMenu: function () {
            var xlObj = this.XLObj;
            if (xlObj.model.isReadOnly)
                return;
            if (xlObj.model.ribbonSettings.applicationTab.type === "menu")
                $("#" + xlObj._id + "_Menu").hide();
            else
                xlObj.element.find("#" + xlObj._id + "_Ribbon").find(".e-backstagetab").hide();
        },

        showMenu: function () {
            var xlObj = this.XLObj;
            if (xlObj.model.isReadOnly)
                return;
            if (xlObj.model.ribbonSettings.applicationTab.type === "menu")
                $("#" + xlObj._id + "_Menu").show();
            else
                xlObj.element.find("#" + xlObj._id + "_Ribbon").find(".e-backstagetab").show();
        },

        addTab: function (tabText, ribbonGroups, index) {
            var xlObj = this.XLObj;
            if (!xlObj.model.isReadOnly)
                xlObj.element.find("#" + xlObj._id + "_Ribbon").ejRibbon("addTab", tabText, ribbonGroups, index);
        },

        addTabGroup: function (tabIndex, tabGroup, groupIndex) {
            var xlObj = this.XLObj;
            if (!xlObj.model.isReadOnly)
                xlObj.element.find("#" + xlObj._id + "_Ribbon").ejRibbon("addTabGroup", tabIndex, tabGroup, groupIndex);
        },

        addContextualTabs: function (contextualTabSet, index) {
            var xlObj = this.XLObj;
            if (!xlObj.model.isReadOnly)
                xlObj.element.find("#" + this.XLObj._id + "_Ribbon").ejRibbon("addContextualTabs", contextualTabSet, index);
        },

        removeTab: function (index, isRemoveMenu) {
            var xlObj = this.XLObj;
            if (xlObj.model.isReadOnly)
                return;
            if (ej.isNullOrUndefined(index) && isRemoveMenu) {
                var tabUl = xlObj.element.find("#" + xlObj._id + "_Ribbon .e-apptab");
                if (tabUl.length) {
                    tabUl.find("a").empty();
                    tabUl.find(".e-menu-wrap").remove();
                    tabUl.hide();
                    xlObj.element.find("#" + xlObj._id + "_Ribbon_BackStage").remove();
                }
            }
            else
                xlObj.element.find("#" + xlObj._id + "_Ribbon").ejRibbon("removeTab", index);
        },

        removeTabGroup: function (tabIndex, groupText) {
            var xlObj = this.XLObj;
            if (!xlObj.model.isReadOnly)
                xlObj.element.find("#" + xlObj._id + "_Ribbon").ejRibbon("removeTabGroup", tabIndex, groupText);

        },

        addBackStageItem: function (pageItem, index) {
            var xlObj = this.XLObj;
            if (!xlObj.model.isReadOnly)
                xlObj.element.find("#" + xlObj._id + "_Ribbon").ejRibbon("addBackStageItem", pageItem, index);
        },

        removeBackStageItem: function (index) {
            var xlObj = this.XLObj;
            if (!xlObj.model.isReadOnly)
                xlObj.element.find("#" + xlObj._id + "_Ribbon").ejRibbon("removeBackStageItem", index);
        },

        updateBackStageItem: function (pageItem, index) {
            var xlObj = this.XLObj;
            if (!xlObj.model.isReadOnly)
                xlObj.element.find("#" + xlObj._id + "_Ribbon").ejRibbon("updateBackStageItem", index, pageItem);
        },

        removeMenuItem: function (index) {
            var xlObj = this.XLObj;
            if (!xlObj.model.isReadOnly) {
                var menuElem = $("#" + xlObj._id + "_Menu"), menuObj = menuElem.data("ejMenu");
                menuObj.remove(["#" + menuElem.find("li").eq(index).attr("id")]);
            }
        },

        updateMenuItem: function (item, index) {
            var xlObj = this.XLObj;
            if (!xlObj.model.isReadOnly) {
                var menuElem = $("#" + xlObj._id + "_Menu"), menuObj = menuElem.data("ejMenu");
                menuObj.insertBefore(item, "#" + menuElem.find("li").eq(index).attr("id"));
                menuObj.remove(["#" + menuElem.find("li").eq(index + 1).attr("id")]);
            }
        },

        addMenuItem: function (item, index) {
            var xlObj = this.XLObj;
            if (!xlObj.model.isReadOnly) {
                var menuElem = $("#" + xlObj._id + "_Menu"), menuObj = menuElem.data("ejMenu");
                menuObj.insertAfter(item, "#" + menuElem.find("li").eq(index).attr("id"));
            }
        },
    };
})(jQuery, Syncfusion);