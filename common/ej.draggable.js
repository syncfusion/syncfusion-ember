/**
* @fileOverview Plugin to drag the html elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) { 
    ej.widget("ejDraggable", "ej.Draggable", {
        
        element: null,

        
        model: null,
        validTags: ["div", "span", "a"],

        
        defaults: {
            
            scope: 'default', 
            
            handle: null,  
            
            dragArea: null,
            
            clone: false,
            
            distance: 1, 
			
			dragOnTaphold: false,
            
            cursorAt: { top: -1, left: -2 }, 
            
            dragStart: null, 
            
            drag: null, 
            
            dragStop: null, 
			
			create: null,
            
            destroy: null, 
            
            helper: function () {
                return $('<div class="e-drag-helper" />').html("draggable").appendTo(document.body);
            }
        },

        
        _init: function () {
            this.handler = function () { },
			this.resizables = {};
            this._wireEvents();
            this._browser = ej.browserInfo();
            this._isIE8 = this._browser.name == "msie" && this._browser.version == "8.0";
            this._isIE9 = this._browser.name == "msie" && this._browser.version == "9.0";
            //e-pinch class enables the touch mode operations in IE browsers
            this._browser.name == "msie" && this.element.addClass("e-pinch");
            this._browser.name == "edge" && this.element.css("touch-action", "none");
        },

        _setModel: function (options) {
            for (var key in options) {
                switch (key) {
                    case "dragArea":
                        this.model.dragArea = options[key];
                        break;
						case "dragOnTaphold":
                        this.model.dragOnTaphold = options[key];
                        break; 
                }
            }
        },
        
        
        _destroy: function () {
            $(document)
                .off(ej.eventType.mouseUp, this._destroyHandler)
                .off(ej.eventType.mouseUp, this._dragStopHandler)
                .off(ej.eventType.mouseMove, this._dragStartHandler)
                .off(ej.eventType.mouseMove, this._dragHandler)
                .off("mouseleave", this._dragMouseOutHandler)
                .off('selectstart', false);

            

            ej.widgetBase.droppables[this.scope] = null;
            
        },

        _initialize: function (e) {
            if( e.target && e.target.nodeName && $( e.target ).closest( "input[type='text'], input[type='checkbox'], textarea, select, option" ).length) return true;
            var ori = e;
			e.preventDefault();
            e = this._getCoordinate(e);
            this.target = $(ori.currentTarget);
            this._initPosition = { x: e.pageX, y: e.pageY };
            
            $(document).on(ej.eventType.mouseMove, this._dragStartHandler).on(ej.eventType.mouseUp, this._destroyHandler);
            if (!this.model.clone) {
                var _offset = this.element.offset();
                this._relXposition = e.pageX - _offset.left;
                this._relYposition = e.pageY - _offset.top;
            }
            $(document.documentElement).trigger(ej.eventType.mouseDown, ori); // The next statement will prevent 'mousedown', so manually trigger it.
           //return false;
        },
        _setDragArea: function () {
            var _dragElement = $(this.model.dragArea)[0]; if (!_dragElement) return;
            var elementArea, elementWidthBound, elementHeightBound, elementArea, direction = ["left", "right", "bottom", "top"], top, left;
            if (!ej.isNullOrUndefined(_dragElement.getBoundingClientRect)) {
                elementArea = _dragElement.getBoundingClientRect();
                elementArea.width ? elementWidthBound = elementArea.width : elementWidthBound = elementArea.right - elementArea.left;
                elementArea.height ? elementHeightBound = elementArea.height : elementHeightBound = elementArea.bottom - elementArea.top;
                for (var j = 0; j < direction.length; j++) {
                    this["border-" + direction[j] + "-width"] = isNaN(parseFloat($($(this.model.dragArea)[0]).css("border-" + direction[j] + "-width"))) ? 0 : parseFloat($($(this.model.dragArea)[0]).css("border-" + direction[j] + "-width"));
                    this["padding-" + direction[j]] = isNaN(parseFloat($($(this.model.dragArea)[0]).css("padding-" + direction[j]))) ? 0 : parseFloat($($(this.model.dragArea)[0]).css("padding-" + direction[j]));
                }
                top = $(this.model.dragArea).offset().top; left = $(this.model.dragArea).offset().left;
            } else {
                elementWidthBound = $(this.model.dragArea).outerWidth();
                elementHeightBound = $(this.model.dragArea).outerHeight();
                for (var j = 0; j < direction.length; j++) {
                    this["border-" + direction[j] + "-width"] = 0;
                    this["padding-" + direction[j]] = 0;
                }
                top = left = 0;
            }
            this._left = ej.isNullOrUndefined($(this.model.dragArea).offset()) ? 0 + this["border-left-width"] + this["padding-left"] : left + this["border-left-width"] + this["padding-left"];
            this._top = ej.isNullOrUndefined($(this.model.dragArea).offset()) ? 0 + this["border-top-width"] + this["padding-top"] : top + this["border-top-width"] + this["padding-top"];
            this._right = left + elementWidthBound - [this["border-right-width"] + this["padding-right"]];
            this._bottom = top + elementHeightBound - [this["border-bottom-width"] + this["padding-bottom"]];
        },
        _dragStart: function (e) {
            if(e.type =="touchmove" || ( e.type =="mousemove" && ((e.buttons !== undefined ? e.buttons : e.which) == 1) || (this._isIE8 || this._isIE9))){
            var ori = e;
            e = this._getCoordinate(e);
            this.margins = {
                left: (parseInt(this.element.css("marginLeft"), 10) || 0),
                top: (parseInt(this.element.css("marginTop"), 10) || 0),
                right: (parseInt(this.element.css("marginRight"), 10) || 0),
                bottom: (parseInt(this.element.css("marginBottom"), 10) || 0)
            };
            this.offset = this.element.offset();
            this.offset = {
                top: this.offset.top - this.margins.top,
                left: this.offset.left - this.margins.left
            };
            this.position = this._getMousePosition(ori);
            var x = this._initPosition.x - e.pageX, y = this._initPosition.y - e.pageY;
            var distance = Math.sqrt((x * x) + (y * y));

            if (distance >= this.model.distance) {
			    var ele = this.model.helper({ sender: ori, element: this.target });
				if(!ele || ej.isNullOrUndefined(ele)) return;
                var dragTargetElmnt = this.model.handle = this.helper = ele;
                if (this.model.dragStart) {
                    var currTarget = null;
                    if (ori.type == 'touchmove') {
                        var coor = ori.originalEvent.changedTouches[0];
                        currTarget = document.elementFromPoint(coor.clientX, coor.clientY);
                    }
                    else currTarget = ori.originalEvent.target || ori.target;
					if(this.model.cursorAt["top"] == 0 && this.model.cursorAt["left"] ==0)
						currTarget = this._checkTargetElement(e) || currTarget;   
                    if (this._trigger("dragStart", { event: ori, element: this.element, target: currTarget, currentTarget: this._getCurrTarget(e)})) {
                        this._destroy();
                        return false;
                    }
                }
                if (this.model.dragArea) this._setDragArea();
                else {
                    this._left = this._top = this._right = this._bottom = 0;
                    this["border-top-width"] = this["border-left-width"] = 0;
                }
                
                if (!ej.isNullOrUndefined(dragTargetElmnt) && dragTargetElmnt.length > 0) {
                    var pos = dragTargetElmnt.offsetParent().offset();
                    $(document).off(ej.eventType.mouseMove, this._dragStartHandler).off(ej.eventType.mouseUp, this._destroyHandler)
                        .on(ej.eventType.mouseMove, this._dragHandler).on(ej.eventType.mouseUp, this._dragStopHandler).on("mouseleave", this._dragMouseOutHandler).on("selectstart", false);
                    ej.widgetBase.droppables[this.model.scope] = {
                        draggable: this.element,
                        helper: dragTargetElmnt.css({ position: 'absolute', left: (this.position.left - pos.left), top: (this.position.top - pos.top) }),
                        destroy: this._destroyHandler
                    }
                }
            }
            }
        },

        _drag: function (e) {
            var left, top, pageX, pageY;
			e.preventDefault();
            this.position = this._getMousePosition(e);
            if (this.position.top < 0)
                this.position.top = 0;
            if ($(document).height() < this.position.top)
                this.position.top = $(document).height();
            if ($(document).width() < this.position.left)
                this.position.left = $(document).width();
            var helperElement = ej.widgetBase.droppables[this.model.scope].helper;
            if (this.model.drag) {
                var currTarget = null;
                if (e.type == 'touchmove') {
                    var coor = e.originalEvent.changedTouches[0];
                    currTarget = document.elementFromPoint(coor.clientX, coor.clientY);
                }
                else currTarget = e.originalEvent.target || e.target;
				if(this.model.cursorAt["top"] == 0 && this.model.cursorAt["left"] ==0 )
                    currTarget = this._checkTargetElement(e)|| currTarget; 
                this._trigger("drag", { event: e, element: this.target, target: currTarget, currentTarget: this._getCurrTarget(e) });// Raise the dragging event
            }
            var element = this._checkTargetElement(e);
            if (!ej.isNullOrUndefined(element)) {
                e.target = e.toElement = element;
                element.object._over(e); 
                this._hoverTarget = element; 
            }
            else if (this._hoverTarget) {
                e.target = e.toElement = this._hoverTarget;
                this._hoverTarget.object._out(e);
                this._hoverTarget = null;
            }
            var helperElement = ej.widgetBase.droppables[this.model.scope].helper;
			var pos= helperElement.offsetParent().offset();			 
            pageX = ej.isNullOrUndefined(e.pageX) || e.pageX === 0 ? e.originalEvent.changedTouches[0].pageX : e.pageX;
            pageY = ej.isNullOrUndefined(e.pageY) || e.pageY === 0 ? e.originalEvent.changedTouches[0].pageY : e.pageY;
            if (this.model.dragArea) {
                if (this._pageX != pageX) {
                    if (this._left > this.position.left) left = this._left;
                    else if (this._right < this.position.left + helperElement.outerWidth(true)) left = this._right - helperElement.outerWidth(true);
                    else left = this.position.left;
                }
                if (this._pageY != pageY) {
                    if (this._top > this.position.top) top = this._top;
                    else if (this._bottom < this.position.top + helperElement.outerHeight(true)) top = this._bottom - helperElement.outerHeight(true);
                    else top = this.position.top;
                }
            }
            else {
                left = this.position.left;
                top = this.position.top;
            }
            if (top < 0 || top - [pos.top + this["border-top-width"]] < 0) top = [pos.top + this["border-top-width"]];
            if (left < 0 || left - [pos.left + this["border-left-width"]] < 0) left = [pos.left + this["border-left-width"]];
            helperElement.css({ left: left - [pos.left + this["border-left-width"]], top: top - [pos.top + this["border-top-width"]] });
            this.position.left = left;
            this.position.top = top;
            this._pageX = pageX;
            this._pageY = pageY;
        },

        _dragStop: function (e) {
            if (e.type == 'mouseup' || e.type == 'touchend') 
                this._destroy(e);
            if (this.model.dragStop) {
                var currTarget = null;
                if (e.type == 'touchend') {
                if(this.model.cursorAt["top"] == 0 && this.model.cursorAt["left"] ==0)
				currTarget = e.originalEvent.target || e.target;  
                else{
                    var coor = e.originalEvent.changedTouches[0];
                    currTarget = document.elementFromPoint(coor.clientX, coor.clientY);
                }  
                }
                else currTarget = e.originalEvent.target || e.target;                
                if(this.model.cursorAt["top"] == 0 && this.model.cursorAt["left"] ==0)
                    currTarget = this._checkTargetElement(e) || currTarget;              
                this._trigger("dragStop", { event: e, element: this.target, target: currTarget, currentTarget: this._getCurrTarget(e) });// Raise the dragstop event
            }
            this._dragEnd(e);
        },
        _dragEnd: function (e) {
            var element = this._checkTargetElement(e);
            if (!ej.isNullOrUndefined(element)) {
                e.target = e.toElement = element;
                element.object._drop(e, this.element);
            }
        },

        _dragMouseEnter: function (e) {
            $(document).off("mouseenter", this._dragMouseEnterHandler);
            if (this._isIE9)
                this._dragManualStop(e);
            else if (this._isIE8) {
                if (e.button == 0)
                    this._dragManualStop(e);
            }
            else if (e.buttons == 0)
                this._dragManualStop(e);
        },

        _dragManualStop: function (e) {
            if (this.model.dragStop != null)
                this._trigger("dragStop", { event: e, element: this.target, target: e.originalEvent.target || e.target, currentTarget: this._getCurrTarget(e) });  // Raise the dragstop event
            this._destroy(e);
        },

        _dragMouseOut: function (e) {
            $(document).on("mouseenter", this._dragMouseEnterHandler);
        },

        _checkTargetElement:function(e)
        {
            var target ;
			if (e.type == "touchmove" || e.type == "touchstart" || e.type == "touchend" || e.type=="taphold") {
				var coor = e.originalEvent.changedTouches[0];
				target = document.elementFromPoint(coor.clientX, coor.clientY);
			}
			else
				target = e.target;
            if (this.helper && this._contains(this.helper[0], target)) {
                this.helper.hide();
                target = this._elementUnderCursor(e);
                this.helper.show();
                return this._withDropElement(target);
            }
            return this._withDropElement(target);
        },
        _getCurrTarget: function(e) {
            var target = (e.originalEvent && e.originalEvent.target) || e.target;
            if(!ej.isNullOrUndefined(target.style)){
            var styleVal = target.style.display;
            if (this.element.is(target))
                target.style.display = "none";
			var currTarget = null;
			if((!ej.isNullOrUndefined(e.pageX)) && !(ej.isNullOrUndefined(e.pageY)))
				currTarget = document.elementFromPoint(e.pageX, e.pageY);
            target.style.display = styleVal;
            return currTarget;
            }
        },
        _withDropElement:function(target)
        {
            if (target) {
                var dropObj = $(target).data('ejDroppable');
                if (ej.isNullOrUndefined(dropObj)) dropObj = this._checkParentElement($(target));
                if (!ej.isNullOrUndefined(dropObj)) {
                    return $.extend(target, { object: dropObj });
                }
            }
        },
        _checkParentElement: function (element) {
            var target = $(element).closest('.e-droppable');
            if (target.length > 0) {
                var dropObj = $(target).data('ejDroppable');
                if (!ej.isNullOrUndefined(dropObj)) return dropObj;
            }
        },
        _elementUnderCursor:function(e){
            if(e.type == "touchmove" || e.type == "touchstart" || e.type == "touchend" || e.type=="taphold")
                return document.elementFromPoint(e.originalEvent.changedTouches[0].clientX, e.originalEvent.changedTouches[0].clientY);
            else return document.elementFromPoint(e.clientX, e.clientY);
        },
        _contains:function(parent, child) {
            try {
                return $.contains(parent, child) || parent == child;
            } catch (e) {
                    return false;
                }
        },
        _wireEvents: function () {
			if(ej.isDevice()==true && this.model.dragOnTaphold==true)
            this._on(this.element, "taphold", this._initialize);
		else
            this._on(this.element, ej.eventType.mouseDown, this._initialize);
            this._dragStartHandler = $.proxy(this._dragStart, this);
            this._destroyHandler = $.proxy(this._destroy, this);
            this._dragStopHandler = $.proxy(this._dragStop, this);
            this._dragHandler = $.proxy(this._drag, this);
            this._dragMouseEnterHandler = $.proxy(this._dragMouseEnter, this);
            this._dragMouseOutHandler = $.proxy(this._dragMouseOut, this);
        },
        _getMousePosition: function (event) {
            event = this._getCoordinate(event);
            var pageX = this.model.clone ? event.pageX : event.pageX - this._relXposition;
            var pageY = this.model.clone ? event.pageY : event.pageY - this._relYposition;
            return { left: pageX - [this.margins.left + this.model.cursorAt.left ], top: pageY - [this.margins.top + this.model.cursorAt.top ] };
        },
        _getCoordinate: function (evt) {
            var coor = evt;
            if (evt.type == "touchmove" || evt.type == "touchstart" || evt.type == "touchend" || evt.type== "taphold" && ej.browserInfo().name !="msie")
                coor = evt.originalEvent.changedTouches[0];
            return coor;
        }
    });

})(jQuery, Syncfusion);

/**
* @fileOverview Plugin to drop the html elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) { 
    ej.widget("ejDroppable", "ej.Droppable", {
        
        element: null,        
        model: null,
        validTags: ["div", "span", "a"],
        dropElements : [],
        defaults: {
            
            accept: null,
            
            scope: 'default',
            
            drop: null,
            
            over: null,
            
            out: null,
			
			create: null,
            
            destroy: null
        },

        
        _init: function () {
            this._mouseOver = false;
			this.dropElements.push(this);
        },

        _setModel: function (options) {

        },
        
        
        _destroy: function () {
			 $(this.element).off('mouseup', $.proxy(this._drop, this));
        },

        _over: function (e) {
            if (!this._mouseOver) {
                this._trigger("over", e);
                this._mouseOver = true;
            }
        },
        _out: function (e) {
            if (this._mouseOver) {
                this._trigger("out", e);
                this._mouseOver = false;
            }
        },
        _drop: function (e, dragElement) {
			var _target = e.target; 
			var _parents = $(_target).parents(".e-droppable");
			if($(_target).hasClass("e-droppable")) _parents.push(_target);
			for (var i =0; i< this.dropElements.length; i++ ){
				if ($(_parents).is($(this.dropElements[i].element)))
					this.dropElements[i]._dropEvent.call( this.dropElements[i], e, dragElement );
			}
        },
		_dropEvent : function (e, dragElement){
			var drag = ej.widgetBase.droppables[this.model.scope];
            var isDragged = !ej.isNullOrUndefined(drag.helper) && drag.helper.is(":visible");
			if(isDragged && e.type == "touchend") $(drag.helper).hide();
            var area = this._isDropArea(e);
			if(isDragged && e.type == "touchend") $(drag.helper).show();
            if (drag && !ej.isNullOrUndefined(this.model.drop) && isDragged && area.canDrop) {
                this.model.drop($.extend(e, { dropTarget: area.target , dragElement : dragElement }, true), drag);
            }
		},
        _isDropArea: function (e) {
            // check for touch devices only
            var area = { canDrop: true, target: $(e.target) };
            if (e.type == "touchend") {
                var coor = e.originalEvent.changedTouches[0], _target;
                _target = document.elementFromPoint(coor.clientX, coor.clientY);
                area.canDrop = false;
                var _parents = $(_target).parents();

                for (var i = 0; i < this.element.length; i++) {
                    if ($(_target).is($(this.element[i]))) area = { canDrop: true, target: $(_target) };
                    else for (var j = 0; j < _parents.length; j++) {
                        if ($(this.element[i]).is($(_parents[j]))) {
                            area = { canDrop: true, target: $(_target) };
                            break;
                        }
                    }
                    if (area.canDrop) break;
                }
            }
            return area;
        }
    });

})(jQuery, Syncfusion);

/**
* @fileOverview Plugin to resize the Html elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) { 
    ej.widget("ejResizable", "ej.resizable", {
        
        element: null,        
        model: null,
        validTags: ["div", "span", "a"],
        
        defaults: {
            
            scope: 'default',
            
            handle: null,
            
            distance: 1,
            
            maxHeight: null,
            
            maxWidth: null,
            
            minHeight: 10,
            
            minWidth: 10,
            
            cursorAt: { top: 1, left: 1 },
            
            resizeStart: null,
            
            resize: null,
            
            resizeStop: null,
			
			create: null,
            
            destroy: null,
            
            helper: function () {
                return $('<div class="e-resize-helper" />').html("resizable").appendTo(document.body);
            }
        },
        
        _init: function () {
            this.target = this.element;
            this._browser = ej.browserInfo();
            this._isIE8 = this._browser.name == "msie" && this._browser.version == "8.0";
            this._isIE9 = this._browser.name == "msie" && this._browser.version == "9.0";
            if (this.handle != null) {
                $(this.target).delegate(this.handle, ej.eventType.mouseDown, $.proxy(this._mousedown, this))
                .delegate(this.handle, 'resizestart', this._blockDefaultActions);
            }
            else {
                $(this.target).on(ej.eventType.mouseDown, $.proxy(this._mousedown, this));                                
            }
            this._resizeStartHandler = $.proxy(this._resizeStart, this);
            this._destroyHandler = $.proxy(this._destroy, this);
            this._resizeStopHandler = $.proxy(this._resizeStop, this);
            this._resizeHandler = $.proxy(this._resize, this);
            this._resizeMouseEnterHandler = $.proxy(this._resizeMouseEnter, this);
        },
        _mouseover: function (e) {
            if ($(e.target).hasClass("e-resizable")) {
                $(e.target).css({ cursor: "se-resize" });
                $(this.target).on(ej.eventType.mouseDown, $.proxy(this._mousedown, this));
            }
            else {
                $(this.target).off(ej.eventType.mouseDown);
                $(this.target).css({ cursor: "" });
            }
        },
        _blockDefaultActions: function (e) {
            e.cancelBubble = true;
            e.returnValue = false;
            if (e.preventDefault) e.preventDefault();
            if (e.stopPropagation) e.stopPropagation();
        },
        _setModel: function (options) {

        },
        _mousedown: function (e) {
            var ori = e;
            e = this._getCoordinate(e);
            this.target = $(ori.currentTarget);
            this._initPosition = { x: e.pageX, y: e.pageY };
            this._pageX = e.pageX;
            this._pageY = e.pageY;

            $(document).on(ej.eventType.mouseMove, this._resizeStartHandler).on(ej.eventType.mouseUp, this._destroyHandler);

            $(document.documentElement).trigger(ej.eventType.mouseDown, ori); // The next statement will prevent 'mousedown', so manually trigger it.
            return false;
        },

        _resizeStart: function (e) {
            if ($(e.target).hasClass("e-resizable")) {
                e = this._getCoordinate(e);
                var x = this._initPosition.x - e.pageX, y = this._initPosition.y - e.pageY, _width, _height;
                var distance = Math.sqrt((x * x) + (y * y));
                if (distance >= this.model.distance) {
                    if (this.model.resizeStart != null) 
                        if (this._trigger("resizeStart", { event: e, element: this.target }))  // Raise the resize start event
                            return;
                    var resizeTargetElmnt = this.model.helper({ element: this.target });
                    _width = (e.pageX - this._pageX) + resizeTargetElmnt.outerWidth();
                    _height = (e.pageY - this._pageY) + resizeTargetElmnt.outerHeight();
                    this._pageX = e.pageX;
                    this._pageY = e.pageY;
                    var pos = this.getElementPosition(resizeTargetElmnt);
                    $(document).off(ej.eventType.mouseMove, this._resizeStartHandler).off(ej.eventType.mouseUp, this._destroyHandler)
                        .on(ej.eventType.mouseMove, this._resizeHandler).on(ej.eventType.mouseUp, this._resizeStopHandler).on("mouseenter", this._resizeMouseEnterHandler).on("selectstart", false);
                    ej.widgetBase.resizables[this.scope] = {
                        resizable: this.target,
                        helper: resizeTargetElmnt.css({ width: _width, height: _height }),
                        destroy: this._destroyHandler
                    }
                }
            }
        },

        _resize: function (e) {
            var _width, _height, _diff;
            e = this._getCoordinate(e);
            var pos = this.getElementPosition(ej.widgetBase.resizables[this.scope].helper);
            var resizeTargetElmnt = this.model.helper({ element: this.target });
            _width = (e.pageX - this._pageX) + resizeTargetElmnt.outerWidth();
            _height = (e.pageY - this._pageY) + resizeTargetElmnt.outerHeight();
            this._pageX = e.pageX;
            this._pageY = e.pageY;
            if (_width < this.model.minWidth) {
                _diff = this.model.minWidth - _width;
                _width = this.model.minWidth;
                this._pageX = e.pageX + _diff;
            }
            if (_height < this.model.minHeight) {
                _diff = this.model.minHeight - _height;
                _height = this.model.minHeight;
                this._pageY = e.pageY + _diff;
            }
            if (this.model.maxHeight != null && _height > this.model.maxHeight) {
                _diff = _height - this.model.maxHeight;
                _height = this.model.maxHeight;
                this._pageY = e.pageY - _diff;
            }
            if (this.model.maxWidth != null && _width > this.model.maxWidth) {
                _diff = _width - this.model.maxWidth;
                _width = this.model.maxWidth;
                this._pageX = e.pageX - _diff;
            }
            ej.widgetBase.resizables[this.scope].helper.css({ width: _width, height: _height });
            this._trigger("resize", { element: this.target }) // Raise the resize event
        },

        _resizeStop: function (e) {
            if (this.model.resizeStop != null)
                this._trigger("resizeStop", { element: this.target });  // Raise the resize stop event
            if (e.type == 'mouseup' || e.type == 'touchend')
                this._destroy(e);
        },

        _resizeMouseEnter: function (e) {
            if (this._isIE9)
                this._resizeManualStop(e);
            else if (this._isIE8) {
                if (e.button == 0)
                    this._resizeManualStop(e);
            }
            else if (e.buttons == 0)
                this._resizeManualStop(e);
        },

        _resizeManualStop: function (e) {
            if (this.model.resizeStop != null)
                this._trigger("resizeStop", { element: this.target });  // Raise the resize stop event
            this._destroy(e);
        },

        
        _destroy: function (e) {
            $(document)
                .off(ej.eventType.mouseUp, this._destroyHandler)
                .off(ej.eventType.mouseUp, this._resizeStopHandler)
                .off(ej.eventType.mouseMove, this._resizeStartHandler)
                .off(ej.eventType.mouseMove, this._resizeHandler)
                .off("mouseenter", this._resizeMouseEnterHandler)
                .off('selectstart', false);            
            ej.widgetBase.resizables[this.scope] = null;
            
        },

        getElementPosition: function (elemnt) {
            if (elemnt != null && elemnt.length > 0)
                return {
                    left: elemnt[0].offsetLeft,
                    top: elemnt[0].offsetTop
                };
            else
                return null;
        },
        _getCoordinate: function (evt) {
            var coor = evt;
            if (evt.type == "touchmove" || evt.type == "touchstart" || evt.type == "touchend")
                coor = evt.originalEvent.changedTouches[0];
            return coor;
        }
    });

})(jQuery, Syncfusion);