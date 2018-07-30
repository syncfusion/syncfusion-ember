(function($, ej, undefined){
    ej.olap =  ej.olap || {};
    ej.olap.base = {
        _initProperties: function () {
            this._columnHeaders = [],
            this._rowHeaders = [],
            this._valueCells = [],
            this.pivotEngine = [],
            this.olapCtrlObj = null,
            this._cBIndx = null,
            this._rBIndx = null,
            this._OlapDataSource,
            this._measureDt = {},
            this._cTotIndexInfo = null,
            this._rTotIndexInfo = null;
            this._kpi = null;
            this._rowCount = 0;
            this._colCount = 0;
            this._isPaging = false;
            this._indexRCell = 0;
            this._indexCCell = 0;
        },
        _initControlProperties: function(controlObj)
        {
            controlObj._drilledCellSet = (controlObj.model.enablePaging || controlObj.model.enableVirtualScrolling) ? (ej.isNullOrUndefined(controlObj._drilledCellSet) ? [] : controlObj._drilledCellSet) : [];
            controlObj.XMLACellSet = null;
            controlObj._isMondrian = controlObj.model.dataSource.providerName == ej.olap.Providers.Mondrian;
            if (ej.isNullOrUndefined(controlObj._fieldData) || (!ej.isNullOrUndefined(controlObj._fieldData) && ej.isNullOrUndefined(controlObj._fieldData.hierarchy)))
                this._getFieldItemsInfo(controlObj);
            this._currIndex = {};
            this._isRowDrilled = false;
            this._isColDrilled = false;
            this._isNoSummary = controlObj.model.layout == "nosummaries" ? true : false;
        },
        getJSONData: function (args, dataSource, controlObj) {

            if (args.action && (args.action == "initialLoad" || args.action == "navPaging")) {
                this._initControlProperties(controlObj);
                this._applyTrim(controlObj);
            }
            if (args.action == "loadFieldElements") {
                controlObj._baseSavedProperties = $.extend(true, {}, {
                    drilledCellSet: controlObj._drilledCellSet,
                    XMLACellSet: controlObj.XMLACellSet, 
                    columnHeaders: this._columnHeaders,
                    rowHeaders: this._rowHeaders,
                    valueCells: this._valueCells,
                    pivotEngine: this.pivotEngine,
                    olapCtrlObj: this.olapCtrlObj,
                    cBIndx: this._cBIndx,
                    rBIndx: this._rBIndx,
                    OlapDataSource: this._OlapDataSource,
                    measureDt: this._measureDt,
                    cTotIndexInfo: this._cTotIndexInfo,
                    rTotIndexInfo: this._rTotIndexInfo,
                    kpi: this._kpi,
                    rowCount: this._rowCount,
                    colCount: this._colCount,
                    isPaging: this._isPaging,
                    indexRCell: this._indexRCell,
                    indexCCell: this._indexCCell,
                });
            }
            this._initProperties();
            this.olapCtrlObj = controlObj;
            this._OlapDataSource = dataSource;
            var parsedMDX ="", serverPath = dataSource.data, pData;
            if (controlObj.model.enableGroupingBar && args.action != "loadFieldElements") {
                controlObj._createGroupingBar(dataSource);
            }
            
            this._isPaging = (this.olapCtrlObj.model.enablePaging || this.olapCtrlObj.model.enableVirtualScrolling) && !ej.isNullOrUndefined(this._OlapDataSource.pagerOptions) && (this._OlapDataSource.pagerOptions.categoricalPageSize != 0 && this._OlapDataSource.pagerOptions.seriesPageSize != 0) ? true : false;
            if(dataSource.MDXQuery)
                parsedMDX = dataSource.MDXQuery;
            else
                parsedMDX = this._getParsedMDX(dataSource, dataSource.cube, args.action && args.action != "navPaging" && this._isPaging && !ej.isNullOrUndefined(this.olapCtrlObj.model.dataSource.pagerOptions) ? true : false);

            var conStr = this._getConnectionInfo(this.olapCtrlObj.model.dataSource.data);
            if (ej.isNullOrUndefined(dataSource.providerName) || dataSource.providerName == ej.olap.Providers.SSAS)
                pData = "<Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\"> <Header></Header> <Body> <Execute xmlns=\"urn:schemas-microsoft-com:xml-analysis\"> <Command> <Statement> " + parsedMDX + " </Statement> </Command> <Properties> <PropertyList> <Catalog>" + dataSource.catalog + "</Catalog> <LocaleIdentifier>" + conStr.LCID + "</LocaleIdentifier> </PropertyList> </Properties></Execute> </Body> </Envelope>";
            else
                pData = "<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" SOAP-ENV:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\"><SOAP-ENV:Body><Execute xmlns=\"urn:schemas-microsoft-com:xml-analysis\"><Command><Statement><![CDATA[" + parsedMDX + "]]></Statement></Command><Properties><PropertyList><DataSourceInfo>" + dataSource.sourceInfo + "</DataSourceInfo><Catalog>" + dataSource.catalog + "</Catalog><AxisFormat>TupleFormat</AxisFormat><Content>Data</Content><Format>Multidimensional</Format></PropertyList></Properties></Execute></SOAP-ENV:Body></SOAP-ENV:Envelope>";
            if (args.action == "drilldown" && !this._isPaging) {
                this.olapCtrlObj.doAjaxPost("POST", conStr.url, { XMLA: pData }, this._onDemandExpand, null, args);
            }
            else
                this.olapCtrlObj.doAjaxPost("POST", conStr.url, { XMLA: pData }, (args.action && args.action != "navPaging" && this._isPaging && !ej.isNullOrUndefined(this.olapCtrlObj.model.dataSource.pagerOptions) ? this._generatePagingData : this._generateJSONData), null, args);
        },
        _getParsedMDX: function (olapReport, cube, refPaging) {
            if (olapReport != undefined) {
                var mdxQuery = "", rowQuery, columnQuery, slicerQuery, isMondrian = (olapReport.providerName == ej.olap.Providers.Mondrian);
                if (isMondrian && olapReport["columns"].length == 0 && !(olapReport['values'][0].axis == "columns" && olapReport['values'][0].measures.length > 0))
                    return "";
                rowQuery = ej.olap._mdxParser._getRowMDX(olapReport);
                columnQuery = ej.olap._mdxParser._getcolumnMDX(olapReport);
                delete olapReport["_isCollapse"];
                rowQuery = rowQuery.length > 0 ? (this._isPaging && !refPaging || isMondrian) ? "(" + rowQuery + ")" : "NON EMPTY(" + rowQuery + ")" : "";
                columnQuery = columnQuery.length > 0 ? (this._isPaging && !refPaging || isMondrian) ? "(" + columnQuery + ")" : "NON EMPTY(" + columnQuery + ")" : "";
                if (this._isPaging && !refPaging && !ej.isNullOrUndefined(this.olapCtrlObj.model.dataSource.pagerOptions)) {
                    var pagingQuery = this._getPagingQuery(rowQuery, columnQuery);
                    rowQuery = pagingQuery.rowQuery;
                    columnQuery = pagingQuery.columnQuery;
                }
                slicerQuery = ej.olap._mdxParser._getSlicerMDX(olapReport, this.olapCtrlObj);
                mdxQuery = "\nSelect \n" + (columnQuery == "" ? "{}" : columnQuery) + "\ndimension properties MEMBER_TYPE,CHILDREN_CARDINALITY, PARENT_UNIQUE_NAME  ON COLUMNS \n" + (rowQuery == "" ? "" : "," + rowQuery + "\ndimension properties MEMBER_TYPE,CHILDREN_CARDINALITY, PARENT_UNIQUE_NAME  ON ROWS") + "\n " + ej.olap._mdxParser._getIncludefilterQuery(olapReport, cube, this.olapCtrlObj) + slicerQuery + "\n CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE \n ";
                if (columnQuery == "")
                    mdxQuery.replace(/NON EMPTY/g, " ");
            }
            return mdxQuery;
        },
        _getPagingQuery: function (rowQuery, columnQuery) {
            var categCurrPage = (Math.ceil(this._colCount / this.olapCtrlObj.model.dataSource.pagerOptions.categoricalPageSize) < parseInt(this.olapCtrlObj.model.dataSource.pagerOptions.categoricalCurrentPage) || parseInt(this.olapCtrlObj.model.dataSource.pagerOptions.categoricalCurrentPage) == 0) ? ((Math.ceil(this._colCount / this.olapCtrlObj.model.dataSource.pagerOptions.categoricalPageSize) < parseInt(this.olapCtrlObj._categCurrentPage) && this._colCount > 0) ? Math.ceil(this._colCount / this.olapCtrlObj.model.dataSource.pagerOptions.categoricalPageSize) : this.olapCtrlObj._categCurrentPage) : parseInt(this.olapCtrlObj.model.dataSource.pagerOptions.categoricalCurrentPage);
            var seriesCurrPage = (Math.ceil(this._rowCount / this.olapCtrlObj.model.dataSource.pagerOptions.seriesPageSize) < parseInt(this.olapCtrlObj.model.dataSource.pagerOptions.seriesCurrentPage) || parseInt(this.olapCtrlObj.model.dataSource.pagerOptions.seriesCurrentPage) == 0) ? ((Math.ceil(this._rowCount / this.olapCtrlObj.model.dataSource.pagerOptions.seriesPageSize) < parseInt(this.olapCtrlObj._seriesCurrentPage) && this._rowCount > 0) ? Math.ceil(this._rowCount / this.olapCtrlObj.model.dataSource.pagerOptions.seriesPageSize) : this.olapCtrlObj._seriesCurrentPage) : parseInt(this.olapCtrlObj.model.dataSource.pagerOptions.seriesCurrentPage);
            var rowQueryCpy = rowQuery;
            return { rowQuery: rowQuery != "" ? ("SUBSET({" + (this.olapCtrlObj._isMondrian ? "" : "NONEMPTY") + "(" + rowQuery + (!this.olapCtrlObj._isMondrian && columnQuery != "" ? "," + columnQuery : "") + ")}," + (((seriesCurrPage == 0 ? 1 : seriesCurrPage) - 1) * (this.olapCtrlObj.model.dataSource.pagerOptions.seriesPageSize)) + "," + this.olapCtrlObj.model.dataSource.pagerOptions.seriesPageSize + ")") : "", columnQuery: columnQuery != "" ? ("SUBSET({" + (this.olapCtrlObj._isMondrian ? "" : "NONEMPTY") + "(" + columnQuery + (!this.olapCtrlObj._isMondrian && rowQueryCpy != "" ? "," + rowQueryCpy : "") + ")}," + (((categCurrPage == 0 ? 1 : categCurrPage) - 1) * (this.olapCtrlObj.model.dataSource.pagerOptions.categoricalPageSize)) + "," + this.olapCtrlObj.model.dataSource.pagerOptions.categoricalPageSize + ")") : "" };
        },
        _getAxisElementsUName : function(axisElements){		
            var elementsName = "";
            for(var elCnt =0; elCnt < axisElements.length; elCnt++)
            {
                elementsName += (elementsName== "" ? "{" + axisElements[elCnt].uniqueName + "}" : ", {" + axisElements[elCnt].uniqueName + "}");
            }
            return elementsName;
        },
        _generatePagingData: function (customArgs, args) {
            if ($(args).find("Error").length > 0) {
                ej.Pivot._createErrorDialog($(args).find("faultstring").text(), customArgs.action, this.olapCtrlObj);
                return false;
            }
            var XMLACellSet = $(args).find("Axes, CellData");
            this._rowCount = $(XMLACellSet.find("Axis[name|='Axis1']").find("Tuples")).length > 0 ? ($(XMLACellSet.find("Axis[name|='Axis1']").find("Tuples")[0]).children().length) : 0;
            this._colCount = $(XMLACellSet.find("Axis[name|='Axis0']").find("Tuples")).length > 0 ? ($(XMLACellSet.find("Axis[name|='Axis0']").find("Tuples")[0]).children().length) : 0;

            var parsedMDX = this._getParsedMDX(this.olapCtrlObj.model.dataSource, this.olapCtrlObj.model.dataSource.cube, false);
            var conStr = this._getConnectionInfo(this.olapCtrlObj.model.dataSource.data);
            if (this.olapCtrlObj._isMondrian) {
                this._controlObj = this.olapCtrlObj;
            }
            this.olapCtrlObj.doAjaxPost("POST", conStr.url, { XMLA: ej.olap._mdxParser.getSoapMsg(parsedMDX, this.olapCtrlObj.model.dataSource.data, this.olapCtrlObj.model.dataSource.catalog) }, this._generateJSONData, null, customArgs);
        },
        _generateJSONData: function (customArgs, args) {
            this.olapCtrlObj.model.dataSource = this._OlapDataSource;
            if (this._isPaging && customArgs.action == "drilldown")
                this._onDemandExpand(customArgs, args);
            var tranposeEngine = [], jsonObj = [];
            if ($(args).find("Error").length > 0) {
                ej.Pivot._createErrorDialog($(args).find("faultstring").text(), "Error", this.olapCtrlObj);
                return false;
            }
            $(args).find("Axis[name|='SlicerAxis']").remove();
            this.olapCtrlObj.XMLACellSet = $(args).find("Axes, CellData");
            var axis0Tuples, axis1Tuples, temp, testData = [], cellData;
            if (customArgs == "onDemandDrill")
                this.olapCtrlObj.XMLACellSet = args;
            axis0Tuples = $(this.olapCtrlObj.XMLACellSet).find("Axis[name|='Axis0']").find("Tuple");
            axis1Tuples = $(this.olapCtrlObj.XMLACellSet).find("Axis[name|='Axis1']").find("Tuple");
            if (axis0Tuples.length > 0) {
                cellData = $(this.olapCtrlObj.XMLACellSet[1]).children();
                this._rowHeaders = this._getHeaderCollection(axis1Tuples, "rowheader");
                this._columnHeaders = this._getHeaderCollection(axis0Tuples, "colheader");
                this._valueCells = this._getValueCells(cellData, axis0Tuples.length);
                this._indexRCell = this._measureDt.axis == 'rowheader' ? (ej.sum(this._rowHeaders.maxLvlLen) + 1) : ej.sum(this._rowHeaders.maxLvlLen);
                this._indexCCell = this._measureDt.axis == 'colheader' ? (ej.sum(this._columnHeaders.maxLvlLen) + 1) : ej.sum(this._columnHeaders.maxLvlLen);
                if (this._rowHeaders.headers.length > 0 && ej.sum(this._rowHeaders.maxLvlLen) == 0)
                    this._indexRCell = this._rowHeaders.headers[0].length;
                if (this._columnHeaders.headers.length > 0 && ej.sum(this._columnHeaders.maxLvlLen) == 0)
                    this._indexCCell = this._columnHeaders.headers[0].length;
                if (this._isPaging)
                {
                    for (var rCnt = 0; rCnt < this._rowHeaders.headers.length; rCnt++) {
                        for (var cCnt = 0; cCnt < this._columnHeaders.headers.length; cCnt++) {
                            if (ej.isNullOrUndefined(this._valueCells[rCnt]))
                            {
                                this._valueCells[rCnt] = [];
                                this._valueCells[rCnt][cCnt] = { FormatString: "#,#", Value: "" };
                            }
                            else if (ej.isNullOrUndefined(this._valueCells[rCnt][cCnt])) {
                                this._valueCells[rCnt][cCnt] = { FormatString: "#,#", Value: "" };
                            }
                        }
                    }
                }
                this._populateEngine(this._rowHeaders.headers, this._columnHeaders.headers, this._valueCells);
                $(this.olapCtrlObj).find(".e-pivotGridTable").remove();
                this.olapCtrlObj._measureDt = this._measureDt;
                var rowLenth = this._rowHeaders.headers.length + this._indexCCell, colLength = this._columnHeaders.headers.length + this._indexRCell;
                if (this.pivotEngine.length > 1)
                    rowLenth = this.pivotEngine.length;
                for (var rCnt = 0; rCnt < rowLenth ; rCnt++) {
                    for (var cCnt = 0; cCnt < colLength ; cCnt++) {
                        if (tranposeEngine[cCnt] == undefined)
                            tranposeEngine[cCnt] = [];
                        if (this.pivotEngine[rCnt] != undefined && this.pivotEngine[rCnt][cCnt] != undefined) {
                            tranposeEngine[cCnt][rCnt] = {
                                Index: cCnt + ',' + rCnt, CSS: (this.pivotEngine[rCnt][cCnt].CSS == "" ? "none" : this.pivotEngine[rCnt][cCnt].CSS == undefined ? "value" : this.pivotEngine[rCnt][cCnt].CSS), Value: this.pivotEngine[rCnt][cCnt].Value, State: this.pivotEngine[rCnt][cCnt].ChildCount > 0 ? 2 : this.pivotEngine[rCnt][cCnt].ChildCount < 0 ? 1 : 0,
                                RowSpan: (this.pivotEngine[rCnt][cCnt].RowSpan != undefined ? this.pivotEngine[rCnt][cCnt].RowSpan : 1),
                                ColSpan: (this.pivotEngine[rCnt][cCnt].ColSpan != undefined ? this.pivotEngine[rCnt][cCnt].ColSpan : 1), Info: (this.pivotEngine[rCnt][cCnt].UName + "::" + this.pivotEngine[rCnt][cCnt].LName + "::" + this.pivotEngine[rCnt][cCnt].Value + "::" + this.pivotEngine[rCnt][cCnt].PUName), Span: this.pivotEngine[rCnt][cCnt].Span == "Block" ? "Block" : "None", Expander: 1
                            };
                            if (this.pivotEngine[rCnt][cCnt].kpiInfo)
                            {
                                tranposeEngine[cCnt][rCnt].kpi = this.pivotEngine[rCnt][cCnt].kpi;
                                tranposeEngine[cCnt][rCnt].kpiInfo = this.pivotEngine[rCnt][cCnt].kpiInfo;
                            }
                            if (this.pivotEngine[rCnt][cCnt].ActualValue) {
                                tranposeEngine[cCnt][rCnt].ActualValue = this.pivotEngine[rCnt][cCnt].ActualValue;
                                tranposeEngine[cCnt][rCnt].Format = this.pivotEngine[rCnt][cCnt].FormatString;
                            }
                        }
                        else if (this.pivotEngine[rCnt] != undefined) {
                            var css = "none";
                            if (rCnt < this._indexCCell && cCnt < this._indexRCell)
                                css = "rowheader";
                            tranposeEngine[cCnt][rCnt] = {
                                Index: cCnt + ',' + rCnt, CSS: css, Value: "", State: 0,
                                RowSpan: 1,
                                ColSpan: 1, Info: "", Span: "Block", Expander: 0
                            };
                        }
                    }
                }
                for (var rCnt = 0; rCnt < colLength; rCnt++) {
                    for (var cCnt = 0; cCnt < rowLenth ; cCnt++) {
                        if (tranposeEngine[rCnt] != undefined && tranposeEngine[rCnt][cCnt] != undefined)
                            jsonObj.push(tranposeEngine[rCnt][cCnt]);
                    }
                }
                var _rowCount = 0;
                for (var index = 0; index < jsonObj.length; index++) {
                    if (parseInt(jsonObj[index].Index.split(',')[0]) == 0)
                        _rowCount++;
                    else
                        break;
                }
            }
            if (this.olapCtrlObj._isExporting && this.olapCtrlObj.model.enableCompleteDataExport) {
                for (var cCnt = 0; cCnt < this._indexRCell; cCnt++) {
                    var storedInfo = "";
                    for (var rCnt = this._indexCCell; rCnt < tranposeEngine[0].length; rCnt++) {
                        if (tranposeEngine[cCnt][rCnt].Info != "") {
                            if (storedInfo == tranposeEngine[cCnt][rCnt].Info)
                                tranposeEngine[cCnt][rCnt].Span = "Block";
                            else
                                storedInfo = tranposeEngine[cCnt][rCnt].Info;
                        }
                    }
                }
                for (var rCnt = 0; rCnt < this._indexCCell; rCnt++) {
                    var storedInfo = "";
                    for (var cCnt = this._indexRCell; cCnt < tranposeEngine.length; cCnt++) {
                        if (tranposeEngine[cCnt][rCnt].Info != "") {
                            if (storedInfo == tranposeEngine[cCnt][rCnt].Info)
                                tranposeEngine[cCnt][rCnt].Span = "Block";
                            else
                                storedInfo = tranposeEngine[cCnt][rCnt].Info;
                        }
                    }
                }
                this.olapCtrlObj._fullExportedData = { jsonObj: jsonObj, tranposeEngine: tranposeEngine, rowCount: _rowCount };
                this.olapCtrlObj._drilledCellSet = this.olapCtrlObj._baseSavedProperties.drilledCellSet;
                this.olapCtrlObj.XMLACellSet = this.olapCtrlObj._baseSavedProperties.XMLACellSet;
                this._columnHeaders = this.olapCtrlObj._baseSavedProperties.columnHeaders;
                this._rowHeaders = this.olapCtrlObj._baseSavedProperties.rowHeaders;
                this._valueCells = this.olapCtrlObj._baseSavedProperties.valueCells;
                this.pivotEngine = this.olapCtrlObj._baseSavedProperties.pivotEngine;
                this.olapCtrlObj = this.olapCtrlObj._baseSavedProperties.olapCtrlObj;
                this._cBIndx = this.olapCtrlObj._baseSavedProperties.cBIndx;
                this._rBIndx = this.olapCtrlObj._baseSavedProperties.rBIndx;
                this._OlapDataSource = this.olapCtrlObj._baseSavedProperties.OlapDataSource;
                this._measureDt = this.olapCtrlObj._baseSavedProperties.measureDt;
                this._cTotIndexInfo = this.olapCtrlObj._baseSavedProperties.cTotIndexInfo;
                this._rTotIndexInfo = this.olapCtrlObj._baseSavedProperties.rTotIndexInfo;
                this._kpi = this.olapCtrlObj._baseSavedProperties.kpi;
                this._rowCount = this.olapCtrlObj._baseSavedProperties.rowCount;
                this._colCount = this.olapCtrlObj._baseSavedProperties.colCount;
                this._isPaging = this.olapCtrlObj._baseSavedProperties.isPaging;
                this._indexRCell = this.olapCtrlObj._baseSavedProperties.indexRCell;
                this._indexCCell = this.olapCtrlObj._baseSavedProperties.indexCCell;
                this.olapCtrlObj._baseSavedProperties = {};
            }
            else {
                this.olapCtrlObj["_pivotRecords"] = { records: jsonObj, rowCount: _rowCount };
                if (!(typeof (this.olapCtrlObj.model.dataSource.data) == "string") || this.olapCtrlObj.pluginName == "ejPivotGrid")
                    this._renderPivotGrid(customArgs, jsonObj);
                else if ((!(typeof (this.olapCtrlObj.model.dataSource.data) == "string") || this.olapCtrlObj.pluginName == "ejPivotChart") || (!(typeof (this.olapCtrlObj.model.dataSource.data) == "string") || this.olapCtrlObj.pluginName == "ejPivotGauge") || (!(typeof (this.olapCtrlObj.model.dataSource.data) == "string") || this.olapCtrlObj.pluginName == "ejPivotTreeMap")) {
                    this.olapCtrlObj.generateJSON({ baseObj: this }, tranposeEngine);
                    if (this._isPaging) this._renderPager(customArgs);
                }
                else {
                    this._renderPager(customArgs);
                    this.olapCtrlObj.generateJSON({ baseObj: this, tranposeEngine: tranposeEngine, jsonObj: jsonObj });
                }
                this._columnHeaders = this._rowHeaders = this._valueCells = this.pivotEngine = []; this._cBIndx = this._rBIndx = null; this._measureDt = { axis: "", posision: null }; this._cTotIndexInfo = this._rTotIndexInfo = null;
            }
        },
        _renderPager: function (customArgs) {
            if (this._isPaging) {
                if (customArgs.action != "navPaging") {
                    if (!ej.isNullOrUndefined(this.olapCtrlObj.model.dataSource.pagerOptions)) {
                        var categCurrPage = (Math.ceil(this._colCount / this.olapCtrlObj.model.dataSource.pagerOptions.categoricalPageSize) < parseInt(this.olapCtrlObj.model.dataSource.pagerOptions.categoricalCurrentPage) || parseInt(this.olapCtrlObj.model.dataSource.pagerOptions.categoricalCurrentPage) == 0) ? (Math.ceil(this._colCount / this.olapCtrlObj.model.dataSource.pagerOptions.categoricalPageSize) < parseInt(this.olapCtrlObj._categCurrentPage) ? Math.ceil(this._colCount / this.olapCtrlObj.model.dataSource.pagerOptions.categoricalPageSize) : this.olapCtrlObj._categCurrentPage) : parseInt(this.olapCtrlObj.model.dataSource.pagerOptions.categoricalCurrentPage);
                        var seriesCurrPage = (Math.ceil(this._rowCount / this.olapCtrlObj.model.dataSource.pagerOptions.seriesPageSize) < parseInt(this.olapCtrlObj.model.dataSource.pagerOptions.seriesCurrentPage) || parseInt(this.olapCtrlObj.model.dataSource.pagerOptions.seriesCurrentPage) == 0) ? (Math.ceil(this._rowCount / this.olapCtrlObj.model.dataSource.pagerOptions.seriesPageSize) < parseInt(this.olapCtrlObj._seriesCurrentPage) ? Math.ceil(this._rowCount / this.olapCtrlObj.model.dataSource.pagerOptions.seriesPageSize) : this.olapCtrlObj._seriesCurrentPage) : parseInt(this.olapCtrlObj.model.dataSource.pagerOptions.seriesCurrentPage);
                        categCurrPage = categCurrPage == 0 ? 1 : categCurrPage;
                        seriesCurrPage = seriesCurrPage == 0 ? 1 : seriesCurrPage;
                        this._colCount = this._colCount == 0 ? 1 : this._colCount;
                        this._rowCount = this._rowCount == 0 ? 1 : this._rowCount;
                        if (this.olapCtrlObj.model.enablePaging) {
                            var pageSettings = { CategoricalCurrentPage: categCurrPage, CategoricalPageSize: this.olapCtrlObj.model.dataSource.pagerOptions.categoricalPageSize, SeriesCurrentPage: seriesCurrPage, SeriesPageSize: this.olapCtrlObj.model.dataSource.pagerOptions.seriesPageSize };
                            var headerCount = { Column: this._colCount, Row: this._rowCount };
                            this.olapCtrlObj._pagerObj.element.css("opacity", "1");
                            this.olapCtrlObj._pagerObj.element.find(".e-pagerTextBox").removeAttr('disabled');
                            this.olapCtrlObj._pagerObj._unwireEvents();
                            this.olapCtrlObj._pagerObj._wireEvents();
                            this.olapCtrlObj._pagerObj.initPagerProperties(headerCount, pageSettings);
                        }
                        else if (this.olapCtrlObj.model.enableVirtualScrolling) {
                            this.olapCtrlObj._categPageCount = Math.ceil(this._colCount / this.olapCtrlObj.model.dataSource.pagerOptions.categoricalPageSize);
                            this.olapCtrlObj._seriesPageCount = Math.ceil(this._rowCount / this.olapCtrlObj.model.dataSource.pagerOptions.seriesPageSize);
                        }                         
                        this.olapCtrlObj._categCurrentPage = categCurrPage;
                        this.olapCtrlObj._seriesCurrentPage = seriesCurrPage;
                        if (!ej.isNullOrUndefined(this.olapCtrlObj._pivotGrid)) {
                            this.olapCtrlObj._pivotGrid._categCurrentPage = categCurrPage;
                            this.olapCtrlObj._pivotGrid._seriesCurrentPage = seriesCurrPage;
                            this.olapCtrlObj._pivotGrid._categPageCount = this.olapCtrlObj._categPageCount;
                            this.olapCtrlObj._pivotGrid._seriesPageCount = this.olapCtrlObj._seriesPageCount;
                        }
                    }
                    else if (this.olapCtrlObj.model.enablePaging) {
                        var pageSettings = { CategoricalCurrentPage: 1, CategoricalPageSize: 1, SeriesCurrentPage: 1, SeriesPageSize: 1 };
                        var headerCount = { Column: 1, Row: 1 };
                        this.olapCtrlObj._pagerObj.initPagerProperties(headerCount, pageSettings);
                        this.olapCtrlObj._pagerObj.element.css("opacity", "0.5");
                        this.olapCtrlObj._pagerObj.element.find(".e-pagerTextBox").attr('disabled', 'disabled');
                        this.olapCtrlObj._pagerObj._unwireEvents();
                    }
                }
                if(!ej.isNullOrUndefined(this.olapCtrlObj.model.dataSource.pagerOptions))
                {
                    this.olapCtrlObj.model.dataSource.pagerOptions.categoricalCurrentPage = this.olapCtrlObj._categCurrentPage;
                    this.olapCtrlObj.model.dataSource.pagerOptions.seriesCurrentPage = this.olapCtrlObj._seriesCurrentPage;
                }
            }
        },
        _renderPivotGrid: function (customArgs,jsonObj) {
            this.olapCtrlObj._dataModel = "XMLA";
            this.olapCtrlObj.setJSONRecords(JSON.stringify(jsonObj));
            this.olapCtrlObj.setOlapReport(this.olapCtrlObj.model.dataSource);
            this._renderPager(customArgs);
            if (this.olapCtrlObj.model.enableGroupingBar)
                this.olapCtrlObj._createGroupingBar(this.olapCtrlObj.model.dataSource);
            if (this.olapCtrlObj.model.layout != null && this.olapCtrlObj.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout)
                this.olapCtrlObj.excelLikeLayout(jsonObj);
            else
                this.olapCtrlObj.renderControlFromJSON(jsonObj);
            if (customArgs.action && (customArgs.action == "initialLoad" || customArgs.action == "navPaging")) {
                this.olapCtrlObj._trigger("renderSuccess", this.olapCtrlObj);
                this.olapCtrlObj._fieldData = { hierarchy: this.olapCtrlObj._fieldData.hierarchy, measures: this.olapCtrlObj._fieldData.measures};
            }
            //if (this.olapCtrlObj.pluginName == "ejPivotGrid")
            //    this.olapCtrlObj._ogridWaitingPopup.hide();
        },
        _onDemandExpand: function (customArgs, args) {
            var drillCellSet = args, repItms, prevItems, childPos = "", tempCellSet = this.olapCtrlObj.XMLACellSet, indxHeads, tPColCnt = 0, dCLen, dRLen,
                colLen = $(this.olapCtrlObj.XMLACellSet).find("Axis[name='Axis0'] Tuple").length, rowLen = $(this.olapCtrlObj.XMLACellSet).find("Axis[name='Axis1'] Tuple").length, cellIndx,
		        drilledVCellsln = 0, tVCells = 0;
            rowLen = rowLen ? rowLen : 1;
            drilledVCellsln = $(args).find("CellData Cell").length;
            tVCells = $(this.olapCtrlObj.XMLACellSet[1]).children().length;
            prevItems = customArgs.cellInfo.previousElements.split('>#>');
            var drilledCCells = $(args).find("Axis[name|='Axis0']").find("Tuple"), drilledRCells = $(args).find("Axis[name|='Axis1']").find("Tuple"),
		    dCLen = drilledCCells.length; dRLen = drilledRCells.length;
		    $(args).find("Axis[name='SlicerAxis']").remove();

		    var itmPos = customArgs.cellInfo.itemPosition, itmUName, selFTup, totDEle = 0, canBreak = false, prevMem = "";
		    if (customArgs.cellInfo.axis == "rowheader")
		        selFTup = drilledRCells[0];
		    else
		        selFTup = drilledCCells[0];
		    childPos = itmUName = $(selFTup).find("Member:nth-child(" + (itmPos + 1) + ") PARENT_UNIQUE_NAME").text();
            for (var itmCnt = itmPos + 1; itmCnt > 0; itmCnt--) {
                tempCellSet = $(tempCellSet).find("Tuple Member:nth-child(" + itmCnt + ") UName:contains('" + itmUName + "')").parents('tuple');
                itmUName = $(selFTup).find("Member:nth-child(" + (itmCnt - 1) + ") UName").text();
                prevMem = itmUName + prevMem;
            }
            childPos = prevMem + childPos;
            cellIndx = tempCellSet.index() + 1;
            childPos = customArgs.cellInfo.previousElements.split(">#>").join().replace(/,/g, "");
            repItms = customArgs.cellInfo.preRepItm.split(">#>").join().replace(/,/g, "");
            if (this.olapCtrlObj._drilledCellSet)
                totDEle = this.olapCtrlObj._drilledCellSet.length;

            childPos = childPos + " !#" + customArgs.cellInfo.axis
            if (!this.olapCtrlObj._drilledCellSet[0] || !totDEle) {
                this.olapCtrlObj._drilledCellSet[0] = [];
                this.olapCtrlObj._drilledCellSet[0][0] = { key: childPos, repItms: repItms};
                canBreak = true;
            }
            else {
                for (var dLen = 0; dLen < totDEle; dLen++) {
                    var chTT = this.olapCtrlObj._drilledCellSet[dLen].length, pUname = customArgs.cellInfo.parentUniqueName;
                    for (var cEllen = 0; cEllen < chTT; cEllen++) {
                        if (customArgs.cellInfo.previousElements.startsWith(this.olapCtrlObj._drilledCellSet[dLen][cEllen].key)) {
                            this.olapCtrlObj._drilledCellSet[dLen].push({ key: childPos, repItms: repItms});
                            canBreak = true;
                            break;
                        }
                        else if (this.olapCtrlObj._drilledCellSet[dLen][cEllen].key.startsWith(customArgs.cellInfo.previousElements)) {
                            this.olapCtrlObj._drilledCellSet[dLen].splice(cEllen, 0, { key: childPos, repItms: repItms });
                            canBreak = true;
                            break;
                        }
                    }

                    if (canBreak)
                        break;
                }
            }
            if(!canBreak)
            {
                this.olapCtrlObj._drilledCellSet[totDEle] = [];
                this.olapCtrlObj._drilledCellSet[totDEle].push({ key: childPos, repItms: repItms });
            }
            if (!this._isPaging) {
                if (customArgs.cellInfo.axis == "rowheader") {
                    var tuples = $(args).find("Axis[name|='Axis1']").find("Tuple");
                    this._insertCellSet("rowheader", tempCellSet, drilledRCells, drilledCCells, dRLen, colLen, dCLen, cellIndx, args);
                }
                else {
                    var tuples = $(args).find("Axis[name|='Axis1']").find("Tuple");
                    this._insertCellSet("colheader", tempCellSet, drilledCCells, drilledRCells, rowLen, colLen, dCLen, cellIndx, args);
                }
                this._generateJSONData("onDemandDrill", this.olapCtrlObj.XMLACellSet);
                //this.getJSONData("onDemandDrill", this.olapCtrlObj.model.dataSource, this.olapCtrlObj);
            }
        },
       
        _insertCellSet : function(axis, drilledSet, tuples, drilledCells, rowLen, colLen,dCLen, cellIndx,args){
            var emptyCell = $($(args).find("CellData Cell")[0]).clone();
             $(emptyCell).find("FmtValue").text("");
            if(drilledSet.length > 1){
                $(drilledSet[0]).after(tuples);
            }
            else
                $(drilledSet).after(tuples);
            var selHdrs, selColvalue = colLen;
            if(axis == "rowheader")
                selHdrs = $(this.olapCtrlObj.XMLACellSet).find("Axis[name|='Axis0']").find("Tuple");
            else{
                selHdrs = $(this.olapCtrlObj.XMLACellSet).find("Axis[name|='Axis1']").find("Tuple");
                selColvalue = dCLen;
            }
            var inEle = 0, indxHeads = $(selHdrs).filter(function(i,ele){
                if(drilledCells[inEle] && $(ele).find("UName").text() == $(drilledCells[inEle]).find("UName").text())
                {
                    inEle++;
                    return true;
                }
            });
            var rSelCnt = 0, checkEle = false;
            for (var rlen = 0; rlen < rowLen; rlen++) {
                var cellsData = "", elCnt = 0, tempCnt = 0;
                var tempScle;
                if (axis == "rowheader")
                    tempScle = (cellIndx + rlen) * selColvalue;
                else {
                    tempScle = (rlen * (colLen + selColvalue)) + cellIndx;
                }
                for (var clen = 0; clen < selColvalue; clen++) {
                    if ((axis == "rowheader" && $(indxHeads[elCnt]).index() == clen) || (axis == "colheader" && $(indxHeads[rSelCnt]).index() == rlen || !selHdrs.length)) {
                        var axisSel;
                        if (axis == "rowheader")
                            axisSel = (rlen * dCLen);
                        else
                            axisSel = rSelCnt * dCLen;
                        cellsData = $($(args).find("CellData Cell")[axisSel + elCnt]).clone();

                        $(this.olapCtrlObj.XMLACellSet).find("CellData Cell:nth-child(" + (tempScle + tempCnt) + ")").after(cellsData);
                        elCnt++; checkEle = true;
                    }
                    else {
                        $(this.olapCtrlObj.XMLACellSet).find("CellData Cell:nth-child(" + (tempScle + tempCnt) + ")").after($(emptyCell).clone());
                    }
                    tempCnt++;
                }
                if (axis == "colheader") {
                    if (checkEle)
                        rSelCnt++;
                    checkEle = false;
                }
            }
            this._setCellOrdinal(this.olapCtrlObj.XMLACellSet[1]);
        },
        _clearDrilledCellSet: function () {
            var drillCells =  $.extend([], this.olapCtrlObj._drilledCellSet), prevItm="", axis ="", drillMem;
            for (var len = 0; len < drillCells.length; len++) {
                prevItm = drillCells[len][0].key.split("!#");
                if (prevItm.length)
                    drillMem = this._getDrilledMemeber({ item: { previousElements: prevItm[0] } });
                if (drillMem.length)
                    this._onDemandCollapse({ drilledMembers: drillMem, action: "" }, prevItm[1]);
            }
        },
        _onDemandCollapse: function (args, axis) {
            var rHeads, cHeads, selHeads, lenthSHds = 0, drCHeads, drRHeads, selDrillHd;//, drilledSet = args.drilledMembers[args.drilledMembers.length - 1].cSet;
            cHeads = $(this.olapCtrlObj.XMLACellSet).find("Axis[name|='Axis0']").find("Tuple");
            rHeads = $(this.olapCtrlObj.XMLACellSet).find("Axis[name|='Axis1']").find("Tuple");
            //drCHeads = $(drilledSet).find("Axis[name|='Axis0'] Tuple");
            //drRHeads = $(drilledSet).find("Axis[name|='Axis1'] Tuple");
            try{
                //if(axis == "rowheader"){
                //    selHeads = drRHeads;
                //}
                //else
                //    selHeads = drCHeads;
                //if (axis == "rowheader")
                //    this._removeCellSets(selHeads, rHeads, cHeads, drCHeads, drRHeads, axis);
                //else
                //    this._removeCellSets(selHeads, cHeads, rHeads, drRHeads, drCHeads, axis);
                this.olapCtrlObj.model.dataSource = ej.olap._mdxParser._clearCollapsedItems(axis, args.drilledMembers[args.drilledMembers.length - 1], this.olapCtrlObj.model.dataSource);
                args.drilledMembers = args.drilledMembers.splice(0, args.drilledMembers.length - 1);
            }
            catch (ex) {
                this.olapCtrlObj._ogridWaitingPopup.hide();
            }
            if (args.drilledMembers.length)
                this._onDemandCollapse({ drilledMembers: args.drilledMembers, action: args.action }, axis);
            else if (args.action == "collapse") {
                // this._generateJSONData("onDemandDrill", this.olapCtrlObj.XMLACellSet);
                this.olapCtrlObj.model.dataSource._isCollapse = true;
                delete this._currIndex["axis"];
                this.getJSONData({ action: "onDemandCollapse" }, this.olapCtrlObj.model.dataSource, this.olapCtrlObj);
            }
        },
        _removeCellSets: function (selHeads, rHeads, cHeads, drCHeads, drRHeads, axis) {
            var lenthSHds = selHeads.length, colLen, posRemRHd, posRemCHd, selDrillHd = drRHeads[0];
            for (var len = 0; len < rHeads.length; len++) {
                if ($(rHeads[len]).find("UName").text() == $(selDrillHd).find("UName").text()) {
                    posRemRHd = rHeads[len];
                    break;
                }
            }
            var remEl = lenthSHds, remIndx = $(posRemRHd).index(), removeEl;
            if (remIndx) {
                if (axis == "rowheader") {
                    colLen = cHeads.length;
                    while (remEl > 0) {
                        $($(this.olapCtrlObj.XMLACellSet).find("Axis[name|='Axis1']").find("Tuple")[remIndx]).remove();
                        remEl--;
                    }
                    var remCel = ext = remIndx;
                    for (; remCel < (ext + lenthSHds) ; remCel++) {
                        removeEl = $($(this.olapCtrlObj.XMLACellSet[1]).children()).splice(remIndx * colLen, colLen);
                        $(removeEl).remove();
                    }
                }
                else {
                    colLen = rHeads.length; var rowLen = cHeads.length;
                    while (remEl > 0) {
                        $($(this.olapCtrlObj.XMLACellSet).find("Axis[name|='Axis0']").find("Tuple")[remIndx]).remove();
                        remEl--;
                    }
                    for (var remCel = 0; remCel < rowLen; remCel++) {
                        removeEl = $($(this.olapCtrlObj.XMLACellSet[1]).children()).splice(((colLen * remCel) - (remCel * lenthSHds)) + remIndx, lenthSHds);
                        $(removeEl).remove();
                    }
                }
            }
            this._setCellOrdinal(this.olapCtrlObj.XMLACellSet[1]);
        },
        _getDrilledMemeber: function (args) {
            var cellSets = [],  dataSet;
            var keyVal = args.item.previousElements.split('>#>').join().replace(/,/g, ""),
            dataSet = this.olapCtrlObj._drilledCellSet;
            cellSets = $.map(this.olapCtrlObj._drilledCellSet, function (ele, indx) {
                return cellSets = $.map(ele, function (item, n) {
                    if (item.key.startsWith(keyVal)) {
                        return item;
                    }
                });
           });
           
            for (var i = 0; i < dataSet.length; i++)
                {
                for (var rem = 0, ele = dataSet[i]; dataSet[i] && rem < dataSet[i].length; rem++) {
                    if (ele[rem] && ele[rem].key.startsWith(keyVal)) {
                            ele.splice(rem, 1);
                            rem--;
                            if (!ele.length) {
                                dataSet.splice(i, 1);
                                i--;
                            }
                        }
                       
                    }
                }
            return cellSets;
        },
        _getHeaderCollection : function(axisData, axis){
            var headerCollection, setIndx, tempIndx = [], level, type = "", maxLvlLen = [], KPIIndx = null, kpiInfo = {}, measuredt = {}, currentObj = this;
            headerCollection = $(axisData).filter(function (index, mem1) {
                var mem = $(mem1).find('Member'), mCol = [], preIsAll = $(mem[0]).find('LName').text().indexOf("[(All)]") != -1, allCnt = (preIsAll ? 1 : 0), curIsAll = 0;
                KPIIndx = null;
                if(preIsAll){
                    level = 0; type = "total";
                }
                else
                { 
                    type = ""; level = mem.length;
                }
                var mLen = 1;
                if($(mem[0]).find('LName').text().toLowerCase().indexOf("[measures]")!= -1)
                    mLen = 0;
                for(mLen;mLen < mem.length; mLen++)
                {
                    if($(mem[mLen]).find('LName').text().toLowerCase().indexOf("[measures]")!= -1){
                        curIsAll = preIsAll; measuredt.axis = axis; measuredt.posision = mLen;
                        if (parseInt($(mem[mLen]).find('MEMBER_TYPE').text()) == 4) {
                            var memUName = $(mem[mLen]).find('UName').text().toLowerCase();
                            if (memUName.indexOf("trend]") != -1) {
                                if (!currentObj._kpi) {
                                    currentObj._loadKpi(currentObj.olapCtrlObj.model.dataSource, this._loadKpiSuccess, "");
                                }
                                if (kpiInfo = currentObj._isKpi($(mem[mLen]).find('UName').text(), "trend")) {
                                    KPIIndx = "trend"; measuredt.isKpiExist = true;
                                }
                            }
                            else if (memUName.indexOf("status]") != -1) {
                                if (!currentObj._kpi) {
                                    currentObj._loadKpi(currentObj.olapCtrlObj.model.dataSource, this._loadKpiSuccess, "");
                                }
                                if (kpiInfo = currentObj._isKpi($(mem[mLen]).find('UName').text(), "status")) {
                                    KPIIndx = "status"; measuredt.isKpiExist = true;
                                }
                            }
                            else if (memUName.indexOf("goal]") != -1) {
                                if (!currentObj._kpi) {
                                    currentObj._loadKpi(currentObj.olapCtrlObj.model.dataSource, this._loadKpiSuccess, "");
                                }
                                if (kpiInfo = currentObj._isKpi($(mem[mLen]).find('UName').text() + "::" + $(mem[mLen]).find('Caption').text(), "goal")) {
                                    KPIIndx = "goal";
                                    measuredt.isKpiExist = true;
                                }
                            }
                        }
                    }
                    else
                        curIsAll =($(mem[mLen]).find('LName').text().indexOf("[(All)]")!= -1);
                    if((preIsAll == false && curIsAll == true) || (preIsAll == true && curIsAll == false)){	
                        allCnt++; level = mLen, type = "total";
                    }
                    preIsAll = curIsAll;
                }
                setIndx = index;
                if (allCnt < 2)
                {
                    tempIndx.push({ selIndx: setIndx, totLvl: level, type: type, kpi: KPIIndx, kpiInfo: kpiInfo });
                }
                return allCnt < 2;
            }).map(function (index, ele) {
                var mem = $(ele).find('Member'), mCol = [];
                for(var mLen =0;mLen < mem.length; mLen++)
                {
                    var levNum = parseInt($(mem[mLen]).find('LNum').text()), pUName;

                    if (axis == "colheader" && currentObj._OlapDataSource.columns[mLen]) {
                        if (currentObj._OlapDataSource.columns[mLen].hasAllMember)
                            levNum += 1;
                    }
                    else if (axis == "rowheader" && currentObj._OlapDataSource.rows[mLen])
                        if (currentObj._OlapDataSource.rows[mLen].hasAllMember)
                            levNum += 1;

                    pUName = $(mem[mLen]).find('PARENT_UNIQUE_NAME').length ? $(mem[mLen]).find('PARENT_UNIQUE_NAME').text() : "";
                    mCol.push({
                        CSS: axis, Value: $(mem[mLen]).find('Caption').text() == "" ? "(Blank)" : $(mem[mLen]).find('Caption').text(), ColSpan: 1, RowSpan: 1, HUName: $(mem[mLen]).attr('Hierarchy'), LName: $(mem[mLen]).find('LName').text(), UName: $(mem[mLen]).find('UName').text(),
                        ChildCount: parseInt($(mem[mLen]).find('CHILDREN_CARDINALITY').text()), PUName: pUName, LNum: levNum, MemberType: parseInt($(mem[mLen]).find('MEMBER_TYPE').text())
                    });

                    if ($(mem[mLen]).find('LName').text().toLowerCase().indexOf("[measures]") != -1 && tempIndx[index].kpi) {
                        mCol[mCol.length - 1].kpiInfo = tempIndx[index].kpiInfo;
                        mCol[mCol.length - 1].kpi = tempIndx[index].kpi;
                    }
                    if(maxLvlLen[mLen] == undefined)
                        maxLvlLen[mLen] = levNum;
                    else{
                        if(maxLvlLen[mLen] < levNum)
                            maxLvlLen[mLen] = levNum;
                    }							
                }
                var temp = [];
                temp[0] = mCol;
                return temp;
            });
            if(axis == "colheader")
                this._cTotIndexInfo = tempIndx;
            else
                this._rTotIndexInfo = tempIndx;
            headerCollection = { headers: headerCollection, indxInfo: tempIndx, maxLvlLen: maxLvlLen };
            if (!$.isEmptyObject(measuredt))
                this._measureDt = $.extend({}, measuredt);
            var measureCnt = 1;
            if(axis.indexOf(this._OlapDataSource.values[0].axis.substring(0,3)) > -1)
                measureCnt = this._measureDt.measureCount = this._OlapDataSource.values[0].measures.length;
            if (!this._OlapDataSource._enableBasicEngine && !this._isPaging) {
                
                var totItems = { headers: [], indxInfo: [] }, items = tempIndx, itemsCnt = tempIndx.length, totCnt = totItems.length, spanCnt = [], leafNodCmp = [], leafNodLen = 0, subPos = [], isSubTRem = false;
                try {
                    for (var hCnt = 0; hCnt < itemsCnt; hCnt++)
                    {
                        if (hCnt < itemsCnt && headerCollection.indxInfo[hCnt].type == "total")
                        {
                            totItems.indxInfo.push(headerCollection.indxInfo.splice(hCnt, 1)[0]);
                            totItems.headers.push(headerCollection.headers.splice(hCnt,1)[0]);
                            itemsCnt--; hCnt--; 					
                        }	
                    }
                    var hlen = headerCollection.headers.length > 0 ? headerCollection.headers[0].length: 0, insertCnt = 0, measUd = 0;
                    if (this._measureDt.posision == hlen - 1 && this._measureDt.axis == axis)
                        measUd = 1;
                    itemsCnt = headerCollection.headers.length;
                    for (var hCnt = 0; hCnt <= itemsCnt; hCnt++) {
                        var prevMem = null, nextMem = null, currentMem = null, members = null;
                        members = this._updateMemberVariables(headerCollection.headers, prevMem, nextMem, currentMem, hCnt);
                        prevMem = members.prev; nextMem = members.next; currentMem = members.cur;
                        members = null;
                        for (var cnt = hlen - 2 - measUd; cnt >= 0; cnt--)
                        {
                            var isDif = this._comparePrevMembers(headerCollection.headers, itemsCnt, hCnt, cnt, hlen, -2);
                            if (hCnt == itemsCnt || (hCnt > 0 && ((prevMem && prevMem[cnt].UName != currentMem[cnt].UName) || (prevMem[cnt].UName == currentMem[cnt].UName && isDif)))) {

                                //Removing additional total here
                                if (currentMem && prevMem[cnt].UName == currentMem[cnt].PUName) {
                                    var remLen = this._removeSubtotalMembers(headerCollection, hCnt, cnt);
                                    hCnt -= remLen;
                                    itemsCnt -= remLen;
                                    members = this._updateMemberVariables(headerCollection.headers, prevMem, nextMem, currentMem, hCnt);
                                    prevMem = members.prev; nextMem = members.next; currentMem = members.cur;
                                    members = null;
                                }
                                else {
                                    var findParent = prevMem, headers, totCnt = 0, collection, start = 0, end = 0;
                                    if (prevMem)
                                        end = prevMem[cnt].LNum;
                                    if (currentMem)
                                        start = currentMem[cnt].LNum;
                                    var isParent = false;
                                    for (var ttLn = start; ttLn <= end; ttLn++) {
                                        collection = this._getSummaryHeaders(findParent, totItems, cnt, isParent, measUd);
                                        totCnt = collection.headers.length;
                                        while (collection.headers.length > 0) {
                                            headerCollection.headers.splice(hCnt, 0, collection.headers.pop());
                                            headerCollection.indxInfo.splice(hCnt, 0, collection.indexInfo.pop());
                                        }
                                        isParent = true;
                                        hCnt += totCnt; itemsCnt += totCnt;
                                        findParent = headerCollection.headers[hCnt-1];
                                    }
                                
                                }
                            }
                        }
                        if (hCnt == itemsCnt && totItems.headers.length > 0)
                        {
                            var incCount = 0;
                            while (totItems.headers.length > 0) {
                                headerCollection.headers.splice(hCnt, 0, totItems.headers.pop());
                                headerCollection.indxInfo.splice(hCnt, 0, totItems.indxInfo.pop());
                                itemsCnt++; incCount++;
                            }
                            hCnt += incCount;
                        }
                    }
                    var cnt = 0, isLeafSum = false, parentUN = "";
                    leafNodCmp = { headers: [], indxInfo: [] }; cnt = hlen - 1 - measUd;
                    itemsCnt = headerCollection.headers.length;
                    for (var hCnt = 0; hCnt < itemsCnt; hCnt++) {
                        var nextMem, prevMem = this._findPreviousMember(headerCollection.headers, hCnt - 1, cnt), parentUN;
                        if (hCnt > 0 && headerCollection.headers[hCnt - 1][cnt].UName != headerCollection.headers[hCnt][cnt].UName && (cnt == hlen - 1 - measUd && maxLvlLen[cnt] > 1)) {
                            if (hCnt > 0 && headerCollection.headers[hCnt] != undefined && headerCollection.headers[hCnt - 1][cnt].LNum != 0 && headerCollection.headers[hCnt - 1][cnt].UName == headerCollection.headers[hCnt][cnt].PUName) {
                                for (var len = prevMem; len < 0; len++) {
                                    headerCollection.indxInfo[(hCnt + len)].lnum = headerCollection.headers[hCnt + len][cnt].LNum;
                                    headerCollection.indxInfo[(hCnt + len)].type = "total";
                                    leafNodCmp.indxInfo.push(headerCollection.indxInfo.splice((hCnt + len) , 1)[0]);
                                    leafNodCmp.headers.push(headerCollection.headers.splice((hCnt + len), 1)[0]);
                                    if (hCnt + 1 == itemsCnt)
                                        parentUN = headerCollection.headers[hCnt][cnt].PUName;
                                    else {
                                        hCnt--; itemsCnt--;
                                    }
                                }
                            }
                            if (hCnt != 0 && headerCollection.headers[hCnt] != undefined && headerCollection.headers[hCnt - 1][cnt].LNum > headerCollection.headers[hCnt][cnt].LNum || isLeafSum) {
                                var remIndx = [], retObj = this._insertSummaryHeaders(headerCollection, leafNodCmp, remIndx, hCnt, cnt, hlen, insertCnt, parentUN, isSubTRem, subPos);
                                    itemsCnt = retObj.itmCnt, hCnt = retObj.hCnt, insertCnt = retObj.insCnt, subPos[cnt] = retObj.subPos;
                            }
                        }
                       
                    }
                }
                catch (ex) {
                    this.olapCtrlObj._waitingPopup.hide();
                }
            }
            if(axis =="rowheader")
                this._rBIndx = tempIndx;
            else 
                this._cBIndx = tempIndx;
             
            return headerCollection;
        },
        _insertSummaryHeaders: function (headerCollection, leafNodCmp, remIndx, hCnt, cnt, hlen, insertCnt, parentUN, isSubTRem, subPos) {
            var ln = 0, remIndx = [], start, endLp, itemsCnt, uniqueNM = "", insertCnt = 0;

            if (headerCollection.headers[hCnt - 1])
                parentUN = headerCollection.headers[hCnt - 1][cnt].PUName;
            itemsCnt = headerCollection.headers.length;
            start = headerCollection.headers[hCnt][cnt].LNum;
            endLp = headerCollection.headers[hCnt - 1][cnt].LNum;
            var innerFlag = this._comparePrevMembers(headerCollection.headers, itemsCnt, hCnt, cnt, hlen, insertCnt);
            for (var lev = start; lev < endLp; lev++) {
                $.grep(leafNodCmp.headers, function (ele, indx) {
                    if (parentUN == ele[cnt].UName || headerCollection.headers[hCnt + 1 + insertCnt] != undefined && headerCollection.headers[hCnt][cnt].UName != headerCollection.headers[hCnt + 1 + insertCnt][cnt].UName && headerCollection.headers[hCnt][cnt].PUName == ele[cnt].UName && innerFlag) {
                        uniqueNM = ele[cnt].PUName;
                        remIndx.push(indx);
                    }
                });
                parentUN = uniqueNM;
                if (innerFlag) {
                    remIndx.reverse(); innerFlag = false;
                }
                while (remIndx.length > 0) {
                    var remLn = remIndx.length - 1, remVal = remIndx[remIndx.length - 1];
                    headerCollection.headers.splice(hCnt, 0, leafNodCmp.headers.splice(remIndx[remIndx.length - 1], 1)[0]);
                    headerCollection.indxInfo.splice(hCnt, 0, leafNodCmp.indxInfo.splice(remIndx[remIndx.length - 1], 1)[0]);
                    while (remLn >= 0) {
                        if (remVal < remIndx[remLn])
                            remIndx[remLn]--;
                        remLn--;
                    }
                    remIndx.pop();
                    itemsCnt++;  insertCnt++;
                    if (isSubTRem)
                        subPos[cnt]++;
                }
                if(insertCnt > 0)
                {
                    hCnt += insertCnt;
                    insertCnt = 0;
                }
            }
            return { itmCnt: itemsCnt, hCnt: hCnt, insCnt: insertCnt, subPos: subPos[cnt] };
        },
        _comparePrevMembers: function (headers, itemsCnt, hCnt, cnt, hlen, insertCnt) {
            var isDiff = false;
            if (cnt > 0 && hCnt < itemsCnt && hCnt + 1 + insertCnt >= 0 && hCnt + 1 + insertCnt < itemsCnt) {
                for (var prv = cnt - 1; prv >= 0; prv--)
                    if (headers[hCnt][prv].UName != headers[hCnt + 1 + insertCnt][prv].UName)
                        isDiff = true;
            }
            return isDiff;
        },
        _updateMemberVariables: function(headers, prevMem, nextMem, currentMem, hCnt){
            if (headers[hCnt])
                currentMem = headers[hCnt];
            if (headers[hCnt + 1])
                nextMem = headers[hCnt + 1];
            else
                nextMem = null;
            if (headers[hCnt - 1])
                prevMem = headers[hCnt - 1];
            else
                prevMem = null;
            return {cur: currentMem, prev: prevMem, next:nextMem};
        },
        _removeSubtotalMembers: function (headerCollection, hCnt, cnt)
        {
            var remLn = hCnt - 1, uname = headerCollection.headers[remLn][cnt].UName;
            while (headerCollection.headers[remLn] && headerCollection.headers[remLn][cnt].UName == uname)
            {
                headerCollection.indxInfo.splice(remLn, 1);
                headerCollection.headers.splice(remLn, 1);
                remLn--;
            }
            return (hCnt - (remLn + 1));
        },
        _getSummaryHeaders: function (prevMem, totHeaders, cnt, isParent, measUd) {
            var ttHeaders = totHeaders.headers, prev = prevMem, elCnt = cnt, header, rinfo = [],info = [], indInfo = totHeaders.indxInfo, totInfo;

            //Matched totals
            totInfo = $.grep(ttHeaders, function (ele, index) {
                var isMatch = false;
                for (var ln = elCnt; ln >= 0; ln--) {
                    if (ele[ln].UName == prev[ln].UName || (isParent && ln == elCnt  && ele[ln].UName == prev[ln].PUName)) {
                        if (ln == 0) {
                            isMatch = true;
                            info.push(indInfo[index]);
                        }
                    }
                    else
                        break;
                }
                return isMatch;
            });

            //Remaining items
            totHeaders.headers = $.grep(ttHeaders, function (ele, index) {
                var isMatch = true;
                for (var ln = elCnt; ln >= 0; ln--) {
                    if (ele[ln].UName == prev[ln].UName || (isParent && ln == elCnt && ele[ln].UName == prev[ln].PUName)) {
                        if (ln == 0) {
                            isMatch = false;

                        }
                    }
                    else
                        break;
                }
                if (isMatch)
                    rinfo.push(indInfo[index]);
                return isMatch;
            });
            totHeaders.indxInfo = rinfo;
            return { headers: totInfo, indexInfo: info  };
        },
        _drillOrderHeaderCollection: function (headersInfo, axisData, curAxis) {
            var orderInfo = headersInfo, selectedHeaders, headerData = axisData, axis = curAxis, rowCnt = 0, currentObj = this;

            selectedHeaders = $(orderInfo).map(function (indx, info) {
                var mem = $(headerData[info.selIndx]).find('Member'), mCol = [];
                mCol[rowCnt] = [];
                    for (var mLen = 0; mLen < mem.length; mLen++) {
                        var levNum = parseInt($(mem[mLen]).find('LNum').text()), pUName;
                        if (axis == "colheader" && currentObj._OlapDataSource.columns[mLen]) {
                        if (currentObj._OlapDataSource.columns[mLen].hasAllMember)
                            levNum += 1;
                    }
                    else if (axis == "rowheader" && currentObj._OlapDataSource.rows[mLen])
                        if (currentObj._OlapDataSource.rows[mLen].hasAllMember)
                            levNum += 1;
                        pUName = $(mem[mLen]).find('PARENT_UNIQUE_NAME').length ? $(mem[mLen]).find('PARENT_UNIQUE_NAME').text() : "";
                        mCol[rowCnt].push({
                            CSS: axis, Value: $(mem[mLen]).find('Caption').text(), ColSpan: 1, RowSpan: 1, HUName: $(mem[mLen]).attr('Hierarchy'), LName: $(mem[mLen]).find('LName').text(), UName: $(mem[mLen]).find('UName').text(),
                            ChildCount: parseInt($(mem[mLen]).find('CHILDREN_CARDINALITY').text()), PUName: pUName, LNum: levNum, MemberType: parseInt($(mem[mLen]).find('MEMBER_TYPE').text())
                        });
                        var member = mCol[rowCnt][mCol[rowCnt].length - 1];
                        
                        if (info.kpiInfo && member.UName.toLowerCase().indexOf("[measures]") > -1 && member.MemberType == 4)
                            mCol[rowCnt][mCol[rowCnt].length - 1].kpiInfo = info.kpiInfo;
                        if (info.kpi && member.UName.toLowerCase().indexOf("[measures]") > -1 && member.MemberType == 4)
                            mCol[rowCnt][mCol[rowCnt].length - 1].kpi = info.kpi;
                    }
                return mCol;
            });
            return selectedHeaders;

        },
        _loadKpi: function (args, successMethod, customArgs) {
            customArgs = { action: "loadFieldElements" };
            var conStr = this._getConnectionInfo(args.data);
            var pData = "<Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\"><Header/><Body><Discover xmlns=\"urn:schemas-microsoft-com:xml-analysis\"><RequestType>MDSCHEMA_KPIS</RequestType><Restrictions><RestrictionList><CATALOG_NAME>" + args.catalog + "</CATALOG_NAME><CUBE_NAME>" + args.cube + "</CUBE_NAME></RestrictionList></Restrictions><Properties><PropertyList><Catalog>" + args.catalog + "</Catalog></PropertyList></Properties></Discover></Body></Envelope>";
            this.olapCtrlObj.doAjaxPost("POST", conStr.url, { XMLA: pData }, this._loadKpiSuccess, null, customArgs);
        },
        _loadKpiSuccess: function (customArgs, args) {
            this._kpi = args;
        },
        _isKpi: function (memeberUName, type) {
            var kpiRow = $(this._kpi).find("row:contains(" + memeberUName.split("::")[0] + ")"), kpiInfo = {};
            if (kpiRow.length) {
                if (type == "trend") {
                    kpiInfo.Graphic = $(kpiRow).find("KPI_TREND_GRAPHIC").text();
                    kpiInfo.Value = $(kpiRow).find("KPI_NAME").text();
                }
                else if (type == "status") {
                    kpiInfo.Graphic = $(kpiRow).find("KPI_STATUS_GRAPHIC").text();
                    kpiInfo.Value = $(kpiRow).find("KPI_NAME").text();
                }
                else if (type == "goal") {
                    kpiInfo.Caption = memeberUName.split("::")[1];
                    kpiInfo.Value = $(kpiRow).find("KPI_NAME").text();
                }
                return kpiInfo;
            }
            else
                return false;
        },
     
        _getValueCells: function (cellData, colBLen) {
            var valueCell, colLen = this._columnHeaders.headers.length, rowLen = this._rowHeaders.headers.length ? this._rowHeaders.headers.length : 1, rCnt = 0, cCnt = 0, vCell = [];
            this._valueCells[rCnt] = [];
            this._fillAllValueCells();
            cellData = $(this.olapCtrlObj.XMLACellSet[1]).children();
            if (this._OlapDataSource._enableBasicEngine || this._isPaging)
                for (var cLen = 0; cLen < cellData.length; cLen++) {
                    if (cCnt < colLen) {
                        this._valueCells[rCnt][cCnt] = { ActualValue: $(cellData[cLen]).find("Value").text(), Value: ($(cellData[cLen]).find("FmtValue")[0] ? $(cellData[cLen]).find("FmtValue").text() : ""), FormatString: ($(cellData[cLen]).find("FormatString")[0] ? $(cellData[cLen]).find("FormatString").text() : ""), kpi: (!ej.isNullOrUndefined(this._cBIndx[cCnt]) && this._cBIndx[cCnt].kpi) ? this._cBIndx[cCnt].kpi : (!ej.isNullOrUndefined(this._rBIndx[rCnt]) && this._rBIndx[rCnt].kpi) ? this._rBIndx[rCnt].kpi : "" };
                        cCnt++;
                    }
                    if (cCnt == colLen && rCnt + 1 < rowLen) {
                        cCnt = 0; rCnt++;
                        this._valueCells[rCnt] = [];
                    }
                }
            else {
                for (var rLen = 0; rLen < rowLen; rLen++) {
                    var rowIndx = this._rBIndx.length ? this._rBIndx[rLen].selIndx : 0;
                    for (var cLen = 0; cLen < colLen; cLen++) {
                        if (cellData) {
                            var cellVal = $(cellData[((rowIndx * colBLen) + this._cBIndx[cLen].selIndx)]), summary = "";
                            if (this._columnHeaders.indxInfo[cLen] && this._columnHeaders.indxInfo[cLen].type == "total" || this._rowHeaders.indxInfo[rLen] && this._rowHeaders.indxInfo[rLen].type == "total")
                                summary = "summary";
                            if (cCnt < colLen) {
                                this._valueCells[rLen][cLen] = { ActualValue: $(cellVal).find("Value").text(), Value: $(cellVal).find("FmtValue")[0] ? this._getFormatedValue($(cellVal), $(cellVal).find("FormatString")[0]) : "", FormatString: $(cellVal).find("FormatString")[0] ? $(cellVal).find("FormatString").text() : "", kpi: this._cBIndx[cLen].kpi ? this._cBIndx[cLen].kpi : this._rBIndx[rLen] ? this._rBIndx[rLen].kpi : "", summary: summary, Span: this._isNoSummary && summary == "summary" ? "Block" : "None" };
                                cCnt++;
                            }
                            if (cCnt == colLen && rCnt + 1 < rowLen) {
                                cCnt = 0; rCnt++;
                                this._valueCells[rCnt] = [];
                            }
                        }
                    }
                }
            }
            return this._valueCells;
        },
        _fillAllValueCells: function (cellData) {
            var cellData = $(this.olapCtrlObj.XMLACellSet[1]).children();
            if (!ej.isNullOrUndefined(cellData))
            {
                var emptyCell = !$(cellData[0]).clone();
                $(emptyCell).find("FmtValue").text("");
                var cell = cellData;
                for (var cnt = 0; cnt < cellData.length; cnt++) {
                    var curVal = parseInt($(cellData[cnt]).attr("CellOrdinal")), nextVal;
                    if (cellData[cnt + 1])
                        nextVal = parseInt($(cellData[cnt + 1]).attr("CellOrdinal"))
                    if (curVal + 1 < nextVal) {
                        for (var ins = curVal + 1; ins < nextVal; ins++) {
                            // cellData.splice(ins, 0, $(emptyCell).clone().attr("CellOrdinal", ins)[0]);
                            $(cellData[cnt]).after($(emptyCell).clone().attr("CellOrdinal", ins)[0]);
                            //cnt++;
                        }
                    }
                }
            }
            return cellData;
        },
        _setCellOrdinal: function (cellData) {
            var cellCol = $(cellData).find("Cell");
            for (var len = 0; len < cellCol.length; len++)
                $(cellCol[len]).attr("CellOrdinal", len);
        },
        _getFormatedValue: function (cell, format) {
            var val, format;
            if ((this.olapCtrlObj.model.locale == "en-US" || !$.isNumeric(parseFloat($(cell).find("Value").text())))&&$(cell).length>0)
                val = $(cell).find("FmtValue").text();
            else
            {
                var format = $(format).length > 0 ? $(format).text().toLowerCase() : (ej.isNullOrUndefined(format) ? "" : format.length > 0 ? format : "");
                var val = $(cell).length > 0 ? parseFloat(cell.find("Value").text()) : cell;
                switch (format) {
                    case "decimal":
                        val = parseFloat(ej.widgetBase.formatting("{0:D2}", val, this.olapCtrlObj.model.locale));
                        break;
                    case "percent":
                        val = ej.widgetBase.formatting("{0:P0}", val, this.olapCtrlObj.model.locale);
                        break;
                    case "number":
                        val = ej.widgetBase.formatting("{0:N}", val, this.olapCtrlObj.model.locale);
                        break;
                    case "currency":
                        val = ej.widgetBase.formatting("{0:C2}", val, this.olapCtrlObj.model.locale);
                        break;
                    case "date":
                        val = new Date(((Number(val) - 2) * (1000 * 3600 * 24)) + new Date("01/01/1900").getTime());
                        if (this._isDateTime(val))
                            val = ej.widgetBase.formatting("{0:MM/dd/yyyy}", val, this.olapCtrlObj.model.locale)
                        break;
                    case "scientific":
                        val = Number(val).toExponential(2).replace("e", "E");
                        break;
                    case "accounting":
                        val = this._toAccounting(val, "{0:C2}", this.olapCtrlObj.model.locale);
                        break;
                    case "time":
                        val = new Date(((Number(val) - 2) * (1000 * 3600 * 24)) + new Date("01/01/1900").getTime());
                        if (this._isDateTime(val))
                            val = ej.widgetBase.formatting("{0:h:mm:ss tt}", val, this.olapCtrlObj.model.locale);
                        break;
                    case "fraction":
                        val = this._toFraction(val);
                        val = "numerator" in val ? val.integer + " " + val.numerator + "/" + val.denominator : val.integer
                        break;
                    default: val = $(cell).find("FmtValue").text();
                }
            }
            return val;
        },

        _isDateTime: function (date) {
            return Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date.valueOf());
        },
        _toAccounting: function (value, formatStr, locale) {
            var numFormat = ej.preferredCulture(locale).numberFormat, prefix, suffix, symbol = numFormat.currency.symbol;
            val = ej.widgetBase.formatting(formatStr, value, this.olapCtrlObj.model.locale);
            var trunVal = val.replace(symbol, ""), idx = val.indexOf(symbol);
            if (!idx || (value < 0 && idx === 1)) {
                prefix = symbol;
                suffix = !Number(value) ? "-" : trunVal;
            }
            else {
                prefix = !Number(value) ? "-" : trunVal;
                suffix = symbol;
            }
            value = prefix + "   " + suffix;
            return value;
        },
        _toFraction: function (value) {
            if (this._isNumber(value)) {
                var input = value.toString(), integerVal = input.split(".")[0], decimalVal = input.split(".")[1];
                if (!decimalVal)
                    return { integer: value };
                var wholeVal = (+decimalVal).toString(), placeVal = this._getPlaceValue(decimalVal, wholeVal), gcd = this._getGCD(wholeVal, placeVal);
                return { integer: integerVal, numerator: Number(wholeVal) / gcd, denominator: Number(placeVal) / gcd };
            }
            return null;
        },
        _isNumber: function (val) {
            return val - parseFloat(val) >= 0;
        },
        _getGCD: function (a, b) {  //make generic gcd of multiple no
            a = Number(a);
            b = Number(b);
            if (!b)
                return a;
            return this._getGCD(b, a % b);
        },
        _getPlaceValue: function (val, digit) {
            var index = val.indexOf(digit) + digit.length;
            return "1" + Array(index + 1).join("0");
        },
        _populateEngine: function (rwHeaders, colHeaders, valueCells) {
            var rLen = rwHeaders.length, cLen = colHeaders.length, rILen = rLen ? rwHeaders[0].length : rLen, cILen = cLen ? colHeaders[0].length : cLen, rIndex, cIndex, headerEngine = [],
            vRLen = valueCells.length, vCLen = valueCells[0].length;
            try{
                this.pivotEngine = [];
                var cDrillPos = [], cRSpanCalc = [], temPosChk = false, noSumSpanCalc = [];
                var isNamedSets = false, rowEngine = [];
                for (var rCnt = 0; rCnt < cLen; rCnt++) {
                    if (this.pivotEngine[rCnt + cILen] == undefined)
                        this.pivotEngine[rCnt + cILen] = [];
                    if (rCnt == 0) {
                        this.pivotEngine[0] = [];
                        this.pivotEngine[0][0] = { CSS: "none", Value: "", ColSpan: (this._indexCCell ? this._indexCCell : 1), RowSpan: (this._indexRCell ? this._indexRCell : 1), HUName: "", LName: "", UName: "", LNum: "" };
                    }
                    for (var cCnt = 0; cCnt < cILen; cCnt++) {
                        isNamedSets = false;
                        if (this._OlapDataSource.columns && this._OlapDataSource.columns[cCnt] && this._OlapDataSource.columns[cCnt].isNamedSets)
                            isNamedSets = true;
                        this._pivotEngineSpanCalculation("colheader", colHeaders, rwHeaders, this._columnHeaders.maxLvlLen, valueCells, cCnt, rCnt, cRSpanCalc, cDrillPos, this._cTotIndexInfo, isNamedSets, noSumSpanCalc);
                    }
                }
                rowEngine = this.pivotEngine.slice(); this.pivotEngine = [];
                for (var rCnt = 0; rCnt < rowEngine.length; rCnt++) {
                    if (rowEngine[rCnt])
                        for (var cCnt = 0; cCnt < rowEngine[rCnt].length; cCnt++) {
                            if (rowEngine[rCnt][cCnt]) {
                                if (this.pivotEngine[cCnt] == undefined)
                                    this.pivotEngine[cCnt] = [];
                           
                                this.pivotEngine[cCnt][rCnt] = { CSS: rowEngine[rCnt][cCnt].CSS, ColSpan: rowEngine[rCnt][cCnt].RowSpan, HUName: rowEngine[rCnt][cCnt].HUName, LName: rowEngine[rCnt][cCnt].LName, LNum: rowEngine[rCnt][cCnt].LNum, RowSpan: rowEngine[rCnt][cCnt].ColSpan, UName: rowEngine[rCnt][cCnt].UName, PUName: rowEngine[rCnt][cCnt].PUName, Value: rowEngine[rCnt][cCnt].Value, ChildCount: rowEngine[rCnt][cCnt].ChildCount, MemberType: rowEngine[rCnt][cCnt].MemberType, Span: rowEngine[rCnt][cCnt].Span == "Block" ? "Block" : "None" };
                                if (rowEngine[rCnt][cCnt].kpiInfo) {
                                    this.pivotEngine[cCnt][rCnt].kpiInfo = rowEngine[rCnt][cCnt].kpiInfo;
                                    this.pivotEngine[cCnt][rCnt].kpi = rowEngine[rCnt][cCnt].kpi;
                                }
                            }
                        }
                }

                var drillPos = [], rSpanCalc = [], temPosChk = false, noSumSpanCalc = [];
                for (var rCnt = 0; rCnt < rLen; rCnt++) {
                    if (this.pivotEngine[rCnt + this._indexCCell] == undefined)
                        this.pivotEngine[rCnt + this._indexCCell] = [];

                    for (var cCnt = 0; cCnt < rILen; cCnt++) {
                        isNamedSets = false;
                        if (this._OlapDataSource.rows && this._OlapDataSource.rows[cCnt] && this._OlapDataSource.rows[cCnt].isNamedSets)
                            isNamedSets = true;
                        this._pivotEngineSpanCalculation("rowheader", rwHeaders, colHeaders, this._rowHeaders.maxLvlLen, valueCells, cCnt, rCnt, rSpanCalc, drillPos, this._rTotIndexInfo, isNamedSets, noSumSpanCalc);
                    }
                }

                headerEngine = $.extend(true, [], this.pivotEngine);
                rILen = this._measureDt.axis == 'rowheader' ? (this._indexRCell + 1) : this._indexRCell;
                cILen = this._indexCCell ? this._indexCCell : cILen;
                for (var rCnt = 0; rCnt < vRLen; rCnt++) {
                    if (this.pivotEngine[rCnt + cILen] != undefined)
                        rILen = this.pivotEngine[rCnt + cILen].length;
                    for (var cCnt = 0; cCnt < vCLen; cCnt++) {
                        if (!ej.isNullOrUndefined(valueCells[rCnt][cCnt])) {
                            if (this.pivotEngine[rCnt + cILen] == undefined)
                                this.pivotEngine[rCnt + cILen] = [];
                            var cssName = this._setClassName(valueCells[rCnt][cCnt]);
                            valueCells[rCnt][cCnt].CSS = cssName;
                            if (cssName.indexOf("kpiiconvalue") > -1 && (!this.olapCtrlObj.pluginName === "ejPivotGauge" || this.olapCtrlObj.pluginName == "ejPivotGrid" || this.olapCtrlObj.pluginName == "ejPivotClient"))
                                valueCells[rCnt][cCnt].Value = "";
                            else if (cssName.indexOf("kpiiconvalue") > -1)
                                valueCells[rCnt][cCnt].Value = parseInt(valueCells[rCnt][cCnt].Value);
                            this.pivotEngine[rCnt + this._indexCCell][cCnt + this._indexRCell] = valueCells[rCnt][cCnt];
                        }
                    }
                }
                var test = $.grep(this.pivotEngine, function (value, index) {
                    var temp = value;
                    return temp;
                });
                if (this._isPaging) {
                    if (!ej.isNullOrUndefined(this.olapCtrlObj._pagingSavedObjects.curDrilledItem.uniqueName) && this.olapCtrlObj._pagingSavedObjects.curDrilledItem.action == "collapse") {
                        $.each(this.olapCtrlObj._pagingSavedObjects.drillEngine, function (i, v) {
                            if (v.UName == (ej.olap.base.olapCtrlObj._pagingSavedObjects.curDrilledItem.uniqueName.split("::")[0]).split("amp;").join("")) {
                                ej.olap.base.olapCtrlObj._pagingSavedObjects.drillEngine.splice(i, 1);
                                return false;
                            }
                        })
                    }
                    else if (!ej.isNullOrUndefined(this.olapCtrlObj._pagingSavedObjects.curDrilledItem.index)) {
                        this.olapCtrlObj._pagingSavedObjects.drillEngine.push(this.olapCtrlObj._pagingSavedObjects.savedHdrEngine[parseInt(this.olapCtrlObj._pagingSavedObjects.curDrilledItem.index.split(',')[1])][parseInt(this.olapCtrlObj._pagingSavedObjects.curDrilledItem.index.split(',')[0])]);
                        this.olapCtrlObj._pagingSavedObjects.drillEngine[this.olapCtrlObj._pagingSavedObjects.drillEngine.length - 1].ChildCount = -1;
                    }
                    else if (!ej.isNullOrUndefined(this.olapCtrlObj._pagingSavedObjects.curDrilledItem.uniqueName)) {
                        $.each(this.olapCtrlObj._pagingSavedObjects.savedHdrEngine, function (rI, row) {
                            $.each(row, function (cI, column) {
                                if (!ej.isNullOrUndefined(column) && column.UName == (ej.olap.base.olapCtrlObj._pagingSavedObjects.curDrilledItem.uniqueName.split("::")[0]).split("amp;").join("")) {
                                    ej.olap.base.olapCtrlObj._pagingSavedObjects.drillEngine.push(ej.olap.base.olapCtrlObj._pagingSavedObjects.savedHdrEngine[rI][cI]);
                                    return false;
                                }
                            })
                        })
                        this.olapCtrlObj._pagingSavedObjects.drillEngine[this.olapCtrlObj._pagingSavedObjects.drillEngine.length - 1].ChildCount = -1;
                    }
                    $.map(this.olapCtrlObj._pagingSavedObjects.drillEngine, function (value) {
                        var inColAxisIndex = 0;
                        var inColAxis = $.map(ej.olap.base.olapCtrlObj.model.dataSource.columns, function (cField, index) {
                            if (ej.olap.base.olapCtrlObj._isMondrian) {
                                inColAxisIndex = cField.fieldName.replace(/\]/g, '').replace(/\[/g, '') == value.HUName.replace(/\[/g, ' ').replace(/\[/g, '') ? index : inColAxisIndex;
                                return cField.fieldName.replace(/\]/g, '').replace(/\[/g, '') == value.HUName.replace(/\[/g, ' ').replace(/\[/g, '') ? true : false;
                            }
                            else {
                                inColAxisIndex = cField.fieldName == value.HUName ? index : inColAxisIndex;
                                return cField.fieldName == value.HUName ? true : false;
                            }
                        })
                        value.CSS = inColAxis[inColAxisIndex] ? "colheader" : "rowheader";
                    })
                    this.olapCtrlObj._pagingSavedObjects.curDrilledItem = {};

                    for (var rCnt = this.pivotEngine[0][0].RowSpan - 2; rCnt >= 0; rCnt--) {
                        var UName = "empty";
                        for (cCnt = 1; cCnt < this.pivotEngine[this.pivotEngine[0][0].RowSpan - 1].length ; cCnt++) {
                            if (ej.isNullOrUndefined(this.pivotEngine[rCnt])) {
                                this.pivotEngine[rCnt] = [];
                            }
                            if (!ej.isNullOrUndefined(this.pivotEngine[rCnt + 1]) && ej.isNullOrUndefined(this.pivotEngine[rCnt][cCnt]) && !ej.isNullOrUndefined(this.pivotEngine[rCnt + 1][cCnt])) {
                                this.pivotEngine[rCnt][cCnt] = $.grep(this.olapCtrlObj._pagingSavedObjects.drillEngine, function (v) {
                                    return v.UName == ej.olap.base.pivotEngine[rCnt + 1][cCnt].PUName;
                                })[0];
                                if (!ej.isNullOrUndefined(this.pivotEngine[rCnt][cCnt])) {
                                    if (!ej.isNullOrUndefined(this.pivotEngine[rCnt][cCnt - 1]) && this.pivotEngine[rCnt][cCnt - 1].UName == this.pivotEngine[rCnt][cCnt].UName)
                                        this.pivotEngine[rCnt][cCnt].ColSpan = this.pivotEngine[rCnt][cCnt - 1].ColSpan + 1;
                                    else
                                        this.pivotEngine[rCnt][cCnt].ColSpan = 1;
                                    this.pivotEngine[rCnt][cCnt].RowSpan = 1;
                                    UName = this.pivotEngine[rCnt][cCnt].UName;
                                }
                            }
                        }
                        var colSpan = 1;
                        for (cCnt = this.pivotEngine[this.pivotEngine[0][0].RowSpan - 1].length - 2; cCnt > 0 ; cCnt--) {
                            if (!ej.isNullOrUndefined(this.pivotEngine[rCnt]) && !ej.isNullOrUndefined(this.pivotEngine[rCnt][cCnt]) && !ej.isNullOrUndefined(this.pivotEngine[rCnt][cCnt + 1]) && this.pivotEngine[rCnt][cCnt + 1].UName == this.pivotEngine[rCnt][cCnt].UName) {
                                this.pivotEngine[rCnt][cCnt].ColSpan == this.pivotEngine[rCnt][cCnt + 1].ColSpan;
                                colSpan++;
                            }
                            else if (!ej.isNullOrUndefined(this.pivotEngine[rCnt]) && !ej.isNullOrUndefined(this.pivotEngine[rCnt][cCnt + 1])) {
                                this.pivotEngine[rCnt][cCnt + 1].ColSpan = colSpan == 1 ? this.pivotEngine[rCnt][cCnt + 1].ColSpan : colSpan;
                                colSpan = 1;
                            }
                        }
                    }

                    for (var rCnt = this.pivotEngine[0][0].RowSpan; rCnt < this.pivotEngine.length; rCnt++) {
                        var PUName = "empty";
                        for (cCnt = this.pivotEngine[0][0].ColSpan - 1; cCnt >= 0; cCnt--) {
                            if (!ej.isNullOrUndefined(this.pivotEngine[rCnt][cCnt]))
                                PUName = this.pivotEngine[rCnt][cCnt].PUName;
                            else {
                                if (!ej.isNullOrUndefined(this.pivotEngine[rCnt - 1][cCnt]) && this.pivotEngine[rCnt - 1][cCnt].UName == PUName) {
                                    this.pivotEngine[rCnt][cCnt] = $.grep(this.olapCtrlObj._pagingSavedObjects.drillEngine, function (v) {
                                        return v.UName == PUName;
                                    })[0];
                                    if (!ej.isNullOrUndefined(this.pivotEngine[rCnt][cCnt])) {
                                        this.pivotEngine[rCnt][cCnt].RowSpan = this.pivotEngine[rCnt - 1][cCnt].RowSpan + 1;
                                        this.pivotEngine[rCnt][cCnt].ColSpan = 1;
                                        PUName = this.pivotEngine[rCnt][cCnt].PUName;
                                    }
                                }
                                else {
                                    this.pivotEngine[rCnt][cCnt] = $.grep(this.olapCtrlObj._pagingSavedObjects.drillEngine, function (v) {
                                        return v.UName == PUName;
                                    })[0];
                                    if (!ej.isNullOrUndefined(this.pivotEngine[rCnt][cCnt])) {
                                        this.pivotEngine[rCnt][cCnt].RowSpan = 1;
                                        this.pivotEngine[rCnt][cCnt].ColSpan = 1;
                                        PUName = this.pivotEngine[rCnt][cCnt].PUName;
                                    }
                                }
                            }
                        }
                    }
                    this.olapCtrlObj._pagingSavedObjects.savedHdrEngine = headerEngine;
                }
            }
            catch (ex) {
                this.olapCtrlObj._waitingPopup.hide();
            }
        },
        _pivotEngineSpanCalculation: function (curAxis, rwHeaders, colHeaders, maxLvlLen, valueCells, cCnt, rCnt, rSpanCalc, drillPos, totIndexInfo, isNamedSets, noSumSpanCalc) {
            var rLen = rwHeaders.length, summaryAxis = "",rSCnt, cLen = colHeaders.length, rILen = rLen ? rwHeaders[0].length : rLen, cILen = cLen ? colHeaders[0].length : cLen, rIndex, cIndex,
                vRLen = valueCells.length, vCLen = valueCells[0].length;
            if (curAxis == "rowheader") {
                cILen = this._indexCCell ? this._indexCCell : cILen;
                summaryAxis = "row";            }
            else {
                cILen = this._indexRCell ? this._indexRCell : cILen;
                summaryAxis = "col";
            }
            var tPosCnt = 1, measUd = 0;
            if (isNamedSets)
                rwHeaders[rCnt][cCnt].ChildCount = 0;
            if (this._measureDt.axis == curAxis && this._measureDt.posision == rILen - 1)
                measUd = 1;
            if (!rSpanCalc[cCnt])
                rSpanCalc[cCnt] = [];
            if (this._isNoSummary && !noSumSpanCalc[cCnt])
                noSumSpanCalc[cCnt] = [];
            if (!this.pivotEngine[rCnt + cILen])
                this.pivotEngine[rCnt + cILen] = [];
           
            drillPos[cCnt] = rCnt;
            var limit = maxLvlLen[cCnt] ? maxLvlLen[cCnt] : 1;
            var levPos = 0, spanLvlPos = 0;
            for (var lp = 0; lp < cCnt; lp++) {
                if (maxLvlLen[lp]) {
                    levPos += maxLvlLen[lp] - 1;
                    spanLvlPos += maxLvlLen[lp];
                }
            }
            if (!this._OlapDataSource._enableBasicEngine || this._OlapDataSource._checkSummaryHeaders)
                    for (var lLen = 1; lLen <= limit; lLen++) {
                        var preCmp = 1, rowPos = null, isBreak = false;
                        var temLvl = rwHeaders[rCnt][cCnt].LNum;
                        if (rSpanCalc[cCnt][lLen] == undefined)
                            rSpanCalc[cCnt][lLen] = 0;
                        if (this._isNoSummary && noSumSpanCalc[cCnt][lLen] == undefined)
                            noSumSpanCalc[cCnt][lLen] = 0;
                        if (rwHeaders[rCnt - 1] && rSpanCalc[cCnt][temLvl] && (rwHeaders[rCnt][cCnt].LNum != 0 && rwHeaders[rCnt - 1][cCnt].PUName == rwHeaders[rCnt][cCnt].UName || (cCnt + measUd == rILen - 1 && rwHeaders[rCnt - 1][cCnt].LNum < rwHeaders[rCnt][cCnt].LNum))) {
                            var tempSpan = rSpanCalc[cCnt][temLvl];
                            if (this._isNoSummary) {
                                tempSpan += noSumSpanCalc[cCnt][temLvl];
                                noSumSpanCalc[cCnt][temLvl] = 0;
                            }
                            this.pivotEngine[rCnt + cILen - tempSpan][cCnt + temLvl - 1 + levPos] = (rwHeaders[rCnt][cCnt]);
                            if (cCnt + measUd != rILen - 1) {
                                this.pivotEngine[rCnt + cILen][cCnt + temLvl - 1 + levPos] = $.extend({}, (rwHeaders[rCnt][cCnt]));
                                if (this._isNoSummary) 
                                    this.pivotEngine[rCnt + cILen][cCnt + temLvl - 1 + levPos].Span = "Block";
                            }
                            if (this._isNoSummary)
                                this.pivotEngine[rCnt + cILen - tempSpan][cCnt + temLvl - 1 + levPos].RowSpan = 0;
                            if (!isNamedSets)
                                this.pivotEngine[rCnt + cILen - tempSpan][cCnt + temLvl - 1 + levPos].ChildCount = -1;
                            this.pivotEngine[rCnt + cILen - tempSpan][cCnt + temLvl - 1 + levPos].ColSpan = 1;
                            this.pivotEngine[rCnt + cILen - tempSpan][cCnt + temLvl - 1 + levPos].RowSpan += rSpanCalc[cCnt][temLvl];
                            this._drilledJSONData(rCnt + cILen - tempSpan, rCnt + cILen , cCnt + temLvl - 1 + levPos, rwHeaders[rCnt][cCnt]);
                            rSpanCalc[cCnt][temLvl] = 0;                           
                            if (cCnt + measUd == rILen - 1) {
                                if (rwHeaders[rCnt - 1][cCnt].LNum > rwHeaders[rCnt][cCnt].LNum) {
                                    var colLen = maxLvlLen[cCnt] - temLvl, nextMem = this._findNextMember(rwHeaders, rCnt, cCnt);
                                    for (var mlen = 0; mlen < nextMem; mlen++) {
                                        if (!this.pivotEngine[rCnt + cILen + mlen])
                                            this.pivotEngine[rCnt + cILen + mlen] = [];
                                        this.pivotEngine[rCnt + cILen + mlen][cCnt + levPos + temLvl] = { CSS: "summary " + summaryAxis, Value: "Total", ColSpan: colLen, RowSpan: 1, HUName: "", LName: "", UName: "", LNum: "", MemberType: "", ChildCount: "",  Span: this._isNoSummary ? "Block" : "None" };
                                    }
                                    if (!this._isNoSummary)
                                        this.pivotEngine[rCnt + cILen - tempSpan][cCnt + temLvl - 1 + levPos].RowSpan += (nextMem - 1);
                                }
                            }

                        }
                        if (rwHeaders[rCnt][cCnt].LNum > lLen && !(this._isNoSummary && totIndexInfo[rCnt].type == "total")) {
                            rSpanCalc[cCnt][lLen]++;
                        }
                        else if (rwHeaders[rCnt][cCnt].LNum > lLen && this._isNoSummary && totIndexInfo[rCnt].type == "total")
                        {
                            noSumSpanCalc[cCnt][lLen]++;
                        }
                        rowPos = rCnt + cILen;
                        if (lLen == rwHeaders[rCnt][cCnt].LNum && rCnt == 0 && rwHeaders[rCnt][cCnt].LNum > 1) {
                            if (!this.pivotEngine[rowPos]) this.pivotEngine[rowPos] = [];
                            this.pivotEngine[rowPos][cCnt + lLen - 1 + levPos] = (rwHeaders[rCnt][cCnt]);
                            if (!(rwHeaders[rCnt + 1] != undefined && (rwHeaders[rCnt][cCnt].LNum < rwHeaders[rCnt + 1][cCnt].LNum)) || (cCnt + measUd == rILen - 1 &&  rwHeaders[rCnt + 1] && rwHeaders[rCnt][cCnt].LNum < rwHeaders[rCnt + 1][cCnt].LNum))
                                this.pivotEngine[rowPos][cCnt + lLen - 1 + levPos].ColSpan += maxLvlLen[cCnt] - this.pivotEngine[rowPos][cCnt + lLen - 1 + levPos].LNum;
                        }
                        else if (rCnt != 0 && rwHeaders[rCnt][cCnt].LNum > 1 && lLen == rwHeaders[rCnt][cCnt].LNum && rwHeaders[rCnt - 1][cCnt].UName != rwHeaders[rCnt][cCnt].UName
                        && rwHeaders[rCnt - 1][cCnt].PUName != rwHeaders[rCnt][cCnt].UName) {
                            if (this.pivotEngine[rowPos] == undefined)
                                this.pivotEngine[rowPos] = [];
                            this.pivotEngine[rowPos][cCnt + lLen - 1 + levPos] = (rwHeaders[rCnt][cCnt]); //drillPos++;
                            if (!(rwHeaders[rCnt + 1] != undefined && (rwHeaders[rCnt][cCnt].LNum < rwHeaders[rCnt + 1][cCnt].LNum))
                                || (cCnt + measUd == rILen - 1 &&  rwHeaders[rCnt + 1] && rwHeaders[rCnt][cCnt].LNum < rwHeaders[rCnt + 1][cCnt].LNum))
                                this.pivotEngine[rowPos][cCnt + lLen - 1 + levPos].ColSpan += maxLvlLen[cCnt] - this.pivotEngine[rowPos][cCnt + lLen - 1 + levPos].LNum;
                        }
                        else if (rCnt != 0 && lLen == rwHeaders[rCnt][cCnt].LNum && rwHeaders[rCnt - 1][cCnt].UName == rwHeaders[rCnt][cCnt].UName) {
                            if (!(this._isNoSummary && totIndexInfo[rCnt].type == "total"))
                                rSpanCalc[cCnt][lLen]++;
                            else if (this._isNoSummary && totIndexInfo[rCnt].type == "total")
                                noSumSpanCalc[cCnt][lLen]++;
                            this.pivotEngine[rCnt + cILen][cCnt + lLen - 1 + levPos] = (rwHeaders[rCnt][cCnt]);
                            if (this._isNoSummary && totIndexInfo[rCnt].type == "total")
                                this.pivotEngine[rCnt + cILen][cCnt + lLen - 1 + levPos].Span = "Block";
                            if ((rwHeaders[rCnt + 1] != undefined && rwHeaders[rCnt + 1][cCnt].UName != rwHeaders[rCnt][cCnt].UName) || (rCnt + 1 == rLen && rSpanCalc[cCnt][lLen] > 0)) {
                                var rlen = rSpanCalc[cCnt][lLen], levnum = rwHeaders[rCnt][cCnt].LNum;
                                if (this._isNoSummary) {
                                    rlen += noSumSpanCalc[cCnt][lLen];
                                    noSumSpanCalc[cCnt][lLen] = 0;
                                }
                                if (rlen && this.pivotEngine[rCnt + cILen - rlen][cCnt + levnum - 1 + levPos] != undefined && this.pivotEngine[rCnt + cILen - rlen][cCnt + levnum - 1 + levPos].Value != undefined) {
                                    this.pivotEngine[rCnt + cILen - rlen][cCnt + levnum - 1 + levPos].RowSpan += rSpanCalc[cCnt][lLen];
                                    this._drilledJSONData(rCnt + cILen - rlen, rCnt + cILen, cCnt + levnum - 1 + levPos, rwHeaders[rCnt][cCnt]);
                                }
                                //if (!(this._isNoSummary && totIndexInfo[rCnt].type == "total"))
                                rSpanCalc[cCnt][lLen] = 0;

                            }
                        }
                        else if ((rwHeaders[rCnt][cCnt].LNum < 2 && (lLen == rwHeaders[rCnt][cCnt].LNum || rwHeaders[rCnt][cCnt].LNum == 0)) ||
                        (rwHeaders[rCnt][cCnt].LNum < lLen && rwHeaders[rCnt - 1] && rwHeaders[rCnt][cCnt].LNum < rwHeaders[rCnt - 1][cCnt].LNum && totIndexInfo[rCnt].type == "total" && this._measureDt.axis == curAxis)) {

                            var tlevPos = lLen - 1;
                            if (rwHeaders[rCnt - 1] && rwHeaders[rCnt - 1][cCnt].UName == rwHeaders[rCnt][cCnt].UName && rwHeaders[rCnt][cCnt].LName.toLowerCase().indexOf("[measures]") > -1) {
                                this.pivotEngine[rCnt + cILen][cCnt + lLen - 1 + levPos] = $.extend({},(rwHeaders[rCnt][cCnt]));
                                if (!(this._measureDt.measureCount > 1 && curAxis == this._measureDt.axis) && !(this._isNoSummary && totIndexInfo[rCnt].type == "total"))
                                    rSpanCalc[cCnt][lLen]++;
                                else if (!(this._measureDt.measureCount > 1 && curAxis == this._measureDt.axis) && this._isNoSummary && totIndexInfo[rCnt].type == "total") {
                                    noSumSpanCalc[cCnt][lLen]++;
                                }
                                if (this._isNoSummary && totIndexInfo[rCnt].type == "total" )
                                    this.pivotEngine[rCnt + cILen][cCnt + lLen - 1 + levPos].Span = "Block";
                            }
                            if (!(rwHeaders[rCnt][cCnt].UName.indexOf("Measures") != -1 && this._isPaging) && totIndexInfo[rCnt].type != "total") {
                                if (!(rwHeaders[rCnt - 1] && rwHeaders[rCnt - 1][cCnt].UName == rwHeaders[rCnt][cCnt].UName)) {

                                    this.pivotEngine[rCnt + cILen][cCnt + lLen - 1 + levPos] = (rwHeaders[rCnt][cCnt]);
                                    rSCnt = rSpanCalc[cCnt][lLen];
                                    if (this._isNoSummary) {
                                        rSCnt += noSumSpanCalc[cCnt][lLen];
                                        noSumSpanCalc[cCnt][lLen] = 0;
                                    }
                                    if (rSCnt && this.pivotEngine[rCnt + cILen - rSCnt][cCnt + lLen - 1 + levPos] != undefined) {
                                        this.pivotEngine[rCnt + cILen - rSCnt][cCnt + lLen - 1 + levPos].RowSpan += rSpanCalc[cCnt][lLen];
                                        this._drilledJSONData(rCnt + cILen - rSCnt, rCnt + cILen, cCnt + lLen - 1 + levPos, rwHeaders[rCnt][cCnt]);
                                    }
                                    rSpanCalc[cCnt][lLen] = 0;
                                }
                                if (!rwHeaders[rCnt][cCnt].LNum == 0 && (!(rwHeaders[rCnt + 1] != undefined && rwHeaders[rCnt][cCnt].LNum < rwHeaders[rCnt + 1][cCnt].LNum) || ((cCnt + measUd == rILen - 1 && rwHeaders[rCnt + 1] && rwHeaders[rCnt][cCnt].LNum < rwHeaders[rCnt + 1][cCnt].LNum))) && this.pivotEngine[rCnt + cILen][cCnt + lLen - 1 + levPos])
                                    this.pivotEngine[rCnt + cILen][cCnt + lLen - 1 + levPos].ColSpan += maxLvlLen[cCnt] - this.pivotEngine[rCnt + cILen][cCnt + lLen - 1 + levPos].LNum;
                            }
                            else if (totIndexInfo[rCnt].type == "total" && rwHeaders[rCnt][cCnt].LName.toLowerCase().indexOf("[measures]") == -1 && rwHeaders[rCnt][cCnt].LNum != lLen && maxLvlLen[cCnt] != 0) {
                                if ((rwHeaders[rCnt][cCnt - 1] && rwHeaders[rCnt][cCnt - 1].LName.toLowerCase().indexOf("[measures]") == -1 || this._measureDt.axis != curAxis) && (cCnt > totIndexInfo[rCnt].totLvl || (cCnt == rILen - 1 && (lLen > totIndexInfo[rCnt].totLvl && totIndexInfo[rCnt].totLvl != 0)) || (totIndexInfo[rCnt].totLvl == 0 && lLen - 1 > totIndexInfo[rCnt].totLvl)))
                                    break;
                                var tempColSpan = 1, tmpLvl = 1, sumCnt = 0;
                                while (rwHeaders[rCnt - tmpLvl][cCnt] && rwHeaders[rCnt - tmpLvl][cCnt].LNum == 0 && !rwHeaders[rCnt][cCnt].LName.toLowerCase().indexOf("[measures]") > -1) {
                                    if (rwHeaders[rCnt][cCnt - 1] && rwHeaders[rCnt - tmpLvl + 1][cCnt - 1].UName != rwHeaders[rCnt - tmpLvl][cCnt - 1].UName) {
                                        sumCnt++;
                                    }
                                    tmpLvl++;
                                }

                                if (0) { // inside the condtion - this._measureDt.axis == curAxis
                                    var spnWtMsr = 0, initVal, endVal; isBreak = false;
                                    sumCnt = 0;
                                    if (cCnt < this._measureDt.posision) {
                                        initVal = cCnt;
                                        endVal = this._measureDt.posision;
                                    }
                                    else if (cCnt > this._measureDt.posision) {
                                        endVal = maxLvlLen.length;
                                        initVal = cCnt;
                                        isBreak = true;
                                    }
                                    for (var ml = initVal; ml < endVal; ml++)
                                        spnWtMsr += maxLvlLen[ml];
                                    if (rwHeaders[rCnt][cCnt + 1] && rwHeaders[rCnt][cCnt + 1].LName.toLowerCase().indexOf("[measures]") > -1 && maxLvlLen[cCnt] > 1) {
                                        isBreak = true;
                                        spnWtMsr -= rwHeaders[rCnt][cCnt].LNum;

                                    }
                                    tempColSpan = spnWtMsr;
                                }
                                else if (rwHeaders[rCnt][cCnt].LNum == 0 && !rwHeaders[rCnt][cCnt].LName.toLowerCase().indexOf("[measures]") > -1) { // inside the condtion - rwHeaders[rCnt][cCnt].LNum == 0

                                    var prev = 0, corColPos = 0;
                                    if (rCnt > 0 && cCnt > 0 && rwHeaders[rCnt][cCnt].LName.indexOf("(All)") > -1 && rwHeaders[rCnt][cCnt - 1] && maxLvlLen[cCnt - 1] > 1)
                                        prev = this._findPreviousMember(rwHeaders, rCnt, cCnt - 1);
                                    if (rCnt != 0 && rwHeaders[rCnt][cCnt - 1] && maxLvlLen[cCnt - 1] > 1 && rwHeaders[rCnt + prev] && rwHeaders[rCnt][cCnt - 1].LNum < rwHeaders[rCnt + prev][cCnt - 1].LNum)
                                        sumCnt = maxLvlLen[cCnt - 1] - rwHeaders[rCnt][cCnt - 1].LNum;
                                    if (curAxis == "rowheader") {
                                        tempColSpan = this._indexRCell - spanLvlPos + sumCnt;
                                        corColPos = this._indexRCell - tempColSpan;
                                    }
                                    else if (curAxis == "colheader") {
                                        tempColSpan = this._indexCCell - spanLvlPos + sumCnt;
                                        corColPos = this._indexCCell - tempColSpan;
                                    }
                                    if ((maxLvlLen.length != 1 && cCnt == rILen - 1) || (maxLvlLen.length > 1 && cCnt < rILen - 1))
                                        isBreak = true;

                                    if (this._measureDt.axis == curAxis) {
                                        tempColSpan -= 1;
                                    }
                                    var preLlen, maxLn, cspan = 1;
                                    if (rCnt != 0 && rwHeaders[rCnt][cCnt - 1])
                                        preLlen = rwHeaders[rCnt][cCnt - 1].LNum + 1;
                                    var incr = 1, prev = rCnt + cILen;
                                    this.pivotEngine[rCnt + cILen][cCnt + lLen - 1 + levPos - sumCnt] = { CSS: "summary " + summaryAxis, Value: "Total", ColSpan: tempColSpan, RowSpan: 1, HUName: "", LName: "", UName: "", LNum: "", MemberType: "", ChildCount: "", Span: this._isNoSummary ? "Block" : "None" };

                                    // Below commentted lines are used for total spanning in row

                                    //while (this.pivotEngine[rCnt + cILen - incr][cCnt + lLen - 1 + levPos] && this.pivotEngine[rCnt + cILen - incr][cCnt + lLen - 1 + levPos].CSS.indexOf("summary") > -1
                                    //&& this.pivotEngine[rCnt + cILen - incr][cCnt + lLen - 1 + levPos].ColSpan == tempColSpan)
                                    //{
                                    //    incr++;
                                    //}
                                    //if (incr > 1)
                                    //    this.pivotEngine[rCnt + cILen - incr + 1][cCnt + lLen - 1 + levPos].RowSpan = incr;
                                }
                                //this.pivotEngine[rCnt + cILen][cCnt + lLen - 1 + levPos - sumCnt] = { CSS: "summary " + summaryAxis, Value: "Total", ColSpan: tempColSpan, RowSpan: 1, HUName: "", LName: "", UName: "", LNum: "", MemberType: "", ChildCount: "" };
                            }
                            else if (rwHeaders[rCnt][cCnt].LName.toLowerCase().indexOf("[measures]") != -1) {
                                if (!(rwHeaders[rCnt - 1] && rwHeaders[rCnt - 1][cCnt].UName == rwHeaders[rCnt][cCnt].UName)) {
                                    this.pivotEngine[rCnt + cILen][cCnt + lLen - 1 + levPos] = $.extend({},rwHeaders[rCnt][cCnt]);
                                    if (this._isNoSummary && totIndexInfo[rCnt].type == "total")
                                        this.pivotEngine[rCnt + cILen][cCnt + lLen - 1 + levPos].Span = "Block";
                                }

                                if (rwHeaders[rCnt - 1] && rwHeaders[rCnt - 1][cCnt].UName != rwHeaders[rCnt][cCnt].UName || (rCnt + 1 == rLen)) {
                                    rSCnt = rSpanCalc[cCnt][lLen];
                                    if (this._isNoSummary) {
                                        rSCnt += noSumSpanCalc[cCnt][lLen];
                                        noSumSpanCalc[cCnt][lLen] = 0;
                                    }
                                    if (rSCnt && this.pivotEngine[rCnt + cILen - rSCnt][cCnt + lLen - 1 + levPos] != undefined) {
                                        this.pivotEngine[rCnt + cILen - rSCnt][cCnt + lLen - 1 + levPos].RowSpan += rSpanCalc[cCnt][lLen];
                                        this._drilledJSONData(rCnt + cILen - rSCnt, rCnt + cILen, cCnt + lLen - 1 + levPos, rwHeaders[rCnt][cCnt]);
                                    }
                                    rSpanCalc[cCnt][lLen] = 0;
                                }
                            }
                            else if(totIndexInfo[rCnt].type == "total" && rwHeaders.length == 1)
                            {
                                this.pivotEngine[rCnt + cILen][cCnt + lLen - 1 + levPos] = { CSS: "summary " + summaryAxis, Value: "Total", ColSpan: 1, RowSpan: 1, HUName: "", LName: "", UName: "", LNum: "", MemberType: "", ChildCount: "", Span: this._isNoSummary ? "Block" : "None" };
                            }
                        }

                       
                        if (isBreak)
                            break;
                    }
                else 
                    this.pivotEngine[rCnt + cILen][cCnt] = rwHeaders[rCnt][cCnt];
        },
        _findNextMember: function (rHeader, row, col)
        {
            var inc = 0, isParent = false;
            while (rHeader[row + inc] && rHeader[row][col].UName == rHeader[row + inc][col].UName)
            {
                inc++;
            }
            return inc;
        },
        _findPreviousMember: function (rHeader, row, col) {
            var inc = -1, isParent = false;
            while (rHeader[row + inc] && rHeader[row][col].UName == rHeader[row + inc][col].UName) {
                inc--;
            }
            return inc;
        },
        _drilledJSONData: function (start, end, col, data) {
            for (var st = start + 1; st < end; st++) {
                
                this.pivotEngine[st][col] = $.extend({},data);
                if (this._isNoSummary)
                    this.pivotEngine[st][col].Span = "Block";
            }
        },
        _setClassName: function (valueCell) {
            var val = parseInt(valueCell.Value), cssVal = "value";
            if (valueCell.kpi)
                if (valueCell.kpi == "trend") {
                    switch(val)
                    {
                        case -1:
                            cssVal = "value kpiiconvalue kpidownarrow";
                            break;
                        case 0:
                            cssVal = "value kpiiconvalue kpirightarrow";
                            break;
                        case 1:
                            cssVal = "value kpiiconvalue kpiuparrow";
                            break;
                    }
           
                }
                
                else if (valueCell.kpi == "status") {
                    switch (val) {
                        case -1:
                            cssVal = "value kpiiconvalue kpidiamond";
                            break;
                        case 0:
                            cssVal = "value kpiiconvalue kpitriangle";
                            break;
                        case 1:
                            cssVal = "value kpiiconvalue kpicircle";
                            break;
                    }
                }
            
            return valueCell.summary+" " + cssVal;
        },
        _getFieldItemsInfo: function (controlObj) {
            var conStr = this._getConnectionInfo(controlObj.model.dataSource.data);
             var pData = "<Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\"><Header/><Body><Discover xmlns=\"urn:schemas-microsoft-com:xml-analysis\"><RequestType>MDSCHEMA_HIERARCHIES</RequestType><Restrictions><RestrictionList><CATALOG_NAME>" + controlObj.model.dataSource.catalog + "</CATALOG_NAME><CUBE_NAME>" + controlObj.model.dataSource.cube + "</CUBE_NAME></RestrictionList></Restrictions><Properties><PropertyList><Catalog>" + controlObj.model.dataSource.catalog + "</Catalog> <LocaleIdentifier>" + conStr.LCID + "</LocaleIdentifier></PropertyList></Properties></Discover></Body></Envelope>";
             controlObj.doAjaxPost("POST", conStr.url, { XMLA: pData }, this._getHierarchyInfo, null, { pvtGridObj: controlObj, action: "loadFieldElements" });
        },
        _getHierarchyInfo: function (customArgs, args) {
            var hierarchyElements = [];
            var controlObj = customArgs.pvtGridObj, conStr = this._getConnectionInfo(controlObj.model.dataSource.data);
            for (var i = 0; i < $(args).find("row").length; i++) {
                var element = $($(args).find("row")[i]);
                hierarchyElements.push({ pid: element.find("DIMENSION_UNIQUE_NAME").text(), id: element.find("HIERARCHY_UNIQUE_NAME").text(), name: element.find("HIERARCHY_CAPTION").text(), tag: element.find("HIERARCHY_UNIQUE_NAME").text(), hasAllMember: (element.children("ALL_MEMBER").length == 0) ? true : false });
            }

            controlObj["_fieldData"] = { hierarchy: hierarchyElements, hierarchySuccess: (args), measures: [] };
            if (!(conStr.LCID.indexOf("1033") >= 0) || controlObj.model.enableDrillThrough) {
                var pData = "<Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\"><Header/><Body><Discover xmlns=\"urn:schemas-microsoft-com:xml-analysis\"><RequestType>MDSCHEMA_MEASURES</RequestType><Restrictions><RestrictionList><CATALOG_NAME>" + controlObj.model.dataSource.catalog + "</CATALOG_NAME><CUBE_NAME>" + controlObj.model.dataSource.cube + "</CUBE_NAME></RestrictionList></Restrictions><Properties><PropertyList><Catalog>" + controlObj.model.dataSource.catalog + "</Catalog> <LocaleIdentifier>" + conStr.LCID + "</LocaleIdentifier> </PropertyList></Properties></Discover></Body></Envelope>";
                controlObj.doAjaxPost("POST", conStr.url, { XMLA: pData }, this._getMeasureInfo, null, { pvtGridObj: controlObj, action: "loadFieldElements" });
            }
        },
        _getMeasureInfo: function (customArgs, e) {
            var measureData = [];
            for (var i = 0; i < $(e).find("row").length; i++) {
                var element = $($(e).find("row")[i]), measureGRPName = element.children("MEASUREGROUP_NAME").text(), measureUQName = element.find("MEASURE_UNIQUE_NAME").text();
                measureData.push({ id: measureUQName, pid: measureGRPName, name: element.children("MEASURE_CAPTION").text(), tag: measureUQName });
            }
            customArgs.pvtGridObj._fieldData["measures"] = measureData;
            customArgs.pvtGridObj._fieldData["measureSuccess"] = e;
        },
        _getConnectionInfo: function (connectionString) {
            var connectionInfo = { url: "", LCID: "1033" };
            if (connectionString != "")
            {
                $.map(connectionString.split(";"), function (obj, index) {
                    if (obj.toLowerCase().indexOf("locale") < 0 && connectionInfo.url.length==0) {
                        connectionInfo.url = obj;
                    }
                    else if (obj.toLowerCase().indexOf("locale") >= 0) {
                        connectionInfo.LCID = obj.replace(/ /g, "").split("=")[1];//obj.split(";")[0]
                    }
                });
            }
            return connectionInfo;
        },

        _applyTrim: function (controlObj) {
            var fieldInfo = [], dataSource = controlObj.model.dataSource, me = this;
            if (controlObj["_fieldData"] && controlObj._fieldData.measures && controlObj._fieldData.hierarchy) {
                $.merge(fieldInfo, controlObj._fieldData.hierarchy);
                $.merge(fieldInfo, controlObj._fieldData.measures);
            }
            else
                controlObj["_fieldData"] && controlObj._fieldData.hierarchy ? controlObj._fieldData.hierarchy : [];

            dataSource.rows = $.map(dataSource.rows, function (obj, index) {
                if (!ej.isNullOrUndefined(obj) && obj.fieldName != undefined) {
                    obj.fieldName = $.trim(obj.fieldName);
                    return me._getCaption(obj, fieldInfo);
                }
            });
            dataSource.columns = $.map(dataSource.columns, function (obj, index) {
                if (!ej.isNullOrUndefined(obj) && obj.fieldName != undefined) {
                    obj.fieldName = $.trim(obj.fieldName);
                    return me._getCaption(obj, fieldInfo); 
                }
            });
            dataSource.filters = $.map(dataSource.filters, function (obj, index) {
                if (!ej.isNullOrUndefined(obj) && obj.fieldName != undefined) {
                    obj.fieldName = $.trim(obj.fieldName);
                   return me._getCaption(obj, fieldInfo);
                }
            });
            dataSource.values = dataSource.values.length > 0 && dataSource.values[0]["measures"] != undefined ? dataSource.values : [{ measures: [], axis: "columns" }];
            dataSource.values[0]["measures"] = $.map(dataSource.values[0]["measures"], function (obj, index) {
                if (!ej.isNullOrUndefined(obj) && obj.fieldName != undefined) {
                    obj.fieldName = $.trim(obj.fieldName);
                    return me._getCaption(obj, fieldInfo);
                }
            });

            controlObj.model.dataSource = dataSource;
        },

        _getCaption: function (fieldItem, fieldInfo) {
            var fieldName = fieldItem.fieldName, captionInfo=[];
            if (fieldInfo.length > 0) {
                captionInfo = $.map(fieldInfo, function (obj, index) { if (obj.tag != undefined && obj.tag.toLowerCase() == $.trim(fieldName.toLowerCase())) { return obj; } });
                if (fieldName.toLowerCase().indexOf("[measures]") >= 0 && captionInfo.length == 0 && fieldName.split(".[").length > 0)
                    fieldItem["fieldCaption"] = fieldName.split(".[")[1].replace(/]/g, "");
                else if (captionInfo.length > 0) {
                    fieldItem["hasAllMember"] = captionInfo[0]["hasAllMember"] ? true : false;
                    fieldItem["fieldCaption"] = captionInfo[0].name;
                }
            }
            else if (captionInfo.length==0)
                fieldItem["fieldCaption"] = fieldName;
            return fieldItem;
        },
        clearDrilledItems: function (dataSource, args,ctrlObj) {
            var action = args.action;
            dataSource.rows = $.grep(dataSource.rows, function (value) {
                (value.filterItems != undefined && action != "filtering") ? delete value.filterItems : value;
                (value.filterItems != undefined && action != "advancedFilter") ? delete value.advancedFilter : value;
                (value.drilledItems != undefined) ? delete value.drilledItems : value;
                (value._prevDimElements != undefined) ? delete value._prevDimElements : value; return value;
            });
            dataSource.columns = $.grep(dataSource.columns, function (value) {
                (value.filterItems != undefined && action != "filtering") ? delete value.filterItems : value;
                (value.filterItems != undefined && action != "advancedFilter") ? delete value.advancedFilter : value;
                (value.drilledItems != undefined) ? delete value.drilledItems : value;
                (value._prevDimElements != undefined) ? delete value._prevDimElements : value; return value;
            });
            dataSource.filters = $.grep(dataSource.filters, function (value) {
                (value.filterItems != undefined && action != "filtering") ? delete value.filterItems : value;
                (value.filterItems != undefined && action != "advancedFilter") ? delete value.advancedFilter : value;
                (value.drilledItems != undefined) ? delete value.drilledItems : value;
                (value._prevDimElements != undefined) ? delete value._prevDimElements : value; return value;
            });
            if (action != "filtering") {
                ctrlObj._currentReportItems = $.map(ctrlObj._currentReportItems, function (obj, index)
                {
                    if (!(ej.isNullOrUndefined(obj.dataSrc))) {
                        if ((obj.dataSrc.cube == dataSource.cube)) {
                            if (!(obj.dataSrc.reportName == dataSource.reportName))
                                return obj;
                        }
                        else
                            return obj;
                    }
                });
                if (!ej.isNullOrUndefined(ctrlObj._schemaData))
                    ctrlObj._schemaData.element.find(".filter").remove();
                ctrlObj._savedReportItems = $.extend(true, [], ctrlObj._currentReportItems);
            }
           ej.olap.base._clearDrilledCellSet();
            return dataSource;
        },
       
    },
    ej.olap._mdxParser =
        {
            _getRowMDX: function (olapReport) {

                var rowElements = $(olapReport)[0].rows, rowQuery = "", measureQuery = "", updateQuery = [], isSorted = false, isDrilled = false, isCollapse = olapReport["_isCollapse"];
                var isMeasureAxis = olapReport["values"].length > 0 && olapReport["values"][0]["measures"] != undefined && olapReport["values"][0]["axis"] == ej.olap.AxisName.Row;
                if (ej.isNullOrUndefined(olapReport.providerName) || olapReport.providerName == ej.olap.Providers.SSAS) {
                    if (rowElements.length > 0) {
                        isDrilled = ej.isNullOrUndefined(rowElements[0].drillCellInfo) ? false : true;
                        for (var i = 0; i < rowElements.length; i++) {

                            var isNamedSet = (ej.isNullOrUndefined(rowElements[i]["isNamedSets"]) || !rowElements[i]["isNamedSets"]) ? false : true, dimensionQuery = "", p_dimensionQuery = "";

                            if (rowElements[i].fieldName != undefined && !isNamedSet) {

                                dimensionQuery = this._getDimensionQuery(rowElements[i], olapReport, "rows", i, false);
                                updateQuery.push(dimensionQuery.replace(/["'\(\)]/g, "").replace(/["'\{\}]/g, "").replace(/\levels0/g, "levels(0)"));

                                if (ej.olap.base._isPaging && isDrilled) {
                                    p_dimensionQuery = this._getDimensionQuery(rowElements[i], olapReport, "rows", i, true);
                                }

                                if (rowElements[i]["sortOrder"] && rowElements[i]["sortOrder"] != ej.olap.SortOrder.None) {
                                    var sortOrder = rowElements[i]["sortOrder"] == ej.olap.SortOrder.Ascending ? "asc" : "desc"; isSorted = true;
                                    rowQuery = rowQuery + (i > 0 ? "*" : "") + "{ORDER({HIERARCHIZE({" + ((ej.olap.base._isPaging && isDrilled) ? p_dimensionQuery : dimensionQuery) + "})}," + rowElements[i].fieldName + ".CurrentMember.MEMBER_CAPTION," + sortOrder + ")}";
                                }
                                else
                                    rowQuery = rowQuery + (i > 0 ? "*" : "") + "{HIERARCHIZE({({" + ((ej.olap.base._isPaging && isDrilled) ? p_dimensionQuery : dimensionQuery) + "})})}";
                            }
                            else if (isNamedSet) {
                                rowQuery = i > 0 ? rowQuery + "*" + "{" + rowElements[i].fieldName + "}" : "{" + rowElements[i].fieldName + "}";
                            }
                        }

                        if (ej.olap.base._isPaging) {
                            this._updateOlapReport($(olapReport)[0].rows, rowQuery, "rows", updateQuery)
                        }
                        if (isCollapse)
                            isSorted = isCollapse;
                        rowQuery = (!isSorted ? " HIERARCHIZE " : " ") + "( {" + (ej.olap.base._isPaging ? rowQuery : this._updateOlapReport($(olapReport)[0].rows, rowQuery, "rows", updateQuery)) + "})";
                        if (isCollapse)
                            rowQuery = "HIERARCHIZE(" + rowQuery + ")";
                    }
                    if (isMeasureAxis) {
                        measureQuery = ej.olap._mdxParser._getMeasuresQuery(olapReport);
                        rowQuery = rowQuery != "" ? (ej.olap.base._isPaging ? rowQuery.slice(0, -1) : rowQuery) + ((rowQuery != "" && measureQuery != "") ? (ej.olap.base._isPaging ? "*" : ",") : "") + measureQuery : (ej.olap.base._isPaging ? (measureQuery != "" ? "(" : "") : "") + measureQuery;
                    }
                    if (ej.olap.base._isPaging) {
                        rowQuery = rowQuery != "" ? (measureQuery == "" ? (rowQuery[rowQuery.length - 1] != "}" ? rowQuery.slice(0, -1) : rowQuery) + this._getDrilledSection(olapReport, $.extend(true, {}, rowElements), "row", measureQuery) + ")" : rowQuery + this._getDrilledSection(olapReport, $.extend(true, {}, rowElements), "row", measureQuery) + ")") : "";
                    }
                }
                else
                {
                    rowQuery = this._generateAxisMDXOnMondrian(olapReport, rowElements, isMeasureAxis);
                }
                return rowQuery;
            },
            _generateAxisMDXOnMondrian: function (olapReport, rowElements, isMeasureAxis)
            {
                var axisQuery = "", decendants, fElements;
                for (var i = 0; i < rowElements.length; i++) {
                    var reportEl = (ej.olap.base._isPaging) ? "({" + rowElements[i].fieldName + ".children})" : "DrillDownLevel({" + rowElements[i].fieldName + "})";
                    if (!ej.isNullOrUndefined(rowElements[i].drilledItems) && rowElements[i].drilledItems.length > 0) {
                        reportEl = this._getDrilledMDXOnMondrian(rowElements[i].drilledItems, reportEl);
                    }
                    if (!ej.isNullOrUndefined(rowElements[i].filterItems) && !ej.isNullOrUndefined(rowElements[i].filterItems.values) && rowElements[i].filterItems.values.length > 0)
						{
                            decendants = "Descendants(" + rowElements[i].fieldName + "," + olapReport._maxLevel + ", SELF_AND_BEFORE)";
                            fElements = "{" + rowElements[i].filterItems.values.join() + "}";
                            reportEl = "({{hierarchize(Union(Intersect((Except(" + decendants + "," + fElements + "))," + reportEl + ")," + "Except(" + reportEl + "," + fElements + ")))}})"
                        }
                    axisQuery += (axisQuery == "" ? "" : "*") + reportEl;
                   
                }
                if (isMeasureAxis) {
                    axisQuery += (axisQuery == "" ? "" : "*") + ej.olap._mdxParser._getMeasuresQuery(olapReport);
                }
                return axisQuery;
            },
            _getDrilledMDXOnMondrian: function (dItems, drillQuery) {
               // var dItems = rowElements.drilledItems;
                for (var ln = 0; ln < dItems.length; ln++) {
                    if (!ej.olap.base._isPaging)
                        drillQuery = "(DrillDownMember(" + drillQuery + ", {" + dItems[ln].join() + "}))";
                    else
                        drillQuery = "Except(DrillDownMember(" + drillQuery + ", {" + dItems[ln].join() + "}),{" + dItems[ln].join() + "})";
                    }
                //}
                return drillQuery;
            },
            _getcolumnMDX: function (olapReport) {

                var colElements = $(olapReport)[0].columns, columnQuery = "", measureQuery = "", updateQuery = [], isSorted = false, isDrilled = false,  isCollapse = olapReport["_isCollapse"];
                var isMeasureAxis = olapReport["values"].length > 0 && olapReport["values"][0]["measures"] != undefined && olapReport["values"][0]["axis"] == ej.olap.AxisName.Column;
                if (ej.isNullOrUndefined(olapReport.providerName) || olapReport.providerName == ej.olap.Providers.SSAS) {

                    if (colElements.length > 0) {
                        isDrilled = ej.isNullOrUndefined(colElements[0].drillCellInfo) ? false : true;
                        for (var i = 0; i < colElements.length; i++) {
                            var isNamedSet = (ej.isNullOrUndefined(colElements[i]["isNamedSets"]) || !colElements[i]["isNamedSets"]) ? true : false, isSorted = false, dimensionQuery = "", p_dimensionQuery = "";

                            if (colElements[i].fieldName != undefined && isNamedSet) {

                                dimensionQuery = this._getDimensionQuery(colElements[i], olapReport, "columns", i, false);
                                updateQuery.push(dimensionQuery.replace(/["'\(\)]/g, "").replace(/["'\{\}]/g, ""));

                                if (ej.olap.base._isPaging && isDrilled) {
                                    p_dimensionQuery = this._getDimensionQuery(colElements[i], olapReport, "columns", i, true);
                                }

                                if (colElements[i]["sortOrder"] && colElements[i]["sortOrder"] != ej.olap.SortOrder.None) {
                                    var sortOrder = colElements[i]["sortOrder"] == ej.olap.SortOrder.Ascending ? "asc" : "desc", isSorted = true;;
                                    columnQuery = columnQuery + (i > 0 ? "*" : "") + "{ ORDER ({HIERARCHIZE ({" + ((ej.olap.base._isPaging && isDrilled) ? p_dimensionQuery : dimensionQuery) + "})}," + colElements[i].fieldName + ".CurrentMember.MEMBER_CAPTION," + sortOrder + ")}";
                                }
                                else
                                    columnQuery = columnQuery + (i > 0 ? "*" : "") + "{" + ((ej.olap.base._isPaging && isDrilled) ? p_dimensionQuery : dimensionQuery) + "}";
                            }
                            else
                                columnQuery = i > 0 ? columnQuery + "*" + "{" + colElements[i].fieldName + "}" : "{" + colElements[i].fieldName + "}";
                        }
                        if (ej.olap.base._isPaging && isDrilled) {
                            this._updateOlapReport($(olapReport)[0].columns, columnQuery, "columns", updateQuery)
                        }
                        if (isCollapse)
                            isSorted = isCollapse;
                        columnQuery = (!isSorted ? " HIERARCHIZE " : " ") + "( {" + (ej.olap.base._isPaging ? columnQuery : this._updateOlapReport(colElements, columnQuery, "columns", updateQuery)) + "})";
                        if (isCollapse)
                            columnQuery = "HIERARCHIZE(" + columnQuery + ")";
                    }

                    if (isMeasureAxis) {
                        measureQuery = ej.olap._mdxParser._getMeasuresQuery(olapReport);
                        columnQuery = columnQuery != "" ? ((ej.olap.base._isPaging ? columnQuery.slice(0, -1) : columnQuery) + ((columnQuery != "" && measureQuery != "") ? (ej.olap.base._isPaging ? "*" : ",") : "") + measureQuery) : (ej.olap.base._isPaging ? (measureQuery != "" ? "(" : "") : "") + measureQuery;
                    }
                    if (ej.olap.base._isPaging) {
                        columnQuery = columnQuery != "" ? (measureQuery == "" ? (columnQuery[columnQuery.length - 1] != "}" ? columnQuery.slice(0, -1) : columnQuery) + this._getDrilledSection(olapReport, $.extend(true, {}, colElements), "column", measureQuery) + ")" : columnQuery + this._getDrilledSection(olapReport, $.extend(true, {}, colElements), "column", measureQuery) + ")") : "";
                    }
                }
                else
                {
                    columnQuery = this._generateAxisMDXOnMondrian(olapReport, colElements, isMeasureAxis);
                }
                return columnQuery;
            },

            _getDrilledSection: function (olapReport, reportElements, axis, measureQuery) {
                var query = "", reportElements = reportElements;
                $.each(reportElements, function (index, val) {
                    if (!ej.isNullOrUndefined(val.drilledItems)) {
                        $.each(val.drilledItems, function (dindex, dval) {
                            var aQuery = "", sQuery = "";
                            $.each(dval, function (curIndex, curValue) {
                                aQuery = aQuery == "" ? ("{" + curValue + "}") : (aQuery + "*" + "{" + curValue + "}");
                                curValue = curIndex == index ? curValue.replace(".children", "") : curValue;
                                sQuery = sQuery == "" ? ("{" + curValue + "}") : (sQuery + "*" + "{" + curValue + "}");
                            })
                            if (measureQuery != "") {
                                aQuery = aQuery + "*" + measureQuery;
                                sQuery = sQuery + "*" + measureQuery;
                            }
                            query = query == "" ? "+{" + aQuery + "}" + "-{" + sQuery + "}" : query + "+{" + aQuery + "}" + "-{" + sQuery + "}";
                        })
                    }
                })
                return query;
            },

            _getSortedMembers: function (obj, reportInfo) {
                var fieldName = obj.fieldName, sortElement = [];
                if (obj["sortOrder"] && obj["sortOrder"] != ej.olap.SortOrder.None) {
                    var order = obj["sortOrder"] == "ascending" ? "asc" : "desc";
                    sortElement = $.map(obj["drilledItems"], function (items, i) {
                        var sortData = $.map(items, function (element, i) {
                            if (element.indexOf(fieldName) >= 0)
                                element = "order ( " + element + " , " + fieldName + ".CurrentMember.MEMBER_CAPTION," + order + ")"
                            return element;
                        });
                        return sortData;
                    });
                    return sortElement;
                }
                else
                    return obj["drilledItems"];
            },

            _getAvailCount: function (itm, prevElements, drillExtension) {
                var availCnt = 0;
                $.each(itm.split("--"), function (i, v) {
                    v = v.replace(drillExtension[i], "");
                    if (prevElements.split("--").length > 0 && !ej.isNullOrUndefined(prevElements.split("--")[i]))
                        availCnt += (v.indexOf(prevElements.split("--")[i]) > -1 || prevElements.split("--")[i].indexOf(v) > -1) ? 1 : 0;
                });
                return availCnt;
            },

            _updateTmpItems: function (tmpItems, item, itm, drillExtension) {
                var modified = $.map(item.split("--"), function (v, i) {
                    if (!ej.isNullOrUndefined(itm.split("--")[i]) && v.replace(drillExtension[i], "") == itm.split("--")[i].replace(drillExtension[i], "") && v.indexOf(drillExtension[i]) == -1)
                        return itm.split("--")[i];
                    else
                        return v;
                }).join("--");
                if (tmpItems.indexOf(modified) == -1) tmpItems.push(modified);
            },

            _updateExpandCollection: function (tmpItems, expandCollection, drillExtension) {
                $.each(expandCollection, function (index, item) {
                    $.each(expandCollection, function (idx, itm) {
                        if (item != itm) {
                            var matchCnt = 0;
                            $.each(itm.split("--"), function (i, v) {
                                v = v.replace(drillExtension[i], "");
                                if (!ej.isNullOrUndefined(item.split("--")[i]))
                                    matchCnt += (itm.split(drillExtension[i]).join("").indexOf(item.split("--")[i].replace(drillExtension[i], "")) > -1 || item.split("--")[i].replace(drillExtension[i], "").indexOf(v) > -1) ? 1 : 0;
                            });
                            if (matchCnt == itm.split("--").length)
                                ej.olap._mdxParser._updateTmpItems(tmpItems, item, itm, drillExtension);
                            if (matchCnt == item.split("--").length)
                                ej.olap._mdxParser._updateTmpItems(tmpItems, itm, item, drillExtension);
                            var tmpArray = [], cnt = 0;
                            $.each(itm.split("--"), function (i, v) {
                                var p = item.split("--").length > i ? item.split("--")[i] : "";
                                if (!ej.isNullOrUndefined(p) && p != "") {
                                    if (v != p && v.indexOf("$") > -1 && (v.indexOf(p) > -1 || p.indexOf(v) > -1) && item.split("--").length - 1 > i) {
                                        tmpArray.push(v);
                                        cnt++;
                                    }
                                    else
                                        tmpArray.push(p);
                                }
                            })
                            if (cnt > 0)
                                tmpItems.push(tmpArray.concat($.map(item.split("--"), function (v, i) { if (i >= tmpArray.length) return v })).join("--"));
                        }
                    });
                });
                return tmpItems;
            },

            _updateDrillQuery: function (reportInfo, dimensionSet, axis, updateQuery) {
                var isDrillAction = ej.olap.base._isRowDrilled || ej.olap.base._isColDrilled;
                var prevElements = $.map(reportInfo, function (item, index) {
                    var members = ($.map(ej.olap.base.olapCtrlObj._prevDrillElements, function (itm, idx) {
                        if (itm.indexOf(item.fieldName) > -1) return itm;
                    })).join("$");
                    if (members != "")
                        return members;
                }).join("--");
                var members = $.map(updateQuery, function (obj, index) {
                    if (obj.indexOf("DrillDownlevel") >= 0) obj = obj.replace("DrillDownlevel", "DrillDownlevel(") + ")";
                    return obj;
                });
                var drillExtension = $.map(reportInfo, function (item, index) { return (!ej.isNullOrUndefined(item.hasAllMember) && item.hasAllMember) ? ".levels(0).AllMembers" : ".children" });
                if (!isDrillAction && prevElements != "")
                    if (!ej.isNullOrUndefined(reportInfo[prevElements.split("--").length - 1]._prevDimElements) && reportInfo[prevElements.split("--").length - 1]._prevDimElements.indexOf(prevElements + drillExtension[prevElements.split("--").length - 1]) == -1)
                        reportInfo[prevElements.split("--").length - 1]._prevDimElements.push(prevElements + drillExtension[prevElements.split("--").length - 1] + "!#collapse")
                    else
                        reportInfo[prevElements.split("--").length - 1]._prevDimElements = reportInfo[prevElements.split("--").length - 1]._prevDimElements.filter(function (item, index) {
                            if (ej.olap._mdxParser._getAvailCount(item, prevElements, drillExtension) != prevElements.split("--").length) return item;
                        });
                reportInfo = $.map(reportInfo, function (item, index) {
                    if (ej.isNullOrUndefined(item._prevDimElements))
                        return item;
                    else {
                        item._prevDimElements = $.map(item._prevDimElements, function (itm, idx) {
                            var availCnt = 0, isCollapsed = itm.indexOf("!#collapse") == -1 ? false : true;                            
                            if (isDrillAction) {
                                if (itm.indexOf("!#collapse") > -1) {
                                    itm = itm.replace("!#collapse", "");
                                    if (ej.olap._mdxParser._getAvailCount(itm, prevElements, drillExtension) != prevElements.split("--").length)
                                        return itm;
                                }
                                else
                                    return itm;
                            }
                            else if (prevElements != "") {
                                itm = itm.replace("!#collapse", "");
                                if (ej.olap._mdxParser._getAvailCount(itm, prevElements, drillExtension) == prevElements.split("--").length)
                                    return $.map(itm.split("--"), function (v, i) {
                                        return (i == prevElements.split("--").length - 1 && v.indexOf(drillExtension[i]) == -1) ? (prevElements.split("--")[prevElements.split("--").length - 1] + (isCollapsed ? "" : "")) : v;
                                    }).join("--") + (isCollapsed ? "!#collapse" : "");
                                else
                                    return itm + (isCollapsed ? "!#collapse" : "");
                            }
                            else
                                return itm;
                        });
                        if (prevElements != "")
                            item._prevDimElements = $.map(item._prevDimElements, function (itm, idx) {
                                if (!(itm.indexOf("!#collapse") > -1 && item._prevDimElements.filter(function (v) { if (v.indexOf("!#collapse") == -1) return v; }).indexOf(itm.replace("!#collapse", "")) > -1) && !(itm.indexOf("!#collapse") == -1 && item._prevDimElements.map(function (v) { if (v.indexOf("!#collapse") > -1) return v.replace("!#collapse", ""); }).indexOf(itm) > -1))
                                    return itm;
                            });
                    }
                    return item;
                });

                var expandCollection = $.map(reportInfo, function (item, index) { if (!ej.isNullOrUndefined(item._prevDimElements)) return item._prevDimElements }).filter(function (itm) { if (itm.indexOf("!#collapse") == -1) return itm; });
                var collapseCollection = $.map(reportInfo, function (item, index) { if (!ej.isNullOrUndefined(item._prevDimElements)) return item._prevDimElements }).filter(function (itm) { if (itm.indexOf("!#collapse") > -1) return itm; }).map(function (v) { return v.replace("!#collapse", "") });
                var curDrillLen = prevElements.length == 0 ? reportInfo.length : prevElements.split("--").length, tmpColl = [];

                if (isDrillAction) {
                    expandCollection = $.map(expandCollection, function (item, index) {
                        if (ej.olap._mdxParser._getAvailCount(item, prevElements, drillExtension) == prevElements.split("--").length)
                            return item;
                    });
                }
                var tmpItems = ej.olap._mdxParser._updateExpandCollection([], expandCollection, drillExtension);
                var tmpBuffer = ej.olap._mdxParser._updateExpandCollection([], tmpItems, drillExtension);
                expandCollection = expandCollection.concat(tmpItems.concat(tmpBuffer));           

                tmpItems = [];
                $.each(expandCollection, function (index, item) {
                    $.each(collapseCollection, function (idx, itm) {
                        var tmpArray = [], cnt = 0;
                        if (item.split("--").length > itm.split("--").length) {
                            $.each(itm.split("--"), function (i, v) {
                                var p = item.split("--")[i];
                                if ((v.replace(drillExtension[i], "").indexOf(p.replace(drillExtension[i], "")) > -1 || p.replace(drillExtension[i], "").indexOf(v.replace(drillExtension[i], "")) > -1)) {
                                    tmpArray.push(v);
                                    cnt++;
                                }
                            })
                            if (itm.split("--").length == cnt && cnt < item.split("--").length && tmpItems.indexOf(tmpArray.concat($.map(item.split("--"), function (v, i) { if (i >= tmpArray.length) return v })).join("--")) == -1 && collapseCollection.indexOf(tmpArray.concat($.map(item.split("--"), function (v, i) { if (i >= tmpArray.length) return v })).join("--")) == -1)
                                tmpItems.push(tmpArray.concat($.map(item.split("--"), function (v, i) { if (i >= tmpArray.length) return v })).join("--"));
                        }
                    });;
                });
                collapseCollection = collapseCollection.concat(tmpItems);

                expandCollection = $.map(expandCollection, function (item, index) {
                    var len = !isDrillAction ? item.split("--").length : curDrillLen;
                    return $.map(item.split("--"), function (itm, idx) {
                        if (idx < len - 1)
                            return (!ej.isNullOrUndefined(prevElements.split("--")[idx]) && ((prevElements.split("--")[idx].indexOf(itm.replace(drillExtension[idx], "") > -1) || itm.replace(drillExtension[idx], "").indexOf(prevElements.split("--")[idx]) > -1)) && isDrillAction) ? members[idx].split("&amp;").join("&") : itm.split("$")[itm.split("$").length - 1];
                        else if (idx == len - 1)
                            return isDrillAction ? members[idx].split("&amp;").join("&") : (itm.replace(drillExtension[idx], "").split("$")[itm.split("$").length - 1] + drillExtension[idx]);
                        else
                            return itm.split("$")[itm.split("$").length - 1];
                    }).join("--");
                }).sort(function (a, b) { return a.split("--").length - b.split("--").length; });
                expandCollection = $.map(expandCollection, function (item, index) {
                    var coll = [];
                    if (item.split("--").length < members.length)
                        coll = [item.split("&").join("&amp;").split("--").concat($.map(members, function (itm, idx) {
                            if (item.split("--").length - 1 < idx) return itm;
                        }))];
                    else
                        coll = [item.split("&").join("&amp;").split("--")];
                    if (coll.join() != members.join()) return coll;
                });
                collapseCollection = $.map(collapseCollection, function (item, index) {
                    var coll = [];
                    if (item.split("--").length < members.length)
                        coll = [item.split("&").join("&amp;").split("--").map(function (v) {
                            return v.split("$")[v.split("$").length - 1]
                        }).concat($.map(members, function (itm, idx) {
                            if (item.split("--").length - 1 < idx) return itm;
                        }))];
                    else
                        coll = [item.split("&").join("&amp;").split("--").map(function (v) { return v.split("$")[v.split("$").length - 1] })]; return coll;
                });
                var tmpColl = [];
                $.each($.map(expandCollection, function (itm, idx) { return itm.join("--"); }), function (index, item) { if (tmpColl.length == 0 || tmpColl.indexOf(item) == -1) tmpColl.push(item); });
                expandCollection = $.map(tmpColl, function (item, index) { return [item.split("--")]; });
                var drillCollection = { expandCollection: expandCollection, collapseCollection: collapseCollection };
                if (expandCollection.length > 0 && reportInfo.length > 1 && updateQuery[updateQuery.length - 1].indexOf(".children") < 0)
                    dimensionSet = this._getDrillQuery(drillCollection, dimensionSet, reportInfo);                
                return dimensionSet;
            },

            _updateOlapReport: function (reportInfo, dimensionSet, axis, updateQuery) {
                var me = this;                
                if (axis == "rows") {
                    var drillRowInfo = $.map(reportInfo, function (obj, index) {
                        if (reportInfo[index]["drilledItems"] != undefined) {
                            return me._getSortedMembers(obj, reportInfo);
                        }
                    });
                    var prevDimElements = reportInfo.length > 1 ? $.map(reportInfo, function (item, index) { if (!ej.isNullOrUndefined(item._prevDimElements)) return item._prevDimElements }) : [];
                    if (ej.olap.base._isRowDrilled && "rows" == ej.olap.base._currIndex["axis"] && reportInfo[ej.olap.base._currIndex.Index] != undefined && reportInfo[ej.olap.base._currIndex.Index]["drilledItems"] != undefined) {
                        var members = $.map(updateQuery, function (obj, index) { if (obj.indexOf("DrillDownlevel") >= 0) obj = obj.replace("DrillDownlevel", "DrillDownlevel(") + ")"; return obj; });
                        reportInfo[ej.olap.base._currIndex.Index]["drilledItems"].push(members);
                        dimensionSet = reportInfo.length > 1 ? me._updateDrillQuery(reportInfo, dimensionSet, axis, updateQuery) : dimensionSet;
                        ej.olap.base._isRowDrilled = false;
                    }
                    else if (!ej.olap.base._isRowDrilled && prevDimElements.length > 0)                        
                        dimensionSet = reportInfo.length > 1 ? me._updateDrillQuery(reportInfo, dimensionSet, axis, updateQuery) : dimensionSet;                    
                    else if (drillRowInfo.length > 0 && (ej.olap.base._currIndex["axis"] == undefined || (ej.olap.base._currIndex["axis"] == "columns" && !ej.olap.base._isRowDrilled)))
                        dimensionSet = this._getDrillQuery(drillRowInfo, dimensionSet, reportInfo);

                    if (!ej.isNullOrUndefined(ej.olap.base._currIndex["axis"]) && ej.olap.base._currIndex["axis"] == "rows")
                        ej.olap.base._currIndex = {};
                }
                else {
                    var drillColInfo = $.map(reportInfo, function (obj, index) {
                        if (reportInfo[index]["drilledItems"] != undefined) {
                            return me._getSortedMembers(obj, reportInfo);
                        }
                    });
                    var prevDimElements = reportInfo.length > 1 ? $.map(reportInfo, function (item, index) { if (!ej.isNullOrUndefined(item._prevDimElements)) return item._prevDimElements }) : [];
                    if (ej.olap.base._isColDrilled && "columns" == ej.olap.base._currIndex["axis"] && reportInfo[ej.olap.base._currIndex.Index] != undefined && reportInfo[ej.olap.base._currIndex.Index]["drilledItems"] != undefined) {
                        var members = $.map(updateQuery, function (obj, index) { if (obj.indexOf("DrillDownlevel") >= 0) obj = obj.replace("DrillDownlevel", "DrillDownlevel(") + ")"; return obj; });
                        reportInfo[ej.olap.base._currIndex.Index]["drilledItems"].push(members);
                        dimensionSet = reportInfo.length > 1 ? me._updateDrillQuery(reportInfo, dimensionSet, axis, updateQuery) : dimensionSet;
                        ej.olap.base._isColDrilled = false;
                    }
                    else if (!ej.olap.base._isColDrilled && prevDimElements.length > 0)
                        dimensionSet = reportInfo.length > 1 ? me._updateDrillQuery(reportInfo, dimensionSet, axis, updateQuery) : dimensionSet;
                    else if (drillColInfo.length > 0 && (ej.olap.base._currIndex["axis"] == undefined || (ej.olap.base._currIndex["axis"] == "rows" && !ej.olap.base._isColDrilled)))
                        dimensionSet = this._getDrillQuery(drillColInfo, dimensionSet, reportInfo);
                    if (!ej.isNullOrUndefined(ej.olap.base._currIndex["axis"]) && ej.olap.base._currIndex["axis"] == "columns")
                        ej.olap.base._currIndex = {};
                }
                ej.olap.base.olapCtrlObj._prevDrillElements = [];
                return dimensionSet;
            },


            _getDrillQuery: function (drilledInfo, mdx, report) {
                var query = "",collapseQuery="", expandColl = ej.isNullOrUndefined(drilledInfo.expandCollection) ? drilledInfo : drilledInfo.expandCollection, collapseColl = ej.isNullOrUndefined(drilledInfo.collapseCollection) ? [] : drilledInfo.collapseCollection;
                for (var i = 0; i < expandColl.length; i++) {
                    if (!(expandColl[i][expandColl[i].length - 1].toLowerCase().indexOf(".children") >= 0) && !(expandColl[i][expandColl[i].length - 1].toLowerCase().indexOf("drilldownlevel") >= 0) && !(expandColl[i][expandColl[i].length - 1].toLowerCase().indexOf("members") >= 0)) {
                        expandColl[i][expandColl[i].length - 1] = expandColl[i][expandColl[i].length - 1] + ".children";
                    }
                    if (expandColl[i].length != report.length) {
                        var temp = $.map(report, function (obj, index) {
                            if (obj.fieldName != undefined && obj.fieldName != expandColl[i][[expandColl[i].length - 1]].split(".").splice(0, 2).join("."))
                                return { uniqueName: ej.olap.base._isPaging ? "(" + $.trim(obj.fieldName) + ").children" : "DrillDownLevel(" + $.trim(obj.fieldName) + ")", fieldName: $.trim(obj.fieldName) };
                        });
                        for (var j = 0; j < temp.length; j++) {
                            var pos = this._getItemPosition(report, temp[j].fieldName)[0];
                            if (!(expandColl[i].toString().indexOf(temp[j].fieldName) >= 0))
                                expandColl[i].splice(pos, 0, temp[j].uniqueName);
                        }
                        query = query + "" + (i > 0 ? "," : "") + "\n (" + expandColl[i] + ")";
                    }
                    else
                        query = query + "" + (i > 0 ? "," : "") + "\n (" + expandColl[i].toString() + ")\n";
                }
                for (var i = 0; i < collapseColl.length; i++) {
                    collapseQuery = collapseQuery + "\n" + (i > 0 ? "," : "") + "(" + collapseColl[i].toString() + ")\n";
                }
                return "{(" + mdx + ")," + query + "}" + (collapseQuery == "" ? "" : "-{" + collapseQuery + "}");
            },

			_createDrillThroughQuery: function (text, args) {
			    if (args.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
			        args._waitingPopup.show();
			        var rpt =  $(args.element).hasClass("e-pivotclient")?  args.element.find(".e-pivotgrid").data("ejPivotGrid"): args;
			        args.doAjaxPost("POST", args.model.url + "/" + args.model.serviceMethodSettings.drillThroughDataTable, JSON.stringify({ "currentReport": $(args.element).parents(".e-pivotclient").length > 0 ? args.currentReport : JSON.parse(rpt.getOlapReport()).Report, "layout": args.model.layout, "cellPos": "", "selector": text }), function (args) {
			            this._trigger("drillThrough", { element: args.element, data: args });
			        });
			        args._waitingPopup.hide();
			    }
			    else {
			        var measureGrpName = args.measureGrp, measure = "";
			        var drillQuery = "DRILLTHROUGH Select(" + args._colHeader.join() + "," + args._rowHeader.join() + ") on 0 from [" + args.model.dataSource.cube + "] RETURN";
			        $.map(args._fieldData.measures, function (obj, index) { if (obj.pid == measureGrpName) measure += measure == "" ? "[" + measureGrpName + "]." + obj.id.split(".")[1] : ",[" + measureGrpName + "]." + obj.id.split(".")[1] })
			        drillQuery += (text != "" && !ej.isNullOrUndefined(text)) ? " " + measure + "," + text : " " + measure;
			        drillQuery = drillQuery.replace(/&/g, "&amp;");
			        var conStr = args._getConnectionInfo(args.model.dataSource.data);
			        pData = "<Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\"> <Header></Header> <Body> <Execute xmlns=\"urn:schemas-microsoft-com:xml-analysis\"> <Command> <Statement> " + drillQuery + " </Statement> </Command> <Properties> <PropertyList> <Catalog>" + args.model.dataSource.catalog + "</Catalog> </PropertyList> </Properties></Execute> </Body> </Envelope>";
			        args.doAjaxPost("POST", conStr.url, { XMLA: pData }, ej.Pivot._generateDrillData, null, { pvtGridObj: args, action: "loadFieldElements" });
			    }
            },

			_getDimensionQuery: function (dimElement, report, axis, index, isDrillOnPaging) {

			    var dimQuery = "";
			    if (!ej.isNullOrUndefined(dimElement["drillCellInfo"]) && !ej.isNullOrUndefined(dimElement["drillCellInfo"].previousElements) && dimElement["drillCellInfo"].previousElements != "")
			        ej.olap.base.olapCtrlObj._prevDrillElements = dimElement["drillCellInfo"].previousElements.split("][").join("]>#>[").split(">#>");

                if (dimElement["drillCellInfo"] != undefined && !isDrillOnPaging) {
                    dimQuery = "{(" + dimElement["drillCellInfo"].uniqueName + ")}";
                    if (!ej.isNullOrUndefined(dimElement["drillCellInfo"].previousElements) && dimElement["drillCellInfo"].previousElements != "") {
                        var prevElements = $.map(report[axis], function (item, index) {
                            var members = ($.map(dimElement["drillCellInfo"].previousElements.split("][").join("]>#>[").split(">#>"), function (itm, idx) {
                                if (itm.indexOf(item.fieldName) > -1) return itm;
                            })).join("$");
                            if (members != "") return members;
                        }).join("--");
                        dimElement["_prevDimElements"] = ej.isNullOrUndefined(dimElement["_prevDimElements"]) ? [] : dimElement["_prevDimElements"];
                        dimElement["_prevDimElements"].push(prevElements + ((!ej.isNullOrUndefined(dimElement.hasAllMember) && dimElement.hasAllMember) ? ".levels(0).AllMembers" : ".children"));
                    }
                    delete dimElement.drillCellInfo;
                }
                else {
                    if (ej.isNullOrUndefined(dimElement.hasAllMember) || !dimElement.hasAllMember) {
                        dimQuery = ej.olap.base._isPaging ? "((" + $.trim(dimElement.fieldName) + ").children)" : "DrillDownlevel((" + $.trim(dimElement.fieldName) + "))";
                    }
                    else
                        dimQuery = "((" + $.trim(dimElement.fieldName) + ").levels(0).AllMembers)";
                }
                return dimQuery
            },

			_updateReport: function (members, cellInfo, reportItem, pvtGridObj) {
			    var preRepIm, drilledCol, args = {};
			    if (pvtGridObj._isMondrian) {
			        var itmPos;
			        preRepIm = cellInfo.preRepItm.split(">#>");
			        itmPos = cellInfo.itemPosition;
			        if (itmPos)
			            drilledCol = cellInfo.previousElements.split(preRepIm[itmPos - 1])[1].split("][").length;
			        else
			            drilledCol = cellInfo.previousElements.split("][").length;
			        if (reportItem.drilledItems) {
			            if (reportItem.drilledItems.length <= (drilledCol -1))
			                reportItem.drilledItems[drilledCol - 1] = [];
			            if (cellInfo.action && cellInfo.action == "collapse")
			            {
			                reportItem.drilledItems[drilledCol - 1] = $.grep(reportItem.drilledItems[drilledCol - 1], function (ele) {
			                    return ele != preRepIm[itmPos];
			                });
			            }
                        else
			                reportItem.drilledItems[drilledCol - 1].push(preRepIm[itmPos]);
			        }
                    args = { action: "mondrianDrilldown" };
			    }
			    else {
			        reportItem["drillCellInfo"] = $.extend({}, cellInfo);
			        reportItem["drillCellInfo"].uniqueName = "(" + $.trim(reportItem["drillCellInfo"].uniqueName) + ".children)";
			        args = { action: "drilldown", cellInfo: cellInfo };
			    }
                ej.olap.base.getJSONData(args, pvtGridObj.model.dataSource, pvtGridObj);
            },
            
            _splitCellInfo: function (args) {
                var spliceLn = ej.olap.base.olapCtrlObj._isMondrian ? 1 : 2;
                if (args) 
                var cellInfo = {
                    hierarchyUniqueName: args.split("::")[1].split(".").splice(0, spliceLn).join("."),
                    uniqueName: args.split("::")[0],//.replace(/\&/g, "&amp;")
                    levelUniqueName: args.split("::")[1],
                    leveName: args.split("::")[2],
                    parentUniqueName: args.split("::")[3],//.replace(/\&/g, "&amp;")
                };
                return cellInfo
            },

            updateDrilledReport: function (args, currentAxis, pvtGridObj) {
                if (ej.olap.base._isPaging && !ej.isNullOrUndefined(pvtGridObj._pagingSavedObjects.curDrilledItem)) {
                    pvtGridObj._pagingSavedObjects.curDrilledItem = args;
                }
                var me = ej.olap._mdxParser, reportItem = null, cellInfo, fieldItems, prevItems = "", preRepItm = "", reportInfo, axis;
                cellInfo = this._splitCellInfo(args.uniqueName);
                cellInfo.targetUName = args.uniqueName,
                cellInfo.previousElements = "";

                fieldItems = (currentAxis == "rowheader") ? pvtGridObj.model.dataSource.rows : (currentAxis == "colheader") ? pvtGridObj.model.dataSource.columns : null;

                if (fieldItems.length > 0) {
                    reportInfo = $.map(fieldItems, function (obj, index) {
                        if (obj.fieldName != undefined && ($.trim(obj.fieldName).toLowerCase() == $.trim(cellInfo.hierarchyUniqueName).toLowerCase()))
                            return { report: obj, index: index };
                    });
                    reportItem = reportInfo[0].report;
                    cellInfo.itemPosition = reportInfo[0].index;
                    if (ej.isNullOrUndefined(pvtGridObj._pivotRecords) && !ej.isNullOrUndefined(pvtGridObj._pivotClientObj) && !ej.isNullOrUndefined(pvtGridObj._pivotClientObj._pivotRecords))
                        pvtGridObj._pivotRecords = pvtGridObj._pivotClientObj._pivotRecords;
                    var currentIndex = $.map(pvtGridObj._pivotRecords.records, function (obj, index) { if (obj.Info.replace(/&/g, "&amp;") == args.uniqueName) return obj.Index; });

                    reportItem.drilledItems != undefined ? reportItem.drilledItems : reportItem["drilledItems"] = [];
                    ej.olap.base._currIndex = { axis: (currentAxis == "rowheader") ? "rows" : "columns", Index: reportInfo[0].index };

                    if (pvtGridObj.pluginName == "ejPivotChart" || pvtGridObj.pluginName == "ejPivotTreeMap" || ej.isNullOrUndefined(args.index)) {
                        cellInfo.cellIndex = currentIndex.length > 0 ? "" : args.index;
                        cellInfo.axis = axis = currentAxis;
                        (currentAxis != "rowheader") ? ej.olap.base._isColDrilled = ((args["action"] != undefined && args.action == "collapse") ? false : true) : ej.olap.base._isRowDrilled = ((args["action"] != undefined && args.action == "collapse") ? false : true);
                        for (var i = 0; i < pvtGridObj.model.dataSource.rows.length; i++) {
                            if (args.seriesInfo[i] == args.uniqueName)
                                break;
                            else
                                pvtGridObj.model.dataSource.rows[i]["drillCellInfo"] = this._splitCellInfo(args.seriesInfo[i]);
                        }

                        cellInfo.previousElements = "", cellInfo["preRepItm"] = "";
                        for (var i = 0; i < args.uniqueNameArray.length; i++)
                            cellInfo.previousElements += this._splitCellInfo(args.uniqueNameArray[i]).uniqueName;
                        for (var i = 0; i < args.seriesInfo.length; i++)
                            cellInfo.preRepItm += cellInfo.preRepItm == "" ? this._splitCellInfo(args.seriesInfo[i]).uniqueName : ">#>" + this._splitCellInfo(args.seriesInfo[i]).uniqueName;
                    }
                    else {
                        cellInfo.cellIndex = args.index;
                        var currentHierarchyName = cellInfo.hierarchyUniqueName,
                            axis = "", prevItems = "", currCellInfo = "",
                            colPos = cellInfo.cellIndex.split(",")[0],
                            rowPos = cellInfo.cellIndex.split(",")[1];

                        if (!(currentAxis == "rowheader")) {
                            axis = "colheader"; ej.olap.base._isColDrilled = (args["action"] != undefined && args.action == "collapse") ? false : true;

                            for (var i = parseInt(rowPos) ; i >= 0; i--) {

                                if (!pvtGridObj._pivotRecords.records[parseInt((colPos * pvtGridObj._pivotRecords.rowCount) + parseInt(i))].Info.indexOf(currentHierarchyName) >= 0) {
                                    currCellInfo = pvtGridObj._pivotRecords.records[parseInt((colPos * pvtGridObj._pivotRecords.rowCount) + parseInt(i))].Info;
                                    var headerUn = this._splitCellInfo(currCellInfo);
                                    if (headerUn) prevItems = headerUn.uniqueName + (pvtGridObj._isMondrian ? "" : ">#>") + prevItems;
                                    if (currCellInfo != "" && !(currCellInfo.indexOf(currentHierarchyName) >= 0)) {
                                        var headerDrillInfo = this._splitCellInfo(currCellInfo);
                                        headerDrillInfo.uniqueName = headerDrillInfo.uniqueName.replace(/&/g, "&amp;")
                                        preRepItm = headerDrillInfo.uniqueName + (pvtGridObj._isMondrian ? ">#>" : "") + preRepItm;
                                        currReport = $.map(fieldItems, function (obj, index) { if (obj.fieldName != undefined && ($.trim(obj.fieldName).toLowerCase() == $.trim(headerDrillInfo.hierarchyUniqueName).toLowerCase())) return index; });
                                        if (args.action != "collapse")
                                            pvtGridObj.model.dataSource.columns[currReport[0]]["drillCellInfo"] = headerDrillInfo;
                                        currentHierarchyName = headerDrillInfo.hierarchyUniqueName;
                                    }
                                }
                            }
                        }
                        else {
                            axis = "rowheader"; ej.olap.base._isRowDrilled = (args["action"] != undefined && args.action == "collapse") ? false : true;
                            for (var i = parseInt(colPos) ; i >= 0; i--) {
                                if (!pvtGridObj._pivotRecords.records[parseInt((i * pvtGridObj._pivotRecords.rowCount) + parseInt(colPos))].Info.indexOf(currentHierarchyName) >= 0) {
                                    currCellInfo = pvtGridObj._pivotRecords.records[parseInt((i * pvtGridObj._pivotRecords.rowCount) + parseInt(rowPos))].Info;
                                    var headerUn = this._splitCellInfo(currCellInfo);
                                    if (headerUn) prevItems = headerUn.uniqueName + prevItems;
                                    if (currCellInfo != "" && !(currCellInfo.indexOf(currentHierarchyName) >= 0)) {
                                        var headerDrillInfo = this._splitCellInfo(currCellInfo);
                                        headerDrillInfo.uniqueName = headerDrillInfo.uniqueName.replace(/&/g, "&amp;");
                                        preRepItm = headerDrillInfo.uniqueName + ">#>" + preRepItm;
                                        currReport = $.map(fieldItems, function (obj, index) { if (obj.fieldName != undefined && ($.trim(obj.fieldName).toLowerCase() == $.trim(headerDrillInfo.hierarchyUniqueName).toLowerCase())) return index; });
                                        if (args.action != "collapse")
                                            pvtGridObj.model.dataSource.rows[currReport[0]]["drillCellInfo"] = headerDrillInfo;
                                        currentHierarchyName = headerDrillInfo.hierarchyUniqueName;
                                    }
                                }
                            }
                        }
                        //prevItems = cellInfo.uniqueName + ">#>" + prevItems;
                        preRepItm += cellInfo.uniqueName;
                        cellInfo.previousElements = prevItems.replace(/&amp;/g, "&");
                        cellInfo.preRepItm = preRepItm.replace(/&amp;/g, "&");
                        cellInfo.axis = axis;
                    }
                    cellInfo.previousElements = cellInfo.previousElements.replace(/&amp;/g, "&");
                    cellInfo.preRepItm = cellInfo.preRepItm.replace(/&amp;/g, "&");
                    if (!args.action) {
                        var drilledMem = ej.olap.base._getDrilledMemeber({ item: cellInfo });
                        //if (drilledMem.length)
                           // ej.olap.base._onDemandCollapse({ drilledMembers: drilledMem, action: "collapse" }, axis);
                        ej.olap._mdxParser._updateReport(reportItem.drilledItems, cellInfo, reportItem, pvtGridObj);
                    }
                    else if (args.action) {
						if (pvtGridObj._isMondrian) {
                            cellInfo.action = "collapse";
                            ej.olap._mdxParser._updateReport(reportItem.drilledItems, cellInfo, reportItem, pvtGridObj);
                            return;
                        }
                        if (!ej.isNullOrUndefined(cellInfo) && !ej.isNullOrUndefined(cellInfo.previousElements) && cellInfo.previousElements != "")
                            ej.olap.base.olapCtrlObj._prevDrillElements = cellInfo.previousElements.split("][").join("]>#>[").split(">#>");
                        var drilledMem = ej.olap.base._getDrilledMemeber({ item: cellInfo });
                        if (drilledMem.length && !ej.olap.base._isPaging)
                            ej.olap.base._onDemandCollapse({ drilledMembers: drilledMem, action: args.action }, axis);
                        else {
                            while (drilledMem.length != 0) {
                                ej.olap.base.olapCtrlObj.model.dataSource = ej.olap._mdxParser._clearCollapsedItems(axis, drilledMem[drilledMem.length - 1], ej.olap.base.olapCtrlObj.model.dataSource);
                                drilledMem = drilledMem.splice(0, drilledMem.length - 1);
                            }
                            ej.olap.base.getJSONData(args, ej.olap.base.olapCtrlObj.model.dataSource, ej.olap.base.olapCtrlObj);
                        }
                    }
                    else {
                        var clonedEl = $(args.drilledMember).clone(true);
                        ej.olap.base._onDemandExpand({ action: "drilldown", cellInfo: cellInfo, isExist: true }, args.drilledMember);
                    }
                }
            },
            _clearCollapsedItems: function (dragAxis, headerText, dataSource) {
                if (dragAxis == "rowheader") {
                    dataSource.rows = $.map(dataSource.rows, function (value) { 
                        if ((value.drilledItems != undefined) && value.drilledItems.length){
                            value.drilledItems = $.map(value.drilledItems, function (values) { if (values.join("").indexOf(headerText.repItms.replace(/&/g, "&amp;")) < 0) return [values]; });
                        }
                        return value;
                    });
                }
                else if (dragAxis == "colheader") {
                    dataSource.columns = $.map(dataSource.columns, function (value) {
                        if ((value.drilledItems != undefined) && value.drilledItems.length) {
                            value.drilledItems = $.map(value.drilledItems, function (values) {
                                if (values.join("").indexOf(headerText.repItms.replace(/&/g, "&amp;")) < 0)
                                    return [values];
                            });
                        }
                        return value;
                    });
                }
                return dataSource;
            },
             _getSlicerMDX: function (olapReport, pvtGridObj) {
                 var filterElements = $(olapReport)[0].filters, dimensionSet = "", me = this, fieldData = pvtGridObj["_fieldData"], gridEle = $.merge($.merge([], olapReport.columns), olapReport.rows);
                for (var i = 0; i < filterElements.length; i++) {
                    var iscol = $.grep(gridEle, function (value) {
                        var colUN = me._getDimensionUniqueName(value.fieldName, fieldData), filtUN = me._getDimensionUniqueName(filterElements[i].fieldName, fieldData), isMatch = false;
                        isMatch = colUN == filtUN && !(pvtGridObj._isMondrian && filtUN == "" && colUN == "");
                        return isMatch;
                    }).length > 0;
                    //if(!iscol)
                       // iscol = $.grep($(olapReport)[0].rows, function (value) { return me._getDimensionUniqueName(value.fieldName, fieldData) == me._getDimensionUniqueName(filterElements[i].fieldName, fieldData); }).length > 0;
                    if (!iscol) {
                        if (filterElements[i].fieldName != undefined && filterElements[i].filterItems == undefined)
                            dimensionSet = dimensionSet + (dimensionSet != "" ? "*" : "") + "{" + this._getDimensionQuery(filterElements[i]) + "}"; //i > 0
                        else if (filterElements[i].filterItems != undefined) {
                            dimensionSet = dimensionSet + (dimensionSet != "" ? "*" : "") + "{" + (filterElements[i].filterItems.values.toString()) + "}";
                        }
                    }
                }
                return dimensionSet!="" ? "where (" + dimensionSet.replace(/DrillDownlevel/g, "") + ")" : "";
            },

             _getDimensionUniqueName: function (headerText, fieldData) {
                var _hierarchyNodes = fieldData.hierarchy;
                if (_hierarchyNodes)
                {
                    var parentUniqueName = $.map(_hierarchyNodes, function (obj, index) {  if (obj.id.toLowerCase() == headerText.toLowerCase()) { return obj.pid; }});
                    return parentUniqueName.length > 0 ? parentUniqueName[0] : "";
                }
                else
                    return headerText.split(".")[0];
            },
            _getMeasuresQuery: function (olapReports) {

                var valueElements = $(olapReports)[0].values, valueQueryArr = [], query = "", axisName = "";
                if(valueElements.length>0)
                {
                    var measureInfo = jQuery.map(valueElements, function (n, i) { if (n["measures"] != undefined) return { measureElements: n["measures"], Index: i, axisName: n["axis"] }; });
                    var measureQuery = measureInfo.length > 0 ? $.map(measureInfo[0]["measureElements"], function (x) {
                        return x.fieldName;
                    }) : null;
                    (measureQuery != null) ? valueQueryArr.push({ values: measureQuery, Index: measureInfo[0].Index }) : valueQueryArr;
                    axisName = valueElements["axis"];
                }
                query = $.map(valueQueryArr, function (x) {
                    return x.values.toString();
                });
                 return query[0] != "" ? "{" + query + "}" : "";
            },

            _getIncludefilterQuery: function (report, cube, pvtGridObj) {
                var filterQuery = "FROM [" + cube + "]", query = "FROM ( SELECT (", rowFilter, columnFilter, fieldData = pvtGridObj["_fieldData"];
                var advancedFilterQuery = [], filterAxis = "COLUMNS";
                if (pvtGridObj._isMondrian)
                    return filterQuery;
                rowFilter = $.map($(report.rows), function (field, i) { if (field.filterItems != undefined) return [field.filterItems.values];});
                columnFilter = $.map($(report.columns), function (field, i) { if (field.filterItems != undefined) return [field.filterItems.values]; });

                for (var i = 0; i < report.filters.length; i++) {
                    var filterElements = report.filters, me = this ,isFound=false;
                    $.map(report.columns, function (value, index) {
                        if (me._getDimensionUniqueName(value.fieldName, fieldData) == me._getDimensionUniqueName(filterElements[i].fieldName, fieldData)) {
                            if (filterElements[i].filterItems != undefined) {
                                columnFilter.push(filterElements[i].filterItems.values);
                                isFound = true;
                            }
                        }
                    });
                    if(!isFound)
                    $.map(report.rows, function (value, index) {
                        if (me._getDimensionUniqueName(value.fieldName, fieldData) == me._getDimensionUniqueName(filterElements[i].fieldName, fieldData)) {
                            if (filterElements[i].filterItems != undefined)
                                rowFilter.push(filterElements[i].filterItems.values);
                        }
                    });
                }
                if (report.enableAdvancedFilter) {
                    for (var i = 0; i <= report.columns.length - 1; i++) {
                        if (report.columns[i].advancedFilter) { $.merge(advancedFilterQuery, (this._getAdvancedFilterQuery(report.columns[i], query, filterAxis))); }
                    }
                    for (var i = 0; i <= report.rows.length - 1; i++) {
                        if (report.rows[i].advancedFilter)
                            $.merge(advancedFilterQuery, (this._getAdvancedFilterQuery(report.rows[i], query, filterAxis)));
                    }
                }
                for (var i = 0; i <= columnFilter.length - 1; i++)
                    query = i == 0 ? query + "{" + columnFilter[i].toString() + "}" : query + ",{" + columnFilter[i].toString() + "}";

                if (columnFilter.length > 0)
                    query = (rowFilter.length > 0) ? query + " ) on COLUMNS " + ",(" : query + " ) on COLUMNS ";

                for (var i = 0; i <= rowFilter.length - 1; i++)
                    query = (i > 0) ? query + ",{" + rowFilter[i].toString() + "}" : query + "{" + rowFilter[i].toString() + "}";

                query = (columnFilter.length > 0 && rowFilter.length > 0) ? query = query + ") on ROWS " : (columnFilter.length == 0 && rowFilter.length > 0) ? query + ") on COLUMNS " : query;
                if (advancedFilterQuery.length > 0) {
                    advancedFilterQuery = ((columnFilter.length > 0 || rowFilter.length > 0) ? query : "") + " " + advancedFilterQuery.join(" ") + " " + filterQuery + Array(advancedFilterQuery.length + 1 + columnFilter.length + rowFilter.length).join(")");
                }
                filterQuery = (columnFilter.length == 0 && rowFilter.length == 0) ? filterQuery : query + filterQuery + ")";
                return (advancedFilterQuery.length > 0) ? advancedFilterQuery : filterQuery;
            },
            _getAdvancedFilterQuery: function (fieldItem, query, currentAxis) {
                var filterQuery = [], me = this;
                $.map(fieldItem.advancedFilter, function (filterItem, index) {
                    if (!(ej.isNullOrUndefined(filterItem["labelFilterOperator"]) && filterItem["labelFilterOperator"]==ej.olap.LabelFilterOptions.None &&
                          ej.isNullOrUndefined(filterItem["valueFilterOperator"]) &&  filterItem["valueFilterOperator"]==ej.olap.ValueFilterOptions.None )) {
                        filterQuery.push("FROM (SELECT Filter(" + $.trim(filterItem.name) + ".AllMembers, " + me._getAdvancedFilterCondtions(fieldItem.fieldName,
                            ((filterItem["advancedFilterType"] == ej.olap.AdvancedFilterType.LabelFilter || ej.isNullOrUndefined(filterItem["advancedFilterType"])) ? filterItem["labelFilterOperator"] : filterItem["valueFilterOperator"]),
                            filterItem.values,
                            filterItem["advancedFilterType"], filterItem["measure"]) + ")) on " + currentAxis);
                    }
                });
                return filterQuery;
            },

            _getAdvancedFilterCondtions: function (fieldName, filterOperator, values, filterType, measures) {
                var advancedFilterQuery = "", filterType=ej.isNullOrUndefined(filterType)?"label":filterType;
                switch (filterOperator.toLowerCase()) {
                    case "equals":
                        advancedFilterQuery = "(" + (filterType != "value" ? (fieldName + ".CurrentMember.member_caption =\"" + values[0] + "\"") : (measures + " = " + values[0]));
                        break;
                    case "notequals":
                        advancedFilterQuery = "(" + (filterType != "value" ? (fieldName + ".CurrentMember.member_caption &lt;&gt;\"" + values[0] + "\"") : (measures + " &lt;&gt;" + values[0]));
                        break;
                    case "contains":
                        advancedFilterQuery = "( InStr (1," + fieldName + ".CurrentMember.member_caption,\"" + values[0] + "\")&gt;0";
                        break;
                    case "notcontains":
                        advancedFilterQuery = "( InStr (1," + fieldName + ".CurrentMember.member_caption,\"" + values[0] + "\")=0";
                        break;
                    case "beginswith":
                        advancedFilterQuery = "( Left (" + fieldName + ".CurrentMember.member_caption," + values[0].length + ")=\"" + values[0] + "\"";
                        break;
                    case "notbeginswith":
                        advancedFilterQuery = "( Left (" + fieldName + ".CurrentMember.member_caption," + values[0].length + ")&lt;&gt;\"" + values[0] + "\"";
                        break;
                    case "endswith":
                        advancedFilterQuery = "( Right (" + fieldName + ".CurrentMember.member_caption," + values[0].length + ")=\"" + values[0] + "\"";
                        break;
                    case "notendswith":
                        advancedFilterQuery = "( Right (" + fieldName + ".CurrentMember.member_caption," + values[0].length + ")&lt;&gt;\"" + values[0] + "\"";
                        break;
                    case "greaterthan":
                        advancedFilterQuery = "(" + (filterType != "value" ? (fieldName + ".CurrentMember.member_caption &gt;\"" + values[0] + "\"") : (measures + " &gt;" + values[0] + ""));
                        break;
                    case "greaterthanorequalto":
                        advancedFilterQuery = "(" + (filterType != "value" ? (fieldName + ".CurrentMember.member_caption &gt;=\"" + values[0] + "\"") : (measures + " &gt;=" + values[0] + ""));
                        break;
                    case "lessthan":
                        advancedFilterQuery = "(" + (filterType != "value" ? (fieldName + ".CurrentMember.member_caption &lt;\"" + values[0] + "\"") : (measures + " &lt;" + values[0] + ""));
                        break;
                    case "lessthanorequalto":
                        advancedFilterQuery = "(" + (filterType != "value" ? (fieldName + ".CurrentMember.member_caption &lt;=\"" + values[0] + "\"") : (measures + " &lt;=" + values[0] + ""));
                        break;
                    case "between":
                        advancedFilterQuery = "(" + (filterType != "value" ? (fieldName + ".CurrentMember.member_caption &gt;=\"" + values[0] + "\"AND " + fieldName + ".CurrentMember.member_caption &lt;=\"" + values[1] + "\"") : (measures + " &gt;=" + values[0] + " AND " + measures + "&lt;=" + values[1]));
                        break;
                    case "notbetween":
                        advancedFilterQuery = "(" + (filterType != "value" ? (fieldName + ".CurrentMember.member_caption &gt;=\"" + values[0] + "\"OR " + fieldName + ".CurrentMember.member_caption &lt;=\"" + values[1] + "\"") : (measures + " &gt;=" + values[0] + " OR " + measures + "&lt;=" + values[1]));
                        break;
                    default:
                        advancedFilterQuery = "( InStr (1," + fieldName + ".CurrentMember.member_caption,\"" + values[0] + "\")&gt;0";
                        break;
                }

                return advancedFilterQuery;
            },
            _getItemPosition: function (report, element) {
                return $.map(report, function (obj, index) {
                    if (obj.fieldName != undefined && $.trim(obj.fieldName) == $.trim(element))
                    { return index; }
                })
            },

            getAllMember: function (dataSource, fieldName, controlObj) {
                if (!ej.isNullOrUndefined(controlObj)) {
                    var mdxQuery = "select {" + fieldName + "} dimension properties CHILDREN_CARDINALITY on 0 from [" + $.trim(dataSource.cube) + "]";
                    var xmla = ej.olap._mdxParser.getSoapMsg(mdxQuery, dataSource.data, dataSource.catalog);
                    var conStr = ej.olap.base._getConnectionInfo(dataSource.data);
                    controlObj.doAjaxPost("POST", conStr.url, { XMLA: xmla }, controlObj._generateAllMember, null, { action: "loadFieldElements" });
                }
            },

            getMembers: function (dataSource, fieldName, controlObj) {
                var reportItem = ej.Pivot.getReportItemByFieldName(fieldName, dataSource).item, dimProp = "dimension properties CHILDREN_CARDINALITY, MEMBER_TYPE";
                if (ej.olap.base.olapCtrlObj._isMondrian) {
                    if(!ej.isNullOrUndefined(controlObj.model.pivotControl))
                        this._controlObj = controlObj.model.pivotControl;
                }
                // var mdxQuery = "select {" + ((reportItem  && reportItem["hasAllMember"]) ? fieldName + ".levels(0).members" : fieldName + ".children") + "} dimension properties CHILDREN_CARDINALITY on 0 from [" + $.trim(dataSource.cube) + "]";
                var mdxQuery = "select {" + ((reportItem && reportItem["hasAllMember"]) ? fieldName + ".levels(0).AllMembers" : fieldName + ".children") + "}" + dimProp +" on 0 from [" + $.trim(dataSource.cube) + "]";
                var xmla = ej.olap._mdxParser.getSoapMsg(mdxQuery, dataSource.data, dataSource.catalog);
                var conStr = ej.olap.base._getConnectionInfo(dataSource.data);
                //if (!ej.isNullOrUndefined(controlObj.model.pivotControl) && controlObj.model.pivotControl.model.enableMemberEditorPaging) {
                //    this._memberCount = controlObj.doAjaxPost("POST", conStr.url, { XMLA: xmla }, controlObj._generateMembers, null, { action: "loadFieldElements" });
                //    mdxQuery = "WITH SET [AllDimensions] as {" + ((reportItem > 0 && reportItem["hasAllMember"]) ? fieldName + ".levels(0).members" : fieldName + ".children") + "} SELECT { Subset([AllDimensions]," + controlObj.model.pivotControl._memberPageSettings.startPage + "," + controlObj.model.pivotControl.model.memberEditorPageSize + ")} DIMENSION PROPERTIES MEMBER_UNIQUE_NAME on 0, {} ON 1 from [" + $.trim(dataSource.cube) + "]";
                //    xmla = ej.olap._mdxParser.getSoapMsg(mdxQuery, dataSource.data, dataSource.catalog, dsInfo);
                //}
                controlObj.doAjaxPost("POST", conStr.url, { XMLA: xmla }, controlObj._generateMembers, null, { action: "fetchMembers" });
            },
            getChildren: function (dataSource, memberUQName, controlObj) {
                var mdxQuery = "select {" + memberUQName + ".children} dimension properties CHILDREN_CARDINALITY on 0 from [" + dataSource.cube + "]", parentCnt = controlObj.model.pivotControl;
                if (!ej.isNullOrUndefined(parentCnt) && ej.olap.base.olapCtrlObj._isMondrian)
                    this._controlObj = controlObj.model.pivotControl;
                var xmlaData = ej.olap._mdxParser.getSoapMsg(mdxQuery, dataSource.data, dataSource.catalog);
                var conStr = ej.olap.base._getConnectionInfo(dataSource.data);
                controlObj.doAjaxPost("POST", conStr.url, { XMLA: xmlaData }, ej.Pivot.generateChildMembers, null, { action: "nodeExpand", currentNode: memberUQName });
            },
            getSoapMsg: function (mdx, url, catlogName) {
                var conStr = ej.olap.base._getConnectionInfo(url), dsInfo = "", xmlMsg;
                if (!ej.isNullOrUndefined(this["_controlObj"]) || ej.olap.base.olapCtrlObj._isMondrian)
                {
                    dsInfo = ej.isNullOrUndefined(this["_controlObj"]) ? ej.olap.base.olapCtrlObj.model.dataSource.sourceInfo : this._controlObj.model.dataSource.sourceInfo;
                    xmlMsg = "<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" SOAP-ENV:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\"><SOAP-ENV:Body><Execute xmlns=\"urn:schemas-microsoft-com:xml-analysis\"><Command><Statement><![CDATA[" + mdx + "]]></Statement></Command><Properties><PropertyList><DataSourceInfo>" + dsInfo + "</DataSourceInfo><Catalog>" + catlogName + "</Catalog><AxisFormat>TupleFormat</AxisFormat><Content>Data</Content><Format>Multidimensional</Format></PropertyList></Properties></Execute></SOAP-ENV:Body></SOAP-ENV:Envelope>";
                    delete this["_controlObj"];
                }
                else
                    xmlMsg = "<Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\"> <Header></Header> <Body> <Execute xmlns=\"urn:schemas-microsoft-com:xml-analysis\"> <Command> <Statement> " + mdx + " </Statement> </Command> <Properties> <PropertyList> <Catalog>" + catlogName + "</Catalog> <LocaleIdentifier>" + conStr.LCID + "</LocaleIdentifier></PropertyList> </Properties> </Execute> </Body> </Envelope>";
                return xmlMsg
            }
        },
   
     ej.olap.SortOrder = {
         None: "none",
         Ascending: "ascending",
         Descending: "descending"
     }
    ej.olap.Providers = {
        SSAS: "ssas",
        Mondrian:"mondrian"
    }
    ej.olap.AdvancedFilterType = {
        LabelFilter: "label",
        ValueFilter: "value"
    }

    ej.olap.ValueFilterOptions = {
        None: "none",
        Equals: "equals",
        NotEquals: "notequals",
        GreaterThan: "greaterthan",
        GreaterThanOrEqualTo: "greaterthanorequalto",
        LessThan: "lessthan",
        LessThanOrEqualTo: "lessthanorequalto",
        Between: "between",
        NotBetween: "notbetween"
    }

    ej.olap.LabelFilterOptions = {
        None: "none",
        BeginsWith: "beginswith",
        NotBeginsWith: "notbeginswith",
        EndsWith: "endswith",
        NotEndsWith: "notendswith",
        Contains: "contains",
        NotContains: "notcontains",
        Equals: "equals",
        NotEquals: "notequals",
        GreaterThan: "greaterthan",
        GreaterThanOrEqualTo: "greaterthanorequalto",
        LessThan: "lessthan",
        LessThanOrEqualTo: "lessthanorequalto",
        Between: "between",
        NotBetween: "notbetween"
        
    }

    ej.olap.AxisName = {
        Row: "rows",
        Column: "columns"
    };
})(jQuery, Syncfusion);
