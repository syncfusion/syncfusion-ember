(function ($, ej, undefined) {
    'use strict';
    ej.ganttChartFeatures = ej.ganttChartFeatures || {};
    ej.ganttChartFeatures.timescale = {

        /*Get timescale length with schedule mode type*/
        _getScheduleLength: function (scheduleMode) {
            var proxy = this,
                model = proxy.model;

            switch (scheduleMode) {
                case "week":
                    return (model.scheduleWeeks.length * proxy._scheduleWeekWidth);
                case "year":
                    return (proxy._scheduleYearWidth);
                case "month":
                    return (proxy._scheduleMonthWidth);
                case "day":
                    return (model.scheduleDays.length * (proxy.model.perHourWidth * 24));
                case "hour":
                    return ((model.scheduleHours.length) * (model.perMinuteWidth * proxy._totalInterval));
                default:
                    return (model.scheduleWeeks.length * proxy._scheduleWeekWidth);
            }
        },

        //Calculate schedulw width for all modes
        _updateScheduleWidth: function () {
            var proxy = this;
            proxy._scheduleWeekWidth = proxy._getWeekWidth();
            proxy._numOfWeeks = proxy._getNumberOftWeeks(this.model.projectStartDate, this.model.projectEndDate);
            proxy._scheduleYearWidth = proxy._getYearWidth();
            proxy._scheduleMonthWidth = proxy._getMonthWidth();
            proxy._totalWeekWidth = proxy._scheduleWeekWidth * proxy._numOfWeeks.length;
            proxy._balanceWidth = proxy._totalWeekWidth - proxy._scheduleMonthWidth;
            proxy._scheduleMonthWidth += proxy._balanceWidth;
        },

        /*Refresh all timescale header elements*/
        refreshChartHeader: function (startdate, enddate) {
            var proxy = this,
            model = proxy.model,
            scheduleMode = model.scheduleHeaderSettings.scheduleHeaderType,
            $colsgroup, $column, $thead,
            $tr, $td, $div, $table;
            proxy._updateScheduleWidth();
            /*Schedule mode - Chart Top header*/
            if (scheduleMode == "hour") {
                proxy._createScheduleTopHourTemplate();
            }
            else if (scheduleMode == "day") {
                proxy._createScheduleTopDayTemplate();
            }
            else if (scheduleMode == "week") {
                proxy._createScheduleWeekTemplate();
            }
            else if (scheduleMode == "month") {
                proxy._createScheduleTopMonthTemplate();
            }
            else if (scheduleMode == "year") {
                proxy._createScheduleYearTemplate();
            }

            startdate = startdate == null ? new Date() : startdate;
            enddate = enddate == null ? new Date(null) : enddate;
            proxy._$scheduleDiv.empty();
            $table = ej.buildTag("table.e-schedule-headerrow-week e-zerospacing", "",
                { 'display': 'block' }
            );

            $colsgroup = ej.buildTag("colgroup", "", {}, {});
            $column = $(document.createElement("col"));
            $column.css("width", proxy._getScheduleLength(scheduleMode) + 'px');

            $colsgroup.append($column);

            $thead = ej.buildTag("thead.e-ejganttschedule", "",
                { 'display': 'block', 'border-collapse': 'collapse' }, {});

            if (scheduleMode == "week")
                $tr = ej.buildTag("tr", $.render[this._id + "ScheduleWeekTemplate"](model.scheduleWeeks), {}, {});
            else if (scheduleMode == "year")
                $tr = ej.buildTag("tr", $.render[this._id + "ScheduleYearTemplate"](model.scheduleYears), {}, {});
            else if (scheduleMode == "month")
                $tr = ej.buildTag("tr", $.render[this._id + "ScheduleTopMonthTemplate"](model.scheduleMonths), {}, {});
            else if (scheduleMode == "day")
                $tr = ej.buildTag("tr", $.render[this._id + "ScheduleTopDayTemplate"](model.scheduleDays), {}, {});
            else if (scheduleMode == "hour")
                $tr = ej.buildTag("tr", $.render[this._id + "ScheduleTopHourTemplate"](model.scheduleHours), {}, {});

            $td = ej.buildTag("th.e-ganttchart-schedule", "", {}, {});
            $div = ej.buildTag("div.e-ganttchart-schedule", "", { 'width': 20 + 'px' }, {});
            $td.append($div);
            $tr.append($td);

            $thead.append($tr);
            $table.append($colsgroup);
            $table.append($thead);
            proxy._$scheduleDiv.append($table);

            $tr = null;
            /*Schedule mode - Chart Bottom header*/
            if (scheduleMode == "hour") {
                proxy._createMinuteTemplate();
            }
            else if (scheduleMode == "day") {
                proxy._createScheduleHourTemplate();
            }
            else if (scheduleMode == "week") {
                proxy._createScheduleDayTemplate();
            }
            else if (scheduleMode == "month") {
                proxy._createScheduleBottomWeekTemplate();
            }
            else if (scheduleMode == "year") {
                proxy._createScheduleMonthTemplate();
            }
            $table = ej.buildTag("table.e-schedule-headerrow-day e-zerospacing", "",
                {
                    'display': 'block',
                    'border-collapse': 'collapse'
                });
            $thead = ej.buildTag("thead.e-ejganttschedule", "",
                { 'display': 'block', 'border-collapse': 'collapse' }, {});

            var scheduleMonths = proxy._getScheduleMonth(new Date(model.scheduleYears[0]), enddate);
            if (scheduleMode == "week")
                $tr = ej.buildTag("tr", $.render[this._id + "_CustomTemplate1"](proxy.model.scheduleWeeks), {}, {});
            if (scheduleMode == "year")
                $tr = ej.buildTag("tr", $.render[this._id + "ScheduleMonthTemplate"](scheduleMonths), {}, {});
            if (scheduleMode == "month") {
                proxy._numOfWeeks = proxy._getNumberOftWeeks(this.model.projectStartDate, this.model.projectEndDate);
                $tr = ej.buildTag("tr", $.render[this._id + "ScheduleBottomWeekTemplate"](proxy._numOfWeeks), {}, {});
            }
            if (scheduleMode == "day")
                $tr = ej.buildTag("tr", $.render[this._id + "scheduleHourTemplate"](proxy._getScheduleHours()), {}, {});
            if (scheduleMode == "hour")
                $tr = ej.buildTag("tr", $.render[this._id + "scheduleMinuteTemplate"](proxy._getScheduleMinutes()), {}, {});

            $td = ej.buildTag("th.e-ganttchart-schedule", "", {}, {});
            $div = ej.buildTag("div.e-ganttchart-schedule", "", { 'width': 20 + 'px' }, {});
            $td.append($div);
            $tr.append($td);

            $thead.append($tr);
            $table.append($colsgroup);
            $table.append($thead);
            proxy._$scheduleDiv.append($table);
        },

        /*Template for day schedule header*/
        _createScheduleTopDayTemplate: function () {
            var proxy = this,
                model = proxy.model,
                dayFormat = model.scheduleHeaderSettings.dayHeaderFormat == "" && model.scheduleHeaderSettings.scheduleHeaderType == "day"
                            ? "ddd" : model.scheduleHeaderSettings.dayHeaderFormat,
                helpers = {};
            helpers["_" + proxy._id + "renderDayTop"] = $.proxy(proxy._getFormattedDay, proxy);
            helpers["_" + proxy._id + "getDayWidth"] = $.proxy(proxy._getDayWidth, proxy);
            $.views.helpers(helpers);

            var parentTr = "<th class='e-schedule-week-headercell' style='box-sizing:border-box;-moz-box-sizing:border-box;width:"
                + "{{:~_" + proxy._id + "getDayWidth(#data)}}px;'>";

            var td = "<div class='e-schedule-week-headercell-content'  style='width:"
                + ((proxy.model.perHourWidth * 24) - 1) + "px;box-sizing:border-box;margin:auto;white-space:nowrap;'>"
                + "{{:~_" + proxy._id + "renderDayTop('" + dayFormat + "',#data)}}" + "</div>" +
            "</div>"

            parentTr += td;
            parentTr += "</th>";

            var templates = {};
            templates[proxy._id + "ScheduleTopDayTemplate"] = parentTr;
            $.templates(templates);
        },

        /*Get formated date value for day schedule header*/
        _getFormattedDay: function (dateformat, data) {
            var date = new Date(data),
               proxy = this,
               model = proxy.model;
            switch (dateformat) {
                case "D":
                case "d":
                    return date.getDate();
                default:
                    return ej.format(date, dateformat, model.locale);
            }
        },

        /*Template for month schedule modes top header*/
        _createScheduleTopMonthTemplate: function () {
            var proxy = this, td, i = 0,
                model = proxy.model,
                monthFormat = model.scheduleHeaderSettings.monthHeaderFormat,
                helpers = {};
            helpers["_" + proxy._id + "renderMonthTop"] = $.proxy(proxy._getFormattedMonth, proxy);
            helpers["_" + proxy._id + "setMonthWidth"] = $.proxy(proxy._setMonthWidth, proxy);
            helpers["_" + proxy._id + "isLastMonth"] = $.proxy(proxy._checkLastMonthWidth, proxy);

            $.views.helpers(helpers);
            var parentTr = "<th class='e-schedule-week-headercell' style='box-sizing:border-box;-moz-box-sizing:border-box;width:{{:~_" + proxy._id + "setMonthWidth(#data)}}" + "px;'>";

            td = "<div class='e-schedule-week-headercell-content'  style='box-sizing:border-box;-moz-box-sizing:border-box;margin:auto;white-space:nowrap;width:{{:~_" + proxy._id + "setMonthWidth(#data)-1}}" + "px;'>"
                + "{{:~_" + proxy._id + "renderMonthTop('" + monthFormat + "',#data)}}" + "</div>"
                 + "{{if ~_" + proxy._id + "isLastMonth(#data)}}"
                 + "<th class='e-schedule-week-headercell' style='box-sizing:border-box;-moz-box-sizing:border-box;'>"
                    + "<div class='e-schedule-week-headercell-content' style='box-sizing:border-box;-moz-box-sizing:border-box;margin:auto;white-space:nowrap;width:" + (proxy._balanceWidth - 1) + "px;'>"
                + "</div></th>{{/if}}"

            parentTr += td;
            parentTr += "</th>";
            var templates = {};
            templates[proxy._id + "ScheduleTopMonthTemplate"] = parentTr;
            $.templates(templates);
        },

        //helper method for calculating unique month width
        _setMonthWidth: function (data) {
            var proxy = this;
            var date;
            if (typeof data === "object") {
                date = new Date(data);
            }
            else {
                date = ej.parseDate(data, this.model.dateFormat, this.model.locale);
            }

            var monthLastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            var lastDate = monthLastDay.getDate();
            // condition to check whether first month having only few weeks.
            if (date.getTime() === proxy.model.scheduleMonths[0].getTime()) {
                var datediff = monthLastDay.getDate() - date.getDate();
                return (this.model.perDayWidth * (datediff + 1));
            }
            else if (lastDate == 31)
                return (this.model.perDayWidth * 31);
            else if (lastDate == 30)
                return (this.model.perDayWidth * 30);
            else if (lastDate == 28)
                return (this.model.perDayWidth * 28);
            else if (lastDate == 29)
                return (this.model.perDayWidth * 29);
        },

        /*Method to roundoff lat month width with schedule end date*/
        _checkLastMonthWidth: function (data) {
            var proxy = this;
            if (data == proxy.model.scheduleMonths[proxy.model.scheduleMonths.length - 1] && proxy._balanceWidth > 0) {
                return true;
            }
            else {
                return false;
            }
        },

        //helper method for _createScheduleMonthTemplate
        _getFormattedMonth: function (monthFormat, data) {
            var date = new Date(data),
                proxy = this,
                model = proxy.model,
                formatedDate;
            formatedDate = ej.format(date, monthFormat, model.locale);
            return formatedDate;
        },

        /*Template for year schedue modes top template*/
        _createScheduleYearTemplate: function () {
            var proxy = this, td,
                model = proxy.model,
                yearFormat = model.scheduleHeaderSettings.yearHeaderFormat,
                helpers = {};
            helpers["_" + proxy._id + "renderYear"] = $.proxy(proxy._getFormattedYear, proxy);
            helpers["_" + proxy._id + "getYearWidth"] = $.proxy(proxy._getTemplateYearWidth, proxy);

            $.views.helpers(helpers);
            var parentTr = "<th class='e-schedule-week-headercell' style='box-sizing:border-box;-moz-box-sizing:border-box;width:{{:~_" + proxy._id + "getYearWidth(#data)}}px;'>";

            td = "<div class='e-schedule-week-headercell-content' style='margin:auto;white-space:nowrap;width:{{:~_" + proxy._id + "getYearWidth(#data)-1}}px;box-sizing:border-box;-moz-box-sizing:border-box;'>"
                + "{{:~_" + proxy._id + "renderYear('" + yearFormat + "',#data)}}" + "</div>";

            parentTr += td;
            parentTr += "</th>";

            var templates = {};
            templates[proxy._id + "ScheduleYearTemplate"] = parentTr;
            $.templates(templates);
        },

        //helper method for _createScheduleYearTemplate
        _getFormattedYear: function (yearFormat, data) {
            var date = new Date(data),
                proxy = this,
                model = proxy.model,
                formatedDate;
            formatedDate = ej.format(date, yearFormat, model.locale);
            return formatedDate;
        },

        _getMonthWidthForYearMode: function (date) {
            var proxy = this,
                model = proxy.model,
                date,
                dayCount = 0;
            // get the number of months the year contains
            // endMonth = new Date(date.getFullYear(), 11, 31) < new Date(model.scheduleEndDate) ? 12 : new Date(model.scheduleEndDate).getMonth() + 1;
            //endMonth = new Date(date.getFullYear(), 11, 31) < new Date(model.scheduleEndDate) ? 12 : new Date(model.scheduleEndDate).getMonth() + 1;

            //loop through the each month to get the days count
            for (var i = date.getMonth() ; i < 12; i++) {
                var startDate = date;

                if (typeof startDate === "object") {
                    date = new Date(startDate);
                }
                else {
                    date = ej.parseDate(startDate, model.dateFormat, model.locale);
                }
                var monthLastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                var beginDate = date.getDate();
                var lastDate = monthLastDay.getDate();
                if (beginDate != 1)
                    dayCount += lastDate - date.getDate();
                else if (lastDate == 31)
                    dayCount += 31;
                else if (lastDate == 30)
                    dayCount += 30;
                else if (lastDate == 28)
                    dayCount += 28;
                else if (lastDate == 29)
                    dayCount += 29;
                date = new Date(date.getFullYear(), i + 1, 1);

            }
            return dayCount;
        },

        _getTemplateYearWidth: function (date) {
            var year = date.getFullYear(),
                monthWidth = this._getMonthWidthForYearMode(date);
            return monthWidth * this.model.perDayWidth;
        },

        //Template to render schedule week view
        _createScheduleWeekTemplate: function () {

            var proxy = this, td,
                model = proxy.model,
                dateFormat = model.scheduleHeaderSettings.weekHeaderFormat,
                helpers = {};
            helpers["_" + proxy._id + "renderWeek"] = $.proxy(proxy._getFormattedWeek, proxy);

            $.views.helpers(helpers);
            var parentTr = "<th class='e-schedule-week-headercell' style='box-sizing:border-box;-moz-box-sizing:border-box;width:" + (proxy._scheduleWeekWidth) + "px;'>";

            td = "<div class='e-schedule-week-headercell-content'  style='width:"
                + (proxy._scheduleWeekWidth - 1) + "px;box-sizing:border-box;margin:auto;white-space:nowrap;'>"
                + "{{:~_" + proxy._id + "renderWeek('" + dateFormat + "',#data)}}" + "</div>";

            parentTr += td;
            parentTr += "</th>";

            var templates = {};
            templates[proxy._id + "ScheduleWeekTemplate"] = parentTr;
            $.templates(templates);
        },

        //helper method for _createScheduleWeekTemplate
        _getFormattedWeek: function (dateFormat, data) {
            var date = new Date(data),
                proxy = this,
                model = proxy.model,
                formatedDate;
            formatedDate = ej.format(date, dateFormat, model.locale);
            return formatedDate.toLowerCase().replace(/(-(\w)|(^| )(\w)|:(\w)|,(\w)|\/(\w)|\.(\w))/g, function (x) {
                return x.toUpperCase();
            });
        },

        /*Template for hour schedule mode type*/
        _createScheduleHourTemplate: function () {
            var proxy = this, model = proxy.model, td,
                hourHeaderFormat = model.scheduleHeaderSettings.hourHeaderFormat,
                helpers = {};
            helpers["_" + proxy._id + "renderHour"] = $.proxy(proxy._getHourTemplate, proxy);

            $.views.helpers(helpers);
            var parentTr = "<th  class='e-schedule-day-headercell' " +
                "style='-moz-box-sizing:border-box;box-sizing:border-box;width:"
                + (proxy.model.perHourWidth) + "px;'>";
            td = "<div class='e-schedule-day-headercell-content' style='width:"
                + (proxy.model.perHourWidth - 1) + "px;position:static;box-sizing:border-box;overflow:hidden;text-overflow:clip'>" +
                "{{:~_" + proxy._id + "renderHour('" + hourHeaderFormat + "',#data)}}</div>";

            parentTr += td;

            parentTr += "</th>";
            var templates = {};
            templates[proxy._id + "scheduleHourTemplate"] = parentTr;
            $.templates(templates);
        },

        //Method to create template for upper part of schedule header in hour-minute schedule mode.
        _createScheduleTopHourTemplate: function () {
            var proxy = this, model = proxy.model, minuteInterval = model.minuteInterval, td, interval,
                hourHeaderFormat = model.scheduleHeaderSettings.hourHeaderFormat,
                helpers = {};
            helpers["_" + proxy._id + "renderHour"] = $.proxy(proxy._getHourTemplate, proxy);

            if (minuteInterval == 30)
                interval = 2;
            if (minuteInterval == 15)
                interval = 4;
            if (minuteInterval == 5)
                interval = 12;
            if (minuteInterval == 1)
                interval = 60;
            proxy._totalInterval = interval;//To calculate schedule length
            $.views.helpers(helpers);
            var parentTr = "<th  class='e-schedule-hour-headercell' " +
                "style='-moz-box-sizing:border-box;box-sizing:border-box;width:"
                + ((proxy.model.perMinuteWidth * interval)) + "px;'>";
            td = "<div class='e-schedule-hour-headercell-content' style='width:"
                + ((proxy.model.perMinuteWidth * interval) - 1) + "px;position:static;box-sizing:border-box;overflow:hidden;text-overflow:clip'>" +
                "{{:~_" + proxy._id + "renderHour('" + hourHeaderFormat + "',#data)}}</div>";

            parentTr += td;

            parentTr += "</th>";
            var templates = {};
            templates[proxy._id + "ScheduleTopHourTemplate"] = parentTr;
            $.templates(templates);
        },

        //Method to create template for lower part of schedule header in hour-minute schedule mode.
        _createMinuteTemplate: function () {
            var proxy = this, model = proxy.model, td,
                hourHeaderFormat = model.scheduleHeaderSettings.minuteHeaderFormat,
                helpers = {};
            helpers["_" + proxy._id + "renderHour"] = $.proxy(proxy._getHourTemplate, proxy);

            $.views.helpers(helpers);
            var parentTr = "<th class='e-schedule-hour-headercell' " +
                "style='-moz-box-sizing:border-box;box-sizing:border-box;width:"
                + (proxy.model.perMinuteWidth) + "px;'>";
            td = "<div class='e-schedule-hour-headercell-content' style='width:"
                + (proxy.model.perMinuteWidth - 1) + "px;position:static;box-sizing:border-box;overflow:hidden;text-overflow:clip'>" +
                "{{:~_" + proxy._id + "renderHour('" + hourHeaderFormat + "',#data)}}</div>";

            parentTr += td;

            parentTr += "</th>";
            var templates = {};
            templates[proxy._id + "scheduleMinuteTemplate"] = parentTr;
            $.templates(templates);
        },

        _getHourTemplate: function (format, data) {
            var date = new Date(data),
              proxy = this,
              model = proxy.model,
              formatedDate;

            formatedDate = ej.format(date, format, model.locale);
            return formatedDate;
        },

        //Template to render schedule week view in month-week schedule mode
        _createScheduleBottomWeekTemplate: function () {
            var proxy = this, td, model = proxy.model,
                weekFormat = model.scheduleHeaderSettings.weekHeaderFormat,
                helpers = {};
            helpers["_" + proxy._id + "renderWeek"] = $.proxy(proxy._getMonthWeekTemplate, proxy);

            $.views.helpers(helpers);

            var parentTr = "<th  class='e-schedule-day-headercell' " +
                "style='-moz-box-sizing:border-box;box-sizing:border-box;width:" + (proxy.model.perWeekWidth) + "px;'>";
            td = "<div class='e-schedule-day-headercell-content' style='position:static;box-sizing:border-box;overflow:hidden;text-overflow:clip;padding-left:2px;width:" + (proxy.model.perWeekWidth - 1) + "px;'>" +
                "{{:~_" + proxy._id + "renderWeek('" + weekFormat + "',#data)}}</div>";

            parentTr += td;

            parentTr += "</th>";
            var templates = {};
            templates[proxy._id + "ScheduleBottomWeekTemplate"] = parentTr;
            $.templates(templates);
        },

        _getMonthWeekTemplate: function (weekFormat, data) {

            var date = new Date(data),
                proxy = this, model = proxy.model;
            switch (weekFormat) {
                case "d":
                    return date.getDate();
                default:
                    return ej.format(date, weekFormat, model.locale);
            }
        },

        //Template to render schedule day view
        _createScheduleMonthTemplate: function () {

            var proxy = this, td, model = proxy.model,
                monthFormat = model.scheduleHeaderSettings.monthHeaderFormat,
                helpers = {};
            helpers["_" + proxy._id + "renderMonth"] = $.proxy(proxy._getMonthTemplate, proxy);
            helpers["_" + proxy._id + "getMonthWidth"] = $.proxy(proxy._setMonthWidthYearMode, proxy);

            $.views.helpers(helpers);

            var parentTr = "<th  class='e-schedule-day-headercell' " +
                "style='-moz-box-sizing:border-box;box-sizing:border-box;width:{{:~_" + proxy._id + "getMonthWidth(#data)}}px;'>" +

                "<div class='e-schedule-day-headercell-content' style='"
                + "position:static;box-sizing:border-box;overflow:hidden;text-overflow:clip;width:{{:~_" + proxy._id + "getMonthWidth(#data)-1}}px;'>" +
                "{{:~_" + proxy._id + "renderMonth('" + monthFormat + "',#data)}}</div></th>";


            var templates = {};
            templates[proxy._id + "ScheduleMonthTemplate"] = parentTr;
            $.templates(templates);
        },

        _getMonthTemplate: function (monthFormat, data) {

            var date = new Date(data),
                proxy = this, model = proxy.model;
            switch (monthFormat) {
                case "M":
                case "m":
                    return date.getMonth() + 1;
                default:
                    return ej.format(date, monthFormat, model.locale);
            }
        },

        //For year template set month width accordance with num of days
        _setMonthWidthYearMode: function (data) {

            var proxy = this;
            var date = new Date(data);
            var monthLastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            var beginDate = date.getDate();
            var lastDate = monthLastDay.getDate();

            if (beginDate != 1)
                return (this.model.perDayWidth * (lastDate - date.getDate()));
            else if (lastDate == 31)
                return (this.model.perDayWidth * 31);
            else if (lastDate == 30)
                return (this.model.perDayWidth * 30);
            else if (lastDate == 28)
                return (this.model.perDayWidth * 28);
            else if (lastDate == 29)
                return (this.model.perDayWidth * 29);

        },

        _getHeaderWeek: function (length, weekday) {
            var date = new Date(weekday);
            date.setDate(date.getDate() + length);
            if (this._nonWorkingDayIndex.indexOf(date.getDay()) != -1) {
                return true;
            }
        },
        _getDayWidth: function (date) {
            var sDate = new Date(date), hourDiff = 0;
            sDate.setHours(0, 0, 0, 0);
            var eDate = new Date(sDate);
            eDate.setHours(24, 0, 0, 0);
            hourDiff = (eDate.getTime() - sDate.getTime()) / (1000 * 60 * 60);
            return hourDiff * this.model.perHourWidth;
        },
        //Template to render schedule day view
        _createScheduleDayTemplate: function () {

            var proxy = this, td, model = proxy.model,
                dayFormat = model.scheduleHeaderSettings.dayHeaderFormat == "" && model.scheduleHeaderSettings.scheduleHeaderType == "day"
                            ? "ddd" : model.scheduleHeaderSettings.dayHeaderFormat,
                helpers = {};
            helpers["_" + proxy._id + "renderDay"] = $.proxy(proxy._getDayTemplate, proxy);
            helpers["_" + proxy._id + "getHeader"] = $.proxy(proxy._getHeaderWeek, proxy);

            $.views.helpers(helpers);

            var parentTr = "<th  class='e-schedule-day-headercell {{if ~_" + proxy._id + "getHeader(0,#data)}} e-headercell-weekend {{/if}}' " +
                "style='-moz-box-sizing:border-box;box-sizing:border-box;width:" + (proxy.model.perDayWidth) + "px;" +
                "{{if ~_" + proxy._id + "getHeader(0,#data)}} background-color:" + this.model.scheduleHeaderSettings.weekendBackground + "{{/if}}'>";
            td = "<div class='e-schedule-day-headercell-content' style='width:"
                + (proxy.model.perDayWidth - 1) + "px;position:static;box-sizing:border-box;overflow:hidden;text-overflow:clip;{{if ~_" + proxy._id + "getHeader(0,#data)}} background-color:" + this.model.scheduleHeaderSettings.weekendBackground + "{{/if}}'>" +
                "{{:~_" + proxy._id + "renderDay('" + dayFormat + "',0,#data)}}</div>" +

                "<th  class='e-schedule-day-headercell {{if ~_" + proxy._id + "getHeader(1,#data)}} e-headercell-weekend {{/if}}' " +
                "style='-moz-box-sizing:border-box;box-sizing:border-box;width:" + (proxy.model.perDayWidth) + "px;{{if ~_" + proxy._id + "getHeader(1,#data)}} background-color:" + this.model.scheduleHeaderSettings.weekendBackground + "{{/if}}'>" +
                "<div class='e-schedule-day-headercell-content' style='width:"
                + (proxy.model.perDayWidth - 1) + "px;position:static;box-sizing:border-box;overflow:hidden;text-overflow:clip;{{if ~_" + proxy._id + "getHeader(1,#data)}} background-color:" + this.model.scheduleHeaderSettings.weekendBackground + "{{/if}}'>" +
                "{{:~_" + proxy._id + "renderDay('" + dayFormat + "',1,#data)}}</div>" +

                "<th  class='e-schedule-day-headercell {{if ~_" + proxy._id + "getHeader(2,#data)}} e-headercell-weekend {{/if}}' " +
                "style='-moz-box-sizing:border-box;box-sizing:border-box;width:" + (proxy.model.perDayWidth) + "px;{{if ~_" + proxy._id + "getHeader(2,#data)}} background-color:" + this.model.scheduleHeaderSettings.weekendBackground + "{{/if}}'>" +
                "<div class='e-schedule-day-headercell-content' style='width:"
                + (proxy.model.perDayWidth - 1) + "px;position:static;box-sizing:border-box;overflow:hidden;text-overflow:clip;{{if ~_" + proxy._id + "getHeader(2,#data)}} background-color:" + this.model.scheduleHeaderSettings.weekendBackground + "{{/if}}'>" +
                "{{:~_" + proxy._id + "renderDay('" + dayFormat + "',2,#data)}}</div>" +

                "<th  class='e-schedule-day-headercell {{if ~_" + proxy._id + "getHeader(3,#data)}} e-headercell-weekend {{/if}}' " +
                "style='-moz-box-sizing:border-box;box-sizing:border-box;width:" + (proxy.model.perDayWidth) + "px;{{if ~_" + proxy._id + "getHeader(3,#data)}} background-color:" + this.model.scheduleHeaderSettings.weekendBackground + "{{/if}}'>" +
                "<div class='e-schedule-day-headercell-content' style='width:"
                + (proxy.model.perDayWidth - 1) + "px;position:static;box-sizing:border-box;overflow:hidden;text-overflow:clip;{{if ~_" + proxy._id + "getHeader(3,#data)}} background-color:" + this.model.scheduleHeaderSettings.weekendBackground + "{{/if}}'>" +
                "{{:~_" + proxy._id + "renderDay('" + dayFormat + "',3,#data)}}</div>" +

                "<th  class='e-schedule-day-headercell {{if ~_" + proxy._id + "getHeader(4,#data)}} e-headercell-weekend {{/if}}'" +
                " style='-moz-box-sizing:border-box;box-sizing:border-box;width:" + (proxy.model.perDayWidth) + "px;{{if ~_" + proxy._id + "getHeader(4,#data)}} background-color:" + this.model.scheduleHeaderSettings.weekendBackground + "{{/if}}'>" +
                "<div class='e-schedule-day-headercell-content' style='width:"
                + (proxy.model.perDayWidth - 1) + "px;position:static;box-sizing:border-box;overflow:hidden;text-overflow:clip;{{if ~_" + proxy._id + "getHeader(4,#data)}} background-color:" + this.model.scheduleHeaderSettings.weekendBackground + "{{/if}}'>" +
                "{{:~_" + proxy._id + "renderDay('" + dayFormat + "',4,#data)}}</div>" +

                "<th  class='e-schedule-day-headercell {{if ~_" + proxy._id + "getHeader(5,#data)}} e-headercell-weekend {{/if}}'" +
                " style='-moz-box-sizing:border-box;box-sizing:border-box;width:" + (proxy.model.perDayWidth) + "px;{{if ~_" + proxy._id + "getHeader(5,#data)}} background-color:" + this.model.scheduleHeaderSettings.weekendBackground + "{{/if}}'>" +
                "<div class='e-schedule-day-headercell-content' style='width:"
                + (proxy.model.perDayWidth - 1) + "px;position:static;box-sizing:border-box;overflow:hidden;text-overflow:clip;{{if ~_" + proxy._id + "getHeader(5,#data)}} background-color:" + this.model.scheduleHeaderSettings.weekendBackground + "{{/if}}'>" +
                "{{:~_" + proxy._id + "renderDay('" + dayFormat + "',5,#data)}}</div>" +

                "<th  class='e-schedule-day-headercell {{if ~_" + proxy._id + "getHeader(6,#data)}} e-headercell-weekend {{/if}}' " +
                "style='-moz-box-sizing:border-box;box-sizing:border-box;width:" + (proxy.model.perDayWidth) + "px;" +
                "{{if ~_" + proxy._id + "getHeader(6,#data)}} background-color:" + this.model.scheduleHeaderSettings.weekendBackground + "{{/if}}'>" +
                "<div class='e-schedule-day-headercell-content' style='width:"
                + (proxy.model.perDayWidth - 1) + "px;position:static;box-sizing:border-box;overflow:hidden;text-overflow:clip;{{if ~_" + proxy._id + "getHeader(6,#data)}} background-color:" + this.model.scheduleHeaderSettings.weekendBackground + "{{/if}}'>" +
                "{{:~_" + proxy._id + "renderDay('" + dayFormat + "',6,#data)}}</div>";

            parentTr += td;
            parentTr += "</th>";
            var templates = {};
            templates[proxy._id + "_CustomTemplate1"] = parentTr;
            $.templates(templates);
        },

        _getDayTemplate: function (dayFormat, dayLength, data) {

            var date = new Date(data),
                proxy = this, model = proxy.model;
            date.setDate(date.getDate() + dayLength);

            switch (dayFormat) {
                case "D":
                case "d":
                    return date.getDate();
                case "DD":
                case "dd":
                case "DDD":
                case "ddd":
                case "DDDD":
                case "dddd":
                    return ej.format(date, dayFormat, model.locale);
                case "":
                    dayFormat = "ddd";
                    return ej.format(date, dayFormat, model.locale)[0].toUpperCase();
                default:
                    return ej.format(date, dayFormat, model.locale).toUpperCase();
            }
        },

        _getNumberOftWeeks: function (startdate, enddate) {
            //var date1 = new Date(startdate), date2 = new Date(enddate);
            //// The number of milliseconds in one week
            //var ONE_WEEK = 1000 * 60 * 60 * 24 * 7;
            //// Convert both dates to milliseconds
            //var date1_ms = date1.getTime();
            //var date2_ms = date2.getTime();
            //// Calculate the difference in milliseconds
            //var difference_ms = Math.abs(date1_ms - date2_ms);
            //// Convert back to weeks and return hole weeks
            //return Math.floor(difference_ms / ONE_WEEK);
            var startDate = new Date(startdate),
                endDate = new Date(enddate);

            var totalWeeksCollection = [];
            do {
                totalWeeksCollection.push(new Date(startDate));
                startDate.setDate(startDate.getDate() + 7);
            } while (!(startDate > endDate));

            return totalWeeksCollection;
        },

        // get schedule months for year month schedule mode.
        _getScheduleMonth: function (startdate, enddate) {
            var proxy = this,
                model = proxy.model,
                dates = [],
                count = 0;

            enddate = enddate.getMonth() < 11 ? new Date(enddate.getFullYear(), 11, 31) : enddate;
            var endMonth = new Date(startdate.getFullYear(), 11, 31) < new Date(model.scheduleEndDate) ? 12 : new Date(model.scheduleEndDate).getMonth() + 1;


            for (var i = startdate.getMonth() ; startdate < enddate; i++) {
                dates.push(startdate);
                startdate = new Date(startdate.getFullYear(), startdate.getMonth() + 1, 1);
                //startdate.setMonth(i + 1);
            }

            return dates;
        },

        //Method to render schedule header
        _createSchedule: function (startdate, enddate) {

            var proxy = this,
                model = proxy.model,
                scheduleMode = model.scheduleHeaderSettings.scheduleHeaderType,
                $colsgroup, $column, $thead,
                $tr, $td, $div, $table;

            startdate = startdate == null ? new Date() : startdate;
            enddate = enddate == null ? new Date(null) : enddate;

            proxy._createScheduleWeekTemplate();
            proxy._createScheduleYearTemplate();
            proxy._createScheduleTopMonthTemplate();//template for MONTH week schedule mode
            proxy._createScheduleTopDayTemplate();
            proxy._createScheduleTopHourTemplate();
            $table = ej.buildTag("table.e-schedule-headerrow-week e-zerospacing", "",
                { 'display': 'block' }
            );

            $colsgroup = ej.buildTag("colgroup", "", {}, {});
            $column = $(document.createElement("col"));
            $column.css("width", proxy._getScheduleLength(scheduleMode) + 'px');

            $colsgroup.append($column);

            $thead = ej.buildTag("thead.e-ejganttschedule", "",
                { 'display': 'block', 'border-collapse': 'collapse' }, {});

            if (scheduleMode == "week")
                $tr = ej.buildTag("tr", $.render[this._id + "ScheduleWeekTemplate"](proxy.model.scheduleWeeks), {}, {});
            else if (scheduleMode == "year")
                $tr = ej.buildTag("tr", $.render[this._id + "ScheduleYearTemplate"](proxy.model.scheduleYears), {}, {});
            else if (scheduleMode == "month")
                $tr = ej.buildTag("tr", $.render[this._id + "ScheduleTopMonthTemplate"](proxy.model.scheduleMonths), {}, {});
            else if (scheduleMode == "day")
                $tr = ej.buildTag("tr", $.render[this._id + "ScheduleTopDayTemplate"](proxy.model.scheduleDays), {}, {});
            else if (scheduleMode == "hour")
                $tr = ej.buildTag("tr", $.render[this._id + "ScheduleTopHourTemplate"](proxy.model.scheduleHours), {}, {});

            $td = ej.buildTag("th.e-ganttchart-schedule", "", {}, {});
            $div = ej.buildTag("div.e-ganttchart-schedule", "", { 'width': 20 + 'px' }, {});
            $td.append($div);
            $tr.append($td);

            $thead.append($tr);
            $table.append($colsgroup);
            $table.append($thead);
            proxy._$scheduleDiv.append($table);

            $tr = null;

            proxy._createScheduleDayTemplate();
            proxy._createScheduleMonthTemplate();//for year - month schedule mode
            proxy._createScheduleBottomWeekTemplate(); //for month - week schedule mode
            proxy._createMinuteTemplate();
            proxy._createScheduleHourTemplate();

            $table = ej.buildTag("table.e-schedule-headerrow-day e-zerospacing", "",
                {
                    'display': 'block',
                    'border-collapse': 'collapse'
                });
            $thead = ej.buildTag("thead.e-ejganttschedule", "",
                { 'display': 'block', 'border-collapse': 'collapse' }, {});

            var scheduleMonths = proxy._getScheduleMonth(new Date(model.scheduleYears[0]), enddate);
            if (scheduleMode == "week")
                $tr = ej.buildTag("tr", $.render[this._id + "_CustomTemplate1"](model.scheduleWeeks), {}, {});
            if (scheduleMode == "year")
                $tr = ej.buildTag("tr", $.render[this._id + "ScheduleMonthTemplate"](scheduleMonths), {}, {});
            if (scheduleMode == "month")
                $tr = ej.buildTag("tr", $.render[this._id + "ScheduleBottomWeekTemplate"](proxy._numOfWeeks), {}, {});
            if (scheduleMode == "day")
                $tr = ej.buildTag("tr", $.render[this._id + "scheduleHourTemplate"](proxy._getScheduleHours()), {}, {});
            if (scheduleMode == "hour")
                $tr = ej.buildTag("tr", $.render[this._id + "scheduleMinuteTemplate"](proxy._getScheduleMinutes()), {}, {});

            $td = ej.buildTag("th.e-ganttchart-schedule", "", {}, {});
            $div = ej.buildTag("div.e-ganttchart-schedule", "", { 'width': 20 + 'px' }, {});
            $td.append($div);
            $tr.append($td);

            $thead.append($tr);
            $table.append($colsgroup);
            $table.append($thead);
            proxy._$scheduleDiv.append($table);

            proxy._$headerContainer.append(proxy._$scheduleDiv);
            proxy._$ganttChartContainer.append(proxy._$headerContainer);
            $("#" + proxy._id).append(proxy._$ganttChartContainer);
        },

        _getScheduleHours: function () {
            var proxy = this, model = proxy.model,
                startHour = new Date(proxy.model.projectStartDate),
                endHour = new Date(model.projectEndDate);
            proxy._scheduleHours = [];
            endHour.setHours(24);
            do {
                proxy._scheduleHours.push(new Date(startHour));
                startHour.setTime(startHour.getTime() + (1*60*60*1000));
            } while (!(startHour.getTime() >= endHour.getTime()));

            return proxy._scheduleHours;
        },

        //Calculate total number of minutes to render template.
        _getScheduleMinutes: function () {
            var proxy = this, model = proxy.model,
                startDate = new Date(proxy.model.projectStartDate),
                endDate = new Date(model.projectEndDate);
            endDate.setMinutes(60);
            startDate.setMinutes(0);
            proxy._scheduleMinutes = [];
            do {
                proxy._scheduleMinutes.push(new Date(startDate));
                startDate.setMinutes(startDate.getMinutes() + model.minuteInterval);
            } while (!(startDate.getTime() >= endDate.getTime()));

            return proxy._scheduleMinutes;
        },
    };
})(jQuery, Syncfusion);;