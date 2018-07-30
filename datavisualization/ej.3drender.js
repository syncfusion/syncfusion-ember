
ej.Ej3DRender = function () {


};

(function ($) {

    ej.Ej3DRender.Polygons = [];


    ej.Ej3DRender.prototype = {
        matrix3D: function () {

        },

        vector3D: function () {

        },

        BSPTreeBuilder: function () {

        },

        Graphics3D: function () {

        },

        polygon3D: function () {

        }
    }

    var Ej3DRender = new ej.Ej3DRender();

    Ej3DRender.vector3D.prototype = {
        //Members
        x: "",
        y: "",
        z: "",
        Epsilon: 0.00001,
        //all coordinates indicate 0
        //  empty: new Vector3D(0, 0, 0),

        //isValid: !isNaN(this.x) && !isNaN(this.y) && !isNaN(this.z),
        isValid: function (point) {
            return !isNaN(point.x) && !isNaN(point.y) && !isNaN(point.z)
        },
        //Constructor
        vector3D: function (points, vz) {
            this.x = points.x;
            this.y = points.y;
            this.z = vz;
        },

        vector3D: function (vx, vy, vz) {
            this.x = vx;
            this.y = vy;
            this.z = vz;
            return { x: vx, y: vy, z: vz }
        },

        //operations
        vector3DMinus: function (v1, v2) {
            return this.vector3D(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
        },

        vector3DPlus: function (v1, v2) {
            return this.vector3D(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
        },

        vector3DMultiply: function (v1, v2) {
            var _x = v1.y * v2.z - v2.y * v1.z;
            var _y = v1.z * v2.x - v2.z * v1.x;
            var _z = v1.x * v2.y - v2.x * v1.y;

            return this.vector3D(_x, _y, _z);
        },

        vector3dAND: function (v1, v2) {
            return (v1.x * v2.x + v1.y * v2.y + v1.z * v2.z);
        },

        vector3DStarMultiply: function (v1, val) {
            var _x = v1.x * val;
            var _y = v1.y * val;
            var _z = v1.z * val;

            return this.vector3D(_x, _y, _z);
        },

        //Methods
        getLength: function (vector) {
            var sqt = this.vector3dAND(vector, vector);
            return Math.sqrt(sqt);
        },



        normalize: function () {
            var l = this.getLength();
            x /= l;
            y /= l;
            z /= l;
        },
        getNormal: function (v1, v2, v3) {
            var v4 = this.vector3DMinus(v1, v2);
            var v5 = this.vector3DMinus(v3, v2);
            var n = this.vector3DMultiply(v4, v5);
            var l = this.getLength(n);

            if (l < this.Epsilon) {
                l = 0;
            }
            return { x: n.x / l, y: n.y / l, z: n.z / l }
        }
    }

    Ej3DRender.matrix3D.prototype = {
        //Memebr
        MATRIX_SIZE: 4,
        //Constructor
        matrix3D: function (size) {
            var mData = [];
            for (var i = 0; i < size; i++) {
                mData[i] = this.createArray(size);
            }
            return mData;
        },

        //method
        isAffine: function (mData) {

            return (mData[0][3] == 0) && (mData[1][3] == 0)
                && (mData[2][3] == 0) && (mData[3][3] == 1);
        },
        createArray: function (initialSize) {
            var a = [];
            for (var index = 0; index < initialSize; ++index) {
                a[index] = 0;
            }
            return a;
        },

        getIdentity: function () {

            var mData = this.matrix3D(this.MATRIX_SIZE);

            for (var i = 0; i < this.MATRIX_SIZE; i++) {
                mData[i][i] = 1.0;
            }

            return mData;
        },

        getInvertal: function (matrix) {
            var m = this.getIdentity();

            for (var i = 0; i < this.MATRIX_SIZE; i++) {
                for (var j = 0; j < this.MATRIX_SIZE; j++) {
                    m[i][j] = this.getMinor(matrix, i, j);
                }
            }

            m = this.transposed(m);
            m = this.getMatrixMultiple((1 / this.getDeterminant(matrix)), m);

            return m;
        },
        getMatrixMultiple: function (factor, matrix) {
            for (var i = 0; i < matrix.length; i++) {
                for (var j = 0; j < matrix[i].length; j++) {
                    matrix[i][j] = matrix[i][j] * factor;
                }
            }
            return matrix;
        },
        getMatrixVectorMutiple: function (m1, point) {
            var x = m1[0][0] * point.x + m1[1][0] * point.y + m1[2][0] * point.z + m1[3][0];
            var y = m1[0][1] * point.x + m1[1][1] * point.y + m1[2][1] * point.z + m1[3][1];
            var z = m1[0][2] * point.x + m1[1][2] * point.y + m1[2][2] * point.z + m1[3][2];

            if (!this.isAffine(m1)) {
                var c = 1 / (m1[0][3] * point.x + m1[1][3] * point.y + m1[2][3] * point.z + m1[3][3]);
                x *= c;
                y *= c;
                z *= c;
            }

            return { x: x, y: y, z: z };
        },
        getMatrixVectorAnd: function (m1, v1) {
            var x = m1[0][0] * v1.x + m1[1][0] * v1.y + m1[2][0] * v1.z;
            var y = m1[0][1] * v1.x + m1[1][1] * v1.y + m1[2][1] * v1.z;
            var z = m1[0][2] * v1.x + m1[1][2] * v1.y + m1[2][2] * v1.z;

            return Ej3DRender.vector3D.prototype.vector3D(x, y, z);
        },
        getMatrixAdd: function (m1, m2) {
            var m = this.matrix3D(4);

            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    m[i][j] = m1[i][j] + m2[i][j];
                }
            }

            return m;
        },
        getMatrixMultiplication: function (m1, m2) {
            var res = this.getIdentity();

            for (var i = 0; i < this.MATRIX_SIZE; i++) {
                for (var j = 0; j < this.MATRIX_SIZE; j++) {
                    var v = 0;

                    for (var k = 0; k < this.MATRIX_SIZE; k++) {
                        v += m1[k][j] * m2[i][k];
                        var t = v;
                    }

                    res[i][j] = v;
                }
            }

            return res;
        },
        getMatrixEqual: function (m1, m2) {
            var res = true;

            for (var i = 0; i < m1.length; i++) {
                for (var j = 0; j < m1.length; j++) {
                    if (m1[i][j] != m2[i][j]) {
                        res = false;
                    }
                }
            }

            return res;
        },
        getMatrixNotEqual: function (m1, m2) {
            var res = true;

            for (var i = 0; i < m1.length; i++) {
                for (var j = 0; j < m1.length; j++) {
                    if (m1[i][j] != m2[i][j]) {
                        res = false;
                    }
                }
            }

            return !res;
        },


        getMinor: function (dd, columnIndex, rowIndex) {
            return (((columnIndex + rowIndex) % 2 == 0) ? 1 : -1) * this.getDeterminant(this.getMMtr(dd, columnIndex, rowIndex));

        },

        getMMtr: function (dd, columnIndex, rowIndex) {
            var count = dd.length - 1;
            var d = this.createArray(count);

            for (var i = 0; i < count; i++) {
                var m = (i >= columnIndex) ? i + 1 : i;
                d[i] = this.createArray(count);

                for (var j = 0; j < count; j++) {
                    var n = (j >= rowIndex) ? j + 1 : j;

                    d[i][j] = dd[m][n];
                }
            }
            return d;
        },
        getDeterminant: function (dd) {
            var count = dd.length;
            var res = 0;

            if (count < 2) {
                res = dd[0][0];
            }
            else {
                var k = 1;

                for (var i = 0; i < count; i++) {
                    var dm = this.getMMtr(dd, i, 0);

                    res += k * dd[i][0] * this.getDeterminant(dm);
                    k = (k > 0) ? -1 : 1;
                }
            }

            return res;
        },


        transform: function (x, y, z) {
            var res = this.getIdentity();

            res[3][0] = x;
            res[3][1] = y;
            res[3][2] = z;

            return res;
        },


        turn: function (angle) {
            var res = this.getIdentity();

            res[0][0] = Math.cos(angle);
            res[2][0] = -Math.sin(angle);
            res[0][2] = Math.sin(angle);
            res[2][2] = Math.cos(angle);

            return res;
        },

        tilt: function (angle) {
            var res = this.getIdentity();

            res[1][1] = Math.cos(angle);
            res[2][1] = Math.sin(angle);
            res[1][2] = -(Math.sin(angle));
            res[2][2] = Math.cos(angle);

            return res;
        },
        transposed: function (matrix3D) {
            var m = this.getIdentity();

            for (var i = 0; i < this.MATRIX_SIZE; i++) {
                for (var j = 0; j < this.MATRIX_SIZE; j++) {
                    m[i][j] = matrix3D[j][i];
                }
            }
            return m;
        },
        shear: function (xy, xz, yx, yz, zx, zy) {
            var res = this.getIdentity();

            res[1, 0] = xy;
            res[2, 0] = xz;
            res[0, 1] = yx;
            res[2, 1] = yz;
            res[0, 2] = zx;
            res[1, 2] = zy;

            return res;
        }


    }
    Ej3DRender.Graphics3D.prototype = {
        addVisual: function (polygon) {
            if ((polygon == null) || (polygonobj.test(polygon))) {
                return -1;
            }
            polygon.Graphics3D = this;
            return bsptreeobj.add(polygon);
        },

        getVisualCount: function () {
            return ej.Ej3DRender.Polygons.length();
        },
        remove: function (polygon) {
            ej.Ej3DRender.Polygons.Remove(polygon);
        },

        clearVisual: function () {
            ej.Ej3DRender.Polygons = null;
        },

        getVisual: function () {
            return ej.Ej3DRender.Polygons;
        },
        prepareView: function (perspectiveAngle, depth, rotation, tilt, size, sender) {
            if (arguments.length == 0) {
                bsptreeobj.build();
            }
            else {
                if (ej.Ej3DRender.transform == null)
                    ej.Ej3DRender.transform = ej.EjSvgRender.chartTransform3D.transform3D(size);
                else
                    ej.Ej3DRender.transform.mViewport = size;
                if (!ej.Ej3DRender.tree)
                    ej.Ej3DRender.tree = [];
                ej.Ej3DRender.transform.Rotation = rotation;
                ej.Ej3DRender.transform.Tilt = tilt;
                ej.Ej3DRender.transform.Depth = depth;
                ej.Ej3DRender.transform.PerspectiveAngle = perspectiveAngle;
                ej.EjSvgRender.chartTransform3D.transform(ej.Ej3DRender.transform);
                ej.Ej3DRender.tree[sender._id] = bsptreeobj.build();

            }
        },
        view: function (panel, sender, rotation, tilt, size, perspectiveAngle, depth) {
            var MaxValue = 32767;
            if (arguments.length == 2) {
                if (panel == null) return;
                var eye = vector.vector3D(0, 0, MaxValue);
                this.drawBspNode3D(ej.Ej3DRender.tree[sender._id], eye, panel, sender);
            }
            else {
                if (panel == null) return;

                if (ej.Ej3DRender.transform == null)
                    ej.Ej3DRender.transform = ej.EjSvgRender.chartTransform3D.transform3D(size);
                else
                    ej.Ej3DRender.transform.mViewport = size;
                ej.Ej3DRender.transform.Rotation = rotation;
                ej.Ej3DRender.transform.Tilt = tilt;
                ej.Ej3DRender.transform.Depth = depth;
                ej.Ej3DRender.transform.PerspectiveAngle = perspectiveAngle;
                ej.EjSvgRender.chartTransform3D.transform(ej.Ej3DRender.transform);
                var eye = vector.vector3D(0, 0, MaxValue);
                this.drawBspNode3D(ej.Ej3DRender.tree[sender._id], eye, panel, sender);
            }
        },

        draw3DElement: function (tr, sender) {
            if (tr.Plane.element) {
                if (tr.Plane.element.tag == "text" || tr.Plane.element.tag == "dataLabel")
                    polygonobj.drawText(tr.Plane, sender);
                else if (tr.Plane.element.tag == "polyline")
                    polygonobj.drawPolyLine(tr.Plane, sender);
                else if (tr.Plane.element.tag == "template")
                    polygonobj.drawTemplate(tr.Plane, sender);
                else
                    polygonobj.drawLine(tr.Plane, sender);
            }

            else
                polygonobj.draw(tr.Plane, sender);
        },

        drawBspNode3D: function (tr, eye, panel, sender) {
            if (tr == null || ej.Ej3DRender.transform == null) return;
            while (true) {
                var r = vector.vector3dAND(polygonobj.getNormal(ej.EjSvgRender.chartTransform3D.result(ej.Ej3DRender.transform), tr.Plane.VectorPoints), eye);
                if (r > tr.Plane.D) {
                    if (tr.Front != null) {
                        this.drawBspNode3D(tr.Front, eye, panel, sender);
                    }

                    this.draw3DElement(tr, sender);

                    if (tr.Back != null) {
                        tr = tr.Back;
                        continue;
                    }
                }
                else {
                    if (tr.Back != null) {
                        this.drawBspNode3D(tr.Back, eye, panel, sender);
                    }

                    this.draw3DElement(tr, sender);

                    if (tr.Front != null) {
                        tr = tr.Front;
                        continue;
                    }
                }
                break;
            }

        }

    }


    Ej3DRender.BSPTreeBuilder.prototype = {
        //Members
        EPSILON: 0.0005,
        Polygon: [],

        //Methods
        add: function (poly) {
            ej.Ej3DRender.Polygons.push(poly);
            return ej.Ej3DRender.Polygons.length - 1;
        },

        remove: function (index) {
            ej.Ej3DRender.Polygons.splice(index, 1);
        },

        clear: function () {
            ej.Ej3DRender.Polygons = [];
        },

        count: function () {
            return ej.Ej3DRender.Polygons.length;
        },

        getNext: function (i, count) {
            if (i >= count) {
                return i - count;
            }
            if (i < 0) {
                return i + count;
            }

            return i;
        },
        getNodeCount: function (el) {
            return (el == null) ? 0 : 1 + this.getNodeCount(el.Back) + this.getNodeCount(el.Front);
        },
        vector3DIndexClassification: function (point, ind, res) {
            return {
                index: ind,
                result: res,
                vector: point,

                isCuttingBackPoint: false,
                cuttingBackPairIndex: null,
                alreadyCuttedBack: false,

                isCuttingFrontPoint: false,
                cuttingFrontPairIndex: null,
                alreadyCuttedFront: false
            }
        },
        classifyPoint: function (pt, pln) {
            var res = "OnPlane";
            var sv = -pln.D - Ej3DRender.vector3D.prototype.vector3dAND(pt, pln.normal);

            if (sv > this.EPSILON) {
                res = "OnBack";
            }
            else if (sv < -this.EPSILON) {
                res = "OnFront";
            }

            return res;
        },

        classifyPolygon: function (pln, plg) {
            var res = "Unknown";
            var points = plg.Points;

            if (points == null)
                return res;
            var onBack = 0;
            var onFront = 0;
            var onPlane = 0;
            var normal = pln.normal;// root node normailized value perpendicular direction
            var d = pln.D; // constant of the plan or depth

            for (var i = 0, len = points.length; i < len; i++) {
                var r = -d - Ej3DRender.vector3D.prototype.vector3dAND(points[i], normal); // Comparision of Plane point depth with the other nodes

                if (r > this.EPSILON) {
                    onBack++;
                }
                else if (r < -this.EPSILON) {
                    onFront++;
                }
                else {
                    onPlane++;
                }

                if ((onBack > 0) && (onFront > 0)) {
                    break;
                }
            }
            if (onPlane == points.length) {
                res = "OnPlane";
            }
            else if (onFront + onPlane == points.length) {
                res = "ToRight";
            }
            else if (onBack + onPlane == points.length) {
                res = "ToLeft";
            }
            else {
                res = "Unknown";
            }
            return res;
        },
        splitPolygon: function (poly, part) {
            var backP = [];
            var frontP = [];

            // this code looks for points which lie on the part plane and divide polygon into two parts
            if (poly.Points != null) {
                var polyPoints = [];
                var backPartPoints = [];
                var frontPartPoints = [];

                var outpts;
                var inpts;

                var count = poly.Points.length;
                for (var i = 0; i < count; i++) {
                    var ptB = poly.Points[i];
                    var ptC = poly.Points[this.getNext(i + 1, count)];
                    var sideB = this.classifyPoint(ptB, part);
                    var sideC = this.classifyPoint(ptC, part);

                    var vwiwcB = this.vector3DIndexClassification(ptB, polyPoints.length, sideB);
                    polyPoints.push(vwiwcB);

                    if ((sideB != sideC) && (sideB != "OnPlane") &&
                        (sideC != "OnPlane")) {
                        var v = vector.vector3DMinus(ptB, ptC);
                        var dir = vector.vector3DMinus(vector.vector3DStarMultiply(part.normal, (-part.D)), ptC);

                        var sv = vector.vector3dAND(dir, part.normal);
                        var sect = sv / vector.vector3dAND(part.normal, v);
                        var ptP = vector.vector3DPlus(ptC, vector.vector3DStarMultiply(v, sect));
                        var vwiwc = this.vector3DIndexClassification(ptP, polyPoints.length, "OnPlane");

                        polyPoints.push(vwiwc);
                        backPartPoints.push(vwiwc);
                        frontPartPoints.push(vwiwc);
                    }
                    else
                        if (sideB == "OnPlane") {
                            var ptA = poly.Points[this.getNext(i - 1, count)];
                            var sideA = this.classifyPoint(ptA, part);
                            if ((sideA == sideC)) continue;
                            if ((sideA != "OnPlane") && (sideC != "OnPlane")) {
                                backPartPoints.push(vwiwcB);
                                frontPartPoints.push(vwiwcB);
                            }
                            else
                                if (sideA == "OnPlane") {
                                    switch (sideC) {
                                        case "OnBack":
                                            backPartPoints.push(vwiwcB);
                                            break;
                                        case "OnFront":
                                            frontPartPoints.push(vwiwcB);
                                            break;
                                    }
                                }
                                else
                                    if (sideC == "OnPlane") {
                                        switch (sideA) {
                                            case "OnBack":
                                                backPartPoints.push(vwiwcB);
                                                break;
                                            case "OnFront":
                                                frontPartPoints.push(vwiwcB);
                                                break;
                                        }
                                    }
                        }
                }

                if ((frontPartPoints.length != 0) || (backPartPoints.length != 0)) {
                    for (var i = 0; i < backPartPoints.length - 1; i += 2) {
                        var vwiwc1 = backPartPoints[i];
                        var vwiwc2 = backPartPoints[i + 1];
                        vwiwc1.CuttingBackPoint = true;
                        vwiwc2.CuttingBackPoint = true;
                        vwiwc1.CuttingBackPairIndex = vwiwc2.index;
                        vwiwc2.CuttingBackPairIndex = vwiwc1.index;
                    }
                    for (var i = 0; i < frontPartPoints.length - 1; i += 2) {
                        var vwiwc1 = frontPartPoints[i];
                        var vwiwc2 = frontPartPoints[i + 1];
                        vwiwc1.CuttingFrontPoint = true;
                        vwiwc2.CuttingFrontPoint = true;
                        vwiwc1.CuttingFrontPairIndex = vwiwc2.index;
                        vwiwc2.CuttingFrontPairIndex = vwiwc1.index;
                    }


                    for (var i = 0; i < backPartPoints.length - 1; i++) {
                        var vwiwc1 = backPartPoints[i];
                        if (vwiwc1.alreadyCuttedBack) continue;
                        var outpts = this.cutOutBackPolygon(polyPoints, vwiwc1);

                        if (outpts.length > 2) {
                            var polygon1 = polygonobj.polygon3D(outpts, poly);
                            backP.push($.extend({}, polygon1));
                        }
                    }

                    for (var i = 0; i < frontPartPoints.length - 1; i++) {
                        var vwiwc2 = frontPartPoints[i];
                        if (vwiwc2.alreadyCuttedFront) continue;
                        inpts = this.cutOutFrontPolygon(polyPoints, vwiwc2);
                        if (inpts.length > 2) {
                            var polygon2 = polygonobj.polygon3D(inpts, poly);
                            frontP.push($.extend({}, polygon2));
                        }
                    }
                }
            }
            else {
                backP.push(poly);
                frontP.push(poly);
            }

            return { BackP: backP, FrontP: frontP }
        },
        cutOutFrontPolygon: function (polyPoints, vwiwc) {
            var points = [];

            var curVW = vwiwc;

            while (true) {
                curVW.alreadyCuttedFront = true;
                points.push(curVW.vector);

                var curVWPair = polyPoints[curVW.CuttingFrontPairIndex];

                if (curVW.CuttingFrontPoint) {
                    if (!curVWPair.alreadyCuttedFront) {
                        curVW = curVWPair;
                    }
                    else {
                        var curVWPrev = polyPoints[this.getNext(curVW.index - 1, polyPoints.length)];
                        var curVWNext = polyPoints[this.getNext(curVW.index + 1, polyPoints.length)];

                        if ((curVWPrev.result == "OnFront") && !curVWPrev.alreadyCuttedFront) {
                            curVW = curVWPrev;
                        }
                        else
                            if ((curVWNext.result == "OnFront") && !curVWNext.alreadyCuttedFront) {
                                curVW = curVWNext;
                            }
                            else {
                                return points;
                            }
                    }
                }
                else {
                    var curPrev = polyPoints[this.getNext(curVW.index - 1, polyPoints.length)];
                    var curNext = polyPoints[this.getNext(curVW.index + 1, polyPoints.length)];

                    if ((curPrev.result != "OnBack") && !curPrev.alreadyCuttedFront) {
                        curVW = curPrev;
                    }
                    else
                        if ((curNext.result != "OnBack") && !curNext.alreadyCuttedFront) {
                            curVW = curNext;
                        }
                        else {
                            return points;
                        }
                }
            }
            return points;
        },

        cutOutBackPolygon: function (polyPoints, vwiwc) {
            var points = [];
            var curVW = vwiwc;

            while (true) {
                curVW.alreadyCuttedBack = true;
                points.push(curVW.vector);

                var curVWPair = polyPoints[curVW.CuttingBackPairIndex];

                if (curVW.CuttingBackPoint) {
                    if (!curVWPair.alreadyCuttedBack) {
                        curVW = curVWPair;
                    }
                    else {
                        var curVWPrev = polyPoints[this.getNext(curVW.index - 1, polyPoints.length)];
                        var curVWNext = polyPoints[this.getNext(curVW.index + 1, polyPoints.length)];

                        if ((curVWPrev.result == "OnBack") && !curVWPrev.alreadyCuttedBack) {
                            curVW = curVWPrev;
                        }
                        else
                            if ((curVWNext.result == "OnBack") && !curVWNext.alreadyCuttedBack) {
                                curVW = curVWNext;
                            }
                            else {
                                return points;
                            }
                    }
                }
                else {
                    var curVWPrev = polyPoints[this.getNext(curVW.index - 1, polyPoints.length)];
                    var curVWNext = polyPoints[this.getNext(curVW.index + 1, polyPoints.length)];

                    if ((curVWPrev.result != "OnFront") && !curVWPrev.alreadyCuttedBack) {
                        curVW = curVWPrev;
                    }
                    else
                        if ((curVWNext.result != "OnFront") && !curVWNext.alreadyCuttedBack) {
                            curVW = curVWNext;
                        }
                        else {
                            return points;
                        }
                }
            }
            return points
        },
        build: function () {
            if (!arguments[0]) {
                return (this.build(ej.Ej3DRender.Polygons));
            }
            else {
                var arlist = arguments[0];
                if (arlist.length < 1) return null;
                var bspNode = { Back: null, Front: null, Plane: null }
                var plane = arlist[0];
                bspNode.Plane = plane;
                var arleft = [];
                var arright = [];

                for (var i = 1, len = arlist.length; i < len; i++) {
                    var pln = arlist[i];

                    if (pln == plane) continue;
                    var r = this.classifyPolygon(plane, pln);

                    switch (r) {
                        case "OnPlane":
                        case "ToRight":
                            arright.push(pln);
                            break;

                        case "ToLeft":
                            arleft.push(pln);
                            break;

                        case "Unknown":
                            //if (pln is Line3D || pln is UIElement3D)
                            if (pln.element && (pln.element.tag == "line" || pln.element.tag == "text")) {
                                arleft.push(pln);
                            }
                            else {

                                var result = this.splitPolygon(pln, plane);
                                for (var k = 0; k < result.BackP.length; k++) {
                                    result.BackP[k].Name = result.BackP[k].Name + "back";
                                    arleft.push(result.BackP[k]);
                                }
                                for (var j = 0; j < result.FrontP.length; j++) {
                                    result.FrontP[j].Name = result.FrontP[j].Name + "front";
                                    arright.push(result.FrontP[j]);
                                }
                            }
                            break;
                    }
                }

                if (arleft.length > 0) {
                    bspNode.Back = this.build(arleft);
                }

                if (arright.length > 0) {
                    bspNode.Front = this.build(arright);
                }

                return bspNode;
            }
        }

    }

    Ej3DRender.polygon3D.prototype = {
        // Member    
        epsilon: 0.00001,
        normal: { x: 0, y: 0, z: 0 },

        vector: new (new ej.Ej3DRender()).vector3D(),

        // Constructor
        polygon3D: function (points, tag, index, stroke, strokeThickness, opacity, fill, name) {

            if (arguments.length == 3) {
                this.calcNormal(arguments[0], arguments[1], arguments[2])
            }
            else if (arguments.length == 2) {
                points = arguments[0];
                this.calcNormal(points[0], points[1], points[2]);
                this.vectorPoints = points;
                this.calcNormal(this.vectorPoints);
                var polygon = arguments[1];
                polygon.Normal = this.normal;
                polygon.normal = this.normal;
                polygon.Points = points;
                polygon.VectorPoints = this.vectorPoints;
                polygon.IsSplitted = true;
                polygon.d = this.d;
                polygon.D = this.d;
                return polygon;

            }
            else {
                this.calcNormal(points[0], points[1], points[2]);
                this.vectorPoints = points;
                this.calcNormal(this.vectorPoints);
                var element = { Tag: 'path', Parent: arguments[arguments.length - 1] }
                var polygon = {
                    Normal: this.normal,
                    normal: this.normal,
                    Points: points,
                    VectorPoints: this.vectorPoints,
                    Index: index,
                    Tag: tag,
                    Name: (name) ? name : null,
                    StrokeThickness: strokeThickness,
                    Opacity: opacity,
                    Fill: fill,
                    d: this.d,
                    D: this.d
                }
                if (arguments.length != 1)
                    polygon.Element = element;

                return polygon;

            }
        },

        //Methods
        createLine: function (line, x1, y1, x2, y2, depth) {
            var strokeThickness = line.width;
            var vectorColl = [];
            vectorColl[0] = vector.vector3D(x1, y1, depth);
            vectorColl[1] = vector.vector3D(x1 + strokeThickness, y2 + strokeThickness, depth);
            vectorColl[2] = vector.vector3D(x2, y2, depth);
            return this.line3D(line, vectorColl);
        },
        createPolyline: function (points, element) {
            if (points.length == 2) {
                var prePoint = points[1];
                points.push(vector.vector3D(prePoint.x, prePoint.y, prePoint.z));
            }
            return this.polyLine3D(element, points);
        },
        polyLine3D: function (element, points) {
            var plane = this.polygon3D(points);
            plane.element = element;
            return plane;
        },

        line3D: function (element, points) {
            var plane = this.polygon3D(points);
            plane.element = element;
            return plane;
        },
        text3D: function (element, points) {
            var plane = this.polygon3D(points);
            plane.element = element;
            return plane;
        },
        createCylinder: function (v1, v2, tag, index, type, stroke, fill, strokeThickness, opacity, inverse, name, parent) {
            var i = 0, ox, oy, oz, vts, pathCount = 24, theta = 360 / pathCount, DtoR = Math.PI / 180, CenterZ = (parseFloat)((v1.z + v2.z) / 2), res = [], oPts = [], tVtxs = [], bVtxs = [], radiusb = (v2.y - v1.y) < (v2.z - v1.z) ? (parseFloat)((v2.y - v1.y) / 2) : (parseFloat)((v2.z - v1.z) / 2), radiusc = (v2.x - v1.x) < (v2.z - v1.z) ? (parseFloat)((v2.x - v1.x) / 2) : (parseFloat)((v2.z - v1.z) / 2), CenterX = (parseFloat)((v1.x + v2.x) / 2), CenterY = (parseFloat)((v1.y + v2.y) / 2);
            var type = type.toLowerCase();
            switch (type) {
                case "bar":
                case "stackingbar":
                case "stackingbar100":
                    pathCount++;
                    while (pathCount--) {
                        oy = (parseFloat)(CenterY + radiusb * Math.cos((i * theta) * DtoR));
                        oz = (parseFloat)(CenterZ + radiusb * Math.sin((i * theta) * DtoR));
                        oPts[i] = { Y: oy, Z: oz };
                        tVtxs.push(vector.vector3D(v1.x, oPts[i].Y, oPts[i].Z));
                        bVtxs.push(vector.vector3D(v2.x, oPts[i].Y, oPts[i].Z));
                        if (i > 0) {
                            vts = new Array(vector.vector3D(v1.x, oPts[i - 1].Y, oPts[i - 1].Z),
                                vector.vector3D(v2.x, oPts[i - 1].Y, oPts[i - 1].Z),
                                vector.vector3D(v2.x, oPts[i].Y, oPts[i].Z),
                                vector.vector3D(v1.x, oPts[i].Y, oPts[i].Z))
                            res[i + 1] = this.polygon3D(vts, tag, index, fill, 0, opacity, fill, "_" + (i + 1).toString() + "_" + name, parent);
                            graphics.addVisual(res[i + 1]);
                        }
                        i++;
                    }
                    break;
                case "column":
                case "stackingcolumn":
                case "stackingcolumn100":
                    pathCount++;
                    while (pathCount--) {
                        ox = (parseFloat)(CenterX + radiusc * Math.cos((i * theta) * DtoR));
                        oz = (parseFloat)(CenterZ + radiusc * Math.sin((i * theta) * DtoR));
                        oPts[i] = { X: ox, Z: oz };
                        tVtxs.push(vector.vector3D(oPts[i].X, v1.y, oPts[i].Z));
                        bVtxs.push(vector.vector3D(oPts[i].X, v2.y, oPts[i].Z));
                        if (i > 0) {
                            vts = new Array(vector.vector3D(oPts[i - 1].X, v1.y, oPts[i - 1].Z),
                                vector.vector3D(oPts[i - 1].X, v2.y, oPts[i - 1].Z),
                                vector.vector3D(oPts[i].X, v2.y, oPts[i].Z),
                                vector.vector3D(oPts[i].X, v1.y, oPts[i].Z))
                            res[i + 1] = this.polygon3D(vts, tag, index, fill, 0, opacity, fill, "_" + (i + 1).toString() + "_" + name, parent);
                            graphics.addVisual(res[i + 1]);
                        }
                        i++;
                    }
                    break;
                default:
                    break;
            }
            res[0] = this.polygon3D(bVtxs, tag, index, stroke, 0, opacity, fill, "_0_" + name, parent);
            res[1] = this.polygon3D(tVtxs, tag, index, stroke, strokeThickness, opacity, fill, "_1_" + name, parent);
            graphics.addVisual(res[0]);
            graphics.addVisual(res[1]);
            return res;
        },

        createBox: function (v1, v2, tag, index, graphics3D, stroke, fill, strokeThickness, opacity, inverse, name, parent) {
            var res = [];

            var p1 = new Array(vector.vector3D(v1.x, v1.y, v1.z),
                vector.vector3D(v2.x, v1.y, v1.z),
                vector.vector3D(v2.x, v2.y, v1.z),
                vector.vector3D(v1.x, v2.y, v1.z))

            var p2 = new Array(
                vector.vector3D(v1.x, v1.y, v2.z),
                vector.vector3D(v2.x, v1.y, v2.z),
                vector.vector3D(v2.x, v2.y, v2.z),
                vector.vector3D(v1.x, v2.y, v2.z)
            )

            var p3 = new Array(

                vector.vector3D(v1.x, v1.y, v2.z),
                vector.vector3D(v2.x, v1.y, v2.z),
                vector.vector3D(v2.x, v1.y, v1.z),
                vector.vector3D(v1.x, v1.y, v1.z)
            )

            var p4 = new Array(
                vector.vector3D(v1.x, v2.y, v2.z),
                vector.vector3D(v2.x, v2.y, v2.z),
                vector.vector3D(v2.x, v2.y, v1.z),
                vector.vector3D(v1.x, v2.y, v1.z)
            )

            var p5 = new Array(
                vector.vector3D(v1.x, v1.y, v1.z),
                vector.vector3D(v1.x, v1.y, v2.z),
                vector.vector3D(v1.x, v2.y, v2.z),
                vector.vector3D(v1.x, v2.y, v1.z)
            )

            var p6 = new Array(
                vector.vector3D(v2.x, v1.y, v1.z),
                vector.vector3D(v2.x, v1.y, v2.z),
                vector.vector3D(v2.x, v2.y, v2.z),
                vector.vector3D(v2.x, v2.y, v1.z)
            )
            if (arguments[10]) {

                res[0] = this.polygon3D(p1, tag, index, stroke, strokeThickness, opacity, fill, "_0_" + name, parent);
                res[1] = this.polygon3D(p2, tag, index, stroke, strokeThickness, opacity, fill, "_1_" + name, parent);
                res[2] = this.polygon3D(p3, tag, index, stroke, strokeThickness, opacity, fill, "_2_" + name, parent);
                res[3] = this.polygon3D(p4, tag, index, stroke, strokeThickness, opacity, fill, "_3_" + name, parent);
                res[4] = this.polygon3D(p5, tag, index, stroke, strokeThickness, opacity, fill, "_4_" + name, parent);
                res[5] = this.polygon3D(p6, tag, index, stroke, strokeThickness, opacity, fill, "_5_" + name, parent);
            }
            else {
                var parent = arguments[arguments.length - 1];
                res[0] = this.polygon3D(p1, tag, index, stroke, strokeThickness, opacity, fill, "_0_" + index, parent);
                res[1] = this.polygon3D(p2, tag, index, stroke, strokeThickness, opacity, fill, "_1_" + index, parent);
                res[2] = this.polygon3D(p3, tag, index, stroke, strokeThickness, opacity, fill, "_2_" + index, parent);
                res[3] = this.polygon3D(p4, tag, index, stroke, strokeThickness, opacity, fill, "_3_" + index, parent);
                res[4] = this.polygon3D(p5, tag, index, stroke, strokeThickness, opacity, fill, "_4_" + index, parent);
                res[5] = this.polygon3D(p6, tag, index, stroke, strokeThickness, opacity, fill, "_5_" + index, parent);
            }

            if (inverse) {
                graphics.addVisual(res[0]);
                graphics.addVisual(res[1]);
                graphics.addVisual(res[2]);
                graphics.addVisual(res[3]);
                graphics.addVisual(res[4]);
                graphics.addVisual(res[5]);
            }
            else {
                graphics.addVisual(res[5]);
                graphics.addVisual(res[4]);
                graphics.addVisual(res[0]);
                graphics.addVisual(res[1]);
                graphics.addVisual(res[2]);
                graphics.addVisual(res[3]);

            }
            return res;
        },


        calcNormal: function () {
            if (arguments.length >= 3) {
                // Relative information of the points
                var v1 = arguments[0];
                var v2 = arguments[1];
                var v3 = arguments[2];
                var v4 = vector.vector3DMinus(v1, v2);
                var v5 = vector.vector3DMinus(v3, v2);
                var n = vector.vector3DMultiply(v4, v5);

                var l = vector.getLength(n);//Get length of the vector

                if (l < this.epsilon) {
                    l = 1;
                }

                this.normal = vector.vector3D(n.x / l, n.y / l, n.z / l); //Calculate normalization of the vector
                this.d = -(this.normal.x * v1.x + this.normal.y * v1.y + this.normal.z * v1.z);// Normalized values * 1st coordinates Coordinates - Depth of the plan

                if (arguments[3]) {
                    arguments[3].normal = this.normal;
                    arguments.d = this.d;
                }
            }
            else {
                var Points = arguments[0];
                this.calcNormal(Points[0], Points[1], Points[2], arguments[1]);

                for (var i = 3; (i < Points.length) && (this.test()); i++) {
                    this.calcNormal(Points[i], Points[0], Points[i / 2]);
                }
            }
        },

        test: function () {
            return !vector.isValid(this.normal);
        },

        transform: function (matrix, plan) {
            if (plan.Points != null) {
                for (var i = 0; i < plan.Points.length; i++) {

                    plan.VectorPoints[i] = plan.Points[i] = matrixobj.getMatrixVectorMutiple(matrix, plan.Points[i]);
                }

                this.calcNormal(plan.VectorPoints, plan);
            }
            else {
                var v = matrix * (plan.normal * -plan.d);
                plan.normal = matrixobj.getMatrixVectorAnd(matrix, plan.normal);
                vector.normalize(normal);
                plan.d = -(plan.normal & v);
            }
        },

        getPoint: function (x, y, normal, d) {
            if (typeof x == double) {
                var z = -(normal.x * x + normal.y * y + d) / normal.z;

                return vector.vector3D(x, y, z);
            }
            else {
                var position = x;
                var ray = y;
                var dir = vector.vector3DMinus(vector.vector3DStarMultiply(normal, (-d)), position);

                var sv = vector.vector3dAND(dir, normal);
                var sect = sv / vector.vector3dAND(normal, ray);

                return vector.vector3DPlus(position, (vector.vector3DStarMultiply(ray * sect)));
            }
        },

        getNormal: function (transform, VectorPoints) {
            var norm;

            if (VectorPoints != null) {
                norm = vector.getNormal(matrixobj.getMatrixVectorMutiple(transform, VectorPoints[0]),
                    matrixobj.getMatrixVectorMutiple(transform, VectorPoints[1]), matrixobj.getMatrixVectorMutiple(transform, VectorPoints[2]))


                for (var i = 3; (i < VectorPoints.length) && !vector.isValid(norm) && VectorPoints[i / 2]; i++) {
                    var v1 = matrixobj.getMatrixVectorMutiple(transform, VectorPoints[i]);
                    var v2 = matrixobj.getMatrixVectorMutiple(transform, VectorPoints[0]);
                    var v3 = matrixobj.getMatrixVectorMutiple(transform, VectorPoints[i / 2]);

                    norm = vector.getNormal(v1, v2, v3);
                }
            }
            else {
                norm = matrixobj.getMatrixVectorAnd(transform, normal);
                vector.normalize();
            }

            return norm;

        },

        createTextElement: function (position, element, xLen, yLen) {

            var vectorColl = [];
            var x = position.x;
            var y = position.y;

            var desiredWidth = element.Width;
            var desiredHeight = element.Height;

            vectorColl[0] = this.vector.vector3D(x, y, position.z);
            vectorColl[1] = this.vector.vector3D(x + desiredWidth, y + desiredHeight + yLen, position.z);
            vectorColl[2] = this.vector.vector3D(x + desiredWidth + xLen, y + desiredHeight + yLen, position.z);
            return this.text3D(element, vectorColl);
        },

        redraw: function () { },

        drawPolyLine: function (panel, sender) {
            var transform = ej.Ej3DRender.transform;
            var pathDirection = ej.EjSvgRender.utils._getStringBuilder();
            var StartPoint = ej.EjSvgRender.chartTransform3D.toScreen(panel.VectorPoints[0], transform);
            pathDirection.append("M" + " " + (StartPoint.x) + " " + (StartPoint.y) + " ");
            for (var i = 0; i < panel.VectorPoints.length; i++) {
                var lineSegment = ej.EjSvgRender.chartTransform3D.toScreen(panel.VectorPoints[i], transform);
                pathDirection.append("L" + " " + (lineSegment.x) + " " + (lineSegment.y) + " ");

            }

            var direction = pathDirection.toString();


            var optionsLine = {
                'id': panel.element.id,
                'stroke-dasharray': panel.element.dashArray,
                'stroke-width': panel.element.width,
                'stroke': panel.element.stroke,
                'd': direction
            };
            optionsLine.id = (optionsLine.id).replace(/[^a-zA-Z0-9]/g, "");
            sender.svgRenderer.drawPath(optionsLine, panel.element.child);
        },

        drawLine: function (panel, sender) {

            var transform = ej.Ej3DRender.transform;
            if (transform == null) return;
            var actual3DPosition1 = ej.EjSvgRender.chartTransform3D.toScreen(panel.VectorPoints[0], transform);
            var actual3DPosition2 = ej.EjSvgRender.chartTransform3D.toScreen(panel.VectorPoints[2], transform);

            var optionsLine = {
                'id': panel.element.id,
                x1: actual3DPosition1.x,
                y1: actual3DPosition1.y,
                x2: actual3DPosition2.x,
                y2: actual3DPosition2.y,
                'stroke-dasharray': panel.element.dashArray,
                'stroke-width': panel.element.width,
                'stroke': panel.element.stroke,
                'opacity': panel.element.opacity
            };
            optionsLine.id = (optionsLine.id).replace(/[^a-zA-Z0-9]/g, "");
            sender.svgRenderer.drawLine(optionsLine, panel.element.child);


        },
        drawTemplate: function (panel, sender) {
            var element = panel.element;
            var transform = ej.Ej3DRender.transform;
            if (transform == null) return;
            var actual3DPosition = ej.EjSvgRender.chartTransform3D.toScreen(panel.VectorPoints[0], transform);
            ej.EjSeriesRender.prototype.drawLabelTemplate(element.Label.series, element.Label.series.points[element.Label.pointIndex], element.Label.pointIndex, { X: actual3DPosition.x, Y: actual3DPosition.y }, sender)
        },
        drawText: function (panel, sender) {

            var element = panel.element;
            var transform = ej.Ej3DRender.transform;
            if (transform == null) return;
            var actual3DPosition = ej.EjSvgRender.chartTransform3D.toScreen(panel.VectorPoints[0], transform);
            var x = actual3DPosition.x;
            var y = actual3DPosition.y;

            if (element.tag == "text") {
                var options = {
                    'id': element.id,
                    'x': x,
                    'y': y,
                    'fill': element.font.color,
                    'font-size': element.font.size,
                    'font-family': element.font.fontFamily,
                    'font-style': element.font.fontStyle,
                    'font-weight': element.font.fontWeight,
                    'opacity': element.font.opacity,
                    'text-anchor': element.TextAnchor,
                    "cursor": "default",
                    'transform': element.Angle ? 'rotate(' + element.Angle + ',' + (x) + ',' + y + ')' : null
                };

                sender.svgRenderer.drawText(options, panel.element.Label.Text, panel.element.child, panel.element.font);
            }
            else {
                var series = element.series;

                var labelFormat = (series.yAxis && series.yAxis.labelFormat) ? series.yAxis.labelFormat : "";
                var pointText = (element.point.text) ? element.point.text : element.point.y + labelFormat.substring(labelFormat.indexOf('}') + 1);
                var textOffset = ej.EjSvgRender.utils._measureText(pointText, null, series.marker.dataLabel.font);
                var margin = series.marker.dataLabel.margin;
                var width = textOffset.width + margin.left + margin.right;
                var height = textOffset.height + margin.top + margin.bottom;
                var location = { X: actual3DPosition.x, Y: actual3DPosition.y }, symbolName;


                if (series.marker.dataLabel.shape)
                    var elementShape = series.marker.dataLabel.shape;
                else if (series.marker.dataLabel.shape)
                    elementShape = marker.dataLabel.shape;
                else
                    elementShape = "None";

                $.each(sender.model.symbolShape, function (name) {
                    if (elementShape.toLowerCase() == name.toLowerCase())
                        symbolName = name;
                });

                var xXalue = location.X - (margin.left) / 2 + (margin.right) / 2;
                var yValue = location.Y - (margin.top) / 2 - (height / margin.top) + (margin.bottom) / 2;

                var seriesIndex = $.inArray(series, sender.model.series);
                ej.EjSeriesRender.prototype.dataLabelSymbol(seriesIndex, series, element.pointIndex, xXalue, yValue, width, height, symbolName, sender);

            }

        },

        draw: function (panel, sender) {
            if (panel.VectorPoints == null || panel.VectorPoints.length <= 0) return;
            var transform = ej.Ej3DRender.transform;
            var pathDirection = ej.EjSvgRender.utils._getStringBuilder();
            var color = panel.Fill;
            var format = sender.svgRenderer.checkColorFormat(color);
            if (!format)
                color = sender.colorNameToHex(color);
            var figure = { Segments: null, StartPoint: null };
            if (transform != null) {
                figure.StartPoint = ej.EjSvgRender.chartTransform3D.toScreen(panel.VectorPoints[0], transform);
                pathDirection.append("M" + " " + (figure.StartPoint.x) + " " + (figure.StartPoint.y) + " ");
                for (var i = 0; i < panel.VectorPoints.length; i++) {
                    var lineSegment = ej.EjSvgRender.chartTransform3D.toScreen(panel.VectorPoints[i], transform);
                    pathDirection.append("L" + " " + (lineSegment.x) + " " + (lineSegment.y) + " ");

                }
            }

            var direction = pathDirection.toString();

            var name = "Light";
            var lightCoefZ = (2 * (Math.abs(vector.vector3dAND(panel.normal, vector.vector3D(0, 0, 1))) - 1));
            var lightCoefY = (2 * (Math.abs(vector.vector3dAND(panel.normal, vector.vector3D(0, 1, 0))) - 1));
            var lightCoefX = (2 * (Math.abs(vector.vector3dAND(panel.normal, vector.vector3D(1, 0, 0))) - 1));
            if (lightCoefZ == lightCoefX) {
                name = "ZLight";
                color = this.applyZLight(color, sender);
            }
            else if (((lightCoefY == lightCoefZ) || (lightCoefZ != 0 && lightCoefY < lightCoefZ))) {
                name = "XLight";
                color = this.applyXLight(color, sender);
            }
            else if (lightCoefZ < 0) {
                name = "ZLight";
                color = this.applyZLight(color, sender);
            }
            else {
                name = "Light";
                color = color;
            }
            if (sender.model.AreaType == "none")
                panel.StrokeThickness = 0;
            var optionsMinorGrid = {
                'id': sender.svgObject.id + "_" + panel.Name,
                'name': name,
                'fill': color,
                'stroke': panel.Stroke,
                'stroke-width': panel.StrokeThickness,
                'opacity': panel.Opacity,
                'd': direction
            };
            sender.svgRenderer.drawPath(optionsMinorGrid, panel.Element.Parent);
            if (sender.model.previousID && sender.model.touchCross)
                $("#" + optionsMinorGrid.id).insertAfter($("#" + sender.model.previousID));

            sender.model.previousID = optionsMinorGrid.id;
        },

        applyXLight: function (color, sender) {
            var RGB = sender.svgRenderer.hexToRGB(color);
            RGB.R = (parseInt)(RGB.R * 0.7);
            RGB.G = (parseInt)(RGB.G * 0.7);
            RGB.B = (parseInt)(RGB.B * 0.7);
            return sender.svgRenderer.hexFromRGB(RGB);
        },

        applyZLight: function (color, sender) {
            var RGB = sender.svgRenderer.hexToRGB(color);
            RGB.R = (parseInt)(RGB.R * 0.9);
            RGB.G = (parseInt)(RGB.G * 0.9);
            RGB.B = (parseInt)(RGB.B * 0.9);
            return sender.svgRenderer.hexFromRGB(RGB);
        },

        update: function (updatedVectors, panel, sender) {
            if (panel.VectorPoints == null || panel.VectorPoints.length <= 0) return;
            panel.VectorPoints = updatedVectors;
            var transform = ej.Ej3DRender.transform;
            var pathDirection = ej.EjSvgRender.utils._getStringBuilder();
            var color = panel.Fill;
            var figure = { Segments: null, StartPoint: null };
            if (transform != null) {
                figure.StartPoint = ej.EjSvgRender.chartTransform3D.toScreen(panel.VectorPoints[0], transform);
                pathDirection.append("M" + " " + (figure.StartPoint.x) + " " + (figure.StartPoint.y) + " ");
                for (var i = 0; i < panel.VectorPoints.length; i++) {
                    var lineSegment = ej.EjSvgRender.chartTransform3D.toScreen(panel.VectorPoints[i], transform);
                    pathDirection.append("L" + " " + (lineSegment.x) + " " + (lineSegment.y) + " ");

                }
            }

            var direction = pathDirection.toString();

            if ($(sender.chartObj.chart3D).find("#" + sender.chartObj.svgObject.id + "_" + panel.Name).length > 0) {
                var element = $(sender.chartObj.chart3D).find("#" + sender.chartObj.svgObject.id + "_" + panel.Name)[0];
                sender.chartObj.svgRenderer._setAttr($(element), { 'd': direction });

            }

        }


    }
    var Ej3DRender = new ej.Ej3DRender();
    var vector = new Ej3DRender.vector3D();
    var matrixobj = new Ej3DRender.matrix3D();
    var bsptreeobj = new Ej3DRender.BSPTreeBuilder();
    var polygonobj = new Ej3DRender.polygon3D();
    var graphics = new Ej3DRender.Graphics3D();


})(jQuery);