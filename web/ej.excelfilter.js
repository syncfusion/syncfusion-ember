(function ($, ej, undefined) {

    ej.ExcelFilter = ej.ExcelFilter || {};
    ej.excelFilter = function (options) {
		ej.loadLocale("ejExcelFilter");
        this._ctrlInstance = options["instance"];
        this.id = this._ctrlInstance._id;
        this._dialogContainer = null;
        this._showSort = options["showSortOptions"] || false;
        this._interDeterminateState = options["interDeterminateState"] || false;
        this._maxCount = ej.isNullOrUndefined(options["maxFilterLimit"]) ? 1000 : options["maxFilterLimit"];
        this._formatFiltering = true;
        this._locale = this._ctrlInstance.model.locale || "en-US";
        this.localizedLabels = this._getLocalizedLabel();
        this._filterHandler = options["filterHandler"] || null;
        this._searchHandler = this._ctrlInstance.model.searchSettings || null
		this._cancelHandler = options["cancelHandler"] || null;
		this._customFilterHandler = options["customFilterHandler"] || null;
        this._cssClass = options["cssClass"] || null;
        this._matchCase = options["allowCaseSensitive"] || false;
        this._title = options["title"] || this.localizedLabels.title;
        this._complexBlankCriteria = options["enableComplexBlankFilter"];
        this._blankValue = options["blankValue"];
        this.fName = options["initFilterCol"] || null;
        this._spliter = options["valueDelimiter"] || ej.ExcelFilter.valueDelimiter;
        this._initialFName = this.fName;
        this._displayName = null;
        this._dataSource = null;
        this._isUrlAdaptor = false;
		this._$tableID = null;
        this._$blankVal = null;
        this._$selectedColors = [];
        this._$enableColor = false;
        this._$filteredByColor = "";
        this._$colType = null;
        this._$key = 0;
        this.filteredColumn = null;
        this.sortedColumns = null;        
        this._chkList = null;
        this._listsWrap = null;
        this._menuWrap = null;
        this._localJSON = null;
        this._actualCount = 0;
        this._totalRcrd = 0;
        this._enableResponsiveRow=false;
        this._searchCount = 0;
        this._currentData = null;
        this._openedFltr = null;
        this._predicates = [];
        this.cFilteredCols = this.fName!=null ? [this.fName] : [];
        this._columnsFiltered = [];
        this.guid = ej.getGuid("excelfilter");
        this._noDlg = [];
        this._sepAftr = ["sortDesc","notequal", "between", "top10","endswith","contains"];
        this._posType = ["number", "date", "datetime", "string", "boolean","guid"];
        this._empties = !this._complexBlankCriteria ? [this.guid] : ["null", "undefined", ""];
        this._reqInProgess = false;
        this._isFiltered = false;
        this._onActionBegin = options["actionBegin"] || null;
        this._onActionComplete = options["actionComplete"] || null;
        this.maxItemOnQuery = 0; /*To prevent OData URI queryString length*/
        this.enableNormalize = true; /*To clean up redundant values after formatting */
        this.enableSelect = false;
        this._onDemandSearch = false;
        this._maxFilterCount = false;
        this._clearSearchValue = false;
		this._islargeData = false;
        this._checkedValue = [];
        this._searchRequest = false;
        this._isIndeterminate = false;
        this._selectAll = "<div class='e-ftrchk'><input type='checkbox' class='e-selectall' value='selectall' class='e-ftrchk' /><label class='e-ftrchk'>(" + this.localizedLabels.SelectAll + ")</label></div>";
        this._blanks = "<div class='e-ftrchk'><input type='checkbox' id='blanks' class='e-ftrchk' value='" + this._empties.join(this._spliter) + "' @@/><label class='e-ftrchk' for='blanks' value=''>(" + this.localizedLabels.Blanks + ")</label></div>";
        this._blank = undefined;
        this._addAtLast = false;
        this._addToFilter = "<div class='e-ftrchk'><input type='checkbox' class='e-addtofilter'/><label class='e-ftrchk'>" + this.localizedLabels.AddToFilter + "</label></div>";
        this._preChkList = [];
        this._checked = null;
        this._add = null;
        this.guidMenuOpt = [
              { id: 1, text: this.localizedLabels.SortNoSmaller, sprite: "e-sortasc e-icon e-fnsort", htmlAttribute: { "ejfnrole": "sortAsc" } },
              { id: 2, text: this.localizedLabels.SortNoLarger, sprite: "e-sortdesc e-icon e-fnsort", htmlAttribute: { "ejfnrole": "sortDesc" } },
              { id: 3, text: this.localizedLabels.SortByColor, htmlAttribute: { "ejfnrole": "popup" }, child: [] },
              { id: 4, text: this.localizedLabels.ClearFilter, sprite: "e-filternone e-icon", htmlAttribute: { "ejfnrole": "clearfilter" } },
              { id: 5, text: this.localizedLabels.FilterByColor, htmlAttribute: { "ejfnrole": "popup" }, child: [] },
              { id: 6, text: this.localizedLabels.GuidFilter, htmlAttribute: { "ejfnrole": "filterpopup" }, child: this.localizedLabels.GuidMenuOptions }];
        this.numberMenuOpt = this.booleanMenuOpt = [
              { id: 1, text: this.localizedLabels.SortNoSmaller, sprite: "e-sortasc e-icon e-fnsort", htmlAttribute: { "ejfnrole": "sortAsc" } },
              { id: 2, text: this.localizedLabels.SortNoLarger, sprite: "e-sortdesc e-icon e-fnsort", htmlAttribute: { "ejfnrole": "sortDesc" } },
              { id: 3, text: this.localizedLabels.SortByColor, htmlAttribute: { "ejfnrole": "popup" }, child: [] },
              { id: 4, text: this.localizedLabels.ClearFilter, sprite: "e-filternone e-icon", htmlAttribute: { "ejfnrole": "clearfilter" } },
              { id: 5, text: this.localizedLabels.FilterByColor, htmlAttribute: { "ejfnrole": "popup" }, child: [] },
              { id: 6, text: this.localizedLabels.NumberFilter, htmlAttribute: { "ejfnrole": "filterpopup" }, child: this.localizedLabels.NumberMenuOptions }];
        this.stringMenuOpt = [
              { id: 1, text: this.localizedLabels.SortTextAscending, sprite: "e-sortasc e-icon e-fnsort", htmlAttribute: { "ejfnrole": "sortAsc" } },
              { id: 2, text: this.localizedLabels.SortTextDescending, sprite: "e-sortdesc e-icon e-fnsort", htmlAttribute: { "ejfnrole": "sortDesc" } },
              { id: 3, text: this.localizedLabels.SortByColor, htmlAttribute: { "ejfnrole": "popup" }, child: [] },
              { id: 4, text: this.localizedLabels.ClearFilter, sprite: "e-filternone e-icon", htmlAttribute: { "ejfnrole": "clearfilter" } },
              { id: 5, text: this.localizedLabels.FilterByColor, htmlAttribute: { "ejfnrole": "popup" }, child: [] },
              { id: 6, text: this.localizedLabels.TextFilter, htmlAttribute: { "ejfnrole": "filterpopup" }, child: this.localizedLabels.StringMenuOptions }];
        this.dateMenuOpt = [
              { id: 1, text: this.localizedLabels.SortDateOldest, sprite: "e-sortasc e-icon e-fnsort", htmlAttribute: { "ejfnrole": "sortAsc" } },
              { id: 2, text: this.localizedLabels.SortDateNewest, sprite: "e-sortdesc e-icon e-fnsort", htmlAttribute: { "ejfnrole": "sortDesc" } },
              { id: 3, text: this.localizedLabels.SortByColor, htmlAttribute: { "ejfnrole": "popup" }, child: [] },
              { id: 4, text: this.localizedLabels.ClearFilter, sprite: "e-filternone e-icon", htmlAttribute: { "ejfnrole": "clearfilter" } },
              { id: 5, text: this.localizedLabels.FilterByColor, htmlAttribute: { "ejfnrole": "popup" }, child: [] },
              { id: 6, text: this.localizedLabels.DateFilter, htmlAttribute: { "ejfnrole": "filterpopup" }, child: this.localizedLabels.DateMenuOptions }];
        this.datetimeMenuOpt = [
              { id: 1, text: this.localizedLabels.SortDateOldest, sprite: "e-sortasc e-icon e-fnsort", htmlAttribute: { "ejfnrole": "sortAsc" } },
              { id: 2, text: this.localizedLabels.SortDateNewest, sprite: "e-sortdesc e-icon e-fnsort", htmlAttribute: { "ejfnrole": "sortDesc" } },
              { id: 3, text: this.localizedLabels.SortByColor, htmlAttribute: { "ejfnrole": "popup" }, child: [] },
              { id: 4, text: this.localizedLabels.ClearFilter, sprite: "e-filternone e-icon", htmlAttribute: { "ejfnrole": "clearfilter" } },
              { id: 5, text: this.localizedLabels.FilterByColor, htmlAttribute: { "ejfnrole": "popup" }, child: [] },
              { id: 6, text: this.localizedLabels.DateTimeFilter, htmlAttribute: { "ejfnrole": "filterpopup" }, child: this.localizedLabels.DatetimeMenuOptions }];
        return this;
    };
    ej.excelFilter.prototype = {
        //Helpers to handle (Blanks) value.
        isNotBlank: function (key, global) {
            var e = ej.isNullOrUndefined(key) || (key === ""||key===null);

            if (!global && (key === ""||key===null))/* Handle special case - since "" string sorted before all */
                this._addAtLast = true;

            return !e;
        },   
        _checkBlank: function (key) {         

            if (this.isNotBlank(key))
                return true;
            /*Ensure Blank value added only once */
            var ret = this._blank == undefined && !this._addAtLast;

            if (ret) this._blank = true;            

            return ret;
        },
        _getValueData: function (key, data) {
            var arr = this._empties;

            if (this.isNotBlank(key, true)){
               arr = ej.distinct(data, this._$foreignKey || this.fName, false);
			   if(!(ej.browserInfo().name == "msie" && ej.browserInfo().version == "8.0")){
				for(var dat = 0; dat < arr.length; dat++){
					if((arr[dat] instanceof Date)){
						var temp = {dateString : arr[dat]};
						arr[dat] = JSON.parse(JSON.stringify(temp)).dateString;
						}
					}
			   }
			}

            return arr.join(this._spliter); /*Return value will be set to input element value attr*/
        },
        //Collection to predicate processing
        getPredicate: function (cols, field, updateModel) {
            this._isUrlAdaptor = this._ctrlInstance._dataSource() instanceof ej.DataManager && (this._ctrlInstance._dataSource().adaptor instanceof ej.UrlAdaptor || this._ctrlInstance._dataSource().adaptor instanceof ej.WebMethodAdaptor);
            var c, dis = field != undefined ? [field] : ej.distinct(cols, "field", false), collection, pred = {};
            for (var f = 0, flen = dis.length; f < flen; f++) {
                collection = new ej.DataManager(cols).executeLocal(new ej.Query().where("field", "equal", dis[f]));
                pred[dis[f]] = this.generatePredicate(collection);
                if (updateModel) {
                    this._predicates[this._$key] = this._predicates[this._$key] || {};
                    this._predicates[this._$key][dis[f]] = pred[dis[f]];
                }

            }
            return pred;
        },

        generatePredicate: function (cols) {
            var len = cols ? cols.length : 0, predicate, first;
            if (!len) return;
            first = this._updateDateFilter(cols[0]);
            if(this._isUrlAdaptor && (first.type == "date" || first.type == "datetime"))
                predicate = this._getDatePredicate(first);
            else
                predicate = first.ejpredicate ? first.ejpredicate : ej.Predicate(first.field, first.operator, first.value, first.ignoreCase || !first.matchcase);
            for (var p = 1; p < len; p++) {
                cols[p] = this._updateDateFilter(cols[p]);
                if (this._isUrlAdaptor && len > 2 && p > 1 && cols[p].predicate == "or"){
                    if (cols[p].type == "date" || cols[p].type == "datetime")                        
                        predicate.predicates.push(this._getDatePredicate(cols[p]));             
                    else
                        predicate.predicates.push(ej.Predicate(cols[p].field, cols[p].operator, cols[p].value, cols[p].ignoreCase || !cols[p].matchcase));
                }
                else{
                    if (this._isUrlAdaptor && (cols[p].type == "date" || cols[p].type == "datetime"))
                        predicate = predicate[cols[p].predicate](this._getDatePredicate(cols[p]));
                    else
                        predicate = cols[p].ejpredicate ? predicate[cols[p].predicate](cols[p].ejpredicate) : predicate[cols[p].predicate](cols[p].field, cols[p].operator, cols[p].value, cols[p].ignoreCase || !cols[p].matchcase);
                }
            }
            return predicate || null;
        },
        _getDatePredicate: function(predicate){
            return ej.Predicate(predicate.field, predicate.operator, predicate.value, predicate.ignoreCase || !predicate.matchcase);           
        },
        getFilterFrom: function (dm, data) {
            var data = ej.distinct(data, this.fName, false);
                        
            if (this.maxItemOnQuery > 0) data = data.slice(0, this.maxItemOnQuery);
                        
            return ej.UrlAdaptor.prototype.getFiltersFrom(data, new ej.Query().foreignKey(this._$foreignKey)); /*get [or] conditioned ejPredicate*/
        },
        /*Main Dialog*/
        renderDialog: function (type) {
            this._$colType = type;
            var dlgId = this.id + type + "_excelDlg";           
            //if ($("#" + dlgId).length != 0)
            //    return;
            var $dlg = ej.buildTag("div#" + dlgId + ".e-excelfilter e-dlgcontainer e-shadow");
            var $ul = ej.buildTag("ul#" + this.id + type + "_MenuItem");
            var menuData = this._getMenuData(type);
            $ul = this._createLiTag($ul, menuData, false);
            var $searchBox = ej.buildTag("span.e-searchbox e-fields").append(ej.buildTag("input#" + this.id + "_SearchBox.e-ejinputtext e-searchinput", {}, {}, { "type": "text", "placeholder": this.localizedLabels.Search })).append(ej.buildTag("span.e-search e-icon"))
            var $lbox = ej.buildTag("div#" + this.id + type + "_CheckBoxList.e-checkboxlist e-fields").append(ej.buildTag("div"));
            var $btns = this._createBtn();
            var $sBox = ej.buildTag("div.e-searchcontainer");            
            var $status = ej.buildTag("div.e-status e-fields e-hide", this.localizedLabels.CheckBoxStatusMsg);
            $dlg.append($ul);            
            $sBox.append($searchBox);
            $sBox.append($status);
            $sBox.append($lbox);
            $sBox.append($btns);
            $dlg.append($sBox);
            $dlg.appendTo(this._ctrlInstance.element);
            $dlg.css("display", "none");
            this._renderCustomFDlg(type);
            this._dialogContainer = $dlg;
            if(this._cssClass!=null)
                $dlg.addClass(this._cssClass);
            if (!this._showSort) {
                $ul.find(".e-fnsort").closest("li").css("display", "none");
                $ul.find("li.e-separator:first").css("display", "none");
            }
            this._lsitBoxTemplate();
            this._renderSubCtrls(type);
            if (ej.browserInfo().name == "msie" && ej.browserInfo().version < 10)
                ej.ieClearRemover($searchBox.find("input")[0]);
            this._wireEvents();
        },
        _getDeprecatedLocalizedLabel: function (key) {
            if (["Ok", "OK"].indexOf(key) != -1)
                return this.localizedLabels.Ok || this.localizedLabels.OK;
        },
        _renderSubCtrls: function (type) {
            $("#" + this.id + type + "_MenuItem").ejMenu({ orientation: "vertical", width: 266, container: "#" + this.id, click: ej.proxy(this._menuHandler, this), enableRTL: this._ctrlInstance.model.enableRTL, enableSeparator: false });
            $("#" + this.id + type + "_OkBtn").ejButton({ text: this._getDeprecatedLocalizedLabel("OK"), showRoundedCorner: true, width: 60, click: ej.proxy(this._fltrBtnHandler, this), enabled: true });
            $("#" + this.id + type + "_CancelBtn").ejButton({ text: this.localizedLabels.Cancel, showRoundedCorner: true, width: 60, click: ej.proxy(this.closeXFDialog, this) });
            $("#" + this.id + type + "_CheckBoxList").ejScroller({ height: 130, width: 234, scroll: ej.proxy(this._virtualize,this) });
            $("#" + this.id + type + "_CheckBoxList").ejWaitingPopup({ showOnInit: false });
        },
        openXFDialog: function (options) {
			var obj;
            this.fName = options["field"];
            this._dataSource = options["dataSource"];
            this._$colType = options["type"] || "string";
            this._$format = options["format"] || "";
            this._enableResponsiveRow=options["enableResponsiveRow"];
            this.filteredColumn = options["filteredColumns"] || this._ctrlInstance.model.filterSettings.filteredColumns;
            this.sortedColumns = options["sortedColumns"] || this._ctrlInstance.model.sortSettings.sortedColumns;
            this._displayName = options["displayName"];
            this.query = options["query"] || new ej.Query();
            this._$key = options["key"] || 0;
			this._$tableID = options["tableID"];
			this._$blankVal = ej.isNullOrUndefined(this._$tableID) ? this._$blankVal : options["blank"];
            this._$selectedColors = options["selectedColors"] || [];
            this._$enableColor = options["enableColor"] || false;
            this._$filteredByColor = options["filteredByColor"] || this._$filteredByColor;
			this._$foreignField = options["foreignKeyValue"];
			this._$foreignData = options["foreignDataSource"];
			this._$foreignKey = options["foreignKey"];
			this._$foreignKeyType = options["foreignKeyType"];
			if (this._$foreignData instanceof ej.DataManager && (this._$foreignData.adaptor instanceof ej.ODataAdaptor || this._$foreignData.adaptor instanceof ej.ODataV4Adaptor || this._$foreignData.adaptor instanceof ej.WebApiAdaptor))
			    this.maxItemOnQuery = 50;
			$.extend(this.localizedLabels, options["localizedStrings"] || {});
            var args = { requestType : "filterbeforeopen", filterModel : this, columnName:this.fName, columnType: this._$colType };
            if (this._ctrlInstance._trigger(this._onActionBegin, args))
                return;
            if (this._openedFltr == null || !this._openedFltr.is($("#" + this.id + this._$colType + "_excelDlg"))) {
                this.closeXFDialog();
                this._openedFltr = $("#" + this.id + this._$colType + "_excelDlg");
            }
            this._listsWrap = $("#" + this.id + this._$colType + "_CheckBoxList");
            this._menuWrap = $("#" + this.id + this._$colType + "_MenuItem");
            this._searchBox = this._openedFltr.find(".e-searchbox input");
            this._setPosition(this._openedFltr, options["position"]);
            this._openedFltr.addClass(options["cssClass"]);
            this._openedFltr.fadeIn(300, function () {
            });
			var $popups = $("#" + this.id + this._$colType + "_MenuItem").find("li[ejfnrole='popup']");
            if (this._$enableColor) {
                this._createDivTag($popups.eq(0).find(".e-shadow"), this._$selectedColors, false, "sort");
                (this._$filteredByColor == -1 || (this._$filteredByColor.length < 1 || this._$filteredByColor === this.fName)) ? this._createDivTag($popups.eq(1).find(".e-shadow"),this._$selectedColors, false, "filter") : $popups.eq(1).addClass("e-disable-item");
            }    
            else 
                $popups.hide();
            this._isFiltered = this._predicates[this._$key] != undefined && this._predicates[this._$key][this.fName] != undefined;
            this._isFiltered = options["isFiltered"] || this._isFiltered;
            if ((this._$colType == "date" || this._$colType == "datetime") && this._$format == "")
                this._$format = this._$colType == "date" ? "{0:MM/dd/yyyy}" : "{0:MM/dd/yyyy hh:mm:ss}";
            this._processListData();
			obj = this._listsWrap.data("ejScroller");
            
                        
            this._setDisable();
            var args = { requestType: "filterafteropen", filterModel: this, columnName: this.fName, columnType: this._$colType };
            if (this._ctrlInstance._trigger(this._onActionComplete, args))
                return;
        },
        closeXFDialog: function (e) {
            if (e != null) {
                var $target = $(e.target);
                if (!($target.closest("#" + this.id + this._$colType + "_CustomFDlg").length > 0 || $target.closest("#" + this.id + this._$colType + "_excelDlg").length > 0))
                    return;
            }            
            if (this._openedFltr) {
                if (!this._openedFltr.hasClass("e-dlgcustom")) {
                    this._openedFltr.fadeOut(300, function () {
                    });
                    this._listsWrap.ejWaitingPopup("hide");
                }
                else {
                    this._openedFltr.ejDialog("close");
                }
                !ej.isNullOrUndefined(this._cancelHandler) && this._cancelHandler();
                this.resetFilterModel();/*Reset private properties after filter closed*/
                this._ctrlInstance._$fDlgIsOpen = false;
            }
        },
        _setPosition: function (ele, pos) {
            ele.css("position", "absolute");
            ele.css("left", pos["X"]).css("top", pos["Y"]);                      
        },
        _setDisable: function () {
            var $clr = this._menuWrap.find("li[ejfnrole='clearfilter']"), $fltr = this._menuWrap.find("li[ejfnrole='filterpopup']");
            var $sort = this._menuWrap.find("li[ejfnrole *= 'sort']"), $checked = this._listsWrap.find("input").filter(":checked:not(.e-selectall)").length;
            !this._isFiltered ? $clr.addClass("e-disable-item") : $clr.removeClass("e-disable-item");
            if (this._showSort) {
                var sQM = ej.DataManager(this.sortedColumns).executeLocal(new ej.Query().where("field", "equal", this.fName));
                ( sQM.length && sQM[0]["direction"] == "ascending") ? $sort.filter("[ejfnrole='sortAsc']").addClass("e-disable-item") : $sort.filter("[ejfnrole='sortAsc']").removeClass("e-disable-item");
                (sQM.length && sQM[0]["direction"] == "descending") ? $sort.filter("[ejfnrole='sortDesc']").addClass("e-disable-item") : $sort.filter("[ejfnrole ='sortDesc']").removeClass("e-disable-item");
            }
            var $flteredList = $fltr.find(".aschild");
            if (this.cFilteredCols.length != 0 && $.inArray(this.fName,this.cFilteredCols) != -1) {
                for (var f = 0; f < this.filteredColumn.length; f++) {
                    if (this.filteredColumn[f].field == this.fName) {
                        if ($flteredList.find("#ejFiltercheck").length == 0) {
                            $flteredList.append("<input type='checkbox' id='ejFiltercheck' />");
                            $flteredList.find("#ejFiltercheck").ejCheckBox({ checked: true });
                            $flteredList.find("#ejFiltercheck").ejCheckBox("disable");
                        }
                        if ($fltr.find(".e-shadow .e-exceltick").length > 0)
                            $fltr.find(".e-shadow .e-exceltick").remove();
                        if (this.filteredColumn[f].field == this.fName && !ej.isNullOrUndefined(this.filteredColumn[f + 1]) && this.filteredColumn[f + 1].field == this.fName && (this._$foreignField && this.filteredColumn[f + 1].customFilter || !this._$foreignField)) {
                            if (this.filteredColumn[f].operator == "greaterthanorequal" && this.filteredColumn[f + 1].operator == "lessthanorequal")
                                $fltr.find(".e-shadow .e-list[ejvalue=between]").find("a").append("<span class='e-exceltick e-icon' />");
                            else
                                $fltr.find(".e-shadow .e-list[ejvalue=customfilter]").find("a").append("<span class='e-exceltick e-icon' />");
                        }
                        else if (this._$foreignField)
                            $fltr.find(".e-shadow .e-list[ejvalue=" + this.filteredColumn[f].actualFilterOperator + "]").find("a").append("<span class='e-exceltick e-icon' />");
                        else
                            $fltr.find(".e-shadow .e-list[ejvalue=" + this.filteredColumn[f].operator + "]").find("a").append("<span class='e-exceltick e-icon' />");
                        break;
                    }
                }
            }
            else {
                for (var f = 0; f < this.filteredColumn.length; f++) {
                    if (this.filteredColumn[f].field == this.fName) {
                        this._removeTick($fltr,$flteredList);
                        break;
                    }
                }
            }
            if (!this._isFiltered && $flteredList.find("#ejFiltercheck").length != 0) {
                 this._removeTick($fltr,$flteredList);
            }
            if (this._$colType == "boolean")
                this._menuWrap.find("li[aria-haspopup=true]").addClass("e-hide");            
            this._searchBox.val(""); this._searchBox.siblings().addClass("e-search").removeClass("e-cancel");
        },
        _removeTick: function($fltr,$flteredList){
            $flteredList.find("#ejFiltercheck").ejCheckBox("destroy");
            $fltr.find(".aschild #ejFiltercheck").remove();
            $fltr.find(".e-shadow .e-exceltick.e-icon").remove();
        },
        _createBtn: function (isCDlg) {
            var id = isCDlg ? this.id + this._$colType + "Custom" : this.id + this._$colType;
            var $divCon = ej.buildTag("div.e-btncontainer e-fields");
            var $div = ej.buildTag("div");
            $div.append(ej.buildTag("input#" + id + "_OkBtn.e-fltrbtn e-btnsub e-flat", {}, {}, { type: "button" })).append(ej.buildTag("input#" + id + "_CancelBtn.e-fltrbtn e-btncan e-flat", {}, {}, { type: "button" }));
            return $divCon.append($div);
        },
        _menuHandler: function (args) {
            var $ele = $(args.element);
            var role = $ele.attr("ejfnrole");
            var arg = {};
            if (role === "filterbgcolor" || role === "filterfgcolor") {
                var fDetails = { field: this.fName, operation: role, color: $(args.element).css('background-color')};
			    arg = { originalEvent: args.event, action: "filterbycolor", filterDetails: fDetails, tableID: this._$tableID }; 
                this._isFiltered = false;
            }
            else if (role == "clearfilter") {
                var ftrDetails = { field: this.fName, operator: "", value: "", predicate: "or" };
                arg = { originalEvent: args.event, fieldName: this.fName, action: "clearfiltering", filterDetails: ftrDetails, tableID: this._$tableID };
                var indx = $.inArray(this.fName, this.cFilteredCols);
                indx!=-1 && this.cFilteredCols.splice(indx, 1);
				var $cIndx = $.inArray(this.fName, this._columnsFiltered);
                $cIndx!=-1 && this._columnsFiltered.splice($cIndx, 1);
                if (this._initialFName == this.fName)
                    this._initialFName = null;
            }
            else if(role == "popup" || role == "filterpopup") {
                return;
            }
            else if (role == "operator") {
                this._openCustomFilter($ele.attr("ejvalue"));
            }
			else{
                var sOrder, sDetails;
				if(role == "sortAsc" || role == "sortDesc"){
					sOrder = role == "sortAsc" ? "ascending" : "descending";
					sDetails = { field: this.fName, direction: sOrder };
					arg = { originalEvent: args.event, action: "sorting", sortDetails: sDetails, tableID: this._$tableID };
				}
				else{
					sDetails = { field: this.fName, direction: sOrder, operation: role, color: $(args.element).css('background-color')};
					arg = { originalEvent: args.event, action: "sortbycolor", sortDetails: sDetails, tableID: this._$tableID }; 
				}
            }
            if (role != "operator") {
                this._filterHandler(arg);
                this.closeXFDialog();
            }
        },
        _searchBoxFocus: function (e) {
            var $target = $(e.target);
            if ($target.hasClass("e-cancel")) {
                $target.prev().val("");
                $target.next().addClass("e-cancel")
                $target.addClass("e-search");
                $target.prev().trigger("keyup");
            }
            if (e.type == "focusin") {
                $target.next().addClass("e-cancel");
                $target.next().removeClass("e-search");
            }
        },
        _search: function (e) {
            var enterText = e.target.value, args = {}, parsed, operator, $target = $(e.target);
            parsed = (this.getType() != "string" && parseFloat(enterText)) ? parseFloat(enterText) : enterText;
            operator ="contains" ;
            parsed = (parsed == "" || parsed == undefined) ? undefined : parsed;
            if (this._$colType == "boolean") {
                if (parsed != undefined && this.localizedLabels.True.toLocaleLowerCase().indexOf(parsed.toLowerCase()) != -1)
                    parsed = "true";
                else if (parsed != undefined && this.localizedLabels.False.toLocaleLowerCase().indexOf(parsed.toLowerCase()) != -1)
                    parsed = "false";
            }
            if (this._$colType == "date" || this._$colType == "datetime") {
                parsed = ej.parseDate(enterText, this.replacer(this._$format, /{0:|}/g, ""));
                operator = "equal";
                if (this._previousValue == null && parsed == null)
                    return;
            }
            this._previousValue = parsed;
            delay = this._dataSource instanceof ej.DataManager && (this._ctrlInstance._gridRecordsCount > this._ctrlInstance.model.filterSettings.maxFilterChoices) ? 1500 : 0;
            sender = { type: "filterchoicesearch", value: parsed, operator: operator, matchcase: ["date", "datetime"].indexOf(this._$colType) != -1 ? false : this._matchCase }
            this._processSearch(sender, delay);
            if ($target.val() == "") {
                $target.next().addClass("e-search");
                $target.next().removeClass("e-cancel");
            } else {
                $target.next().addClass("e-cancel");
                $target.next().removeClass("e-search");
            }
        },
        _processSearch: function (sender, delay) {
            if (!this._alreadySearchProcessed) {
                this._alreadySearchProcessed = true;
                this._startTimer(sender, delay);
            } else {
                this._stopTimer();
                this._startTimer(sender, delay);
            }
        },
        _startTimer: function (sender, delay) {
			proxy = this;
            this._timer = window.setTimeout(
                function () {
                    proxy._processListData(sender);
                }, delay)
        },
        _stopTimer: function () {
            if (this._timer != null)
                window.clearTimeout(this._timer);
        },
        _getLocalizedLabel: function (property) {
            return ej.getLocalizedConstants("ej.ExcelFilter", this._locale);
        },
        _getMenuData: function (type) {
            return type != undefined ? this[type + "MenuOpt"] : [];
        },
		_checkHtmlEncode: function(key){
           var isEncode = !ej.isNullOrUndefined(this._ctrlInstance.getColumnByField) ? this._ctrlInstance.getColumnByField(this.fName).disableHtmlEncode : false;
           var bool = !ej.isNullOrUndefined(isEncode) && isEncode  ? true : false;
           return bool;
        },
        /*CheckBox list*/
        _lsitBoxTemplate: function () {
            var helper = {}, temp = {};            
            helper[this.id + "isNotBlank"] = ej.proxy(this.isNotBlank, this);
            helper[this.id + "checkBlank"] = ej.proxy(this._checkBlank, this);
            helper[this.id + "_getValueData"] = ej.proxy(this._getValueData, this);            
            helper[this.id + "_checkBoxState"] = ej.proxy(this._setCheckState, this);          
            helper[this.id + "_htmlEncode"] = ej.proxy(this._checkHtmlEncode, this);    
            helper[this.id + "_genId"] = this._genCheckID;
            $.views.helpers(helper); 			
            var genID = this.id + this._$colType + "{{:~" + this.id + "_genId()}}";
            temp[this.id + this._$colType + "_listBox_Template"] = "{{if ~" + this.id + "checkBlank(key)}}<div class='e-ftrchk'><input type='checkbox' id='" + genID + "' value='{{html:~" + this.id + "_getValueData(key, items)}}' class='e-ftrchk' {{:~" + this.id + "_checkBoxState(~" + this.id + "_getValueData(key, items))}}/><label class='e-ftrchk' for='" + genID + "'>{{if ~" + this.id + "isNotBlank(key,'true')}} {{if ~" + this.id + "_htmlEncode(key)}} {{>key}} {{else}} {{:key}} {{/if}} {{else}} (Blanks) {{/if}}</label></div>{{/if}}";
            $.templates(temp);
        },
      
        _processListData: function (params) {
            var result, promise, args = {}, query = new ej.Query(), searchQuery = new ej.Query().requiresCount(), evtArgs = {}; this._searchCount = 0;
            var predicates = this._predicates[this._$key], pred;
			if(proxy.query._expands.length)
                query._expands = proxy.query._expands;
			var data = null, columnName = null, localJSON = null, result = null;
			if(ej.isNullOrUndefined(this._$foreignField && this._$foreignData)){
				data = this._dataSource; 
				columnName =  this.fName;
				localJSON = this._localJSON;
			}
			else{
				data = localJSON = this._$foreignData; 
				if(this._dataSource instanceof ej.DataManager && !(data instanceof ej.DataManager))
                    data = ej.DataManager(data);
				columnName = this._$foreignField;
			}
            for (var prop in predicates) {
                if (prop == this.fName)
                    continue;
                var obj = predicates[prop], from = obj["from"];
                if (from)
                    query.skip(from == "top" ? 0 : data.length - (data.length - obj["take"])).take(obj["take"]);
                else
                    pred = pred != undefined ? pred["and"](obj) : obj;
            }
            args.columnName = columnName;           
            query.requiresCount();
            if (this._dataSource instanceof ej.DataManager && !this._dataSource.dataSource.offline && this._ctrlInstance._gridRecordsCount > this._ctrlInstance.model.filterSettings.maxFilterChoices) {
                query.take(this.maxFilterChoices);
                this._onDemandSearch = true;
            }
		    pred && query.where(pred);
            ej.merge(query.queries, this.query.queries) || ej.merge(query._params, this.query._params)
            evtArgs.requestType = params ? params.type : "filterchoicerequest",evtArgs.filterModel = this, evtArgs.query = query, evtArgs.dataSource = data;
            if(evtArgs.requestType == "filterchoicesearch")
				evtArgs.queryParams = params;
			if (this._ctrlInstance._trigger(this._onActionBegin, evtArgs))
                return;
            if (!ej.isNullOrUndefined(this._searchHandler) && this._searchHandler.key.length) {
                var searchDetails = this._searchHandler;
                query.search(searchDetails.key, searchDetails.fields, searchDetails.operator || "contains", searchDetails.ignoreCase || true);
            }
            if (this.enableSelect)
                query.select(this.fName);
            if (params && params.type == "filterchoicesearch") {
                this._clearSearchValue = ej.isNullOrUndefined(params.value) ? true : false;
                args.type = params.type;
                args.value = params.value;
                if (this._$foreignField) query = searchQuery;
                params.value && query.where(columnName, params.operator, params.value, !params.matchcase);
                if (this._dataSource instanceof ej.DataManager && this._ctrlInstance._gridRecordsCount > this._ctrlInstance.model.filterSettings.maxFilterChoices) {
                    this._searchRequest = true;
					var type = this._$colType;
                    var dlgId = this.id + type + "_excelDlg";   
                    if($("#" + dlgId).is(":visible"))
                     this._listsWrap.ejWaitingPopup("show");
                    if (this._$foreignField) {
                        var frKeyData = this._$foreignData instanceof ej.DataManager ? this._$foreignData : ej.DataManager(this._$foreignData);
                        this._dataProcessing(frKeyData, query, args);
                    }
                    else
                        this._dataProcessing(this._dataSource, query, args);
                }
                else
                    this._dataProcessing(ej.DataManager(this._localJSON), query, args);
            }
            else if (!(this._dataSource instanceof ej.DataManager)) {
				var result = [];
                promise = ej.DataManager(this._dataSource).executeLocal(query);
                args.type = "filterchoicerequest";
                if (this._$foreignField)
                    this._filterForeignData(promise, args);
                else {
                    result = promise.result;
                    args.data = this._localJSON = this._currentData = result;
                    this._totalRcrd = promise.count;
                    this._setCheckBoxList(args);
                }
            }
            else {
                proxy = this; args.type = "filterchoicerequest";
                this._listsWrap.ejWaitingPopup("show");
                if (!this._reqInProgess) {
                    this._reqInProgess = true;
					if(this._$foreignField)
                        data = this._dataSource;
                    promise = data.executeQuery(query);
                    promise.done(function (e) {
                        if (proxy._$foreignField)
                            proxy._filterForeignData(e, args);
                        else {
                            result = e.result;
                            args.data = proxy._localJSON = proxy._currentData = result;
                            proxy._totalRcrd = e.count;
                            proxy._listsWrap.ejWaitingPopup("hide");
                            proxy._setCheckBoxList(args);;
                            proxy._reqInProgess = false;
                        }
                    });
                }
            }           
        },
        _dataProcessing: function (dataSource, query, args) {
            var result, promise;
            promise = dataSource.executeQuery(query);
            promise.done(function (e) {
                args.data = proxy._currentData = e.result;
                proxy._totalRcrd = proxy._searchCount = e.result.length;
                proxy._setCheckBoxList(args);
            });
        },
        _filterForeignData: function (fromPromise, args) {
            var custom = typeof args === "boolean", key = this._$foreignKey,
               field = this._$foreignField, type = this._$foreignKeyType,
                result, count, proxy = this, defaults = {}, pred, tmp, actuals, query = new ej.Query(),
                dm = this._$foreignData instanceof ej.DataManager ? this._$foreignData : ej.DataManager(this._$foreignData);
            if (!custom) {
                result = fromPromise.result, count = fromPromise.count;
                if (!!count)
                    query.where(this.getFilterFrom(this._$foreignData, result));
                if (!this._listsWrap.ejWaitingPopup("model.showOnInit"))
                    this._listsWrap.ejWaitingPopup("show");
            }
            else {
                tmp = fromPromise[0], defaults = fromPromise[0], actuals = fromPromise.slice();
                if (!!tmp)
                    this.closeXFDialog();
                pred = new ej.Predicate(field, tmp.operator, tmp.value, !tmp.matchcase);
                for (var i = 1, tmp, len = fromPromise.length; i < len; i++) {
                    tmp = fromPromise[i], pred = pred[tmp.predicate](field, tmp.operator, tmp.value, !tmp.matchcase);
                }
                query.where(pred);
            }
            query.select([key, field]);
            dm.executeQuery(query).done(function (e) {
                if (!custom) {
                    args.data = proxy._localJSON = proxy._currentData = e.result;
                    proxy._totalRcrd = count;
                    proxy._listsWrap.ejWaitingPopup("hide");
                    proxy._setCheckBoxList(args);
                    proxy._reqInProgess = false;
                } else {
                    var dst = ej.distinct(e.result, key, true), dst = 0 in dst ? dst : [{}];
                    var coll = dst.map(function (val, ind) {
                        return $.extend({}, defaults, { value: val[key], operator: "equal", actuals: actuals, type: type });
                    });
                    proxy.initiateFilter(coll);
                }
            });
        },
        _setCheckBoxList: function (args) {
            var evtArgs = {}, _blank ="", sortedData, flag, blank = this._blanks, $checked;
            evtArgs.requestType = args.type, evtArgs.dataSource = this._dataSource, evtArgs.filterModel = this;
            if (this._currentData.length != 0) {                
                sortedData = this.getDistinct(args.data, args.columnName, true, !!this._$foreignKey);
                flag = this._isFiltered;                
                this._actualCount = sortedData.length; sortedData.length = this._maxCount > this._actualCount ? this._actualCount : this._maxCount;               
                (this._onDemandSearch && this._actualCount == 1000) || this._actualCount >= this._maxCount ? this._openedFltr.find("div.e-status").removeClass("e-hide") : this._openedFltr.find("div.e-status").addClass("e-hide");
                this._islargeData = this._maxCount < this._actualCount ? true : false;
				this._filterdCol = ej.DataManager(this.filteredColumn).executeLocal(ej.Query().where("field", "equal", this.fName));               
				if ((args.type == "filterchoicesearch") && (!ej.isNullOrUndefined(args.value)))
                    this._listsWrap.find("div:first").html([this._selectAll, this._addToFilter, $.render[this.id + this._$colType + "_listBox_Template"](sortedData), this._addAtLast ? this.replacer(blank, /@@/g, this._setCheckState, this._empties.join(this._spliter)) : ""].join(""));                
                else 
                    this._listsWrap.find("div:first").html([this._selectAll, $.render[this.id + this._$colType + "_listBox_Template"](sortedData), this._addAtLast ? this.replacer(blank, /@@/g, this._setCheckState, this._empties.join(this._spliter)) : ""].join(""));                
                this._chkList = this._listsWrap.find("input:checkbox").not(".e-selectall,.e-addtofilter"), $inView = this._chkList.slice(0, 20);
                $inView.ejCheckBox({ change: ej.proxy(this._checkHandler, this) });
                $inView.siblings().height(14).width(14);
                this._listsWrap.find(".e-addtofilter").ejCheckBox({ change: ej.proxy(this._addToFilterHandler, this) });
                this._listsWrap.find(".e-addtofilter").attr("id", this.id + this._$colType + "AddToFilter");
                this._listsWrap.find(".e-selectall").ejCheckBox({ change: ej.proxy(this._selectAllHandler, this), enableTriState: this._interDeterminateState, beforeChange: this._selectAllBeforeHandler });
				this._listsWrap.find(".e-selectall").attr("id",this.id + this._$colType + "SelectAll");
                this._listsWrap.find(".e-selectall,.e-addtofilter").siblings().height(14).width(14);
				this._listsWrap.find(".e-selectall").closest("span").siblings("label").attr("for", this.id + this._$colType + "SelectAll");
            }
            else
            {
                this._listsWrap.find("div").first().html(ej.buildTag("div.e-ftrchk", this.localizedLabels.NoResult, {}, {}));
                this._chkList = this._listsWrap.find("input:checkbox").not(".e-selectall");
            }
            if (!ej.isNullOrUndefined(this._chkList))
                $checked = this._chkList.filter(":checked").length;
            if (this._isFiltered && this._searchRequest && $checked == 0)
                this._checkIsIndeterminate(args.columnName, this.filteredColumn);
            if (!this._isFiltered || this._actualCount == $checked)
                this._listsWrap.find(".e-selectall").ejCheckBox({ checked: true });
            else if ($checked > 0 || this._isIndeterminate && this._interDeterminateState)
                this._listsWrap.find(".e-selectall").ejCheckBox('model.checkState', 'indeterminate');
            $("#" + this.id + this._$colType + "_OkBtn").ejButton({ enabled: $checked != 0 });
            this._listsWrap.ejScroller({ scrollTop: 0 }).ejScroller("refresh");
             if(this._listsWrap.hasClass('e-waitingpopup'))
                this._listsWrap.ejWaitingPopup("hide");
            if (this._ctrlInstance._trigger(this._onActionComplete, evtArgs))
                return;
            this._isIndeterminate = false;
            this._checkedValue = [];
            if (args.type == "filterchoicerequest") {
                this._preChkList = this._chkList;
                this._checked = this._preChkList.filter(":checked");
            }
            if (this._listsWrap.find(".e-addtofilter").length)
                this._add = this._listsWrap.find(".e-addtofilter");
            else
                this._add = null;
        },
        _addToFilterHandler: function (args) {
            $("#" + this.id + this._$colType + "_OkBtn").ejButton({ enabled: args.isChecked || !!this._chkList.filter(":checked").length });
        },
        _checkIsIndeterminate: function (colName, filteredCol) {
            for (var i = 0 ; i < filteredCol.length; i++) {
                if (colName == filteredCol[i].field)
                    this._isIndeterminate = true;
            }
        },
        _createLiTag: function ($ul, menuData, isChild) {
            proxy = this;
            $.each(menuData, function (index, obj) {
                var $li = ej.buildTag("li", {}, {}, obj["htmlAttribute"] || (isChild && { "ejfnrole": "operator", "ejvalue": obj.value }) || {}), $child;
                var apd = (isChild && $.inArray(obj.value,proxy._noDlg)==-1) ? "..." : "";
                var $a = ej.buildTag("a", obj.text + apd, {}, {});
                obj["sprite"] != undefined && $a.append(ej.buildTag("span", {}, {}, { "class": obj["sprite"] }))
                if (obj["child"] != undefined){
                    if(obj.id != 3 && obj.id != 5)
                        $child = proxy._createLiTag(ej.buildTag("ul.e-shadow"), obj["child"], true);
                    else if(obj.id === 3 )
                        $child = proxy._createDivTag(ej.buildTag("ul.e-shadow"), obj["child"], true, "sort");
                    else
                        $child = proxy._createDivTag(ej.buildTag("ul.e-shadow"), obj["child"], true, "filter");
				}
                obj["child"] == undefined ? $ul.append($li.append($a)) : $ul.append($li.append($a).append($child))
                if ($.inArray(obj.value || (obj.htmlAttribute && obj.htmlAttribute.ejfnrole), proxy._sepAftr) != -1)
                    $ul.append(ej.buildTag("li.e-separator"));
            });
            return $ul;
        },
		
		_createDivTag: function ($ul, menuData, isChild, reqType) {
            var $li, $a, $div, bgColor = [], fgColor = [], avble = false, cellcolor = "", fontcolor = "", selCellHdr = "", selCellClr = "", selFontHdr = "", selFontClr = "";
            if (reqType == "sort") {
                cellcolor = this.localizedLabels.SortByCellColor;
                fontcolor = this.localizedLabels.SortByFontColor;
            }
            else{
                cellcolor = this.localizedLabels.FilterByCellColor;
                fontcolor = this.localizedLabels.FilterByFontColor;
            }
			selCellHdr = reqType + "colorhdr";
            selFontHdr = reqType + "fonthdr";
            selCellClr = reqType + "bgcolor";
            selFontClr = reqType + "fgcolor";
            ($ul.length > 0) && $ul.children().remove();
            if(menuData.length > 0){
			    for(var i = 0; i < menuData.length; i++){
				    for(var j = 0; j < bgColor.length; j++){
					    if(bgColor[j] == menuData[i].background){
						    avble = true;
						    break;
					    }
				    }
				    if(!avble && (!ej.isNullOrUndefined(menuData[i].background) && !menuData[i].background.startsWith('#6n'))) 
                        bgColor.push(menuData[i].background);
				    avble = false;
				    for(var j = 0; j < fgColor.length; j++){
					    if(fgColor[j] == menuData[i].foreground){
						    avble = true;
						    break;
					    }
				    }
				    if(!avble && (!ej.isNullOrUndefined(menuData[i].foreground) && !menuData[i].foreground.startsWith('#6n'))) 
                        fgColor.push(menuData[i].foreground);
				    avble = false;
			    }
                if(bgColor.length > 0){
                    $li = ej.buildTag("li.e-list e-bghdrcolor", "", "" , {"ejfnrole": selCellHdr });
                    $a = ej.buildTag("a.e-menulink", cellcolor, {});
                    $li.append($a);
                    $ul.append($li);
			        for(var i = 0; i < bgColor.length; i++){
                        $li = ej.buildTag("li.e-list e-valcolor", {}, {'background-color': bgColor[i]}, {"ejfnrole": selCellClr });
                        $ul.append($li);
			        }
                }
                if(fgColor.length > 0){
			        $li = ej.buildTag("li.e-list e-fghdrcolor", "", "" , {"ejfnrole": selFontHdr });
                    $a = ej.buildTag("a.e-menulink", fontcolor, {});
                    $li.append($a);
                    $ul.append($li);
                    for(var i = 0; i < fgColor.length; i++) {
                        $li = ej.buildTag("li.e-list e-valcolor", {}, {'background-color': fgColor[i]}, {"ejfnrole": selFontClr });
                        $ul.append($li);
                    }
                }
                (bgColor.length < 1 && fgColor.length < 1) ? $ul.parent().addClass("e-disable-item"): $ul.parent().removeClass("e-disable-item");
            }
            else {
                $ul.parent().addClass("e-disable-item");
            }
            return $ul;
        },
		
        _setCheckState: function (value) {           
            var val = value, fobj, splts = value.split(this._spliter), splen = splts.length, flag = false;           
            if (!this._isFiltered || this._searchCount)
                return "checked";
            else {
               
                while (splen--) { /*looped for split values*/
                    val = this.processValue(splts[splen]);

                    //Date and boolean will be checked as iteration due to 
                    if (this._$colType == "date" || this._$colType == "datetime" || this._$colType == "boolean") {
                        for (var i = 0, len = this._filterdCol.length; i < len; i++) {
                            if (this._$colType == "boolean" && val !== this._filterdCol[i].value)
                                continue;
                            if (this._$colType == "date" || this._$colType == "datetime") {
								var filterval = this._filterdCol[i].value;
                                var firstVal = this._$colType == "date" && val instanceof Date ? this._formatting(this._$format, new Date(val.getFullYear(), val.getMonth(), val.getDate()), this._locale) : this._formatting(this._$format, val, this._locale);
                                var secondVal = this._$colType == "date" && filterval instanceof Date ? this._formatting(this._$format, new Date(filterval.getFullYear(), filterval.getMonth(), filterval.getDate()), this._locale) : this._formatting(this._$format, filterval, this._locale);
                                if ((firstVal !== secondVal || this._filterdCol[i].operator != "equal") && !this._maxFilterCount)
                                    continue;
                                else {
                                    if (this._maxFilterCount && (this._onDemandSearch || this._islargeData)) {
                                        if (firstVal == secondVal) {
                                            this._checkedValue.push(firstVal);
                                            return ""
                                        }
                                        else if (this._checkedValue.indexOf(secondVal) == -1 || this._checkedValue.length == this._filterdCol.length)
                                            return "checked";
                                        else
                                            continue;
                                    }
                                }
                            }
                            return "checked";
                        }
                    }
                    else {
                        if (this._$colType == "string" && !ej.isNullOrUndefined(val)) {
                            if (this._filterdCol[0].value == val.toLowerCase())
                                val = val.toLowerCase();
                        }
                        var fQ = ej.DataManager(this._filterdCol).executeLocal(ej.Query().where("value", "equal", val).where("operator", "equal", "equal"));
                        if (fQ.length != 0) {
                            if (fQ[0].operator == "equal" &&(!ej.isNullOrUndefined(fQ[0].actualFilterOperator) && fQ[0].actualFilterOperator=="equal") && fQ[0].isCustom == true && this._ctrlInstance.model.currentViewData.length > 0)
                                return "checked";
                            else
                                return fQ[0]["isCustom"] === true ? "" : "checked";
                        }
                        else {
                            if ((this._onDemandSearch || this._islargeData) && this._maxFilterCount) {
                                var fltrQury = ej.DataManager(this._filterdCol).executeLocal(ej.Query().where("value", "equal", val).where("operator", "notequal", "equal"));
                                if (fltrQury.length == 0)
                                    return "checked";
                            }
                        }
                    }
                }
            }
        },
        _genCheckID: function () {
            return "CheckBox" + this.getIndex();
        },
        _formatting: function (format, value, locale) {

            if (this._$colType == "date" && format == "")
                format = "{0:MM/dd/yyyy hh:mm:ss}";

            if (this._$colType == "boolean")                 
                return value === "" ? "" : this.localizedLabels[value == true ? "True" : value == false ? "False" : ""];
           
            if (this._formatFiltering || this._$colType == "date") {
                var formatter = this._ctrlInstance.formatting;                
                return format != "" ? formatter(format, value, locale) : value;
            } 
        },
        _updateDateFilter: function (filter) {
            if (filter.type != "date" && !(filter.value instanceof Date))
                return filter;            
            filter.value = filter.value instanceof Date ? filter.value : ej.parseJSON({ val: filter.value }).val;
            return ["equal", "notequal"].indexOf(filter.operator) == -1 ? filter : this._setDateObject(filter);
        },        
        _checkHandler: function (args) {
            $("#" + args.model.id).prop("checked", args.isChecked);
            var $checkedlist = this._listsWrap.find("input.e-ftrchk").filter(":checked:not(.e-selectall,.e-addtofilter)"), clen = $checkedlist.length;
            var $selectall = this._listsWrap.find(".e-selectall"), canCheck;
            if (clen == this._chkList.length) {
                $selectall.prop("checked", true);
                canCheck = true;
            }
            else if (clen == 0) {
                $selectall.prop("checked", false);
                canCheck = false;
            }
            else if (args.isInteraction)
                $selectall.ejCheckBox('model.checkState', 'indeterminate')
            $selectall.ejCheckBox({ checked: canCheck });
            $("#" + this.id + this._$colType + "_OkBtn").ejButton({ enabled: (clen != 0) || (!ej.isNullOrUndefined(this._add) && this._add.prop("checked")) });
        },
        _selectAllBeforeHandler: function (args) {
            if (args.isChecked) {
                if (this.model.checkState == "indeterminate") {
                    args.cancel = true;
                    this.model.checkState = "uncheck";
                    this.option({ checkState: "check" })
                }
                else
                    this.checkState("uncheck");
            }
        },
        _selectAllHandler: function (args) {
            
            if (args.checkState=="check"){
                this._chkList.filter(":not(:checked)").ejCheckBox({ checked: args.isChecked, change: ej.proxy(this._checkHandler, this) });
                this._chkList.prop("checked", true);
            }
            else if (args.checkState == "uncheck") {
                this._chkList.filter(function () { if ($(this).hasClass("e-checkbox") && $(this).prop("checked")) return this; }).ejCheckBox({ checked: args.isChecked });
                this._chkList.prop("checked", false); this._chkList.removeAttr("checked");
            }
            $("#" + this.id + this._$colType + "_OkBtn").ejButton({ enabled: args.isChecked || (!ej.isNullOrUndefined(this._add )&& this._add.prop("checked")) });
        },
        /*Custom Dialog*/
        _renderCustomFDlg: function (type) {
            var dlgId = this.id + type + "_CustomFDlg";
            if ($("#" + dlgId).length)
                return;
            var $dlg = ej.buildTag("div#" + dlgId + ".e-excelfilter e-dlgcustom");
            $dlg.addClass(this._cssClass);
            this._renderCDlgContent($dlg, type);
            $dlg.ejDialog({ showOnInit: false, enableResize: false, enableModal: true, allowKeyboardNavigation: false, title: this._title, width: 370, content: "#" + this.id, enableRTL: this._ctrlInstance.model.enableRTL, closeIconTooltip: "Close", cssClass: "e-excelfilter e-customDlg" });
			$dlg.ejDialog("refresh");
        },

        _renderCDlgContent: function (content, type) {
            var $div1 = ej.buildTag("div.e-dlgfields",this.localizedLabels.Showrowswhere, {}, {});
            var $id = this.id + this._$colType;
            var $fset = ej.buildTag("fieldset.e-fieldset");
            var $op1 = ej.buildTag("tr.e-fields"), $op2 = ej.buildTag("tr.e-fields"), $op3 = ej.buildTag("tr.e-fields e-top");
            var $dp1 = ej.buildTag("input#" + $id + "_CustomDrop1"), $dp2 = ej.buildTag("input#" + $id + "_CustomDrop2"), $dp3 = ej.buildTag("input#" + $id + "_CustomDrop3");
            var $in1 = ej.buildTag("input#" + $id + "_CustomValue1.e-ejinputtext e-excustmfltr", {}, {}, { "type": "text" }), $in2 = ej.buildTag("input#" + $id + "_CustomValue2.e-ejinputtext e-excustmfltr", {}, {}, { "type": "text" }), $in3 = ej.buildTag("input#" + $id + "_CustomValue3.e-ejinputtext e-excustmfltr", {}, {}, { "type": "text" });
            var $pred = ej.buildTag("tr.e-predicate");
            var radioAnd = ej.buildTag("input#" + $id + "_CustomAndPredicate", {}, {}, { "type": "radio", "name": "predicate" , "value":"and" }), radioOr = ej.buildTag("input#" + $id + "_CustomOrPredicate", {}, {}, { "type": "radio", "name": "predicate", "value":"or" });
            var matchCase = ej.buildTag("input#" + $id + "_CustomMatchPredicate", {}, {}, { "type": "checkbox" });
            content.append($div1);
            var table = ej.buildTag("table.e-optable");

            $op1.append(ej.buildTag("td.e-operator").append($dp1))
                .append(ej.buildTag("td.e-value").append($in1));
            $pred.append(ej.buildTag("td", {}, {}, {}).append(radioAnd).append(ej.buildTag("label.e-caption", this.localizedLabels.PredicateAnd, {}, { "for": $id + "_CustomAndPredicate" }))
                .append(radioOr).append(ej.buildTag("label.e-caption", this.localizedLabels.PredicateOr, {}, { "for": $id + "_CustomOrPredicate" })));
            $op2.append(ej.buildTag("td.e-operator").append($dp2))
                .append(ej.buildTag("td.e-value").append($in2));
            table.append($op1)
            .append($pred)
            .append($op2);
			if(type == "string")
			    $pred.append(ej.buildTag("td", {}, {}, {}).append(matchCase).append(ej.buildTag("label.e-caption", this.localizedLabels.MatchCase, {}, { "for": $id + "_CustomMatchPredicate" })));
            if (type == "number" || type == "guid") {
                $op3.append(ej.buildTag("td.e-operator").append($dp3))
                .append(ej.buildTag("td.e-value").append($in3));
                table.append($op3)
            }
            $fset.append(ej.buildTag("legend"))
                .append(table)
            content.append(ej.buildTag("div.e-dlgfields").append($fset));
            content.append(ej.buildTag("div.e-dlgfields").append(this._createBtn(true)));
            content.appendTo("body");
            var uppertype = type.replace(type.charAt(0), type.charAt(0).toUpperCase());
            $([$dp1, $dp2]).ejDropDownList({ fields: { text: "text", value: "value" }, height: 27, width: 120, enableRTL: this._ctrlInstance.model.enableRTL });
            if (type == "number") {
				$([$dp1, $dp2]).ejDropDownList({ popupWidth: "170px" });
                $([$in1, $in2]).ejNumericTextbox({ showSpinButton: false, height: "27px",decimalPlaces : 2, width: "177px", enableRTL: this._ctrlInstance.model.enableRTL,watermarkText: this.localizedLabels.NumericTextboxWaterMark, focusOut: function(args){ if(this.model.decimalPlaces == 0) this.element.prev(".e-input").val(this.model.value); } });
            }
			else if (type == "guid") {
                $([$dp1, $dp2]).ejDropDownList({ popupWidth: "170px" });
                $($in1).css({"height":"22px","width":"175px" });
                $($in2).css({"height":"22px","width":"177px" });
            }
            else if (type == "date") {
				$([$dp1, $dp2]).ejDropDownList({ popupWidth: "170px" });
				$([$in1, $in2]).ejDatePicker({ "cssClass": this._ctrlInstance.model.cssClass, height: "27px", width: "177px", "enableRTL": this._ctrlInstance.model.enableRTL, watermarkText: this.localizedLabels.DatePickerWaterMark, locale: this._locale });
            }
            else if (type == "datetime") {
                $([$dp1, $dp2]).ejDropDownList({ popupWidth: "170px" });
                $([$in1, $in2]).ejDateTimePicker({ "cssClass": this._ctrlInstance.model.cssClass, height: "27px", width: "177px", "enableRTL": this._ctrlInstance.model.enableRTL, watermarkText: this.localizedLabels.DateTimePickerWaterMark, locale: this._locale });
            }
            else if (type == "string") {
                $([$in1, $in2]).ejAutocomplete({ "cssClass": this._ctrlInstance.model.cssClass, "enableRTL": this._ctrlInstance.model.enableRTL, enableDistinct: true, width: "177px", height: "27px", locale: this._locale });
            }
            $([radioAnd, radioOr]).ejRadioButton({ "cssClass": this._ctrlInstance.model.cssClass, "enableRTL": this._ctrlInstance.model.enableRTL });
            matchCase.ejCheckBox({ });
            $("#" + $id + "Custom_OkBtn").ejButton({ text: this._getDeprecatedLocalizedLabel("OK"), showRoundedCorner: true, width: "23.6%", click: ej.proxy(this._fltrBtnHandler, this), enabled: true });
            $("#" + $id + "Custom_CancelBtn").ejButton({ text: this.localizedLabels.Cancel, showRoundedCorner: true, width: "23.6%", click: ej.proxy(this.closeXFDialog, this) })
        },
                     
        _openCustomFilter: function (operator) {
            var oper = operator != "top10" ? this._$colType : operator, emptyOp = { text: "", value: "" }, query = this.query;
            var type = oper.replace(oper.charAt(0), oper.charAt(0).toUpperCase());
            var id = this.id + this._$colType;
            this.closeXFDialog();
            this._openedFltr = $("#" + id + "_CustomFDlg");
            var args = { requestType: "filterbeforeopen", filterModel: this, columnName: this.fName, columnType: this._$colType, isCustomFilter: true };
            if (this._ctrlInstance._trigger(this._onActionBegin, args))
                return;
            this._openedFltr.ejDialog("open");
            this._openedFltr.ejDialog({open: function(args){
				($("#" + id + "_CustomValue1").hasClass("e-autocomplete") || $("#" + id + "_CustomValue1").hasClass("e-datepicker") || $("#" + id + "_CustomValue1").hasClass("e-datetimepicker")) ? $("#" + id + "_CustomValue1").focus() : $("#" + id + "_CustomValue1").prev().focus();
			}});
            this._openedFltr.find("legend").html(this._displayName);            
            var sl = (["Number","Date"].indexOf(type) != -1) ? 6 : 5;
            var sliced = this.localizedLabels[type + "MenuOptions"].slice(0,sl); sliced.unshift(emptyOp);
            $("#" + id + "_CustomDrop1").ejDropDownList({ dataSource: sliced });
            $("#" + id + "_CustomDrop2").ejDropDownList({ dataSource: sliced });
			if (this._$colType == "number") {
                if(operator == "top10"){
                    this._openedFltr.find(".e-optable tr").not(".e-top").addClass("e-hide");   
                    this._openedFltr.find(".e-optable tr.e-top").removeClass("e-hide");
                    $("#" + id + "_CustomDrop3").ejDropDownList({ dataSource: this.localizedLabels[type + "MenuOptions"] });
                }
                else{                   
                    this._openedFltr.find(".e-optable tr.e-top").addClass("e-hide");
                    this._openedFltr.find(".e-optable tr").not(".e-top").removeClass("e-hide"); 
                }
            }
            else {
                this._openedFltr.find(".e-optable tr.e-top").addClass("e-hide");
                this._openedFltr.find(".e-optable tr").not(".e-top").removeClass("e-hide");
            }
            if(this._$colType == "string"){
				var fName = this._$foreignField ? this._$foreignField : this.fName;
				var data = this._$foreignData && this._$foreignField ? this._$foreignData : this._dataSource;
                this._openedFltr.find(".e-autocomplete").ejAutocomplete({
                    fields: { text: fName }, dataSource: data,query:query, focusIn: function (args) {
                        var type = this.element.closest("td").siblings().find(".e-dropdownlist").ejDropDownList("getSelectedValue");
                        var $matchCase = this.element.closest(".e-dialog-scroller").find(".e-checkbox").prop("checked");
						 this.model.caseSensitiveSearch = $matchCase;
						 this.model.filterType = type == "" ? this.model.filterType : type;
                    }
                });
            }
            if (this._$colType == "date" && this._$format != "")
                this._openedFltr.find(".e-datepicker").ejDatePicker({ dateFormat: this._$format.replace(/{0:|}/g, function () { return "" }), enableStrictMode: true });
            else if (this._$colType == "datetime" && this._$format != "")
                this._openedFltr.find(".e-datetimepicker").ejDateTimePicker({ dateTimeFormat: this._$format.replace(/{0:|}/g, function () { return "" }), enableStrictMode: true });
            this._setFilteredData(id, operator);
			if(!ej.isNullOrUndefined(this._customFilterHandler)) 
				this._customFilterHandler();
            var args = { requestType: "filterafteropen", filterModel: this, columnName: this.fName, columnType: this._$colType, isCustomFilter: true };
            
			if (this._ctrlInstance._trigger(this._onActionComplete, args))
                return;
        },
        
        _setFilteredData: function ($id, op) {
            var indx = $.inArray(this.fName, this.cFilteredCols);
            var fQM = [], optrs = [], fLen;
            var between = ["greaterthanorequal", "lessthanorequal"];
            if (op == "top10")
                return;
            if (indx != -1)
                fQM = ej.DataManager(this.filteredColumn).executeLocal(ej.Query().where("field", "equal", this.fName));
            if (indx != -1 && this._$foreignField)
                fQM = fQM[0]["actuals"];
            if (this._initialFName != null && this._initialFName == this.fName)
                fQM[0]["isCustom"] = true;
            fLen = fQM.length;
            var drops = this._openedFltr.find(".e-dropdownlist"), inputs = this._openedFltr.find(".e-value input.e-ejinputtext.e-input"), $pred = this._openedFltr.find(".e-predicate");            
            if (indx != -1 && fLen && fQM[0]["from"]!=undefined)
                optrs = [op, ""];
			else if(op == "between" && indx != -1 && fLen )
				optrs = [fQM[0]["operator"], !ej.isNullOrUndefined(fQM[1]) ? fQM[1]["operator"] : ""];
            else if (indx != -1 && fLen && fQM[0]["isCustom"])
                optrs = [(op != "customfilter" && indx != -1) ? op : fQM[0]["operator"], op == "customfilter" && fQM[1] ? fQM[1]["operator"] : ""];
			else if(indx == -1 && op == "customfilter") 
                optrs = ["equal", ""];
            else if (op == "between" || op == "customfilter")
                optrs = op != "customfilter" ? between : ["", ""];           
            else
                optrs = [op, ""];
           
            for (var i = 0; i < (indx != -1 ? fLen : 2) ; i++) {
                var opt = /\D*/.exec(optrs[i])[0];
                $(drops[i]).prop("value", opt);
                $(drops[i]).ejDropDownList("setSelectedValue", opt);
				 $(drops[i]).ejDropDownList({ change: function(arg){ 
					this.element.closest(".e-fields").find(".e-autocomplete").val("");
				 }});
				var value = (indx != -1 && fLen && fQM[i]["isCustom"] && (opt == (this._$foreignField ? fQM[i]["actualFilterOperator"] : fQM[i]["operator"]) || opt == "customfilter" || opt == "between")) ? this._$foreignField ? opt != "" ? fQM[i]["actualFilterValue"] : "" : fQM[i]["value"] : "";
                if ($(inputs[i]).hasClass("e-datepicker"))
                    $("#" + inputs[i].id).ejDatePicker("model.value", (indx != -1 && fLen && fQM[i]["isCustom"]) ? fQM[i]["value"] : null);
                else if ($(inputs[i]).hasClass("e-numerictextbox"))
                    $("#" + inputs[i].id).ejNumericTextbox("model.value", value);
                else if ($(inputs[i]).hasClass("e-datetimepicker"))
                    $(inputs[i]).ejDateTimePicker("model.value", value);
                else
                    $(inputs[i]).val(value);
                var $pre = (indx != -1 && fLen && fQM[i]["isCustom"] && fQM[i]["predicate"] != undefined) ? this._$foreignField ? fQM[i]["actualPredicate"] : fQM[i]["predicate"] : "and";
				$pred.find("input[value=" + $pre + "]").ejRadioButton({checked:  true});
				if(this._$colType == "string"){
				    var $match = (indx != -1 && fLen && fQM[i]["isCustom"]) ? fQM[i]["matchcase"] : this._matchCase;
					$pred.find("input.e-js[type='checkbox']").ejCheckBox({checked: $match});
				}
				this._openedFltr.find(".e-value input:visible:eq(0)").select();
            }            
        },
        _setDateObject: function (filterObject) {
            if (filterObject.value != null) {
                var $fltrVal = filterObject.value;
                var $prevObj = $.extend(true, {}, filterObject);
                var $nextObj = $.extend(true, {}, filterObject);                
                var $prevDate = new Date($prevObj.value.setSeconds($prevObj.value.getSeconds() - 1));
                var $nextDate = new Date($nextObj.value.setSeconds($nextObj.value.getSeconds() + 2));
                filterObject.value = new Date(filterObject.value.setSeconds($nextObj.value.getSeconds() - 1));                
                $prevObj.value = $prevDate;
                $nextObj.value = $nextDate;
                if (filterObject.operator == "equal") {
                    $prevObj.operator = "greaterthan";
                    $prevObj.predicate = "and";
                    $nextObj.operator = "lessthan";
                    $nextObj.predicate = "and";
                } else if (filterObject.operator == "notequal") {
                    $prevObj.operator = "lessthanorequal";
                    $prevObj.predicate = "or";
                    $nextObj.operator = "greaterthanorequal";
                    $nextObj.predicate = "or";
                }
                var predicate = ej.Predicate($prevObj.field, $prevObj.operator, $prevObj.value, false);
                predicate = predicate[$nextObj.predicate]($nextObj.field, $nextObj.operator, $nextObj.value, false);
                filterObject.ejpredicate = predicate; filterObject.type = "date";
                return filterObject;
            }
            else
                return filterObject;
        },
        _getCDlgFields: function () {
            var dropDowns = this._openedFltr.find(".e-dropdownlist"), defaults;
            var $match = this._openedFltr.find(".e-checkbox"), matchcase = true,valueColl = [];
            var $inputs = this._openedFltr.find(".e-value input.e-ejinputtext.e-input");
            var $ginputs = this._openedFltr.find(".e-value input"),
                $pred = this._openedFltr.find(".e-predicate  div[aria-checked = true]").find("input[type ='radio']").val()
            $.inArray(this.fName, this.cFilteredCols) == -1 && this.cFilteredCols.push(this.fName);

            for (var i = 0,len = dropDowns.length; i < len; i++) {
                var dvalue = $(dropDowns[i]).ejDropDownList("getSelectedValue"), value;
                if (this._$colType == "number")
                    value = parseFloat($inputs.eq(i).ejNumericTextbox("model.value"));
				if(this._$colType == "guid")
                    value = $ginputs.eq(i).val();
                if (this._$colType == "string") {
                    value = $inputs.eq(i).val();
                    matchcase = $match.is(":checked");
                }
                if (this._$colType == "date") 
                    value = $inputs.eq(i).ejDatePicker("model.value");
                if (this._$colType == "datetime")
                    value = $inputs.eq(i).ejDateTimePicker("model.value");

                defaults = { field: this.fName, predicate: i == 1 ? $pred : "or", matchcase: matchcase, isCustom: true };
                if (dvalue == "top" || dvalue == "bottom") {
                    valueColl.push($.extend(true, { value: "", operator: "notequal", take: value, from: dvalue }, defaults));
                }
                else if (dvalue != "") {
                    if (this._empties.indexOf(value + "") > -1 || (this._$colType == "number" && isNaN(value))) {
                        var cols = this.iterateAndGetCollection(this._empties.join(this._spliter), $.extend({}, defaults, { predicate: dvalue.toLowerCase() === "notequal" ? "and" : "or", operator: dvalue.toLowerCase() }));
                        var pred = this.generatePredicate(cols);
                        valueColl.push($.extend({}, defaults, { ejpredicate: pred, operator: dvalue.toLowerCase() }));
                    }
                    else {
                        var filterObj = {}; $.extend(true, filterObj, { value: value, operator: dvalue.toLowerCase(), isCustom: true, actualFilterOperator: dvalue.toLowerCase(), actualFilterValue: value, actualPredicate: defaults.predicate }, defaults);
                        if (this._$colType == "date")
                            filterObj.type = "date";
                        valueColl.push((this._$colType == "date" && ["equal", "notequal"].indexOf(dvalue.toLowerCase()) != -1) ? this._setDateObject(filterObj) : filterObj);
                    }
                }
                else
                    break;
            }
            if (this._$foreignField == undefined)
                this.initiateFilter(valueColl);
            else 
                this._filterForeignData(valueColl, true);            
        },
      
        _fltrBtnHandler: function (args) {
            var matchcase, valColl = [], arg = {}, predicate, fObj = {}, optr = "", checked = [], unchecked;
            this._maxFilterCount = false;
            if (this._clearSearchValue)
                this._searchCount = 0;
            if (!this._openedFltr.hasClass("e-dlgcustom")) {
                if (!this._isFiltered && this._listsWrap.find(".e-selectall").ejCheckBox("model.checked") && (this._searchCount == 0 || (this._add && this._add.prop("checked"))))
                    return this.closeXFDialog();                                  
                if (this._onDemandSearch || this._islargeData) {
                    if (this._listsWrap.find("input.e-ftrchk").filter(":checked:not(.e-selectall)").length < this._listsWrap.find("input.e-ftrchk").filter(":not(:checked):not(.e-selectall)").length || this._listsWrap.find(".e-selectall").ejCheckBox("model.checked")) {
                        checked = this._listsWrap.find("input.e-ftrchk").filter(":checked:not(.e-selectall)");
                        optr = "equal";
                    }
                    else {
                        checked = this._listsWrap.find("input.e-ftrchk").filter(":not(:checked):not(.e-selectall)");
                        optr = "notequal";
                        this._maxFilterCount = true;
                    }
                }
                else {
                    var chkdata = this._chkList.filter(":checked"), unchkdata = this._chkList.filter(":not(':checked')");
                    if ((this._add && this._add.prop("checked"))) {
                        if (unchkdata.length)
                            unchecked = unchkdata;
                        checked = this._checked.length == 0 ? this._preChkList : this._checked;
                        if (chkdata.length && this._checked.length != 0)
                            ej.merge(checked, chkdata);
                    }
                    else
                        checked = this._listsWrap.find("input.e-ftrchk").filter(":checked:not(.e-selectall,.e-addtofilter)");
                    optr = this._colType == "string" ? "startswith" : "equal";
                }
                var len = checked.length, cVal, type = this.getType();
                var _isCase = this._colType == "string" ? this._matchCase : true;
                var defaults = this._maxFilterCount ? { field: this.fName, predicate: "and", operator: optr, matchcase: _isCase } : { field: this.fName, predicate: "or", operator: optr, matchcase: _isCase };
                for (var i = 0; i < len; i++) {
                    if (!ej.isNullOrUndefined(unchecked)) {
                        for (var j = 0; j < unchecked.length; j++) {
                            var flag = 0;
                            if (checked[i].value == unchecked[j].value) {
                                flag = 1;
                                break;
                            }
                        }
                    }
                    if (flag)
                        continue;
                    cVal = checked[i].value;
                    if (this.enableNormalize && cVal.indexOf(this._spliter) != -1) {
                        ej.merge(valColl, this.iterateAndGetCollection(cVal, defaults));
                        continue;
                    }
                    cVal = this.processValue(cVal, type);                    
                                        
                    $.extend(true, fObj, { value: cVal }, defaults);
                                                            
                    for (var j = 0; j < valColl.length; j++) {
                        var count = 0;
                        if (valColl[j].value == cVal) {
                            count = 1;
                            break;
                        }
                    }
                    if (count)
                        continue;

                    valColl.push(type == "date" ? this._setDateObject(fObj) : fObj);
                                                             
                    fObj = {};
                }
                var cIndex = $.inArray(this.fName, this.cFilteredCols);
                if(cIndex != -1)
                    this.cFilteredCols.splice(cIndex, 1);
                if (this._isFiltered && this._searchRequest) {
                    this._checkIsIndeterminate(this.fName, this.filteredColumn);
                    if (this._isIndeterminate) {
                        ej.merge(valColl, this.filteredColumn);
                        valColl = ej.distinct(valColl, "value", true);
                        this._searchRequest = false;
                    }          
                }
                this.initiateFilter(valColl);
            }
            else {
                valColl = this._getCDlgFields();
                $.inArray(this.fName, this.cFilteredCols) == -1 && valColl[0] && this.cFilteredCols.push(this.fName);
            }
        },
        initiateFilter: function (valColl) {
            var firstVal = valColl[0], predicate;
            if (!ej.isNullOrUndefined(firstVal)) {
                isTake = firstVal["from"];
                predicate = firstVal["ejpredicate"] ? firstVal["ejpredicate"] : ej.Predicate(firstVal.field, firstVal.operator, firstVal.value, !firstVal.matchcase);
                for (var j = 1, jlen = valColl.length; j < jlen; j++) {
                    predicate = valColl[j].ejpredicate != undefined ? predicate[valColl[j].predicate](valColl[j].ejpredicate) : predicate[valColl[j].predicate](valColl[j].field, valColl[j].operator, valColl[j].value, !valColl[j].matchcase);
                }
                arg = { action: "filtering", filterCollection: valColl, fieldName: this.fName, ejpredicate: predicate, tableID: this._$tableID};
                if (this._predicates[this._$key] == undefined)
                    this._predicates[this._$key] = {};
                this._predicates[this._$key][this.fName] = !isTake ? predicate : { from: firstVal["from"], take: firstVal["take"] };
                if (!this._openedFltr.hasClass("e-dlgcustom") && this._listsWrap.find(".e-selectall").ejCheckBox("model.checked") && (!this._searchCount || ((this._add && this._add.prop("checked")) && (this._preChkList.filter(":not(':checked')").length == 0 || this._checked.length == 0)) || (valColl.length == this._preChkList.length)) && $.inArray(this.fName, this._columnsFiltered) != -1)
                    arg = { action: "clearfiltering", filterDetails: { field: this.fName, operator: "", predicate: "or", value: "" }, fieldName: this.fName, tableID: this._$tableID }
                if ($.inArray(this.fName, this._columnsFiltered) == -1)
                    this._columnsFiltered.push(this.fName);                
                this._filterHandler(arg);
            }
            this.closeXFDialog();
        },        
		/*Util method to perform formatted group on the inputted json*/
        getDistinct: function (json, field, fullRecord, redundancy) {
		    var lookup = {}, len = json.length, result = [], current, value, fd;

		    while (len--) {
		        current = json[len], value = ej.getObject(field, current), fd = value;
            if (!ej.isNullOrUndefined(current)) {
		        if (this.enableNormalize)
		            fd = this._formatting(this._$format, value, this._locale);

		        current["ejvalue"] = fd;

		        if (redundancy || !(value in lookup))
		            result.push(fullRecord ? current : value);

		        lookup[value] = true;
		    }
         }

		    result = ej.group(ej.mergeSort(result, field), "ejvalue"); /* sort with field and group with ejvalue */

		    return result;
		},
        /*Util method to split string and build filterobject collection */
		iterateAndGetCollection: function (valuestring, defaults) {
		    var splts = valuestring.split(this._spliter), len = splts.length, result = [], value;

		    while (len--) {
		        value = this.processValue(splts[len]);		       

		        result.push($.extend(true, { value: value }, defaults));
		    }

		    return result;
		},
        /*Util method to perform type conversion*/
		processValue: function (val, type/* optional */) {		    
		     type = type || this.getType(); type = this._empties.indexOf(val) != -1 ? "empty" : type; val = val === this.guid ? this._blankValue + "" : val;
		    switch (type) {
		        case "empty":/*Handle blanks*/
		            val = val == "null" ? null : val == "undefined" ? undefined : "";
		            break;
		        case "date":
		        case "datetime":
		            val = new Date(val);
		            break;
		        case "number":
		            val = +val;
		            break;
		        case "boolean":		           
		            val = (!isNaN(val) && typeof (val) == "string") ? ej.parseInt(val) != 0 : val === "true" ? true : false;
		            break;
		    }		    		      
		    return val;
		},
		getType: function () {
		    return !ej.isNullOrUndefined(this._$foreignField) ? this._$foreignKeyType : this._$colType;
		},
		replacer: function (input, pattern, processor, params) {
		    if (typeof processor == "function")
		        processor = processor.call(this, params)
		   return input.replace(pattern, processor);
		},
        _virtualize: function (e) {
            var height = $("#" + this.id + this._$colType + "_CheckBoxList").height();
            var chks = this._chkList.not(".e-checkbox").filter(function () { if (this.offsetTop > e.scrollTop - this.offsetHeight && e.scrollTop + height+70 > this.offsetTop + this.offsetHeight) return this; });
            if (chks.length == 0) return;
            chks.filter(":checked").ejCheckBox({ checked: true }); chks.filter(":not(:checked)").ejCheckBox({ checked: false });
            chks.ejCheckBox({ change: ej.proxy(this._checkHandler, this) });
            var scrollObj = this._listsWrap.ejScroller('instance');            
            scrollObj.refresh();
        },
        /*Method to reset private properties*/
        resetFilterModel: function (destroy) {
            this._blank = undefined;
            this._addAtLast = false;
            this._isFiltered = false;
            this._searchCount = 0;
        },
        resetExcelFilter: function (template) {
            var _i, _type, _id = this.id,_len, _$id;
            this._predicates = [];          
            this.cFilteredCols = [];
            this.resetFilterModel();
            for (_i = 0, _len = this._posType.length; _i < _len; _i++) {
                _type = this._posType[_i], _$id = _id + _type;
                var cDlg = $("#" + _$id + "_CustomFDlg");               
                $("#" + _$id + "_CheckBoxList").ejWaitingPopup("destroy"); $("#" + _$id + "_excelDlg").remove();
                cDlg.find(".e-dropdownlist").ejDropDownList("destroy");
                cDlg.find(".e-button").ejButton("destroy");
                if (_type == "string" || _type == "boolean") cDlg.find(".e-autocomplete").ejAutocomplete("destroy");
                if (_type == "number") cDlg.find(".e-numerictextbox").ejNumericTextbox("destroy");
                if (_type == "date") cDlg.find(".e-datepicker").ejDatePicker("destroy");
                cDlg.ejDialog("destroy");
                $("#" + _$id + "_CustomFDlg").remove();
            }
        },
        _wireEvents: function () {
            this._ctrlInstance._on(this._dialogContainer, "focus click", ".e-searchbox", ej.proxy(this._searchBoxFocus, this));
            this._ctrlInstance._on(this._dialogContainer, "keyup", ".e-searchbox input", ej.proxy(this._search, this));
        }
    };

    ej.ExcelFilter.valueDelimiter = "@|@";
    ej.ExcelFilter.Locale = ej.ExcelFilter.Locale || {};

    ej.ExcelFilter.Locale["default"] = ej.ExcelFilter.Locale["en-US"] = {
        SortNoSmaller: "Sort Smallest to Largest",
        SortNoLarger: "Sort Largest to Smallest",
        SortTextAscending: "Sort A to Z",
        SortTextDescending: "Sort Z to A",
        SortDateOldest: "Sort by Oldest",
        SortDateNewest:"Sort by Newest",
		SortByColor: "Sort By Color",
        SortByCellColor: "Sort by Cell Color",
        SortByFontColor: "Sort by Font Color",
        FilterByColor: "Filter By Color",
		CustomSort: "Custom Sort",
        FilterByCellColor: "Filter by Cell Color",
        FilterByFontColor: "Filter by Font Color",
        ClearFilter: "Clear Filter",
        NumberFilter: "Number Filters",
		GuidFilter: "Guid Filters",
        TextFilter: "Text Filters",
        DateFilter: "Date Filters",
        DateTimeFilter: "Date Time Filters",
        SelectAll: "Select All",
        Blanks: "Blanks",
		Search:"Search",
        Showrowswhere:"Show rows where",
		NumericTextboxWaterMark:"Enter value",
        StringMenuOptions: [{ text: "Equal", value: "equal" }, { text: "Not Equal", value: "notequal" }, { text: "Starts With", value: "startswith" }, { text: "Ends With", value: "endswith" }, { text: "Contains", value: "contains" }, { text: "Custom Filter", value: "customfilter" }],
        NumberMenuOptions: [{ text: "Equal", value: "equal" }, { text: "Not Equal", value: "notequal" }, { text: "Less Than", value: "lessthan" }, { text: "Less Than Or Equal", value: "lessthanorequal" }, { text: "Greater Than", value: "greaterthan" }, { text: "Greater Than Or Equal", value: "greaterthanorequal" }, { text: "Between", value: "between" }, { text: "Custom Filter", value: "customfilter" }],
        GuidMenuOptions: [{ text: "Equal", value: "equal" }, { text: "Not Equal", value: "notequal" }, { text: "Custom Filter", value: "customfilter" }],
		DateMenuOptions: [{ text: "Equal", value: "equal" }, { text: "Not Equal", value: "notequal" }, { text: "Less Than", value: "lessthan" }, { text: "Less Than Or Equal", value: "lessthanorequal" }, { text: "Greater Than", value: "greaterthan" }, { text: "Greater Than Or Equal", value: "greaterthanorequal" }, { text: "Between", value: "between" }, { text: "Custom Filter", value: "customfilter" }],
		DatetimeMenuOptions: [{ text: "Equal", value: "equal" }, { text: "Not Equal", value: "notequal" }, { text: "Less Than", value: "lessthan" }, { text: "Less Than Or Equal", value: "lessthanorequal" }, { text: "Greater Than", value: "greaterthan" }, { text: "Greater Than Or Equal", value: "greaterthanorequal" }, { text: "Between", value: "between" }, { text: "Custom Filter", value: "customfilter" }],
		Top10MenuOptions: [{ text: "Top", value: "top" }, { text: "Bottom", value: "bottom" }],
        title:"Custom Filter",
        PredicateAnd: "AND",
        PredicateOr: "OR",
        OK: "OK",
        MatchCase: "Match Case",
        Cancel: "Cancel",
        NoResult: "No Matches Found",
        CheckBoxStatusMsg: "Not all items showing",
        DatePickerWaterMark: "Select date",
        DateTimePickerWaterMark: "Select date time",
		True: "true",
        False: "false",
        AddToFilter: "Add current selection to filter"
    };

})(jQuery, Syncfusion);