/**
* @fileOverview Plugin to style the Html Button elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/

(function ($, ej, undefined) {
    ej.widget("ejRibbon", "ej.Ribbon", {
        element: null,
        validTags: ["div"],
        model: null,
        _rootCSS: "e-ribbon",
        _requiresID: true,
        defaults: {

            width: null,

            cssClass: "",


            buttonDefaults: {

                width: null,
                height: null,

                enableRTL: false,

                showRoundedCorner: false,

                enabled: true,

                cssClass: null
            },

            expandPinSettings: {

                toolTip: null,

                customToolTip: {

                    title: null,

                    content: null,

                    prefixIcon: null

                }

            },

            collapsePinSettings: {

                toolTip: null,

                customToolTip: {

                    title: null,

                    content: null,

                    prefixIcon: null

                }

            },

            applicationTab: {

                type: "menu",

                backstageSettings: {

                    text: null,

                    height: null,

                    width: null,

                    headerWidth: null,

                    pages: [{

                        id: null,

                        text: null,

                        itemType: "tab",

                        contentID: null,

                        enableSeparator: false
                    }]

                },

                menuItemID: null,

                menuSettings: {}
            },

            tabs: [{

                id: null,

                text: null,

                groups: [{
					
					id: null,

                    text: null,

                    type: null,

                    contentID: null,

                    customContent: null,

                    alignType: "rows",

                    enableGroupExpander: false,

                    groupExpanderSettings: {

                        toolTip: null,

                        customToolTip: {

                            title: null,

                            content: null,

                            prefixIcon: null

                        }
                    },

                    content: [{

                        groups: [{

                            id: null,

                            text: null,

                            toolTip: null,

                            quickAccessMode: "none",

                            isMobileOnly:"false",

                            customToolTip: {

                                title: null,

                                content: null,

                                prefixIcon: null,
                            },

                            columns: null,

                            itemHeight: null,

                            itemWidth: null,

                            expandedColumns: null,

                            type: "button",

                            galleryItems: [{

                                text: null,

                                toolTip: null,

                                customToolTip: {},

                                buttonSettings: {}
                            }],

                            customGalleryItems: [{

                                text: null,

                                toolTip: null,

                                customToolTip: {},

                                customItemType: "button",

                                buttonSettings: {},

                                menuId: "",

                                menuSettings: {}
                            }],

                            contentID: null,

                            enableSeparator: false,

                            isBig: false,

                            cssClass: null,

                            buttonSettings: {},

                            splitButtonSettings: {},

                            toggleButtonSettings: {},

                            dropdownSettings: {},
                        }],

                        defaults: {},
                    }],
                }]
            }],

            contextualTabs: [{

                backgroundColor: null,

                borderColor: null,

                tabs: []
            }],

            tabSelect: null,

            tabClick: null,

            tabAdd: null,

            tabRemove: null,

            load:null,

            beforeTabRemove: null,

            tabCreate: null,

            create: null,

            groupClick: null,

            beforeTabClick:null,

            galleryItemClick: null,

            backstageItemClick: null,

            collapse: null,

            expand: null,

            pinState: null,

            toggleButtonClick: null,

            groupExpand: null,

            qatMenuItemClick: null,

            selectedItemIndex: 1,

            enabledItemIndex: [],

            disabledItemIndex: [0],

            // allowResizing is a deprecated API, we can achieve this requirement by isResponsive property
            allowResizing: false,

            isResponsive: false,

            showQAT: false,

            showBelowQAT: false,
			
			enableOnDemand :false,
			
			collapsible :false,

            locale: "en-US",

            enableRTL: false,

            destory: null,

            //This is only for internal purpose of spreadsheet.
           _destroyed: null,
            
        },
        dataTypes: {
            tabs: "array",
            contextualTabs: "array",
            disabledItemIndex: "data",
            enabledItemIndex: "data",
            selectedItemIndex: "number",
            applicationTab: {
                backstageSettings: {
                    pages: "array"
                }
            }
        },

        _destroy: function () {
            var galleryMenu, ddlPopup, splitPopup, appTabMenu;
            appTabMenu = this._applicationTab.find('.e-menu');
            if (appTabMenu.length > 0)
                appTabMenu.data('ejMenu').destroy();
            this.element.find(".e-rbncustomelement,.e-backstagetabarea,.e-gallerymenu").hide();
            galleryMenu = this.element.find(".e-gallerymenu");
            var gallen = galleryMenu.length;
            for (var i = 0; i < gallen; i++) {
                galleryMenu.eq(i).data('ejMenu').destroy();
                galleryMenu.eq(i).remove();
            }
            this.element.find(".e-rbncustomelement,.e-backstagetabarea,.e-gallerymenu").appendTo(this.element.parent());
            ddlPopup = $('.e-rbn-ddl.e-ddl').find('.e-dropdownlist');
            var ddlPopuplen=ddlPopup.length;
            for (var i = 0; i < ddlPopuplen; i++) {
                ddlPopup.eq(i).data('ejDropDownList').destroy();
                ddlPopup.siblings('ul').appendTo(this.element.parent());
            }
            splitPopup = $('.e-rbn-splitbtn.e-splitbutton');
            var splitPopuplen = splitPopup.length;
            for (var i = 0; i < splitPopuplen; i++) {
                splitPopup.eq(i).data('ejSplitButton').destroy();
                splitPopup.siblings('ul').appendTo(this.element.parent());
            }
            this.element.children().remove();
            if (!(this._cloneElement).attr('role')) this.element.removeAttr('role');
            this.element.removeClass('e-tab e-widget');
			if(this.element.hasClass('e-ribwithout-apptab'))
			 this.element.removeClass('e-ribwithout-apptab')
		    if(this.model.enableOnDemand)
		        this.element.ejWaitingPopup("destroy");
		    this._trigger("_destroyed");
        },
        _tags: [{
            tag: "applicationTab.backstageSettings.pages", attr: ["id", "text", "itemType", "contentID", "enableSeparator"]
        },
		{
		    tag: "tabs", attr: ["id", "text", [{
		        tag: "groups", attr: ["id", "text", "alignType", "type", "contentID", "enableGroupExpander", [{
		            tag: "content", attr: ["defaults.type", "defaults.width", "defaults.height", "defaults.isBig", [{
		                tag: "groups", attr: ["id", "columns", "itemHeight", "itemWidth", "expandedColumns", "contentID", "text", "type", "toolTip","isMobileOnly", "quickAccessMode", "width",
                        "enableSeparator",
					"buttonSettings.contentType", "buttonSettings.type", "buttonSettings.imagePosition", "buttonSettings.prefixIcon", "buttonSettings.click", "buttonSettings.width", "buttonSettings.cssClass", "buttonSettings.enabled", "buttonSettings.showRoundedCorner", "buttonSettings.enableRTL", "buttonSettings.repeatButton", "buttonSettings.size", "buttonSettings.height", "buttonSettings.text", "buttonSettings.timeInterval", "buttonSettings.create", "buttonSettings.click", "buttonSettings.destroy", "splitButtonSettings.contentType", "splitButtonSettings.prefixIcon", "splitButtonSettings.targetID",
                        "splitButtonSettings.buttonMode", "splitButtonSettings.arrowPosition", "splitButtonSettings.type", "splitButtonSettings.click",
						"splitButtonSettings.enabled", "splitButtonSettings.showRoundedCorner", "splitButtonSettings.enableRTL", "splitButtonSettings.size", "splitButtonSettings.height", "splitButtonSettings.imagePosition", "splitButtonSettings.width", "splitButtonSettings.text", "splitButtonSettings.suffixIcon", "splitButtonSettings.create", "splitButtonSettings.itemMouseOver", "splitButtonSettings.itemSelected", "splitButtonSettings.beforeOpen", "splitButtonSettings.destroy", "splitButtonSettings.cssClass",
						"dropdownSettings.dataSource", "dropdownSettings.text", "dropdownSettings.value", "dropdownSettings.select", "dropdownSettings.width", "dropdownSettings.showRoundedCorner", "dropdownSettings.showPopupOnLoad", "dropdownSettings.allowMultiSelection", "dropdownSettings.enableRTL", "dropdownSettings.enabled", "dropdownSettings.caseSensitiveSearch", "dropdownSettings.showCheckbox", "dropdownSettings.checkAll", "dropdownSettings.uncheckAll", "dropdownSettings.enablePersistence", "dropdownSettings.enableIncrementalSearch", "dropdownSettings.readOnly", "dropdownSettings.allowGrouping", "dropdownSettings.fields",
						"dropdownSettings.selectedItems", "dropdownSettings.itemsCount", "dropdownSettings.height", "dropdownSettings.cssClass", "dropdownSettings.itemValue", "dropdownSettings.popupHeight", "dropdownSettings.targetID", "dropdownSettings.waterMarkText", "dropdownSettings.template", "dropdownSettings.cascadeTo", "dropdownSettings.query", "dropdownSettings.create", "dropdownSettings.popupHide", "dropdownSettings.popupShown", "dropdownSettings.beforePopupShown", "dropdownSettings.change", "dropdownSettings.checkChange", "dropdownSettings.enableAnimation", "dropdownSettings.destroy",
						"toggleButtonSettings.contentType", "toggleButtonSettings.defaultText", "toggleButtonSettings.activeText", "toggleButtonSettings.type", "toggleButtonSettings.defaultPrefixIcon", "toggleButtonSettings.activePrefixIcon", "toggleButtonSettings.click", "toggleButtonSettings.enabled", "toggleButtonSettings.showRoundedCorner", "toggleButtonSettings.enableRTL", "toggleButtonSettings.enablePersistence", "toggleButtonSettings.toggleState",
						"toggleButtonSettings.preventToggle", "toggleButtonSettings.size", "toggleButtonSettings.imagePosition", "toggleButtonSettings.height", "toggleButtonSettings.width", "toggleButtonSettings.cssClass",
						"toggleButtonSettings.defaultText", "toggleButtonSettings.activeText", "toggleButtonSettings.defaultPrefixIcon",
						"toggleButtonSettings.defaultSuffixIcon", "toggleButtonSettings.activePrefixIcon", "toggleButtonSettings.create", "toggleButtonSettings.change", "toggleButtonSettings.destroy",
						"customToolTip.title", "customToolTip.content", "customToolTip.prefixIcon", [{
						    tag: "galleryItems", attr: ["text", "toolTip", "customToolTip.title", "customToolTip.content", "customToolTip.prefixIcon", "buttonSettings.contentType", "buttonSettings.type", "buttonSettings.imagePosition", "buttonSettings.prefixIcon", "buttonSettings.click", "buttonSettings.width", "buttonSettings.cssClass", "buttonSettings.enabled", "buttonSettings.showRoundedCorner", "buttonSettings.enableRTL", "buttonSettings.repeatButton", "buttonSettings.size", "buttonSettings.height", "buttonSettings.text", "buttonSettings.timeInterval", "buttonSettings.create", "buttonSettings.click", "buttonSettings.destroy"]
						}, {
						    tag: "customGalleryItems", attr: ["text", "toolTip", "customToolTip.title", "customToolTip.content", "customToolTip.prefixIcon", "menuId", "customItemType",
    "buttonSettings.contentType", "buttonSettings.type", "buttonSettings.imagePosition", "buttonSettings.prefixIcon", "buttonSettings.click", "buttonSettings.width", "buttonSettings.cssClass", "buttonSettings.enabled", "buttonSettings.showRoundedCorner", "buttonSettings.enableRTL", "buttonSettings.repeatButton", "buttonSettings.size", "buttonSettings.height", "buttonSettings.text", "buttonSettings.timeInterval", "buttonSettings.create", "buttonSettings.click", "buttonSettings.destroy",
                            "menuSettings.openOnClick", "menuSettings.enableCenterAlign", "menuSettings.showRooltLevelArrows", "menuSettings.showSubLevelArrows", "menuSettings.enableSeparator", "menuSettings.enabled", "menuSettings.orientation", "menuSettings.menuType", "menuSettings.animationType", "menuSettings.subMenuDirection", "menuSettings.fields", "menuSettings.cssClass", "menuSettings.contextMenuTarget", "menuSettings.excludeTarget", "menuSettings.height", "menuSettings.width", "menuSettings.titleText", "menuSettings.create", "menuSettings.beforeOpen", "menuSettings.open", "menuSettings.close", "menuSettings.mouseover", "menuSettings.mouseout", "menuSettings.keydown", "menuSettings.destroy"
						    ]
						}]]
		            }]]
		        }]]
		    }]]
		}, {
		    tag: "contextualTabs", attr: ["backgroundColor", "borderColor", [{
		        tag: "tabs", attr: ["id", "text", [{
		            tag: "groups", attr: ["id", "text", "alignType", "type", "contentID", [{
		                tag: "content", attr: ["defaults.type", "defaults.width", "defaults.height", "defaults.isBig", [{
		                    tag: "groups", attr: ["id", "columns", "itemHeight", "itemWidth", "expandedColumns", "contentID", "text", "type", "toolTip", "width",
                            "enableSeparator",
                            "buttonSettings.contentType", "buttonSettings.type", "buttonSettings.imagePosition", "buttonSettings.prefixIcon", "buttonSettings.click", "buttonSettings.width", "buttonSettings.cssClass", "buttonSettings.enabled", "buttonSettings.showRoundedCorner", "buttonSettings.enableRTL", "buttonSettings.repeatButton", "buttonSettings.size", "buttonSettings.height", "buttonSettings.text", "buttonSettings.timeInterval", "buttonSettings.create", "buttonSettings.click", "buttonSettings.destroy", "splitButtonSettings.contentType", "splitButtonSettings.prefixIcon", "splitButtonSettings.targetID",
                            "splitButtonSettings.buttonMode", "splitButtonSettings.arrowPosition", "splitButtonSettings.type", "splitButtonSettings.click",
                            "splitButtonSettings.enabled", "splitButtonSettings.showRoundedCorner", "splitButtonSettings.enableRTL", "splitButtonSettings.size", "splitButtonSettings.height", "splitButtonSettings.imagePosition", "splitButtonSettings.width", "splitButtonSettings.text", "splitButtonSettings.suffixIcon", "splitButtonSettings.create", "splitButtonSettings.itemMouseOver", "splitButtonSettings.itemSelected", "splitButtonSettings.beforeOpen", "splitButtonSettings.destroy", "splitButtonSettings.cssClass",
                            "dropdownSettings.dataSource", "dropdownSettings.text", "dropdownSettings.value", "dropdownSettings.select", "dropdownSettings.width", "dropdownSettings.showRoundedCorner", "dropdownSettings.showPopupOnLoad", "dropdownSettings.allowMultiSelection", "dropdownSettings.enableRTL", "dropdownSettings.enabled", "dropdownSettings.caseSensitiveSearch", "dropdownSettings.showCheckbox", "dropdownSettings.checkAll", "dropdownSettings.uncheckAll", "dropdownSettings.enablePersistence", "dropdownSettings.enableIncrementalSearch", "dropdownSettings.readOnly", "dropdownSettings.allowGrouping", "dropdownSettings.fields",
                            "dropdownSettings.selectedItems", "dropdownSettings.itemsCount", "dropdownSettings.height", "dropdownSettings.cssClass", "dropdownSettings.itemValue", "dropdownSettings.popupHeight", "dropdownSettings.targetID", "dropdownSettings.waterMarkText", "dropdownSettings.template", "dropdownSettings.cascadeTo", "dropdownSettings.query", "dropdownSettings.create", "dropdownSettings.popupHide", "dropdownSettings.popupShown", "dropdownSettings.beforePopupShown", "dropdownSettings.change", "dropdownSettings.checkChange", "dropdownSettings.enableAnimation", "dropdownSettings.destroy",
                            "toggleButtonSettings.contentType", "toggleButtonSettings.defaultText", "toggleButtonSettings.activeText", "toggleButtonSettings.type", "toggleButtonSettings.defaultPrefixIcon", "toggleButtonSettings.activePrefixIcon", "toggleButtonSettings.click", "toggleButtonSettings.enabled", "toggleButtonSettings.showRoundedCorner", "toggleButtonSettings.enableRTL", "toggleButtonSettings.enablePersistence", "toggleButtonSettings.toggleState",
                            "toggleButtonSettings.preventToggle", "toggleButtonSettings.size", "toggleButtonSettings.imagePosition", "toggleButtonSettings.height", "toggleButtonSettings.width", "toggleButtonSettings.cssClass",
                            "toggleButtonSettings.defaultText", "toggleButtonSettings.activeText", "toggleButtonSettings.defaultPrefixIcon",
                            "toggleButtonSettings.defaultSuffixIcon", "toggleButtonSettings.activePrefixIcon", "toggleButtonSettings.create", "toggleButtonSettings.change", "toggleButtonSettings.destroy",
                            "customToolTip.title", "customToolTip.content", "customToolTip.prefixIcon", [{
                                tag: "galleryItems", attr: ["text", "toolTip", "customToolTip.title", "customToolTip.content", "customToolTip.prefixIcon", "buttonSettings.contentType", "buttonSettings.type", "buttonSettings.imagePosition", "buttonSettings.prefixIcon", "buttonSettings.click", "buttonSettings.width", "buttonSettings.cssClass", "buttonSettings.enabled", "buttonSettings.showRoundedCorner", "buttonSettings.enableRTL", "buttonSettings.repeatButton", "buttonSettings.size", "buttonSettings.height", "buttonSettings.text", "buttonSettings.timeInterval", "buttonSettings.create", "buttonSettings.click", "buttonSettings.destroy"]
                            }, {
                                tag: "customGalleryItems", attr: ["text", "toolTip", "customToolTip.title", "customToolTip.content", "customToolTip.prefixIcon", "menuId", "customItemType",
        "buttonSettings.contentType", "buttonSettings.type", "buttonSettings.imagePosition", "buttonSettings.prefixIcon", "buttonSettings.click", "buttonSettings.width", "buttonSettings.cssClass", "buttonSettings.enabled", "buttonSettings.showRoundedCorner", "buttonSettings.enableRTL", "buttonSettings.repeatButton", "buttonSettings.size", "buttonSettings.height", "buttonSettings.text", "buttonSettings.timeInterval", "buttonSettings.create", "buttonSettings.click", "buttonSettings.destroy",
                                "menuSettings.openOnClick", "menuSettings.enableCenterAlign", "menuSettings.showRooltLevelArrows", "menuSettings.showSubLevelArrows", "menuSettings.enableSeparator", "menuSettings.enabled", "menuSettings.orientation", "menuSettings.menuType", "menuSettings.animationType", "menuSettings.subMenuDirection", "menuSettings.fields", "menuSettings.cssClass", "menuSettings.contextMenuTarget", "menuSettings.excludeTarget", "menuSettings.height", "menuSettings.width", "menuSettings.titleText", "menuSettings.create", "menuSettings.beforeOpen", "menuSettings.open", "menuSettings.close", "menuSettings.mouseover", "menuSettings.mouseout", "menuSettings.keydown", "menuSettings.destroy"
                                ]
                            }]]
		                }]]
		            }]]
		        }]]
		    }]
		    ]
		}],
        _ribbonRerender: function () {
            var model = this.model, element = this.element, i, contentDiv;
            contentDiv = this.element.find('.e-content.e-content-item');
            if (this.element.find('.e-collapse-content').length > 0) {
                var contentlen=contentDiv.length;
                for (i = 0; i < contentlen; i++) {
                    if (contentDiv.eq(i).hasClass('e-active-content') && contentDiv.eq(i).hasClass('e-collapse-content')) {
                        this._selectedItemIndex = i;
                        this._isCollapsed = true;
                        break;
                    }
                }
            }
            if (this._isCollapsed) {
                model.selectedItemIndex = this._selectedItemIndex;
                model._isCollapsed = true;
            }
            else
                model._isCollapsed = false;
            if (this.element.data("ejTab")) {
                this.element.data("ejTab")._destroy();
                this.element = element, this.model = model;
            }
            this.element.ejRibbon("destroy").ejRibbon(model);
            this.model = model;
            this.element = element;
            if (this.model._isCollapsed)
                this.collapse();
        },
        _setModel: function (options) {
            for (var key in options) {
                switch (key) {
				    case "applicationTab":
					    if(!ej.isNullOrUndefined(options.applicationTab.backstageSettings) && !ej.isNullOrUndefined(options.applicationTab.backstageSettings.pages))
					     this.model.applicationTab.backstageSettings.pages=options.applicationTab.backstageSettings.pages;
					    this.model.enableOnDemand ? this._createAppTabOnDemand() : this._createApplicationTab();
						break;
                    case "selectedItemIndex":
                        if (this.model.selectedItemIndex > 0 && this._tabObj.model.disabledItemIndex.indexOf(this.model.selectedItemIndex) === -1 && (this._ribbonTabs.eq(this.model.selectedItemIndex).is(':visible') || (this._responsiveTabText.eq(!ej.isNullOrUndefined(ej.isNullOrUndefined(this.model.applicationTab)) ? this.model.selectedItemIndex - 1 : this.model.selectedItemIndex).is(":visible"))))
                            this._tabObj.option({ selectedItemIndex: this.model.selectedItemIndex });
                        break;
                    case "disabledItemIndex":
                        var conParent, disableLen = this.model.disabledItemIndex.length;
                        var curDisabled = this.model.disabledItemIndex, aTag = this.element.find('.e-link'), activeTab;
                        this.model.disabledItemIndex.push(0);
                        this._tabObj.option({ disabledItemIndex: this.model.disabledItemIndex });
                        for (var k = 0; k < disableLen; k++) {
                            conParent = this._ribbonTabs.eq(curDisabled[k]).parent().parent();
                            if (conParent.hasClass('e-contextli') || conParent.hasClass('e-contextliset'))
                                conParent.addClass("e-disable");
                            if (this._tabObj.model.selectedItemIndex != 0 && this._tabObj.model.selectedItemIndex === curDisabled[k]) {
                                activeTab = aTag.eq(curDisabled[k]).attr("href");
                                $(activeTab).append(this.element.find("#" + this._id + "_disabled"));
                                $(activeTab).css("position", "relative");
                                this.element.find("#" + this._id + "_disabled").show();
                            }
                        }
                        break;
                    case "enabledItemIndex":
                        var conParent, enableLen = this.model.enabledItemIndex.length, conTabs = this._tabUl.find(".e-contextualtabset");
                        this._ribbonTabs = this._ribbonTabs.not("span,.e-ribresmenu,.e-responsiveqat");
                        for (var k = 0; k < enableLen; k++) {
                            if (this.model.enabledItemIndex[k] === 0 || !(this._ribbonTabs.eq(this.model.enabledItemIndex[k]).is(':visible'))) {
                                this.model.enabledItemIndex.splice(k, 1);
                                --enableLen;
                                --k;
                            }
                        }

                        this._conTabsRemove();
                        this._tabObj.option({ enabledItemIndex: this.model.enabledItemIndex });
                        this._contextualTabs();
                        var enableItemLen = this.model.enabledItemIndex.length;
                        for (var i = 0; i < enableItemLen; i++) {
                            this._tabText.eq(this.model.enabledItemIndex[i]).parent().removeClass("e-disable");
                            this._tabText.eq(this.model.enabledItemIndex[i]).parent().css("position", "");
                            conParent = this._ribbonTabs.eq(this.model.enabledItemIndex[i]).parent().parent();
                            if (conParent.hasClass('e-contextli') || conParent.hasClass('e-contextliset'))
                                conParent.removeClass("e-disable");
                            if (this.model.enabledItemIndex[i] == this._tabObj.model.selectedItemIndex)
                                this.element.find("#" + this._id + "_disabled").hide();
                        }
                        var conTabsLen=conTabs.length;
                        for (var j = 0; j < conTabsLen; j++) {
                            if ($(conTabs[j]).hasClass('e-disable'))
                                $(conTabs[j]).parents(".e-contextliset").addClass('e-disable');
                        }
                        break;
                    case "allowResizing":
                        this._ribbonWindowResize();
                        break;
                    case "isResponsive":
                        this._ribbonWindowResize();
                        break;
                    case "width":
                        this.element.width(options[key]);
                        this._ribbonWindowResize();
                        break;
                    case "enableRTL":
                        this.model.enableRTL = options[key];
                        var model = this.model, element = this.element;
                        if (this.element.data("ejTab")) {
                            this.element.data("ejTab")._destroy();
                            this.element = element, this.model = model;
                        }
                        this.element.ejRibbon("destroy");
                        $("#" + this._id).ejRibbon(model);
                        this.model = model;
                        this.element = element;
                        break;
                    case "locale":
                        this.model.locale = options[key];
                        this._ribbonRerender();
                        break;
                    case "cssClass": this._changeSkin(options[key]); break;
                }
            }
        },

        _changeSkin: function (skin) {
            this._tabObj.option('cssClass', skin);
        },

        _setTabContentHeight: function () {
            this.element.find(".e-ribGroupContent").height("auto");
            var maxGrpHeight = 0, tabContent = this.element.find('.e-content.e-content-item'), ctrlSeparatorCol, ctrlSeparatorLen, ribParent;
            ribParent = $("#" + this._id).parents();
            $(tabContent).addClass('e-content-show');
            if ($("#" + this._id).is(":hidden"))
                $("#" + this._id).addClass('e-ribbon-show');
            for (var i = 0; i < ribParent.length; i++) {
                if (ribParent.eq(i).is(':hidden'))
                    ribParent.eq(i).addClass('e-ribbon-show');
            }
            ctrlSeparatorCol = this.element.find('.e-separatordivrow'), ctrlSeparatorLen = ctrlSeparatorCol.length;
            for (var i = 0; i < ctrlSeparatorLen; i++)
                $(ctrlSeparatorCol).eq(i).height($(ctrlSeparatorCol).eq(i).prev().height());
            this.element.find('.e-ribGroupContent').each(function () {
                maxGrpHeight = Math.max(maxGrpHeight, $(this).height());
            });
            this.element.find(".e-ribGroupContent").height(maxGrpHeight);
            $(tabContent).removeClass('e-content-show');
            if ($("#" + this._id).hasClass('e-ribbon-show')) {
                this._ribbonResize();
                $(".e-ribbon-show").removeClass('e-ribbon-show');
            }
        },

        _init: function () {
            if (!ej.isNullOrUndefined(this.element)) {
                this._cloneElement = this.element.clone();
                this._trigger("load");
                this._render();
                this._wireEvents();
            }
        },
        _render: function () {
		    if(this.model.enableOnDemand && $.isFunction($.fn.ejWaitingPopup)){
               this.element.ejWaitingPopup({ showOnInit: false });
               $("#" + this._id + "_WaitingPopup").addClass("e-ribbonwaitingpopup");
			}
		    if (this.model.disabledItemIndex.length == 0) 
		        this.model.disabledItemIndex.push(0);
            this._renderTab();
            if (this.model.showQAT) {
                var quickAccessBar = ej.buildTag("div.e-rbnquickaccessbar").click($.proxy(this._onQatClick, this));
                if (this.model.showBelowQAT) {
                    quickAccessBar.removeClass("e-rbnabove").addClass("e-rbnbelow");
                    this.element.append(quickAccessBar).addClass('e-rbnwithqatbelow');
                }
                else {
                    quickAccessBar.removeClass("e-rbnbelow").addClass("e-rbnabove");
                    this.element.prepend(quickAccessBar).addClass('e-rbnwithqatabove');
                }
                this.element.addClass('e-rbnwithqat');
            }
            this._initPrivateProperties();
            this.model.enableOnDemand ? (!this.model.collapsible ? (this._groupContent(), this.element.find(".e-header").addClass("e-rbnondemand"), this._createQAT()) : this._createQAT()) : (this._groupingControls(), this._createQAT());
            this._initial = true;
            this._customization();
            this._initialRender = true;
            if (this.model.collapsible)
                this.collapse();
            this._ribbonResponsive();
            this._responsiveTabText = this.element.find(".e-responsivetabheader li");
            if (this._phoneMode)
                this._ribbonWindowResize();
            this._tabObj.initialRender = false;
            this.element.append(ej.buildTag("div#" + this._id + "_disabled"));
            this.element.append(ej.buildTag("div#" + this._id + "_modelDiv"));
            var content = this.element.find(".e-content");
            this.element.find("#" + this._id + "_disabled").height(this.element.find(".e-active-content").height()).width(this.model.width);
            this.element.find("#" + this._id + "_disabled").css({ top: 0, left: 0, position: "absolute" }).addClass("e-disable");
            this.element.find("#" + this._id + "_disabled").hide();
            this.element.find("#" + this._id + "_modelDiv").height($(content).height()).width(this.model.width);
            this.element.find("#" + this._id + "_modelDiv").css({ top: 0, left: 0, position: "absolute" }).addClass("e-modelDiv");
            this.element.find("#" + this._id + "_modelDiv").hide();
            var resizeDiv = ej.buildTag("div#" + this._id + "_resize").addClass("e-resizediv").hide().click($.proxy(this._onResizeDivClick, this));
            this.element.append(resizeDiv);
            var toolTipDiv = ej.buildTag("div#" + this._id + "_tooltip").addClass("e-tooltipdiv").hide();
            var title = ej.buildTag("div#" + this._id + "_toolTip_title").addClass('e-tooltiptitle');
            var description = ej.buildTag("div#" + this._id + "_toolTip_Desc").addClass('e-tooltipdesc');
            toolTipDiv.append(title);
            toolTipDiv.append(description);
            this.element.append(toolTipDiv);
             if (this._applicationTab.hasClass('e-active') && !ej.isNullOrUndefined(this.model.tabs[0].id)) {
			 this._applicationTab.removeClass("e-active");
             this.element.find('.e-content.e-content-item').remove();
                this._tabUl.find('.e-expandcollapse').remove();
           }
            var emptyTabContent = this.element.find('.e-empty-content'), firstGroupDiv = this.element.find('.e-groupdiv').eq(0);
            if ($(emptyTabContent).length > 0 && $(firstGroupDiv).length > 0)
                $(emptyTabContent).height($(firstGroupDiv).parent().height());
            this.element.find(".e-rbncustomelement,.e-backstagetabarea,.e-gallerymenu").show();
        },
        _createQuickAccessBar: function () {
            if (this.model.showQAT) {
                var qatSplitBtnDiv = ej.buildTag("div.e-splitbtnqatdiv").attr('title', this.localizedLabels.CustomizeQuickAccess), qatSplitBtn = ej.buildTag("button#" + this._id + "_" + "qatsplitbtn").addClass("e-splitbtnqat e-rbn-button"), qatPopup;
                qatSplitBtnDiv.append(qatSplitBtn.ejButton({
                    size: "normal",
                    type: "button",
                    contentType: "imageonly",
                    height: 30,
                    width: 14,
                    prefixIcon: "e-icon e-ribbon e-qatexpand",
                    click: $.proxy(this._onQatExpandBtnClick, this)
                }));
                this._qAccessBar.append(qatSplitBtnDiv);
                qatPopup = ej.buildTag("ul.e-rbnqatmenu", "<div>" + this.localizedLabels.CustomizeQuickAccess + "</div>").click($.proxy(this._onQatMenuClick, this));
                var qatColtrolLen = this._qatControlsName.length;
                for (var i = 0; i < qatColtrolLen; i++) {
                    var qatPopupEle = ej.buildTag("li#" + this._qatControlsName[i].id + "_menuli" + ".e-qatmenuli e-removemenuli", "<p>" + this._qatControlsName[i].text + "</p>").appendTo(qatPopup).attr("title", this.localizedLabels.RemoveFromQuickAccessToolbar);
                    if (this._qatControlsName[i].qAccess == "menu")
                        qatPopupEle.addClass('e-addmenuli').removeClass('e-removemenuli').attr("title", this.localizedLabels.AddToQuickAccessToolbar);
                }
                var qatLi = "";
                if (this.model.showBelowQAT)
                    qatLi = "<li class='e-rbnshowabove e-qatmenuli'>" + this.localizedLabels.ShowAboveTheRibbon + "</li>";
                else
                    qatLi = "<li class='e-rbnshowbelow e-qatmenuli'>" + this.localizedLabels.ShowBelowTheRibbon + "</li>";
                qatPopup.append("<li class='e-qatmenuli e-qatseparator'></li><li class='e-qatmorecommands e-qatmenuli' title=" + this.localizedLabels.CustomizeQuickAccess + ">" + this.localizedLabels.MoreCommands + "</li>" + qatLi);
                this._qAccessBar.append(qatPopup.hide());
            }
        },
        _tooltip: function (e) {
            var control = this.element.find('.e-controlclicked');
            if (control.length <= 0 || $(control).find('.e-ribbonbtn').length > 0) {
                if (this.element.find("#" + e.data.ribbonId + "_resize").is(':visible') || this.element.find('.e-gallexpandcontent').is(':visible')) {
                    if ($(e.target).parents(".e-resizediv").length > 0 || $(e.target).parents('.e-gallexpandcontent').length > 0)
                        this._toolTipShow(e);
                }
                else
                    this._toolTipShow(e);
            }
        },
        _toolTipShow: function (e) {
            var toolTipDiv = this.element.find("#" + e.data.ribbonId + "_tooltip"), control, controlOffset, tipTop, resizeDiv, tipDesc, tipTitle, expandContent, title, cntOverflow, ribHeight, activeContent;
            if (toolTipDiv.find('.e-tooltiptitle').length <= 0) {
                title = ej.buildTag("div#" + e.data.ribbonId + "_toolTip_title").addClass('e-tooltiptitle');
                toolTipDiv.prepend(title);
            }
            toolTipDiv.removeClass("e-tooltipdivwithimg");
            tipTitle = toolTipDiv.find('.e-tooltiptitle');
            tipTitle.children().remove();
            if ($(e.target).is("li"))
                return;
            var tipValue;
            if ($(e.target).hasClass('e-rarrowup-2x') && !ej.isNullOrUndefined(this.model.expandPinSettings.toolTip))
                $($(e.target).parent()).attr("title", this.model.expandPinSettings.toolTip);
            if ($(e.target).hasClass('e-rarrowup-2x') && (!ej.isNullOrUndefined(this.model.expandPinSettings.customToolTip.title) || !ej.isNullOrUndefined(this.model.expandPinSettings.customToolTip.content)))
                tipValue = e.data.value.expandObj;
            if ($(e.target).hasClass('e-ribbonpinicon') && !ej.isNullOrUndefined(this.model.collapsePinSettings.toolTip))
                $($(e.target).parent()).attr("title", this.model.collapsePinSettings.toolTip);
            else if ($(e.target).hasClass('e-ribbonpinicon') && (!ej.isNullOrUndefined(this.model.collapsePinSettings.customToolTip.title) || !ej.isNullOrUndefined(this.model.collapsePinSettings.customToolTip.content)))
                tipValue = e.data.value.collapseObj;
            else if (!$(e.target).hasClass('e-rarrowup-2x') && !$(e.target).hasClass('e-ribbonpinicon'))
                tipValue = e.data.value;
            if (!ej.isNullOrUndefined(tipValue) && !ej.isNullOrUndefined(tipValue.customToolTip) && !ej.isNullOrUndefined(tipValue.customToolTip.title))
                tipTitle.append(tipValue.customToolTip.title);
            else
                tipTitle.remove();

            if (!ej.isNullOrUndefined(tipValue) && !ej.isNullOrUndefined(tipValue.customToolTip) && !ej.isNullOrUndefined(tipValue.customToolTip.content)) {
                if (tipTitle.children().length <= 0)
                    tipTitle.empty().append("<b>" + tipValue.customToolTip.title + "</b>");
                tipDesc = toolTipDiv.find('.e-tooltipdesc');
                tipDesc.children().remove();
                tipDesc.append(tipValue.customToolTip.content);
                if (tipDesc.children().length <= 0)
                    tipDesc.empty().append("<h6>" + tipValue.customToolTip.content + "</h6>");
                if (!ej.isNullOrUndefined(tipValue) && !ej.isNullOrUndefined(tipValue.customToolTip.prefixIcon)) {
                    tipDesc.prepend("<span class=e-tooltipimg></span>");
                    tipDesc.find('.e-tooltipimg').addClass(tipValue.customToolTip.prefixIcon);
                    tipDesc.children().not('.' + tipValue.customToolTip.prefixIcon).addClass('e-tooltipcntwithimg');
                    toolTipDiv.addClass("e-tooltipdivwithimg");
                }
                else
                    tipDesc.children().addClass('e-tooltipcontent');
            }
            if (ej.isNullOrUndefined(tipValue))
                return;
            controlOffset = this.element.find("#" + e.delegateTarget.id).offset();
            control = this.element.find("#" + e.delegateTarget.id);
            toolTipDiv.stop(true).delay(700).show(0).addClass("e-rbntooltipshadow");
            resizeDiv = this.element.find("#" + e.data.ribbonId + "_resize");
            expandContent = $(e.target).parents('.e-gallexpandcontent');
            this.element.css({ 'position': 'relative' });
            cntOverflow = (this.element.width() + this.element.offset().left) - (controlOffset.left + parseInt($(toolTipDiv).width(), 10));
            if (cntOverflow <= 0)
                controlOffset.left = controlOffset.left + cntOverflow - this.element.offset().left;
            else
                controlOffset.left = controlOffset.left - this.element.offset().left;
            activeContent = this.element.find('.e-active-content').eq(0);
            if (activeContent.is(":visible"))
                ribHeight = this._tabUl.height() + activeContent.height();
            else
                ribHeight = this._tabUl.height();
            if (resizeDiv.is(':visible') && !expandContent.is(':visible')) {
                toolTipDiv.offset({ left: controlOffset.left });
                if (control.parents('.e-galleryrow').length > 0)
                    tipTop = ribHeight + control.position().top + control.parents('.e-galleryrow').height();
                else
                    tipTop = ribHeight + control.position().top + control.height();
                toolTipDiv.css({ 'top': tipTop });
            }
            else if (expandContent.is(':visible')) {
                var galRow;
                if (control.parents('.e-galleryrow').length > 0)
                    galRow = control.parents('.e-galleryrow');
                else if (control.parents('.e-galleryexpanderrow').length > 0)
                    galRow = control.parents('.e-galleryexpanderrow');
                else
                    galRow = control;
                if ($(expandContent).parents('.e-resizediv').length > 0)
                    tipTop = galRow.height() + ribHeight + control.position().top + 12;
                else
                    tipTop = galRow.height() + this._tabUl.height() + control.position().top + 12;
                toolTipDiv.offset({ left: controlOffset.left });
                toolTipDiv.css({ 'top': tipTop });
            }
            else {
                if ($(e.target).parents('.e-qatooldiv').length > 0 || $(e.target).hasClass('e-qatooldiv')) {
                    var qaResizeDiv = this.element.find('.e-qaresizediv'), qAccessBar = this.element.find('.e-rbnquickaccessbar');
                    if (qAccessBar.hasClass('e-rbnabove') && qaResizeDiv.length > 0) {
                        if (qaResizeDiv.is(':visible'))
                            toolTipDiv.offset({ top: qaResizeDiv.height() + qAccessBar.height() + 4, left: controlOffset.left });
                    }
                    else if (qAccessBar.hasClass('e-rbnabove'))
                        toolTipDiv.offset({ top: qAccessBar.height() + 4, left: controlOffset.left });
                    else {
                        if (qaResizeDiv.is(':visible'))
                            tipTop = qAccessBar.height() + qaResizeDiv.height() + ribHeight + 4;
                        else
                            tipTop = ribHeight + qAccessBar.height() + 4;
                        toolTipDiv.offset({ top: tipTop, left: controlOffset.left });
                    }
                }
                else {
                    tipTop = ribHeight + 3;
                    toolTipDiv.offset({ top: tipTop, left: controlOffset.left });
                }
            }
        },
        _toolTipOut: function (e) {
            var toolTipDiv = this.element.find("#" + e.data.ribbonId + "_tooltip");
            toolTipDiv.hide(0);
            toolTipDiv.css({ top: '', left: '' });
            toolTipDiv.find('.e-tooltiptitle').children().remove();
            toolTipDiv.find('.e-tooltipdesc').children().remove();
        },
        _responsiveScrollRemove: function () {
            var scroll = this.element.find(".e-active-content .e-responsiveScroll");
            var contentScroll = this.element.find(".e-rescontentScroll");
            if (contentScroll.length > 0) {
                contentScroll.data("ejScroller")._destroy();
                contentScroll.parent().append(contentScroll.find("div:first").children());
                contentScroll.remove();
            }
            if (scroll.length > 0) {
                scroll.data("ejScroller")._destroy();
                this.element.find(".e-active-content").append(scroll.find("div:first").children());
                scroll.remove();
            }
        },
        _onGroupClick: function (args) {
            this._toolTipCustomization(args);var parentElem = $(args.target).parents('.e-resizebtnselect');
            this.element.find('.e-resizebtnselect').removeClass('e-resizebtnselect e-active');
            var resizeDiv = $(args.target).parents('.e-resizediv');
            if ($(args.target).hasClass('e-resizebtnselect'))
                $(args.target).removeClass('e-resizebtnselect e-active');
            else {
                if (parentElem.length > 0)
                    parentElem.removeClass('e-resizebtnselect e-active');
                else {
                    parentElem = $(args.target).parents('.e-resizebtn');
                    if (parentElem.length > 0)
                        parentElem.addClass('e-resizebtnselect e-active');
                    else if ($(args.target).hasClass('e-resizebtn'))
                        $(args.target).addClass('e-resizebtnselect e-active');
                }
            }
            if (this.model.showQAT && !$(args.target).parents(".e-mobdiv").length > 0) {
                if ($(args.target).hasClass('e-togglebutton e-btn') || $(args.target).parents('.e-togglebutton.e-btn').length > 0) {
                    var tBtnId, target = $(args.target);
                    if ($(args.target).parents('.e-togglebutton.e-btn').length > 0)
                        target = $(args.target).parents('.e-togglebutton.e-btn');
                    if (this._QATclick)
                        tBtnId = target.parent().find("input").attr("id") + "_mobEle";
                    else
                        tBtnId = target.parent().find("input").attr("id") + "_qatEle";
                    if ($('.e-ribbon.e-rbnwithqat').find("#" + tBtnId).length > 0)
                        this._rbnToggleBtnCustomization(args, tBtnId);
                }
            }
            if (!this._phoneMode) {
                if (resizeDiv.length <= 0) {
                    if ($(args.target).hasClass('e-resizebtn'))
                        resizeDiv = $(args.target);
                    else if (!ej.isNullOrUndefined($(args.target).parents('.e-resizebtn')))
                        resizeDiv = $(args.target).parents('.e-resizebtn');
                }
                if (this.element.find('.e-resizediv').is(':visible') && this.element.find('.e-resizediv .e-gallexpandcontent').is(':visible')) {
                    if ($(args.target).hasClass('e-gallerymoveicon') || $(args.target).hasClass('e-gallerymovediv') || $(args.target).hasClass('e-expgallerydiv') || $(args.target).hasClass('e-scrollbar') || $(args.target).parents().hasClass('e-scrollbar'))
                        expClick = args.target;
                    else if ($(args.target).parents().hasClass('e-gallerymenu')) {
                        if ($(args.target).hasClass('e-haschild') || $(args.target).hasClass('aschild') || $(args.target).hasClass('e-arrows'))
                            expClick = args.target;
                    }
                    if (ej.isNullOrUndefined(expClick)) {
                        this._ribbonGalleryShow();
                        this.element.find('.e-resizediv').show().css('visibility', '');
                        this.element.find('.e-resizediv .e-gallexpandcontent').hide().css('visibility', '');
                    }
                }
                else if (resizeDiv.length <= 0) {
                    if ((!$(args.target).parents(".e-content").length > 0 && $(args.target).parents(".e-rbn-ddl").length > 0) || $(args.target).parents(".e-rbn-splitbtn").length > 0 || $(args.target).parents(".e-presetWrapper").length > 0 || $(args.target).parents(".e-ribbonpopup").length > 0 || $(args.target).parents('.e-colorpicker.e-ribbon:visible').length > 0)
                        return false;
                    else
                        this._resizeDivHide();
                }
                else {
                    if ($(resizeDiv).hasClass('e-resizebtn')) {
                        if (this.element.find('.e-resizediv').is(":visible")) {
                            if (resizeDiv.parent().siblings('.e-contentbottom').length <= 0)
                                this._resizeDivHide();
                            else {
                                this._resizeDivHide();
                                this._resizeDivShow(resizeDiv);
                            }
                        }
                        else
                            this._resizeDivShow(resizeDiv);
                    }
                }
            }
            if (this._phoneMode) {
                var activeContent = this.element.find(".e-active-content"), activeContentHeight = 0, toolbarscroll, scrollHeightCheck, activeContents;
                var target = args.target;
                if ($(target).hasClass("e-groupresponsive e-ribdownarrow")) {
                    toolbarscroll = activeContent.find(".e-resptoolbarScroll .e-scrollbar").height();
                    activeContents = activeContent.children(".e-groupdiv,.e-groupmobdiv");
                    for (var i = 0; i < activeContents.length; i++) 
                        activeContentHeight += activeContents.eq(i).outerHeight();
                    activeContentHeight += ej.isNullOrUndefined(toolbarscroll) ? 0 : toolbarscroll;
                    scrollHeightCheck = activeContent.find(".e-respmobcontent").length > 0 ? activeContentHeight - activeContent.find(".e-respmobcontent").outerHeight() > this._responsiveHeight : activeContentHeight > this._responsiveHeight;
                    activeContent.height(scrollHeightCheck ? activeContent.find(".e-respmobcontent").length > 0 ? this._responsiveHeight + activeContent.find(".e-respmobcontent").outerHeight() : this._responsiveHeight : activeContentHeight).removeClass("e-responsiveheight e-rbnmobheader e-responsiveToolbarScroll");
                    if (scrollHeightCheck) {
                        var div = ej.buildTag("div#" + this._id + "_responsiveScroller").addClass("e-responsiveScroll").append(ej.buildTag("div"));
                        if (activeContent.find(".e-respmobcontent").length > 0)
                            div.find("div").append(activeContent.children().eq(0).siblings());
                        else
                            div.find("div").append(activeContent.children());
                        activeContent.append(div);
                        activeContent.find(".e-responsiveScroll").ejScroller({ height: this._responsiveHeight, scrollerSize: 8, buttonSize: 0 });
                    }
                    $(target).removeClass("e-ribdownarrow").addClass("e-ribuparrow");
                    $(target).parents(".e-groupdiv").find(".e-ribdownarrow").removeClass("e-ribdownarrow").addClass("e-ribuparrow");
                }
                else if ($(target).hasClass("e-groupresponsive e-ribuparrow")) {
                    activeContent.addClass("e-responsiveheight e-rbnmobheader");
                    if (activeContent.find(".e-resptoolbarScroll").length > 0)
                        activeContent.addClass("e-responsiveToolbarScroll");
                    this._responsiveScrollRemove();
                    $(target).removeClass("e-ribuparrow").addClass("e-ribdownarrow");
                }
                else if (this.element.find(".e-responsivecontent").is(":hidden")) {
                    if ($(target).hasClass("e-resizebtn") || $(target).parents(".e-resizebtn").length > 0 || $(target).hasClass("e-groupresponsive e-ribrightarrow") || $(target).hasClass("e-ribrightdivarrow")){
                        if ($(target).hasClass("e-resizebtn")) {
                            this._responsiveTarget = $(target).parents(".e-groupdiv");
                            this._responsiveContent = $(target).parent().siblings();
                        }
                        else if ($(target).parents(".e-resizebtn").length > 0) {
                            this._responsiveTarget = $(target).parents(".e-resizebtn").parents(".e-groupdiv");
                            this._responsiveContent = $(target).parents(".e-resizebtn").parent().siblings();
                        }
                        else if ($(target).hasClass("e-groupresponsive e-ribrightarrow") || $(target).hasClass("e-ribrightdivarrow")) {
                            var resParent = $(target).parents(".e-resizegroupdiv").find(".e-resizebtn")
                            if (resParent.length > 0) {
                                this._responsiveTarget = resParent.parents(".e-groupdiv");
                                this._responsiveContent = resParent.parent().siblings();
                            }
                        }
                    var resizeContent = this._responsiveContent.eq(0).removeClass("e-reshide");
                    var responsivecontent = this.element.find(".e-content.e-responsivecontent");
                    responsivecontent.children().not(".e-responsiveback").remove();
                    responsivecontent.append(resizeContent);
                    this.element.find(".e-restopbackcontent").text(this._responsiveTarget.find(".e-resizebtn .e-btntxt").text());
                    var gallery = responsivecontent.find(".e-ribbongallery");
                    if (gallery.length > 0) {
                        var expcolumns = this._responsiveGallery;
                        var rowLen = Math.floor(gallery.find('.e-galleryrow').children().length / expcolumns);
                        if (gallery.find('.e-galleryrow').children().length % expcolumns > 0)
                            ++rowLen;
                        for (var m = 1; m <= rowLen; m++) {
                            var galleryExpanderRow = ej.buildTag("div#" + gallery.attr("id") + "_galleryExpanderRow_" + m).addClass('e-galleryexpanderrow').click({ model: gallery }, $.proxy(this._onGalleryItemClick, this));
                            for (var n = 0; n < expcolumns; n++)
                                gallery.find('.e-galleryrow').children().eq(0).appendTo(galleryExpanderRow);
                            galleryExpanderRow.appendTo(responsivecontent.parent().find('.e-expandercontent'));
                        }
                        gallery.hide();
                        responsivecontent.parent().find(".e-gallexpandcontent").show();
                    }
                    this._responsiveContentShow(responsivecontent);
                }
                }
            }
            var groupIndex = $(args.target).hasClass("e-groupdiv") ? $(args.target).index() : $(args.target).parents(".e-groupdiv").index();
            if (groupIndex != -1)
                args.groupItems = this._groupClickEventArgs(groupIndex, args);
            if ($(args.target).parents('.e-ribbongallerycontrol').length === 0) {
                this._trigger("groupClick", args);
                if (!args.cancel && ej.raiseWebFormsServerEvents && !ej.isNullOrUndefined(this.model.serverEvents)) {
                    if (this.model.serverEvents.indexOf("groupClick") != -1) {
                        var modelRibbon = $.extend(true, {}, this.model), controlId;
                        controlId = (args.target.id) ? args.target.id : args.target.parentNode.id;
                        var argsRibbon = { model: modelRibbon, originalEventType: "groupClick", id: controlId };
                        var clientArgs = { model: modelRibbon, id: controlId };
                        ej.raiseWebFormsServerEvents("groupClick", argsRibbon, clientArgs);
                    }
                }
            }

        },
        _groupClickEventArgs: function (groupIndex, args) {
            var activeTab = this._tabUl.find(".e-active");
            var tabIndex = activeTab.index(), currentGrp;
            if (this._phoneMode && $(args.target).parents(".e-groupdiv").siblings(".e-groupmobdiv").length > 0)
                groupIndex -= 1;
            if (!ej.isNullOrUndefined(this.model.applicationTab) && !activeTab.hasClass("e-contextualtabset"))
                tabIndex = tabIndex - 1;
            if (!(tabIndex < 0)) {
                var tab;
                if (!activeTab.hasClass("e-contextualtabset"))
                    tab = this.model.tabs[tabIndex];
                else
                    tab = this.model.contextualTabs[activeTab.parents(".e-contextual").index()].tabs[tabIndex];
                if (!ej.isNullOrUndefined(tab)) currentGrp = tab.groups[groupIndex];
                return currentGrp;
            }
        },
        goToMainContent: function () {
            var responsiveBackstage = this.element.find(".e-responsivebackstage"), respTabHeader = this.element.find(".e-responsivetabheader"), args = {};
            var content = this.element.find(".e-active-content");
            var responsebackstage = this.element.find(".e-responsivebackstage");
            var respBackStageContent = this.element.find(".e-responsivebackstagecontent");
            respTabHeader.removeClass("e-resshow");
            if (responsiveBackstage.is(":visible"))
                responsiveBackstage.removeClass("e-backstageshowanimate").addClass("e-reshide");
            if (respBackStageContent.is(":visible")) 
                respBackStageContent.hide();
            if (this.element.find(".e-responsivecontent").is(":visible"))
                this._responsiveContentBack();
            if (!content.hasClass("e-responsiveheight")) {
                content.addClass("e-responsiveheight e-rbnmobheader");
                this._responsiveScrollRemove();
                content.find(".e-groupresponsive.e-ribuparrow").removeClass("e-ribuparrow").addClass("e-ribdownarrow");
                args.type = "collapse";
                this._trigger("collapse", args);
            }
            if (respTabHeader.hasClass("e-resshow"))
                respTabHeader.removeClass("e-resshow");
        },
        _onResizeDivClick: function (args) {
            this._toolTipCustomization(args);
            if (this.model.showQAT) {
                if ($(args.target).hasClass('e-togglebutton e-btn') || $(args.target).parents('.e-togglebutton.e-btn').length > 0) {
                    var tBtnId, target = $(args.target);
                    if ($(args.target).parents('.e-togglebutton.e-btn').length > 0)
                        target = $(args.target).parents('.e-togglebutton.e-btn');
                    tBtnId = target.parent().find("input").attr('id') + "_qatEle";
                    this._rbnToggleBtnCustomization(args, tBtnId);
                }
            }
            if (this._phoneMode) {
                if ($(args.target).hasClass('e-togglebutton e-btn') || $(args.target).parents('.e-togglebutton.e-btn').length > 0) {
                    var tBtnId, target = $(args.target);
                    if ($(args.target).parents('.e-togglebutton.e-btn').length > 0)
                        target = $(args.target).parents('.e-togglebutton.e-btn');
                    tBtnId = target.parent().find("input").not(".e-active").attr("id") + "_mobEle"
                    this._rbnToggleBtnCustomization(args, tBtnId);
                }
                if ($(args.target).hasClass("e-ribleftarrow")) {
                    this._responsiveContentBack();
                }
            }
            if ($(args.currentTarget).find(".e-ribGroupContent").length > 0) {
                var resizedDiv = $(args.currentTarget).find(".e-ribGroupContent").attr("id").split("_");
                var groupIndex = this.element.find("#" + resizedDiv[0] + '_' + resizedDiv[1] + '_' + resizedDiv[2]).index();
                if (this._phoneMode && groupIndex > 0 && this.element.find("#" + resizedDiv[0] + '_' + resizedDiv[1] + '_' + resizedDiv[2]).siblings(".e-groupmobdiv").length > 0)
                    groupIndex -= 1;
                if (groupIndex != -1)
                    args.groupItems = this._groupClickEventArgs(groupIndex,args);
            }
            args.targetElement = "resizedGroup";
            this._trigger("groupClick", args);
        },
        _toolTipCustomization: function (args) {
            var control = $(args.target).parents('.e-controlpadding');
            if ($(control).find('.e-ribbongallerycontrol').length <= 0 && $(args.target).find('.e-disable').length <= 0 && (!$(args.target).hasClass('e-disable'))) {
                this.element.find(".e-tooltipdiv").hide(0);
                if ($(control).hasClass('e-controlclicked'))
                    $(control).removeClass('e-controlclicked');
                else
                    $(control).addClass('e-controlclicked');
            }
        },
        _onTabClick: function (args) {
            this._trigger("beforeTabClick", args);
            if(this.model.enableOnDemand){ 
             if ($("#" + this._id + "_WaitingPopup").is(":hidden") &&  this.element.find(".e-content.e-content-item").eq(args.activeIndex).children().length==0)
              this.element.ejWaitingPopup("show");
			 this._groupContent(args);
			}
            var expandCollapse = this.element.find('.e-rarrowup-2x'), active = this._tabUl.find('li.e-active');
            var collapse = this.element.find('.e-collapseactive'), aTag, href;
            var activeContent = this.element.find('.e-active-content').eq(0);
            if (this._phoneMode) {
                this._responsiveScrollRemove();
                this.element.find(".e-mobribgroupactive").removeClass("e-mobribgroupactive");
                var tabactiveIndex = args.activeIndex;
                var ribActiveContent = this.element.find(".e-content.e-content-item").eq(tabactiveIndex);
                var tab = this._tabUl.children(".e-tab").index(args.activeHeader);
                if (ej.isNullOrUndefined(this.model.applicationTab)) {
                    --args.activeIndex; --args.prevActiveIndex;
                }
                this.element.find(".e-content.e-content-item").eq(args.prevActiveIndex).removeClass("e-responsiveheight e-rbnmobheader");
                this.element.find(".e-content.e-content-item").eq(args.activeIndex).addClass("e-responsiveheight e-rbnmobheader");
                this.element.find(".e-responsivecontent").is(":visible") && this.element.find(".e-responsivecontent").hasClass("e-resshow") && this.element.find(".e-responsivecontent").removeClass("e-resshow");
                if (!ej.isNullOrUndefined(this._responsiveContent))
                    this._responsiveTarget.append(this._responsiveContent).css(this._responsiveContentStyle);
                if (tab != -1) {
                    if (this._mobileContents[tab].mobileContent.length > 0 && !ribActiveContent.find(".e-respmobcontent").length > 0) {
                        ribActiveContent.prepend(ej.buildTag("div#" + this._id + "_mobcontent").addClass("e-respmobcontent e-groupmobdiv").append(ej.buildTag("div#" + this._id + "_mobribgroup").addClass("e-mobribgroup e-mobribgroupactive").append(ej.buildTag("div.e-ribupdivarrow").addClass("e-toolbaralign").append(ej.buildTag("span.e-icon").addClass("e-groupresponsive e-ribdownarrow"))))).click($.proxy(this._onGroupClick, this)).click($.proxy(this._onMobContentClick, this));
                        ribActiveContent.find(".e-resgroupheader").removeClass("e-resgroupheader");
                        for (var i = 0; i < this._mobileToolbar[tab].Content.length; i++)
                            ribActiveContent.find(".e-mobribgroup").append(this._mobileToolbar[tab].Content[i]);
                        ribActiveContent.find(".e-mobribgroup").append(ribActiveContent.find(".e-mobribgroup .e-ribupdivarrow"))
                    }
                }
                if (tab != -1 && this._mobileContents[tab].mobileContent.length > 0 && !ribActiveContent.find(".e-mobribgroup").hasClass("e-mobribgroupactive"))
                    ribActiveContent.find(".e-mobribgroup").addClass("e-mobribgroupactive");
            }
            if (active.length > 0) {
                active.removeClass("e-active");
                active.children().removeClass("e-active");
                activeContent.removeClass("e-active-content").hide();
            }
            else {
                if (collapse.length > 0) {
                    if (args.activeHeader.textContent === collapse.find('.e-link').text()) {
                        collapse.addClass("e-active").removeClass("e-collapseactive");
                        activeContent.removeClass("e-collapse-content").slideDown("fast", "swing", $.proxy(this._ribExpand, this));
                    }
                    else {
                        aTag = this.element.find('.e-link');
                        collapse.removeClass("e-collapseactive");
                        this.element.find('.e-collapse-content').removeClass("e-collapse-content");
                        activeContent.removeClass("e-active-content");
                        href = aTag.eq(args.activeIndex).attr("href");
                        aTag.eq(args.activeIndex).addClass("e-active");
                        $(href).slideDown("fast", "swing", $.proxy(this._ribExpand, this));
                    }
                }
            }
            if (expandCollapse.length > 0 && this.element.find(".e-collapsed").length > 0)
                this._addRibbonPin();
            if (!this._initialRender)
                this._trigger("tabClick", args);
            this._clickValue = "click";
          
        },
        _onTabSelect: function (args) {
            if (this.model.enableOnDemand){
			 if (this._initialRender && $("#" + this._id + "_WaitingPopup").is(":hidden"))
              this.element.ejWaitingPopup("show");
             this._setTabContentHeight();
			}
            var active = this.element.find('li.e-active'), aTag, href, disable, expCollapse = this.element.find('.e-expandcollapse');
            this.model.selectedItemIndex = args.activeIndex;
            if (!active.hasClass("e-disable")) {
                aTag = this.element.find('.e-link');
                href = aTag.eq(args.activeIndex).attr("href");
                disable = $(href).find("#" + this._id + "_disabled");
                if (disable)
                    this.element.find("#" + this._id + "_disabled").hide();
            }
            if (expCollapse.length > 0)
                expCollapse.appendTo(this.element.find('.e-active-content').eq(0));
            if (!this._phoneMode)
                this._ribbonResize();
            if (!this._initialRender) {
                this._trigger("tabSelect", args);
                if ($('.e-menu-wrap').children('.e-split:visible').length > 0)
                    $($('.e-menu-wrap').children('.e-split')).css("display", "none");
                if ($('.e-rbn-ddl').parent(".e-ddl-popup:visible").length > 0)
                    $($('.e-rbn-ddl').parent(".e-ddl-popup:visible")).css("display", "none");
                if ($(".e-popupWrapper").parent(".e-colorpicker.e-ribbon:visible").length > 0)
                    $($(".e-popupWrapper").parent(".e-colorpicker.e-ribbon")).css("display", "none");
                if (ej.isOnWebForms && ej.raiseWebFormsServerEvents && !ej.isNullOrUndefined(this.model.serverEvents)) {
                    if (this.model.serverEvents.indexOf("tabSelect") != -1) {
                        var modelRibbon = $.extend(true, {}, this.model);
                        var argsRibbon = { model: modelRibbon, originalEventType: "tabSelect", activeIndex: args.activeIndex, prevActiveIndex: args.prevActiveIndex };
                        var clientArgs = { model: modelRibbon, activeIndex: args.activeIndex, prevActiveIndex: args.prevActiveIndex };
                        ej.raiseWebFormsServerEvents("tabSelect", argsRibbon, clientArgs);
                    }
                }
            }
            if (this._phoneMode && !this._initialRender)
                this._ribbonWindowResize();
            this._initialRender = false;
			var proxy=this;
			if(this.model.enableOnDemand && $("#" + this._id + "_WaitingPopup").is(":visible")){
			 setTimeout(function () {
               proxy.element.ejWaitingPopup("hide");
			 },300);
			}
        },
        _create: function (args) {
            if(this.model.enableOnDemand) this.element.find(".e-content.e-content-item").addClass("e-rbn-ondemand");
            this._trigger("tabCreate", args);
        },
        _onGalMoveUpClick: function (args) {
            var gallery = this.element.find("#" + args.data.galleryId);
            var prevElem = gallery.find(".e-gallerycontent").children(':visible').first().prev();
            if (this.element.find('.e-gallexpandcontent:visible').length > 0)
                this._ribbonGalleryShow();
            if (prevElem.length > 0) {
                gallery.find(".e-gallerycontent").children(':visible').last().hide();
                prevElem.show().width(gallery.find('.e-galleryrow').first().width());
                if ($(prevElem).hasClass('e-gryfirstrow'))
                    gallery.find(".e-moveupdiv").addClass("e-disablegrymovebtn");
                gallery.find(".e-movedowndiv").removeClass("e-disablegrymovebtn");
            }
        },
        _onGalMoveDownClick: function (args) {
            var gallery = this.element.find("#" + args.data.galleryId);
            var nextElem = gallery.find(".e-gallerycontent").children(':visible').last().next();
            if (this.element.find('.e-gallexpandcontent:visible').length > 0)
                this._ribbonGalleryShow();
            if (nextElem.length > 0) {
                gallery.find(".e-gallerycontent").children(':visible').first().hide();
                nextElem.show().width(gallery.find('.e-galleryrow').first().width());
                if ($(nextElem).hasClass('e-grylastrow'))
                    gallery.find(".e-movedowndiv").addClass("e-disablegrymovebtn");
                gallery.find(".e-moveupdiv").removeClass("e-disablegrymovebtn");
            }
        },
        _onQatMenuItemClick: function (args) {
            var argsMenu = { target: $(args.target), cancel: false, text: $(args.target).text() };
            this._trigger("qatMenuItemClick", argsMenu);
        },
        _onQatResizeBtnClick: function (args) {
            var qaResizeDiv = this.element.find('.e-qaresizediv'), qaResizeBtn = this.element.find('.e-qaresizebtn'), pLeft;
            if (qaResizeBtn.hasClass('e-active'))
                qaResizeBtn.removeClass('e-tbtn e-active');
            else
                qaResizeBtn.addClass('e-tbtn e-active');
            if (qaResizeDiv.is(':hidden')) {
                if (($(args.e.currentTarget).position().left + qaResizeDiv.width()) > this.element.width()) {
                    pLeft = ($(args.e.currentTarget).position().left + qaResizeDiv.width()) - this.element.width();
                    qaResizeDiv.show().css({ left: $(args.e.currentTarget).position().left - pLeft });
                }
                else
                    qaResizeDiv.show().css({ top: this._qAccessBar.height(), left: $(args.e.currentTarget).position().left });
                if (this._qAccessBar.hasClass('e-rbnbelow'))
                    qaResizeDiv.css({ top: this.element.height() });
                else
                    qaResizeDiv.css({ top: this._qAccessBar.height() });
            }
            else
                qaResizeDiv.hide().css({ top: '', left: '' });
        },
        _onQatExpandBtnClick: function (args) {
            var pLeft = 0, expandBtn = this.element.find('.e-splitbtnqat'), qaResizeDiv = this.element.find('.e-qaresizediv'), qaMenu = this.element.find('.e-rbnqatmenu'), target = $(args.e.currentTarget), qaWidth;
            if (expandBtn.hasClass('e-active')) {
                expandBtn.removeClass('e-tbtn e-active');
                qaMenu.hide(); return;
            }
            else
                expandBtn.addClass('e-tbtn e-active');
            if (qaResizeDiv.length > 0 && qaResizeDiv.is(':visible')) {
                qaWidth = (qaResizeDiv.position().left + target.position().left + qaMenu.width());
                if (qaWidth > this.element.width())
                    pLeft = qaWidth - this.element.width();
                qaMenu.show().css({ top: qaResizeDiv.height() - 6, left: (qaResizeDiv.position().left + target.position().left - (pLeft + 6)) });
            }
            else {
                qaWidth = (target.position().left + qaMenu.width());
                if (this.model.enableRTL)
                    qaWidth = this.element.width() - target.offset().left + qaMenu.width()
                if (qaWidth > this.element.width())
                    pLeft = qaWidth - this.element.width();
                if (this.model.enableRTL)
                    qaMenu.show().css({ right: this.element.width() - target.offset().left + this.element.offset().left - target.outerWidth() - (pLeft) });
                qaMenu.show().css({ left: target.position().left - (pLeft) });
                if (this.element.hasClass("e-grpdivhide")) {
                    this.element.removeClass("e-grpdivhide");
                    this.element.find('.e-active-content').eq(0).addClass("e-resdivshow");
                }
            }
        },
        _onQatClick: function (args) {
            if (!this._QATclick)
                this._QATclick = true;
            if (this.model.showQAT) {
                if ($(args.target).hasClass('e-togglebutton e-btn') || $(args.target).parents('.e-togglebutton.e-btn').length > 0) {
                    var tBtnId, target = $(args.target);
                    if ($(args.target).parents('.e-togglebutton.e-btn').length > 0)
                        target = $(args.target).parents('.e-togglebutton.e-btn');
                    tBtnId = target.parents('.e-qatooldiv').attr('id').slice(0, -7);
                    this._rbnToggleBtnCustomization(args, tBtnId);
                }
            }
            this._QATclick = false;
        },
        _onMobContentClick: function (args) {
            if ($(args.target).hasClass('e-togglebutton e-btn') || $(args.target).parents('.e-togglebutton.e-btn').length > 0) {
                var tBtnId, target = $(args.target);
                if ($(args.target).parents('.e-togglebutton.e-btn').length > 0)
                    target = $(args.target).parents('.e-togglebutton.e-btn');
                if (!target.parents('.e-mobdiv').length > 0)
                    return;
                tBtnId = target.parents('.e-mobdiv').attr('id').slice(0, -7);
                this._rbnToggleBtnCustomization(args, tBtnId);
            }
        },
        _rbnToggleBtnCustomization: function (args, tBtnId) {
            var tBtnInput = this.element.find("#" + tBtnId + ":input.e-togglebutton.e-chkbx-hidden"), tBtn = tBtnInput.parent().siblings('.e-togglebutton');
            if (this._rbnToggleBtnAction && tBtnInput.length > 0) {
                var tBtnClick, tBtnObj;
                this._rbnToggleBtnAction = false;
                tBtnObj = tBtnInput.data("ejToggleButton");
                tBtnClick = tBtnObj.model.click;
                tBtnObj.model.click = "";
                tBtn.click();
                tBtnObj.model.click = tBtnClick;
            }
            this._rbnToggleBtnAction = true;
        },
        _onQatMenuClick: function (args) {
            var qAccessBar = this.element.find('.e-rbnquickaccessbar'), parentEle, target = $(args.target), parentLi = target.parents('.e-qatmenuli');
            if (target.hasClass('e-qatmenuli') || parentLi.length > 0) {
                if (parentLi.length > 0)
                    target = parentLi;
                if (target.attr('id')) {
                    parentEle = this.element.find("#" + this._id + "_" + target.attr('id').slice(0, -7) + "_qatEle").parents(".e-qatooldiv");
                    if (parentEle.is(':visible')) {
                        parentEle.hide();
                        target.addClass('e-addmenuli').removeClass('e-removemenuli').attr('title', this.localizedLabels.AddToQuickAccessToolbar);
                    }
                    else {
                        parentEle.show();
                        target.removeClass('e-addmenuli').addClass('e-removemenuli').attr('title', this.localizedLabels.RemoveFromQuickAccessToolbar);
                    }
                }
                if (target.hasClass('e-rbnshowbelow')) {
                    this.element.append(qAccessBar.removeClass('e-rbnabove').addClass('e-rbnbelow')).removeClass('e-rbnwithqatabove').addClass('e-rbnwithqatbelow');
                    target.addClass('e-rbnshowabove').removeClass('e-rbnshowbelow').text(this.localizedLabels.ShowAboveTheRibbon);
                    this.model.showBelowQAT = true;
                }
                else if (target.hasClass('e-rbnshowabove')) {
                    this.element.prepend(qAccessBar.removeClass('e-rbnbelow').addClass('e-rbnabove')).removeClass('e-rbnwithqatbelow').addClass('e-rbnwithqatabove');
                    target.addClass('e-rbnshowbelow').removeClass('e-rbnshowabove').text(this.localizedLabels.ShowBelowTheRibbon);
                    this.model.showBelowQAT = false;
                }
                this.element.find('.e-rbnqatmenu').hide().css({ top: '', left: '' });
                this.element.find('.e-qaresizebtn,.e-splitbtnqat').removeClass('e-tbtn e-active');
                if (this.model.allowResizing || this.model.isResponsive) {
                    this._qatResize();
                    this._qatResizeRemove();
                }
            }
        },
        _onGalContentClick: function (args) {
            var gallery = this.element.find("#" + args.data.galleryId);
            if ($(args.target).hasClass("e-gallerybtn")) {
                gallery.find(".e-galleryselect").removeClass("e-galleryselect");
                $(args.target).addClass("e-galleryselect");
            }
            else if ($(args.target).parents(".e-gallerybtn")) {
                gallery.find(".e-galleryselect").removeClass("e-galleryselect");
                $(args.target).parents(".e-gallerybtn").addClass("e-galleryselect");
            }
        },
        _onExpandContentClick: function (args) {
            var gallery = this.element.find("#" + args.data.galleryId);
            if ($(args.target).hasClass("e-gallerybtn")) {
                gallery.parent().find(".e-galleryselect").removeClass("e-galleryselect");
                $(args.target).addClass("e-galleryselect");
            }
            else if ($(args.target).parents(".e-gallerybtn")) {
                gallery.parent().find(".e-galleryselect").removeClass("e-galleryselect");
                $(args.target).parents(".e-gallerybtn").addClass("e-galleryselect");
            }
        },
        _onExpandGalleryClick: function (args) {
            var rowLen, gallery = this.element.find("#" + args.data.galleryId), expcolumns = args.data.expandedColumns;

            if (this.element.find('.e-gallexpandcontent:visible').length > 0)
                this._ribbonGalleryShow();
            if (ej.isNullOrUndefined(args.data.expandedColumns))
                expcolumns = args.data.columns;
            rowLen = Math.floor(gallery.find('.e-galleryrow').children().length / expcolumns);
            if (gallery.find('.e-galleryrow').children().length % expcolumns > 0)
                ++rowLen;
            for (var m = 1; m <= rowLen; m++) {
                var galleryExpanderRow = ej.buildTag("div#" + gallery.attr("id") + "_galleryExpanderRow_" + m).addClass('e-galleryexpanderrow').click({ model: gallery }, $.proxy(this._onGalleryItemClick, this));
                for (var n = 0; n < expcolumns; n++)
                    gallery.find('.e-galleryrow').children().eq(0).appendTo(galleryExpanderRow);
                galleryExpanderRow.appendTo(this.element.find("#" + gallery.attr("id")).parent().find('.e-expandercontent'));
            }
            gallery.hide();
            for (var i = 0; i < args.data.columns; i++)
                gallery.find('.e-galleryrow').eq(0).append("<div></div>");
            if (this.element.find('.e-resizediv').is(":visible")) {
                this.element.find('.e-resizediv').css('visibility', 'hidden');
                this.element.find('.e-resizediv .e-gallexpandcontent').css('visibility', 'visible');
            }
            this.element.find("#" + gallery.attr("id")).parent().find(".e-gallexpandcontent").show();
            if (this.element.find("#" + gallery.attr("id")).parent().find('.e-expandercontent').height() > 160 && !this._phoneMode)
                this.element.find("#" + gallery.attr("id")).parent().find(".e-gallscrollcontent").ejScroller({ height: 160 });
        },
        _onGalleryItemClick: function (e) {
            var args, target, galleryModel, cancel;
            args = { target: e.target, galleryModel: e.data.model, cancel: false };
            if (!$(args.target).hasClass("e-galleryexpanderrow")) {
                this._trigger("galleryItemClick", args);
                e.preventDefault();
                if (ej.raiseWebFormsServerEvents && !ej.isNullOrUndefined(this.model.serverEvents)) {
                    if (this.model.serverEvents.indexOf("galleryItemClick") != -1) {
                        var modelRibbon = $.extend(true, {}, this.model), controlId;
                        controlId = (args.target.id) ? args.target.id : args.target.parentNode.id;
                        var argsRibbon = { model: modelRibbon, originalEventType: "galleryItemClick", id: controlId };
                        var clientArgs = { model: e.data.model, id: controlId };
                        ej.raiseWebFormsServerEvents("galleryItemClick", argsRibbon, clientArgs);
                    }
                }
            }
        },
        _ribbonKeyDown: function (e) {
            if (e.keyCode === 40 || e.keyCode === 39)
                if (this._tabUl.find('.e-tab:visible,.e-contextualtabset:visible').length === this._tabObj.model.selectedItemIndex)
                    e.stopImmediatePropagation();
        },
        _OnKeyDown: function (e) {
            if (e.keyCode === 27) {
                var resizeDiv = this.element.find('.e-resizediv');
                if (this.element.find('.e-ribbonbackstagepage').is(':visible'))
                    this.hideBackstage();
                else if ($('.e-menu-wrap').children('.e-split:visible').length <= 0 && resizeDiv.find('.e-ddl').parents('.e-controlclicked').length <= 0 && resizeDiv.is(':visible'))
                    this._resizeDivHide();
                else if (this.element.find('.e-gallexpandcontent').is(':visible'))
                    this._ribbonGalleryShow();
                if (resizeDiv.is(':visible'))
                    resizeDiv.find('.e-controlclicked').removeClass('e-controlclicked');
                var modelDivEle = this.element.find("#" + this._id + "_modelDiv");
                if (modelDivEle.is(":visible"))
                    modelDivEle.css("display", "none");
            }
        },
        _ribCollapse: function (args) {
            var args = { clickType: this._clickValue };
            if (this._clickValue == null)
                args = { clickType: "click" };
            this._clickValue = null;
            this._trigger("collapse", args);
        },
        _ribExpand: function (args) {
            if (this.element.find('.e-ribbonpin').length > 0)
                this._tabContents.width(this.element.width());
            var args = { clickType: this._clickValue };
            if (this._clickValue == null)
                args = { clickType: "click" };
            this._clickValue = null;
            this._trigger("expand", args);
        },
        collapse: function () {
            var activeContent = this.element.find('.e-active-content').eq(0), togglecontent = this.element.find("#" + this._id + "_togglebutton");
            if (this._initialRender && this.model.collapsible)
                activeContent.hide();
            else
                activeContent.slideUp("fast", "swing", $.proxy(this._ribCollapse, this));
            this.element.find('li.e-active').eq(0).removeClass("e-active").addClass("e-collapseactive e-select");
            activeContent.addClass("e-collapse-content");
            this._selectedItemIndex = this._tabObj.model.selectedItemIndex;
            this._tabObj.option({ selectedItemIndex: 0 });
            this._tabObj.model.selectedItemIndex = 0;
            this.model.selectedItemIndex = 0;
            togglecontent.removeClass("e-expanded").addClass("e-collapsed");
            this._isCollapsed = true;
        },

        expand: function () {
            var activeContent = this.element.find('.e-active-content').eq(0);
            if (activeContent.hasClass("e-rbn-ondemand"))
                this._groupContent({activeIndex:this.model.selectedItemIndex+1});
            var togglecontent = this.element.find("#" + this._id + "_togglebutton");
            activeContent.slideDown("fast", "swing", $.proxy(this._ribExpand, this));
            this.element.find('.e-collapseactive').addClass("e-active").removeClass("e-collapseactive");
            activeContent.removeClass("e-collapse-content");
            this._tabObj.model.selectedItemIndex = this._selectedItemIndex;
            this.model.selectedItemIndex = this._selectedItemIndex
            togglecontent.removeClass("e-collapsed").addClass("e-expanded");
            togglecontent.find("span").addClass("e-rarrowup-2x");
            if (!this._phoneMode) {
                this._ribbonResize();
                this._addRibbonPin();
            }
        },
        _addRibbonPin: function () {
            if (this.element.find('.e-ribbonpinicon').length <= 0) {
                var expandCollapse = this.element.find('.e-expandcollapse'), expandIcon = this.element.find('.e-rarrowup-2x');
                expandIcon.parent().removeClass("e-collapsed").addClass("e-expanded e-ribbonpin");
                expandIcon.removeClass("e-rarrowup-2x").addClass("e-ribbonpinicon");
                this._isCollapsed = false;
            }
            this._tabContents.css({ 'position': 'absolute' }).width(this.element.width());
            if (this.element.hasClass("e-grpdivhide"))
                this._tabContents.css({ 'position': '' }).width(this.element.width());
            if (this.element.hasClass("e-grpdivhide") && this.element.find('.e-ribbonpin').length > 0 && this.model.showQAT && this._qAccessBar.hasClass('e-rbnbelow'))
                this.element.find('.e-rbnquickaccessbar').css({ 'position': 'absolute' });
        },
        _removeRibbonPin: function () {
            var togglecontent = this.element.find("#" + this._id + "_togglebutton");
            this._tabContents.css({ 'position': '', 'width': '' });
            togglecontent.removeClass("e-ribbonpin");
            togglecontent.find("span").removeClass("e-ribbonpinicon").addClass("e-rarrowup-2x");
        },
        _onRbnPinDivClick: function (args) {
            this._removeRibbonPin();
        },
        _onGroupExpandClick: function (e) {
            this._trigger("groupExpand", e);
        },
        _onBackStageItemClick: function (args) {
            if (this._phoneMode)
                this.element.find(".e-responsivebackstagecontent .e-backstageTitle").text($(args.currentTarget).text());
            var iconHeight, backStageId, backStageText, argsBackStage, backStageHeight;
            var contentId = this.element.find(args.data.contentDivId);
            args.preventDefault();
            if ($(args.target).hasClass("e-backstagebutton")) {
                this.element.find(".e-ribbonbackstagepage").hide();
                if (this._phoneMode)
                    if (this.element.find(".e-responsivebackstage").is(":visible"))
                        this.element.find(".e-responsivebackstage").removeClass("e-backstageshowanimate");
            }
            this.element.find('.e-backstageactive-content').removeClass("e-backstageactive-content").hide();
            this.element.find(".e-backstageactive").removeClass("e-backstageactive");
            if (this.model.enableOnDemand && contentId.children().length == 0) {
                var backstageSet = this.model.applicationTab.backstageSettings;
                var backstagePageLen = backstageSet.pages.length;
                if (this.model.enableOnDemand && backstagePageLen > 0) {
                    var activeIndex = $(args.currentTarget).index() - $(args.currentTarget).prevAll(".e-backstageseparator").length;
                    contentId.append($('#' + backstageSet.pages[activeIndex].contentID).addClass('e-backstagetabarea').show());
                }
            }
            this.element.find(args.data.contentDivId).addClass("e-backstageactive-content").show();
            if ($(args.target).hasClass("e-backstageli"))
                $(args.target).addClass("e-backstageactive");
            else
                $(args.target).parents(".e-backstageli").addClass("e-backstageactive");
            iconHeight = this.element.find('.e-ribbonbackstagetop').height();
            this.element.find(".e-backstagescrollcontent").ejScroller({ height: 0 });
            backStageHeight = this.model.applicationTab.backstageSettings.height;
            if (!ej.isNullOrUndefined($(args.target).text()))
                backStageText = $(args.target).text();
            else
                backStageText = $(args.target).children('a').text();
            if (!ej.isNullOrUndefined($(args.target).attr('id')))
                backStageId = $(args.target).attr('id');
            else
                backStageId = $(args.target).parent().attr('id');
            argsBackStage = { id: backStageId, text: backStageText, target: args.target, type: "backstageItemClick", cancel: false };
            if (!this.element.find(args.data.contentDivId).children().hasClass("e-backstagetitlecontent") && this.model.enableOnDemand)
                ej.buildTag("div#" + this._id + "_BackStageTitleContent").addClass('e-backstagetitlecontent').text(backStageText).prependTo(contentId);
            else if (this.model.enableOnDemand)
                this.element.find(".e-backstagetitlecontent").text('').append(backStageText);
			this._backStageHeightCalculate(backStageHeight, iconHeight);
            if ($(args.target).parents(".e-backstageheader").length > 0 && ($(args.target).find("a").length > 0 || args.target.localName == "a") && this._phoneMode) {
                this.element.find(".e-responsivebackstagecontent").show();
                this.element.find(".e-responsivebackstage").removeClass("e-backstageshowanimate");
            }
            this._trigger("backstageItemClick", argsBackStage);
        },
        _onBackStageTopIcon: function (args) {
            this.hideBackstage();
        },
        _backStageHeightCalculate: function (backStageHeight, iconHeight) {
            var backStageWidth = this.model.applicationTab.backstageSettings.width;
            if (!ej.isNullOrUndefined(backStageHeight)) {
                if (backStageHeight.toString().endsWith('%'))
                    backStageHeight = this.element.find(".e-ribbonbackstagepage").height();
                else if (backStageHeight.toString().endsWith('px'))
                    backStageHeight = parseInt(backStageHeight, 10);
                if (this.model.applicationTab.backstageSettings.height != '100%') {
                    if (this.element.find(".e-backstageactive-content").height() > backStageHeight - iconHeight)
					{
                        this.element.find(".e-ribbonbackstagepage").height(backStageHeight).width(backStageWidth);
                        this.element.find(".e-backstagescrollcontent").ejScroller({ height: backStageHeight - iconHeight, scroll: $.proxy(this._scroll, this) });
					}
                    else {
                        if (ej.isNullOrUndefined(backStageHeight))
                            if (this.element.find(".e-backstageactive-content").height() > this.element.height() - iconHeight)
                                this.element.find(".e-backstagescrollcontent").ejScroller({ height: this.element.height() - iconHeight, scroll: $.proxy(this._scroll, this) });
                    }
                }
            }
            if (!ej.isNullOrUndefined(backStageWidth)) {
                if (backStageWidth.toString().endsWith('%'))
                    backStageWidth = this.element.find(".e-ribbonbackstagepage").width();
                else if (backStageWidth.toString().endsWith('px'))
                    backStageHeight = parseInt(backStageWidth, 10);
                if (this.model.applicationTab.backstageSettings.width != '100%') {
                    if (this.element.find(".e-backstageactive-content").width() > backStageWidth - this.element.find(".e-backstageheader").width()) {
                        this.element.find(".e-ribbonbackstagepage").height(backStageHeight).width(backStageWidth);
                        this.element.find(".e-backstagescrollcontent").ejScroller({ width: backStageWidth });
                    }
                    else {
                        if (ej.isNullOrUndefined(backStageWidth))
                            if (this.element.find(".e-backstageactive-content").width() > this.element.width())
                                this.element.find(".e-backstagescrollcontent").ejScroller({ width: this.element.width() })
                    }
                }
            }
            this._refreshBackstageScroller();
        },
        _refreshBackstageScroller: function () {
            var proxy = this;
            this.element.find(".e-backstagescrollcontent").find(".e-content").scroll(ej.proxy(function (e) {
				if(!proxy.model.enableRTL){
                proxy.element.find(".e-backstagetopcontent").css({ 'position': 'relative', 'left': -$(e.currentTarget).scrollLeft() });
				}else{
				proxy.element.find(".e-backstagetopcontent").css({ 'position': 'relative', 'left': 0 });	
				}
                proxy.element.find(".e-backstagetopicon").css({ 'left': $(e.currentTarget).scrollLeft() + 26 });
            }));
        },
        _onApplicationTabClick: function (args) {
            args.preventDefault();
            var backStageContent = this.element.find(".e-backstagecontent");
            if (this.model.enableOnDemand && backStageContent.length == 0)
                this._createApplicationTab();
            backStageContent = this.element.find(".e-backstagecontent");
               this.showBackstage();
        },

        showBackstage: function () {
            var headerWidth, argsBackStage, iconHeight, backStageHeight, backStageWidth, target, backStageText, backStageLi, bodyCon, headerCon;
            var backStageContent = this.element.find(".e-backstagecontent");
            if (this.model.enableOnDemand && backStageContent.length == 0)
                this._createApplicationTab();
            bodyCon = this.element.find(".e-ribbonbackstagebody");
            headerCon = this.element.find(".e-backstageheader");
            backStageHeight = this.model.applicationTab.backstageSettings.height;
            backStageWidth = this.model.applicationTab.backstageSettings.width;
            if (this.model.applicationTab.type === ej.Ribbon.ApplicationTabType.Backstage) {
                if (ej.isNullOrUndefined(backStageHeight)) {
                    this.element.find(".e-ribbonbackstagepage").height(this.element.height()).width(this.element.width());
                    bodyCon.height(this.element.height() - 92);
                    headerCon.height(this.element.height() - 92);
                }
                else {
                    bodyCon.height(backStageHeight - 92);
                    headerCon.height(backStageHeight - 92);
                }
                if (ej.isNullOrUndefined(backStageWidth)) {
                    this.element.find(".e-ribbonbackstagepage").height(this.element.height()).width(this.element.width());
                    bodyCon.width(this.element.width());
                }
                else {
                    bodyCon.width(backStageWidth);
                }
                this.element.css({ "position": "relative" });
                this.element.find(".e-ribbonbackstagepage").show();
                headerWidth = this.element.find('.e-backstageheader').width();
                this.element.find('.e-backstagetopcontent').width(headerWidth);
                this.element.find('.e-backstageheader').width(headerWidth);
                backStageLi = this.element.find(".e-backstageli");
                backStageLi.width(backStageLi.width());
                iconHeight = this.element.find('.e-ribbonbackstagetop').height();
                this.element.find(".e-backstageactive-content").removeClass("e-backstageactive-content").hide();
                this.element.find(".e-backstageactive").removeClass("e-backstageactive");
                backStageLi.first().addClass("e-backstageactive");
                this.element.find('.e-backstagecontent').first().addClass("e-backstageactive-content").show();
                this.element.find(".e-backstagescrollcontent").ejScroller({ height: 0, width: 0 });
                target = this.element.find('.e-backstageli').first();
                if (!ej.isNullOrUndefined($(target).text()))
                    backStageText = $(target).text();
                else
                    backStageText = $(target).children('a').text();
                var backstageSet = this.model.applicationTab.backstageSettings;
                var backstagePageLen = backstageSet.pages.length;
                var backStageContent = this.element.find(".e-backstagecontent");
                if (!this._phoneMode) {
                    if (this.model.enableOnDemand && backstagePageLen > 0 && !ej.isNullOrUndefined(backstageSet.pages[0].text)) {
                        var activeIndex = $(".e-backstageactive-content").index() - 1;
                        var activeContent = $(backStageContent).filter(".e-backstageactive-content");
                        if (activeIndex != -1)
                            $(activeContent).append($('#' + backstageSet.pages[activeIndex].contentID).addClass('e-backstagetabarea').show());
                        if (!$(activeContent).children().hasClass("e-backstagetitlecontent"))
                            $(activeContent).prepend(ej.buildTag("div#" + this._id + "_BackStageTitleContent").addClass('e-backstagetitlecontent'));
                    }
                }
                this._backStageHeightCalculate(backStageHeight, iconHeight);
                backStageContent = this.element.find(".e-backstagecontent");
                var responsebackstage = this.element.find(".e-responsivebackstage").removeClass("e-reshide");
                var resbackstageHeader = responsebackstage.find(".e-backstageheader");
                if (this._phoneMode) {
                    if (this.element.find(".e-responsivetabheader").is(":visible"))
                        this.element.find(".e-responsivetabheader").removeClass("e-resshow");
                    if (responsebackstage.children().length > 0) {
                        var top = parseInt(resbackstageHeader.css("top"))
                        if (this.element.parent(".e-js").length > 0 && ((document.documentElement.clientHeight - (responsebackstage.find(".e-backstageheader").offset().top)) > this.element.parent(".e-js").height()))
                            resbackstageHeader.css({ "width": this.element.find(".e-header").outerWidth() / 2, "height": this.element.parent().height() });
                        else
                            resbackstageHeader.css({ "width": this.element.find(".e-header").outerWidth() / 2, "height": document.documentElement.clientHeight - (responsebackstage.find(".e-backstageheader").offset().top) });
                        if (resbackstageHeader.offset().top != top)
                            resbackstageHeader.height(resbackstageHeader.height() - top);
                    }
                    responsebackstage.addClass("e-backstageshowanimate");
                    this.element.find(".e-backstageactive").removeClass("e-backstageactive");
                }
                argsBackStage = { id: $(target).attr('id'), text: backStageText, target: $(target).children(), type: "backstageItemClick", cancel: false };
                if (this.model.enableOnDemand)
                    this.element.find(".e-backstagetitlecontent").text('').append(backStageText);
                this._trigger("backstageItemClick", argsBackStage);
            }
        },
        hideBackstage: function () {
            this.element.find(".e-ribbonbackstagepage").hide();
            if (this._phoneMode)
                this.goToMainContent();
        },
        _initPrivateProperties: function () {
            this._initialRender = false;
            this._tabUl = this.element.find('.e-header');
            this._applicationTab = this.element.find('.e-apptab');
            this._ribbonTabs = this._tabUl.find(":not('a')");
            this._tabText = this.element.find('.e-link');
            this._id = this.element.attr("id");
            this._tabObj = this.element.data("ejTab");
            this._isCollapsed = false;
            this._contextualTabSet = "";
            this._resizeWidth = 0;
            this._selectedItemIndex = 0;
            this._clickValue = null;
            this._tabContents = this.element.children().attr('role', 'tablist').not('.e-header,.e-disable,.e-resizediv,.e-tooltipdiv,.e-ribbonbackstagepage');
            this._qatControlsName = [];
            this._qAccessBar = this.element.find('.e-rbnquickaccessbar');
            this._rbnToggleBtnAction = true;
            this.localizedLabels = this._getLocalizedLabels();
            this._phoneMode = (this.model.allowResizing || this.model.isResponsive) && document.documentElement.clientWidth < 420 ? true : false;
            this._responsiveTarget = null;
            this._responsiveContent = null;
            this._responsiveContentStyle = null;
            this._responsiveGallery = null;
            this._mobileToolbar = [];
            this._mobileContents = [];
            this._responsiveTabText = null;
            this._responsiveHeight = document.documentElement.clientHeight * (parseInt("40%") / 100);
            this._QATclick = false;
        },
        _getLocalizedLabels: function () {
            return ej.getLocalizedConstants(this.sfType, this.model.locale);
        },
        _customization: function () {
            var toggleelm, model = {}, expColObj = {}, li, proxy = this;
            if (this._initial) {
                if (this.model.contextualTabs.length > 0 && this.model.contextualTabs[0].tabs.length > 0)
                  this._contextualTabs();
                toggleelm = '<div id=' + this._id + '_togglebutton class="e-expanded"><span class="e-icon e-rarrowup-2x"></span></div>';
                li = ej.buildTag("li#" + this._id + "_" + "expandCollapse.e-expandcollapse", toggleelm);
                this.element.find('.e-active-content').eq(0).append(li);
                expColObj.expandObj = this.model.expandPinSettings;
                expColObj.collapseObj = this.model.collapsePinSettings;
                li.mouseover({ value: expColObj, ribbonId: this._id }, $.proxy(this._tooltip, this)).mouseout({ ribbonId: this._id }, $.proxy(this._toolTipOut, this));
            }
            this.model.enableOnDemand ? this._createAppTabOnDemand() : this._createApplicationTab();
                      this.element.find('.e-content.e-content-item').on("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
                           function (event) {
						          if(proxy.element.hasClass('e-responsive')){
                                   if (proxy.element.find(".e-ribupdivarrow .e-icon").hasClass("e-ribuparrow"))
                                       proxy._ribExpand(this);
                                    else if (proxy.element.find(".e-ribupdivarrow .e-icon").hasClass("e-ribdownarrow"))
                                       proxy._ribCollapse(this);
								  }
                               });

        },
        _createAppTabOnDemand: function () {
            var model;
            if (this.model.applicationTab.type === ej.Ribbon.ApplicationTabType.Menu) {
                this._applicationTab.find('.e-link').hide();
                if (this.model.applicationTab.menuSettings)
                    model = this.model.applicationTab.menuSettings;
                if (this.model.applicationTab.menuItemID) {
                    $("#" + this.model.applicationTab.menuItemID).appendTo(this._applicationTab);
                    model.enableRTL = this.model.enableRTL;
                    model.isResponsive = false;
                    $("#" + this.model.applicationTab.menuItemID).addClass("e-rbncustomelement").ejMenu(model);
                }
                $("#" + this._id + "_" + this.model.applicationTab.type.replace(/\s/g, '')).hide();
            }
            else {
                this._applicationTab.find('.e-link').text(this.model.applicationTab.backstageSettings.text);
            }
            this._applicationTab.click($.proxy(this._onApplicationTabClick, this));
            if (this.model.applicationTab.type === ej.Ribbon.ApplicationTabType.Backstage) 
             this._applicationTab.find('a').addClass('e-apptabanchor');
        },
		_createApplicationTab: function() {
		 var backStagePage=this.element.find(".e-ribbonbackstagepage"), backStageContent, backStageUl=this.element.find(".e-backstageheader"), backStageLi, aTag, backStageScrollContent, backStageTop, backStageBody=this.element.find(".e-ribbonbackstagebody"), backStageTopContent=this.element.find(".e-backstagetopcontent"), backStageTitleContent, backStageTopIcon, bottomSeparator,backstageSet,backstagePageLen,model;
         backstageSet = this.model.applicationTab.backstageSettings;
         backstagePageLen = backstageSet.pages.length;
		 if (this.model.applicationTab.type === ej.Ribbon.ApplicationTabType.Menu && !this.model.enableOnDemand) {
                this._applicationTab.find('.e-link').hide();
                this.element.find('.e-backstagetabarea').appendTo('body').removeClass('e-backstagetabarea');
                backStagePage.remove();
                if (this.model.applicationTab.menuSettings)
                    model = this.model.applicationTab.menuSettings;
                if (this.model.applicationTab.menuItemID) {
                    $("#" + this.model.applicationTab.menuItemID).appendTo(this._applicationTab);
                    model.enableRTL = this.model.enableRTL;
                    model.isResponsive = false;
                    $("#" + this.model.applicationTab.menuItemID).addClass("e-rbncustomelement").ejMenu(model);
		        }
                $("#" + this._id + "_" + this.model.applicationTab.type.replace(/\s/g, '')).hide();
		    }
            else {
		     if (!ej.isNullOrUndefined(this.model.applicationTab.menuItemID)) {
		         var menuObj = $("#" + this.model.applicationTab.menuItemID).data("ejMenu");
		         menuObj && menuObj._destroy();		        
		         $("#" + this.model.applicationTab.menuItemID).appendTo('body');
		         this.model.applicationTab.menuItemID = null; this.model.applicationTab.menuSettings = {};
		         this._applicationTab.find('.e-link').css("display", "block");
		     }
                this._applicationTab.find('.e-link').text(this.model.applicationTab.backstageSettings.text);
		    }
            this._applicationTab.click($.proxy(this._onApplicationTabClick, this));
            this.element.find('.e-content.e-content-item').css("box-sizing", "content-box");
            if (this.model.applicationTab.type === ej.Ribbon.ApplicationTabType.Backstage) {
                var backStageHeight = this.model.applicationTab.backstageSettings.height;
                if (backStageHeight.toString().endsWith('%'))
                    backStageHeight = $(document).height() * (parseInt(backStageHeight.slice(0, -1), 10) / 100);
                else if (backStageHeight.toString().endsWith('px'))
                    backStageHeight = parseInt(backStageHeight, 10);
	            if(backStagePage.length==0){
                 backStagePage = ej.buildTag("div#" + this._id + "_BackStage").addClass('e-ribbonbackstagepage');
                 backStageBody = ej.buildTag("div#" + this._id + "_BackStageBody").addClass('e-ribbonbackstagebody');
                 backStageUl = ej.buildTag("ul#" + this._id + "_BackStageHeader").addClass('e-backstageheader');
				}
				backStagePage.height(backStageHeight).width(this.model.applicationTab.backstageSettings.width).hide();
                backStageBody.height(backStageHeight - 50);
                backStageUl.height(backStageHeight - 50);
                for (var i = 0; i < backstagePageLen; i++) {
				  var bsItem=this.element.find("#"+backstageSet.pages[i].id + "_backStageTab"),prevItem=this.element.find("#"+backstageSet.pages[i].id + "_backStageBtn");
                  if(ej.isNullOrUndefined(backstageSet.pages[i].itemType))
                     backstageSet.pages[i].itemType = ej.Ribbon.ItemType.Tab;
				  if(backstageSet.pages[i].itemType == ej.Ribbon.ItemType.Button){
				   bsItem =this.element.find("#"+backstageSet.pages[i].id + "_backStageBtn");
				   prevItem=this.element.find("#"+backstageSet.pages[i].id + "_backStageTab");
				  }
				if(this.element.find(".e-ribbonbackstagepage").length==0 || (bsItem.length==0 && prevItem.length==0)){
                    backStageLi = ej.buildTag("li").addClass('e-backstageli').attr("tabindex", 0).click({ contentDivId: "#" + this._id + "_BackStage_" + backstageSet.pages[i].id.replace(/\s/g, ''), height: backstageSet.height }, $.proxy(this._onBackStageItemClick, this));
                    if (backstageSet.pages[i].itemType == ej.Ribbon.ItemType.Tab) {
                        aTag = ej.buildTag("a", backstageSet.pages[i].text, {}, { href: "#" + this._id + "_BackStage_" + backstageSet.pages[i].id.replace(/\s/g, '') }).focus(function() {
                         $(this).parents('.e-backstageli').addClass('e-bsmaterial-focus');
                            }).focusout(function() {
                         $(this).parents('.e-backstageli').removeClass('e-bsmaterial-focus');
                         });
                        backStageLi.append(aTag).attr('id', backstageSet.pages[i].id + "_backStageTab");
						}
                    else
                        backStageLi.append(backstageSet.pages[i].text).addClass('e-backstagebutton').attr('id', backstageSet.pages[i].id + "_backStageBtn");
                    backStageUl.append(backStageLi);
                    if (backstageSet.pages[i].enableSeparator) {
                        bottomSeparator = ej.buildTag("li").addClass('e-backstageseparator');
                        backStageUl.append(bottomSeparator);
                    }
                    if (backstageSet.pages[i].itemType == ej.Ribbon.ItemType.Tab) 
                        this._addBackStageTabCont(backstageSet,backStageBody,i);
					}
					else{
					 var bItem=prevItem;
					 if(bsItem.length>0)
					  bItem=bsItem;
					 if(backstageSet.pages[i].itemType == ej.Ribbon.ItemType.Button){
					     if(bItem.find('a').length>0){
						  this._removeBackStageTabCont(this.element.find(bItem.find('a').attr('href')));
						  bItem.attr('id', backstageSet.pages[i].id + "_backStageBtn").addClass('e-backstagebutton');
						  bItem.find('a').remove();
						  }
						  bItem.text(backstageSet.pages[i].text);
					 }
					 else{
					   if(bItem.hasClass('e-backstagebutton')){
						 aTag = ej.buildTag("a", backstageSet.pages[i].text, {}, { href: "#" + this._id + "_BackStage_" + backstageSet.pages[i].id.replace(/\s/g, '') }).focus(function() {
                         $(this).parents('.e-backstageli').addClass('e-bsmaterial-focus');
                            }).focusout(function() {
                         $(this).parents('.e-backstageli').removeClass('e-bsmaterial-focus');
                         });
                         bItem.append(aTag).attr('id', backstageSet.pages[i].id + "_backStageTab").removeClass('e-backstagebutton');
                         this._addBackStageTabCont(backstageSet,backStageBody,i);
						}
						bItem.find('a').text(backstageSet.pages[i].text);
						var tabCon=this.element.find(bItem.find('a').attr('href'));
						if(backstageSet.pages[i].contentID!=tabCon.find(".e-backstagetabarea").attr('id')){
				          tabCon.find('.e-backstagetabarea').removeClass('e-backstagetabarea').appendTo('body');
                          tabCon.append($('#' + backstageSet.pages[i].contentID).addClass('e-backstagetabarea'));
						}
					 }
					if (backstageSet.pages[i].enableSeparator) {
					    if(bItem.next().length>0 && !bItem.next().hasClass('e-backstageseparator')){
                        bottomSeparator = ej.buildTag("li").addClass('e-backstageseparator');
                        bItem.after(bottomSeparator);
						}
                    }
					else{
					 if(bItem.next().length>0 && bItem.next().hasClass('e-backstageseparator'))
					  bItem.next().remove();
					}
					}
		        }
		        if (this.element.find(".e-ribbonbackstagepage").length == 0) {
		            backStageBody.prepend(backStageUl);
		            backStageTop = ej.buildTag("div#" + this._id + "_BackStageTop").addClass('e-ribbonbackstagetop').height(92);
		            backStageTopContent = ej.buildTag("div#" + this._id + "_BackStageTopContent").addClass('e-backstagetopcontent').appendTo(backStageTop);
		            backStageTopIcon = ej.buildTag("div#" + this._id + "_BackStageTopIcon", "<div class='e-ribbonbackicon'><span></span></div>").addClass('e-backstagetopicon').click($.proxy(this._onBackStageTopIcon, this)).appendTo(backStageTopContent);
		            backStagePage.append(backStageTop);
		            backStageScrollContent = ej.buildTag("div#" + this._id + "_backStageScrollContent", "<div></div>").addClass("e-backstagescrollcontent");
		            backStageScrollContent.children().append(backStageBody);
		            backStagePage.append(backStageScrollContent);
		            this._applicationTab.addClass('e-backstagetab');
		            this._applicationTab.find('a').addClass('e-apptabanchor');
		            if (this.element.find('.e-ribbonbackstagepage').length > 0)
		                this.element.find('.e-ribbonbackstagepage').remove();
		            this.element.append(backStagePage);
		            var responsiveBackStage = this.element.find(".e-responsivebackstagecontent .e-resbackstagecontent");
		            if (backStagePage.find(".e-ribbonbackstagebody .e-backstagecontent").length > 0 && this._phoneMode) {
		                responsiveBackStage.children().remove();
		                responsiveBackStage.append(backStagePage.find(".e-ribbonbackstagebody .e-backstagecontent"));
		            }
		        }
		        else {
		            var tabs = [];
		            for (var i = 0; i < this.model.applicationTab.backstageSettings.pages.length; i++)
		                tabs.push(this.model.applicationTab.backstageSettings.pages[i].id);
		            for (var i = 0; i < this.element.find('.e-backstageli').length; i++) {
		                var ele = this.element.find('.e-backstageli').eq(i), id = ele.attr('id').split('_')[0];
		                if ($.inArray(id, tabs) < 0) {
		                    if (ele.find('a').length > 0)
		                        this._removeBackStageTabCont(this.element.find(ele.find('a').attr('href')));
		                    if (ele.next().length > 0 && ele.next().hasClass('e-backstageseparator'))
		                        ele.next().remove();
		                    ele.remove();
		                    --i;
		                }
		            }
		            for (var i = 0; i < backstageSet.pages.length; i++)
		                this._checkBackstageTabOrder(backstageSet.pages[i], i);
		        }
		        if (!ej.isNullOrUndefined(backstageSet.headerWidth)) {
		            backStageTopContent.css("width", backstageSet.headerWidth);
		            backStageUl.css("width", backstageSet.headerWidth);
		        }
		    }
		    if (this.model.enableOnDemand && this._phoneMode) {
		        backstage = this.element.find(".e-responsivebackstage");
		        backstagePage = this.element.find(".e-ribbonbackstagepage");
		        if (this._tabUl.find(".e-backstagetab").length > 0 && backstage.length == 1) {
		            var backstagecontent = backstagePage.find(".e-ribbonbackstagebody .e-backstageheader");
		            backstage.append(backstagecontent).addClass("e-reshide");
		        }
		    }
		},
	    _addBackStageTabCont: function (backstageSet,backStageBody,i) {
		  var content = ej.buildTag("div#" + this._id + "_BackStage_" + backstageSet.pages[i].id.replace(/\s/g, '')).addClass('e-backstagecontent').css({ "width": "auto" });
          if (i > 0)
            content.hide();
	        if (backstageSet.pages[i].contentID && !this.model.enableOnDemand) {
	            backStageTitleContent = ej.buildTag("div#" + this._id + "_BackStageTitleContent").addClass('e-backstagetitlecontent').appendTo($(content));
	            $(backStageTitleContent).text('').append(backstageSet.pages[i].text);
	            $(content).append($('#' + backstageSet.pages[i].contentID).addClass('e-backstagetabarea').show());
	        }
	        backStageBody.append(content);
		},
		_removeBackStageTabCont: function (tab) {
		   tab.find('.e-backstagetabarea').removeClass('e-backstagetabarea').appendTo('body');
		   tab.remove();
		 },
        _conTabsRemove: function () {
            var cntxTabs = this.element.find(".e-contextli,.e-contextliset"), $cntxTab;
            var cntxTabLen = cntxTabs.length;
            for (var i = 0; i < cntxTabLen; i++) {
                $cntxTab = $(cntxTabs[i]);
                $cntxTab.is(":visible") ? $cntxTab.find("li").insertAfter($cntxTab.eq(0)) : $cntxTab.find("li").hide().insertAfter($cntxTab.eq(0));
                $cntxTab.remove();
            }
        },
        _contextualTabs: function () {
            var curcontextualTabSet, li, ul;
            if (this.model.contextualTabs) {
                var contextTabLen = this.model.contextualTabs.length;
                for (var i = 0; i < contextTabLen; i++) {
                    curcontextualTabSet = this.model.contextualTabs[i];
                    if (curcontextualTabSet.tabs.length > 0) {
                        li = ej.buildTag("li#e-contextlisetIn_" + i).addClass("e-contextliset");
                        this._contextualTabSet = this._tabUl.children('.e-contextualtabset').filter(function (index) { return $(this).text() === curcontextualTabSet.tabs[0].text; });
                        this._contextualTabSet.before(li);
                        this._tabUl.children('.e-contextualtabset').find('a').css("color", curcontextualTabSet.borderColor);
                        ul = ej.buildTag("ul.e-contextual", "", {
                            'background': curcontextualTabSet.backgroundColor,
                            'border-top-color': curcontextualTabSet.borderColor
                        });
                        var contexttualTabLen = curcontextualTabSet.tabs.length;
                        for (var j = 0; j < contexttualTabLen; j++) {
                            ul.append(this._tabUl.children('.e-contextualtabset').filter(function (index) {
                                return $(this).text() ===
                                curcontextualTabSet.tabs[j].text;
                            }));
                        }
                        ul.appendTo(li);
                    }
                }
            }
        },
        addBackStageItem: function (pageitem, index) {
            var pageIndex = this.model.applicationTab.backstageSettings.pages.length;
            if (!ej.isNullOrUndefined(index))
                pageIndex = index;
            this.model.applicationTab.backstageSettings.pages.splice(pageIndex, 0, pageitem);
            this._initial = false;
            this._customization();
            if (this._phoneMode) {
                backstagePage = this.element.find(".e-ribbonbackstagepage");
                if (backstagePage.find(".e-ribbonbackstagebody .e-backstagecontent").length > 0)
                    this.element.find(".e-responsivebackstagecontent .e-resbackstagecontent").append(backstagePage.find(".e-ribbonbackstagebody .e-backstagecontent"));
            }
        },
		_checkBackstageTabOrder: function (pageitem, index) {
		 var curTabLi=this.element.find("#"+pageitem.id+"_backStageTab");
		 if(curTabLi.length==0)
		  curTabLi=this.element.find("#"+pageitem.id+"_backStageBtn");
		 if(curTabLi.index()!=index)
		  {
			var target=this.element.find(".e-backstageli").eq(index);
			if(pageitem.enableSeparator && curTabLi.next().hasClass('e-backstageseparator'))
			  target=curTabLi.next().insertBefore(target);
			curTabLi.insertBefore(target);
		    this.element.find("#"+this._id+"_BackStage_"+pageitem.id).insertBefore(this.element.find(".e-backstagecontent").eq(index));
		  }
		},
        removeBackStageItem: function (index) {
            var id, pageId;
            id = this.model.applicationTab.backstageSettings.pages[index].id;
            pageId = "#" + this._id + "_BackStage" + "_" + id;
            this.model.applicationTab.backstageSettings.pages.splice(index, 1);
            if (this.element.find(pageId).hasClass('e-backstagecontent'))
                this.element.find(pageId).remove();
            $(this.element.find('.e-backstageli')[index]).remove();
            this.hideBackstage();
        },
        updateBackStageItem: function (index, pageitem) {
            $.extend(this.model.applicationTab.backstageSettings.pages[index], pageitem)
            this._initial = false;
            this._customization();
            if(this._phoneMode){
                backstagePage = this.element.find(".e-ribbonbackstagepage");
                if (backstagePage.find(".e-ribbonbackstagebody .e-backstagecontent").length > 0)
                    this.element.find(".e-responsivebackstagecontent .e-resbackstagecontent").append(backstagePage.find(".e-ribbonbackstagebody .e-backstagecontent"));
            }
        },
        showContextualTab: function (text) {
            this.element.find(".e-contexttitle").filter(function (index) { return $(this).text() === text; }).parent().parent().show();
        },
        hideContextualTab: function (text) {
            this.element.find(".e-contexttitle").filter(function (index) { return $(this).text() === text; }).parent().parent().hide();
            this._tabObj.option({ selectedItemIndex: this._tabObj.model.selectedItemIndex + 1 });
        },
        _createQAT: function () {
            if (this.model.showQAT && (!ej.isNullOrUndefined(this.model.qatItems) || this.element.find(".e-rbnquickaccessbar").children().length == 0)) {
                if (this.model.enableOnDemand) {
                    if (!ej.isNullOrUndefined(this.model.tabs))
                        this._createCollapseQuickaccess(this.model.tabs);
                    if (!ej.isNullOrUndefined(this.model.contextualTabs))
                        for (var i = 0; i < this.model.contextualTabs.length; i++)
                            this._createCollapseQuickaccess(this.model.contextualTabs[i].tabs);
                }
                if (this.model.showQAT && !ej.isNullOrUndefined(this.model.qatItems))
                    this._createCollapseQuickaccess();
            }
            this._createQuickAccessBar();
        },
        _createCollapseQuickaccess: function (tabs) {
            if (!ej.isNullOrUndefined(tabs) && (!ej.isNullOrUndefined(this.model.qatItems) || this.element.find(".e-rbnquickaccessbar").children().length == 0)) {
                for (var i = 0; i < tabs.length; i++) {
                    if (!ej.isNullOrUndefined(tabs[i].groups))
                        for (var j = 0; j < tabs[i].groups.length; j++) {
                            if (!ej.isNullOrUndefined(tabs[i].groups[j].content))
                                for (var k = 0; k < tabs[i].groups[j].content.length; k++) {
                                    var subGroup = tabs[i].groups[j].content[k].groups;
                                    var defaults = tabs[i].groups[j].content[k].defaults;
                                    tabs[i].groups[j].content[k].defaults;
                                    this._createqatItems(subGroup, defaults)
                                }
                        }

                }
            }
            else
                this._createqatItems(this.model.qatItems)
        },
        _createqatItems: function (subGroup, defaults) {
            if (this.model.showQAT && (!ej.isNullOrUndefined(this.model.qatItems) || this.element.find(".e-rbnquickaccessbar").children().length == 0))
                var qatOrder = ej.buildTag('div#' + this._id + "order");
            var qatControls = [];
            for (var m = 0; m < subGroup.length; m++) {
                if (!ej.isNullOrUndefined(subGroup[m])) {
                    if (!ej.isNullOrUndefined(defaults)) {
                        if (!ej.isNullOrUndefined(defaults.type))
                            subGroup[m].type = defaults.type;
                    }
                    if (ej.isNullOrUndefined(subGroup[m].type))
                        subGroup[m].type = ej.Ribbon.Type.Button;
                    if (ej.isNullOrUndefined(subGroup[m].isBig) && !ej.isNullOrUndefined(defaults))
                        subGroup[m].isBig = defaults.isBig;
                    var buttonDef = this.model.buttonDefaults;
                    if (ej.isNullOrUndefined(subGroup[m].height)) {
                        var btnHeight;
                        if (!ej.isNullOrUndefined(subGroup[m].buttonSettings) && !ej.isNullOrUndefined(subGroup[m].buttonSettings.height))
                            btnHeight = subGroup[m].buttonSettings.height;
                        else if (!ej.isNullOrUndefined(defaults) && !ej.isNullOrUndefined(defaults.height))
                            btnHeight = defaults.height;
                        else if (!ej.isNullOrUndefined(buttonDef) && !ej.isNullOrUndefined(buttonDef.height))
                            btnHeight = buttonDef.height;
                        subGroup[m].height = btnHeight;
                        btnHeight = null;
                    }
                    if (ej.isNullOrUndefined(subGroup[m].width)) {
                        var btnWidth;
                        if (!ej.isNullOrUndefined(subGroup[m].buttonSettings) && !ej.isNullOrUndefined(subGroup[m].buttonSettings.width))
                            btnWidth = subGroup[m].buttonSettings.width;
                        else if (!ej.isNullOrUndefined(defaults) && !ej.isNullOrUndefined(defaults.width))
                            btnWidth = defaults.width;
                        else if (!ej.isNullOrUndefined(buttonDef) && !ej.isNullOrUndefined(buttonDef.width))
                            btnWidth = buttonDef.width;
                        subGroup[m].width = btnWidth;
                        btnWidth = null;
                    }
                    if (!ej.isNullOrUndefined(subGroup[m].buttonSettings)) {
                        var buttonSet = subGroup[m].buttonSettings;
                        if (ej.isNullOrUndefined(buttonSet.enabled) && !ej.isNullOrUndefined(buttonDef) && !ej.isNullOrUndefined(buttonDef.enabled))
                            buttonSet.enabled = buttonDef.enabled;
                        if (ej.isNullOrUndefined(buttonSet.enableRTL) && !ej.isNullOrUndefined(buttonDef) && !ej.isNullOrUndefined(buttonDef.enableRTL))
                            buttonSet.enableRTL = buttonDef.enableRTL;
                        if (ej.isNullOrUndefined(buttonSet.cssClass) && !ej.isNullOrUndefined(buttonDef) && !ej.isNullOrUndefined(buttonDef.cssClass))
                            buttonSet.cssClass = buttonDef.cssClass;
                        if (ej.isNullOrUndefined(buttonSet.showRoundedCorner) && !ej.isNullOrUndefined(buttonDef) && !ej.isNullOrUndefined(buttonDef.showRoundedCorner))
                            buttonSet.showRoundedCorner = buttonDef.showRoundedCorner;
                    }
                    if (!ej.isNullOrUndefined(subGroup[m].splitButtonSettings)) {
                        var splitButtonSet = subGroup[m].splitButtonSettings;
                        if (ej.isNullOrUndefined(splitButtonSet.enabled) && !ej.isNullOrUndefined(buttonDef) && !ej.isNullOrUndefined(buttonDef.enabled))
                            splitButtonSet.enabled = buttonDef.enabled;
                        if (ej.isNullOrUndefined(splitButtonSet.enableRTL) && !ej.isNullOrUndefined(buttonDef) && !ej.isNullOrUndefined(buttonDef.enableRTL))
                            splitButtonSet.enableRTL = buttonDef.enableRTL;
                        if (ej.isNullOrUndefined(splitButtonSet.cssClass) && !ej.isNullOrUndefined(buttonDef) && !ej.isNullOrUndefined(buttonDef.cssClass))
                            splitButtonSet.cssClass = buttonDef.cssClass;
                        if (ej.isNullOrUndefined(splitButtonSet.showRoundedCorner) && !ej.isNullOrUndefined(buttonDef) && !ej.isNullOrUndefined(buttonDef.showRoundedCorner))
                            splitButtonSet.showRoundedCorner = buttonDef.showRoundedCorner;
                    }
                    if (!ej.isNullOrUndefined(subGroup[m].toggleButtonSettings)) {
                        if (ej.isNullOrUndefined(subGroup[m].toggleButtonSettings.enabled) && !ej.isNullOrUndefined(buttonDef) && !ej.isNullOrUndefined(buttonDef.enabled))
                            subGroup[m].toggleButtonSettings.enabled = buttonDef.enabled;
                        if (ej.isNullOrUndefined(subGroup[m].toggleButtonSettings.enableRTL) && !ej.isNullOrUndefined(buttonDef) && !ej.isNullOrUndefined(buttonDef.enableRTL))
                            subGroup[m].toggleButtonSettings.enableRTL = buttonDef.enableRTL;
                        if (ej.isNullOrUndefined(subGroup[m].toggleButtonSettings.cssClass) && !ej.isNullOrUndefined(buttonDef) && !ej.isNullOrUndefined(buttonDef.cssClass))
                            subGroup[m].toggleButtonSettings.cssClass = buttonDef.cssClass;
                        if (ej.isNullOrUndefined(subGroup[m].toggleButtonSettings.showRoundedCorner) && !ej.isNullOrUndefined(buttonDef) && !ej.isNullOrUndefined(buttonDef.showRoundedCorner))
                            subGroup[m].toggleButtonSettings.showRoundedCorner = buttonDef.showRoundedCorner;
                    }
                    if (ej.isNullOrUndefined(subGroup[m].quickAccessMode))
                        subGroup[m].quickAccessMode = "none";
                    switch (subGroup[m].type) {
                        case ej.Ribbon.Type.SplitButton:
                            split = subGroup[m];
                            model = {}
                            if (split.splitButtonSettings)
                                model = JSON.parse(JSON.stringify(split.splitButtonSettings));
                            model.height = ej.isNullOrUndefined(model.height) ? subGroup[m].height : model.height;
                            model.width = ej.isNullOrUndefined(model.width) ? subGroup[m].width : model.width;
                            if (model.cssClass)
                                model.cssClass = model.cssClass.concat(" e-rbn-splitbtn e-rbn-button");
                            else
                                model.cssClass = "e-rbn-splitbtn e-rbn-button";
                            model.enableRTL = this.model.enableRTL;
                            if (split.quickAccessMode != "none" && this.model.showQAT) {
                                this._splitButtonQAT = ej.buildTag("button#" + this._id + "_" + split.id + "_qatEle", split.text, {}, { type: "button" }).addClass(split.cssClass);
                                var qatMainDiv = ej.buildTag("div#" + this._id + "_" + split.id + "_qatDiv", this._splitButtonQAT).addClass('e-qatooldiv');
                                qatOrder.append(qatMainDiv);
                                model.height = 30;
                                model.arrowPosition = ej.ArrowPosition.Right;
                                model.contentType = ej.ContentType.ImageOnly;
                                if (!$.isEmptyObject(split.customToolTip))
                                    qatMainDiv.mouseover({ value: split, ribbonId: this._id }, $.proxy(this._tooltip, this)).mouseout({ ribbonId: this._id }, $.proxy(this._toolTipOut, this));
                                else if (!ej.isNullOrUndefined(split.toolTip))
                                    qatMainDiv.attr("title", split.toolTip);
                                this._splitButtonQAT.ejSplitButton(model);
                                if (split.quickAccessMode == "menu")
                                    qatMainDiv.hide();
                                var btnText;
                                if (!ej.isNullOrUndefined(split.text))
                                    btnText = split.text;
                                else if (!ej.isNullOrUndefined(split.splitButtonSettings.text))
                                    btnText = split.splitButtonSettings.text;
                                qatControls.push({ id: split.id, text: btnText, qAccess: split.quickAccessMode });
                            }
                            break;
                        case ej.Ribbon.Type.ToggleButton:
                            toggle = subGroup[m];
                            model = {}
                            if (toggle.toggleButtonSettings)
                                model = JSON.parse(JSON.stringify(toggle.toggleButtonSettings));
                            model.height = ej.isNullOrUndefined(model.height) ? subGroup[m].height : model.height;
                            model.width = ej.isNullOrUndefined(model.width) ? subGroup[m].width : model.width;
                            if (toggle.quickAccessMode != "none" && this.model.showQAT) {
                                this._toggleButtonQAT = ej.buildTag("input#" + this._id + "_" + toggle.id + "_qatEle", "", "", { type: "checkbox" }).addClass(toggle.cssClass);
                                var qatMainDiv = ej.buildTag("div#" + this._id + "_" + toggle.id + "_qatDiv", this._toggleButtonQAT).addClass('e-qatooldiv e-rbn-button');
                                model.height = 30;
                                model.contentType = ej.ContentType.ImageOnly;
                                if (!$.isEmptyObject(toggle.customToolTip))
                                    qatMainDiv.mouseover({ value: toggle, ribbonId: this._id }, $.proxy(this._tooltip, this)).mouseout({ ribbonId: this._id }, $.proxy(this._toolTipOut, this));
                                else if (!ej.isNullOrUndefined(toggle.toolTip))
                                    qatMainDiv.attr("title", toggle.toolTip);
                                this._toggleButtonQAT.ejToggleButton(model).addClass('e-ribbonbtn');
                                qatMainDiv.find('button').addClass('e-rbn-button');
                                qatOrder.append(qatMainDiv);
                                if (toggle.quickAccessMode == "menu")
                                    qatMainDiv.hide();
                                var btnText;
                                if (!ej.isNullOrUndefined(toggle.text))
                                    btnText = toggle.text;
                                else if (!ej.isNullOrUndefined(toggle.toggleButtonSettings.defaultText))
                                    btnText = toggle.toggleButtonSettings.defaultText;
                                qatControls.push({ id: toggle.id, text: btnText, qAccess: toggle.quickAccessMode });
                            }
                            break;
                        case ej.Ribbon.Type.Button:
                            button = subGroup[m];
                            model = {}
                            if (button.buttonSettings)
                                model = JSON.parse(JSON.stringify(button.buttonSettings));
                            model.height = ej.isNullOrUndefined(model.height) ? subGroup[m].height : model.height;
                            model.width = ej.isNullOrUndefined(model.width) ? subGroup[m].width : model.width;
                            if (button.quickAccessMode != "none" && this.model.showQAT) {
                                if (button.buttonSettings) {
                                    if (button.buttonSettings.type)
                                        this._buttonQAT = ej.buildTag("button#" + this._id + "_" + button.id + "_qatEle", button.text, {}, { type: button.buttonSettings.type }).addClass(button.cssClass);
                                    else
                                        this._buttonQAT = ej.buildTag("button#" + this._id + "_" + button.id + "_qatEle", button.text).addClass(button.cssClass);
                                }
                                else
                                    this._buttonQAT = ej.buildTag("button#" + this._id + "_" + button.id + "_qatEle", button.text).addClass(button.cssClass);
                                var qatMainDiv = ej.buildTag("div#" + this._id + "_" + button.id + "_qatDiv", this._buttonQAT).addClass('e-qatooldiv');
                                model.height = 30;
                                model.contentType = ej.ContentType.ImageOnly;
                                if (!$.isEmptyObject(button.customToolTip))
                                    qatMainDiv.mouseover({ value: button, ribbonId: this._id }, $.proxy(this._tooltip, this)).mouseout({ ribbonId: this._id }, $.proxy(this._toolTipOut, this));
                                else if (!ej.isNullOrUndefined(button.toolTip))
                                    qatMainDiv.attr("title", button.toolTip);
                                this._buttonQAT.ejButton(model).addClass('e-ribbonbtn e-rbn-button');
                                qatOrder.append(qatMainDiv);
                                if (button.quickAccessMode == "menu")
                                    qatMainDiv.hide();
                                var btnText;
                                if (!ej.isNullOrUndefined(button.text))
                                    btnText = button.text;
                                else if (!ej.isNullOrUndefined(button.buttonSettings.text))

                                    btnText = button.buttonSettings.text;
                                qatControls.push({ id: button.id, text: btnText, qAccess: button.quickAccessMode });
                            }
                            break;
                    }

                }

            }
            qatOrder.children().prependTo(this._qAccessBar);
            this._qatControlsName = $.merge(qatControls, this._qatControlsName)
        },
        _resizeTabName: function (text) {
            if (!ej.isNullOrUndefined(this.model.tabs)) {
                for (var i = 0; i < this.model.tabs.length; i++) {
                    if (this.model.tabs[i].text === text) {
                        var tabIndex = $(this._tabUl.find('.e-tab')[i]);
                        return tabIndex;
                    }
                }
            }
            if (!ej.isNullOrUndefined(this.model.contextualTabs)) {
                for (var i = 0; i < this.model.contextualTabs.length; i++) {
                    for (var j = 0; j < this.model.contextualTabs[i].tabs.length; j++) {
                        if (this.model.contextualTabs[i].tabs[j].text === text) {
                            var tabIndex = $(this._tabUl.find('.e-contextliset')[i]).children().find('.e-contextualtabset').eq(j);
                            return tabIndex;
                        }
                    }
                }
            }
        },
        hideTab: function (text) {
            var index = this._tabText.map(function (index) { if ($(this).text() === text) return index; })[0], updatedindex, disLen = this._tabObj.model.disabledItemIndex.length, hide = true, conTab;
            this._width = this.element.width();
            if (ej.isNullOrUndefined(index)) {
                var tabElement = this._resizeTabName(text)
                if (this._phoneMode) {
                    tabElement = this._responsiveTabText.filter(function (index) { return $(this).text() === text; });
                    this.element.find(".e-responsivetabheader").addClass("e-resshow");
                }
                if (!ej.isNullOrUndefined(tabElement))
                    tabElement.hide();
            }
            var hiddenTabId = this.element.find('.e-link').eq(index).attr('href');
            conTab = this._tabText.filter(function (index) { return $(this).text() === text; }).parents(".e-contextualtabset");
            for (var i = 0; i < disLen; i++) {
                if (this._tabObj.model.disabledItemIndex[i] === index)
                    hide = false;
            }
            if (hide) {
                if (conTab.length > 0) {
                    conTab.hide();
                    this._responsiveTabText.eq(!ej.isNullOrUndefined(this.model.applicationTab) ? index - 1 : index).hide();
                }
                else {
                    this._tabText.filter(function (index) { return $(this).text() === text; }).parent().hide();
                    this._responsiveTabText.eq(!ej.isNullOrUndefined(this.model.applicationTab) ? index - 1 : index).hide();
                }
                if ($(hiddenTabId).hasClass('e-active-content')) {
                    $(hiddenTabId).hide();
                    $(hiddenTabId).removeClass('e-active-content');
                }
            }
            if (this._tabUl.find('.e-active').is(':hidden')) {
                if (this._phoneMode) {
                    this.element.find(".e-responsivetabheader").addClass("e-resshow");
                    updatedindex = this._getVisibleItemIndex(this._responsiveTabText);
                }
                else
                    updatedindex = this._getVisibleItemIndex(this._tabText);
                if (updatedindex) {
                    var currentTab = this.element.find('.e-link').eq(updatedindex).attr('href');
                    if ($(this._tabText[updatedindex]).parent().hasClass('e-disable')) {
                        $(this._tabText[index]).parent().removeClass('e-active');
                        $(this._tabText[updatedindex]).parent().addClass('e-active')
                        $(currentTab).append(this.element.find("#" + this._id + "_disabled"));
                        $(currentTab).css("position", "relative");
                        this.element.find("#" + this._id + "_disabled").show();
                        $(currentTab).show();
                        this._tabObj.option("selectedItemIndex", updatedindex);
                    }
                    else
                        this._tabObj.option("selectedItemIndex", updatedindex);
                    this._tabObj.model.selectedItemIndex = updatedindex;
                    this.model.selectedItemIndex = updatedindex;
                }
            }
            if (this.element.hasClass("e-responsive"))
                this.element.find(".e-responsivetabheader").removeClass("e-resshow");
        },

        showTab: function (text) {
            var index = this._tabText.map(function (index) { if ($(this).text() === text) return index; })[0], conTab;
            if (ej.isNullOrUndefined(index)) {
                var tabElement = this._resizeTabName(text)
                if (this._phoneMode) {
                    tabElement = this._responsiveTabText.filter(function (index) { return $(this).text() === text; });
                    this.element.find(".e-responsivetabheader").addClass("e-resshow");
                }
                if (!ej.isNullOrUndefined(tabElement))
                    tabElement.show();
            }
            var Tab = this._tabText.filter(function (index) { return $(this).text() === text; }).parent();
            conTab = this._tabText.filter(function (index) { return $(this).text() === text; }).parents(".e-contextualtabset");
            if (conTab.length > 0) {
                conTab.show();
                this._responsiveTabText.eq(!ej.isNullOrUndefined(this.model.applicationTab) ? index - 1 : index).show();
            }
            else {
                this._tabText.filter(function (index) { return $(this).text() === text; }).parent().show();
                this._responsiveTabText.eq(!ej.isNullOrUndefined(this.model.applicationTab) ? index - 1 : index).show();
            }
			var tabContent = this.element.find(".e-content").eq(index);
            if (!Tab.hasClass('e-active'))
                Tab.addClass('e-select');
			else if(tabContent.css("display") == "none")
			    tabContent.show();
            if (this.element.hasClass("e-responsive"))
                this.element.find(".e-responsivetabheader").removeClass("e-resshow");
        },
        hideGroups: function (tabId, groupText) {
            if (typeof groupText == "string")
                $("#" + this._id + "_" + tabId + "_" + groupText).hide();
            else {
                for (var i = 0; i < groupText.length; i++) {
                    $("#" + this._id + "_" + tabId + "_" + groupText[i]).hide();
                }
            }
        },
        showGroups: function (tabId, groupText) {
            if (typeof groupText == "string")
                $("#" + this._id + "_" + tabId + "_" + groupText).show();
            else {
                for (var i = 0; i < groupText.length; i++) {
                    $("#" + this._id + "_" + tabId + "_" + groupText[i]).show();
                }
            }
        },
        hideGroupItems: function (tabId, groupText, subGroupId) {
            if (typeof subGroupId == "string")
                $("#" + this._id + "_" + tabId + "_" + groupText + "_" + subGroupId).hide();
            else {
                for (var i = 0; i < subGroupId.length; i++) {
                    $("#" + this._id + "_" + tabId + "_" + groupText + "_" + subGroupId[i]).hide();
                }
            }

        },
        showGroupItems: function (tabId, groupText, subGroupId) {
            if (typeof subGroupId == "string")
                $("#" + this._id + "_" + tabId + "_" + groupText + "_" + subGroupId).show();
            else {
                for (var i = 0; i < subGroupId.length; i++) {
                    $("#" + this._id + "_" + tabId + "_" + groupText + "_" + subGroupId[i]).show();
                }
            }
        },
        _getVisibleItemIndex: function (items) {
            var i = 1;
            while (i < items.length) {
                if ($(items[i]).is(":visible"))
                    return i;
                i++;
            }
        },
        removeApplicationTab:function(){
		 this._ribbonTabs = this._tabUl.find(".e-link").parent();
                    href = this._ribbonTabs.eq(0).children().attr("href");
                    curTab = this._ribbonTabs.eq(0);
					if(curTab.hasClass("e-apptab"))
					{
				     this._tabObj.contentPanels.splice(0,1);
				     this._tabObj.items.splice(0,1);
					 this._tabObj.selectedItemIndex(this._tabObj.model.selectedItemIndex-1);
					 curTab.remove();
					 $(href).remove();
					 $(this._tabUl.find(".e-link").parent('.e-active')).find('a').addClass("e-removeapptab");
					 var tabLi=this._tabUl.find('li').eq(0);
					 if(!tabLi.hasClass('e-disable') && !tabLi.hasClass('e-apptab'))
					  {
					   this._tabObj.option({ enabledItemIndex: [0] });
					   this.model.disabledItemIndex.splice(0);
					  }
					  this.element.addClass('e-ribwithout-apptab');
					  this._ribbonWindowResize();
					}
		},
        removeTab: function (tabIndex) {
            var curTab, href, args, expandCollapse;
            if (this._tabObj.model) {
                if (tabIndex > 0) {
                    args = { index: tabIndex };
                    this._trigger("beforeTabRemove", args);
                    this._ribbonTabs = this._tabUl.find(".e-link").parent();
                    href = this._ribbonTabs.eq(tabIndex).children().attr("href");
                    curTab = this._ribbonTabs.eq(tabIndex);
                    if (this._phoneMode) curResTab = this._responsiveTabText.eq(tabIndex - 1);
                    if (curTab.hasClass("e-contextualtab"))
                        curTab.parent().remove();
                    else if (curTab.hasClass("e-contextualtabset")) {
                        if (curTab.siblings('.e-contextualtabset').length === 0)
                            curTab.parent().remove();
                        else
                            curTab.remove();
                    }
                    else
                        curTab.remove();
                    if (this._phoneMode) curResTab.remove();
                    this._responsiveTabText = this.element.find(".e-responsivetabheader li");
                    expandCollapse = this.element.find(".e-expandcollapse");
                    $(href).remove();
                    this._ribbonTabs = this._tabUl.find(".e-link").parent();
                    if (this._tabObj.model.selectedItemIndex === tabIndex) {
                        curTab = this._ribbonTabs.eq(tabIndex);
                        if (this._phoneMode) {
                            curResTab = this._responsiveTabText.eq(tabIndex - 1);
                            curResTab.addClass("e-resactive");
                            this.element.find(".e-ribresmenu .e-reslink").text(this._responsiveTabText.filter(".e-resactive").text());
                        }
                        curTab.addClass("e-active");
                        href = curTab.children().attr("href");
                        $(href).append(expandCollapse.click($.proxy(this._tabExpandCollapse, this)));
                        $(href).addClass("e-active-content e-activetop").show();
                    }
                    if (this._isCollapsed)
                        this.element.find(this._ribbonTabs.eq(tabIndex).children().attr("href")).append(expandCollapse.click($.proxy(this._tabExpandCollapse, this)));
                    this._tabObj.contentPanels.splice(tabIndex, 1);
                    this._tabObj.items.splice(tabIndex, 1);
					this.model.tabs.splice(tabIndex-1,1);
                    if (this._phoneMode) {
                        this._mobileContents.splice(tabIndex - 1, 1);
                        this._mobileToolbar.splice(tabIndex - 1, 1);
                        this._ribbonWindowResize();
                    }
                    args = { removedIndex: tabIndex };
                    this._trigger("tabRemove", args);
                }
            }
        },
        removeTabGroup: function (tabIndex, groupText) {
            var tabGroup, curTab, curGrp, conTabIndex, conTabGrp;
            tabGroup = $($('.e-ribbon .e-content')[tabIndex]).find('.e-groupdiv');
            curTab = this._tabUl.find('.e-select,.e-active').eq(tabIndex);
            if ($(curTab).hasClass('e-tab')) {
                curGrp = this.model.tabs[tabIndex - 1].groups;
                for (i = 0; i < curGrp.length; i++) {
                    if (curGrp[i].text == groupText) {
                        curGrp.splice(i, 1);
                        $(tabGroup[i]).remove();
                    }
                    else if (ej.isNullOrUndefined(groupText))
                        $(tabGroup[i]).remove();
                }
            }
            else {
                conTabIndex = this.model.tabs.length;
                var contextTabsLen = this.model.contextualTabs.length;
                for (var i = 0; i < this.model.contextualTabs.length; i++) {
                    var contextualTabsLen = this.model.contextualTabs[i].tabs.length;
                    for (var j = 0; j < contextualTabsLen; j++) {
                        ++conTabIndex;
                        if (conTabIndex === tabIndex) {
                            conTabGrp = this.model.contextualTabs[i].tabs[j].groups;
                            var contTabGrpLen=conTabGrp.length;
                            for (var k = 0; k < contTabGrpLen; k++) {
                                if (conTabGrp[k].text == groupText) {
                                    conTabGrp.splice(k, 1);
                                    $(tabGroup[k]).remove();
                                }
                                else if (ej.isNullOrUndefined(groupText))
                                    $(tabGroup[k]).remove();
                            }
                        }
                    }
                }
            }
        },
        _addTabGrpIntoCollec: function (ribTabs,tabGroup,grpIndex) {
           var grpCheck=tabGroup.length,gIndex=grpIndex;
           if($.isPlainObject(tabGroup))
             grpCheck=1;
           for(var v=0;v<grpCheck;v++){
		     var grp=tabGroup;
             if(!$.isPlainObject(tabGroup)){
              grp= tabGroup[v];
			  if(v>0)
			   ++gIndex;
			   }
              ribTabs.groups.splice(gIndex, 0, grp);
            }
           return ribTabs;
        },
        addTabGroup: function (tabIndex, tabGroup, grpIndex) {
            var tabContent, conTabIndex = 0, grpLen = 0, tabs, curTab, tabGroupText, contDiv, groupDiv;
            curTab = this._tabUl.find('.e-select,.e-active').eq(tabIndex);
            tabContent = curTab.children('a').attr('href');
            if ($(curTab).hasClass('e-tab')) {
                var tabsLen = this.model.tabs.length;
                for (var i = 0; i < tabsLen; i++) {
                    if (i === tabIndex - 1) {
                        grpLen = this.model.tabs[i].groups.length;
                        if (ej.isNullOrUndefined(grpIndex))
                            grpIndex = grpLen;
                        tabs = this._addTabGrpIntoCollec(this.model.tabs[i],tabGroup,grpIndex);
                    }
                }
            }
            else {
                conTabIndex = this.model.tabs.length;
                var contextTabsLen = this.model.contextualTabs.length;
                for (var i = 0; i < contextTabsLen; i++) {
                    var contextualTabsLen = this.model.contextualTabs[i].tabs.length;
                    for (var j = 0; j < contextualTabsLen; j++) {
                        ++conTabIndex;
                        if (conTabIndex === tabIndex) {
                            grpLen = this.model.contextualTabs[i].tabs[j].groups.length;
                            if (ej.isNullOrUndefined(grpIndex))
                                grpIndex = grpLen;
                            tabs = this._addTabGrpIntoCollec( this.model.contextualTabs[i].tabs[j],tabGroup,grpIndex);
                        }
                    }
                }
            }
            if (!ej.isNullOrUndefined(tabs.groups[grpIndex]) && (!this.element.find(".e-content.e-content-item").eq(tabIndex).hasClass("e-rbn-ondemand"))) {
			  var grpCheck=tabGroup.length,gIndex=grpIndex;
              if($.isPlainObject(tabGroup))
               grpCheck=1;
              for(var v=0;v<grpCheck;v++){
               if(!$.isPlainObject(tabGroup) && v>0)
                ++gIndex;
               tabGroupText = ej.isNullOrUndefined(tabs.groups[gIndex].id) ? (ej.isNullOrUndefined(tabs.groups[gIndex].text) ? tabs.groups[gIndex].text : tabs.groups[gIndex].text.replace(/\s/g, '')) : tabs.groups[gIndex].id.replace(/\s/g, ''); 
               contDiv = this._createControls(gIndex, tabs, tabGroupText, tabIndex);
               groupDiv = this._addControlsToGroup(gIndex, tabs, tabGroupText, contDiv);
               if ($(tabContent).children().eq(gIndex).length > 0)
                $(tabContent).children().eq(gIndex).before(groupDiv);
               else
                $(tabContent).append(groupDiv);
              }
			  if($(tabContent).hasClass('e-empty-content'))
               $(tabContent).removeClass('e-empty-content');
             }
            if(!$(tabContent).hasClass('e-parentdiv'))
             $(tabContent).addClass('e-parentdiv');
            this._setTabContentHeight();
        },

        addTabGroupContent: function (tabIndex, grpIndex, content, contentIndex, subGrpIndex) {
            var tabContent, conTabIndex = 0, tabs, curTab, tabGroupText, contDiv, grpContent, subGroup, separator, grpContentDiv, grpHeight, alignType, isNewGroup = false, contInnerDiv;
            curTab = this._tabUl.find('.e-select,.e-active').eq(tabIndex);
            tabContent = curTab.children('a').attr('href');
            if (ej.isNullOrUndefined(contentIndex))
                contentIndex = 0;
            if (ej.isNullOrUndefined(subGrpIndex)) subGrpIndex = 0;
            if (curTab.hasClass('e-tab')) {
                var tabsLen = this.model.tabs.length;
                for (var i = 0; i < tabsLen; i++)
                    if (i === tabIndex - 1)
                        if (!ej.isNullOrUndefined(this.model.tabs[i].groups[grpIndex].content)) {
                            alignType = this.model.tabs[i].groups[grpIndex].alignType;
                            if (contentIndex == 0 || !ej.isNullOrUndefined(this.model.tabs[i].groups[grpIndex].content[contentIndex - 1])) {
                                if (ej.isNullOrUndefined(this.model.tabs[i].groups[grpIndex].content[contentIndex])) {
                                    this.model.tabs[i].groups[grpIndex].content[contentIndex] = content;
                                    isNewGroup = true;
                                }
                                else
                                    this.model.tabs[i].groups[grpIndex].content[contentIndex].groups.splice(subGrpIndex, 0, content);
                                tabs = this.model.tabs[i];
                            }
                        }
            }
            else {
                conTabIndex = this.model.tabs.length;
                var contextTabsLen = this.model.contextualTabs.length;
                for (var i = 0; i < contextTabsLen; i++) {
                    var contextualTabsLen = this.model.contextualTabs[i].tabs.length;
                    for (var j = 0; j < contextualTabsLen; j++) {
                        ++conTabIndex;
                        if (conTabIndex === tabIndex)
                            if (!ej.isNullOrUndefined(this.model.contextualTabs[i].tabs[j].groups[grpIndex].content)) {
                                alignType = this.model.contextualTabs[i].tabs[j].groups[grpIndex].alignType
                                if (ej.isNullOrUndefined(contentIndex))
                                    contentIndex = this.model.contextualTabs[i].tabs[j].groups[grpIndex].content[0].groups.length;
                                if (contentIndex == 0 || !ej.isNullOrUndefined(this.model.contextualTabs[i].tabs[j].groups[grpIndex].content[contentIndex - 1])) {
                                    if (ej.isNullOrUndefined(this.model.contextualTabs[i].tabs[j].groups[grpIndex].content[contentIndex])) {
                                        this.model.contextualTabs[i].tabs[j].groups[grpIndex].content[contentIndex] = content;
                                        isNewGroup = true;
                                    }
                                    else
                                        this.model.contextualTabs[i].tabs[j].groups[grpIndex].content[contentIndex].groups.splice(subGrpIndex, 0, content);
                                    tabs = this.model.contextualTabs[i].tabs[j];
                                }
                            }
                    }
                }
            }
            if (!ej.isNullOrUndefined(tabs) && !ej.isNullOrUndefined(tabs.groups[grpIndex]) && (!this.element.find(".e-content.e-content-item").eq(tabIndex).hasClass("e-rbn-ondemand"))) {
                tabGroupText = ej.isNullOrUndefined(tabs.groups[grpIndex].id) ?  (ej.isNullOrUndefined(tabs.groups[grpIndex].text) ? tabs.groups[grpIndex].text : tabs.groups[grpIndex].text.replace(/\s/g, '')): tabs.groups[grpIndex].id.replace(/\s/g, ''); 
                contDiv = this._createControls(grpIndex, tabs, tabGroupText, tabIndex);
                grpContentDiv = ej.buildTag("div");
                contInnerDiv = contDiv.find(".e-innerdiv,.e-innerdivrow").eq(contentIndex).find(".e-controlpadding");
                grpContent = isNewGroup ? contInnerDiv : contInnerDiv.eq(subGrpIndex);
                separator = contDiv.find("#" + grpContent.attr("id")).next();
                if (separator.hasClass("e-separatordivrow"))
                    grpContentDiv.append(separator);
                grpContentDiv.prepend(grpContent);
                subGroup = $(tabContent).children().eq(grpIndex).find(".e-innerdiv,.e-innerdivrow").eq(contentIndex);
                if (!subGroup.length > 0) {
                    var div;
                    if (alignType == ej.Ribbon.alignType.columns)
                        div = ej.buildTag("div#" + this._id + "_" + tabs.id + "_" + tabGroupText + "_" + (contentIndex + 1)).addClass("e-innerdiv");
                    else
                        div = ej.buildTag("div#" + this._id + "_" + tabs.id + "_" + tabGroupText + "_" + (contentIndex + 1)).addClass("e-innerdivrow");
                    $(tabContent).children().eq(grpIndex).find(".e-ribGroupContent").append(div);
                    subGroup = $(tabContent).children().eq(grpIndex).find(".e-innerdiv,.e-innerdivrow").eq(contentIndex);
                }
                grpHeight = $(subGroup).parent().height();
                if (subGroup.find(".e-controlpadding").eq(subGrpIndex).length > 0)
                    subGroup.find(".e-controlpadding").eq(subGrpIndex).before(grpContentDiv.children());
                else
                    subGroup.append(grpContentDiv.children());
                if ($(subGroup).parent().height() > grpHeight)
                    this.element.find(".e-content").height(this.element.find(".e-content").height() + ($(subGroup).parent().height() - grpHeight));
                contDiv.children().remove();
			    if($(tabContent).hasClass('e-empty-content'))
                 $(tabContent).removeClass('e-empty-content');
                this._setTabContentHeight();
            }
        },
        removeTabGroupContent: function (tabIndex, groupText, contentIndex, subGrpIndex) {
            var tabGroup, curTab, curGrp, conTabIndex, conTabGrp, conLegth, tabContent, conDiv, innerDiv;
            tabGroup = $($('.e-ribbon .e-content')[tabIndex]).find('.e-groupdiv');
            curTab = this._tabUl.find('.e-select,.e-active').eq(tabIndex);
            tabContent = curTab.children('a').attr('href');
            if ($(curTab).hasClass('e-tab')) {
                curGrp = this.model.tabs[tabIndex - 1].groups;
                var curGrpLen = curGrp.length;
                for (i = 0; i < curGrpLen; i++) {
                    if (curGrp[i].text == groupText) {
                        if (!ej.isNullOrUndefined(contentIndex)) {
                            if (!ej.isNullOrUndefined(subGrpIndex) && !ej.isNullOrUndefined(curGrp[i].content[contentIndex].groups)) {
                                conTabGrp = curGrp[i].content[contentIndex].groups;
                                innerDiv = $(tabContent).children(".e-groupdiv").eq(i).find(".e-innerdiv,.e-innerdivrow");
                                if (this._phoneMode && this.element.find(".e-responsivecontent").is(":visible") && innerDiv.length == 0) {
                                    innerDiv = this.element.find(".e-responsivecontent").find(".e-innerdiv,.e-innerdivrow");
                                }
                                conDiv = innerDiv.eq(contentIndex);
                                for (j = 0; j < conDiv.children().length; j++) {
                                    conTabGrp.splice(j, 1);
                                }
                                conDiv.children().eq(subGrpIndex).remove();
                                if (innerDiv.children().length == 0) {
                                    innerDiv.remove();
                                }
                            }
                            else {
                                conTabGrp = curGrp[i].content[contentIndex];
                                innerDiv = $(tabContent).children(".e-groupdiv").eq(i).find('.e-innerdiv,.e-innerdivrow');
                                if (this._phoneMode && this.element.find(".e-responsivecontent").is(":visible") && innerDiv.length == 0) {
                                    innerDiv = this.element.find(".e-responsivecontent").find(".e-innerdiv,.e-innerdivrow");
                                }
                                innerDiv.eq(contentIndex).children().remove();
                                conTabGrp.groups.splice(0, conTabGrp.groups.length);
                            }
                        }
                        else if (curGrp[i].type === ej.Ribbon.type.custom && curGrp[i].text == groupText && ej.isNullOrUndefined(curGrp[i].content)) {
                            innerDiv = $(tabContent).find(".e-groupdiv").eq(i).find(".e-ribGroupContent");
                            if (this._phoneMode && this.element.find(".e-responsivecontent").is(":visible") && innerDiv.length == 0) {
                                innerDiv = this.element.find(".e-responsivecontent").find(".e-ribGroupContent");
                            }
                            innerDiv.children().remove();
                            curGrp[i].contentID = null;
                        }
                        else if (curGrp[i].text == groupText && ej.isNullOrUndefined(contentIndex)) {
                            conTabGrp = curGrp[i].content;
                            if (!ej.isNullOrUndefined(conTabGrp)) {
                                conlen = curGrp[i].content.length;
                                for (var l = 0; l < conlen; l++)
                                    conTabGrp[l].groups.splice(0, conTabGrp[l].groups.length);
                            }
                            innerDiv = $(tabContent).find(".e-groupdiv").eq(i).find(".e-ribGroupContent");
                            if (this._phoneMode && this.element.find(".e-responsivecontent").is(":visible") && innerDiv.length == 0) {
                                innerDiv = this.element.find(".e-responsivecontent").find(".e-ribGroupContent");
                            }
                            innerDiv.children().remove();
                        }
                    }
                }
            }
            else {
                conTabIndex = this.model.tabs.length;
                var contextTabsLen = this.model.contextualTabs.length
                for (var i = 0; i < contextTabsLen; i++) {
                    var contextualTabsLen = this.model.contextualTabs[i].tabs.length
                    for (var j = 0; j < contextualTabsLen; j++) {
                        ++conTabIndex;
                        if (conTabIndex === tabIndex) {
                            conTabGrp = this.model.contextualTabs[i].tabs[j].groups;
                            var conTabGrpLen = conTabGrp.length;
                            for (var k = 0; k < conTabGrpLen; k++) {
                                if (conTabGrp[k].text == groupText) {
                                    if (!ej.isNullOrUndefined(contentIndex)) {
                                        if (!ej.isNullOrUndefined(subGrpIndex) && !ej.isNullOrUndefined(conTabGrp[k].content[contentIndex].groups)) {
                                            contTabGrp = conTabGrp[k].content[contentIndex].groups;
                                            innerDiv = $(tabContent).children(".e-groupdiv").eq(k).find(".e-innerdiv,.e-innerdivrow");
                                            if (this._phoneMode && this.element.find(".e-responsivecontent").is(":visible") && innerDiv.length == 0) {
                                                innerDiv = this.element.find(".e-responsivecontent").find(".e-innerdiv,.e-innerdivrow");
                                            }
                                            conDiv = innerDiv.eq(contentIndex);
                                            for (m = 0; m < conDiv.children().length; m++) {
                                                contTabGrp.splice(m, 1);
                                            }
                                            conDiv.children().eq(subGrpIndex).remove();
                                            if (innerDiv.children().length == 0)
                                                innerDiv.remove();
                                        }
                                        else {
                                            contTabGrp = conTabGrp[k].content[contentIndex];
                                            innerDiv = $(tabContent).children(".e-groupdiv").eq(k).find('.e-innerdiv,.e-innerdivrow');
                                            if (this._phoneMode && this.element.find(".e-responsivecontent").is(":visible") && innerDiv.length == 0) {
                                                innerDiv = this.element.find(".e-responsivecontent").find(".e-innerdiv,.e-innerdivrow");
                                            }
                                            innerDiv.eq(contentIndex).children().remove();
                                            contTabGrp.groups.splice(0, contTabGrp.groups.length);
                                        }
                                    }
                                    else if (conTabGrp[k].type === ej.Ribbon.type.custom && conTabGrp[k].text == groupText && ej.isNullOrUndefined(conTabGrp[k].content)) {
                                        innerDiv = $(tabContent).find(".e-groupdiv").eq(k).find(".e-ribGroupContent");
                                        if (this._phoneMode && this.element.find(".e-responsivecontent").is(":visible") && innerDiv.length == 0) {
                                            innerDiv = this.element.find(".e-responsivecontent").find(".e-ribGroupContent");
                                        }
                                        innerDiv.children().remove();
                                        conTabGrp[k].contentID = null;
                                    }
                                    else if (ej.isNullOrUndefined(contentIndex)) {
                                        contTabGrp = conTabGrp[k].content;
                                        if (!ej.isNullOrUndefined(contTabGrp)) {
                                            conlen = conTabGrp[k].content.length;
                                            for (var l = 0; l < conlen; l++)
                                                contTabGrp[l].groups.splice(0, contTabGrp[l].groups.length);
                                        }
                                        innerDiv = $(tabContent).find(".e-groupdiv").eq(k).find(".e-ribGroupContent");
                                        if (this._phoneMode && this.element.find(".e-responsivecontent").is(":visible") && innerDiv.length == 0) {
                                            innerDiv = this.element.find(".e-responsivecontent").find(".e-ribGroupContent");
                                        }
                                        innerDiv.children().remove();
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        addTab: function (tabText, ribbonGroups, index) {
            var rTab = { id: tabText.replace(/\s/g, ''), text: tabText, groups: ribbonGroups }, tabLen = this.model.tabs.length, ribbonModel, newTab, tabcont, args;
            if (ej.isNullOrUndefined(index))
                index = this._tabUl.find(".e-select,.e-active").length;
            if (index > 0) {
                this._conTabsRemove();
                this._tabObj.addItem("#" + this._id + "_" + tabText.replace(/\s/g, ''), tabText, index);
                if (this._tabUl.find('.e-ribresmenu').nextAll('li.e-select').length > 0) {
                    var liTag = this._tabUl.find(".e-select,.e-active").not('.e-apptab,.e-tab');
                    liTag.insertBefore(this._tabUl.find('.e-ribresmenu'));
                }
                this._contextualTabs();
                this._tabUl.find(".e-select,.e-active").eq(index).addClass("e-tab");
                this._tabUl.find(".e-select > a,.e-active > a ").eq(index).addClass("e-link");
                if(ej.isNullOrUndefined(this.model.tabs[0].id)){
				 this.model.tabs[0]=rTab;
                 this._tabObj.showItem(1);
                }
				else
				 this.model.tabs.splice(index - 1, 0, rTab);
                for (i = 0; i < 1; i++) {
                    tabs = this.model.tabs[index - 1];
                    var tabsGrpLen = tabs.groups.length;
					if(tabsGrpLen==0)
                     this.element.find("#" + this._id + "_" + tabs.id).addClass('e-empty-content');
                    for (j = 0; j < tabsGrpLen; j++) {
                        if (!ej.isNullOrUndefined(tabs.groups[j])) {
                            var tabGroupText = ej.isNullOrUndefined(tabs.groups[j].id) ? (ej.isNullOrUndefined(tabs.groups[j].text) ? tabs.groups[j].text : tabs.groups[j].text.replace(/\s/g, '')) : tabs.groups[j].id.replace(/\s/g, ''); 
                            var contDiv = this._createControls(j, tabs, tabGroupText, index);
                            var groupDiv = this._addControlsToGroup(j, tabs, tabGroupText, contDiv);
                            tabcont = this.element.find("#" + this._id + "_" + tabs.id);
                            tabcont.append(groupDiv).addClass("e-parentdiv");
                        }
                    }
                }
                this._setTabContentHeight();
                this.element.find('.e-content.e-content-item').css("box-sizing", "content-box");
				this._ribbonTabs = this._tabUl.find(".e-link").parent();
				this._tabContents = this.element.children().attr('role', 'tablist').not('.e-header,.e-disable,.e-resizediv,.e-tooltipdiv,.e-ribbonbackstagepage');
                this._applicationTab.click($.proxy(this._onApplicationTabClick, this));
                newTab = this._tabUl.find(".e-select,.e-active").eq(index);
                args = { tabHeader: newTab, tabContent: tabcont };
                this._trigger("tabAdd", args);
            }
			this._tabText = this.element.find('.e-link');
            if (this._applicationTab.hasClass('e-active'))
             this._applicationTab.removeClass("e-active");
            if(!$(tabcont).hasClass('e-parentdiv'))
             $(tabcont).addClass('e-parentdiv');
        },

        addContextualTabs: function (contextualTabSet, index) {
            if (!(this._tabUl.find(".e-tab").length < index))
                return;
            var tabSetLen = this.model.contextualTabs.length, ribbonModel,contextTabSetLen;
            if (ej.isNullOrUndefined(index))
                index = this._tabUl.find(".e-select,.e-active").length;
            if (index > 0) {
                this._conTabsRemove();
                contextTabSetLen = contextualTabSet.tabs.length;
                for (var i = 0; i < contextTabSetLen; i++) {
                    if (ej.isNullOrUndefined(this._mobileContents[index - 1])) {
                        this._mobileContents[index - 1] = { "tab": contextualTabSet.tabs[i].text, "mobileContent": [] };
                        this._mobileToolbar[index - 1] = { "tab": contextualTabSet.tabs[i].text, "Content": [] };
                    }
                    else {
                        this._mobileContents.splice(index - 1, 0, { "tab": contextualTabSet.tabs[i].text, "mobileContent": [] });
                        this._mobileToolbar.splice(index - 1, 0, { "tab": contextualTabSet.tabs[i].text, "Content": [] });
                    }
                    this._tabObj.addItem("#" + this._id + "_" + contextualTabSet.tabs[i].id, contextualTabSet.tabs[i].text, index);
                    var liResTag = ej.buildTag("li", contextualTabSet.tabs[i].text).addClass("e-responsivetabli e-resContextual");
                    var check_appTab = $.isEmptyObject(this.model.applicationTab.menuSettings) && ej.isNullOrUndefined(this.model.applicationTab.menuItemID) && ej.isNullOrUndefined(this.model.applicationTab.backstageSettings.pages[0].id);
                    liResTag.insertBefore(this.element.find(".e-rescontent").children(".e-responsivetabli ").eq(index - (!check_appTab ? 1 : 0)));
                    this._responsiveTabText = this.element.find(".e-responsivetabheader li");
                    if (this._tabUl.find('.e-ribresmenu').nextAll('li.e-select').length > 0) {
                        var liTag = this._tabUl.find(".e-select,.e-active").not('.e-apptab,.e-tab');
                        liTag.insertBefore(this._tabUl.find('.e-ribresmenu'));
                    }
                    this._tabUl.find(".e-select,.e-active").eq(index).addClass("e-contextualtabset");
                    this._tabUl.find(".e-select > a ,.e-active > a ").eq(index).addClass("e-link");
                    ++index;
                }
                if (this.model.contextualTabs[0].tabs.length > 0)
                    this.model.contextualTabs.splice(index - 1, 0, contextualTabSet);
                else
                    this.model.contextualTabs[0] = contextualTabSet;
                this._contextualTabs();
                contextTabSetLen = contextualTabSet.tabs.length;
                for (i = 0; i < contextTabSetLen; i++) {
                    tabs = contextualTabSet.tabs[i];
                    var tabGrbLen = tabs.groups.length;
                    for (j = 0; j < tabGrbLen; j++) {
                        if (!ej.isNullOrUndefined(tabs.groups[j])) {
                            var tabGroupText = ej.isNullOrUndefined(tabs.groups[j].id) ? (ej.isNullOrUndefined(tabs.groups[j].text) ? tabs.groups[j].text : tabs.groups[j].text.replace(/\s/g, '')) : tabs.groups[j].id.replace(/\s/g, ''); 
                            var contDiv = this._createControls(j, tabs, tabGroupText);
                            var groupDiv = this._addControlsToGroup(j, tabs, tabGroupText, contDiv);
                            tabcont = this.element.find("#" + this._id + "_" + tabs.id);
                            tabcont.append(groupDiv).addClass("e-parentdiv");
                        }
                    }
                }
                this._setTabContentHeight();
                this.element.find('.e-content.e-content-item').css("box-sizing", "content-box");
				this._ribbonTabs = this._tabUl.find(".e-link").parent();
				this._tabContents = this.element.children().attr('role', 'tablist').not('.e-header,.e-disable,.e-resizediv,.e-tooltipdiv,.e-ribbonbackstagepage');
                this._applicationTab.click($.proxy(this._onApplicationTabClick, this));
            }
        },

        setTabText: function (oldText, newText) {
              var proxy = this;
	          this._tabText.filter(function (index) {
		      var tabText = $(this).text();
    	      if (tabText === oldText) {
             	 proxy.model.tabs[index-1].text = newText; 
		      }		
		      return tabText === oldText;
		      }).text(newText);
		
            if (this._phoneMode) {
                this._responsiveTabText.filter(function (index) { return $(this).text() === oldText; }).text(newText);
                this.element.find(".e-ribresmenu .e-reslink").text(this._responsiveTabText.filter(".e-resactive").text());
            }
        },

        getTabText: function (index) {
            this._tabText = this.element.find(".e-link");
            var tabText = this._tabText.eq(index).text();
            return tabText;
        },

        updateGroup: function (tabIndex, groupId, contentGroup) {
            var curTab, grp, curGroup, contDiv, tabs, tabGroupText, cntGroupId, conTabIndex,grpLen,grpConLen,conGrpLen;
            curTab = this._tabUl.find('.e-select,.e-active').eq(tabIndex);
            if ($(curTab).hasClass('e-tab')) {
                grp = this.model.tabs[tabIndex - 1].groups;
                grpLen = grp.length;
                for (var i = 0; i < grpLen; i++) {
                    if (!ej.isNullOrUndefined(grp[i].content)) {
                        grpConLen = grp[i].content.length;
                        for (var j = 0; j < grpConLen; j++) {
                            conGrpLen = grp[i].content[j].groups.length;
                            for (var k = 0; k < conGrpLen; k++) {
                                if (grp[i].content[j].groups[k].id == groupId) {
                                    var grpContent = grp[i].content[j].groups[k];
                                    if (!ej.isNullOrUndefined(contentGroup.buttonSettings)) {
                                        $.extend(grpContent.buttonSettings, contentGroup.buttonSettings);
                                        $(contentGroup).removeProp('buttonSettings');
                                    }
                                    if (!ej.isNullOrUndefined(contentGroup.dropdownSettings)) {
                                        $.extend(grpContent.dropdownSettings, contentGroup.dropdownSettings);
                                        $(contentGroup).removeProp('dropdownSettings');
                                    }
                                    if (!ej.isNullOrUndefined(contentGroup.toggleButtonSettings)) {
                                        $.extend(grpContent.toggleButtonSettings, contentGroup.toggleButtonSettings);
                                        $(contentGroup).removeProp('toggleButtonSettings');
                                    }
                                    if (!ej.isNullOrUndefined(contentGroup.splitButtonSettings)) {
                                        $.extend(grpContent.splitButtonSettings, contentGroup.splitButtonSettings);
                                        $(contentGroup).removeProp('splitButtonSettings');
                                    }
                                    if (!ej.isNullOrUndefined(contentGroup.customToolTip)) {
                                        $.extend(grpContent.customToolTip, contentGroup.customToolTip);
                                        $(contentGroup).removeProp('customToolTip');
                                    }
                                    $.extend(grpContent, contentGroup);
                                    tabGroupText = ej.isNullOrUndefined(grp[i].id) ? (ej.isNullOrUndefined(grp[i].text) ? grp[i].text : grp[i].text.replace(/\s/g, '')) : grp[i].id.replace(/\s/g, ''); 
                                    tabs = this.model.tabs[tabIndex - 1];
                                    contDiv = this._createControls(i, tabs, tabGroupText,tabIndex);
                                    cntGroupId = "#" + this._id + "_" + tabs.id + "_" + tabGroupText + "_" + groupId;
                                    curGroup = this.element.find(cntGroupId);
                                    groupDiv = contDiv.find(cntGroupId);
                                    curGroup.replaceWith(groupDiv);
                                }
                            }
                        }
                    }
                }
            }
            else {
                conTabIndex = this.model.tabs.length;
                for (var m = 0; m < this.model.contextualTabs.length; m++) {
                    for (var n = 0; n < this.model.contextualTabs[m].tabs.length; n++) {
                        ++conTabIndex;
                        if (conTabIndex === tabIndex) {
                            grp = this.model.contextualTabs[m].tabs[n].groups;
                            grpLen = grp.length;
                            for (var i = 0; i < grpLen; i++) {
                                if (!ej.isNullOrUndefined(grp[i].content)) {
                                    grpConLen = grp[i].content.length;
                                    for (var j = 0; j < grpConLen; j++) {
                                        conGrpLen = grp[i].content[j].groups.length;
                                        for (var k = 0; k < conGrpLen; k++) {
                                            if (grp[i].content[j].groups[k].id == groupId) {
                                                var grpContent = grp[i].content[j].groups[k];
                                                if (!ej.isNullOrUndefined(contentGroup.buttonSettings)) {
                                                    $.extend(grpContent.buttonSettings, contentGroup.buttonSettings);
                                                    $(contentGroup).removeProp('buttonSettings');
                                                }
                                                if (!ej.isNullOrUndefined(contentGroup.dropdownSettings)) {
                                                    $.extend(grpContent.dropdownSettings, contentGroup.dropdownSettings);
                                                    $(contentGroup).removeProp('dropdownSettings');
                                                }
                                                if (!ej.isNullOrUndefined(contentGroup.toggleButtonSettings)) {
                                                    $.extend(grpContent.toggleButtonSettings, contentGroup.toggleButtonSettings);
                                                    $(contentGroup).removeProp('toggleButtonSettings');
                                                }
                                                if (!ej.isNullOrUndefined(contentGroup.splitButtonSettings)) {
                                                    $.extend(grpContent.splitButtonSettings, contentGroup.splitButtonSettings);
                                                    $(contentGroup).removeProp('splitButtonSettings');
                                                }
                                                if (!ej.isNullOrUndefined(contentGroup.customToolTip)) {
                                                    $.extend(grpContent.customToolTip, contentGroup.customToolTip);
                                                    $(contentGroup).removeProp('customToolTip');
                                                }
                                                $.extend(grpContent, contentGroup);
                                                tabGroupText = ej.isNullOrUndefined(grp[i].id) ? (ej.isNullOrUndefined(grp[i].text) ? grp[i].text : grp[i].text.replace(/\s/g, '')) : grp[i].id.replace(/\s/g, ''); 
                                                tabs = this.model.contextualTabs[0].tabs[0];
                                                contDiv = this._createControls(i, tabs, tabGroupText, tabIndex);
                                                cntGroupId = "#" + this._id + "_" + tabs.id + "_" + tabGroupText + "_" + groupId;
                                                curGroup = this.element.find(cntGroupId);
                                                groupDiv = contDiv.find(cntGroupId);
                                                curGroup.replaceWith(groupDiv);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        isVisible: function (text) {
            var tab = this._tabText.filter(function (index) { return $(this).text() === text; }).parent();
            return (tab.is(':visible'));
        },

        isEnable: function (text) {
            var isEnable = true, tabIndex = this._tabText.filter(function (index) { return $(this).text() === text; }).parent().index();
            var disabeldItemLen = this.model.disabledItemIndex.length;
            for (var i = 0; i < disabeldItemLen; i++) {
                if (this.model.disabledItemIndex[i] == tabIndex)
                    isEnable = false;
            }
            return isEnable;
        },
        _renderTab: function () {
            var ul = ej.buildTag("ul"), li, aTag, appTab = this.model.applicationTab.type, tabs, contextualTabs, contextualTabSet, i, j, tab = this.model.tabs, tabLen = tab.length;
            if (appTab != null)
                aTag = ej.buildTag("a", "", {}, { href: "#" + this._id + "_" + appTab.replace(/\s/g, '') });
            li = ej.buildTag("li.e-apptab", aTag);
            ul.append(li);
            if (tabLen >= 1 && !ej.isNullOrUndefined(tab[0].id) && !ej.isNullOrUndefined(tab[0].text)) {
                for (i = 0; i < tabLen; i++) {
                    tabs = tab[i];
                    aTag = ej.buildTag("a", tabs.text, {}, { href: "#" + this._id + "_" + tabs.id });
                    li = ej.buildTag("li", aTag).addClass("e-tab");
                    ul.append(li);
                }
            }
            if (this.model.contextualTabs) {
                var contextTabLen = this.model.contextualTabs.length;
                for (i = 0; i < contextTabLen; i++) {
                    if (this.model.contextualTabs[i].tabs) {
                        var contextualTabLen = this.model.contextualTabs[i].tabs.length;
                        for (j = 0; j < contextualTabLen; j++) {
                            contextualTabSet = this.model.contextualTabs[i].tabs[j];
                            aTag = ej.buildTag("a", contextualTabSet.text, {}, { href: "#" + this._id + "_" + contextualTabSet.id });
                            li = ej.buildTag("li", aTag).addClass("e-contextualtabset").css('border-bottom-color',this.model.contextualTabs[i].backgroundColor);
                            ul.append(li);
                        }
                    }
                }
            }
            ul.append(ej.buildTag("li.e-ribresmenu").append(ej.buildTag("span.e-icon").addClass("e-ribdownarrow")).prepend(ej.buildTag("a#" + this._id + "_responsivelink").addClass("e-reslink")).click($.proxy(this._onResponsiveHeaderClick, this)));
            this.model.showQAT && ul.append(ej.buildTag("li#" + this._id + "_responsiveqat").addClass("e-responsiveqat").click($.proxy(this._onQatClick, this)))
            this.element.append(ul);
            this.element.ejTab({ width: this.model.width, allowKeyboardNavigation: false, disabledItemIndex: this.model.disabledItemIndex, enabledItemIndex: this.model.enabledItemIndex, enableTabScroll: false, itemActive: $.proxy(this._onTabSelect, this), beforeActive: $.proxy(this._onTabClick, this), create: $.proxy(this._create, this), selectedItemIndex: this.model.selectedItemIndex, enableRTL: this.model.enableRTL, cssClass: this.model.cssClass });
        },
        _createControls: function (j, tabs, tabGroupText, tabIndex) {
            var innerDiv, innerDivCustom, innerDivChild, contDiv, model = {};
            var split, button, dropdown, custom, toggle, separatorDiv, tabsConLen, subGrpLen, centerAlign;
            tabGroupText = !ej.isNullOrUndefined(tabGroupText) ? tabGroupText.replace(/\&/g, '') : tabGroupText;
            contDiv = ej.buildTag("div#" + this._id + "_" + tabs.id + "_" + tabGroupText + "_content").addClass('e-ribGroupContent');
            if (tabs.groups[j].type === "custom") {
                if (!tabs.groups[j].contentID)
                    innerDivCustom = ej.buildTag("div#" + this._id + "_" + tabs.id + "_" + tabGroupText + "_" + tabs.groups[j].type, tabs.groups[j].customContent).addClass("e-innerdiv");
                else {
                    innerDivCustom = ej.buildTag("div#" + this._id + "_" + tabs.id + "_" + tabGroupText + "_" + tabs.groups[j].type).addClass("e-innerdiv");
                    $("#" + tabs.groups[j].contentID).addClass('e-rbncustomelement').appendTo(innerDivCustom).show();
                }
                if (j === 0)
                    contDiv.append(ej.buildTag("div.e-ribupdivarrow").append(ej.buildTag("span.e-icon").addClass("e-groupresponsive e-ribdownarrow"))).addClass("e-resgroupheader");
                contDiv.append(innerDivCustom);
            }
            else {
                if (tabs.groups[j].content) {
                    if (j === 0)
                        contDiv.append(ej.buildTag("div.e-ribupdivarrow").append(ej.buildTag("span.e-icon").addClass("e-groupresponsive e-ribdownarrow"))).addClass("e-resgroupheader");
                    tabsConLen = tabs.groups[j].content.length;
                    for (var l = 0; l < tabsConLen; l++) {
                        if (tabs.groups[j].content[l] != undefined) {
                            var subGroup = tabs.groups[j].content[l].groups;
                            var defaults = tabs.groups[j].content[l].defaults;
                            if (tabs.groups[j].content.length == 1)
                                centerAlign = true;
                            if (ej.isNullOrUndefined(tabs.groups[j].alignType))
                                tabs.groups[j].alignType = ej.Ribbon.AlignType.Rows;
                            if (tabs.groups[j].alignType === ej.Ribbon.AlignType.Columns)
                                innerDiv = ej.buildTag("div#" + this._id + "_" + tabs.id + "_" + tabGroupText + "_" + (l + 1)).addClass("e-innerdiv");
                            else if (tabs.groups[j].alignType === ej.Ribbon.AlignType.Rows) {
                                innerDiv = ej.buildTag("div#" + this._id + "_" + tabs.id + "_" + tabGroupText + "_" + (l + 1)).addClass("e-innerdivrow");
                                ++m;
                            }
                            subGrpLen = subGroup.length;
                            for (var m = 0; m < subGrpLen; m++) {
                                if (!ej.isNullOrUndefined(subGroup[m])) {
                                    if (!ej.isNullOrUndefined(defaults)) {
                                        if (!ej.isNullOrUndefined(defaults.type))
                                            subGroup[m].type = defaults.type;
                                    }
                                    if (ej.isNullOrUndefined(subGroup[m].type))
                                        subGroup[m].type = ej.Ribbon.Type.Button;
                                    if (ej.isNullOrUndefined(subGroup[m].isBig) && !ej.isNullOrUndefined(defaults))
                                        subGroup[m].isBig = defaults.isBig;
                                    var buttonDef = this.model.buttonDefaults;
                                    if (ej.isNullOrUndefined(subGroup[m].height)) {
                                        var btnHeight;
                                        if (!ej.isNullOrUndefined(subGroup[m].buttonSettings) && !ej.isNullOrUndefined(subGroup[m].buttonSettings.height))
                                            btnHeight = subGroup[m].buttonSettings.height;
                                        else if (!ej.isNullOrUndefined(defaults) && !ej.isNullOrUndefined(defaults.height))
                                            btnHeight = defaults.height;
                                        else if (!ej.isNullOrUndefined(buttonDef) && !ej.isNullOrUndefined(buttonDef.height))
                                            btnHeight = buttonDef.height;
                                        subGroup[m].height = btnHeight;
                                        btnHeight = null;
                                    }
                                    if (ej.isNullOrUndefined(subGroup[m].width)) {
                                        var btnWidth;
                                        if (!ej.isNullOrUndefined(subGroup[m].buttonSettings) && !ej.isNullOrUndefined(subGroup[m].buttonSettings.width))
                                            btnWidth = subGroup[m].buttonSettings.width;
                                        else if (!ej.isNullOrUndefined(defaults) && !ej.isNullOrUndefined(defaults.width))
                                            btnWidth = defaults.width;
                                        else if (!ej.isNullOrUndefined(buttonDef) && !ej.isNullOrUndefined(buttonDef.width))
                                            btnWidth = buttonDef.width;
                                        subGroup[m].width = btnWidth;
                                        btnWidth = null;
                                    }
                                    if (!ej.isNullOrUndefined(subGroup[m].buttonSettings)) {
                                        var buttonSet = subGroup[m].buttonSettings;
                                        if (ej.isNullOrUndefined(buttonSet.enabled) && !ej.isNullOrUndefined(buttonDef) && !ej.isNullOrUndefined(buttonDef.enabled))
                                            buttonSet.enabled = buttonDef.enabled;
                                        if (ej.isNullOrUndefined(buttonSet.enableRTL) && !ej.isNullOrUndefined(buttonDef) && !ej.isNullOrUndefined(buttonDef.enableRTL))
                                            buttonSet.enableRTL = buttonDef.enableRTL;
                                        if (ej.isNullOrUndefined(buttonSet.cssClass) && !ej.isNullOrUndefined(buttonDef) && !ej.isNullOrUndefined(buttonDef.cssClass))
                                            buttonSet.cssClass = buttonDef.cssClass;
                                        if (ej.isNullOrUndefined(buttonSet.showRoundedCorner) && !ej.isNullOrUndefined(buttonDef) && !ej.isNullOrUndefined(buttonDef.showRoundedCorner))
                                            buttonSet.showRoundedCorner = buttonDef.showRoundedCorner;
                                    }
                                    if (!ej.isNullOrUndefined(subGroup[m].splitButtonSettings)) {
                                        var splitButtonSet = subGroup[m].splitButtonSettings;
                                        if (ej.isNullOrUndefined(splitButtonSet.enabled) && !ej.isNullOrUndefined(buttonDef) && !ej.isNullOrUndefined(buttonDef.enabled))
                                            splitButtonSet.enabled = buttonDef.enabled;
                                        if (ej.isNullOrUndefined(splitButtonSet.enableRTL) && !ej.isNullOrUndefined(buttonDef) && !ej.isNullOrUndefined(buttonDef.enableRTL))
                                            splitButtonSet.enableRTL = buttonDef.enableRTL;
                                        if (ej.isNullOrUndefined(splitButtonSet.cssClass) && !ej.isNullOrUndefined(buttonDef) && !ej.isNullOrUndefined(buttonDef.cssClass))
                                            splitButtonSet.cssClass = buttonDef.cssClass;
                                        if (ej.isNullOrUndefined(splitButtonSet.showRoundedCorner) && !ej.isNullOrUndefined(buttonDef) && !ej.isNullOrUndefined(buttonDef.showRoundedCorner))
                                            splitButtonSet.showRoundedCorner = buttonDef.showRoundedCorner;
                                    }

                                    if (!ej.isNullOrUndefined(subGroup[m].dropdownSettings)) {
                                        if (ej.isNullOrUndefined(subGroup[m].dropdownSettings.enabled) && !ej.isNullOrUndefined(buttonDef) && !ej.isNullOrUndefined(buttonDef.enabled))
                                            subGroup[m].dropdownSettings.enabled = buttonDef.enabled;
                                        if (ej.isNullOrUndefined(subGroup[m].dropdownSettings.enableRTL) && !ej.isNullOrUndefined(buttonDef) && !ej.isNullOrUndefined(buttonDef.enableRTL))
                                            subGroup[m].dropdownSettings.enableRTL = buttonDef.enableRTL;
                                        if (ej.isNullOrUndefined(subGroup[m].dropdownSettings.cssClass) && !ej.isNullOrUndefined(buttonDef) && !ej.isNullOrUndefined(buttonDef.cssClass))
                                            subGroup[m].dropdownSettings.cssClass = buttonDef.cssClass;
                                        if (ej.isNullOrUndefined(subGroup[m].dropdownSettings.showRoundedCorner) && !ej.isNullOrUndefined(buttonDef) && !ej.isNullOrUndefined(buttonDef.showRoundedCorner))
                                            subGroup[m].dropdownSettings.showRoundedCorner = buttonDef.showRoundedCorner;
                                    }

                                    if (!ej.isNullOrUndefined(subGroup[m].toggleButtonSettings)) {
                                        if (ej.isNullOrUndefined(subGroup[m].toggleButtonSettings.enabled) && !ej.isNullOrUndefined(buttonDef) && !ej.isNullOrUndefined(buttonDef.enabled))
                                            subGroup[m].toggleButtonSettings.enabled = buttonDef.enabled;
                                        if (ej.isNullOrUndefined(subGroup[m].toggleButtonSettings.enableRTL) && !ej.isNullOrUndefined(buttonDef) && !ej.isNullOrUndefined(buttonDef.enableRTL))
                                            subGroup[m].toggleButtonSettings.enableRTL = buttonDef.enableRTL;
                                        if (ej.isNullOrUndefined(subGroup[m].toggleButtonSettings.cssClass) && !ej.isNullOrUndefined(buttonDef) && !ej.isNullOrUndefined(buttonDef.cssClass))
                                            subGroup[m].toggleButtonSettings.cssClass = buttonDef.cssClass;
                                        if (ej.isNullOrUndefined(subGroup[m].toggleButtonSettings.showRoundedCorner) && !ej.isNullOrUndefined(buttonDef) && !ej.isNullOrUndefined(buttonDef.showRoundedCorner))
                                            subGroup[m].toggleButtonSettings.showRoundedCorner = buttonDef.showRoundedCorner;
                                    }
                                    if (ej.isNullOrUndefined(subGroup[m].quickAccessMode))
                                        subGroup[m].quickAccessMode = "none";
                                    switch (subGroup[m].type) {
                                        case ej.Ribbon.Type.Custom:
                                            custom = subGroup[m];
                                            if (tabs.groups[j].alignType === ej.Ribbon.AlignType.Columns) {
                                                innerDivChild = ej.buildTag("div#" + this._id + "_" + tabs.id + "_" + tabGroupText + "_" + custom.contentID).addClass("e-controlpadding");
                                            }
                                            else if (tabs.groups[j].alignType === ej.Ribbon.AlignType.Rows) {
                                                innerDivChild = ej.buildTag("div#" + this._id + "_" + tabs.id + "_" + tabGroupText + "_" + custom.contentID).addClass("e-innerdivchild e-controlpadding");
                                            }
                                            if (!$.isEmptyObject(custom.customToolTip))
                                                innerDivChild.mouseover({ value: custom, ribbonId: this._id }, $.proxy(this._tooltip, this)).mouseout({ ribbonId: this._id }, $.proxy(this._toolTipOut, this));
                                            else if (!ej.isNullOrUndefined(custom.toolTip))
                                                innerDivChild.attr("title", custom.toolTip);
                                            $("#" + custom.contentID).addClass('e-rbncustomelement').appendTo(innerDivChild);
                                            if (!ej.isNullOrUndefined(subGroup[m])) {
                                                if (!ej.isNullOrUndefined(subGroup[m].height))
                                                    innerDivChild.children().height(subGroup[m].height);
                                                if (!ej.isNullOrUndefined(subGroup[m].width))
                                                    innerDivChild.children().width(subGroup[m].width);
                                            }
                                            if (!ej.isNullOrUndefined(custom.isBig)) {
                                                (custom.isBig) ? innerDivChild.children().addClass("e-big") : innerDivChild.children().addClass("e-small");
                                            }
                                            innerDiv.append(innerDivChild);
                                            if (subGroup[m].enableSeparator) {
                                                if (tabs.groups[j].alignType === ej.Ribbon.AlignType.Rows) {
                                                    separatorDiv = ej.buildTag("div#" + this._id + "_" + "separator" + "_" + custom.toolTip).addClass("e-separatordivrow");
                                                    innerDiv.append(separatorDiv);
                                                }
                                            }
                                            break;
                                        case ej.Ribbon.Type.SplitButton:
                                            split = subGroup[m];
                                            this._splitButtonControl = ej.buildTag("button#" + this._id + "_" + split.id, split.text, {}, { type: "button" }).addClass(split.cssClass);
                                            if (tabs.groups[j].alignType === ej.Ribbon.AlignType.Columns) {
                                                innerDivChild = ej.buildTag("div#" + this._id + "_" + tabs.id + "_" + tabGroupText + "_" + split.id, this._splitButtonControl).addClass("e-controlpadding");
                                            }
                                            else if (tabs.groups[j].alignType === ej.Ribbon.AlignType.Rows) {
                                                innerDivChild = ej.buildTag("div#" + this._id + "_" + tabs.id + "_" + tabGroupText + "_" + split.id, this._splitButtonControl).addClass("e-innerdivchild e-controlpadding");
                                            }
                                            if (!$.isEmptyObject(split.customToolTip))
                                                innerDivChild.mouseover({ value: split, ribbonId: this._id }, $.proxy(this._tooltip, this)).mouseout({ ribbonId: this._id }, $.proxy(this._toolTipOut, this));
                                            else if (!ej.isNullOrUndefined(split.toolTip))
                                                innerDivChild.attr("title", split.toolTip);
                                            model = {}
                                            if (split.splitButtonSettings)
                                                model = split.splitButtonSettings;
                                        model.height = ej.isNullOrUndefined(model.height) ? subGroup[m].height : model.height;
                                        model.width = ej.isNullOrUndefined(model.width) ? subGroup[m].width : model.width;
                                        if (model.cssClass)
                                            model.cssClass = model.cssClass.concat(" e-rbn-splitbtn e-rbn-button");
                                        else
                                            model.cssClass = "e-rbn-splitbtn e-rbn-button";
                                        model.enableRTL = this.model.enableRTL;
                                        this._splitButtonControl.ejSplitButton(model);
										innerDivChild.find('.e-split').addClass('e-rbn-split');
                                        if (split.isMobileOnly) {
                                            this._mobileSplitButton = ej.buildTag("button#" + this._id + "_" + split.id + "_mobEle", split.text, {}, { type: "button" }).addClass(split.cssClass);
                                            var mobileContentDiv = ej.buildTag("div#" + this._id + "_" + split.id + "_mobDiv", this._mobileSplitButton).addClass('e-mobdiv');
                                            model.height = split.splitButtonSettings.height;
                                            model.width = split.splitButtonSettings.width;
                                            model.arrowPosition = ej.ArrowPosition.Right;
                                            model.imagePosition = split.splitButtonSettings.imagePosition;
                                                model.contentType = split.splitButtonSettings.contentType
                                                this._mobileSplitButton.ejSplitButton(model);
										        mobileContentDiv.find('button').addClass('e-rbn-button');
                                                this._mobileToolbar[tabIndex].Content.push(mobileContentDiv);
                                                var btnText;
                                                if (!ej.isNullOrUndefined(split.text))
                                                    btnText = split.text;
                                                else if (!ej.isNullOrUndefined(split.splitButtonSettings.text))
                                                    btnText = split.splitButtonSettings.text;
                                                this._mobileContents[tabIndex].mobileContent.push({ id: split.id, text: btnText, isMobileOnly: split.isMobileOnly });
                                            }
                                        if (split.quickAccessMode != "none" && this.model.showQAT && (!this.model.enableOnDemand)) {
                                                this._splitButtonQAT = ej.buildTag("button#" + this._id + "_" + split.id + "_qatEle", split.text, {}, { type: "button" }).addClass(split.cssClass);
                                                var qatMainDiv = ej.buildTag("div#" + this._id + "_" + split.id + "_qatDiv", this._splitButtonQAT).addClass('e-qatooldiv');
                                                model.height = 30;
                                                model.arrowPosition = ej.ArrowPosition.Right;
                                                model.contentType = ej.ContentType.ImageOnly;
                                                if (!$.isEmptyObject(split.customToolTip))
                                                    qatMainDiv.mouseover({ value: split, ribbonId: this._id }, $.proxy(this._tooltip, this)).mouseout({ ribbonId: this._id }, $.proxy(this._toolTipOut, this));
                                                else if (!ej.isNullOrUndefined(split.toolTip))
                                                    qatMainDiv.attr("title", split.toolTip);
                                                this._splitButtonQAT.ejSplitButton(model);
												qatMainDiv.find('button').addClass('e-rbn-button');
                                                qatMainDiv.appendTo(this._qAccessBar);
                                                if (split.quickAccessMode == "menu")
                                                    qatMainDiv.hide();
                                            var btnText;
                                            if (!ej.isNullOrUndefined(split.text))
                                                btnText = split.text;
                                            else if (!ej.isNullOrUndefined(split.splitButtonSettings.text))
                                                btnText = split.splitButtonSettings.text;
                                            this._qatControlsName.push({ id: split.id, text: btnText, qAccess: split.quickAccessMode });
                                        }
                                        if (!ej.isNullOrUndefined(split.isBig)) {
                                            (split.isBig) ? innerDivChild.children().prop("style",false).addClass("e-big") : innerDivChild.children().prop("style",false).addClass("e-small");
                                        }
                                        innerDiv.append(innerDivChild);
                                        if (subGroup[m].enableSeparator) {
                                            if (tabs.groups[j].alignType === ej.Ribbon.AlignType.Rows) {
                                                    separatorDiv = ej.buildTag("div#" + this._id + "_" + "separator" + "_" + split.id).addClass("e-separatordivrow");
                                                    innerDiv.append(separatorDiv);
                                                }
                                            }
                                            break;
                                        case ej.Ribbon.Type.ToggleButton:
                                            toggle = subGroup[m];
                                            this._toggleButtonControl = ej.buildTag("input#" + this._id + "_" + toggle.id, "", "", { type: "checkbox" }).addClass(toggle.cssClass);
                                            if (tabs.groups[j].alignType === ej.Ribbon.AlignType.Columns) {
                                                innerDivChild = ej.buildTag("div#" + this._id + "_" + tabs.id + "_" + tabGroupText + "_" + toggle.id, this._toggleButtonControl).addClass("e-controlpadding");
                                            }
                                            else if (tabs.groups[j].alignType === ej.Ribbon.AlignType.Rows) {
                                                innerDivChild = ej.buildTag("div#" + this._id + "_" + tabs.id + "_" + tabGroupText + "_" + toggle.id, this._toggleButtonControl).addClass("e-innerdivchild e-controlpadding");
                                            }
                                            if (!$.isEmptyObject(toggle.customToolTip))
                                                innerDivChild.mouseover({ value: toggle, ribbonId: this._id }, $.proxy(this._tooltip, this)).mouseout({ ribbonId: this._id }, $.proxy(this._toolTipOut, this));
                                        else if (!ej.isNullOrUndefined(toggle.toolTip))
                                            innerDivChild.attr("title", toggle.toolTip);
                                        model = {}
                                        if (toggle.toggleButtonSettings)
                                            model = toggle.toggleButtonSettings;
                                        model.height = ej.isNullOrUndefined(model.height) ? subGroup[m].height : model.height;
                                        model.width = ej.isNullOrUndefined(model.width) ? subGroup[m].width : model.width;
                                        var qatToggle = $(("#" + this._toggleButtonControl.attr("id") + "_qatDiv button.e-togglebutton"));
                                        if (this.model.enableOnDemand && this.model.showQAT && qatToggle.is(":visible") && qatToggle.hasClass("e-active")) {
                                            model.toggleState = true;
                                        }
                                        this._toggleButtonControl.ejToggleButton(model).addClass('e-ribbonbtn e-rbn-button');
										innerDivChild.find('button').addClass('e-rbn-button');
                                        if (toggle.isMobileOnly) {
                                            this._mobileToggleButton = ej.buildTag("button#" + this._id + "_" + toggle.id + "_mobEle", "", "", { type: "checkbox" }).addClass(toggle.cssClass);
                                            var mobileContentDiv = ej.buildTag("div#" + this._id + "_" + toggle.id + "_mobDiv", this._mobileToggleButton).addClass('e-mobdiv');
                                            model.height = toggle.toggleButtonSettings.height;
                                            model.width = toggle.toggleButtonSettings.width;
                                            model.contentType = toggle.toggleButtonSettings.contentType;
                                            model.imagePosition = toggle.toggleButtonSettings.imagePosition;
                                            this._mobileToggleButton.ejToggleButton(model).addClass('e-ribbonbtn');
										    mobileContentDiv.find('button').addClass('e-rbn-button');
                                                this._mobileToolbar[tabIndex].Content.push(mobileContentDiv);
                                                var btnText;
                                                if (!ej.isNullOrUndefined(toggle.text))
                                                    btnText = toggle.text;
                                                else if (!ej.isNullOrUndefined(toggle.toggleButtonSettings.defaultText))
                                                    btnText = toggle.toggleButtonSettings.defaultText;
                                                this._mobileContents[tabIndex].mobileContent.push({ id: toggle.id, text: btnText, isMobileOnly: toggle.isMobileOnly });
                                            }
                                        if (toggle.quickAccessMode != "none" && this.model.showQAT && (!this.model.enableOnDemand)) {
                                                this._toggleButtonQAT = ej.buildTag("input#" + this._id + "_" + toggle.id + "_qatEle", "", "", { type: "checkbox" }).addClass(toggle.cssClass);
                                                var qatMainDiv = ej.buildTag("div#" + this._id + "_" + toggle.id + "_qatDiv", this._toggleButtonQAT).addClass('e-qatooldiv');
                                                model.height = 30;
                                                model.contentType = ej.ContentType.ImageOnly;
                                                if (!$.isEmptyObject(toggle.customToolTip))
                                                    qatMainDiv.mouseover({ value: toggle, ribbonId: this._id }, $.proxy(this._tooltip, this)).mouseout({ ribbonId: this._id }, $.proxy(this._toolTipOut, this));
                                                else if (!ej.isNullOrUndefined(toggle.toolTip))
                                                    qatMainDiv.attr("title", toggle.toolTip);
                                                this._toggleButtonQAT.ejToggleButton(model).addClass('e-ribbonbtn');
												qatMainDiv.find('button').addClass('e-rbn-button');
                                                qatMainDiv.appendTo(this._qAccessBar);
                                                if (toggle.quickAccessMode == "menu")
                                                    qatMainDiv.hide();
                                                var btnText;
                                                if (!ej.isNullOrUndefined(toggle.text))
                                                    btnText = toggle.text;
                                                else if (!ej.isNullOrUndefined(toggle.toggleButtonSettings.defaultText))
                                                    btnText = toggle.toggleButtonSettings.defaultText;
                                                this._qatControlsName.push({ id: toggle.id, text: btnText, qAccess: toggle.quickAccessMode });
                                            }
                                            if (!ej.isNullOrUndefined(toggle.isBig)) {
                                                (toggle.isBig) ? innerDivChild.find('.e-togglebutton.e-tbtn.e-btn').addClass("e-big") : innerDivChild.find('.e-togglebutton.e-tbtn.e-btn').addClass("e-small");
                                            }
                                            innerDiv.append(innerDivChild);
                                            if (subGroup[m].enableSeparator) {
                                                if (tabs.groups[j].alignType === ej.Ribbon.AlignType.Rows) {
                                                    separatorDiv = ej.buildTag("div#" + this._id + "_" + "separator" + "_" + toggle.id).addClass("e-separatordivrow");
                                                    innerDiv.append(separatorDiv);
                                                }
                                            }
                                            break;
                                        case ej.Ribbon.Type.Button:
                                            button = subGroup[m];
                                            if (button.buttonSettings) {
                                                if (button.buttonSettings.type)
                                                    this._buttonControl = ej.buildTag("button#" + this._id + "_" + button.id, button.text, {}, { type: button.buttonSettings.type }).addClass(button.cssClass);
                                                else
                                                    this._buttonControl = ej.buildTag("button#" + this._id + "_" + button.id, button.text).addClass(button.cssClass);
                                            }
                                            else
                                                this._buttonControl = ej.buildTag("button#" + this._id + "_" + button.id, button.text).addClass(button.cssClass);
                                            if (tabs.groups[j].alignType === ej.Ribbon.AlignType.Columns) {
                                                innerDivChild = ej.buildTag("div#" + this._id + "_" + tabs.id + "_" + tabGroupText + "_" + button.id, this._buttonControl).addClass("e-controlpadding");
                                            }
                                            else if (tabs.groups[j].alignType === ej.Ribbon.AlignType.Rows) {
                                                innerDivChild = ej.buildTag("div#" + this._id + "_" + tabs.id + "_" + tabGroupText + "_" + button.id, this._buttonControl).addClass("e-innerdivchild e-controlpadding");
                                            }
                                            if (!$.isEmptyObject(button.customToolTip))
                                                innerDivChild.mouseover({ value: button, ribbonId: this._id }, $.proxy(this._tooltip, this)).mouseout({ ribbonId: this._id }, $.proxy(this._toolTipOut, this));
                                            else if (!ej.isNullOrUndefined(button.toolTip))
                                            innerDivChild.attr("title", button.toolTip);
                                        model = {}
                                        if (button.buttonSettings)
                                            model = button.buttonSettings;
                                        model.height = ej.isNullOrUndefined(model.height) ? subGroup[m].height : model.height;
                                        model.width = ej.isNullOrUndefined(model.width) ? subGroup[m].width : model.width;
                                        this._buttonControl.ejButton(model).addClass('e-ribbonbtn  e-rbn-button');
                                        if (button.isMobileOnly) {
                                            if (button.buttonSettings) {
                                                if (button.buttonSettings.type)
                                                    this._mobileButton = ej.buildTag("button#" + this._id + "_" + button.id + "_mobEle", button.text, {}, { type: button.buttonSettings.type }).addClass(button.cssClass);
                                                else
                                                    this._mobileButton = ej.buildTag("button#" + this._id + "_" + button.id + "_mobEle", button.text).addClass(button.cssClass);
                                            }
                                                else
                                                    this._mobileButton = ej.buildTag("button#" + this._id + "_" + button.id + "_mobEle", button.text).addClass(button.cssClass);
                                                var mobileContentDiv = ej.buildTag("div#" + this._id + "_" + button.id + "_mobDiv", this._mobileButton).addClass('e-mobdiv');
                                                this._mobileButton.ejButton(model).addClass('e-ribbon-resbtn  e-rbn-button');
                                                this._mobileToolbar[tabIndex].Content.push(mobileContentDiv);
                                                var btnText;
                                                if (!ej.isNullOrUndefined(button.text))
                                                    btnText = button.text;
                                                else if (!ej.isNullOrUndefined(button.buttonSettings.text))
                                                    btnText = button.buttonSettings.text;
                                                this._mobileContents[tabIndex].mobileContent.push({ id: button.id, text: btnText, isMobileOnly: button.isMobileOnly });
                                            }
                                        if (button.quickAccessMode != "none" && this.model.showQAT && (!this.model.enableOnDemand)) {
                                                if (button.buttonSettings) {
                                                    if (button.buttonSettings.type)
                                                        this._buttonQAT = ej.buildTag("button#" + this._id + "_" + button.id + "_qatEle", button.text, {}, { type: button.buttonSettings.type }).addClass(button.cssClass);
                                                    else
                                                        this._buttonQAT = ej.buildTag("button#" + this._id + "_" + button.id + "_qatEle", button.text).addClass(button.cssClass);
                                                }
                                                else
                                                    this._buttonQAT = ej.buildTag("button#" + this._id + "_" + button.id + "_qatEle", button.text).addClass(button.cssClass);
                                                var qatMainDiv = ej.buildTag("div#" + this._id + "_" + button.id + "_qatDiv", this._buttonQAT).addClass('e-qatooldiv');
                                                model.height = 30;
                                                model.contentType = ej.ContentType.ImageOnly;
                                                if (!$.isEmptyObject(button.customToolTip))
                                                    qatMainDiv.mouseover({ value: button, ribbonId: this._id }, $.proxy(this._tooltip, this)).mouseout({ ribbonId: this._id }, $.proxy(this._toolTipOut, this));
                                                else if (!ej.isNullOrUndefined(button.toolTip))
                                                    qatMainDiv.attr("title", button.toolTip);
                                                this._buttonQAT.ejButton(model).addClass('e-ribbonbtn e-rbn-button');
                                                qatMainDiv.appendTo(this._qAccessBar);
                                                if (button.quickAccessMode == "menu")
                                                    qatMainDiv.hide();
                                                var btnText;
                                                if (!ej.isNullOrUndefined(button.text))
                                                    btnText = button.text;
                                                else if (!ej.isNullOrUndefined(button.buttonSettings.text))
                                                    btnText = button.buttonSettings.text;
                                                this._qatControlsName.push({ id: button.id, text: btnText, qAccess: button.quickAccessMode });
                                            }
                                            if (!ej.isNullOrUndefined(button.isBig)) {
                                                (button.isBig) ? innerDivChild.children().addClass("e-big") : innerDivChild.children().addClass("e-small");
                                            }
                                            innerDiv.append(innerDivChild);
                                            if (subGroup[m].enableSeparator) {
                                                if (tabs.groups[j].alignType === ej.Ribbon.AlignType.Rows) {
                                                    separatorDiv = ej.buildTag("div#" + this._id + "_" + "separator" + "_" + button.id).addClass("e-separatordivrow");
                                                    innerDiv.append(separatorDiv);
                                                }
                                            }
                                            break;
                                        case ej.Ribbon.Type.DropDownList:
                                            dropdown = subGroup[m];
                                            this._dropdownControl = ej.buildTag("input#" + this._id + "_" + dropdown.id, { type: "text" }).addClass(dropdown.cssClass);
                                            if (dropdown.dropdownSettings) {
                                                if (tabs.groups[j].alignType === ej.Ribbon.AlignType.Columns) {
                                                    innerDivChild = ej.buildTag("div#" + this._id + "_" + tabs.id + "_" + tabGroupText + "_" + dropdown.id, this._dropdownControl).append($("#" + dropdown.dropdownSettings.targetID)).addClass("e-controlpadding");
                                                }
                                                else if (tabs.groups[j].alignType === ej.Ribbon.AlignType.Rows) {
                                                    innerDivChild = ej.buildTag("div#" + this._id + "_" + tabs.id + "_" + tabGroupText + "_" + dropdown.id, this._dropdownControl).append($("#" + dropdown.dropdownSettings.targetID)).addClass("e-innerdivchild e-controlpadding");
                                                }
                                                if (!$.isEmptyObject(dropdown.customToolTip))
                                                    innerDivChild.mouseover({ value: dropdown, ribbonId: this._id }, $.proxy(this._tooltip, this)).mouseout({ ribbonId: this._id }, $.proxy(this._toolTipOut, this));
                                                else if (!ej.isNullOrUndefined(dropdown.toolTip))
                                                    innerDivChild.attr("title", dropdown.toolTip);
                                            }
                                            model = {};
                                            if (dropdown.dropdownSettings)
                                            model = dropdown.dropdownSettings;
                                        model.height = ej.isNullOrUndefined(model.height) ? subGroup[m].height : model.height;
                                        model.width = ej.isNullOrUndefined(model.width) ? subGroup[m].width : model.width;
                                        if (model.cssClass)
                                            model.cssClass = model.cssClass.concat(" e-rbn-ddl");
                                        else
                                            model.cssClass = "e-rbn-ddl";
                                        if (dropdown.isMobileOnly) {
                                            this._mobileDropdown = ej.buildTag("input#" + this._id + "_" + dropdown.id + "_mobEle", "", "", { type: "text" }).addClass(dropdown.cssClass);
                                            var mobileContentDiv = ej.buildTag("div#" + this._id + "_" + dropdown.id + "_mobDiv", this._mobileDropdown).addClass('e-mobdiv');
                                            this._mobileDropdown.ejDropDownList(model).addClass('e-ribbonbtn');
                                            this._mobileToolbar[tabIndex].Content.push(mobileContentDiv);
                                            var btnText;
                                            if (!ej.isNullOrUndefined(dropdown.text))
                                                btnText = dropdown.text;
                                            else if (!ej.isNullOrUndefined(dropdown.dropdownSettings.defaultText))
                                                btnText = dropdown.dropdownSettings.defaultText;
                                            this._mobileContents[tabIndex].mobileContent.push({ id: dropdown.id, text: btnText, isMobileOnly: dropdown.isMobileOnly });
                                        }
                                        model.enableRTL = this.model.enableRTL;
                                        this._dropdownControl.ejDropDownList(model);
                                        innerDiv.append(innerDivChild);
                                            if (subGroup[m].enableSeparator) {
                                                if (tabs.groups[j].alignType === ej.Ribbon.AlignType.Rows) {
                                                    separatorDiv = ej.buildTag("div#" + this._id + "_" + "separator" + "_" + dropdown.id).addClass("e-separatordivrow");
                                                    innerDiv.append(separatorDiv);
                                                }
                                            }
                                            break;
                                        case ej.Ribbon.Type.Gallery:
                                            var galleryContentDiv, galleryPagesDiv, prevPage, nextPage, expandGallery, visibleRowCnt, galleryRows;
                                            gallery = subGroup[m];
                                            this._galleryControl = ej.buildTag("div#" + this._id + "_" + gallery.id + "_gallerycontrol").addClass("e-ribbongallerycontrol");
                                            this._gallery = ej.buildTag("div#" + this._id + "_" + gallery.id).addClass("e-ribbongallery");
                                            var galleryContentDiv = ej.buildTag("div#" + this._id + "_" + gallery.id + "_ContentDiv").addClass("e-gallerycontent").height(65).width(gallery.columns * gallery.itemWidth).click({ galleryId: this._gallery.attr("id") }, $.proxy(this._onGalContentClick, this));

                                            galleryRows = Math.floor(gallery.galleryItems.length / gallery.columns);

                                            if ((gallery.galleryItems.length % gallery.columns) > 0)
                                                ++galleryRows;

                                            for (var m = 1; m <= galleryRows; m++) {
                                                var galleryRow = ej.buildTag("div#" + this._id + "_" + gallery.id + "_galleryrow_" + m).addClass('e-galleryrow').click({ model: gallery }, $.proxy(this._onGalleryItemClick, this));
                                                if (m === 1)
                                                    galleryRow.addClass('e-gryfirstrow');
                                                else if (m === galleryRows)
                                                    galleryRow.addClass('e-grylastrow');

                                                for (var n = 1; n <= gallery.columns; n++) {
                                                    var contentLen = galleryContentDiv.find('.e-galleryrow').children().length + galleryRow.children().length, btnCtrl;
                                                    if (!ej.isNullOrUndefined(gallery.galleryItems[contentLen])) {
                                                        btnCtrl = ej.buildTag("button#" + gallery.id + "_galleryItem_" + (contentLen + 1), gallery.galleryItems[contentLen].text, {}, { type: "button" }).addClass('e-gallerybtn  e-rbn-button');
                                                        if (!$.isEmptyObject(gallery.galleryItems[contentLen].customToolTip))
                                                            btnCtrl.mouseover({ value: gallery.galleryItems[contentLen], ribbonId: this._id }, $.proxy(this._tooltip, this)).mouseout({ ribbonId: this._id }, $.proxy(this._toolTipOut, this));
                                                        else if (!ej.isNullOrUndefined(gallery.galleryItems[contentLen].toolTip))
                                                            btnCtrl.attr("title", gallery.galleryItems[contentLen].toolTip);

                                                        model = {}
                                                        if (gallery.galleryItems[contentLen].buttonSettings)
                                                            model = gallery.galleryItems[contentLen].buttonSettings;
                                                        if (gallery.itemHeight <= 65)
                                                            model.height = gallery.itemHeight;
                                                        else
                                                            model.height = 65;
                                                        model.width = gallery.itemWidth;
                                                        btnCtrl.ejButton(model);
                                                        btnCtrl.appendTo(galleryRow);
                                                    }
                                                }
                                                if (gallery.itemHeight > 65)
                                                    visibleRowCnt = 1;
                                                else
                                                    visibleRowCnt = (galleryContentDiv.height() / gallery.itemHeight);
                                                if (m > visibleRowCnt)
                                                    galleryRow.hide();
                                                galleryRow.appendTo(galleryContentDiv);
                                            }
                                            this._gallery.append(galleryContentDiv);

                                            var galleryPagesDiv = ej.buildTag("div#" + this._id + "_" + gallery.id + "_PagesDiv").addClass("e-gallerymovediv");
                                            var prevPage = ej.buildTag("div#" + this._id + "_" + gallery.id + "_prevPage", "<span class='e-icon e-galleryup e-gallerymoveicon'></span>").click({ galleryId: this._gallery.attr("id"), rowCnt: visibleRowCnt }, $.proxy(this._onGalMoveUpClick, this)).addClass('e-moveupdiv e-disablegrymovebtn');
                                            var nextPage = ej.buildTag("div#" + this._id + "_" + gallery.id + "_nextPage", "<span class='e-icon e-gallerydown e-gallerymoveicon'></span>").click({ galleryId: this._gallery.attr("id") }, $.proxy(this._onGalMoveDownClick, this)).addClass('e-movedowndiv');
                                            var expandGallery = ej.buildTag("div#" + this._id + "_" + gallery.id + "_expandGallery", "<span class='e-icon e-galleryexpand e-gallerymoveicon'></span>").click({ galleryId: this._gallery.attr("id"), columns: gallery.columns, expandedColumns: gallery.expandedColumns, itemWidth: gallery.itemWidth }, $.proxy(this._onExpandGalleryClick, this)).addClass('e-expgallerydiv');
                                            this._responsiveGallery = gallery.expandedColumns;

                                            galleryPagesDiv.append(prevPage);
                                            galleryPagesDiv.append(nextPage);
                                            galleryPagesDiv.append(expandGallery);
                                            this._gallery.append(galleryPagesDiv);
                                            var galleryExpandContent = ej.buildTag("div#" + this._id + "_" + gallery.id + "_ExpandContent").addClass("e-gallexpandcontent").hide();
                                            var scrollContent = ej.buildTag("div#" + this._id + "_" + gallery.id + "_scrollContent", "<div></div>").addClass("e-gallscrollcontent");
                                            var expanderContent = ej.buildTag("div#" + this._id + "_" + gallery.id + "_ExpanderContent").addClass("e-expandercontent").click({ galleryId: this._gallery.attr("id") }, $.proxy(this._onExpandContentClick, this));
                                            scrollContent.children().append(expanderContent);
                                            galleryExpandContent.append(scrollContent);
                                            if (!ej.isNullOrUndefined(gallery.customGalleryItems)) {
                                                var expanderExtraContent = ej.buildTag("div#" + this._id + "_" + gallery.id + "_ExtraContent").addClass("e-extracontent").click({ model: gallery }, $.proxy(this._onGalleryItemClick, this));
                                                var customGalItemsLen = gallery.customGalleryItems.length;
                                                for (var l = 0; l < customGalItemsLen; l++) {
                                                    var btnCtrlExtra;
                                                    if (ej.isNullOrUndefined(gallery.customGalleryItems[l].customItemType))
                                                        gallery.customGalleryItems[l].customItemType = ej.Ribbon.CustomItemType.Button;
                                                    if (gallery.customGalleryItems[l].customItemType === ej.Ribbon.CustomItemType.Button) {
                                                        btnCtrlExtra = ej.buildTag("button#" + gallery.id + "_" + "_extraItem_" + l, gallery.customGalleryItems[l].text, {}, { type: "button" }).addClass('e-galleryextrabtn e-rbn-button');
                                                        if (!$.isEmptyObject(gallery.customGalleryItems[l].customToolTip))
                                                            btnCtrlExtra.mouseover({ value: gallery.customGalleryItems[l], ribbonId: this._id }, $.proxy(this._tooltip, this))
                                                            .mouseout({ ribbonId: this._id }, $.proxy(this._toolTipOut, this));
                                                        else if (!ej.isNullOrUndefined(gallery.customGalleryItems[l].toolTip))
                                                            btnCtrlExtra.attr("title", gallery.customGalleryItems[l].toolTip);
                                                        model = {}
                                                        if (gallery.customGalleryItems[l]) {
                                                            if (gallery.customGalleryItems[l].buttonSettings)
                                                                model = gallery.customGalleryItems[l].buttonSettings;
                                                            btnCtrlExtra.ejButton(model);
                                                        }
                                                        btnCtrlExtra.appendTo(expanderExtraContent);
                                                    }
                                                    else {
                                                        model = {}
                                                        if (gallery.customGalleryItems[l].menuSettings)
                                                            model = gallery.customGalleryItems[l].menuSettings;
                                                        model.menuType = ej.MenuType.NormalMenu;
                                                        model.orientation = ej.Orientation.Vertical;
                                                        model.enableRTL = this.model.enableRTL;
                                                        $("#" + gallery.customGalleryItems[l].menuId).ejMenu(model).addClass('e-gallerymenu');
                                                        $("#" + gallery.customGalleryItems[l].menuId).appendTo(expanderExtraContent).css("width", "100%");
                                                    }
                                                }
                                                galleryExpandContent.append(expanderExtraContent);
                                            }
                                            this._galleryControl.append(this._gallery);
                                            this._galleryControl.append(galleryExpandContent);
                                            if (tabs.groups[j].alignType === ej.Ribbon.AlignType.Columns)
                                                innerDivChild = ej.buildTag("div#" + this._id + "_" + tabs.id + "_" + tabGroupText + "_" + gallery.id, this._galleryControl).addClass("e-controlpadding");
                                            else if (tabs.groups[j].alignType === ej.Ribbon.AlignType.Rows)
                                                innerDivChild = ej.buildTag("div#" + this._id + "_" + tabs.id + "_" + tabGroupText + "_" + gallery.id, this._galleryControl).addClass("e-innerdivchild e-controlpadding");
                                            innerDiv.append(innerDivChild);
                                            break;
                                    }
                                    contDiv.append(innerDiv);
                                }
                            }
                        }
                    }
                }
            }
            return contDiv;
        },

        _groupContent: function (e) {
            var tabContextualLen = 0;
            ej.isNullOrUndefined(e) ? index = this._tabUl.find(".e-active").index() - 1 : (tabContextualLen = $(e.activeHeader).parents(".e-contextliset").length > 0 ? $(e.activeHeader).parents(".e-contextliset").prevAll(".e-tab").eq(0).prevAll().not(".e-tab,.e-apptab").length : $(e.activeHeader).prevAll().not(".e-tab,.e-apptab").length, index = e.activeIndex - (tabContextualLen + 1));
            var rbnOnDemand = this.element.find(".e-content-item").eq(index + (1 + tabContextualLen));
            if (!rbnOnDemand.hasClass("e-rbn-ondemand") || index < 0)
                return;
            ribbonModel = $.extend(true, {}, this.model);
            var tabLen = this.model.tabs.length;
            !ej.isNullOrUndefined(e) ? contextIndex = $(e.activeHeader).hasClass("e-contextualtabset") ? tabLen - $(e.activeHeader).index() : -1 : contextIndex = -1;
            if (this.model.contextualTabs && contextIndex != -1) {
                var currentContext = $(e.activeHeader).parents(".e-contextliset").attr("id");
                contextIndex = parseInt(currentContext[currentContext.length - 1]);
                contextualTab = this.model.contextualTabs[contextIndex];
                if (contextualTab.tabs) {
                    var contexttualTablen = contextualTab.tabs.length;
                    for (var l = 0; l < contexttualTablen; l++) {
                        if (!ej.isNullOrUndefined(contextualTab.tabs[l].groups) && contextualTab.tabs[l].groups.length > 0) {
                            this.model.tabs[tabLen] = contextualTab.tabs[l];
                            index = tabLen;
                        }
                    }
                }
            }
            tabs = this.model.tabs[index];
            this._mobileContents[this._tabObj.model.selectedItemIndex - 1] = { "tab": tabs.text, "mobileContent": [] };
            this._mobileToolbar[this._tabObj.model.selectedItemIndex - 1] = { "tab": tabs.text, "Content": [] };
            if (!ej.isNullOrUndefined(tabs.groups)) {
                var tabsGrouplen = tabs.groups.length;
                for (j = 0; j < tabsGrouplen; j++) {
                    if (!ej.isNullOrUndefined(tabs.groups[j])) {
                        tabGroupText = ej.isNullOrUndefined(tabs.groups[j].id) ? (ej.isNullOrUndefined(tabs.groups[j].text) ? tabs.groups[j].text : tabs.groups[j].text.replace(/\s/g, '')) : tabs.groups[j].id.replace(/\s/g, ''); 
                        contDiv = this._createControls(j, tabs, tabGroupText, index);
                        groupDiv = this._addControlsToGroup(j, tabs, tabGroupText, contDiv);
                        tabcont = this.element.find("#" + this._id + "_" + tabs.id);
                        tabcont.append(groupDiv).addClass("e-parentdiv");
                    }
                }
            }
            else 
                this.element.find('.e-content.e-content-item').eq(index + 1).addClass('e-empty-content');
            rbnOnDemand.removeClass("e-rbn-ondemand");
            this.model = ribbonModel;
        },
        _groupingControls: function () {
            var tabLen = this.model.tabs.length, contextualTab, tabs, groupDiv, contDiv, tabcont;
            var i, j, tabGroupText, ribbonModel = $.extend(true, {}, this.model);
            if (this.model.contextualTabs) {
                var contextTablen = this.model.contextualTabs.length;
                for (var k = 0; k < contextTablen; k++) {
                    contextualTab = this.model.contextualTabs[k];
                    if (contextualTab.tabs) {
                        var contexttualTablen = contextualTab.tabs.length;
					    if(contexttualTablen==0)
                         this.element.find('.e-content.e-content-item').eq(i + 1).addClass('e-empty-content');
                        for (var l = 0; l < contexttualTablen; l++) {
                            if (!ej.isNullOrUndefined(contextualTab.tabs[l].groups) && contextualTab.tabs[l].groups.length > 0) {
                                this.model.tabs[tabLen] = contextualTab.tabs[l];
                                ++tabLen;
                            }
                        }
                    }
                }
            }
            for (i = 0; i < tabLen; i++) {
                tabs = this.model.tabs[i];
                this._mobileContents[i] = { "tab": tabs.text, "mobileContent": [] };
                this._mobileToolbar[i] = { "tab": tabs.text, "Content": [] };
                if (!ej.isNullOrUndefined(tabs.groups)) {
                    var tabsGrouplen = tabs.groups.length;
					if(tabsGrouplen==0)
                     this.element.find('.e-content.e-content-item').eq(i + 1).addClass('e-empty-content');
                    for (j = 0; j < tabsGrouplen; j++) {
                        if (!ej.isNullOrUndefined(tabs.groups[j])) {
                            tabGroupText = ej.isNullOrUndefined(tabs.groups[j].id) ? (ej.isNullOrUndefined(tabs.groups[j].text) ? tabs.groups[j].text : tabs.groups[j].text.replace(/\s/g, '')) : tabs.groups[j].id.replace(/\s/g, ''); 
                            contDiv = this._createControls(j, tabs, tabGroupText, i);
                            groupDiv = this._addControlsToGroup(j, tabs, tabGroupText, contDiv);
                            tabcont = this.element.find("#" + this._id + "_" + tabs.id);
                            tabcont.append(groupDiv).addClass("e-parentdiv");
                        }
                    }
                }
                else
                    this.element.find('.e-content.e-content-item').eq(i + 1).addClass('e-empty-content');
            }
            this._setTabContentHeight();
            this.model = ribbonModel;
        },
        _addControlsToGroup: function (j, tabs, tabGroupText, contDiv) {
            var contentbottom = ej.buildTag("div.e-contentbottom"), centerAlign = false, groupDiv, groupexpander;
            var captionArea = ej.buildTag("div.e-captionarea", tabs.groups[j].text);
            contentbottom.append(captionArea);
            if (tabs.groups[j].enableGroupExpander) {
                groupexpander = ej.buildTag("div#" + this._id + "_" + tabGroupText + "_e-groupexpander.e-icon e-expander e-groupexpander");
                contentbottom.append(groupexpander);
                if (!ej.isNullOrUndefined(tabs.groups[j].groupExpanderSettings)) {
                    if (!ej.isNullOrUndefined(tabs.groups[j].groupExpanderSettings.toolTip))
                        groupexpander.attr("title", tabs.groups[j].groupExpanderSettings.toolTip);
                    if (!$.isEmptyObject(tabs.groups[j].groupExpanderSettings.customToolTip))
                        groupexpander.mouseover({ value: tabs.groups[j].groupExpanderSettings, ribbonId: this._id }, $.proxy(this._tooltip, this)).mouseout({ ribbonId: this._id }, $.proxy(this._toolTipOut, this));
                }
            }
            groupDiv = ej.buildTag("div#" + this._id + "_" + tabs.id + "_" + tabGroupText).addClass("e-groupdiv").click($.proxy(this._onGroupClick, this));
            if (!ej.isNullOrUndefined(tabs.groups[j].content))
                if (tabs.groups[j].content.length == 1)
                    centerAlign = true;
            tabs.groups[j].width && groupDiv.width(tabs.groups[j].width);
            groupDiv.append(contDiv);
            if (centerAlign) {
                groupDiv.addClass("e-centeralign");
                centerAlign == false;
            }
            groupDiv.append(contentbottom);
            return groupDiv;
        },
        _tabExpandCollapse: function (e) {
            var target, args, action;
			if(e.type=="touchend")
			   e.preventDefault();
            target = e.target.tagName == "div" ? e.target : e.target.parentNode;
            action = target.className == "e-expanded" ? "collapse" : "expand";
            args = { target: $(target), type: e.type, action: action, cancel: false };
            this._trigger("toggleButtonClick", args);
            if (args.cancel)
                return;
            if (this.element.find('.e-rarrowup-2x').length > 0)
                this.collapse();
            else {
                this._removeRibbonPin();
                if (this.model.showQAT)
                    this._qAccessBar.show();
                this._trigger("pinState", { action: "pin" });
            }
            this._clickValue = "click";
        },
        _responsiveback: function () {
            this.element.find(".e-resizebtnselect").removeClass("e-active e-resizebtnselect");
            this.element.find(".e-responsivebackstagecontent").is(":visible") && this.element.find(".e-responsivebackstagecontent").hide();
            this.element.find(".e-responsivecontent").hasClass("e-resshow") && !(this.element.find(".e-responsivecontent").find(".e-split.e-active").length > 0) && this._responsiveContentBack();
            if (this.element.find(".e-respcontent").is(":visible")) {
                this.element.find(".e-active-content").addClass("e-responsiveheight e-rbnmobheader");
                this.element.find(".e-respcontent .e-groupresponsive.e-ribuparrow").removeClass("e-ribuparrow").addClass("e-ribdownarrow");
            }
            return;
        },
        _ribbonResponsive: function () {
            var ul = ej.buildTag("ul#" + this._id + "_responsivetabContent").addClass("e-rescontent");
            var count = this.model.tabs.length, tabcount = true;
            for (var i = 0; i < count ; i++)
                ul.append(ej.buildTag("li", this.model.tabs[i].text).addClass("e-responsivetabli"));
            count = this.model.contextualTabs.length;
            if (count == 1)
                tabcount = this.model.contextualTabs[0].tabs.length > 0 ? true : false;
            if (count != 0 && tabcount)
                for (var i = 0; i < count ; i++)
                    ul.append(ej.buildTag("li", this.model.contextualTabs[i].tabs[0].text).addClass("e-responsivetabli").addClass("e-resContextual"));
            var div = ej.buildTag("div#" + this._id + "_responsivetabHeader").addClass("e-responsivetabheader").click($.proxy(this._onResponsiveHeaderClick, this));
            div.append(ul);
            this.element.append(div);
            if (this._initialRender) {
                this._tabUl.find("li.e-ribresmenu a").not(".e-backstagetab").text(this._tabUl.find("li.e-active a").text());
            }
            if (this.model.applicationTab.type === ej.Ribbon.ApplicationTabType.Backstage) {
                this.element.prepend(ej.buildTag("div#" + this._id + "_responsivebackstage").addClass("e-responsivebackstage"));
                var resbackstage = ej.buildTag("div#" + this._id + "_resbackstagecontent").addClass("e-responsivebackstagecontent").append(ej.buildTag("div.e-resbackstagecontent"));
                resbackstage.prepend(ej.buildTag("div#" + this._id + "backstagetop").addClass("e-backstagerestop").append(ej.buildTag("div.e-backstagerestopcontent").append(ej.buildTag("span.e-icon").addClass("e-ribleftarrow")).append(ej.buildTag("div#" + this._id + "resbacstageTitle").addClass("e-backstageTitle"))));
                this.element.prepend(resbackstage.hide());
            }
        },
        _onResponsiveHeaderClick: function (args) {
            if ($(args.target).hasClass("e-responsivetabli")) {
                var index = $(args.target).parent("ul").children().index(args.target);
                this.element.find(".e-responsivetabheader").removeClass("e-resshow");
                this.element.find(".e-ribresmenu a").text(args.target.textContent);
                $(this._tabUl.find(".e-tab,.e-contextliset").find("a")[index]).trigger("click");
                $(args.target).parent("ul").children(".e-resactive").removeClass("e-resactive");
                $(args.target).addClass("e-resactive");
                return;
            }
            if ($(args.target).parent(".e-ribresmenu").length > 0) {
                this.element.find(".e-responsivetabheader").addClass("e-resshow"); return;
            }
        },
        _ribbonResGroup: function () {
            var tab = this._tabUl.find(".e-tab,.e-contextualtabset").index(this._tabUl.find("li.e-active"));
			if(tab<0)
			 tab=this._tabUl.find(".e-tab,.e-contextualtabset").index(this._tabUl.find("li.e-collapseactive"));
            if (!ej.isNullOrUndefined(this.model.applicationTab))
                tabIndex = tab + 1;
            var ribTabContents = this.element.find('.e-content.e-content-item');
            var ribActiveContent = this.element.find(".e-active-content");
            var tabContent = ribTabContents.eq(tabIndex).attr('id');
            var grpLen = ribTabContents.eq(tabIndex).children('.e-groupdiv').length;
            var resize = ribTabContents.eq(tabIndex).children('.e-groupdiv')[grpLen - 1];
            var curGroup = ribTabContents.eq(tabIndex).children('.e-groupdiv').eq(grpLen - 1).find('.e-resizebtn');
            if (tab != -1 && this.element.find(".e-content-item").eq(tabIndex).children().not(".e-expandcollapse").length > 0) {
                if (this._mobileContents[tab].mobileContent.length > 0 && !ribActiveContent.find(".e-respmobcontent").length > 0) {
                    ribActiveContent.prepend(ej.buildTag("div#" + this._id + "_mobcontent").addClass("e-respmobcontent e-groupmobdiv").append(ej.buildTag("div#" + this._id + "_mobribgroup").addClass("e-mobribgroup e-mobribgroupactive").append(ej.buildTag("div.e-ribupdivarrow").addClass("e-toolbaralign").append(ej.buildTag("span.e-icon").addClass("e-groupresponsive e-ribdownarrow"))))).click($.proxy(this._onGroupClick, this)).click($.proxy(this._onMobContentClick, this));
                    ribActiveContent.find(".e-resgroupheader").removeClass("e-resgroupheader");
                    var mobToolbarlen = this._mobileToolbar[tab].Content.length;
                    for (var i = 0; i < mobToolbarlen; i++)
                        ribActiveContent.find(".e-mobribgroup").append(this._mobileToolbar[tab].Content[i]);
                    ribActiveContent.find(".e-mobribgroup").append(ribActiveContent.find(".e-mobribgroup .e-ribupdivarrow"))
                }
            }
            for (var j = grpLen - 1; j >= 0; j--) {
                curGroup = ribTabContents.eq(tabIndex).children('.e-groupdiv').eq(j).find('.e-resizebtn');
                if ((curGroup.length == 0) && (j != 0 || this._mobileContents[tab].mobileContent.length > 0))
                    this._createResizeBtn(tabIndex, j);
                else if (j == 0 && curGroup.length > 0 && !this._mobileContents[tab].mobileContent.length > 0) {
                    var group = curGroup.parent().siblings();
                    curGroup.parent().remove();
                    group.show();
                    group.not('.e-contentbottom').css("width", "");
                }
            }

        },
        _ribbonWindowResize: function () {
            this._phoneMode = (this.model.allowResizing || this.model.isResponsive) && document.documentElement.clientWidth < 420 ? true : false;
            var tab = this._tabUl.find(".e-tab,.e-contextualtabset").index(this._tabUl.find("li.e-active"));
            var ribbonPin = this.element.find(".e-ribbonpin");
            var ribTabContents = this.element.find('.e-active-content').eq(0);
            var responsiveTab = this.element.find(".e-ribresmenu"), backstage, backstagePage, mobiletoolgroup;
            var responsiveContent = this.element.find(".e-respcontent"), tabIndex;
            if (!ej.isNullOrUndefined(this.model.applicationTab))
                tabIndex = tab + 1;
            this.element.find(".e-ribGroupContent.e-resshow").addClass("e-reshide");
            if (this._phoneMode) {
                this._responsiveScrollRemove();
                if (responsiveContent.is(":hidden") && this.element.find(".e-responsivecontent").is(":hidden"))
                    responsiveContent.removeClass("e-reshide")
                if (this._isCollapsed) {
                    if (this._tabUl.find(".e-active").length > 0)
                        responsiveTab.find("a").text(this._tabUl.find(".e-active a").text());
                    else {
                        this._responsiveTabText.eq(0).addClass("e-resactive");
                        responsiveTab.find("a").text(this._responsiveTabText.filter(".e-resactive").text());
                    }
                }
                else {
                    this._responsiveTabText.filter(".e-resactive").removeClass("e-resactive");
                    this._responsiveTabText.eq($(this._ribbonTabs.filter(".e-tab ,.e-contextualtabset")).index(this._ribbonTabs.filter(".e-active"))).addClass("e-resactive")
                    responsiveTab.find("a").text(this._responsiveTabText.filter(".e-resactive").text());
                }
                if (ribbonPin.length > 0)
                    ribbonPin.trigger("click");
                ribTabContents.addClass("e-responsiveheight e-rbnmobheader").addClass("e-tab_" + this._tabUl.find(".e-active a").text());
                if (!ribTabContents.hasClass("e-respcontent"))
                    ribTabContents.addClass("e-respcontent");
                var responsivenestedmenu = ribTabContents.find(".e-groupresponsive");
                if ($(responsivenestedmenu).eq(0).hasClass("e-ribdownarrow") || responsivenestedmenu.hasClass("e-ribuparrow"))
                    responsivenestedmenu.hasClass("e-ribuparrow") && responsivenestedmenu.eq(0).removeClass("e-ribuparrow").addClass("e-ribdownarrow");
                if (!ej.isNullOrUndefined(this.model.applicationTab))
                    this.element.find(".e-ribresmenu").css("padding-left", "12px");
                this._ribbonResGroup();
                this.element.addClass("e-responsive");
                this.element.find(".e-rbn-ddl.e-ddl").addClass("e-rbn-resize");
                backstagePage = this.element.find(".e-ribbonbackstagepage");
                backstage = this.element.find(".e-responsivebackstage");
                var headerWidth = this.element.find(".e-header").width();
                if (this.model.enableOnDemand && this.element.find(".e-backstagetab .e-resbackstage").length == 0) {
                    if (this.model.applicationTab.type === ej.Ribbon.ApplicationTabType.Backstage)
                        this._applicationTab.addClass('e-backstagetab');
                    this.element.find(".e-backstagetab").append(ej.buildTag("span.e-icon").addClass("e-ribbon e-resbackstage").click($.proxy(this._onResponsiveHeaderClick, this)));
                    this.element.find(".e-header").addClass("e-resheader");
                }
                else if (this.model.applicationTab.type == ej.Ribbon.ApplicationTabType.Backstage && this.element.find(".e-backstagetab .e-resbackstage").length == 0) {
                    this.element.find(".e-backstagetab").append(ej.buildTag("span.e-icon").addClass("e-ribbon e-resbackstage").click($.proxy(this._onResponsiveHeaderClick, this)));
                    this.element.find(".e-header").addClass("e-resheader");
                }
                  else if (this.model.applicationTab.type == ej.Ribbon.ApplicationTabType.Menu && this.model.applicationTab.menuItemID)
                {
                    this.element.find(".e-header").addClass("e-resheader");
                    this.element.find(".e-rescontent").addClass("e-rescontent-menu");
                }
                if (this.model.showQAT) {
                    this._tabUl.find("li.e-responsiveqat").append(this.element.find(".e-rbnquickaccessbar.e-rbnabove").children());
                    var headerContent = this.element.find(".e-ribdownarrow").not(".e-groupresponsive");
                    if (this.element.find(".e-resqatScroll").length > 0) {
                        var mobQATScroll = this.element.find(".e-resqatScroll")
                        mobQATScroll.data("ejScroller")._destroy();
                        mobQATScroll.parent().append(mobQATScroll.find("div:first").children());
                        mobQATScroll.remove();
                    }
                    var qatOffset = ((headerWidth - (headerContent.offset().left + headerContent.outerWidth())) < (headerWidth - this.element.find("li.e-responsiveqat").offset().left));
                    if (qatOffset && !this.element.find(".e-resqatScroll").length > 0) {
                        var diff = (headerWidth - this.element.find("li.e-responsiveqat").offset().left) - (headerWidth - (headerContent.offset().left + headerContent.outerWidth()));
                        var div = ej.buildTag("div#" + this._id + "_responsiveqat").addClass("e-resqatScroll").append(ej.buildTag("div"));
                        div.find("div").append(this._tabUl.find("li.e-responsiveqat").children());
                        this._tabUl.find("li.e-responsiveqat").append(div);
                        var qatScroll = this.element.find(".e-resqatScroll");
                        qatScroll.ejScroller({ width: (headerWidth - this.element.find("li.e-responsiveqat").offset().left) - diff, height: "", scrollerSize: 3, buttonSize: 0 })
                    }
                }
                if (ribTabContents.find(".e-groupdiv .e-resizebtn").length > 0 && !ribTabContents.find(".e-groupdiv .e-groupresponsive").not(".e-ribdownarrow").length > 0)
                    ribTabContents.find(".e-groupdiv").find(".e-resizebtn").parent("div").prepend(ej.buildTag("div.e-ribrightdivarrow").append(ej.buildTag("span.e-icon").addClass("e-groupresponsive e-ribrightarrow")));
                if (this._tabUl.find(".e-backstagetab").length > 0 && backstage.length == 1) {
                    var backstagecontent = backstagePage.find(".e-ribbonbackstagebody .e-backstageheader");
                    backstage.append(backstagecontent).addClass("e-reshide");
                }
                if (!this.element.find(".e-responsivecontent").length > 0) {
                    var div = ej.buildTag("div#" + this._id + "_responsive").addClass("e-content e-responsivecontent").click($.proxy(this._onResizeDivClick, this));
                    div.append(ej.buildTag("div#" + this._id + "_resback").addClass("e-responsiveback").append(ej.buildTag("span").addClass("e-groupresponsive e-icon e-ribleftarrow")).append(ej.buildTag("div#" + this._id + "+rescontentback").addClass("e-restopbackcontent")));
                    this.element.append(div.hide());
                }
                if (backstagePage.find(".e-ribbonbackstagebody .e-backstagecontent").length > 0)
                    this.element.find(".e-responsivebackstagecontent .e-resbackstagecontent").append(backstagePage.find(".e-ribbonbackstagebody .e-backstagecontent"));
                var header = this.element.find(".e-header");
                var screenHeight = document.documentElement.clientHeight;
                mobiletoolgroup = this.element.find(".e-mobribgroup.e-mobribgroupactive");
                this.element.find(".e-responsivebackstagecontent .e-resbackstagecontent").css({ "height": screenHeight - this.element.find(".e-backstagerestop").outerHeight() });
                mobiletoolgroup.find(".e-ribupdivarrow").removeClass("e-toolbaralign");
                var mobToolbarScroll = mobiletoolgroup.find(".e-resptoolbarScroll");
                if (mobToolbarScroll.length > 0) {
                    mobToolbarScroll.data("ejScroller")._destroy();
                    mobToolbarScroll.parent().append(mobToolbarScroll.find("div:first").children());
                    mobToolbarScroll.parents(".e-active-content").removeClass("e-responsiveToolbarScroll");
                    mobToolbarScroll.remove();
                }
                if (this._phoneMode && mobiletoolgroup.outerWidth() > this.element.find(".e-header").outerWidth()) {
                var div = ej.buildTag("div#" + this._id + "_responsivetoolbar").addClass("e-resptoolbarScroll").append(ej.buildTag("div"));
                div.find("div").append(mobiletoolgroup.children());
                mobiletoolgroup.append(div);
                var toolbarScroll = this.element.find(".e-respmobcontent .e-resptoolbarScroll");
                toolbarScroll.find(".e-toolbaralign").removeClass("e-toolbaralign");
                toolbarScroll.ejScroller({ width: this.element.find(".e-header").width(), height: "", scrollerSize: 4, buttonSize: 0 })
                toolbarScroll.parents(".e-active-content").addClass("e-responsiveToolbarScroll");
            }
            else if (mobiletoolgroup.find(".e-resptoolbarScroll").length > 0 && !mobiletoolgroup.find("e-responsiveToolbarScroll").length > 0)
                mobiletoolgroup.parents(".e-active-content").addClass("e-responsiveToolbarScroll");
            else mobiletoolgroup.find(".e-ribupdivarrow").addClass("e-toolbaralign"); {
                this.goToMainContent();
                return;
            }
            }
            else {
                if (this.element.hasClass("e-responsive")) {
                    this.element.removeClass("e-responsive");
                    this._ribbonRerender();
                   
                }
            }

            if (this.model.allowResizing || this.model.isResponsive) {
                if (this.element.find('.e-ribbonpin').length > 0 && this.element.find('.e-active-content').eq(0).is(':visible')) {
                    this.collapse();
                }
                else
                    this._ribbonResize();
            }
            if (this.element.find('.e-ribbonpin').length > 0)
                this._tabContents.width(this.element.width());
        },
        _ribbonResize: function () {
            var tabContent, resize, tabIndex, tabLeft, tabWidth, tabHeadLen, curHead, curTextLen, grpLen, contentWidth, grpsWidth, resizeBtnLen = 0, resizeBtn, m = 0, tabArray = [], resizeHead, toolTip, tabUl, curGroup, expandDiv, resizeHeadLen;
            var ribTabContents, ribActiveCon = this.element.find('.e-active-content').eq(0), ribTabs, ribTabsVisible, ribResizeDiv, resizeTab, ribbonPin = this.element.find('.e-ribbonpin');
            ribTabsVisible = this._tabUl.find('li.e-select:visible,li.e-active:visible'), ribResizeDiv = this.element.find('.e-resizediv'), expandDiv = this.element.find('.e-expandcollapse');
            tabUl = this.element.find('.e-header');
            if (ribbonPin.length > 0) {
                this._removeRibbonPin();
                expandDiv.children().addClass('e-ribbonpin');
            }
            if (tabUl.is(":hidden") && ribActiveCon.is(":hidden")) {
                if (this._resizeWidth <= this.element.width() + this.element.offset().left) {
                    tabUl.show();
                    this._qAccessBar.show();
                    if (this.element.find('.e-expandcollapse').children().hasClass('e-expanded') || tabUl.find('.e-active').length > 0) {
                        if (ribbonPin.length <= 0) {
                            ribActiveCon.show();
                            expandDiv.children().addClass('e-expanded').removeClass('e-collapsed');
                        }
                        else if (ribbonPin.length > 0)
                            this.collapse();
                    }
                }
            }
            ribTabs = tabUl.find('li.e-select,li.e-active');
            tabHeadLen = ribTabs.length;
            if (tabUl.is(":visible")) {
                for (var t = tabHeadLen - 1; t > 0; t--) {
                    curHead = ribTabs.eq(t).children();
                    curTextLen = curHead.text().length - 1;
                    for (var s = curTextLen; s > 1; s--) {
                        if (ribTabsVisible.length > 0) {
                            tabLeft = ribTabsVisible.last().offset().left;
                            tabWidth = ribTabsVisible.last().width();
                            if (((this.element.width() + this.element.offset().left) - 30) - (tabLeft + tabWidth) <= 0 || (this.model.enableRTL && ribTabsVisible.last().offset().left < this.element.offset().left)) {
                                if (!curHead.hasClass("e-resizeHead"))
                                    curHead.text(curHead.text().slice(0, -1)).addClass("e-resizeHead");
                                else
                                    curHead.text(curHead.text().slice(0, -1));
                            }
                        }
                    }
                }
                resizeTab = tabUl.find('.e-resizeHead');
                if (tabHeadLen - 1 === resizeTab.length && resizeTab.eq(0).text().length <= 2) {
                    if (ribTabsVisible.length > 0) {
                        tabLeft = ribTabsVisible.last().offset().left;
                        tabWidth = ribTabsVisible.last().width();
                        if (((this.element.width() + this.element.offset().left) - 30) - (tabLeft + tabWidth) <= 0) {
                            this._resizeWidth = this.element.width() + this.element.offset().left;
                        }
                    }
                }
            }
            tabIndex = this._tabObj.model.selectedItemIndex;
            ribTabContents = this.element.find('.e-content.e-content-item');
            tabContent = ribTabContents.eq(tabIndex).attr('id');
            grpLen = ribTabContents.eq(tabIndex).children('.e-groupdiv').length;
            resize = ribTabContents.eq(tabIndex).children('.e-groupdiv')[grpLen - 1];
            curGroup = ribTabContents.eq(tabIndex).children().eq(grpLen - 1).find('.e-resizebtn');
            if (!ej.isNullOrUndefined(resize)) {
                for (var j = grpLen - 1; j >= 0; j--) {
                    curGroup = ribTabContents.eq(tabIndex).children().eq(j).find('.e-resizebtn');
                    if ((this.element.width() + this.element.offset().left - 25) - (resize.offsetWidth + $(resize).offset().left) <= 0 || (this.model.enableRTL && ($(window).width() - this.element.offset().left + 25) - ($(window).width() - $(resize).offset().left + resize.offsetWidth) <= 0)) {
                        if (curGroup.length === 0)
                            this._createResizeBtn(tabIndex, j);
                    }
                }
                if ((this.element.width() + this.element.offset().left - 25) - (resize.offsetWidth + $(resize).offset().left) <= 0 || (this.model.enableRTL && ($(window).width() - this.element.offset().left + 25) - ($(window).width() - $(resize).offset().left + resize.offsetWidth) <= 0)) {
                    if (grpLen === ribTabContents.eq(tabIndex).find('.e-resizebtn').length) {
                        this._resizeWidth = this.element.width() + this.element.offset().left;
                        this.element.addClass("e-grpdivhide")
                        this.element.find('.e-expandcollapse').css("display", "none");
                    }
                }
                else {
                    this.element.removeClass("e-grpdivhide");
                    this.element.find('.e-expandcollapse').css("display", "block");
                }
            }
            this._qatResize();
            if (ribResizeDiv.is(":visible")) {
                var resizeCon = ribResizeDiv.children().eq(0).attr("id");
                resizeCon = "#" + resizeCon.replace("_content", "");
                ribResizeDiv.children().hide().appendTo(resizeCon);
                ribResizeDiv.hide();
            }
            var tabLen = this.model.tabs.length
            for (var l = 0; l < tabLen; l++) {
                var tabText = this.model.tabs[l].text;
                tabArray.push(tabText);
            }

            if (this.model.contextualTabs) {
                var contextTabLen = this.model.contextualTabs.length;
                for (var i = 0; i < contextTabLen; i++) {
                    if (this.model.contextualTabs[i].tabs) {
                        var contexttualTabLen = this.model.contextualTabs[i].tabs.length;
                        for (var j = 0; j < contexttualTabLen; j++) {
                            tabText = this.model.contextualTabs[i].tabs[j].text;
                            tabArray.push(tabText);
                        }
                    }
                }
            }

            resizeHeadLen = tabUl.find(".e-resizeHead").length;
            if (tabUl.is(":visible")) {
                for (var t = 0; t < resizeHeadLen; t++) {
                    curHead = tabUl.find(".e-resizeHead").eq(0);
                    if (curHead.hasClass("e-resizeHead")) {
                        var aTagLen = ribTabs.find(".e-link").not('.e-resizeHead').length - 1;
                        var textLen = curHead.text().length;
                        var tabLength = tabArray[aTagLen].length;
                        for (var s = textLen; s <= tabLength; s++) {
                            if (ribTabsVisible.length > 0) {
                                tabLeft = ribTabsVisible.last().offset().left;
                                tabWidth = ribTabsVisible.last().width() + 15;
                                if (((this.element.width() + this.element.offset().left) - 30) >= (tabLeft + tabWidth) && !this.model.enableRTL || (this.model.enableRTL && ribTabsVisible.last().offset().left - 15 > this.element.offset().left)) {
                                    if (curHead.text().length === tabArray[aTagLen].length)
                                        curHead.removeClass("e-resizeHead");
                                    else if (this._width != this.element.width())
                                        curHead.text(tabArray[aTagLen].slice(0, curHead.text().length + 1));
                                }
                            }
                        }
                    }
                }
            }
            resizeBtnLen = ribTabContents.eq(tabIndex).find('.e-resizebtn').length;
            for (var i = 0; i < resizeBtnLen; i++) {
                resizeBtn = ribTabContents.eq(tabIndex).find('.e-resizebtn').eq(0);
                if ($(resizeBtn).is(':visible')) {
                    grpsWidth = this.element.width() + this.element.offset().left - 25;
                    contentWidth = resizeBtn.offset().left + resizeBtn.parent().siblings().not('.e-contentbottom').width();
                    if (this.model.enableRTL)
                        contentWidth = (this.element.width() + this.element.offset().left - resizeBtn.offset().left) + resizeBtn.parent().siblings().not('.e-contentbottom').width();
                    var resizeBtnLength = ribTabContents.eq(tabIndex).find('.e-resizebtn').length;
                    if (resizeBtnLength > 1) {
                        for (var k = 0; k < resizeBtnLength; k++)
                            contentWidth = contentWidth + ribTabContents.eq(tabIndex).find('.e-resizebtn').eq(k).parents('.e-groupdiv').width() + 7;
                    }
                    if (grpsWidth > contentWidth) {
                        var rez = resizeBtn.parent().siblings();
                        resizeBtn.parent().remove();
                        rez.show();
                        rez.not('.e-contentbottom').css("width", "");
                    }
                }
            }
            this._qatResizeRemove();
            toolTip = this.element.find('.e-tooltipdiv');
            toolTip.hide();
            toolTip.find('.e-tooltiptitle').children().remove();
            toolTip.find('.e-tooltipdesc').children().remove();
            if (this.element.find('.e-ribbonpin').length > 0 && this.element.find('.e-active-content').eq(0).is(':visible')) {
                this._addRibbonPin();
                this._tabContents.width(this.element.width());
            }
            this.element.find('.e-resizebtnselect').removeClass('e-resizebtnselect e-active');
            if (this.model.showQAT) {
                var qaMenu = this.element.find('.e-rbnqatmenu');
                if (qaMenu.is(':visible'))
                    qaMenu.hide().css({ top: '', left: '' });
                this.element.find('.e-qaresizebtn,.e-splitbtnqat').removeClass('e-tbtn e-active');
            }
        },
        _qatResize: function () {
            if (this.model.showQAT && this._qAccessBar.is(':visible')) {
                var qaLastEle, qaResizeDiv;
                var qatToolbarlen = this._qAccessBar.children(':visible').length;
                for (var i = 0; i < qatToolbarlen; i++) {
                    qaLastEle = this._qAccessBar.children(':visible').last();
                    if (this.element.width() - (qaLastEle.width() + $(qaLastEle).position().left + 6) <= 0) {
                        if (qaLastEle.hasClass('e-splitbtnqatdiv')) {
                            var qatResizeBtnDiv = ej.buildTag("div.e-qaresizebtndiv").attr('title', 'More Controls'), qaResizeBtn = ej.buildTag("button.e-qaresizebtn");
                            qaResizeDiv = ej.buildTag("div.e-qaresizediv").hide();
                            this.element.append(qaResizeDiv);
                            qaResizeDiv.append(qaLastEle.prev());
                            qatResizeBtnDiv.append(qaResizeBtn.ejButton({
                                size: "normal",
                                type: "button",
                                contentType: "imageonly",
                                height: 30,
                                width: 14,
                                prefixIcon: "e-icon e-ribbon e-qaresizebtnicon",
                                click: $.proxy(this._onQatResizeBtnClick, this)
                            }));
                            qaResizeDiv.append(qaLastEle);
                            qatResizeBtnDiv.insertBefore(this.element.find('.e-rbnqatmenu'));
                        }
                        else if (qaLastEle.hasClass('e-qaresizebtndiv')) {
                            qaResizeDiv = this.element.find('.e-qaresizediv');
                            qaResizeDiv.prepend(qaLastEle.prevAll(':visible').first());
                        }
                    }
                }
                qaResizeDiv = this.element.find('.e-qaresizediv');
                if (qaResizeDiv.is(':visible'))
                    qaResizeDiv.hide();
            }
        },
        _qatResizeRemove: function () {
            var qaResizeDiv = this.element.find('.e-qaresizediv'), rbnWidth = this.element.width(), qAccessBarWidth = 0, qaResizebBtnDiv;
            if (qaResizeDiv.length > 0 && this._qAccessBar.is(':visible') && this.model.showQAT) {
                qaResizeDiv.show();
                qaResizebBtnDiv = this.element.find('.e-qaresizebtndiv');
                var qatToolbarlen = this._qAccessBar.children(':visible').length;
                var qaResizelen = qaResizeDiv.children().length;
                for (var i = 0; i < qatToolbarlen; i++)
                    qAccessBarWidth = qAccessBarWidth + this._qAccessBar.children(':visible').eq(i).width() + 6;
                for (var i = 0; i <= qaResizelen; i++) {
                    if (qaResizeDiv.children().length > 2)
                        qAccessBarWidth = qAccessBarWidth + qaResizeDiv.children().eq(0).width();
                    else
                        qAccessBarWidth = qAccessBarWidth + qaResizeDiv.width();
                    if (rbnWidth > qAccessBarWidth) {
                        if (qaResizeDiv.children().length > 2)
                            qaResizeDiv.children().eq(0).insertBefore(qaResizebBtnDiv);
                        else {
                            qaResizeDiv.children().insertBefore(qaResizebBtnDiv);
                            this.element.find('.e-qaresizebtndiv').remove();
                            qaResizeDiv.remove();
                        }
                    }
                }
                qaResizeDiv.hide();
            }
        },
        _createResizeBtn: function (i, j) {
            var groupText, grpWidth, ribTabContents = this.element.find('.e-content.e-content-item'), curGroup, grpContents, grpHeight;
            curGroup = ribTabContents.eq(i).children('.e-groupdiv').eq(j);
            if(!this.element.find(".e-respcontent").length) 
				grpHeight = curGroup.height();
            var tabCollec = $.extend(true, [], this.model.tabs);
            for (var s = 0; s < this.model.contextualTabs.length; s++) {
                for (var v = 0; v < this.model.contextualTabs[s].tabs.length; v++) {
                    tabCollec.push(this.model.contextualTabs[s].tabs[v]);
                }
            }
            var groupId = ej.isNullOrUndefined(tabCollec[i - 1].groups[j].id) ? tabCollec[i - 1].groups[j].text : tabCollec[i - 1].groups[j].id;
            groupText = curGroup.find('.e-contentbottom').text();
            grpContents = curGroup.children().not('.e-contentbottom');
            grpWidth = grpContents.width();
            if (ej.isNullOrUndefined(this._responsiveContentStyle))
                this._responsiveContentStyle = { "height": grpHeight };
            curGroup.children().hide();
            grpContents.css("width", grpWidth);
            var rBtnDiv = ej.buildTag("div.e-resizegroupdiv#" + this._id + "_" + "resizeDiv" + "_" + groupId);
            var rBtn = ej.buildTag("button#" + this._id + "_" + "resizebtn" + "_" + groupId, groupText, {}, { type: "button" }).addClass("e-resizebtn e-rbn-button")
            var data = { target: ribTabContents.eq(i).children('.e-groupdiv').eq(j).children() };
            rBtn.ejButton({
                click: $.proxy(this._resizeBtnClick, data),
                contentType: ej.ContentType.TextAndImage,
                imagePosition: ej.ImagePosition.ImageBottom,
                prefixIcon: "e-icon e-ribbonresize"
            });
            curGroup.height(grpHeight);
            rBtn.children().prepend("<span class='e-icon e-" + groupText + "'></span>").height(grpHeight - 5);
            rBtn.appendTo(rBtnDiv);
            rBtnDiv.appendTo(ribTabContents.eq(i).children('.e-groupdiv').eq(j));
        },
        _resizeBtnClick: function (args) {

        },
        _responsiveCustomize: function (responsivecontent) {
            responsivecontent.find(".e-rbn-resize").parents(".e-controlpadding").addClass("e-rbn-resize").addClass("e-rbn-dll-cus");
            responsivecontent.find(".e-rbn-resize").parents(".e-innerdivrow").addClass("e-rbn-resize").next().css("display", "inline-block");
        },
        _responsiveContentShow: function (responsivecontent) {
            var content = this.element.find(".e-active-content");
            this._responsiveCustomize(responsivecontent);
            content.addClass("e-reshide");
            responsivecontent.addClass("e-resshow");
            this.element.find(".e-responsivecontent .e-ribGroupContent").addClass("e-resshow");
            if (responsivecontent.find(".e-ribGroupContent").height() > this._responsiveHeight) {
                var div = ej.buildTag("div#" + this._id + "_responsivecontentScroll").addClass("e-rescontentScroll").append(ej.buildTag("div"));
                div.find("div").append(responsivecontent.children(".e-ribGroupContent"));
                responsivecontent.append(div);
                responsivecontent.find(".e-rescontentScroll").ejScroller({ height: this._responsiveHeight, scrollerSize: 8, buttonSize: 0 });
            }
           content.find(".e-resizebtnselect").removeClass("e-resizebtnselect");
        },
        _responsiveContentBack: function () {
            this._responsiveTarget.append(this._responsiveContent).find(".e-ribGroupContent").addClass("e-reshide").css(this._responsiveContentStyle);
            this._responsiveContent = null;
            this.element.find(".e-resizebtn.e-active").removeClass("e-active e-resizebtnselect");
            if (this.element.find(".e-galleryexpand.e-gallerymoveicon").length > 0)
                this.element.find(".e-galleryexpand.e-gallerymoveicon").trigger("click")
            this.element.find(".e-content.e-responsivecontent").children().not(".e-responsiveback").remove();
            this.element.find(".e-active-content").removeClass("e-reshide");
            this.element.find(".e-responsivecontent").removeClass("e-resshow");
        },
        _ribbonDocClick: function (e) {
            if (this.element.hasClass("e-responsive")) {
                var target = e.target, args = {}, proxy = this;
                var responsiveBackstage = this.element.find(".e-responsivebackstage"), respTabHeader = this.element.find(".e-responsivetabheader");
                var content = this.element.find(".e-active-content");
                var responsebackstage = this.element.find(".e-responsivebackstage");
                if (((!$(e.target).parents(".e-ribbon").length > 0 && !(e.target == document.documentElement) && !$(e.target).parents(".e-rbn-ddl").length > 0) && !$(e.target).parents(".e-popup").length > 0) && !this.element.find(".e-responsivecontent").is(":visible")) {
                    respTabHeader.removeClass("e-resshow");
                    if (responsiveBackstage.is(":visible"))
                        responsiveBackstage.removeClass("e-backstageshowanimate");
                    if (this.element.find(".e-responsivecontent").is(":visible"))
                        this._responsiveContentBack();
                    this.element.find(".e-responsivebackstagecontent").hide();
                    if (!content.hasClass("e-responsiveheight")) {
                        content.addClass("e-responsiveheight e-rbnmobheader");
                        this._responsiveScrollRemove();
                        content.find(".e-groupresponsive.e-ribuparrow").removeClass("e-ribuparrow").addClass("e-ribdownarrow")
                        args.isMobile = this.element.hasClass("e-responsive");
                        args.target = target;
                        args.currentTarget = e.currentTarget
                        args.eventType = e.type
                        this.element.find('.e-content.e-content-item').on("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
                            function (event) {
                                    proxy._trigger("collapse", args);
                            });
                    }
                    return;
                }
                if ($(target).hasClass("e-header") || $(target).hasClass("e-ribGroupContent") || $(target).hasClass("e-groupresponsive") || $(target).hasClass("e-respmobcontent")) {
                    if (respTabHeader.hasClass("e-resshow"))
                        respTabHeader.removeClass("e-resshow");
                    if (responsiveBackstage.is(":visible"))
                        responsiveBackstage.removeClass("e-backstageshowanimate");
                }
                if ($(target).parent().hasClass("e-backstagerestopcontent") && !$(".e-ddl-popup").is(":visible")) {
                    $(target).parents(".e-responsivebackstagecontent").hide();
                    return;
                }
                else return;
            }
            var resizeDiv, resizeContent, expClick, gallery, gryColumns, contentHeight, toolTip, control, modelDivCon, activeContent, disabled;
            var popup, galExpandCont = this.element.find(".e-gallexpandcontent");
            modelDivCon = this.element.find("#" + this._id + "_modelDiv");
            activeContent = this.element.find(".e-active-content");
            if (modelDivCon.is(':visible'))
                modelDivCon.hide();
            if (galExpandCont.hasClass('e-gallerypopupshow')) {
                galExpandCont.removeClass("e-gallerypopupshow")
                modelDivCon.hide();
            }
            if ($(".e-rbn-splitbtn").parents().hasClass('e-active') || this.element.find('.e-resizebtn').hasClass('e-resizebtnselect') || $('.e-ddl-popup.e-rbn-ddl:visible').length > 0 || this.element.find('.e-colorwidget').hasClass('e-active')) {
                activeContent.append(modelDivCon.show().height("100%"));
            }
            popup = $('.e-ribbonpopup:visible');
            if (popup.length > 0 && !popup.hasClass("e-ribbonpopupshow")) {
                popup.addClass("e-ribbonpopupshow");
                activeContent.append(modelDivCon.show().height("100%"));
            }
            else if (popup.hasClass("e-ribbonpopupshow"))
                popup.removeClass("e-ribbonpopupshow");
            if ($(e.target).hasClass("e-expgallerydiv") || $(e.target).parents(".e-expgallerydiv").length > 0) {
                galExpandCont.addClass("e-gallerypopupshow");
                activeContent.append(modelDivCon.show().height("100%"));
            }
            if ($(e.target).hasClass('e-gallerymoveicon') || $(e.target).hasClass('e-gallerymovediv') || $(e.target).hasClass('e-expgallerydiv') || $(e.target).hasClass('e-scrollbar') || $(e.target).parents().hasClass('e-scrollbar'))
                expClick = e.target;
            else if ($(e.target).parents().hasClass('e-gallerymenu')) {
                if ($(e.target).hasClass('e-haschild') || $(e.target).hasClass('aschild') || $(e.target).hasClass('e-arrows'))
                    expClick = e.target;
            }
            if (ej.isNullOrUndefined(expClick))
                this._ribbonGalleryShow();
            toolTip = this.element.find('.e-tooltipdiv');
            disabled = $(e.target).find('.e-disable');
            if (toolTip.is(':visible') && $(disabled).length <= 0 && (!$(e.target).hasClass('e-disable')))
                toolTip.hide();
            if ($(e.target).hasClass('e-backstagechild') || $(e.target).parents('.e-backstagechild').length > 0 || $(e.target).hasClass('e-ribbonbackstagepage') || $(e.target).hasClass('e-apptab') || $(e.target).parents('.e-ribbonbackstagepage').length > 0 || $(e.target).parents('.e-apptab').length > 0)
                expClick = e.target;
			if(ej.isNullOrUndefined(expClick) && $(document).find($(e.target)).length==0)
			 expClick=$(e.currentTarget.activeElement);
            if (ej.isNullOrUndefined(expClick))
                this.element.find(".e-ribbonbackstagepage").hide();
            if (!$(e.target).hasClass('e-disable-item') && $(e.target).parents('.e-disable-item').length <= 0)
                this.element.find(".e-controlclicked").removeClass('e-controlclicked');
            control = $(e.target).parents('.e-controlpadding');
            if (control.length > 0 && $(disabled).length <= 0 && (!$(e.target).hasClass('e-disable')))
                if ($(control).find('.e-ribbongallerycontrol').length <= 0)
                    $(control).addClass('e-controlclicked');
            if (this.element.find('.e-ribbonpin').is(':visible') && $(e.target).parents('.e-ribbon').length <= 0 && !$(e.target).hasClass('e-scrollbar') && !$(e.target).parents().hasClass('e-scrollbar'))
                this.collapse();
            if (this.element.find('.e-resizediv').is(':hidden'))
                this.element.find('.e-resizebtnselect').removeClass('e-resizebtnselect e-active');
            this._tabUl.find('.e-link.e-active').removeClass('e-active');
            if (this.model.showQAT) {
                var qaMenu = this.element.find('.e-rbnqatmenu'), qaResizeDiv = this.element.find('.e-qaresizediv'), splitBtnQat = this.element.find('.e-splitbtnqat');
                if (!$(e.target).hasClass('e-splitbtnqatdiv') && $(e.target).parents('.e-splitbtnqatdiv').length <= 0 && $(e.target).parents('.e-rbnqatmenu').length <= 0)
                    qaMenu.hide().css({ top: '', left: '' });
                if (!$(e.target).hasClass('e-qaresizebtndiv') && qaMenu.is(':hidden') && $(e.target).parents('.e-qaresizediv').length <= 0 && $(e.target).parents('.e-qaresizebtndiv').length <= 0 && !$(e.target).hasClass('e-splitbtnqatdiv') && $(e.target).parents('.e-splitbtnqatdiv').length <= 0)
                    qaResizeDiv.hide().css({ top: '', left: '' });
                if (qaResizeDiv.is(':hidden') && this.element.find('.e-qaresizebtn').hasClass('e-active') && !$(e.target).hasClass('e-qaresizebtndiv') && $(e.target).parents('.e-qaresizebtndiv').length <= 0 && $(e.target).parents('.e-rbnqatmenu').length <= 0)
                    this.element.find('.e-qaresizebtn').removeClass('e-tbtn e-active');
                if (splitBtnQat.hasClass('e-active') && !$(e.target).hasClass('e-splitbtnqatdiv') && $(e.target).parents('.e-splitbtnqatdiv').length <= 0 && $(e.target).parents('.e-rbnqatmenu').length <= 0)
                    splitBtnQat.removeClass('e-tbtn e-active');
            }
        },
        _ribbonGalleryShow: function () {
            var startIndex = 0;
            if (this.element.find('.e-gallexpandcontent:visible').length > 0) {
                var visibleRows = 0, n = 0;
                gallery = this.element.find('.e-gallexpandcontent:visible').parent().find('.e-ribbongallery');
                var galleryRowlen = gallery.find('.e-galleryrow').length;
                for (var i = 1; i <= galleryRowlen; i++) {
                    if (gallery.find('.e-galleryrow').eq(i - 1).css('display') === "block") {
                        if (visibleRows === 0)
                            startIndex = i - 1;
                        ++visibleRows;
                    }
                }
                gallery.find('.e-galleryrow').hide();
                gallery.parent().find('.e-gallexpandcontent').hide();
                gallery.show();
                gryColumns = gallery.find('.e-galleryrow').eq(0).children().length;
                gallery.find('.e-galleryrow').eq(0).children().remove();
                var galleryRowlen = gallery.find('.e-galleryrow').length;
                for (var k = 0; k < galleryRowlen; k++) {
                    for (var l = 0; l < gryColumns; l++) {
                        var activeBtn = gallery.parent().find('.e-galleryexpanderrow').children().eq(0);
                        if ($(activeBtn).hasClass("e-galleryselect")) {
                            gallery.find('.e-galleryrow').eq(k).append(gallery.parent().find('.e-galleryexpanderrow').children().eq(0)).show();
                            --visibleRows;
                            for (var i = 1; i <= visibleRows; i++) {
                                if (gallery.find('.e-galleryrow').eq(k + i).length > 0)
                                    gallery.find('.e-galleryrow').eq(k + i).show();
                                else {
                                    ++n;
                                    gallery.find('.e-galleryrow').eq(k - n).show();
                                }
                            }
                            if (!gallery.find('.e-galleryrow').last().is(':visible'))
                                gallery.parent().find('.e-movedowndiv').removeClass('e-disablegrymovebtn');
                            else
                                gallery.parent().find('.e-movedowndiv').addClass('e-disablegrymovebtn');
                            if (gallery.find('.e-galleryrow').first().is(':visible'))
                                gallery.parent().find('.e-moveupdiv').addClass('e-disablegrymovebtn');
                            else
                                gallery.parent().find('.e-moveupdiv').removeClass('e-disablegrymovebtn');
                        }
                        else
                            gallery.find('.e-galleryrow').eq(k).append(gallery.parent().find('.e-galleryexpanderrow').children().eq(0));
                    }
                }
                if (gallery.find('.e-galleryselect').length <= 0) {
                    for (var i = 0; i < visibleRows; i++) {
                        gallery.find('.e-galleryrow').eq(startIndex).show();
                        ++startIndex;
                    }
                }
                gallery.parent().find('.e-galleryexpanderrow').remove();
            }
        },
        _resizeDivHide: function () {
            var resizeArea = this.element.find('.e-resizediv'), resizeCon;
            this._off($(document), "mousedown", this._rbndocumentClick);
            if ($(resizeArea).is(":visible")) {
                resizeCon = $(resizeArea).children().eq(0).attr("id");
                if (!ej.isNullOrUndefined(resizeCon)) {
                    resizeCon = "#" + resizeCon.slice(0, -8);
                    $(resizeArea).children().hide().appendTo(resizeCon);
                    this.element.find("#" + this._id + "_disabled").hide();
                    $(resizeArea).hide();
                }
                if (this.element.find('.e-ribbonpin').length > 0)
                    $(resizeArea).css({ 'top': '' });
            }
        },
        _resizeDivShow: function (resizeDiv) {
            var contentWidth, contentLeft, curGroup, rDivPadding, resizeArea = this.element.find('.e-resizediv');
            curGroup = this.element.find("#" + resizeDiv[0].id).parent().siblings();
            contentWidth = curGroup.not('.e-contentbottom').width() + curGroup.parent().offset().left;
            if (this.model.enableRTL)
                contentWidth = curGroup.not('.e-contentbottom').width() + (this.element.width() + this.element.offset().left - curGroup.parent().offset().left);
            this.element.css({ "position": "relative" });
            $(resizeArea).css({ 'left': '' });
            if (contentWidth > this.element.width() + this.element.offset().left) {
                contentLeft = curGroup.parent().position().left - (contentWidth - (this.element.width() + this.element.offset().left));
                if (this.model.enableRTL)
                    contentLeft = this.element.width() + (this.element.offset().left - curGroup.parent().offset().left) - (contentWidth - (this.element.width() + this.element.offset().left - curGroup.parent().width()))
                rDivPadding = parseInt($(resizeArea).css('padding-left'), 10) + parseInt($(resizeArea).css('padding-right'), 10);
                if (this.model.enableRTL)
                    $(resizeArea).css({ right: contentLeft + rDivPadding - 1 });
                else
                    $(resizeArea).offset({ left: contentLeft - rDivPadding });
            }
            else
                if (this.model.enableRTL)
                    $(resizeArea).css({ right: this.element.width() + (this.element.offset().left - curGroup.parent().offset().left) - curGroup.parent().outerWidth() });
                else
                    $(resizeArea).offset({ left: curGroup.parent().position().left });
            if (this.element.find('.e-ribbonpin').length > 0)
                $(resizeArea).offset({ top: this.element.height() + this.element.find('.e-active-content').eq(0).height() });
            $(resizeArea).width(curGroup.not('.e-contentbottom').css("width"));
            $(resizeArea).append(curGroup.show()).show();
            if (this.element.hasClass("e-grpdivhide")) {
                this.element.removeClass("e-grpdivhide");
                this.element.find('.e-active-content').eq(0).addClass("e-resdivshow");
            }
            this._on($(document), "mousedown", this._rbndocumentClick);
        },
        _rbndocumentClick: function (e) {
            if (this.element.find('.e-resizediv').is(":visible") && $(e.target).parents('.e-resizediv').length <= 0 && $(e.target).parents('.e-rbn-ddl').length <= 0 && !$(e.target).hasClass('e-rbn-splitbtn') && $(e.target).parents('.e-colorpicker.e-ribbon:visible').length <= 0 && $(e.target).parents('.e-rbn-splitbtn:visible').length <= 0)
                this._resizeDivHide();
            if (this.element.find('.e-resizediv').is(':hidden'))
                this.element.find('.e-resizebtnselect').removeClass('e-resizebtnselect e-active');
        },
        _ribbonDocRightClick: function (e) {
            var resizeDiv, toolTip;
            resizeDiv = $(e.target).parents('.e-resizediv');
            if (resizeDiv.length <= 0)
                this._resizeDivHide();
            if (this.element.find('.e-resizediv').is(':hidden'))
                this.element.find('.e-resizebtnselect').removeClass('e-resizebtnselect e-active');
            if (this.element.find(".e-gallexpandcontent").hasClass('e-gallerypopupshow'))
                this._ribbonGalleryShow();
            if ($(this.element.find(".e-ribbonbackstagepage")).is(':visible'))
                this.element.find(".e-ribbonbackstagepage").hide();
            toolTip = this.element.find('.e-tooltipdiv');
            if (toolTip.is(':visible'))
                toolTip.hide();
        },
        _onTabDblClick: function (e) {
            if (this._phoneMode)
                return;
            if (this.element.find('.e-apptab .e-menu ul').is(":visible") || this.element.find('.e-ribbonbackstagepage').is(":visible"))
                return;
            if (!$(e.target).closest(".e-tab.e-disable").length) {
                if (this.element.find('.e-collapsed .e-rarrowup-2x').length)
                    this.expand();
                if (this.element.find('.e-expanded .e-rarrowup-2x').length)
                    this.collapse();
                if (this.element.find('.e-expanded.e-ribbonpin').length)
                    this._removeRibbonPin();
            }
            this._clickValue = e.type;
        },
        _ribbonhover: function (e) {
            if (!this._phoneMode)
                return;
            if (e.type == "mouseover") {
                if ($(e.currentTarget).hasClass("e-resizegroupdiv"))
                    $(e.currentTarget).addClass("e-reshover");
            }
            else if (e.type == "mouseout") {
                if ($(e.currentTarget).hasClass("e-resizegroupdiv e-reshover"))
                    $(e.currentTarget).removeClass("e-reshover");
            }

        },

        _wireEvents: function () {
            this._on($(document), "keydown", this._OnKeyDown);
            this._on(this.element, "keydown", this._ribbonKeyDown);
            this._on(this.element, "mouseover mouseout", ".e-resizegroupdiv", this._ribbonhover);
            this._on(this.element.find("#" + this._id + "_expandCollapse"), ej.eventType.click, this._tabExpandCollapse);
            this._on(this.element.find(".e-groupexpander"), ej.eventType.click, this._onGroupExpandClick);
            this._on(this.element.find(".e-qatmenuli"), ej.eventType.click, this._onQatMenuItemClick);
            this._on($(window), 'resize', this._ribbonWindowResize);
            this._on($(document), 'click', this._ribbonDocClick);
            this._on($(document), "contextmenu", this._ribbonDocRightClick);
            this._on(this.element.find('.e-header > li'), "dblclick", this._onTabDblClick);
        }
    });
    ej.Ribbon.alignType = {
        rows: "rows",
        columns: "columns"
    };
    ej.Ribbon.AlignType = {
        Rows: "rows",
        Columns: "columns"
    };
    ej.Ribbon.applicationTabType = {
        menu: "menu",
        backstage: "backstage"
    };
    ej.Ribbon.ApplicationTabType = {
        Menu: "menu",
        Backstage: "backstage"
    };
    ej.Ribbon.quickAccessMode = {
        none: "none",
        toolBar: "toolbar",
        menu: "menu"
    };
    ej.Ribbon.QuickAccessMode = {
        None: "none",
        ToolBar: "toolbar",
        Menu: "menu"
    };
    ej.Ribbon.type = {
        button: "button",
        splitButton: "splitbutton",
        dropDownList: "dropdownlist",
        custom: "custom",
        toggleButton: "togglebutton",
        gallery: "gallery"
    };
    ej.Ribbon.Type = {
        Button: "button",
        SplitButton: "splitbutton",
        DropDownList: "dropdownlist",
        Custom: "custom",
        ToggleButton: "togglebutton",
        Gallery: "gallery"
    };
    ej.Ribbon.customItemType = {
        button: "button",
        menu: "menu"
    };
    ej.Ribbon.CustomItemType = {
        Button: "button",
        Menu: "menu"
    };
    ej.Ribbon.itemType = {
        button: "button",
        tab: "tab"
    };
    ej.Ribbon.ItemType = {
        Button: "button",
        Tab: "tab"
    };

    ej.Ribbon.Locale = ej.Ribbon.Locale || {};

    ej.Ribbon.Locale['default'] = ej.Ribbon.Locale["en-US"] = {
        CustomizeQuickAccess: "Customize Quick Access Toolbar",
        RemoveFromQuickAccessToolbar: "Remove from Quick Access Toolbar",
        AddToQuickAccessToolbar: "Add to Quick Access Toolbar",
        ShowAboveTheRibbon: "Show Above the Ribbon",
        ShowBelowTheRibbon: "Show Below the Ribbon",
        MoreCommands: "More Commands..."
    };
})(jQuery, Syncfusion);