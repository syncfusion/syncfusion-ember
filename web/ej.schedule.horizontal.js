(function ($, ej, undefined) {
    ej.scheduleFeatures = ej.scheduleFeatures || {};

    var horizontalHeaderTemplate = function () {
        return ("{{if multiRes == true}}<td class = 'e-horizontalheader'><div class='e-horizontalresheader'>{{:label}}</div></td>{{else}}{{/if}}" +
                "<td class='e-horizontaldaterender'><div class='e-horizontaltimecells {{:heightclass}}'>" +
                "<div class='e-headerdays' style='position:absolute;'>" +
                "<table class ='e-table {{:tablelayout}}'style='width:100%;border-collapse:separate;table-layout:fixed;'><tbody>{{if view !== 'month'}}" +
                "<tr style='width:100%;'> <td>{{if view === 'day'}}<table style='width:100%;'>{{else}}<table class='e-table'>{{/if}}<tbody><tr> {{for cols ~headercellWidth = headercellWidth}}<td class='e-headercells {{:cellToday}} e-horizontalheadertddate'><div class='{{:currentDateClass}} e-horizontalheaderdiv'>{{:currentDay}}</div></td>{{/for}} </tr></tbody></table></td> </tr>" +
                "<tr style='width:100%;position:absolute;'> <td><table class ='e-table e-horizontaltabletimecell' style='border-collapse:collapse;'><tbody><tr> {{for timeTdCount  ~columnvalue =column  }}{{for ~name=time ~dayend=timecellclass ~index=#getIndex() }}<td class='e-horizontaltimetd {{:~dayend}}'><div style='width:{{:timeCellWidth}}'><span class ='e-horizontaltimespan'>{{:~name.slice(0,2)}}</span><div class ='e-horizontaltimespandiv'>{{:~name.slice(3,5)}}</div></div></td>{{for ~columnvalue[~index] ~width = timeCellWidth}}<td class='e-horizontalalternatetd'><div style='width:{{:~width}}'></div></td>{{/for}}{{/for}}{{/for}}  </tr></tbody></table></td> </tr>{{/if}}" +
                "{{if view == 'month'}}<tr>{{for cols}}<td class='e-headercells e-horizontmonthheaderdatetd {{:cellToday}}'><div title='{{:title}}' class='e-dateheadercell e-horizontmonthdatealign'>{{:currentDate}}</div></td>{{/for}}</tr>" +
                "<tr>{{for cols}}<td class ='e-horizontmonthheaderdaytd' style='width:{{:cellWidth}}'><div class='e-dateheadercell e-horizontmonthdatealign' title='{{:daynameTitle}}'>{{:currentDay}}</div></td>{{/for}}</tr>" +
                "{{/if}}</tbody></table></div></div></td>");
    };
    var userTimeCellsHoriTemplate = function () {
        return ("{{if multiRes == true}}<td class = 'e-horizontalheader'><div class='e-horizontalresheader'>{{:label}}</div></td>{{else}}{{/if}}" +
                "<td class='e-horizontaldaterender'><div class='e-horizontaltimecells {{:heightclass}}'>" +
                "<div class='e-headerdays' style='position:absolute;'>" +
                "<table class ='e-table' style='width:100%;border-collapse:separate;table-layout:fixed;'><tbody>{{if view !== 'month'}}" +
                "<tr style='width:100%;'> <td>{{if view === 'day'}}<table style='width:100%;'>{{else}}<table class='e-table'>{{/if}}<tbody><tr> {{for cols ~headercellWidth = headercellWidth}}<td class='e-headercells {{:cellToday}} e-horizontalheadertddate'><div class='{{:currentDateClass}} e-horizontalheaderdiv'>{{:currentDay}}</div></td>{{/for}} </tr></tbody></table></td> </tr>" +
                "<tr style='width:100%;position:absolute;'> <td><table class='e-table e-horizontaltabletimecell' style='border-collapse:collapse;'><tbody><tr> {{for timeTdCount  ~userTemplateId = userTemplateId  ~template=template  ~columnvalue =column}}{{for ~name=time ~names=times ~dayend=timecellclass ~index=#getIndex() }}<td class='e-horizontaltimetd {{:~dayend}}'><div style='width:{{:timeCellWidth}}'><span class ='e-horizontaltimespan'>{{:~name}}</span><div class ='e-horizontaltimespandiv'></div></div></td>{{for ~columnvalue[~index] ~width = timeCellWidth ~names=~names}}<td class='e-horizontalalternatetd' style='vertical-align:middle !important;'><div style='width:{{:~width}};' > {{if ~template ==true || ~userTemplateId==true }}{{:~names[#getIndex()]}}{{else}}</div>{{/if}}</td>{{/for}}{{/for}}{{/for}}  </tr></tbody></table></td> </tr>{{/if}}" +
                "{{if view == 'month'}}<tr>{{for cols}}<td class='e-headercells e-horizontmonthheaderdatetd {{:cellToday}}'><div class='e-dateheadercell e-horizontmonthdatealign'>{{:currentDate}}</div></td>{{/for}}</tr>" +
                "<tr>{{for cols}}<td class ='e-horizontmonthheaderdaytd'><div class='e-dateheadercell e-horizontmonthdatealign' style='width:{{:cellWidth}}'>{{:currentDay}}</div></td>{{/for}}</tr>" +
                "{{/if}}</tbody></table></div></div></td>");
    };

    var horizontalResourceHeaderTemplate = function () {
        return ("<div class ='e-horizontresdiv'><div class='e-horires' style='height:100%'><table class='e-table e-resourceheadertable' style='width:100%;table-layout:fixed;'>" +
                "<tbody>{{for trs}}<tr class='e-horizontresheaderdiv'>{{for ~resname=name ~marginleft=marginleft }}{{if classname == 'e-parentnode'}}<td class='{{:classname}} resemptytd' style='width:25px;height:{{:cellHeight}}'></td>{{else}}<td class='resemptytd' style='width:25px;height:{{:cellHeight}}'></td>{{/if}}<td class='{{:classname}}' style='vertical-align:middle;height:{{:cellHeight}};'>" +
                "{{if classname == 'e-parentnode'}}<div id={{:idnum}} class='{{:classname}}category e-resourceicon e-resourcecollapse' style='width:20px;vertical-align:middle;float:left;margin-left:{{:~marginleft}};margin-top:2px;'></div>{{/if}}" +
                "<div class='e-resourceheadertext' style='text-align:left;margin-left:{{:~marginleft}};' title='{{if userResTemplId == true}}{{:name}}{{else}}{{:~resname}}{{/if}}'>{{if userResTemplId == true}}{{:userResHeader}}{{else}}{{:~resname}}{{/if}}</div>" +
                "</td>{{/for}}</tr>{{/for}}</tbody></table></div></div>");
    };
	
    var _addResourceTemplate = function () {
        return ("{{for trs}}<tr class='e-horizontresheaderdiv'>{{for ~resname=name ~marginleft=marginleft }}{{if classname == 'e-parentnode'}}<td class='{{:classname}} resemptytd' style='width:25px;height:{{:cellHeight}}'></td>{{else}}<td class='resemptytd' style='width:25px;height:{{:cellHeight}}'></td>{{/if}}<td class='{{:classname}}' style='vertical-align:middle;height:{{:cellHeight}};'>" +
        "{{if classname == 'e-parentnode'}}<div id={{:idnum}} class='{{:classname}}category e-resourceicon e-resourcecollapse' style='width:20px;vertical-align:middle;float:left;margin-left:{{:~marginleft}};margin-top:2px;'></div>{{/if}}" +
        "<div class='e-resourceheadertext' style='text-align:left;margin-left:{{:~marginleft}};' title='{{if userResTemplId == true}}{{:name}}{{else}}{{:~resname}}{{/if}}'>{{if userResTemplId == true}}{{:userResHeader}}{{else}}{{:~resname}}{{/if}}</div>" +
        "</td>{{/for}}</tr>{{/for}}");
    };

    var _addResourceCellsTemplate = function () {
        return ("{{for cellrows ~cols=cols ~hourdiff=hourdiff ~view=view ~classname=classname ~columnvalue=column ~userTemp=userTemplate ~userHtml=userHtml}}" +
        "{{if classname == 'e-parentnode'}} <tr class='e-resourceheadertr' >{{for ~cols ~value=#getIndex()}}{{if #index % ~hourdiff == 0 && #index != 0 && ~view !== 'month' }}<td class='e-resourceheadercells e-workcells e-parentworkcell e-dayend' style='width:{{:cellWidth}};height:{{:cellHeight}}'>{{else}}<td class='e-resourceheadercells e-workcells e-parentworkcell' style='width:{{:cellWidth}};height:{{:cellHeight}}'>{{/if}}{{if ~userTemp == true}}{{if ~view !== 'month'}}{{:~userHtml[~value][0][#getIndex()]}}{{else}}{{:~userHtml[~value][#getIndex()]}}{{/if}}{{/if}}</td>{{if ~view !== 'month' ~val=#index}}{{for ~columnvalue[#getIndex()] ~width = cellWidth}}<td class='e-resourceheadercells e-workcells e-parentworkcell e-alternateworkcell' style='width:{{:~width}};height:{{:cellHeight}}'>{{if ~userTemp == true}}{{:~userHtml[~value][1][~val][#getIndex()]}}{{/if}}</td>{{/for}}{{/if}}{{/for}}</tr>" +
        "{{else}}<tr >{{for ~cols ~value=#getIndex()}}{{if #index % ~hourdiff == 0 && #index != 0 && ~view !== 'month'  }}<td class='e-workcells e-childworkcell e-dayend' style='width:{{:cellWidth}};height:{{:cellHeight}}'>{{else}}<td class='e-workcells e-childworkcell' style='width:{{:cellWidth}};height:{{:cellHeight}}'>{{/if}}{{if ~userTemp == true}}{{if ~view !== 'month'}}{{:~userHtml[~value][0][#getIndex()]}}{{else}}{{:~userHtml[~value][#getIndex()]}}{{/if}}{{/if}}</td>{{if ~view !== 'month' ~val=#index}}{{for ~columnvalue[#getIndex()] ~width = cellWidth}}<td class='e-workcells e-childworkcell e-alternateworkcell' style='width:{{:~width}};height:{{:cellHeight}}'>{{if ~userTemp == true}}{{:~userHtml[~value][1][~val][#getIndex()]}}{{/if}}</td>{{/for}}{{/if}}{{/for}}" +
        "</tr>{{/if}}{{/for}}");
    };

    var horizontalCellsTemplate = function () {
        return ("<table class='e-table e-workcellstab'>" +
                "<tbody>{{for cellrows ~cols=cols ~hourdiff=hourdiff ~view=view ~classname=classname ~columnvalue=column ~userTemp=userTemplate ~userHtml=userHtml}}" +
                "{{if classname == 'e-parentnode'}} <tr class='e-resourceheadertr' style='width:100%'>{{for ~cols ~value=#getIndex()}}{{if #index % ~hourdiff == 0 && #index != 0 && ~view !== 'month' }}<td class='e-resourceheadercells e-workcells e-parentworkcell e-dayend' style='width:{{:cellWidth}};height:{{:cellHeight}}'>{{else}}<td class='e-resourceheadercells e-workcells e-parentworkcell' style='width:{{:cellWidth}};height:{{:cellHeight}}'>{{/if}}{{if ~userTemp == true}}{{if ~view !== 'month'}}{{:~userHtml[~value][0][#getIndex()]}}{{else}}{{:~userHtml[~value][#getIndex()]}}{{/if}}{{/if}}</td>{{if ~view !== 'month' ~val=#index}}{{for ~columnvalue[#getIndex()] ~width = cellWidth}}<td class='e-resourceheadercells e-workcells e-parentworkcell e-alternateworkcell' style='width:{{:~width}};height:{{:cellHeight}}'>{{if ~userTemp == true}}{{:~userHtml[~value][1][~val][#getIndex()]}}{{/if}}</td>{{/for}}{{/if}}{{/for}}</tr>" +
                "{{else}}<tr style='width:100%'>{{for ~cols ~value=#getIndex()}}{{if #index % ~hourdiff == 0 && #index != 0 && ~view !== 'month'  }}<td class='e-workcells e-childworkcell e-dayend' style='width:{{:cellWidth}};height:{{:cellHeight}}'>{{else}}<td class='e-workcells e-childworkcell' style='width:{{:cellWidth}};height:{{:cellHeight}}'>{{/if}}{{if ~userTemp == true}}{{if ~view !== 'month'}}{{:~userHtml[~value][0][#getIndex()]}}{{else}}{{:~userHtml[~value][#getIndex()]}}{{/if}}{{/if}}</td>{{if ~view !== 'month' ~val=#index}}{{for ~columnvalue[#getIndex()] ~width = cellWidth}}<td class='e-workcells e-childworkcell e-alternateworkcell' style='width:{{:~width}};height:{{:cellHeight}}'>{{if ~userTemp == true}}{{:~userHtml[~value][1][~val][#getIndex()]}}{{/if}}</td>{{/for}}{{/if}}{{/for}}" +
                "</tr>{{/if}}{{/for}}</tbody></table>");
    };

    ej.scheduleFeatures.horizontal = {

        _renderHorizontalTemplates: function () {
            this.horizontalHeader = $.templates(horizontalHeaderTemplate());
            this.cellTemplate = $.templates(horizontalCellsTemplate());
            this.horizontalResHeader = $.templates(horizontalResourceHeaderTemplate());
            this.addResourceTemplate = $.templates(_addResourceTemplate());
            this.addResourceCellsTemplate = $.templates(_addResourceCellsTemplate());
            this.userTimeCellHoriTemplate = $.templates(userTimeCellsHoriTemplate());
        },

        _horizontalViewNavigation: function (e) {
            var currentDateIndex, navidate;
            if (e.type == "click") {
                if (this.currentView() === "week" || this.currentView() === "workweek" || (this.currentView() === "customview" && this._renderDays <= 7)) {
                    this.element.find(".e-headercells").children().removeClass("e-activeview");
                    currentDateIndex = e.currentTarget.cellIndex;
                    navidate = new Date(this._dateRender[currentDateIndex]);
                    if (this.model.minDate <= navidate && this.model.maxDate >= navidate) {
                        (this.model.timeScale.enable) && $(e.currentTarget).children().addClass("e-activeview");
                        this.currentDate(navidate);
                    }
                    else { return false; }
                    this._businessHourScroller();
                }
                else if (this.currentView() == "month" || (this._isCustomMonthView())) {
                    currentDateIndex = e.currentTarget.cellIndex;
                    if (this.model.views.indexOf("day") == -1) return false;
                    navidate = new Date(this.monthDays[currentDateIndex]);
                    if (this.model.minDate <= navidate && this.model.maxDate >= navidate)
                        this.currentDate(navidate);
                    else { return false; }
                    this._navView = true;
                    this._viewChange(e, this.currentView(), "day");
                }
            }
            else if (e.type == "dblclick") {
                if (this.currentView() === "week" || this.currentView() === "workweek" || (this.currentView() === "customview" && this._renderDays <= 7)) {
                    var target = $(e.target);
                    var dayTarget = target.hasClass("e-headercells") ? target : target.parent().hasClass("e-headercells") ? target.parent() : target.parent().parent();
                    if (this.model.views.indexOf("day") == -1 || !dayTarget.hasClass("e-headercells")) return false;
                    navidate = new Date(this._dateRender[dayTarget.index()]);
                    if (this.model.minDate <= navidate && this.model.maxDate >= navidate)
                        this.currentDate(navidate);
                    else { return false; }
                    this._navView = true;
                    this._viewChange(e, this.currentView(), "day");
                }
            }
        },

        _renderHorizontalHeaderDays: function (localizeDays) {
            this.element.find(".e-headercells").addClass("e-dateheaderselect");
            if (this.currentView() !== "month" && !(this._isCustomMonthView())) {
                this.element.find(".e-currentdayhighlight").removeClass("e-currentdayhighlight");
                var curday, temp;
                if (!ej.isNullOrUndefined(this.model.dateHeaderTemplateId)) {
                    var columns = this._getUserDateheaderTemplate();
                    for (var i = 0; i < this._dateRender.length; i++) {
                        $(this.element.find(".e-headercells")[i]).find("div")[0].innerHTML = columns[i].currentDay;
                        if (new Date(new Date(this._dateRender[i]).setHours(0, 0, 0, 0)).getTime() == new Date(new Date().setHours(0, 0, 0, 0)).getTime())
                            $(this.element.find("td.e-headercells")[i]).addClass("e-currentdayhighlight");
                    }
                }
                else {
                    this.element.find(".e-headercells").children().removeClass("e-activeview");
                    for (var i = 0; i < this._dateRender.length; i++) {
                        curday = (this._mediaQuery && (this.currentView() == "week" || this.currentView() == "workweek")) ? this._dayNames[new Date(this._dateRender[i]).getDay()].split("")[0] : (this.currentView() === "day") ? (this._tempResource.length == 0 && ej.isNullOrUndefined(this.model.group)) ? localizeDays.calendar.days.names[new Date(this._dateRender[i]).getDay()] : this._dayShortNames[new Date(this._dateRender[i]).getDay()] : this._dayShortNames[new Date(this._dateRender[i]).getDay()];
                        if (this.model.timeScale.enable)
                            temp = (this._mediaQuery && (this.currentView() == "week" || this.currentView() == "workweek")) ? curday + parseInt(ej.format(new Date(this._dateRender[i]), "dd", this.model.locale)) : this.currentView() === "day" ? (this._tempResource.length == 0 && ej.isNullOrUndefined(this.model.group)) ? curday + " " + ej.format(new Date(this._dateRender[i]), "dd MMMM yyyy", this.model.locale) : curday + " " + ej.format(new Date(this._dateRender[i]), "dd MMM yy", this.model.locale) : curday + " " + new Date(this._dateRender[i]).getDate();
                        else
                            temp = (this._mediaQuery && (this.currentView() == "week" || this.currentView() == "workweek")) ? curday + parseInt(ej.format(new Date(this._dateRender[i]), "dd", this.model.locale)) : this.currentView() === "day" ? (this._tempResource.length == 0 && ej.isNullOrUndefined(this.model.group)) ? ej.format(new Date(this._dateRender[i]), "dd MMMM yyyy", this.model.locale) : ej.format(new Date(this._dateRender[i]), "dd MMM yy", this.model.locale) : ("0" + new Date(this._dateRender[i]).getDate()).slice(-2);
                        $(this.element.find(".e-headercells")[i]).find("div")[0].innerHTML = temp;
                        if (new Date(new Date(this._dateRender[i]).setHours(0, 0, 0, 0)).getTime() == new Date(new Date().setHours(0, 0, 0, 0)).getTime())
                            $(this.element.find("td.e-headercells")[i]).addClass("e-currentdayhighlight");
                        if (new Date(new Date(this._dateRender[i]).setHours(0, 0, 0, 0)).getTime() == new Date(this.currentDate().setHours(0, 0, 0, 0)).getTime())
                            $(this.element.find(".e-headercells")[i]).children().addClass("e-activeview");
                    }
                }
                var currentDate = new Date(this.currentDate());
                if (this.model.orientation == "horizontal" && this.currentView() != "month" && this.model.timeScale.enable) {
                    if (new Date(this.currentDate()).getTime() == new Date(new Date().setHours(0, 0, 0, 0)).getTime()) {
                        this.element.find(".e-headercells").children().removeClass("e-activeview");
                        this.element.find(".e-currentdayhighlight").children().addClass("e-activeview");
                    }
                    var active = this.element.find(".e-headercells").children(".e-activeview").parent().index();
                    this.element.find(".e-headercells").children().removeClass("e-activeview");
                    var index = this.currentView() === "day" ? 0 : this.currentView() === "workweek" ? currentDate.getDay() - 1 : this.currentView() === "week" ? currentDate.getDay() : active;
                    this.currentView() != "day" && $(this.element.find(".e-headercells")[index]).children().addClass("e-activeview");
                    new Date(new Date(this.currentDate()).setHours(0, 0, 0, 0)).getTime() === new Date(new Date().setHours(0, 0, 0, 0)).getTime() ? $(this.element.find("td.e-horizontalheadertddate")[index]).addClass("e-headerToday") : "";
                }
            }
            else {
                var monthDays = this.monthDays;
                for (var i = 0; i < monthDays.length; i++) {
                    if (new Date(new Date(monthDays[i]).setHours(0, 0, 0, 0)).getTime() == new Date(new Date().setHours(0, 0, 0, 0)).getTime())
                        $(this.element.find("td.e-headercells")[i]).addClass("e-currentdayhighlight");
                }
            }
        },

        _horizontalScroll: function (e, proxy) {
            proxy._horizontalScrollValue = e.scrollData.scrollable;
            proxy._horizontalScrollValue = e.scrollData.scrollable;
            if (ej.isNullOrUndefined(e.scrollLeft)) return;
            if (proxy.currentView() == "day" || proxy.currentView() == "week" || proxy.currentView() == "workweek" || (proxy.currentView() === "customview" && proxy._renderDays <= 7)) {
                var currentDateIndex = $(proxy.element.find(".e-headercells").find(".e-activeview").parent()).index();
                var index = 0;
                if (proxy.model.enableRTL) {
                    var leftValue = (ej.browserInfo().name == "mozilla") ? Math.abs(e.scrollLeft) : e.scrollData.scrollable - e.scrollLeft;
                    proxy.element.find(".e-horizontaltimecells").find("table tr").eq(2).css("left", leftValue - 1 + "px");
                    index = Math.floor((Math.abs(leftValue) / (proxy.element.find(".e-workcells").width() + 1)) / ((proxy.model.endHour - proxy.model.startHour) * proxy.model.timeScale.minorSlotCount));
                }
                else {
                    proxy.element.find(".e-horizontaltimecells").find("table tr").eq(2).css("left", (-e.scrollLeft) + "px");
                    index = Math.floor((Math.abs(e.scrollLeft) / (proxy.element.find(".e-workcells").width())) / ((proxy.model.endHour - proxy.model.startHour) * proxy.model.timeScale.minorSlotCount * (60 / proxy.model.timeScale.majorSlot)));
                }
                if (e.scrollData.scrollable - e.scrollLeft == 0) return;
                if (proxy.currentView() != "day" && currentDateIndex !== index)
                    proxy.element.find(".e-headercells").children().removeClass("e-activeview");
                (proxy.currentView() != "day") && $(proxy.element.find(".e-headercells")[index]).children().addClass("e-activeview");
                (!proxy.model.timeScale.enable) && proxy.element.find(".e-headercells").children().removeClass("e-activeview");
            }
        },

        _getHorizontalheaderCellCount: function (weekcols) {
            var cols = [];
            this._isCustomMonthView();
            if (!ej.isNullOrUndefined(this.model.dateHeaderTemplateId) && (this.currentView() == "day" || this.currentView() == "week" || this.currentView() == "workweek" || (this.currentView() == "customview" && this._oneWeek))) {
                cols = this._getUserDateheaderTemplate();
            }
            else {
                var curday, headerCellClass, temp;
                for (var i = 0; i < this._dateRender.length; i++) {
                    curday = (this._mediaQuery && (this.currentView() == "week" || this.currentView() == "workweek")) ? this._dayNames[new Date(this._dateRender[i]).getDay()].split("")[0] : (this.currentView() === "month" || this.currentView() === "day" || (this._isCustomMonthView())) ? (this._tempResource.length == 0 && ej.isNullOrUndefined(this.model.group)) ? weekcols.calendar.days.names[new Date(this._dateRender[i]).getDay()] : this._dayShortNames[new Date(this._dateRender[i]).getDay()] : this._dayShortNames[new Date(this._dateRender[i]).getDay()];
                    headerCellClass = (new Date(new Date(this._dateRender[i]).setHours(0, 0, 0, 0)).getTime() === new Date(new Date().setHours(0, 0, 0, 0)).getTime()) ? "e-headerToday e-currentdayhighlight" : "";
                    temp = (this.currentView() === "month" || this._isCustomMonthView()) ? { currentDay: curday, currentDateClass: "", cellToday: headerCellClass, cellWidth: this.model.cellWidth } : (this.currentView() === "day") ? (this._tempResource.length == 0 && ej.isNullOrUndefined(this.model.group)) ? { currentDay: ej.format(new Date(this._dateRender[i]), this._pattern.D, this.model.locale), currentDateClass: "", cellToday: headerCellClass, cellWidth: this.model.cellWidth } : { currentDay: curday + " " + ej.format(new Date(this._dateRender[i]), "dd MMM yy", this.model.locale), currentDateClass: "", cellToday: headerCellClass, cellWidth: this.model.cellWidth } : { currentDay: (this._mediaQuery) ? curday + parseInt(ej.format(new Date(this._dateRender[i]), "dd", this.model.locale)) : curday + " " + new Date(this._dateRender[i]).getDate(), currentDateClass: new Date(this._dateRender[i]).getDate() === new Date(this.currentDate()).getDate() ? "e-activeview" : "", cellToday: headerCellClass, cellWidth: this.model.cellWidth };
                    cols.push(temp);
                }
            }
            return cols;
        },

        _getHoriStartEndTime: function (localizeAmPm) {
            var templateValue = !ej.isNullOrUndefined(this.model.timeScale.majorSlotTemplateId) || !ej.isNullOrUndefined(this.model.timeScale.minorSlotTemplateId)
            if (templateValue) {
                var userTemp = $.templates($(this.model.timeScale.majorSlotTemplateId).html());
                var userTemp1 = $.templates($(this.model.timeScale.minorSlotTemplateId).html());
            }
            var startendTimes = [];
            var headercellWidth = (!this.model.cellWidth) ? this._safariBrowser ? "29px" : "30px" : this._safariBrowser ? (parseInt(this.model.cellWidth) - 1 + "px") : this.model.cellWidth;
            var daysCount = this.currentView() == "week" ? (this.model.showWeekend) ? 7 : this.model.workWeek.length : this.currentView() == "day" ? 1 : (this.currentView() === "customview" && this._renderDays <= 7) ? this._dateRender.length : this.model.workWeek.length;
            for (var day = 0; day < daysCount; day++) {
                if (templateValue) {
                    var dateValue = new Date(new Date().setHours(0, 0, 0, 0));
                    var j = 0, timelist1 = [];
                    for (var i = this.model.startHour; i < this.model.endHour;) {
                        var value = this.model.timeScale.majorSlot + j;
                        var jvalue = j;
                        while (j < value) {
                            var jval = j;
                            j = j * 60 * 1000;
                            if (templateValue) {
                                if (jval == jvalue)
                                    var timelist = !ej.isNullOrUndefined(this.model.timeScale.majorSlotTemplateId) ? userTemp.render(object = { date: new Date(new Date(this._dateRender[0]).setHours(i, 0, 0, j)) }) : userTemp1.render(object = { date: new Date(new Date(this._dateRender[0]).setHours(i, 0, 0, j)) });
                                else if (!ej.isNullOrUndefined(this.model.timeScale.minorSlotTemplateId))
                                    timelist1.push(userTemp1.render(object = { date: new Date(new Date(this._dateRender[0]).setHours(i, 0, 0, j)) }).trim());

                            }
                            else {
                                if (this._timeMode == "12") {
                                    var timelist = ((i === this.model.startHour || i === 12) && (localizeAmPm.AM && localizeAmPm.PM) && j == 0) ? ej.format(new Date(new Date(dateValue).setHours(i, 0, 0, j)), "hh tt", this.model.locale) : ej.format(new Date(new Date(dateValue).setHours(i, 0, 0, j)), "hh:mm tt", this.model.locale);
                                    startendTimes.push({ time: timelist, id: i + "_" + j, timecellclass: ((i == this.model.startHour && day != 0 && j == 0)) ? "e-dayend" : "", cellWidth: (!this.model.cellWidth) ? "30px" : this.model.cellWidth, cellHeight: this.model.cellHeight, timeCellWidth: headercellWidth });
                                }
                                else
                                    startendTimes.push({ time: (i <= 9 ? "0" + i : i) + " 00", timecellclass: ((i % ((this.model.endHour - this.model.startHour) * this.model.timeScale.minorSlotCount)) == this.model.startHour && day != 0) ? "e-dayend" : "", cellWidth: (!this.model.cellWidth) ? "30px" : this.model.cellWidth, cellHeight: this.model.cellHeight, timeCellWidth: headercellWidth });
                            }
                            j = !ej.isNullOrUndefined(this.model.timeScale.majorSlotTemplateId) || !ej.isNullOrUndefined(this.model.timeScale.minorSlotTemplateId) ? (j / (60 * 1000)) + (this.model.timeScale.majorSlot / this.model.timeScale.minorSlotCount) : (j / (60 * 1000)) + this.model.timeScale.majorSlot;
                        }
                        i = (this.model.timeScale.majorSlot > 60) ? i + (this.model.timeScale.majorSlot / 60) : j >= 60 ? i + 1 : i;
                        j = (j >= 60) ? 0 : j;
                        if (templateValue) {
                            if (j == this.model.timeScale.majorSlot || j == 0) {
                                startendTimes.push({ time: timelist.trim(), times: timelist1, id: i + "_" + j, timecellclass: (((i - 1) == this.model.startHour) && day != 0 && j == 0) ? "e-dayend" : "", cellWidth: (!this.model.cellWidth) ? "30px" : this.model.cellWidth, cellHeight: this.model.cellHeight, timeCellWidth: headercellWidth });
                                timelist1 = [];
                            }
                        }
                    }
                }
                else {
                    var dateValue = new Date(new Date().setHours(0, 0, 0, 0));
                    for (var i = this.model.startHour; i < this.model.endHour;) {
                        var j = ej.isNullOrUndefined(j) ? 0 : j % 60;
                        while (j < 60) {
                            j = j * 60 * 1000;
                            if (this._timeMode == "12") {
                                var timelist = ((i === this.model.startHour || i === 12) && (localizeAmPm.AM && localizeAmPm.PM) && j == 0) ? ej.format(new Date(new Date(dateValue).setHours(i, 0, 0, j)), "hh tt", this.model.locale) : ej.format(new Date(new Date(dateValue).setHours(i, 0, 0, j)), "hh:mm tt", this.model.locale);
                                startendTimes.push({ time: timelist, id: i + "_" + j, timecellclass: ((i == this.model.startHour && day != 0 && j == 0)) ? "e-dayend" : "", cellWidth: (!this.model.cellWidth) ? "30px" : this.model.cellWidth, cellHeight: this.model.cellHeight, timeCellWidth: headercellWidth });
                            }
                            else{
                                var min = j/(60*1000);
                                startendTimes.push({ time: (Math.floor(i) <= 9 ? "0" + Math.floor(i) :Math.floor( i)) + "." + ((min == 0) ? min + "0" : min) + " 00", timecellclass: ((i % ((this.model.endHour - this.model.startHour) * this.model.timeScale.minorSlotCount)) == this.model.startHour && day != 0) ? "e-dayend" : "", cellWidth: (!this.model.cellWidth) ? "30px" : this.model.cellWidth, cellHeight: this.model.cellHeight, timeCellWidth: headercellWidth });
                            }
                            j = (j / (60 * 1000)) + this.model.timeScale.majorSlot;
                        }
                        i = (this.model.timeScale.majorSlot > 60) ? parseFloat((i + (this.model.timeScale.majorSlot / 60)).toFixed(2))  : i + 1;
                        i = Math.ceil(((i < 1.0) ? i : (i % Math.floor(i))) * 100) >= 98 ? i + 0.02 : i;
                    }
                }
            }
            return startendTimes;
        },

        _getHorizontalDayAppointments: function (appointmentsList, dateCount, day, res) {
            var resAvail = [];
            for (var app = 0; app < appointmentsList.length; app++) {
                if (!ej.isNullOrUndefined(this.model.group) && this._grouping.length > 1)
                    resAvail = new ej.DataManager(this._tempResource[this._tempResource.length - 1].resourceSettings.dataSource).executeLocal(new ej.Query().where(this._tempResource[this._tempResource.length - 1].resourceSettings.groupId, ej.FilterOperators.equal, appointmentsList[app][this._appointmentSettings["resourceFields"].split(",")[this._appointmentSettings["resourceFields"].split(",").length - 2]]));
                else resAvail = this.res1;
                if (resAvail.length != 0) {
                    if (new Date(new Date(dateCount[day]).setHours(0, 0, 0, 0)).getTime() == new Date(new Date(appointmentsList[app][this._appointmentSettings["startTime"]]).setHours(0, 0, 0, 0)).getTime() &&
                          new Date(new Date(dateCount[day]).setHours(0, 0, 0, 0)).getTime() <= new Date(new Date(appointmentsList[app][this._appointmentSettings["endTime"]]).setHours(0, 0, 0, 0)).getTime() && (!ej.isNullOrUndefined(this.model.group) && (this._tempResource.length != 0) && this._tempResource[0].resourceSettings.dataSource.length != 0 && ej.scheduleFeatures.resources) ? appointmentsList[app][this._appointmentSettings.resourceFields.toString().split(',')[this._tempResource.length - 1].trim()] == this.res1[res][this._tempResource[this._tempResource.length - 1].resourceSettings["id"]] : true &&
                               new Date(new Date(appointmentsList[app][this._appointmentSettings["startTime"]]).setHours(0, 0, 0, 0)).getTime() <= new Date(new Date(appointmentsList[app][this._appointmentSettings["endTime"]]).setHours(0, 0, 0, 0)).getTime()) {
                        this._renderApp(appointmentsList[app], day, res);
                    }
                }
            }
        },

        _horiGroupCollection: function () {
            if ((this._tempResource.length != 0)) {
                var rIndex, temp = this._resourceSort(), temp1 = this.res1;
                var temp2 = temp.filter(function (a) { return temp1.indexOf(a) === -1; });
                if (ej.isNullOrUndefined(this.model.group)) this.res1 = ["0"];
                return temp2;
            }
        },

        _renderHorizontalApp: function (rStartTime, rEndTime, record, day, cellHeight, timeScaleRowCount, startHour, endHour) {
            var headerCell = this.element.find(".e-workcellstab tr"), appHeight, appWidth, topPosition = 0, leftPosition;
            if (rStartTime <= rEndTime) {
                var startTime = ((new Date(rStartTime).getHours()) < startHour) ? (new Date(rStartTime).getHours() + (-new Date(rStartTime).getHours()) + (-new Date(rStartTime).getMinutes())) : (new Date(rStartTime).getHours() + (-startHour));
                var endTime = ((new Date(rEndTime).getHours()) > endHour) ? (new Date(rEndTime).getHours() + (-new Date(rEndTime).getHours() + (endHour - startHour)) + (-new Date(rEndTime).getMinutes())) : (new Date(rEndTime).getHours() + (-startHour));
                endTime = (new Date(rEndTime).getHours() == endHour) ? (new Date(endTime).getMinutes() + (-new Date(rEndTime).getMinutes())) : endTime;
                appHeight = (this.element.find(".e-appointment").length > 0 ? this.element.find(".e-appointment").outerHeight(true) : this._getElementHeight("e-appointment"));
                var level = 0;
                if (this.model.startHour <= new Date(rStartTime).getHours() && this.model.endHour > new Date(rStartTime).getHours()) {
                    var groupIndex = (!ej.isNullOrUndefined(this.model.group) && (this._tempResource.length != 0) && this._tempResource[0].resourceSettings.dataSource.length != 0 && this._grouping.length > 1) ? this._findResourceIndex(this._horiHeaderCollection, this._tempResource[this._tempResource.length - 2].resourceSettings["id"], record[this._appointmentSettings.resourceFields.toString().split(',')[this._tempResource.length - 2].trim()], null, null) + 1 : 0;
                    var resValue = (!ej.isNullOrUndefined(this.model.group) && (this._tempResource.length != 0) && this._tempResource[0].resourceSettings.dataSource.length != 0) ? (this._grouping.length == 1) ? this._findResourceIndex(this.res1, this._tempResource[this._tempResource.length - 1].resourceSettings["id"], record[this._appointmentSettings.resourceFields.toString().split(',')[this._tempResource.length - 1]], null, null) + 1 : this._findResourceIndex(this.res1, this._tempResource[this._tempResource.length - 1].resourceSettings.id, record[this._appointmentSettings.resourceFields.toString().split(',')[this._tempResource.length - 1].trim()], this._tempResource[this._tempResource.length - 1].resourceSettings.groupId, record[this._appointmentSettings.resourceFields.toString().split(',')[this._tempResource.length - 2].trim()]) + 1 : 1;
                    var userAppTemplId = (this.model.appointmentTemplateId) ? true : false;
                    var userTempHtml = (userAppTemplId) ? this._getUserAppointmentTemplate(record) : "";
                    appHeight = (!this.model.appointmentTemplateId) ? appHeight : ($(userTempHtml).css('height') == "100%" ? (!this.model.showOverflowButton ? this.initialCellHeight : (cellHeight - 15)) : $(userTempHtml).css('height') == "0px" ? appHeight : $(userTempHtml).height());
                    level = (ej.scheduleFeatures.resources && (this._tempResource.length != 0) && this._tempResource[0].resourceSettings.dataSource.length != 0 && !ej.isNullOrUndefined(this.model.group)) ? this._getOverlapCount(record, day, this._dateRender, record[this._appointmentSettings.resourceFields.toString().split(',')[this._tempResource.length - 1].trim()]) : this._getOverlapCount(record, day, this._dateRender, null);
                    this._renderedAllDay.push($.extend(true, {}, record));
                    topPosition = (level * appHeight) + topPosition;
                    var diffTime, diffDays, diffMinutes, cellIndex;
                    var dayLength = this.element.find('.e-workcellstab tr:first-child').children().length / this._dateRender.length;
                    var curIndex = Math.floor ((dayLength * day)+(((new Date(rStartTime).getHours() * 60) + new Date(rStartTime).getMinutes()) - this.model.startHour * 60) / Math.floor(this.model.timeScale.majorSlot/this.model.timeScale.minorSlotCount));
                    if (record[this._appointmentSettings["allDay"]]) {
                        diffTime = new Date(new Date(new Date(rEndTime).setHours(0, 0, 0, 0)).getTime()) - new Date(new Date(new Date(rStartTime).setHours(0, 0, 0, 0)).getTime());
                        diffDays = Math.round(diffTime / 86400000) + 1;
                        if (diffDays > this._dateRender.length)
                            diffDays = new Date(this._dateRender[this._dateRender.length - 1]).getDay() + 1 - new Date(rStartTime).getDay();
                        diffMinutes = ((endHour - startHour) * 60) * diffDays;
                        cellIndex = ((this.model.endHour - this.model.startHour) * (60 /  (this.model.timeScale.majorSlot / this.model.timeScale.minorSlotCount))) * day;
                        appWidth = (((diffMinutes / (this.model.timeScale.majorSlot / this.model.timeScale.minorSlotCount)) * this.cellwidth) + (diffMinutes / (this.model.timeScale.majorSlot / this.model.timeScale.minorSlotCount))) - 1;
                        leftPosition = "0";
                    }
                    else if (new Date(new Date(new Date(record[this._appointmentSettings["startTime"]]).setHours(0, 0, 0, 0)).getTime()) < new Date(new Date(new Date(record[this._appointmentSettings["endTime"]]).setHours(0, 0, 0, 0)).getTime())) {
                        var endDiffer = (new Date(rEndTime) < new Date(new Date(rEndTime).setHours(this.model.endHour, 0, 0)) && new Date(rEndTime) < new Date(new Date(rEndTime).setHours(this.model.startHour, 0, 0))) ? (((this.model.endHour) / 2) * 60) : ((new Date(rEndTime).getHours() * 60) + new Date(rEndTime).getMinutes());
                        var startDiffer = new Date(rStartTime) > new Date(new Date(rEndTime).setHours(this.model.startHour, 0, 0)) ? (this.model.startHour * 60) : ((new Date(rStartTime).getHours() * 60) + new Date(rStartTime).getMinutes());
                        var i = 1, rEnd, rStart, end, start, diffTime;
                        rEnd = this._dateRender.indexOf(new Date(rEndTime).setHours(0, 0, 0, 0));
                        rStart = this._dateRender.indexOf(new Date(rStartTime).setHours(0, 0, 0, 0));
                        if (rEnd == -1) {
                            while (i < 7) {
                                if (new Date(this._dateRender[this._dateRender.length - i]).getTime() < new Date(rEndTime).setHours(0, 0, 0, 0)) {
                                    end = this._dateRender.length - i;
                                    endDiffer = this.model.endHour * 60;
                                    break;
                                }
                                else i++;
                            }
                        }
                        else
                            end = rEnd;
                        if (rStart == -1) {
                            start = day;
                            startDiffer = this.model.startHour * 60;
                        }
                        else
                            start = rStart;
                        diffTime = end - start;
                        diffMinutes = ((((diffTime) * ((endHour - startHour)) * 60) - startDiffer) + endDiffer);
                        cellIndex = Math.floor((((this.model.endHour - this.model.startHour) * timeScaleRowCount) * (60 / this.model.timeScale.majorSlot) * day) + ((rStart == -1) ? 0 : startTime * timeScaleRowCount) * (60 / this.model.timeScale.majorSlot));
                        var majorTime = this.getSlotByElement(headerCell.eq(resValue + groupIndex - 1).children().eq(cellIndex));                        
                        appWidth = (((diffMinutes / (this.model.timeScale.majorSlot / this.model.timeScale.minorSlotCount)) * this.cellwidth) + (diffMinutes / (this.model.timeScale.majorSlot / this.model.timeScale.minorSlotCount))) - 1;
                        if (diffDays > this._dateRender.length) {
                            diffDays = new Date(this._dateRender[this._dateRender.length - 1]).getDay() + 1 - new Date(rStartTime).getDay();
                            diffMinutes = ((diffDays) * (endHour - startHour) * 60);
                            appWidth = diffMinutes / (this.model.timeScale.majorSlot / this.model.timeScale.minorSlotCount) * this.cellwidth + ((diffMinutes / (this.model.timeScale.majorSlot / this.model.timeScale.minorSlotCount)) - 3);
                        }
                        leftPosition = (rStart == -1 ? 0 : ((rStartTime.getHours()*60 + rStartTime.getMinutes()) -( majorTime.startTime.getHours()*60 + majorTime.startTime.getMinutes()))*(this.cellwidth/Math.floor(this.model.timeScale.majorSlot/this.model.timeScale.minorSlotCount)));
                    }
                    else {                        
                        var cellCount = Math.ceil((new Date(rStartTime).getMinutes() +  (new Date(rStartTime).getMilliseconds() / 60))/(Math.round(this.model.timeScale.majorSlot/this.model.timeScale.minorSlotCount))) - 1;                        
                        leftPosition =(((Math.ceil(this._deviceRatio()) - 1) > 0) ? (Math.round(cellCount/2)==0)? -1 : Math.round(cellCount/2) : cellCount );
                        if ((this.model.endHour - this.model.startHour) == 24)
                            var diffInMinutes = ((new Date(rEndTime).getHours() * 60) + new Date(rEndTime).getMinutes()) - ((new Date(rStartTime).getHours() * 60) + new Date(rStartTime).getMinutes());
                        else {
                            var endDiffer = ((new Date(rEndTime).getHours() * 60) + new Date(rEndTime).getMinutes()) > (this.model.endHour * 60) ? (this.model.endHour * 60) : ((new Date(rEndTime).getHours() * 60) + new Date(rEndTime).getMinutes());
                            var startDiffer = ((new Date(rStartTime).getHours() * 60) + new Date(rStartTime).getMinutes()) < (this.model.startHour * 60) ? (this.model.startHour * 60) : ((new Date(rStartTime).getHours() * 60) + new Date(rStartTime).getMinutes());
                            var diffInMinutes = endDiffer - startDiffer;
                        }
                        //diffInMinutes += 1;
                        var cellsCount= Math.round(diffInMinutes* (this.cellwidth/((this.model.timeScale.majorSlot/this.model.timeScale.minorSlotCount))) / this.cellwidth);
                        cellsCount = (cellsCount == 0) ? 1 : cellsCount;
						appWidth = (diffInMinutes <= 0) ? 0 : diffInMinutes / (this.model.timeScale.majorSlot / this.model.timeScale.minorSlotCount) * this.cellwidth + ((diffInMinutes / (this.model.timeScale.majorSlot / this.model.timeScale.minorSlotCount)) - 1);
                        appWidth = appWidth - (((Math.ceil(this._deviceRatio()) - 1) > 0) ? Math.sqrt(cellsCount - 1) : 0);
                        cellIndex = (curIndex >= dayLength)? curIndex - ((curIndex % dayLength) % timeScaleRowCount) : curIndex - (curIndex % timeScaleRowCount);
                        var cellIndexCalc = headerCell.eq(resValue + groupIndex - 1).children().eq(cellIndex);
                        if(!ej.isNullOrUndefined(cellIndexCalc[0])) {
                            var majorTime = this.getSlotByElement(cellIndexCalc);
                            leftPosition = leftPosition + ((rStartTime.getHours()*60 + rStartTime.getMinutes()) -( majorTime.startTime.getHours()*60 + majorTime.startTime.getMinutes()))*(this.cellwidth/Math.floor(this.model.timeScale.majorSlot/this.model.timeScale.minorSlotCount));
                        }
                    }
					//appWidth=appWidth<1?this.cellwidth:appWidth;
                    var colorAppointment = this._appointmentColor(record);
                    if (this.model.allowInline && (!ej.isNullOrUndefined(record["inline"]))) {
                        topPosition = (this._tempResource.length != 0) && this._tempResource[0].resourceSettings.dataSource.length != 0 && !ej.isNullOrUndefined(this.model.group) ? 0 : topPosition;
                        this._inlineTemplate(record, leftPosition, topPosition, appWidth, appHeight, colorAppointment, false);
                        var celltd = headerCell.eq(resValue + groupIndex - 1).children().eq(cellIndex);
                        celltd.prepend($("<div class='e-inlinewrapper'></div>").append(this._inlineText));
                    }
                    else {
                        if ((!ej.isNullOrUndefined(this.model.group) && (this._tempResource.length != 0) && this._tempResource[0].resourceSettings.dataSource.length != 0))
                            cellHeight = headerCell.eq((resValue + groupIndex) - 1).children()[cellIndex].offsetHeight + 1;
                        else cellHeight = cellHeight;
                        var indicationIcon = this._indicationApp(record);
                        if (topPosition + appHeight + 7 < cellHeight) {
                            var startTimeDisp = this._timeMode == "12" ? ej.format(new Date(record[this._appointmentSettings["startTime"]]), this._pattern.t, this.model.locale) : ej.format(new Date(record[this._appointmentSettings["startTime"]]), "HH:mm", this.model.locale),
                                endTimeDisp = this._timeMode == "12" ? ej.format(new Date(record[this._appointmentSettings["endTime"]]), this._pattern.t, this.model.locale) : ej.format(new Date(record[this._appointmentSettings["endTime"]]), "HH:mm", this.model.locale),
                                recEditIcon = (!ej.isNullOrUndefined(record[this._appointmentSettings["recurrenceRule"]])) ? record[this._appointmentSettings["recurrenceRule"]].toString().indexOf("RECUREDITID") != -1 : false,
                                timeCellhtml = $(this.appTemplate.render({ id: record["AppTaskId"], appResize: this.model.enableAppointmentResize, currentview: this.currentView(), rtl: this.model.enableRTL, ignoreColorFilter: (this._browserInfo.name == "msie" && this._browserInfo.version <= 9 && !colorAppointment.appointColor.applyFilter) ? true : false, subject: record[this._appointmentSettings["subject"]], startTime: startTimeDisp, endTime: endTimeDisp, left: leftPosition + "px", top: topPosition, appHeight: (this.model.appointmentTemplateId ? appHeight : ''), appWidth: appWidth + "px", userAppTemplId: userAppTemplId, userTemplate: userTempHtml, appClass: "e-appointment", appointData: colorAppointment.appointColor.appointData, appointCustomcss: colorAppointment.appointColor.appointCustomcss, appointtextcolor: colorAppointment.appointColor.appointtextcolor, value: colorAppointment.value, multiDiv: colorAppointment.multiDiv, orientation: this.model.orientation, priority: this.model.prioritySettings.enable ? record[this._appointmentSettings["priority"]] : '', enablePriority: this.model.prioritySettings["template"], priorityTemplate: this.model.prioritySettings["template"] ? this._priorityTemplate(record) : record[this._appointmentSettings['priority']], uid: record.Guid, recurrence: record[this._appointmentSettings["recurrence"]], recurrenceEdit: recEditIcon, leftInd: indicationIcon.leftIndication, rightInd: indicationIcon.rightIndication, resId: (!ej.isNullOrUndefined(this._appointmentSettings["resourceFields"])) ? record[this._appointmentSettings["resourceFields"].split(",")[this._appointmentSettings["resourceFields"].split(",").length - 1]] : "" })),
                                celltd = headerCell.eq(resValue + groupIndex - 1).children().eq(cellIndex);
                            (!ej.isNullOrUndefined(this.model.queryCellInfo)) && this._renderQueryCellInfo("appointment", record, timeCellhtml);
                            celltd.find("div.e-appointwrapper").length > 0 ? celltd.find("div.e-appointwrapper").append(timeCellhtml) : celltd.prepend($("<div class='e-appointwrapper'></div>").append(timeCellhtml));
                        }
                        else {
                            if (this.model.showOverflowButton) {
                                var overflowIconIndex = cellIndex + Math.round(new Date(rStartTime).getMinutes() / (this.model.timeScale.majorSlot / this.model.timeScale.minorSlotCount));
                                if ($("#" + this._id + "_" + ej.format(new Date(record[this._appointmentSettings["startTime"]]), "MM_dd_yyyy", this.model.locale) + "_" + (resValue + groupIndex - 1) + "_" + overflowIconIndex).length == 0) {
                                    var celltd = headerCell.eq(resValue + groupIndex - 1).children().eq(overflowIconIndex);
                                    var overflowhtml = '<div id="' + this._id + "_" + ej.format(new Date(record[this._appointmentSettings["startTime"]]), "MM_dd_yyyy", this.model.locale) + "_" + (resValue + groupIndex - 1) + "_" + overflowIconIndex + '" class="e-icon e-arrowhead-down e-appsoverflow" data-cellinfo="' + this._dateRender[day] + '"></div>';
                                    celltd.find("div.e-appointwrapper").length > 0 ? celltd.find("div.e-appointwrapper").append(overflowhtml) : celltd.prepend($("<div class='e-appointwrapper'></div>").append(overflowhtml));
                                    topPosition = cellHeight - this.element.find('.e-appsoverflow')[0].offsetHeight;
                                    this.element.find("#" + this._id + "_" + ej.format(new Date(record[this._appointmentSettings["startTime"]]), "MM_dd_yyyy", this.model.locale) + "_" + (resValue + groupIndex - 1) + "_" + overflowIconIndex).css(this.model.enableRTL ? "right" : "left", (this.cellwidth - 25) + "px").css("top", topPosition + "px");
                                }
                                $("#" + this._id + "_" + ej.format(new Date(record[this._appointmentSettings["startTime"]]), "MM_dd_yyyy", this.model.locale) + "_" + (resValue + groupIndex - 1) + "_" + overflowIconIndex).attr("data-appcount", level + 1);
                            }
                            else {
                                var celHeight = this.element.find(".e-workcellstab tr").eq(resValue + groupIndex - 1).children()[0].offsetHeight - 1;
                                this.element.find(".e-workcellstab tr").eq(resValue + groupIndex - 1).children().css('height', celHeight + appHeight + "px");
                                this.element.find(".e-resourceheadertable tr").eq(resValue + groupIndex - 1).find(".e-childnode").css('height', celHeight + appHeight + "px");
                                var startTimeDisp = (this._timeMode == "12") ? ej.format(new Date(record[this._appointmentSettings["startTime"]]), this._pattern.t, this.model.locale) : ej.format(new Date(record[this._appointmentSettings["startTime"]]), "HH:mm", this.model.locale),
                                    endTimeDisp = (this._timeMode == "12") ? ej.format(new Date(record[this._appointmentSettings["endTime"]]), this._pattern.t, this.model.locale) : ej.format(new Date(record[this._appointmentSettings["endTime"]]), "HH:mm", this.model.locale),
                                    recEditIcon = (!ej.isNullOrUndefined(record[this._appointmentSettings["recurrenceRule"]])) ? record[this._appointmentSettings["recurrenceRule"]].toString().indexOf("RECUREDITID") != -1 : false,
                                    timeCellhtml = $(this.appTemplate.render({ id: record["AppTaskId"], appResize: this.model.enableAppointmentResize, currentview: this.currentView(), rtl: this.model.enableRTL, subject: record[this._appointmentSettings["subject"]], startTime: startTimeDisp, endTime: endTimeDisp, left: leftPosition + "px", top: topPosition, appHeight: (this.model.appointmentTemplateId ? appHeight : ''), appWidth: appWidth + "px", userAppTemplId: userAppTemplId, userTemplate: userTempHtml, appClass: "e-appointment", appointData: colorAppointment.appointColor.appointData, appointCustomcss: colorAppointment.appointColor.appointCustomcss, appointtextcolor: colorAppointment.appointColor.appointtextcolor, value: colorAppointment.value, multiDiv: colorAppointment.multiDiv, orientation: this.model.orientation, priority: this.model.prioritySettings.enable ? record[this._appointmentSettings["priority"]] : '', enablePriority: this.model.prioritySettings["template"], priorityTemplate: this.model.prioritySettings["template"] ? this._priorityTemplate(record) : record[this._appointmentSettings['priority']], uid: record.Guid, recurrence: record[this._appointmentSettings["recurrence"]], recurrenceEdit: recEditIcon, leftInd: indicationIcon.leftIndication, rightInd: indicationIcon.rightIndication, resId: (!ej.isNullOrUndefined(this._appointmentSettings["resourceFields"])) ? record[this._appointmentSettings["resourceFields"].split(",")[this._appointmentSettings["resourceFields"].split(",").length - 1]] : "" })),
                                    celltd = headerCell.eq(resValue + groupIndex - 1).children().eq(cellIndex);
                                (!ej.isNullOrUndefined(this.model.queryCellInfo)) && this._renderQueryCellInfo("appointment", record, timeCellhtml);
                                celltd.find("div.e-appointwrapper").length > 0 ? celltd.find("div.e-appointwrapper").append(timeCellhtml) : celltd.prepend($("<div class='e-appointwrapper'></div>").append(timeCellhtml));
                                this._overflowFlag = true;
                            }
                        }
                    }
                    if (!ej.isNullOrUndefined(indicationIcon)) {
                        if (indicationIcon.leftIndication)
                            this.model.enableRTL ? this.element.find(".e-appointment").filter('div[data-guid=' + record.Guid + ']').find(".e-schedulemouseclose").css("margin-left", "11px") : this.element.find(".e-appointment").filter('div[data-guid=' + record.Guid + ']').find(".e-apptime,.e-apptext").css("margin-left", "13px");
                        if (indicationIcon.rightIndication)
                            this.model.enableRTL ? this.element.find(".e-appointment").filter('div[data-guid=' + record.Guid + ']').find(".e-apptime,.e-apptext").css("margin-right", "13px") : this.element.find(".e-appointment").filter('div[data-guid=' + record.Guid + ']').find(".e-schedulemouseclose").css("margin-right", "11px");
                    }
                    if (!ej.isNullOrUndefined(this.model.group) && this._grouping.length > 1 && ej.isNullOrUndefined(record["inline"]))
                        this._renderAppointmentCategory(this._horiHeaderCollection, groupIndex, cellIndex, record, appWidth, leftPosition);
                }
            }
        },

        _renderAppointmentCategory: function (resCollection, groupIndex, cellIndex, record, appWidth, leftPosition) {
            var appointColor, categoryClass, index = 0, rGroupId, resIndex, rObject = [], rIndex;
            this.element.find(".e-categorybar").filter("div[id=categorybar_" + record.Guid + "]").remove();
            var resHeaderHeight = this.element.find(".e-resourceheadercells")[0].offsetHeight;
            if (!ej.isNullOrUndefined(this.model.group) && this._grouping.length > 0) {
                appointColor = this._getResourceColor(record);
                categoryClass = (appointColor.appointData == "") ? "e-categorycolor" : "";
                groupIndex -= 1;
                appWidth = (this.currentView() == "month" || this._isCustomMonthView()) ? appWidth : appWidth + 2;
                do {
                    var celltd = this.element.find(".e-resourceheadertr").eq(groupIndex).find("td.e-workcells").eq(cellIndex);
                    var categorybarhtml = this.model.enableRTL ? ("<div class='e-categorybar " + categoryClass + "' id='categorybar_" + record.Guid + "' style='position:absolute;height:" + (resHeaderHeight) + "px;background:" + appointColor.appointData + ";width:" + appWidth + "px;right:" + leftPosition + "px;'></div>") : ("<div class='e-categorybar " + categoryClass + "' id='categorybar_" + record.Guid + "' style='position:absolute;height:" + (resHeaderHeight) + "px;background:" + appointColor.appointData + ";width:" + appWidth + "px;left:" + leftPosition + "px;'></div>");
                    celltd.find("div.e-appointwrapper").length > 0 ? celltd.find("div.e-appointwrapper").append(categorybarhtml) : celltd.prepend($("<div class='e-appointwrapper'></div>").append(categorybarhtml));
                    if (this._tempResource.length > 2) {
                        for (var a = this._tempResource.length - 2; a >= 0; a--) {
                            index = this._tempResource[a].resourceSettings.dataSource.indexOf(resCollection[groupIndex]);
                            if (index != -1) {
                                index = a;
                                rGroupId = this._tempResource[a].resourceSettings.groupId;
                                if (ej.isNullOrUndefined(rGroupId))
                                    return;
                                break;
                            }
                        }
                        resIndex = (index == 0) ? index : index - 1;
                        rObject = new ej.DataManager(resCollection).executeLocal(new ej.Query().where(this._tempResource[resIndex].resourceSettings.id, ej.FilterOperators.equal, resCollection[groupIndex][rGroupId]));
                        rIndex = this._tempResource[0].resourceSettings.dataSource.indexOf(rObject[0]);
                        if (rIndex == 0) {
                            rObject = [];
                            if (this._tempResource.length > 2) {
                                var celltd = this.element.find(".e-resourceheadertr").eq(rIndex).find("td.e-workcells").eq(cellIndex);
                                var categorybarhtml = this.model.enableRTL ? ("<div class='e-categorybar " + categoryClass + "' id='categorybar_" + record.Guid + "' style='position:absolute;height:" + (resHeaderHeight) + "px;background:" + appointColor.appointData + ";width:" + appWidth + "px;right:" + leftPosition + "px;'></div>") : ("<div class='e-categorybar " + categoryClass + "' id='categorybar_" + record.Guid + "' style='position:absolute;height:" + (this.element.find(".e-resourceheadercells")[0].offsetHeight) + "px;background:" + appointColor.appointData + ";width:" + appWidth + "px;left:" + leftPosition + "px;'></div>");
                                celltd.find("div.e-appointwrapper").length > 0 ? celltd.find("div.e-appointwrapper").append(categorybarhtml) : celltd.prepend($("<div class='e-appointwrapper'></div>").append(categorybarhtml));
                            }
                        }
                        else (rObject.length != 0) ? groupIndex = resCollection.indexOf(rObject[0]) : "";
                    }
                } while (rObject.length != 0)
            }
        },

        _getHorizontalOverlapCount: function (appointments, dateRender, day, record, resValue) {
            var filterData = [];
            for (var i = 0, len = appointments.length; i < len; i++) {
                if (ej.scheduleFeatures.resources && (this._tempResource.length > 0) && this._grouping.length > 0) {
                    if ((new Date(new Date(appointments[i][this._appointmentSettings["startTime"]]).setHours(0, 0, 0, 0)).getTime() <= new Date(new Date(dateRender[day]).setHours(0, 0, 0, 0)).getTime()) &&
                    (new Date(new Date(appointments[i][this._appointmentSettings["endTime"]]).setHours(0, 0, 0, 0)).getTime() >= new Date(new Date(dateRender[day]).setHours(0, 0, 0, 0)).getTime()) &&
                    (((new Date(record[this._appointmentSettings["startTime"]]) < new Date(appointments[i][this._appointmentSettings["startTime"]]) && new Date(record[this._appointmentSettings["endTime"]]) >= new Date(appointments[i][this._appointmentSettings["startTime"]])) ||
                        (new Date(record[this._appointmentSettings["startTime"]]) < new Date(appointments[i][this._appointmentSettings["endTime"]]) && new Date(record[this._appointmentSettings["endTime"]]) > new Date(appointments[i][this._appointmentSettings["endTime"]])) ||
                        (new Date(record[this._appointmentSettings["startTime"]]) >= new Date(appointments[i][this._appointmentSettings["startTime"]]) && new Date(record[this._appointmentSettings["startTime"]]) < new Date(appointments[i][this._appointmentSettings["endTime"]])) ||
                        (new Date(record[this._appointmentSettings["endTime"]]) > new Date(appointments[i][this._appointmentSettings["startTime"]]) && new Date(record[this._appointmentSettings["endTime"]]) < new Date(appointments[i][this._appointmentSettings["endTime"]])))
                        && ((resValue != null) ? (resValue == appointments[i][this._tempResource[this._tempResource.length - 1]["field"]]) : resValue == null))) {
                        filterData.push(appointments[i]);
                    }
                }
                else {
                    if ((new Date(new Date(appointments[i][this._appointmentSettings["startTime"]]).setHours(0, 0, 0, 0)).getTime() <= new Date(new Date(dateRender[day]).setHours(0, 0, 0, 0)).getTime()) &&
                    (new Date(new Date(appointments[i][this._appointmentSettings["endTime"]]).setHours(0, 0, 0, 0)).getTime() >= new Date(new Date(dateRender[day]).setHours(0, 0, 0, 0)).getTime()) &&
                    (((new Date(record[this._appointmentSettings["startTime"]]) < new Date(appointments[i][this._appointmentSettings["startTime"]]) && new Date(record[this._appointmentSettings["endTime"]]) >= new Date(appointments[i][this._appointmentSettings["startTime"]])) ||
                        (new Date(record[this._appointmentSettings["startTime"]]) < new Date(appointments[i][this._appointmentSettings["endTime"]]) && new Date(record[this._appointmentSettings["endTime"]]) > new Date(appointments[i][this._appointmentSettings["endTime"]])) ||
                        (new Date(record[this._appointmentSettings["startTime"]]) >= new Date(appointments[i][this._appointmentSettings["startTime"]]) && new Date(record[this._appointmentSettings["startTime"]]) < new Date(appointments[i][this._appointmentSettings["endTime"]])) ||
                        (new Date(record[this._appointmentSettings["endTime"]]) > new Date(appointments[i][this._appointmentSettings["startTime"]]) && new Date(record[this._appointmentSettings["endTime"]]) < new Date(appointments[i][this._appointmentSettings["endTime"]]))))) {
                        filterData.push(appointments[i]);
                    }
                }
            }
            return filterData;
        },

        _renderHorizontalHeaderBar: function () {
            var customview = this._isCustomMonthView(), view = this.model.timeScale.enable ? (this._isCustomMonthView()) ? "month" : this.currentView() : "month";
            var viewColCount = view == "day" ? 1 : view == "week" ? (this.model.showWeekend) ? 7 : this.model.workWeek.length : (this.currentView() === "customview" && this._renderDays <= 7) ? this._dateRender.length : this.model.workWeek.length;
            this._strTime = this._getStartEndTime();
            var colValue = this._columnTimeScale(this._strTime);
            this.datesColumn = this._getHeaderAllDayCellsCount();
            if (view === 'month' || (this._isCustomMonthView())) {
                this.datesColumn = [], this.monthDays = [], this.totdays = [];
                for (var i = 0; i < this._dateRender.length; i++) {
                    if (this.currentView() === "month" || (this._isCustomMonthView() && this._oneWeek)) {
                        if (new Date(this.currentDate()).getMonth() === new Date(this._dateRender[i]).getMonth())
                            this.totdays.push(this._dateRender[i]);
                    }
                    else
                        this.totdays.push(new Date(this._dateRender[i]));
                }
                var date = this.totdays.length;
                if (!ej.isNullOrUndefined(this.model.dateHeaderTemplateId) && (this.currentView() == "day" || this.currentView() == "week" || this.currentView() == "workweek" || (this.currentView() == "customview" && this._oneWeek))) {
                    var temp, columns = this._getUserDateheaderTemplate();
                    for (var i = 0; i < date; i++) {
                        temp = { currentDate: columns[i].currentDay, currentDateClass: "", currentDay: this.currentView() == "day" ? this._dayFullNames[new Date(this.totdays[i]).getDay()] : this._dayShortNames[new Date(this.totdays[i]).getDay()].toString(), cellWidth: !this.model.cellWidth ? "100%" : this.model.cellWidth, cellHeight: this.model.cellHeight, cellToday: (new Date(this.totdays[i]).getTime() == new Date(new Date().setHours(0, 0, 0, 0)).getTime() ? "e-currentdayhighlight" : "") };
                        this.datesColumn.push(temp);
                        this.monthDays.push(this.totdays[i]);
                    }
                }
                else {
                    var temp, curdate, headerCellClass;
                    for (var i = 0; i < date; i++) {
                        headerCellClass = (new Date(this.totdays[i]).getTime() == new Date(new Date().setHours(0, 0, 0, 0)).getTime()) ? "e-currentdayhighlight" : "";
                        curdate = customview && new Date(this.totdays[i]).getDate() == 1 ? (ej.format(new Date(this.totdays[i]), "MMM", this.model.locale) + " " + new Date(this.totdays[i]).getDate()) : ej.format(new Date(this.totdays[i]), "dd", this.model.locale);
                        if (this.model.timeScale.enable)
                            temp = { daynameTitle: ej.format(new Date(this.totdays[i]), "dddd", this.model.locale), title: new Date(this.totdays[i]).toDateString(), currentDate: curdate, currentDateClass: "", currentDay: this._dayFullNames[new Date(this.totdays[i]).getDay()].toString().slice(0, 1), cellWidth: (!this.model.cellWidth && this.currentView() != "month" && !(this._isCustomMonthView())) ? "30px" : this.model.cellWidth, cellHeight: this.model.cellHeight, cellToday: headerCellClass };
                        else {
                            if (this.currentView() == "day" || this.currentView() == "week" || this.currentView() == "workweek")
                                temp = { daynameTitle: ej.format(new Date(this.totdays[i]), "dddd", this.model.locale), title: new Date(this.totdays[i]).toDateString(), currentDate: curdate, currentDateClass: "", currentDay: this.currentView() == "day" ? this._dayFullNames[new Date(this.totdays[i]).getDay()] : this._dayShortNames[new Date(this.totdays[i]).getDay()].toString(), cellWidth: !this.model.cellWidth ? "100%" : this.model.cellWidth, cellHeight: this.model.cellHeight, cellToday: headerCellClass };
                            else
                                temp = { daynameTitle: ej.format(new Date(this.totdays[i]), "dddd", this.model.locale), title: new Date(this.totdays[i]).toDateString(), currentDate: curdate, currentDateClass: "", currentDay: this._dayFullNames[new Date(this.totdays[i]).getDay()].toString().slice(0, 1), cellWidth: this.model.cellWidth, cellHeight: this.model.cellHeight, cellToday: headerCellClass };
                        }
                        this.datesColumn.push(temp);
                        this.monthDays.push(this.totdays[i]);
                    }
                }
            }
            var userTemplateId = ((!ej.isNullOrUndefined(this.model.timeScale.majorSlotTemplateId) && !ej.isNullOrUndefined(this.model.timeScale.minorSlotTemplateId)) || !ej.isNullOrUndefined(this.model.timeScale.minorSlotTemplateId)) ? true : false;
            var template = (!ej.isNullOrUndefined(this.model.timeScale.majorSlotTemplateId)) ? true : false;
            if (userTemplateId || template) {
                var userTemp = $.templates($(this.model.timeScale.minorSlotTemplateId).html());
                var userTemp1 = $.templates($(this.model.timeScale.majorSlotTemplateId).html());
                var timeValue1 = [], j = 0;
                for (var i = this.model.startHour; i < this.model.endHour;) {
                    var timeValue = [];
                    var value = this.model.timeScale.majorSlot + j;
                    var jvalue = j;
                    while (j < value) {
                        var jval = j;
                        j = j * 60 * 1000;
                        if (this._timeMode == "12") {
                            if (jval == jvalue && !ej.isNullOrUndefined(this.model.timeScale.majorSlotTemplateId))
                                timeValue.push(userTemp1.render(object = { date: new Date(new Date(this._dateRender[0]).setHours(i, 0, 0, j)) }).trim());
                            else
                                timeValue.push(userTemp.render(object = { date: new Date(new Date(this._dateRender[0]).setHours(i, 0, 0, j)) }).trim());
                        }
                        j = (j / 60000) + (this.model.timeScale.majorSlot / this.model.timeScale.minorSlotCount);
                    }
                    i = (this.model.timeScale.majorSlot > 60) ? i + (this.model.timeScale.majorSlot / 60) : j >= 60 ? i + 1 : i;
                    j = (j >= 60) ? 0 : j;
                    timeValue1.push(timeValue);
                }
                template = true;
            }
            var multiResources = ((this._tempResource.length != 0) && !ej.isNullOrUndefined(this.model.group) && this._tempResource[0].resourceSettings.dataSource.length != 0) ? true : false;
            if (userTemplateId || template)
                var html = this.userTimeCellHoriTemplate.render({ cols: this.datesColumn, label: this._getLocalizedLabels("Resources"), multiRes: multiResources, view: view, timeTdCount: this._strTime, colspan: view == "month" ? 1 : (this._strTime.length / viewColCount) * 2, heightclass: view == 'month' ? "e-horizontalmonthtimecellsht" : "e-horizontaltimecellsht", width: this.model.width, headercellWidth: view == "day" ? "100%" : "55px", column: colValue, userTemplateId: userTemplateId, template: template });
            else
                var html = this.horizontalHeader.render({ tablelayout: customview ? "e-fixedlayout" : '', cols: this.datesColumn, label: this._getLocalizedLabels("Resources"), multiRes: multiResources, view: view, timeTdCount: this._strTime, colspan: view == "month" ? 1 : (this._strTime.length / viewColCount) * 2, heightclass: view == 'month' ? "e-horizontalmonthtimecellsht" : "e-horizontaltimecellsht", width: this.model.width, headercellWidth: view == "day" ? "100%" : "55px", column: colValue });
            this.aTR.append(html);
        },

        _renderHorizontalContent: function ($contentAreaDiv, $contentTable, $contentBody, $contentTR, $WorkCellTD, $scrollerbarDiv) {
            var templateValue = !ej.isNullOrUndefined(this.model.timeScale.majorSlotTemplateId) || !ej.isNullOrUndefined(this.model.timeScale.minorSlotTemplateId);
            var trCount, resHtml, columnValue = [], value = (this.model.timeScale.majorSlot / this.model.timeScale.minorSlotCount);
            var strTime = this._strTime;
            columnValue = this._columnValue;
            if ((this._tempResource.length != 0) && !ej.isNullOrUndefined(this.model.group) && this._tempResource[0].resourceSettings.dataSource.length != 0) {
                resHtml = this._renderHorizontalResources();
                trCount = this._horiResources;
            }
            else {
                resHtml = "";
                trCount = [{ classname: "e-childnode" }];
            }
            var userTemplate = (!ej.isNullOrUndefined(this.model.workCellsTemplateId)) ? true : false;
            if (userTemplate) { var workHtml = this._getUserWorkCellsTemplate(); }
            var workCellhtml = this.cellTemplate.render({ cellrows: trCount, hourdiff: Math.ceil(((this.model.endHour - this.model.startHour)) * (60 / this.model.timeScale.majorSlot)), view: this.model.timeScale.enable ? (this._isCustomMonthView()) ? "month" : this.currentView() : "month", cols: (this.model.timeScale.enable ? this.currentView() == 'month' || (this._isCustomMonthView()) ? this.datesColumn : strTime : this.datesColumn), column: columnValue, userTemplate: userTemplate, userHtml: workHtml });
            if (resHtml == "")
                this.wTR.append(ej.buildTag('td').append($contentAreaDiv.append($contentTable.append($contentBody.append($contentTR.append($WorkCellTD.append($scrollerbarDiv.append(this.$WorkCellDiv.append(workCellhtml)))))))));
            else
                this.wTR.append(ej.buildTag('td.e-horizontalrestd', {}, {}, { width: "15%", height: "100%" }).append(resHtml)).append(ej.buildTag('td').append($contentAreaDiv.append($contentTable.append($contentBody.append($contentTR.append($WorkCellTD.append($scrollerbarDiv.append(this.$WorkCellDiv.append(workCellhtml)))))))));
        },
        _columnTimeScale: function (strTime) {
            this._columnValue = []; var _cols2 = [];
            var value = (this.model.timeScale.majorSlot / this.model.timeScale.minorSlotCount);
            var templateValue = !ej.isNullOrUndefined(this.model.timeScale.majorSlotTemplate) || !ej.isNullOrUndefined(this.model.timeScale.minorSlotTemplate);
            var userTemplateId = ((!ej.isNullOrUndefined(this.model.timeScale.majorSlotTemplate) && !ej.isNullOrUndefined(this.model.timeScale.minorSlotTemplate)) || !ej.isNullOrUndefined(this.model.timeScale.minorSlotTemplate)) ? true : false;
            var template = (!ej.isNullOrUndefined(this.model.timeScale.majorSlotTemplate)) ? true : false;
            if (!templateValue) {
                for (var j = 0; j < strTime.length; j++) {
                    for (var i = 0; i < this.model.timeScale.minorSlotCount - 1; i++) {
                        value = value + (this.model.timeScale.majorSlot / this.model.timeScale.minorSlotCount);
                        if (value >= (this.model.endHour - this.model.startHour) * 60) {
                            _cols2.push(i);                           
                             value = 0;
                             break;                            
                        }
                        else
                            _cols2.push(i);
                    }
                    this._columnValue.push(_cols2);
                    value = value + (this.model.timeScale.majorSlot / this.model.timeScale.minorSlotCount);
                    _cols2 = [];
                }
            }
            else {
                for (var j = 0; j < strTime.length; j++) {
                    this._columnValue.push(j);
                }
            }
            return this._columnValue;
        },

        _getResourceHeadTemplate: function (record) {
            var userTemp = $.templates($(this.model.resourceHeaderTemplateId).html());
            var userTempHtml = userTemp.render(record);
            return userTempHtml;
        },

        _renderHorizontalResources: function () {
            this._resCollect = []; this._horizontalResRender = []; this._horiResources = [];
            var view = this.currentView();
            var viewColCount = view == "day" ? 1 : view == "week" || view == "month" || (this._isCustomMonthView()) ? 7 : this.model.workWeek.length;
            var userResTemplId = (this.model.resourceHeaderTemplateId) ? true : false;
            if (!ej.isNullOrUndefined(this.model.group)) {
                if (this._grouping.length === 1) {
                    var index;
                    for (var i = 0; i < this._grouping.length; i++) {
                        index = this._findResourceIndex(this._tempResource, "name", this._grouping[i], null, null);
                    }
                    for (var i = 0; i < this._resourceInfo[index].dataSource.length; i++) {
                        this._horiResources.push({ cellHeight: this.model.cellHeight, name: this._resourceInfo[index].dataSource[i][this._resourceInfo[index].text], idnum: this._resourceInfo[index].dataSource[i][this._resourceInfo[index].id], classname: "e-childnode", marginleft: "10px", width: "10px", backgroundcolor: "", border: "1px solid #bbbcbb", bordertop: "", userResHeader: this._getResourceHeadTemplate($.extend(this._resourceInfo[index].dataSource[i], { classname: "e-childnode" })), userResTemplId: userResTemplId });
                        this._resCollect.push(this._resourceInfo[index].dataSource[i]);
                    }
                    this._horizontalResRender.push(this._resCollect);
                }
                else {
                    var tempResource1 = this._resourceSort();
                    for (var a = 0; a < tempResource1.length; a++) {
                        for (var b = 0; b < this.render_Resources.length; b++) {
                            var rIndex = this.render_Resources[b].indexOf(tempResource1[a]);
                            if (rIndex != -1) {
                                index = b;
                                break;
                            }
                        }
                        if (index == this.render_Resources.length - 1) {
                            this._horiResources.push({ cellHeight: this.model.cellHeight, name: tempResource1[a][this._tempResource[index].resourceSettings.text], classname: "e-childnode", marginleft: ((this._mediaQuery) ? (index * 11) : (index * 21)) + "px", width: "20px", backgroundcolor: "", border: "1px dotted #bbbcbb", bordertop: "", userResHeader: this._getResourceHeadTemplate($.extend(tempResource1[a], { classname: "e-childnode" })), userResTemplId: userResTemplId });
                            this._resCollect.push(tempResource1[a]);
                        }
                        else {
                            this._horiResources.push({ cellHeight: this.model.cellHeight, name: tempResource1[a][this._tempResource[index].resourceSettings.text], idnum: tempResource1[a][this._tempResource[index].resourceSettings.id] + "_" + tempResource1[a][this._tempResource[index].resourceSettings.groupId], classname: "e-parentnode", marginleft: (index * 10) + "px", width: "20px", backgroundcolor: "", border: "1px dotted #bbbcbb", bordertop: "", userResHeader: this._getResourceHeadTemplate($.extend(tempResource1[a], { classname: "e-parentnode" })), userResTemplId: userResTemplId });
                            this._resCollect.push(tempResource1[a]);
                        }
                    }
                    this._horizontalResRender.push(this._resCollect);
                }
            }
            else {
                for (var k = 0; k < this._tempResource.length; k++) {
                    this._horizontalResRender.push(this._tempResource[k].resourceSettings.dataSource);
                    this._resCollect.push(this._tempResource[k].resourceSettings.dataSource);
                }
            }
            var html = this.horizontalResHeader.render({ trs: this._horiResources });
            return html;
        },

        _horizontalResIcon: function () {
            var resCat = this.element.find(".e-parentnodecategory"), resId, cIndex, resAvail, count;
            for (var a = 0; a < resCat.length; a++) {
                resId = resCat[a].id.split("_")[0];
                for (var b = 0; b < this._tempResource.length; b++) {
                    cIndex = new ej.DataManager(this._tempResource[b].resourceSettings.dataSource).executeLocal(new ej.Query().where(this._tempResource[b].resourceSettings.id, ej.FilterOperators.equal, resId));
                    if (cIndex.length != 0) { cIndex = b; break; }
                }
                count = cIndex + 1;
                count = (count == this._tempResource.length) ? count - 1 : count;
                for (var c = 0; c < this._tempResource.length; c++) {
                    resAvail = new ej.DataManager(this._resourceSort()).executeLocal(new ej.Query().where(this._tempResource[count].resourceSettings.groupId, ej.FilterOperators.equal, resId));
                    if (resAvail.length == 0) { $(resCat[a]).removeClass("e-resourceicon e-resourcecollapse"); }
                    break;
                }
            }
        },

        _renderHorizontalCurrentTime: function () {
            if (this.currentView() !== "month" && !(this._isCustomMonthView())) {
                if (this.element.find("td.e-headerToday").length > 0) {
                    this.element.find('.e-horizontaltabletimecell').parent().append('<div id="' + this._id + '_HighlightCurrentTimeline" class="e-highlightcurrenttimeline" style="height: 92%; width: 2px; position: absolute; background-color: red; "></div>');
                    $('#' + this._id + '_HighlightCurrentTimeline').css("top", this.element.find('.e-headerdays tr')[1].offsetTop);
                }
            }
            else {
                var monthDays = this.monthDays;
                var target = this.element.find(".e-headerdays").find("table").find("td");
                for (var i = 0; i < monthDays.length; i++) {
                    if (new Date(new Date(monthDays[i]).setHours(0, 0, 0, 0)).getTime() === new Date(new Date().setHours(0, 0, 0, 0)).getTime())
                        $(target[i]).addClass("e-monthcurrenttime");
                }
            }
        },

        _horizontalTimePosition: function (temp, now) {
            if (temp.element.find("td.e-headerToday").length > 0) {
                var headertodaypos = temp.element.find("td.e-headerToday")[0].cellIndex;
                var cellIndex = (((temp.model.endHour - temp.model.startHour) * ((60 / temp.model.timeScale.majorSlot) * temp.model.timeScale.minorSlotCount)) * headertodaypos) + ((now.getHours() - temp.model.startHour) * ((60 / temp.model.timeScale.majorSlot) * temp.model.timeScale.minorSlotCount));
                var leftPosition = (parseFloat((now.getMinutes())) * (temp.element.find(".e-workcells")[1].offsetWidth) * temp.model.timeScale.minorSlotCount / temp.model.timeScale.majorSlot);
                $('#' + temp._id + '_HighlightCurrentTimeline').css("left", (cellIndex * temp.element.find(".e-workcells")[1].offsetWidth) + leftPosition);
            }
        },

        _horizontalBusinessHighlight: function (renderDates, bStartHour, bEndHour, timeRowsCount, target) {
            var tdLength = (ej.scheduleFeatures.resources && !ej.isNullOrUndefined(this.model.group) && (this._tempResource.length != 0) && this._tempResource[0].resourceSettings.dataSource.length != 0) ? this._horiResources.length : 1;
            if (this.currentView() !== "month" && !(this._isCustomMonthView()) && this.model.timeScale.enable) {
                var colCount =Math.ceil (((this.model.endHour - this.model.startHour) * 60) / (this.model.timeScale.majorSlot/this.model.timeScale.minorSlotCount));
                for (var res = 0; res < tdLength; res++) {
                    for (var k = 0; k < renderDates.length; k++) {
                        for (var j = 0; j < this.model.workWeek.length; j++) {
                            if (this._dayNamesArray.indexOf(this.model.workWeek[j]) == new Date(renderDates[k]).getDay()) {
                                var index = (k * colCount) + Math.ceil((bStartHour * timeRowsCount) + ((this.model.endHour - this.model.startHour) * timeRowsCount * 0));
                                if (index == 0) {
                                    (index == 0) && $($(this.element.find(".e-workcellstab tr")[res]).find(".e-workcells")[index]).addClass("e-businesshighlightworkcells");
                                    $($(this.element.find(".e-workcellstab tr")[res]).find(".e-workcells")[index]).nextAll(".e-workcells").slice(0, (((bEndHour * timeRowsCount) - (bStartHour * timeRowsCount)) - 1)).addClass("e-businesshighlightworkcells");
                                } else {
                                    $($(this.element.find(".e-workcellstab tr")[res]).find(".e-workcells")[index - 1]).nextAll(".e-workcells").slice(0, ((bEndHour * timeRowsCount) - (bStartHour * timeRowsCount))).addClass("e-businesshighlightworkcells");
                                }
                            }
                        }
                    }
                }
            }
            else {
                var monthDays = this.monthDays;
                target = this.element.find(".e-workcells"); target.removeClass("e-monthcellhighlight");
                for (var res = 0; res < tdLength; res++) {
                    for (var i = 0; i < monthDays.length; i++) {
                        for (var j = 0; j < this.model.workWeek.length; j++) {
                            if (this._dayNamesArray.indexOf(this.model.workWeek[j]) == new Date(monthDays[i]).getDay())
                                $($(this.element.find(".e-workcellstab tr")[res]).find(".e-workcells")[i]).addClass("e-monthcellhighlight");
                        }
                    }
                }
            }
        },

        _onResourceClick: function (e) {
            var index, target, hide, show, tempRes, resCount, pNode, newResCollection, resHeadTable = [], resWorkTable = [];;
            target = $(e.currentTarget);
            if (target.hasClass("e-resourceicon e-resourcecollapse")) {
                target.removeClass("e-resourceicon e-resourcecollapse").addClass("e-resourceicon e-resourceexpand");
                hide = true;
            }
            else {
                target.removeClass("e-resourceicon e-resourceexpand").addClass("e-resourceicon e-resourcecollapse");
                show = true;
            }
            if (!this.model.cellHeight) {
                this.element.find(".e-workcellstab").css('height', '100%');
                this.element.find(".e-resourceheadertable").css('height', '100%');
            }
            index = $(e.currentTarget).closest("td.e-parentnode").parent().index();
            newResCollection = this._getResourceCollection();
            for (var i = 0; i < newResCollection.length; i++) {
                tempRes = new ej.DataManager(this._tempResource[i].resourceSettings.dataSource).executeLocal(new ej.Query().where(this._tempResource[i].resourceSettings.id, ej.FilterOperators.equal, e.currentTarget.id.split("_")[0]));
                if (tempRes.length != 0) {
                    resCount = tempRes[0].count;
                    break;
                }
            }
            for (var a = 0; a < resCount; a++) {
                resHeadTable.push(this.element.find(".e-resourceheadertable tr")[index + a + 1]);
                resWorkTable.push(this.element.find(".e-workcellstab tr")[index + a + 1]);
            }
            for (var i = 0; i < resHeadTable.length ; i++) {
                if (hide) {
                    pNode = $(resHeadTable[i]).children().hasClass("e-parentnode");
                    if (pNode) $(resHeadTable[i]).find(".e-parentnodecategory").removeClass("e-resourceicon e-resourcecollapse").addClass("e-resourceicon e-resourceexpand");
                    if ($(resHeadTable[i]).is(":visible")) {
                        $(resHeadTable[i]).toggle();
                        $(resWorkTable[i]).toggle();
                    }
                }
                else {
                    pNode = $(resHeadTable[i]).children().hasClass("e-parentnode");
                    if (pNode) $(resHeadTable[i]).find(".e-parentnodecategory").removeClass("e-resourceicon e-resourceexpand").addClass("e-resourceicon e-resourcecollapse");
                    if ($(resHeadTable[i]).is(":hidden")) {
                        $(resHeadTable[i]).toggle();
                        $(resWorkTable[i]).toggle();
                    }
                }
            }
            this.element.find(".e-horires").height(this.element.find(".e-draggableworkarea").height());
            this._horizontalRender();
            if (this.model.cellHeight) this._reRenderScroller();
            if (this._mediaQuery) this.refreshScroller();
            this._horizontalResIcon();
            this.element.find("div.e-prevapp,div.e-nextapp").remove();
            this.element.find(".e-categorybar").height(this.element.find(".e-parentworkcell").height() - 3);
            this._businessHourScroller();
            this._renderAppointmentAll();
        },

    };

})(jQuery, Syncfusion);