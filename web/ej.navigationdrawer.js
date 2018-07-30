/**
* @fileOverview Plugin to style the Html Navigation Drawer elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    ej.widget("ejNavigationDrawer", "ej.NavigationDrawer", {

        _setFirst: true,
        validTags: ["div"],
        _rootCSS: "e-nb e-js",
        _prefixClass: "e-",

        defaults: {
            isPaneOpen: false
        },

        dataTypes: {
            isPaneOpen: "boolean"
        },

        _init: function () {
            this._load();
            this._renderControl();
            this._renderEJMControls();
            this._createDelegate();
            this._wireEvents();
        },

        _load: function () {
            this._browser = this._getBrowserAgent();
            if (this.model.position == "normal") {
                if (!this.model.isPaneOpen) {
                    this._elementWrapper = ej.buildTag("div#" + this._id + "_WrapContainer", {}, {}, { "class": this._rootCSS + " e-nb-container e-nb-" + this.model.direction.toLowerCase() });
                    this.element.wrapAll(this._elementWrapper);
                    this._nbHome = $("#" + this._id + "_WrapContainer").parent();
                }
                else {
                    this.element.siblings().wrapAll("<div id='" + this._id + "_PageContainer' class='e-nb-container e-nb-pageContainer'></div>")
                    this._pageContainer = this._nbHome = this.element.siblings();
                }
            }
            else {
                this._nbHome = $("body");
                this.element.appendTo(this._nbHome);
            }
            this._nbHomeCss = this._nbHome.clone(true)[0].style;
        },

        _renderEJMControls: function () {
            if (this.model.enableListView) {
                this._lb = ej.buildTag("div#" + this._id + "_listview", {}, {}, { "class": "e-nb-listview" });
                if (this.model.items.length || this.model.listViewSettings.dataSource.length)
                    this._lb.appendTo(this.element);
                else
                    this.element.find(">ul").wrapAll(this._lb);
                this._lb = $("#" + this._id + "_listview");
                if (!this.model.listViewSettings["width"])
                    this.model.listViewSettings["width"] = 240;
                this.model.listViewSettings.items = this.model.items;
                this._lb.ejListView($.extend({}, this.model.listViewSettings, { loadComplete: $.proxy(this._setLayout, this) }));
                this._lbObj = this._lb.data("ejListView"); 
                this._lb.ejListView("selectItem", this.model.listViewSettings.selectedItemIndex);
            }
			else
				this.element.find(".e-nb-listview").empty();
        },

        _setModel: function (options) {
            var refresh = false;
            for (var prop in options) {
                switch (prop) {
                    case "width":
                        this._setWidth();
                        this._setLayout();
                        break;
                    case "direction":
                        this._setLayout();
                        break;
                    case "type":
                        this._transform(0, 0, true);
                        this._transform(0, 0, false);
                        break;
                    case "isPaneOpen":
                        this.model[prop] = options[prop];
						this.element.hide();
						if(options[prop]) {
							$(this._elementWrapper,this._elementShadow,this._elementOverlay).remove();
							this.element.removeAttr("style").height("100%");
							this.element.unwrap();
						}
						else{
							this._pageContainer.children().unwrap();
							this._pageContainer.remove();
						}
						this._load();
						this._shadowWrapper();
						if (this.model.enableListView) this._renderEJMControls();
						this._wireEvents();
						break;
					case "enableListView":
					    this._renderEJMControls();
						break;
                    default:
                        refresh = true;
                }
                if (refresh) { this._refresh(); }
            }
        },

        _destroyEJMPlugin: function () {
            if (this._lb) {
                this._lb.ejListView("destroy");
                this._lb.children().unwrap();
            }
            if (this.model.contentId) $("#" + this.model.contentId).empty();
			if (this._id) $("#"+this._id).hide();
        },

        _getBrowserAgent: function () {
            return (/webkit/i).test(navigator.appVersion) ? 'webkit' : (/firefox/i).test(navigator.userAgent) ? 'Moz' : (/trident/i).test(navigator.userAgent) ? 'ms' : 'opera' in window ? 'O' : '';
        }

    });
    $.extend(true, ej.NavigationDrawer.prototype, ej.NavigationDrawerBase.prototype);
    $.extend(true, ej.NavigationDrawer.prototype.defaults.listViewSettings, ej.ListView.prototype.defaults);
    ej.NavigationDrawer.prototype._tags = ej.ListView.prototype._tags;

})(jQuery, Syncfusion);
