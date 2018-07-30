(function ($, ej, undefined) {
	
    ej.spreadsheetFeatures = ej.spreadsheetFeatures || {};
    ej.spreadsheetFeatures.math = {
        toFraction: function (val) {
            if (this.isNumber(val)) {
                var input = val.toString(), integerval = input.split(".")[0], decimalval = input.split(".")[1];
                if (!decimalval)
                    return { integer: val };
                var wholeval = (+decimalval).toString(), placeval = this.getPlaceValue(decimalval, wholeval), gcd = this.getGcd(wholeval, placeval);
                return { integer: integerval, numerator: Number(wholeval) / gcd, denominator: Number(placeval) / gcd };
            }
            return null;
        },

        toExponential: function (val, decimalplaces) {
            if (this.isNumber(val)) {
                var expval, input = Number(val);
                decimalplaces = decimalplaces || 2;
                if (decimalplaces > 20)
                    decimalplaces = 20;
                expval = input.toExponential(decimalplaces).split("e+");
                return expval[0] + "E+" + this.padZeros(expval[1]);
            }
            return null;
        },

        toAccounting: function (formatstr, value, locale) {
            if (this.isNumber(value) && formatstr) {
                var prefix, suffix, val = ej.widgetBase.formatting(formatstr, value, locale), symbol = this._currencySymbol,
                    trunval = $.trim(val.replace(symbol, "")), idx = val.indexOf(symbol);
                if (!idx || (value < 0 && idx === 1)) {
                    prefix = symbol;
                    suffix = !Number(value) ? "-" : trunval;
                }
                else {
                    prefix = !Number(value) ? "-" : trunval;
                    suffix = symbol;
                }
                value = prefix + "   " + suffix;
            }
            return value;
        },

        intToDate: function (num) {
            return new Date(((Number(num) - 2) * (1000 * 3600 * 24)) + new Date("01/01/1900").getTime());
        },

        getGcd: function (a, b) {  //make generic gcd of multiple no
            a = Number(a);
            b = Number(b);
            if (!b)
                return a;
            return this.getGcd(b, a % b);
        },

        isNumber: function (val) {
            return val - parseFloat(val) >= 0;
        },

        isTime: function (val) {
            return !val ? false : val.toString().indexOf(":") !== -1;
        },

        isFormula: function (formula) {
            var obrackets, cbrackets;
            if (formula) {
                if (!formula.toString().indexOf("=") && formula.length > 1) {
                    obrackets = formula.split("(").length - 1;
                    cbrackets = formula.split(")").length - 1;
                    return obrackets === cbrackets;
                }
            }
            return false;
        },

        getPlaceValue: function (val, digit) {
            var index = val.indexOf(digit) + digit.length;
            return "1" + Array(index + 1).join("0");
        },

        padZeros: function (val, digits, position) {
            if (this.isNumber(val)) {
                digits = this.isNumber(digits) ? digits : 2;
                position = ej.isNullOrUndefined(ej.Spreadsheet.autoFillDirection[position]) ? ej.Spreadsheet.autoFillDirection.Left : ej.Spreadsheet.autoFillDirection[position];
                if (position === ej.Spreadsheet.autoFillDirection.Left)
                    return val <= this.maxValue(digits) ? Array(digits - this.getDigits(val) + 1).join("0") + val.toString() : val.toString();
                else
                    return val < this.minValue(digits) ? val.toString() + Array(digits - this.getDigits(val) + 1).join("0") : val.toString();
            }
            return null;
        },

        maxValue: function (digits) {
            if (this.isNumber(digits))
                return Number(Array(digits + 1).join("9"));
            return null;
        },

        minValue: function (digits) {
            if (this.isNumber(digits))
                return Number("1" + Array(digits).join("0"));
            return null;
        },

        getDigits: function (val) {
            if (this.isNumber(val))
                return val.toString().length;
            return null;
        },

        _round: function round(val, digits) {
            return Number(Math.round(val + 'e' + digits) + 'e-' + digits);
        },

        _parseTime: function (val) {   // will return object as input of new date
            var len, sval, i = 0, j = 3, obj = {}, cval;
            if (this.isTime(val)) {
                val = val.toString();
                sval = val.split(" ");
                len = sval.length;
                while (i < len) {
                    if (this.isTime(sval[i])) {
                        cval = sval[i].split(":");
                        while (j < 6) {
                            obj[this._datePattern[j]] = cval[j - 3] || "0";
                            j++;
                        }
                    }
                    i++;
                }
            }
            return obj;
        },

        _dateToInt: function (date, isTime) {
            var date1 = new Date("01/01/1900"), date2 = this._isDateTime(date) ? date : new Date(date),
                timeDiff = (date2.getTime() - date1.getTime()),
                diffDays = (timeDiff / (1000 * 3600 * 24)) + 2;
            return isTime ? diffDays % 1 : diffDays;
        },

        _defTimeFormat: function (d) {
            var dformat = [d.getHours(),
                    d.getMinutes(),
                    d.getSeconds()].join(":");
            return dformat;
        },

        _isDate: function (text) {
            var regx = /^((0?[1-9]|1[012])[-.](0?[1-9]|[12][0-9]|3[01])[-.](19|20)?[0-9]{2})*$/, value = {};
            if (!ej.isNullOrUndefined(ej.parseDate(text.toString())))
                text = this._dateToInt(text.toString());
            if (regx.test(text.toString())) {
                text = text.toString().replace("-", "/", "g");
                text = this._dateToInt(text.toString());
                value.text = text;
                value.isDate = true;
            }
            else {
                value.text = text;
                value.isDate = false;
            }
            return value;
        },

        _defDateFormat: function (d) {
            var dformat = [(d.getMonth() + 1),
                        d.getDate(),
                        d.getFullYear()].join("/");
            return dformat;
        },

        _isCellReference: function (text) {
            return /^[a-z]{1,3}\d{1,7}$/gi.test(text) ? "relative" : (/^\$[a-z]{1,3}\$\d{1,7}$/gi.test(text) ? "absolute" : (/^((\$[a-z]{1,3})\d{1,7}|[a-z]{1,3}(\$\d{1,7}))$/gi.test(text) ? "mixed" : false));
        },

        _isDateTime: function (date) {
            return Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date.valueOf());
        },

        _decimalCnt: function (val) {
            var strVal, fixVal;
            if (this.isNumber(val)) {
                val = Number(val);
                strVal = val.toString();
                if (strVal.indexOf(this._decimalSeparator) > -1) {
                    fixVal = val.toFixed();
                    return (strVal.length - fixVal.length) - 1;
                }
            }
            return 0;
        },

        _getPosDiff: function (x, y) {
            return x > y ? x - y : y - x;
        }
    };
})(jQuery, Syncfusion);
