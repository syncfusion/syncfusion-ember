"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function ($) {
    var Print = (function (_super) {
        __extends(Print, _super);
        function Print(element, options) {
            _super.call(this);
            this._rootCSS = "e-print";
            this.PluginName = "ejPrint";
            this.id = "null";
            this.defaults = {
                globalStyles: true,
                externalStyles: null,
                excludeSelector: null,
                append: null,
                printInNewWindow: false,
                prepend: null,
                timeOutPeriod: 1000,
                title: null,
                height: 454,
                width: 1024,
                docType: "<!doctype html>",
                beforeStart: null
            };
            if (element) {
                if (!element.jquery) {
                    element = $("#" + element);
                }
                if (element.length) {
                    return $(element).ejPrint(options).data(this.PluginName);
                }
            }
        }
        Print.prototype._init = function () {
            this.id = this.element[0].id;
            this._initialize(this.element, undefined);
        };
        Print.prototype._initialize = function (element, bool) {
            this.styles = $("");
            this.title = $("title");
            if (this.model.globalStyles) {
                this._addglobalStyles(this.model.globalStyles);
            }
            if (this.model.externalStyles) {
                this._addStylesToElement(this.model.externalStyles);
            }
            if (this.model.title) {
                this._addTitleToElement(this.model.title);
            }
            var htmlTag = $("<html/>");
            var headTag = $("<head/>").append(this.title);
            headTag.append(this.styles.clone());
            var bodyTag = $("<body/>");
            var innercontent = $("<div/>");
            if (bool) {
                if (typeof element === "string") {
                    element = $(element);
                    innercontent.append(element.clone());
                }
                else if (typeof element === "object") {
                    for (var i = 0; i < element.length; i++) {
                        innercontent.append($(element[i]).clone());
                    }
                }
            }
            else {
                innercontent.append(element.clone());
            }
            this.copy = innercontent;
            bodyTag.append(this.copy);
            if (this.model.append) {
                bodyTag.append(this._getjQueryObject(this.model.append));
            }
            if (this.model.prepend) {
                bodyTag.prepend(this._getjQueryObject(this.model.prepend));
            }
            this.copy = htmlTag.append(headTag).append(bodyTag);
            if (this.model.excludeSelector != null) {
                this._removeContentFromPrint(this.model.excludeSelector);
            }
            var content = this.copy;
            this.copy.remove();
            if (bool === undefined) {
                this._printContent(content, null, false);
                return true;
            }
            return content;
        };
        Print.prototype._getjQueryObject = function (element) {
            var value = $(element).clone().length === 0 ? $("<div />").html(element) : $(element).clone();
            return value;
        };
        Print.prototype._addglobalStyles = function (element) {
            if (this.model.globalStyles) {
                this.styles = $("style, link, meta, title");
            }
        };
        Print.prototype._addStylesToElement = function (element) {
            if (this.model.externalStyles) {
                var substr = $.isArray(element) ? element : element.split(",");
                for (var i = 0; i < substr.length; i++) {
                    var link = $("<link rel='stylesheet' href='" + substr[i] + "'>");
                    this.styles = $.merge(this.styles, link);
                }
            }
        };
        Print.prototype._addTitleToElement = function (element) {
            if (this.model.title) {
                if (this.title.length === 0) {
                    this.title = $("<title />");
                }
                this.title.text(this.model.title);
            }
        };
        Print.prototype._removeContentFromPrint = function (element) {
            if (this.model.excludeSelector) {
                var substr = $.isArray(element) ? element : element.split(",");
                for (var i = 0; i < substr.length; i++) {
                    this.copy.find(substr[i]).remove();
                }
            }
        };
        Print.prototype._printContent = function (element, printWin, bool) {
            var _this = this;
            var printWindow;
            if (bool) {
                var content = [];
                if (this.element.attr("id") !== undefined) {
                    content.push("#" + this.element.attr("id"));
                }
                else {
                    content.push("." + this.element.attr("class").replace(/ /g, "."));
                }
                if (element !== undefined) {
                    if ($.isArray(element)) {
                        for (var i = 0; i < element.length; i++) {
                            content.push(element[i]);
                        }
                    }
                    else {
                        content.push(element);
                    }
                }
                element = this._initialize(content, true);
            }
            this._trigger("beforeStart", { content: element });
            if (!printWin) {
                if (this.model.printInNewWindow) {
                    printWindow = window.open();
                }
                else {
                    printWindow = window.open(" ", "print", "height=" + this.model.height + ",width=" + this.model.width + ",tabbar=no");
                }
            }
            printWindow.document.write(this.model.docType);
            printWindow.document.write((element[0].outerHTML));
            printWindow.document.close();
            printWindow.focus();
            setTimeout(function () {
                if (!ej.isNullOrUndefined(printWindow.window)) {
                    printWindow.print();
                    setTimeout(function () { printWindow.close(); }, _this.model.timeOutPeriod);
                }
            }, this.model.timeOutPeriod);
        };
        Print.prototype.print = function (element, printWin) {
            this._printContent(element, printWin, true);
        };
        return Print;
    }(ej.WidgetBase));
    window.ej.widget("ejPrint", "ej.Print", new Print());
})(jQuery);
