var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function ($) {
    var RecurrenceEditor = (function (_super) {
        __extends(RecurrenceEditor, _super);
        function RecurrenceEditor(element, options) {
            _super.call(this);
            this.defaults = {
                frequencies: ["never", "daily", "weekly", "monthly", "yearly", "everyweekday"],
                firstDayOfWeek: null,
                enableSpinners: true,
                startDate: new Date(),
                locale: "en-US",
                enableRTL: false,
                value: "",
                dateFormat: "",
                selectedRecurrenceType: 0,
                minDate: new Date(1900, 1, 1),
                maxDate: new Date(2099, 12, 31),
                cssClass: "",
                change: null,
                create: null
            };
            this.dataTypes = {
                frequencies: "array",
                enableSpinners: "boolean",
                enableRTL: "boolean",
            };
            this.rootCSS = "e-recurrenceeditor";
            this.PluginName = "ejRecurrenceEditor";
            this._id = "null";
            this.validTags = ["div"];
            this.model = this.defaults;
            if (element) {
                this._id = element[0].id;
                if (!element["jquery"])
                    element = $('#' + element);
                if (element.length) {
                    return $(element).ejRecurrenceEditor(options).data(this.PluginName);
                }
            }
        }
        RecurrenceEditor.prototype.setModel = function (opt, forceSet) {
            this.setModel(opt, forceSet);
        };
        RecurrenceEditor.prototype.option = function (opt, forceSet) {
            this.option(opt, forceSet);
        };
        RecurrenceEditor.prototype._setModel = function (options) {
            var flag = false;
            for (var key in options) {
                switch (key) {
                    case "frequencies":
                        this.model.frequencies = options[key];
                        flag = true;
                        break;
                    case "firstDayOfWeek":
                        this.model.firstDayOfWeek = this._firstDayOfWeek = options[key];
                        flag = true;
                        break;
                    case "enableSpinners":
                        this.model.enableSpinners = options[key];
                        flag = true;
                        break;
                    case "startDate":
                        if ($.type(options[key]) == "string")
                            this._currentDateFormat(this.model.dateFormat);
                        else if ($.type(options[key]) == "function" && $.type(ej.util.getVal(options[key])) == "string")
                            this.model.startDate = ej.parseDate(this.model.startDate.toString(), this._datepattern());
                        ((this.model.startDate < this.model.minDate) ? this.model.startDate = this.model.minDate : "");
                        ((this.model.startDate > this.model.maxDate) ? this.model.startDate = this.model.maxDate : "");
                        this._recurrenceContent.find('.recurstartdate').ejDatePicker("option", "value", this.model.startDate);
                        break;
                    case "locale":
                        this.model.locale = options[key];
                        flag = true;
                        break;
                    case "enableRTL":
                        this.model.enableRTL = options[key];
                        this._recurrenceLayout.addClass('e-rtl');
                        break;
                    case "value":
                        this.model.value = options[key];
                        break;
                    case "dateFormat":
                        this.model.dateFormat = options[key];
                        this._recurrenceContent.find('.recurstartdate').ejDatePicker("option", "dateFormat", this.model.dateFormat);
                        this._recurrenceContent.find('.until').ejDatePicker("option", "dateFormat", this.model.dateFormat);
                        break;
                    case "selectedRecurrenceType":
                        this.model.selectedRecurrenceType = options[key];
                        this._recurrenceLayout.find('.e-recurrencetype').ejDropDownList({ selectedItemIndex: this.model.selectedRecurrenceType });
                        break;
                    case "minDate":
                    case "maxDate":
                        this._currentDateFormat(this.model.dateFormat);
                        this._recurrenceContent.find('.recurstartdate').ejDatePicker({ minDate: this.model.minDate, maxDate: this.model.maxDate });
                        break;
                    case "cssClass":
                        this.model.cssClass = options[key];
                        this.element.removeClass(this.model.cssClass).addClass(options[key]);
                        break;
                }
                if (flag == true)
                    this._render();
            }
        };
        RecurrenceEditor.prototype._init = function () {
            if (!ej.isNullOrUndefined(this.element))
                this._render();
        };
        RecurrenceEditor.prototype._destroy = function () {
            this.element.off();
            var $formElements = this.element.find('.e-datepicker,.e-dropdownlist');
            for (var index = 0; index < $formElements.length; index++) {
                var $element = $($formElements[index]);
                if ($element.hasClass('e-datepicker'))
                    $element.ejDatePicker("destroy");
                else if ($element.hasClass('e-dropdownlist'))
                    $element.ejDropDownList("destroy");
            }
            this.element.empty().removeClass("e-recurrenceeditor");
        };
        RecurrenceEditor.prototype._render = function () {
            $("#" + this._id + "recurrenceeditor").remove();
            this._currentDateFormat(this.model.dateFormat);
            this._initializePrivateProperties();
            var hasScrollbar = (typeof window.innerWidth === 'number') && window.innerWidth > document.documentElement.clientWidth;
            this._mediaQuery = (this._browserInfo.name == "msie" && parseInt(this._browserInfo.version, 10) <= 8) ? false : (document.documentElement.clientWidth + (hasScrollbar ? 17 : 0) < 361 || ej.isMobile());
            this.model.frequencies = this.model.frequencies.toString().toLowerCase().split(",");
            for (var i = 0; i < this.model.frequencies.length; i++) {
                if (this.model.frequencies[i] == "everyweekday")
                    this.model.frequencies[i] = "EveryWeekDay";
                else
                    this.model.frequencies[i] = this.model.frequencies[i].replace(/^./, function (str) { return str.toUpperCase(); });
            }
            this._renderRecurrenceEditor();
        };
        RecurrenceEditor.prototype._initializePrivateProperties = function () {
            this._rRule = {};
            this.flag = true;
            this._subControlChange = false;
            this._culture = ej.preferredCulture(this.model.locale);
            this._dayNamesArray = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
            this._firstDayOfWeek = (this.model.firstDayOfWeek != null) ? (typeof this.model.firstDayOfWeek == "string") ? this._dayNamesArray.indexOf(this.model.firstDayOfWeek.toString().toLowerCase()) : this.model.firstDayOfWeek : this._culture.calendar.firstDay;
            this._monthNames = this._culture.calendar.months.names;
            this._pattern = this._culture.calendar.patterns;
            this._browserInfo = ej.browserInfo();
            this._dayNamesValue = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
            this._dayNames = [];
            this._dayShortNames = [];
            this._dayFullNames = [];
            var index = this._firstDayOfWeek;
            do {
                if (index > 6)
                    index = 0;
                this._dayFullNames.push(this._culture.calendar.days.names[index]);
                this._dayShortNames.push(this._culture.calendar.days.namesAbbr[index]);
                this._dayNames.push(this._dayNamesValue[index]);
                index++;
            } while (this._dayNames.length < 7);
            this._mediaQuery = false;
        };
        RecurrenceEditor.prototype._currentDateFormat = function (option) {
            var minDate, maxDate;
            if (!ej.isNullOrUndefined(option) && ($.type(this.model.startDate) != "date" || $.type(this.model.minDate) != "date" || $.type(this.model.maxDate) != "date")) {
                var date = ej.parseDate(this.model.startDate.toString(), this.model.dateFormat);
                minDate = ej.parseDate(this.model.minDate.toString(), this.model.dateFormat);
                maxDate = ej.parseDate(this.model.maxDate.toString(), this.model.dateFormat);
                this.model.startDate = ((!ej.isNullOrUndefined(date)) ? date : ((new Date(this.model.startDate.toString()).toString() == "Invalid Date" || new Date(this.model.startDate.toString()).toString() == "NaN") ? this._dateConvert(this.model.startDate) : new Date(this.model.startDate.toString())));
                this.model.minDate = (!ej.isNullOrUndefined(minDate)) ? minDate : ((new Date(this.model.minDate.toString()).toString() == "Invalid Date" || new Date(this.model.minDate.toString()).toString() == "NaN") ? this._dateConvert(this.model.minDate) : new Date(this.model.minDate.toString()));
                this.model.maxDate = (!ej.isNullOrUndefined(maxDate)) ? maxDate : ((new Date(this.model.maxDate.toString()).toString() == "Invalid Date" || new Date(this.model.maxDate.toString()).toString() == "NaN") ? this._dateConvert(this.model.maxDate) : new Date(this.model.maxDate.toString()));
            }
            else if (option == "MM/dd/yyyy" && ($.type(this.model.startDate) != "date" || $.type(this.model.minDate) != "date" || $.type(this.model.maxDate) != "date")) {
                var currentDate = ej.parseDate(this.model.startDate.toString(), option);
                minDate = ej.parseDate(this.model.minDate.toString(), option);
                maxDate = ej.parseDate(this.model.maxDate.toString(), option);
                this.model.startDate = (!ej.isNullOrUndefined(currentDate)) ? currentDate : this.model.startDate;
                this.model.minDate = (!ej.isNullOrUndefined(minDate)) ? minDate : this.model.minDate;
                this.model.maxDate = (!ej.isNullOrUndefined(maxDate)) ? maxDate : this.model.maxDate;
            }
        };
        RecurrenceEditor.prototype._renderRecurrenceEditor = function () {
            this._recurrenceLayout = ej.buildTag('div#' + this._id + 'recurrenceeditor', "", {}, {});
            if (this.model.enableRTL)
                this._recurrenceLayout.addClass('e-rtl');
            var $recurWind = "<table style='width:100%'><tr><td style='width:20%'><div class='e-textlabel'>" + this._getLocalizedLabels("Repeat") + ":</div></td><td><input class='e-recurrencetype' id='" + this._id + "_recurrenceType' type='text' name='RecurrenceType' value='' /></td></tr></table><div id='" + this._id + "_recurtypelist'><ul>";
            for (var type = 0; type < this.model.frequencies.length; type++) {
                $recurWind += "<li>" + this._getLocalizedLabels(this.model.frequencies[type]) + "</li>";
            }
            $recurWind += "</ul></div>";
            this.element.append(this._recurrenceLayout.append($recurWind));
            this._renderRecurrenceContent();
            this._initialSubControlRender = true;
            this._recurrenceLayout.find('.e-recurrencetype').ejDropDownList({ enableRTL: this.model.enableRTL, targetID: this._id + "_recurtypelist", width: (this._mediaQuery ? "140px" : "33%"), change: $.proxy(this._recurrenceTypeChange, this), cssClass: this.model.cssClass });
            this._recurrenceLayout.find('.e-recurrencetype').ejDropDownList({ selectedItemIndex: this.model.selectedRecurrenceType });
        };
        RecurrenceEditor.prototype._renderRecurrenceContent = function () {
            for (var i = 0; i < this._dayNames.length; i++)
                this._dayNames[i] = this._dayNames[i].toUpperCase();
            var startday = [this._getLocalizedLabels("First"), this._getLocalizedLabels("Second"), this._getLocalizedLabels("Third"), this._getLocalizedLabels("Fourth"), this._getLocalizedLabels("Last")];
            var margin = this.model.enableRTL ? "margin-right" : "margin-left";
            this._recurrenceContent = ej.buildTag('div.e-recurrencecontent#' + this._id + 'recurrencecontent', "", {}, {});
            if (this._mediaQuery) {
                var $recurCont = "<form id='" + this._id + "_recurrenceForm'><table class='e-table' width='100%' cellpadding='7'><tbody>";
                $recurCont += "<tr id='" + this._id + "_every' style='display:none'><td width='16%' id='everylabel' class='e-textlabel'>" + this._getLocalizedLabels("Every") + ":</td><td id='everycount' class='e-tdpadding'><table><tr><td><div class='e-floatleft'><input id='" + this._id + "_recurevery' class='recurevery' type='text' /></div></td>" +
                    "<td><div id='" + this._id + "_recurtypes' class='e-appcheckbox e-labelcursor'>" + this._getLocalizedLabels("RecurrenceDay") + "</div></td></tr></table></td></tr>";
                $recurCont += "<tr id='" + this._id + "_weekly' class='" + this._id + "_weekly' style='display:none'><td colspan='2' id='weeklabel' class='e-textlabel'><div>" + this._getLocalizedLabels("RepeatOn") + ":</div></td></tr><tr class='" + this._id + "_weekly' style='display:none'>" +
                    "<td colspan='2' id='weekcount'><table class='e-table' cellpadding='3'><tr>";
                for (var weekcount = 0; weekcount < this._dayShortNames.length; weekcount++) {
                    $recurCont += "<td><div class='e-weekday " + this._dayShortNames[weekcount] + "'><input id='" + this._id + "_" + this._dayNames[weekcount] + "' class='weekdays e-weekly" + this._dayNames[weekcount] + "'name='weekdays' type='checkbox'/><label class='e-textmargin' for='" + this._id + "_" + this._dayNames[weekcount] + "'>" + this._dayShortNames[weekcount] + "</label></div></td>";
                }
                $recurCont += "</tr></table></td></tr>";
                $recurCont += "<tr id='" + this._id + "_monthly' class='" + this._id + "_monthly' style='display:none'><td colspan='2' id='monthlabel' class='e-recurendslabel'><div class='e-recurendsalign'>" + this._getLocalizedLabels("RepeatBy") + ":</div></td></tr><tr class='" + this._id + "_monthly' style='display:none'>" +
                    "<td colspan='2' id='monthcount'><table class='e-table' cellpadding='3'><tr id='monthdaytr'><td><div><input id='" + this._id + "_monthday' class='monthdaytype' name='" + this._id + "_monthday' type='radio'/><label class='e-textmargin' for='" + this._id + "_monthday'>" + this._getLocalizedLabels("Day") + "</label></div></td>" +
                    "<td><div><input id='" + this._id + "_monthdate' class='monthdate' type='text'/></div></td></tr>" +
                    "<tr id='monthweekdaytr'><td><div><input id='" + this._id + "_monthon' class='monthposition' name='" + this._id + "_monthday' type='radio'/><label class='e-textmargin' for='" + this._id + "_monthon'>" + this._getLocalizedLabels("The") + "</label></div></td>" +
                    "<td><div><input id='" + this._id + "_monthsrt' class='monthsrt' type='text' name='monthsrt' value=''/><div id='" + this._id + "_monthsrtlist'><ul>";
                for (var day = 0; day < startday.length; day++) {
                    $recurCont += "<li>" + startday[day] + "</li>";
                }
                $recurCont += "</div></div></td>";
                $recurCont += "<td><div class='e-appcheckbox e-labelcursor'><input id='" + this._id + "_monthsrtday' class='e-monthsrtday monthsrtday' type='text' name='monthsrtday' value=''/>" +
                    "<div id='" + this._id + "_monthsrtdaylist'><ul>";
                for (var monthday = 0; monthday < this._dayFullNames.length; monthday++) {
                    $recurCont += "<li>" + this._dayFullNames[monthday] + "</li>";
                }
                $recurCont += "</div></div></td></tr></table></td></tr>";
                $recurCont += "<tr id='" + this._id + "_yearly' class='" + this._id + "_yearly' style='display:none'><td colspan='2' id='yearlabel' class='e-recurendslabel'><div class='e-recurendsalign'>" + this._getLocalizedLabels("RepeatBy") + ":</div></td></tr><tr class='" + this._id + "_yearly' style='display:none'>" +
                    "<td colspan='2' id='yearcount' ><table class='e-table' cellpadding='3'><tr id='yeardaytr'>" +
                    "<td><div><input id='" + this._id + "_yearday' class='yearrecurday' name='" + this._id + "_yearday' type='radio'/><label class='e-textmargin' for='" + this._id + "_yearday'>" + this._getLocalizedLabels("The") + "</label></div></td>" +
                    "<td><div class='e-controlalign'><input id='" + this._id + "_yearmonth' class='yearmonth' type='text' name='yearmonth' value=''/></div></td>" +
                    "<div id='" + this._id + "_yearmonthlist'><ul>";
                for (var monthcount = 0; monthcount < (this._monthNames.length - 1); monthcount++) {
                    $recurCont += "<li>" + this._monthNames[monthcount] + "</li>";
                }
                $recurCont += "</ul></div><td><input id='" + this._id + "_yeardate' class='yeardate' text='text'/></td></tr>" +
                    "<tr id='yearweekdaytr'><td><div><input id='" + this._id + "_yearother' class='yearrecurposi' name='" + this._id + "_yearday' type='radio'/><label class='e-textmargin' for='" + this._id + "_yearother'>" + this._getLocalizedLabels("The") + "</label></div></td>" +
                    "<td><div><input id='" + this._id + "_yearsrt' class='yearsrt' type='text' name='yearsrt' value=''/><div id='" + this._id + "_yearsrtlist'><ul>";
                for (var yearstartday = 0; yearstartday < startday.length; yearstartday++) {
                    $recurCont += "<li>" + startday[yearstartday] + "</li>";
                }
                $recurCont += "</ul></div></div></td><td><div class='e-controlalign'><input id='" + this._id + "_yearsrtday' class='yearsrtday' type='text' name='yearsrtday' value=''/>" +
                    "<div id='" + this._id + "_yearsrtdaylist'><ul>";
                for (var yearweek = 0; yearweek < this._dayFullNames.length; yearweek++) {
                    $recurCont += "<li>" + this._dayFullNames[yearweek] + "</li>";
                }
                $recurCont += "</ul></div></div></td><td><div><span>" + this._getLocalizedLabels("OfEvery") + "</span></div></td></tr><tr><td></td><td><div><input id='" + this._id + "_yearsrtmonth' class='yearsrtmonth' type='text' name='yearsrtmonth' value=''/>" +
                    "<div id='" + this._id + "_yearsrtmonthlist'><ul>";
                for (var yearmonth = 0; yearmonth < (this._monthNames.length - 1); yearmonth++) {
                    $recurCont += "<li>" + this._monthNames[yearmonth] + "</li>";
                }
                $recurCont += "</ul></div></div></td></tr></table></td></tr>";
                $recurCont += "<tr id='" + this._id + "_startson' ><td colspan='2' id='startsonlabel' class='e-textlabel'>" + this._getLocalizedLabels("StartsOn") + ":</td></tr><tr>" +
                    "<td colspan='2' id='startsoncount'><input id='" + this._id + "_recurstartdate' class='recurstartdate' type='text' name='RecurStartDate' value=''/></td></tr>";
                $recurCont += "<tr id='" + this._id + "_endson' ><td colspan='2' id='endsonlabel' class='e-recurendslabel'><div class='e-recurendsalign'>" + this._getLocalizedLabels("Ends") + ":</div></td></tr><tr>" +
                    "<td colspan='2' id='endsoncount'><table class='e-table' cellpadding='3'><tr id='endsonnever'><td><div><input id='" + this._id + "_repeatendnever' class='recurends e-recurnoend' type='radio' name='" + this._id + "_repeatend' value='Never'/><label class='e-textmargin' for='" + this._id + "_repeatendnever'>" + this._getLocalizedLabels("Never") + "</label></div></td></tr>" +
                    "<tr id='endsonafter'><td><div><input id='" + this._id + "_repeatendafter' class='recurends e-recurafter' type='radio' name='" + this._id + "_repeatend'/><label class='e-textmargin' for='" + this._id + "_repeatendafter'>" + this._getLocalizedLabels("After") + "</label>" +
                    "</div></td><td><div><input id='" + this._id + "_recurcount' class='recurcount' type='text'/></div></td>" +
                    "<td><span class='e-labelcursor' style='" + margin + ": -80px;'>" + this._getLocalizedLabels("Occurrence") + "</span></td></tr>" +
                    "<tr id='endsonuntil'><td><div><input id='" + this._id + "_repeatendon' class='recurends e-recuruntil' type='radio' name='" + this._id + "_repeatend'/><label class='e-textmargin' for='" + this._id + "_repeatendon'>" + this._getLocalizedLabels("On") + "</label></div></td>" +
                    "<td><input id='" + this._id + "_daily' class='e-until until' type='text' name='daily' value=''/></td></tr>  </table></td></tr>";
                $recurCont += "<tr style='display:none'><td><span class='e-textlabel'>Summary:</span></td><td><span class=e-recurRule></span></td></tr></tbody></table></form>";
            }
            else {
                var $recurCont = "<form id='" + this._id + "_recurrenceForm'><table class='e-table' width='100%' cellpadding='7'><tbody>";
                $recurCont += "<tr id='" + this._id + "_every' style='display:none'><td width='20%' id='everylabel' class='e-textlabel'>" + this._getLocalizedLabels("Every") + ":</td><td id='everycount' class='e-tdpadding'><table><tr><td><div class='e-floatleft'><input id='" + this._id + "_recurevery' class='recurevery' type='text' /></div></td>" +
                    "<td><div id='" + this._id + "_recurtypes' class='e-appcheckbox e-labelcursor'>" + this._getLocalizedLabels("RecurrenceDay") + "</div></td></tr></table></td></tr>";
                $recurCont += "<tr id='" + this._id + "_weekly' class='" + this._id + "_weekly' style='display:none'><td id='weeklabel' class='e-textlabel'><div>" + this._getLocalizedLabels("RepeatOn") + ":</div></td>" +
                    "<td id='weekcount'><table class='e-table' cellpadding='3'><tr>";
                for (var weekcount = 0; weekcount < this._dayShortNames.length; weekcount++) {
                    $recurCont += "<td><div class='e-weekday " + this._dayShortNames[weekcount] + "'><input id='" + this._id + "_" + this._dayNames[weekcount] + "' class='weekdays e-weekly" + this._dayNames[weekcount] + "'name='weekdays' type='checkbox'/><label class='e-textmargin' for='" + this._id + "_" + this._dayNames[weekcount] + "'>" + this._dayShortNames[weekcount] + "</label></div></td>";
                }
                $recurCont += "</tr></table></td></tr>";
                $recurCont += "<tr id='" + this._id + "_monthly' class='" + this._id + "_monthly' style='display:none'><td id='monthlabel' class='e-recurendslabel'><div class='e-recurendsalign'>" + this._getLocalizedLabels("RepeatBy") + ":</div></td>" +
                    "<td id='monthcount'><table class='e-table' cellpadding='3'><tr id='monthdaytr'><td><div><input id='" + this._id + "_monthday' class='monthdaytype' name='" + this._id + "_monthday' type='radio'/><label class='e-textmargin' for='" + this._id + "_monthday'>" + this._getLocalizedLabels("Day") + "</label></div></td>" +
                    "<td><div><input id='" + this._id + "_monthdate' class='monthdate' type='text'/></div></td></tr>" +
                    "<tr id='monthweekdaytr'><td><div><input id='" + this._id + "_monthon' class='monthposition' name='" + this._id + "_monthday' type='radio'/><label class='e-textmargin' for='" + this._id + "_monthon'>" + this._getLocalizedLabels("The") + "</label></div></td>" +
                    "<td><div><input id='" + this._id + "_monthsrt' class='monthsrt' type='text' name='monthsrt' value=''/><div id='" + this._id + "_monthsrtlist'><ul>";
                for (var day = 0; day < startday.length; day++) {
                    $recurCont += "<li>" + startday[day] + "</li>";
                }
                $recurCont += "</div></div></td>";
                $recurCont += "<td><div class='e-appcheckbox e-labelcursor'><input id='" + this._id + "_monthsrtday' class='e-monthsrtday monthsrtday' type='text' name='monthsrtday' value=''/>" +
                    "<div id='" + this._id + "_monthsrtdaylist'><ul>";
                for (var monthday = 0; monthday < this._dayFullNames.length; monthday++) {
                    $recurCont += "<li>" + this._dayFullNames[monthday] + "</li>";
                }
                $recurCont += "</div></div></td></tr></table></td></tr>";
                $recurCont += "<tr id='" + this._id + "_yearly' class='" + this._id + "_yearly' style='display:none'><td id='yearlabel' class='e-recurendslabel'><div class='e-recurendsalign'>" + this._getLocalizedLabels("RepeatBy") + ":</div></td>" +
                    "<td id='yearcount' ><table class='e-table' cellpadding='3'><tr id='yeardaytr'>" +
                    "<td><div><input id='" + this._id + "_yearday' class='yearrecurday' name='" + this._id + "_yearday' type='radio'/><label class='e-textmargin' for='" + this._id + "_yearday'>" + this._getLocalizedLabels("The") + "</label></div></td>" +
                    "<td><div class='e-controlalign'><input id='" + this._id + "_yearmonth' class='yearmonth' type='text' name='yearmonth' value=''/></div></td>" +
                    "<div id='" + this._id + "_yearmonthlist'><ul>";
                for (var monthcount = 0; monthcount < (this._monthNames.length - 1); monthcount++) {
                    $recurCont += "<li>" + this._monthNames[monthcount] + "</li>";
                }
                $recurCont += "</ul></div><td><input id='" + this._id + "_yeardate' class='yeardate' text='text'/></td></tr>" +
                    "<tr id='yearweekdaytr'><td><div><input id='" + this._id + "_yearother' class='yearrecurposi' name='" + this._id + "_yearday' type='radio'/><label class='e-textmargin' for='" + this._id + "_yearother'>" + this._getLocalizedLabels("The") + "</label></div></td>" +
                    "<td><div><input id='" + this._id + "_yearsrt' class='yearsrt' type='text' name='yearsrt' value=''/><div id='" + this._id + "_yearsrtlist'><ul>";
                for (var yearstartday = 0; yearstartday < startday.length; yearstartday++) {
                    $recurCont += "<li>" + startday[yearstartday] + "</li>";
                }
                $recurCont += "</ul></div></div></td><td><div class='e-controlalign'><input id='" + this._id + "_yearsrtday' class='yearsrtday' type='text' name='yearsrtday' value=''/>" +
                    "<div id='" + this._id + "_yearsrtdaylist'><ul>";
                for (var yearweek = 0; yearweek < this._dayFullNames.length; yearweek++) {
                    $recurCont += "<li>" + this._dayFullNames[yearweek] + "</li>";
                }
                $recurCont += "</ul></div></div></td><td><div><span>" + this._getLocalizedLabels("OfEvery") + "</span></div></td><td><div><input id='" + this._id + "_yearsrtmonth' class='yearsrtmonth' type='text' name='yearsrtmonth' value=''/>" +
                    "<div id='" + this._id + "_yearsrtmonthlist'><ul>";
                for (var yearmonth = 0; yearmonth < (this._monthNames.length - 1); yearmonth++) {
                    $recurCont += "<li>" + this._monthNames[yearmonth] + "</li>";
                }
                $recurCont += "</ul></div></div></td></tr></table></td></tr>";
                $recurCont += "<tr id='" + this._id + "_startson' style='display:none'><td width='20%' id='startsonlabel' class='e-textlabel'>" + this._getLocalizedLabels("StartsOn") + ":</td>" +
                    "<td id='startsoncount'><input id='" + this._id + "_recurstartdate' class='recurstartdate' type='text' name='RecurStartDate' value=''/></td></tr>";
                $recurCont += "<tr id='" + this._id + "_endson' style='display:none'><td id='endsonlabel' class='e-recurendslabel'><div class='e-recurendsalign'>" + this._getLocalizedLabels("Ends") + ":</div></td>" +
                    "<td id='endsoncount'><table class='e-table' cellpadding='3'><tr id='endsonnever'><td><div><input id='" + this._id + "_repeatendnever' class='recurends e-recurnoend' type='radio' name='" + this._id + "_repeatend' value='Never'/><label class='e-textmargin' for='" + this._id + "_repeatendnever'>" + this._getLocalizedLabels("Never") + "</label></div></td></tr>" +
                    "<tr id='endsonafter'><td><div><input id='" + this._id + "_repeatendafter' class='recurends e-recurafter' type='radio' name='" + this._id + "_repeatend'/><label class='e-textmargin' for='" + this._id + "_repeatendafter'>" + this._getLocalizedLabels("After") + "</label>" +
                    "</div></td><td><div><input id='" + this._id + "_recurcount' class='recurcount' type='text'/></div></td>" +
                    "<td><span class='e-labelcursor' style='" + margin + ": -80px;'>" + this._getLocalizedLabels("Occurrence") + "</span></td></tr>" +
                    "<tr id='endsonuntil'><td><div><input id='" + this._id + "_repeatendon' class='recurends e-recuruntil' type='radio' name='" + this._id + "_repeatend'/><label class='e-textmargin' for='" + this._id + "_repeatendon'>" + this._getLocalizedLabels("On") + "</label></div></td>" +
                    "<td><input id='" + this._id + "_daily' class='e-until until' type='text' name='daily' value=''/></td></tr>  </table></td></tr>";
                $recurCont += "<tr style='display:none'><td><span class='e-textlabel'>Summary:</span></td><td><span class=e-recurRule></span></td></tr></tbody></table></form>";
            }
            this._recurrenceLayout.append(this._recurrenceContent.append($recurCont));
            this._renderControls();
        };
        RecurrenceEditor.prototype._renderControls = function () {
            var control = this._recurrenceContent;
            control.find('.weekdays').ejCheckBox({ enableRTL: this.model.enableRTL, cssClass: this.model.cssClass, change: $.proxy(this._weeklyClick, this) });
            control.find('.monthsrt').ejDropDownList({ enableRTL: this.model.enableRTL, targetID: this._id + "_monthsrtlist", width: "100px", cssClass: this.model.cssClass, change: $.proxy(this._monthSrt, this) });
            control.find('.monthsrtday').ejDropDownList({ enableRTL: this.model.enableRTL, targetID: this._id + "_monthsrtdaylist", width: "100px", cssClass: this.model.cssClass, change: $.proxy(this._monthSrt, this) });
            control.find('.yearsrt').ejDropDownList({ enableRTL: this.model.enableRTL, targetID: this._id + "_yearsrtlist", width: "100px", cssClass: this.model.cssClass, change: $.proxy(this._yearsrt, this) });
            control.find('.yearmonth').ejDropDownList({ enableRTL: this.model.enableRTL, targetID: this._id + "_yearmonthlist", width: "100px", cssClass: this.model.cssClass, change: $.proxy(this._yearmonth, this) });
            control.find('.yearsrtday').ejDropDownList({ enableRTL: this.model.enableRTL, targetID: this._id + "_yearsrtdaylist", width: "100px", cssClass: this.model.cssClass, change: $.proxy(this._yearsrt, this) });
            control.find('.yearsrtmonth').ejDropDownList({ enableRTL: this.model.enableRTL, targetID: this._id + "_yearsrtmonthlist", width: "100px", cssClass: this.model.cssClass, change: $.proxy(this._yearsrt, this) });
            control.find('.recurstartdate').ejDatePicker({ buttonText: "Today", startDay: this._firstDayOfWeek, enableRTL: this.model.enableRTL, locale: this.model.locale, cssClass: this.model.cssClass, dateFormat: this.model.dateFormat, value: this.model.startDate, minDate: this.model.minDate, maxDate: this.model.maxDate, change: $.proxy(this._startDateChange, this) });
            control.find('.until').ejDatePicker({ buttonText: "Today", startDay: this._firstDayOfWeek, enableRTL: this.model.enableRTL, locale: this.model.locale, cssClass: this.model.cssClass, dateFormat: this.model.dateFormat, change: $.proxy(this._recurUntil, this) });
            control.find('.recurcount').ejNumericTextbox({ enableRTL: this.model.enableRTL, showSpinButton: this.model.enableSpinners, name: "recurcount", minValue: 1, value: 10, width: "65px", decimalPlaces: 0, cssClass: this.model.cssClass, change: $.proxy(this._recurCount, this) });
            control.find('.recurevery').ejNumericTextbox({ enableRTL: this.model.enableRTL, showSpinButton: this.model.enableSpinners, name: "recurevery", minValue: 1, value: 1, decimalPlaces: 0, width: "100px", cssClass: this.model.cssClass, change: $.proxy(this._everyCount, this) });
            control.find('.monthdate').ejNumericTextbox({ enableRTL: this.model.enableRTL, showSpinButton: this.model.enableSpinners, name: "monthdate", minValue: 1, decimalPlaces: 0, maxValue: 31, value: 1, width: "70px", cssClass: this.model.cssClass, change: $.proxy(this._monthDate, this) });
            control.find('.yeardate').ejNumericTextbox({ enableRTL: this.model.enableRTL, showSpinButton: this.model.enableSpinners, name: "yeardate", minValue: 1, decimalPlaces: 0, maxValue: 31, value: 1, width: "70px", cssClass: this.model.cssClass, change: $.proxy(this._yearmonth, this) });
            control.find('.recurends').ejRadioButton({ enableRTL: this.model.enableRTL, cssClass: this.model.cssClass, change: $.proxy(this._recurEndChange, this) });
            control.find('.monthposition,.monthdaytype').ejRadioButton({ enableRTL: this.model.enableRTL, cssClass: this.model.cssClass, change: $.proxy(this._recurEndChange, this) });
            control.find('.yearrecurposi,.yearrecurday').ejRadioButton({ enableRTL: this.model.enableRTL, cssClass: this.model.cssClass, change: $.proxy(this._recurEndChange, this) });
        };
        RecurrenceEditor.prototype._recurrenceTypeChange = function (args) {
            this._recurrenceType(args);
            if (this._rRuleFreq != "")
                this.closeRecurPublic();
            if (this._rRuleFreq == "") {
                this._recRule = undefined;
            }
            this._trigger("change", { recurrenceRule: this._recRule });
        };
        RecurrenceEditor.prototype._recurrenceType = function (args) {
            this._rRuleFreq = "";
            var _rule = "";
            var strDate = ($.type(this.model.startDate) == "string") ? this._dateConvert(this.model.startDate) : this.model.startDate;
            if (this.flag) {
                this._subControlChange = true;
                this._recurrenceContent.find('.until').ejDatePicker({ value: new Date(new Date(strDate.toDateString()).setDate(new Date(strDate.toDateString()).getDate() + 7 * 10)) });
                this._subControlChange = false;
                this._recurrenceContent.find(".e-recurnoend").ejRadioButton({ checked: true });
                this.flag = false;
            }
            !this._mediaQuery && this._recurrenceContent.find("#" + this._id + "_startson,#" + this._id + "_endson").css("display", "table-row");
            if (args.itemId != null) {
                this._recurrenceContent.find("#" + this._id + "_every").css("display", "table-row");
                var selectedType = this._getLocalizedLabels(this.model.frequencies[args.itemId]);
                switch (selectedType) {
                    case this._getLocalizedLabels("Never"):
                        this._recurrenceContent.css("display", "none");
                        break;
                    case this._getLocalizedLabels("Daily"):
                        this._recurrenceContent.css("display", "block");
                        this._recurrenceContent.find("#" + this._id + "_recurtypes").get(0).innerHTML = this._getLocalizedLabels("RecurrenceDay");
                        this._recurrenceContent.find("." + this._id + "_weekly,." + this._id + "_monthly,." + this._id + "_yearly").css("display", "none");
                        this._rRuleFreq = "DAILY";
                        _rule = this._getLocalizedLabels("RecurrenceDay").toLowerCase();
                        break;
                    case this._getLocalizedLabels("Weekly"):
                        this._recurrenceContent.css("display", "block");
                        this._recurrenceContent.find("#" + this._id + "_recurtypes").get(0).innerHTML = this._getLocalizedLabels("RecurrenceWeek");
                        var curDay = this._dayShortNames.indexOf(ej.format(strDate, "ddd", this.model.locale));
                        this._initialSubControlRender = true;
                        this._recurrenceContent.find(".e-weekly" + this._dayNames[curDay]).ejCheckBox({ checked: true });
                        _rule = this._getLocalizedLabels("RecurrenceWeek").toLowerCase() + " " + this._getLocalizedLabels("On").toLowerCase() + " " + this._dayFullNames[strDate.getDay()];
                        this._rRuleFreq = "WEEKLY";
                        this._recurrenceContent.find("." + this._id + "_monthly,." + this._id + "_yearly").css("display", "none");
                        this._recurrenceContent.find("." + this._id + "_weekly").css("display", "table-row");
                        break;
                    case this._getLocalizedLabels("Monthly"):
                        this._recurrenceContent.css("display", "block");
                        this._recurrenceContent.find("#" + this._id + "_recurtypes").get(0).innerHTML = this._getLocalizedLabels("RecurrenceMonth");
                        this._recurrenceContent.find("." + this._id + "_weekly,." + this._id + "_yearly").css("display", "none");
                        this._recurrenceContent.find("." + this._id + "_monthly").css("display", "table-row");
                        this._initialSubControlRender = true;
                        this._recurrenceContent.find('.monthdate').ejNumericTextbox({ value: strDate.getDate() });
                        this._recurrenceContent.find('.monthsrtday').ejDropDownList({ selectedItemIndex: this._dayNames.indexOf((ej.format(strDate, "ddd", "en-US").substr(0, 2)).toUpperCase()) });
                        this._recurrenceContent.find('.monthsrt').ejDropDownList({ selectedItemIndex: this._getWeekIndex(strDate) });
                        this._recurrenceContent.find('.monthdaytype').ejRadioButton({ checked: true });
                        this._rRuleFreq = "MONTHLY";
                        _rule = this._getLocalizedLabels("RecurrenceMonth").toLowerCase();
                        break;
                    case this._getLocalizedLabels("Yearly"):
                        this._recurrenceContent.css("display", "block");
                        this._recurrenceContent.find("#" + this._id + "_recurtypes").get(0).innerHTML = this._getLocalizedLabels("RecurrenceYear");
                        this._recurrenceContent.find("." + this._id + "_weekly,." + this._id + "_monthly").css("display", "none");
                        this._recurrenceContent.find("." + this._id + "_yearly").css("display", "table-row");
                        this._initialSubControlRender = true;
                        this._recurrenceContent.find('.yearmonth').ejDropDownList({ selectedItemIndex: strDate.getMonth() });
                        this._recurrenceContent.find('.yeardate').ejNumericTextbox({ value: strDate.getDate() });
                        this._recurrenceContent.find('.yearsrtday').ejDropDownList({ selectedItemIndex: this._dayNames.indexOf((ej.format(strDate, "ddd", "en-US").substr(0, 2)).toUpperCase()) });
                        this._recurrenceContent.find('.yearsrtmonth').ejDropDownList({ selectedItemIndex: strDate.getMonth() });
                        this._recurrenceContent.find('.yearsrt').ejDropDownList({ selectedItemIndex: this._getWeekIndex(strDate) });
                        this._recurrenceContent.find('.yearrecurday').ejRadioButton({ checked: true });
                        this._rRuleFreq = "YEARLY";
                        _rule = this._getLocalizedLabels("RecurrenceYear").toLowerCase();
                        break;
                    case this._getLocalizedLabels("EveryWeekDay"):
                        this._recurrenceContent.css("display", "block");
                        this._rRuleFreq = "WEEKDAYS";
                        this._recurrenceContent.find("." + this._id + "_weekly,." + this._id + "_yearly,#" + this._id + "_every,." + this._id + "_monthly").css("display", "none");
                        _rule = args.text;
                        break;
                }
                this._initialSubControlRender = false;
            }
            this._recurrenceContent.find(".e-recurRule").html(_rule);
        };
        RecurrenceEditor.prototype._getWeekIndex = function (curDate) {
            var index = 0;
            var firstDate = new Date(curDate.getFullYear(), curDate.getMonth(), 1);
            var dayIndex = curDate.getDay();
            if (dayIndex != firstDate.getDay())
                do {
                    firstDate = new Date(firstDate.setDate(firstDate.getDate() + 1));
                } while (dayIndex != firstDate.getDay());
            while (firstDate.getDate() != curDate.getDate()) {
                firstDate = new Date(firstDate.setDate(firstDate.getDate() + 7));
                index++;
            }
            return index;
        };
        RecurrenceEditor.prototype._weeklyClick = function () {
            if (!this._initialSubControlRender)
                this._stringGenerate();
        };
        RecurrenceEditor.prototype._monthSrt = function () {
            this._subControlChange = true;
            this._recurrenceContent.find("#" + this._id + "_monthon").ejRadioButton("option", "checked", true);
            this._subControlChange = false;
            if (!this._initialSubControlRender)
                this._stringGenerate();
        };
        RecurrenceEditor.prototype._yearsrt = function () {
            this._subControlChange = true;
            this._recurrenceContent.find("#" + this._id + "_yearother").ejRadioButton("option", "checked", true);
            this._subControlChange = false;
            if (!this._initialSubControlRender)
                this._stringGenerate();
        };
        RecurrenceEditor.prototype._yearmonth = function () {
            this._subControlChange = true;
            this._recurrenceContent.find("#" + this._id + "_yearday").ejRadioButton("option", "checked", true);
            this._subControlChange = false;
            if (!this._initialSubControlRender)
                this._stringGenerate();
        };
        RecurrenceEditor.prototype._startDateChange = function (args) {
            this.model.startDate = new Date(args.model.value);
            if (!this._recurrenceContent.find("#" + this._id + "_repeatendon").ejRadioButton("model.checked") || (this.model.startDate > this._recurrenceContent.find(".until").ejDatePicker("option", "value"))) {
                this._subControlChange = true;
                this._recurrenceContent.find(".until").ejDatePicker("option", "value", new Date(new Date(args.model.value).setDate(args.model.value.getDate() + 7 * 10)));
            }
            this._subControlChange = false;
            if (!this._initialSubControlRender)
                this._stringGenerate();
        };
        RecurrenceEditor.prototype._recurUntil = function (args) {
            if (this._subControlChange)
                return;
            this._subControlChange = true;
            this._recurrenceContent.find("#" + this._id + "_repeatendon").ejRadioButton("option", "checked", true);
            this._subControlChange = false;
            if (!this._initialSubControlRender)
                this._stringGenerate();
        };
        RecurrenceEditor.prototype._recurCount = function (args) {
            this._recurrenceContent.find("#" + this._id + "_repeatendafter").ejRadioButton("option", "checked", true);
            if (!this._initialSubControlRender)
                this._stringGenerate();
        };
        RecurrenceEditor.prototype._everyCount = function () {
            if (!this._initialSubControlRender)
                this._stringGenerate();
        };
        RecurrenceEditor.prototype._monthDate = function () {
            this._recurrenceContent.find("#" + this._id + "_monthday").ejRadioButton("option", "checked", true);
            if (!this._initialSubControlRender)
                this._stringGenerate();
        };
        RecurrenceEditor.prototype._recurEndChange = function () {
            if (this._subControlChange)
                return;
            if (!this._initialSubControlRender)
                this._stringGenerate();
        };
        RecurrenceEditor.prototype._stringGenerate = function () {
            this.closeRecurPublic();
            this._trigger("change", { recurrenceRule: this._recRule });
        };
        RecurrenceEditor.prototype._findInterval = function (numericElement) {
            var interval;
            interval = numericElement.ejNumericTextbox("model.value");
            return interval = ej.isNullOrUndefined(interval) ? 0 : interval;
        };
        RecurrenceEditor.prototype._weeklyDayFind = function (strDate, days) {
            var newdayStr = strDate;
            do {
                newdayStr = new Date(newdayStr.setDate(newdayStr.getDate() + 1));
                var curDay = this._dayNamesValue[new Date(newdayStr).getDay()].toUpperCase();
            } while (days.indexOf(curDay) == -1);
            return newdayStr;
        };
        RecurrenceEditor.prototype._dayOfWeekInMonth = function (strDate, dayName, weekIndex) {
            var dayIndex = this._dayNamesValue.indexOf(dayName);
            var curDate = weekIndex == -1 ? new Date(strDate.getFullYear(), strDate.getMonth() + 1, 0) : new Date(strDate.getFullYear(), strDate.getMonth(), 1);
            while (curDate.getDay() != dayIndex) {
                curDate = new Date(weekIndex == -1 ? curDate.setDate(curDate.getDate() - 1) : curDate.setDate(curDate.getDate() + 1));
            }
            var curIndex = Math.abs(Math.ceil((curDate.getDate() - 1 - curDate.getDay()) / 7));
            return new Date(weekIndex == 1 || weekIndex == -1 ? curDate.toString() : new Date(curDate.setDate(curDate.getDate() + ((weekIndex - curIndex - 1) * 7))).toString());
        };
        RecurrenceEditor.prototype._findRecurCount = function (_interval, byDay, objValue) {
            var _count = 0, _interval, byDay, wTrue = false, ractualDate, rincrDate, interCount = this._interval;
            var day_start = new Date(this._recurrenceContent.find('.recurstartdate').ejDatePicker("model.value"));
            if (!ej.isNullOrUndefined(this._actualDate) && this._actualDate != 0) {
                var lastdate = new Date(day_start.getFullYear(), day_start.getMonth() + 1, 0);
                day_start = lastdate.getDate() < this._actualDate ? lastdate : new Date(day_start.getFullYear(), day_start.getMonth(), this._actualDate);
            }
            rincrDate = ractualDate = new Date(day_start.toString());
            var recurEndDate = new Date(this.element.find('.e-until').ejDatePicker("model.value"));
            while (day_start <= recurEndDate) {
                switch (this._rRuleFreq) {
                    case "DAILY":
                        day_start = new Date(day_start.setDate(day_start.getDate() + _interval));
                        wTrue = true;
                        break;
                    case "WEEKLY":
                    case "WEEKDAYS":
                        var wDays = byDay.split(",");
                        var curDay = objValue._dayNames[new Date(day_start.toString()).getDay()];
                        for (var b = 0; b < wDays.length; b++) {
                            if (wDays[b] == curDay) {
                                if (interCount == this._interval) {
                                    wTrue = true;
                                    interCount = 1;
                                    break;
                                }
                                interCount++;
                            }
                        }
                        break;
                    case "MONTHLY":
                        day_start = new Date(day_start.setMonth(day_start.getMonth() + _interval));
                        if (!ej.isNullOrUndefined(this._month) && this._month && ractualDate.getMonth() > day_start.getMonth())
                            day_start = new Date(day_start.setDate(ractualDate.getDate()));
                        if (day_start.getDate() != rincrDate.getDate() && (ej.isNullOrUndefined(this._month) || !this._month)) {
                            this._month = true;
                            day_start = new Date(day_start.setDate(day_start.getDate() - day_start.getDate()));
                        }
                        wTrue = true;
                        break;
                    case "YEARLY":
                        day_start = new Date(day_start.setFullYear(day_start.getFullYear() + _interval));
                        wTrue = true;
                        break;
                }
                (wTrue) && _count++;
                wTrue = false;
                if (this._rRuleFreq == "WEEKLY" || this._rRuleFreq == "WEEKDAYS") {
                    day_start = new Date(day_start.setDate(day_start.getDate() + 1));
                }
                rincrDate = new Date(day_start.toString());
            }
            this._month = false;
            this._actualDate = 0;
            return _count;
        };
        RecurrenceEditor.prototype._getLocalizedLabels = function (prop) {
            return ej.isNullOrUndefined(ej.RecurrenceEditor.Locale[this.model.locale]) ? ej.RecurrenceEditor.Locale["en-US"][prop] : ej.RecurrenceEditor.Locale[this.model.locale][prop];
        };
        RecurrenceEditor.prototype._datepattern = function () {
            return (this.model.dateFormat != "" && !ej.isNullOrUndefined(this.model.dateFormat)) ? this.model.dateFormat : this._pattern.d;
        };
        RecurrenceEditor.prototype._dateConvert = function (dateString) {
            if (!ej.isNullOrUndefined(dateString)) {
                var convertedDate = new Date(parseInt(dateString.match(/\d+/).toString()));
                convertedDate = $.type(convertedDate) == "date" ? convertedDate : new Date();
            }
            else
                convertedDate = null;
            return convertedDate;
        };
        RecurrenceEditor.prototype.recurrenceDateGenerator = function (recurrenceString, strDate, recurExDate) {
            var RecDateCollection = [], weeklyRule = recurrenceString.split(';');
            this._recurDates = {};
            var day_start = new Date(strDate), _count = 0;
            var rincrDate, ractualDate, rcurrentDate, recurEndDate;
            rcurrentDate = new Date(day_start);
            if (ej.isNullOrUndefined(recurExDate))
                recurExDate = null;
            this.recurrenceRuleSplit(recurrenceString, recurExDate);
            if (ej.isNullOrUndefined(this._rRule.recurEditId)) {
                var byDay = "", _interval = ej.isNullOrUndefined(this._rRule.interval) ? 1 : this._rRule.interval;
                !ej.isNullOrUndefined(this._rRule.weekDays) && (byDay = this._rRule.weekDays.split(','));
                if (!ej.isNullOrUndefined(this._rRule.until)) {
                    recurEndDate = new Date(this._rRule.until);
                    recurEndDate.setDate(recurEndDate.getDate() + 1);
                }
                else if (!ej.isNullOrUndefined(this._rRule.count))
                    switch (this._rRule.freq) {
                        case "DAILY":
                            recurEndDate = new Date(new Date(day_start).setDate(day_start.getDate() + this._rRule.count * (_interval)));
                            break;
                        case "WEEKLY":
                            var dayCount = Math.round(day_start.getDate() + (((this._rRule.count / byDay.length) * 7)) * (_interval));
                            recurEndDate = new Date(new Date(day_start).setDate(dayCount + 1));
                            break;
                        case "MONTHLY":
                            recurEndDate = new Date(new Date(day_start).setMonth(day_start.getMonth() + this._rRule.count * (_interval)));
                            break;
                        case "YEARLY":
                            recurEndDate = new Date(new Date(day_start).setFullYear(day_start.getFullYear() + this._rRule.count * (_interval)));
                            break;
                    }
                else
                    recurEndDate = new Date(new Date(this.model.startDate.toString()).setDate(day_start.getDate() + 42 * (_interval)));
                switch (this._rRule.freq) {
                    case "WEEKLY":
                        byDay = this._rRule.weekDays.split(',');
                        if (byDay.indexOf(this._dayNamesValue[new Date(day_start).getDay()].toUpperCase()) == -1)
                            day_start = this._weeklyDayFind(day_start, byDay);
                        break;
                    case "MONTHLY":
                        if (!ej.isNullOrUndefined(this._rRule.monthDay)) {
                            var _lastDay = new Date(day_start).getDate() == new Date(day_start.getFullYear(), day_start.getMonth() + 1, 0).getDate() ? true : false;
                            while (new Date(day_start).getDate() != this._rRule.monthDay) {
                                day_start = new Date(day_start.setDate(day_start.getDate() + 1));
                            }
                        }
                        else
                            day_start = new Date((this._getWeekIndex(day_start) + 1) > this._rRule.setPositions && this._rRule.setPositions != -1 ? new Date(day_start.getFullYear(), day_start.getMonth(), 1) : day_start);
                        rincrDate = ractualDate = new Date(day_start);
                        break;
                    case "YEARLY":
                        if (!ej.isNullOrUndefined(this._rRule.monthDay)) {
                            var appMonth = new Date(rcurrentDate.setMonth(this._rRule.month - 1));
                            var lastDate = new Date(appMonth.getFullYear(), appMonth.getMonth() + 1, 0).getDate();
                            if (this._rRule.monthDay > lastDate)
                                this._rRule.monthDay = lastDate;
                            day_start = (day_start.getMonth() + 1 >= this._rRule.month) && day_start.getDate() > this._rRule.monthDay ? new Date(day_start.getFullYear() + 1, this._rRule.month - 1, this._rRule.monthDay) : new Date(day_start.getFullYear(), this._rRule.month - 1, this._rRule.monthDay);
                        }
                        else if (!ej.isNullOrUndefined(this._rRule.setPositions)) {
                            day_start = new Date(day_start.getFullYear(), this._rRule.month - 1, day_start.getDate());
                            day_start = new Date((this._getWeekIndex(day_start) + 1) > this._rRule.setPositions && this._rRule.setPositions != -1 ? new Date(day_start.getFullYear(), day_start.getMonth(), 1) : day_start);
                        }
                        break;
                }
                while (day_start <= recurEndDate) {
                    ((this._rRule.freq == "MONTHLY" || this._rRule.freq == "YEARLY") && !ej.isNullOrUndefined(this._rRule.setPositions)) && (day_start = this._dayOfWeekInMonth(day_start, this._rRule.weekDays, this._rRule.setPositions));
                    if (!ej.isNullOrUndefined(this._rRule.exDate)) {
                        if (this._rRule.exDate.indexOf(ej.format(new Date(day_start), this._pattern.d, this.model.locale)) == -1) {
                            var i = 2;
                        }
                    }
                    else
                        var i = 0;
                    var value = new Date(day_start);
                    switch (this._rRule.freq) {
                        case "DAILY":
                            RecDateCollection.push(new Date(value.toString()).getTime());
                            day_start = new Date(day_start.setDate(day_start.getDate() + _interval));
                            break;
                        case "WEEKLY":
                            var curDay = this._dayNamesValue[new Date(day_start).getDay()].toUpperCase();
                            if (byDay.length - 1 != byDay.indexOf(curDay)) {
                                RecDateCollection.push(new Date(value.toString()).getTime());
                                day_start = this._weeklyDayFind(day_start, byDay);
                            }
                            else {
                                RecDateCollection.push(new Date(value.toString()).getTime());
                                day_start = new Date(day_start.setDate(day_start.getDate() + (day_start.getDay() * -1)));
                                day_start = new Date(day_start.setDate(day_start.getDate() + (_interval * 7) - 1));
                                day_start = this._weeklyDayFind(day_start, byDay);
                            }
                            break;
                        case "MONTHLY":
                            RecDateCollection.push(new Date(value.toString()).getTime());
                            if (_lastDay)
                                day_start = new Date(day_start.getFullYear(), (day_start.getMonth() + _interval) + 1, 0);
                            else if (ej.isNullOrUndefined(this._rRule.setPositions)) {
                                var cloneDate = new Date(day_start);
                                var nextMonth = new Date(cloneDate.setMonth(cloneDate.getMonth() + _interval));
                                var lastDayOfMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0);
                                var nextInterval = (day_start.getFullYear() == nextMonth.getFullYear()) ? day_start.getMonth() + _interval : nextMonth.getMonth();
                                if (nextInterval == nextMonth.getMonth())
                                    day_start = (nextMonth > lastDayOfMonth) ? new Date(lastDayOfMonth.toString()) : new Date(nextMonth.setDate(this._rRule.monthDay));
                                else {
                                    var prevMonth = new Date(nextMonth.setMonth(nextMonth.getMonth() - 1));
                                    day_start = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0);
                                }
                            }
                            else
                                day_start = new Date(day_start.getFullYear(), day_start.getMonth() + _interval, 1);
                            break;
                        case "YEARLY":
                            RecDateCollection.push(new Date(value.toString()).getTime());
                            day_start = new Date(day_start.setFullYear(day_start.getFullYear() + _interval));
                            break;
                    }
                    _count++;
                    if (!ej.isNullOrUndefined(this._rRule.count) && _count == this._rRule.count)
                        break;
                }
            }
            return RecDateCollection;
        };
        RecurrenceEditor.prototype.recurrenceRuleSplit = function (rRule, exDate) {
            this._rRule = {};
            _ruleExdate = exDate;
            var _rule, _ruleExdate, _rRuleSplit = rRule.split(";");
            if (!ej.isNullOrUndefined(exDate) && !ej.isNullOrUndefined(_ruleExdate.split(","))) {
                var _exDates = _ruleExdate.split(",");
                this._rRule.exDate = [];
                for (var i = 0; i < _exDates.length; i++) {
                    this._rRule.exDate[i] = _exDates[i];
                }
            }
            for (var r = 0; r < _rRuleSplit.length; r++) {
                _rule = _rRuleSplit[r].split("=");
                switch ($.trim(_rule[0]).toUpperCase()) {
                    case "FREQ":
                        this._rRule.freq = $.trim(_rule[1]).toUpperCase();
                        break;
                    case "INTERVAL":
                        this._rRule.interval = parseInt(_rule[1], 10);
                        break;
                    case "COUNT":
                        this._rRule.count = parseInt(_rule[1], 10);
                        break;
                    case "UNTIL":
                        this._rRule.until = ej.parseDate(ej.format(_rule[1], this._pattern.d, this.model.locale), this._pattern.d);
                        break;
                    case "BYDAY":
                        this._rRule.weekDays = _rule[1];
                        break;
                    case "BYMONTHDAY":
                        this._rRule.monthDay = parseInt(_rule[1], 10);
                        break;
                    case "BYMONTH":
                        this._rRule.month = parseInt(_rule[1], 10);
                        break;
                    case "BYSETPOS":
                        this._rRule.setPositions = parseInt(_rule[1], 10);
                        break;
                    case "WKST":
                        this._rRule.weekStart = _rule[1];
                        break;
                    case "EXDATE":
                        if (!ej.isNullOrUndefined(exDate) && !ej.isNullOrUndefined(_ruleExdate.split(","))) {
                            var _exDates = _ruleExdate.split(",");
                            this._rRule.exDate = [];
                            for (var i = 0; i < _exDates.length; i++) {
                                this._rRule.exDate[i] = _exDates[i];
                            }
                        }
                        else {
                            var _exDates = _rule[1].split(",");
                            this._rRule.exDate = [];
                            for (var i = 0; i < _exDates.length; i++) {
                                this._rRule.exDate[i] = _exDates[i];
                            }
                        }
                        break;
                    case "RECUREDITID":
                        this._rRule.recurEditId = parseInt(_rule[1]);
                        break;
                }
            }
            return this._rRule;
        };
        RecurrenceEditor.prototype.clearRecurrenceFields = function () {
            var list = this.element.find("input.weekdays");
            for (var i = 0; i < list.length; i++) {
                list.eq(i).ejCheckBox({ checked: false });
            }
            this.element.find('.recurevery').ejNumericTextbox({ value: 1 });
            this.element.find('.recurcount').ejNumericTextbox({ value: 10 });
            this.element.find(".e-recurRule").html("");
        };
        RecurrenceEditor.prototype.setDefaultValues = function () {
            var strDate = this.model.startDate.toString();
            this._recurrenceLayout.find('.e-recurrencetype').ejDropDownList({ selectedItemIndex: 0 });
            this._recurrenceLayout.find('.e-recurrencetype').ejDropDownList({ selectedItemIndex: 1 });
            this.element.find(".recurstartdate").ejDatePicker({ value: new Date(strDate) });
            this.element.find('.e-until').ejDatePicker({ value: new Date(new Date(strDate).setDate(new Date(strDate).getDate() + 7 * 10)) });
            this.element.find(".e-recurnoend").ejRadioButton({ checked: true });
        };
        RecurrenceEditor.prototype.showRecurrenceSummary = function (appId) {
            for (var i = 0; i < this._dayNames.length; i++)
                this._dayNames[i] = this._dayNames[i].toUpperCase();
            var _recurRule = "", _recurOpt = "", _recurType = this.element.find('#' + this._id + '_recurrenceType');
            _recurRule = ej.isNullOrUndefined(this._rRule.interval) ? this._getLocalizedLabels("Every") + " " : this._getLocalizedLabels("Every") + " " + this._rRule.interval + " ";
            _recurType.ejDropDownList({ selectedItemIndex: this.model.frequencies.indexOf(this._rRule.freq.toLowerCase().replace(/^./, function (str) { return str.toUpperCase(); })) });
            switch (this._rRule.freq) {
                case "DAILY":
                    _recurRule += this._getLocalizedLabels("RecurrenceDay").toLowerCase();
                    this._rRuleFreq = "DAILY";
                    break;
                case "WEEKLY":
                    this._rRuleFreq = "WEEKLY";
                    this.element.find('.weekdays').ejCheckBox({ checked: false });
                    var _days = this._rRule.weekDays.split(',');
                    for (var i = 0; i < _days.length; i++) {
                        this.element.find('.e-weekly' + _days[i]).ejCheckBox({ checked: true });
                        _recurOpt += this._dayShortNames[this._dayNames.indexOf(_days[i])] + (i == _days.length - 1 ? "" : ", ");
                    }
                    _recurRule += this._getLocalizedLabels("RecurrenceWeek").toLowerCase() + " " + this._getLocalizedLabels("On").toLowerCase() + " " + _recurOpt;
                    break;
                case "MONTHLY":
                    this._rRuleFreq = "MONTHLY";
                    if (!ej.isNullOrUndefined(this._rRule.monthDay)) {
                        this.element.find('.e-monthdaytype').ejRadioButton({ checked: true });
                        this.element.find('.e-monthdate').ejNumericTextbox({ value: parseInt(this._rRule.monthDay) });
                        _recurOpt = parseInt(this._rRule.monthDay).toString();
                    }
                    else {
                        this.element.find('.e-monthposition').ejRadioButton({ checked: true });
                        this.element.find('.e-monthsrtday').ejDropDownList({ selectedItemIndex: this._dayNames.indexOf(this._rRule.weekDays) });
                        this.element.find('.monthsrt').ejDropDownList({ selectedItemIndex: this._rRule.setPositions - 1 });
                        _recurOpt = this.element.find('.monthsrt').ejDropDownList("model.value").toLowerCase() + " " + this._dayFullNames[this._dayNames.indexOf(this._rRule.weekDays)];
                    }
                    _recurRule += this._getLocalizedLabels("RecurrenceMonth").toLowerCase() + " " + this._getLocalizedLabels("On").toLowerCase() + " " + _recurOpt;
                    break;
                case "YEARLY":
                    this._rRuleFreq = "YEARLY";
                    if (!ej.isNullOrUndefined(this._rRule.monthDay)) {
                        this.element.find('.e-yearrecurday').ejRadioButton({ checked: true });
                        this.element.find('.yearmonth').ejDropDownList({ selectedItemIndex: this._rRule.month - 1 });
                        this.element.find('.yeardate').ejNumericTextbox({ value: parseInt(this._rRule.monthDay) });
                        _recurOpt = this._monthNames[this._rRule.month - 1] + " " + parseInt(this._rRule.monthDay);
                    }
                    else {
                        this.element.find('.e-yearrecurposi').ejRadioButton({ checked: true });
                        this.element.find('.yearsrtday').ejDropDownList({ selectedItemIndex: this._dayNames.indexOf(this._rRule.weekDays) });
                        this.element.find('.yearsrtmonth').ejDropDownList({ selectedItemIndex: this._rRule.month - 1 });
                        this.element.find('.yearsrt').ejDropDownList({ selectedItemIndex: this._rRule.setPositions - 1 });
                        _recurOpt = this.element.find('.yearsrt').ejDropDownList("model.value").toLowerCase() + " " + this._dayFullNames[this._dayNames.indexOf(this._rRule.weekDays)] + " " + this._monthNames[this._rRule.month - 1];
                    }
                    _recurRule += this._getLocalizedLabels("RecurrenceYear").toLowerCase() + " " + this._getLocalizedLabels("On").toLowerCase() + " " + _recurOpt;
                    break;
            }
            this.element.find('.recurevery').ejNumericTextbox({ value: ej.isNullOrUndefined(this._rRule.interval) ? 1 : this._rRule.interval });
            if (!ej.isNullOrUndefined(this._rRule.count)) {
                this.element.find(".e-recurafter").ejRadioButton({ checked: true });
                this.element.find('.recurcount').ejNumericTextbox({ value: this._rRule.count });
                _recurRule += ", " + this._rRule.count + this._getLocalizedLabels("Times").toLowerCase();
            }
            else if (!ej.isNullOrUndefined(this._rRule.until)) {
                this.element.find(".e-recuruntil").ejRadioButton({ checked: true });
                this.element.find('.e-until').ejDatePicker({ value: new Date(this._rRule.until) });
                _recurRule += " " + this._getLocalizedLabels("Until").toLowerCase() + " " + ej.format(new Date(this._rRule.until), this._datepattern(), this.model.locale);
            }
            else
                this.element.find(".e-recurnoend").ejRadioButton({ checked: true });
            return _recurRule;
        };
        RecurrenceEditor.prototype.getRecurrenceRule = function () {
            this.closeRecurPublic();
            return this._recRule;
        };
        RecurrenceEditor.prototype.closeRecurPublic = function () {
            var recurEditValue = this._rRuleFreq;
            var interval, monthDate, endRecur = "", recurOption = "", _weekRule = "", recurRules = "";
            interval = this._interval = this._findInterval(this.element.find('.recurevery'));
            switch (recurEditValue) {
                case "DAILY":
                    recurRules = "FREQ=" + recurEditValue + ";INTERVAL=" + interval;
                    break;
                case "WEEKDAYS":
                    recurRules = "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR";
                    _weekRule = "MO,TU,WE,TH,FR";
                    break;
                case "WEEKLY":
                    var _weekChkList = this.element.find("input.weekdays");
                    var _dayName = "", _byDay = "", checked = "", checkedNames = "";
                    for (var i = 0; i < _weekChkList.length; i++) {
                        _weekChkList.eq(i).ejCheckBox("model.checked") == true ? _weekRule += (_weekRule != "" ? "," : "") + this._dayNames[i].toUpperCase() : "";
                        _weekChkList.eq(i).ejCheckBox("model.checked") == true ? _dayName += (_dayName != "" ? ", " : "") + this._dayShortNames[i] : "";
                    }
                    for (var c = 0; c < this._dayNamesValue.length; c++) {
                        if (checked.indexOf(this._dayNamesValue[c]) != -1) {
                            _weekRule += (_weekRule != "" ? "," : "") + this._dayNamesValue[c];
                        }
                        if (checkedNames.indexOf(this._culture.calendar.days.namesAbbr[c]) != -1) {
                            _dayName += (_dayName != "" ? "," : "") + this._culture.calendar.days.namesAbbr[c];
                        }
                    }
                    if (_weekRule == "") {
                        var date = this.element.find('.recurstartdate').ejDatePicker("model.value");
                        _weekRule = this._dayNames[date.getDay()].toUpperCase();
                    }
                    var _rule = this._getLocalizedLabels("RecurrenceWeek").toLowerCase() + " on " + _dayName;
                    this.element.find(".e-recurRule").html(_rule);
                    recurRules = "FREQ=" + recurEditValue + ";INTERVAL=" + interval + ";" + "BYDAY=" + _weekRule;
                    break;
                case "MONTHLY":
                    if (this.element.find('.monthdaytype').ejRadioButton("model.checked")) {
                        monthDate = this.element.find('.monthdate').ejNumericTextbox("model.value");
                        recurRules = "FREQ=" + recurEditValue + ";BYMONTHDAY=" + monthDate + ";INTERVAL=" + interval;
                        recurOption = " " + this._getLocalizedLabels("On").toLowerCase() + " " + monthDate;
                    }
                    else {
                        var _setPos = this.element.find('.monthsrt').ejDropDownList("selectedItemIndex");
                        var dayName = this.element.find('.e-monthsrtday').ejDropDownList("selectedItemIndex");
                        _setPos = _setPos < 5 ? (_setPos + 1) : -1;
                        recurRules = "FREQ=" + recurEditValue + ";BYDAY=" + this._dayNames[dayName] + ";BYSETPOS=" + _setPos + ";INTERVAL=" + interval;
                        recurOption = " " + this._getLocalizedLabels("On").toLowerCase() + " " + this.element.find('.monthsrt').ejDropDownList("model.value").toLowerCase() + " " + this._dayFullNames[dayName];
                    }
                    break;
                case "YEARLY":
                    if (this.element.find("#" + this._id + "_yearday").ejRadioButton("model.checked")) {
                        var _monthIndex = this.element.find('.yearmonth').ejDropDownList("selectedItemIndex");
                        var _monthDate = this._findInterval(this.element.find('.yeardate'));
                        recurRules = "FREQ=" + recurEditValue + ";BYMONTHDAY=" + _monthDate + ";BYMONTH=" + (_monthIndex + 1) + ";INTERVAL=" + interval;
                        recurOption = " " + this._getLocalizedLabels("On").toLowerCase() + " " + this._monthNames[_monthIndex] + " " + _monthDate;
                    }
                    else {
                        var _setPos = this.element.find('.yearsrt').ejDropDownList("selectedItemIndex");
                        var _monthIndex = this.element.find('.yearsrtmonth').ejDropDownList("selectedItemIndex");
                        var dayName = this.element.find('.yearsrtday').ejDropDownList("selectedItemIndex");
                        _setPos = _setPos < 5 ? (_setPos + 1) : -1;
                        recurRules = "FREQ=" + recurEditValue + ";BYDAY=" + this._dayNames[dayName] + ";BYMONTH=" + (_monthIndex + 1) + ";BYSETPOS=" + _setPos + ";INTERVAL=" + interval;
                        recurOption = " " + this._getLocalizedLabels("On").toLowerCase() + " " + this.element.find('.yearsrt').ejDropDownList("model.value").toLowerCase() + " " + this._dayFullNames[dayName] + " " + this._monthNames[_monthIndex];
                    }
                    break;
                case "NEVER":
                    this._recRule = undefined;
                    break;
            }
            if (this.element.find('.e-recurafter').ejRadioButton("model.checked")) {
                var _count = this._findInterval(this.element.find('.recurcount'));
                recurRules += ";COUNT=" + _count;
                endRecur = _count ? ", " + _count + " " + this._getLocalizedLabels("Times") : ", ";
            }
            else if (this.element.find('.e-recuruntil').ejRadioButton("model.checked")) {
                var _count1 = this._findRecurCount(interval, _weekRule, this);
                recurRules += ";COUNT=" + _count1;
                endRecur = _count1 ? ", " + _count1 + " " + this._getLocalizedLabels("Times") : ", ";
            }
            var _every = (this._rRuleFreq != "WEEKDAYS" ? this._getLocalizedLabels("Every") : "") + " " + (interval > 1 ? interval + " " : "");
            var _rRuleStr = _every + this.element.find(".e-recurRule").html() + recurOption + endRecur;
            this._recRule = recurRules;
            return _rRuleStr;
        };
        return RecurrenceEditor;
    }(ej.WidgetBase));
    ej.widget("ejRecurrenceEditor", "ej.RecurrenceEditor", new RecurrenceEditor());
})(jQuery);
ej.RecurrenceEditor.Locale = {};
ej.RecurrenceEditor.Locale["en-US"] = {
    Repeat: "Repeat",
    Never: "Never",
    Daily: "Daily",
    Weekly: "Weekly",
    Monthly: "Monthly",
    Yearly: "Yearly",
    First: "First",
    Second: "Second",
    Third: "Third",
    Fourth: "Fourth",
    Last: "Last",
    EveryWeekDay: "Every weekday",
    Every: "Every",
    RecurrenceDay: "Day(s)",
    RecurrenceWeek: "Week(s)",
    RecurrenceMonth: "Month(s)",
    RecurrenceYear: "Year(s)",
    RepeatOn: "Repeat on",
    RepeatBy: "Repeat by",
    StartsOn: "Starts on",
    Times: "times",
    Ends: "Ends",
    Day: "Day",
    The: "The",
    OfEvery: "Of",
    After: "After",
    On: "On",
    Occurrence: "Occurrence(s)",
    Until: "Until"
};
