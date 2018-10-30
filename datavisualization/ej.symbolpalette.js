/**
* @fileOverview Plugin to style the Html SymbolPalette elements
* @copyright Copyright Syncfusion Inc. 2001 - 2013. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {
    "use strict";
    //#region SymbolPalette widget
    ej.widget("ejSymbolPalette", "ej.datavisualization.SymbolPalette", {
        element: null,
        model: null,
        _requiresID: true,
		validTags: ["div"],
        nameTable: {},
        //#region Initialization
        defaults: {
            width: "250px",
            height: "400px",
            labelRenderingMode: "html",
            paletteItemWidth: undefined,
            paletteItemHeight: undefined,
            previewWidth: undefined,
            previewHeight: undefined,
            previewOffset: { x: 110, y: 110 },
            diagramId: "",
            headerHeight: 30,
            selectedPaletteName: "",
            cssClass: "e-datavisualization-symbolpalette",
            showPaletteItemText: true,
            allowDrag: true,
            palettes: [],
            defaultSettings: {
                connector: null,
                node: null
            },
            selectionChange: null,
            create: null,
            destroy: null,
        },
        _oldItem: null,
        _labelHashTable: {},
        dataTypes: {
            paletteItemWidth: "number",
            paletteItemHeight: "number",
            previewWidth: "number",
            previewHeight: "number",
            headerHeight: "number",
            showPaletteItemText: "boolean",
            allowDrag: "boolean",
            palettes: "array",
        },
        _canvas: null,
        _init: function () {
            if (!(ej.browserInfo().name === "msie" && Number(ej.browserInfo().version) < 9)) {
                this.nameTable = {};
                this.selectedItem = null;
                this.activePalette = null;
                this._selectedElement = null;
                this._renderSymbolPalette();
                this._wireEvents();
                this.updateScrollerViewport();
            }
        },
        _setModel: function (options) {
            for (var option in options) {
                switch (option) {
                    case "width":
                        this._setWidth(options[option]);
                        break;
                    case "height":
                        this._setHeight(options[option]);
                        break;
                    case "paletteItemWidth":
                        this.model.paletteItemWidth = options[option];
                        this._redrawContent();
                        break;
                    case "paletteItemHeight":
                        this.model.paletteItemHeight = options[option];
                        this._redrawContent();
                        break;
                    case "headerHeight":
                        this._setHeaderHeight(options[option]);
                        break;
                    case "cssClass":
                        this._setCssClass(options[option]);
                        break;
                    case "showPaletteItemText":
                        this._showItemText(options[option]);
                        break;
                    case "allowDrag":
                        this._setAllowDrag(options[option]);
                        break;
                    case "palettes":
                        this._updatePalettes(options[option]);
                        break;
                    case "selectedPaletteName":
                        var palette = this._getPalette(options.selectedPaletteName);
                        if (palette && palette !== this.activePalette) {
                            $(this._getPaletteHeaderDiv(this.activePalette.name)).removeClass("selected");
                            this.activePalette = palette;
                            $(this._getPaletteHeaderDiv(this.activePalette.name)).addClass("selected");
                        }
                        break;
                }
            }
        },
        _destroy: function () {
            this.element.empty().removeClass(this.model.cssClass);
        },
        //#endregion
        //#region Rendering
        _renderSymbolPalette: function () {
            this._canvas = document.createElement("div");
            this._canvas.setAttribute("class", "e-scanvas");
            this._canvas.setAttribute("id", this.element[0].id + "_canvas");
            this.element[0].setAttribute("style", "height:" + this.model.height + "; width:" + this.model.width + ";");
            this.element.append(this._canvas);
            this.element.ejScroller({ width: this._setViewPortWidth(), height: this._setViewPortHeight(), enableTouchScroll: false });
            this._renderPalettes();
        },
        _updatePalettes: function (option) {
            this.model.palettes = option;
            $("#" + this.element[0].id + "_canvas").empty();
            this._renderPalettes();
            this.updateScrollerViewport();
        },
        _renderPalettes: function () {
            var palettes = this.model.palettes;
            if (palettes) {
                for (var i = 0, len = palettes.length; i < len; i++) {
                    palettes[i] = ej.datavisualization.Diagram.Palette(palettes[i]);
                    this._initPaletteitems(palettes[i]);
                    this._renderPalette(palettes[i]);
                }
            }
        },

        _updatePaletteItemWidth: function (item) {
            var bounds = ej.datavisualization.Diagram.Util.bounds(item);
            if (!item.segments) {
                if (item.width > (this.element.width() - 40)) {
                    item.width = this.element.width() - 40;
                }
                else if (item.paletteItem && item.paletteItem.width && item.paletteItem.width > (this.element.width() - 40)) {
                    item.paletteItem.width = this.element.width() - 40;
                }
            }
            else {
                if (bounds.width > (this.element.width() - 40) && !item.paletteItem) {
                    ej.datavisualization.Diagram.Util.scale(item, (this.element.width() - 45) / bounds.width, 1, bounds.center);
                }
            }
        },
        _renderHtmlLayer: function (canvas, parent) {
            var div = document.createElement("div");
            var attr = { "id": canvas.id + "_htmlLayer", "class": "htmlLayer" };
            ej.datavisualization.Diagram.Util.attr(div, attr);
            var htmlLayer = div;
            div.style.pointerEvents = "none";
            div.style.position = "absolute";
            div.style.left = parent ? parent.style.paddingLeft : "0px";
            div.style.top = parent ? parent.style.paddingTop : "0px";
            canvas.appendChild(htmlLayer);
            return htmlLayer;
        },
        _initPaletteitems: function (options) {
            if (options.items) {
                for (var i = 0; i < options.items.length; i++) {
                    options.items[i] = this._extendPaletteItem (options.items[i])
                }
            }
        },
        _initGroupNode: function (group) {
            var child = null;
            var nodeDefault = this.model.defaultSettings && this.model.defaultSettings.node ? this.model.defaultSettings.node : null;
            var connectorDefault = this.model.defaultSettings && this.model.defaultSettings.connector ? this.model.defaultSettings.connector : null;
            for (var i = 0; i < group.children.length; i++) {
                child = group.children[i];
                if (typeof (child) == "object") {
                    if (child._type == "group") {
                        child = ej.datavisualization.Diagram.Group($.extend(true, {}, nodeDefault, child));
                        child = ej.datavisualization.Diagram.Util._updateBpmnChild(child, this)
                        this._initGroupNode(child);
                    }
                    else if (child.segments)
                        child = ej.datavisualization.Diagram.Connector($.extend(true, {}, connectorDefault, child));
                    else
                        child = ej.datavisualization.Diagram.Node($.extend(true, {}, nodeDefault, child));
                    child = ej.datavisualization.Diagram.NodeType(child, this);
                    child.parent = group.name;
                    group.children[i] = child.name;
                    this.nameTable[child.name] = child;
                }
            }
        },
        _setViewPortWidth: function () {
            this.element[0].setAttribute("style", "width:" + this.model.width + ";");
            var w = this.element.width();
            // var left = this.element[0].offsetLeft;
            return Math.abs(w);
        },
        _setViewPortHeight: function () {
            this.element[0].setAttribute("style", "height:" + this.model.height + ";");
            var h = this.element.height();
            //var top = this.element[0].offsetTop;
            return Math.abs(h);
        },
        _renderPalette: function (palette) {
            this._renderHeader(palette);
            this._updateHeaderWrapper(palette, this.model.headerHeight);
            this._renderContent(palette);
            this._collapse(palette);
            this._updatePaletteVisibility(palette);
        },
        _renderHeader: function (palette) {
            var header = document.createElement("div");
            var attr = { "id": palette.name.replace(/\s/gi, "_") + "_header", "class": "e-header", "style": "height:" + this.model.headerHeight + "px;" };
            if (!(palette.constraints & this._canHeaderVisible(palette))) {
                attr.style += "display:none";
            }
            ej.datavisualization.Diagram.Util.attr(header, attr);
            this._renderHeaderArrow(header, palette.expanded, palette.name, this._canExpand(palette));
            if (palette.templateId && $.templates)
                this._renderHeaderTemplate(header, palette);
            else
                this._renderHeaderText(header, palette.name);
            this._addExpandedClass(header, palette.expanded);
            this._disableClickClass(header, this._canExpand(palette));
            if (this.model.selectedPaletteName === palette.name) {
                $(header).addClass("selected");
                this.activePalette = palette;
            }
            this._canvas.appendChild(header);
        },
        _renderHeaderText: function (header, text) {
            var span = document.createElement("span");
            span.setAttribute("class", "e-header-text");
            span.innerHTML = text;
            header.appendChild(span);
        },
        _renderHeaderTemplate: function (header, palette) {
            var html = this._renderEjTemplate("#" + palette.templateId, palette);
            var wrapper = document.createElement("div");
            var attr = {
                "id": palette.name + "_Wrapper",
                "class": "e-header-wrapper"
            };
            ej.datavisualization.Diagram.Util.attr(wrapper, attr);
            this._renderTemplateContent(palette, wrapper, html);
            header.appendChild(wrapper);
        },
        _renderTemplateContent: function (palette, wrapper, html) {
            var div = document.createElement('div');
            div.innerHTML = html;
            div.style.display = "inline-block";
            document.body.appendChild(div);
            var content = div.cloneNode(true);
            content.id = palette.name + "_templateHeader";
            var width = div.offsetWidth, height = div.offsetHeight;
            var scaleX = $("#" + this._id).width() - 18 / width;
            var scaleY = this.model.headerHeight / height;
            var scale = Math.min(scaleX, scaleY);
            var left = (scale - 1) * width / 2;
            ej.datavisualization.Diagram.Util.attr(content, { style: "position: relative; left: " + left + "px; transform: scale(" + scale + ")" });
            wrapper.appendChild(content);
            div.parentNode.removeChild(div);
        },
        _renderHeaderArrow: function (header, expanded, index, enableClick) {
            if (enableClick) {
                var arrow = header.getElementsByClassName("e-header-arrow e-icon")[0];
                if (!arrow) {
                    arrow = document.createElement("span");
                    arrow.setAttribute("class", "e-header-arrow e-icon");
                    arrow.setAttribute("style", "top:" + (this.model.headerHeight - 16) / 2 + "px;");
                    this._addExpandedClass(arrow, expanded);
                    if (this.model.selectedPaletteName === name)
                        $(arrow).addClass("selected");
                    header.appendChild(arrow);
                }
            }
            else {
                var icon = header.getElementsByClassName("e-header-arrow e-icon")[0];
                if (icon) {
                    icon.parentNode.removeChild(icon);
                }
            }
        },
        _renderContent: function (palette) {
            var content = this._getPaletteContentDiv(palette.name);
            if (!content) {
                content = document.createElement("div");
                this._canvas.appendChild(content);
            }
            content.setAttribute("id", palette.name.replace(/\s/gi, "_") + "_content");
            content.setAttribute("class", "e-scontent");
            if ((this.model.palettes.length - 1) === this.model.palettes.indexOf(palette))
                content.setAttribute("style", "border-bottom-width: 0px;");

            var paletteItems = palette.items;
            if (paletteItems && paletteItems.length > 0) {
                for (var i = 0, len = paletteItems.length; i < len; i++) {
                    if (paletteItems[i].parent)
                        this.nameTable[paletteItems[i].name] = paletteItems[i];
                    else {
                        this._renderItem(paletteItems[i], content);
                        this.nameTable[paletteItems[i].name] = paletteItems[i];
                    }
                }
            }
        },

        _getPaletteContentDiv: function (name) {
            var content = $(this.element).find("#" + name.replace(/\s/gi, "_") + "_content")[0];
            return content;
        },

        _getPaletteHeaderDiv: function (name) {
            var content = $(this.element).find("#" + name.replace(/\s/gi, "_") + "_header")[0];
            return content;
        },

        _updateRenderSize: function (paletteItem, preSize, nameTable) {
            if (!paletteItem.paletteItem || (paletteItem.type === "group" && !paletteItem.isLane) || (paletteItem._type === "group" && paletteItem.type === "bpmn")) {
                if (!paletteItem.segments) {
                    if (paletteItem._type == "group") {
                        if (this._checkItemUpdate(paletteItem)) {
                            var deltaWidth = preSize.width / paletteItem.width;
                            var deltaHeight = preSize.height / paletteItem.height;
                            this.scale(paletteItem, deltaWidth, deltaHeight, paletteItem.pivot, nameTable, null, null, null, this);
                            ej.datavisualization.Diagram.Util._translate(paletteItem, preSize.width / 2 - paletteItem.offsetX, preSize.height / 2 - paletteItem.offsetY, nameTable, null, this);
                        }
                        else {
                            ej.datavisualization.Diagram.Util._translate(paletteItem, paletteItem.width / 2 - paletteItem.offsetX, paletteItem.height / 2 - paletteItem.offsetY, nameTable, null, this);
                        }
                    }
                    else {
                        paletteItem.width = preSize.width;
                        paletteItem.height = preSize.height;
                        paletteItem.offsetX = preSize.width / 2;
                        paletteItem.offsetY = preSize.height / 2;
                    }
                }
                else {
                    var bounds = ej.datavisualization.Diagram.Util.bounds(paletteItem);
                    ej.datavisualization.Diagram.Util._translate(paletteItem, preSize.width / 2 - bounds.center.x, preSize.height / 2 - bounds.center.y, this.nameTable);
                }
            }
            else if (paletteItem.segments && paletteItem.paletteItem && paletteItem.paletteItem.enableScale && !paletteItem.isPhase) {
                var bounds = ej.datavisualization.Diagram.Util.bounds(paletteItem);
                var dx = (paletteItem.paletteItem.width ? paletteItem.paletteItem.width : this.model.paletteItemWidth) / bounds.width;
                var dy = (paletteItem.paletteItem.height ? paletteItem.paletteItem.height : this.model.paletteItemHeight) / bounds.height;
                ej.datavisualization.Diagram.Util.scale(paletteItem, dx, dy, { x: .5, y: .5 });
                this._updatePaletteItemWidth(paletteItem);
            }
            else if ((paletteItem.segments && paletteItem.paletteItem && paletteItem.paletteItem.enableScale && !paletteItem.isPhase) || (paletteItem.isPhase && paletteItem.paletteItem.width != paletteItem.paletteItem.height)) {
                var bounds = ej.datavisualization.Diagram.Util.bounds(paletteItem);
                var dx = (paletteItem.paletteItem.width ? paletteItem.paletteItem.width : this.model.paletteItemWidth) / bounds.width;
                var dy = (paletteItem.paletteItem.height ? paletteItem.paletteItem.height : this.model.paletteItemHeight) / bounds.height;
                ej.datavisualization.Diagram.Util.scale(paletteItem, dx, dy, { x: .5, y: .5 });
                this._updatePaletteItemWidth(paletteItem);
            }
            else if (paletteItem._type == "node" && this._checkItemUpdate(paletteItem)) {
                paletteItem.width = preSize.width;
                paletteItem.height = preSize.height;
                paletteItem.offsetX = preSize.width / 2;
                paletteItem.offsetY = preSize.height / 2;
            }
        },
        _checkItemUpdate: function (paletteItem) {
            if (!(paletteItem.paletteItem && paletteItem.paletteItem.enableScale))
                return true;
            return false;
        },
        _updatePreviewSize: function (paletteItem, preSize) {
            if (!paletteItem.paletteItem || (paletteItem.type === "group" && !paletteItem.isLane)) {
                if (!paletteItem.segments) {
                    if (paletteItem.container && !paletteItem.isLane) {
                        var deltaWidth = preSize.width / paletteItem.width;
                        var deltaHeight = preSize.height / paletteItem.height;
                        this.scale(paletteItem, deltaWidth, deltaHeight, paletteItem.pivot, this.nameTable, null, null, null, this);
                        ej.datavisualization.Diagram.Util._translate(paletteItem, preSize.width / 2 - paletteItem.offsetX, preSize.height / 2 - paletteItem.offsetY, this.nameTable, null, this);
                    }
                    else {
                        paletteItem.width = preSize.width;
                        paletteItem.height = preSize.height;
                        paletteItem.offsetX = preSize.width / 2;
                        paletteItem.offsetY = preSize.height / 2;
                    }
                }
                else {
                    var bounds = ej.datavisualization.Diagram.Util.bounds(paletteItem);
                    ej.datavisualization.Diagram.Util._translate(paletteItem, preSize.width / 2 - bounds.center.x, preSize.height / 2 - bounds.center.y, this.nameTable);
                }
            }
            else if (paletteItem.segments && paletteItem.paletteItem && paletteItem.paletteItem.enableScale && !paletteItem.isPhase) {
                var bounds = ej.datavisualization.Diagram.Util.bounds(paletteItem);
                var dx = (paletteItem.paletteItem.previewWidth ? paletteItem.paletteItem.previewWidth : this.model.previewWidth) / bounds.width;
                var dy = (paletteItem.paletteItem.previewHeight ? paletteItem.paletteItem.previewHeight : this.model.previewHeight) / bounds.height;
                ej.datavisualization.Diagram.Util.scale(paletteItem, dx, dy, { x: .5, y: .5 });
                this._updatePaletteItemWidth(paletteItem);
            }
            else if ((paletteItem.segments && paletteItem.paletteItem && paletteItem.paletteItem.enableScale && !paletteItem.isPhase) || (paletteItem.isPhase && paletteItem.paletteItem.previewWidth != paletteItem.paletteItem.previewHeight)) {
                var bounds = ej.datavisualization.Diagram.Util.bounds(paletteItem);
                var dx = (paletteItem.paletteItem.previewWidth ? paletteItem.paletteItem.previewWidth : this.model.previewWidth) / bounds.width;
                var dy = (paletteItem.paletteItem.previewHeight ? paletteItem.paletteItem.previewHeight : this.model.previewHeight) / bounds.height;
                ej.datavisualization.Diagram.Util.scale(paletteItem, dx, dy, { x: .5, y: .5 });
                this._updatePaletteItemWidth(paletteItem);
            }
            else if (paletteItem._type == "node" || paletteItem._type == "group") {
                paletteItem.width = preSize.width;
                paletteItem.height = preSize.height;
                paletteItem.offsetX = preSize.width / 2;
                paletteItem.offsetY = preSize.height / 2;
            }
        },
        _getRenderItemSize: function (paletteItem) {
            var width = this.model.paletteItemWidth, height = this.model.paletteItemHeight;
            if (!paletteItem.segments) {
                if (paletteItem.type === "group") {
                    bounds = ej.datavisualization.Diagram.Util._getChildrenBounds(paletteItem, this);
                    if (paletteItem.paletteItem && (!paletteItem.isLane)) {
                        width = paletteItem.paletteItem.width ? paletteItem.paletteItem.width : width;
                        height = paletteItem.paletteItem.height ? paletteItem.paletteItem.height : height;
                        width = width ? width : bounds.width;
                        height = height ? height : bounds.height;
                        paletteItem.paletteItem.width = width;
                        paletteItem.paletteItem.height = height;
                    }
                    else if (paletteItem.paletteItem && paletteItem.isLane) {
                        if (!paletteItem.paletteItem.enableScale) {
                            var dx = (paletteItem.paletteItem.width ? paletteItem.paletteItem.width : this.model.paletteItemWidth) / paletteItem.width;
                            var dy = (paletteItem.paletteItem.height ? paletteItem.paletteItem.height : this.model.paletteItemHeight) / paletteItem.height;
                            ej.datavisualization.Diagram.Util.scale(paletteItem, dx, dy, { x: .5, y: .5 }, this.nameTable, false, false, false, this);
                            var x = 0.0001, y = 0.001;
                            if (paletteItem.isLane && paletteItem.paletteItem && !paletteItem.paletteItem.enableScale) {
                                if (paletteItem.orientation === "horizontal") x -= 2.2;
                                else x += .8; y -= 1;
                            }
                            ej.datavisualization.Diagram.Util._translate(paletteItem, x, y, this.nameTable, false, this);
                            width = paletteItem.width ? paletteItem.width : width;
                            height = paletteItem.height ? paletteItem.height : height;
                        }
                        else {
                            width = paletteItem.paletteItem.width ? paletteItem.paletteItem.width : width;
                            height = paletteItem.paletteItem.height ? paletteItem.paletteItem.height : height;
                            width = width ? width : bounds.width;
                            height = height ? height : bounds.height;
                            paletteItem.paletteItem.width = width;
                            paletteItem.paletteItem.height = height;
                        }
                    }
                    else {
                        width = width ? width : bounds.width;
                        height = height ? height : bounds.height;
                    }
                }
                else {
                    if (paletteItem.paletteItem) {
                        width = paletteItem.paletteItem.width ? paletteItem.paletteItem.width : width;
                        height = paletteItem.paletteItem.height ? paletteItem.paletteItem.height : height;
                        width = width ? width : paletteItem.width;
                        height = height ? height : paletteItem.height;
                        paletteItem.paletteItem.width = width;
                        paletteItem.paletteItem.height = height;
                    }
                    else {
                        var bounds = ej.datavisualization.Diagram.Util.bounds(paletteItem);
                        width = bounds.width ? bounds.width : width;
                        height = bounds.height ? bounds.height : height;
                    }
                }
            }
            else {
                var dec, size, bounds;
                bounds = ej.datavisualization.Diagram.Util.bounds(paletteItem);
                if (paletteItem.paletteItem) {
                    width = paletteItem.paletteItem.width ? paletteItem.paletteItem.width : width;
                    height = paletteItem.paletteItem.height ? paletteItem.paletteItem.height : height;
                    width = width ? width : paletteItem.width;
                    height = height ? height : paletteItem.height;
                    paletteItem.paletteItem.width = width;
                    paletteItem.paletteItem.height = height;
                }
                else {
                    var bounds = ej.datavisualization.Diagram.Util.bounds(paletteItem);
                    width = width ? width : bounds.width;
                    height = height ? height : bounds.height;
                }
            }
            return { width: width, height: height };
        },
        _renderPetternDefinition: function (id, svg) {
            if (id && svg) {
                var defs = svg.document.getElementById(id + "patterndefinition")
                if (!defs) {
                    defs = svg.defs({ "id": id + "patterndefinition" });
                    svg.appendChild(defs);
                }
            }
        },
        _cloneFromChildTable: function (paletteItem, nameTable) {
            var child;
            for (var i = 0; paletteItem.children && i < paletteItem.children.length; i++) {
                child = $.extend(true, {}, this.nameTable[paletteItem.children[i]])
                if (child) {
                    nameTable[paletteItem.children[i]] = child;
                    if (child.children && child.children.length > 0) {
                        this._cloneFromChildTable(child, nameTable);
                    }
                }
            }
            return nameTable;
        },
        _renderItem: function (paletteItem, content) {

            var item = $.extend(true, {}, paletteItem);
            var itemSize = this._getRenderItemSize(item);
            var nameTable = this._cloneFromChildTable(paletteItem, {});
            this._updateRenderSize(item, itemSize, nameTable);
            var svg = this._renderItemContainer(item.name, content, null, itemSize, item);
            if (item.segments) {
                this._renderConnector(item, svg, itemSize);
            }
            else if (item._type == "node" && !(item.children && item.children.length > 0))
                this._renderNode(item, svg, itemSize);
            else
                this._renderGroup(item, svg, itemSize, nameTable);
            if (item.isLane && item.paletteItem && !item.paletteItem.enableScale) {
                if (item.orientation === "vertical") {
                    svg.document.setAttribute("height", itemSize.height + 2);
                }
            }
            return item;
        },
        _getPreviewItemSize: function (paletteItem) {
            var width = this.model.previewWidth, height = this.model.previewHeight;
            if (!paletteItem.segments) {
                if (paletteItem.type === "group") {
                    bounds = ej.datavisualization.Diagram.Util._getChildrenBounds(paletteItem, this);
                    if (paletteItem.paletteItem && (!paletteItem.isLane)) {
                        width = paletteItem.paletteItem.previewWidth ? paletteItem.paletteItem.previewWidth : width;
                        height = paletteItem.paletteItem.previewHeight ? paletteItem.paletteItem.previewHeight : height;
                        width = width ? width : bounds.width;
                        height = height ? height : bounds.height;
                        paletteItem.paletteItem.previewWidth = width;
                        paletteItem.paletteItem.previewHeight = height;
                    }
                    else if (paletteItem.paletteItem && paletteItem.isLane) {
                        if (!paletteItem.paletteItem.enableScale) {
                            width = paletteItem.paletteItem.previewWidth ? paletteItem.paletteItem.previewWidth : width;
                            height = paletteItem.paletteItem.previewHeight ? paletteItem.paletteItem.previewHeight : height;
                        }
                        else {
                            width = paletteItem.paletteItem.previewWidth ? paletteItem.paletteItem.previewWidth : width;
                            height = paletteItem.paletteItem.previewHeight ? paletteItem.paletteItem.previewHeight : height;
                            width = width ? width : bounds.width;
                            height = height ? height : bounds.height;
                            paletteItem.paletteItem.previewWidth = width;
                            paletteItem.paletteItem.previewHeight = height;
                        }
                    }
                    else {
                        width = width ? width : bounds.width;
                        height = height ? height : bounds.height;
                    }
                }
                else {
                    if (paletteItem.paletteItem) {
                        width = paletteItem.paletteItem.previewWidth ? paletteItem.paletteItem.previewWidth : width;
                        height = paletteItem.paletteItem.previewHeight ? paletteItem.paletteItem.previewHeight : height;
                        width = width ? width : paletteItem.width;
                        height = height ? height : paletteItem.height;
                        paletteItem.paletteItem.previewWidth = width;
                        paletteItem.paletteItem.previewHeight = height;
                    }
                    else {
                        var bounds = ej.datavisualization.Diagram.Util.bounds(paletteItem);
                        width = bounds.width ? bounds.width : width;
                        height = bounds.height ? bounds.height : height;
                    }
                }
            }
            else {
                var dec, size, bounds;
                bounds = ej.datavisualization.Diagram.Util.bounds(paletteItem);
                if (paletteItem.paletteItem) {
                    width = paletteItem.paletteItem.previewWidth ? paletteItem.paletteItem.previewWidth : width;
                    height = paletteItem.paletteItem.previewHeight ? paletteItem.paletteItem.previewHeight : height;
                    width = width ? width : paletteItem.width;
                    height = height ? height : paletteItem.height;
                    width = width ? width : bounds.width;
                    height = height ? height : bounds.height;
                    paletteItem.paletteItem.previewWidth = width;
                    paletteItem.paletteItem.previewHeight = height;
                }
                else {
                    var bounds = ej.datavisualization.Diagram.Util.bounds(paletteItem);
                    width = width ? width : bounds.width;
                    height = height ? height : bounds.height;
                }
            }
            return { width: width, height: height };
        },
        _renderItemContainer: function (id, content, isDrag, itemSize, item) {
            var container = document.createElement("div");
            var height = this.model.showPaletteItemText ? itemSize.height + 18 : itemSize.height;
            var width = itemSize.width;
            var mLeft = (item && item.paletteItem) ? item.paletteItem.margin.left : 4;
            var mTop = (item && item.paletteItem) ? item.paletteItem.margin.top : 4;
            var mRight = (item && item.paletteItem) ? item.paletteItem.margin.right : 4;
            var mBottom = (item && item.paletteItem) ? item.paletteItem.margin.bottom : 4;
            var attr = {
                "id": id + "_paletteItem", "draggable": "true", "height": height + "px", "width": width + "px", "class": "e-paletteItem",
                "style": "padding-left:" + mLeft + "px;padding-right:" + (mRight + 2) + "px;padding-top:" + (mTop + 1) + "px;padding-bottom:" + (mBottom + 1) + "px;height:" + (height + 1) + "px;width:" + (width + 1) +
                          "px;-ms-touch-action: none;touch-action: none;"
            };
            ej.datavisualization.Diagram.Util.attr(container, attr);
            content.appendChild(container);
            if (this.model.allowDrag)
                this._setItemDraggable(container);
            return this._renderAnchor(container, id, itemSize, item);
        },
        _renderAnchor: function (container, id, itemSize, item) {
            var anchor = document.createElement("div");
            var attr = {
                "id": id + "_anchor", "height": itemSize.height + "px", "class": "e-anchor"
            };
            ej.datavisualization.Diagram.Util.attr(anchor, attr);
            container.appendChild(anchor);
            var svg = this._renderSvg(anchor, id, itemSize);
            this._renderText(anchor, id, itemSize, item);
            return svg;
        },
        _renderSvg: function (anchor, id, itemSize) {
            var parent;
            var wrapper = document.createElement("div");
            var attr = {
                "id": id + "_svgWrapper", "width": this.model.paletteItemWidth + "px;",
                "height": +this.model.paletteItemHeight + "px;", "class": "e-svg-container",
                "style": "width:" + itemSize.width + "px;height:" + itemSize.height + "px;"
            };
            ej.datavisualization.Diagram.Util.attr(wrapper, attr);
            attr = {
                "id": id + "_svg", "width": itemSize.width, "height": itemSize.height,
                "version": "1.1", "xlink": "http://www.w3.org/1999/xlink"
            };
            var svg = new ej.datavisualization.Diagram.Svg(attr);
            wrapper.appendChild(svg.document);
            if (anchor.id.split("_clone").length > 1)
                parent = $(anchor).parents(".e-paletteItem")[0];
            this._renderHtmlLayer(wrapper, parent);
            anchor.appendChild(wrapper);
            return svg;
        },
        _renderText: function (anchor, text, itemSize, item) {
            var div = document.createElement("div");
            div.setAttribute("class", "e-text-container");
            div.setAttribute("style", "width:" + itemSize.width + "px; text-align : center;overflow: hidden;text-overflow: ellipsis;font-size: 12px;");
            var span = document.createElement("span");
            span.setAttribute("class", "e-paletteItemText");
            if (item && item.paletteItem)
                text = item.paletteItem.label ? item.paletteItem.label : text;
            if (text.split("_clone").length > 1)
                span.innerHTML = text.split("_clone")[0];
            else
                span.innerHTML = text;
            if (item && item.paletteItem.wrapping == ej.datavisualization.Diagram.TextWrapping.NoWrap) {
                span.style.whiteSpace = "nowrap";
                span.style.wordWrap = "normal";
            }
            if (item && item.paletteItem.wrapping == ej.datavisualization.Diagram.TextWrapping.Wrap) {
                span.style.whiteSpace = "pre-wrap";
                span.style.wordBreak = "break-all";
                span.style.wordWrap = "break-word";
            }
            if (item && item.paletteItem.wrapping == ej.datavisualization.Diagram.TextWrapping.WrapWithOverflow) {
                span.style.whiteSpace = "pre-wrap";
                span.style.wordWrap = "break-word";
            }
            div.appendChild(span);
            if (!this.model.showPaletteItemText)
                div.style.display = "none";
            anchor.appendChild(div);
            if (item && !item.paletteItem.enableScale) {
                var element = document.getElementById(item.name + "_paletteItem");
                var bounds = document.getElementById(item.name + "_anchor").lastChild.getBoundingClientRect();
                element.style.height = itemSize.height + bounds.height + "px";
            }
        },
        _renderNode: function (node, svg, scaleSize, palette) {
            this._renderPetternDefinition(svg.id + "_" + node.name, svg);
            var group = ej.datavisualization.Diagram.SvgContext.renderNode(node, svg, null, true, this);
            var isDrag = false;
            if (svg.document.getAttribute("drag") != null) {
                isDrag = true;
            }
            this._transformItem(group, node.width, node.height, node, isDrag, scaleSize);
        },
        _updateChildBounds: function (node, nameTable) {
            var child = null;
            if (node._type == "group") {
                var children = this._getChildren(node.children);
                for (var i = 0; i < children.length; i++) {
                    child = nameTable[children[i]];
                    if (child.shape == "group")
                        this._updateChildBounds(child, nameTable);
                }
                ej.datavisualization.Diagram.Util._updateChildBounds(node, this);
            }
        },
        _getChild: function (child) {
            return ej.datavisualization.Diagram.Util.getChild(child);
        },
        _getChildren: function (children) {
            if (children) {
                var children1 = [];
                for (var i = 0; i < children.length; i++) {
                    var child = children[i];
                    if (child) {
                        if (typeof (child) == "object") {
                            children1.push(child.name);
                        }
                        else if (typeof (child) == "string") {
                            children1.push(child);
                        }
                    }
                }
                return children1;
            }
        },
        _renderGroup: function (node, svg, itemSize, nameTable) {
            this._renderPetternDefinition(svg.id + "_" + node.name, svg);
            if (!nameTable) nameTable = this.nameTable;
            if (!node.container || node.isLane) this._updateChildBounds(node, nameTable);
            var group = ej.datavisualization.Diagram.SvgContext.renderGroup(node, svg, null, nameTable, this, false, true);
            var isDrag = false;
            if (svg.document.getAttribute("drag") != null) {
                isDrag = true;
            }
            this._transformItem(group, node.width, node.height, node, isDrag, itemSize);

        },
        _renderConnector: function (connector, svg, itemSize) {
            var group = ej.datavisualization.Diagram.SvgContext.renderConnector(connector, svg, null, this);
            var bounds = ej.datavisualization.Diagram.Util.bounds(connector);
            var isDrag = false;
            if (svg.document.getAttribute("drag") != null) {
                isDrag = true;
            }
            this._transformItem(group, bounds.width, bounds.height, connector, isDrag, itemSize);
        },
        //#endregion
        //#region Events
        _wireEvents: function () {
            this._on(this.element, ej.eventType.click, ".e-header", this._headerClick);
            this._on(this.element, ej.eventType.mouseDown, ".e-header", this._headerMouseDown);
            this._on(this.element, "mouseover", ".e-header", this._headerMouseOver);
            this._on(this.element, "mouseout", ".e-header", this._headerMouseOut);
            this._on(this.element, ej.eventType.mouseDown, ".e-paletteItem", this._itemMouseDown);
            this._on(this.element, "mouseover", ".e-paletteItem", this._itemMouseOver);
            this._on(this.element, "mouseout", ".e-paletteItem", this._itemMouseOut);
            this._on(this.element, ej.eventType.click, ".e-anchor", this._itemClick);
        },
        _headerClick: function (evt) {
            this._expandOrCollapsePalette("", evt.currentTarget);
            var palette = this._getActivePalette(evt.currentTarget.id);
            if (palette && palette !== this.activePalette)
                this.activePalette = palette;
        },
        _headerMouseDown: function (evt) {
            evt.preventDefault();
            evt.stopPropagation();
        },
        _headerMouseOver: function (evt) {
            var palette = this._getActivePalette(evt.currentTarget.id);
            if (palette && this._canExpand(palette)) {
                $(evt.currentTarget).addClass("hover");
                $(evt.currentTarget).find(".e-header-arrow").addClass("hover");
            }
        },
        _headerMouseOut: function (evt) {
            $(evt.currentTarget).removeClass("hover");
            $(evt.currentTarget).find(".e-header-arrow").removeClass("hover");
        },
        _itemMouseDown: function (evt) {
            if (this.model.diagramId) {
                var diagram = $("#" + this.model.diagramId).ejDiagram("instance");
                if (diagram.activeTool instanceof ej.datavisualization.Diagram.LineTool) {
                    diagram.activeTool._showAllPorts(true);
                    diagram.deactivateTool();
                }
            }
            if (!this.model.allowDrag) {
                evt.preventDefault();
                evt.stopPropagation();
            }
            if (this._selectedElement) {
                if (this._selectedElement !== evt.currentTarget) {
                    $(this._selectedElement).removeClass("selected");
                    this._selectedElement = evt.currentTarget;
                }
            }
            else
                this._selectedElement = evt.currentTarget;
            if (!($(evt.currentTarget).hasClass("selected")))
                $(evt.currentTarget).addClass("selected");

            var palette = this._getActivePalette(evt.currentTarget.parentElement.id);
            if (palette && palette !== this.activePalette) {
                this._clearHeaderSelection();
                this._updateHeaderSelection($(evt.currentTarget.parentElement).prev());
                this.activePalette = palette;
            }

            if (this.activePalette && this._selectedElement) {
                var name = this._selectedElement.id.slice(0, this._selectedElement.id.lastIndexOf('_'));
                var items = this.activePalette.items;
                for (var i = 0, len = items.length; i < len; i++) {
                    var item = items[i];
                    if (item.name === name)
                        this.selectedItem = item;
                }
            }
        },
        _itemMouseOver: function (evt) {
            $(evt.currentTarget).addClass("hover");
        },
        _itemMouseOut: function (evt) {
            $(evt.currentTarget).removeClass("hover");
        },
        _itemDraStart: function (evt) {
            var dataTransfer = evt.originalEvent.dataTransfer;
            dataTransfer.setData("Text", this.element[0].id);
            dataTransfer.effectAllowed = "copy";
        },
        _itemClick: function (evt) {
            if (evt.type === "click" || (evt.type === "touchend" && !$(".dragClone")[0])) {
                if (this.model.diagramId) {
                    var diagram = $("#" + this.model.diagramId).ejDiagram("instance");
                    var item = $.extend(true, {}, this.selectedItem);
                    item.name += ej.datavisualization.Diagram.Util.randomId();
                    if (item.type == "bpmn") item.children = [];
                    var type = diagram.getObjectType(item);
                    var swimlane;
                    if (type == "group") {
                        var children = this._getChildren(item.children);
                        for (var j = 0; j < children.length; j++) {
                            var newObj = $.extend(true, {}, this.nameTable[children[j]]);
                            newObj.parent = item.name;
                            newObj.name = item.name + newObj.name;
                            item.children[j] = newObj.name;
                            diagram.nameTable[newObj.name] = newObj;
                            diagram.nodes().push(newObj);
                            diagram._nodes = $.extend(true, [], diagram.nodes());
                            if (diagram.nameTable[newObj])
                                diagram._updateQuad(diagram.nameTable[newObj]);
                        }
                        if (!item.isLane) {
                            item.height = item.width = 0;
                            diagram._updateChildBounds(item, diagram.nameTable);
                        }
                    }
                    if (item) {
                        if (item.isLane) {
                            var randomId = ej.datavisualization.Diagram.Util.randomId();
                            diagram._cloneGroupNode(item, randomId);
                            var obj = ej.datavisualization.Diagram.SwimLaneHelper._createDiagramLane(item, diagram.nameTable);
                            obj.isLane = item.isLane;
                            obj.orientation = item.orientation;
                            obj.height = 120;
                            obj = ej.datavisualization.Diagram.Lane(obj);
                            var swimlane = ej.datavisualization.Diagram.SwimLaneHelper._createSwimlane(obj, diagram, null, true);
                            if (swimlane) {
                                swimlane.offsetX += 10;
                                swimlane.offsetY += 40;
                            }
                        }
                    }
                    var oldElement = $.extend(true, {}, this._oldItem);
                    var newElement = swimlane ? swimlane : item;
                    this._oldItem = $.extend(true, {}, newElement);
                    var args = { oldElement: oldElement, newElement: newElement };
                    this._trigger("selectionChange", args);
                }
            }
        },
        _updatePaletteVisibility: function (palette) {
            if (this._canHeaderVisible(palette)) {
                if (this._canPaletteVisible(palette)) {
                    this._getPaletteHeaderDiv(palette.name).style.display = "";
                    this._getPaletteContentDiv(palette.name).style.display = "";
                }
                else {
                    this._getPaletteHeaderDiv(palette.name).style.display = "none"
                    this._getPaletteContentDiv(palette.name).style.display = "none"
                }
            }
        },
        _collectionChanged: function (args) {
            if (args.changeType == "insert") {
                this._renderPalette(args.element);
            }
            else if (args.changeType == "remove") {
                var palette = args.element;
                if (palette != null) {
                    var paletteHeader = this._getPaletteHeaderDiv(palette.name);
                    if (paletteHeader)
                        paletteHeader.parentNode.removeChild(paletteHeader);
                    var paletteContent = this._getPaletteContentDiv(palette.name);
                    if (paletteContent)
                        paletteContent.parentNode.removeChild(paletteContent);
                }
            }
        },
        //#endregion
        //#region Public methods
        _extendPaletteItem : function (item) {
            var nodeDefault = (this.model.defaultSettings && this.model.defaultSettings.node) ? this.model.defaultSettings.node : null;
            var connectorDefault = (this.model.defaultSettings && this.model.defaultSettings.connector) ? this.model.defaultSettings.connector : null;
            if (item.shape && typeof item.shape == "object")
                ej.datavisualization.Diagram.Util._updateShapeProperties(item);
            else item = ej.datavisualization.Diagram.NodeType(item, this);
            if (item.type == "connector")
                item = ej.datavisualization.Diagram.Connector($.extend(true, {}, connectorDefault, item));
            else {
                if (item.isLane)
                    item = ej.datavisualization.Diagram.SwimLaneHelper._createPaletteLane(item, this.nameTable);
                else if (item.type == "phase")
                    item = ej.datavisualization.Diagram.Util._mapPalettePhase(item);
                else if (item.container)
                    item = ej.datavisualization.Diagram.ContainerHelper._initContainer(this, item);
                else if (item._type === "group" || (item.children && item.children.length > 0)) {
                    item = ej.datavisualization.Diagram.Group($.extend(true, {}, nodeDefault, item));
                    item = ej.datavisualization.Diagram.Util._updateBpmnChild(item, this);
                    this._getNewGroup(item);
                    this._initGroupNode(item, this);
                    ej.datavisualization.Diagram.Util._updateGroupBounds(item, this);
                }
                else
                    item = ej.datavisualization.Diagram.Node($.extend(true, {}, nodeDefault, item));
            }
            return item;
        },
        addPaletteItem: function (paletteName, items) {
            var content, palette;
            for (var i = 0; i < this.model.palettes.length; i++) {
                var items1 = [];
                if (!items.length)
                    items1.push(items);
                else
                    items1 = items;
                for (var j = 0; j < items1.length; j++) {
                    palette = this.model.palettes[i];
                    if (palette.name === paletteName) {
                        var node = this._extendPaletteItem (items1[j])
                        palette.items.push(node);
                        content = this._getPaletteContentDiv(paletteName);
                        this.nameTable[node.name] = node;
                        this._renderItem(node, content);
                    }
                }
            }
        },
        removePaletteItem: function (paletteName, items) {
            var content, palette;
            for (var i = 0; i < this.model.palettes.length; i++) {
                var items1 = [];
                if (!items.length)
                    items1.push(items);
                else
                    items1 = items;
                for (var j = 0; j < items1.length; j++) {
                    palette = this.model.palettes[i];
                    if (palette.name === paletteName) {
                        var item = items1[j];
                        ej.datavisualization.Diagram.Util.removeItem(palette.items, item);
                        delete this.nameTable[item.name];
                        if (item.children && item.children.length) {
                            for (var k = 0; k < item.children.length; k++) {
                                var child = item.children[k];
                                if (child) {
                                    if (typeof (child) == "object") {
                                        delete this.nameTable[child.name];
                                    } else {
                                        delete this.nameTable[child];
                                    }
                                }
                            }
                        }
                        content = this._getPaletteContentDiv(paletteName);
                        var node = $(content).find("#" + item.name + "_paletteItem")[0];
                        if (node) {
                            content.removeChild(node);
                            this.selectedItem = null;
                        }
                    }
                }
            }
        },
        expandPalette: function (paletteName) {
            var palette = this._findPalette(paletteName);
            if (palette && !palette.expanded) {
                if (this._canExpand(palette)) {
                    palette.expanded = true;
                    this._expandOrCollapsePalette(paletteName);
                }
            }
        },
        collapsePalette: function (paletteName) {
            var palette = this._findPalette(paletteName);
            if (palette && palette.expanded) {
                if (this._canExpand(palette)) {
                    palette.expanded = false;
                    this._expandOrCollapsePalette(paletteName);
                }
            }
        },
        addPalette: function (palette) {
            this.model.palettes.push(palette);
            this._renderPalette(palette);
        },
        removePalette: function (paletteName) {
            var paletteHeader, paletteContent, palette;
            for (var i = 0; i < this.model.palettes.length; i++) {
                palette = this.model.palettes[i];
                if (palette.name === paletteName) {
                    ej.datavisualization.Diagram.Util.removeItem(this.model.palettes, palette);
                    paletteHeader = this._getPaletteHeaderDiv(palette.name);
                    if (paletteHeader)
                        paletteHeader.parentNode.removeChild(paletteHeader);
                    paletteContent = this._getPaletteContentDiv(palette.name);
                    if (paletteContent)
                        paletteContent.parentNode.removeChild(paletteContent);
                }
            }
        },
        setWidth: function (value) {
            this.model.width = value;
            this._setWidth(value);
        },
        setHeight: function (value) {
            this.model.height = value;
            this._setHeight(value);
        },
        setPaletteItemWidth: function (value) {
            this.model.paletteItemWidth = value;
            this._redrawContent();
        },
        setPaletteItemHeight: function (value) {
            this.model.paletteItemHeight = value;
            this._redrawContent();
        },
        setHeaderHeight: function (value) {
            this.model.headerHeight = value;
            this._setHeaderHeight(value);
        },
        setCssClass: function (value) {
            this._setCssClass(value);
            this.model.cssClass = value;
        },
        showPaletteItemText: function (value) {
            this._showItemText(value);
            this.model.showPaletteItemText = value;
        },
        searchPalette: function (palette, key) {
            var paletteCollection = new ej.datavisualization.Diagram.Collection();
            var paletteItems = null;
            if (key != "") {
                palette = this._getSearchPaletteItems(key);
                paletteCollection.add(palette);
            }
            return paletteCollection;
        },
        updatePalette: function (paletteName, args) {
            var palette = this._findPalette(paletteName);
            if (palette && args) {
                if (args.constraints && (palette.constraints != args.constraints)) {
                    palette.constraints = args.constraints;
                    var header = this._getPaletteHeaderDiv(palette.name);
                    this._renderHeaderArrow(header, palette.expanded, palette.name, this._canExpand(palette));
                    this._disableClickClass(header, this._canExpand(palette));
                    this._updatePaletteVisibility(palette);
                    if (this._canHeaderVisible(palette) && this._canPaletteVisible(palette))
                        header.style.display = "";
                    else
                        header.style.display = "none";

                }
                if (args.expanded != undefined) {
                    if (this._canExpand(palette)) {
                        palette.expanded = args.expanded;
                        this._expandOrCollapsePalette(paletteName);
                    }
                }
                if (args.items && args.items.length > 0) {
                    var paletteContent = this._getPaletteContentDiv(palette.name);
                    paletteContent.innerHTML = "";
                    palette.items = args.items;
                    this._initPaletteitems(palette);
                    this._renderContent(palette);
                }

            }
            this.updateScrollerViewport();
        },
        //#endregion
        //#region Helper methods
        _findPalette: function (paletteName) {
            var palette;
            for (var i = 0; i < this.model.palettes.length; i++) {
                if (this.model.palettes[i].name == paletteName || this.model.palettes[i].name == paletteName.replace(/\_/gi, " ")) {
                    palette = this.model.palettes[i];
                    break;
                }
            }
            return palette;
        },
        _canExpand: function (palette) {
            return palette.constraints & ej.datavisualization.Diagram.PaletteConstraints.Expandable;
        },
        _canHeaderVisible: function (palette) {
            return palette.constraints & ej.datavisualization.Diagram.PaletteConstraints.HeaderVisibility;
        },
        _canPaletteVisible: function (palette) {
            return palette.constraints & ej.datavisualization.Diagram.PaletteConstraints.Visible;
        },

        _canClick: function (header) {
            if (header) {
                var paletteName = (header.id).split("_header")[0];
                if (paletteName) {
                    var palette = this._findPalette(paletteName);
                    if (this._canExpand(palette)) {
                        return true;
                    }
                }
            }
        },
        _expandOrCollapsePalette: function (paletteName, header) {
            var header = header || (paletteName ? this._getPaletteHeaderDiv(paletteName) : null);
            if (header) {
                if (this._canClick(header)) {
                    var proxy = this;
                    $(header).next(".e-scontent").slideToggle(200, function () {
                        proxy._refresh();
                    });
                    this._updateHeaderState(header);
                }
                else return false;
            }
        },
        _getSearchPaletteItems: function (key) {
            var palette = new ej.datavisualization.Diagram.Palette();
            var palettes = this.model.palettes, i, j;
            for (i = 0; i < palettes.length; i++) {
                if ((((palettes[i].name).toLocaleLowerCase()).search(key.toLocaleLowerCase())) >= 0) {
                    for (j = 0; j < palettes[i].items.length; j++) {
                        this.element.find("#" + palettes[i].items[j].name + "_paletteItem")[0].style.display = "block";
                    }
                }
                else {
                    for (j = 0; j < palettes[i].items.length; j++) {
                        if ((((palettes[i].items[j].name).toLocaleLowerCase()).search(key.toLocaleLowerCase())) >= 0) {
                            this.element.find("#" + palettes[i].items[j].name + "_paletteItem")[0].style.display = "block";
                        }
                        else
                            this.element.find("#" + palettes[i].items[j].name + "_paletteItem")[0].style.display = "none";
                    }
                }
            }
            return palette;
        },
        _disableClickClass: function (element, disable) {
            if (disable)
                $(element).removeClass("e-disableclick");
            else
                $(element).addClass("e-disableclick");
        },
        _addExpandedClass: function (element, expanded) {
            if (expanded)
                $(element).addClass("expanded");
            else
                $(element).addClass("collapsed");
        },
        _collapse: function (palette) {
            if (!palette.expanded)
                $(this._getPaletteHeaderDiv(palette.name)).next(".e-scontent").slideToggle(10);

        },
        _transformItem: function (group, width, height, node, isDrag, scaleSize) {
            if (!isDrag) {
                if (scaleSize && !node.segments && node.paletteItem && node.paletteItem.width && node.paletteItem.height && node.paletteItem.enableScale) {
                    var fx = (30 * scaleSize.width) / 100;
                    var fy = (30 * scaleSize.height) / 100;
                    var sx = (scaleSize.width - fx) / node.width;
                    var sy = (scaleSize.height - fy) / node.height;
                    sx = sy = Math.min(sx, sy);
                    sx = sx > 1 ? 1 : sx;
                    sy = sy > 1 ? 1 : sy;
                    var translate1 = ((scaleSize.width) / 2 - (width * sx) / 2);
                    var translate2 = ((scaleSize.height) / 2 - (height * sy) / 2);
                    var transform = "";
                    //translate
                    transform += "translate(" + translate1 + "," + translate2 + ")";
                    //scale
                    transform += "scale(" + sx + "," + sy + ")";
                    group.setAttribute("transform", transform);
                    var htmlLayer = group.parentNode.nextSibling;
                    if (!htmlLayer) htmlLayer = document.getElementById(group.id + "_svgWrapper_htmlLayer");
                    htmlLayer.style.webkitTransform = "translate(" + translate1 + "px," + translate2 + "px) scale(" + sx + ", " + sy + ")";
                    htmlLayer.style.MozTransform = "translate(" + translate1 + "px," + translate2 + "px) scale(" + sx + ", " + sy + ")";
                    htmlLayer.style.OTransform = "translate(" + translate1 + "px," + translate2 + "px) scale(" + sx + ", " + sy + ")";
                    htmlLayer.style.msTransform = "translate(" + translate1 + "px," + translate2 + "px) scale(" + sx + ", " + sy + ")";
                    htmlLayer.style.transform = "translate(" + translate1 + "px," + translate2 + "px) scale(" + sx + ", " + sy + ")";
                    if (node && ej.browserInfo().name === "msie") {
                        if (node._type == "group" && node.type === "html") {
                            var htmlDiv = document.getElementById(node.name + "_html");
                            htmlDiv.setAttribute("style", "zoom:" + scale + ";");
                        }
                    }
                }
                else if (!node.segments) {
                    var xd = width / (width + (node.borderWidth * 3));
                    var yd = height / (height + (node.borderWidth * 3));
                    var x = (width - (width * xd)) / 2;
                    var y = (height - (height * yd)) / 2;
                    group.childNodes[0].setAttribute("transform", "scale(" + xd + "," + yd + ") translate(" + x + "," + y + ")");
                    if (node && node.type === "image" && group.childNodes[1]) {
                        group.childNodes[1].setAttribute("transform", "scale(" + xd + "," + yd + ") translate(" + x + "," + y + ")");
                    }
                    else if (node && node._type === "group") {
                        group.setAttribute("transform", "scale(" + xd + "," + yd + ") translate(" + x + "," + y + ")");
                    }
                }
                else {
                    if (scaleSize && node.paletteItem && node.paletteItem.width && node.paletteItem.height || (node.isPhase && node.paletteItem && node.paletteItem.enableScale)) {
                        var fx = (10 * scaleSize.width) / 100;
                        var fy = (10 * scaleSize.height) / 100;
                        var sx = (scaleSize.width - fx) / width;
                        var sy = (scaleSize.height - fy) / height;
                        sx = sy = Math.min(sx, sy);
                        sx = sx > 1 ? 1 : sx;
                        sy = sy > 1 ? 1 : sy;
                        var translate1 = ((scaleSize.width) / 2 - (width * sx) / 2);
                        var translate2 = ((scaleSize.height) / 2 - (height * sy) / 2);
                        var transform = "";
                        //translate
                        transform += "translate(" + translate1 + "," + translate2 + ")";
                        //scale
                        transform += "scale(" + sx + "," + sy + ")";
                        group.setAttribute("transform", transform);
                        var htmlLayer = document.getElementById(group.id + "_svgWrapper_htmlLayer");
                        htmlLayer.style.webkitTransform = "translate(" + translate1 + "px," + translate2 + "px) scale(" + sx + ", " + sy + ")";
                        htmlLayer.style.MozTransform = "translate(" + translate1 + "px," + translate2 + "px) scale(" + sx + ", " + sy + ")";
                        htmlLayer.style.OTransform = "translate(" + translate1 + "px," + translate2 + "px) scale(" + sx + ", " + sy + ")";
                        htmlLayer.style.msTransform = "translate(" + translate1 + "px," + translate2 + "px) scale(" + sx + ", " + sy + ")";
                        htmlLayer.style.transform = "translate(" + translate1 + "px," + translate2 + "px) scale(" + sx + ", " + sy + ")";
                        if (node && ej.browserInfo().name === "msie") {
                            if (node._type == "group" && node.type === "html") {
                                var htmlDiv = document.getElementById(node.name + "_html");
                                htmlDiv.setAttribute("style", "zoom:" + scale + ";");
                            }
                        }
                    }
                }
            }
        },
        _getScaleFactor: function (width, height) {
            var fx = (30 * this.model.paletteItemWidth) / 100;
            var fy = (30 * this.model.paletteItemHeight) / 100;
            var sx = (this.model.paletteItemWidth - fx) / width;
            var sy = (this.model.paletteItemHeight - fy) / height;
            sx = sx > 1 ? 1 : sx;
            sy = sy > 1 ? 1 : sy;
            return Math.min(sx, sy);
        },
        _getTranslateFactor: function (width, height) {
            var x = (15 / 100) * this.model.paletteItemWidth;
            var y = (15 / 100) * this.model.paletteItemHeight;
            return Math.min(x, y);
        },
        _setWidth: function (val) {
            this.element.css("width", val);
        },
        _setHeight: function (val) {
            this.element.css("height", val);
        },
        _setHeaderHeight: function (val) {
            this.element.find(".e-header").css("height", val);
            this.element.find(".e-header-arrow").css("top", (val - 16) / 2);
            for (var i = 0; i < this.model.palettes.length; i++) {
                var palette = this.model.palettes[i];
                if (palette) {
                    this._updateHeaderWrapper(palette, val);
                }
            }
            this.updateScrollerViewport();
        },
        _updateHeaderWrapper: function (palette, val) {
            var paletteWrapper = document.getElementById(palette.name + "_Wrapper");
            if (paletteWrapper) {
                var bounds = paletteWrapper.getBoundingClientRect();
                if (bounds.height > 0)
                    paletteWrapper.style.marginTop = val / 2 - bounds.height / 2 + "px";
            }
        },
        _setCssClass: function (val) {
            this.element.removeClass(this.model.cssClass).addClass(val);
        },
        _showItemText: function (val) {
            if (val !== this.model.showPaletteItemText)
                if (val) {
                    this.element.find(".e-text-container").show();
                }
                else
                    this.element.find(".e-text-container").hide();
        },
        _setAllowDrag: function (val) {
            this.model.allowDrag = val;
            var palettes = this.model.palettes;
            var container;
            if (palettes) {
                for (var i = 0; i < palettes.length; i++) {
                    var paletteItems = palettes[i].items;
                    if (paletteItems) {
                        for (var j = 0; j < paletteItems.length; j++) {
                            container = document.getElementById(paletteItems[j].name + "_paletteItem");
                            if (this.model.allowDrag)
                                this._setItemDraggable(container);
                            else
                                $(container).ejDraggable("instance").destroy();
                        }
                    }
                }
            }
        },
        _cloneNode: function (node) {
            var id = ej.datavisualization.Diagram.Util.randomId(), obj;
            if (node.children && node.children.length > 0) {
                for (var i = 0; i < node.children.length; i++) {
                    obj = this._cloneChildren(node.children[i], id);
                    this.nameTable[obj.name] = obj;
                    node.children[i] = obj.name;
                }
            }
            node.name += id;
            return node;
        },
        _cloneChildren: function (child, id) {
            if (typeof (child) === "object") {
                obj = $.extend(true, {}, child);
                obj.parent += id;
                obj.name += id;
                return obj;
            }
            else if (typeof (child) === "string") {
                var obj = this.nameTable[child];
                if (obj) {
                    obj = this._cloneChildren(obj, id);
                    return obj;
                }
            }
        },
        _setItemDraggable: function (container) {
            var paletteId = this.element[0].id;
            var context = this;
            $(container).ejDraggable({
                clone: true,
                cursorAt: { top: context.model.previewOffset.y, left: context.model.previewOffset.x },
                helper: function (event) {
                    var diagram = $("#" + context.model.diagramId).ejDiagram("instance");
                    var paletteItemWidth, paletteItemHeight;
                    paletteItemWidth = context.model.paletteItemWidth;
                    paletteItemHeight = context.model.paletteItemHeight;
                    diagram._selectedSymbol = context.selectedItem;
                    diagram._symbolPalette = context.model;
                    var item = $.extend(true, {}, context.selectedItem);
                    //if (item.type != "bpmn")
                    item = context._cloneNode(item);
                    if (item.isLane) {
                        context.model.paletteItemWidth = (item.paletteItem && item.paletteItem.previewWidth) ? item.paletteItem.previewWidth : context.model.previewWidth;
                        context.model.paletteItemHeight = (item.paletteItem && item.paletteItem.previewHeight) ? item.paletteItem.previewHeight : context.model.previewHeight;
                    }
                    var previewSize = context._getPreviewItemSize(context.selectedItem);
                    var svg = context._renderItemContainer(context.selectedItem.name + "_clone", document.body, true, previewSize);
                    svg.document.setAttribute("drag", "true");
                    diagram._paletteTable = context.nameTable;
                    diagram._palNameTable = $.extend(true, {}, context.nameTable);
                    if (item.segments) {
                        var bounds = ej.datavisualization.Diagram.Util.bounds(item);
                        var delWidth = (previewSize.width - 10) / bounds.width;
                        var delHeight = (previewSize.height - 10) / bounds.height;
                        ej.datavisualization.Diagram.Util.scale(item, delWidth, delHeight, bounds.topLeft, diagram.nameTable);
                        context._renderConnector(item, svg, previewSize);
                    }
                    else {
                        if ((item.isLane && item.paletteItem && !item.paletteItem.enableScale)) {
                            item.width = previewSize.width;
                            item.height = previewSize.height;
                            item.offsetX = item.width / 2;
                            item.offsetY = item.height / 2;
                        }
                        else if (item._type == "group") {
                            var nameTable = []
                            var deltaWidth = previewSize.width / item.width;
                            var deltaHeight = previewSize.height / item.height;
                            context.scale(item, deltaWidth, deltaHeight, item.pivot, context.nameTable, null, null, null, context);
                            ej.datavisualization.Diagram.Util._translate(item, item.width / 2 - item.offsetX, item.height / 2 - item.offsetY, context.nameTable, null, context);
                        }
                        else {
                            item.width = previewSize.width - 10;
                            item.height = previewSize.height - 10;
                            if (previewSize) {
                                previewSize.width = previewSize.width - 10;
                                previewSize.height = previewSize.height - 10;
                            }
                            item.offsetX = item.width / 2 + 10;
                            item.offsetY = item.height / 2 + 1;
                        }
                        context._updatePreviewSize(item, previewSize);
                        if (item._type == "node")
                            context._renderNode(item, svg, previewSize);
                        else {
                            context._renderGroup(item, svg);
                        }
                    }
                    var helper = document.getElementById(context.selectedItem.name + "_clone_paletteItem");
                    $(helper).addClass("dragClone");
                    context.model.paletteItemWidth = paletteItemWidth;
                    context.model.paletteItemHeight = paletteItemHeight;
                    return $(helper);
                },
                drag: function () {
                    var element = this.helper[0];
                    $("#" + context.selectedItem.name + "_clone_svg").css("padding", "2px");
                    $("#" + context.selectedItem.name + "_clone_svg").siblings(".htmlLayer").css("padding", "2px");
                    if (element) {
                        element.setAttribute("paletteId", paletteId);
                    }
                },
                dragStop: function (event, ui) {
                    var isTouch = false;
                    if (event.event && event.event.originalEvent && event.event.originalEvent.changedTouches) {
                        isTouch = true;
                    }
                    else if (event.event && event.event.changedTouches) {
                        isTouch = true;
                    }
                    var diagram = $("#" + context.model.diagramId).ejDiagram("instance");
                    if (isTouch && diagram._isDropOver) {
                        diagram._svgdrop(event.event, this);
                        diagram._isDropped = true;
                    }
                    diagram._selectedSymbol = null;
                    $(this.helper).remove();
                }
            });
        },
        _redrawContent: function () {
            var contents = this.element.find(".e-scontent");
            for (var i = 0, len = contents.length; i < len; ++i) {
                var content = contents[i];
                $(content).empty();
                var palette = this.model.palettes[i];
                var paletteItems = palette.items;
                if (paletteItems && paletteItems.length > 0) {
                    for (var count = 0, l = paletteItems.length; count < l; count++) {
                        this._renderItem(paletteItems[count], content);
                    }
                }
            }
        },
        _getPalette: function (name) {
            var palettes = this.model.palettes;
            for (var i = 0, len = palettes.length; i < len; i++) {
                var palette = palettes[i];
                if ((palette.name === name || palette.name === name.replace(/\_/gi, " ")) && palette !== this.activePalette)
                    return palette;
            }
            return null;
        },
        _getActivePalette: function (elementId) {
            var name = elementId.slice(0, elementId.lastIndexOf('_'));
            return this._getPalette(name);;
        },
        _updateHeaderState: function (target) {
            this._clearHeaderSelection();
            this._updateExpandState(target);
            this._updateHeaderSelection(target);
        },
        _updateExpandState: function (target) {
            if (($(target).hasClass("expanded"))) {
                $(target).removeClass("expanded").addClass("collapsed");
                $(target).find(".e-header-arrow").removeClass("expanded").addClass("collapsed");
                $(target).attr("aria-expanded", "false");
                $(target).attr("aria-selected", "false");
            }
            else {
                $(target).removeClass("collapsed").addClass("expanded");
                $(target).find(".e-header-arrow").removeClass("collapsed").addClass("expanded");
                $(target).attr("aria-selected", "true");
                $(target).attr("aria-expanded", "true");
            }
        },
        _updateHeaderSelection: function (target) {
            if (!($(target).hasClass("selected"))) {
                $(target).addClass("selected");
                $(target).find(".e-header-arrow").addClass("selected");
            }
        },
        _clearHeaderSelection: function () {
            this.element.find(".e-header").removeClass("selected");
            this.element.find(".e-header-arrow").removeClass("selected");
        },
        _addItem: function (palette, item) {
            var content = this._getPaletteContentDiv(palette.name);
            this._renderItem(item, content);
        },
        _removeItem: function (palette, item) {
            var content = this._getPaletteContentDiv(palette.name);
            content.removeChild(document.getElementById(item.name + "_paletteItem"));
            if (item === this._selectedElement)
                this._selectedElement = null;
        },
        updateScrollerViewport: function () {
            var scroller = this.element.ejScroller("instance");
            scroller.model.touchScroll = false;
            scroller.model.width = this._setViewPortWidth();
            scroller.model.height = this._setViewPortHeight();
            this._refresh();
        },
        _refresh: function () {
            this.element.ejScroller("refresh");
        },
        _getNodeDimension: function (node) {
            var prevWidth = node._width, prevHeight = node._height;
            var width = node.width ? node.width : (node.maxWidth ? node.maxWidth : node.minWidth);
            var text = document.createElement("span");
            var w = 0, h = 0, label, i;
            if (node.labels.length) {
                ej.datavisualization.Diagram.Util.attr(text, { "id": node.name + "_label", "class": "ej-d-label", "style": "display: inline-block; position: absolute; pointer-events: all; line-height: normal;" });
                this.element[0].appendChild(text);
                for (i = 0; i < node.labels.length; i++) {
                    label = node.labels[i];
                    if (label.bold) text.style.fontWeight = "bold";
                    if (label.italic) text.style.fontStyle = "italic";
                    text.style.textDecoration = label.textDecoration;
                    text.style.fontFamily = label.fontFamily;
                    text.style.fontSize = label.fontSize + "px";
                    text.style.color = label.fontColor;
                    text.style.backgroundColor = label.fillColor;
                    text.style.borderColor = label.borderColor;
                    text.style.borderWidth = label.borderWidth;
                    text.textContent = label.text;
                    text.style.wordWrap = "break-word";
                    text.style.whiteSpace = "pre";
                    if (width) text.style.maxWidth = width - (label.margin.left + label.margin.right) - label.fontSize + "px";
                    w += text.offsetWidth + label.margin.left + label.margin.right;
                    h += text.offsetHeight + label.margin.top + label.margin.bottom;
                }
                node._width = w;
                node._height = h;
                if (node.minWidth && (node.minWidth > node._width || !node._width)) node._width = node.minWidth;
                if (node.maxWidth && (node.maxWidth < node._width || !node._width)) node._width = node.maxWidth;
                if (node.minHeight && (node.minHeight > node._height || !node._height)) node._height = node.minHeight;
                if (node.maxHeight && (node.maxHeight < node._height || !node._height)) node._height = node.maxHeight;
                if (!node.width && node.labels[0].horizontalAlignment == "left") node.offsetX += (node._width - prevWidth) * (1 - node.pivot.x);
                if (!node.width && node.labels[0].horizontalAlignment == "right") node.offsetX -= (node._width - prevWidth) * node.pivot.x;
                if (!node.height && node.labels[0].verticalAlignment == "top") node.offsetY += (node._height - prevHeight) * (1 - node.pivot.y);
                if (!node.height && node.labels[0].verticalAlignment == "bottom") node.offsetY -= (node._height - prevHeight) * node.pivot.y;
                this.element[0].removeChild(text);
            }
        },
        _getNewNode: function (options) {
            if (options.shape && typeof options.shape === "object")
                ej.datavisualization.Diagram.Util._updateShapeProperties(options);
            return ej.datavisualization.Diagram.Node($.extend(true, {}, this.model.defaultSettings.node, options));
        },
        _getNewGroup: function (options) {
            if (options.type == "bpmn") options = ej.datavisualization.Diagram.Util._updateBpmnChild(ej.datavisualization.Diagram.Node(options), this);
            if (options.children && options.children.length > 0) {
                for (var i = 0; i < options.children.length; i++) {
                    var child = options.children[i];
                    if (child) {
                        if (child.type === 'bpmn' || child.type === 'group') {
                            options.children[i] = this.nameTable[child.name] = this._getNewGroup(child)
                        }
                        else {
                            options.children[i] = this.nameTable[child.name] = this._getNewNode(child)
                        }
                    }
                }
            }
            return ej.datavisualization.Diagram.Group($.extend(true, {}, this.model.defaultSettings.group, options));
        },
        scale: function (node, sw, sh, pivot, nameTable, skipScalOnChild, updateMinMax, isHelper, diagram) {
            var matrix = ej.Matrix.identity();
            if (!node.segments) {
                if (node._type === "group") {
                    var nodes = node.children;
                    var child;
                    for (var i = 0; i < nodes.length; i++) {
                        child = nameTable[typeof nodes[i] == "string" ? nodes[i] : nodes[i].name];
                        if (child) {
                            this.scale(child, sw, sh, pivot, nameTable, undefined, undefined, undefined, diagram);
                            if (child.parent && (child.parent != node.name && node.type != "pseudoGroup"))
                                ej.datavisualization.Diagram.Util._updateGroupBounds(nameTable[child.parent], diagram);
                        }
                    }
                    ej.datavisualization.Diagram.Util._updateGroupBounds(node, diagram);
                }
                ej.Matrix.rotate(matrix, -node.rotateAngle, pivot.x, pivot.y);
                ej.Matrix.scale(matrix, sw, sh, pivot.x, pivot.y);
                ej.Matrix.rotate(matrix, node.rotateAngle, pivot.x, pivot.y);
                var newPosition = ej.Matrix.transform(matrix, ej.datavisualization.Diagram.Point(node.offsetX, node.offsetY));
                var width = node.width * sw;
                var height = node.height * sh;
                if (width > 1) {
                    node.width = width;
                    node.offsetX = newPosition.x;
                }
                if (height > 1) {
                    node.height = height;
                    node.offsetY = newPosition.y;
                }
            } else {
                ej.Matrix.scale(matrix, sw, sh, pivot.x, pivot.y);
                for (var i = 0; i < node.segments.length; i++) {
                    var segment = node.segments[i];
                    for (var j = 0; j < segment.points.length; j++) {
                        segment.points[j] = ej.Matrix.transform(matrix, segment.points[j]);
                        if (i == 0 && j == 0 && !node.sourceNode) {
                            segment._startPoint = segment.points[0];
                            segment._endPoint = segment.points[segment.points.length - 1];
                            ej.datavisualization.Diagram.Util._setLineEndPoint(node, ej.Matrix.transform(matrix, node.sourcePoint), false);
                        }
                        if (i == node.segments.length - 1 && j == segment.points.length - 1 && !node.targetNode) {
                            segment._startPoint = segment.points[0];
                            segment._endPoint = segment.points[segment.points.length - 1];
                            node.targetPoint = segment._endPoint;
                        }
                    }
                    segment._startPoint = segment.points[0];
                    segment._endPoint = segment.points[segment.points.length - 1];
                    if (segment.type == "orthogonal") {
                        if (segment.length || segment.length === 0)
                            segment.length = segment._length = ej.datavisualization.Diagram.Geometry.distance(segment._startPoint, segment._endPoint);
                        else
                            ej.datavisualization.Diagram.Util._addOrthogonalPoints(segment, node.segments[i - 1], node.segments[i + 1], node.sourcePoint, node.targetPoint);
                    } else {
                        if (segment.point) {
                            segment.point = segment._endPoint;
                        }
                        segment._point = segment._endPoint;
                    }
                }
            }
        },
        _translate: function (node, dx, dy, nameTable, isContainer, diagram) {
            // if (ej.datavisualization.Diagram.Util.canMove(node))
            {
                if (!node.segments) {
                    node.offsetX += dx;
                    node.offsetY += dy;
                    if (node._type === "group" && !isContainer) {
                        var nodes = diagram._getChildren(node.children);
                        var child;
                        for (var i = 0; i < nodes.length; i++) {
                            child = nameTable[nodes[i]];
                            this._translate(child, dx, dy, nameTable, null, diagram);
                            if (child.parent && (child.parent != node.name && node.type != "pseudoGroup"))
                                ej.datavisualization.Diagram.Util._updateGroupBounds(nameTable[child.parent], diagram);
                        }
                        if (node._type != "group" && node.container)
                            ej.datavisualization.Diagram.Util._updateGroupBounds(node, diagram);
                    }
                } else {
                    ej.datavisualization.Diagram.Util._translateLine(node, dx, dy, node);
                }
            }
        },
        //#endregion
    });
    //#endregion
})(jQuery, Syncfusion);