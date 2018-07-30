(function ($, ej, undefined) {
    ej.ganttChartFeatures = ej.ganttChartFeatures || {};
    "use strict";
    ej.ganttChartFeatures.resourceViewGantt = {
        /*Helper method to check unassigned task or not*/
        _unassignedTask: function () {
            if (this.data.eResourceTaskType == "unassignedTask")
                return true;
            else
                return false;
        },
        /*Helper method to get margin value for overlapped task*/
        _getMarginTopValue:function(data){
            return (data.eOverlapIndex - 1) * this.model.rowHeight + this._marginTop;
        },
        /*get height for range bar*/
        _getRangeHeight: function (data) {
            return this._getTemplateRowHeight(data) - (this._marginTop * 2);
        },
        /*Get row height for overlapped tasks*/
        _getTemplateRowHeight: function (data) {
            if (this.model.viewType == "resourceView")
                return data.eOverlapIndex * this.model.rowHeight;
            else
                return this.model.rowHeight;
        },
        /*Method to create taskbar template for resource view Gantt*/
        _createResourceTaskbarTemplate: function () {

            var proxy = this,
                model = proxy.model,
                tdWidth,
                scheduleMode = model.scheduleHeaderSettings.scheduleHeaderType,
                tr, baselineHeight = 4, taskbarHeight, baseLineTop,
                labelHeight,
                tHeight = 0,
                leftLabelFlag = false,
                rightLabelFlag = false,
                leftField = "",
                marginTop = 5,
                rightField = "",
                baselineColor = model.baselineColor,
                template = model.taskbarTemplate, taskbarTemplateString, isTaskbarTemplate = false, isProgressbarTemplate = false,
                parentTemplate = model.parentTaskbarTemplate, parentTaskbarTemplateString, isParentTaskbarTemplate = false, isParentProgressbarTemplate = false,
                milestoneTemplate = model.milestoneTemplate, isMilestoneTemplate = false, milestoneTemplateString = "",
                leftTaskLabelTemplate = model.leftTaskLabelTemplate, isLeftTaskLabelTemplate = false, leftTaskLabelTemplateString = "",
                rightTaskLabelTemplate = model.rightTaskLabelTemplate, isRightTaskLabelTemplate = false, rightTaskLabelTemplateString = "",
                helpers = {};
            helpers["_" + proxy._id + "SelectState"] = $.proxy(proxy._SelectState, proxy);
            helpers["_" + proxy._id + "getType"] = proxy._getTypedata;
            helpers["_" + proxy._id + "expander"] = proxy._addRecordExpandCollapse;
            helpers["_" + proxy._id + "milestoneMapping"] = proxy._isMilestone;
            helpers["_" + proxy._id + "unassignedTask"] = proxy._unassignedTask;
            helpers["_" + proxy._id + "resources"] = $.proxy(proxy._getResourceInfo, proxy);
            helpers["_" + proxy._id + "rowClassName"] = ej.TreeGrid._getrowClassName;
            helpers["_" + proxy._id + "expandStatus"] = $.proxy(proxy._getExpandStatusRecord, proxy);
            helpers["_" + proxy._id + "borderRadius"] = proxy._getBorderRadius;
            helpers["_" + proxy._id + "getRowHeight"] = $.proxy(proxy._getTemplateRowHeight, proxy);
            helpers["_" + proxy._id + "getMarginTop"] = $.proxy(proxy._getMarginTopValue, proxy);
            helpers["_" + proxy._id + "getRangeHeight"] = $.proxy(proxy._getRangeHeight, proxy);
            
            proxy._marginTop = (model.rowHeight - model.taskbarHeight) / 2;
            proxy._fontSize = proxy._getFontSize();
            proxy._resizerRightAdjust = proxy._fontSize * 0.8;
            proxy._resizerMargin = proxy._getMargin();
            proxy._resizerLeftAdjust = proxy._getResizerLeftAdjust();

            if (scheduleMode == "week") {
                tdWidth = model.scheduleWeeks.length * proxy._scheduleWeekWidth;
            }
            else if (scheduleMode == "year") {
                tdWidth = proxy._scheduleYearWidth;
            }
            else if (scheduleMode == "month") {
                tdWidth = proxy._scheduleMonthWidth;
            }
            else if (scheduleMode == "day") {
                tdWidth = model.scheduleDays.length * (model.perHourWidth * 24);
            }
            else if (scheduleMode == "hour") {
                tdWidth = model.scheduleHours.length * (model.perMinuteWidth * proxy._totalInterval);
            }
            if (model.renderBaseline) {
                var height;
                if ((model.taskbarHeight + baselineHeight) <= model.rowHeight) {
                    height = model.taskbarHeight;
                    baseLineTop = 0;
                }
                else {
                    height = model.taskbarHeight - baselineHeight;
                    baseLineTop = -4;
                }
                taskbarHeight = height;
                labelHeight = model.rowHeight - baselineHeight - 5;
            } else {
                taskbarHeight = model.taskbarHeight;
                labelHeight = model.rowHeight - 10;
            }
            tHeight = taskbarHeight / 5;
            $.views.helpers(helpers);

            if (!model.progressMapping) {
                this.model.showProgressStatus = false;
            }

            if (!model.resourceInfoMapping) {
                model.showResourceNames = false;
            }

            //Process child taskbar template
            if (template) {
                isTaskbarTemplate = true;
                var returnVal = this._processTaskbarTemplate(template, taskbarHeight, "resourceTemplate");
                taskbarTemplateString = returnVal.template
                isProgressbarTemplate = returnVal.isProgressbarTemplate;
            }

            //Process parent taskbar template
            if (parentTemplate) {
                isParentTaskbarTemplate = true;
                parentTaskbarTemplateString = this._processParentTaskbarTemplate(parentTemplate, taskbarHeight);
            }

            //leftTaskLabelTemplate mapping
            if (leftTaskLabelTemplate) {
                leftTaskLabelTemplateString = this._processTaskLabelTemplate(leftTaskLabelTemplate);
                isLeftTaskLabelTemplate = true;
            }

            //rightTaskLabelTemplate mapping
            if (rightTaskLabelTemplate) {
                rightTaskLabelTemplateString = this._processTaskLabelTemplate(rightTaskLabelTemplate)
                isRightTaskLabelTemplate = true;
            }
            if (this.model.leftTaskLabelMapping && isLeftTaskLabelTemplate == false) {
                leftLabelFlag = true;
                leftField = proxy._getLeftTaskLabel();
            }

            if (this.model.rightTaskLabelMapping && isRightTaskLabelTemplate == false) {
                rightLabelFlag = true;
                rightField = proxy._getRightTaskLabel();
            }

            var rightLabelRowHeight = Math.round(-((this.model.rowHeight - 1) / 2));

            var parentTr = "<tr class='{{:~_" + proxy._id + "rowClassName()}}  {{if isSelected && ~_" + proxy._id + "SelectState()}}e-ganttrowcell {{:~_" + proxy._id + "expander()}} e-gantt-mouseclick{{else}}e-ganttrowcell {{:~_" + proxy._id + "expander()}}{{/if}}'"
                + "style='display:{{:~_" + proxy._id + "expandStatus(#data)}};background-color:{{if rowBGColor }}{{:rowBGColor}}{{else}} none{{/if}};height:{{:~_" + proxy._id + "getRowHeight(#data)}}px;'>";
            var radius = "{{:~_" + proxy._id + "borderRadius()}}";

            tr = "{{if ~_" + proxy._id + "getType()}}" +

                //Parent taskbar Item
                "<td  class='e-chartcell' style='width:" + tdWidth + "px; vertical-align:middle;'>" +

               "<div class='e-parentContainer' style='{{if !startDate}}display:none;{{/if}}height:" + (this.model.taskbarHeight - 1) + "px;z-index:3;'>" +
                "{{if " + isParentTaskbarTemplate + "}}" + parentTaskbarTemplateString + "{{else}}" +
                "<div class='e-gantt-parenttaskbar-innerdiv {{:~_" + proxy._id + "expander()}} e-parentTask' style='background-color:{{if parentTaskbarBackground }}{{:parentTaskbarBackground}}{{else}} " + this.model.parentTaskbarBackground +
                "{{/if}}; left:{{:left}}px;width:{{:width}}px;height:" + taskbarHeight + "px;'>" +

                "<div  class='e-gantt-parenttaskbar-progress {{:~_" + proxy._id + "expander()}} e-parentTask progressbar' " +
                "style='top:-1px;border-style:{{if progressWidth}}solid{{else}}none{{/if}}; left:-1px;width:{{:progressWidth}}px;position:absolute;background-color:{{if parentProgressbarBackground }}{{:parentProgressbarBackground}}{{else}} "
                + this.model.parentProgressbarBackground + "{{/if}};z-index:3;" +
                "border-top-right-radius:" + radius + "px;border-bottom-right-radius:" + radius + "px;height:" + taskbarHeight + "px;'>" + 
                "<span class='e-rg-tasklabel e-tasklabel' style='line-height:" + (taskbarHeight - 1) + "px;width:{{:width-10}}px;'>{{:eResourceName}}</span>" +
                "</div>" + "</div>" + "{{/if}}" +

             "</div>" +
                "</td>" +

                 "{{else ~_" + proxy._id + "unassignedTask()}}" +

                //taskbar
               "<td class='e-chartcell' style='vertical-align:top;width:" + tdWidth + "px;'>" +

               "<div  class='e-childContainer' style='left:{{:left}}px;width:{{:width}}px;" +
               "margin-top:{{:~_" + proxy._id + "getMarginTop(#data)}}px;height:" + (this.model.taskbarHeight) + "px;position:absolute;'>" +

               "<div class='e-taskbarresizer-left e-icon' style='width:10px;margin-top:" + proxy._resizerMargin + "px;height:" + (taskbarHeight) + "px;font-size:" + proxy._fontSize + "px;'></div>" +
               "{{if " + isTaskbarTemplate + "}}" + taskbarTemplateString + "{{else}}" +
               "<div  class='e-gantt-childtaskbar' style='width:{{:width}}px;height:"
               + (taskbarHeight) + "px;background-color:{{if taskbarBackground }}{{:taskbarBackground}}{{else}} "
               + this.model.taskbarBackground + "{{/if}};'>" +

               "<div  class='e-gantt-childtaskbar-progress progressbar' style='border-style:{{if progressWidth}}solid{{else}}none{{/if}};" +
                "width:{{:progressWidth}}px;line-height:" + (taskbarHeight - 1) + "px;" +
                "height:" + (this.model.progressbarHeight * (taskbarHeight / 100)) + "px; top:-1px;left:-1px;" +
                "position:absolute;background-color:{{if progressbarBackground }}{{:progressbarBackground}}{{else}} " + this.model.progressbarBackground + "{{/if}};" +
                "border-top-right-radius:" + radius + "px;border-bottom-right-radius:" + radius + "px;'>" +
                "<span class='e-rg-tasklabel e-tasklabel' style='line-height:" + (taskbarHeight - 1) + "px;width:{{:width-10}}px;'>{{:taskName}}</span></div></div>" + "{{/if}}" +
               "<div class='e-taskbarresizer-right e-icon' style='left:{{:width-" + proxy._resizerRightAdjust + "}}px;width:10px;" +
                "height:" + (taskbarHeight) + "px;font-size:" + proxy._fontSize + "px;position:absolute;z-index:2;margin-top:" + proxy._resizerMargin + "px;'></div>" +

                 "</div>" +
                "</td>" +

                //Child Taskbar Item

                "{{else}}" +

                //taskbar
               "<td class='e-chartcell' style='vertical-align:top;width:" + tdWidth + "px;'>" +

               "{{for eResourceChildTasks}}" +

               "<div  class='e-childContainer' style='margin-top:{{:~_" + proxy._id + "getMarginTop(#data)}}px;" +
               "left:{{:left}}px;width:{{:width}}px;height:" + (this.model.taskbarHeight) + "px;position:absolute;'>" +

               "<div class='e-taskbarresizer-left e-icon' style='left:" + (2 - proxy._resizerLeftAdjust) + "px;width:10px;" +
               "margin-top:" + proxy._resizerMargin + "px;height:" + (taskbarHeight) + "px;font-size:" + proxy._fontSize + "px;'></div>" +

               "{{if " + isTaskbarTemplate + "}}" + taskbarTemplateString + "{{else}}" +
               "<div  class='e-gantt-childtaskbar' style='width:{{:width}}px;height:"
               + (taskbarHeight) + "px;background-color:{{if taskbarBackground }}{{:taskbarBackground}}{{else}} "
               + this.model.taskbarBackground + "{{/if}};'>" +

               "<div  class='e-gantt-childtaskbar-progress progressbar' style='border-style:{{if progressWidth}}solid{{else}}none{{/if}};" +
                "width:{{:progressWidth}}px;line-height:" + (taskbarHeight - 1) + "px;" +
                "height:" + (this.model.progressbarHeight * (taskbarHeight / 100)) + "px; top:-1px;left:-1px;" +
                "position:absolute;background-color:{{if progressbarBackground }}{{:progressbarBackground}}{{else}} " + this.model.progressbarBackground + "{{/if}};" +
                "border-top-right-radius:" + radius + "px;border-bottom-right-radius:" + radius + "px;'>" +
                "<span class='e-rg-tasklabel e-tasklabel' style='line-height:" + (taskbarHeight - 1) + "px;width:{{:width-10}}px;'>{{:taskName}}</span></div></div>" + "{{/if}}" +

               "<div class='e-taskbarresizer-right e-icon' style='left:{{:width-" + proxy._resizerRightAdjust + "}}px;width:10px;" +
                "height:" + (taskbarHeight) + "px;font-size:" + proxy._fontSize + "px;position:absolute;z-index:2;margin-top:" + proxy._resizerMargin + "px;'></div>" +
                "</div>" +
                "{{/for}}" +
                //Range rendering
                "<div class='e-rangecontainer'>" +
                "{{for eRangeValues ~height=~_" + proxy._id + "getRangeHeight(#data)}}" +
                 "<div class='e-rg-rangdiv' style='position:absolute;left:{{:left}}px;margin-top:" + proxy._marginTop + "px;height:{{>~height}}px;width:2px;'></div>" + //left bar
                 "<div class='e-rg-rangdiv' style='position:absolute;left:{{:left}}px;margin-top:" + (proxy._marginTop - 2) + "px;height:2px;width:12px'></div>" + //top-right open bar
                 "<div class='e-rg-rangdiv' style='position:absolute;left:{{:left}}px;margin-top:{{>~height +" + proxy._marginTop + "}}px;height:2px;width:12px'></div>" + //bottom-right open bar
                 "<div class='e-rg-rangdiv' style='position:absolute;left:{{:left + width}}px;margin-top:" + proxy._marginTop + "px;height:{{>~height}}px;width:2px;'></div>" + //right - bar
                 "<div class='e-rg-rangdiv' style='position:absolute;left:{{:left + width -10}}px;margin-top:" + (proxy._marginTop - 2) + "px;height:2px;width:12px'></div>" + //top-left open bar
                 "<div class='e-rg-rangdiv' style='position:absolute;left:{{:left + width -10}}px;margin-top:{{>~height +" + proxy._marginTop + "}}px;height:2px;width:12px'></div>" + //bottom-left open bar
                "{{/for}}" +
                "</div>" + 
                "</td>" +

                //right label
               "{{/if}}";

            parentTr += tr;
            parentTr += "</tr>";

            var templates = {};
            templates[this._id + "_CustomTemplate2"] = parentTr;
            $.templates(templates);

        },
    };
})(jQuery, Syncfusion);;