var eAnimation = eAnimation || {};
ejAnimation = {};

$.fn.ejAnimation = function (effectName, duration, easing) {
    var _deferred = $.Deferred();
    new eAnimation(this, effectName, duration, easing).done(function (ele) {
        return _deferred.resolve(ele);
    });
    return _deferred.promise();
}
eAnimation = function (ele, effectName, duration, easing) {
    this._deferred = $.Deferred();
    this._initAnimation(ele, effectName, duration, easing)
    return this._deferred.promise(this);
}
eAnimation.prototype = {
    _initAnimation: function (ele, effectName, duration, easing) {
        var ele = $(ele),
            $proxy = this;
        duration = duration ? duration : 400;
        easing = easing ? easing : ejAnimation.Easing.Ease;
        ele.off(ej.animationEndEvent());
        if (effectName == "rippleEffect") {
            this._createRippleSpan(ele);
            ej.listenTouchEvent(ele.addClass("e-ripple-parent"),ej.startEvent(), $.proxy(this._rippleAnimation, this));
        } else if (effectName == "stop" || effectName == "stopAnimation") {
            this.stopAnimation(ele);
        } else {
            ele.addClass("in-animation").on(ej.animationEndEvent(), function (evt) {
                ele.css("animation", "").removeClass("in-animation");
                ele.off(ej.animationEndEvent());
                return $proxy._deferred.resolve(ele);
            });
            ele.css((ej.userAgent() ? "-" + ej.userAgent() + "-" : "") + "animation", effectName + " " + duration + "ms " + easing);
        }
    },
    stopAnimation: function (ele) {
        ele.css((ej.userAgent() ? "-" + ej.userAgent() + "-" : "") + "animation", "").removeClass("in-animation");
        this._deferred.resolve(ele);
    },
    _rippleAnimation: function (e) {
       var point = e.changedTouches ? e.changedTouches[0] : e;
        var target = e.target,
            ele = $(e.currentTarget),
            $proxy = this,
            rect = target.getBoundingClientRect();
        ele.on(ej.animationEndEvent(), function (evt) {
            $(ripple).css("animation", "");
            return $proxy._deferred.resolve(this);
            ele.off(ej.animationEndEvent());
        });
        var effectEle = $(e.target).closest(".e-ripple");
        if (!effectEle.length) {
            effectEle = e.target;
        } else {
            effectEle = effectEle[0];
            rect = effectEle.getBoundingClientRect();
        }
        if ($(effectEle).hasClass("e-ripple")) {
            ripple = this._createRippleSpan(ele);
            $(ripple).appendTo(effectEle);
            ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + 'px';
            var top = point.pageY - rect.top - ripple.offsetHeight / 2 - document.body.scrollTop;
            var left = point.pageX - rect.left - ripple.offsetWidth / 2 - document.body.scrollLeft;
            ripple.style.top = top + 'px';
            ripple.style.left = left + 'px';
            $(ripple).css("animation", "ripple .5s ease-out");
        }
    },
    _createRippleSpan: function (ele) {
        ripple = ele.find('.ripple')[0];
        if (!ripple) {
            ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.height = ripple.style.width = "100%";
            ele[0].appendChild(ripple);
        }
        return ripple;
    }
};

ejAnimation.Effect = {
    SlideLeftIn: "slideLeftIn",
    SlideLeftOut: "slideLeftOut",
    SlideRightIn: "slideRightIn",
    SlideRightOut: "slideRightOut",
    SlideTopIn: "slideTopIn",
    SlideTopOut: "slideTopOut",
    SlideBottomIn: "slideBottomIn",
    SlideBottomOut: "slideBottomOut",
    SlideLeft: "slideLeft",
    SlideRight: "slideRight",
    SlideUp: "slideUp",
    SlideDown: "slideDown",
    FadeIn: "fadeIn",
    FadeOut: "fadeOut",
    FadeZoomIn: "fadeZoomIn",
    FadeZoomOut: "fadeZoomOut",
    ZoomIn: "zoomIn",
    ZoomOut: "zoomOut",
    FlipRightDownIn: "flipRightDownIn",
    FlipRightDownOut: "flipRightDownOut",
    FlipRightUpIn: "flipRightUpIn",
    FlipRightUpOut: "flipRightUpOut",
    FlipLeftDownIn: "flipLeftDownIn",
    FlipLeftDownOut: "flipLeftDownOut",
    FlipLeftUpIn: "flipLeftUpIn",
    FlipLeftUpOut: "flipLeftUpOut",
    FlipYRightIn: "flipYRightIn",
    FlipYRightOut: "flipYRightOut",
    FlipYLeftIn: "flipYLeftIn",
    FlipYLeftOut: "flipYLeftOut",
    FlipXUpIn: "flipXUpIn",
    FlipXUpOut: "flipXUpOut",
    FlipXDownIn: "flipXDownIn",
    FlipXDownOut: "flipXDownOut",
    RippleEffect: "rippleEffect"
}

ejAnimation.Easing = {
    Ease: "cubic-bezier(0.250, 0.100, 0.250, 1.000)",
    Linear: "cubic-bezier(0.250, 0.250, 0.750, 0.750)",
    Easein: "cubic-bezier(0.420, 0.000, 1.000, 1.000)",
    EaseOut: "cubic-bezier(0.000, 0.000, 0.580, 1.000)",
    EaseInOut: "cubic-bezier(0.420, 0.000, 0.580, 1.000)",
    Bounce: "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
    ElasticInOut: "cubic-bezier(0.5,-0.58,0.38,1.81)",
    ElasticIn: "cubic-bezier(0.17,0.67,0.59,1.81)",
    ElasticOut: "cubic-bezier(0.7,-0.75,0.99,1.01)",

}