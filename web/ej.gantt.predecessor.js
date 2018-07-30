(function ($, ej, undefined) {
    'use strict';
    ej.ganttFeatures = ej.ganttFeatures || {};
    ej.ganttFeatures.predecessor = {
        /* Method to refresh all predecesor lines */
        UpdatePredecessor: function () {
            var proxy = this;
            proxy._updatedRecordsDateByPredecessor();

            proxy._$ganttchartHelper.ejGanttChart("clearConnectorLines");
            proxy._connectorLinesCollection = [];
            proxy._createConnectorLinesCollection();
            proxy._$ganttchartHelper.ejGanttChart("renderConnectorLines",
                proxy._connectorLinesCollection);
        },

        /*Method to reCreate the connecotr lines objects*/
        _refreshConnectorLines: function (isValidationEnabled, isClearLines, isRefreshCritical) {
            if (this.model.viewType == "resourceView")
                return;
            this._isValidationEnabled = ej.isNullOrUndefined(isValidationEnabled) ? false : isValidationEnabled;
            if (isClearLines)
                this._$ganttchartHelper.ejGanttChart("clearConnectorLines");
            this._connectorlineIds = [];
            this._connectorLinesCollection = [];
            this._createConnectorLinesCollection();
            if (isRefreshCritical && this.isCriticalPathEnable == true) {
                this._$ganttchartHelper.ejGanttChart("criticalConnectorLine", this.criticalPathCollection, this.detailPredecessorCollection, true, this.collectionTaskId);
            }
        },
        //Ensure the predecessor ids and characters in string
        _ensurePredecessorCollection: function () {
            var proxy = this, model = proxy.model,
                predecessorsCollection = proxy._predecessorsCollection,
                plength = predecessorsCollection.length - 1;
            for (var f = plength; f >= 0; f--) {
                var record = predecessorsCollection[f],
                    predecessors = record.predecessorsName;
                if (predecessors && predecessors.length) {
                    record.predecessor = record._calculatePredecessor(predecessors, proxy._durationUnitEditText, model.durationUnit, proxy);
                    if (!proxy._isValidPredecessorString) {
                        var ptxt = proxy._getPredecessorStringValue(record);
                        record.predecessorsName = ptxt;
                        record.item.predecessor = ptxt;
                        proxy._isValidPredecessorString = true;
                    }
                    /*update predecesor in shared resource tasks*/
                    if (model.viewType == "resourceView") {
                        var updatedObj = {};
                        updatedObj.predecessor = record.predecessor;
                        updatedObj.predecessorsName = record.predecessorsName;
                        this._updateSharedResourceTask(record, updatedObj);
                    }
                }
            }
        },

        /* Method to create connector lines with it's predecessor value */
        _createConnectorLinesCollection: function (args) {

            var proxy = this,
                model = this.model,
                recordLength = model.currentViewData.length,
                count,
                prdecessorIndex = -1,
                predecessorsCollection,
                ganttRecord,
                connectorLinesCollection = proxy._predecessorsCollection,
                connectorLinesLength = connectorLinesCollection.length,
                x = connectorLinesLength / 2,
                connectorLinesCount,
                enableVirtualization = model.enableVirtualization,
                record;


            if (model.enableVirtualization && args === "Load") {
                //THis is done for validate all the record during load time
                recordLength = model.updatedRecords.length;
                for (count = 0; count < recordLength; count++) {
                    ganttRecord = model.updatedRecords[count];
                    predecessorsCollection = ganttRecord["predecessor"];
                    if (predecessorsCollection) {
                        record = ganttRecord;
                        proxy._addPredecessorsCollection(ganttRecord, predecessorsCollection);
                    }
                }
            }
            else {

                for (count = 0; count < recordLength; count++) {
                    ganttRecord = model.currentViewData[count];
                    if (enableVirtualization === false && ganttRecord.isExpanded === false)
                        continue;
                    if (model.currentViewData.indexOf(ganttRecord) !== -1) {
                        predecessorsCollection = ganttRecord["predecessor"];
                        if (predecessorsCollection) {
                            record = ganttRecord;
                            proxy._addPredecessorsCollection(ganttRecord, predecessorsCollection);
                        }
                    }
                }

            }
            proxy._$ganttchartHelper && proxy._$ganttchartHelper.ejGanttChart("renderConnectorLines", proxy._connectorLinesCollection);
        },

        /* Validate dates of tasks with predecessor value of ganttRecord */
        _addPredecessorsCollection: function (ganttRecord, predecessorsCollection) {
            var proxy = this,
                predecessorsLength,
                predecessorCount,
                predecessor,
                parentGanttRecord,
                childGanttRecord,
                model = proxy.model,
                connectorObj = {},
                predecessorValue = [],
                updatedRecords = model.updatedRecords;

            if (predecessorsCollection) {

                predecessorsLength = predecessorsCollection.length;

                for (predecessorCount = 0; predecessorCount < predecessorsLength; predecessorCount++) {

                    predecessor = predecessorsCollection[predecessorCount];


                    parentGanttRecord = this._getRecordByTaskId(predecessor.from);
                    childGanttRecord = this._getRecordByTaskId(predecessor.to);

                    if (!model.enableVirtualization) {
                        if ((parentGanttRecord && parentGanttRecord.isExpanded === false) ||
                            (childGanttRecord && childGanttRecord.isExpanded === false))
                            continue;
                    }

                    if (proxy._isValidationEnabled && !proxy._isInExpandCollapse && childGanttRecord)
                        proxy._validatePredecessorDates(childGanttRecord);
                }

                //for calculate auto schedule only validation is enough  
                if (!proxy._enableCreateCollection)
                    return;

                // for correct re draw the alreadey created line in multiple predecessor for same task
                var count = 0;
                $.each(predecessorsCollection, function (inx, value) {

                    if (value.to === ganttRecord.taskId.toString()) {
                        count++;
                    }
                    return count;
                });



                for (predecessorCount = 0; predecessorCount < predecessorsLength; predecessorCount++) {

                    predecessor = predecessorsCollection[predecessorCount];
                    if (count > 1) {
                        predecessor.isdrawn = false;
                    }

                    parentGanttRecord = this._getRecordByTaskId(predecessor.from);
                    childGanttRecord = this._getRecordByTaskId(predecessor.to);

                    if (updatedRecords.indexOf(parentGanttRecord) === -1 || updatedRecords.indexOf(childGanttRecord) == -1)
                        continue;

                    if (!model.enableVirtualization) {
                        if (parentGanttRecord.isExpanded === false || childGanttRecord.isExpanded === false)
                            continue;
                    }

                    //if (proxy._isValidationEnabled && !proxy._isInExpandCollapse)
                    //    proxy._validateChildGanttRecord(parentGanttRecord, childGanttRecord, predecessor);

                    if (parentGanttRecord && childGanttRecord) {

                        connectorObj = proxy._createConnectorLineObject(parentGanttRecord, childGanttRecord, predecessor);

                        if (connectorObj) {

                            if (proxy._connectorlineIds.length > 0 && proxy._connectorlineIds.indexOf(connectorObj.ConnectorLineId) == -1) {

                                proxy._connectorLinesCollection.push(connectorObj);
                                proxy._connectorlineIds.push(connectorObj.ConnectorLineId);
                            }
                            else if (proxy._connectorlineIds.length == 0) {
                                proxy._connectorLinesCollection.push(connectorObj);
                                proxy._connectorlineIds.push(connectorObj.ConnectorLineId);
                            }
                            else if (proxy._connectorlineIds.indexOf(connectorObj.ConnectorLineId) != -1) {
                                var index = proxy._connectorlineIds.indexOf(connectorObj.ConnectorLineId);
                                proxy._connectorLinesCollection[index] = connectorObj;
                            }
                            predecessor.isdrawn = true;
                        }
                    }
                    // }
                }

            }

        },

        /* create connector line object collection for rendering */
        _createConnectorLineObject: function (parentGanttRecord, childGanttRecord, predecessor) {
            var connectorObj = {},
                proxy = this,
                model = proxy.model,
                parentTop,
                childTop,
                updatedRecords = model.updatedRecords,
                parentIndex = updatedRecords.indexOf(parentGanttRecord),
                childIndex = updatedRecords.indexOf(childGanttRecord),
                count = 0,
                index = 0;

            if (parentIndex === -1 || childIndex === -1) {
                return;
            }
            if (!model.enableVirtualization) {
                var collapsedCount = 0;
                if (childIndex > parentIndex) {

                    for (count = 0; count < parentIndex; count++) {
                        if (updatedRecords[count].isExpanded === false)
                            ++collapsedCount;
                    }
                    index = parentIndex;
                    parentIndex -= collapsedCount;

                    for (index; index < childIndex; index++) {
                        if (updatedRecords[index].isExpanded === false)
                            ++collapsedCount;
                    }
                    childIndex -= collapsedCount;
                }
                else if (parentIndex > childIndex) {
                    for (count = 0; count < childIndex; count++) {
                        if (updatedRecords[count].isExpanded === false)
                            ++collapsedCount;
                    }
                    index = childIndex;
                    childIndex -= collapsedCount;

                    for (index ; index < parentIndex; index++) {
                        if (updatedRecords[index].isExpanded === false)
                            ++collapsedCount;
                    }
                    parentIndex -= collapsedCount;
                }
            }

            var chartObject = $("#ejGanttChart" + proxy._id).ejGanttChart("instance");
            if (ej.browserInfo().name == "msie" && ej.browserInfo().version < 9) {
                var rowHeight = model.rowHeight;
            } else {
                var rowHeight = $("#" + chartObject._$ganttViewTablebody[0].id).find("tr:first")[0].getBoundingClientRect().height;
            }
            if (parentIndex != -1 && childIndex != -1) {
                //As Milestone position as changed to midpoint, hence reducing predecessor left based on milestone left point.
                connectorObj["ParentLeft"] = parentGanttRecord.isMilestone ? parentGanttRecord['left'] - proxy._milesStoneWidth / 2 : parentGanttRecord['left'];
                connectorObj["ChildLeft"] = childGanttRecord.isMilestone ? childGanttRecord['left'] - proxy._milesStoneWidth / 2 : childGanttRecord['left'];
                connectorObj["ParentWidth"] = parentGanttRecord['width'] == 0 || parentGanttRecord['isMilestone'] ? (Math.floor(proxy._milesStoneWidth * 1.2)) : parentGanttRecord['width'];
                connectorObj["ChildWidth"] = childGanttRecord['width'] == 0 || childGanttRecord['isMilestone'] ? (Math.floor(proxy._milesStoneWidth * 1.2)) : childGanttRecord['width'];
                connectorObj["ParentIndex"] = parentIndex;
                connectorObj["ChildIndex"] = childIndex;
                connectorObj["RowHeight"] = rowHeight;
                connectorObj["Type"] = predecessor.predecessorsType;
                connectorObj["ConnectorLineId"] = "parent" + parentGanttRecord['taskId'] + "child" + childGanttRecord['taskId'];
                connectorObj["milestoneParent"] = parentGanttRecord.isMilestone ? true : false;
                connectorObj["milestoneChild"] = childGanttRecord.isMilestone ? true : false;

                return connectorObj;
            }
        },

        /*update date as per offset value */
        _updateDateByOffset: function (date, predecessor, isMilestone, record) {
            var resultDate,
                offsetValue = predecessor.offset,
                durationUnit = predecessor.offsetDurationUnit;
            if (offsetValue < 0) {
                resultDate = this._getStartDate(this._checkEndDate(date, record), (offsetValue * -1), durationUnit, record);
            } else {
                resultDate = this._getEndDate(date, offsetValue, durationUnit, record, false);
                if (!isMilestone)
                    resultDate = this._checkStartDate(resultDate, record);
            }
            return resultDate;
        },

        //Validate the child Gantt Record on edit actions
        _validateChildGanttRecord: function (parentGanttRecord, childGanttRecord, predecessor, predecessorValidation, offsetChanged) {
            var proxy = this,
            model = proxy.model,
            predecessorType;

            if (proxy._editedTaskBarItem === childGanttRecord || (model.viewType == "resourceView" && proxy._editedTaskBarItem && proxy._editedTaskBarItem.taskId == childGanttRecord.taskId)) {
                return;
            }
            if (predecessorValidation && (childGanttRecord.isAutoSchedule || model.validateManualTasksOnLinking)) {
                switch (predecessor.predecessorsType) {

                    case 'SS':
                        var currentTaskId = childGanttRecord['taskId'].toString(),
                            predecessorsCollection = childGanttRecord['predecessor'],
                            childPredecessor = predecessorsCollection.filter(function (data) { return data.to === currentTaskId }),
                            minStartDate = proxy._getPredecessorDate(childGanttRecord, childPredecessor, predecessor.predecessorsType);

                        childGanttRecord.startDate = new Date(minStartDate);
                        childGanttRecord._calculateEndDate(this);
                        childGanttRecord.left = childGanttRecord._calculateLeft(this);
                        childGanttRecord.width = childGanttRecord._calculateWidth(this);
                        childGanttRecord.progressWidth = childGanttRecord._getProgressWidth(childGanttRecord.width, childGanttRecord.status);
                        break;

                    case 'SF':
                        var currentTaskId = childGanttRecord['taskId'].toString(),
                            predecessorsCollection = childGanttRecord['predecessor'],
                            childPredecessor = predecessorsCollection.filter(function (data) { return data.to === currentTaskId }),
                            minStartDate = proxy._getPredecessorDate(childGanttRecord, childPredecessor, predecessor.predecessorsType);

                        childGanttRecord.startDate = new Date(minStartDate);
                        childGanttRecord._calculateEndDate(this);
                        childGanttRecord.left = childGanttRecord._calculateLeft(this);
                        childGanttRecord.width = childGanttRecord._calculateWidth(this);
                        childGanttRecord.progressWidth = childGanttRecord._getProgressWidth(childGanttRecord.width, childGanttRecord.status);
                        break;

                    case 'FS':

                        var predecessorsCollection = childGanttRecord['predecessor'],
                            currentTaskId = childGanttRecord['taskId'].toString(),
                            childPredecessor = predecessorsCollection && predecessorsCollection.filter(function (data) { return data.to === currentTaskId }),
                            maxStartDate = proxy._getPredecessorDate(childGanttRecord, childPredecessor, predecessor.predecessorsType);

                        childGanttRecord.startDate = new Date(maxStartDate);
                        childGanttRecord._calculateEndDate(this);
                        childGanttRecord.left = childGanttRecord._calculateLeft(this);
                        childGanttRecord.width = childGanttRecord._calculateWidth(this);
                        childGanttRecord.progressWidth = childGanttRecord._getProgressWidth(childGanttRecord.width, childGanttRecord.status);

                        break;

                    case 'FF':
                        var currentTaskId = childGanttRecord['taskId'].toString(),
                            predecessorsCollection = childGanttRecord['predecessor'],
                            childPredecessor = predecessorsCollection && predecessorsCollection.filter(function (data) { return data.to === currentTaskId });
                        childGanttRecord.startDate = proxy._getPredecessorDate(childGanttRecord, childPredecessor, predecessor.predecessorsType);
                        childGanttRecord._calculateEndDate(this);
                        childGanttRecord.left = childGanttRecord._calculateLeft(this);
                        childGanttRecord.width = childGanttRecord._calculateWidth(this);
                        childGanttRecord.progressWidth = childGanttRecord._getProgressWidth(childGanttRecord.width, childGanttRecord.status);
                        break;
                }
            }
            this._updateItemValueInRecord(childGanttRecord);

            if (model.viewType == "resourceView") {
                proxy._updateSharedResourceTask(childGanttRecord);
                childGanttRecord.parentItem && proxy._updateOverlappingValues(childGanttRecord.parentItem, true);
                proxy._updateResourceParentItem(childGanttRecord);
            }
            else if (childGanttRecord.parentItem && childGanttRecord.parentItem.isAutoSchedule && predecessorValidation)
                proxy._updateParentItem(childGanttRecord);
            else if (childGanttRecord.parentItem && !childGanttRecord.parentItem.isAutoSchedule && predecessorValidation)
                proxy._updateManualParentItem(childGanttRecord);
            if (proxy._isTreeGridRendered || proxy._isGanttChartRendered) {
                if (model.viewType == "resourceView" && childGanttRecord.eResourceTaskType == "resourceChildTask") {
                    proxy.refreshGanttRecord(childGanttRecord.parentItem, childGanttRecord);
                } else {
                    proxy.refreshGanttRecord(childGanttRecord);
                }
            }
        },

        /*Get validated start of task on all predecessor type*/
        _getValidatedStartDate: function (ganttRecord, parentGanttRecord, predecessor) {
            var type = predecessor.predecessorsType,
                offset = predecessor.offset,
                tempDate, returnStartDate;
            switch (type) {
                case "FS":
                    tempDate = new Date(parentGanttRecord.endDate);
                    if (!ganttRecord.isMilestone || offset != 0)
                        tempDate = this._checkStartDate(tempDate, ganttRecord);
                    if (offset != 0)
                        tempDate = this._updateDateByOffset(tempDate, predecessor, ganttRecord.isMilestone, ganttRecord);
                    if (!ganttRecord.isMilestone)
                        returnStartDate = this._checkStartDate(tempDate, ganttRecord);
                    else
                        returnStartDate = new Date(tempDate);
                    break;
                case "FF":
                    tempDate = new Date(parentGanttRecord.endDate);
                    if (offset != 0)
                        tempDate = this._updateDateByOffset(tempDate, predecessor, ganttRecord.isMilestone, ganttRecord);
                    if (!ganttRecord.isMilestone)
                        tempDate = this._checkEndDate(tempDate, ganttRecord);
                    returnStartDate = this._getStartDate(tempDate, ganttRecord.duration, ganttRecord.durationUnit, ganttRecord);
                    break;
                case "SF":
                    tempDate = new Date(parentGanttRecord.startDate);
                    if (offset != 0)
                        tempDate = this._updateDateByOffset(tempDate, predecessor, ganttRecord.isMilestone, ganttRecord);
                    if (!ganttRecord.isMilestone)
                        tempDate = this._checkEndDate(tempDate, ganttRecord);
                    returnStartDate = this._getStartDate(tempDate, ganttRecord.duration, ganttRecord.durationUnit, ganttRecord);
                    break;
                case "SS":
                    tempDate = new Date(parentGanttRecord.startDate);
                    if (offset != 0)
                        tempDate = this._updateDateByOffset(tempDate, predecessor, ganttRecord.isMilestone, ganttRecord);
                    if (!ganttRecord.isMilestone)
                        returnStartDate = this._checkStartDate(tempDate, ganttRecord);
                    else
                        returnStartDate = tempDate;
                    break;
            }
            return returnStartDate;
        },

        //Get maximum or minimum date as per predecessor type
        _getPredecessorDate: function (ganttRecord, predecessorsCollection) {
            var minStartDate = null, model = this.model,
                maxStartDate = null,
                length, i,
                tempStartDate,
                parentGanttRecord,
                childGanttRecord,
                validatedpredecessor = predecessorsCollection.filter(function (data) {
                    if (data.to === ganttRecord.taskId.toString())
                        return true;
                });

            if (validatedpredecessor) {
                length = validatedpredecessor.length;
                for (i = 0; i < length; i++) {
                    var predecessor = validatedpredecessor[i];
                    parentGanttRecord = this._getRecordByTaskId(predecessor.from);
                    childGanttRecord = this._getRecordByTaskId(predecessor.to);
                    tempStartDate = this._getValidatedStartDate(childGanttRecord, parentGanttRecord, predecessor);
                    if (maxStartDate == null)
                        maxStartDate = new Date(tempStartDate);
                    else if (tempStartDate.getTime() > maxStartDate.getTime())
                        maxStartDate = new Date(tempStartDate);
                }
            }
            return maxStartDate;
        },

        /*Remove connector line from DOM and connectorline collection*/
        _removeConnectorLine: function (predecessor, ganttRecord) {
            var proxy = this,
                model = this.model,
                connectorLineId,
                parentGanttRecord,
                record,
                i = 0,
                length = predecessor && predecessor.length,
                index = -1;

            for (i = 0; i < length; i++) {
                parentGanttRecord = this._getRecordByTaskId(predecessor[i].from);
                record = this._getRecordByTaskId(predecessor[i].to);

                if (ganttRecord.taskId.toString() === predecessor[i].to.toString()) {

                    index = parentGanttRecord.predecessor.indexOf(predecessor[i]);
                    index >= 0 && parentGanttRecord.predecessor.splice(index, 1);
                    this._updateResourcePredecessor(parentGanttRecord);
                }

                if (parentGanttRecord && record) {
                    connectorLineId = "parent" + parentGanttRecord['taskId'] + "child" + record['taskId'];
                    proxy._$ganttchartHelper.ejGanttChart("removeConnectorline", connectorLineId);
                    this._updateConnectorLineCollection(connectorLineId);
                }
            }
        },

        /*Add new connector line in connectorline collection and it's successor record*/
        _addConnectorLine: function (ganttRecord) {
            var proxy = this,
                count = 0,
                model = proxy.model,
                predecessors = ganttRecord.predecessor,
                length,
                predecessor,
                successorGanttRecord;

            if (predecessors) {

                length = predecessors.length;

                for (count = 0; count < length; count++) {

                    predecessor = predecessors[count];

                    if (predecessor.to === ganttRecord.taskId.toString()) {
                        successorGanttRecord = this._getRecordByTaskId(predecessor.from);
                    }

                    if (successorGanttRecord) {
                        if (successorGanttRecord.predecessor) {
                            successorGanttRecord.predecessor.push(predecessor);
                        } else {
                            successorGanttRecord.predecessor = [];
                            successorGanttRecord.predecessor.push(predecessor);
                            proxy._predecessorsCollection.push(successorGanttRecord);
                        }
                        this._updateResourcePredecessor(successorGanttRecord);
                    }
                }
            }
        },

        /* updated all records dates as per predecessor and successor collections */
        _updatedRecordsDateByPredecessor: function () {
            var proxy = this, model = this.model,
                flatRecords, length, checkedIDs = [],
                isResourceView  = model.viewType == "resourceView";
            flatRecords = isResourceView ? this._resourceUniqTasks : model.flatRecords;
            length = flatRecords.length;

            for (var count = 0; count < length ; count++) {
                if (flatRecords[count].predecessor && flatRecords[count].item[model.predecessorMapping]) {
                    proxy._validatePredecessorDates(flatRecords[count]);
                } 
            }
        },

        /* updated the record dates as per predecessor and successor collections */
        _validatePredecessorDates: function (childGanttRecord) {

            var proxy = this, model = proxy.model;

            if (childGanttRecord.predecessor) {

                var predecessorsCollection = childGanttRecord['predecessor'],
                    count,
                    parentGanttRecord,
                    record = null,
                    isValidated = false,
                    predecessor,
                    lowestOffset;

                var currentTaskId = childGanttRecord['taskId'].toString(),
                    predecessors = predecessorsCollection.filter(function (data) { return data.to === currentTaskId }),
                    successors = predecessorsCollection.filter(function (data) { return data.from === currentTaskId });
                var predecessorLength = predecessors.length;

                for (count = 0; count < predecessorLength; count++) {
                    predecessor = predecessors[count];
                    parentGanttRecord = this._getRecordByTaskId(predecessor.from);
                    record = this._getRecordByTaskId(predecessor.to);
                    if (record.isAutoSchedule || model.validateManualTasksOnLinking)
                        proxy._validateChildGanttRecord(parentGanttRecord, record, predecessor, model.enablePredecessorValidation);
                }

                var length = successors.length;

            }
        },

        /*validate and refresh the predecessor connector lines*/
        _validatePredecessor: function (childGanttRecord, previousValue, validationOn) {

            var proxy = this, model = proxy.model, isResourceView = model.viewType == "resourceView" ? true : false;

            if (childGanttRecord.predecessor) {

                var predecessorsCollection = childGanttRecord['predecessor'],
                    count,
                    parentGanttRecord,
                    record = null,
                    connectorLineId,
                    isValidated = false,
                    predecessor,
                    connectorLineObject,
                    lowestOffset,
                    isOffsetChanged = false;

                var currentTaskId = childGanttRecord['taskId'].toString(),

                    predecessors = predecessorsCollection.filter(function (data) { return data.to === currentTaskId }),
                    successors = predecessorsCollection.filter(function (data) { return data.from === currentTaskId });
                var predecessorLength = predecessors.length;

                for (count = 0; count < predecessorLength; count++) {
                    predecessor = predecessors[count];
                    isOffsetChanged = proxy._isOffsetChange(predecessor, previousValue, count);
                    parentGanttRecord = proxy._getRecordByTaskId(predecessor.from);
                    record = proxy._getRecordByTaskId(predecessor.to);

                    if (!isResourceView) {
                        connectorLineId = "parent" + parentGanttRecord['taskId'] + "child" + record['taskId'];
                        if (proxy._$ganttchartHelper) {
                            proxy._$ganttchartHelper.ejGanttChart("removeConnectorline", connectorLineId);
                            this._updateConnectorLineCollection(connectorLineId);
                        }
                    }

                    if (model.enablePredecessorValidation && (record.isAutoSchedule || model.validateManualTasksOnLinking))
                        proxy._isValidationEnabled = true;
                    else
                        proxy._isValidationEnabled = false;
                    if ((childGanttRecord.taskId.toString() === predecessor.to || childGanttRecord.taskId.toString() === predecessor.from) &&
                        (!validationOn || validationOn == "predecessor"))
                        proxy._validateChildGanttRecord(parentGanttRecord, record, predecessor, model.enablePredecessorValidation, isOffsetChanged);
                }

                if (!isResourceView) {
                    for (count = 0; count < predecessorLength; count++) {
                        predecessor = predecessors[count];
                        parentGanttRecord = proxy._getRecordByTaskId(predecessor.from);
                        record = proxy._getRecordByTaskId(predecessor.to);

                        if ((model.enableVirtualization === false && (parentGanttRecord.isExpanded === false || record.isExpanded == false)))//(model.enableVirtualization === false && !parentGanttRecord.isExpanded && record.isExpanded === false)
                            continue;

                        connectorLineObject = proxy._createConnectorLineObject(parentGanttRecord, record, predecessor);
                        if (connectorLineObject) {
                            if (proxy._connectorlineIds.length > 0 && proxy._connectorlineIds.indexOf(connectorLineObject.ConnectorLineId) == -1) {

                                proxy._updatedConnectorLineCollection.push(connectorLineObject);
                                proxy._connectorlineIds.push(connectorLineObject.ConnectorLineId);
                            }
                            else if (proxy._connectorlineIds.length == 0) {
                                proxy._updatedConnectorLineCollection.push(connectorLineObject);
                                proxy._connectorlineIds.push(connectorLineObject.ConnectorLineId);
                            }
                            else if (proxy._connectorlineIds.indexOf(connectorLineObject.ConnectorLineId) != -1) {
                                var index = proxy._connectorlineIds.indexOf(connectorLineObject.ConnectorLineId);
                                proxy._updatedConnectorLineCollection[index] = connectorLineObject;
                            }
                        }
                    }
                }

                var length = successors.length;

                for (count = 0; count < length; count++) {

                    predecessor = successors[count];
                    parentGanttRecord = proxy._getRecordByTaskId(predecessor.from);
                    record = proxy._getRecordByTaskId(predecessor.to);
                    isOffsetChanged = proxy._isOffsetChange(predecessor, previousValue, count);
                    if (model.enablePredecessorValidation && (record.isAutoSchedule || model.validateManualTasksOnLinking))
                        proxy._isValidationEnabled = true;
                    else
                        proxy._isValidationEnabled = false;
                    if (!isResourceView) {
                        connectorLineId = "parent" + parentGanttRecord['taskId'] + "child" + record['taskId'];
                        if (proxy._$ganttchartHelper) {
                            proxy._$ganttchartHelper.ejGanttChart("removeConnectorline", connectorLineId);
                            this._updateConnectorLineCollection(connectorLineId);
                        }
                    }


                    if (validationOn != "predecessor" && proxy._isValidationEnabled)
                        proxy._validateChildGanttRecord(parentGanttRecord, record, predecessor, model.enablePredecessorValidation, isOffsetChanged);
                    if ((model.enableVirtualization === false && (parentGanttRecord.isExpanded === false || record.isExpanded == false)))
                        continue;

                    if (!isResourceView) {
                        connectorLineObject = proxy._createConnectorLineObject(parentGanttRecord, record, predecessor);
                        if (connectorLineObject) {
                            if (proxy._connectorlineIds.length > 0 && proxy._connectorlineIds.indexOf(connectorLineObject.ConnectorLineId) == -1) {

                                proxy._updatedConnectorLineCollection.push(connectorLineObject);
                                proxy._connectorlineIds.push(connectorLineObject.ConnectorLineId);
                            }
                            else if (proxy._connectorlineIds.length == 0) {
                                proxy._updatedConnectorLineCollection.push(connectorLineObject);
                                proxy._connectorlineIds.push(connectorLineObject.ConnectorLineId);
                            }
                            else if (proxy._connectorlineIds.indexOf(connectorLineObject.ConnectorLineId) != -1) {
                                var index = proxy._connectorlineIds.indexOf(connectorLineObject.ConnectorLineId);
                                proxy._updatedConnectorLineCollection[index] = connectorLineObject;
                            }
                        }
                    }

                    record && proxy._validatePredecessor(record, undefined, "successor");

                }
            }
        },

        /*While zooming the browser we have re-rendered the connector lines collection
        for this we need keep the connectot lines collection updated*/
        _updateConnectorLineCollection: function (connectorLines) {
            if (typeof connectorLines == "string") {
                for (var count = 0; count < this._connectorLinesCollection.length; count++) {
                    if (this._connectorLinesCollection[count].ConnectorLineId == connectorLines) {
                        this._connectorLinesCollection.splice(count, 1);
                        break;
                    }
                }
            } else {
                for (var count = 0; count < connectorLines.length; count++) {
                    var currentObj, index = 0;
                    for (var inCount = 0; inCount < this._connectorLinesCollection.length; inCount++) {
                        if (this._connectorLinesCollection[inCount].ConnectorLineId == connectorLines[count].ConnectorLineId) {
                            currentObj = connectorLines[count];
                            index = count;
                            break;
                        }
                    }
                    if (currentObj)
                        this._connectorLinesCollection[index] = currentObj;
                    else
                        this._connectorLinesCollection.push(connectorLines[count]);
                }
            }
        },

        // Check whether the predecessor offset is changed or not.
        _isOffsetChange: function (predecessor, previousValue, count) {
            var proxy = this,
                model = proxy.model,
                isOffsetChanged = false;
            if (!model.enablePredecessorValidation) {
                if (previousValue && previousValue.length) {
                    var predecessorOffset = predecessor.offset ? parseInt(predecessor.offset) : 0,
                        previousPredecessor = previousValue[count],
                        previousPredecessorOffset = previousPredecessor.offset ? parseInt(previousPredecessor.offset) : 0;
                    isOffsetChanged = predecessorOffset != previousPredecessorOffset ? true : false;

                }
                else if (ej.isNullOrUndefined(previousValue)) {
                    isOffsetChanged = false;
                }
                else
                    isOffsetChanged = true;
            }
            return isOffsetChanged;
        },

        /*Create WBS predecessors value*/
        createWBSPredecessor: function () {
            var proxy = this,
                model = proxy.model;
            if (model.enableWBS && model.enableWBSPredecessor && model.predecessorMapping) {
                var linkedRecords = model.flatRecords.filter(function (record) {
                    return record && record["predecessor"];
                });
                for (var r = 0; r < linkedRecords.length; r++) {
                    var linkRecord = linkedRecords[r],
                        prdc = linkRecord["predecessor"],
                        wbspred = null;
                    for (var p = 0; p < prdc.length; p++) {
                        var refId = +prdc[p].from, refRecord;
                        refRecord = model.flatRecords.filter(function (record) {
                            return record && record.taskId == refId;
                        });
                        var newOne = refRecord[0]["WBS"] + prdc[p].predecessorsType;
                        wbspred = wbspred ? (wbspred + "," + newOne) : newOne;
                    }
                    linkRecord["WBSPredecessor"] = wbspred;
                    linkRecord["item"]["WBSPredecessor"] = wbspred;
                }
            }
        },
        /*Calculate serial number predecessors*/
        calculateSerialNumberPredecessor: function () {
            var proxy = this,
                model = proxy.model;
            if (model.enableSerialNumber && model.predecessorMapping) {
                var linkedRecords = proxy._predecessorsCollection,
                    linksLength = linkedRecords.length;
                for (var r = 0; r < linksLength; r++) {
                    var linkRecord = linkedRecords[r],
                        prdc = linkRecord["predecessor"],
                        snoPred = null;
                    for (var p = 0; p < prdc.length; p++) {
                        var refId = +prdc[p].from, refRecord;
                        refRecord = model.flatRecords.filter(function (record) {
                            return record && record.taskId == refId;
                        });
                        var newOne = refRecord.length && refRecord[0]["serialNumber"] + prdc[p].predecessorsType;

                        if (prdc[p].offset != 0) {
                            newOne += prdc[p].offset > 0 ? ("+" + prdc[p].offset + " ") : (prdc[p].offset + " ");
                            var multiple = Math.abs(prdc[p].offset) != 1;
                            if (prdc[p].offsetDurationUnit == "day")
                                newOne += multiple ? proxy._durationUnitTexts.days : proxy._durationUnitTexts.day;
                            else if (prdc[p].offsetDurationUnit == "hour")
                                newOne += multiple ? proxy._durationUnitTexts.hours : proxy._durationUnitTexts.hour;
                            else
                                newOne += multiple ? proxy._durationUnitTexts.minutes : proxy._durationUnitTexts.minute;
                        }
                        snoPred = snoPred ? (snoPred + "," + newOne) : newOne;
                    }
                    linkRecord["serialNumberPredecessor"] = snoPred;
                    linkRecord["item"]["serialNumberPredecessor"] = snoPred;
                }
            }
        },
        /*Get proper task with multiple views for predecesor validation*/
        _getRecordByTaskId: function (id) {
            return this.model.viewType == "resourceView" ?
                this._resourceUniqTasks[this._resourceUniqTaskIds.indexOf(id)] : this.model.flatRecords[this.model.ids.indexOf(id)];
        },

        /*Update value of predecessor collection in predecessor and succesor records*/
        _updatePredecessors: function () {
            var proxy = this,
                count = 0,
                predecessorsCollection = proxy._predecessorsCollection,
                length = predecessorsCollection.length,
                ganttRecord,
                connectorsCollection,
            i = 0,
            successorGanttRecord,
            connectorCount;
            for (count; count < length; count++) {
                ganttRecord = predecessorsCollection[count];
                connectorsCollection = ganttRecord["predecessor"];
                connectorCount = connectorsCollection.length;
                for (i = 0; i < connectorCount; i++) {
                    var connector = connectorsCollection[i];
                    successorGanttRecord = proxy._getRecordByTaskId(connector.from);
                    if (connector.from !== ganttRecord.taskId.toString()) {
                        if (successorGanttRecord) {
                            if (successorGanttRecord.predecessor) {
                                successorGanttRecord.predecessor.push(connector);
                            } else {
                                successorGanttRecord.predecessor = [];
                                successorGanttRecord.predecessor.push(connector);
                                predecessorsCollection.push(successorGanttRecord);
                            }
                            this._updateResourcePredecessor(successorGanttRecord);
                        }
                    }

                }
            }
        },

        /*Method to update connector line width by setModel method*/
        _updateConnectorlineWidth: function (lineWidth) {
            var proxy = this;
            this.model.connectorlineWidth = lineWidth;
            proxy._$ganttchartHelper.ejGanttChart("updateConnectorlineWidth", lineWidth);
            proxy._$ganttchartHelper.ejGanttChart("clearConnectorLines");
            proxy._$ganttchartHelper.ejGanttChart("renderConnectorLines",
                proxy._connectorLinesCollection);

        },

        /*Method to update the connector line background by setModel method*/
        _updateConnectorLineBackground: function (bgcolor) {
            var proxy = this;
            this.model.connectorLineBackground = bgcolor;
            proxy._$ganttchartHelper.ejGanttChart("updateConnectorLineBackground", bgcolor);
            proxy._$ganttchartHelper.ejGanttChart("clearConnectorLines");
            proxy._$ganttchartHelper.ejGanttChart("renderConnectorLines",
                proxy._connectorLinesCollection);

        },

        /* validate predecessor value of adding record*/
        _validateAddRecordPrecessorValue: function (args) {
            var proxy = this, data = args.data, model = this.model;
            /* Validate the predecessor value*/
            if (model.predecessorMapping && data[model.predecessorMapping] && data[model.predecessorMapping].length > 0) {
                var validateArgs = {};
                validateArgs.currentRecord = args.currentRecord;
                validateArgs.predecessorString = data[model.predecessorMapping].split(",");
                if (!proxy._editedPredecessorValidation(validateArgs)) {
                    data[model.predecessorMapping] = "";
                    args.currentRecord.predecessor = null;
                    args.currentRecord.predecessorsName = "";
                    return false;
                }
                else {
                    return true;
                }
            } else {
                return true;
            }
        },

        //To get record from serial number
        _recordIdFromSerialnumber: function (sno) {
            var proxy = this, model = proxy.model,
                flatDatas = model.flatRecords, targetRecord;
            targetRecord = flatDatas.filter(function (record) {
                return record && record.serialNumber == sno;
            });
            return targetRecord[0].taskId;
        },

        /*Validate circular reference error in predecessor collection on predecessor vreation*/
        _editedPredecessorValidation: function (args, isSerialCellEdit) {

            var proxy = this,
                flag = true,
                model = this.model,
                recordId = args.currentRecord.taskId, currentId,
                predecessor = args.predecessorString.join(','), predecessorIdArray;
            if (predecessor.length > 0) {
                predecessorIdArray = proxy.model.enableSerialNumber && isSerialCellEdit ? proxy._idFromSerialPredecessor(predecessor) : proxy._idFromPredecessor(predecessor);
                for (var count = 0; count < predecessorIdArray.length; count++) {
                    //Check edited item has parent item in predecessor collection
                    var editingData = args.currentRecord;
                    if (model.viewType == "projectView") {
                        if (editingData && editingData.parentItem) {
                            if (predecessorIdArray.indexOf(editingData.parentItem.taskId.toString()) !== -1) {
                                return false;
                            }
                        }
                        for (var p = 0; p < predecessorIdArray.length; p++) {
                            var record = proxy.model.flatRecords.filter(function (item) {
                                return item && item.taskId == predecessorIdArray[p];
                            });
                            if (record[0] && record[0].hasChildRecords)
                                return false;
                        }
                    }
                    // Check if predecessor exist more then one 
                    var tempIdArray = predecessorIdArray.slice(0), checkArray = [], countFlag = true;
                    $.each(tempIdArray, function (index, value) {
                        if (checkArray.indexOf(value) === -1)
                            checkArray.push(value);
                        else
                            countFlag = false;
                    });
                    if (countFlag === false) {
                        return false;

                    }
                    //Cyclick check  
                    currentId = predecessorIdArray[count];
                    var visitedIdArray = [];
                    var predecessorCollection = predecessorIdArray.slice(0);
                    predecessorCollection.splice(count, 1);


                    while (currentId !== null) {
                        var currentIdArray = [], currentIdIndex,
                            currentRecord;
                        if (visitedIdArray.indexOf(currentId) === -1) {
                            currentRecord = proxy._getRecordByTaskId(currentId.toString());
                            //Predecessor id not in records collection
                            if (ej.isNullOrUndefined(currentRecord))
                                return false;
                            //  var currentPredecessor="";
                            if (!ej.isNullOrUndefined(currentRecord.predecessor) && currentRecord.predecessor.length > 0) {
                                $.each(currentRecord.predecessor, function (index, value) {
                                    if (currentRecord.taskId.toString() !== value.from) {
                                        currentIdArray.push(value.from.toString());
                                        currentIdIndex = index;
                                    }
                                });
                                //    currentPredecessor=currentRecord.predecessor[0].from
                            }
                            if (recordId.toString() === currentRecord.taskId.toString() || currentIdArray.indexOf(recordId.toString()) !== -1) { // || predecessorCollection.indexOf(currentPredecessor) !== -1
                                //cycylic occurs//break;
                                return false;
                            }
                            visitedIdArray.push(currentId);
                            if (!ej.isNullOrUndefined(currentRecord.predecessor) && currentRecord.predecessor.length > 0) {
                                var result;
                                if (currentIdArray.length > 1) {
                                    result = this._predecessorValidation(currentIdArray, args);
                                }
                                else if (currentIdArray.length == 1)
                                    currentId = currentRecord.predecessor[currentIdIndex].from;

                                if (result === false) {
                                    return false;
                                }
                            }
                            else
                                break;
                        }
                        else {
                            break;
                        }
                    }
                }
            }
            return flag;
        },

        /*Helper method to validate circular reference error in predecessor collection on predecessor vreation*/
        _predecessorValidation: function (predecessor, args) {
            var proxy = this;
            var recordId = args.currentRecord.taskId, currentId, currentRecord;
            for (var count = 0; count < predecessor.length; count++) {
                currentId = predecessor[count];
                var visitedIdArray = [];
                var predecessorCollection = predecessor.slice(0);
                predecessorCollection.splice(count, 1);

                while (currentId !== null) {
                    var currentIdArray = [];
                    if (visitedIdArray.indexOf(currentId) === -1) {
                        currentRecord = proxy._recordReturnerByID(currentId);
                        //Predecessor id not in records collection
                        if (ej.isNullOrUndefined(currentRecord))
                            return false;

                        if (!ej.isNullOrUndefined(currentRecord.predecessor) && currentRecord.predecessor.length > 0) {
                            $.each(currentRecord.predecessor, function (index, value) {
                                if (currentRecord.taskId.toString() !== value.from)
                                    currentIdArray.push(value.from.toString());
                            });
                        }
                        if (recordId.toString() === currentRecord.taskId.toString() || currentIdArray.indexOf(recordId.toString()) !== -1) { // || predecessorCollection.indexOf(currentPredecessor) !== -1
                            //cycylic occurs//break;
                            return false;
                        }
                        visitedIdArray.push(currentId);
                        if (!ej.isNullOrUndefined(currentRecord.predecessor) && currentRecord.predecessor.length > 0) {
                            currentId = currentRecord.predecessor[0].from;
                        }
                        else
                            break;
                    }
                    else {
                        break;
                    }
                }
            }
            return true;

        },

        // predecessor link validation dialog
        _validationDialogTemplate: function () {
            var proxy = this, model = proxy.model,
                $tbody = ej.buildTag('div', "", {}, { 'data-unselectable': 'on' }),
                $form = ej.buildTag('form', "", { 'height': '100%', 'width': '100%', 'font-size': '14px' }, { id: proxy._id + "ValidationRuleForm" }),
                $headerdiv = ej.buildTag('div.e-validationHeader', "", { 'padding': "10px" }, { id: proxy._id + "_ValidationText" }),
                $contentdiv = ej.buildTag('div.e-ValidationContent', "", {}, {}),

                $innerTable = "<table style='outline:none;border-spacing:2px;border-collapse:separate;padding:10px'>" +
               "<tr style='line-height:1.4'><td class='e-editLabel'><input type='radio' id='" + proxy._id + "_ValidationCancel' name='ValidationRule' checked='checked'/><label for='" + proxy._id + "_ValidationCancel' style='padding-left:10px;font-weight:normal;' id= '" + proxy._id + "_cancelLink'>" + proxy._validationRuleOptions["cancel"] + "</label></td></tr>" +
               "<tr style='line-height:1.4'><td class='e-editLabel'><input type='radio' id='" + proxy._id + "_ValidationRemoveline' name='ValidationRule'/><label for='" + proxy._id + "_ValidationRemoveline' style='padding-left:10px;font-weight:normal;' id='" + proxy._id + "_removeLink'>" + proxy._validationRuleOptions["removeLink"] + "</label></td></tr>" +
               "<tr style='line-height:1.4'><td class='e-editLabel'>{{if additionalButton}}<input type='radio' id='" + proxy._id + "_ValidationAddlineOffset' name='ValidationRule'/><label for='" + proxy._id + "_ValidationAddlineOffset' style='padding-left:10px;font-weight:normal;' id='" + proxy._id + "_preserveLink'>" + proxy._validationRuleOptions["preserveLink"] + "</label>{{/if}}</td></tr>  </table>";

            $contentdiv.append($($innerTable));
            $form.append($headerdiv).append($contentdiv);
            $tbody = proxy._renderValidationDialogButton($form, $tbody);
            $.templates(proxy._id + "_ValidationRuleTemplate", $tbody.html());
        },
        /*Method to render button predecessor validation dialog*/
        _renderValidationDialogButton: function (form, tbody) {

            var btnId = "ValidationRuleDialog_",
                proxy = this,
                model = proxy.model,
                okbtn = ej.buildTag('input', "",
                 {
                     'border-radius': '3px',
                     'min-width': '100px',
                     'max-width': '300px',
                     'float': 'right',
                 },
                 { type: "button", id: btnId + proxy._id + "_validationOk" }),
                 okText = proxy._okButtonText,
                 cancelText = proxy._cancelButtonText,
                 cancelbtn = ej.buildTag('input', "",
                {
                    'border-radius': '3px',
                    'min-width': '100px',
                    'max-width': '300px',
                    'float': 'right',
                    'margin-left': '10px'
                },
                {
                    type: "button",
                    id: btnId + proxy._id + "_validationCancel"
                }),
                btnDiv = ej.buildTag('div', "", {}, { 'class': "e-gantt-validation-btn" });

            okbtn.ejButton(
                {
                    cssClass: model.cssClass,
                    text: okText,
                    minwidth: "auto"
                });
            cancelbtn.ejButton(
                {
                    cssClass: model.cssClass,
                    text: cancelText,
                    width: "auto"
                });
            btnDiv.append(cancelbtn).append(okbtn);
            form.appendTo(tbody)
            btnDiv.appendTo(tbody);
            return tbody;
        },

        // To validate the types while editing the taskbar 
        _validateTypes: function (args) {
            var proxy = this,
               model = proxy.model,
               ganttRecord = args.data,
               j = 0,
               parentGanttRecord = [],
               record = [],
               templateArgs = {},
               predecessorArray = [],
               predecessor = ganttRecord.predecessor,
               preLength = predecessor && predecessor.length,
               previousArgs = proxy._$ganttchartHelper.ejGanttChart("taskbarEditedArguments");
            proxy._editMode = args.editMode;
            if (!args.cancel && !ej.isNullOrUndefined(predecessor)) {
                for (var i = 0; i < preLength; i++) {
                    parentGanttRecord = proxy._getRecordByTaskId(predecessor[i].from),
                    record = proxy._getRecordByTaskId(predecessor[i].to);
                    var startdate = proxy._getPredecessorDate(ganttRecord, predecessor);
                    if (predecessor[i].predecessorsType == "FS") {
                        //To check whether user dragged the task that is below to predecessor end date
                        if (predecessor[i].to == ganttRecord.taskId.toString() && ganttRecord.startDate < startdate && ganttRecord.startDate < parentGanttRecord.endDate) {
                            predecessorArray[j] = predecessor[i];
                            j++;
                            proxy._validationType = predecessor[i].predecessorsType
                            templateArgs = {
                                parentTask: parentGanttRecord,
                                task: ganttRecord,
                                previousData: previousArgs.previousData,
                                violationType: "taskBeforePredecessor",
                                additionalButton: false
                            }
                        }
                            //To check whether user dragged the task that exceeds the predecessor end date
                        else if (predecessor[i].to == ganttRecord.taskId.toString() && ganttRecord.startDate > startdate) {
                            predecessorArray[j] = predecessor[i];
                            j++;
                            proxy._validationType = predecessor[i].predecessorsType
                            templateArgs = {
                                parentTask: parentGanttRecord,
                                task: ganttRecord,
                                previousData: previousArgs.previousData,
                                violationType: "taskAfterPredecessor",
                                additionalButton: true
                            }
                        }
                    }
                }
                // to open and bind event to dialog button if any link violation occurs.
                if (!ej.isNullOrUndefined(templateArgs.violationType) && (!args.validateMode.removeLink || !args.validateMode.respectLink || !args.validateMode.preserveLinkWithEditing)) {
                    proxy._validationPredecessor = predecessorArray;
                    if ($("#" + proxy._id + "_dialogValidationRule").length === 0) {
                        var $dialogCol = ej.buildTag("div.e-dialog e-dialog-content e-shadow e-widget-content", "", { display: "none" }, { id: proxy._id + "_dialogValidationRule" });
                        proxy.element.append($dialogCol);
                        proxy._on($("#" + proxy._id + "_dialogValidationRule"),
                       "click keypress", "#ValidationRuleDialog_" + proxy._id + "_validationOk ,#ValidationRuleDialog_" + proxy._id + "_validationCancel", { args: args }, proxy._validationDialogButtonClick);
                    }

                    if (args.editMode == "dialogEdit" || args.editMode == "cellEdit") {
                        if (!args.validateMode.removeLink && !args.validateMode.respectLink && !args.validateMode.preserveLinkWithEditing)
                            proxy._renderValidationDialog(templateArgs);
                        else if (args.validateMode.removeLink || args.validateMode.respectLink || args.validateMode.preserveLinkWithEditing) {
                            proxy._validationDialogButtonClick(args);
                        }
                    }
                    else if (args.editMode == "dragging" && !proxy.taskbarEdited(previousArgs)) {
                        if (!args.validateMode.removeLink && !args.validateMode.respectLink && !args.validateMode.preserveLinkWithEditing)
                            proxy._renderValidationDialog(templateArgs);
                        else if (args.validateMode.removeLink || args.validateMode.respectLink || args.validateMode.preserveLinkWithEditing) {
                            proxy._validationDialogButtonClick(args);
                        }
                    }
                    else
                        proxy._$ganttchartHelper.ejGanttChart("taskbarEditedCancel", previousArgs);

                    return false;
                }
                else
                    return true;
            }
            else
                return true;
        },

        //To execute the action choosen by the user in validation dialog
        _validationDialogButtonClick: function (e) {
            var proxy = this, model = proxy.model,
                type = null,
                args,
                previousArgs = proxy._$ganttchartHelper.ejGanttChart("taskbarEditedArguments");

            if (e.target.id == "ValidationRuleDialog_" + proxy._id + "_validationOk" || e.target.id == "ValidationRuleDialog_" + proxy._id + "_validationCancel") {
                args = e.data.args;
                type = "dialog";
                if (e.keyCode != 0 && e.keyCode !== undefined && e.keyCode != 13)
                    return true;
            }
            else if (e.target.id == proxy._id + "_dialogValidationRule_closebutton") {
                type = "dialog";
            }
            else {
                args = e;
                type = "argument";
            }

            var ganttRecord = !(ej.isNullOrUndefined(previousArgs.data)) ? previousArgs.data : model.selectedItem,
                 arg = {},
                 predecessor = ganttRecord.predecessor,
                 treegridObject = proxy._$treegridHelper.ejTreeGrid("instance"),
                 previousData = previousArgs.previousData,
                 endEditArguments = proxy._endEditArgs;
            if (type == "dialog" || (args.validateMode && (args.validateMode.removeLink || args.validateMode.respectLink || args.validateMode.preserveLinkWithEditing))) {
                //if the user choosen the cancel option in the dialog or if the dialog closed from close button or choosen to cancel button.
                if ((type == "dialog" && e.target.id == "ValidationRuleDialog_" + proxy._id + "_validationOk" && document.getElementById(proxy._id + "_ValidationCancel").checked)
                    || (type == "dialog" && (e.target.id == "ValidationRuleDialog_" + proxy._id + "_validationCancel" || e.target.id == proxy._id + "_dialogValidationRule_closebutton"))
                    || (args.validateMode && (args.validateMode.respectLink))) {
                    if (proxy._editMode == "dragging") {
                        ganttRecord.startDate = previousData.startDate;
                        if (model.startDateMapping)
                            ganttRecord.item[model.startDateMapping] = previousData.startDate;
                        ganttRecord.endDate = previousData.endDate;
                        if (model.endDateMapping)
                            ganttRecord.item[model.endDateMapping] = previousData.endDate;
                        ganttRecord.left = ganttRecord._calculateLeft(this);
                        ganttRecord.width = previousData.width;
                        ganttRecord.status = previousData.status;
                        ganttRecord.progressWidth = ganttRecord._getProgressWidth(ganttRecord.width, ganttRecord.status);
                        //Update parentitem
                        if (ganttRecord.parentItem && ganttRecord.parentItem.isAutoSchedule) {
                            proxy._updateParentItem(ganttRecord);
                        }
                        else if (ganttRecord.parentItem && !ganttRecord.parentItem.isAutoSchedule)
                            proxy._updateManualParentItem(ganttRecord);
                        proxy._isLastRefresh = false;
                        proxy._connectorlineIds = [];
                        proxy._updatedConnectorLineCollection = [];
                        proxy._validatePredecessor(ganttRecord);
                        if (model.viewType != "resourceView" && proxy._updatedConnectorLineCollection.length > 0) {
                            proxy._$ganttchartHelper.ejGanttChart("appendConnectorLine", proxy._updatedConnectorLineCollection);
                            this._updateConnectorLineCollection(proxy._updatedConnectorLineCollection);
                        }
                        proxy._isLastRefresh = true;
                        proxy.refreshGanttRecord(ganttRecord);
                    }
                    else if (proxy._editMode == "dialogEdit") {
                        this._editedDialogRecord = ganttRecord;
                        if (!proxy._sendSaveRequest("Edit")) {
                            proxy._isAddEditDialogSave = true; // used for skip the actionBegin client side event while closing the dialog box
                        }
                    }
                    else if (proxy._editMode == "cellEdit") {
                        endEditArguments.data[endEditArguments.columnName] = endEditArguments.previousValue;
                        proxy._triggerEndEdit(endEditArguments);
                    }
                    type == "dialog" && $("#" + proxy._id + "_dialogValidationRule").ejDialog("close");
                }
                    //if the user choosen to remove link and keep the editing 
                else if ((type == "dialog" && document.getElementById(proxy._id + "_ValidationRemoveline").checked) || (args.validateMode && (args.validateMode.removeLink))) {
                    var eventArgs = {};
                    if (proxy._editMode == "dragging") {
                        eventArgs.ganttRecord = ganttRecord;
                        proxy._updatePredecessorValues(eventArgs);
                        ej.TreeGrid.refreshRow(treegridObject, model.updatedRecords.indexOf(ganttRecord));
                        proxy._isLastRefresh = true;
                        proxy.refreshGanttRecord(ganttRecord);
                    }
                    else if (proxy._editMode == "dialogEdit") {
                        var treeGridId = "#treegrid" + proxy._id + "predecessorEdit",
                            pre = $(treeGridId).ejTreeGrid("option", "dataSource"),
                            j = 0, index;
                        for (var i = 0; i < proxy._validationPredecessor.length; i++) {
                            if (proxy._validationPredecessor[i].predecessorsType == proxy._validationType) {
                                if (proxy._validationPredecessor[i].from == predecessorTable[j].id) {
                                    index = predecessorTable.indexOf(predecessorTable[j]);
                                    predecessorTable.splice(index, 1);
                                }
                                else {
                                    i--;
                                    j++;
                                }
                            }
                        }
                        eventArgs.ganttRecord = this._editedDialogRecord;
                        proxy._updatePredecessorValues(eventArgs);
                        this._editedDialogRecord = eventArgs.ganttRecord;
                        if (!proxy._sendSaveRequest("Edit")) {
                            proxy._isAddEditDialogSave = true; // used for skip the actionBegin client side event while closing the dialog box
                        }
                    }
                    else if (proxy._editMode == "cellEdit") {
                        eventArgs.ganttRecord = ganttRecord;
                        proxy._updatePredecessorValues(eventArgs);
                        endEditArguments.data = eventArgs.ganttRecord;
                        proxy._triggerEndEdit(endEditArguments);
                    }
                    type == "dialog" && $("#" + proxy._id + "_dialogValidationRule").ejDialog("close");
                }
                    // if the user choosen to keep the both link and editing.
                else if ((type == "dialog" && document.getElementById(proxy._id + "_ValidationAddlineOffset").checked) || (args.validateMode && (args.validateMode.preserveLinkWithEditing))) {
                    if (proxy._editMode == "dialogEdit") {
                        if (!proxy._sendSaveRequest("Edit")) {
                            proxy._isAddEditDialogSave = true; // used for skip the actionBegin client side event while closing the dialog box
                        }
                    }
                    else if (proxy._editMode == "cellEdit")
                        proxy._triggerEndEdit(endEditArguments);
                    type == "dialog" && $("#" + proxy._id + "_dialogValidationRule").ejDialog("close");
                }
                else
                    type == "dialog" && $("#" + proxy._id + "_dialogValidationRule").ejDialog("close");
            }
            else
                type == "dialog" && $("#" + proxy._id + "_dialogValidationRule").ejDialog("close");
        },

        /*Update predecessor value with user selection option in predecessor validation dialog*/
        _updatePredecessorValues: function (args) {
            var proxy = this,
                model = proxy.model,
                predecessor = proxy._validationPredecessor,
                ganttRecord = args.ganttRecord,
                 arg = {}, i,
                 preLength = predecessor.length;

            for (i = 0; i < preLength; i++) {
                if (predecessor[i].predecessorsType == proxy._validationType) {
                    var parentGanttRecord = proxy._getRecordByTaskId(predecessor[i].from),
                        record = proxy._getRecordByTaskId(predecessor[i].to),
                        id = "parent" + parentGanttRecord['taskId'] + "child" + record['taskId'];
                    proxy._$ganttchartHelper.ejGanttChart("removeConnectorline", id);
                    var index = proxy._predecessorsCollection.indexOf(ganttRecord);
                    if (index != 0)
                        proxy._predecessorsCollection.splice(index, 1);
                    arg.parentGanttRecord = parentGanttRecord;
                    arg.predecessor = predecessor[i];
                    arg.data = ganttRecord;
                    arg.validationType = proxy._validationType;
                    proxy._updateRecordCollection(arg);
                }
            }
        },

        /*update predecesor and succesor record's predecessor by option choosen by user in predecessor validation dialog*/
        _updateRecordCollection: function (args) {
            var ganttRecord = args.data,
                proxy = this,
                parentGanttRecord = args.parentGanttRecord,
                predecessorArray = ganttRecord.item[proxy.model.predecessorMapping].split(","),

                index = ganttRecord.predecessor.indexOf(args.predecessor);
            ganttRecord.predecessor.splice(index, 1);
            this._updateResourcePredecessor(ganttRecord);
            var predecessorIndex = predecessorArray.indexOf(args.predecessor.from + "FS");

            if (predecessorIndex != -1) {
                predecessorArray.splice(predecessorIndex, 1);
                ganttRecord.item[proxy.model.predecessorMapping] = predecessorArray.join(',');
                ganttRecord.predecessorsName = predecessorArray.join(',');
                this._updateResourcePredecessor(ganttRecord);
                var parentIndex = parentGanttRecord.predecessor.indexOf(args.predecessor);
                parentGanttRecord.predecessor.splice(parentIndex, 1);
                this._updateResourcePredecessor(parentGanttRecord);
            }
        },

        /*When predecessor rule is broken on edit action to render predecessor validation dialog*/
        _renderValidationDialog: function (args) {
            var proxy = this,
                model = proxy.model,
                temp = document.createElement('div'), title, name, pName;
            $(temp).addClass("e-ValidationRules");
            temp.innerHTML = $.render[proxy._id + "_ValidationRuleTemplate"](args);
            $("#" + proxy._id + "_dialogValidationRule").html($(temp));
            var evntArgs = {};
            evntArgs.cssClass = model.cssClass,
            evntArgs.enableResize = false,
            evntArgs.width = "auto",
            evntArgs.height = "auto",
            evntArgs.contentSelector = "#" + proxy._id,
            evntArgs.allowKeyboardNavigation = false,
            title = proxy._validationDialogTitle;
            evntArgs.title = title;
            evntArgs.enableModal = true,
            evntArgs.allowDraggable = true,
            evntArgs.isResponsive = true,
            evntArgs.close = function () {
                $("#" + proxy._id + "EditAreaNotes").data("ejRTE") && $("#" + proxy._id + "EditAreaNotes").ejRTE("destroy");
            };
            name = !ej.isNullOrUndefined(args.task.taskName) ? args.task.taskName : "ID " + args.task.taskId,
            pName = !ej.isNullOrUndefined(args.parentTask.taskName) ? args.parentTask.taskName : "ID " + args.parentTask.taskId;
            document.getElementById(proxy._id + "_removeLink").innerHTML = String.format(proxy._validationRuleOptions["removeLink"], name, ej.format(args.task.startDate, model.dateFormat, model.locale));
            if (document.getElementById(proxy._id + "_preserveLink")) document.getElementById(proxy._id + "_preserveLink").innerHTML = String.format(proxy._validationRuleOptions["preserveLink"], name, ej.format(args.task.startDate, model.dateFormat, model.locale));

            document.getElementById(proxy._id + "_ValidationText").innerHTML = String.format(proxy._validationRuleText[args.violationType], name, pName);
            $("#" + proxy._id + "_dialogValidationRule").ejDialog(evntArgs);
            $("#" + proxy._id + "_dialogValidationRule_wrapper").addClass("e-gantt-dialog");
            $("#" + proxy._id + "_dialogValidationRule").ejDialog("open");
            $("#" + proxy._id + "_dialogValidationRule_closebutton").click(function (args) { proxy._validationDialogButtonClick(args); })
        },

        /*When we delete parent record, child records predecessor will update in this method*/
        _removeChildRecordsPredecessor: function (record) {
            var proxy = this;
            if (record.hasChildRecords) {
                var length = record.childRecords.length, index = 0;
                for (index; index < length; index++) {
                    record.childRecords[index].predecessor && proxy._removePredecessor(record.childRecords[index].predecessor, record.childRecords[index]);
                    if (record.childRecords[index].hasChildRecords) {
                        proxy._removeChildRecordsPredecessor(record.childRecords[index]);
                    }
                }
            }
        },

        /*Update connector line collection on predecessor validation is in disabled mode*/
        _validatePredecessorOnEditing: function (ganttRecord, manualOffsetEditing) {
            var proxy = this,
                model = proxy.model,
                currentTaskId = ganttRecord['taskId'].toString(),
                model = this.model,
                predecessorsCollection = ganttRecord['predecessor'],
                predecessor, isOffsetChanged, parentGanttRecord, record, connectorLineObject, connectorLineId,
                previousValue = null,
                isResourceView = model.viewType == "resourceView" ? true : false,
                predecessors = predecessorsCollection.filter(function (data) { return data.to === currentTaskId; }),
                successors = predecessorsCollection.filter(function (data) { return data.from === currentTaskId; }),
                predecessorLength = predecessors.length;

            for (var count = 0; count < predecessorLength; count++) {
                predecessor = predecessors[count];
                isOffsetChanged = proxy._isOffsetChange(predecessor, previousValue, count);
                parentGanttRecord = this._getRecordByTaskId(predecessor.from);
                record = this._getRecordByTaskId(predecessor.to);
                if (manualOffsetEditing) {
                    proxy._validateChildGanttRecord(parentGanttRecord, record, predecessor, model.enablePredecessorValidation, isOffsetChanged);
                    manualOffsetEditing = false;
                }
                if (!isResourceView) {
                    connectorLineId = "parent" + parentGanttRecord['taskId'] + "child" + record['taskId'];
                    if (proxy._$ganttchartHelper) {
                        proxy._$ganttchartHelper.ejGanttChart("removeConnectorline", connectorLineId);
                        this._updateConnectorLineCollection(connectorLineId);
                    }
                }
            }
            if (!isResourceView) {
                for (var count = 0; count < predecessorLength; count++) {
                    predecessor = predecessors[count];
                    parentGanttRecord = this._getRecordByTaskId(predecessor.from);
                    record = this._getRecordByTaskId(predecessor.to);

                    if ((model.enableVirtualization === false && (parentGanttRecord.isExpanded === false || record.isExpanded == false)))//(model.enableVirtualization === false && !parentGanttRecord.isExpanded && record.isExpanded === false)
                        continue;
                    connectorLineObject = proxy._createConnectorLineObject(parentGanttRecord, record, predecessor);
                    if (connectorLineObject) {
                        if (proxy._connectorlineIds.length > 0 && proxy._connectorlineIds.indexOf(connectorLineObject.ConnectorLineId) == -1) {

                            proxy._updatedConnectorLineCollection.push(connectorLineObject);
                            proxy._connectorlineIds.push(connectorLineObject.ConnectorLineId);
                        }
                        else if (proxy._connectorlineIds.length == 0) {
                            proxy._updatedConnectorLineCollection.push(connectorLineObject);
                            proxy._connectorlineIds.push(connectorLineObject.ConnectorLineId);
                        }
                        else if (proxy._connectorlineIds.indexOf(connectorLineObject.ConnectorLineId) != -1) {
                            var index = proxy._connectorlineIds.indexOf(connectorLineObject.ConnectorLineId);
                            proxy._updatedConnectorLineCollection[index] = connectorLineObject;
                        }
                    }
                }
            }

            var length = successors.length;

            for (count = 0; count < length; count++) {

                predecessor = successors[count];
                parentGanttRecord = this._getRecordByTaskId(predecessor.from);
                record = this._getRecordByTaskId(predecessor.to);
                isOffsetChanged = proxy._isOffsetChange(predecessor, previousValue, count);
                if (!isResourceView) {
                    connectorLineId = "parent" + parentGanttRecord['taskId'] + "child" + record['taskId'];
                    if (proxy._$ganttchartHelper) {
                        proxy._$ganttchartHelper.ejGanttChart("removeConnectorline", connectorLineId);
                        this._updateConnectorLineCollection(connectorLineId);
                    }
                }

                if (manualOffsetEditing) {
                    proxy._validateChildGanttRecord(parentGanttRecord, record, predecessor, model.enablePredecessorValidation, isOffsetChanged);
                    manualOffsetEditing = false;
                }
                if ((model.enableVirtualization === false && (parentGanttRecord.isExpanded === false || record.isExpanded == false)))
                    continue;
                if (!isResourceView) {
                    connectorLineObject = proxy._createConnectorLineObject(parentGanttRecord, record, predecessor);
                    if (connectorLineObject) {
                        if (proxy._connectorlineIds.length > 0 && proxy._connectorlineIds.indexOf(connectorLineObject.ConnectorLineId) == -1) {

                            proxy._updatedConnectorLineCollection.push(connectorLineObject);
                            proxy._connectorlineIds.push(connectorLineObject.ConnectorLineId);
                        }
                        else if (proxy._connectorlineIds.length == 0) {
                            proxy._updatedConnectorLineCollection.push(connectorLineObject);
                            proxy._connectorlineIds.push(connectorLineObject.ConnectorLineId);
                        }
                        else if (proxy._connectorlineIds.indexOf(connectorLineObject.ConnectorLineId) != -1) {
                            var index = proxy._connectorlineIds.indexOf(connectorLineObject.ConnectorLineId);
                            proxy._updatedConnectorLineCollection[index] = connectorLineObject;
                        }
                    }
                }
            }
        },

        /*Method to update the new predecessor value in object and return previous predecessor value on editing action*/
        _updatePredecessorValue: function (obj, value) {
            var proxy = this,
                prevPredecessors,
                model = this.model,
                modifiedPredecessors,
                length = 0,
                predecessor,
                ganttPredecessor = [],
                count = 0,
                selectedItem = !ej.isNullOrUndefined(obj) ? obj : model.selectionMode == "row" ? proxy.selectedItem() : model.updatedRecords[proxy._rowIndexOfLastSelectedCell];
            prevPredecessors = selectedItem["predecessor"];

            if (value.length > 0) {
                modifiedPredecessors = selectedItem._calculatePredecessor(value, this._durationUnitEditText, this.model.durationUnit, proxy);
            }
            if (modifiedPredecessors)
                length = modifiedPredecessors.length;

            var index = 0, prevPrdecessorlength = 0;
            if (prevPredecessors)
                prevPrdecessorlength = prevPredecessors.length;


            for (index = 0; index < prevPrdecessorlength; index++) {
                predecessor = prevPredecessors[index];
                if (predecessor.from === selectedItem.taskId.toString()) {
                    ganttPredecessor.push(predecessor);
                }
            }
            for (count = 0; count < length; count++) {
                ganttPredecessor.push(modifiedPredecessors[count]);
            }
            selectedItem.predecessor = ganttPredecessor;
            if (proxy.model.predecessorMapping) {
                selectedItem.item[proxy.model.predecessorMapping] = value;
                selectedItem.predecessorsName = value;
            }

            return prevPredecessors; 
        },

        /*Method to update the predecessor collection on Indent/Oudent actions*/
        _updatePredecessorOnIndentOutdent: function (parentRecord) {

            var proxy = this, len = parentRecord.predecessor.length,
                predecessorCollection = parentRecord.predecessor,
                predecessorIndex,
                childRecord,
                id,
                updatedPredecessor = [],
                model = proxy.model;
            for (var count = 0; count < len; count++) {
                //remove predecessor connect with parent item
                if (predecessorCollection[count].to === parentRecord.taskId.toString()) {
                    childRecord = this._getRecordByTaskId(predecessorCollection[count].from);
                    predecessorIndex = childRecord.predecessor.indexOf(predecessorCollection[count]);
                    childRecord.predecessor.splice(predecessorIndex, 1);
                    id = "parent" + childRecord['taskId'] + "child" + parentRecord['taskId'];
                }
                    //remove predecessor if parent record as predecessor of it's child record
                else if (predecessorCollection[count].from === parentRecord.taskId.toString()) {
                    childRecord = this._getRecordByTaskId(predecessorCollection[count].to);
                    var stringPredecessor = proxy._predecessorToString(childRecord.predecessor, childRecord);
                    var prdcList = childRecord["predecessorsName"].split(',');
                    var str = predecessorCollection[count].from + predecessorCollection[count].predecessorsType;
                    var ind = prdcList.indexOf(str);
                    prdcList.splice(ind, 1);
                    childRecord.item[model.predecessorMapping] = prdcList.join(',');
                    childRecord.predecessorsName = prdcList.join(',');
                    predecessorIndex = childRecord.predecessor.indexOf(predecessorCollection[count]);
                    childRecord.predecessor.splice(predecessorIndex, 1);
                    if (model.enableWBS && model.enableWBSPredecessor) {
                        proxy._$treegridHelper.ejTreeGrid("updateWBSPredecessor", childRecord);
                    }
                    id = "parent" + parentRecord['taskId'] + "child" + childRecord['taskId'];
                    proxy._isLastRefresh = false;
                    proxy.refreshGanttRecord(childRecord);
                }
                proxy._$ganttchartHelper.ejGanttChart("removeConnectorline", id);
                this._updateConnectorLineCollection(id);
            }
            parentRecord.predecessor = updatedPredecessor;
            parentRecord.item[model.predecessorMapping] = "";
            parentRecord.predecessorsName = "";
            if (model.enableWBS && model.enableWBSPredecessor) {
                parentRecord["WBSPredecessor"] = "";
                parentRecord["item"]["WBSPredecessor"] = "";
            }
        },

        /*Method to remove the connector line and predecessor value in record*/
        _removePredecessor: function (predecessor, record, isFromConnectorLine) {
            var proxy = this, length = predecessor.length, count = 0, model = proxy.model, parentGanttRecord, childGanttRecord,
                clonePredecessor = $.extend({},true, predecessor);
            for (count; count < length; count++) {
                // Remove Connector line from UI
                if (isFromConnectorLine) {
                    if (clonePredecessor[count].to !== record.taskId.toString())
                        continue;
                    parentGanttRecord = proxy._getRecordByTaskId(clonePredecessor[count].from);
                    childGanttRecord = proxy._getRecordByTaskId(clonePredecessor[count].to);
                }
                else {
                    if (predecessor[count].from !== record.taskId.toString()) {
                        childGanttRecord = this._getRecordByTaskId(predecessor[count].from);
                    }
                    else if (predecessor[count].to !== record.taskId.toString()) {
                        childGanttRecord = this._getRecordByTaskId(predecessor[count].to);
                    }
                }

                if (childGanttRecord) {
                    var cIndex = childGanttRecord.predecessor.indexOf(predecessor[count]);
                    if (cIndex !== -1)
                        childGanttRecord.predecessor.splice(cIndex, 1);

                    if (childGanttRecord.item[model.predecessorMapping]) {
                        childGanttRecord.item[model.predecessorMapping] = proxy._predecessorToString(childGanttRecord.predecessor, childGanttRecord);
                        childGanttRecord.predecessorsName = childGanttRecord.item[model.predecessorMapping];
                        if (model.enableWBS && model.enableWBSPredecessor)
                            proxy._$treegridHelper.ejTreeGrid("updateWBSPredecessor", childGanttRecord);
                        model.enableSerialNumber && proxy._$treegridHelper.ejTreeGrid("predecessorToSerialPredecessor", childGanttRecord);
                        this._updateResourcePredecessor(childGanttRecord);
                        proxy.refreshGanttRecord(childGanttRecord);
                    }
                }
                if (isFromConnectorLine) {
                    var pIndex = parentGanttRecord.predecessor.indexOf(predecessor[count]);
                    parentGanttRecord.predecessor.splice(pIndex, 1);
                    this._updateResourcePredecessor(parentGanttRecord);
                    var connectorLineId = "parent" + parentGanttRecord['taskId'] + "child" + childGanttRecord['taskId'];
                    proxy._$ganttchartHelper.ejGanttChart("removeConnectorline", connectorLineId);
                    proxy._updateConnectorLineCollection(connectorLineId);
                }              
            }

        },
        /*Method to update shared resource tasks predecessor value in resource view*/
        _updateResourcePredecessor: function (record) {
            if (this.model.viewType == "resourceView" && record.eResourceTaskType == "resourceChildTask" && record.resourceInfo.length > 0) {
                var valObj = {};
                valObj.predecessor = record.predecessor;
                valObj.predecessorsName = record.predecessorsName;
                this._updateSharedResourceTask(record, valObj);
            }
        },
        /*Method to get predecessor as string value with predecessor collection*/
        _predecessorToString: function (predecessorCollection, record) {
            var proxy = this, predecessorString = [], count = 0, length = predecessorCollection.length;

            for (count; count < length; count++) {
                if (record.taskId.toString() !== predecessorCollection[count].from) {
                    var tem = predecessorCollection[count].from + predecessorCollection[count].predecessorsType;
                    predecessorCollection[count].offset = isNaN(predecessorCollection[count].offset) ? 0 : predecessorCollection[count].offset;

                    if (predecessorCollection[count].offset !== 0) {
                        if (predecessorCollection[count].offset < 0)
                            tem += predecessorCollection[count].offset.toString() + "d";
                        else if (predecessorCollection[count].offset > 0)
                            tem += "+" + predecessorCollection[count].offset.toString() + "d";
                    }
                    predecessorString.push(tem);
                }
            }

            return predecessorString.join(',');
        },

        // calculation to find critical path.
        showCriticalPath: function (isShown, isRefreshed) {

            var proxy = this, modelRecordIds = this.model.ids, flatRecords = this.model.flatRecords;
            proxy._$treegridHelper.ejTreeGrid("cancelEditCell"); // Cancel the edit cell, if it is in edit mode.
            // execute if we enable critical path.
            if (isShown == true) {
                this.isCriticalPathEnable = true;

                // execute if the flat records contains task.
                if (flatRecords.length != 0) {

                    var totalPredecessorsCollection = [], individualPredecessorLength, taskid, todate, fromdateID, collection = [], collectionTaskId = [], criticalPathIds = [],
                        checkBeyondEnddate = [], totalPredecessorsCollectionId = [], taskBeyondEnddate = [], updatedRecords = this.model.flatRecords,
                        parentRecords = this.model.parentRecords, predecessorTaskBeyondEnddate = [], just1 = 0, dateDifference = 0,
                         mediater2 = 0, fromDataObject = [], checkEndDate, checkEndDateTaskid;


                    checkEndDate = this.model.parentRecords[0].endDate;

                    if (this.model.parentRecords[0].manualEndDate > this.model.parentRecords[0].endDate && !this.model.parentRecords[0].isAutoSchedule)
                        checkEndDate = this.model.parentRecords[0].manualEndDate;

                    checkEndDateTaskid = this.model.parentRecords[0].taskId;

                    // Find the total project endDate
                    for (var js = 1; js < parentRecords.length; js++) {
                        if (parentRecords[js].endDate >= checkEndDate) {
                            checkEndDate = parentRecords[js].endDate;
                            checkEndDateTaskid = parentRecords[js].taskId;
                        }
                        if (!parentRecords[js].isAutoSchedule) {
                            if (parentRecords[js].manualEndDate >= checkEndDate) {
                                checkEndDate = parentRecords[js].manualEndDate;
                                checkEndDateTaskid = parentRecords[js].taskId;
                            }
                        }
                    }

                    // find the taskes that ends on total project end date that stored in checkBeyondEnddate
                    // find the taskes with predecessor that stored in totalPredecessorsCollectionId.
                    for (var kk = 0; kk < updatedRecords.length; kk++) {
                        updatedRecords[kk].isCritical = false;
                        dateDifference = proxy._getDuration(updatedRecords[kk].endDate, checkEndDate, updatedRecords[kk].durationUnit, updatedRecords[kk].isAutoSchedule);
                        updatedRecords[kk].slack = dateDifference + " " + updatedRecords[kk].durationUnit;
                        if (updatedRecords[kk].endDate >= checkEndDate) {
                            checkBeyondEnddate.push(updatedRecords[kk].taskId);
                        }
                        if (updatedRecords[kk].predecessor) {
                            if (updatedRecords[kk].predecessor.length != 0) {
                                totalPredecessorsCollection.push(updatedRecords[kk]);
                                totalPredecessorsCollectionId.push(updatedRecords[kk].taskId);
                            }
                        }
                    }

                    // seperate the predecessor connected taskes from the individual taskes that ends on total project end date 
                    for (var ss = 0; ss < checkBeyondEnddate.length; ss++) {
                        if (totalPredecessorsCollectionId.indexOf(checkBeyondEnddate[ss]) == -1) {
                            mediater2 = modelRecordIds.indexOf(checkBeyondEnddate[ss].toString());
                            if (flatRecords[mediater2].status < 100)
                                flatRecords[mediater2].isCritical = true;
                            flatRecords[mediater2].slack = 0 + flatRecords[mediater2].durationUnit;
                            taskBeyondEnddate.push(checkBeyondEnddate[ss]);
                        }
                        else
                            predecessorTaskBeyondEnddate.push(checkBeyondEnddate[ss]);
                    }
                    var predecessorLength = totalPredecessorsCollection.length, endTask = [];

                    // find the detail collection of predecessor for each taskes that stored in collection.
                    for (var x = 0; x < predecessorLength; x++) {
                        var to = -1, from = -1, toPredecessor = -1, fromPredecessor = -1, currentIndex = x;
                        individualPredecessorLength = totalPredecessorsCollection[x].predecessor.length,
                         taskid = parseInt(totalPredecessorsCollection[x].taskId);

                        for (var y = 0; y < individualPredecessorLength; y++) {
                            if (totalPredecessorsCollection[x].predecessor[y].from == taskid) {
                                if (to == -1) {
                                    if (!totalPredecessorsCollection[x].predecessor[y].offset) {
                                        to = totalPredecessorsCollection[x].predecessor[y].to;
                                        toPredecessor = totalPredecessorsCollection[x].predecessor[y].predecessorsType;
                                    } else {
                                        to = totalPredecessorsCollection[x].predecessor[y].to + ":" + totalPredecessorsCollection[x].predecessor[y].offset + totalPredecessorsCollection[x].predecessor[y].offsetDurationUnit;
                                        toPredecessor = totalPredecessorsCollection[x].predecessor[y].predecessorsType;
                                    }
                                } else {
                                    if (!totalPredecessorsCollection[x].predecessor[y].offset) {

                                        to = to + "," + totalPredecessorsCollection[x].predecessor[y].to;
                                        toPredecessor = toPredecessor + "," + totalPredecessorsCollection[x].predecessor[y].predecessorsType;
                                    } else {
                                        to = to + "," + totalPredecessorsCollection[x].predecessor[y].to + ":" + totalPredecessorsCollection[x].predecessor[y].offset + totalPredecessorsCollection[x].predecessor[y].offsetDurationUnit;
                                        toPredecessor = toPredecessor + "," + totalPredecessorsCollection[x].predecessor[y].predecessorsType;
                                    }
                                }
                            }
                            if (totalPredecessorsCollection[x].predecessor[y].to == taskid) {
                                if (from == -1) {
                                    if (!totalPredecessorsCollection[x].predecessor[y].offset) {

                                        from = totalPredecessorsCollection[x].predecessor[y].from;
                                        fromPredecessor = totalPredecessorsCollection[x].predecessor[y].predecessorsType;
                                    } else {
                                        from = totalPredecessorsCollection[x].predecessor[y].from + ":" + totalPredecessorsCollection[x].predecessor[y].offset + totalPredecessorsCollection[x].predecessor[y].offsetDurationUnit;
                                        fromPredecessor = totalPredecessorsCollection[x].predecessor[y].predecessorsType;
                                    }
                                } else {
                                    if (!totalPredecessorsCollection[x].predecessor[y].offset) {
                                        from = from + "," + totalPredecessorsCollection[x].predecessor[y].from;
                                        fromPredecessor = fromPredecessor + "," + totalPredecessorsCollection[x].predecessor[y].predecessorsType;
                                    } else {

                                        from = from + "," + totalPredecessorsCollection[x].predecessor[y].from + ":" + totalPredecessorsCollection[x].predecessor[y].offset + totalPredecessorsCollection[x].predecessor[y].offsetDurationUnit;
                                        fromPredecessor = fromPredecessor + "," + totalPredecessorsCollection[x].predecessor[y].predecessorsType;
                                    }
                                }
                            }
                        }
                        if (from == -1) {
                            from = null;
                            fromPredecessor = null;
                        }
                        if (to == -1) {
                            to = null;
                            toPredecessor = null;
                        }
                        collection.push({ from: from, fromPredecessor: fromPredecessor, taskid: taskid, to: to, toPredecessor: toPredecessor, currentIndex: currentIndex, slack: null, ff: 0, fs: 0, enddate: null, fsslack: 0 });
                        collectionTaskId.push(parseInt(taskid));
                    }
                    var collectionLength = collection.length, indexenddate = 0, num;

                    // find the predecessors connected taskes that does not contains any successor.
                    for (var z = 0; z < collectionLength; z++) {
                        if (!collection[z].to) {
                            num = collection[z].taskid;
                            indexenddate = modelRecordIds.indexOf(num.toString());
                            dateDifference = proxy._getDuration(flatRecords[indexenddate].endDate, checkEndDate, "minute", flatRecords[indexenddate].isAutoSchedule);
                            collection[z].slack = dateDifference;
                            collection[z].fs = -1;
                            collection[z].enddate = flatRecords[indexenddate].endDate;
                            endTask.push({ fromdata: collection[z].from, todateID: collection[z].taskid, fromDataPredecessor: collection[z].fromPredecessor });

                        }
                    }
                    for (var k = 0; k < endTask.length; k++) {
                        fromDataObject.push(endTask[k]);
                        proxy._slackCalculation(fromDataObject, collection, collectionTaskId, checkEndDate, flatRecords, modelRecordIds);
                    }
                    criticalPathIds = proxy._finalCriticalPath(collection, taskBeyondEnddate, flatRecords, modelRecordIds);
                    this.criticalPathCollection = criticalPathIds;
                    this.detailPredecessorCollection = collection;
                    this.collectionTaskId = collectionTaskId;
                    if (!isRefreshed) {
                        this._$ganttchartHelper.ejGanttChart("criticalDataMapping", criticalPathIds, isShown, collection, collectionTaskId);
                        this._$ganttchartHelper.ejGanttChart("criticalPathColor", criticalPathIds, isShown, collection, collectionTaskId);
                        proxy._$treegridHelper.ejTreeGrid("refresh");
                    } else if (isRefreshed) {
                        this._$ganttchartHelper.ejGanttChart("criticalDataMapping", criticalPathIds, isShown, collection, collectionTaskId);
                        //proxy._$treegridHelper.ejTreeGrid("refresh");
                    }
                    proxy._enableDisableCriticalIcon = true;
                }
                else {
                    var criticalPathIds = [], collection = [], collectionTaskId = [];
                    if (!isRefreshed) {
                        this._$ganttchartHelper.ejGanttChart("criticalDataMapping", criticalPathIds, isShown, collection, collectionTaskId);
                        this._$ganttchartHelper.ejGanttChart("criticalPathColor", criticalPathIds, isShown, collection, collectionTaskId);
                        this._$treegridHelper.ejTreeGrid("refresh");
                    } else if (isRefreshed) {
                        this._$ganttchartHelper.ejGanttChart("criticalDataMapping", criticalPathIds, isShown, collection, collectionTaskId);
                        //proxy._$treegridHelper.ejTreeGrid("refresh");
                    }
                    proxy._enableDisableCriticalIcon = true;
                }
            }

            // execute if we disable critical path
            if (isShown == false) {
                var criticalPathIds = [], collection = [], collectionTaskId = [], distructIndex = 0;
                this.isCriticalPathEnable = false;
                for (var zs = 0; zs < proxy.criticalPathCollection.length ; zs++) {
                    distructIndex = modelRecordIds.indexOf(proxy.criticalPathCollection[zs].toString());
                    flatRecords[distructIndex].isCritical = false;
                }
                if (!isRefreshed) {
                    this._$ganttchartHelper.ejGanttChart("criticalDataMapping", criticalPathIds, isShown, collection, collectionTaskId);
                    this._$ganttchartHelper.ejGanttChart("criticalPathColor", criticalPathIds, isShown, collection, collectionTaskId);
                    this._$treegridHelper.ejTreeGrid("refresh");
                } else if (isRefreshed) {
                    this._$ganttchartHelper.ejGanttChart("criticalDataMapping", criticalPathIds, isShown, collection, collectionTaskId);
                    //proxy._$treegridHelper.ejTreeGrid("refresh");
                }
                proxy._enableDisableCriticalIcon = false;
            }
        },

        // calculation to find critical task ids with the help of slack values.
        _finalCriticalPath: function (collection, taskBeyondEnddate, flatRecords, modelRecordIds) {
            var proxy = this;
            var criticalPathIds = [], index;
            for (var x = 0; x < collection.length; x++) {
                index = modelRecordIds.indexOf(collection[x].taskid.toString());
                if (flatRecords[index].durationUnit == "day") {
                    flatRecords[index].slack = collection[x].slack / 60 / (proxy._secondsPerDay / 3600);
                    if (flatRecords[index].slack % 1 != 0)
                        flatRecords[index].slack = flatRecords[index].slack.toFixed(2) + " day";
                    else
                        flatRecords[index].slack = flatRecords[index].slack + " day";
                }
                else if (flatRecords[index].durationUnit == "hour") {
                    flatRecords[index].slack = collection[x].slack / 60;
                    if (flatRecords[index].slack % 1 != 0)
                        flatRecords[index].slack = flatRecords[index].slack.toFixed(2) + " hour";
                    else
                        flatRecords[index].slack = flatRecords[index].slack + " hour";
                }
                else {
                    flatRecords[index].slack = collection[x].slack + " minutes";
                }
                if ((collection[x].slack <= 0)) {

                    if (flatRecords[index].status < 100) {
                        flatRecords[index].isCritical = true;
                        criticalPathIds.push(collection[x].taskid);
                    }
                }
            }
            criticalPathIds = criticalPathIds.concat(taskBeyondEnddate);
            return criticalPathIds;
        },

        /*validate startdate and enddate values then get th duration*/
        _getSlackDuration: function (sDate, eDate, durationUnit, record) {
            var startDate = this._checkStartDate(new Date(sDate)),
                endDate = this._checkEndDate(new Date(eDate));
            if(this._getTimeDiff(startDate, endDate, true) <= 0)
                return 0;
            else
                return this._getDuration(startDate, endDate, durationUnit, record.isAutoSchedule, true);
        },

        // calculation to find slack values.
        _slackCalculation: function (fromDataObject, collection, collectionTaskId, checkEndDate, flatRecords, modelRecordIds) {
            var proxy = this, fromDateArray = fromDataObject[0].fromdata.split(","), fromDataPredecessor = fromDataObject[0].fromDataPredecessor.split(","),
                fromDateArray1 = [], fromTaskIdIndex, indexfromtaskid, indexenddate, totaskId, arraylength = fromDateArray.length, prevTaskEnddate, ffslack, mediater, holidayCount, diffInMilliSec, dateDifference, offsetInMillSec;
            for (var xx = 0; xx < arraylength; xx++) {
                fromDateArray1 = fromDateArray[xx].split(":");
                fromTaskIdIndex = collectionTaskId.indexOf(parseInt(fromDateArray1[0]));
                totaskId = collectionTaskId.indexOf(parseInt(fromDataObject[0].todateID));

                // calculate slack value for the task contains predecessor connection in "finish to start".
                if (fromDataPredecessor[xx] == "FS") {
                    indexfromtaskid = modelRecordIds.indexOf(fromDateArray1[0].toString());
                    indexenddate = modelRecordIds.indexOf(fromDataObject[0].todateID.toString());
                    if (flatRecords[indexfromtaskid].endDate > flatRecords[indexenddate].startDate)
                        dateDifference = -(proxy._getDuration(flatRecords[indexenddate].startDate, flatRecords[indexfromtaskid].endDate, "minute", flatRecords[indexfromtaskid].isAutoSchedule));
                    else
                        dateDifference = proxy._getSlackDuration(flatRecords[indexfromtaskid].endDate, flatRecords[indexenddate].startDate, "minute", flatRecords[indexfromtaskid]);

                    // execute if the slack value is not set initially.
                    if (ej.isNullOrUndefined(collection[fromTaskIdIndex].slack)) {

                        // execute if the offset value is not given.
                        if (fromDateArray1.length <= 1) {
                            if (collection[totaskId].slack + dateDifference < 0) {
                                collection[fromTaskIdIndex].slack = 0;
                            }
                            else {
                                collection[fromTaskIdIndex].slack = collection[totaskId].slack + dateDifference;
                            }
                        }
                            // execute if the offset value is given.
                        else if (fromDateArray1.length > 1) {
                            if (fromDateArray1[1].indexOf("hour") != -1)
                                offsetInMillSec = parseInt(fromDateArray1[1]) * 60;
                            else if (fromDateArray1[1].indexOf("day") != -1)
                                offsetInMillSec = parseInt(fromDateArray1[1]) * (proxy._secondsPerDay / 3600) * 60;
                            else
                                offsetInMillSec = parseInt(fromDateArray1[1]);

                            collection[fromTaskIdIndex].slack = collection[totaskId].slack + dateDifference;
                            collection[fromTaskIdIndex].slack = collection[fromTaskIdIndex].slack - (offsetInMillSec);
                            if (collection[fromTaskIdIndex].slack < 0)
                                collection[fromTaskIdIndex].slack = 0;
                        }
                        collection[fromTaskIdIndex].fs = 1;
                        collection[fromTaskIdIndex].fsslack = collection[fromTaskIdIndex].slack;
                        collection[fromTaskIdIndex].enddate = flatRecords[indexfromtaskid].startDate;
                    }

                        // execute if the current calculated slack value is less than the previous slack value.
                    else if (collection[fromTaskIdIndex].slack > dateDifference && collection[fromTaskIdIndex].slack != 0) {

                        // execute if the offset value is not given.
                        if (fromDateArray1.length <= 1) {
                            if (collection[totaskId].slack + dateDifference < 0) {
                                collection[fromTaskIdIndex].slack = 0;
                            }
                            else {
                                collection[fromTaskIdIndex].slack = collection[totaskId].slack + dateDifference;
                            }
                        }

                            // execute if the offset value is given.
                        else if (fromDateArray1.length > 1) {

                            if (fromDateArray1[1].indexOf("hour") != -1)
                                offsetInMillSec = parseInt(fromDateArray1[1]) * 60;
                            else if (fromDateArray1[1].indexOf("day") != -1)
                                offsetInMillSec = parseInt(fromDateArray1[1]) * (proxy._secondsPerDay / 3600) * 60;
                            else
                                offsetInMillSec = parseInt(fromDateArray1[1]);

                            collection[fromTaskIdIndex].slack = collection[totaskId].slack + dateDifference;
                            collection[fromTaskIdIndex].slack = collection[fromTaskIdIndex].slack - (offsetInMillSec);
                            if (collection[fromTaskIdIndex].slack < 0)
                                collection[fromTaskIdIndex].slack = 0;
                        }
                        collection[fromTaskIdIndex].fs = 1;
                        collection[fromTaskIdIndex].fsslack = collection[fromTaskIdIndex].slack;
                        collection[fromTaskIdIndex].enddate = flatRecords[indexfromtaskid].startDate;
                    }
                    if (flatRecords[indexfromtaskid].endDate >= checkEndDate && flatRecords[indexfromtaskid].endDate <= checkEndDate) {
                        collection[fromTaskIdIndex].slack = 0;
                    }
                }

                //  calculate slack value for the task contains predecessor connection in "start to start".
                if (fromDataPredecessor[xx] == "SS") {
                    indexfromtaskid = modelRecordIds.indexOf(fromDateArray1[0].toString());

                    // It execute if the task is in auto mode.
                    if (flatRecords[indexfromtaskid].isAutoSchedule) {
                        indexenddate = modelRecordIds.indexOf(fromDataObject[0].todateID.toString());
                        if (flatRecords[indexfromtaskid].startDate > flatRecords[indexenddate].startDate)
                            dateDifference = -(proxy._getDuration(flatRecords[indexenddate].startDate, flatRecords[indexfromtaskid].startDate, "minute", flatRecords[indexfromtaskid].isAutoSchedule));
                        else
                            dateDifference = proxy._getDuration(flatRecords[indexfromtaskid].startDate, flatRecords[indexenddate].startDate, "minute", flatRecords[indexfromtaskid].isAutoSchedule);

                        // It execute while the slack value is not set to the corresponding task. 
                        if (ej.isNullOrUndefined(collection[fromTaskIdIndex].slack)) {
                            if (fromDateArray1.length <= 1) {
                                if (collection[totaskId].slack + dateDifference < 0) {
                                    collection[fromTaskIdIndex].slack = 0;
                                }
                                else {
                                    collection[fromTaskIdIndex].slack = collection[totaskId].slack + dateDifference;
                                }
                            } else if (fromDateArray1.length > 1) {
                                if (fromDateArray1[1].indexOf("hour") != -1)
                                    offsetInMillSec = parseInt(fromDateArray1[1]) * 60;
                                else if (fromDateArray1[1].indexOf("day") != -1)
                                    offsetInMillSec = parseInt(fromDateArray1[1]) * (proxy._secondsPerDay / 3600) * 60;
                                else
                                    offsetInMillSec = parseInt(fromDateArray1[1]);

                                collection[fromTaskIdIndex].slack = collection[totaskId].slack + dateDifference;
                                collection[fromTaskIdIndex].slack = collection[fromTaskIdIndex].slack - (offsetInMillSec);
                                if (collection[fromTaskIdIndex].slack < 0)
                                    collection[fromTaskIdIndex].slack = 0;
                            }
                            collection[fromTaskIdIndex].fs = 1;
                            collection[fromTaskIdIndex].fsslack = collection[fromTaskIdIndex].slack;
                            collection[fromTaskIdIndex].enddate = flatRecords[indexfromtaskid].startDate;
                        }
                            //It execute while already the slack value is set and it is higher than the datedifference. 
                        else if (collection[fromTaskIdIndex].slack > dateDifference && collection[fromTaskIdIndex].slack != 0) {
                            if (fromDateArray1.length <= 1) {
                                if (collection[totaskId].slack + dateDifference < 0) {
                                    collection[fromTaskIdIndex].slack = 0;
                                }
                                else {
                                    collection[fromTaskIdIndex].slack = collection[totaskId].slack + dateDifference;
                                }
                            } else if (fromDateArray1.length > 1) {

                                if (fromDateArray1[1].indexOf("hour") != -1)
                                    offsetInMillSec = parseInt(fromDateArray1[1]) * 60;
                                else if (fromDateArray1[1].indexOf("day") != -1)
                                    offsetInMillSec = parseInt(fromDateArray1[1]) * (proxy._secondsPerDay / 3600) * 60;
                                else
                                    offsetInMillSec = parseInt(fromDateArray1[1]);

                                collection[fromTaskIdIndex].slack = collection[totaskId].slack + dateDifference;
                                collection[fromTaskIdIndex].slack = collection[fromTaskIdIndex].slack - (offsetInMillSec);
                                if (collection[fromTaskIdIndex].slack < 0)
                                    collection[fromTaskIdIndex].slack = 0;
                            }
                            collection[fromTaskIdIndex].fs = 1;
                            collection[fromTaskIdIndex].fsslack = collection[fromTaskIdIndex].slack;
                            collection[fromTaskIdIndex].enddate = flatRecords[indexfromtaskid].startDate;
                        }
                    }
                        // It execute if the task is in not an auto mode task.
                    else if (!flatRecords[indexfromtaskid].isAutoSchedule) {
                        dateDifference = proxy._getSlackDuration(flatRecords[indexfromtaskid].endDate, checkEndDate, "minute", flatRecords[indexfromtaskid]);
                        if (ej.isNullOrUndefined(collection[fromTaskIdIndex].slack)) {
                            collection[fromTaskIdIndex].slack = dateDifference;
                        }
                        else if (collection[fromTaskIdIndex].slack > dateDifference && collection[fromTaskIdIndex].slack != 0) {
                            collection[fromTaskIdIndex].slack = dateDifference;
                        }
                    }
                    if (flatRecords[indexfromtaskid].endDate >= checkEndDate && flatRecords[indexfromtaskid].endDate <= checkEndDate) {
                        collection[fromTaskIdIndex].slack = 0;
                    }
                }

                //  calculate slack value for the task contains predecessor connection in "finish to finish".
                if (fromDataPredecessor[xx] == "FF") {

                    // execute if the previous task is from finish to start or finish to finish state.
                    if (collection[totaskId].fs == 1 || collection[totaskId].ff == 1 || collection[totaskId].fs == -1) {
                        indexfromtaskid = modelRecordIds.indexOf(fromDateArray1[0].toString());
                        indexenddate = modelRecordIds.indexOf(fromDataObject[0].todateID.toString());

                        if (collection[totaskId].fs == 1) {
                            prevTaskEnddate = flatRecords[indexenddate].endDate;
                            ffslack = collection[totaskId].slack;
                        }
                        else if (collection[totaskId].ff == 1) {
                            prevTaskEnddate = flatRecords[indexenddate].endDate;
                            ffslack = collection[totaskId].slack;
                        }
                        if (collection[totaskId].fs == -1) {
                            prevTaskEnddate = collection[totaskId].enddate;
                            ffslack = collection[totaskId].slack;
                        }
                        if (prevTaskEnddate > flatRecords[indexfromtaskid].endDate)
                            dateDifference = -(proxy._getSlackDuration(flatRecords[indexfromtaskid].endDate, prevTaskEnddate, "minute", flatRecords[indexfromtaskid]));
                        else
                            dateDifference = proxy._getSlackDuration(prevTaskEnddate, flatRecords[indexfromtaskid].endDate, "minute", flatRecords[indexfromtaskid]);

                        // set the slack value if the slack value is not set initially.
                        if (ej.isNullOrUndefined(collection[fromTaskIdIndex].slack)) {

                            // execute if the offset value is not given.
                            if (fromDateArray1.length <= 1) {
                                if (ffslack - dateDifference < 0) {
                                    collection[fromTaskIdIndex].slack = 0;
                                }
                                else {
                                    collection[fromTaskIdIndex].slack = ffslack - dateDifference;
                                }
                            }
                                // execute if the offset value is given.
                            else if (fromDateArray1.length > 1) {

                                if (fromDateArray1[1].indexOf("hour") != -1)
                                    offsetInMillSec = parseInt(fromDateArray1[1]) * 60;
                                else if (fromDateArray1[1].indexOf("day") != -1)
                                    offsetInMillSec = parseInt(fromDateArray1[1]) * (proxy._secondsPerDay / 3600) * 60;
                                else
                                    offsetInMillSec = parseInt(fromDateArray1[1]);

                                collection[fromTaskIdIndex].slack = collection[totaskId].slack - dateDifference;
                                collection[fromTaskIdIndex].slack = collection[fromTaskIdIndex].slack - (offsetInMillSec);
                                if (collection[fromTaskIdIndex].slack < 0)
                                    collection[fromTaskIdIndex].slack = 0;
                            }
                            collection[fromTaskIdIndex].ff = 1;
                            collection[fromTaskIdIndex].enddate = prevTaskEnddate;
                            collection[fromTaskIdIndex].fsslack = ffslack;
                        }
                            // overright the slack value if the current calculated slack value is less than the previous slack value.
                        else if (collection[fromTaskIdIndex].slack > dateDifference && collection[fromTaskIdIndex].slack != 0) {

                            // execute if the offset value is not given.
                            if (fromDateArray1.length <= 1) {
                                if (ffslack - dateDifference < 0) {
                                    collection[fromTaskIdIndex].slack = 0;
                                }
                                else {
                                    collection[fromTaskIdIndex].slack = ffslack - dateDifference;
                                }
                            }
                                // execute if the offset value is given.
                            else if (fromDateArray1.length > 1) {

                                if (fromDateArray1[1].indexOf("hour") != -1)
                                    offsetInMillSec = parseInt(fromDateArray1[1]) * 60;
                                else if (fromDateArray1[1].indexOf("day") != -1)
                                    offsetInMillSec = parseInt(fromDateArray1[1]) * (proxy._secondsPerDay / 3600) * 60;
                                else
                                    offsetInMillSec = parseInt(fromDateArray1[1]);

                                collection[fromTaskIdIndex].slack = collection[totaskId].slack - dateDifference;
                                collection[fromTaskIdIndex].slack = collection[fromTaskIdIndex].slack - (offsetInMillSec);
                                if (collection[fromTaskIdIndex].slack < 0)
                                    collection[fromTaskIdIndex].slack = 0;
                            }
                            collection[fromTaskIdIndex].ff = 1;
                            collection[fromTaskIdIndex].enddate = prevTaskEnddate;
                            collection[fromTaskIdIndex].fsslack = ffslack;
                        }
                    }
                        // execute if the previous task is from start to start or start to finish state.
                    else {
                        indexfromtaskid = modelRecordIds.indexOf(fromDateArray1[0].toString());
                        dateDifference = proxy._getSlackDuration(flatRecords[indexfromtaskid].endDate, checkEndDate, "minute", flatRecords[indexfromtaskid]);

                        // execute if the slack value is not set initially.
                        if (ej.isNullOrUndefined(collection[fromTaskIdIndex].slack)) {
                            // execute if the offset value is not given.
                            if (fromDateArray1.length <= 1) {
                                if (ej.isNullOrUndefined(collection[fromTaskIdIndex].slack))
                                    collection[fromTaskIdIndex].slack = dateDifference;
                                else if (collection[fromTaskIdIndex].slack > dateDifference)
                                    collection[fromTaskIdIndex].slack = dateDifference;

                            }
                                // execute if the offset value is given.
                            else if (fromDateArray1.length > 1) {
                                if (fromDateArray1[1].indexOf("hour") != -1)
                                    offsetInMillSec = parseInt(fromDateArray1[1]) * 60;
                                else if (fromDateArray1[1].indexOf("day") != -1)
                                    offsetInMillSec = parseInt(fromDateArray1[1]) * (proxy._secondsPerDay / 3600) * 60;
                                else
                                    offsetInMillSec = parseInt(fromDateArray1[1]);

                                collection[fromTaskIdIndex].slack = dateDifference;
                                collection[fromTaskIdIndex].slack = collection[fromTaskIdIndex].slack - (offsetInMillSec);
                                if (collection[fromTaskIdIndex].slack < 0)
                                    collection[fromTaskIdIndex].slack = 0;
                            }
                        }
                            // execute if the current calculated slack value is less than the previous slack value.
                        else if (collection[fromTaskIdIndex].slack > dateDifference && collection[fromTaskIdIndex].slack != 0) {
                            // execute if the offset value is not given.
                            if (fromDateArray1.length <= 1) {
                                if (ej.isNullOrUndefined(collection[fromTaskIdIndex].slack))
                                    collection[fromTaskIdIndex].slack = dateDifference;
                                else if (collection[fromTaskIdIndex].slack > dateDifference)
                                    collection[fromTaskIdIndex].slack = dateDifference;
                            }
                                // execute if the offset value is not given.
                            else if (fromDateArray1.length > 1) {
                                if (fromDateArray1[1].indexOf("hour") != -1)
                                    offsetInMillSec = parseInt(fromDateArray1[1]) * 60;
                                else if (fromDateArray1[1].indexOf("day") != -1)
                                    offsetInMillSec = parseInt(fromDateArray1[1]) * (proxy._secondsPerDay / 3600) * 60;
                                else
                                    offsetInMillSec = parseInt(fromDateArray1[1]);

                                collection[fromTaskIdIndex].slack = dateDifference;
                                collection[fromTaskIdIndex].slack = collection[fromTaskIdIndex].slack - (offsetInMillSec);
                                if (collection[fromTaskIdIndex].slack < 0)
                                    collection[fromTaskIdIndex].slack = 0;
                            }
                        }
                        collection[fromTaskIdIndex].ff = 1;
                    }
                    if (flatRecords[indexfromtaskid].endDate >= checkEndDate && flatRecords[indexfromtaskid].endDate <= checkEndDate) {
                        collection[fromTaskIdIndex].slack = 0;
                    }
                }

                //  calculate slack value for the task contains predecessor connection in "start to finish".
                if (fromDataPredecessor[xx] == "SF") {
                    indexfromtaskid = modelRecordIds.indexOf(fromDateArray1[0].toString());

                    //It execute if the task is an auto mode task.
                    if (flatRecords[indexfromtaskid].isAutoSchedule) {
                        //execute if the slack value is not set initially.
                        if (ej.isNullOrUndefined(collection[fromTaskIdIndex].slack)) {
                            // execute if the offset value is not given.
                            if (fromDateArray1.length <= 1) {
                                // execute if the previous task does no has sucessor. 
                                if (ej.isNullOrUndefined(collection[totaskId].to)) {
                                    indexfromtaskid = modelRecordIds.indexOf(fromDateArray1[0].toString());
                                    dateDifference = proxy._getSlackDuration(flatRecords[indexfromtaskid].endDate, checkEndDate, "minute", flatRecords[indexfromtaskid]);
                                    collection[fromTaskIdIndex].slack = dateDifference;
                                }
                                    // execute if the previous task has sucessor.
                                else if (!ej.isNullOrUndefined(collection[totaskId].to)) {
                                    indexfromtaskid = modelRecordIds.indexOf(fromDateArray1[0].toString());
                                    indexenddate = modelRecordIds.indexOf(fromDataObject[0].todateID.toString());
                                    if (flatRecords[indexenddate].endDate > flatRecords[indexfromtaskid].startDate)
                                        dateDifference = -(proxy._getDuration(flatRecords[indexfromtaskid].startDate, flatRecords[indexenddate].endDate, "minute", flatRecords[indexfromtaskid].isAutoSchedule));
                                    else
                                        dateDifference = proxy._getSlackDuration(flatRecords[indexenddate].endDate, flatRecords[indexfromtaskid].startDate, "minute", flatRecords[indexfromtaskid]);
                                    if (collection[totaskId].slack + dateDifference < 0) {
                                        collection[fromTaskIdIndex].slack = 0;
                                    }
                                    else {
                                        collection[fromTaskIdIndex].slack = collection[totaskId].slack + dateDifference;
                                    }
                                }
                            }
                                // execute if the offset value is given.
                            else if (fromDateArray1.length > 1) {
                                indexfromtaskid = modelRecordIds.indexOf(fromDateArray1[0].toString());
                                indexenddate = modelRecordIds.indexOf(fromDataObject[0].todateID.toString());
                                if (flatRecords[indexenddate].endDate > flatRecords[indexfromtaskid].endDate) {
                                    if (flatRecords[indexfromtaskid].startDate > flatRecords[indexenddate].endDate)
                                        dateDifference = -(proxy._getSlackDuration(flatRecords[indexenddate].endDate, flatRecords[indexfromtaskid].startDate, "minute", flatRecords[indexfromtaskid]));
                                    else
                                        dateDifference = proxy._getDuration(flatRecords[indexfromtaskid].startDate, flatRecords[indexenddate].endDate, "minute", flatRecords[indexfromtaskid].isAutoSchedule);
                                } else {
                                    dateDifference = proxy._getSlackDuration(flatRecords[indexfromtaskid].endDate, checkEndDate, "minute", flatRecords[indexfromtaskid]);
                                }
                                if (fromDateArray1[1].indexOf("hour") != -1)
                                    offsetInMillSec = parseInt(fromDateArray1[1]) * 60;
                                else if (fromDateArray1[1].indexOf("day") != -1)
                                    offsetInMillSec = parseInt(fromDateArray1[1]) * (proxy._secondsPerDay / 3600) * 60;
                                else
                                    offsetInMillSec = parseInt(fromDateArray1[1]);

                                collection[fromTaskIdIndex].slack = collection[totaskId].slack + dateDifference;
                                collection[fromTaskIdIndex].slack = collection[fromTaskIdIndex].slack - (offsetInMillSec);
                                if (collection[fromTaskIdIndex].slack < 0)
                                    collection[fromTaskIdIndex].slack = 0;
                            }
                            collection[fromTaskIdIndex].fs = 1;
                            collection[fromTaskIdIndex].fsslack = collection[fromTaskIdIndex].slack;
                            collection[fromTaskIdIndex].enddate = flatRecords[indexfromtaskid].startDate;
                        }
                        else {

                            if (fromDateArray1.length <= 1) {
                                if (ej.isNullOrUndefined(collection[totaskId].to)) {
                                    indexfromtaskid = modelRecordIds.indexOf(fromDateArray1[0].toString());
                                    dateDifference = proxy._getSlackDuration(flatRecords[indexfromtaskid].endDate, checkEndDate, "minute", flatRecords[indexfromtaskid]);
                                } else if (!ej.isNullOrUndefined(collection[totaskId].to)) {
                                    indexfromtaskid = modelRecordIds.indexOf(fromDateArray1[0].toString());
                                    indexenddate = modelRecordIds.indexOf(fromDataObject[0].todateID.toString());
                                    if (flatRecords[indexenddate].endDate > flatRecords[indexfromtaskid].startDate)
                                        dateDifference = -(proxy._getDuration(flatRecords[indexfromtaskid].startDate, flatRecords[indexenddate].endDate, "minute", flatRecords[indexfromtaskid].isAutoSchedule));
                                    else
                                        dateDifference = proxy._getSlackDuration(flatRecords[indexenddate].endDate, flatRecords[indexfromtaskid].startDate, "minute", flatRecords[indexfromtaskid]);

                                }
                                // execute if the current calculated slack value is less than the previous slack value.
                                if (collection[fromTaskIdIndex].slack > dateDifference && collection[fromTaskIdIndex].slack != 0) {
                                    if (ej.isNullOrUndefined(collection[totaskId].to)) {
                                        collection[fromTaskIdIndex].slack = dateDifference;
                                    } else if (!ej.isNullOrUndefined(collection[totaskId].to)) {
                                        if (collection[totaskId].slack + dateDifference < 0) {
                                            collection[fromTaskIdIndex].slack = 0;
                                        }
                                        else {
                                            collection[fromTaskIdIndex].slack = collection[totaskId].slack + dateDifference;
                                        }
                                    }
                                }
                            } else if (fromDateArray1.length > 1) {
                                indexfromtaskid = modelRecordIds.indexOf(fromDateArray1[0].toString());
                                indexenddate = modelRecordIds.indexOf(fromDataObject[0].todateID.toString());

                                if (flatRecords[indexenddate].endDate > flatRecords[indexfromtaskid].endDate) {
                                    if (flatRecords[indexfromtaskid].startDate > flatRecords[indexenddate].endDate)
                                        dateDifference = -(proxy._getSlackDuration(flatRecords[indexenddate].endDate, flatRecords[indexfromtaskid].startDate, "minute", flatRecords[indexfromtaskid]));
                                    else
                                        dateDifference = proxy._getDuration(flatRecords[indexfromtaskid].startDate, flatRecords[indexenddate].endDate, "minute", flatRecords[indexfromtaskid].isAutoSchedule);
                                } else {
                                    dateDifference = proxy._getSlackDuration(flatRecords[indexfromtaskid].endDate, checkEndDate, "minute", flatRecords[indexfromtaskid]);
                                }
                                // execute if the current calculated slack value is less than the previous slack value.
                                if (collection[fromTaskIdIndex].slack > dateDifference && collection[fromTaskIdIndex].slack != 0) {
                                    if (fromDateArray1[1].indexOf("hour") != -1)
                                        offsetInMillSec = parseInt(fromDateArray1[1]) * 60;
                                    else if (fromDateArray1[1].indexOf("day") != -1)
                                        offsetInMillSec = parseInt(fromDateArray1[1]) * (proxy._secondsPerDay / 3600) * 60;
                                    else
                                        offsetInMillSec = parseInt(fromDateArray1[1]);

                                    collection[fromTaskIdIndex].slack = collection[totaskId].slack + dateDifference;
                                    collection[fromTaskIdIndex].slack = collection[fromTaskIdIndex].slack - (offsetInMillSec);
                                    if (collection[fromTaskIdIndex].slack < 0)
                                        collection[fromTaskIdIndex].slack = 0;
                                }
                            }
                            collection[fromTaskIdIndex].fs = 1;
                            collection[fromTaskIdIndex].fsslack = collection[fromTaskIdIndex].slack;
                            collection[fromTaskIdIndex].enddate = flatRecords[indexfromtaskid].startDate;
                        }
                    }
                        //It execute if the task is an auto mode task.
                    else if (!flatRecords[indexfromtaskid].isAutoSchedule) {
                        dateDifference = proxy._getSlackDuration(flatRecords[indexfromtaskid].endDate, checkEndDate, "minute", flatRecords[indexfromtaskid]);
                        if (ej.isNullOrUndefined(collection[fromTaskIdIndex].slack)) {
                            collection[fromTaskIdIndex].slack = dateDifference;
                        }
                        else if (collection[fromTaskIdIndex].slack > dateDifference && collection[fromTaskIdIndex].slack != 0) {
                            collection[fromTaskIdIndex].slack = dateDifference;
                        }
                    }
                    if (flatRecords[indexfromtaskid].endDate >= checkEndDate && flatRecords[indexfromtaskid].endDate <= checkEndDate) {
                        collection[fromTaskIdIndex].slack = 0;
                    }
                }
                if (collection[fromTaskIdIndex].from)
                    fromDataObject.push({ fromdata: collection[fromTaskIdIndex].from, todateID: collection[fromTaskIdIndex].taskid, fromDataPredecessor: collection[fromTaskIdIndex].fromPredecessor });
            }
            if (fromDataObject) {
                fromDataObject.splice(0, 1);
                if (fromDataObject.length > 0)
                    proxy._slackCalculation(fromDataObject, collection, collectionTaskId, checkEndDate, flatRecords, modelRecordIds);
            }
        },
              
        // Delete selected predecessor from the UI dialog
        deleteDependency: function (fromId, toId) {
            var proxy = this, model = proxy.model,
                fromTask, toTask;

            var beginArgs = {
                fromId: fromId,
                toId: toId,
                requestType: "deleteDependency",
            };

            if (!proxy._trigger("actionBegin", beginArgs)) {              

                fromTask = !ej.isNullOrUndefined(beginArgs.fromId) && proxy._getRecordByTaskId(beginArgs.fromId.toString());
                toTask = !ej.isNullOrUndefined(beginArgs.toId) && proxy._getRecordByTaskId(beginArgs.toId.toString());

                if (!model.predecessorMapping || ej.isNullOrUndefined(fromTask) || ej.isNullOrUndefined(toTask))
                    return;

                if (fromTask && toTask && fromTask.predecessor) {
                    proxy._updatedConnectorLineCollection = [];
                    proxy._connectorlineIds = [];
                    proxy._isLastRefresh = true;
                    proxy._removePredecessor(fromTask.predecessor, toTask, true);
                    if (this.isCriticalPathEnable == true) {
                        proxy._$ganttchartHelper.ejGanttChart("criticalConnectorLine", this.criticalPathCollection, this.detailPredecessorCollection, false, this.collectionTaskId);
                        this.showCriticalPath(true);
                    }
                }
            }
        },
        updateDependency: function (fromId, toId, predecessorType, offset) {
            var proxy = this, model = proxy.model, fromTask, toTask,
                fromTaskId, toTaskId, offsetUnit;

            var beginArgs = {
                fromId: fromId,
                toId: toId,
                requestType: "updateDependency",
                predecessorType: predecessorType,
                offset: offset, 
            };

            if (!proxy._trigger("actionBegin", beginArgs)) {

                fromTask = !ej.isNullOrUndefined(beginArgs.fromId) && proxy._getRecordByTaskId(beginArgs.fromId.toString());
                toTask = !ej.isNullOrUndefined(beginArgs.toId) && proxy._getRecordByTaskId(beginArgs.toId.toString());

                if (!model.predecessorMapping || ej.isNullOrUndefined(fromTask) || ej.isNullOrUndefined(toTask) || !fromTask || !toTask)
                    return;

                fromTaskId = beginArgs.fromId.toString();
                toTaskId = beginArgs.toId.toString();
                predecessorType = beginArgs.predecessorType;
                offset = beginArgs.offset;

                if (toTask.predecessor.length > 0) {

                    var toPredecessor = toTask.predecessor.filter(function (pdc) {
                        return pdc.from == fromTaskId;
                    });

                    if (ej.isNullOrUndefined(toPredecessor[0]))
                        return;

                    var prevPredecessor = JSON.parse(JSON.stringify(toTask.predecessor)),
                        type = ["FS", "SS", "SF", "FF"];

                    if (ej.isNullOrUndefined(predecessorType) || (type).indexOf(predecessorType.toUpperCase()) < 0)
                        predecessorType = toPredecessor[0].predecessorsType;

                    if (ej.isNullOrUndefined(offset) || offset.length == 0) {
                        offset = toPredecessor[0].offset;
                        offsetUnit = toPredecessor[0].offsetDurationUnit;
                    }
                    else {
                        var offsetValue = toTask._getOffsetDurationUnit(offset, this._durationUnitEditText, model.durationUnit);
                        offset = offsetValue.duration;
                        offsetUnit = offsetValue.durationUnit;
                    }

                    if (toPredecessor[0].offset != offset || toPredecessor[0].predecessorsType != predecessorType) {
                        toPredecessor[0].predecessorsType = predecessorType;
                        toPredecessor[0].offset = offset;
                        toPredecessor[0].offsetDurationUnit = offsetUnit;
                        proxy._updatedConnectorLineCollection = [];
                        proxy._connectorlineIds = [];
                        proxy._isLastRefresh = false;
                        proxy._validatePredecessor(toTask, prevPredecessor);
                        proxy._$ganttchartHelper.ejGanttChart("appendConnectorLine", proxy._updatedConnectorLineCollection);
                        proxy._updateConnectorLineCollection(proxy._updatedConnectorLineCollection);

                        toTask.item[model.predecessorMapping] = proxy._predecessorToString(toTask.predecessor, toTask);
                        toTask.predecessorsName = toTask.item[model.predecessorMapping];

                        if (model.enableWBS && model.enableWBSPredecessor)
                            proxy._$treegridHelper.ejTreeGrid("updateWBSPredecessor", toTask);
                        model.enableSerialNumber && proxy._$treegridHelper.ejTreeGrid("predecessorToSerialPredecessor", toTask);
                        proxy._isLastRefresh = true;
                        proxy.refreshGanttRecord(toTask);

                        if (this.isCriticalPathEnable == true) {
                            proxy._$ganttchartHelper.ejGanttChart("criticalConnectorLine", this.criticalPathCollection, this.detailPredecessorCollection, false, this.collectionTaskId);
                            this.showCriticalPath(true);
                        }
                    }
                }
            }
        }
    };

})(jQuery, Syncfusion);