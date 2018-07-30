(function ($, ej) {
    "use strict";
    ej.MatrixTypes = { Identity: 0, Translation: 1, Scaling: 2, Unknown: 4 };
    ej.MatrixDefaults = { m11: 1, m12: 0, m21: 0, m22: 1, offsetX: 0, offsetY: 0, type: ej.MatrixTypes.Identity };
    ej.Matrix = {
        identity: function () {
            return $.extend(true, {}, ej.MatrixDefaults);
        },
        multiply: function (matrix1, matrix2) {
            var type = matrix1.type;
            var type2 = matrix2.type;
            if (type2 == ej.MatrixTypes.Identity) {
                return;
            }
            if (type == ej.MatrixTypes.Identity) {
                matrix1.m11 = matrix2.m11;
                matrix1.m12 = matrix2.m12;
                matrix1.m21 = matrix2.m21;
                matrix1.m22 = matrix2.m22;
                matrix1.offsetX = matrix2.offsetX;
                matrix1.offsetY = matrix2.offsetY;
                matrix1.type = matrix2.type;
                return;
            }
            if (type2 == ej.MatrixTypes.Translation) {
                matrix1.offsetX += matrix2.offsetX;
                matrix1.offsetY += matrix2.offsetY;
                if (type != ej.MatrixTypes.Unknown) {
                    matrix1.type |= ej.MatrixTypes.Translation;
                }
                return;
            }
            if (type != ej.MatrixTypes.Translation) {
                var num = type << 4 | type2;
                switch (num) {
                    case 34:
                        matrix1.m11 *= matrix2.m11;
                        matrix1.m22 *= matrix2.m22;
                        return;
                    case 35:
                        matrix1.m11 *= matrix2.m11;
                        matrix1.m22 *= matrix2.m22;
                        matrix1.offsetX = matrix2.offsetX;
                        matrix1.offsetY = matrix2.offsetY;
                        matrix1.type = (ej.MatrixTypes.Translation | ej.MatrixTypes.Scaling);
                        return;
                    case 36: break;
                    default:
                        {
                            switch (num) {
                                case 50:
                                    matrix1.m11 *= matrix2.m11;
                                    matrix1.m22 *= matrix2.m22;
                                    matrix1.offsetX *= matrix2.m11;
                                    matrix1.offsetY *= matrix2.m22;
                                    return;
                                case 51:
                                    matrix1.m11 *= matrix2.m11;
                                    matrix1.m22 *= matrix2.m22;
                                    matrix1.offsetX = matrix2.m11 * matrix1.offsetX + matrix2.offsetX;
                                    matrix1.offsetY = matrix2.m22 * matrix1.offsetY + matrix2.offsetY;
                                    return;
                                case 52: break;
                                default:
                                    switch (num) {
                                        case 66:
                                        case 67:
                                        case 68: break;
                                        default: return;
                                    }
                                    break;
                            }
                            break;
                        }
                }
                var result = this.identity();
                this._setMatrix(result, matrix1.m11 * matrix2.m11 + matrix1.m12 * matrix2.m21,
                    matrix1.m11 * matrix2.m12 + matrix1.m12 * matrix2.m22, matrix1.m21 * matrix2.m11 + matrix1.m22 * matrix2.m21,
                    matrix1.m21 * matrix2.m12 + matrix1.m22 * matrix2.m22,
                    matrix1.offsetX * matrix2.m11 + matrix1.offsetY * matrix2.m21 + matrix2.offsetX, matrix1.offsetX * matrix2.m12 + matrix1.offsetY * matrix2.m22 + matrix2.offsetY);
                if (result.m21 || result.m12) {
                    result.type = ej.MatrixTypes.Unknown;
                }
                else {
                    if (result.m11 && result.m11 != 1.0 || result.m22 && result.m22 != 1.0) {
                        result.type = ej.MatrixTypes.Scaling;
                    }
                    if (result.offsetX || result.offsetY) {
                        result.type |= ej.MatrixTypes.Translation;
                    }
                    if ((result.type & (ej.MatrixTypes.Translation | ej.MatrixTypes.Scaling)) == ej.MatrixTypes.Identity) {
                        result.type = ej.MatrixTypes.Identity;
                    }
                }
                matrix1.m11 = result.m11;
                matrix1.m12 = result.m12;
                matrix1.m21 = result.m21;
                matrix1.m22 = result.m22;
                matrix1.offsetX = result.offsetX;
                matrix1.offsetY = result.offsetY;
                matrix1.type = result.type;
                return;
            }
            var offsetX = matrix1.offsetX;
            var offsetY = matrix1.offsetY;
            matrix1.m11 = matrix2.m11;
            matrix1.m12 = matrix2.m12;
            matrix1.m21 = matrix2.m21;
            matrix1.m22 = matrix2.m22;
            matrix1.offsetX = matrix2.offsetX;
            matrix1.offsetY = matrix2.offsetY;
            matrix1.type = matrix2.type;
            matrix1.offsetX = offsetX * matrix2.m11 + offsetY * matrix2.m21 + matrix2.offsetX;
            matrix1.offsetY = offsetX * matrix2.m12 + offsetY * matrix2.m22 + matrix2.offsetY;
            if (type2 == ej.MatrixTypes.Unknown) {
                matrix1.type = ej.MatrixTypes.Unknown;
                return;
            }
            matrix1.type = (ej.MatrixTypes.Translation | ej.MatrixTypes.Scaling);
        },
        transform: function (matrix, point) {
            var pt = this._multiplyPoint(matrix, point.x, point.y);
            return { x: Math.round(pt.x * 100) / 100, y: Math.round(pt.y * 100) / 100 };
        },
        rotate: function (matrix, angle, centerX, centerY) {
            angle %= 360.0;
            this.multiply(matrix, this._createRotationRadians(angle * 0.017453292519943295, centerX ? centerX : 0, centerY ? centerY : 0));
        },
        scale: function (matrix, scaleX, scaleY, centerX, centerY) {
            this.multiply(matrix, this._createScaling(scaleX, scaleY, centerX ? centerX : 0, centerY ? centerY : 0));
        },
        translate: function (matrix, offsetX, offsetY) {
            if (matrix.type & ej.MatrixTypes.Identity) {
                this._setMatrix(matrix, 1.0, 0.0, 0.0, 1.0, offsetX, offsetY, ej.MatrixTypes.Translation);
                return;
            }
            if (matrix.type & ej.MatrixTypes.Unknown) {
                matrix.offsetX += offsetX;
                matrix.offsetY += offsetY;
                return;
            }
            matrix.offsetX += offsetX;
            matrix.offsetY += offsetY;
            matrix.type |= ej.MatrixTypes.Translation;
        },
        _createScaling: function (scaleX, scaleY, centerX, centerY) {
            var result = this.identity();
            this._setMatrix(result, scaleX, 0.0, 0.0, scaleY, centerX - scaleX * centerX, centerY - scaleY * centerY,
                !(centerX || centerY) ? ej.MatrixTypes.Scaling : ej.MatrixTypes.Scaling | ej.MatrixTypes.Translation);
            return result;
        },
        _createRotationRadians: function (angle, centerX, centerY) {
            var result = this.identity();
            var num = Math.sin(angle);
            var num2 = Math.cos(angle);
            var offsetX = centerX * (1.0 - num2) + centerY * num;
            var offsetY = centerY * (1.0 - num2) - centerX * num;
            this._setMatrix(result, num2, num, -num, num2, offsetX, offsetY, ej.MatrixTypes.Unknown);
            return result;
        },
        _multiplyPoint: function (matrix, x, y) {
            switch (matrix.type) {
                case ej.MatrixTypes.Identity: break;
                case ej.MatrixTypes.Translation:
                    x += matrix.offsetX;
                    y += matrix.offsetY;
                    break;
                case ej.MatrixTypes.Scaling:
                    x *= matrix.m11;
                    y *= matrix.m22;
                    break;
                case ej.MatrixTypes.Translation | ej.MatrixTypes.Scaling:
                    x *= matrix.m11;
                    x += matrix.offsetX;
                    y *= matrix.m22;
                    y += matrix.offsetY;
                    break;
                default:
                    var num = y * matrix.m21 + matrix.offsetX;
                    var num2 = x * matrix.m12 + matrix.offsetY;
                    x *= matrix.m11;
                    x += num;
                    y *= matrix.m22;
                    y += num2;
                    break;
            }
            return { x: x, y: y };
        },
        _setMatrix: function (matrix, m11, m12, m21, m22, offsetX, offsetY, type) {
            matrix.m11 = m11;
            matrix.m12 = m12;
            matrix.m21 = m21;
            matrix.m22 = m22;
            matrix.offsetX = offsetX;
            matrix.offsetY = offsetY;
            matrix.type = type || ej.MatrixTypes.Identity;
        }
    };
})(jQuery, Syncfusion);