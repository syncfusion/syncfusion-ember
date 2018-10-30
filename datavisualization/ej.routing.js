var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ConnectionEnd;
(function (ConnectionEnd) {
    ConnectionEnd[ConnectionEnd["Source"] = 0] = "Source";
    ConnectionEnd[ConnectionEnd["Target"] = 1] = "Target";
})(ConnectionEnd || (ConnectionEnd = {}));
var LoadingPriority;
(function (LoadingPriority) {
    LoadingPriority[LoadingPriority["ImmediateLoading"] = 0] = "ImmediateLoading";
    LoadingPriority[LoadingPriority["DelayedDiagramLoading"] = 1] = "DelayedDiagramLoading";
    LoadingPriority[LoadingPriority["DelayedConnectorLoading"] = 2] = "DelayedConnectorLoading";
})(LoadingPriority || (LoadingPriority = {}));
var RoutingPriority;
(function (RoutingPriority) {
    RoutingPriority[RoutingPriority["Routing"] = 0] = "Routing";
    RoutingPriority[RoutingPriority["Performance"] = 1] = "Performance";
    RoutingPriority[RoutingPriority["Default"] = 2] = "Default";
})(RoutingPriority || (RoutingPriority = {}));
var SegmentOrientation;
(function (SegmentOrientation) {
    SegmentOrientation[SegmentOrientation["Horizontal"] = 0] = "Horizontal";
    SegmentOrientation[SegmentOrientation["Vertical"] = 1] = "Vertical";
})(SegmentOrientation || (SegmentOrientation = {}));
var ObstacleSideType;
(function (ObstacleSideType) {
    ObstacleSideType[ObstacleSideType["Low"] = 0] = "Low";
    ObstacleSideType[ObstacleSideType["High"] = 1] = "High";
})(ObstacleSideType || (ObstacleSideType = {}));
var PortDirection;
(function (PortDirection) {
    PortDirection[PortDirection["None"] = 0] = "None";
    PortDirection[PortDirection["Left"] = 1] = "Left";
    PortDirection[PortDirection["Right"] = 2] = "Right";
    PortDirection[PortDirection["Top"] = 3] = "Top";
    PortDirection[PortDirection["Bottom"] = 4] = "Bottom";
})(PortDirection || (PortDirection = {}));
var Orientation;
(function (Orientation) {
    Orientation[Orientation["None"] = 0] = "None";
    Orientation[Orientation["Horizontal"] = 1] = "Horizontal";
    Orientation[Orientation["Vertical"] = 2] = "Vertical";
})(Orientation || (Orientation = {}));
var ScanDirection;
(function (ScanDirection) {
    ScanDirection[ScanDirection["Right"] = 0] = "Right";
    ScanDirection[ScanDirection["Top"] = 1] = "Top";
})(ScanDirection || (ScanDirection = {}));
var RoutingSolution;
(function (RoutingSolution) {
    RoutingSolution[RoutingSolution["Quick"] = 0] = "Quick";
    RoutingSolution[RoutingSolution["Best"] = 1] = "Best";
})(RoutingSolution || (RoutingSolution = {}));
var Directions;
(function (Directions) {
    Directions[Directions["None"] = 0] = "None";
    Directions[Directions["North"] = 1] = "North";
    Directions[Directions["East"] = 2] = "East";
    Directions[Directions["South"] = 4] = "South";
    Directions[Directions["West"] = 8] = "West";
})(Directions || (Directions = {}));
var Utility = (function () {
    function Utility() {
    }
    Utility.ToRoundedInt = function (value) {
        return Math.round(value);
    };
    Utility.IntersectionWithRectangleBorder = function (rect, point, dir) {
        switch (dir) {
            case Directions.North:
            case Directions.South:
                return new Point(Utility.ToRoundedInt(point.x), this.GetRectangleEdge(rect, dir));
            case Directions.East:
            case Directions.West:
                return new Point(this.GetRectangleEdge(rect, dir), Utility.ToRoundedInt(point.y));
        }
        return new Point();
    };
    Utility.GetRectangleEdge = function (rect, direction) {
        switch (direction) {
            case Directions.East:
                return rect.right();
            case Directions.West:
                return rect.left();
            case Directions.North:
                return rect.bottom();
            case Directions.South:
                return rect.top();
        }
        return 0;
    };
    Utility.GetLengthFromListOfPoints = function (list) {
        var length = 0.0;
        var start = list.get(0);
        for (var k = 0; k < list.size(); k++) {
            var i = list.get(k);
            length += Extensions.FindDistance(start, i, Extensions.GetOrientation(start.FindDirection(i)));
            start = i;
        }
        return Number(length.toFixed(4));
    };
    Utility.GetIntersections = function (line, point) {
        var ret = new PointList();
        var offset = 0.0;
        var par0, par1;
        var x = new Point();
        var polyPoint = point;
        var close = false;
        for (; polyPoint != null && close == false; polyPoint = polyPoint.getNext()) {
            var obj = this.CrossTwoLineSegs(line.StartPoint, line.EndPoint, polyPoint.Point, polyPoint.getNext().Point, 0, 1, 0, 1, par0, par1, x);
            par0 = obj.aSolution;
            par1 = obj.bSolution;
            x = obj.x;
            if (obj.crossToLines) {
                if (!this.OldIntersection(x, ret))
                    ret.add(x);
            }
            offset++;
            if (polyPoint.getNext() == point)
                close = true;
        }
        return ret;
    };
    Utility.OldIntersection = function (point, intersectingPoints) {
        for (var i = 0; i < intersectingPoints.size(); i++) {
            if (point.equals(intersectingPoints.get(i)))
                return true;
        }
        return false;
    };
    Utility.CrossTwoLineSegs = function (aStart, aEnd, bStart, bEnd, amin, amax, bmin, bmax, aSolution, bSolution, x) {
        var u = aEnd.subtract(aStart);
        var v = bStart.subtract(bEnd);
        var w = bStart.subtract(aStart);
        var args = this.Solve(u.x, v.x, w.x, u.y, v.y, w.y, aSolution, bSolution);
        var r = args.solve;
        aSolution = args.x;
        bSolution = args.y;
        var crossToLines = false;
        x = aStart.add(u.multiplyFactor(aSolution));
        if (r) {
            if (aSolution < amin)
                crossToLines = false;
            aSolution = Math.max(aSolution, amin);
            if (aSolution > amax)
                crossToLines = false;
            aSolution = Math.min(aSolution, amax);
            if (bSolution < bmin)
                crossToLines = false;
            bSolution = Math.max(bSolution, bmin);
            if (bSolution > bmax)
                crossToLines = false;
            bSolution = Math.min(bSolution, bmax);
            crossToLines = true;
        }
        return { crossToLines: crossToLines, aSolution: aSolution, bSolution: bSolution, x: x };
    };
    Utility.Solve = function (a00, a01, b0, a10, a11, b1, x, y) {
        var d = a00 * a11 - a10 * a01;
        var solve = true;
        if (Math.abs(d) < 0.00001) {
            x = y = 0;
            return { solve: false, x: x, y: y };
        }
        x = (b0 * a11 - b1 * a01) / d;
        y = (a00 * b1 - a10 * b0) / d;
        return { solve: true, x: x, y: y };
    };
    Utility.CheckWithScanDirection = function (direction, start, end) {
        if (direction == ScanDirection.Right) {
            return start.FindDirection(end) == Directions.East;
        }
        else {
            return start.FindDirection(end) == Directions.North;
        }
    };
    Utility.SegmentIntersects = function (segment1, segment2, intersect) {
        var args = this.IntervalsIntersects(segment1, segment2, intersect);
        return { isInterSect: args.isInterSect, intersect: args.intersect };
    };
    Utility.IntervalsIntersects = function (segment1, segment2, intersect) {
        intersect = this.FindIntersection(segment1.StartPoint, segment1.EndPoint, segment2.StartPoint);
        return { isInterSect: segment1.Contains(intersect) && segment2.Contains(intersect), intersect: intersect };
    };
    Utility.FindIntersection = function (start, end, newPt) {
        var direction = start.FindDirection(end);
        if (Extensions.IsVertical(direction)) {
            return new Point(start.x, newPt.y);
        }
        return new Point(newPt.x, start.y);
    };
    Utility.AreEquivalentLines = function (segment1, segment2) {
        if (segment1.StartPoint.equals(segment2.StartPoint) && segment1.EndPoint.equals(segment2.EndPoint) || segment1.StartPoint.equals(segment2.EndPoint) && segment1.EndPoint.equals(segment2.StartPoint))
            return true;
        return false;
    };
    Utility.ListOrderBy = function (arr, key) {
        return arr.sort(function (a, b) {
            if (a.key > b.key || a[key] < b[key]) {
                return 1;
            }
            if (a[key] < b[key] || a[key] > b[key]) {
                return -1;
            }
            return 0;
        });
    };
    Utility.OrderBy = function (arr, key) {
        return arr.items.sort(function (a, b) {
            if (a._outerBounds[key]() < b._outerBounds[key]()) {
                return -1;
            }
            if (a._outerBounds[key]() > b._outerBounds[key]()) {
                return 1;
            }
            return 0;
        });
    };
    Utility.OrderByDescending = function (arr, key) {
        return arr.items.sort(function (a, b) {
            if (a._outerBounds[key]() > b._outerBounds[key]()) {
                return -1;
            }
            if (a._outerBounds[key]() < b._outerBounds[key]()) {
                return 1;
            }
            return 0;
        });
    };
    Utility.ToList = function (collection) {
        var list = new List();
        var keys = Object.keys(collection);
        keys.sort(function (a, b) { return a - b; });
        for (var i = 0; i < keys.length; i++) {
            list.add(collection[keys[i]]);
        }
        return list;
    };
    return Utility;
}());
var Extensions = (function () {
    function Extensions() {
    }
    Extensions.Left = function (direction) {
        switch (direction) {
            case Directions.None:
                return Directions.None;
            case Directions.North:
                return Directions.West;
            case Directions.East:
                return Directions.North;
            case Directions.South:
                return Directions.East;
            case Directions.West:
                return Directions.South;
            default:
                break;
        }
    };
    Extensions.Right = function (direction) {
        switch (direction) {
            case Directions.None:
                return Directions.None;
            case Directions.North:
                return Directions.East;
            case Directions.East:
                return Directions.South;
            case Directions.South:
                return Directions.West;
            case Directions.West:
                return Directions.North;
            default:
                return Directions.None;
        }
    };
    Extensions.Contains = function (dirs, direction) {
        return (direction & dirs) != 0;
    };
    Extensions.ToIndex = function (direction) {
        switch (direction) {
            case Directions.North:
                return 0;
            case Directions.East:
                return 1;
            case Directions.South:
                return 2;
            case Directions.West:
                return 3;
            default:
                break;
        }
    };
    Extensions.IsAscending = function (direction) {
        if (direction == Directions.South || direction == Directions.West) {
            return false;
        }
        return true;
    };
    Extensions.IsAscending_Direction = function (direction) {
        if (direction == PortDirection.Left || direction == PortDirection.Top) {
            return false;
        }
        return true;
    };
    Extensions.IsVertical = function (direction) {
        if (direction == Directions.East || direction == Directions.West) {
            return false;
        }
        return true;
    };
    Extensions.GetOrientation_PortDirection = function (direction) {
        switch (direction) {
            case PortDirection.Right:
            case PortDirection.Left:
                return Orientation.Horizontal;
            case PortDirection.Top:
            case PortDirection.Bottom:
                return Orientation.Vertical;
        }
        return Orientation.None;
    };
    Extensions.GetOrientation = function (direction) {
        switch (direction) {
            case Directions.East:
            case Directions.West:
                return Orientation.Horizontal;
            case Directions.North:
            case Directions.South:
                return Orientation.Vertical;
        }
        return Orientation.None;
    };
    Extensions.OppositeDirection_Port = function (direction) {
        switch (direction) {
            case PortDirection.Right:
                return PortDirection.Left;
            case PortDirection.Left:
                return PortDirection.Right;
            case PortDirection.Top:
                return PortDirection.Bottom;
            case PortDirection.Bottom:
                return PortDirection.Top;
        }
        return PortDirection.None;
    };
    Extensions.OppositeDirection = function (direction) {
        switch (direction) {
            case Directions.North:
                return Directions.South;
            case Directions.West:
                return Directions.East;
            case Directions.South:
                return Directions.North;
            case Directions.East:
                return Directions.West;
            default:
                return Directions.None;
        }
    };
    Extensions.IsPureDirection = function (direction) {
        switch (direction) {
            case Directions.North:
                return true;
            case Directions.East:
                return true;
            case Directions.South:
                return true;
            case Directions.West:
                return true;
            default:
                return false;
        }
    };
    Extensions.OppositeDirection_Direction = function (direction) {
        switch (direction) {
            case Directions.North:
                return Directions.South;
            case Directions.West:
                return Directions.East;
            case Directions.South:
                return Directions.North;
            case Directions.East:
                return Directions.West;
            default:
                return Directions.None;
        }
    };
    Extensions.OppositeOrientation = function (orientation) {
        if (orientation == Orientation.Horizontal)
            return Orientation.Vertical;
        return Orientation.Horizontal;
    };
    Extensions.ToAngle = function (direction) {
        switch (direction) {
            case Directions.East:
                return 0;
            case Directions.North:
                return 90;
            case Directions.West:
                return 180;
            case Directions.South:
                return 270;
        }
        return 0;
    };
    Extensions.GetEquivalentDirection = function (direction) {
        switch (direction) {
            case PortDirection.Right:
                return Directions.East;
            case PortDirection.Left:
                return Directions.West;
            case PortDirection.Bottom:
                return Directions.North;
            case PortDirection.Top:
                return Directions.South;
        }
        return Directions.None;
    };
    Extensions.FindDirection = function (start, end) {
        var direction = Directions.None;
        var startX = start.x, startY = start.y;
        var endX = end.x, endY = end.y;
        if (startX != endX)
            direction = endX > startX ? Directions.East : Directions.West;
        if (startY != endY)
            direction = endY > startY ? direction | Directions.North : direction | Directions.South;
        return direction;
    };
    Extensions.FindDirection_orientation = function (start, end, orientation) {
        var direction = Directions.None;
        if (orientation == Orientation.Horizontal) {
            var horizontalDiff = end.x - start.x;
            if (horizontalDiff > 0) {
                direction = Directions.East;
            }
            else if (horizontalDiff < 0) {
                direction = Directions.West;
            }
        }
        else {
            var verticalDiff = end.y - start.y;
            if (verticalDiff > 0) {
                direction = direction | Directions.North;
            }
            else if (verticalDiff < 0) {
                direction = direction | Directions.South;
            }
        }
        return direction;
    };
    Extensions.ManhattanDistance = function (source, target) {
        return Math.abs(source.x - target.x) + Math.abs(source.y - target.y);
    };
    Extensions.FindDistance = function (source, target, orientation) {
        if (orientation == Orientation.Horizontal) {
            return Math.abs(source.x - target.x);
        }
        else
            return Math.abs(source.y - target.y);
    };
    Extensions.Transform = function (s, length, direction) {
        var angle = this.ToAngle(direction);
        return new Point(Number(Math.round(s.x + length * Math.cos(angle * Math.PI / 180)).toFixed(4)), Number(Math.round(s.y + length * Math.sin(angle * Math.PI / 180)).toFixed(4)));
    };
    Extensions.VectorDirection = function (d) {
        var epsilon = 0.0001;
        var r = Directions.None;
        if (d.x > epsilon)
            r = Directions.East;
        else if (d.x < -epsilon)
            r = Directions.West;
        if (d.y > epsilon)
            r = r | Directions.North;
        else if (d.y < -epsilon)
            r = r | Directions.South;
        return r;
    };
    Extensions.GetLengthFromListOfPoints = function (list) {
        var length = 0.0;
        var start = list.get(0);
        for (var k = 0; k < list.size(); k++) {
            var i = list.get(Number(k));
            length += Extensions.FindDistance(start, i, Extensions.GetOrientation(Extensions.FindDirection(start, i)));
            start = i;
        }
        return Number(length.toFixed(4));
    };
    Extensions.CompareTo = function (value1, value) {
        if (value1 < value) {
            return -1;
        }
        if (value1 > value) {
            return 1;
        }
        if (value1 != value) {
            if (!isNaN(value1)) {
                return 1;
            }
            if (!isNaN(value)) {
                return -1;
            }
        }
        return 0;
    };
    Extensions.FindDirectionOrientation = function (start, end, orientation) {
        var direction = Directions.None;
        if (orientation == Orientation.Horizontal) {
            var horizontalDiff = end.x - start.x;
            if (horizontalDiff > 0) {
                direction = Directions.East;
            }
            else if (horizontalDiff < 0) {
                direction = Directions.West;
            }
        }
        else {
            var verticalDiff = end.y - start.y;
            if (verticalDiff > 0) {
                direction = direction || Directions.North;
            }
            else if (verticalDiff < 0) {
                direction = direction || Directions.South;
            }
        }
        return direction;
    };
    Extensions.add = function (dictionary, key, object, canSort) {
        var count = Object.keys(dictionary);
        var addObject = { key: key, value: object };
        dictionary[count.length] = addObject;
        if (!canSort && (typeof dictionary[0].key !== "object"))
            this.sortOnKeys(dictionary);
        return dictionary;
    };
    Extensions.sortOnKeys = function (dict) {
        var sorted = [];
        for (var key in dict) {
            sorted[sorted.length] = dict[key].key;
        }
        sorted.sort(function (a, b) {
            return a - b;
        });
        var cloneDic = $.extend(false, {}, dict);
        var keys = Object.keys(dict);
        for (var h = 0; h < keys.length; h++) {
            var key = keys[h];
            if (dict[key])
                delete dict[key];
        }
        ;
        for (var i = 0; i < sorted.length; i++) {
            var list = Object.keys(cloneDic);
            for (var s = 0; s < list.length; s++) {
                var object = cloneDic[list[s]];
                if (object.key == sorted[i]) {
                    Extensions.add(dict, sorted[i], object.value, true);
                }
            }
        }
        return dict;
    };
    Extensions.getFromDictionary123 = function (dictionary, key) {
        var keys = Object.keys(dictionary);
        var index = -1;
        for (var i = 0; i < keys.length; i++) {
            var object = dictionary[keys[i]];
            var keyType1 = typeof object.key;
            if (keyType1 === "object") {
                if (object.key && object.key.x && object.key.y) {
                    if (object.key.x === key.x && object.key.y === key.y)
                        return object.value;
                }
                else if (object.key.name && key.name) {
                    if (object.key.name === key.name)
                        return object.value;
                }
                else {
                }
            }
            else {
            }
        }
        return null;
    };
    Extensions.getFromDictionary = function (dictionary, key, type) {
        var keyType = type ? type : typeof key;
        if (keyType === "number") {
            var list = Object.keys(dictionary);
            for (var i = 0; i < list.length; i++) {
                var object = dictionary[list[i]];
                if (object.key == key)
                    return object.value;
            }
        }
        else {
            return this.getFromDictionary123(dictionary, key);
        }
        return null;
    };
    Extensions.ElementAt = function (object, index) {
        var keys = Object.keys(object);
        var retObject = object[keys[index]];
        if (retObject) {
            if (retObject.value) {
                return object[keys[index]].value;
            }
            else {
                return object[keys[index]];
            }
        }
        return null;
    };
    Extensions.KeytAt = function (object, index) {
        var keys = Object.keys(object);
        var retObject = object[keys[index]];
        if (retObject)
            return object[keys[index]].key;
        return null;
    };
    Extensions.Clear = function (object) {
        object = {};
        return object;
    };
    Extensions.IndexOfKey = function (dictionary, keyObject) {
        var keys = Object.keys(dictionary);
        var index = -1;
        for (var i = 0; i < keys.length; i++) {
            index++;
            var keyType = typeof keyObject;
            if (keyType == "string" || keyType == "number") {
                if (dictionary[keys[i]].key === keyObject) {
                    return index;
                }
            }
            else {
                var object = dictionary[keys[i]];
                var keyType1 = typeof (object.key);
                if (keyType1 === "object") {
                    if (object.key && object.key.x && object.key.y) {
                        if (object.key.x === keyObject.x && object.key.y === keyObject.y)
                            return index;
                    }
                }
            }
        }
        return -1;
    };
    Extensions.Count = function (object) {
        var keys = Object.keys(object);
        return keys.length;
    };
    Extensions.ContainsKey = function (dictionary, key) {
        var keyType = typeof key;
        if (keyType == "string" || keyType == "number") {
            var list = Object.keys(dictionary);
            for (var i = 0; i < list.length; i++) {
                var object = dictionary[list[i]];
                if (object.key == key)
                    return true;
            }
        }
        else if (keyType == "object") {
            if (key && key.x && key.y) {
                var list = Object.keys(dictionary);
                for (var i = 0; i < list.length; i++) {
                    var object = dictionary[list[i]];
                    var keyType1 = typeof (object.key);
                    if (keyType1 == "object") {
                        if (object.key && object.key.x && object.key.y) {
                            if (object.key.x === key.x && object.key.y === key.y)
                                return true;
                        }
                    }
                }
            }
        }
        return false;
    };
    Extensions.ReAlignDictionary = function (dictionary) {
        var keys = Object.keys(dictionary);
        if (keys.length > 0) {
            var keyType = typeof dictionary[keys[0]].key;
            if (keyType == "string" || keyType == "number") {
                var cloneDic = $.extend(false, {}, dictionary);
                for (var h = 0; h < keys.length; h++) {
                    var key = keys[h];
                    if (dictionary[key])
                        delete dictionary[key];
                }
                ;
                var clKeys = Object.keys(cloneDic);
                for (var j = 0; j < clKeys.length; j++) {
                    Extensions.add(dictionary, cloneDic[clKeys[j]].key, cloneDic[clKeys[j]].value, true);
                }
            }
        }
        return dictionary;
    };
    Extensions.Remove = function (dictionary, key, index) {
        if (index != undefined) {
            if (dictionary[index]) {
                delete dictionary[index];
                this.ReAlignDictionary(dictionary);
                return true;
            }
        }
        else {
            var list = Object.keys(dictionary);
            for (var i = 0; i < list.length; i++) {
                var object = dictionary[list[i]];
                var keyType = typeof key;
                if (keyType == "string" || keyType == "number") {
                    if (object.key == key) {
                        delete dictionary[list[i]];
                        this.ReAlignDictionary(dictionary);
                        return true;
                    }
                }
                else {
                    if (key && key.x && key.y) {
                        var list = Object.keys(dictionary);
                        for (var i = 0; i < list.length; i++) {
                            var object = dictionary[list[i]];
                            var keyType1 = typeof object.key;
                            if (keyType1 == "object") {
                                if (object.key && object.key.x && object.key.y) {
                                    if (object.key.x === key.x && object.key.y === key.y) {
                                        delete dictionary[list[i]];
                                        dictionary[list[i]];
                                        this.ReAlignDictionary(dictionary);
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return false;
    };
    return Extensions;
}());
var Point = (function () {
    function Point(x, y) {
        this.x = 0;
        this.y = 0;
        this.x = x ? x : 0;
        this.y = y ? y : 0;
    }
    Point.equals = function (point1, point2) {
        if (point1 === point2) {
            return true;
        }
        if (!point1 || !point2) {
            return false;
        }
        return !point1 || !point2 || point1.x === point2.x && point1.y === point2.y;
    };
    Point.prototype.equals = function (point1) {
        if (point1 === this) {
            return true;
        }
        if (!point1 || !this) {
            return false;
        }
        return !point1 || !this || point1.x === this.x && point1.y === this.y;
    };
    Point.prototype.OperatorNotEqual = function (point2) {
        var point1 = this;
        return point1.CompareTo(point2) != 0;
    };
    Point.prototype.subtract = function (point1) {
        return new Point(this.x - point1.x, this.y - point1.y);
    };
    Point.prototype.add = function (point1) {
        return new Point(this.x + point1.x, this.y + point1.y);
    };
    Point.prototype.multiplyFactor = function (factor) {
        return new Point(this.x * factor, this.y * factor);
    };
    Point.prototype.distance = function (point2) {
        return Math.sqrt(Math.pow(this.x - point2.x, 2) + Math.pow(this.y - point2.y, 2));
    };
    Point.transform = function (point, angle, length) {
        var pt = { x: 0, y: 0 };
        pt.x = Number((((point.x + length * Math.cos(angle * Math.PI / 180)) * 100) / 100).toFixed(4));
        pt.y = Number((((point.y + length * Math.sin(angle * Math.PI / 180)) * 100) / 100).toFixed(4));
        return pt;
    };
    Point.findLength = function (s, e) {
        var length = Math.sqrt(Math.pow((s.x - e.x), 2) + Math.pow((s.y - e.y), 2));
        return Number(length.toFixed(4));
    };
    Point.findAngle = function (point1, point2) {
        var angle = Math.atan2(point2.y - point1.y, point2.x - point1.x);
        angle = (180 * angle / Math.PI);
        angle %= 360;
        if (angle < 0) {
            angle += 360;
        }
        return angle;
    };
    Point.distancePoints = function (pt1, pt2) {
        return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
    };
    Point.prototype.OperatorLessThan = function (point2) {
        var point1 = this;
        return point1.CompareTo(point2) < 0;
    };
    Point.prototype.OperatorGreaterThan = function (point2) {
        var point1 = this;
        return point1.CompareTo(point2) > 0;
    };
    Point.prototype.CompareTo = function (point) {
        var result = this.CompareTo_Number(this.x, point.x);
        return result != 0 ? result : this.CompareTo_Number(this.y, point.y);
    };
    Point.prototype.CompareTo_Number = function (number1, value) {
        if (number1 < value) {
            return -1;
        }
        if (number1 > value) {
            return 1;
        }
        if (number1 != value) {
            if (!isNaN(number1)) {
                return 1;
            }
            if (!isNaN(value)) {
                return -1;
            }
        }
        return 0;
    };
    Point.prototype.round = function () {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
    };
    Point.prototype.FindDirection = function (end) {
        var direction = Directions.None;
        var startX = this.x, startY = this.y;
        var endX = end.x, endY = end.y;
        if (startX != endX)
            direction = endX > startX ? Directions.East : Directions.West;
        if (startY != endY)
            direction = endY > startY ? direction | Directions.North : direction | Directions.South;
        return direction;
    };
    Point.prototype.ManhattanDistance = function (target) {
        return Math.abs(this.x - target.x) + Math.abs(this.y - target.y);
    };
    return Point;
}());
var List = (function () {
    function List() {
        this._size = 0;
        this.items = [];
    }
    List.prototype.List = function (collection) {
        for (var i = 0; i < collection.size(); i++) {
            this.items.push(collection.get(i));
        }
    };
    List.prototype.size = function () {
        return this.items.length;
    };
    List.prototype.sortByKey = function (key) {
        return this.items.sort(function (a, b) {
            var x = a[key];
            var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    };
    List.prototype.Concat = function (collection) {
        var list = new List();
        for (var i = 0; i < this.items.length; i++) {
            list.add(this.items[i]);
        }
        for (var i = 0; i < collection.size(); i++) {
            list.add(collection.get(i));
        }
        return list;
    };
    List.prototype.GetRange = function (index, count) {
        var list = new List();
        for (var i = index; i < index + count; i++) {
            list.add(this.items[i]);
        }
        return list;
    };
    List.prototype.AddRange = function (collection) {
        for (var i = 0; i < collection.size(); i++) {
            this.items.push(collection.get(i));
        }
    };
    List.prototype.Insert = function (index, value) {
        if (index === void 0) { index = this.size() + 1; }
        this.items.splice(index, 0, value);
        this._size++;
    };
    List.prototype.add = function (value) {
        this.items.push(value);
        this._size++;
    };
    List.prototype.get = function (index) {
        return this.items[Number(index)];
    };
    List.prototype.Remove = function (item) {
        var index = this.IndexOf(item);
        if (index >= 0) {
            this.RemoveAt(index);
            return true;
        }
        return false;
    };
    List.prototype.RemoveAt = function (index) {
        if (index >= this._size) {
        }
        this._size--;
        this.items.splice(index, 1);
    };
    List.prototype.Last = function () {
        return this.items[this.size() - 1];
    };
    List.prototype.IndexOf = function (value) {
        return this.items.indexOf(value);
    };
    List.prototype.Clear = function () {
        while (this.items.length > 0) {
            this.items.pop();
            this._size = 0;
        }
    };
    List.prototype.ElementAt = function (index) {
        return this.items[index];
    };
    List.prototype.UpdateListValue = function (index, newValue) {
        if (newValue && newValue) {
            this.items[index] = newValue;
            return true;
        }
        return false;
    };
    List.prototype.contains = function (item) {
        if (item == null) {
            for (var j = 0; j < this._size; j++) {
                if (this.items[j] == null) {
                    return true;
                }
            }
            return false;
        }
        for (var j = 0; j < this._size; j++) {
            if (this.items[j] == item) {
                return true;
            }
        }
    };
    return List;
}());
var PointList = (function () {
    function PointList() {
        this._size = 0;
        this.items = [];
    }
    PointList.prototype.PointList = function (collection) {
        for (var i = 0; i < collection.length; i++) {
            this.items.push(collection[i]);
        }
        return this;
    };
    PointList.prototype.size = function () {
        return this.items.length;
    };
    PointList.prototype.Insert = function (index, value) {
        if (index === void 0) { index = this.size() + 1; }
        this.items.splice(index, 0, value);
        this._size++;
    };
    PointList.prototype.AddRange = function (collection) {
        for (var i = 0; i < collection.size(); i++) {
            this.items.push(collection.get(i));
        }
    };
    PointList.prototype.Concat = function (collection) {
        var list = new PointList();
        for (var i = 0; i < this.items.length; i++) {
            list.add(this.items[i]);
        }
        for (var i = 0; i < collection.size(); i++) {
            list.add(collection.get(i));
        }
        return list;
    };
    PointList.prototype.add = function (value) {
        this.items.push(value);
        this._size++;
    };
    PointList.prototype.get = function (index) {
        return this.items[index];
    };
    PointList.prototype.RemoveAt = function (index) {
        if (index >= this._size) {
        }
        this._size--;
        this.items.splice(index, 1);
    };
    PointList.prototype.Last = function () {
        return this.items[this.size() - 1];
    };
    PointList.prototype.IndexOf = function (value) {
        return this.items.indexOf(value);
    };
    PointList.prototype.Clear = function () {
        while (this.items.length > 0) {
            this.items.pop();
        }
    };
    PointList.prototype.ElementAt = function (index) {
        return this.items[index];
    };
    PointList.prototype.contains = function (item) {
        if (item == null) {
            for (var j = 0; j < this._size; j++) {
                if (this.items[j] == null) {
                    return true;
                }
            }
            return false;
        }
        for (var j = 0; j < this._size; j++) {
            if (this.items[j] == item) {
                return true;
            }
        }
    };
    return PointList;
}());
var Rect = (function () {
    function Rect(x, y, width, height) {
        this.x = Number.MAX_VALUE;
        this.y = Number.MAX_VALUE;
        this.width = 0;
        this.height = 0;
        if (x === undefined || y === undefined) {
            x = y = Number.MAX_VALUE;
            width = height = 0;
        }
        else {
            if (width === undefined) {
                width = 0;
            }
            if (height === undefined) {
                height = 0;
            }
        }
        this.x = x !== undefined ? x : Number.MAX_VALUE;
        this.y = y !== undefined ? y : Number.MAX_VALUE;
        this.width = width !== undefined ? width : 0;
        this.height = height !== undefined ? height : 0;
    }
    Rect.prototype.Rect = function (start, end) {
        this.x = Math.min(start.x, end.x);
        this.y = Math.min(start.y, end.y);
        this.width = Number(Math.max(start.x, end.x)) - Number(this.x);
        this.height = Number(Math.max(start.y, end.y)) - Number(this.y);
        return this;
    };
    Rect.Rect = function (start, end) {
        return this.Rect(start, end);
    };
    Rect.prototype.left = function () {
        return this.x;
    };
    Rect.prototype.right = function () {
        return this.x + this.width;
    };
    Rect.prototype.top = function () {
        return this.y;
    };
    Rect.prototype.bottom = function () {
        return Number((this.y + this.height).toFixed(4));
    };
    Rect.prototype.topLeft = function () {
        return new Point(this.left(), this.top());
    };
    Rect.prototype.topRight = function () {
        return new Point(this.right(), this.top());
    };
    Rect.prototype.bottomLeft = function () {
        return new Point(this.left(), this.bottom());
    };
    Rect.prototype.bottomRight = function () {
        return new Point(this.right(), this.bottom());
    };
    Rect.prototype.middleLeft = function () {
        return new Point(this.left(), this.y + this.height / 2);
    };
    Rect.prototype.middleRight = function () {
        return new Point(this.right(), this.y + this.height / 2);
    };
    Rect.prototype.topCenter = function () {
        return new Point(this.x + this.width / 2, this.top());
    };
    Rect.prototype.bottomCenter = function () {
        return new Point(this.x + this.width / 2, this.bottom());
    };
    Rect.prototype.center = function () {
        return new Point(this.x + this.width / 2, this.y + this.height / 2);
    };
    Rect.prototype.equals = function (rect1, rect2) {
        return rect1.x === rect2.x && rect1.y === rect2.y && rect1.width === rect2.width && rect1.height === rect2.height;
    };
    Rect.prototype.uniteRect = function (rect) {
        var right = Math.max(Number.NaN === this.right() || this.x === Number.MAX_VALUE ? rect.right() : this.right(), rect.right());
        var bottom = Math.max(Number.NaN === this.bottom() || this.y === Number.MAX_VALUE ? rect.bottom() : this.bottom(), rect.bottom());
        this.x = Math.min(this.left(), rect.left());
        this.y = Math.min(this.top(), rect.top());
        this.width = right - this.x;
        this.height = bottom - this.y;
        return this;
    };
    Rect.prototype.unitePoint = function (point) {
        if (this.x === Number.MAX_VALUE) {
            this.x = point.x;
            this.y = point.y;
            return;
        }
        var x = Math.min(this.left(), point.x);
        var y = Math.min(this.top(), point.y);
        var right = Math.max(this.right(), point.x);
        var bottom = Math.max(this.bottom(), point.y);
        this.x = x;
        this.y = y;
        this.width = right - this.x;
        this.height = bottom - this.y;
    };
    Rect.prototype.Inflate = function (padding) {
        this.x -= padding;
        this.y -= padding;
        this.width += padding * 2;
        this.height += padding * 2;
        return this;
    };
    Rect.prototype.intersects = function (rect) {
        if (this.right() < rect.left() || this.left() > rect.right() || this.top() > rect.bottom() || this.bottom() < rect.top()) {
            return false;
        }
        return true;
    };
    Rect.prototype.containsRect = function (rect) {
        return this.left() <= rect.left() && this.right >= rect.right && this.top() <= rect.top() && this.bottom >= rect.bottom;
    };
    Rect.prototype.containsPoint = function (point) {
        return this.left() <= point.x && this.right() >= point.x && this.top() <= point.y && this.bottom() >= point.y;
    };
    Rect.toBounds = function (pts) {
        var rect = new Rect();
        for (var _i = 0, pts_1 = pts; _i < pts_1.length; _i++) {
            var pt = pts_1[_i];
            rect.unitePoint(pt);
        }
        return rect;
    };
    Rect.prototype.round = function () {
        this.x = Math.round(this.x);
        this.width = Math.round(this.width);
        this.y = Math.round(this.y);
        this.height = Math.round(this.height);
        return this;
    };
    Rect.empty = new Rect(Number.MAX_VALUE, Number.MIN_VALUE, 0, 0);
    return Rect;
}());
var Stack = (function () {
    function Stack() {
        this.items = [];
    }
    Stack.prototype.Push = function (item) {
        this.items.push(item);
    };
    Stack.prototype.Pop = function () {
        return this.items.pop();
    };
    Stack.prototype.Peek = function () {
        return this.items[this.items.length - 1];
    };
    Stack.prototype.Clear = function () {
        this.items = [];
    };
    Stack.prototype.Count = function () {
        return this.items.length;
    };
    Stack.prototype.get = function (index) {
        return this.items[Number(index)];
    };
    return Stack;
}());
var Dictionary = (function () {
    function Dictionary() {
        this.keys = [];
        this.items = {};
        this.count = 0;
    }
    Dictionary.prototype.Items = function () {
        return this.items;
    };
    Dictionary.prototype.Dictionary = function (items, count, keys) {
        var ss = new Dictionary();
        ss.items = $.extend(false, {}, items);
        ss.count = count;
        ss.keys = keys;
        return ss;
    };
    Dictionary.prototype.Add = function (item, key) {
        if (key != undefined && item != undefined) {
            var obj = { key: key, value: item };
            this.items[this.count] = obj;
            this.keys.push(key);
            this.count++;
        }
    };
    Dictionary.prototype.Remove = function (key) {
        if (this.ContainsKey(key)) {
            var index = this.IndexOfKey(key);
            delete this.items[index];
            this.keys.splice(index, 1);
            this.count--;
            this.updateDic();
        }
    };
    Dictionary.prototype.updateDic = function () {
        var tempDict = {};
        var tempKeys = Object.keys(this.items);
        for (var i = 0; i < this.count; i++) {
            tempDict[i] = this.items[tempKeys[i]];
        }
        this.items = tempDict;
    };
    Dictionary.prototype.Update = function (key, value) {
        if (this.ContainsKey(key)) {
            var index = this.IndexOfKey(key);
            this.items[index].value = value;
        }
    };
    Dictionary.prototype.Clear = function () {
        this.items = {};
        this.count = 0;
        this.keys = [];
    };
    Dictionary.prototype.ContainsKey = function (key) {
        var index = this.keys.indexOf(key);
        if (index == -1)
            return false;
        else
            return true;
    };
    Dictionary.prototype.GetValue = function (key) {
        if (key != undefined && this.ContainsKey(key)) {
            var index = this.IndexOfKey(key);
            if (index != -1)
                return this.items[index].value;
        }
        return null;
    };
    Dictionary.prototype.IndexOfKey = function (key) {
        return this.keys.indexOf(key);
    };
    Dictionary.prototype.ElementAt = function (index) {
        if (index < this.keys.length)
            this.items[index].value;
        return null;
    };
    Dictionary.prototype.KeyAt = function (index) {
        return this.keys[index];
    };
    Dictionary.prototype.GetLength = function () {
        return this.keys.length;
    };
    Dictionary.prototype.Count = function () {
        return this.keys.length;
    };
    Dictionary.prototype.Clone = function () {
        return this.Dictionary(this.items, this.count, this.keys);
    };
    return Dictionary;
}());
var SortedList = (function () {
    function SortedList() {
        this.keys = [];
        this.items = {};
        this.count = 0;
    }
    SortedList.prototype.Items = function () {
        return this.items;
    };
    SortedList.prototype.SortedList = function (items, count, keys) {
        var ss = new SortedList();
        ss.items = $.extend(false, {}, items);
        ss.count = count;
        ss.keys = keys;
        return ss;
    };
    SortedList.prototype.Add = function (item, key) {
        if (key != undefined && item != undefined) {
            var obj = { key: key, value: item };
            this.items[key] = obj;
            this.keys = Object.keys(this.items);
            this.keys.sort(function (a, b) { return a - b; });
            this.count++;
        }
    };
    SortedList.prototype.Remove = function (key) {
        if (this.ContainsKey(key)) {
            delete this.items[key];
            this.keys = Object.keys(this.items);
            this.keys.sort(function (a, b) { return a - b; });
            this.count--;
        }
    };
    SortedList.prototype.Update = function (key, value) {
        if (this.ContainsKey(key)) {
            this.items[key].value = value;
        }
    };
    SortedList.prototype.Clear = function () {
        this.items = {};
        this.count = 0;
        this.keys = [];
    };
    SortedList.prototype.sortOnKeys = function () {
        var sorted = [];
        for (var key in this.items) {
            sorted[sorted.length] = key;
        }
        sorted.sort(function (a, b) { return a - b; });
        var tempDict = {};
        for (var i = 0; i < sorted.length; i++) {
            tempDict[sorted[i]] = this.items[sorted[i]];
        }
        this.items = tempDict;
    };
    SortedList.prototype.ContainsKey = function (key) {
        if (this.items.hasOwnProperty(key)) {
            return true;
        }
    };
    SortedList.prototype.GetValue = function (key) {
        if (key != undefined && this.items.hasOwnProperty(key)) {
            return this.items[key].value;
        }
    };
    SortedList.prototype.IndexOfKey = function (key) {
        var i = 0;
        this.keys.indexOf(key);
        for (var tempkey in this.keys) {
            if (this.keys[tempkey] == key) {
                return i;
            }
            i++;
        }
        return -1;
    };
    SortedList.prototype.ElementAt = function (index) {
        var i = 0;
        for (var tempkey in this.items) {
            if (i === index || index === tempkey) {
                return this.items[tempkey].value;
            }
            i++;
        }
        return null;
    };
    SortedList.prototype.KeyAt = function (index) {
        return Number(this.keys[index]);
    };
    SortedList.prototype.GetLength = function () {
        return this.keys.length;
    };
    SortedList.prototype.Count = function () {
        return this.keys.length;
    };
    SortedList.prototype.Clone = function () {
        return this.SortedList(this.items, this.count, this.keys);
    };
    return SortedList;
}());
var Tuple = (function () {
    function Tuple(item1, item2) {
        this._mT1 = item1;
        this._mT2 = item2;
    }
    Tuple.prototype.Item11 = function () {
        return this._mT1;
    };
    Tuple.prototype.Item2 = function () {
        return this._mT2;
    };
    return Tuple;
}());
var PolylinePoint = (function () {
    function PolylinePoint(point) {
        this.Point = point;
    }
    PolylinePoint.prototype.getPrev = function () {
        return this._mPrev;
    };
    PolylinePoint.prototype.setPrev = function (value) {
        this._mPrev = value;
    };
    PolylinePoint.prototype.getNext = function () {
        return this._mNext;
    };
    PolylinePoint.prototype.setNext = function (value) {
        this._mNext = value;
    };
    return PolylinePoint;
}());
var Segment = (function () {
    function Segment(start, end) {
        this.StartPoint = start;
        this.EndPoint = end;
    }
    Segment.prototype.Bounds = function () {
        return new Rect().Rect(this.StartPoint, this.EndPoint);
    };
    Segment.prototype.Contains = function (point) {
        var direction = this.StartPoint.FindDirection(this.EndPoint);
        switch (direction) {
            case Directions.East:
                return this.StartPoint.x <= point.x && point.x <= this.EndPoint.x;
            case Directions.West:
                return this.StartPoint.x >= point.x && point.x >= this.EndPoint.x;
            case Directions.North:
                return this.StartPoint.y <= point.y && point.y <= this.EndPoint.y;
            case Directions.South:
                return this.StartPoint.y >= point.y && point.y >= this.EndPoint.y;
        }
        return false;
    };
    return Segment;
}());
var SharedData = (function () {
    function SharedData() {
    }
    return SharedData;
}());
var ICoreGroupableInfo = (function () {
    function ICoreGroupableInfo() {
    }
    return ICoreGroupableInfo;
}());
var IObstacle = (function (_super) {
    __extends(IObstacle, _super);
    function IObstacle() {
        _super.apply(this, arguments);
    }
    return IObstacle;
}(ICoreGroupableInfo));
var SpatialSearching = (function () {
    function SpatialSearching() {
        this._pageLeft = 0;
        this._pageRight = 0;
        this._pageTop = 0;
        this._pageBottom = 0;
        this.childLeft = 0;
        this.childTop = 0;
        this.childRight = 0;
        this.childBottom = 0;
    }
    SpatialSearching.quadSize = 500;
    return SpatialSearching;
}());
var ObstacleTree = (function () {
    function ObstacleTree() {
        this.Rectangle = new Rect();
        this.ObstaclePadding = 0;
        this.startNode = null;
        this.endNode = null;
        this.lookupSegment = null;
        this.canRoute = true;
        this.hit = null;
    }
    ObstacleTree.prototype.InitObstacles = function (obstacles, padding, spatialSearch) {
        this.spatialSearch = spatialSearch;
        this.ObstaclePadding = padding;
        var i = 0;
        var obj;
        for (var m = 0; m < obstacles.size(); m++) {
            obj = obstacles.get(i);
            obj._obstacle = new Obstacle()._obstacle(obj._outerBounds, padding);
            if (m == 0) {
                this.Rectangle = obj._obstacle.getPaddedBounds();
            }
            else {
                this.Rectangle = this.Rectangle.uniteRect(obj._obstacle.getPaddedBounds());
            }
            obj._obstacle.CenterPort = new CenterPort(obj._obstacle.getPaddedBounds().center());
            i++;
        }
    };
    ObstacleTree.prototype.DisposeObstacles = function (obstacles) {
        for (var i in obstacles) {
            var obj = obstacles.get(i);
            if (obj._obstacle != null) {
                obj._obstacle = null;
            }
        }
        this.spatialSearch = null;
    };
    ObstacleTree.prototype.RestrictSegmentWithinFreeSpace = function (edge, segment, node, end) {
        if (end === void 0) { end = null; }
        return this.FindMaximumVisibility(segment, node, end);
    };
    ObstacleTree.prototype.FindNodesWhere = function (nodes, bounds) {
        var node;
        var newList = new List();
        for (var i = 0; i < nodes.length; i++) {
            node = nodes[i];
            if (node && node._obstacle != null) {
                var paddedBounds = node._obstacle.getPaddedBounds ? node._obstacle.getPaddedBounds() : null;
                if (paddedBounds != null && paddedBounds.intersects(bounds)) {
                    newList.add(node);
                }
            }
        }
        return newList;
    };
    ObstacleTree.prototype.FindNodes = function (bounds) {
        var nodes = new List();
        var quadObjects = new List();
        var quads = ej.datavisualization.Diagram.SpatialUtil.findQuads(this.spatialSearch, bounds);
        for (var i = 0; i < quads.length; i++) {
            var quad = quads[i];
            if (quad.objects.length > 0) {
                quadObjects = this.FindNodesWhere(quad.objects, bounds);
            }
            nodes = nodes.Concat(quadObjects);
        }
        return nodes;
    };
    ObstacleTree.prototype.FindMaximumVisibility = function (segment, start, end) {
        if (end === void 0) { end = null; }
        var hit;
        this.canRoute = true;
        var args = this.FindMaximumVisibility_hitNode(segment, start, end, hit);
        hit = args.hitNode;
        return args.canRoute;
    };
    ObstacleTree.prototype.FindMaximumVisibility_hitNode = function (segment, node, end, hitNode, ignoreLookup) {
        if (ignoreLookup === void 0) { ignoreLookup = false; }
        hitNode = null;
        if (!ignoreLookup) {
            this.lookupSegment = segment;
        }
        this.startNode = node;
        this.endNode = end;
        var direction = Extensions.FindDirection(segment.StartPoint, segment.EndPoint);
        if (direction != Directions.None) {
            var hit = this.FindFirstHit(this.spatialSearch.parentQuad, direction, segment.Bounds());
            if (hit != null && hit) {
                hitNode = hit;
                this.GetSegmentEnd(segment, direction, hit._obstacle);
            }
        }
        this.startNode = null;
        this.lookupSegment = null;
        return { canRoute: this.canRoute, hitNode: hitNode };
    };
    ObstacleTree.prototype.GetSegmentEnd = function (segment, direction, obstacle) {
        var endPoint = segment.EndPoint;
        if (obstacle != null) {
            switch (direction) {
                case Directions.East:
                    endPoint = new Point(obstacle.getPaddedBounds().left(), endPoint.y);
                    break;
                case Directions.West:
                    endPoint = new Point(obstacle.getPaddedBounds().right(), endPoint.y);
                    break;
                case Directions.North:
                    endPoint = new Point(endPoint.x, obstacle.getPaddedBounds().top());
                    break;
                case Directions.South:
                    endPoint = new Point(endPoint.x, obstacle.getPaddedBounds().bottom());
                    break;
            }
        }
        segment.EndPoint = endPoint.round();
    };
    ObstacleTree.prototype.FindFirstHit = function (quad, direction, rect) {
        var nodes = null;
        var quadToSearch = quad;
        switch (direction) {
            case Directions.East:
                nodes = this.FindIntersectingObjectsAtRight(quadToSearch, rect);
                break;
            case Directions.West:
                nodes = this.FindIntersectingObjectsAtLeft(quadToSearch, rect);
                break;
            case Directions.North:
                nodes = this.FindIntersectingObjectsAtBottom(quadToSearch, rect);
                break;
            case Directions.South:
                nodes = this.FindIntersectingObjectsAtTop(quadToSearch, rect);
                break;
        }
        if (nodes != null && nodes.size() > 0) {
            return this.FirstHitNode(nodes, direction);
        }
        return null;
    };
    ObstacleTree.prototype.FirstHitNode = function (nodes, direction) {
        var sortedCollection = null;
        switch (direction) {
            case Directions.East:
                sortedCollection = Utility.OrderBy(nodes, "left");
                break;
            case Directions.West:
                sortedCollection = Utility.OrderByDescending(nodes, "right");
                break;
            case Directions.South:
                sortedCollection = Utility.OrderByDescending(nodes, "bottom");
                break;
            case Directions.North:
                sortedCollection = Utility.OrderBy(nodes, "top");
                break;
        }
        return Extensions.ElementAt(sortedCollection, 0);
    };
    ObstacleTree.prototype.FindIntersectingObjectsAtRight = function (quad, rect, objects) {
        if (objects === void 0) { objects = null; }
        var count = objects != null ? objects.size() : 0;
        var foundAtFirstHalf = false;
        if (quad.first != null) {
            if (this.IsIntersects(quad.first, rect)) {
                objects = this.FindIntersectingObjectsAtRight(quad.first, rect, objects);
            }
        }
        if (quad.third != null) {
            if (this.IsIntersects(quad.third, rect)) {
                objects = this.FindIntersectingObjectsAtRight(quad.third, rect, objects);
            }
        }
        if (objects != null && objects.size() > 0 && count != objects.size()) {
            foundAtFirstHalf = true;
        }
        objects = this.GetIntersectingNodesInaQuad(quad, rect, objects);
        if (objects != null && objects.size() > 0) {
            if (foundAtFirstHalf) {
                return objects;
            }
            else {
                if (this.CheckForObjectsOnCenterline(quad, objects, Directions.East))
                    return objects;
            }
        }
        if (quad.second != null) {
            if (this.IsIntersects(quad.second, rect)) {
                objects = this.FindIntersectingObjectsAtRight(quad.second, rect, objects);
            }
        }
        if (quad.fourth != null) {
            if (this.IsIntersects(quad.fourth, rect)) {
                objects = this.FindIntersectingObjectsAtRight(quad.fourth, rect, objects);
            }
        }
        if (objects != null && objects.size() > 0) {
            return objects;
        }
        return null;
    };
    ObstacleTree.prototype.FindIntersectingObjectsAtLeft = function (quad, rect, objects) {
        if (objects === void 0) { objects = null; }
        var foundAtFirstHalf = false;
        var count = objects != null ? objects.size() : 0;
        if (quad.second != null) {
            if (this.IsIntersects(quad.second, rect)) {
                objects = this.FindIntersectingObjectsAtLeft(quad.second, rect, objects);
            }
        }
        if (quad.fourth != null) {
            if (this.IsIntersects(quad.fourth, rect)) {
                objects = this.FindIntersectingObjectsAtLeft(quad.fourth, rect, objects);
            }
        }
        if (objects != null && objects.size() > 0 && count != objects.size()) {
            foundAtFirstHalf = true;
        }
        objects = this.GetIntersectingNodesInaQuad(quad, rect, objects);
        if (objects != null && objects.size() > 0) {
            if (foundAtFirstHalf) {
                return objects;
            }
            else {
                if (this.CheckForObjectsOnCenterline(quad, objects, Directions.West))
                    return objects;
            }
        }
        if (quad.first != null) {
            if (this.IsIntersects(quad.first, rect)) {
                objects = this.FindIntersectingObjectsAtLeft(quad.first, rect, objects);
            }
        }
        if (quad.third != null) {
            if (this.IsIntersects(quad.third, rect)) {
                objects = this.FindIntersectingObjectsAtLeft(quad.third, rect, objects);
            }
        }
        if (objects != null && objects.size() > 0) {
            return objects;
        }
        return null;
    };
    ObstacleTree.prototype.FindIntersectingObjectsAtBottom = function (quad, rect, objects) {
        if (objects === void 0) { objects = null; }
        var foundAtFirstHalf = false;
        var count = objects != null ? objects.size() : 0;
        if (quad.first != null) {
            if (this.IsIntersects(quad.first, rect)) {
                objects = this.FindIntersectingObjectsAtBottom(quad.first, rect, objects);
            }
        }
        if (quad.second != null) {
            if (this.IsIntersects(quad.second, rect)) {
                objects = this.FindIntersectingObjectsAtBottom(quad.second, rect, objects);
            }
        }
        if (objects != null && objects.size() > 0 && count != objects.size()) {
            foundAtFirstHalf = true;
        }
        objects = this.GetIntersectingNodesInaQuad(quad, rect, objects);
        if (objects != null && objects.size() > 0) {
            if (foundAtFirstHalf) {
                return objects;
            }
            else {
                if (this.CheckForObjectsOnCenterline(quad, objects, Directions.North)) {
                    return objects;
                }
            }
        }
        if (quad.third != null) {
            if (this.IsIntersects(quad.third, rect)) {
                objects = this.FindIntersectingObjectsAtBottom(quad.third, rect, objects);
            }
        }
        if (quad.fourth != null) {
            if (this.IsIntersects(quad.fourth, rect)) {
                objects = this.FindIntersectingObjectsAtBottom(quad.fourth, rect, objects);
            }
        }
        if (objects != null && objects.size() > 0) {
            return objects;
        }
        return null;
    };
    ObstacleTree.prototype.FindIntersectingObjectsAtTop = function (quad, rect, objects) {
        if (objects === void 0) { objects = null; }
        var count = objects != null ? objects.size() : 0;
        var foundAtFirstHalf = false;
        if (quad.third != null) {
            if (this.IsIntersects(quad.third, rect)) {
                objects = this.FindIntersectingObjectsAtTop(quad.third, rect, objects);
            }
        }
        if (quad.fourth != null) {
            if (this.IsIntersects(quad.fourth, rect)) {
                objects = this.FindIntersectingObjectsAtTop(quad.fourth, rect, objects);
            }
        }
        if (objects != null && objects.size() > 0) {
            foundAtFirstHalf = true;
        }
        objects = this.GetIntersectingNodesInaQuad(quad, rect, objects);
        if (objects != null && objects.size() > 0 && count != objects.size()) {
            if (foundAtFirstHalf) {
                return objects;
            }
            else {
                if (this.CheckForObjectsOnCenterline(quad, objects, Directions.South)) {
                    return objects;
                }
            }
        }
        if (quad.first != null) {
            if (this.IsIntersects(quad.first, rect)) {
                objects = this.FindIntersectingObjectsAtTop(quad.first, rect, objects);
            }
        }
        if (quad.second != null) {
            if (this.IsIntersects(quad.second, rect)) {
                objects = this.FindIntersectingObjectsAtTop(quad.second, rect, objects);
            }
        }
        if (objects != null && objects.size() > 0) {
            return objects;
        }
        return null;
    };
    ObstacleTree.prototype.CheckForObjectsOnCenterline = function (quad, objects, direction) {
        if (direction == Directions.North) {
            var centerY = quad.top + quad.height / 2;
            for (var i = 0; i < objects.size(); i++) {
                var obj = objects.get(i);
                if (obj) {
                    var jsBounds = ej.datavisualization.Diagram.Util.bounds(obj);
                    var nBounds = new Rect(jsBounds.left, jsBounds.top, jsBounds.right - jsBounds.left, jsBounds.bottom - jsBounds.top);
                    if (obj._obstacle) {
                        obj._obstacle._outerBounds = nBounds;
                    }
                    else {
                        obj._obstacle = { OuterBounds: nBounds };
                    }
                }
                if (objects.get(i)._obstacle._outerBounds.top() <= centerY) {
                    return true;
                }
            }
        }
        else if (direction == Directions.South) {
            var centerY = quad.top + quad.height / 2;
            for (var i = 0; i < objects.size(); i++) {
                obj = objects.get(i);
                if (obj) {
                    var jsBounds = ej.datavisualization.Diagram.Util.bounds(obj);
                    var nBounds = new Rect(jsBounds.left, jsBounds.top, jsBounds.right - jsBounds.left, jsBounds.bottom - jsBounds.top);
                    if (obj._obstacle) {
                        obj._obstacle._outerBounds = nBounds;
                    }
                    else {
                        obj._obstacle = { OuterBounds: nBounds };
                    }
                }
                if (objects.get(i)._obstacle._outerBounds.bottom >= centerY) {
                    return true;
                }
            }
        }
        else if (direction == Directions.East) {
            var centerX = quad.left + quad.width / 2;
            for (var i = 0; i < objects.size(); i++) {
                obj = objects.get(i);
                if (obj) {
                    var jsBounds = ej.datavisualization.Diagram.Util.bounds(obj);
                    var nBounds = new Rect(jsBounds.left, jsBounds.top, jsBounds.right - jsBounds.left, jsBounds.bottom - jsBounds.top);
                    if (obj._obstacle) {
                        obj._obstacle._outerBounds = nBounds;
                    }
                    else {
                        obj._obstacle = { OuterBounds: nBounds };
                    }
                }
                if (objects.get(i)._obstacle._outerBounds.left <= centerX) {
                    return true;
                }
            }
        }
        else {
            var centerX = quad.left + quad.width / 2;
            for (var i = 0; i < objects.size(); i++) {
                obj = objects.get(i);
                if (obj) {
                    var jsBounds = ej.datavisualization.Diagram.Util.bounds(obj);
                    var nBounds = new Rect(jsBounds.left, jsBounds.top, jsBounds.right - jsBounds.left, jsBounds.bottom - jsBounds.top);
                    if (obj._obstacle) {
                        obj._obstacle._outerBounds = nBounds;
                    }
                    else {
                        obj._obstacle = { OuterBounds: nBounds };
                    }
                }
                if (objects.get(i)._obstacle._outerBounds.right >= centerX) {
                    return true;
                }
            }
        }
        return false;
    };
    ObstacleTree.prototype.GetIntersectingNodesInaQuad = function (quad, rect, nodes) {
        if (nodes === void 0) { nodes = null; }
        if (nodes == null)
            nodes = new List();
        for (var i in quad.objects) {
            var obj = quad.objects[i];
            if (obj && obj._obstacle != null) {
                var paddedBounds = obj._obstacle.getPaddedBounds ? obj._obstacle.getPaddedBounds() : null;
                if (paddedBounds != null && obj != this.startNode && obj != this.endNode && obj._obstacle.getPaddedBounds().intersects(rect)) {
                    if (this.lookupSegment != null && paddedBounds.containsPoint(this.lookupSegment.StartPoint)) {
                        this.canRoute = false;
                        nodes = null;
                        break;
                    }
                    nodes.add(obj);
                }
            }
        }
        return nodes;
    };
    ObstacleTree.prototype.IsIntersects = function (quad, rect) {
        if (quad.left > rect.right || quad.left + quad.width < rect.left || quad.top > rect.bottom || quad.top + quad.height < rect.top()) {
            return false;
        }
        return true;
    };
    return ObstacleTree;
}());
var LineRouting = (function () {
    function LineRouting() {
        this.KnownObstacles = null;
        this.VisibleConnectors = null;
        this.consideredRegion = Rect.empty;
        this.IsDirt = false;
        this.firstLoad = false;
        this.ObstaclePadding = 0;
        this.BendEquivalence = 0;
        this.Priority = RoutingPriority.Routing;
        this.loadingPriority = LoadingPriority.ImmediateLoading;
        this.visibleVertices = new List();
        this.visibleEdges = new List();
        this.selectorBounds = Rect.empty;
    }
    LineRouting.prototype.SetLineRoutingSettings = function () {
        var lineRoutingSettings = this._mSharedData.lineRoutingSettings != null ? this._mSharedData.lineRoutingSettings : new LineRoutingSettings();
        if (this.ObstaclePadding != lineRoutingSettings.obstaclePadding || this.Priority != lineRoutingSettings.priority || this.BendEquivalence != lineRoutingSettings.bendEquivalence || this.loadingPriority != lineRoutingSettings.loadingPriority) {
            this.IsDirt = true;
        }
        this.ObstaclePadding = lineRoutingSettings.obstaclePadding;
        this.BendEquivalence = lineRoutingSettings.bendEquivalence;
        this.Priority = lineRoutingSettings.priority;
        this.loadingPriority = lineRoutingSettings.loadingPriority;
    };
    LineRouting.prototype.RerouteConnectors = function (diagram, node) {
        if (diagram.nodes().length > 0 && diagram.connectors().length > 0) {
            var dgm = diagram;
            var selectedObject = node != null ? node : dgm.activeTool.selectedObject;
            var nodeBounds = ej.datavisualization.Diagram.Util.bounds(selectedObject);
            var nBounds = new Rect(nodeBounds.left, nodeBounds.top, nodeBounds.right - nodeBounds.left, nodeBounds.bottom - nodeBounds.top);
            var points, connector;
            var connName = "";
            for (var n = 0; n < diagram.connectors().length; n++) {
                connector = diagram.connectors()[n];
                if (connector && connName != connector.name) {
                    points = ej.datavisualization.Diagram.Util.getPoints(connector);
                    var pts = [];
                    for (var i = 0; i < points.length; i++) {
                        if ((i > 0 && !(pts[pts.length - 1].x == points[i].x && pts[pts.length - 1].y == points[i].y)) || i == 0) {
                            pts.push(new Point(Math.round(points[i].x), Math.round(points[i].y)));
                        }
                    }
                    connector = diagram.connectors()[n];
                    if (pts.length > 1) {
                        var first = pts[0];
                        for (var i = 1; i < pts.length; i++) {
                            var rect = new Rect().Rect(first, pts[i]);
                            if (rect.intersects(nBounds)) {
                                if (this.router.CanRoute(connector)) {
                                    this.routeEdge(connector, diagram);
                                    connName = connector.name;
                                    break;
                                }
                            }
                        }
                    }
                }
                if (this.router != null) {
                    this.router.ForceInvalidateRouter();
                }
            }
        }
    };
    LineRouting.prototype.Init = function (shared) {
        this._mSharedData = shared;
        this.SetLineRoutingSettings();
    };
    LineRouting.prototype.cloneConnector = function (line, diagram) {
        this._mSharedData = diagram;
        if (line.sourceNode && !line._sourceNodeInfo)
            line._sourceNodeInfo = diagram.nameTable[line.sourceNode];
        if (line.targetNode && !line._targetNodeInfo)
            line._targetNodeInfo = diagram.nameTable[line.targetNode];
        return line;
    };
    LineRouting.prototype.updateAllQuadObjects = function (parentQuad) {
        for (var i = 0; i < parentQuad.objects.length; i++) {
            var obj = parentQuad.objects[i];
            if (obj) {
                var jsBounds = ej.datavisualization.Diagram.Util.bounds(obj);
                var nBounds = new Rect(jsBounds.left, jsBounds.top, jsBounds.right - jsBounds.left, jsBounds.bottom - jsBounds.top);
                var pBounds = new Rect(jsBounds.x - this.ObstaclePadding, jsBounds.y - this.ObstaclePadding, (jsBounds.width + (2 * this.ObstaclePadding)), (jsBounds.height + (2 * this.ObstaclePadding)));
                if (!obj.segments) {
                    if (obj._obstacle) {
                        obj._obstacle._outerBounds = nBounds;
                    }
                    else {
                        obj._obstacle = { OuterBounds: nBounds };
                    }
                    obj._outerBounds = nBounds;
                    if (!obj._obstacle.CenterPort) {
                        obj._obstacle.CenterPort = new CenterPort(pBounds.center());
                    }
                }
            }
        }
    };
    LineRouting.prototype.routeEdge = function (connector, diagram) {
        connector = this.cloneConnector(connector, diagram);
        this.updateParentQuad(diagram, true, connector);
        this.router.RouteEdge(connector, diagram);
        diagram._resetConnectorPoints(connector, diagram);
    };
    LineRouting.prototype._checkFromSwimlane = function (node, diagram) {
        return diagram._checkFromSwimlane(node);
    };
    LineRouting.prototype._removeGroupChild = function (nodes, diagram) {
        var rNodes = [];
        for (var i = 0; i < nodes.length; i++) {
            var node = diagram.nameTable[diagram._getChild(nodes[i])];
            if (node && !this._checkFromSwimlane(node, diagram)) {
                rNodes.push(node);
            }
        }
        return rNodes;
    };
    LineRouting.prototype.GenerateVisibilityGraph = function (diagram, nodesLength) {
        this.router = new Router().Router(this.Priority, this.BendEquivalence, this.ObstaclePadding, diagram);
        var nodes = nodesLength ? diagram.nodes() : diagram._spatialSearch.parentQuad.objects;
        this.updateParentQuad(diagram);
        if (nodes.length > 0) {
            var rNodes = this._removeGroupChild(nodes, diagram);
            this.router.GenerateVisibilityGraph(rNodes, diagram._spatialSearch);
        }
        VisibilityGraphGeneration.setRouter(this.router);
    };
    LineRouting.prototype.updateParentQuad = function (diagram, isConnector, connector) {
        var spatialSearch = this._mSharedData;
        var parentQuad = diagram._spatialSearch.parentQuad;
        if (isConnector) {
            if (connector) {
                if (connector.targetNode) {
                    var targetNode = diagram.nameTable[connector.targetNode];
                    var targetBounds = ej.datavisualization.Diagram.Util.bounds(targetNode, true);
                }
                if (connector.sourceNode) {
                    var sourceNode = diagram.nameTable[connector.sourceNode];
                    var sourceBounds = ej.datavisualization.Diagram.Util.bounds(sourceNode, true);
                }
                var sourcePort = ej.datavisualization.Diagram.Util.findPortByName(sourceNode, connector.sourcePort);
                var targetPort = ej.datavisualization.Diagram.Util.findPortByName(targetNode, connector.targetPort);
                var targetPortLocation = ej.datavisualization.Diagram.Util._getPortPosition(targetPort, targetBounds);
                var sourcePortLocation = ej.datavisualization.Diagram.Util._getPortPosition(sourcePort, sourceBounds);
            }
            if (sourcePort) {
                var sourceDirection = ej.datavisualization.Diagram.Util._swapDirection(sourceNode.rotateAngle, ej.datavisualization.Diagram.Util._getDirection(sourceBounds, sourcePortLocation ? sourcePortLocation : sourceBounds.center));
                connector._sourcePortInfo = new IObstaclePort();
                if (sourceDirection === "left") {
                    connector._sourcePortInfo.Direction = PortDirection.Left;
                }
                else if (sourceDirection === "right") {
                    connector._sourcePortInfo.Direction = PortDirection.Right;
                }
                else if (sourceDirection === "bottom") {
                    connector._sourcePortInfo.Direction = PortDirection.Bottom;
                }
                else if (sourceDirection === "top") {
                    connector._sourcePortInfo.Direction = PortDirection.Top;
                }
                connector._sourcePortInfo.Location = new Point(Number((sourcePortLocation.x).toFixed(4)), Number((sourcePortLocation.y).toFixed(4)));
            }
            if (targetPort) {
                var targetDirection = ej.datavisualization.Diagram.Util._swapDirection(targetNode.rotateAngle, ej.datavisualization.Diagram.Util._getDirection(targetBounds, targetPortLocation ? targetPortLocation : targetBounds.center));
                connector._targetPortInfo = new IObstaclePort();
                if (targetDirection === "left") {
                    connector._targetPortInfo.Direction = PortDirection.Left;
                }
                else if (targetDirection === "right") {
                    connector._targetPortInfo.Direction = PortDirection.Right;
                }
                else if (targetDirection === "bottom") {
                    connector._targetPortInfo.Direction = PortDirection.Bottom;
                }
                else if (targetDirection === "top") {
                    connector._targetPortInfo.Direction = PortDirection.Top;
                }
                connector._targetPortInfo.Location = new Point(Number((targetPortLocation.x).toFixed(4)), Number((targetPortLocation.y).toFixed(4)));
            }
        }
        else {
            for (var i = 0; i < parentQuad.objects.length; i++) {
                var obj = parentQuad.objects[i];
                if (obj) {
                    var jsBounds = ej.datavisualization.Diagram.Util.bounds(obj);
                    var nBounds = new Rect(jsBounds.left, jsBounds.top, jsBounds.right - jsBounds.left, jsBounds.bottom - jsBounds.top);
                    var pBounds = new Rect(jsBounds.left - this.ObstaclePadding, jsBounds.top - this.ObstaclePadding, ((jsBounds.right - jsBounds.left) + (2 * this.ObstaclePadding)), ((jsBounds.bottom - jsBounds.top) + (2 * this.ObstaclePadding)));
                    if (obj._obstacle) {
                        obj._obstacle._outerBounds = nBounds;
                    }
                    else {
                        obj._obstacle = { OuterBounds: nBounds };
                    }
                    obj._outerBounds = nBounds;
                    obj._obstacle.CenterPort = new CenterPort(pBounds.center());
                }
            }
        }
    };
    LineRouting.prototype.AddNode = function (node) {
        if (this.router != null) {
            this.router.AddNode(node);
        }
    };
    LineRouting.prototype.RemoveNode = function (node) {
        if (this.router != null) {
            this.router.RemoveNode(node);
        }
    };
    LineRouting.prototype.SetObstacles = function (nodes, connectors) {
        this.KnownObstacles = nodes;
        this.VisibleConnectors = connectors;
    };
    return LineRouting;
}());
var LineRoutingSettings = (function () {
    function LineRoutingSettings() {
        this.bendEquivalence = 0;
        this.obstaclePadding = 0;
        this.bendEquivalence = 5;
        this.priority = RoutingPriority.Routing;
        this.obstaclePadding = 12;
        this.loadingPriority = LoadingPriority.DelayedDiagramLoading;
    }
    return LineRoutingSettings;
}());
var VertexQueue = (function () {
    function VertexQueue() {
        this.vertexQueue = new List();
        this.timeStamp = 0;
    }
    VertexQueue.prototype.getnextTimeStamp = function () {
        return ++this.timeStamp;
    };
    VertexQueue.prototype.Enqueue = function (vertex) {
        vertex.TimeStamp = this.getnextTimeStamp();
        this.Sort(vertex);
    };
    VertexQueue.prototype.Sort = function (entry) {
        var index = this.vertexQueue.size();
        this.vertexQueue.add(entry);
        if (index > 0) {
            while (index > 0 && this.vertexQueue.get(index >> 1).CompareTo(this.vertexQueue.get(index)) > 0) {
                var i = index >> 1;
                var temp = this.vertexQueue.get(i);
                this.vertexQueue.UpdateListValue(i, this.vertexQueue.get(index));
                this.vertexQueue.UpdateListValue(index, temp);
                index >>= 1;
            }
        }
    };
    VertexQueue.prototype.Dequeue = function () {
        var vertex = this.vertexQueue.get(0);
        this.MoveQueueOneStepForward(vertex);
        return vertex;
    };
    VertexQueue.prototype.MoveQueueOneStepForward = function (entry) {
        var count = this.vertexQueue.size() - 2;
        if (this.vertexQueue.size() > 1) {
            var last = this.vertexQueue.Last();
            this.vertexQueue.RemoveAt(this.vertexQueue.size() - 1);
            this.vertexQueue.UpdateListValue(0, last);
            var i = 0;
            while (true) {
                var smallest = i;
                var l = i << 1;
                if (l <= count && this.vertexQueue.get(l).CompareTo(this.vertexQueue.get(i)) < 0)
                    smallest = l;
                var r = l + 1;
                if (r <= count && this.vertexQueue.get(r).CompareTo(this.vertexQueue.get(smallest)) < 0)
                    smallest = r;
                if (smallest != i) {
                    this.SwapWithParent(smallest);
                }
                else {
                    break;
                }
                i = smallest;
            }
        }
        else {
            this.vertexQueue.RemoveAt(0);
        }
    };
    VertexQueue.prototype.DecreasePriority = function (entry, newPriority) {
        newPriority = Math.round(newPriority);
        var index = this.vertexQueue.IndexOf(entry);
        if (index == -1)
            return;
        var h = this.vertexQueue.get(index);
        h.Cost = newPriority;
        var i = index;
        while (i > 0) {
            if (this.vertexQueue.get(i).CompareTo(this.vertexQueue.get(i >> 1)) < 0) {
                this.SwapWithParent(i);
            }
            else {
                break;
            }
            ;
            i >>= 1;
        }
    };
    VertexQueue.prototype.SwapWithParent = function (i) {
        var parent = this.vertexQueue.get(i >> 1);
        this.vertexQueue.UpdateListValue(i >> 1, this.vertexQueue.get(i));
        this.vertexQueue.UpdateListValue(i, parent);
    };
    VertexQueue.prototype.Count = function () {
        return this.vertexQueue.size();
    };
    VertexQueue.prototype.ToString = function () {
        var build = "";
        for (var i = 0; i < this.vertexQueue.size(); i++) {
            var vertex = this.vertexQueue[i];
            build += ("{0}, ", vertex);
        }
        return build;
    };
    return VertexQueue;
}());
var Neighbor = (function () {
    function Neighbor() {
        this.Weight = 0;
        this.Clear();
    }
    Neighbor.prototype.Set = function (vertex, weight) {
        this.Vertex = vertex;
        this.Weight = weight;
    };
    Neighbor.prototype.Clear = function () {
        this.Vertex = null;
        this.Weight = Number.NaN;
    };
    return Neighbor;
}());
var NeighborSides = (function () {
    function NeighborSides() {
    }
    return NeighborSides;
}());
var ShortestPath = (function () {
    function ShortestPath(graph, bendEquivalence, target) {
        this.cancel = false;
        this.upperBoundCost = Number.MAX_VALUE;
        this.targetConnector = null;
        this.bendEquivalence = 0;
        this.bendsImportance = 1;
        this.lengthImportance = 1;
        this.visitedVertices = new List();
        this.queue = new VertexQueue();
        this.mode = RoutingSolution.Quick;
        this.neighbors = [new Neighbor(), new Neighbor(), new Neighbor()];
        this.visibilityGraph = graph;
        this.targetConnector = target;
        this.bendEquivalence = bendEquivalence;
    }
    ShortestPath.prototype.GetSingleStagePath = function (possibleEntries) {
        var bestEntry = this.FindPath(possibleEntries);
        var entries = this.GetEntries(bestEntry);
        var pts = this.GetPoints(entries);
        return pts;
    };
    ShortestPath.prototype.GetEntries = function (bestEntry) {
        var entries = new List();
        var lastEntryDirection = Directions.None;
        var colinearSegments = false;
        if (bestEntry != null) {
            while (bestEntry != null) {
                if (bestEntry.Direction != lastEntryDirection) {
                    entries.Insert(0, bestEntry);
                    lastEntryDirection = bestEntry.Direction;
                    colinearSegments = false;
                }
                else {
                    colinearSegments = true;
                }
                if (bestEntry.PreviousEntry == null) {
                    if (colinearSegments) {
                        entries.Insert(0, bestEntry);
                    }
                    break;
                }
                bestEntry = bestEntry.PreviousEntry;
            }
        }
        return entries;
    };
    ShortestPath.prototype.GetPoints = function (entries) {
        var points = new PointList();
        if (entries.size() > 0) {
            var last = entries.size() - 1;
            if (entries.size() > 4) {
                var count = entries.size();
                if (entries.get(count - 2).Direction == entries.get(count - 4).Direction) {
                    var source = entries.get(count - 4).Vertex;
                    var target = null;
                    var next = source.FindNextVertex(entries.get(count - 4).Direction);
                    while (next != null) {
                        target = next;
                        next = next.FindNextVertex(entries.get(count - 4).Direction);
                    }
                    if (target != null && this.targetConnector.TargetEntrance != null) {
                        var segment = new Segment(source.Point, target.Point);
                        var maxVisSegment = this.targetConnector.TargetEntrance.MaxVisibilitySegment;
                        if (maxVisSegment != null) {
                            var intersectingPt;
                            var args = Utility.SegmentIntersects(segment, maxVisSegment, intersectingPt);
                            intersectingPt = args.intersect;
                            if (args.isInterSect) {
                                points.add(intersectingPt);
                                points.add(entries.get(count - 1).Vertex.Point);
                                last = count - 5;
                            }
                        }
                    }
                }
            }
            for (var i = last; i >= 0; i--) {
                points.Insert(0, entries.get(i).Vertex.Point);
            }
        }
        return points;
    };
    ShortestPath.prototype.FindPath = function (possibleEntries) {
        var bestCost = Number.POSITIVE_INFINITY;
        var bestEntry = null;
        for (var i = 0; i < possibleEntries.size(); i++) {
            var path = possibleEntries.get(i);
            if (!this.cancel && (bestEntry == null || (path.getMinimalBend() < bestEntry.NumberOfBends
                || (path.getIsPreferred()
                    && path.getMinimalBend() == bestEntry.NumberOfBends)))) {
                var sourcePt = path.getSourceEntry().Point;
                var targetPt = path.getTargetEntry().Point;
                this.bendsImportance = Math.max(0.01, sourcePt.ManhattanDistance(targetPt) * (this.bendEquivalence * 0.01));
                this.mode = RoutingSolution.Best;
                var lastEntry = this.FindPath_Point(sourcePt, targetPt);
                if (lastEntry != null && (bestEntry == null || bestCost > lastEntry.Cost)) {
                    bestEntry = lastEntry;
                    bestCost = lastEntry.Cost;
                }
            }
            else {
                break;
            }
        }
        return bestEntry;
    };
    ShortestPath.prototype.FindPath_Point = function (source, target) {
        source.round();
        target.round();
        this.InitializePath(source, target);
        var targetVertex = this.visibilityGraph.FindVertex(target);
        var bestEntry;
        var bestVertex;
        var w = 0;
        while (this.queue.Count() > 0) {
            if (this.cancel)
                break;
            w++;
            bestEntry = this.queue.Dequeue();
            bestVertex = bestEntry.Vertex;
            if (targetVertex == bestVertex) {
                this.Cleanup();
                return bestEntry;
            }
            bestEntry.Closed = true;
            var neighbor;
            for (var k = 0; k < this.neighbors.length; k++) {
                neighbor = this.neighbors[k];
                neighbor.Clear();
            }
            var preferredDirection = Extensions.Right(bestEntry.Direction);
            if (preferredDirection != Directions.None) {
                this.ExtendPathAlongInEdges(bestEntry, preferredDirection);
                this.ExtendPathAlongOutEdges(bestEntry, preferredDirection);
                for (var s = 0; s < this.neighbors.length; s++) {
                    neighbor = this.neighbors[s];
                    if (neighbor.Vertex != null) {
                        this.ExtendPathToNeighborVertex(bestEntry, neighbor.Vertex, neighbor.Weight);
                    }
                }
            }
        }
        this.Cleanup();
        return null;
    };
    ShortestPath.prototype.InitializePath = function (source, target) {
        this.queue = new VertexQueue();
        var sourceVertex = this.visibilityGraph.FindVertex(source);
        var targetVertex = this.visibilityGraph.FindVertex(target);
        this.Source = sourceVertex;
        this.InitEntryDirectionsAtTarget(targetVertex);
        if (sourceVertex != null) {
            var entry = new VertexEntry(sourceVertex, null, 0, 0, 0);
            entry.Closed = true;
            this.EnqueueOutEdges(entry);
            this.EnqueueInEdges(entry);
        }
    };
    ShortestPath.prototype.ExtendPathAlongInEdges = function (source, preferredDirection) {
        var inEdge = source.Vertex.getWestEdge();
        if (inEdge != null)
            this.ExtendPathAlongEdge(source, inEdge.getSource(), inEdge, preferredDirection);
        inEdge = source.Vertex.getSouthEdge();
        if (inEdge != null)
            this.ExtendPathAlongEdge(source, inEdge.getSource(), inEdge, preferredDirection);
    };
    ShortestPath.prototype.ExtendPathAlongOutEdges = function (source, preferredDirection) {
        var outEdge = source.Vertex.getEastEdge();
        if (outEdge != null)
            this.ExtendPathAlongEdge(source, outEdge.getTarget(), outEdge, preferredDirection);
        outEdge = source.Vertex.getNorthEdge();
        if (outEdge != null)
            this.ExtendPathAlongEdge(source, outEdge.getTarget(), outEdge, preferredDirection);
    };
    ShortestPath.prototype.ExtendPathAlongEdge = function (source, neighborVertex, edge, preferredDirections) {
        if (source.PreviousEntry == null || neighborVertex != source.PreviousEntry.Vertex) {
            var neighbor = this.neighbors[2];
            var neighborDirection = source.Vertex.Point.FindDirection(neighborVertex.Point);
            if (neighborDirection != source.Direction) {
                neighbor = this.neighbors[neighborDirection == preferredDirections ? 1 : 0];
            }
            neighbor.Set(neighborVertex, edge.getWeight());
        }
        else if (neighborVertex == source.PreviousEntry.Vertex) {
            if (source.Vertex.getDegree() > 1 || source.Vertex != this.Source) {
                this.ExtendPathToNeighborVertex(source, neighborVertex, edge.getWeight());
            }
        }
    };
    ShortestPath.prototype.EnqueueEdges = function (vertexEntry, edge, edgeDirection) {
        var weight = edge.getWeight();
        if ((this.EntryDirectionsToTarget & edge.getSourcePoint().FindDirection(edge.getTargetPoint())) == 0)
            weight = 1.5;
        var target = null;
        switch (edgeDirection) {
            case Directions.East:
            case Directions.North:
                target = edge.getTarget();
                break;
            case Directions.West:
            case Directions.South:
                target = edge.getSource();
                break;
        }
        this.ExtendPathToNeighborVertex(vertexEntry, target, weight);
    };
    ShortestPath.prototype.EnqueueOutEdges = function (source) {
        var sourceVertex = source.Vertex;
        if (sourceVertex.getEastEdge() != null)
            this.EnqueueEdges(source, sourceVertex.getEastEdge(), Directions.East);
        if (sourceVertex.getNorthEdge() != null)
            this.EnqueueEdges(source, sourceVertex.getNorthEdge(), Directions.North);
    };
    ShortestPath.prototype.EnqueueInEdges = function (source) {
        var sourceVertex = source.Vertex;
        if (sourceVertex.getWestEdge() != null)
            if (source.PreviousEntry == null || sourceVertex.getWestEdge().getSource() != source.PreviousEntry.Vertex)
                this.EnqueueEdges(source, sourceVertex.getWestEdge(), Directions.West);
        if (sourceVertex.getSouthEdge() != null)
            if (source.PreviousEntry == null || sourceVertex.getSouthEdge().getSource() != source.PreviousEntry.Vertex)
                this.EnqueueEdges(source, sourceVertex.getSouthEdge(), Directions.South);
    };
    ShortestPath.prototype.ExtendPathToNeighborVertex = function (source, neighborVertex, weight) {
        var direction = source.Vertex.Point.FindDirection(neighborVertex.Point);
        var neighborEntry = null;
        if (neighborVertex.VertexEntries != null)
            neighborEntry = neighborVertex.VertexEntries[Extensions.ToIndex(direction)];
        if (neighborEntry == null) {
            if (!this.CheckExistingReverseEntry(source, neighborVertex, weight))
                this.CreateAndEnqueueEntryToNeighborVertex(source, neighborVertex, weight);
        }
        else if (!neighborEntry.Closed && this.mode != RoutingSolution.Quick) {
            var args = this.UpdateEntryToNeighborVertexIfNeeded(source, neighborEntry, weight);
            weight = args.weight;
        }
    };
    ShortestPath.prototype.UpdateEntryToNeighborVertexIfNeeded = function (bestEntry, neigEntry, weight) {
        var numberOfBends = 0;
        var length = 0;
        var args = this.UpdatePathLength(bestEntry, neigEntry.Vertex, weight, numberOfBends, length);
        var dirToNeighbor = args.direction;
        weight = args.weight;
        numberOfBends = args.bends;
        length = args.length;
        if (this.CombinedCost(length, numberOfBends) < this.CombinedCost(neigEntry.Length, neigEntry.NumberOfBends)) {
            var newCost = this.CombinedCost(length, numberOfBends) + this.HeuristicDistanceFromVertexToTarget(neigEntry.Vertex.Point, dirToNeighbor);
            neigEntry.ResetEntry(bestEntry, newCost, numberOfBends, length);
            this.queue.DecreasePriority(neigEntry, newCost);
        }
        return { weight: weight };
    };
    ShortestPath.prototype.CreateAndEnqueueEntryToNeighborVertex = function (source, neighborVertex, weight) {
        var length = 0;
        var bends = 0;
        var args = this.UpdatePathLength(source, neighborVertex, weight, bends, length);
        var direction = args.direction;
        weight = args.weight;
        bends = args.bends;
        length = args.length;
        var cost = this.CombinedCost(length, bends) + this.HeuristicDistanceFromVertexToTarget(neighborVertex.Point, direction);
        if (cost < this.upperBoundCost) {
            if (neighborVertex.VertexEntries == null) {
                this.visitedVertices.add(neighborVertex);
            }
            this.EnqueueVertex(neighborVertex, source, length, cost, bends);
        }
    };
    ShortestPath.prototype.ToIndex = function (direction) {
        switch (direction) {
            case Directions.North:
                return 0;
            case Directions.East:
                return 1;
            case Directions.South:
                return 2;
            case Directions.West:
                return 3;
            default:
                break;
        }
    };
    ShortestPath.prototype.CheckExistingReverseEntry = function (bestEntry, neighbor, weight) {
        if (bestEntry.Vertex.VertexEntries != null) {
            var reverseDirection = neighbor.Point.FindDirection(bestEntry.Vertex.Point);
            if (reverseDirection != Directions.None) {
                var reverseEntry = bestEntry.Vertex.VertexEntries[this.ToIndex(reverseDirection)];
                if (reverseEntry != null) {
                    this.CheckTheNeedOfReverseEntry(bestEntry, reverseEntry, weight);
                    return true;
                }
            }
        }
        return false;
    };
    ShortestPath.prototype.CheckTheNeedOfReverseEntry = function (bestEntry, reverseEntry, weight) {
        var bends = 0;
        var length = 0;
        var neighborVertex = reverseEntry.PreviousEntry.Vertex;
        var args = this.UpdatePathLength(bestEntry, neighborVertex, weight, bends, length);
        var direction = args.direction;
        weight = args.weight;
        bends = args.bends;
        length = args.length;
        if (direction != Directions.None) {
            if (this.CombinedCost(length, bends) < this.CombinedCost(reverseEntry.Length, reverseEntry.NumberOfBends)) {
                var cost = this.CombinedCost(length, bends) + this.HeuristicDistanceFromVertexToTarget(neighborVertex.Point, direction);
                this.EnqueueVertex(neighborVertex, bestEntry, length, cost, bends);
            }
        }
    };
    ShortestPath.prototype.CombinedCost = function (length, bends) {
        return Number((this.bendsImportance * bends + this.lengthImportance * length).toFixed(4));
    };
    ShortestPath.prototype.UpdatePathLength = function (previous, current, weight, bends, length) {
        var direction = previous.Vertex.Point.FindDirection(current.Point);
        if (this.mode == RoutingSolution.Quick) {
            length = 0;
            bends = previous.NumberOfBends;
            var preferedDirection = current.Point.FindDirection(this.Target.Point);
            var priority = 0;
            if (previous.Direction != Directions.None) {
                if ((direction & preferedDirection) != Directions.None) {
                    if (previous.Direction == direction) {
                        priority = 0;
                    }
                    else {
                        priority = 0;
                    }
                }
                else {
                    priority = 2;
                }
            }
            bends += priority;
        }
        else {
            length = previous.Length + previous.Vertex.Point.ManhattanDistance(current.Point) * weight;
            bends = previous.NumberOfBends;
            if (previous.Direction != Directions.None && previous.Direction != direction) {
                bends++;
            }
        }
        return { direction: direction, weight: weight, bends: bends, length: length };
    };
    ShortestPath.prototype.EnqueueVertex = function (vertex, previous, length, cost, bends) {
        var entry = new VertexEntry(vertex, previous, length, bends, cost);
        this.queue.Enqueue(entry);
        vertex.SetVertexEntry(entry);
        return entry;
    };
    ShortestPath.prototype.InitEntryDirectionsAtTarget = function (vertex) {
        this.Target = vertex;
        this.EntryDirectionsToTarget = Directions.None;
        if (vertex.getEastEdge() != null)
            this.EntryDirectionsToTarget = this.EntryDirectionsToTarget || Directions.East;
        if (vertex.getNorthEdge() != null)
            this.EntryDirectionsToTarget = this.EntryDirectionsToTarget || Directions.North;
        if (vertex.getWestEdge() != null)
            this.EntryDirectionsToTarget = this.EntryDirectionsToTarget || Directions.West;
        if (vertex.getSouthEdge() != null)
            this.EntryDirectionsToTarget = this.EntryDirectionsToTarget || Directions.South;
        return this.EntryDirectionsToTarget != Directions.None;
    };
    ShortestPath.prototype.HeuristicDistanceFromVertexToTarget = function (point, entryDirToVertex) {
        var vectorToTarget = this.Target.Point.subtract(point);
        var dirToTarget = Extensions.VectorDirection(vectorToTarget);
        if (vectorToTarget.equals(new Point(0, 0)))
            return 0;
        var numberOfBends = 0;
        if (entryDirToVertex == Directions.None) {
            entryDirToVertex = Directions.East | Directions.North | Directions.West | Directions.South;
            numberOfBends = this.GetNumberOfBends(entryDirToVertex, dirToTarget);
        }
        else {
            numberOfBends = this.GetNumberOfBends(entryDirToVertex, dirToTarget);
        }
        return this.CombinedCost(point.ManhattanDistance(this.Target.Point), numberOfBends);
    };
    ShortestPath.prototype.GetNumberOfBends = function (entryDirToVertex, dirToTarget) {
        return Extensions.IsPureDirection(dirToTarget) ? this.GetNumberOfBendsForPureDirection(entryDirToVertex, dirToTarget) : ShortestPath.GetBendsForNotPureDirection(dirToTarget, entryDirToVertex, this.EntryDirectionsToTarget);
    };
    ShortestPath.prototype.GetNumberOfBendsForPureDirection = function (entryDirToVertex, dirToTarget) {
        if ((dirToTarget & entryDirToVertex) == dirToTarget) {
            if (Extensions.Contains(this.EntryDirectionsToTarget, dirToTarget)) {
                return 0;
            }
            if (Extensions.Contains(this.EntryDirectionsToTarget, Extensions.Left(dirToTarget)) || Extensions.Contains(this.EntryDirectionsToTarget, Extensions.Right(dirToTarget))) {
                return 2;
            }
            return 4;
        }
        return this.GetNumberOfBendsForPureDirection(ShortestPath.AddOneTurn[entryDirToVertex], dirToTarget) + 1;
    };
    ShortestPath.GetBendsForNotPureDirection = function (dirToTarget, entryDirToVertex, entryDirectionsToTarget) {
        var a = dirToTarget & entryDirToVertex;
        if (entryDirToVertex != Directions.None) {
            if (a == Directions.None) {
                return 1;
            }
            var b = dirToTarget & entryDirectionsToTarget;
            if (b == Directions.None) {
                return 2;
            }
            return a == dirToTarget ? 1 : 2;
        }
        return this.GetBendsForNotPureDirection(dirToTarget, ShortestPath.AddOneTurn[entryDirToVertex], ShortestPath.AddOneTurn[entryDirectionsToTarget]) + 1;
    };
    ShortestPath.prototype.Cleanup = function () {
        for (var i = 0; i < this.visitedVertices.size(); i++) {
            this.visitedVertices.get(i).RemoveVertexEntries();
        }
        this.visitedVertices.Clear();
        this.queue = null;
    };
    ShortestPath.prototype.CancelRouting = function () {
        this.cancel = true;
    };
    ShortestPath.AddOneTurn = new Array(Directions.None, Directions.North | Directions.East | Directions.West, Directions.North | Directions.East | Directions.South, 15, Directions.East | Directions.South | Directions.West, 15, 15, 15, 13, 15, 15, 15, 15, 15, 15, 15);
    return ShortestPath;
}());
var Router = (function () {
    function Router() {
        this.obstaclesToAdd = new List();
        this.obstaclesToRemove = new List();
        this.BendEquivalence = 0;
        this.ObstaclePadding = 0;
        this.cancel = false;
        this.graph = null;
        this.obstacleTree = null;
        this.portManager = null;
        this.isAddingObstacle = false;
        this.isRemovingObstacle = false;
        this.Priority = RoutingPriority.Default;
        this.BendEquivalence = 5;
        this.ObstaclePadding = 12;
        this.horizontalSegmentTree = new SegmentTree(false, this);
        this.verticalSegmentTree = new SegmentTree(true, this);
        this.horizontalSegmentTree.setPerpendicularTree(this.verticalSegmentTree);
        this.verticalSegmentTree.setPerpendicularTree(this.horizontalSegmentTree);
        this.vertexToRemove = {};
    }
    Router.prototype.getHorizontalSegmentTree = function () {
        return this.horizontalSegmentTree;
    };
    Router.prototype.getVerticalSegmentTree = function () {
        return this.verticalSegmentTree;
    };
    Router.prototype.Router = function (priority, bendEquivalence, padding, diag) {
        this.diagram = diag;
        this.Priority = priority;
        this.BendEquivalence = bendEquivalence;
        this.ObstaclePadding = padding;
        this.horizontalSegmentTree = new SegmentTree(false, this);
        this.verticalSegmentTree = new SegmentTree(true, this);
        this.horizontalSegmentTree.setPerpendicularTree(this.verticalSegmentTree);
        this.verticalSegmentTree.setPerpendicularTree(this.horizontalSegmentTree);
        return this;
    };
    Router.prototype.MinimumSegmentLength = function (points) {
        if (points.size() > 1) {
            var start1 = points.ElementAt(0);
            var start2 = points.ElementAt(points.size() - 2);
            var end1 = points.ElementAt(1);
            var end2 = points.ElementAt(points.size() - 1);
            var length1 = Extensions.FindDistance(start1, end1, Extensions.GetOrientation(Extensions.FindDirection(start1, end1)));
            var length2 = Extensions.FindDistance(start2, end2, Extensions.GetOrientation(Extensions.FindDirection(start2, end2)));
            return Math.min(Number(Math.round(length1).toFixed(4)), Number(Math.round(length2).toFixed(4)));
        }
        return 0;
    };
    Router.prototype.IsMinimalPointCollection = function (points) {
        if (points.size() > 1) {
            var start1 = points.ElementAt(0);
            var start2 = points.ElementAt(points.size() - 2);
            var end1 = points.ElementAt(1);
            var end2 = points.ElementAt(points.size() - 1);
            var orientation1 = Extensions.GetOrientation(start1.FindDirection(end1));
            var orientation2 = Extensions.GetOrientation(start2.FindDirection(end2));
            if (orientation1 == orientation2 && points.size() <= 4)
                return true;
            else if (orientation1 != orientation2 && points.size() == 3)
                return true;
        }
        return false;
    };
    Router.prototype.GenerateVisibilityGraph = function (nodes, spatialSearch) {
        this.currentBounds = Rect.empty;
        var obstacles = new List();
        this.obstacleTree = new ObstacleTree();
        this.obstacleTree.InitObstacles(obstacles, this.ObstaclePadding, spatialSearch);
        this.graph = new VisibilityGraph();
        var targetGeometry = new EdgeGeometry();
        this.portManager = new PortManager(this.horizontalSegmentTree, this.verticalSegmentTree, this.obstacleTree, this.graph, targetGeometry, this.ObstaclePadding);
        this.pathfinder = new ShortestPath(this.graph, this.BendEquivalence, targetGeometry);
        if (nodes.length > 0) {
            for (var i = 0; i < nodes.length; i++) {
                nodes[i]._obstacle = null;
                this.AddNode(nodes[i]);
            }
            this.InvalidateRouter();
        }
    };
    Router.prototype.RouteEdge = function (edge, diagram) {
        this.diagram = diagram;
        var currentSegPoints = new PointList();
        var newSegPoints = new PointList();
        this.InvalidateRouter();
        var args = this.portManager.IsCurrentConnectionSegmentsValid(edge, currentSegPoints);
        currentSegPoints = args.points;
        if (this.CanRoute(edge) && edge._sourceNodeInfo != null && edge._targetNodeInfo != null) {
            {
                this.portManager.temporaryAddition = true;
                var intersectingPoints = this.portManager.GetPortVisibilityIntersection(edge);
                if (intersectingPoints == null || !(intersectingPoints.size() > 0)) {
                    if (this.portManager.AddControlPointsToGraph(edge)) {
                        var srcPort = edge._sourcePortInfo ? edge._sourcePortInfo : edge._sourceNodeInfo._obstacle.CenterPort;
                        var tarPort = edge._targetPortInfo ? edge._targetPortInfo : edge._targetNodeInfo._obstacle.CenterPort;
                        newSegPoints = this.pathfinder.GetSingleStagePath(this.GetPossibleEntries(srcPort, tarPort));
                    }
                }
                else {
                    newSegPoints = intersectingPoints;
                    if (newSegPoints.size() == 0)
                        edge._points = newSegPoints;
                }
                if (newSegPoints.size() > 0) {
                    if (currentSegPoints.size() > 0) {
                        if (newSegPoints.size() < currentSegPoints.size()) {
                            edge._points = newSegPoints;
                        }
                        else if (newSegPoints.size() > currentSegPoints.size()) {
                            edge._points = currentSegPoints;
                        }
                        else {
                            var curSegLength = this.MinimumSegmentLength(currentSegPoints);
                            var newSegLength = this.MinimumSegmentLength(newSegPoints);
                            if (curSegLength < this.ObstaclePadding && curSegLength < newSegLength) {
                                edge._points = newSegPoints;
                            }
                            else {
                                var newLength = Extensions.GetLengthFromListOfPoints(newSegPoints);
                                var curLength = Extensions.GetLengthFromListOfPoints(currentSegPoints);
                                if (newLength <= curLength) {
                                    edge._points = newSegPoints;
                                }
                                else
                                    edge._points = currentSegPoints;
                            }
                        }
                    }
                    else {
                        edge._points = newSegPoints;
                    }
                }
            }
        }
        else if (this.CanRoute(edge) && (edge._sourceNodeInfo != null || edge._targetNodeInfo != null)) {
            this.portManager.temporaryAddition = true;
            var sourcePort = edge._sourcePortInfo;
            var targetPort = edge._targetPortInfo;
            if (sourcePort == null && edge._sourceNodeInfo instanceof IObstacle)
                sourcePort = edge._sourceNodeInfo._obstacle.CenterPort;
            else
                sourcePort = edge._sourcePointInfo;
            if (targetPort == null && edge._targetNodeInfo instanceof IObstacle) {
                targetPort = edge._targetNodeInfo._obstacle.CenterPort;
            }
            else
                targetPort = edge._targetPointInfo;
            var targetPortLocation = targetPort.getLocation();
            targetPort.setLocation(this.portManager.GetValidPortLocation(targetPortLocation));
            if (this.portManager.AddControlPointsToGraph(edge)) {
                edge._points = this.pathfinder.GetSingleStagePath(this.GetPossibleEntries(sourcePort, targetPort));
                if (edge._points != null && edge._points.Count > 0) {
                    edge._points.RemoveAt(edge._points.Count - 1);
                    edge._points.Insert(edge._points.Count, targetPortLocation);
                }
            }
            else {
                edge._points = currentSegPoints;
            }
        }
        else {
            edge._points = new PointList();
        }
        this.portManager.RemoveEdgeGeometryFromGraph();
        this.portManager.temporaryAddition = false;
    };
    Router.prototype.CanRoute = function (connector) {
        if (ej.datavisualization.Diagram.Util.canRouteConnector(connector, this.diagram)) {
            if (connector.sourcePort != null && connector.targetPort != null) {
                var sourcePort = connector.sourcePort;
                var targetPort = connector.sourcePort;
                var sourcePoint = new Point(connector.sourcePoint.x, connector.sourcePoint.y);
                var targetPoint = new Point(connector.targetPoint.x, connector.targetPoint.y);
                var source = new Rect().Rect(new Point(sourcePoint.x, sourcePoint.y), new Point(sourcePoint.x, sourcePoint.y));
                var target = new Rect().Rect(new Point(targetPoint.x, targetPoint.y), new Point(targetPoint.x, targetPoint.y));
                source = source.Inflate(this.ObstaclePadding);
                target = target.Inflate(this.ObstaclePadding);
                if (source.intersects(target))
                    return false;
            }
            return true;
        }
    };
    Router.prototype.AddVertex = function (point) {
        var vertex = this.graph.AddVertex(point);
        if (Extensions.Count(this.vertexToRemove) != 0) {
            if (Extensions.ContainsKey(this.vertexToRemove, vertex.Point))
                Extensions.Remove(this.vertexToRemove, vertex.Point);
        }
        return vertex;
    };
    Router.prototype.GetMaximumVisibility = function (start, direction) {
        if (direction != Directions.None) {
            var endPoint;
            if (direction == Directions.West) {
                endPoint = new Point(this.currentBounds.x, start.y);
            }
            else if (direction == Directions.East) {
                endPoint = new Point(this.currentBounds.right(), start.y);
            }
            else if (direction == Directions.South) {
                endPoint = new Point(start.x, this.currentBounds.top());
            }
            else {
                endPoint = new Point(start.x, this.currentBounds.bottom());
            }
            var segment = new Segment(start, endPoint);
            if (this.obstacleTree.FindMaximumVisibility(segment, this.currentNode)) {
                if (Extensions.IsAscending(direction)) {
                    return new Segment(segment.StartPoint, segment.EndPoint);
                }
                else
                    return new Segment(segment.EndPoint, segment.StartPoint);
            }
        }
        return null;
    };
    Router.prototype.ResetDependentCollection = function () {
        for (var key in this.vertexToRemove) {
            var vertex = Extensions.ElementAt(this.vertexToRemove, key);
            this.graph.RemoveVertex(vertex);
        }
        this.vertexToRemove = Extensions.Clear(this.vertexToRemove);
        this.horizontalSegmentTree.getCoordsToReconstruct().Clear();
        this.verticalSegmentTree.getCoordsToReconstruct().Clear();
    };
    Router.prototype.InvalidateRouter = function () {
        while (this.obstaclesToRemove.size()) {
            var obstacle = this.obstaclesToRemove.get(0);
            this.obstaclesToRemove.RemoveAt(0);
            this.RemoveObstacleforNode(obstacle);
        }
        while (this.obstaclesToAdd.size()) {
            var obstacle = this.obstaclesToAdd.get(0);
            this.obstaclesToAdd.RemoveAt(0);
            this.AddObstacleforNode(obstacle);
        }
    };
    Router.prototype.ForceInvalidateRouter = function () {
        this.InvalidateRouter();
    };
    Router.prototype.AddNode = function (node) {
        if (!this.obstaclesToAdd.contains(node)) {
            if (node._obstacle == null || this.obstaclesToRemove.contains(node)) {
                this.obstaclesToAdd.add(node);
            }
        }
    };
    Router.prototype.RemoveNode = function (node) {
        if (node._obstacle != null && !this.obstaclesToRemove.contains(node)) {
            this.obstaclesToRemove.add(node);
        }
    };
    Router.prototype.AddObstacleforNode = function (node) {
        this.portManager.temporaryAddition = false;
        this.isAddingObstacle = true;
        this.ResetDependentCollection();
        var jsBounds = ej.datavisualization.Diagram.Util.bounds(node);
        var nBounds = new Rect(jsBounds.left, jsBounds.top, jsBounds.right - jsBounds.left, jsBounds.bottom - jsBounds.top);
        var obstacleTreeBounds = this.obstacleTree.Rectangle;
        if (node._obstacle == null && !(nBounds.width == 0) && !(nBounds.height == 0)) {
            this.currentNode = node;
            node._obstacle = new Obstacle()._obstacle(nBounds, this.ObstaclePadding);
            var x = 0, y = 0, right = 0, bottom = 0;
            if (node._obstacle.getPaddedBounds() != null) {
                nBounds = node._obstacle.getPaddedBounds().round();
                x = Utility.ToRoundedInt(nBounds.left());
                y = Utility.ToRoundedInt(nBounds.top());
                right = Utility.ToRoundedInt(nBounds.right());
                bottom = Utility.ToRoundedInt(nBounds.bottom());
                var trimValue = 0;
                if (trimValue != 0) {
                    x += x % trimValue != 0 ? trimValue - (x % trimValue) : 0;
                    y += y % trimValue != 0 ? trimValue - (y % trimValue) : 0;
                    right -= right % trimValue != 0 ? right % trimValue : 0;
                    bottom -= bottom % trimValue != 0 ? bottom % trimValue : 0;
                    nBounds = new Rect(x, y, right - x, bottom - y);
                    node._obstacle.setPaddedBounds(nBounds);
                }
                node._outerBounds = nBounds;
                node._obstacle.CenterPort = new CenterPort(node._obstacle.getPaddedBounds().center());
            }
            if (this.verticalSegmentTree.getVectors().Count() != 0 && this.horizontalSegmentTree.getVectors().Count() != 0) {
                x = Math.min(this.horizontalSegmentTree.getStart(), x);
                y = Math.min(this.verticalSegmentTree.getStart(), y);
                right = Math.max(this.horizontalSegmentTree.getEnd(), right);
                bottom = Math.max(this.verticalSegmentTree.getEnd(), bottom);
            }
            if (x < obstacleTreeBounds.left() || right > obstacleTreeBounds.right()) {
                this.horizontalSegmentTree.ExpandOrCollapseSegmentTree(x, right, true);
            }
            if (y < obstacleTreeBounds.top() || bottom > obstacleTreeBounds.bottom()) {
                this.verticalSegmentTree.ExpandOrCollapseSegmentTree(y, bottom, true);
            }
            this.obstacleTree.Rectangle = new Rect(x, y, right - x, bottom - y);
            this.currentBounds = this.obstacleTree.Rectangle;
            this.horizontalSegmentTree.InitializeVectorCoordinate(nBounds);
            this.verticalSegmentTree.InitializeVectorCoordinate(nBounds);
            this.horizontalSegmentTree.InsertObstacle(nBounds);
            this.verticalSegmentTree.InsertObstacle(nBounds);
            this.horizontalSegmentTree.SplitSegments(nBounds);
            this.verticalSegmentTree.SplitSegments(nBounds);
            this.horizontalSegmentTree.RemoveUnUsedVector();
            this.verticalSegmentTree.RemoveUnUsedVector();
            this.ResetDependentCollection();
        }
        this.isAddingObstacle = false;
        this.portManager.temporaryAddition = true;
    };
    Router.prototype.RemoveObstacleforNode = function (obstacle) {
        if (obstacle._obstacle != null) {
            var obstacles = {};
            var nBounds = (obstacle._obstacle.getPaddedBounds() && obstacle._obstacle) ? obstacle._obstacle.getPaddedBounds().round() : new Rect(0, 0, 0, 0);
            obstacles = Extensions.add(obstacles, obstacle, nBounds);
            obstacle._obstacle = null;
            this.GetIntersectionObstacle(nBounds, obstacles);
            for (var nodeObstacle in obstacles) {
                this.RemoveObstacle(Extensions.getFromDictionary(obstacles, Extensions.KeytAt(obstacles, nodeObstacle)));
                delete obstacle._obstacle;
            }
            for (var nodeObstacle in obstacles) {
                var key = Extensions.KeytAt(obstacles, nodeObstacle);
                if (key.name !== obstacle.name)
                    this.AddNode(key);
            }
        }
    };
    Router.prototype.RemoveObstacle = function (nBounds) {
        this.portManager.temporaryAddition = false;
        this.isRemovingObstacle = true;
        this.vertexToRemove = {};
        this.horizontalSegmentTree.getCoordsToReconstruct().Clear();
        this.verticalSegmentTree.getCoordsToReconstruct().Clear();
        this.horizontalSegmentTree.InitializeVectorCoordinate(nBounds);
        this.verticalSegmentTree.InitializeVectorCoordinate(nBounds);
        this.ConnectSegmentDelegate(nBounds, true);
        this.ConnectSegmentDelegate(nBounds, false);
        this.horizontalSegmentTree.RemoveObstacle(nBounds, this);
        this.verticalSegmentTree.RemoveObstacle(nBounds, this);
        this.DisconnectVertexandEdges(this.horizontalSegmentTree);
        this.DisconnectVertexandEdges(this.verticalSegmentTree);
        this.horizontalSegmentTree.RemoveUnUsedVector();
        this.verticalSegmentTree.RemoveUnUsedVector();
        if (this.verticalSegmentTree.getVectors().Count() != 0) {
            var verticalCount = this.verticalSegmentTree.getVectors().Count();
            var horizontalCount = this.horizontalSegmentTree.getVectors().Count();
            var left = verticalCount > 0 ? Number(this.verticalSegmentTree.getVectors().KeyAt(0)) : 0;
            var top = horizontalCount > 0 ? Number(this.horizontalSegmentTree.getVectors().KeyAt(0)) : 0;
            var right = verticalCount > 0 ? Number(this.verticalSegmentTree.getVectors().KeyAt(this.verticalSegmentTree.getVectors().Count() - 1)) : 0;
            var bottom = horizontalCount > 0 ? Number(this.horizontalSegmentTree.getVectors().KeyAt(this.horizontalSegmentTree.getVectors().Count() - 1)) : 0;
            this.obstacleTree.Rectangle = new Rect(left, top, right - left, bottom - top);
            this.horizontalSegmentTree.ExpandOrCollapseSegmentTree(left, right);
            this.verticalSegmentTree.ExpandOrCollapseSegmentTree(top, bottom);
        }
        else
            this.obstacleTree.Rectangle = Rect.empty;
        this.currentBounds = this.obstacleTree.Rectangle;
        if (Extensions.Count(this.vertexToRemove) != 0) {
            for (var i in this.vertexToRemove) {
                this.graph.RemoveVertex(Extensions.getFromDictionary(this.vertexToRemove, Extensions.KeytAt(this.vertexToRemove, i)));
            }
            this.vertexToRemove = Extensions.Clear(this.vertexToRemove);
        }
        this.isRemovingObstacle = false;
        this.portManager.temporaryAddition = true;
    };
    Router.prototype.GetIntersectionObstacle = function (bounds, obstacles) {
        var intersectingObstacles = this.obstacleTree.FindNodes(bounds);
        for (var i = 0; i < intersectingObstacles.size(); i++) {
            var nodeObstacle = intersectingObstacles.get(Number(i));
            if (nodeObstacle._obstacle != null) {
                var nBounds = nodeObstacle._obstacle.getPaddedBounds().round();
                obstacles = Extensions.add(obstacles, nodeObstacle, nBounds);
                nodeObstacle._obstacle = null;
                this.GetIntersectionObstacle(nBounds, obstacles);
            }
        }
    };
    Router.prototype.SplitSegment = function (bounds, vector) {
        var topPt = Utility.ToRoundedInt(bounds.top()), bottomPt = Utility.ToRoundedInt(bounds.bottom());
        var leftPt = Utility.ToRoundedInt(bounds.left()), rightPt = Utility.ToRoundedInt(bounds.right());
        var perpSegmentTree = vector.getParentTree().getPerpendicularTree();
        var startSegment = vector.FindSegment(!vector.getIsVertical() ? leftPt : topPt);
        var endSegment = vector.FindSegment(!vector.getIsVertical() ? rightPt : bottomPt);
        var startPoint = !vector.getIsVertical() ? new Point(leftPt, vector.getCoord()) : new Point(vector.getCoord(), topPt);
        var endPoint = !vector.getIsVertical() ? new Point(rightPt, vector.getCoord()) : new Point(vector.getCoord(), bottomPt);
        if (startSegment != null) {
            var perpStartSegVector = perpSegmentTree.getVectors().GetValue(!vector.getIsVertical() ? leftPt : topPt);
            var perpStartSegment = perpStartSegVector.FindSegment(vector.getCoord());
            var direction = vector.getIsVertical() ? Directions.North : Directions.East;
            if (perpStartSegment != null) {
                this.RemoveEdgesBetween(startPoint, endPoint, direction);
            }
            else {
                var vertex = this.graph.FindVertex(startSegment.getStartPoint());
                while (vertex != null) {
                    var nextVertex = vertex.FindNextVertex(direction);
                    if (nextVertex && nextVertex.Point.OperatorLessThan(startPoint)) {
                        vertex = nextVertex;
                    }
                    else {
                        this.RemoveEdgesBetween(vertex.Point, endPoint, direction);
                        startSegment.UpdateSegmentPoint(vertex.Point, false);
                        startSegment.RemoveNotInRangeSharedCoordinates();
                        break;
                    }
                }
            }
        }
        if (endSegment != null) {
            var perpEndSegVector = perpSegmentTree.getVectors().GetValue(!vector.getIsVertical() ? rightPt : bottomPt);
            var perpEndSegment = perpEndSegVector.FindSegment(vector.getCoord());
            var direction = vector.getIsVertical() ? Directions.South : Directions.West;
            if (perpEndSegment != null) {
                this.RemoveEdgesBetween(endPoint, startPoint, direction);
            }
            else {
                var vertex = this.graph.FindVertex(endSegment.getEndPoint());
                while (vertex != null) {
                    var nextVertex = vertex.FindNextVertex(direction);
                    if (nextVertex != null && nextVertex.Point.OperatorGreaterThan(endPoint)) {
                        vertex = nextVertex;
                    }
                    else {
                        this.RemoveEdgesBetween(vertex.Point, startPoint, direction);
                        endSegment.UpdateSegmentPoint(vertex.Point, true);
                        endSegment.RemoveNotInRangeSharedCoordinates();
                        break;
                    }
                }
            }
        }
        this.RemoveUnsharedSegmentsFromVector(vector);
    };
    Router.prototype.RemoveEdgesBetween = function (startPoint, endPoint, direction) {
        var prevVertex = this.graph.FindVertex(startPoint);
        if (prevVertex != null) {
            var currentVertex = prevVertex.FindNextVertex(direction);
            var isStartLess = startPoint.OperatorLessThan(endPoint) ? true : false;
            while (currentVertex != null && ((isStartLess && currentVertex.Point.OperatorLessThan(endPoint)) || (!isStartLess && currentVertex.Point.OperatorGreaterThan(endPoint)))) {
                if (!Extensions.ContainsKey(this.vertexToRemove, currentVertex.Point))
                    this.vertexToRemove = Extensions.add(this.vertexToRemove, currentVertex.Point, currentVertex);
                var edge = this.graph.RemoveEdge(prevVertex, currentVertex);
                prevVertex = currentVertex;
                currentVertex = prevVertex.FindNextVertex(direction);
            }
            if (currentVertex != null) {
                this.graph.RemoveEdge(prevVertex, currentVertex);
            }
        }
    };
    Router.prototype.ConnectSegmentDelegate = function (bounds, isHorizontal) {
        var segmentTree = isHorizontal ? this.verticalSegmentTree : this.horizontalSegmentTree;
        var topPt = Utility.ToRoundedInt(bounds.top()), bottomPt = Utility.ToRoundedInt(bounds.bottom());
        var leftPt = Utility.ToRoundedInt(bounds.left()), rightPt = Utility.ToRoundedInt(bounds.right());
        var coord1 = segmentTree.getIsVertical() ? Utility.ToRoundedInt(bounds.left()) : Utility.ToRoundedInt(bounds.top());
        var coord2 = segmentTree.getIsVertical() ? Utility.ToRoundedInt(bounds.right()) : Utility.ToRoundedInt(bounds.bottom());
        var startIndex = segmentTree.getVectors().IndexOfKey(coord1);
        var endIndex = segmentTree.getVectors().IndexOfKey(coord2);
        var index = startIndex + 1;
        while (index < endIndex) {
            var vector = segmentTree.getVectors().GetValue(segmentTree.getVectors().KeyAt(index));
            var startSegment = vector.FindSegment(isHorizontal ? topPt : leftPt);
            var endSegment = vector.FindSegment(isHorizontal ? bottomPt : rightPt);
            var dir = isHorizontal ? Directions.North : Directions.East;
            if (startSegment != endSegment) {
                if (startSegment != null) {
                    var endPt = startSegment.getEndPoint();
                    var sharedCoordToRemove = isHorizontal ? Utility.ToRoundedInt(endPt.y) : Utility.ToRoundedInt(endPt.x);
                    startSegment.RemoveSharedCoordinates(sharedCoordToRemove);
                }
                if (endSegment != null) {
                    var startPt = endSegment.getStartPoint();
                    var sharedCoordToRemove = isHorizontal ? Utility.ToRoundedInt(startPt.y) : Utility.ToRoundedInt(startPt.x);
                    endSegment.RemoveSharedCoordinates(sharedCoordToRemove);
                }
                if (startSegment != null && endSegment != null) {
                    startSegment.UpdateSegmentPoint(endSegment.getEndPoint(), false);
                    for (var i = 0; i < endSegment.getSharedCoordinates().Count(); i++) {
                        var coordinate = endSegment.getSharedCoordinates().KeyAt(i);
                        var value = endSegment.getSharedCoordinates().GetValue(coordinate);
                        startSegment.getSharedCoordinates().Add(value, coordinate);
                    }
                    endSegment.getSharedCoordinates().Clear();
                    this.RefreshSegmentEgdes(startSegment);
                    vector.RemoveSegmentFromVector(endSegment);
                }
                else {
                    if (startSegment != null) {
                        var segment = this.GetMaximumVisibility(startSegment.getEndPoint(), dir);
                        if (segment == null) {
                            var mirrorPoint = dir == Directions.East ? new Point(rightPt, startSegment.getEndPoint().y) : new Point(startSegment.getEndPoint().x, bottomPt);
                            segment = this.GetMaximumVisibility(mirrorPoint, Extensions.OppositeDirection(dir));
                            if (segment != null && (segment.StartPoint.equals(startSegment.getStartPoint()) || segment.StartPoint.equals(startSegment.getEndPoint()))) {
                                var temp = this.GetMaximumVisibility(mirrorPoint, dir);
                                if (temp != null && !temp.StartPoint.equals(temp.EndPoint)) {
                                    segment.EndPoint = temp.EndPoint;
                                }
                                else
                                    segment = null;
                            }
                            else
                                segment = null;
                        }
                        if (segment != null) {
                            var segIndex = vector.getSegments().IndexOf(startSegment);
                            var nextSegment = null;
                            if (segIndex < vector.getSegments().size() - 1)
                                nextSegment = vector.getSegments().get(segIndex + 1);
                            if (nextSegment != null && nextSegment.getStartPoint().OperatorLessThan(segment.EndPoint)) {
                                startSegment.UpdateSegmentPoint(nextSegment.getEndPoint(), false);
                                for (var i = 0; i < nextSegment.getSharedCoordinates().Count(); i++) {
                                    coordinate = nextSegment.getSharedCoordinates().KeyAt(i);
                                    startSegment.getSharedCoordinates().Add(nextSegment.getSharedCoordinates().GetValue(coordinate), coordinate);
                                }
                                nextSegment.getSharedCoordinates().Clear();
                                this.RefreshSegmentEgdes(startSegment);
                                vector.RemoveSegmentFromVector(nextSegment);
                            }
                            else {
                                startSegment.UpdateSegmentPoint(segment.EndPoint, false);
                                this.RefreshSegmentEgdes(startSegment);
                            }
                        }
                    }
                    else if (endSegment != null) {
                        var segment = this.GetMaximumVisibility(endSegment.getStartPoint(), Extensions.OppositeDirection(dir));
                        if (segment == null) {
                            var mirrorPoint = dir == Directions.East ? new Point(leftPt, endSegment.getEndPoint().y) : new Point(endSegment.getEndPoint().x, topPt);
                            segment = this.GetMaximumVisibility(mirrorPoint, Extensions.OppositeDirection(dir));
                            if (segment != null && (segment.EndPoint.equals(endSegment.getStartPoint()) || segment.EndPoint.equals(endSegment.getEndPoint()))) {
                                var temp = this.GetMaximumVisibility(mirrorPoint, dir);
                                if (temp != null && !temp.StartPoint.equals(temp.EndPoint))
                                    segment.StartPoint = temp.StartPoint;
                                else
                                    segment = null;
                            }
                            else {
                                segment = null;
                            }
                        }
                        if (segment != null) {
                            var segIndex = vector.getSegments().IndexOf(endSegment);
                            var prevSegment = null;
                            if (segIndex > 0)
                                prevSegment = vector.getSegments().get(segIndex - 1);
                            if (prevSegment != null && prevSegment.getEndPoint().OperatorGreaterThan(segment.StartPoint)) {
                                prevSegment.UpdateSegmentPoint(endSegment.getEndPoint(), false);
                                for (var i = 0; i < endSegment.getSharedCoordinates().Count(); i++) {
                                    coordinate = endSegment.getSharedCoordinates().KeyAt(i);
                                    prevSegment.getSharedCoordinates().Add(endSegment.getSharedCoordinates().GetValue(coordinate), coordinate);
                                }
                                endSegment.getSharedCoordinates().Clear();
                                this.RefreshSegmentEgdes(prevSegment);
                                vector.RemoveSegmentFromVector(endSegment);
                            }
                            else {
                                endSegment.UpdateSegmentPoint(segment.StartPoint, true);
                                this.RefreshSegmentEgdes(endSegment);
                            }
                        }
                    }
                }
            }
            index++;
        }
    };
    Router.prototype.ExtendScanSegment = function (segment, point, isStart) {
        var vertex = isStart ? this.graph.FindVertex(segment.getStartPoint()) : this.graph.FindVertex(segment.getEndPoint());
        if (vertex != null) {
            if (isStart) {
                this.portManager.ConnectVertices_vertex(this.AddVertex(point), vertex);
            }
            else {
                this.portManager.ConnectVertices_vertex(vertex, this.AddVertex(point));
            }
        }
    };
    Router.prototype.ConstructVertexandEdges = function (segments) {
        for (var i = 0; i < segments.size(); i++)
            this.RefreshSegmentEgdes(segments.get(i));
    };
    Router.prototype.DisconnectVertexandEdges = function (segmentTree) {
        for (var i = 0; i < segmentTree.getCoordsToReconstruct().size(); i++) {
            this.RemoveUnsharedSegmentsFromVector(segmentTree.getVectors().GetValue(segmentTree.getCoordsToReconstruct().get(i)));
        }
        segmentTree.getCoordsToReconstruct().Clear();
    };
    Router.prototype.RemoveUnsharedSegmentsFromVector = function (vector) {
        var perpSegmentTree = !vector.getIsVertical() ? this.verticalSegmentTree : this.horizontalSegmentTree;
        var i = 0;
        while (i < vector.getSegments().size()) {
            var segment = vector.getSegments().get(i);
            if (segment.getSharedCoordinates().Count() != 0) {
                i++;
                continue;
            }
            else {
                var perpCoords = new List();
                var vertex = this.graph.FindVertex(segment.getStartPoint()), prev = null;
                var direction = vector.getIsVertical() ? Directions.North : Directions.East;
                while (vertex != null) {
                    var vertexPt = vertex.Point;
                    var perpSegmentCoord = vector.getIsVertical() ? Utility.ToRoundedInt(vertex.Point.y) : Utility.ToRoundedInt(vertex.Point.x);
                    if (perpSegmentTree.getVectors().Count() != 0 && perpSegmentTree.getVectors().ContainsKey(perpSegmentCoord)) {
                        var perpDirection = vector.getIsVertical() ? Directions.East : Directions.North;
                        if (this.portManager.DisconnectVertexInDirection(vertex, perpDirection)) {
                            perpCoords.add(perpSegmentCoord);
                        }
                        else {
                            var perpSegVector = perpSegmentTree.getVectors().GetValue(perpSegmentCoord);
                            var perpSegment = perpSegVector.FindSegment(vector.getCoord());
                            if (perpSegment != null) {
                                this.portManager.RemoveVertexFromSegment_vertex(perpSegment, vertex);
                                perpCoords.add(perpSegmentCoord);
                            }
                        }
                    }
                    if (!Extensions.ContainsKey(this.vertexToRemove, vertex.Point))
                        this.vertexToRemove = Extensions.add(this.vertexToRemove, vertex.Point, vertex);
                    if (prev != null)
                        this.graph.RemoveEdge(prev, vertex);
                    prev = vertex;
                    vertex = vertex.FindNextVertex(direction);
                    if (prev == vertex) {
                        vertex = null;
                    }
                }
                vector.RemoveSegmentFromVector(segment);
                for (var m = 0; m < perpCoords.size(); m++) {
                    var perpCoord = perpCoords.get(m);
                    if (perpSegmentTree.getVectors().ContainsKey(perpCoord) && !perpSegmentTree.getCoordsToReconstruct().contains(perpCoord))
                        this.RemoveUnsharedSegmentsFromVector(perpSegmentTree.getVectors().GetValue(perpCoord));
                }
            }
        }
    };
    Router.prototype.RefreshSegmentEgdes = function (segment) {
        if (segment != null && segment.getSharedCoordinates().Count() != 0) {
            var isSegVertical = segment.getIsVertical();
            var edgeDirection = isSegVertical ? Directions.North : Directions.East;
            var perpSegmentTree = !isSegVertical ? this.verticalSegmentTree : this.horizontalSegmentTree;
            var startIndex = perpSegmentTree.FindIndexNumber(segment.getStart());
            var endIndex = perpSegmentTree.FindIndexNumber(segment.getEnd());
            var segCoord = segment.getParentVector().getCoord();
            if (startIndex != endIndex) {
                var vertex = this.AddVertex(segment.getStartPoint());
                var perpVectors = Utility.ToList(perpSegmentTree.getVectors().Items()).GetRange(startIndex, endIndex - startIndex + 1);
                var perpVectors;
                for (var i = 0; i < perpVectors.size(); i++) {
                    var perpVector = perpVectors.get(i).value;
                    var perpScanSegment = perpVector.FindSegment(segCoord);
                    if (perpScanSegment != null) {
                        var intersectingPt = isSegVertical ? new Point(segCoord, perpVector.getCoord()) : new Point(perpVector.getCoord(), segCoord);
                        var newVertex = this.AddVertex(intersectingPt);
                        this.portManager.AddVertexToSegment(perpScanSegment, newVertex);
                        if (i != 0)
                            this.portManager.ConnectVertices_vertex(vertex, newVertex, 1, edgeDirection);
                        vertex = newVertex;
                    }
                    else if (i == perpVectors.size() - 1) {
                        var intersectingPt = isSegVertical ? new Point(segCoord, perpVector.getCoord()) : new Point(perpVector.getCoord(), segCoord);
                        this.portManager.ConnectVertices_vertex(vertex, this.AddVertex(intersectingPt), 1, edgeDirection);
                    }
                }
            }
        }
    };
    Router.prototype.GetScanSegmentsFromBounds = function (bounds, vector) {
        var segments = new List();
        var segmentTree = vector.getIsVertical() ? this.horizontalSegmentTree : this.verticalSegmentTree;
        var startIndex = segmentTree.FindIndex(bounds.topLeft().round());
        var endIndex = segmentTree.FindIndex(bounds.bottomRight().round());
        var coord = Utility.ToRoundedInt(bounds.left());
        var startPoint = vector.getCoord() === coord ? bounds.topLeft() : bounds.topRight();
        var endPoint = vector.getCoord() === coord ? bounds.bottomLeft() : bounds.bottomRight();
        if (!vector.getIsVertical()) {
            coord = Utility.ToRoundedInt(bounds.top());
            startPoint = vector.getCoord() === coord ? bounds.topLeft() : bounds.bottomLeft();
            endPoint = vector.getCoord() === coord ? bounds.topRight() : bounds.bottomRight();
        }
        startPoint = startPoint.round();
        endPoint = endPoint.round();
        if (startIndex != endIndex) {
            var index = startIndex;
            var prevIntersectingPt = new Point();
            while (index < endIndex) {
                var perpSegmentVector = segmentTree.getVectors().GetValue(segmentTree.getVectors().KeyAt(index));
                var perpScanSegment = perpSegmentVector.FindSegment(vector.getCoord());
                if (perpScanSegment != null) {
                    var startSegment = vector.FindSegment(!vector.getIsVertical() ? startPoint.x : startPoint.y);
                    var endSegment = vector.FindSegment(!vector.getIsVertical() ? endPoint.x : endPoint.y);
                    var intersectingPt = new Point(perpSegmentVector.Coord, vector.getCoord());
                    if (vector.getIsVertical()) {
                        intersectingPt = new Point(vector.getCoord(), perpSegmentVector.Coord);
                    }
                    if ((startSegment == null || !startSegment.Contains(intersectingPt)) && (endSegment == null || !endSegment.Contains(intersectingPt))) {
                        var point = new Point(perpSegmentVector.Coord + 1, vector.getCoord());
                        if (vector.getIsVertical())
                            point = new Point(vector.getCoord(), perpSegmentVector.Coord + 1);
                        if ((startSegment == null || !startSegment.Contains(point)) && (endSegment == null || !endSegment.Contains(point))) {
                            var segment = vector.GetScanSegment(point);
                            if (segment != null && !segments.contains(segment)) {
                                if (segment.getStartPoint().equals(intersectingPt)) {
                                    segments.add(segment);
                                }
                                else {
                                    vector.RemoveSegmentFromVector(segment);
                                }
                            }
                            else if (segment == null) {
                                if (index > startIndex) {
                                    var tempPt = new Point(perpSegmentVector.Coord - 1, vector.getCoord());
                                    if (vector.getIsVertical()) {
                                        tempPt = new Point(vector.getCoord(), perpSegmentVector.Coord - 1);
                                    }
                                    if (tempPt.equals(prevIntersectingPt)) {
                                        vector.GetScanSegment_startPoint(tempPt, intersectingPt);
                                    }
                                }
                            }
                        }
                    }
                    prevIntersectingPt = intersectingPt;
                }
                index++;
            }
        }
        return segments;
    };
    Router.prototype.GetPossibleEntries = function (sourcePort, targetPort) {
        var bendCount = 2;
        var possibleEntries = new List();
        var preferredDirectons = new List();
        var inversePreDir = new List();
        var sourceEntries = this.portManager.FindEntrances(sourcePort);
        var targetEntries = this.portManager.FindEntrances(targetPort);
        var srcLocation = sourcePort.getLocation();
        var tarLocation = targetPort.getLocation();
        preferredDirectons.add(Extensions.FindDirection_orientation(srcLocation, tarLocation, Orientation.Horizontal));
        preferredDirectons.add(Extensions.FindDirection_orientation(srcLocation, tarLocation, Orientation.Vertical));
        for (var i = 0; i < preferredDirectons.size(); i++) {
            var directon = preferredDirectons.get(i);
            inversePreDir.add(Extensions.OppositeDirection(directon));
        }
        for (var i = 0; i < sourceEntries.size(); i++) {
            var srcEntry = sourceEntries.get(i);
            for (var j = 0; j < targetEntries.size(); j++) {
                var tarEntry = targetEntries.get(j);
                var isTarAtTop = srcEntry.Point.y > tarEntry.Point.y;
                var isTarAtLeft = srcEntry.Point.x > tarEntry.Point.x;
                if (srcEntry.getEastEdge() != null) {
                    var isPreferred = preferredDirectons.contains(Directions.East);
                    if (tarEntry.getEastEdge() != null) {
                        possibleEntries.add(new ConnectablePath(bendCount, srcEntry, tarEntry));
                    }
                    if (tarEntry.getWestEdge() != null) {
                        isPreferred = isPreferred && inversePreDir.contains(Directions.West);
                        bendCount = isTarAtLeft ? 4 : 2;
                        possibleEntries.add(new ConnectablePath(bendCount, srcEntry, tarEntry, isPreferred));
                    }
                    if (tarEntry.getSouthEdge() != null) {
                        isPreferred = isPreferred && inversePreDir.contains(Directions.South);
                        bendCount = !isTarAtTop && !isTarAtLeft ? 1 : 3;
                        possibleEntries.add(new ConnectablePath(bendCount, srcEntry, tarEntry, isPreferred));
                    }
                    if (tarEntry.getNorthEdge() != null) {
                        isPreferred = isPreferred && inversePreDir.contains(Directions.North);
                        bendCount = isTarAtTop && !isTarAtLeft ? 1 : 3;
                        possibleEntries.add(new ConnectablePath(bendCount, srcEntry, tarEntry, isPreferred));
                    }
                }
                if (srcEntry.getWestEdge() != null) {
                    var isPreferred = preferredDirectons.contains(Directions.West);
                    if (tarEntry.getWestEdge() != null) {
                        possibleEntries.add(new ConnectablePath(bendCount, srcEntry, tarEntry));
                    }
                    if (tarEntry.getEastEdge() != null) {
                        isPreferred = isPreferred && inversePreDir.contains(Directions.East);
                        bendCount = isTarAtLeft ? 2 : 4;
                        possibleEntries.add(new ConnectablePath(bendCount, srcEntry, tarEntry, isPreferred));
                    }
                    if (tarEntry.getSouthEdge() != null) {
                        isPreferred = isPreferred && inversePreDir.contains(Directions.South);
                        bendCount = !isTarAtTop && isTarAtLeft ? 1 : 3;
                        possibleEntries.add(new ConnectablePath(bendCount, srcEntry, tarEntry, isPreferred));
                    }
                    if (tarEntry.getNorthEdge() != null) {
                        isPreferred = isPreferred && inversePreDir.contains(Directions.North);
                        bendCount = isTarAtTop && isTarAtLeft ? 1 : 3;
                        possibleEntries.add(new ConnectablePath(bendCount, srcEntry, tarEntry, isPreferred));
                    }
                }
                if (srcEntry.getNorthEdge() != null) {
                    var isPreferred = preferredDirectons.contains(Directions.North);
                    if (tarEntry.getNorthEdge() != null) {
                        possibleEntries.add(new ConnectablePath(bendCount, srcEntry, tarEntry));
                    }
                    if (tarEntry.getSouthEdge() != null) {
                        isPreferred = isPreferred && inversePreDir.contains(Directions.South);
                        bendCount = isTarAtTop ? 4 : 2;
                        possibleEntries.add(new ConnectablePath(bendCount, srcEntry, tarEntry, isPreferred));
                    }
                    if (tarEntry.getEastEdge() != null) {
                        isPreferred = isPreferred && inversePreDir.contains(Directions.East);
                        bendCount = !isTarAtTop && isTarAtLeft ? 1 : 3;
                        possibleEntries.add(new ConnectablePath(bendCount, srcEntry, tarEntry, isPreferred));
                    }
                    if (tarEntry.getWestEdge() != null) {
                        isPreferred = isPreferred && inversePreDir.contains(Directions.West);
                        bendCount = !isTarAtTop && !isTarAtLeft ? 1 : 3;
                        possibleEntries.add(new ConnectablePath(bendCount, srcEntry, tarEntry, isPreferred));
                    }
                }
                if (srcEntry.getSouthEdge() != null) {
                    var isPreferred = preferredDirectons.contains(Directions.South);
                    if (tarEntry.getSouthEdge() != null) {
                        possibleEntries.add(new ConnectablePath(bendCount, srcEntry, tarEntry));
                    }
                    if (tarEntry.getNorthEdge() != null) {
                        isPreferred = isPreferred && inversePreDir.contains(Directions.North);
                        bendCount = isTarAtTop ? 2 : 4;
                        possibleEntries.add(new ConnectablePath(bendCount, srcEntry, tarEntry, isPreferred));
                    }
                    if (tarEntry.getEastEdge() != null) {
                        isPreferred = isPreferred && inversePreDir.contains(Directions.East);
                        bendCount = isTarAtLeft && isTarAtTop ? 1 : 3;
                        possibleEntries.add(new ConnectablePath(bendCount, srcEntry, tarEntry, isPreferred));
                    }
                    if (tarEntry.getWestEdge() != null) {
                        isPreferred = isPreferred && inversePreDir.contains(Directions.West);
                        bendCount = isTarAtTop && !isTarAtLeft ? 1 : 3;
                        possibleEntries.add(new ConnectablePath(bendCount, srcEntry, tarEntry, isPreferred));
                    }
                }
            }
        }
        return this.sortPossibleEntries(possibleEntries);
    };
    Router.prototype.sortPossibleEntries = function (possibleEntries) {
        var falseReturn = new List();
        var trueReturn = new List();
        for (var i = 0; i < possibleEntries.size(); i++) {
            var tempEntries = possibleEntries.get(i);
            if (!tempEntries.getIsPreferred())
                falseReturn.add(tempEntries);
            else
                trueReturn.add(tempEntries);
        }
        falseReturn.sortByKey("MinimalBend");
        trueReturn.sortByKey("MinimalBend");
        possibleEntries.Clear();
        possibleEntries.AddRange(trueReturn);
        possibleEntries.AddRange(falseReturn);
        return possibleEntries;
    };
    return Router;
}());
var ConnectablePath = (function () {
    function ConnectablePath(minimalBend, source, target, isPerferred) {
        if (isPerferred === void 0) { isPerferred = false; }
        this.m_MinimalBend = minimalBend;
        this.m_SourceEntry = source;
        this.m_TargetEntry = target;
        this.m_IsPreferred = isPerferred;
    }
    ConnectablePath.prototype.getMinimalBend = function () {
        return this.m_MinimalBend;
    };
    ConnectablePath.prototype.getIsPreferred = function () {
        return this.m_IsPreferred;
    };
    ConnectablePath.prototype.getSourceEntry = function () {
        return this.m_SourceEntry;
    };
    ConnectablePath.prototype.getTargetEntry = function () {
        return this.m_TargetEntry;
    };
    return ConnectablePath;
}());
var SegmentTree = (function () {
    function SegmentTree(isVertical, router) {
        this._mStart = Number.MAX_VALUE;
        this._mEnd = Number.MIN_VALUE;
        this._mIsVertical = false;
        this.unUsedVectors = new List();
        this._mIsVertical = isVertical;
        this._mOrientation = isVertical ? SegmentOrientation.Vertical : SegmentOrientation.Horizontal;
        this._mRouter = router;
        this._mVectors = new SortedList();
        this._mCoordsToReconstruct = new List();
    }
    SegmentTree.prototype.getStart = function () {
        return this._mStart;
    };
    SegmentTree.prototype.setStart = function (value) {
        this._mStart = Math.floor(value);
    };
    SegmentTree.prototype.getEnd = function () {
        return this._mEnd;
    };
    SegmentTree.prototype.setEnd = function (value) {
        this._mEnd = Math.floor(value);
    };
    SegmentTree.prototype.getIsVertical = function () {
        return this._mIsVertical;
    };
    SegmentTree.prototype.getOrientation = function () {
        return this._mOrientation;
    };
    SegmentTree.prototype.getCoordsToReconstruct = function () {
        return this._mCoordsToReconstruct;
    };
    SegmentTree.prototype.setCoordsToReconstruct = function (value) {
        this._mCoordsToReconstruct = value != null ? value : new List();
    };
    SegmentTree.prototype.getVectors = function () {
        return this._mVectors;
    };
    SegmentTree.prototype.setVectors = function (value) {
        this._mVectors = value != null ? value : new SortedList();
    };
    SegmentTree.prototype.getPerpendicularTree = function () {
        return this._mPerpendicularTree;
    };
    SegmentTree.prototype.setPerpendicularTree = function (value) {
        this._mPerpendicularTree = value;
    };
    SegmentTree.prototype.getRouter = function () {
        return this._mRouter;
    };
    SegmentTree.prototype.setRouter = function (value) {
        this._mRouter = value;
    };
    SegmentTree.prototype.UpdateTreePoints = function () {
        if (this._mVectors.Count() != 0) {
            var startVector = this._mVectors.GetValue(this._mVectors.KeyAt(0));
            var endVector = this._mVectors.GetValue(this._mVectors.KeyAt(this._mVectors.Count() - 1));
            this.UpdateTreePoint(startVector.getStart(), true);
            this.UpdateTreePoint(endVector.getEnd(), false);
        }
        else {
            this.UpdateTreePoint(Number.MAX_VALUE, true);
            this.UpdateTreePoint(Number.MIN_VALUE, false);
        }
    };
    SegmentTree.prototype.UpdateTreePoint = function (point, isStart, isExpanding) {
        if (isExpanding === void 0) { isExpanding = false; }
        if (isStart && this._mStart != point)
            this._mStart = point;
        else if (!isStart && this._mEnd != point)
            this._mEnd = point;
        if (!isExpanding && this._mVectors.Count() == 0) {
            if (isStart)
                this._mStart = Number.MAX_VALUE;
            else
                this._mEnd = Number.MIN_VALUE;
        }
    };
    SegmentTree.prototype.ExpandOrCollapseSegmentTree = function (newStart, newEnd, isExpanding) {
        if (isExpanding === void 0) { isExpanding = false; }
        if (isExpanding) {
            for (var i in this._mVectors.Items()) {
                var vector = this._mVectors.ElementAt(i);
                if (this._mStart != newStart)
                    vector.ExpandSegmentVector(newStart, this._mStart, true);
                if (this._mEnd != newEnd)
                    vector.ExpandSegmentVector(newEnd, this._mEnd, false);
            }
        }
        this.UpdateTreePoint(newStart, true, isExpanding);
        this.UpdateTreePoint(newEnd, false, isExpanding);
    };
    SegmentTree.prototype.InitializeVectorCoordinate = function (bounds) {
        var vectorCoord1 = this._mIsVertical ? Utility.ToRoundedInt(bounds.left()) : Utility.ToRoundedInt(bounds.top());
        if (!(this._mVectors.ContainsKey(vectorCoord1))) {
            this._mVectors.Add(new SegmentVector(vectorCoord1, this._mStart, this._mEnd, this._mOrientation, this), vectorCoord1);
            this.unUsedVectors.add(vectorCoord1);
        }
        var vectorCoord2 = this._mIsVertical ? Utility.ToRoundedInt(bounds.right()) : Utility.ToRoundedInt(bounds.bottom());
        if (!this._mVectors.ContainsKey(vectorCoord2)) {
            this._mVectors.Add(new SegmentVector(vectorCoord2, this._mStart, this._mEnd, this._mOrientation, this), vectorCoord2);
            this.unUsedVectors.add(vectorCoord2);
        }
    };
    SegmentTree.prototype.RemoveVectorCoordinate = function (vector, skipUpdatingTree, index) {
        if (skipUpdatingTree === void 0) { skipUpdatingTree = false; }
        if (vector.getSegments().size() == 0) {
            this._mVectors.Remove(vector.getCoord());
            vector = null;
            if (skipUpdatingTree)
                this.UpdateTreePoints();
        }
    };
    SegmentTree.prototype.InsertObstacle = function (bounds) {
        var vectorCoords = new List();
        vectorCoords.add(this._mIsVertical ? Utility.ToRoundedInt(bounds.left()) : Utility.ToRoundedInt(bounds.top()));
        vectorCoords.add(this._mIsVertical ? Utility.ToRoundedInt(bounds.right()) : Utility.ToRoundedInt(bounds.bottom()));
        for (var i = 0; i < vectorCoords.size(); i++) {
            var vectorCoord = vectorCoords.get(i);
            var vector = this._mVectors.GetValue(vectorCoord);
            var segments = vector.InsertObstacle(bounds);
            vector.UpdateVectorPoints();
            if (segments.size() != 0) {
                for (var j = 0; j < segments.size(); j++) {
                    this._mRouter.RefreshSegmentEgdes(segments.get(j));
                }
                if (this.unUsedVectors.contains(vectorCoord))
                    this.unUsedVectors.Remove(vectorCoord);
            }
        }
    };
    SegmentTree.prototype.RemoveObstacle = function (bounds, router) {
        var segCollection1 = new List();
        var segCollection2 = new List();
        var vectorPoint1 = Math.floor(this._mIsVertical ? bounds.left() : bounds.top());
        var vectorPoint2 = Math.floor(this._mIsVertical ? bounds.right() : bounds.bottom());
        if (this._mVectors.ContainsKey(vectorPoint1)) {
            this._mCoordsToReconstruct.add(Math.floor(vectorPoint1));
            var args = this._mVectors.GetValue(vectorPoint1).RemoveObstacle(bounds, segCollection1);
            segCollection1 = args.SegCollection;
        }
        if (this._mVectors.ContainsKey(vectorPoint2)) {
            this._mCoordsToReconstruct.add(Math.floor(vectorPoint2));
            var args = this._mVectors.GetValue(vectorPoint2).RemoveObstacle(bounds, segCollection2);
            segCollection2 = args.SegCollection;
        }
        return null;
    };
    SegmentTree.prototype.SplitSegments = function (bounds) {
        var coord1 = this._mIsVertical ? Utility.ToRoundedInt(bounds.left()) : Utility.ToRoundedInt(bounds.top());
        var coord2 = this._mIsVertical ? Utility.ToRoundedInt(bounds.right()) : Utility.ToRoundedInt(bounds.bottom());
        var startIndex = this._mVectors.IndexOfKey(coord1), endIndex = this._mVectors.IndexOfKey(coord2);
        for (var index = startIndex + 1; index < endIndex; index++) {
            var vector = this._mVectors.GetValue(this._mVectors.KeyAt(index));
            vector.SplitSegment(bounds);
            this._mRouter.SplitSegment(bounds, vector);
        }
    };
    SegmentTree.prototype.RemoveUnUsedVector = function () {
        for (var i = 0; i < this.unUsedVectors.size(); i++)
            this.RemoveVectorCoordinate(this._mVectors.GetValue(this.unUsedVectors.get(i)), null);
        this.unUsedVectors.Clear();
    };
    SegmentTree.prototype.UpdateUnUsedVector = function (coord) {
        if (!this.unUsedVectors.contains(coord))
            this.unUsedVectors.add(coord);
    };
    SegmentTree.prototype.FindLast = function (point) {
        var mid = 0;
        var low = 0;
        var high = this._mVectors.Count() - 1;
        var lastVector = null;
        if (!this._mIsVertical) {
            var coord = point.y - 0.00001;
            while (high - low > 1) {
                mid = Math.floor((low + high) / 2);
                var obj = this._mVectors.ElementAt(mid);
                if (obj && obj.getCoord() < coord) {
                    low = Math.floor(mid);
                }
                else {
                    high = Math.floor(mid);
                }
            }
            var obj = this._mVectors.ElementAt(high);
            if (obj && coord > obj.getCoord()) {
                low = Math.floor(high);
            }
            var obj = this._mVectors.ElementAt(low);
            if (obj && coord > obj.getCoord()) {
                while (low > -1 && (this._mVectors.ElementAt(low).GetStart().x > point.x || this._mVectors.ElementAt(low).GetEnd().x < point.x)) {
                    low--;
                }
                if (low > -1)
                    lastVector = this._mVectors.ElementAt(low);
            }
            if (lastVector != null) {
                var index = low;
                while (index >= 0) {
                    var segment = this._mVectors.ElementAt(index).FindSegment(Utility.ToRoundedInt(point.x));
                    if (segment != null)
                        return segment;
                    index--;
                }
            }
        }
        else {
            var coord = point.x - 0.00001;
            while (high - low > 1) {
                mid = Math.floor(((low + high) / 2));
                var obj1 = this._mVectors.ElementAt(mid);
                if (obj1 && obj1.getCoord() < coord) {
                    low = mid;
                }
                else {
                    high = mid;
                }
            }
            var obj2 = this._mVectors.ElementAt(high);
            if (obj2 && coord > obj2.getCoord()) {
                low = high;
            }
            var obj3 = this._mVectors.ElementAt(low);
            if (obj3 && coord > obj3.getCoord()) {
                while (low > -1 && (this._mVectors.ElementAt(low).GetStart().y > point.y || this._mVectors.ElementAt(low).GetEnd().y < point.y)) {
                    low--;
                }
                if (low > -1)
                    lastVector = this._mVectors.ElementAt(low);
            }
            if (lastVector != null) {
                var index = low;
                while (index >= 0) {
                    var segment = this._mVectors.ElementAt(index).FindSegment(Utility.ToRoundedInt(point.y));
                    if (segment != null)
                        return segment;
                    index--;
                }
            }
        }
        return null;
    };
    SegmentTree.prototype.FindFirst = function (point) {
        var mid = 0;
        var low = 0;
        var high = this._mVectors.Count() - 1;
        var startVector = null;
        if (!this._mIsVertical) {
            var coord = point.y + 0.00001;
            while (high - low > 1) {
                mid = Math.floor((low + high) / 2);
                var obj = this._mVectors.ElementAt(mid);
                if (obj && obj.getCoord() < coord) {
                    low = Math.floor(mid);
                }
                else {
                    high = Math.floor(mid);
                }
            }
            var obj = this._mVectors.ElementAt(low);
            if (obj && coord <= obj.getCoord())
                high = Math.floor(low);
            var obj = this._mVectors.ElementAt(high);
            if (obj && coord < obj.getCoord()) {
                while (high < this._mVectors.Count() && (this._mVectors.ElementAt(high).GetStart().x > point.x || this._mVectors.ElementAt(high).GetEnd().x < point.x)) {
                    high++;
                }
                if (high < this._mVectors.Count())
                    startVector = this._mVectors.ElementAt(high);
            }
            if (startVector != null) {
                var index = high;
                while (index < this._mVectors.Count()) {
                    var segment = this._mVectors.ElementAt(index).FindSegment(Utility.ToRoundedInt(point.x));
                    if (segment != null)
                        return segment;
                    index++;
                }
            }
        }
        else {
            var coord = point.x + 0.0001;
            while (high - low > 1) {
                mid = Math.floor((low + high) / 2);
                var obj = this._mVectors.ElementAt(mid);
                if (obj && obj.getCoord() < coord) {
                    low = mid;
                }
                else {
                    high = mid;
                }
            }
            var obj = this._mVectors.ElementAt(low);
            if (obj && coord <= obj.getCoord())
                high = low;
            var obj = this._mVectors.ElementAt(high);
            if (obj && coord <= obj.getCoord()) {
                while (high < this._mVectors.Count() && (this._mVectors.ElementAt(high).GetStart().y > point.y || this._mVectors.ElementAt(high).GetEnd().y < point.y)) {
                    high++;
                }
                if (high < this._mVectors.Count())
                    startVector = this._mVectors.ElementAt(high);
            }
            if (startVector != null) {
                var index = high;
                while (index < this._mVectors.Count()) {
                    var segment = this._mVectors.ElementAt(index).FindSegment(Utility.ToRoundedInt(point.y));
                    if (segment != null)
                        return segment;
                    index++;
                }
            }
        }
        return null;
    };
    SegmentTree.prototype.FindIndex = function (point) {
        if (!this._mIsVertical) {
            if (this._mVectors.ContainsKey(Utility.ToRoundedInt(point.y))) {
                return this._mVectors.IndexOfKey(Utility.ToRoundedInt(point.y));
            }
        }
        else {
            if (this._mVectors.ContainsKey(Utility.ToRoundedInt(point.x))) {
                return this._mVectors.IndexOfKey(Utility.ToRoundedInt(point.x));
            }
        }
        return -1;
    };
    SegmentTree.prototype.FindIndexNumber = function (point) {
        if (this._mVectors.ContainsKey(point))
            return this._mVectors.IndexOfKey(point);
        return 0;
    };
    SegmentTree.prototype.FindFirstIndex = function (point) {
        var mid = 0;
        var low = 0;
        var high = this._mVectors.Count() - 1;
        var startVector = null;
        if (!this._mIsVertical) {
            var coord = point.y + 0.00001;
            while (high - low > 1) {
                mid = Math.floor((low + high) / 2);
                if (this._mVectors.ElementAt(mid).Coord < coord) {
                    low = Math.floor(mid);
                }
                else {
                    high = Math.floor(mid);
                }
            }
            if (coord <= this._mVectors.ElementAt(low).Coord) {
                high = low;
            }
            if (coord < this._mVectors.ElementAt(high).Coord) {
                while (high < this._mVectors.Count() && (this._mVectors.ElementAt(high).GetStart().x > point.x || this._mVectors.ElementAt(high).GetEnd().x < point.x)) {
                    high++;
                }
                if (high < this._mVectors.Count())
                    return high;
            }
        }
        else {
            var coord = point.x + 0.0001;
            while (high - low > 1) {
                mid = Math.floor((low + high) / 2);
                if (this._mVectors.ElementAt(mid).Coord < coord) {
                    low = Math.floor(mid);
                }
                else {
                    high = Math.floor(mid);
                }
            }
            if (coord <= this._mVectors.ElementAt(low).Coord)
                high = Math.floor(low);
            if (coord <= this._mVectors.ElementAt(high).Coord) {
                while (high < this._mVectors.Count() && (this._mVectors.ElementAt(high).GetStart().y > point.y || this._mVectors.ElementAt(high).GetEnd().y < point.y)) {
                    high++;
                }
                if (high < this._mVectors.Count())
                    return high;
            }
        }
        return -1;
    };
    SegmentTree.prototype.FindSegment = function (index, point, segmentCoord) {
        if (index < this._mVectors.Count() && index >= 0) {
            var coord = Utility.ToRoundedInt(point.y);
            if (!this._mIsVertical) {
                coord = Utility.ToRoundedInt(point.x);
            }
            segmentCoord = this._mVectors.ElementAt(index);
            return this._mVectors[segmentCoord].FindSegment(coord);
        }
        return null;
    };
    SegmentTree.prototype.FindScanSegment = function (point) {
        if (this._mIsVertical) {
            if (this._mVectors.ContainsKey(Utility.ToRoundedInt(point.y))) {
                return this._mVectors[Utility.ToRoundedInt(point.y)].FindSegment(Utility.ToRoundedInt(point.x));
            }
        }
        else {
            if (this._mVectors.ContainsKey(Utility.ToRoundedInt(point.x))) {
                return this._mVectors[Utility.ToRoundedInt(point.x)].FindSegment(Utility.ToRoundedInt(point.y));
            }
        }
        return null;
    };
    SegmentTree.prototype.GetEdgePassingThroughVertex = function (newVertex, perpendicularVectorCoord) {
        var vertexPt = newVertex.Point;
        var vertexCoordIndex = this._mVectors.IndexOfKey(this._mIsVertical ? Utility.ToRoundedInt(vertexPt.x) : Utility.ToRoundedInt(vertexPt.y));
        if (vertexCoordIndex != -1) {
            var dir = this._mIsVertical ? Directions.East : Directions.North;
            var prevVertex = null, nextVertex = null;
            var graph = this._mRouter.graph;
            for (var i = vertexCoordIndex - 1; i >= 0; i--) {
                var vectorCoord = Number(this._mVectors.KeyAt(i));
                if (this._mIsVertical) {
                    prevVertex = graph.FindVertexNumber(vectorCoord, perpendicularVectorCoord);
                }
                else {
                    prevVertex = graph.FindVertexNumber(perpendicularVectorCoord, vectorCoord);
                }
                if (prevVertex != null) {
                    nextVertex = prevVertex.FindNextVertex(dir);
                    if (nextVertex != null)
                        return this._mIsVertical ? prevVertex.getEastEdge() : prevVertex.getNorthEdge();
                }
            }
            for (var i = vertexCoordIndex + 1; i <= this._mVectors.Count() - 1; i++) {
                var vectorCoord = Number(this._mVectors.KeyAt(i));
                if (this._mIsVertical) {
                    nextVertex = graph.FindVertexNumber(vectorCoord, perpendicularVectorCoord);
                }
                else {
                    nextVertex = graph.FindVertexNumber(perpendicularVectorCoord, vectorCoord);
                }
                if (nextVertex != null) {
                    prevVertex = nextVertex.FindNextVertex(Extensions.OppositeDirection(dir));
                    if (prevVertex != null)
                        return this._mIsVertical ? prevVertex.getEastEdge() : prevVertex.getNorthEdge();
                }
            }
        }
        return null;
    };
    return SegmentTree;
}());
var SegmentVector = (function () {
    function SegmentVector(coord, start, end, orientation, parentTree) {
        this._mStart = 0;
        this._mEnd = 0;
        this._mCoord = 0;
        this._mIsVertical = false;
        this._mCoord = coord;
        this._mStart = start;
        this._mEnd = end;
        this._mParentTree = parentTree;
        this._mOrientation = orientation;
        this._mIsVertical = this._mOrientation == SegmentOrientation.Vertical;
        this._mSegments = new List();
    }
    SegmentVector.prototype.getStart = function () {
        return this._mStart;
    };
    SegmentVector.prototype.setStart = function (value) {
        this._mStart = value;
    };
    SegmentVector.prototype.getEnd = function () {
        return this._mEnd;
    };
    SegmentVector.prototype.setEnd = function (value) {
        this._mEnd = value;
    };
    SegmentVector.prototype.getCoord = function () {
        return this._mCoord;
    };
    SegmentVector.prototype.setCoord = function (value) {
        this._mCoord = Math.floor(value);
    };
    SegmentVector.prototype.getSegments = function () {
        return this._mSegments;
    };
    SegmentVector.prototype.setSegments = function (value) {
        this._mSegments = value;
    };
    SegmentVector.prototype.getOrientation = function () {
        return this._mOrientation;
    };
    SegmentVector.prototype.getIsVertical = function () {
        return this._mIsVertical;
    };
    SegmentVector.prototype.getParentTree = function () {
        return this._mParentTree;
    };
    SegmentVector.prototype.UpdateVectorPoints = function (isTreeExpansion) {
        if (isTreeExpansion === void 0) { isTreeExpansion = false; }
        if (this._mSegments.size() != 0) {
            var startSegment = this._mSegments.get(0), endSegment = this._mSegments.get(this._mSegments.size() - 1);
            this.UpdateVectorPoint(startSegment.getStart(), true, isTreeExpansion);
            this.UpdateVectorPoint(endSegment.getEnd(), false, isTreeExpansion);
        }
    };
    SegmentVector.prototype.UpdateVectorPoint = function (point, isStart, isTreeExpansion) {
        if (isTreeExpansion === void 0) { isTreeExpansion = false; }
        var doTreeUpdate = false;
        if (isStart && this._mStart != point) {
            this._mStart = point;
            doTreeUpdate = true;
        }
        else if (!isStart && this._mEnd != point) {
            this._mEnd = point;
            doTreeUpdate = true;
        }
        if (doTreeUpdate && this._mParentTree != null && !isTreeExpansion) {
            this._mParentTree.UpdateTreePoints();
        }
    };
    SegmentVector.prototype.AddSegmentToVector = function (segment, index) {
        if (index === void 0) { index = -1; }
        if (index == -1) {
            index = 0;
            var low = 0, high = this._mSegments.size() - 1;
            var segmentStart = segment.getStart();
            if (this._mSegments.size() == 1) {
                if (segmentStart >= this._mSegments.get(0).getStart())
                    index++;
            }
            else if (this._mSegments.size() > 1) {
                while (high - low > 1) {
                    var mid = Math.floor((low + high) / 2);
                    if (segmentStart >= this._mSegments.get(mid).getStart()) {
                        low = Math.floor(mid);
                    }
                    else {
                        high = Math.floor(mid);
                    }
                }
                var lowSegment = this._mSegments.get(low), highSegment = this._mSegments.get(high);
                if (segmentStart < lowSegment.getStart())
                    index = Math.floor(low);
                else if (segmentStart > highSegment.getStart())
                    index = high + 1;
                else
                    index = high;
            }
        }
        this._mSegments.Insert(index, segment);
        this.UpdateVectorPoints();
    };
    SegmentVector.prototype.RemoveSegmentFromVector = function (segment) {
        if (this._mSegments.size() != 0 && (segment.getSharedCoordinates().Count() == 0 || segment.getStart() === segment.getEnd())) {
            this._mSegments.Remove(segment);
            segment = null;
            this.UpdateVectorPoints();
        }
        if (this._mSegments.size() == 0)
            this._mParentTree.UpdateUnUsedVector(this._mCoord);
    };
    SegmentVector.prototype.ExpandSegmentVector = function (newTreeCoord, currentTreeCoord, isStart) {
        if (this._mSegments.size() != 0) {
            var segment = isStart ? this._mSegments.get(0) : this._mSegments.get(this._mSegments.size() - 1);
            var segPoint = isStart ? segment.getStartPoint() : segment.getEndPoint();
            var segTerminalPoint = isStart ? segment.getStart() : segment.getEnd();
            if (segTerminalPoint === currentTreeCoord && segTerminalPoint !== newTreeCoord) {
                var pt = this._mIsVertical ? new Point(segPoint.x, newTreeCoord) : new Point(newTreeCoord, segPoint.y);
                this._mParentTree.getRouter().ExtendScanSegment(segment, pt, isStart);
                segment.UpdateSegmentPoint(pt, isStart, true);
            }
        }
    };
    SegmentVector.prototype.InsertObstacle = function (bounds) {
        var top = Utility.ToRoundedInt(bounds.top()), bottom = Utility.ToRoundedInt(bounds.bottom());
        var left = Utility.ToRoundedInt(bounds.left()), right = Utility.ToRoundedInt(bounds.right());
        var segment1 = null, segment2 = null;
        var startPoint = this._mIsVertical ? new Point(this._mCoord, top) : new Point(left, this._mCoord);
        var endPoint = this._mIsVertical ? new Point(this._mCoord, bottom) : new Point(right, this._mCoord);
        var startCorner = this._mIsVertical ? top : left;
        var endCorner = this._mIsVertical ? bottom : right;
        segment1 = segment2 = this.GetScanSegment(startPoint);
        if (segment1 == null || segment1.getEnd() < endCorner)
            segment2 = this.GetScanSegment(endPoint);
        if (segment1 != null) {
            segment1.UpdateSharedCoordinates(startCorner);
            if (segment1.getEnd() < endCorner || (segment2 == null && segment1.getEnd() == endCorner))
                segment1.UpdateSharedCoordinates(segment1.getEnd());
        }
        if (segment2 != null) {
            segment2.UpdateSharedCoordinates(endCorner);
            if (segment2.getStart() > startCorner || (segment1 == null && segment2.getStart() == startCorner))
                segment2.UpdateSharedCoordinates(segment2.getStart());
        }
        var segments = this.GetScanSegmentsFromBounds(bounds, segment1, segment2);
        if (segments.size() != 0) {
            for (var i = 0; i < segments.size(); i++) {
                var segment = segments.get(i);
                if (segment != segment1 && segment != segment2) {
                    segment.UpdateSharedCoordinates(segment.getStart());
                    segment.UpdateSharedCoordinates(segment.getEnd());
                }
            }
        }
        if (segment1 != null)
            segments.Insert(0, segment1);
        if (segment1 != segment2)
            segments.Insert(segments.size(), segment2);
        return segments;
    };
    SegmentVector.prototype.RemoveObstacle_Where = function (Segments, startCorner, endCorner) {
        var segs = [];
        var count = this._mSegments.size();
        for (var i = 0; i < count; i++) {
            var segment = Segments.get(i);
            segs.push(segment);
        }
        segs.sort(function (a, b) {
            if (a.getStart() > startCorner && a.getEnd() < endCorner) {
                return 1;
            }
            else {
                return -1;
            }
        });
        var retList = new List();
        for (var i = 0; i < segs.length; i++) {
            retList.add(segs[i]);
        }
        return retList;
    };
    SegmentVector.prototype.RemoveObstacle = function (bounds, SegCollection) {
        var top = Utility.ToRoundedInt(bounds.top()), bottom = Utility.ToRoundedInt(bounds.bottom());
        var left = Utility.ToRoundedInt(bounds.left()), right = Utility.ToRoundedInt(bounds.right());
        SegCollection = new List();
        var startCorner = this._mIsVertical ? top : left;
        var endCorner = this._mIsVertical ? bottom : right;
        var segment1 = this.FindSegment(startCorner);
        var segment2 = this.FindSegment(endCorner);
        if (segment1 != null) {
            SegCollection.add(segment1);
            segment1.RemoveSharedCoordinates(startCorner);
            if (segment1.getEnd() < endCorner)
                segment1.RemoveSharedCoordinates(segment1.getEnd());
        }
        if (segment2 != null) {
            if (!SegCollection.contains(segment2))
                SegCollection.add(segment2);
            segment2.RemoveSharedCoordinates(endCorner);
            if (segment2.getStart() > startCorner)
                segment2.RemoveSharedCoordinates(segment2.getStart());
        }
        var segs = this.RemoveObstacle_Where(this._mSegments, startCorner, endCorner);
        if (segs.size() != 0) {
            for (var i = 0; i < segs.size(); i++) {
                var segment = segs.get(i);
                var keyIndex = 0;
                var sharedCoords = Object.keys(segment.getSharedCoordinates());
                while (keyIndex < sharedCoords.length) {
                    var sharedCoord = Number(sharedCoords[keyIndex]);
                    segment.RemoveSharedCoordinates(sharedCoord);
                    keyIndex++;
                }
            }
        }
        return { isRemove: false, SegCollection: SegCollection };
    };
    SegmentVector.prototype.SplitSegment = function (bounds) {
        if (this._mSegments.size() != 0) {
            var top = Utility.ToRoundedInt(bounds.top()), bottom = Utility.ToRoundedInt(bounds.bottom());
            var left = Utility.ToRoundedInt(bounds.left()), right = Utility.ToRoundedInt(bounds.right());
            var startCorner = this._mIsVertical ? top : left;
            var endCorner = this._mIsVertical ? bottom : right;
            var segment1 = null, segment2 = null;
            segment1 = segment2 = this.FindSegment(startCorner);
            if (segment1 == null || segment1.getEnd() < endCorner)
                segment2 = this.FindSegment(endCorner);
            var newfirstSegEnd = this._mIsVertical ? new Point(this._mCoord, top) : new Point(left, this._mCoord);
            var newSecSegStart = this._mIsVertical ? new Point(this._mCoord, bottom) : new Point(right, this._mCoord);
            if (segment1 != null && segment2 != null && segment1 == segment2) {
                segment2 = this.GetScanSegment_startPoint(newSecSegStart, segment1.getEndPoint(), this._mSegments.IndexOf(segment1) + 1);
                segment2.setSharedCoordinates(segment1.getSharedCoordinates().Clone());
                segment1.UpdateSegmentPoint(newfirstSegEnd, false);
            }
            else {
                if (segment1 != null)
                    segment1.UpdateSegmentPoint(newfirstSegEnd, false);
                if (segment2 != null)
                    segment2.UpdateSegmentPoint(newSecSegStart, true);
            }
            if (segment1 != null)
                segment1.RemoveNotInRangeSharedCoordinates();
            if (segment2 != null)
                segment2.RemoveNotInRangeSharedCoordinates();
            var segs = this.SplitSegment_Where(startCorner, endCorner);
            if (segs.size() != 0) {
                for (var k = 0; k < segs.size(); k++)
                    segs.get(k).getSharedCoordinates().Clear();
            }
        }
    };
    SegmentVector.prototype.SplitSegment_Where = function (startCorner, endCorner) {
        var list = new List();
        for (var i = 0; i < this._mSegments.size(); i++) {
            var obj = this._mSegments.get(i);
            if (obj.getStart() > startCorner && obj.getEnd() < endCorner)
                list.add(obj);
        }
        return list;
    };
    SegmentVector.prototype.GetScanSegmentsFromBounds = function (bounds, startSegment, endSegment) {
        var segments = new List();
        if (startSegment != null && endSegment != null && startSegment == endSegment)
            return segments;
        var perpSegmentTree = this._mParentTree.getPerpendicularTree();
        if (perpSegmentTree.getVectors().Count() != 0) {
            var startIndex = perpSegmentTree.FindIndex(bounds.topLeft().round());
            var endIndex = perpSegmentTree.FindIndex(bounds.bottomRight().round());
            var index = startIndex;
            var prevIntersectingPt = null;
            while (index < endIndex) {
                var perpSegCoord = Number(perpSegmentTree.getVectors().KeyAt(index));
                var intersectingPt = this._mIsVertical ? new Point(this._mCoord, perpSegCoord) : new Point(perpSegCoord, this._mCoord);
                if ((startSegment == null || !startSegment.Contains(intersectingPt)) && (endSegment == null || !endSegment.Contains(intersectingPt))) {
                    var perpSegmentVector = perpSegmentTree.getVectors().GetValue(perpSegCoord);
                    var perpScanSegment = perpSegmentVector.FindSegment(this._mCoord);
                    if (perpScanSegment != null) {
                        var point = this._mIsVertical ? new Point(this._mCoord, perpSegCoord + 1) : new Point(perpSegCoord + 1, this._mCoord);
                        if ((startSegment == null || !startSegment.Contains(point)) && (endSegment == null || !endSegment.Contains(point))) {
                            var segment = this.GetScanSegment(point);
                            if (segment != null && !segments.contains(segment)) {
                                if (segment.getStartPoint().equals(intersectingPt))
                                    segments.add(segment);
                                else
                                    this.RemoveSegmentFromVector(segment);
                            }
                            else if (segment == null) {
                                if (index > startIndex) {
                                    var tempPt = this._mIsVertical ? new Point(this._mCoord, perpSegCoord - 1) : new Point(perpSegCoord - 1, this._mCoord);
                                    if (prevIntersectingPt != null && tempPt.equals(prevIntersectingPt))
                                        this.GetScanSegment_startPoint(tempPt, intersectingPt);
                                }
                            }
                        }
                        prevIntersectingPt = intersectingPt;
                    }
                }
                index++;
            }
        }
        return segments;
    };
    SegmentVector.prototype.GetScanSegment = function (point) {
        var scanSegment = null;
        if (this._mSegments.size() != 0) {
            var coord = !this._mIsVertical ? Utility.ToRoundedInt(point.x) : Utility.ToRoundedInt(point.y);
            scanSegment = this.FindSegment(coord);
        }
        if (scanSegment == null && this._mParentTree != null) {
            var dir = !this._mIsVertical ? Directions.West : Directions.South;
            var segment = this._mParentTree.getRouter().GetMaximumVisibility(point, dir);
            if (segment != null) {
                var segment2 = this._mParentTree.getRouter().GetMaximumVisibility(point, Extensions.OppositeDirection(dir));
                if (segment2 != null)
                    segment.EndPoint = segment2.EndPoint;
                if (segment.StartPoint.OperatorNotEqual(segment.EndPoint)) {
                    scanSegment = new ScanSegment(segment.StartPoint, segment.EndPoint, this._mOrientation, this);
                    this.AddSegmentToVector(scanSegment);
                }
            }
        }
        return scanSegment;
    };
    SegmentVector.prototype.GetScanSegment_startPoint = function (startPoint, endPoint, insertAt) {
        if (insertAt === void 0) { insertAt = -1; }
        var scanSegment = null;
        if (insertAt == -1 && this._mSegments.size() != 0) {
            scanSegment = this.FindSegment(!this._mIsVertical ? Utility.ToRoundedInt(startPoint.x) : Utility.ToRoundedInt(startPoint.y));
            if (scanSegment == null)
                scanSegment = this.FindSegment(!this._mIsVertical ? Utility.ToRoundedInt(endPoint.x) : Utility.ToRoundedInt(endPoint.y));
        }
        if (scanSegment == null && this._mParentTree != null) {
            scanSegment = new ScanSegment(startPoint, endPoint, this._mOrientation, this);
            this.AddSegmentToVector(scanSegment, insertAt);
        }
        return scanSegment;
    };
    SegmentVector.prototype.FindSegment = function (coord) {
        var segment = null;
        if (this._mSegments.size() != 0) {
            var args = this.GetSegmentIndex(coord, segment);
            segment = args.segment;
        }
        return segment;
    };
    SegmentVector.prototype.GetSegmentIndex = function (coord, segment) {
        segment = null;
        if (this._mStart <= coord && this._mEnd >= coord) {
            var low = 0, high = this._mSegments.size() - 1, mid = -1;
            while (high - low > 1) {
                mid = Math.floor((low + high) / 2);
                if (coord >= this._mSegments.get(mid).getStart())
                    low = mid;
                else
                    high = mid;
            }
            if (low >= 0 && high >= 0) {
                if (this._mSegments.get(low).getEnd() >= coord) {
                    segment = this._mSegments.get(low);
                    return { index: low, segment: segment };
                }
                else if (this._mSegments.get(high).getStart() <= coord) {
                    segment = this._mSegments.get(high);
                    return { index: high, segment: segment };
                }
            }
        }
        return { index: -1, segment: segment };
    };
    SegmentVector.prototype.GetStart = function () {
        return this._mIsVertical ? new Point(this._mCoord, this._mStart) : new Point(this._mStart, this._mCoord);
    };
    SegmentVector.prototype.GetEnd = function () {
        return this._mIsVertical ? new Point(this._mCoord, this._mEnd) : new Point(this._mEnd, this._mCoord);
    };
    return SegmentVector;
}());
var ScanSegment = (function () {
    function ScanSegment(startPoint, endPoint, orientation, parentVector) {
        this._mIsVertical = false;
        this._mStart = 0;
        this._mEnd = 0;
        this._mStartPoint = startPoint.round();
        this._mEndPoint = endPoint.round();
        this._mSharedCoordinates = new SortedList();
        this._mParentVector = parentVector;
        this._mOrientation = orientation;
        this._mIsVertical = this._mOrientation == SegmentOrientation.Vertical;
        this._mStart = this._mIsVertical ? this._mStartPoint.y : this._mStartPoint.x;
        this._mEnd = this._mIsVertical ? this._mEndPoint.y : this._mEndPoint.x;
    }
    ScanSegment.prototype.getStart = function () {
        return Math.floor(this._mStart);
    };
    ScanSegment.prototype.getEnd = function () {
        return Math.floor(this._mEnd);
    };
    ScanSegment.prototype.getStartPoint = function () {
        return this._mStartPoint;
    };
    ScanSegment.prototype.getEndPoint = function () {
        return this._mEndPoint;
    };
    ScanSegment.prototype.getOrientation = function () {
        return this._mOrientation;
    };
    ScanSegment.prototype.getIsVertical = function () {
        return this._mIsVertical;
    };
    ScanSegment.prototype.getSharedCoordinates = function () {
        return this._mSharedCoordinates;
    };
    ScanSegment.prototype.setSharedCoordinates = function (value) {
        this._mSharedCoordinates = value != null ? value : new SortedList();
    };
    ScanSegment.prototype.getParentVector = function () {
        return this._mParentVector;
    };
    ScanSegment.prototype.Contains = function (pt) {
        var temptPt = this._mIsVertical ? Utility.ToRoundedInt(pt.y) : Utility.ToRoundedInt(pt.x);
        return temptPt >= this._mStart && temptPt <= this._mEnd;
    };
    ScanSegment.prototype.UpdateSegmentPoint = function (point, isStart, isTreeExpansion) {
        if (isTreeExpansion === void 0) { isTreeExpansion = false; }
        var doVectorUpdate = false;
        point = point.round();
        if (isStart && !this._mStartPoint.equals(point)) {
            this._mStartPoint = point;
            this._mStart = this._mIsVertical ? this._mStartPoint.y : this._mStartPoint.x;
            doVectorUpdate = true;
        }
        else if (!isStart && !this._mEndPoint.equals(point)) {
            this._mEndPoint = point;
            this._mEnd = this._mIsVertical ? this._mEndPoint.y : this._mEndPoint.x;
            doVectorUpdate = true;
        }
        if (doVectorUpdate && this._mParentVector != null) {
            this._mParentVector.UpdateVectorPoints(isTreeExpansion);
        }
    };
    ScanSegment.prototype.UpdateSharedCoordinates = function (value) {
        if (this._mSharedCoordinates.ContainsKey(value)) {
            this._mSharedCoordinates.Update(value, this._mSharedCoordinates.GetValue(value) + 1);
        }
        else
            this._mSharedCoordinates.Add(1, value);
    };
    ScanSegment.prototype.RemoveSharedCoordinates = function (value) {
        if (this._mSharedCoordinates.ContainsKey(value)) {
            this._mSharedCoordinates.Update(value, this._mSharedCoordinates.GetValue(value) - 1);
            if (this._mSharedCoordinates.GetValue(value) == 0)
                this._mSharedCoordinates.Remove(value);
        }
    };
    ScanSegment.prototype.RemoveNotInRangeSharedCoordinates = function () {
        if ((this._mSharedCoordinates.Count()) != 0) {
            var segStart = this._mStart, segEnd = this._mEnd;
            var coordRemovedNearToStart = null, coordRemovedNearToEnd = null;
            if (segStart === (segEnd))
                this._mSharedCoordinates.Clear();
            else {
                var index = 0;
                while (index < (this._mSharedCoordinates.Count())) {
                    var coord = Number(this._mSharedCoordinates.KeyAt(index));
                    if (coord < segStart || coord > segEnd) {
                        if (this._mSharedCoordinates.ContainsKey(coord))
                            this._mSharedCoordinates.Remove(coord);
                        if (coord < segStart)
                            coordRemovedNearToStart = coord;
                        else if (coordRemovedNearToEnd == null)
                            coordRemovedNearToEnd = coord;
                    }
                    else
                        index++;
                }
                if (this._mSharedCoordinates.Count() % 2 != 0) {
                    if (coordRemovedNearToStart != null) {
                        var currentStartingCoord = Number(this._mSharedCoordinates.KeyAt(0));
                        if (currentStartingCoord > segStart)
                            this.UpdateSharedCoordinates(segStart);
                        else if (currentStartingCoord == segStart)
                            this.RemoveSharedCoordinates(segStart);
                    }
                    if (coordRemovedNearToEnd != null) {
                        var currentEndingCoord = Number(this._mSharedCoordinates.KeyAt(this._mSharedCoordinates.Count() - 1));
                        if (currentEndingCoord < segEnd)
                            this.UpdateSharedCoordinates(segEnd);
                        else if (currentEndingCoord == segEnd)
                            this.RemoveSharedCoordinates(segEnd);
                    }
                }
            }
        }
    };
    return ScanSegment;
}());
var VisibilityGraphGeneration = (function () {
    function VisibilityGraphGeneration() {
    }
    VisibilityGraphGeneration.getRouter = function () {
        return this.router;
    };
    VisibilityGraphGeneration.setRouter = function (value) {
        this.router = value;
    };
    VisibilityGraphGeneration.GetVertices = function () {
        var __result = new Array();
        if (this.router.graph) {
            var Vertices = this.router.graph.getVertices();
            for (var i = 0; i < Vertices.length; i++) {
                __result.push(new Point(Vertices[i].Point.x, Vertices[i].Point.y));
            }
        }
        return __result;
    };
    VisibilityGraphGeneration.GetSegmentTree = function () {
        var __result = [];
        var pt = new Point(this.router.getHorizontalSegmentTree().getStart(), this.router.getVerticalSegmentTree().getStart());
        var nodeTemplate = ej.util.getObject("drawLine", window);
        for (var i = 0; i < (this.router.getHorizontalSegmentTree().getVectors().Count()); i++) {
            var vector = this.router.getHorizontalSegmentTree().getVectors().GetValue(this.router.getHorizontalSegmentTree().getVectors().KeyAt(i));
            for (var j = 0; j < vector.getSegments().size(); j++) {
                var seg = vector.getSegments().get(j);
                var start = seg.getStartPoint();
                var end = seg.getEndPoint();
                nodeTemplate(new Tuple(new Point(start.x, start.y), new Point(end.x, end.y)));
            }
        }
        for (var i = 0; i < (this.router.getVerticalSegmentTree().getVectors().Count()); i++) {
            var vector = this.router.getVerticalSegmentTree().getVectors().GetValue(this.router.getVerticalSegmentTree().getVectors().KeyAt(i));
            for (var j = 0; j < vector.getSegments().size(); j++) {
                seg = vector.getSegments().get(j);
                var start = seg.getStartPoint();
                var end = seg.getEndPoint();
                nodeTemplate(new Tuple(new Point(start.x, start.y), new Point(end.x, end.y)));
            }
        }
        return __result;
    };
    VisibilityGraphGeneration.GetEdges = function () {
        var __result = new Array();
        if (this.router.graph) {
            var edges = this.router.graph.getEdges();
            for (var i = 0; i < edges.size(); i++) {
                var edge = (edges.get(i));
                __result.push(new Tuple(new Point(edge.getSource().Point.x, edge.getSource().Point.y), new Point(edge.getTarget().Point.x, edge.getTarget().Point.y)));
            }
        }
        return __result;
    };
    VisibilityGraphGeneration.router = new Router();
    return VisibilityGraphGeneration;
}());
var IObstaclePort = (function () {
    function IObstaclePort() {
    }
    IObstaclePort.prototype.getLocation = function () {
        return this.Location;
    };
    IObstaclePort.prototype.setLocation = function (value) {
        this.Location = value;
    };
    IObstaclePort.prototype.getDirection = function () {
        return this.Direction;
    };
    IObstaclePort.prototype.setDirection = function (value) {
        this.Direction = value;
    };
    return IObstaclePort;
}());
var Obstacle = (function () {
    function Obstacle() {
        this.isBorder = false;
    }
    Obstacle.prototype.getPaddedBounds = function () {
        return this._mPaddedRegion;
    };
    Obstacle.prototype.setPaddedBounds = function (value) {
        this._mPaddedRegion = value;
        if (this._mPaddedRegion != null && this._mPaddedRegion != Rect.empty) {
            var rect = this._mPaddedRegion;
            this.topLeft = new PolylinePoint(rect.topLeft());
            this.topRight = new PolylinePoint(rect.topRight());
            this.bottomLeft = new PolylinePoint(rect.bottomLeft());
            this.bottomRight = new PolylinePoint(rect.bottomRight());
            if (this._mActualBounds != null) {
                var region = this._mActualBounds;
                if (region.width == 0) {
                    this.topLeft.setNext(this.bottomLeft);
                    this.topLeft.setPrev(this.bottomLeft);
                    this.topRight.setNext(this.bottomLeft);
                    this.topRight.setPrev(this.bottomLeft);
                    this.bottomLeft.setNext(this.topLeft);
                    this.bottomLeft.setPrev(this.topLeft);
                    this.bottomRight.setNext(this.topLeft);
                    this.bottomRight.setPrev(this.topLeft);
                }
                else if (region.height == 0) {
                    this.topLeft.setNext(this.topRight);
                    this.topLeft.setPrev(this.topRight);
                    this.bottomLeft.setNext(this.topRight);
                    this.bottomLeft.setPrev(this.topRight);
                    this.topRight.setNext(this.topLeft);
                    this.topRight.setPrev(this.topLeft);
                    this.bottomRight.setNext(this.topLeft);
                    this.bottomRight.setPrev(this.topLeft);
                }
                else {
                    this.topLeft.setPrev(this.topRight);
                    this.topRight.setPrev(this.bottomRight);
                    this.bottomRight.setPrev(this.bottomLeft);
                    this.bottomLeft.setPrev(this.topLeft);
                    this.topLeft.setNext(this.bottomLeft);
                    this.bottomLeft.setNext(this.bottomRight);
                    this.bottomRight.setNext(this.topRight);
                    this.topRight.setNext(this.topLeft);
                }
                this.StartVertex = this.topLeft;
            }
        }
    };
    Obstacle.prototype.getActualBounds = function () {
        return this._mActualBounds;
    };
    Obstacle.prototype.setActualBounds = function (value) {
        this._mActualBounds = value;
    };
    Obstacle.prototype._obstacle = function (region, padding, isObject) {
        if (padding === void 0) { padding = 12; }
        if (isObject === void 0) { isObject = true; }
        if (isObject == false) {
            this.isBorder = true;
        }
        this.SetRegion(region, padding);
        return this;
    };
    Obstacle.prototype.CreateInitialSides = function (start, direction) {
        this.LowSide = new ObstacleSide(this, start, direction, ScanDirection.Right == direction);
        this.LowSide.SideType = ObstacleSideType.Low;
        this.HighSide = new ObstacleSide(this, start, direction, ScanDirection.Top == direction);
        this.HighSide.SideType = ObstacleSideType.High;
        if (Utility.CheckWithScanDirection(direction, this.HighSide.getStart(), this.HighSide.getEnd())) {
            this.HighSide = new ObstacleSide(this, direction == ScanDirection.Right ? this.topRight : this.bottomLeft, direction, ScanDirection.Top == direction);
            this.HighSide.SideType = ObstacleSideType.High;
        }
    };
    Obstacle.prototype.SetRegion = function (region, padding) {
        if (padding === void 0) { padding = 12; }
        this.setActualBounds(region);
        if (this.isBorder == false) {
            region.Inflate(padding).round();
        }
        this.setPaddedBounds(new Rect(Math.round(region.x), Math.round(region.y), Math.round(region.width), Math.round(region.height)));
    };
    return Obstacle;
}());
var ObstacleSide = (function () {
    function ObstacleSide(obstacle, startVertex, scanDir, traverseClockwise) {
        this.StartVertex = startVertex;
        this._obstacle = obstacle;
        this._mEndVertex = traverseClockwise ? startVertex.getNext() : startVertex.getPrev();
    }
    ObstacleSide.prototype.getEndVertex = function () {
        return this._mEndVertex;
    };
    ObstacleSide.prototype.setEndVertex = function (value) {
        this._mEndVertex = value;
    };
    ObstacleSide.prototype.getStart = function () {
        return this.StartVertex.Point;
    };
    ObstacleSide.prototype.getEnd = function () {
        return this.getEndVertex().Point;
    };
    return ObstacleSide;
}());
var CenterPort = (function () {
    function CenterPort(point) {
        this.Entrances = new List();
        this.VisibilityRectangle = Rect.empty;
        this.Location = point;
        this._mLocation = point;
    }
    CenterPort.prototype.AddPortEntrance = function (tree, point, node, direction) {
        var entrance = new PortEntrance(this, point, node, direction, tree);
        if (entrance.getCanExtend()) {
            this.Entrances.add(entrance);
            this.VisibilityRectangle.unitePoint(entrance.MaxVisibilitySegment.EndPoint);
        }
    };
    CenterPort.prototype.getLocation = function () {
        return this.Location.round();
    };
    CenterPort.prototype.setLocation = function (value) {
        this.Location = value;
    };
    CenterPort.prototype.getDirection = function () {
        return this.Direction;
    };
    CenterPort.prototype.setDirection = function (value) {
        this.Direction = value;
    };
    return CenterPort;
}());
var ObstaclePort = (function () {
    function ObstaclePort(location, direction) {
        this.Location = this._mLocation = location;
        this.Direction = this._mPortDirection = direction;
    }
    ObstaclePort.prototype.getLocation = function () {
        return this.Location.round();
    };
    ObstaclePort.prototype.setLocation = function (value) {
        this.Location = value;
    };
    ObstaclePort.prototype.getDirection = function () {
        return this.Direction;
    };
    ObstaclePort.prototype.setDirection = function (value) {
        this.Direction = value;
    };
    return ObstaclePort;
}());
var PortEntrance = (function () {
    function PortEntrance(port, location, node, direction, tree) {
        this.Port = port;
        this.Location = location;
        this.Direction = direction;
        var curDirection = Extensions.GetEquivalentDirection(direction);
        var pad = tree.ObstaclePadding;
        var startPoint = location;
        var endPoint = Utility.IntersectionWithRectangleBorder(tree.Rectangle, location, Extensions.GetEquivalentDirection(direction));
        var segment = new Segment(startPoint, endPoint);
        var firstHit;
        var args = tree.FindMaximumVisibility_hitNode(segment, node, null, firstHit, true);
        firstHit = args.hitNode;
        var newDirection = segment.StartPoint.FindDirection(segment.EndPoint);
        if (curDirection != newDirection) {
            segment.EndPoint = location;
        }
        this.FirstHit = firstHit;
        this.MaxVisibilitySegment = segment;
    }
    PortEntrance.prototype.getCanExtend = function () {
        return Extensions.FindDirection(this.MaxVisibilitySegment.StartPoint, this.MaxVisibilitySegment.EndPoint) != Directions.None;
    };
    PortEntrance.prototype.getWantVisibilityIntersection = function () {
        return this.getCanExtend();
    };
    PortEntrance.prototype.getIsVertical = function () {
        return this.Direction == PortDirection.Top || this.Direction == PortDirection.Bottom;
    };
    return PortEntrance;
}());
var PortManager = (function () {
    function PortManager(horizontalTree, verticalTree, obstacleTree, graph, geometry, padding) {
        this.visibilityGraph = null;
        this.padding = 0;
        this.canRoute = false;
        this.temporaryAddition = true;
        this.InitialWeight = 1;
        this.NormalWeight = 1;
        this.edgesToRestore = new List();
        this.addedEdges = new List();
        this.addedVertices = new List();
        this.lastExtendedVertex = null;
        this.HorizontalScanSegmentTree = horizontalTree;
        this.VerticalScanSegmentTree = verticalTree;
        this.visibilityGraph = graph;
        this.targetGeometry = geometry;
        this.padding = padding;
        this.ObstacleTree = obstacleTree;
    }
    PortManager.prototype.AddControlPointsToGraph = function (geometry) {
        this.addedEdges = new List();
        this.addedVertices = new List();
        this.canRoute = true;
        this.targetGeometry.Connector = geometry;
        this.targetGeometry.CurrentEnd = ConnectionEnd.Source;
        if (geometry._sourceNodeInfo != null) {
            this.AddEndPointToGraph(geometry._sourcePortInfo, geometry._sourceNodeInfo);
        }
        else {
            this.AddEndPointToGraph(geometry._sourcePointInfo, geometry._sourceNodeInfo);
        }
        if (this.canRoute) {
            this.targetGeometry.CurrentEnd = ConnectionEnd.Target;
            if (geometry._targetNodeInfo != null) {
                this.AddEndPointToGraph(geometry._targetPortInfo, geometry._targetNodeInfo);
            }
            else {
                this.AddEndPointToGraph(geometry._targetPointInfo, geometry._targetNodeInfo);
            }
        }
        return this.canRoute;
    };
    PortManager.prototype.AddEndPointToGraph = function (port, node) {
        if ((port == null || port instanceof IObstaclePort) && (node instanceof IObstacle || (node && (node._type === "node" || node.type === "bpmn")))) {
            if (port == null) {
                this.AddFreePointToGraph(node);
            }
            else {
                this.canRoute = this.AddPortToGraph(port, node);
            }
        }
        else if (port != null) {
            this.canRoute = this.AddPortToGraph(port, node);
        }
    };
    PortManager.prototype.AddPortToGraph = function (port, endNode) {
        return this.AddPortToGraph_portDirection(port.getLocation(), port.getDirection(), endNode);
    };
    PortManager.prototype.AddPortToGraph_portDirection = function (portLocation, portDirection, endNode) {
        var point = new Point(Utility.ToRoundedInt(portLocation.x), Utility.ToRoundedInt(portLocation.y));
        var vertex;
        if (this.ObstacleTree.Rectangle.containsPoint(point)) {
            vertex = this.AddVertex(point);
            var direction = portDirection;
            var perpSegment = null;
            var isHorizontal = false;
            if (Extensions.GetOrientation_PortDirection(direction) == Orientation.Horizontal) {
                isHorizontal = true;
            }
            perpSegment = this.FindTheClosestPerpendicularEdge(point, portDirection);
            var segment = new Segment(point, Utility.IntersectionWithRectangleBorder(this.ObstacleTree.Rectangle, point, Extensions.GetEquivalentDirection(portDirection)));
            if (this.ObstacleTree.RestrictSegmentWithinFreeSpace(this.targetGeometry.Connector, segment, endNode)) {
                var nextPoint;
                if (perpSegment != null) {
                    var intersectingPt = this.GetIntersectingPoint(perpSegment, point, !isHorizontal);
                    if (segment.Contains(intersectingPt)) {
                        nextPoint = intersectingPt;
                        var target = this.AddVertex(intersectingPt);
                        if (vertex.Point.OperatorNotEqual(intersectingPt))
                            this.ConnectVertices_vertex(vertex, target, this.InitialWeight);
                        this.AddEdgeToClosestPerpSegment(perpSegment, intersectingPt, true);
                        this.ExtendTheEdgeToAdjacentEdges(nextPoint, portDirection, segment, !isHorizontal);
                        return true;
                    }
                    else if (endNode != null) {
                        var edgePt = Utility.IntersectionWithRectangleBorder(endNode._outerBounds, point, Extensions.GetEquivalentDirection(portDirection));
                        var distanceBtwnEndPoint = Math.abs(edgePt.distance(segment.EndPoint));
                        if (segment.Contains(edgePt) && distanceBtwnEndPoint < 2 * this.padding && distanceBtwnEndPoint >= 4) {
                            nextPoint = Extensions.Transform(edgePt, distanceBtwnEndPoint / 2, Extensions.GetEquivalentDirection(portDirection));
                            var target = this.AddVertex(nextPoint);
                            if (vertex.Point.OperatorNotEqual(nextPoint))
                                this.ConnectVertices_vertex(vertex, target, this.InitialWeight);
                            this.AddEdgesToParallelSegments(nextPoint, Extensions.GetOrientation_PortDirection(portDirection), segment, endNode);
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    };
    PortManager.prototype.AddCornerToVisibilityGraph = function (port, endNode, preference) {
        if (preference === void 0) { preference = null; }
        this.lastExtendedVertex = null;
        var point = port.getLocation();
        var portDirection = port.getDirection();
        var portLocation = point;
        var vertex;
        if (this.ObstacleTree.Rectangle.containsPoint(point)) {
            this.SegmentStartPoint = this.SegmentEndPoint = point;
            vertex = this.AddVertex(point);
            var direction = portDirection;
            var perpSegment = null;
            var isHorizontal = false;
            if (Extensions.GetOrientation_PortDirection(direction) == Orientation.Horizontal) {
                isHorizontal = true;
            }
            perpSegment = this.FindTheClosestPerpendicularEdge(point, portDirection);
            var segment = new Segment(point, Utility.IntersectionWithRectangleBorder(this.ObstacleTree.Rectangle, point, Extensions.GetEquivalentDirection(portDirection)));
            if (this.ObstacleTree.RestrictSegmentWithinFreeSpace(this.targetGeometry.Connector, segment, endNode)) {
                var nextPoint;
                if (perpSegment != null) {
                    var intersectingPt = this.GetIntersectingPoint(perpSegment, point, !isHorizontal);
                    if (segment.Contains(intersectingPt)) {
                        nextPoint = intersectingPt;
                        var target = this.AddVertex(intersectingPt);
                        this.lastExtendedVertex = target;
                        if (vertex.Point.OperatorNotEqual(intersectingPt))
                            this.ConnectVertices_vertex(vertex, target, this.InitialWeight);
                        this.AddEdgeToClosestPerpSegment(perpSegment, intersectingPt, true);
                        this.ExtendTheEdgeToAdjacentEdges(nextPoint, portDirection, segment, !isHorizontal, preference);
                        if (this.lastExtendedVertex != null)
                            this.SegmentEndPoint = this.lastExtendedVertex.Point;
                        return;
                    }
                }
                this.ExtendTheEdgeToAdjacentEdges(portLocation, portDirection, segment, !isHorizontal, preference);
                if (this.lastExtendedVertex != null)
                    this.SegmentEndPoint = this.lastExtendedVertex.Point;
            }
        }
    };
    PortManager.prototype.GetStartVertexPoint = function (point, isHorizontal) {
        if (isHorizontal) {
            if (point.x == this.ObstacleTree.Rectangle.x - 1) {
                return new Point(point.x + 1, point.y);
            }
        }
        else {
            if (point.y == this.ObstacleTree.Rectangle.y - 1) {
                return new Point(point.x, point.y + 1);
            }
        }
        return point;
    };
    PortManager.prototype.GetEndVertexPoint = function (point, isHorizontal) {
        if (isHorizontal) {
            if (point.x == this.ObstacleTree.Rectangle.right() + 1) {
                return new Point(point.x - 1, point.y);
            }
        }
        else {
            if (point.y == this.ObstacleTree.Rectangle.bottom() + 1) {
                return new Point(point.x, point.y - 1);
            }
        }
        return point;
    };
    PortManager.prototype.GetStartSegmentPoint = function (point, isHorizontal, force) {
        if (force === void 0) { force = false; }
        if (isHorizontal) {
            if (point.x == this.ObstacleTree.Rectangle.x || force) {
                return new Point(point.x - 1, point.y);
            }
        }
        else {
            if (point.y == this.ObstacleTree.Rectangle.y || force) {
                return new Point(point.x, point.y - 1);
            }
        }
        return point;
    };
    PortManager.prototype.GetEndSegmentPoint = function (point, isHorizontal, force) {
        if (force === void 0) { force = false; }
        if (isHorizontal) {
            if (point.x == this.ObstacleTree.Rectangle.right() || force) {
                return new Point(point.x + 1, point.y);
            }
        }
        else {
            if (point.y == this.ObstacleTree.Rectangle.bottom() || force) {
                return new Point(point.x, point.y + 1);
            }
        }
        return point;
    };
    PortManager.prototype.FindTheClosestPerpendicularEdge = function (point, direction) {
        var perpSegment = null;
        var intersectingSegments = Extensions.GetOrientation_PortDirection(direction) == Orientation.Horizontal ? this.VerticalScanSegmentTree : this.HorizontalScanSegmentTree;
        switch (direction) {
            case PortDirection.Bottom:
            case PortDirection.Right:
                var _point = intersectingSegments.FindFirst(point);
                perpSegment = _point ? _point : intersectingSegments.FindScanSegment(point);
                break;
            case PortDirection.Left:
            case PortDirection.Top:
                _point = intersectingSegments.FindLast(point);
                perpSegment = _point ? _point : intersectingSegments.FindScanSegment(point);
                break;
        }
        return perpSegment;
    };
    PortManager.prototype.AddFreePointToGraph = function (node) {
        var port = node._obstacle.CenterPort;
        if (port.Entrances == null || port.Entrances.size() == 0) {
            this.CreatePortEntrances(node, port, node._obstacle);
        }
        this.canRoute = false;
        for (var i = 0; i < port.Entrances.size(); i++) {
            var entrance = port.Entrances.get(Number(i));
            if (this.AddPortToGraph_portDirection(entrance.Location, entrance.Direction, node)) {
                this.canRoute = true;
            }
        }
    };
    PortManager.prototype.AddEdgesToParallelSegments = function (point, orientation, segment, endNode) {
        var lowSide, highSide;
        var isHorizontal = false;
        var scanSegmentTree = orientation == Orientation.Horizontal ? this.HorizontalScanSegmentTree : this.VerticalScanSegmentTree;
        lowSide = scanSegmentTree.FindLast(point);
        highSide = scanSegmentTree.FindFirst(point);
        var lowDirection, highDirection;
        if (orientation == Orientation.Horizontal) {
            isHorizontal = true;
            lowDirection = PortDirection.Top;
            highDirection = PortDirection.Bottom;
        }
        else {
            isHorizontal = false;
            lowDirection = PortDirection.Left;
            highDirection = PortDirection.Right;
        }
        if (lowSide != null) {
            this.ConnectToParallelEdge(lowSide, point, lowDirection, isHorizontal, endNode);
        }
        if (highSide != null) {
            this.ConnectToParallelEdge(highSide, point, highDirection, isHorizontal, endNode);
        }
    };
    PortManager.prototype.ConnectToParallelEdge = function (segment, start, portDirection, isHorizontal, endNode) {
        var intersect = this.GetIntersectingPoint(segment, start, isHorizontal);
        var borderIntersect = Utility.IntersectionWithRectangleBorder(this.ObstacleTree.Rectangle, intersect, Extensions.GetEquivalentDirection(portDirection));
        var parallelSeg = new Segment(start, borderIntersect);
        var portEntrance = this.targetGeometry.GetCurrentEntrance();
        if (portEntrance != null &&
            this.ObstacleTree.RestrictSegmentWithinFreeSpace(this.targetGeometry.Connector, parallelSeg, endNode, portEntrance.FirstHit) && parallelSeg.Contains(intersect)) {
            this.AddVertexAndEdges(start, intersect, 1);
            this.AddEdgeToClosestPerpSegment(segment, intersect, true);
            this.ExtendTheEdgeToAdjacentEdges(intersect, portDirection, parallelSeg, false);
        }
    };
    PortManager.prototype.AddEdgeToClosestPerpSegment = function (nearestSeg, intersectPt, isOverlapped) {
        if (nearestSeg.getStartPoint().equals(intersectPt) || nearestSeg.getEndPoint().equals(intersectPt))
            return;
        if (intersectPt.FindDirection(nearestSeg.getStartPoint()) == nearestSeg.getStartPoint().FindDirection(nearestSeg.getEndPoint())) {
            this.AddVertexAndEdges(intersectPt, nearestSeg.getStartPoint(), isOverlapped ? this.InitialWeight : this.NormalWeight);
        }
        else if (nearestSeg.getEndPoint().FindDirection(intersectPt) == nearestSeg.getStartPoint().FindDirection(nearestSeg.getEndPoint())) {
            this.AddVertexAndEdges(nearestSeg.getEndPoint(), intersectPt, isOverlapped ? this.InitialWeight : this.NormalWeight);
        }
        else {
            var dir = nearestSeg.getIsVertical() ? Directions.North : Directions.East;
            var vertex = this.visibilityGraph.FindVertex(nearestSeg.getStartPoint());
            var prev = null;
            while (vertex != null) {
                if (vertex.Point.equals(intersectPt))
                    break;
                else {
                    if (prev != null && prev.Point.FindDirection(intersectPt) == intersectPt.FindDirection(vertex.Point)) {
                        var edge = this.visibilityGraph.FindEdge(prev.Point, vertex.Point);
                        if (edge != null) {
                            if (!(edge instanceof DynamicEdge) && this.temporaryAddition)
                                this.edgesToRestore.add(edge);
                            this.visibilityGraph.RemoveEdge_edge(edge, true);
                        }
                        var vertexAtIntersectPt = this.AddVertex(intersectPt);
                        this.ConnectVertices_vertex(prev, vertexAtIntersectPt, 1);
                        this.ConnectVertices_vertex(vertexAtIntersectPt, vertex, 1);
                        return;
                    }
                }
                prev = vertex;
                vertex = vertex.FindNextVertex(dir);
            }
            this.AddVertexAndEdges(nearestSeg.getStartPoint(), intersectPt, isOverlapped ? this.InitialWeight : this.NormalWeight);
        }
    };
    PortManager.prototype.AddVertexToSegment = function (segment, newVertex) {
        if (newVertex.Point.equals(segment.getStartPoint()) || newVertex.Point.equals(segment.getEndPoint()))
            return;
        var dir = segment.getIsVertical() ? Directions.North : Directions.East;
        var nextVertex = newVertex.FindNextVertex(dir);
        if (nextVertex == null) {
            var prevVertex = newVertex.FindNextVertex(Extensions.OppositeDirection(dir));
            if (prevVertex == null) {
                var vector = segment.getParentVector();
                var perpSegmentTree = vector.getParentTree().getPerpendicularTree();
                var edge = perpSegmentTree.GetEdgePassingThroughVertex(newVertex, vector.getCoord());
                if (edge != null) {
                    prevVertex = edge.getSource();
                    nextVertex = edge.getTarget();
                    edge.ResetFields(prevVertex, newVertex, dir, 1);
                    this.visibilityGraph.CreateEdge(newVertex, nextVertex, dir, 1);
                }
            }
        }
    };
    PortManager.prototype.RemoveVertexFromSegment = function (segment, intersectPt) {
        var dir = segment.getIsVertical() ? Directions.North : Directions.East;
        if (intersectPt.equals(segment.getStartPoint())) {
            var vertex = this.visibilityGraph.FindVertex(segment.getStartPoint());
            if (vertex != null) {
                var nextVertex = vertex.FindNextVertex(dir);
                if (nextVertex != null) {
                    this.visibilityGraph.RemoveEdge(vertex, nextVertex);
                    segment.UpdateSegmentPoint(nextVertex.Point, true);
                }
            }
        }
        else if (intersectPt.equals(segment.getEndPoint())) {
            var vertex = this.visibilityGraph.FindVertex(segment.getEndPoint());
            if (vertex != null) {
                var prevVertex = vertex.FindNextVertex(Extensions.OppositeDirection(dir));
                if (prevVertex != null) {
                    this.visibilityGraph.RemoveEdge(prevVertex, vertex);
                    segment.UpdateSegmentPoint(prevVertex.Point, false);
                }
            }
        }
        else {
            var prev = null;
            var vertex = this.visibilityGraph.FindVertex(segment.getStartPoint());
            while (vertex != null) {
                var nextVertex = vertex.FindNextVertex(dir);
                if (prev != null && nextVertex != null && vertex.Point.equals(intersectPt)) {
                    this.visibilityGraph.RemoveEdge(prev, vertex);
                    this.visibilityGraph.RemoveEdge(vertex, nextVertex);
                    this.ConnectVertices_vertex(prev, nextVertex);
                    break;
                }
                prev = vertex;
                vertex = nextVertex;
            }
        }
    };
    PortManager.prototype.RemoveVertexFromSegment_vertex = function (segment, vertexToRemove) {
        if (vertexToRemove != null) {
            var dir = segment.getIsVertical() ? Directions.North : Directions.East;
            if (vertexToRemove.Point.equals(segment.getStartPoint())) {
                var nextVertex = vertexToRemove.FindNextVertex(dir);
                if (nextVertex != null) {
                    this.visibilityGraph.RemoveEdge(vertexToRemove, nextVertex);
                    segment.UpdateSegmentPoint(nextVertex.Point, true);
                    segment.RemoveNotInRangeSharedCoordinates();
                }
            }
            else if (vertexToRemove.Point.equals(segment.getEndPoint())) {
                var prevVertex = vertexToRemove.FindNextVertex(Extensions.OppositeDirection(dir));
                if (prevVertex != null) {
                    this.visibilityGraph.RemoveEdge(prevVertex, vertexToRemove);
                    segment.UpdateSegmentPoint(prevVertex.Point, false);
                    segment.RemoveNotInRangeSharedCoordinates();
                }
            }
            else {
                this.DisconnectVertexInDirection(vertexToRemove, dir);
            }
        }
    };
    PortManager.prototype.DisconnectVertexInDirection = function (vertexToRemove, direction) {
        var nextVertex = vertexToRemove.FindNextVertex(direction);
        var prevVertex = vertexToRemove.FindNextVertex(Extensions.OppositeDirection(direction));
        if (nextVertex != null && prevVertex != null) {
            this.visibilityGraph.RemoveEdge(prevVertex, vertexToRemove);
            var edge = this.visibilityGraph.FindEdge_vertex(vertexToRemove, nextVertex);
            if (edge) {
                edge.ClearProperties();
                edge.ResetFields(prevVertex, nextVertex, direction);
                return true;
            }
        }
        return false;
    };
    PortManager.prototype.ExtendTheEdgeToAdjacentEdges = function (start, direction, segment, isOverlapped, preference) {
        if (preference === void 0) { preference = null; }
        var startVertex = this.visibilityGraph.FindVertex(start);
        if (startVertex != null) {
            var dirToExtend = Extensions.GetEquivalentDirection(direction);
            var sourceDirection, targetDirection;
            sourceDirection = preference != null ? preference : Extensions.Left(dirToExtend);
            var sourceVertex = startVertex.FindNextVertex(sourceDirection);
            if (sourceVertex == null) {
                sourceDirection = Extensions.OppositeDirection(sourceDirection);
            }
            targetDirection = Extensions.OppositeDirection(sourceDirection);
            if (!this.ExtendEdge(startVertex, dirToExtend, sourceDirection, targetDirection, isOverlapped, segment)) {
                this.ExtendEdge(startVertex, dirToExtend, targetDirection, sourceDirection, isOverlapped, segment);
            }
        }
    };
    PortManager.prototype.AddVertexAndEdges = function (start, next, weight) {
        this.ConnectVertices_vertex(this.AddVertex(start), this.AddVertex(next), weight);
    };
    PortManager.prototype.ConnectVertices = function (start, end, weight) {
        if (weight === void 0) { weight = 1; }
        this.ConnectVertices_vertex(this.AddVertex(start), this.AddVertex(end), 1);
    };
    PortManager.prototype.ExtendEdge = function (startVertex, dirToExtend, sourceDirection, targetDirection, isOverlapped, visibilitySegment) {
        isOverlapped = false;
        var firstSegmentLength = 0;
        var isHorizontal = (dirToExtend == Directions.East || dirToExtend == Directions.West) ? true : false;
        var source = startVertex.FindNextVertex(sourceDirection);
        var target = null;
        var nextExtendVertex = null;
        var extendedEdgeCount = 0;
        var considerOppositeEdgeToo = false;
        if (source != null) {
            for (;;) {
                var args = this.GetNextSource(source, dirToExtend, source);
                source = args.source;
                if (!args.nextSource) {
                    break;
                }
                var nextExtendPoint = this.FindBendPoint(startVertex, source, isHorizontal);
                nextExtendVertex = null;
                if (visibilitySegment.StartPoint.FindDirection(nextExtendPoint) == nextExtendPoint.FindDirection(visibilitySegment.EndPoint) || visibilitySegment.StartPoint.equals(nextExtendPoint) || visibilitySegment.EndPoint.equals(nextExtendPoint)) {
                    nextExtendVertex = this.AddVertex(nextExtendPoint);
                    this.lastExtendedVertex = nextExtendVertex;
                }
                else {
                    if (dirToExtend == Directions.East) {
                        var lastSegment = this.VerticalScanSegmentTree.FindLast(visibilitySegment.EndPoint);
                        if (lastSegment != null) {
                            nextExtendPoint = new Point(lastSegment.getStartPoint().x, nextExtendPoint.y);
                            nextExtendVertex = this.AddVertex(nextExtendPoint);
                            this.lastExtendedVertex = nextExtendVertex;
                        }
                    }
                    else if (dirToExtend == Directions.West) {
                        var lastSegment = this.VerticalScanSegmentTree.FindFirst(visibilitySegment.EndPoint);
                        if (lastSegment != null) {
                            nextExtendPoint = new Point(lastSegment.getStartPoint().x, nextExtendPoint.y);
                            nextExtendVertex = this.AddVertex(nextExtendPoint);
                            this.lastExtendedVertex = nextExtendVertex;
                        }
                    }
                    else if (dirToExtend == Directions.South) {
                        var lastSegment = this.HorizontalScanSegmentTree.FindFirst(visibilitySegment.EndPoint);
                        if (lastSegment != null) {
                            nextExtendPoint = new Point(nextExtendPoint.x, lastSegment.getStartPoint().y);
                            nextExtendVertex = this.AddVertex(nextExtendPoint);
                            this.lastExtendedVertex = nextExtendVertex;
                        }
                    }
                    else if (dirToExtend == Directions.North) {
                        var lastSegment = this.HorizontalScanSegmentTree.FindLast(visibilitySegment.EndPoint);
                        if (lastSegment != null) {
                            nextExtendPoint = new Point(nextExtendPoint.x, lastSegment.getStartPoint().y);
                            nextExtendVertex = this.AddVertex(nextExtendPoint);
                            this.lastExtendedVertex = nextExtendVertex;
                        }
                    }
                }
                target = this.GetNextTarget(source, targetDirection, nextExtendPoint);
                if (nextExtendVertex != null) {
                    var nextSource = source.FindNextVertex(source.Point.FindDirection(nextExtendPoint));
                    if (nextSource != null)
                        this.ConnectVertices_vertex(source, nextExtendVertex, isOverlapped ? this.InitialWeight : this.NormalWeight);
                    this.ConnectVertices_vertex(startVertex, nextExtendVertex, 1);
                    startVertex = nextExtendVertex;
                }
                else
                    break;
                extendedEdgeCount++;
            }
        }
        if (considerOppositeEdgeToo)
            return false;
        return target != null;
    };
    PortManager.prototype.GetNextSource = function (startVertex, dirToExtend, source) {
        source = startVertex.FindNextVertex(dirToExtend);
        return { nextSource: source != null, source: source };
    };
    PortManager.prototype.GetNextTarget = function (sourceVertex, targetDirection, nextExtendPoint) {
        var direction = targetDirection;
        var target = sourceVertex;
        while (direction == targetDirection) {
            sourceVertex = target;
            target = sourceVertex.FindNextVertex(targetDirection);
            if (target == null)
                break;
            if (target.Point.equals(nextExtendPoint)) {
                return target.FindNextVertex(targetDirection);
            }
            direction = target.Point.FindDirection(nextExtendPoint);
        }
        return target;
    };
    PortManager.prototype.FindBendPoint = function (start, end, isHorizontal) {
        if (isHorizontal) {
            return new Point(end.Point.x, start.Point.y);
        }
        return new Point(start.Point.x, end.Point.y);
    };
    PortManager.prototype.AddEdgeToClosestPerpSegments = function (nearestSeg, intersectPt, isOverlapped) {
        var dir = nearestSeg.getIsVertical() ? Directions.North : Directions.East;
        var vertex = this.visibilityGraph.FindVertex(nearestSeg.getStartPoint());
        var prev = null;
        while (vertex != null) {
            if (vertex.Point.equals(intersectPt))
                break;
            else {
                if (prev != null && prev.Point.FindDirection(intersectPt) == intersectPt.FindDirection(vertex.Point)) {
                    var edge = this.visibilityGraph.FindEdge(prev.Point, vertex.Point);
                    if (edge != null) {
                        if (!(edge instanceof DynamicEdge) && this.temporaryAddition)
                            this.edgesToRestore.add(edge);
                        this.visibilityGraph.RemoveEdge_edge(edge, true);
                    }
                    return;
                }
            }
            prev = vertex;
            vertex = vertex.FindNextVertex(dir);
        }
    };
    PortManager.prototype.FindOrAddEdge = function (sourceVertex, targetVertex, weight, swap) {
        var direction = sourceVertex.Point.FindDirection(targetVertex.Point);
        var bracketSource, bracketTarget;
        var sourceEnd = false;
        var srcDirVertex = sourceVertex.FindNextVertex(direction);
        if (srcDirVertex == null) {
            swap = true;
            sourceEnd = false;
        }
        var args = this.FindExistingEdgeEnds(sourceVertex, targetVertex, direction, bracketSource, bracketTarget, sourceEnd, swap);
        var contained = args.isBracketTarget;
        bracketSource = args.bracketSource;
        bracketTarget = args.bracketTarget;
        sourceEnd = args.sourceEnd;
        swap = args.swap;
        if (!contained && !sourceEnd) {
            args = this.FindExistingEdgeEnds(bracketSource != null ? bracketSource : sourceVertex, bracketTarget != null ? bracketTarget : targetVertex, direction, bracketSource, bracketTarget, sourceEnd, true);
            contained = args.isBracketTarget;
            bracketSource = args.bracketSource;
            bracketTarget = args.bracketTarget;
            sourceEnd = args.sourceEnd;
            swap = args.swap;
        }
        if (contained) {
            var edge;
            edge = this.visibilityGraph.FindEdge(bracketSource.Point, bracketTarget.Point);
            if (edge != null && edge.getSource() == sourceVertex && edge.getTarget() == targetVertex)
                return;
            if (edge != null) {
                if (edge.getSourcePoint().OperatorLessThan(sourceVertex.Point) && edge.getTargetPoint().OperatorGreaterThan(targetVertex.Point)) {
                }
                var splitVertex;
                if (sourceEnd) {
                    splitVertex = sourceVertex;
                }
                else {
                    splitVertex = targetVertex;
                }
                this.SplitEdge(splitVertex, edge);
            }
            else {
                this.CreateEdge(sourceVertex, targetVertex, weight);
            }
        }
        else {
            if (bracketSource != null && bracketSource != sourceVertex && bracketSource.Point.FindDirection(targetVertex.Point) == direction) {
                this.CreateEdge(bracketSource, targetVertex, weight);
            }
            else if (bracketTarget != null && bracketTarget != targetVertex && bracketTarget.Point.FindDirection(sourceVertex.Point) == Extensions.OppositeDirection(direction)) {
                this.CreateEdge(sourceVertex, bracketTarget, weight);
            }
            else {
                this.CreateEdge(sourceVertex, targetVertex, weight);
            }
        }
    };
    PortManager.prototype.InsertEdge = function (source, target) {
        this.InsertEdge_vertex(this.AddVertex(source), this.AddVertex(target));
    };
    PortManager.prototype.InsertEdge_vertex = function (sourceVertex, targetVertex) {
        var direction = sourceVertex.Point.FindDirection(targetVertex.Point);
        var nextVertex = sourceVertex.FindNextVertex(direction);
        var lastTarget = sourceVertex;
        if (nextVertex != null) {
            while (nextVertex != null && nextVertex != targetVertex) {
                if (nextVertex == targetVertex)
                    break;
                if (nextVertex.Point.OperatorLessThan(targetVertex.Point)) {
                    lastTarget = nextVertex;
                }
                else {
                    var edge = this.visibilityGraph.FindEdge(lastTarget.Point, nextVertex.Point);
                    this.SplitEdge(targetVertex, edge);
                    break;
                }
                lastTarget = nextVertex;
                nextVertex = lastTarget.FindNextVertex(direction);
            }
        }
        else
            this.CreateEdge(sourceVertex, targetVertex, 1);
    };
    PortManager.prototype.GetIntersectingPoint = function (segment, point, isHorizontal) {
        if (isHorizontal) {
            return new Point(Utility.ToRoundedInt(point.x), segment.getStartPoint().y);
        }
        else {
            return new Point(segment.getStartPoint().x, Utility.ToRoundedInt(point.y));
        }
    };
    PortManager.prototype.CreatePortEntrances = function (node, port, obstacle) {
        var entrances = new List();
        if (port != null) {
            var location = port.getLocation();
            var obstacleTree = this.ObstacleTree.Rectangle;
            port.Entrances.Clear();
            var segment = new Segment(new Point(obstacleTree.left(), location.y), new Point(obstacleTree.right(), location.y));
            var intersections = Utility.GetIntersections(segment, obstacle.StartVertex);
            if (intersections.size() > 0) {
                for (var i = 0; i < intersections.size(); i++) {
                    var intersection = intersections.get(i);
                    if (intersection.x < location.x) {
                        port.AddPortEntrance(this.ObstacleTree, new Point(intersection.x + this.ObstacleTree.ObstaclePadding, intersection.y), node, PortDirection.Left);
                    }
                    else {
                        port.AddPortEntrance(this.ObstacleTree, new Point(intersection.x - this.ObstacleTree.ObstaclePadding, intersection.y), node, PortDirection.Right);
                    }
                }
            }
            segment = new Segment(new Point(location.x, obstacleTree.top()), new Point(location.x, obstacleTree.bottom()));
            intersections = Utility.GetIntersections(segment, obstacle.StartVertex);
            if (intersections.size() > 0) {
                for (var i = 0; i < intersections.size(); i++) {
                    var intersection = intersections.get(i);
                    if (intersection.y < location.y) {
                        port.AddPortEntrance(this.ObstacleTree, new Point(intersection.x, intersection.y + this.ObstacleTree.ObstaclePadding), node, PortDirection.Top);
                    }
                    else {
                        port.AddPortEntrance(this.ObstacleTree, new Point(intersection.x, intersection.y - this.ObstacleTree.ObstaclePadding), node, PortDirection.Bottom);
                    }
                }
            }
            return port.Entrances;
        }
        return entrances;
    };
    PortManager.prototype.FindEntrances = function (port) {
        var vertices = new List();
        if (port instanceof CenterPort) {
            var centerPort = port;
            for (var i = 0; i < centerPort.Entrances.size(); i++) {
                var entrance = centerPort.Entrances.get(i);
                var vertex = this.visibilityGraph.FindVertex(entrance.Location);
                vertices.add(vertex);
            }
        }
        else {
            var vertex = this.visibilityGraph.FindVertex(port.getLocation());
            vertices.add(vertex);
        }
        var i = 0;
        while (i < vertices.size()) {
            if (vertices.get(i).getDegree() == 0) {
                vertices.RemoveAt(i);
                continue;
            }
            i++;
        }
        return vertices;
    };
    PortManager.prototype.GetPortVisibilityIntersection = function (geometry) {
        var sourcePortInfo = geometry._sourcePortInfo;
        var targetPortInfo = geometry._targetPortInfo;
        var sourceNodeInfo = geometry._sourceNodeInfo;
        var targetNodeInfo = geometry._targetNodeInfo;
        if (sourcePortInfo != null && targetPortInfo != null) {
            var sourceEntrance = new PortEntrance(sourcePortInfo, sourcePortInfo.getLocation(), sourceNodeInfo, sourcePortInfo.getDirection(), this.ObstacleTree);
            var targetEntrance = new PortEntrance(targetPortInfo, targetPortInfo.getLocation(), targetNodeInfo, targetPortInfo.getDirection(), this.ObstacleTree);
            this.targetGeometry.SourceEntrance = sourceEntrance;
            this.targetGeometry.TargetEntrance = targetEntrance;
            var points = this.GetPathPoints(geometry, sourceEntrance, targetEntrance);
            if (points != null)
                return points;
            else {
                return this.CheckForLessDistanceBetweenSourceAndTarget(sourceNodeInfo, targetNodeInfo, sourcePortInfo, targetPortInfo);
            }
        }
        else if (sourceNodeInfo != null && sourceNodeInfo._obstacle != null && targetNodeInfo != null && targetNodeInfo._obstacle != null) {
            var sourcePort = sourceNodeInfo._obstacle.CenterPort;
            var targetPort = targetNodeInfo._obstacle.CenterPort;
            var souEntrances = this.CreatePortEntrances(sourceNodeInfo, sourcePort, sourceNodeInfo._obstacle);
            var taEntrances = this.CreatePortEntrances(targetNodeInfo, targetPort, targetNodeInfo._obstacle);
            if (!(sourcePort.VisibilityRectangle.intersects(targetPort.VisibilityRectangle))) {
                return null;
            }
            for (var i = 0; i < souEntrances.size(); i++) {
                sourceEntrance = souEntrances.get(Number(i));
                if (!sourceEntrance.getWantVisibilityIntersection())
                    continue;
                for (var j = 0; j < taEntrances.size(); j++) {
                    targetEntrance = taEntrances.get(Number(j));
                    if (!targetEntrance.getWantVisibilityIntersection())
                        continue;
                    var points = this.GetPathPoints(geometry, sourceEntrance, targetEntrance);
                    if (points != null)
                        return points;
                }
            }
        }
        return null;
    };
    PortManager.prototype.CheckForLessDistanceBetweenSourceAndTarget = function (sourceNodeInfo, targetNodeInfo, sourcePortInfo, targetPortInfo) {
        if (sourcePortInfo.getDirection() == Extensions.OppositeDirection_Port(targetPortInfo.getDirection())) {
            var sourceEdge = Utility.IntersectionWithRectangleBorder(sourceNodeInfo._outerBounds, sourcePortInfo.getLocation(), Extensions.GetEquivalentDirection(sourcePortInfo.getDirection()));
            var targetEdge = Utility.IntersectionWithRectangleBorder(targetNodeInfo._outerBounds, targetPortInfo.getLocation(), Extensions.GetEquivalentDirection(targetPortInfo.getDirection()));
            var distance = Extensions.FindDistance(sourceEdge, targetEdge, Extensions.GetOrientation_PortDirection(targetPortInfo.getDirection()));
            if (distance < 2 * this.padding && distance > 4) {
                var orientation = Extensions.GetOrientation_PortDirection(sourcePortInfo.getDirection());
                var start = Extensions.Transform(sourceEdge, distance / 2, Extensions.GetEquivalentDirection(sourcePortInfo.getDirection()));
                var xx = Extensions.GetOrientation_PortDirection(sourcePortInfo.getDirection());
                var segment = new Segment(start, Utility.IntersectionWithRectangleBorder(this.ObstacleTree.Rectangle, start, Extensions.FindDirectionOrientation(sourcePortInfo.getLocation(), targetPortInfo.getLocation(), Extensions.OppositeOrientation(xx))));
                var endPoint = Extensions.Transform(targetEdge, distance / 2, Extensions.GetEquivalentDirection(Extensions.OppositeDirection_Port(sourcePortInfo.getDirection())));
                if (this.ObstacleTree.FindMaximumVisibility(segment, sourceNodeInfo) && segment.Contains(endPoint)) {
                    var list = new PointList();
                    list.add(sourcePortInfo.getLocation());
                    list.add(start);
                    list.add(endPoint);
                    list.add(targetPortInfo.getLocation());
                    return list;
                }
            }
        }
        return null;
    };
    PortManager.prototype.GetPathPoints = function (geometry, sourceEntrance, targetEntrance) {
        var points = null;
        if (sourceEntrance.Direction == Extensions.OppositeDirection_Port(targetEntrance.Direction) && sourceEntrance.FirstHit == geometry._targetNodeInfo && targetEntrance.FirstHit == geometry._sourceNodeInfo) {
            return new PointList();
        }
        if (sourceEntrance.getIsVertical() == targetEntrance.getIsVertical()) {
            points = this.GetPathPointsFromCollinearPorts(sourceEntrance, targetEntrance);
        }
        else {
            points = this.GetPathPointsFromIntersectingPorts(sourceEntrance, targetEntrance);
        }
        return points;
    };
    PortManager.prototype.GetPathPointsFromCollinearPorts = function (sourceEntrance, targetEntrance) {
        if (!(Utility.AreEquivalentLines(sourceEntrance.MaxVisibilitySegment, targetEntrance.MaxVisibilitySegment))) {
            return null;
        }
        if (sourceEntrance.MaxVisibilitySegment.StartPoint.equals(sourceEntrance.MaxVisibilitySegment.EndPoint)) {
            return null;
        }
        var list = new PointList();
        list.add(sourceEntrance.Location);
        list.add(targetEntrance.Location);
        return list;
    };
    PortManager.prototype.GetPathPointsFromIntersectingPorts = function (sourceEntrance, targetEntrance) {
        var intersectingPoint;
        var args = Utility.SegmentIntersects(sourceEntrance.MaxVisibilitySegment, targetEntrance.MaxVisibilitySegment, intersectingPoint);
        intersectingPoint = args.intersect;
        if (!args.isInterSect) {
            return null;
        }
        var list = new PointList();
        list.add(sourceEntrance.Location);
        list.add(intersectingPoint);
        list.add(targetEntrance.Location);
        return list;
    };
    PortManager.prototype.CreateEdge = function (sourceVertex, targetVertex, weight, direction) {
        if (direction === void 0) { direction = Directions.None; }
        if (this.temporaryAddition) {
            if (sourceVertex.Point.OperatorGreaterThan(targetVertex.Point)) {
                var temp = sourceVertex;
                sourceVertex = targetVertex;
                targetVertex = temp;
            }
            var newEdge = this.visibilityGraph.FindEdge_vertex(sourceVertex, targetVertex);
            if (newEdge == null) {
                newEdge = new DynamicEdge(sourceVertex, targetVertex, weight);
                this.addedEdges.add(newEdge);
                VisibilityGraph.AddEdge(newEdge);
            }
        }
        else {
            this.visibilityGraph.AddEdge(sourceVertex, targetVertex, direction, weight);
        }
    };
    PortManager.prototype.SplitEdge = function (splitVertex, edge) {
        if (splitVertex.Point.equals(edge.getSourcePoint()) || splitVertex.Point.equals(edge.getTargetPoint()))
            return;
        if (!(edge instanceof DynamicEdge) && this.temporaryAddition)
            this.edgesToRestore.add(edge);
        this.visibilityGraph.RemoveEdge_edge(edge, true);
        this.CreateEdge(splitVertex, edge.getTarget(), edge.getWeight());
        this.CreateEdge(edge.getSource(), splitVertex, edge.getWeight());
    };
    PortManager.prototype.FindExistingEdgeEnds = function (sourceVertex, targetVertex, direction, bracketSource, bracketTarget, sourceEnd, swap) {
        sourceEnd = false;
        if (swap) {
            sourceEnd = true;
            var temp = sourceVertex;
            sourceVertex = targetVertex;
            targetVertex = temp;
            direction = Extensions.OppositeDirection(direction);
        }
        bracketSource = sourceVertex;
        for (;;) {
            bracketTarget = bracketSource.FindNextVertex(direction);
            if (bracketTarget == null) {
                break;
            }
            else if (bracketTarget.Point.equals(targetVertex.Point)) {
                break;
            }
            else if (direction == targetVertex.Point.FindDirection(bracketTarget.Point)) {
                break;
            }
            bracketSource = bracketTarget;
        }
        if (swap) {
            var temp = bracketSource;
            bracketSource = bracketTarget;
            bracketTarget = temp;
            return { isBracketTarget: bracketSource != null, bracketSource: bracketSource, bracketTarget: bracketTarget, sourceEnd: sourceEnd, swap: swap };
        }
        return { isBracketTarget: bracketTarget != null, bracketSource: bracketSource, bracketTarget: bracketTarget, sourceEnd: sourceEnd, swap: swap };
    };
    PortManager.prototype.AddVertex = function (point) {
        var vertex = this.visibilityGraph.FindVertex(point);
        if (vertex == null) {
            vertex = this.visibilityGraph.AddVertex(point);
            if (this.temporaryAddition)
                this.addedVertices.add(vertex);
        }
        return vertex;
    };
    PortManager.prototype.RestoreEdges = function () {
        for (var i = 0; i < this.edgesToRestore.size(); i++) {
            VisibilityGraph.AddEdge(this.edgesToRestore.get(i));
        }
        this.edgesToRestore.Clear();
    };
    PortManager.prototype.RemoveAddedEdges = function () {
        for (var i = 0; i < this.addedEdges.size(); i++) {
            this.visibilityGraph.RemoveEdge_edge(this.addedEdges.get(i));
        }
        this.addedEdges.Clear();
    };
    PortManager.prototype.RemoveAddedVertices = function () {
        for (var i = 0; i < this.addedVertices.size(); i++) {
            this.visibilityGraph.RemoveVertex(this.addedVertices.get(i));
        }
        this.addedVertices.Clear();
    };
    PortManager.prototype.RemoveEdgeGeometryFromGraph = function () {
        this.RemoveAddedVertices();
        this.RemoveAddedEdges();
        this.RestoreEdges();
    };
    PortManager.prototype.GetValidPortLocation = function (point) {
        if (!this.ObstacleTree.Rectangle.containsPoint(point)) {
            var bounds = this.ObstacleTree.Rectangle;
            var left = bounds.left(), right = bounds.right();
            var top = bounds.top(), bottom = bounds.bottom();
            var cornerPoints = new PointList().PointList([
                new Point(left, top), new Point(right, top),
                new Point(right, bottom),
                new Point(left, bottom),
                new Point(left, top)]);
            var line1 = new PointList().PointList([point, new Point(left, point.y)]);
            var line2 = new PointList().PointList([point, new Point(point.x, top)]);
            var intercepts = LineExtensions.Intersect_PointCollection(line1, cornerPoints, false);
            intercepts = intercepts.Concat(LineExtensions.Intersect_PointCollection(line2, cornerPoints, false));
            if (intercepts.size() == 0) {
                intercepts = new PointList().PointList([
                    bounds.topLeft,
                    bounds.topRight,
                    bounds.bottomLeft,
                    bounds.bottomRight
                ]);
            }
            var intersectingPoint = point;
            var minDistance = null;
            for (var k = 0; k < intercepts.size(); k++) {
                var pt = intercepts.get(k);
                var distance = Math.sqrt(Math.pow((point.x - pt.x), 2) + Math.pow((point.y - pt.y), 2));
                distance = Math.round(distance);
                if (minDistance == null || Math.min(minDistance, distance) === (distance)) {
                    minDistance = distance;
                    intersectingPoint = pt;
                }
            }
            point = intersectingPoint;
        }
        return point;
    };
    PortManager.prototype.IsCurrentConnectionSegmentsValid = function (edge, points) {
        var wrapper = edge;
        if (wrapper != null) {
            var pts = ej.datavisualization.Diagram.Util.getPoints(wrapper);
            for (var i = 0; i < pts.length; i++) {
                if (!(i > 0 && points.get(points.size() - 1) == (pts[i])) || i == 0) {
                    points.add(pts[i]);
                }
            }
            var cbounds = wrapper._outerBounds;
            var bounds = new Rect().Rect(pts[0], pts[pts.length - 1]);
            var nodes = this.ObstacleTree.FindNodes(bounds);
            if (nodes && nodes.size() > 0 && points.size() > 0) {
                for (var i = 0; i < nodes.size(); i++) {
                    var obstacle = nodes.get(i);
                    var obsBounds = obstacle._obstacle.getPaddedBounds() ? obstacle._obstacle.getPaddedBounds() : new Rect();
                    var cornerpts = new PointList();
                    cornerpts.add(new Point(obsBounds.left(), obsBounds.top()));
                    cornerpts.add(new Point(obsBounds.right(), obsBounds.top()));
                    cornerpts.add(new Point(obsBounds.right(), obsBounds.bottom()));
                    cornerpts.add(new Point(obsBounds.left(), obsBounds.bottom()));
                    cornerpts.add(new Point(obsBounds.left(), obsBounds.top()));
                    var intersecpts = new PointList();
                    intersecpts.AddRange(LineExtensions.Intersect_PointCollection(cornerpts, points, false));
                    if (intersecpts.size() > 0) {
                        if (wrapper._sourceNodeInfo == obstacle || wrapper._targetNodeInfo == obstacle) {
                            var j = 0, count = points.size();
                            var lastSegRect = new Rect().Rect(points.get(count - 1), points.get(count - 2));
                            var firstSegRect = new Rect().Rect(points.get(0), points.get(1));
                            while (j < intersecpts.size()) {
                                if (lastSegRect.containsPoint(intersecpts.get(j)) || firstSegRect.containsPoint(intersecpts.get(j))) {
                                    intersecpts.RemoveAt(j);
                                }
                                else {
                                    j++;
                                }
                            }
                        }
                        if (intersecpts.size() > 0) {
                            return {
                                canValid: false,
                                points: new PointList()
                            };
                        }
                    }
                }
            }
            return {
                canValid: true,
                points: points
            };
        }
        return {
            canValid: false,
            points: new PointList()
        };
    };
    PortManager.prototype.GetLineSegment = function (startPoint, direction, start, end, checkAdjcant) {
        if (checkAdjcant === void 0) { checkAdjcant = true; }
        var hit;
        var endPoint = Utility.IntersectionWithRectangleBorder(this.ObstacleTree.Rectangle, startPoint, direction);
        var segment = new Segment(startPoint, endPoint);
        var args = this.ObstacleTree.FindMaximumVisibility_hitNode(segment, start, end, hit);
        hit = args.hitNode;
        if (checkAdjcant) {
            var delX = 0, delY = 0;
            if (Extensions.GetOrientation(direction) == Orientation.Horizontal)
                delY = 5;
            else
                delX = 5;
            var segment1 = this.GetLineSegment(new Point(startPoint.x + delX, startPoint.y + delY), direction, start, end, false);
            var segment2 = this.GetLineSegment(new Point(startPoint.x - delX, startPoint.y - delY), direction, start, end, false);
            if (Extensions.GetOrientation(direction) == Orientation.Horizontal) {
                if (segment.Bounds.width > segment1.Bounds().width)
                    segment = new Segment(startPoint, new Point(segment1.EndPoint.x, segment.EndPoint.y));
                if (segment.Bounds.width > segment2.Bounds().width)
                    segment = new Segment(startPoint, new Point(segment2.EndPoint.x, segment.EndPoint.y));
            }
            else {
                if (segment.Bounds.height > segment1.Bounds().height)
                    segment = new Segment(startPoint, new Point(segment.EndPoint.x, segment1.EndPoint.y));
                if (segment.Bounds.height > segment2.Bounds().height)
                    segment = new Segment(startPoint, new Point(segment.EndPoint.x, segment2.EndPoint.y));
            }
        }
        return segment;
    };
    PortManager.prototype.IsEndPointChanged = function (connector) {
        var isModified = true;
        if (connector._points != null && connector._points.size() > 0) {
            connector._points = (connector._points);
            var sourcePoint = new Point(), targetPoint = new Point();
            if (connector.sourcePoint)
                sourcePoint = connector.sourcePoint;
            if (connector.targetPoint)
                targetPoint = connector.targetPoint;
            if (connector._points.ElementAt(0).equals(sourcePoint) && connector._points.ElementAt(connector._points.size() - 1).equals(targetPoint))
                isModified = false;
        }
        return isModified;
    };
    PortManager.prototype.ConnectVertices_vertex = function (startVertex, nextVertex, weight, direction) {
        if (weight === void 0) { weight = 1; }
        if (direction === void 0) { direction = Directions.None; }
        if (startVertex != nextVertex) {
            if (this.temporaryAddition) {
                var swapped = false;
                if (startVertex.Point.OperatorGreaterThan(nextVertex.Point)) {
                    var temp = nextVertex;
                    nextVertex = startVertex;
                    startVertex = temp;
                    swapped = true;
                }
                this.FindOrAddEdge(startVertex, nextVertex, weight, swapped);
            }
            else
                this.CreateEdge(startVertex, nextVertex, weight, direction);
        }
    };
    return PortManager;
}());
var LineUtil = (function () {
    function LineUtil(x1, y1, x2, y2) {
        this.X1 = 0;
        this.Y1 = 0;
        this.X2 = 0;
        this.Y2 = 0;
        this.X1 = x1;
        this.X2 = x2;
        this.Y1 = y1;
        this.Y2 = y2;
    }
    return LineUtil;
}());
var LineExtensions = (function () {
    function LineExtensions() {
    }
    LineExtensions.Intersect = function (s, t, POI) {
        var isInterSect = false;
        POI = new Point(0, 0);
        var L1 = s;
        var L2 = t;
        var d = (L2.Y2 - L2.Y1) * (L1.X2 - L1.X1) - (L2.X2 - L2.X1) * (L1.Y2 - L1.Y1);
        var n_a = (L2.X2 - L2.X1) * (L1.Y1 - L2.Y1) - (L2.Y2 - L2.Y1) * (L1.X1 - L2.X1);
        var n_b = (L1.X2 - L1.X1) * (L1.Y1 - L2.Y1) - (L1.Y2 - L1.Y1) * (L1.X1 - L2.X1);
        if (d == 0)
            isInterSect = false;
        var ua = n_a / d;
        var ub = n_b / d;
        if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
            POI.x = L1.X1 + (ua * (L1.X2 - L1.X1));
            POI.y = L1.Y1 + (ua * (L1.Y2 - L1.Y1));
            isInterSect = true;
        }
        return {
            isInterSect: isInterSect,
            POI: POI
        };
    };
    LineExtensions.Intersect_PointCollection = function (polyLine1, polyLine2, self) {
        if (self && polyLine2.size() >= 2) {
            polyLine2.RemoveAt(0);
            polyLine2.RemoveAt(0);
        }
        var intersect = new PointList();
        for (var i = 0; i < polyLine1.size() - 1; i++) {
            intersect.AddRange(this.Intersect_PointList(polyLine1.get(i), polyLine1.get(i + 1), polyLine2));
            if (self && polyLine2.size() >= 1) {
                polyLine2.RemoveAt(0);
            }
        }
        return intersect;
    };
    LineExtensions.Intersect_PointList = function (lineStart, lineEnd, polyLine) {
        var intersect = new PointList();
        for (var i = 0; i < polyLine.size() - 1; i++) {
            var p = this.Intersect_Points(lineStart, lineEnd, polyLine.get(i), polyLine.get(i + 1));
            if (!p.equals(new Point(0, 0))) {
                intersect.add(p);
            }
        }
        return intersect;
    };
    LineExtensions.Intersect_Points = function (start1, end1, start2, end2) {
        var l1 = new LineUtil(start1.x, start1.y, end1.x, end1.y);
        var l2 = new LineUtil(start2.x, start2.y, end2.x, end2.y);
        var args = this.Intersect(l1, l2, end2);
        end2 = args.POI;
        if (args.isInterSect) {
            return end2;
        }
        else {
            return new Point(0, 0);
        }
    };
    return LineExtensions;
}());
var Vertex = (function () {
    function Vertex(pt) {
        this._mEastEdge = null;
        this._mWestEdge = null;
        this._mSouthEdge = null;
        this._mNorthEdge = null;
        this.Point = pt;
    }
    Vertex.prototype.getEastEdge = function () {
        return this._mEastEdge;
    };
    Vertex.prototype.setEastEdge = function (value) {
        this._mEastEdge = value;
    };
    Vertex.prototype.getWestEdge = function () {
        return this._mWestEdge;
    };
    Vertex.prototype.setWestEdge = function (value) {
        this._mWestEdge = value;
    };
    Vertex.prototype.getSouthEdge = function () {
        return this._mSouthEdge;
    };
    Vertex.prototype.setSouthEdge = function (value) {
        this._mSouthEdge = value;
    };
    Vertex.prototype.getNorthEdge = function () {
        return this._mNorthEdge;
    };
    Vertex.prototype.setNorthEdge = function (value) {
        this._mNorthEdge = value;
    };
    Vertex.prototype.getDegree = function () {
        var count = 0;
        if (this._mEastEdge != null)
            count++;
        if (this._mWestEdge != null)
            count++;
        if (this._mNorthEdge != null)
            count++;
        if (this._mSouthEdge != null)
            count++;
        return count;
    };
    Vertex.prototype.RemoveEdgeAt = function (direction) {
        switch (direction) {
            case Directions.East:
                this._mEastEdge = null;
                break;
            case Directions.West:
                this._mWestEdge = null;
                break;
            case Directions.North:
                this._mNorthEdge = null;
                break;
            case Directions.South:
                this._mSouthEdge = null;
                break;
        }
    };
    Vertex.prototype.TryGetOutEdge = function (vertex, edge) {
        edge = null;
        if (this._mEastEdge != null && this._mEastEdge.getTarget() == vertex)
            edge = this._mEastEdge;
        else if (this._mNorthEdge != null && this._mNorthEdge.getTarget() == vertex)
            edge = this._mNorthEdge;
        return {
            edge: edge, canOut: edge != null ? true : false
        };
    };
    Vertex.prototype.TryGetInEdge = function (vertex, edge) {
        edge = null;
        if (this._mWestEdge != null && this._mWestEdge.getTarget() == vertex)
            edge = this._mWestEdge;
        else if (this._mSouthEdge != null && this._mSouthEdge.getTarget() == vertex)
            edge = this._mSouthEdge;
        return {
            edge: edge, canIn: edge != null ? true : false
        };
    };
    Vertex.prototype.ClearEdges = function () {
        this._mEastEdge = null;
        this._mNorthEdge = null;
        this._mSouthEdge = null;
        this._mWestEdge = null;
    };
    Vertex.prototype.SetVertexEntry = function (entry) {
        if (this.VertexEntries == null) {
            this.VertexEntries = new Array(4);
        }
        this.VertexEntries[Extensions.ToIndex(entry.Direction)] = entry;
    };
    Vertex.prototype.RemoveVertexEntries = function () {
        this.VertexEntries = null;
    };
    Vertex.prototype.FindNextVertex = function (direction) {
        var edge = null;
        if (direction == Directions.East)
            edge = this._mEastEdge;
        else if (direction == Directions.West)
            edge = this._mWestEdge;
        else if (direction == Directions.North)
            edge = this._mNorthEdge;
        else if (direction == Directions.South)
            edge = this._mSouthEdge;
        if (edge != null) {
            if (direction == Directions.East || direction == Directions.North)
                return edge.getTarget();
            else
                return edge.getSource();
        }
        return null;
    };
    Vertex.prototype.DisconnectEdges = function () {
        if (this._mEastEdge != null)
            this._mEastEdge.getTarget().RemoveEdgeAt(Directions.West);
        if (this._mNorthEdge != null)
            this._mNorthEdge.getTarget().RemoveEdgeAt(Directions.South);
        if (this._mWestEdge != null)
            this._mWestEdge.getSource().RemoveEdgeAt(Directions.East);
        if (this._mSouthEdge != null)
            this._mSouthEdge.getSource().RemoveEdgeAt(Directions.North);
    };
    return Vertex;
}());
var Edge = (function () {
    function Edge(source, target, weight) {
        this._mSource = null;
        this._mTarget = null;
        this._mSourcePoint = new Point();
        this._mTargetPoint = new Point();
        this._mLength = 0;
        this._mWeight = 0;
        this._mEdgeDirection = Directions.None;
        this.Edge(source, target);
        this._mWeight = weight;
        this.SetEdgeDirection();
        switch (this._mEdgeDirection) {
            case Directions.East:
                this._mSource.setEastEdge(this);
                this._mTarget.setWestEdge(this);
                break;
            case Directions.North:
                this._mSource.setNorthEdge(this);
                this._mTarget.setSouthEdge(this);
                break;
            case Directions.West:
                this._mSource.setWestEdge(this);
                this._mTarget.setEastEdge(this);
                break;
            case Directions.South:
                this._mSource.setSouthEdge(this);
                this._mTarget.setNorthEdge(this);
                break;
        }
    }
    Edge.prototype.getSource = function () {
        return this._mSource;
    };
    Edge.prototype.getTarget = function () {
        return this._mTarget;
    };
    Edge.prototype.getSourcePoint = function () {
        return this._mSourcePoint;
    };
    Edge.prototype.getTargetPoint = function () {
        return this._mTargetPoint;
    };
    Edge.prototype.getLength = function () {
        return this._mLength;
    };
    Edge.prototype.getWeight = function () {
        return this._mWeight;
    };
    Edge.prototype.getEdgeDirection = function () {
        return this._mEdgeDirection;
    };
    Edge.prototype.Edge = function (source, target) {
        this._mSource = source;
        this._mTarget = target;
        this._mSourcePoint = this._mSource != null ? this._mSource.Point : new Point();
        this._mTargetPoint = this._mTarget != null ? this._mTarget.Point : new Point();
    };
    Edge.prototype.EdgeWeight = function (source, target, direction, weight) {
        this.Edge(source, target);
        this._mWeight = weight;
        this._mEdgeDirection = direction;
        switch (this._mEdgeDirection) {
            case Directions.East:
                this._mSource.setEastEdge(this);
                this._mTarget.setWestEdge(this);
                break;
            case Directions.North:
                this._mSource.setNorthEdge(this);
                this._mTarget.setSouthEdge(this);
                break;
            case Directions.West:
                this._mSource.setWestEdge(this);
                this._mTarget.setEastEdge(this);
                break;
            case Directions.South:
                this._mSource.setSouthEdge(this);
                this._mTarget.setNorthEdge(this);
                break;
        }
        return this;
    };
    Edge.prototype.ResetFields = function (source, target, direction, weight) {
        if (direction === void 0) { direction = Directions.None; }
        if (weight === void 0) { weight = 1; }
        if (this._mSource != source) {
            this._mSource = source;
            this._mSourcePoint = this._mSource != null ? this._mSource.Point : new Point();
        }
        if (this._mTarget != target) {
            this._mTarget = target;
            this._mTargetPoint = this._mTarget != null ? this._mTarget.Point : new Point();
        }
        this._mWeight = weight;
        if (direction == Directions.None)
            this.SetEdgeDirection();
        else
            this._mEdgeDirection = direction;
        switch (this._mEdgeDirection) {
            case Directions.East:
                this._mSource.setEastEdge(this);
                this._mTarget.setWestEdge(this);
                break;
            case Directions.North:
                this._mSource.setNorthEdge(this);
                this._mTarget.setSouthEdge(this);
                break;
            case Directions.West:
                this._mSource.setWestEdge(this);
                this._mTarget.setEastEdge(this);
                break;
            case Directions.South:
                this._mSource.setSouthEdge(this);
                this._mTarget.setNorthEdge(this);
                break;
        }
    };
    Edge.prototype.ReversedClone = function () {
        return new this.Edge(this.getTarget(), this.getSource());
    };
    Edge.prototype.Clone = function () {
        return new this.Edge(this.getSource(), this.getTarget());
    };
    Edge.prototype.ClearProperties = function () {
        if (this._mSource != null && this._mTarget != null) {
            this._mSource.RemoveEdgeAt(this._mEdgeDirection);
            this._mTarget.RemoveEdgeAt(Extensions.OppositeDirection(this._mEdgeDirection));
        }
    };
    Edge.prototype.SetEdgeDirection = function () {
        var startX = this._mSourcePoint.x, endX = this._mTargetPoint.x;
        if (startX != endX)
            this._mEdgeDirection = endX > startX ? Directions.East : Directions.West;
        else {
            var startY = this._mSourcePoint.y, endY = this._mTargetPoint.y;
            if (startY != endY)
                this._mEdgeDirection = endY > startY ? Directions.North : Directions.South;
        }
    };
    return Edge;
}());
var DynamicEdge = (function (_super) {
    __extends(DynamicEdge, _super);
    function DynamicEdge(source, target, weight) {
        _super.call(this, source, target, weight);
    }
    return DynamicEdge;
}(Edge));
var VertexEntry = (function () {
    function VertexEntry(vertex, prevEntry, length, bends, cost) {
        this.TimeStamp = 0;
        this.Length = 0;
        this.Cost = 0;
        this.NumberOfBends = 0;
        this.Closed = false;
        this.Vertex = vertex;
        this.PreviousEntry = prevEntry;
        this.Length = length;
        this.NumberOfBends = bends;
        cost = Math.round(cost);
        this.Cost = cost;
        this.Direction = prevEntry != null ? prevEntry.Vertex.Point.FindDirection(vertex.Point) : Directions.None;
    }
    VertexEntry.prototype.ResetEntry = function (previousEntry, cost, bends, length) {
        this.PreviousEntry = previousEntry;
        cost = Math.round(cost);
        this.Cost = cost;
        this.NumberOfBends = bends;
        this.Length = length;
    };
    VertexEntry.prototype.CompareTo = function (other) {
        var result = Extensions.CompareTo(this.Cost, other.Cost);
        return result != 0 ? result : Extensions.CompareTo(other.TimeStamp, this.TimeStamp);
    };
    VertexEntry.prototype.ToString = function () {
        if (this.PreviousEntry != null)
            return "" + this.PreviousEntry.ToString() + " -> (" + this.Vertex.Point.x + ", " + this.Vertex.Point.y + ")";
        else
            return "(" + this.Vertex.Point.x + ", " + this.Vertex.Point.y + ")";
    };
    return VertexEntry;
}());
var VisibilityGraph = (function () {
    function VisibilityGraph() {
        this.Graph = new Dictionary();
        this.EdgesCache = new Stack();
        this.VertexFactory = (function (point) { return new Vertex(point); });
    }
    VisibilityGraph.prototype.getEdges = function () {
        var _mEdges = new List();
        this.getVertices().forEach(function (vertex) {
            if (vertex.EastEdge != null)
                _mEdges.add(vertex.EastEdge);
            if (vertex.NorthEdge != null)
                _mEdges.add(vertex.NorthEdge);
        });
        return _mEdges;
    };
    VisibilityGraph.prototype.getVertices = function () {
        var list = [];
        if (this.Graph) {
            var count = this.Graph.Count();
            for (var i = 0; i < count; i++) {
                var graphE = this.Graph.GetValue(this.Graph.KeyAt(i));
                var jcount = graphE.Count();
                for (var j = 0; j < jcount; j++) {
                    var entry = graphE.GetValue(graphE.KeyAt(j));
                    list.push(entry);
                }
            }
        }
        return list;
    };
    VisibilityGraph.prototype.FindVertex = function (point) {
        return this.FindVertexNumber(Utility.ToRoundedInt(point.x), Utility.ToRoundedInt(point.y));
    };
    VisibilityGraph.prototype.FindVertexNumber = function (x, y) {
        if (this.Graph.ContainsKey(x)) {
            var graphEntry = this.Graph.GetValue(x);
            if (graphEntry.ContainsKey(y))
                return graphEntry.GetValue(y);
        }
        return null;
    };
    VisibilityGraph.prototype.FindEdge = function (sourcePt, targetPt) {
        return this.FindEdge_vertex(this.FindVertex(sourcePt), this.FindVertex(targetPt));
    };
    VisibilityGraph.prototype.FindEdge_vertex = function (sourceVertex, targetVertex) {
        var edge = null;
        if (sourceVertex != null && targetVertex != null) {
            var args = sourceVertex.TryGetOutEdge(targetVertex, edge);
            edge = args.edge;
        }
        return edge;
    };
    VisibilityGraph.prototype.AddVertex = function (point) {
        var vertex = null;
        var x = Utility.ToRoundedInt(point.x), y = Utility.ToRoundedInt(point.y);
        if (this.Graph.ContainsKey(x)) {
            var graphEntry = this.Graph.GetValue(x);
            if (graphEntry.ContainsKey(y))
                vertex = graphEntry.GetValue(y);
            else {
                vertex = new Vertex(point);
                graphEntry.Add(vertex, y);
            }
        }
        else {
            vertex = new Vertex(point);
            var object = new Dictionary();
            object.Add(vertex, y);
            this.Graph.Add(object, x);
        }
        return vertex;
    };
    VisibilityGraph.prototype.ContainsVertex = function (point) {
        var x = Utility.ToRoundedInt(point.x), y = Utility.ToRoundedInt(point.y);
        if (this.Graph.ContainsKey(x)) {
            return this.Graph[this.Graph.IndexOfKey(x)].ContainsKey(y);
        }
        return false;
    };
    VisibilityGraph.prototype.CreateEdge = function (source, target, direction, weight) {
        if (direction === void 0) { direction = Directions.None; }
        if (weight === void 0) { weight = 1; }
        var edge = null;
        if (this.EdgesCache.Count() != 0) {
            edge = this.EdgesCache.Pop();
            edge.ResetFields(source, target, direction, weight);
        }
        else if (direction != Directions.None)
            edge = new Edge(source, target, weight).EdgeWeight(source, target, direction, weight);
        else
            edge = new Edge(source, target, weight);
        return edge;
    };
    VisibilityGraph.prototype.AddEdge_Point = function (sourcePt, targetPt) {
        var source = this.FindVertex(sourcePt), target = this.FindVertex(targetPt);
        if (source == null)
            source = this.AddVertex(sourcePt);
        if (target == null)
            target = this.AddVertex(targetPt);
        return this.AddEdge(source, target);
    };
    VisibilityGraph.prototype.AddEdge = function (source, target, direction, weight) {
        if (direction === void 0) { direction = Directions.None; }
        if (weight === void 0) { weight = 1; }
        var _vertex = this.FindEdge_vertex(source, target);
        return _vertex ? _vertex : this.CreateEdge(source, target, direction, weight);
    };
    VisibilityGraph.AddEdge = function (edge) {
        if (edge.getSource() != null && edge.getTarget() != null) {
            switch (edge.getEdgeDirection()) {
                case Directions.East:
                    edge.getSource().setEastEdge(edge);
                    edge.getTarget().setWestEdge(edge);
                    break;
                case Directions.North:
                    edge.getSource().setNorthEdge(edge);
                    edge.getTarget().setSouthEdge(edge);
                    break;
                case Directions.West:
                    edge.getSource().setWestEdge(edge);
                    edge.getTarget().setEastEdge(edge);
                    break;
                case Directions.South:
                    edge.getSource().setSouthEdge(edge);
                    edge.getTarget().setNorthEdge(edge);
                    break;
            }
        }
    };
    VisibilityGraph.prototype.RemoveVertex = function (vertex) {
        if (vertex != null) {
            vertex.DisconnectEdges();
            var x = Utility.ToRoundedInt(vertex.Point.x), y = Utility.ToRoundedInt(vertex.Point.y);
            if (this.Graph.ContainsKey(x)) {
                var graphEntry = this.Graph.GetValue(x);
                if (graphEntry.ContainsKey(y))
                    graphEntry.Remove(y);
                if (graphEntry.Count() == 0)
                    this.Graph.Remove(x);
            }
            vertex = null;
        }
    };
    VisibilityGraph.prototype.RemoveEdge = function (source, target) {
        var edge = this.FindEdge_vertex(source, target);
        if (edge != null)
            this.RemoveEdge_edge(edge);
        return edge;
    };
    VisibilityGraph.prototype.RemoveEdge_point = function (sourcePt, targetPt) {
        var edge = this.FindEdge(sourcePt, targetPt);
        if (edge != null)
            this.RemoveEdge_edge(edge);
    };
    VisibilityGraph.prototype.RemoveEdge_edge = function (edge, skipCache) {
        if (skipCache === void 0) { skipCache = false; }
        edge.ClearProperties();
        if (!skipCache && !(edge instanceof DynamicEdge))
            this.EdgesCache.Push(edge);
        edge = null;
    };
    VisibilityGraph.prototype.ClearEdges = function () {
        this.getVertices().forEach(function (vertex) { vertex.ClearEdges(); });
    };
    VisibilityGraph.stackCapacity = 1000;
    return VisibilityGraph;
}());
var EdgeGeometry = (function () {
    function EdgeGeometry() {
    }
    EdgeGeometry.prototype.GetCurrentEnd = function () {
        if (this.CurrentEnd == ConnectionEnd.Source)
            return this.SourceEntrance.Location;
        return this.TargetEntrance.Location;
    };
    EdgeGeometry.prototype.GetOppositeEnd = function () {
        if (this.CurrentEnd == ConnectionEnd.Target) {
            if (this.Connector._sourceNodeInfo != null) {
                return this.Connector._sourcePortInfo != null ? this.Connector._sourcePortInfo.getLocation() : this.Connector._sourceNodeInfo._outerBounds.center();
            }
            else {
                return this.Connector._sourcePointInfo.getLocation();
            }
        }
        if (this.Connector._targetNodeInfo != null) {
            return this.Connector._targetPortInfo != null ? this.Connector._targetPortInfo.getLocation() : this.Connector._targetNodeInfo._outerBounds.center();
        }
        else {
            return this.Connector._targetPointInfo.getLocation();
        }
    };
    EdgeGeometry.prototype.GetCurrentEntrance = function () {
        if (this.CurrentEnd == ConnectionEnd.Source)
            return this.SourceEntrance;
        return this.TargetEntrance;
    };
    return EdgeGeometry;
}());
